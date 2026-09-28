// ayywi lint — checks a project's UI code against the ayywi contract (manifest/components.json).
// No dependencies; regex/scan based on purpose so it works on any template language.
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { extname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const DEFAULT_RULES = {
  "unknown-class": "error",
  "unknown-token": "error",
  "unknown-variant": "error",
  "unknown-element": "error",
  "unknown-attribute-value": "error",
  "reserved-prefix": "error",
  "icon-button-label": "error",
  "icon-library": "warn",
  "hardcoded-color": "error",
  "dir-selector": "error",
  "physical-property": "warn",
};

const CSS_EXT = new Set([".css", ".scss", ".sass", ".less", ".pcss"]);
const MARKUP_EXT = new Set([
  ".html", ".htm", ".jsx", ".tsx", ".js", ".mjs", ".ts", ".vue", ".svelte", ".astro", ".erb", ".hbs", ".handlebars",
  ".twig", ".njk", ".liquid", ".php", ".cshtml", ".razor", ".templ", ".jinja", ".j2", ".ejs", ".mdx",
]);
const SKIP_DIRS = new Set(["node_modules", "dist", "build", ".git", ".next", ".nuxt", ".svelte-kit", ".output", "coverage", ".turbo", ".vercel"]);

// ---------------------------------------------------------------- contract

export function manifestPath() {
  return fileURLToPath(new URL("../manifest/components.json", import.meta.url));
}

/** Everything the linter needs, derived from the manifest. */
export function loadContract(path = manifestPath()) {
  const manifest = JSON.parse(readFileSync(path, "utf8"));
  const classes = new Map(); // class → component name
  const reactVariants = new Map(); // React component → { prop: [values] }
  const helperVariants = new Map(); // helper fn → { key: [values] }
  const elementAttrs = new Map(); // tag → { attr: [values] | null }
  const reactComponents = new Set();

  for (const u of Object.keys(manifest.utilities ?? {})) classes.set(u, "utilities");
  for (const c of manifest.components) {
    for (const cls of Object.keys(c.classes)) classes.set(cls, c.name);
    const reactNames = Object.keys(c.react?.components ?? {});
    for (const n of reactNames) reactComponents.add(n);
    for (const [prop, def] of Object.entries(c.variants ?? {})) {
      if (!def.values?.every((v) => typeof v === "string")) continue;
      const comp = def.component ?? reactNames[0];
      if (!comp) continue;
      if (!reactVariants.has(comp)) reactVariants.set(comp, {});
      reactVariants.get(comp)[prop] = def.values;
    }
    for (const m of String(c.js ?? "").matchAll(/(\w+Class)\(\{\s*([^}]*)\}\)/g)) {
      const keys = {};
      for (const k of m[2].split(",").map((s) => s.trim().replace(/\?$/, ""))) {
        const def = c.variants?.[k];
        if (def?.values?.every((v) => typeof v === "string")) keys[k] = def.values;
      }
      helperVariants.set(m[1], keys);
    }
    if (c.element?.tag) {
      const attrs = {};
      for (const [a, desc] of Object.entries(c.element.attributes ?? {})) {
        const enumMatch = String(desc).match(/^([\w-]+(?: \| [\w-]+)+)/);
        attrs[a] = enumMatch ? enumMatch[1].split(" | ") : null;
      }
      elementAttrs.set(c.element.tag, attrs);
    }
  }
  const tokens = new Set(manifest.tokens.map((t) => t.cssVar));
  const hooks = new Set(Object.keys(manifest.publicCustomProperties ?? {}));
  // Global attributes with a fixed set of values, e.g. data-theme: "dark" | "light" | … — the quoted names before " — ".
  const globalAttrs = new Map();
  for (const attr of ["data-theme", "data-density"]) {
    const head = String(manifest.attributes?.[attr] ?? "").split(" — ")[0];
    const values = [...head.matchAll(/"([\w-]+)"/g)].map((m) => m[1]);
    if (values.length) globalAttrs.set(attr, values);
  }
  return { manifest, classes, tokens, hooks, reactVariants, helperVariants, elementAttrs, reactComponents, globalAttrs };
}

// ---------------------------------------------------------------- helpers

