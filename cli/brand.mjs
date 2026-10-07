// ayywi brand — a brand stylesheet from a seed colour (or a brand JSON file), with the contrast report.
// The colour work is createBrand() from the built package, so the CLI, the MCP tool and setBrand() agree.
import { existsSync, readFileSync, writeFileSync } from "node:fs";

const lib = () => import(new URL("../dist/index.js", import.meta.url).href);

/** BrandInput from CLI words: a #seed or a .json path, then --name, --shape, --heading/--body/--mono, --radius-<part>. */
export function brandInput(args, options) {
  const [source] = args;
  if (!source) throw new Error("give a seed colour (#7c3aed) or a brand JSON file");
  const input = /\.json$/i.test(source) ? JSON.parse(readFileSync(source, "utf8")) : { color: source };
  if (input.$description && !input.description) input.description = input.$description;
  for (const k of Object.keys(input)) if (k.startsWith("$")) delete input[k];
  if (options.name) input.name = options.name;
  input.name ??= "brand";
  if (options.shape) input.shape = options.shape;
  if (options.description) input.description = options.description;
  for (const part of ["heading", "body", "mono"]) if (options[part]) input.font = { ...input.font, [part]: options[part] };
  for (const part of ["control", "card", "button"]) if (options[`radius-${part}`]) input.radius = { ...input.radius, [part]: options[`radius-${part}`] };
  return input;
}

/** The brand as text people and agents can read: picks, why, the scale and every contrast check. */
export function brandReport(brand) {
  const lines = [
    `Brand "${brand.name}" from ${brand.seed} (the seed is --ayy-brand-${brand.seedStep}).`,
    `Dark themes:  primary ${brand.dark.primary} (brand-${brand.dark.step}), text on it ${brand.dark.primaryFg}`,
    `Light themes: primary ${brand.light.primary} (brand-${brand.light.step}), text on it ${brand.light.primaryFg}`,
    ...brand.notes,
    `Corners: control ${brand.radius.control}, card ${brand.radius.card}, button ${brand.radius.button}`,
    ...["heading", "body", "mono"].filter((k) => brand.font[k]).map((k) => `Font ${k}: ${brand.font[k]} (load the font files yourself)`),
    `Scale: ${Object.entries(brand.scale).map(([s, hex]) => `${s} ${hex}`).join(", ")}`,
    "Contrast (every pair passes; steps that wouldn't were skipped):",
    ...brand.checks.map((c) => `  ${c.pass ? "✓" : "✗"} ${c.theme.padEnd(10)} ${c.pair.padEnd(34)} ${c.ratio.toFixed(2)}:1 (needs ${c.min}:1)`),
  ];
  return lines.join("\n");
}

export async function brand(args, options) {
  const { createBrand, brandCss } = await lib();
  const b = createBrand(brandInput(args, options));
  const css = brandCss(b, { layer: !options.unlayered });
  if (options.json) {
    process.stdout.write(`${JSON.stringify({ ...b, css }, null, 2)}\n`);
    return;
  }
  if (options.out) {
    if (existsSync(options.out) && !options.force) throw new Error(`${options.out} exists; pass --force to replace it`);
    writeFileSync(options.out, css);
    console.error(`Wrote ${options.out}. Load it after ayywi's CSS and put data-brand="${b.name}" on <html> (or any element).\n`);
  } else {
    process.stdout.write(css);
  }
  console.error(brandReport(b));
}
