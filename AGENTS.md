# AGENTS.md — working on ayywi itself

Instructions for any coding agent (Claude Code, Cursor, Copilot, Codex, Gemini…) changing this repository.
Building an app *with* ayywi? Use `ai/` instead (see README → "AI setup").

## What this is

A framework-agnostic design system. The product is a **CSS class contract** (`.ayy-*`) driven by **design tokens** (`--ayy-*`), plus:
- framework-free JS helpers (`buttonClass()` …, `toast()`, `setTheme()`),
- thin React components that render the same markup,
- light-DOM custom elements (`<ayy-app-shell>`, `<ayy-navbar>`, `<ayy-tabs>`, `<ayy-combobox>`, `<ayy-date-picker>`, `<ayy-date-range>`, `<ayy-time-picker>`, `<ayy-date-time-picker>`, `<ayy-color-picker>`, `<ayy-icon-picker>`, `<ayy-toolbar>`, `<ayy-action-bar>`, `<ayy-shortcut-recorder>`, `<ayy-command>`, `<ayy-tag-input>`, `<ayy-record-picker>`, `<ayy-inline-edit>`, `<ayy-swipe>`, `<ayy-drag-drop>`, `<ayy-dialog>`, `<ayy-popover>`, `<ayy-menu>`, `<ayy-tooltip>`, `<ayy-toc>`, `<ayy-tree>`, `<ayy-carousel>`, `<ayy-table>`, `<ayy-grid>`) for every other framework and plain HTML, plus page-wide helpers in `@danitesler/ayywi/elements` (slider fills, number field steps, custom swatch colours, search bar clear buttons, code block copy buttons, select option lists, shortcuts drawn for Apple devices, drop zones),
- machine-readable docs, a linter and an MCP server for AI tools (`cli/`), plus what `ayywi init` installs in an app: the skill, a lint hook and the `ayywi-ui-reviewer` agent (`ai/`).

Zero runtime dependencies. React is an optional peer.

## Layout

```
tokens/tokens.json          SOURCE OF TRUTH for tokens (DTCG-style; $value = dark, $extensions.ayywi.light = light,
                            $extensions.ayywi.density = comfortable/touch). palette.* = primitives, the rest = semantic
tokens/themes/*.json        extra themes (dark-contrast, light-gray): overrides of a base theme's colours, compiled into tokens.css
src/css/tokens.css          generated
src/tokens.ts               generated
src/css/base.css            page defaults (:where, zero specificity), typography + layout utilities, reduced motion, --_ayy-dir
src/css/index.css           declares the layers, imports tokens, base, every component into them
src/components/<slug>/      one folder per component — see .claude/skills/ayywi-add-component/SKILL.md
src/lib/                    cx, refs, position (floating placement), element (SSR-safe custom element base), icons (Hugeicons glyphs ayywi draws)
src/index.ts                "@danitesler/ayywi" entry: tokens, helpers, toast, theme/density — no React
src/react/index.ts          "@danitesler/ayywi/react" entry
src/elements/               "@danitesler/ayywi/elements" (registers <ayy-*>) + global.ts → dist/elements.global.js (window.ayywi)
cli/                        shipped `ayywi` bin: lint.mjs, init.mjs, mcp.mjs (plain Node ESM, no deps)
scripts/                    build, generators, check; scripts/lib/contract.mjs holds RULES, NEEDS (need → component), PUBLIC_HOOKS, UTILITIES, ATTRIBUTES,
                            CATEGORIES and the component ORDER (the manifest, llms files and the preview all read them)
tests/                      node/ (node:test) and e2e/ (Playwright + axe)
evals/                      skill evals: tasks, runner, scorer
manifest/components.json    generated — full machine-readable context
llms.txt, llms-full.txt     generated
llms/<slug>.md              generated: one page per component
ai/                         consumer kit (skill, AGENTS snippet, Cursor rule) — partly generated
preview/                    Vite + React component browser (discovers components automatically): a header with Docs, Components,
                            Examples and Themes tabs (routes in preview/src/routes.ts), a home page, the showcase apps
                            (preview/src/showcase/apps.tsx) and Get started (prompts in preview/src/prompts.ts); its build also
                            hosts dist/, the llms files, the AI kit, and each release's runtime files
                            under v/<release>/ (scripts/keep-versions.mjs carries the earlier ones over on every deploy)
```

