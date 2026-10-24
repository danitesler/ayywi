import {
  ArrowDown01Icon,
  CircleIcon,
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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger, toast, Icon, Shortcut, Toolbar, ToolbarButton, ToolbarGroup, ToolbarSeparator, ToolbarSpacer, Tooltip } from "@danitesler/ayywi/react";

const TOOLS = [
  { id: "select", label: "Select", icon: Cursor01Icon, shortcut: "V" },
  { id: "arrow", label: "Arrow", icon: ArrowUpRight01Icon, shortcut: "A" },
  { id: "rectangle", label: "Rectangle", icon: SquareIcon, shortcut: "R" },
  { id: "text", label: "Text", icon: TextIcon, shortcut: "T" },
  { id: "highlight", label: "Highlight", icon: HighlighterIcon, shortcut: "H" },
  { id: "blur", label: "Blur", icon: BlurIcon, shortcut: "B" },
];

export default function Example() {
  const [tool, setTool] = useState("arrow");
  return (
    <Toolbar aria-label="Annotate" style={{ inlineSize: "100%" }}>
      <ToolbarGroup aria-label="Tools" data-exclusive>
        {TOOLS.map((t) => (
          <Tooltip
            key={t.id}
            content={
              <>
                {t.label} <Shortcut keys={t.shortcut} />
              </>
            }
          >
            <ToolbarButton aria-label={t.label} pressed={tool === t.id} onClick={() => setTool(t.id)}>
              <Icon icon={t.icon} />
            </ToolbarButton>
          </Tooltip>
        ))}
      </ToolbarGroup>
      <ToolbarSeparator />
      <Tooltip
        content={
          <>
            Undo <Shortcut keys="Mod+Z" />
          </>
        }
      >
        <ToolbarButton aria-label="Undo">
          <Icon icon={Undo02Icon} />
        </ToolbarButton>
      </Tooltip>
      <Tooltip
        content={
          <>
            Redo <Shortcut keys="Mod+Shift+Z" />
          </>
        }
      >
        <ToolbarButton aria-label="Redo" disabled>
          <Icon icon={Redo02Icon} />
        </ToolbarButton>
      </Tooltip>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <ToolbarButton>Insert <Icon icon={ArrowDown01Icon} /></ToolbarButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent aria-label="Insert">
          <DropdownMenuSub>
            <DropdownMenuSubTrigger icon={<Icon icon={SquareIcon} />}>Shapes</DropdownMenuSubTrigger>
            <DropdownMenuSubContent aria-label="Shapes">
              <DropdownMenuItem icon={<Icon icon={SquareIcon} />} onSelect={() => toast("Rectangle inserted")}>Rectangle</DropdownMenuItem>
              <DropdownMenuItem icon={<Icon icon={CircleIcon} />} onSelect={() => toast("Ellipse inserted")}>Ellipse</DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuItem icon={<Icon icon={TextIcon} />} onSelect={() => toast("Text inserted")}>Text</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuSub>
            <DropdownMenuSubTrigger icon={<Icon icon={Copy01Icon} />}>Templates</DropdownMenuSubTrigger>
            <DropdownMenuSubContent aria-label="Templates">
              <DropdownMenuItem onSelect={() => toast("Note inserted")}>Note</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => toast("Checklist inserted")}>Checklist</DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuContent>
      </DropdownMenu>
      <ToolbarSpacer />
      <Tooltip
        content={
          <>
            Copy <Shortcut keys="Mod+C" />
          </>
        }
      >
        <ToolbarButton>
          <Icon icon={Copy01Icon} />
          Copy
        </ToolbarButton>
      </Tooltip>
    </Toolbar>
  );
}
