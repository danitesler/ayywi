# Dropdown menu

Category: Actions. A list of actions that opens from a button. It supports submenus and works fully from the keyboard. Also called: menu, dropdown, dropdown-menu, context-menu, menu-item, submenu, nested-menu, cascading-menu.

**Classes**
- `.ayy-menu` — On the element with popover and role="menu".
- `.ayy-menu--sm` — Small panel: rows the sm control tall with sm text and 16px icons. Put it on every panel, a flyout included; the React DropdownMenu does that for you.
- `.ayy-menu--lg` — Large panel: rows the lg control tall with lg text and 20px icons, at least 13rem wide.
- `.ayy-menu--sub` — Submenu flyout panel.
- `.ayy-menu--static` — Static menu rendered inline in a page or window without popover behavior.
- `.ayy-menu__item` — Each action: a <button role="menuitem">.
- `.ayy-menu__row` — Split row: a wrapper holding a normal item and a __more button side by side, so the item runs its action and the button opens a menu for it.
- `.ayy-menu__more` — Square icon button at the end of a __row that opens the row's menu (role="menuitem", aria-haspopup="menu"; put its panel next to the row).
- `.ayy-menu__item--destructive` — Red item for destructive actions.
- `.ayy-menu__item--selected` — Selectable menu item with checkmark indicator.
- `.ayy-menu__item--sub` — Submenu parent row with an inline-end chevron.
- `.ayy-menu__item--expand` — Inline accordion row that expands its items below itself.
- `.ayy-menu__item--described` — Two-line row with an aligned label and soft description.
- `.ayy-menu__item-text` — Text container for a described row's label and description.
- `.ayy-menu__description` — Soft description text under a described row's label.
- `.ayy-menu__value` — Muted text or badge before the chevron or shortcut.
- `.ayy-menu__chevron` — Chevron icon pointing towards the inline end or down when expandable.
- `.ayy-menu__group--inline` — Indented role="group" of items revealed by an expandable row.
- `.ayy-menu__shortcut` — Keyboard shortcut keys at the end of an item, as keycaps (an .ayy-shortcut of .ayy-kbd, adapted to the device).
- `.ayy-menu__label` — Small muted group label, in the same style as the app shell's group names.
- `.ayy-menu__separator` — Divider (role="separator").

**States**
- `default` — Raised surface panel with a line-strong border and the overlay shadow; items are transparent rows with muted icons.
- `hover` (`.ayy-menu__item:hover, .ayy-menu__more:hover`) — Item, or a split row's trailing button, gets the wash-hover background; the button's icon goes from muted to text colour.
- `pressed` — doesn't apply: Items have no pressed look: activating one runs it and closes the menu.
- `focus` (`.ayy-menu__item:focus (arrow keys) / :focus-visible`) — Focused item gets the wash-hover background; keyboard focus adds a 2px ring inset by 2px. Forced colours: Highlight fill.
- `disabled` (`.ayy-menu__item:disabled or [aria-disabled="true"]`) — Item dims to --ayy-opacity-disabled with a not-allowed cursor; arrow keys skip it.
- `selected` (`.ayy-menu__item[aria-checked="true"], .ayy-menu__item[aria-selected="true"], or .ayy-menu__item--selected`) — Semibold with a check at the inline start, drawn in currentColor with space reserved so trailing values stay aligned. For view options in a menu (density, sort, show/hide columns); to choose a form value, use Select.
- `error` — doesn't apply: A menu has no error state; report a failed command with a toast.
- `loading` — doesn't apply: Build the items before opening; if they load, put the trigger Button in loading until they're ready.
- `open` (`:popover-open or [aria-expanded="true"] on a parent row or split row's __more`) — Fades in and scales up from 97%; parent rows and a split row's trailing button keep the hover background while their menu is open.

**Sizes**
- `sm` — Rows the sm control height (28px compact, 32 comfortable, 40 touch), control sm text, 16px icons, at least 10rem wide.
- `md` (default) — Rows the md control height (32px compact, 40 comfortable, 44 touch), control md text, 18px icons, at least 11rem wide.
- `lg` — Rows the lg control height (36px compact, 44 comfortable, 48 touch), control lg text, 20px icons, at least 13rem wide.
- Density — Every size follows data-density with the control scale.
- Width — At least 11rem, at most 20rem (or the viewport minus 1rem); grows with its longest item.

**Custom element** `<ayy-menu>` (@danitesler/ayywi/elements) — A trigger <button> and a [popover] element with role="menu" containing .ayy-menu__item buttons, optional submenu panels (a role="dialog" one goes right after the menu, not inside it), split rows (.ayy-menu__row with a .ayy-menu__more button) and expandable groups.
- attribute `side`: bottom | top | start | end
- attribute `align`: start | center | end
- attribute `open`: Two-way open state
- event `ayy-select`: { value: string, item: HTMLElement } — value is the item's data-value, else its text
- event `ayy-open-change`: { open: boolean }
- event `ayy-submenu-layout`: { open: boolean, width: number, height: number, side: FloatingSide }

**React** — `import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuRow, DropdownMenuMore, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent, DropdownMenuCheckboxItem, DropdownMenuSelectedItem, DropdownMenuRadioGroup, DropdownMenuRadioItem } from "@danitesler/ayywi/react";`
- `<DropdownMenu>` renders nothing (state provider). Props: `size` "sm" | "md" | "lg" — every panel of the menu, flyouts included; `open / defaultOpen` boolean; `onOpenChange` (open: boolean) => void; `anchorPoint` { x: number; y: number }; `boundary` Element | Rect
- `<DropdownMenuTrigger>` renders Button. Props: `...ButtonProps` variant, size…; `asChild` boolean — clone custom trigger element without button styling
- `<DropdownMenuContent>` renders <div popover role="menu">. Props: `size` "sm" | "md" | "lg" — this panel; wins over DropdownMenu; `side` "bottom" | "top" | "start" | "end"; `align` "start" | "center" | "end"; `static` boolean; `boundary` Element | Rect; `subSide` "end" | "start"; `onSubmenuLayout` (layout) => void
- `<DropdownMenuRow>` renders <div role="presentation" class="ayy-menu__row">. Props: `children` A DropdownMenuItem and, beside it, a DropdownMenuMore inside a DropdownMenuSub
- `<DropdownMenuMore>` renders <button type="button" role="menuitem" aria-haspopup="menu" aria-expanded>. Props: `icon` ReactNode — the button's icon (e.g. MoreHorizontal).; `aria-label` Required: name the row it belongs to, e.g. "More options for Duplicate project".
- `<DropdownMenuItem>` renders <button role="menuitem">. Props: `onSelect` () => void — runs when chosen; the menu then closes unless closeOnSelect=false; `destructive` boolean; `selected` boolean — reserves space on inline start for checkmark indicator; `shortcut` string — shortcut keys like "Mod+D" (shown as keycaps, ⌘D on a Mac, Ctrl+D elsewhere); `value` ReactNode; `description` ReactNode; `icon` ReactNode; `closeOnSelect` boolean
- `<DropdownMenuLabel>` renders <div role="presentation">.
- `<DropdownMenuSeparator>` renders <div role="separator">.
- `<DropdownMenuSub>` renders nothing (submenu state provider). Props: `open / defaultOpen` boolean; `onOpenChange` (open: boolean) => void; `inline` boolean
- `<DropdownMenuSubTrigger>` renders <button role="menuitem" aria-haspopup="menu">. Props: `icon` ReactNode; `value` ReactNode; `description` ReactNode; `selected` boolean — reserves space on inline start for checkmark indicator
- `<DropdownMenuSubContent>` renders <div popover role="menu">, <div popover role="dialog"> (placed after the DropdownMenuContent) or <div role="group"> (inline). Props: `size` "sm" | "md" | "lg" — this flyout; wins over DropdownMenu; `side` "end" | "start"; `align` "start"
- `<DropdownMenuCheckboxItem>` renders <button role="menuitemcheckbox">. Props: `checked` boolean; `onCheckedChange` (checked: boolean) => void; `closeOnSelect` boolean
- `<DropdownMenuSelectedItem>` renders <button role="menuitemcheckbox">. Props: `selected` boolean; `onSelectedChange` (selected: boolean) => void; `closeOnSelect` boolean
- `<DropdownMenuRadioGroup>` renders <div role="group">. Props: `value` string; `onValueChange` (value: string) => void; `closeOnSelect` boolean
- `<DropdownMenuRadioItem>` renders <button role="menuitemradio">. Props: `value` string