function lineIndex(text) {
  const starts = [0];
  for (let i = 0; i < text.length; i++) if (text[i] === "\n") starts.push(i + 1);
  return (offset) => {
    let lo = 0;
    let hi = starts.length - 1;
    while (lo < hi) {
      const mid = (lo + hi + 1) >> 1;
      if (starts[mid] <= offset) lo = mid;
      else hi = mid - 1;
    }
    return { line: lo + 1, column: offset - starts[lo] + 1 };
  };
}

function distance(a, b) {
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return d[a.length][b.length];
}

function suggest(name, candidates) {
  let best = null;
  let bestScore = Infinity;
  for (const c of candidates) {
    const s = distance(name, c);
    if (s < bestScore) {
      best = c;
      bestScore = s;
    }
  }
  return bestScore <= Math.max(2, Math.floor(name.length / 4)) ? best : null;
}

/** Index of the ">" closing the tag that starts at `start` ("<"), skipping quotes and {…} expressions. */
function tagEnd(text, start) {
  let depth = 0;
  let quote = null;
  for (let i = start + 1; i < text.length; i++) {
    const ch = text[i];
    if (quote) {
      if (ch === quote && text[i - 1] !== "\\") quote = null;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === "`") quote = ch;
    else if (ch === "{") depth++;
    else if (ch === "}") depth = Math.max(0, depth - 1);
    else if (ch === ">" && depth === 0) return i;
  }
  return text.length;
}

/** Attribute value starting at `i` (quoted or {…}); returns [value, endIndex]. */
function readValue(text, i) {
  const open = text[i];
  if (open === '"' || open === "'" || open === "`") {
    const end = text.indexOf(open, i + 1);
    return [text.slice(i + 1, end < 0 ? text.length : end), end];
  }
  if (open === "{" || open === "[") {
    const close = open === "{" ? "}" : "]";
    let depth = 0;
    for (let j = i; j < text.length; j++) {
      if (text[j] === open) depth++;
      else if (text[j] === close && --depth === 0) return [text.slice(i + 1, j), j];
    }
  }
  return ["", i];
}

// Icon packages other than Hugeicons. Mixing sets brings a second stroke weight and grid into the UI.
const OTHER_ICON_SETS =
  /^(?:lucide(?:-[\w-]+)?|@lucide\/[\w-]+|react-icons(?:\/[\w-]+)?|@heroicons\/[\w/-]+|@tabler\/icons(?:-[\w-]+)?|@phosphor-icons\/[\w-]+|phosphor-(?:react|vue|svelte)|@radix-ui\/react-icons|@mui\/icons-material(?:\/[\w-]+)?|(?:react|vue)-feather|feather-icons|@fortawesome\/[\w-]+|@iconify\/[\w-]+|@remixicon\/[\w-]+|remixicon|(?:react-)?bootstrap-icons|ionicons|@primer\/octicons(?:-react)?|@carbon\/icons(?:-[\w-]+)?|iconoir(?:-[\w-]+)?|@mdi\/[\w-]+|material-(?:icons|symbols)|@material-symbols\/[\w-]+)$/;

const stripCssComments = (css) => css.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, " "));
const CLASS_TOKEN = /(?<![\w-])ayy-[a-z0-9]+(?:(?:-{1,2}|_{2})[a-z0-9]+)*/g;

// ---------------------------------------------------------------- rules

/**
 * Design rules for CSS text (shared with ayywi's own `pnpm check`): hardcoded colours, physical properties, :dir().
 * A line containing "ayy-allow-physical" may use physical properties.
 */
