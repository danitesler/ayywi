---
name: ayywi
description: Build and edit UI with the ayywi design system. Use whenever you create or change components, pages, screens, app layouts, forms, dialogs, tables or styles in a project that depends on ayywi, or when the user mentions ayywi, design tokens, theming, dark mode, mobile layout or RTL.
---

# Building UI with ayywi

ayywi is a CSS class contract (`.ayy-*`) plus design tokens (`--ayy-*`), with typed React components and light-DOM custom elements on top. The same markup works in React, Vue, Svelte, Angular, Astro, plain HTML and server templates.

## 1. Load the right context first

- If the `ayywi` MCP server is connected, use it: `list_components` or `search` to find the piece, `get_component` for its spec and copy-ready examples, `get_tokens`, `get_rules` (rules, utilities, custom properties), and `lint` to check what you wrote.
- Quick lookup: [reference.md](reference.md) — every component's classes, React props and a11y in one screen.
- Full detail for a component you're about to use: its entry in `node_modules/@danitesler/ayywi/manifest/components.json`, or its section of `node_modules/@danitesler/ayywi/llms-full.txt` (the ayywi preview site hosts the same `llms-full.txt` when the package isn't installed). Start from an example rather than from scratch.
- Tokens: the `tokens` array in the same manifest (name, css var, values per theme, purpose).

## 2. Pick the integration style the project already uses

| Project | Write |
|---|---|
| React / Next / Remix | `import { Button, Dialog, … } from "@danitesler/ayywi/react"` |
| Vue, Svelte, Solid, Angular, Lit | markup with `ayy-` classes (or `buttonClass()` from `"@danitesler/ayywi"`); `<ayy-app-shell>`, `<ayy-navbar>`, `<ayy-tabs>`, `<ayy-combobox>`, `<ayy-dialog>`, `<ayy-popover>`, `<ayy-menu>`, `<ayy-tooltip>`, `<ayy-toc>`, `<ayy-carousel>`, `<ayy-table>`, `<ayy-theme-toggle>` from `"@danitesler/ayywi/elements"` for interactive parts; `toast()` from `"@danitesler/ayywi"` |
| Plain HTML, Rails, Django, Laravel, Go, .NET, PHP | same markup + `dist/ayywi.min.css` and `dist/elements.global.js` (also gives `window.ayywi.toast`, `setTheme`, `chartColors`…); `dist/fonts.css` for the fonts and `dist/theme-init.js` first in `<head>` so a saved theme applies before the first paint |
| Tailwind | keep ayywi components; map Tailwind's theme to ayywi (`@danitesler/ayywi/tailwind.css` for v4, `@danitesler/ayywi/tailwind-preset` for v3) and use its utilities (`bg-surface`, `border-line`, `rounded-card`, `bg-chart-1`) for layout glue, never Tailwind's own colour scale |
| Already on shadcn/ui | load `@danitesler/ayywi/shadcn.css` after ayywi so leftover shadcn parts take ayywi's colours, radius and font; build new UI with ayywi and replace a shadcn component whenever you touch it |

Check `package.json` and existing components before choosing. Match what's there.

## 3. Rules (the full list: the ayywi section of AGENTS.md, or `get_rules`)

