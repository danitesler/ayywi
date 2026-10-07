// Brands: one seed colour (plus optional fonts and shape) → a full colour scale and the semantic tokens a product
// colours with, picked so every theme keeps its contrast. Pure functions, no DOM until setBrand() applies one.
import { themeBase, themes, tokens, type ThemeName } from "./tokens";

/** Steps of a brand scale, light (50) to dark (950). Each is an --ayy-brand-<step> custom property. */
export const BRAND_STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;
export type BrandStep = (typeof BRAND_STEPS)[number];

/** Corner presets. "pill" is ayywi's own shape; the others round buttons (and tabs, chips, badges) like controls. */
export const BRAND_SHAPES = {
  pill: { control: "var(--ayy-radius-xl)", card: "var(--ayy-radius-2xl)", button: "var(--ayy-radius-pill)" },
  round: { control: "var(--ayy-radius-xl)", card: "var(--ayy-radius-2xl)", button: "var(--ayy-radius-xl)" },
  soft: { control: "var(--ayy-radius-lg)", card: "var(--ayy-radius-xl)", button: "var(--ayy-radius-lg)" },
  sharp: { control: "var(--ayy-radius-sm)", card: "var(--ayy-radius-md)", button: "var(--ayy-radius-sm)" },
} as const;
export type BrandShape = keyof typeof BRAND_SHAPES;

/** What a brand is made from. Everything but `name` and `color` is optional. */
export interface BrandInput {
  /** kebab-case; the value of data-brand. */
  name: string;
  /** The seed: the brand colour as #rrggbb (or #rgb). */
  color: string;
  description?: string;
  /** Font families, first choice first. ayywi appends its fallbacks (system fonts for body text). Load the fonts yourself. */
  font?: { heading?: string | readonly string[]; body?: string | readonly string[]; mono?: string | readonly string[] };
  /** Corner preset (default "pill", ayywi's own). */
  shape?: BrandShape;
  /** Exact corner radii (px, rem or em), over the shape's. */
  radius?: { control?: string; card?: string; button?: string };
}

/** The semantic colours a brand sets in one colour scheme. */
export interface BrandColors {
  primary: string;
  primaryFg: string;
  ring: string;
  /** The scale step primary (and ring) came from. */
  step: BrandStep;
}

export interface BrandCheck {
  theme: ThemeName;
  /** e.g. "primary-fg on primary", "ring on surface". */
  pair: string;
  ratio: number;
  /** 4.5 for text, 3 for graphics and focus rings (WCAG 1.4.3, 1.4.11). */
  min: number;
  pass: boolean;
}

/** A generated brand: what brandCss() writes and setBrand() applies. */
export interface Brand {
  name: string;
  description?: string;
  seed: string;
  /** The step that holds the seed exactly. */
  seedStep: BrandStep;
  scale: Record<BrandStep, string>;
  dark: BrandColors;
  light: BrandColors;
  font: { heading?: string; body?: string; mono?: string };
  radius: { control: string; card: string; button: string };
  /** Every contrast pair in every theme. All pass: picks that wouldn't are skipped. */
  checks: BrandCheck[];
  /** Why a pick differs from the seed, in plain words. */
  notes: string[];
}

// ---- Colour maths: sRGB hex ↔ OKLCH (Björn Ottosson's OKLab), WCAG contrast ----

type Rgb = [number, number, number];

function parseHex(hex: string): Rgb {
  const m = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) throw new Error(`"${hex}" isn't a colour: use #rrggbb or #rgb`);
  const h = m[1].length === 3 ? [...m[1]].map((c) => c + c).join("") : m[1];
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255) as Rgb;
}

function toHex(rgb: Rgb): string {
  return `#${rgb.map((c) => Math.round(Math.min(1, Math.max(0, c)) * 255).toString(16).padStart(2, "0")).join("")}`;
}

const toLinear = (c: number) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const toGamma = (c: number) => (c <= 0.0031308 ? c * 12.92 : 1.055 * c ** (1 / 2.4) - 0.055);

function oklch(hex: string): { l: number; c: number; h: number } {
  const [r, g, b] = parseHex(hex).map(toLinear);
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  return { l: L, c: Math.hypot(A, B), h: Math.atan2(B, A) };
}

/** Linear sRGB of an OKLCH colour (may be out of gamut). */
function linearOf(L: number, C: number, h: number): Rgb {
  const A = C * Math.cos(h);
  const B = C * Math.sin(h);
  const l = (L + 0.3963377774 * A + 0.2158037573 * B) ** 3;
  const m = (L - 0.1055613458 * A - 0.0638541728 * B) ** 3;
  const s = (L - 0.0894841775 * A - 1.291485548 * B) ** 3;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
}

