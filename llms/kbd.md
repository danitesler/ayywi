# Kbd

Category: Data display. A keyboard key or shortcut drawn as a small keycap: in help text, menus, tooltips and search fields.

**Classes**
- `.ayy-kbd` — The <kbd>: monospace, 0.75em of the surrounding text, a hairline border with a heavier bottom edge.

**States**
- `default` — A small keycap: wash fill, line-strong border with a 2px bottom edge, mono text-soft at 0.75em.
- `hover` — doesn't apply: A key label, not a control.
- `pressed` — doesn't apply: A key label, not a control.
- `focus` — doesn't apply: Not focusable.
- `disabled` — doesn't apply: A key label, not a control.
- `selected` — doesn't apply: A key label, not a control.
- `error` — doesn't apply: No error state.
- `loading` — doesn't apply: No loading state.

**Sizes**
- Density — Scales with the text around it (1.6em tall); doesn't follow data-density.
- Width — At least 1.6em wide, grows with the key name.

**JS (framework-free)**: kbdClass constant.

**React** — `import { Kbd } from "@danitesler/ayywi/react";`
- `<Kbd>` renders <kbd class="ayy-kbd">.

**Accessibility**
- Use the <kbd> element: screen readers and search know it's a key.
- Write modifier names out where symbols may not read well ("Ctrl" rather than "^"), or add aria-label="Command K" to a <kbd>⌘K</kbd>.
- A shortcut hint doesn't replace aria-keyshortcuts on the control it triggers.

**Do**
- Use a kbd for keys people press: "Press / to search", shortcuts in a menu or tooltip, a hint in a search field (InputGroupAddon).
- Use one kbd for a whole shortcut (⌘K), or one per key with a plus between them (Ctrl + Shift + P).

**Don't**
- Don't use a kbd for code or file names — use .ayy-mono or <code>.
- Don't use it as a badge or a tag — use Badge.
- Don't show shortcuts on touch-first screens, where there's no keyboard.

## Kbd — Shortcuts in text

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<div class="ayy-stack">
  <p>Press <kbd class="ayy-kbd">/</kbd> to search, or <kbd class="ayy-kbd" aria-label="Command K">⌘K</kbd> to open the command menu.</p>
  <p class="ayy-muted">Save a draft with <kbd class="ayy-kbd">Ctrl</kbd> + <kbd class="ayy-kbd">S</kbd>.</p>
</div>
```

React:

```tsx
import { Kbd } from "@danitesler/ayywi/react";

export default function Example() {
  return (
    <div className="ayy-stack">
      <p>
        Press <Kbd>/</Kbd> to search, or <Kbd aria-label="Command K">⌘K</Kbd> to open the command menu.
      </p>
      <p className="ayy-muted">
        Save a draft with <Kbd>Ctrl</Kbd> + <Kbd>S</Kbd>.
      </p>
    </div>
  );
}
```

---
Part of @danitesler/ayywi 0.0.1: load `dist/ayywi.min.css` (and `dist/elements.global.js` for the <ayy-*> elements). The rules every screen follows: [llms-full.txt#rules](../llms-full.txt#rules). Every component: [llms.txt](../llms.txt).
