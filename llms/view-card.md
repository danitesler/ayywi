# View card

Category: Data display. A capture, a recording or a picture to open, as a card: the picture letterboxed over a blurred copy of itself, a recording's length in the corner, and its title, details, badges and actions revealed on hover. For a screenshot history, a media library or a gallery of exports. Also called: view-card, media-card, shot-card, capture-card, thumbnail-card.

**Classes**
- `.ayy-view-card` — Root: a card frame that clips the picture to its corners. Positioned, so Hover actions can float in its corners.
- `.ayy-view-card__media` — The picture's box at --ayy-ratio (default 16 / 10). A <button> or <a> when opening it is the card's main action.
- `.ayy-view-card__backdrop` — A blurred copy of the picture filling the box around the letterboxed picture (aria-hidden).
- `.ayy-view-card__image` — The picture itself, letterboxed (object-fit: contain), never cropped.
- `.ayy-view-card__badge` — Frosted pill in the top start corner: a recording's kind and length ("0:42").
- `.ayy-view-card__play` — Frosted round play glyph in the top end corner. Fades when the card is hovered so the actions can take the corner.
- `.ayy-view-card__body` — Title, details and badges on a gradient over the bottom of the picture. Revealed on hover; clicks go through to the picture.
- `.ayy-view-card__text` — Column of the title and the details; truncates.
- `.ayy-view-card__title` — The card's name in sm semibold, one line.
- `.ayy-view-card__meta` — Details in xs soft text with tabular figures: size, length, age.
- `.ayy-view-card__badges` — Row of Badges at the end of the body (Edited, Uploaded).

**States**
- `default` — The picture, letterboxed over its blurred copy, in a card with a hairline border. Only the badge and the play glyph show.
- `hover` (`.ayy-view-card:hover (pointer devices); [data-hover] does the same when hover is tracked elsewhere`) — The border darkens and the card lifts to the raised shadow. The body fades up from 6px below, a --reveal Hover actions row fades in, and the play glyph fades out.
- `pressed` — doesn't apply: The picture opens on click; there's no pressed look. Hover actions have their own.
- `focus` (`.ayy-view-card__media:focus-visible; :focus-within on the card`) — 2px --ayy-color-ring outline inside the picture's edge. Focus anywhere in the card reveals the body and actions, like hover.
- `disabled` — doesn't apply: Don't show a card that can't be opened; say why in an Empty state or an Alert.
- `selected` — doesn't apply: A View card opens one thing. For picking several, use Grid (GridItemSelect) with an Action bar.
- `error` — doesn't apply: Show a failed load or save in an Alert or a toast, not on the card.
- `loading` — doesn't apply: Show a Skeleton in the card's shape (aspect-ratio 16 / 10) with aria-busy on the grid while the list loads.
- `menu-open` (`:has([aria-expanded="true"]), a menu inside it is open`) — Stays revealed while its ⋯ menu is open.

**Sizes**
- Density — Fixed card layout; the badge, play glyph and Hover actions follow --ayy-size-control-sm (28px compact, 32px comfortable, 40px touch).
- Width — Fills its column: put View cards in .ayy-grid with --ayy-min (14–16rem). The picture's box is --ayy-ratio of that width.

**React** — `import { ViewCard, ViewCardMedia, ViewCardImage, ViewCardBadge, ViewCardPlay, ViewCardBody, ViewCardText, ViewCardTitle, ViewCardMeta, ViewCardBadges } from "@danitesler/ayywi/react";`
- `<ViewCard>` renders <article class="ayy-view-card">. Props: 
- `<ViewCardMedia>` renders <button class="ayy-view-card__media"> when given onClick, <a> with href, otherwise <div>. Props: `ratio` number | string — the box's shape, width ÷ height (1.6, or "1440 / 900"); default 16 / 10 so a grid lines up; `href` string — renders a link; `target` string — the link's target; `rel` string — the link's rel
- `<ViewCardImage>` renders <img class="ayy-view-card__backdrop"> + <img class="ayy-view-card__image"> (src, alt, width and height go on the picture). Props: `backdrop` string — a smaller copy for the blurred fill; default src
- `<ViewCardBadge>` renders <span class="ayy-view-card__badge">. Props: `icon` ReactNode — leading icon (video, GIF)
- `<ViewCardPlay>` renders <span class="ayy-view-card__play" aria-hidden="true"> with a play icon. Props: 
- `<ViewCardBody>` renders <div class="ayy-view-card__body">. Props: 
- `<ViewCardText>` renders <div class="ayy-view-card__text">. Props: 
- `<ViewCardTitle>` renders <p class="ayy-view-card__title">. Props: 
- `<ViewCardMeta>` renders <p class="ayy-view-card__meta">. Props: 
- `<ViewCardBadges>` renders <div class="ayy-view-card__badges">. Props: 

