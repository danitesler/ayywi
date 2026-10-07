import { ArrowUpRight01Icon, CircleIcon, Cursor01Icon, PencilEdit02Icon, SquareIcon, TextIcon } from "@hugeicons/core-free-icons";
import { useState } from "react";
import { Icon, Toolbar, ToolbarButton, ToolbarGroup } from "@danitesler/ayywi/react";

const TOOLS = [
  { id: "select", label: "Select", icon: Cursor01Icon },
  { id: "pen", label: "Pen", icon: PencilEdit02Icon },
  { id: "arrow", label: "Arrow", icon: ArrowUpRight01Icon },
  { id: "rectangle", label: "Rectangle", icon: SquareIcon },
  { id: "ellipse", label: "Ellipse", icon: CircleIcon },
  { id: "text", label: "Text", icon: TextIcon },
];

export default function Example() {
  const [tool, setTool] = useState("pen");
  return (
    <Toolbar aria-label="Drawing tools" vertical floating>
      <ToolbarGroup data-exclusive="">
        {TOOLS.map((t) => (
          <ToolbarButton key={t.id} aria-label={t.label} pressed={tool === t.id} onClick={() => setTool(t.id)}>
            <Icon icon={t.icon} />
          </ToolbarButton>
        ))}
      </ToolbarGroup>
    </Toolbar>
  );
}
