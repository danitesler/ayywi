# App shell

Category: Navigation. The frame of a web app: a fixed-width sidebar (brand, navigation, footer) beside a main area, filling the viewport; the two scroll independently. On phones the sidebar gives way to a Bottom nav (recommended), a drawer opened from a top bar, or — with neither — a single row that scrolls sideways. Settings use the same shell in settings mode: the sidebar swaps to a way back and the settings sections, and one section fills the main area (on phones, the section list and the open section are two screens). Also called: app-shell, sidebar, side-nav, sidenav, nav-item, sidebar-item, nav-list.

**Classes**
- `.ayy-app-shell` — Root. A viewport-high (100dvh) grid: sidebar column (15rem) and a main column. Neither column grows the page; each scrolls on its own. Sets position: relative (the drawer and its scrim are placed inside it). To embed the shell in a box with a fixed height, set block-size: 100% on it. Below 48rem its phone layout follows its children: a .ayy-bottom-nav child shows as the tab bar and the sidebar hides; a __bar makes the sidebar a drawer; with neither, the sidebar becomes a sideways row.
- `.ayy-app-shell__sidebar` — The <aside>: surface background, hairline on its inline-end edge, brand at the top, nav below, footer pinned to the bottom. Scrolls vertically when its content is taller than the viewport. On phones it's hidden (bottom-nav layout) or a drawer, and keeps its full tree either way.
- `.ayy-app-shell__brand` — Logo / product name link at the top of the sidebar.
- `.ayy-app-shell__nav` — <nav> holding the links, stacked vertically (side by side in the phone row).
- `.ayy-app-shell__link` — Destination link. aria-current="page" marks the page you're on: it gets a tint and a heavier weight.
- `.ayy-app-shell__group` — A headed section of the nav: a __group-label over a __list. Groups after the first get a hairline above them.
- `.ayy-app-shell__group-label` — The group's heading: a small uppercase <p>. Give it an id and point the list's aria-labelledby at it.
- `.ayy-app-shell__list` — The <ul> of a group. Each <li> holds a link, a link followed by a __sublist, or a __collapse.
- `.ayy-app-shell__sublist` — A nested <ul> of child links, indented along a guide line. One level only. Follows a parent link, or sits inside a __collapse. Give it an aria-label when it follows a link.
- `.ayy-app-shell__collapse` — A native <details> for a group of child links that opens and closes. Its <summary class="ayy-app-shell__link"> is the toggle, with a chevron at the inline end; put the links in a __sublist inside it. Add `open` when it holds the current page.
- `.ayy-app-shell__link--sub` — Modifier for a child link inside a __sublist: a smaller control and a lighter weight.
- `.ayy-app-shell__footer` — Pinned to the bottom of the sidebar (the end of the row on phones): settings, account, help link. Keep it short.
- `.ayy-app-shell__main` — The <main> content column. Scrolls on its own and has the page gutter.
- `.ayy-app-shell__bar` — Phone top bar, first child of the shell, hidden from 48rem: the brand, then one or two actions (search, account), which sit at the inline end. Add a __toggle to it when the sidebar should open as a drawer. With a bar or a bottom nav the phone sidebar is off-screen; it slides in from the inline-start edge over a scrim while a toggle has aria-expanded="true".
- `.ayy-app-shell--settings` — Settings mode, on the root. The sidebar holds an __back, an __title and a nav of settings sections (groups of links, one aria-current="page"); the main holds the open section, starting with a Top bar whose title names it and whose back button shows on phones only; the section's content sits in a column of --ayy-size-measure, centred. No __bar and no bottom nav. Below 48rem: with no section link current the sidebar is the whole screen (a large title and rows with chevrons) and the main is hidden; with one current, the main is the screen and the sidebar is hidden.
- `.ayy-app-shell__back` — First in a settings sidebar: an <a href> back to the page settings were opened from (or a <button>), with a directional arrow icon and "Back to <app name>". In settings mode, Esc follows it.
- `.ayy-app-shell__title` — A settings sidebar's heading, an <h2> "Settings" under the __back. Large on the phone's section list.
- `.ayy-app-shell__toggle` — The button that opens the sidebar as a drawer on phones: in the __bar (with ayy-button ayy-button--ghost ayy-button--icon and a menu icon), or as the "More" tab of the bottom nav (<button class="ayy-bottom-nav__link ayy-app-shell__toggle">). Its aria-expanded is the drawer's state. connectAppShell() / <ayy-app-shell> / React AppShell manage it.

**States**
- `default` — A 15rem surface sidebar with a hairline at the inline end, and the main area on the page background; each scrolls on its own. Links are muted pills.
- `hover` (`.ayy-app-shell__link:hover`) — Link gets a wash fill and the text colour.
- `pressed` — doesn't apply: Links have no pressed look.
- `focus` (`links, brand, sidebar and main :focus-visible`) — Links and brand: 2px ring, 2px offset. A focused scroll area (sidebar or main with tabindex="0") gets the ring inset.
- `disabled` — doesn't apply: Sidebar links are never disabled: leave out pages the user can't open.
- `selected` (`.ayy-app-shell__link[aria-current="page"]`) — Current page: wash-hover fill, text colour, semibold (not colour alone). A closed collapse holding it shows its summary in text colour and semibold. Forced colours: Highlight. In settings mode the current section link is the open section; below 48rem it decides whether the section list or the section fills the screen.
- `error` — doesn't apply: Errors belong in the main content (Alert).
- `loading` — doesn't apply: The frame renders at once; show Skeletons in the main area while a screen loads.
- `open` (`__toggle[aria-expanded="true"] (below 48rem, with a __bar or a Bottom nav); <details open> for a collapse`) — Phone: the sidebar slides in from the inline-start edge as a drawer (at most 18rem) over a scrim, with the overlay shadow. A collapse's chevron turns up.

**Sizes**
- Density — Links are at least the lg control height (40px compact, 48 comfortable, 52 touch) with lg control text; sub-links md. Grows with data-density.
- Width — Fills the viewport (100dvh) or its box (block-size: 100%). Below 48rem: a top __bar, a Bottom nav and a drawer, or one scrolling row when it holds neither.

**JS (framework-free)**: appShellClass, appShellSidebarClass, appShellBrandClass, appShellNavClass, appShellLinkClass, appShellFooterClass, appShellMainClass, appShellGroupClass, appShellGroupLabelClass, appShellListClass, appShellSublistClass, appShellCollapseClass, appShellLinkSubClass, appShellBarClass, appShellToggleClass constants; appShellSettingsClass, appShellBackClass, appShellTitleClass constants; connectAppShell(shell) wires the phone drawer (a toggle in the bar or the bottom nav) and, on a settings shell, Esc to leave settings, and returns a cleanup; appShellMenuIcon (the Hugeicons menu icon as SVG markup); appShellBackIcon (the settings back arrow, mirrored in RTL).

**Custom element** `<ayy-app-shell>` (@danitesler/ayywi/elements) — A <div class="ayy-app-shell">. Wires the phone drawer when the shell has a __toggle in its __bar or its .ayy-bottom-nav: the toggle opens and closes the sidebar; Esc, the scrim, a link in the drawer or widening past 48rem close it. On a settings shell, Esc follows the __back. Otherwise it does nothing.


**React** — `import { AppShell, AppShellBar, AppShellToggle, AppShellSidebar, AppShellBrand, AppShellNav, AppShellGroup, AppShellItem, AppShellLink, AppShellFooter, AppShellMain, AppShellBack, AppShellTitle, BottomNav, BottomNavLink, BottomNavButton } from "@danitesler/ayywi/react";`
- `<AppShell>` renders <div class="ayy-app-shell">; wires the phone drawer when it holds an AppShellToggle (in the AppShellBar) or a BottomNavButton with className="ayy-app-shell__toggle". Props: `settings` boolean — settings mode (ayy-app-shell--settings): the sidebar holds AppShellBack, AppShellTitle and the sections; Esc leaves.
- `<AppShellBack>` renders <a class="ayy-app-shell__back" href> with a directional arrow and the children in a <span>; a <button type="button"> without href. Props: `href` string — where leaving settings goes. Without it, pass onClick.; `children` "Back to <app name>" (translate it).
- `<AppShellTitle>` renders <h2 class="ayy-app-shell__title">. Props: `children` "Settings".
- `<AppShellSidebar>` renders <aside class="ayy-app-shell__sidebar">.
- `<AppShellBrand>` renders <a class="ayy-app-shell__brand">.
- `<AppShellNav>` renders <nav class="ayy-app-shell__nav">. Props: `aria-label` Defaults to "Main" (translate it).
- `<AppShellLink>` renders <a class="ayy-app-shell__link">. Props: `current` boolean — sets aria-current="page".; `sub` boolean — a child link (ayy-app-shell__link--sub).
- `<AppShellGroup>` renders <div class="ayy-app-shell__group"> with a label <p> and a <ul>. Props: `label` The heading. Names the list.
- `<AppShellItem>` renders <li>.
- `<AppShellSublist>` renders <ul class="ayy-app-shell__sublist">. Props: `aria-label` Required. Names the list.
- `<AppShellCollapse>` renders <details class="ayy-app-shell__collapse"> with a link-styled <summary> and a <ul>. Props: `label` The toggle row: an icon and a short label.; `open` Start open. Set it when the group holds the current page.
- `<AppShellFooter>` renders <div class="ayy-app-shell__footer">.
- `<AppShellMain>` renders <main class="ayy-app-shell__main">.
- `<AppShellBar>` renders <header class="ayy-app-shell__bar"> — first child; brand, then actions.
- `<AppShellToggle>` renders <button class="ayy-button ayy-button--ghost ayy-button--icon ayy-app-shell__toggle"> with a menu icon. Props: `aria-label` Defaults to "Menu" (translate it).; `children` Replaces the default menu icon.

