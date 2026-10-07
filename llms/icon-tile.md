# Icon tile

Category: Data display. An app-icon squircle lit from below by the content's accent, with an SVG glyph in that accent. For products, plugins and services.

**Classes**
- `.ayy-icon-tile` — Root, usually a <span> around one <svg> drawn in currentColor. 48px. Accent from --ayy-spot.
- `.ayy-icon-tile--sm` — 32px.
- `.ayy-icon-tile--lg` — 64px.

**States**
- `default` — A dark squircle lit from below by --ayy-spot, with the glyph in that accent and a 1px line inset.
- `hover` — doesn't apply: Decorative.
- `pressed` — doesn't apply: Decorative.
- `focus` — doesn't apply: Not focusable.
- `disabled` — doesn't apply: Decorative.
- `selected` — doesn't apply: Decorative.
- `error` — doesn't apply: No error state.
- `loading` — doesn't apply: No loading state.

**Sizes**
- `sm` — 32px, lg radius.
- `md` (default) — 48px, xl radius.
- `lg` — 64px, 2xl radius.
- Density — Doesn't follow data-density.
- Width — Square; the glyph is 55% of it.

**JS (framework-free)**: iconTileClass({ size?, className? }) → string

**React** — `import { IconTile } from "@danitesler/ayywi/react";`
- `<IconTile>` renders <span class="ayy-icon-tile">. Props: `size` "sm" | "md" | "lg"; `spotColor` CSS colour for the glow and glyph, e.g. "var(--ayy-accent-system)". Else inherits --ayy-spot.; `aria-label` Makes the tile an image with this name; without it the tile is aria-hidden.

**Accessibility**
- Usually decorative next to the product's name: aria-hidden="true" (React does this unless you pass aria-label).
- Standing alone, give it role="img" and an aria-label.

**Do**
- Use an icon tile for the icon of a product, plugin, platform or service in a card or list row.
- Draw glyphs in currentColor so they take the accent; brand marks with their own colours can keep them.
- Use one accent per product and reuse it wherever that product appears.

**Don't**
- Don't use it for people — use Avatar.
- Don't use it for icons inside buttons or text — use a plain Icon.
- Don't put text or numbers in the tile.

## Icon tile — Accents and sizes

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<span class="ayy-icon-tile ayy-icon-tile--lg" style="--ayy-spot: var(--ayy-accent-brand)" aria-hidden="true">
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9" /><path d="M5 7c4 1 9 5 11 13M3 13c5-2 11-2 17 1M9 3.5c3 3 5 6 6 8" /></svg>
</span>
<span class="ayy-icon-tile" style="--ayy-spot: var(--ayy-accent-system)" aria-hidden="true">
  <svg viewBox="0 0 24 24" fill="currentColor"><rect x="4" y="4" width="7" height="7" rx="2" /><rect x="13" y="4" width="7" height="7" rx="2" /><rect x="4" y="13" width="7" height="7" rx="2" /><circle cx="16.5" cy="16.5" r="3.5" /></svg>
</span>
<span class="ayy-icon-tile ayy-icon-tile--sm" style="--ayy-spot: var(--ayy-accent-marketing)" role="img" aria-label="Autogrid">
  <svg viewBox="0 0 24 24" fill="currentColor"><rect x="4" y="4" width="7" height="7" rx="1.5" /><rect x="13" y="4" width="7" height="7" rx="1.5" /><rect x="4" y="13" width="7" height="7" rx="1.5" /><rect x="13" y="13" width="7" height="7" rx="1.5" /></svg>
</span>
```

React:

```tsx
import { IconTile } from "@danitesler/ayywi/react";

export default function Example() {
  return (
    <>
      <IconTile size="lg" spotColor="var(--ayy-accent-brand)">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="12" cy="12" r="9" />
          <path d="M5 7c4 1 9 5 11 13M3 13c5-2 11-2 17 1M9 3.5c3 3 5 6 6 8" />
        </svg>
      </IconTile>
      <IconTile spotColor="var(--ayy-accent-system)">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <rect x="4" y="4" width="7" height="7" rx="2" />
          <rect x="13" y="4" width="7" height="7" rx="2" />
          <rect x="4" y="13" width="7" height="7" rx="2" />
          <circle cx="16.5" cy="16.5" r="3.5" />
        </svg>
      </IconTile>
      <IconTile size="sm" spotColor="var(--ayy-accent-marketing)" aria-label="Autogrid">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <rect x="4" y="4" width="7" height="7" rx="1.5" />
          <rect x="13" y="4" width="7" height="7" rx="1.5" />
          <rect x="4" y="13" width="7" height="7" rx="1.5" />
          <rect x="13" y="13" width="7" height="7" rx="1.5" />
        </svg>
      </IconTile>
    </>
  );
}
```

---
Part of @danitesler/ayywi 0.0.1: load `dist/ayywi.min.css` (and `dist/elements.global.js` for the <ayy-*> elements). The rules every screen follows: [llms-full.txt#rules](../llms-full.txt#rules). Every component: [llms.txt](../llms.txt).
