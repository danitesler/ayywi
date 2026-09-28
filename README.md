# ayywi

A small design system that works in any stack and is built for AI agents to use.

Components are plain CSS classes (`ayy-button`, `ayy-card`…) driven by tokens (`--ayy-color-bg`…), so they work anywhere that outputs HTML. React gets typed components that render the same markup; every other framework gets a few light-DOM custom elements for the interactive parts.

- **Small:** zero runtime dependencies. All 21 components are ~8 kB of CSS gzipped.
- **Themes, density, brands:** dark and light, compact/comfortable/touch sizing, swappable brands. Each one is a single attribute.
- **Accessible:** keyboard support, focus rings, ARIA, RTL and Windows High Contrast built in. axe runs on every component in CI.
- **AI-first:** a machine-readable manifest, `llms.txt`, a skill for Claude/Cursor/Codex, an MCP server, and a linter that checks what agents write.

## See it

```sh
pnpm install
pnpm preview    # http://localhost:5173
```

Every component with live examples. Switch theme, density, brand, direction, and React vs. plain HTML from the toolbar.

## Install

```sh
npm i github:danitesler/ayywi    # private repo: needs GitHub access (SSH key, or a token in CI)
```

Once it's on npm: `npm i ayywi`, or with no build step:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/ayywi@0.2/dist/ayywi.min.css">
<script src="https://cdn.jsdelivr.net/npm/ayywi@0.2/dist/elements.global.js" defer></script>
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

**Other platforms**: `pnpm build` writes SCSS, SwiftUI, Compose and JSON tokens to `dist/tokens/`.

Each component page in the preview shows copy-ready HTML and React. The full API is in `manifest/components.json` and `llms-full.txt`.

## Theme, density, brand

```html
<html data-theme="dark" data-density="comfortable" data-brand="violet">
```

- **Theme:** leave it off to follow the OS. It can also go on any section.
- **Density:** `compact` is the default. Phones and tablets get `touch` automatically.
- **Brand:** load `dist/brands/<name>.css`. To add a brand, copy `tokens/brands/violet.json`, edit it and run `pnpm build`.

From JS: `setTheme()`, `setDensity()`, `setBrand()`. Put `themeInitScript` in `<head>` to avoid a flash on load.

**CSS layers:** ayywi's CSS is in cascade layers, so your own CSS always wins. That includes global resets like `button { background: none }`, so either put your reset in a layer or use `ayywi/ayywi.unlayered.css`. Use the unlayered file with Tailwind v3 too.

**Fonts** are opt-in: `ayywi/fonts.css` serves them from the package, `ayywi/fonts-google.css` from Google Fonts. Without either you get system fonts.

## Components

Button · Card · Badge · Avatar · Input · Textarea · Select · Checkbox · Radio · Field · Switch · Tabs · Dialog · Popover · Dropdown menu · Tooltip · Toast · Alert · Progress · Skeleton · Table

## AI setup

In the app that uses ayywi:

```sh
npx ayywi init        # installs the skill, AGENTS.md section, Cursor rule and MCP config
npx ayywi lint src    # checks classes, tokens, variants, raw colours, left/right, missing labels
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