**Accessibility**
- The sidebar is an <aside> (a complementary landmark) and the content is a <main>: one <main> per page, and no other element with that landmark.
- Keep one <nav aria-label="Main"> in the sidebar. The bottom nav repeats its top destinations and only one of the two shows at a time, so it can use the same label. Give any other nav (a settings menu) its own label.
- Mark the current page with aria-current="page" in both the sidebar and the bottom nav. The link also gets a tint and a heavier weight, so colour is not the only cue; High Contrast mode fills it with the system highlight.
- Put a .ayy-skip-link before the shell, pointing at an id on <main>, so keyboard users can jump past the sidebar.
- Group with a heading and a list: the <p> label names the <ul> through aria-labelledby, so a screen reader announces "Workspace, list, 3 items".
- A collapse is a native <details>: Enter and Space toggle it, and the open state is exposed for you. Don't add aria-expanded to the <summary>.
- Mark the current child with aria-current="page" and open its collapse. A closed collapse that holds the current page is drawn bolder, so the location isn't hidden.
- Both columns are scroll containers. If a column can scroll but holds nothing focusable, give it tabindex="0" so keyboard users can scroll it.
- The drawer's toggle is a real <button> with aria-expanded and aria-controls pointing at the sidebar (set for you). Opening moves focus to the first link in the drawer and makes the rest of the shell inert; Esc closes it and returns focus to the toggle.
- Settings mode: give the sections' nav its own label ("Settings"), mark the open section with aria-current="page", and make the section's Top bar title the page's <h1> (the sidebar title is an <h2>). Opening settings or a section moves focus to the main's <h1> or the main, as any page change does.
- Esc leaves a settings shell through its __back, except when focus is in a text field or an open menu, popover or dialog has it.
- The phone sidebar (closed drawer) is visibility: hidden, and the bottom nav is display: none from 48rem, so hidden links are out of the tab order and the accessibility tree.

**Do**
- Use the app shell as the outer layout of a signed-in app or dashboard: a persistent list of destinations next to the page content.
- Give every app the same frame: sidebar on wide screens, a Bottom nav on phones (a direct child after the main) with the same top destinations, icons and order, and a __bar with the brand and one or two actions.
- With more than five destinations, put the four most used in the bottom nav and end it with a "More" tab (a BottomNavButton with the ayy-app-shell__toggle class) that opens the full sidebar as a drawer.
- Use a __bar with a __toggle and no bottom nav when the nav is a long tree people browse (docs, settings with many sections): the drawer keeps groups, sub-lists and collapses.
- Group destinations under a heading once there are more than about six; one group can hold up to a dozen links.
- Use a collapse when a parent has children that are destinations in their own right and you'd otherwise scroll past them; keep the tree one level deep.
- Use a link followed by a __sublist when the parent is itself a page and its children are sections of it (Colors → Surfaces, Text…).
- Keep to one line per link: an icon and a short label.
- Put account and help links in the footer, not among the destinations. Keep it to one or two compact items.
- Start each page in the main with a Page header (title, description, actions).
- Open settings from the sidebar footer's Settings link (on phones: the More drawer or the account button in the __bar) as a full screen: the same shell with settings, an __back to where the user was, a "Settings" title and the sections grouped (Account, Workspace / App). Each section is its own URL (/settings/notifications) and starts with a Top bar.
- On wide screens open settings on the first section; on phones open the section list (no link current) and push a section from it.

**Don't**
- Don't use it for a marketing site or a content page — use Navbar and Sections.
- Don't use it to switch views of one object inside a page — use Tabs.
- Don't put a Navbar above it or inside it: the sidebar (and on phones the bar and bottom nav) is the navigation.
- Don't nest deeper than one level, and don't put a collapse inside a collapse.
- Don't rely on the sideways row (no bar, no bottom nav) for a real app: it shows top-level links only and hides the rest off-screen. Use a bottom nav or a drawer.
- Don't hide or show the sidebar and bottom nav with your own media queries; the shell switches them at 48rem.
- Don't make a collapse the only way to reach a page the user needs often.
- Don't nest a second app shell.
- Don't put settings in a Dialog or in Tabs inside a page; they are the settings shell. A Dialog is for one or two quick options next to what they change.
- Don't keep the app's own destinations, its __bar or its bottom nav on screen in settings mode; the __back is the way out.
- Don't scroll the page body as well; the shell already fills the viewport.
- Don't give the sidebar its own background colour; the surface token follows every theme.
- Don't keep the drawer open as a persistent panel on phones, and don't open it on page load.

## App shell — Sidebar with navigation

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<!-- The shell is 100dvh high. This box only stands in for the browser window; in your app, drop the wrapper and the block-size on the shell. -->
<div style="inline-size: 100%; block-size: 28rem; overflow: hidden; border: 1px solid var(--ayy-color-line); border-radius: var(--ayy-radius-xl)">
  <div class="ayy-app-shell" style="block-size: 100%">
    <aside class="ayy-app-shell__sidebar">
      <a class="ayy-app-shell__brand" href="#home">
        <span class="ayy-avatar ayy-avatar--sm" aria-hidden="true"><span class="ayy-avatar__fallback">NW</span></span>
        Northwind
      </a>
      <nav class="ayy-app-shell__nav" aria-label="Main">
        <a class="ayy-app-shell__link" href="#dashboard" aria-current="page">
          <svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M13.6903 19.4567C13.5 18.9973 13.5 18.4149 13.5 17.25C13.5 16.0851 13.5 15.5027 13.6903 15.0433C13.944 14.4307 14.4307 13.944 15.0433 13.6903C15.5027 13.5 16.0851 13.5 17.25 13.5C18.4149 13.5 18.9973 13.5 19.4567 13.6903C20.0693 13.944 20.556 14.4307 20.8097 15.0433C21 15.5027 21 16.0851 21 17.25C21 18.4149 21 18.9973 20.8097 19.4567C20.556 20.0693 20.0693 20.556 19.4567 20.8097C18.9973 21 18.4149 21 17.25 21C16.0851 21 15.5027 21 15.0433 20.8097C14.4307 20.556 13.944 20.0693 13.6903 19.4567Z" stroke="currentColor" stroke-linecap="square" stroke-linejoin="round" stroke-width="1.5"/><path d="M13.6903 8.95671C13.5 8.49728 13.5 7.91485 13.5 6.75C13.5 5.58515 13.5 5.00272 13.6903 4.54329C13.944 3.93072 14.4307 3.44404 15.0433 3.1903C15.5027 3 16.0851 3 17.25 3C18.4149 3 18.9973 3 19.4567 3.1903C20.0693 3.44404 20.556 3.93072 20.8097 4.54329C21 5.00272 21 5.58515 21 6.75C21 7.91485 21 8.49728 20.8097 8.95671C20.556 9.56928 20.0693 10.056 19.4567 10.3097C18.9973 10.5 18.4149 10.5 17.25 10.5C16.0851 10.5 15.5027 10.5 15.0433 10.3097C14.4307 10.056 13.944 9.56928 13.6903 8.95671Z" stroke="currentColor" stroke-linecap="square" stroke-linejoin="round" stroke-width="1.5"/><path d="M3.1903 19.4567C3 18.9973 3 18.4149 3 17.25C3 16.0851 3 15.5027 3.1903 15.0433C3.44404 14.4307 3.93072 13.944 4.54329 13.6903C5.00272 13.5 5.58515 13.5 6.75 13.5C7.91485 13.5 8.49728 13.5 8.95671 13.6903C9.56928 13.944 10.056 14.4307 10.3097 15.0433C10.5 15.5027 10.5 16.0851 10.5 17.25C10.5 18.4149 10.5 18.9973 10.3097 19.4567C10.056 20.0693 9.56928 20.556 8.95671 20.8097C8.49728 21 7.91485 21 6.75 21C5.58515 21 5.00272 21 4.54329 20.8097C3.93072 20.556 3.44404 20.0693 3.1903 19.4567Z" stroke="currentColor" stroke-linecap="square" stroke-linejoin="round" stroke-width="1.5"/><path d="M3.1903 8.95671C3 8.49728 3 7.91485 3 6.75C3 5.58515 3 5.00272 3.1903 4.54329C3.44404 3.93072 3.93072 3.44404 4.54329 3.1903C5.00272 3 5.58515 3 6.75 3C7.91485 3 8.49728 3 8.95671 3.1903C9.56928 3.44404 10.056 3.93072 10.3097 4.54329C10.5 5.00272 10.5 5.58515 10.5 6.75C10.5 7.91485 10.5 8.49728 10.3097 8.95671C10.056 9.56928 9.56928 10.056 8.95671 10.3097C8.49728 10.5 7.91485 10.5 6.75 10.5C5.58515 10.5 5.00272 10.5 4.54329 10.3097C3.93072 10.056 3.44404 9.56928 3.1903 8.95671Z" stroke="currentColor" stroke-linecap="square" stroke-linejoin="round" stroke-width="1.5"/></svg>
          Dashboard
        </a>
        <a class="ayy-app-shell__link" href="#projects">
          <svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M8 7H16.75C18.8567 7 19.91 7 20.6667 7.50559C20.9943 7.72447 21.2755 8.00572 21.4944 8.33329C22 9.08996 22 10.1433 22 12.25C22 15.7612 22 17.5167 21.1573 18.7779C20.7926 19.3238 20.3238 19.7926 19.7779 20.1573C18.5167 21 16.7612 21 13.25 21H12C7.28595 21 4.92893 21 3.46447 19.5355C2 18.0711 2 15.714 2 11V7.94427C2 6.1278 2 5.21956 2.38032 4.53806C2.65142 4.05227 3.05227 3.65142 3.53806 3.38032C4.21956 3 5.1278 3 6.94427 3C8.10802 3 8.6899 3 9.19926 3.19101C10.3622 3.62712 10.8418 4.68358 11.3666 5.73313L12 7" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"/></svg>
          Projects
        </a>
        <a class="ayy-app-shell__link" href="#team">
          <svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M18.4995 20.5C18.2663 17.5685 15.8417 15.2477 12.808 15.0521L11.9995 15C11.7107 15.0076 11.4416 15.0178 11.1877 15.0298C8.18075 15.1723 5.7304 17.5974 5.49951 20.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/><path d="M15.2495 9.25C15.2495 11.0449 13.7944 12.5 11.9995 12.5C10.2046 12.5 8.74952 11.0449 8.74952 9.25C8.74952 7.45507 10.2046 6 11.9995 6C13.7944 6 15.2495 7.45507 15.2495 9.25Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/><path d="M5.50249 8.5C5.17908 7.99485 4.99158 7.39432 4.99158 6.75C4.99158 4.95507 6.44665 3.5 8.24157 3.5C8.68752 3.5 9.1125 3.58982 9.49939 3.75235" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/><path d="M18.4963 8.5C18.8197 7.99485 19.0072 7.39432 19.0072 6.75C19.0072 4.95507 17.5521 3.5 15.7572 3.5C15.3113 3.5 14.8863 3.58982 14.4994 3.75235" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/><path d="M22.0007 17.9996C21.8208 15.7374 19.9995 13.5 17.9995 13" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/><path d="M1.99927 17.9996C2.17923 15.7374 4.00049 13.5 6.00049 13" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/></svg>
          Team
        </a>
      </nav>
      <div class="ayy-app-shell__footer">
        <a class="ayy-app-shell__link" href="#settings">
          <svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M15.5 12C15.5 13.933 13.933 15.5 12 15.5C10.067 15.5 8.5 13.933 8.5 12C8.5 10.067 10.067 8.5 12 8.5C13.933 8.5 15.5 10.067 15.5 12Z" stroke="currentColor" stroke-width="1.5"/><path d="M21.011 14.0965C21.5329 13.9558 21.7939 13.8854 21.8969 13.7508C22 13.6163 22 13.3998 22 12.9669V11.0332C22 10.6003 22 10.3838 21.8969 10.2493C21.7938 10.1147 21.5329 10.0443 21.011 9.90358C19.0606 9.37759 17.8399 7.33851 18.3433 5.40087C18.4817 4.86799 18.5509 4.60156 18.4848 4.44529C18.4187 4.28902 18.2291 4.18134 17.8497 3.96596L16.125 2.98673C15.7528 2.77539 15.5667 2.66972 15.3997 2.69222C15.2326 2.71472 15.0442 2.90273 14.6672 3.27873C13.208 4.73448 10.7936 4.73442 9.33434 3.27864C8.95743 2.90263 8.76898 2.71463 8.60193 2.69212C8.43489 2.66962 8.24877 2.77529 7.87653 2.98663L6.15184 3.96587C5.77253 4.18123 5.58287 4.28891 5.51678 4.44515C5.45068 4.6014 5.51987 4.86787 5.65825 5.4008C6.16137 7.3385 4.93972 9.37763 2.98902 9.9036C2.46712 10.0443 2.20617 10.1147 2.10308 10.2492C2 10.3838 2 10.6003 2 11.0332V12.9669C2 13.3998 2 13.6163 2.10308 13.7508C2.20615 13.8854 2.46711 13.9558 2.98902 14.0965C4.9394 14.6225 6.16008 16.6616 5.65672 18.5992C5.51829 19.1321 5.44907 19.3985 5.51516 19.5548C5.58126 19.7111 5.77092 19.8188 6.15025 20.0341L7.87495 21.0134C8.24721 21.2247 8.43334 21.3304 8.6004 21.3079C8.76746 21.2854 8.95588 21.0973 9.33271 20.7213C10.7927 19.2644 13.2088 19.2643 14.6689 20.7212C15.0457 21.0973 15.2341 21.2853 15.4012 21.3078C15.5682 21.3303 15.7544 21.2246 16.1266 21.0133L17.8513 20.034C18.2307 19.8187 18.4204 19.711 18.4864 19.5547C18.5525 19.3984 18.4833 19.132 18.3448 18.5991C17.8412 16.6616 19.0609 14.6226 21.011 14.0965Z" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"/></svg>
          Settings
        </a>
      </div>
    </aside>
    <main class="ayy-app-shell__main">
      <div class="ayy-stack" style="--ayy-gap: var(--ayy-space-4)">
        <h2 class="ayy-h3">Dashboard</h2>
        <p class="ayy-muted">What's moving across your projects this week.</p>
        <div class="ayy-grid" style="--ayy-min: 9rem">
          <div class="ayy-stat">
            <p class="ayy-stat__label">Open projects</p>
            <p class="ayy-stat__value">12</p>
          </div>
          <div class="ayy-stat">
            <p class="ayy-stat__label">Shipped this week</p>
            <p class="ayy-stat__value">38</p>
          </div>
          <div class="ayy-stat">
            <p class="ayy-stat__label">Team members</p>
            <p class="ayy-stat__value">9</p>
          </div>
        </div>
      </div>
    </main>
  </div>
