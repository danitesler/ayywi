import { BarChart, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@danitesler/ayywi/react";

export default function Example() {
  return (
    <Card style={{ inlineSize: "100%", maxInlineSize: "32rem" }}>
      <CardHeader>
        <CardTitle>First response time</CardTitle>
        <CardDescription>Median hours by team · October against September</CardDescription>
      </CardHeader>
      <CardContent>
        <BarChart
          toggle
          horizontal
          label="Median first response time in hours, by team, October and September"
          labels={["Billing", "Technical", "Onboarding", "Enterprise", "Partners"]}
          format={(value) => `${value}h`}
          series={[
            { name: "October", values: [2.4, 5.8, 1.6, 3.1, 4.2] },
            { name: "September", values: [3.1, 6.4, 2.2, 2.9, 5] },
          ]}
        />
      </CardContent>
    </Card>
  );
}
