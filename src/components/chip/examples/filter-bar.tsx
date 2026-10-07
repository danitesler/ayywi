import { Search01Icon } from "@hugeicons/core-free-icons";
import { useState } from "react";
import { Button, ChipButton, ChipGroup, ChipRemovable, Icon, Input, InputGroup } from "@danitesler/ayywi/react";

const PRIORITIES = ["Urgent", "High", "Normal"];

export default function Example() {
  const [mine, setMine] = useState(true);
  const [priorities, setPriorities] = useState(["Urgent"]);
  const toggle = (priority: string) =>
    setPriorities((list) => (list.includes(priority) ? list.filter((p) => p !== priority) : [...list, priority]));
  const active = priorities.length + (mine ? 1 : 0);
  return (
    <div className="ayy-stack" style={{ inlineSize: "100%" }}>
      <div className="ayy-spread">
        <InputGroup style={{ inlineSize: "min(100%, 18rem)" }}>
          <Icon icon={Search01Icon} />
          <Input type="search" placeholder="Search tickets" aria-label="Search tickets" />
        </InputGroup>
        <ChipGroup aria-label="Filters" scroll>
          <ChipButton pressed={mine} onPressedChange={setMine}>
            Assigned to me
          </ChipButton>
          {PRIORITIES.map((priority) => (
            <ChipButton key={priority} pressed={priorities.includes(priority)} onPressedChange={() => toggle(priority)}>
              {priority}
            </ChipButton>
          ))}
        </ChipGroup>
      </div>
      {active > 0 && (
        <div className="ayy-cluster">
          <span className="ayy-muted">Filtered by</span>
          {mine && <ChipRemovable onRemove={() => setMine(false)}>Assignee: me</ChipRemovable>}
          {priorities.map((priority) => (
            <ChipRemovable key={priority} onRemove={() => toggle(priority)}>
              {`Priority: ${priority}`}
            </ChipRemovable>
          ))}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setMine(false);
              setPriorities([]);
            }}
          >
            Clear all
          </Button>
        </div>
      )}
    </div>
  );
}
