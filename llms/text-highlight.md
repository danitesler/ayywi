# Text highlight

Category: Data display. An inline text highlight for search matches or callout phrases. Subtle gray wash with clean underline by default, with warning (yellow), destructive (red), success (green), info (blue), and orange variants. Also called: text-highlight, highlight, mark, search-highlight.

**Classes**
- `.ayy-text-highlight` — Inline highlighted span or <mark>: subtle gray wash with clean underline.
- `.ayy-text-highlight--warning` — Amber/yellow tint for cautions and warnings.
- `.ayy-text-highlight--destructive` — Red tint for errors and danger callouts.
- `.ayy-text-highlight--success` — Green tint for positive results or matches.
- `.ayy-text-highlight--info` — Blue tint for informational emphasis.
- `.ayy-text-highlight--orange` — Orange tint for spotlight callouts.

**States**
- `default` — Subtle gray wash with clean underline, inheriting text colour.
- `hover` — doesn't apply: A text annotation, not a control.
- `pressed` — doesn't apply: A text annotation, not a control.
- `focus` — doesn't apply: Not focusable on its own.
- `disabled` — doesn't apply: A text annotation, not a control.
- `selected` — doesn't apply: A text annotation, not a control.
- `error` — doesn't apply: Use variant destructive for error or danger callouts.
- `loading` — doesn't apply: No loading state.

**Sizes**
- Density — Follows the text it wraps.
- Width — Inline, wraps with text.

**React** — `import { TextHighlight } from "@danitesler/ayywi/react";`
- `<TextHighlight>` renders <mark class="ayy-text-highlight">. Props: `text` string — text to search and highlight within (or provide as string children); `query` string — search substring or space-separated words to highlight; `variant` "default" | "warning" | "destructive" | "success" | "info" | "orange" — highlight tint colour; `as` ElementType — HTML tag (defaults to mark for callouts, Fragment for queries)

**Accessibility**
- Uses the standard <mark> HTML tag for search and text highlights, recognised by assistive technology.
- Maintains readable contrast across light, dark, and high-contrast themes via color-mix() and light-dark().
- Under Windows High Contrast mode (forced-colors), highlights switch to the system Highlight and HighlightText colours.

**Do**
- Use TextHighlight to show matched search terms in command palettes, comboboxes, and search results.
- Use the default subtle gray highlight with underline for search results so text remains calm and readable.
- Use color variants (warning/yellow, destructive/red, success/green, info, orange) for specific semantic callouts.

**Don't**
- Don't hardcode background or text colours; use the tokens or built-in variants.
- Don't highlight entire paragraphs; highlight only matched keywords or key phrases.
- Don't replace links or buttons with highlights.

## Text highlight — Search match and callout

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<div class="ayy-stack">
  <p>The <mark class="ayy-text-highlight">Input</mark> component lets users enter and edit text.</p>
  <p class="ayy-muted">Callout: <mark class="ayy-text-highlight">Subtle gray highlight with underline</mark> for inline emphasis.</p>
</div>
```

React:

```tsx
import { TextHighlight } from "@danitesler/ayywi/react";

export default function Example() {
  return (
    <div className="ayy-stack">
      <p>
        <TextHighlight text="The Input component lets users enter and edit text." query="input" />
      </p>
      <p className="ayy-muted">
        Callout: <TextHighlight>Subtle gray highlight with underline</TextHighlight> for inline emphasis.
      </p>
    </div>
  );
}
```

## Text highlight — Semantic color variants (yellow, red, green, blue, orange)

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<div class="ayy-stack">
  <p>Default (neutral): <mark class="ayy-text-highlight">Subtle gray wash with underline</mark></p>
  <p>Yellow (warning): <mark class="ayy-text-highlight ayy-text-highlight--warning">Attention required</mark></p>
  <p>Red (destructive): <mark class="ayy-text-highlight ayy-text-highlight--destructive">Critical action</mark></p>
  <p>Green (success): <mark class="ayy-text-highlight ayy-text-highlight--success">Completed</mark></p>
  <p>Blue (info): <mark class="ayy-text-highlight ayy-text-highlight--info">Note</mark></p>
  <p>Orange: <mark class="ayy-text-highlight ayy-text-highlight--orange">Spotlight</mark></p>
</div>
```

React:

```tsx
import { TextHighlight } from "@danitesler/ayywi/react";

export default function Example() {
  return (
    <div className="ayy-stack">
      <p>Default (neutral): <TextHighlight>Subtle gray wash with underline</TextHighlight></p>
      <p>Yellow (warning): <TextHighlight variant="warning">Attention required</TextHighlight></p>
      <p>Red (destructive): <TextHighlight variant="destructive">Critical action</TextHighlight></p>
      <p>Green (success): <TextHighlight variant="success">Completed</TextHighlight></p>
      <p>Blue (info): <TextHighlight variant="info">Note</TextHighlight></p>
      <p>Orange: <TextHighlight variant="orange">Spotlight</TextHighlight></p>
    </div>
  );
}
```

---
Part of @danitesler/ayywi 0.0.3: load `dist/ayywi.min.css` (and `dist/elements.global.js` for the <ayy-*> elements). The rules every screen follows: [llms-full.txt#rules](../llms-full.txt#rules). Every component: [llms.txt](../llms.txt).
