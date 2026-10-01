# ayywi

A small design system that works in any stack and is built for AI agents to use.

Components are plain CSS classes (`ayy-button`, `ayy-card`…) driven by design tokens, so they work anywhere that outputs HTML. React gets typed components; other frameworks get a few custom elements for the interactive parts.

- **Small:** zero runtime dependencies, ~16 kB of CSS gzipped for all 47 components.
- **Themes and density:** four themes and three sizes, each one attribute.
- **Accessible:** keyboard support, focus rings, ARIA, RTL and Windows High Contrast built in.
- **AI-ready:** paste one prompt, or run one command, and your coding agent uses it correctly (see [AI setup](#ai-setup)).
- **One frame per kind of product:** apps get a sidebar on wide screens and a bottom nav on phones; websites get a navbar that folds into a menu. Neither needs a media query of yours.

## See it

```sh
pnpm install
pnpm preview    # http://localhost:5173
```

Every component with copy-ready HTML and React (under each example's Code), a Copy for AI button per component, five full example apps at desktop, tablet and phone sizes, search (<kbd>/</kbd> or <kbd>⌘</kbd><kbd>K</kbd>), and a menu for theme and density. The built site (`pnpm preview:build`) also hosts `dist/ayywi.min.css`, `dist/elements.global.js` and `llms-full.txt`, so agents can use ayywi from it without installing anything.

## Install

```sh
npm i github:danitesler/ayywi    # private repo: needs GitHub access (SSH key, or a token in CI)
```

No install at all: link the two files the preview site hosts (or copy them into your project):

```html
<link rel="stylesheet" href="https://<your-preview-site>/dist/ayywi.min.css">
<script src="https://<your-preview-site>/dist/elements.global.js" defer></script>
```

Once it's on npm: `npm i ayywi`, and the same two files from a CDN (pin the version you use): `https://cdn.jsdelivr.net/npm/ayywi@0.5/dist/ayywi.min.css`.

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
| Navigation | Navbar, App shell, Bottom nav, Footer, Breadcrumb, Pagination, Steps, Contents |
| Forms | Field, Input, Input group, Textarea, Select, Checkbox, Radio, Segmented control, Switch |
| Layout | Page header, Section, Card, Tabs, Accordion, Carousel, Separator |
| Overlays | Dialog (centred, side modal or bottom sheet), Popover, Tooltip |
| Feedback | Alert, Toast, Progress, Spinner, Skeleton, Empty state |
| Data display | Badge, Kbd, Avatar, Icon, Icon tile, Stat, List, Data list, Frame, Chat, Table |

Layout utilities (`.ayy-stack`, `.ayy-cluster`, `.ayy-spread`, `.ayy-grid`, `.ayy-split`) cover the glue between them, and a site kit (containers, hero type, scroll reveal, reading progress) covers marketing pages and portfolios.

## AI setup

The quickest way is the preview's Get started page. Builders pick what they're making, fill in one sentence, pick their tool (Lovable, Bolt, v0, Replit, Cursor, Claude Code, or a chat) and copy one prompt: it links the CSS and the elements script the site hosts, so nothing gets installed, and carries the rules and every class name. Fix-it prompts follow for when something looks off. Developers get the same three routes (link the files, install the package, a chat with no project) under "I'm a developer".

With the package installed, in the app that uses ayywi:

```sh
npx ayywi init          # sets up your agent: skill, AGENTS.md section, Cursor rule, MCP server
npx ayywi init --force  # later: refresh them after upgrading ayywi
npx ayywi lint src      # checks the code for misuse
```

After that the agent picks ayywi up on its own. Add `ayywi lint --max-warnings 0` to CI to catch mistakes whoever made them.

## Working on ayywi

```sh
pnpm build && pnpm typecheck && pnpm check && pnpm test   # before every commit
pnpm test:e2e                                             # for visual or interactive changes
```

Conventions and repo layout are in [AGENTS.md](AGENTS.md). Changes go in [CHANGELOG.md](CHANGELOG.md); renaming or removing a class, token or prop is a breaking change.

**Publishing:** the preview deploys to GitHub Pages from `main` (enable Settings → Pages → *GitHub Actions*; private repos need a paid plan), or build it with `pnpm preview:build` and host `preview/dist` anywhere. Publish the package with `npm publish`, or to GitHub Packages as `@danitesler/ayywi` to keep it private.

## License

MIT
