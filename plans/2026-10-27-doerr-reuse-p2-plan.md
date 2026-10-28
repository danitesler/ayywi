# Doerr Reuse P2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use code-run-plan to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the six P2 pieces from the second Doerr review to ayywi: toast with several actions, prompt dialogs, Find bar, Checklist, Board and Event calendar.

**Architecture:** Two extensions of existing components (Toast, Dialog) and four new component folders (`find-bar`, `checklist`, `board`, `event-calendar`), each a full ayywi contract: CSS, framework-free helper, React wrapper, light-DOM element where it needs behaviour, meta, HTML + React examples, tests. Board and Event calendar build on Drag and drop, Card, Popover and the date-picker helpers instead of copying Doerr's `lib/dnd.ts` or date code.

**Tech Stack:** TypeScript, React 19 (optional peer), light-DOM custom elements, CSS custom properties and cascade layers, `node:test`, Playwright + axe.

**Spec:** `plans/2026-10-27-doerr-reuse-p2.md` (P2 scope table). Background: `plans/2026-10-doerr-reuse.md`.

**Written for:** Haiku 5.5 implementers with a stronger reviewer. Every class name, prop, attribute, label and test value below is decided; use them verbatim. Where a step says "copy the shape of X", open X and follow its structure.

**Model per role** (the controller sets `model` explicitly on every dispatch):

| Task | Implementer | Why |
| --- | --- | --- |
| 1 Toast actions | haiku | One function, one test |
| 2 Prompt dialogs | haiku | One new file, rules listed one by one |
| 3 Find bar | haiku | Markup and keys fully specified; copy of inline edit's shape |
| 4 Checklist | haiku → sonnet from fix round 2 | Focus after re-render in two renderers is where cheap models loop |
| 5 Board | haiku | Mostly CSS; Drag and drop does the moving |
| 6 Event calendar month | sonnet | Two renderers, labels, controlled month, the most markup |
| 7 Overflow and moving | sonnet | Measuring, Popover and Drag and drop together |
| Task reviews | sonnet | Mid-tier floor |
| Final branch review | opus | Most capable |

## Global Constraints

- **Worktree, not the main checkout.** From `/Users/danitesler/Projects/ayywi`: `git worktree add -b feat/doerr-reuse-p2 ../ayywi-doerr-reuse-p2 main`, then `cd ../ayywi-doerr-reuse-p2 && pnpm install`. Copy `plans/2026-10-27-doerr-reuse-p2.md` and this plan into the worktree's `plans/` (they are untracked in the main checkout) and commit them as the first commit (`Plans: Doerr reuse P2`).
- **One commit per task** (more are fine), message prefix = the component name (`Toast: …`, `Find bar: …`). Stage only files the task touched; never `git add -A`, `git add .` or `git commit -a`. No merge, push, version bump, tag or publish. Keep adding under `## Unreleased`.
- **No hosted CI.** Never add `.github/` files.
- **Zero runtime dependencies.** Glyphs come from `src/lib/icons.ts` only: `ArrowUp01Icon`, `ArrowDown01Icon`, `ArrowLeft01Icon`, `ArrowRight01Icon`, `Cancel01Icon`, `PlusSignIcon`. Render them with `iconSvg()` (`src/components/icon/icon.ts`) in DOM code and `<Icon icon={…} />` in React. Don't add glyphs.
- **Tokens only** in CSS: `var(--ayy-…)`; tints with `color-mix(in srgb, var(--ayy-color-text) N%, transparent)`. Tokens that exist: `--ayy-color-{bg,surface,surface-raised,wash,text,muted,line,line-strong,primary,primary-fg,ring,destructive}`, `--ayy-radius-{sm,md,lg,xl}`, `--ayy-shadow-{rest,lift,overlay}`, `--ayy-space-*` (incl. `1-5`), `--ayy-text-{xs,sm}`, `--ayy-weight-{regular,semibold}`. No hex/rgb/hsl.
- **Logical properties only** (`inset-inline-end`, `padding-inline`, `text-align: start`). No `left/right`, no `:dir()`. Directional glyphs (month arrows) get class `ayy-icon--directional`.
- **State from native/ARIA attributes**: `aria-current`, `aria-pressed`, `aria-invalid`, `:checked`, `disabled`, `hidden`. The only data-attribute states allowed are the ones named in a task (`data-outside`, `data-done`), following the date picker's `data-outside` precedent.
- **Focus ring** on every interactive part: `outline: 2px solid var(--ayy-color-ring); outline-offset: 2px;` on `:focus-visible`. A state shown by colour needs a `@media (forced-colors: active)` block (`Highlight`, `CanvasText`, `GrayText`).
- **Density:** control heights come from the existing Button/Input classes; don't set fixed rem heights on controls.
- **Never edit generated files** (`src/css/tokens.css`, `src/tokens.ts`, `manifest/`, `llms*.txt`, `llms/`, `ai/AGENTS.snippet.md`, `ai/cursor/ayywi.mdc`, `ai/skills/ayywi/reference.md`). `pnpm build` regenerates them; commit the output.
- **JSON under `src/components/` is hand-formatted** (short objects on one line). Edit as text; never rewrite a file with `JSON.stringify`.
- **Examples:** write the `.tsx` first, render it to markup with `react-dom/server`, and save that as the `.html` (only custom-element wrappers and comments differ). No inline `<script>`. Inline styles only as `inline-size`/`max-inline-size` in rem or `--ayy-gap`.
- **New-component checklist** (Tasks 3–6; canonical text: `.claude/skills/ayywi-add-component/SKILL.md`, read it first):
  1. `src/components/<slug>/<slug>.css`, `<slug>.ts`, `<slug>.react.tsx`, `<slug>.element.ts`, `<slug>.meta.json`, `examples/<id>.tsx` + `.html`.
  2. Import the CSS in `src/css/index.css` inside `layer(ayywi.components)`, in the same position as in `ORDER`.
  3. Export the helper from `src/index.ts`; the React components and types from `src/react/index.ts`.
  4. Register the element in `src/elements/index.ts` (import, export, `define("ayy-<slug>", …)`), and add `<ayy-<slug>>` to the element lists in `AGENTS.md` (line 11), `ai/skills/ayywi/SKILL.md` and the RULES line in `scripts/lib/contract.mjs` that lists elements.
  5. Add the slug to `ORDER` in `scripts/lib/contract.mjs` at the position the task names, and the task's `NEEDS` row to `NEEDS`.
  6. Add any public custom property the task names to `PUBLIC_HOOKS` in `scripts/lib/contract.mjs`.
  7. README: add the Components table row and bump "all N components" (84 → 85 after Task 3, 86 after Task 4, 87 after Task 5, 88 after Task 6).
  8. `CHANGELOG.md` under `## Unreleased` → `### Added`: `- **[Name](#/slug)**` then, indented two spaces, `New component — <the task's one-line summary>.`
  9. `meta.json`: copy the key order of `src/components/inline-edit/inline-edit.meta.json`. `states` lists `default, hover, pressed, focus, disabled, selected, error, loading` in that order, then the task's own states. `classes` lists every class the CSS defines and nothing else.
- **Model files to copy the shape of:** element → `src/components/inline-edit/inline-edit.element.ts`; React component with `forwardRef` → `src/components/inline-edit/inline-edit.react.tsx`; e2e spec → `tests/e2e/tree.spec.ts`; node test → `tests/node/chart.test.mjs`.
- **Commands.** Per task, in the worktree:
  - `pnpm build && pnpm typecheck && pnpm check && pnpm test` (all four must pass; fix `pnpm check` findings, never suppress them)
  - e2e for the task's spec: `E2E_PORT=$((4200 + $$ % 300)) pnpm exec playwright test tests/e2e/<file>.spec.ts` (it builds and serves the preview itself; takes a minute)
  - A task is done only when those commands passed in this session and their output was read.

## Review Focus

1. **IME composition.** Enter while a Japanese/Chinese/Korean IME is composing must not submit a prompt dialog, step a find bar or add a checklist item. Tasks 2, 3 and 4 dispatch `keydown` Enter with `isComposing: true` and assert nothing happened.
2. **Phone width and long text.** A long checklist item, event title or a toast with four actions must not cause horizontal page scroll at 320–390px. Tasks 1, 3, 4, 5 and 6 assert `scrollWidth <= clientWidth + 1` on the component (Board: on the page, while the board itself scrolls).
3. **RTL.** Find bar's close button sits at the inline end; a board's first column and a calendar's first weekday sit on the right; month arrows mirror; Alt+ArrowRight on a calendar event means the previous day. Tasks 3, 5, 6 and 7 assert positions after `rtl()`.
4. **Focus after the action.** A prompt dialog returns focus to its opener; a removed checklist item moves focus to the previous item at its end; a calendar's "+N more" popover returns focus to its button on Esc. Tasks 2, 4 and 7 assert `toBeFocused()`.
5. **A second call or an outside update wins.** A second `confirmDialog()` while one is open resolves the first as cancelled; a controlled `month`/`items` prop changed by the parent replaces local state. Tasks 2, 4 and 6 test it.

---

### Task 1: Toast with several actions

**Files:**
- Modify: `src/components/toast/toast.ts` (`ToastOptions`, the `if (options.action)` block near line 470)
- Modify: `src/components/toast/toast.css` (`.ayy-toast__actions`, line ~331)
- Modify: `src/components/toast/toast.meta.json` (document `actions` wherever `action` is documented)
- Modify: `src/components/toast/examples/basic.tsx` (one more entry in `TOAST_TRIGGERS`); `basic.html` only if it carries the same trigger list
- Modify: `CHANGELOG.md`
- Test: `tests/e2e/interactions.spec.ts` (new test right after "toast appears, runs its action, and sits above a modal dialog", same describe block)

**Interfaces:**
- Produces (exported from `src/components/toast/toast.ts`, re-exported wherever `ToastOptions` is):
  ```ts
  export interface ToastAction {
    label: string;
    onClick: () => void;
    /** Button look. Default "secondary". */
    variant?: "secondary" | "outline" | "ghost";
    /** Accessible name when the label is short ("1h" → "Snooze 1 hour"). */
    ariaLabel?: string;
  }
  // ToastOptions gains:
  /** Several buttons, after `action` when both are given. Each closes the toast after it runs. */
  actions?: ToastAction[];
  ```

- [ ] **Step 1: Write the failing test**

