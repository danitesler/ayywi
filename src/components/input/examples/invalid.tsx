import { Field, FieldError, Input, Label } from "@danitesler/ayywi/react";

export default function Example() {
  return (
    <Field style={{ inlineSize: "min(100%, 20rem)" }}>
      <Label htmlFor="api-key">API key</Label>
      <Input id="api-key" defaultValue="sk-123" aria-invalid="true" aria-describedby="api-key-error" />
      <FieldError id="api-key-error">Key looks too short.</FieldError>
    </Field>
  );
}
