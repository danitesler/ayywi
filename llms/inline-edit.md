# Inline edit

Category: Forms. A value that becomes an input where it sits: a page or card title, a project name, a version, a due date. Click it or press Enter to edit, Enter saves, Esc cancels, blur saves, and a multiline field grows as you type and saves on Mod+Enter. Also called: inline-edit, inline-editor, editable, click-to-edit, edit-in-place.

**Classes**
- `.ayy-inline-edit` — Root: one grid cell shared by the display button and the field, both at least the control's height, so swapping them doesn't move the content for a one-line value. Put the raw value in data-value.
- `.ayy-inline-edit__display` — The value at rest, as a <button type="button"> named by aria-label ("Rename the project"). It is hidden while the field is open.
- `.ayy-inline-edit__text` — The value inside the display button. It may be formatted (24 Oct 2026 while data-value is 2026-10-24); when empty, data-placeholder shows as muted text.
- `.ayy-inline-edit__input` — The field: .ayy-input for one line or .ayy-textarea with rows="1" for more. Hidden until editing starts.
- `.ayy-inline-edit--title` — Title variant: the display and the field take --ayy-font-heading at --ayy-text-xl, semibold.

**States**
- `default` — The value as plain text on a transparent button; a small wash appears on hover. The field is hidden in the same grid cell.
- `hover` (`.ayy-inline-edit__display:hover (devices that hover)`) — A --ayy-color-wash behind the value, so it reads as editable. The field keeps Input's or Textarea's own hover border.
- `pressed` — doesn't apply: No pressed look: the click opens the field, which is the feedback.
- `focus` (`.ayy-inline-edit__display:focus-visible, and .ayy-inline-edit__input:focus-visible while editing`) — The display gets the 2px --ayy-color-ring outline at 2px offset; the field uses Input's or Textarea's own ring.
- `disabled` (`disabled on the display button and the field`) — --ayy-opacity-disabled and a not-allowed cursor. Forced colours: GrayText.
- `selected` — doesn't apply: Not a choice control.
- `error` (`aria-invalid="true" on the field (passed through inputProps or textareaProps)`) — Input's or Textarea's destructive border and focus ring. Say why in a FieldError.
- `loading` — doesn't apply: No loading look. Disable the field while a save is in flight and show a Spinner or a Toast when it fails.
- `editing` (`editing / defaultEditing, or a click or Enter on the display button`) — The display is hidden and the field takes the same grid cell at the control's height, focused with all its text selected (caret at the end on a textarea). A textarea then grows with its content.

**Sizes**
- Density — The display button and the field both keep --ayy-size-control-md (32px compact, 40px comfortable, 44px touch), so a one-line value doesn't move the row when an edit starts or ends; the field's text is --ayy-control-text-field. The title variant's --ayy-text-xl type stays the same at every density.
- Width — Fills its container. The display text wraps long words, keeps the author's line breaks and never scrolls sideways; a multiline field grows to its content.

**Custom element** `<ayy-inline-edit>` (@danitesler/ayywi/elements) — 
- event `ayy-change`: { value } — after a commit, only when the value changed. Update any formatted display text from it.
- event `ayy-edit`: { editing } — true when the field opens, false however it closes.

**React** — `import { InlineEdit } from "@danitesler/ayywi/react";`
- `<InlineEdit>` renders <div class="ayy-inline-edit" data-value> <button class="ayy-inline-edit__display"><span class="ayy-inline-edit__text"> + <input class="ayy-input ayy-inline-edit__input"> (or <textarea class="ayy-textarea ..." rows="1">). Props: `value / defaultValue` string — the raw value; value makes it controlled; `onValueChange` (value: string) => void — after a commit, only when the value changed; `label` string — the display button's and the field's aria-label, written as the action ("Rename the project"); `displayValue` ReactNode — what the display shows at rest; defaults to the value (a formatted date, a price); `placeholder` string — shown when the value is empty, in the display and in the field; `multiline` boolean — use a growing <textarea>; saves on ⌘Enter / Ctrl+Enter; `variant` "text" | "title"; `disabled` boolean — disables the display button and the field; `editing / defaultEditing` boolean — edit mode, controlled, or the starting one; `onEditingChange` (editing: boolean) => void — when edit mode starts or ends; `onCancel` () => void — Esc threw the draft away; `trim` boolean — trim the value on commit. Default true; `inputProps` props for the single-line <input> (id, aria-describedby, aria-invalid, autoComplete…); `textareaProps` props for the multiline <textarea> (rows, maxLength…); `className` string — on the root, never on the field

