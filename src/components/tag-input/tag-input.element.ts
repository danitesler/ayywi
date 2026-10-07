import { ElementBase, emit } from "../../lib/element";
import { connectTagInput, type TagInputController } from "./tag-input";

/**
 * <ayy-tag-input [name] [max] [case-sensitive]> — wraps an .ayy-tag-input: Enter or a comma turns the typed text into
 * a chip (it draws the chip's markup), Backspace in the empty field removes the last, a chip's × removes it. Chips
 * already in the HTML are the starting tags. Fires "ayy-change" ({ values }) after every change; `values` reads them.
 */
export class AyyTagInputElement extends ElementBase {
  #controller: TagInputController | null = null;

  get values(): string[] {
    return this.#controller?.values() ?? [];
  }
  set values(next: string[]) {
    this.#controller?.setValues(next);
  }

  connectedCallback(): void {
    const root = this.querySelector<HTMLElement>(".ayy-tag-input");
    if (!root) return;
    const max = Number(this.getAttribute("max"));
    this.#controller = connectTagInput(root, {
      name: this.getAttribute("name") ?? undefined,
      max: max > 0 ? max : undefined,
      caseSensitive: this.hasAttribute("case-sensitive"),
      onChange: (values) => emit(this, "ayy-change", { values }),
    });
  }

  disconnectedCallback(): void {
    this.#controller?.destroy();
    this.#controller = null;
  }
}
