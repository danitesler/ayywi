# Icon

Category: Data display. Inline SVG icon from Hugeicons, ayywi's icon library: 6,000+ free Stroke Rounded icons on a 24px grid. It takes the text colour and follows the text size unless you pick one. Also called: svg-icon.

**Classes**
- `.ayy-icon` — On the <svg>. 1.25em square, so it follows the surrounding text; centred on capital letters; never shrinks in a flex row.
- `.ayy-icon--sm` — 16px (--ayy-size-icon-sm).
- `.ayy-icon--md` — 20px (--ayy-size-icon-md).
- `.ayy-icon--lg` — 24px, Hugeicons' native grid (--ayy-size-icon-lg).
- `.ayy-icon--xl` — 32px (--ayy-size-icon-xl).
- `.ayy-icon--directional` — Mirrors the icon in right-to-left text (the nearest dir attribute decides). For icons that point along the reading direction: arrows, chevrons, send, undo.

**JS (framework-free)**: iconSvg(icon, { size?, directional?, label?, strokeWidth?, className? }) → SVG markup for innerHTML, v-html, {@html} or server templates; iconClass({ size?, directional?, className? }); iconSizes; type IconData (Hugeicons' format). Icons come from `npm i @hugeicons/core-free-icons`: import { Search01Icon } from "@hugeicons/core-free-icons". Plain HTML: paste the SVG with class="ayy-icon".

**React** — `import { Icon } from "@danitesler/ayywi/react"; import { Search01Icon } from "@hugeicons/core-free-icons";`
- `<Icon>` renders <svg class="ayy-icon">. Props: `icon` IconData (required) — any icon from @hugeicons/core-free-icons or a Hugeicons Pro package; `size` "auto" | "sm" | "md" | "lg" | "xl" — auto follows the text; the rest are 16/20/24/32px; `directional` boolean — mirror in right-to-left text; for arrows and other icons that point along the reading direction; `label` string — accessible name; without it the icon is decorative (aria-hidden); `strokeWidth` number — stroke width on the 24px grid (Hugeicons default 1.5)

**Accessibility**
- Icons are decorative by default (aria-hidden): the text next to them carries the meaning.
- When the icon is the only thing saying something (a status, a verified mark), give it a label: <Icon label="Deployed">, or role="img" + aria-label on the <svg>.
- Icon-only buttons: aria-label goes on the button, the icon stays decorative.
- Strokes use currentColor, so icons follow the theme and Windows High Contrast colours with no extra CSS.

**Do**
- Use an icon next to its text to help people recognise an action or item: buttons, menu items, list rows.
- Use an icon with an accessible label for compact status where a word would be too long.
- Import icons one by one from @hugeicons/core-free-icons; named imports tree-shake.
- Let the component size icons inside buttons, menu items and alerts; use size for icons on their own.
- Colour an icon through its text colour: .ayy-muted, or color: var(--ayy-color-success) on the <svg>.
- Mark icons that point along the reading direction (arrows, chevrons, send, undo) directional so they mirror in RTL. Leave the rest alone: a clock or a check mark reads the same both ways.

**Don't**
- Don't use an icon for people and workspaces — use Avatar.
- Don't use Icon for illustrations and logos — use an <img> or your own SVG.
- Don't rely on an icon when its meaning isn't obvious — write the word instead of (or next to) it.
- Don't mix in another icon set. Hugeicons' 1.5px rounded stroke is part of the look.
- Don't keep a fixed colour (color, fill or stroke set to a hex value) on an SVG you paste in: a black icon disappears in the dark theme.
- Don't use colour as the only signal: pair a status icon with a label.

## Icon — Sizes

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<div class="ayy-stack" style="--ayy-gap: var(--ayy-space-6)">
  <div class="ayy-cluster" style="--ayy-gap: var(--ayy-space-8); align-items: end">
    <span class="ayy-stack" style="--ayy-gap: var(--ayy-space-2); align-items: center">
      <svg class="ayy-icon ayy-icon--sm" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5"/><path d="M12 8V12L14 14" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/></svg>
      <span class="ayy-muted">sm · 16px</span>
    </span>
    <span class="ayy-stack" style="--ayy-gap: var(--ayy-space-2); align-items: center">
      <svg class="ayy-icon ayy-icon--md" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5"/><path d="M12 8V12L14 14" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/></svg>
      <span class="ayy-muted">md · 20px</span>
    </span>
    <span class="ayy-stack" style="--ayy-gap: var(--ayy-space-2); align-items: center">
      <svg class="ayy-icon ayy-icon--lg" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5"/><path d="M12 8V12L14 14" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/></svg>
      <span class="ayy-muted">lg · 24px</span>
    </span>
    <span class="ayy-stack" style="--ayy-gap: var(--ayy-space-2); align-items: center">
      <svg class="ayy-icon ayy-icon--xl" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5"/><path d="M12 8V12L14 14" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/></svg>
      <span class="ayy-muted">xl · 32px</span>
    </span>
  </div>
  <!-- No size: the icon follows the text around it. -->
  <p class="ayy-h4"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5"/><path d="M12 8V12L14 14" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/></svg> Build queue</p>
  <p class="ayy-muted"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5"/><path d="M12 8V12L14 14" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/></svg> Builds start within 2 minutes of a push.</p>
</div>
```

React:

```tsx
import type { CSSProperties } from "react";
import { Clock01Icon } from "@hugeicons/core-free-icons";
import { Icon } from "@danitesler/ayywi/react";

const SIZES = [
  ["sm", "16px"],
  ["md", "20px"],
  ["lg", "24px"],
  ["xl", "32px"],
] as const;

export default function Example() {
  return (
    <div className="ayy-stack" style={{ "--ayy-gap": "var(--ayy-space-6)" } as CSSProperties}>
      <div className="ayy-cluster" style={{ "--ayy-gap": "var(--ayy-space-8)", alignItems: "end" } as CSSProperties}>
        {SIZES.map(([size, px]) => (
          <span key={size} className="ayy-stack" style={{ "--ayy-gap": "var(--ayy-space-2)", alignItems: "center" } as CSSProperties}>
            <Icon icon={Clock01Icon} size={size} />
            <span className="ayy-muted">
              {size} · {px}
            </span>
          </span>
        ))}
      </div>
      {/* No size: the icon follows the text around it. */}
      <p className="ayy-h4">
        <Icon icon={Clock01Icon} /> Build queue
      </p>
      <p className="ayy-muted">
        <Icon icon={Clock01Icon} /> Builds start within 2 minutes of a push.
      </p>
    </div>
  );
}
```

## Icon — Decorative and meaningful

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<!-- Decorative icons are aria-hidden. An icon that carries the meaning on its own gets role="img" and a label. -->
<ul class="ayy-list ayy-list--compact" aria-label="Deploys">
  <li class="ayy-list__item">
    <svg class="ayy-icon" style="color: var(--ayy-color-success)" viewBox="0 0 24 24" fill="none" role="img" aria-label="Ready"><path d="M22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12Z" stroke="currentColor" stroke-width="1.5"/><path d="M8 12.5L10.5 15L16 9" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/></svg>
    <span>Marketing site</span>
    <span class="ayy-cluster ayy-muted" style="--ayy-gap: var(--ayy-space-1)"><svg class="ayy-icon ayy-icon--sm" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7 19H13C15.8284 19 17.2426 19 18.1213 18.1213C19 17.2426 19 15.8284 19 13V10M19 10C19.7002 10 21.0085 11.9943 21.5 12.5M19 10C18.2998 10 16.9915 11.9943 16.5 12.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/><path d="M5 7L5 17" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/><circle cx="5" cy="5" r="2" stroke="currentColor" stroke-width="1.5"/><circle cx="19" cy="5" r="2" stroke="currentColor" stroke-width="1.5"/><circle cx="5" cy="19" r="2" stroke="currentColor" stroke-width="1.5"/></svg> main</span>
  </li>
  <li class="ayy-list__item">
    <svg class="ayy-icon" style="color: var(--ayy-color-destructive)" viewBox="0 0 24 24" fill="none" role="img" aria-label="Failed"><path d="M22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/><path d="M14.9994 15L9 9M9.00064 15L15 9" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/></svg>
    <span>Docs</span>
    <span class="ayy-cluster ayy-muted" style="--ayy-gap: var(--ayy-space-1)"><svg class="ayy-icon ayy-icon--sm" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7 19H13C15.8284 19 17.2426 19 18.1213 18.1213C19 17.2426 19 15.8284 19 13V10M19 10C19.7002 10 21.0085 11.9943 21.5 12.5M19 10C18.2998 10 16.9915 11.9943 16.5 12.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/><path d="M5 7L5 17" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/><circle cx="5" cy="5" r="2" stroke="currentColor" stroke-width="1.5"/><circle cx="19" cy="5" r="2" stroke="currentColor" stroke-width="1.5"/><circle cx="5" cy="19" r="2" stroke="currentColor" stroke-width="1.5"/></svg> fix/search-index</span>
  </li>
</ul>
```

React:

```tsx
import type { CSSProperties } from "react";
import { CancelCircleIcon, CheckmarkCircle02Icon, GitBranchIcon } from "@hugeicons/core-free-icons";
import { Icon, List, ListItem } from "@danitesler/ayywi/react";

// Decorative icons are aria-hidden. An icon that carries the meaning on its own gets a label.
export default function Example() {
  return (
    <List compact aria-label="Deploys">
      <ListItem>
        <Icon icon={CheckmarkCircle02Icon} label="Ready" style={{ color: "var(--ayy-color-success)" }} />
        <span>Marketing site</span>
        <span className="ayy-cluster ayy-muted" style={{ "--ayy-gap": "var(--ayy-space-1)" } as CSSProperties}>
          <Icon icon={GitBranchIcon} size="sm" /> main
        </span>
      </ListItem>
      <ListItem>
        <Icon icon={CancelCircleIcon} label="Failed" style={{ color: "var(--ayy-color-destructive)" }} />
        <span>Docs</span>
        <span className="ayy-cluster ayy-muted" style={{ "--ayy-gap": "var(--ayy-space-1)" } as CSSProperties}>
          <Icon icon={GitBranchIcon} size="sm" /> fix/search-index
        </span>
      </ListItem>
    </List>
  );
}
```

## Icon — Directional icons in RTL

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<!-- ayy-icon--directional mirrors an icon in right-to-left text. The same buttons, then inside dir="rtl": -->
<div class="ayy-stack">
  <nav class="ayy-cluster" aria-label="Pagination">
    <button type="button" class="ayy-button ayy-button--outline">
      <svg class="ayy-icon ayy-icon--directional" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5.5 12.002H19" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/><path d="M10.9999 18.002C10.9999 18.002 4.99998 13.583 4.99997 12.0019C4.99996 10.4208 11 6.00195 11 6.00195" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/></svg>
      Previous
    </button>
    <button type="button" class="ayy-button ayy-button--outline">
      Next
      <svg class="ayy-icon ayy-icon--directional" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M18.5 12L4.99997 12" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/><path d="M13 18C13 18 19 13.5811 19 12C19 10.4188 13 6 13 6" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/></svg>
    </button>
  </nav>
  <nav class="ayy-cluster" aria-label="עימוד" dir="rtl" lang="he">
    <button type="button" class="ayy-button ayy-button--outline">
      <svg class="ayy-icon ayy-icon--directional" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5.5 12.002H19" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/><path d="M10.9999 18.002C10.9999 18.002 4.99998 13.583 4.99997 12.0019C4.99996 10.4208 11 6.00195 11 6.00195" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/></svg>
      הקודם
    </button>
    <button type="button" class="ayy-button ayy-button--outline">
      הבא
      <svg class="ayy-icon ayy-icon--directional" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M18.5 12L4.99997 12" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/><path d="M13 18C13 18 19 13.5811 19 12C19 10.4188 13 6 13 6" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/></svg>
    </button>
  </nav>
</div>
```

React:

```tsx
import { ArrowLeft02Icon, ArrowRight02Icon } from "@hugeicons/core-free-icons";
import { Button, Icon } from "@danitesler/ayywi/react";

// directional mirrors an icon in right-to-left text. The same buttons, then inside dir="rtl":
export default function Example() {
  return (
    <div className="ayy-stack">
      <nav className="ayy-cluster" aria-label="Pagination">
        <Button variant="outline">
          <Icon icon={ArrowLeft02Icon} directional />
          Previous
        </Button>
        <Button variant="outline">
          Next
          <Icon icon={ArrowRight02Icon} directional />
        </Button>
      </nav>
      <nav className="ayy-cluster" aria-label="עימוד" dir="rtl" lang="he">
        <Button variant="outline">
          <Icon icon={ArrowLeft02Icon} directional />
          הקודם
        </Button>
        <Button variant="outline">
          הבא
          <Icon icon={ArrowRight02Icon} directional />
        </Button>
      </nav>
    </div>
  );
}
```

---
Part of @danitesler/ayywi 0.0.1: load `dist/ayywi.min.css` (and `dist/elements.global.js` for the <ayy-*> elements). The rules every screen follows: [llms-full.txt#rules](../llms-full.txt#rules). Every component: [llms.txt](../llms.txt).
