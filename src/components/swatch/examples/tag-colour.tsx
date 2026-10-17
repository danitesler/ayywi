import type { CSSProperties } from "react";
import { ColorSwatch, ColorSwatchGroup } from "@danitesler/ayywi/react";

const COLOURS = [
  { value: "blue", label: "Blue", color: "var(--ayy-chart-1)" },
  { value: "orange", label: "Orange", color: "var(--ayy-chart-2)" },
  { value: "green", label: "Green", color: "var(--ayy-chart-3)" },
  { value: "violet", label: "Violet", color: "var(--ayy-chart-4)" },
  { value: "amber", label: "Amber", color: "var(--ayy-chart-5)" },
  { value: "pink", label: "Pink", color: "var(--ayy-chart-6)" },
];

export default function Example() {
  return (
    <div className="ayy-stack" style={{ "--ayy-gap": "var(--ayy-space-1)" } as CSSProperties}>
      <span className="ayy-label" id="tag-colour-label">
        Tag colour
      </span>
      <ColorSwatchGroup aria-labelledby="tag-colour-label">
        <ColorSwatch none label="No colour" name="tag-colour" value="none" />
        {COLOURS.map((c) => (
          <ColorSwatch key={c.value} color={c.color} label={c.label} name="tag-colour" value={c.value} defaultChecked={c.value === "green"} />
        ))}
      </ColorSwatchGroup>
    </div>
  );
}
