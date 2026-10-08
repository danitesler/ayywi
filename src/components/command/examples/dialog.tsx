import { Add01Icon, InboxIcon, Search01Icon, Settings01Icon, Sun03Icon } from "@hugeicons/core-free-icons";
import { useState } from "react";
import { Button, CommandDialog, CommandGroup, CommandItem, Icon, Kbd, Shortcut } from "@danitesler/ayywi/react";

export default function Example() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="outline" aria-haspopup="dialog" onClick={() => setOpen(true)}>
        <Icon icon={Search01Icon} />
        Search
        <Shortcut keys="Mod+K" />
      </Button>
      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        placeholder="Search or jump to…"
        footer={
          <>
            <span>
              <Kbd>↑</Kbd> <Kbd>↓</Kbd> to move
            </span>
            <span>
              <Kbd>↵</Kbd> to run
            </span>
            <span>
              <Kbd>esc</Kbd> to close
            </span>
          </>
        }
      >
        <CommandGroup heading="Go to">
          <CommandItem value="today" icon={<Icon icon={Sun03Icon} />}>
            Today
          </CommandItem>
          <CommandItem value="inbox" icon={<Icon icon={InboxIcon} />} meta="12">
            Inbox
          </CommandItem>
          <CommandItem value="settings" keywords="preferences" icon={<Icon icon={Settings01Icon} />} shortcut="Mod+,">
            Settings
          </CommandItem>
        </CommandGroup>
        <CommandGroup heading="Create">
          <CommandItem value="new-task" keywords="add todo" icon={<Icon icon={Add01Icon} />} shortcut="Mod+N">
            New task
          </CommandItem>
        </CommandGroup>
      </CommandDialog>
    </>
  );
}
