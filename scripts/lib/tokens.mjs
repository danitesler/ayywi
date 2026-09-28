import { existsSync, readdirSync, readFileSync } from "node:fs";
import { basename, join } from "node:path";

export const PREFIX = "ayy";
export const DENSITIES = ["compact", "comfortable", "touch"];
const REF = /^\{([^}]+)\}$/;

function flatten(source) {
  const out = [];
  (function walk(node, path) {
    for (const [key, value] of Object.entries(node)) {
      if (key.startsWith("$")) continue;
      const next = [...path, key];
      if (value && typeof value === "object" && "$value" in value) {
        const ext = value.$extensions?.ayywi ?? {};
        out.push({
          name: next.join("."),
          cssVar: `--${PREFIX}-${next.join("-")}`,
          type: value.$type,
          value: value.$value,
          light: ext.light,
          css: ext.css,
          density: ext.density,
          description: value.$description,
        });
      } else if (value && typeof value === "object") {
        walk(value, next);
      }
    }
  })(source, []);
  return out;
}

/** Flattened tokens from tokens/tokens.json (file order) plus brand overrides from tokens/brands/*.json. */
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

  /** Concrete value of a token in a theme ("dark" | "light"). */
  function valueIn(t, theme) {
    return resolve(theme === "light" && t.light !== undefined ? t.light : t.value);
  }

  const brandDir = join(root, "tokens/brands");
  const brands = existsSync(brandDir)
    ? readdirSync(brandDir)
        .filter((f) => f.endsWith(".json"))
        .sort()
        .map((file) => {
          const source = JSON.parse(readFileSync(join(brandDir, file), "utf8"));
          const overrides = flatten(source);
          for (const o of overrides) {
            const base = byName.get(o.name);
            if (!base) throw new Error(`brand ${file}: ${o.name} is not a token`);
            if (base.css !== undefined) throw new Error(`brand ${file}: ${o.name} is derived; override its source tokens instead`);
            if (o.light !== undefined && base.type !== "color") throw new Error(`brand ${file}: only colours can have light values (${o.name})`);
            o.cssVar = base.cssVar;
            o.type = base.type;
          }
          return { name: basename(file, ".json"), description: source.$description, overrides };
        })
    : [];

  return { tokens, byName, resolve, toCss, valueIn, brands };
}
