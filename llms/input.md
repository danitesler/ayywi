# Input

Category: Forms. Single-line text field. Works for every native input type (text, email, search, number, file…).

**Classes**
- `.ayy-input` — Root, on the <input> itself.
- `.ayy-input--sm` — 28px tall.
- `.ayy-input--lg` — 40px tall.

**States**
- `aria-invalid="true"` — Red border and focus ring. Pair with a Field error message.
- `disabled` — Dimmed, not-allowed cursor.

**JS (framework-free)**: inputClass({ size?, className? }) → string

**React** — `import { Input } from "ayywi/react";`
- `<Input>` renders <input>. Props: `size` "sm" | "md" | "lg" (visual size; native size attr not exposed); `...rest` All native <input> attributes.

**Accessibility**
- Every input needs a label: wrap in a Field with a Label (for/id), or aria-label for search boxes.
- Errors: aria-invalid="true" + aria-describedby pointing at the error text.

**Do**
- Use an input for short free-text entry: names, URLs, search, API keys.
- Use type="date", "time" or "datetime-local" for dates and times: the browser's own picker, in the theme's colour scheme, with keyboard entry and the user's locale. Set min and max for bookable ranges.
- Match the input size to neighbouring buttons in a toolbar (sm with sm).

**Don't**
- Don't use an input for multi-line text — use Textarea.
- Don't use an input for on/off — use Switch.
- Don't use placeholder as the label.
- Don't hardcode widths in px inside flexible layouts — the input fills its container.

## Input — Types & sizes

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<div class="ayy-stack" style="inline-size: min(100%, 20rem)">
  <input class="ayy-input ayy-input--sm" placeholder="Small" aria-label="Small input" />
  <input class="ayy-input" type="email" placeholder="you@example.com" aria-label="Email" />
  <input class="ayy-input ayy-input--lg" type="search" placeholder="Search projects…" aria-label="Search projects" />
  <input class="ayy-input" placeholder="Disabled" aria-label="Disabled input" disabled />
</div>
```

React:

```tsx
import { Input } from "ayywi/react";

export default function Example() {
  return (
    <div className="ayy-stack" style={{ inlineSize: "min(100%, 20rem)" }}>
      <Input size="sm" placeholder="Small" aria-label="Small input" />
      <Input placeholder="you@example.com" type="email" aria-label="Email" />
      <Input size="lg" type="search" placeholder="Search projects…" aria-label="Search projects" />
      <Input disabled placeholder="Disabled" aria-label="Disabled input" />
    </div>
  );
}
```

## Input — Invalid

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<div class="ayy-field" style="inline-size: min(100%, 20rem)">
  <label class="ayy-label" for="api-key-html">API key</label>
  <input class="ayy-input" id="api-key-html" value="sk-123" aria-invalid="true" aria-describedby="api-key-html-error" />
  <p class="ayy-field__error" id="api-key-html-error">Key looks too short.</p>
</div>
```

React:

```tsx
import { Field, FieldError, Input, Label } from "ayywi/react";

export default function Example() {
  return (
    <Field style={{ inlineSize: "min(100%, 20rem)" }}>
      <Label htmlFor="api-key">API key</Label>
      <Input id="api-key" defaultValue="sk-123" aria-invalid="true" aria-describedby="api-key-error" />
      <FieldError id="api-key-error">Key looks too short.</FieldError>
    </Field>
  );
}
```

## Input — Date and time

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<div class="ayy-grid" style="--ayy-min: 11rem; inline-size: min(100%, 28rem)">
  <div class="ayy-field">
    <label class="ayy-label" for="booking-date">Date</label>
    <input type="date" class="ayy-input" id="booking-date" min="2026-10-01" max="2026-12-31" aria-describedby="booking-date-hint" value="2026-10-14"/>
    <p class="ayy-field__hint" id="booking-date-hint">October to December.</p>
  </div>
  <div class="ayy-field">
    <label class="ayy-label" for="booking-time">Time</label>
    <input type="time" class="ayy-input" id="booking-time" min="07:00" max="21:00" step="900" value="18:30"/>
  </div>
</div>
```

React:

```tsx
import type { CSSProperties } from "react";
import { Field, FieldHint, Input, Label } from "ayywi/react";

export default function Example() {
  return (
    <div className="ayy-grid" style={{ "--ayy-min": "11rem", inlineSize: "min(100%, 28rem)" } as CSSProperties}>
      <Field>
        <Label htmlFor="booking-date">Date</Label>
        <Input id="booking-date" type="date" defaultValue="2026-10-14" min="2026-10-01" max="2026-12-31" aria-describedby="booking-date-hint" />
        <FieldHint id="booking-date-hint">October to December.</FieldHint>
      </Field>
      <Field>
        <Label htmlFor="booking-time">Time</Label>
        <Input id="booking-time" type="time" defaultValue="18:30" min="07:00" max="21:00" step={900} />
      </Field>
    </div>
  );
}
```

---
Part of ayywi 0.4.0: load `dist/ayywi.min.css` (and `dist/elements.global.js` for the <ayy-*> elements). The rules every screen follows: [llms-full.txt#rules](../llms-full.txt#rules). Every component: [llms.txt](../llms.txt).
