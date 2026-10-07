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
  "img-size": "warn",
  "rebuilt-component": "warn",
  "component-override": "warn",
  "bare-control": "warn",
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
  const aka = new Map(); // "pill" → component name, from each meta's "aka"
  const owners = new Map(); // React component, class helper or element tag → component name

  for (const u of Object.keys(manifest.utilities ?? {})) classes.set(u, "utilities");
  for (const c of manifest.components) {
    for (const cls of Object.keys(c.classes)) classes.set(cls, c.name);
    const reactNames = Object.keys(c.react?.components ?? {});
    for (const n of reactNames) (reactComponents.add(n), owners.set(n, c.name));
    for (const a of c.aka ?? []) aka.set(a, c.name);
    if (c.element?.tag) owners.set(c.element.tag, c.name);
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
    for (const m of String(c.js ?? "").matchAll(/\b([a-z]\w*Class)\b/g)) if (!owners.has(m[1])) owners.set(m[1], c.name);
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
  return { manifest, classes, tokens, hooks, reactVariants, helperVariants, elementAttrs, reactComponents, globalAttrs, aka, owners };
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

// CSS named colours (not the system colours forced-colors blocks use, like CanvasText or Highlight).
const NAMED_COLORS = new Set(
  "aliceblue antiquewhite aqua aquamarine azure beige bisque black blanchedalmond blue blueviolet brown burlywood cadetblue chartreuse chocolate coral cornflowerblue cornsilk crimson cyan darkblue darkcyan darkgoldenrod darkgray darkgreen darkgrey darkkhaki darkmagenta darkolivegreen darkorange darkorchid darkred darksalmon darkseagreen darkslateblue darkslategray darkslategrey darkturquoise darkviolet deeppink deepskyblue dimgray dimgrey dodgerblue firebrick floralwhite forestgreen fuchsia gainsboro ghostwhite gold goldenrod gray green greenyellow grey honeydew hotpink indianred indigo ivory khaki lavender lavenderblush lawngreen lemonchiffon lightblue lightcoral lightcyan lightgoldenrodyellow lightgray lightgreen lightgrey lightpink lightsalmon lightseagreen lightskyblue lightslategray lightslategrey lightsteelblue lightyellow lime limegreen linen magenta maroon mediumaquamarine mediumblue mediumorchid mediumpurple mediumseagreen mediumslateblue mediumspringgreen mediumturquoise mediumvioletred midnightblue mintcream mistyrose moccasin navajowhite navy oldlace olive olivedrab orange orangered orchid palegoldenrod palegreen paleturquoise palevioletred papayawhip peachpuff peru pink plum powderblue purple rebeccapurple red rosybrown royalblue saddlebrown salmon sandybrown seagreen seashell sienna silver skyblue slateblue slategray slategrey snow springgreen steelblue tan teal thistle tomato turquoise violet wheat white whitesmoke yellow yellowgreen".split(" "),
);
// Properties whose value is (or includes) a colour.
const COLOR_PROPERTY = /(?:^|[\s;{])((?:background|color|fill|stroke|outline|box-shadow|text-shadow|caret-color|accent-color|column-rule|text-decoration(?:-color)?|border(?:-(?:block|inline|top|bottom|left|right)(?:-(?:start|end))?)?(?:-color)?))\s*:\s*([^;}]*)/g;

const stripCssComments = (css) => css.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, " "));
const CLASS_TOKEN = /(?<![\w-])ayy-[a-z0-9]+(?:(?:-{1,2}|_{2})[a-z0-9]+)*/g;

