import { ElementBase, emit } from "../../lib/element";
import { connectDragDrop, dragHandleClass, draggableClass, type DragOrientation } from "./drag-drop";

/**
 * <ayy-drag-drop [orientation] [handle] [areas]> — wires the .ayy-draggable items inside it so people can drag them to
 * reorder, and to move them between areas. `orientation` = vertical (default) | horizontal; `handle` picks items up by
 * their .ayy-drag-handle only (which then takes the arrow keys); `areas` is a CSS selector for the places items can be
 * dropped, usually ".ayy-drop-target" (an area with data-accepts="bug feature" takes only items whose data-type is
 * listed). The item moves in the DOM, then it fires "ayy-move" ({ item, from, to, fromIndex, toIndex, itemId, fromId,
 * toId }, ids from data-id). While something is dragged, areas show data-drop (ready, over, reject) and the item it
 * will land beside shows data-drop-edge.
 */
export class AyyDragDropElement extends ElementBase {
  static observedAttributes = ["orientation", "handle", "areas"];
  #controller: { destroy(): void } | null = null;

  connectedCallback(): void {
    this.#connect();
  }

  disconnectedCallback(): void {
    this.#controller?.destroy();
    this.#controller = null;
  }

  attributeChangedCallback(): void {
    if (this.isConnected) this.#connect();
  }

  #connect(): void {
    this.#controller?.destroy();
    const orientation = this.getAttribute("orientation") === "horizontal" ? ("horizontal" as DragOrientation) : "vertical";
    this.#controller = connectDragDrop(this, {
      items: `.${draggableClass}`,
      handle: this.hasAttribute("handle") ? `.${dragHandleClass}` : undefined,
      areas: this.getAttribute("areas") || undefined,
      orientation,
      onMove: (move) => emit(this, "ayy-move", move),
    });
  }
}
