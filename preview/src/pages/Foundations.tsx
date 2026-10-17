import { useEffect, useState, type ComponentType, type CSSProperties, type ReactNode } from "react";
import { tokens, type TokenDefinition } from "@danitesler/ayywi";
import {
  Accordion,
  AccordionItem,
  Badge,
  Button,
  Card,
  CardContent,
  Checkbox,
  Icon,
  InlineToast,
  Input,
  Label,
  Progress,
  ProgressRing,
  Select,
  Skeleton,
  Spinner,
  Switch,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@danitesler/ayywi/react";
import { Add01Icon, CheckmarkCircle02Icon, PauseIcon, PlayIcon } from "@hugeicons/core-free-icons";
import { themeOptions } from "../themes";

type Entry = [string, TokenDefinition];
const all = Object.entries(tokens) as Entry[];
const group = (prefix: string) => all.filter(([name]) => name.startsWith(`${prefix}.`));
const short = (name: string) => name.split(".").slice(1).join(".");
const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-");
/** "1.5rem" → "24px", for people who think in pixels. */
const px = (v: TokenDefinition["value"]) => (typeof v === "string" && v.endsWith("rem") ? `${parseFloat(v) * 16}px` : String(v));

function Header({ title, children }: { title: string; children: ReactNode }) {
  return (
    <header className="pv-page__header">
      <p className="ayy-eyebrow">Foundations</p>
      <h1 className="ayy-h2">{title}</h1>
      <p className="ayy-lede">{children}</p>
    </header>
  );
}

// ---- Colors ----

function ThemeSample({ name, label }: (typeof themeOptions)[number]) {
  return (
    <div className="pv-theme" data-theme={name}>
      <strong className="pv-theme__head">{label}</strong>
      <p className="pv-theme__big">Aa</p>
      <div className="ayy-cluster">
        <Button size="sm">Primary</Button>
        <Button size="sm" variant="outline">Outline</Button>
      </div>
    </div>
  );
}

function Swatches({ entries }: { entries: Entry[] }) {
  return (
    <div className="pv-color-tiles">
      {entries.map(([name, t]) => (
        <div className="pv-color-tile" key={name}>
          <div className="pv-color-tile__chip" style={{ background: `var(${t.cssVar})` }} />
          <div className="pv-color-tile__meta">
            <strong>{short(name)}</strong>
            {t.description ? <span className="pv-color-tile__desc">{t.description}</span> : null}
          </div>
        </div>
      ))}
    </div>
  );
}

export const colorCategories = [...new Set(group("color").map(([, t]) => t.category ?? "Other"))];

function ColorsPage() {
  return (
    <article className="pv-page">
      <Header title="Colors">
        Named colours only, never raw hex. They switch with the theme, so one design fits all. Try the theme button at the top of the
        sidebar.
      </Header>

      <h2 className="pv-h pv-h--section" id="colors-themes">
        Themes
      </h2>
      <p className="pv-note">
        Dark contrast: a #000000 page, cards a step up, white text. Light gray: white cards on a grey page. All text passes WCAG AA in every
        theme.
      </p>
      <div className="pv-themes">
        {themeOptions.map((th) => (
          <ThemeSample key={th.name} {...th} />
        ))}
      </div>

      {colorCategories.map((category) => (
        <section key={category} className="pv-section" aria-labelledby={`colors-${slug(category)}`}>
          <h2 className="pv-h pv-h--section" id={`colors-${slug(category)}`}>
            {category}
          </h2>
          <Swatches entries={group("color").filter(([, t]) => (t.category ?? "Other") === category)} />
        </section>
      ))}

      <h2 className="pv-h pv-h--section" id="colors-accents">
        Accents
      </h2>
      <p className="pv-note">Categories, spotlights, charts. Same in every theme.</p>
      <Swatches entries={group("accent")} />
    </article>
  );
}

// ---- Typography ----

const byValue = (entries: Entry[]) => [...entries].sort(([, a], [, b]) => parseFloat(String(a.value)) - parseFloat(String(b.value)));

const TYPE_STYLES: { sample: ReactNode; use: string }[] = [
  { sample: <p className="ayy-eyebrow">Eyebrow</p>, use: "Small label above a heading or section: a category, a step, a page name. One line, never a sentence." },
  { sample: <p className="ayy-h1">Heading 1</p>, use: "The page title. One per page, at the top." },
  { sample: <p className="ayy-h2">Heading 2</p>, use: "Major sections of a page. Use .ayy-display instead for a marketing hero." },
  { sample: <p className="ayy-h3">Heading 3</p>, use: "Sub-sections, and titles of large cards or dialogs." },
  { sample: <p className="ayy-h4">Heading 4</p>, use: "Card and panel titles, group titles inside a section." },
  { sample: <p className="ayy-h5">Heading 5</p>, use: "Titles inside dense UI: list groups, sidebar sections, form fieldsets." },
  { sample: <p className="ayy-h6">Heading 6</p>, use: "The smallest heading: table headers, inline group labels." },
  { sample: <p className="ayy-lede">Lede, a calm intro that sets up the page.</p>, use: "Intro under a page or section title. Two lines at most." },
  { sample: <p>Body text. 日本語、العربية، Ελληνικά, हिन्दी all render with the OS font.</p>, use: "Everything else: paragraphs, labels, table cells, form text. It is the default, so it needs no class." },
  { sample: <p className="ayy-muted">Muted, for captions and secondary info.</p>, use: "Captions, hints, timestamps. Nothing critical." },
  { sample: <p className="ayy-signature" style={{ fontSize: "var(--ayy-text-2xl)" }}>Signature accent</p>, use: "A personal touch: a sign-off, a name, one highlighted word. Once per screen, and never for UI text." },
  { sample: <p>Text highlight (default): <mark className="ayy-text-highlight">search match</mark></p>, use: "Search hits and neutral inline callouts: subtle wash with clean underline." },
  { sample: <p>Text highlight (yellow): <mark className="ayy-text-highlight ayy-text-highlight--warning">attention required</mark></p>, use: "Warning and caution callouts: amber/yellow tint with matching underline." },
  { sample: <p>Text highlight (red): <mark className="ayy-text-highlight ayy-text-highlight--destructive">critical action</mark></p>, use: "Danger and error callouts: red tint with matching underline." },
  { sample: <p>Text highlight (green): <mark className="ayy-text-highlight ayy-text-highlight--success">completed item</mark></p>, use: "Success and confirmation callouts: green tint with matching underline." },
];

function TypographyPage() {
  const sizes = byValue(group("text").filter(([, t]) => String(t.value).endsWith("rem")));
  const densityText = [...sizes.filter(([, t]) => t.density), ...group("control").filter(([name]) => short(name).startsWith("text-"))];
  return (
    <article className="pv-page">
      <Header title="Typography">Four families, one size scale. Sizes follow the browser font size; every script falls back to the system font.</Header>
      <div className="pv-type">
        {TYPE_STYLES.map(({ sample, use }) => (
          <div key={use} className="pv-type__row">
            {sample}
            <p className="pv-type__use">{use}</p>
          </div>
        ))}
      </div>

      <h2 className="pv-h pv-h--section">Families</h2>
      <div className="pv-scale">
        {group("font").map(([name, t]) => (
          <div key={name} className="pv-scale__row">
            <span className="pv-scale__label">
              {short(name)}
              <span className="ayy-muted">{Array.isArray(t.value) ? t.value[0] : String(t.value)}</span>
            </span>
            <span style={{ fontFamily: `var(${t.cssVar})`, fontSize: "var(--ayy-text-xl)" }}>Build it once, ship it everywhere</span>
          </div>
        ))}
      </div>

      <h2 className="pv-h pv-h--section">Sizes that follow density</h2>
      <p className="pv-note">
        UI chrome: buttons, menus, tables, the app shell. Compact / comfortable / touch. Each step is 1px; fields jump to 16px on touch so
        iOS doesn't zoom on focus.
      </p>
      <ScaleRows entries={densityText} />

      <h2 className="pv-h pv-h--section">Fixed sizes</h2>
      <p className="pv-note">Content: headings, body copy, descriptions. Same in every density.</p>
      <ScaleRows entries={sizes.filter(([, t]) => !t.density)} />
    </article>
  );
}

function ScaleRows({ entries }: { entries: Entry[] }) {
  return (
    <div className="pv-scale">
      {entries.map(([name, t]) => (
        <div key={name} className="pv-scale__row">
          <span className="pv-scale__label">
            {t.cssVar.replace("--ayy-", "")}
            <span className="ayy-muted">
              {t.density ? `${px(t.value)} / ${px(t.density.comfortable)} / ${px(t.density.touch)}` : px(t.value)}
            </span>
          </span>
          <span className="pv-scale__sample" style={{ fontSize: `var(${t.cssVar})` }}>
            Build it once, ship it everywhere
          </span>
        </div>
      ))}
    </div>
  );
}

// ---- Spacing & sizing ----

const SIZES = [
  { name: "sm", px: "28px", desc: "Small control height (32px comfortable, 40px touch)." },
  { name: "md", px: "32px", desc: "Default control height (40px comfortable, 44px touch)." },
  { name: "lg", px: "40px", desc: "Large control height (48px comfortable, 52px touch)." },
  { name: "icon-sm", px: "16px", desc: "Dense rows, button icons." },
  { name: "icon-md", px: "20px", desc: "List rows, headings, next to body text." },
  { name: "icon-lg", px: "24px", desc: "Native icon grid." },
  { name: "switch", px: "20px", desc: "Switch track height." },
  { name: "check", px: "16px", desc: "Checkbox and radio box." },
  { name: "touch", px: "44px", desc: "Minimum touch target." },
];

function SpacingPage() {
  return (
    <article className="pv-page">
      <Header title="Spacing & sizing">Spacing on a 4px grid and standard control height scale.</Header>

      <h2 className="pv-h pv-h--section">Spacing</h2>
      <div className="pv-scale">
        {byValue(group("space")).map(([name, t]) => (
          <div key={name} className="pv-scale__row">
            <span className="pv-scale__label">
              {short(name)}
              <span className="ayy-muted">{px(t.value)}</span>
            </span>
            <span className="pv-bar" style={{ inlineSize: `var(${t.cssVar})` }} />
          </div>
        ))}
      </div>

      <h2 className="pv-h pv-h--section">Sizes</h2>
      <div className="pv-scale">
        {SIZES.map(({ name, px, desc }) => (
          <div key={name} className="pv-scale__row">
            <span className="pv-scale__label">
              {name}
              <span className="ayy-muted">{px}</span>
            </span>
            <span className="pv-scale__sample ayy-muted">{desc}</span>
          </div>
        ))}
      </div>

      <h2 className="pv-h pv-h--section">Components by size</h2>
      <p className="pv-note">Controls at each size tier share identical block heights and vertical alignment.</p>
      <div className="pv-densities">
        <Card>
          <CardContent className="ayy-stack">
            <div>
              <strong>Small</strong>
              <p className="ayy-muted" style={{ margin: 0, fontSize: "var(--ayy-text-xs)" }}>28 / 32 / 40px height</p>
            </div>
            <Input aria-label="Small project name" placeholder="Project name" size="sm" />
            <Select aria-label="Small project status" size="sm" defaultValue="active">
              <option value="active">Active</option>
              <option value="archived">Archived</option>
            </Select>
            <div className="ayy-cluster">
              <Button size="sm">Save</Button>
              <Button variant="outline" size="sm">Cancel</Button>
              <Button variant="outline" size="icon-sm" aria-label="Add project"><Icon icon={Add01Icon} /></Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="ayy-stack">
            <div>
              <strong>Medium</strong>
              <p className="ayy-muted" style={{ margin: 0, fontSize: "var(--ayy-text-xs)" }}>32 / 40 / 44px height · Default</p>
            </div>
            <Input aria-label="Medium project name" placeholder="Project name" size="md" />
            <Select aria-label="Medium project status" size="md" defaultValue="active">
              <option value="active">Active</option>
              <option value="archived">Archived</option>
            </Select>
            <div className="ayy-cluster">
              <Button size="md">Save</Button>
              <Button variant="outline" size="md">Cancel</Button>
              <Button variant="outline" size="icon" aria-label="Add project"><Icon icon={Add01Icon} /></Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="ayy-stack">
            <div>
              <strong>Large</strong>
              <p className="ayy-muted" style={{ margin: 0, fontSize: "var(--ayy-text-xs)" }}>40 / 48 / 52px height</p>
            </div>
            <Input aria-label="Large project name" placeholder="Project name" size="lg" />
            <Select aria-label="Large project status" size="lg" defaultValue="active">
              <option value="active">Active</option>
              <option value="archived">Archived</option>
            </Select>
            <div className="ayy-cluster">
              <Button size="lg">Save</Button>
              <Button variant="outline" size="lg">Cancel</Button>
              <Button variant="outline" size="icon-lg" aria-label="Add project"><Icon icon={Add01Icon} /></Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </article>
  );
}

// ---- Radius & elevation ----

function ElevationPage() {
  return (
    <article className="pv-page">
      <Header title="Radius & elevation">Corner radii and shadows for cards, menus and dialogs.</Header>
      <h2 className="pv-h pv-h--section">Radius</h2>
      <div className="pv-tiles">
        {group("radius").map(([name, t]) => (
          <div key={name} className="pv-tile" style={{ borderRadius: `var(${t.cssVar})` }}>
            {short(name)}
          </div>
        ))}
      </div>
      <h2 className="pv-h pv-h--section">Shadows</h2>
      <div className="pv-tiles">
        {group("shadow").map(([name, t]) => (
          <div key={name} className="pv-tile" style={{ boxShadow: `var(${t.cssVar})` }}>
            {short(name)}
          </div>
        ))}
      </div>
    </article>
  );
}

// ---- Motion ----

/** Flips every dot between the track's ends, so each run takes exactly its token's duration. */
function useFlip(ms: number) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const id = setInterval(() => setOn((v) => !v), ms);
    return () => clearInterval(id);
  }, [ms]);
  return on;
}

