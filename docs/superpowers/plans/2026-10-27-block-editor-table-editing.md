# Block editor table editing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use code-run-plan to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make table blocks easy to edit: per-row and per-column grips with scoped menus, drag to reorder, row/column selection with keyboard actions, sorting, and one pure, tested edit function behind all of it.

**Architecture:** Table changes move out of the 4,500-line editor closure into a DOM-free module, `block-editor-table.ts`, which exports `blockEditorEditTable(block, edit)` and is unit-tested in node. The editor (`block-editor.ts`) only renders grips, routes pointer and keyboard input, and calls that function through one `editTable(id, edit, focus)` helper. Menus reuse the existing block-actions popover (`MenuState` mode `"actions"`) with new `list` values.

**Tech Stack:** TypeScript, plain DOM (no framework in the editor core), CSS with `--ayy-*` tokens, node:test against `dist/`, Playwright e2e.

**Spec:** `docs/superpowers/specs/2026-10-27-block-editor-tables-and-blocks.md` (Part A)

## Global Constraints

- Before Task 1, the uncommitted Toggle and Table work must be on a branch (not main). Ask the maintainer if it isn't committed yet. Never release, bump versions or tag.
- Zero runtime dependencies. No hex/rgb/hsl in CSS. Logical properties only. No `:dir()`. Every class is `ayy-block-editor__*`. Private custom properties are `--_x`.
- State comes from attributes (`data-selected`, `data-hot`, `data-dragging`, `aria-expanded`). Every new colour-shown state gets a rule in the existing `@media (forced-colors: active)` block in `block-editor.css`.
- Limits (already in `block-editor.ts`): `MAX_ROWS = 100`, `MAX_COLUMNS = 12`, `MIN_COLUMN = 48`, `MAX_COLUMN = 1200` (px). A header row (`header !== false`) never moves, sorts or gets deleted while it's the only row.
- Never edit generated files (`manifest/`, `llms*`, `llms/`, `ai/skills/ayywi/reference.md`). Run `pnpm generate` (or `pnpm build`) and commit their output.
- `block-editor.meta.json` must list exactly the classes the CSS defines (`pnpm check` enforces it). Keep its hand formatting: edit it as text, never re-serialise it.
- e2e port: `export E2E_PORT=$((4200 + $$ % 300))` in your shell. Start `pnpm preview --port "$E2E_PORT" --strictPort --host 127.0.0.1` in a second terminal for scoped runs, using `E2E_REUSE=1`.
- CHANGELOG: amend the existing `**[Block editor](#/block-editor)**` line under `## Unreleased → ### Added`; don't add a separate entry for an unreleased component.

## Review Focus

1. **RTL.** In `dir="rtl"` the row grip sits on the right, column moves follow the reading direction, and drag-to-reorder computes the drop index from the inline-start edge. Pinned by an e2e test in Task 4.
2. **Header row.** Sorting, moving a row to index 0, or dragging the header row must leave row 0 in place when `header !== false`. Pinned by node tests in Task 1 and an e2e test in Task 4.
3. **Undo after each table edit.** One Mod+Z restores the whole previous table (one history step per edit, including a drag). Pinned in Task 5.
4. **Read-only.** No grips, no drag, no row/column selection; the table still renders. Pinned in Task 2.
5. **Selection versus focus.** A selected row with the caret in a cell, or clicking a cell while a row is selected, must not leave two things looking active. Clicking a cell clears the selection. Pinned in Task 5.

---

### Task 1: Pure table edits module

**Files:**
- Create: `src/components/block-editor/block-editor-table.ts`
- Modify: `src/components/block-editor/block-editor.ts`: re-export from it, and delete the closure's `Tbl`/`tblOf`/`insertRow`…`sizeColumn` bodies in favour of it (they're near the `// ---- Tables ----` comment, around lines 3500–3625)
- Test: `tests/node/block-editor.test.mjs` (extend)

