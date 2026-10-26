import { useMemo, useState } from "react";
import { brandCss, createBrand, type BrandInput, type BrandShape, type ThemeMode, type ThemeName } from "@danitesler/ayywi";
import {
  Alert,
  AlertDescription,
  Button,
  ColorSwatchButton,
  ColorSwatchCustom,
  ColorSwatchGroup,
  Field,
  Label,
  SegmentedControl,
  SegmentedControlItem,
  Select,
  Tooltip,
} from "@danitesler/ayywi/react";
import { CodeBlock } from "../CodeBlock";
import { themeOptions } from "../themes";
import { BODY_FONTS, BRAND_PRESETS, HEADING_FONTS, Sample, Scale, SHAPES } from "./Brand";
import { BrandApp } from "./BrandDemo";

const DEFAULT_COLOR = "#0ea5e9";
const resolve = (mode: ThemeMode): ThemeName =>
  mode !== "system" ? mode : window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
const label = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** Mono's own corners and fonts, scoped to a selector: a brand's rule without its colours. */
function monoCss(input: BrandInput, selector: string): string {
  const { radius, font } = createBrand({ name: "mono", color: "#808080", shape: input.shape, font: input.font });
  const decls = [
    `--ayy-radius-control: ${radius.control};`,
    `--ayy-radius-card: ${radius.card};`,
    `--ayy-radius-button: ${radius.button};`,
    ...(["heading", "body", "mono"] as const).filter((k) => font[k]).map((k) => `--ayy-font-${k}: ${font[k]};`),
  ];
  return `${selector}, ${selector} :is([data-theme], .dark, .light) { ${decls.join(" ")} }`;
}

function snippet(brand: BrandInput | null): string {
  if (!brand) return "// ayywi's monochrome default: no brand to set.";
  const font = brand.font && (brand.font.heading || brand.font.body) ? `, font: ${JSON.stringify(brand.font)}` : "";
  return `npx @danitesler/ayywi brand "${brand.color}" --name ${brand.name} --shape ${brand.shape ?? "pill"} --out src/brand.css

// or at run time, without a build step
ayywi.setBrand({ name: "${brand.name}", color: "${brand.color}", shape: "${brand.shape ?? "pill"}"${font} });`;
}

/**
 * #/themes: pick a brand on the left and see it on a small app on the right, in any theme. Nothing changes on the site until
 * "Use this theme".
 */
