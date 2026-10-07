# Top bar

Category: Navigation. A phone screen's header: a back button, the screen's title (and a subtitle), and one to three actions, sticky at the top and clear of the notch. Centred title for iOS-style screens, a large title on its own line for a tab's first screen, and an optional second row for a search bar or a segmented control.

**Classes**
- `.ayy-top-bar` — A <header>: sticky at the top of its scroll container, the page colour with a hairline under it. As the first child of an .ayy-app-shell__main it runs edge to edge over the main area's padding.
- `.ayy-top-bar--center` — The title centred between the back button and the actions.
- `.ayy-top-bar--large` — The buttons on the first line, a big title on its own line under them.
- `.ayy-top-bar__back` — An <a href> or <button> with a directional chevron (.ayy-icon--directional) and optionally the previous screen's name in a <span>. Chevron only: aria-label="Back".
- `.ayy-top-bar__title` — The screen's name, an <h1>; cut with an ellipsis when long.
- `.ayy-top-bar__heading` — Wraps the __title and a __subtitle when there is one.
- `.ayy-top-bar__subtitle` — A muted line under the title ("8 items", "Edited 2 min ago").
- `.ayy-top-bar__actions` — One to three icon buttons (.ayy-button--ghost.ayy-button--icon, each with an aria-label) or a short text button (Save), at the end.
- `.ayy-top-bar__row` — A second line across the bar: a Search bar, a Segmented control, Chips.

**States**
- `default` — A sticky bar in the page colour with a hairline under it: a back chevron, a semibold one-line title, and actions at the inline end, clear of the notch.
- `hover` (`.ayy-top-bar__back:hover (devices that hover)`) — The back button gets a wash-hover pill; action buttons keep their own hover.
- `pressed` — doesn't apply: No pressed look of its own; the back button navigates at once.
- `focus` (`.ayy-top-bar__back:focus-visible`) — 2px ring around the back pill; action buttons keep their own ring.
- `disabled` — doesn't apply: Hide the back button on a screen with nowhere to go back to, rather than disabling it.
- `selected` — doesn't apply: Not selectable. Put a Segmented control in __row to switch views.
- `error` — doesn't apply: No error look. Show an Alert at the top of the content.
- `loading` — doesn't apply: No loading look. Show a Skeleton or a Progress bar in the content under it.

