import { Delete02Icon, Link01Icon, TextBoldIcon, TextItalicIcon, TextUnderlineIcon } from "@hugeicons/core-free-icons";
import { useState } from "react";
import { Icon, Toolbar, ToolbarButton, ToolbarSeparator } from "@danitesler/ayywi/react";

export default function Example() {
  const [bold, setBold] = useState(true);
  const [italic, setItalic] = useState(false);
  const [underline, setUnderline] = useState(false);
  return (
    <Toolbar aria-label="Text formatting" floating size="sm">
      <ToolbarButton aria-label="Bold" pressed={bold} onClick={() => setBold(!bold)}>
        <Icon icon={TextBoldIcon} />
      </ToolbarButton>
      <ToolbarButton aria-label="Italic" pressed={italic} onClick={() => setItalic(!italic)}>
        <Icon icon={TextItalicIcon} />
      </ToolbarButton>
      <ToolbarButton aria-label="Underline" pressed={underline} onClick={() => setUnderline(!underline)}>
        <Icon icon={TextUnderlineIcon} />
      </ToolbarButton>
      <ToolbarSeparator />
      <ToolbarButton>
        <Icon icon={Link01Icon} />
        Link
      </ToolbarButton>
      <ToolbarButton aria-label="Delete">
        <Icon icon={Delete02Icon} />
      </ToolbarButton>
    </Toolbar>
  );
}
