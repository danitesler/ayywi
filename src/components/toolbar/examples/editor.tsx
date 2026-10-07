import {
  ArrowUpRight01Icon,
  BlurIcon,
  Copy01Icon,
  Cursor01Icon,
  HighlighterIcon,
  Redo02Icon,
  SquareIcon,
  TextIcon,
  Undo02Icon,
} from "@hugeicons/core-free-icons";
import { useState } from "react";
import { Icon, Toolbar, ToolbarButton, ToolbarGroup, ToolbarSeparator, ToolbarSpacer } from "@danitesler/ayywi/react";

const TOOLS = [
  { id: "select", label: "Select", icon: Cursor01Icon },
  { id: "arrow", label: "Arrow", icon: ArrowUpRight01Icon },
  { id: "rectangle", label: "Rectangle", icon: SquareIcon },
  { id: "text", label: "Text", icon: TextIcon },
  { id: "highlight", label: "Highlight", icon: HighlighterIcon },
  { id: "blur", label: "Blur", icon: BlurIcon },
];

export default function Example() {
  const [tool, setTool] = useState("arrow");
  return (
    <Toolbar aria-label="Annotate" style={{ inlineSize: "100%" }}>
      <ToolbarGroup aria-label="Tools" data-exclusive="">
        {TOOLS.map((t) => (
          <ToolbarButton key={t.id} aria-label={t.label} pressed={tool === t.id} onClick={() => setTool(t.id)}>
            <Icon icon={t.icon} />
          </ToolbarButton>
        ))}
      </ToolbarGroup>
      <ToolbarSeparator />
      <ToolbarButton aria-label="Undo">
        <Icon icon={Undo02Icon} />
      </ToolbarButton>
      <ToolbarButton aria-label="Redo" disabled>
        <Icon icon={Redo02Icon} />
      </ToolbarButton>
      <ToolbarSpacer />
      <ToolbarButton>
        <Icon icon={Copy01Icon} />
        Copy
      </ToolbarButton>
    </Toolbar>
  );
}
