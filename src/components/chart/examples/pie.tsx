import { Card, CardContent, CardDescription, CardHeader, CardTitle, DonutChart } from "@danitesler/ayywi/react";

export default function Example() {
  return (
    <Card style={{ inlineSize: "100%", maxInlineSize: "30rem" }}>
      <CardHeader>
        <CardTitle>Storage</CardTitle>
        <CardDescription>100 GB used of 200 GB</CardDescription>
      </CardHeader>
      <CardContent>
        <DonutChart
          toggle
          pie
          label="Storage used by file type"
          name="Storage"
          size="9rem"
          format={(value) => `${value} GB`}
          items={[
            { name: "Photos", value: 48 },
            { name: "Videos", value: 31 },
            { name: "Documents", value: 12 },
            { name: "Other", value: 9 },
          ]}
        />
      </CardContent>
    </Card>
  );
}
