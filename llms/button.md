# Button

Category: Actions. The control for starting an action, like saving, submitting or opening something. It comes in a few weights, from a strong primary button to quieter ones for secondary actions. Also called: button, btn, icon-button, icon-btn, cta, split-button, button-group.

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
- `.ayy-button--start` — Icon and label sit at the inline start of a wide button, laid out like an App shell row of the same size: the icon is centred in a square as wide as the button is high, so a sm, md or lg button lines up with a sm, md or lg menu item. Use with block.
- `.ayy-button--end` — Icon and label sit at the inline end of a wide button, with the same edge spacing as --start (mirrored). Use with block. Centered is the default, no class.
- `.ayy-button-split` — Group joining a main action .ayy-button and a trailing icon .ayy-button (opening a menu) into a single split button with a shared seam.
- `.ayy-button-split--block` — Full-width split button: the main action stretches and the menu trigger stays square.

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
- `sm` — Control sm step: --ayy-size-control-sm tall (28px compact, 32 comfortable, 40 touch), --ayy-control-pad-sm inline padding, --ayy-control-text-sm (13/13/14px), --ayy-size-icon-sm (16px) icon, 6px gap.
- `md` (default) — Control md step: --ayy-size-control-md tall (32px compact, 40 comfortable, 44 touch), --ayy-control-pad-md inline padding, --ayy-control-text-md (13/13/14px), --ayy-size-icon-sm (16px) icon, 8px gap.
- `lg` — Control lg step: --ayy-size-control-lg tall (40px compact, 48 comfortable, 52 touch), --ayy-control-pad-lg inline padding, --ayy-control-text-lg (14/15/16px), --ayy-size-icon-md (20px) icon, 8px gap. Matches lg App shell links.
- `icon` — Square at the md control height (32/40/44px) with a 16px icon (needs aria-label).
- `icon-sm` — Square at the sm control height (28/32/40px) with a 16px icon.
- `icon-lg` — Square at the lg control height (36/44/48px) with a 20px icon.
- Density — Height, inline padding and label size follow data-density across all steps (sm/md/lg); icons stay fixed at 16px (sm/md) and 20px (lg).
- Width — Hugs its label. block (ayy-button--block) fills its container: a phone form, a card footer, a dialog's only action.

**React** — `import { Button, SplitButton } from "@danitesler/ayywi/react";`
- `<Button>` renders <button>. Props: `variant` "primary" | "secondary" | "outline" | "ghost" | "destructive" | "link" | "ring"; `size` "sm" | "md" | "lg" | "icon" | "icon-sm" | "icon-lg"; `type` Defaults to "button" (not "submit").; `block` boolean — full width (ayy-button--block).; `align` "start" | "center" | "end" — where the icon and label sit in a wide button; center is the default.; `loading` boolean — a Spinner before the label and aria-busy="true"; clicks and form submits are ignored while it's set. Stays focusable.; `tooltip` ReactNode | boolean — custom tooltip text or element; icon-only buttons show their aria-label on hover by default (pass false to disable).; `tooltipSide` "top" | "bottom" | "start" | "end" — placement of the tooltip (default "top").; `...rest` All native <button> attributes.
- `<SplitButton>` renders <div role="group" class="ayy-button-split">. Props: `block` boolean — full width (ayy-button-split--block); the main action grows, the menu trigger stays square.; `...rest` All native <div> attributes.

**Accessibility**
- Icon-only buttons need aria-label and should always have a visible Tooltip on hover/focus.
- In a SplitButton, give the trailing menu trigger an explicit aria-label naming what it opens ("More deploy options").
- Use disabled on <button>; on <a> use aria-disabled="true" (the class handles both).
- Visible focus ring on :focus-visible is built in — never remove it.
- While it works, set aria-busy="true" and put an aria-hidden .ayy-spinner first inside (React: loading). Don't disable it: focus would jump away.

**Do**
- Use a button for any action the user can take: submit, open, save, delete.
- Use a SplitButton when a primary action has closely related alternatives in a DropdownMenu ("Deploy" + "Deploy to preview").
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

