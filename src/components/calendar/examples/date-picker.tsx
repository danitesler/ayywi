import { useState } from "react";
import { DatePicker, Field, FieldHint, Label } from "@danitesler/ayywi/react";

export default function Example() {
  const [checkIn, setCheckIn] = useState<string | null>(null);
  return (
    <Field style={{ inlineSize: "min(100%, 16rem)" }}>
      <Label htmlFor="check-in">Check-in</Label>
      <DatePicker id="check-in" value={checkIn} onValueChange={setCheckIn} min="2026-10-07" placeholder="Pick a day" aria-describedby="check-in-hint" />
      <FieldHint id="check-in-hint">Arrivals from 3 pm.</FieldHint>
    </Field>
  );
}
