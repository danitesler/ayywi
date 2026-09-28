import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  toast,
} from "ayywi/react";

export default function Example() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger variant="outline">Project actions</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Marketing site</DropdownMenuLabel>
        <DropdownMenuItem onSelect={() => toast("Rename")} shortcut="⌘R">
          Rename
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => toast("Duplicated")} shortcut="⌘D">
          Duplicate
        </DropdownMenuItem>
        <DropdownMenuItem disabled>Transfer ownership</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem destructive onSelect={() => toast.error("Project deleted")}>
          Delete project
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