## Button — Split button

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<!-- .ayy-button-split fuses a primary action button with an <ayy-menu> trigger button. -->
<div class="ayy-cluster">
  <div role="group" class="ayy-button-split">
    <button type="button" class="ayy-button">
      <svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6.21875 11.618L3.31189 11.2378C2.71644 11.1606 2.31883 10.5841 2.58348 10.0458C3.42523 8.33365 5.6195 6.35437 9.73988 6.68079M6.21875 11.618C7.27445 9.85426 8.57175 8.00435 9.73988 6.68079M6.21875 11.618L11.882 17.2812M9.73988 6.68079C13.4105 2.58986 17.1745 1.728 19.5937 2.06685C20.5508 2.2009 21.2991 2.94917 21.4332 3.90626C21.772 6.32551 20.9101 10.0895 16.8192 13.7601M11.882 17.2812L12.2622 20.1881C12.3394 20.7836 12.9159 21.1812 13.4542 20.9165C15.1664 20.0748 17.1456 17.8805 16.8192 13.7601M11.882 17.2812C13.6457 16.2255 15.4956 14.9282 16.8192 13.7601" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M17.5 8C17.5 6.89543 16.6046 6 15.5 6C14.3954 6 13.5 6.89543 13.5 8C13.5 9.10457 14.3954 10 15.5 10C16.6046 10 17.5 9.10457 17.5 8Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M4 22L8 18M4 17L5.5 15.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg>
      Deploy
    </button>
    <ayy-menu align="end">
      <ayy-tooltip class="ayy-tooltip">
        <button type="button" class="ayy-button ayy-button--icon" aria-haspopup="menu" popovertarget="split-deploy-menu" aria-label="More deploy options" aria-describedby="split-deploy-tip">
          <svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M18 9.00005C18 9.00005 13.5811 15 12 15C10.4188 15 6 9 6 9" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg>
        </button>
        <span role="tooltip" id="split-deploy-tip" class="ayy-tooltip__content" data-side="top">More deploy options</span>
      </ayy-tooltip>
      <div id="split-deploy-menu" role="menu" class="ayy-menu" popover="auto">
        <button type="button" role="menuitem" tabindex="-1" class="ayy-menu__item">
          <svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6.21875 11.618L3.31189 11.2378C2.71644 11.1606 2.31883 10.5841 2.58348 10.0458C3.42523 8.33365 5.6195 6.35437 9.73988 6.68079M6.21875 11.618C7.27445 9.85426 8.57175 8.00435 9.73988 6.68079M6.21875 11.618L11.882 17.2812M9.73988 6.68079C13.4105 2.58986 17.1745 1.728 19.5937 2.06685C20.5508 2.2009 21.2991 2.94917 21.4332 3.90626C21.772 6.32551 20.9101 10.0895 16.8192 13.7601M11.882 17.2812L12.2622 20.1881C12.3394 20.7836 12.9159 21.1812 13.4542 20.9165C15.1664 20.0748 17.1456 17.8805 16.8192 13.7601M11.882 17.2812C13.6457 16.2255 15.4956 14.9282 16.8192 13.7601" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M17.5 8C17.5 6.89543 16.6046 6 15.5 6C14.3954 6 13.5 6.89543 13.5 8C13.5 9.10457 14.3954 10 15.5 10C16.6046 10 17.5 9.10457 17.5 8Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M4 22L8 18M4 17L5.5 15.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg>
          Deploy to preview
        </button>
        <button type="button" role="menuitem" tabindex="-1" class="ayy-menu__item">
          <svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M16 2V6M8 2V6" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M13 4H11C7.22876 4 5.34315 4 4.17157 5.17157C3 6.34315 3 8.22876 3 12V14C3 17.7712 3 19.6569 4.17157 20.8284C5.34315 22 7.22876 22 11 22H13C16.7712 22 18.6569 22 19.8284 20.8284C21 19.6569 21 17.7712 21 14V12C21 8.22876 21 6.34315 19.8284 5.17157C18.6569 4 16.7712 4 13 4Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M3 10H21" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M12.1258 14H12.0008M12.1258 18H12.0008M7.625 14H7.5M7.625 18H7.5M16.625 14H16.5M12.2508 14C12.2508 14.1381 12.1389 14.25 12.0008 14.25C11.8628 14.25 11.7508 14.1381 11.7508 14C11.7508 13.8619 11.8628 13.75 12.0008 13.75C12.1389 13.75 12.2508 13.8619 12.2508 14ZM12.2508 18C12.2508 18.1381 12.1389 18.25 12.0008 18.25C11.8628 18.25 11.7508 18.1381 11.7508 18C11.7508 17.8619 11.8628 17.75 12.0008 17.75C12.1389 17.75 12.2508 17.8619 12.2508 18ZM7.75 14C7.75 14.1381 7.63807 14.25 7.5 14.25C7.36193 14.25 7.25 14.1381 7.25 14C7.25 13.8619 7.36193 13.75 7.5 13.75C7.63807 13.75 7.75 13.8619 7.75 14ZM7.75 18C7.75 18.1381 7.63807 18.25 7.5 18.25C7.36193 18.25 7.25 18.1381 7.25 18C7.25 17.8619 7.36193 17.75 7.5 17.75C7.63807 17.75 7.75 17.8619 7.75 18ZM16.75 14C16.75 14.1381 16.6381 14.25 16.5 14.25C16.3619 14.25 16.25 14.1381 16.25 14C16.25 13.8619 16.3619 13.75 16.5 13.75C16.6381 13.75 16.75 13.8619 16.75 14Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg>
          Schedule deploy
        </button>
        <div role="separator" class="ayy-menu__separator"></div>
        <button type="button" role="menuitem" tabindex="-1" class="ayy-menu__item">
          <svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7.5 14.5C7.5 11.2002 7.5 9.55025 8.52513 8.52513C9.55025 7.5 11.2002 7.5 14.5 7.5C17.7998 7.5 19.4497 7.5 20.4749 8.52513C21.5 9.55025 21.5 11.2002 21.5 14.5C21.5 17.7998 21.5 19.4497 20.4749 20.4749C19.4497 21.5 17.7998 21.5 14.5 21.5C11.2002 21.5 9.55025 21.5 8.52513 20.4749C7.5 19.4497 7.5 17.7998 7.5 14.5Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M7.5 16.5C6.10355 16.5 5.40533 16.5 4.84402 16.3036C3.83866 15.9518 3.0482 15.1613 2.69641 14.156C2.5 13.5947 2.5 12.8964 2.5 11.5V9.5C2.5 6.20017 2.5 4.55025 3.52513 3.52513C4.55025 2.5 6.20017 2.5 9.5 2.5H11.5C12.8964 2.5 13.5947 2.5 14.156 2.69641C15.1613 3.0482 15.9518 3.83866 16.3036 4.84402C16.5 5.40533 16.5 6.10355 16.5 7.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg>
          Copy build command
        </button>
      </div>
    </ayy-menu>
  </div>

  <div role="group" class="ayy-button-split">
    <button type="button" class="ayy-button ayy-button--outline">Save changes</button>
    <ayy-menu align="end">
      <ayy-tooltip class="ayy-tooltip">
        <button type="button" class="ayy-button ayy-button--outline ayy-button--icon" aria-haspopup="menu" popovertarget="split-save-menu" aria-label="More save options" aria-describedby="split-save-tip">
          <svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M18 9.00005C18 9.00005 13.5811 15 12 15C10.4188 15 6 9 6 9" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg>
        </button>
        <span role="tooltip" id="split-save-tip" class="ayy-tooltip__content" data-side="top">More save options</span>
      </ayy-tooltip>
      <div id="split-save-menu" role="menu" class="ayy-menu" popover="auto">
        <button type="button" role="menuitem" tabindex="-1" class="ayy-menu__item">
          <svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5"></circle><path d="M12 8V12L14 14" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg>
          Save as draft
        </button>
        <button type="button" role="menuitem" tabindex="-1" class="ayy-menu__item">
          <svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7.5 14.5C7.5 11.2002 7.5 9.55025 8.52513 8.52513C9.55025 7.5 11.2002 7.5 14.5 7.5C17.7998 7.5 19.4497 7.5 20.4749 8.52513C21.5 9.55025 21.5 11.2002 21.5 14.5C21.5 17.7998 21.5 19.4497 20.4749 20.4749C19.4497 21.5 17.7998 21.5 14.5 21.5C11.2002 21.5 9.55025 21.5 8.52513 20.4749C7.5 19.4497 7.5 17.7998 7.5 14.5Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M7.5 16.5C6.10355 16.5 5.40533 16.5 4.84402 16.3036C3.83866 15.9518 3.0482 15.1613 2.69641 14.156C2.5 13.5947 2.5 12.8964 2.5 11.5V9.5C2.5 6.20017 2.5 4.55025 3.52513 3.52513C4.55025 2.5 6.20017 2.5 9.5 2.5H11.5C12.8964 2.5 13.5947 2.5 14.156 2.69641C15.1613 3.0482 15.9518 3.83866 16.3036 4.84402C16.5 5.40533 16.5 6.10355 16.5 7.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg>
          Save as template
        </button>
      </div>
    </ayy-menu>
  </div>

  <div role="group" class="ayy-button-split">
    <button type="button" class="ayy-button ayy-button--secondary ayy-button--sm">Export CSV</button>
    <ayy-menu align="end">
      <ayy-tooltip class="ayy-tooltip">
        <button type="button" class="ayy-button ayy-button--secondary ayy-button--icon-sm" aria-haspopup="menu" popovertarget="split-export-menu" aria-label="More export formats" aria-describedby="split-export-tip">
          <svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M18 9.00005C18 9.00005 13.5811 15 12 15C10.4188 15 6 9 6 9" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg>
        </button>
        <span role="tooltip" id="split-export-tip" class="ayy-tooltip__content" data-side="top">More export formats</span>
      </ayy-tooltip>
      <div id="split-export-menu" role="menu" class="ayy-menu" popover="auto">
        <button type="button" role="menuitem" tabindex="-1" class="ayy-menu__item">Export JSON</button>
        <button type="button" role="menuitem" tabindex="-1" class="ayy-menu__item">Export Parquet</button>
      </div>
    </ayy-menu>
  </div>
