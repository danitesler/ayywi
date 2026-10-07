import { Swatch, SwatchCustom, SwatchGroup } from "@danitesler/ayywi/react";

const PENS = [
  { value: "ink", label: "Ink", color: "var(--ayy-color-text)" },
  { value: "red", label: "Red", color: "var(--ayy-color-destructive)" },
  { value: "blue", label: "Blue", color: "var(--ayy-chart-1)" },
  { value: "green", label: "Green", color: "var(--ayy-chart-3)" },
  { value: "amber", label: "Amber", color: "var(--ayy-chart-5)" },
];

export default function Example() {
  return (
    <SwatchGroup aria-label="Pen colour" track>
      {PENS.map((p) => (
        <Swatch key={p.value} size="sm" color={p.color} label={p.label} name="pen" value={p.value} defaultChecked={p.value === "red"} />
      ))}
      <SwatchCustom size="sm" label="Custom colour" defaultValue="#7c5cff" />
    </SwatchGroup>
  );
}
