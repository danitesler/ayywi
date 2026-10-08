# Changelog

All notable changes to ayywi. Semver: renaming or removing a class, token or prop is a breaking change.

### Format rules
- Title on row 1 (with link to component if applicable): `- **[<Component>](#/<slug>)**`
- Description on row 2 indented: `  <was X> → <now Y>`
- Keep entries short, specific, and focused on what changed without internal implementation details.

## Unreleased

### Added
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
  Standard shell layout only → added `ayy-app-shell--settings` full-screen settings pattern with phone drill-down navigation.
- **Patterns**
  Added full-screen design patterns contract (`PATTERNS`) to standardize common screen recipes and mobile behaviors.
- **Linter**
  Linter checked only CSS values → added structural rules to prevent custom component rebuilds (`rebuilt-component`, `component-override`, `bare-control`).
- **Component Metadata**
  Component states and size scales were partially documented → standardized across all components with strict `states` and `sizes` specifications.
- **Component Metadata**
  Added `aka` aliases to component schemas to detect duplicate custom implementations.

### Changed
- **Get Started**
  Tabs "I build with AI tools", "Link files", "Install", "Chat only" with a one-line note → "AI Builders", "No-Build / CDN", "NPM & CLI", "Web Chat", each with a use-case line and a checklist of what the copied prompt includes.
- **Get Started**
  Two door tabs ("I build with AI tools" / "I'm a developer") → four tabs ("I build with AI tools", "Link files", "Install", "Chat only"), with the AI tools prompt shown open below supported tool icons with a 400px max height.
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

### Fixed
- **[Contents](#/toc)**
  Squeezed into narrow side column on mobile → now displays as a sticky horizontal row below the navbar.
- **[Contents](#/toc)** & **[Breadcrumb](#/breadcrumb)**
  Links had undersized touch targets (19–31px) → increased to 40px touch targets.
- **[Breadcrumb](#/breadcrumb)**
  Wrapped onto multiple lines on mobile → now stays on one line with intermediate breadcrumb ellipsis.
- **[Section](#/section)**
  Kept desktop padding (80px) on mobile → reduced to 48px padding for mobile screens.
- **[Card](#/card)** & **[Button](#/button)**
  Touch taps left hover animations stuck in active state → hover states now restricted to devices with real cursor hover.

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
  Desktop sidebar only → added `ayy-bottom-nav` mobile tab bar that automatically replaces the sidebar on screens under 48rem.
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
  Added `--ayy-chart-1` through `--ayy-chart-6` accessible palette tokens for data visualizations.
- **Elements**
  Added `@danitesler/ayywi/elements` runtime to automatically wire slider tracks, stepper buttons, and dropzones in plain HTML.
- **Distribution**
  Added standalone `dist/theme-init.js` script and `dist/shadcn.css` compatibility bridge.
- **Documentation**
  Added individual `llms/<slug>.md` documentation files for every component.
- **Rules**
  Added design guidance for charts, filters, and mobile viewport layouts.
- **[Progress](#/progress)**
  Used `tone` prop → renamed to `variant` to match Badge and Alert.
- **Layout**
  Added `.ayy-spread`, `.ayy-split`, and `.ayy-truncate` utilities, with automatic child margin resets.
- **Tokens**
  Disabled controls had varying opacities (0.5–0.6) → standardized to `--ayy-opacity-disabled` (0.4).
- **[Theme Toggle](#/theme-toggle)** & **[Carousel](#/carousel)**
  Added `labels` and `slideLabel` props for accessibility translations.
- **Rules**
  Added requirement for App Shell frames and standard empty/loading/error states on all app screens.
- **Linter**
  Added validation for inline style attributes and named CSS colors.
- **MCP Server**
  Added component status, variants, utilities, and allowed custom properties to MCP inspection tools.
- **Preview**
  Added copy-paste AI prompt starters and updated Get Started guide.
- **Preview**
  Published previews loaded unversioned files → now pinned to immutable versioned assets (`v/<release>/dist/`).
- **Showcase**
  Added Ember (e-commerce) and Haven (booking) demonstration apps.
- **[Bottom Nav](#/bottom-nav)**
  New component — mobile bottom navigation bar with sticky positioning.
- **[Dialog](#/dialog)**
  Centered modals only → added bottom sheet dialog style for mobile.
- **Typography**
  Added `.ayy-h5` (18px) and `.ayy-h6` (16px semibold) heading utility classes.
- **[App Shell](#/app-shell)**
  Added support for section groups, nested sub-lists, and collapsible navigation folders.
- **[App Shell](#/app-shell)**
  New component — responsive app shell with desktop sidebar and responsive mobile layout.
- **[Dialog](#/dialog)**
  Centered modals only → added side slide-in sheets (`side="start"` / `side="end"`) and scrollable `DialogBody`.
- **[Icon](#/icon)**
  Added Hugeicons integration via `<Icon>` React component and framework-agnostic `iconSvg()` helper.
- **Tokens**
  Added standardized icon sizing tokens `--ayy-size-icon-sm` through `-xl` (16px to 32px).

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
  Used physical pixel sizes → converted to logical rem units and token gaps.
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
- **Examples**
  Updated all example icons to use Hugeicons.
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
  Added layout rhythm tokens (`space.20/24/32`), container width tokens, and display heading scales.
- **Tokens**
  Added `--ayy-min` (grid column size), `--ayy-slide` (carousel width), and `--ayy-spot` (accent color hook).
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
  New component — non-blocking notification alerts with framework-free `toast()` helper.
- **[Alert](#/alert)**
  New component — status banner callout with info, warning, success, and destructive variants.
- **[Skeleton](#/skeleton)**
  New component — animated placeholder box for loading states.
- **Elements**
  Added `<ayy-tabs>`, `<ayy-dialog>`, `<ayy-popover>`, `<ayy-menu>`, and `<ayy-tooltip>` custom elements.
- **[Toast](#/toast)**
  Added framework-free `toast()` function and React `<Toaster>` container.
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
