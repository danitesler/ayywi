import { Card, CardContent, CardDescription, CardHeader, CardTitle, FunnelChart } from "@danitesler/ayywi/react";

export default function Example() {
  return (
    <Card style={{ inlineSize: "100%", maxInlineSize: "36rem" }}>
      <CardHeader>
        <CardTitle>Signup funnel</CardTitle>
        <CardDescription>Last 30 days · rates are of the step before</CardDescription>
      </CardHeader>
      <CardContent>
        <FunnelChart
          aria-label="Signup funnel, last 30 days"
          steps={[
            { label: "Visited pricing", value: 12400 },
            { label: "Started signup", value: 4830 },
            { label: "Verified email", value: 3610 },
            { label: "Created a workspace", value: 2240 },
            { label: "Invited a teammate", value: 1120 },
          ]}
        />
      </CardContent>
    </Card>
  );
}
