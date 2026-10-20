# Select

Category: Forms. Styled native <select>. With a mouse or trackpad its options open in ayywi's own list; touch screens keep the OS picker. Value, form behaviour and change events stay native. Also called: select, native-select, picker, listbox, custom-select.

**Classes**
- `.ayy-select` — Wrapper element. Draws the chevron and sets the height.
- `.ayy-select__control` — On the <select> inside the wrapper.
- `.ayy-select__list` — The options list (role="listbox" popover) that React Select and "@danitesler/ayywi/elements" build from the <option>s while it's open. Don't write it yourself.
- `.ayy-select__option` — One option in the list (role="option"); aria-selected="true" on the chosen one, aria-disabled for a disabled <option>.
- `.ayy-select__label` — An <optgroup>'s label in the list.
- `.ayy-select--sm` — Small.
- `.ayy-select--lg` — Large.

**States**
- `default` — Native <select> with a wash fill, line-strong border and a muted chevron at the inline end.
- `hover` (`.ayy-select__control:hover; .ayy-select__option:hover`) — Border turns line-hover; an option in the list gets the wash-hover background.
- `pressed` — doesn't apply: Pressing opens the options list (the OS picker on touch screens); the list shows the state.
- `focus` (`.ayy-select__control:focus-visible; .ayy-select__option:focus-visible`) — 2px ring just inside the edge; the border goes transparent. In the list the focused option gets the wash-hover background, plus a 2px ring inset by 2px from the keyboard. Forced colours: Highlight fill.
- `disabled` (`.ayy-select__control:disabled; a disabled <option> (aria-disabled on its list option)`) — Control and chevron dim to --ayy-opacity-disabled, not-allowed cursor; a disabled option dims the same way and the arrow keys skip it.
- `selected` (`.ayy-select__option[aria-selected="true"] (the <option> that's selected)`) — The chosen option shows as the control's text; in the list it's semibold with a check at the inline end.
- `error` (`.ayy-select__control[aria-invalid="true"]`) — Border 60% destructive, destructive focus ring. Forced colours: dashed border.
- `loading` — doesn't apply: No loading look; disable it with a "Loading…" option until the options arrive, or use a Skeleton for the form.
- `open` (`.ayy-select__control[aria-expanded="true"] while the list shows`) — Border turns line-hover and the chevron points up; the list fades in and scales up from 97% under the select (above it when there's no room), at least as wide, at most 20rem tall with its own scroll.
- `multiple` (`multiple, or size > 1`) — Renders a list box: no fixed height, no chevron, no options list.

**Sizes**
- `sm` — Control sm height (28px compact, 32 comfortable, 40 touch), sm text.
- `md` (default) — Control md height (32px compact, 40 comfortable, 44 touch).
- `lg` — Control lg height (40px compact, 48 comfortable, 52 touch), lg text.
- Density — Height and text follow data-density.
- Width — Fills its container; long option text is cut with an ellipsis. The list is at least the select's width and at most 24rem; its options are the md control height.

**React** — `import { Select } from "@danitesler/ayywi/react";`
- `<Select>` renders <div class="ayy-select"><select class="ayy-select__control">. Props: `size` "sm" | "md" | "lg"; `wrapperProps` Props for the wrapper <div>; `...rest` All native <select> attributes and events (onChange fires when an option is chosen from the list too); className goes to the <select>.

**Accessibility**
- Label it like any input (Field + Label with for/id); the list takes the same name.
- The list is a role="listbox" of role="option"s: arrows, Home/End and type-ahead move, Enter, Space or a click chooses, Esc, Tab or a click outside closes, and focus goes back to the select.
- Touch screens keep the OS picker, which suits them better. Don't build your own dropdown for choosing a value: this is it.

**Do**
- Use a select to choose one option from a longer list (country, time zone, role).
- Put a sensible default first, or a disabled placeholder option.
- Write a plain <select> with <option>s (or React Select): the list comes with it. In plain HTML load elements.global.js (or import "@danitesler/ayywi/elements").

**Don't**
- Don't use a select for 2–5 options that should all be visible — use Radio, or a Segmented control when the choice changes a view.
- Don't use a select for actions — use a Dropdown menu.
- Don't build a custom dropdown (a button opening a div of choices, a Dropdown menu used as a picker) — use Select, or a Combobox when people should type to filter.
- Don't use a select to search thousands of options — put a search Input group above a List of results instead.
- Don't use a select for yes/no — use a Switch or Checkbox.

## Select — Sizes and states

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<div class="ayy-stack" style="inline-size: min(100%, 20rem)">
  <div class="ayy-field">
    <label class="ayy-label" for="region-html">Region</label>
    <div class="ayy-select">
      <select class="ayy-select__control" id="region-html">
        <option value="us">United States</option>
        <option value="eu" selected>Europe</option>
        <option value="apac">Asia Pacific</option>
      </select>
    </div>
  </div>
  <div class="ayy-select ayy-select--sm">
    <select class="ayy-select__control" aria-label="Sort by">
      <option value="recent">Most recent</option>
      <option value="name">Name</option>
    </select>
  </div>
  <div class="ayy-select">
    <select class="ayy-select__control" aria-label="Plan" disabled>
      <option>Enterprise</option>
    </select>
  </div>
</div>
```

React:

```tsx
import { Field, Label, Select } from "@danitesler/ayywi/react";

export default function Example() {
  return (
    <div className="ayy-stack" style={{ inlineSize: "min(100%, 20rem)" }}>
      <Field>
        <Label htmlFor="region">Region</Label>
        <Select id="region" defaultValue="eu">
          <option value="us">United States</option>
          <option value="eu">Europe</option>
          <option value="apac">Asia Pacific</option>
        </Select>
      </Field>
      <Select size="sm" aria-label="Sort by" defaultValue="recent">
        <option value="recent">Most recent</option>
        <option value="name">Name</option>
      </Select>
      <Select disabled aria-label="Plan">
        <option>Enterprise</option>
      </Select>
    </div>
  );
}
```

---
Part of @danitesler/ayywi 0.1.1: load `dist/ayywi.min.css` (and `dist/elements.global.js` for the <ayy-*> elements). The rules every screen follows: [llms-full.txt#rules](../llms-full.txt#rules). Every component: [llms.txt](../llms.txt).
