import { Card, CardContent, CardDescription, CardHeader, CardTitle, ScatterChart } from "@danitesler/ayywi/react";

const dollars = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", notation: "compact" });

export default function Example() {
  return (
    <Card style={{ inlineSize: "100%", maxInlineSize: "36rem" }}>
      <CardHeader>
        <CardTitle>Deals closed this quarter</CardTitle>
        <CardDescription>Bigger deals take longer, and the slowest ones are lost</CardDescription>
      </CardHeader>
      <CardContent>
        <ScatterChart
          toggle
          label="Deals closed this quarter, by size and days to close"
          xLabel="Deal size"
          yLabel="Days to close"
          formatX={(value) => dollars.format(value)}
          series={[
            {
              name: "Won",
              points: [
                { x: 8000, y: 12 }, { x: 12000, y: 18 }, { x: 15000, y: 15 }, { x: 22000, y: 26 }, { x: 26000, y: 31 },
                { x: 31000, y: 28 }, { x: 38000, y: 42 }, { x: 44000, y: 39 }, { x: 52000, y: 55 }, { x: 61000, y: 48 },
              ],
            },
            {
              name: "Lost",
              points: [
                { x: 9000, y: 34 }, { x: 18000, y: 47 }, { x: 24000, y: 58 }, { x: 35000, y: 66 }, { x: 47000, y: 72 },
                { x: 58000, y: 81 }, { x: 72000, y: 64 },
              ],
            },
          ]}
        />
      </CardContent>
    </Card>
  );
}
