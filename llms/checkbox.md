# Checkbox

Category: Forms. A box for turning an option on or off, or for picking several items from a list. It's the native checkbox with a clearer look, and it can show a mixed state when only some of a group is selected. Also called: checkbox, check-box, tickbox.

**Classes**
- `.ayy-checkbox` — On <input type="checkbox">. Draws the box and mark; size follows density.
- `.ayy-checkbox--sm` — Small box (--ayy-size-check-sm). The label that wraps it, or sits beside it in an inline Field, takes the small control text.
- `.ayy-checkbox--lg` — Large box (--ayy-size-check-lg) and large label text.

**States**
- `default` — A box --ayy-size-check square with a line-hover border (or --ayy-check-color) on a wash fill.
- `hover` (`:hover`) — Border turns text-soft.
- `pressed` — doesn't apply: No pressed look; it toggles on release.
- `focus` (`:focus-visible`) — 2px ring, 2px offset.
- `disabled` (`:disabled`) — --ayy-opacity-disabled, not-allowed cursor. Forced colours: GrayText border (and fill when checked).
- `selected` (`:checked`) — Primary fill and border (or --ayy-check-color) with a primary-fg tick (or --ayy-check-fg) that springs in.
- `error` (`aria-invalid="true"`) — Destructive border. Forced colours: dashed.
- `loading` — doesn't apply: Toggles are instant; if saving fails, revert it and say so in a toast.
- `indeterminate` (`:indeterminate (el.indeterminate = true; React: indeterminate)`) — Primary fill with a bar instead of the tick: some of a group selected.

**Sizes**
- `sm` — --ayy-size-check-sm: 14px compact, 16 comfortable, 18 touch.
- `md` (default) — --ayy-size-check: 16px compact, 18 comfortable, 20 touch.
- `lg` — --ayy-size-check-lg: 20px compact, 22 comfortable, 24 touch.
- Density — Each size grows a step with data-density. Wrap the box in a .ayy-label so the label is part of the hit area.
- Width — Fixed square.

**React** — `import { Checkbox } from "@danitesler/ayywi/react";`
- `<Checkbox>` renders <input type="checkbox">. Props: `size` "sm" | "md" | "lg" (visual size; the native size attribute is not exposed); `indeterminate` boolean — mixed state; `onCheckedChange` (checked: boolean) => void; `checked / defaultChecked` Controlled / uncontrolled.; `...rest` All native <input> attributes.

**Accessibility**
- A colour alone doesn't say what it means: keep the priority or status in the label too.
- Wrap it in a <label class="ayy-label"> with the text, or pair with <label for>.
- Indeterminate is announced as "mixed" automatically.
- Group related checkboxes in a <fieldset> with a <legend>.

**Do**
- Use a checkbox for choices submitted with a form (terms, preferences saved with a Save button).
- Use checkboxes to select several items in a list or table, with an indeterminate select-all.
- Phrase labels positively: "Email me updates", not "Don't email me".
- Match the size to the controls around it: sm beside sm buttons and inputs, lg in forms made for touch.

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
import { Checkbox } from "@danitesler/ayywi/react";

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

## Checkbox — Coloured by priority

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<div class="ayy-stack">
  <label class="ayy-label"><input type="checkbox" class="ayy-checkbox" style="--ayy-check-color: var(--ayy-color-destructive)" checked /> High priority: send the invoice</label>
  <label class="ayy-label"><input type="checkbox" class="ayy-checkbox" style="--ayy-check-color: var(--ayy-color-warning)" /> Medium priority: book the venue</label>
  <label class="ayy-label"><input type="checkbox" class="ayy-checkbox" style="--ayy-check-color: var(--ayy-color-info)" checked /> Low priority: tidy the shared drive</label>
</div>
```

React:

```tsx
import { Checkbox } from "@danitesler/ayywi/react";

export default function Example() {
  return (
    <div className="ayy-stack">
      <label className="ayy-label">
        <Checkbox defaultChecked style={{ "--ayy-check-color": "var(--ayy-color-destructive)" } as React.CSSProperties} />
        High priority: send the invoice
      </label>
      <label className="ayy-label">
        <Checkbox style={{ "--ayy-check-color": "var(--ayy-color-warning)" } as React.CSSProperties} />
        Medium priority: book the venue
      </label>
      <label className="ayy-label">
        <Checkbox defaultChecked style={{ "--ayy-check-color": "var(--ayy-color-info)" } as React.CSSProperties} />
        Low priority: tidy the shared drive
      </label>
    </div>
  );
}
```

## Checkbox — Sizes

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<div class="ayy-stack">
  <label class="ayy-label"><input type="checkbox" class="ayy-checkbox ayy-checkbox--sm" checked /> Small: dense tables and menus</label>
  <label class="ayy-label"><input type="checkbox" class="ayy-checkbox" checked /> Medium: the default</label>
  <label class="ayy-label"><input type="checkbox" class="ayy-checkbox ayy-checkbox--lg" checked /> Large: forms people fill in on a phone</label>
</div>
```

React:

```tsx
import { Checkbox } from "@danitesler/ayywi/react";

export default function Example() {
  return (
    <div className="ayy-stack">
      <label className="ayy-label">
        <Checkbox size="sm" defaultChecked /> Small: dense tables and menus
      </label>
      <label className="ayy-label">
        <Checkbox defaultChecked /> Medium: the default
      </label>
      <label className="ayy-label">
        <Checkbox size="lg" defaultChecked /> Large: forms people fill in on a phone
      </label>
    </div>
  );
}
```

---
Part of @danitesler/ayywi 0.1.2: load `dist/ayywi.min.css` (and `dist/elements.global.js` for the <ayy-*> elements). The rules every screen follows: [llms-full.txt#rules](../llms-full.txt#rules). Every component: [llms.txt](../llms.txt).
