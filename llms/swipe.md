# Swipe actions

Category: Data display. A list row that slides sideways to show buttons underneath, as in phone mail and task apps: swipe toward the end for Done, toward the start for Snooze or Delete. Works with touch, pen and mouse, follows the reading direction, and keyboards reach the buttons with Tab.

**Classes**
- `.ayy-swipe` — The row: clips its content and holds the trays. Vertical drags still scroll the page (touch-action: pan-y).
- `.ayy-swipe__content` — What slides: the row's own content (often with .ayy-list__item). Opaque, with --ayy-swipe-bg (default the page colour) so the trays stay hidden under it.
- `.ayy-swipe__actions` — A tray of buttons under the row, after the content in the DOM. Shows over the row while it holds keyboard focus.
- `.ayy-swipe__actions--start` — At the inline start: revealed by swiping toward the inline end (right in English). One positive action (Done, Read).
- `.ayy-swipe__actions--end` — At the inline end: revealed by swiping toward the inline start. Up to three (Pin, Snooze, Delete), the destructive one last.
- `.ayy-swipe__action` — A <button> filling the tray's height: an icon over a short label, on a tint of its colour.
- `.ayy-swipe__action--primary` — Solid primary fill.
- `.ayy-swipe__action--success` — Green tint (Done).
- `.ayy-swipe__action--warning` — Amber tint (Snooze).
- `.ayy-swipe__action--info` — Blue tint (Move, Label).
- `.ayy-swipe__action--destructive` — Red tint (Delete).

**States**
- `default` — The row as it is; its trays are hidden underneath until it slides.
- `hover` — doesn't apply: No hover look; swiping works with a mouse too, and Tab reaches the buttons.
- `pressed` — doesn't apply: No pressed look on the actions; they run at once.
- `focus` (`.ayy-swipe__action:focus-visible; .ayy-swipe__actions:has(:focus-visible)`) — Tabbing into a tray shows it over the row, and the action gets a ring inside its edge.
- `disabled` — doesn't apply: Don't offer an action that can't run; leave it out of the tray.
- `selected` — doesn't apply: Rows select through the list they're in (aria-selected on the item), not through the swipe.
- `error` — doesn't apply: If an action fails, close the tray and say so in a toast.
- `loading` — doesn't apply: Actions run at once (optimistic); undo through the toast.
- `open` (`[data-open="start"] or [data-open="end"], set by the script`) — The row has slid to show the start tray (swiped toward the inline end) or the end tray.
- `dragging` (`[data-dragging]`) — The row follows the finger with no transition.

**Sizes**
- Density — Actions are at least 4.5rem wide and as tall as the row; the row keeps its own density.
- Width — Fills the list's width, like the row it wraps.

**JS (framework-free)**: connectSwipe(row, { onOpenChange? }) → { open(side), close(), destroy() } wires the gesture on plain markup: drag past half a tray to keep it open; a tap on the row, a tap elsewhere, Esc or an action closes it. swipeActionClass({ variant? }); swipeActionVariants.

**Custom element** `<ayy-swipe>` (@danitesler/ayywi/elements) — 
- event `ayy-open-change`: { side } — "start", "end" or null when the row closes.

**React** — `import { Swipe, SwipeAction } from "@danitesler/ayywi/react";`
- `<Swipe>` renders <div class="ayy-swipe"><div class="ayy-swipe__content">{children}</div> trays…</div>. Props: `startActions` ReactNode — SwipeActions revealed by swiping toward the inline end; `endActions` ReactNode — SwipeActions revealed by swiping toward the inline start; `onOpenChange` (side: "start" | "end" | null) => void; `contentProps` HTMLAttributes — props for the sliding content (className="ayy-list__item")
- `<SwipeAction>` renders <button type="button" class="ayy-swipe__action">. Props: `variant` "default" | "primary" | "success" | "warning" | "info" | "destructive"; `icon` ReactNode — an Icon above the label

**Accessibility**
- Swiping is a shortcut, never the only way: offer the same actions in the row's page or a Menu, since many people can't or don't swipe.
- The actions are real buttons after the content in the tab order; a tray with focus shows over the row, and Esc closes an open row.
- Labels stay visible under the icons, so the tint isn't the only cue.
- Undo destructive actions (a Toast with Undo) rather than asking for confirmation in the middle of a gesture.

