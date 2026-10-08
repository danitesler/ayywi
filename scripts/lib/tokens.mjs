import { existsSync, readdirSync, readFileSync } from "node:fs";
import { basename, join } from "node:path";

export const PREFIX = "ayy";
export const DENSITIES = ["compact", "comfortable", "touch"];
/** The two base themes. Every other theme (tokens/themes/*.json) builds on one of them. */
export const BASE_THEMES = [
  { name: "dark", base: "dark", description: "The default: near-black background, white text." },
  { name: "light", base: "light", description: "White background, near-black text." },
];
const REF = /^\{([^}]+)\}$/;

function flatten(source, file = "tokens.json") {
  const out = [];
  (function walk(node, path) {
    // A group can sort its direct tokens into categories: $extensions.ayywi.categories = { Label: [keys] }.
    const categories = node.$extensions?.ayywi?.categories;
    const categoryOf = new Map();
    if (categories) {
      for (const [label, keys] of Object.entries(categories)) {
        for (const key of keys) {
          if (!(key in node)) throw new Error(`${file}: category "${label}" lists ${[...path, key].join(".")}, which doesn't exist`);
          if (categoryOf.has(key)) throw new Error(`${file}: ${[...path, key].join(".")} is in two categories`);
          categoryOf.set(key, label);
        }
      }
    }
    for (const [key, value] of Object.entries(node)) {
      if (key.startsWith("$")) continue;
      const next = [...path, key];
      if (value && typeof value === "object" && "$value" in value) {
        if (categories && !categoryOf.has(key)) throw new Error(`${file}: ${next.join(".")} needs a category (${Object.keys(categories).join(", ")})`);
        const ext = value.$extensions?.ayywi ?? {};
        out.push({
          name: next.join("."),
          cssVar: `--${PREFIX}-${next.join("-")}`,
          type: value.$type,
          value: value.$value,
          light: ext.light,
          css: ext.css,
          density: ext.density,
          category: categoryOf.get(key),
          description: value.$description,
        });
      } else if (value && typeof value === "object") {
        walk(value, next);
      }
    }
  })(source, []);
  return out;
}

/** Read tokens/<dir>/*.json as { name, source } in name order. */
function readDir(root, dir) {
  const path = join(root, "tokens", dir);
  if (!existsSync(path)) return [];
  return readdirSync(path)
    .filter((f) => f.endsWith(".json"))
    .sort()
    .map((file) => ({ file: `tokens/${dir}/${file}`, name: basename(file, ".json"), source: JSON.parse(readFileSync(join(path, file), "utf8")) }));
}

/** Flattened tokens from tokens/tokens.json (file order). */
export function loadTokens(root) {
  const tokens = flatten(JSON.parse(readFileSync(join(root, "tokens/tokens.json"), "utf8")));
  const byName = new Map(tokens.map((t) => [t.name, t]));

  for (const t of tokens) {
    if (t.light !== undefined && t.density !== undefined) throw new Error(`${t.name}: a token can't be both themed and density-aware`);
  }

  function refOf(value) {
    const m = typeof value === "string" ? value.match(REF) : null;
    if (!m) return null;
    if (!byName.has(m[1])) throw new Error(`Unknown token reference ${value}`);
    return byName.get(m[1]);
  }

  /** Follow references to a concrete value. */
  function resolve(value, seen = new Set()) {
    const ref = refOf(value);
    if (!ref) return value;
    if (seen.has(ref.name)) throw new Error(`Circular token reference ${value}`);
    seen.add(ref.name);
    return resolve(ref.value, seen);
  }

  /** CSS for a value: references become var(), cubic-beziers and font lists are formatted. */
  function toCss(value, type) {
    const ref = refOf(value);
    if (ref) return `var(${ref.cssVar})`;
    if (Array.isArray(value)) {
      if (type === "cubicBezier") return `cubic-bezier(${value.join(", ")})`;
      return value.map((f) => (/\s/.test(f) ? `"${f}"` : f)).join(", ");
    }
    return String(value);
  }

  // ---- Extra themes: each overrides some themed tokens of a base theme ("dark" or "light").
  const extraThemes = readDir(root, "themes").map(({ file, name, source }) => {
    const base = source.$extensions?.ayywi?.base;
    if (!BASE_THEMES.some((b) => b.name === base)) throw new Error(`${file}: $extensions.ayywi.base must be "dark" or "light"`);
    // The name starts with its base, so [data-theme^="dark"] selects every dark theme.
    if (!new RegExp(`^${base}-[a-z0-9]+(-[a-z0-9]+)*$`).test(name)) throw new Error(`${file}: a ${base}-based theme must be named "${base}-<name>" in kebab-case`);
    const overrides = flatten(source, file);
    for (const o of overrides) {
      const t = byName.get(o.name);
      if (!t) throw new Error(`${file}: ${o.name} is not a token`);
      if (t.light === undefined || t.css !== undefined) throw new Error(`${file}: ${o.name} isn't a themed source token — themes can only override tokens that have a light value and no css formula`);
      if (o.light !== undefined) throw new Error(`${file}: ${o.name} — a theme sets one value, not a light one`);
      resolve(o.value);
      o.cssVar = t.cssVar;
      o.type = t.type;
    }
    return { name, base, description: source.$description, overrides, byName: new Map(overrides.map((o) => [o.name, o])) };
  });
  const themes = [...BASE_THEMES, ...extraThemes];

  /** Raw (unresolved) value of a token in any theme; references stay as {refs}. */
  function rawIn(t, theme) {
    const extra = extraThemes.find((x) => x.name === theme);
    if (extra) return extra.byName.get(t.name)?.value ?? rawIn(t, extra.base);
    if (theme !== "dark" && theme !== "light") throw new Error(`Unknown theme ${theme}`);
    return theme === "light" && t.light !== undefined ? t.light : t.value;
  }

  /** Concrete value of a token in a theme ("dark", "light", "dark-contrast"…). */
  function valueIn(t, theme) {
    return resolve(rawIn(t, theme));
  }

  // ---- Brands (tokens/brands/*.json): inputs for createBrand() in src/brand.ts, which does the colour work.
  const brands = readDir(root, "brands").map(({ file, name, source }) => {
    if (source.name !== name) throw new Error(`${file}: "name" must be "${name}", the file's name`);
    if (typeof source.color !== "string") throw new Error(`${file}: "color" (the seed, #rrggbb) is required`);
    const input = Object.fromEntries(Object.entries(source).filter(([k]) => !k.startsWith("$")));
    if (source.$description) input.description = source.$description;
    return { file, name, input };
  });

  return { tokens, byName, resolve, toCss, rawIn, valueIn, themes, brands };
}
