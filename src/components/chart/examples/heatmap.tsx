import { Card, CardContent, CardDescription, CardHeader, CardTitle, HeatmapChart } from "@danitesler/ayywi/react";

export default function Example() {
  return (
    <Card style={{ inlineSize: "100%", maxInlineSize: "36rem" }}>
      <CardHeader>
        <CardTitle>When tickets arrive</CardTitle>
        <CardDescription>Last four weeks, by day and two-hour slot · busiest Monday 12–2pm</CardDescription>
      </CardHeader>
      <CardContent>
        <HeatmapChart
          label="Support tickets by day and time, last four weeks"
          rows={["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]}
          columns={["12am", "2am", "4am", "6am", "8am", "10am", "12pm", "2pm", "4pm", "6pm", "8pm", "10pm"]}
          values={[
            [3, 1, 4, 5, 23, 42, 46, 41, 37, 21, 10, 2],
            [2, 4, 1, 3, 20, 39, 42, 35, 31, 18, 7, 7],
            [1, 2, 3, 6, 21, 39, 39, 37, 30, 20, 8, 2],
            [2, 1, 2, 5, 24, 40, 39, 33, 29, 20, 7, 4],
            [3, 4, 3, 3, 17, 33, 34, 32, 27, 14, 10, 1],
            [0, 0, 0, 1, 11, 14, 11, 15, 10, 7, 5, 0],
            [0, 2, 0, 4, 7, 14, 12, 15, 12, 6, 5, 0],
          ]}
        />
      </CardContent>
    </Card>
  );
}
