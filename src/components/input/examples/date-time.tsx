import type { CSSProperties } from "react";
import { Field, FieldHint, Input, Label } from "ayywi/react";

export default function Example() {
  return (
    <div className="ayy-grid" style={{ "--ayy-min": "11rem", inlineSize: "min(100%, 28rem)" } as CSSProperties}>
      <Field>
        <Label htmlFor="booking-date">Date</Label>
        <Input id="booking-date" type="date" defaultValue="2026-10-14" min="2026-10-01" max="2026-12-31" aria-describedby="booking-date-hint" />
        <FieldHint id="booking-date-hint">October to December.</FieldHint>
      </Field>
      <Field>
        <Label htmlFor="booking-time">Time</Label>
        <Input id="booking-time" type="time" defaultValue="18:30" min="07:00" max="21:00" step={900} />
      </Field>
    </div>
  );
}
