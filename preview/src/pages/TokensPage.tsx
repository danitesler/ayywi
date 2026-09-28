import type { CSSProperties, ReactNode } from "react";
import { brands, tokens, type TokenDefinition } from "ayywi";

type Entry = [string, TokenDefinition];
const all = Object.entries(tokens) as Entry[];
const group = (prefix: string) => all.filter(([name]) => name.startsWith(`${prefix}.`));
const show = (v: TokenDefinition["value"]) => (Array.isArray(v) ? v.join(", ") : String(v));

function Swatches({ entries }: { entries: Entry[] }) {
  return (
    <div className="pv-swatches">
      {entries.map(([name, t]) => (
        <div className="pv-swatch" key={name}>
          <div className="pv-swatch__chip" style={{ background: `var(${t.cssVar})` }} />
          <div className="pv-swatch__meta">
            <strong>{name.split(".").slice(1).join(".")}</strong>
            <code className="pv-inline-code">{t.cssVar}</code>
            <span className="ayy-muted">
              {t.light ? `dark ${show(t.value)} · light ${t.light}` : show(t.value)}
            </span>
            {t.description ? <span className="pv-swatch__desc">{t.description}</span> : null}
          </div>
        </div>
      ))}
    </div>
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

export function TokensPage() {
  return (
    <article className="pv-page">
      <header className="pv-page__header">
        <p className="ayy-eyebrow">Foundations</p>
        <h1 className="ayy-h2">Tokens</h1>
        <p className="ayy-lede">
          {all.length} tokens, generated from <code className="pv-inline-code">tokens/tokens.json</code>. Every value is a CSS custom property that
          flips with the theme — switch it in the toolbar and watch.
        </p>
      </header>

      <h2 className="pv-h pv-h--section">Palette</h2>
      <p className="pv-note">
        Raw primitives, named by lightness. Semantic tokens below point at these; components never use them directly. Rebrand by pointing
        semantics at different primitives — see <code className="pv-inline-code">tokens/brands/</code>.
      </p>
      <Swatches entries={group("palette")} />

      <h2 className="pv-h pv-h--section">Colour</h2>
      <p className="pv-note">Monochrome frame. Lines and washes are the text colour mixed with transparent, so they work on any surface in both themes.</p>
      <Swatches entries={group("color")} />

      <h2 className="pv-h pv-h--section">Accents</h2>
      <p className="pv-note">Colour comes from content: categories, spotlights, charts. Same in both themes.</p>
      <Swatches entries={group("accent")} />

      <h2 className="pv-h pv-h--section">Typography</h2>
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
      <Rows entries={group("font")} render={(t) => <span style={{ fontFamily: `var(${t.cssVar})` }}>Aa Bb 123</span>} />
      <Rows entries={group("text")} render={(t) => <span style={{ fontSize: `var(${t.cssVar})`, lineHeight: 1.2 }}>Ag</span>} />

      <h2 className="pv-h pv-h--section">Spacing</h2>
      <Rows
        entries={group("space")}
        render={(t) => <span className="pv-bar" style={{ inlineSize: `var(${t.cssVar})` }} />}
      />

      <h2 className="pv-h pv-h--section">Radius</h2>
      <div className="pv-tiles">
        {group("radius").map(([name, t]) => (
          <div key={name} className="pv-tile" style={{ borderRadius: `var(${t.cssVar})` }}>
            <code className="pv-inline-code">{name.replace("radius.", "")}</code>
          </div>
        ))}
      </div>

      <h2 className="pv-h pv-h--section">Elevation</h2>
      <div className="pv-tiles">
        {group("shadow").map(([name, t]) => (
          <div key={name} className="pv-tile" style={{ boxShadow: `var(${t.cssVar})` }}>
            <code className="pv-inline-code">{name.replace("shadow.", "")}</code>
          </div>
        ))}
      </div>

      <h2 className="pv-h pv-h--section">Motion</h2>
      <p className="pv-note">Hover a tile. Only transform and opacity animate; everything collapses under reduced motion.</p>
      <div className="pv-tiles">
        {group("ease").map(([name, t]) => (
          <div
            key={name}
            className="pv-tile pv-tile--motion"
            style={{ "--pv-ease": `var(${t.cssVar})` } as CSSProperties}
            tabIndex={0}
          >
            <code className="pv-inline-code">{name.replace("ease.", "")}</code>
          </div>
        ))}
      </div>
      <h2 className="pv-h pv-h--section">Density</h2>
      <p className="pv-note">
        Control sizes follow <code className="pv-inline-code">data-density</code> (compact · comfortable · touch). Left alone, coarse pointers get
        touch sizes automatically. Switch it in the toolbar.
      </p>
      <DensityRows />

      <h2 className="pv-h pv-h--section">Brands</h2>
      <p className="pv-note">
        A brand swaps a handful of semantic tokens under <code className="pv-inline-code">data-brand</code>. Shipped:{" "}
        {brands.map((b) => (
          <code key={b} className="pv-inline-code">
            {b}
          </code>
        ))}
        . Try Violet in the toolbar.
      </p>

      <h2 className="pv-h pv-h--section">Everything else</h2>
      <Rows entries={[...group("duration"), ...group("size").filter(([, t]) => !t.density), ...group("weight"), ...group("leading"), ...group("tracking"), ...group("z")]} />
    </article>
  );
}