1. Reuse ayywi components and their variants before writing custom CSS. Never add a second UI kit (see "Already on shadcn/ui" above for one that's there).
2. No hardcoded colours, in stylesheets or inline styles: `var(--ayy-color-*)`, the wash/line tokens, or `color-mix(in srgb, var(--ayy-color-text) N%, transparent)`.
3. Logical properties only (`margin-inline-start`, `padding-inline`, `inset-inline-end`, `inline-size`, `text-align: start`). No `left`/`right`, no `:dir()`.
4. Spacing, sizes, radius, type, shadow and motion from tokens. Lay out with `.ayy-stack`, `.ayy-cluster`, `.ayy-spread`, `.ayy-grid` and `.ayy-split` (gap via `--ayy-gap`) instead of new flex CSS.
5. No per-theme colour code. Tokens switch with `data-theme` (`dark`, `light`, `dark-soft`, `light-gray`) or the OS preference. Same for `data-density` — don't hand-size controls.
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
| Phone navigation | `BottomNav` as a direct child of the shell, after the main, with the sidebar's top destinations (same labels, icons, order). More than five? The four most used, then a More tab (`BottomNavButton className="ayy-app-shell__toggle"`) that opens the sidebar as a drawer. |
| Phone top bar | `AppShellBar` first in the shell: the brand, then one or two actions (search, avatar). Add `AppShellToggle` only for a drawer-only app without a bottom nav. |
| Top of every screen | `PageHeader`: `PageHeaderTitle` (the `<h1>`), `PageHeaderDescription`, `PageHeaderActions` (at most one primary button). A `Breadcrumb` goes first when pages nest. |
| Toolbars and filters | `.ayy-spread` row with a `SegmentedControl` (views, ranges), an `InputGroup` search with a `Kbd` hint, and buttons |
| KPIs | `.ayy-grid` of `Card` + `Stat` + a status `Badge` |
| Main + side column | `.ayy-split` (the side column drops below when there's no room) |
| Rows of things | `List` (threads, members, files; `ListLink` makes a row clickable, `current` marks the open one); `List divided` for settings rows with a `Switch`; `Table` + `Pagination` for records compared across columns |
| Sorting and selecting rows | `TableHead sort onSort` (HTML: an `.ayy-table__sort` button in the `<th>`, `aria-sort` on it, `<ayy-table>` sorts); `compareValues()` sorts numbers like "$1,240" by value; a `select` checkbox column with `TableRow selected`, the count and bulk actions above the table |
| Filters | a `.ayy-spread` toolbar: a search `InputGroup`, `Chip`s (checkbox, or `ChipButton` when it filters on click) with `count`s, the active ones as `ChipRemovable` with Clear all; `ChipGroup scroll` on phones. An `EmptyState` with "Clear filters" when nothing matches |
| Charts | in a `Card` with the title and the key number: `LineChart` for a trend (last period as a `compare` series), `BarChart` for amounts by category or period (`stacked` for parts), `BarList` for a ranking, `Sparkline` next to a `Stat`. Series take `--ayy-chart-1`… in order. With a library: `var(--ayy-chart-N)` in SVG, `chartColors()` / `chartTheme()` for canvas |
| Picking values | two to five words: `SegmentedControl`; options with a sentence or a price: `ChoiceGroup` of `ChoiceCard`s (`compact` for time slots, `scroll` for a day strip); many known values: `Combobox`; small counts: `NumberField`; a rough amount or a price range: `Slider` / `SliderRange`; dates and times: `Input type="date"` / `"time"` |
| Uploads | `Dropzone` (`compact` in a form), then a `List divided` of the files with a `Progress` each and a remove button |
| Facts about one thing | `DataList` |
| Settings sections | `Tabs`, then a `Card` per group with a `CardFooter` for Save |
| Multi-step flows | `Steps` above the form, one primary Continue per step |

## 5. Websites, landing pages and portfolios

| Need | Use |
|---|---|
| Page width, gutters | `.ayy-container` (1400px, 24px gutter, 16px on phones) |
| Top bar | `Navbar` (brand, links with `aria-current="page"`, actions with a `ThemeToggle` and one `ring` button, and a `NavbarToggle` last so the links fold into a menu on phones) |
| Hero | `.ayy-bg-grid` behind it, a `Badge`, `.ayy-display` or `.ayy-h1`, `.ayy-lede`, a ring and an outline button |
| Page section | `Section` (`center` on marketing pages; `SectionEyebrow number="01"` in long reads), fading `Separator` between sections |
| Features | `.ayy-grid` of `Card`s with an `IconTile` each, in different `--ayy-accent-*` tokens |
| Pricing | `SegmentedControl` for monthly/yearly, plan `Card`s (the recommended one `featured`, with a Badge), perks in a `List compact` with icons |
| FAQ | `Accordion single` |
| Grid of work | `.ayy-grid` of `Card interactive spotlight` with `CardMedia` and a `CardLink` title, `--ayy-spot` per item |
| Case-study page | `Breadcrumb pill`, `Frame` around screenshots, `DataList row`, `Toc sticky numbered` beside `.ayy-prose` sections |
| Photo or quote strip | `Carousel` |
| Sign-up | `InputGroup` (email, with an icon) and a submit `Button` |
| Shop | category `Chip`s (radio) with counts, a `SliderRange` for price, a `Select` to sort; an `.ayy-grid` of product `Card`s; the cart in a `Dialog side="end"` with a `NumberField` per line, delivery `ChoiceCard`s and a `DataList row` of totals |
| End of page | `Footer`: `FooterBrand`, `FooterNav` of `FooterGroup`s, `FooterBottom` for copyright and legal links |
| Motion | `.ayy-reveal` on blocks, `.ayy-scroll-progress` at the top of long reads — CSS only |

Colour comes from the content: set `--ayy-spot` to an `--ayy-accent-*` token on the card, section or `<main>` — never tint the chrome.

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

- Run `npx ayywi lint <changed files>` (or the MCP `lint` tool) and fix every error. It catches invented classes, unknown tokens and variants, raw and named colours (inline styles too), `left/right`, unlabeled icon buttons, images without a size and other icon sets.
- Look at the screen below 48rem: an app shows its bottom nav, a site's navbar folds into a menu, nothing scrolls sideways.
- If the app has a theme switch, check dark and light (and dark-soft, light-gray). If it supports RTL, check with `dir="rtl"`.
- Interactive pieces work by keyboard: Tab to reach, Enter/Space to activate, Esc closes dialogs, menus and drawers, arrows move between tabs and segments.