**Interfaces:**
- Consumes: `BlockEditorBlock`, `BlockEditorTableAlign` and the limits `MAX_ROWS`, `MAX_COLUMNS`, `MIN_COLUMN`, `MAX_COLUMN` from `block-editor.ts`. Move those four constants and `tableGrid()` into the new file and import them back into `block-editor.ts`, so nothing imports in a circle.
- Produces:
  ```ts
  export type BlockEditorTableEdit =
    | { op: "insert-row"; at: number } | { op: "insert-column"; at: number }
    | { op: "delete-row"; at: number } | { op: "delete-column"; at: number }
    | { op: "duplicate-row"; at: number } | { op: "duplicate-column"; at: number }
    | { op: "move-row"; from: number; to: number } | { op: "move-column"; from: number; to: number }
    | { op: "clear"; rows: [number, number]; columns: [number, number] }   // inclusive ranges
    | { op: "align"; column: number; align: BlockEditorTableAlign }
    | { op: "width"; column: number; width: number; measured?: number[] } // width 0 = even out all
    | { op: "sort"; column: number; dir: "asc" | "desc" }
    | { op: "header"; row?: boolean; column?: boolean }
    | { op: "cells"; at: [number, number]; values: string[][] }       // paste: fills from `at`, growing the table up to the limits
  export function blockEditorEditTable(block: BlockEditorBlock, edit: BlockEditorTableEdit): BlockEditorBlock;
  export function tableGrid(raw: unknown): string[][]; // moved, unchanged
  ```
  Rules:
  - Returns `block` itself (the same reference) when the edit does nothing: out of range, over a limit, the last row or column, or moving a header row.
  - `widths` and `align` stay one entry per column, and are dropped when all entries are default (0 / "start"), as `blockEditorNormalize` already does.
  - `sort` keeps the header row first and compares with `localeCompare(b, undefined, { numeric: true, sensitivity: "base" })`. Empty cells always sort last.
  - The first `width` edit on a table with no widths uses `measured` (current px per column) for the other columns. Without `measured`, the other columns get 160.

- [ ] **Step 1: Write the failing tests** (append to `tests/node/block-editor.test.mjs`, importing `blockEditorEditTable` from `../../dist/index.js`)

