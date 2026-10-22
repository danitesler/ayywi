# Hover actions

Category: Actions. Icon buttons that float over a picture, a video frame or a card — a capture's Copy, Annotate, Pin and ⋯. Each button has its own frosted background so it reads over any image, or the buttons share one glass bar (group). Reveal keeps them out of the way until the picture is hovered or focused; every button names itself in a tooltip. Also called: hover-actions, hover-action, overlay-actions, media-actions, quick-actions.

**Classes**
- `.ayy-hover-actions` — Row of hover actions. In the normal flow unless a position modifier floats it in a corner of the positioned parent.
- `.ayy-hover-actions--top-start` — Floats in the top start corner of the positioned parent.
- `.ayy-hover-actions--top-end` — Floats in the top end corner.
- `.ayy-hover-actions--bottom-start` — Floats in the bottom start corner.
- `.ayy-hover-actions--bottom-end` — Floats in the bottom end corner.
- `.ayy-hover-actions--group` — One glass bar (blurred, hairline border, pill corners) holds the buttons, which drop their own backgrounds.
- `.ayy-hover-actions--reveal` — Hidden until the element it sits directly in is hovered, has focus inside, carries data-hover or holds an open menu. Always shown on touch screens.
- `.ayy-hover-action` — Icon button at the small control size, frosted so it reads over a picture. Put an icon inside and an aria-label on it.

**States**
- `default` — Each button is a frosted square (surface at 55% over a 10px blur) with a 16px icon in the text colour. Grouped, the bar is frosted instead and the buttons are clear.
- `hover` (`.ayy-hover-action:hover (pointer devices)`) — The frosting thickens to 85% surface; in a group the button gets the wash-hover fill.
- `pressed` (`.ayy-hover-action:active`) — Shrinks to 94% for a moment.
- `focus` (`.ayy-hover-action:focus-visible`) — 2px --ayy-color-ring outline, 2px offset. Focus inside also reveals a --reveal row.
- `disabled` (`:disabled on the button`) — 45% opacity and a not-allowed cursor.
- `selected` — doesn't apply: Hover actions run something once; they have no on state. Use a Toolbar toggle (aria-pressed) for one that stays on.
- `error` — doesn't apply: Report a failed action in a toast or the card's status, not on the button.
- `loading` — doesn't apply: Show progress where the result appears (a card toast status, a Spinner); keep the button as it is.
- `revealed` (`.ayy-hover-actions--reveal inside a parent that is :hover, :focus-within, [data-hover] or :has([aria-expanded="true"])`) — Fades in and settles from 4px above (below for bottom corners). Hidden rows ignore the pointer.

**Sizes**
- Density — Buttons are --ayy-size-control-sm square: 28px compact, 32px comfortable, 40px touch. Icons stay 16px.
- Width — As wide as its buttons. Positioned rows sit 8px in from the corner of their parent.

**React** — `import { HoverActions, HoverAction } from "@danitesler/ayywi/react";`
- `<HoverActions>` renders <div class="ayy-hover-actions">. Props: `position` "top-start" | "top-end" | "bottom-start" | "bottom-end" — corner of the positioned parent; `group` boolean — one glass bar for all the buttons; `reveal` boolean — hidden until the parent is hovered or focused
- `<HoverAction>` renders <button class="ayy-hover-action"> inside a Tooltip. Props: `label` string (required) — accessible name and tooltip text; `hint` ReactNode — after the label in the tooltip, e.g. <Shortcut keys="Mod+C" />; `tooltip` boolean — false drops the tooltip (the label stays the accessible name). Default true; `side` "top" | "bottom" | "start" | "end" — tooltip side. Default "bottom"; `children` ReactNode — the icon

