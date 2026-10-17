import { useState } from "react";
import { DateTimePickerTrigger, Field, FieldHint, Label } from "@danitesler/ayywi/react";

export default function Example() {
  const [departure, setDeparture] = useState<string>("2026-10-14T14:30");
  return (
    <Field style={{ inlineSize: "min(100%, 20rem)" }}>
      <Label htmlFor="departure-time">Flight departure</Label>
      <DateTimePickerTrigger
        id="departure-time"
        value={departure}
        onValueChange={setDeparture}
        placeholder="Pick date & time"
        format="24h"
        step={15}
        aria-describedby="departure-hint"
      />
      <FieldHint id="departure-hint">Check in at least 2 hours before.</FieldHint>
    </Field>
  );
}
