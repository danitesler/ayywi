# Button

Category: Actions. Triggers an action. Pill-shaped, monochrome primary with a subtle lift on hover. Also called: button, btn, icon-button, icon-btn, cta.

**Classes**
- `.ayy-button` — Root. Alone it is the primary button.
- `.ayy-button--secondary` — Quiet filled button for secondary actions.
- `.ayy-button--outline` — Bordered, transparent. Neutral alternative to secondary.
- `.ayy-button--ghost` — No border or fill until hover. Toolbars, icon buttons.
- `.ayy-button--destructive` — Tinted red. Irreversible actions.
- `.ayy-button--link` — Looks like a text link.
- `.ayy-button--ring` — Showcase call to action: quiet fill inside a gradient ring that spins on keyboard focus and mouse hover (not after a tap). For marketing and portfolio pages; one per view.
- `.ayy-button--sm` — Small control step: --ayy-size-control-sm tall (28px compact, 32 comfortable, 40 touch), --ayy-control-text-sm, --ayy-size-icon-sm (16px) icon, 6px gap.
- `.ayy-button--lg` — Large control step: --ayy-size-control-lg tall (40px compact, 48 comfortable, 52 touch), --ayy-control-text-lg, --ayy-size-icon-md (20px) icon, 8px gap. Matches large App shell links.
- `.ayy-button--icon` — Square at the md control height (32px compact, 40 comfortable, 44 touch), for a single 16px icon.
- `.ayy-button--icon-sm` — Square at the sm control height (28px compact, 32 comfortable, 40 touch), for a single 16px icon.
- `.ayy-button--icon-lg` — Square at the lg control height (40px compact, 48 comfortable, 52 touch), for a single 20px icon beside a large button.
- `.ayy-button--block` — Fills its container's width: a card footer, a phone form, a dialog's only action.
- `.ayy-button--start` — Icon and label sit at the inline start of a wide button (like an App shell link). Use with block.
- `.ayy-button--end` — Icon and label sit at the inline end of a wide button. Use with block. Centered is the default, no class.

**States**
- `default` — Primary: --ayy-color-primary fill, --ayy-color-primary-fg label, semibold. Secondary: wash fill and line border. Outline: transparent with a line-strong border. Ghost: transparent, no border. Destructive: 10% red tint, red label. Link: plain text. Ring: wash inside a gradient ring.
- `hover` (`:hover`) — Lifts 2px. Primary adds the glow shadow at 90% opacity; secondary, outline, ghost and ring move to wash-hover, wash or highlight with a stronger border; destructive deepens to a 15% tint. Link underlines instead of lifting; ring's border spins.
- `pressed` (`:active`) — Drops back to its resting position while held; colours stay as on hover.
- `focus` (`:focus-visible`) — 2px --ayy-color-ring outline, 2px offset. Ring also spins its border.
- `disabled` (`:disabled on <button>, aria-disabled="true" on <a>`) — --ayy-opacity-disabled, ignores the pointer. Forced colours: GrayText border and label.
- `selected` — doesn't apply: Not a toggle. For on/off use a Chip button (aria-pressed), for one of a few a Segmented control, for a setting a Switch.
- `error` — doesn't apply: Errors belong to the form: a FieldError under the field, or an Alert for a failed action.
- `loading` (`aria-busy="true" with an aria-hidden .ayy-spinner as the first child (React: loading)`) — Spinner before the label; clicks and form submits are ignored; stays focusable. Keep the label (or "Saving…") so the width barely moves.

**Sizes**
- `sm` — Control sm step: --ayy-size-control-sm tall (28px compact, 32 comfortable, 40 touch), --ayy-control-pad-sm inline padding, --ayy-control-text-sm (12/13/14px), --ayy-size-icon-sm (16px) icon, 6px gap.
- `md` (default) — Control md step: --ayy-size-control-md tall (32px compact, 40 comfortable, 44 touch), --ayy-control-pad-md inline padding, --ayy-control-text-md (12/13/14px), --ayy-size-icon-sm (16px) icon, 8px gap.
- `lg` — Control lg step: --ayy-size-control-lg tall (40px compact, 48 comfortable, 52 touch), --ayy-control-pad-lg inline padding, --ayy-control-text-lg (14/15/16px), --ayy-size-icon-md (20px) icon, 8px gap. Matches lg App shell links.
- `icon` — Square at the md control height (32/40/44px) with a 16px icon (needs aria-label).
- `icon-sm` — Square at the sm control height (28/32/40px) with a 16px icon.
- `icon-lg` — Square at the lg control height (40/48/52px) with a 20px icon.
- Density — Height, inline padding and label size follow data-density across all steps (sm/md/lg); icons stay fixed at 16px (sm/md) and 20px (lg).
- Width — Hugs its label. block (ayy-button--block) fills its container: a phone form, a card footer, a dialog's only action.

