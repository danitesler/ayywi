# Block editor: easier table editing, more block options

Status: proposed (2026-10-27). Builds on the uncommitted Toggle and Table work in `src/components/block-editor/`.

## Problem

Tables are hard to edit. Every row and column action lives in the block's ⋮⋮ menu and works on "the cell the caret was in last", which the user can't see. You can't select a row or column, drag one to a new place, or sort. The block editor also lacks a few blocks and marks people expect.

## Part A: table editing

A1. **One pure edit function.** All table changes go through `blockEditorEditTable(block, edit)`. It's exported, DOM-free, and returns a new block. Edits: insert, delete, duplicate and move (from → to) for rows and columns; clear a range; align a column; set a column width or even them out; sort by a column; header row and header column on or off. Limits stay at 100 rows, 12 columns, and widths of 48–1200 px. A header row never moves or sorts.

A2. **Row and column grips.** Hovering or focusing a cell shows a grip at that row's inline start and at that column's top. Clicking a grip selects the row or column and opens a short menu scoped to it:
- Row: Insert above, Insert below, Duplicate, Move up, Move down, Clear, Delete.
- Column: Insert before, Insert after, Duplicate, Move earlier, Move later, Sort ›, Align ›, Width ›, Clear, Delete.

A3. **Cell menu.** Mod+/ in a cell, or a right-click on a cell, opens: Row ›, Column › (the same items as the grips), Header row, Header column, Even out column widths, Clear every cell, then the usual block actions. The block's ⋮⋮ handle on a table shows only the table-wide items and the block actions. The Insert/Duplicate/Move/Align/Width/Clear/Delete submenus that worked on "the last cell" go away.

A4. **Drag to reorder.** Dragging a row grip moves the row, and dragging a column grip moves the column. A primary-coloured line shows where it will land. A press that moves under 4 px is a click.

A5. **Row and column selection.** A selected row or column paints its cells (`data-selected`), and the editor root takes focus. Keys on a selection:
- Delete or Backspace clears its cells.
- Mod+Backspace or Mod+Delete deletes it.
- Mod+C copies it as tab-separated text, and Mod+X cuts (copies, then clears).
- Mod+D duplicates it.
- Mod+Shift+arrows move it.
- Esc deselects and puts the caret in its first cell.

The selection is announced in the live region.

Out of scope: rectangular multi-cell selection, merged cells, rich text in cells, and insert-between "+" lines on hover.

## Part B: more block options

B1. **Callout colours.** A callout gets `tone`: `default | info | success | warning | destructive`. The tones use the same colours as Alert, and the icon changes per tone. Set it from a "Colour ›" submenu in block actions. In Markdown, tones map to GitHub alerts: info → `[!NOTE]`, success → `[!TIP]`, warning → `[!WARNING]`, destructive → `[!CAUTION]`; default stays a plain `>`. These also import back.

B2. **Highlight mark.** A Highlight button on the formatting bar (Mod+Shift+H) wraps the selection in `<mark>`. Text highlight already exists as its own component; the editor stores a bare `<mark>` and styles it with Text highlight's default look. In Markdown it's `==text==`, both ways.

B3. **Record link block.** Type `record`, holding `record: { trigger, id, label }`. It shows as a quiet card row (an icon, the label and the source's name). Clicking it fires the existing `onMentionClick` / `ayy-mention-click`. The / menu offers "Link to <source label>" for each mention source. Choosing one turns the line into the trigger character with the mention list open, and picking an option turns the line into a record block. It exports as the trigger plus the label (text and Markdown) or `<p>` (HTML). Markdown does not import it back.

B4. **Equation block.** Type `equation`; its `html` holds escaped TeX, like code. There's a new option, `renderMath?: (tex: string) => string`, which returns HTML (the app brings KaTeX or similar, so ayywi stays dependency-free). While the line isn't focused and `renderMath` is set, the rendered output shows instead of the source. Without it the source shows in monospace. Typing `$$` at the start of a line makes one. In Markdown it's a `$$` fence, both ways. In HTML it's `<div data-math>` holding `\[tex\]`.

Out of scope: columns layout, sub/superscript, per-block text alignment.

## Constraints (from AGENTS.md)

Tokens only, logical properties only, no `:dir()`. State lives in attributes. Every class has the `ayy-` prefix. Focus rings are visible, and there's a `forced-colors` block wherever colour shows state. Zero runtime dependencies. Generated files are only regenerated (`pnpm generate`). The meta must match the CSS. React and HTML examples stay in sync. Changes go under `## Unreleased` in CHANGELOG.md (the Block editor is itself new there, so amend its line). No release, no GitHub workflows.
