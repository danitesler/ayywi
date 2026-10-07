# AGENTS.md — working on ayywi itself

Instructions for any coding agent (Claude Code, Cursor, Copilot, Codex, Gemini…) changing this repository.
Building an app *with* ayywi? Use `ai/` instead (see README → "AI setup").

## What this is

A framework-agnostic design system. The product is a **CSS class contract** (`.ayy-*`) driven by **design tokens** (`--ayy-*`), plus:
- framework-free JS helpers (`buttonClass()` …, `toast()`, `setTheme()`),
- thin React components that render the same markup,
- light-DOM custom elements (`<ayy-app-shell>`, `<ayy-navbar>`, `<ayy-tabs>`, `<ayy-combobox>`, `<ayy-dialog>`, `<ayy-popover>`, `<ayy-menu>`, `<ayy-tooltip>`, `<ayy-toc>`, `<ayy-carousel>`, `<ayy-table>`, `<ayy-theme-toggle>`) for every other framework and plain HTML, plus page-wide helpers in `ayywi/elements` (slider fills, number field steps, drop zones),
- machine-readable docs, a linter and an MCP server for AI tools (`cli/`).

Zero runtime dependencies. React is an optional peer.

## Layout

```
tokens/tokens.json          SOURCE OF TRUTH for tokens (DTCG-style; $value = dark, $extensions.ayywi.light = light,
                            $extensions.ayywi.density = comfortable/touch). palette.* = primitives, the rest = semantic
tokens/themes/*.json        extra themes (dark-soft, light-gray): overrides of a base theme's colours, compiled into tokens.css
src/css/tokens.css          generated
src/tokens.ts               generated
src/css/base.css            page defaults (:where, zero specificity), typography + layout utilities, reduced motion, --_ayy-dir
src/css/shadcn.css          the shadcn/ui bridge (unlayered on purpose), copied to dist/shadcn.css
src/css/index.css           declares the layers, imports tokens, base, every component into them
src/components/<slug>/      one folder per component — see .claude/skills/ayywi-add-component/SKILL.md
src/lib/                    cx, refs, position (floating placement), element (SSR-safe custom element base), icons (Hugeicons glyphs ayywi draws)
src/index.ts                "ayywi" entry: tokens, helpers, toast, theme/density — no React
src/react/index.ts          "ayywi/react" entry
src/elements/               "ayywi/elements" (registers <ayy-*>) + global.ts → dist/elements.global.js (window.ayywi)
cli/                        shipped `ayywi` bin: lint.mjs, init.mjs, mcp.mjs (plain Node ESM, no deps)
tailwind/                   Tailwind v3 preset + v4 @theme mapping
scripts/                    build, generators, check; scripts/lib/contract.mjs holds RULES, PUBLIC_HOOKS, UTILITIES, ATTRIBUTES,
                            CATEGORIES and the component ORDER (the manifest, llms files and the preview all read them)
tests/                      node/ (node:test) and e2e/ (Playwright + axe)
evals/                      skill evals: tasks, runner, scorer
manifest/components.json    generated — full machine-readable context
llms.txt, llms-full.txt     generated
llms/<slug>.md              generated: one page per component
ai/                         consumer kit (skill, AGENTS snippet, Cursor rule) — partly generated
preview/                    Vite + React component browser (discovers components automatically), the showcase apps
                            (preview/src/showcase/apps.tsx) and Get started (prompts in preview/src/prompts.ts); its build also
                            hosts dist/, the llms files, the AI kit and the Tailwind files, and each release's runtime files
                            under v/<release>/ (scripts/keep-versions.mjs carries the earlier ones over on every Pages deploy)
```

## Commands

```sh
pnpm install
pnpm build          # generate + dist/ (layered + unlayered CSS, ESM, CJS, .d.ts, elements.global.js, fonts, platform tokens) + sizes
pnpm typecheck      # library + preview + every example file + tests
pnpm check          # design rules, docs ↔ CSS ↔ props ↔ elements, generated files up to date, lints examples
pnpm test           # node tests (linter, MCP, init, token exports, eval scorer) — needs a build
pnpm test:e2e       # Playwright + axe against the built preview
pnpm preview        # http://localhost:5173 — every component, the showcase apps; theme and density from the Theme menu
pnpm preview:build  # static site in preview/dist, hosting dist/ayywi.min.css, dist/elements.global.js and llms*.txt too
```

Run `pnpm build && pnpm typecheck && pnpm check && pnpm test` before every commit, and `pnpm test:e2e` for anything visual or interactive. All must pass.

## Rules

The canonical list lives in `scripts/lib/contract.mjs` (`RULES`) and is rendered into `llms-full.txt` and `ai/`. The short version:

1. Tokens only — no hex/rgb/hsl in component CSS. Tints via `color-mix()` with a token.
2. Logical properties only. No `left/right`, `margin-left`, `text-align: left`, and no `:dir()` (minifiers break it).
3. State from native/ARIA attributes, so every framework drives components the same way.
4. `ayy-` prefix on every class and keyframe; `--ayy-` on every public custom property; private ones are `--_x`.
5. Visible focus ring on everything interactive. Labels, `aria-*` and keyboard support are part of "done". State shown by colour needs a `@media (forced-colors: active)` block.
6. Zero runtime dependencies. Don't add Radix/CVA/etc. — native elements first (`<dialog>`, `role="switch"` checkbox…).
7. Never edit generated files (`src/css/tokens.css`, `src/tokens.ts`, `manifest/`, `llms*.txt`, `llms/`, `ai/AGENTS.snippet.md`, `ai/cursor/ayywi.mdc`, `ai/skills/ayywi/reference.md`). Edit the source and run `pnpm generate`.
8. Docs are code: a component's `*.meta.json` must describe exactly the classes its CSS defines, every state in `STATES` (`scripts/lib/contract.mjs`) and its sizes. `pnpm check` fails otherwise.
9. No file names that differ only by case (esbuild + macOS/Windows resolve them to the same file).

## Gotchas learned the hard way

- An author `display` on `<dialog>` overrides the UA's `display:none` when closed — keep `dialog.ayy-dialog:not([open]) { display: none }`.
- `:dir(rtl)` gets rewritten to `:lang(ar|he|…)` by Lightning CSS (Vite) — it ignores `dir="rtl"`. Animate a logical property instead.
- Hover-only tooltips never receive keydown; Esc handling must listen on `document`.
- `@import url(https://fonts…)` must be first in a stylesheet, so fonts live in the separate opt-in `fonts.css` / `fonts-google.css`.
- A modal `<dialog>` makes everything outside it inert, top layer included. Anything that must stay clickable over a modal (the toaster) has to live inside it.
- Measure floating elements with `offsetWidth/Height`, not `getBoundingClientRect()` — entry animations scale them.
- Custom elements must not render markup or use shadow DOM: they only wire behaviour onto author HTML, and must be SSR-safe to import (`src/lib/element.ts`).
- base.css's reduced-motion rule shortens durations, which scroll-driven animations (`animation-timeline`) ignore. Wrap them in `@media (prefers-reduced-motion: no-preference)` instead.
- `light-dark()` only takes colours. To swap icons by scheme (Theme toggle), switch their `color` between `currentColor` and `transparent`, and set `forced-color-adjust: none` so High Contrast doesn't paint both.
- Playwright's `toBeEnabled()` treats `aria-disabled="true"` as disabled. To check a button is still focusable, read `el.disabled`.
- The preview routes on the URL hash, so in-page anchors in examples (`href="#section"`) are intercepted in `preview/src/Example.tsx` and scrolled to instead.
- Icons are Hugeicons (`@hugeicons/core-free-icons`, a dev dependency and optional peer). Examples use `<Icon>` in `.tsx` and the exact `iconSvg()` markup in `.html`; never hand-draw an SVG. Glyphs ayywi draws itself (close and menu buttons, pagination and carousel arrows, the theme toggle's sun and moon) are copied into `src/lib/icons.ts` to keep zero runtime dependencies, and `tests/node/icons.test.mjs` fails if they drift from the package.
- `.ayy-dialog` is a flex column so `.ayy-dialog__body` can take the leftover height and scroll. Side modals animate `inset-inline-*`, not `transform`, so they slide from the correct edge in RTL.
- Mirroring a glyph or a chart line in RTL has no logical property. `.ayy-icon--directional`, `.ayy-chart__svg` and `.ayy-sparkline` read `--_ayy-dir`, which `base.css` sets on `[dir="rtl"]` and `[dir="ltr"]`; custom properties inherit, so the nearest `dir` attribute wins, as with `dir` itself. Direction set only through CSS `direction` or `dir="auto"` isn't seen.
- A selector list with a pseudo-element the browser doesn't know (`::-moz-range-thumb` in Chromium) is dropped whole. Give each vendor pseudo-element its own rule.
- Chromium can't fill a range track up to the thumb. `.ayy-slider` reads `--ayy-value`, which React and the page-wide `input` listener in `ayywi/elements` keep in step; HTML examples set the starting one inline.
- The page-wide helpers in `ayywi/elements` (number field steps) listen on `document`. React's own handlers call `preventDefault()` so the step doesn't happen twice when both are loaded.
- Get started's prompts link `v/<release>/dist/…` on the published site (a path whose files never change) and the public site's latest from localhost, never localhost itself. The Pages workflow sets `VITE_AYYWI_SITE` from `configure-pages`.
- The App shell and Navbar switch their phone layouts at 48rem with media queries, so component examples in the preview only show them in a narrow window. The showcase apps load in an iframe at real device widths for that reason; e2e tests set the viewport.
- One component's CSS may place another's documented class (the app shell hides its `.ayy-bottom-nav` on wide screens). `pnpm check` allows it; the class stays documented by its own component.
- Example HTML should match what the React example renders. Write the `.tsx` first and render it to markup (react-dom/server) rather than retyping it; only custom-element wrappers (`<ayy-app-shell>`, `<ayy-navbar>`…) and comments differ.
- JSON under `src/components/` and `tokens/` is hand-formatted (short objects on one line). Edit it as text or keep the existing layout; a full `JSON.stringify` rewrite buries the real change in the diff.
- axe can't measure contrast over the preview stage's dotted background, so it silently skips most example text. The real guard is the contrast rule in `pnpm check` (every text colour × surface × theme, plus status text on its own tint). New text colours or surfaces belong in its lists.

## Versioning

Semver. Renaming/removing a class, token or prop is **breaking**. Record every change in `CHANGELOG.md`.
