# Changelog

All notable changes to ayywi. Semver: renaming or removing a class, token or prop is a breaking change.

## Unreleased

### Added
- App shell (Navigation), the frame of a signed-in app: a viewport-high grid of a 15rem sidebar and a main column, each scrolling on its own. `ayy-app-shell` with `__sidebar` (an `<aside>`), `__brand`, `__nav`, `__link` (`aria-current="page"` adds a tint, a heavier weight and an inline-start accent bar; High Contrast fills it with the system highlight), `__footer` (pinned to the bottom) and `__main`. Below 48rem the sidebar stacks above the content as one row (brand, links, footer) that scrolls sideways. React `AppShell`, `AppShellSidebar`, `AppShellBrand`, `AppShellNav`, `AppShellLink` (`current`), `AppShellFooter`, `AppShellMain`; helpers `appShellClass` … `appShellMainClass`.
- Side modal. `side="start"` or `side="end"` on `DialogContent` (`ayy-dialog--side-start` / `ayy-dialog--side-end` in HTML) turns a Dialog into a full-height panel that slides in from that inline edge. It flips in RTL, takes its width from the size modifiers, and leaves 3rem of backdrop on phones. `<ayy-dialog>` drives it unchanged.
- `DialogBody` (`.ayy-dialog__body`): content that scrolls on its own between the header and the footer, with a hairline where it meets them. In a side modal it fills the height, so the footer stays at the bottom.
- Hugeicons is ayywi's icon library, with a new Icon component. `<Icon icon={Search01Icon} />` renders any icon from `@hugeicons/core-free-icons`, an optional peer: ayywi renders the icon data, so it still has no runtime dependencies. `iconSvg()` returns the same markup as a string for other frameworks and server templates. Icons take the text colour and follow the text size; `size` sets 16, 20, 24 or 32px. With `label` an icon is announced (`role="img"`); without one it's `aria-hidden`. `directional` mirrors arrows and other icons that point along the reading direction in right-to-left text; the nearest `dir` attribute decides.
- Tokens `--ayy-size-icon-sm`, `-md`, `-lg`, `-xl` (16, 20, 24, 32px), also in the platform exports.
- `ayywi lint` warns about imports from other icon sets (lucide-react, react-icons, Heroicons and others) and flags a hardcoded `color`, `fill` or `stroke` on an `.ayy-icon` SVG, which would hide the icon in one of the themes.
- An icon rule in the AI kit, `llms-full.txt` and the MCP server.

### Changed
- `.ayy-dialog` is a flex column instead of a grid. Existing content lays out the same; the change lets `.ayy-dialog__body` take the leftover height.
- Dialog and Toast close buttons draw Hugeicons' Cancel01 icon (1.5px stroke) instead of a hand-drawn cross. `dialogCloseIcon` returns the new markup.
- Examples use Hugeicons: button, alert, dialog, and the dropdown menu, which now shows icons on its items.

## 0.4.0 — 2026-09-29

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

## 0.3.0 — 2026-09-28

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

## 0.2.0 — 2026-09-28

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

## 0.1.0 — 2026-09-28

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