**Accessibility**
- When the picture opens something, ViewCardMedia is a <button> or <a> with an aria-label that names the item and the action ("Annotate the pricing page capture from 2 minutes ago"): the body is decoration on top of it.
- The body and actions are revealed by focus as well as hover, and always shown on touch screens, so nothing is hover-only.
- Give the picture's <img> an alt only when the card has no label that already names it; the backdrop is aria-hidden.
- Every Hover action needs a label (it's also the tooltip).

**Do**
- Use View cards for captures, recordings and pictures people open: a screenshot history, a media library, exported files.
- Put them in .ayy-grid with --ayy-min so columns follow the window.
- Pass the picture's real width and height to its <img>; keep the box at 16 / 10 in a grid so rows line up — portrait pictures letterbox over the blur.
- Group three or more actions in one Hover actions bar (top end, group, reveal) and end it with a ⋯ DropdownMenu.
- Show a recording's length in ViewCardBadge and add ViewCardPlay so it reads as playable before hover.

**Don't**
- Don't use a View card for records people select in bulk — use Grid with GridItemSelect and an Action bar.
- Don't use it for text content (articles, projects) — use Card.
- Don't crop the picture (object-fit: cover) — captures must show whole; the blurred copy fills the gap.
- Don't put essential information only in the body: it hides until hover on pointer devices. Name the item in the media's aria-label too.

## View card — Capture history

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<div class="ayy-grid" style="--ayy-min:14rem"><article class="ayy-view-card" data-hover="true"><button type="button" class="ayy-view-card__media" aria-label="Annotate the pricing page capture from 2 minutes ago"><img class="ayy-view-card__backdrop" src="data:image/svg+xml;utf8,&lt;svg xmlns=&#x27;http://www.w3.org/2000/svg&#x27; width=&#x27;1440&#x27; height=&#x27;900&#x27; viewBox=&#x27;0 0 1440 900&#x27;&gt;&lt;defs&gt;&lt;linearGradient id=&#x27;g&#x27; x1=&#x27;0&#x27; y1=&#x27;0&#x27; x2=&#x27;1&#x27; y2=&#x27;1&#x27;&gt;&lt;stop offset=&#x27;0&#x27; stop-color=&#x27;%236366f1&#x27;/&gt;&lt;stop offset=&#x27;1&#x27; stop-color=&#x27;%23ec4899&#x27;/&gt;&lt;/linearGradient&gt;&lt;/defs&gt;&lt;rect width=&#x27;1440&#x27; height=&#x27;900&#x27; fill=&#x27;url(%23g)&#x27;/&gt;&lt;rect x=&#x27;100&#x27; y=&#x27;100&#x27; width=&#x27;1240&#x27; height=&#x27;700&#x27; rx=&#x27;24&#x27; fill=&#x27;%23fff&#x27; fill-opacity=&#x27;.16&#x27;/&gt;&lt;rect x=&#x27;160&#x27; y=&#x27;180&#x27; width=&#x27;520&#x27; height=&#x27;48&#x27; rx=&#x27;12&#x27; fill=&#x27;%23fff&#x27; fill-opacity=&#x27;.85&#x27;/&gt;&lt;rect x=&#x27;160&#x27; y=&#x27;270&#x27; width=&#x27;1120&#x27; height=&#x27;28&#x27; rx=&#x27;8&#x27; fill=&#x27;%23fff&#x27; fill-opacity=&#x27;.4&#x27;/&gt;&lt;rect x=&#x27;160&#x27; y=&#x27;320&#x27; width=&#x27;940&#x27; height=&#x27;28&#x27; rx=&#x27;8&#x27; fill=&#x27;%23fff&#x27; fill-opacity=&#x27;.4&#x27;/&gt;&lt;rect x=&#x27;160&#x27; y=&#x27;420&#x27; width=&#x27;300&#x27; height=&#x27;300&#x27; rx=&#x27;20&#x27; fill=&#x27;%23fff&#x27; fill-opacity=&#x27;.3&#x27;/&gt;&lt;rect x=&#x27;500&#x27; y=&#x27;420&#x27; width=&#x27;300&#x27; height=&#x27;300&#x27; rx=&#x27;20&#x27; fill=&#x27;%23fff&#x27; fill-opacity=&#x27;.3&#x27;/&gt;&lt;rect x=&#x27;840&#x27; y=&#x27;420&#x27; width=&#x27;300&#x27; height=&#x27;300&#x27; rx=&#x27;20&#x27; fill=&#x27;%23fff&#x27; fill-opacity=&#x27;.3&#x27;/&gt;&lt;/svg&gt;" alt="" aria-hidden="true" draggable="false"/><img class="ayy-view-card__image" src="data:image/svg+xml;utf8,&lt;svg xmlns=&#x27;http://www.w3.org/2000/svg&#x27; width=&#x27;1440&#x27; height=&#x27;900&#x27; viewBox=&#x27;0 0 1440 900&#x27;&gt;&lt;defs&gt;&lt;linearGradient id=&#x27;g&#x27; x1=&#x27;0&#x27; y1=&#x27;0&#x27; x2=&#x27;1&#x27; y2=&#x27;1&#x27;&gt;&lt;stop offset=&#x27;0&#x27; stop-color=&#x27;%236366f1&#x27;/&gt;&lt;stop offset=&#x27;1&#x27; stop-color=&#x27;%23ec4899&#x27;/&gt;&lt;/linearGradient&gt;&lt;/defs&gt;&lt;rect width=&#x27;1440&#x27; height=&#x27;900&#x27; fill=&#x27;url(%23g)&#x27;/&gt;&lt;rect x=&#x27;100&#x27; y=&#x27;100&#x27; width=&#x27;1240&#x27; height=&#x27;700&#x27; rx=&#x27;24&#x27; fill=&#x27;%23fff&#x27; fill-opacity=&#x27;.16&#x27;/&gt;&lt;rect x=&#x27;160&#x27; y=&#x27;180&#x27; width=&#x27;520&#x27; height=&#x27;48&#x27; rx=&#x27;12&#x27; fill=&#x27;%23fff&#x27; fill-opacity=&#x27;.85&#x27;/&gt;&lt;rect x=&#x27;160&#x27; y=&#x27;270&#x27; width=&#x27;1120&#x27; height=&#x27;28&#x27; rx=&#x27;8&#x27; fill=&#x27;%23fff&#x27; fill-opacity=&#x27;.4&#x27;/&gt;&lt;rect x=&#x27;160&#x27; y=&#x27;320&#x27; width=&#x27;940&#x27; height=&#x27;28&#x27; rx=&#x27;8&#x27; fill=&#x27;%23fff&#x27; fill-opacity=&#x27;.4&#x27;/&gt;&lt;rect x=&#x27;160&#x27; y=&#x27;420&#x27; width=&#x27;300&#x27; height=&#x27;300&#x27; rx=&#x27;20&#x27; fill=&#x27;%23fff&#x27; fill-opacity=&#x27;.3&#x27;/&gt;&lt;rect x=&#x27;500&#x27; y=&#x27;420&#x27; width=&#x27;300&#x27; height=&#x27;300&#x27; rx=&#x27;20&#x27; fill=&#x27;%23fff&#x27; fill-opacity=&#x27;.3&#x27;/&gt;&lt;rect x=&#x27;840&#x27; y=&#x27;420&#x27; width=&#x27;300&#x27; height=&#x27;300&#x27; rx=&#x27;20&#x27; fill=&#x27;%23fff&#x27; fill-opacity=&#x27;.3&#x27;/&gt;&lt;/svg&gt;" alt="" draggable="false" width="1440" height="900"/></button><div class="ayy-view-card__body"><div class="ayy-view-card__text"><p class="ayy-view-card__title">Pricing page</p><p class="ayy-view-card__meta">1440 × 900 · 2 min ago</p></div><div class="ayy-view-card__badges"><span class="ayy-badge ayy-badge--muted">Edited</span></div></div><div class="ayy-hover-actions ayy-hover-actions--top-end ayy-hover-actions--group ayy-hover-actions--reveal"><ayy-tooltip class="ayy-tooltip" side="bottom"><button type="button" class="ayy-hover-action" aria-label="Copy"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7.5 14.5C7.5 11.2002 7.5 9.55025 8.52513 8.52513C9.55025 7.5 11.2002 7.5 14.5 7.5C17.7998 7.5 19.4497 7.5 20.4749 8.52513C21.5 9.55025 21.5 11.2002 21.5 14.5C21.5 17.7998 21.5 19.4497 20.4749 20.4749C19.4497 21.5 17.7998 21.5 14.5 21.5C11.2002 21.5 9.55025 21.5 8.52513 20.4749C7.5 19.4497 7.5 17.7998 7.5 14.5Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M7.5 16.5C6.10355 16.5 5.40533 16.5 4.84402 16.3036C3.83866 15.9518 3.0482 15.1613 2.69641 14.156C2.5 13.5947 2.5 12.8964 2.5 11.5V9.5C2.5 6.20017 2.5 4.55025 3.52513 3.52513C4.55025 2.5 6.20017 2.5 9.5 2.5H11.5C12.8964 2.5 13.5947 2.5 14.156 2.69641C15.1613 3.0482 15.9518 3.83866 16.3036 4.84402C16.5 5.40533 16.5 6.10355 16.5 7.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg></button><span class="ayy-tooltip__content" role="tooltip">Copy</span></ayy-tooltip><ayy-tooltip class="ayy-tooltip" side="bottom"><button type="button" class="ayy-hover-action" aria-label="Annotate"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M14.0737 3.88545C14.8189 3.07808 15.1915 2.6744 15.5874 2.43893C16.5427 1.87076 17.7191 1.85309 18.6904 2.39232C19.0929 2.6158 19.4769 3.00812 20.245 3.79276C21.0131 4.5774 21.3972 4.96972 21.6159 5.38093C22.1438 6.37312 22.1265 7.57479 21.5703 8.5507C21.3398 8.95516 20.9446 9.33578 20.1543 10.097L10.7506 19.1543C9.25288 20.5969 8.504 21.3182 7.56806 21.6837C6.63212 22.0493 5.6032 22.0224 3.54536 21.9686L3.26538 21.9613C2.63891 21.9449 2.32567 21.9367 2.14359 21.73C1.9615 21.5234 1.98636 21.2043 2.03608 20.5662L2.06308 20.2197C2.20301 18.4235 2.27297 17.5255 2.62371 16.7182C2.97444 15.9109 3.57944 15.2555 4.78943 13.9445L14.0737 3.88545Z" stroke="currentColor" stroke-linejoin="round" stroke-width="1.5"></path><path d="M13 4L20 11" stroke="currentColor" stroke-linejoin="round" stroke-width="1.5"></path><path d="M14 22L22 22" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg></button><span class="ayy-tooltip__content" role="tooltip">Annotate</span></ayy-tooltip><ayy-tooltip class="ayy-tooltip" side="bottom"><button type="button" class="ayy-hover-action" aria-label="Pin to screen"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M3 21L8 16" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M13.2585 18.8714C9.51516 18.0215 5.97844 14.4848 5.12853 10.7415C4.99399 10.1489 4.92672 9.85266 5.12161 9.37197C5.3165 8.89129 5.55457 8.74255 6.03071 8.44509C7.10705 7.77265 8.27254 7.55888 9.48209 7.66586C11.1793 7.81598 12.0279 7.89104 12.4512 7.67048C12.8746 7.44991 13.1622 6.93417 13.7376 5.90269L14.4664 4.59604C14.9465 3.73528 15.1866 3.3049 15.7513 3.10202C16.316 2.89913 16.6558 3.02199 17.3355 3.26771C18.9249 3.84236 20.1576 5.07505 20.7323 6.66449C20.978 7.34417 21.1009 7.68401 20.898 8.2487C20.6951 8.8134 20.2647 9.05346 19.4039 9.53358L18.0672 10.2792C17.0376 10.8534 16.5229 11.1406 16.3024 11.568C16.0819 11.9955 16.162 12.8256 16.3221 14.4859C16.4399 15.7068 16.2369 16.88 15.5555 17.9697C15.2577 18.4458 15.1088 18.6839 14.6283 18.8786C14.1477 19.0733 13.8513 19.006 13.2585 18.8714Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg></button><span class="ayy-tooltip__content" role="tooltip">Pin to screen</span></ayy-tooltip><ayy-menu><button type="button" class="ayy-button ayy-button--ghost ayy-button--icon-sm" aria-haspopup="menu" aria-label="More actions"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6.00449 12.5V12M18.0045 12.5V12M12.0045 12.5V12M7.00449 12.5C7.00449 11.9477 6.55677 11.5 6.00449 11.5C5.4522 11.5 5.00449 11.9477 5.00449 12.5C5.00449 13.0523 5.4522 13.5 6.00449 13.5C6.55677 13.5 7.00449 13.0523 7.00449 12.5ZM19.0045 12.5C19.0045 11.9477 18.5568 11.5 18.0045 11.5C17.4522 11.5 17.0045 11.9477 17.0045 12.5C17.0045 13.0523 17.4522 13.5 18.0045 13.5C18.5568 13.5 19.0045 13.0523 19.0045 12.5ZM13.0045 12.5C13.0045 11.9477 12.5568 11.5 12.0045 11.5C11.4522 11.5 11.0045 11.9477 11.0045 12.5C11.0045 13.0523 11.4522 13.5 12.0045 13.5C12.5568 13.5 13.0045 13.0523 13.0045 12.5Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg></button><div id="_R_1t_" role="menu" class="ayy-menu" popover="auto"><button type="button" role="menuitem" tabindex="-1" class="ayy-menu__item">Save</button><button type="button" role="menuitem" tabindex="-1" class="ayy-menu__item">Upload</button><button type="button" role="menuitem" tabindex="-1" class="ayy-menu__item">Show in folder</button><div role="separator" class="ayy-menu__separator"></div><button type="button" role="menuitem" tabindex="-1" class="ayy-menu__item ayy-menu__item--destructive">Delete</button></div></ayy-menu></div></article><article class="ayy-view-card"><button type="button" class="ayy-view-card__media" aria-label="Annotate the onboarding capture from 1 hour ago"><img class="ayy-view-card__backdrop" src="data:image/svg+xml;utf8,&lt;svg xmlns=&#x27;http://www.w3.org/2000/svg&#x27; width=&#x27;390&#x27; height=&#x27;844&#x27; viewBox=&#x27;0 0 390 844&#x27;&gt;&lt;defs&gt;&lt;linearGradient id=&#x27;p&#x27; x1=&#x27;0&#x27; y1=&#x27;0&#x27; x2=&#x27;0&#x27; y2=&#x27;1&#x27;&gt;&lt;stop offset=&#x27;0&#x27; stop-color=&#x27;%230ea5e9&#x27;/&gt;&lt;stop offset=&#x27;1&#x27; stop-color=&#x27;%2310b981&#x27;/&gt;&lt;/linearGradient&gt;&lt;/defs&gt;&lt;rect width=&#x27;390&#x27; height=&#x27;844&#x27; fill=&#x27;url(%23p)&#x27;/&gt;&lt;rect x=&#x27;24&#x27; y=&#x27;72&#x27; width=&#x27;200&#x27; height=&#x27;28&#x27; rx=&#x27;8&#x27; fill=&#x27;%23fff&#x27; fill-opacity=&#x27;.85&#x27;/&gt;&lt;rect x=&#x27;24&#x27; y=&#x27;130&#x27; width=&#x27;342&#x27; height=&#x27;120&#x27; rx=&#x27;18&#x27; fill=&#x27;%23fff&#x27; fill-opacity=&#x27;.3&#x27;/&gt;&lt;rect x=&#x27;24&#x27; y=&#x27;270&#x27; width=&#x27;342&#x27; height=&#x27;120&#x27; rx=&#x27;18&#x27; fill=&#x27;%23fff&#x27; fill-opacity=&#x27;.3&#x27;/&gt;&lt;rect x=&#x27;24&#x27; y=&#x27;410&#x27; width=&#x27;342&#x27; height=&#x27;120&#x27; rx=&#x27;18&#x27; fill=&#x27;%23fff&#x27; fill-opacity=&#x27;.3&#x27;/&gt;&lt;rect x=&#x27;24&#x27; y=&#x27;760&#x27; width=&#x27;342&#x27; height=&#x27;52&#x27; rx=&#x27;26&#x27; fill=&#x27;%23fff&#x27; fill-opacity=&#x27;.85&#x27;/&gt;&lt;/svg&gt;" alt="" aria-hidden="true" draggable="false"/><img class="ayy-view-card__image" src="data:image/svg+xml;utf8,&lt;svg xmlns=&#x27;http://www.w3.org/2000/svg&#x27; width=&#x27;390&#x27; height=&#x27;844&#x27; viewBox=&#x27;0 0 390 844&#x27;&gt;&lt;defs&gt;&lt;linearGradient id=&#x27;p&#x27; x1=&#x27;0&#x27; y1=&#x27;0&#x27; x2=&#x27;0&#x27; y2=&#x27;1&#x27;&gt;&lt;stop offset=&#x27;0&#x27; stop-color=&#x27;%230ea5e9&#x27;/&gt;&lt;stop offset=&#x27;1&#x27; stop-color=&#x27;%2310b981&#x27;/&gt;&lt;/linearGradient&gt;&lt;/defs&gt;&lt;rect width=&#x27;390&#x27; height=&#x27;844&#x27; fill=&#x27;url(%23p)&#x27;/&gt;&lt;rect x=&#x27;24&#x27; y=&#x27;72&#x27; width=&#x27;200&#x27; height=&#x27;28&#x27; rx=&#x27;8&#x27; fill=&#x27;%23fff&#x27; fill-opacity=&#x27;.85&#x27;/&gt;&lt;rect x=&#x27;24&#x27; y=&#x27;130&#x27; width=&#x27;342&#x27; height=&#x27;120&#x27; rx=&#x27;18&#x27; fill=&#x27;%23fff&#x27; fill-opacity=&#x27;.3&#x27;/&gt;&lt;rect x=&#x27;24&#x27; y=&#x27;270&#x27; width=&#x27;342&#x27; height=&#x27;120&#x27; rx=&#x27;18&#x27; fill=&#x27;%23fff&#x27; fill-opacity=&#x27;.3&#x27;/&gt;&lt;rect x=&#x27;24&#x27; y=&#x27;410&#x27; width=&#x27;342&#x27; height=&#x27;120&#x27; rx=&#x27;18&#x27; fill=&#x27;%23fff&#x27; fill-opacity=&#x27;.3&#x27;/&gt;&lt;rect x=&#x27;24&#x27; y=&#x27;760&#x27; width=&#x27;342&#x27; height=&#x27;52&#x27; rx=&#x27;26&#x27; fill=&#x27;%23fff&#x27; fill-opacity=&#x27;.85&#x27;/&gt;&lt;/svg&gt;" alt="" draggable="false" width="390" height="844"/></button><div class="ayy-view-card__body"><div class="ayy-view-card__text"><p class="ayy-view-card__title">Onboarding, step 2</p><p class="ayy-view-card__meta">390 × 844 · 1 hour ago</p></div></div><div class="ayy-hover-actions ayy-hover-actions--top-end ayy-hover-actions--group ayy-hover-actions--reveal"><ayy-tooltip class="ayy-tooltip" side="bottom"><button type="button" class="ayy-hover-action" aria-label="Copy"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7.5 14.5C7.5 11.2002 7.5 9.55025 8.52513 8.52513C9.55025 7.5 11.2002 7.5 14.5 7.5C17.7998 7.5 19.4497 7.5 20.4749 8.52513C21.5 9.55025 21.5 11.2002 21.5 14.5C21.5 17.7998 21.5 19.4497 20.4749 20.4749C19.4497 21.5 17.7998 21.5 14.5 21.5C11.2002 21.5 9.55025 21.5 8.52513 20.4749C7.5 19.4497 7.5 17.7998 7.5 14.5Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M7.5 16.5C6.10355 16.5 5.40533 16.5 4.84402 16.3036C3.83866 15.9518 3.0482 15.1613 2.69641 14.156C2.5 13.5947 2.5 12.8964 2.5 11.5V9.5C2.5 6.20017 2.5 4.55025 3.52513 3.52513C4.55025 2.5 6.20017 2.5 9.5 2.5H11.5C12.8964 2.5 13.5947 2.5 14.156 2.69641C15.1613 3.0482 15.9518 3.83866 16.3036 4.84402C16.5 5.40533 16.5 6.10355 16.5 7.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg></button><span class="ayy-tooltip__content" role="tooltip">Copy</span></ayy-tooltip><ayy-tooltip class="ayy-tooltip" side="bottom"><button type="button" class="ayy-hover-action" aria-label="Annotate"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M14.0737 3.88545C14.8189 3.07808 15.1915 2.6744 15.5874 2.43893C16.5427 1.87076 17.7191 1.85309 18.6904 2.39232C19.0929 2.6158 19.4769 3.00812 20.245 3.79276C21.0131 4.5774 21.3972 4.96972 21.6159 5.38093C22.1438 6.37312 22.1265 7.57479 21.5703 8.5507C21.3398 8.95516 20.9446 9.33578 20.1543 10.097L10.7506 19.1543C9.25288 20.5969 8.504 21.3182 7.56806 21.6837C6.63212 22.0493 5.6032 22.0224 3.54536 21.9686L3.26538 21.9613C2.63891 21.9449 2.32567 21.9367 2.14359 21.73C1.9615 21.5234 1.98636 21.2043 2.03608 20.5662L2.06308 20.2197C2.20301 18.4235 2.27297 17.5255 2.62371 16.7182C2.97444 15.9109 3.57944 15.2555 4.78943 13.9445L14.0737 3.88545Z" stroke="currentColor" stroke-linejoin="round" stroke-width="1.5"></path><path d="M13 4L20 11" stroke="currentColor" stroke-linejoin="round" stroke-width="1.5"></path><path d="M14 22L22 22" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg></button><span class="ayy-tooltip__content" role="tooltip">Annotate</span></ayy-tooltip><ayy-tooltip class="ayy-tooltip" side="bottom"><button type="button" class="ayy-hover-action" aria-label="Pin to screen"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M3 21L8 16" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M13.2585 18.8714C9.51516 18.0215 5.97844 14.4848 5.12853 10.7415C4.99399 10.1489 4.92672 9.85266 5.12161 9.37197C5.3165 8.89129 5.55457 8.74255 6.03071 8.44509C7.10705 7.77265 8.27254 7.55888 9.48209 7.66586C11.1793 7.81598 12.0279 7.89104 12.4512 7.67048C12.8746 7.44991 13.1622 6.93417 13.7376 5.90269L14.4664 4.59604C14.9465 3.73528 15.1866 3.3049 15.7513 3.10202C16.316 2.89913 16.6558 3.02199 17.3355 3.26771C18.9249 3.84236 20.1576 5.07505 20.7323 6.66449C20.978 7.34417 21.1009 7.68401 20.898 8.2487C20.6951 8.8134 20.2647 9.05346 19.4039 9.53358L18.0672 10.2792C17.0376 10.8534 16.5229 11.1406 16.3024 11.568C16.0819 11.9955 16.162 12.8256 16.3221 14.4859C16.4399 15.7068 16.2369 16.88 15.5555 17.9697C15.2577 18.4458 15.1088 18.6839 14.6283 18.8786C14.1477 19.0733 13.8513 19.006 13.2585 18.8714Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg></button><span class="ayy-tooltip__content" role="tooltip">Pin to screen</span></ayy-tooltip><ayy-menu><button type="button" class="ayy-button ayy-button--ghost ayy-button--icon-sm" aria-haspopup="menu" aria-label="More actions"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6.00449 12.5V12M18.0045 12.5V12M12.0045 12.5V12M7.00449 12.5C7.00449 11.9477 6.55677 11.5 6.00449 11.5C5.4522 11.5 5.00449 11.9477 5.00449 12.5C5.00449 13.0523 5.4522 13.5 6.00449 13.5C6.55677 13.5 7.00449 13.0523 7.00449 12.5ZM19.0045 12.5C19.0045 11.9477 18.5568 11.5 18.0045 11.5C17.4522 11.5 17.0045 11.9477 17.0045 12.5C17.0045 13.0523 17.4522 13.5 18.0045 13.5C18.5568 13.5 19.0045 13.0523 19.0045 12.5ZM13.0045 12.5C13.0045 11.9477 12.5568 11.5 12.0045 11.5C11.4522 11.5 11.0045 11.9477 11.0045 12.5C11.0045 13.0523 11.4522 13.5 12.0045 13.5C12.5568 13.5 13.0045 13.0523 13.0045 12.5Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg></button><div id="_R_1u_" role="menu" class="ayy-menu" popover="auto"><button type="button" role="menuitem" tabindex="-1" class="ayy-menu__item">Save</button><button type="button" role="menuitem" tabindex="-1" class="ayy-menu__item">Upload</button><button type="button" role="menuitem" tabindex="-1" class="ayy-menu__item">Show in folder</button><div role="separator" class="ayy-menu__separator"></div><button type="button" role="menuitem" tabindex="-1" class="ayy-menu__item ayy-menu__item--destructive">Delete</button></div></ayy-menu></div></article><article class="ayy-view-card"><button type="button" class="ayy-view-card__media" aria-label="Play the checkout recording from yesterday"><img class="ayy-view-card__backdrop" src="data:image/svg+xml;utf8,&lt;svg xmlns=&#x27;http://www.w3.org/2000/svg&#x27; width=&#x27;1920&#x27; height=&#x27;1080&#x27; viewBox=&#x27;0 0 1920 1080&#x27;&gt;&lt;defs&gt;&lt;linearGradient id=&#x27;v&#x27; x1=&#x27;0&#x27; y1=&#x27;0&#x27; x2=&#x27;1&#x27; y2=&#x27;0&#x27;&gt;&lt;stop offset=&#x27;0&#x27; stop-color=&#x27;%23f59e0b&#x27;/&gt;&lt;stop offset=&#x27;1&#x27; stop-color=&#x27;%23ef4444&#x27;/&gt;&lt;/linearGradient&gt;&lt;/defs&gt;&lt;rect width=&#x27;1920&#x27; height=&#x27;1080&#x27; fill=&#x27;url(%23v)&#x27;/&gt;&lt;rect x=&#x27;160&#x27; y=&#x27;140&#x27; width=&#x27;1600&#x27; height=&#x27;800&#x27; rx=&#x27;28&#x27; fill=&#x27;%23000&#x27; fill-opacity=&#x27;.18&#x27;/&gt;&lt;circle cx=&#x27;960&#x27; cy=&#x27;540&#x27; r=&#x27;110&#x27; fill=&#x27;%23fff&#x27; fill-opacity=&#x27;.85&#x27;/&gt;&lt;/svg&gt;" alt="" aria-hidden="true" draggable="false"/><img class="ayy-view-card__image" src="data:image/svg+xml;utf8,&lt;svg xmlns=&#x27;http://www.w3.org/2000/svg&#x27; width=&#x27;1920&#x27; height=&#x27;1080&#x27; viewBox=&#x27;0 0 1920 1080&#x27;&gt;&lt;defs&gt;&lt;linearGradient id=&#x27;v&#x27; x1=&#x27;0&#x27; y1=&#x27;0&#x27; x2=&#x27;1&#x27; y2=&#x27;0&#x27;&gt;&lt;stop offset=&#x27;0&#x27; stop-color=&#x27;%23f59e0b&#x27;/&gt;&lt;stop offset=&#x27;1&#x27; stop-color=&#x27;%23ef4444&#x27;/&gt;&lt;/linearGradient&gt;&lt;/defs&gt;&lt;rect width=&#x27;1920&#x27; height=&#x27;1080&#x27; fill=&#x27;url(%23v)&#x27;/&gt;&lt;rect x=&#x27;160&#x27; y=&#x27;140&#x27; width=&#x27;1600&#x27; height=&#x27;800&#x27; rx=&#x27;28&#x27; fill=&#x27;%23000&#x27; fill-opacity=&#x27;.18&#x27;/&gt;&lt;circle cx=&#x27;960&#x27; cy=&#x27;540&#x27; r=&#x27;110&#x27; fill=&#x27;%23fff&#x27; fill-opacity=&#x27;.85&#x27;/&gt;&lt;/svg&gt;" alt="" draggable="false" width="1920" height="1080"/><span class="ayy-view-card__badge"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M2 11C2 7.70017 2 6.05025 3.02513 5.02513C4.05025 4 5.70017 4 9 4H10C13.2998 4 14.9497 4 15.9749 5.02513C17 6.05025 17 7.70017 17 11V13C17 16.2998 17 17.9497 15.9749 18.9749C14.9497 20 13.2998 20 10 20H9C5.70017 20 4.05025 20 3.02513 18.9749C2 17.9497 2 16.2998 2 13V11Z" stroke="currentColor" stroke-width="1.5"></path><path d="M17 8.90585L17.1259 8.80196C19.2417 7.05623 20.2996 6.18336 21.1498 6.60482C22 7.02628 22 8.42355 22 11.2181V12.7819C22 15.5765 22 16.9737 21.1498 17.3952C20.2996 17.8166 19.2417 16.9438 17.1259 15.198L17 15.0941" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path><circle cx="11.5" cy="9.5" r="1.5" stroke="currentColor" stroke-width="1.5"></circle></svg>0:42</span><span class="ayy-view-card__play" aria-hidden="true"><svg class="ayy-icon ayy-icon--sm" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z" stroke="currentColor" stroke-linejoin="round" stroke-width="1.5"></path></svg></span></button><div class="ayy-view-card__body"><div class="ayy-view-card__text"><p class="ayy-view-card__title">Checkout flow</p><p class="ayy-view-card__meta">0:42 · 8.4 MB · Yesterday</p></div><div class="ayy-view-card__badges"><span class="ayy-badge ayy-badge--info">Uploaded</span></div></div><div class="ayy-hover-actions ayy-hover-actions--top-end ayy-hover-actions--group ayy-hover-actions--reveal"><ayy-tooltip class="ayy-tooltip" side="bottom"><button type="button" class="ayy-hover-action" aria-label="Copy file"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7.5 14.5C7.5 11.2002 7.5 9.55025 8.52513 8.52513C9.55025 7.5 11.2002 7.5 14.5 7.5C17.7998 7.5 19.4497 7.5 20.4749 8.52513C21.5 9.55025 21.5 11.2002 21.5 14.5C21.5 17.7998 21.5 19.4497 20.4749 20.4749C19.4497 21.5 17.7998 21.5 14.5 21.5C11.2002 21.5 9.55025 21.5 8.52513 20.4749C7.5 19.4497 7.5 17.7998 7.5 14.5Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M7.5 16.5C6.10355 16.5 5.40533 16.5 4.84402 16.3036C3.83866 15.9518 3.0482 15.1613 2.69641 14.156C2.5 13.5947 2.5 12.8964 2.5 11.5V9.5C2.5 6.20017 2.5 4.55025 3.52513 3.52513C4.55025 2.5 6.20017 2.5 9.5 2.5H11.5C12.8964 2.5 13.5947 2.5 14.156 2.69641C15.1613 3.0482 15.9518 3.83866 16.3036 4.84402C16.5 5.40533 16.5 6.10355 16.5 7.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg></button><span class="ayy-tooltip__content" role="tooltip">Copy file</span></ayy-tooltip><ayy-tooltip class="ayy-tooltip" side="bottom"><button type="button" class="ayy-hover-action" aria-label="Trim"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M21 6C21 7.65685 19.6569 9 18 9C16.3431 9 15 7.65685 15 6C15 4.34315 16.3431 3 18 3C19.6569 3 21 4.34315 21 6Z" stroke="currentColor" stroke-width="1.5"></path><path d="M21 18C21 19.6569 19.6569 21 18 21C16.3431 21 15 19.6569 15 18C15 16.3431 16.3431 15 18 15C19.6569 15 21 16.3431 21 18Z" stroke="currentColor" stroke-width="1.5"></path><path d="M15 8L3 19" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M15.0003 16L11 12" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M3 5.00011L8.5 10" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg></button><span class="ayy-tooltip__content" role="tooltip">Trim</span></ayy-tooltip><ayy-menu><button type="button" class="ayy-button ayy-button--ghost ayy-button--icon-sm" aria-haspopup="menu" aria-label="More actions"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6.00449 12.5V12M18.0045 12.5V12M12.0045 12.5V12M7.00449 12.5C7.00449 11.9477 6.55677 11.5 6.00449 11.5C5.4522 11.5 5.00449 11.9477 5.00449 12.5C5.00449 13.0523 5.4522 13.5 6.00449 13.5C6.55677 13.5 7.00449 13.0523 7.00449 12.5ZM19.0045 12.5C19.0045 11.9477 18.5568 11.5 18.0045 11.5C17.4522 11.5 17.0045 11.9477 17.0045 12.5C17.0045 13.0523 17.4522 13.5 18.0045 13.5C18.5568 13.5 19.0045 13.0523 19.0045 12.5ZM13.0045 12.5C13.0045 11.9477 12.5568 11.5 12.0045 11.5C11.4522 11.5 11.0045 11.9477 11.0045 12.5C11.0045 13.0523 11.4522 13.5 12.0045 13.5C12.5568 13.5 13.0045 13.0523 13.0045 12.5Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg></button><div id="_R_1v_" role="menu" class="ayy-menu" popover="auto"><button type="button" role="menuitem" tabindex="-1" class="ayy-menu__item">Save</button><button type="button" role="menuitem" tabindex="-1" class="ayy-menu__item">Upload</button><button type="button" role="menuitem" tabindex="-1" class="ayy-menu__item">Show in folder</button><div role="separator" class="ayy-menu__separator"></div><button type="button" role="menuitem" tabindex="-1" class="ayy-menu__item ayy-menu__item--destructive">Delete</button></div></ayy-menu></div></article></div>
```

React:

```tsx
import type { CSSProperties } from "react";
import { Copy01Icon, Edit02Icon, MoreHorizontalIcon, PinIcon, ScissorIcon, Video01Icon } from "@hugeicons/core-free-icons";
import {
  Badge,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  HoverAction,
  HoverActions,
  Icon,
  ViewCard,
  ViewCardBadge,
  ViewCardBadges,
  ViewCardBody,
  ViewCardImage,
  ViewCardMedia,
  ViewCardMeta,
  ViewCardPlay,
  ViewCardText,
  ViewCardTitle,
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
      <ViewCard data-hover>
        <ViewCardMedia aria-label="Annotate the pricing page capture from 2 minutes ago" onClick={() => {}}>
          <ViewCardImage src={DESKTOP} width={1440} height={900} />
        </ViewCardMedia>
        <ViewCardBody>
          <ViewCardText>
            <ViewCardTitle>Pricing page</ViewCardTitle>
            <ViewCardMeta>1440 × 900 · 2 min ago</ViewCardMeta>
          </ViewCardText>
          <ViewCardBadges>
            <Badge variant="muted">Edited</Badge>
          </ViewCardBadges>
        </ViewCardBody>
        <Actions />
      </ViewCard>

      <ViewCard>
        <ViewCardMedia aria-label="Annotate the onboarding capture from 1 hour ago" onClick={() => {}}>
          <ViewCardImage src={PHONE} width={390} height={844} />
        </ViewCardMedia>
        <ViewCardBody>
          <ViewCardText>
            <ViewCardTitle>Onboarding, step 2</ViewCardTitle>
            <ViewCardMeta>390 × 844 · 1 hour ago</ViewCardMeta>
          </ViewCardText>
        </ViewCardBody>
        <Actions />
      </ViewCard>

      <ViewCard>
        <ViewCardMedia aria-label="Play the checkout recording from yesterday" onClick={() => {}}>
          <ViewCardImage src={VIDEO} width={1920} height={1080} />
          <ViewCardBadge icon={<Icon icon={Video01Icon} />}>0:42</ViewCardBadge>
          <ViewCardPlay />
        </ViewCardMedia>
        <ViewCardBody>
          <ViewCardText>
            <ViewCardTitle>Checkout flow</ViewCardTitle>
            <ViewCardMeta>0:42 · 8.4 MB · Yesterday</ViewCardMeta>
          </ViewCardText>
          <ViewCardBadges>
            <Badge variant="info">Uploaded</Badge>
          </ViewCardBadges>
        </ViewCardBody>
        <Actions media />
      </ViewCard>
    </div>
  );
}
```

---
Part of @danitesler/ayywi 0.1.0: load `dist/ayywi.min.css` (and `dist/elements.global.js` for the <ayy-*> elements). The rules every screen follows: [llms-full.txt#rules](../llms-full.txt#rules). Every component: [llms.txt](../llms.txt).
