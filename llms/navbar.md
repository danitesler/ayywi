# Navbar

Category: Navigation. Sticky site header on translucent glass: brand at the start, links and actions at the end, content centred at page width. On phones a menu button folds the links into a panel under the bar.

**Classes**
- `.ayy-navbar` — Root, usually a <header>. Sticky, 72px tall (--ayy-size-header), glass background with a hairline under it. Anchor jumps land below it.
- `.ayy-navbar__inner` — Centred row at page width (--ayy-size-container) with the page gutter.
- `.ayy-navbar__brand` — Logo / name link at the start.
- `.ayy-navbar__nav` — <nav> of links. It and everything after it sit at the end. Without a __toggle it scrolls sideways if the links don't fit; with one, below 48rem it becomes a panel under the bar, shown while the toggle has aria-expanded="true".
- `.ayy-navbar__link` — Top-level link. Hover adds a wash; aria-current="page" marks the page you're on with a stronger tint (High Contrast: the system highlight).
- `.ayy-navbar__actions` — Group of buttons (theme toggle, call to action). Next to the brand, or at the end after the nav. Stays in the bar on phones, so keep it to one or two items.
- `.ayy-navbar__toggle` — The phone menu button, last in the inner row (combine with ayy-button ayy-button--ghost ayy-button--icon and a menu icon). Hidden from 48rem. Its aria-expanded is the menu's state; connectNavbar() / <ayy-navbar> / React Navbar manage it.

**States**
- `default` — Sticky glass bar (--ayy-color-glass, 16px blur) with a hairline underneath; links are muted pills.
- `hover` (`.ayy-navbar__link:hover`) — Link gets a wash fill and the text colour.
- `pressed` — doesn't apply: Links have no pressed look.
- `focus` (`.ayy-navbar__link:focus-visible, .ayy-navbar__brand:focus-visible`) — 2px ring, 2px offset.
- `disabled` — doesn't apply: A navbar link is never disabled: leave out a page the user can't open.
- `selected` (`.ayy-navbar__link[aria-current="page"]`) — Current page: wash-hover fill, text colour. Forced colours: Highlight.
- `error` — doesn't apply: No error state.
- `loading` — doesn't apply: No loading state; the bar is static.
- `open` (`.ayy-navbar__toggle[aria-expanded="true"] (below 48rem)`) — The links drop into a surface panel under the bar with the overlay shadow; links grow to the lg control height.

**Sizes**
- Density — The bar is --ayy-size-header (4.5rem) tall at every density; links are the md control height (32px compact, 40 comfortable, 44 touch), lg in the phone panel.
- Width — Full width; content centred at --ayy-size-container with a 24px gutter (16px below 64rem). Below 48rem, with a __toggle, the links fold into a panel.

**JS (framework-free)**: navbarClass, navbarInnerClass, navbarBrandClass, navbarNavClass, navbarLinkClass, navbarActionsClass, navbarToggleClass constants; connectNavbar(header) wires the phone menu and returns a cleanup; navbarMenuIcon (the Hugeicons menu icon as SVG markup).

**Custom element** `<ayy-navbar>` (@danitesler/ayywi/elements) — A <header class="ayy-navbar"> with a __toggle. The toggle opens and closes the links as a panel under the bar on phones; Esc, a click outside, a link in the panel or widening past 48rem close it. Without a toggle it does nothing.


**React** — `import { Navbar, NavbarBrand, NavbarNav, NavbarLink, NavbarActions, NavbarToggle } from "@danitesler/ayywi/react";`
- `<Navbar>` renders <header class="ayy-navbar"><div class="ayy-navbar__inner">; wires the phone menu when it holds a NavbarToggle.
- `<NavbarBrand>` renders <a>.
- `<NavbarNav>` renders <nav>. Props: `aria-label` Defaults to "Main" (translate it).
- `<NavbarLink>` renders <a>. Props: `current` boolean — sets aria-current="page".
- `<NavbarActions>` renders <div>.
- `<NavbarToggle>` renders <button class="ayy-button ayy-button--ghost ayy-button--icon ayy-navbar__toggle"> with a menu icon. Props: `aria-label` Defaults to "Menu" (translate it).; `children` Replaces the default menu icon.

**Accessibility**
- Use <header> for the bar and <nav aria-label="Main"> for the links; one main nav per page.
- Mark the current page with aria-current="page", not only with colour.
- Put a .ayy-skip-link before the navbar so keyboard users can jump past it.
- The menu button is a real <button> with aria-expanded and aria-controls pointing at the nav (set for you). Focus stays on it when the panel opens; Tab moves into the links, Esc closes the panel and returns focus to the button.
- The closed panel is display: none, so its links are out of the tab order until it opens.

**Do**
- Use a navbar as the top bar of a website: logo, two to five top-level links, one call to action.
- Keep one call to action in the actions group (a ring button for marketing pages, size sm).
- Add a NavbarToggle (last) once the links don't fit a phone: they fold into a panel under the bar, and the brand and call to action stay visible.
- Put the theme toggle in the actions group.

**Don't**
- Don't use a navbar in a signed-in app — use the App shell (sidebar, and a Bottom nav on phones).
- Don't use it to switch views inside a page — use Tabs.
- Don't fill it with long lists of links — move the extras into a DropdownMenu or the footer.
- Don't hide links on phones with your own media query — add a NavbarToggle.
- Don't give the navbar its own background colour; the glass token keeps every theme right.
- Don't nest a second navbar inside the page.

