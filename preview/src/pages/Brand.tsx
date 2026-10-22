import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { BRAND_SHAPES, BRAND_STEPS, brandCss, createBrand, tokens, type Brand, type BrandInput, type BrandShape } from "@danitesler/ayywi";
import {
  Alert,
  AlertDescription,
  Avatar,
  Badge,
  Button,
  Checkbox,
  ColorPicker,
  Field,
  Input,
  Label,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Progress,
  Radio,
  SegmentedControl,
  SegmentedControlItem,
  Select,
  Slider,
  ColorSwatchButton,
  ColorSwatchGroup,
  Switch,
  Tooltip,
} from "@danitesler/ayywi/react";
import { themeOptions } from "../themes";

export const brandPage = {
  route: "brand",
  title: "Brand",
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

const HEADING_FONTS: [string, string][] = [
  ["", "ayywi's (Unbounded)"],
  ["Sora", "Sora (Sans)"],
  ["Georgia", "Georgia (Serif)"],
  ["Verdana", "Verdana (Clean)"],
  ["system-ui", "System UI"],
];

const BODY_FONTS: [string, string][] = [
  ["", "ayywi's (Sora)"],
  ["Georgia", "Georgia (Serif)"],
  ["Verdana", "Verdana (Clean)"],
  ["system-ui", "System UI"],
];

const SHAPES = Object.keys(BRAND_SHAPES) as BrandShape[];

function Sample({ theme, label }: { theme: string; label: string }) {
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

function Scale({ brand }: { brand?: Brand | null }) {
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

function SwatchColorPicker({
  value,
  onValueChange,
  presets,
}: {
  value: string;
  onValueChange: (val: string) => void;
  presets: string[];
}) {
  return (
    <Popover>
      <Tooltip content="Pick custom colour">
        <PopoverTrigger asChild>
          <button
            type="button"
            aria-label="Pick custom seed colour"
            className="ayy-swatch ayy-swatch--lg"
            style={{ "--ayy-swatch": value } as CSSProperties}
          />
        </PopoverTrigger>
      </Tooltip>
      <PopoverContent
        side="bottom"
        align="start"
        aria-label="Colour picker"
        style={{ padding: "var(--ayy-space-2)" }}
      >
        <ColorPicker value={value} onValueChange={onValueChange} swatches={presets} />
      </PopoverContent>
    </Popover>
  );
}

export function BrandPage({ current, onUse }: { current: BrandInput | null; onUse: (brand: BrandInput | null) => void }) {
  const [input, setInput] = useState<BrandInput>(() => current ?? { name: "acme", color: "#0ea5e9", shape: "pill" });
  const [headingFont, setHeadingFont] = useState(typeof input.font?.heading === "string" ? input.font.heading : "");
  const [bodyFont, setBodyFont] = useState(typeof input.font?.body === "string" ? input.font.body : "");

  // Sync state when shell settings gear changes branding
  useEffect(() => {
    if (current) {
      setInput(current);
      setHeadingFont(typeof current.font?.heading === "string" ? current.font.heading : "");
      setBodyFont(typeof current.font?.body === "string" ? current.font.body : "");
    } else {
      setInput({ name: "acme", color: "#0ea5e9", shape: "pill" });
      setHeadingFont("");
      setBodyFont("");
    }
  }, [current]);

  const full: BrandInput = useMemo(
    () => ({
      ...input,
      font: headingFont || bodyFont ? { heading: headingFont || undefined, body: bodyFont || undefined } : undefined,
    }),
    [input, headingFont, bodyFont],
  );

  const result = useMemo(() => {
    try {
      return { brand: createBrand(full) };
    } catch (error) {
      return { error: (error as Error).message };
    }
  }, [full]);
  const brand = result.brand;

  const applyPreset = (preset: PresetBrand) => {
    if (preset.isMono) {
      onUse(null);
      return;
    }
    const next: BrandInput = { ...input, color: preset.color, shape: preset.shape ?? input.shape, name: preset.name };
    setInput(next);
    const nextFull: BrandInput = {
      ...next,
      font: headingFont || bodyFont ? { heading: headingFont || undefined, body: bodyFont || undefined } : undefined,
    };
    onUse(nextFull);
  };

  const updateCustomColor = (raw: string) => {
    const color = raw.trim();
    const next = { ...input, color, name: "acme" };
    setInput(next);
    const hexMatch = /^#?([0-9a-f]{6})$/i.exec(color);
    if (hexMatch) {
      const validHex = `#${hexMatch[1]}`;
      const nextFull: BrandInput = {
        ...next,
        color: validHex,
        font: headingFont || bodyFont ? { heading: headingFont || undefined, body: bodyFont || undefined } : undefined,
      };
      onUse(nextFull);
    }
  };

  const updateShape = (shape: BrandShape) => {
    const next = { ...input, shape };
    setInput(next);
    const nextFull: BrandInput = {
      ...next,
      font: headingFont || bodyFont ? { heading: headingFont || undefined, body: bodyFont || undefined } : undefined,
    };
    onUse(nextFull);
  };

  const updateHeadingFont = (val: string) => {
    setHeadingFont(val);
    const nextFull: BrandInput = {
      ...input,
      font: val || bodyFont ? { heading: val || undefined, body: bodyFont || undefined } : undefined,
    };
    onUse(nextFull);
  };

  const updateBodyFont = (val: string) => {
    setBodyFont(val);
    const nextFull: BrandInput = {
      ...input,
      font: headingFont || val ? { heading: headingFont || undefined, body: val || undefined } : undefined,
    };
    onUse(nextFull);
  };

  const resetToDefault = () => {
    setInput({ name: "acme", color: "#0ea5e9", shape: "pill" });
    setHeadingFont("");
    setBodyFont("");
    onUse(null);
  };

  const hex = /^#[0-9a-f]{6}$/i.test(input.color) ? input.color : "#000000";

  return (
    <article className="pv-page">
      <header className="pv-page__header">
        <p className="ayy-eyebrow">Foundations</p>
        <h1 className="ayy-h2">Brand</h1>
        <p className="ayy-lede">
          One colour plus fonts and shape make a brand: scale, primary, text-on-primary and focus ring for every theme, contrast-checked.
          Tokens change, components stay the same.
        </p>
      </header>

      <div className="pv-brand__form">
        <Field>
          <Label htmlFor="pv-brand-color">Seed colour</Label>
          <div className="ayy-cluster">
            <SwatchColorPicker
              value={hex}
              onValueChange={updateCustomColor}
              presets={BRAND_PRESETS.filter((p) => !p.isMono).map((p) => p.color)}
            />
            <Input id="pv-brand-color" className="pv-brand__hex ayy-mono" value={input.color} onChange={(e) => updateCustomColor(e.target.value)} spellCheck={false} />
          </div>
        </Field>
        <Field>
          <span className="ayy-label" id="pv-brand-shape">
            Shape
          </span>
          <SegmentedControl aria-labelledby="pv-brand-shape" value={input.shape ?? "pill"} onValueChange={(v) => updateShape(v as BrandShape)}>
            {SHAPES.map((s) => (
              <SegmentedControlItem key={s} value={s}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </SegmentedControlItem>
            ))}
          </SegmentedControl>
        </Field>
        <Field>
          <Label htmlFor="pv-brand-heading-font">Heading font</Label>
          <Select id="pv-brand-heading-font" value={headingFont} onChange={(e) => updateHeadingFont(e.target.value)}>
            {HEADING_FONTS.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
        </Field>
        <Field>
          <Label htmlFor="pv-brand-body-font">Body font</Label>
          <Select id="pv-brand-body-font" value={bodyFont} onChange={(e) => updateBodyFont(e.target.value)}>
            {BODY_FONTS.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
        </Field>

        <div className="pv-brand__presets-row">
          <ColorSwatchGroup track role="group" aria-label="Preset colours" className="pv-brand__swatches">
            {BRAND_PRESETS.map((p) => {
              const isSelected = p.isMono
                ? !current || current.name === "mono"
                : current?.name === p.name || (current?.color.toLowerCase() === p.color.toLowerCase());
              return (
                <Tooltip key={p.name} content={p.label}>
                  <ColorSwatchButton
                    size="sm"
                    color={p.color}
                    label={p.label}
                    pressed={isSelected}
                    onClick={() => applyPreset(p)}
                  />
                </Tooltip>
              );
            })}
          </ColorSwatchGroup>
          <Button size="sm" variant="ghost" onClick={resetToDefault} disabled={!current}>
            Reset to default
          </Button>
        </div>
      </div>

      {result.error ? (
        <Alert variant="destructive" className="pv-brand__alert">
          <AlertDescription>{result.error}</AlertDescription>
        </Alert>
      ) : null}

      {current && brand ? <style>{brandCss(brand, { selector: ".pv-brand-live" })}</style> : null}
      <div className="pv-brand-live">
        <div className="pv-themes">
          {themeOptions.map((t) => (
            <Sample key={t.name} theme={t.name} label={t.label} />
          ))}
        </div>

        <h2 className="pv-h pv-h--section" id="brand-scale">
          Scale
        </h2>
        <Scale brand={current ? brand : null} />
      </div>
    </article>
  );
}
