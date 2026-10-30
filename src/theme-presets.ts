import type { BrandInput } from "./brand";
import type { IconPackName } from "./icon-packs";
import type { ThemeCustomization } from "./theme-customization";
import { themeFont } from "./theme-fonts";

/** A ready-made starting point that can also be edited as a custom theme. Every preset works in light and dark. */
export interface ThemePreset {
  id: string;
  label: string;
  brand: BrandInput | null;
  customization: ThemeCustomization;
  /** A suggested icon pack. Apply it with setIconPack; it is not part of the colours. */
  icons?: IconPackName;
}
const neutral = { color: "#0ea5e9", surface: "neutral", contrast: 0 } as const;
/** A gentle tint of the accent in the surfaces. */
const tint = (color: string): ThemeCustomization => ({ color, surface: "subtle", contrast: 0 });
/** Default, then one theme per colour family: warm, green, blue, purple, pink. */
export const THEME_PRESETS: readonly ThemePreset[] = [
  { id: "default", label: "Default", brand: null, customization: neutral },
  { id: "ember", label: "Ember", brand: { name: "ember", color: "#f2733c", shape: "sharp", font: themeFont("grotesk") }, customization: tint("#f2733c"), icons: "lucide" },
  { id: "forest", label: "Forest", brand: { name: "forest", color: "#4caf7d", shape: "soft", font: themeFont("friendly") }, customization: tint("#4caf7d"), icons: "feather" },
  { id: "arctic", label: "Arctic", brand: { name: "arctic", color: "#5e81ac", font: themeFont("technical") }, customization: tint("#5e81ac"), icons: "tabler" },
  { id: "twilight", label: "Twilight", brand: { name: "twilight", color: "#8b6cf0", font: themeFont("display") }, customization: tint("#8b6cf0") },
  { id: "wine", label: "Wine", brand: { name: "wine", color: "#d6506a", shape: "round", font: themeFont("editorial") }, customization: tint("#d6506a"), icons: "material-symbols" },
];