```js
const t3 = { id: "t", type: "table", header: true, rows: [["Name", "Qty"], ["pear", "10"], ["Apple", "9"], ["", "1"]] };
test("insert, duplicate and delete rows and columns keep widths and align per column", () => {
  const sized = { ...t3, widths: [100, 0], align: ["start", "end"] };
  assert.deepEqual(blockEditorEditTable(sized, { op: "insert-column", at: 1 }).widths, [100, 0, 0]);
  assert.deepEqual(blockEditorEditTable(sized, { op: "duplicate-column", at: 1 }).align, ["start", "end", "end"]);
  assert.deepEqual(blockEditorEditTable(t3, { op: "duplicate-row", at: 1 }).rows[2], ["pear", "10"]);
  assert.equal(blockEditorEditTable(t3, { op: "delete-column", at: 0 }).rows[0].length, 1);
  const one = { ...t3, rows: [["x"]] };
  assert.equal(blockEditorEditTable(one, { op: "delete-row", at: 0 }), one);
});
test("moves never take the header row out of first place", () => {
  assert.deepEqual(blockEditorEditTable(t3, { op: "move-row", from: 3, to: 1 }).rows.map((r) => r[1]), ["Qty", "1", "10", "9"]);
  assert.equal(blockEditorEditTable(t3, { op: "move-row", from: 0, to: 2 }), t3);
  assert.equal(blockEditorEditTable(t3, { op: "move-row", from: 2, to: 0 }), t3);
  assert.deepEqual(blockEditorEditTable(t3, { op: "move-column", from: 0, to: 1 }).rows[0], ["Qty", "Name"]);
});
test("sort is case- and number-aware, keeps the header and puts empty cells last", () => {
  assert.deepEqual(blockEditorEditTable(t3, { op: "sort", column: 0, dir: "asc" }).rows.map((r) => r[0]), ["Name", "Apple", "pear", ""]);
  assert.deepEqual(blockEditorEditTable(t3, { op: "sort", column: 1, dir: "desc" }).rows.map((r) => r[1]), ["Qty", "10", "9", "1"]);
});
test("clear, align, width and header edits", () => {
  assert.deepEqual(blockEditorEditTable(t3, { op: "clear", rows: [1, 2], columns: [1, 1] }).rows.map((r) => r[1]), ["Qty", "", "", "1"]);
  assert.deepEqual(blockEditorEditTable(t3, { op: "align", column: 1, align: "end" }).align, ["start", "end"]);
  assert.deepEqual(blockEditorEditTable(t3, { op: "width", column: 0, width: 10, measured: [200, 150] }).widths, [48, 150]);
  assert.equal(blockEditorEditTable({ ...t3, widths: [90, 90] }, { op: "width", column: 0, width: 0 }).widths, undefined);
  assert.equal(blockEditorEditTable(t3, { op: "header", column: true }).headerColumn, true);
  assert.equal(blockEditorEditTable(t3, { op: "header", row: false }).header, false);
});
test("cells fills from a cell and grows the table, one line per cell", () => {
  const out = blockEditorEditTable(t3, { op: "cells", at: [3, 1], values: [["a", "b"], ["c\nd", "e"]] });
  assert.deepEqual(out.rows.slice(3), [["", "a", "b"], ["", "c d", "e"]]);
  assert.equal(out.rows[0].length, 3);
});
test("edits respect the row and column limits", () => {
  const wide = { ...t3, rows: [Array(12).fill("")] };
  assert.equal(blockEditorEditTable(wide, { op: "insert-column", at: 0 }), wide);
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `pnpm build && node --test tests/node/block-editor.test.mjs`
Expected: FAIL with `blockEditorEditTable is not a function` (or a SyntaxError on the missing import).

- [ ] **Step 3: Implement `blockEditorEditTable` in `block-editor-table.ts`**

Normalise the input with `tableGrid` into a working `{ rows, widths, align }`, apply the edit, then rebuild the block with the same "drop when default" rule. Add `export * from "./block-editor-table";` at the top of `block-editor.ts`'s exports, so `src/index.ts`'s existing `export * from "./components/block-editor/block-editor"` exposes it.

- [ ] **Step 4: Route the editor's existing table actions through it**

In `block-editor.ts`, replace the bodies of `insertRow`, `insertColumn`, `deleteRow`, `deleteColumn`, `duplicateRow`, `duplicateColumn`, `moveRow`, `moveColumn`, `clearCells`, `alignColumn` and `sizeColumn` with one helper:
```ts
/** Apply a table edit as one undo step, put the caret in `focus` and announce `message`. No-op edits change nothing. */
function editTable(id: string, edit: BlockEditorTableEdit, focus: [number, number], message?: string): void
```
It calls `blockEditorEditTable`, returns early when the result `===` the old block, otherwise does `commit(replaceAt(i, next), { id, cell: focus, start: 0 })` and `announce(message)`. For `width` edits, pass `measured` from the first row's cell `offsetWidth`s. Delete `Tbl`, `tblOf` and `setTable`. Update `pasteIntoTable` (use `op: "cells"`), the header toggles (`op: "header"`) and `onPointerUp`'s column-resize commit (`op: "width"` with `measured`) to go through `editTable`.

- [ ] **Step 5: Run everything that covers tables**

Run: `pnpm build && pnpm typecheck && node --test tests/node/block-editor.test.mjs`, then `pnpm exec playwright test tests/e2e/interactions.spec.ts -g "block editor tables"`
Expected: all PASS (the existing e2e table test still passes, because behaviour hasn't changed yet).

- [ ] **Step 6: Commit**

```bash
git add src/components/block-editor/block-editor-table.ts src/components/block-editor/block-editor.ts tests/node/block-editor.test.mjs manifest llms llms.txt llms-full.txt ai
git commit -m "Block editor: table edits as one pure, tested function"
```

---

### Task 2: Row and column grips

**Files:**
- Modify: `src/components/block-editor/block-editor.ts`: the `C` class map, `buildTable`, a new `onTablePointerOver`, `onFocusIn`
- Modify: `src/components/block-editor/block-editor.css` (beside the `.ayy-block-editor__col-resize` rules)
- Modify: `src/components/block-editor/block-editor.meta.json` (`classes`, `states`)
- Test: `tests/e2e/interactions.spec.ts`: a new test after `"block editor tables move between cells…"`

**Interfaces:**
- Consumes: `cellEl(id, row, col)`, `cellPos(cell)`, `els`, `readOnly()`.
- Produces:
  - Classes `ayy-block-editor__row-grip` (one per row, a `<button>` inside the row's first cell, `data-row`, `aria-label="Row N"`, `aria-haspopup="menu"`, `aria-expanded`, `tabindex="-1"`, `contenteditable="false"`) and `ayy-block-editor__col-grip` (one per column, inside the first row's cell, `data-col`, `aria-label="Column N"`, same attributes). The icon is `dragHandleIcon` from drag-drop (already imported).
  - Function `markHot(id: string, row: number, col: number): void`. It sets `data-hot` on exactly that row's grip and that column's grip, and clears it everywhere else in the block.

- [ ] **Step 1: Write the failing e2e test**

`test("block editor table grips show for the hovered or focused cell and stay out of read-only", …)` on the `task-notes` example:
- Hover `cell(2, 1)`. Expect `.ayy-block-editor__row-grip[data-row="2"]` and `.ayy-block-editor__col-grip[data-col="1"]` to have the `data-hot` attribute and to be visible, and `.ayy-block-editor__row-grip[data-hot]` to have count 1.
- Click `cell(1, 2)`. Expect `data-hot` on row grip 1 and column grip 2.
- Turn on the example's "Read only" switch. Expect count 0 for both grip selectors.

- [ ] **Step 2: Run it to verify it fails**

Run: `pnpm exec playwright test tests/e2e/interactions.spec.ts -g "table grips"`
Expected: FAIL (locator count 0).

- [ ] **Step 3: Render the grips and wire hover and focus**

- In `buildTable`, append the grips when `!readOnly()`. Call `markHot` from a delegated `pointerover` listener on `root` (add it to the `listeners` array), when the target is inside a `.ayy-block-editor__cell`'s `td`/`th`, and from `onFocusIn` when a cell gains focus.
- CSS: the cells are already `position: relative`.
  - `.ayy-block-editor__row-grip`: absolute, `inset-inline-start: calc(-1 * var(--_button) - 2px)`, vertically centred, `opacity: 0`.
  - `.ayy-block-editor__col-grip`: absolute, `inset-block-start: -0.75rem`, horizontally centred with `inset-inline: 0; margin-inline: auto; inline-size: 1.5rem`. The drag icon is rotated 90° with the `rotate` property.
  - `[data-hot]` sets `opacity: 1`. Add `:focus-visible` rings and touch sizes under `@media (hover: none)`.
  - The scroll container (`overflow-x: auto`) would clip both grips. Give `.ayy-block-editor__table-scroll` `padding-inline-start: calc(var(--_button) + 4px)` and `padding-block-start: 0.75rem`, and remove its border and radius. Put the border on `.ayy-block-editor__table` instead (`border: 1px solid var(--ayy-color-line)`, no radius), and drop the `tr:first-child`/`:first-child`/`:last-child` border-removal rules, which only existed because the scroll box drew the outer border.
- Meta: describe both classes and add the state `"hot": { "when": "data-hot on the grips of the hovered or focused cell's row and column", "looks": "The two grips fade in" }`.

- [ ] **Step 4: Run it to verify it passes, plus the existing table test**

Run: `pnpm build && pnpm check && pnpm exec playwright test tests/e2e/interactions.spec.ts -g "block editor tables|table grips"`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/block-editor tests/e2e/interactions.spec.ts manifest llms llms.txt llms-full.txt ai
git commit -m "Block editor: row and column grips on tables"
```