</div>
```

React:

```tsx
import type { CSSProperties } from "react";
import { DashboardSquare01Icon, Folder01Icon, Settings02Icon, UserGroupIcon } from "@hugeicons/core-free-icons";
import {
  AppShell,
  AppShellBrand,
  AppShellFooter,
  AppShellLink,
  AppShellMain,
  AppShellNav,
  AppShellSidebar,
  Icon,
  Stat,
} from "@danitesler/ayywi/react";

export default function Example() {
  // The shell is 100dvh high. This box only stands in for the browser window; in your app, drop the wrapper and the blockSize on the shell.
  return (
    <div style={{ inlineSize: "100%", blockSize: "28rem", overflow: "hidden", border: "1px solid var(--ayy-color-line)", borderRadius: "var(--ayy-radius-xl)" }}>
      <AppShell style={{ blockSize: "100%" }}>
        <AppShellSidebar>
          <AppShellBrand href="#home">
            <span className="ayy-avatar ayy-avatar--sm" aria-hidden="true">
              <span className="ayy-avatar__fallback">NW</span>
            </span>
            Northwind
          </AppShellBrand>
          <AppShellNav>
            <AppShellLink href="#dashboard" current>
              <Icon icon={DashboardSquare01Icon} />
              Dashboard
            </AppShellLink>
            <AppShellLink href="#projects">
              <Icon icon={Folder01Icon} />
              Projects
            </AppShellLink>
            <AppShellLink href="#team">
              <Icon icon={UserGroupIcon} />
              Team
            </AppShellLink>
          </AppShellNav>
          <AppShellFooter>
            <AppShellLink href="#settings">
              <Icon icon={Settings02Icon} />
              Settings
            </AppShellLink>
          </AppShellFooter>
        </AppShellSidebar>
        <AppShellMain>
          <div className="ayy-stack" style={{ "--ayy-gap": "var(--ayy-space-4)" } as CSSProperties}>
            <h2 className="ayy-h3">Dashboard</h2>
            <p className="ayy-muted">What's moving across your projects this week.</p>
            <div className="ayy-grid" style={{ "--ayy-min": "9rem" } as CSSProperties}>
              <Stat labelFirst label="Open projects" value="12" />
              <Stat labelFirst label="Shipped this week" value="38" />
              <Stat labelFirst label="Team members" value="9" />
            </div>
          </div>
        </AppShellMain>
      </AppShell>
    </div>
  );
}
```

## App shell — Tab bar on phones, with More

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<!-- Below 48rem the sidebar hides: the bar keeps the brand and search, the bottom nav holds the top destinations, and "More" opens the whole
     sidebar as a drawer. <ayy-app-shell> (@danitesler/ayywi/elements) wires it. The shell is 100dvh high; the outer box only stands in for the browser window. -->
<div style="inline-size: 100%; block-size: 28rem; overflow: hidden; border: 1px solid var(--ayy-color-line); border-radius: var(--ayy-radius-xl)">
  <ayy-app-shell>
    <div class="ayy-app-shell" style="block-size: 100%">
      <header class="ayy-app-shell__bar">
        <a class="ayy-app-shell__brand" href="#dashboard">Northwind</a>
        <button type="button" class="ayy-button ayy-button--ghost ayy-button--icon" aria-label="Search"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M17 17L21 21" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19C15.4183 19 19 15.4183 19 11Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg></button>
      </header>
      <aside class="ayy-app-shell__sidebar">
        <a class="ayy-app-shell__brand" href="#dashboard">Northwind</a>
        <nav class="ayy-app-shell__nav" aria-label="Main">
          <div class="ayy-app-shell__group">
            <p class="ayy-app-shell__group-label" id="app-shell-tabs-1">Workspace</p>
            <ul class="ayy-app-shell__list" aria-labelledby="app-shell-tabs-1">
              <li><a class="ayy-app-shell__link" aria-current="page" href="#dashboard"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M13.6903 19.4567C13.5 18.9973 13.5 18.4149 13.5 17.25C13.5 16.0851 13.5 15.5027 13.6903 15.0433C13.944 14.4307 14.4307 13.944 15.0433 13.6903C15.5027 13.5 16.0851 13.5 17.25 13.5C18.4149 13.5 18.9973 13.5 19.4567 13.6903C20.0693 13.944 20.556 14.4307 20.8097 15.0433C21 15.5027 21 16.0851 21 17.25C21 18.4149 21 18.9973 20.8097 19.4567C20.556 20.0693 20.0693 20.556 19.4567 20.8097C18.9973 21 18.4149 21 17.25 21C16.0851 21 15.5027 21 15.0433 20.8097C14.4307 20.556 13.944 20.0693 13.6903 19.4567Z" stroke="currentColor" stroke-linecap="square" stroke-linejoin="round" stroke-width="1.5"></path><path d="M13.6903 8.95671C13.5 8.49728 13.5 7.91485 13.5 6.75C13.5 5.58515 13.5 5.00272 13.6903 4.54329C13.944 3.93072 14.4307 3.44404 15.0433 3.1903C15.5027 3 16.0851 3 17.25 3C18.4149 3 18.9973 3 19.4567 3.1903C20.0693 3.44404 20.556 3.93072 20.8097 4.54329C21 5.00272 21 5.58515 21 6.75C21 7.91485 21 8.49728 20.8097 8.95671C20.556 9.56928 20.0693 10.056 19.4567 10.3097C18.9973 10.5 18.4149 10.5 17.25 10.5C16.0851 10.5 15.5027 10.5 15.0433 10.3097C14.4307 10.056 13.944 9.56928 13.6903 8.95671Z" stroke="currentColor" stroke-linecap="square" stroke-linejoin="round" stroke-width="1.5"></path><path d="M3.1903 19.4567C3 18.9973 3 18.4149 3 17.25C3 16.0851 3 15.5027 3.1903 15.0433C3.44404 14.4307 3.93072 13.944 4.54329 13.6903C5.00272 13.5 5.58515 13.5 6.75 13.5C7.91485 13.5 8.49728 13.5 8.95671 13.6903C9.56928 13.944 10.056 14.4307 10.3097 15.0433C10.5 15.5027 10.5 16.0851 10.5 17.25C10.5 18.4149 10.5 18.9973 10.3097 19.4567C10.056 20.0693 9.56928 20.556 8.95671 20.8097C8.49728 21 7.91485 21 6.75 21C5.58515 21 5.00272 21 4.54329 20.8097C3.93072 20.556 3.44404 20.0693 3.1903 19.4567Z" stroke="currentColor" stroke-linecap="square" stroke-linejoin="round" stroke-width="1.5"></path><path d="M3.1903 8.95671C3 8.49728 3 7.91485 3 6.75C3 5.58515 3 5.00272 3.1903 4.54329C3.44404 3.93072 3.93072 3.44404 4.54329 3.1903C5.00272 3 5.58515 3 6.75 3C7.91485 3 8.49728 3 8.95671 3.1903C9.56928 3.44404 10.056 3.93072 10.3097 4.54329C10.5 5.00272 10.5 5.58515 10.5 6.75C10.5 7.91485 10.5 8.49728 10.3097 8.95671C10.056 9.56928 9.56928 10.056 8.95671 10.3097C8.49728 10.5 7.91485 10.5 6.75 10.5C5.58515 10.5 5.00272 10.5 4.54329 10.3097C3.93072 10.056 3.44404 9.56928 3.1903 8.95671Z" stroke="currentColor" stroke-linecap="square" stroke-linejoin="round" stroke-width="1.5"></path></svg>Dashboard</a></li>
              <li><a class="ayy-app-shell__link" href="#projects"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M8 7H16.75C18.8567 7 19.91 7 20.6667 7.50559C20.9943 7.72447 21.2755 8.00572 21.4944 8.33329C22 9.08996 22 10.1433 22 12.25C22 15.7612 22 17.5167 21.1573 18.7779C20.7926 19.3238 20.3238 19.7926 19.7779 20.1573C18.5167 21 16.7612 21 13.25 21H12C7.28595 21 4.92893 21 3.46447 19.5355C2 18.0711 2 15.714 2 11V7.94427C2 6.1278 2 5.21956 2.38032 4.53806C2.65142 4.05227 3.05227 3.65142 3.53806 3.38032C4.21956 3 5.1278 3 6.94427 3C8.10802 3 8.6899 3 9.19926 3.19101C10.3622 3.62712 10.8418 4.68358 11.3666 5.73313L12 7" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path></svg>Projects</a></li>
              <li><a class="ayy-app-shell__link" href="#team"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M18.4995 20.5C18.2663 17.5685 15.8417 15.2477 12.808 15.0521L11.9995 15C11.7107 15.0076 11.4416 15.0178 11.1877 15.0298C8.18075 15.1723 5.7304 17.5974 5.49951 20.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M15.2495 9.25C15.2495 11.0449 13.7944 12.5 11.9995 12.5C10.2046 12.5 8.74952 11.0449 8.74952 9.25C8.74952 7.45507 10.2046 6 11.9995 6C13.7944 6 15.2495 7.45507 15.2495 9.25Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M5.50249 8.5C5.17908 7.99485 4.99158 7.39432 4.99158 6.75C4.99158 4.95507 6.44665 3.5 8.24157 3.5C8.68752 3.5 9.1125 3.58982 9.49939 3.75235" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M18.4963 8.5C18.8197 7.99485 19.0072 7.39432 19.0072 6.75C19.0072 4.95507 17.5521 3.5 15.7572 3.5C15.3113 3.5 14.8863 3.58982 14.4994 3.75235" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M22.0007 17.9996C21.8208 15.7374 19.9995 13.5 17.9995 13" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M1.99927 17.9996C2.17923 15.7374 4.00049 13.5 6.00049 13" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg>Team</a></li>
            </ul>
          </div>
          <div class="ayy-app-shell__group">
            <p class="ayy-app-shell__group-label" id="app-shell-tabs-2">Billing</p>
            <ul class="ayy-app-shell__list" aria-labelledby="app-shell-tabs-2">
              <li><a class="ayy-app-shell__link" href="#invoices"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 18.6458V8.05426C4 5.20025 4 3.77325 4.87868 2.88663C5.75736 2 7.17157 2 10 2H14C16.8284 2 18.2426 2 19.1213 2.88663C20 3.77325 20 5.20025 20 8.05426V18.6458C20 20.1575 20 20.9133 19.538 21.2108C18.7831 21.6971 17.6161 20.6774 17.0291 20.3073C16.5441 20.0014 16.3017 19.8485 16.0325 19.8397C15.7417 19.8301 15.4949 19.9768 14.9709 20.3073L13.06 21.5124C12.5445 21.8374 12.2868 22 12 22C11.7132 22 11.4555 21.8374 10.94 21.5124L9.02913 20.3073C8.54415 20.0014 8.30166 19.8485 8.03253 19.8397C7.74172 19.8301 7.49493 19.9768 6.97087 20.3073C6.38395 20.6774 5.21687 21.6971 4.46195 21.2108C4 20.9133 4 20.1575 4 18.6458Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M11 11H8" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M14 7L8 7" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg>Invoices</a></li>
            </ul>
          </div>
        </nav>
        <div class="ayy-app-shell__footer"><a class="ayy-app-shell__link" href="#settings"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M15.5 12C15.5 13.933 13.933 15.5 12 15.5C10.067 15.5 8.5 13.933 8.5 12C8.5 10.067 10.067 8.5 12 8.5C13.933 8.5 15.5 10.067 15.5 12Z" stroke="currentColor" stroke-width="1.5"></path><path d="M21.011 14.0965C21.5329 13.9558 21.7939 13.8854 21.8969 13.7508C22 13.6163 22 13.3998 22 12.9669V11.0332C22 10.6003 22 10.3838 21.8969 10.2493C21.7938 10.1147 21.5329 10.0443 21.011 9.90358C19.0606 9.37759 17.8399 7.33851 18.3433 5.40087C18.4817 4.86799 18.5509 4.60156 18.4848 4.44529C18.4187 4.28902 18.2291 4.18134 17.8497 3.96596L16.125 2.98673C15.7528 2.77539 15.5667 2.66972 15.3997 2.69222C15.2326 2.71472 15.0442 2.90273 14.6672 3.27873C13.208 4.73448 10.7936 4.73442 9.33434 3.27864C8.95743 2.90263 8.76898 2.71463 8.60193 2.69212C8.43489 2.66962 8.24877 2.77529 7.87653 2.98663L6.15184 3.96587C5.77253 4.18123 5.58287 4.28891 5.51678 4.44515C5.45068 4.6014 5.51987 4.86787 5.65825 5.4008C6.16137 7.3385 4.93972 9.37763 2.98902 9.9036C2.46712 10.0443 2.20617 10.1147 2.10308 10.2492C2 10.3838 2 10.6003 2 11.0332V12.9669C2 13.3998 2 13.6163 2.10308 13.7508C2.20615 13.8854 2.46711 13.9558 2.98902 14.0965C4.9394 14.6225 6.16008 16.6616 5.65672 18.5992C5.51829 19.1321 5.44907 19.3985 5.51516 19.5548C5.58126 19.7111 5.77092 19.8188 6.15025 20.0341L7.87495 21.0134C8.24721 21.2247 8.43334 21.3304 8.6004 21.3079C8.76746 21.2854 8.95588 21.0973 9.33271 20.7213C10.7927 19.2644 13.2088 19.2643 14.6689 20.7212C15.0457 21.0973 15.2341 21.2853 15.4012 21.3078C15.5682 21.3303 15.7544 21.2246 16.1266 21.0133L17.8513 20.034C18.2307 19.8187 18.4204 19.711 18.4864 19.5547C18.5525 19.3984 18.4833 19.132 18.3448 18.5991C17.8412 16.6616 19.0609 14.6226 21.011 14.0965Z" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path></svg>Settings</a></div>
      </aside>
      <main class="ayy-app-shell__main">
        <div class="ayy-stack">
          <h2 class="ayy-h3">Dashboard</h2>
          <p class="ayy-muted">What's moving across your projects this week.</p>
        </div>
      </main>
      <nav class="ayy-bottom-nav" aria-label="Main">
        <a class="ayy-bottom-nav__link" aria-current="page" href="#dashboard"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M13.6903 19.4567C13.5 18.9973 13.5 18.4149 13.5 17.25C13.5 16.0851 13.5 15.5027 13.6903 15.0433C13.944 14.4307 14.4307 13.944 15.0433 13.6903C15.5027 13.5 16.0851 13.5 17.25 13.5C18.4149 13.5 18.9973 13.5 19.4567 13.6903C20.0693 13.944 20.556 14.4307 20.8097 15.0433C21 15.5027 21 16.0851 21 17.25C21 18.4149 21 18.9973 20.8097 19.4567C20.556 20.0693 20.0693 20.556 19.4567 20.8097C18.9973 21 18.4149 21 17.25 21C16.0851 21 15.5027 21 15.0433 20.8097C14.4307 20.556 13.944 20.0693 13.6903 19.4567Z" stroke="currentColor" stroke-linecap="square" stroke-linejoin="round" stroke-width="1.5"></path><path d="M13.6903 8.95671C13.5 8.49728 13.5 7.91485 13.5 6.75C13.5 5.58515 13.5 5.00272 13.6903 4.54329C13.944 3.93072 14.4307 3.44404 15.0433 3.1903C15.5027 3 16.0851 3 17.25 3C18.4149 3 18.9973 3 19.4567 3.1903C20.0693 3.44404 20.556 3.93072 20.8097 4.54329C21 5.00272 21 5.58515 21 6.75C21 7.91485 21 8.49728 20.8097 8.95671C20.556 9.56928 20.0693 10.056 19.4567 10.3097C18.9973 10.5 18.4149 10.5 17.25 10.5C16.0851 10.5 15.5027 10.5 15.0433 10.3097C14.4307 10.056 13.944 9.56928 13.6903 8.95671Z" stroke="currentColor" stroke-linecap="square" stroke-linejoin="round" stroke-width="1.5"></path><path d="M3.1903 19.4567C3 18.9973 3 18.4149 3 17.25C3 16.0851 3 15.5027 3.1903 15.0433C3.44404 14.4307 3.93072 13.944 4.54329 13.6903C5.00272 13.5 5.58515 13.5 6.75 13.5C7.91485 13.5 8.49728 13.5 8.95671 13.6903C9.56928 13.944 10.056 14.4307 10.3097 15.0433C10.5 15.5027 10.5 16.0851 10.5 17.25C10.5 18.4149 10.5 18.9973 10.3097 19.4567C10.056 20.0693 9.56928 20.556 8.95671 20.8097C8.49728 21 7.91485 21 6.75 21C5.58515 21 5.00272 21 4.54329 20.8097C3.93072 20.556 3.44404 20.0693 3.1903 19.4567Z" stroke="currentColor" stroke-linecap="square" stroke-linejoin="round" stroke-width="1.5"></path><path d="M3.1903 8.95671C3 8.49728 3 7.91485 3 6.75C3 5.58515 3 5.00272 3.1903 4.54329C3.44404 3.93072 3.93072 3.44404 4.54329 3.1903C5.00272 3 5.58515 3 6.75 3C7.91485 3 8.49728 3 8.95671 3.1903C9.56928 3.44404 10.056 3.93072 10.3097 4.54329C10.5 5.00272 10.5 5.58515 10.5 6.75C10.5 7.91485 10.5 8.49728 10.3097 8.95671C10.056 9.56928 9.56928 10.056 8.95671 10.3097C8.49728 10.5 7.91485 10.5 6.75 10.5C5.58515 10.5 5.00272 10.5 4.54329 10.3097C3.93072 10.056 3.44404 9.56928 3.1903 8.95671Z" stroke="currentColor" stroke-linecap="square" stroke-linejoin="round" stroke-width="1.5"></path></svg><span class="ayy-bottom-nav__label">Dashboard</span></a>
        <a class="ayy-bottom-nav__link" href="#projects"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M8 7H16.75C18.8567 7 19.91 7 20.6667 7.50559C20.9943 7.72447 21.2755 8.00572 21.4944 8.33329C22 9.08996 22 10.1433 22 12.25C22 15.7612 22 17.5167 21.1573 18.7779C20.7926 19.3238 20.3238 19.7926 19.7779 20.1573C18.5167 21 16.7612 21 13.25 21H12C7.28595 21 4.92893 21 3.46447 19.5355C2 18.0711 2 15.714 2 11V7.94427C2 6.1278 2 5.21956 2.38032 4.53806C2.65142 4.05227 3.05227 3.65142 3.53806 3.38032C4.21956 3 5.1278 3 6.94427 3C8.10802 3 8.6899 3 9.19926 3.19101C10.3622 3.62712 10.8418 4.68358 11.3666 5.73313L12 7" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path></svg><span class="ayy-bottom-nav__label">Projects</span></a>
        <a class="ayy-bottom-nav__link" href="#team"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M18.4995 20.5C18.2663 17.5685 15.8417 15.2477 12.808 15.0521L11.9995 15C11.7107 15.0076 11.4416 15.0178 11.1877 15.0298C8.18075 15.1723 5.7304 17.5974 5.49951 20.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M15.2495 9.25C15.2495 11.0449 13.7944 12.5 11.9995 12.5C10.2046 12.5 8.74952 11.0449 8.74952 9.25C8.74952 7.45507 10.2046 6 11.9995 6C13.7944 6 15.2495 7.45507 15.2495 9.25Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M5.50249 8.5C5.17908 7.99485 4.99158 7.39432 4.99158 6.75C4.99158 4.95507 6.44665 3.5 8.24157 3.5C8.68752 3.5 9.1125 3.58982 9.49939 3.75235" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M18.4963 8.5C18.8197 7.99485 19.0072 7.39432 19.0072 6.75C19.0072 4.95507 17.5521 3.5 15.7572 3.5C15.3113 3.5 14.8863 3.58982 14.4994 3.75235" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M22.0007 17.9996C21.8208 15.7374 19.9995 13.5 17.9995 13" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M1.99927 17.9996C2.17923 15.7374 4.00049 13.5 6.00049 13" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg><span class="ayy-bottom-nav__label">Team</span></a>
        <button type="button" class="ayy-bottom-nav__link ayy-app-shell__toggle"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6.00449 12.5V12M18.0045 12.5V12M12.0045 12.5V12M7.00449 12.5C7.00449 11.9477 6.55677 11.5 6.00449 11.5C5.4522 11.5 5.00449 11.9477 5.00449 12.5C5.00449 13.0523 5.4522 13.5 6.00449 13.5C6.55677 13.5 7.00449 13.0523 7.00449 12.5ZM19.0045 12.5C19.0045 11.9477 18.5568 11.5 18.0045 11.5C17.4522 11.5 17.0045 11.9477 17.0045 12.5C17.0045 13.0523 17.4522 13.5 18.0045 13.5C18.5568 13.5 19.0045 13.0523 19.0045 12.5ZM13.0045 12.5C13.0045 11.9477 12.5568 11.5 12.0045 11.5C11.4522 11.5 11.0045 11.9477 11.0045 12.5C11.0045 13.0523 11.4522 13.5 12.0045 13.5C12.5568 13.5 13.0045 13.0523 13.0045 12.5Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg><span class="ayy-bottom-nav__label">More</span></button>
      </nav>
    </div>
  </ayy-app-shell>
</div>
```

