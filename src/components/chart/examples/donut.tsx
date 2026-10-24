import { Card, CardContent, CardHeader, CardTitle, DonutChart } from "@danitesler/ayywi/react";

export default function Example() {
  return (
    <Card style={{ inlineSize: "100%", maxInlineSize: "30rem" }}>
      <CardHeader>
        <CardTitle>Tickets by channel</CardTitle>
      </CardHeader>
      <CardContent>
        <DonutChart
          toggle
          label="Support tickets by channel, September"
          name="Tickets"
          totalLabel="tickets"
          size="10rem"
          items={[
            { name: "Email", value: 1240 },
            { name: "Chat", value: 860 },
            { name: "Phone", value: 420 },
            { name: "Social", value: 320 },
          ]}
        />
      </CardContent>
    </Card>
  );
}
