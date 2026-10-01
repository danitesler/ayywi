# Skeleton

Category: Feedback. Placeholder shapes shown while content loads, with a subtle shimmer.

**Classes**
- `.ayy-skeleton` — Block placeholder. Set its size to match the content.
- `.ayy-skeleton--text` — Text line (0.75em tall).
- `.ayy-skeleton--circle` — Circle (avatars, icons).

**JS (framework-free)**: skeletonClass({ shape?, className? }) → string

**React** — `import { Skeleton } from "ayywi/react";`
- `<Skeleton>` renders <div aria-hidden="true">. Props: `shape` "block" | "text" | "circle"

**Accessibility**
- Skeletons are aria-hidden. Put aria-busy="true" on the container while loading, and remove it when content arrives. To name the loading region, give it role="status" and an aria-label — aria-label on a plain div is ignored.
- The shimmer stops under prefers-reduced-motion.

**Do**
- Use a skeleton for content that takes more than ~300ms and has a predictable layout (cards, lists, profile headers).
- Match the real layout closely so nothing jumps when content arrives.

**Don't**
- Don't use skeletons for unknown layouts or long jobs — use Progress.
- Don't use skeletons for instant loads — skeletons that flash are worse than nothing.
- Don't show skeletons for errors or empty states.

## Skeleton — Loading card

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<div class="ayy-card" style="inline-size: 20rem" role="status" aria-busy="true" aria-label="Loading project">
  <div class="ayy-card__header">
    <div class="ayy-cluster" style="--ayy-gap: var(--ayy-space-3); flex-wrap: nowrap">
      <div class="ayy-skeleton ayy-skeleton--circle" aria-hidden="true"></div>
      <div class="ayy-stack" style="flex: 1; --ayy-gap: var(--ayy-space-2)">
        <div class="ayy-skeleton ayy-skeleton--text" style="inline-size: 60%" aria-hidden="true"></div>
        <div class="ayy-skeleton ayy-skeleton--text" style="inline-size: 40%" aria-hidden="true"></div>
      </div>
    </div>
  </div>
  <div class="ayy-card__content">
    <div class="ayy-skeleton" style="block-size: 6rem" aria-hidden="true"></div>
  </div>
</div>
```

React:

```tsx
import type { CSSProperties } from "react";
import { Card, CardContent, CardHeader, Skeleton } from "ayywi/react";

export default function Example() {
  return (
    <Card style={{ inlineSize: "20rem" }} role="status" aria-busy="true" aria-label="Loading project">
      <CardHeader>
        <div className="ayy-cluster" style={{ "--ayy-gap": "var(--ayy-space-3)", flexWrap: "nowrap" } as CSSProperties}>
          <Skeleton shape="circle" />
          <div className="ayy-stack" style={{ flex: 1, "--ayy-gap": "var(--ayy-space-2)" } as CSSProperties}>
            <Skeleton shape="text" style={{ inlineSize: "60%" }} />
            <Skeleton shape="text" style={{ inlineSize: "40%" }} />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Skeleton style={{ blockSize: "6rem" }} />
      </CardContent>
    </Card>
  );
}
```

---
Part of ayywi 0.4.0: load `dist/ayywi.min.css` (and `dist/elements.global.js` for the <ayy-*> elements). The rules every screen follows: [llms-full.txt#rules](../llms-full.txt#rules). Every component: [llms.txt](../llms.txt).
