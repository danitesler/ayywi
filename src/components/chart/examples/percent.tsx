import { BarChart, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@danitesler/ayywi/react";

export default function Example() {
  return (
    <Card style={{ inlineSize: "100%", maxInlineSize: "36rem" }}>
      <CardHeader>
        <CardTitle>Plan mix</CardTitle>
        <CardDescription>Share of customers on each plan · Team grew from 5% to 8%</CardDescription>
      </CardHeader>
      <CardContent>
        <BarChart
          stacked="percent"
          label="Customers by plan, April to September"
          labels={["Apr", "May", "Jun", "Jul", "Aug", "Sep"]}
          series={[
            { name: "Free", values: [6200, 6450, 6600, 6800, 6950, 7100] },
            { name: "Pro", values: [1800, 1950, 2150, 2300, 2600, 2900] },
            { name: "Team", values: [400, 460, 540, 620, 750, 880] },
          ]}
        />
      </CardContent>
    </Card>
  );
}
