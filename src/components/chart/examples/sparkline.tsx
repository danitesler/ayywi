import type { CSSProperties } from "react";
import { Card, CardContent, Sparkline, Stat } from "ayywi/react";

const stats = [
  { label: "Visitors", value: "12.8k", trend: "up 9%", values: [8, 9, 8.5, 10, 9.8, 11, 10.6, 11.8, 12.1, 12.8], color: undefined },
  { label: "Conversion", value: "3.4%", trend: "up 0.3 points", values: [3.1, 3.2, 3.1, 3.2, 3.3, 3.2, 3.3, 3.4, 3.3, 3.4], color: undefined },
  { label: "Churn", value: "1.9%", trend: "down 0.4 points", values: [2.4, 2.3, 2.3, 2.2, 2.1, 2.2, 2, 2, 1.9, 1.9], color: "var(--ayy-color-success)" },
];

export default function Example() {
  return (
    <div className="ayy-grid" style={{ "--ayy-min": "12rem", inlineSize: "100%" } as CSSProperties}>
      {stats.map((stat) => (
        <Card key={stat.label}>
          <CardContent>
            <div className="ayy-spread" style={{ alignItems: "end" } as CSSProperties}>
              <Stat labelFirst size="sm" label={stat.label} value={stat.value} />
              <Sparkline
                values={stat.values}
                area
                label={`${stat.label}, last 10 days, ${stat.trend}`}
                color={stat.color}
              />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
