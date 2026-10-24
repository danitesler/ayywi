import { useState, type CSSProperties } from "react";
import { ChartLegend, ChartTooltip, ColorSwatchButton, ColorSwatchGroup, Tooltip } from "@danitesler/ayywi/react";

const colours = [
  { name: "Chart 1", token: "--ayy-chart-1" },
  { name: "Chart 2", token: "--ayy-chart-2" },
  { name: "Chart 3", token: "--ayy-chart-3" },
  { name: "Chart 4", token: "--ayy-chart-4" },
  { name: "Chart 5", token: "--ayy-chart-5" },
  { name: "Chart 6", token: "--ayy-chart-6" },
  { name: "Success", token: "--ayy-color-success" },
  { name: "Warning", token: "--ayy-color-warning" },
  { name: "Destructive", token: "--ayy-color-destructive" },
  { name: "Muted", token: "--ayy-color-muted" },
];

const series = ["Comments", "Likes", "Shares", "Saved"];

export default function Example() {
  const [hidden, setHidden] = useState<string[]>([]);
  const toggle = (name: string) =>
    setHidden((now) => (now.includes(name) ? now.filter((n) => n !== name) : now.length < series.length - 1 ? [...now, name] : now));
  return (
    <div className="ayy-stack" style={{ "--ayy-gap": "var(--ayy-space-6)", inlineSize: "100%" } as CSSProperties}>
      <ColorSwatchGroup role="group" aria-label="Chart colours">
        {colours.map((colour) => (
          <Tooltip key={colour.token} content={`${colour.name} · ${colour.token}`}>
            <ColorSwatchButton size="lg" color={`var(${colour.token})`} label={colour.name} pressed={false} />
          </Tooltip>
        ))}
      </ColorSwatchGroup>
      <ChartLegend aria-label="Legend" items={series.map((name) => ({ name }))} hiddenItems={hidden} onToggle={toggle} />
      <div>
        <ChartTooltip
          static
          title="Sep 2026"
          rows={[
            { name: "Comments", value: "17", color: "var(--ayy-chart-4)" },
            { name: "Likes", value: "42", color: "var(--ayy-chart-1)" },
            { name: "Shares", value: "9", color: "var(--ayy-chart-2)" },
          ]}
        />
      </div>
    </div>
  );
}
