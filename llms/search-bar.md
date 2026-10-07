# Search bar

Category: Forms. A rounded search field with a magnifier and a clear button, and optionally a Cancel button after it, as at the top of a phone list. A <form role="search"> around an <input type="search">, so phones show a Search key. The clear button only shows while there's text. Also called: search-bar, searchbar, search, search-box, searchbox, search-field.

**Classes**
- `.ayy-search-bar` — Root: a <form role="search"> holding the field and an optional Cancel.
- `.ayy-search-bar--lg` — Taller field and text, for a search screen.
- `.ayy-search-bar__field` — The pill: a magnifier icon, the input and the clear button. The focus ring goes around it.
- `.ayy-search-bar__input` — <input type="search" enterkeyhint="search" aria-label placeholder>. Needs a placeholder: the clear button hides while it shows.
- `.ayy-search-bar__clear` — A button after the input with an × and aria-label="Clear search". Hidden while the field is empty; @danitesler/ayywi/elements empties the field on click and fires input.
- `.ayy-search-bar__cancel` — A text button after the field that ends the search ("Cancel").

**States**
- `default` — A pill-shaped wash-hover field with a muted magnifier and placeholder; the clear button and Cancel only show when there's something to clear or cancel.
- `hover` (`.ayy-search-bar__clear:hover, .ayy-search-bar__cancel:hover (devices that hover)`) — The clear button gets a wash; Cancel's text softens.
- `pressed` — doesn't apply: No pressed look; the clear button empties the field and Cancel ends the search at once.
- `focus` (`.ayy-search-bar__field:has(> .ayy-search-bar__input:focus-visible); :focus-visible on the buttons`) — A 2px ring around the pill; the clear and Cancel buttons get their own ring.
- `disabled` — doesn't apply: Don't disable search: an empty list still takes a query. Hide the bar if search doesn't apply to the screen.
- `selected` — doesn't apply: Nothing to select. Results are a list under it.
- `error` — doesn't apply: Any text is a valid query. When nothing matches, show an Empty state under it.
- `loading` — doesn't apply: No loading look in the field. Show a Skeleton or Spinner where the results appear.
- `typing` (`.ayy-search-bar__input:not(:placeholder-shown)`) — The clear button shows at the inline end (the input needs a placeholder for this).

**Sizes**
- `md` (default) — The md control height (32px compact, 40 comfortable, 44 touch).
- `lg` — The lg control height (40px compact, 48 comfortable, 52 touch), larger text: the top of a phone list.
- Density — The field height follows data-density (the heights above).
- Width — The field fills its row; Cancel takes its own width after it.

**JS (framework-free)**: searchBarClass({ size?, className? }) → string; clearSearchBar(button) empties the field a clear button belongs to, fires input and focuses it (@danitesler/ayywi/elements does it for every clear button); searchBarIcon, searchBarClearIcon (SVG markup).

**React** — `import { SearchBar } from "@danitesler/ayywi/react";`
- `<SearchBar>` renders <form role="search" class="ayy-search-bar"><div class="ayy-search-bar__field">… <input type="search" class="ayy-search-bar__input"> …</div></form>; other props go on the input. Props: `value / defaultValue` string; `onValueChange` (value: string) => void — every keystroke, and "" when cleared; `onSearch` (value: string) => void — Enter / the Search key; `onCancel` () => void — shows a Cancel button that runs it; `label` string — the input's name. Default "Search"; `clearLabel` string — default "Clear search"; `cancelText` string — default "Cancel"; `size` "md" | "lg"; `formProps` FormHTMLAttributes — props for the <form>

**Accessibility**
- role="search" makes the form a search landmark. Name the input (aria-label, or a <label>) by what it searches ("Search tasks").
- The clear button is a real button named "Clear search"; clearing puts focus back in the field.
- Esc in a type="search" input clears it in most browsers; Cancel is for leaving the search, not clearing it.
- Results that update as you type should say how many there are in a polite live region.

**Do**
- Use it at the top of a phone list or a search screen; filter as people type (onValueChange) or on Enter (onSearch).
- Say what it searches in the placeholder and the label ("Search notes").
- Put it in a Top bar's second row on a list's first screen.

**Don't**
- Don't use it as a form field for a value — use an Input or a Combobox.
- Don't use it for a whole-app ⌘K search on desktop — that's the Command palette.
- Don't remove the placeholder: the clear button relies on it.

## Search bar — Empty and with text

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<!-- The clear button shows while there's text (it reads the placeholder); @danitesler/ayywi/elements makes it clear the field. -->
<div class="ayy-stack" style="inline-size: min(100%, 24rem)">
  <form role="search" class="ayy-search-bar">
    <div class="ayy-search-bar__field">
      <svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M17 17L21 21" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19C15.4183 19 19 15.4183 19 11Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg>
      <input type="search" enterkeyhint="search" class="ayy-search-bar__input" aria-label="Search tasks" placeholder="Search tasks" />
      <button type="button" class="ayy-search-bar__clear" aria-label="Clear search"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M18 6L6.00081 17.9992M17.9992 18L6 6.00085" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg></button>
    </div>
  </form>
  <form role="search" class="ayy-search-bar">
    <div class="ayy-search-bar__field">
      <svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M17 17L21 21" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19C15.4183 19 19 15.4183 19 11Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg>
      <input type="search" enterkeyhint="search" class="ayy-search-bar__input" aria-label="Search tasks" placeholder="Search tasks" value="milk" />
      <button type="button" class="ayy-search-bar__clear" aria-label="Clear search"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M18 6L6.00081 17.9992M17.9992 18L6 6.00085" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg></button>
    </div>
  </form>
</div>
```

React:

```tsx
import { SearchBar } from "@danitesler/ayywi/react";

export default function Example() {
  return (
    <div className="ayy-stack" style={{ inlineSize: "min(100%, 24rem)" }}>
      <SearchBar placeholder="Search tasks" label="Search tasks" />
      <SearchBar placeholder="Search tasks" label="Search tasks" defaultValue="milk" />
    </div>
  );
}
```

## Search bar — Large, with Cancel

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<div style="inline-size: min(100%, 24rem)">
  <form role="search" class="ayy-search-bar ayy-search-bar--lg">
    <div class="ayy-search-bar__field">
      <svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M17 17L21 21" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19C15.4183 19 19 15.4183 19 11Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg>
      <input type="search" enterkeyhint="search" class="ayy-search-bar__input" aria-label="Search notes" placeholder="Search notes" value="trip" />
      <button type="button" class="ayy-search-bar__clear" aria-label="Clear search"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M18 6L6.00081 17.9992M17.9992 18L6 6.00085" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg></button>
    </div>
    <button type="button" class="ayy-search-bar__cancel">Cancel</button>
  </form>
</div>
```

React:

```tsx
import { SearchBar } from "@danitesler/ayywi/react";

export default function Example() {
  // While searching on a phone: Cancel ends the search and goes back to the list.
  return (
    <div style={{ inlineSize: "min(100%, 24rem)" }}>
      <SearchBar size="lg" placeholder="Search notes" label="Search notes" defaultValue="trip" onCancel={() => {}} />
    </div>
  );
}
```

---
Part of @danitesler/ayywi 0.0.1: load `dist/ayywi.min.css` (and `dist/elements.global.js` for the <ayy-*> elements). The rules every screen follows: [llms-full.txt#rules](../llms-full.txt#rules). Every component: [llms.txt](../llms.txt).