---

### Task 3: Scoped row, column and cell menus

**Files:**
- Modify: `src/components/block-editor/block-editor.ts`: `MenuState`, `actionItems`, `openActions`, `renderMenu`'s aria-label, `onClick`, `onCellKey` (Mod+/), a new `contextmenu` listener
- Modify: `src/components/block-editor/block-editor.meta.json` (`a11y`)
- Test: `tests/e2e/interactions.spec.ts`: replace the "Block actions are grouped…" part of the existing table test, and add a new test

**Interfaces:**
- Consumes: `editTable` (Task 1), the grips and `markHot` (Task 2), the submenu support already in `MenuItem.sub` and `runMenu`.
- Produces:
  - `MenuState` actions `list` becomes `"actions" | "language" | "row" | "column" | "cell"`, plus an optional `at?: [number, number]` (the row and column the menu is about).
  - `function tableItems(id: string, list: "row" | "column" | "cell", at: [number, number], sub?: string): MenuItem[]`.
  - `openActions(ids, from, list, at?)` takes the new lists and `at`.

Menu contents (labels exactly as shown):
- Row: Insert above · Insert below · Duplicate (Mod+D) · Move up · Move down · Clear · Delete (destructive). Move up is left out on the first movable row, Move down on the last row, and Delete when it's the only row.
- Column: Insert before · Insert after · Duplicate · Move earlier · Move later · Sort › (A → Z, Z → A) · Align › (At the start, Centered, At the end; `current` on the active one) · Width › (Wider +24 px, Narrower −24 px) · Clear · Delete (destructive).
- Cell (Mod+/ in a cell, or right-click on a cell): Row › (the row items) · Column › (the column items) · Header row (current when on) · Header column · Even out column widths (only when `widths` is set) · Clear every cell · then the existing block actions (Copy text, Duplicate table, Move table up/down, Delete table).
- Block handle (⋮⋮) on a table: the same as Cell, minus Row › and Column ›. Delete the old Insert/Duplicate/Move/Align/Width/Clear/Delete submenus and `lastCell`'s use in `actionItems`.

