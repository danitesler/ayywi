# Breadcrumb

Category: Navigation. A trail of links that shows where the current page sits in the site, from the top level down. It lets people jump back to any page above it. Also called: breadcrumb, breadcrumbs, crumbs.

**Classes**
- `.ayy-breadcrumb` — Root <nav aria-label="Breadcrumb">.
- `.ayy-breadcrumb--sm` — Small trail: --ayy-text-xs.
- `.ayy-breadcrumb--lg` — Large trail: --ayy-text-md.
- `.ayy-breadcrumb--pill` — Bordered, blurred capsule that stays readable over hero images and grids.
- `.ayy-breadcrumb__list` — The <ol>. Wraps on wide screens; one line on phones, ancestors cut with an ellipsis first.
- `.ayy-breadcrumb__item` — Each <li>. A slash separates items; screen readers skip it.
- `.ayy-breadcrumb__link` — Link to an ancestor page; its target is a small control tall (40px at touch density) without changing the line. The last item is a <span aria-current="page"> instead.

**States**
- `default` — Muted sm links separated by line-hover slashes; the last item (the current page) in text colour.
- `hover` (`.ayy-breadcrumb__link:hover`) — Link turns text colour.
- `pressed` — doesn't apply: No pressed look.
- `focus` (`.ayy-breadcrumb__link:focus-visible`) — 2px ring, 2px offset.
- `disabled` — doesn't apply: Every ancestor is a link; the current page is plain text, not a disabled link.
- `selected` (`[aria-current="page"] on the last item`) — Text colour, cut with an ellipsis when long. Forced colours: underlined.
- `error` — doesn't apply: No error state.
- `loading` — doesn't apply: No loading state.

**Sizes**
- `sm` — --ayy-text-xs (13px).
- `md` (default) — --ayy-text-sm (14px).
- `lg` — --ayy-text-md (16px).
- Density — Text sizes are fixed at every density; link targets grow to a control tall.
- Width — Hugs its items and wraps. pill puts it in a blurred, bordered capsule for heroes.

**React** — `import { Breadcrumb } from "@danitesler/ayywi/react";`
- `<Breadcrumb>` renders <nav aria-label="Breadcrumb"><ol>…. Props: `size` "sm" | "md" | "lg" — the text size of the trail.; `items` { label: ReactNode; href?: string }[] — top level first; the last one is the current page.; `pill` boolean; `aria-label` Defaults to "Breadcrumb" (translate it).

**Accessibility**
- Wrap it in <nav aria-label="Breadcrumb"> and use an <ol>, so it's announced as an ordered path.
- The current page is plain text with aria-current="page", not a link to itself.

**Do**
- Use a breadcrumb on pages that sit two or more levels deep: an index page, a case study, an article.
- Use the page titles as they appear in their own headings.
- Use pill over imagery or the ambient grid; plain elsewhere.

**Don't**
- Don't add one to the home page or a single-level site.
- Don't use it for steps in a process — use Steps; a breadcrumb is a location, not progress.
- Don't include the current page as a link.
- Don't use it as the only navigation.

## Breadcrumb — Plain and pill

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<nav class="ayy-breadcrumb" aria-label="Breadcrumb">
  <ol class="ayy-breadcrumb__list">
    <li class="ayy-breadcrumb__item"><a class="ayy-breadcrumb__link" href="#home">Home</a></li>
    <li class="ayy-breadcrumb__item"><a class="ayy-breadcrumb__link" href="#work">Case studies</a></li>
    <li class="ayy-breadcrumb__item"><span aria-current="page">Oktopost</span></li>
  </ol>
</nav>
<nav class="ayy-breadcrumb ayy-breadcrumb--pill" aria-label="Breadcrumb, pill">
  <ol class="ayy-breadcrumb__list">
    <li class="ayy-breadcrumb__item"><a class="ayy-breadcrumb__link" href="#home">Home</a></li>
    <li class="ayy-breadcrumb__item"><span aria-current="page">My projects</span></li>
  </ol>
</nav>
```

React:

```tsx
import { Breadcrumb } from "@danitesler/ayywi/react";

export default function Example() {
  return (
    <>
      <Breadcrumb
        items={[
          { label: "Home", href: "#home" },
          { label: "Case studies", href: "#work" },
          { label: "Oktopost" },
        ]}
      />
      <Breadcrumb pill aria-label="Breadcrumb, pill" items={[{ label: "Home", href: "#home" }, { label: "My projects" }]} />
    </>
  );
}
```

## Breadcrumb — Sizes

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<div class="ayy-stack">
  <nav class="ayy-breadcrumb ayy-breadcrumb--sm" aria-label="Breadcrumb, small">
    <ol class="ayy-breadcrumb__list">
      <li class="ayy-breadcrumb__item"><a class="ayy-breadcrumb__link" href="#home">Home</a></li>
      <li class="ayy-breadcrumb__item"><a class="ayy-breadcrumb__link" href="#work">Case studies</a></li>
      <li class="ayy-breadcrumb__item"><span aria-current="page">Oktopost</span></li>
    </ol>
  </nav>
  <nav class="ayy-breadcrumb" aria-label="Breadcrumb, medium">
    <ol class="ayy-breadcrumb__list">
      <li class="ayy-breadcrumb__item"><a class="ayy-breadcrumb__link" href="#home">Home</a></li>
      <li class="ayy-breadcrumb__item"><a class="ayy-breadcrumb__link" href="#work">Case studies</a></li>
      <li class="ayy-breadcrumb__item"><span aria-current="page">Oktopost</span></li>
    </ol>
  </nav>
  <nav class="ayy-breadcrumb ayy-breadcrumb--lg" aria-label="Breadcrumb, large">
    <ol class="ayy-breadcrumb__list">
      <li class="ayy-breadcrumb__item"><a class="ayy-breadcrumb__link" href="#home">Home</a></li>
      <li class="ayy-breadcrumb__item"><a class="ayy-breadcrumb__link" href="#work">Case studies</a></li>
      <li class="ayy-breadcrumb__item"><span aria-current="page">Oktopost</span></li>
    </ol>
  </nav>
</div>
```

React:

```tsx
import { Breadcrumb } from "@danitesler/ayywi/react";

const ITEMS = [{ label: "Home", href: "#home" }, { label: "Case studies", href: "#work" }, { label: "Oktopost" }];

export default function Example() {
  return (
    <div className="ayy-stack">
      <Breadcrumb size="sm" aria-label="Breadcrumb, small" items={ITEMS} />
      <Breadcrumb aria-label="Breadcrumb, medium" items={ITEMS} />
      <Breadcrumb size="lg" aria-label="Breadcrumb, large" items={ITEMS} />
    </div>
  );
}
```

---
Part of @danitesler/ayywi 0.1.2: load `dist/ayywi.min.css` (and `dist/elements.global.js` for the <ayy-*> elements). The rules every screen follows: [llms-full.txt#rules](../llms-full.txt#rules). Every component: [llms.txt](../llms.txt).
