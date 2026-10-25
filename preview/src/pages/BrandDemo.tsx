import { useMemo, useState, type CSSProperties } from "react";
import { Coffee01Icon, PlusSignIcon, ShoppingBag01Icon } from "@hugeicons/core-free-icons";
import { brandCss, type BrandShape } from "@danitesler/ayywi";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
  Chip,
  ChipGroup,
  ColorSwatch,
  ColorSwatchCustom,
  ColorSwatchGroup,
  EmptyState,
  EmptyStateDescription,
  EmptyStateTitle,
  Icon,
  IconTile,
  Select,
  SegmentedControl,
  SegmentedControlItem,
  SliderRange,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@danitesler/ayywi/react";
import { BRAND_PRESETS } from "./Brand";

const SWATCHES = BRAND_PRESETS.filter((p) => !p.isMono);
const SHAPES: [BrandShape, string][] = [
  ["pill", "Pill"],
  ["round", "Round"],
  ["soft", "Soft"],
  ["sharp", "Sharp"],
];

type Kind = "single" | "blend" | "decaf";
const KINDS: [Kind | "all", string][] = [
  ["all", "All"],
  ["single", "Single origin"],
  ["blend", "Blends"],
  ["decaf", "Decaf"],
];
/** `shade` picks the product's tile from the brand's own scale, so every card is a different tint of one colour. */
const PRODUCTS: { name: string; notes: string; price: number; kind: Kind; shade: number; popular: number }[] = [
  { name: "Ethiopia Guji", notes: "Light roast · Blueberry, jasmine", price: 18, kind: "single", shade: 400, popular: 1 },
  { name: "Colombia Huila", notes: "Medium roast · Red apple, cocoa", price: 16, kind: "single", shade: 500, popular: 2 },
  { name: "Kenya Kiambu", notes: "Light roast · Blackcurrant", price: 21, kind: "single", shade: 600, popular: 4 },
  { name: "House blend", notes: "Medium roast · Milk chocolate", price: 13, kind: "blend", shade: 300, popular: 3 },
  { name: "Night shift", notes: "Dark roast · Dark chocolate", price: 14, kind: "blend", shade: 700, popular: 5 },
  { name: "Swiss water decaf", notes: "Medium roast · Caramel, hazelnut", price: 15, kind: "decaf", shade: 500, popular: 6 },
];
const SORTS: Record<string, (a: (typeof PRODUCTS)[number], b: (typeof PRODUCTS)[number]) => number> = {
  popular: (a, b) => a.popular - b.popular,
  low: (a, b) => a.price - b.price,
  high: (a, b) => b.price - a.price,
};

/**
 * The home page's theme picker: choose a colour and a corner style and a small coffee shop picks them up, live. The shop works
 * (filters, price range, sort, cart) so people poke at it the way they would a real app.
 */
export function BrandDemo() {
  const [color, setColor] = useState(SWATCHES[1].color);
  const [shape, setShape] = useState<BrandShape>("soft");
  const [kind, setKind] = useState<Kind | "all">("all");
  const [range, setRange] = useState<[number, number]>([10, 24]);
  const [sort, setSort] = useState("popular");
  const [cart, setCart] = useState(0);
  const css = useMemo(() => brandCss({ name: "demo", color, shape }, { selector: ".pv-brand-demo" }), [color, shape]);
  const isPreset = SWATCHES.some((p) => p.color === color);

  const count = (k: Kind | "all") => PRODUCTS.filter((p) => k === "all" || p.kind === k).length;
  const shown = PRODUCTS.filter((p) => (kind === "all" || p.kind === kind) && p.price >= range[0] && p.price <= range[1]).sort(SORTS[sort]);

  return (
    <div className="pv-brand-demo">
      <style>{css}</style>
      <div className="pv-brand-demo__controls">
        <ColorSwatchGroup aria-label="Brand colour">
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
          <ColorSwatchCustom label="Custom colour" value={color} onChange={(e) => setColor(e.target.value)} data-selected={isPreset ? undefined : ""} />
        </ColorSwatchGroup>
        <SegmentedControl size="sm" value={shape} onValueChange={(v) => setShape(v as BrandShape)} aria-label="Corner style">
          {SHAPES.map(([value, label]) => (
            <SegmentedControlItem key={value} value={value}>
              {label}
            </SegmentedControlItem>
          ))}
        </SegmentedControl>
      </div>

      <div className="pv-brand-demo__app">
        <header className="pv-brand-demo__bar">
          <span className="pv-brand-demo__logo">
            <Icon icon={Coffee01Icon} />
            Ember
          </span>
          <Tabs defaultValue="shop">
            <TabsList aria-label="Ember">
              <TabsTrigger value="shop">Shop</TabsTrigger>
              <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
              <TabsTrigger value="guides">Guides</TabsTrigger>
            </TabsList>
            <TabsContent value="shop" />
            <TabsContent value="subscriptions" />
            <TabsContent value="guides" />
          </Tabs>
          <Button variant="outline" size="sm" onClick={() => setCart(0)}>
            <Icon icon={ShoppingBag01Icon} />
            Cart
            <Badge>{cart}</Badge>
          </Button>
        </header>

        <div className="pv-brand-demo__body">
          <div>
            <p className="ayy-eyebrow">Roasted every Tuesday</p>
            <h3 className="ayy-h4">Coffee from farms we know by name</h3>
          </div>

          <div className="pv-brand-demo__filters">
            <ChipGroup role="radiogroup" aria-label="Kind of coffee">
              {KINDS.map(([value, label]) => (
                <Chip key={value} type="radio" name="pv-demo-kind" value={value} checked={kind === value} onCheckedChange={() => setKind(value)} count={count(value)}>
                  {label}
                </Chip>
              ))}
            </ChipGroup>
            <div className="pv-brand-demo__tools">
              <div className="pv-brand-demo__price">
                <span className="ayy-label" id="pv-demo-price">
                  Price <output className="ayy-muted">{`$${range[0]} – $${range[1]}`}</output>
                </span>
                <SliderRange min={10} max={24} value={range} onValueChange={setRange} labels={["Minimum price", "Maximum price"]} aria-labelledby="pv-demo-price" />
              </div>
              <Select size="sm" value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort">
                <option value="popular">Most popular</option>
                <option value="low">Price: low to high</option>
                <option value="high">Price: high to low</option>
              </Select>
            </div>
          </div>

          {shown.length === 0 ? (
            <EmptyState compact>
              <EmptyStateTitle>No coffee in this range</EmptyStateTitle>
              <EmptyStateDescription>Widen the price range or pick another kind.</EmptyStateDescription>
            </EmptyState>
          ) : (
            <div className="ayy-grid" style={{ "--ayy-min": "9.5rem" } as CSSProperties}>
              {shown.map((p) => (
                <Card key={p.name}>
                  <CardContent className="pv-brand-demo__product">
                    <IconTile spotColor={`var(--ayy-brand-${p.shade})`}>
                      <Icon icon={Coffee01Icon} />
                    </IconTile>
                    <CardTitle>{p.name}</CardTitle>
                    <CardDescription>{p.notes}</CardDescription>
                  </CardContent>
                  <CardFooter className="pv-brand-demo__buy">
                    <strong>${p.price}</strong>
                    <Button variant="outline" size="sm" onClick={() => setCart(cart + 1)}>
                      <Icon icon={PlusSignIcon} />
                      Add
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
