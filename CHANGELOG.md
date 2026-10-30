# Changelog

All notable changes to ayywi. Semver: renaming or removing a class, token or prop is a breaking change.

### Format rules
- Title on row 1 (with link to component if applicable): `- **[<Component>](#/<slug>)**`
- Description on row 2 indented: `  <was X> → <now Y>`
- Keep entries short, specific, and focused on what changed without internal implementation details.
- Within each release and category, group changes to the same component or area under one title, with an indented bullet for each change; mark breaking changes clearly.

## Unreleased

### Added

- **Icons page**
  Packs were picked from a dropdown with a code snippet below → a centered tab per pack, a preview limited to five rows of icons, and a copyable AI prompt (with the code as a second tab) for using the pack.

- **[Scrollbar](#/scrollbar)**
  New component — a thin scrollbar with no track that follows the theme, for any scroll container or the whole page.

- **Themes**
  - Six ready-made themes (Default, Ember, Forest, Arctic, Twilight, Wine), each in light and dark, and a custom theme with adjustable surfaces, text colour and contrast; Ember, Forest, Wine and the others also bring their own corners, fonts or icon pack.
  - Themes could only be light or dark, and Custom had no density → a Mode control (Auto, Light, Dark) applies to every theme, Auto following the device; Custom also has a Density setting (Auto, Compact, Comfortable, Touch) that applies to the site along with the theme.
  - Ten font pairings from Google Fonts (Editorial, Serif, Sans, System, Grotesk, Technical, Friendly, Display, Readable and Default) pick the heading and body fonts together, and each themed preset uses a different one.
  - Choosing an icon pack in Custom showed nothing until Use → the live preview draws a row of sample icons in the pack as you pick it.

- **Preview**
  - No design principles → a Principles page under Docs with five rows (agent-first, cross-platform, adaptive, customizable, built for what's next), each with a pointer spotlight and a small sketch that plays on hover.
  - No guidance for illustrations → an Illustration page under Foundations: where these sketches belong and where they don't, how to draw them, how they move, and a timeline of one sketch's beats.
  - No home page → a home page at the site root: what ayywi is, a collage of live components, what themes, components, agent setup and the example apps offer, and a footer.
  - Components had no overview → `#/components` shows every component as a live card, grouped by category.

- **[Card](#/card)**
  A card always had a fill and a shadow → a `transparent` option drops both, so a spotlight card can sit on a plain page as a list row.

- **Components**
  No way to say one component is a variation of another → an optional `family` in a component's meta.json (Textarea, Number field, Search bar and Inline edit name Input); the preview nests them under it and `pnpm check` rejects a family that doesn't exist.

- **[Block editor](#/block-editor)**
  New component — a Notion-style rich text editor of blocks (text, headings, lists, to-dos, toggles that hide what is nested under them, tables with row and column grips that follow the pointer and hide when it leaves, drag to reorder, sorting, resizable columns that the table follows (it is only as wide as they are, and a corner button fits it to the block once), a first table of two columns, quotes, callouts, highlighted code with a language picker and Copy, images, embeds, files) with / for blocks, Markdown shortcuts, a formatting bar, @ mentions, drag handles, block menus that open beside their item, and `<ayy-block-editor>`, including callout colours shown as dots, highlight, record links, and equations with your own renderer.

- **[PIN input](#/pin-input)**
  New component — a row of single-character slots for OTP, two-factor and verification codes, with paste distribution, Backspace navigation, masked PIN mode and `<ayy-pin-input>`.

- **[Rating](#/rating)**
  New component — a 1–5 star score picker built on native radio inputs (with optional half-star steps and click-to-clear) plus a read-only fractional star display.

- **[Transfer list](#/transfer-list)**
  New component — two searchable, selectable lists (available and chosen) with buttons to move checked or all items across, plus `<ayy-transfer-list>`.

- **[Mentions](#/mentions)**
  New component — a textarea that opens a caret-anchored suggestion list when `@` or `#` is typed, with keyboard navigation and `<ayy-mentions>`.

- **[Button](#/button)**
  No split button variant → added `SplitButton` (`.ayy-button-split`, `.ayy-button-split--block`) to fuse a primary action button with a trailing dropdown menu trigger.

- **[Tree](#/tree)**
  New component — a folder, file or record hierarchy with expandable groups, one selected row, arrow-key navigation and `<ayy-tree>`.

- **[Property list](#/property-list)**
  New component — a record's attributes as a definition list of muted terms and values, with a compact variant and a muted empty value.

- **[Record picker](#/record-picker)**
  New component — a tag field whose chips are records picked from a list, for one assignee or several labels, with filtering, a create row and `<ayy-record-picker>`.

- **[Icon picker](#/icon-picker)**
  New component — a searchable grid of icons and emoji with a remove button, for marking a column, project or page, with `<ayy-icon-picker>`.

- **[Inline edit](#/inline-edit)**
  New component — a value that becomes an input in place, saving on Enter, blur, or ⌘Enter in a growing textarea, with IME-safe Enter and a title variant.

- **[Settings](#/settings)**
  - Appearance settings had no picture picker or reusable appearance rows → added `SettingsPicker`, `SettingsOption` and `SettingsScreen` (`ayy-settings__picker`, `ayy-settings__option`, `ayy-settings__preview`, `ayy-settings__caption`, `ayy-settings__screen`) for visual options with miniature token-drawn screens (including split light/dark for System), `data-motion="reduce"` for app-level reduced motion, a live `appearance` example at the bottom of the Settings page, and a contract rule to use them for theme, density, text size, brand colour, corners, font, motion, language, direction and reset.
  - Appearance choices opened from a button as a grid of large pictures → each one (Theme, Density, Text size, Brand colour, Corners, Font, Text direction) is a Select with pictures, lined up with the Language select.
  - Density and brand colour previewed the same miniature app as Theme → Density draws a list whose rows grow with the density (`variant="rows"`), and Brand colour shows where the colour lands: the chosen sidebar item, a progress bar, a checkbox and a button (`variant="brand"`).
  - Text size was a slider, Brand colour a row of swatches and Text direction a segmented control → each is a Select with "Aa" samples, colour previews and left-to-right / right-to-left screens; choosing Custom opens the colour picker straight away. The screens also mirror correctly on right-to-left pages.
  - Appearance offered Theme, Surface colour, Contrast, Density, Text size, Brand colour, Corners, Font and Icons → only Mode (System, Light, Dark) and Theme (the ready-made themes), since a theme decides the colour, surfaces, corners, fonts and icons; the contract rule says the same.

- **[Select](#/select)**
  - Options were text only → options can have pictures (`pictures` in React, `.ayy-select__picture` in HTML): the chosen one shows before the text, and the list shows each one larger next to its option.
  - Choosing the option that was already chosen did nothing → it fires an `ayy-choose` event (`onChoose` in React), so an option like Custom colour can act every time.

- **[Chart](#/chart)**
  - Colours, legend and hover card — a new first example on the Chart page shows every colour a chart can use as a swatch, the legend that switches series and the hover card on its own (`ChartTooltip`).
  - Legend that switches series — the legend entries in the Chart examples (columns, lines, areas, scatter, donut, pie, radar) are now buttons that hide and show their series, on any chart with `toggle` (`hiddenSeries` controls it), and `ChartLegend` can be used on its own. In plain HTML the same buttons work with the page-wide helpers.

- **[Table](#/table)**
  - One feature-rich preview → Simple and Medium previews now come before the full Playground.
  - Rows were fixed in place → drag a row by its handle (or use the arrow keys on it) to reorder; the demo now shows 10 rows per page.
  - Headers only sorted or resized → column menus now add icons, freeze columns, wrap content, open shared filters and groups, and insert editable columns on either side or at the end.
  - Column order was fixed → dragging column headers reorders columns with a drop line indicator (`reorderable` on `Table` / `TableHead`, `<ayy-table>` column reordering).
  - A table had no frame → `TableContainer` (`ayy-table-container`) holds a toolbar (title, description, search, column menu, actions) and a pager, and scrolls its table when given a max height.
  - One look and one density only → `spacious`, `bordered` (column lines), `sticky` (header and footer stay in view) and `fixed` (column widths from the header) join `compact`.

- **[Pagination](#/pagination)**
  No way to change the page size → optional "Rows per page" picker (`pageSize`, `pageSizeOptions`, `onPageSizeChange`).

- **[Toolbar](#/toolbar)**
  Basic tool rows only → Editor tools include dropdowns with hoverable submenus, the formatting bar includes text options, and the vertical rail includes an icon-only shape subtoolbar.

- **[Dropdown menu](#/menu)**
  An item could only open a submenu from the whole row → `DropdownMenuRow` keeps the row's action and adds a trailing ⋯ (`DropdownMenuMore`) that opens the item's own menu.

- **[App shell](#/app-shell)**
  Sidebar rows were links only → `ayy-app-shell__row` adds a trailing ⋯ (`AppShellMore`) that opens a menu for that destination, revealed on hover and focus.

- **Typography**
  Inline code and callout paragraphs had no type style → `.ayy-code` sets a token name or file path apart inside running text, and `.ayy-callout` sets a short note apart from body text.

- **[Drag and drop](#/drag-drop)**
  No standard drag and drop pattern → `Sortable`, `SortableItem`, `DragHandle`, `DropTarget`, `DragDropArea`, `<ayy-drag-drop>` and `connectDragDrop` with standard drop hover states and insertion lines.

- **[Tooltip](#/tooltip)**
  Icon button tooltips repeated full item names from `aria-label` → `generalActionLabel` keeps action tooltips general ("Edit", "Delete") while preserving full labels for screen readers.

- **Icon packs**
  Built-in icons were always Hugeicons → they, and the common app icons you name (settings, user, bell…), can now come from Lucide, Tabler Icons, Material Symbols or Feather, per page or section, with every theme.

- **[Icon](#/components/icon)**
  Icons could not be swapped for another pack's → an icon can carry a name, so the chosen pack can replace it.

- **Docs**
  No page listed the icons → an Icons page draws every icon name in each pack (Hugeicons, Lucide, Tabler Icons, Material Symbols, Feather), marks the ones a pack lacks, and shows how to load and pick a pack.

### Changed

- **Preview**
  - Spacing & sizing listed every step on its own row and compared control sizes in three cards → steps share two rows of true-size bars, and each size is a single line of controls.
  - Component documentation tabs were aligned to the start → they are centered under each component heading.
  - Home page agent block was one fixed terminal snippet → tabs for Quick start, npm package, No build and By hand, each with its own copy button, in a block that keeps one 320px height so the page doesn't jump between tabs.
  - Themes page previewed a full showcase app in an iframe → the same small report-card app, restyled live by the panel's colour, corners, fonts and theme.
  - Home page "Themes that fit your brand" showed a list of colour names → a small app (report card with stat, chart, form and buttons) you recolour live with colour swatches, a custom colour and a corner style.
  - One sidebar holding Start, Foundations and every component category → a header with Docs, Components, Examples and Themes tabs, search and appearance; Docs and Components each have their own sidebar, and old links like `#/button` or `#/colors` still open the same page.
  - Components were grouped by category in the sidebar → listed A–Z with a filter, each family opening to its members.
  - A component page was one scroll of examples and do's and don'ts → Overview, Properties and Accessibility tabs; Properties shows the React props, variants, states, sizes, classes and custom element attributes.
  - The Brand page under Foundations → a Themes tab that tries a colour, corners, fonts and theme on a live example app, and applies them to the site only on "Use this theme".
  - What you can build → an Examples tab with Apps and Websites filters.
  - The sidebar could collapse to a rail of icons → removed; the header carries the logo and search instead.
  - Component and Docs pages sat against the sidebar in a narrower column than Examples → their content is as wide as Examples (1200px at most) and centred in the space beside the sidebar, and each page's eyebrow, title and lede are centred like Examples'.
  - The Brand page had a separate hex text field and popover swatch for seed colour → replaced with native `<ColorSwatchCustom>` in the swatch group alongside preset themes.
  - The Brand page's Scale had a line describing the steps → the line is gone.
  - The ayywi mark stayed the text colour when a brand was applied → it takes the brand colour, in the sidebar and the phone bar.
  - Sidebar sections could not fold, and Start had no icons → every section but Start folds, and Start links have icons.
  - Get started asked people to pick an AI tool, then repeated a per-tool note → one short prompt that works in any AI builder (Lovable, Bolt, v0, Replit, a chat), with the tool picker and its notes removed.
  - Section titles sat 28px (36px on Get started) above their description → 12px.

- **Themes**
  - Twelve themes, six only dark and six only light, with lookalike pairs (Arctic and Paper, Twilight and Lavender, Wine and Blush…) → six themes that each work in light and dark, one per colour: Default, then warm, green, blue, purple, pink (**Breaking**: `ThemePreset` has no `theme` field, and the defaults are one `default` preset).
  - Surface offered Neutral, Subtle and Rich → only Neutral and Subtle, and every ready-made theme uses Subtle.
  - A theme with its own body font (DM Sans, Figtree, Literata, a system font…) looked smaller than Sora at the same size → that font is scaled to Sora's letter height, so text reads the same size in every theme; Sora, headings and code are unchanged.
  - A grid of theme pictures with a "Using themes" guide, a light-and-dark sample and the colour scale below → a list of themes in a sticky sidebar beside a large preview of a small website, with the theme's name and a Copy for... popover (AI prompt and code, as on component pages) above it; the guide and the sections under it are gone.
  - A theme reached the site only on Use this theme, and stayed after a reload → picking a theme or a mode applies it at once, and a reload or a new tab starts from Default again.
  - The list showed each theme's light and dark screens side by side with a line of description → one smaller picture in the chosen mode and just the name; the cog shows on the chosen theme and on hover.
  - Custom theme settings opened inline under the picker → a cog beside every theme opens its settings in a centred dialog, filled in with that theme and with the live preview beside them; Save keeps the theme if nothing changed and makes it Custom if something did, Cancel leaves everything as it was.
  - Strong tints mixed up to 16% of the accent into surfaces, which made Ember and Wine heavy and saturated → Surface is Neutral or a quiet Subtle tint, presets use Subtle, and the Custom dialog has six settings (Mode, Accent colour, Surface, Corners, Font, Density) instead of nine; with the Mono accent, Subtle makes the page a deeper black instead of tinting it.
  - The Customize cog blended into the Custom picture → it is a filled button, and the dialog is wider so the live preview gets most of the room.
  - The live preview borrowed its fonts and surroundings from the theme the site was using → the whole preview area, centred, wears the theme you picked.

- **[Icon picker](#/icon-picker)**
  Icons in the grid were about 16px and emoji 14–16px → icons 18px (the size of menu icons) and emoji 20px.

- **[Menu](#/menu)**
  - Item icons were 1.1em (about 15px) → 1.125rem (18px), the size the Block editor's menus already used, so menus look the same everywhere.
  - A submenu could only hold menu items → a submenu panel with `role="dialog"` can hold an Icon picker (or another control): focus lands on its first field, and picking closes the whole menu.

- **[Table](#/table)**
  - Column menu icons were generic arrows and copy/delete glyphs → the same insert-column, duplicate, sort and delete-column icons the Block editor's table menu uses; the Sort submenu now marks the current direction.
  - The playground's Filter bar with separate Status and Plan menus → three icon buttons next to search: Filters (Status, Plan), Sort (a column and direction) and Table options (Group by, Columns), with no chip bar under the toolbar.
  - The column menu's "Add icon" listed four icons as menu items → it opens an Icon picker with search, more icons and emoji; `<ayy-table>` takes the pick as the `icon` column action.
  - Sortable and draggable column headers showed a grab cursor and a faint up/down arrow on every column → the whole header cell is clickable with a pointer cursor, the header title lights up under the pointer, and the arrow appears only on the column that is sorted.
  - The playground's column menu opened from a three-dot button and sort was a click on the title → clicking the column title opens the menu, which now has a Sort submenu (ascending, descending) for every column, plus Duplicate, Hide and Delete; dragging the title still reorders. `<ayy-table>` handles `sort-ascending`, `sort-descending`, `duplicate`, `hide` and `delete` as column actions.
  - A header with a pinned actions column was 12px taller than the other tables' headers → the header is the same height as in the simple table.
  - Drag handle and expand button were control-sized (28px) → now 24px (20px in compact tables), so they no longer add height to a row.
  - Long cell text could run into the next column → cells and headers stay on one line and end in "…", and anything that doesn't fit is clipped at the column's edge; "Wrap content" (or `wrap`) opts a column back into wrapping.
  - Expand column was placed after the selection checkbox → moved before the checkbox so the order is Expand, Checkbox, then data columns.
  - Multiple separate preview examples (Basic, Sortable, Actions, Parts) → consolidated into a single comprehensive Playground with toolbar filters next to columns, groups, footer totals, inline editing, and bulk actions.

- **[Get started](#/)**
  A fill-in sentence ("Build me a … for …") and a codebase prompt → a step-by-step page: one quick-start prompt where the AI asks what you're building, who it's for and your brand colour, the codebase prompt (which now asks for the brand too), a four-step setup by hand and a CLI cheat sheet.

- **README**
  Three setup sections and an out-of-date prompt generator list → the same steps as Get started: a quick-start prompt that asks for your app and brand colour first, codebase install with a first component, MCP only, and the CLI.

- **[Popover](#/popover)**
  An Icon picker inside a popover left it open → picking an icon or emoji closes it.

- **[Empty state](#/empty-state)**
  Icon tile had a glowing gradient and a bright glyph → now a flat tile with a muted glyph, so it no longer competes with the title.

- **[Drag and drop](#/drag-drop)**
  Drag handle was control-sized (28px) → now 24px like the one in a Table row, and sits closer to the left edge of a sortable item.

- **[Dropdown menu](#/menu)**
  Three separate examples → one Item actions preview showing submenus, inline options, split rows, and shortcuts beside text or counters.

- **Contributor guidance**
  - New variations could get separate preview sections by default → reuse existing examples unless a separate example is necessary to demonstrate the variation clearly.
  - Changelog entries for the same area appeared separately → group them under one title within each release and category.

- **[Table](#/table)** (**Breaking**)
  Editable cells were always-on text inputs (`.ayy-table__edit` on an `<input>`) → they are Inline edit: the value reads as cell text, a click turns it into a field with the text in the same place, and Enter or blur saves. `TableEdit` now renders an Inline edit (`aria-label` names it, no `onChange`/`onFocus`/`onBlur`/`onKeyDown`), and HTML cells use `<ayy-inline-edit>` with `class="ayy-inline-edit ayy-table__edit"`; `ayy-cell-edit` and `onCellEdit` still report each save.

- **Docs**
  Component and pattern descriptions were long and full of attributes, sizes and variable names → each is now a short overview of what the thing is and what it's for. The Foundations pages (Brand, Density, Colors, Typography, Spacing, Radius & elevation, Motion) and the token descriptions now say what each thing is for.

- **Typography**
  Small all-caps labels (table headers, menu and select group labels, footer headings, the contents title, eyebrows) → now regular-weight muted text in normal case, the same style as group names in the App shell.

- **[Chart](#/chart)**
  - Hovering showed a one-line value on bars and dots only → every chart now opens a card with a title and a row per series (colour, name, value): columns, line and area points, scatter dots, slices, radar axes, gauges, funnel steps and waterfall steps. Lines also get a hairline and a marker on each series.
  - Stacked areas, radars, donuts, pies, gauges, scatter dots, funnels, waterfalls and stacked columns were flat colour → they now fade like the other charts.

- **[Color picker](#/color-picker)**
  `addonPosition` defaulted to `"start"`, so the HEX label sat before the hex value → it defaults to `"end"`, after the value.

- **[App shell](#/app-shell)**
  - The collapsed rail scrolled, with a scrollbar beside its icons → it no longer scrolls.
  - The docs page ended with the Playground and Nav examples → it now ends with a Parts example: one shell showing every piece (brand, logotype, toggle, groups and section titles, items, links, action, sublist, collapse, footer, resize, main, detail). The Nav example is removed.
  - Examples started with the Big sidebar → they start with Medium (the component's default is still Big).
  - Group headings were small uppercase with a divider between groups, and links were muted → headings are dim sentence case with no divider, links read at full text colour in regular weight, and the current page is a medium-weight tint.

- **Tokens**
  - Small text and control text were 12px in compact density (and `--ayy-text-xs` 12px everywhere) → 13px, so compact and comfortable now share 13px (touch stays 14px; `--ayy-control-text-field` is 13px on both, 16px on touch).
  - Large control height was 40 / 48 / 52px (compact / comfortable / touch) → 36 / 44 / 48px (`--ayy-size-control-lg`).

### Fixed

- **Linter**
  A `hidden` input or other control was reported as a raw browser control → hidden ones are skipped, since they never show.

- **[Dropdown menu](#/menu)**
  - A key pressed right after a submenu panel opened (an arrow into an Icon picker's grid) could be undone, focus jumping back to the panel's first field → focus stays where the key moved it.
  - Hovering ⋯ opened its menu and could leave its highlight stuck → click opens the menu and moving away clears the pointer highlight.
  - A tooltip on a menu trigger could prevent the menu from opening → menus and popovers consistently find their own panel.
  - The arrow keys, Home and End inside a submenu closed it and moved focus in the menu behind → they move through the submenu's own items.
  - A React `DropdownMenuSub`'s `open` and `defaultOpen` changed `aria-expanded` but not the panel → they show and hide the flyout (it waits for its parent menu to be open).

- **[Inline edit](#/inline-edit)**
  The text jumped a few pixels and changed size when you clicked a value to edit it → the field keeps the same padding, font and line height as the value, so the text stays where it was.

- **[Drag and drop](#/drag-drop)**
  - Dragging large lists and tables felt sluggish and table labels could drift away → dragging uses fewer resources, labels stay beside the pointer, and highlighted rows make the drop position clearer.
  - Dragging a table row caused neighboring column widths to expand and shift → drop edge pseudo-elements are excluded on table rows, rendering insertion markers via cell box-shadows.

- **[Table](#/table)**
  - Row drag handles, collapse buttons, and checkboxes sat at different heights → all three share the row's vertical center.
  - Narrow status badges let text spill outside their pills → labels stay on one line and truncate inside the badge, with column wrapping on or off.
  - Multiple frozen columns overlapped and resized tables could leave unused space → frozen columns stack correctly and tables fill their container, including when no data columns are visible.
  - Wide tables scrolled every column away → `pin` keeps a column at the start or end (`ayy-table__pin`, `ayy-table__pin--end`), and `resizable` headers get a drag-or-arrow-keys resize handle (`ayy-table__resize`).
  - Rows could only be plain or selected → rows can expand into a detail row (`TableExpand`, `TableRow detail`), head a group (`TableGroup`), open a link from anywhere in the row (`TableRowLink`), be disabled (`aria-disabled`), or show an empty message (`TableEmpty`); `aria-busy` on the table dims rows while they load.
  - Long text and people columns needed custom markup → `truncate` ends text in "…" (`ayy-table__truncate`), and `TableMedia` / `TableSecondary` put an avatar, a name and a muted second line in a cell.
  - `<ayy-table>` sorted and selected only → it also expands rows, resizes columns, ticks a range of rows on Shift+click, selects or clears rows by dragging across them (`connectTableDragSelect`), edits cells inline (`TableEdit`, `ayy-table__edit`, `connectTableEdit`), and keeps detail rows with their row and group rows in place when sorting.
  - Pinned columns lagged when hovering table rows due to a fade transition on rows → transitions removed so pinned and normal cells highlight simultaneously.
  - A row header (`<th scope="row">`) in the body looked like a column header (uppercase, muted) → it reads like the other cells.
  - Selected rows had an 8% tint that took muted text under 4.5:1 contrast in the light themes → a 4% tint and a 2px bar on the row's start edge.

- **[Toolbar](#/toolbar)**
  - Tools inside popovers missed arrow navigation → popup subtoolbars now keep their own keyboard navigation and selected state.
  - A vertical rail also stacked its popup's tool groups → nested subtoolbars keep their own orientation.

- **[App shell](#/app-shell)**
  - Sidebar closing lagged behind the content → both now move together smoothly.
  - Collapsed rail at comfortable and touch showed a sliver of each item's label, and those icons no longer lined up with the icon-only rows → the rail shows only the icon, at every size and density.
  - Nav groups always showed their links → a group can collapse (`ayy-app-shell__group--collapsible`, `collapsible` on `AppShellGroup`), with a chevron that shows on hover.
  - Settings sections could not fold → the Settings example has a Collapsible sections switch in its Props button, so the section headings fold like the sidebar's.
  - Icon links could not show an action row or a badge → `ayy-app-shell__link--action` puts a link's icon in a circle (for "New"), and a `Badge` after a label ("Beta") keeps its size.
  - The sidebar's collapse toggle had no hint → it shows a tooltip on hover and focus that follows the state ("Collapse" / "Expand"), and its default label names the action too (`tooltip` / `tooltipSide` on `AppShellToggle`).

- **[Button](#/button)**
  Icon-only buttons needed an author-wrapped `<Tooltip>` → `size="icon*" | "icon-sm" | "icon-lg"` buttons automatically display their `aria-label` or `tooltip` in a tooltip on hover and focus.

- **[Segmented control](#/segmented-control)**
  Hovering the selected option turned its label the fill colour, so it vanished → the selected label keeps its colour on hover (same guard on **[Tabs](#/tabs)**).

- **[Combobox](#/combobox)**, **[Pin input](#/pin-input)**, **[Tag input](#/tag-input)**, **[Record picker](#/record-picker)**, **[Transfer list](#/transfer-list)**
  A disabled field still sent its value with the form → its hidden inputs are disabled too.

- **[Date picker](#/date-time-picker)**
  Today and the quick-date presets could pick a day before `min` or after `max` → they do nothing out of range, and presets show as disabled.

- **[Pin input](#/pin-input)**
  A React `PinInput` whose parent refused an edit kept showing the typed digits → the slots go back to the `value` prop.

- **[Tree](#/tree)**
  A React `Tree` whose nodes arrived after the first render could not be reached with Tab → it gets a tab stop whenever its nodes change (`refresh()` on the controller does the same for plain HTML).

- **[Search bar](#/search-bar)**
  The clear button emptied a disabled or read-only field → it is disabled with the field, and `clearSearchBar()` leaves such a field alone.

- **[Select](#/select)**
  Options inside an `<optgroup hidden>` showed up in the list and could be chosen → hidden groups are left out.

- **[Toast](#/toast)**
  The copy button said "Copied" when the clipboard refused the text or was missing → it says so only after the copy worked, and `toast.copy()` shows an error toast when it failed.

### Removed

- **Preview**
  - Ledger account-settings example → six example apps remain; its profile, notifications, plan, billing and workspace sections are gone with it.
  - The GitHub Pages preview is gone → the preview now lives at danitesler.com/ayywi, published by `scripts/deploy-site.sh`. A prompt copied from localhost loads the published package from jsDelivr.

## 0.1.2 — 2026-10-22

### Added

- **[App shell](#/app-shell)**
  The sidebar's top row had a toggle first and a brand with no mark → the brand is now a logo (a mark with a name, or with a `__logotype`) and the toggle sits at the end; in the rail only the mark shows, and resting the pointer on it swaps in the toggle to expand the sidebar.

- **[Chart](#/chart)**
  New chart types — horizontal bars, 100% stacked columns, columns with a line, histogram, waterfall, stacked areas, step lines, scatter, bubbles, donut, pie, gauge, radar, heatmap and funnel, as CSS classes and React components (`HistogramChart`, `WaterfallChart`, `ScatterChart`, `DonutChart`, `GaugeChart`, `RadarChart`, `HeatmapChart`, `FunnelChart`).

### Changed

- **[App shell](#/app-shell)**
  Link icons moved 2 to 4px as the sidebar narrowed to the rail, and the brand mark and toggle sat on their own axis → every icon (links, buttons, brand mark, toggle) is centred in a row-sized square at the start of the row, so they stay in one column in the sidebar and the rail, at every size and density.

- **[Button](#/button)**
  `start` and `end` alignment used the button's normal side padding → they now lay the edge icon out like an App shell row of the same size (sm, md, lg), so a button lines up with the menu items beside it.

### Fixed

- **Focus rings**
  After a mouse click, the button a dialog or menu focused (and the opener focus went back to) showed a ring, in Safari and Tauri apps on macOS → `trackInputModality()` keeps rings and focus-opened tooltips for Tab and arrow-key use only; `@danitesler/ayywi/elements` starts it, React apps call it once at startup.

- **[App shell](#/app-shell)**
  - A menu opened from the previewed sidebar of a collapsed shell flickered between clickable and dead once the pointer left the sidebar → the sidebar now stays open while a menu or popover inside it is open, and closes when that does.
  - Buttons in the sidebar had wider padding than the links beside them → their icon and label now start at the same edge as the links, and their label clips and fades in the rail like a link's.

- **[Chart](#/chart)**
  - A long caption on a chart's hidden data table widened the page on phones (`<table class="ayy-sr-only">`) → the table sits in a `<div class="ayy-sr-only">`, which clips it.
  - Bar values printed with `--values` disappeared in High Contrast → they take the system text colour.

- **Linter**
  `raw-control` flagged a classless `<table>` inside an `.ayy-sr-only` box → controls inside a visually hidden box are skipped.

## 0.1.1 — 2026-10-20

### Added

- **[Card](#/card)**
  New view type (`view`, `.ayy-card--view` with `CardView*` parts) — a capture, recording or picture to open, letterboxed over a blurred copy of itself, with a length badge, a play glyph, and its title, details, badges and actions revealed on hover or focus.

- **[Hover actions](#/hover-actions)**
  New component — frosted icon buttons over a picture or card, separate in its corners or grouped on one glass bar, revealed on hover or focus, each named in a tooltip.

- **[Toast](#/toast)**
  Card toasts were always 16:10 → `ratio` (`toast.card({ ratio })`, `<CardToast ratio>` or `--ayy-ratio`) gives a card its picture's shape, between 6.75rem and 14rem tall, with the blurred copy filling the rest.

- **AI kit**
  Nothing told agents how to install or update ayywi, so apps vendored copies or linked local checkouts → AGENTS.md, the Cursor rule, the skill, llms-full.txt and MCP `get_rules` have an "Installing and updating" section: npm only, `@danitesler/ayywi` imports, no vendoring, `init --force` after an upgrade, local checkouts through `AYYWI_DIR` only.

- **Linter**
  Setup mistakes went unnoticed → `unscoped-import` (error) flags imports from `"ayywi/…"`, and `vendored-ayywi` (warning) flags a `file:`/`link:`/`.tgz` ayywi dependency or a copy under `vendor/`.

- **Packaging**
  Font files could only be reached by a path into `node_modules` → `@danitesler/ayywi/fonts/*` exports them.

- **[Action bar](#/action-bar)**
  Action bars with many actions had no square icon-only modifier → added `.ayy-action-bar__button--icon` (`icon` prop on `ActionBarButton`) for common bulk actions separated from unique labelled actions with a divider, paired with mandatory tooltips and a showcase example.

- **[Button](#/button)**
  Icon-only buttons had no explicit tooltip requirement in design rules → added requirement to always pair icon-only buttons with a visible `Tooltip`, and updated examples.

### Changed

- **[App shell](#/app-shell)**
  Settings opened with a cramped top: "Settings" sat right on the first group, and the section's Top bar had a divider under it → on wide screens both titles are xl, sit on one line with room above, and the divider is gone. The playground's settings dialog has a Props button beside its close button for sidebar size (Big, Medium, Small), grouped or flat sections, and search.

- **[Toast](#/toast)**
  - Toast icon buttons named themselves with a native title → every close, copy and card corner button has an ayywi Tooltip (top layer, so a card can't clip it); `CardToastClose` takes `tooltip` and `side`.
  - A dismissed toast slid 28px to the right whatever side the stack was on → it slides off through the nearest edge of the screen (the stack's side, mirrored in right to left; down or up for a centred stack), and Clear all sends every toast off together, a little slower.
  - Toasts behind the front one shrank toward the middle, and Clear all always sat on the right → toasts behind shrink toward the stack's side, so their edges line up with the front toast's, and Clear all sits on that side too (right, left or centred).
  - Close and copy buttons were 24px on text toasts and 28px on card toasts → one size everywhere, the small control size, and React's notification toast uses the same `CardToastClose`.
  - A dismissed toast slid 28px to the right, whatever side the stack was on, and Clear all dropped every toast at once → it slides off through the nearest edge of the screen (the stack's side, mirrored in right to left; down or up for a centred stack), and Clear all takes them quickly one by one, front first.
  - Toasts behind the front one kept their own size, so a taller one stuck out further, a shorter one vanished and a narrower card left a gap → while the stack is closed each toast behind takes the front one's height and width, and sizes animate as toasts arrive, leave and the stack opens.
  - Card toast corner buttons and close were 24px with a native title → the small control size (28px compact, 32px comfortable, 40px touch), and React `CardToastAction` is a Hover action with an ayywi tooltip (`hint`, `tooltip`, `side`).

- **[Action bar](#/action-bar)**
  Buttons had a 1px hover lift clipped by the scrolling actions row and lost padding → removed hover `translateY(-1px)`, reduced actions gap to `0`, and removed `:has(> svg:only-child)`.

- **[Table](#/table)**
  Icon buttons in row actions lacked tooltips → wrapped table row icon buttons in `Tooltip` ("Edit", "Copy link", "More actions").

- **[Dropdown menu](#/menu)**
  Menu examples showed redundant title headers → removed title labels from dropdown menu examples.

- **[Combobox](#/combobox)**, **[Date & time picker](#/date-time-picker)** (**Breaking**)
  Clearing passed `null` to callbacks typed as never null → the types say so: `Combobox` `onValueChange(value, option: ComboboxOption | null)`, `DateRange`/`DateRangePicker` `onValueChange(range: [string, string] | null)`, `connectCombobox` `onSelect(option: HTMLElement | null)`.

- **[Code block](#/code-block)**
  The HTML language selector swapped in ayywi's own sample code → it switches to the block's `<template data-language="…" data-filename="…">` for that language, and leaves the code alone without one.

- **[Date & time picker](#/date-time-picker)**
  The `<ayy-date-time-picker>` and `DateTimePicker` value used the 12-hour time when `format="12h"` (`2026-10-14T02:30 PM`) → always ISO (`2026-10-14T14:30`).

### Fixed

- **[App shell](#/app-shell)**
  In a big sidebar a `size="sm"` button stayed small while an `icon-sm` button next to it grew to the sidebar size → both keep their small size, so a split button lines up.

- **AI kit**
  The rules said class helpers come from `"ayywi"` (the CLI package) → `"@danitesler/ayywi"`.

- **[Command palette](#/command)**
  `<ayy-command>` pulled items out of wrapper elements when sorting matches, and items added later jumped up the list → only direct children move, and a new item keeps the place it was added at. React `Command` filters without moving React's nodes (moving them unmounted the app on its next update).

- **[Date & time picker](#/date-time-picker)**
  - The 24-hour `<ayy-time-picker>` kept the old half of the day when the hour changed (09 after 14:30 gave 21:30) → the hour is what you pick.
  - React `TimePicker` with `format="12h"` turned PM into AM on the next pick, and 12-hour labels read "02:30 AM" or "02:30 PM AM" for 2:30 PM → PM stays and labels read "02:30 PM".
  - Any footer button other than Today (a "Done") cleared the date, and the React pickers reported Clear twice → only Clear clears, once.
  - `parseIsoDate("2026-10-19T10:00")` gave an invalid date ("NaN-NaN-NaN" after `addDays`) and years 0–99 turned into 1900–1999 → it reads the date part of a date-time, keeps every year as written, and `toIsoDate` pads years to four digits.

- **[Tag input](#/tag-input)**
  With suggestions, clearing the field after picking one, or Esc twice, threw an error and left the list open → nothing is added and the list closes.

- **[Dropdown menu](#/menu)**
  Context menus (`DropdownMenu anchorPoint`, `<ayy-menu>.openAt()` with no trigger) opened in the top corner and closed on any click inside → they open at the point and checkbox items keep them open.

- **[Combobox](#/combobox)**
  A list opened above its input drifted away from it as filtering shortened it → popovers, menus and lists follow their own size and their anchor's.

- **[Table of contents](#/toc)**
  The bar `<ayy-toc>` adds read the first link's text as HTML, and a `%` in a link's id stopped the scrollspy → the text stays text and such ids work.

- **[Color picker](#/color-picker)**
  Right to left, the handle and slider thumbs sat mirrored away from their colour; typed hex such as `#fff` or `#12345g` went out as typed; changing alpha nudged the colour → the area and sliders run left to right, the value is always `#rrggbb` (`#rrggbbaa` with alpha), invalid hex is ignored, and alpha changes keep the colour.

- **[Toast](#/toast)**
  - `toast.card()` read `media.duration` as HTML → as text.
  - Hovering a toast that was still sliding in cut off its lower edge, made the stack flicker open and shut, and could drop a click; an open stack also cut off the front toast's shadow → the open stack now only clips the edge it scrolls past.

- **MCP server**
  `create_brand` read a `.json` file when given a path as the colour, and a `null` message stopped the server → it takes a hex colour only and answers bad messages with an error.

- **Packaging**
  `require("@danitesler/ayywi")` and `require("@danitesler/ayywi/react")` loaded separate copies, so a toast from one never reached the other's Toaster → CommonJS builds share one copy, like the ESM builds.

- **Elements**
  `elements.global.js` in `<head>` without `defer` never filled sliders, number fields or swatches, then or later → it finishes that setup once the page body is parsed.

- **[Swipe actions](#/swipe)**
  A mouse press released outside the row left a drag pending, so moving over the row later dragged it with no button held → the press ends when the button is up.

- **[Table](#/table)**
  Sorting descending put empty cells first → empty cells stay last both ways; `compareValues(a, b, direction)` takes the direction so React tables get the same order.

- **[Chart](#/chart)**
  `chartScale`, `chartPath`, Sparkline and Bar list threw a RangeError on series longer than about 100,000 values → they take any length.

- **Linter**
  `ayywi lint` crashed on a symlink to a missing file and on a folder symlink pointing back up the tree → it skips the first and walks each folder once.

- **Tests**
  E2E tests ran in the installed Google Chrome whenever a Mac had one, so results depended on its version → they run in Playwright's pinned Chromium; `E2E_CHROME=1` opts into the installed Chrome.

- **Brand System**
  `brandCss()` and `setBrand()` wrote a ready-made Brand object (one loaded from storage or an API) into CSS unchecked → they check its name, colours, radii and fonts the way `createBrand()` checks its input, and throw on anything else.

- **Releases**
  Deploying copied earlier releases to whatever paths the live `versions.json` named → a release id or file that points outside `v/<release>/` stops the deploy.

## 0.1.0 — 2026-10-17

### Added

- **AI Kit & Patterns**
  Only Settings had a full-screen pattern recipe → added **Data explorer** (Filter bar, Search bar, Sorting, Table/Grid, Row actions, Action bar, and states) and **Marketing page** (Navbar, Hero, Feature spotlights, Pricing, FAQ, and Footer) patterns across `manifest/components.json`, `llms-full.txt`, `llms/pattern-*.md`, and MCP `get_rules`.

- **[Toast](#/toast)**
  - Open stack could only be closed one toast at a time → a "Clear all" button appears in its top-end corner while the stack is open with two or more toasts (`clearLabel` to translate it).
  - Short message format only → added long text toast variant (`.ayy-toast--long`, `toast.long()`) with normal font size (`--ayy-text-sm`), multiline wrapping, and built-in copy button with feedback.
  - Card toasts only supported full-bleed overlay cards → added split `CardToast` variation combining an image preview thumbnail with text and actions, refocused `CardToast` on visual content previews, and added usage Dos and Don'ts for `InlineToast`.
  - Toasts only supported notification popovers → added `NotificationToast` and `InlineToast` components with icon/text variants, dedicated `Inline toast` preview category, `toast.copy()` action helper, and wheel/keyboard scrolling without a visible scrollbar to cycle through older toasts in expanded stacks.

- **[Date & time picker](#/date-time-picker)**
  - No Clear or Today action buttons → added action footer with ghost "Clear" and secondary "Today" buttons across DatePicker, DateRangePicker, and DateTimePicker.
  - Time picker columns had no manual input option → added numeric input fields at the top of the selector with bidirectional column selection and smooth scrolling.
  - View switching caused container width shifts → stabilized container width and smoothed view transitions across days, months, and years.
  - Static month and year header text in single and range calendars → interactive month and year buttons that swap the day grid into a 3×4 month or 12-year picker grid.
  - New component — unified date picker, date range picker, time picker, and compound date-time picker with month grids, dual-month range ribbons, scrollable time columns, and custom elements.

- **[Grid](#/grid)**
  New component — multi-select card grid for media assets, screenshots, social posts, project cards, and user records with select-all toolbar, range selection, floating corner controls, inline quick actions, and per-card `⋯` action menus.

- **[Action bar](#/action-bar)**
  New component — floating bottom multi-select bar that animates into view when items are selected, showing the selection count, a clear button (`Esc`), and bulk actions (`Edit`, `Duplicate`, `Copy`, `Archive`, `Delete`) with roving keyboard navigation.

- **[Table](#/table)**
  - Row actions had no dedicated contract → added `TableRowActions` (`.ayy-table__row-actions`, `--reveal`), `.ayy-table__actions` cell alignment, inline quick action buttons, per-row `⋯` secondary action menus, and `ActionBar` bulk action integration.
  - Static preview example → interactive props selector in the toolbar to toggle compact density, caption, numeric builds column, and footer.

- **[Button](#/button)**
  - No dedicated loading spinner example or variant entry on the Button page → added a "Loading with spinner" example across variants, sizes, and icon-only buttons, included a loading button in the Variants showcase, and documented `loading` under Button variants.
  - Wide buttons always centered the icon and label → new `align` prop (`start`, `center`, `end`) sets where they sit, like App shell links, in every size.

- **[Bottom nav](#/bottom-nav)**
  Single fixed size with 3-5 items → added `size` variants (`sm`, `md`, `lg`), `compact` spacing, and `iconOnly` mode supporting up to 6+ items, with interactive controls in the preview and responsive device switcher removed.

- **[App shell](#/app-shell)**
  - Mobile bottom nav had fixed appearance → added bottom nav controls (`Nav size`, `Compact`, `Icon only`) in the mobile playground popover, replicating the full range of bottom nav configurations.
  - Size selector offered only Big and Small (binary switch) → now a three-option selector: Big (`lg`), Medium (`md`), and Small (`sm`).
  - Sidebar fixed at 15rem → draggable `__resize` handle (mouse, arrow keys, Home/End, double click to reset) that sets `--ayy-sidebar-w`; `onResize` / `ayy-resize` report the width to save.
  - Only a sidebar and a main area → optional `__detail` pane as a third column (covers the screen on phones), with its own `__resize--detail` handle and `--ayy-detail-w`.
  - Phone drawer only with a bar or bottom nav → `drawer` / `ayy-app-shell--drawer` makes the sidebar a drawer without them, and the menu button can sit in the main area.

- **[Showcase](#/showcase)**
  - Props popover button had no hover hint → added hover tooltip on the props trigger, and added the props selector button with tooltip and popover to showcase actions as one of the action elements that can be added.
  - New component — responsive preview container for showing UI at desktop, tablet, and mobile widths with smooth `max-inline-size` transitions and optional device/props controls.

- **[Navbar](#/navbar)**
  Static preview example → interactive props selector in the toolbar to toggle active page, call to action button, and brand icon.

- **[Code block](#/code-block)**
  - Fixed options in example → interactive props selector in the toolbar to toggle line numbers, header, and copy button.
  - Plain unstyled snippet text → built-in zero-dependency syntax highlighter mapping 20+ languages (`tsx`, `html`, `css`, `json`, `bash`, `md`, `python`, `sql`, `yaml`…), plus `CodeBlockSelector` backed by Ayywi's native DropdownMenu for selecting languages in the header.
  - New component — formatted code container with header bar, copy button, line numbers, and token styling.

- **[Page header](#/page-header)**
  Static preview example → interactive props selector in the toolbar to toggle breadcrumbs, description, and secondary action button.

- **[Chart](#/chart)**
  Only graphical charts (bars, lines, sparklines, bar lists) → added `TableChart` component to render chart series and labels as an accessible data table utilizing ayywi's Table component.

- **[Dropdown menu](#/menu)**
  - Submenu triggers only rendered standard item rows → added `selected` prop to `DropdownMenuSubTrigger` to reserve space for checkmark indentation and display active selection indicators.
  - Selectable items with checkmark indicator — `DropdownMenuSelectedItem` and `.ayy-menu__item--selected` reserve space on the start side for checkmarks while values remain flush right.

- **[Filter bar](#/filter-bar)**
  - Consolidated filter example — single filter button opening a dropdown menu with submenus for each filter dimension.
  - New component — coordinating bar for filtering lists and tables with quick status tabs, faceted triggers with count badges, and search.

- **[Density](#/density)**
  Density section under spacing and sizing → dedicated foundation page under Brand with live mode switcher, side-by-side comparison, subtree scoping, and token reference.

- **[Status dot](#/status-dot)**
  New component — compact standalone indicator dot for online presence, live event streaming, server health, and table statuses with pulsing animations.

- **[Popover](#/popover)**
  Trigger only rendered a styled Button → `asChild` prop on `PopoverTrigger` clones custom trigger elements without button styling.

- **[Text highlight](#/text-highlight)**
  New component — inline text highlighting with subtle gray wash and clean underline by default, status variants (warning, destructive, success, info, orange), zero horizontal padding, and `<mark>` base styling.

- **[Command palette](#/command)**
  Search matches and item density — title-prioritized search scoring across sections, 1-line descriptions shown conditionally when matches occur in item descriptions, block title flow to prevent word splitting, and a dedicated reference example demonstrating search text highlighting across titles and descriptions.

- **[Sorting](#/sorting)**
  New component — dedicated dropdown trigger for ordering lists and tables, styled to coordinate with filter bars and paired with dropdown menus.

- **Foundations**
  Spacing & sizing only documented spacing tokens → added size scale definitions (`sm`, `md`, `lg`, icons, targets) and a three-column component size comparison.

- **[Color picker](#/color-picker)**
  New component — visual panel with 2D saturation/brightness area, hue and alpha sliders, hex input, preset swatches, and `<ayy-color-picker>` element.

- **[Timeline](#/timeline)**
  New component — chronological activity stream and audit log with connecting vertical rail, status nodes, and alternating layout.

- **[Checkbox](#/checkbox)**
  Always primary-coloured → `--ayy-check-color` (box border and fill) and `--ayy-check-fg` (tick) colour it, e.g. by task priority.

### Changed

- **Manifest & Docs**
  Components carried separate `beta` / `stable` status fields → removed component status markers so all 72 components are treated as ready by default, and synced `SKILL.md` and `README.md` bundle metrics.

- **llms-full.txt**
  1.15 MB with every example inlined, too big for AI tools to read whole → 372 kB with every rule, pattern and component API; examples stay in `llms/<component>.md`, and `pnpm check` fails above 420 kB.

- **[Dropdown menu](#/menu)**
  - Submenus example was labelled with another app's name → labelled "Screenshot".
  - Shortcut hints were plain muted text with hardcoded Mac symbols (`shortcut="⌘D"`) → keycap hints via `Shortcut` (`shortcut="Mod+D"`), showing ⌘D on a Mac and Ctrl+D elsewhere.

- **[Toast](#/toast)**
  - Leaving toast only faded out in place → subtle left-to-right drift (translateX 28px, scale down to 0.95, fade out) over 280ms. Fade-out also works while the stack is expanded, and neighbours slide into the gap more smoothly.
  - Card toast close button sat on top-left and preview variants were unlabeled → close button moved to top-right corner, and all preview variants include descriptive title labels.

- **[Action bar](#/action-bar)**
  Dense buttons with compact padding and abrupt removal on deselect → standard button horizontal paddings (`--ayy-control-pad-md`), 8px action gaps, and smooth reverse exit animation with `@starting-style` and `transition-behavior: allow-discrete`.

- **Tokens**
  - Small UI text was 12px in every density and control text jumped 12 → 14 → 16px → new `--ayy-text-s` and `--ayy-control-text-sm`/`-md` all go 12 / 13 / 14px (compact / comfortable / touch) and `--ayy-control-text-lg` goes 14 / 15 / 16px.
  - Inputs shared button text size → new `--ayy-control-text-field` (12 / 13 / 16px) keeps typing fields at 16px on touch so iOS doesn't zoom.
  - `--ayy-control-text-sm` base value was 11px (`0.6875rem`) → 12px (`0.75rem`), eliminating all 11px font usage in compact density.

- **Typography**
  The type scale showed only the compact value → it lists density-aware sizes separately with all three values.

- **[Table of contents](#/toc)**
  Named "Contents" with a horizontal scrolling links row on phones → renamed to "Table of contents" with a sticky pill bar showing the active section that toggles an elevated dropdown menu.

- **[Color picker](#/color-picker)**
  - Bulky 16rem panel with 32px swatch and plain text input → compact 13.5rem footprint with 24px preview swatch, 6.75rem area height, slider tracks height and gap precisely aligned with the preview swatch, and small InputGroup with configurable addon (prefix/suffix) and copy button.
  - Preview seed colour and custom brand swatch opened native OS picker → integrated into `ColorPicker` in Popover and Appearance menu flyout.

- **[Color swatch](#/swatch)**
  Named "Swatch" with native color dialog and plain inputs → renamed to "Color swatch" (`ColorSwatch` components and exports) and custom color popover now uses ayywi's unified ColorPicker with HEX input group, copy button, and toast feedback.

- **[Tooltip](#/tooltip)**
  - Only translated without scaling and delayed dismiss → scale and opacity transition smoothly using `ease-out-expo` with clean starting styles in top-layer and static modes.
  - Shortcut hints were plain text in parentheses (`Save changes (⌘S)`) → keycap hints via `Shortcut` (`keys="Mod+S"`), showing ⌘S on a Mac and Ctrl+S elsewhere.

- **[Button](#/button)**
  External section labels above buttons → removed floating labels and labeled variants directly inside button text.

- **[Input](#/input)**
  - Types and sizes had floating section labels above fields → removed floating labels and labeled variants directly inside input placeholders.
  - Input group was a separate component and navbar entry → merged into Input, with sizes and input types separated, date input removed in favor of Date & time picker, and copy/reveal buttons enhanced with tooltips and feedback toasts.

- **[Avatar](#/avatar)**
  Single preview combined sizes, fallback initials, and group → separated into distinct "Sizes", "Fallback", and "Group" previews.

- **[App shell](#/app-shell)**
  - Props in playground showed all switches simultaneously with a detail pane → switches are shown conditionally for the active device (Desktop/Tablet vs Mobile), and the detail pane was removed.
  - Eight separate previews (basic, tabs, grouped, sizes, drawer, settings, collapsible, workspace) → one playground with switches for size, collapsed sidebar, hover preview, top bar, bottom nav, drawer, grouped nav and resizing, plus the settings dialog.

- **[Filter bar](#/filter-bar)**
  Long descriptive example titles → shortened to "Status tabs", "Faceted filters", and "Consolidated filter".

- **Preview**
  - Device switcher and Props button had text labels → icon-only buttons with hover tooltips and accessible screen-reader labels.
  - Device switcher now only appears on examples where the viewport width meaningfully changes the view; purely inline variant grids (e.g. FAB variants) no longer show the switcher.

- **[Code block](#/code-block)**
  Preview code blocks used ad-hoc container markup and custom copy button → updated to use ayywi's `CodeBlock`, `CodeBlockHeader`, `CodeBlockFilename`, `CodeBlockCopy`, and `CodeBlockPre`.

### Fixed

- **[Date & time picker](#/date-time-picker)**
  - Flex row container with full-width action footer caused oversized popovers with blank right-hand and bottom gaps → compact grid layout prevents container expansion and cleanly spans the footer across dual months and combined date/time columns.
  - Closing any date, date range, time, or date-time picker popover briefly showed a small empty rectangle → the inner picker grid and columns stay mounted during the close transition so the popover fades out at full size.
  - Current date within a picked range was squared by the in-range wash band → today's outline stays circular while the connecting ribbon remains continuous behind it.

- **[App shell](#/app-shell)**
  - Collapsed sidebar rail showed a scrollbar over hidden icon-less links → vertical scrolling is disabled in the rail when the nav has no icons.
  - Only the first menu button (top bar or bottom nav) opened the phone drawer → every `__toggle` opens and closes it, stays in sync, and opening focuses the first link instead of the sidebar toggle.

- **[Toast](#/toast)**
  - Card toast scrim transitioned opacity on page load when rendered with `data-hover` → `data-hover` scrim and center actions now render immediately without transition.
  - Regular toasts stretched to card height, stacked toasts lost content on expansion, and clicking buttons inside collapsed the stack → regular toasts maintain compact height, expanded toasts keep full content and hover controls, and the toaster stack remains open during hover or active interaction.

- **[Dropdown menu](#/menu)**
  Checkmark on selected menu items was displayed at the trailing end and shifted trailing number values → moved to the start side with reserved padding.

- **[Filter bar](#/filter-bar)**
  Faceted filter controls wrapped prematurely onto multiple lines → inline flex layout kept on controls group.

- **[Code block](#/code-block)**
  Tooltip on copy button was clipped by `overflow: hidden` on the container → removed `overflow: hidden` from `.ayy-code-block` and applied matching border radii to header and pre elements.

- **[Settings](#/settings)**
  A choice group in a stacked row made the row several times too tall (630px instead of 141px) → the row is now as tall as its content.

- **[Tooltip](#/tooltip)**
  Clicking a trigger kept tooltips open indefinitely because mouse focus retained focus-within state → tooltips dismiss on click (`pointerdown`), and only keyboard navigation (`:focus-visible`) keeps the bubble open.

- **Preview**
  - Tablet and mobile viewports had content flush against the container edges and corners → added 16px padding inside tablet and mobile viewports.
  - Selecting Mobile on desktop viewports did not trigger media-query based phone layouts → responsive components render inside a device iframe when switching to mobile on wide viewports.
  - Brand menu in Appearance settings had custom item misaligned and missing active indicator → indented Custom submenu trigger to align with presets and rendered checkmark when custom color is active.

- **[Linter](#/cli)**
  Private `--_*` custom property overrides in app CSS were not checked on general selectors → flagged across all app stylesheets.

- **[MCP Server](#/cli)**
  Only supported single `<ayy-*>` elements per component → added multi-element support and alias search for all component elements.

- **React exports**
  Several component prop types were missing from `@danitesler/ayywi/react` → exported all component `*Props` types.

- **Build & Quality Gates**
  Manual checks allowed external library drift and unlayered `@layer` leakage → permanent guardrails enforce zero external library mentions, multi-element documentation parity, class options sync, no unwrapped hover transforms, and pure unlayered CSS.

### Removed

- **Tailwind preset** (**Breaking**)
  `./tailwind-preset` and `./tailwind.css` exports removed → use native ayywi tokens and classes instead.

- **shadcn layer** (**Breaking**)
  `./shadcn.css` export removed → use native ayywi classes and custom properties directly.

- **[Input](#/input)**
  Redundant native date and time picker examples removed → use [Date & time picker](#/date-time-picker).

- **Tokens** (**Breaking**)
  `--ayy-text-2xs` (11px) removed → use `--ayy-text-xs` (12px), and all components that used 2xs updated to xs.

- **Calendar** (**Breaking**)
  `Calendar` and the `.ayy-calendar*` classes removed → use `DatePickerGrid` from [Date & time picker](#/date-time-picker) (same props) and `.ayy-date-picker-grid*`. (Added to these notes after the release; 0.1.0 shipped without it.)

## 0.0.3 — 2026-10-13

### Added

- **[Motion](#/motion)**
  Only showed abstract sliding dot tracks → added real component examples (Switch, Tabs, Progress, Accordion, Toast, Card lift, Shimmer) running in a synchronized animation loop with play/pause controls.

- **[Progress](#/progress)**
  Only showed an unlabelled bar stack → added examples for labelled task progress with steps, resource usage quotas with `role="meter"`, and an interactive simulation with live percentage controls.

- **[Dropdown menu](#/menu)**
  Only supported flat items and separators without nesting → added submenus next to the menu with pointer-intent safe triangles, inline expandable accordion sections, radio/checkbox items, values, descriptions, static rendering, and context menu coordinates.

- **[Shortcut](#/shortcut)**
  Platform detection was Apple-only → added `getPlatform()`, `isWindowsPlatform()`, and `isLinuxPlatform()`, Linux Super modifier support (in React's Shortcut and in static shortcuts redrawn by `@danitesler/ayywi/elements`), and matching by physical key so hotkeys work on any keyboard layout.

- **[App shell](#/app-shell)**
  One sidebar size → a `size="sm"` Small sidebar (`ayy-app-shell--sm`) with denser rows for long navigation such as a docs tree; Big stays the default. New "Big and Small sidebars" example shows both side by side.

### Changed

- **[App shell](#/app-shell)**
  - Long description and 10 dos / 8 don'ts → shorter description and 8 dos / 7 don'ts.
  - Sidebar items 4px apart, groups 12px apart → items 2px apart, and more air above each group (16px margin, 20px padding).
  - Hover preview was opt-in (`hoverPreview`, `hover-preview`) → on by default for a collapsed sidebar; `hoverPreview={false}` or `hover-preview="false"` turns it off.

- **[Keyboard hint](#/kbd)**
  Component was named Kbd without platform adaptation → renamed to Keyboard hint with platform modifier symbols (macOS ⌘/⌥, Windows Ctrl/Win, Linux Super), international layout hotkey matching (e.g. Russian Cyrillic `Cmd+У` matching `Cmd+E`), and new platform and multilingual examples.

- **[Combobox](#/combobox)**
  Options were the md control height (32px compact) → sm (28px compact), across Combobox and Tag input suggestions.

- **[Search bar](#/search-bar)**
  The field's border didn't react to the pointer → it darkens to line-hover on hover, like Input.

- **[Toast](#/toast)**
  Flat edge-bordered notifications → stacked card deck with leading status icons, quiet background cards, 5-item preview limit, unrestricted hover expansion, and smooth `@starting-style` transitions.

- **[Brand System](#/brand)**
  Manual "Use across preview" button and static preset list → Mono default preset circle, live preview updates on seed color changes, tooltip labels on swatches, "Reset to default" button aligned beside swatches, custom color picker in shell settings menu, and pure unbranded themes when Mono is selected.

- **Preview**
  - The display menu's "Expand on hover" switch → the docs sidebar always previews on hover, and the menu picks its size (Small or Big).
  - Code accordion below example stages → compact "Copy for..." popover with AI prompt, React and HTML tabs, with larger example titles.
  - Long page intros and showcase descriptions → shortened throughout Get started, Foundations, Brand, Showcase and the seven example blurbs.
  - Separate theme and display buttons with grouped radio lists → one Appearance menu with Theme, Density, Brand and Sidebar submenu flyouts, each with a leading icon and the current value.
  - Get started showed follow-up fix prompts and a "What you can build" button → both removed for a shorter one-flow page.
  - Get started had four tabs, "included" checklists, 13 screen prompts, a review list and a component list → one flow (describe, pick your tool, copy), follow-up fixes, and a short codebase setup with npm or CDN.

### Fixed

- **[Dropdown menu](#/menu)**
  Hovering an open submenu panel closed it after a beat → the parent menu now ignores hover events from inside its own submenu panels, so the flyout stays open while the pointer is on it.

- **README**
  The Components table listed Section, Theme toggle and a "Data list" that doesn't exist → removed; `pnpm check` now fails on a table entry that isn't a component, and on custom properties that aren't `--ayy-*` or `--_*`.

### Removed

- **Section** (**Breaking**)
  `.ayy-section` and `<Section>` component removed → use native `<section>` with standard layout utilities and tokens.

- **Theme toggle** (**Breaking**)
  `.ayy-theme-toggle`, `<ThemeToggle>`, and `<ayy-theme-toggle>` removed → switch themes with standard button/menu components and `setTheme()`.

## 0.0.2 — 2026-10-11

### Changed

- **[Select](#/select)**
  Opened the OS menu, which looked foreign next to ayywi → with a mouse or trackpad it opens ayywi's own options list (check on the chosen one, full keyboard); phones keep the OS picker. Same `<select>` markup, `onChange` unchanged.

- **[Dropdown menu](#/menu)**
  Radio and checkbox items had no checked look → `aria-checked="true"` shows a check at the inline end.

- **Linter**
  Only hand-styled controls were flagged → also raw ones with no class (`raw-control`: `<button>`, `<select>`, `<input>`, `<table>`, `<details>`…) and `<div>`/`<span>` click handlers (`clickable-element`). `ayywi lint --hook` runs it as a Claude Code hook.

- **Rules**
  - "Reuse components" → never write a raw native control or a clickable div, name the component for every piece first, and fix lint warnings too.
  - App screens had no width rule, so copies capped every page → the main fills the shell. Don't add `.ayy-container` or a `max-inline-size`. Long text and settings mode stay measured.

- **Preview**
  - Some pages hand-built their controls → the tool picker is Chips, the setup switcher Tabs, the device picker a Segmented control, release notes and example code Accordions, the seed colour a Swatch, the sentence picker a Select. `pnpm check` now lints the preview.
  - Custom “Theme” menu in the sidebar and phone bar → the design-system theme button, with density and brand in the menu beside it.
  - The docs sidebar was always open → it collapses to a rail (toggle and search) that previews on hover, and remembers the choice.
  - Selecting an item in the search palette only updated the route → now automatically scrolls the left sidebar navigation to center the selected item.

- **[App shell](#/app-shell)**
  - Settings replaced the app full screen, with a Back link → they open over the app in a near-full-screen dialog holding the settings shell (full screen on phones). `AppShellMain as="div"` keeps one `<main>` on the page.
  - Collapsing snapped labels away and the hover preview jumped open → the width animates, icons stay put while labels fade, the preview opens after a short pause and closes smoothly, and it no longer reopens under the pointer right after you collapse. New `AppShellHead` (`ayy-app-shell__head`) for the toggle and brand row.

- **Settings pattern**
  "Never in a dialog" → settings live in a `size="full"` Dialog; the dialog's close button and Esc are the way out.

- **Showcase**
  Ledger's settings were a page with Tabs → every app (Pulse, Relay, Ledger, Orbit, Haven) opens its own settings sections in the settings dialog.

- **[Accordion](#/accordion)**
  Opening snapped the answer in → it rolls open on the menu easing, in step with the chevron; easings now come from tokens.

- **Documentation**
  Developer-centric install instructions → rethought for PMs, designers, and AI builders around single-prompt setup and MCP.

- **Get Started**
  - Static tool icons and manual install focus → interactive tool picker with tailored prompts, MCP configuration, and follow-up fix prompts.
  - Tabs "I build with AI tools", "Link files", "Install", "Chat only" with a one-line note → "AI Builders", "No-Build / CDN", "NPM & CLI", "Web Chat", each with a use-case line and a checklist of what the copied prompt includes.
  - Two door tabs ("I build with AI tools" / "I'm a developer") → four tabs ("I build with AI tools", "Link files", "Install", "Chat only"), with the AI tools prompt shown open below supported tool icons with a 400px max height.

- **[Showcase](#/showcase)**
  Live iframes for thumbnails → static screenshots with interactive spotlight cards in What you can build and Get started.

- **Manifest** (**Breaking**)
  Component `states` was a selector map on 14 components → standardized across all components keyed by state name.

- **[Tabs](#/tabs)** & Controls
  Used fixed pill radii → now follow `--ayy-radius-button` to match brand corner styles.

- **Design Rules**
  Allowed custom styling → updated Rule 1 to forbid rebuilding components or overriding appearance CSS.

- **Component Aliases**
  Generic aliases in Navbar, Input Group, and List → reassigned to dedicated [Top Bar](#/top-bar), [Search Bar](#/search-bar), and [Settings](#/settings) components.

### Added

- **AI kit**
  New "need → component" map (llms-full.txt, AGENTS.md, Cursor rule) and MCP `pick_component` tool; `ayywi init` also installs the lint hook and an `ayywi-ui-reviewer` agent.

- **[Tabs](#/tabs)**
  Text-only tab triggers → optional `icon` prop on `TabsTrigger` for custom icons before labels, with matching SVG sizing in CSS.

- **[Dialog](#/dialog)**
  New `full` size (`ayy-dialog--full`) — a near-full-screen modal, full screen on phones.

- **[Calendar](#/calendar)**
  New component — 6-week month calendar and date picker with keyboard navigation.

- **[Swatch](#/swatch)**
  New component — circular color swatch pickers and custom color inputs.

- **[Toolbar](#/toolbar)**
  New component — icon button toolbar with group navigation and floating canvas mode.

- **[Command Palette](#/command)**
  New component — searchable command dialog (⌘K) with keyboard navigation.

- **[Floating Action Button](#/fab)**
  New component — corner action button (`ayy-fab`) for primary screen actions.

- **[Top Bar](#/top-bar)**
  New component — sticky mobile header with back button, screen title, and actions.

- **[Search Bar](#/search-bar)**
  New component — rounded search input with auto-clearing button.

- **[Tag Input](#/tag-input)**
  New component — interactive input for adding and removing tag chips.

- **[Shortcut](#/shortcut)**
  New component — keyboard shortcut badge and interactive shortcut recorder.

- **[Settings](#/settings)**
  New component — grouped preference rows with toggles and drill-down links.

- **[Progress Ring](#/progress-ring)**
  New component — circular progress ring with optional center label.

- **[Swipe Actions](#/swipe)**
  New component — mobile list row with revealable swipe action trays.

- **Brand System**
  Hand-coded brand files → single seed color generator (`createBrand`) producing accessible 11-step color scales and CSS automatically.

- **CLI**
  Added `ayywi brand` command and MCP brand creation tool to generate brand themes and tokens directly from the terminal.

- **Tokens**
  Added `--ayy-brand-50` to `--ayy-brand-950` scale tokens for illustrations and branded accents.

- **Theming**
  Added global `data-brand` attribute to apply generated brand styles across components.

- **[App Shell](#/app-shell)**
  - Standard shell layout only → added `ayy-app-shell--settings` full-screen settings pattern with phone drill-down navigation.
  - Added collapsible sidebar for wide screens with an icon rail collapsed state, toggle button wiring, and an optional hover preview overlay.

- **Patterns**
  Added full-screen design patterns contract (`PATTERNS`) to standardize common screen recipes and mobile behaviors.

- **Linter**
  Linter checked only CSS values → added structural rules to prevent custom component rebuilds (`rebuilt-component`, `component-override`, `bare-control`).

- **Component Metadata**
  - Component states and size scales were partially documented → standardized across all components with strict `states` and `sizes` specifications.
  - Added `aka` aliases to component schemas to detect duplicate custom implementations.

### Fixed

- **CLI** (security)
  `ayywi init` wrote `npx ayywi mcp` into MCP configs, and the docs said `npx ayywi …`, which fetches whatever owns the unscoped `ayywi` on npm → everything uses `npx @danitesler/ayywi …`. Run `init` again to update an existing config.

- **README**
  - Quick-start prompt loaded unversioned files from the preview site → pinned to one release on jsDelivr with SRI hashes. Overclaims removed, brand contrast wording now says the button label is checked at 4.5:1.
  - Pinned versions and hashes had to be edited by hand → `scripts/pin-readme.mjs` writes them on release and `pnpm check` fails when they name another version.
  - Opened with a pitch per role (PMs, designers, AI builders) → one AI-first pitch: what AI tools get wrong and what ayywi gives them. Says how to pronounce "ayywi".

- **[Contents](#/toc)**
  - On phones the current link could end up half out of the strip when fonts loaded late → it's centred again whenever the links change size.
  - Squeezed into narrow side column on mobile → now displays as a sticky horizontal row below the navbar.

- **[Theme toggle](#/theme-toggle)**
  The check by the current theme turned into "<" in RTL → it stays a check.

- **[Contents](#/toc)** & **[Breadcrumb](#/breadcrumb)**
  Links had undersized touch targets (19–31px) → increased to 40px touch targets.

- **[Breadcrumb](#/breadcrumb)**
  Wrapped onto multiple lines on mobile → now stays on one line with intermediate breadcrumb ellipsis.

- **[Section](#/section)**
  Kept desktop padding (80px) on mobile → reduced to 48px padding for mobile screens.

- **[Card](#/card)** & **[Button](#/button)**
  Touch taps left hover animations stuck in active state → hover states now restricted to devices with real cursor hover.

- **CLI**
  `npx ayywi` reached nothing on npm → the unscoped `ayywi` package now runs `@danitesler/ayywi`.

### Removed

- **[Data list](#/data-list)** (**Breaking**)
  `.ayy-data-list` removed → use `.ayy-spread`, `.ayy-grid` or `List`.

## 0.0.1 — 2026-10-07

First release, as `@danitesler/ayywi` on npm. Everything below it is pre-release history under the old internal numbers.

### Added

- **[Chart](#/chart)**
  New component — pure CSS bar charts, line charts, area charts, and sparklines.

- **[Chip](#/chip)**
  New component — filter chips and removable pill tags.

- **[Choice Card](#/choice-card)**
  New component — selectable card controls for subscription plans and options.

- **[Slider](#/slider)**
  New component — range slider with auto-filled track and multi-thumb range support.

- **[Number Field](#/number-field)**
  New component — number input with integrated increment/decrement buttons.

- **[Combobox](#/combobox)**
  New component — searchable autocomplete dropdown input.

- **[File Upload](#/dropzone)**
  New component — drag-and-drop file upload zone.

- **[Page Header](#/page-header)**
  New component — screen title header with actions and description.

- **[List](#/list)**
  New component — structured list items with metadata, dividers, and selection states.

- **[Empty State](#/empty-state)**
  New component — empty view container with title, description, and action button.

- **[Spinner](#/spinner)**
  New component — accessible loading spinner indicator.

- **[Kbd](#/kbd)**
  New component — keyboard shortcut keycap badges.

- **[Input Group](#/input-group)**
  New component — inputs with attached leading/trailing icons, buttons, or text prefixes.

- **[Segmented Control](#/segmented-control)**
  New component — multi-option pill segment switcher.

- **[Pagination](#/pagination)**
  New component — page navigation links with ellipsis and mobile collapse.

- **[Accordion](#/accordion)**
  New component — collapsible disclosure panels built on native `<details>`.

- **[Steps](#/steps)**
  New component — multi-step progress indicator for sequential workflows.

- **[Footer](#/footer)**
  New component — responsive site footer with link columns and copyright bar.

- **[App Shell](#/app-shell)**
  - Desktop sidebar only → added `ayy-bottom-nav` mobile tab bar that automatically replaces the sidebar on screens under 48rem.
  - Added support for section groups, nested sub-lists, and collapsible navigation folders.
  - New component — responsive app shell with desktop sidebar and responsive mobile layout.

- **[Navbar](#/navbar)**
  Desktop links only → added `ayy-navbar__toggle` collapsible mobile dropdown menu.

- **[Button](#/button)**
  Added `loading` state (spinner and duplicate click prevention) and `block` full-width variant.

- **[Card](#/card)**
  Added `featured` modifier with prominent accent border for recommended options.

- **[Table](#/table)**
  Static rows only → added sortable column headers (`ayy-table__sort`) and row selection checkboxes (`ayy-table__select`).

- **[Input](#/input)**
  Added built-in theme styling for native date, time, and datetime inputs.

- **Tokens**
  - Added `--ayy-chart-1` through `--ayy-chart-6` accessible palette tokens for data visualizations.
  - Disabled controls had varying opacities (0.5–0.6) → standardized to `--ayy-opacity-disabled` (0.4).
  - Added standardized icon sizing tokens `--ayy-size-icon-sm` through `-xl` (16px to 32px).

- **Elements**
  Added `@danitesler/ayywi/elements` runtime to automatically wire slider tracks, stepper buttons, and dropzones in plain HTML.

- **Distribution**
  Added standalone `dist/theme-init.js` script and `dist/shadcn.css` compatibility bridge.

- **Documentation**
  Added individual `llms/<slug>.md` documentation files for every component.

- **Rules**
  - Added design guidance for charts, filters, and mobile viewport layouts.
  - Added requirement for App Shell frames and standard empty/loading/error states on all app screens.

- **[Progress](#/progress)**
  Used `tone` prop → renamed to `variant` to match Badge and Alert.

- **Layout**
  Added `.ayy-spread`, `.ayy-split`, and `.ayy-truncate` utilities, with automatic child margin resets.

- **[Theme Toggle](#/theme-toggle)** & **[Carousel](#/carousel)**
  Added `labels` and `slideLabel` props for accessibility translations.

- **Linter**
  Added validation for inline style attributes and named CSS colors.

- **MCP Server**
  Added component status, variants, utilities, and allowed custom properties to MCP inspection tools.

- **Preview**
  - Added copy-paste AI prompt starters and updated Get Started guide.
  - Published previews loaded unversioned files → now pinned to immutable versioned assets (`v/<release>/dist/`).

- **Showcase**
  Added Ember (e-commerce) and Haven (booking) demonstration apps.

- **[Bottom Nav](#/bottom-nav)**
  New component — mobile bottom navigation bar with sticky positioning.

- **[Dialog](#/dialog)**
  - Centered modals only → added bottom sheet dialog style for mobile.
  - Centered modals only → added side slide-in sheets (`side="start"` / `side="end"`) and scrollable `DialogBody`.

- **Typography**
  Added `.ayy-h5` (18px) and `.ayy-h6` (16px semibold) heading utility classes.

- **[Icon](#/icon)**
  Added Hugeicons integration via `<Icon>` React component and framework-agnostic `iconSvg()` helper.

### Changed

- **Themes**
  `dark-soft` theme used charcoal background (#1e1e1e) → changed to near-black (#0a0a0a) with higher contrast text.

- **Direction**
  Internal `--_ayy-dir` variable moved from `icon.css` to `base.css`.

- **Tokens**
  Standardized `--ayy-value` as the universal 0–100 progress hook for Progress, Slider, and Charts.

- **Showcase**
  Used custom layout CSS → refactored exclusively with ayywi components.

- **[Navbar](#/navbar)**
  Updated links to match App Shell hover washes, active states, and focus rings.

- **[App Shell](#/app-shell)**
  Group labels used standard text color → changed to muted text.

- **[Carousel](#/carousel)** & **[Theme Toggle](#/theme-toggle)**
  Replaced custom SVG arrows and glyphs with Hugeicons.

- **Examples**
  - Used physical pixel sizes → converted to logical rem units and token gaps.
  - Updated all example icons to use Hugeicons.

- **Contract**
  Component order and category lists centralized into `scripts/lib/contract.mjs`.

- **Validation**
  `pnpm check` expanded to enforce High Contrast coverage for stateful attributes and verify README component counts.

- **Guidance** (**Breaking**)
  Guidance used 4 sections (`whenToUse` / `whenNotToUse`) → consolidated into `do` and `dont` sections across all metas.

- **[Theme Toggle](#/theme-toggle)** (**Breaking**)
  Two-state toggle button → converted to dropdown menu supporting System and all four themes.

- **[Dialog](#/dialog)**
  Layout used CSS grid → changed to flex column to allow scrollable dialog bodies.

- **[Dialog](#/dialog)** & **[Toast](#/toast)**
  Close button used custom cross graphic → replaced with Hugeicons `Cancel01` icon.

- **Preview**
  Dense technical API tables removed from preview UI → streamlined for design review, leaving full specs to AI tool endpoints.

### Fixed

- **[Dropdown Menu](#/menu)**
  Keyboard focus showed faint wash → now displays visible focus ring.

- **[Tabs](#/tabs)** & **[Segmented Control](#/segmented-control)**
  Unselected text had poor contrast (<4.5:1) → switched to `text-soft` to ensure WCAG AA compliance.

- **[Chat](#/chat)**
  Bubbles lacked visible edges in High Contrast mode → added high-contrast border outline.

- **Form Controls**
  Invalid state relied solely on color → added dashed borders in High Contrast mode and destructive focus rings.

- **Documentation**
  `llms.txt` linked to unbundled source files → updated to point to dedicated per-component documentation files.

- **[Theme Toggle](#/theme-toggle)**
  Stored theme did not automatically restore on page reload → theme is now restored automatically on initialization.

- **Starter Prompts**
  Prompts were missing font and theme init files → added `fonts.css` and `theme-init.js` imports.

- **Examples**
  HTML examples used camelCase React attributes → updated to standard lowercase HTML attributes.

- **Manifest**
  Helper lists were hardcoded and incomplete → now generated dynamically from source code.

- **[Dialog](#/dialog)**
  Footer breakpoint used physical pixels (`640px`) → converted to relative rem units (`40rem`).

### Removed

- **Brand System** (**Breaking**)
  Pre-release brand files and `data-brand` were removed → replaced with direct semantic token overrides.

## Pre-release-4 — 2026-09-29 (internal 0.4.0)

Everything needed to build a website (danitesler.com was the test case: its header, hero, portfolio grid, project cards, case studies and "say hi" chat), not only app screens. No breaking changes.

### Added

- **[Navbar](#/navbar)**
  New component — sticky glass website header with anchor jump offsets.

- **[Breadcrumb](#/breadcrumb)**
  New component — path navigation trail with plain and pill styles.

- **[Contents](#/toc)**
  New component — on-page table of contents with scrollspy active indicator.

- **[Section](#/section)**
  New component — full-width page section with eyebrow, heading, and responsive padding.

- **[Separator](#/separator)**
  New component — horizontal and vertical dividers with fade options.

- **[Carousel](#/carousel)**
  New component — scroll-snap carousel with previous/next controls.

- **[Stat](#/stat)**
  New component — metric value display with trend label.

- **[Data List](#/data-list)**
  New component — description list (`<dl>`) with stacked and horizontal row layouts.

- **[Frame](#/frame)**
  New component — browser mockup container for screenshots.

- **[Icon Tile](#/icon-tile)**
  New component — accented icon badge.

- **[Chat](#/chat)**
  New component — conversation message bubbles, typing indicators, and quick replies.

- **[Theme Toggle](#/theme-toggle)**
  New component — theme toggle button with instant CSS light/dark icon switching.

- **Elements**
  Added `<ayy-toc>`, `<ayy-carousel>`, and `<ayy-theme-toggle>` custom elements.

- **[Button](#/button)**
  Added `ring` variant with animated gradient border on hover/focus.

- **[Card](#/card)**
  Added `ayy-card__media` (hover-zoom image/video) and `ayy-card__link` (full card clickable).

- **[Tabs](#/tabs)**
  Added `ayy-tabs__count` badge counter beside tab labels.

- **Utilities**
  Added `.ayy-container`, `.ayy-grid`, `.ayy-display`, `.ayy-link`, `.ayy-prose`, `.ayy-skip-link`, `.ayy-scroll-progress`, and `.ayy-reveal`.

- **Tokens**
  - Added layout rhythm tokens (`space.20/24/32`), container width tokens, and display heading scales.
  - Added `--ayy-min` (grid column size), `--ayy-slide` (carousel width), and `--ayy-spot` (accent color hook).

- **Rules**
  Added website layout rules for skip links, navbar placement, and screenshot framing.

- **Linter**
  Added check warning on `<img>` tags without explicit width and height.

- **Validation**
  `pnpm check` now verifies 4.5:1 contrast for all accent colors used as text.

### Changed

- **[Card](#/card)**
  Header children stretched to full width → changed to start-aligned (`flex-start`).

### Fixed

- **Tokens**
  Swift and Kotlin exports failed on fluid clamp formulas → fluid values skipped in native platform files.

## Pre-release-3 — 2026-09-28 (internal 0.3.0)

### Added

- **Themes**
  Added `dark-soft` (charcoal background) and `light-gray` (grey background with white cards) themes.

- **Theming**
  Added `themes`, `themeBase`, `ThemeName`, and `getColorScheme()` helpers.

- **Platform Tokens**
  Added per-theme SCSS, Swift, and Jetpack Compose color exports.

- **Organization**
  Added categories across components (Actions, Forms, Layout, Overlays, Feedback, Data display) and color tokens.

- **Linter**
  Added validation to flag unknown `data-theme` and `data-density` values.

- **Validation**
  `pnpm check` now verifies 4.5:1 text contrast across all themes and status tints.

- **Preview**
  Reorganized navigation into Foundations and component categories with instant search.

### Changed

- **Status Colors**
  Light-theme status colors had low contrast on tint fills (<4.5:1) → darkened to meet WCAG AA.

- **Theming**
  `getResolvedTheme()` returned dark/light → updated return type to `ThemeName`.

- **Tailwind**
  `dark:` variant matched only `[data-theme=dark]` → updated to match all dark themes (`[data-theme^=dark]`).

- **Brands**
  Violet brand had redundant AI color override → removed.

- **Preview**
  Removed manual RTL switch in UI → RTL testing moved entirely to browser test suite.

### Fixed

- **Swift Tokens**
  Export declared unescaped `switch` keyword → escaped as valid Swift syntax.

## Pre-release-2 — 2026-09-28 (internal 0.2.0)

ayywi now lives in its own repository: https://github.com/danitesler/ayywi.

### Added

- **[Avatar](#/avatar)**
  New component — image avatars with fallback initials and group clustering.

- **[Select](#/select)**
  New component — styled native select dropdown with custom arrow.

- **[Checkbox](#/checkbox)**
  New component — accessible checkbox with indeterminate state support.

- **[Radio Group](#/radio)**
  New component — grouped radio buttons.

- **[Popover](#/popover)**
  New component — floating popover panel with automatic viewport placement.

- **[Dropdown Menu](#/menu)**
  New component — menu list triggered by button with keyboard navigation.

- **[Toast](#/toast)**
  - New component — non-blocking notification alerts with framework-free `toast()` helper.
  - Added framework-free `toast()` function and React `<Toaster>` container.

- **[Alert](#/alert)**
  New component — status banner callout with info, warning, success, and destructive variants.

- **[Skeleton](#/skeleton)**
  New component — animated placeholder box for loading states.

- **Elements**
  Added `<ayy-tabs>`, `<ayy-dialog>`, `<ayy-popover>`, `<ayy-menu>`, and `<ayy-tooltip>` custom elements.

- **Density**
  Added `data-density` attribute and `setDensity()` / `getDensity()` functions.

- **Brands**
  Added brand token tier with initial `violet` brand stylesheet and `setBrand()` function.

- **High Contrast**
  Added Windows High Contrast (`forced-colors`) support across all components.

- **Overlays**
  Added dialog exit animations and automatic top-layer edge flipping for tooltips.

- **React**
  Added `"use client"` directive for Next.js App Router support.

- **Platform Tokens**
  Added JSON, SCSS, SwiftUI, and Jetpack Compose token export bundles.

- **CLI**
  Added `ayywi lint`, `ayywi init`, and `ayywi mcp` developer tools.

- **Testing**
  Added Playwright and axe automated accessibility test suites.

### Changed

- **Interactivity** (**Breaking**)
  Plain-script `ayywi/behaviors` removed → replaced with SSR-safe `<ayy-*>` custom elements in `@danitesler/ayywi/elements`.

- **CSS** (**Breaking**)
  Stylesheets were unlayered → wrapped in `@layer ayywi` (use `ayywi.unlayered.css` for old unlayered behavior).

- **Fonts**
  `fonts.css` loaded external Google Fonts → now self-hosts fonts locally (Google Fonts version moved to `fonts-google.css`).

- **Sizing**
  Control dimensions used fixed measurements → switched to density tokens (`compact`, `comfortable`, `touch`).

### Fixed

- **Overlays**
  Floating elements drifted in RTL due to entry scale animation → position calculation updated to ignore scale transform.

- **[Avatar](#/avatar)**
  Browser broken image icon appeared over fallback initials → hidden on image load error.

## Pre-release-1 — 2026-09-28 (internal 0.1.0)

First release.

### Added

- **Tokens**
  Initial library of 98 design tokens covering color, type, spacing, radius, and elevation across dark and light modes.

- **[Button](#/button)**
  New component — interactive buttons in solid, outline, ghost, and link styles.

- **[Card](#/card)**
  New component — content card container with header, body, footer, and spotlight effects.

- **[Badge](#/badge)**
  New component — status and count indicator chips.

- **[Input](#/input)**
  New component — single-line text input field.

- **[Textarea](#/textarea)**
  New component — multi-line text input field.

- **[Field](#/field)**
  New component — form field wrapper with Label, Hint, and Error message.

- **[Switch](#/switch)**
  New component — toggle switch control built on native checkbox.

- **[Tabs](#/tabs)**
  New component — tabbed navigation with animated active tab indicator.

- **[Dialog](#/dialog)**
  New component — accessible modal dialog built on native `<dialog>`.

- **[Tooltip](#/tooltip)**
  New component — hover and focus contextual text tips.

- **[Progress](#/progress)**
  New component — progress bar indicator.

- **[Table](#/table)**
  New component — responsive data table with striped and bordered options.

- **Core**
  Framework-agnostic CSS class contract (`.ayy-*`) with zero runtime dependencies and full RTL logical properties.

- **Helpers**
  Framework-free utility functions (`buttonClass()`, `setTheme()`, `getTheme()`, `cssVar()`).

- **Tailwind**
  Added Tailwind v3 preset and Tailwind v4 `@theme` configuration.

- **Documentation & AI**
  Added component preview app, AI context files (`manifest/components.json`, `llms.txt`), and `pnpm check` validator.
