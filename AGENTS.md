# AGENTS.md — working on ayywi itself

Instructions for any coding agent (Claude Code, Cursor, Copilot, Codex, Gemini…) changing this repository.
Building an app *with* ayywi? Use `ai/` instead (see README → "AI setup").

## What this is

A framework-agnostic design system. The product is a **CSS class contract** (`.ayy-*`) driven by **design tokens** (`--ayy-*`), plus:
- framework-free JS helpers (`buttonClass()` …, `toast()`, `setTheme()`),
- thin React components that render the same markup,
- light-DOM custom elements (`<ayy-tabs>`, `<ayy-dialog>`, `<ayy-popover>`, `<ayy-menu>`, `<ayy-tooltip>`) for every other framework and plain HTML,
- machine-readable docs, a linter and an MCP server for AI tools (`cli/`).

Zero runtime dependencies. React is an optional peer.

## Layout

```
tokens/tokens.json          SOURCE OF TRUTH for tokens (DTCG-style; $value = dark, $extensions.ayywi.light = light,
                            $extensions.ayywi.density = comfortable/touch). palette.* = primitives, the rest = semantic
tokens/themes/*.json        extra themes (dark-soft, light-soft): overrides of a base theme's colours, compiled into tokens.css
tokens/brands/*.json        brand overrides of semantic tokens → src/css/brands/*.css
src/css/tokens.css          generated
src/tokens.ts               generated
src/css/base.css            page defaults (:where, zero specificity), typography + layout utilities, reduced motion
src/css/index.css           declares the layers, imports tokens, base, every component into them
src/components/<slug>/      one folder per component — see .claude/skills/ayywi-add-component/SKILL.md
src/lib/                    cx, refs, position (floating placement), element (SSR-safe custom element base)
src/index.ts                "ayywi" entry: tokens, helpers, toast, theme/density/brand — no React
src/react/index.ts          "ayywi/react" entry
src/elements/               "ayywi/elements" (registers <ayy-*>) + global.ts → dist/elements.global.js (window.ayywi)
cli/                        shipped `ayywi` bin: lint.mjs, init.mjs, mcp.mjs (plain Node ESM, no deps)
tailwind/                   Tailwind v3 preset + v4 @theme mapping
scripts/                    build, generators, check; scripts/lib/contract.mjs holds RULES, PUBLIC_HOOKS, UTILITIES, ATTRIBUTES
tests/                      node/ (node:test) and e2e/ (Playwright + axe)
evals/                      skill evals: tasks, runner, scorer
manifest/components.json    generated — full machine-readable context
llms.txt, llms-full.txt     generated
ai/                         consumer kit (skill, AGENTS snippet, Cursor rule) — partly generated
preview/                    Vite + React component browser (discovers components automatically)
```

## Commands

```sh
pnpm install
pnpm build          # generate + dist/ (layered + unlayered CSS, ESM, CJS, .d.ts, elements.global.js, fonts, platform tokens) + sizes
pnpm typecheck      # library + preview + every example file + tests
pnpm check          # design rules, docs ↔ CSS ↔ props ↔ elements, generated files up to date, lints examples
pnpm test           # node tests (linter, MCP, init, token exports, eval scorer) — needs a build
pnpm test:e2e       # Playwright + axe against the built preview
pnpm preview        # http://localhost:5173 — toggle theme, direction, React vs plain HTML
pnpm preview:build  # static site in preview/dist
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
7. Never edit generated files (`src/css/tokens.css`, `src/tokens.ts`, `manifest/`, `llms*.txt`, `ai/AGENTS.snippet.md`, `ai/cursor/ayywi.mdc`, `ai/skills/ayywi/reference.md`). Edit the source and run `pnpm generate`.
8. Docs are code: a component's `*.meta.json` must describe exactly the classes its CSS defines. `pnpm check` fails otherwise.
9. No file names that differ only by case (esbuild + macOS/Windows resolve them to the same file).

## Gotchas learned the hard way

- An author `display` on `<dialog>` overrides the UA's `display:none` when closed — keep `dialog.ayy-dialog:not([open]) { display: none }`.
- `:dir(rtl)` gets rewritten to `:lang(ar|he|…)` by Lightning CSS (Vite) — it ignores `dir="rtl"`. Animate a logical property instead.
- Hover-only tooltips never receive keydown; Esc handling must listen on `document`.
- `@import url(https://fonts…)` must be first in a stylesheet, so fonts live in the separate opt-in `fonts.css` / `fonts-google.css`.
- A modal `<dialog>` makes everything outside it inert, top layer included. Anything that must stay clickable over a modal (the toaster) has to live inside it.
- Measure floating elements with `offsetWidth/Height`, not `getBoundingClientRect()` — entry animations scale them.
- Custom elements must not render markup or use shadow DOM: they only wire behaviour onto author HTML, and must be SSR-safe to import (`src/lib/element.ts`).
- axe can't measure contrast over the preview stage's dotted background, so it silently skips most example text. The real guard is the contrast rule in `pnpm check` (every text colour × surface × theme × brand, plus status text on its own tint). New text colours or surfaces belong in its lists.

## Versioning

Semver. Renaming/removing a class, token or prop is **breaking**. Record every change in `CHANGELOG.md`.
