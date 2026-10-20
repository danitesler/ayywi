import { ArrowUpRight01Icon, CircleIcon, Cursor01Icon, PencilEdit02Icon, SquareIcon, TextIcon } from "@hugeicons/core-free-icons";
import { useState } from "react";
import { Icon, Shortcut, Toolbar, ToolbarButton, ToolbarGroup, Tooltip } from "@danitesler/ayywi/react";

const TOOLS = [
  { id: "select", label: "Select", icon: Cursor01Icon, shortcut: "V" },
  { id: "pen", label: "Pen", icon: PencilEdit02Icon, shortcut: "P" },
  { id: "arrow", label: "Arrow", icon: ArrowUpRight01Icon, shortcut: "A" },
  { id: "rectangle", label: "Rectangle", icon: SquareIcon, shortcut: "R" },
  { id: "ellipse", label: "Ellipse", icon: CircleIcon, shortcut: "O" },
  { id: "text", label: "Text", icon: TextIcon, shortcut: "T" },
];

export default function Example() {
  const [tool, setTool] = useState("pen");
  return (
    <Toolbar aria-label="Drawing tools" vertical floating>
      <ToolbarGroup>
        {TOOLS.map((t) => (
          <Tooltip
            key={t.id}
            side="end"
            content={
              <>
                {t.label} <Shortcut keys={t.shortcut} />
              </>
            }
          >
            <ToolbarButton key={t.id} aria-label={t.label} pressed={tool === t.id} onClick={() => setTool(t.id)}>
              <Icon icon={t.icon} />
            </ToolbarButton>
          </Tooltip>
        ))}
      </ToolbarGroup>
    </Toolbar>
  );
}
