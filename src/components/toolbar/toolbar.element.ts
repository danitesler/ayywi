import { ElementBase, emit } from "../../lib/element";
import { connectToolbar, type ToolbarController } from "./toolbar";

/**
 * <ayy-toolbar> — wraps an .ayy-toolbar and wires the toolbar keyboard pattern: one Tab stop, arrow keys between items,
 * Home/End. Clicking a button that has aria-pressed toggles it; in an .ayy-toolbar__group with data-exclusive, pressing
 * one releases the others (the current tool). Fires "ayy-press" ({ button, pressed }; preventDefault() to keep the old
 * state). Call refresh() after adding or removing items.
 */
export class AyyToolbarElement extends ElementBase {
  #controller: ToolbarController | null = null;

  #onClick = (event: MouseEvent) => {
    const button = (event.target as Element | null)?.closest<HTMLButtonElement>("button[aria-pressed]");
    if (!button || !this.contains(button) || button.disabled) return;
    const group = button.closest<HTMLElement>(".ayy-toolbar__group[data-exclusive]");
    const pressed = group ? true : button.getAttribute("aria-pressed") !== "true";
    if (!emit(this, "ayy-press", { button, pressed })) return;
    if (group) for (const other of group.querySelectorAll("button[aria-pressed]")) other.setAttribute("aria-pressed", String(other === button));
    else button.setAttribute("aria-pressed", String(pressed));
  };

  connectedCallback(): void {
    const toolbar = this.querySelector<HTMLElement>(".ayy-toolbar");
    if (!toolbar) return;
    this.#controller = connectToolbar(toolbar);
    this.addEventListener("click", this.#onClick);
  }

  disconnectedCallback(): void {
    this.#controller?.destroy();
    this.#controller = null;
    this.removeEventListener("click", this.#onClick);
  }

  /** Re-read the items after changing them. */
  refresh(): void {
    this.#controller?.refresh();
  }
}
