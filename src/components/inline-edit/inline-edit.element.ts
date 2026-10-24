import { ElementBase, emit } from "../../lib/element";
import { connectInlineEdit, type InlineEditController } from "./inline-edit";

/**
 * <ayy-inline-edit> — wraps an .ayy-inline-edit: click the __display button to edit, Enter saves, Esc cancels, blur saves;
 * a <textarea> field saves on Mod+Enter and grows with its content. The markup decides the field, and the raw value stays
 * in data-value. The controller writes a committed value back to data-value and .ayy-inline-edit__text only when it
 * changed; an app showing formatted text listens for "ayy-change" and rewrites the text. startEditing(), commit() and
 * cancel() drive it from code.
 */
export class AyyInlineEditElement extends ElementBase {
  #controller: InlineEditController | null = null;

  connectedCallback(): void {
    const root = this.querySelector<HTMLElement>(".ayy-inline-edit");
    if (!root) return;
    this.#controller = connectInlineEdit(root, {
      onCommit: (value) => emit(this, "ayy-change", { value }),
      onEditingChange: (editing) => emit(this, "ayy-edit", { editing }),
    });
  }

  disconnectedCallback(): void {
    this.#controller?.destroy();
    this.#controller = null;
  }

  /** Open the field and focus it, like a click on the display button. */
  startEditing(): void {
    this.#controller?.start();
  }

  /** Save the draft and close, like Enter. */
  commit(): void {
    this.#controller?.commit();
  }

  /** Throw the draft away and close, like Esc. */
  cancel(): void {
    this.#controller?.cancel();
  }
}
