# Record picker

Category: Forms. A tag field whose chips are records picked from a list: one person to assign, many labels to apply. Type to filter, Enter picks the active record, Backspace in the empty field removes the last, and a create row turns new text into a record. Also called: record-picker, record-select, record-field, people-picker, assignee-picker, entity-picker, multi-select-picker.

**Classes**
- `.ayy-record-picker` — Root: an ayy-tag-input and ayy-combobox holding the chips, the input, the clear button and the listbox.
- `.ayy-record-picker--multiple` — Several records: chips wrap, and the list stays open after each pick (aria-multiselectable).
- `.ayy-record-picker__tag` — One picked record, an .ayy-chip--removable.ayy-tag-input__tag <span data-value> with a named .ayy-chip__remove button; the label shrinks so the × stays inside.
- `.ayy-record-picker__tag-label` — The record's name inside a chip: it shrinks and ellipsises when the name is longer than the field, instead of pushing the × out.
- `.ayy-record-picker__input` — The borderless <input role="combobox"> after the chips; the field's id, label and aria-describedby go on it.
- `.ayy-record-picker__clear` — The icon button after the input that clears every chip, named by aria-label ("Clear"); hidden while nothing is picked.
- `.ayy-record-picker__listbox` — The .ayy-combobox__listbox: records, the create row and the empty row. At least as wide as the field; at most 24rem unless the field is wider.
- `.ayy-record-picker__option` — One record, an .ayy-combobox__option[role="option"] with data-value, data-label and data-keywords. Active: data-active="true"; picked: aria-selected="true" and a check.
- `.ayy-record-picker__option-body` — The two lines after the icon: name and description. Takes the row's leftover width.
- `.ayy-record-picker__option-label` — The record's name, one line with an ellipsis.
- `.ayy-record-picker__description` — The muted second line (an email, a role, a key), one line with an ellipsis.
- `.ayy-record-picker__create` — The last option: "Create “Maya”" when creatable, the query isn't empty and no record matches exactly.
- `.ayy-record-picker__create-label` — The create row's text, written by the controller from createLabel.
- `.ayy-record-picker__empty` — The muted, centred row when nothing matches ("No people").

**States**
- `default` — A Tag input wash field with the picked records as chips, a text box and the clear button; list closed.
- `hover` (`.ayy-record-picker__clear:hover (hover devices) and a list option under the pointer`) — The clear button gets a --ayy-color-wash-hover circle; an option gets Combobox's wash-hover.
- `pressed` — doesn't apply: No pressed look; the picked chip is the feedback.
- `focus` (`.ayy-record-picker__clear:focus-visible and the field's input`) — 2px --ayy-color-ring on the clear button, Tag input's ring around the field; each chip's × has its own.
- `disabled` (`disabled on the input and on the chips' × and clear buttons`) — Tag input dims the field to --ayy-opacity-disabled; the buttons dim too.
- `selected` (`aria-selected="true" on an .ayy-record-picker__option`) — A check at the inline end, never colour alone. Picking it again removes it in multiple mode and replaces it in single.
- `error` (`aria-invalid="true" on the input`) — Tag input's destructive border and focus ring; say why in a FieldError.
- `loading` — doesn't apply: No loading look. With manual, show a Spinner or a "Searching…" row and call refresh().
- `open` (`input[aria-expanded="true"]`) — The listbox opens under the field. Once there's a query the first match is active and aria-activedescendant points at it; a focused or clicked field opens the full list with no row active.

**Sizes**
- `sm` — Tag input's sm: at least --ayy-size-control-sm, sm text.
- `md` (default) — Tag input's md: at least --ayy-size-control-md (32px compact, 40px comfortable, 44px touch).
- `lg` — Tag input's lg: at least --ayy-size-control-lg, more padding, lg text.
- Density — The field and chips follow data-density through Tag input; the clear button is as tall as the field's inner height, so the field keeps its size token.
- Width — Fills its container; chips wrap in multiple mode. The listbox is at least the field's width, and no wider than 24rem unless the field is wider.

**Custom element** `<ayy-record-picker>` (@danitesler/ayywi/elements) — An .ayy-record-picker with the picked records' chips, its input, the clear button and the .ayy-record-picker__listbox of .ayy-record-picker__option rows.
- attribute `multiple`: Pick several records; the list stays open after each pick.
- attribute `creatable`: Offer a create row for the typed text when no record matches.
- attribute `manual`: Don't filter: replace the options yourself (a search API), then call refresh().
- attribute `name`: Form name: a hidden input per picked id carries it.
- event `ayy-change`: { ids, options: [{ id, label }] } — after every pick, removal and clear.
- event `ayy-create`: { id, label } — when the create row is picked; the chip already exists. Replace the slug id with the saved record's id.

