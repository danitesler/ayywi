import { Field, FieldHint, Label, TagInput } from "@danitesler/ayywi/react";

export default function Example() {
  return (
    <Field style={{ inlineSize: "min(100%, 24rem)" }}>
      <Label htmlFor="task-tags">Tags</Label>
      <TagInput
        id="task-tags"
        name="tags"
        defaultValue={["design", "q4"]}
        suggestions={["design", "research", "writing", "q4", "urgent", "waiting"]}
        placeholder="Add a tag"
        aria-describedby="task-tags-hint"
      />
      <FieldHint id="task-tags-hint">Press Enter or type a comma after each tag.</FieldHint>
    </Field>
  );
}
