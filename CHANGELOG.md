# Changelog

All notable changes to ayywi. Semver: renaming or removing a class, token or prop is a breaking change.

## Unreleased

### Added
- **Settings pattern**: settings open full screen in the app's own frame, as in Notion and Cursor. `ayy-app-shell--settings` (React `AppShell settings`) swaps the sidebar for an `ayy-app-shell__back` link ("Back to <app>", React `AppShellBack`), an `ayy-app-shell__title` (`AppShellTitle`) and the settings sections, and centres one section in the main under a Top bar whose back button shows on phones only. Below 48rem it's two screens: the section list when no section is current, the section when one is. Esc leaves settings (outside text fields and open overlays). `appShellSettingsClass`, `appShellBackClass`, `appShellTitleClass`, `appShellBackIcon`.
- **Patterns** in the contract (`PATTERNS` in `scripts/lib/contract.mjs`): whole-screen recipes with phone behaviour and the measurements apps must not restyle, rendered into `manifest.patterns`, llms-full.txt, llms.txt, `llms/pattern-<slug>.md`, the AGENTS snippet and the MCP server (`get_rules`, and `search` ranks them first). The first is Settings, which also fixes one spec for sidebar items and settings rows. `pnpm check` verifies each pattern's components and example exist.
- 12 components that Teyykit and Dooduu each had to build for themselves, plus the phone basics, 66 in total:
  - **Calendar** (Forms): a month of day buttons, six weeks so the height never jumps, one Tab stop with arrow keys (mirrored in RTL), PageUp/PageDown for months. Today is ringed, the picked day filled, days outside `min`/`max` crossed out but focusable. `__presets` (Today, Tomorrow, Next week; `data-date` takes `+N` days) and a `__footer` for a time or Clear. `--full` fills a phone screen. `ayy-date-picker` is a field-like trigger that opens one in a popover. `calendarMonth()`, `calendarKeyTarget()`, ISO date helpers, `connectCalendar()`, `<ayy-calendar>`, React `Calendar`, `DatePicker`.
  - **Swatch** (Forms): colour choices as round swatches over native radios (or `<button aria-pressed>`), a ring and a tick when picked, `--none` for "no colour", `--custom` around an `<input type="color">`; `ayy-swatch-group` (`--track` for a pill track). Colour comes from the new `--ayy-swatch` hook. React `Swatch`, `SwatchButton`, `SwatchCustom`, `SwatchGroup`; `syncSwatch()`.
  - **Toolbar** (Actions): a row (or `--vertical` rail) of icon buttons with `__group`s, `__separator`s and a `__spacer`; `--floating` over a canvas, `--scroll` on phones, `--sm`. One Tab stop with arrow keys (`connectToolbar()`); `<ayy-toolbar>` toggles `aria-pressed` and keeps one pressed per `data-exclusive` group. React `Toolbar`, `ToolbarButton`, `ToolbarGroup`, `ToolbarSeparator`, `ToolbarSpacer`.
  - **Command palette** (Actions): a search field over grouped items, filtered as you type, arrows and Enter to run; inline or as a dialog near the top opened with ⌘K / Ctrl+K. Items show an icon, a shortcut and a count. `connectCommand()`, `commandMatches()`, `<ayy-command shortcut>`, React `Command`, `CommandDialog`, `CommandGroup`, `CommandItem`.
  - **Floating action button** (Actions): `ayy-fab`, the screen's main action floating at the bottom inline-end corner (`--extended` with a label, `--secondary`, `--sm`, `--inline`). As a direct child of `.ayy-app-shell` it sits in the shell's corner and above the bottom nav on phones. React `Fab`.
  - **Top bar** (Navigation): a phone screen's header with a back button (a directional chevron and the previous screen's name), the title and actions, sticky and clear of the notch; `--center`, `--large`, `__subtitle` and a second `__row` for a search bar. Edge to edge as the first child of `.ayy-app-shell__main`. React `TopBar`.
  - **Search bar** (Forms): a rounded search field with a clear button that only shows while there's text, and an optional Cancel; `--lg`. `ayywi/elements` makes the clear buttons work. React `SearchBar`; `clearSearchBar()`.
  - **Tag input** (Forms): typed text becomes removable chips (Enter, a comma or a pasted list), Backspace removes the last, changes are announced; optional suggestions use the combobox listbox. `addTags()`, `splitTags()`, `connectTagInput()`, `<ayy-tag-input>`, React `TagInput`.
  - **Shortcut** (Forms): shortcuts written once as `"Mod+Shift+K"` and drawn for the device (⌘ ⇧ K on Apple devices, Ctrl Shift K elsewhere), read aloud as words; a recorder button (`ayy-shortcut-recorder`: click, press the keys, Esc cancels, Backspace clears) and `ayy-shortcut-list` for a help sheet. `shortcutFromEvent()`, `matchShortcut()`, `shortcutKeys()`, `connectShortcutRecorder()`, `<ayy-shortcut-recorder>`, React `Shortcut`, `ShortcutRecorder`, `ShortcutList`, `ShortcutListItem`. `ayywi/elements` redraws static shortcuts for Apple devices on load.
  - **Settings** (Forms): preference rows (label and hint at the start, the control at the end, wrapping under on phones) grouped under a heading in a card; `--plain` without the card, `__row--stack`, and `__link` rows that open a sub-page with the current value and a chevron (`--destructive` for Sign out). React `Settings`, `SettingsRow`, `SettingsLink`.
  - **Progress ring** (Feedback): progress as a ring from `--ayy-value`, clockwise from the top in every direction, with an optional label in the middle; `--sm` to `--xl`, the Progress colours, `--indeterminate`. React `ProgressRing`.
  - **Swipe actions** (Data display): a list row that slides to show action trays at either end (`__actions--start`, `__actions--end`, `__action` with status tints), with touch, pen or mouse, following the reading direction; keyboard focus shows a tray over the row. `connectSwipe()`, `<ayy-swipe>`, React `Swipe`, `SwipeAction`; `--ayy-swipe-bg` sets the row's background.