```ts
test("toast runs one of several actions, wraps them on a phone, and closes", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 800 });
  await open(page, "toast", { renderer });
  await page.evaluate(() => {
    const w = window as unknown as { ayywi: { toast: (m: string, o: object) => void }; __ran: string[] };
    w.__ran = [];
    w.ayywi.toast("Reminder", {
      description: "Call the bank about the card",
      duration: Infinity,
      action: { label: "Open", onClick: () => w.__ran.push("open") },
      actions: [
        { label: "1h", ariaLabel: "Snooze 1 hour", variant: "outline", onClick: () => w.__ran.push("1h") },
        { label: "3h", ariaLabel: "Snooze 3 hours", variant: "outline", onClick: () => w.__ran.push("3h") },
        { label: "Tomorrow", ariaLabel: "Snooze until tomorrow", variant: "outline", onClick: () => w.__ran.push("tomorrow") },
      ],
    });
  });
  const t = page.locator(".ayy-toaster .ayy-toast", { hasText: "Reminder" });
  await settle(t);
  const buttons = t.locator(".ayy-toast__actions .ayy-button");
  await expect(buttons).toHaveText(["Open", "1h", "3h", "Tomorrow"]);
  await expect(buttons.nth(0)).toHaveClass(/ayy-button--secondary/);
  await expect(buttons.nth(1)).toHaveClass(/ayy-button--outline/);
  await expect(buttons.nth(1)).toHaveAccessibleName("Snooze 1 hour");
  expect(await t.evaluate((el) => el.scrollWidth <= el.clientWidth + 1)).toBe(true);
  await t.getByRole("button", { name: "Snooze 3 hours" }).click();
  expect(await page.evaluate(() => (window as unknown as { __ran: string[] }).__ran)).toEqual(["3h"]);
  await expect(t).toBeHidden();
});
```

- [ ] **Step 2: Run it and see it fail**

Run: `E2E_PORT=$((4200 + $$ % 300)) pnpm exec playwright test tests/e2e/interactions.spec.ts -g "several actions"`
Expected: FAIL — only "Open" is rendered.

- [ ] **Step 3: Implement**

In `showToast`, build one `.ayy-toast__actions` container when `options.action` or `options.actions?.length` is set: `action` first (unchanged markup: `ayy-button ayy-button--secondary ayy-button--sm`), then one `<button type="button">` per `actions` entry with class `ayy-button ayy-button--${variant ?? "secondary"} ayy-button--sm` and `aria-label` when `ariaLabel` is given; click runs `onClick` then `dismiss()`. A toast with only `action` must render exactly what it renders today. CSS: `.ayy-toast__actions` gets `display: flex; flex-wrap: wrap; gap: var(--ayy-space-1-5);` if it doesn't already wrap. Meta: document `actions` next to `action` with the "1h → Snooze 1 hour" example. Example: add to `TOAST_TRIGGERS` a trigger `toast("Reminder", { description: "Call the bank about the card", action: { label: "Open", onClick: () => toast("Opened") }, actions: [{ label: "1h", ariaLabel: "Snooze 1 hour", variant: "outline", onClick: () => toast("Snoozed for 1 hour") }, { label: "Tomorrow", ariaLabel: "Snooze until tomorrow", variant: "outline", onClick: () => toast("Snoozed until tomorrow") }] })`. CHANGELOG `### Changed`: `- **[Toast](#/toast)**` / `  One action button → any number of buttons (Open, then snooze times), each closing the toast.`

- [ ] **Step 4: Run the test and the existing toast tests**

Run: `E2E_PORT=$((4200 + $$ % 300)) pnpm exec playwright test tests/e2e/interactions.spec.ts -g "toast"`
Expected: PASS, including "toast appears, runs its action, and sits above a modal dialog".

- [ ] **Step 5: Full gate and commit**

Run: `pnpm build && pnpm typecheck && pnpm check && pnpm test` → all pass.
```bash
git add src/components/toast tests/e2e/interactions.spec.ts CHANGELOG.md manifest llms llms.txt llms-full.txt ai
git commit -m "Toast: several action buttons"
```

---

### Task 2: Prompt dialogs (`confirmDialog`, `choiceDialog`, `promptDialog`)

**Files:**
- Create: `src/components/dialog/dialog-prompt.ts`
- Modify: `src/index.ts` (export the three functions and their option types)
- Modify: `src/react/index.ts` (re-export them, as it re-exports `cardToast`)
- Modify: `src/elements/global.ts` (export them so `window.ayywi.confirmDialog` exists)
- Modify: `src/components/dialog/dialog.meta.json` (`js` text and one `do` line)
- Modify: `scripts/lib/contract.mjs` (`NEEDS` row "Ask to confirm, or collect a few fields over the page": append to `how`)
- Modify: `CHANGELOG.md`
- Test: Create `tests/e2e/dialog-prompt.spec.ts`

**Interfaces:**
- Consumes: `isBackdropClick(dialog, event)` from `src/components/dialog/dialog.ts`.
- Produces:
  ```ts
  export interface ConfirmDialogOptions { title: string; description?: string; confirmLabel?: string /* "OK" */; cancelLabel?: string /* "Cancel" */; destructive?: boolean }
  export interface DialogChoice<T extends string> { value: T; label: string; variant?: "primary" | "secondary" | "destructive" }
  export interface ChoiceDialogOptions<T extends string> { title: string; description?: string; cancelLabel?: string; choices: DialogChoice<T>[] }
  export interface PromptDialogOptions { title: string; description?: string; label: string; value?: string; placeholder?: string; confirmLabel?: string /* "Save" */; cancelLabel?: string; validate?: (value: string) => string | null; secret?: boolean }
  export function confirmDialog(options: ConfirmDialogOptions): Promise<boolean>;
  export function choiceDialog<T extends string>(options: ChoiceDialogOptions<T>): Promise<T | null>;
  export function promptDialog(options: PromptDialogOptions): Promise<string | null>;
  ```

**Markup each call appends to `document.body`** (ids from a module counter, `ayy-prompt-1`, `ayy-prompt-2`…):
```html
<dialog class="ayy-dialog ayy-dialog--sm" data-ayy-prompt aria-labelledby="ayy-prompt-1-title" aria-describedby="ayy-prompt-1-desc">
  <div class="ayy-dialog__header">
    <h2 class="ayy-dialog__title" id="ayy-prompt-1-title">Rename folder</h2>
    <p class="ayy-dialog__description" id="ayy-prompt-1-desc">…</p>          <!-- only with description; else no aria-describedby -->
  </div>
  <div class="ayy-dialog__body">                                              <!-- promptDialog only -->
    <div class="ayy-field">
      <label class="ayy-label" for="ayy-prompt-1-input">Name</label>
      <input class="ayy-input" id="ayy-prompt-1-input" type="text" autocomplete="off" aria-describedby="ayy-prompt-1-error">  <!-- type="password" when secret -->
      <p class="ayy-field__error" id="ayy-prompt-1-error" hidden></p>
    </div>
  </div>
  <div class="ayy-dialog__footer">
    <button type="button" class="ayy-button ayy-button--secondary">Cancel</button>
    <button type="button" class="ayy-button">OK</button>                    <!-- ayy-button ayy-button--destructive when destructive -->
  </div>
</dialog>
```
`choiceDialog` footer: Cancel, then one button per choice in order. Variant → class: `primary` → `ayy-button`, `secondary` → `ayy-button ayy-button--secondary`, `destructive` → `ayy-button ayy-button--destructive`. Default variant: the last choice `primary`, the others `secondary`.

**Rules (all three functions):**
1. No `document` (SSR): resolve at once with `false` / `null`.
2. A call while another prompt dialog is open resolves the open one with its cancel value (`false` / `null`), closes and removes it, then opens the new one.
3. `showModal()`. Initial focus: confirm → the confirm button; choice → the last choice; prompt → the input, with its whole value selected.
4. Cancel → `false` / `null`: the Cancel button, Esc (handle the `cancel` event: `preventDefault()`, then resolve), a backdrop click (`isBackdropClick`).
5. Prompt submit: the confirm button, or Enter in the input unless `event.isComposing || event.keyCode === 229`. Value = `input.value.trim()`. If `validate(value)` returns a string: put it in the error `<p>`, remove its `hidden`, set `aria-invalid="true"` on the input, keep the dialog open and focus the input. Any `input` event clears the error (`hidden` back, `aria-invalid` removed). The confirm button is `disabled` while the trimmed value is empty.
6. On resolve: `dialog.close()`, `dialog.remove()`, then focus the element that was `document.activeElement` when the call started, if it is still connected.

- [ ] **Step 1: Write the failing tests** in `tests/e2e/dialog-prompt.spec.ts`

```ts
import { expect, test, type Page } from "@playwright/test";
import { open } from "./helpers";

type W = { ayywi: Record<string, (o: object) => Promise<unknown>>; __p: Promise<unknown> };
const call = (page: Page, fn: string, options: object) =>
  page.evaluate(([fn, options]) => { const w = window as unknown as W; w.__p = w.ayywi[fn](options); }, [fn, options] as const);
const result = (page: Page) => page.evaluate(() => (window as unknown as W).__p);

test("confirmDialog resolves true on confirm, false on Esc, and gives focus back", async ({ page }) => {
  await open(page, "dialog");
  await page.evaluate(() => { const b = document.createElement("button"); b.id = "opener"; b.textContent = "Opener"; document.body.append(b); b.focus(); });
  await call(page, "confirmDialog", { title: "Delete Marketing site?", description: "This can't be undone.", confirmLabel: "Delete", destructive: true });
  const dialog = page.getByRole("dialog", { name: "Delete Marketing site?" });
  await expect(dialog).toHaveAccessibleDescription("This can't be undone.");
  const del = dialog.getByRole("button", { name: "Delete" });
  await expect(del).toBeFocused();
  await expect(del).toHaveClass(/ayy-button--destructive/);
  await del.click();
  expect(await result(page)).toBe(true);
  await expect(page.locator("dialog[data-ayy-prompt]")).toHaveCount(0);
  await expect(page.locator("#opener")).toBeFocused();

  await call(page, "confirmDialog", { title: "Leave without saving?" });
  await expect(page.getByRole("dialog", { name: "Leave without saving?" }).getByRole("button", { name: "OK" })).toBeFocused();
  await page.keyboard.press("Escape");
  expect(await result(page)).toBe(false);
});

test("choiceDialog focuses the last choice, resolves a value, and null on a backdrop click", async ({ page }) => {
  await open(page, "dialog");
  const choices = [{ value: "discard", label: "Discard", variant: "destructive" }, { value: "save", label: "Save" }];
  await call(page, "choiceDialog", { title: "Save changes to Q4 plan?", choices });
  const dialog = page.getByRole("dialog", { name: "Save changes to Q4 plan?" });
  await expect(dialog.getByRole("button", { name: "Save" })).toBeFocused();
  await expect(dialog.getByRole("button", { name: "Save" })).toHaveClass("ayy-button");
  await dialog.getByRole("button", { name: "Discard" }).click();
  expect(await result(page)).toBe("discard");
  await call(page, "choiceDialog", { title: "Save changes to Q4 plan?", choices });
  await page.mouse.click(5, 5);
  expect(await result(page)).toBeNull();
});

test("promptDialog selects the value, validates, ignores IME Enter, and resolves trimmed text", async ({ page }) => {
  await open(page, "dialog");
  await page.evaluate(() => {
    const w = window as unknown as W & { ayywi: { promptDialog: (o: object) => Promise<unknown> } };
    w.__p = w.ayywi.promptDialog({ title: "Rename folder", label: "Name", value: "Q4 launch", validate: (v: string) => (v.length > 20 ? "Keep it under 20 characters" : null) });
  });
  const dialog = page.getByRole("dialog", { name: "Rename folder" });
  const input = dialog.getByRole("textbox", { name: "Name" });
  await expect(input).toBeFocused();
  expect(await input.evaluate((el: HTMLInputElement) => [el.selectionStart, el.selectionEnd])).toEqual([0, 9]);
  await input.fill("");
  await expect(dialog.getByRole("button", { name: "Save" })).toBeDisabled();
  await input.fill("A folder name that is far too long");
  await dialog.getByRole("button", { name: "Save" }).click();
  await expect(input).toHaveAttribute("aria-invalid", "true");
  await expect(dialog.locator(".ayy-field__error")).toHaveText("Keep it under 20 characters");
  await expect(input).toHaveAccessibleDescription("Keep it under 20 characters");
  await input.fill("  Q4 plan  ");
  await expect(input).not.toHaveAttribute("aria-invalid", "true");
  await input.dispatchEvent("keydown", { key: "Enter", isComposing: true });
  await expect(dialog).toBeVisible();
  await input.press("Enter");
  expect(await result(page)).toBe("Q4 plan");
});

test("a second prompt cancels the first; secret prompts hide what is typed", async ({ page }) => {
  await open(page, "dialog");
  await page.evaluate(() => {
    const w = window as unknown as W & { __first: Promise<unknown> };
    w.__first = w.ayywi.confirmDialog({ title: "First" });
    w.__p = w.ayywi.promptDialog({ title: "Unlock vault", label: "Password", secret: true });
  });
  expect(await page.evaluate(() => (window as unknown as { __first: Promise<unknown> }).__first)).toBe(false);
  await expect(page.locator("dialog[data-ayy-prompt]")).toHaveCount(1);
  await expect(page.getByRole("dialog", { name: "Unlock vault" }).locator("input")).toHaveAttribute("type", "password");
  await page.keyboard.press("Escape");
  expect(await result(page)).toBeNull();
});
```

