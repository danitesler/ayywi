import { bodyFontAdjust, createBrand, contrastRatio, type BrandInput } from "./brand";
import type { IconPackName } from "./icon-packs";
import { tokens, type TokenDefinition } from "./tokens";

/** How much of the chosen colour is painted onto backgrounds: none, or a quiet tint. */
export type SurfaceStyle = "neutral" | "subtle";

/** The tint strength (0–100) behind a surface style: neutral 0, subtle 37.5. */
export function surfaceStrength(surface: SurfaceStyle): number {
  if (surface === "neutral") return 0;
  if (surface === "subtle") return 37.5;
  throw new Error('Surface must be "neutral" or "subtle"');
}
export interface ThemeCustomization {
  color: string;
  surface: SurfaceStyle;
  /** Optional text colour, adjusted toward the default where necessary for contrast. */
  textColor?: string;
  /** Optional fonts and corners for a monochrome theme. */
  appearance?: Pick<BrandInput, "font" | "shape">;
  /** 0 is the default; 100 brings the dark page to black. */
  contrast: number;
  /** The icon pack that goes with the theme. Stored data only: setThemeCustomization leaves it alone, so call setIconPack with it. */
  icons?: IconPackName;
}
export const DEFAULT_THEME_CUSTOMIZATION: ThemeCustomization = { color: "#0ea5e9", surface: "neutral", contrast: 0 };

const table = tokens as unknown as Record<string, TokenDefinition>;
const surfaces = ["bg", "surface", "surface-raised"] as const;
const text = ["text", "text-soft", "muted", "destructive", "success", "warning", "info", "ai", "ai-active"];
const tinted = ["destructive", "success", "warning", "info", "ai-active"];
const value = (name: string, scheme: "light" | "dark") => {
  const t = table[name];
  return String(scheme === "light" && t.light !== undefined ? t.light : t.value);
};
const mix = (a: string, b: string, weight: number): string => {
  const component = (s: string, i: number) => parseInt(s.slice(i, i + 2), 16);
  return "#" + [1, 3, 5].map((i) => Math.round(component(a, i) * weight + component(b, i) * (1 - weight)).toString(16).padStart(2, "0")).join("");
};

