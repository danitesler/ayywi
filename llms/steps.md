# Steps

Category: Navigation. Where you are in a short flow (sign-up, checkout, import): numbered steps with the current one filled, the done ones ticked and the rest waiting. Pure CSS: aria-current="step" is the only state.

**Classes**
- `.ayy-steps` — Root <ol>, a row of steps with lines between them. Numbers come from a CSS counter.
- `.ayy-steps--vertical` — A column, with the lines running down between the markers: for a side panel or a phone.
- `.ayy-steps__item` — A step <li>. aria-current="step" marks the current one (filled marker, bold label); every step before it is drawn as done (tick, solid line); the ones after as to do.
- `.ayy-steps__label` — The step's name, one line (cut with an ellipsis in the row).

**States**
- `default` — To do: a muted number in a line-strong circle with a line to the next step.
- `hover` — doesn't apply: Steps are status, not links.
- `pressed` — doesn't apply: Not interactive.
- `focus` — doesn't apply: Not focusable.
- `disabled` — doesn't apply: Steps after the current one already read as to do.
- `selected` (`[aria-current="step"]`) — Current: marker filled with the text colour, semibold label. Steps before it are done: a tick in a text-colour circle and a solid line. Forced colours: Highlight marker.
- `error` — doesn't apply: No error look; put the problem in the step's content (Alert, FieldError).
- `loading` — doesn't apply: No loading look.

**Sizes**
- Density — Markers are the sm control height (28px compact, 32 comfortable, 40 touch).
- Width — Fills its container. In a row narrower than 36rem only the current step keeps a visible label; vertical stacks them for a side panel or phone.

**JS (framework-free)**: stepsClass({ vertical?, className? }) → string; stepsItemClass, stepsLabelClass constants.

**React** — `import { Steps } from "@danitesler/ayywi/react";`
- `<Steps>` renders <ol class="ayy-steps"> of <li class="ayy-steps__item">. Props: `steps` ReactNode[] — the step names, in order.; `current` Index of the current step (0-based).; `vertical` boolean — a column.; `doneLabel` Read before a finished step's name. Default "Done: " (translate it).

**Accessibility**
- It's an ordered list with aria-current="step" on the current item, so screen readers hear "step 2 of 4, current". Give the <ol> an aria-label ("Checkout progress").
- Done steps say so in text, not only with a tick: put an .ayy-sr-only "Done: " before their label (React does it).
- The markers are generated content with empty alt text, so numbers aren't read twice.

**Do**
- Use steps above a multi-page form or wizard with three to five steps, so people know how much is left.
- Name steps by what happens in them (Account, Team, Billing), in one or two words.
- Use the vertical version beside a long form on wide screens, or when the row wouldn't fit a phone.

**Don't**
- Don't use steps for page navigation or for switching views — use Tabs or links.
- Don't use them for a single form — a Progress bar or nothing at all reads better.
- Don't use them for pages of results — use Pagination.
- Don't make more than about five; split the flow instead.

## Steps — Checkout, row and column

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<div class="ayy-stack" style="inline-size: min(100%, 36rem); --ayy-gap: var(--ayy-space-8)">
  <ol class="ayy-steps" aria-label="Checkout progress">
    <li class="ayy-steps__item"><span class="ayy-steps__label"><span class="ayy-sr-only">Done: </span>Cart</span></li>
    <li class="ayy-steps__item"><span class="ayy-steps__label"><span class="ayy-sr-only">Done: </span>Shipping</span></li>
    <li class="ayy-steps__item" aria-current="step"><span class="ayy-steps__label">Payment</span></li>
    <li class="ayy-steps__item"><span class="ayy-steps__label">Review</span></li>
  </ol>
  <ol class="ayy-steps ayy-steps--vertical" aria-label="Setup progress">
    <li class="ayy-steps__item"><span class="ayy-steps__label"><span class="ayy-sr-only">Done: </span>Create your account</span></li>
    <li class="ayy-steps__item" aria-current="step"><span class="ayy-steps__label">Invite your team</span></li>
    <li class="ayy-steps__item"><span class="ayy-steps__label">Connect your data</span></li>
  </ol>
</div>
```

React:

```tsx
import type { CSSProperties } from "react";
import { Steps } from "@danitesler/ayywi/react";

const STEPS = ["Cart", "Shipping", "Payment", "Review"];

export default function Example() {
  return (
    <div className="ayy-stack" style={{ inlineSize: "min(100%, 36rem)", "--ayy-gap": "var(--ayy-space-8)" } as CSSProperties}>
      <Steps steps={STEPS} current={2} aria-label="Checkout progress" />
      <Steps steps={["Create your account", "Invite your team", "Connect your data"]} current={1} vertical aria-label="Setup progress" />
    </div>
  );
}
```

---
Part of @danitesler/ayywi 0.0.1: load `dist/ayywi.min.css` (and `dist/elements.global.js` for the <ayy-*> elements). The rules every screen follows: [llms-full.txt#rules](../llms-full.txt#rules). Every component: [llms.txt](../llms.txt).
