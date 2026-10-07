# Select

Category: Forms. Styled native <select>. Keeps the OS picker, keyboard handling and form behaviour. Also called: select, native-select.

**Classes**
- `.ayy-select` — Wrapper element. Draws the chevron and sets the height.
- `.ayy-select__control` — On the <select> inside the wrapper.
- `.ayy-select--sm` — Small.
- `.ayy-select--lg` — Large.

**States**
- `default` — Native <select> with a wash fill, line-strong border and a muted chevron at the inline end; the options popup is the OS one.
- `hover` (`.ayy-select__control:hover`) — Border turns line-hover.
- `pressed` — doesn't apply: Pressing opens the OS picker, which draws its own state.
- `focus` (`.ayy-select__control:focus-visible`) — 2px ring just inside the edge; the border goes transparent.
- `disabled` (`.ayy-select__control:disabled`) — Control and chevron dim to --ayy-opacity-disabled, not-allowed cursor.
- `selected` — doesn't apply: The chosen option shows as the control's text; the OS marks it in the popup.
- `error` (`.ayy-select__control[aria-invalid="true"]`) — Border 60% destructive, destructive focus ring. Forced colours: dashed border.
- `loading` — doesn't apply: No loading look; disable it with a "Loading…" option until the options arrive, or use a Skeleton for the form.
- `multiple` (`multiple, or size > 1`) — Renders a list box: no fixed height, no chevron.

**Sizes**
- `sm` — Control sm height (28px compact, 32 comfortable, 40 touch), sm text.
- `md` (default) — Control md height (32px compact, 40 comfortable, 44 touch).
- `lg` — Control lg height (40px compact, 48 comfortable, 52 touch), lg text.
- Density — Height and text follow data-density.
- Width — Fills its container; long option text is cut with an ellipsis.

**JS (framework-free)**: selectClass({ size?, className? }) → string for the wrapper; selectControlClass constant for the <select>

**React** — `import { Select } from "@danitesler/ayywi/react";`
- `<Select>` renders <div class="ayy-select"><select class="ayy-select__control">. Props: `size` "sm" | "md" | "lg"; `wrapperProps` Props for the wrapper <div>; `...rest` All native <select> attributes; className goes to the <select>.

**Accessibility**
- Label it like any input (Field + Label with for/id).
- The native picker is fully accessible and mobile-friendly — don't replace it without a strong reason.

**Do**
- Use a select to choose one option from a longer list (country, time zone, role).
- Put a sensible default first, or a disabled placeholder option.

**Don't**
- Don't use a select for 2–5 options that should all be visible — use Radio, or a Segmented control when the choice changes a view.
- Don't use a select for actions — use a Dropdown menu.
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
Part of @danitesler/ayywi 0.0.1: load `dist/ayywi.min.css` (and `dist/elements.global.js` for the <ayy-*> elements). The rules every screen follows: [llms-full.txt#rules](../llms-full.txt#rules). Every component: [llms.txt](../llms.txt).
