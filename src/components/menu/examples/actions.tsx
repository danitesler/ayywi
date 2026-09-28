import { Copy01Icon, Delete02Icon, PencilEdit02Icon, UserSwitchIcon } from "@hugeicons/core-free-icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Icon,
  toast,
} from "ayywi/react";

export default function Example() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger variant="outline">Project actions</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Marketing site</DropdownMenuLabel>
        <DropdownMenuItem onSelect={() => toast("Rename")} shortcut="⌘R">
          <Icon icon={PencilEdit02Icon} />
          Rename
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => toast("Duplicated")} shortcut="⌘D">
          <Icon icon={Copy01Icon} />
          Duplicate
        </DropdownMenuItem>
        <DropdownMenuItem disabled>
          <Icon icon={UserSwitchIcon} />
          Transfer ownership
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem destructive onSelect={() => toast.error("Project deleted")}>
          <Icon icon={Delete02Icon} />
          Delete project
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
