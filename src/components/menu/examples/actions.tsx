import { useState } from "react";
import {
  Archive02Icon,
  Camera01Icon,
  Clock01Icon,
  Copy01Icon,
  CropIcon,
  Delete02Icon,
  Download01Icon,
  Layers01Icon,
  LayoutTemplateIcon,
  Link01Icon,
  Mail01Icon,
  MoreHorizontalIcon,
  PencilEdit02Icon,
  Share08Icon,
  UserSwitchIcon,
} from "@hugeicons/core-free-icons";
import {
  Badge,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuMore,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuRow,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  Icon,
  toast,
} from "@danitesler/ayywi/react";

export default function Example() {
  const [timer, setTimer] = useState("5");
  const [format, setFormat] = useState("png");
  const [showCursor, setShowCursor] = useState(true);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger variant="outline">Project actions</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onSelect={() => toast("Rename")} shortcut="Mod+R">
          <Icon icon={PencilEdit02Icon} />
          Rename
        </DropdownMenuItem>
        <DropdownMenuSub>
          <DropdownMenuRow>
            <DropdownMenuItem icon={<Icon icon={Copy01Icon} />} value="2 copies" shortcut="Mod+D" onSelect={() => toast("Duplicated")}>
              Duplicate
            </DropdownMenuItem>
            <DropdownMenuMore aria-label="More options for Duplicate" icon={<Icon icon={MoreHorizontalIcon} />} />
          </DropdownMenuRow>
          <DropdownMenuSubContent>
            <DropdownMenuItem onSelect={() => toast("Duplicated without comments")}>Without comments</DropdownMenuItem>
            <DropdownMenuItem icon={<Icon icon={LayoutTemplateIcon} />} onSelect={() => toast("Duplicated as template")}>
              As a template
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSub>
          <DropdownMenuRow>
            <DropdownMenuItem icon={<Icon icon={Share08Icon} />} value={<Badge variant="muted">3</Badge>} shortcut="Mod+S" onSelect={() => toast("Share settings")}>
              Share
            </DropdownMenuItem>
            <DropdownMenuMore aria-label="More options for Share" icon={<Icon icon={MoreHorizontalIcon} />} />
          </DropdownMenuRow>
          <DropdownMenuSubContent>
            <DropdownMenuItem icon={<Icon icon={Link01Icon} />} onSelect={() => toast("Link copied")} shortcut="Mod+C">
              Copy link
            </DropdownMenuItem>
            <DropdownMenuItem icon={<Icon icon={Mail01Icon} />} onSelect={() => toast("Invite sent")}>
              Invite by email
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuItem disabled>
          <Icon icon={UserSwitchIcon} />
          Transfer ownership
        </DropdownMenuItem>
        <DropdownMenuItem
          icon={<Icon icon={CropIcon} />}
          description="Drag to select part of the screen"
          onSelect={() => toast("Capture area")}
          shortcut="Mod+4"
        >
          Capture area
        </DropdownMenuItem>

        <DropdownMenuSub>
          <DropdownMenuSubTrigger
            icon={<Icon icon={Clock01Icon} />}
            value={timer === "off" ? "Off" : `${timer}s`}
          >
            Self-timer
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuRadioGroup value={timer} onValueChange={(val) => { setTimer(val); toast(val === "off" ? "Timer: off" : `Timer: ${val}s`); }}>
              <DropdownMenuRadioItem value="off">Off</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="3">In 3 seconds</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="5">In 5 seconds</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="10">In 10 seconds</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSub>
          <DropdownMenuSubTrigger icon={<Icon icon={Download01Icon} />} value={format.toUpperCase()}>
            Export format
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuRadioGroup value={format} onValueChange={(val) => { setFormat(val); toast(`Format: ${val.toUpperCase()}`); }}>
              <DropdownMenuRadioItem value="png">PNG (lossless)</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="jpg">JPG (compressed)</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="pdf">PDF (document)</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSub inline>
          <DropdownMenuSubTrigger icon={<Icon icon={Layers01Icon} />}>
            Advanced options
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuCheckboxItem
              checked={showCursor}
              onCheckedChange={(checked) => {
                setShowCursor(checked);
                toast(checked ? "Cursor included" : "Cursor hidden");
              }}
            >
              Include pointer
            </DropdownMenuCheckboxItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSeparator />
        <DropdownMenuItem
          icon={<Icon icon={Camera01Icon} />}
          onSelect={() => toast("Screen captured")}
          shortcut="Mod+3"
        >
          Full screen
        </DropdownMenuItem>

        <DropdownMenuItem icon={<Icon icon={Archive02Icon} />} onSelect={() => toast("Project archived")}>
          Archive project
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