/** Return safe surfaces for each scheme; tint is reduced until all built-in contrast pairs pass. */
export function createThemeCustomization(input: ThemeCustomization, brandColor: string | null = input.color): Record<"light" | "dark", Record<typeof surfaces[number], string>> {
  if (!/^#[0-9a-f]{6}$/i.test(input.color)) throw new Error("Theme color must be #rrggbb");
  if (input.textColor !== undefined && !/^#[0-9a-f]{6}$/i.test(input.textColor)) throw new Error("Text color must be #rrggbb");
  const desiredStrength = surfaceStrength(input.surface) * 0.0008;
  if (input.appearance) createBrand({ name: "theme-appearance", color: input.color, ...input.appearance });
  if (!Number.isFinite(input.contrast) || input.contrast < 0 || input.contrast > 100) throw new Error("Contrast must be between 0 and 100");
  const brand = brandColor === null ? null : createBrand({ name: "custom-theme", color: brandColor });
  const build = (scheme: "light" | "dark") => {
    const base = surfaces.map((s) => value(`color.${s}`, scheme));
    const extreme = scheme === "dark" ? "#000000" : "#ffffff";
    const level = input.contrast / 100;
    const backdrops = base.map((v, i) => mix(extreme, v, level * (i === 0 ? 1 : 0.5)));
    const isSafe = (bg: string) => {
      const c = (name: string) => value(`color.${name}`, scheme);
      if (text.some((name) => contrastRatio(c(name), bg) < 4.5)) return false;
      if (tinted.some((name) => contrastRatio(c(name), mix(c(name), bg, 0.15)) < 4.5)) return false;
      if (contrastRatio(brand ? brand[scheme].primary : c("primary"), bg) < 3) return false;
      const wash = mix(c("text"), bg, 0.04);
      if (["text", "text-soft"].some((name) => contrastRatio(c(name), wash) < 4.5)) return false;
      for (const [name, token] of Object.entries(table)) {
        if (name.startsWith("chart.")) {
          const color = String(scheme === "light" && token.light !== undefined ? token.light : token.value);
          if (contrastRatio(color, bg) < 3 || contrastRatio(c("text"), mix(color, bg, 0.18)) < 4.5) return false;
        }
        if (name.startsWith("accent.")) {
          const raw = String(token.value);
          const color = scheme === "light" ? mix(raw, c("text"), 0.45) : raw;
          if (contrastRatio(color, bg) < 4.5) return false;
        }
      }
      return true;
    };
    let strength = desiredStrength;
    // Find the strongest safe tint at or below the requested strength.
    if (backdrops.some((bg) => !isSafe(mix(input.color, bg, strength)))) {
      let low = 0;
      let high = strength;
      for (let i = 0; i < 12; i++) {
        const mid = (low + high) / 2;
        if (backdrops.every((bg) => isSafe(mix(input.color, bg, mid)))) low = mid;
        else high = mid;
      }
      strength = low;
    }
    const result = backdrops.map((bg, i) => {
      const tintedBg = mix(input.color, bg, strength);
      return isSafe(tintedBg) ? tintedBg : base[i];
    });
    return Object.fromEntries(surfaces.map((name, i) => [name, result[i]])) as Record<typeof surfaces[number], string>;
  };
  return { light: build("light"), dark: build("dark") };
}

/** Text colour for each scheme, adjusted toward the default until it remains legible on every surface. */
export function createThemeText(input: ThemeCustomization, palette = createThemeCustomization(input)): Record<"light" | "dark", string> {
  const pick = (scheme: "light" | "dark") => {
    const fallback = value("color.text", scheme);
    if (!input.textColor) return fallback;
    if (!/^#[0-9a-f]{6}$/i.test(input.textColor)) throw new Error("Text color must be #rrggbb");
    const safe = (textColor: string) => surfaces.every((name) => {
      const bg = palette[scheme][name];
      const wash = mix(textColor, bg, 0.04);
      if (contrastRatio(textColor, bg) < 4.5 || contrastRatio(textColor, wash) < 4.5 || contrastRatio(value("color.text-soft", scheme), wash) < 4.5) return false;
      for (const [key, token] of Object.entries(table)) {
        if (key.startsWith("chart.")) {
          const color = String(scheme === "light" && token.light !== undefined ? token.light : token.value);
          if (contrastRatio(textColor, mix(color, bg, 0.18)) < 4.5) return false;
        }
        if (scheme === "light" && key.startsWith("accent.") && contrastRatio(mix(String(token.value), textColor, 0.45), bg) < 4.5) return false;
      }
      return true;
    });
    if (safe(input.textColor)) return input.textColor;
    if (!safe(fallback)) return fallback;
    let low = 0;
    let high = 1;
    for (let i = 0; i < 14; i++) {
      const mid = (low + high) / 2;
      if (safe(mix(fallback, input.textColor, mid))) high = mid;
      else low = mid;
    }
    return mix(fallback, input.textColor, high);
  };
  return { light: pick("light"), dark: pick("dark") };
}

const applied = new WeakMap<HTMLElement, { id: number; style: HTMLStyleElement }>();
let nextId = 0;

/** Apply the customization to an element and its nested light/dark sections. Pass the active brand seed, or null for mono. */
export function setThemeCustomization(input: ThemeCustomization | null, target?: HTMLElement, brandColor: string | null = input?.color ?? null): void {
  const el = target ?? (typeof document !== "undefined" ? document.documentElement : null);
  if (!el) return;
  if (!input) {
    applied.get(el)?.style.remove();
    applied.delete(el);
    el.removeAttribute("data-ayy-custom-theme");
    return;
  }
  const palette = createThemeCustomization(input, brandColor);
  let entry = applied.get(el);
  if (!entry) {
    const style = el.ownerDocument.createElement("style");
    style.dataset.ayyThemeCustomization = "";
    el.ownerDocument.head.append(style);
    entry = { id: ++nextId, style };
    applied.set(el, entry);
  }
  const textColors = createThemeText(input, palette);
  const appearance = input.appearance && brandColor === null ? createBrand({ name: "theme-appearance", color: input.color, ...input.appearance }) : null;
  const decl = [
    ...surfaces.map((name) => `--ayy-color-${name}: light-dark(${palette.light[name]}, ${palette.dark[name]});`),
    `--ayy-color-glass: light-dark(${palette.light.bg}c7, ${palette.dark.surface}c7);`,
    ...(input.textColor ? [`--ayy-color-text: light-dark(${textColors.light}, ${textColors.dark});`] : []),
    ...(appearance ? [
      ...(["control", "card", "button"] as const).map((key) => `--ayy-radius-${key}: ${appearance.radius[key]};`),
      ...(["heading", "body", "mono"] as const).filter((key) => appearance.font[key]).map((key) => `--ayy-font-${key}: ${appearance.font[key]};`),
      ...(appearance.font.body ? [bodyFontAdjust(appearance.font.body)] : []),
    ] : []),
  ].join("\n");
  const selector = `[data-ayy-custom-theme="${entry.id}"]`;
  entry.style.textContent = `${selector}, ${selector} :where([data-theme], .dark, .light) { ${decl} }`;
  el.setAttribute("data-ayy-custom-theme", String(entry.id));
}
