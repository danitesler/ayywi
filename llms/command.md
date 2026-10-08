# Command palette

Category: Actions. A search field over a grouped list of actions and places: type to filter, arrows to move, Enter to run. Inline in a page or popover, or as a dialog near the top of the screen opened with ⌘K / Ctrl+K. Items can show an icon, a shortcut and a count. Also called: command, command-palette, cmdk, command-menu, quick-switcher, quick-open.

**Classes**
- `.ayy-command` — Root: a card with the search field, the list and an optional footer. On a <div> inline, or with ayy-dialog on a <dialog> for the ⌘K palette (top-aligned, no padding).
- `.ayy-command__search` — The row with the magnifier icon and the input, over a hairline. A ring under it while the input has keyboard focus.
- `.ayy-command__input` — <input type="search" role="combobox" aria-expanded="true" aria-controls="<list id>" aria-autocomplete="list" aria-label>. Keeps focus; aria-activedescendant points at the highlighted item.
- `.ayy-command__list` — role="listbox" with an id and aria-label; scrolls when long.
- `.ayy-command__group` — role="group" aria-labelledby its label. Hidden when none of its items match.
- `.ayy-command__label` — A group's name ("Go to"), muted, role="presentation" with an id.
- `.ayy-command__item` — role="option" with an id: an icon, the text, then a __meta. aria-selected="true" on the highlighted one; data-value is what it runs, data-keywords more words that find it.
- `.ayy-command__meta` — At an item's end: a .ayy-shortcut, a list name or a count, muted.
- `.ayy-command__empty` — "No results", shown only when nothing matches (hidden otherwise).
- `.ayy-command__footer` — Under the list after a hairline: key hints (↑↓ to move, ↵ to run) or a link.

**States**
- `default` — A raised card: a search field with a magnifier over a hairline, then labelled groups of items with an icon, a label and muted meta at the end.
- `hover` — doesn't apply: Items have no separate hover look: moving the pointer over an item selects it (see selected), so the pointer and the arrow keys never show two items at once.
- `pressed` — doesn't apply: No pressed look: clicking or Enter runs the item and usually closes the palette.
- `focus` (`.ayy-command__search:has(> .ayy-command__input:focus-visible)`) — A 2px ring under the field. Focus stays in the input while the arrow keys move the selection. Forced colours: Highlight outline.
- `disabled` (`.ayy-command__item[aria-disabled="true"]`) — Dimmed to --ayy-opacity-disabled with a not-allowed cursor; the arrow keys skip it.
- `selected` (`.ayy-command__item[aria-selected="true"]`) — The item under the arrow keys or the pointer gets the wash-hover background and a full-colour icon. Forced colours: Highlight fill.
- `error` — doesn't apply: Nothing to validate. If running an item fails, close the palette and say so in a toast.
- `loading` — doesn't apply: No loading look. While results load, show .ayy-command__empty with "Searching…".
- `empty` (`.ayy-command__empty shown`) — A muted, centred "No results" line when the filter hides every item.
- `filtered` (`.ayy-command__item[hidden], .ayy-command__group[hidden]`) — Items that don't match the typed text are hidden, and so is a group with none left.

**Sizes**
- Density — Items are the md control height (32px compact, 40 comfortable, 44 touch); the field is the lg height.
- Width — Inline it fills its container. As a dialog (ayy-dialog ayy-command) it's 36rem wide, at most the viewport less 2rem, near the top of the screen; the list scrolls past 24rem.

**JS (framework-free)**: connectCommand(root, { onSelect?, filter? }) → { refresh, reset, destroy } wires filtering, the arrows, Enter and the pointer on plain markup; Enter clicks the highlighted item. commandMatches(text, query) is the matching rule (every typed word starts a word, or one word anywhere); commandItemText(item). commandClass, commandInputClass, commandListClass, commandItemClass, commandSearchIcon (SVG markup).

**Custom element** `<ayy-command>` (@danitesler/ayywi/elements) — 
- attribute `shortcut`: Opens and closes the dialog palette from anywhere. Default "Mod+K" (⌘K, Ctrl+K); "" for none.
- attribute `manual`: Don't filter: you change the items yourself on "input" (a search API), then call refresh().
- event `ayy-select`: { value, item } when an item runs: its data-value and the element.

