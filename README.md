# ayywi

A lightweight design system that works in any stack and is built to be used by AI agents.

- **One contract, every framework.** Components are plain CSS classes (`ayy-button`, `ayy-card`…) driven by tokens (`--ayy-color-bg`…). Use them from HTML, Vue, Svelte, Angular, Solid, Astro, Rails/Django/Laravel/Go templates, Blazor — anything that outputs HTML. React gets typed components that render the same markup.
- **Small.** Zero runtime dependencies. The whole stylesheet (21 components) is ~8 kB gzipped, the React layer ~6 kB, the custom elements ~6 kB. Ship per-component CSS if you want less.
- **Dark-first, both themes always.** No attribute = follow the OS. `data-theme="light|dark"` forces a theme on the page or any section.
- **RTL-safe.** Logical CSS properties everywhere. Put `dir="rtl"` on any ancestor and everything mirrors.
- **Accessible by default.** Keyboard models, focus rings, ARIA wiring, and Windows High Contrast (forced colors) support in every stateful component. axe runs on every component page in CI.
- **Density and brands.** Compact, comfortable and touch sizing (touch is automatic on coarse pointers). Swap the brand with one attribute.
- **AI-first.** A machine-readable manifest, `llms.txt`, a Claude skill, a Cursor rule, an AGENTS.md snippet and an **MCP server** — plus `ayywi lint`, which checks the code agents write against the contract instead of hoping they read the rules.
- **Native first.** `<dialog>` for modals, the Popover API for menus, popovers, tooltips and toasts, `role="switch"` checkboxes. Interactive parts are tiny light-DOM custom elements (`<ayy-tabs>`, `<ayy-dialog>`…) that work in every framework and in server-rendered HTML.

---

## See it

```sh
pnpm install
pnpm preview          # → http://localhost:5173
```

Every component with live examples, a Tokens page, and toolbar toggles for **theme** (system/dark/light), **density** (auto/compact/comfortable/touch), **brand**, **direction** (LTR/RTL) and **renderer** (React vs. plain HTML — the same examples rendered with no framework at all). Each component page has a **Copy context for AI** button that copies its full spec as markdown.

---

## Install

**Before it's published** (straight from git — `prepare` builds `dist/` on install):

```sh
npm i github:danitesler/ayywi           # pin a commit or tag with #<ref>
```

The repo is private, so this needs GitHub access on the installing machine (SSH key or a token in CI).

**After publishing to npm:**

```sh
npm i ayywi          # or pnpm add / yarn add / bun add
```

