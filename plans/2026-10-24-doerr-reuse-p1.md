# Doerr Reuse P1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use code-run-plan to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the four P1 pieces from the Doerr review to ayywi — inline edit, a multi-value record picker, a property list and tree navigation — as complete CSS contracts with framework-free behaviour, React wrappers, light-DOM elements where interaction needs them, examples, metadata and tests.

**Architecture:** Six tasks, each shipping one independently reviewable component slice. Every component is a new folder under `src/components/` following the repo's one-folder contract (`css`, helper, React, element when interactive, meta, HTML + React examples). Existing pieces are reused rather than duplicated: `TagInput`'s field, chip and input classes, `Combobox`'s listbox classes and floating placement, `InlineEdit` inside property rows and tree rename, and tokens for every measurement.

**Tech Stack:** TypeScript, React 18, native DOM (no shadow DOM), Popover API where available, CSS custom properties and cascade layers, `node:test`, Playwright + axe, Vite preview.

**Spec:** `plans/2026-10-doerr-reuse.md` (items 1–4 only; items 5–16 are separate plans)

## Global Constraints

- **Work in a clean worktree, not the main checkout:** `git worktree add ../ayywi-doerr-reuse-p1 -b feat/doerr-reuse-p1` from current `HEAD`, then `pnpm install` there once. The main checkout has uncommitted chart work (`src/components/chart/*`, `src/react/index.ts`, `src/components/chart/examples/*`); never stage, amend, stash or otherwise touch it. Copy `plans/2026-10-doerr-reuse.md` and this plan into the worktree before Task 1 (both are untracked in the main checkout).
- **One branch, one commit per task.** Do not merge, push, bump `package.json`, tag, publish, or rename `## Unreleased`. No new CI workflows.
- **Zero runtime dependencies.** Use `@hugeicons/core-free-icons` only in `.tsx` examples; glyphs ayywi's own components draw go in `src/lib/icons.ts` and are checked by `tests/node/icons.test.mjs`.
- **Tokens only.** No hex/rgb/hsl in component CSS; tints with `color-mix()` and a token. Logical properties only (`inset-inline-*`, `padding-inline-*`, `text-align: start`), no `:dir()`. Every class starts `ayy-`; private custom properties start `--_`.
- **State from native/ARIA attributes.** `hidden`, `disabled`, `aria-expanded`, `aria-selected`, `aria-invalid`, `aria-disabled`. A colour-only state needs a `@media (forced-colors: active)` block. Every interactive part needs a visible `:focus-visible` ring.
- **Controls follow `data-density`.** Use `--ayy-size-control-*`, `--ayy-control-text-*`, `--ayy-space-*`; no fixed rem heights for controls. RTL must work through logical properties and `--_ayy-dir` for mirrored glyphs.
- **Never edit generated files by hand:** `src/css/tokens.css`, `src/tokens.ts`, `manifest/`, `llms*.txt`, `llms/`, `ai/AGENTS.snippet.md`, `ai/cursor/ayywi.mdc`, `ai/skills/ayywi/reference.md`. Run `pnpm build` (which runs `generate`) and commit the regenerated output.
- **New-component checklist (every component task):** create `<slug>.css`, `<slug>.ts`, `<slug>.react.tsx`, `<slug>.meta.json`, `examples/<id>.html` + `.tsx`; add `<slug>.element.ts` only if it has JS behaviour; import the CSS in `src/css/index.css`; export the helper from `src/index.ts` and the React components from `src/react/index.ts`; when it has a custom element, register it in `src/elements/index.ts` and `defineElements()` and add its tag to `AGENTS.md`, `ai/skills/ayywi/SKILL.md` and the `RULES` element line in `scripts/lib/contract.mjs`; add the slug to `ORDER` in `scripts/lib/contract.mjs`; update the README component table and count (73 → 74 → 75 → 76 → 77); add a `CHANGELOG.md` entry under `## Unreleased`; run `pnpm build` so `manifest/`, `llms/` and the AI kit match. The canonical checklist is `.claude/skills/ayywi-add-component/SKILL.md`; read it before starting each component task.
- **Metadata is code.** `pnpm check` fails unless every CSS class is documented exactly, every core state (`default`, `hover`, `pressed`, `focus`, `disabled`, `selected`, `error`, `loading`) is present, every React prop is documented, every element attribute/event is documented, and every example has both files. Fix `pnpm check` findings; never suppress them.
- **Examples:** write the `.tsx` first and render it to markup for the `.html` file, so they cannot drift. HTML examples use only `ayywi.css` + `elements.global.js`; icons use `iconSvg()` markup, React uses `<Icon>`. No inline `<script>`.
- **Commands:** targeted e2e `pnpm exec playwright test tests/e2e/<slug>.spec.ts`; full gate `pnpm build && pnpm typecheck && pnpm check && pnpm test`; final gate `scripts/check-all.sh` (includes preview build and the full e2e suite). A task is not done until the commands it names have passed in this turn.
- **Visual check:** open each new component in `pnpm preview` at 390px and 1280px, in dark and light, compact and touch density, and with `dir="rtl"` on the stage. Fix overflow, clipped focus rings and wrong chevron direction before the final task.

## Spec Notes And Decisions

- **Only items 1–4 are in scope.** Confirm helpers, Board, Event calendar, condition builder, Find bar, Emoji picker, mentions, recurrence and the recipe-only items are later plans.
- **No drag-and-drop system exists in this checkout.** The spec references `src/components/drag-drop/`; it is absent. Tree therefore starts non-draggable. Task 6 adds keyboard move intents (`Alt+ArrowUp/Down`) with `canMove`/`onMove`, and `moveTreeItem` accepts any `parentId`/`index` so a later drag implementation can produce before/after/inside/out moves through the same contract without redoing the tree.
- **No `TableEdit` exists in this checkout.** Inline edit is built as a standalone primitive. Table integration is deliberately out of scope; the table can adopt `InlineEdit` in a later task.
- **Record picker is a new component in the Combobox/TagInput family, not a `multiple` prop on Combobox.** A multi-select listbox must use `aria-selected` for selection, while `connectCombobox` uses it for the active option; overloading Combobox would break its ARIA contract and its public types. `RecordPicker` reuses the tag-input field, chip and input classes plus the combobox listbox classes, option labels and floating placement.
- **Property list is a new `<dl>` component, not a compact Settings variant.** Settings rows are form controls with a `<label>`; record properties are terms and definitions with read-only, empty and editable values, and their own wrapping. Reusing Settings would stretch its contract and still need different semantics. The list reuses tokens, `Badge`, `Avatar`, `Chip` and `InlineEdit`.
- **Tree is data-driven in React and nested markup in HTML.** `Tree` owns expansion, selection, roving focus and keyboard behaviour through one framework-free controller; consumers own the node array, active route, persistence and folder rules.

## Review Focus

These are the input classes and failure modes the spec implies but whose own task tests would not otherwise pin. Each has a test in the task that owns the code.

1. **IME composition.** Enter while a Japanese, Chinese or Korean IME is composing must not commit an inline edit or choose a record. Task 1 and Task 2 dispatch a `keydown` with `isComposing: true` and assert editing/selection stays put.
2. **Long, unbroken labels.** A long title, record label or property value must wrap or clip inside its box at 320px without a horizontal scrollbar. Task 1, Task 2, Task 3 and Task 4 assert `scrollWidth <= clientWidth + 1` at phone width.
3. **RTL.** Inline edit text aligns from the right; tree indentation comes from the right and the chevron rotates the other way. Task 1 and Task 4 assert both with `rtl()` and `getBoundingClientRect()`.
4. **Focus after commit, cancel, blur and rename.** Enter/Esc return focus to the display button; Tab moves on without stealing focus back; tree rename returns focus to the treeitem. Task 1 and Task 5 assert the focused element by role and name.
5. **Controlled values from outside.** A changed `value` prop wins over local state; a parent that rejects a change leaves the old value visible; an external selected/expanded id moves the tree. Task 1 (React), Task 2 (React) and Task 4 (React) include an outside update test.

---

### Task 1: Inline edit

**Files:**
- Create: `src/components/inline-edit/inline-edit.css`
- Create: `src/components/inline-edit/inline-edit.ts`
- Create: `src/components/inline-edit/inline-edit.react.tsx`
- Create: `src/components/inline-edit/inline-edit.element.ts`
- Create: `src/components/inline-edit/inline-edit.meta.json`
- Create: `src/components/inline-edit/examples/title.html`, `title.tsx`
- Create: `src/components/inline-edit/examples/description.html`, `description.tsx`
- Create: `tests/e2e/inline-edit.spec.ts`
- Modify: `tests/e2e/regressions.spec.ts` (formatted `displayValue` and controlled-value tests with the existing `reactPage` helper)
- Modify: `src/css/index.css` (import after `textarea.css`)
- Modify: `src/index.ts`, `src/react/index.ts`, `src/elements/index.ts`
- Modify: `scripts/lib/contract.mjs` (`ORDER` after `textarea`; `RULES` element line)
- Modify: `AGENTS.md`, `ai/skills/ayywi/SKILL.md`
- Modify: `README.md` (count 73 → 74; Forms row), `CHANGELOG.md`
- Generated by `pnpm build`: `manifest/`, `llms/`, `llms*.txt`, `src/tokens.ts`, `src/css/tokens.css`, `ai/skills/ayywi/reference.md`

