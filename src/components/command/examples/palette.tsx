import { Add01Icon, InboxIcon, Moon02Icon, Note01Icon, Settings01Icon, Sun03Icon, Tag01Icon } from "@hugeicons/core-free-icons";
import { Command, CommandGroup, CommandItem, Icon, Kbd } from "@danitesler/ayywi/react";

export default function Example() {
  return (
    <Command
      style={{ maxInlineSize: "32rem" }}
      label="Search commands"
      footer={
        <>
          <span>
            <Kbd>↑</Kbd> <Kbd>↓</Kbd> to move
          </span>
          <span>
            <Kbd>↵</Kbd> to run
          </span>
        </>
      }
    >
      <CommandGroup heading="Create">
        <CommandItem value="new-task" keywords="add todo" icon={<Icon icon={Add01Icon} />} shortcut="Mod+N">
          New task
        </CommandItem>
        <CommandItem value="new-note" keywords="add page" icon={<Icon icon={Note01Icon} />} shortcut="Mod+Shift+N">
          New note
        </CommandItem>
        <CommandItem value="new-tag" icon={<Icon icon={Tag01Icon} />}>
          New tag
        </CommandItem>
      </CommandGroup>
      <CommandGroup heading="Go to">
        <CommandItem value="today" icon={<Icon icon={Sun03Icon} />} meta="4">
          Today
        </CommandItem>
        <CommandItem value="inbox" icon={<Icon icon={InboxIcon} />} meta="12">
          Inbox
        </CommandItem>
        <CommandItem value="settings" keywords="preferences options" icon={<Icon icon={Settings01Icon} />} shortcut="Mod+,">
          Settings
        </CommandItem>
      </CommandGroup>
      <CommandGroup heading="Appearance">
        <CommandItem value="theme" keywords="dark light mode" icon={<Icon icon={Moon02Icon} />}>
          Switch theme
        </CommandItem>
      </CommandGroup>
    </Command>
  );
}