## Commands

```sh
pnpm install
pnpm build          # generate + dist/ (layered + unlayered CSS, ESM, CJS, .d.ts, elements.global.js, fonts, platform tokens) + sizes
pnpm typecheck      # library + preview + every example file + tests
pnpm check          # design rules, docs ↔ CSS ↔ props ↔ elements, generated files up to date, lints examples
pnpm test           # node tests (linter, MCP, init, token exports, eval scorer) — needs a build
pnpm test:e2e       # Playwright + axe against the built preview, in Playwright's Chromium (E2E_CHROME=1: the installed Chrome)
scripts/check-all.sh  # every check above, locally (--quick skips the preview build and e2e)
pnpm preview        # http://localhost:5173 — every component, the showcase apps; theme from the theme button, density from the menu beside it
pnpm preview:build  # static site in preview/dist, hosting dist/ayywi.min.css, dist/elements.global.js and llms*.txt too
scripts/deploy-pages.sh  # publish the preview to GitHub Pages (gh-pages branch, pushed from here); part of a release
```

After a code change: `pnpm build && pnpm typecheck && pnpm check && pnpm test`. Docs-only changes (CHANGELOG, README, prose) need no build and no e2e — but run `pnpm check` when you edit docs, since it validates the README's component table and jsDelivr links.

A visual or interactive change also needs e2e, at two speeds:

```sh
export E2E_PORT=$((4200 + $$ % 300))                            # this shell only; never share another session's
pnpm preview --port "$E2E_PORT" --strictPort --host 127.0.0.1   # terminal 1
pnpm exec playwright test tests/e2e/interactions.spec.ts -g "dialog"
pnpm test:e2e                                                   # whole suite against the built preview
```

`E2E_PORT` drives the preview and Playwright's `baseURL`. A port that already answers is an error, not a reuse (`E2E_REUSE=1` opts in), so two sessions cannot test each other's code by accident. `-g` matches the whole test title, so pair it with a file and a lowercase term; `--list` shows what a filter hits without starting a server. Keep the full run before calling the work done: it is the only one that sees the built CSS, where `:dir()` becomes `:lang()`, and the only one that covers `pages`, `theming` (axe), `dist` and `app-components`, which can't be scoped to a component.

`scripts/check-all.sh` runs all of them plus the preview build and e2e (`--quick` skips those two); run it before merging or publishing. **There is no hosted CI. Never add GitHub Actions workflows** (or any other `.github/` automation); every check runs locally.

## Rules

The canonical list lives in `scripts/lib/contract.mjs` (`RULES`) and is rendered into `llms-full.txt` and `ai/`. The short version:

1. Tokens only — no hex/rgb/hsl in component CSS. Tints via `color-mix()` with a token.
2. Logical properties only. No `left/right`, `margin-left`, `text-align: left`, and no `:dir()` (minifiers break it).
3. State from native/ARIA attributes, so every framework drives components the same way.
4. `ayy-` prefix on every class and keyframe; `--ayy-` on every public custom property; private ones are `--_x`.
5. Visible focus ring on everything interactive. Labels, `aria-*` and keyboard support are part of "done". State shown by colour needs a `@media (forced-colors: active)` block.
6. Zero runtime dependencies. Native elements first (`<dialog>`, `role="switch"` checkbox…).
7. Never edit generated files (`src/css/tokens.css`, `src/tokens.ts`, `manifest/`, `llms*.txt`, `llms/`, `ai/AGENTS.snippet.md`, `ai/cursor/ayywi.mdc`, `ai/skills/ayywi/reference.md`). Edit the source and run `pnpm generate`.
8. Docs are code: a component's `*.meta.json` must describe exactly the classes its CSS defines, every state in `STATES` (`scripts/lib/contract.mjs`) and its sizes. `pnpm check` fails otherwise.
9. No file names that differ only by case (esbuild + macOS/Windows resolve them to the same file).

## Preview examples

When adding a component variation, extend an existing preview example whenever possible: add it as an item, option or state in the relevant example. Create a separate example only when the variation cannot be demonstrated clearly within an existing one. Do not add a standalone preview section just because a variation is new. Keep the React and HTML examples in sync.

