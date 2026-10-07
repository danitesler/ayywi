# Pagination

Category: Navigation. Previous, page numbers with gaps, and next, for a long table or list. On phones only previous, the current page and next stay. Also called: pagination, pager.

**Classes**
- `.ayy-pagination` — Root <nav aria-label="Pagination">. A wrapping row.
- `.ayy-pagination__link` — A page: <a href> when pages have URLs, <button> otherwise. aria-current="page" marks the current one (outlined tint, heavier). aria-disabled="true" (a link without href) or disabled dims an end you can't go past.
- `.ayy-pagination__link--step` — Previous / next, with an arrow Icon (directional) and a word. Stays visible on phones, where the numbers hide.
- `.ayy-pagination__ellipsis` — The "…" for skipped pages, aria-hidden.

**States**
- `default` — Muted pill links at the sm control height, in tabular figures; previous and next carry an arrow and a word.
- `hover` (`.ayy-pagination__link:hover`) — Wash fill, text colour.
- `pressed` — doesn't apply: No pressed look.
- `focus` (`.ayy-pagination__link:focus-visible`) — 2px ring, 2px offset.
- `disabled` (`:disabled or [aria-disabled="true"] (a link without href at the first or last page)`) — --ayy-opacity-disabled, ignores the pointer. Forced colours: GrayText.
- `selected` (`[aria-current="page"]`) — Line-strong border, wash-hover fill, text colour, semibold. Forced colours: Highlight.
- `error` — doesn't apply: No error state.
- `loading` — doesn't apply: Show the loading in the list or table it pages (Skeleton rows), not here.

**Sizes**
- Density — Links are the sm control height (28px compact, 32 comfortable, 40 touch) with sm control text.
- Width — Hugs its links and wraps. Below 48rem only previous, the current page and next show.

**JS (framework-free)**: paginationClass, paginationEllipsisClass constants; paginationLinkClass({ step?, className? }) → string; paginationRange(page, count, siblings = 1) → (number | "…")[] — which pages to show, always the same number of slots.

**React** — `import { Pagination } from "@danitesler/ayywi/react";`
- `<Pagination>` renders <nav class="ayy-pagination"> with previous, pages from paginationRange() and next. Props: `page` The current page, 1-based.; `count` How many pages there are.; `siblings` Pages either side of the current one. Default 1.; `href` (page) => string — pages become links (?page=3).; `onPageChange` (page) => void — without href, pages become buttons; with it, links still work and the handler runs instead of navigating.; `labels` { nav?, previous?, next? } — text for translation. Defaults "Pagination", "Previous", "Next".

**Accessibility**
- It's a <nav aria-label="Pagination">: give a second one on the page a different label.
- The current page has aria-current="page"; it's outlined and bolder as well as tinted.
- Previous and next say so in words; their arrows are decorative and mirror in right-to-left text.
- An end you can't go past is aria-disabled (or disabled): screen readers hear it's unavailable.
- After a page change in place, move focus to the top of the updated table or list, or announce the new range.

**Do**
- Use pagination under a table or list that has more rows than fit, when people need to reach a specific page or share its URL.
- Give pages URLs (href) when you can, so back and reload work.
- Show the range next to it ("41–60 of 1,280") in muted text.

**Don't**
- Don't use pagination for a feed people only scroll through — load more as they scroll, or add a Load more button.
- Don't use it to step through a sign-up or checkout — use Steps.
- Don't show it when everything fits on one page.

## Pagination — Under a table

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<div class="ayy-spread" style="inline-size: 100%">
  <p class="ayy-muted">41–60 of 1,280 invoices</p>
  <nav class="ayy-pagination" aria-label="Pagination">
    <a class="ayy-pagination__link ayy-pagination__link--step" href="?page=2" rel="prev"><svg class="ayy-icon ayy-icon--directional" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M15 6C15 6 9.00001 10.4189 9 12C8.99999 13.5812 15 18 15 18" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg>Previous</a>
    <a class="ayy-pagination__link" href="?page=1">1</a>
    <a class="ayy-pagination__link" href="?page=2">2</a>
    <a class="ayy-pagination__link" aria-current="page" href="?page=3">3</a>
    <a class="ayy-pagination__link" href="?page=4">4</a>
    <a class="ayy-pagination__link" href="?page=5">5</a>
    <span class="ayy-pagination__ellipsis" aria-hidden="true">…</span>
    <a class="ayy-pagination__link" href="?page=64">64</a>
    <a class="ayy-pagination__link ayy-pagination__link--step" href="?page=4" rel="next">Next<svg class="ayy-icon ayy-icon--directional" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M9.00005 6C9.00005 6 15 10.4189 15 12C15 13.5812 9 18 9 18" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg></a>
  </nav>
</div>
```

React:

```tsx
import { Pagination } from "@danitesler/ayywi/react";

export default function Example() {
  return (
    <div className="ayy-spread" style={{ inlineSize: "100%" }}>
      <p className="ayy-muted">41–60 of 1,280 invoices</p>
      <Pagination page={3} count={64} href={(page) => `?page=${page}`} />
    </div>
  );
}
```

---
Part of @danitesler/ayywi 0.0.1: load `dist/ayywi.min.css` (and `dist/elements.global.js` for the <ayy-*> elements). The rules every screen follows: [llms-full.txt#rules](../llms-full.txt#rules). Every component: [llms.txt](../llms.txt).
