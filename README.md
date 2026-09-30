# ayywi

A small design system that works in any stack and is built for AI agents to use.

Components are plain CSS classes (`ayy-button`, `ayy-card`…) driven by design tokens, so they work anywhere that outputs HTML. React gets typed components; other frameworks get a few custom elements for the interactive parts.

- **Small:** zero runtime dependencies, ~12 kB of CSS gzipped for all 34 components.
- **Themes and density:** four themes and three sizes, each one attribute.
- **Accessible:** keyboard support, focus rings, ARIA, RTL and Windows High Contrast built in.
- **AI-ready:** one command sets up your coding agent to use it correctly (see [AI setup](#ai-setup)).

## See it

```sh
pnpm install
pnpm preview    # http://localhost:5173
```

Every component with copy-ready HTML and React, plus search (<kbd>/</kbd> or <kbd>⌘</kbd><kbd>K</kbd>) and toolbar switches for theme, density and React vs. HTML.

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

**Plain HTML / server templates:** load the two files above, then write markup:

```html
<button class="ayy-button">Save</button>
<button class="ayy-button ayy-button--outline" onclick="ayywi.toast('Saved')">Toast</button>
```

**React:**

```tsx
import "ayywi/css";
import { Button, toast } from "ayywi/react";

<Button variant="outline" onClick={() => toast("Saved")}>Save</Button>
```

**Vue, Svelte, Angular, Solid…:** import `ayywi/css` and `ayywi/elements` once, then use the same markup as plain HTML. Vue needs `isCustomElement: (tag) => tag.startsWith("ayy-")`; Angular needs `CUSTOM_ELEMENTS_SCHEMA`.

**Tailwind:** alongside `ayywi/css`, v4 `@import "ayywi/tailwind.css"`; v3 `presets: [require("ayywi/tailwind-preset")]`.

**Other platforms:** `pnpm build` writes SCSS, SwiftUI, Compose and JSON tokens to `dist/tokens/`.

### Good to know

- **Your CSS wins.** ayywi's CSS sits in cascade layers, so a global reset like `button { background: none }` overrides it too. Put your reset in a layer, or use `ayywi/ayywi.unlayered.css` (also the one to use with Tailwind v3).
- **Fonts are opt-in:** `ayywi/fonts.css` (self-hosted) or `ayywi/fonts-google.css`. Without either you get system fonts.
- **Icons** are [Hugeicons](https://hugeicons.com). Install `@hugeicons/core-free-icons` next to ayywi, then `<Icon icon={Search01Icon} />` in React or `iconSvg(Search01Icon)` elsewhere.

## Theme and density

```html
<html data-theme="dark-soft" data-density="comfortable">
```

| Theme | Looks like |
|---|---|
| *(none)* | follows the OS, dark or light |
| `dark` / `light` | the defaults |
| `dark-soft` | charcoal and off-white, easier for long reading |
| `light-gray` | white cards on a grey page |

Density is `compact` by default; phones and tablets get `touch` automatically. Both attributes work on any element, not just `<html>`. From JS, use `setTheme()` and `setDensity()`, and put `themeInitScript` in `<head>` to avoid a flash on load.

## Components

| Category | Components |
|---|---|
| Actions | Button, Dropdown menu, Theme toggle |
| Navigation | Navbar, App shell, Breadcrumb, Contents |
| Forms | Field, Input, Textarea, Select, Checkbox, Radio, Switch |
| Layout | Section, Card, Tabs, Carousel, Separator |
| Overlays | Dialog (centred or side modal), Popover, Tooltip |
| Feedback | Alert, Toast, Progress, Skeleton |
| Data display | Badge, Avatar, Icon, Icon tile, Stat, Data list, Frame, Chat, Table |

There's also a site kit (containers, hero type, scroll reveal, reading progress) for marketing pages and portfolios. See it in the preview.

## AI setup

In the app that uses ayywi:

```sh
npx ayywi init        # sets up your agent: skill, AGENTS.md section, Cursor rule, MCP server
npx ayywi lint src    # checks the code for misuse
```

After that the agent picks ayywi up on its own. Add `ayywi lint` to CI to catch mistakes whoever made them.

## Working on ayywi

```sh
pnpm build && pnpm typecheck && pnpm check && pnpm test   # before every commit
pnpm test:e2e                                             # for visual or interactive changes
```

Conventions and repo layout are in [AGENTS.md](AGENTS.md). Changes go in [CHANGELOG.md](CHANGELOG.md); renaming or removing a class, token or prop is a breaking change.

**Publishing:** the preview deploys to GitHub Pages from `main` (enable Settings → Pages → *GitHub Actions*; private repos need a paid plan), or build it with `pnpm preview:build` and host `preview/dist` anywhere. Publish the package with `npm publish`, or to GitHub Packages as `@danitesler/ayywi` to keep it private.

## License

MIT
