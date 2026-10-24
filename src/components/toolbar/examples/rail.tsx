import { ArrowUpRight01Icon, CircleIcon, Cursor01Icon, PencilEdit02Icon, SquareIcon, TextIcon, TriangleIcon } from "@hugeicons/core-free-icons";
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger, Icon, Shortcut, Toolbar, ToolbarButton, ToolbarGroup, Tooltip } from "@danitesler/ayywi/react";

const TOOLS = [
  { id: "select", label: "Select", icon: Cursor01Icon, shortcut: "V" },
  { id: "pen", label: "Pen", icon: PencilEdit02Icon, shortcut: "P" },
  { id: "arrow", label: "Arrow", icon: ArrowUpRight01Icon, shortcut: "A" },
  { id: "rectangle", label: "Rectangle", icon: SquareIcon, shortcut: "R" },
  { id: "ellipse", label: "Ellipse", icon: CircleIcon, shortcut: "O" },
  { id: "text", label: "Text", icon: TextIcon, shortcut: "T" },
];

const SHAPES = [
  { id: "rectangle", label: "Rectangle", icon: SquareIcon },
  { id: "ellipse", label: "Ellipse", icon: CircleIcon },
  { id: "triangle", label: "Triangle", icon: TriangleIcon },
];

export default function Example() {
  const [shape, setShape] = useState("rectangle");
  const [tool, setTool] = useState("pen");
  return (
    <Toolbar aria-label="Drawing tools" vertical floating>
      <ToolbarGroup data-exclusive>
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
      <Popover>
        <PopoverTrigger asChild>
          <ToolbarButton aria-label="Shape options">
            <Icon icon={SquareIcon} />
          </ToolbarButton>
        </PopoverTrigger>
        <PopoverContent side="end" align="start" aria-label="Shape options">
          <Toolbar aria-label="Shapes" size="sm">
            <ToolbarGroup aria-label="Shape" data-exclusive>
              {SHAPES.map((option) => (
                <ToolbarButton key={option.id} aria-label={option.label} pressed={shape === option.id} onClick={() => setShape(option.id)}>
                  <Icon icon={option.icon} />
                </ToolbarButton>
              ))}
            </ToolbarGroup>
          </Toolbar>
        </PopoverContent>
      </Popover>
    </Toolbar>
  );
}
