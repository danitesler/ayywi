# Dialog

Category: Overlays. Modal dialog built on the native <dialog> element: top layer, inert background, focus handling and Esc for free. Centred, or a side modal (drawer, sheet) that slides in from the inline-start or inline-end edge, or a bottom sheet for phones.

**Classes**
- `.ayy-dialog` — On the <dialog> element. Open with dialog.showModal().
- `.ayy-dialog--sm` — 24rem wide.
- `.ayy-dialog--lg` — 42rem wide.
- `.ayy-dialog--xl` — 56rem wide.
- `.ayy-dialog--side-start` — Side modal on the inline-start edge (left in LTR, right in RTL): full height, slides in. Width from the size modifiers.
- `.ayy-dialog--side-end` — Side modal on the inline-end edge (right in LTR, left in RTL): full height, slides in. Width from the size modifiers.
- `.ayy-dialog--side-bottom` — Bottom sheet: anchored to the bottom edge with a grab handle, slides up. Full width on phones, centred at the size modifier's width on wider screens; clears the home indicator (safe-area inset).
- `.ayy-dialog__header` — Title + description block.
- `.ayy-dialog__title` — Heading (h2). Reference it with aria-labelledby on the dialog.
- `.ayy-dialog__description` — Muted supporting text.
- `.ayy-dialog__body` — Content that scrolls on its own, between the header and the footer. Fills the height of a side modal, so the footer sits at the bottom.
- `.ayy-dialog__footer` — Actions. Stacked on mobile, end-aligned (right in LTR, left in RTL) from 40rem.
- `.ayy-dialog__close` — Icon button in the top-end corner.

**States**
- `default` — Closed: not rendered. Open (see open): surface panel, line-strong border, card radius, overlay shadow, over a blurred --ayy-color-overlay backdrop.
- `hover` (`.ayy-dialog__close:hover`) — Close button gets a wash-hover circle and the text colour.
- `pressed` — doesn't apply: The panel has no pressed look; its buttons have Button's.
- `focus` (`.ayy-dialog__close:focus-visible; .ayy-dialog__body:focus-visible (scrolling body with tabindex="0")`) — Close: 2px ring, 2px offset. Body: ring inset by 2px.
- `disabled` — doesn't apply: A dialog isn't disabled; disable the buttons inside it.
- `selected` — doesn't apply: No selected state.
- `error` — doesn't apply: Show errors inside the body: a FieldError per field, an Alert for a failed save. Keep the dialog open.
- `loading` — doesn't apply: No loading look; put the primary Button in loading while it saves, Skeletons in the body while it loads.
- `open` (`[open] via showModal() (React open; <ayy-dialog>)`) — Fades and scales in (centred); side-start / side-end slide in from that edge (RTL-aware); side-bottom slides up as a sheet with a grab handle. The page behind is inert and stops scrolling.

**Sizes**
- `sm` — 24rem wide.
- `md` (default) — 32rem wide.
- `lg` — 42rem wide.
- `xl` — 56rem wide.
- Density — Padding is fixed (--ayy-space-6); its controls follow data-density.
- Width — The width above, never more than the viewport minus 2rem; at most the viewport height minus 2rem, the body scrolls. Side modals are full height (the size sets their width); a bottom sheet is full width below 40rem.

**JS (framework-free)**: dialogClass({ size?, side?, className? }); isBackdropClick(dialog, event); dialogCloseIcon (the Hugeicons close icon as SVG markup). Without any JS helper: dialog.showModal() / dialog.close(), or natively <button commandfor="id" command="show-modal"> in modern browsers.

**Custom element** `<ayy-dialog>` (@danitesler/ayywi/elements) — A trigger with data-ayy-open and a <dialog class="ayy-dialog"> (centred or side). Inside the dialog, data-ayy-close="value" closes it and sets dialog.returnValue.
- attribute `open`: Two-way open state
- attribute `persistent`: Backdrop clicks don't close it (Esc still does)
- event `ayy-open-change`: { open: boolean, returnValue?: string }

**React** — `import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogBody, DialogFooter, DialogClose } from "@danitesler/ayywi/react";`
- `<Dialog>` renders nothing (state provider). Props: `open / defaultOpen` boolean; `onOpenChange` (open: boolean) => void
- `<DialogTrigger>` renders Button. Props: `...ButtonProps` variant, size…
- `<DialogContent>` renders <dialog>. Props: `size` "sm" | "md" | "lg" | "xl" — width; `side` "center" | "start" | "end" | "bottom" — start/end make a side modal on that inline edge, bottom a bottom sheet; `hideClose` boolean — hide the corner close button; `closeLabel` string — accessible name of the close button (translate it). Default "Close"; `closeOnBackdrop` boolean — default true
- `<DialogHeader>` renders <div>.
- `<DialogTitle>` renders <h2>, auto-wired to aria-labelledby.
- `<DialogDescription>` renders <p>, auto-wired to aria-describedby.
- `<DialogBody>` renders <div>, scrolls between header and footer.
- `<DialogFooter>` renders <div>.
- `<DialogClose>` renders Button (secondary by default).

