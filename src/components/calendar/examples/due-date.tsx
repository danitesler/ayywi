import { ArrowRight02Icon, Calendar03Icon, Sun03Icon } from "@hugeicons/core-free-icons";
import { useState } from "react";
import { Calendar, Icon, Input, Label } from "@danitesler/ayywi/react";

export default function Example() {
  const [due, setDue] = useState<string | null>("2026-10-09");
  return (
    <Calendar
      value={due}
      onValueChange={setDue}
      presets={[
        { label: "Today", date: "+0", icon: <Icon icon={Sun03Icon} /> },
        { label: "Tomorrow", date: "+1", icon: <Icon icon={ArrowRight02Icon} directional /> },
        { label: "Next week", date: "+7", icon: <Icon icon={Calendar03Icon} /> },
      ]}
      footer={
        <>
          <Label htmlFor="due-time">Time</Label>
          <Input id="due-time" type="time" size="sm" defaultValue="09:30" style={{ inlineSize: "8rem" }} />
        </>
      }
    />
  );
}
