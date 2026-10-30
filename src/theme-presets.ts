import type { BrandInput } from "./brand";
import type { IconPackName } from "./icon-packs";
import type { ThemeCustomization } from "./theme-customization";
import { themeFont } from "./theme-fonts";

/** A ready-made starting point that can also be edited as a custom theme. */
export interface ThemePreset {
  id: string;
  label: string;
  theme: "light" | "dark";
  brand: BrandInput | null;
  customization: ThemeCustomization;
  /** A suggested icon pack. Apply it with setIconPack; it is not part of the colours. */
  icons?: IconPackName;
}
const neutral = { color: "#0ea5e9", surface: "neutral", contrast: 0 } as const;
/** A gentle tint of the accent in the surfaces. */
const tint = (color: string): ThemeCustomization => ({ color, surface: "subtle", contrast: 0 });
/** Each group runs warm, green, blue, purple, pink after its Default, so the Dark and Light columns pair similar colours. */
export const THEME_PRESETS: readonly ThemePreset[] = [
  { id: "light", label: "Light", theme: "light", brand: null, customization: neutral },
  { id: "dark", label: "Dark", theme: "dark", brand: null, customization: neutral },
  { id: "ember", label: "Ember", theme: "dark", brand: { name: "ember", color: "#f2733c", shape: "sharp", font: themeFont("grotesk") }, customization: tint("#f2733c") },
  { id: "forest", label: "Forest", theme: "dark", brand: { name: "forest", color: "#4caf7d", shape: "soft", font: themeFont("friendly") }, customization: tint("#4caf7d"), icons: "feather" },
  { id: "arctic", label: "Arctic", theme: "dark", brand: { name: "arctic", color: "#5e81ac", font: themeFont("technical") }, customization: tint("#5e81ac"), icons: "tabler" },
  { id: "twilight", label: "Twilight", theme: "dark", brand: { name: "twilight", color: "#bd93f9", font: themeFont("display") }, customization: tint("#bd93f9") },
  { id: "wine", label: "Wine", theme: "dark", brand: { name: "wine", color: "#e0566b", shape: "round", font: themeFont("editorial") }, customization: tint("#e0566b") },
  { id: "sunlit", label: "Sunlit", theme: "light", brand: { name: "sunlit", color: "#b58900", font: themeFont("readable") }, customization: tint("#b58900") },
  { id: "lagoon", label: "Lagoon", theme: "light", brand: { name: "lagoon", color: "#0f8b8d", shape: "round", font: themeFont("sans") }, customization: tint("#0f8b8d"), icons: "lucide" },
  { id: "paper", label: "Paper", theme: "light", brand: { name: "paper", color: "#2f5d8a", shape: "sharp", font: themeFont("serif") }, customization: tint("#2f5d8a"), icons: "material-symbols" },
  { id: "lavender", label: "Lavender", theme: "light", brand: { name: "lavender", color: "#7c5cd6", shape: "soft", font: themeFont("system") }, customization: tint("#7c5cd6") },
  { id: "blush", label: "Blush", theme: "light", brand: { name: "blush", color: "#c35f87" }, customization: tint("#c35f87") },
];
