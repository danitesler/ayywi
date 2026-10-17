# Highlight Component and Command Palette Search Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a reusable `Highlight` component in the design system with subtle white and color-coded tints, enhance `CommandItem` with 1-line description and highlight support, and prioritize title matches over description matches across all sections in the command palette search.

**Architecture:**
- `src/components/highlight`: Pure JS helper `highlightParts` for substring matching/tokenizing, `Highlight` React component wrapping matches in `<mark className="ayy-highlight ...">`, CSS with subtle white tint by default plus warning, destructive, success, info, and orange variants.
- `src/css/base.css`: Add `:where(mark, .ayy-highlight)` zero-specificity base rule for framework-free HTML mark elements; register in `scripts/lib/contract.mjs` and display in `preview/src/pages/Foundations.tsx`.
- `src/components/command`: Update `connectCommand` and scoring in `command.ts` to rank exact/prefix title matches above description matches, sorting items and floating top-scoring groups to the top; add `.ayy-command__description` 1-line truncated styling and `description` prop in `CommandItem`.
- `preview/src/App.tsx`: Pass descriptions and `<Highlight>` for title and description in `CommandDialog`, verifying that typing "input" places the "Input" component at the top of results.

**Tech Stack:** TypeScript, React, Vanilla CSS with design tokens (`color-mix()`, `--ayy-*`), node:test.

**Spec:** User request specifying subtle tinted-white default highlight with expandable color variants (yellow/warning, orange, green/success, red/danger, info), command item description (max 1 line) with matched text highlighted, and title search priority jumping exact matches to the top across all sections.

## Global Constraints

- Tokens only — no hex/rgb/hsl in component CSS; tints via `color-mix()` with a token.
- Logical properties only (`padding-inline`, `padding-block`, `inset-inline-*`, etc.).
- Zero runtime dependencies.
- Visible focus ring / state shown by colour must include `@media (forced-colors: active)` support.
- Docs are code: `*.meta.json` must describe all classes and states in `STATES`. Run `pnpm generate && pnpm check`.

## Review Focus

- Empty query or whitespace-only query should return the entire text unchanged without empty `<mark>` tags.
- Special regex characters in search queries (e.g. `(`, `[`, `*`, `+`, `?`) must not crash `highlightParts` or `commandMatches`.
- Resetting the command search query back to empty must restore the exact original DOM order of groups and items.
- Item descriptions must truncate with ellipsis on one line without breaking flex layout or pushing shortcut/meta pills out of view.
- Contrast of highlighted text against surfaces must pass WCAG AA across dark, light, dark-contrast, and light-gray themes.

---

### Task 1: Highlight text-splitting logic and unit tests

**Files:**
- Create: `src/components/highlight/highlight.ts`
- Create: `tests/node/highlight.test.mjs`

**Interfaces:**
- Produces:
  ```ts
  export type HighlightVariant = "default" | "warning" | "destructive" | "success" | "info" | "orange";
  export const highlightClass = (options?: { variant?: HighlightVariant; className?: string }) => string;
  export function highlightParts(text: string, query: string): { text: string; match: boolean }[];
  ```

- [ ] **Step 1: Write failing unit tests for `highlightParts` and `highlightClass`**

Create `tests/node/highlight.test.mjs`:
```js
import test from "node:test";
import assert from "node:assert/strict";
import { highlightParts, highlightClass } from "../../src/components/highlight/highlight.ts";

test("highlightClass produces ayy-highlight class and variant modifiers", () => {
  assert.equal(highlightClass(), "ayy-highlight");
  assert.equal(highlightClass({ variant: "warning" }), "ayy-highlight ayy-highlight--warning");
  assert.equal(highlightClass({ className: "custom" }), "ayy-highlight custom");
});

test("highlightParts returns text unchanged when query is empty or whitespace", () => {
  assert.deepEqual(highlightParts("Hello world", ""), [{ text: "Hello world", match: false }]);
  assert.deepEqual(highlightParts("Hello world", "   "), [{ text: "Hello world", match: false }]);
});

test("highlightParts matches substring case-insensitively and preserves original casing", () => {
  const parts = highlightParts("Input component for text input", "input");
  assert.deepEqual(parts, [
    { text: "Input", match: true },
    { text: " component for text ", match: false },
    { text: "input", match: true }
  ]);
});

test("highlightParts safely handles regex special characters", () => {
  const parts = highlightParts("Price ($10) [test]", "($10)");
  assert.deepEqual(parts, [
    { text: "Price ", match: false },
    { text: "($10)", match: true },
    { text: " [test]", match: false }
  ]);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/node/highlight.test.mjs`
Expected: FAIL (module not found)

- [ ] **Step 3: Implement `src/components/highlight/highlight.ts`**

