import { ArrowRight02Icon, Calendar03Icon, Sun03Icon } from "@hugeicons/core-free-icons";
import { useState } from "react";
import { Button, DatePickerGrid, Icon } from "@danitesler/ayywi/react";

export default function Example() {
  const [due, setDue] = useState<string | null>("2026-10-09");
  return (
    <DatePickerGrid
      value={due}
      onValueChange={setDue}
      presets={[
        { label: "Today", date: "+0", icon: <Icon icon={Sun03Icon} /> },
        { label: "Tomorrow", date: "+1", icon: <Icon icon={ArrowRight02Icon} directional /> },
        { label: "Next week", date: "+7", icon: <Icon icon={Calendar03Icon} /> },
      ]}
      footer={
        <>
          <Button size="sm" variant="ghost" onClick={() => setDue(null)}>
            Clear
          </Button>
          <Button size="sm" variant="secondary" onClick={() => setDue("2026-10-15")}>
            Today
          </Button>
        </>
      }
    />
  );
}
