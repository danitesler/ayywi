import type { BrandInput } from "./brand";

/** A heading and body pairing for a theme, from Google Fonts (free, open source). */
export interface ThemeFont {
  id: string;
  label: string;
  /** The families, for people choosing: "Fraunces + Sora". */
  description: string;
  /** What to pass as a brand's `font`. Omitted for ayywi's own fonts. */
  font?: BrandInput["font"];
  /** Google Fonts css2 `family=` values to load for it; none for fonts ayywi or the system already has. */
  google: readonly string[];
}

const serif = (name: string) => [name, "Georgia", "serif"] as const;
const mono = (name: string) => [name, "ui-monospace", "monospace"] as const;

export const THEME_FONTS: readonly ThemeFont[] = [
  { id: "default", label: "Default", description: "Unbounded + Sora", google: [] },
  { id: "editorial", label: "Editorial", description: "Fraunces + Sora", font: { heading: serif("Fraunces") }, google: ["Fraunces:wght@400..700"] },
  { id: "serif", label: "Serif", description: "Literata", font: { heading: serif("Literata"), body: serif("Literata") }, google: ["Literata:wght@400..700"] },
  { id: "sans", label: "Sans", description: "Sora", font: { heading: "Sora" }, google: ["Sora:wght@400;500;600;700"] },
  { id: "system", label: "System", description: "Your device's font", font: { heading: "system-ui", body: "system-ui" }, google: [] },
  { id: "grotesk", label: "Grotesk", description: "Space Grotesk + DM Sans", font: { heading: "Space Grotesk", body: "DM Sans" }, google: ["Space+Grotesk:wght@400..700", "DM+Sans:wght@400..700"] },
  { id: "technical", label: "Technical", description: "Space Mono + IBM Plex Sans", font: { heading: mono("Space Mono"), body: "IBM Plex Sans" }, google: ["Space+Mono:wght@400;700", "IBM+Plex+Sans:wght@400;500;600;700"] },
  { id: "friendly", label: "Friendly", description: "Bricolage Grotesque + Figtree", font: { heading: "Bricolage Grotesque", body: "Figtree" }, google: ["Bricolage+Grotesque:wght@400..700", "Figtree:wght@400..700"] },
  { id: "display", label: "Display", description: "Syne + Manrope", font: { heading: "Syne", body: "Manrope" }, google: ["Syne:wght@400..700", "Manrope:wght@400..700"] },
  { id: "readable", label: "Readable", description: "Lexend", font: { heading: "Lexend", body: "Lexend" }, google: ["Lexend:wght@400..700"] },
];

/** The font of a THEME_FONTS entry, for a brand. */
export function themeFont(id: string): BrandInput["font"] {
  const set = THEME_FONTS.find((item) => item.id === id);
  if (!set) throw new Error(`theme font "${id}" should be one of: ${THEME_FONTS.map((item) => item.id).join(", ")}`);
  return set.font;
}

/** One Google Fonts stylesheet URL for the given pairings (all of them by default): <link rel="stylesheet" href="…">. */
export function themeFontsUrl(fonts: readonly ThemeFont[] = THEME_FONTS): string {
  const families = [...new Set(fonts.flatMap((item) => item.google))];
  return families.length ? `https://fonts.googleapis.com/css2?${families.map((family) => `family=${family}`).join("&")}&display=swap` : "";
}