**React** — `import { RecordPicker } from "@danitesler/ayywi/react";`
- `<RecordPicker>` renders <div class="ayy-record-picker ayy-tag-input ayy-combobox"> chips + <input role="combobox"> + clear button + <ul class="ayy-combobox__listbox">; other props go on the input, className on the root. Props: `options` RecordPickerOption[] — id, label, description?, icon?, keywords?, disabled?; `value / defaultValue` string[] — the picked ids; value makes it controlled; `onValueChange` (ids: string[], options: RecordPickerOption[]) => void; `multiple` boolean — several records; the list stays open; `creatable` boolean — offer a create row; `onCreate` (label) => RecordPickerOption | void — return the new option to select it, or update options and value yourself; `createLabel` (label) => string — the create row's text. Default "Create “<label>”"; `emptyText` ReactNode — when nothing matches. Default "No matches"; `size` "sm" | "md" | "lg"; `name` string — a hidden input per picked id; `clearable` boolean — show the clear button. Default true; `clearLabel` string — its name. Default "Clear"; `removeLabel` (option) => string — a chip's × name. Default "Remove <label>"; `className` string — on the root

**Accessibility**
- Label the input with <Label htmlFor> and aria-labelledby (or aria-label); the controller copies that name onto the listbox, so the list reads as "Assignee".
- The input keeps focus: arrows move aria-activedescendant, Enter picks, Escape closes and clears the query, and the pointer never moves focus into the list.
- In multiple mode the list is aria-multiselectable: picked records carry aria-selected and a check, and picking one again removes it.
- Each chip's × is named "Remove Ada Lovelace", and Backspace in the empty field removes the last chip.

**Do**
- Use it to attach records to something: an assignee, labels, projects, reviewers.
- Give options a description when names repeat, and keywords for what people type (an email, a project key).
- Turn on creatable only when a new record is allowed, and save it in onCreate so its id is the real one.

**Don't**
- Don't use it for free text — use a Tag input for tags or recipients, or an Input for one value.
- Don't use it for a short known list — use a Select, a Segmented control or a Combobox.
- Don't rely on colour for picked rows; keep the check.

## Record picker — Assignee, one person

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<!-- <ayy-record-picker> filters as you type; Enter picks the active record, and "ayy-change" carries { ids, options }. -->
<div class="ayy-field" style="inline-size: min(100%, 24rem)">
  <label class="ayy-label" id="assignee-label-html" for="assignee-html">Assignee</label>
  <ayy-record-picker>
    <div class="ayy-record-picker ayy-tag-input ayy-combobox">
      <input type="text" role="combobox" aria-autocomplete="list" aria-expanded="false" aria-controls="assignee-listbox-html" autocomplete="off" class="ayy-tag-input__input ayy-record-picker__input" id="assignee-html" aria-labelledby="assignee-label-html" aria-describedby="assignee-hint-html" placeholder="Add a person" />
      <button type="button" class="ayy-record-picker__clear" aria-label="Clear"><svg class="ayy-icon" data-ayy-icon="circle-x" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M14.9994 15L9 9M9.00064 15L15 9" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg></button>
      <ul id="assignee-listbox-html" class="ayy-combobox__listbox ayy-record-picker__listbox" role="listbox" popover="manual">
        <li role="option" class="ayy-combobox__option ayy-record-picker__option" data-value="ada" data-label="Ada Lovelace" data-keywords="engineering" data-active="false" aria-selected="false">
          <svg class="ayy-icon" data-ayy-icon="user" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20 21.0001C19.713 17.269 16.7289 14.3151 12.995 14.0662L12 13.9999C11.6446 14.0096 11.3134 14.0225 11.0008 14.0378C7.3 14.2192 4.28417 17.3057 4 21.0001" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><circle cx="12" cy="6.99988" r="4" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></circle></svg>
          <span class="ayy-record-picker__option-body"><span class="ayy-record-picker__option-label">Ada Lovelace</span><span class="ayy-record-picker__description">ada@example.com</span></span>
        </li>
        <li role="option" class="ayy-combobox__option ayy-record-picker__option" data-value="grace" data-label="Grace Hopper" data-keywords="engineering" data-active="false" aria-selected="false">
          <svg class="ayy-icon" data-ayy-icon="user" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20 21.0001C19.713 17.269 16.7289 14.3151 12.995 14.0662L12 13.9999C11.6446 14.0096 11.3134 14.0225 11.0008 14.0378C7.3 14.2192 4.28417 17.3057 4 21.0001" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><circle cx="12" cy="6.99988" r="4" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></circle></svg>
          <span class="ayy-record-picker__option-body"><span class="ayy-record-picker__option-label">Grace Hopper</span><span class="ayy-record-picker__description">grace@example.com</span></span>
        </li>
        <li role="option" class="ayy-combobox__option ayy-record-picker__option" data-value="alexandria" data-label="Alexandria Ocasio-Cortez" data-keywords="design" data-active="false" aria-selected="false">
          <svg class="ayy-icon" data-ayy-icon="user" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20 21.0001C19.713 17.269 16.7289 14.3151 12.995 14.0662L12 13.9999C11.6446 14.0096 11.3134 14.0225 11.0008 14.0378C7.3 14.2192 4.28417 17.3057 4 21.0001" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><circle cx="12" cy="6.99988" r="4" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></circle></svg>
          <span class="ayy-record-picker__option-body"><span class="ayy-record-picker__option-label">Alexandria Ocasio-Cortez</span><span class="ayy-record-picker__description">alexandria@example.com</span></span>
        </li>
        <li role="option" class="ayy-combobox__option ayy-record-picker__option" data-value="alan" data-label="Alan Turing" data-keywords="research" data-active="false" aria-selected="false">
          <svg class="ayy-icon" data-ayy-icon="user" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20 21.0001C19.713 17.269 16.7289 14.3151 12.995 14.0662L12 13.9999C11.6446 14.0096 11.3134 14.0225 11.0008 14.0378C7.3 14.2192 4.28417 17.3057 4 21.0001" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><circle cx="12" cy="6.99988" r="4" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></circle></svg>
          <span class="ayy-record-picker__option-body"><span class="ayy-record-picker__option-label">Alan Turing</span><span class="ayy-record-picker__description">alan@example.com</span></span>
        </li>
        <li role="none" class="ayy-combobox__empty ayy-record-picker__empty" hidden>No people</li>
      </ul>
    </div>
  </ayy-record-picker>
  <p class="ayy-field__hint" id="assignee-hint-html">Type to find someone, then press Enter.</p>
