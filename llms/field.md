# Field

Category: Forms. Form field wrapper: Label + control + hint or error, stacked with consistent spacing.

**Classes**
- `.ayy-field` — Wrapper, vertical stack.
- `.ayy-field--inline` — Label and control side by side (Switch, checkbox).
- `.ayy-label` — The <label>. Usable on its own too.
- `.ayy-field__hint` — Muted helper text under the control.
- `.ayy-field__error` — Error text under the control.

**JS (framework-free)**: fieldClass({ inline?, className? }); labelClass, fieldHintClass, fieldErrorClass constants

**React** — `import { Field, Label, FieldHint, FieldError } from "ayywi/react";`
- `<Field>` renders <div>. Props: `inline` boolean
- `<Label>` renders <label>. Props: `htmlFor` id of the control
- `<FieldHint>` renders <p>.
- `<FieldError>` renders <p>.

**Accessibility**
- Label htmlFor/for must match the control id.
- Link hint/error to the control with aria-describedby; set aria-invalid="true" on the control when there's an error.
- The label dims automatically when the control inside the field is disabled.

**Do**
- Wrap every labelled form control in a Field: Input, Input group, Textarea, Select, Switch, Checkbox.
- Keep hints to one short sentence.
- Show errors after the user leaves the field or submits, not on every keystroke.

**Don't**
- Don't wrap search boxes in toolbars — an aria-label on the Input is enough.
- Don't show a hint and an error at the same time — the error replaces the hint.

## Field — Form fields

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<form class="ayy-stack" style="inline-size: min(100%, 23.75rem); --ayy-gap: var(--ayy-space-4)" onsubmit="return false">
  <div class="ayy-field">
    <label class="ayy-label" for="project-slug-html">Project name</label>
    <input class="ayy-input" id="project-slug-html" placeholder="marketing-site" aria-describedby="project-slug-html-hint" />
    <p class="ayy-field__hint" id="project-slug-html-hint">Lowercase, dashes allowed.</p>
  </div>
  <div class="ayy-field">
    <label class="ayy-label" for="project-description-html">Description</label>
    <textarea class="ayy-textarea" id="project-description-html" rows="3" placeholder="What is this project for?"></textarea>
  </div>
  <div class="ayy-field ayy-field--inline">
    <input class="ayy-switch" type="checkbox" role="switch" id="project-public-html" checked />
    <label class="ayy-label" for="project-public-html">Anyone with the link can view</label>
  </div>
  <div class="ayy-cluster">
    <button type="submit" class="ayy-button">Create project</button>
    <button type="button" class="ayy-button ayy-button--ghost">Cancel</button>
  </div>
</form>
```

React:

```tsx
import type { CSSProperties } from "react";
import { Button, Field, FieldHint, Input, Label, Switch, Textarea } from "ayywi/react";

export default function Example() {
  return (
    <form
      className="ayy-stack"
      style={{ inlineSize: "min(100%, 23.75rem)", "--ayy-gap": "var(--ayy-space-4)" } as CSSProperties}
      onSubmit={(e) => e.preventDefault()}
    >
      <Field>
        <Label htmlFor="project-slug">Project name</Label>
        <Input id="project-slug" placeholder="marketing-site" aria-describedby="project-slug-hint" />
        <FieldHint id="project-slug-hint">Lowercase, dashes allowed.</FieldHint>
      </Field>
      <Field>
        <Label htmlFor="project-description">Description</Label>
        <Textarea id="project-description" rows={3} placeholder="What is this project for?" />
      </Field>
      <Field inline>
        <Switch id="project-public" defaultChecked />
        <Label htmlFor="project-public">Anyone with the link can view</Label>
      </Field>
      <div className="ayy-cluster">
        <Button type="submit">Create project</Button>
        <Button variant="ghost">Cancel</Button>
      </div>
    </form>
  );
}
```

---
Part of ayywi 0.4.0: load `dist/ayywi.min.css` (and `dist/elements.global.js` for the <ayy-*> elements). The rules every screen follows: [llms-full.txt#rules](../llms-full.txt#rules). Every component: [llms.txt](../llms.txt).