/** A JSX style object's body as CSS declarations, line for line: marginLeft: "4px", → margin-left: 4px; */
function jsxStyleToCss(body) {
  let out = "";
  let depth = 0;
  let quote = null;
  for (const ch of body) {
    if (quote) {
      if (ch === quote) quote = null;
      else out += ch;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === "`") quote = ch;
    else if (ch === "(" || ch === "[" || ch === "{") (depth++, (out += ch));
    else if (ch === ")" || ch === "]" || ch === "}") (depth--, (out += ch));
    else if (ch === "," && depth === 0) out += ";";
    else out += ch;
  }
  return out.replace(/(^|[\s;{])([a-z][a-zA-Z]*)(\s*:)/g, (_, pre, key, colon) => `${pre}${key.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`)}${colon}`);
}

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
      for (const d of line.matchAll(COLOR_PROPERTY)) {
        // Drop var(...) references, url(...) and strings first: token names aren't colours.
        const value = d[2].replace(/var\([^)]*\)|url\([^)]*\)|"[^"]*"|'[^']*'/g, " ");
        const named = value.match(/(?<![\w-])[a-zA-Z]+(?![\w-])/g)?.find((word) => NAMED_COLORS.has(word.toLowerCase()));
        if (named) at("hardcoded-color", `named colour "${named}" in ${d[1]} — use a --ayy-color-* token`, d.index + d[0].indexOf(d[2]));
      }
      if (!raw[i].includes("ayy-allow-physical")) {
        if ((m = line.match(/(^|[\s;{])((?:margin|padding|border)-(?:left|right)(?:-\w+)?)\s*:/)))
          at("physical-property", `${m[2]} — use the inline-start/inline-end form so RTL works`, m.index);
        if ((m = line.match(/(^|[\s;{])(border-(?:top|bottom)-(?:left|right)-radius)\s*:/)))
          at("physical-property", `${m[2]} — use border-start-start-radius and friends so RTL works`, m.index);
        if ((m = line.match(/(^|[\s;{])(left|right)\s*:/)))
          at("physical-property", `${m[2]}: — use inset-inline-start/end`, m.index);
        if ((m = line.match(/text-align\s*:\s*(left|right)/))) at("physical-property", `text-align: ${m[1]} — use start/end`, m.index);
        if ((m = line.match(/float\s*:\s*(left|right)/))) at("physical-property", `float: ${m[1]} — use inline-start/inline-end`, m.index);
      }
      if ((m = line.match(/:dir\(/))) at("dir-selector", ":dir() gets rewritten by CSS minifiers; use logical properties", m.index);
    });
  return out;
}

// ---------------------------------------------------------------- structure
// Whether app code rebuilds what ayywi already has: classes named after a component, rules that restyle one,
// native controls styled by hand. Class names and markup are matched across every file linted together.

/** Rules in comment-free CSS: { selector, decls: [[prop, value]], index (of the selector), at: ["@media …"] }. Nesting included. */
function cssRules(css) {
  const rules = [];
  const stack = [];
  let chunk = "";
  let chunkStart = 0;
  let quote = null;
  const declsOf = (text) =>
    text
      .split(";")
      .map((d) => d.match(/^\s*([\w-]+)\s*:([\s\S]*)$/))
      .filter(Boolean)
      .map((m) => [m[1].toLowerCase(), m[2].trim()]);
  for (let i = 0; i < css.length; i++) {
    const ch = css[i];
    if (quote) {
      if (ch === quote && css[i - 1] !== "\\") quote = null;
      chunk += ch;
      continue;
    }
    if (ch === '"' || ch === "'") quote = ch;
    if (ch === "{") {
      const prelude = chunk.trim();
      const index = chunkStart + chunk.search(/\S|$/);
      const parent = stack.findLast((f) => f.rule);
      let selector = prelude;
      if (!prelude.startsWith("@") && parent) {
        selector = prelude
          .split(",")
          .map((s) => (s.includes("&") ? s.replaceAll("&", parent.selector) : `${parent.selector} ${s.trim()}`))
          .join(", ");
      }
      stack.push({ rule: !prelude.startsWith("@"), prelude, selector, index, body: "" });
    } else if (ch === "}") {
      const frame = stack.pop();
      if (frame?.rule) {
        frame.body += chunk;
        rules.push({ selector: frame.selector, decls: declsOf(frame.body), index: frame.index, at: stack.filter((f) => !f.rule).map((f) => f.prelude) });
      }
    } else if (ch === ";") {
      const top = stack.at(-1);
      if (top?.rule) top.body += `${chunk};`;
    } else {
      chunk += ch;
      continue;
    }
    chunk = "";
    chunkStart = i + 1;
  }
  return rules;
}

const withoutParens = (s) => {
  let out = "";
  let depth = 0;
  for (const ch of s) {
    if (ch === "(") depth++;
    else if (ch === ")") depth = Math.max(0, depth - 1);
    else if (!depth) out += ch;
  }
  return out;
};
/** Compound selectors of a selector list, parenthesised parts (:not(), :has()…) left out. */
const compounds = (selector) => withoutParens(selector).split(/\s*[\s>+~,]\s*/).filter(Boolean);
/** The compound each selector in a list styles (the last one). */
const subjects = (selector) => withoutParens(selector).split(",").map((s) => s.trim().split(/\s*[\s>+~]\s*/).at(-1) ?? "");
const classesIn = (compound) => [...compound.matchAll(/\.(-?[_a-zA-Z][\w-]*)/g)].map((m) => m[1]);

// Words that end in an alias by accident.
const NOT_ALIASES = new Set(["discard", "standard", "orange", "arrange", "strange", "exchange", "stage", "postcard", "wildcard", "scorecard"]);

/** The ayywi component a class name says it is (".dooduu-chip", ".qa-spinner", ".hpill"), from the components' "aka" lists. */
export function componentNamed(cls, contract) {
  const block = cls.split(/__|--/)[0].toLowerCase();
  if (/^(?:is|has|js|u)-/.test(block) || block.startsWith("ayy-")) return null;
  const words = block.split(/[-_]/).filter(Boolean);
  for (let k = 0; k < words.length; k++) {
    const c = contract.aka.get(words.slice(k).join("-"));
    if (c) return c;
  }
  const last = words.at(-1) ?? "";
  if (NOT_ALIASES.has(last) || /[ai]ble$/.test(last)) return null;
  for (const [alias, c] of contract.aka)
    if (alias.length >= 4 && !alias.includes("-") && last.length > alias.length && last.length - alias.length <= 5 && last.endsWith(alias)) return c;
  return null;
}

/** Owner component of an ayy- class, React component, element tag or class helper (null for utilities). */
function ownerOf(name, contract) {
  const owner = contract.classes.get(name) ?? contract.owners.get(name);
  return owner && owner !== "utilities" ? owner : null;
}

/**
 * Which ayywi components each app class is used together with: class="ayy-card qa-card", <Card className="qa-card">,
 * className={chipClass({ className: "x" })}, or .ayy-card.qa-card in CSS. A class used that way extends the component.
 * Adds to `into` (class → Set of component names).
 */
export function collectCoUse(text, file, contract, into = new Map()) {
  const add = (cls, owner) => {
    if (!into.has(cls)) into.set(cls, new Set());
    into.get(cls).add(owner);
  };
  const ext = extname(file).toLowerCase();
  const fromCss = (css) => {
    for (const rule of cssRules(stripCssComments(css)))
      for (const compound of compounds(rule.selector)) {
        const cls = classesIn(compound);
        const owners = cls.map((c) => ownerOf(c, contract)).filter(Boolean);
        for (const c of cls) if (!c.startsWith("ayy-")) for (const o of owners) add(c, o);
      }
  };
  if (CSS_EXT.has(ext)) fromCss(text);
  else if (MARKUP_EXT.has(ext)) {
    for (const { value, tag } of classAttributes(text)) {
      const tokens = value.match(/[\w-]+/g) ?? [];
      const owners = [tag, ...tokens].map((t) => ownerOf(t, contract)).filter(Boolean);
      for (const t of tokens) if (!t.startsWith("ayy-")) for (const o of owners) add(t, o);
    }
    for (const m of text.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)) fromCss(m[1]);
  }
  return into;
}

/** Every class attribute in markup: { value, index (of the value), tag, openTag }. */
function classAttributes(text) {
  const out = [];
  for (const m of text.matchAll(/(?<![\w-])(?:class|className|:class|v-bind:class|class:list|\[class\]|\[ngClass\]|ngClass)\s*=\s*(?=["'`{[])/g)) {
    const start = m.index + m[0].length;
    const [value] = readValue(text, start);
    const lt = text.lastIndexOf("<", m.index);
    const tag = lt >= 0 ? (text.slice(lt).match(/^<([A-Za-z][\w.:-]*)/)?.[1] ?? "") : "";
    const openTag = tag && tagEnd(text, lt) > m.index ? text.slice(lt, tagEnd(text, lt)) : "";
    out.push({ value, expression: text[start] === "{" || text[start] === "[", index: start + 1, tag: openTag ? tag : "", openTag });
  }
  return out;
}