**Accessibility**
- Opening moves focus to the first item; arrows move, Home/End jump, letters jump to matching items.
- ArrowRight / ArrowLeft open and close submenus (mirrored in RTL); Esc inside a submenu closes only that panel.
- Esc or Tab closes the menu and focus returns to the trigger.
- A submenu panel holding more than items (an Icon picker) is role="dialog" and sits outside the menu, which may only hold items: in HTML right after it, named by its row's aria-controls; in React, the DropdownMenuSub wraps the DropdownMenuContent and the DropdownMenuSubContent follows it.
- Icon-only triggers (⋯) need aria-label.
- A split row is two menu items: the action and its trailing More button, which arrows reach like any other item. Label the button with its row ("More options for Duplicate project"), not just "More".

**Do**
- Use a menu for an item's secondary actions (rename, duplicate, delete) and for overflow “⋯” menus in toolbars and table rows.
- Show an item's shortcut with shortcut="Mod+…" so Mac and Windows users each see their own keys as keycaps.
- Nest one level at most, for variants of one action. Don't hide frequent actions in a submenu.
- Use a split row (DropdownMenuRow with DropdownMenuMore) when one item has a second, related set of choices: the row runs the action, its ⋯ opens on click (not hover) with variants like "Duplicate as template".
- Put destructive actions last, after a separator.
- Keep item labels to a verb + noun: "Rename project".

**Don't**
- Don't use a menu to choose a value in a form — use Select or Radio.
- Don't use a menu to navigate between pages — use links.
- Don't put form fields or rich content in a menu — use Popover.
- Don't hard-code "⌘" or "Ctrl" in a shortcut — pass "Mod+…" and let it adapt.
- Don't nest submenus more than one level.

