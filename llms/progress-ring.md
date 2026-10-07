# Progress ring

Category: Feedback. Progress as a ring that fills clockwise from the top: a focus timer, a daily goal, a habit's week, a small upload next to a file name. Determinate (--ayy-value 0–100) or indeterminate, with an optional value, time or icon in the middle. Also called: progress-ring, circular-progress, progress-circle, radial-progress, ring-progress, timer-ring.

**Classes**
- `.ayy-progress-ring` — Root: role="progressbar" with aria-valuenow/min/max, an accessible name and --ayy-value (0–100). Clockwise from the top in every direction, like a clock. 2.5rem.
- `.ayy-progress-ring__svg` — First child: <svg viewBox="0 0 36 36" aria-hidden="true"> holding the track and the bar circles (cx=18 cy=18 r=16 pathLength=100). progressRingSvg is the markup.
- `.ayy-progress-ring__track` — The full circle behind the fill.
- `.ayy-progress-ring__bar` — The fill: a round-capped arc as long as --ayy-value. Hidden at aria-valuenow="0".
- `.ayy-progress-ring__label` — Optional, in the middle: the value ("3/5"), a time, or an Icon. Scales with the ring; leave it out at sm.
- `.ayy-progress-ring--sm` — 1.25rem, next to a line of text.
- `.ayy-progress-ring--lg` — 4rem.
- `.ayy-progress-ring--xl` — Up to 16rem (70% of a phone's width): a timer.
- `.ayy-progress-ring--success` — Green fill.
- `.ayy-progress-ring--warning` — Amber fill.
- `.ayy-progress-ring--destructive` — Red fill.
- `.ayy-progress-ring--ai` — Purple fill.
- `.ayy-progress-ring--indeterminate` — A quarter arc going round (still under reduced motion); omit aria-valuenow and --ayy-value.

**States**
- `default` — A 10% text-colour track and a round-capped arc in the text colour, starting at the top and running clockwise to --ayy-value.
- `hover` — doesn't apply: Not interactive. Wrap it in a button if it starts or pauses something.
- `pressed` — doesn't apply: Not interactive.
- `focus` — doesn't apply: Not focusable; it's a progressbar that screen readers read. Put focus on the control next to it.
- `disabled` — doesn't apply: Not interactive. A paused timer stays at its value; say "Paused" in the label.
- `selected` — doesn't apply: Not selectable.
- `error` (`variant destructive`) — The arc turns the destructive colour. Say what failed next to it, not only with colour.
- `loading` (`indeterminate (ayy-progress-ring--indeterminate), no aria-valuenow`) — A quarter arc spins; under reduced motion it stays still, so say what's happening in a label.
- `empty` (`aria-valuenow="0"`) — Only the track shows: no dot of arc at 0.

**Sizes**
- `sm` — 20px, a thicker stroke: next to a file name or in a list row.
- `md` (default) — 40px: a goal or a habit's day.
- `lg` — 64px: a card's main figure.
- `xl` — min(16rem, 70vw), a thin stroke and a lighter label: a focus timer's whole screen.
- Density — Doesn't change with data-density; pick a size.
- Width — Square at its size; the label in the middle scales with it.

**JS (framework-free)**: progressRingClass({ variant?, size?, indeterminate?, className? }) → string; progressRingSvg (the SVG markup to put first inside the ring); progressRingSizes. The fill colour can be overridden with --ayy-progress-color, as on Progress.

**React** — `import { ProgressRing } from "@danitesler/ayywi/react";`
- `<ProgressRing>` renders <div role="progressbar" class="ayy-progress-ring"><svg class="ayy-progress-ring__svg">…</svg><span class="ayy-progress-ring__label">{children}</span></div>. Props: `value` number 0–100; omit/null → indeterminate; `variant` "default" | "success" | "warning" | "destructive" | "ai" — as on Progress; `size` "sm" | "md" | "lg" | "xl"

**Accessibility**
- role="progressbar" with aria-valuenow/min/max (React sets them). Give it a name with aria-label or aria-labelledby.
- What the label in the middle says isn't read (a progressbar's content is presentational): put it in the name too ("Habit: 3 of 5 days this week").
- The fill is drawn with the system highlight in High Contrast, the track in GrayText.

**Do**
- Use a ring where a circle means something or a bar has no room: a timer, a daily goal, a habit's week, a file's upload in a list row.
- Put the number or time in the middle at md and up; next to the ring at sm.
- Use success when a goal is reached, with a tick in the middle.

**Don't**
- Don't use a ring for a long task's progress across a page — a Progress bar reads more precisely.
- Don't use an indeterminate ring where a Spinner fits (a button, a small area).
- Don't nest rings for several values; use a Chart.

