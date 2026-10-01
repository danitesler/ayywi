# Bottom nav

Category: Navigation. A phone app's tab bar: three to five top-level destinations, each an icon over a short label, pinned to the bottom of the screen within thumb reach and clear of the home indicator. Inside an App shell it replaces the sidebar on phones.

**Classes**
- `.ayy-bottom-nav` — The <nav>. Equal-width columns, one per link. Sticky to the bottom of its scroll container (the page, or the box it scrolls in), with the safe-area inset added below. As a direct child of .ayy-app-shell it shows below 48rem only; from 48rem the sidebar carries the same links.
- `.ayy-bottom-nav__link` — A tab: icon over label. An <a> for a destination, or a <button> for a tab that acts ("More", which opens the app shell's drawer when it also has ayy-app-shell__toggle). aria-current="page" (or aria-expanded="true" on the button) draws a pill behind the icon and a heavier label.
- `.ayy-bottom-nav__label` — The tab's text, one line, cut with an ellipsis if it's too long.

**JS (framework-free)**: bottomNavClass, bottomNavLinkClass, bottomNavLabelClass constants.

**React** — `import { BottomNav, BottomNavLink, BottomNavButton } from "ayywi/react";`
- `<BottomNav>` renders <nav class="ayy-bottom-nav">. Props: `aria-label` Defaults to "Main" (translate it).
- `<BottomNavLink>` renders <a class="ayy-bottom-nav__link"> with the icon and a <span class="ayy-bottom-nav__label">. Props: `icon` ReactNode — the icon above the label (an <Icon>).; `current` boolean — sets aria-current="page".
- `<BottomNavButton>` renders <button type="button" class="ayy-bottom-nav__link"> with the icon and a label <span>. Props: `icon` ReactNode — the icon above the label.

**Accessibility**
- It's a <nav>: give it an aria-label ("Main" by default in React). Inside an App shell only one of it and the sidebar shows at a time, so they can share the label.
- Mark the current page with aria-current="page". It also gets a pill and a heavier weight, so colour isn't the only cue; High Contrast mode fills the pill with the system highlight.
- Every tab keeps a visible text label. Icon-only tabs are guesswork.
- A "More" tab is a <button> with aria-expanded (set for you when it's an app shell toggle), not a link to "#".
- Each tab is at least the large control height, so it's a comfortable touch target at every density.
- Outside an App shell, content above it needs bottom padding (or to end before it) so the last line isn't hidden behind the bar.

**Do**
- Use a bottom nav for the three to five top-level destinations of a phone app, so they're one thumb-tap away.
- Put it inside the App shell, after the main: it shows on phones and the sidebar takes over from 48rem, with no media query of yours.
- Give it the same destinations, icons and order as the sidebar's top-level links.
- Keep labels to one short word: Home, Search, Inbox, Account.
- With more than five destinations, keep the four most used and end with a "More" tab that opens the sidebar as a drawer (a BottomNavButton with the ayy-app-shell__toggle class).

**Don't**
- Don't use a bottom nav for actions (compose, share) — use a Button, or a bottom-sheet Dialog for a list of actions. The one exception is a "More" tab that opens the drawer.
- Don't use it to switch views of one thing inside a page — use Tabs or a Segmented control.
- Don't put more than five tabs in it; the rest go in the drawer behind "More".
- Don't show it next to the sidebar on wide screens, and don't hide it with your own media query when it's inside an App shell.
- Don't nest menus in it or change its tabs from page to page.

## Bottom nav — Phone tab bar

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<!-- A phone-sized screen. The nav is sticky, so it stays at the bottom of whatever scrolls: the page, or a box like this one. -->
<div style="display: flex; flex-direction: column; inline-size: min(100%, 24rem); block-size: 22rem; overflow: auto; border: 1px solid var(--ayy-color-line); border-radius: var(--ayy-radius-xl)">
  <div class="ayy-stack" style="flex: 1; padding: var(--ayy-space-4)">
    <h2 class="ayy-h4">
      Home
    </h2>
    <p class="ayy-muted">
      Three deploys went out this morning. Nothing needs you.
    </p>
  </div>
  <nav class="ayy-bottom-nav" aria-label="Main">
    <a class="ayy-bottom-nav__link" aria-current="page" href="#home">
      <svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M13.6903 19.4567C13.5 18.9973 13.5 18.4149 13.5 17.25C13.5 16.0851 13.5 15.5027 13.6903 15.0433C13.944 14.4307 14.4307 13.944 15.0433 13.6903C15.5027 13.5 16.0851 13.5 17.25 13.5C18.4149 13.5 18.9973 13.5 19.4567 13.6903C20.0693 13.944 20.556 14.4307 20.8097 15.0433C21 15.5027 21 16.0851 21 17.25C21 18.4149 21 18.9973 20.8097 19.4567C20.556 20.0693 20.0693 20.556 19.4567 20.8097C18.9973 21 18.4149 21 17.25 21C16.0851 21 15.5027 21 15.0433 20.8097C14.4307 20.556 13.944 20.0693 13.6903 19.4567Z" stroke="currentColor" stroke-linecap="square" stroke-linejoin="round" stroke-width="1.5"/><path d="M13.6903 8.95671C13.5 8.49728 13.5 7.91485 13.5 6.75C13.5 5.58515 13.5 5.00272 13.6903 4.54329C13.944 3.93072 14.4307 3.44404 15.0433 3.1903C15.5027 3 16.0851 3 17.25 3C18.4149 3 18.9973 3 19.4567 3.1903C20.0693 3.44404 20.556 3.93072 20.8097 4.54329C21 5.00272 21 5.58515 21 6.75C21 7.91485 21 8.49728 20.8097 8.95671C20.556 9.56928 20.0693 10.056 19.4567 10.3097C18.9973 10.5 18.4149 10.5 17.25 10.5C16.0851 10.5 15.5027 10.5 15.0433 10.3097C14.4307 10.056 13.944 9.56928 13.6903 8.95671Z" stroke="currentColor" stroke-linecap="square" stroke-linejoin="round" stroke-width="1.5"/><path d="M3.1903 19.4567C3 18.9973 3 18.4149 3 17.25C3 16.0851 3 15.5027 3.1903 15.0433C3.44404 14.4307 3.93072 13.944 4.54329 13.6903C5.00272 13.5 5.58515 13.5 6.75 13.5C7.91485 13.5 8.49728 13.5 8.95671 13.6903C9.56928 13.944 10.056 14.4307 10.3097 15.0433C10.5 15.5027 10.5 16.0851 10.5 17.25C10.5 18.4149 10.5 18.9973 10.3097 19.4567C10.056 20.0693 9.56928 20.556 8.95671 20.8097C8.49728 21 7.91485 21 6.75 21C5.58515 21 5.00272 21 4.54329 20.8097C3.93072 20.556 3.44404 20.0693 3.1903 19.4567Z" stroke="currentColor" stroke-linecap="square" stroke-linejoin="round" stroke-width="1.5"/><path d="M3.1903 8.95671C3 8.49728 3 7.91485 3 6.75C3 5.58515 3 5.00272 3.1903 4.54329C3.44404 3.93072 3.93072 3.44404 4.54329 3.1903C5.00272 3 5.58515 3 6.75 3C7.91485 3 8.49728 3 8.95671 3.1903C9.56928 3.44404 10.056 3.93072 10.3097 4.54329C10.5 5.00272 10.5 5.58515 10.5 6.75C10.5 7.91485 10.5 8.49728 10.3097 8.95671C10.056 9.56928 9.56928 10.056 8.95671 10.3097C8.49728 10.5 7.91485 10.5 6.75 10.5C5.58515 10.5 5.00272 10.5 4.54329 10.3097C3.93072 10.056 3.44404 9.56928 3.1903 8.95671Z" stroke="currentColor" stroke-linecap="square" stroke-linejoin="round" stroke-width="1.5"/></svg>
      <span class="ayy-bottom-nav__label">
        Home
      </span>
    </a>
    <a class="ayy-bottom-nav__link" href="#projects">
      <svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M8 7H16.75C18.8567 7 19.91 7 20.6667 7.50559C20.9943 7.72447 21.2755 8.00572 21.4944 8.33329C22 9.08996 22 10.1433 22 12.25C22 15.7612 22 17.5167 21.1573 18.7779C20.7926 19.3238 20.3238 19.7926 19.7779 20.1573C18.5167 21 16.7612 21 13.25 21H12C7.28595 21 4.92893 21 3.46447 19.5355C2 18.0711 2 15.714 2 11V7.94427C2 6.1278 2 5.21956 2.38032 4.53806C2.65142 4.05227 3.05227 3.65142 3.53806 3.38032C4.21956 3 5.1278 3 6.94427 3C8.10802 3 8.6899 3 9.19926 3.19101C10.3622 3.62712 10.8418 4.68358 11.3666 5.73313L12 7" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"/></svg>
      <span class="ayy-bottom-nav__label">
        Projects
      </span>
    </a>
    <a class="ayy-bottom-nav__link" href="#inbox">
      <svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20 18.5011L18.349 7.93407C17.8603 4.80601 15.166 2.5 12 2.5C8.83398 2.5 6.13971 4.80601 5.65098 7.93407L4 18.5011" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/><path d="M20 18.5C20 16.8431 16.4183 15.5 12 15.5C7.58172 15.5 4 16.8431 4 18.5C4 20.1569 7.58172 21.5 12 21.5C16.4183 21.5 20 20.1569 20 18.5Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/><path d="M13 18.5H11" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/></svg>
      <span class="ayy-bottom-nav__label">
        Inbox
      </span>
    </a>
    <a class="ayy-bottom-nav__link" href="#account">
      <svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20 21.0001C19.713 17.269 16.7289 14.3151 12.995 14.0662L12 13.9999C11.6446 14.0096 11.3134 14.0225 11.0008 14.0378C7.3 14.2192 4.28417 17.3057 4 21.0001" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/><circle cx="12" cy="6.99988" r="4" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/></svg>
      <span class="ayy-bottom-nav__label">
        Account
      </span>
    </a>
  </nav>
</div>
```

React:

```tsx
import { DashboardSquare01Icon, Folder01Icon, Notification03Icon, UserIcon } from "@hugeicons/core-free-icons";
import { BottomNav, BottomNavLink, Icon } from "ayywi/react";

export default function Example() {
  // A phone-sized screen. The nav is sticky, so it stays at the bottom of whatever scrolls: the page, or a box like this one.
  return (
    <div style={{ display: "flex", flexDirection: "column", inlineSize: "min(100%, 24rem)", blockSize: "22rem", overflow: "auto", border: "1px solid var(--ayy-color-line)", borderRadius: "var(--ayy-radius-xl)" }}>
      <div className="ayy-stack" style={{ flex: 1, padding: "var(--ayy-space-4)" }}>
        <h2 className="ayy-h4">Home</h2>
        <p className="ayy-muted">Three deploys went out this morning. Nothing needs you.</p>
      </div>
      <BottomNav>
        <BottomNavLink href="#home" icon={<Icon icon={DashboardSquare01Icon} />} current>
          Home
        </BottomNavLink>
        <BottomNavLink href="#projects" icon={<Icon icon={Folder01Icon} />}>
          Projects
        </BottomNavLink>
        <BottomNavLink href="#inbox" icon={<Icon icon={Notification03Icon} />}>
          Inbox
        </BottomNavLink>
        <BottomNavLink href="#account" icon={<Icon icon={UserIcon} />}>
          Account
        </BottomNavLink>
      </BottomNav>
    </div>
  );
}
```

---
Part of ayywi 0.4.0: load `dist/ayywi.min.css` (and `dist/elements.global.js` for the <ayy-*> elements). The rules every screen follows: [llms-full.txt#rules](../llms-full.txt#rules). Every component: [llms.txt](../llms.txt).
