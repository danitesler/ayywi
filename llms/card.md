# Card

Category: Layout. Surface that groups related content. Flat at rest with an inset top highlight; optional lift and pointer-following spotlight. The view type (view) is a capture, recording or picture to open: the picture letterboxed over a blurred copy of itself, a recording's length in the corner, and its title, details, badges and Hover actions revealed on hover. Also called: card, panel-card, view-card, media-card, shot-card, capture-card, thumbnail-card.

**Classes**
- `.ayy-card` — Root surface.
- `.ayy-card--interactive` — Lifts on hover (mouse and trackpad only, so a tap doesn't leave it lifted). Use when the whole card is clickable.
- `.ayy-card--spotlight` — Pointer-following glow + lit border. Colour via the --ayy-spot custom property.
- `.ayy-card--featured` — The one to pick: the recommended plan in a pricing grid, or the option someone chose. A 2px border in the text colour (High Contrast: a highlight outline). One per group.
- `.ayy-card__header` — Top block (title + description).
- `.ayy-card__title` — Heading. Use an h2–h4 that fits your outline.
- `.ayy-card__description` — Muted supporting text.
- `.ayy-card__content` — Body.
- `.ayy-card__footer` — Actions row, pinned to the bottom.
- `.ayy-card__media` — Edge-to-edge image, screenshot or video. Rounds the card corners it touches (first or last child); zooms slightly when an interactive card is hovered with a mouse.
- `.ayy-card__link` — Put on the title's <a>: it stretches over the whole card, so the card is one link and one tab stop. Other links and buttons inside stay clickable.
- `.ayy-card--view` — View type: a capture, recording or picture to open. The picture fills the card and clips to its corners; Hover actions float in its corners.
- `.ayy-card__view-media` — View: the picture's box at --ayy-ratio (default 16 / 10). A <button> or <a> when opening it is the card's main action.
- `.ayy-card__view-backdrop` — View: a blurred copy of the picture filling the box around the letterboxed picture (aria-hidden).
- `.ayy-card__view-image` — View: the picture itself, letterboxed (object-fit: contain), never cropped.
- `.ayy-card__view-badge` — View: frosted pill in the top start corner — a recording's kind and length ("0:42").
- `.ayy-card__view-play` — View: frosted round play glyph in the top end corner. Fades when the card is hovered so the actions can take the corner.
- `.ayy-card__view-body` — View: title, details and badges on a gradient over the bottom of the picture. Revealed on hover; clicks go through to the picture.
- `.ayy-card__view-text` — View: column of the title and the details; truncates.
- `.ayy-card__view-title` — View: the card's name in sm semibold, one line.
- `.ayy-card__view-meta` — View: details in xs soft text with tabular figures — size, length, age.
- `.ayy-card__view-badges` — View: row of Badges at the end of the body (Edited, Uploaded).

**States**
- `default` — Surface fill, line border, card radius and the rest shadow; header, content and footer padded --ayy-space-5.
- `hover` (`:hover; on a view card also [data-hover] (hover tracked elsewhere)`) — Border turns line-hover. interactive also lifts 2px with the lift shadow and zooms its media 3%; spotlight lights a glow and border that follow the pointer. A view card takes the lift shadow, its body fades up from 6px below, a --reveal Hover actions row fades in and the play glyph fades out.
- `pressed` — doesn't apply: No pressed look, even when interactive.
- `focus` (`.ayy-card__link:focus-visible; .ayy-card__view-media:focus-visible`) — The ring goes around the whole card (2px, 2px offset) when its title link has keyboard focus. On a view card the ring sits inside the picture's edge, and focus anywhere in it reveals the body and actions like hover.
- `disabled` — doesn't apply: Cards aren't disabled; dim nothing. For an unavailable option use a Choice card with a disabled input.
- `selected` (`featured (ayy-card--featured)`) — Text-colour border plus a 1px ring, so it reads as 2px without moving. For a picked option use a Choice card instead. Forced colours: Highlight outline.
- `error` — doesn't apply: Put an Alert inside the card's content.
- `loading` — doesn't apply: No loading look; show Skeletons in the card's content shape (aria-busy on the region) — 16 / 10 for view cards.
- `menu-open` (`view card :has([aria-expanded="true"]), a menu inside it is open`) — Stays revealed while its ⋯ menu is open.

**Sizes**
- Density — Padding and text don't follow data-density.
- Width — Fills its grid cell or container; height follows content, and the footer sits at the bottom of a stretched card. A view card is as tall as its picture's box: --ayy-ratio of its width. Put view cards in .ayy-grid with --ayy-min (14–16rem).

**React** — `import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, CardMedia, CardLink, CardViewMedia, CardViewImage, CardViewBadge, CardViewPlay, CardViewBody, CardViewText, CardViewTitle, CardViewMeta, CardViewBadges } from "@danitesler/ayywi/react";`
- `<Card>` renders <div>. Props: `interactive` boolean; `spotlight` boolean — tracks the pointer for you; `spotColor` CSS colour for the spotlight, e.g. "var(--ayy-accent-product)"; `featured` boolean — the recommended or chosen card (ayy-card--featured).; `view` boolean — the view type (ayy-card--view): a capture, recording or picture to open
- `<CardHeader>` renders <div>.
- `<CardTitle>` renders <h3>.
- `<CardDescription>` renders <p>.
- `<CardContent>` renders <div>.
- `<CardFooter>` renders <div>.
- `<CardMedia>` renders <div>. Props: `children` An <img>, <picture>, <video> or <svg>. Give images width and height.
- `<CardLink>` renders <a class="ayy-card__link">. Props: `...rest` All native <a> attributes (href…).
- `<CardViewMedia>` renders <button class="ayy-card__view-media"> when given onClick, <a> with href, otherwise <div>. Props: `ratio` number | string — the box's shape, width ÷ height (1.6, or "1440 / 900"); default 16 / 10 so a grid lines up; `href` string — renders a link; `target` string — the link's target; `rel` string — the link's rel
- `<CardViewImage>` renders <img class="ayy-card__view-backdrop"> + <img class="ayy-card__view-image"> (src, alt, width and height go on the picture). Props: `backdrop` string — a smaller copy for the blurred fill; default src
- `<CardViewBadge>` renders <span class="ayy-card__view-badge">. Props: `icon` ReactNode — leading icon (video, GIF)
- `<CardViewPlay>` renders <span class="ayy-card__view-play" aria-hidden="true"> with a play icon.
- `<CardViewBody>` renders <div class="ayy-card__view-body">.
- `<CardViewText>` renders <div class="ayy-card__view-text">.
- `<CardViewTitle>` renders <p class="ayy-card__view-title">.
- `<CardViewMeta>` renders <p class="ayy-card__view-meta">.
- `<CardViewBadges>` renders <div class="ayy-card__view-badges">.

**Accessibility**
- If the whole card is a link, put ayy-card__link on the title's <a> — don't wrap the card in <a>. Screen readers then announce just the title, not the whole card.
- Media images are content: give them alt text, or alt="" when the title already says it all.
- Spotlight layers are pseudo-elements, invisible to assistive tech.
- View cards: when the picture opens something, CardViewMedia is a <button> or <a> with an aria-label that names the item and the action ("Annotate the pricing page capture from 2 minutes ago"); the body is decoration on top of it.
- View cards reveal their body and actions on focus as well as hover, and always show them on touch screens, so nothing is hover-only. The backdrop is aria-hidden.

**Do**
- Use a card to group a unit of content: a project, a person, a plan, a stat.
- Add interactive for clickable tiles in a grid.
- Use accent tokens (--ayy-accent-*) as spotColor to tie a card to a category.
- Keep one level of cards; use hairline dividers inside.
- Mark the recommended plan in a pricing grid with featured (and a Badge that says why), not a coloured background.
- Use the view type (view) for captures, recordings and pictures people open — a screenshot history, a media library — in .ayy-grid; pass the picture's real width and height, and keep the box at 16 / 10 so rows line up (portrait pictures letterbox over the blur).
- On a view card, group three or more actions in one Hover actions bar (top end, group, reveal) ending in a ⋯ DropdownMenu; show a recording's length in CardViewBadge and add CardViewPlay.

**Don't**
- Don't wrap page sections in a card — use plain layout.
- Don't nest cards inside cards.
- Don't set background colours on cards; the surface token keeps both themes correct.
- Don't use spotlight on dense lists — it's for showcase grids.
- Don't use view cards for records people select in bulk — use Grid with GridItemSelect and an Action bar.
- Don't crop a view card's picture (object-fit: cover) — captures must show whole; the blurred copy fills the gap. Don't put essential information only in its body: it hides until hover on pointer devices.

## Card — Basic

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<div class="ayy-card" style="max-inline-size: 22.5rem">
  <div class="ayy-card__header">
    <h3 class="ayy-card__title">Weekly report</h3>
    <p class="ayy-card__description">A summary of activity across your workspace.</p>
  </div>
  <div class="ayy-card__content">
    <p class="ayy-muted">12 projects · updated 2 minutes ago</p>
  </div>
  <div class="ayy-card__footer">
    <button type="button" class="ayy-button ayy-button--sm">Open report</button>
    <button type="button" class="ayy-button ayy-button--ghost ayy-button--sm">Share</button>
  </div>
</div>
```

React:

```tsx
import { Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@danitesler/ayywi/react";

export default function Example() {
  return (
    <Card style={{ maxInlineSize: "22.5rem" }}>
      <CardHeader>
        <CardTitle>Weekly report</CardTitle>
        <CardDescription>A summary of activity across your workspace.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="ayy-muted">12 projects · updated 2 minutes ago</p>
      </CardContent>
      <CardFooter>
        <Button size="sm">Open report</Button>
        <Button size="sm" variant="ghost">
          Share
        </Button>
      </CardFooter>
    </Card>
  );
}
```

## Card — Interactive with spotlight

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<!-- Pointer tracking comes from @danitesler/ayywi/elements (or call trackSpotlight on pointermove yourself). -->
<div class="ayy-card ayy-card--interactive ayy-card--spotlight" style="inline-size: 15rem; --ayy-spot: var(--ayy-accent-product)">
  <div class="ayy-card__header">
    <span class="ayy-badge ayy-badge--info">Product</span>
    <h3 class="ayy-card__title">Roadmap</h3>
    <p class="ayy-card__description">Move your pointer over me.</p>
  </div>
</div>
<div class="ayy-card ayy-card--interactive ayy-card--spotlight" style="inline-size: 15rem; --ayy-spot: var(--ayy-accent-ai)">
  <div class="ayy-card__header">
    <span class="ayy-badge ayy-badge--ai">AI</span>
    <h3 class="ayy-card__title">Assistant</h3>
    <p class="ayy-card__description">Colour comes from the content.</p>
  </div>
</div>
```

React:

```tsx
import { Badge, Card, CardDescription, CardHeader, CardTitle } from "@danitesler/ayywi/react";

export default function Example() {
  return (
    <>
      <Card interactive spotlight spotColor="var(--ayy-accent-product)" style={{ inlineSize: "15rem" }}>
        <CardHeader>
          <Badge variant="info">Product</Badge>
          <CardTitle>Roadmap</CardTitle>
          <CardDescription>Move your pointer over me.</CardDescription>
        </CardHeader>
      </Card>
      <Card interactive spotlight spotColor="var(--ayy-accent-ai)" style={{ inlineSize: "15rem" }}>
        <CardHeader>
          <Badge variant="ai">AI</Badge>
          <CardTitle>Assistant</CardTitle>
          <CardDescription>Colour comes from the content.</CardDescription>
        </CardHeader>
      </Card>
    </>
  );
}
```

## Card — Linked card with media

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<!-- A portfolio grid: the title link covers each card, the cover is coded SVG so it themes with the page. -->
<div class="ayy-grid" style="--ayy-min: 15rem; inline-size: 100%; max-inline-size: 40rem">
  <div class="ayy-card ayy-card--interactive ayy-card--spotlight" style="--ayy-spot: var(--ayy-accent-product)">
    <div class="ayy-card__media">
      <svg viewBox="0 0 320 180" aria-hidden="true">
        <rect width="320" height="180" style="fill: color-mix(in srgb, var(--ayy-spot) 20%, var(--ayy-color-surface))" />
        <rect x="56" y="36" width="208" height="160" rx="10" style="fill: var(--ayy-color-surface-raised); stroke: var(--ayy-color-line-strong)" />
        <rect x="76" y="60" width="96" height="10" rx="5" style="fill: var(--ayy-color-line-hover)" />
        <rect x="76" y="84" width="168" height="44" rx="6" style="fill: color-mix(in srgb, var(--ayy-spot) 45%, transparent)" />
        <rect x="76" y="140" width="80" height="44" rx="6" style="fill: var(--ayy-color-wash-hover)" />
        <rect x="164" y="140" width="80" height="44" rx="6" style="fill: var(--ayy-color-wash-hover)" />
      </svg>
    </div>
    <div class="ayy-card__header">
      <h3 class="ayy-card__title"><a class="ayy-card__link" href="#oktopost">Oktopost</a></h3>
      <p class="ayy-card__description">Design system realignment, a new post editor and seamless AI for a B2B social platform.</p>
    </div>
  </div>
  <div class="ayy-card ayy-card--interactive ayy-card--spotlight" style="--ayy-spot: var(--ayy-accent-research)">
    <div class="ayy-card__media">
      <svg viewBox="0 0 320 180" aria-hidden="true">
        <rect width="320" height="180" style="fill: color-mix(in srgb, var(--ayy-spot) 20%, var(--ayy-color-surface))" />
        <rect x="56" y="36" width="208" height="160" rx="10" style="fill: var(--ayy-color-surface-raised); stroke: var(--ayy-color-line-strong)" />
        <circle cx="196" cy="100" r="40" style="fill: color-mix(in srgb, var(--ayy-spot) 55%, transparent)" />
        <rect x="76" y="80" width="84" height="8" rx="4" style="fill: var(--ayy-color-line-hover)" />
        <rect x="76" y="96" width="64" height="8" rx="4" style="fill: var(--ayy-color-line-hover)" />
      </svg>
    </div>
    <div class="ayy-card__header">
      <span class="ayy-badge ayy-badge--ai">AI</span>
      <h3 class="ayy-card__title"><a class="ayy-card__link" href="#scalez">Scalez</a></h3>
      <p class="ayy-card__description">A conversational AI marketplace, and Savvy, its first use case: personal styling.</p>
    </div>
  </div>
</div>
```

React:

```tsx
import type { CSSProperties, ReactNode } from "react";
import { Badge, Card, CardDescription, CardHeader, CardLink, CardMedia, CardTitle } from "@danitesler/ayywi/react";

function Cover({ children }: { children: ReactNode }) {
  return (
    <svg viewBox="0 0 320 180" aria-hidden="true">
      <rect width="320" height="180" style={{ fill: "color-mix(in srgb, var(--ayy-spot) 20%, var(--ayy-color-surface))" }} />
      <rect x="56" y="36" width="208" height="160" rx="10" style={{ fill: "var(--ayy-color-surface-raised)", stroke: "var(--ayy-color-line-strong)" }} />
      {children}
    </svg>
  );
}

export default function Example() {
  return (
    <div className="ayy-grid" style={{ "--ayy-min": "15rem", inlineSize: "100%", maxInlineSize: "40rem" } as CSSProperties}>
      <Card interactive spotlight spotColor="var(--ayy-accent-product)">
        <CardMedia>
          <Cover>
            <rect x="76" y="60" width="96" height="10" rx="5" style={{ fill: "var(--ayy-color-line-hover)" }} />
            <rect x="76" y="84" width="168" height="44" rx="6" style={{ fill: "color-mix(in srgb, var(--ayy-spot) 45%, transparent)" }} />
            <rect x="76" y="140" width="80" height="44" rx="6" style={{ fill: "var(--ayy-color-wash-hover)" }} />
            <rect x="164" y="140" width="80" height="44" rx="6" style={{ fill: "var(--ayy-color-wash-hover)" }} />
          </Cover>
        </CardMedia>
        <CardHeader>
          <CardTitle>
            <CardLink href="#oktopost">Oktopost</CardLink>
          </CardTitle>
          <CardDescription>Design system realignment, a new post editor and seamless AI for a B2B social platform.</CardDescription>
        </CardHeader>
      </Card>
      <Card interactive spotlight spotColor="var(--ayy-accent-research)">
        <CardMedia>
          <Cover>
            <circle cx="196" cy="100" r="40" style={{ fill: "color-mix(in srgb, var(--ayy-spot) 55%, transparent)" }} />
            <rect x="76" y="80" width="84" height="8" rx="4" style={{ fill: "var(--ayy-color-line-hover)" }} />
            <rect x="76" y="96" width="64" height="8" rx="4" style={{ fill: "var(--ayy-color-line-hover)" }} />
          </Cover>
        </CardMedia>
        <CardHeader>
          <Badge variant="ai">AI</Badge>
          <CardTitle>
            <CardLink href="#scalez">Scalez</CardLink>
          </CardTitle>
          <CardDescription>A conversational AI marketplace, and Savvy, its first use case: personal styling.</CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
```

## Card — View cards: capture history

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<div class="ayy-grid" style="--ayy-min:14rem"><div class="ayy-card ayy-card--view" data-hover="true"><button type="button" class="ayy-card__view-media" aria-label="Annotate the pricing page capture from 2 minutes ago"><img class="ayy-card__view-backdrop" src="data:image/svg+xml;utf8,&lt;svg xmlns=&#x27;http://www.w3.org/2000/svg&#x27; width=&#x27;1440&#x27; height=&#x27;900&#x27; viewBox=&#x27;0 0 1440 900&#x27;&gt;&lt;defs&gt;&lt;linearGradient id=&#x27;g&#x27; x1=&#x27;0&#x27; y1=&#x27;0&#x27; x2=&#x27;1&#x27; y2=&#x27;1&#x27;&gt;&lt;stop offset=&#x27;0&#x27; stop-color=&#x27;%236366f1&#x27;/&gt;&lt;stop offset=&#x27;1&#x27; stop-color=&#x27;%23ec4899&#x27;/&gt;&lt;/linearGradient&gt;&lt;/defs&gt;&lt;rect width=&#x27;1440&#x27; height=&#x27;900&#x27; fill=&#x27;url(%23g)&#x27;/&gt;&lt;rect x=&#x27;100&#x27; y=&#x27;100&#x27; width=&#x27;1240&#x27; height=&#x27;700&#x27; rx=&#x27;24&#x27; fill=&#x27;%23fff&#x27; fill-opacity=&#x27;.16&#x27;/&gt;&lt;rect x=&#x27;160&#x27; y=&#x27;180&#x27; width=&#x27;520&#x27; height=&#x27;48&#x27; rx=&#x27;12&#x27; fill=&#x27;%23fff&#x27; fill-opacity=&#x27;.85&#x27;/&gt;&lt;rect x=&#x27;160&#x27; y=&#x27;270&#x27; width=&#x27;1120&#x27; height=&#x27;28&#x27; rx=&#x27;8&#x27; fill=&#x27;%23fff&#x27; fill-opacity=&#x27;.4&#x27;/&gt;&lt;rect x=&#x27;160&#x27; y=&#x27;320&#x27; width=&#x27;940&#x27; height=&#x27;28&#x27; rx=&#x27;8&#x27; fill=&#x27;%23fff&#x27; fill-opacity=&#x27;.4&#x27;/&gt;&lt;rect x=&#x27;160&#x27; y=&#x27;420&#x27; width=&#x27;300&#x27; height=&#x27;300&#x27; rx=&#x27;20&#x27; fill=&#x27;%23fff&#x27; fill-opacity=&#x27;.3&#x27;/&gt;&lt;rect x=&#x27;500&#x27; y=&#x27;420&#x27; width=&#x27;300&#x27; height=&#x27;300&#x27; rx=&#x27;20&#x27; fill=&#x27;%23fff&#x27; fill-opacity=&#x27;.3&#x27;/&gt;&lt;rect x=&#x27;840&#x27; y=&#x27;420&#x27; width=&#x27;300&#x27; height=&#x27;300&#x27; rx=&#x27;20&#x27; fill=&#x27;%23fff&#x27; fill-opacity=&#x27;.3&#x27;/&gt;&lt;/svg&gt;" alt="" aria-hidden="true" draggable="false"/><img class="ayy-card__view-image" src="data:image/svg+xml;utf8,&lt;svg xmlns=&#x27;http://www.w3.org/2000/svg&#x27; width=&#x27;1440&#x27; height=&#x27;900&#x27; viewBox=&#x27;0 0 1440 900&#x27;&gt;&lt;defs&gt;&lt;linearGradient id=&#x27;g&#x27; x1=&#x27;0&#x27; y1=&#x27;0&#x27; x2=&#x27;1&#x27; y2=&#x27;1&#x27;&gt;&lt;stop offset=&#x27;0&#x27; stop-color=&#x27;%236366f1&#x27;/&gt;&lt;stop offset=&#x27;1&#x27; stop-color=&#x27;%23ec4899&#x27;/&gt;&lt;/linearGradient&gt;&lt;/defs&gt;&lt;rect width=&#x27;1440&#x27; height=&#x27;900&#x27; fill=&#x27;url(%23g)&#x27;/&gt;&lt;rect x=&#x27;100&#x27; y=&#x27;100&#x27; width=&#x27;1240&#x27; height=&#x27;700&#x27; rx=&#x27;24&#x27; fill=&#x27;%23fff&#x27; fill-opacity=&#x27;.16&#x27;/&gt;&lt;rect x=&#x27;160&#x27; y=&#x27;180&#x27; width=&#x27;520&#x27; height=&#x27;48&#x27; rx=&#x27;12&#x27; fill=&#x27;%23fff&#x27; fill-opacity=&#x27;.85&#x27;/&gt;&lt;rect x=&#x27;160&#x27; y=&#x27;270&#x27; width=&#x27;1120&#x27; height=&#x27;28&#x27; rx=&#x27;8&#x27; fill=&#x27;%23fff&#x27; fill-opacity=&#x27;.4&#x27;/&gt;&lt;rect x=&#x27;160&#x27; y=&#x27;320&#x27; width=&#x27;940&#x27; height=&#x27;28&#x27; rx=&#x27;8&#x27; fill=&#x27;%23fff&#x27; fill-opacity=&#x27;.4&#x27;/&gt;&lt;rect x=&#x27;160&#x27; y=&#x27;420&#x27; width=&#x27;300&#x27; height=&#x27;300&#x27; rx=&#x27;20&#x27; fill=&#x27;%23fff&#x27; fill-opacity=&#x27;.3&#x27;/&gt;&lt;rect x=&#x27;500&#x27; y=&#x27;420&#x27; width=&#x27;300&#x27; height=&#x27;300&#x27; rx=&#x27;20&#x27; fill=&#x27;%23fff&#x27; fill-opacity=&#x27;.3&#x27;/&gt;&lt;rect x=&#x27;840&#x27; y=&#x27;420&#x27; width=&#x27;300&#x27; height=&#x27;300&#x27; rx=&#x27;20&#x27; fill=&#x27;%23fff&#x27; fill-opacity=&#x27;.3&#x27;/&gt;&lt;/svg&gt;" alt="" draggable="false" width="1440" height="900"/></button><div class="ayy-card__view-body"><div class="ayy-card__view-text"><p class="ayy-card__view-title">Pricing page</p><p class="ayy-card__view-meta">1440 × 900 · 2 min ago</p></div><div class="ayy-card__view-badges"><span class="ayy-badge ayy-badge--muted">Edited</span></div></div><div class="ayy-hover-actions ayy-hover-actions--top-end ayy-hover-actions--group ayy-hover-actions--reveal"><ayy-tooltip class="ayy-tooltip" side="bottom"><button type="button" class="ayy-hover-action" aria-label="Copy"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7.5 14.5C7.5 11.2002 7.5 9.55025 8.52513 8.52513C9.55025 7.5 11.2002 7.5 14.5 7.5C17.7998 7.5 19.4497 7.5 20.4749 8.52513C21.5 9.55025 21.5 11.2002 21.5 14.5C21.5 17.7998 21.5 19.4497 20.4749 20.4749C19.4497 21.5 17.7998 21.5 14.5 21.5C11.2002 21.5 9.55025 21.5 8.52513 20.4749C7.5 19.4497 7.5 17.7998 7.5 14.5Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M7.5 16.5C6.10355 16.5 5.40533 16.5 4.84402 16.3036C3.83866 15.9518 3.0482 15.1613 2.69641 14.156C2.5 13.5947 2.5 12.8964 2.5 11.5V9.5C2.5 6.20017 2.5 4.55025 3.52513 3.52513C4.55025 2.5 6.20017 2.5 9.5 2.5H11.5C12.8964 2.5 13.5947 2.5 14.156 2.69641C15.1613 3.0482 15.9518 3.83866 16.3036 4.84402C16.5 5.40533 16.5 6.10355 16.5 7.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg></button><span class="ayy-tooltip__content" role="tooltip">Copy</span></ayy-tooltip><ayy-tooltip class="ayy-tooltip" side="bottom"><button type="button" class="ayy-hover-action" aria-label="Annotate"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M14.0737 3.88545C14.8189 3.07808 15.1915 2.6744 15.5874 2.43893C16.5427 1.87076 17.7191 1.85309 18.6904 2.39232C19.0929 2.6158 19.4769 3.00812 20.245 3.79276C21.0131 4.5774 21.3972 4.96972 21.6159 5.38093C22.1438 6.37312 22.1265 7.57479 21.5703 8.5507C21.3398 8.95516 20.9446 9.33578 20.1543 10.097L10.7506 19.1543C9.25288 20.5969 8.504 21.3182 7.56806 21.6837C6.63212 22.0493 5.6032 22.0224 3.54536 21.9686L3.26538 21.9613C2.63891 21.9449 2.32567 21.9367 2.14359 21.73C1.9615 21.5234 1.98636 21.2043 2.03608 20.5662L2.06308 20.2197C2.20301 18.4235 2.27297 17.5255 2.62371 16.7182C2.97444 15.9109 3.57944 15.2555 4.78943 13.9445L14.0737 3.88545Z" stroke="currentColor" stroke-linejoin="round" stroke-width="1.5"></path><path d="M13 4L20 11" stroke="currentColor" stroke-linejoin="round" stroke-width="1.5"></path><path d="M14 22L22 22" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg></button><span class="ayy-tooltip__content" role="tooltip">Annotate</span></ayy-tooltip><ayy-tooltip class="ayy-tooltip" side="bottom"><button type="button" class="ayy-hover-action" aria-label="Pin to screen"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M3 21L8 16" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M13.2585 18.8714C9.51516 18.0215 5.97844 14.4848 5.12853 10.7415C4.99399 10.1489 4.92672 9.85266 5.12161 9.37197C5.3165 8.89129 5.55457 8.74255 6.03071 8.44509C7.10705 7.77265 8.27254 7.55888 9.48209 7.66586C11.1793 7.81598 12.0279 7.89104 12.4512 7.67048C12.8746 7.44991 13.1622 6.93417 13.7376 5.90269L14.4664 4.59604C14.9465 3.73528 15.1866 3.3049 15.7513 3.10202C16.316 2.89913 16.6558 3.02199 17.3355 3.26771C18.9249 3.84236 20.1576 5.07505 20.7323 6.66449C20.978 7.34417 21.1009 7.68401 20.898 8.2487C20.6951 8.8134 20.2647 9.05346 19.4039 9.53358L18.0672 10.2792C17.0376 10.8534 16.5229 11.1406 16.3024 11.568C16.0819 11.9955 16.162 12.8256 16.3221 14.4859C16.4399 15.7068 16.2369 16.88 15.5555 17.9697C15.2577 18.4458 15.1088 18.6839 14.6283 18.8786C14.1477 19.0733 13.8513 19.006 13.2585 18.8714Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg></button><span class="ayy-tooltip__content" role="tooltip">Pin to screen</span></ayy-tooltip><ayy-menu><button type="button" class="ayy-button ayy-button--ghost ayy-button--icon-sm" aria-haspopup="menu" aria-label="More actions"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6.00449 12.5V12M18.0045 12.5V12M12.0045 12.5V12M7.00449 12.5C7.00449 11.9477 6.55677 11.5 6.00449 11.5C5.4522 11.5 5.00449 11.9477 5.00449 12.5C5.00449 13.0523 5.4522 13.5 6.00449 13.5C6.55677 13.5 7.00449 13.0523 7.00449 12.5ZM19.0045 12.5C19.0045 11.9477 18.5568 11.5 18.0045 11.5C17.4522 11.5 17.0045 11.9477 17.0045 12.5C17.0045 13.0523 17.4522 13.5 18.0045 13.5C18.5568 13.5 19.0045 13.0523 19.0045 12.5ZM13.0045 12.5C13.0045 11.9477 12.5568 11.5 12.0045 11.5C11.4522 11.5 11.0045 11.9477 11.0045 12.5C11.0045 13.0523 11.4522 13.5 12.0045 13.5C12.5568 13.5 13.0045 13.0523 13.0045 12.5Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg></button><div id="_R_1t_" role="menu" class="ayy-menu" popover="auto"><button type="button" role="menuitem" tabindex="-1" class="ayy-menu__item">Save</button><button type="button" role="menuitem" tabindex="-1" class="ayy-menu__item">Upload</button><button type="button" role="menuitem" tabindex="-1" class="ayy-menu__item">Show in folder</button><div role="separator" class="ayy-menu__separator"></div><button type="button" role="menuitem" tabindex="-1" class="ayy-menu__item ayy-menu__item--destructive">Delete</button></div></ayy-menu></div></div><div class="ayy-card ayy-card--view"><button type="button" class="ayy-card__view-media" aria-label="Annotate the onboarding capture from 1 hour ago"><img class="ayy-card__view-backdrop" src="data:image/svg+xml;utf8,&lt;svg xmlns=&#x27;http://www.w3.org/2000/svg&#x27; width=&#x27;390&#x27; height=&#x27;844&#x27; viewBox=&#x27;0 0 390 844&#x27;&gt;&lt;defs&gt;&lt;linearGradient id=&#x27;p&#x27; x1=&#x27;0&#x27; y1=&#x27;0&#x27; x2=&#x27;0&#x27; y2=&#x27;1&#x27;&gt;&lt;stop offset=&#x27;0&#x27; stop-color=&#x27;%230ea5e9&#x27;/&gt;&lt;stop offset=&#x27;1&#x27; stop-color=&#x27;%2310b981&#x27;/&gt;&lt;/linearGradient&gt;&lt;/defs&gt;&lt;rect width=&#x27;390&#x27; height=&#x27;844&#x27; fill=&#x27;url(%23p)&#x27;/&gt;&lt;rect x=&#x27;24&#x27; y=&#x27;72&#x27; width=&#x27;200&#x27; height=&#x27;28&#x27; rx=&#x27;8&#x27; fill=&#x27;%23fff&#x27; fill-opacity=&#x27;.85&#x27;/&gt;&lt;rect x=&#x27;24&#x27; y=&#x27;130&#x27; width=&#x27;342&#x27; height=&#x27;120&#x27; rx=&#x27;18&#x27; fill=&#x27;%23fff&#x27; fill-opacity=&#x27;.3&#x27;/&gt;&lt;rect x=&#x27;24&#x27; y=&#x27;270&#x27; width=&#x27;342&#x27; height=&#x27;120&#x27; rx=&#x27;18&#x27; fill=&#x27;%23fff&#x27; fill-opacity=&#x27;.3&#x27;/&gt;&lt;rect x=&#x27;24&#x27; y=&#x27;410&#x27; width=&#x27;342&#x27; height=&#x27;120&#x27; rx=&#x27;18&#x27; fill=&#x27;%23fff&#x27; fill-opacity=&#x27;.3&#x27;/&gt;&lt;rect x=&#x27;24&#x27; y=&#x27;760&#x27; width=&#x27;342&#x27; height=&#x27;52&#x27; rx=&#x27;26&#x27; fill=&#x27;%23fff&#x27; fill-opacity=&#x27;.85&#x27;/&gt;&lt;/svg&gt;" alt="" aria-hidden="true" draggable="false"/><img class="ayy-card__view-image" src="data:image/svg+xml;utf8,&lt;svg xmlns=&#x27;http://www.w3.org/2000/svg&#x27; width=&#x27;390&#x27; height=&#x27;844&#x27; viewBox=&#x27;0 0 390 844&#x27;&gt;&lt;defs&gt;&lt;linearGradient id=&#x27;p&#x27; x1=&#x27;0&#x27; y1=&#x27;0&#x27; x2=&#x27;0&#x27; y2=&#x27;1&#x27;&gt;&lt;stop offset=&#x27;0&#x27; stop-color=&#x27;%230ea5e9&#x27;/&gt;&lt;stop offset=&#x27;1&#x27; stop-color=&#x27;%2310b981&#x27;/&gt;&lt;/linearGradient&gt;&lt;/defs&gt;&lt;rect width=&#x27;390&#x27; height=&#x27;844&#x27; fill=&#x27;url(%23p)&#x27;/&gt;&lt;rect x=&#x27;24&#x27; y=&#x27;72&#x27; width=&#x27;200&#x27; height=&#x27;28&#x27; rx=&#x27;8&#x27; fill=&#x27;%23fff&#x27; fill-opacity=&#x27;.85&#x27;/&gt;&lt;rect x=&#x27;24&#x27; y=&#x27;130&#x27; width=&#x27;342&#x27; height=&#x27;120&#x27; rx=&#x27;18&#x27; fill=&#x27;%23fff&#x27; fill-opacity=&#x27;.3&#x27;/&gt;&lt;rect x=&#x27;24&#x27; y=&#x27;270&#x27; width=&#x27;342&#x27; height=&#x27;120&#x27; rx=&#x27;18&#x27; fill=&#x27;%23fff&#x27; fill-opacity=&#x27;.3&#x27;/&gt;&lt;rect x=&#x27;24&#x27; y=&#x27;410&#x27; width=&#x27;342&#x27; height=&#x27;120&#x27; rx=&#x27;18&#x27; fill=&#x27;%23fff&#x27; fill-opacity=&#x27;.3&#x27;/&gt;&lt;rect x=&#x27;24&#x27; y=&#x27;760&#x27; width=&#x27;342&#x27; height=&#x27;52&#x27; rx=&#x27;26&#x27; fill=&#x27;%23fff&#x27; fill-opacity=&#x27;.85&#x27;/&gt;&lt;/svg&gt;" alt="" draggable="false" width="390" height="844"/></button><div class="ayy-card__view-body"><div class="ayy-card__view-text"><p class="ayy-card__view-title">Onboarding, step 2</p><p class="ayy-card__view-meta">390 × 844 · 1 hour ago</p></div></div><div class="ayy-hover-actions ayy-hover-actions--top-end ayy-hover-actions--group ayy-hover-actions--reveal"><ayy-tooltip class="ayy-tooltip" side="bottom"><button type="button" class="ayy-hover-action" aria-label="Copy"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7.5 14.5C7.5 11.2002 7.5 9.55025 8.52513 8.52513C9.55025 7.5 11.2002 7.5 14.5 7.5C17.7998 7.5 19.4497 7.5 20.4749 8.52513C21.5 9.55025 21.5 11.2002 21.5 14.5C21.5 17.7998 21.5 19.4497 20.4749 20.4749C19.4497 21.5 17.7998 21.5 14.5 21.5C11.2002 21.5 9.55025 21.5 8.52513 20.4749C7.5 19.4497 7.5 17.7998 7.5 14.5Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M7.5 16.5C6.10355 16.5 5.40533 16.5 4.84402 16.3036C3.83866 15.9518 3.0482 15.1613 2.69641 14.156C2.5 13.5947 2.5 12.8964 2.5 11.5V9.5C2.5 6.20017 2.5 4.55025 3.52513 3.52513C4.55025 2.5 6.20017 2.5 9.5 2.5H11.5C12.8964 2.5 13.5947 2.5 14.156 2.69641C15.1613 3.0482 15.9518 3.83866 16.3036 4.84402C16.5 5.40533 16.5 6.10355 16.5 7.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg></button><span class="ayy-tooltip__content" role="tooltip">Copy</span></ayy-tooltip><ayy-tooltip class="ayy-tooltip" side="bottom"><button type="button" class="ayy-hover-action" aria-label="Annotate"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M14.0737 3.88545C14.8189 3.07808 15.1915 2.6744 15.5874 2.43893C16.5427 1.87076 17.7191 1.85309 18.6904 2.39232C19.0929 2.6158 19.4769 3.00812 20.245 3.79276C21.0131 4.5774 21.3972 4.96972 21.6159 5.38093C22.1438 6.37312 22.1265 7.57479 21.5703 8.5507C21.3398 8.95516 20.9446 9.33578 20.1543 10.097L10.7506 19.1543C9.25288 20.5969 8.504 21.3182 7.56806 21.6837C6.63212 22.0493 5.6032 22.0224 3.54536 21.9686L3.26538 21.9613C2.63891 21.9449 2.32567 21.9367 2.14359 21.73C1.9615 21.5234 1.98636 21.2043 2.03608 20.5662L2.06308 20.2197C2.20301 18.4235 2.27297 17.5255 2.62371 16.7182C2.97444 15.9109 3.57944 15.2555 4.78943 13.9445L14.0737 3.88545Z" stroke="currentColor" stroke-linejoin="round" stroke-width="1.5"></path><path d="M13 4L20 11" stroke="currentColor" stroke-linejoin="round" stroke-width="1.5"></path><path d="M14 22L22 22" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg></button><span class="ayy-tooltip__content" role="tooltip">Annotate</span></ayy-tooltip><ayy-tooltip class="ayy-tooltip" side="bottom"><button type="button" class="ayy-hover-action" aria-label="Pin to screen"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M3 21L8 16" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M13.2585 18.8714C9.51516 18.0215 5.97844 14.4848 5.12853 10.7415C4.99399 10.1489 4.92672 9.85266 5.12161 9.37197C5.3165 8.89129 5.55457 8.74255 6.03071 8.44509C7.10705 7.77265 8.27254 7.55888 9.48209 7.66586C11.1793 7.81598 12.0279 7.89104 12.4512 7.67048C12.8746 7.44991 13.1622 6.93417 13.7376 5.90269L14.4664 4.59604C14.9465 3.73528 15.1866 3.3049 15.7513 3.10202C16.316 2.89913 16.6558 3.02199 17.3355 3.26771C18.9249 3.84236 20.1576 5.07505 20.7323 6.66449C20.978 7.34417 21.1009 7.68401 20.898 8.2487C20.6951 8.8134 20.2647 9.05346 19.4039 9.53358L18.0672 10.2792C17.0376 10.8534 16.5229 11.1406 16.3024 11.568C16.0819 11.9955 16.162 12.8256 16.3221 14.4859C16.4399 15.7068 16.2369 16.88 15.5555 17.9697C15.2577 18.4458 15.1088 18.6839 14.6283 18.8786C14.1477 19.0733 13.8513 19.006 13.2585 18.8714Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg></button><span class="ayy-tooltip__content" role="tooltip">Pin to screen</span></ayy-tooltip><ayy-menu><button type="button" class="ayy-button ayy-button--ghost ayy-button--icon-sm" aria-haspopup="menu" aria-label="More actions"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6.00449 12.5V12M18.0045 12.5V12M12.0045 12.5V12M7.00449 12.5C7.00449 11.9477 6.55677 11.5 6.00449 11.5C5.4522 11.5 5.00449 11.9477 5.00449 12.5C5.00449 13.0523 5.4522 13.5 6.00449 13.5C6.55677 13.5 7.00449 13.0523 7.00449 12.5ZM19.0045 12.5C19.0045 11.9477 18.5568 11.5 18.0045 11.5C17.4522 11.5 17.0045 11.9477 17.0045 12.5C17.0045 13.0523 17.4522 13.5 18.0045 13.5C18.5568 13.5 19.0045 13.0523 19.0045 12.5ZM13.0045 12.5C13.0045 11.9477 12.5568 11.5 12.0045 11.5C11.4522 11.5 11.0045 11.9477 11.0045 12.5C11.0045 13.0523 11.4522 13.5 12.0045 13.5C12.5568 13.5 13.0045 13.0523 13.0045 12.5Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg></button><div id="_R_1u_" role="menu" class="ayy-menu" popover="auto"><button type="button" role="menuitem" tabindex="-1" class="ayy-menu__item">Save</button><button type="button" role="menuitem" tabindex="-1" class="ayy-menu__item">Upload</button><button type="button" role="menuitem" tabindex="-1" class="ayy-menu__item">Show in folder</button><div role="separator" class="ayy-menu__separator"></div><button type="button" role="menuitem" tabindex="-1" class="ayy-menu__item ayy-menu__item--destructive">Delete</button></div></ayy-menu></div></div><div class="ayy-card ayy-card--view"><button type="button" class="ayy-card__view-media" aria-label="Play the checkout recording from yesterday"><img class="ayy-card__view-backdrop" src="data:image/svg+xml;utf8,&lt;svg xmlns=&#x27;http://www.w3.org/2000/svg&#x27; width=&#x27;1920&#x27; height=&#x27;1080&#x27; viewBox=&#x27;0 0 1920 1080&#x27;&gt;&lt;defs&gt;&lt;linearGradient id=&#x27;v&#x27; x1=&#x27;0&#x27; y1=&#x27;0&#x27; x2=&#x27;1&#x27; y2=&#x27;0&#x27;&gt;&lt;stop offset=&#x27;0&#x27; stop-color=&#x27;%23f59e0b&#x27;/&gt;&lt;stop offset=&#x27;1&#x27; stop-color=&#x27;%23ef4444&#x27;/&gt;&lt;/linearGradient&gt;&lt;/defs&gt;&lt;rect width=&#x27;1920&#x27; height=&#x27;1080&#x27; fill=&#x27;url(%23v)&#x27;/&gt;&lt;rect x=&#x27;160&#x27; y=&#x27;140&#x27; width=&#x27;1600&#x27; height=&#x27;800&#x27; rx=&#x27;28&#x27; fill=&#x27;%23000&#x27; fill-opacity=&#x27;.18&#x27;/&gt;&lt;circle cx=&#x27;960&#x27; cy=&#x27;540&#x27; r=&#x27;110&#x27; fill=&#x27;%23fff&#x27; fill-opacity=&#x27;.85&#x27;/&gt;&lt;/svg&gt;" alt="" aria-hidden="true" draggable="false"/><img class="ayy-card__view-image" src="data:image/svg+xml;utf8,&lt;svg xmlns=&#x27;http://www.w3.org/2000/svg&#x27; width=&#x27;1920&#x27; height=&#x27;1080&#x27; viewBox=&#x27;0 0 1920 1080&#x27;&gt;&lt;defs&gt;&lt;linearGradient id=&#x27;v&#x27; x1=&#x27;0&#x27; y1=&#x27;0&#x27; x2=&#x27;1&#x27; y2=&#x27;0&#x27;&gt;&lt;stop offset=&#x27;0&#x27; stop-color=&#x27;%23f59e0b&#x27;/&gt;&lt;stop offset=&#x27;1&#x27; stop-color=&#x27;%23ef4444&#x27;/&gt;&lt;/linearGradient&gt;&lt;/defs&gt;&lt;rect width=&#x27;1920&#x27; height=&#x27;1080&#x27; fill=&#x27;url(%23v)&#x27;/&gt;&lt;rect x=&#x27;160&#x27; y=&#x27;140&#x27; width=&#x27;1600&#x27; height=&#x27;800&#x27; rx=&#x27;28&#x27; fill=&#x27;%23000&#x27; fill-opacity=&#x27;.18&#x27;/&gt;&lt;circle cx=&#x27;960&#x27; cy=&#x27;540&#x27; r=&#x27;110&#x27; fill=&#x27;%23fff&#x27; fill-opacity=&#x27;.85&#x27;/&gt;&lt;/svg&gt;" alt="" draggable="false" width="1920" height="1080"/><span class="ayy-card__view-badge"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M2 11C2 7.70017 2 6.05025 3.02513 5.02513C4.05025 4 5.70017 4 9 4H10C13.2998 4 14.9497 4 15.9749 5.02513C17 6.05025 17 7.70017 17 11V13C17 16.2998 17 17.9497 15.9749 18.9749C14.9497 20 13.2998 20 10 20H9C5.70017 20 4.05025 20 3.02513 18.9749C2 17.9497 2 16.2998 2 13V11Z" stroke="currentColor" stroke-width="1.5"></path><path d="M17 8.90585L17.1259 8.80196C19.2417 7.05623 20.2996 6.18336 21.1498 6.60482C22 7.02628 22 8.42355 22 11.2181V12.7819C22 15.5765 22 16.9737 21.1498 17.3952C20.2996 17.8166 19.2417 16.9438 17.1259 15.198L17 15.0941" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path><circle cx="11.5" cy="9.5" r="1.5" stroke="currentColor" stroke-width="1.5"></circle></svg>0:42</span><span class="ayy-card__view-play" aria-hidden="true"><svg class="ayy-icon ayy-icon--sm" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z" stroke="currentColor" stroke-linejoin="round" stroke-width="1.5"></path></svg></span></button><div class="ayy-card__view-body"><div class="ayy-card__view-text"><p class="ayy-card__view-title">Checkout flow</p><p class="ayy-card__view-meta">0:42 · 8.4 MB · Yesterday</p></div><div class="ayy-card__view-badges"><span class="ayy-badge ayy-badge--info">Uploaded</span></div></div><div class="ayy-hover-actions ayy-hover-actions--top-end ayy-hover-actions--group ayy-hover-actions--reveal"><ayy-tooltip class="ayy-tooltip" side="bottom"><button type="button" class="ayy-hover-action" aria-label="Copy file"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7.5 14.5C7.5 11.2002 7.5 9.55025 8.52513 8.52513C9.55025 7.5 11.2002 7.5 14.5 7.5C17.7998 7.5 19.4497 7.5 20.4749 8.52513C21.5 9.55025 21.5 11.2002 21.5 14.5C21.5 17.7998 21.5 19.4497 20.4749 20.4749C19.4497 21.5 17.7998 21.5 14.5 21.5C11.2002 21.5 9.55025 21.5 8.52513 20.4749C7.5 19.4497 7.5 17.7998 7.5 14.5Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M7.5 16.5C6.10355 16.5 5.40533 16.5 4.84402 16.3036C3.83866 15.9518 3.0482 15.1613 2.69641 14.156C2.5 13.5947 2.5 12.8964 2.5 11.5V9.5C2.5 6.20017 2.5 4.55025 3.52513 3.52513C4.55025 2.5 6.20017 2.5 9.5 2.5H11.5C12.8964 2.5 13.5947 2.5 14.156 2.69641C15.1613 3.0482 15.9518 3.83866 16.3036 4.84402C16.5 5.40533 16.5 6.10355 16.5 7.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg></button><span class="ayy-tooltip__content" role="tooltip">Copy file</span></ayy-tooltip><ayy-tooltip class="ayy-tooltip" side="bottom"><button type="button" class="ayy-hover-action" aria-label="Trim"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M21 6C21 7.65685 19.6569 9 18 9C16.3431 9 15 7.65685 15 6C15 4.34315 16.3431 3 18 3C19.6569 3 21 4.34315 21 6Z" stroke="currentColor" stroke-width="1.5"></path><path d="M21 18C21 19.6569 19.6569 21 18 21C16.3431 21 15 19.6569 15 18C15 16.3431 16.3431 15 18 15C19.6569 15 21 16.3431 21 18Z" stroke="currentColor" stroke-width="1.5"></path><path d="M15 8L3 19" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M15.0003 16L11 12" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M3 5.00011L8.5 10" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg></button><span class="ayy-tooltip__content" role="tooltip">Trim</span></ayy-tooltip><ayy-menu><button type="button" class="ayy-button ayy-button--ghost ayy-button--icon-sm" aria-haspopup="menu" aria-label="More actions"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6.00449 12.5V12M18.0045 12.5V12M12.0045 12.5V12M7.00449 12.5C7.00449 11.9477 6.55677 11.5 6.00449 11.5C5.4522 11.5 5.00449 11.9477 5.00449 12.5C5.00449 13.0523 5.4522 13.5 6.00449 13.5C6.55677 13.5 7.00449 13.0523 7.00449 12.5ZM19.0045 12.5C19.0045 11.9477 18.5568 11.5 18.0045 11.5C17.4522 11.5 17.0045 11.9477 17.0045 12.5C17.0045 13.0523 17.4522 13.5 18.0045 13.5C18.5568 13.5 19.0045 13.0523 19.0045 12.5ZM13.0045 12.5C13.0045 11.9477 12.5568 11.5 12.0045 11.5C11.4522 11.5 11.0045 11.9477 11.0045 12.5C11.0045 13.0523 11.4522 13.5 12.0045 13.5C12.5568 13.5 13.0045 13.0523 13.0045 12.5Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg></button><div id="_R_1v_" role="menu" class="ayy-menu" popover="auto"><button type="button" role="menuitem" tabindex="-1" class="ayy-menu__item">Save</button><button type="button" role="menuitem" tabindex="-1" class="ayy-menu__item">Upload</button><button type="button" role="menuitem" tabindex="-1" class="ayy-menu__item">Show in folder</button><div role="separator" class="ayy-menu__separator"></div><button type="button" role="menuitem" tabindex="-1" class="ayy-menu__item ayy-menu__item--destructive">Delete</button></div></ayy-menu></div></div></div>
```

React:

```tsx
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
```

---
Part of @danitesler/ayywi 0.1.2: load `dist/ayywi.min.css` (and `dist/elements.global.js` for the <ayy-*> elements). The rules every screen follows: [llms-full.txt#rules](../llms-full.txt#rules). Every component: [llms.txt](../llms.txt).