React:

```tsx
import { DashboardSquare01Icon, Folder01Icon, Invoice01Icon, MoreHorizontalIcon, Search01Icon, Settings02Icon, UserGroupIcon } from "@hugeicons/core-free-icons";
import {
  AppShell,
  AppShellBar,
  AppShellBrand,
  AppShellFooter,
  AppShellGroup,
  AppShellItem,
  AppShellLink,
  AppShellMain,
  AppShellNav,
  AppShellSidebar,
  BottomNav,
  BottomNavButton,
  BottomNavLink,
  Button,
  Icon,
} from "@danitesler/ayywi/react";

export default function Example() {
  // Wide screens get the sidebar. Below 48rem it hides: the bar keeps the brand and search, the bottom nav holds the
  // top destinations, and "More" opens the whole sidebar as a drawer. The box only stands in for the browser window.
  return (
    <div style={{ inlineSize: "100%", blockSize: "28rem", overflow: "hidden", border: "1px solid var(--ayy-color-line)", borderRadius: "var(--ayy-radius-xl)" }}>
      <AppShell style={{ blockSize: "100%" }}>
        <AppShellBar>
          <AppShellBrand href="#dashboard">Northwind</AppShellBrand>
          <Button variant="ghost" size="icon" aria-label="Search">
            <Icon icon={Search01Icon} />
          </Button>
        </AppShellBar>
        <AppShellSidebar>
          <AppShellBrand href="#dashboard">Northwind</AppShellBrand>
          <AppShellNav>
            <AppShellGroup label="Workspace">
              <AppShellItem>
                <AppShellLink href="#dashboard" current>
                  <Icon icon={DashboardSquare01Icon} />
                  Dashboard
                </AppShellLink>
              </AppShellItem>
              <AppShellItem>
                <AppShellLink href="#projects">
                  <Icon icon={Folder01Icon} />
                  Projects
                </AppShellLink>
              </AppShellItem>
              <AppShellItem>
                <AppShellLink href="#team">
                  <Icon icon={UserGroupIcon} />
                  Team
                </AppShellLink>
              </AppShellItem>
            </AppShellGroup>
            <AppShellGroup label="Billing">
              <AppShellItem>
                <AppShellLink href="#invoices">
                  <Icon icon={Invoice01Icon} />
                  Invoices
                </AppShellLink>
              </AppShellItem>
            </AppShellGroup>
          </AppShellNav>
          <AppShellFooter>
            <AppShellLink href="#settings">
              <Icon icon={Settings02Icon} />
              Settings
            </AppShellLink>
          </AppShellFooter>
        </AppShellSidebar>
        <AppShellMain>
          <div className="ayy-stack">
            <h2 className="ayy-h3">Dashboard</h2>
            <p className="ayy-muted">What's moving across your projects this week.</p>
          </div>
        </AppShellMain>
        <BottomNav>
          <BottomNavLink href="#dashboard" icon={<Icon icon={DashboardSquare01Icon} />} current>
            Dashboard
          </BottomNavLink>
          <BottomNavLink href="#projects" icon={<Icon icon={Folder01Icon} />}>
            Projects
          </BottomNavLink>
          <BottomNavLink href="#team" icon={<Icon icon={UserGroupIcon} />}>
            Team
          </BottomNavLink>
          <BottomNavButton className="ayy-app-shell__toggle" icon={<Icon icon={MoreHorizontalIcon} />}>
            More
          </BottomNavButton>
        </BottomNav>
      </AppShell>
    </div>
  );
}
```

