import { useState } from "react";
import { Field, FieldHint, Label, Slider } from "@danitesler/ayywi/react";

export default function Example() {
  const [spots, setSpots] = useState(12);
  return (
    <Field style={{ inlineSize: "min(100%, 22rem)" }}>
      <div className="ayy-spread">
        <Label htmlFor="class-size">Class size</Label>
        <output htmlFor="class-size" className="ayy-muted">
          {spots} people
        </output>
      </div>
      <Slider id="class-size" min={4} max={30} value={spots} onValueChange={setSpots} aria-describedby="class-size-hint" />
      <FieldHint id="class-size-hint">Bookings close when the class is full.</FieldHint>
    </Field>
  );
}
