import { ElementBase, emit } from "../../lib/element";
import { connectTree, type TreeController } from "./tree";

/**
 * <ayy-tree> — wires an .ayy-tree/[role="tree"] inside it: one treeitem is the roving tab stop, clicking a row selects
 * it, the toggle opens its group, double-click and Enter activate, and the arrow keys, Home and End move through the
 * visible nodes. Fires "ayy-select" ({ id }), "ayy-activate" ({ id }) and "ayy-toggle" ({ id, expanded }); focus(id)
 * moves to a node from code.
 */
export class AyyTreeElement extends ElementBase {
  #controller: TreeController | null = null;

  connectedCallback(): void {
    const root = this.querySelector<HTMLElement>('[role="tree"]');
    if (!root) return;
    this.#controller = connectTree(root, {
      onSelect: (id) => emit(this, "ayy-select", { id }),
      onActivate: (id) => emit(this, "ayy-activate", { id }),
      onToggle: (id, expanded) => emit(this, "ayy-toggle", { id, expanded }),
    });
  }

  disconnectedCallback(): void {
    this.#controller?.destroy();
    this.#controller = null;
  }

  /** Focus the node with this id (the selected one, or the first, without one). */
  focus(id?: string | FocusOptions): void {
    this.#controller?.focus(typeof id === "string" ? id : undefined);
  }
}
