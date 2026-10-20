import type { CSSProperties } from "react";
import { Copy01Icon, Edit02Icon, MoreHorizontalIcon, PinIcon, ScissorIcon, Video01Icon } from "@hugeicons/core-free-icons";
import {
  Badge,
  Card,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  HoverAction,
  HoverActions,
  Icon,
  CardViewBadge,
  CardViewBadges,
  CardViewBody,
  CardViewImage,
  CardViewMedia,
  CardViewMeta,
  CardViewPlay,
  CardViewText,
  CardViewTitle,
} from "@danitesler/ayywi/react";

const DESKTOP =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='1440' height='900' viewBox='0 0 1440 900'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='%236366f1'/><stop offset='1' stop-color='%23ec4899'/></linearGradient></defs><rect width='1440' height='900' fill='url(%23g)'/><rect x='100' y='100' width='1240' height='700' rx='24' fill='%23fff' fill-opacity='.16'/><rect x='160' y='180' width='520' height='48' rx='12' fill='%23fff' fill-opacity='.85'/><rect x='160' y='270' width='1120' height='28' rx='8' fill='%23fff' fill-opacity='.4'/><rect x='160' y='320' width='940' height='28' rx='8' fill='%23fff' fill-opacity='.4'/><rect x='160' y='420' width='300' height='300' rx='20' fill='%23fff' fill-opacity='.3'/><rect x='500' y='420' width='300' height='300' rx='20' fill='%23fff' fill-opacity='.3'/><rect x='840' y='420' width='300' height='300' rx='20' fill='%23fff' fill-opacity='.3'/></svg>";

const PHONE =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='390' height='844' viewBox='0 0 390 844'><defs><linearGradient id='p' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='%230ea5e9'/><stop offset='1' stop-color='%2310b981'/></linearGradient></defs><rect width='390' height='844' fill='url(%23p)'/><rect x='24' y='72' width='200' height='28' rx='8' fill='%23fff' fill-opacity='.85'/><rect x='24' y='130' width='342' height='120' rx='18' fill='%23fff' fill-opacity='.3'/><rect x='24' y='270' width='342' height='120' rx='18' fill='%23fff' fill-opacity='.3'/><rect x='24' y='410' width='342' height='120' rx='18' fill='%23fff' fill-opacity='.3'/><rect x='24' y='760' width='342' height='52' rx='26' fill='%23fff' fill-opacity='.85'/></svg>";

const VIDEO =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='1920' height='1080' viewBox='0 0 1920 1080'><defs><linearGradient id='v' x1='0' y1='0' x2='1' y2='0'><stop offset='0' stop-color='%23f59e0b'/><stop offset='1' stop-color='%23ef4444'/></linearGradient></defs><rect width='1920' height='1080' fill='url(%23v)'/><rect x='160' y='140' width='1600' height='800' rx='28' fill='%23000' fill-opacity='.18'/><circle cx='960' cy='540' r='110' fill='%23fff' fill-opacity='.85'/></svg>";

function Actions({ media }: { media?: boolean }) {
  return (
    <HoverActions position="top-end" group reveal>
      <HoverAction label={media ? "Copy file" : "Copy"}>
        <Icon icon={Copy01Icon} />
      </HoverAction>
      {media ? (
        <HoverAction label="Trim">
          <Icon icon={ScissorIcon} />
        </HoverAction>
      ) : (
        <>
          <HoverAction label="Annotate">
            <Icon icon={Edit02Icon} />
          </HoverAction>
          <HoverAction label="Pin to screen">
            <Icon icon={PinIcon} />
          </HoverAction>
        </>
      )}
      <DropdownMenu>
        <DropdownMenuTrigger variant="ghost" size="icon-sm" aria-label="More actions">
          <Icon icon={MoreHorizontalIcon} />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>Save</DropdownMenuItem>
          <DropdownMenuItem>Upload</DropdownMenuItem>
          <DropdownMenuItem>Show in folder</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem destructive>Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </HoverActions>
  );
}

export default function Example() {
  return (
    <div className="ayy-grid" style={{ "--ayy-min": "14rem" } as CSSProperties}>
      <Card view data-hover>
        <CardViewMedia aria-label="Annotate the pricing page capture from 2 minutes ago" onClick={() => {}}>
          <CardViewImage src={DESKTOP} width={1440} height={900} />
        </CardViewMedia>
        <CardViewBody>
          <CardViewText>
            <CardViewTitle>Pricing page</CardViewTitle>
            <CardViewMeta>1440 × 900 · 2 min ago</CardViewMeta>
          </CardViewText>
          <CardViewBadges>
            <Badge variant="muted">Edited</Badge>
          </CardViewBadges>
        </CardViewBody>
        <Actions />
      </Card>

      <Card view>
        <CardViewMedia aria-label="Annotate the onboarding capture from 1 hour ago" onClick={() => {}}>
          <CardViewImage src={PHONE} width={390} height={844} />
        </CardViewMedia>
        <CardViewBody>
          <CardViewText>
            <CardViewTitle>Onboarding, step 2</CardViewTitle>
            <CardViewMeta>390 × 844 · 1 hour ago</CardViewMeta>
          </CardViewText>
        </CardViewBody>
        <Actions />
      </Card>

      <Card view>
        <CardViewMedia aria-label="Play the checkout recording from yesterday" onClick={() => {}}>
          <CardViewImage src={VIDEO} width={1920} height={1080} />
          <CardViewBadge icon={<Icon icon={Video01Icon} />}>0:42</CardViewBadge>
          <CardViewPlay />
        </CardViewMedia>
        <CardViewBody>
          <CardViewText>
            <CardViewTitle>Checkout flow</CardViewTitle>
            <CardViewMeta>0:42 · 8.4 MB · Yesterday</CardViewMeta>
          </CardViewText>
          <CardViewBadges>
            <Badge variant="info">Uploaded</Badge>
          </CardViewBadges>
        </CardViewBody>
        <Actions media />
      </Card>
    </div>
  );
}
