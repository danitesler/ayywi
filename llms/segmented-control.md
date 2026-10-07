# Segmented control

Category: Forms. Pick one of two to five options that change what you see or what you get: a date range, a view, a billing cycle. Native radios drawn as pill segments, like the tabs list.

**Classes**
- `.ayy-segmented-control` — Root, a role="radiogroup" with an aria-label. The pill track.
- `.ayy-segmented-control--sm` — Small height, for toolbars and card headers.
- `.ayy-segmented-control--full` — Fills its container with equal segments.
- `.ayy-segmented-control__option` — A <label> around a native <input type="radio">, which stays in the page (focus, forms) but draws nothing. The checked one is filled; the focused one gets the ring.

**States**
- `default` — A pill track (wash fill, line border); options in text-soft, medium weight.
- `hover` (`.ayy-segmented-control__option:hover`) — Option text turns full text colour.
- `pressed` — doesn't apply: No pressed look; it picks on release.
- `focus` (`.ayy-segmented-control__option:has(> input:focus-visible)`) — 2px ring inset by 2px; on the chosen segment the ring takes the page colour so it shows on the fill.
- `disabled` (`.ayy-segmented-control__option:has(> input:disabled)`) — Option dims to --ayy-opacity-disabled, not-allowed cursor.
- `selected` (`.ayy-segmented-control__option:has(> input:checked)`) — Filled with the text colour, label in the page colour, small shadow. Forced colours: Highlight fill.
- `error` — doesn't apply: One option is always chosen, so there's nothing to be invalid.
- `loading` — doesn't apply: Switching is instant; show loading in the content it controls (a Skeleton).

**Sizes**
- `sm` — Control sm height (28px compact, 32 comfortable, 40 touch), tighter padding, sm text.
- `md` (default) — Control md height (32px compact, 40 comfortable, 44 touch).
- Density — Height and text follow data-density.
- Width — Hugs its options and scrolls sideways when they don't fit. full (ayy-segmented-control--full) fills the container with equal segments.

**JS (framework-free)**: segmentedControlClass({ size?, full?, className? }) → string; segmentedControlOptionClass constant.

**React** — `import { SegmentedControl, SegmentedControlItem } from "ayywi/react";`
- `<SegmentedControl>` renders <div role="radiogroup" class="ayy-segmented-control">. Props: `value / defaultValue` The selected option's value.; `onValueChange` (value: string) => void; `name` Shared radio name, for forms. Generated if omitted.; `size` "sm" | "md"; `full` boolean — equal segments across the container.
- `<SegmentedControlItem>` renders <label class="ayy-segmented-control__option"><input type="radio">…. Props: `value` This option's value.; `disabled` boolean; `inputProps` Props for the native radio.

**Accessibility**
- It's a radio group: give the root an aria-label ("Date range"). Arrow keys move the choice, Tab leaves the group — the browser does it.
- The checked segment is filled and bolder, not only coloured; High Contrast mode fills it with the system highlight.
- An icon-only segment needs text for screen readers: an .ayy-sr-only span or aria-label on the input.

**Do**
- Use a segmented control for two to five mutually exclusive options that apply at once: a date range above a chart, list vs grid, monthly vs yearly.
- Keep labels short and parallel (7 days · 30 days · 90 days).
- Use size sm in a toolbar or card header, and full on a phone when it's the main control of the screen.

**Don't**
- Don't use it to show different panels of content — use Tabs.
- Don't use it for more than five options or long labels — use Select or a Radio group.
- Don't use it for an on/off setting — use Switch.
- Don't use it for navigation between pages — use links.

