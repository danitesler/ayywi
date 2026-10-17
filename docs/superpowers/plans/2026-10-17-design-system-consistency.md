# Design-System Consistency Audit Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Eliminate inconsistencies, bugs, and rule-vs-reality drift across tokens, components, preview, a11y/RTL/motion, and tooling so code matches preview definitions and rules describe reality.

**Architecture:** Seven independent workstreams, one per audit domain. Task 1 (rules truth) lands first conceptually; Tasks 2-6 run in parallel after it; Task 7 verifies cross-cutting integration. No runtime behavior changes except documented bug fixes.

**Tech Stack:** TypeScript/React, vanilla CSS with `--ayy-*` tokens, custom elements (`@danitesler/ayywi/elements`), Node ESM scripts (`scripts/check.mjs`, `cli/lint.mjs`, `cli/mcp.mjs`), Playwright + axe e2e.

**Spec:** This plan is the spec. Evidence comes from the 2026-10-17 five-agent audit (tokens/CSS, component contract, preview/examples, a11y/RTL/motion, tooling). Source of truth files: `scripts/lib/contract.mjs` (RULES, STATES, NEEDS, ORDER, CATEGORIES, PATTERNS), `AGENTS.md` (gotchas, commands, versioning).

## Global Constraints

- Never edit generated files directly (`src/css/tokens.css`, `src/tokens.ts`, `manifest/`, `llms*.txt`, `llms/`, `ai/AGENTS.snippet.md`, `ai/cursor/ayywi.mdc`, `ai/skills/ayywi/reference.md`). Edit source + run `pnpm generate`.
- Tokens only — no hex/rgb/hsl in component CSS; tints via `color-mix()` with a token (RULES 2,4).
- Logical properties only; no `:dir()` selectors (minifiers break them).
- State from native/ARIA attributes only; visible `:focus-visible` ring; `@media (forced-colors: active)` where color conveys state.
- Zero runtime dependencies; native elements first.
- `pnpm build && pnpm typecheck && pnpm check && pnpm test` must pass before every commit; `pnpm test:e2e` for visual/interactive changes. No GitHub Actions workflows.
- Semver: renaming/removing a class, token, or prop is breaking; record in `CHANGELOG.md` under `## Unreleased` as `**[Name](#/slug)**` + `<was X> → <now Y>` on indented second line.
- Never release on your own (no version bump, tag, publish). Keep adding to `## Unreleased`.

## Review Focus

- Touch-device sticky `:hover` (button lift, slider thumb growth) still stuck after tap — expect no lift/growth without `@media (hover: hover)`.
- Plain-HTML slider with no inline `--ayy-value` paints with no fill on first paint — expect documented starting value or auto-fill.
- `dir="auto"` or CSS-only `direction` content never flips `--_ayy-dir` consumers (directional icons, charts, slider fill) — expect documented limitation or `getComputedStyle`-based fix.
- Chart `.tsx` data edit without regenerating `.html` ships stale numbers into docs — expect parity check or generation script.
- Single-snippet MCP `lint` false-positives on `rebuilt-component` that the `--hook` path suppresses — expect same guard in both paths.

---

### Task 1: Rules truth — make RULES describe reality

**Files:**
- Modify: `scripts/lib/contract.mjs:213-238` (RULES)
- Modify: `AGENTS.md` (gotchas section only if RULES change affects it)
- Test: `tests/node/` (add `rules-truth.test.mjs` — asserts documented exemptions exist)
- Generated (via `pnpm generate`, do not hand-edit): `llms-full.txt`, `ai/AGENTS.snippet.md`, `ai/cursor/ayywi.mdc`

**Interfaces:**
- Consumes: nothing (first task).
- Produces: Revised RULES text that Tasks 2-6 reference for enforcement wording (exemption names: `color-data`, `ayy-allow-physical`, `density-fixed`, `circle-50pct`, `1px-border`, `light-dark-accent`).

- [ ] **Step 1: Write failing test listing current rule-vs-reality gaps**

```js
// tests/node/rules-truth.test.mjs
// assert RULES text mentions: color-data carve-out, ayy-allow-physical,
// density exemptions, 50% circles, 1px borders, .dark/.light aliases,
// light-dark() accent usage, font/tracking/opacity/z token families
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/node/rules-truth.test.mjs`
Expected: FAIL (exemptions missing from RULES)

