import { useMemo, useState } from "react";
import { BRAND_SHAPES, BRAND_STEPS, brandCss, brandPresets, createBrand, type Brand, type BrandInput, type BrandShape } from "@danitesler/ayywi";
import {
  Alert,
  AlertDescription,
  Badge,
  Button,
  Checkbox,
  Field,
  Input,
  Label,
  SegmentedControl,
  SegmentedControlItem,
  Select,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@danitesler/ayywi/react";
import { CodeBlock } from "../CodeBlock";
import { themeOptions } from "../themes";

export const brandPage = {
  route: "brand",
  title: "Brand",
  text: "brand branding colour color seed scale primary ring contrast fonts shape radius corners setBrand createBrand brandCss data-brand violet",
};

// Fonts every desktop has, so the playground shows a change without loading anything.
const FONTS: [string, string][] = [
  ["", "ayywi's (Sora, Unbounded)"],
  ["Georgia", "Georgia"],
  ["Verdana", "Verdana"],
  ["system-ui", "System"],
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
      </div>
      <div className="ayy-cluster">
        <label className="ayy-label">
          <Checkbox defaultChecked />
          Checked
        </label>
        <Field inline>
          <Switch id={`pv-brand-switch-${theme}`} defaultChecked />
          <Label htmlFor={`pv-brand-switch-${theme}`}>On</Label>
        </Field>
      </div>
      <div className="ayy-cluster">
        <Badge>Badge</Badge>
        <span className="pv-brand__ring">Focus ring</span>
      </div>
    </div>
  );
}

function Scale({ brand }: { brand: Brand }) {
  return (
    <ol className="pv-brand__scale" aria-label="Brand scale">
      {BRAND_STEPS.map((step) => (
        <li key={step} className="pv-brand__step">
          <span className="pv-brand__chip" style={{ background: `var(--ayy-brand-${step})` }} />
          <strong>
            {step}
            {step === brand.seedStep ? " · seed" : ""}
          </strong>
          <span className="ayy-mono ayy-muted">{brand.scale[step]}</span>
        </li>
      ))}
    </ol>
  );
}