**Do**
- Use it on phone lists for the two or three things people do to rows most: Done, Snooze, Delete.
- Put the positive action at the start and the destructive one last at the end, as mail apps do.
- Set --ayy-swipe-bg to the surface the list sits on (a card) so the row hides its trays.

**Don't**
- Don't use it on desktop-first layouts; show the actions on hover or in a Menu there.
- Don't put more than three actions in a tray.
- Don't hide an action only here.

## Swipe actions — Task rows: Done, Pin, Snooze, Delete

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<!-- Swipe a row (or drag it with the mouse); <ayy-swipe> wires the gesture. Keyboards reach the buttons with Tab. -->
<div style="inline-size: min(100%, 24rem); border: 1px solid var(--ayy-color-line); border-radius: var(--ayy-radius-xl); overflow: hidden">
  <ayy-swipe>
    <div class="ayy-swipe">
      <div class="ayy-swipe__content ayy-list__item">
        <div class="ayy-list__content">
          <p class="ayy-list__title">Buy milk</p>
        </div>
        <span class="ayy-list__meta">Today</span>
      </div>
      <div class="ayy-swipe__actions ayy-swipe__actions--start">
        <button type="button" class="ayy-swipe__action ayy-swipe__action--success"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 14L8.5 17.5L19 6.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg>Done</button>
      </div>
      <div class="ayy-swipe__actions ayy-swipe__actions--end">
        <button type="button" class="ayy-swipe__action"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M3 21L8 16" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M13.2585 18.8714C9.51516 18.0215 5.97844 14.4848 5.12853 10.7415C4.99399 10.1489 4.92672 9.85266 5.12161 9.37197C5.3165 8.89129 5.55457 8.74255 6.03071 8.44509C7.10705 7.77265 8.27254 7.55888 9.48209 7.66586C11.1793 7.81598 12.0279 7.89104 12.4512 7.67048C12.8746 7.44991 13.1622 6.93417 13.7376 5.90269L14.4664 4.59604C14.9465 3.73528 15.1866 3.3049 15.7513 3.10202C16.316 2.89913 16.6558 3.02199 17.3355 3.26771C18.9249 3.84236 20.1576 5.07505 20.7323 6.66449C20.978 7.34417 21.1009 7.68401 20.898 8.2487C20.6951 8.8134 20.2647 9.05346 19.4039 9.53358L18.0672 10.2792C17.0376 10.8534 16.5229 11.1406 16.3024 11.568C16.0819 11.9955 16.162 12.8256 16.3221 14.4859C16.4399 15.7068 16.2369 16.88 15.5555 17.9697C15.2577 18.4458 15.1088 18.6839 14.6283 18.8786C14.1477 19.0733 13.8513 19.006 13.2585 18.8714Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg>Pin</button>
        <button type="button" class="ayy-swipe__action ayy-swipe__action--warning"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5"></circle><path d="M12 8V12L14 14" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg>Snooze</button>
        <button type="button" class="ayy-swipe__action ayy-swipe__action--destructive"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M19.5 5.5L18.8803 15.5251C18.7219 18.0864 18.6428 19.3671 18.0008 20.2879C17.6833 20.7431 17.2747 21.1273 16.8007 21.416C15.8421 22 14.559 22 11.9927 22C9.42312 22 8.1383 22 7.17905 21.4149C6.7048 21.1257 6.296 20.7408 5.97868 20.2848C5.33688 19.3626 5.25945 18.0801 5.10461 15.5152L4.5 5.5" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path><path d="M3 5.5H21M16.0557 5.5L15.3731 4.09173C14.9196 3.15626 14.6928 2.68852 14.3017 2.39681C14.215 2.3321 14.1231 2.27454 14.027 2.2247C13.5939 2 13.0741 2 12.0345 2C10.9688 2 10.436 2 9.99568 2.23412C9.8981 2.28601 9.80498 2.3459 9.71729 2.41317C9.32164 2.7167 9.10063 3.20155 8.65861 4.17126L8.05292 5.5" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path><path d="M9.5 16.5L9.5 10.5" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path><path d="M14.5 16.5L14.5 10.5" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path></svg>Delete</button>
      </div>
    </div>
  </ayy-swipe>
  <ayy-swipe>
    <div class="ayy-swipe" style="border-block-start: 1px solid var(--ayy-color-hairline)">
      <div class="ayy-swipe__content ayy-list__item">
        <div class="ayy-list__content">
          <p class="ayy-list__title">Call the bank about the card</p>
        </div>
        <span class="ayy-list__meta">Tomorrow</span>
      </div>
      <div class="ayy-swipe__actions ayy-swipe__actions--start">
        <button type="button" class="ayy-swipe__action ayy-swipe__action--success"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 14L8.5 17.5L19 6.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg>Done</button>
      </div>
      <div class="ayy-swipe__actions ayy-swipe__actions--end">
        <button type="button" class="ayy-swipe__action"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M3 21L8 16" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M13.2585 18.8714C9.51516 18.0215 5.97844 14.4848 5.12853 10.7415C4.99399 10.1489 4.92672 9.85266 5.12161 9.37197C5.3165 8.89129 5.55457 8.74255 6.03071 8.44509C7.10705 7.77265 8.27254 7.55888 9.48209 7.66586C11.1793 7.81598 12.0279 7.89104 12.4512 7.67048C12.8746 7.44991 13.1622 6.93417 13.7376 5.90269L14.4664 4.59604C14.9465 3.73528 15.1866 3.3049 15.7513 3.10202C16.316 2.89913 16.6558 3.02199 17.3355 3.26771C18.9249 3.84236 20.1576 5.07505 20.7323 6.66449C20.978 7.34417 21.1009 7.68401 20.898 8.2487C20.6951 8.8134 20.2647 9.05346 19.4039 9.53358L18.0672 10.2792C17.0376 10.8534 16.5229 11.1406 16.3024 11.568C16.0819 11.9955 16.162 12.8256 16.3221 14.4859C16.4399 15.7068 16.2369 16.88 15.5555 17.9697C15.2577 18.4458 15.1088 18.6839 14.6283 18.8786C14.1477 19.0733 13.8513 19.006 13.2585 18.8714Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg>Pin</button>
        <button type="button" class="ayy-swipe__action ayy-swipe__action--warning"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5"></circle><path d="M12 8V12L14 14" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg>Snooze</button>
        <button type="button" class="ayy-swipe__action ayy-swipe__action--destructive"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M19.5 5.5L18.8803 15.5251C18.7219 18.0864 18.6428 19.3671 18.0008 20.2879C17.6833 20.7431 17.2747 21.1273 16.8007 21.416C15.8421 22 14.559 22 11.9927 22C9.42312 22 8.1383 22 7.17905 21.4149C6.7048 21.1257 6.296 20.7408 5.97868 20.2848C5.33688 19.3626 5.25945 18.0801 5.10461 15.5152L4.5 5.5" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path><path d="M3 5.5H21M16.0557 5.5L15.3731 4.09173C14.9196 3.15626 14.6928 2.68852 14.3017 2.39681C14.215 2.3321 14.1231 2.27454 14.027 2.2247C13.5939 2 13.0741 2 12.0345 2C10.9688 2 10.436 2 9.99568 2.23412C9.8981 2.28601 9.80498 2.3459 9.71729 2.41317C9.32164 2.7167 9.10063 3.20155 8.65861 4.17126L8.05292 5.5" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path><path d="M9.5 16.5L9.5 10.5" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path><path d="M14.5 16.5L14.5 10.5" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path></svg>Delete</button>
      </div>
    </div>
  </ayy-swipe>
  <ayy-swipe>
    <div class="ayy-swipe" style="border-block-start: 1px solid var(--ayy-color-hairline)">
      <div class="ayy-swipe__content ayy-list__item">
        <div class="ayy-list__content">
          <p class="ayy-list__title">Book the train to Lisbon</p>
        </div>
        <span class="ayy-list__meta">Fri</span>
      </div>
      <div class="ayy-swipe__actions ayy-swipe__actions--start">
        <button type="button" class="ayy-swipe__action ayy-swipe__action--success"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 14L8.5 17.5L19 6.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg>Done</button>
      </div>
      <div class="ayy-swipe__actions ayy-swipe__actions--end">
        <button type="button" class="ayy-swipe__action"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M3 21L8 16" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M13.2585 18.8714C9.51516 18.0215 5.97844 14.4848 5.12853 10.7415C4.99399 10.1489 4.92672 9.85266 5.12161 9.37197C5.3165 8.89129 5.55457 8.74255 6.03071 8.44509C7.10705 7.77265 8.27254 7.55888 9.48209 7.66586C11.1793 7.81598 12.0279 7.89104 12.4512 7.67048C12.8746 7.44991 13.1622 6.93417 13.7376 5.90269L14.4664 4.59604C14.9465 3.73528 15.1866 3.3049 15.7513 3.10202C16.316 2.89913 16.6558 3.02199 17.3355 3.26771C18.9249 3.84236 20.1576 5.07505 20.7323 6.66449C20.978 7.34417 21.1009 7.68401 20.898 8.2487C20.6951 8.8134 20.2647 9.05346 19.4039 9.53358L18.0672 10.2792C17.0376 10.8534 16.5229 11.1406 16.3024 11.568C16.0819 11.9955 16.162 12.8256 16.3221 14.4859C16.4399 15.7068 16.2369 16.88 15.5555 17.9697C15.2577 18.4458 15.1088 18.6839 14.6283 18.8786C14.1477 19.0733 13.8513 19.006 13.2585 18.8714Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg>Pin</button>
        <button type="button" class="ayy-swipe__action ayy-swipe__action--warning"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5"></circle><path d="M12 8V12L14 14" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg>Snooze</button>
        <button type="button" class="ayy-swipe__action ayy-swipe__action--destructive"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M19.5 5.5L18.8803 15.5251C18.7219 18.0864 18.6428 19.3671 18.0008 20.2879C17.6833 20.7431 17.2747 21.1273 16.8007 21.416C15.8421 22 14.559 22 11.9927 22C9.42312 22 8.1383 22 7.17905 21.4149C6.7048 21.1257 6.296 20.7408 5.97868 20.2848C5.33688 19.3626 5.25945 18.0801 5.10461 15.5152L4.5 5.5" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path><path d="M3 5.5H21M16.0557 5.5L15.3731 4.09173C14.9196 3.15626 14.6928 2.68852 14.3017 2.39681C14.215 2.3321 14.1231 2.27454 14.027 2.2247C13.5939 2 13.0741 2 12.0345 2C10.9688 2 10.436 2 9.99568 2.23412C9.8981 2.28601 9.80498 2.3459 9.71729 2.41317C9.32164 2.7167 9.10063 3.20155 8.65861 4.17126L8.05292 5.5" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path><path d="M9.5 16.5L9.5 10.5" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path><path d="M14.5 16.5L14.5 10.5" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path></svg>Delete</button>
      </div>
    </div>
  </ayy-swipe>