**Interfaces:**
- Consumes: nothing from earlier tasks.
- Produces:
  - `inlineEditClass({ variant?: "text" | "title"; className?: string }): string`
  - `connectInlineEdit(root: HTMLElement, options?: InlineEditOptions): InlineEditController`
  - `InlineEditOptions { onCommit?(value: string, previous: string): void; onCancel?(): void; onEditingChange?(editing: boolean): void; trim?: boolean }`
  - `InlineEditController { start(): void; commit(): void; cancel(): void; isEditing(): boolean; destroy(): void }`
  - React `InlineEdit` with props `value?: string`, `defaultValue?: string`, `onValueChange?(value: string): void`, `label: string`, `displayValue?: ReactNode`, `placeholder?: string`, `multiline?: boolean`, `variant?: "text" | "title"`, `disabled?: boolean`, `editing?: boolean`, `defaultEditing?: boolean`, `onEditingChange?(editing: boolean): void`, `trim?: boolean` (default `true`), `inputProps?: Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "defaultValue" | "onChange" | "className" | "hidden" | "ref">`, `textareaProps?: Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "value" | "defaultValue" | "onChange" | "className" | "hidden" | "ref">`.
  - Element `<ayy-inline-edit>`: events `ayy-change` `{ value: string }`, `ayy-edit` `{ editing: boolean }`; public `startEditing()`, `commit()`, `cancel()`; no observed attributes. It is the wrapper around `.ayy-inline-edit`; the markup decides input vs textarea.

**Markup contract:**
```html
<ayy-inline-edit>
  <div class="ayy-inline-edit" data-value="Q4 launch">
    <button type="button" class="ayy-inline-edit__display" aria-label="Rename the project">
      <span class="ayy-inline-edit__text">Q4 launch</span>
    </button>
    <input class="ayy-input ayy-inline-edit__input" aria-label="Rename the project" value="Q4 launch" hidden>
  </div>
</ayy-inline-edit>
```
Title variant adds `ayy-inline-edit--title` to the root; multiline replaces the input with `<textarea class="ayy-textarea ayy-inline-edit__input" rows="1" hidden>`. The display button and input share the same grid cell (`display: grid`, both `grid-area: 1 / 1`) so swapping does not shift the row. The raw value lives in `data-value`; the display text may be formatted (`data-value="2026-10-24"`, text `24 Oct 2026`). Empty display text is an empty `.ayy-inline-edit__text` with `data-placeholder`; CSS supplies the muted placeholder via `:empty::before`.

- [ ] **Step 1: Write the failing e2e tests**

Create `tests/e2e/inline-edit.spec.ts`:

```ts
import { expect, test } from "@playwright/test";
import { example, open } from "./helpers";

for (const renderer of ["react", "html"] as const) {
  test.describe(`inline edit (${renderer})`, () => {
    test("title: click edits, Enter commits, Esc cancels, blur commits and Tab moves on", async ({ page }) => {
      await open(page, "inline-edit", { renderer });
      const ex = example(page, "title");
      const display = ex.getByRole("button", { name: "Rename the project" });
      const input = ex.getByRole("textbox", { name: "Rename the project" });
      await expect(display).toHaveText("Q4 launch");
      await expect(input).toBeHidden();

      await display.click();
      await expect(input).toBeVisible();
      await expect(input).toBeFocused();
      await expect(input).toHaveValue("Q4 launch");
      await input.fill("Q1 launch");
      await input.press("Enter");
      await expect(display).toHaveText("Q1 launch");
      await expect(display).toBeFocused();

      await display.press("Enter");
      await input.fill("Throw this away");
      await input.press("Escape");
      await expect(display).toHaveText("Q1 launch");
      await expect(display).toBeFocused();

      await display.press("Enter");
      await input.fill("Q2 launch");
      await page.keyboard.press("Tab");
      await expect(display).toHaveText("Q2 launch");
      await expect(display).not.toBeFocused();
    });

    test("multiline grows, Enter adds a line and Mod+Enter commits", async ({ page }) => {
      await open(page, "inline-edit", { renderer });
      const ex = example(page, "description");
      const display = ex.getByRole("button", { name: "Edit the description" });
      const input = ex.getByRole("textbox", { name: "Edit the description" });
      await display.click();
      const height = async () => (await input.boundingBox())!.height;
      const before = await height();
      await input.evaluate((el) => (el as HTMLTextAreaElement).setSelectionRange(el.value.length, el.value.length));
      await input.press("Enter");
      await input.pressSequentially("A second line");
      await expect.poll(height).toBeGreaterThan(before);
      await expect(input).toHaveValue(/A second line$/);
      await input.press(process.platform === "darwin" ? "Meta+Enter" : "Control+Enter");
      await expect(display).toContainText("A second line");
    });

    test("Enter during IME composition does not commit", async ({ page }) => {
      await open(page, "inline-edit", { renderer });
      const ex = example(page, "title");
      const display = ex.getByRole("button", { name: "Rename the project" });
      await display.click();
      const input = ex.getByRole("textbox", { name: "Rename the project" });
      await input.fill("日本");
      await input.evaluate((el) => {
        el.dispatchEvent(new CompositionEvent("compositionstart", { bubbles: true }));
        el.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true, isComposing: true } as KeyboardEventInit));
      });
      await expect(input).toBeVisible();
      await expect(display).toBeHidden();
    });

    test("a long title wraps at phone width", async ({ page }) => {
      await page.setViewportSize({ width: 320, height: 800 });
      await open(page, "inline-edit", { renderer });
      const ex = example(page, "title");
      await ex.getByRole("button", { name: "Rename the project" }).click();
      const input = ex.getByRole("textbox", { name: "Rename the project" });
      await input.fill("Averyveryveryverylongunbrokenprojectnamewithoutspaces");
      await input.press("Enter");
      const text = ex.locator(".ayy-inline-edit__text");
      expect(await text.evaluate((el) => el.scrollWidth <= el.clientWidth + 1)).toBe(true);
    });
  });
}

test("RTL aligns the display text from the right", async ({ page }) => {
  await open(page, "inline-edit", { renderer: "react" });
  const ex = example(page, "title");
  const display = ex.getByRole("button", { name: "Rename the project" });
  const text = display.locator(".ayy-inline-edit__text");
  const left = async () => (await text.boundingBox())!.x;
  const right = async () => {
    const b = (await text.boundingBox())!;
    return b.x + b.width;
  };
  const displayBox = async () => (await display.boundingBox())!;
  const ltr = await displayBox();
  expect(await left() - ltr.x).toBeLessThan(ltr.x + ltr.width - (await right()));
  await ex.evaluate((el) => el.setAttribute("dir", "rtl"));
  const rtlBox = await displayBox();
  expect(await left() - rtlBox.x).toBeGreaterThan(rtlBox.x + rtlBox.width - (await right()));
});
```

Add a formatted-value test to `tests/e2e/regressions.spec.ts`, reusing its `reactPage` helper (plain HTML has no formatter; the app owns `displayValue`):

```ts
test("React InlineEdit shows displayValue and edits the raw value", async ({ page }) => {
  await reactPage(
    page,
    `import { useState } from "react";
    import { InlineEdit } from "ayywi";
    function App() {
      const [value, setValue] = useState("2026-10-24");
      const [year, month, day] = value.split("-").map(Number);
      const display = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" }).format(new Date(year, month - 1, day));
      return <InlineEdit label="Change the due date" value={value} onValueChange={setValue} displayValue={display} />;
    }`,
  );
  const display = page.getByRole("button", { name: "Change the due date" });
  await expect(display).toHaveText("24 Oct 2026");
  await display.click();
  const input = page.getByRole("textbox", { name: "Change the due date" });
  await expect(input).toHaveValue("2026-10-24");
  await input.fill("2026-11-01");
  await input.press("Enter");
  await expect(display).toHaveText("1 Nov 2026");
});
```

Add the controlled-value test to `tests/e2e/regressions.spec.ts` too:

```ts
test("React InlineEdit follows a controlled value and can reject a change", async ({ page }) => {
  await reactPage(
    page,
    `import { useState } from "react";
    import { InlineEdit } from "ayywi";
    function App() {
      const [value, setValue] = useState("1.4.0");
      return (
        <div>
          <InlineEdit label="Change the version" value={value} onValueChange={(next) => { if (!next.endsWith("-rejected")) setValue(next); }} />
          <button type="button" onClick={() => setValue("3.0.0")}>Set 3.0.0</button>
        </div>
      );
    }`,
  );
  await page.getByRole("button", { name: "Change the version" }).click();
  const input = page.getByRole("textbox", { name: "Change the version" });
  await input.fill("2.0.0-rejected");
  await input.press("Enter");
  await expect(page.getByRole("button", { name: "Change the version" })).toHaveText("1.4.0");
  await page.getByRole("button", { name: "Set 3.0.0" }).click();
  await expect(page.getByRole("button", { name: "Change the version" })).toHaveText("3.0.0");
});
```

The plain HTML element updates the display with the committed raw text; an app that shows formatted text rewrites it from the `ayy-change` event. `displayValue` is the React path. The two regression tests exercise props the preview examples do not need to show.

- [ ] **Step 2: Run the tests to see them fail**

Run: `pnpm exec playwright test tests/e2e/inline-edit.spec.ts`
Expected: FAIL — `/#/inline-edit` has no page or example; the component does not exist.