</div>
```

React:

```tsx
import { ArrowDown01Icon, Calendar03Icon, Clock01Icon, Copy01Icon, Rocket01Icon } from "@hugeicons/core-free-icons";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Icon,
  SplitButton,
  toast,
} from "@danitesler/ayywi/react";

export default function Example() {
  return (
    <div className="ayy-cluster">
      <SplitButton>
        <Button onClick={() => toast.success("Deployed to production")}>
          <Icon icon={Rocket01Icon} />
          Deploy
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger size="icon" aria-label="More deploy options">
            <Icon icon={ArrowDown01Icon} />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem icon={<Icon icon={Rocket01Icon} />} onSelect={() => toast("Deploying preview…")}>
              Deploy to preview
            </DropdownMenuItem>
            <DropdownMenuItem icon={<Icon icon={Calendar03Icon} />} onSelect={() => toast("Scheduled for 09:00")}>
              Schedule deploy
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem icon={<Icon icon={Copy01Icon} />} onSelect={() => toast("Build command copied")}>
              Copy build command
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SplitButton>

      <SplitButton>
        <Button variant="outline" onClick={() => toast("Saved")}>
          Save changes
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger variant="outline" size="icon" aria-label="More save options">
            <Icon icon={ArrowDown01Icon} />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem icon={<Icon icon={Clock01Icon} />} onSelect={() => toast("Saved as draft")}>
              Save as draft
            </DropdownMenuItem>
            <DropdownMenuItem icon={<Icon icon={Copy01Icon} />} onSelect={() => toast("Saved as template")}>
              Save as template
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SplitButton>

      <SplitButton>
        <Button variant="secondary" size="sm" onClick={() => toast("Exported CSV")}>
          Export CSV
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger variant="secondary" size="icon-sm" aria-label="More export formats">
            <Icon icon={ArrowDown01Icon} />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={() => toast("Exported JSON")}>Export JSON</DropdownMenuItem>
            <DropdownMenuItem onSelect={() => toast("Exported Parquet")}>Export Parquet</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SplitButton>
    </div>
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
<span class="ayy-tooltip">
  <button type="button" class="ayy-button ayy-button--outline ayy-button--icon" aria-busy="true" aria-label="Refreshing"><span class="ayy-spinner" aria-hidden="true"></span></button>
  <span role="tooltip" class="ayy-tooltip__content">Refreshing</span>
</span>
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
Part of @danitesler/ayywi 0.1.2: load `dist/ayywi.min.css` (and `dist/elements.global.js` for the <ayy-*> elements). The rules every screen follows: [llms-full.txt#rules](../llms-full.txt#rules). Every component: [llms.txt](../llms.txt).