**React** — `import { Button } from "@danitesler/ayywi/react";`
- `<Button>` renders <button>. Props: `variant` "primary" | "secondary" | "outline" | "ghost" | "destructive" | "link" | "ring"; `size` "sm" | "md" | "lg" | "icon" | "icon-sm" | "icon-lg"; `type` Defaults to "button" (not "submit").; `block` boolean — full width (ayy-button--block).; `align` "start" | "center" | "end" — where the icon and label sit in a wide button; center is the default.; `loading` boolean — a Spinner before the label and aria-busy="true"; clicks and form submits are ignored while it's set. Stays focusable.; `...rest` All native <button> attributes.

**Accessibility**
- Icon-only buttons need aria-label and should always have a visible Tooltip on hover/focus.
- Use disabled on <button>; on <a> use aria-disabled="true" (the class handles both).
- Visible focus ring on :focus-visible is built in — never remove it.
- While it works, set aria-busy="true" and put an aria-hidden .ayy-spinner first inside (React: loading). Don't disable it: focus would jump away.

**Do**
- Use a button for any action the user can take: submit, open, save, delete.
- Apply buttonClass() to an <a> when a link should look like an action.
- Always pair icon-only buttons (size="icon*", without a text label) with a Tooltip so sighted mouse and keyboard users can identify the action.
- Keep one primary button per view or section; make everything else secondary, outline or ghost.
- On a marketing or portfolio page, the one call to action can be ring instead of primary, with an outline button beside it.
- Put the icon (<Icon> or an .ayy-icon <svg>) before the label; the button sizes it (16px on sm/md, 20px on lg).

**Don't**
- Don't use a button for navigation inside running text — use a plain link.
- Don't use a button to toggle a setting on/off — use Switch.
- Don't restyle colours per button — add a variant to the design system instead.
- Don't use destructive for non-destructive emphasis.

## Button — Variants

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<button type="button" class="ayy-button">Primary</button>
<button type="button" class="ayy-button ayy-button--secondary">Secondary</button>
<button type="button" class="ayy-button ayy-button--outline">Outline</button>
<button type="button" class="ayy-button ayy-button--ghost">Ghost</button>
<button type="button" class="ayy-button ayy-button--destructive">Delete</button>
<button type="button" class="ayy-button ayy-button--link">Link</button>
<button type="button" class="ayy-button" aria-busy="true"><span class="ayy-spinner" aria-hidden="true"></span>Saving…</button>
<button type="button" class="ayy-button" disabled>Disabled</button>
```

React:

```tsx
import { Button } from "@danitesler/ayywi/react";

export default function Example() {
  return (
    <>
      <Button>Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="destructive">Delete</Button>
      <Button variant="link">Link</Button>
      <Button loading>Saving…</Button>
      <Button disabled>Disabled</Button>
    </>
  );
}
```

## Button — Sizes

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<button type="button" class="ayy-button ayy-button--sm">Small</button>
<button type="button" class="ayy-button">Medium</button>
<button type="button" class="ayy-button ayy-button--lg">Large</button>
<button type="button" class="ayy-button ayy-button--outline ayy-button--sm">Small</button>
<button type="button" class="ayy-button ayy-button--outline">Medium</button>
<button type="button" class="ayy-button ayy-button--outline ayy-button--lg">Large</button>
```

React:

```tsx
import { Button } from "@danitesler/ayywi/react";

export default function Example() {
  return (
    <>
      <Button size="sm">Small</Button>
      <Button>Medium</Button>
      <Button size="lg">Large</Button>
      <Button variant="outline" size="sm">Small</Button>
      <Button variant="outline">Medium</Button>
      <Button variant="outline" size="lg">Large</Button>
    </>
  );
}
```

## Button — With icon & icon-only

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<button type="button" class="ayy-button">
  <svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 4V20M20 12H4" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/></svg>
  New project
</button>
<button type="button" class="ayy-button ayy-button--secondary">
  <svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M3 20.5002C3.28417 16.8058 6.3 13.7193 10.0008 13.5379C10.3134 13.5226 10.6446 13.5097 11 13.5L11.995 13.5663C12.6939 13.6129 13.3665 13.7543 14 13.9777" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/><path d="M18 15.5V21.5M21 18.5L15 18.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/><circle cx="11" cy="6.5" r="4" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/></svg>
  Invite member
