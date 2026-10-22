import { Card, CardContent, CardDescription, CardHeader, CardTitle, WaterfallChart } from "@danitesler/ayywi/react";

const dollars = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", notation: "compact", maximumFractionDigits: 1 });

export default function Example() {
  return (
    <Card style={{ inlineSize: "100%", maxInlineSize: "36rem" }}>
      <CardHeader>
        <CardTitle>MRR bridge</CardTitle>
        <CardDescription>September · up $4.5K, churn the largest drop</CardDescription>
      </CardHeader>
      <CardContent>
        <WaterfallChart
          label="Monthly recurring revenue, September: from the start of the month to the end"
          name="MRR"
          format={(value) => dollars.format(value)}
          steps={[
            { label: "Sep 1", value: 48200, total: true },
            { label: "New", value: 6400 },
            { label: "Expansion", value: 2100 },
            { label: "Contraction", value: -1300 },
            { label: "Churn", value: -2700 },
            { label: "Sep 30", value: 52700, total: true },
          ]}
        />
      </CardContent>
    </Card>
  );
}