function MotionRow({ name, value, ease, duration, end }: { name: string; value: string; ease: string; duration: string; end: boolean }) {
  return (
    <div className="pv-motion__row">
      <div className="pv-motion__label">
        <strong>{name}</strong>
        <code>{value}</code>
      </div>
      <div className="pv-motion__track" aria-hidden="true" data-end={end || undefined} style={{ "--pv-ease": ease, "--pv-duration": duration } as CSSProperties}>
        <span className="pv-motion__dot" />
      </div>
    </div>
  );
}

function MotionPage() {
  const end = useFlip(1600);
  const [loopStep, setLoopStep] = useState(0);
  const [running, setRunning] = useState(true);
  const [manualTab, setManualTab] = useState<string | null>(null);
  const [manualToggled, setManualToggled] = useState<boolean | null>(null);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setLoopStep((s) => s + 1);
      setManualTab(null);
      setManualToggled(null);
    }, 2000);
    return () => clearInterval(id);
  }, [running]);

  const step = loopStep % 4;
  const isToggled = manualToggled ?? (step % 2 === 1);
  const tabOptions = ["overview", "activity", "settings"];
  const activeTab = manualTab ?? tabOptions[step % tabOptions.length];
  const progressValues = [25, 65, 100, 45];
  const progressVal = progressValues[step];

  return (
    <article className="pv-page">
      <Header title="Motion">Only position and opacity animate. Reduced motion cuts it short.</Header>

      <h2 className="pv-h pv-h--section">Components in motion</h2>
      <p className="pv-note">Real components on a loop through their active states.</p>

      <div className="pv-motion__controls">
        <div className="ayy-cluster">
          <Button variant="outline" size="sm" onClick={() => setRunning((r) => !r)}>
            <Icon icon={running ? PauseIcon : PlayIcon} />
            {running ? "Pause loop" : "Play loop"}
          </Button>
          <Badge variant={running ? "success" : "outline"}>
            {running ? `Looping · step ${step + 1} of 4` : "Paused"}
          </Badge>
        </div>
        <span className="ayy-muted" style={{ fontSize: "var(--ayy-text-xs)" }}>
          Cycles every 2s · Interact with any control to test
        </span>
      </div>

      <div className="pv-motion__grid">
        <div className="pv-motion__card">
          <div className="pv-motion__row" style={{ justifyContent: "space-between" }}>
            <strong>Toggles & switches</strong>
            <Badge variant="outline">ease.spring · 300ms</Badge>
          </div>
          <div className="pv-motion__stage">
            <div className="ayy-cluster" style={{ gap: "var(--ayy-space-4)", alignItems: "center" }}>
              <Switch checked={isToggled} onChange={() => setManualToggled(!isToggled)} aria-label="Auto-save toggle" />
              <Label className="ayy-cluster" style={{ cursor: "pointer" }}>
                <Checkbox checked={isToggled} onChange={() => setManualToggled(!isToggled)} />
                <span>Auto-save</span>
              </Label>
            </div>
          </div>
          <p className="pv-note">Slight spring overshoot (<code>--ayy-ease-spring</code>) on thumb slide and checkmark scale.</p>
        </div>

        <div className="pv-motion__card">
          <div className="pv-motion__row" style={{ justifyContent: "space-between" }}>
            <strong>Tabs selection</strong>
            <Badge variant="outline">ease.spring · 300ms</Badge>
          </div>
          <div className="pv-motion__stage">
            <Tabs value={activeTab} onValueChange={(val) => setManualTab(val)}>
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="ayy-sr-only">Overview</TabsContent>
              <TabsContent value="activity" className="ayy-sr-only">Activity</TabsContent>
              <TabsContent value="settings" className="ayy-sr-only">Settings</TabsContent>
            </Tabs>
          </div>
          <p className="pv-note">Pill indicator background glides between options with spring curve over base duration.</p>
        </div>

        <div className="pv-motion__card">
          <div className="pv-motion__row" style={{ justifyContent: "space-between" }}>
            <strong>Progress & meter</strong>
            <Badge variant="outline">ease.out-expo · 600ms</Badge>
          </div>
          <div className="pv-motion__stage">
            <div style={{ inlineSize: "100%", display: "flex", alignItems: "center", gap: "var(--ayy-space-4)" }}>
              <Progress aria-label="Task progress" value={progressVal} style={{ flex: "1 1 auto" }} />
              <ProgressRing aria-label="Task completion percentage" value={progressVal} size="md">
                <span style={{ fontSize: "var(--ayy-text-xs)", fontWeight: "var(--ayy-weight-medium)" }}>{progressVal}%</span>
              </ProgressRing>
            </div>
          </div>
          <p className="pv-note">Decelerating <code>--ayy-ease-out-expo</code> over <code>--ayy-duration-slower</code> for value changes.</p>
        </div>

        <div className="pv-motion__card">
          <div className="pv-motion__row" style={{ justifyContent: "space-between" }}>
            <strong>Accordion disclosure</strong>
            <Badge variant="outline">ease.menu · 300ms</Badge>
          </div>
          <div className="pv-motion__stage">
            <Accordion single style={{ inlineSize: "100%" }}>
              <AccordionItem label="Security audit" open={isToggled}>
                <p className="ayy-muted" style={{ margin: 0 }}>All 14 encryption checks passed.</p>
              </AccordionItem>
            </Accordion>
          </div>
          <p className="pv-note">Menu easing (<code>--ayy-ease-menu</code>) animates block size and chevron rotation in lockstep.</p>
        </div>

        <div className="pv-motion__card">
          <div className="pv-motion__row" style={{ justifyContent: "space-between" }}>
            <strong>Toast & overlays</strong>
            <Badge variant="outline">ease.menu · 300ms</Badge>
          </div>
          <div className="pv-motion__stage">
            <InlineToast
              tone="success"
              icon={<Icon icon={CheckmarkCircle02Icon} />}
              className="pv-motion__toast"
              data-visible={isToggled || undefined}
              aria-hidden={!isToggled}
            >
              Workspace settings updated
            </InlineToast>
          </div>
          <p className="pv-note">Menu easing curve for entrance translate and fade on sheets, menus, and toasts.</p>
        </div>

        <div className="pv-motion__card">
          <div className="pv-motion__row" style={{ justifyContent: "space-between" }}>
            <strong>Interactive elevation</strong>
            <Badge variant="outline">ease.out-expo · 450ms</Badge>
          </div>
          <div className="pv-motion__stage">
            <Card interactive className="pv-motion__lift" data-lifted={isToggled || undefined} style={{ inlineSize: "100%" }}>
              <CardContent>
                <div className="ayy-cluster" style={{ justifyContent: "space-between", alignItems: "center" }}>
                  <strong>Pro Workspace</strong>
                  <Badge variant="outline">Active</Badge>
                </div>
                <p className="ayy-muted" style={{ marginBlockStart: "var(--ayy-space-1)", marginBlockEnd: 0, fontSize: "var(--ayy-text-xs)" }}>
                  Elevates with shadow and lift
                </p>
              </CardContent>
            </Card>
          </div>
          <p className="pv-note">Out-expo curve (<code>--ayy-ease-out-expo</code>) over slow duration (450ms) for card lifts.</p>
        </div>

        <div className="pv-motion__card">
          <div className="pv-motion__row" style={{ justifyContent: "space-between" }}>
            <strong>Continuous loading</strong>
            <Badge variant="outline">ease.standard · infinite</Badge>
          </div>
          <div className="pv-motion__stage">
            <div style={{ inlineSize: "100%", display: "flex", flexDirection: "column", gap: "var(--ayy-space-3)" }}>
              <Progress aria-label="Loading task" />
              <div style={{ display: "flex", alignItems: "center", gap: "var(--ayy-space-3)" }}>
                <Skeleton shape="circle" />
                <div style={{ flex: "1 1 auto", display: "flex", flexDirection: "column", gap: "var(--ayy-space-1-5)" }}>
                  <Skeleton shape="text" style={{ inlineSize: "80%" }} />
                  <Skeleton shape="text" style={{ inlineSize: "50%" }} />
                </div>
                <Spinner size="sm" />
              </div>
            </div>
          </div>
          <p className="pv-note">Infinite keyframe loop running <code>--ayy-ease-standard</code> on indeterminate progress and shimmer.</p>
        </div>
      </div>

      <h2 className="pv-h pv-h--section">Easing</h2>
      <p className="pv-note">Same distance over the slower duration (600ms); only the curve changes.</p>
      <div className="pv-motion">
        {group("ease").map(([name, t]) => (
          <MotionRow key={name} name={short(name)} value={Array.isArray(t.value) ? `cubic-bezier(${t.value.join(", ")})` : String(t.value)} ease={`var(${t.cssVar})`} duration="var(--ayy-duration-slower)" end={end} />
        ))}
      </div>
      <h2 className="pv-h pv-h--section">Duration</h2>
      <p className="pv-note">Same curve (standard), different lengths.</p>
      <div className="pv-motion">
        {group("duration").map(([name, t]) => (
          <MotionRow key={name} name={short(name)} value={String(t.value)} ease="var(--ayy-ease-standard)" duration={`var(${t.cssVar})`} end={end} />
        ))}
      </div>
    </article>
  );
}

