import { Field, Label, Select } from "@danitesler/ayywi/react";

// One picture per option value: "Aa" in each font.
const FONT_PICTURES = {
  heading: <span style={{ fontFamily: "var(--ayy-font-heading)" }}>Aa</span>,
  body: <span style={{ fontFamily: "var(--ayy-font-body)" }}>Aa</span>,
  mono: <span style={{ fontFamily: "var(--ayy-font-mono)" }}>Aa</span>,
};

export default function Example() {
  return (
    <div className="ayy-stack" style={{ inlineSize: "min(100%, 20rem)" }}>
      <Field>
        <Label htmlFor="region">Region</Label>
        <Select id="region" defaultValue="eu">
          <option value="us">United States</option>
          <option value="eu">Europe</option>
          <option value="apac">Asia Pacific</option>
        </Select>
      </Field>
      <Field>
        <Label htmlFor="title-font">Title font</Label>
        <Select id="title-font" defaultValue="heading" pictures={FONT_PICTURES}>
          <option value="heading">Unbounded</option>
          <option value="body">Sora</option>
          <option value="mono">Monospace</option>
        </Select>
      </Field>
      <Select size="sm" aria-label="Sort by" defaultValue="recent">
        <option value="recent">Most recent</option>
        <option value="name">Name</option>
      </Select>
      <Select disabled aria-label="Plan">
        <option>Enterprise</option>
      </Select>
    </div>
  );
}
