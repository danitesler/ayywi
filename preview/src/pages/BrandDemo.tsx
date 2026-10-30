import type { ComponentProps } from "react";
import { useMemo, useState } from "react";
import { HexagonIcon } from "@hugeicons/core-free-icons";
import { brandCss, type BrandShape, type IconName } from "@danitesler/ayywi";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  ColorSwatch,
  ColorSwatchCustom,
  ColorSwatchGroup,
  Field,
  Icon,
  IconTile,
  Input,
  Label,
  Progress,
  SegmentedControl,
  SegmentedControlItem,
  Sparkline,
  Stat,
  Switch,
} from "@danitesler/ayywi/react";
import { BRAND_PRESETS } from "./Brand";

const MONO = BRAND_PRESETS.find((p) => p.isMono)!;
const SWATCHES = BRAND_PRESETS.filter((p) => !p.isMono);
const SHAPES: [BrandShape, string][] = [
  ["pill", "Pill"],
  ["round", "Round"],
  ["soft", "Soft"],
  ["sharp", "Sharp"],
];
const REVENUE = [12, 18, 15, 24, 22, 31, 29, 38, 36, 44, 41, 52];

/** The app's logo: a Hugeicons icon and its name, so an icon pack replaces it. */
export type BrandIcon = { icon: ComponentProps<typeof Icon>["icon"]; name: IconName };

/** A small app that takes whatever brand its parent carries: the home page scopes one to it, the Themes page its draft. */
export function BrandApp({ name = "Acme", icon = { icon: HexagonIcon, name: "hexagon" } }: { name?: string; icon?: BrandIcon } = {}) {
  return (
    <Card className="pv-brand-demo__app">
      <CardHeader>
        <div className="ayy-cluster pv-brand-demo__head">
          <span className="pv-brand-demo__logo">
            <IconTile spotColor="var(--ayy-color-primary)">
              <Icon icon={icon.icon} name={icon.name} />
            </IconTile>
            {name}
          </span>
          <Badge>Live</Badge>
        </div>
      </CardHeader>
      <CardContent className="pv-brand-demo__body">
        <div className="pv-brand-demo__stats">
          <Stat size="sm" label="Revenue" value="$52k" unit="+12%" labelFirst />
          <Sparkline values={REVENUE} area color="var(--ayy-color-primary)" label="Revenue, last 12 weeks, up 12%" />
        </div>
        <Progress value={72} size="sm" aria-label="Quarterly goal, 72%" />
        <Field>
          <Label htmlFor="pv-demo-recipient">Send report to</Label>
          <Input id="pv-demo-recipient" type="email" defaultValue="team@acme.co" />
        </Field>
        <Field inline>
          <Switch id="pv-demo-weekly" defaultChecked />
          <Label htmlFor="pv-demo-weekly">Every Monday</Label>
        </Field>
      </CardContent>
      <CardFooter>
        <Button variant="outline">Preview</Button>
        <Button>Send report</Button>
      </CardFooter>
    </Card>
  );
}

/** The home page's theme picker: choose a colour and a corner style and the small app picks them up, live. */
export function BrandDemo() {
  const [color, setColor] = useState<string | null>(SWATCHES[1].color);
  const [shape, setShape] = useState<BrandShape>("soft");
  // Mono is ayywi's own look: no brand, so the colour scale and corner style have nothing to change.
  const css = useMemo(() => (color ? brandCss({ name: "demo", color, shape }, { selector: ".pv-brand-demo" }) : ""), [color, shape]);
  const isPreset = color === null || SWATCHES.some((p) => p.color === color);

  return (
    <div className="pv-brand-demo">
      <style>{css}</style>
      <div className="pv-brand-demo__controls">
        <ColorSwatchGroup aria-label="Brand colour">
          <ColorSwatch name="pv-demo-colour" color={MONO.color} label={MONO.label} checked={color === null} onCheckedChange={() => setColor(null)} />
          {SWATCHES.map((p) => (
            <ColorSwatch
              key={p.name}
              name="pv-demo-colour"
              color={p.color}
              label={p.label}
              checked={color === p.color}
              onCheckedChange={() => setColor(p.color)}
            />
          ))}
          <ColorSwatchCustom label="Custom colour" value={color ?? SWATCHES[1].color} onChange={(e) => setColor(e.target.value)} data-selected={isPreset ? undefined : ""} />
        </ColorSwatchGroup>
        <SegmentedControl size="sm" value={shape} onValueChange={(v) => setShape(v as BrandShape)} aria-label="Corner style">
          {SHAPES.map(([value, label]) => (
            <SegmentedControlItem key={value} value={value} disabled={color === null}>
              {label}
            </SegmentedControlItem>
          ))}
        </SegmentedControl>
      </div>
      <BrandApp />
    </div>
  );
}