- [ ] **Step 3: Add the static contract and React behaviour**

Create the CSS, helper, React wrapper, meta and two examples. Cover:
- Display button: seamless text, `padding-inline: var(--ayy-space-1)`, hover wash only inside `@media (hover: hover)`, `:focus-visible` ring, `disabled` opacity and `not-allowed`. The text is `display: inline-block; max-inline-size: 100%; overflow-wrap: anywhere; white-space: pre-wrap`, so it wraps long words, keeps multiline breaks, and its box follows the text for the RTL test; the button aligns it with `text-align: start`.
- Title variant: `--ayy-font-heading`, `--ayy-text-xl`, `--ayy-weight-semibold`, `--ayy-leading-tight`; its input/textarea keeps the same type and an auto block size.
- Input: `.ayy-input` / `.ayy-textarea` classes; `aria-invalid` colours come from those components. Multiline uses `resize: none; overflow: hidden`, resets `.ayy-textarea`'s 5rem min height to one row, and grows with `scrollHeight` on input and on entering edit mode. Add `ayy-inline-edit { display: contents; }` for the custom element wrapper.
- React: controlled `value`/`editing` plus uncontrolled `defaultValue`/`defaultEditing`; `displayValue` defaults to the current value; empty text has `data-placeholder`.
- Commit: trim by default; call `onValueChange` only when the value changed; Enter commits (single-line), `Mod+Enter` commits (multiline), Escape cancels, blur commits without refocusing, Enter/Escape focus the display button. Skip when `nativeEvent.isComposing` or `keyCode === 229`.
- On entering edit: focus the input, select all single-line, put the caret at the end multiline.
- `inputProps`/`textareaProps` merge onto the field; `className` stays on the root, never the field.

Run the React half: `pnpm exec playwright test tests/e2e/inline-edit.spec.ts -g "react"`
Expected: PASS for the rendered React examples; the HTML interaction tests still fail because `<ayy-inline-edit>` is not wired.

- [ ] **Step 4: Add `connectInlineEdit` and `<ayy-inline-edit>`**

Implement `connectInlineEdit` in `inline-edit.ts`: find `.ayy-inline-edit__display` and `.ayy-inline-edit__input`, toggle `hidden`, copy `data-value` (else display text) into the field, grow a textarea, call `onCommit`/`onCancel`/`onEditingChange`, return `{ start, commit, cancel, isEditing, destroy }`. The controller updates `.ayy-inline-edit__text` and `data-value` on commit, emits no DOM events itself. The element calls it, exposes `startEditing()`, `commit()` and `cancel()`, and emits `ayy-change` `{ value }` and `ayy-edit` `{ editing }`. Register the element and add the tag to the three element lists.

Run: `pnpm exec playwright test tests/e2e/inline-edit.spec.ts`
Expected: PASS both renderers.

- [ ] **Step 5: Complete the component checklist, run the gate and commit**

Add the CSS import, entries in `src/index.ts` / `src/react/index.ts` / `src/elements/index.ts`, the `ORDER` slug, the element tag to `AGENTS.md` / `ai/skills/ayywi/SKILL.md` / `RULES`, the README count and Forms row, and the CHANGELOG entry. Run `pnpm build && pnpm typecheck && pnpm check && pnpm test`, then the targeted e2e once more. Fix every finding.

```bash
git add src/components/inline-edit src/css/index.css src/index.ts src/react/index.ts src/elements/index.ts scripts/lib/contract.mjs AGENTS.md ai/skills/ayywi/SKILL.md README.md CHANGELOG.md manifest llms llms.txt llms-full.txt ai/skills/ayywi/reference.md tests/e2e/inline-edit.spec.ts
git commit -m "Inline edit: add InlineEdit and <ayy-inline-edit>"
```

---

### Task 2: Record picker

**Files:**
- Create: `src/components/record-picker/record-picker.css`
- Create: `src/components/record-picker/record-picker.ts`
- Create: `src/components/record-picker/record-picker.react.tsx`
- Create: `src/components/record-picker/record-picker.element.ts`
- Create: `src/components/record-picker/record-picker.meta.json`
- Create: `src/components/record-picker/examples/people.html`, `people.tsx`
- Create: `src/components/record-picker/examples/labels.html`, `labels.tsx`
- Create: `tests/e2e/record-picker.spec.ts`
- Modify: `tests/e2e/regressions.spec.ts` (controlled-value RecordPicker test with the existing `reactPage` helper)
- Modify: `src/css/index.css` (import after `tag-input.css`)
- Modify: `src/index.ts`, `src/react/index.ts`, `src/elements/index.ts`
- Modify: `scripts/lib/contract.mjs` (`ORDER` after `tag-input`; `RULES` element line)
- Modify: `AGENTS.md`, `ai/skills/ayywi/SKILL.md`
- Modify: `README.md` (count 74 → 75; Forms row), `CHANGELOG.md`

**Interfaces:**
- Consumes: `TagInput` field/chip classes (`ayy-tag-input`, `ayy-tag-input__input`, `ayy-tag-input__tag`, `ayy-chip--removable`), `tagRemoveIcon`, `Combobox` listbox classes (`ayy-combobox`, `ayy-combobox__listbox`, `ayy-combobox__option`, `ayy-combobox__option[aria-disabled]`, `ayy-combobox__meta`, `ayy-combobox__empty`), `comboboxOptionLabel`, `autoPlace`, `supportsPopover`, `ensureId`.
- Produces:
  - `recordPickerClass({ multiple?: boolean; size?: InputSize; className?: string }): string`
  - `recordPickerChip(option: { id: string; label: string }, removeLabel?: (label: string) => string): HTMLSpanElement`
  - `connectRecordPicker(root: HTMLElement, options?: RecordPickerOptions): RecordPickerController`
  - `RecordPickerOptions { multiple?: boolean; creatable?: boolean; filter?: boolean; onSelect?(option: HTMLElement): void; onCreate?(label: string): void; onRemoveLast?(): void; onClear?(): void }`
  - `RecordPickerController { open(): void; close(): void; refresh(): void; destroy(): void }`
  - React `RecordPickerOption { id: string; label: string; description?: ReactNode; icon?: ReactNode; keywords?: string; disabled?: boolean }`
  - React `RecordPicker` props: `options: RecordPickerOption[]`, `value?: string[]`, `defaultValue?: string[]`, `onValueChange?(ids: string[], options: RecordPickerOption[]): void`, `multiple?: boolean`, `creatable?: boolean`, `onCreate?(label: string): RecordPickerOption | void`, `createLabel?(label: string): string`, `emptyText?: ReactNode`, `size?: InputSize`, `name?: string`, `clearable?: boolean` (default `true`), `clearLabel?: string` (default `"Clear"`), `removeLabel?(option: RecordPickerOption): string`, plus native input props (`placeholder`, `disabled`, `id`, `aria-*`).
  - Element `<ayy-record-picker>` attributes `multiple`, `creatable`, `manual`, `name`; events `ayy-change` `{ ids: string[], options: { id: string; label: string }[] }`, `ayy-create` `{ id: string, label: string }`.

**Markup contract:**
```html
<ayy-record-picker multiple creatable>
  <div class="ayy-record-picker ayy-tag-input ayy-combobox ayy-record-picker--multiple">
    <span class="ayy-chip ayy-chip--removable ayy-tag-input__tag ayy-record-picker__tag" data-value="ada">
      Ada Lovelace
      <button type="button" class="ayy-chip__remove" aria-label="Remove Ada Lovelace">…</button>
    </span>
    <input class="ayy-tag-input__input ayy-record-picker__input" role="combobox" aria-autocomplete="list" aria-expanded="false" aria-controls="…" placeholder="Add a person">
    <button type="button" class="ayy-record-picker__clear" aria-label="Clear">…</button>
    <ul class="ayy-combobox__listbox ayy-record-picker__listbox" id="…" role="listbox" aria-multiselectable="true" popover="manual">
      <li role="option" class="ayy-combobox__option ayy-record-picker__option" data-value="ada" data-label="Ada Lovelace" data-keywords="ada@example.com" aria-selected="true">
        <span class="ayy-record-picker__option-body">
          <span class="ayy-record-picker__option-label">Ada Lovelace</span>
          <span class="ayy-record-picker__description">ada@example.com</span>
        </span>
      </li>
      <li role="option" class="ayy-combobox__option ayy-record-picker__create" data-create hidden>
        <span class="ayy-record-picker__create-label">Create “Maya”</span>
      </li>
      <li role="none" class="ayy-combobox__empty ayy-record-picker__empty" hidden>No people</li>
    </ul>
  </div>
</ayy-record-picker>
```
The root reuses `ayy-tag-input ayy-combobox`; `record-picker.css` only adds the record-specific pieces (selected check, option body, description, create row, clear button, chip truncation). The listbox uses `role="listbox"` with `aria-multiselectable` in multiple mode. The active option uses `data-active="true"` and `aria-activedescendant`; selected options use `aria-selected="true"` and a checkmark drawn in CSS. The input keeps focus throughout. The clear button sits after the input and clears every chip; a chip's × removes one. The element creates hidden `<input type="hidden" name="…">` per selected id when `name` is set.

- [ ] **Step 1: Write the failing e2e tests**

Create `tests/e2e/record-picker.spec.ts`:

```ts
import { expect, test } from "@playwright/test";
import { example, open } from "./helpers";

for (const renderer of ["react", "html"] as const) {
  test.describe(`record picker (${renderer})`, () => {
    test("single pick: type, filter, Enter, clear", async ({ page }) => {
      await open(page, "record-picker", { renderer });
      const ex = example(page, "people");
      const input = ex.getByRole("combobox", { name: "Assignee" });
      await input.click();
      await input.pressSequentially("gra");
      const list = ex.getByRole("listbox", { name: "Assignee" });
      await expect(list.getByRole("option")).toHaveCount(1);
      await expect(list.getByRole("option", { name: /Grace Hopper/ })).toBeVisible();
      await input.press("Enter");
      await expect(ex.locator(".ayy-record-picker__tag")).toHaveText(["Grace Hopper"]);
      await expect(input).toHaveValue("");
      await expect(list).toBeHidden();
      await ex.getByRole("button", { name: "Clear" }).click();
      await expect(ex.locator(".ayy-record-picker__tag")).toHaveCount(0);
      await expect(input).toBeFocused();
    });

    test("multiple picks: chips in order, toggle off, Backspace, hidden inputs", async ({ page }) => {
      await open(page, "record-picker", { renderer });
      const ex = example(page, "labels");
      const input = ex.getByRole("combobox", { name: "Labels" });
      const chips = ex.locator(".ayy-record-picker__tag");
      await input.click();
      await input.pressSequentially("des");
      await input.press("Enter");
      await input.pressSequentially("eng");
      await input.press("Enter");
      await expect(chips).toHaveText(["Design", "Engineering"]);
      const list = ex.getByRole("listbox", { name: "Labels" });
      await expect(list).toBeVisible();
      await list.getByRole("option", { name: "Design" }).click();
      await expect(chips).toHaveText(["Engineering"]);
      await page.keyboard.press("Backspace");
      await expect(chips).toHaveCount(0);
      await expect(ex.locator('input[type="hidden"][name="labels"]')).toHaveCount(0);
    });

    test("create: choose the create row, then the new record is selected", async ({ page }) => {
      await open(page, "record-picker", { renderer });
      const ex = example(page, "labels");
      const input = ex.getByRole("combobox", { name: "Labels" });
      await input.click();
      await input.pressSequentially("Maya");
      const create = ex.getByRole("option", { name: "Create “Maya”" });
      await expect(create).toBeVisible();
      if (renderer === "html") {
        await page.evaluate(() => {
          (window as unknown as { __created: unknown[] }).__created = [];
          document.addEventListener("ayy-create", (event) => (window as unknown as { __created: unknown[] }).__created.push((event as CustomEvent).detail));
        });
      }
      await create.click();
      await expect(ex.locator(".ayy-record-picker__tag")).toHaveText(["Maya"]);
      if (renderer === "html") {
        expect(await page.evaluate(() => (window as unknown as { __created: unknown[] }).__created)).toEqual([{ id: "maya", label: "Maya" }]);
      }
    });

    test("keyboard: arrows move the active option, Escape closes and clears the query", async ({ page }) => {
      await open(page, "record-picker", { renderer });
      const ex = example(page, "labels");
      const input = ex.getByRole("combobox", { name: "Labels" });
      await input.click();
      await input.pressSequentially("e");
      const list = ex.getByRole("listbox", { name: "Labels" });
      const active = list.locator('[role="option"][data-active="true"]');
      await expect(active).toHaveCount(1);
      const first = await active.textContent();
      await input.press("ArrowDown");
      expect(await active.textContent()).not.toBe(first);
      await input.press("Escape");
      await expect(list).toBeHidden();
      await expect(input).toHaveValue("");
      await expect(input).toBeFocused();
    });

    test("an IME Enter does not select", async ({ page }) => {
      await open(page, "record-picker", { renderer });
      const ex = example(page, "people");
      const input = ex.getByRole("combobox", { name: "Assignee" });
      await input.click();
      await input.pressSequentially("ada");
      await input.evaluate((el) => {
        el.dispatchEvent(new CompositionEvent("compositionstart", { bubbles: true }));
        el.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true, isComposing: true } as KeyboardEventInit));
      });
      await expect(ex.locator(".ayy-record-picker__tag")).toHaveCount(0);
    });

    test("a long name stays inside the field at phone width", async ({ page }) => {
      await page.setViewportSize({ width: 320, height: 800 });
      await open(page, "record-picker", { renderer });
      const ex = example(page, "people");
      const input = ex.getByRole("combobox", { name: "Assignee" });
      await input.click();
      await input.pressSequentially("Alexandria");
      await input.press("Enter");
      const field = ex.locator(".ayy-record-picker");
      expect(await field.evaluate((el) => el.scrollWidth <= el.clientWidth + 1)).toBe(true);
    });
  });
}

```

Add the controlled test to `tests/e2e/regressions.spec.ts` with the `reactPage` helper:

```ts
test("React RecordPicker follows a controlled value", async ({ page }) => {
  await reactPage(
    page,
    `import { useState } from "react";
    import { RecordPicker } from "ayywi";
    const options = [
      { id: "ada", label: "Ada Lovelace", description: "ada@example.com" },
      { id: "grace", label: "Grace Hopper", description: "grace@example.com" },
    ];
    function App() {
      const [value, setValue] = useState<string[]>([]);
      return (
        <div>
          <button type="button" onClick={() => setValue(["grace"])}>Assign Grace</button>
          <RecordPicker aria-label="Assignee" options={options} value={value} onValueChange={setValue} />
        </div>
      );
    }`,
  );
  await page.getByRole("button", { name: "Assign Grace" }).click();
  await expect(page.locator(".ayy-record-picker__tag")).toHaveText(["Grace Hopper"]);
});
```

- [ ] **Step 2: Run the tests to see them fail**

Run: `pnpm exec playwright test tests/e2e/record-picker.spec.ts`
Expected: FAIL — `/#/record-picker` has no page or example.

- [ ] **Step 3: Add the static field, listbox and examples**

Create the CSS, class helper, React markup (no controller yet: options render, chips render, listbox closed), meta, and the two examples (`people`: single, Ada Lovelace, Grace Hopper, Alexandria Ocasio-Cortez and Alan Turing, with descriptions and icons; `labels`: multiple + creatable). The root carries `ayy-record-picker ayy-tag-input ayy-combobox`; the listbox uses the combobox classes. Selected options render `aria-selected="true"`; the active option starts as `data-active="false"`. Add `ayy-record-picker { display: contents; }` for the custom element wrapper.

Run: `pnpm exec playwright test tests/e2e/record-picker.spec.ts -g "single pick"`
Expected: FAIL at typing: the listbox never opens.

- [ ] **Step 4: Add `connectRecordPicker` and the React/element wiring**

Implement the controller in `record-picker.ts`:
- `open`/`close` use the Popover API when available, else `hidden`; place with `autoPlace(listbox, root, { side: "bottom", align: "start", offset: 4 })`, and set `minInlineSize` from the root's `offsetWidth`.
- Filter options by `data-label` + `data-keywords` (case-insensitive) when `filter` is true. `refresh()` re-reads the options after React/DOM changes.
- Keep focus in the input; `pointerdown` on the listbox is prevented. ArrowDown/Up move `data-active` and `aria-activedescendant` (no wrap); Enter calls `onSelect(active)` or `onCreate(query)` when the create row is active; Escape closes and clears the query; Backspace on an empty input calls `onRemoveLast`; Tab closes; `focus`/`click` opens; blur closes.
- The create row is shown only when `creatable`, the query is non-empty, and no option label matches exactly; its label uses `createLabel`. It is part of the active-option list. Selecting it calls `onCreate` and clears the query.
- The controller does not change chips or `aria-selected`; React and the element do. React toggles in multiple mode, replaces in single mode, closes after a single pick, clears the query after every pick, and creates with `onCreate(label)` (if it returns an option, select it; otherwise clear and let the consumer update `options`/`value`). The element adds/removes chips with `recordPickerChip`, updates `aria-selected`, hidden inputs and emits `ayy-change`; `ayy-create` uses a slug of the label as the id (lower-case, non-alphanumerics to `-`, `-2` on collision) so the plain HTML demo works, and the app replaces the id on the event. When the listbox has no `aria-label`/`aria-labelledby`, the controller copies the input's `aria-labelledby` (else its `aria-label`) onto it, so `getByRole("listbox", { name: "Assignee" })` works. The examples label the input with a visible `<Label id="…" htmlFor="…">` and `aria-labelledby`.
- Clear button clears all chips and focuses the input; each chip × removes one and keeps focus.

Run: `pnpm exec playwright test tests/e2e/record-picker.spec.ts`
Expected: PASS both renderers.

- [ ] **Step 5: Complete the component checklist, run the gate and commit**

Add the CSS import, index exports, element registration and tag lists, `ORDER`, README count/Forms row, CHANGELOG. Run `pnpm build && pnpm typecheck && pnpm check && pnpm test`, then the targeted e2e. Fix everything.

```bash
git add src/components/record-picker src/css/index.css src/index.ts src/react/index.ts src/elements/index.ts scripts/lib/contract.mjs AGENTS.md ai/skills/ayywi/SKILL.md README.md CHANGELOG.md manifest llms llms.txt llms-full.txt ai/skills/ayywi/reference.md tests/e2e/record-picker.spec.ts tests/e2e/regressions.spec.ts
git commit -m "Record picker: add RecordPicker and <ayy-record-picker>"
```

