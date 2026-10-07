# Tag input

Category: Forms. A field that turns what you type into removable chips: tags, labels, email recipients. Enter or a comma adds one, pasting a comma-separated list adds them all, Backspace in the empty field removes the last. Optional suggestions open under it as you type, like a Combobox. Also called: tag-input, tags-input, token-input, chip-input, tag-field, tag-editor.

**Classes**
- `.ayy-tag-input` — Root: looks like an .ayy-input, holds the chips then the input, and grows to more lines as needed. Clicking its empty space focuses the input. With suggestions add ayy-combobox and put an .ayy-combobox__listbox inside.
- `.ayy-tag-input__tag` — A tag, on an .ayy-chip.ayy-chip--removable <span data-value> with its .ayy-chip__remove button (aria-label "Remove design").
- `.ayy-tag-input__input` — The borderless <input type="text"> after the chips; the field's id, label and aria-describedby go on it.
- `.ayy-tag-input--sm` — Small, like ayy-input--sm.
- `.ayy-tag-input--lg` — Large, like ayy-input--lg (a phone form).

**States**
- `default` — An Input-like wash field with a line-strong border, holding removable chips and a text box that grows onto more lines as tags are added.
- `hover` (`:hover (devices that hover)`) — Border turns line-hover.
- `pressed` — doesn't apply: No pressed look; a click puts the caret in the text box.
- `focus` (`.ayy-tag-input:has(> .ayy-tag-input__input:focus-visible)`) — A 2px ring around the whole field; each chip's × has its own. Forced colours: Highlight.
- `disabled` (`.ayy-tag-input:has(> .ayy-tag-input__input:disabled)`) — --ayy-opacity-disabled, not-allowed cursor. Disable the chips' × buttons too.
- `selected` (`a suggestion's aria-selected (Combobox option)`) — The suggestion under the arrow keys gets Combobox's wash; suggestions that are already tags are aria-disabled.
- `error` (`aria-invalid="true" on .ayy-tag-input__input`) — A destructive border (and ring while focused). Say why in a FieldError.
- `loading` — doesn't apply: No loading look in the field. While suggestions load, show the Combobox's "Searching…" row.
- `open` (`input[aria-expanded="true"]`) — Suggestions open under the field like a Combobox's list.

**Sizes**
- `sm` — At least the sm control height (28px compact, 32 comfortable, 40 touch), sm text.
- `md` (default) — At least the md control height (32px compact, 40 comfortable, 44 touch).
- `lg` — At least the lg control height (40px compact, 48 comfortable, 52 touch), more padding, lg text.
- Density — The first line's height follows data-density (above); each line of tags adds a chip's height.
- Width — Fills its container; tags wrap.

**JS (framework-free)**: splitTags(text) → tags split at commas and new lines; addTags(values, add, { max?, caseSensitive? }) → values with the new ones appended (no duplicates, ignoring case); tagChip(value, removeLabel?) → a chip element; tagInputClass({ size?, suggestions? }); tagRemoveIcon (SVG markup). connectTagInput(root, { name?, max?, caseSensitive?, onChange?, removeLabel?, addedText?, removedText? }) → { values, setValues, destroy } wires plain markup and draws the chips.

**Custom element** `<ayy-tag-input>` (@danitesler/ayywi/elements) — 
- attribute `name`: Form name: a hidden input per tag carries it.
- attribute `max`: Most tags allowed.
- attribute `case-sensitive`: Keep tags that differ only in case apart.
- event `ayy-change`: { values } — every tag, after one is added or removed.

**React** — `import { TagInput } from "@danitesler/ayywi/react";`
- `<TagInput>` renders <div class="ayy-tag-input"> chips + <input class="ayy-tag-input__input"> (+ a listbox with suggestions); other props go on the input, className on the root. Props: `value / defaultValue` string[] — the tags; `onValueChange` (values: string[]) => void; `suggestions` string[] — known tags listed as you type; added ones show disabled; `emptyText` ReactNode — in the suggestions list when nothing matches. Default "Press Enter to add it"; `max` number — most tags; `caseSensitive` boolean — keep "Design" and "design" apart; `size` "sm" | "md" | "lg"; `name` string — a hidden input per tag; `removeLabel` (value) => string — the × button's name. Default "Remove <tag>"; `className` string — on the root

**Accessibility**
- Label the inner input with <Label htmlFor> on its id and describe how to add a tag in a FieldHint ("Press Enter or type a comma").
- Each chip's × is a real button named "Remove design"; Backspace in the empty field removes the last tag too.
- Adding and removing are announced in a polite live region ("design added"), and focus stays in the input.
- With suggestions the input is a combobox: arrows move through them, Enter adds the highlighted one, and ones already added are aria-disabled.

**Do**
- Use it for a short open list of free text: tags, labels, keywords, email recipients.
- Offer the tags people already use as suggestions so they don't create near-duplicates.
- Set max when there's a limit, and say it in the hint.
- Check each tag (an email address) in onValueChange and show a FieldError for a bad one.

**Don't**
- Don't use it to pick from a fixed set — use Checkbox chips (Chip) or a multi-select list.
- Don't use it for a single value — use an Input or a Combobox.
- Don't colour tags by meaning without a word for it.

