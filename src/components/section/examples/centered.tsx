import type { CSSProperties } from "react";
import { Card, CardHeader, CardTitle, Section, SectionDescription, SectionHeader, SectionTitle } from "ayywi/react";

export default function Example() {
  return (
    <Section center className="ayy-container" aria-labelledby="work-title">
      <SectionHeader>
        <SectionTitle id="work-title">Portfolio work</SectionTitle>
        <SectionDescription>Selected case studies in product design, systems and UX strategy.</SectionDescription>
      </SectionHeader>
      <div className="ayy-grid" style={{ "--ayy-min": "12rem" } as CSSProperties}>
        {["Oktopost", "Comeet", "Scalez"].map((name) => (
          <Card key={name}>
            <CardHeader>
              <CardTitle>{name}</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>
    </Section>
  );
}
