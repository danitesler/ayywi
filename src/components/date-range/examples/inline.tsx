import { useState } from "react";
import { Card, CardContent, DateRange } from "@danitesler/ayywi/react";

export default function Example() {
  const [range, setRange] = useState<[string, string] | null>(["2026-10-14", "2026-11-04"]);
  return (
    <Card>
      <CardContent>
        <DateRange
          value={range}
          onValueChange={setRange}
          today="2026-10-14"
          min="2026-10-05"
          max="2026-11-25"
        />
      </CardContent>
    </Card>
  );
}
