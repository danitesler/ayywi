import {
  ArrowDown01Icon,
  Comment01Icon,
  Delete02Icon,
  Link01Icon,
  SparklesIcon,
  TextBoldIcon,
  TextItalicIcon,
  TextUnderlineIcon,
} from "@hugeicons/core-free-icons";
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger, ToolbarGroup, Icon, Shortcut, Toolbar, ToolbarButton, ToolbarSeparator, Tooltip } from "@danitesler/ayywi/react";

export default function Example() {
  const [textStyle, setTextStyle] = useState("Normal");
  const [textSize, setTextSize] = useState(14);
  const [bold, setBold] = useState(true);
  const [italic, setItalic] = useState(false);
  const [underline, setUnderline] = useState(false);
  return (
    <Toolbar aria-label="Text formatting" floating size="sm">
      <Tooltip
        content={
          <>
            Bold <Shortcut keys="Mod+B" />
          </>
        }
      >
        <ToolbarButton aria-label="Bold" pressed={bold} onClick={() => setBold(!bold)}>
          <Icon icon={TextBoldIcon} name="bold" />
        </ToolbarButton>
      </Tooltip>
      <Tooltip
        content={
          <>
            Italic <Shortcut keys="Mod+I" />
          </>
        }
      >
        <ToolbarButton aria-label="Italic" pressed={italic} onClick={() => setItalic(!italic)}>
          <Icon icon={TextItalicIcon} name="italic" />
        </ToolbarButton>
      </Tooltip>
      <Tooltip
        content={
          <>
            Underline <Shortcut keys="Mod+U" />
          </>
        }
      >
        <ToolbarButton aria-label="Underline" pressed={underline} onClick={() => setUnderline(!underline)}>
          <Icon icon={TextUnderlineIcon} name="underline" />
        </ToolbarButton>
      </Tooltip>
      <Popover>
        <PopoverTrigger asChild>
          <ToolbarButton>Text options <Icon icon={ArrowDown01Icon} name="chevron-down" /></ToolbarButton>
        </PopoverTrigger>
        <PopoverContent align="start" aria-label="Text options">
          <div className="ayy-stack" style={{ gap: "var(--ayy-space-2)" }}>
            <p className="ayy-muted">Text style</p>
            <Toolbar aria-label="Text style" size="sm">
              <ToolbarGroup aria-label="Text style" data-exclusive>
                {["Normal", "Code", "Quote"].map((style) => (
                  <ToolbarButton key={style} pressed={textStyle === style} onClick={() => setTextStyle(style)}>{style}</ToolbarButton>
                ))}
              </ToolbarGroup>
            </Toolbar>
            <p className="ayy-muted">Text size</p>
            <Toolbar aria-label="Text size" size="sm">
              <ToolbarGroup aria-label="Width" data-exclusive>
                {[12, 14, 18].map((value) => (
                  <ToolbarButton key={value} pressed={textSize === value} onClick={() => setTextSize(value)}>{value} px</ToolbarButton>
                ))}
              </ToolbarGroup>
            </Toolbar>
          </div>
        </PopoverContent>
      </Popover>
      <ToolbarSeparator />
      <Tooltip
        content={
          <>
            Link <Shortcut keys="Mod+K" />
          </>
        }
      >
        <ToolbarButton>
          <Icon icon={Link01Icon} name="link" />
          Link
        </ToolbarButton>
      </Tooltip>
      <Tooltip
        content={
          <>
            Comment <Shortcut keys="Mod+Alt+M" />
          </>
        }
      >
        <ToolbarButton>
          <Icon icon={Comment01Icon} name="message-square-text" />
          Comment
        </ToolbarButton>
      </Tooltip>
      <Tooltip
        content={
          <>
            Ask AI <Shortcut keys="Mod+J" />
          </>
        }
      >
        <ToolbarButton>
          <Icon icon={SparklesIcon} name="sparkles" />
          AI
        </ToolbarButton>
      </Tooltip>
      <ToolbarSeparator />
      <Tooltip
        content={
          <>
            Delete <Shortcut keys="Delete" />
          </>
        }
      >
        <ToolbarButton aria-label="Delete">
          <Icon icon={Delete02Icon} name="trash" />
        </ToolbarButton>
      </Tooltip>
    </Toolbar>
  );
}