- [ ] **Step 2: Run and see them fail**

Run: `E2E_PORT=$((4200 + $$ % 300)) pnpm exec playwright test tests/e2e/dialog-prompt.spec.ts`
Expected: FAIL — `w.ayywi.confirmDialog is not a function`.

- [ ] **Step 3: Implement `dialog-prompt.ts`** with the three signatures above, one private `openPrompt(kind, options): Promise<string | null>` that builds the markup, and the six rules. Export from `src/index.ts`, `src/react/index.ts`, `src/elements/global.ts`. Meta `js`: one sentence per function with its resolve values. Meta `do`: "Use confirmDialog(), choiceDialog() or promptDialog() for a quick question from code (delete, discard changes, rename); compose a Dialog yourself when it needs more than one field." NEEDS `how`: append " For one question from code: await confirmDialog(), choiceDialog() or promptDialog()." CHANGELOG `### Added`: `- **[Dialog](#/dialog)**` / `  New confirmDialog(), choiceDialog() and promptDialog(): ask one question from code and await the answer.`

- [ ] **Step 4: Run the tests**

Run: `E2E_PORT=$((4200 + $$ % 300)) pnpm exec playwright test tests/e2e/dialog-prompt.spec.ts tests/e2e/interactions.spec.ts -g "dialog"`
Expected: PASS.

- [ ] **Step 5: Full gate and commit**

Run: `pnpm build && pnpm typecheck && pnpm check && pnpm test` → pass.
```bash
git add src/components/dialog src/index.ts src/react/index.ts src/elements/global.ts scripts/lib/contract.mjs tests/e2e/dialog-prompt.spec.ts CHANGELOG.md manifest llms llms.txt llms-full.txt ai
git commit -m "Dialog: confirmDialog, choiceDialog and promptDialog"
```

---

### Task 3: Find bar

**Files:**
- Create: `src/components/find-bar/find-bar.{css,ts,react.tsx,element.ts,meta.json}`, `examples/document.{tsx,html}`
- Create: `tests/node/find-bar.test.mjs`, `tests/e2e/find-bar.spec.ts`
- Modify: the new-component checklist files. `ORDER`: after `"search-bar"`. Category `Forms`. aka `["find-bar", "findbar", "find-replace", "find-and-replace", "search-replace"]`. NEEDS row: `{ need: "Find text in a document, sheet or log and step through the matches", use: ["find-bar"], how: "FindBar above the content (floating over an editor): the app finds the matches and passes current and total; Enter and Shift+Enter step, Esc closes.", not: "a Search bar with hand-made arrows and a counter" }`. Changelog line: `Find text in a page with a match count, previous and next, match case and optional replace.`

**Interfaces:**
- Produces (`find-bar.ts`):
  ```ts
  export interface FindBarLabels { find: string /* "Find" */; replaceWith: string /* "Replace with" */; previous: string /* "Previous match" */; next: string /* "Next match" */; matchCase: string /* "Match case" */; close: string /* "Close" */; replace: string /* "Replace" */; replaceAll: string /* "Replace all" */; none: string /* "No results" */; count: (current: number, total: number) => string /* `${current} of ${total}` */ }
  export const findBarLabels: FindBarLabels;
  export function findBarClass(options?: { floating?: boolean; className?: string }): string; // "ayy-find-bar" [+ " ayy-find-bar--floating"]
  export function findBarCountText(query: string, current: number, total: number, labels?: Partial<FindBarLabels>): string; // "" when query is "", labels.none when total is 0, else labels.count
  export interface FindBarHandlers { onQueryChange?(query: string, matchCase: boolean): void; onNext?(): void; onPrevious?(): void; onReplace?(replacement: string): void; onReplaceAll?(replacement: string): void; onClose?(): void }
  export interface FindBarController { setCount(current: number, total: number): void; focus(): void; destroy(): void }
  export function connectFindBar(root: HTMLElement, handlers: FindBarHandlers, labels?: Partial<FindBarLabels>): FindBarController;
  ```
- Produces (`find-bar.react.tsx`):
  ```ts
  export interface FindBarProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
    query: string; onQueryChange(query: string): void;
    matchCase?: boolean; onMatchCaseChange?(matchCase: boolean): void;   // the Aa button renders only with onMatchCaseChange
    current: number; total: number;
    onNext(): void; onPrevious(): void; onClose?(): void;                   // the close button renders only with onClose
    replace?: boolean; replacement?: string; onReplacementChange?(value: string): void; onReplace?(): void; onReplaceAll?(): void;
    floating?: boolean; autoFocus?: boolean; labels?: Partial<FindBarLabels>;
  }
  export const FindBar: ForwardRefExoticComponent<FindBarProps & RefAttributes<HTMLDivElement>>;
  ```
- Element `<ayy-find-bar>` events: `ayy-find` `{ query, matchCase }`, `ayy-find-next`, `ayy-find-previous`, `ayy-replace` `{ replacement }`, `ayy-replace-all` `{ replacement }`, `ayy-close`. Methods: `setCount(current, total)`, `focus()`.

