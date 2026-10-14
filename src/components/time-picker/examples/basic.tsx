import { useState } from "react";
import { Field, FieldHint, Label, TimePickerTrigger } from "@danitesler/ayywi/react";

export default function Example() {
  const [time, setTime] = useState<string>("09:30");
  return (
    <Field style={{ inlineSize: "min(100%, 16rem)" }}>
      <Label htmlFor="meeting-time">Meeting time</Label>
      <TimePickerTrigger
        id="meeting-time"
        value={time}
        onValueChange={setTime}
        placeholder="Pick a time"
        format="24h"
        step={15}
        aria-describedby="meeting-time-hint"
      />
      <FieldHint id="meeting-time-hint">Select a start time for the standup.</FieldHint>
    </Field>
  );
}
