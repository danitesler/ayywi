import { ElementBase, emit } from "../../lib/element";
import { connectGrid } from "./grid";

/**
 * <ayy-grid> — wraps an .ayy-grid-wrap or .ayy-grid and wires multi-select on its cards:
 * a checkbox in .ayy-grid__select-all selects every card and shows indeterminate when some are selected;
 * .ayy-grid__select checkboxes (or clicking the card body outside buttons, links and menus) set aria-selected
 * on their .ayy-grid__item; Shift+click selects a range. Fires "ayy-selection-change" ({ items }).
 */
export class AyyGridElement extends ElementBase {
  #controller: { destroy(): void } | null = null;

  connectedCallback(): void {
    this.#controller = connectGrid(this, {
      onSelectionChange: (items) => emit(this, "ayy-selection-change", { items }),
    });
  }

  disconnectedCallback(): void {
    this.#controller?.destroy();
    this.#controller = null;
  }
}