- [ ] **Step 1: Write the failing e2e test**

`test("block editor table menus act on the row or column they were opened from", …)`:
- Click the row grip of row 2. Expect the menu `aria-label` to be "Row 2". Click "Duplicate". Expect 1 more `tbody tr`, and the new row's text equal to row 2's.
- Click column grip 0, then "Sort ›", then "Z → A". Expect the body rows' first cells to be in descending order.
- Click `cell(1, 1)` and press `Control+/`. Expect options "Row", "Column", "Header row" and "Delete table".
- Right-click `cell(1, 1)`. Expect the same menu.
- Open the block handle (⋮⋮) menu. Expect the option "Row" to have count 0.

In the existing table test, replace the parts that open `Delete ›`/`Align ›`/`Duplicate ›` from the block menu with the grips' menus.

- [ ] **Step 2: Run it to verify it fails**

Run: `pnpm exec playwright test tests/e2e/interactions.spec.ts -g "table menus"`
Expected: FAIL.

- [ ] **Step 3: Implement the menus**

- Grip click: `openActions([id], grip, "row" | "column", [row, col])`. Unlike `"actions"`, these lists don't `pick` the block. They call `selectAxis` from Task 5 when it exists; until then, they do nothing extra.
- `renderMenu` labels the menu "Row N", "Column N", "Cell" or "Block actions".
- The `contextmenu` listener calls `preventDefault` only on a cell, outside read-only.

- [ ] **Step 4: Run it to verify it passes**

Run: `pnpm build && pnpm check && pnpm exec playwright test tests/e2e/interactions.spec.ts -g "block editor"`
Expected: PASS (all block editor tests).

- [ ] **Step 5: Commit**

```bash
git add src/components/block-editor tests/e2e/interactions.spec.ts manifest llms llms.txt llms-full.txt ai
git commit -m "Block editor: row, column and cell menus replace the last-cell submenus"
```