Implement `highlightClass` using `cx` and `highlightParts` using RegExp with escaped query characters, returning array of `{ text, match }`.

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/node/highlight.test.mjs`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/highlight/highlight.ts tests/node/highlight.test.mjs
git commit -m "feat(highlight): add highlightParts helper and unit tests"
```

---

### Task 2: Highlight CSS, React component, metadata, and base typography integration

**Files:**
- Create: `src/components/highlight/highlight.css`
- Create: `src/components/highlight/highlight.react.tsx`
- Create: `src/components/highlight/highlight.meta.json`
- Create: `src/components/highlight/examples/basic.tsx`
- Create: `src/components/highlight/examples/basic.html`
- Create: `src/components/highlight/examples/variants.tsx`
- Create: `src/components/highlight/examples/variants.html`
- Modify: `src/react/index.ts`
- Modify: `src/index.ts`
- Modify: `src/css/index.css`
- Modify: `src/css/base.css`
- Modify: `scripts/lib/contract.mjs`
- Modify: `preview/src/pages/Foundations.tsx`

**Interfaces:**
- Consumes: `highlightParts`, `highlightClass` from Task 1
- Produces:
  - `<Highlight text={text} query={query} variant={variant} />` exported from `@danitesler/ayywi/react`
  - `.ayy-highlight`, `.ayy-highlight--<variant>` in CSS
  - `:where(mark, .ayy-highlight)` in `base.css`

- [ ] **Step 1: Create `src/components/highlight/highlight.css`**

Add CSS with:
- `.ayy-highlight`: subtle white tint `background-color: color-mix(in srgb, var(--ayy-color-text) 12%, transparent); color: inherit; padding-block: 0.05em; padding-inline: 0.25em; border-radius: var(--ayy-radius-sm); box-sizing: border-box; display: inline;`
- `.ayy-highlight--warning`, `.ayy-highlight--destructive`, `.ayy-highlight--success`, `.ayy-highlight--info`, `.ayy-highlight--orange` using `color-mix()` and `light-dark()`.
- `@media (forced-colors: active)` with `Highlight` background and `HighlightText` color.

- [ ] **Step 2: Create `src/components/highlight/highlight.react.tsx`**

Implement `Highlight` component:
Accepts `text?: string`, `query?: string`, `variant?: HighlightVariant`, `as?: ElementType`, `children?: ReactNode`.
Uses `highlightParts` to slice text into segments, wrapping matches in `<mark className={highlightClass({ variant })}>` and leaving non-matches as strings.

- [ ] **Step 3: Create `highlight.meta.json` and examples**

Add metadata according to ayywi schema (all 8 states: default, hover, pressed, focus, disabled, selected, error, loading; variants, sizes, a11y, do/dont, examples).
Create `examples/basic.tsx`, `examples/basic.html`, `examples/variants.tsx`, `examples/variants.html`.

- [ ] **Step 4: Wire exports, contract, base.css, and typography foundation**

- In `src/index.ts`: export `highlightClass`, `highlightParts`, `HighlightVariant`.
- In `src/react/index.ts`: export `Highlight`, `HighlightProps`.
- In `src/css/index.css`: `@import "../components/highlight/highlight.css";`
- In `src/css/base.css`: add `:where(mark, .ayy-highlight)` under typography helpers.
- In `scripts/lib/contract.mjs`: add `"highlight"` to `ORDER` under Data display; add `"ayy-highlight"` to `UTILITIES`.
- In `preview/src/pages/Foundations.tsx`: add highlight sample to `TYPE_STYLES`.

- [ ] **Step 5: Run generator, typecheck, and check script**

Run: `pnpm generate && pnpm typecheck && pnpm check`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/components/highlight/ src/css/base.css src/css/index.css src/index.ts src/react/index.ts scripts/lib/contract.mjs preview/src/pages/Foundations.tsx
git commit -m "feat(highlight): add Highlight component, styles, metadata and typography foundation"
```

---

### Task 3: Command scoring and title-priority sorting

**Files:**
- Modify: `src/components/command/command.ts`
- Create: `tests/node/command-score.test.mjs`

**Interfaces:**
- Produces:
  ```ts
  export function commandScore(title: string, description: string, keywords: string, query: string): number;
  ```
- Updates `connectCommand` to score items and reorder visible items and groups when query is present.

- [ ] **Step 1: Write failing tests for command scoring and priority sorting**

Create `tests/node/command-score.test.mjs`:
```js
import test from "node:test";
import assert from "node:assert/strict";
import { commandScore } from "../../src/components/command/command.ts";

test("commandScore gives highest priority to exact title match", () => {
  const exactScore = commandScore("Input", "", "", "input");
  const prefixScore = commandScore("Input group", "", "", "input");
  const descScore = commandScore("Choice card", "A native input wrapper", "", "input");

  assert.ok(exactScore > prefixScore, "Exact title match must score higher than prefix match");
  assert.ok(prefixScore > descScore, "Title prefix match must score higher than description match");
  assert.ok(descScore > 0, "Description match must produce a positive score");
});

