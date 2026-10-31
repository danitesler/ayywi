# React-only: keep the CSS and the framework-free logic, drop the HTML layer (2026-10-31)

Goal: one maintained way to use ayywi's components, React, on top of the two layers that already do the real work: the CSS class contract and the framework-free logic (`connectCombobox()`, `buttonClass()`, `toast()`, `setTheme()`…). The custom elements, the hand-written HTML examples and the second e2e pass go.

Not in scope: switching frameworks, rewriting the framework-free logic as React hooks, touching CSS or tokens.

## Where things stand

| Layer | Size | Used by React? |
|---|---|---|
| CSS (`*.css`) | ~19k lines | yes |
| Framework-free logic (`<slug>.ts`) | ~19k lines | yes, React wraps it |
| React (`*.react.tsx`, 85) | ~13k lines | it *is* React |
| Custom elements (29 `*.element.ts`, `src/elements/`) | ~2.3k lines | no; React never imports `src/elements` |
| HTML examples (185 `examples/*.html`) | ~7.8k lines | no; a copy of the `.tsx` next to it |
| e2e in a `for renderer of ["react", "html"]` loop | 150 of 291 tests | half of those runs are HTML |
| HTML in the AI docs (`llms/*.md`) | 59% of the characters | no |

## Decide first

1. **Is the no-build path worth keeping?** README's quick start and the Get started prompts (`headTags()` in `preview/src/prompts.ts`) tell an AI chat to load `ayywi.min.css` and `elements.global.js` from jsDelivr. Without `elements.global.js` those pages still look right, but dialogs, comboboxes, menus, tabs, date pickers and the app shell's phone layout stop working. Tools that scaffold Vite + React (Lovable, Bolt, v0) would install from npm, so they aren't affected. Single-file HTML in an AI chat is.
   - Don't care about that path → full plan below.
   - Do care → the **freeze** variant at the end.
2. **Does anyone else use `@danitesler/ayywi/elements` or `<ayy-*>`?** Check npm and jsDelivr stats for `elements.global.js` by hand (this session's network can't reach either). The apps you know of (takerr, dooduu) are React.

## Phase 1: find what React quietly borrows from `/elements` (nothing deleted)

The preview loads `@danitesler/ayywi/elements` for every page (`preview/src/main.tsx`), so a React example can pass e2e only because a page-wide listener did part of its job. Find those cases before deleting anything.

1. Remove `import "@danitesler/ayywi/elements"` from `preview/src/main.tsx` (call `trackInputModality()` there instead, which the contract already tells React apps to do).
2. Run the React half of e2e. Anything that breaks was leaning on the helpers.
3. For each one, call the existing framework-free function from the React component. Known candidates:
   - `openSettingsColor()` / `syncSettingsColor()` (custom colour option in a settings Select): only `src/elements/index.ts` calls them today.
   - Failed avatar images that fail before hydration, slider fills and number-field limits on first paint, Apple shortcut glyphs, code-block highlighting. React seems to handle these, but nothing tests React without the helpers yet.
4. Commit this phase by itself. It's a fix even if the rest never happens.

## Phase 2: remove the HTML layer

**Custom elements**
- Delete the 29 `*.element.ts`, `src/elements/` (`index.ts`, `global.ts`).
- `src/lib/element.ts` → `src/lib/dom.ts` with only `ensureId`, `addIdRef`, `emit` (the framework-free logic uses `ensureId`). `ElementBase`, `define`, `own` go.
- `package.json`: drop the `./elements` export, the `elements` entries in `sideEffects`, `vue`/`svelte` keywords, and rewrite `description`.
- `scripts/build.mjs`: drop the `elements` entry, the `elements.global.js` IIFE build and its size report line.

**Examples and docs**
- Delete the 185 `examples/*.html`. Example ids in `*.meta.json` stay; each needs only a `.tsx`.
- Drop the `element` / `elements` block from the 29 `*.meta.json` files that have one.
- `scripts/build-manifest.mjs`, `cli/mcp.mjs`: React-only examples in `manifest/`, `llms*.txt`, `llms/` and MCP `get_component`. Optional later: generate static markup from the `.tsx` with `react-dom/server` if someone needs class structure without React.
- `scripts/check.mjs`: drop the `.html`-exists check, the HTML icon-geometry check and the element-doc checks; `lint:examples` lints `.tsx` only.

