import {
  Comment01Icon,
  Delete02Icon,
  Link01Icon,
  SparklesIcon,
  TextBoldIcon,
  TextItalicIcon,
  TextUnderlineIcon,
} from "@hugeicons/core-free-icons";
import { useState } from "react";
import { Icon, Shortcut, Toolbar, ToolbarButton, ToolbarSeparator, Tooltip } from "@danitesler/ayywi/react";

export default function Example() {
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
          <Icon icon={TextBoldIcon} />
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
          <Icon icon={TextItalicIcon} />
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
          <Icon icon={TextUnderlineIcon} />
        </ToolbarButton>
      </Tooltip>
      <ToolbarSeparator />
      <Tooltip
        content={
          <>
            Link <Shortcut keys="Mod+K" />
          </>
        }
      >
        <ToolbarButton>
          <Icon icon={Link01Icon} />
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
          <Icon icon={Comment01Icon} />
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
          <Icon icon={SparklesIcon} />
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
          <Icon icon={Delete02Icon} />
        </ToolbarButton>
      </Tooltip>
    </Toolbar>
  );
}