test("commandScore returns 0 when query does not match", () => {
  assert.equal(commandScore("Button", "Clickable element", "action", "input"), 0);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/node/command-score.test.mjs`
Expected: FAIL

- [ ] **Step 3: Implement `commandScore` and sorting in `command.ts`**

- Implement scoring tiers:
  - Exact normalized title match: 1000
  - Title starts with query: 500
  - Title word starts with query: 300
  - Title contains query: 200
  - Description word starts with query: 100
  - Description/keywords contains query: 50
  - No match: 0
- Update `connectCommand`:
  - Store original child indexes on groups and items so empty queries preserve original DOM sequence.
  - On search input: compute score for each item, filter (`score > 0`), sort items inside each group by score descending, and sort groups in the list by their maximum item score descending.

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/node/command-score.test.mjs`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/command/command.ts tests/node/command-score.test.mjs
git commit -m "feat(command): add commandScore with title priority and group reordering"
```

---

### Task 4: CommandItem description support & styling

**Files:**
- Modify: `src/components/command/command.css`
- Modify: `src/components/command/command.react.tsx`
- Modify: `src/components/command/command.meta.json`

**Interfaces:**
- Updates:
  - `CommandItemProps` with `description?: ReactNode`
  - `.ayy-command__content`, `.ayy-command__title`, `.ayy-command__description` CSS classes

- [ ] **Step 1: Add description styles in `src/components/command/command.css`**

Add:
- `.ayy-command__content`: flex column, min-inline-size 0, gap `var(--ayy-space-0-5)`.
- `.ayy-command__title`: flex row, align-items center, gap `var(--ayy-space-2)`.
- `.ayy-command__description`: color `var(--ayy-color-muted)`, font size `var(--ayy-text-xs)`, line height `var(--ayy-leading-tight)`, `white-space: nowrap; overflow: hidden; text-overflow: ellipsis;`.
- Under `[aria-selected="true"]`: `.ayy-command__description` receives `color: var(--ayy-color-text-soft);` (and `HighlightText` in forced-colors).

- [ ] **Step 2: Update `CommandItem` in `src/components/command/command.react.tsx`**

- Add `description?: ReactNode;` to `CommandItemProps`.
- If `description` is provided: wrap title and description in `.ayy-command__content`, storing `data-title` for scoring. If not provided, keep existing flat layout for backwards compatibility.

- [ ] **Step 3: Update `src/components/command/command.meta.json`**

Document `.ayy-command__content`, `.ayy-command__title`, `.ayy-command__description` and the `description` prop in `CommandItem`.

- [ ] **Step 4: Run typecheck and check script**

Run: `pnpm typecheck && pnpm check`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/command/command.css src/components/command/command.react.tsx src/components/command/command.meta.json
git commit -m "feat(command): add CommandItem description support and 1-line truncation styling"
```

---

### Task 5: Search overlay integration in preview app

**Files:**
- Modify: `preview/src/App.tsx`

**Interfaces:**
- Consumes: `<Highlight>` from `@danitesler/ayywi/react`, `CommandItem description` prop

- [ ] **Step 1: Update `preview/src/App.tsx`**

- Maintain `searchQuery` state in `App.tsx` updated via `onSearchChange={setSearchQuery}` on `CommandDialog`.
- For `SECTIONS`:
  - Pass `description` for items:
    - Components: `c.description`
    - Foundations: short description
    - Start items: short description
  - In `CommandItem`:
    - Pass `description={searchQuery && item.description ? <Highlight text={item.description} query={searchQuery} /> : item.description}`
    - Pass `{searchQuery ? <Highlight text={item.title} query={searchQuery} /> : item.title}`
    - Pass `data-title={item.title}`

- [ ] **Step 2: Verify search behavior via preview build and test**

Run: `pnpm typecheck && pnpm build`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add preview/src/App.tsx
git commit -m "feat(preview): integrate Highlight and item descriptions in command search overlay"
```

---

### Task 6: Verification, check-all, and changelog

**Files:**
- Modify: `CHANGELOG.md`

- [ ] **Step 1: Run full verification suite**

Run: `pnpm build && pnpm typecheck && pnpm check && pnpm test`
Expected: All pass with 0 errors.

- [ ] **Step 2: Record changes in `CHANGELOG.md` under `## Unreleased`**

Add:
- Under `### Added`:
  - `**[Highlight](#/highlight)**`
    New component — subtle inline text highlighting with expandable colour variants and native `<mark>` integration.
  - `**[Command palette](#/command)**`
    Support for 1-line truncated item descriptions and title-prioritized search ranking across groups.

- [ ] **Step 3: Commit**

```bash
git add CHANGELOG.md
git commit -m "docs: update changelog for Highlight and Command enhancements"
```