## Dropdown menu — Item actions

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<!-- <ayy-menu> adds placement and keyboard interaction to the same markup as React. -->
<ayy-menu>
<button type="button" class="ayy-button ayy-button--outline" aria-haspopup="menu" popovertarget="_R_0_">Project actions
</button>
<div id="_R_0_" role="menu" class="ayy-menu" popover="auto">
<button type="button" role="menuitem" tabindex="-1" class="ayy-menu__item"><svg class="ayy-icon" data-ayy-icon="square-pen" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M16.4249 4.60509L17.4149 3.6151C18.2351 2.79497 19.5648 2.79497 20.3849 3.6151C21.205 4.43524 21.205 5.76493 20.3849 6.58507L19.3949 7.57506M16.4249 4.60509L9.76558 11.2644C9.25807 11.772 8.89804 12.4078 8.72397 13.1041L8 16L10.8959 15.276C11.5922 15.102 12.228 14.7419 12.7356 14.2344L19.3949 7.57506M16.4249 4.60509L19.3949 7.57506" stroke="currentColor" stroke-linejoin="round" stroke-width="1.5"></path><path d="M18.9999 13.5C18.9999 16.7875 18.9999 18.4312 18.092 19.5376C17.9258 19.7401 17.7401 19.9258 17.5375 20.092C16.4312 21 14.7874 21 11.4999 21H11C7.22876 21 5.34316 21 4.17159 19.8284C3.00003 18.6569 3 16.7712 3 13V12.5C3 9.21252 3 7.56879 3.90794 6.46244C4.07417 6.2599 4.2599 6.07417 4.46244 5.90794C5.56879 5 7.21252 5 10.5 5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg>Rename
<span class="ayy-menu__shortcut">
<span class="ayy-shortcut" data-keys="Mod+R">
<span class="ayy-sr-only">Ctrl R
</span><kbd class="ayy-kbd" aria-hidden="true">Ctrl</kbd><kbd class="ayy-kbd" aria-hidden="true">R</kbd>
</span>
</span>
</button>
<div role="presentation" class="ayy-menu__row">
<button type="button" role="menuitem" tabindex="-1" class="ayy-menu__item"><svg class="ayy-icon" data-ayy-icon="copy" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7.5 14.5C7.5 11.2002 7.5 9.55025 8.52513 8.52513C9.55025 7.5 11.2002 7.5 14.5 7.5C17.7998 7.5 19.4497 7.5 20.4749 8.52513C21.5 9.55025 21.5 11.2002 21.5 14.5C21.5 17.7998 21.5 19.4497 20.4749 20.4749C19.4497 21.5 17.7998 21.5 14.5 21.5C11.2002 21.5 9.55025 21.5 8.52513 20.4749C7.5 19.4497 7.5 17.7998 7.5 14.5Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M7.5 16.5C6.10355 16.5 5.40533 16.5 4.84402 16.3036C3.83866 15.9518 3.0482 15.1613 2.69641 14.156C2.5 13.5947 2.5 12.8964 2.5 11.5V9.5C2.5 6.20017 2.5 4.55025 3.52513 3.52513C4.55025 2.5 6.20017 2.5 9.5 2.5H11.5C12.8964 2.5 13.5947 2.5 14.156 2.69641C15.1613 3.0482 15.9518 3.83866 16.3036 4.84402C16.5 5.40533 16.5 6.10355 16.5 7.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg>Duplicate
<span class="ayy-menu__value">2 copies
</span>
<span class="ayy-menu__shortcut">
<span class="ayy-shortcut" data-keys="Mod+D">
<span class="ayy-sr-only">Ctrl D
</span><kbd class="ayy-kbd" aria-hidden="true">Ctrl</kbd><kbd class="ayy-kbd" aria-hidden="true">D</kbd>
</span>
</span>
</button>
<button type="button" role="menuitem" tabindex="-1" aria-haspopup="menu" aria-expanded="false" aria-controls="_R_l_" class="ayy-menu__more" aria-label="More options for Duplicate"><svg class="ayy-icon" data-ayy-icon="ellipsis" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6.00449 12.5V12M18.0045 12.5V12M12.0045 12.5V12M7.00449 12.5C7.00449 11.9477 6.55677 11.5 6.00449 11.5C5.4522 11.5 5.00449 11.9477 5.00449 12.5C5.00449 13.0523 5.4522 13.5 6.00449 13.5C6.55677 13.5 7.00449 13.0523 7.00449 12.5ZM19.0045 12.5C19.0045 11.9477 18.5568 11.5 18.0045 11.5C17.4522 11.5 17.0045 11.9477 17.0045 12.5C17.0045 13.0523 17.4522 13.5 18.0045 13.5C18.5568 13.5 19.0045 13.0523 19.0045 12.5ZM13.0045 12.5C13.0045 11.9477 12.5568 11.5 12.0045 11.5C11.4522 11.5 11.0045 11.9477 11.0045 12.5C11.0045 13.0523 11.4522 13.5 12.0045 13.5C12.5568 13.5 13.0045 13.0523 13.0045 12.5Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg>
</button>
</div>
<div id="_R_l_" role="menu" popover="auto" class="ayy-menu ayy-menu--sub">
<button type="button" role="menuitem" tabindex="-1" class="ayy-menu__item">Without comments
</button>
<button type="button" role="menuitem" tabindex="-1" class="ayy-menu__item"><svg class="ayy-icon" data-ayy-icon="layout-template" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M17.7458 2.49963C19.3896 2.49963 20.2115 2.49963 20.7646 2.95361C20.8659 3.03672 20.9588 3.12958 21.0419 3.23085C21.4958 3.78402 21.4958 4.60589 21.4958 6.24963C21.4958 7.89338 21.4958 8.71525 21.0419 9.26842C20.9588 9.36969 20.8659 9.46255 20.7646 9.54566C20.2115 9.99963 19.3896 9.99963 17.7458 9.99963L6.74585 9.99963C5.10211 9.99963 4.28024 9.99963 3.72706 9.54565C3.62579 9.46255 3.53294 9.36969 3.44983 9.26842C2.99585 8.71525 2.99585 7.89337 2.99585 6.24963C2.99585 4.60589 2.99585 3.78402 3.44983 3.23085C3.53294 3.12958 3.62579 3.03672 3.72706 2.95361C4.28024 2.49963 5.10211 2.49963 6.74585 2.49963L17.7458 2.49963Z" stroke="currentColor" stroke-linejoin="round" stroke-width="1.5"></path><path d="M17.7459 13.9998C19.3898 13.9997 20.2117 13.9997 20.7649 14.4537C20.8661 14.5368 20.959 14.6296 21.0421 14.7308C21.4961 15.284 21.4961 16.106 21.4961 17.7499C21.4961 19.3936 21.4961 20.2155 21.0421 20.7687C20.959 20.87 20.8662 20.9628 20.765 21.0459C20.2118 21.4999 19.3899 21.4999 17.7461 21.4999L15.7458 21.5C14.1019 21.5 13.28 21.5001 12.7268 21.046C12.6256 20.963 12.5327 20.8701 12.4496 20.7689C11.9956 20.2157 11.9956 19.3938 11.9956 17.7499C11.9956 16.1061 11.9956 15.2842 12.4496 14.731C12.5327 14.6298 12.6255 14.537 12.7267 14.4539C13.2799 13.9999 14.1018 13.9999 15.7456 13.9998L17.7459 13.9998Z" stroke="currentColor" stroke-linejoin="round" stroke-width="1.5"></path><path d="M5.24559 13.9999C5.94314 13.9999 6.29192 13.9999 6.57574 14.0859C7.21509 14.2798 7.71542 14.7801 7.9093 15.4195C7.99536 15.7033 7.99536 16.0521 7.99536 16.7496V18.7505C7.99536 19.4481 7.99536 19.7968 7.9093 20.0806C7.71542 20.72 7.2151 21.2203 6.57576 21.4142C6.29195 21.5003 5.94317 21.5003 5.24563 21.5003C4.54807 21.5003 4.19929 21.5003 3.91548 21.4142C3.27612 21.2203 2.77579 20.72 2.58191 20.0807C2.49585 19.7968 2.49585 19.4481 2.49585 18.7505L2.49585 16.7496C2.49585 16.0521 2.49585 15.7033 2.58191 15.4195C2.77579 14.7802 3.27611 14.2798 3.91545 14.086C4.19926 13.9999 4.54804 13.9999 5.24559 13.9999Z" stroke="currentColor" stroke-linejoin="round" stroke-width="1.5"></path></svg>As a template
</button>
</div>
<div role="presentation" class="ayy-menu__row">
<button type="button" role="menuitem" tabindex="-1" class="ayy-menu__item"><svg class="ayy-icon" data-ayy-icon="share-2" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M21 6.5C21 8.15685 19.6569 9.5 18 9.5C16.3431 9.5 15 8.15685 15 6.5C15 4.84315 16.3431 3.5 18 3.5C19.6569 3.5 21 4.84315 21 6.5Z" stroke="currentColor" stroke-width="1.5"></path><path d="M9 12C9 13.6569 7.65685 15 6 15C4.34315 15 3 13.6569 3 12C3 10.3431 4.34315 9 6 9C7.65685 9 9 10.3431 9 12Z" stroke="currentColor" stroke-width="1.5"></path><path d="M21 17.5C21 19.1569 19.6569 20.5 18 20.5C16.3431 20.5 15 19.1569 15 17.5C15 15.8431 16.3431 14.5 18 14.5C19.6569 14.5 21 15.8431 21 17.5Z" stroke="currentColor" stroke-width="1.5"></path><path d="M8.72852 10.7495L15.2285 7.75M8.72852 13.25L15.2285 16.2495" stroke="currentColor" stroke-width="1.5"></path></svg>Share
<span class="ayy-menu__value">
<span class="ayy-badge ayy-badge--muted">3
</span>
</span>
<span class="ayy-menu__shortcut">
<span class="ayy-shortcut" data-keys="Mod+S">
<span class="ayy-sr-only">Ctrl S
</span><kbd class="ayy-kbd" aria-hidden="true">Ctrl</kbd><kbd class="ayy-kbd" aria-hidden="true">S</kbd>
</span>
</span>
</button>
<button type="button" role="menuitem" tabindex="-1" aria-haspopup="menu" aria-expanded="false" aria-controls="_R_t_" class="ayy-menu__more" aria-label="More options for Share"><svg class="ayy-icon" data-ayy-icon="ellipsis" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6.00449 12.5V12M18.0045 12.5V12M12.0045 12.5V12M7.00449 12.5C7.00449 11.9477 6.55677 11.5 6.00449 11.5C5.4522 11.5 5.00449 11.9477 5.00449 12.5C5.00449 13.0523 5.4522 13.5 6.00449 13.5C6.55677 13.5 7.00449 13.0523 7.00449 12.5ZM19.0045 12.5C19.0045 11.9477 18.5568 11.5 18.0045 11.5C17.4522 11.5 17.0045 11.9477 17.0045 12.5C17.0045 13.0523 17.4522 13.5 18.0045 13.5C18.5568 13.5 19.0045 13.0523 19.0045 12.5ZM13.0045 12.5C13.0045 11.9477 12.5568 11.5 12.0045 11.5C11.4522 11.5 11.0045 11.9477 11.0045 12.5C11.0045 13.0523 11.4522 13.5 12.0045 13.5C12.5568 13.5 13.0045 13.0523 13.0045 12.5Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg>
</button>
</div>
<div id="_R_t_" role="menu" popover="auto" class="ayy-menu ayy-menu--sub">
<button type="button" role="menuitem" tabindex="-1" class="ayy-menu__item"><svg class="ayy-icon" data-ayy-icon="link" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M9.14339 10.691L9.35031 10.4841C11.329 8.50532 14.5372 8.50532 16.5159 10.4841C18.4947 12.4628 18.4947 15.671 16.5159 17.6497L13.6497 20.5159C11.671 22.4947 8.46279 22.4947 6.48405 20.5159C4.50532 18.5372 4.50532 15.329 6.48405 13.3503L6.9484 12.886" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path><path d="M17.0516 11.114L17.5159 10.6497C19.4947 8.67095 19.4947 5.46279 17.5159 3.48405C15.5372 1.50532 12.329 1.50532 10.3503 3.48405L7.48405 6.35031C5.50532 8.32904 5.50532 11.5372 7.48405 13.5159C9.46279 15.4947 12.671 15.4947 14.6497 13.5159L14.8566 13.309" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path></svg>Copy link
<span class="ayy-menu__shortcut">
<span class="ayy-shortcut" data-keys="Mod+C">
<span class="ayy-sr-only">Ctrl C
</span><kbd class="ayy-kbd" aria-hidden="true">Ctrl</kbd><kbd class="ayy-kbd" aria-hidden="true">C</kbd>
</span>
</span>
</button>
<button type="button" role="menuitem" tabindex="-1" class="ayy-menu__item"><svg class="ayy-icon" data-ayy-icon="mail" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M2 6L8.91302 9.91697C11.4616 11.361 12.5384 11.361 15.087 9.91697L22 6" stroke="currentColor" stroke-linejoin="round" stroke-width="1.5"></path><path d="M2.01577 13.4756C2.08114 16.5412 2.11383 18.0739 3.24496 19.2094C4.37608 20.3448 5.95033 20.3843 9.09883 20.4634C11.0393 20.5122 12.9607 20.5122 14.9012 20.4634C18.0497 20.3843 19.6239 20.3448 20.7551 19.2094C21.8862 18.0739 21.9189 16.5412 21.9842 13.4756C22.0053 12.4899 22.0053 11.5101 21.9842 10.5244C21.9189 7.45886 21.8862 5.92609 20.7551 4.79066C19.6239 3.65523 18.0497 3.61568 14.9012 3.53657C12.9607 3.48781 11.0393 3.48781 9.09882 3.53656C5.95033 3.61566 4.37608 3.65521 3.24495 4.79065C2.11382 5.92608 2.08114 7.45885 2.01576 10.5244C1.99474 11.5101 1.99475 12.4899 2.01577 13.4756Z" stroke="currentColor" stroke-linejoin="round" stroke-width="1.5"></path></svg>Invite by email
</button>
</div>
<button type="button" role="menuitem" tabindex="-1" class="ayy-menu__item" disabled=""><svg class="ayy-icon" data-ayy-icon="user-switch" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M11 13C10.6446 13.0097 10.3134 13.0226 10.0008 13.0379C6.3 13.2193 3.28417 16.3058 3 20.0002" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><circle cx="11" cy="6" r="4" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></circle><path d="M17.5 20.5C15.2909 20.5 13.5 18.7091 13.5 16.5M17 13C19.2091 13 21 14.7909 21 17M17 14.5V11.5L15.5 13L17 14.5ZM17.5 19V22L19 20.5L17.5 19Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg>Transfer ownership
</button>
<button type="button" role="menuitem" tabindex="-1" aria-describedby="_R_1d_" class="ayy-menu__item ayy-menu__item--described"><svg class="ayy-icon" data-ayy-icon="crop" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 2V4M22 20H20M16.5 20H10C7.17157 20 5.75736 20 4.87868 19.1213C4 18.2426 4 16.8284 4 14V7.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M20 22L20 12C20 8.22877 20 6.34315 18.8284 5.17158C17.6569 4 15.7712 4 12 4L2 4" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg>
<span class="ayy-menu__item-text">
<span>Capture area
</span>
<span id="_R_1d_" class="ayy-menu__description">Drag to select part of the screen
</span>
</span>
<span class="ayy-menu__shortcut">
<span class="ayy-shortcut" data-keys="Mod+4">
<span class="ayy-sr-only">Ctrl 4
</span><kbd class="ayy-kbd" aria-hidden="true">Ctrl</kbd><kbd class="ayy-kbd" aria-hidden="true">4</kbd>
</span>
</span>
</button>
<button type="button" role="menuitem" tabindex="-1" aria-haspopup="menu" aria-expanded="false" aria-controls="_R_1l_" class="ayy-menu__item ayy-menu__item--sub"><svg class="ayy-icon" data-ayy-icon="clock" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5"></circle><path d="M12 8V12L14 14" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg>Self-timer
<span class="ayy-menu__value">5s
</span>
<span class="ayy-menu__chevron" aria-hidden="true">
</span>
</button>
<div id="_R_1l_" role="menu" popover="auto" class="ayy-menu ayy-menu--sub">
<div role="group">
<button type="button" role="menuitemradio" tabindex="-1" data-close-on-select="false" aria-checked="false" class="ayy-menu__item ayy-menu__item--selected">Off
</button>
<button type="button" role="menuitemradio" tabindex="-1" data-close-on-select="false" aria-checked="false" class="ayy-menu__item ayy-menu__item--selected">In 3 seconds
</button>
<button type="button" role="menuitemradio" tabindex="-1" data-close-on-select="false" aria-checked="true" class="ayy-menu__item ayy-menu__item--selected">In 5 seconds
</button>
<button type="button" role="menuitemradio" tabindex="-1" data-close-on-select="false" aria-checked="false" class="ayy-menu__item ayy-menu__item--selected">In 10 seconds
</button>
</div>
</div>
<button type="button" role="menuitem" tabindex="-1" aria-haspopup="menu" aria-expanded="false" aria-controls="_R_1t_" class="ayy-menu__item ayy-menu__item--sub"><svg class="ayy-icon" data-ayy-icon="download" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M2.99969 17.0002C2.99969 17.9302 2.99969 18.3952 3.10192 18.7767C3.37932 19.8119 4.18796 20.6206 5.22324 20.898C5.60474 21.0002 6.06972 21.0002 6.99969 21.0002L16.9997 21.0002C17.9297 21.0002 18.3947 21.0002 18.7762 20.898C19.8114 20.6206 20.6201 19.8119 20.8975 18.7767C20.9997 18.3952 20.9997 17.9302 20.9997 17.0002" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M16.4998 11.5002C16.4998 11.5002 13.1856 16.0002 11.9997 16.0002C10.8139 16.0002 7.49976 11.5002 7.49976 11.5002M11.9997 15.0002V3.00016" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg>Export format
<span class="ayy-menu__value">PNG
</span>
<span class="ayy-menu__chevron" aria-hidden="true">
</span>
</button>
<div id="_R_1t_" role="menu" popover="auto" class="ayy-menu ayy-menu--sub">
<div role="group">
<button type="button" role="menuitemradio" tabindex="-1" data-close-on-select="false" aria-checked="true" class="ayy-menu__item ayy-menu__item--selected">PNG (lossless)
</button>
<button type="button" role="menuitemradio" tabindex="-1" data-close-on-select="false" aria-checked="false" class="ayy-menu__item ayy-menu__item--selected">JPG (compressed)
</button>
<button type="button" role="menuitemradio" tabindex="-1" data-close-on-select="false" aria-checked="false" class="ayy-menu__item ayy-menu__item--selected">PDF (document)
</button>
</div>
</div>
<button type="button" role="menuitem" tabindex="-1" aria-expanded="false" aria-controls="_R_25_" class="ayy-menu__item ayy-menu__item--expand"><svg class="ayy-icon" data-ayy-icon="layers" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M8.64298 3.14559L6.93816 3.93362C4.31272 5.14719 3 5.75397 3 6.75C3 7.74603 4.31272 8.35281 6.93817 9.56638L8.64298 10.3544C10.2952 11.1181 11.1214 11.5 12 11.5C12.8786 11.5 13.7048 11.1181 15.357 10.3544L17.0618 9.56638C19.6873 8.35281 21 7.74603 21 6.75C21 5.75397 19.6873 5.14719 17.0618 3.93362L15.357 3.14559C13.7048 2.38186 12.8786 2 12 2C11.1214 2 10.2952 2.38186 8.64298 3.14559Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M20.788 11.0972C20.9293 11.2959 21 11.5031 21 11.7309C21 12.7127 19.6873 13.3109 17.0618 14.5072L15.357 15.284C13.7048 16.0368 12.8786 16.4133 12 16.4133C11.1214 16.4133 10.2952 16.0368 8.64298 15.284L6.93817 14.5072C4.31272 13.3109 3 12.7127 3 11.7309C3 11.5031 3.07067 11.2959 3.212 11.0972" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M20.3767 16.2661C20.7922 16.5971 21 16.927 21 17.3176C21 18.2995 19.6873 18.8976 17.0618 20.0939L15.357 20.8707C13.7048 21.6236 12.8786 22 12 22C11.1214 22 10.2952 21.6236 8.64298 20.8707L6.93817 20.0939C4.31272 18.8976 3 18.2995 3 17.3176C3 16.927 3.20778 16.5971 3.62334 16.2661" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg>Advanced options
<span class="ayy-menu__chevron" aria-hidden="true">
</span>
</button>
<div id="_R_25_" role="group" hidden="" class="ayy-menu__group--inline">
<button type="button" role="menuitemcheckbox" tabindex="-1" data-close-on-select="false" aria-checked="true" class="ayy-menu__item ayy-menu__item--selected">Include pointer
</button>
</div>
<div role="separator" class="ayy-menu__separator">
</div>
<button type="button" role="menuitem" tabindex="-1" class="ayy-menu__item"><svg class="ayy-icon" data-ayy-icon="camera" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12.6974 3.5H11.303C10.5884 3.5 10.2311 3.5 9.91067 3.612C9.71499 3.68039 9.53113 3.77879 9.36568 3.90367C9.09474 4.10816 8.89655 4.40544 8.50018 5L8.50017 5.00001C8.29717 5.30453 7.99794 5.75337 7.87867 5.87871C7.58314 6.18927 7.19563 6.39666 6.77329 6.47029C6.60284 6.5 6.41985 6.5 6.05387 6.5C5.07379 6.5 4.58376 6.5 4.18307 6.61342C3.18074 6.89716 2.39734 7.68055 2.1136 8.68289C2.00018 9.08357 2.00018 9.57361 2.00018 10.5537V14.5C2.00018 17.3284 2.00018 18.7426 2.87886 19.6213C3.75754 20.5 5.17176 20.5 8.00018 20.5H16.0002C18.8286 20.5 20.2428 20.5 21.1215 19.6213C22.0002 18.7426 22.0002 17.3284 22.0002 14.5V10.5537C22.0002 9.57361 22.0002 9.08357 21.8868 8.68289C21.603 7.68055 20.8196 6.89716 19.8173 6.61342C19.4166 6.5 18.9266 6.5 17.9465 6.5C17.5805 6.5 17.3975 6.5 17.2271 6.47029C16.8047 6.39666 16.4172 6.18927 16.1217 5.87871C16.0024 5.75336 15.7032 5.30451 15.5002 5C15.1038 4.40544 14.9056 4.10816 14.6347 3.90367C14.4692 3.77879 14.2854 3.68039 14.0897 3.612C13.7693 3.5 13.412 3.5 12.6974 3.5Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M16.0002 13C16.0002 15.2091 14.2093 17 12.0002 17C9.79104 17 8.00018 15.2091 8.00018 13C8.00018 10.7909 9.79104 9 12.0002 9C14.2093 9 16.0002 10.7909 16.0002 13Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M19.1252 9.5H19.0002M19.2502 9.5C19.2502 9.63807 19.1383 9.75 19.0002 9.75C18.8621 9.75 18.7502 9.63807 18.7502 9.5C18.7502 9.36193 18.8621 9.25 19.0002 9.25C19.1383 9.25 19.2502 9.36193 19.2502 9.5Z" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path></svg>Full screen
<span class="ayy-menu__shortcut">
<span class="ayy-shortcut" data-keys="Mod+3">
<span class="ayy-sr-only">Ctrl 3
</span><kbd class="ayy-kbd" aria-hidden="true">Ctrl</kbd><kbd class="ayy-kbd" aria-hidden="true">3</kbd>
</span>
</span>
</button>
<button type="button" role="menuitem" tabindex="-1" class="ayy-menu__item"><svg class="ayy-icon" data-ayy-icon="archive" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7 21H16.9999C19.3569 21 20.5354 21 21.2677 20.2678C21.9999 19.5355 21.9999 18.357 21.9999 16C21.9999 13.643 21.9999 12.4645 21.2677 11.7322C20.5354 11 19.3569 11 16.9999 11H7C4.64302 11 3.46453 11 2.7323 11.7322C2.00007 12.4644 2.00005 13.6429 2 15.9999C1.99995 18.357 1.99993 19.5355 2.73217 20.2677C3.4644 21 4.64294 21 7 21Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M4 11C4.00005 9.59977 4.00008 8.89966 4.27263 8.36485C4.5123 7.89455 4.89469 7.51218 5.365 7.27253C5.89981 7 6.59993 7 8.00015 7H16C17.4001 7 18.1002 7 18.635 7.27248C19.1054 7.51217 19.4878 7.89462 19.7275 8.36502C20 8.8998 20 9.59987 20 11" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M6 7C6.00004 5.5998 6.00006 4.89969 6.27259 4.3649C6.51227 3.89457 6.89467 3.51218 7.36501 3.27252C7.89981 3 8.59991 3 10.0001 3H14C15.4001 3 16.1002 3 16.635 3.27248C17.1054 3.51217 17.4878 3.89462 17.7275 4.36502C18 4.8998 18 5.59987 18 7" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M16 15L15.7 15.4C15.1111 16.1851 14.8167 16.5777 14.3944 16.7889C13.9721 17 13.4814 17 12.5 17H11.5C10.5186 17 10.0279 17 9.60557 16.7889C9.18328 16.5777 8.88885 16.1851 8.3 15.4L8 15" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg>Archive project
</button>
<div role="separator" class="ayy-menu__separator">
</div>
<button type="button" role="menuitem" tabindex="-1" class="ayy-menu__item ayy-menu__item--destructive"><svg class="ayy-icon" data-ayy-icon="trash" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M19.5 5.5L18.8803 15.5251C18.7219 18.0864 18.6428 19.3671 18.0008 20.2879C17.6833 20.7431 17.2747 21.1273 16.8007 21.416C15.8421 22 14.559 22 11.9927 22C9.42312 22 8.1383 22 7.17905 21.4149C6.7048 21.1257 6.296 20.7408 5.97868 20.2848C5.33688 19.3626 5.25945 18.0801 5.10461 15.5152L4.5 5.5" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path><path d="M3 5.5H21M16.0557 5.5L15.3731 4.09173C14.9196 3.15626 14.6928 2.68852 14.3017 2.39681C14.215 2.3321 14.1231 2.27454 14.027 2.2247C13.5939 2 13.0741 2 12.0345 2C10.9688 2 10.436 2 9.99568 2.23412C9.8981 2.28601 9.80498 2.3459 9.71729 2.41317C9.32164 2.7167 9.10063 3.20155 8.65861 4.17126L8.05292 5.5" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path><path d="M9.5 16.5L9.5 10.5" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path><path d="M14.5 16.5L14.5 10.5" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path></svg>Delete project
</button>
</div>
</ayy-menu>
```

React:

```tsx
import { useState } from "react";
import {
  Archive02Icon,
  Camera01Icon,
  Clock01Icon,
  Copy01Icon,
  CropIcon,
  Delete02Icon,
  Download01Icon,
  Layers01Icon,
  LayoutTemplateIcon,
  Link01Icon,
  Mail01Icon,
  MoreHorizontalIcon,
  PencilEdit02Icon,
  Share08Icon,
  UserSwitchIcon,
} from "@hugeicons/core-free-icons";
import {
  Badge,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuMore,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuRow,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  Icon,
  toast,
} from "@danitesler/ayywi/react";