// ---- Registry: sidebar, routes and search all read this ----

export interface Foundation {
  route: string;
  title: string;
  /** Token groups on the page; their names feed the search. */
  groups: string[];
  keywords: string;
  Page: ComponentType;
}

export const foundations: Foundation[] = [
  { route: "colors", title: "Colors", groups: ["color", "accent"], keywords: `theme themes dark light soft gray contrast accents ${colorCategories.join(" ")}`, Page: ColorsPage },
  { route: "typography", title: "Typography", groups: ["font", "text"], keywords: "type fonts headings", Page: TypographyPage },
  { route: "spacing", title: "Spacing & sizing", groups: ["space", "size", "control"], keywords: "layout gap padding sizes scale height controls", Page: SpacingPage },
  { route: "elevation", title: "Radius & elevation", groups: ["radius", "shadow"], keywords: "corners depth shadow", Page: ElevationPage },
  { route: "motion", title: "Motion", groups: ["ease", "duration"], keywords: "animation easing transition reduced motion", Page: MotionPage },
];

/** Searchable text for a foundation page: its title, keywords and every token on it. */
export function foundationText(f: Foundation): string {
  const names = all.filter(([name]) => f.groups.some((g) => name.startsWith(`${g}.`))).map(([name, t]) => `${name} ${t.cssVar} ${t.category ?? ""}`);
  return `${f.title} ${f.keywords} ${names.join(" ")}`;
}
