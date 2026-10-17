// Machine-enforced design-system rules and doc/code drift checks.
// Agents: run `pnpm check` after every change and fix everything it reports.
import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { cssRuleFindings, lintPaths, loadContract } from "../cli/lint.mjs";
import { ATTRIBUTES, CATEGORIES, ORDER, PUBLIC_HOOKS, STATES, UTILITIES } from "./lib/contract.mjs";
import { contrast, mix } from "./lib/contrast.mjs";
import { links as cdnLinks, PINNED, tags as cdnTags } from "./lib/readme-pins.mjs";
import { loadTokens } from "./lib/tokens.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => readFileSync(join(root, p), "utf8");
const problems = [];
const fail = (file, msg) => problems.push(`${file}: ${msg}`);

const tokenVars = new Set(loadTokens(root).tokens.map((t) => t.cssVar));
const allowedVars = new Set([...tokenVars, ...Object.keys(PUBLIC_HOOKS)]);
const stripComments = (css) => css.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, " "));

/** Content outside @media (hover: hover) blocks, to catch unwrapped hover transforms. */
function extractOutsideHoverMedia(css) {
  const clean = stripComments(css);
  let outside = "";
  let i = 0;
  while (i < clean.length) {
    const hoverMedia = clean.indexOf("@media (hover: hover)", i);
    if (hoverMedia === -1) {
      outside += clean.slice(i);
      break;
    }
    outside += clean.slice(i, hoverMedia);
    const openBrace = clean.indexOf("{", hoverMedia);
    if (openBrace === -1) break;
    let depth = 1;
    let j = openBrace + 1;
    while (j < clean.length && depth > 0) {
      if (clean[j] === "{") depth++;
      else if (clean[j] === "}") depth--;
      j++;
    }
    i = j;
  }
  return outside;
}