## App shell — Groups, sub-sections and a collapse

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<!-- The shell is 100dvh high. This box only stands in for the browser window; in your app, drop the wrapper and the block-size on the shell. -->
<div style="inline-size: 100%; block-size: 32rem; overflow: hidden; border: 1px solid var(--ayy-color-line); border-radius: var(--ayy-radius-xl)">
  <div class="ayy-app-shell" style="block-size: 100%">
    <aside class="ayy-app-shell__sidebar">
      <a class="ayy-app-shell__brand" href="#home">Northwind Docs</a>
      <nav class="ayy-app-shell__nav" aria-label="Docs">
        <div class="ayy-app-shell__group">
          <p class="ayy-app-shell__group-label" id="docs-start">Start</p>
          <ul class="ayy-app-shell__list" aria-labelledby="docs-start">
            <li><a class="ayy-app-shell__link" href="#overview">Overview</a></li>
            <li>
              <a class="ayy-app-shell__link" href="#get-started">Get started</a>
              <ul class="ayy-app-shell__sublist" aria-label="Get started sections">
                <li><a class="ayy-app-shell__link ayy-app-shell__link--sub" href="#install">Install</a></li>
                <li><a class="ayy-app-shell__link ayy-app-shell__link--sub" href="#first-screen">Build your first screen</a></li>
              </ul>
            </li>
          </ul>
        </div>
        <div class="ayy-app-shell__group">
          <p class="ayy-app-shell__group-label" id="docs-foundations">Foundations</p>
          <ul class="ayy-app-shell__list" aria-labelledby="docs-foundations">
            <li>
              <details class="ayy-app-shell__collapse" open>
                <summary class="ayy-app-shell__link">Colors</summary>
                <ul class="ayy-app-shell__sublist">
                  <li><a class="ayy-app-shell__link ayy-app-shell__link--sub" href="#themes" aria-current="page">Themes</a></li>
                  <li><a class="ayy-app-shell__link ayy-app-shell__link--sub" href="#surfaces">Surfaces</a></li>
                  <li><a class="ayy-app-shell__link ayy-app-shell__link--sub" href="#status">Status</a></li>
                </ul>
              </details>
            </li>
            <li>
              <details class="ayy-app-shell__collapse">
                <summary class="ayy-app-shell__link">Typography</summary>
                <ul class="ayy-app-shell__sublist">
                  <li><a class="ayy-app-shell__link ayy-app-shell__link--sub" href="#scale">Scale</a></li>
                  <li><a class="ayy-app-shell__link ayy-app-shell__link--sub" href="#fonts">Fonts</a></li>
                </ul>
              </details>
            </li>
            <li><a class="ayy-app-shell__link" href="#spacing">Spacing</a></li>
          </ul>
        </div>
      </nav>
    </aside>
    <main class="ayy-app-shell__main">
      <div class="ayy-stack" style="--ayy-gap: var(--ayy-space-4)">
        <h2 class="ayy-h3">Themes</h2>
        <p class="ayy-muted">Dark, dark soft, light and light gray. Each one remaps the same semantic tokens.</p>
      </div>
    </main>
  </div>
</div>
```

React:

```tsx
import type { CSSProperties } from "react";
import {
  AppShell,
  AppShellBrand,
  AppShellCollapse,
  AppShellGroup,
  AppShellItem,
  AppShellLink,
  AppShellMain,
  AppShellNav,
  AppShellSidebar,
  AppShellSublist,
} from "@danitesler/ayywi/react";