## 0.0.1 — 2026-10-07

First release, as `@danitesler/ayywi` on npm. Everything below it is pre-release history under the old internal numbers.

### Fixed
- Dropdown menu items (and theme toggle items) showed keyboard focus only as a faint wash; they get the focus ring now.
- Unselected tabs were muted text on the wash track: under 4.5:1 on raised surfaces in dark-soft and on light-gray's page. They're text-soft now (so are unselected segments), and `pnpm check` measures text on the wash in every theme.
- Outgoing chat bubbles had no edge in High Contrast.
- Invalid inputs, textareas, selects, checkboxes and radios relied on a red border that High Contrast erases; they get a dashed border there. Select gets the destructive focus ring when invalid, like Input, and Radio gets an invalid style.
- `llms.txt` linked to source files that aren't in the package; component links now point at a page per component (`llms/<slug>.md`).
- A Theme toggle saved the choice but nothing applied it on the next visit unless the page inlined `themeInitScript`. Connecting the toggle now restores it (`connectThemeToggle(…, { restore: false })` to opt out), and `dist/theme-init.js` does it before the first paint from a `<script>` tag.
- Prompts copied from Get started linked only the stylesheet and the script, so apps rendered in system fonts and Arial Black headings. They now load `fonts.css` and `theme-init.js` too, and the site hosts the font files.
- HTML examples spelled some attributes the React way (`inputMode`, `autoComplete`, `readOnly`); they're lower case now.
- The manifest listed three of the eight controllers and three of the seven `window.ayywi` helpers; both lists are read from the source now.
- The dialog footer's breakpoint was the only one in px (640px); it's 40rem.

### Removed
- **Breaking:** brands. `data-brand`, `setBrand()`, the `brands` / `BrandName` exports, `ayywi/brands/*.css`, the `ayywi.brand` cascade layer, `tokens/brands/*.json` and the violet brand are gone. Migration: override semantic tokens (`--ayy-color-primary`, `--ayy-color-ring`…) in your own CSS instead. The preview's Brand picker is gone too, and `pnpm check` tests text contrast per theme only.

