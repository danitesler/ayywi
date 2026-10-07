import { ShortcutList, ShortcutListItem } from "@danitesler/ayywi/react";

export default function Example() {
  return (
    <div style={{ inlineSize: "100%", maxInlineSize: "22rem" }}>
      <ShortcutList aria-label="Keyboard shortcuts">
        <ShortcutListItem label="Search" keys="Mod+K" />
        <ShortcutListItem label="New task" keys="Mod+N" />
        <ShortcutListItem label="Complete task" keys="Mod+Enter" />
        <ShortcutListItem label="Move to list" keys="Mod+Shift+M" />
        <ShortcutListItem label="Undo" keys="Mod+Z" />
        <ShortcutListItem label="Add a tag while typing">
          <kbd className="ayy-kbd">#tag</kbd>
        </ShortcutListItem>
      </ShortcutList>
    </div>
  );
}
