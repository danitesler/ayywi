import type { CSSProperties } from "react";
import { Copy01Icon, Edit02Icon, MoreHorizontalIcon, PinIcon } from "@hugeicons/core-free-icons";
import {
  Card,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  HoverAction,
  HoverActions,
  Icon,
  Shortcut,
  CardViewImage,
  CardViewMedia,
} from "@danitesler/ayywi/react";

const CAPTURE =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='1440' height='900' viewBox='0 0 1440 900'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='%230ea5e9'/><stop offset='1' stop-color='%2310b981'/></linearGradient></defs><rect width='1440' height='900' fill='url(%23g)'/><rect x='100' y='100' width='1240' height='700' rx='24' fill='%23fff' fill-opacity='.16'/><rect x='160' y='180' width='520' height='48' rx='12' fill='%23fff' fill-opacity='.85'/><rect x='160' y='270' width='1120' height='28' rx='8' fill='%23fff' fill-opacity='.4'/></svg>";

export default function Example() {
  return (
    <Card view style={{ inlineSize: "min(100%, 20rem)" } as CSSProperties}>
      <CardViewMedia>
        <CardViewImage src={CAPTURE} alt="Dashboard capture" width={1440} height={900} />
      </CardViewMedia>
      <HoverActions position="top-end" group>
        <HoverAction label="Copy" hint={<Shortcut keys="Mod+C" />}>
          <Icon icon={Copy01Icon} />
        </HoverAction>
        <HoverAction label="Annotate">
          <Icon icon={Edit02Icon} />
        </HoverAction>
        <HoverAction label="Pin to screen">
          <Icon icon={PinIcon} />
        </HoverAction>
        <DropdownMenu>
          <DropdownMenuTrigger variant="ghost" size="icon-sm" aria-label="More actions">
            <Icon icon={MoreHorizontalIcon} />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Save</DropdownMenuItem>
            <DropdownMenuItem>Copy text</DropdownMenuItem>
            <DropdownMenuItem>Show in folder</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem destructive>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </HoverActions>
    </Card>
  );
}
