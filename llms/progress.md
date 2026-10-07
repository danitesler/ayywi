# Progress

Category: Feedback. Thin progress bar. Determinate (--ayy-value 0–100) or indeterminate. Also called: progress, progress-bar, progressbar, meter.

**Classes**
- `.ayy-progress` — Track. Set --ayy-value (0–100) on it.
- `.ayy-progress__bar` — Fill (only child).
- `.ayy-progress--sm` — 4px tall.
- `.ayy-progress--lg` — 10px tall.
- `.ayy-progress--success` — Green fill.
- `.ayy-progress--warning` — Amber fill.
- `.ayy-progress--destructive` — Red fill.
- `.ayy-progress--ai` — Purple fill.
- `.ayy-progress--indeterminate` — Looping animation; omit aria-valuenow.

**States**
- `default` — A 6px pill track in a 10% text tint, filled in the text colour from the inline start to --ayy-value %.
- `hover` — doesn't apply: Not interactive.
- `pressed` — doesn't apply: Not interactive.
- `focus` — doesn't apply: Not focusable.
- `disabled` — doesn't apply: Not interactive; at 0 it's an empty track.
- `selected` — doesn't apply: The value is the state (--ayy-value, aria-valuenow).
- `error` (`destructive (ayy-progress--destructive)`) — Red fill: a failed upload or an over-limit quota. Say why in text next to it.
- `loading` (`.ayy-progress--indeterminate without aria-valuenow`) — A 40% bar slides along the track, unknown duration (RTL reverses it).

**Sizes**
- `sm` — 4px track.
- `md` (default) — 6px track.
- `lg` — 10px track.
- Density — Doesn't follow data-density.
- Width — Fills its container.

**JS (framework-free)**: progressClass({ variant?, size?, indeterminate?, className? }) → string (tone is a deprecated alias of variant)

**React** — `import { Progress } from "@danitesler/ayywi/react";`
- `<Progress>` renders <div role="progressbar">. Props: `value` number 0–100; omit/null → indeterminate; `variant` "default" | "success" | "warning" | "destructive" | "ai" — the same prop name as Alert and Badge; `tone` Deprecated alias of variant.; `size` "sm" | "md" | "lg"

**Accessibility**
- role="progressbar" with aria-valuenow/min/max (React sets them).
- Give it an accessible name: aria-label or aria-labelledby.

**Do**
- Use a progress bar when you know how far along something is: an upload, an import, a quota, a goal.
- Use indeterminate for work of unknown length that takes more than ~1s.
- Show the percentage or step as text nearby for anything longer than a few seconds.
- For quotas or meters that aren't progress, the look still works — set role="meter" instead of progressbar.

**Don't**
- Don't use a progress bar for a short wait of unknown length on a small area — use a Spinner (or <Button loading>).
- Don't use it for content that's loading — use Skeleton shapes.
- Don't use it for the steps of a flow — use Steps.
- Don't animate a determinate bar backwards.

## Progress — Values, tones, indeterminate

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<div class="ayy-stack" style="inline-size: min(100%, 22.5rem)">
  <div class="ayy-progress" role="progressbar" aria-label="Build progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="30" style="--ayy-value: 30">
    <div class="ayy-progress__bar"></div>
  </div>
  <div class="ayy-progress ayy-progress--success" role="progressbar" aria-label="Upload progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="72" style="--ayy-value: 72">
    <div class="ayy-progress__bar"></div>
  </div>
  <div class="ayy-progress ayy-progress--warning ayy-progress--lg" role="progressbar" aria-label="Storage used" aria-valuemin="0" aria-valuemax="100" aria-valuenow="90" style="--ayy-value: 90">
    <div class="ayy-progress__bar"></div>
  </div>
  <div class="ayy-progress ayy-progress--ai ayy-progress--sm ayy-progress--indeterminate" role="progressbar" aria-label="Generating">
    <div class="ayy-progress__bar"></div>
  </div>
</div>
```

React:

```tsx
import { Progress } from "@danitesler/ayywi/react";

export default function Example() {
  return (
    <div className="ayy-stack" style={{ inlineSize: "min(100%, 22.5rem)" }}>
      <Progress value={30} aria-label="Build progress" />
      <Progress value={72} variant="success" aria-label="Upload progress" />
      <Progress value={90} variant="warning" size="lg" aria-label="Storage used" />
      <Progress variant="ai" size="sm" aria-label="Generating" />
    </div>
  );
}
```

---
Part of @danitesler/ayywi 0.0.1: load `dist/ayywi.min.css` (and `dist/elements.global.js` for the <ayy-*> elements). The rules every screen follows: [llms-full.txt#rules](../llms-full.txt#rules). Every component: [llms.txt](../llms.txt).