// Declarations that change how a component looks rather than where it sits.
const VISUAL_PROPERTY =
  /^(?:color|background(?:-color|-image)?|border(?:-(?:block|inline|top|bottom|left|right|start|end)(?:-(?:start|end))?)?(?:-(?:color|width|style|radius))?|border-(?:start|end)-(?:start|end)-radius|border-radius|outline(?:-color|-width|-style)?|box-shadow|padding(?:-[a-z-]+)?|font(?:-family|-size|-weight|-style)?|line-height|letter-spacing|text-transform|text-decoration(?:-[a-z]+)?|text-shadow|fill|stroke|accent-color|caret-color)$/;

/** rebuilt-component and component-override findings for one stylesheet. */
function structureFindings(css, contract, coUse) {
  const out = [];
  const pos = lineIndex(css);
  const seen = new Set();
  const slugOf = new Map(contract.manifest.components.map((c) => [c.name, c.slug]));
  const lookUp = (name) => `get_component("${slugOf.get(name)}") or llms/${slugOf.get(name)}.md`;
  for (const rule of cssRules(stripCssComments(css))) {
    // A class named after a component that is never used together with it.
    for (const m of rule.selector.matchAll(/\.(-?[_a-zA-Z][\w-]*)/g)) {
      const block = m[1].split(/__|--/)[0];
      if (m[1].startsWith("ayy-") || seen.has(block)) continue;
      seen.add(block);
      const comp = componentNamed(m[1], contract);
      if (!comp || coUse.get(m[1])?.has(comp) || coUse.get(block)?.has(comp)) continue;
      out.push({
        rule: "rebuilt-component",
        message: `.${block} looks like a hand-built ${comp} — use ayywi's ${comp} (${lookUp(comp)}); to adjust one, add your class next to its ayy- class and keep it to layout`,
        ...pos(rule.index + m.index),
      });
    }
    // A rule that changes how an ayywi component looks.
    if (rule.at.some((a) => /forced-colors/.test(a))) continue;
    let target = null;
    for (const subject of subjects(rule.selector)) {
      for (const c of classesIn(subject)) {
        target ??= c.startsWith("ayy-") ? ownerOf(c, contract) && { comp: ownerOf(c, contract), direct: true } : null;
        if (!target && !c.startsWith("ayy-")) {
          const comps = [...(coUse.get(c) ?? [])];
          if (comps.length === 1) target = { comp: comps[0], direct: false };
        }
      }
      if (target) break;
    }
    if (!target) continue;
    const visual = rule.decls
      .map(([p]) => p)
      .filter((p) => VISUAL_PROPERTY.test(p) || (target.direct && p.startsWith("--_")))
      .filter((p) => !(target.comp === "Icon" && /^(?:color|fill|stroke)$/.test(p))); // icons take a colour by design
    if (!visual.length) continue;
    out.push({
      rule: "component-override",
      message: `${rule.selector.replace(/\s+/g, " ").trim()} restyles ${target.comp} (${[...new Set(visual)].join(", ")}) — use its variants and sizes, a public custom property or a theme token instead (${lookUp(target.comp)}); app CSS on a component sets only layout: margin, size, position`,
      ...pos(rule.index),
    });
  }
  return out;
}