</button>
<span class="ayy-tooltip">
  <button type="button" class="ayy-button ayy-button--outline ayy-button--icon-lg" aria-label="Add item">
    <svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 4V20M20 12H4" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/></svg>
  </button>
  <span role="tooltip" class="ayy-tooltip__content">Add item (large)</span>
</span>
<span class="ayy-tooltip">
  <button type="button" class="ayy-button ayy-button--outline ayy-button--icon" aria-label="Add item">
    <svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 4V20M20 12H4" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/></svg>
  </button>
  <span role="tooltip" class="ayy-tooltip__content">Add item</span>
</span>
<span class="ayy-tooltip">
  <button type="button" class="ayy-button ayy-button--ghost ayy-button--icon-sm" aria-label="Add item">
    <svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 4V20M20 12H4" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/></svg>
  </button>
  <span role="tooltip" class="ayy-tooltip__content">Add item (compact)</span>
</span>
```

React:

```tsx
import { PlusSignIcon, UserAdd01Icon } from "@hugeicons/core-free-icons";
import { Button, Icon, Tooltip } from "@danitesler/ayywi/react";

export default function Example() {
  return (
    <>
      <Button>
        <Icon icon={PlusSignIcon} />
        New project
      </Button>
      <Button variant="secondary">
        <Icon icon={UserAdd01Icon} />
        Invite member
      </Button>
      <Tooltip content="Add item (large)">
        <Button variant="outline" size="icon-lg" aria-label="Add item">
          <Icon icon={PlusSignIcon} />
        </Button>
      </Tooltip>
      <Tooltip content="Add item">
        <Button variant="outline" size="icon" aria-label="Add item">
          <Icon icon={PlusSignIcon} />
        </Button>
      </Tooltip>
      <Tooltip content="Add item (compact)">
        <Button variant="ghost" size="icon-sm" aria-label="Add item">
          <Icon icon={PlusSignIcon} />
        </Button>
      </Tooltip>
    </>
  );
}
```

## Button — Loading with spinner

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<button type="button" class="ayy-button" aria-busy="true"><span class="ayy-spinner" aria-hidden="true"></span>Saving…</button>
<button type="button" class="ayy-button ayy-button--secondary" aria-busy="true"><span class="ayy-spinner" aria-hidden="true"></span>Uploading…</button>
<button type="button" class="ayy-button ayy-button--outline" aria-busy="true"><span class="ayy-spinner" aria-hidden="true"></span>Refreshing</button>
<button type="button" class="ayy-button ayy-button--ghost ayy-button--sm" aria-busy="true"><span class="ayy-spinner" aria-hidden="true"></span>Syncing</button>
<button type="button" class="ayy-button ayy-button--outline ayy-button--icon" aria-busy="true" aria-label="Refreshing"><span class="ayy-spinner" aria-hidden="true"></span></button>
```

React:

```tsx
import { Button } from "@danitesler/ayywi/react";

export default function Example() {
  return (
    <>
      <Button loading>Saving…</Button>
      <Button variant="secondary" loading>
        Uploading…
      </Button>
      <Button variant="outline" loading>
        Refreshing
      </Button>
      <Button variant="ghost" size="sm" loading>
        Syncing
      </Button>
      <Button variant="outline" size="icon" loading aria-label="Refreshing" />
    </>
  );
}
```

## Button — Wide button alignment

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<div class="ayy-stack" style="inline-size: min(100%, 20rem); --ayy-gap: var(--ayy-space-2)">
  <button type="button" class="ayy-button ayy-button--secondary ayy-button--block ayy-button--start">
    <svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 4V20M20 12H4" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/></svg>
    Align start
  </button>
  <button type="button" class="ayy-button ayy-button--secondary ayy-button--block">
    <svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 4V20M20 12H4" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/></svg>
    Align center (default)
  </button>
  <button type="button" class="ayy-button ayy-button--secondary ayy-button--block ayy-button--end">
    <svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 4V20M20 12H4" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/></svg>
    Align end
  </button>
</div>
```

React:

```tsx
import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { PlusSignIcon } from "@hugeicons/core-free-icons";
import {
  Button,
  Field,
  Icon,
  Label,
  Select,
  type ButtonSize,
  type ButtonVariant,
} from "@danitesler/ayywi/react";

