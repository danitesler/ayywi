import { Card, CardContent, CardDescription, CardHeader, CardTitle, HistogramChart } from "@danitesler/ayywi/react";

// Response times of the last 80 requests, in milliseconds.
const times = [
  139, 78, 179, 195, 69, 167, 230, 146, 110, 226, 112, 291, 80, 250, 304, 72, 154, 174, 139, 103, 221, 134, 215, 68, 152, 247, 148,
  122, 165, 214, 203, 218, 122, 129, 206, 190, 189, 118, 280, 190, 162, 279, 55, 214, 182, 264, 195, 96, 79, 88, 325, 129, 185, 127,
  134, 190, 118, 260, 206, 294, 203, 88, 213, 154, 200, 213, 368, 95, 306, 271, 200, 147, 114, 162, 138, 87, 224, 111, 325, 126,
];

export default function Example() {
  return (
    <Card style={{ inlineSize: "100%", maxInlineSize: "36rem" }}>
      <CardHeader>
        <CardTitle>Response times</CardTitle>
        <CardDescription>Last 80 requests · median 171ms, p95 304ms</CardDescription>
      </CardHeader>
      <CardContent>
        <HistogramChart
          label="Requests by response time in milliseconds"
          name="Requests"
          values={times}
          bins={8}
          formatBin={(value) => `${value}ms`}
        />
      </CardContent>
    </Card>
  );
}
