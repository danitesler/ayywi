import { BarChart, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@danitesler/ayywi/react";

export default function Example() {
  return (
    <Card style={{ inlineSize: "100%", maxInlineSize: "36rem" }}>
      <CardHeader>
        <CardTitle>Orders</CardTitle>
        <CardDescription>Per month, with the average of the last three</CardDescription>
      </CardHeader>
      <CardContent>
        <BarChart
          label="Orders per month and their three-month average, March to October"
          labels={["Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"]}
          series={[{ name: "Orders", values: [420, 510, 480, 560, 610, 590, 670, 720] }]}
          lines={[{ name: "3-month average", values: [420, 465, 470, 517, 550, 587, 623, 660] }]}
        />
      </CardContent>
    </Card>
  );
}
