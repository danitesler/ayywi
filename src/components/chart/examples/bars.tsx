import { BarChart, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@danitesler/ayywi/react";

export default function Example() {
  return (
    <Card style={{ inlineSize: "100%", maxInlineSize: "36rem" }}>
      <CardHeader>
        <CardTitle>Signups by device</CardTitle>
        <CardDescription>Last six months · 21.2K in total</CardDescription>
      </CardHeader>
      <CardContent>
        <BarChart
          label="Signups by device, April to September"
          labels={["Apr", "May", "Jun", "Jul", "Aug", "Sep"]}
          series={[
            { name: "Desktop", values: [1840, 2120, 1960, 2410, 2280, 2690] },
            { name: "Mobile", values: [920, 1180, 1340, 1210, 1490, 1730] },
          ]}
        />
      </CardContent>
    </Card>
  );
}
