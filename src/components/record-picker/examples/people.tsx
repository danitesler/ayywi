import { UserIcon } from "@hugeicons/core-free-icons";
import { Field, FieldHint, Icon, Label, RecordPicker, type RecordPickerOption } from "@danitesler/ayywi/react";

const people: RecordPickerOption[] = [
  { id: "ada", label: "Ada Lovelace", description: "ada@example.com", keywords: "engineering", icon: <Icon icon={UserIcon} /> },
  { id: "grace", label: "Grace Hopper", description: "grace@example.com", keywords: "engineering", icon: <Icon icon={UserIcon} /> },
  { id: "alexandria", label: "Alexandria Ocasio-Cortez", description: "alexandria@example.com", keywords: "design", icon: <Icon icon={UserIcon} /> },
  { id: "alan", label: "Alan Turing", description: "alan@example.com", keywords: "research", icon: <Icon icon={UserIcon} /> },
];

export default function Example() {
  return (
    <Field style={{ inlineSize: "min(100%, 24rem)" }}>
      <Label id="assignee-label" htmlFor="assignee">
        Assignee
      </Label>
      <RecordPicker
        id="assignee"
        aria-labelledby="assignee-label"
        aria-describedby="assignee-hint"
        options={people}
        placeholder="Add a person"
        emptyText="No people"
      />
      <FieldHint id="assignee-hint">Type to find someone, then press Enter.</FieldHint>
    </Field>
  );
}