</div>
```

React:

```tsx
import { UserIcon } from "@hugeicons/core-free-icons";
import { Field, FieldHint, Icon, Label, RecordPicker, type RecordPickerOption } from "@danitesler/ayywi/react";

const people: RecordPickerOption[] = [
  { id: "ada", label: "Ada Lovelace", description: "ada@example.com", keywords: "engineering", icon: <Icon icon={UserIcon} name="user" /> },
  { id: "grace", label: "Grace Hopper", description: "grace@example.com", keywords: "engineering", icon: <Icon icon={UserIcon} name="user" /> },
  { id: "alexandria", label: "Alexandria Ocasio-Cortez", description: "alexandria@example.com", keywords: "design", icon: <Icon icon={UserIcon} name="user" /> },
  { id: "alan", label: "Alan Turing", description: "alan@example.com", keywords: "research", icon: <Icon icon={UserIcon} name="user" /> },
];

export default function Example() {
  return (
    <Field style={{ inlineSize: "min(100%, 24rem)" }}>
      <Label id="assignee-label" htmlFor="assignee">
        Assignee
      </Label>
      <RecordPicker
        id="assignee"
        aria-labelledby="assignee-label"
        aria-describedby="assignee-hint"
        options={people}
        placeholder="Add a person"
        emptyText="No people"
      />
      <FieldHint id="assignee-hint">Type to find someone, then press Enter.</FieldHint>
    </Field>
  );
}
```

## Record picker — Labels, several and creatable

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<!-- <ayy-record-picker multiple creatable> keeps the list open, adds a chip per pick, and fires "ayy-create" ({ id, label }) for a new record. -->
<div class="ayy-field" style="inline-size: min(100%, 24rem)">
  <label class="ayy-label" id="labels-label-html" for="labels-input-html">Labels</label>
  <ayy-record-picker multiple creatable name="labels">
    <div class="ayy-record-picker ayy-tag-input ayy-combobox ayy-record-picker--multiple">
      <input type="text" role="combobox" aria-autocomplete="list" aria-expanded="false" aria-controls="labels-listbox-html" autocomplete="off" class="ayy-tag-input__input ayy-record-picker__input" id="labels-input-html" aria-labelledby="labels-label-html" aria-describedby="labels-hint-html" placeholder="Add a label" />
      <button type="button" class="ayy-record-picker__clear" aria-label="Clear"><svg class="ayy-icon" data-ayy-icon="circle-x" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M14.9994 15L9 9M9.00064 15L15 9" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg></button>
      <ul id="labels-listbox-html" class="ayy-combobox__listbox ayy-record-picker__listbox" role="listbox" aria-multiselectable="true" popover="manual">
        <li role="option" class="ayy-combobox__option ayy-record-picker__option" data-value="design" data-label="Design" data-active="false" aria-selected="false">
          <svg class="ayy-icon" data-ayy-icon="tag" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="1.5" cy="1.5" r="1.5" transform="matrix(1 0 0 -1 16 8.00024)" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></circle><path d="M2.77423 11.1439C1.77108 12.2643 1.7495 13.9546 2.67016 15.1437C4.49711 17.5033 6.49674 19.5029 8.85633 21.3298C10.0454 22.2505 11.7357 22.2289 12.8561 21.2258C15.8979 18.5022 18.6835 15.6559 21.3719 12.5279C21.6377 12.2187 21.8039 11.8397 21.8412 11.4336C22.0062 9.63798 22.3452 4.46467 20.9403 3.05974C19.5353 1.65481 14.362 1.99377 12.5664 2.15876C12.1603 2.19608 11.7813 2.36233 11.472 2.62811C8.34412 5.31646 5.49781 8.10211 2.77423 11.1439Z" stroke="currentColor" stroke-width="1.5"></path><path d="M7.00002 14.0002L10 17.0002" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg>
          <span class="ayy-record-picker__option-body"><span class="ayy-record-picker__option-label">Design</span></span>
        </li>
        <li role="option" class="ayy-combobox__option ayy-record-picker__option" data-value="engineering" data-label="Engineering" data-active="false" aria-selected="false">
          <svg class="ayy-icon" data-ayy-icon="tag" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="1.5" cy="1.5" r="1.5" transform="matrix(1 0 0 -1 16 8.00024)" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></circle><path d="M2.77423 11.1439C1.77108 12.2643 1.7495 13.9546 2.67016 15.1437C4.49711 17.5033 6.49674 19.5029 8.85633 21.3298C10.0454 22.2505 11.7357 22.2289 12.8561 21.2258C15.8979 18.5022 18.6835 15.6559 21.3719 12.5279C21.6377 12.2187 21.8039 11.8397 21.8412 11.4336C22.0062 9.63798 22.3452 4.46467 20.9403 3.05974C19.5353 1.65481 14.362 1.99377 12.5664 2.15876C12.1603 2.19608 11.7813 2.36233 11.472 2.62811C8.34412 5.31646 5.49781 8.10211 2.77423 11.1439Z" stroke="currentColor" stroke-width="1.5"></path><path d="M7.00002 14.0002L10 17.0002" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg>
          <span class="ayy-record-picker__option-body"><span class="ayy-record-picker__option-label">Engineering</span></span>
        </li>
        <li role="option" class="ayy-combobox__option ayy-record-picker__option" data-value="marketing" data-label="Marketing" data-active="false" aria-selected="false">
          <svg class="ayy-icon" data-ayy-icon="tag" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="1.5" cy="1.5" r="1.5" transform="matrix(1 0 0 -1 16 8.00024)" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></circle><path d="M2.77423 11.1439C1.77108 12.2643 1.7495 13.9546 2.67016 15.1437C4.49711 17.5033 6.49674 19.5029 8.85633 21.3298C10.0454 22.2505 11.7357 22.2289 12.8561 21.2258C15.8979 18.5022 18.6835 15.6559 21.3719 12.5279C21.6377 12.2187 21.8039 11.8397 21.8412 11.4336C22.0062 9.63798 22.3452 4.46467 20.9403 3.05974C19.5353 1.65481 14.362 1.99377 12.5664 2.15876C12.1603 2.19608 11.7813 2.36233 11.472 2.62811C8.34412 5.31646 5.49781 8.10211 2.77423 11.1439Z" stroke="currentColor" stroke-width="1.5"></path><path d="M7.00002 14.0002L10 17.0002" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg>
          <span class="ayy-record-picker__option-body"><span class="ayy-record-picker__option-label">Marketing</span></span>
        </li>
        <li role="option" class="ayy-combobox__option ayy-record-picker__option" data-value="operations" data-label="Operations" data-active="false" aria-selected="false">
          <svg class="ayy-icon" data-ayy-icon="tag" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="1.5" cy="1.5" r="1.5" transform="matrix(1 0 0 -1 16 8.00024)" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></circle><path d="M2.77423 11.1439C1.77108 12.2643 1.7495 13.9546 2.67016 15.1437C4.49711 17.5033 6.49674 19.5029 8.85633 21.3298C10.0454 22.2505 11.7357 22.2289 12.8561 21.2258C15.8979 18.5022 18.6835 15.6559 21.3719 12.5279C21.6377 12.2187 21.8039 11.8397 21.8412 11.4336C22.0062 9.63798 22.3452 4.46467 20.9403 3.05974C19.5353 1.65481 14.362 1.99377 12.5664 2.15876C12.1603 2.19608 11.7813 2.36233 11.472 2.62811C8.34412 5.31646 5.49781 8.10211 2.77423 11.1439Z" stroke="currentColor" stroke-width="1.5"></path><path d="M7.00002 14.0002L10 17.0002" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg>
          <span class="ayy-record-picker__option-body"><span class="ayy-record-picker__option-label">Operations</span></span>
        </li>
        <li role="option" class="ayy-combobox__option ayy-record-picker__option" data-value="research" data-label="Research" data-active="false" aria-selected="false">
          <svg class="ayy-icon" data-ayy-icon="tag" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="1.5" cy="1.5" r="1.5" transform="matrix(1 0 0 -1 16 8.00024)" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></circle><path d="M2.77423 11.1439C1.77108 12.2643 1.7495 13.9546 2.67016 15.1437C4.49711 17.5033 6.49674 19.5029 8.85633 21.3298C10.0454 22.2505 11.7357 22.2289 12.8561 21.2258C15.8979 18.5022 18.6835 15.6559 21.3719 12.5279C21.6377 12.2187 21.8039 11.8397 21.8412 11.4336C22.0062 9.63798 22.3452 4.46467 20.9403 3.05974C19.5353 1.65481 14.362 1.99377 12.5664 2.15876C12.1603 2.19608 11.7813 2.36233 11.472 2.62811C8.34412 5.31646 5.49781 8.10211 2.77423 11.1439Z" stroke="currentColor" stroke-width="1.5"></path><path d="M7.00002 14.0002L10 17.0002" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg>
          <span class="ayy-record-picker__option-body"><span class="ayy-record-picker__option-label">Research</span></span>
        </li>
        <li role="option" class="ayy-combobox__option ayy-record-picker__create" data-create hidden><span class="ayy-record-picker__create-label"></span></li>
        <li role="none" class="ayy-combobox__empty ayy-record-picker__empty" hidden>No labels</li>
      </ul>
    </div>
  </ayy-record-picker>
  <p class="ayy-field__hint" id="labels-hint-html">Type a new label and pick “Create” to add it.</p>
</div>
```

