import { Chip, ChipGroup, ChipRemovable } from "@danitesler/ayywi/react";

export default function Example() {
  return (
    <div className="ayy-stack">
      <ChipGroup aria-label="Small status filters">
        <Chip size="sm" name="status-sm" value="open" defaultChecked count={12}>
          Open
        </Chip>
        <Chip size="sm" name="status-sm" value="closed" count={31}>
          Closed
        </Chip>
        <ChipRemovable size="sm" onRemove={() => {}}>
          Assignee: Mira
        </ChipRemovable>
      </ChipGroup>
      <ChipGroup aria-label="Medium status filters">
        <Chip name="status-md" value="open" defaultChecked count={12}>
          Open
        </Chip>
        <Chip name="status-md" value="closed" count={31}>
          Closed
        </Chip>
        <ChipRemovable onRemove={() => {}}>Assignee: Mira</ChipRemovable>
      </ChipGroup>
      <ChipGroup aria-label="Large status filters">
        <Chip size="lg" name="status-lg" value="open" defaultChecked count={12}>
          Open
        </Chip>
        <Chip size="lg" name="status-lg" value="closed" count={31}>
          Closed
        </Chip>
        <ChipRemovable size="lg" onRemove={() => {}}>
          Assignee: Mira
        </ChipRemovable>
      </ChipGroup>
    </div>
  );
}