**Sizes**
- Density — At least the lg control height plus 16px; the back button is the md control height (32px compact, 40 comfortable, 44 touch).
- Width — Full width of its scroll container (edge to edge as the first child of an App shell's main). large wraps the title onto its own line.

**JS (framework-free)**: topBarClass({ center?, large?, className? }) → string; topBarBackIcon (the back chevron's SVG markup, mirrored in RTL).

**React** — `import { TopBar } from "@danitesler/ayywi/react";`
- `<TopBar>` renders <header class="ayy-top-bar"> back + <h1 class="ayy-top-bar__title"> + actions; children go in a __row. Props: `title` ReactNode — the screen's name (an <h1>); `subtitle` ReactNode — a line under it; `backHref` string — the back button is a link there; `onBack` () => void — the back button is a <button> running this; `backLabel` string — the previous screen's name after the chevron; `backAriaLabel` string — the chevron's name when there's no backLabel. Default "Back"; `actions` ReactNode — icon buttons at the end; `center` boolean — centre the title; `large` boolean — a big title under the buttons

**Accessibility**
- The title is the page's <h1>, so a screen reader user knows where they landed after navigating.
- A chevron-only back button is named "Back" (translate it); with a visible name ("Lists") the text names it.
- Icon buttons in __actions each need an aria-label. Keep to three; put the rest in a Menu behind a More button.
- The chevron is directional, so it points right in RTL, where "back" is.

**Do**
- Use it at the top of every phone screen below the tab bar's first level, with a back button to where the user came from.
- Use large on a tab's first screen (Inbox, Notes), plain on the screens pushed from it.
- Put the screen's own search in the __row so it scrolls away with the bar or stays, as you choose.
- Start each section of a settings shell (App shell in settings mode) with one: backHref to the section list, backLabel "Settings", the section's name as the title. Its back button shows on phones only, and on wide screens its title lines up with the section's column.

**Don't**
- Don't use it as a site's header on wide screens — that's the Navbar (or the App shell's sidebar).
- Don't put the brand or navigation links in it; it names the screen.
- Don't add more than three actions.

## Top bar — Back, title with subtitle, actions

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<div style="inline-size: min(100%, 24rem); border: 1px solid var(--ayy-color-line); border-radius: var(--ayy-radius-xl); overflow: hidden">
  <header class="ayy-top-bar">
    <a class="ayy-top-bar__back" href="#lists"><svg class="ayy-icon ayy-icon--directional" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M15 6C15 6 9.00001 10.4189 9 12C8.99999 13.5812 15 18 15 18" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg><span>Lists</span></a>
    <div class="ayy-top-bar__heading">
      <h1 class="ayy-top-bar__title">Groceries</h1>
      <p class="ayy-top-bar__subtitle">8 items, 3 done</p>
    </div>
    <div class="ayy-top-bar__actions">
      <button type="button" class="ayy-button ayy-button--ghost ayy-button--icon" aria-label="Share"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M21 6.5C21 8.15685 19.6569 9.5 18 9.5C16.3431 9.5 15 8.15685 15 6.5C15 4.84315 16.3431 3.5 18 3.5C19.6569 3.5 21 4.84315 21 6.5Z" stroke="currentColor" stroke-width="1.5"></path><path d="M9 12C9 13.6569 7.65685 15 6 15C4.34315 15 3 13.6569 3 12C3 10.3431 4.34315 9 6 9C7.65685 9 9 10.3431 9 12Z" stroke="currentColor" stroke-width="1.5"></path><path d="M21 17.5C21 19.1569 19.6569 20.5 18 20.5C16.3431 20.5 15 19.1569 15 17.5C15 15.8431 16.3431 14.5 18 14.5C19.6569 14.5 21 15.8431 21 17.5Z" stroke="currentColor" stroke-width="1.5"></path><path d="M8.72852 10.7495L15.2285 7.75M8.72852 13.25L15.2285 16.2495" stroke="currentColor" stroke-width="1.5"></path></svg></button>
      <button type="button" class="ayy-button ayy-button--ghost ayy-button--icon" aria-label="More"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6.00449 12.5V12M18.0045 12.5V12M12.0045 12.5V12M7.00449 12.5C7.00449 11.9477 6.55677 11.5 6.00449 11.5C5.4522 11.5 5.00449 11.9477 5.00449 12.5C5.00449 13.0523 5.4522 13.5 6.00449 13.5C6.55677 13.5 7.00449 13.0523 7.00449 12.5ZM19.0045 12.5C19.0045 11.9477 18.5568 11.5 18.0045 11.5C17.4522 11.5 17.0045 11.9477 17.0045 12.5C17.0045 13.0523 17.4522 13.5 18.0045 13.5C18.5568 13.5 19.0045 13.0523 19.0045 12.5ZM13.0045 12.5C13.0045 11.9477 12.5568 11.5 12.0045 11.5C11.4522 11.5 11.0045 11.9477 11.0045 12.5C11.0045 13.0523 11.4522 13.5 12.0045 13.5C12.5568 13.5 13.0045 13.0523 13.0045 12.5Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg></button>
    </div>
  </header>
  <p class="ayy-muted" style="padding: var(--ayy-space-4); margin: 0">The list&#x27;s items go here.</p>
</div>
```

React:

```tsx
import { MoreHorizontalIcon, Share08Icon } from "@hugeicons/core-free-icons";
import { Button, Icon, TopBar } from "@danitesler/ayywi/react";

export default function Example() {
  // A pushed screen: back to the list it came from, its title, two actions. Sticky at the top of its scroll container.
  return (
    <div style={{ inlineSize: "min(100%, 24rem)", border: "1px solid var(--ayy-color-line)", borderRadius: "var(--ayy-radius-xl)", overflow: "hidden" }}>
      <TopBar
        backHref="#lists"
        backLabel="Lists"
        title="Groceries"
        subtitle="8 items, 3 done"
        actions={
          <>
            <Button variant="ghost" size="icon" aria-label="Share">
              <Icon icon={Share08Icon} />
            </Button>
            <Button variant="ghost" size="icon" aria-label="More">
              <Icon icon={MoreHorizontalIcon} />
            </Button>
          </>
        }
      />
      <p className="ayy-muted" style={{ padding: "var(--ayy-space-4)", margin: 0 }}>
        The list's items go here.
      </p>
    </div>
  );
}
```

## Top bar — Large title with a search bar

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<div style="inline-size: min(100%, 24rem); border: 1px solid var(--ayy-color-line); border-radius: var(--ayy-radius-xl); overflow: hidden">
  <header class="ayy-top-bar ayy-top-bar--large">
    <h1 class="ayy-top-bar__title">Inbox</h1>
    <div class="ayy-top-bar__actions">
      <button type="button" class="ayy-button ayy-button--ghost ayy-button--icon" aria-label="New task"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12.001 5.00003V19.002" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M19.002 12.002L4.99998 12.002" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg></button>
    </div>
    <div class="ayy-top-bar__row">
      <form role="search" class="ayy-search-bar">
        <div class="ayy-search-bar__field">
          <svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M17 17L21 21" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19C15.4183 19 19 15.4183 19 11Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg>
          <input type="search" enterkeyhint="search" class="ayy-search-bar__input" aria-label="Search tasks" placeholder="Search tasks" />
          <button type="button" class="ayy-search-bar__clear" aria-label="Clear search"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M18 6L6.00081 17.9992M17.9992 18L6 6.00085" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg></button>
        </div>
      </form>
    </div>
  </header>
  <p class="ayy-muted" style="padding: var(--ayy-space-4); margin: 0">12 tasks</p>
</div>
```

React:

```tsx
import { Add01Icon } from "@hugeicons/core-free-icons";
import { Button, Icon, SearchBar, TopBar } from "@danitesler/ayywi/react";

export default function Example() {
  // A tab's first screen: a big title under the actions, and a search bar as the bar's second row.
  return (
    <div style={{ inlineSize: "min(100%, 24rem)", border: "1px solid var(--ayy-color-line)", borderRadius: "var(--ayy-radius-xl)", overflow: "hidden" }}>
      <TopBar
        large
        title="Inbox"
        actions={
          <Button variant="ghost" size="icon" aria-label="New task">
            <Icon icon={Add01Icon} />
          </Button>
        }
      >
        <SearchBar placeholder="Search tasks" label="Search tasks" />
      </TopBar>
      <p className="ayy-muted" style={{ padding: "var(--ayy-space-4)", margin: 0 }}>
        12 tasks
      </p>
    </div>
  );
}
```

## Top bar — Centred title

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<div style="inline-size: min(100%, 24rem); border: 1px solid var(--ayy-color-line); border-radius: var(--ayy-radius-xl); overflow: hidden">
  <header class="ayy-top-bar ayy-top-bar--center">
    <a class="ayy-top-bar__back" href="#task" aria-label="Back"><svg class="ayy-icon ayy-icon--directional" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M15 6C15 6 9.00001 10.4189 9 12C8.99999 13.5812 15 18 15 18" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg></a>
    <h1 class="ayy-top-bar__title">Edit task</h1>
    <div class="ayy-top-bar__actions">
      <button type="button" class="ayy-button ayy-button--ghost ayy-button--sm">Save</button>
    </div>
  </header>
  <p class="ayy-muted" style="padding: var(--ayy-space-4); margin: 0">The form goes here.</p>
</div>
```

React:

```tsx
import { Button, TopBar } from "@danitesler/ayywi/react";

export default function Example() {
  // Centred title, as on iOS: back on one side, the screen's action on the other.
  return (
    <div style={{ inlineSize: "min(100%, 24rem)", border: "1px solid var(--ayy-color-line)", borderRadius: "var(--ayy-radius-xl)", overflow: "hidden" }}>
      <TopBar
        center
        title="Edit task"
        backHref="#task"
        actions={
          <Button variant="ghost" size="sm">
            Save
          </Button>
        }
      />
      <p className="ayy-muted" style={{ padding: "var(--ayy-space-4)", margin: 0 }}>
        The form goes here.
      </p>
    </div>
  );
}
```

---
Part of @danitesler/ayywi 0.0.1: load `dist/ayywi.min.css` (and `dist/elements.global.js` for the <ayy-*> elements). The rules every screen follows: [llms-full.txt#rules](../llms-full.txt#rules). Every component: [llms.txt](../llms.txt).
