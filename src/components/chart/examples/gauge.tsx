import type { CSSProperties } from "react";
import { Card, CardContent, CardHeader, CardTitle, GaugeChart } from "@danitesler/ayywi/react";

const dollars = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", notation: "compact", maximumFractionDigits: 1 });
const compact = new Intl.NumberFormat("en-US", { notation: "compact" });

export default function Example() {
  return (
    <Card style={{ inlineSize: "100%", maxInlineSize: "32rem" }}>
      <CardHeader>
        <CardTitle>October limits</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="ayy-grid" style={{ "--ayy-min": "10rem" } as CSSProperties}>
          <GaugeChart
            label="Ad spend this month"
            value={7240}
            max={10000}
            size="10rem"
            format={(value) => dollars.format(value)}
            totalLabel="of $10K ad spend"
          />
          <GaugeChart
            label="API calls this month"
            value={92000}
            max={100000}
            size="10rem"
            color="var(--ayy-color-warning)"
            format={(value) => compact.format(value)}
            totalLabel="of 100K API calls"
          />
        </div>
      </CardContent>
    </Card>
  );
}
