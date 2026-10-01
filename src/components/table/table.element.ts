import { ElementBase, emit } from "../../lib/element";
import { connectTable } from "./table";

/**
 * <ayy-table> — wraps an .ayy-table (or its .ayy-table-wrap) and wires sorting and row selection on its markup:
 * header .ayy-table__sort buttons set aria-sort and reorder the rows, .ayy-table__select checkboxes set
 * aria-selected and a select-all box. Fires "ayy-sort" ({ column, key, direction }; preventDefault() to sort
 * the rows yourself, e.g. on the server) and "ayy-selection-change" ({ rows }).
 */
export class AyyTableElement extends ElementBase {
  #controller: { destroy(): void } | null = null;

  connectedCallback(): void {
    const table = this.querySelector("table");
    if (!table) return;
    this.#controller = connectTable(table, {
      onSort: (detail) => emit(this, "ayy-sort", detail),
      onSelectionChange: (rows) => emit(this, "ayy-selection-change", { rows }),
    });
  }

  disconnectedCallback(): void {
    this.#controller?.destroy();
    this.#controller = null;
  }
}
