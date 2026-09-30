# ayywi

A small design system that works in any stack and is built for AI agents to use.

Components are plain CSS classes (`ayy-button`, `ayy-card`…) driven by tokens (`--ayy-color-bg`…), so they work anywhere that outputs HTML. React gets typed components that render the same markup; every other framework gets a few light-DOM custom elements for the interactive parts.

- **Small:** zero runtime dependencies. All 34 components are ~12 kB of CSS gzipped.
- **Themes, density, brands:** dark, light, a softer dark and a grey light theme; compact/comfortable/touch sizing; swappable brands. Each one is a single attribute.
- **Accessible:** keyboard support, focus rings, ARIA, RTL and Windows High Contrast built in. axe runs on every component in CI.
- **AI-first:** a machine-readable manifest, `llms.txt`, a skill for Claude/Cursor/Codex, an MCP server, and a linter that checks what agents write.

## See it

```sh
pnpm install
pnpm preview    # http://localhost:5173
```

Every component and foundation (colours, type, spacing…), grouped by category, with search (<kbd>/</kbd> or <kbd>Ctrl</kbd>/<kbd>⌘</kbd><kbd>K</kbd>). Switch theme, density, brand, and React vs. plain HTML from the toolbar.

## Install

```sh
npm i github:danitesler/ayywi    # private repo: needs GitHub access (SSH key, or a token in CI)
```

Once it's on npm: `npm i ayywi`, or with no build step:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/ayywi@0.4/dist/ayywi.min.css">
<script src="https://cdn.jsdelivr.net/npm/ayywi@0.4/dist/elements.global.js" defer></script>
```

## Use it

**Plain HTML / server templates**: load `ayywi.min.css` and `elements.global.js`, then write markup:

```html
<button class="ayy-button">Save</button>
<button class="ayy-button ayy-button--outline ayy-button--sm" onclick="ayywi.toast('Saved')">Toast</button>

<ayy-dialog>
  <button class="ayy-button ayy-button--destructive" data-ayy-open>Delete</button>
  <dialog class="ayy-dialog" aria-labelledby="t">
    <h2 class="ayy-dialog__title" id="t">Delete this?</h2>
    <div class="ayy-dialog__footer">
      <button class="ayy-button ayy-button--secondary" data-ayy-close>Cancel</button>
      <button class="ayy-button ayy-button--destructive" data-ayy-close="delete">Delete</button>
    </div>
  </dialog>
</ayy-dialog>
```

**React**:

```tsx
import "ayywi/css";
import { Button, toast } from "ayywi/react";

<Button variant="outline" onClick={() => toast("Saved")}>Save</Button>
```

**Vue, Svelte, Angular, Solid…**: import `ayywi/css` and `ayywi/elements` once, then use the same markup as plain HTML, or `buttonClass({ variant: "outline" })` from `ayywi`. In Vue, set `isCustomElement: (tag) => tag.startsWith("ayy-")`; in Angular, add `CUSTOM_ELEMENTS_SCHEMA`.

**Tailwind**: alongside `ayywi/css`, v4 `@import "ayywi/tailwind.css"`; v3 `presets: [require("ayywi/tailwind-preset")]`.

**Other platforms**: `pnpm build` writes SCSS, SwiftUI, Compose and JSON tokens to `dist/tokens/`, one palette per theme.

Each component page in the preview shows copy-ready HTML and React. The full API is in `manifest/components.json` and `llms-full.txt`.

## Theme, density, brand

```html
<html data-theme="dark-soft" data-density="comfortable" data-brand="violet">
```

- **Theme:** `dark`, `light`, `dark-soft` or `light-gray`. Leave it off to follow the OS. It can also go on any section.
  - `dark-soft` swaps black for charcoal and white text for off-white (about 13:1 instead of 21:1), which is easier on the eyes for long reading.
  - `light-gray` puts white cards and panels on a grey page with full-strength text, so surfaces stand out more than in the all-white theme.
  - Every theme keeps all text at WCAG AA, and `pnpm check` enforces it. To add a theme, drop a file in `tokens/themes/`.
- **Density:** `compact` is the default. Phones and tablets get `touch` automatically.
- **Brand:** load `dist/brands/<name>.css`. To add a brand, copy `tokens/brands/violet.json`, edit it and run `pnpm build`.

From JS: `setTheme()`, `setDensity()`, `setBrand()`, and `getColorScheme()` when you only need "dark" or "light" (charts, canvas). Put `themeInitScript` in `<head>` to avoid a flash on load.

**CSS layers:** ayywi's CSS is in cascade layers, so your own CSS always wins. That includes global resets like `button { background: none }`, so either put your reset in a layer or use `ayywi/ayywi.unlayered.css`. Use the unlayered file with Tailwind v3 too.

**Fonts** are opt-in: `ayywi/fonts.css` serves them from the package, `ayywi/fonts-google.css` from Google Fonts. Without either you get system fonts.

## Icons

The icon library is [Hugeicons](https://hugeicons.com): 6,000+ free Stroke Rounded icons, MIT licensed. Install the icon data next to ayywi. ayywi only renders it, so it still has no runtime dependencies.

```sh
npm i @hugeicons/core-free-icons
```

```tsx
import { Search01Icon } from "@hugeicons/core-free-icons";
import { Icon } from "ayywi/react";