- [ ] **Step 3: Rewrite RULES 2,3,4,5 in `scripts/lib/contract.mjs`**

Exact decisions (implement verbatim): RULE 2 gets `Color data (swatch values, picker defaults like "#2563eb") is not theme styling and is exempt`; RULE 3 documents `ayy-allow-physical` as the only exemption (glyph checks `menu.css:139`, `select.css:51`, centring `tooltip.css:54`); RULE 4 lists real families (`--ayy-tracking-*`, `--ayy-font-*`, `--ayy-opacity-*`, `--ayy-z-*`), allows `border-radius: 50%` for dots/radios and `border-radius: 0` resets, `1px` borders / `2px` gaps as idiom, and admits `density: fixed` for display/feedback components; RULE 5 documents triple-selector reality (`data-theme` or `.dark`/`.light` or OS) and the four sanctioned `light-dark()` usages (accent-text, text-highlight, icon-tile, toc) + `brand.ts ld()` helper.

- [ ] **Step 4: Run `pnpm generate` + test to verify it passes**

Run: `pnpm generate && node --test tests/node/rules-truth.test.mjs`
Expected: PASS; `git status` shows only source + regenerated files changed

- [ ] **Step 5: Commit**

```bash
git add scripts/lib/contract.mjs tests/node/rules-truth.test.mjs manifest llms.txt llms-full.txt llms ai
git commit -m "docs: align RULES with token/CSS reality"
```

### Task 2: Token/CSS discipline + Tailwind/shadcn parity

**Files:**
- Modify: `src/components/badge/badge.css:26-27,66-67,83`, `src/components/status-dot/status-dot.css:51`, `src/components/toast/toast.css:34,209`, `src/components/grid/grid.css:57-60`, `src/components/button/button.css:35-38`, `src/components/toolbar/toolbar.css:36-37`, `src/components/chip/chip.css:162-163`, `src/components/tabs/tabs.css:16,39`, `src/components/toc/toc.css:198,223`
- Modify: `tailwind/preset.cjs:28-104`, `tailwind/theme.css:22-98`, `src/css/shadcn.css:26-34`
- Modify: `src/components/color-picker/color-picker.ts:180,183` (JS hsl/hex gradients)
- Test: extend `scripts/check.mjs` contrast/tint modeling + add `tests/node/tokens.test.mjs` cases

**Interfaces:**
- Consumes: Task 1 exemption names.
- Produces: Token scale additions (if any, e.g. `--ayy-ease-*` usage map, z-index alignment); shadcn `chart-6` mapping.

- [ ] **Step 1: Write failing test for ease/z/tailwind gaps**

```js
// assert no bare `ease` keyword where --ayy-ease-* exists;
// assert toast z-index within --ayy-z-* scale (20/50/60/70);
// assert tailwind preset+theme expose duration/z/control-height + color.highlight/glow/shadow;
// assert shadcn maps chart-1..6
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/node/tokens.test.mjs`
Expected: FAIL on bare `ease` in `base.css:100`, `toast.css:34 (2000)`, tailwind omissions, shadcn `chart-6`

- [ ] **Step 3: Fix `src/components/*` motion + z-index in place**

Replace bare `ease` with `var(--ayy-ease-standard)` (keep `toast.css:203`, `timeline.css:95` pattern); `status-dot.css:51` ping → tokens or documented exception with comment; `toast.css:34,209` 2000/1050 → `--ayy-z-toast` scale; `toc.css:198,223` drop redundant `, 50` fallback; unify `150ms` → `var(--ayy-duration-fast)`; leave `3px`/`6px`/`8px` dots + `50%` circles + `1px` borders (now exempt per Task 1 — add comment citing exemption, do not tokenize).

- [ ] **Step 4: Fix `color-picker.ts:180,183` hardcoded gradients**

Move `HUE_TRACK_GRADIENT` hsl stops + `#000/#fff` overlays behind a `/* color-data: hue spectrum is content, not theme */` marker or derive from tokens; ensure `cli/lint.mjs` hardcoded-color rule passes.

- [ ] **Step 5: Add missing Tailwind + shadcn mappings**

