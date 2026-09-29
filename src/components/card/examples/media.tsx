import type { CSSProperties, ReactNode } from "react";
import { Badge, Card, CardDescription, CardHeader, CardLink, CardMedia, CardTitle } from "ayywi/react";

function Cover({ children }: { children: ReactNode }) {
  return (
    <svg viewBox="0 0 320 180" aria-hidden="true">
      <rect width="320" height="180" style={{ fill: "color-mix(in srgb, var(--ayy-spot) 20%, var(--ayy-color-surface))" }} />
      <rect x="56" y="36" width="208" height="160" rx="10" style={{ fill: "var(--ayy-color-surface-raised)", stroke: "var(--ayy-color-line-strong)" }} />
      {children}
    </svg>
  );
}

export default function Example() {
  return (
    <div className="ayy-grid" style={{ "--ayy-min": "15rem", inlineSize: "100%", maxInlineSize: "40rem" } as CSSProperties}>
      <Card interactive spotlight spotColor="var(--ayy-accent-product)">
        <CardMedia>
          <Cover>
            <rect x="76" y="60" width="96" height="10" rx="5" style={{ fill: "var(--ayy-color-line-hover)" }} />
            <rect x="76" y="84" width="168" height="44" rx="6" style={{ fill: "color-mix(in srgb, var(--ayy-spot) 45%, transparent)" }} />
            <rect x="76" y="140" width="80" height="44" rx="6" style={{ fill: "var(--ayy-color-wash-hover)" }} />
            <rect x="164" y="140" width="80" height="44" rx="6" style={{ fill: "var(--ayy-color-wash-hover)" }} />
          </Cover>
        </CardMedia>
        <CardHeader>
          <CardTitle>
            <CardLink href="#oktopost">Oktopost</CardLink>
          </CardTitle>
          <CardDescription>Design system realignment, a new post editor and seamless AI for a B2B social platform.</CardDescription>
        </CardHeader>
      </Card>
      <Card interactive spotlight spotColor="var(--ayy-accent-research)">
        <CardMedia>
          <Cover>
            <circle cx="196" cy="100" r="40" style={{ fill: "color-mix(in srgb, var(--ayy-spot) 55%, transparent)" }} />
            <rect x="76" y="80" width="84" height="8" rx="4" style={{ fill: "var(--ayy-color-line-hover)" }} />
            <rect x="76" y="96" width="64" height="8" rx="4" style={{ fill: "var(--ayy-color-line-hover)" }} />
          </Cover>
        </CardMedia>
        <CardHeader>
          <Badge variant="ai">AI</Badge>
          <CardTitle>
            <CardLink href="#scalez">Scalez</CardLink>
          </CardTitle>
          <CardDescription>A conversational AI marketplace, and Savvy, its first use case: personal styling.</CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