export default function Example() {
  const [timer, setTimer] = useState("5");
  const [format, setFormat] = useState("png");
  const [showCursor, setShowCursor] = useState(true);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger variant="outline">Project actions</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onSelect={() => toast("Rename")} shortcut="Mod+R">
          <Icon icon={PencilEdit02Icon} name="square-pen" />
          Rename
        </DropdownMenuItem>
        <DropdownMenuSub>
          <DropdownMenuRow>
            <DropdownMenuItem icon={<Icon icon={Copy01Icon} name="copy" />} value="2 copies" shortcut="Mod+D" onSelect={() => toast("Duplicated")}>
              Duplicate
            </DropdownMenuItem>
            <DropdownMenuMore aria-label="More options for Duplicate" icon={<Icon icon={MoreHorizontalIcon} name="ellipsis" />} />
          </DropdownMenuRow>
          <DropdownMenuSubContent>
            <DropdownMenuItem onSelect={() => toast("Duplicated without comments")}>Without comments</DropdownMenuItem>
            <DropdownMenuItem icon={<Icon icon={LayoutTemplateIcon} name="layout-template" />} onSelect={() => toast("Duplicated as template")}>
              As a template
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSub>
          <DropdownMenuRow>
            <DropdownMenuItem icon={<Icon icon={Share08Icon} name="share-2" />} value={<Badge variant="muted">3</Badge>} shortcut="Mod+S" onSelect={() => toast("Share settings")}>
              Share
            </DropdownMenuItem>
            <DropdownMenuMore aria-label="More options for Share" icon={<Icon icon={MoreHorizontalIcon} name="ellipsis" />} />
          </DropdownMenuRow>
          <DropdownMenuSubContent>
            <DropdownMenuItem icon={<Icon icon={Link01Icon} name="link" />} onSelect={() => toast("Link copied")} shortcut="Mod+C">
              Copy link
            </DropdownMenuItem>
            <DropdownMenuItem icon={<Icon icon={Mail01Icon} name="mail" />} onSelect={() => toast("Invite sent")}>
              Invite by email
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuItem disabled>
          <Icon icon={UserSwitchIcon} name="user-switch" />
          Transfer ownership
        </DropdownMenuItem>
        <DropdownMenuItem
          icon={<Icon icon={CropIcon} name="crop" />}
          description="Drag to select part of the screen"
          onSelect={() => toast("Capture area")}
          shortcut="Mod+4"
        >
          Capture area
        </DropdownMenuItem>

        <DropdownMenuSub>
          <DropdownMenuSubTrigger
            icon={<Icon icon={Clock01Icon} name="clock" />}
            value={timer === "off" ? "Off" : `${timer}s`}
          >
            Self-timer
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuRadioGroup value={timer} onValueChange={(val) => { setTimer(val); toast(val === "off" ? "Timer: off" : `Timer: ${val}s`); }}>
              <DropdownMenuRadioItem value="off">Off</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="3">In 3 seconds</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="5">In 5 seconds</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="10">In 10 seconds</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSub>
          <DropdownMenuSubTrigger icon={<Icon icon={Download01Icon} name="download" />} value={format.toUpperCase()}>
            Export format
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuRadioGroup value={format} onValueChange={(val) => { setFormat(val); toast(`Format: ${val.toUpperCase()}`); }}>
              <DropdownMenuRadioItem value="png">PNG (lossless)</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="jpg">JPG (compressed)</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="pdf">PDF (document)</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSub inline>
          <DropdownMenuSubTrigger icon={<Icon icon={Layers01Icon} name="layers" />}>
            Advanced options
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuCheckboxItem
              checked={showCursor}
              onCheckedChange={(checked) => {
                setShowCursor(checked);
                toast(checked ? "Cursor included" : "Cursor hidden");
              }}
            >
              Include pointer
            </DropdownMenuCheckboxItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSeparator />
        <DropdownMenuItem
          icon={<Icon icon={Camera01Icon} name="camera" />}
          onSelect={() => toast("Screen captured")}
          shortcut="Mod+3"
        >
          Full screen
        </DropdownMenuItem>

        <DropdownMenuItem icon={<Icon icon={Archive02Icon} name="archive" />} onSelect={() => toast("Project archived")}>
          Archive project
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem destructive onSelect={() => toast.error("Project deleted")}>
          <Icon icon={Delete02Icon} name="trash" />
          Delete project
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

## Dropdown menu — Sizes

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<div class="ayy-cluster" style="align-items: flex-start">
  <div role="menu" class="ayy-menu ayy-menu--sm ayy-menu--static" aria-label="Project actions, small">
    <div role="presentation" class="ayy-menu__label">Project</div>
    <button type="button" role="menuitem" tabindex="-1" class="ayy-menu__item"><svg class="ayy-icon" data-ayy-icon="square-pen" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M16.4249 4.60509L17.4149 3.6151C18.2351 2.79497 19.5648 2.79497 20.3849 3.6151C21.205 4.43524 21.205 5.76493 20.3849 6.58507L19.3949 7.57506M16.4249 4.60509L9.76558 11.2644C9.25807 11.772 8.89804 12.4078 8.72397 13.1041L8 16L10.8959 15.276C11.5922 15.102 12.228 14.7419 12.7356 14.2344L19.3949 7.57506M16.4249 4.60509L19.3949 7.57506" stroke="currentColor" stroke-linejoin="round" stroke-width="1.5"></path><path d="M18.9999 13.5C18.9999 16.7875 18.9999 18.4312 18.092 19.5376C17.9258 19.7401 17.7401 19.9258 17.5375 20.092C16.4312 21 14.7874 21 11.4999 21H11C7.22876 21 5.34316 21 4.17159 19.8284C3.00003 18.6569 3 16.7712 3 13V12.5C3 9.21252 3 7.56879 3.90794 6.46244C4.07417 6.2599 4.2599 6.07417 4.46244 5.90794C5.56879 5 7.21252 5 10.5 5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg>Rename<span class="ayy-menu__shortcut"><span class="ayy-shortcut" data-keys="Mod+E"><span class="ayy-sr-only">Ctrl E</span><kbd class="ayy-kbd" aria-hidden="true">Ctrl</kbd><kbd class="ayy-kbd" aria-hidden="true">E</kbd></span></span></button>
    <button type="button" role="menuitem" tabindex="-1" aria-describedby="menu-duplicate-hint-sm" class="ayy-menu__item ayy-menu__item--described"><svg class="ayy-icon" data-ayy-icon="copy" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7.5 14.5C7.5 11.2002 7.5 9.55025 8.52513 8.52513C9.55025 7.5 11.2002 7.5 14.5 7.5C17.7998 7.5 19.4497 7.5 20.4749 8.52513C21.5 9.55025 21.5 11.2002 21.5 14.5C21.5 17.7998 21.5 19.4497 20.4749 20.4749C19.4497 21.5 17.7998 21.5 14.5 21.5C11.2002 21.5 9.55025 21.5 8.52513 20.4749C7.5 19.4497 7.5 17.7998 7.5 14.5Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M7.5 16.5C6.10355 16.5 5.40533 16.5 4.84402 16.3036C3.83866 15.9518 3.0482 15.1613 2.69641 14.156C2.5 13.5947 2.5 12.8964 2.5 11.5V9.5C2.5 6.20017 2.5 4.55025 3.52513 3.52513C4.55025 2.5 6.20017 2.5 9.5 2.5H11.5C12.8964 2.5 13.5947 2.5 14.156 2.69641C15.1613 3.0482 15.9518 3.83866 16.3036 4.84402C16.5 5.40533 16.5 6.10355 16.5 7.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg><span class="ayy-menu__item-text"><span>Duplicate</span><span id="menu-duplicate-hint-sm" class="ayy-menu__description">Keeps the pages, not the people</span></span></button>
    <button type="button" role="menuitem" tabindex="-1" class="ayy-menu__item"><svg class="ayy-icon" data-ayy-icon="share-2" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M21 6.5C21 8.15685 19.6569 9.5 18 9.5C16.3431 9.5 15 8.15685 15 6.5C15 4.84315 16.3431 3.5 18 3.5C19.6569 3.5 21 4.84315 21 6.5Z" stroke="currentColor" stroke-width="1.5"></path><path d="M9 12C9 13.6569 7.65685 15 6 15C4.34315 15 3 13.6569 3 12C3 10.3431 4.34315 9 6 9C7.65685 9 9 10.3431 9 12Z" stroke="currentColor" stroke-width="1.5"></path><path d="M21 17.5C21 19.1569 19.6569 20.5 18 20.5C16.3431 20.5 15 19.1569 15 17.5C15 15.8431 16.3431 14.5 18 14.5C19.6569 14.5 21 15.8431 21 17.5Z" stroke="currentColor" stroke-width="1.5"></path><path d="M8.72852 10.7495L15.2285 7.75M8.72852 13.25L15.2285 16.2495" stroke="currentColor" stroke-width="1.5"></path></svg>Share<span class="ayy-menu__value">Team</span></button>
    <div role="separator" class="ayy-menu__separator"></div>
    <button type="button" role="menuitem" tabindex="-1" class="ayy-menu__item ayy-menu__item--destructive"><svg class="ayy-icon" data-ayy-icon="trash" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M19.5 5.5L18.8803 15.5251C18.7219 18.0864 18.6428 19.3671 18.0008 20.2879C17.6833 20.7431 17.2747 21.1273 16.8007 21.416C15.8421 22 14.559 22 11.9927 22C9.42312 22 8.1383 22 7.17905 21.4149C6.7048 21.1257 6.296 20.7408 5.97868 20.2848C5.33688 19.3626 5.25945 18.0801 5.10461 15.5152L4.5 5.5" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path><path d="M3 5.5H21M16.0557 5.5L15.3731 4.09173C14.9196 3.15626 14.6928 2.68852 14.3017 2.39681C14.215 2.3321 14.1231 2.27454 14.027 2.2247C13.5939 2 13.0741 2 12.0345 2C10.9688 2 10.436 2 9.99568 2.23412C9.8981 2.28601 9.80498 2.3459 9.71729 2.41317C9.32164 2.7167 9.10063 3.20155 8.65861 4.17126L8.05292 5.5" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path><path d="M9.5 16.5L9.5 10.5" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path><path d="M14.5 16.5L14.5 10.5" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path></svg>Delete</button>
  </div>
  <div role="menu" class="ayy-menu ayy-menu--static" aria-label="Project actions, medium">
    <div role="presentation" class="ayy-menu__label">Project</div>
    <button type="button" role="menuitem" tabindex="-1" class="ayy-menu__item"><svg class="ayy-icon" data-ayy-icon="square-pen" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M16.4249 4.60509L17.4149 3.6151C18.2351 2.79497 19.5648 2.79497 20.3849 3.6151C21.205 4.43524 21.205 5.76493 20.3849 6.58507L19.3949 7.57506M16.4249 4.60509L9.76558 11.2644C9.25807 11.772 8.89804 12.4078 8.72397 13.1041L8 16L10.8959 15.276C11.5922 15.102 12.228 14.7419 12.7356 14.2344L19.3949 7.57506M16.4249 4.60509L19.3949 7.57506" stroke="currentColor" stroke-linejoin="round" stroke-width="1.5"></path><path d="M18.9999 13.5C18.9999 16.7875 18.9999 18.4312 18.092 19.5376C17.9258 19.7401 17.7401 19.9258 17.5375 20.092C16.4312 21 14.7874 21 11.4999 21H11C7.22876 21 5.34316 21 4.17159 19.8284C3.00003 18.6569 3 16.7712 3 13V12.5C3 9.21252 3 7.56879 3.90794 6.46244C4.07417 6.2599 4.2599 6.07417 4.46244 5.90794C5.56879 5 7.21252 5 10.5 5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg>Rename<span class="ayy-menu__shortcut"><span class="ayy-shortcut" data-keys="Mod+E"><span class="ayy-sr-only">Ctrl E</span><kbd class="ayy-kbd" aria-hidden="true">Ctrl</kbd><kbd class="ayy-kbd" aria-hidden="true">E</kbd></span></span></button>
    <button type="button" role="menuitem" tabindex="-1" aria-describedby="menu-duplicate-hint-md" class="ayy-menu__item ayy-menu__item--described"><svg class="ayy-icon" data-ayy-icon="copy" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7.5 14.5C7.5 11.2002 7.5 9.55025 8.52513 8.52513C9.55025 7.5 11.2002 7.5 14.5 7.5C17.7998 7.5 19.4497 7.5 20.4749 8.52513C21.5 9.55025 21.5 11.2002 21.5 14.5C21.5 17.7998 21.5 19.4497 20.4749 20.4749C19.4497 21.5 17.7998 21.5 14.5 21.5C11.2002 21.5 9.55025 21.5 8.52513 20.4749C7.5 19.4497 7.5 17.7998 7.5 14.5Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M7.5 16.5C6.10355 16.5 5.40533 16.5 4.84402 16.3036C3.83866 15.9518 3.0482 15.1613 2.69641 14.156C2.5 13.5947 2.5 12.8964 2.5 11.5V9.5C2.5 6.20017 2.5 4.55025 3.52513 3.52513C4.55025 2.5 6.20017 2.5 9.5 2.5H11.5C12.8964 2.5 13.5947 2.5 14.156 2.69641C15.1613 3.0482 15.9518 3.83866 16.3036 4.84402C16.5 5.40533 16.5 6.10355 16.5 7.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg><span class="ayy-menu__item-text"><span>Duplicate</span><span id="menu-duplicate-hint-md" class="ayy-menu__description">Keeps the pages, not the people</span></span></button>
    <button type="button" role="menuitem" tabindex="-1" class="ayy-menu__item"><svg class="ayy-icon" data-ayy-icon="share-2" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M21 6.5C21 8.15685 19.6569 9.5 18 9.5C16.3431 9.5 15 8.15685 15 6.5C15 4.84315 16.3431 3.5 18 3.5C19.6569 3.5 21 4.84315 21 6.5Z" stroke="currentColor" stroke-width="1.5"></path><path d="M9 12C9 13.6569 7.65685 15 6 15C4.34315 15 3 13.6569 3 12C3 10.3431 4.34315 9 6 9C7.65685 9 9 10.3431 9 12Z" stroke="currentColor" stroke-width="1.5"></path><path d="M21 17.5C21 19.1569 19.6569 20.5 18 20.5C16.3431 20.5 15 19.1569 15 17.5C15 15.8431 16.3431 14.5 18 14.5C19.6569 14.5 21 15.8431 21 17.5Z" stroke="currentColor" stroke-width="1.5"></path><path d="M8.72852 10.7495L15.2285 7.75M8.72852 13.25L15.2285 16.2495" stroke="currentColor" stroke-width="1.5"></path></svg>Share<span class="ayy-menu__value">Team</span></button>
    <div role="separator" class="ayy-menu__separator"></div>
    <button type="button" role="menuitem" tabindex="-1" class="ayy-menu__item ayy-menu__item--destructive"><svg class="ayy-icon" data-ayy-icon="trash" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M19.5 5.5L18.8803 15.5251C18.7219 18.0864 18.6428 19.3671 18.0008 20.2879C17.6833 20.7431 17.2747 21.1273 16.8007 21.416C15.8421 22 14.559 22 11.9927 22C9.42312 22 8.1383 22 7.17905 21.4149C6.7048 21.1257 6.296 20.7408 5.97868 20.2848C5.33688 19.3626 5.25945 18.0801 5.10461 15.5152L4.5 5.5" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path><path d="M3 5.5H21M16.0557 5.5L15.3731 4.09173C14.9196 3.15626 14.6928 2.68852 14.3017 2.39681C14.215 2.3321 14.1231 2.27454 14.027 2.2247C13.5939 2 13.0741 2 12.0345 2C10.9688 2 10.436 2 9.99568 2.23412C9.8981 2.28601 9.80498 2.3459 9.71729 2.41317C9.32164 2.7167 9.10063 3.20155 8.65861 4.17126L8.05292 5.5" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path><path d="M9.5 16.5L9.5 10.5" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path><path d="M14.5 16.5L14.5 10.5" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path></svg>Delete</button>
  </div>
  <div role="menu" class="ayy-menu ayy-menu--lg ayy-menu--static" aria-label="Project actions, large">
    <div role="presentation" class="ayy-menu__label">Project</div>
    <button type="button" role="menuitem" tabindex="-1" class="ayy-menu__item"><svg class="ayy-icon" data-ayy-icon="square-pen" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M16.4249 4.60509L17.4149 3.6151C18.2351 2.79497 19.5648 2.79497 20.3849 3.6151C21.205 4.43524 21.205 5.76493 20.3849 6.58507L19.3949 7.57506M16.4249 4.60509L9.76558 11.2644C9.25807 11.772 8.89804 12.4078 8.72397 13.1041L8 16L10.8959 15.276C11.5922 15.102 12.228 14.7419 12.7356 14.2344L19.3949 7.57506M16.4249 4.60509L19.3949 7.57506" stroke="currentColor" stroke-linejoin="round" stroke-width="1.5"></path><path d="M18.9999 13.5C18.9999 16.7875 18.9999 18.4312 18.092 19.5376C17.9258 19.7401 17.7401 19.9258 17.5375 20.092C16.4312 21 14.7874 21 11.4999 21H11C7.22876 21 5.34316 21 4.17159 19.8284C3.00003 18.6569 3 16.7712 3 13V12.5C3 9.21252 3 7.56879 3.90794 6.46244C4.07417 6.2599 4.2599 6.07417 4.46244 5.90794C5.56879 5 7.21252 5 10.5 5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg>Rename<span class="ayy-menu__shortcut"><span class="ayy-shortcut" data-keys="Mod+E"><span class="ayy-sr-only">Ctrl E</span><kbd class="ayy-kbd" aria-hidden="true">Ctrl</kbd><kbd class="ayy-kbd" aria-hidden="true">E</kbd></span></span></button>
    <button type="button" role="menuitem" tabindex="-1" aria-describedby="menu-duplicate-hint-lg" class="ayy-menu__item ayy-menu__item--described"><svg class="ayy-icon" data-ayy-icon="copy" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7.5 14.5C7.5 11.2002 7.5 9.55025 8.52513 8.52513C9.55025 7.5 11.2002 7.5 14.5 7.5C17.7998 7.5 19.4497 7.5 20.4749 8.52513C21.5 9.55025 21.5 11.2002 21.5 14.5C21.5 17.7998 21.5 19.4497 20.4749 20.4749C19.4497 21.5 17.7998 21.5 14.5 21.5C11.2002 21.5 9.55025 21.5 8.52513 20.4749C7.5 19.4497 7.5 17.7998 7.5 14.5Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M7.5 16.5C6.10355 16.5 5.40533 16.5 4.84402 16.3036C3.83866 15.9518 3.0482 15.1613 2.69641 14.156C2.5 13.5947 2.5 12.8964 2.5 11.5V9.5C2.5 6.20017 2.5 4.55025 3.52513 3.52513C4.55025 2.5 6.20017 2.5 9.5 2.5H11.5C12.8964 2.5 13.5947 2.5 14.156 2.69641C15.1613 3.0482 15.9518 3.83866 16.3036 4.84402C16.5 5.40533 16.5 6.10355 16.5 7.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg><span class="ayy-menu__item-text"><span>Duplicate</span><span id="menu-duplicate-hint-lg" class="ayy-menu__description">Keeps the pages, not the people</span></span></button>
    <button type="button" role="menuitem" tabindex="-1" class="ayy-menu__item"><svg class="ayy-icon" data-ayy-icon="share-2" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M21 6.5C21 8.15685 19.6569 9.5 18 9.5C16.3431 9.5 15 8.15685 15 6.5C15 4.84315 16.3431 3.5 18 3.5C19.6569 3.5 21 4.84315 21 6.5Z" stroke="currentColor" stroke-width="1.5"></path><path d="M9 12C9 13.6569 7.65685 15 6 15C4.34315 15 3 13.6569 3 12C3 10.3431 4.34315 9 6 9C7.65685 9 9 10.3431 9 12Z" stroke="currentColor" stroke-width="1.5"></path><path d="M21 17.5C21 19.1569 19.6569 20.5 18 20.5C16.3431 20.5 15 19.1569 15 17.5C15 15.8431 16.3431 14.5 18 14.5C19.6569 14.5 21 15.8431 21 17.5Z" stroke="currentColor" stroke-width="1.5"></path><path d="M8.72852 10.7495L15.2285 7.75M8.72852 13.25L15.2285 16.2495" stroke="currentColor" stroke-width="1.5"></path></svg>Share<span class="ayy-menu__value">Team</span></button>
    <div role="separator" class="ayy-menu__separator"></div>
    <button type="button" role="menuitem" tabindex="-1" class="ayy-menu__item ayy-menu__item--destructive"><svg class="ayy-icon" data-ayy-icon="trash" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M19.5 5.5L18.8803 15.5251C18.7219 18.0864 18.6428 19.3671 18.0008 20.2879C17.6833 20.7431 17.2747 21.1273 16.8007 21.416C15.8421 22 14.559 22 11.9927 22C9.42312 22 8.1383 22 7.17905 21.4149C6.7048 21.1257 6.296 20.7408 5.97868 20.2848C5.33688 19.3626 5.25945 18.0801 5.10461 15.5152L4.5 5.5" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path><path d="M3 5.5H21M16.0557 5.5L15.3731 4.09173C14.9196 3.15626 14.6928 2.68852 14.3017 2.39681C14.215 2.3321 14.1231 2.27454 14.027 2.2247C13.5939 2 13.0741 2 12.0345 2C10.9688 2 10.436 2 9.99568 2.23412C9.8981 2.28601 9.80498 2.3459 9.71729 2.41317C9.32164 2.7167 9.10063 3.20155 8.65861 4.17126L8.05292 5.5" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path><path d="M9.5 16.5L9.5 10.5" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path><path d="M14.5 16.5L14.5 10.5" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path></svg>Delete</button>
  </div>
</div>
```

React:

```tsx
import { Copy01Icon, Delete02Icon, PencilEdit02Icon, Share08Icon } from "@hugeicons/core-free-icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  Icon,
} from "@danitesler/ayywi/react";

