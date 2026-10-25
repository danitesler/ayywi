import { BRAND_SHAPES, BRAND_STEPS, tokens, type Brand, type BrandShape } from "@danitesler/ayywi";
import {
  Avatar,
  Badge,
  Button,
  Checkbox,
  Field,
  Input,
  Label,
  Progress,
  Radio,
  SegmentedControl,
  SegmentedControlItem,
  Slider,
  Switch,
} from "@danitesler/ayywi/react";

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

export function Sample({ theme, label }: { theme: string; label: string }) {
  return (
    <div className="pv-theme pv-brand__sample" data-theme={theme}>
      <strong className="pv-theme__head">{label}</strong>
      <p className="pv-theme__big">Aa</p>
      <div className="ayy-cluster">
        <Button size="sm">Primary</Button>
        <Button size="sm" variant="outline">
          Outline
        </Button>
        <Button size="sm" variant="ghost">
          Ghost
        </Button>
      </div>
      <Input size="sm" defaultValue="Acme Corp" aria-label={`Brand name (${label})`} />
      <SegmentedControl size="sm" full defaultValue="left" aria-label={`Options (${label})`}>
        <SegmentedControlItem value="left">Active</SegmentedControlItem>
        <SegmentedControlItem value="right">Option</SegmentedControlItem>
      </SegmentedControl>
      <div className="ayy-cluster">
        <Field inline>
          <Checkbox id={`pv-brand-check-${theme}`} defaultChecked />
          <Label htmlFor={`pv-brand-check-${theme}`}>Check</Label>
        </Field>
        <Field inline>
          <Radio id={`pv-brand-radio-${theme}`} name={`pv-brand-radio-${theme}`} value="1" defaultChecked />
          <Label htmlFor={`pv-brand-radio-${theme}`}>Radio</Label>
        </Field>
        <Field inline>
          <Switch id={`pv-brand-switch-${theme}`} defaultChecked />
          <Label htmlFor={`pv-brand-switch-${theme}`}>On</Label>
        </Field>
      </div>
      <Slider defaultValue={65} aria-label={`Slider (${label})`} />
      <Progress value={65} size="sm" aria-label={`Progress (${label})`} />
      <div className="ayy-cluster">
        <Badge>Badge</Badge>
        <Badge variant="outline">Outline</Badge>
        <Avatar name="Acme" fallback="AC" size="sm" />
        <span className="pv-brand__ring">Focus ring</span>
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