## Progress ring — A timer, a goal, inline

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<div class="ayy-cluster" style="align-items: center; gap: 2rem">
  <div role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="28" class="ayy-progress-ring ayy-progress-ring--xl" style="--ayy-value: 28" aria-label="Focus session, 18 minutes left"><svg class="ayy-progress-ring__svg" viewBox="0 0 36 36" aria-hidden="true"><circle class="ayy-progress-ring__track" cx="18" cy="18" r="16" pathLength="100"></circle><circle class="ayy-progress-ring__bar" cx="18" cy="18" r="16" pathLength="100"></circle></svg><span class="ayy-progress-ring__label">18:00</span></div>
  <div class="ayy-stack" style="align-items: start">
    <div role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="60" class="ayy-progress-ring ayy-progress-ring--lg" style="--ayy-value: 60" aria-label="Habit: 3 of 5 days this week"><svg class="ayy-progress-ring__svg" viewBox="0 0 36 36" aria-hidden="true"><circle class="ayy-progress-ring__track" cx="18" cy="18" r="16" pathLength="100"></circle><circle class="ayy-progress-ring__bar" cx="18" cy="18" r="16" pathLength="100"></circle></svg><span class="ayy-progress-ring__label">3/5</span></div>
    <div role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="100" class="ayy-progress-ring ayy-progress-ring--success ayy-progress-ring--lg" style="--ayy-value: 100" aria-label="Goal reached"><svg class="ayy-progress-ring__svg" viewBox="0 0 36 36" aria-hidden="true"><circle class="ayy-progress-ring__track" cx="18" cy="18" r="16" pathLength="100"></circle><circle class="ayy-progress-ring__bar" cx="18" cy="18" r="16" pathLength="100"></circle></svg><span class="ayy-progress-ring__label"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 14L8.5 17.5L19 6.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg></span></div>
    <div class="ayy-cluster" style="align-items: center">
      <div role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="40" class="ayy-progress-ring ayy-progress-ring--sm" style="--ayy-value: 40" aria-labelledby="ring-upload-html"><svg class="ayy-progress-ring__svg" viewBox="0 0 36 36" aria-hidden="true"><circle class="ayy-progress-ring__track" cx="18" cy="18" r="16" pathLength="100"></circle><circle class="ayy-progress-ring__bar" cx="18" cy="18" r="16" pathLength="100"></circle></svg></div>
      <span id="ring-upload-html">Uploading 2 of 5</span>
    </div>
    <div class="ayy-cluster" style="align-items: center">
      <div role="progressbar" aria-valuemin="0" aria-valuemax="100" class="ayy-progress-ring ayy-progress-ring--ai ayy-progress-ring--sm ayy-progress-ring--indeterminate" aria-labelledby="ring-ai-html"><svg class="ayy-progress-ring__svg" viewBox="0 0 36 36" aria-hidden="true"><circle class="ayy-progress-ring__track" cx="18" cy="18" r="16" pathLength="100"></circle><circle class="ayy-progress-ring__bar" cx="18" cy="18" r="16" pathLength="100"></circle></svg></div>
      <span id="ring-ai-html">Recognising text</span>
    </div>
  </div>
</div>
```

React:

```tsx
import { Tick02Icon } from "@hugeicons/core-free-icons";
import { Icon, ProgressRing } from "@danitesler/ayywi/react";

export default function Example() {
  return (
    <div className="ayy-cluster" style={{ alignItems: "center", gap: "2rem" }}>
      <ProgressRing value={28} size="xl" aria-label="Focus session, 18 minutes left">
        18:00
      </ProgressRing>
      <div className="ayy-stack" style={{ alignItems: "start" }}>
        <ProgressRing value={60} size="lg" aria-label="Habit: 3 of 5 days this week">
          3/5
        </ProgressRing>
        <ProgressRing value={100} size="lg" variant="success" aria-label="Goal reached">
          <Icon icon={Tick02Icon} />
        </ProgressRing>
        <div className="ayy-cluster" style={{ alignItems: "center" }}>
          <ProgressRing value={40} size="sm" aria-labelledby="ring-upload" />
          <span id="ring-upload">Uploading 2 of 5</span>
        </div>
        <div className="ayy-cluster" style={{ alignItems: "center" }}>
          <ProgressRing size="sm" variant="ai" aria-labelledby="ring-ai" />
          <span id="ring-ai">Recognising text</span>
        </div>
      </div>
    </div>
  );
}
```

---
Part of @danitesler/ayywi 0.0.1: load `dist/ayywi.min.css` (and `dist/elements.global.js` for the <ayy-*> elements). The rules every screen follows: [llms-full.txt#rules](../llms-full.txt#rules). Every component: [llms.txt](../llms.txt).