/** Class names used in selectors (text before "{" in each rule). */
function selectorClasses(css) {
  const out = new Set();
  for (const match of stripComments(css).matchAll(/([^{};]+)\{/g)) {
    if (match[1].trim().startsWith("@")) continue;
    for (const cls of match[1].matchAll(/\.(-?[_a-zA-Z][\w-]*)/g)) out.add(cls[1]);
  }
  return out;
}

function lintCss(file, css, { foreignVars = false } = {}) {
  for (const f of cssRuleFindings(css)) fail(`${file}:${f.line}`, `${f.rule} — ${f.message}`);
  stripComments(css)
    .split("\n")
    .forEach((line, i) => {
      for (const v of line.matchAll(/var\((--ayy-[\w-]+)/g)) {
        if (!allowedVars.has(v[1])) fail(`${file}:${i + 1}`, `unknown custom property ${v[1]} — not a token or documented hook`);
      }
      if (!foreignVars) for (const v of line.matchAll(/(?:^|[\s(;{,])(--(?!ayy-|_)[a-zA-Z][\w-]*)\s*[:,)]/g)) {
        fail(`${file}:${i + 1}`, `custom property ${v[1]} must be --ayy-* (public) or --_* (private)`);
      }
      for (const k of line.matchAll(/@keyframes\s+([\w-]+)/g)) {
        if (!k[1].startsWith("ayy-")) fail(`${file}:${i + 1}`, `keyframes "${k[1]}" must be prefixed ayy-`);
      }
    });
  for (const cls of selectorClasses(css)) {
    if (!cls.startsWith("ayy-") && cls !== "dark" && cls !== "light") fail(file, `class .${cls} is not prefixed ayy-`);
  }
}

/** Exported React component names in a .react.tsx file. */
function reactExports(source) {
  const names = new Set();
  for (const m of source.matchAll(/export (?:const|function) ([A-Z]\w*)/g)) names.add(m[1]);
  return names;
}

/** Own (non-inherited) props per exported *Props interface: { InterfaceName: Set<prop> }. */
function ownProps(source) {
  const out = {};
  for (const m of source.matchAll(/export interface (\w+Props)[^{]*\{([\s\S]*?)\n\}/g)) {
    const props = new Set();
    for (const p of m[2].matchAll(/^\s{2}([a-zA-Z][\w]*)\??:/gm)) props.add(p[1]);
    out[m[1]] = props;
  }
  return out;
}

// Native attributes that metas may document without them being own props.
const NATIVE_PROPS = new Set(["type", "checked", "defaultChecked", "value", "defaultValue", "open", "defaultOpen", "htmlFor", "children", "className"]);

// ---- Components ----
const indexCss = read("src/css/index.css");
const reactIndex = read("src/react/index.ts");
const jsIndex = read("src/index.ts");
const elementsIndex = read("src/elements/index.ts");
const tagToClass = new Map();
for (const m of elementsIndex.matchAll(/define\("([\w-]+)",\s*(\w+)\)/g)) tagToClass.set(m[1], m[2]);
// Which component documents each class, so one component's CSS may place another's (the app shell hides its bottom nav on wide screens).
const classOwner = new Map(Object.keys(UTILITIES).map((cls) => [cls, "base.css"]));
for (const slug of readdirSync(join(root, "src/components"))) {
  try {
    const meta = JSON.parse(read(`src/components/${slug}/${slug}.meta.json`));
    for (const cls of Object.keys(meta.classes ?? {})) classOwner.set(cls, slug);
  } catch {
    // Reported per component below.
  }
}
const REQUIRED_META = ["name", "slug", "category", "description", "aka", "classes", "variants", "states", "sizes", "react", "a11y", "do", "dont", "examples"];
// CSS that styles a state, so a component can't call that state "none".
const STATE_CSS = {
  hover: /:hover\b/,
  pressed: /:active\b/,
  focus: /:focus(-visible|-within)?\b/,
  disabled: /:disabled\b|\[aria-disabled/,
  selected: /:checked\b|\[aria-(selected|current|pressed|checked)\b/,
  error: /\[aria-invalid\b/,
  loading: /\[aria-busy\b/,
};
const akaOwner = new Map(); // aka → slug
const STATEFUL = /:checked|\[aria-selected|\[aria-checked|\[aria-current|\[aria-invalid|\[aria-pressed|\[aria-expanded|:indeterminate|__bar\b/;

for (const slug of readdirSync(join(root, "src/components"))) {
  const dir = `src/components/${slug}`;
  const files = { css: `${dir}/${slug}.css`, js: `${dir}/${slug}.ts`, react: `${dir}/${slug}.react.tsx`, meta: `${dir}/${slug}.meta.json` };
  let ok = true;
  for (const f of Object.values(files)) {
    if (!existsSync(join(root, f))) {
      fail(dir, `missing ${f}`);
      ok = false;
    }
  }
  if (!ok) continue;

  const css = read(files.css);
  lintCss(files.css, css);
  if (STATEFUL.test(stripComments(css)) && !css.includes("forced-colors: active")) {
    fail(files.css, "styles a state (checked/selected/progress) but has no @media (forced-colors: active) block — High Contrast users won't see it");
  }
  const outsideHover = extractOutsideHoverMedia(css);
  for (const m of outsideHover.matchAll(/([^{};]+)\{([^}]+)\}/g)) {
    const sel = m[1];
    const body = m[2];
    if (sel.includes(":hover") && !sel.includes(":focus")) {
      if (/(\btransform\s*:|\bscale\s*:)/.test(body)) {
        fail(files.css, `unwrapped :hover transform or scale in "${sel.trim()}" — wrap in @media (hover: hover)`);
      }
    }
  }

  let meta;
  try {
    meta = JSON.parse(read(files.meta));
  } catch (e) {
    fail(files.meta, `invalid JSON: ${e.message}`);
    continue;
  }
  for (const key of REQUIRED_META) if (!(key in meta)) fail(files.meta, `missing "${key}"`);
  for (const key of ["whenToUse", "whenNotToUse"]) if (key in meta) fail(files.meta, `"${key}" is gone — fold it into "do" / "dont"`);
  if ("status" in meta) fail(files.meta, `"status" is gone — all components are ready by default`);
  if (meta.slug !== slug) fail(files.meta, `slug "${meta.slug}" should be "${slug}"`);
  if ("aka" in meta) {
    // Names apps give a hand-built copy: `ayywi lint` flags classes that end in one (rebuilt-component).
    if (!Array.isArray(meta.aka) || !meta.aka.length) fail(files.meta, `"aka" should list the names a hand-built copy goes by ("chip", "tag", "token")`);
    for (const a of meta.aka ?? []) {
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(a)) fail(files.meta, `aka "${a}" should be lower-case kebab-case, like a class name`);
      if (akaOwner.has(a) && akaOwner.get(a) !== slug) fail(files.meta, `aka "${a}" is also ${akaOwner.get(a)}'s`);
      akaOwner.set(a, slug);
    }
  }
  if ("category" in meta && !(meta.category in CATEGORIES)) fail(files.meta, `category "${meta.category}" should be one of: ${Object.keys(CATEGORIES).join(", ")} (scripts/lib/contract.mjs)`);

  // States: every one in STATES, each either { when, looks } or { none }; a state the CSS styles can't be "none".
  if (meta.states) {
    const shown = stripComments(css);
    for (const name of Object.keys(STATES)) {
      if (!(name in meta.states)) fail(files.meta, `states: missing "${name}" — describe it as { "when", "looks" }, or { "none": "why, and what to use instead" }`);
    }
    for (const [name, s] of Object.entries(meta.states)) {
      const keys = Object.keys(s ?? {}).sort().join();
      const core = name in STATES;
      const ok = keys === "looks,when" ? typeof s.when === "string" && typeof s.looks === "string" : keys === "none" ? core && name !== "default" && typeof s.none === "string" : name === "default" && keys === "looks";
      if (!ok) {
        const want = name === "default" ? '{ "looks" }' : core ? '{ "when", "looks" } or { "none" }' : '{ "when", "looks" } (extra states can\'t be "none"; leave them out)';
        fail(files.meta, `states.${name} should be ${want}`);
      } else if (s.none && STATE_CSS[name]?.test(shown)) {
        fail(files.meta, `states.${name} says it doesn't apply, but ${slug}.css styles it (${shown.match(STATE_CSS[name])[0]}) — document it as { "when", "looks" }`);
      }
    }
  }

  // Sizes: density and width always; a scale entry per size variant value, and none without one.
  if (meta.sizes) {
    for (const key of ["density", "width"]) if (typeof meta.sizes[key] !== "string") fail(files.meta, `sizes.${key} should say how it sizes (a string)`);
    for (const key of Object.keys(meta.sizes)) if (!["scale", "density", "width"].includes(key)) fail(files.meta, `sizes.${key} isn't a sizes field (scale, density, width)`);
    const values = (meta.variants?.size?.values ?? []).map(String);
    const scale = Object.keys(meta.sizes.scale ?? {});
    if (values.length && !meta.sizes.scale) fail(files.meta, `sizes.scale is missing: describe each size (${values.join(", ")})`);
    if (!values.length && meta.sizes.scale) fail(files.meta, "sizes.scale needs a \"size\" variant to describe");
    if (meta.sizes.scale) {
      for (const v of values) if (!scale.includes(v)) fail(files.meta, `sizes.scale doesn't describe size "${v}"`);
      for (const v of scale) if (!values.includes(v)) fail(files.meta, `sizes.scale describes "${v}", which isn't a value of variants.size`);
    }
  }

  // CSS classes ↔ documented classes
  const defined = new Set([...selectorClasses(css)].filter((cls) => (classOwner.get(cls) ?? slug) === slug));
  const documented = new Set(Object.keys(meta.classes ?? {}));
  for (const cls of defined) if (!documented.has(cls)) fail(files.meta, `class .${cls} exists in ${slug}.css but isn't documented in "classes"`);
  for (const cls of documented) if (!defined.has(cls)) fail(files.meta, `documents .${cls}, which ${slug}.css doesn't define`);

  // React exports ↔ documented components, own props ↔ documented props
  const reactSource = read(files.react);
  const exported = reactExports(reactSource);
  const documentedComponents = Object.keys(meta.react?.components ?? {});
  for (const name of exported) if (!documentedComponents.includes(name)) fail(files.meta, `React component <${name}> is exported but not documented in react.components`);
  for (const name of documentedComponents) if (!exported.has(name)) fail(files.meta, `documents React <${name}>, which ${slug}.react.tsx doesn't export`);
  const props = ownProps(reactSource);
  const anyProp = new Set(Object.values(props).flatMap((s) => [...s]));
  for (const [name, def] of Object.entries(meta.react?.components ?? {})) {
    const own = props[`${name}Props`] ?? new Set();
    const docKeys = Object.keys(def.props ?? {}).flatMap((k) => k.split(" / ").map((s) => s.trim()));
    for (const p of own) if (p !== "children" && !docKeys.includes(p)) fail(files.meta, `<${name}> prop "${p}" is not documented`);
    for (const k of docKeys) {
      if (k.startsWith("...") || anyProp.has(k) || NATIVE_PROPS.has(k) || /^(aria|data)-/.test(k)) continue;
      fail(files.meta, `<${name}> documents prop "${k}", which ${name}Props doesn't declare`);
    }
    if (reactIndex.includes(`../components/${slug}/${slug}.react"`) && !new RegExp(`\\b${name}\\b`).test(reactIndex)) {
      fail("src/react/index.ts", `doesn't export <${name}>`);
    }
  }

  // Variants reference real components
  for (const [key, v] of Object.entries(meta.variants ?? {})) {
    if (v.component && !documentedComponents.includes(v.component)) fail(files.meta, `variant "${key}" targets unknown component ${v.component}`);
  }

  // Custom element ↔ meta.element ↔ registration
  const elementFile = `${dir}/${slug}.element.ts`;
  const hasElement = existsSync(join(root, elementFile));
  if (hasElement && !meta.element && !meta.elements) fail(files.meta, `${slug}.element.ts exists but meta has no "element" block`);
  const allMetaElements = [
    ...(meta.element ? [meta.element] : []),
    ...(Array.isArray(meta.elements) ? meta.elements : []),
  ];
  const checkedTags = new Set();
  for (const el of allMetaElements) {
    if (checkedTags.has(el.tag)) continue;
    checkedTags.add(el.tag);
    if (!hasElement && !el.tag) fail(files.meta, `"element" block needs a tag`);
    if (!elementsIndex.includes(`define("${el.tag}"`)) fail("src/elements/index.ts", `doesn't register <${el.tag}>`);
  }
  if (hasElement) {
    const src = read(elementFile);
    for (const el of allMetaElements) {
      const clsName = tagToClass.get(el.tag);
      let classChunk = src;
      if (clsName) {
        const clsMatch = src.match(new RegExp(`class\\s+${clsName}\\b[\\s\\S]*?(?=(?:export\\s+class|class\\s+Ayy|\\nexport\\s+\\{|$))`));
        if (clsMatch) classChunk = clsMatch[0];
      }
      const observed = classChunk.match(/observedAttributes\s*=\s*\[([^\]]*)\]/)?.[1] ?? "";
      for (const a of observed.matchAll(/"([\w-]+)"/g)) {
        if (!(a[1] in (el.attributes ?? {}))) fail(files.meta, `<${el.tag}> observes "${a[1]}" but it isn't documented in element.attributes`);
      }
      for (const e of classChunk.matchAll(/emit\(this,\s*"([\w-]+)"/g)) {
        if (!(e[1] in (el.events ?? {}))) fail(files.meta, `<${el.tag}> fires "${e[1]}" but it isn't documented in element.events`);
      }
    }
  }

  // Class options ↔ documented in meta.js
  const jsSource = read(files.js);
  const jsDoc = meta.js ?? "";
  for (const m of jsSource.matchAll(/export interface (\w+ClassOptions)[^{]*\{([\s\S]*?)\n\}/g)) {
    const ifaceName = m[1];
    for (const p of m[2].matchAll(/^\s{2}([a-zA-Z][\w]*)\??:/gm)) {
      if (!jsDoc.includes(p[1])) {
        fail(files.meta, `${ifaceName}.${p[1]} is not documented in "js"`);
      }
    }
  }

  for (const ex of meta.examples ?? []) {
    for (const ext of ["html", "tsx"]) {
      const f = `${dir}/examples/${ex.id}.${ext}`;
      if (!existsSync(join(root, f))) fail(files.meta, `example "${ex.id}" is missing ${f}`);
      else {
        const exSrc = read(f);
        if (/\bpv-props-/.test(exSrc)) fail(f, "references preview internal class pv-props-*");
      }
    }
  }

  if (!indexCss.includes(`../components/${slug}/${slug}.css`)) fail("src/css/index.css", `doesn't import ${slug}.css`);
  if (!jsIndex.includes(`./components/${slug}/${slug}"`)) fail("src/index.ts", `doesn't export ./components/${slug}/${slug}`);
  if (!reactIndex.includes(`../components/${slug}/${slug}.react"`)) fail("src/react/index.ts", `doesn't export ${slug}.react`);
}

// ---- ORDER and entrypoints completeness ----
{
  const componentSlugs = readdirSync(join(root, "src/components"));
  const orderSet = new Set(ORDER);
  for (const s of componentSlugs) {
    if (!orderSet.has(s)) fail("scripts/lib/contract.mjs", `ORDER is missing component slug "${s}"`);
  }
  for (const s of ORDER) {
    if (!componentSlugs.includes(s)) fail("scripts/lib/contract.mjs", `ORDER lists "${s}", which is not in src/components`);
  }

  function checkNoDuplicates(file, re, desc) {
    const content = read(file);
    const seen = new Set();
    for (const m of content.matchAll(re)) {
      const item = m[1].trim();
      if (seen.has(item)) fail(file, `duplicate ${desc} "${item}"`);
      seen.add(item);
    }
  }
  checkNoDuplicates("src/css/index.css", /@import\s+["\x27]([^"\x27]+)["\x27];/g, "CSS import");
  checkNoDuplicates("src/index.ts", /export\s+\*\s+from\s+["\x27]([^"\x27]+)["\x27];/g, "JS export");

  const agentsMd = read("AGENTS.md");
  const skillMd = read("ai/skills/ayywi/SKILL.md");
  for (const m of elementsIndex.matchAll(/define\("([\w-]+)"/g)) {
    const tag = m[1];
    if (!agentsMd.includes(`<${tag}>`)) fail("AGENTS.md", `missing custom element <${tag}>`);
    if (!skillMd.includes(`<${tag}>`)) fail("ai/skills/ayywi/SKILL.md", `missing custom element <${tag}>`);
  }
}

// ---- No external UI/CSS library mentions in library source, docs or prompts ----
{
  const EXTERNAL_LIBS = /\b(shadcn|tailwind|radix|cva|cmdk|chakra|mantine|mui|daisyui)\b/i;
  function walkFiles(dir) {
    let out = [];
    for (const name of readdirSync(join(root, dir))) {
      const rel = join(dir, name);
      const full = join(root, rel);
      if (statSync(full).isDirectory()) out = out.concat(walkFiles(rel));
      else out.push(rel);
    }
    return out;
  }
  const noExternalTargets = [
    ...walkFiles("src"),
    "README.md",
    ...walkFiles("tokens"),
    ...walkFiles("ai"),
    "preview/src/prompts.ts",
    "scripts/lib/contract.mjs",
  ];
  for (const rel of noExternalTargets) {
    if (rel.endsWith(".png") || rel.endsWith(".woff2") || rel.endsWith(".ico") || rel.endsWith(".woff")) continue;
    const content = read(rel);
    const match = content.match(EXTERNAL_LIBS);
    if (match) fail(rel, `mentions external UI/CSS library "${match[0]}"`);
  }
}

// ---- Rules name every custom element, so agents know it exists ----
{
  const { RULES } = await import("./lib/contract.mjs");
  const elementsRule = RULES.find((r) => r.includes('"@danitesler/ayywi/elements"')) ?? "";
  for (const m of elementsIndex.matchAll(/define\("(ayy-[\w-]+)"/g)) {
    if (!elementsRule.includes(`<${m[1]}>`)) fail("scripts/lib/contract.mjs", `the RULES entry about "@danitesler/ayywi/elements" doesn't list <${m[1]}>`);
  }
}

// ---- Patterns are built from components that exist and point at an example that does ----
{
  const { PATTERNS } = await import("./lib/contract.mjs");
  const slugs = new Set(readdirSync(join(root, "src/components")));
  for (const p of PATTERNS) {
    for (const key of ["name", "slug", "summary", "components", "example", "steps", "phone", "specs", "do", "dont"]) {
      if (p[key] === undefined) fail("scripts/lib/contract.mjs", `pattern "${p.slug ?? p.name}" has no ${key}`);
    }
    for (const c of p.components ?? []) if (!slugs.has(c)) fail("scripts/lib/contract.mjs", `pattern "${p.slug}" is built from "${c}", which isn't a component`);
    const [slug, id] = String(p.example).split("/");
    const meta = slugs.has(slug) ? JSON.parse(read(`src/components/${slug}/${slug}.meta.json`)) : null;
    if (!meta?.examples?.some((e) => e.id === id)) fail("scripts/lib/contract.mjs", `pattern "${p.slug}" points at example "${p.example}", which doesn't exist`);
  }
}

// ---- The README's component count and table match the components ----
{
  const readme = read("README.md");
  const metas = readdirSync(join(root, "src/components")).map((slug) => JSON.parse(read(`src/components/${slug}/${slug}.meta.json`)));
  const count = readme.match(/all (\d+) components/)?.[1];
  if (Number(count) !== metas.length) fail("README.md", `says "all ${count ?? "?"} components"; there are ${metas.length}`);
  const table = readme.split("## Components")[1]?.split("\n## ")[0] ?? "";
  for (const m of metas) if (!new RegExp(`\\b${m.name}\\b`).test(table)) fail("README.md", `the Components table doesn't list ${m.name}`);
  // …and lists nothing else (a removed or renamed component). "Calendar (and date picker)": the name is before the "(".
  const names = new Set(metas.map((m) => m.name));
  for (const row of table.matchAll(/^\| *([A-Z][\w ]*?) *\| *(.+?) *\|$/gm)) {
    if (row[1] === "Category") continue;
    for (const cell of row[2].replace(/\(.*?\)/g, "").split(",")) {
      const name = cell.trim();
      if (name && !names.has(name)) fail("README.md", `the Components table lists "${name}", which isn't a component`);
    }
  }
}

// ---- The README's jsDelivr links name this version, and each runtime file has an SRI hash (scripts/pin-readme.mjs) ----
{
  const readme = read("README.md");
  const { version } = JSON.parse(read("package.json"));
  for (const l of cdnLinks(readme)) if (l.version !== version) fail("README.md", `links ${l.file} at @${l.version}; package.json is ${version} — run pnpm build && node scripts/pin-readme.mjs`);
  const pinned = cdnTags(readme);
  for (const file of PINNED) {
    const tag = pinned.find((t) => t.file === file);
    if (!tag) fail("README.md", `the quick-start prompt doesn't load ${file} from jsDelivr`);
    else if (!tag.integrity) fail("README.md", `${file} has no integrity hash — run node scripts/pin-readme.mjs`);
  }
}

// ---- llms-full.txt stays small enough for an AI tool to read whole (examples live in llms/<slug>.md) ----
{
  const LLMS_FULL_BUDGET = 420_000; // bytes, about 100k tokens; it was 1.15 MB with examples inlined
  const size = statSync(join(root, "llms-full.txt")).size;
  if (size > LLMS_FULL_BUDGET) fail("llms-full.txt", `${Math.round(size / 1000)} kB is over its ${LLMS_FULL_BUDGET / 1000} kB budget — keep long content in llms/<slug>.md (componentMarkdown in scripts/build-manifest.mjs)`);
}

// ---- Base (tokens only, like everything else) ----
const base = read("src/css/base.css");
lintCss("src/css/base.css", base);
const baseClasses = selectorClasses(base);
for (const cls of baseClasses) if (!(cls in UTILITIES)) fail("scripts/lib/contract.mjs", `utility .${cls} (base.css) isn't documented in UTILITIES`);
for (const cls of Object.keys(UTILITIES)) if (!baseClasses.has(cls)) fail("scripts/lib/contract.mjs", `UTILITIES documents .${cls}, which base.css doesn't define`);

// ---- Themes (loadTokens validates their overrides), text contrast in every combination ----
const TEXT_COLORS = ["text", "text-soft", "muted", "destructive", "success", "warning", "info", "ai", "ai-active"];
const SURFACES = ["bg", "surface", "surface-raised"];
// Status text also sits on a tint of itself (badges 10%, alerts 8%, destructive buttons 10% / 15% on hover).
const TINTED = ["destructive", "success", "warning", "info", "ai-active"];
const TINT = 0.15;
// Share of the accent in accent text on light themes; keep in sync with .ayy-accent-text (color-mix … 45%).
const ACCENT_TEXT_MIX = 0.45;
// Bar list rows put text on this share of their series colour; keep in sync with .ayy-bar-list__item::before.
const CHART_TINT = 0.18;
try {
  const { tokens, byName, valueIn, resolve, themes } = loadTokens(root);
  for (const theme of themes) {
    if (!ATTRIBUTES["data-theme"].includes(`"${theme.name}"`)) fail("scripts/lib/contract.mjs", `ATTRIBUTES["data-theme"] doesn't list "${theme.name}"`);
    const where = `tokens (${theme.name})`;
    const color = (name) => valueIn(byName.get(`color.${name}`), theme.name);
    const need = (fg, bg, tint = 0) => {
      const behind = tint ? mix(color(fg), color(bg), tint) : color(bg);
      const ratio = contrast(color(fg), behind);
      const on = tint ? `a ${tint * 100}% tint of itself over color.${bg}` : `color.${bg}`;
      if (ratio < 4.5) fail(where, `color.${fg} on ${on} is ${ratio.toFixed(2)}:1 — text needs at least 4.5:1 (WCAG AA)`);
    };
    for (const fg of TEXT_COLORS) for (const bg of SURFACES) need(fg, bg);
    for (const fg of TINTED) for (const bg of SURFACES) need(fg, bg, TINT);
    need("primary-fg", "primary");
    // Text on a wash track (tabs list, segmented control): the wash is translucent, so composite it over each surface.
    const wash = color("wash");
    const washAlpha = wash.length === 9 ? parseInt(wash.slice(7), 16) / 255 : 1;
    for (const fg of ["text", "text-soft"]) {
      for (const bg of SURFACES) {
        const behind = mix(wash.slice(0, 7), color(bg), washAlpha);
        const ratio = contrast(color(fg), behind);
        if (ratio < 4.5) fail(where, `color.${fg} on the wash over color.${bg} is ${ratio.toFixed(2)}:1 — text needs at least 4.5:1 (WCAG AA)`);
      }
    }
    // Chart series are graphics (bars, lines, swatches): 3:1 against every surface (WCAG 1.4.11). Bar lists put text on a tint of them.
    for (const series of tokens.filter((t) => t.name.startsWith("chart."))) {
      const fg = valueIn(series, theme.name);
      for (const bg of SURFACES) {
        const ratio = contrast(fg, color(bg));
        if (ratio < 3) fail(where, `${series.name} on color.${bg} is ${ratio.toFixed(2)}:1 — chart graphics need at least 3:1 (WCAG 1.4.11)`);
        const text = contrast(color("text"), mix(fg, color(bg), CHART_TINT));
        if (text < 4.5) fail(where, `color.text on a ${CHART_TINT * 100}% tint of ${series.name} over color.${bg} is ${text.toFixed(2)}:1 — bar list text needs 4.5:1`);
      }
    }
    // Accent text (.ayy-accent-text, section numbers, contents): raw on dark themes, mixed with the text colour on light ones.
    for (const accent of tokens.filter((t) => t.name.startsWith("accent."))) {
      const raw = resolve(accent.value);
      const fg = theme.base === "light" ? mix(raw, color("text"), ACCENT_TEXT_MIX) : raw;
      for (const bg of SURFACES) {
        const ratio = contrast(fg, color(bg));
        if (ratio < 4.5) fail(where, `${accent.name} as accent text on color.${bg} is ${ratio.toFixed(2)}:1 — needs 4.5:1 (see .ayy-accent-text in base.css)`);
      }
    }
  }
} catch (e) {
  fail("tokens/", e.message);
}

// ---- Brands (tokens/brands/*.json): createBrand() accepts each, and every contrast pair passes in every theme ----
try {
  const { build } = await import("esbuild");
  const { outputFiles } = await build({ entryPoints: [join(root, "src/brand.ts")], bundle: true, format: "esm", platform: "neutral", write: false, logLevel: "silent" });
  const { createBrand } = await import(`data:text/javascript;base64,${Buffer.from(outputFiles[0].text).toString("base64")}`);
  for (const { file, input } of loadTokens(root).brands) {
    try {
      for (const c of createBrand(input).checks.filter((x) => !x.pass)) fail(file, `${c.pair} in ${c.theme} is ${c.ratio}:1 — needs ${c.min}:1`);
    } catch (e) {
      fail(file, e.message);
    }
  }
} catch (e) {
  fail("src/brand.ts", e.message);
}

// ---- Generated files are current ----
let generatedOk = true;
for (const script of ["scripts/build-tokens.mjs", "scripts/build-manifest.mjs"]) {
  try {
    execFileSync(process.execPath, [join(root, script)], { cwd: root, env: { ...process.env, AYYWI_CHECK: "1" }, stdio: "pipe" });
  } catch (e) {
    generatedOk = false;
    fail(script, (e.stderr?.toString() || e.message).trim());
  }
}

// ---- Examples pass the same linter apps use (needs a current manifest) ----
if (generatedOk) {
  const { findings } = lintPaths(["src/components"], { cwd: root, contract: loadContract(join(root, "manifest/components.json")) });
  for (const f of findings.filter((x) => x.file.includes("/examples/"))) fail(`${f.file}:${f.line}`, `ayywi lint ${f.rule} — ${f.message}`);
  // The preview is built with ayywi too, and held to the same linter: no raw controls, look-alikes or restyles.
  const preview = lintPaths(["preview/src"], { cwd: root, contract: loadContract(join(root, "manifest/components.json")) });
  for (const f of preview.findings) fail(`${f.file}:${f.line}`, `ayywi lint ${f.rule} — ${f.message}`);
}

if (problems.length) {
  console.error(`✗ ${problems.length} problem(s)\n\n${problems.map((p) => `  ${p}`).join("\n")}`);
  process.exit(1);
}
console.log("✓ ayywi check passed");
