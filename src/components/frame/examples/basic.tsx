import { Frame } from "@danitesler/ayywi/react";

export default function Example() {
  return (
    <figure className="ayy-stack" style={{ margin: 0, inlineSize: "min(100%, 28rem)" }}>
      <Frame title="app.oktopost.com/board">
        <svg viewBox="0 0 400 220" role="img" aria-label="Advocacy board: featured stories and a leaderboard">
          <rect width="400" height="220" style={{ fill: "var(--ayy-color-surface)" }} />
          <rect x="16" y="16" width="72" height="188" rx="6" style={{ fill: "var(--ayy-color-wash-hover)" }} />
          <rect x="104" y="16" width="136" height="90" rx="8" style={{ fill: "color-mix(in srgb, var(--ayy-accent-product) 40%, transparent)" }} />
          <rect x="248" y="16" width="136" height="90" rx="8" style={{ fill: "color-mix(in srgb, var(--ayy-accent-ai) 35%, transparent)" }} />
          <rect x="104" y="118" width="280" height="86" rx="8" style={{ fill: "var(--ayy-color-wash-hover)" }} />
        </svg>
      </Frame>
      <figcaption className="ayy-muted">The redesigned board. Customer data blurred.</figcaption>
    </figure>
  );
}