export default function Example({
  setControls,
}: {
  setControls?: (node: ReactNode) => void;
} = {}) {
  const [size, setSize] = useState<ButtonSize>("sm");
  const [variant, setVariant] = useState<ButtonVariant>("secondary");

  useEffect(() => {
    return () => setControls?.(null);
  }, [setControls]);

  useEffect(() => {
    if (!setControls) return;
    setControls(
      <div className="ayy-stack">
        <div className="ayy-stack">
          <div className="ayy-spread">
            <Label htmlFor="btn-align-size">Size</Label>
            <div style={{ inlineSize: "8rem" }}>
              <Select
                id="btn-align-size"
                size="sm"
                value={size}
                onChange={(e) => setSize(e.target.value as ButtonSize)}
              >
                <option value="sm">Small (sm)</option>
                <option value="md">Medium (md)</option>
                <option value="lg">Large (lg)</option>
              </Select>
            </div>
          </div>
          <div className="ayy-spread">
            <Label htmlFor="btn-align-variant">Variant</Label>
            <div style={{ inlineSize: "8rem" }}>
              <Select
                id="btn-align-variant"
                size="sm"
                value={variant}
                onChange={(e) => setVariant(e.target.value as ButtonVariant)}
              >
                <option value="primary">Primary</option>
                <option value="secondary">Secondary</option>
                <option value="outline">Outline</option>
                <option value="ghost">Ghost</option>
              </Select>
            </div>
          </div>
        </div>
      </div>
    );
  }, [setControls, size, variant]);

  return (
    <div
      className="ayy-stack"
      style={{
        inlineSize: "100%",
        alignItems: "center",
        "--ayy-gap": "var(--ayy-space-4)",
      } as CSSProperties}
    >
      {/* Fallback inline controls when rendered standalone outside Showcase */}
      {!setControls ? (
        <div
          className="ayy-cluster"
          style={{
            "--ayy-gap": "var(--ayy-space-3)",
            justifyContent: "center",
          } as CSSProperties}
        >
          <Field inline>
            <Label htmlFor="btn-align-size-inline">Size</Label>
            <Select
              id="btn-align-size-inline"
              size="sm"
              value={size}
              onChange={(e) => setSize(e.target.value as ButtonSize)}
            >
              <option value="sm">Small (sm)</option>
              <option value="md">Medium (md)</option>
              <option value="lg">Large (lg)</option>
            </Select>
          </Field>
          <Field inline>
            <Label htmlFor="btn-align-variant-inline">Variant</Label>
            <Select
              id="btn-align-variant-inline"
              size="sm"
              value={variant}
              onChange={(e) => setVariant(e.target.value as ButtonVariant)}
            >
              <option value="primary">Primary</option>
              <option value="secondary">Secondary</option>
              <option value="outline">Outline</option>
              <option value="ghost">Ghost</option>
            </Select>
          </Field>
        </div>
      ) : null}

      <div
        className="ayy-stack"
        style={{
          inlineSize: "min(100%, 20rem)",
          "--ayy-gap": "var(--ayy-space-2)",
        } as CSSProperties}
      >
        <Button variant={variant} size={size} block align="start">
          <Icon icon={PlusSignIcon} />
          Align start
        </Button>
        <Button variant={variant} size={size} block align="center">
          <Icon icon={PlusSignIcon} />
          Align center (default)
        </Button>
        <Button variant={variant} size={size} block align="end">
          <Icon icon={PlusSignIcon} />
          Align end
        </Button>
      </div>
    </div>
  );
}
```

## Button — Link styled as a button

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<a href="#docs" class="ayy-button ayy-button--outline">Read the docs</a>
<a href="#docs" class="ayy-button ayy-button--ghost ayy-button--sm">Changelog</a>
```

React:

```tsx
import { buttonClass } from "@danitesler/ayywi/react";

export default function Example() {
  return (
    <>
      <a href="#docs" className={buttonClass({ variant: "outline" })}>
        Read the docs
      </a>
      <a href="#docs" className={buttonClass({ variant: "ghost", size: "sm" })}>
        Changelog
      </a>
    </>
  );
}
```

## Button — Ring call to action

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<!-- The site-wide call to action beside a quieter outline link, as in a hero. -->
<a href="#connect" class="ayy-button ayy-button--ring ayy-button--lg">Let's connect</a>
<a href="#work" class="ayy-button ayy-button--outline ayy-button--lg">See the work</a>
```

React:

```tsx
import { buttonClass } from "@danitesler/ayywi/react";

export default function Example() {
  return (
    <>
      <a href="#connect" className={buttonClass({ variant: "ring", size: "lg" })}>
        Let's connect
      </a>
      <a href="#work" className={buttonClass({ variant: "outline", size: "lg" })}>
        See the work
      </a>
    </>
  );
}
```

---
Part of @danitesler/ayywi 0.1.1: load `dist/ayywi.min.css` (and `dist/elements.global.js` for the <ayy-*> elements). The rules every screen follows: [llms-full.txt#rules](../llms-full.txt#rules). Every component: [llms.txt](../llms.txt).