</div>
```

React:

```tsx
import { Clock01Icon, Delete02Icon, PinIcon, Tick02Icon } from "@hugeicons/core-free-icons";
import { Icon, Swipe, SwipeAction } from "@danitesler/ayywi/react";

const TASKS = [
  { id: "milk", title: "Buy milk", due: "Today" },
  { id: "call", title: "Call the bank about the card", due: "Tomorrow" },
  { id: "trip", title: "Book the train to Lisbon", due: "Fri" },
];

export default function Example() {
  // Swipe a row (or drag it with the mouse). Keyboards reach the buttons with Tab.
  return (
    <div style={{ inlineSize: "min(100%, 24rem)", border: "1px solid var(--ayy-color-line)", borderRadius: "var(--ayy-radius-xl)", overflow: "hidden" }}>
      {TASKS.map((task, i) => (
        <Swipe
          key={task.id}
          style={i > 0 ? { borderBlockStart: "1px solid var(--ayy-color-hairline)" } : undefined}
          contentProps={{ className: "ayy-list__item" }}
          startActions={
            <SwipeAction variant="success" icon={<Icon icon={Tick02Icon} />}>
              Done
            </SwipeAction>
          }
          endActions={
            <>
              <SwipeAction icon={<Icon icon={PinIcon} />}>Pin</SwipeAction>
              <SwipeAction variant="warning" icon={<Icon icon={Clock01Icon} />}>
                Snooze
              </SwipeAction>
              <SwipeAction variant="destructive" icon={<Icon icon={Delete02Icon} />}>
                Delete
              </SwipeAction>
            </>
          }
        >
          <div className="ayy-list__content">
            <p className="ayy-list__title">{task.title}</p>
          </div>
          <span className="ayy-list__meta">{task.due}</span>
        </Swipe>
      ))}
    </div>
  );
}
```

---
Part of @danitesler/ayywi 0.0.1: load `dist/ayywi.min.css` (and `dist/elements.global.js` for the <ayy-*> elements). The rules every screen follows: [llms-full.txt#rules](../llms-full.txt#rules). Every component: [llms.txt](../llms.txt).
