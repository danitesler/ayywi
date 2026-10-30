# Scrollbar

Category: Layout. A thin scrollbar with no track that is drawn in the text colour, so it follows every theme. Put it on any scroll container, or on the page. Also called: scrollbar, scroll-bar, scroller.

**Classes**
- `.ayy-scrollbar` — Root, on the element that scrolls (or <html> for the page). 8px gutter, 4px thumb, transparent track.
- `.ayy-scrollbar--hover` — Thumb is hidden until the pointer or focus is inside the container.

**States**
- `default` — A rounded thumb in the text colour at 22%, on a transparent track.
- `hover` (`The pointer is over the thumb (Chromium and Safari only)`) — Thumb darkens to 40% text. With --hover, the whole thumb appears while the pointer is inside the container.
- `pressed` (`The thumb is being dragged (Chromium and Safari only)`) — Thumb darkens to 55% text.
- `focus` (`Focus is inside the container, with the hover variant`) — The thumb shows, as it does on hover. The scrollbar itself isn't focusable: give the scroll container tabindex="0" so the keyboard can scroll it.
- `disabled` — doesn't apply: A scrollbar can't be disabled; remove overflow instead.
- `selected` — doesn't apply: Nothing to select.
- `error` — doesn't apply: Nothing to validate.
- `loading` — doesn't apply: Nothing loads in a scrollbar.

**Sizes**
- Density — Doesn't follow data-density.
- Width — 8px by default; set --ayy-scrollbar-size on the container for another gutter. The thumb is the gutter minus 4px. Firefox only offers its own thin scrollbar and ignores the size.

**React** — `import { Scrollbar } from "@danitesler/ayywi/react";`
- `<Scrollbar>` renders <div tabindex="0">. Props: `hover` boolean — show the thumb only while the pointer or focus is inside.

**Accessibility**
- Scrolling stays native: wheel, touch, keyboard and assistive technology all work. The component only changes how the bar looks.
- A scroll container that has no focusable content needs tabindex="0" and a label, or keyboard users can't scroll it. The React component sets tabindex="0".
- Forced colours: the thumb is drawn in system colours.

**Do**
- Use the scrollbar on scroll containers inside a page: lists, panels, code, menus.
- Put it on <html> to thin the page's own scrollbar.
- Use the hover variant where the bar would crowd a dense, quiet surface.

**Don't**
- Don't use it to hide scrolling — to hide the bar altogether, give the user another way to scroll.
- Don't use it as a progress indicator — use Progress, or the reading-progress bar.
- Don't make it thicker to match touch targets; touch devices draw their own overlay bars.

## Scrollbar — Always visible and on hover

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<div class="ayy-split" style="--ayy-gap: var(--ayy-space-6)">
  <div class="ayy-scrollbar" tabindex="0" aria-label="Notes" style="max-block-size: 10rem; overflow-y: auto; padding-inline-end: var(--ayy-space-2)">
    <ul class="ayy-stack" style="--ayy-gap: var(--ayy-space-3)">
      <li>Q3 planning notes</li>
      <li>Launch checklist</li>
      <li>Brand review</li>
      <li>Customer interviews</li>
      <li>Roadmap draft</li>
      <li>Pricing experiments</li>
      <li>Onboarding feedback</li>
      <li>Release notes</li>
    </ul>
  </div>
  <div class="ayy-scrollbar ayy-scrollbar--hover" tabindex="0" aria-label="Notes, scrollbar on hover" style="max-block-size: 10rem; overflow-y: auto; padding-inline-end: var(--ayy-space-2)">
    <ul class="ayy-stack" style="--ayy-gap: var(--ayy-space-3)">
      <li>Q3 planning notes</li>
      <li>Launch checklist</li>
      <li>Brand review</li>
      <li>Customer interviews</li>
      <li>Roadmap draft</li>
      <li>Pricing experiments</li>
      <li>Onboarding feedback</li>
      <li>Release notes</li>
    </ul>
  </div>
</div>
```

React:

```tsx
import type { CSSProperties } from "react";
import { Scrollbar } from "@danitesler/ayywi/react";

const scroller = { maxBlockSize: "10rem", overflowY: "auto", paddingInlineEnd: "var(--ayy-space-2)" } as CSSProperties;

const notes = [
  "Q3 planning notes",
  "Launch checklist",
  "Brand review",
  "Customer interviews",
  "Roadmap draft",
  "Pricing experiments",
  "Onboarding feedback",
  "Release notes",
];

export default function Example() {
  return (
    <div className="ayy-split" style={{ "--ayy-gap": "var(--ayy-space-6)" } as CSSProperties}>
      <Scrollbar aria-label="Notes" style={scroller}>
        <ul className="ayy-stack" style={{ "--ayy-gap": "var(--ayy-space-3)" } as CSSProperties}>
          {notes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      </Scrollbar>
      <Scrollbar hover aria-label="Notes, scrollbar on hover" style={scroller}>
        <ul className="ayy-stack" style={{ "--ayy-gap": "var(--ayy-space-3)" } as CSSProperties}>
          {notes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      </Scrollbar>
    </div>
  );
}
```

---
Part of @danitesler/ayywi 0.1.2: load `dist/ayywi.min.css` (and `dist/elements.global.js` for the <ayy-*> elements). The rules every screen follows: [llms-full.txt#rules](../llms-full.txt#rules). Every component: [llms.txt](../llms.txt).
