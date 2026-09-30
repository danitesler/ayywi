import { Badge, Card } from "ayywi/react";
import type { ComponentEntry } from "../data";
import { Example } from "../Example";
import type { Renderer } from "../settings";

const TONES = {
  yes: "var(--ayy-color-success)",
  no: "var(--ayy-color-destructive)",
} as const;

function Guidance({ title, items, tone }: { title: string; items: string[]; tone: keyof typeof TONES }) {
  if (!items.length) return null;
  return (
    <Card spotlight spotColor={TONES[tone]} className={`pv-guide pv-guide--${tone}`}>
      <h3 className="ayy-h6">{title}</h3>
      <ul className="pv-guide__list">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </Card>
  );
}

/**
 * What a person needs to pick and brief a component: how it looks and when to use it.
 * The full reference (classes, props, states, accessibility) goes to the AI through the MCP server and llms-full.txt.
 */
export function ComponentPage({ component: c, renderer }: { component: ComponentEntry; renderer: Renderer }) {
  return (
    <article className="pv-page">
      <header className="pv-page__header">
        <p className="ayy-eyebrow">{c.category}</p>
        <div className="pv-title-row">
          <h1 className="ayy-h2">{c.name}</h1>
          {c.status !== "stable" ? (
            <Badge variant="warning" dot="static">
              {c.status}
            </Badge>
          ) : null}
        </div>
        <p className="ayy-lede">{c.description}</p>
      </header>

      {c.examples.map((ex) => (
        <Example key={ex.id} example={ex} renderer={renderer} />
      ))}

      <div className="pv-usage">
        <Guidance title="Do" items={c.do} tone="yes" />
        <Guidance title="Don't" items={c.dont} tone="no" />
      </div>
    </article>
  );
}
