// Icon packs: tokens/icon-packs/<id>.json, one per pack. hugeicons is the default and names every glyph ayywi draws, plus common app icons;
// the others map those names to their own glyphs (null = not in the pack, the default pack's glyph is used instead).
import { readdirSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { join } from "node:path";

export const DEFAULT_PACK = "hugeicons";

/** Every pack in tokens/icon-packs/, the default first, then alphabetical by id. */
export function loadPacks(root) {
  const dir = join(root, "tokens/icon-packs");
  return readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => ({ id: f.slice(0, -".json".length), file: `tokens/icon-packs/${f}`, ...JSON.parse(readFileSync(join(dir, f), "utf8")) }))
    .sort((a, b) => (a.id === DEFAULT_PACK ? -1 : b.id === DEFAULT_PACK ? 1 : a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
}

/** The glyph names: the default pack's keys, in file order. */
export function iconNames(packs) {
  const base = packs.find((p) => p.id === DEFAULT_PACK);
  if (!base) throw new Error(`tokens/icon-packs/${DEFAULT_PACK}.json is missing`);
  return Object.keys(base.glyphs);
}

/** Problems with a pack, as messages (empty when valid): fields packCss needs, names it lacks, names nothing uses, and gaps in the default pack. */
export function validatePack(pack, names) {
  const errors = [];
  for (const field of ["label", "license", "copyright", "package", "source"]) if (!pack[field]) errors.push(`${pack.id}: missing ${field}`);
  const own = Object.keys(pack.glyphs);
  for (const n of names) if (!own.includes(n)) errors.push(`${pack.id}: missing "${n}"`);
  for (const n of own) if (!names.includes(n)) errors.push(`${pack.id}: unknown "${n}"`);
  if (pack.id === DEFAULT_PACK) {
    for (const n of own) if (pack.glyphs[n] === null) errors.push(`${pack.id}: the default pack can't leave "${n}" empty`);
  }
  return errors;
}

// SVG attributes that really are camelCase; every other camelCase key is a presentation attribute (strokeWidth → stroke-width).
// The same list as iconSvg() in src/components/icon/icon.ts, which draws the inline glyphs (a node test keeps the two equal).
const CAMEL_CASE = new Set([
  "viewBox", "preserveAspectRatio", "pathLength", "gradientUnits", "gradientTransform", "spreadMethod",
  "patternUnits", "patternContentUnits", "patternTransform", "clipPathUnits", "maskUnits", "maskContentUnits",
  "markerUnits", "markerWidth", "markerHeight", "refX", "refY", "stdDeviation", "filterUnits", "primitiveUnits",
]);
const attributeName = (key) => (CAMEL_CASE.has(key) ? key : key.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`));
const escape = (value) => String(value).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
const XMLNS = 'xmlns="http://www.w3.org/2000/svg"';

/**
 * The pack's glyph for `name` as a standalone SVG document (with xmlns, so it renders as an image), or the default
 * pack's when the pack maps the name to null. A `data` source is Hugeicons' IconData, drawn as iconSvg() draws it;
 * an `svg` source is a file inside the pack's package.
 */
export function glyphSvg(pack, name, root) {
  const glyph = pack.glyphs[name];
  if (glyph === undefined || (glyph === null && pack.id === DEFAULT_PACK)) throw new Error(`${pack.id}: no glyph "${name}"`);
  if (glyph === null) return glyphSvg(loadPacks(root).find((p) => p.id === DEFAULT_PACK), name, root);
  if (pack.source.data) {
    const mod = createRequire(join(root, "package.json"))(pack.source.data.replace("{name}", glyph));
    const data = mod.default ?? mod; // the CJS build exports the IconData itself
    const shapes = data.map(([tag, { key: _key, ...attributes }]) => `<${tag}${Object.entries(attributes).map(([k, v]) => ` ${attributeName(k)}="${escape(v)}"`).join("")}/>`);
    return `<svg ${XMLNS} viewBox="0 0 24 24" fill="none">${shapes.join("")}</svg>`;
  }
  if (pack.source.svg) {
    const svg = readFileSync(join(root, "node_modules", pack.package, pack.source.svg.replace("{name}", glyph)), "utf8");
    return /<svg\b[^>]*\bxmlns=/.test(svg) ? svg : svg.replace(/<svg\b/, `<svg ${XMLNS}`);
  }
  throw new Error(`${pack.id}: source needs "data" or "svg"`);
}

/**
 * An SVG as a CSS mask image: url("data:image/svg+xml,…"). Drops the root's width, height and class (the viewBox
 * sizes it), paints everything black (a mask only reads alpha; `none` stays), and encodes what a CSS string and a
 * URL can't hold, on one line.
 */
export function toDataUri(svg) {
  const clean = svg
    .replace(/<\?xml[^>]*\?>|<!--[\s\S]*?-->/g, "")
    .replace(/\s+/g, " ")
    .replace(/>\s+</g, "><")
    .trim()
    .replace(/<svg\b[^>]*>/, (tag) => tag.replace(/\s(?:width|height|class)=(?:"[^"]*"|'[^']*')/g, ""))
    .replace(/\b(fill|stroke)=(?:"(?!none")[^"]*"|'(?!none')[^']*')/g, '$1="black"')
    .replace(/currentColor/g, "black");
  if (!/^<svg\b[^>]*\bviewBox=/.test(clean)) throw new Error(`icon SVG without a viewBox: ${clean.slice(0, 80)}`);
  const encoded = clean.replace(/%/g, "%25").replace(/"/g, "'").replace(/#/g, "%23").replace(/</g, "%3C").replace(/>/g, "%3E");
  return `url("data:image/svg+xml,${encoded}")`;
}

/**
 * src/css/icon-packs/<id>.css: under [data-ayy-icons="<id>"], every built-in glyph (an .ayy-icon with data-ayy-icon)
 * is drawn as a mask filled with currentColor, and its inline paths are hidden. Every pack defines every name, so the
 * nearest data-ayy-icons wins. A page without this file keeps the inline paths.
 * Forced colours: the fill is a background, which High Contrast would repaint as Canvas and hide the glyph, so the icon
 * opts out. `none` alone keeps the author's colour too (currentColor stays unforced); preserve-parent-color takes the
 * parent's forced colour (CanvasText, LinkText, ButtonText…), with `none` for browsers without it.
 */
export function packCss(pack, names, root) {
  const scope = `[data-ayy-icons="${pack.id}"]`;
  const known = `:is(${names.map((n) => `[data-ayy-icon="${n}"]`).join(", ")})`;
  const vars = names.map((n) => `    --_ayy-glyph-${n}: ${toDataUri(glyphSvg(pack, n, root))};`).join("\n");
  const pick = names.map((n) => `  .ayy-icon[data-ayy-icon="${n}"] { --_ayy-glyph: var(--_ayy-glyph-${n}); }`).join("\n");
  return `/*! ${pack.label}${pack.label.endsWith("Icons") ? "" : " icons"} for ayywi — ${pack.license}, ${pack.copyright}. Generated from ${pack.file}; do not edit. */
@layer ayywi.components {
  ${scope} {
${vars}
  }
  ${scope} .ayy-icon${known} { -webkit-print-color-adjust: exact; print-color-adjust: exact; forced-color-adjust: none; forced-color-adjust: preserve-parent-color; background-color: currentColor; mask: var(--_ayy-glyph) center / contain no-repeat; }
  ${scope} .ayy-icon${known} > * { display: none; }
${pick}
}
`;
}
