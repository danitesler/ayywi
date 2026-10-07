# Card

Category: Layout. Surface that groups related content. Flat at rest with an inset top highlight; optional lift and pointer-following spotlight.

**Classes**
- `.ayy-card` — Root surface.
- `.ayy-card--interactive` — Lifts on hover. Use when the whole card is clickable.
- `.ayy-card--spotlight` — Pointer-following glow + lit border. Colour via the --ayy-spot custom property.
- `.ayy-card--featured` — The one to pick: the recommended plan in a pricing grid, or the option someone chose. A 2px border in the text colour (High Contrast: a highlight outline). One per group.
- `.ayy-card__header` — Top block (title + description).
- `.ayy-card__title` — Heading. Use an h2–h4 that fits your outline.
- `.ayy-card__description` — Muted supporting text.
- `.ayy-card__content` — Body.
- `.ayy-card__footer` — Actions row, pinned to the bottom.
- `.ayy-card__media` — Edge-to-edge image, screenshot or video. Rounds the card corners it touches (first or last child); zooms slightly on an interactive card's hover.
- `.ayy-card__link` — Put on the title's <a>: it stretches over the whole card, so the card is one link and one tab stop. Other links and buttons inside stay clickable.

**JS (framework-free)**: cardClass({ interactive?, spotlight?, featured?, className? }) → string; trackSpotlight(pointerEvent) sets --ayy-mx/--ayy-my

**React** — `import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, CardMedia, CardLink } from "@danitesler/ayywi/react";`
- `<Card>` renders <div>. Props: `interactive` boolean; `spotlight` boolean — tracks the pointer for you; `spotColor` CSS colour for the spotlight, e.g. "var(--ayy-accent-product)"; `featured` boolean — the recommended or chosen card (ayy-card--featured).
- `<CardHeader>` renders <div>.
- `<CardTitle>` renders <h3>.
- `<CardDescription>` renders <p>.
- `<CardContent>` renders <div>.
- `<CardFooter>` renders <div>.
- `<CardMedia>` renders <div>. Props: `children` An <img>, <picture>, <video> or <svg>. Give images width and height.
- `<CardLink>` renders <a class="ayy-card__link">. Props: `...rest` All native <a> attributes (href…).

**Accessibility**
- If the whole card is a link, put ayy-card__link on the title's <a> — don't wrap the card in <a>. Screen readers then announce just the title, not the whole card.
- Media images are content: give them alt text, or alt="" when the title already says it all.
- Spotlight layers are pseudo-elements, invisible to assistive tech.

**Do**
- Use a card to group a unit of content: a project, a person, a plan, a stat.
- Add interactive for clickable tiles in a grid.
- Use accent tokens (--ayy-accent-*) as spotColor to tie a card to a category.
- Keep one level of cards; use hairline dividers inside.
- Mark the recommended plan in a pricing grid with featured (and a Badge that says why), not a coloured background.

**Don't**
- Don't wrap page sections in a card — use plain layout.
- Don't nest cards inside cards.
- Don't set background colours on cards; the surface token keeps both themes correct.
- Don't use spotlight on dense lists — it's for showcase grids.

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
  <article class="ayy-card ayy-card--interactive ayy-card--spotlight" style="--ayy-spot: var(--ayy-accent-product)">
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
  </article>
  <article class="ayy-card ayy-card--interactive ayy-card--spotlight" style="--ayy-spot: var(--ayy-accent-research)">
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
  </article>
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

---
Part of @danitesler/ayywi 0.0.1: load `dist/ayywi.min.css` (and `dist/elements.global.js` for the <ayy-*> elements). The rules every screen follows: [llms-full.txt#rules](../llms-full.txt#rules). Every component: [llms.txt](../llms.txt).