---

### Task 4: Drag rows and columns by their grips

**Files:**
- Modify: `src/components/block-editor/block-editor.ts`: `onPointerDown`/`onPointerMove`/`onPointerUp` (beside the existing `sizing` column-resize state), `buildTable` (one drop indicator per table)
- Modify: `src/components/block-editor/block-editor.css`, `block-editor.meta.json`
- Test: `tests/e2e/interactions.spec.ts`

**Interfaces:**
- Consumes: `editTable(id, { op: "move-row" | "move-column", from, to }, focus)` from Task 1, the grips from Task 2.
- Produces:
  - State `let tableDrag: { id: string; axis: "row" | "column"; from: number; to: number; startX: number; startY: number; moved: boolean; grip: HTMLElement } | null`.
  - Class `ayy-block-editor__table-drop`: one absolutely positioned 2px `--ayy-color-primary` line per table, inside `.ayy-block-editor__table-wrap`, `hidden` until a drag moves. Its position comes from the cells' rects relative to the wrap.
  - While dragging, `data-dragging` goes on the dragged row's cells or column's cells.
- Algorithm (not determined by the tests): the target index is the row or column whose centre is nearest the pointer, along the drag axis. Columns compare the inline axis: `rtl ? wrapRect.right - x : x - wrapRect.left`, against each cell's inline-start offset measured the same way. With a header row, row targets are clamped to `>= 1`. A drag starts after 4 px of movement; under that, the release is a click (Task 3's menu opens). Use `setPointerCapture` on the grip.

- [ ] **Step 1: Write the failing e2e test**

`test("block editor table rows and columns move by dragging their grips, in both directions", …)`:
- Drag row grip 1 down past row 3's centre, using `page.mouse.down/move(steps: 5)/up`. Expect the old row 1's text in row 3.
- Drag column grip 0 past column 2. Expect the old column 0's header text in column 2.
- Dragging the header row's grip changes nothing.
- One `Control+z` restores the previous order.
- Repeat the column drag with `dir="rtl"` set on the editor (via `evaluate`), moving the mouse leftwards. Expect the same result.

- [ ] **Step 2: Run it to verify it fails**

Run: `pnpm exec playwright test tests/e2e/interactions.spec.ts -g "move by dragging"`
Expected: FAIL.

- [ ] **Step 3: Implement the drag** as specified in the Interfaces block. Add `data-dragging` cells at 40% opacity and the drop line to the CSS, a `forced-colors` rule (`background-color: Highlight`) for the drop line, and the class and a "dragging" note to the meta.

- [ ] **Step 4: Run it to verify it passes**

