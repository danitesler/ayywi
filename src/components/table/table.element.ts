import { ElementBase, emit } from "../../lib/element";
import { connectTable } from "./table";

/**
 * <ayy-table> — wraps an .ayy-table (or its .ayy-table-wrap or .ayy-table-container) and wires its markup: header
 * .ayy-table__sort buttons set aria-sort and reorder the rows, .ayy-table__select checkboxes set aria-selected (with
 * a select-all box, Shift+click ranges, and drag-to-select across rows), .ayy-table__expand buttons open their
 * .ayy-table__detail row, .ayy-table__resize handles resize columns, .ayy-table__edit inputs commit inline edits,
 * column headers drag to reorder columns, and rows drag by their .ayy-drag-handle to reorder rows.
 * Fires "ayy-sort" ({ column, key, direction }; preventDefault() to sort the rows yourself, e.g. on the server),
 * "ayy-selection-change" ({ rows }), "ayy-expand-change" ({ row, expanded }), "ayy-column-resize" ({ column, key, width }),
 * "ayy-cell-edit" ({ row, cell, column, key, value }), "ayy-column-reorder" ({ from, to, key, targetKey }) and "ayy-row-reorder" ({ from, to, id }).
 */
export class AyyTableElement extends ElementBase {
  #controller: { destroy(): void } | null = null;

  connectedCallback(): void {
    const table = this.querySelector("table");
    if (!table) return;
    this.#controller = connectTable(table, {
      onSort: (detail) => emit(this, "ayy-sort", detail),
      onSelectionChange: (rows) => emit(this, "ayy-selection-change", { rows }),
      onExpandChange: (row, expanded) => emit(this, "ayy-expand-change", { row, expanded }),
      onResize: (detail) => emit(this, "ayy-column-resize", detail),
      onCellEdit: (detail) => emit(this, "ayy-cell-edit", detail),
      onColumnReorder: (detail) => emit(this, "ayy-column-reorder", detail),
      onRowReorder: (detail) => emit(this, "ayy-row-reorder", detail),
    });
  }

  disconnectedCallback(): void {
    this.#controller?.destroy();
    this.#controller = null;
  }
}