React:

```tsx
import { Tag01Icon } from "@hugeicons/core-free-icons";
import { useState } from "react";
import { Field, FieldHint, Icon, Label, RecordPicker, type RecordPickerOption } from "@danitesler/ayywi/react";

const initial: RecordPickerOption[] = [
  { id: "design", label: "Design", icon: <Icon icon={Tag01Icon} name="tag" /> },
  { id: "engineering", label: "Engineering", icon: <Icon icon={Tag01Icon} name="tag" /> },
  { id: "marketing", label: "Marketing", icon: <Icon icon={Tag01Icon} name="tag" /> },
  { id: "operations", label: "Operations", icon: <Icon icon={Tag01Icon} name="tag" /> },
  { id: "research", label: "Research", icon: <Icon icon={Tag01Icon} name="tag" /> },
];

export default function Example() {
  const [options, setOptions] = useState(initial);
  const [labels, setLabels] = useState<string[]>([]);
  return (
    <Field style={{ inlineSize: "min(100%, 24rem)" }}>
      <Label id="labels-label" htmlFor="labels-input">
        Labels
      </Label>
      <RecordPicker
        id="labels-input"
        name="labels"
        multiple
        creatable
        aria-labelledby="labels-label"
        aria-describedby="labels-hint"
        options={options}
        value={labels}
        onValueChange={setLabels}
        onCreate={(label) => {
          const option = { id: label.toLocaleLowerCase().replace(/[^a-z0-9]+/g, "-"), label };
          setOptions((current) => [...current, option]);
          return option;
        }}
        placeholder="Add a label"
        emptyText="No labels"
      />
      <FieldHint id="labels-hint">Type a new label and pick “Create” to add it.</FieldHint>
    </Field>
  );
}
```

---
Part of @danitesler/ayywi 0.1.2: load `dist/ayywi.min.css` (and `dist/elements.global.js` for the <ayy-*> elements). The rules every screen follows: [llms-full.txt#rules](../llms-full.txt#rules). Every component: [llms.txt](../llms.txt).