**React** — `import { Command, CommandDialog, CommandGroup, CommandItem } from "@danitesler/ayywi/react";`
- `<Command>` renders <div class="ayy-command"> search field, <div role="listbox" class="ayy-command__list">{children}</div>, footer. Props: `label` string — the field's and list's accessible name. Default "Search commands"; `placeholder` string — default "Type a command or search…"; `emptyText` ReactNode — when nothing matches. Default "No results"; `footer` ReactNode — key hints under the list; `filter` boolean — filter by the typed text. Default true; `onSearchChange` (text: string) => void — every keystroke (fetch results here with filter={false}); `onRun` (value?: string) => void — after an item runs, with its value; `inputProps` InputHTMLAttributes — more props for the <input>
- `<CommandDialog>` renders <dialog class="ayy-dialog ayy-command" aria-label> with the same parts; closes when an item runs. Props: `open / defaultOpen / onOpenChange` Like Dialog; `shortcut` string | null — toggles it from anywhere. Default "Mod+K"; `label / placeholder / emptyText / footer / filter / onSearchChange / onRun / inputProps` As on Command; `className` string — on the <dialog>
- `<CommandGroup>` renders <div class="ayy-command__group" role="group"> with an .ayy-command__label. Props: `heading` ReactNode — the group's name
- `<CommandItem>` renders <div class="ayy-command__item" role="option" data-value data-keywords>. Props: `onSelect` () => void — runs on Enter or a click; `value` string — passed to onRun; `keywords` string — more words that find it; `icon` ReactNode — an Icon before the text; `shortcut` string — its shortcut at the end ("Mod+N"); `meta` ReactNode — other text at the end: a count, a list name; `disabled` boolean — dimmed, skipped by the arrows

**Accessibility**
- The WAI-ARIA combobox pattern with a listbox that is always shown: focus stays in the input, aria-activedescendant names the highlighted item, and the first match is highlighted as you type.
- Up/Down move (wrapping), PageUp/PageDown move five, Enter runs the highlighted item, Esc clears the field and a second Esc closes the dialog.
- Groups are role="group" named by their heading, so screen readers say "Go to" when the highlight enters one.
- Shortcuts in items are read as words ("Command N"); icons are hidden.
- The dialog palette is a modal <dialog> named by aria-label; focus goes to the input when it opens and back to the trigger when it closes.

**Do**
- Offer one in any app with more than a handful of screens or actions, on ⌘K / Ctrl+K, and show the shortcut on a Search button so people find it.
- Group items by what they do (Create, Go to, Appearance) and keep labels verb-first ("New task", "Switch theme").
- Add keywords for the words people might type instead ("preferences" for Settings).
- Show each item's own shortcut at its end so the palette teaches them.

**Don't**
- Don't make it the only way to reach something; it's a shortcut, not navigation.
- Don't put form controls inside items; an item runs one thing.
- Don't use it to pick a value for a field — that's a Combobox.