### Added
- 18 components, 54 in total:
  - **Chart** (Data display): charts drawn by CSS, no library. Columns (`ayy-chart__bars` of `__column`s of `__bar`s, grouped or `--stacked`, values on hover or `--values`), lines and areas (`__svg` of `__series` with `__line` and `__area` paths in a 0–100 box, `__series--compare` dashed and quiet), value lines (`__tick`), `__labels`, a `__legend` with `__swatch`es, a ranked `ayy-bar-list` and a small `ayy-sparkline`. Bars and ticks take `--ayy-value` (0–100), colour comes from the new chart tokens in order (`--ayy-chart-color` overrides), lines mirror in RTL, High Contrast gets system colours. `chartScale()` rounds the top of the scale, `chartPath()` makes the paths (straight or monotone), `chartColors()` and `chartTheme()` hand the resolved colours to canvas libraries. React `BarChart`, `LineChart`, `Sparkline`, `BarList`, each with a data table for screen readers.
  - **Chip** (Forms): filters and choices as pills. `ayy-chip` on a label around a native checkbox or radio, or a `<button aria-pressed>`; on is a border, a wash and a tick; `__count`; `--removable` with an `__remove` button for the filters in force; `ayy-chip-group` (`--scroll` for one line). React `Chip`, `ChipButton`, `ChipRemovable`, `ChipGroup`.
  - **Choice card** (Forms): a card-sized radio or checkbox for plans, delivery options and add-ons, and `--compact` cards for time slots (a full one is struck through). `ayy-choice-group` (a fieldset grid, `--scroll` for a day strip, `__legend`), `ayy-choice-card` with `__title`, `__description`, `__meta`. React `ChoiceGroup`, `ChoiceCard`.
  - **Slider** (Forms): a native range input with a filled track (`--ayy-value`), and `ayy-slider-range`, two thumbs for a min and a max that can't cross. React `Slider`, `SliderRange`; `syncSlider()`.
  - **Number field** (Forms): a native number input between minus and plus buttons; the button that can't go further gets `aria-disabled`. `ayy-number-field` (`--sm`) with `__input`, `__decrement`, `__increment`. React `NumberField`; `stepNumberField()`, `syncNumberField()`.
  - **Combobox** (Forms): an input that filters a popover listbox as you type, with the WAI-ARIA combobox keyboard model; `data-keywords` for more words that match, `__meta` for the extra text, a hidden input for the form value. `connectCombobox()`, `<ayy-combobox>` (`manual` when you fetch the options), React `Combobox`.
  - **File upload** (Forms): `ayy-dropzone`, a label around a native file input that covers it, so clicking and dropping both work without a script; `data-dragging` while files are held over it; `--compact` for a form. React `Dropzone`; `trackDropzones()`.
  - **Page header** (Layout): the top of an app screen. `ayy-page-header` with `__title` (the `<h1>`), `__description` and `__actions` at the end (under the title on phones); a Breadcrumb or eyebrow can go first. React `PageHeader`, `PageHeaderTitle`, `PageHeaderDescription`, `PageHeaderActions`.
  - **List** (Data display): rows of people, threads, files or settings. `ayy-list` with `__item`, `__content`, `__title`, `__description`, `__meta`, and `__link`, which covers the row so it's one tab stop (`aria-current` marks the open row); `--divided` for settings rows, `--compact` for icon checklists. React `List` (`divided`, `compact`), `ListItem`, `ListContent`, `ListTitle` (`htmlFor` makes it the label of the row's switch), `ListDescription`, `ListMeta`, `ListLink` (`current`).
  - **Empty state** (Feedback): `ayy-empty-state` with `__title`, `__description`, `__actions` and an optional Icon tile; `--bordered`, `--compact`. React `EmptyState`, `EmptyStateTitle`, `EmptyStateDescription`, `EmptyStateActions`.
  - **Spinner** (Feedback): `ayy-spinner` (`--sm`, `--lg`), a `role="status"` ring in the text colour; still under reduced motion. React `Spinner` (`size`, `label`).
  - **Kbd** (Data display): `<kbd class="ayy-kbd">` keycaps for shortcuts. React `Kbd`.
  - **Input group** (Forms): an Input with a leading icon, `__addon` text (prefix, suffix, a Kbd hint) or a flush small button; the group draws the field and the focus ring. `--sm`, `--lg`. React `InputGroup` (`size`), `InputGroupAddon`.
  - **Segmented control** (Forms): one of two to five options as pill segments over native radios, drawn like the tabs list. `ayy-segmented-control` with `__option`; `--sm`, `--full`. React `SegmentedControl` (`value`/`defaultValue`, `onValueChange`, `name`, `size`, `full`), `SegmentedControlItem`.
  - **Pagination** (Navigation): previous, numbered pages with gaps, next; only previous, current and next on phones. `ayy-pagination` with `__link` (`--step` for previous/next) and `__ellipsis`. `paginationRange(page, count, siblings)` keeps the number of slots constant. React `Pagination` (`page`, `count`, `href` or `onPageChange`, `labels`).
  - **Accordion** (Layout): native `<details>` with hairlines between them; a shared `name` opens one at a time. `ayy-accordion` with `__item`, `__trigger`, `__content`. React `Accordion` (`single`), `AccordionItem` (`label`, `open`).
  - **Steps** (Navigation): progress through a short flow from `aria-current="step"` alone: done, current and to-do steps drawn by CSS; `--vertical`; in a narrow row only the current step keeps its visible label. React `Steps` (`steps`, `current`, `vertical`, `doneLabel`).
  - **Footer** (Navigation): the site footer. `ayy-footer` with `__inner`, `__brand`, `__nav`, `__group`, `__heading`, `__list`, `__link`, `__bottom`. React `Footer`, `FooterBrand`, `FooterNav`, `FooterGroup`, `FooterLink`, `FooterBottom`.
