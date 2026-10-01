# Button

Category: Actions. Triggers an action. Pill-shaped, monochrome primary with a subtle lift on hover.

**Classes**
- `.ayy-button` — Root. Alone it is the primary button.
- `.ayy-button--secondary` — Quiet filled button for secondary actions.
- `.ayy-button--outline` — Bordered, transparent. Neutral alternative to secondary.
- `.ayy-button--ghost` — No border or fill until hover. Toolbars, icon buttons.
- `.ayy-button--destructive` — Tinted red. Irreversible actions.
- `.ayy-button--link` — Looks like a text link.
- `.ayy-button--ring` — Showcase call to action: quiet fill inside a gradient ring that spins on hover and focus. For marketing and portfolio pages; one per view.
- `.ayy-button--sm` — 28px tall.
- `.ayy-button--lg` — 40px tall.
- `.ayy-button--icon` — Square 32px, for a single icon.
- `.ayy-button--icon-sm` — Square 28px, for a single icon.
- `.ayy-button--block` — Fills its container's width: a card footer, a phone form, a dialog's only action.

**JS (framework-free)**: buttonClass({ variant?, size?, block?, className? }) → string. Loading in HTML: aria-busy="true" plus <span class="ayy-spinner" aria-hidden="true"></span> as the first child.

**React** — `import { Button } from "ayywi/react";`
- `<Button>` renders <button>. Props: `variant` "primary" | "secondary" | "outline" | "ghost" | "destructive" | "link" | "ring"; `size` "sm" | "md" | "lg" | "icon" | "icon-sm"; `type` Defaults to "button" (not "submit").; `block` boolean — full width (ayy-button--block).; `loading` boolean — a Spinner before the label and aria-busy="true"; clicks and form submits are ignored while it's set. Stays focusable.; `...rest` All native <button> attributes.

**Accessibility**
- Icon-only buttons need aria-label.
- Use disabled on <button>; on <a> use aria-disabled="true" (the class handles both).
- Visible focus ring on :focus-visible is built in — never remove it.
- While it works, set aria-busy="true" and put an aria-hidden .ayy-spinner first inside (React: loading). Don't disable it: focus would jump away.

**Do**
- Use a button for any action the user can take: submit, open, save, delete.
- Apply buttonClass() to an <a> when a link should look like an action.
- Keep one primary button per view or section; make everything else secondary, outline or ghost.
- On a marketing or portfolio page, the one call to action can be ring instead of primary, with an outline button beside it.
- Put the icon (<Icon> or an .ayy-icon <svg>) before the label; the button sizes it (1.25em).

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
<button type="button" class="ayy-button" disabled>Disabled</button>
```

React:

```tsx
import { Button } from "ayywi/react";

export default function Example() {
  return (
    <>
      <Button>Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="destructive">Delete</Button>
      <Button variant="link">Link</Button>
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
import { Button } from "ayywi/react";

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
<button type="button" class="ayy-button ayy-button--outline ayy-button--icon" aria-label="Add">
  <svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 4V20M20 12H4" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/></svg>
</button>
<button type="button" class="ayy-button ayy-button--ghost ayy-button--icon-sm" aria-label="Add">
  <svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 4V20M20 12H4" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/></svg>
</button>
```

React:

```tsx
import { PlusSignIcon, UserAdd01Icon } from "@hugeicons/core-free-icons";
import { Button, Icon } from "ayywi/react";

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
      <Button variant="outline" size="icon" aria-label="Add">
        <Icon icon={PlusSignIcon} />
      </Button>
      <Button variant="ghost" size="icon-sm" aria-label="Add">
        <Icon icon={PlusSignIcon} />
      </Button>
    </>
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
import { buttonClass } from "ayywi/react";

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
import { buttonClass } from "ayywi/react";

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
Part of ayywi 0.4.0: load `dist/ayywi.min.css` (and `dist/elements.global.js` for the <ayy-*> elements). The rules every screen follows: [llms-full.txt#rules](../llms-full.txt#rules). Every component: [llms.txt](../llms.txt).