/** An OKLCH colour as #rrggbb, lowering chroma until it fits in sRGB (hue and lightness stay). */
function fromOklch(L: number, C: number, h: number): string {
  const fits = (c: number) => linearOf(L, c, h).every((v) => v >= -1e-4 && v <= 1 + 1e-4);
  let c = C;
  if (!fits(c)) {
    let lo = 0;
    let hi = C;
    for (let i = 0; i < 24; i++) {
      const mid = (lo + hi) / 2;
      if (fits(mid)) lo = mid;
      else hi = mid;
    }
    c = lo;
  }
  return toHex(linearOf(L, c, h).map((v) => toGamma(Math.min(1, Math.max(0, v)))) as Rgb);
}

/** WCAG relative luminance, 0–1. */
function luminance(hex: string): number {
  const [r, g, b] = parseHex(hex).map(toLinear);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** WCAG contrast ratio of two opaque colours, 1–21. */
export function contrastRatio(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

// Lightness of each step (OKLab L), and how much of the seed's chroma it keeps: the ends are near white and near black.
const STEP_L: Record<BrandStep, number> = { 50: 0.975, 100: 0.945, 200: 0.89, 300: 0.82, 400: 0.74, 500: 0.66, 600: 0.57, 700: 0.48, 800: 0.4, 900: 0.32, 950: 0.25 };
const STEP_C: Record<BrandStep, number> = { 50: 0.12, 100: 0.25, 200: 0.5, 300: 0.75, 400: 0.9, 500: 1, 600: 1, 700: 0.9, 800: 0.75, 900: 0.6, 950: 0.5 };

/**
 * An 11-step scale (50 lightest … 950 darkest) in the seed's hue, evenly spaced in perceived lightness.
 * The step nearest the seed's lightness is the seed itself, so the brand colour appears exactly.
 */
export function brandScale(seed: string): { scale: Record<BrandStep, string>; seedStep: BrandStep } {
  const hex = toHex(parseHex(seed));
  const { l, c, h } = oklch(hex);
  const seedStep = BRAND_STEPS.reduce((best, s) => (Math.abs(STEP_L[s] - l) < Math.abs(STEP_L[best] - l) ? s : best));
  const scale = {} as Record<BrandStep, string>;
  for (const s of BRAND_STEPS) scale[s] = s === seedStep ? hex : fromOklch(STEP_L[s], c * STEP_C[s], h);
  return { scale, seedStep };
}

// ---- Picking the semantic colours ----

const BLACK = tokens["palette.neutral.0"].value;
const WHITE = tokens["palette.neutral.100"].value;
const SURFACES = ["bg", "surface", "surface-raised"] as const;

function colorIn(name: `color.${string}`, theme: ThemeName): string {
  const t = (tokens as Record<string, { value: unknown; light?: string; themes?: Record<string, string> }>)[name];
  if (theme === "dark") return t.value as string;
  if (theme === "light") return t.light as string;
  return t.themes?.[theme] as string;
}

/** Contrast pairs for one primary colour in every theme of a scheme. */
function checksFor(scheme: "dark" | "light", primary: string, fg: string): BrandCheck[] {
  const out: BrandCheck[] = [];
  const add = (theme: ThemeName, pair: string, a: string, b: string, min: number) => {
    const ratio = contrastRatio(a, b);
    out.push({ theme, pair, ratio: Math.round(ratio * 100) / 100, min, pass: ratio >= min });
  };
  for (const theme of themes.filter((t) => themeBase[t] === scheme)) {
    add(theme, "primary-fg on primary", fg, primary, 4.5);
    // A checked checkbox or radio is told apart from the page by its fill, and the ring (the same colour) is the focus indicator.
    for (const s of SURFACES) add(theme, `primary and ring on ${s}`, primary, colorIn(`color.${s}`, theme), 3);
  }
  return out;
}

function pick(scheme: "dark" | "light", scale: Record<BrandStep, string>, seedStep: BrandStep): { colors: BrandColors; checks: BrandCheck[] } {
  // Nearest to the seed first; on a tie, the lighter step on dark themes and the darker one on light themes.
  const order = [...BRAND_STEPS].sort((a, b) => {
    const d = Math.abs(BRAND_STEPS.indexOf(a) - BRAND_STEPS.indexOf(seedStep)) - Math.abs(BRAND_STEPS.indexOf(b) - BRAND_STEPS.indexOf(seedStep));
    return d || (scheme === "dark" ? a - b : b - a);
  });
  for (const step of order) {
    const primary = scale[step];
    // Light themes put white text on primary, as ayywi's own near-black one does; black text there only keeps the seed itself.
    let fg = contrastRatio(WHITE, primary) >= contrastRatio(BLACK, primary) ? WHITE : BLACK;
    if (scheme === "light" && fg === BLACK && step !== seedStep && contrastRatio(WHITE, primary) < 4.5) continue;
    if (scheme === "light" && contrastRatio(WHITE, primary) >= 4.5) fg = WHITE;
    const checks = checksFor(scheme, primary, fg);
    if (checks.every((c) => c.pass)) return { colors: { primary, primaryFg: fg, ring: primary, step }, checks };
  }
  // Unreachable: step 50 passes on every dark theme and 950 on every light one.
  throw new Error(`No step of the brand scale keeps contrast on ${scheme} themes`);
}

// ---- Fonts and shape ----

// What follows a brand's own fonts: ayywi's stacks without its brand fonts. Body text keeps the system fonts (rule 10).
const fallbacks = (name: "font.heading" | "font.body" | "font.mono", drop: readonly string[]) =>
  (tokens[name].value as readonly string[]).filter((f) => !drop.includes(f));
const FONT_FALLBACK = {
  heading: fallbacks("font.heading", ["Unbounded", "Arial Black"]),
  body: fallbacks("font.body", ["Sora"]),
  mono: fallbacks("font.mono", []),
};

function fontStack(value: string | readonly string[], fallback: readonly string[]): string {
  const own = (typeof value === "string" ? value.split(",") : [...value]).map((f) => f.trim().replace(/^["']|["']$/g, "")).filter(Boolean);
  for (const f of own) if (!/^[\w\- .]+$/.test(f)) throw new Error(`font "${f}": use a family name (letters, digits, spaces, - and .)`);
  if (!own.length) throw new Error("a font list can't be empty");
  const seen = new Set<string>();
  return [...own, ...fallback]
    .filter((f) => !seen.has(f.toLowerCase()) && seen.add(f.toLowerCase()))
    .map((f) => (/\s/.test(f) ? `"${f}"` : f))
    .join(", ");
}

const LENGTH = /^(0|\d+(\.\d+)?(px|rem|em))$/;

// ---- Public API ----

/**
 * Generate a brand from a seed colour: an 11-step scale, then primary, primary-fg and ring for dark and light themes,
 * each taken from the scale step nearest the seed that keeps 4.5:1 text and 3:1 against every surface in every
 * theme. Fonts get ayywi's fallbacks; shape and radius set the corner tokens. Throws on invalid input.
 */
export function createBrand(input: BrandInput): Brand {
  if (!/^[a-z][a-z0-9]*(-[a-z0-9]+)*$/.test(input.name ?? "")) throw new Error(`brand name "${input.name}" must be kebab-case (e.g. "acme")`);
  const seed = toHex(parseHex(input.color));
  const { scale, seedStep } = brandScale(seed);
  const dark = pick("dark", scale, seedStep);
  const light = pick("light", scale, seedStep);
  const notes: string[] = [];
  for (const [scheme, p] of [["dark", dark], ["light", light]] as const) {
    if (p.colors.step !== seedStep) {
      notes.push(`On ${scheme} themes the seed doesn't keep contrast, so primary is brand-${p.colors.step} (${p.colors.primary}) instead of brand-${seedStep}.`);
    }
  }

  const shape = input.shape ?? "pill";
  if (!(shape in BRAND_SHAPES)) throw new Error(`shape "${shape}" should be one of: ${Object.keys(BRAND_SHAPES).join(", ")}`);
  const radius = { ...BRAND_SHAPES[shape] } as Brand["radius"];
  for (const [key, value] of Object.entries(input.radius ?? {})) {
    if (!(key in radius)) throw new Error(`radius.${key}: only control, card and button can be set`);
    if (!LENGTH.test(String(value))) throw new Error(`radius.${key} "${value}" should be a length in px, rem or em`);
    radius[key as keyof Brand["radius"]] = String(value);
  }

  const font: Brand["font"] = {};
  for (const key of ["heading", "body", "mono"] as const) {
    const value = input.font?.[key];
    if (value !== undefined) font[key] = fontStack(value, FONT_FALLBACK[key]);
  }

  return {
    name: input.name,
    description: input.description,
    seed,
    seedStep,
    scale,
    dark: dark.colors,
    light: light.colors,
    font,
    radius,
    checks: [...dark.checks, ...light.checks],
    notes,
  };
}

export interface BrandCssOptions {
  /** Where the brand applies. Default `[data-brand="<name>"]`; ":root" brands the whole page without an attribute. */
  selector?: string;
  /** Wrap in the ayywi.brand cascade layer (default true). Pass false next to ayywi.unlayered.css. */
  layer?: boolean;
}

/** The stylesheet for a brand (or a BrandInput, generated on the way). light-dark() serves both schemes and nested themes. */
export function brandCss(brand: Brand | BrandInput, options: BrandCssOptions = {}): string {
  const b = "scale" in brand ? brand : createBrand(brand);
  const sel = options.selector ?? `[data-brand="${b.name}"]`;
  const ld = (light: string, dark: string) => (light === dark ? dark : `light-dark(${light}, ${dark})`);
  const decls = [
    ...BRAND_STEPS.map((s) => `--ayy-brand-${s}: ${b.scale[s]};`),
    `--ayy-color-primary: ${ld(b.light.primary, b.dark.primary)};`,
    `--ayy-color-primary-fg: ${ld(b.light.primaryFg, b.dark.primaryFg)};`,
    `--ayy-color-ring: ${ld(b.light.ring, b.dark.ring)};`,
    `--ayy-color-glow: ${ld(b.light.primary, b.dark.primary)};`,
    `--ayy-radius-control: ${b.radius.control};`,
    `--ayy-radius-card: ${b.radius.card};`,
    `--ayy-radius-button: ${b.radius.button};`,
    ...(["heading", "body", "mono"] as const).filter((k) => b.font[k]).map((k) => `--ayy-font-${k}: ${b.font[k]};`),
  ];
  // Themed sections inside the brand declare their own colours, so the brand repeats on them.
  const rule = `${sel},\n${sel} :is([data-theme], .dark, .light) {\n${decls.map((d) => `  ${d}`).join("\n")}\n}`;
  const about = b.description ? `\n   ${b.description.replace(/\*\//g, "* /")}` : "";
  const head = `/* ayywi brand "${b.name}", from ${b.seed}. Generated by createBrand(); regenerate it rather than editing.${about} */`;
  if (options.layer === false) return `${head}\n${rule}\n`;
  return `${head}\n@layer ayywi.tokens, ayywi.base, ayywi.components, ayywi.brand;\n\n@layer ayywi.brand {\n${rule.replace(/^/gm, "  ")}\n}\n`;
}

/** A design token in DTCG form (the format Style Dictionary, Figma plugins and Tokens Studio read). */
export interface DtcgToken {
  $type: string;
  $value: string;
}
export type DtcgTree = { [key: string]: DtcgToken | DtcgTree };

/**
 * The tokens a brand overrides in one theme, as plain DTCG with concrete values: layer it over that theme's export
 * (@danitesler/ayywi/tokens/<theme>.json) for iOS, Android, Figma or Style Dictionary. Radii that point at ayywi's scale are resolved.
 */
export function brandTokens(brand: Brand | BrandInput, theme: ThemeName): DtcgTree {
  const b = "scale" in brand ? brand : createBrand(brand);
  const picks = b[themeBase[theme]];
  const color = (value: string): DtcgToken => ({ $type: "color", $value: value });
  const radius = (value: string): DtcgToken => {
    const ref = /^var\(--ayy-radius-([\w-]+)\)$/.exec(value);
    const t = ref ? (tokens as Record<string, { value: unknown }>)[`radius.${ref[1]}`] : undefined;
    return { $type: "dimension", $value: t ? String(t.value) : value };
  };
  const tree: DtcgTree = {
    brand: Object.fromEntries(BRAND_STEPS.map((s) => [String(s), color(b.scale[s])])),
    color: { primary: color(picks.primary), "primary-fg": color(picks.primaryFg), ring: color(picks.ring), glow: color(picks.primary) },
    radius: { control: radius(b.radius.control), card: radius(b.radius.card), button: radius(b.radius.button) },
  };
  const fonts = (["heading", "body", "mono"] as const).filter((k) => b.font[k]);
  if (fonts.length) tree.font = Object.fromEntries(fonts.map((k) => [k, { $type: "fontFamily", $value: b.font[k] as string }]));
  return tree;
}

/**
 * Apply a brand to `target` (default <html>) and everything inside it. Pass:
 * - a name, when its stylesheet is loaded (@danitesler/ayywi/brands/<name>.css, or your own brandCss() output);
 * - a BrandInput or Brand, to generate it and add its stylesheet to the page now (replacing an earlier one of the same name);
 * - null to go back to ayywi's monochrome default.
 * Brands are usually fixed per app, so the choice isn't persisted. Returns the generated brand, if any.
 */
export function setBrand(brand: string | BrandInput | Brand | null, target: HTMLElement = document.documentElement): Brand | undefined {
  if (brand === null) {
    target.removeAttribute("data-brand");
    return undefined;
  }
  if (typeof brand === "string") {
    target.setAttribute("data-brand", brand);
    return undefined;
  }
  const b = "scale" in brand ? brand : createBrand(brand);
  const doc = target.ownerDocument;
  let style = doc.head.querySelector<HTMLStyleElement>(`style[data-ayy-brand="${b.name}"]`);
  if (!style) {
    style = doc.createElement("style");
    style.setAttribute("data-ayy-brand", b.name);
    doc.head.append(style);
  }
  style.textContent = brandCss(b);
  target.setAttribute("data-brand", b.name);
  return b;
}