## Gotchas learned the hard way

- An author `display` on `<dialog>` overrides the UA's `display:none` when closed — keep `dialog.ayy-dialog:not([open]) { display: none }`.
- `:dir(rtl)` gets rewritten to `:lang(ar|he|…)` by Lightning CSS (Vite) — it ignores `dir="rtl"`. Animate a logical property instead.
- Hover-only tooltips never receive keydown; Esc handling must listen on `document`.
- `@import url(https://fonts…)` must be first in a stylesheet, so fonts live in the separate opt-in `fonts.css` / `fonts-google.css`.
- A modal `<dialog>` makes everything outside it inert, top layer included. Anything that must stay clickable over a modal (the toaster) has to live inside it.
- Measure floating elements with `offsetWidth/Height`, not `getBoundingClientRect()` — entry animations scale them.
- Custom elements must not use shadow DOM: they wire behaviour onto author HTML, and must be SSR-safe to import (`src/lib/element.ts`). The only markup they draw is content the author can't write ahead of time (a calendar's days for another month, a recorded shortcut's keys, a new tag's chip), built with the same classes React renders.
- base.css's reduced-motion rule shortens durations, which scroll-driven animations (`animation-timeline`) ignore. Wrap them in `@media (prefers-reduced-motion: no-preference)` instead.
- `light-dark()` only takes colours. To swap icons by scheme, switch their `color` between `currentColor` and `transparent`, and set `forced-color-adjust: none` so High Contrast doesn't paint both.
- Playwright's `toBeEnabled()` treats `aria-disabled="true"` as disabled. To check a button is still focusable, read `el.disabled`.
- The preview routes on the URL hash, so in-page anchors in examples (`href="#section"`) are intercepted in `preview/src/Example.tsx` and scrolled to instead. Pages live under a tab (`#/docs/colors`, `#/components/button/properties`, `#/examples/inbox`, `#/themes`); `canonical()` in `preview/src/routes.ts` rewrites older links (`#/button`, `#/colors/status`, `#/apps/inbox`, `#/brand`) in place, so keep it in step when a page moves.
- Icons are Hugeicons (`@hugeicons/core-free-icons`): `<Icon>` in `.tsx`, the `iconSvg()` markup in `.html`, never a hand-drawn SVG. The few glyphs ayywi draws itself live in `src/lib/icons.ts` for zero runtime deps; `tests/node/icons.test.mjs` fails when they drift from the package.
- `.ayy-dialog` is a flex column so `.ayy-dialog__body` can take the leftover height and scroll. Side modals animate `inset-inline-*`, not `transform`, so they slide from the correct edge in RTL.
- Mirroring a glyph or a chart line in RTL has no logical property. `.ayy-icon--directional`, `.ayy-chart__svg` and `.ayy-sparkline` read `--_ayy-dir`, which `base.css` sets on `[dir="rtl"]` and `[dir="ltr"]`; custom properties inherit, so the nearest `dir` attribute wins, as with `dir` itself. Direction set only through CSS `direction` or `dir="auto"` isn't seen.
- A selector list with a pseudo-element the browser doesn't know (`::-moz-range-thumb` in Chromium) is dropped whole. Give each vendor pseudo-element its own rule.
- Chromium can't fill a range track up to the thumb. `.ayy-slider` reads `--ayy-value`, which React and the page-wide `input` listener in `@danitesler/ayywi/elements` keep in step; HTML examples set the starting one inline.
- The page-wide helpers in `@danitesler/ayywi/elements` (number field steps) listen on `document`. React's own handlers call `preventDefault()` so the step doesn't happen twice when both are loaded.
- Get started's prompts link `v/<release>/dist/…` on the published site (a path whose files never change) and the public site's latest from localhost, never localhost itself. Set `VITE_AYYWI_SITE` when building for another host.
- The App shell and Navbar switch their phone layouts at 48rem with media queries, so component examples in the preview only show them in a narrow window. The showcase apps load in an iframe at real device widths for that reason; e2e tests set the viewport.
- One component's CSS may place another's documented class (the app shell hides its `.ayy-bottom-nav` on wide screens). `pnpm check` allows it; the class stays documented by its own component.
- Example HTML should match what the React example renders. Write the `.tsx` first and render it to markup (react-dom/server) rather than retyping it; only custom-element wrappers (`<ayy-app-shell>`, `<ayy-navbar>`…) and comments differ.
- JSON under `src/components/` and `tokens/` is hand-formatted (short objects on one line). Edit it as text or keep the existing layout; a full `JSON.stringify` rewrite buries the real change in the diff.
- WebKit (Safari, Tauri on macOS) never focuses a button on click, so script-moved focus (a dialog opening, focus returning to its opener) matches `:focus-visible`. `src/css/focus.css` hides rings while `data-ayy-input="pointer"` (`trackInputModality()`); it lives in `ayywi.utilities`, because base.css's own `@layer ayywi.utilities` nests inside `ayywi.base`, under components. Rings on `::before`/`::after` need their own pointer-mode rule in the component. In e2e, a bare `locator.focus()` counts as pointer use — use `keyboardFocus()` from helpers to test focus-only UI.
- A popover shown on `mousedown` is light-dismissed by the `pointerup` that follows. Select's list blocks the OS picker on mousedown and opens on `click`; it cleans up on `beforetoggle`, since `toggle` events coalesce and a quick reopen would find the old list.
- The preview is built with ayywi and `pnpm check` lints `preview/src` like the examples. A deliberate docs-only restyle gets an `ayywi-lint-disable-next-line -- <why>` comment; anything else uses the component.
- axe can't measure contrast over the preview stage's dotted background, so it silently skips most example text. The real guard is the contrast rule in `pnpm check` (every text colour × surface × theme, plus status text on its own tint). New text colours or surfaces belong in its lists.

