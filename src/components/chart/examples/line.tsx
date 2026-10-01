import { Badge, Card, CardContent, CardHeader, CardTitle, LineChart, Stat } from "ayywi/react";

const dollars = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", notation: "compact" });
const days = ["Sep 1", "Sep 2", "Sep 3", "Sep 4", "Sep 5", "Sep 6", "Sep 7", "Sep 8", "Sep 9", "Sep 10", "Sep 11", "Sep 12", "Sep 13", "Sep 14"];

export default function Example() {
  return (
    <Card style={{ inlineSize: "100%", maxInlineSize: "40rem" }}>
      <CardHeader>
        <div className="ayy-spread">
          <CardTitle>Revenue</CardTitle>
          <Badge variant="success">+13% on last period</Badge>
        </div>
        <Stat size="sm" value="$49.2K" unit="last 14 days" />
      </CardHeader>
      <CardContent>
        <LineChart
          label="Daily revenue in dollars, this period and the one before"
          labels={days}
          format={(value) => dollars.format(value)}
          series={[
            { name: "This period", values: [2900, 3100, 3050, 3400, 3300, 3650, 3200, 3500, 3800, 3700, 3950, 3600, 4100, 3950] },
            { name: "Last period", compare: true, values: [2700, 2850, 2900, 2800, 3100, 3000, 2950, 3200, 3150, 3300, 3250, 3400, 3350, 3500] },
          ]}
        />
      </CardContent>
    </Card>
  );
}
