import { ElementBase, emit } from "../../lib/element";
import { connectPinInput, type PinInputController, type PinInputType } from "./pin-input";

/**
 * <ayy-pin-input [type="numeric|alphanumeric"] [mask] [name]> — wires an .ayy-pin-input of .ayy-pin-input__slot inputs.
 * Typing advances to the next slot, Backspace clears or steps back, pasting distributes valid characters, a hidden input
 * carries the combined code when `name` is set, and "ayy-change" / "ayy-complete" fire with `{ value }`.
 */
export class AyyPinInputElement extends ElementBase {
  static observedAttributes = ["type", "mask", "name"];

  #controller: PinInputController | null = null;
  #root: HTMLElement | null = null;

  connectedCallback(): void {
    this.#mount();
  }

  disconnectedCallback(): void {
    this.#controller?.destroy();
    this.#controller = null;
    this.#root = null;
  }

  attributeChangedCallback(): void {
    if (!this.isConnected) return;
    this.#mount();
  }

  get value(): string {
    return this.#controller?.value() ?? "";
  }

  set value(next: string) {
    this.#controller?.setValue(next);
    this.#syncHidden();
  }

  clear(): void {
    this.#controller?.clear();
    this.#syncHidden();
  }

  #mount(): void {
    this.#controller?.destroy();
    const root = this.querySelector<HTMLElement>(".ayy-pin-input") ?? this;
    this.#root = root;
    const type: PinInputType = this.getAttribute("type") === "alphanumeric" ? "alphanumeric" : "numeric";
    const mask = this.hasAttribute("mask");
    for (const slot of root.querySelectorAll<HTMLInputElement>(".ayy-pin-input__slot")) {
      slot.type = mask ? "password" : "text";
      slot.inputMode = type === "alphanumeric" ? "text" : "numeric";
    }
    this.#controller = connectPinInput(root, {
      type,
      onChange: (value) => {
        this.#syncHidden();
        emit(this, "ayy-change", { value });
      },
      onComplete: (value) => emit(this, "ayy-complete", { value }),
    });
    this.#syncHidden();
  }

  #syncHidden(): void {
    const root = this.#root;
    if (!root) return;
    const name = this.getAttribute("name");
    let hidden = root.querySelector<HTMLInputElement>('input[type="hidden"][data-pin-value]');
    if (!name) {
      hidden?.remove();
      return;
    }
    if (!hidden) {
      hidden = document.createElement("input");
      hidden.type = "hidden";
      hidden.dataset.pinValue = "";
      root.append(hidden);
    }
    hidden.name = name;
    hidden.value = this.#controller?.value() ?? "";
    const slots = Array.from(root.querySelectorAll<HTMLInputElement>(".ayy-pin-input__slot"));
    hidden.disabled = slots.length > 0 && slots.every((slot) => slot.disabled);
  }
}
