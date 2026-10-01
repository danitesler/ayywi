import { Field, FieldHint, Label, NumberField } from "ayywi/react";

export default function Example() {
  return (
    <div className="ayy-stack">
      <Field>
        <Label htmlFor="guests">Guests</Label>
        <NumberField
          id="guests"
          name="guests"
          defaultValue={2}
          min={1}
          max={8}
          decrementLabel="Remove a guest"
          incrementLabel="Add a guest"
          aria-describedby="guests-hint"
        />
        <FieldHint id="guests-hint">Up to 8 per booking.</FieldHint>
      </Field>
      <NumberField size="sm" defaultValue={1} min={0} max={20} aria-label="Quantity of Ethiopia Guji, 250 g" />
    </div>
  );
}