## Command palette — Inline palette with groups and shortcuts

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<!-- <ayy-command> filters as you type and fires "ayy-select" with { value } when an item runs. -->
<ayy-command>
  <div class="ayy-command" style="max-inline-size: 32rem">
    <div class="ayy-command__search">
      <svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M17 17L21 21" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19C15.4183 19 19 15.4183 19 11Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg>
      <input type="search" class="ayy-command__input" role="combobox" aria-expanded="true" aria-controls="cmd-palette-1-html" aria-autocomplete="list" aria-label="Search commands" placeholder="Type a command or search…" autoComplete="off" spellCheck="false" />
    </div>
    <div id="cmd-palette-1-html" class="ayy-command__list" role="listbox" aria-label="Search commands">
      <div class="ayy-command__group" role="group" aria-labelledby="cmd-palette-2-html">
        <div id="cmd-palette-2-html" class="ayy-command__label" role="presentation">Create</div>
        <div id="cmd-palette-3-html" class="ayy-command__item" role="option" data-value="new-task" data-keywords="add todo"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12.001 5.00003V19.002" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M19.002 12.002L4.99998 12.002" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg>New task<span class="ayy-command__meta"><span class="ayy-shortcut" data-keys="Mod+N"><span class="ayy-sr-only">Ctrl N</span><kbd class="ayy-kbd" aria-hidden="true">Ctrl</kbd><kbd class="ayy-kbd" aria-hidden="true">N</kbd></span></span></div>
        <div id="cmd-palette-4-html" class="ayy-command__item" role="option" data-value="new-note" data-keywords="add page"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M16.5 2V5M7.5 2V5M12 2V5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M13 3.5H11C7.70017 3.5 6.05025 3.5 5.02513 4.52513C4 5.55025 4 7.20017 4 10.5V15C4 18.2998 4 19.9497 5.02513 20.9749C6.05025 22 7.70017 22 11 22H13C16.2998 22 17.9497 22 18.9749 20.9749C20 19.9497 20 18.2998 20 15V10.5C20 7.20017 20 5.55025 18.9749 4.52512C17.9497 3.5 16.2998 3.5 13 3.5Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M8 15H12M8 11H16" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg>New note<span class="ayy-command__meta"><span class="ayy-shortcut" data-keys="Mod+Shift+N"><span class="ayy-sr-only">Ctrl Shift N</span><kbd class="ayy-kbd" aria-hidden="true">Ctrl</kbd><kbd class="ayy-kbd" aria-hidden="true">Shift</kbd><kbd class="ayy-kbd" aria-hidden="true">N</kbd></span></span></div>
        <div id="cmd-palette-5-html" class="ayy-command__item" role="option" data-value="new-tag"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="1.5" cy="1.5" r="1.5" transform="matrix(1 0 0 -1 16 8.00024)" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></circle><path d="M2.77423 11.1439C1.77108 12.2643 1.7495 13.9546 2.67016 15.1437C4.49711 17.5033 6.49674 19.5029 8.85633 21.3298C10.0454 22.2505 11.7357 22.2289 12.8561 21.2258C15.8979 18.5022 18.6835 15.6559 21.3719 12.5279C21.6377 12.2187 21.8039 11.8397 21.8412 11.4336C22.0062 9.63798 22.3452 4.46467 20.9403 3.05974C19.5353 1.65481 14.362 1.99377 12.5664 2.15876C12.1603 2.19608 11.7813 2.36233 11.472 2.62811C8.34412 5.31646 5.49781 8.10211 2.77423 11.1439Z" stroke="currentColor" stroke-width="1.5"></path><path d="M7.00002 14.0002L10 17.0002" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg>New tag</div>
      </div>
      <div class="ayy-command__group" role="group" aria-labelledby="cmd-palette-6-html">
        <div id="cmd-palette-6-html" class="ayy-command__label" role="presentation">Go to</div>
        <div id="cmd-palette-7-html" class="ayy-command__item" role="option" data-value="today"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M17 12C17 14.7614 14.7614 17 12 17C9.23858 17 7 14.7614 7 12C7 9.23858 9.23858 7 12 7C14.7614 7 17 9.23858 17 12Z" stroke="currentColor" stroke-width="1.5"></path><path d="M12 2V3.5M12 20.5V22M19.0708 19.0713L18.0101 18.0106M5.98926 5.98926L4.9286 4.9286M22 12H20.5M3.5 12H2M19.0713 4.92871L18.0106 5.98937M5.98975 18.0107L4.92909 19.0714" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path></svg>Today<span class="ayy-command__meta">4</span></div>
        <div id="cmd-palette-8-html" class="ayy-command__item" role="option" data-value="inbox"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M2.5 12C2.5 7.52166 2.5 5.28249 3.89124 3.89124C5.28249 2.5 7.52166 2.5 12 2.5C16.4783 2.5 18.7175 2.5 20.1088 3.89124C21.5 5.28249 21.5 7.52166 21.5 12C21.5 16.4783 21.5 18.7175 20.1088 20.1088C18.7175 21.5 16.4783 21.5 12 21.5C7.52166 21.5 5.28249 21.5 3.89124 20.1088C2.5 18.7175 2.5 16.4783 2.5 12Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M21.5 13.5H16.5743C15.7322 13.5 15.0706 14.2036 14.6995 14.9472C14.2963 15.7551 13.4889 16.5 12 16.5C10.5111 16.5 9.70373 15.7551 9.30054 14.9472C8.92942 14.2036 8.26777 13.5 7.42566 13.5H2.5" stroke="currentColor" stroke-linejoin="round" stroke-width="1.5"></path></svg>Inbox<span class="ayy-command__meta">12</span></div>
        <div id="cmd-palette-9-html" class="ayy-command__item" role="option" data-value="settings" data-keywords="preferences options"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M21.3175 7.14139L20.8239 6.28479C20.4506 5.63696 20.264 5.31305 19.9464 5.18388C19.6288 5.05472 19.2696 5.15664 18.5513 5.36048L17.3311 5.70418C16.8725 5.80994 16.3913 5.74994 15.9726 5.53479L15.6357 5.34042C15.2766 5.11043 15.0004 4.77133 14.8475 4.37274L14.5136 3.37536C14.294 2.71534 14.1842 2.38533 13.9228 2.19657C13.6615 2.00781 13.3143 2.00781 12.6199 2.00781H11.5051C10.8108 2.00781 10.4636 2.00781 10.2022 2.19657C9.94085 2.38533 9.83106 2.71534 9.61149 3.37536L9.27753 4.37274C9.12465 4.77133 8.84845 5.11043 8.48937 5.34042L8.15249 5.53479C7.73374 5.74994 7.25259 5.80994 6.79398 5.70418L5.57375 5.36048C4.85541 5.15664 4.49625 5.05472 4.17867 5.18388C3.86109 5.31305 3.67445 5.63696 3.30115 6.28479L2.80757 7.14139C2.45766 7.74864 2.2827 8.05227 2.31666 8.37549C2.35061 8.69871 2.58483 8.95918 3.05326 9.48012L4.0843 10.6328C4.3363 10.9518 4.51521 11.5078 4.51521 12.0077C4.51521 12.5078 4.33636 13.0636 4.08433 13.3827L3.05326 14.5354C2.58483 15.0564 2.35062 15.3168 2.31666 15.6401C2.2827 15.9633 2.45766 16.2669 2.80757 16.8741L3.30114 17.7307C3.67443 18.3785 3.86109 18.7025 4.17867 18.8316C4.49625 18.9608 4.85542 18.8589 5.57377 18.655L6.79394 18.3113C7.25263 18.2055 7.73387 18.2656 8.15267 18.4808L8.4895 18.6752C8.84851 18.9052 9.12464 19.2442 9.2775 19.6428L9.61149 20.6403C9.83106 21.3003 9.94085 21.6303 10.2022 21.8191C10.4636 22.0078 10.8108 22.0078 11.5051 22.0078H12.6199C13.3143 22.0078 13.6615 22.0078 13.9228 21.8191C14.1842 21.6303 14.294 21.3003 14.5136 20.6403L14.8476 19.6428C15.0004 19.2442 15.2765 18.9052 15.6356 18.6752L15.9724 18.4808C16.3912 18.2656 16.8724 18.2055 17.3311 18.3113L18.5513 18.655C19.2696 18.8589 19.6288 18.9608 19.9464 18.8316C20.264 18.7025 20.4506 18.3785 20.8239 17.7307L21.3175 16.8741C21.6674 16.2669 21.8423 15.9633 21.8084 15.6401C21.7744 15.3168 21.5402 15.0564 21.0718 14.5354L20.0407 13.3827C19.7887 13.0636 19.6098 12.5078 19.6098 12.0077C19.6098 11.5078 19.7888 10.9518 20.0407 10.6328L21.0718 9.48012C21.5402 8.95918 21.7744 8.69871 21.8084 8.37549C21.8423 8.05227 21.6674 7.74864 21.3175 7.14139Z" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path><path d="M15.5195 12C15.5195 13.933 13.9525 15.5 12.0195 15.5C10.0865 15.5 8.51953 13.933 8.51953 12C8.51953 10.067 10.0865 8.5 12.0195 8.5C13.9525 8.5 15.5195 10.067 15.5195 12Z" stroke="currentColor" stroke-width="1.5"></path></svg>Settings<span class="ayy-command__meta"><span class="ayy-shortcut" data-keys="Mod+,"><span class="ayy-sr-only">Ctrl ,</span><kbd class="ayy-kbd" aria-hidden="true">Ctrl</kbd><kbd class="ayy-kbd" aria-hidden="true">,</kbd></span></span></div>
      </div>
      <div class="ayy-command__group" role="group" aria-labelledby="cmd-palette-10-html">
        <div id="cmd-palette-10-html" class="ayy-command__label" role="presentation">Appearance</div>
        <div id="cmd-palette-11-html" class="ayy-command__item" role="option" data-value="theme" data-keywords="dark light mode"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M21.5 14.0784C20.3003 14.7189 18.9301 15.0821 17.4751 15.0821C12.7491 15.0821 8.91792 11.2509 8.91792 6.52485C8.91792 5.06986 9.28105 3.69968 9.92163 2.5C5.66765 3.49698 2.5 7.31513 2.5 11.8731C2.5 17.1899 6.8101 21.5 12.1269 21.5C16.6849 21.5 20.503 18.3324 21.5 14.0784Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg>Switch theme</div>
      </div>
      <div class="ayy-command__empty" role="presentation" hidden="">No results</div>
    </div>
    <div class="ayy-command__footer"><span><kbd class="ayy-kbd">↑</kbd> <kbd class="ayy-kbd">↓</kbd> to move</span><span><kbd class="ayy-kbd">↵</kbd> to run</span></div>
  </div>
