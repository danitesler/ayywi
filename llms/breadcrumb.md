# Breadcrumb

Category: Navigation. Trail from the top level down to the current page (Home / Case studies / Oktopost). Plain, or a blurred pill for heroes.

**Classes**
- `.ayy-breadcrumb` — Root <nav aria-label="Breadcrumb">.
- `.ayy-breadcrumb--pill` — Bordered, blurred capsule that stays readable over hero images and grids.
- `.ayy-breadcrumb__list` — The <ol>.
- `.ayy-breadcrumb__item` — Each <li>. A slash separates items; screen readers skip it.
- `.ayy-breadcrumb__link` — Link to an ancestor page. The last item is a <span aria-current="page"> instead.

**JS (framework-free)**: breadcrumbClass({ pill?, className? }) → string; breadcrumbListClass, breadcrumbItemClass, breadcrumbLinkClass constants.

**React** — `import { Breadcrumb } from "ayywi/react";`
- `<Breadcrumb>` renders <nav aria-label="Breadcrumb"><ol>…. Props: `items` { label: ReactNode; href?: string }[] — top level first; the last one is the current page.; `pill` boolean; `aria-label` Defaults to "Breadcrumb" (translate it).

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
import { Breadcrumb } from "ayywi/react";

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

---
Part of ayywi 0.4.0: load `dist/ayywi.min.css` (and `dist/elements.global.js` for the <ayy-*> elements). The rules every screen follows: [llms-full.txt#rules](../llms-full.txt#rules). Every component: [llms.txt](../llms.txt).
