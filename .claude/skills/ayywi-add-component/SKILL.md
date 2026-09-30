---
name: ayywi-add-component
description: Add a new component to the ayywi design system, or change an existing one (new variant, new state, restyle). Use when working inside the ayywi repo on anything under src/components, tokens/tokens.json, or the preview.
---

# Adding or changing an ayywi component

Every component is one folder. The folder is the whole contract — CSS, framework-free helper, React wrapper, metadata, examples. `pnpm check` enforces that they agree, so work through the steps in order and run it at the end.

## Files (slug = lowercase-kebab, e.g. `segmented-control`)

```
src/components/<slug>/
  <slug>.css              the contract: .ayy-<slug>, .ayy-<slug>__part, .ayy-<slug>--modifier
  <slug>.ts               class helper + variant arrays/types; no React, no DOM side effects
  <slug>.react.tsx        thin React wrapper rendering the SAME markup as the HTML example
  <slug>.element.ts       optional: <ayy-slug> custom element, only if the component needs JS behaviour
  <slug>.meta.json        AI-facing documentation (schema: copy any existing meta)
  examples/<id>.html      copy-ready HTML
  examples/<id>.tsx       copy-ready React (`export default function Example()`, imports from "ayywi/react")
```

Never name a file with only a case difference from a sibling (`Dialog.tsx` next to `dialog.ts`): macOS/Windows and esbuild treat them as the same file.

## Steps

1. **Check it's needed.** Can an existing component take a variant instead? Prefer that.
2. **CSS** (`<slug>.css`)
   - Tokens only: `var(--ayy-…)`. Tints via `color-mix(in srgb, var(--ayy-color-text) N%, transparent)` or the wash/line tokens. No hex/rgb/hsl.
   - Logical properties only. No `left/right/margin-left…`, no `:dir()`. If centring truly needs `left: 50%`, add `/* ayy-allow-physical: reason */` on that line.
   - State from native/ARIA attributes (`:disabled`, `:checked`, `[aria-selected="true"]`, `[aria-invalid="true"]`, `[open]`), never from JS-only classes.
   - Private custom properties are `--_name`. Public hooks must be added to `PUBLIC_HOOKS` in `scripts/lib/contract.mjs`.
   - Visible `:focus-visible` outline on every interactive part: `outline: 2px solid var(--ayy-color-ring); outline-offset: 2px;`.
   - Keyframes are named `ayy-*`. Prefer transform/opacity.
   - Sizes of controls come from density tokens (`--ayy-size-control-*`, `--ayy-control-pad-*`, `--ayy-control-text-*`), never fixed rem, so `data-density` works.
   - If state is shown by colour (`:checked`, `[aria-selected]`, a fill bar…), add a `@media (forced-colors: active)` block mapping it to system colours (`Highlight`, `CanvasText`, `GrayText`). `pnpm check` requires it.
3. **Import the CSS** in `src/css/index.css` into `layer(ayywi.components)` (keep component order).
4. **Helper** (`<slug>.ts`): export `<slug>Variants`/`Sizes` arrays, types, and `<slug>Class(options)` built with `cx`. Export it from `src/index.ts`.
5. **React** (`<slug>.react.tsx`): `forwardRef`, spread native props, render exactly the markup from the HTML example, sensible native defaults (e.g. `type="button"`). No runtime dependencies. Export from `src/react/index.ts`.
6. **Meta** (`<slug>.meta.json`): required keys `name slug status category description whenToUse whenNotToUse classes variants react a11y do dont examples`. `category` is one of `CATEGORIES` in `scripts/lib/contract.mjs` (Actions, Navigation, Forms, Layout, Overlays, Feedback, Data display); the preview sidebar, the manifest and the MCP server group by it. `classes` must list every class the CSS defines — and nothing else.
7. **Examples**: at least one; every `examples[].id` needs both `.html` and `.tsx`. Use realistic content, not lorem ipsum. HTML examples must work with only `ayywi.css` + `elements.global.js`, and pass `ayywi lint` (check runs it). Icons are Hugeicons: `<Icon icon={…} />` in `.tsx`, and in `.html` the markup `iconSvg()` produces for the same icon.
8. **Behaviour** (only if needed): put the logic in `<slug>.ts` as a framework-free function (`connectPopover(trigger, content)` style, returns a cleanup). Use it from the React wrapper and from `<slug>.element.ts` (extend `ElementBase` from `src/lib/element.ts`, no shadow DOM, no rendered markup). Register it in `src/elements/index.ts`, document it in the meta's `element` block (tag, attributes, events). Floating parts use the Popover API + `src/lib/position.ts`.
9. **Preview**: nothing to do — it discovers metas and examples automatically. Add the slug to `ORDER` (order within its category) in `scripts/build-manifest.mjs` and `preview/src/data.ts`.
10. **Tokens** (only if needed): edit `tokens/tokens.json`, never `src/css/tokens.css` or `src/tokens.ts` (generated). New colours go in `palette.*` first; components use semantic tokens only.
11. **Tests**: interactive? Add a case to `tests/e2e/interactions.spec.ts` (both renderers). The page-render and axe tests pick new components up automatically.
12. **Verify**:
    ```sh
    pnpm build && pnpm typecheck && pnpm check && pnpm test && pnpm test:e2e
    pnpm preview     # look at it: Dark + Light, LTR + RTL, React + Plain HTML, each density, violet brand
    ```
13. Add a line to `CHANGELOG.md`.

## Changing an existing component

Same checklist, plus: a renamed/removed class or prop is a breaking change — note it under a "Breaking" heading in CHANGELOG.md with the migration.
