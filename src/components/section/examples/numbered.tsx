import type { CSSProperties } from "react";
import { Section, SectionEyebrow, SectionHeader, SectionTitle } from "ayywi/react";

export default function Example() {
  return (
    <Section style={{ "--ayy-spot": "var(--ayy-accent-product)" } as CSSProperties} aria-labelledby="ds-title">
      <SectionHeader>
        <SectionEyebrow number="02">Design system</SectionEyebrow>
        <SectionTitle id="ds-title">Lobster: the shared language behind every screen</SectionTitle>
      </SectionHeader>
      <div className="ayy-prose">
        <p>
          The product had outgrown its shared UI: navigation, cards and colour varied from screen to screen, and every new feature risked
          drifting further.
        </p>
      </div>
    </Section>
  );
}
