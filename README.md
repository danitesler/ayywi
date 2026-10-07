# ayywi

A small design system that works in any stack and is built for AI agents to use.

Components are plain CSS classes (`ayy-button`, `ayy-card`…) driven by design tokens, so they work anywhere that outputs HTML. React gets typed components; other frameworks get a few custom elements for the interactive parts.

- **Small:** zero runtime dependencies, ~24 kB of CSS gzipped for all 66 components.
- **Themes and density:** four themes and three sizes, each one attribute.
- **Accessible:** keyboard support, focus rings, ARIA, RTL and Windows High Contrast built in.
- **AI-ready:** paste one prompt, or run one command, and your coding agent uses it correctly (see [AI setup](#ai-setup)).
- **One frame per kind of product:** apps get a sidebar on wide screens and a bottom nav on phones; websites get a navbar that folds into a menu. Neither needs a media query of yours.

## See it

```sh
pnpm install
pnpm preview    # http://localhost:5173
```

Every component with copy-ready HTML and React (under each example's Code), a Copy for AI button per component, seven full example apps (dashboard, marketing site, inbox, settings, tracker, store, booking) at desktop, tablet and phone sizes, search (<kbd>/</kbd> or <kbd>⌘</kbd><kbd>K</kbd>), and a menu for theme and density. The built site (`pnpm preview:build`) also hosts `dist/ayywi.min.css`, `dist/elements.global.js`, the fonts, `llms-full.txt` and a page per component (`llms/<slug>.md`), so agents can use ayywi from it without installing anything; each build publishes its runtime files under `v/<release>/` too, and the prompts link those, so a later release can't restyle an app.

## Install

```sh
npm i @danitesler/ayywi        # or: pnpm add @danitesler/ayywi / yarn add @danitesler/ayywi
```

Published on npm as [`@danitesler/ayywi`](https://www.npmjs.com/package/@danitesler/ayywi). The `ayywi` command (`init`, `lint`, `mcp`) comes with it, so `npx ayywi …` works inside a project that has it installed. To run it once without installing: `npx @danitesler/ayywi init`.

Then load the CSS once at the root of your app (and `@danitesler/ayywi/elements` if you use the custom elements outside React; see [Use it](#use-it) for each framework):

```ts
import "@danitesler/ayywi/css";
```

Icons are optional: add `@hugeicons/core-free-icons` if you use the `Icon` component. React 18.2+ is an optional peer, needed only for `@danitesler/ayywi/react`.

No install at all: link the files the preview site hosts (or copy them into your project, with the `fonts/` folder next to `fonts.css`). Use a release's `v/<release>/dist/` path (Get started's prompts do, and `versions.json` lists them): those files never change, so a later release can't restyle your app. `dist/` without a release is always the latest.

```html
<script src="https://<your-preview-site>/v/<release>/dist/theme-init.js"></script>
<link rel="stylesheet" href="https://<your-preview-site>/v/<release>/dist/fonts.css">
<link rel="stylesheet" href="https://<your-preview-site>/v/<release>/dist/ayywi.min.css">
<script src="https://<your-preview-site>/v/<release>/dist/elements.global.js" defer></script>
```

`theme-init.js` applies a theme saved by the Theme toggle before the first paint, `fonts.css` loads Sora and Unbounded; both are optional.

The same two files from a CDN (pin the version you use): `https://cdn.jsdelivr.net/npm/@danitesler/ayywi@0.0.1/dist/ayywi.min.css`.

## Use it

**Plain HTML / server templates:** load the files above, then write markup:

```html
<button class="ayy-button">Save</button>
<button class="ayy-button ayy-button--outline" onclick="ayywi.toast('Saved')">Toast</button>
```

**React:**

```tsx
import "@danitesler/ayywi/css";
import { Button, toast } from "@danitesler/ayywi/react";

<Button variant="outline" onClick={() => toast("Saved")}>Save</Button>
```

**Vue, Svelte, Angular, Solid…:** import `@danitesler/ayywi/css` and `@danitesler/ayywi/elements` once, then use the same markup as plain HTML. Vue needs `isCustomElement: (tag) => tag.startsWith("ayy-")`; Angular needs `CUSTOM_ELEMENTS_SCHEMA`.

**Tailwind:** alongside `@danitesler/ayywi/css`, v4 `@import "@danitesler/ayywi/tailwind.css"`; v3 `presets: [require("@danitesler/ayywi/tailwind-preset")]`. Utilities then use ayywi's colours (`bg-surface`, `text-muted`, `bg-chart-1`).

**A project already on shadcn/ui** (Lovable, v0 and Bolt templates): load `@danitesler/ayywi/shadcn.css` after ayywi and the shadcn components still there take ayywi's colours, radius and font while you replace them.

**Other platforms:** `pnpm build` writes SCSS, SwiftUI, Compose and JSON tokens to `dist/tokens/`.

### Good to know

- **Your CSS wins.** ayywi's CSS sits in cascade layers, so a global reset like `button { background: none }` overrides it too. Put your reset in a layer, or use `@danitesler/ayywi/ayywi.unlayered.css` (also the one to use with Tailwind v3).
- **Fonts are opt-in:** `@danitesler/ayywi/fonts.css` (self-hosted) or `@danitesler/ayywi/fonts-google.css`. Without either you get system fonts.
- **Icons** are [Hugeicons](https://hugeicons.com). Install `@hugeicons/core-free-icons` next to ayywi, then `<Icon icon={Search01Icon} />` in React or `iconSvg(Search01Icon)` elsewhere.

## Theme and density

```html
<html data-theme="dark-soft" data-density="comfortable">
```

| Theme | Looks like |
|---|---|
| *(none)* | follows the OS, dark or light |
| `dark` / `light` | the defaults |
| `dark-soft` | near-black page, cards a step up, white text |
| `light-gray` | white cards on a grey page |

Density is `compact` by default; phones and tablets get `touch` automatically. Both attributes work on any element, not just `<html>`. From JS, use `setTheme()` and `setDensity()`, and put `themeInitScript` (or `dist/theme-init.js`) in `<head>` to avoid a flash on load; the Theme toggle restores a saved choice by itself too.

## Brands

ayywi is monochrome until you give it a brand: one colour, and optionally fonts and a corner shape.

```sh
npx ayywi brand "#0ea5e9" --name acme --shape soft --body "Inter" --out acme.css
```

That writes `acme.css` and prints a report. From the seed it makes an 11-step scale (`--ayy-brand-50` … `--ayy-brand-950`, with your exact colour at its nearest step), then picks `primary`, `primary-fg` and `ring` for dark and for light themes: the step nearest your colour that keeps text on the button at 4.5:1 and the fill and focus ring at 3:1 against every surface, in every theme. If your colour can't do that on light backgrounds (a yellow, say), the report says which darker step it used instead. Fonts get ayywi's fallbacks, system fonts included. `--shape` is `pill` (ayywi's own), `round`, `soft` or `sharp`; `--radius-button`, `--radius-card` and `--radius-control` set exact values.

Load the file after ayywi's CSS and name the brand where it applies:

```html
<html data-brand="acme">
```

From JS, `createBrand()` returns the same thing as data, `brandCss()` the stylesheet, and `setBrand({ name, color })` generates and applies one at runtime (a user-picked accent, say). `setBrand("violet")` with `@danitesler/ayywi/brands/violet.css` loaded applies a ready-made one. Agents get the same generator as the MCP tool `create_brand`. For native apps and Figma, `--tokens <dir>` writes the brand as DTCG JSON per theme, to layer over `@danitesler/ayywi/tokens/<theme>.json`.

## Components

| Category | Components |
|---|---|
| Actions | Button, Toolbar, Dropdown menu, Command palette, Floating action button, Theme toggle |
| Navigation | Navbar, App shell, Bottom nav, Top bar, Footer, Breadcrumb, Pagination, Steps, Contents |
| Forms | Field, Input, Input group, Search bar, Textarea, Select, Combobox, Tag input, Calendar (and date picker), Checkbox, Radio, Segmented control, Chip, Swatch, Choice card, Slider, Number field, File upload, Switch, Shortcut (keys and recorder), Settings |
| Layout | Page header, Section, Card, Tabs, Accordion, Carousel, Separator |
| Overlays | Dialog (centred, side modal or bottom sheet), Popover, Tooltip |
| Feedback | Alert, Toast, Progress, Progress ring, Spinner, Skeleton, Empty state |
| Data display | Badge, Kbd, Avatar, Icon, Icon tile, Stat, List, Data list, Swipe actions, Frame, Chat, Table, Chart |

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

**Publishing:** the preview deploys to GitHub Pages from `main` (enable Settings → Pages → *GitHub Actions*; private repos need a paid plan), or build it with `pnpm preview:build` and host `preview/dist` anywhere. Publish the package with `npm publish` (it is scoped, `publishConfig.access` is `public`; `prepublishOnly` runs `pnpm check`). Bump `version` in package.json and add the release to CHANGELOG.md first.

## License

MIT
