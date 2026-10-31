import { Copy01Icon, Delete02Icon, PencilEdit02Icon, Share08Icon } from "@hugeicons/core-free-icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  Icon,
} from "@danitesler/ayywi/react";

const items = (
  <>
    <DropdownMenuLabel>Project</DropdownMenuLabel>
    <DropdownMenuItem icon={<Icon icon={PencilEdit02Icon} name="square-pen" />} shortcut="Mod+E">
      Rename
    </DropdownMenuItem>
    <DropdownMenuItem icon={<Icon icon={Copy01Icon} name="copy" />} description="Keeps the pages, not the people">
      Duplicate
    </DropdownMenuItem>
    <DropdownMenuItem icon={<Icon icon={Share08Icon} name="share-2" />} value="Team">
      Share
    </DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem destructive icon={<Icon icon={Delete02Icon} name="trash" />}>
      Delete
    </DropdownMenuItem>
  </>
);

export default function Example() {
  // static keeps each menu in the page, so the three sizes can be compared side by side.
  return (
    <div className="ayy-cluster" style={{ alignItems: "flex-start" }}>
      <DropdownMenu size="sm">
        <DropdownMenuContent static aria-label="Project actions, small">
          {items}
        </DropdownMenuContent>
      </DropdownMenu>
      <DropdownMenu>
        <DropdownMenuContent static aria-label="Project actions, medium">
          {items}
        </DropdownMenuContent>
      </DropdownMenu>
      <DropdownMenu size="lg">
        <DropdownMenuContent static aria-label="Project actions, large">
          {items}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
