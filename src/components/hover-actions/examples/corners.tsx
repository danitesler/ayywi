import type { CSSProperties } from "react";
import { CloudUploadIcon, Delete02Icon, Edit02Icon, Folder01Icon, PinIcon } from "@hugeicons/core-free-icons";
import { Card, HoverAction, HoverActions, Icon, CardViewImage, CardViewMedia } from "@danitesler/ayywi/react";

const CAPTURE =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='1440' height='900' viewBox='0 0 1440 900'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='%236366f1'/><stop offset='1' stop-color='%23ec4899'/></linearGradient></defs><rect width='1440' height='900' fill='url(%23g)'/><rect x='100' y='100' width='1240' height='700' rx='24' fill='%23fff' fill-opacity='.16'/><rect x='160' y='180' width='520' height='48' rx='12' fill='%23fff' fill-opacity='.85'/><rect x='160' y='270' width='1120' height='28' rx='8' fill='%23fff' fill-opacity='.4'/><rect x='160' y='320' width='940' height='28' rx='8' fill='%23fff' fill-opacity='.4'/></svg>";

export default function Example() {
  return (
    <Card view style={{ inlineSize: "min(100%, 20rem)" } as CSSProperties}>
      <CardViewMedia>
        <CardViewImage src={CAPTURE} alt="Pricing page capture" width={1440} height={900} />
      </CardViewMedia>
      <HoverActions position="top-start">
        <HoverAction label="Annotate">
          <Icon icon={Edit02Icon} />
        </HoverAction>
        <HoverAction label="Pin to screen">
          <Icon icon={PinIcon} />
        </HoverAction>
      </HoverActions>
      <HoverActions position="bottom-start">
        <HoverAction label="Upload" side="top">
          <Icon icon={CloudUploadIcon} />
        </HoverAction>
      </HoverActions>
      <HoverActions position="bottom-end">
        <HoverAction label="Show in folder" side="top">
          <Icon icon={Folder01Icon} />
        </HoverAction>
        <HoverAction label="Delete" side="top">
          <Icon icon={Delete02Icon} />
        </HoverAction>
      </HoverActions>
    </Card>
  );
}
