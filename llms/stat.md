# Stat

Category: Data display. A headline number in the heading font, with a muted unit beside it and a short label: downloads, views, results. Also called: stat, metric, kpi, stat-card.

**Classes**
- `.ayy-stat` — Root.
- `.ayy-stat--sm` — Smaller number (28px instead of 48px), for rows of several stats or inside cards.
- `.ayy-stat__value` — The number, pre-formatted ("4.2k"). Tabular figures.
- `.ayy-stat__unit` — Muted word after the number, inside the value.
- `.ayy-stat__label` — Short context, above or below the value.

**JS (framework-free)**: statClass({ size?, className? }) → string; statValueClass, statUnitClass, statLabelClass constants.

**React** — `import { Stat } from "@danitesler/ayywi/react";`
- `<Stat>` renders <div class="ayy-stat">. Props: `value` ReactNode (required) — the formatted number.; `unit` ReactNode; `label` ReactNode; `labelFirst` boolean — label above the number.; `size` "md" | "sm"

**Accessibility**
- Write abbreviations the way they should be read, or add the full number: <span aria-hidden="true">200k</span><span class="ayy-sr-only">200,000</span>.
- Keep the unit as text, not only an icon.

**Do**
- Use a stat to show a result or reach at a glance: "200k downloads", "+34% conversion".
- Line several up with .ayy-grid or .ayy-cluster for the key numbers in a case study or dashboard header.
- Format the number before it gets here (4.2k, 87%).

**Don't**
- Don't use stats for tables of numbers — use Table.
- Don't use a stat for progress towards a goal — use Progress.
- Don't colour the number to mean good or bad without saying so in words.

## Stat — Row of stats

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<div class="ayy-grid" style="--ayy-min: 10rem; inline-size: 100%">
  <div class="ayy-stat">
    <p class="ayy-stat__label">On Dribbble since 2017</p>
    <p class="ayy-stat__value">373k<span class="ayy-stat__unit">Views</span></p>
  </div>
  <div class="ayy-stat">
    <p class="ayy-stat__label">Figma Community resources</p>
    <p class="ayy-stat__value">200k<span class="ayy-stat__unit">Downloads</span></p>
  </div>
  <div class="ayy-stat ayy-stat--sm">
    <p class="ayy-stat__label">Playnite extensions</p>
    <p class="ayy-stat__value">4.2k<span class="ayy-stat__unit">Downloads</span></p>
  </div>
</div>
```

React:

```tsx
import type { CSSProperties } from "react";
import { Stat } from "@danitesler/ayywi/react";

export default function Example() {
  return (
    <div className="ayy-grid" style={{ "--ayy-min": "10rem", inlineSize: "100%" } as CSSProperties}>
      <Stat labelFirst label="On Dribbble since 2017" value="373k" unit="Views" />
      <Stat labelFirst label="Figma Community resources" value="200k" unit="Downloads" />
      <Stat labelFirst size="sm" label="Playnite extensions" value="4.2k" unit="Downloads" />
    </div>
  );
}
```

---
Part of @danitesler/ayywi 0.0.1: load `dist/ayywi.min.css` (and `dist/elements.global.js` for the <ayy-*> elements). The rules every screen follows: [llms-full.txt#rules](../llms-full.txt#rules). Every component: [llms.txt](../llms.txt).