`preset.cjs`/`theme.css`: add `color.highlight/glow/shadow`, `text-s/sm/md`, `space.*`, missing `radius/size/control/z` entries (reference `var(--ayy-*)`, follow `data-theme`); `theme.css` add duration/z/control-height to match preset; `shadcn.css` add `chart-6` + document `destructive-foreground: var(--ayy-color-bg)` pairing rationale.

- [ ] **Step 6: Run tests + check to verify**

Run: `node --test tests/node/tokens.test.mjs && node scripts/check.mjs`
Expected: PASS (contrast check still green; tint percentages 8/10/14/16-18/35/55/60/80 documented as known-variance in code comment)

- [ ] **Step 7: Commit**

```bash
git add src/components tailwind src/css tests/node scripts/check.mjs
git commit -m "fix: token discipline and tailwind/shadcn parity"
```

### Task 3: Component contract fixes (meta ↔ CSS ↔ React ↔ elements)

**Files:**
- Modify: `src/components/toast/toast.meta.json:49`, `src/components/dialog/dialog.meta.json:68,107-112`, `src/components/app-shell/app-shell.meta.json:159`, `src/components/date-time-picker/date-time-picker.meta.json:103`, `src/index.ts:80-81`
- Modify: `src/components/field/field.css`, `src/components/settings/settings.css:182-184`, `src/components/carousel/carousel.css`, `src/components/page-header/page-header.css`, `src/components/stat/stat.css`, `src/components/icon/icon.css` (forced-colors blocks or N/A record)
- Modify: `src/components/shortcut/shortcut.meta.json` (add `usePlatform`)
- Test: existing `pnpm check` (meta↔CSS↔props↔elements) must stay green

**Interfaces:**
- Consumes: Task 1 RULES (element-tag plural convention).
- Produces: Corrected `meta.json` values consumed by Task 6 MCP fix (`elements[]`).

- [ ] **Step 1: Write failing assertions using current meta values**

```js
// toast variants.values contains "card-split" but toast.ts:7 toastVariants lacks it;
// dialog DialogContent size omits "full" but dialog.ts:5 + react:86 support it;
// app-shell element size doc says "md|sm" default Big but element.ts:18,45-48 is sm|md|lg default lg
```

- [ ] **Step 2: Run `node scripts/check.mjs` to confirm current green (baseline)**

