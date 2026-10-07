# Tooltip

Category: Overlays. Short hint on hover or keyboard focus. Works with CSS alone; with React Tooltip or <ayy-tooltip> it moves to the top layer (never clipped) and flips at screen edges.

**Classes**
- `.ayy-tooltip` — Wrapper around the trigger. Shows the content on :hover and :focus-within.
- `.ayy-tooltip__content` — The bubble (role="tooltip"). Placement via data-side="top|bottom|start|end" (start/end follow text direction).

**States**
- `default` — Hidden. The bubble is a raised surface with a line-strong border and 2xs text.
- `hover` (`.ayy-tooltip:hover`) — The bubble fades and slides in after 200ms.
- `pressed` — doesn't apply: No pressed look; the trigger keeps its own.
- `focus` (`.ayy-tooltip:focus-within`) — The bubble shows at once (no delay) while the trigger has focus.
- `disabled` — doesn't apply: A disabled button gets no focus and shows no tooltip; explain why it's disabled in visible text instead.
- `selected` — doesn't apply: No selected state.
- `error` — doesn't apply: Never put errors in a tooltip; use a FieldError.
- `loading` — doesn't apply: No loading state.
- `dismissed` (`[data-dismissed] (Esc, set by React Tooltip or <ayy-tooltip>)`) — Stays hidden until the pointer and focus leave.

**Sizes**
- Density — Doesn't follow data-density.
- Width — As wide as its text, at most 16rem, then wraps.

**JS (framework-free)**: tooltipClass, tooltipContentClass constants; enhanceTooltip(host) moves the bubble to the top layer and adds Esc (returns cleanup).

**Custom element** `<ayy-tooltip>` (@danitesler/ayywi/elements) — One focusable trigger and a .ayy-tooltip__content bubble. Ids and aria-describedby are wired for you.
- attribute `side`: top | bottom | start | end
- attribute `class`: Put ayy-tooltip on it.

**React** — `import { Tooltip } from "@danitesler/ayywi/react";`
- `<Tooltip>` renders <span class="ayy-tooltip"> + child + <span role="tooltip">. Props: `content` ReactNode (required) — the hint; `side` "top" | "bottom" | "start" | "end"; `children` One focusable element; aria-describedby is added for you

**Accessibility**
- Trigger must be focusable so keyboard users see it too.
- aria-describedby links trigger → tooltip (React does it automatically).
- Esc dismisses (WCAG 1.4.13); the bubble stays open while hovered.

**Do**
- Use a tooltip to name icon-only buttons visually (they still need aria-label) and for short clarifications: shortcuts, truncated values.
- Keep it under ~60 characters.
- Use side="start"/"end", not left/right, so RTL works.
- Inside overflow:hidden containers, use the React component or <ayy-tooltip> — the CSS-only version can be clipped there.

**Don't**
- Don't put essential information in a tooltip — tooltips are invisible on touch devices.
- Don't put interactive content (links, buttons) in a tooltip — use a popover or dialog.
- Don't wrap disabled buttons — they can't receive focus or hover events reliably.

## Tooltip — Sides

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<!-- Works with CSS alone. <ayy-tooltip> (@danitesler/ayywi/elements) adds ids, Esc-to-dismiss and edge-aware placement. -->
<ayy-tooltip class="ayy-tooltip">
  <button type="button" class="ayy-button ayy-button--outline">Top</button>
  <span class="ayy-tooltip__content" role="tooltip">Save changes (⌘S)</span>
</ayy-tooltip>
<ayy-tooltip class="ayy-tooltip" side="bottom">
  <button type="button" class="ayy-button ayy-button--outline">Bottom</button>
  <span class="ayy-tooltip__content" role="tooltip" data-side="bottom">Opens in a new window</span>
</ayy-tooltip>
<ayy-tooltip class="ayy-tooltip" side="start">
  <button type="button" class="ayy-button ayy-button--outline">Start</button>
  <span class="ayy-tooltip__content" role="tooltip" data-side="start">Start side</span>
</ayy-tooltip>
<ayy-tooltip class="ayy-tooltip" side="end">
  <button type="button" class="ayy-button ayy-button--outline">End</button>
  <span class="ayy-tooltip__content" role="tooltip" data-side="end">End side</span>
</ayy-tooltip>
```

React:

```tsx
import { Button, Tooltip } from "@danitesler/ayywi/react";

export default function Example() {
  return (
    <>
      <Tooltip content="Save changes (⌘S)">
        <Button variant="outline">Top</Button>
      </Tooltip>
      <Tooltip content="Opens in a new window" side="bottom">
        <Button variant="outline">Bottom</Button>
      </Tooltip>
      <Tooltip content="Start side" side="start">
        <Button variant="outline">Start</Button>
      </Tooltip>
      <Tooltip content="End side" side="end">
        <Button variant="outline">End</Button>
      </Tooltip>
    </>
  );
}
```

---
Part of @danitesler/ayywi 0.0.1: load `dist/ayywi.min.css` (and `dist/elements.global.js` for the <ayy-*> elements). The rules every screen follows: [llms-full.txt#rules](../llms-full.txt#rules). Every component: [llms.txt](../llms.txt).
