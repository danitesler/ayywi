import type { ComponentType, CSSProperties, ReactNode } from "react";
import { brands, tokens, type TokenDefinition } from "ayywi";
import { contrast, themeOptions, valueIn } from "../themes";

type Entry = [string, TokenDefinition];
const all = Object.entries(tokens) as Entry[];
const group = (prefix: string) => all.filter(([name]) => name.startsWith(`${prefix}.`));
const show = (v: TokenDefinition["value"]) => (Array.isArray(v) ? v.join(", ") : String(v));
const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-");

function Header({ title, children }: { title: string; children: ReactNode }) {
  return (
    <header className="pv-page__header">
      <p className="ayy-eyebrow">Foundations</p>
      <h1 className="ayy-h2">{title}</h1>
      <p className="ayy-lede">{children}</p>
    </header>
  );
}

function Rows({ entries, render }: { entries: Entry[]; render?: (t: TokenDefinition) => ReactNode }) {
  return (
    <div className="ayy-table-wrap">
      <table className="ayy-table">
        <thead>
          <tr>
            <th scope="col">Token</th>
            <th scope="col">Value</th>
            {render ? <th scope="col">Preview</th> : null}
          </tr>
        </thead>
        <tbody>
          {entries.map(([name, t]) => (
            <tr key={name}>
              <td>
                <code className="pv-inline-code">{t.cssVar}</code>
                {t.description ? <span className="pv-token-desc">{t.description}</span> : null}
              </td>
              <td className="ayy-muted">{show(t.value)}</td>
              {render ? <td>{render(t)}</td> : null}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ---- Colors ----

function ThemeSample({ name, label, base }: (typeof themeOptions)[number]) {
  const text = contrast(valueIn(tokens["color.text"], name)!, valueIn(tokens["color.bg"], name)!);
  const muted = contrast(valueIn(tokens["color.muted"], name)!, valueIn(tokens["color.bg"], name)!);
  return (
    <div className="pv-theme" data-theme={name}>
      <div className="pv-theme__head">
        <strong>{label}</strong>
        <code className="pv-theme__attr">data-theme="{name}"</code>
      </div>
      <p className="pv-theme__big">Aa</p>
      <p className="pv-theme__line">
        Text {text.toFixed(1)}:1 · <span className="ayy-muted">muted {muted.toFixed(1)}:1</span>
      </p>
      <div className="ayy-cluster">
        <span className="ayy-button ayy-button--sm">Primary</span>
        <span className="ayy-button ayy-button--sm ayy-button--outline">Outline</span>
        <span className="ayy-badge ayy-badge--success">
          <span className="ayy-badge__dot" />
          {base}
        </span>
      </div>
    </div>
  );
}

function ColorTable({ entries }: { entries: Entry[] }) {
  return (
    <div className="ayy-table-wrap">
      <table className="ayy-table pv-colors">
        <thead>
          <tr>
            <th scope="col">Token</th>
            {themeOptions.map((th) => (
              <th scope="col" key={th.name}>
                {th.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {entries.map(([name, t]) => (
            <tr key={name}>
              <td className="pv-colors__token">
                <code className="pv-inline-code">{t.cssVar}</code>
                {t.description ? <span className="pv-token-desc">{t.description}</span> : null}
              </td>
              {themeOptions.map((th) => {
                const v = valueIn(t, th.name);
                return (
                  <td key={th.name} className="pv-colors__cell" data-theme={th.name}>
                    <span className="pv-colors__chip" style={{ background: `var(${t.cssVar})` }} />
                    {v ? <code className="pv-colors__hex">{v}</code> : null}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
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
            <strong>{name.split(".").slice(1).join(".")}</strong>
            <code className="pv-inline-code">{t.cssVar}</code>
            <span className="ayy-muted">{show(t.value)}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function Palette() {
  const hues = [...new Set(group("palette").map(([name]) => name.split(".")[1]))];
  return (
    <div className="pv-palette">
      {hues.map((hue) => (
        <div key={hue} className="pv-palette__row">
          <span className="pv-palette__hue">{hue}</span>
          <div className="pv-palette__chips">
            {group(`palette.${hue}`).map(([name, t]) => (
              <div key={name} className="pv-palette__chip" title={`${t.cssVar}: ${show(t.value)}`}>
                <span className="pv-palette__fill" style={{ background: `var(${t.cssVar})` }} />
                <code>{name.split(".")[2]}</code>
              </div>
            ))}
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
        Components only use the semantic colours below. They switch with the theme, so the same markup works in every one of them.
      </Header>

      <h2 className="pv-h pv-h--section" id="colors-themes">
        Themes
      </h2>
      <p className="pv-note">
        Set <code className="pv-inline-code">data-theme</code> on the page or any section. The soft themes lower the contrast (charcoal and off-white instead
        of black and white) for easier reading; every text colour still passes WCAG AA, and <code className="pv-inline-code">pnpm check</code> enforces it.
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
          <ColorTable entries={group("color").filter(([, t]) => (t.category ?? "Other") === category)} />
        </section>
      ))}

      <h2 className="pv-h pv-h--section" id="colors-accents">
        Accents
      </h2>
      <p className="pv-note">Colour comes from content: categories, spotlights, charts. The same in every theme.</p>
      <Swatches entries={group("accent")} />

      <h2 className="pv-h pv-h--section" id="colors-palette">
        Palette
      </h2>
      <p className="pv-note">
        Raw primitives, named by lightness. Semantic tokens point at these; components never use them directly. Brands (
        {brands.map((b) => (
          <code key={b} className="pv-inline-code">
            {b}
          </code>
        ))}
        ) and themes re-point semantic tokens at different primitives.
      </p>
      <Palette />
    </article>
  );
}

// ---- Typography ----

function TypographyPage() {
  return (
    <article className="pv-page">
      <Header title="Typography">Sizes are in rem, so they follow the reader's browser font size. Body text always ends in system fonts.</Header>
      <div className="pv-type">
        <p className="ayy-eyebrow">Eyebrow · .ayy-eyebrow</p>
        <p className="ayy-h1">Heading 1</p>
        <p className="ayy-h2">Heading 2</p>
        <p className="ayy-h3">Heading 3</p>
        <p className="ayy-h4">Heading 4</p>
        <p className="ayy-lede">Lede — a calm intro paragraph that sets up the page.</p>
        <p>Body — Sora with system fallbacks. 日本語、العربية، Ελληνικά, हिन्दी all render with the OS font.</p>
        <p className="ayy-muted">Muted — captions and secondary info.</p>
        <p className="ayy-signature" style={{ fontSize: "var(--ayy-text-2xl)" }}>
          Signature accent
        </p>
        <p className="ayy-mono">Mono — const theme = "dark";</p>
      </div>
      <h2 className="pv-h pv-h--section">Families</h2>
      <Rows entries={group("font")} render={(t) => <span style={{ fontFamily: `var(${t.cssVar})` }}>Aa Bb 123</span>} />
      <h2 className="pv-h pv-h--section">Sizes</h2>
      <Rows entries={group("text")} render={(t) => <span style={{ fontSize: `var(${t.cssVar})`, lineHeight: 1.2 }}>Ag</span>} />
      <h2 className="pv-h pv-h--section">Weight, leading, tracking</h2>
      <Rows entries={[...group("weight"), ...group("leading"), ...group("tracking")]} />
    </article>
  );
}

// ---- Spacing & sizing ----

function DensityRows() {
  const entries = all.filter(([, t]) => t.density);
  return (
    <div className="ayy-table-wrap">
      <table className="ayy-table">
        <thead>
          <tr>
            <th scope="col">Token</th>
            <th scope="col">Compact</th>
            <th scope="col">Comfortable</th>
            <th scope="col">Touch</th>
          </tr>
        </thead>
        <tbody>
          {entries.map(([name, t]) => (
            <tr key={name}>
              <td>
                <code className="pv-inline-code">{t.cssVar}</code>
                {t.description ? <span className="pv-token-desc">{t.description}</span> : null}
              </td>
              <td className="ayy-muted">{show(t.value)}</td>
              <td className="ayy-muted">{t.density?.comfortable}</td>
              <td className="ayy-muted">{t.density?.touch}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SpacingPage() {
  return (
    <article className="pv-page">
      <Header title="Spacing & sizing">A 4px grid for layout, and control sizes that follow the density setting.</Header>
      <h2 className="pv-h pv-h--section">Spacing</h2>
      <Rows entries={group("space")} render={(t) => <span className="pv-bar" style={{ inlineSize: `var(${t.cssVar})` }} />} />
      <h2 className="pv-h pv-h--section">Density</h2>
      <p className="pv-note">
        Control heights, paddings and text follow <code className="pv-inline-code">data-density</code> (compact · comfortable · touch). Left alone, touch
        screens get touch sizes automatically. Switch it in the toolbar.
      </p>
      <DensityRows />
      <h2 className="pv-h pv-h--section">Fixed sizes</h2>
      <Rows entries={group("size").filter(([, t]) => !t.density)} />
    </article>
  );
}

// ---- Radius & elevation ----

function ElevationPage() {
  return (
    <article className="pv-page">
      <Header title="Radius & elevation">Corner radii, shadows and stacking order.</Header>
      <h2 className="pv-h pv-h--section">Radius</h2>
      <div className="pv-tiles">
        {group("radius").map(([name, t]) => (
          <div key={name} className="pv-tile" style={{ borderRadius: `var(${t.cssVar})` }}>
            <code className="pv-inline-code">{name.replace("radius.", "")}</code>
          </div>
        ))}
      </div>
      <h2 className="pv-h pv-h--section">Shadows</h2>
      <div className="pv-tiles">
        {group("shadow").map(([name, t]) => (
          <div key={name} className="pv-tile" style={{ boxShadow: `var(${t.cssVar})` }}>
            <code className="pv-inline-code">{name.replace("shadow.", "")}</code>
          </div>
        ))}
      </div>
      <h2 className="pv-h pv-h--section">Stacking</h2>
      <Rows entries={group("z")} />
    </article>
  );
}

// ---- Motion ----

function MotionPage() {
  return (
    <article className="pv-page">
      <Header title="Motion">Only transform and opacity animate, and everything collapses under reduced motion.</Header>
      <h2 className="pv-h pv-h--section">Easing</h2>
      <p className="pv-note">Hover or focus a tile.</p>
      <div className="pv-tiles">
        {group("ease").map(([name, t]) => (
          <div key={name} className="pv-tile pv-tile--motion" style={{ "--pv-ease": `var(${t.cssVar})` } as CSSProperties} tabIndex={0}>
            <code className="pv-inline-code">{name.replace("ease.", "")}</code>
          </div>
        ))}
      </div>
      <h2 className="pv-h pv-h--section">Durations</h2>
      <Rows entries={group("duration")} />
    </article>
  );
}

// ---- Registry: sidebar, routes and search all read this ----

export interface FoundationSection {
  /** Heading id is `${route}-${id}`; the sidebar links to #/<route>/<id>. */
  id: string;
  title: string;
  /** Extra searchable text (token names in the section). */
  text: string;
}

export interface Foundation {
  route: string;
  title: string;
  /** Token groups on the page; their names feed the search. */
  groups: string[];
  /** Sub-sections listed under the page in the sidebar. */
  sections?: FoundationSection[];
  keywords: string;
  Page: ComponentType;
}

export const foundations: Foundation[] = [
  {
    route: "colors",
    title: "Colors",
    groups: ["color", "accent", "palette"],
    keywords: `theme themes dark light soft contrast ${colorCategories.join(" ")}`,
    sections: [
      { id: "themes", title: "Themes", text: "dark light dark-soft light-soft data-theme contrast" },
      ...colorCategories.map((category) => ({
        id: slug(category),
        title: category,
        text: group("color")
          .filter(([, t]) => (t.category ?? "Other") === category)
          .map(([name, t]) => `${name} ${t.cssVar}`)
          .join(" "),
      })),
      { id: "accents", title: "Accents", text: group("accent").map(([name, t]) => `${name} ${t.cssVar}`).join(" ") },
      { id: "palette", title: "Palette", text: "palette primitives neutral red green amber blue violet" },
    ],
    Page: ColorsPage,
  },
  { route: "typography", title: "Typography", groups: ["font", "text", "weight", "leading", "tracking"], keywords: "type fonts headings", Page: TypographyPage },
  { route: "spacing", title: "Spacing & sizing", groups: ["space", "size", "control"], keywords: "density layout gap padding", Page: SpacingPage },
  { route: "elevation", title: "Radius & elevation", groups: ["radius", "shadow", "z"], keywords: "corners depth z-index layers", Page: ElevationPage },
  { route: "motion", title: "Motion", groups: ["ease", "duration"], keywords: "animation easing transition reduced motion", Page: MotionPage },
];

/** Searchable text for a foundation page: its title, keywords and every token on it. */
export function foundationText(f: Foundation): string {
  const names = all.filter(([name]) => f.groups.some((g) => name.startsWith(`${g}.`))).map(([name, t]) => `${name} ${t.cssVar} ${t.category ?? ""}`);
  return `${f.title} ${f.keywords} ${names.join(" ")}`;
}