// Native controls and ARIA widgets ayywi styles: what to use instead.
const CONTROL_OF_TAG = {
  button: "Button", select: "Select", textarea: "Textarea", dialog: "Dialog", table: "Table", kbd: "Kbd",
  progress: "Progress", meter: "Progress", details: "Accordion",
};
const CONTROL_OF_INPUT = {
  checkbox: "Checkbox (or Switch, Chip)", radio: "Radio (or Segmented control, Choice card, Chip)", range: "Slider", number: "Number field",
  file: "File upload", submit: "Button", button: "Button", reset: "Button",
};
const CONTROL_OF_ROLE = {
  switch: "Switch", tablist: "Tabs or Segmented control", tab: "Tabs or Segmented control", menu: "Dropdown menu", menuitem: "Dropdown menu",
  menuitemcheckbox: "Dropdown menu", menuitemradio: "Dropdown menu", tooltip: "Tooltip", dialog: "Dialog or Popover", alertdialog: "Dialog",
  progressbar: "Progress", slider: "Slider", combobox: "Combobox", listbox: "Combobox or Select", radiogroup: "Radio or Segmented control",
  checkbox: "Checkbox", radio: "Radio", spinbutton: "Number field",
};

/** bare-control findings: a native control or ARIA widget with the app's own classes and none of ayywi's. */
function bareControlFindings(text, contract, push) {
  for (const { value, expression, index, tag, openTag } of classAttributes(text)) {
    if (!openTag || /\{\s*\.\.\./.test(openTag)) continue;
    const role = openTag.match(/\srole=["']([\w-]+)["']/)?.[1];
    let control = null;
    if (role) control = CONTROL_OF_ROLE[role] ?? null;
    else if (tag === "input") {
      const type = openTag.match(/\stype=["']([\w-]+)["']/)?.[1] ?? "text";
      control = type === "hidden" || type === "color" ? null : (CONTROL_OF_INPUT[type] ?? "Input");
    } else control = CONTROL_OF_TAG[tag] ?? null;
    if (control === "Button" && /\saria-pressed=/.test(openTag)) control = "Button, ChipButton or Segmented control";
    else if (control === "Button") control = "Button (ghost or icon size for small actions; ListLink or CardLink when a whole row or card is clickable)";
    if (!control) continue;
    // Only literal class names count: a bare expression (className={cls}) can't be judged.
    const literal = (expression ? [...value.matchAll(/(["'`])((?:(?!\1)[^\\]|\\.)*)\1/g)].map((m) => m[2]).join(" ") : value).replace(/\$\{[^}]*\}/g, " ");
    const names = [...new Set(literal.match(/(?<![\w$-])[a-zA-Z_][\w-]*/g) ?? [])];
    if (!names.length || /ayy-/.test(value) || [...value.matchAll(/\b(\w+)\s*\(/g)].some((m) => ownerOf(m[1], contract))) continue;
    push("bare-control", `<${tag}${role ? ` role="${role}"` : ""} class="${names.join(" ")}"> is styled by hand — use ayywi's ${control}, adding your class next to its ayy- class for layout`, index);
  }
}

function lintCss(css, contract, offset = { line: 0 }, coUse = new Map()) {
  const out = [...cssRuleFindings(css), ...structureFindings(css, contract, coUse)].map((f) => ({ ...f, line: f.line + offset.line }));
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

function lintMarkup(text, contract, coUse = new Map()) {
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
    if (/^[${*]/.test(text[m.index + m[0].length] ?? "")) continue; // built dynamically (var(--ayy-space-${n})) or a wildcard in prose (--ayy-color-*)
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

  bareControlFindings(text, contract, push);

  // Icon-only buttons need an accessible name
  for (const m of text.matchAll(/<(button|a|Button)(?=[\s/>])/g)) {
    const openTag = text.slice(m.index, tagEnd(text, m.index));
    const icon = /ayy-button--icon(?:-sm)?\b/.test(openTag) || /\bsize=(?:"|\{\s*["'])icon(?:-sm)?["']/.test(openTag);
    if (icon && !/\baria-label(?:ledby)?\s*=/.test(openTag) && !/\{\s*\.\.\./.test(openTag))
      push("icon-button-label", "icon-only button needs aria-label (or aria-labelledby)", m.index);
  }

  // Images without their size make the page jump while they load (and leave no box for a loading placeholder)
  for (const m of text.matchAll(/<img(?=[\s/>])/g)) {
    const openTag = text.slice(m.index, tagEnd(text, m.index));
    if (/\{\s*\.\.\./.test(openTag) || /ayy-avatar__image/.test(openTag)) continue; // spread props; avatars have a fixed box
    if (!/\swidth\s*=/.test(openTag) || !/\sheight\s*=/.test(openTag))
      push("img-size", "<img> needs width and height (its real pixel size) so the layout doesn't jump while it loads", m.index);
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

  // Inline styles get the same colour and direction rules as stylesheets: style="…" (HTML, Vue, Svelte, Angular)…
  for (const m of text.matchAll(/(?<![\w:.-])style\s*=\s*(["'])([^"']*)\1/g)) {
    const start = m.index + m[0].indexOf(m[2]);
    for (const f of cssRuleFindings(`{${m[2]}}`)) push(f.rule, `${f.message} (inline style)`, start + Math.max(0, f.column - 2));
  }
  // …and style={{ … }} objects (JSX): camelCase keys become CSS properties, quotes around values go.
  for (const m of text.matchAll(/(?<![\w-])style\s*=\s*\{\{([\s\S]*?)\}\}/g)) {
    const start = m.index + m[0].indexOf(m[1]);
    const css = jsxStyleToCss(m[1]);
    const lines = m[1].split("\n");
    for (const f of cssRuleFindings(css)) {
      const before = lines.slice(0, f.line - 1).reduce((n, l) => n + l.length + 1, 0);
      push(f.rule, `${f.message} (inline style)`, start + before);
    }
  }

  // <style> blocks inside templates
  for (const m of text.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)) {
    const offsetLine = pos(m.index + m[0].indexOf(m[1])).line - 1;
    out.push(...lintCss(m[1], contract, { line: offsetLine }, coUse));
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

/**
 * Lint one file's text. `file` decides the parser by extension. `coUse` (from collectCoUse over every file linted
 * together) says which app classes extend an ayywi component; without it only this file is looked at.
 */
export function lintText(text, file, contract, config = { rules: DEFAULT_RULES }, coUse = collectCoUse(text, file, contract)) {
  const ext = extname(file).toLowerCase();
  let findings = [];
  if (CSS_EXT.has(ext)) findings = lintCss(text, contract, undefined, coUse);
  else if (MARKUP_EXT.has(ext)) findings = lintMarkup(text, contract, coUse);
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
  const texts = [];
  for (const p of paths.length ? paths : ["."]) {
    const abs = resolve(cwd, p);
    if (!existsSync(abs)) throw new Error(`No such file or directory: ${p}`);
    for (const file of walk(abs, cwd, config)) texts.push([relative(cwd, file) || file, readFileSync(file, "utf8")]);
  }
  // Classes are matched across files: a stylesheet's .qa-card is fine when some template writes class="ayy-card qa-card".
  const coUse = new Map();
  for (const [file, text] of texts) collectCoUse(text, file, contract, coUse);
  const findings = texts.flatMap(([file, text]) => lintText(text, file, contract, config, coUse));
  return { findings, files: texts.length };
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
