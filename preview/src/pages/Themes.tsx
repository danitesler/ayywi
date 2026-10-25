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
  FieldHint,
  Label,
  SegmentedControl,
  SegmentedControlItem,
  Select,
  Tooltip,
} from "@danitesler/ayywi/react";
import { CodeBlock } from "../CodeBlock";
import { showcaseApps } from "../showcase/apps";
import { themeOptions } from "../themes";
import { BODY_FONTS, BRAND_PRESETS, HEADING_FONTS, Sample, Scale, SHAPES } from "./Brand";
import { ScaledFrame, type Look } from "./Showcase";

const DEFAULT_COLOR = "#0ea5e9";
const resolve = (mode: ThemeMode): ThemeName =>
  mode !== "system" ? mode : window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
const label = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

function snippet(brand: BrandInput | null): string {
  if (!brand) return "// ayywi's monochrome default: no brand to set.";
  const font = brand.font && (brand.font.heading || brand.font.body) ? `, font: ${JSON.stringify(brand.font)}` : "";
  return `npx @danitesler/ayywi brand "${brand.color}" --name ${brand.name} --shape ${brand.shape ?? "pill"} --out src/brand.css

// or at run time, without a build step
ayywi.setBrand({ name: "${brand.name}", color: "${brand.color}", shape: "${brand.shape ?? "pill"}"${font} });`;
}

/**
 * #/themes: pick a brand on the left and see it on a real app on the right, in any theme. Nothing changes on the site until
 * "Use this theme".
 */
export function ThemesPage({ current, onUse, theme, setTheme }: { current: BrandInput | null; onUse: (brand: BrandInput | null) => void; theme: ThemeMode; setTheme: (theme: ThemeMode) => void }) {
  const [mono, setMono] = useState(!current);
  const [input, setInput] = useState<BrandInput>(() => current ?? { name: "acme", color: DEFAULT_COLOR, shape: "pill" });
  const [previewTheme, setPreviewTheme] = useState<ThemeName>(() => resolve(theme));
  const [appId, setAppId] = useState("store");
  const app = showcaseApps.find((a) => a.id === appId) ?? showcaseApps[0];

  const result = useMemo(() => {
    if (mono) return { brand: null };
    try {
      return { brand: createBrand(input), input };
    } catch (error) {
      return { error: (error as Error).message };
    }
  }, [mono, input]);
  const draft: BrandInput | null = mono || result.error ? null : input;
  const look: Look = useMemo(() => ({ theme: previewTheme, brand: draft }), [previewTheme, draft]);

  const hex = /^#[0-9a-f]{6}$/i.test(input.color) ? input.color : DEFAULT_COLOR;
  const font = (key: "heading" | "body", value: string) => {
    const next = { ...input.font, [key]: value || undefined };
    setInput({ ...input, font: next.heading || next.body ? next : undefined });
  };
  const sameAsSite = JSON.stringify(draft) === JSON.stringify(current ?? null) && previewTheme === resolve(theme);

  return (
    <article className="pv-page pv-themes-page">
      <div className="pv-themer">
        <aside className="pv-themer__panel ayy-scroll" aria-labelledby="themes-title">
          <header className="pv-page__header">
            <h1 className="ayy-h3" id="themes-title">
              Themes
            </h1>
            <p className="pv-note">
              A brand is one colour, a corner style and optional fonts. ayywi builds the shades, readable button text and a focus ring
              for every theme; the components stay the same. Try one on the app, then use it on this site.
            </p>
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

          {/* Mono has no colour to build a brand from, so corners and fonts wait for one. */}
          {!mono && (
            <>
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
            </>
          )}
          {mono && <p className="pv-note">Mono is ayywi's default. Pick a colour to change the corners and fonts too.</p>}

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

          <Field>
            <Label htmlFor="pv-theme-app">Preview on</Label>
            <Select id="pv-theme-app" value={app.id} onChange={(e) => setAppId(e.target.value)}>
              {showcaseApps.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}, {a.kind.toLowerCase()}
                </option>
              ))}
            </Select>
            <FieldHint>Each app keeps its own density.</FieldHint>
          </Field>

          {result.error && (
            <Alert variant="destructive">
              <AlertDescription>{result.error}</AlertDescription>
            </Alert>
          )}

          <CodeBlock code={snippet(draft)} label="your brand" language="sh" wrap />
        </aside>

        <div className="pv-themer__stage">
          <ScaledFrame key={app.id} app={app} width={1280} height={800} look={look} title={`${app.name} with this theme`} />
        </div>
      </div>

      {draft && result.brand && <style>{brandCss(result.brand, { selector: ".pv-brand-live" })}</style>}
      <section className="pv-brand-live pv-section" aria-labelledby="themes-every">
        <h2 className="pv-h pv-h--section" id="themes-every">
          In every theme
        </h2>
        <p className="pv-note">The same controls in each theme, so you can check your colour reads well in all of them.</p>
        <div className="pv-themes">
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
