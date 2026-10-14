import { useState } from "react";
import { DateRangePicker, Field, FieldHint, Label } from "@danitesler/ayywi/react";

export default function Example() {
  const [range, setRange] = useState<[string, string] | null>(["2026-10-12", "2026-10-18"]);
  return (
    <Field style={{ inlineSize: "min(100%, 20rem)" }}>
      <Label htmlFor="stay-dates">Dates of stay</Label>
      <DateRangePicker
        id="stay-dates"
        value={range}
        onValueChange={setRange}
        min="2026-10-01"
        placeholder="Pick check-in and check-out"
        aria-describedby="stay-dates-hint"
      />
      <FieldHint id="stay-dates-hint">Minimum 2-night stay.</FieldHint>
    </Field>
  );
}