**No build step at all** (after publishing — jsDelivr mirrors npm automatically):

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/ayywi@0.2/dist/ayywi.min.css">
<script src="https://cdn.jsdelivr.net/npm/ayywi@0.2/dist/elements.global.js" defer></script>
```

---

## Use it

| Stack | Import | Write |
|---|---|---|
| Plain HTML / server templates | `dist/ayywi.min.css` + `dist/elements.global.js` | `<button class="ayy-button ayy-button--outline">` |
| React, Next, Remix | `import "ayywi/css"` · `import { Button } from "ayywi/react"` | `<Button variant="outline">` |
| Vue, Svelte, Solid, Angular, Lit | `import "ayywi/css"` · `import "ayywi/elements"` · `import { buttonClass } from "ayywi"` | raw classes, `class={buttonClass(…)}`, `<ayy-tabs>`… |
| Tailwind v4 | `@import "ayywi/css"; @import "ayywi/tailwind.css";` | components as above + `bg-surface border-line rounded-card` for glue |
| Tailwind v3 | `presets: [require("ayywi/tailwind-preset")]` + the CSS | same |
| SCSS | `@use "ayywi/tokens/ayywi.scss" as ayy;` | `ayy.$ayy-color-text`, `map.get(ayy.$ayy-dark, "color-bg")` |
| iOS (SwiftUI) / Android (Compose) | `dist/tokens/Ayywi.swift` · `dist/tokens/Ayywi.kt` | `AyywiColors.dark.bg`, `AyywiSpace`, `AyywiRadius` … |
| Anything else | `ayywi/tokens/dark.json`, `light.json`, `density/*.json` (flat, resolved) | native tokens |

### Plain HTML

```html
<button type="button" class="ayy-button">Save</button>
<button type="button" class="ayy-button ayy-button--ghost ayy-button--sm">Cancel</button>

<span class="ayy-badge ayy-badge--success"><span class="ayy-badge__dot"></span>Synced</span>

<div class="ayy-field">
  <label class="ayy-label" for="name">Name</label>
  <input class="ayy-input" id="name">
</div>

<ayy-dialog>
  <button class="ayy-button" data-ayy-open>Delete</button>
  <dialog class="ayy-dialog" aria-labelledby="confirm-title">
    <h2 class="ayy-dialog__title" id="confirm-title">Delete this?</h2>
    <div class="ayy-dialog__footer">
      <button class="ayy-button ayy-button--secondary" data-ayy-close>Cancel</button>
      <button class="ayy-button ayy-button--destructive" data-ayy-close="delete">Delete</button>
    </div>
  </dialog>
</ayy-dialog>

<button class="ayy-button" onclick="ayywi.toast.success('Saved')">Save</button>
```

`elements.global.js` (~6 kB gzipped) registers the custom elements — `<ayy-tabs>`, `<ayy-dialog>`, `<ayy-popover>`, `<ayy-menu>`, `<ayy-tooltip>` — and puts `toast`, `setTheme`, `setDensity` and `setBrand` on `window.ayywi`. The elements render no shadow DOM and no markup of their own: they wire ids, ARIA, keyboard and placement onto the HTML you wrote, so it stays styleable and server-renderable, and HTML added later (HTMX, Turbo, Alpine) upgrades itself. Don't want JS? Everything still renders: call `dialog.showModal()` yourself, set `aria-selected` / `hidden` on tabs from your own state. Popovers and menus open natively via `popovertarget`, just centred instead of anchored.

### React

```tsx
import "ayywi/css";
import { Button, Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "ayywi/react";

export function DeleteProject() {
  return (
    <Dialog>
      <DialogTrigger variant="destructive">Delete project</DialogTrigger>
      <DialogContent size="sm">
        <DialogHeader>
          <DialogTitle>Delete Marketing site?</DialogTitle>
        </DialogHeader>
        <DialogFooter>
          <DialogClose>Cancel</DialogClose>
          <DialogClose variant="destructive">Delete</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

Components forward refs and pass through native attributes. `Button` defaults to `type="button"`. The React build starts with `"use client"`, so it drops straight into Next.js App Router server components. `toast()` is exported from both `ayywi` and `ayywi/react` and needs no provider.

### Vue / Svelte / anything with JS

```vue
<script setup lang="ts">
import "ayywi/css";
import { buttonClass, badgeClass } from "ayywi";
</script>

<template>
  <button :class="buttonClass({ variant: 'outline', size: 'sm' })">Sync</button>
  <span :class="badgeClass({ variant: 'warning' })">Pending</span>
  <ayy-tabs class="ayy-tabs" :value="tab" @ayy-value-change="tab = $event.detail.value">…</ayy-tabs>
</template>
```

Import `ayywi/elements` once (e.g. in `main.ts`) for the interactive parts. It's SSR-safe: importing it on the server does nothing. Tell your framework the `ayy-` tags are custom elements:

- **Vue**: `vue({ template: { compilerOptions: { isCustomElement: (tag) => tag.startsWith("ayy-") } } })`
- **Angular**: `schemas: [CUSTOM_ELEMENTS_SCHEMA]` on the component or module
- **Svelte, Solid, Lit, Astro, plain HTML**: nothing to do

Events: `ayy-value-change` (tabs), `ayy-open-change` (dialog, popover, menu), `ayy-select` (menu, with the item's `data-value`). Every component page in the preview shows the HTML for its examples — that markup is the contract for every non-React framework.

### Only ship what you use

```js
import "ayywi/tokens.css";
import "ayywi/css/base.css";
import "ayywi/css/button.css";
import "ayywi/css/dialog.css";
```

Per-component files are already wrapped in their cascade layer, so order doesn't matter.

### Cascade layers (and the escape hatch)

`ayywi.css` puts everything in layers — `@layer ayywi.tokens, ayywi.base, ayywi.components, ayywi.brand` — so **any unlayered CSS in your app wins** without `!important` or specificity fights. One catch: that includes global resets. An unlayered `button { background: none }` also beats `.ayy-button`. Either put your reset in a layer declared before ayywi, or use the unlayered build:

```css
@layer reset, ayywi;                 /* your reset loses to ayywi, your other CSS still wins */
@import "ayywi/ayywi.unlayered.css"; /* or: plain specificity, like 0.1 */
```

Tailwind v4 uses native layers — declare the order once: `@layer theme, base, ayywi, components, utilities;` so utilities override ayywi. Tailwind v3's preflight is unlayered, so with v3 use `ayywi.unlayered.css`, imported after `@tailwind base`.

### Fonts

The brand fonts (Unbounded, Sora, Caveat) are opt-in. `import "ayywi/fonts.css"` before the stylesheet serves them from the package itself (~480 kB of woff2 split by script, loaded per `unicode-range`, so a Latin-only page fetches at most ~155 kB) — works offline, in Electron and behind strict CSPs. `ayywi/fonts-google.css` loads them from Google Fonts instead. Without either, everything falls back to system fonts.

---

## Theming

```html
<html>                          <!-- follows the OS -->
<html data-theme="dark">        <!-- forced -->
<section data-theme="light">    <!-- a light island inside a dark page -->
```

```ts
import { setTheme, getTheme, themeInitScript } from "ayywi";
setTheme("light");      // "dark" | "light" | "system"; persisted to localStorage
```

Put `themeInitScript` in an inline `<script>` in `<head>` to apply stored theme and density before first paint (no flash).

### Density

```html
<html data-density="compact">       <!-- default: dense desktop UI -->
<section data-density="comfortable"> <!-- roomier forms -->
<div data-density="touch">           <!-- 40px+ targets -->
```

Without the attribute, coarse pointers (phones, tablets) get touch sizes automatically. `setDensity("touch" | "comfortable" | "compact" | "auto")` sets and persists it. Density changes control heights, paddings and font sizes; layout spacing stays yours.

### Brands

Tokens come in two tiers: a **palette** of raw colours (`--ayy-palette-violet-58`…) and **semantic** tokens (`--ayy-color-primary`…) that point at it. Components only use semantic tokens, so a brand is a small file that re-points a few of them:

```html
<link rel="stylesheet" href="…/dist/brands/violet.css">
<html data-brand="violet">   <!-- or on any section -->
```

Add your own: copy `tokens/brands/violet.json`, change the values (each colour has a dark `$value` and a `light`), run `pnpm build`. Brands follow the theme on their own via `light-dark()`. Quick one-off overrides still work — any unlayered CSS beats the layered tokens:

```css
:root { --ayy-radius-button: 8px; --ayy-font-body: "Inter", system-ui, sans-serif; }
```

### High contrast

Under Windows High Contrast / `forced-colors: active`, the browser replaces colours with the user's system palette. Every component that shows state through colour alone (checked switches and checkboxes, selected tabs and rows, progress fill, focus) has a `@media (forced-colors: active)` block that maps it to system colours (`Highlight`, `CanvasText`…) so the state stays visible. `pnpm check` fails if a stateful component lacks one.

---

## Languages & RTL

- Layout uses logical properties only, so `dir="rtl"` mirrors everything, including switch thumbs, tooltip `start`/`end` sides and progress fill. `pnpm check` rejects physical `left/right` rules.
- Brand fonts are Latin; every font stack ends in system fonts (`system-ui`, `Segoe UI`, `Roboto`, `Noto Sans`), so Arabic, Hebrew, CJK, Cyrillic, Devanagari render in the OS font instead of tofu.
- Sizes are in `rem`, so the user's browser font size is respected.
- Components contain no hard-coded strings except a few accessible labels, all overridable: React Dialog's `closeLabel`, the toaster's `label` and `closeLabel` (`configureToaster()` or `<Toaster>`).

---

## Components

| Component | Classes | React |
|---|---|---|
| Component | Classes | React | Element |
|---|---|---|---|
| Button | `ayy-button` `--secondary` `--outline` `--ghost` `--destructive` `--link` `--sm` `--lg` `--icon` `--icon-sm` | `Button` |  |
| Card | `ayy-card` `--interactive` `--spotlight` `__header` `__title` `__description` `__content` `__footer` | `Card` + parts |  |
| Badge | `ayy-badge` `--muted` `--outline` `--success` `--warning` `--destructive` `--info` `--ai` `__dot` `__dot--static` | `Badge` |  |
| Avatar | `ayy-avatar` `--sm` `--lg` `--xl` `--square` `__fallback` `__image` `-group` | `Avatar` `AvatarGroup` |  |
| Input | `ayy-input` `--sm` `--lg` | `Input` |  |
| Textarea | `ayy-textarea` `--autosize` `--mono` | `Textarea` |  |
| Select | `ayy-select` `__control` `--sm` `--lg` | `Select` |  |
| Checkbox | `ayy-checkbox` | `Checkbox` |  |
| Radio | `ayy-radio` `-group` `-group--horizontal` `-group__legend` | `RadioGroup` `Radio` |  |
| Field | `ayy-field` `--inline` `ayy-label` `__hint` `__error` | `Field` `Label` `FieldHint` `FieldError` |  |
| Switch | `ayy-switch` | `Switch` |  |
| Tabs | `ayy-tabs` `__list` `__tab` `__panel` | `Tabs` `TabsList` `TabsTrigger` `TabsContent` | `<ayy-tabs>` |
| Dialog | `ayy-dialog` `--sm` `--lg` `--xl` `__header` `__title` `__description` `__footer` `__close` | `Dialog` + parts | `<ayy-dialog>` |
| Popover | `ayy-popover` | `Popover` `PopoverTrigger` `PopoverContent` | `<ayy-popover>` |
| Dropdown menu | `ayy-menu` `__item` `__item--destructive` `__shortcut` `__label` `__separator` | `DropdownMenu` + parts | `<ayy-menu>` |
| Tooltip | `ayy-tooltip` `__content` | `Tooltip` | `<ayy-tooltip>` |
| Toast | `ayy-toaster` `ayy-toast` `ayy-toast--success` `ayy-toast--warning` `ayy-toast--destructive` `ayy-toast--info` `ayy-toast__title` `ayy-toast__description` `ayy-toast__actions` `ayy-toast__close` | `Toaster` |  |
| Alert | `ayy-alert` `--info` `--success` `--warning` `--destructive` `__title` `__description` `__actions` | `Alert` `AlertTitle` `AlertDescription` `AlertActions` |  |
| Progress | `ayy-progress` `__bar` `--sm` `--lg` `--success` `--warning` `--destructive` `--ai` `--indeterminate` | `Progress` |  |
| Skeleton | `ayy-skeleton` `--text` `--circle` | `Skeleton` |  |
| Table | `ayy-table-wrap` `ayy-table` `ayy-table--compact` `ayy-table__num` | `Table` + parts |  |

Utilities: `ayy-h1…h4`, `ayy-lede`, `ayy-eyebrow`, `ayy-muted`, `ayy-signature`, `ayy-mono`, `ayy-stack`, `ayy-cluster`, `ayy-sr-only`, `ayy-scroll`. Plain-JS helpers from `"ayywi"`: `toast()`, `connectPopover()`, `connectMenu()`, `enhanceTooltip()`, `avatarInitials()` and a `…Class()` builder per component.

Full API per component: the preview, `manifest/components.json`, or `llms-full.txt`.

---

## AI setup (in projects that use ayywi)

One command in the app repo:

```sh
npx ayywi init
```

It writes the Claude Code skill (`.claude/skills/ayywi`), a Cursor rule (`.cursor/rules/ayywi.mdc`), an ayywi section in `AGENTS.md` (read by Codex, Copilot, Gemini, Cursor, and Claude via CLAUDE.md), and registers the MCP server in `.mcp.json` and `.cursor/mcp.json`. It's idempotent and keeps what's already there; `--dry-run` shows what it would do, `--no-mcp` skips the server.

Then just ask: *"build the settings page with ayywi"*.

| Piece | What it does |
|---|---|
| **Skill / rule / AGENTS snippet** | Tells the agent to look up each component's spec before writing markup, and lists the rules |
| **MCP server** (`npx ayywi mcp`) | Tools the agent calls: `list_components`, `get_component`, `search`, `get_tokens`, `get_rules`, and `lint` — so it checks its own output before showing you |
| **`npx ayywi lint [paths]`** | Checks app code in any template language: unknown `ayy-` classes (with "did you mean"), unknown tokens, invalid React/helper variants and element attributes, raw colours and `left/right` in CSS, unlabeled icon buttons. `--json` for tools, `--max-warnings=0` for CI. Rules and ignores in `ayywi.config.json`; silence one line with `ayywi-lint-disable-line` |
| `llms-full.txt` | Rules, tokens, every component with examples in one file — paste it into any chat |
| `manifest/components.json` | The same as JSON |

Put `npx ayywi lint src` in the app's CI and the contract holds no matter who — or what — wrote the code.

---

## Working on ayywi

```sh
pnpm build          # tokens + manifest + dist/ (prints gzip sizes)
pnpm typecheck      # library, preview, every example file, the tests
pnpm check          # design rules, docs ↔ CSS ↔ React props ↔ elements, generated files current, lints examples
pnpm test           # node: linter, MCP server, init, token exports, eval scorer
pnpm test:e2e       # Playwright: every page in both renderers, interactions, density, brands, RTL,
                    # forced colors, axe in both themes, the plain-HTML dist bundle
