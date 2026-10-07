import { Field, FieldHint, Label, TagInput } from "@danitesler/ayywi/react";

export default function Example() {
  return (
    <Field style={{ inlineSize: "min(100%, 28rem)" }}>
      <Label htmlFor="share-with">Share with</Label>
      <TagInput
        id="share-with"
        size="lg"
        max={5}
        defaultValue={["ada@example.com", "grace@example.com"]}
        placeholder="Email addresses"
        inputMode="email"
        aria-describedby="share-with-hint"
      />
      <FieldHint id="share-with-hint">Up to 5 people. Paste a list separated by commas.</FieldHint>
    </Field>
  );
}
