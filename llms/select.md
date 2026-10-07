# Select

Category: Forms. Styled native <select>. Keeps the OS picker, keyboard handling and form behaviour. Also called: select, native-select.

**Classes**
- `.ayy-select` — Wrapper element. Draws the chevron and sets the height.
- `.ayy-select__control` — On the <select> inside the wrapper.
- `.ayy-select--sm` — Small.
- `.ayy-select--lg` — Large.

**States**
- `aria-invalid="true"` — Red border (on the <select>).
- `disabled` — Dimmed, chevron too.
- `multiple` — Renders as a list box: auto height, no chevron.

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
