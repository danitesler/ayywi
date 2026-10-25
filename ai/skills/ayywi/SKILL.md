---
name: ayywi
description: Build and edit UI with the ayywi design system. Use whenever you create or change components, pages, screens, app layouts, forms, dialogs, tables or styles in a project that depends on ayywi, or when the user mentions ayywi, design tokens, theming, dark mode, mobile layout or RTL.
---

# Building UI with ayywi

ayywi is a CSS class contract (`.ayy-*`) plus design tokens (`--ayy-*`), with typed React components and light-DOM custom elements on top. The same markup works in React, Vue, Svelte, Angular, Astro, plain HTML and server templates.

## 0. Every piece is an ayywi component

Before you write a screen, list its pieces (actions, inputs, choices, lists, panels, overlays, states) and name the ayywi component for each by what it has to do. The map is in the MCP `get_rules` / `pick_component`, or llms-full.txt → "Need → component". The ones agents get wrong most:

| You're about to write | Write instead |
|---|---|
| `<button>` (raw or with your classes), `<div onClick>` | `Button` (ghost or `size="icon"` for small actions); `ListLink` / `CardLink` for a clickable row or card |
| `<select>`, a button that opens a `<div>` of choices, a Dropdown menu used as a picker | `Select` (opens ayywi's own options list; touch screens keep the OS picker); `SegmentedControl` for two to five short options; `Combobox` to type and filter |
| Buttons with `aria-pressed` or an active class to switch a view | `SegmentedControl`; `Tabs` when it swaps panels of content |
| `<input type="checkbox">`, a toggle made of divs | `Switch` (applies at once) or `Checkbox` (submitted with a form) |
| `<input>`, `<textarea>` | `Field` + `Label` + `Input` / `InputGroup` / `Textarea` / `NumberField` |
| A bordered `<div>` box, a coloured `<span>` pill | `Card` (+ `CardHeader`, `CardTitle`, `CardContent`), `Badge` |
| `<ul>` rows with borders and hover | `List` (`divided`, `ListLink`), `Settings` rows for preferences |
| `<table>`, `<details>`, `<dialog>`, `<progress>` | `Table`, `Accordion`, `Dialog`, `Progress` |
| A fixed `<div>` that slides in, a hand-positioned popup | `Dialog side="end"`, `Popover`, `DropdownMenu`, `Tooltip` |

A raw native control is never right in an ayywi project: it renders as the browser default and skips the focus ring, density, themes and RTL. If the component you need doesn't exist, compose it from ayywi components (section 7) — don't fall back to raw HTML.

## 1. Load the right context first

- Building a whole screen that has a pattern (Settings, Data explorer, Marketing page)? Follow the pattern first: `get_rules` lists each one's recipe, phone behaviour and specs (llms-full.txt → Patterns without MCP).
- If the `ayywi` MCP server is connected, use it: `list_components` or `search` to find the piece, `get_component` for its spec and copy-ready examples, `get_tokens`, `get_rules` (rules, utilities, custom properties), and `lint` to check what you wrote.
- Quick lookup: [reference.md](reference.md) — every component's classes, React props and a11y in one screen.
- Full detail for a component you're about to use: its entry in `node_modules/@danitesler/ayywi/manifest/components.json`, or its page `node_modules/@danitesler/ayywi/llms/<component>.md`, which has the copy-ready examples (the ayywi preview site hosts the same `llms/` pages when the package isn't installed; `llms-full.txt` has every component's API but no examples). Start from an example rather than from scratch.
- Tokens: the `tokens` array in the same manifest (name, css var, values per theme, purpose).

## 2. Pick the integration style the project already uses

| Project | Write |
|---|---|
| React / Next / Remix | `import { Button, Dialog, … } from "@danitesler/ayywi/react"` |
| Vue, Svelte, Solid, Angular, Lit | markup with `ayy-` classes (or `buttonClass()` from `"@danitesler/ayywi"`); `<ayy-app-shell>`, `<ayy-navbar>`, `<ayy-tabs>`, `<ayy-combobox>`, `<ayy-date-picker>`, `<ayy-date-range>`, `<ayy-time-picker>`, `<ayy-date-time-picker>`, `<ayy-color-picker>`, `<ayy-icon-picker>`, `<ayy-toolbar>`, `<ayy-action-bar>`, `<ayy-shortcut-recorder>`, `<ayy-command>`, `<ayy-tag-input>`, `<ayy-record-picker>`, `<ayy-inline-edit>`, `<ayy-swipe>`, `<ayy-drag-drop>`, `<ayy-dialog>`, `<ayy-popover>`, `<ayy-menu>`, `<ayy-tooltip>`, `<ayy-toc>`, `<ayy-tree>`, `<ayy-carousel>`, `<ayy-table>`, `<ayy-grid>` from `"@danitesler/ayywi/elements"` for interactive parts; `toast()` from `"@danitesler/ayywi"` |
| Plain HTML, Rails, Django, Laravel, Go, .NET, PHP | same markup + `dist/ayywi.min.css` and `dist/elements.global.js` (also gives `window.ayywi.toast`, `setTheme`, `chartColors`…); `dist/fonts.css` for the fonts and `dist/theme-init.js` first in `<head>` so a saved theme applies before the first paint |

Check `package.json` and existing components before choosing. Match what's there.

Adding or upgrading ayywi itself: install `@danitesler/ayywi` from npm and import only from that name (never `"ayywi"`, never a path into `node_modules`). Don't vendor it: no copied `dist/`, no `.tgz`, no committed `file:`/`link:` dependency. After an upgrade, run `npx @danitesler/ayywi init --force`. To develop ayywi next to an app, alias it to a local checkout through an `AYYWI_DIR` environment variable and keep that out of git. The full list is "Installing and updating" in the AGENTS.md section or `get_rules`, and `ayywi lint` checks it.

## 3. Rules (the full list: the ayywi section of AGENTS.md, or `get_rules`)

1. Reuse ayywi components and their variants before writing custom CSS. ayywi is self-contained — never add another CSS framework or UI kit.
2. No hardcoded colours, in stylesheets or inline styles: `var(--ayy-color-*)`, the wash/line tokens, or `color-mix(in srgb, var(--ayy-color-text) N%, transparent)`.
3. Logical properties only (`margin-inline-start`, `padding-inline`, `inset-inline-end`, `inline-size`, `text-align: start`). No `left`/`right`, no `:dir()`.
4. Spacing, sizes, radius, type, shadow and motion from tokens. Lay out with `.ayy-stack`, `.ayy-cluster`, `.ayy-spread`, `.ayy-grid` and `.ayy-split` (gap via `--ayy-gap`) instead of new flex CSS.
5. No per-theme colour code. Tokens switch with `data-theme` (`dark`, `light`, `dark-contrast`, `light-gray`) or the OS preference. Same for `data-density` — don't hand-size controls.
6. Don't write breakpoints for navigation: App shell, Navbar and Pagination switch at 48rem on their own; `.ayy-grid` and `.ayy-split` adapt to their container.
7. Accessibility is part of the component: labels for every control, `aria-label` on icon-only buttons, never remove focus rings, one `<h1>` per page.
8. State goes in native/ARIA attributes (`disabled`, `checked`, `aria-selected`, `aria-current`, `aria-invalid`, `aria-busy`, `open`) — the CSS reads them.
9. Icons are Hugeicons: `<Icon icon={Search01Icon} />` in React (from `@hugeicons/core-free-icons`; install it if it's missing), `iconSvg(Search01Icon)` or an `<svg class="ayy-icon">` elsewhere. No other icon set, no hand-drawn SVGs. Arrows get `directional` so they mirror in RTL.
10. Side panels, drawers and sheets are a Dialog with `side="end"`, `"start"` or `"bottom"`, not a custom fixed div.

## 4. Apps: dashboards, tools, anything signed-in

Every app screen uses the same frame, so the product feels like one thing on every device:

| Need | Use |
|---|---|
| Frame | `AppShell`: `AppShellSidebar` (brand, `AppShellNav` of `AppShellGroup`s, `AppShellFooter` for the account and help) and `AppShellMain`. No Navbar. |
| Screen width | The main fills the shell. Don't wrap a screen in `.ayy-container` or a `max-inline-size`. Those on examples only size the preview. Long text may stop at `--ayy-size-measure`. Settings mode already centres its column — don't add a second cap. |
| Phone navigation | `BottomNav` as a direct child of the shell, after the main, with the sidebar's top destinations (same labels, icons, order). More than five? The four most used, then a More tab (`BottomNavButton className="ayy-app-shell__toggle"`) that opens the sidebar as a drawer. |
| Phone top bar | `AppShellBar` first in the shell: the brand, then one or two actions (search, avatar). Add `AppShellToggle` only for a drawer-only app without a bottom nav. |
| Top of every screen | `PageHeader`: `PageHeaderTitle` (the `<h1>`), `PageHeaderDescription`, `PageHeaderActions` (at most one primary button). A `Breadcrumb` goes first when pages nest. |
| Toolbars and filters | `FilterBar` with `FilterBarTabs`, faceted `FilterBarTrigger` menus, `SearchBar`, `Sorting`, and active `ChipRemovable` filters |
| KPIs | `.ayy-grid` of `Card` + `Stat` + a status `Badge` |
| Main + side column | `.ayy-split` (the side column drops below when there's no room) |
| Rows and grids of things | `List` (threads, members, files; `ListLink` makes a row clickable, `current` marks the open one); `List divided` for settings rows with a `Switch`; `Table` + `Pagination` for records compared across columns; `Grid` of `GridItem`s for selectable media, screenshot, project or user cards |
| Sorting, row actions and bulk selection | `TableHead sort onSort` (HTML: an `.ayy-table__sort` button in the `<th>`, `aria-sort` on it, `<ayy-table>` sorts) or `Sorting` dropdown; `compareValues(a, b, direction)` sorts numbers like "$1,240" by value, empty cells last; a `select` checkbox column with `TableRow selected` or `GridItem selected`, per-row `TableRowActions` / `GridItemActions` (inline buttons + `⋯` `DropdownMenu`), and a floating `ActionBar` at the bottom when items are selected |
| Filters | `FilterBar` (`FilterBarMain`, `FilterBarTabs` of `FilterBarTab`s with `count`s, `FilterBarGroup` of `FilterBarTrigger`s opening `DropdownMenu`s, `SearchBar`, and `FilterBarActive` holding `ChipRemovable`s + `FilterBarClear`); or `Chip`s (checkbox, radio or `ChipButton`) with `ChipGroup scroll` on phones. An `EmptyState` with "Clear filters" when nothing matches |
| Charts | in a `Card` with the title and the key number: `LineChart` for a trend (last period as a `compare` series), `BarChart` for amounts by category or period (`stacked` for parts), `BarList` for a ranking, `Sparkline` next to a `Stat`, `TableChart` for accessible tabular chart views. Series take `--ayy-chart-1`… in order. With a library: `var(--ayy-chart-N)` in SVG, `chartColors()` / `chartTheme()` for canvas |
| Picking values | two to five words: `SegmentedControl`; options with a sentence or a price: `ChoiceGroup` of `ChoiceCard`s (`compact` for time slots, `scroll` for a day strip); a short list: `Select`; many known values: `Combobox`; small counts: `NumberField`; a rough amount or a price range: `Slider` / `SliderRange`; dates and times: `DatePicker` / `DateRangePicker` / `TimePicker` / `DateTimePicker` (`Input type="date"` for a birth date, `type="time"` for rapid typing); colours: `ColorSwatches` or `ColorPicker` |
| Uploads | `Dropzone` (`compact` in a form), then a `List divided` of the files with a `Progress` each and a remove button |
| Settings | A near-full-screen dialog over the app, never a small or side dialog or tabs: `<DialogContent size="full">` holding `AppShell settings` with `AppShellTitle` (the dialog's name) and an `AppShellNav aria-label="Settings"` of groups, and `<AppShellMain as="div">`; each section starts with a `TopBar` (back to the list, shown on phones only) and `Settings` groups of `SettingsRow` / `SettingsLink`. On phones the dialog fills the screen and the section list and a section are two screens. Recipe and specs: the Settings pattern (`get_rules`, llms-full.txt → Patterns) |
| Multi-step flows | `Steps` above the form, one primary Continue per step |

## 5. Websites, landing pages and portfolios

| Need | Use |
|---|---|
| Page width, gutters | `.ayy-container` (1400px, 24px gutter, 16px on phones) |
| Top bar | `Navbar` (brand, links with `aria-current="page"`, actions with a theme `DropdownMenu` (radio items calling `setTheme()`) and one `ring` button, and a `NavbarToggle` last so the links fold into a menu on phones) |
| Hero | `.ayy-bg-grid` behind it, a `Badge`, `.ayy-display` or `.ayy-h1`, `.ayy-lede`, a ring and an outline button |
| Page section | `<section>` with generous block padding, fading `Separator` between sections |
| Features | `.ayy-grid` of `Card`s with an `IconTile` each, in different `--ayy-accent-*` tokens |
| Pricing | `SegmentedControl` for monthly/yearly, plan `Card`s (the recommended one `featured`, with a Badge), perks in a `List compact` with icons |
| FAQ | `Accordion single` |
| Grid of work | `.ayy-grid` of `Card interactive spotlight` with `CardMedia` and a `CardLink` title, `--ayy-spot` per item |
| Case-study page | `Breadcrumb pill`, `Frame` around screenshots, `Toc sticky numbered` beside `.ayy-prose` sections |
| Photo or quote strip | `Carousel` |
| Sign-up | `InputGroup` (email, with an icon) and a submit `Button` |
| Shop | category `Chip`s (radio) with counts, a `SliderRange` for price, a `Select` to sort; an `.ayy-grid` of product `Card`s; the cart in a `Dialog side="end"` with a `NumberField` per line, delivery `ChoiceCard`s and totals in an `.ayy-stack` |
| End of page | `Footer`: `FooterBrand`, `FooterNav` of `FooterGroup`s, `FooterBottom` for copyright and legal links |
| Motion | `.ayy-reveal` on blocks, `.ayy-scroll-progress` at the top of long reads — CSS only |

Colour comes from the content: set `--ayy-spot` to an `--ayy-accent-*` token on the card or `<main>` — never tint the chrome.

### Branding a product

Never pick brand colours, hover shades or text-on-brand colours yourself. Run `npx @danitesler/ayywi brand "<#seed>" --name <name> [--shape pill|round|soft|sharp] [--body "<font>"] --out <name>.css` (or the MCP `create_brand` tool), load the CSS after ayywi's and put `data-brand="<name>"` on `<html>`. It sets `primary`, `primary-fg`, `ring`, the corners, the fonts and an `--ayy-brand-50…950` scale, with contrast checked in every theme. Buttons, checks, switches and focus rings follow; navigation and page backgrounds stay neutral. For a colour the user picks at runtime, call `setBrand({ name, color })`. Load brand fonts yourself (`@font-face` or a font service).

## 6. Every screen has four states

| State | Use |
|---|---|
| Loading content | `Skeleton` shapes of the content, `aria-busy="true"` on the region |
| Working on an action | `<Button loading>` (HTML: `aria-busy="true"` + an `.ayy-spinner`); `Spinner` for a small area |
| Empty, or no results | `EmptyState` (an `IconTile`, a title, one sentence, the action that fills it); `compact` inside a card or table |
| Failed load or save | `Alert variant="destructive"` with a retry button in `AlertActions`; a field error is a `FieldError` plus `aria-invalid` |
| Done | `toast.success()` for a confirmation that can disappear |

## 7. When something is missing

Compose it from existing components, utilities and tokens in the app's own code. Name your own classes without the `ayy-` prefix (it's reserved), but keep the tokens. If it's generic enough to belong in the system, say so and suggest adding it to ayywi.

## 8. Before you finish

- Run `npx @danitesler/ayywi lint <changed files>` (or the MCP `lint` tool) and fix every finding, warnings included. It catches invented classes, unknown tokens and variants, raw and named colours (inline styles too), `left/right`, unlabeled icon buttons, images without a size, other icon sets, and skipped components: raw native controls (`raw-control`), hand-styled ones (`bare-control`), clickable divs (`clickable-element`), look-alike classes (`rebuilt-component`) and restyled components (`component-override`), plus imports from the unscoped `"ayywi"` (`unscoped-import`) and a vendored or `file:`-linked ayywi (`vendored-ayywi`). In Claude Code, `npx @danitesler/ayywi init` runs it after every file you write and hands you the findings.
- Built or changed a whole screen? Have the `ayywi-ui-reviewer` agent (installed by `npx @danitesler/ayywi init`) review it, and fix what it reports.
- Look at the screen below 48rem: an app shows its bottom nav, a site's navbar folds into a menu, nothing scrolls sideways.
- If the app has a theme switch, check dark and light (and dark-contrast, light-gray). If it supports RTL, check with `dir="rtl"`.
- Interactive pieces work by keyboard: Tab to reach, Enter/Space to activate, Esc closes dialogs, menus and drawers, arrows move between tabs and segments.
