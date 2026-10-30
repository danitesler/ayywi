import { type ComponentType } from "react";
import { Card } from "@danitesler/ayywi/react";
import { AdaptiveSketch, AgentSketch, CustomSketch, DevicesSketch, NextSketch } from "../illustrations";

export const principlesPage = {
  route: "principles",
  title: "Principles",
  keywords: "principles philosophy agent-first ai agents cross-platform adaptive responsive customizable themes shortcuts generative future",
  text: "principles philosophy agent-first ai agents cross-platform web mobile desktop adaptive responsive context customizable themes keyboard shortcuts layouts extensible generative interfaces",
};

/** Each row's accent: the spot colours of the Colors page, one per principle. */
interface Principle {
  title: string;
  accent: string;
  body: string;
  Sketch: ComponentType;
}

const PRINCIPLES: Principle[] = [
  {
    title: "Agent-First",
    accent: "var(--ayy-accent-ai)",
    body: "Designed for humans and AI agents to work seamlessly together. Every component supports clear interactions, predictable states, and agent-driven workflows.",
    Sketch: AgentSketch,
  },
  {
    title: "Cross-Platform by Design",
    accent: "var(--ayy-accent-product)",
    body: "One unified system across products, channels, and devices. Supports web, mobile, desktop, B2B, and B2C experiences while maintaining consistency without sacrificing platform-specific needs.",
    Sketch: DevicesSketch,
  },
  {
    title: "Adaptive by Nature",
    accent: "var(--ayy-accent-system)",
    body: "Interfaces dynamically adapt to screen sizes, device capabilities, user preferences, and context. Experiences adjust in real time rather than relying on rigid, predefined layouts.",
    Sketch: AdaptiveSketch,
  },
  {
    title: "Customizable by Default",
    accent: "var(--ayy-accent-brand)",
    body: "Users can shape their experience through configurable themes, colors, keyboard shortcuts, widget placement, and layouts—without compromising usability or consistency.",
    Sketch: CustomSketch,
  },
  {
    title: "Built for What's Next",
    accent: "var(--ayy-accent-marketing)",
    body: "A progressive, extensible system designed to evolve with technology. Ready for generative interfaces, new interaction models, emerging devices, and experiences that haven't been invented yet.",
    Sketch: NextSketch,
  },
];

export function PrinciplesPage() {
  return (
    <article className="pv-page">
      <header className="pv-page__header pv-page__header--center">
        <p className="ayy-eyebrow">Start</p>
        <h1 className="ayy-h2">Principles</h1>
        <p className="ayy-lede">Five ideas every component and token is held to. Hover a row to see it move.</p>
      </header>
      <ol className="pv-principles">
        {PRINCIPLES.map(({ title, accent, body, Sketch }, i) => (
          <li key={title}>
            <Card spotlight transparent spotColor={accent} className="pv-principle pv-art-host">
              <div className="pv-principle__inner">
                <div className="pv-principle__text">
                  <span className="pv-principle__num ayy-text-outline" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h2 className="pv-principle__title">{title}</h2>
                  <p className="pv-principle__body">{body}</p>
                </div>
                <div className="pv-principle__art" aria-hidden="true">
                  <Sketch />
                </div>
              </div>
            </Card>
          </li>
        ))}
      </ol>
    </article>
  );
}
