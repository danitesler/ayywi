# Popover

Category: Overlays. Non-modal floating panel anchored to a button. Built on the native popover attribute: top layer, click-outside and Esc to close. Also called: popover, popup, flyout.

**Classes**
- `.ayy-popover` — On the element with the popover attribute. Surface, padding, shadow, fade/scale transition.

**States**
- `:popover-open` — Open.

**JS (framework-free)**: popoverClass constant; connectPopover(trigger, content, { side?, align?, offset?, onToggle? }) → { open, close, isOpen, update, destroy }

**Custom element** `<ayy-popover>` (@danitesler/ayywi/elements) — A trigger <button> (optionally data-ayy-trigger) and an element with the popover attribute.
- attribute `side`: bottom | top | start | end
- attribute `align`: center | start | end
- attribute `open`: Two-way open state
- event `ayy-open-change`: { open: boolean }

**React** — `import { Popover, PopoverTrigger, PopoverContent } from "@danitesler/ayywi/react";`
- `<Popover>` renders nothing (state provider). Props: `open / defaultOpen` boolean; `onOpenChange` (open: boolean) => void
- `<PopoverTrigger>` renders Button. Props: `...ButtonProps` variant, size…
- `<PopoverContent>` renders <div popover role="dialog">. Props: `side` "bottom" | "top" | "start" | "end"; `align` "center" | "start" | "end"

**Accessibility**
- Give the content an accessible name (aria-label or aria-labelledby pointing at its heading).
- The trigger gets aria-expanded automatically; Esc and click-outside close it and focus returns to the trigger.
- It's not a focus trap — use Dialog when the user must finish something first.

**Do**
- Use a popover for small forms or details next to their trigger (share link, filters, quick edit).
- Keep content short; if it scrolls, it probably wants to be a Dialog or a page.

**Don't**
- Don't use a popover for a list of actions — use Dropdown menu.
- Don't use a popover for anything that must block the page — use Dialog.
- Don't open popovers on hover — hover hints are a Tooltip.
- Don't nest popovers more than one level.

## Popover — Share link

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<!-- popovertarget opens it natively (even without JS, centred). <ayy-popover> (@danitesler/ayywi/elements) places it next to the trigger. -->
<ayy-popover align="start">
  <button type="button" class="ayy-button ayy-button--outline" popovertarget="share-popover-html" aria-haspopup="dialog">Share</button>
  <div class="ayy-popover" id="share-popover-html" popover role="dialog" aria-labelledby="share-title-html">
    <div class="ayy-stack" style="inline-size: 16.25rem">
      <p id="share-title-html" class="ayy-h6">Share this project</p>
      <p class="ayy-muted">Anyone with the link can view.</p>
      <div class="ayy-cluster" style="flex-wrap: nowrap">
        <input class="ayy-input ayy-input--sm" readonly value="https://example.com/p/42" aria-label="Share link" />
        <button type="button" class="ayy-button ayy-button--sm">Copy</button>
      </div>
    </div>
  </div>
</ayy-popover>
```

React:

```tsx
import { Button, Input, Popover, PopoverContent, PopoverTrigger } from "@danitesler/ayywi/react";

export default function Example() {
  return (
    <Popover>
      <PopoverTrigger variant="outline">Share</PopoverTrigger>
      <PopoverContent align="start" aria-labelledby="share-title">
        <div className="ayy-stack" style={{ inlineSize: "16.25rem" }}>
          <p id="share-title" className="ayy-h6">
            Share this project
          </p>
          <p className="ayy-muted">Anyone with the link can view.</p>
          <div className="ayy-cluster" style={{ flexWrap: "nowrap" }}>
            <Input size="sm" readOnly defaultValue="https://example.com/p/42" aria-label="Share link" />
            <Button size="sm">Copy</Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
```

---
Part of @danitesler/ayywi 0.0.1: load `dist/ayywi.min.css` (and `dist/elements.global.js` for the <ayy-*> elements). The rules every screen follows: [llms-full.txt#rules](../llms-full.txt#rules). Every component: [llms.txt](../llms.txt).
