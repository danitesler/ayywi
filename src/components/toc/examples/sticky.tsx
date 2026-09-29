import type { CSSProperties } from "react";
import { Toc } from "ayywi/react";

export default function Example() {
  return (
    <div
      style={{ display: "grid", gridTemplateColumns: "minmax(0, 11rem) minmax(0, 1fr)", gap: "var(--ayy-space-8)", inlineSize: "100%", "--ayy-spot": "var(--ayy-accent-product)" } as CSSProperties}
    >
      <Toc
        sticky
        numbered
        title="Contents"
        items={[
          { id: "toc-overview", label: "Overview" },
          { id: "toc-system", label: "Design system", children: [{ id: "toc-tokens", label: "Tokens" }] },
          { id: "toc-impact", label: "Impact" },
        ]}
      />
      <div className="ayy-stack" style={{ "--ayy-gap": "var(--ayy-space-10)" } as CSSProperties}>
        <section id="toc-overview">
          <h3 className="ayy-h4">Overview</h3>
          <p className="ayy-muted">Marketing teams plan, publish and measure social content in one app. The board lets colleagues share it with their own networks.</p>
        </section>
        <section id="toc-system">
          <h3 className="ayy-h4">Design system</h3>
          <p className="ayy-muted">Navigation, cards and colour had drifted from screen to screen, and every new feature risked drifting further.</p>
        </section>
        <section id="toc-tokens">
          <h3 className="ayy-h4">Tokens</h3>
          <p className="ayy-muted">Colour, type and spacing became tokens first, so the redesign could ship on them.</p>
        </section>
        <section id="toc-impact">
          <h3 className="ayy-h4">Impact</h3>
          <p className="ayy-muted">The board redesign, the editor rebuild and the AI features all shipped on shared components.</p>
        </section>
      </div>
    </div>
  );
}