**Preview**
- Remove the HTML/React renderer setting, the HTML path in `preview/src/Showcase.tsx`, the `elements.global.js` copy in `preview/vite.config.ts`, the element-tag search terms in `App.tsx`.
- Get started / `prompts.ts`: npm + React only. Keep `theme-init.js` and the CSS links.

**Tests and evals**
- Unroll the 16 `renderer` loops to React; delete the HTML-only tests (`test.skip(renderer !== "html")`, `renderer: "html"` opens) and the HTML helpers such as `pgSetup()`.
- `tests/e2e/dist.spec.ts`: drop the `elements.global.js` checks.
- Node tests that touch elements: `block-editor`, `theme-customization`, `lint`, `mcp`.
- `evals/tasks`: `status-table`, `app-frame`, `settings-form` (HTML) and `tabs-vue` → rewrite as React tasks or delete.

## Phase 3: words

- `AGENTS.md`: the custom element list, "plus page-wide helpers", the `ai/` description, "Keep the React and HTML examples in sync", "Example HTML should match what the React example renders", the custom-element gotchas (light DOM, SSR-safe import), the page-wide `input` listener note under the slider gotcha.
- `.claude/skills/ayywi-add-component/SKILL.md`: steps 5, 7 and 8 (no `.html`, no `.element.ts`; behaviour still goes in `<slug>.ts` as a function that takes DOM nodes and returns a cleanup).
- `scripts/lib/contract.mjs`: rule text and `NEEDS` entries that say "`<ayy-…>` in HTML", `SETUP`'s subpath list, the `--ayy-mx` / `--ayy-from` / `data-ayy-input` notes that name `/elements`. Then `pnpm generate` for `ai/`.
- `README.md`: the pitch, quick start, the jsDelivr script tag (and its pin in `scripts/lib/readme-pins.mjs`).
- `CHANGELOG.md` under `## Unreleased` → `### Removed`: **Custom elements** (**Breaking**), **HTML examples** in the docs, `elements.global.js` (**Breaking**).

## Phase 4: verify

`pnpm build && pnpm typecheck && pnpm check && pnpm test`, then `scripts/check-all.sh`. Note before and after: e2e wall time, `llms-full.txt` and `llms/` size, `dist/` size. Then ask the maintainer about a release; this is breaking, so **0.2.0**.

## Benefits

- About 10k hand-maintained lines gone (2.3k elements + 7.8k HTML). A component loses its `.element.ts` and half of its example files.
- About 150 fewer e2e runs, roughly a third of the suite.
- One example per variation to write and review; no "render the `.tsx` to markup and paste it" step.
- AI docs shrink: 59% of `llms/*.md` is HTML today. Less context per component for agents, and no chance an agent copies the HTML version into a React app.
- The preview, checks and add-component skill each lose a branch. Fewer rules for agents to get wrong.
- The framework-free logic and the CSS stay, so another framework can come back later as a new thin adapter without touching the core.

## Downsides

- **The CDN / single-file path breaks** for anything interactive (see Decide first). This is the big one.
- **Breaking for any outside user** of `/elements`, `<ayy-*>` or `elements.global.js`. Old versions and old `v/<release>/` site paths keep working; new releases won't have them.
- **"Works in any framework" becomes "CSS works anywhere, behaviour needs React."** Vue, Svelte or server templates can still call `connectCombobox(input, listbox)` and friends, but that's documented only in JSDoc, so in practice they're unsupported.
- **The logic loses its second consumer.** Today the custom elements keep `<slug>.ts` honest: it has to work on plain DOM. With React the only caller, React habits can creep in (assuming React owns the DOM, relying on re-renders). The add-component skill's "takes DOM nodes, returns a cleanup" rule is the only guard left.
- **Hidden regressions** from Phase 1 if it's skipped or rushed: features that only worked because the preview loaded the helpers.
- **Large diff** (~300 files). Several sessions work in this checkout; do it in one sitting on a branch with nothing else in flight, or it will conflict with everything.

## Freeze variant (if the CDN path matters)

Keep `src/elements/`, the `./elements` export and `elements.global.js` exactly as they are, but delete the HTML examples, the renderer loops and the element-doc checks, and add one smoke e2e that loads `elements.global.js` and opens a dialog, a combobox and a menu. That's about 80% of the savings with nothing breaking. The cost: shipped code that's barely tested will drift, so treat it as a step towards removal, not a resting place.
