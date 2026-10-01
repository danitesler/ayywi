# Switch

Category: Forms. On/off toggle for a setting that applies immediately. A native checkbox with role="switch".

**Classes**
- `.ayy-switch` — On <input type="checkbox" role="switch"> (preferred) or <button role="switch" aria-checked>. Thumb is ::before.

**States**
- `:checked / aria-checked="true"` — On.
- `disabled` — Dimmed, not-allowed.

**JS (framework-free)**: switchClass constant

**React** — `import { Switch } from "ayywi/react";`
- `<Switch>` renders <input type="checkbox" role="switch">. Props: `checked / defaultChecked` Controlled / uncontrolled, same as a checkbox.; `onCheckedChange` (checked: boolean) => void; `...rest` All native <input> attributes (name, value, disabled, required…).

**Accessibility**
- Always pair with a <label for> (Field inline) or aria-label.
- Space toggles it; that's native checkbox behaviour.
- The thumb direction flips automatically in RTL.

**Do**
- Use a switch for settings that take effect instantly (enable sync, dark mode).
- Make the label describe the 'on' state: 'Sync on save', not 'Toggle sync'.

**Don't**
- Don't use a switch for choices submitted later with a form's Save button — a checkbox reads better there.
- Don't use a switch to choose between more than two options — use Tabs or a select.
- Don't require a Save click after flipping a switch.

## Switch — States

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<div class="ayy-stack">
  <div class="ayy-field ayy-field--inline">
    <input class="ayy-switch" type="checkbox" role="switch" id="sw-sync-html" checked />
    <label class="ayy-label" for="sw-sync-html">Sync on save</label>
  </div>
  <div class="ayy-field ayy-field--inline">
    <input class="ayy-switch" type="checkbox" role="switch" id="sw-telemetry-html" />
    <label class="ayy-label" for="sw-telemetry-html">Share anonymous usage</label>
  </div>
  <div class="ayy-field ayy-field--inline">
    <input class="ayy-switch" type="checkbox" role="switch" id="sw-disabled-html" disabled checked />
    <label class="ayy-label" for="sw-disabled-html">Managed by your organisation</label>
  </div>
</div>
```

React:

```tsx
import { Field, Label, Switch } from "ayywi/react";

export default function Example() {
  return (
    <div className="ayy-stack">
      <Field inline>
        <Switch id="sw-sync" defaultChecked />
        <Label htmlFor="sw-sync">Sync on save</Label>
      </Field>
      <Field inline>
        <Switch id="sw-telemetry" />
        <Label htmlFor="sw-telemetry">Share anonymous usage</Label>
      </Field>
      <Field inline>
        <Switch id="sw-disabled" disabled defaultChecked />
        <Label htmlFor="sw-disabled">Managed by your organisation</Label>
      </Field>
    </div>
  );
}
```

---
Part of ayywi 0.4.0: load `dist/ayywi.min.css` (and `dist/elements.global.js` for the <ayy-*> elements). The rules every screen follows: [llms-full.txt#rules](../llms-full.txt#rules). Every component: [llms.txt](../llms.txt).
