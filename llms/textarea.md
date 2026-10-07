# Textarea

Category: Forms. Multi-line text field. Optional auto-grow and monospace modes.

**Classes**
- `.ayy-textarea` — Root, on the <textarea>.
- `.ayy-textarea--autosize` — Grows with content (CSS field-sizing). Falls back to fixed height.
- `.ayy-textarea--mono` — Monospace font.

**States**
- `default` — Like Input: wash fill, line-strong border; at least 5rem tall, resizable vertically.
- `hover` (`:hover`) — Border turns line-hover.
- `pressed` — doesn't apply: No pressed look.
- `focus` (`:focus-visible`) — 2px ring just inside the edge; the border goes transparent.
- `disabled` (`:disabled`) — --ayy-opacity-disabled, not-allowed cursor.
- `selected` — doesn't apply: Not a choice control.
- `error` (`aria-invalid="true" (with a FieldError)`) — Border 60% destructive, destructive focus ring. Forced colours: dashed border.
- `loading` — doesn't apply: No loading look; disable it and show a Spinner in the submit Button while the text is sent.

**Sizes**
- Density — Text follows control md; the minimum height (5rem) and padding don't change.
- Width — Fills its container. autosize grows with its content (Chromium; elsewhere it keeps 5rem and scrolls).

**JS (framework-free)**: textareaClass({ autosize?, mono?, className? }) → string

**React** — `import { Textarea } from "ayywi/react";`
- `<Textarea>` renders <textarea>. Props: `autosize` boolean; `mono` boolean; `...rest` All native <textarea> attributes.

**Accessibility**
- Label it (Field + Label), same as Input.

**Do**
- Use a textarea for descriptions, notes, prompts and config snippets (mono).
- Set rows for a sensible starting height.

**Don't**
- Don't use it for rich text editing — use a dedicated editor and theme it with ayywi tokens.
- Don't disable resize on non-autosize textareas; users need it.

## Textarea — Basic, autosize, mono

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<div class="ayy-stack" style="inline-size: min(100%, 26.25rem)">
  <textarea class="ayy-textarea" placeholder="Write a short description…" aria-label="Description"></textarea>
  <textarea class="ayy-textarea ayy-textarea--autosize" rows="2" placeholder="I grow as you type" aria-label="Notes"></textarea>
  <textarea class="ayy-textarea ayy-textarea--mono" rows="3" aria-label="Config">{
  "theme": "dark"
}</textarea>
</div>
```

React:

```tsx
import { Textarea } from "ayywi/react";

export default function Example() {
  return (
    <div className="ayy-stack" style={{ inlineSize: "min(100%, 26.25rem)" }}>
      <Textarea placeholder="Write a short description…" aria-label="Description" />
      <Textarea autosize rows={2} placeholder="I grow as you type" aria-label="Notes" />
      <Textarea mono rows={3} defaultValue={'{\n  "theme": "dark"\n}'} aria-label="Config" />
    </div>
  );
}
```

---
Part of ayywi 0.4.0: load `dist/ayywi.min.css` (and `dist/elements.global.js` for the <ayy-*> elements). The rules every screen follows: [llms-full.txt#rules](../llms-full.txt#rules). Every component: [llms.txt](../llms.txt).
