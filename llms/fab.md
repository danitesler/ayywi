# Floating action button

Category: Actions. The one main action of a phone screen (New task, Compose, Scan), as a round button floating at the bottom inline-end corner over the content. Extended adds a label. Fixed to the viewport and clear of the home indicator; as a direct child of an App shell it sits in the shell's corner and above its bottom nav on phones. Also called: fab, floating-action, floating-button, float-button.

**Classes**
- `.ayy-fab` — A <button> (or <a>) with an icon and an aria-label: primary fill, a lifted shadow, size from data-density. position: fixed at the bottom inline-end corner. In an .ayy-app-shell, place it after __main and before the bottom nav.
- `.ayy-fab--extended` — Icon and a visible label: a wider pill ("Compose"). Needs no aria-label.
- `.ayy-fab--secondary` — A raised surface with a border instead of the primary fill: less emphasis.
- `.ayy-fab--sm` — Smaller (the control-lg size), for a second action stacked above the main one.
- `.ayy-fab--inline` — Not floating: in the flow, placed by its container (an empty state, a toolbar, a docs page).

**States**
- `default` — A round primary-colour button with a 20px icon and the lift shadow, fixed to the bottom inline-end corner clear of the home indicator.
- `hover` (`:hover (devices that hover)`) — The fill mixes 12% toward the label colour.
- `pressed` (`:active`) — Shrinks to 94%.
- `focus` (`:focus-visible`) — 2px ring, 3px offset.
- `disabled` (`:disabled or [aria-disabled="true"]`) — --ayy-opacity-disabled, not-allowed cursor.
- `selected` — doesn't apply: A FAB runs an action; it has no on state. For a tool that stays on, use a Toolbar button with aria-pressed.
- `error` — doesn't apply: No error look. If the action fails, say so in a toast and leave the FAB as it was.
- `loading` — doesn't apply: Don't spin a FAB. Run the action and show progress where its result appears (a new row's Skeleton, a toast).

**Sizes**
- `sm` — The lg control height: 40px compact, 48 comfortable, 52 touch. A second action stacked above the main one.
- `md` (default) — The lg control height plus 12px: 52px compact, 60 comfortable, 64 touch.
- Density — Its diameter follows data-density through the lg control height (the sizes above).
- Width — Square, a circle. extended (ayy-fab--extended) hugs its icon and label as a pill. Takes no room: it floats over the content (inline puts it back in the flow).

**JS (framework-free)**: fabClass({ variant?, size?, extended?, inline?, className? }) → string; fabVariants, fabSizes.

**React** — `import { Fab } from "@danitesler/ayywi/react";`
- `<Fab>` renders <button type="button" class="ayy-fab">, or <a> with href. Props: `variant` "primary" | "secondary"; `size` "sm" | "md"; `extended` boolean — icon and a label; otherwise give it aria-label; `inline` boolean — not floating; `href` string — renders an <a>; `type` "button" | "submit" | "reset" — default "button"

**Accessibility**
- An icon-only FAB needs an aria-label that says the action ("New task"), not the icon ("Plus").
- Put it after the main content in the DOM so it comes after what it acts on in the tab order, not before the page.
- It must not cover content for good: the App shell keeps it out of the bottom nav, and lists need room at their end (padding-block-end of the FAB's height) so the last row can scroll clear of it.

**Do**
- Use one FAB for the screen's main, constructive action: create, compose, scan, add.
- Use extended when the action isn't obvious from an icon, or on the first screens of an app.
- Hide it on screens where the main action is already on screen (a form's Save) or while a sheet is open.

**Don't**
- Don't use more than one main FAB; stack a small secondary one at most.
- Don't put destructive or minor actions (Delete, Share, Settings) in a FAB — use a Top bar action or a Menu.
- Don't use it on desktop layouts where a toolbar button fits better.

## Floating action button — Icon, extended, secondary, small

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<!-- ayy-fab--inline places them in the row for this page; in an app they float at the bottom corner. -->
<div class="ayy-cluster" style="align-items: center; gap: 1.5rem">
  <button type="button" class="ayy-fab ayy-fab--inline" aria-label="New task"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12.001 5.00003V19.002" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M19.002 12.002L4.99998 12.002" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg></button>
  <button type="button" class="ayy-fab ayy-fab--extended ayy-fab--inline"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M15.2141 5.98239L16.6158 4.58063C17.39 3.80646 18.6452 3.80646 19.4194 4.58063C20.1935 5.3548 20.1935 6.60998 19.4194 7.38415L18.0176 8.78591M15.2141 5.98239L6.98023 14.2163C5.93493 15.2616 5.41226 15.7842 5.05637 16.4211C4.70047 17.058 4.3424 18.5619 4 20C5.43809 19.6576 6.94199 19.2995 7.57889 18.9436C8.21579 18.5877 8.73844 18.0651 9.78375 17.0198L18.0176 8.78591M15.2141 5.98239L18.0176 8.78591" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M11 20H17" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path></svg>Compose</button>
  <button type="button" class="ayy-fab ayy-fab--secondary ayy-fab--inline" aria-label="Record a voice note"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7 6.5C7 4.01472 9.01472 2 11.5 2C13.9853 2 16 4.01472 16 6.5V11.5C16 13.9853 13.9853 16 11.5 16C9.01472 16 7 13.9853 7 11.5V6.5Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M11.5 19H11.0828C7.57267 19 4.57706 16.4623 4 13M11.5 19H11.9172C15.4273 19 18.4229 16.4623 19 13M11.5 19V22" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg></button>
  <button type="button" class="ayy-fab ayy-fab--secondary ayy-fab--sm ayy-fab--inline" aria-label="Quick note"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M15.2141 5.98239L16.6158 4.58063C17.39 3.80646 18.6452 3.80646 19.4194 4.58063C20.1935 5.3548 20.1935 6.60998 19.4194 7.38415L18.0176 8.78591M15.2141 5.98239L6.98023 14.2163C5.93493 15.2616 5.41226 15.7842 5.05637 16.4211C4.70047 17.058 4.3424 18.5619 4 20C5.43809 19.6576 6.94199 19.2995 7.57889 18.9436C8.21579 18.5877 8.73844 18.0651 9.78375 17.0198L18.0176 8.78591M15.2141 5.98239L18.0176 8.78591" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M11 20H17" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path></svg></button>
</div>
```

React:

```tsx
import { Add01Icon, Mic01Icon, PencilEdit01Icon } from "@hugeicons/core-free-icons";
import { Fab, Icon } from "@danitesler/ayywi/react";

export default function Example() {
  // inline places them in the row for this page; in an app they float at the bottom corner.
  return (
    <div className="ayy-cluster" style={{ alignItems: "center", gap: "1.5rem" }}>
      <Fab inline aria-label="New task">
        <Icon icon={Add01Icon} />
      </Fab>
      <Fab inline extended>
        <Icon icon={PencilEdit01Icon} />
        Compose
      </Fab>
      <Fab inline variant="secondary" aria-label="Record a voice note">
        <Icon icon={Mic01Icon} />
      </Fab>
      <Fab inline size="sm" variant="secondary" aria-label="Quick note">
        <Icon icon={PencilEdit01Icon} />
      </Fab>
    </div>
  );
}
```

## Floating action button — In an app shell, above the bottom nav

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<!-- The FAB is a direct child of the shell, after the main area: its corner on wide screens, above the bottom nav below 48rem.
     The outer box only stands in for the browser window. -->
<div style="inline-size: 100%; block-size: 22rem; overflow: hidden; border: 1px solid var(--ayy-color-line); border-radius: var(--ayy-radius-xl)">
  <ayy-app-shell>
    <div class="ayy-app-shell" style="block-size: 100%">
      <aside class="ayy-app-shell__sidebar">
        <a class="ayy-app-shell__brand" href="#inbox">Tasks</a>
        <nav class="ayy-app-shell__nav" aria-label="Main">
          <a class="ayy-app-shell__link" aria-current="page" href="#inbox"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M2.5 12C2.5 7.52166 2.5 5.28249 3.89124 3.89124C5.28249 2.5 7.52166 2.5 12 2.5C16.4783 2.5 18.7175 2.5 20.1088 3.89124C21.5 5.28249 21.5 7.52166 21.5 12C21.5 16.4783 21.5 18.7175 20.1088 20.1088C18.7175 21.5 16.4783 21.5 12 21.5C7.52166 21.5 5.28249 21.5 3.89124 20.1088C2.5 18.7175 2.5 16.4783 2.5 12Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M21.5 13.5H16.5743C15.7322 13.5 15.0706 14.2036 14.6995 14.9472C14.2963 15.7551 13.4889 16.5 12 16.5C10.5111 16.5 9.70373 15.7551 9.30054 14.9472C8.92942 14.2036 8.26777 13.5 7.42566 13.5H2.5" stroke="currentColor" stroke-linejoin="round" stroke-width="1.5"></path></svg>Inbox</a>
          <a class="ayy-app-shell__link" href="#today"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M16 2V6M8 2V6" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M13 4H11C7.22876 4 5.34315 4 4.17157 5.17157C3 6.34315 3 8.22876 3 12V14C3 17.7712 3 19.6569 4.17157 20.8284C5.34315 22 7.22876 22 11 22H13C16.7712 22 18.6569 22 19.8284 20.8284C21 19.6569 21 17.7712 21 14V12C21 8.22876 21 6.34315 19.8284 5.17157C18.6569 4 16.7712 4 13 4Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M3 10H21" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M12.1258 14H12.0008M12.1258 18H12.0008M7.625 14H7.5M7.625 18H7.5M16.625 14H16.5M12.2508 14C12.2508 14.1381 12.1389 14.25 12.0008 14.25C11.8628 14.25 11.7508 14.1381 11.7508 14C11.7508 13.8619 11.8628 13.75 12.0008 13.75C12.1389 13.75 12.2508 13.8619 12.2508 14ZM12.2508 18C12.2508 18.1381 12.1389 18.25 12.0008 18.25C11.8628 18.25 11.7508 18.1381 11.7508 18C11.7508 17.8619 11.8628 17.75 12.0008 17.75C12.1389 17.75 12.2508 17.8619 12.2508 18ZM7.75 14C7.75 14.1381 7.63807 14.25 7.5 14.25C7.36193 14.25 7.25 14.1381 7.25 14C7.25 13.8619 7.36193 13.75 7.5 13.75C7.63807 13.75 7.75 13.8619 7.75 14ZM7.75 18C7.75 18.1381 7.63807 18.25 7.5 18.25C7.36193 18.25 7.25 18.1381 7.25 18C7.25 17.8619 7.36193 17.75 7.5 17.75C7.63807 17.75 7.75 17.8619 7.75 18ZM16.75 14C16.75 14.1381 16.6381 14.25 16.5 14.25C16.3619 14.25 16.25 14.1381 16.25 14C16.25 13.8619 16.3619 13.75 16.5 13.75C16.6381 13.75 16.75 13.8619 16.75 14Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg>Today</a>
        </nav>
      </aside>
      <main class="ayy-app-shell__main">
        <h2 class="ayy-h3">Inbox</h2>
        <p class="ayy-muted">Everything that isn&#x27;t in a list yet.</p>
      </main>
      <button type="button" class="ayy-fab" aria-label="New task"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12.001 5.00003V19.002" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M19.002 12.002L4.99998 12.002" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg></button>
      <nav class="ayy-bottom-nav" aria-label="Main">
        <a class="ayy-bottom-nav__link" aria-current="page" href="#inbox"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M2.5 12C2.5 7.52166 2.5 5.28249 3.89124 3.89124C5.28249 2.5 7.52166 2.5 12 2.5C16.4783 2.5 18.7175 2.5 20.1088 3.89124C21.5 5.28249 21.5 7.52166 21.5 12C21.5 16.4783 21.5 18.7175 20.1088 20.1088C18.7175 21.5 16.4783 21.5 12 21.5C7.52166 21.5 5.28249 21.5 3.89124 20.1088C2.5 18.7175 2.5 16.4783 2.5 12Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M21.5 13.5H16.5743C15.7322 13.5 15.0706 14.2036 14.6995 14.9472C14.2963 15.7551 13.4889 16.5 12 16.5C10.5111 16.5 9.70373 15.7551 9.30054 14.9472C8.92942 14.2036 8.26777 13.5 7.42566 13.5H2.5" stroke="currentColor" stroke-linejoin="round" stroke-width="1.5"></path></svg><span class="ayy-bottom-nav__label">Inbox</span></a>
        <a class="ayy-bottom-nav__link" href="#today"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M16 2V6M8 2V6" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M13 4H11C7.22876 4 5.34315 4 4.17157 5.17157C3 6.34315 3 8.22876 3 12V14C3 17.7712 3 19.6569 4.17157 20.8284C5.34315 22 7.22876 22 11 22H13C16.7712 22 18.6569 22 19.8284 20.8284C21 19.6569 21 17.7712 21 14V12C21 8.22876 21 6.34315 19.8284 5.17157C18.6569 4 16.7712 4 13 4Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M3 10H21" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M12.1258 14H12.0008M12.1258 18H12.0008M7.625 14H7.5M7.625 18H7.5M16.625 14H16.5M12.2508 14C12.2508 14.1381 12.1389 14.25 12.0008 14.25C11.8628 14.25 11.7508 14.1381 11.7508 14C11.7508 13.8619 11.8628 13.75 12.0008 13.75C12.1389 13.75 12.2508 13.8619 12.2508 14ZM12.2508 18C12.2508 18.1381 12.1389 18.25 12.0008 18.25C11.8628 18.25 11.7508 18.1381 11.7508 18C11.7508 17.8619 11.8628 17.75 12.0008 17.75C12.1389 17.75 12.2508 17.8619 12.2508 18ZM7.75 14C7.75 14.1381 7.63807 14.25 7.5 14.25C7.36193 14.25 7.25 14.1381 7.25 14C7.25 13.8619 7.36193 13.75 7.5 13.75C7.63807 13.75 7.75 13.8619 7.75 14ZM7.75 18C7.75 18.1381 7.63807 18.25 7.5 18.25C7.36193 18.25 7.25 18.1381 7.25 18C7.25 17.8619 7.36193 17.75 7.5 17.75C7.63807 17.75 7.75 17.8619 7.75 18ZM16.75 14C16.75 14.1381 16.6381 14.25 16.5 14.25C16.3619 14.25 16.25 14.1381 16.25 14C16.25 13.8619 16.3619 13.75 16.5 13.75C16.6381 13.75 16.75 13.8619 16.75 14Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg><span class="ayy-bottom-nav__label">Today</span></a>
        <a class="ayy-bottom-nav__link" href="#search"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M17 17L21 21" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19C15.4183 19 19 15.4183 19 11Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg><span class="ayy-bottom-nav__label">Search</span></a>
        <a class="ayy-bottom-nav__link" href="#settings"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M15.5 12C15.5 13.933 13.933 15.5 12 15.5C10.067 15.5 8.5 13.933 8.5 12C8.5 10.067 10.067 8.5 12 8.5C13.933 8.5 15.5 10.067 15.5 12Z" stroke="currentColor" stroke-width="1.5"></path><path d="M21.011 14.0965C21.5329 13.9558 21.7939 13.8854 21.8969 13.7508C22 13.6163 22 13.3998 22 12.9669V11.0332C22 10.6003 22 10.3838 21.8969 10.2493C21.7938 10.1147 21.5329 10.0443 21.011 9.90358C19.0606 9.37759 17.8399 7.33851 18.3433 5.40087C18.4817 4.86799 18.5509 4.60156 18.4848 4.44529C18.4187 4.28902 18.2291 4.18134 17.8497 3.96596L16.125 2.98673C15.7528 2.77539 15.5667 2.66972 15.3997 2.69222C15.2326 2.71472 15.0442 2.90273 14.6672 3.27873C13.208 4.73448 10.7936 4.73442 9.33434 3.27864C8.95743 2.90263 8.76898 2.71463 8.60193 2.69212C8.43489 2.66962 8.24877 2.77529 7.87653 2.98663L6.15184 3.96587C5.77253 4.18123 5.58287 4.28891 5.51678 4.44515C5.45068 4.6014 5.51987 4.86787 5.65825 5.4008C6.16137 7.3385 4.93972 9.37763 2.98902 9.9036C2.46712 10.0443 2.20617 10.1147 2.10308 10.2492C2 10.3838 2 10.6003 2 11.0332V12.9669C2 13.3998 2 13.6163 2.10308 13.7508C2.20615 13.8854 2.46711 13.9558 2.98902 14.0965C4.9394 14.6225 6.16008 16.6616 5.65672 18.5992C5.51829 19.1321 5.44907 19.3985 5.51516 19.5548C5.58126 19.7111 5.77092 19.8188 6.15025 20.0341L7.87495 21.0134C8.24721 21.2247 8.43334 21.3304 8.6004 21.3079C8.76746 21.2854 8.95588 21.0973 9.33271 20.7213C10.7927 19.2644 13.2088 19.2643 14.6689 20.7212C15.0457 21.0973 15.2341 21.2853 15.4012 21.3078C15.5682 21.3303 15.7544 21.2246 16.1266 21.0133L17.8513 20.034C18.2307 19.8187 18.4204 19.711 18.4864 19.5547C18.5525 19.3984 18.4833 19.132 18.3448 18.5991C17.8412 16.6616 19.0609 14.6226 21.011 14.0965Z" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path></svg><span class="ayy-bottom-nav__label">Settings</span></a>
      </nav>
    </div>
  </ayy-app-shell>
</div>
```

React:

```tsx
import { Add01Icon, Calendar03Icon, InboxIcon, Search01Icon, Settings02Icon } from "@hugeicons/core-free-icons";
import {
  AppShell,
  AppShellBrand,
  AppShellLink,
  AppShellMain,
  AppShellNav,
  AppShellSidebar,
  BottomNav,
  BottomNavLink,
  Fab,
  Icon,
} from "@danitesler/ayywi/react";

export default function Example() {
  // A direct child of the shell, after the main area: its corner on wide screens, above the bottom nav on phones.
  return (
    <div style={{ inlineSize: "100%", blockSize: "22rem", overflow: "hidden", border: "1px solid var(--ayy-color-line)", borderRadius: "var(--ayy-radius-xl)" }}>
      <AppShell style={{ blockSize: "100%" }}>
        <AppShellSidebar>
          <AppShellBrand href="#inbox">Tasks</AppShellBrand>
          <AppShellNav>
            <AppShellLink href="#inbox" current>
              <Icon icon={InboxIcon} />
              Inbox
            </AppShellLink>
            <AppShellLink href="#today">
              <Icon icon={Calendar03Icon} />
              Today
            </AppShellLink>
          </AppShellNav>
        </AppShellSidebar>
        <AppShellMain>
          <h2 className="ayy-h3">Inbox</h2>
          <p className="ayy-muted">Everything that isn't in a list yet.</p>
        </AppShellMain>
        <Fab aria-label="New task">
          <Icon icon={Add01Icon} />
        </Fab>
        <BottomNav>
          <BottomNavLink href="#inbox" icon={<Icon icon={InboxIcon} />} current>
            Inbox
          </BottomNavLink>
          <BottomNavLink href="#today" icon={<Icon icon={Calendar03Icon} />}>
            Today
          </BottomNavLink>
          <BottomNavLink href="#search" icon={<Icon icon={Search01Icon} />}>
            Search
          </BottomNavLink>
          <BottomNavLink href="#settings" icon={<Icon icon={Settings02Icon} />}>
            Settings
          </BottomNavLink>
        </BottomNav>
      </AppShell>
    </div>
  );
}
```

---
Part of @danitesler/ayywi 0.0.1: load `dist/ayywi.min.css` (and `dist/elements.global.js` for the <ayy-*> elements). The rules every screen follows: [llms-full.txt#rules](../llms-full.txt#rules). Every component: [llms.txt](../llms.txt).