## Navbar — Site header

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<header class="ayy-navbar">
  <div class="ayy-navbar__inner">
    <a class="ayy-navbar__brand" href="#top">
      <span class="ayy-avatar ayy-avatar--sm" aria-hidden="true"><span class="ayy-avatar__fallback">DT</span></span>
      <span class="ayy-signature">Dani Tesler</span>
    </a>
    <nav class="ayy-navbar__nav" aria-label="Main">
      <a class="ayy-navbar__link" href="#work" aria-current="page">Work</a>
      <a class="ayy-navbar__link" href="#projects">Projects</a>
    </nav>
    <div class="ayy-navbar__actions">
      <a class="ayy-button ayy-button--ring ayy-button--sm" href="#connect">Let's connect</a>
    </div>
  </div>
</header>
```

React:

```tsx
import { buttonClass, Navbar, NavbarActions, NavbarBrand, NavbarLink, NavbarNav } from "@danitesler/ayywi/react";

export default function Example() {
  return (
    <Navbar>
      <NavbarBrand href="#top">
        <span className="ayy-avatar ayy-avatar--sm" aria-hidden="true">
          <span className="ayy-avatar__fallback">DT</span>
        </span>
        <span className="ayy-signature">Dani Tesler</span>
      </NavbarBrand>
      <NavbarNav>
        <NavbarLink href="#work" current>
          Work
        </NavbarLink>
        <NavbarLink href="#projects">Projects</NavbarLink>
      </NavbarNav>
      <NavbarActions>
        <a className={buttonClass({ variant: "ring", size: "sm" })} href="#connect">
          Let's connect
        </a>
      </NavbarActions>
    </Navbar>
  );
}
```

## Navbar — Menu on phones

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<!-- Below 48rem the links fold into a panel under the bar; the menu button at the end opens it. <ayy-navbar> (@danitesler/ayywi/elements) wires it;
     without it, call connectNavbar(header) from "@danitesler/ayywi". -->
<div style="inline-size: 100%">
  <ayy-navbar>
    <header class="ayy-navbar">
      <div class="ayy-navbar__inner">
        <a class="ayy-navbar__brand" href="#top"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M8.64298 3.14559L6.93816 3.93362C4.31272 5.14719 3 5.75397 3 6.75C3 7.74603 4.31272 8.35281 6.93817 9.56638L8.64298 10.3544C10.2952 11.1181 11.1214 11.5 12 11.5C12.8786 11.5 13.7048 11.1181 15.357 10.3544L17.0618 9.56638C19.6873 8.35281 21 7.74603 21 6.75C21 5.75397 19.6873 5.14719 17.0618 3.93362L15.357 3.14559C13.7048 2.38186 12.8786 2 12 2C11.1214 2 10.2952 2.38186 8.64298 3.14559Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M20.788 11.0972C20.9293 11.2959 21 11.5031 21 11.7309C21 12.7127 19.6873 13.3109 17.0618 14.5072L15.357 15.284C13.7048 16.0368 12.8786 16.4133 12 16.4133C11.1214 16.4133 10.2952 16.0368 8.64298 15.284L6.93817 14.5072C4.31272 13.3109 3 12.7127 3 11.7309C3 11.5031 3.07067 11.2959 3.212 11.0972" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M20.3767 16.2661C20.7922 16.5971 21 16.927 21 17.3176C21 18.2995 19.6873 18.8976 17.0618 20.0939L15.357 20.8707C13.7048 21.6236 12.8786 22 12 22C11.1214 22 10.2952 21.6236 8.64298 20.8707L6.93817 20.0939C4.31272 18.8976 3 18.2995 3 17.3176C3 16.927 3.20778 16.5971 3.62334 16.2661" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg>Northwind</a>
        <nav class="ayy-navbar__nav" aria-label="Main">
          <a class="ayy-navbar__link" aria-current="page" href="#product">Product</a>
          <a class="ayy-navbar__link" href="#pricing">Pricing</a>
          <a class="ayy-navbar__link" href="#customers">Customers</a>
          <a class="ayy-navbar__link" href="#docs">Docs</a>
        </nav>
        <div class="ayy-navbar__actions"><a class="ayy-button ayy-button--ring ayy-button--sm" href="#start">Start free</a></div>
        <button type="button" class="ayy-button ayy-button--ghost ayy-button--icon ayy-navbar__toggle" aria-label="Menu" aria-expanded="false"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 5L20 5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M4 12L20 12" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M4 19L20 19" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg></button>
      </div>
    </header>
  </ayy-navbar>
</div>
```

React:

```tsx
import { Layers01Icon } from "@hugeicons/core-free-icons";
import { buttonClass, Icon, Navbar, NavbarActions, NavbarBrand, NavbarLink, NavbarNav, NavbarToggle } from "@danitesler/ayywi/react";

export default function Example() {
  // Below 48rem the links fold into a panel under the bar; the menu button at the end opens it.
  return (
    <div style={{ inlineSize: "100%" }}>
      <Navbar>
        <NavbarBrand href="#top">
          <Icon icon={Layers01Icon} />
          Northwind
        </NavbarBrand>
        <NavbarNav>
          <NavbarLink href="#product" current>
            Product
          </NavbarLink>
          <NavbarLink href="#pricing">Pricing</NavbarLink>
          <NavbarLink href="#customers">Customers</NavbarLink>
          <NavbarLink href="#docs">Docs</NavbarLink>
        </NavbarNav>
        <NavbarActions>
          <a className={buttonClass({ variant: "ring", size: "sm" })} href="#start">
            Start free
          </a>
        </NavbarActions>
        <NavbarToggle />
      </Navbar>
    </div>
  );
}
```

---
Part of @danitesler/ayywi 0.0.1: load `dist/ayywi.min.css` (and `dist/elements.global.js` for the <ayy-*> elements). The rules every screen follows: [llms-full.txt#rules](../llms-full.txt#rules). Every component: [llms.txt](../llms.txt).
