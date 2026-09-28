import { Field, FieldError, Input, Label } from "ayywi/react";

export default function Example() {
  return (
    <Field style={{ width: "100%", maxWidth: 320 }}>
      <Label htmlFor="api-key">API key</Label>
      <Input id="api-key" defaultValue="sk-123" aria-invalid="true" aria-describedby="api-key-error" />
      <FieldError id="api-key-error">Key looks too short.</FieldError>
    </Field>
  );
}
