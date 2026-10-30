import type { CSSProperties } from "react";
import { BRAND_SHAPES, BRAND_STEPS, tokens, type Brand, type BrandShape } from "@danitesler/ayywi";
import { Button } from "@danitesler/ayywi/react";

/** The pieces the Themes page (#/themes) is built from: presets, fonts, a per-theme sample and the brand scale. */
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

export const HEADING_FONTS: [string, string][] = [
  ["", "ayywi's (Unbounded)"],
  ["Sora", "Sora (Sans)"],
  ["Georgia", "Georgia (Serif)"],
  ["Verdana", "Verdana (Clean)"],
  ["system-ui", "System UI"],
];

export const BODY_FONTS: [string, string][] = [
  ["", "ayywi's (Sora)"],
  ["Georgia", "Georgia (Serif)"],
  ["Verdana", "Verdana (Clean)"],
  ["system-ui", "System UI"],
];

export const SHAPES = Object.keys(BRAND_SHAPES) as BrandShape[];

/** One theme, shown as a small page: the same title, text and action in each, so only the theme changes. */
export function Sample({ theme, label, style }: { theme: string; label: string; style?: CSSProperties }) {
  return (
    <div className="pv-theme pv-brand__sample" data-theme={theme} style={style}>
      <div className="pv-theme__intro">
        <h3 className="pv-theme__head">{label}</h3>
        <p className="pv-theme__title">Everything reads the same</p>
        <p className="pv-theme__text">A title, a paragraph and the action you would tap, in a composition you would actually ship.</p>
      </div>
      <div className="ayy-cluster pv-theme__actions">
        <Button size="sm">Primary</Button>
        <Button size="sm" variant="outline">
          Outline
        </Button>
      </div>
    </div>
  );
}

export function Scale({ brand }: { brand?: Brand | null }) {
  return (
    <ol className="pv-brand__scale" aria-label="Brand scale">
      {BRAND_STEPS.map((step) => {
        const hex = brand ? brand.scale[step] : (tokens[`brand.${step}` as keyof typeof tokens]?.value as string);
        return (
          <li key={step} className="pv-brand__step">
            <span className="pv-brand__chip" style={{ background: `var(--ayy-brand-${step})` }} />
            <strong>
              {step}
              {brand && step === brand.seedStep ? " · seed" : ""}
            </strong>
            <span className="ayy-mono ayy-muted">{hex}</span>
          </li>
        );
      })}
    </ol>
  );
}