- **App shell with a bottom nav.** Put a `.ayy-bottom-nav` inside the shell (after the main) and below 48rem it becomes the tab bar while the sidebar hides; from 48rem the bottom nav hides. No media query of your own. A "More" tab (`<button class="ayy-bottom-nav__link ayy-app-shell__toggle">`, React `BottomNavButton`) opens the full sidebar as a drawer, so apps with more than five destinations keep all of them. The `__bar` puts the brand at the start and its actions at the end. New example "Tab bar on phones, with More".
- **Navbar phone menu.** A `.ayy-navbar__toggle` (React `NavbarToggle`, last in the navbar) folds the links into a panel under the bar below 48rem; Esc, a click outside, a link or widening close it. `connectNavbar(header)`, `<ayy-navbar>`, and React `Navbar` wires it itself. New example "Menu on phones".
- Button `loading` (React; `aria-busy="true"` and an `.ayy-spinner` in HTML): a spinner before the label, repeat clicks and submits ignored, still focusable. Button `block` (`ayy-button--block`) for full width.
- Card `featured` (`ayy-card--featured`): the recommended plan or the chosen option, a 2px border in the text colour.
- Table sorting and selection. An `ayy-table__sort` button in a `<th>` with `aria-sort` draws the arrows; an `ayy-table__select` cell holds a row's checkbox, selected rows carry `aria-selected`. `<ayy-table>` sorts the rows (by a cell's `data-sort-value`, else its text) and runs a select-all box; it fires `ayy-sort` (cancelable, to sort on the server) and `ayy-selection-change`. React `TableHead sort onSort`, `TableHead`/`TableCell select`, `TableRow selected`; `compareValues()` sorts numbers like "$1,240" and "12 GB" by value; `nextSortDirection()`; `connectTable()`. New example "Sortable columns and selectable rows".
- Input styles native date and time pickers (`type="date"`, `"time"`, `"datetime-local"`…): the picker follows the theme's colour scheme, the icon is muted. New example "Date and time".
- Chart tokens `--ayy-chart-1` … `--ayy-chart-6`, darker on light themes; `pnpm check` keeps each at 3:1 against every surface in every theme, and text at 4.5:1 on a bar list's tint of them. Also in the platform exports and the Tailwind mappings (`bg-chart-1`).
- `ayywi/elements` (and `elements.global.js`) fill sliders as they move, step number fields from their buttons and mark drop zones while files are dragged over, page-wide, so plain HTML needs no script of its own. `window.ayywi` gains `chartColors` and `chartTheme`.
- `dist/theme-init.js` (also `ayywi/theme-init.js`): `themeInitScript` as a file, for pages that load scripts rather than inline them.
- `dist/shadcn.css` (`ayywi/shadcn.css`): for a project that already uses shadcn/ui, its variables mapped to ayywi tokens, so the shadcn parts still there match the ayywi ones until they're replaced.
- `llms/<slug>.md`: one page per component (classes, props, a11y, do and don't, examples), linked from `llms.txt`, so an agent can fetch only the components it uses.
- Rules for data views (ayywi's charts, chips for filters, sortable tables, a chart library coloured with the chart tokens) and for picking a form control by the kind of choice. The AI skill covers charts, filters, sorting, picking values, uploads, a shop, Tailwind and shadcn/ui projects.
- Progress `variant`, the prop name Alert, Badge and Toast use. `tone` still works and is deprecated.
- Layout utilities `.ayy-spread` (items pushed to both ends) and `.ayy-split` (a main column and an aside that drops below without a media query), and `.ayy-truncate`. Children of `.ayy-stack`, `.ayy-cluster`, `.ayy-grid`, `.ayy-spread` and `.ayy-split` lose their block margins, so a `<p>` inside needs no reset; so do the first and last child of `.ayy-card__content`.
- Token `--ayy-opacity-disabled` (0.4). Every disabled control uses it; checkboxes, radios, switches and labels were 0.5 or 0.6.
- `ThemeToggle` `labels` and Carousel `slideLabel` (`data-slide-label` in HTML) for translation.
- Rules for apps (the App shell frame on every screen, a Page header on top, never a Navbar), for the loading, empty and error states of every list, table and page, and against custom breakpoints for navigation and layout. The website rule now names the NavbarToggle and the Footer. The AI skill has an Apps section, a states table and the new site pieces.
- `ayywi lint` checks inline styles (`style=""` and JSX `style={{}}`) for hardcoded and physical values, flags named colours (`red`, `white`…) and `border-*-left/right-radius`, and accepts `--max-warnings 0` as well as `--max-warnings=0`. It no longer reports wildcard token names in prose (`--ayy-color-*`) as unknown tokens. `ayywi init --force` refreshes the ayywi section of AGENTS.md (between markers) and leaves the rest of the file alone.
- MCP: `get_component` includes the status and the variants with their defaults; `get_rules` includes the utility classes and the custom properties you may set; the tool descriptions list every lint rule and token group.
- Preview: every component page has Copy for AI (the component's classes, props, rules and examples as markdown). The built site hosts `dist/ayywi.min.css`, `dist/elements.global.js`, `llms.txt`, `llms-full.txt`, the manifest and the AI kit, so prompts can point at them instead of a package. Each showcase app has a Build it with AI prompt.
- Preview: Get started is written for people who build with AI tools. The top shows the showcase apps, each with a Copy prompt to build this button, and a live theme and density switch. Then two doors. **I build with AI tools** (the default) is three steps: pick what you're building (dashboard, landing page, booking app, internal tool, online store, account pages) and edit the sentence it fills in ("Build me a … for … It needs …"); pick your tool (Lovable, Bolt, v0, Replit, Cursor, Claude Code, ChatGPT or Claude), which tunes the setup lines, and copy one prompt, with the setup and the class list folded under What's in the prompt; then six fix-it prompts for what usually goes wrong (phones, dark mode, custom styles, buttons, missing states, spacing). A before and after shows what the rules change. **I'm a developer** keeps the setups (link files, install, chat), the use cases, the checklist and the raw context files. Prompts copied from a local preview point at the public site (`VITE_AYYWI_SITE` overrides it), never at localhost.
- Preview: Get started's tool picker is a row of chips that wraps (it scrolled sideways on phones), its starters are Choice cards, every starter links a showcase app, and two more fix-it prompts cover filters and sorting, and charts. Prompts for Lovable, Bolt, v0 and Replit tell the tool to map Tailwind to ayywi, to link the shadcn bridge when the project has shadcn/ui, and to switch themes with data-theme; every prompt points at the per-component pages.
- Preview: prompts copied from the published site load ayywi from `v/<release>/dist/…`, a path whose files never change, so a later release can't restyle an app built from them. Each build publishes its runtime files there and lists them in `versions.json`; the Pages workflow runs `scripts/keep-versions.mjs` to carry earlier releases over, and takes the site's URL from `configure-pages` instead of a guess.
- Preview: two more showcase apps, Ember (an online store: category chips, a price range, a product grid, a cart drawer) and Haven (a class booking app: a day strip, style chips, class choice cards, a studio combobox, a spots stepper). Pulse has sparklines, a visitors line chart against last month, a sortable Views column and a traffic-sources bar list; Orbit filters tasks by project chips; Ledger's profile form takes a photo upload.
- Preview: the showcase iframes load their own bundle instead of the whole docs site (about 377 kB instead of 870 kB of script).
- Preview: the theme and density menu in the top bar is labelled Theme instead of being an unlabelled palette icon.
- Charts fade: bars toward their base (stacked parts stay solid), line and sparkline areas toward the floor (`ayy-chart__gradient`, drawn by React; a flat tint without it), bar-list rows along the row.
- Evals for the app frame, for list states, and for a sales page with a chart, channel filters and a sortable column.
- Mobile kit. **Bottom nav** (Navigation): `ayy-bottom-nav` with `__link` (icon over label, `aria-current="page"` adds a pill and a heavier label) and `__label`; sticky to the bottom, clears the home indicator. React `BottomNav`, `BottomNavLink` (`icon`, `current`). **App shell drawer**: add `ayy-app-shell__bar` (with an `__toggle` button) and below 48rem the sidebar becomes a drawer with the full tree that slides in from the inline-start edge over a scrim; focus moves in, the rest goes inert, Esc / scrim / a link close it. `connectAppShell(shell)`, `<ayy-app-shell>`, React `AppShellBar`, `AppShellToggle` (`AppShell` wires it itself). Shells without a bar keep the sideways row. **Bottom sheet**: `side="bottom"` / `ayy-dialog--side-bottom` on Dialog, full width on phones with a grab handle.
- The preview is usable on phones: the sidebar is the app shell's drawer, opened from a sticky top bar that also holds the theme and density menu.
- The preview has a What you can build page (`#/showcase`): five full screens made only from ayywi components, each in its own theme and density — Pulse, an analytics dashboard (dark, compact); Northwind, a marketing site (light, comfortable); Relay, a support inbox with AI replies (dark soft, comfortable); Ledger, account settings (light gray, touch); Orbit, a project tracker with onboarding and its empty, loading and error states (light, compact). The four apps share one frame: a sidebar on wide screens; on phones a top bar and a bottom nav (four tabs and More when there are more destinations). Each card opens a preview that loads the app in an iframe at desktop (1280), tablet (834) and mobile (390) widths, so its media queries respond as on a real device, with the prompt that builds it and links to the components it uses.
- The preview has a Changelog page (`#/changelog`) that renders this file, in the sidebar's Start group.
- Heading utilities `.ayy-h5` (18px) and `.ayy-h6` (16px, semibold). The preview's Do / Don't guidance is now spotlight cards titled with `ayy-h6`.
- App shell groups, sub-lists and collapses. `__group` with a `__group-label` heading over a `__list` (groups after the first get a hairline above); `__sublist` for one indented level of children under a link; `__collapse`, a native `<details>` whose link-styled `<summary>` toggles a `__sublist`, and a closed one that holds the current page is drawn bolder; `__link--sub` for child links. React `AppShellGroup` (`label`), `AppShellItem`, `AppShellSublist`, `AppShellCollapse` (`label`, `open`) and `AppShellLink` `sub`; helpers `appShellGroupClass`, `appShellGroupLabelClass`, `appShellListClass`, `appShellSublistClass`, `appShellCollapseClass`, `appShellLinkSubClass`. The phone row still shows top-level links only. The preview's sidebar now uses them instead of its own `pv-nav__*` rules.
- App shell (Navigation), the frame of a signed-in app: a viewport-high grid of a 15rem sidebar and a main column, each scrolling on its own. `ayy-app-shell` with `__sidebar` (an `<aside>`), `__brand`, `__nav`, `__link` (`aria-current="page"` adds a tint and a heavier weight; High Contrast fills it with the system highlight), `__footer` (pinned to the bottom) and `__main`. Below 48rem the sidebar stacks above the content as one row (brand, links, footer) that scrolls sideways. React `AppShell`, `AppShellSidebar`, `AppShellBrand`, `AppShellNav`, `AppShellLink` (`current`), `AppShellFooter`, `AppShellMain`; helpers `appShellClass` … `appShellMainClass`.
- Side modal. `side="start"` or `side="end"` on `DialogContent` (`ayy-dialog--side-start` / `ayy-dialog--side-end` in HTML) turns a Dialog into a full-height panel that slides in from that inline edge. It flips in RTL, takes its width from the size modifiers, and leaves 3rem of backdrop on phones. `<ayy-dialog>` drives it unchanged.
- `DialogBody` (`.ayy-dialog__body`): content that scrolls on its own between the header and the footer, with a hairline where it meets them. In a side modal it fills the height, so the footer stays at the bottom.
- Hugeicons is ayywi's icon library, with a new Icon component. `<Icon icon={Search01Icon} />` renders any icon from `@hugeicons/core-free-icons`, an optional peer: ayywi renders the icon data, so it still has no runtime dependencies. `iconSvg()` returns the same markup as a string for other frameworks and server templates. Icons take the text colour and follow the text size; `size` sets 16, 20, 24 or 32px. With `label` an icon is announced (`role="img"`); without one it's `aria-hidden`. `directional` mirrors arrows and other icons that point along the reading direction in right-to-left text; the nearest `dir` attribute decides.
- Tokens `--ayy-size-icon-sm`, `-md`, `-lg`, `-xl` (16, 20, 24, 32px), also in the platform exports.
- `ayywi lint` warns about imports from other icon sets (lucide-react, react-icons, Heroicons and others) and flags a hardcoded `color`, `fill` or `stroke` on an `.ayy-icon` SVG, which would hide the icon in one of the themes.
- An icon rule in the AI kit, `llms-full.txt` and the MCP server.

### Changed
- `dark-soft` is a near-black theme in the style of OpenCode instead of charcoal: a #0a0a0a page, #141414 cards (popovers a step up), white text, quiet grey descriptions and a subtler #262626 opaque border. Text, ring, primary and glow go from off-white to white; every text colour still meets WCAG AA.
- `--_ayy-dir` (the reading direction as a number, for mirrored icons and chart lines) moved from icon.css to base.css. It's private; nothing to change.
- `--ayy-value` is documented as the 0–100 hook it now is for Progress, Slider, chart bars and ticks, and bar-list rows.
- The showcase apps use only ayywi: page headers, lists, split layouts, segmented controls and footers replace the preview's own `pv-app-*` layout classes, and Ledger moved from a Navbar to the App shell like the other apps.
- Navbar links get the hover wash the app shell's links have, and High Contrast fills the current one with the system highlight instead of an outline. The navbar brand's focus ring is 2px off it, like everything else.
- App shell group labels are muted, like every other small uppercase label.
- The carousel's arrows and the theme toggle's sun and moon are Hugeicons (arrows mirror with `ayy-icon--directional` instead of a `[dir=rtl]` rule).
- Examples use logical sizes in rem and gap tokens instead of `width`/`max-width` in px and `margin: 0` fixes, since agents copy them.
- The component order and categories live in `scripts/lib/contract.mjs` only; the preview reads them from there.
- `pnpm check` also requires a forced-colors block for `aria-current`, `aria-invalid`, `aria-pressed` and `aria-expanded` states, a RULES entry that names every custom element, and a README whose component count and table match the components.
- **Breaking:** component guidance is Do and Don't only. `whenToUse` and `whenNotToUse` are gone from the metas and `manifest/components.json`; their points now open each component's `do` (what it's for) and `dont` (what it isn't for, and what to use instead), reworded to fit. The preview, `llms-full.txt` and the MCP server show two guidance cards instead of four. Migration: read `do` / `dont` from the manifest.
- **Breaking:** Theme toggle is a menu button. The icon button now opens a menu of System and every theme (Dark, Dark soft, Light, Light gray) instead of flipping between two. Migration: the button loses `aria-pressed` and gains `aria-haspopup="menu"` and `popovertarget`; add the `ayy-menu` popover of `ayy-theme-toggle__item` radio items after it (see the example). `<ayy-theme-toggle>` no longer takes `dark` / `light`; React `ThemeToggle` no longer takes `dark` / `light`, and renders the menu itself. `connectThemeToggle(button, menu, { onChange })` takes the menu as its second argument.
- `.ayy-dialog` is a flex column instead of a grid. Existing content lays out the same; the change lets `.ayy-dialog__body` take the leftover height.
- Dialog and Toast close buttons draw Hugeicons' Cancel01 icon (1.5px stroke) instead of a hand-drawn cross. `dialogCloseIcon` returns the new markup.
- Examples use Hugeicons: button, alert, dialog, and the dropdown menu, which now shows icons on its items.
- The preview shows what people choosing and briefing components need; the reference stays with the AI tools (manifest, MCP server, `llms-full.txt`). Component pages drop the CSS class, React API and accessibility tables and the import line, and example code sits behind a Code toggle. Foundations show swatches and visual scales instead of token/value tables; the palette, stacking, durations and fixed sizes are gone. The overview drops the architecture cards and the per-framework code tabs. The sidebar no longer lists page sections; `#/colors/status` style links still scroll to them.

## Pre-release-4 — 2026-09-29 (internal 0.4.0)

Everything needed to build a website (danitesler.com was the test case: its header, hero, portfolio grid, project cards, case studies and "say hi" chat), not only app screens. No breaking changes.

### Added
- 12 components, 33 in total:
  - **Navigation** (new category): `Navbar` (sticky glass header; anchor jumps land below it), `Breadcrumb` (plain or a blurred `pill`), `Contents` (`Toc`: on-page contents with a scrollspy, numbers, one level of nesting, sticky).
  - **Layout:** `Section` (page band with eyebrow, section number, fluid title and description; `center`), `Separator` (plain, `fade`, vertical), `Carousel` (scroll-snap strip with previous/next buttons; RTL-aware, no auto-play).
  - **Data display:** `Stat`, `Data list` (`<dl>`, stacked or `row`), `Frame` (browser window for screenshots), `Icon tile` (app icon lit by the content's accent), `Chat` (bubbles, typing dots, quick replies).
  - **Actions:** `Theme toggle`. The moon or sun comes from CSS (`light-dark()`), so it's right before JS loads; the button is `aria-pressed` and remembers the choice.
- Custom elements `<ayy-toc>`, `<ayy-carousel>`, `<ayy-theme-toggle>`, and framework-free `connectToc()`, `connectCarousel()`, `connectThemeToggle()`.
- Button `ring` variant: a gradient ring that spins while hovered or focused. The showcase call to action, one per view.
- Card `ayy-card__media` (edge-to-edge image or video that zooms on hover) and `ayy-card__link` (the title link covers the whole card). React `CardMedia`, `CardLink`.
- Tabs `ayy-tabs__count`: a count after a tab's label.
- Page utilities: `.ayy-container`, `.ayy-grid`, `.ayy-display`, `.ayy-text-outline`, `.ayy-accent-text`, `.ayy-link`, `.ayy-prose`, `.ayy-skip-link`, `.ayy-bg-grid`, `.ayy-scroll-progress` and `.ayy-reveal`. The last two use CSS scroll timelines: no JS, off under reduced motion, hidden or static where unsupported.
- Tokens: `space.20/24/32` (section rhythm), `size.container` (1400px), `size.measure` (reading width), `size.header` (navbar height), `text.display` (fluid, 44–200px), `leading.display`, `tracking.display`, `shadow.frame`. Tailwind: `text-display`, `max-w-page`/`max-w-measure` (v3) or `--container-page`/`--container-measure` (v4), `shadow-frame`.
- Public hooks `--ayy-min` (grid column width) and `--ayy-slide` (carousel slide width). `--ayy-spot` now means "the content's accent" for everything inside, not just the card spotlight.
- Rules: colour comes from content via `--ayy-spot`; a page anatomy (skip link, navbar, sections, one call to action); images need a size, screenshots go in a Frame.
- `ayywi lint` warns about `<img>` without `width` and `height` (`img-size`).
- `pnpm check` also enforces 4.5:1 for every accent used as text, in every theme.
- The AI skill has a websites section mapping page parts to components.

### Changed
- `.ayy-card__header` lines its children up at the start instead of stretching them. Badges no longer fill the header's width; a block that should span it needs `align-self: stretch`.

### Fixed
- Platform token exports skip fluid values (`clamp()`) instead of writing invalid Swift and Kotlin.

## Pre-release-3 — 2026-09-28 (internal 0.3.0)

### Added
- Two more themes:
  - `dark-soft` lowers the contrast: a charcoal background (#1e1e1e) instead of black and off-white text, about 13:1 instead of 21:1.
  - `light-gray` puts white cards and panels on a grey page (#ebebeb) with full-strength text, so surfaces stand out more than in the all-white theme.

  Every text colour meets WCAG AA in both. Use `data-theme="dark-soft"` or `setTheme("light-gray")`. Themes live in `tokens/themes/*.json`, so adding one is a single file.
- `themes`, `themeBase` and `ThemeName` exports, plus `getColorScheme()`, which returns "dark" or "light" for any theme.
- Per-theme platform exports: `dark-soft.json` and `light-gray.json`, SCSS maps `$ayy-dark-soft` and `$ayy-light-gray`, Swift `AyywiColors.darkSoft`/`.lightGray`, Compose `AyywiDarkSoftColors`/`AyywiLightGrayColors`.
- Component categories (Actions, Forms, Layout, Overlays, Feedback, Data display). Every component's meta has a `category`, and the manifest, llms files and the MCP `list_components` tool group by it.
- Colour categories (Surfaces, Text, Lines, Interactive, Status, AI, Effects) on the colour tokens, in the manifest and the generated `tokens` table.
- `ayywi lint` flags unknown `data-theme` and `data-density` values (e.g. `data-theme="dim"`) and lists the valid ones.
- `pnpm check` enforces 4.5:1 contrast for every text colour on every surface, in every theme and brand. That includes status text on a 15% tint of itself (badges, alerts, destructive buttons).
- Preview: the sidebar is grouped into Foundations and component categories, with search (`/` or Ctrl/⌘K). Colors lists its categories (Themes, Surfaces, Text, Lines, Interactive, Status, AI, Effects, Accents, Palette), and each one jumps to its section. The Tokens page is split into Colors (every theme side by side), Typography, Spacing & sizing, Radius & elevation, and Motion.

### Changed
- Light-theme status colours are one shade darker: destructive, success, warning, info and AI-active. They passed on white but not on their own tints: destructive text on the destructive button's hover fill measured 3.6:1.
- `getResolvedTheme()` can return the new themes: `ResolvedTheme` is now `ThemeName`. If you only need light or dark, use `getColorScheme()`.
- The Tailwind `dark:` variant matches every dark theme (`[data-theme^=dark]`).
- The violet brand no longer overrides `--ayy-color-ai-active`; the override matched the default anyway.
- Preview: the LTR/RTL toggle is gone. RTL is still covered by the browser tests.

### Fixed
- The Swift token export declared `switch` without backticks, which isn't valid Swift.

## Pre-release-2 — 2026-09-28 (internal 0.2.0)

ayywi now lives in its own repository: https://github.com/danitesler/ayywi.

### Breaking
- **`ayywi/behaviors` and `dist/behaviors.global.js` are gone.** Use `ayywi/elements` / `dist/elements.global.js`. Migration:
  - Tabs: wrap in `<ayy-tabs class="ayy-tabs" value="…">` and give tabs/panels matching `data-value`s (ids and `aria-controls` are wired for you).
  - Dialog: `data-ayy-dialog-open="id"` / `data-ayy-dialog-close` → wrap trigger + `<dialog>` in `<ayy-dialog>`, use `data-ayy-open` / `data-ayy-close[="value"]`.
  - Tooltip: `<span class="ayy-tooltip">` → `<ayy-tooltip class="ayy-tooltip">` for Esc and edge flipping (CSS-only still works).
  - Card spotlight: works as before once `ayywi/elements` is loaded.
- `ayywi.css` is now in cascade layers. Unlayered app CSS — including global resets — now beats ayywi. Use `ayywi.unlayered.css` for the old behaviour (see README → Cascade layers).
- `ayywi/fonts.css` now self-hosts the fonts from the package. The Google Fonts version moved to `ayywi/fonts-google.css`.
- Control heights, paddings and font sizes come from density tokens. The default (`compact`) matches 0.1 exactly; coarse pointers now get `touch` sizes unless `data-density` is set.

### Added
- 9 components: Avatar (+ group), Select, Checkbox (with indeterminate), Radio group, Popover, Dropdown menu, Toast, Alert, Skeleton. 21 in total.
- Custom elements for every interactive part: `<ayy-tabs>`, `<ayy-dialog>`, `<ayy-popover>`, `<ayy-menu>`, `<ayy-tooltip>`. Light DOM, SSR-safe, events `ayy-value-change`, `ayy-open-change`, `ayy-select`.
- `toast()` (framework-free, no provider; `toast.success/warning/error/info/dismiss`), `configureToaster()`, React `<Toaster>` for options. Toasts stay clickable above modal dialogs.
- Density: `data-density="compact|comfortable|touch"`, automatic touch sizing on coarse pointers, `setDensity()` / `getDensity()`.
- Token tiers: `palette.*` primitives under the semantic tokens (all semantic values unchanged). Brands: `data-brand` + `dist/brands/*.css`, generated from `tokens/brands/*.json`; ships `violet`. `setBrand()`.
- Windows High Contrast (`forced-colors`) support in every stateful component.
- Dialog exit animation; tooltips render in the top layer and flip at viewport edges.
- `"use client"` on the React build (Next.js App Router).
- Token exports in `dist/tokens/`: dark/light/density JSON, SCSS, SwiftUI, Jetpack Compose.
- `ayywi` CLI: `lint` (checks app code against the contract), `init` (installs the AI kit + MCP config), `mcp` (MCP server with component, token, rule and lint tools).
- Tests: Playwright + axe (every page in both renderers, interactions, density, brands, RTL, forced colors, dist bundle) and node tests; CI workflow.
- `evals/`: measures whether the AI kit improves agent output.
- `pnpm check` now also verifies React exports and props ↔ meta, custom elements ↔ meta, forced-colors coverage, brand files, and lints every example.

### Fixed
- Floating elements measured while their entry animation scaled them, drifting a few pixels in RTL.
- A failed avatar image showed the browser's broken-image icon over the initials.

## Pre-release-1 — 2026-09-28 (internal 0.1.0)

First release.

### Added
- Tokens in `tokens/tokens.json` (DTCG-style, dark + light), generated to `--ayy-*` CSS custom properties and a typed `tokens` object. 98 tokens: colour, accents, type, spacing, sizes, radius, elevation, motion, z-index. Light-theme status colours meet WCAG AA for text.
- 12 components as a framework-agnostic CSS class contract with React wrappers: Button, Card, Badge, Input, Textarea, Field (Label/Hint/Error), Switch, Tabs, Dialog, Tooltip, Progress, Table.
- Zero runtime dependencies: native `<dialog>`, `role="switch"` checkboxes, a small tabs implementation, CSS tooltips.
- RTL support via logical properties throughout; everything is prefixed (`--ayy-*`, `.ayy-*`) so it can't collide with host apps.
- Framework-free JS: class helpers (`buttonClass()`…), `setTheme()` / `getTheme()` / `themeInitScript`, `cssVar()`.
- `ayywi/behaviors` + `dist/behaviors.global.js` for plain-HTML interactivity (replaced in 0.2.0).
- Tailwind v3 preset and v4 `@theme` mapping.
- Component browser (`pnpm preview`) with theme, direction and React/plain-HTML toggles.
- AI layer: `manifest/components.json`, `llms.txt`, `llms-full.txt`, consumer kit in `ai/` (Claude skill, AGENTS snippet, Cursor rule), maintainer `AGENTS.md`, `CLAUDE.md` and the `ayywi-add-component` skill.
- `pnpm check`: enforces tokens-only colours, logical properties, `ayy-` prefixes, docs ↔ CSS sync, and up-to-date generated files.