export default function Example() {
  // The shell is 100dvh high. This box only stands in for the browser window; in your app, drop the wrapper and the blockSize on the shell.
  return (
    <div style={{ inlineSize: "100%", blockSize: "32rem", overflow: "hidden", border: "1px solid var(--ayy-color-line)", borderRadius: "var(--ayy-radius-xl)" }}>
      <AppShell style={{ blockSize: "100%" }}>
        <AppShellSidebar>
          <AppShellBrand href="#home">Northwind Docs</AppShellBrand>
          <AppShellNav aria-label="Docs">
            <AppShellGroup label="Start">
              <AppShellItem>
                <AppShellLink href="#overview">Overview</AppShellLink>
              </AppShellItem>
              <AppShellItem>
                <AppShellLink href="#get-started">Get started</AppShellLink>
                <AppShellSublist aria-label="Get started sections">
                  <AppShellItem>
                    <AppShellLink sub href="#install">Install</AppShellLink>
                  </AppShellItem>
                  <AppShellItem>
                    <AppShellLink sub href="#first-screen">Build your first screen</AppShellLink>
                  </AppShellItem>
                </AppShellSublist>
              </AppShellItem>
            </AppShellGroup>
            <AppShellGroup label="Foundations">
              <AppShellItem>
                <AppShellCollapse label="Colors" open>
                  <AppShellItem>
                    <AppShellLink sub current href="#themes">Themes</AppShellLink>
                  </AppShellItem>
                  <AppShellItem>
                    <AppShellLink sub href="#surfaces">Surfaces</AppShellLink>
                  </AppShellItem>
                  <AppShellItem>
                    <AppShellLink sub href="#status">Status</AppShellLink>
                  </AppShellItem>
                </AppShellCollapse>
              </AppShellItem>
              <AppShellItem>
                <AppShellCollapse label="Typography">
                  <AppShellItem>
                    <AppShellLink sub href="#scale">Scale</AppShellLink>
                  </AppShellItem>
                  <AppShellItem>
                    <AppShellLink sub href="#fonts">Fonts</AppShellLink>
                  </AppShellItem>
                </AppShellCollapse>
              </AppShellItem>
              <AppShellItem>
                <AppShellLink href="#spacing">Spacing</AppShellLink>
              </AppShellItem>
            </AppShellGroup>
          </AppShellNav>
        </AppShellSidebar>
        <AppShellMain>
          <div className="ayy-stack" style={{ "--ayy-gap": "var(--ayy-space-4)" } as CSSProperties}>
            <h2 className="ayy-h3">Themes</h2>
            <p className="ayy-muted">Dark, dark soft, light and light gray. Each one remaps the same semantic tokens.</p>
          </div>
        </AppShellMain>
      </AppShell>
    </div>
  );
}
```

## App shell — Phone drawer

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<!-- Narrow the window below 48rem: the bar appears and the menu button opens the sidebar as a drawer. <ayy-app-shell> (@danitesler/ayywi/elements) wires it;
     without it, call connectAppShell(shell) from "@danitesler/ayywi". The shell is 100dvh high; the outer box only stands in for the browser window. -->
<div style="inline-size: 100%; block-size: 28rem; overflow: hidden; border: 1px solid var(--ayy-color-line); border-radius: var(--ayy-radius-xl)">
  <ayy-app-shell>
    <div class="ayy-app-shell" style="block-size: 100%">
      <header class="ayy-app-shell__bar">
        <button type="button" class="ayy-button ayy-button--ghost ayy-button--icon ayy-app-shell__toggle" aria-label="Menu" aria-expanded="false">
          <svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 5L20 5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/><path d="M4 12L20 12" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/><path d="M4 19L20 19" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/></svg>
        </button>
        <a class="ayy-app-shell__brand" href="#home">
          Northwind
        </a>
      </header>
      <aside class="ayy-app-shell__sidebar">
        <a class="ayy-app-shell__brand" href="#home">
          Northwind
        </a>
        <nav class="ayy-app-shell__nav" aria-label="Main">
          <div class="ayy-app-shell__group">
            <p class="ayy-app-shell__group-label" id="drawer-workspace">
              Workspace
            </p>
            <ul class="ayy-app-shell__list" aria-labelledby="drawer-workspace">
              <li>
                <a class="ayy-app-shell__link" aria-current="page" href="#dashboard">
                  <svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M13.6903 19.4567C13.5 18.9973 13.5 18.4149 13.5 17.25C13.5 16.0851 13.5 15.5027 13.6903 15.0433C13.944 14.4307 14.4307 13.944 15.0433 13.6903C15.5027 13.5 16.0851 13.5 17.25 13.5C18.4149 13.5 18.9973 13.5 19.4567 13.6903C20.0693 13.944 20.556 14.4307 20.8097 15.0433C21 15.5027 21 16.0851 21 17.25C21 18.4149 21 18.9973 20.8097 19.4567C20.556 20.0693 20.0693 20.556 19.4567 20.8097C18.9973 21 18.4149 21 17.25 21C16.0851 21 15.5027 21 15.0433 20.8097C14.4307 20.556 13.944 20.0693 13.6903 19.4567Z" stroke="currentColor" stroke-linecap="square" stroke-linejoin="round" stroke-width="1.5"/><path d="M13.6903 8.95671C13.5 8.49728 13.5 7.91485 13.5 6.75C13.5 5.58515 13.5 5.00272 13.6903 4.54329C13.944 3.93072 14.4307 3.44404 15.0433 3.1903C15.5027 3 16.0851 3 17.25 3C18.4149 3 18.9973 3 19.4567 3.1903C20.0693 3.44404 20.556 3.93072 20.8097 4.54329C21 5.00272 21 5.58515 21 6.75C21 7.91485 21 8.49728 20.8097 8.95671C20.556 9.56928 20.0693 10.056 19.4567 10.3097C18.9973 10.5 18.4149 10.5 17.25 10.5C16.0851 10.5 15.5027 10.5 15.0433 10.3097C14.4307 10.056 13.944 9.56928 13.6903 8.95671Z" stroke="currentColor" stroke-linecap="square" stroke-linejoin="round" stroke-width="1.5"/><path d="M3.1903 19.4567C3 18.9973 3 18.4149 3 17.25C3 16.0851 3 15.5027 3.1903 15.0433C3.44404 14.4307 3.93072 13.944 4.54329 13.6903C5.00272 13.5 5.58515 13.5 6.75 13.5C7.91485 13.5 8.49728 13.5 8.95671 13.6903C9.56928 13.944 10.056 14.4307 10.3097 15.0433C10.5 15.5027 10.5 16.0851 10.5 17.25C10.5 18.4149 10.5 18.9973 10.3097 19.4567C10.056 20.0693 9.56928 20.556 8.95671 20.8097C8.49728 21 7.91485 21 6.75 21C5.58515 21 5.00272 21 4.54329 20.8097C3.93072 20.556 3.44404 20.0693 3.1903 19.4567Z" stroke="currentColor" stroke-linecap="square" stroke-linejoin="round" stroke-width="1.5"/><path d="M3.1903 8.95671C3 8.49728 3 7.91485 3 6.75C3 5.58515 3 5.00272 3.1903 4.54329C3.44404 3.93072 3.93072 3.44404 4.54329 3.1903C5.00272 3 5.58515 3 6.75 3C7.91485 3 8.49728 3 8.95671 3.1903C9.56928 3.44404 10.056 3.93072 10.3097 4.54329C10.5 5.00272 10.5 5.58515 10.5 6.75C10.5 7.91485 10.5 8.49728 10.3097 8.95671C10.056 9.56928 9.56928 10.056 8.95671 10.3097C8.49728 10.5 7.91485 10.5 6.75 10.5C5.58515 10.5 5.00272 10.5 4.54329 10.3097C3.93072 10.056 3.44404 9.56928 3.1903 8.95671Z" stroke="currentColor" stroke-linecap="square" stroke-linejoin="round" stroke-width="1.5"/></svg>
                  Dashboard
                </a>
              </li>
              <li>
                <a class="ayy-app-shell__link" href="#projects">
                  <svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M8 7H16.75C18.8567 7 19.91 7 20.6667 7.50559C20.9943 7.72447 21.2755 8.00572 21.4944 8.33329C22 9.08996 22 10.1433 22 12.25C22 15.7612 22 17.5167 21.1573 18.7779C20.7926 19.3238 20.3238 19.7926 19.7779 20.1573C18.5167 21 16.7612 21 13.25 21H12C7.28595 21 4.92893 21 3.46447 19.5355C2 18.0711 2 15.714 2 11V7.94427C2 6.1278 2 5.21956 2.38032 4.53806C2.65142 4.05227 3.05227 3.65142 3.53806 3.38032C4.21956 3 5.1278 3 6.94427 3C8.10802 3 8.6899 3 9.19926 3.19101C10.3622 3.62712 10.8418 4.68358 11.3666 5.73313L12 7" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"/></svg>
                  Projects
                </a>
              </li>
              <li>
                <a class="ayy-app-shell__link" href="#team">
                  <svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M18.4995 20.5C18.2663 17.5685 15.8417 15.2477 12.808 15.0521L11.9995 15C11.7107 15.0076 11.4416 15.0178 11.1877 15.0298C8.18075 15.1723 5.7304 17.5974 5.49951 20.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/><path d="M15.2495 9.25C15.2495 11.0449 13.7944 12.5 11.9995 12.5C10.2046 12.5 8.74952 11.0449 8.74952 9.25C8.74952 7.45507 10.2046 6 11.9995 6C13.7944 6 15.2495 7.45507 15.2495 9.25Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/><path d="M5.50249 8.5C5.17908 7.99485 4.99158 7.39432 4.99158 6.75C4.99158 4.95507 6.44665 3.5 8.24157 3.5C8.68752 3.5 9.1125 3.58982 9.49939 3.75235" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/><path d="M18.4963 8.5C18.8197 7.99485 19.0072 7.39432 19.0072 6.75C19.0072 4.95507 17.5521 3.5 15.7572 3.5C15.3113 3.5 14.8863 3.58982 14.4994 3.75235" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/><path d="M22.0007 17.9996C21.8208 15.7374 19.9995 13.5 17.9995 13" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/><path d="M1.99927 17.9996C2.17923 15.7374 4.00049 13.5 6.00049 13" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/></svg>
                  Team
                </a>
              </li>
            </ul>
          </div>
          <div class="ayy-app-shell__group">
            <p class="ayy-app-shell__group-label" id="drawer-billing">
              Billing
            </p>
            <ul class="ayy-app-shell__list" aria-labelledby="drawer-billing">
              <li>
                <a class="ayy-app-shell__link" href="#invoices">
                  <svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 18.6458V8.05426C4 5.20025 4 3.77325 4.87868 2.88663C5.75736 2 7.17157 2 10 2H14C16.8284 2 18.2426 2 19.1213 2.88663C20 3.77325 20 5.20025 20 8.05426V18.6458C20 20.1575 20 20.9133 19.538 21.2108C18.7831 21.6971 17.6161 20.6774 17.0291 20.3073C16.5441 20.0014 16.3017 19.8485 16.0325 19.8397C15.7417 19.8301 15.4949 19.9768 14.9709 20.3073L13.06 21.5124C12.5445 21.8374 12.2868 22 12 22C11.7132 22 11.4555 21.8374 10.94 21.5124L9.02913 20.3073C8.54415 20.0014 8.30166 19.8485 8.03253 19.8397C7.74172 19.8301 7.49493 19.9768 6.97087 20.3073C6.38395 20.6774 5.21687 21.6971 4.46195 21.2108C4 20.9133 4 20.1575 4 18.6458Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/><path d="M11 11H8" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/><path d="M14 7L8 7" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/></svg>
                  Invoices
                </a>
              </li>
            </ul>
          </div>
        </nav>
        <div class="ayy-app-shell__footer">
          <a class="ayy-app-shell__link" href="#settings">
            <svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M15.5 12C15.5 13.933 13.933 15.5 12 15.5C10.067 15.5 8.5 13.933 8.5 12C8.5 10.067 10.067 8.5 12 8.5C13.933 8.5 15.5 10.067 15.5 12Z" stroke="currentColor" stroke-width="1.5"/><path d="M21.011 14.0965C21.5329 13.9558 21.7939 13.8854 21.8969 13.7508C22 13.6163 22 13.3998 22 12.9669V11.0332C22 10.6003 22 10.3838 21.8969 10.2493C21.7938 10.1147 21.5329 10.0443 21.011 9.90358C19.0606 9.37759 17.8399 7.33851 18.3433 5.40087C18.4817 4.86799 18.5509 4.60156 18.4848 4.44529C18.4187 4.28902 18.2291 4.18134 17.8497 3.96596L16.125 2.98673C15.7528 2.77539 15.5667 2.66972 15.3997 2.69222C15.2326 2.71472 15.0442 2.90273 14.6672 3.27873C13.208 4.73448 10.7936 4.73442 9.33434 3.27864C8.95743 2.90263 8.76898 2.71463 8.60193 2.69212C8.43489 2.66962 8.24877 2.77529 7.87653 2.98663L6.15184 3.96587C5.77253 4.18123 5.58287 4.28891 5.51678 4.44515C5.45068 4.6014 5.51987 4.86787 5.65825 5.4008C6.16137 7.3385 4.93972 9.37763 2.98902 9.9036C2.46712 10.0443 2.20617 10.1147 2.10308 10.2492C2 10.3838 2 10.6003 2 11.0332V12.9669C2 13.3998 2 13.6163 2.10308 13.7508C2.20615 13.8854 2.46711 13.9558 2.98902 14.0965C4.9394 14.6225 6.16008 16.6616 5.65672 18.5992C5.51829 19.1321 5.44907 19.3985 5.51516 19.5548C5.58126 19.7111 5.77092 19.8188 6.15025 20.0341L7.87495 21.0134C8.24721 21.2247 8.43334 21.3304 8.6004 21.3079C8.76746 21.2854 8.95588 21.0973 9.33271 20.7213C10.7927 19.2644 13.2088 19.2643 14.6689 20.7212C15.0457 21.0973 15.2341 21.2853 15.4012 21.3078C15.5682 21.3303 15.7544 21.2246 16.1266 21.0133L17.8513 20.034C18.2307 19.8187 18.4204 19.711 18.4864 19.5547C18.5525 19.3984 18.4833 19.132 18.3448 18.5991C17.8412 16.6616 19.0609 14.6226 21.011 14.0965Z" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"/></svg>
            Settings
          </a>
        </div>
      </aside>
      <main class="ayy-app-shell__main">
        <div class="ayy-stack">
          <h2 class="ayy-h3">
            Dashboard
          </h2>
          <p class="ayy-muted">
            What&#x27;s moving across your projects this week.
          </p>
        </div>
      </main>
    </div>
  </ayy-app-shell>
</div>
```