pnpm preview        # dev server for the component browser
```

CI (`.github/workflows/ci.yml`) runs all of it on every PR. `tokens/tokens.json` (+ `tokens/brands/`) is the source of truth for tokens; generated files say so at the top. Adding a component is a checklist — see `.claude/skills/ayywi-add-component/SKILL.md`. Agents working on this repo read `AGENTS.md` (and `CLAUDE.md`).

### Does the AI kit actually help? Measure it

`evals/` runs any coding agent on five realistic tasks twice — with the kit installed and without — and scores the output (file written, `ayywi lint` clean, required patterns present, anti-patterns absent):

```sh
pnpm build
AYYWI_EVAL_AGENT='claude -p --permission-mode acceptEdits' node evals/run.mjs --runs=3
```

The agent gets the task prompt on stdin inside a fresh workspace with ayywi installed, so Codex, Cursor's CLI or your own API script work too. It uses your agent quota, so it isn't part of CI. Add a task by dropping a markdown file in `evals/tasks/`.

### Design decisions worth knowing

- **Floating parts are positioned with ~90 lines of JS, not CSS anchor positioning.** Anchor positioning would be zero-JS, but it isn't in every evergreen browser yet. `src/lib/position.ts` does flip + clamp and follows `dir`. When anchor positioning is Baseline, swap it in behind the same elements; the markup won't change.
- **Two token tiers, not three.** There is no per-component token tier (`--ayy-button-bg`…): with 21 components it would triple the token count for flexibility nobody has asked for. Components read semantic tokens; brands re-point those.
- **One package, not many.** CSS per component, JS tree-shakes, and React/elements are separate entry points, so splitting into `@ayywi/*` packages would add release overhead without making anything smaller. Revisit if a framework-specific layer (Vue components, say) grows big.

---

## Next steps: host it, share it, use it

**1. Host the preview** so you (and anyone you share it with) can browse it.
- GitHub Pages: `.github/workflows/pages.yml` runs on every push to `main`. Turn it on once: Settings → Pages → Source: *GitHub Actions*. You get `https://danitesler.github.io/ayywi/`. Pages on a private repo needs a paid GitHub plan — otherwise make the repo public or use one of the hosts below.
- Vercel / Netlify / Cloudflare Pages work too: build command `pnpm preview:build`, output directory `preview/dist`. It's a static site with relative paths, so any host or subpath works.
- Private? Cloudflare Pages + Cloudflare Access, or Vercel password protection.

**2. Publish the package.**
- Public: `npm login && npm publish`. The name `ayywi` was unclaimed on npm on 2026-09-28 — publish soon or re-check with `npm view ayywi`. Taken? Use a scope (`@danitesler/ayywi`) and `npm publish --access public`.
- Private: GitHub Packages (storage included in GitHub plans): scope the name `@danitesler/ayywi`, add `"publishConfig": { "registry": "https://npm.pkg.github.com" }`, and consumers add an `.npmrc` with `@danitesler:registry=https://npm.pkg.github.com`.
- Until then, the git install above works everywhere.

**3. Version it.** Add [Changesets](https://github.com/changesets/changesets) (`pnpm add -D @changesets/cli && pnpm changeset init`) so every PR records a semver bump and the changelog writes itself. Treat renamed/removed classes, tokens or props as breaking.

**4. CDN.** Once on npm, jsDelivr and unpkg serve it automatically: `https://cdn.jsdelivr.net/npm/ayywi@0.2/dist/ayywi.min.css`. Pin a version in production.

**5. Other platforms.** `pnpm build` already writes SCSS, SwiftUI, Compose and flat JSON tokens to `dist/tokens/` (the Swift and Kotlin files are generated but not yet compiled in CI — add a macOS/Android job before relying on them). For Flutter or anything else, point [Style Dictionary](https://styledictionary.com) at `tokens/tokens.json`: `$value` is the dark theme, `$extensions.ayywi.light` the light one. Figma: import the same file with Tokens Studio or a Variables import plugin.

**6. Use it in your apps.** `npm i ayywi`, import `ayywi/css` (+ `ayywi/elements` outside React), run `npx ayywi init`, add `npx ayywi lint src` to CI, and let your agent build screens.

---

## License

MIT
