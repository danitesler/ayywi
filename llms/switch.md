# Switch

Category: Forms. An on/off control for a setting that takes effect right away. It's a native checkbox with a switch look and the right accessible role. Also called: switch, toggle, toggle-switch.

**Classes**
- `.ayy-switch` — On <input type="checkbox" role="switch"> (preferred) or <button role="switch" aria-checked>. Thumb is ::before.
- `.ayy-switch--sm` — Small track (--ayy-size-switch-sm). The label beside it in an inline Field, or wrapping it, takes the small control text.
- `.ayy-switch--lg` — Large track (--ayy-size-switch-lg) and large label text.

**States**
- `default` — Off: a pill (wash-hover fill, line-strong border) with a muted thumb at the inline start.
- `hover` (`:hover`) — Border turns line-hover.
- `pressed` — doesn't apply: No pressed look; it flips on release.
- `focus` (`:focus-visible`) — 2px ring, 2px offset.
- `disabled` (`:disabled or [aria-disabled="true"]`) — --ayy-opacity-disabled, not-allowed cursor. Forced colours: GrayText.
- `selected` (`:checked or [aria-checked="true"]`) — On: text-colour track, page-colour thumb slid to the inline end (mirrors in RTL). Forced colours: Highlight.
- `error` — doesn't apply: A switch is always valid; it applies at once. If saving the setting fails, flip it back and say so in a toast.
- `loading` — doesn't apply: Settings switch instantly; don't put a spinner on a switch.

**Sizes**
- `sm` — --ayy-size-switch-sm sets the height: 16px compact, 18 comfortable, 22 touch.
- `md` (default) — --ayy-size-switch sets the height: 20px compact, 22 comfortable, 26 touch.
- `lg` — --ayy-size-switch-lg sets the height: 24px compact, 26 comfortable, 30 touch.
- Density — Each size grows a step with data-density; the width is 1.8× the height.
- Width — Fixed. Put it in an inline Field with its label.

**React** — `import { Switch } from "@danitesler/ayywi/react";`
- `<Switch>` renders <input type="checkbox" role="switch">. Props: `size` "sm" | "md" | "lg" (visual size; the native size attribute is not exposed); `checked / defaultChecked` Controlled / uncontrolled, same as a checkbox.; `onCheckedChange` (checked: boolean) => void; `...rest` All native <input> attributes (name, value, disabled, required…).

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
import { Field, Label, Switch } from "@danitesler/ayywi/react";

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

## Switch — Sizes

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<div class="ayy-stack">
  <div class="ayy-field ayy-field--inline">
    <input type="checkbox" role="switch" class="ayy-switch ayy-switch--sm" id="sw-size-sm" checked />
    <label class="ayy-label" for="sw-size-sm">Small: rows in a dense settings list</label>
  </div>
  <div class="ayy-field ayy-field--inline">
    <input type="checkbox" role="switch" class="ayy-switch" id="sw-size-md" checked />
    <label class="ayy-label" for="sw-size-md">Medium: the default</label>
  </div>
  <div class="ayy-field ayy-field--inline">
    <input type="checkbox" role="switch" class="ayy-switch ayy-switch--lg" id="sw-size-lg" checked />
    <label class="ayy-label" for="sw-size-lg">Large: a main on/off setting</label>
  </div>
</div>
```

React:

```tsx
import { Field, Label, Switch } from "@danitesler/ayywi/react";

export default function Example() {
  return (
    <div className="ayy-stack">
      <Field inline>
        <Switch id="sw-size-sm" size="sm" defaultChecked />
        <Label htmlFor="sw-size-sm">Small: rows in a dense settings list</Label>
      </Field>
      <Field inline>
        <Switch id="sw-size-md" defaultChecked />
        <Label htmlFor="sw-size-md">Medium: the default</Label>
      </Field>
      <Field inline>
        <Switch id="sw-size-lg" size="lg" defaultChecked />
        <Label htmlFor="sw-size-lg">Large: a main on/off setting</Label>
      </Field>
    </div>
  );
}
```

---
Part of @danitesler/ayywi 0.1.2: load `dist/ayywi.min.css` (and `dist/elements.global.js` for the <ayy-*> elements). The rules every screen follows: [llms-full.txt#rules](../llms-full.txt#rules). Every component: [llms.txt](../llms.txt).