React:

```tsx
import { DashboardSquare01Icon, Folder01Icon, Invoice01Icon, Settings02Icon, UserGroupIcon } from "@hugeicons/core-free-icons";
import {
  AppShell,
  AppShellBar,
  AppShellBrand,
  AppShellFooter,
  AppShellGroup,
  AppShellItem,
  AppShellLink,
  AppShellMain,
  AppShellNav,
  AppShellSidebar,
  AppShellToggle,
  Icon,
} from "@danitesler/ayywi/react";

export default function Example() {
  // Narrow the window below 48rem: the bar appears and the menu button opens the sidebar as a drawer.
  // The shell is 100dvh high; this box only stands in for the browser window.
  return (
    <div style={{ inlineSize: "100%", blockSize: "28rem", overflow: "hidden", border: "1px solid var(--ayy-color-line)", borderRadius: "var(--ayy-radius-xl)" }}>
      <AppShell style={{ blockSize: "100%" }}>
        <AppShellBar>
          <AppShellToggle />
          <AppShellBrand href="#home">Northwind</AppShellBrand>
        </AppShellBar>
        <AppShellSidebar>
          <AppShellBrand href="#home">Northwind</AppShellBrand>
          <AppShellNav>
            <AppShellGroup label="Workspace">
              <AppShellItem>
                <AppShellLink href="#dashboard" current>
                  <Icon icon={DashboardSquare01Icon} />
                  Dashboard
                </AppShellLink>
              </AppShellItem>
              <AppShellItem>
                <AppShellLink href="#projects">
                  <Icon icon={Folder01Icon} />
                  Projects
                </AppShellLink>
              </AppShellItem>
              <AppShellItem>
                <AppShellLink href="#team">
                  <Icon icon={UserGroupIcon} />
                  Team
                </AppShellLink>
              </AppShellItem>
            </AppShellGroup>
            <AppShellGroup label="Billing">
              <AppShellItem>
                <AppShellLink href="#invoices">
                  <Icon icon={Invoice01Icon} />
                  Invoices
                </AppShellLink>
              </AppShellItem>
            </AppShellGroup>
          </AppShellNav>
          <AppShellFooter>
            <AppShellLink href="#settings">
              <Icon icon={Settings02Icon} />
              Settings
            </AppShellLink>
          </AppShellFooter>
        </AppShellSidebar>
        <AppShellMain>
          <div className="ayy-stack">
            <h2 className="ayy-h3">Dashboard</h2>
            <p className="ayy-muted">What's moving across your projects this week.</p>
          </div>
        </AppShellMain>
      </AppShell>
    </div>
  );
}
```

