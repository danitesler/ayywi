# Checkbox

Category: Forms. Native checkbox with a drawn box, check mark and indeterminate state.

**Classes**
- `.ayy-checkbox` — On <input type="checkbox">. Draws the box and mark; size follows density.

**States**
- `default` — A box --ayy-size-check square with a line-hover border on a wash fill.
- `hover` (`:hover`) — Border turns text-soft.
- `pressed` — doesn't apply: No pressed look; it toggles on release.
- `focus` (`:focus-visible`) — 2px ring, 2px offset.
- `disabled` (`:disabled`) — --ayy-opacity-disabled, not-allowed cursor. Forced colours: GrayText border (and fill when checked).
- `selected` (`:checked`) — Primary fill and border with a primary-fg tick that springs in.
- `error` (`aria-invalid="true"`) — Destructive border. Forced colours: dashed.
- `loading` — doesn't apply: Toggles are instant; if saving fails, revert it and say so in a toast.
- `indeterminate` (`:indeterminate (el.indeterminate = true; React: indeterminate)`) — Primary fill with a bar instead of the tick: some of a group selected.

**Sizes**
- Density — --ayy-size-check: 16px compact, 18 comfortable, 20 touch. Wrap it in a .ayy-label so the label is part of the hit area.
- Width — Fixed square.

**JS (framework-free)**: checkboxClass constant

**React** — `import { Checkbox } from "ayywi/react";`
- `<Checkbox>` renders <input type="checkbox">. Props: `indeterminate` boolean — mixed state; `onCheckedChange` (checked: boolean) => void; `checked / defaultChecked` Controlled / uncontrolled.; `...rest` All native <input> attributes.

**Accessibility**
- Wrap it in a <label class="ayy-label"> with the text, or pair with <label for>.
- Indeterminate is announced as "mixed" automatically.
- Group related checkboxes in a <fieldset> with a <legend>.

**Do**
- Use a checkbox for choices submitted with a form (terms, preferences saved with a Save button).
- Use checkboxes to select several items in a list or table, with an indeterminate select-all.
- Phrase labels positively: "Email me updates", not "Don't email me".

**Don't**
- Don't use a checkbox for settings that apply instantly — use Switch.
- Don't use checkboxes to pick exactly one option — use Radio.
- Don't use a checkbox to trigger an immediate action.

## Checkbox — States

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<div class="ayy-stack">
  <label class="ayy-label"><input type="checkbox" class="ayy-checkbox" checked /> Email me when a deploy fails</label>
  <label class="ayy-label"><input type="checkbox" class="ayy-checkbox" /> Weekly summary</label>
  <!-- Indeterminate is a DOM property, not an attribute: set it from JS with input.indeterminate = true -->
  <label class="ayy-label"><input type="checkbox" class="ayy-checkbox" /> Select all projects</label>
  <label class="ayy-label"><input type="checkbox" class="ayy-checkbox" disabled checked /> Security alerts (always on)</label>
</div>
```

React:

```tsx
import { Checkbox } from "ayywi/react";

export default function Example() {
  return (
    <div className="ayy-stack">
      <label className="ayy-label">
        <Checkbox defaultChecked />
        Email me when a deploy fails
      </label>
      <label className="ayy-label">
        <Checkbox />
        Weekly summary
      </label>
      <label className="ayy-label">
        <Checkbox indeterminate />
        Select all projects
      </label>
      <label className="ayy-label">
        <Checkbox disabled defaultChecked />
        Security alerts (always on)
      </label>
    </div>
  );
}
```

---
Part of ayywi 0.4.0: load `dist/ayywi.min.css` (and `dist/elements.global.js` for the <ayy-*> elements). The rules every screen follows: [llms-full.txt#rules](../llms-full.txt#rules). Every component: [llms.txt](../llms.txt).
