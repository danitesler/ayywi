# Icon tile

Category: Data display. An app-icon squircle lit from below by the content's accent, with an SVG glyph in that accent. For products, plugins and services. Also called: icon-tile, app-icon.

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
  <svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5"/><path d="M8 12C8 18 12 22 12 22C12 22 16 18 16 12C16 6 12 2 12 2C12 2 8 6 8 12Z" stroke="currentColor" stroke-linejoin="round" stroke-width="1.5"/><path d="M21 15H3" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/><path d="M21 9H3" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/></svg>
</span>
<span class="ayy-icon-tile" style="--ayy-spot: var(--ayy-accent-system)" aria-hidden="true">
  <svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M8.64298 3.14559L6.93816 3.93362C4.31272 5.14719 3 5.75397 3 6.75C3 7.74603 4.31272 8.35281 6.93817 9.56638L8.64298 10.3544C10.2952 11.1181 11.1214 11.5 12 11.5C12.8786 11.5 13.7048 11.1181 15.357 10.3544L17.0618 9.56638C19.6873 8.35281 21 7.74603 21 6.75C21 5.75397 19.6873 5.14719 17.0618 3.93362L15.357 3.14559C13.7048 2.38186 12.8786 2 12 2C11.1214 2 10.2952 2.38186 8.64298 3.14559Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/><path d="M20.788 11.0972C20.9293 11.2959 21 11.5031 21 11.7309C21 12.7127 19.6873 13.3109 17.0618 14.5072L15.357 15.284C13.7048 16.0368 12.8786 16.4133 12 16.4133C11.1214 16.4133 10.2952 16.0368 8.64298 15.284L6.93817 14.5072C4.31272 13.3109 3 12.7127 3 11.7309C3 11.5031 3.07067 11.2959 3.212 11.0972" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/><path d="M20.3767 16.2661C20.7922 16.5971 21 16.927 21 17.3176C21 18.2995 19.6873 18.8976 17.0618 20.0939L15.357 20.8707C13.7048 21.6236 12.8786 22 12 22C11.1214 22 10.2952 21.6236 8.64298 20.8707L6.93817 20.0939C4.31272 18.8976 3 18.2995 3 17.3176C3 16.927 3.20778 16.5971 3.62334 16.2661" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/></svg>
</span>
<span class="ayy-icon-tile ayy-icon-tile--sm" style="--ayy-spot: var(--ayy-accent-marketing)" role="img" aria-label="Autogrid">
  <svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M3.88884 9.66294C4.39329 10 5.09552 10 6.49998 10C7.90445 10 8.60668 10 9.11113 9.66294C9.32951 9.51702 9.51701 9.32952 9.66292 9.11114C9.99998 8.60669 9.99998 7.90446 9.99998 6.5C9.99998 5.09554 9.99998 4.39331 9.66292 3.88886C9.51701 3.67048 9.32951 3.48298 9.11113 3.33706C8.60668 3 7.90445 3 6.49998 3C5.09552 3 4.39329 3 3.88884 3.33706C3.67046 3.48298 3.48296 3.67048 3.33705 3.88886C2.99998 4.39331 2.99998 5.09554 2.99998 6.5C2.99998 7.90446 2.99998 8.60669 3.33705 9.11114C3.48296 9.32952 3.67046 9.51702 3.88884 9.66294Z" stroke="currentColor" stroke-linejoin="round" stroke-width="1.5"/><path d="M14.8888 9.66294C15.3933 10 16.0955 10 17.5 10C18.9044 10 19.6067 10 20.1111 9.66294C20.3295 9.51702 20.517 9.32952 20.6629 9.11114C21 8.60669 21 7.90446 21 6.5C21 5.09554 21 4.39331 20.6629 3.88886C20.517 3.67048 20.3295 3.48298 20.1111 3.33706C19.6067 3 18.9044 3 17.5 3C16.0955 3 15.3933 3 14.8888 3.33706C14.6705 3.48298 14.483 3.67048 14.337 3.88886C14 4.39331 14 5.09554 14 6.5C14 7.90446 14 8.60669 14.337 9.11114C14.483 9.32952 14.6705 9.51702 14.8888 9.66294Z" stroke="currentColor" stroke-linejoin="round" stroke-width="1.5"/><path d="M3.88884 20.6629C4.39329 21 5.09552 21 6.49998 21C7.90445 21 8.60668 21 9.11113 20.6629C9.32951 20.517 9.51701 20.3295 9.66292 20.1111C9.99998 19.6067 9.99998 18.9045 9.99998 17.5C9.99998 16.0955 9.99998 15.3933 9.66292 14.8889C9.51701 14.6705 9.32951 14.483 9.11113 14.3371C8.60668 14 7.90445 14 6.49998 14C5.09552 14 4.39329 14 3.88884 14.3371C3.67046 14.483 3.48296 14.6705 3.33705 14.8889C2.99998 15.3933 2.99998 16.0955 2.99998 17.5C2.99998 18.9045 2.99998 19.6067 3.33705 20.1111C3.48296 20.3295 3.67046 20.517 3.88884 20.6629Z" stroke="currentColor" stroke-linejoin="round" stroke-width="1.5"/><path d="M14.8888 20.6629C15.3933 21 16.0955 21 17.5 21C18.9044 21 19.6067 21 20.1111 20.6629C20.3295 20.517 20.517 20.3295 20.6629 20.1111C21 19.6067 21 18.9045 21 17.5C21 16.0955 21 15.3933 20.6629 14.8889C20.517 14.6705 20.3295 14.483 20.1111 14.3371C19.6067 14 18.9044 14 17.5 14C16.0955 14 15.3933 14 14.8888 14.3371C14.6705 14.483 14.483 14.6705 14.337 14.8889C14 15.3933 14 16.0955 14 17.5C14 18.9045 14 19.6067 14.337 20.1111C14.483 20.3295 14.6705 20.517 14.8888 20.6629Z" stroke="currentColor" stroke-linejoin="round" stroke-width="1.5"/></svg>
</span>
```

React:

```tsx
import { Icon, IconTile } from "@danitesler/ayywi/react";
import { Globe02Icon, GridViewIcon, Layers01Icon } from "@hugeicons/core-free-icons";

export default function Example() {
  return (
    <>
      <IconTile size="lg" spotColor="var(--ayy-accent-brand)">
        <Icon icon={Globe02Icon} />
      </IconTile>
      <IconTile spotColor="var(--ayy-accent-system)">
        <Icon icon={Layers01Icon} />
      </IconTile>
      <IconTile size="sm" spotColor="var(--ayy-accent-marketing)" aria-label="Autogrid">
        <Icon icon={GridViewIcon} />
      </IconTile>
    </>
  );
}
```

---
Part of @danitesler/ayywi 0.1.0: load `dist/ayywi.min.css` (and `dist/elements.global.js` for the <ayy-*> elements). The rules every screen follows: [llms-full.txt#rules](../llms-full.txt#rules). Every component: [llms.txt](../llms.txt).