export function BrandPage({ current, onUse }: { current: BrandInput | null; onUse: (brand: BrandInput | null) => void }) {
  const [input, setInput] = useState<BrandInput>(() => current ?? { name: "acme", color: "#0ea5e9", shape: "pill" });
  const [font, setFont] = useState(typeof input.font?.body === "string" ? input.font.body : "");
  const full: BrandInput = useMemo(() => ({ ...input, font: font ? { heading: font, body: font } : undefined }), [input, font]);
  const result = useMemo(() => {
    try {
      return { brand: createBrand(full) };
    } catch (error) {
      return { error: (error as Error).message };
    }
  }, [full]);
  const brand = result.brand;
  const css = brand ? brandCss(brand) : "";
  const cli = `npx ayywi brand "${input.color}" --name ${input.name}${input.shape && input.shape !== "pill" ? ` --shape ${input.shape}` : ""}${font ? ` --heading "${font}" --body "${font}"` : ""} --out ${input.name}.css`;
  const set = (patch: Partial<BrandInput>) => setInput((prev) => ({ ...prev, ...patch }));
  const hex = /^#[0-9a-f]{6}$/i.test(input.color) ? input.color : "#000000";

  return (
    <article className="pv-page">
      <header className="pv-page__header">
        <p className="ayy-eyebrow">Foundations</p>
        <h1 className="ayy-h2">Brand</h1>
        <p className="ayy-lede">
          One colour, and optionally fonts and a corner shape, become a brand: a colour scale, and primary, text-on-primary and focus-ring colours for every theme, each checked
          for contrast. Components don't change; only tokens do.
        </p>
      </header>

      <div className="pv-brand__form">
        <Field>
          <Label htmlFor="pv-brand-color">Seed colour</Label>
          <div className="ayy-cluster">
            <input type="color" className="pv-brand__picker" aria-label="Pick the seed colour" value={hex} onChange={(e) => set({ color: e.target.value })} />
            <Input id="pv-brand-color" className="pv-brand__hex" value={input.color} onChange={(e) => set({ color: e.target.value })} spellCheck={false} />
          </div>
        </Field>
        <Field>
          <Label htmlFor="pv-brand-name">Name</Label>
          <Input id="pv-brand-name" value={input.name} onChange={(e) => set({ name: e.target.value })} spellCheck={false} />
        </Field>
        <Field>
          <Label htmlFor="pv-brand-font">Font</Label>
          <Select id="pv-brand-font" value={font} onChange={(e) => setFont(e.target.value)}>
            {FONTS.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
        </Field>
        <Field>
          <span className="ayy-label" id="pv-brand-shape">
            Shape
          </span>
          <SegmentedControl aria-labelledby="pv-brand-shape" value={input.shape ?? "pill"} onValueChange={(v) => set({ shape: v as BrandShape })}>
            {SHAPES.map((s) => (
              <SegmentedControlItem key={s} value={s}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </SegmentedControlItem>
            ))}
          </SegmentedControl>
        </Field>
      </div>
      <div className="ayy-cluster">
        <Button variant="outline" size="sm" onClick={() => onUse(full)} disabled={!brand}>
          Use across the preview
        </Button>
        <Button variant="ghost" size="sm" onClick={() => onUse(brandPresets.violet)}>
          Use Violet
        </Button>
        <Button variant="ghost" size="sm" onClick={() => onUse(null)} disabled={!current}>
          Back to mono
        </Button>
      </div>

      {result.error ? (
        <Alert variant="destructive" className="pv-brand__alert">
          <AlertDescription>{result.error}</AlertDescription>
        </Alert>
      ) : null}

      {brand ? (
        <>
          <style>{brandCss(brand, { selector: ".pv-brand-live" })}</style>
          <div className="pv-brand-live">
            <h2 className="pv-h pv-h--section" id="brand-scale">
              Scale
            </h2>
            <p className="pv-note">
              Eleven steps in the seed's hue, evenly spaced in perceived lightness, with the seed itself at step {brand.seedStep}. Use them as --ayy-brand-50 … 950 for
              illustrations and brand moments.
            </p>
            <Scale brand={brand} />

            <h2 className="pv-h pv-h--section" id="brand-themes">
              In every theme
            </h2>
            <p className="pv-note">
              Dark themes use brand-{brand.dark.step} ({brand.dark.primary}), light themes brand-{brand.light.step} ({brand.light.primary}).{" "}
              {brand.notes.join(" ")}
            </p>
            <div className="pv-themes">
              {themeOptions.map((t) => (
                <Sample key={t.name} theme={t.name} label={t.label} />
              ))}
            </div>
          </div>

          <h2 className="pv-h pv-h--section" id="brand-contrast">
            Contrast
          </h2>
          <p className="pv-note">Text on primary needs 4.5:1; the fill and the focus ring need 3:1 against every surface. A step that misses any of them is skipped.</p>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Theme</TableHead>
                <TableHead>Pair</TableHead>
                <TableHead>Ratio</TableHead>
                <TableHead>Needs</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {brand.checks.map((c) => (
                <TableRow key={`${c.theme} ${c.pair}`}>
                  <TableCell>{c.theme}</TableCell>
                  <TableCell>{c.pair}</TableCell>
                  <TableCell className="ayy-mono">{c.ratio.toFixed(2)}:1</TableCell>
                  <TableCell className="ayy-mono">{c.min}:1</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <h2 className="pv-h pv-h--section" id="brand-code">
            Use it
          </h2>
          <p className="pv-note">
            Run the command (or call createBrand() and brandCss() from "@danitesler/ayywi"), load the CSS after ayywi's and put data-brand="{brand.name}" on &lt;html&gt;. For a
            colour people pick at runtime, setBrand({"{"} name, color {"}"}) does both.
          </p>
          <CodeBlock label="Command" code={cli} wrap />
          <CodeBlock label={`${brand.name}.css`} code={css} />
        </>
      ) : null}
    </article>
  );
}