**Accessibility**
- The display is a real button and the field is a real input: give both the same aria-label (label in React), written as the action ("Rename the project"), and keep it when the value changes.
- Enter saves, Esc cancels and puts focus back on the display button; blur and Tab save without pulling focus back.
- Enter while an IME is composing is left to the IME, so a Japanese, Chinese or Korean word can be confirmed without saving.
- The empty value shows the placeholder as text, not as the only name: the button keeps its aria-label.

**Do**
- Use inline edit for a short value people rename in place: a page title, a project or file name, a version, a due date.
- Write the label as the action ("Rename the project"), and keep a formatted displayValue in React when the raw value isn't what people should read.
- Keep the raw value in data-value (plain HTML) and format only the .ayy-inline-edit__text.

**Don't**
- Don't use it for long-form content or a value filled once in a form — use Field + Label with a Textarea or Input.
- Don't put formatted text in data-value: the field edits the raw value, and the app rewrites the display from ayy-change.
- Don't use it for a value that needs more than one field — open a Dialog or use Settings rows.

## Inline edit — Title

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<!-- <ayy-inline-edit> makes the value editable: click the title, Enter saves, Esc cancels, blur saves. -->
<div class="ayy-stack" style="inline-size: min(100%, 24rem)">
  <ayy-inline-edit>
    <div class="ayy-inline-edit ayy-inline-edit--title" data-value="Q4 launch">
      <button type="button" class="ayy-inline-edit__display" aria-label="Rename the project"><span class="ayy-inline-edit__text">Q4 launch</span></button>
      <input class="ayy-input ayy-inline-edit__input" aria-label="Rename the project" value="Q4 launch" hidden>
    </div>
  </ayy-inline-edit>
  <p class="ayy-small ayy-muted">Click the title, then Enter to save or Esc to cancel.</p>
</div>
```

React:

```tsx
import { InlineEdit } from "@danitesler/ayywi/react";

export default function Example() {
  return (
    <div className="ayy-stack" style={{ inlineSize: "min(100%, 24rem)" }}>
      <InlineEdit label="Rename the project" defaultValue="Q4 launch" variant="title" />
      <p className="ayy-small ayy-muted">Click the title, then Enter to save or Esc to cancel.</p>
    </div>
  );
}
```

## Inline edit — Description

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<!-- <ayy-inline-edit> makes the value editable: Enter starts a line, ⌘Enter or Ctrl+Enter saves, Esc cancels, blur saves. -->
<div class="ayy-stack" style="inline-size: min(100%, 28rem)">
  <ayy-inline-edit>
    <div class="ayy-inline-edit" data-value="The workspace shows its members, their roles and what each one worked on this week.">
      <button type="button" class="ayy-inline-edit__display" aria-label="Edit the description"><span class="ayy-inline-edit__text">The workspace shows its members, their roles and what each one worked on this week.</span></button>
      <textarea class="ayy-textarea ayy-inline-edit__input" rows="1" aria-label="Edit the description" hidden>The workspace shows its members, their roles and what each one worked on this week.</textarea>
    </div>
  </ayy-inline-edit>
  <p class="ayy-small ayy-muted">Click the description. Enter starts a line; ⌘Enter or Ctrl+Enter saves.</p>
</div>
```

React:

```tsx
import { InlineEdit } from "@danitesler/ayywi/react";

export default function Example() {
  return (
    <div className="ayy-stack" style={{ inlineSize: "min(100%, 28rem)" }}>
      <InlineEdit
        label="Edit the description"
        multiline
        defaultValue="The workspace shows its members, their roles and what each one worked on this week."
      />
      <p className="ayy-small ayy-muted">Click the description. Enter starts a line; ⌘Enter or Ctrl+Enter saves.</p>
    </div>
  );
}
```

---
Part of @danitesler/ayywi 0.1.2: load `dist/ayywi.min.css` (and `dist/elements.global.js` for the <ayy-*> elements). The rules every screen follows: [llms-full.txt#rules](../llms-full.txt#rules). Every component: [llms.txt](../llms.txt).