<Icon icon={Search01Icon} />                  // decorative, follows the text size
<Icon icon={Search01Icon} size="lg" label="Search" />
```

Outside React, `iconSvg(Search01Icon)` from `ayywi` returns the SVG markup for `innerHTML`, `v-html`, `{@html}` or a server template. In plain HTML, paste the SVG from hugeicons.com, add `class="ayy-icon"`, and remove any fixed colour (`color`, `fill` or `stroke` set to a hex value) on the `<svg>`: a black icon disappears in the dark theme. `ayywi lint` flags it.

Icons take the text colour and are 1.25em by default. `size` (or `ayy-icon--sm|md|lg|xl`) sets 16, 20, 24 or 32px. Inside buttons, menu items and alerts the component sizes them. Arrows and other icons that point along the reading direction take `directional` (`ayy-icon--directional`) and mirror in right-to-left text.

## Components

| Category | Components |
|---|---|
| Actions | Button, Dropdown menu, Theme toggle |
| Navigation | Navbar, Breadcrumb, Contents |
| Forms | Field, Input, Textarea, Select, Checkbox, Radio, Switch |
| Layout | Section, Card, Tabs, Carousel, Separator |
| Overlays | Dialog (centred or side modal), Popover, Tooltip |
| Feedback | Alert, Toast, Progress, Skeleton |
| Data display | Badge, Avatar, Icon, Icon tile, Stat, Data list, Frame, Chat, Table |

## Websites and portfolios

ayywi covers marketing sites as well as apps. A page is a skip link, a `Navbar`, then `<main>` built from `.ayy-section` blocks at `.ayy-container` width, with fading separators between them:

```html
<html data-theme="dark" data-density="comfortable">
<body>
  <a class="ayy-skip-link" href="#main">Skip to content</a>
  <div class="ayy-scroll-progress" aria-hidden="true"></div>
  <header class="ayy-navbar">…</header>
  <main id="main">
    <section class="ayy-bg-grid ayy-container" aria-labelledby="hero">
      <h1 class="ayy-display" id="hero">Product <span class="ayy-text-outline">designer</span></h1>
      <a class="ayy-button ayy-button--ring ayy-button--lg" href="/contact">Let's connect</a>
    </section>
    <hr class="ayy-separator ayy-separator--fade" />
    <section class="ayy-section ayy-section--center ayy-container" aria-labelledby="work">…</section>
  </main>
</body>
```

- **Colour comes from the content.** The frame stays monochrome. Set `--ayy-spot` to an accent token on a card, section or whole page, and the card spotlight, the contents bar, section numbers, icon tiles, the progress bar and `.ayy-accent-text` take it, darkened on light themes so text stays at 4.5:1.
- **Page utilities:** `.ayy-container`, `.ayy-grid`, `.ayy-display`, `.ayy-text-outline`, `.ayy-prose` (long-form reading), `.ayy-link`, `.ayy-skip-link`, `.ayy-bg-grid` (ambient grid), `.ayy-reveal` (fade in on scroll) and `.ayy-scroll-progress`. The last two use CSS scroll timelines: no JS, off under reduced motion.
- **Modes:** use the existing ones. Dark or light theme with a `Theme toggle`, and `comfortable` density for roomier controls on desktop; phones get `touch` on their own.

## AI setup

In the app that uses ayywi:

```sh
npx ayywi init        # installs the skill, AGENTS.md section, Cursor rule and MCP config
npx ayywi lint src    # checks classes, tokens, variants, raw colours, left/right, missing labels, image sizes, other icon sets
```

Then ask your agent to *"build the settings page with ayywi"*. Add `ayywi lint` to CI to catch mistakes whoever made them.

## Working on ayywi

```sh
pnpm build && pnpm typecheck && pnpm check && pnpm test   # before every commit
pnpm test:e2e                                             # Playwright + axe
```

Tokens live in `tokens/tokens.json`, and generated files say so at the top. To add a component, follow `.claude/skills/ayywi-add-component/SKILL.md`. Agents read `AGENTS.md`. `evals/` measures whether the AI kit improves agent output (see `evals/run.mjs`).

## Hosting and publishing

- **Preview site:** enable Settings → Pages → *GitHub Actions* and `.github/workflows/pages.yml` deploys on every push to `main`. Pages on a private repo needs a paid plan. Vercel, Netlify or Cloudflare Pages also work: build with `pnpm preview:build`, output `preview/dist`.
- **npm:** `npm publish`, or publish as `@danitesler/ayywi` to GitHub Packages if it should stay private.

Semver: renaming or removing a class, token or prop is breaking. See `CHANGELOG.md`.

## License

MIT
