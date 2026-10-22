import { Card, CardContent, CardDescription, CardHeader, CardTitle, LineChart } from "@danitesler/ayywi/react";

const weeks = ["Jul 7", "Jul 14", "Jul 21", "Jul 28", "Aug 4", "Aug 11", "Aug 18", "Aug 25", "Sep 1", "Sep 8", "Sep 15", "Sep 22"];

export default function Example() {
  return (
    <Card style={{ inlineSize: "100%", maxInlineSize: "40rem" }}>
      <CardHeader>
        <CardTitle>Sessions by source</CardTitle>
        <CardDescription>Weekly · the top line is the total</CardDescription>
      </CardHeader>
      <CardContent>
        <LineChart
          stacked
          label="Weekly sessions by source, July to September"
          labels={weeks}
          series={[
            { name: "Organic", values: [5200, 5400, 5300, 5700, 5900, 6100, 6000, 6400, 6700, 6600, 6900, 7200] },
            { name: "Direct", values: [2100, 2200, 2150, 2300, 2250, 2400, 2500, 2450, 2600, 2700, 2650, 2800] },
            { name: "Referral", values: [900, 1100, 1000, 1400, 1300, 1200, 1500, 1700, 1600, 1500, 1800, 1900] },
          ]}
        />
      </CardContent>
    </Card>
  );
}