## Segmented control — Date range and billing cycle

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<div class="ayy-stack" style="inline-size: min(100%, 24rem)">
  <div role="radiogroup" class="ayy-segmented-control" aria-label="Date range">
    <label class="ayy-segmented-control__option"><input type="radio" name="segmented-control-basic-1" value="7d"/>7 days</label>
    <label class="ayy-segmented-control__option"><input type="radio" name="segmented-control-basic-1" checked="" value="30d"/>30 days</label>
    <label class="ayy-segmented-control__option"><input type="radio" name="segmented-control-basic-1" value="90d"/>90 days</label>
  </div>
  <div role="radiogroup" class="ayy-segmented-control ayy-segmented-control--sm" aria-label="View">
    <label class="ayy-segmented-control__option"><input type="radio" name="segmented-control-basic-2" checked="" value="list"/><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M2 11.4C2 10.2417 2.24173 10 3.4 10H20.6C21.7583 10 22 10.2417 22 11.4V12.6C22 13.7583 21.7583 14 20.6 14H3.4C2.24173 14 2 13.7583 2 12.6V11.4Z" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path><path d="M2 3.4C2 2.24173 2.24173 2 3.4 2H20.6C21.7583 2 22 2.24173 22 3.4V4.6C22 5.75827 21.7583 6 20.6 6H3.4C2.24173 6 2 5.75827 2 4.6V3.4Z" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path><path d="M2 19.4C2 18.2417 2.24173 18 3.4 18H20.6C21.7583 18 22 18.2417 22 19.4V20.6C22 21.7583 21.7583 22 20.6 22H3.4C2.24173 22 2 21.7583 2 20.6V19.4Z" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path></svg>List</label>
    <label class="ayy-segmented-control__option"><input type="radio" name="segmented-control-basic-2" value="grid"/><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M3.88884 9.66294C4.39329 10 5.09552 10 6.49998 10C7.90445 10 8.60668 10 9.11113 9.66294C9.32951 9.51702 9.51701 9.32952 9.66292 9.11114C9.99998 8.60669 9.99998 7.90446 9.99998 6.5C9.99998 5.09554 9.99998 4.39331 9.66292 3.88886C9.51701 3.67048 9.32951 3.48298 9.11113 3.33706C8.60668 3 7.90445 3 6.49998 3C5.09552 3 4.39329 3 3.88884 3.33706C3.67046 3.48298 3.48296 3.67048 3.33705 3.88886C2.99998 4.39331 2.99998 5.09554 2.99998 6.5C2.99998 7.90446 2.99998 8.60669 3.33705 9.11114C3.48296 9.32952 3.67046 9.51702 3.88884 9.66294Z" stroke="currentColor" stroke-linejoin="round" stroke-width="1.5"></path><path d="M14.8888 9.66294C15.3933 10 16.0955 10 17.5 10C18.9044 10 19.6067 10 20.1111 9.66294C20.3295 9.51702 20.517 9.32952 20.6629 9.11114C21 8.60669 21 7.90446 21 6.5C21 5.09554 21 4.39331 20.6629 3.88886C20.517 3.67048 20.3295 3.48298 20.1111 3.33706C19.6067 3 18.9044 3 17.5 3C16.0955 3 15.3933 3 14.8888 3.33706C14.6705 3.48298 14.483 3.67048 14.337 3.88886C14 4.39331 14 5.09554 14 6.5C14 7.90446 14 8.60669 14.337 9.11114C14.483 9.32952 14.6705 9.51702 14.8888 9.66294Z" stroke="currentColor" stroke-linejoin="round" stroke-width="1.5"></path><path d="M3.88884 20.6629C4.39329 21 5.09552 21 6.49998 21C7.90445 21 8.60668 21 9.11113 20.6629C9.32951 20.517 9.51701 20.3295 9.66292 20.1111C9.99998 19.6067 9.99998 18.9045 9.99998 17.5C9.99998 16.0955 9.99998 15.3933 9.66292 14.8889C9.51701 14.6705 9.32951 14.483 9.11113 14.3371C8.60668 14 7.90445 14 6.49998 14C5.09552 14 4.39329 14 3.88884 14.3371C3.67046 14.483 3.48296 14.6705 3.33705 14.8889C2.99998 15.3933 2.99998 16.0955 2.99998 17.5C2.99998 18.9045 2.99998 19.6067 3.33705 20.1111C3.48296 20.3295 3.67046 20.517 3.88884 20.6629Z" stroke="currentColor" stroke-linejoin="round" stroke-width="1.5"></path><path d="M14.8888 20.6629C15.3933 21 16.0955 21 17.5 21C18.9044 21 19.6067 21 20.1111 20.6629C20.3295 20.517 20.517 20.3295 20.6629 20.1111C21 19.6067 21 18.9045 21 17.5C21 16.0955 21 15.3933 20.6629 14.8889C20.517 14.6705 20.3295 14.483 20.1111 14.3371C19.6067 14 18.9044 14 17.5 14C16.0955 14 15.3933 14 14.8888 14.3371C14.6705 14.483 14.483 14.6705 14.337 14.8889C14 15.3933 14 16.0955 14 17.5C14 18.9045 14 19.6067 14.337 20.1111C14.483 20.3295 14.6705 20.517 14.8888 20.6629Z" stroke="currentColor" stroke-linejoin="round" stroke-width="1.5"></path></svg>Grid</label>
  </div>
  <div role="radiogroup" class="ayy-segmented-control ayy-segmented-control--full" aria-label="Billing cycle">
    <label class="ayy-segmented-control__option"><input type="radio" name="segmented-control-basic-3" value="monthly"/>Monthly</label>
    <label class="ayy-segmented-control__option"><input type="radio" name="segmented-control-basic-3" checked="" value="yearly"/>Yearly · save 20%</label>
  </div>
</div>
```

React:

```tsx
import { GridViewIcon, ListViewIcon } from "@hugeicons/core-free-icons";
import { Icon, SegmentedControl, SegmentedControlItem } from "ayywi/react";

export default function Example() {
  return (
    <div className="ayy-stack" style={{ inlineSize: "min(100%, 24rem)" }}>
      <SegmentedControl aria-label="Date range" defaultValue="30d">
        <SegmentedControlItem value="7d">7 days</SegmentedControlItem>
        <SegmentedControlItem value="30d">30 days</SegmentedControlItem>
        <SegmentedControlItem value="90d">90 days</SegmentedControlItem>
      </SegmentedControl>
      <SegmentedControl aria-label="View" defaultValue="list" size="sm">
        <SegmentedControlItem value="list">
          <Icon icon={ListViewIcon} />
          List
        </SegmentedControlItem>
        <SegmentedControlItem value="grid">
          <Icon icon={GridViewIcon} />
          Grid
        </SegmentedControlItem>
      </SegmentedControl>
      <SegmentedControl aria-label="Billing cycle" defaultValue="yearly" full>
        <SegmentedControlItem value="monthly">Monthly</SegmentedControlItem>
        <SegmentedControlItem value="yearly">Yearly · save 20%</SegmentedControlItem>
      </SegmentedControl>
    </div>
  );
}
```

---
Part of ayywi 0.4.0: load `dist/ayywi.min.css` (and `dist/elements.global.js` for the <ayy-*> elements). The rules every screen follows: [llms-full.txt#rules](../llms-full.txt#rules). Every component: [llms.txt](../llms.txt).
