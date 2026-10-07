# Spinner

Category: Feedback. An indeterminate loading ring in the text colour, sized like an icon. For short waits on a small area or inside a button; Skeleton covers content that's loading. Also called: spinner, loader, throbber, loading-ring.

**Classes**
- `.ayy-spinner` — The ring, 1.25em (matches an icon beside text), in the current text colour. Spins; stops still under reduced motion.
- `.ayy-spinner--sm` — 16px (--ayy-size-icon-sm).
- `.ayy-spinner--lg` — 32px (--ayy-size-icon-xl), for a panel that's loading.

**JS (framework-free)**: spinnerClass({ size?, className? }) → string. Buttons: add aria-busy="true" and put an aria-hidden .ayy-spinner first inside (React: <Button loading>).

**React** — `import { Spinner } from "@danitesler/ayywi/react";`
- `<Spinner>` renders <span class="ayy-spinner" role="status" aria-label="Loading">. Props: `size` "sm" | "md" | "lg"; `label` What's loading, for screen readers. Default "Loading" (translate it). "" makes it decorative (aria-hidden) when nearby text already says it.

**Accessibility**
- A spinner on its own is a role="status" with an aria-label that says what's loading ("Loading invoices").
- Inside a button, hide it (aria-hidden) and set aria-busy="true" on the button; the button's text still names it.
- Mark the region that's refreshing with aria-busy="true" until the new content is in.
- Under reduced motion it stops as a still ring; the label and aria-busy still say it's working.

**Do**
- Use a spinner for waits under a few seconds on a small area: a button that's saving, a panel refreshing, a lazy menu.
- Put it inside the button that started the work (<Button loading>), not somewhere else on the page.
- Pair a large spinner with a line of text when the wait may be longer ("Importing 2,400 contacts…").

**Don't**
- Don't use a spinner for a page or list that's loading — use Skeleton shapes of the content.
- Don't use it when you know how far along the work is — use Progress.
- Don't show several spinners at once; load the region as one.
- Don't disable a loading button; aria-busy keeps it focusable and <Button loading> ignores repeat clicks.

## Spinner — Sizes and a loading button

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<div class="ayy-stack" style="--ayy-gap: var(--ayy-space-5)">
  <div class="ayy-cluster" style="--ayy-gap: var(--ayy-space-5)">
    <span class="ayy-spinner ayy-spinner--sm" role="status" aria-label="Loading comments"></span>
    <span class="ayy-spinner" role="status" aria-label="Loading invoices"></span>
    <span class="ayy-spinner ayy-spinner--lg" role="status" aria-label="Loading report"></span>
  </div>
  <div class="ayy-cluster">
    <button type="button" class="ayy-button" aria-busy="true"><span class="ayy-spinner" aria-hidden="true"></span>Saving…</button>
    <button type="button" class="ayy-button ayy-button--outline" aria-busy="true"><span class="ayy-spinner" aria-hidden="true"></span>Refreshing</button>
  </div>
</div>
```

React:

```tsx
import type { CSSProperties } from "react";
import { Button, Spinner } from "@danitesler/ayywi/react";

export default function Example() {
  return (
    <div className="ayy-stack" style={{ "--ayy-gap": "var(--ayy-space-5)" } as CSSProperties}>
      <div className="ayy-cluster" style={{ "--ayy-gap": "var(--ayy-space-5)" } as CSSProperties}>
        <Spinner size="sm" label="Loading comments" />
        <Spinner label="Loading invoices" />
        <Spinner size="lg" label="Loading report" />
      </div>
      <div className="ayy-cluster">
        <Button loading>Saving…</Button>
        <Button variant="outline" loading>
          Refreshing
        </Button>
      </div>
    </div>
  );
}
```

---
Part of @danitesler/ayywi 0.0.1: load `dist/ayywi.min.css` (and `dist/elements.global.js` for the <ayy-*> elements). The rules every screen follows: [llms-full.txt#rules](../llms-full.txt#rules). Every component: [llms.txt](../llms.txt).
