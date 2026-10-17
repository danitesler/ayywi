import { ElementBase, emit } from "../../lib/element";
import { connectActionBar, type ActionBarController } from "./action-bar";

/**
 * <ayy-action-bar> — wraps an .ayy-action-bar and wires WAI-ARIA toolbar keyboard navigation (one Tab stop,
 * Left/Right arrows mirrored in RTL, Home/End), Escape or a click on .ayy-action-bar__close to clear the selection,
 * and automatic syncing when an <ayy-table> or <ayy-grid> in the same container fires "ayy-selection-change".
 * Fires "ayy-clear" (preventDefault() to keep the selection).
 */
export class AyyActionBarElement extends ElementBase {
  #controller: ActionBarController | null = null;
  #scope: ParentNode | null = null;

  #onSelectionChange = (event: Event) => {
    const detail = (event as CustomEvent<{ rows?: Element[]; items?: Element[] }>).detail;
    const list = detail?.items ?? detail?.rows;
    if (Array.isArray(list)) this.#controller?.syncCount(list.length);
  };

  connectedCallback(): void {
    const bar = this.querySelector<HTMLElement>(".ayy-action-bar");
    if (!bar) return;
    this.#controller = connectActionBar(bar, {
      onClear: () => emit(this, "ayy-clear", {}),
    });
    this.#scope = this.closest("ayy-grid, ayy-table") ?? this.parentElement;
    this.#scope?.addEventListener("ayy-selection-change", this.#onSelectionChange);
  }

  disconnectedCallback(): void {
    this.#scope?.removeEventListener("ayy-selection-change", this.#onSelectionChange);
    this.#scope = null;
    this.#controller?.destroy();
    this.#controller = null;
  }

  /** Re-read the focusable buttons after changing them. */
  refresh(): void {
    this.#controller?.refresh();
  }
}