## App shell — Full-screen settings

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<!-- Settings replace the app's own frame: the same shell, its sidebar swapped for a way back and the sections. Below 48rem the section list and the open section are two screens. The outer box only stands in for the browser window. -->
<div style="inline-size: 100%; block-size: 34rem; overflow: hidden; border: 1px solid var(--ayy-color-line); border-radius: var(--ayy-radius-xl)">
  <ayy-app-shell>
    <div class="ayy-app-shell ayy-app-shell--settings" style="block-size: 100%">
      <aside class="ayy-app-shell__sidebar">
        <a class="ayy-app-shell__back" href="#inbox">
          <svg class="ayy-icon ayy-icon--directional" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M15 6C15 6 9.00001 10.4189 9 12C8.99999 13.5812 15 18 15 18" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/></svg>
          <span>Back to Northwind</span>
        </a>
        <h2 class="ayy-app-shell__title">Settings</h2>
        <nav class="ayy-app-shell__nav" aria-label="Settings">
          <div class="ayy-app-shell__group">
            <p class="ayy-app-shell__group-label" id="settings-account-html">Account</p>
            <ul class="ayy-app-shell__list" aria-labelledby="settings-account-html">
              <li>
                <a class="ayy-app-shell__link" href="#profile">
                  <svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M18.4984 19.1511C17.3377 17.4018 15.2947 16.2009 12.9313 16.0569L11.9984 16C11.6652 16.0083 11.3547 16.0194 11.0617 16.0325C8.71722 16.1376 6.66598 17.3796 5.5 19.1511" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/><path d="M14.9961 10C14.9961 11.6569 13.6529 13 11.9961 13C10.3392 13 8.99609 11.6569 8.99609 10C8.99609 8.34315 10.3392 7 11.9961 7C13.6529 7 14.9961 8.34315 14.9961 10Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/><path d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/></svg>
                  Profile
                </a>
              </li>
              <li>
                <a class="ayy-app-shell__link" aria-current="page" href="#preferences">
                  <svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C12.8417 22 14 22.1163 14 21C14 20.391 13.6832 19.9212 13.3686 19.4544C12.9082 18.7715 12.4523 18.0953 13 17C13.6667 15.6667 14.7778 15.6667 16.4815 15.6667C17.3334 15.6667 18.3334 15.6667 19.5 15.5C21.601 15.1999 22 13.9084 22 12Z" stroke="currentColor" stroke-width="1.5"/><circle cx="9.5" cy="8.5" r="1.5" stroke="currentColor" stroke-width="1.5"></circle><circle cx="16.5" cy="9.5" r="1.5" stroke="currentColor" stroke-width="1.5"></circle><path d="M7.125 15H7M7.25 15C7.25 15.1381 7.13807 15.25 7 15.25C6.86193 15.25 6.75 15.1381 6.75 15C6.75 14.8619 6.86193 14.75 7 14.75C7.13807 14.75 7.25 14.8619 7.25 15Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/></svg>
                  Preferences
                </a>
              </li>
              <li>
                <a class="ayy-app-shell__link" href="#notifications">
                  <svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20 18.5011L18.349 7.93407C17.8603 4.80601 15.166 2.5 12 2.5C8.83398 2.5 6.13971 4.80601 5.65098 7.93407L4 18.5011" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/><path d="M20 18.5C20 16.8431 16.4183 15.5 12 15.5C7.58172 15.5 4 16.8431 4 18.5C4 20.1569 7.58172 21.5 12 21.5C16.4183 21.5 20 20.1569 20 18.5Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/><path d="M13 18.5H11" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/></svg>
                  Notifications
                </a>
              </li>
            </ul>
          </div>
          <div class="ayy-app-shell__group">
            <p class="ayy-app-shell__group-label" id="settings-workspace-html">Workspace</p>
            <ul class="ayy-app-shell__list" aria-labelledby="settings-workspace-html">
              <li>
                <a class="ayy-app-shell__link" href="#members">
                  <svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M18.4995 20.5C18.2663 17.5685 15.8417 15.2477 12.808 15.0521L11.9995 15C11.7107 15.0076 11.4416 15.0178 11.1877 15.0298C8.18075 15.1723 5.7304 17.5974 5.49951 20.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/><path d="M15.2495 9.25C15.2495 11.0449 13.7944 12.5 11.9995 12.5C10.2046 12.5 8.74952 11.0449 8.74952 9.25C8.74952 7.45507 10.2046 6 11.9995 6C13.7944 6 15.2495 7.45507 15.2495 9.25Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/><path d="M5.50249 8.5C5.17908 7.99485 4.99158 7.39432 4.99158 6.75C4.99158 4.95507 6.44665 3.5 8.24157 3.5C8.68752 3.5 9.1125 3.58982 9.49939 3.75235" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/><path d="M18.4963 8.5C18.8197 7.99485 19.0072 7.39432 19.0072 6.75C19.0072 4.95507 17.5521 3.5 15.7572 3.5C15.3113 3.5 14.8863 3.58982 14.4994 3.75235" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/><path d="M22.0007 17.9996C21.8208 15.7374 19.9995 13.5 17.9995 13" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/><path d="M1.99927 17.9996C2.17923 15.7374 4.00049 13.5 6.00049 13" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/></svg>
                  Members
                </a>
              </li>
              <li>
                <a class="ayy-app-shell__link" href="#shortcuts">
                  <svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M14.5 7H9.5C6.21252 7 4.56878 7 3.46243 7.90796C3.25989 8.07418 3.07418 8.25989 2.90796 8.46243C2 9.56878 2 11.2125 2 14.5C2 17.7875 2 19.4312 2.90796 20.5376C3.07418 20.7401 3.25989 20.9258 3.46243 21.092C4.56878 22 6.21252 22 9.5 22H14.5C17.7875 22 19.4312 22 20.5376 21.092C20.7401 20.9258 20.9258 20.7401 21.092 20.5376C22 19.4312 22 17.7875 22 14.5C22 11.2125 22 9.56878 21.092 8.46243C20.9258 8.25989 20.7401 8.07418 20.5376 7.90796C19.4312 7 17.7875 7 14.5 7Z" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"/><path d="M12 7V5C12 4.44772 12.4477 4 13 4C13.5523 4 14 3.55228 14 3V2" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/><path d="M7 12L8 12" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/><path d="M11.5 12L12.5 12" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/><path d="M16 12L17 12" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/><path d="M7 17L17 17" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/></svg>
                  Shortcuts
                </a>
              </li>
              <li>
                <a class="ayy-app-shell__link" href="#data">
                  <svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M3 12C3 7.75736 3 5.63604 4.31802 4.31802C5.63604 3 7.75736 3 12 3C16.2426 3 18.364 3 19.682 4.31802C21 5.63604 21 7.75736 21 12C21 16.2426 21 18.364 19.682 19.682C18.364 21 16.2426 21 12 21C7.75736 21 5.63604 21 4.31802 19.682C3 18.364 3 16.2426 3 12Z" stroke="currentColor" stroke-width="1.5"/><path d="M3 12H21" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/><path d="M11 7.5L17 7.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/><path d="M7.125 7.5H7M7.25 7.5C7.25 7.63807 7.13807 7.75 7 7.75C6.86193 7.75 6.75 7.63807 6.75 7.5C6.75 7.36193 6.86193 7.25 7 7.25C7.13807 7.25 7.25 7.36193 7.25 7.5Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/><path d="M11 16.5L17 16.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/><path d="M7.125 16.5H7M7.25 16.5C7.25 16.6381 7.13807 16.75 7 16.75C6.86193 16.75 6.75 16.6381 6.75 16.5C6.75 16.3619 6.86193 16.25 7 16.25C7.13807 16.25 7.25 16.3619 7.25 16.5Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/></svg>
                  Data and sync
                </a>
              </li>
            </ul>
          </div>
        </nav>
      </aside>
      <main class="ayy-app-shell__main">
        <header class="ayy-top-bar">
          <a class="ayy-top-bar__back" href="#settings">
            <svg class="ayy-icon ayy-icon--directional" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M15 6C15 6 9.00001 10.4189 9 12C8.99999 13.5812 15 18 15 18" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/></svg>
            <span>Settings</span>
          </a>
          <h1 class="ayy-top-bar__title">Preferences</h1>
        </header>
        <section class="ayy-settings" aria-labelledby="pref-appearance-html">
          <h2 id="pref-appearance-html" class="ayy-settings__title">Appearance</h2>
          <div class="ayy-settings__list">
            <div class="ayy-settings__row">
              <div class="ayy-settings__text">
                <label class="ayy-settings__label" for="pref-theme-html">Theme</label>
              </div>
              <div class="ayy-settings__control">
                <div class="ayy-select">
                  <select class="ayy-select__control" id="pref-theme-html">
                    <option value="system" selected="">Match the system</option>
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                  </select>
                </div>
              </div>
            </div>
            <div class="ayy-settings__row">
              <div class="ayy-settings__text">
                <label class="ayy-settings__label" for="pref-touch-html">Larger controls</label>
                <p class="ayy-settings__hint" id="pref-touch-hint-html">Taller rows and buttons, easier to tap.</p>
              </div>
              <div class="ayy-settings__control">
                <input type="checkbox" role="switch" class="ayy-switch" id="pref-touch-html" aria-describedby="pref-touch-hint-html"/>
              </div>
            </div>
          </div>
        </section>
        <section class="ayy-settings" aria-labelledby="pref-general-html">
          <h2 id="pref-general-html" class="ayy-settings__title">General</h2>
          <div class="ayy-settings__list">
            <div class="ayy-settings__row">
              <div class="ayy-settings__text">
                <label class="ayy-settings__label" for="pref-login-html">Open at login</label>
                <p class="ayy-settings__hint" id="pref-login-hint-html">Start in the menu bar when you sign in.</p>
              </div>
              <div class="ayy-settings__control">
                <input type="checkbox" role="switch" class="ayy-switch" id="pref-login-html" aria-describedby="pref-login-hint-html" checked=""/>
              </div>
            </div>
            <div class="ayy-settings__row">
              <div class="ayy-settings__text">
                <label class="ayy-settings__label" for="pref-week-html">Week starts on</label>
              </div>
              <div class="ayy-settings__control">
                <div class="ayy-select">
                  <select class="ayy-select__control" id="pref-week-html">
                    <option value="0">Sunday</option>
                    <option value="1" selected="">Monday</option>
                    <option value="6">Saturday</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  </ayy-app-shell>
</div>
```

React:

```tsx
import { Database01Icon, KeyboardIcon, Notification03Icon, PaintBoardIcon, UserCircleIcon, UserGroupIcon } from "@hugeicons/core-free-icons";
import {
  AppShell,
  AppShellBack,
  AppShellGroup,
  AppShellItem,
  AppShellLink,
  AppShellMain,
  AppShellNav,
  AppShellSidebar,
  AppShellTitle,
  Icon,
  Select,
  Settings,
  SettingsRow,
  Switch,
  TopBar,
} from "@danitesler/ayywi/react";

export default function Example() {
  // Settings replace the app's own frame: same shell, the sidebar swapped for a way back and the sections. Below 48rem the
  // section list and the open section are two screens. The box stands in for the browser window; drop it in your app.
  return (
    <div style={{ inlineSize: "100%", blockSize: "34rem", overflow: "hidden", border: "1px solid var(--ayy-color-line)", borderRadius: "var(--ayy-radius-xl)" }}>
      <AppShell settings style={{ blockSize: "100%" }}>
        <AppShellSidebar>
          <AppShellBack href="#inbox">Back to Northwind</AppShellBack>
          <AppShellTitle>Settings</AppShellTitle>
          <AppShellNav aria-label="Settings">
            <AppShellGroup label="Account">
              <AppShellItem>
                <AppShellLink href="#profile">
                  <Icon icon={UserCircleIcon} />
                  Profile
                </AppShellLink>
              </AppShellItem>
              <AppShellItem>
                <AppShellLink href="#preferences" current>
                  <Icon icon={PaintBoardIcon} />
                  Preferences
                </AppShellLink>
              </AppShellItem>
              <AppShellItem>
                <AppShellLink href="#notifications">
                  <Icon icon={Notification03Icon} />
                  Notifications
                </AppShellLink>
              </AppShellItem>
            </AppShellGroup>
            <AppShellGroup label="Workspace">
              <AppShellItem>
                <AppShellLink href="#members">
                  <Icon icon={UserGroupIcon} />
                  Members
                </AppShellLink>
              </AppShellItem>
              <AppShellItem>
                <AppShellLink href="#shortcuts">
                  <Icon icon={KeyboardIcon} />
                  Shortcuts
                </AppShellLink>
              </AppShellItem>
              <AppShellItem>
                <AppShellLink href="#data">
                  <Icon icon={Database01Icon} />
                  Data and sync
                </AppShellLink>
              </AppShellItem>
            </AppShellGroup>
          </AppShellNav>
        </AppShellSidebar>
        <AppShellMain>
          <TopBar backHref="#settings" backLabel="Settings" title="Preferences" />
          <Settings title="Appearance">
            <SettingsRow label="Theme" htmlFor="pref-theme">
              <Select id="pref-theme" defaultValue="system">
                <option value="system">Match the system</option>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </Select>
            </SettingsRow>
            <SettingsRow label="Larger controls" htmlFor="pref-touch" hint="Taller rows and buttons, easier to tap.">
              <Switch id="pref-touch" aria-describedby="pref-touch-hint" />
            </SettingsRow>
          </Settings>
          <Settings title="General">
            <SettingsRow label="Open at login" htmlFor="pref-login" hint="Start in the menu bar when you sign in.">
              <Switch id="pref-login" aria-describedby="pref-login-hint" defaultChecked />
            </SettingsRow>
            <SettingsRow label="Week starts on" htmlFor="pref-week">
              <Select id="pref-week" defaultValue="1">
                <option value="0">Sunday</option>
                <option value="1">Monday</option>
                <option value="6">Saturday</option>
              </Select>
            </SettingsRow>
          </Settings>
        </AppShellMain>
      </AppShell>
    </div>
  );
}
```

---
Part of @danitesler/ayywi 0.0.1: load `dist/ayywi.min.css` (and `dist/elements.global.js` for the <ayy-*> elements). The rules every screen follows: [llms-full.txt#rules](../llms-full.txt#rules). Every component: [llms.txt](../llms.txt).
