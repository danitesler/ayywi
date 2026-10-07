import { ElementBase, emit } from "../../lib/element";
import { connectSwipe, type SwipeController, type SwipeSide } from "./swipe";

/**
 * <ayy-swipe> — wraps an .ayy-swipe row: drag its content sideways to show the action trays, let go past half a tray
 * to keep it open. Fires "ayy-open-change" ({ side }: "start", "end" or null). Methods: open(side), close().
 */
export class AyySwipeElement extends ElementBase {
  #controller: SwipeController | null = null;

  connectedCallback(): void {
    const row = this.querySelector<HTMLElement>(".ayy-swipe");
    if (!row) return;
    this.#controller = connectSwipe(row, { onOpenChange: (side) => emit(this, "ayy-open-change", { side }) });
  }

  disconnectedCallback(): void {
    this.#controller?.destroy();
    this.#controller = null;
  }

  open(side: SwipeSide): void {
    this.#controller?.open(side);
  }

  close(): void {
    this.#controller?.close();
  }
}