</ayy-command>
```

React:

```tsx
import { Add01Icon, InboxIcon, Moon02Icon, Note01Icon, Settings01Icon, Sun03Icon, Tag01Icon } from "@hugeicons/core-free-icons";
import { Command, CommandGroup, CommandItem, Icon, Kbd } from "@danitesler/ayywi/react";

export default function Example() {
  return (
    <Command
      style={{ maxInlineSize: "32rem" }}
      label="Search commands"
      footer={
        <>
          <span>
            <Kbd>↑</Kbd> <Kbd>↓</Kbd> to move
          </span>
          <span>
            <Kbd>↵</Kbd> to run
          </span>
        </>
      }
    >
      <CommandGroup heading="Create">
        <CommandItem value="new-task" keywords="add todo" icon={<Icon icon={Add01Icon} />} shortcut="Mod+N">
          New task
        </CommandItem>
        <CommandItem value="new-note" keywords="add page" icon={<Icon icon={Note01Icon} />} shortcut="Mod+Shift+N">
          New note
        </CommandItem>
        <CommandItem value="new-tag" icon={<Icon icon={Tag01Icon} />}>
          New tag
        </CommandItem>
      </CommandGroup>
      <CommandGroup heading="Go to">
        <CommandItem value="today" icon={<Icon icon={Sun03Icon} />} meta="4">
          Today
        </CommandItem>
        <CommandItem value="inbox" icon={<Icon icon={InboxIcon} />} meta="12">
          Inbox
        </CommandItem>
        <CommandItem value="settings" keywords="preferences options" icon={<Icon icon={Settings01Icon} />} shortcut="Mod+,">
          Settings
        </CommandItem>
      </CommandGroup>
      <CommandGroup heading="Appearance">
        <CommandItem value="theme" keywords="dark light mode" icon={<Icon icon={Moon02Icon} />}>
          Switch theme
        </CommandItem>
      </CommandGroup>
    </Command>
  );
}
```

## Command palette — ⌘K dialog

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<!-- <ayy-command> opens its dialog from [data-ayy-open] or with ⌘K / Ctrl+K, and fires "ayy-select" with { value }. -->
<ayy-command shortcut="Mod+K">
  <button type="button" class="ayy-button ayy-button--outline" aria-haspopup="dialog" data-ayy-open=""><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M17 17L21 21" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19C15.4183 19 19 15.4183 19 11Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg>Search<span class="ayy-shortcut" data-keys="Mod+K"><span class="ayy-sr-only">Ctrl K</span><kbd class="ayy-kbd" aria-hidden="true">Ctrl</kbd><kbd class="ayy-kbd" aria-hidden="true">K</kbd></span></button>
  <dialog class="ayy-dialog ayy-command" aria-label="Search commands">
    <div class="ayy-command__search">
      <svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M17 17L21 21" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19C15.4183 19 19 15.4183 19 11Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg>
      <input type="search" class="ayy-command__input" role="combobox" aria-expanded="true" aria-controls="cmd-dialog-1-html" aria-autocomplete="list" aria-label="Search commands" placeholder="Search or jump to…" autoComplete="off" spellCheck="false" />
    </div>
    <div id="cmd-dialog-1-html" class="ayy-command__list" role="listbox" aria-label="Search commands">
      <div class="ayy-command__group" role="group" aria-labelledby="cmd-dialog-2-html">
        <div id="cmd-dialog-2-html" class="ayy-command__label" role="presentation">Go to</div>
        <div id="cmd-dialog-3-html" class="ayy-command__item" role="option" data-value="today"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M17 12C17 14.7614 14.7614 17 12 17C9.23858 17 7 14.7614 7 12C7 9.23858 9.23858 7 12 7C14.7614 7 17 9.23858 17 12Z" stroke="currentColor" stroke-width="1.5"></path><path d="M12 2V3.5M12 20.5V22M19.0708 19.0713L18.0101 18.0106M5.98926 5.98926L4.9286 4.9286M22 12H20.5M3.5 12H2M19.0713 4.92871L18.0106 5.98937M5.98975 18.0107L4.92909 19.0714" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path></svg>Today</div>
        <div id="cmd-dialog-4-html" class="ayy-command__item" role="option" data-value="inbox"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M2.5 12C2.5 7.52166 2.5 5.28249 3.89124 3.89124C5.28249 2.5 7.52166 2.5 12 2.5C16.4783 2.5 18.7175 2.5 20.1088 3.89124C21.5 5.28249 21.5 7.52166 21.5 12C21.5 16.4783 21.5 18.7175 20.1088 20.1088C18.7175 21.5 16.4783 21.5 12 21.5C7.52166 21.5 5.28249 21.5 3.89124 20.1088C2.5 18.7175 2.5 16.4783 2.5 12Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M21.5 13.5H16.5743C15.7322 13.5 15.0706 14.2036 14.6995 14.9472C14.2963 15.7551 13.4889 16.5 12 16.5C10.5111 16.5 9.70373 15.7551 9.30054 14.9472C8.92942 14.2036 8.26777 13.5 7.42566 13.5H2.5" stroke="currentColor" stroke-linejoin="round" stroke-width="1.5"></path></svg>Inbox<span class="ayy-command__meta">12</span></div>
        <div id="cmd-dialog-5-html" class="ayy-command__item" role="option" data-value="settings" data-keywords="preferences"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M21.3175 7.14139L20.8239 6.28479C20.4506 5.63696 20.264 5.31305 19.9464 5.18388C19.6288 5.05472 19.2696 5.15664 18.5513 5.36048L17.3311 5.70418C16.8725 5.80994 16.3913 5.74994 15.9726 5.53479L15.6357 5.34042C15.2766 5.11043 15.0004 4.77133 14.8475 4.37274L14.5136 3.37536C14.294 2.71534 14.1842 2.38533 13.9228 2.19657C13.6615 2.00781 13.3143 2.00781 12.6199 2.00781H11.5051C10.8108 2.00781 10.4636 2.00781 10.2022 2.19657C9.94085 2.38533 9.83106 2.71534 9.61149 3.37536L9.27753 4.37274C9.12465 4.77133 8.84845 5.11043 8.48937 5.34042L8.15249 5.53479C7.73374 5.74994 7.25259 5.80994 6.79398 5.70418L5.57375 5.36048C4.85541 5.15664 4.49625 5.05472 4.17867 5.18388C3.86109 5.31305 3.67445 5.63696 3.30115 6.28479L2.80757 7.14139C2.45766 7.74864 2.2827 8.05227 2.31666 8.37549C2.35061 8.69871 2.58483 8.95918 3.05326 9.48012L4.0843 10.6328C4.3363 10.9518 4.51521 11.5078 4.51521 12.0077C4.51521 12.5078 4.33636 13.0636 4.08433 13.3827L3.05326 14.5354C2.58483 15.0564 2.35062 15.3168 2.31666 15.6401C2.2827 15.9633 2.45766 16.2669 2.80757 16.8741L3.30114 17.7307C3.67443 18.3785 3.86109 18.7025 4.17867 18.8316C4.49625 18.9608 4.85542 18.8589 5.57377 18.655L6.79394 18.3113C7.25263 18.2055 7.73387 18.2656 8.15267 18.4808L8.4895 18.6752C8.84851 18.9052 9.12464 19.2442 9.2775 19.6428L9.61149 20.6403C9.83106 21.3003 9.94085 21.6303 10.2022 21.8191C10.4636 22.0078 10.8108 22.0078 11.5051 22.0078H12.6199C13.3143 22.0078 13.6615 22.0078 13.9228 21.8191C14.1842 21.6303 14.294 21.3003 14.5136 20.6403L14.8476 19.6428C15.0004 19.2442 15.2765 18.9052 15.6356 18.6752L15.9724 18.4808C16.3912 18.2656 16.8724 18.2055 17.3311 18.3113L18.5513 18.655C19.2696 18.8589 19.6288 18.9608 19.9464 18.8316C20.264 18.7025 20.4506 18.3785 20.8239 17.7307L21.3175 16.8741C21.6674 16.2669 21.8423 15.9633 21.8084 15.6401C21.7744 15.3168 21.5402 15.0564 21.0718 14.5354L20.0407 13.3827C19.7887 13.0636 19.6098 12.5078 19.6098 12.0077C19.6098 11.5078 19.7888 10.9518 20.0407 10.6328L21.0718 9.48012C21.5402 8.95918 21.7744 8.69871 21.8084 8.37549C21.8423 8.05227 21.6674 7.74864 21.3175 7.14139Z" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path><path d="M15.5195 12C15.5195 13.933 13.9525 15.5 12.0195 15.5C10.0865 15.5 8.51953 13.933 8.51953 12C8.51953 10.067 10.0865 8.5 12.0195 8.5C13.9525 8.5 15.5195 10.067 15.5195 12Z" stroke="currentColor" stroke-width="1.5"></path></svg>Settings<span class="ayy-command__meta"><span class="ayy-shortcut" data-keys="Mod+,"><span class="ayy-sr-only">Ctrl ,</span><kbd class="ayy-kbd" aria-hidden="true">Ctrl</kbd><kbd class="ayy-kbd" aria-hidden="true">,</kbd></span></span></div>
      </div>
      <div class="ayy-command__group" role="group" aria-labelledby="cmd-dialog-6-html">
        <div id="cmd-dialog-6-html" class="ayy-command__label" role="presentation">Create</div>
        <div id="cmd-dialog-7-html" class="ayy-command__item" role="option" data-value="new-task" data-keywords="add todo"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12.001 5.00003V19.002" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M19.002 12.002L4.99998 12.002" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg>New task<span class="ayy-command__meta"><span class="ayy-shortcut" data-keys="Mod+N"><span class="ayy-sr-only">Ctrl N</span><kbd class="ayy-kbd" aria-hidden="true">Ctrl</kbd><kbd class="ayy-kbd" aria-hidden="true">N</kbd></span></span></div>
      </div>
      <div class="ayy-command__empty" role="presentation" hidden="">No results</div>
    </div>
    <div class="ayy-command__footer"><span><kbd class="ayy-kbd">↑</kbd> <kbd class="ayy-kbd">↓</kbd> to move</span><span><kbd class="ayy-kbd">↵</kbd> to run</span><span><kbd class="ayy-kbd">esc</kbd> to close</span></div>
  </dialog>
</ayy-command>
```