**Accessibility**
- Always include a DialogTitle (or aria-label on the dialog).
- Focus moves into the dialog on open and returns to the trigger on close (native behaviour).
- Esc closes; background is inert while open; page scroll is locked. A side modal is still a modal: same rules.
- A body with only text that scrolls needs tabindex="0" so keyboard users can scroll it; form fields inside make that unnecessary.
- Opening and closing fade/scale (side modals slide); the closing animation is skipped in browsers without @starting-style and under reduced motion.

**Do**
- Use a dialog for short, focused tasks that must finish before continuing (rename, create).
- Use a dialog to confirm a destructive action, with the destructive variant on the confirm button.
- Use a side modal to edit or inspect a record without leaving the page, and for settings, filters or a mobile nav drawer.
- Put the primary action last in the footer.
- Use a bottom sheet on phones for a short list of actions or options on the thing just tapped (share, sort, quick settings): it sits under the thumb.
- In a side modal, put the form fields in the body and submit from the footer with <button type="submit" form="form-id">.

**Don't**
- Don't use a dialog for long forms or multi-step flows — use a page.
- Don't use a dialog for non-blocking messages — use an Alert on the page, or a Toast for a confirmation.
- Don't use a modal for a panel people keep open while they work with the page — use a layout column.
- Don't open a dialog from inside another dialog.
- Don't fill a bottom sheet with a long form — it stops being a quick choice; use a page or a side modal.
- Don't render DialogContent's children while closed — the React component already skips them for you.

## Dialog — Confirm

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<!-- <ayy-dialog> (@danitesler/ayywi/elements): [data-ayy-open] opens, [data-ayy-close] closes, backdrop click closes.
     Without it, call dialog.showModal() / dialog.close() yourself. -->
<ayy-dialog>
  <button type="button" class="ayy-button ayy-button--destructive" data-ayy-open aria-haspopup="dialog">Delete project</button>
  <dialog class="ayy-dialog ayy-dialog--sm" aria-labelledby="confirm-delete-title" aria-describedby="confirm-delete-desc">
    <div class="ayy-dialog__header">
      <h2 class="ayy-dialog__title" id="confirm-delete-title">Delete Marketing site?</h2>
      <p class="ayy-dialog__description" id="confirm-delete-desc">Its deployments and settings are removed. This can't be undone.</p>
    </div>
    <div class="ayy-dialog__footer">
      <button type="button" class="ayy-button ayy-button--secondary" data-ayy-close>Cancel</button>
      <button type="button" class="ayy-button ayy-button--destructive" data-ayy-close="delete">Delete</button>
    </div>
    <button type="button" class="ayy-dialog__close" aria-label="Close" data-ayy-close>
      <svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M18 6L6.00081 17.9992M17.9992 18L6 6.00085" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/></svg>
    </button>
  </dialog>
</ayy-dialog>
```

React:

```tsx
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@danitesler/ayywi/react";