**Markup** (React renders exactly this; parts are found by `data-ayy-find`):
```html
<div class="ayy-find-bar" role="search" aria-label="Find and replace">   <!-- "Find" without replace -->
  <div class="ayy-find-bar__row">
    <input class="ayy-input ayy-input--sm ayy-find-bar__input" data-ayy-find="query" type="text" aria-label="Find" placeholder="Find" autocomplete="off" spellcheck="false">
    <span class="ayy-find-bar__count" aria-live="polite">1 of 3</span>
    <button type="button" class="ayy-button ayy-button--ghost ayy-button--icon-sm" data-ayy-find="match-case" aria-pressed="false" aria-label="Match case">Aa</button>
    <button type="button" class="ayy-button ayy-button--ghost ayy-button--icon-sm" data-ayy-find="previous" aria-label="Previous match" aria-keyshortcuts="Shift+Enter">[ArrowUp01Icon]</button>
    <button type="button" class="ayy-button ayy-button--ghost ayy-button--icon-sm" data-ayy-find="next" aria-label="Next match" aria-keyshortcuts="Enter">[ArrowDown01Icon]</button>
    <button type="button" class="ayy-button ayy-button--ghost ayy-button--icon-sm" data-ayy-find="close" aria-label="Close" aria-keyshortcuts="Escape">[Cancel01Icon]</button>
  </div>
  <div class="ayy-find-bar__row">                                          <!-- only with replace -->
    <input class="ayy-input ayy-input--sm ayy-find-bar__input" data-ayy-find="replacement" type="text" aria-label="Replace with" placeholder="Replace with" autocomplete="off" spellcheck="false">
    <button type="button" class="ayy-button ayy-button--secondary ayy-button--sm" data-ayy-find="replace">Replace</button>
    <button type="button" class="ayy-button ayy-button--secondary ayy-button--sm" data-ayy-find="replace-all">Replace all</button>
  </div>
</div>
```
**Behaviour (both renderers):** Enter in the query input → next; Shift+Enter → previous; neither while `isComposing || keyCode === 229`. Enter in the replacement input → replace. Esc anywhere in the bar → close (`stopPropagation()` so the editor underneath doesn't also get it). The match-case button flips `aria-pressed` and re-reports the query. When total is 0: previous, next, replace and replace-all are `disabled`, and if the query is non-empty the query input gets `aria-invalid="true"`.

**CSS (classes: `ayy-find-bar`, `ayy-find-bar--floating`, `ayy-find-bar__row`, `ayy-find-bar__input`, `ayy-find-bar__count`):** bar = flex column, gap `space-1-5`, padding `space-2`, background `surface`, border-block-end 1px `line`. Row = flex, `align-items: center`, gap `space-1`, `flex-wrap: wrap`. Input = `flex: 1 1 10rem; min-inline-size: 0`. Count = `flex: none; min-inline-size: 5ch; text-align: end; color: muted; font-size: text-xs; font-variant-numeric: tabular-nums; white-space: nowrap`. Floating = `position: absolute; inset-block-start: space-2; inset-inline-end: space-2; z-index: 1; inline-size: min(28rem, calc(100% - 2 * var(--ayy-space-2))); border: 1px solid line; border-radius: radius-lg; box-shadow: shadow-overlay`. `[data-ayy-find="match-case"][aria-pressed="true"]` = background `color-mix(in srgb, var(--ayy-color-primary) 14%, transparent)`, colour `primary`; forced colors → `outline: 2px solid Highlight`.

**Example `document`:** a `Card` holding a `FindBar` (with replace, match case and close) above this paragraph, verbatim: "Launch day is Thursday. Before the launch, freeze the release branch. After the launch, watch the error dashboard for an hour." The React example keeps `text` in state, counts matches of the query (case-insensitive unless match case), keeps `current` (1-based, wrapping), Replace swaps the current match, Replace all swaps every match; Close hides the bar and shows a "Find" button that brings it back. The HTML example is the static render with `value="launch"` and count "1 of 3".

- [ ] **Step 1: Write the failing node test** `tests/node/find-bar.test.mjs`

```js
test("findBarCountText", { skip }, async () => {
  const { findBarCountText } = await import(dist("index.js"));
  assert.equal(findBarCountText("", 0, 0), "");
  assert.equal(findBarCountText("zzz", 0, 0), "No results");
  assert.equal(findBarCountText("launch", 2, 3), "2 of 3");
  assert.equal(findBarCountText("launch", 1, 3, { count: (c, t) => `${c}/${t}` }), "1/3");
});
```

- [ ] **Step 2: Write the failing e2e spec** `tests/e2e/find-bar.spec.ts`

```ts
for (const renderer of ["react", "html"] as const) {
  test.describe(`find bar (${renderer})`, () => {
    test("Enter and Shift+Enter step, IME Enter doesn't, Esc closes", async ({ page }) => {
      await open(page, "find-bar", { renderer });
      const bar = example(page, "document").locator(".ayy-find-bar");
      const query = bar.getByRole("textbox", { name: "Find" });
      if (renderer === "html") {
        await page.evaluate(() => { const w = window as unknown as { __find: string[] }; w.__find = []; for (const t of ["ayy-find-next", "ayy-find-previous", "ayy-close"]) document.addEventListener(t, () => w.__find.push(t)); });
      }
      await keyboardFocus(query);
      if (renderer === "react") await query.fill("launch");
      const count = bar.locator(".ayy-find-bar__count");
      await expect(count).toHaveText("1 of 3");
      await query.press("Enter");
      await query.dispatchEvent("keydown", { key: "Enter", isComposing: true });
      await query.press("Shift+Enter");
      await query.press("Shift+Enter");
      if (renderer === "react") await expect(count).toHaveText("3 of 3");
      await query.press("Escape");
      if (renderer === "html") expect(await page.evaluate(() => (window as unknown as { __find: string[] }).__find)).toEqual(["ayy-find-next", "ayy-find-previous", "ayy-find-previous", "ayy-close"]);
      else await expect(bar).toBeHidden();
    });

    test("fits a phone and mirrors in RTL", async ({ page }) => {
      await page.setViewportSize({ width: 320, height: 700 });
      await open(page, "find-bar", { renderer });
      const stageEl = example(page, "document");
      const bar = stageEl.locator(".ayy-find-bar");
      expect(await bar.evaluate((el) => el.scrollWidth <= el.clientWidth + 1)).toBe(true);
      await rtl(stageEl);
      const close = await bar.getByRole("button", { name: "Close" }).boundingBox();
      const query = await bar.getByRole("textbox", { name: "Find" }).boundingBox();
      expect(close!.x).toBeLessThan(query!.x);
    });
  });
}

test("find bar (react): no results, match case and replace all", async ({ page }) => {
  await open(page, "find-bar", { renderer: "react" });
  const ex = example(page, "document");
  const bar = ex.locator(".ayy-find-bar");
  const query = bar.getByRole("textbox", { name: "Find" });
  await query.fill("zzz");
  await expect(bar.locator(".ayy-find-bar__count")).toHaveText("No results");
  await expect(query).toHaveAttribute("aria-invalid", "true");
  await expect(bar.getByRole("button", { name: "Next match" })).toBeDisabled();
  await query.fill("Launch");
  await bar.getByRole("button", { name: "Match case" }).click();
  await expect(bar.getByRole("button", { name: "Match case" })).toHaveAttribute("aria-pressed", "true");
  await expect(bar.locator(".ayy-find-bar__count")).toHaveText("1 of 1");
  await bar.getByRole("button", { name: "Match case" }).click();
  await bar.getByRole("textbox", { name: "Replace with" }).fill("rollout");
  await bar.getByRole("button", { name: "Replace all" }).click();
  await expect(bar.locator(".ayy-find-bar__count")).toHaveText("No results");
  await expect(ex).toContainText("Before the rollout, freeze the release branch.");
});
```

- [ ] **Step 3: Run both and see them fail** (`pnpm build && node --test tests/node/find-bar.test.mjs`; the e2e command) — expected: missing export / route not found.

- [ ] **Step 4: Implement** the helper, CSS, React component, element and example per the contract above. Then the checklist items (index.css, exports, element registration and lists, ORDER, NEEDS, README row + count 85, CHANGELOG, meta). Meta states: `hover`/`pressed`/`focus`/`disabled` from the Buttons and Input it uses, `selected` = match case `aria-pressed="true"`, `error` = query `aria-invalid="true"` with no results, `loading` none ("the app counts matches; show the old count until the new one arrives").

- [ ] **Step 5: Run the node test, the e2e spec and the full gate** — all pass.

- [ ] **Step 6: Commit**
```bash
git add src/components/find-bar src/css/index.css src/index.ts src/react/index.ts src/elements/index.ts scripts/lib/contract.mjs AGENTS.md ai README.md CHANGELOG.md tests/node/find-bar.test.mjs tests/e2e/find-bar.spec.ts manifest llms llms.txt llms-full.txt
git commit -m "Find bar: match count, previous and next, match case and replace"
```

---

### Task 4: Checklist

**Files:**
- Create: `src/components/checklist/checklist.{css,ts,react.tsx,element.ts,meta.json}`, `examples/packing.{tsx,html}`
- Create: `tests/node/checklist.test.mjs`, `tests/e2e/checklist.spec.ts`
- Modify: `tests/e2e/regressions.spec.ts` (one `reactPage` test)
- Modify: the new-component checklist files. `ORDER`: after `"checkbox"`. Category `Forms`. aka `["checklist", "check-list", "todo-list"]`. NEEDS row: `{ need: "An editable list of things to tick off (packing list, release steps, subtasks)", use: ["checklist"], how: "Checklist: Enter adds the next item, Backspace on an empty one removes it, a count and progress on top.", not: "Checkboxes next to hand-wired inputs" }`. Changelog line: `An editable list to tick off: Enter adds, Backspace on an empty item removes, with a count and progress.`

**Interfaces:**
- Produces (`checklist.ts`, pure functions return new arrays and never mutate their input):
  ```ts
  export interface ChecklistItem { id: string; text: string; done: boolean }
  export interface ChecklistLabels { add: string /* "Add an item" */; item: string /* "Edit item" */; untitled: string /* "Untitled item" */; remove: (text: string) => string /* `Remove ${text}` */; count: (done: number, total: number) => string /* `${done} of ${total} done` */ }
  export const checklistLabels: ChecklistLabels;
  export function checklistProgress(items: readonly ChecklistItem[]): { done: number; total: number; percent: number }; // percent = Math.round(done / total * 100), 0 when empty
  export function checklistInsert(items: readonly ChecklistItem[], afterId: string | null, item: ChecklistItem): ChecklistItem[]; // null → at the end
  export function checklistRemove(items: readonly ChecklistItem[], id: string): { items: ChecklistItem[]; focusId: string | null }; // focus the previous item, else the next, else null
  export function checklistMove(items: readonly ChecklistItem[], id: string, delta: -1 | 1): ChecklistItem[]; // no-op at either end
  export function checklistUpdate(items: readonly ChecklistItem[], id: string, patch: Partial<Omit<ChecklistItem, "id">>): ChecklistItem[];
  export interface ChecklistController { items(): ChecklistItem[]; setItems(items: ChecklistItem[]): void; destroy(): void }
  export function connectChecklist(root: HTMLElement, options?: { onChange?(items: ChecklistItem[]): void; createId?(): string; labels?: Partial<ChecklistLabels> }): ChecklistController;
  ```
- Produces (`checklist.react.tsx`):
  ```ts
  export interface ChecklistProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
    items: ChecklistItem[]; onItemsChange(items: ChecklistItem[]): void;
    label: string;               // the list's accessible name
    showProgress?: boolean;      // default true
    createId?(): string;         // default crypto.randomUUID()
    labels?: Partial<ChecklistLabels>;
  }
  export const Checklist: ForwardRefExoticComponent<ChecklistProps & RefAttributes<HTMLDivElement>>;
  ```
- Element `<ayy-checklist>`: reads the initial items from the markup (`li[data-id]`: checkbox `checked`, text `value`), emits `ayy-change` `{ items }` after every change; property `items` (get/set).

**Markup:**
```html
<div class="ayy-checklist">
  <div class="ayy-checklist__header">                                 <!-- hidden attribute when there are no items; omitted when showProgress is false -->
    <span class="ayy-checklist__count" id="X-count">2 of 4 done</span>
    <div class="ayy-progress ayy-progress--sm ayy-checklist__progress" role="progressbar" aria-labelledby="X-count" aria-valuemin="0" aria-valuemax="100" aria-valuenow="50" style="--ayy-value: 50"><div class="ayy-progress__bar"></div></div>
  </div>
  <ul class="ayy-checklist__items" aria-label="Packing list">
    <li class="ayy-checklist__item" data-id="passport">
      <input type="checkbox" class="ayy-checkbox" aria-label="Passport" checked>          <!-- aria-label = text, or labels.untitled when empty -->
      <input type="text" class="ayy-checklist__text" aria-label="Edit item" value="Passport">
      <button type="button" class="ayy-button ayy-button--ghost ayy-button--icon-sm ayy-checklist__remove" aria-label="Remove Passport">[Cancel01Icon]</button>
    </li>
  </ul>
  <input type="text" class="ayy-checklist__text ayy-checklist__new" aria-label="Add an item" placeholder="Add an item">
</div>
```
**Keyboard (both renderers; `connectChecklist` re-renders the `<ul>` from items with the same markup, then focuses by id):**
- Enter in an item's text (not composing) → insert `{ id: createId(), text: "", done: false }` after it; focus the new text.
- Enter in the new-item field with non-empty trimmed text → append it, clear the field, keep focus there. Empty → nothing.
- Backspace in an item's text whose value is `""` → `preventDefault()`, remove it, focus `focusId`'s text with the caret at the end, or the new-item field when `focusId` is null.
- ArrowUp / ArrowDown in any `.ayy-checklist__text` → the previous / next text (the new-item field is last), caret at the end.
- Alt+ArrowUp / Alt+ArrowDown in an item's text → move it; focus stays in it.
- Typing in an item's text updates its `text` on every `input` event; the checkbox `change` updates `done`.

**CSS (classes: `ayy-checklist`, `__header`, `__count`, `__progress`, `__items`, `__item`, `__text`, `__new`, `__remove`):** root flex column gap `space-2`. Header flex, `align-items: center`, gap `space-3`; count `font-size: text-xs; color: muted; white-space: nowrap`; progress `flex: 1`. Items list `margin: 0; padding: 0; list-style: none`. Item flex, `align-items: center`, gap `space-2`, padding-block `space-0-5`. Text `flex: 1; min-inline-size: 0; border: 0; background: transparent; color: inherit; font: inherit; padding-block: var(--ayy-space-1); text-overflow: ellipsis`, `:focus-visible` ring with `outline-offset: 0`, `::placeholder` muted. Done: `.ayy-checklist__item:has(> .ayy-checkbox:checked) .ayy-checklist__text { color: var(--ayy-color-muted); text-decoration: line-through; }`. Remove: `opacity: 0`, `1` on item `:hover`, `:focus-within`, and always under `@media (hover: none)`. New-item field: `padding-inline-start: calc(var(--ayy-size-check, 1rem) + var(--ayy-space-2))` so it lines up with the texts (check the checkbox's size token name in `checkbox.css`).

**Example `packing`:** label "Packing list"; items Passport (done), Charger (done), Rain jacket, Travel adapter; ids `passport`, `charger`, `jacket`, `adapter`.

- [ ] **Step 1: Write the failing node test** `tests/node/checklist.test.mjs`

```js
test("checklist pure functions", { skip }, async () => {
  const { checklistProgress, checklistInsert, checklistRemove, checklistMove, checklistUpdate } = await import(dist("index.js"));
  const items = [{ id: "a", text: "A", done: true }, { id: "b", text: "B", done: false }, { id: "c", text: "C", done: false }];
  assert.deepEqual(checklistProgress(items), { done: 1, total: 3, percent: 33 });
  assert.deepEqual(checklistProgress([]), { done: 0, total: 0, percent: 0 });
  assert.deepEqual(checklistInsert(items, "a", { id: "n", text: "", done: false }).map((i) => i.id), ["a", "n", "b", "c"]);
  assert.deepEqual(checklistInsert(items, null, { id: "n", text: "", done: false }).map((i) => i.id), ["a", "b", "c", "n"]);
  assert.deepEqual(checklistRemove(items, "b"), { items: [items[0], items[2]], focusId: "a" });
  assert.deepEqual(checklistRemove(items, "a").focusId, "b");
  assert.deepEqual(checklistRemove([items[0]], "a").focusId, null);
  assert.deepEqual(checklistMove(items, "c", -1).map((i) => i.id), ["a", "c", "b"]);
  assert.deepEqual(checklistMove(items, "a", -1).map((i) => i.id), ["a", "b", "c"]);
  assert.equal(checklistUpdate(items, "b", { done: true })[1].done, true);
  assert.equal(items[1].done, false);
});
```

- [ ] **Step 2: Write the failing e2e spec** `tests/e2e/checklist.spec.ts`

```ts
const texts = (ex: Locator) => ex.locator(".ayy-checklist__item .ayy-checklist__text").evaluateAll((els) => els.map((e) => (e as HTMLInputElement).value));

for (const renderer of ["react", "html"] as const) {
  test.describe(`checklist (${renderer})`, () => {
    test("Enter adds after, Backspace on empty removes, IME Enter does nothing", async ({ page }) => {
      await open(page, "checklist", { renderer });
      const ex = example(page, "packing");
      const charger = ex.locator('[data-id="charger"] .ayy-checklist__text');
      await keyboardFocus(charger);
      await charger.dispatchEvent("keydown", { key: "Enter", isComposing: true });
      expect(await texts(ex)).toEqual(["Passport", "Charger", "Rain jacket", "Travel adapter"]);
      await charger.press("Enter");
      await page.keyboard.type("Headphones");
      expect(await texts(ex)).toEqual(["Passport", "Charger", "Headphones", "Rain jacket", "Travel adapter"]);
      await expect(ex.locator(".ayy-checklist__count")).toHaveText("2 of 5 done");
      await page.keyboard.press("ControlOrMeta+A");
      await page.keyboard.press("Backspace");
      await page.keyboard.press("Backspace");
      expect(await texts(ex)).toEqual(["Passport", "Charger", "Rain jacket", "Travel adapter"]);
      await expect(charger).toBeFocused();
      expect(await charger.evaluate((el: HTMLInputElement) => el.selectionStart)).toBe(7);
    });

    test("the new-item field appends; ticking updates count and progress; Alt+ArrowUp moves", async ({ page }) => {
      await open(page, "checklist", { renderer });
      const ex = example(page, "packing");
      const add = ex.getByRole("textbox", { name: "Add an item" });
      await add.fill("Snacks");
      await add.press("Enter");
      await expect(add).toHaveValue("");
      await expect(add).toBeFocused();
      expect((await texts(ex)).at(-1)).toBe("Snacks");
      await ex.getByRole("checkbox", { name: "Rain jacket" }).check();
      await expect(ex.locator(".ayy-checklist__count")).toHaveText("3 of 5 done");
      await expect(ex.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "60");
      const jacket = ex.locator('[data-id="jacket"] .ayy-checklist__text');
      expect(await jacket.evaluate((el) => getComputedStyle(el).textDecorationLine)).toContain("line-through");
      await jacket.press("Alt+ArrowUp");
      expect((await texts(ex)).slice(0, 3)).toEqual(["Passport", "Rain jacket", "Charger"]);
      await expect(jacket).toBeFocused();
    });

    test("a long item fits a phone", async ({ page }) => {
      await page.setViewportSize({ width: 320, height: 700 });
      await open(page, "checklist", { renderer });
      const ex = example(page, "packing");
      const add = ex.getByRole("textbox", { name: "Add an item" });
      await add.fill("Universal travel adapter with two USB-C ports and a spare fuse for the hotel in Lisbon");
      await add.press("Enter");
      expect(await ex.locator(".ayy-checklist").evaluate((el) => el.scrollWidth <= el.clientWidth + 1)).toBe(true);
    });
  });
}

```
And in `tests/e2e/regressions.spec.ts`, next to the other `reactPage` tests:
```ts
test("React Checklist: items replaced by the parent win over the ones typed", async ({ page }) => {
  await reactPage(
    page,
    `import { useState } from "react";
    import { Checklist, Button } from "ayywi";
    const start = [{ id: "a", text: "Passport", done: false }];
    function App() {
      const [items, setItems] = useState(start);
      return <div><Checklist label="Packing list" items={items} onItemsChange={setItems} /><Button onClick={() => setItems(start)}>Reset</Button></div>;
    }`,
  );
  await page.getByRole("textbox", { name: "Add an item" }).fill("Snacks");
  await page.getByRole("textbox", { name: "Add an item" }).press("Enter");
  await expect(page.locator(".ayy-checklist__item")).toHaveCount(2);
  await page.getByRole("button", { name: "Reset" }).click();
  await expect(page.locator(".ayy-checklist__item")).toHaveCount(1);
  await expect(page.locator(".ayy-checklist__count")).toHaveText("0 of 1 done");
});
```

- [ ] **Step 3: Run both and see them fail.**

- [ ] **Step 4: Implement** the pure functions, `connectChecklist`, CSS, React (`useLayoutEffect` focuses a pending `{ id, caret: "end" }` after each render), element and example; then the checklist items (README count 86). Meta states: `hover` = remove button shows; `focus` = ring on text, checkbox and remove; `selected` = `:checked` item (muted, struck through); `disabled`, `error`, `loading` → none with reasons.

- [ ] **Step 5: Run the node test, the e2e spec and the full gate** — all pass.

- [ ] **Step 6: Commit**
```bash
git add src/components/checklist src/css/index.css src/index.ts src/react/index.ts src/elements/index.ts scripts/lib/contract.mjs AGENTS.md ai README.md CHANGELOG.md tests/node/checklist.test.mjs tests/e2e/checklist.spec.ts tests/e2e/regressions.spec.ts manifest llms llms.txt llms-full.txt
git commit -m "Checklist: editable list with count and progress"
```

---

### Task 5: Board

**Files:**
- Create: `src/components/board/board.{css,ts,react.tsx,meta.json}`, `examples/release.{tsx,html}` (no `.element.ts`: the HTML version drags through `<ayy-drag-drop>`)
- Modify: `src/components/drag-drop/examples/board.{tsx,html}` — replace the inline-style layout with Board components, same columns, cards and `accepts`
- Create: `tests/e2e/board.spec.ts`
- Modify: the new-component checklist files except element registration. `ORDER`: after `"table"`. Category `Data display`. aka `["board", "kanban", "kanban-board", "pipeline"]`. Public hook `--ayy-board-column-width`. NEEDS row: `{ need: "Cards grouped into columns by status or stage (kanban, pipeline)", use: ["board"], how: "Board with a BoardColumn per stage and BoardCards; pass onMove to drag cards between columns (Drag and drop does the moving).", not: "flex columns of Cards with inline styles" }`. Changelog line: `Columns of cards by status or stage, with counts, empty columns, an add button and drag between columns.`

**Interfaces:**
- Consumes: `DragDropArea`, `DropTarget`, `SortableItem`, `type DragMove`, `type DragDropAreaProps` from `src/components/drag-drop/drag-drop.react.tsx`.
- Produces (`board.ts`): `export function boardClass(options?: { className?: string }): string`, plus `boardColumnClass = "ayy-board__column"` etc. for every class.
- Produces (`board.react.tsx`):
  ```ts
  export interface BoardProps extends HTMLAttributes<HTMLDivElement> { onMove?: (move: DragMove) => void; accepts?: DragDropAreaProps["accepts"] }
  // onMove given → renders <DragDropArea handle={false} onMove accepts className="ayy-board">; else a plain <div className="ayy-board">.
  export interface BoardColumnProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
    id: string; title: ReactNode; count?: number; icon?: ReactNode; actions?: ReactNode;
    emptyText?: ReactNode /* "No cards" */; accepts?: string /* data-accepts on the list */;
    onAdd?: () => void; addLabel?: string /* "Add card" */; footer?: ReactNode /* replaces the add button */;
  }
  export interface BoardCardProps extends HTMLAttributes<HTMLLIElement> { id: string; selected?: boolean; type?: string /* data-type, read by accepts */ }
  export const Board, BoardColumn, BoardCard; // forwardRef each
  ```

**Markup:**
```html
<ayy-drag-drop areas=".ayy-drop-target">                                  <!-- HTML only, for dragging -->
<div class="ayy-board">
  <section class="ayy-board__column" aria-labelledby="X-todo">
    <header class="ayy-board__header">
      [icon]
      <h3 class="ayy-board__title" id="X-todo">To do</h3>
      <span class="ayy-board__count">3</span>
      <div class="ayy-board__actions">[actions]</div>                       <!-- only with actions -->
    </header>
    <ul class="ayy-drop-target ayy-sortable ayy-board__cards" data-id="todo" aria-labelledby="X-todo">
      <li class="ayy-draggable ayy-sortable__item ayy-card ayy-card--interactive ayy-board__card" data-id="c-1" tabindex="0">…</li>   <!-- + ayy-card--featured and aria-current="true" when selected -->
      <li class="ayy-board__empty">No cards</li>                               <!-- instead of cards when there are none -->
    </ul>
    <button type="button" class="ayy-button ayy-button--ghost ayy-button--sm ayy-board__add">[PlusSignIcon] Add card</button>   <!-- only with onAdd -->
  </section>
</div>
</ayy-drag-drop>
```
**CSS (classes: `ayy-board`, `__column`, `__header`, `__title`, `__count`, `__actions`, `__cards`, `__card`, `__empty`, `__add`):** board `display: flex; align-items: flex-start; gap: space-3; overflow-x: auto; overscroll-behavior-inline: contain; scroll-snap-type: inline proximity; padding-block-end: space-2; min-block-size: 0`. Column `display: flex; flex-direction: column; flex: none; inline-size: var(--ayy-board-column-width, 17rem); max-block-size: 100%; border-radius: radius-xl; background-color: color-mix(in srgb, var(--ayy-color-text) 3%, transparent); scroll-snap-align: start`. Header flex, `align-items: center`, gap `space-1-5`, padding `space-3 space-3 space-2`. Title `margin: 0; font-size: text-sm; font-weight: semibold; min-inline-size: 0; overflow-wrap: anywhere`. Count `color: muted; font-size: text-xs; font-variant-numeric: tabular-nums`. Actions `margin-inline-start: auto`. Cards `display: flex; flex-direction: column; gap: space-2; min-block-size: 3rem; margin: 0; padding: 2px space-2 space-2; list-style: none; overflow-y: auto`. Card `padding: space-2 space-3; display: flex; flex-direction: column; gap: space-1-5; cursor: grab; overflow-wrap: anywhere`. Empty `padding: space-4 space-2; border: 1px dashed line; border-radius: radius-lg; color: muted; font-size: text-xs; text-align: center`. Add `justify-content: flex-start; margin: 0 space-2 space-2`. No colour-only state is new here (selection is Card's `--featured`), so no forced-colors block unless `pnpm check` asks.

**Example `release`:** aria-label on the board `"Release board"`. Columns: `todo` "To do" — cards "Write release notes" (`c-1`), "Fix tooltip flicker" (`c-2`), "Update screenshots" (`c-3`); `doing` "In progress" — "Table column reordering" (`c-4`); `done` "Done" — no cards, `emptyText` "Drop cards here". Each card: the title in a `<span>` plus a muted Badge ("Docs", "Bug", "Docs", "Feature"). React: state of columns; `onMove` splices like the current drag-drop board example; `onAdd` on every column appends `{ id: "new-" + n, title: "New card" }`. HTML: static render inside `<ayy-drag-drop areas=".ayy-drop-target">`.

- [ ] **Step 1: Write the failing e2e spec** `tests/e2e/board.spec.ts`

```ts
const counts = (ex: Locator) => ex.locator(".ayy-board__count").allTextContents();

for (const renderer of ["react", "html"] as const) {
  test.describe(`board (${renderer})`, () => {
    test("columns, counts and the empty column", async ({ page }) => {
      await open(page, "board", { renderer });
      const ex = example(page, "release");
      await expect(ex.getByRole("heading", { level: 3 })).toHaveText(["To do", "In progress", "Done"]);
      expect(await counts(ex)).toEqual(["3", "1", "0"]);
      await expect(ex.locator('[data-id="done"] .ayy-board__empty')).toHaveText("Drop cards here");
    });

    test("Alt+ArrowRight moves a focused card to the next column", async ({ page }) => {
      await open(page, "board", { renderer });
      const ex = example(page, "release");
      const card = ex.locator('[data-id="c-2"]');
      await keyboardFocus(card);
      await page.keyboard.press("Alt+ArrowRight");
      await expect(ex.locator('[data-id="doing"] [data-id="c-2"]')).toHaveCount(1);
      if (renderer === "react") expect(await counts(ex)).toEqual(["2", "2", "0"]);
    });

    test("scrolls sideways on a phone without scrolling the page; RTL starts on the right", async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 800 });
      await open(page, "board", { renderer });
      const ex = example(page, "release");
      const board = ex.locator(".ayy-board");
      expect(await board.evaluate((el) => el.scrollWidth > el.clientWidth)).toBe(true);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
      await rtl(ex);
      const first = await ex.locator(".ayy-board__column").first().boundingBox();
      const second = await ex.locator(".ayy-board__column").nth(1).boundingBox();
      expect(first!.x).toBeGreaterThan(second!.x);
    });
  });
}

test("board (react): Add card appends to that column", async ({ page }) => {
  await open(page, "board", { renderer: "react" });
  const ex = example(page, "release");
  await ex.locator('section:has([data-id="done"])').getByRole("button", { name: "Add card" }).click();
  expect(await counts(ex)).toEqual(["3", "1", "1"]);
  await expect(ex.locator('[data-id="done"] .ayy-board__empty')).toHaveCount(0);
});
```
If Drag and drop doesn't move a focused plain item with Alt+ArrowRight across areas, stop and report it (`BLOCKED`) instead of adding key handling to Board; the controller rules on it.

- [ ] **Step 2: Run and see it fail.**

- [ ] **Step 3: Implement** CSS, helper, React and the example; rewrite the drag-drop `board` example on Board (keep its `QA (Features only)` column with `accepts="feature"`); then the checklist items (README count 87, no element). Meta states: `hover`/`pressed`/`focus`/`selected` from Card (`--interactive`, `--featured` + `aria-current`); drop states from Drag and drop; `disabled`, `error`, `loading` → none with reasons (loading: "show Skeleton cards in the column").

- [ ] **Step 4: Run** the board spec plus `tests/e2e/drag-drop.spec.ts`, and the full gate — all pass.

- [ ] **Step 5: Commit**
```bash
git add src/components/board src/components/drag-drop/examples src/css/index.css src/index.ts src/react/index.ts scripts/lib/contract.mjs README.md CHANGELOG.md tests/e2e/board.spec.ts manifest llms llms.txt llms-full.txt ai
git commit -m "Board: columns of cards with counts, empty state, add and drag"
```

---

### Task 6: Event calendar — the month

**Files:**
- Create: `src/components/event-calendar/event-calendar.{css,ts,react.tsx,element.ts,meta.json}`, `examples/schedule.{tsx,html}`
- Create: `tests/node/event-calendar.test.mjs`, `tests/e2e/event-calendar.spec.ts`
- Modify: `tests/e2e/regressions.spec.ts` (one `reactPage` test)
- Modify: the new-component checklist files. `ORDER`: after `"board"`. Category `Data display`. aka `["event-calendar", "month-view", "schedule-view", "agenda-month"]` (not `calendar`: Date picker owns it). Public hook `--ayy-event-color`. NEEDS row: `{ need: "Show records on the days they happen (events, deadlines, posts)", use: ["event-calendar"], how: "EventCalendar with events { id, date, title, time?, color? }; onAddEvent adds a + per day, onEventClick opens one.", not: "a Date picker grid with dots, or a hand-built 7-column grid" }`. Changelog line: `A month of events on their days, with today, other months' days, an add button per day and selection.`

**Interfaces:**
- Consumes: `datePickerMonth`, `datePickerLabels`, `startOfMonth`, `addMonths`, `todayIso`, `type Weekday` from `src/components/date-time-picker/date-time-picker.ts`.
- Produces (`event-calendar.ts`):
  ```ts
  export interface EventCalendarEvent { id: string; date: string; title: string; time?: string /* "09:30" */; color?: string /* e.g. "var(--ayy-chart-2)" */; done?: boolean }
  export interface EventCalendarDay { date: string; day: number; outside: boolean; today: boolean; events: EventCalendarEvent[] }
  export function eventCalendarMonth(options: { month: string; events: readonly EventCalendarEvent[]; today?: string; weekStart?: Weekday }): EventCalendarDay[];
  // 42 days from datePickerMonth. Each day's events: not done before done; within each, no time before timed; timed by time ascending; ties keep input order.
  export interface EventCalendarLabels { previous: string /* "Previous month" */; next: string /* "Next month" */; today: string /* "Today" */; add: (day: string) => string /* `Add an event on ${day}` */; events: (count: number) => string /* "", "1 event", `${n} events` */; more: (count: number) => string /* `+${n} more` (Task 7) */ }
  export const eventCalendarLabels: EventCalendarLabels;
  export function eventCalendarClass(options?: { className?: string }): string;
  export interface EventCalendarHandlers { onMonthChange?(month: string): void; onAddEvent?(date: string): void; onEventClick?(id: string): void }
  export function connectEventCalendar(root: HTMLElement, handlers: EventCalendarHandlers): () => void; // returns cleanup
  ```
- Produces (`event-calendar.react.tsx`):
  ```ts
  export interface EventCalendarProps extends Omit<HTMLAttributes<HTMLElement>, "onChange"> {
    events: EventCalendarEvent[];
    month?: string; defaultMonth?: string; onMonthChange?(month: string): void;   // first of the month; controlled when month is set
    today?: string; weekStart?: Weekday; locale?: string;
    selectedId?: string | null; onEventClick?(id: string): void;
    onAddEvent?(date: string): void;                                          // the + per day renders only with it
    labels?: Partial<EventCalendarLabels>;
  }
  export const EventCalendar: ForwardRefExoticComponent<EventCalendarProps & RefAttributes<HTMLElement>>;
  ```
- Element `<ayy-event-calendar>` (wraps author markup; does not redraw days — a server template or framework loop renders the new month): clicks on `[data-ayy-calendar="previous|next|today"]` update the root's `data-month` and emit `ayy-month-change` `{ month }`; `[data-ayy-calendar="add"]` emits `ayy-add-event` `{ date }` (from the closest day's `data-date`); `.ayy-event-calendar__event` emits `ayy-event-click` `{ id }`.

**Markup** (labels from `datePickerLabels(locale)`: title `month(iso)`, weekday names `weekdays(weekStart)`, day names `day(iso)`):
```html
<section class="ayy-event-calendar" aria-labelledby="X-title" data-month="2026-10-01" data-today="2026-10-14">   <!-- data-today only when the today prop is set; the element's Today button uses it, else todayIso() -->
  <header class="ayy-event-calendar__header">
    <h2 class="ayy-event-calendar__title" id="X-title" aria-live="polite">October 2026</h2>
    <div class="ayy-event-calendar__nav">
      <button type="button" class="ayy-button ayy-button--ghost ayy-button--icon-sm" data-ayy-calendar="previous" aria-label="Previous month">[ArrowLeft01Icon, class ayy-icon--directional]</button>
      <button type="button" class="ayy-button ayy-button--secondary ayy-button--sm" data-ayy-calendar="today">Today</button>
      <button type="button" class="ayy-button ayy-button--ghost ayy-button--icon-sm" data-ayy-calendar="next" aria-label="Next month">[ArrowRight01Icon, class ayy-icon--directional]</button>
    </div>
  </header>
  <div class="ayy-event-calendar__weekdays" aria-hidden="true"><span>Mon</span>…(7)</div>
  <ol class="ayy-event-calendar__grid" aria-labelledby="X-title">
    <li class="ayy-event-calendar__day" data-date="2026-10-14" aria-current="date" aria-label="Wednesday, October 14, 2026, 2 events">   <!-- data-outside on other months' days; aria-current only on today; the label ends at the date when there are no events -->
      <div class="ayy-event-calendar__day-head">
        <span class="ayy-event-calendar__date" aria-hidden="true">14</span>
        <button type="button" class="ayy-event-calendar__add" data-ayy-calendar="add" aria-label="Add an event on Wednesday, October 14, 2026">[PlusSignIcon]</button>   <!-- only with onAddEvent -->
      </div>
      <ul class="ayy-event-calendar__events">
        <li><button type="button" class="ayy-event-calendar__event" data-id="e1" aria-current="true" style="--ayy-event-color: var(--ayy-chart-1)">   <!-- aria-current only when selected; data-done when done -->
          <span class="ayy-event-calendar__time">09:30</span><span class="ayy-event-calendar__event-title">Design review</span>
        </button></li>
      </ul>
    </li>
  </ol>
</section>
```
**CSS (classes: `ayy-event-calendar`, `__header`, `__title`, `__nav`, `__weekdays`, `__grid`, `__day`, `__day-head`, `__date`, `__add`, `__events`, `__event`, `__time`, `__event-title`; Task 7 adds `__more`, `__popover-list`):** root flex column gap `space-2`, `block-size: 100%` (fills an app's main area; rows then share its height), `min-block-size: 0`. Header flex, space-between, `align-items: center`. Title `margin: 0; font-size: text-sm; font-weight: semibold`. Nav flex gap `space-1`. Weekdays: `display: grid; grid-template-columns: repeat(7, minmax(0, 1fr))`, `font-size: text-xs; color: muted`, each `padding-inline: space-1-5`. Grid: same columns, `grid-auto-rows: minmax(6.5rem, 1fr); flex: 1; margin: 0; padding: 0; list-style: none; border-block-start: 1px solid line; border-inline-start: 1px solid line`. Day: `display: flex; flex-direction: column; gap: 2px; min-inline-size: 0; overflow: hidden; padding: space-1; border-block-end: 1px solid line; border-inline-end: 1px solid line`. `[data-outside]` day: `background-color: color-mix(in srgb, var(--ayy-color-text) 2.5%, transparent)`, date muted. Date: `display: inline-grid; place-items: center; min-inline-size: 1.5rem; block-size: 1.5rem; border-radius: radius-pill; font-size: text-xs; font-variant-numeric: tabular-nums`; today's date: background `primary`, colour `primary-fg`, semibold. Add: `margin-inline-start: auto; opacity: 0` → `1` on day `:hover`/`:focus-within`, always under `@media (hover: none)`; reuse `ayy-button ayy-button--ghost ayy-button--icon-sm` classes in the markup if `pnpm check` rejects a bare button style (then the CSS only sets opacity/margin). Events: `display: flex; flex-direction: column; gap: 2px; margin: 0; padding: 0; list-style: none; min-block-size: 0; flex: 1`. Event: `display: flex; align-items: center; gap: space-1; inline-size: 100%; padding: 1px space-1-5; border: 0; border-inline-start: 3px solid var(--ayy-event-color, var(--ayy-color-primary)); border-radius: radius-sm; background-color: color-mix(in srgb, var(--ayy-event-color, var(--ayy-color-primary)) 14%, transparent); color: text; font: inherit; font-size: text-xs; text-align: start; white-space: nowrap; overflow: hidden; cursor: pointer`. Event title `overflow: hidden; text-overflow: ellipsis; min-inline-size: 0`. Time `color: muted; font-variant-numeric: tabular-nums`, hidden below `48rem`. `[aria-current="true"]` event: `box-shadow: inset 0 0 0 1.5px var(--ayy-event-color, var(--ayy-color-primary))`. `[data-done]` event: title struck through, `opacity: 0.65`. Forced colors: today's date `background: Highlight; color: HighlightText`; selected event `outline: 2px solid Highlight`; event border `CanvasText`.

**Example `schedule`** (React keeps month, selection and events in state; `locale="en-US"`, `today="2026-10-14"`, `weekStart={1}`, starting month `2026-10-01`; onAddEvent appends `{ id: "new-" + n, date, title: "New event" }`; onEventClick toggles selection; starts with `e1` selected):

| id | date | title | time | color | done |
| --- | --- | --- | --- | --- | --- |
| e1 | 2026-10-14 | Design review | 09:30 | `var(--ayy-chart-1)` | |
| e2 | 2026-10-14 | Ship v0.2 | | `var(--ayy-chart-2)` | |
| e3 | 2026-10-02 | Quarterly planning with the whole product and design team | | `var(--ayy-chart-3)` | |
| e4 | 2026-10-21 | Standup | 09:00 | `var(--ayy-chart-4)` | |
| e5 | 2026-10-21 | 1:1 with Sam | 11:00 | `var(--ayy-chart-1)` | |
| e6 | 2026-10-21 | Lunch with Priya | 12:30 | `var(--ayy-chart-2)` | |
| e7 | 2026-10-21 | Budget sync | 15:00 | `var(--ayy-chart-3)` | |
| e8 | 2026-10-21 | Dentist | 16:00 | `var(--ayy-chart-4)` | yes |
| e9 | 2026-10-30 | Release notes | | `var(--ayy-chart-1)` | |
| e10 | 2026-11-02 | Retro | | `var(--ayy-chart-2)` | |

The HTML example is the static render of the starting state.

- [ ] **Step 1: Write the failing node test** `tests/node/event-calendar.test.mjs`

```js
test("eventCalendarMonth lays out 42 days and sorts each day's events", { skip }, async () => {
  const { eventCalendarMonth } = await import(dist("index.js"));
  const events = [
    { id: "a", date: "2026-10-14", title: "Design review", time: "09:30" },
    { id: "b", date: "2026-10-14", title: "Ship v0.2" },
    { id: "c", date: "2026-10-14", title: "Old", time: "08:00", done: true },
    { id: "d", date: "2026-10-14", title: "Early", time: "08:15" },
    { id: "x", date: "2026-12-01", title: "Not shown" },
  ];
  const days = eventCalendarMonth({ month: "2026-10-01", events, today: "2026-10-14", weekStart: 1 });
  assert.equal(days.length, 42);
  assert.equal(days[0].date, "2026-09-28");
  assert.equal(days[0].outside, true);
  assert.equal(days[3].date, "2026-10-01");
  const day = days.find((d) => d.date === "2026-10-14");
  assert.equal(day.today, true);
  assert.deepEqual(day.events.map((e) => e.id), ["b", "d", "a", "c"]);
  assert.equal(days.flatMap((d) => d.events).some((e) => e.id === "x"), false);
  assert.equal(eventCalendarMonth({ month: "2026-10-01", events: [], weekStart: 0 })[0].date, "2026-09-27");
});
```

- [ ] **Step 2: Write the failing e2e spec** `tests/e2e/event-calendar.spec.ts`

```ts
const day = (ex: Locator, date: string) => ex.locator(`.ayy-event-calendar__day[data-date="${date}"]`);
const titles = (ex: Locator, date: string) => day(ex, date).locator(".ayy-event-calendar__event-title").allTextContents();
const listen = (page: Page, types: string[]) => page.evaluate((types) => { const w = window as unknown as { __ev: unknown[] }; w.__ev = []; for (const t of types) document.addEventListener(t, (e) => w.__ev.push([t, (e as CustomEvent).detail])); }, types);
const heard = (page: Page) => page.evaluate(() => (window as unknown as { __ev: unknown[] }).__ev);

for (const renderer of ["react", "html"] as const) {
  test.describe(`event calendar (${renderer})`, () => {
    test("a month: title, weekdays, 42 days, today, other months, sorted events", async ({ page }) => {
      await open(page, "event-calendar", { renderer });
      const ex = example(page, "schedule");
      await expect(ex.getByRole("heading", { name: "October 2026" })).toBeVisible();
      await expect(ex.locator(".ayy-event-calendar__weekdays > span")).toHaveText(["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]);
      await expect(ex.locator(".ayy-event-calendar__day")).toHaveCount(42);
      await expect(day(ex, "2026-10-14")).toHaveAttribute("aria-current", "date");
      await expect(day(ex, "2026-09-28")).toHaveAttribute("data-outside", "");
      expect(await titles(ex, "2026-10-14")).toEqual(["Ship v0.2", "Design review"]);
      await expect(day(ex, "2026-10-14")).toHaveAccessibleName("Wednesday, October 14, 2026, 2 events");
    });

    test("navigation, add and event clicks", async ({ page }) => {
      await open(page, "event-calendar", { renderer });
      const ex = example(page, "schedule");
      const add = ex.getByRole("button", { name: "Add an event on Wednesday, October 14, 2026" });
      if (renderer === "react") {
        await ex.getByRole("button", { name: "Next month" }).click();
        await expect(ex.getByRole("heading", { name: "November 2026" })).toBeVisible();
        await ex.getByRole("button", { name: "Today" }).click();
        await expect(ex.getByRole("heading", { name: "October 2026" })).toBeVisible();
        await add.click();
        expect(await titles(ex, "2026-10-14")).toEqual(["Ship v0.2", "New event", "Design review"]);
        const review = ex.locator('.ayy-event-calendar__event[data-id="e1"]');
        await expect(review).toHaveAttribute("aria-current", "true");
        await review.click();
        await expect(review).not.toHaveAttribute("aria-current", "true");
      } else {
        await listen(page, ["ayy-month-change", "ayy-add-event", "ayy-event-click"]);
        await ex.getByRole("button", { name: "Next month" }).click();
        await add.click();
        await ex.locator('.ayy-event-calendar__event[data-id="e2"]').click();
        expect(await heard(page)).toEqual([["ayy-month-change", { month: "2026-11-01" }], ["ayy-add-event", { date: "2026-10-14" }], ["ayy-event-click", { id: "e2" }]]);
      }
    });

    test("fits a phone, keeps long titles in their day, mirrors in RTL", async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 800 });
      await open(page, "event-calendar", { renderer });
      const ex = example(page, "schedule");
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
      expect(await day(ex, "2026-10-02").evaluate((el) => el.scrollWidth <= el.clientWidth + 1)).toBe(true);
      await rtl(ex);
      const mon = await day(ex, "2026-09-28").boundingBox();
      const sun = await day(ex, "2026-10-04").boundingBox();
      expect(mon!.x).toBeGreaterThan(sun!.x);
      const prev = await ex.getByRole("button", { name: "Previous month" }).boundingBox();
      const next = await ex.getByRole("button", { name: "Next month" }).boundingBox();
      expect(prev!.x).toBeGreaterThan(next!.x);
    });
  });
}

```
And in `tests/e2e/regressions.spec.ts`, next to the other `reactPage` tests:
```ts
test("React EventCalendar: a month set by the parent wins, and arrows report through onMonthChange", async ({ page }) => {
  await reactPage(
    page,
    `import { useState } from "react";
    import { EventCalendar, Button } from "ayywi";
    function App() {
      const [month, setMonth] = useState("2026-10-01");
      return <div>
        <EventCalendar locale="en-US" today="2026-10-14" weekStart={1} events={[]} month={month} onMonthChange={(m) => { window.__log.push(["month", m]); setMonth(m); }} />
        <Button onClick={() => setMonth("2026-12-01")}>Jump to December</Button>
      </div>;
    }`,
  );
  await page.getByRole("button", { name: "Jump to December" }).click();
  await expect(page.getByRole("heading", { name: "December 2026" })).toBeVisible();
  await page.getByRole("button", { name: "Next month" }).click();
  await expect(page.getByRole("heading", { name: "January 2027" })).toBeVisible();
  expect(await logs(page, "month")).toEqual([["2027-01-01"]]);
});
```

- [ ] **Step 3: Run both and see them fail.**

- [ ] **Step 4: Implement** `eventCalendarMonth`, labels, `connectEventCalendar`, CSS, React (controlled/uncontrolled month like `DatePickerGrid`), element and example; then the checklist items (README count 88). Meta states: `hover` (add button shows, event tint deepens to 20%), `pressed`, `focus` rings, `selected` = event `aria-current="true"`, `disabled`/`error` none, `loading` none ("render the month with Skeleton bars in the days"); own states `today` (`aria-current="date"`), `outside` (`data-outside`), `done` (`data-done`).

- [ ] **Step 5: Run the node test, the e2e spec and the full gate** — all pass.

- [ ] **Step 6: Commit**
```bash
git add src/components/event-calendar src/css/index.css src/index.ts src/react/index.ts src/elements/index.ts scripts/lib/contract.mjs AGENTS.md ai README.md CHANGELOG.md tests/node/event-calendar.test.mjs tests/e2e/event-calendar.spec.ts tests/e2e/regressions.spec.ts manifest llms llms.txt llms-full.txt
git commit -m "Event calendar: a month of events with today, add and selection"
```

---

### Task 7: Event calendar — overflow and moving events

**Files:**
- Modify: `src/components/event-calendar/event-calendar.{ts,css,react.tsx,element.ts,meta.json}`, `examples/schedule.{tsx,html}`
- Modify: `tests/node/event-calendar.test.mjs`, `tests/e2e/event-calendar.spec.ts`
- Modify: `CHANGELOG.md` (extend Task 6's entry line: `…, "+N more" when a day is full, and drag or Alt+arrow keys to move an event.`)

**Interfaces:**
- Consumes: Task 6's `EventCalendar`, `eventCalendarLabels.more`; `Popover`, `PopoverTrigger`, `PopoverContent` from `src/react/index.ts`; `DragDropArea`, `DropTarget`, `SortableItem`, `type DragMove` from Drag and drop.
- Produces:
  ```ts
  export function eventCalendarRowsPerDay(grid: HTMLElement): number;          // event-calendar.ts
  export function eventCalendarShiftDate(date: string, key: "ArrowLeft" | "ArrowRight" | "ArrowUp" | "ArrowDown", rtl: boolean): string; // ±1 day sideways (mirrored in RTL), ±7 up/down
  // EventCalendarProps gains:
  maxEvents?: number | "auto";                       // default "auto": measured rows per day
  onEventMove?(id: string, date: string): void;      // drag and Alt+arrows; no move UI without it
  // EventCalendarHandlers gains: onMore?(date: string): void; onEventMove?(id: string, date: string): void;
  // Element emits ayy-more { date } and ayy-event-move { id, date }.
  ```

`eventCalendarRowsPerDay` (the measuring rule Doerr ships; use it as written):
```ts
export function eventCalendarRowsPerDay(grid: HTMLElement): number {
  const day = grid.querySelector<HTMLElement>(".ayy-event-calendar__day");
  const head = day?.querySelector<HTMLElement>(".ayy-event-calendar__day-head");
  if (!day || !head) return 3;
  const cs = getComputedStyle(day);
  const gap = Number.parseFloat(cs.rowGap) || 0;
  const room = day.clientHeight - Number.parseFloat(cs.paddingBlockStart) - Number.parseFloat(cs.paddingBlockEnd) - head.offsetHeight - gap;
  // offsetHeight, not getBoundingClientRect(): events animate in with a scale.
  const chip = grid.querySelector<HTMLElement>(".ayy-event-calendar__event")?.offsetHeight || 22;
  return Math.max(1, Math.floor((room + 2) / (chip + 2)));
}
```

**Behaviour:**
- React, `maxEvents="auto"`: measure on mount, on `ResizeObserver(grid)`, and on a `MutationObserver` of `document.documentElement` `data-density`. A day with more events than `rows` shows `rows - 1` events and a `PopoverTrigger` (`variant="ghost" size="sm"`, class `ayy-event-calendar__more`, text `labels.more(hidden)`); its `PopoverContent` (`align="start"`, `aria-label` = the day name) holds a `<p class="ayy-eyebrow">` with the day name and `<ul class="ayy-event-calendar__popover-list">` of every event button. Esc closes and returns focus to the trigger (Popover does it).
- HTML element: on connect and resize, hide (`hidden`) each day's event `<li>`s past `rows - 1` when they don't fit, and fill and un-hide the day's `.ayy-event-calendar__more` button (the author writes one per day, `hidden`, class `ayy-button ayy-button--ghost ayy-button--sm ayy-event-calendar__more`). Clicking it emits `ayy-more` `{ date }`; no popover in HTML.
- Alt+ArrowLeft/Right/Up/Down on a focused event (both renderers, only with `onEventMove` / always for the element) → `onEventMove(id, eventCalendarShiftDate(date, key, rtl))` where `rtl = getComputedStyle(root).direction === "rtl"`; `preventDefault()` and `stopPropagation()`, so Drag and drop's own Alt+arrow handling on the `SortableItem` doesn't move it a second time (if it still does, report `BLOCKED`). React keeps focus on the moved event (focus by `data-id` after render).
- React pointer drag, only with `onEventMove`: wrap the grid in `<DragDropArea handle={false} onMove>`; each `__events` list is `<DropTarget as="ul" data-id={date}>`; each event `<li>` is `<SortableItem data-id={id}>`. On a move whose `toId !== fromId`, call `onEventMove(itemId, toId)`.
- The example passes `onEventMove` (moves the event in state).

- [ ] **Step 1: Write the failing tests** (append)

Node:
```js
test("eventCalendarShiftDate", { skip }, async () => {
  const { eventCalendarShiftDate } = await import(dist("index.js"));
  assert.equal(eventCalendarShiftDate("2026-10-30", "ArrowRight", false), "2026-10-31");
  assert.equal(eventCalendarShiftDate("2026-10-30", "ArrowRight", true), "2026-10-29");
  assert.equal(eventCalendarShiftDate("2026-10-30", "ArrowDown", false), "2026-11-06");
  assert.equal(eventCalendarShiftDate("2026-10-01", "ArrowUp", true), "2026-09-24");
});
```
E2E (inside the renderer loop):
```ts
test("a full day shows +N more; Alt+arrows move an event", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await open(page, "event-calendar", { renderer });
  const ex = example(page, "schedule");
  const busy = day(ex, "2026-10-21");
  const more = busy.locator(".ayy-event-calendar__more");
  await expect(more).toBeVisible();
  const shown = await busy.locator(".ayy-event-calendar__event:visible").count();
  const hidden = Number((await more.textContent())!.match(/\d+/)![0]);
  expect(shown + hidden).toBe(5);
  expect(hidden).toBeGreaterThanOrEqual(1);
  if (renderer === "react") {
    await more.click();
    const pop = page.getByRole("dialog", { name: "Wednesday, October 21, 2026" }).or(page.locator(".ayy-popover:popover-open"));
    await expect(pop.locator(".ayy-event-calendar__event")).toHaveCount(5);
    await page.keyboard.press("Escape");
    await expect(more).toBeFocused();
  }
  if (renderer === "html") await listen(page, ["ayy-event-move"]);
  const notes = ex.getByRole("button", { name: "Release notes" });
  await keyboardFocus(notes);
  await page.keyboard.press("Alt+ArrowRight");
  if (renderer === "react") {
    expect(await titles(ex, "2026-10-31")).toEqual(["Release notes"]);
    await expect(day(ex, "2026-10-31").getByRole("button", { name: "Release notes" })).toBeFocused();
  } else {
    expect(await heard(page)).toEqual([["ayy-event-move", { id: "e9", date: "2026-10-31" }]]);
  }
});

test("touch density fits no more rows than compact", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  const rows = async (density: "compact" | "touch") => {
    await open(page, "event-calendar", { renderer, density });
    return day(example(page, "schedule"), "2026-10-21").locator(".ayy-event-calendar__event:visible").count();
  };
  expect(await rows("touch")).toBeLessThanOrEqual(await rows("compact"));
});
```
React only (outside the loop):
```ts
test("event calendar (react): drag an event to another day", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await open(page, "event-calendar", { renderer: "react" });
  const ex = example(page, "schedule");
  const from = await ex.getByRole("button", { name: "Release notes" }).boundingBox();
  const to = await day(ex, "2026-10-28").boundingBox();
  await page.mouse.move(from!.x + 10, from!.y + from!.height / 2);
  await page.mouse.down();
  await page.mouse.move(to!.x + to!.width / 2, to!.y + to!.height - 12, { steps: 12 });
  await page.mouse.up();
  expect(await titles(ex, "2026-10-28")).toEqual(["Release notes"]);
  expect(await titles(ex, "2026-10-30")).toEqual([]);
});
```
The popover locator uses `.or()` because Popover may or may not expose a dialog role; tighten it to whichever matches once you see the markup, and say so in the report.

- [ ] **Step 2: Run and see them fail.**

- [ ] **Step 3: Implement** per the behaviour list. Add `__more` and `__popover-list` to the CSS and meta `classes`; meta `element` documents `ayy-more` and `ayy-event-move`; meta `do` adds "Pass onEventMove to let people drag an event or move it with Alt + arrow keys."

- [ ] **Step 4: Run** the node test, the event calendar spec, `tests/e2e/drag-drop.spec.ts`, and the full gate — all pass.

- [ ] **Step 5: Commit**
```bash
git add src/components/event-calendar tests/node/event-calendar.test.mjs tests/e2e/event-calendar.spec.ts CHANGELOG.md manifest llms llms.txt llms-full.txt ai
git commit -m "Event calendar: +N more for full days, and moving events by drag or Alt+arrows"
```

---

## Branch gate (after Task 7, before the final review)

- `scripts/check-all.sh` passes on the committed tree (it builds the preview and runs the whole e2e suite, including `pages`, `theming` (axe) and `dist`).
- Visual check with `pnpm preview`: Find bar, Checklist, Board and Event calendar at 390px and 1280px, dark and light, compact and touch density, and with `dir="rtl"` on the stage. Fix clipped focus rings, overflow and arrows pointing the wrong way.
- Report back: the branch name, the commit list, and every `Ruling:` from the ledger. Don't merge, push or release; ask the maintainer.

## Not in this plan

- Moving Doerr onto these components (and onto Inline edit, Record picker, Property list, Tree, Icon picker and BarChart compare lines). It needs an ayywi release first and is a plan in the Doerr repo.
- The P3 list in the spec: condition builder, week strip, check-in ring, status month, smart input tokens, recipes, toast with a list.
