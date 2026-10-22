import { Card, CardContent, CardDescription, CardHeader, CardTitle, ScatterChart } from "@danitesler/ayywi/react";

const dollars = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", notation: "compact" });

export default function Example() {
  return (
    <Card style={{ inlineSize: "100%", maxInlineSize: "36rem" }}>
      <CardHeader>
        <CardTitle>Markets</CardTitle>
        <CardDescription>Cost to win a customer against what they spend · bubbles sized by customers</CardDescription>
      </CardHeader>
      <CardContent>
        <ScatterChart
          label="Markets by acquisition cost, lifetime value and customers"
          xLabel="Acquisition cost"
          yLabel="Lifetime value"
          zLabel="Customers"
          formatX={(value) => dollars.format(value)}
          formatY={(value) => dollars.format(value)}
          series={[
            {
              name: "Markets",
              points: [
                { label: "Germany", x: 210, y: 2900, z: 4200 },
                { label: "France", x: 260, y: 2400, z: 2600 },
                { label: "Spain", x: 150, y: 1500, z: 1400 },
                { label: "Italy", x: 190, y: 1700, z: 900 },
                { label: "Netherlands", x: 320, y: 3200, z: 1100 },
                { label: "Poland", x: 110, y: 950, z: 600 },
                { label: "Sweden", x: 410, y: 2700, z: 450 },
              ],
            },
          ]}
        />
      </CardContent>
    </Card>
  );
}