Run: `node scripts/check.mjs`
Expected: PASS today (check doesn't catch these three) — record baseline

- [ ] **Step 3: Fix the three meta docs + one Plural element + one export**

`toast.meta.json:49` drop `"card-split"` from variant values (keep `toast.card()` path); `dialog.meta.json:68` add `"full"` + add `full` example entry `:107-112` (or cross-link to Settings pattern); `app-shell.meta.json:159` → `"sm" | "md" | "lg"` default `lg`; `date-time-picker.meta.json:103` document all four tags (`ayy-date-picker/range/time-picker/date-time-picker`) or explicit shared-contract note; `shortcut.meta.json` add `usePlatform`; `src/index.ts:80-81` remove duplicate `status-dot`/`showcase` re-exports.

- [ ] **Step 4: Add forced-colors blocks to the 6 missing components**

`field.css` (error text → `Mark`/`MarkText` or system equivalent), `settings.css:182-184` (destructive text), `carousel.css` (disabled prev/next → `GrayText`); `page-header/stat/icon` — add block or `/* forced-colors: N/A — no color-conveyed state */` comment so the sweep is explicit.

- [ ] **Step 5: Run check + typecheck to verify**

Run: `pnpm check && pnpm typecheck`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/components/dialog src/components/toast src/components/app-shell src/components/date-time-picker src/components/shortcut src/index.ts src/components/field src/components/settings src/components/carousel
git commit -m "fix: component contract meta alignment and forced-colors coverage"
```

### Task 4: Preview / examples / docs alignment

**Files:**
- Modify: `src/components/dialog/examples/side.html`, `src/components/toast/examples/basic.html`, `src/components/table/examples/sortable.html`, `src/components/chart/examples/bars.html` (or add generator)
- Modify: `preview/src/preview.css:640`, `preview/src/pages/Brand.tsx:148`, `preview/src/Showcase.tsx:95-99,157-183`, `preview/src/prompts.ts:98-104,125-132`, `preview/src/pages/Showcase.tsx:9,73-74`, `scripts/capture-showcase-screenshots.mjs:36-44`
- Test: add `tests/node/examples-parity.test.mjs` (id-suffix rule, required nodes, starter/showcase id resolution)

**Interfaces:**
- Consumes: Task 1 parity definition (see Step 3).
- Produces: Parity rule text reused by Task 6 lint (`-html` suffix convention).

- [ ] **Step 1: Write failing parity test**

```js
// assert every meta.examples id has both .tsx and .html;
// assert `-html` id suffix convention documented;
// assert STARTERS ids resolve to showcase ids (tracker/internal case fails today);
// assert RESPONSIVE_SLUGS covers dialog/side, carousel, table, grid or records exception
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/node/examples-parity.test.mjs`
Expected: FAIL (tracker starter unreachable, responsive slugs omit dialog/side etc.)

- [ ] **Step 3: Codify parity rule in one comment + fix drift**

Parity = "HTML equals React default render, except `<ayy-*>` wrappers, `-html` id suffixes (collision avoidance), and hand-added close buttons for plain HTML." Add this as a header comment in one example pair + `preview/src/Example.tsx`. Then: `dialog/side.html` — keep `method="dialog"` but add comment explaining toast divergence, align input ids with `-html` rule; `toast/basic.html` — replace `onClick: () => {}` stubs with comment + remove inline `onclick` (lint `clickable-element` shape); `table/sortable.html` — add `indeterminate` state to select-all to match `sortable.tsx:58`, verify `aria-selected="false"` vs React omission; `page-header/basic.html` + `navbar/menu.html` — add `<!-- defaults snapshot of <tsx> -->` comment.

- [ ] **Step 4: Fix preview violations + showcase/prompts**

`preview.css:640` `40rem` → `48rem`; `Brand.tsx:148` raw `<button class="ayy-swatch">` → ayywi component or `ayywi-lint-disable-next-line -- <why>`; `Showcase.tsx:95-99` scope `syncStyles` to non-`pv-*` or document porous boundary; `RESPONSIVE_SLUGS` add `dialog/side`, `carousel`, `table`, `grid`, `bottom-nav`, `settings` or record why not; `prompts.ts:125-132` add `tracker` starter (or map `internal→inbox` rename to matching ids); resolve `#/apps/*` vs `#/showcase/*` canonical route + gallery copy; expand `prompts.ts:98-104` RULES digest to name forced-colors, motion, logical-props (or point to full RULES); `capture-showcase-screenshots.mjs` add tablet/mobile captures or downgrade gallery "desktop, tablet and mobile" claim.

- [ ] **Step 5: Run parity test + check**

Run: `node --test tests/node/examples-parity.test.mjs && node scripts/check.mjs`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/components/dialog/examples src/components/toast/examples src/components/table/examples preview/src scripts tests/node/examples-parity.test.mjs
git commit -m "fix: preview example parity and showcase prompt alignment"
```

### Task 5: A11y / RTL / motion / states

**Files:**
- Modify: `src/components/button/button.css:41-47`, `src/components/slider/slider.css:75-77`, `src/components/popover/popover.css`, `src/components/carousel/carousel.css:23-41`, `src/components/date-time-picker/date-time-picker.css:972-973,980-981,1159-1160`, `src/components/skeleton/skeleton.css:23,39-43`, `src/components/chart/chart.css:84,325`, `src/components/chat/chat.css:55-81`, `src/components/switch/switch.css:30-36` (reference, do not change)
- Test: `tests/e2e/` (add `a11y-states.test.mjs` cases: hover-guard, popover focus, carousel controls, time-picker selection without custom class)

**Interfaces:**
- Consumes: Task 1 motion/forced-colors wording; Task 3 forced-colors blocks.
- Produces: None (leaf task).

- [ ] **Step 1: Write failing e2e/unit assertions**

```js
// button lift only inside @media (hover:hover);
// slider thumb scale only inside @media (hover:hover);
// popover has :focus-visible/:focus-within ring;
// carousel prev/next have ring+size rules;
// no `--selected` custom-class selector drives selected state in date-time-picker
```

- [ ] **Step 2: Run to verify they fail**

Run: `npx playwright test tests/e2e/a11y-states -v` (or targeted grep)
Expected: FAIL on button/slider hover guards, popover focus, carousel controls, `__item--selected`

- [ ] **Step 3: Fix hover guards + focus + states**

`button.css:41-47` wrap lift in `@media (hover: hover)` (copy `card.css:24-29` pattern); `slider.css:75-77` same for thumb `scale: 1.1`; `popover.css` add `:focus-visible`/`:focus-within` inset ring (mirror `dialog.css:264-267`); `carousel.css` add prev/next button ring + size/density rules (do not rely on slotted button); `date-time-picker.css` remove `--selected` selectors, keep `[aria-selected="true"]` only (keep both during migration only if JS sets both — then remove JS class).

- [ ] **Step 4: Fix RTL + motion justification**

`skeleton.css:23,39-43` shimmer `translateX` → logical-property animation or `/* decorative LTR-only, exempt */` comment; `chart.css:84,325` `block-size`/`inline-size` transitions get justification comment (like switch) or convert to transform; `chat.css:55-81` + skeleton add local `prefers-reduced-motion` static state (don't rely solely on `base.css:405-414` duration-collapse); document `dir="auto"`/CSS-direction `--_ayy-dir` limitation in `base.css:282-283` comment (keep `position.ts:38` `getComputedStyle` as the correct pattern).

- [ ] **Step 5: Run e2e subset + axe to verify**

Run: `npx playwright test tests/e2e/a11y-states --reporter=list`
Expected: PASS, no axe violations

- [ ] **Step 6: Commit**

```bash
git add src/components/button src/components/slider src/components/popover src/components/carousel src/components/date-time-picker src/components/skeleton src/components/chart src/components/chat tests/e2e
git commit -m "fix: hover guards, focus rings, ARIA-only states, RTL and motion"
```

### Task 6: Lint / MCP / check enforcement + init fix

**Files:**
- Modify: `cli/lint.mjs:218-248,323-337,446-449,470,484,520,531-535,657-670,821`, `cli/mcp.mjs:31-36,60,64,197-217`, `cli/init.mjs:22-25`, `scripts/check.mjs:32-50,54,62,71,90-100,221-230,253-266,303,385-401`, `scripts/build-manifest.mjs:264`, `tests/node/lint.test.mjs:49-51,62`, `tests/node/mcp.test.mjs:43`
- Test: `tests/node/lint.test.mjs`, `tests/node/mcp.test.mjs`, `tests/node/init.test.mjs`

**Interfaces:**
- Consumes: Task 1 RULES text; Task 3 `elements[]` shape; Task 4 parity rule.
- Produces: Enforcement that validates Tasks 2-5 on every run.

- [ ] **Step 1: Write failing lint/MCP assertions**

```js
// <a onClick> flagged; <pre class=x> flagged as raw-control;
// <input type=color> consistent between bare and raw;
// MCP get_component returns all 4 date-time tags;
// llms.txt tool list includes pick_component;
// HOOK_COMMAND is "npx -y @danitesler/ayywi lint --hook"
```

- [ ] **Step 2: Run to verify they fail**

Run: `node --test tests/node/lint.test.mjs tests/node/mcp.test.mjs tests/node/init.test.mjs`
Expected: FAIL (a/pre gaps, elements[] gap, HOOK_COMMAND `npx --no ayywi`)

- [ ] **Step 3: Fix `cli/init.mjs` + lock test**

`init.mjs:22-25` `HOOK_COMMAND = "npx -y @danitesler/ayywi lint --hook"` (match `MCP_SERVER` scoped pattern); update `init.test.mjs:62` assertion from buggy string to fixed string.

- [ ] **Step 4: Fix MCP + manifest gaps**

`mcp.mjs:31-36,60` render + `find()` over `c.elements[]` plural (keep singular compat); `check.mjs:221-230` validate `elements[]` attributes/events; `build-manifest.mjs:264` add `pick_component` to `llms.txt` tool list; `mcp.mjs:212-217` add single-file `rebuilt-component` guard matching `lint.mjs:821 --hook` behavior; document `create_brand` needs `dist/` in tool description.

- [ ] **Step 5: Fix lint detectors (narrow, no regex overreach)**

Add `a` to clickable/`CONTROL_OF_TAG` where action-shaped; add `pre/code` → CodeBlock to `RAW_TAGS`/`CONTROL_OF_TAG`; unify `color` mapping (both → Swatch); extend clickable beyond `onClick` minimally (`onKeyDown`-as-button only when Enter/Space handler, `onMouseDown` openers) + `preventDefault`-only exemption to match `stopPropagation`-only; document `rebuilt-component` suffix heuristic + grow `NOT_ALIASES` only with evidence; unify `physical-property` severity story (warn vs fail) in one comment; extend `<img>` size rule to Next `<Image>` or document skip + `{...props}` spread.

- [ ] **Step 6: Tighten `check.mjs` + unblock masking**

`STATEFUL :100` add `:hover`, `:focus-visible`, `:active`, `:disabled`, `[aria-invalid]`, `[aria-busy]`; add narrow detectors for Rule 4 tokens / Rule 5 dark-mode / Rule 10 motion / Rule 14 container misuse only where zero-false-positive (else record as `warn` + test); `NATIVE_PROPS :71` add `disabled/id/name/placeholder/onChange` or document interface-bloat rule; relax `reactExports`/`ownProps` regexes (`export { X }`, 4-space/tab, `Readonly<Props>`); `check.mjs:385-401` don't skip examples+preview lint when generated stale (report both); `shadcn.css foreignVars:true :303` stays but gets a one-line rules-doc note (Task 1).

- [ ] **Step 7: Run full node tests + check**

Run: `node --test tests/node/ && node scripts/check.mjs`
Expected: PASS

- [ ] **Step 8: Commit**

```bash
git add cli scripts tests/node
git commit -m "fix: lint MCP check enforcement and init hook command"
```

### Task 7: Process hygiene + final verification

**Files:**
- Modify: `CHANGELOG.md:103,156` (merge duplicate `### Changed`), `:63-66,70-71` (before→after, density link)
- Modify: `scripts/check-all.sh:36-44`, `package.json:91-107`, `AGENTS.md:50-60,147`
- Test: full `scripts/check-all.sh --quick` + `pnpm test:e2e` (visual tasks only)

**Interfaces:**
- Consumes: All Tasks 1-6 diffs (CHANGELOG entries for each).
- Produces: Release-ready `## Unreleased` + verified green tree.

- [ ] **Step 1: Fix CHANGELOG structure + add entries for Tasks 1-6**

Merge the two `### Changed` sections (`:103` + `:156`) into one; rewrite `:63-66` with `→`; fix `[Density](#/density)` dead link (`:70-71`) to foundation route or remove; add one entry per task in AGENTS format (`**[Area](#/slug)**` + indented `<was> → <now>`).

- [ ] **Step 2: Reconcile `check-all.sh` vs AGENTS vs `package.json` scripts**

Document `generate/tokens/manifest/lint:examples/preview:serve/check:all` in AGENTS or remove stale promises; decide `prepublishOnly` (check-only today) vs full gate + record decision; verify `shim/` release step (`AGENTS.md:147`) — either restore dir or delete step.

- [ ] **Step 3: Run full verification on clean tree**

Run: `pnpm build && pnpm typecheck && pnpm check && pnpm test`
Expected: PASS with no `git diff --exit-code` failures

- [ ] **Step 4: Run e2e for visual tasks**

Run: `pnpm test:e2e`
Expected: PASS (axe clean; screenshots desktop-only limitation noted)

- [ ] **Step 5: Commit**

```bash
git add CHANGELOG.md scripts/check-all.sh AGENTS.md package.json
git commit -m "docs: changelog and process hygiene"
```

## Self-Review

- Spec coverage: tokens (T2), contract (T3), preview (T4), a11y/RTL/motion (T5), tooling (T6), rules truth (T1), process (T7) — all five audit reports mapped.
- Step scan: each step names exact file:line + command + expected output; no TBDs.
- Type consistency: `elements[]` plural used in T3, T6 identically; exemption names from T1 reused in T2, T5, T6.
- Proportion: plan is shorter than the five audit outputs combined; code bodies left to implementers.
