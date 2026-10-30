import { BRAND_SHAPES, type BrandShape } from "@danitesler/ayywi";

/** The pieces the Themes page (#/themes) is built from: accent colours and corner shapes. */
export const brandPage = {
  route: "brand",
  title: "Themes",
  text: "brand branding colour color seed scale primary ring contrast fonts shape radius corners setBrand createBrand brandCss data-brand violet",
};

export interface PresetBrand {
  name: string;
  label: string;
  color: string;
  shape?: BrandShape;
  isMono?: boolean;
}

export const BRAND_PRESETS: PresetBrand[] = [
  { name: "mono", label: "Mono", color: "var(--ayy-color-text)", isMono: true },
  { name: "sky", label: "Sky", color: "#0ea5e9", shape: "pill" },
  { name: "violet", label: "Violet", color: "#7c3aed", shape: "soft" },
  { name: "emerald", label: "Emerald", color: "#10b981", shape: "round" },
  { name: "rose", label: "Rose", color: "#f43f5e", shape: "pill" },
  { name: "amber", label: "Amber", color: "#f59e0b", shape: "soft" },
];

export const SHAPES = Object.keys(BRAND_SHAPES) as BrandShape[];
