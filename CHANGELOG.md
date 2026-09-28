# Changelog

All notable changes to ayywi. Semver: renaming or removing a class, token or prop is a breaking change.

## 0.3.0 — 2026-09-28

### Added
- Two lower-contrast themes. `dark-soft` has a charcoal background (#1e1e1e) and off-white text; `light-soft` has an off-white background (#f2f2f2) and charcoal text. Main text is about 13:1 instead of 20–21:1, and every text colour still meets WCAG AA. Use `data-theme="dark-soft"` or `setTheme("light-soft")`. Themes live in `tokens/themes/*.json`, so adding one is a single file.
- `themes`, `themeBase` and `ThemeName` exports, plus `getColorScheme()`, which returns "dark" or "light" for any theme.
- Per-theme platform exports: `dark-soft.json` and `light-soft.json`, SCSS maps `$ayy-dark-soft` and `$ayy-light-soft`, Swift `AyywiColors.darkSoft`/`.lightSoft`, Compose `AyywiDarkSoftColors`/`AyywiLightSoftColors`.
- Component categories (Actions, Forms, Layout, Overlays, Feedback, Data display). Every component's meta has a `category`, and the manifest, llms files and the MCP `list_components` tool group by it.
- Colour categories (Surfaces, Text, Lines, Interactive, Status, AI, Effects) on the colour tokens, in the manifest and the generated `tokens` table.
- `ayywi lint` flags unknown `data-theme` and `data-density` values (e.g. `data-theme="dim"`) and lists the valid ones.
- `pnpm check` enforces 4.5:1 contrast for every text colour on every surface, in every theme and brand. That includes status text on a 15% tint of itself (badges, alerts, destructive buttons).
- Preview: the sidebar is grouped into Foundations and component categories, with search (`/` or Ctrl/⌘K). The Tokens page is split into Colors (every theme side by side), Typography, Spacing & sizing, Radius & elevation, and Motion.

### Changed
- Light-theme status colours are one shade darker: destructive, success, warning, info and AI-active. They passed on white but not on their own tints: destructive text on the destructive button's hover fill measured 3.6:1.
- `getResolvedTheme()` can return the soft themes: `ResolvedTheme` is now `ThemeName`. If you only need light or dark, use `getColorScheme()`.
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