---

### Task 3: Property list

**Files:**
- Create: `src/components/property-list/property-list.css`
- Create: `src/components/property-list/property-list.ts`
- Create: `src/components/property-list/property-list.react.tsx`
- Create: `src/components/property-list/property-list.meta.json`
- Create: `src/components/property-list/examples/record.html`, `record.tsx`
- Create: `src/components/property-list/examples/compact.html`, `compact.tsx`
- Create: `tests/e2e/property-list.spec.ts`
- Modify: `src/css/index.css` (import after `list.css`)
- Modify: `src/index.ts`, `src/react/index.ts`
- Modify: `scripts/lib/contract.mjs` (`ORDER` after `list`)
- Modify: `README.md` (count 75 → 76; Data display row), `CHANGELOG.md`

**Interfaces:**
- Consumes: `InlineEdit` from Task 1 (for the editable value example); `Badge`, `Avatar`, `Chip` in the example only; `FieldError` if a value is invalid.
- Produces:
  - `propertyListClass({ compact?: boolean; className?: string }): string`
  - Constants `propertyListRowClass`, `propertyListTermClass`, `propertyListLabelClass`, `propertyListIconClass`, `propertyListValueClass`, `propertyListEmptyClass`
  - React `PropertyList` props `{ compact?: boolean }` and native `<dl>` props
  - React `PropertyRow` props `{ label: ReactNode; icon?: ReactNode; empty?: boolean; emptyText?: ReactNode; children?: ReactNode }` and native `<div>` props

**Markup contract:**
```html
<dl class="ayy-property-list">
  <div class="ayy-property-list__row">
    <dt class="ayy-property-list__term">
      <svg class="ayy-icon ayy-property-list__icon" aria-hidden="true">…</svg>
      <span class="ayy-property-list__label">Status</span>
    </dt>
    <dd class="ayy-property-list__value"><span class="ayy-badge ayy-badge--success">Live</span></dd>
  </div>
  <div class="ayy-property-list__row">
    <dt class="ayy-property-list__term"><span class="ayy-property-list__label">Updated</span></dt>
    <dd class="ayy-property-list__value"><span class="ayy-property-list__empty">Not set</span></dd>
  </div>
</dl>
```
Rows are flex-wrap: the term takes `flex: 0 1 8rem`, the value `flex: 1 1 10rem`; when the value cannot fit it wraps under the term. `--compact` reduces block padding and term basis. `overflow-wrap: anywhere` on the value. Read-only values are plain content; editable values nest `InlineEdit`; empty values render `PropertyRow empty emptyText="Not set"`. There is no element and no JS.

- [ ] **Step 1: Write the failing e2e tests**

Create `tests/e2e/property-list.spec.ts`:

```ts
import { expect, test } from "@playwright/test";
import { example, open } from "./helpers";

for (const renderer of ["react", "html"] as const) {
  test.describe(`property list (${renderer})`, () => {
    test("rows are a definition list with one term and one value", async ({ page }) => {
      await open(page, "property-list", { renderer });
      const rows = example(page, "record").locator(".ayy-property-list__row");
      await expect(rows).toHaveCount(6);
      for (const row of await rows.all()) {
        await expect(row.locator("dt")).toHaveCount(1);
        await expect(row.locator("dd")).toHaveCount(1);
      }
    });

    test("empty values read Not set and compact rows are tighter", async ({ page }) => {
      await open(page, "property-list", { renderer });
      const empty = example(page, "compact").getByText("Not set").first();
      await expect(empty).toBeVisible();
      const color = await empty.evaluate((el) => getComputedStyle(el).color);
      const muted = await example(page, "compact").locator(".ayy-property-list__label").first().evaluate((el) => getComputedStyle(el).color);
      expect(color).toBe(muted);
      const padding = (id: string) => example(page, id).locator(".ayy-property-list__row").first().evaluate((el) => parseFloat(getComputedStyle(el).paddingBlockStart));
      expect(await padding("compact")).toBeLessThan(await padding("record"));
    });

    test("a long value wraps at phone width", async ({ page }) => {
      await page.setViewportSize({ width: 320, height: 800 });
      await open(page, "property-list", { renderer });
      const value = example(page, "record").locator(".ayy-property-list__value").filter({ hasText: "Averyveryvery" });
      await expect(value).toBeVisible();
      expect(await value.evaluate((el) => el.scrollWidth <= el.clientWidth + 1)).toBe(true);
    });

    test("an editable value uses InlineEdit and commits in place", async ({ page }) => {
      await open(page, "property-list", { renderer });
      const display = example(page, "record").getByRole("button", { name: "Change the version" });
      await expect(display).toHaveText("1.4.0");
      await display.click();
      const input = example(page, "record").getByRole("textbox", { name: "Change the version" });
      await input.fill("1.4.1");
      await input.press("Enter");
      await expect(display).toHaveText("1.4.1");
    });
  });
}
```

- [ ] **Step 2: Run the tests to see them fail**

Run: `pnpm exec playwright test tests/e2e/property-list.spec.ts`
Expected: FAIL — `/#/property-list` has no page or example.

- [ ] **Step 3: Add the component, examples and gate**

Create the CSS, helper, React components, meta, and two examples:
- `record`: 6 rows — Status (Badge), Owner (Avatar + name), Version (editable `InlineEdit`), Due date (read-only text), Tags (Chips), Description (a long unbroken string to exercise wrapping). The term label uses `--ayy-color-muted`, the value `--ayy-color-text`, and the empty value `--ayy-color-muted`.
- `compact`: read-only rows with an empty "Updated" value and a long unbroken "Checksum" value.

Add the CSS import, helper export, React export, `ORDER` slug, README count/Data display row and CHANGELOG entry. Run `pnpm build && pnpm typecheck && pnpm check && pnpm test`, then the targeted e2e. Fix everything.

```bash
git add src/components/property-list src/css/index.css src/index.ts src/react/index.ts scripts/lib/contract.mjs README.md CHANGELOG.md manifest llms llms.txt llms-full.txt ai/skills/ayywi/reference.md tests/e2e/property-list.spec.ts
git commit -m "Property list: add PropertyList and PropertyRow"
```

---

### Task 4: Tree navigation core

**Files:**
- Create: `src/components/tree/tree.css`
- Create: `src/components/tree/tree.ts`
- Create: `src/components/tree/tree.react.tsx`
- Create: `src/components/tree/tree.element.ts`
- Create: `src/components/tree/tree.meta.json`
- Create: `src/components/tree/examples/folders.html`, `folders.tsx`
- Create: `src/components/tree/examples/picker.html`, `picker.tsx`
- Create: `tests/e2e/tree.spec.ts`
- Modify: `tests/e2e/regressions.spec.ts` (controlled selected/expanded Tree test with the existing `reactPage` helper)
- Modify: `src/css/index.css` (import after `toc.css`)
- Modify: `src/index.ts`, `src/react/index.ts`, `src/elements/index.ts`
- Modify: `scripts/lib/contract.mjs` (`ORDER` after `toc`; `RULES` element line)
- Modify: `AGENTS.md`, `ai/skills/ayywi/SKILL.md`
- Modify: `README.md` (count 76 → 77; Navigation row), `CHANGELOG.md`

**Interfaces:**
- Consumes: nothing from Tasks 1–3 for the core (Task 5 consumes `InlineEdit`).
- Produces:
  - `treeClass({ compact?: boolean; className?: string }): string`
  - `connectTree(root: HTMLElement, options?: TreeControllerOptions): TreeController`
  - `TreeControllerOptions { onSelect?(id: string): void; onActivate?(id: string): void; onToggle?(id: string, expanded: boolean): void }`
  - `TreeController { focus(id?: string): void; destroy(): void }`
  - `treeChevronIcon: string` (SVG markup for `ArrowRight01Icon` with `ayy-icon--directional`)
  - React `TreeNode { id: string; label: string; icon?: ReactNode; children?: TreeNode[]; disabled?: boolean }`
  - React `Tree` props: `label: string`, `nodes: TreeNode[]`, `expandedIds?: string[]`, `defaultExpandedIds?: string[]`, `onExpandedChange?(ids: string[]): void`, `selectedId?: string`, `defaultSelectedId?: string`, `onSelectedChange?(id: string | null): void`, `onActivate?(id: string): void`, `compact?: boolean`, plus native `<ul>` props except `onSelect`.
  - Element `<ayy-tree>`: no attributes; events `ayy-select` `{ id }`, `ayy-activate` `{ id }`, `ayy-toggle` `{ id, expanded }`; public `focus(id?)`.

**Markup contract:**
```html
<ayy-tree>
  <ul class="ayy-tree" role="tree" aria-label="Folders">
    <li class="ayy-tree__item" role="treeitem" aria-level="1" aria-expanded="true" aria-selected="false" aria-label="Projects" data-id="projects" tabindex="-1">
      <div class="ayy-tree__row">
        <span class="ayy-tree__toggle" aria-hidden="true"><svg class="ayy-icon ayy-icon--directional">…</svg></span>
        <svg class="ayy-icon ayy-tree__icon" aria-hidden="true">…</svg>
        <span class="ayy-tree__label">Projects</span>
      </div>
      <ul class="ayy-tree__group" role="group">
        <li class="ayy-tree__item" role="treeitem" aria-level="2" aria-selected="true" aria-label="Q4 launch" data-id="q4" tabindex="0">…</li>
      </ul>
    </li>
  </ul>
</ayy-tree>
```
The `li` is the treeitem and the roving tab stop; `aria-label` is the node label (so the rename action never becomes part of its name); a nested `<ul role="group" hidden>` holds children. Every treeitem carries `aria-selected="true"` or `"false"`; only parents carry `aria-expanded`. The toggle is a decorative `span` with `aria-hidden="true"`; the treeitem's `aria-expanded` carries the state. The chevron rotates with `--_ayy-dir` so it points down when expanded in both directions. Only one visible treeitem has `tabindex="0"`; the selected node (or the first) starts with it.