export function cssRuleFindings(css) {
  const out = [];
  const raw = css.split("\n");
  stripCssComments(css)
    .split("\n")
    .forEach((line, i) => {
      const at = (rule, message, index = 0) => out.push({ rule, message, line: i + 1, column: index + 1 });
      let m;
      if ((m = line.match(/#[0-9a-fA-F]{3,8}\b/)) && !/url\(/.test(line)) at("hardcoded-color", `hardcoded colour ${m[0]} — use a --ayy-color-* token`, m.index);
      if ((m = line.match(/\b(rgba?|hsla?|oklch|oklab|lab|lch|hwb)\(/)))
        at("hardcoded-color", `hardcoded ${m[1]}() colour — use a token or color-mix() with a token`, m.index);
      if (!raw[i].includes("ayy-allow-physical")) {
        if ((m = line.match(/(^|[\s;{])((?:margin|padding|border)-(?:left|right)(?:-\w+)?)\s*:/)))
          at("physical-property", `${m[2]} — use the inline-start/inline-end form so RTL works`, m.index);
        if ((m = line.match(/(^|[\s;{])(left|right)\s*:/)))
          at("physical-property", `${m[2]}: — use inset-inline-start/end`, m.index);
        if ((m = line.match(/text-align\s*:\s*(left|right)/))) at("physical-property", `text-align: ${m[1]} — use start/end`, m.index);
        if ((m = line.match(/float\s*:\s*(left|right)/))) at("physical-property", `float: ${m[1]} — use inline-start/inline-end`, m.index);
      }
      if ((m = line.match(/:dir\(/))) at("dir-selector", ":dir() gets rewritten by CSS minifiers; use logical properties", m.index);
    });
  return out;
}

function lintCss(css, contract, offset = { line: 0 }) {
  const out = cssRuleFindings(css).map((f) => ({ ...f, line: f.line + offset.line }));
  const pos = lineIndex(css);
  const clean = stripCssComments(css);
  for (const m of clean.matchAll(/var\((--ayy-[\w-]+)/g)) {
    if (contract.tokens.has(m[1]) || contract.hooks.has(m[1])) continue;
    const s = suggest(m[1], [...contract.tokens, ...contract.hooks]);
    const p = pos(m.index);
    out.push({ rule: "unknown-token", message: `${m[1]} is not an ayywi token${s ? ` — did you mean ${s}?` : ""}`, line: p.line + offset.line, column: p.column });
  }
  for (const block of clean.matchAll(/([^{};]+)\{/g)) {
    if (block[1].trim().startsWith("@")) continue;
    for (const m of block[1].matchAll(/\.(ayy-[\w-]+)/g)) {
      if (contract.classes.has(m[1])) continue;
      const p = pos(block.index + m.index);
      out.push({
        rule: "reserved-prefix",
        message: `.${m[1]} isn't an ayywi class — the ayy- prefix is reserved; name your own classes differently`,
        line: p.line + offset.line,
        column: p.column,
      });
    }
  }
  return out;
}

function lintMarkup(text, contract) {
  const out = [];
  const pos = lineIndex(text);
  const push = (rule, message, index) => out.push({ rule, message, ...pos(index) });
  const knownClasses = [...contract.classes.keys()];

  const checkClassTokens = (value, baseIndex) => {
    for (const m of value.matchAll(CLASS_TOKEN)) {
      const next = value[m.index + m[0].length];
      if (next === "-" || next === "_" || next === "$" || next === "{") continue; // built dynamically
      if (contract.classes.has(m[0])) continue;
      const s = suggest(m[0], knownClasses);
      push("unknown-class", `"${m[0]}" is not an ayywi class${s ? ` — did you mean "${s}"?` : ""}`, baseIndex + m.index);
    }
  };

  // class / className / :class / class:list / [ngClass] values
  for (const m of text.matchAll(/(?<![\w-])(?:class|className|:class|v-bind:class|class:list|\[class\]|\[ngClass\]|ngClass)\s*=\s*(?=["'`{[])/g)) {
    const start = m.index + m[0].length;
    const [value] = readValue(text, start);
    checkClassTokens(value, start + 1);
  }
  // classList.add("…") and friends
  for (const m of text.matchAll(/classList\.(?:add|remove|toggle|replace|contains)\(([^)]*)\)/g)) {
    checkClassTokens(m[1], m.index + m[0].indexOf(m[1]));
  }

  // Tokens anywhere (style attributes, CSS-in-JS)
  for (const m of text.matchAll(/var\((--ayy-[\w-]+)/g)) {
    if (contract.tokens.has(m[1]) || contract.hooks.has(m[1])) continue;
    const s = suggest(m[1], [...contract.tokens, ...contract.hooks]);
    push("unknown-token", `${m[1]} is not an ayywi token${s ? ` — did you mean ${s}?` : ""}`, m.index);
  }

  // Custom elements and their attributes
  for (const m of text.matchAll(/<(ayy-[a-z-]+)(?=[\s/>])/g)) {
    const tag = m[1];
    if (!contract.elementAttrs.has(tag)) {
      const s = suggest(tag, [...contract.elementAttrs.keys()]);
      push("unknown-element", `<${tag}> is not an ayywi element${s ? ` — did you mean <${s}>?` : ""}`, m.index);
      continue;
    }
    const attrs = contract.elementAttrs.get(tag);
    const openTag = text.slice(m.index, tagEnd(text, m.index));
    for (const a of openTag.matchAll(/\s([\w-]+)="([^"]*)"/g)) {
      const allowed = attrs[a[1]];
      if (allowed && !allowed.includes(a[2]))
        push("unknown-attribute-value", `<${tag} ${a[1]}="${a[2]}"> — expected one of: ${allowed.join(", ")}`, m.index + a.index + 1);
    }
  }

  // data-theme / data-density with a literal value (bound values like :data-theme="x" or data-theme={x} are skipped)
  for (const m of text.matchAll(/(?<=\s)(data-theme|data-density)=(["'])([^"'{}$]*)\2/g)) {
    const allowed = contract.globalAttrs.get(m[1]);
    if (allowed && !allowed.includes(m[3])) push("unknown-attribute-value", `${m[1]}="${m[3]}" — expected one of: ${allowed.join(", ")}`, m.index);
  }

  // React components: literal variant props
  for (const [comp, props] of contract.reactVariants) {
    for (const m of text.matchAll(new RegExp(`<${comp}(?=[\\s/>])`, "g"))) {
      const openTag = text.slice(m.index, tagEnd(text, m.index));
      for (const a of openTag.matchAll(/\s(\w+)=(?:"([^"]*)"|\{\s*["']([^"']*)["']\s*\})/g)) {
        const allowed = props[a[1]];
        const value = a[2] ?? a[3];
        if (allowed && !allowed.includes(value))
          push("unknown-variant", `<${comp} ${a[1]}="${value}"> — expected one of: ${allowed.join(", ")}`, m.index + a.index + 1);
      }
    }
  }

  // Class helpers: buttonClass({ variant: "…" })
  for (const m of text.matchAll(/\b(\w+Class)\(\s*\{([^}]*)\}/g)) {
    const keys = contract.helperVariants.get(m[1]);
    if (!keys) continue;
    for (const kv of m[2].matchAll(/(\w+)\s*:\s*["']([^"']+)["']/g)) {
      const allowed = keys[kv[1]];
      if (allowed && !allowed.includes(kv[2]))
        push("unknown-variant", `${m[1]}({ ${kv[1]}: "${kv[2]}" }) — expected one of: ${allowed.join(", ")}`, m.index + m[0].indexOf(kv[0]));
    }
  }

  // Icon-only buttons need an accessible name
  for (const m of text.matchAll(/<(button|a|Button)(?=[\s/>])/g)) {
    const openTag = text.slice(m.index, tagEnd(text, m.index));
    const icon = /ayy-button--icon(?:-sm)?\b/.test(openTag) || /\bsize=(?:"|\{\s*["'])icon(?:-sm)?["']/.test(openTag);
    if (icon && !/\baria-label(?:ledby)?\s*=/.test(openTag) && !/\{\s*\.\.\./.test(openTag))
      push("icon-button-label", "icon-only button needs aria-label (or aria-labelledby)", m.index);
  }

  // Icons take the text colour. A fixed colour on the <svg> (easy to keep when pasting one) makes it vanish in one theme.
  for (const m of text.matchAll(/<svg(?=[\s/>])/g)) {
    const openTag = text.slice(m.index, tagEnd(text, m.index));
    if (!/(?<![\w-])ayy-icon(?![\w-])/.test(openTag)) continue;
    for (const a of openTag.matchAll(/\s(color|fill|stroke)=["']([^"']*)["']/g)) {
      if (/^(?:currentColor|none|inherit|transparent)$/i.test(a[2]) || a[2].startsWith("var(")) continue;
      push("hardcoded-color", `<svg class="ayy-icon" ${a[1]}="${a[2]}"> — icons take the text colour; remove the attribute`, m.index + a.index + 1);
    }
  }

  // Another icon set next to Hugeicons
  for (const m of text.matchAll(/(?:\bfrom\s*|\bimport\s*\(\s*|\brequire\s*\(\s*|^\s*import\s+)(["'])([^"'\n]+)\1/gm)) {
    if (!OTHER_ICON_SETS.test(m[2])) continue;
    push(
      "icon-library",
      `"${m[2]}" — ayywi's icon library is Hugeicons: <Icon icon={…} /> with icons from @hugeicons/core-free-icons (iconSvg() outside React)`,
      m.index + m[0].indexOf(m[2]),
    );
  }

  // <style> blocks inside templates
  for (const m of text.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)) {
    const offsetLine = pos(m.index + m[0].indexOf(m[1])).line - 1;
    out.push(...lintCss(m[1], contract, { line: offsetLine }));
  }
  return out;
}

// ---------------------------------------------------------------- files

function globToRegExp(glob) {
  const re = glob
    .replace(/[.+^${}()|[\]\\]/g, "\\$&")
    .replace(/\*\*\/?/g, "\u0000")
    .replace(/\*/g, "[^/]*")
    .replace(/\u0000/g, ".*");
  return new RegExp(`^${re}$`);
}

export function loadConfig(cwd = process.cwd()) {
  const file = join(cwd, "ayywi.config.json");
  const user = existsSync(file) ? JSON.parse(readFileSync(file, "utf8")) : {};
  return { rules: { ...DEFAULT_RULES, ...(user.rules ?? {}) }, ignore: (user.ignore ?? []).map(globToRegExp) };
}

function applyDisables(findings, text) {
  const lines = text.split("\n");
  if (lines.slice(0, 5).some((l) => l.includes("ayywi-lint-disable-file"))) return [];
  return findings.filter((f) => {
    const line = lines[f.line - 1] ?? "";
    const prev = lines[f.line - 2] ?? "";
    return !line.includes("ayywi-lint-disable-line") && !prev.includes("ayywi-lint-disable-next-line");
  });
}

/** Lint one file's text. `file` decides the parser by extension. */
export function lintText(text, file, contract, config = { rules: DEFAULT_RULES }) {
  const ext = extname(file).toLowerCase();
  let findings = [];
  if (CSS_EXT.has(ext)) findings = lintCss(text, contract);
  else if (MARKUP_EXT.has(ext)) findings = lintMarkup(text, contract);
  return applyDisables(findings, text)
    .map((f) => ({ file, ...f, severity: config.rules[f.rule] ?? "error" }))
    .filter((f) => f.severity !== "off")
    .sort((a, b) => a.line - b.line || a.column - b.column);
}

function* walk(path, cwd, config) {
  const rel = relative(cwd, path).split("\\").join("/");
  if (rel && config.ignore.some((re) => re.test(rel))) return;
  const stat = statSync(path);
  if (stat.isDirectory()) {
    for (const name of readdirSync(path)) {
      if (SKIP_DIRS.has(name) || name.startsWith(".")) continue;
      yield* walk(join(path, name), cwd, config);
    }
  } else if (CSS_EXT.has(extname(path).toLowerCase()) || MARKUP_EXT.has(extname(path).toLowerCase())) {
    yield path;
  }
}

/** Lint files/directories. Returns { findings, files }. */
export function lintPaths(paths, { cwd = process.cwd(), contract = loadContract(), config = loadConfig(cwd) } = {}) {
  const findings = [];
  let files = 0;
  for (const p of paths.length ? paths : ["."]) {
    const abs = resolve(cwd, p);
    if (!existsSync(abs)) throw new Error(`No such file or directory: ${p}`);
    for (const file of walk(abs, cwd, config)) {
      files++;
      findings.push(...lintText(readFileSync(file, "utf8"), relative(cwd, file) || file, contract, config));
    }
  }
  return { findings, files };
}

export function formatFindings({ findings, files }) {
  const lines = findings.map((f) => `${f.file}:${f.line}:${f.column}  ${f.severity.padEnd(5)}  ${f.rule.padEnd(24)} ${f.message}`);
  const errors = findings.filter((f) => f.severity === "error").length;
  const warnings = findings.length - errors;
  lines.push(
    findings.length
      ? `\n✗ ${errors} error(s), ${warnings} warning(s) in ${new Set(findings.map((f) => f.file)).size} of ${files} file(s)`
      : `✓ ayywi lint: ${files} file(s), no problems`,
  );
  return lines.join("\n");
}
