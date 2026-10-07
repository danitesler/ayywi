import { BarChart } from "@danitesler/ayywi/react";

export default function Example() {
  return (
    <BarChart
      label="Support tickets per weekday, by channel"
      labels={["Mon", "Tue", "Wed", "Thu", "Fri"]}
      stacked
      ticks={0}
      height="10rem"
      style={{ inlineSize: "100%", maxInlineSize: "28rem" }}
      series={[
        { name: "Email", values: [42, 38, 51, 47, 33] },
        { name: "Chat", values: [28, 34, 30, 41, 26] },
        { name: "Phone", values: [9, 12, 8, 10, 7] },
      ]}
    />
  );
}