**Accessibility**
- Every button needs an aria-label (React's label sets it); the icon is decorative.
- Revealed rows are still in the tab order: focusing a button shows the row, so keyboard users reach every action.
- Touch screens have no hover, so --reveal rows always show there; never hide the only way to do something behind hover.

**Do**
- Use hover actions for the few icon actions on a picture, a video frame or a media card: Copy, Annotate, Pin, Trim, and a ⋯ menu for the rest.
- Group them on one bar (group) when there are three or more in one corner; keep them separate when each corner holds one or two.
- Put a --reveal row directly inside the element whose hover should show it (the card, the picture's box).
- End a group with a ⋯ DropdownMenu for anything that doesn't earn its own button.

**Don't**
- Don't use hover actions for a page's or a toolbar's buttons — use Button, or a Toolbar for a row of tools.
- Don't put text buttons in a hover-actions row; they're icon-only. A card toast's centre buttons (Copy, Save) are regular Buttons.
- Don't use title="" for their names; the label is the tooltip.
- Don't put more than five in one corner — move the rest into the ⋯ menu.

## Hover actions — Separate, in the corners

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<div class="ayy-card ayy-card--view" style="inline-size:min(100%, 20rem)"><div class="ayy-card__view-media"><img class="ayy-card__view-backdrop" src="data:image/svg+xml;utf8,&lt;svg xmlns=&#x27;http://www.w3.org/2000/svg&#x27; width=&#x27;1440&#x27; height=&#x27;900&#x27; viewBox=&#x27;0 0 1440 900&#x27;&gt;&lt;defs&gt;&lt;linearGradient id=&#x27;g&#x27; x1=&#x27;0&#x27; y1=&#x27;0&#x27; x2=&#x27;1&#x27; y2=&#x27;1&#x27;&gt;&lt;stop offset=&#x27;0&#x27; stop-color=&#x27;%236366f1&#x27;/&gt;&lt;stop offset=&#x27;1&#x27; stop-color=&#x27;%23ec4899&#x27;/&gt;&lt;/linearGradient&gt;&lt;/defs&gt;&lt;rect width=&#x27;1440&#x27; height=&#x27;900&#x27; fill=&#x27;url(%23g)&#x27;/&gt;&lt;rect x=&#x27;100&#x27; y=&#x27;100&#x27; width=&#x27;1240&#x27; height=&#x27;700&#x27; rx=&#x27;24&#x27; fill=&#x27;%23fff&#x27; fill-opacity=&#x27;.16&#x27;/&gt;&lt;rect x=&#x27;160&#x27; y=&#x27;180&#x27; width=&#x27;520&#x27; height=&#x27;48&#x27; rx=&#x27;12&#x27; fill=&#x27;%23fff&#x27; fill-opacity=&#x27;.85&#x27;/&gt;&lt;rect x=&#x27;160&#x27; y=&#x27;270&#x27; width=&#x27;1120&#x27; height=&#x27;28&#x27; rx=&#x27;8&#x27; fill=&#x27;%23fff&#x27; fill-opacity=&#x27;.4&#x27;/&gt;&lt;rect x=&#x27;160&#x27; y=&#x27;320&#x27; width=&#x27;940&#x27; height=&#x27;28&#x27; rx=&#x27;8&#x27; fill=&#x27;%23fff&#x27; fill-opacity=&#x27;.4&#x27;/&gt;&lt;/svg&gt;" alt="" aria-hidden="true" draggable="false"/><img class="ayy-card__view-image" src="data:image/svg+xml;utf8,&lt;svg xmlns=&#x27;http://www.w3.org/2000/svg&#x27; width=&#x27;1440&#x27; height=&#x27;900&#x27; viewBox=&#x27;0 0 1440 900&#x27;&gt;&lt;defs&gt;&lt;linearGradient id=&#x27;g&#x27; x1=&#x27;0&#x27; y1=&#x27;0&#x27; x2=&#x27;1&#x27; y2=&#x27;1&#x27;&gt;&lt;stop offset=&#x27;0&#x27; stop-color=&#x27;%236366f1&#x27;/&gt;&lt;stop offset=&#x27;1&#x27; stop-color=&#x27;%23ec4899&#x27;/&gt;&lt;/linearGradient&gt;&lt;/defs&gt;&lt;rect width=&#x27;1440&#x27; height=&#x27;900&#x27; fill=&#x27;url(%23g)&#x27;/&gt;&lt;rect x=&#x27;100&#x27; y=&#x27;100&#x27; width=&#x27;1240&#x27; height=&#x27;700&#x27; rx=&#x27;24&#x27; fill=&#x27;%23fff&#x27; fill-opacity=&#x27;.16&#x27;/&gt;&lt;rect x=&#x27;160&#x27; y=&#x27;180&#x27; width=&#x27;520&#x27; height=&#x27;48&#x27; rx=&#x27;12&#x27; fill=&#x27;%23fff&#x27; fill-opacity=&#x27;.85&#x27;/&gt;&lt;rect x=&#x27;160&#x27; y=&#x27;270&#x27; width=&#x27;1120&#x27; height=&#x27;28&#x27; rx=&#x27;8&#x27; fill=&#x27;%23fff&#x27; fill-opacity=&#x27;.4&#x27;/&gt;&lt;rect x=&#x27;160&#x27; y=&#x27;320&#x27; width=&#x27;940&#x27; height=&#x27;28&#x27; rx=&#x27;8&#x27; fill=&#x27;%23fff&#x27; fill-opacity=&#x27;.4&#x27;/&gt;&lt;/svg&gt;" alt="Pricing page capture" draggable="false" width="1440" height="900"/></div><div class="ayy-hover-actions ayy-hover-actions--top-start"><ayy-tooltip class="ayy-tooltip" side="bottom"><button type="button" class="ayy-hover-action" aria-label="Annotate"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M14.0737 3.88545C14.8189 3.07808 15.1915 2.6744 15.5874 2.43893C16.5427 1.87076 17.7191 1.85309 18.6904 2.39232C19.0929 2.6158 19.4769 3.00812 20.245 3.79276C21.0131 4.5774 21.3972 4.96972 21.6159 5.38093C22.1438 6.37312 22.1265 7.57479 21.5703 8.5507C21.3398 8.95516 20.9446 9.33578 20.1543 10.097L10.7506 19.1543C9.25288 20.5969 8.504 21.3182 7.56806 21.6837C6.63212 22.0493 5.6032 22.0224 3.54536 21.9686L3.26538 21.9613C2.63891 21.9449 2.32567 21.9367 2.14359 21.73C1.9615 21.5234 1.98636 21.2043 2.03608 20.5662L2.06308 20.2197C2.20301 18.4235 2.27297 17.5255 2.62371 16.7182C2.97444 15.9109 3.57944 15.2555 4.78943 13.9445L14.0737 3.88545Z" stroke="currentColor" stroke-linejoin="round" stroke-width="1.5"></path><path d="M13 4L20 11" stroke="currentColor" stroke-linejoin="round" stroke-width="1.5"></path><path d="M14 22L22 22" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg></button><span class="ayy-tooltip__content" role="tooltip">Annotate</span></ayy-tooltip><ayy-tooltip class="ayy-tooltip" side="bottom"><button type="button" class="ayy-hover-action" aria-label="Pin to screen"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M3 21L8 16" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M13.2585 18.8714C9.51516 18.0215 5.97844 14.4848 5.12853 10.7415C4.99399 10.1489 4.92672 9.85266 5.12161 9.37197C5.3165 8.89129 5.55457 8.74255 6.03071 8.44509C7.10705 7.77265 8.27254 7.55888 9.48209 7.66586C11.1793 7.81598 12.0279 7.89104 12.4512 7.67048C12.8746 7.44991 13.1622 6.93417 13.7376 5.90269L14.4664 4.59604C14.9465 3.73528 15.1866 3.3049 15.7513 3.10202C16.316 2.89913 16.6558 3.02199 17.3355 3.26771C18.9249 3.84236 20.1576 5.07505 20.7323 6.66449C20.978 7.34417 21.1009 7.68401 20.898 8.2487C20.6951 8.8134 20.2647 9.05346 19.4039 9.53358L18.0672 10.2792C17.0376 10.8534 16.5229 11.1406 16.3024 11.568C16.0819 11.9955 16.162 12.8256 16.3221 14.4859C16.4399 15.7068 16.2369 16.88 15.5555 17.9697C15.2577 18.4458 15.1088 18.6839 14.6283 18.8786C14.1477 19.0733 13.8513 19.006 13.2585 18.8714Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg></button><span class="ayy-tooltip__content" role="tooltip">Pin to screen</span></ayy-tooltip></div><div class="ayy-hover-actions ayy-hover-actions--bottom-start"><ayy-tooltip class="ayy-tooltip"><button type="button" class="ayy-hover-action" aria-label="Upload"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M17.4776 9.01106C17.485 9.01102 17.4925 9.01101 17.5 9.01101C19.9853 9.01101 22 11.0294 22 13.5193C22 15.8398 20.25 17.7508 18 18M17.4776 9.01106C17.4924 8.84606 17.5 8.67896 17.5 8.51009C17.5 5.46695 15.0376 3 12 3C9.12324 3 6.76233 5.21267 6.52042 8.03192M17.4776 9.01106C17.3753 10.1476 16.9286 11.1846 16.2428 12.0165M6.52042 8.03192C3.98398 8.27373 2 10.4139 2 13.0183C2 15.4417 3.71776 17.4632 6 17.9273M6.52042 8.03192C6.67826 8.01687 6.83823 8.00917 7 8.00917C8.12582 8.00917 9.16474 8.38194 10.0005 9.01101" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M12 13L12 21M12 13C11.2998 13 9.99153 14.9943 9.5 15.5M12 13C12.7002 13 14.0085 14.9943 14.5 15.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg></button><span class="ayy-tooltip__content" role="tooltip">Upload</span></ayy-tooltip></div><div class="ayy-hover-actions ayy-hover-actions--bottom-end"><ayy-tooltip class="ayy-tooltip"><button type="button" class="ayy-hover-action" aria-label="Show in folder"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M8 7H16.75C18.8567 7 19.91 7 20.6667 7.50559C20.9943 7.72447 21.2755 8.00572 21.4944 8.33329C22 9.08996 22 10.1433 22 12.25C22 15.7612 22 17.5167 21.1573 18.7779C20.7926 19.3238 20.3238 19.7926 19.7779 20.1573C18.5167 21 16.7612 21 13.25 21H12C7.28595 21 4.92893 21 3.46447 19.5355C2 18.0711 2 15.714 2 11V7.94427C2 6.1278 2 5.21956 2.38032 4.53806C2.65142 4.05227 3.05227 3.65142 3.53806 3.38032C4.21956 3 5.1278 3 6.94427 3C8.10802 3 8.6899 3 9.19926 3.19101C10.3622 3.62712 10.8418 4.68358 11.3666 5.73313L12 7" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path></svg></button><span class="ayy-tooltip__content" role="tooltip">Show in folder</span></ayy-tooltip><ayy-tooltip class="ayy-tooltip"><button type="button" class="ayy-hover-action" aria-label="Delete"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M19.5 5.5L18.8803 15.5251C18.7219 18.0864 18.6428 19.3671 18.0008 20.2879C17.6833 20.7431 17.2747 21.1273 16.8007 21.416C15.8421 22 14.559 22 11.9927 22C9.42312 22 8.1383 22 7.17905 21.4149C6.7048 21.1257 6.296 20.7408 5.97868 20.2848C5.33688 19.3626 5.25945 18.0801 5.10461 15.5152L4.5 5.5" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path><path d="M3 5.5H21M16.0557 5.5L15.3731 4.09173C14.9196 3.15626 14.6928 2.68852 14.3017 2.39681C14.215 2.3321 14.1231 2.27454 14.027 2.2247C13.5939 2 13.0741 2 12.0345 2C10.9688 2 10.436 2 9.99568 2.23412C9.8981 2.28601 9.80498 2.3459 9.71729 2.41317C9.32164 2.7167 9.10063 3.20155 8.65861 4.17126L8.05292 5.5" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path><path d="M9.5 16.5L9.5 10.5" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path><path d="M14.5 16.5L14.5 10.5" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path></svg></button><span class="ayy-tooltip__content" role="tooltip">Delete</span></ayy-tooltip></div></div>
```

React:

```tsx
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
```

## Hover actions — Grouped on a glass bar

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<div class="ayy-card ayy-card--view" style="inline-size:min(100%, 20rem)"><div class="ayy-card__view-media"><img class="ayy-card__view-backdrop" src="data:image/svg+xml;utf8,&lt;svg xmlns=&#x27;http://www.w3.org/2000/svg&#x27; width=&#x27;1440&#x27; height=&#x27;900&#x27; viewBox=&#x27;0 0 1440 900&#x27;&gt;&lt;defs&gt;&lt;linearGradient id=&#x27;g&#x27; x1=&#x27;0&#x27; y1=&#x27;0&#x27; x2=&#x27;1&#x27; y2=&#x27;1&#x27;&gt;&lt;stop offset=&#x27;0&#x27; stop-color=&#x27;%230ea5e9&#x27;/&gt;&lt;stop offset=&#x27;1&#x27; stop-color=&#x27;%2310b981&#x27;/&gt;&lt;/linearGradient&gt;&lt;/defs&gt;&lt;rect width=&#x27;1440&#x27; height=&#x27;900&#x27; fill=&#x27;url(%23g)&#x27;/&gt;&lt;rect x=&#x27;100&#x27; y=&#x27;100&#x27; width=&#x27;1240&#x27; height=&#x27;700&#x27; rx=&#x27;24&#x27; fill=&#x27;%23fff&#x27; fill-opacity=&#x27;.16&#x27;/&gt;&lt;rect x=&#x27;160&#x27; y=&#x27;180&#x27; width=&#x27;520&#x27; height=&#x27;48&#x27; rx=&#x27;12&#x27; fill=&#x27;%23fff&#x27; fill-opacity=&#x27;.85&#x27;/&gt;&lt;rect x=&#x27;160&#x27; y=&#x27;270&#x27; width=&#x27;1120&#x27; height=&#x27;28&#x27; rx=&#x27;8&#x27; fill=&#x27;%23fff&#x27; fill-opacity=&#x27;.4&#x27;/&gt;&lt;/svg&gt;" alt="" aria-hidden="true" draggable="false"/><img class="ayy-card__view-image" src="data:image/svg+xml;utf8,&lt;svg xmlns=&#x27;http://www.w3.org/2000/svg&#x27; width=&#x27;1440&#x27; height=&#x27;900&#x27; viewBox=&#x27;0 0 1440 900&#x27;&gt;&lt;defs&gt;&lt;linearGradient id=&#x27;g&#x27; x1=&#x27;0&#x27; y1=&#x27;0&#x27; x2=&#x27;1&#x27; y2=&#x27;1&#x27;&gt;&lt;stop offset=&#x27;0&#x27; stop-color=&#x27;%230ea5e9&#x27;/&gt;&lt;stop offset=&#x27;1&#x27; stop-color=&#x27;%2310b981&#x27;/&gt;&lt;/linearGradient&gt;&lt;/defs&gt;&lt;rect width=&#x27;1440&#x27; height=&#x27;900&#x27; fill=&#x27;url(%23g)&#x27;/&gt;&lt;rect x=&#x27;100&#x27; y=&#x27;100&#x27; width=&#x27;1240&#x27; height=&#x27;700&#x27; rx=&#x27;24&#x27; fill=&#x27;%23fff&#x27; fill-opacity=&#x27;.16&#x27;/&gt;&lt;rect x=&#x27;160&#x27; y=&#x27;180&#x27; width=&#x27;520&#x27; height=&#x27;48&#x27; rx=&#x27;12&#x27; fill=&#x27;%23fff&#x27; fill-opacity=&#x27;.85&#x27;/&gt;&lt;rect x=&#x27;160&#x27; y=&#x27;270&#x27; width=&#x27;1120&#x27; height=&#x27;28&#x27; rx=&#x27;8&#x27; fill=&#x27;%23fff&#x27; fill-opacity=&#x27;.4&#x27;/&gt;&lt;/svg&gt;" alt="Dashboard capture" draggable="false" width="1440" height="900"/></div><div class="ayy-hover-actions ayy-hover-actions--top-end ayy-hover-actions--group"><ayy-tooltip class="ayy-tooltip" side="bottom"><button type="button" class="ayy-hover-action" aria-label="Copy"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7.5 14.5C7.5 11.2002 7.5 9.55025 8.52513 8.52513C9.55025 7.5 11.2002 7.5 14.5 7.5C17.7998 7.5 19.4497 7.5 20.4749 8.52513C21.5 9.55025 21.5 11.2002 21.5 14.5C21.5 17.7998 21.5 19.4497 20.4749 20.4749C19.4497 21.5 17.7998 21.5 14.5 21.5C11.2002 21.5 9.55025 21.5 8.52513 20.4749C7.5 19.4497 7.5 17.7998 7.5 14.5Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M7.5 16.5C6.10355 16.5 5.40533 16.5 4.84402 16.3036C3.83866 15.9518 3.0482 15.1613 2.69641 14.156C2.5 13.5947 2.5 12.8964 2.5 11.5V9.5C2.5 6.20017 2.5 4.55025 3.52513 3.52513C4.55025 2.5 6.20017 2.5 9.5 2.5H11.5C12.8964 2.5 13.5947 2.5 14.156 2.69641C15.1613 3.0482 15.9518 3.83866 16.3036 4.84402C16.5 5.40533 16.5 6.10355 16.5 7.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg></button><span class="ayy-tooltip__content" role="tooltip">Copy <span class="ayy-shortcut" data-keys="Mod+C"><span class="ayy-sr-only">Ctrl C</span><kbd class="ayy-kbd" aria-hidden="true">Ctrl</kbd><kbd class="ayy-kbd" aria-hidden="true">C</kbd></span></span></ayy-tooltip><ayy-tooltip class="ayy-tooltip" side="bottom"><button type="button" class="ayy-hover-action" aria-label="Annotate"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M14.0737 3.88545C14.8189 3.07808 15.1915 2.6744 15.5874 2.43893C16.5427 1.87076 17.7191 1.85309 18.6904 2.39232C19.0929 2.6158 19.4769 3.00812 20.245 3.79276C21.0131 4.5774 21.3972 4.96972 21.6159 5.38093C22.1438 6.37312 22.1265 7.57479 21.5703 8.5507C21.3398 8.95516 20.9446 9.33578 20.1543 10.097L10.7506 19.1543C9.25288 20.5969 8.504 21.3182 7.56806 21.6837C6.63212 22.0493 5.6032 22.0224 3.54536 21.9686L3.26538 21.9613C2.63891 21.9449 2.32567 21.9367 2.14359 21.73C1.9615 21.5234 1.98636 21.2043 2.03608 20.5662L2.06308 20.2197C2.20301 18.4235 2.27297 17.5255 2.62371 16.7182C2.97444 15.9109 3.57944 15.2555 4.78943 13.9445L14.0737 3.88545Z" stroke="currentColor" stroke-linejoin="round" stroke-width="1.5"></path><path d="M13 4L20 11" stroke="currentColor" stroke-linejoin="round" stroke-width="1.5"></path><path d="M14 22L22 22" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg></button><span class="ayy-tooltip__content" role="tooltip">Annotate</span></ayy-tooltip><ayy-tooltip class="ayy-tooltip" side="bottom"><button type="button" class="ayy-hover-action" aria-label="Pin to screen"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M3 21L8 16" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M13.2585 18.8714C9.51516 18.0215 5.97844 14.4848 5.12853 10.7415C4.99399 10.1489 4.92672 9.85266 5.12161 9.37197C5.3165 8.89129 5.55457 8.74255 6.03071 8.44509C7.10705 7.77265 8.27254 7.55888 9.48209 7.66586C11.1793 7.81598 12.0279 7.89104 12.4512 7.67048C12.8746 7.44991 13.1622 6.93417 13.7376 5.90269L14.4664 4.59604C14.9465 3.73528 15.1866 3.3049 15.7513 3.10202C16.316 2.89913 16.6558 3.02199 17.3355 3.26771C18.9249 3.84236 20.1576 5.07505 20.7323 6.66449C20.978 7.34417 21.1009 7.68401 20.898 8.2487C20.6951 8.8134 20.2647 9.05346 19.4039 9.53358L18.0672 10.2792C17.0376 10.8534 16.5229 11.1406 16.3024 11.568C16.0819 11.9955 16.162 12.8256 16.3221 14.4859C16.4399 15.7068 16.2369 16.88 15.5555 17.9697C15.2577 18.4458 15.1088 18.6839 14.6283 18.8786C14.1477 19.0733 13.8513 19.006 13.2585 18.8714Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg></button><span class="ayy-tooltip__content" role="tooltip">Pin to screen</span></ayy-tooltip><ayy-menu><button type="button" class="ayy-button ayy-button--ghost ayy-button--icon-sm" aria-haspopup="menu" aria-label="More actions"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6.00449 12.5V12M18.0045 12.5V12M12.0045 12.5V12M7.00449 12.5C7.00449 11.9477 6.55677 11.5 6.00449 11.5C5.4522 11.5 5.00449 11.9477 5.00449 12.5C5.00449 13.0523 5.4522 13.5 6.00449 13.5C6.55677 13.5 7.00449 13.0523 7.00449 12.5ZM19.0045 12.5C19.0045 11.9477 18.5568 11.5 18.0045 11.5C17.4522 11.5 17.0045 11.9477 17.0045 12.5C17.0045 13.0523 17.4522 13.5 18.0045 13.5C18.5568 13.5 19.0045 13.0523 19.0045 12.5ZM13.0045 12.5C13.0045 11.9477 12.5568 11.5 12.0045 11.5C11.4522 11.5 11.0045 11.9477 11.0045 12.5C11.0045 13.0523 11.4522 13.5 12.0045 13.5C12.5568 13.5 13.0045 13.0523 13.0045 12.5Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg></button><div id="_R_i_" role="menu" class="ayy-menu" popover="auto"><button type="button" role="menuitem" tabindex="-1" class="ayy-menu__item">Save</button><button type="button" role="menuitem" tabindex="-1" class="ayy-menu__item">Copy text</button><button type="button" role="menuitem" tabindex="-1" class="ayy-menu__item">Show in folder</button><div role="separator" class="ayy-menu__separator"></div><button type="button" role="menuitem" tabindex="-1" class="ayy-menu__item ayy-menu__item--destructive">Delete</button></div></ayy-menu></div></div>
```

React:

```tsx
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
```

---
Part of @danitesler/ayywi 0.1.2: load `dist/ayywi.min.css` (and `dist/elements.global.js` for the <ayy-*> elements). The rules every screen follows: [llms-full.txt#rules](../llms-full.txt#rules). Every component: [llms.txt](../llms.txt).
