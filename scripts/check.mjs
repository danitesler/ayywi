// Machine-enforced design-system rules and doc/code drift checks.
// Agents: run `pnpm check` after every change and fix everything it reports.
import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { cssRuleFindings, lintPaths, loadContract } from "../cli/lint.mjs";
import { ATTRIBUTES, CATEGORIES, PUBLIC_HOOKS, UTILITIES } from "./lib/contract.mjs";
import { contrast, mix } from "./lib/contrast.mjs";
import { loadTokens } from "./lib/tokens.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => readFileSync(join(root, p), "utf8");
const problems = [];
const fail = (file, msg) => problems.push(`${file}: ${msg}`);

const tokenVars = new Set(loadTokens(root).tokens.map((t) => t.cssVar));
const allowedVars = new Set([...tokenVars, ...Object.keys(PUBLIC_HOOKS)]);
const stripComments = (css) => css.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, " "));

/** Class names used in selectors (text before "{" in each rule). */
function selectorClasses(css) {
  const out = new Set();
  for (const match of stripComments(css).matchAll(/([^{};]+)\{/g)) {
    if (match[1].trim().startsWith("@")) continue;
    for (const cls of match[1].matchAll(/\.(-?[_a-zA-Z][\w-]*)/g)) out.add(cls[1]);
  }
  return out;
}

function lintCss(file, css) {
  for (const f of cssRuleFindings(css)) fail(`${file}:${f.line}`, `${f.rule} — ${f.message}`);
  stripComments(css)
    .split("\n")
    .forEach((line, i) => {
      for (const v of line.matchAll(/var\((--ayy-[\w-]+)/g)) {
        if (!allowedVars.has(v[1])) fail(`${file}:${i + 1}`, `unknown custom property ${v[1]} — not a token or documented hook`);
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
const REQUIRED_META = ["name", "slug", "status", "category", "description", "classes", "variants", "react", "a11y", "do", "dont", "examples"];
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

  let meta;
  try {
    meta = JSON.parse(read(files.meta));
  } catch (e) {
    fail(files.meta, `invalid JSON: ${e.message}`);
    continue;
  }
  for (const key of REQUIRED_META) if (!(key in meta)) fail(files.meta, `missing "${key}"`);
  for (const key of ["whenToUse", "whenNotToUse"]) if (key in meta) fail(files.meta, `"${key}" is gone — fold it into "do" / "dont"`);
  if (meta.slug !== slug) fail(files.meta, `slug "${meta.slug}" should be "${slug}"`);
  if ("category" in meta && !(meta.category in CATEGORIES)) fail(files.meta, `category "${meta.category}" should be one of: ${Object.keys(CATEGORIES).join(", ")} (scripts/lib/contract.mjs)`);

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
  if (hasElement && !meta.element) fail(files.meta, `${slug}.element.ts exists but meta has no "element" block`);
  if (meta.element) {
    if (!hasElement && !meta.element.tag) fail(files.meta, `"element" block needs a tag`);
    if (!elementsIndex.includes(`define("${meta.element.tag}"`)) fail("src/elements/index.ts", `doesn't register <${meta.element.tag}>`);
    if (hasElement) {
      const src = read(elementFile);
      const observed = src.match(/observedAttributes = \[([^\]]*)\]/)?.[1] ?? "";
      for (const a of observed.matchAll(/"([\w-]+)"/g)) {
        if (!(a[1] in (meta.element.attributes ?? {}))) fail(files.meta, `<${meta.element.tag}> observes "${a[1]}" but it isn't documented in element.attributes`);
      }
      for (const e of src.matchAll(/emit\(this, "([\w-]+)"/g)) {
        if (!(e[1] in (meta.element.events ?? {}))) fail(files.meta, `<${meta.element.tag}> fires "${e[1]}" but it isn't documented in element.events`);
      }
    }
  }

  for (const ex of meta.examples ?? []) {
    for (const ext of ["html", "tsx"]) {
      const f = `${dir}/examples/${ex.id}.${ext}`;
      if (!existsSync(join(root, f))) fail(files.meta, `example "${ex.id}" is missing ${f}`);
    }
  }

  if (!indexCss.includes(`../components/${slug}/${slug}.css`)) fail("src/css/index.css", `doesn't import ${slug}.css`);
  if (!jsIndex.includes(`./components/${slug}/${slug}"`)) fail("src/index.ts", `doesn't export ./components/${slug}/${slug}`);
  if (!reactIndex.includes(`../components/${slug}/${slug}.react"`)) fail("src/react/index.ts", `doesn't export ${slug}.react`);
}

// ---- Rules name every custom element, so agents know it exists ----
{
  const { RULES } = await import("./lib/contract.mjs");
  const elementsRule = RULES.find((r) => r.includes('"ayywi/elements"')) ?? "";
  for (const m of elementsIndex.matchAll(/define\("(ayy-[\w-]+)"/g)) {
    if (!elementsRule.includes(`<${m[1]}>`)) fail("scripts/lib/contract.mjs", `the RULES entry about "ayywi/elements" doesn't list <${m[1]}>`);
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
}

// ---- Base ----
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
}

if (problems.length) {
  console.error(`✗ ${problems.length} problem(s)\n\n${problems.map((p) => `  ${p}`).join("\n")}`);
  process.exit(1);
}
console.log("✓ ayywi check passed");
