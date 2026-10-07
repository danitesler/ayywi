# Badge

Category: Data display. Small pill label for status, category or count. Optional pulsing status dot.

**Classes**
- `.ayy-badge` — Root. Neutral by default.
- `.ayy-badge--muted` — Quieter neutral.
- `.ayy-badge--outline` — Border only.
- `.ayy-badge--success` — Positive status.
- `.ayy-badge--warning` — Caution status.
- `.ayy-badge--destructive` — Error / failed.
- `.ayy-badge--info` — Informational.
- `.ayy-badge--ai` — AI-related.
- `.ayy-badge__dot` — Leading status dot (first child). Pulses. Colour follows the variant, or set --ayy-dot.
- `.ayy-badge__dot--static` — Dot without the pulse.

**JS (framework-free)**: badgeClass({ variant?, className? }) → string

**React** — `import { Badge } from "@danitesler/ayywi/react";`
- `<Badge>` renders <span>. Props: `variant` "default" | "muted" | "outline" | "success" | "warning" | "destructive" | "info" | "ai"; `dot` boolean | "pulse" | "static" — leading status dot

**Accessibility**
- Colour is never the only signal — the label text must say the status.
- The dot is aria-hidden; it's decorative.

**Do**
- Use a badge for the status of an item (Synced, Error, Beta), a category or tag next to a title, or a live indicator (dot).
- Keep labels to one or two words.
- Use the status variants for status, accent spotlights for categories.

**Don't**
- Don't make a badge clickable — use Button (ghost/outline, sm).
- Don't put long text in a badge — badges never wrap.
- Don't stack more than three badges in a row.
- Don't put buttons inside badges.

## Badge — Variants

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<span class="ayy-badge">Default</span>
<span class="ayy-badge ayy-badge--muted">Muted</span>
<span class="ayy-badge ayy-badge--outline">Outline</span>
<span class="ayy-badge ayy-badge--success">Synced</span>
<span class="ayy-badge ayy-badge--warning">Pending</span>
<span class="ayy-badge ayy-badge--destructive">Failed</span>
<span class="ayy-badge ayy-badge--info">Info</span>
<span class="ayy-badge ayy-badge--ai">AI</span>
```

React:

```tsx
import { Badge } from "@danitesler/ayywi/react";

export default function Example() {
  return (
    <>
      <Badge>Default</Badge>
      <Badge variant="muted">Muted</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="success">Synced</Badge>
      <Badge variant="warning">Pending</Badge>
      <Badge variant="destructive">Failed</Badge>
      <Badge variant="info">Info</Badge>
      <Badge variant="ai">AI</Badge>
    </>
  );
}
```

## Badge — Status dot

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<span class="ayy-badge"><span class="ayy-badge__dot" aria-hidden="true"></span>Live</span>
<span class="ayy-badge ayy-badge--warning"><span class="ayy-badge__dot" aria-hidden="true"></span>Syncing</span>
<span class="ayy-badge ayy-badge--destructive"><span class="ayy-badge__dot ayy-badge__dot--static" aria-hidden="true"></span>Offline</span>
<span class="ayy-badge ayy-badge--muted" style="--ayy-dot: var(--ayy-accent-brand)"><span class="ayy-badge__dot ayy-badge__dot--static" aria-hidden="true"></span>Custom dot</span>
```

React:

```tsx
import type { CSSProperties } from "react";
import { Badge } from "@danitesler/ayywi/react";

export default function Example() {
  return (
    <>
      <Badge dot>Live</Badge>
      <Badge variant="warning" dot>
        Syncing
      </Badge>
      <Badge variant="destructive" dot="static">
        Offline
      </Badge>
      <Badge variant="muted" dot="static" style={{ "--ayy-dot": "var(--ayy-accent-brand)" } as CSSProperties}>
        Custom dot
      </Badge>
    </>
  );
}
```

---
Part of @danitesler/ayywi 0.0.1: load `dist/ayywi.min.css` (and `dist/elements.global.js` for the <ayy-*> elements). The rules every screen follows: [llms-full.txt#rules](../llms-full.txt#rules). Every component: [llms.txt](../llms.txt).