- [ ] **Step 1: Write the failing e2e tests**

Create `tests/e2e/tree.spec.ts`:

```ts
import { expect, test } from "@playwright/test";
import { example, keyboardFocus, open, rtl } from "./helpers";

for (const renderer of ["react", "html"] as const) {
  test.describe(`tree (${renderer})`, () => {
    test("keyboard: expand, collapse, children, parents, Home and End", async ({ page }) => {
      await open(page, "tree", { renderer });
      const ex = example(page, "folders");
      const tree = ex.getByRole("tree", { name: "Folders" });
      const projects = tree.getByRole("treeitem", { name: "Projects", exact: true });
      const launch = tree.getByRole("treeitem", { name: "Q4 launch", exact: true });
      await keyboardFocus(projects);
      await expect(projects).toBeFocused();
      await expect(projects).toHaveAttribute("aria-expanded", "true");

      await page.keyboard.press("ArrowRight"); // collapse
      await expect(projects).toHaveAttribute("aria-expanded", "false");
      await page.keyboard.press("ArrowRight"); // expand
      await expect(projects).toHaveAttribute("aria-expanded", "true");
      await page.keyboard.press("ArrowRight"); // first child
      await expect(launch).toBeFocused();
      expect(await launch.getAttribute("aria-level")).toBe("2");
      await page.keyboard.press("ArrowLeft"); // parent
      await expect(projects).toBeFocused();
      await page.keyboard.press("ArrowLeft"); // collapse
      await expect(projects).toHaveAttribute("aria-expanded", "false");
      await page.keyboard.press("ArrowDown");
      await expect(tree.getByRole("treeitem", { name: "Team", exact: true })).toBeFocused();
      await page.keyboard.press("End");
      await expect(tree.getByRole("treeitem").last()).toBeFocused();
      await page.keyboard.press("Home");
      await expect(projects).toBeFocused();
    });

    test("a toggle expands without selecting; a row selects; Enter activates", async ({ page }) => {
      await open(page, "tree", { renderer });
      const ex = example(page, "folders");
      const tree = ex.getByRole("tree", { name: "Folders" });
      const projects = tree.getByRole("treeitem", { name: "Projects", exact: true });
      const launch = tree.getByRole("treeitem", { name: "Q4 launch", exact: true });
      await expect(launch).toHaveAttribute("aria-selected", "true");
      await projects.locator(".ayy-tree__toggle").click();
      await expect(projects).toHaveAttribute("aria-expanded", "false");
      await expect(launch).toHaveAttribute("aria-selected", "true");
      await projects.locator(".ayy-tree__toggle").click();
      await launch.click();
      await expect(launch).toHaveAttribute("aria-selected", "true");
      if (renderer === "react") {
        await page.keyboard.press("Enter");
        await expect(ex.getByRole("status")).toHaveText("Opened Q4 launch");
      } else {
        await page.evaluate(() => {
          (window as unknown as { __opened: unknown[] }).__opened = [];
          document.addEventListener("ayy-activate", (event) => (window as unknown as { __opened: unknown[] }).__opened.push((event as CustomEvent).detail));
        });
        await page.keyboard.press("Enter");
        expect(await page.evaluate(() => (window as unknown as { __opened: unknown[] }).__opened)).toEqual([{ id: "q4" }]);
      }
    });

    test("a disabled node cannot be selected or activated", async ({ page }) => {
      await open(page, "tree", { renderer });
      const ex = example(page, "folders");
      const tree = ex.getByRole("tree", { name: "Folders" });
      const locked = tree.getByRole("treeitem", { name: "Shared with me", exact: true });
      await expect(locked).toHaveAttribute("aria-disabled", "true");
      await locked.click();
      await expect(locked).toHaveAttribute("aria-selected", "false");
      await keyboardFocus(locked);
      await page.keyboard.press("Enter");
      await expect(ex.getByRole("status")).not.toHaveText(/Shared with me/);
    });

    test("RTL indents from the right and mirrors the chevron", async ({ page }) => {
      await open(page, "tree", { renderer });
      const ex = example(page, "folders");
      const tree = ex.getByRole("tree", { name: "Folders" });
      const parent = tree.getByRole("treeitem", { name: "Projects", exact: true });
      const child = tree.getByRole("treeitem", { name: "Q4 launch", exact: true });
      const row = parent.locator(":scope > .ayy-tree__row");
      const childRow = child.locator(":scope > .ayy-tree__row");
      const left = (l: typeof row) => l.evaluate((el) => el.getBoundingClientRect().x);
      const right = (l: typeof row) => l.evaluate((el) => el.getBoundingClientRect().right);
      expect(await left(childRow)).toBeGreaterThan(await left(row));
      const chevron = parent.locator(".ayy-tree__toggle svg");
      const before = await chevron.evaluate((el) => getComputedStyle(el).transform);
      await rtl(ex);
      expect(await right(childRow)).toBeLessThan(await right(row));
      expect(await chevron.evaluate((el) => getComputedStyle(el).transform)).not.toBe(before);
    });

    test("a long label wraps inside the row at phone width", async ({ page }) => {
      await page.setViewportSize({ width: 320, height: 800 });
      await open(page, "tree", { renderer });
      const ex = example(page, "folders");
      const row = ex.getByRole("tree", { name: "Folders" }).getByRole("treeitem", { name: /Averyveryvery/ });
      await expect(row).toBeVisible();
      expect(await row.evaluate((el) => el.scrollWidth <= el.clientWidth + 1)).toBe(true);
    });

    test("the picker selects without activating", async ({ page }) => {
      await open(page, "tree", { renderer });
      const ex = example(page, "picker");
      const tree = ex.getByRole("tree", { name: "Choose a folder" });
      await tree.getByRole("treeitem", { name: "Marketing", exact: true }).click();
      await expect(tree.getByRole("treeitem", { name: "Marketing", exact: true })).toHaveAttribute("aria-selected", "true");
      await expect(tree.getByRole("treeitem", { name: "Marketing", exact: true })).toBeFocused();
    });
  });
}

```

Add the controlled test to `tests/e2e/regressions.spec.ts` with the `reactPage` helper:

```ts
test("React Tree follows external selected and expanded ids", async ({ page }) => {
  await reactPage(
    page,
    `import { useState } from "react";
    import { Tree } from "ayywi";
    const nodes = [
      { id: "projects", label: "Projects", children: [{ id: "q4", label: "Q4 launch" }] },
      { id: "team", label: "Team" },
    ];
    function App() {
      const [expanded, setExpanded] = useState(["projects"]);
      const [selected, setSelected] = useState("q4");
      return (
        <div>
          <button type="button" onClick={() => setSelected("team")}>Select Team</button>
          <button type="button" onClick={() => setExpanded([])}>Collapse all</button>
          <Tree label="Folders" nodes={nodes} expandedIds={expanded} onExpandedChange={setExpanded} selectedId={selected} onSelectedChange={(id) => setSelected(id ?? "")} />
        </div>
      );
    }`,
  );
  const tree = page.getByRole("tree", { name: "Folders" });
  await page.getByRole("button", { name: "Select Team" }).click();
  await expect(tree.getByRole("treeitem", { name: "Team", exact: true })).toHaveAttribute("aria-selected", "true");
  await page.getByRole("button", { name: "Collapse all" }).click();
  await expect(tree.getByRole("treeitem", { name: "Projects", exact: true })).toHaveAttribute("aria-expanded", "false");
});
```

The `folders` example has a disabled node "Shared with me" with `aria-disabled="true"`, a long label "Averyveryvery…", and an output with `role="status"`. Its initial state is `Projects` expanded and `Q4 launch` selected. The HTML twin keeps the same status element but only the element event `ayy-activate` carries the result; the test reads that event. The `picker` example is a Card with a tree labelled "Choose a folder"; Marketing is a visible child of an expanded Team, selecting a row updates `aria-selected`, and nothing is activated, which is the picker contract.

- [ ] **Step 2: Run the tests to see them fail**

Run: `pnpm exec playwright test tests/e2e/tree.spec.ts`
Expected: FAIL — `/#/tree` has no page or example.

- [ ] **Step 3: Add the static tree, React rendering and examples**