## Tag input — Tags with suggestions

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<!-- <ayy-tag-input> adds a chip on Enter or a comma and fires "ayy-change" with { values }. -->
<div class="ayy-field" style="inline-size: min(100%, 24rem)">
  <label class="ayy-label" for="task-tags-html">Tags</label>
  <ayy-tag-input name="tags">
    <div class="ayy-tag-input ayy-combobox">
      <span class="ayy-chip ayy-chip--removable ayy-tag-input__tag" data-value="design">design<button type="button" class="ayy-chip__remove" aria-label="Remove design"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M18 6L6.00081 17.9992M17.9992 18L6 6.00085" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg></button></span><span class="ayy-chip ayy-chip--removable ayy-tag-input__tag" data-value="q4">q4<button type="button" class="ayy-chip__remove" aria-label="Remove q4"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M18 6L6.00081 17.9992M17.9992 18L6 6.00085" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg></button></span>
      <input type="text" class="ayy-tag-input__input" autocomplete="off" enterkeyhint="enter" aria-controls="tag-tags-1-html" id="task-tags-html" placeholder="Add a tag" aria-describedby="task-tags-hint-html" />
      <ul id="tag-tags-1-html" class="ayy-combobox__listbox" role="listbox" popover="manual">
        <li role="option" class="ayy-combobox__option" data-value="design" aria-disabled="true">design</li>
        <li role="option" class="ayy-combobox__option" data-value="research">research</li>
        <li role="option" class="ayy-combobox__option" data-value="writing">writing</li>
        <li role="option" class="ayy-combobox__option" data-value="q4" aria-disabled="true">q4</li>
        <li role="option" class="ayy-combobox__option" data-value="urgent">urgent</li>
        <li role="option" class="ayy-combobox__option" data-value="waiting">waiting</li>
        <li class="ayy-combobox__empty" role="none" hidden="">Press Enter to add it</li>
      </ul>
    </div>
  </ayy-tag-input>
  <p class="ayy-field__hint" id="task-tags-hint-html">Press Enter or type a comma after each tag.</p>
</div>
```

React:

```tsx
import { Field, FieldHint, Label, TagInput } from "@danitesler/ayywi/react";

export default function Example() {
  return (
    <Field style={{ inlineSize: "min(100%, 24rem)" }}>
      <Label htmlFor="task-tags">Tags</Label>
      <TagInput
        id="task-tags"
        name="tags"
        defaultValue={["design", "q4"]}
        suggestions={["design", "research", "writing", "q4", "urgent", "waiting"]}
        placeholder="Add a tag"
        aria-describedby="task-tags-hint"
      />
      <FieldHint id="task-tags-hint">Press Enter or type a comma after each tag.</FieldHint>
    </Field>
  );
}
```

## Tag input — Recipients, large, at most 5

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<!-- <ayy-tag-input> adds a chip on Enter or a comma and fires "ayy-change" with { values }. -->
<div class="ayy-field" style="inline-size: min(100%, 28rem)">
  <label class="ayy-label" for="share-with-html">Share with</label>
  <ayy-tag-input max="5">
    <div class="ayy-tag-input ayy-tag-input--lg">
      <span class="ayy-chip ayy-chip--removable ayy-tag-input__tag" data-value="ada@example.com">ada@example.com<button type="button" class="ayy-chip__remove" aria-label="Remove ada@example.com"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M18 6L6.00081 17.9992M17.9992 18L6 6.00085" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg></button></span><span class="ayy-chip ayy-chip--removable ayy-tag-input__tag" data-value="grace@example.com">grace@example.com<button type="button" class="ayy-chip__remove" aria-label="Remove grace@example.com"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M18 6L6.00081 17.9992M17.9992 18L6 6.00085" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg></button></span>
      <input type="text" class="ayy-tag-input__input" autocomplete="off" enterkeyhint="enter" id="share-with-html" placeholder="Email addresses" inputmode="email" aria-describedby="share-with-hint-html" />
    </div>
  </ayy-tag-input>
  <p class="ayy-field__hint" id="share-with-hint-html">Up to 5 people. Paste a list separated by commas.</p>
</div>
```

React:

```tsx
import { Field, FieldHint, Label, TagInput } from "@danitesler/ayywi/react";

export default function Example() {
  return (
    <Field style={{ inlineSize: "min(100%, 28rem)" }}>
      <Label htmlFor="share-with">Share with</Label>
      <TagInput
        id="share-with"
        size="lg"
        max={5}
        defaultValue={["ada@example.com", "grace@example.com"]}
        placeholder="Email addresses"
        inputMode="email"
        aria-describedby="share-with-hint"
      />
      <FieldHint id="share-with-hint">Up to 5 people. Paste a list separated by commas.</FieldHint>
    </Field>
  );
}
```

---
Part of @danitesler/ayywi 0.0.1: load `dist/ayywi.min.css` (and `dist/elements.global.js` for the <ayy-*> elements). The rules every screen follows: [llms-full.txt#rules](../llms-full.txt#rules). Every component: [llms.txt](../llms.txt).