export default function Example() {
  return (
    <Dialog>
      <DialogTrigger variant="destructive">Delete project</DialogTrigger>
      <DialogContent size="sm">
        <DialogHeader>
          <DialogTitle>Delete Marketing site?</DialogTitle>
          <DialogDescription>Its deployments and settings are removed. This can't be undone.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose>Cancel</DialogClose>
          <DialogClose variant="destructive">Delete</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

## Dialog — With a form

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<!-- method="dialog" closes the dialog on submit with zero JS; the submit button's value becomes dialog.returnValue. -->
<ayy-dialog>
  <button type="button" class="ayy-button ayy-button--outline" data-ayy-open aria-haspopup="dialog">Rename project</button>
  <dialog class="ayy-dialog" aria-labelledby="rename-project-title">
    <form method="dialog" class="ayy-stack" style="--ayy-gap: var(--ayy-space-4)">
      <div class="ayy-dialog__header">
        <h2 class="ayy-dialog__title" id="rename-project-title">Rename project</h2>
      </div>
      <div class="ayy-field">
        <label class="ayy-label" for="project-name-html">Name</label>
        <input class="ayy-input" id="project-name-html" name="name" value="marketing-site" autofocus />
      </div>
      <div class="ayy-dialog__footer">
        <button type="button" class="ayy-button ayy-button--secondary" data-ayy-close>Cancel</button>
        <button type="submit" class="ayy-button" value="save">Save</button>
      </div>
    </form>
    <button type="button" class="ayy-dialog__close" aria-label="Close" data-ayy-close>
      <svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M18 6L6.00081 17.9992M17.9992 18L6 6.00085" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/></svg>
    </button>
  </dialog>
</ayy-dialog>
```

React:

```tsx
import { useState, type CSSProperties } from "react";
import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Field,
  Input,
  Label,
} from "@danitesler/ayywi/react";

export default function Example() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("marketing-site");

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        Rename project ({name})
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <form
            className="ayy-stack"
            style={{ "--ayy-gap": "var(--ayy-space-4)" } as CSSProperties}
            onSubmit={(event) => {
              event.preventDefault();
              setName(String(new FormData(event.currentTarget).get("name") ?? ""));
              setOpen(false);
            }}
          >
            <DialogHeader>
              <DialogTitle>Rename project</DialogTitle>
            </DialogHeader>
            <Field>
              <Label htmlFor="project-name">Name</Label>
              <Input id="project-name" name="name" defaultValue={name} autoFocus />
            </Field>
            <DialogFooter>
              <DialogClose>Cancel</DialogClose>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
```

## Dialog — Side modal

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<!-- A side modal is the same <dialog> with ayy-dialog--side-end (or --side-start). Only the body scrolls.
     The footer's submit button reaches the form with form="…"; method="dialog" closes the dialog on submit. -->
<ayy-dialog>
  <button type="button" class="ayy-button ayy-button--outline" data-ayy-open aria-haspopup="dialog">Project settings</button>
  <dialog class="ayy-dialog ayy-dialog--side-end" aria-labelledby="project-settings-title-html" aria-describedby="project-settings-desc-html">
    <div class="ayy-dialog__header">
      <h2 class="ayy-dialog__title" id="project-settings-title-html">Project settings</h2>
      <p class="ayy-dialog__description" id="project-settings-desc-html">Marketing site. Changes apply to the next deployment.</p>
    </div>
    <div class="ayy-dialog__body">
      <form method="dialog" id="project-settings-form-html" class="ayy-stack" style="--ayy-gap: var(--ayy-space-5)">
        <div class="ayy-field">
          <label class="ayy-label" for="settings-name-html">Project name</label>
          <input class="ayy-input" id="settings-name-html" name="name" value="marketing-site" required />
        </div>
        <div class="ayy-field">
          <label class="ayy-label" for="settings-region-html">Region</label>
          <div class="ayy-select">
            <select class="ayy-select__control" id="settings-region-html" name="region">
              <option value="fra1">Frankfurt (fra1)</option>
              <option value="iad1">Washington, D.C. (iad1)</option>
              <option value="hnd1">Tokyo (hnd1)</option>
            </select>
          </div>
        </div>
        <div class="ayy-field">
          <label class="ayy-label" for="settings-build-html">Build command</label>
          <input class="ayy-input" id="settings-build-html" name="build" value="pnpm build" aria-describedby="settings-build-html-hint" />
          <p class="ayy-field__hint" id="settings-build-html-hint">Runs in the project root after install.</p>
        </div>
        <div class="ayy-field">
          <label class="ayy-label" for="settings-output-html">Output directory</label>
          <input class="ayy-input" id="settings-output-html" name="output" value="dist" />
        </div>
        <div class="ayy-field ayy-field--inline">
          <input class="ayy-switch" type="checkbox" role="switch" id="settings-autodeploy-html" name="autodeploy" checked />
          <label class="ayy-label" for="settings-autodeploy-html">Deploy every push to main</label>
        </div>
        <div class="ayy-field ayy-field--inline">
          <input class="ayy-switch" type="checkbox" role="switch" id="settings-previews-html" name="previews" checked />
          <label class="ayy-label" for="settings-previews-html">Preview deployments for pull requests</label>
        </div>
      </form>
    </div>
    <div class="ayy-dialog__footer">
      <button type="button" class="ayy-button ayy-button--secondary" data-ayy-close>Cancel</button>
      <button type="submit" class="ayy-button" form="project-settings-form-html" value="save">Save changes</button>
    </div>
    <button type="button" class="ayy-dialog__close" aria-label="Close" data-ayy-close>
      <svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M18 6L6.00081 17.9992M17.9992 18L6 6.00085" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/></svg>
    </button>
  </dialog>
</ayy-dialog>
```

React:

```tsx
import { useState, type CSSProperties } from "react";
import {
  Button,
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Field,
  FieldHint,
  Input,
  Label,
  Select,
  Switch,
  toast,
} from "@danitesler/ayywi/react";

export default function Example() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger variant="outline">Project settings</DialogTrigger>
      {/* side="end": a full-height panel on the inline-end edge. Only the body scrolls. */}
      <DialogContent side="end">
        <DialogHeader>
          <DialogTitle>Project settings</DialogTitle>
          <DialogDescription>Marketing site. Changes apply to the next deployment.</DialogDescription>
        </DialogHeader>
        <DialogBody>
          <form
            id="project-settings-form"
            className="ayy-stack"
            style={{ "--ayy-gap": "var(--ayy-space-5)" } as CSSProperties}
            onSubmit={(event) => {
              event.preventDefault();
              setOpen(false);
              toast.success("Settings saved");
            }}
          >
            <Field>
              <Label htmlFor="settings-name">Project name</Label>
              <Input id="settings-name" name="name" defaultValue="marketing-site" required />
            </Field>
            <Field>
              <Label htmlFor="settings-region">Region</Label>
              <Select id="settings-region" name="region" defaultValue="fra1">
                <option value="fra1">Frankfurt (fra1)</option>
                <option value="iad1">Washington, D.C. (iad1)</option>
                <option value="hnd1">Tokyo (hnd1)</option>
              </Select>
            </Field>
            <Field>
              <Label htmlFor="settings-build">Build command</Label>
              <Input id="settings-build" name="build" defaultValue="pnpm build" aria-describedby="settings-build-hint" />
              <FieldHint id="settings-build-hint">Runs in the project root after install.</FieldHint>
            </Field>
            <Field>
              <Label htmlFor="settings-output">Output directory</Label>
              <Input id="settings-output" name="output" defaultValue="dist" />
            </Field>
            <Field inline>
              <Switch id="settings-autodeploy" name="autodeploy" defaultChecked />
              <Label htmlFor="settings-autodeploy">Deploy every push to main</Label>
            </Field>
            <Field inline>
              <Switch id="settings-previews" name="previews" defaultChecked />
              <Label htmlFor="settings-previews">Preview deployments for pull requests</Label>
            </Field>
          </form>
        </DialogBody>
        <DialogFooter>
          <DialogClose>Cancel</DialogClose>
          {/* A submit button outside the form reaches it through the form attribute. */}
          <Button type="submit" form="project-settings-form">
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

## Dialog — Bottom sheet

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<!-- A bottom sheet: the same <dialog>, anchored to the bottom edge. Each choice closes it and sets dialog.returnValue. -->
<ayy-dialog>
  <button type="button" class="ayy-button ayy-button--secondary" data-ayy-open aria-haspopup="dialog">Sort projects</button>
  <dialog class="ayy-dialog ayy-dialog--sm ayy-dialog--side-bottom" aria-labelledby="sort-sheet-title" aria-describedby="sort-sheet-desc">
    <div class="ayy-dialog__header">
      <h2 class="ayy-dialog__title" id="sort-sheet-title">Sort projects</h2>
      <p class="ayy-dialog__description" id="sort-sheet-desc">Applies to the list on this page.</p>
    </div>
    <div class="ayy-dialog__footer">
      <button type="button" class="ayy-button" data-ayy-close="updated">Last updated</button>
      <button type="button" class="ayy-button ayy-button--secondary" data-ayy-close="name">Name</button>
      <button type="button" class="ayy-button ayy-button--secondary" data-ayy-close="created">Date created</button>
    </div>
  </dialog>
</ayy-dialog>
```

React:

```tsx
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@danitesler/ayywi/react";

export default function Example() {
  return (
    <Dialog>
      <DialogTrigger variant="secondary">Sort projects</DialogTrigger>
      <DialogContent side="bottom" size="sm" hideClose>
        <DialogHeader>
          <DialogTitle>Sort projects</DialogTitle>
          <DialogDescription>Applies to the list on this page.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose variant="primary">Last updated</DialogClose>
          <DialogClose>Name</DialogClose>
          <DialogClose>Date created</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

---
Part of @danitesler/ayywi 0.0.1: load `dist/ayywi.min.css` (and `dist/elements.global.js` for the <ayy-*> elements). The rules every screen follows: [llms-full.txt#rules](../llms-full.txt#rules). Every component: [llms.txt](../llms.txt).
