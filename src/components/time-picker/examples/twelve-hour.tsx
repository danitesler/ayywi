import { useState } from "react";
import { Card, CardContent, TimePicker } from "@danitesler/ayywi/react";

export default function Example() {
  const [time, setTime] = useState("02:30 PM");
  return (
    <Card>
      <CardContent>
        <TimePicker value={time} onValueChange={setTime} format="12h" step={15} />
      </CardContent>
    </Card>
  );
}
