import { Card, CardContent, CardDescription, CardHeader, CardTitle, RadarChart } from "@danitesler/ayywi/react";

export default function Example() {
  return (
    <Card style={{ inlineSize: "100%", maxInlineSize: "32rem" }}>
      <CardHeader>
        <CardTitle>Customer survey</CardTitle>
        <CardDescription>Average score out of 10 · support slipped, docs caught up</CardDescription>
      </CardHeader>
      <CardContent>
        <RadarChart
          toggle
          label="Customer survey scores out of 10, this year and last"
          axes={["Ease of use", "Speed", "Reliability", "Support", "Value", "Docs"]}
          max={10}
          format={(value) => value.toFixed(1)}
          series={[
            { name: "2026", values: [8.2, 7.6, 8.8, 6.9, 7.4, 6.1] },
            { name: "2025", compare: true, values: [7.4, 7.1, 8.5, 7.6, 6.8, 5.2] },
          ]}
        />
      </CardContent>
    </Card>
  );
}
