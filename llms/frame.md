# Frame

Category: Data display. A browser window around a screenshot, video or coded mock-up: a bar with three dots and an optional address, and a long soft shadow.

**Classes**
- `.ayy-frame` — Root: bordered, rounded, with the frame shadow.
- `.ayy-frame__bar` — Top bar with the three window dots.
- `.ayy-frame__title` — Optional address or page name in the bar, centred.
- `.ayy-frame__body` — Holds the <img>, <video>, <picture> or <svg>, edge to edge.

**States**
- `default` — A surface window with a line border, xl radius and the long frame shadow; a raised bar with three dots and a muted 2xs address.
- `hover` — doesn't apply: Decorative.
- `pressed` — doesn't apply: Decorative.
- `focus` — doesn't apply: Not focusable.
- `disabled` — doesn't apply: Decorative.
- `selected` — doesn't apply: Decorative.
- `error` — doesn't apply: No error state.
- `loading` — doesn't apply: Give the image width and height so nothing jumps; no loading look.

**Sizes**
- Density — Doesn't follow data-density.
- Width — Fills its container; the media inside scales to its width.

**JS (framework-free)**: frameClass, frameBarClass, frameTitleClass, frameBodyClass constants.

**React** — `import { Frame } from "ayywi/react";`
- `<Frame>` renders <div class="ayy-frame"> with the bar and body. Props: `title` ReactNode — text in the address bar.

**Accessibility**
- The screenshot is the content: give the <img> alt text that says what it shows, or wrap the frame in a <figure> with a <figcaption>.
- The dots are decoration (a pseudo-element).

**Do**
- Use a frame to show product screens in a case study, landing page or portfolio card, so they read as product and not decoration.
- Give images width and height so the frame keeps its size while loading.
- Blur real names and customer data in production screenshots, and say so in the caption.

**Don't**
- Don't frame photos and illustrations — they don't need a window.
- Don't frame live, interactive UI inside an app.
- Don't put text that matters inside the screenshot; write it next to the frame.

## Frame — Screenshot in a window

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<figure class="ayy-stack" style="margin: 0; inline-size: min(100%, 28rem)">
  <div class="ayy-frame">
    <div class="ayy-frame__bar"><span class="ayy-frame__title">app.oktopost.com/board</span></div>
    <div class="ayy-frame__body">
      <svg viewBox="0 0 400 220" role="img" aria-label="Advocacy board: featured stories and a leaderboard">
        <rect width="400" height="220" style="fill: var(--ayy-color-surface)" />
        <rect x="16" y="16" width="72" height="188" rx="6" style="fill: var(--ayy-color-wash-hover)" />
        <rect x="104" y="16" width="136" height="90" rx="8" style="fill: color-mix(in srgb, var(--ayy-accent-product) 40%, transparent)" />
        <rect x="248" y="16" width="136" height="90" rx="8" style="fill: color-mix(in srgb, var(--ayy-accent-ai) 35%, transparent)" />
        <rect x="104" y="118" width="280" height="86" rx="8" style="fill: var(--ayy-color-wash-hover)" />
      </svg>
    </div>
  </div>
  <figcaption class="ayy-muted">The redesigned board. Customer data blurred.</figcaption>
</figure>
```

React:

```tsx
import { Frame } from "ayywi/react";

export default function Example() {
  return (
    <figure className="ayy-stack" style={{ margin: 0, inlineSize: "min(100%, 28rem)" }}>
      <Frame title="app.oktopost.com/board">
        <svg viewBox="0 0 400 220" role="img" aria-label="Advocacy board: featured stories and a leaderboard">
          <rect width="400" height="220" style={{ fill: "var(--ayy-color-surface)" }} />
          <rect x="16" y="16" width="72" height="188" rx="6" style={{ fill: "var(--ayy-color-wash-hover)" }} />
          <rect x="104" y="16" width="136" height="90" rx="8" style={{ fill: "color-mix(in srgb, var(--ayy-accent-product) 40%, transparent)" }} />
          <rect x="248" y="16" width="136" height="90" rx="8" style={{ fill: "color-mix(in srgb, var(--ayy-accent-ai) 35%, transparent)" }} />
          <rect x="104" y="118" width="280" height="86" rx="8" style={{ fill: "var(--ayy-color-wash-hover)" }} />
        </svg>
      </Frame>
      <figcaption className="ayy-muted">The redesigned board. Customer data blurred.</figcaption>
    </figure>
  );
}
```

---
Part of ayywi 0.4.0: load `dist/ayywi.min.css` (and `dist/elements.global.js` for the <ayy-*> elements). The rules every screen follows: [llms-full.txt#rules](../llms-full.txt#rules). Every component: [llms.txt](../llms.txt).