React:

```tsx
import { Add01Icon, InboxIcon, Search01Icon, Settings01Icon, Sun03Icon } from "@hugeicons/core-free-icons";
import { useState } from "react";
import { Button, CommandDialog, CommandGroup, CommandItem, Icon, Kbd, Shortcut } from "@danitesler/ayywi/react";

export default function Example() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="outline" aria-haspopup="dialog" onClick={() => setOpen(true)}>
        <Icon icon={Search01Icon} />
        Search
        <Shortcut keys="Mod+K" />
      </Button>
      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        placeholder="Search or jump to…"
        footer={
          <>
            <span>
              <Kbd>↑</Kbd> <Kbd>↓</Kbd> to move
            </span>
            <span>
              <Kbd>↵</Kbd> to run
            </span>
            <span>
              <Kbd>esc</Kbd> to close
            </span>
          </>
        }
      >
        <CommandGroup heading="Go to">
          <CommandItem value="today" icon={<Icon icon={Sun03Icon} />}>
            Today
          </CommandItem>
          <CommandItem value="inbox" icon={<Icon icon={InboxIcon} />} meta="12">
            Inbox
          </CommandItem>
          <CommandItem value="settings" keywords="preferences" icon={<Icon icon={Settings01Icon} />} shortcut="Mod+,">
            Settings
          </CommandItem>
        </CommandGroup>
        <CommandGroup heading="Create">
          <CommandItem value="new-task" keywords="add todo" icon={<Icon icon={Add01Icon} />} shortcut="Mod+N">
            New task
          </CommandItem>
        </CommandGroup>
      </CommandDialog>
    </>
  );
}
```

---
Part of @danitesler/ayywi 0.0.1: load `dist/ayywi.min.css` (and `dist/elements.global.js` for the <ayy-*> elements). The rules every screen follows: [llms-full.txt#rules](../llms-full.txt#rules). Every component: [llms.txt](../llms.txt).
