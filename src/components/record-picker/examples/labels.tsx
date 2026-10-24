import { Tag01Icon } from "@hugeicons/core-free-icons";
import { useState } from "react";
import { Field, FieldHint, Icon, Label, RecordPicker, type RecordPickerOption } from "@danitesler/ayywi/react";

const initial: RecordPickerOption[] = [
  { id: "design", label: "Design", icon: <Icon icon={Tag01Icon} /> },
  { id: "engineering", label: "Engineering", icon: <Icon icon={Tag01Icon} /> },
  { id: "marketing", label: "Marketing", icon: <Icon icon={Tag01Icon} /> },
  { id: "operations", label: "Operations", icon: <Icon icon={Tag01Icon} /> },
  { id: "research", label: "Research", icon: <Icon icon={Tag01Icon} /> },
];

export default function Example() {
  const [options, setOptions] = useState(initial);
  const [labels, setLabels] = useState<string[]>([]);
  return (
    <Field style={{ inlineSize: "min(100%, 24rem)" }}>
      <Label id="labels-label" htmlFor="labels-input">
        Labels
      </Label>
      <RecordPicker
        id="labels-input"
        name="labels"
        multiple
        creatable
        aria-labelledby="labels-label"
        aria-describedby="labels-hint"
        options={options}
        value={labels}
        onValueChange={setLabels}
        onCreate={(label) => {
          const option = { id: label.toLocaleLowerCase().replace(/[^a-z0-9]+/g, "-"), label };
          setOptions((current) => [...current, option]);
          return option;
        }}
        placeholder="Add a label"
        emptyText="No labels"
      />
      <FieldHint id="labels-hint">Type a new label and pick “Create” to add it.</FieldHint>
    </Field>
  );
}