## Versioning and changelog rules

Semver: renaming or removing a class, token or prop is **breaking**.

Record every change in `CHANGELOG.md` under `## Unreleased` (only a release renames it; see Releases below), grouped under `### Added`, `### Changed`, `### Fixed` or `### Removed`. Each item is one sentence a cross-functional reader understands — no implementation detail, no math — with the title on the first line and the description on the next, indented two spaces. Link the component to its preview route (`**[Dialog](#/dialog)**`); for non-component areas bold the name (`**Tokens**`, **Linter**). Say what it was before and what it is now, and put `(**Breaking**)` in the title of a rename or removal.

```markdown
### Added
- **[Component](#/slug)**
  New component — <what it does, one line>.

### Changed
- **[Component](#/slug)**
  <was X> → <now Y>.

### Removed
- **[Component](#/slug)** (**Breaking**)
  <was X> removed → <now use Y>.
```

### Releases: the maintainer decides

Never release on your own. That means no version bump in `package.json`, no renaming `## Unreleased`, no git tag, no `npm publish` — not even for a breaking change, and not when a task says "finish" or "ship". Keep adding to `## Unreleased`.

When the work under `## Unreleased` looks ready to ship, ask the maintainer whether to release, and suggest a version: on 0.x, a patch (`0.1.0` → `0.1.1`) for fixes and safe additions, a minor (`0.1.0` → `0.2.0`) for anything breaking. Wait for a clear yes and the version number.

Once approved, a release is one job; do every step, in order, and stop at the first failure:
1. `CHANGELOG.md`: `## Unreleased` → `## <version> — <YYYY-MM-DD>`, with a new empty `## Unreleased` above it.
2. `npm version <version> --no-git-tag-version`.
3. `pnpm build && node scripts/pin-readme.mjs`: moves the README's jsDelivr links to the new version with SRI hashes from `dist/`. `pnpm check` fails until this is done.
4. Commit everything (`Release <version>`).
5. `scripts/check-all.sh`. Everything must pass, on the committed tree (it fails if the build changes tracked files). Fix and amend if not, then `git tag -a v<version> -m "Release <version>"` (annotated, so `--follow-tags` pushes it).
6. `npm publish`. If npm asks for a one-time password, stop and ask the maintainer to run it; never handle their 2FA codes.
7. `git push --follow-tags`.
8. Verify: `npm view @danitesler/ayywi version` shows the new version, and `node scripts/pin-readme.mjs --verify` passes (jsDelivr can take a few minutes to see a new release).
9. Publish the site: `scripts/deploy-pages.sh`.
10. If `shim/` (the unscoped `ayywi` package) should follow, bump its version and dependency range, then `npm publish` from `shim/`.