const items = (
  <>
    <DropdownMenuLabel>Project</DropdownMenuLabel>
    <DropdownMenuItem icon={<Icon icon={PencilEdit02Icon} name="square-pen" />} shortcut="Mod+E">
      Rename
    </DropdownMenuItem>
    <DropdownMenuItem icon={<Icon icon={Copy01Icon} name="copy" />} description="Keeps the pages, not the people">
      Duplicate
    </DropdownMenuItem>
    <DropdownMenuItem icon={<Icon icon={Share08Icon} name="share-2" />} value="Team">
      Share
    </DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem destructive icon={<Icon icon={Delete02Icon} name="trash" />}>
      Delete
    </DropdownMenuItem>
  </>
);

export default function Example() {
  // static keeps each menu in the page, so the three sizes can be compared side by side.
  return (
    <div className="ayy-cluster" style={{ alignItems: "flex-start" }}>
      <DropdownMenu size="sm">
        <DropdownMenuContent static aria-label="Project actions, small">
          {items}
        </DropdownMenuContent>
      </DropdownMenu>
      <DropdownMenu>
        <DropdownMenuContent static aria-label="Project actions, medium">
          {items}
        </DropdownMenuContent>
      </DropdownMenu>
      <DropdownMenu size="lg">
        <DropdownMenuContent static aria-label="Project actions, large">
          {items}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
```

---
Part of @danitesler/ayywi 0.1.2: load `dist/ayywi.min.css` (and `dist/elements.global.js` for the <ayy-*> elements). The rules every screen follows: [llms-full.txt#rules](../llms-full.txt#rules). Every component: [llms.txt](../llms.txt).
