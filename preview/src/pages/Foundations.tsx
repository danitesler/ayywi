import { useEffect, useState, type ComponentType, type CSSProperties, type ReactNode } from "react";
import { tokens, type TokenDefinition } from "@danitesler/ayywi";
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
        <span className="ayy-button ayy-button--sm">Primary</span>
        <span className="ayy-button ayy-button--sm ayy-button--outline">Outline</span>
      </div>
    </div>
  );
}

function Swatches({ entries }: { entries: Entry[] }) {
  return (
    <div className="pv-swatches">
      {entries.map(([name, t]) => (
        <div className="pv-swatch" key={name}>
          <div className="pv-swatch__chip" style={{ background: `var(${t.cssVar})` }} />
          <div className="pv-swatch__meta">
            <strong>{short(name)}</strong>
            {t.description ? <span className="pv-swatch__desc">{t.description}</span> : null}
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
        Components use these named colours, never raw hex. They switch with the theme, so one design works in all of them. Switch the theme from the palette menu
        at the top of the sidebar to see each set.
      </Header>

      <h2 className="pv-h pv-h--section" id="colors-themes">
        Themes
      </h2>
      <p className="pv-note">
        Dark soft is a near-black theme: a very dark page, cards a step up, white text. Light gray puts white cards on a grey page. All text passes WCAG AA contrast in every
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
      <p className="pv-note">For content, not chrome: categories, spotlights, charts. The same in every theme.</p>
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
  { sample: <p className="ayy-lede">Lede, a calm intro paragraph that sets up the page.</p>, use: "The intro paragraph right under a page or section title. Keep it to two lines or so." },
  { sample: <p>Body text. 日本語、العربية، Ελληνικά, हिन्दी all render with the OS font.</p>, use: "Everything else: paragraphs, labels, table cells, form text. It is the default, so it needs no class." },
  { sample: <p className="ayy-muted">Muted, for captions and secondary info.</p>, use: "Captions, hints, timestamps, helper text. Not for anything the reader must not miss." },
  { sample: <p className="ayy-signature" style={{ fontSize: "var(--ayy-text-2xl)" }}>Signature accent</p>, use: "A personal touch: a sign-off, a name, one highlighted word. Once per screen, and never for UI text." },
  { sample: <p className="ayy-mono">Mono, for code</p>, use: "Code, commands, tokens, IDs and anything where characters must line up." },
];

function TypographyPage() {
  const sizes = byValue(group("text").filter(([, t]) => String(t.value).endsWith("rem")));
  return (
    <article className="pv-page">
      <Header title="Typography">Four families and one size scale. Sizes follow the reader's browser font size, and every script falls back to the system font.</Header>
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

      <h2 className="pv-h pv-h--section">Sizes</h2>
      <div className="pv-scale">
        {sizes.map(([name, t]) => (
          <div key={name} className="pv-scale__row">
            <span className="pv-scale__label">
              {short(name)}
              <span className="ayy-muted">{px(t.value)}</span>
            </span>
            <span className="pv-scale__sample" style={{ fontSize: `var(${t.cssVar})` }}>
              Build it once, ship it everywhere
            </span>
          </div>
        ))}
      </div>
    </article>
  );
}

// ---- Spacing & sizing ----

const DENSITIES: [string, string][] = [
  ["compact", "Compact, the default on desktop."],
  ["comfortable", "Comfortable, a little more room."],
  ["touch", "Touch, automatic on touch screens."],
];

function SpacingPage() {
  return (
    <article className="pv-page">
      <Header title="Spacing & sizing">Layout spacing sits on a 4px grid. Controls grow or shrink with the density setting.</Header>

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

      <h2 className="pv-h pv-h--section">Density</h2>
      <p className="pv-note">The same controls at each density. Pick one for the whole site from the palette menu at the top of the sidebar.</p>
      <div className="pv-densities">
        {DENSITIES.map(([mode, text]) => (
          <div key={mode} className="pv-density" data-density={mode}>
            <p className="pv-note">{text}</p>
            <input className="ayy-input" aria-label={`Name (${mode})`} placeholder="Project name" />
            <div className="ayy-cluster">
              <button type="button" className="ayy-button">
                Save
              </button>
              <button type="button" className="ayy-button ayy-button--outline">
                Cancel
              </button>
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}

// ---- Radius & elevation ----

function ElevationPage() {
  return (
    <article className="pv-page">
      <Header title="Radius & elevation">Corner radii, and the shadows that lift cards, menus and dialogs off the page.</Header>
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
  return (
    <article className="pv-page">
      <Header title="Motion">Only position and opacity animate, and motion is cut short when the reader asks for reduced motion.</Header>
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
  { route: "spacing", title: "Spacing & sizing", groups: ["space", "size"], keywords: "density compact comfortable touch layout gap padding", Page: SpacingPage },
  { route: "elevation", title: "Radius & elevation", groups: ["radius", "shadow"], keywords: "corners depth shadow", Page: ElevationPage },
  { route: "motion", title: "Motion", groups: ["ease", "duration"], keywords: "animation easing transition reduced motion", Page: MotionPage },
];

/** Searchable text for a foundation page: its title, keywords and every token on it. */
export function foundationText(f: Foundation): string {
  const names = all.filter(([name]) => f.groups.some((g) => name.startsWith(`${g}.`))).map(([name, t]) => `${name} ${t.cssVar} ${t.category ?? ""}`);
  return `${f.title} ${f.keywords} ${names.join(" ")}`;
}
