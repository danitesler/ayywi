import { Card, CardContent, CardDescription, CardHeader, CardTitle, LineChart } from "@danitesler/ayywi/react";

export default function Example() {
  return (
    <Card style={{ inlineSize: "100%", maxInlineSize: "36rem" }}>
      <CardHeader>
        <CardTitle>Paid seats</CardTitle>
        <CardDescription>Seats change on the billing date, so the line steps</CardDescription>
      </CardHeader>
      <CardContent>
        <LineChart
          step
          label="Paid seats per month, November to October"
          labels={["Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"]}
          series={[{ name: "Paid seats", values: [10, 10, 15, 15, 15, 25, 25, 25, 25, 40, 40, 50] }]}
        />
      </CardContent>
    </Card>
  );
}
