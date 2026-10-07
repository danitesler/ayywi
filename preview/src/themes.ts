import { themeBase, themes, type ThemeName, type TokenDefinition } from "@danitesler/ayywi";

/** Themes in display order: each base theme followed by its variants. */
export const themeOptions: { name: ThemeName; label: string; base: "dark" | "light" }[] = [...themes]
  .sort((a, b) => themeBase[a].localeCompare(themeBase[b]) || Number(a !== themeBase[a]) - Number(b !== themeBase[b]) || a.localeCompare(b))
  .map((name) => ({ name, label: (name.charAt(0).toUpperCase() + name.slice(1)).replace(/-/g, " "), base: themeBase[name] }));

const show = (v: TokenDefinition["value"]) => (Array.isArray(v) ? v.join(", ") : String(v));

/** A token's value in a theme, when the generated table knows it (derived colours only have dark and light). */
export function valueIn(t: TokenDefinition, theme: ThemeName): string | undefined {
  if (t.light === undefined) return show(t.value);
  if (theme === "dark") return show(t.value);
  if (theme === "light") return t.light;
  return t.themes?.[theme];
}

function channel(c: number): number {
  const s = c / 255;
  return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
}

function luminance(hex: string): number {
  const h = hex.replace("#", "");
  const [r, g, b] = [0, 2, 4].map((i) => channel(parseInt(h.slice(i, i + 2), 16)));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** WCAG contrast ratio of two opaque #rrggbb colours. */
export function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}