Run: `pnpm build && pnpm check && pnpm exec playwright test tests/e2e/interactions.spec.ts -g "block editor"`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/block-editor tests/e2e/interactions.spec.ts manifest llms llms.txt llms-full.txt ai
git commit -m "Block editor: drag table rows and columns by their grips"
```

---

### Task 5: Row and column selection with keyboard actions

**Files:**
- Modify: `src/components/block-editor/block-editor.ts`: new state and functions, `onKeyDown` (route to `onAxisKey` before `onPickedKey`), `onCopy`, `onPointerDown`/`onFocusIn` (clear on a cell click), `render`/`decorate` (repaint)
- Modify: `block-editor.css` (selected cells), `block-editor.meta.json` (`a11y`, the `selected` state's `when`)
- Test: `tests/e2e/interactions.spec.ts`

**Interfaces:**
- Consumes: `editTable` (Task 1), the grip menus (Task 3, which call `selectAxis`).
- Produces:
  - `let axisSel: { id: string; axis: "row" | "column"; index: number } | null`
  - `function selectAxis(id: string, axis: "row" | "column", index: number): void`. It sets `data-selected` on that row's or column's `td`/`th`, focuses `root` (like `pick` does), and announces "Row N selected" or "Column N selected".
  - `function clearAxis(): void`
  - `function onAxisKey(e: KeyboardEvent): void`, with these keys:
    - Delete or Backspace: clear.
    - Mod+Backspace or Mod+Delete: delete it.
    - Mod+D: duplicate it.
    - Mod+Shift+ArrowUp/Down for a row, Mod+Shift+ArrowLeft/Right for a column (mirrored in RTL): move it, keeping it selected at its new index.
    - Mod+C: copy it as TSV (one value per line for a column).
    - Mod+X: copy, then clear.
    - Esc: `clearAxis()`, then put the caret in its first cell.
    - Mod+Z / Mod+Shift+Z: undo and redo.

- [ ] **Step 1: Write the failing e2e test**

`test("block editor table rows and columns select from their grips and take keyboard actions", …)`:
- Click row grip 2, then press Escape, which closes the menu and leaves the row selected. Expect `tbody tr:nth-child(2) > [data-selected]` to have count = columns.
- Press `Control+d`. Expect 1 more row.
- Press `Backspace`. Expect the selected row's cells to be empty.
- Press `Control+Backspace`. Expect 1 fewer row.
- Press `Control+z` twice. Expect the row count and texts back to before Backspace.
- Click column grip 1, press Escape, then `Control+c`. Read the clipboard with `page.evaluate(() => navigator.clipboard.readText())`, after granting `clipboard-read`/`clipboard-write` through `context.grantPermissions`. Expect the column's values joined by `\n`.
- Click any cell. Expect `[data-selected]` count 0.

- [ ] **Step 2: Run it to verify it fails**

Run: `pnpm exec playwright test tests/e2e/interactions.spec.ts -g "select from their grips"`
Expected: FAIL.

- [ ] **Step 3: Implement the selection**

- Escape on a grip menu closes the menu but keeps `axisSel`.
- `render()` repaints `data-selected` from `axisSel`, because a commit rebuilds the table element.
- Clear `axisSel` in `travel()` (undo/redo), `unpick()`, `onFocusOut` when leaving the editor, and when a cell gains focus.
- CSS: `[data-selected]` cells get `background-color: color-mix(in srgb, var(--ayy-color-primary) 12%, transparent)`. Forced colours: `outline: 2px solid Highlight; outline-offset: -2px`.

- [ ] **Step 4: Run it to verify it passes**

Run: `pnpm build && pnpm check && pnpm exec playwright test tests/e2e/interactions.spec.ts -g "block editor"`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/block-editor tests/e2e/interactions.spec.ts manifest llms llms.txt llms-full.txt ai
git commit -m "Block editor: select a table row or column and act on it from the keyboard"
```

---

### Task 6: Docs, example and the full gate

**Files:**
- Modify: `src/components/block-editor/block-editor.meta.json`: the description, the `ayy-block-editor__table*` class texts and the `a11y` keyboard line, describing the grips, the menus, drag and selection. Remove the sentence about Insert/Duplicate/Move/Align/Width/Clear/Delete submenus.
- Modify: `CHANGELOG.md`: amend the Block editor line ("…tables with row and column grips, drag to reorder, sorting and resizable columns…").
- Modify: `src/components/block-editor/examples/task-notes.tsx` and `.html` only if the example needs a fourth row to show sorting well. Keep both in sync.

- [ ] **Step 1: Run the whole gate**

Run: `pnpm build && pnpm typecheck && pnpm check && pnpm test && pnpm preview:build && E2E_PORT=$E2E_PORT pnpm test:e2e`
Expected: every command exits 0, and the e2e summary shows `0 failed`.

- [ ] **Step 2: Look at it**

Open the `task-notes` example in `pnpm preview` and check it in dark and light themes, with `dir="rtl"` on the stage, at touch density, and below 48rem. Fix anything clipped (row grips at the inline start are the likely one).

- [ ] **Step 3: Commit**

```bash
git add -A src/components/block-editor CHANGELOG.md manifest llms llms.txt llms-full.txt ai
git commit -m "Block editor: document table grips, menus, drag and selection"
```