Create the CSS, helper, React data-driven renderer, meta and both examples. CSS: `ayy-tree { display: contents; }` for the wrapper; row flex, toggle 1.25rem, label `flex: 1; min-inline-size: 0; overflow-wrap: anywhere`, group `padding-inline-start: var(--ayy-space-5)`, selected row wash-hover, focus ring on the row (`outline-offset: -2px`), disabled opacity and not-allowed, `--compact` smaller row and indent. Chevron rotation:
```css
.ayy-tree__item[aria-expanded="true"] > .ayy-tree__row .ayy-tree__toggle > svg {
  transform: rotate(calc(90deg * var(--_ayy-dir, 1)));
}
```
React renders `aria-level`, `aria-expanded` only on parents, `aria-selected` on every item (`"true"`/`"false"`), `aria-label` from `label`, nested groups `hidden` when collapsed, and `tabIndex={-1}` on every item (the controller raises one to `0`; React won't rewrite an unchanged prop).

Run: `pnpm exec playwright test tests/e2e/tree.spec.ts -g "row selects|picker|disabled node"`
Expected: the static assertions pass; keyboard/activation tests fail.

- [ ] **Step 4: Add `connectTree` and `<ayy-tree>`**

Implement `connectTree` in `tree.ts`:
- Cache nothing; query `[role="treeitem"]` and treat an item as visible when no ancestor `[role="group"][hidden]` exists.
- On connect, set `aria-level` from nesting if missing and make the selected item (or the first item) `tabindex="0"`; a `focusin` listener moves the roving tab stop to whichever treeitem receives focus (clicks in Safari don't focus a `tabindex="-1"` element on their own, so focus it from the click handler).
- Pointer: click on `.ayy-tree__toggle` toggles `aria-expanded` and the direct group's `hidden`, focuses the item, and calls `onToggle`; a click elsewhere on the row focuses/selects and calls `onSelect`; double-click calls `onActivate`; clicks inside `.ayy-inline-edit`, `button`, `input` or `textarea` are ignored.
- Keyboard (on the focused treeitem): ArrowDown/Up next/previous visible item; ArrowRight expands or focuses the first child; ArrowLeft collapses or focuses the parent; Home/End first/last visible; Enter `onActivate`; Space `onSelect`. Skip when `event.isComposing` or the target is an input/button.
- Roving tabindex: exactly one visible item has `tabindex="0"`; focus moves with the active item.
- The element calls the controller and emits the three events. Register it and add the tag to the three element lists.

Run: `pnpm exec playwright test tests/e2e/tree.spec.ts`
Expected: PASS both renderers.

- [ ] **Step 5: Complete the component checklist, run the gate and commit**

Add the CSS import, index exports, element registration and tag lists, `ORDER`, README count/Navigation row, CHANGELOG. Run `pnpm build && pnpm typecheck && pnpm check && pnpm test`, then the targeted e2e. Fix everything.

```bash
git add src/components/tree src/css/index.css src/index.ts src/react/index.ts src/elements/index.ts scripts/lib/contract.mjs AGENTS.md ai/skills/ayywi/SKILL.md README.md CHANGELOG.md manifest llms llms.txt llms-full.txt ai/skills/ayywi/reference.md tests/e2e/tree.spec.ts tests/e2e/regressions.spec.ts
git commit -m "Tree: add Tree and <ayy-tree> navigation"
```

---

### Task 5: Tree rename

**Files:**
- Modify: `src/components/tree/tree.css`
- Modify: `src/components/tree/tree.ts` (icon export)
- Modify: `src/components/tree/tree.react.tsx`
- Modify: `src/components/tree/tree.element.ts`
- Modify: `src/components/tree/tree.meta.json`
- Modify: `src/components/tree/examples/folders.html`, `folders.tsx`
- Modify: `src/lib/icons.ts`, `tests/node/icons.test.mjs`
- Modify: `tests/e2e/tree.spec.ts`
- Modify: `CHANGELOG.md` (extend the Tree entry)

**Interfaces:**
- Consumes: `InlineEdit` from Task 1; `Tree`, `TreeNode` and `connectTree` from Task 4.
- Produces:
  - `treeRenameIcon: string` (SVG markup for Hugeicons `PencilEdit01Icon`)
  - React `Tree` props add `renamable?: boolean`, `onRename?(id: string, label: string): void`, `renameLabel?(label: string): string` (default `Rename ${label}`)
  - Element `<ayy-tree>` adds event `ayy-rename` `{ id, label }`
  - CSS classes `ayy-tree__actions`, `ayy-tree__action`, `ayy-tree__rename`

**Markup contract:**
```html
<li class="ayy-tree__item" role="treeitem" aria-label="Q4 launch" data-id="q4" tabindex="-1">
  <div class="ayy-tree__row">
    <span class="ayy-tree__toggle" aria-hidden="true">…</span>
    <span class="ayy-tree__label">Q4 launch</span>
    <span class="ayy-tree__actions">
      <button type="button" class="ayy-tree__action" aria-label="Rename Q4 launch" data-rename>…pencil…</button>
    </span>
  </div>
</li>
```
The action is always in the DOM at `opacity: .6` and reaches full opacity on row hover/focus-within, so it stays keyboard reachable. The pencil is `treeRenameIcon`; add `PencilEdit01Icon` to `src/lib/icons.ts` and assert it matches the package in `icons.test.mjs`. While renaming, the label is replaced by `<ayy-inline-edit>` (React renders `<InlineEdit defaultEditing label={renameLabel(label)} value={label} …>`); its input has no visible display state.

- [ ] **Step 1: Write the failing rename tests**

Append to `tests/e2e/tree.spec.ts` inside the renderer loop:

```ts
test("rename: the action swaps in an inline edit, Enter commits and focus returns", async ({ page }) => {
  await open(page, "tree", { renderer });
  const ex = example(page, "folders");
  const tree = ex.getByRole("tree", { name: "Folders" });
  const item = tree.getByRole("treeitem", { name: "Q4 launch", exact: true });
  await item.getByRole("button", { name: "Rename Q4 launch" }).click();
  const input = ex.getByRole("textbox", { name: "Rename Q4 launch" });
  await expect(input).toBeVisible();
  await expect(input).toHaveValue("Q4 launch");
  await input.fill("Q4 launch 2027");
  await input.press("Enter");
  const renamed = tree.getByRole("treeitem", { name: "Q4 launch 2027", exact: true });
  await expect(renamed).toBeVisible();
  await expect(renamed).toBeFocused();
  await expect(renamed.getByRole("button", { name: "Rename Q4 launch 2027" })).toBeVisible();
});

test("rename: Escape restores the old label", async ({ page }) => {
  await open(page, "tree", { renderer });
  const ex = example(page, "folders");
  const tree = ex.getByRole("tree", { name: "Folders" });
  const item = tree.getByRole("treeitem", { name: "Q4 launch", exact: true });
  await item.getByRole("button", { name: "Rename Q4 launch" }).click();
  await ex.getByRole("textbox", { name: "Rename Q4 launch" }).fill("Discarded");
  await page.keyboard.press("Escape");
  await expect(tree.getByRole("treeitem", { name: "Q4 launch", exact: true })).toBeVisible();
  await expect(tree.getByRole("treeitem", { name: "Q4 launch", exact: true })).toBeFocused();
});

test("rename: a long new label stays inside the row", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await open(page, "tree", { renderer });
  const ex = example(page, "folders");
  const tree = ex.getByRole("tree", { name: "Folders" });
  const item = tree.getByRole("treeitem", { name: "Q4 launch", exact: true });
  await item.getByRole("button", { name: "Rename Q4 launch" }).click();
  await ex.getByRole("textbox", { name: "Rename Q4 launch" }).fill("Averyveryveryverylongunbrokenfolderrenamethatmustfit");
  await page.keyboard.press("Enter");
  const renamed = tree.getByRole("treeitem", { name: /Averyveryvery/ });
  expect(await renamed.evaluate((el) => el.scrollWidth <= el.clientWidth + 1)).toBe(true);
});
```

- [ ] **Step 2: Run the tests to see them fail**

Run: `pnpm exec playwright test tests/e2e/tree.spec.ts -g "rename"`
Expected: FAIL — there is no rename action.

- [ ] **Step 3: Implement rename in React and the element**

React: add `renamingId` state; when `renamable` and `onRename` are set, render the action; on click set `renamingId`, replace the label with `InlineEdit defaultEditing`, `label={renameLabel(node.label)}`, `value={node.label}`, `onValueChange={(next) => { onRename?.(node.id, next); setRenamingId(null); }}`, `onCancel={() => setRenamingId(null)}`. Keep a controller ref; after `renamingId` becomes null, call `controller.focus(id)` so focus lands on the treeitem, not `body`. Ignore tree click/keydown events that originate inside `.ayy-inline-edit`.

Element: on `[data-rename]` click, find the row's `.ayy-tree__label`, replace it with an `<ayy-inline-edit>` built from the same classes (display mode, `aria-label` = `Rename <label>`), append it, call its public `startEditing()`, and listen for `ayy-change`/`ayy-edit`: on `ayy-change` update the label and `aria-label`, emit `ayy-rename`; when editing ends, remove the editor and call `controller.focus(id)`. Escape restores the old label. The tree controller must ignore clicks and keys from the editor.

Run: `pnpm exec playwright test tests/e2e/tree.spec.ts -g "rename"`
Expected: PASS both renderers.

- [ ] **Step 4: Update metadata, icon test and CHANGELOG; run the gate and commit**

Add the new classes, props and `ayy-rename` to the meta; add `treeRenameIcon` to `js`; add the glyph to `src/lib/icons.ts` and its assertion to `tests/node/icons.test.mjs`; extend the Tree CHANGELOG entry to mention rename. Run `pnpm build && pnpm typecheck && pnpm check && pnpm test`, then the targeted e2e.

```bash
git add src/components/tree src/lib/icons.ts tests/node/icons.test.mjs tests/e2e/tree.spec.ts CHANGELOG.md manifest llms llms.txt llms-full.txt ai/skills/ayywi/reference.md
git commit -m "Tree: rename nodes inline"
```

---

### Task 6: Tree move intents and final verification

**Files:**
- Modify: `src/components/tree/tree.ts`
- Modify: `src/components/tree/tree.react.tsx`
- Modify: `src/components/tree/tree.element.ts`
- Modify: `src/components/tree/tree.meta.json`
- Modify: `src/components/tree/examples/folders.html`, `folders.tsx`
- Create: `tests/node/tree.test.mjs`
- Modify: `tests/e2e/tree.spec.ts`
- Modify: `CHANGELOG.md` (extend the Tree entry)

**Interfaces:**
- Consumes: `Tree` core from Task 4 and rename from Task 5.
- Produces:
  - `TreeMove { id: string; parentId: string | null; index: number }`
  - `TreeItemLike { id: string; children?: readonly TreeItemLike[] }`
  - `treeContains<T extends TreeItemLike>(nodes: readonly T[], ancestorId: string, id: string): boolean`
  - `moveTreeItem<T extends TreeItemLike>(nodes: readonly T[], move: TreeMove): T[]` — returns a new array with the item reinserted at `index` in the destination (after removal), or the original array when the move is invalid (including moving a node into its own subtree). It never mutates.
  - `TreeControllerOptions` adds `onMove?(move: TreeMove): void` and `canMove?(move: TreeMove): boolean`
  - React `Tree` props add `onMove?(move: TreeMove): void` and `canMove?(move: TreeMove): boolean`
  - Element `<ayy-tree>` adds event `ayy-move` `{ id, parentId, index }`
  - CSS classes: none new

**Move contract:**
- `Alt+ArrowUp`: before the previous sibling (`parentId` = current parent, `index` = target index in the destination after removal); no previous sibling means no move.
- `Alt+ArrowDown`: after the next sibling; no next sibling means no move.
- `canMove` runs first; when it returns false, no event fires. The tree never moves DOM itself; the consumer applies `moveTreeItem` and re-renders.
- `moveTreeItem` accepts any `parentId` and `index`, so a later drag task can produce before/after/inside/out moves through the same callback. The keyboard deliberately uses only Up/Down: Alt+Left/Right are browser history on Windows.
- Focus stays on the moved node; after a React update, the treeitem with the same id is focused and `tabindex="0"`.

- [ ] **Step 1: Write the failing move tests**

Add `tests/node/tree.test.mjs`:

```js
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const dist = (p) => fileURLToPath(new URL(`../../dist/${p}`, import.meta.url));
const skip = !existsSync(dist("index.js")) && "run pnpm build first";

test("moveTreeItem moves before, after, inside and out without mutating", { skip }, async () => {
  const { moveTreeItem } = await import(dist("index.js"));
  const nodes = [
    { id: "a", children: [{ id: "a1" }, { id: "a2" }] },
    { id: "b" },
    { id: "c" },
  ];
  const out = moveTreeItem(nodes, { id: "a2", parentId: null, index: 2 });
  assert.deepEqual(out.map((n) => n.id), ["a", "b", "a2", "c"]);
  assert.deepEqual(nodes[0].children.map((n) => n.id), ["a1", "a2"], "input is unchanged");
  const inside = moveTreeItem(nodes, { id: "a2", parentId: "b", index: 0 });
  assert.deepEqual(inside.find((n) => n.id === "b").children.map((n) => n.id), ["a2"]);
});

test("moving a node into its own subtree is refused", { skip }, async () => {
  const { moveTreeItem, treeContains } = await import(dist("index.js"));
  const nodes = [{ id: "a", children: [{ id: "a1" }] }];
  assert.equal(treeContains(nodes, "a", "a1"), true);
  assert.equal(treeContains(nodes, "a1", "a"), false);
  assert.equal(moveTreeItem(nodes, { id: "a", parentId: "a1", index: 0 }), nodes);
});
```

Append to `tests/e2e/tree.spec.ts` inside the renderer loop:

```ts
test("move: Alt+ArrowDown emits the intent and the app applies it", async ({ page }) => {
  await open(page, "tree", { renderer });
  const ex = example(page, "folders");
  const tree = ex.getByRole("tree", { name: "Folders" });
  const launch = tree.getByRole("treeitem", { name: "Q4 launch", exact: true });
  if (renderer === "html") {
    await page.evaluate(() => {
      (window as unknown as { __moves: unknown[] }).__moves = [];
      document.addEventListener("ayy-move", (event) => (window as unknown as { __moves: unknown[] }).__moves.push((event as CustomEvent).detail));
    });
  }
  await keyboardFocus(launch);
  await page.keyboard.press("Alt+ArrowDown");
  if (renderer === "react") {
    const labels = await tree.getByRole("treeitem").evaluateAll((els) => els.map((el) => el.getAttribute("aria-label")));
    expect(labels.indexOf("Q4 launch")).toBeGreaterThan(labels.indexOf("Q1 archive"));
    await expect(tree.getByRole("treeitem", { name: "Q4 launch", exact: true })).toBeFocused();
  } else {
    expect(await page.evaluate(() => (window as unknown as { __moves: unknown[] }).__moves)).toEqual([
      { id: "q4", parentId: "projects", index: 1 },
    ]);
  }
});

test("move: a canMove rejection fires nothing", async ({ page }) => {
  await open(page, "tree", { renderer });
  const ex = example(page, "folders");
  const tree = ex.getByRole("tree", { name: "Folders" });
  const archive = tree.getByRole("treeitem", { name: "Archive", exact: true });
  if (renderer === "html") {
    await page.evaluate(() => {
      (window as unknown as { __moves: unknown[] }).__moves = [];
      document.addEventListener("ayy-move", (event) => (window as unknown as { __moves: unknown[] }).__moves.push((event as CustomEvent).detail));
    });
  }
  await keyboardFocus(archive);
  await page.keyboard.press("Alt+ArrowUp");
  if (renderer === "react") {
    const labels = await tree.getByRole("treeitem").evaluateAll((els) => els.map((el) => el.getAttribute("aria-label")));
    expect(labels.at(-1)).toBe("Archive");
  } else {
    expect(await page.evaluate(() => (window as unknown as { __moves: unknown[] }).__moves)).toEqual([]);
  }
});
```

The `folders` example applies `onMove` with `moveTreeItem` and `canMove={({ id, parentId }) => id !== "archive" && (parentId === null || !treeContains(nodes, id, parentId))}`: Archive always stays last, and a node can never move inside its own subtree. The rejected test uses Archive. The HTML example only emits; the test reads the event.

- [ ] **Step 2: Run the tests to see them fail**

Run: `pnpm exec playwright test tests/e2e/tree.spec.ts -g "move"` and `pnpm build && node --test tests/node/tree.test.mjs`
Expected: FAIL — `treeContains`/`moveTreeItem` and the Alt+ArrowUp/Down handling don't exist.

- [ ] **Step 3: Implement the move helper, controller intents and React/element wiring**

Add `TreeMove`, `TreeItemLike`, `treeContains`, `moveTreeItem` to `tree.ts`; export them from `src/index.ts` (the barrel already re-exports the module, so add nothing if `export *` covers it). Add `onMove`/`canMove` to the controller options and the Alt+ArrowUp/Down handling, calling `canMove` before `onMove` and preventing the browser default. Add the React props and the element event. Update the `folders` example to apply the move and show the new order; update the HTML example with the same initial markup and the `ayy-move` contract comment. Update the meta with the props, helper docs and event. The React wrapper keeps the focused id and calls `controller.focus(id)` in a layout effect after `nodes` changes, so focus follows the moved item.

Run: `pnpm exec playwright test tests/e2e/tree.spec.ts -g "move"` and `pnpm build && node --test tests/node/tree.test.mjs`
Expected: PASS.

- [ ] **Step 4: Run the whole gate and the final review**

Run:
```sh
pnpm build && pnpm typecheck && pnpm check && pnpm test
pnpm test:e2e
scripts/check-all.sh
```
Expected: all pass. `pnpm check` includes the generated manifest/llms, README count and table, ORDER, element lists, meta ↔ CSS ↔ props ↔ examples, contrast and the new component pages; `pnpm test` includes the tree node test; `pnpm test:e2e` renders every new page in both renderers and runs axe over them.

Manually open `pnpm preview` and check each new component in dark and light, compact and touch, 390px and 1280px, and RTL. Confirm no horizontal scroll, no clipped focus ring, and the tree chevron points down when expanded in both directions. Then commit:

```bash
git add src/components/tree tests/e2e/tree.spec.ts tests/node/tree.test.mjs CHANGELOG.md manifest llms llms.txt llms-full.txt ai/skills/ayywi/reference.md
git commit -m "Tree: keyboard move intents"
```

---

## Done When

- `pnpm build && pnpm typecheck && pnpm check && pnpm test` pass on the branch.
- `pnpm test:e2e` and `scripts/check-all.sh` pass.
- The preview lists Inline edit, Record picker, Property list and Tree; their React and HTML examples start from the same markup and pass axe.
- README says 77 components and lists all four; `ORDER` contains all four; the changelog has one entry per component under `## Unreleased`.
- No generated file is hand-edited; `pnpm build` leaves the tree clean.
- The main checkout's uncommitted chart work is untouched; nothing is merged, pushed or released.
