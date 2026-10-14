import { useState } from "react";
import {
  Camera01Icon,
  Clock01Icon,
  CropIcon,
  Download01Icon,
  Layers01Icon,
} from "@hugeicons/core-free-icons";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  Icon,
  toast,
} from "@danitesler/ayywi/react";

export default function Example() {
  const [timer, setTimer] = useState("off");
  const [format, setFormat] = useState("png");
  const [showCursor, setShowCursor] = useState(true);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger variant="outline">Capture options</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Takerr</DropdownMenuLabel>
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
            <DropdownMenuRadioGroup value={timer} onValueChange={(val) => { setTimer(val); toast(`Timer: ${val}s`); }}>
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
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
