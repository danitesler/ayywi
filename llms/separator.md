# Separator

Category: Layout. A hairline between blocks: full, fading out at both ends (between page sections), or vertical (between inline items).

**Classes**
- `.ayy-separator` — Root, on an <hr>. 1px hairline, no margins (spacing belongs to the layout).
- `.ayy-separator--vertical` — Vertical rule in a flex row; add aria-orientation="vertical".
- `.ayy-separator--fade` — Fades to transparent at both ends.

**States**
- `default` — A 1px hairline across its container (vertical: down the row).
- `hover` — doesn't apply: Decorative.
- `pressed` — doesn't apply: Decorative.
- `focus` — doesn't apply: Decorative.
- `disabled` — doesn't apply: Decorative.
- `selected` — doesn't apply: Decorative.
- `error` — doesn't apply: Decorative.
- `loading` — doesn't apply: Decorative.

**Sizes**
- Density — Doesn't follow data-density.
- Width — Horizontal fills the width; vertical stretches to the row's height (at least 1em). fade fades both ends.

**JS (framework-free)**: separatorClass({ orientation?, fade?, className? }) → string

**React** — `import { Separator } from "ayywi/react";`
- `<Separator>` renders <hr>. Props: `orientation` "horizontal" | "vertical" — vertical also sets aria-orientation.; `fade` boolean

**Accessibility**
- <hr> is a separator to screen readers. If the line is purely decorative, use role="presentation" or a CSS border instead.
- Vertical separators need aria-orientation="vertical" (the React component adds it).

**Do**
- Use a fading separator between the sections of a long page.
- Use a plain or vertical separator between groups in a footer, toolbar or card.
- Give the separator room with the layout's gap or the sections' padding.

**Don't**
- Don't put one around every block — spacing usually separates better than lines.
- Don't use it inside menus — use the menu's own separator.
- Don't colour it; hairline keeps it quiet in every theme.

## Separator — Plain, fading and vertical

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<div class="ayy-stack" style="inline-size: 100%; --ayy-gap: var(--ayy-space-6)">
  <hr class="ayy-separator" />
  <hr class="ayy-separator ayy-separator--fade" />
  <div class="ayy-cluster" style="--ayy-gap: var(--ayy-space-4)">
    <span>Web</span>
    <hr class="ayy-separator ayy-separator--vertical" aria-orientation="vertical" />
    <span>Mobile web</span>
    <hr class="ayy-separator ayy-separator--vertical" aria-orientation="vertical" />
    <span>Email</span>
  </div>
</div>
```

React:

```tsx
import type { CSSProperties } from "react";
import { Separator } from "ayywi/react";

export default function Example() {
  return (
    <div className="ayy-stack" style={{ inlineSize: "100%", "--ayy-gap": "var(--ayy-space-6)" } as CSSProperties}>
      <Separator />
      <Separator fade />
      <div className="ayy-cluster" style={{ "--ayy-gap": "var(--ayy-space-4)" } as CSSProperties}>
        <span>Web</span>
        <Separator orientation="vertical" />
        <span>Mobile web</span>
        <Separator orientation="vertical" />
        <span>Email</span>
      </div>
    </div>
  );
}
```

---
Part of ayywi 0.4.0: load `dist/ayywi.min.css` (and `dist/elements.global.js` for the <ayy-*> elements). The rules every screen follows: [llms-full.txt#rules](../llms-full.txt#rules). Every component: [llms.txt](../llms.txt).