export function ThemesPage({ current, onUse, theme, setTheme }: { current: BrandInput | null; onUse: (brand: BrandInput | null) => void; theme: ThemeMode; setTheme: (theme: ThemeMode) => void }) {
  const [mono, setMono] = useState(!current);
  const [input, setInput] = useState<BrandInput>(() => current ?? { name: "acme", color: DEFAULT_COLOR, shape: "pill" });
  const [previewTheme, setPreviewTheme] = useState<ThemeName>(() => resolve(theme));

  const result = useMemo(() => {
    if (mono) return { brand: null };
    try {
      return { brand: createBrand(input), input };
    } catch (error) {
      return { error: (error as Error).message };
    }
  }, [mono, input]);
  const draft: BrandInput | null = mono || result.error ? null : input;

  const hex = /^#[0-9a-f]{6}$/i.test(input.color) ? input.color : DEFAULT_COLOR;
  const font = (key: "heading" | "body", value: string) => {
    const next = { ...input.font, [key]: value || undefined };
    setInput({ ...input, font: next.heading || next.body ? next : undefined });
  };
  const scoped = (selector: string) =>
    result.error ? "" : mono ? monoCss(input, selector) : result.brand ? brandCss(result.brand, { selector }) : "";
  const sameAsSite = JSON.stringify(draft) === JSON.stringify(current ?? null) && previewTheme === resolve(theme);

  return (
    <article className="pv-page pv-themes-page">
      <div className="pv-themer">
        <aside className="pv-themer__panel ayy-scroll" aria-labelledby="themes-title">
          <header className="pv-page__header">
            <h1 className="ayy-h3" id="themes-title">
              Select theme
            </h1>
          </header>

          <div className="ayy-cluster">
            <Button
              disabled={sameAsSite}
              onClick={() => {
                onUse(draft);
                setTheme(previewTheme);
              }}
            >
              Use this theme
            </Button>
            <Button
              variant="ghost"
              disabled={!current && mono}
              onClick={() => {
                setMono(true);
                onUse(null);
              }}
            >
              Reset to default
            </Button>
          </div>

          <Field>
            <span className="ayy-label" id="pv-theme-colour">
              Colour
            </span>
            <ColorSwatchGroup track role="group" aria-labelledby="pv-theme-colour" className="pv-brand__swatches">
              {BRAND_PRESETS.map((p) => (
                <Tooltip key={p.name} content={p.label}>
                  <ColorSwatchButton
                    color={p.color}
                    label={p.label}
                    pressed={p.isMono ? mono : !mono && input.color.toLowerCase() === p.color.toLowerCase()}
                    onClick={() => {
                      if (p.isMono) return setMono(true);
                      setMono(false);
                      setInput({ ...input, name: p.name, color: p.color, shape: p.shape ?? input.shape });
                    }}
                  />
                </Tooltip>
              ))}
              <Tooltip content="Custom colour">
                <ColorSwatchCustom
                  label="Custom seed colour"
                  value={hex}
                  onChange={(e) => {
                    setMono(false);
                    setInput({ ...input, name: "acme", color: e.target.value });
                  }}
                />
              </Tooltip>
            </ColorSwatchGroup>
          </Field>

          {/* Mono has no colour to build a brand from: its corners and fonts show here but can only be kept with a colour. */}
            <Field>
              <span className="ayy-label" id="pv-theme-shape">
                Corners
              </span>
              <SegmentedControl full aria-labelledby="pv-theme-shape" value={input.shape ?? "pill"} onValueChange={(v) => setInput({ ...input, shape: v as BrandShape })}>
                {SHAPES.map((s) => (
                  <SegmentedControlItem key={s} value={s}>
                    {label(s)}
                  </SegmentedControlItem>
                ))}
              </SegmentedControl>
            </Field>

            <div className="pv-themer__fonts">
              <Field>
                <Label htmlFor="pv-theme-heading">Heading font</Label>
                <Select id="pv-theme-heading" value={typeof input.font?.heading === "string" ? input.font.heading : ""} onChange={(e) => font("heading", e.target.value)}>
                  {HEADING_FONTS.map(([value, text]) => (
                    <option key={value} value={value}>
                      {text}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field>
                <Label htmlFor="pv-theme-body">Body font</Label>
                <Select id="pv-theme-body" value={typeof input.font?.body === "string" ? input.font.body : ""} onChange={(e) => font("body", e.target.value)}>
                  {BODY_FONTS.map(([value, text]) => (
                    <option key={value} value={value}>
                      {text}
                    </option>
                  ))}
                </Select>
              </Field>
            </div>
          {mono && <p className="pv-note">Mono is ayywi's default colour. Corners and fonts show on the preview; pick a colour to use them on the site.</p>}

          <Field>
            <Label htmlFor="pv-theme-mode">Theme</Label>
            <Select id="pv-theme-mode" value={previewTheme} onChange={(e) => setPreviewTheme(e.target.value as ThemeName)}>
              {themeOptions.map((t) => (
                <option key={t.name} value={t.name}>
                  {t.label}
                </option>
              ))}
            </Select>
          </Field>

          {result.error && (
            <Alert variant="destructive">
              <AlertDescription>{result.error}</AlertDescription>
            </Alert>
          )}

          <CodeBlock code={snippet(draft)} label="your brand" language="sh" wrap />
        </aside>

        <div className="pv-themer__stage">
          {/* The brand is scoped to the stage, so the site keeps its own until "Use this theme". */}
          <style>{scoped(".pv-themer__stage")}</style>
          <div className="pv-themer__sample" data-theme={previewTheme}>
            <BrandApp />
          </div>
        </div>
      </div>

      <style>{scoped(".pv-brand-live")}</style>
      <section className="pv-brand-live pv-section" aria-labelledby="themes-every">
        <h2 className="pv-h pv-h--section" id="themes-every">
          In every theme
        </h2>
        <p className="pv-note">The same title, text and action in each theme, so you can check your colour reads well in all of them.</p>
        <div className="pv-themes pv-themes--stack">
          {themeOptions.map((t) => (
            <Sample key={t.name} theme={t.name} label={t.label} />
          ))}
        </div>

        <h2 className="pv-h pv-h--section" id="brand-scale">
          Scale
        </h2>
        <p className="pv-note">
          The shade marked seed is the closest to your colour, and the rest are built around it. Primary buttons and the focus ring take
          their colours from here.
        </p>
        <Scale brand={result.brand ?? null} />
      </section>
    </article>
  );
}
