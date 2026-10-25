import { ElementBase, emit } from "../../lib/element";
import { connectIconPicker, type IconPickerController } from "./icon-picker";

/**
 * <ayy-icon-picker [value] [name]> — wraps an .ayy-icon-picker: the search field filters the icon and emoji options,
 * the arrow keys move through the grid, and clicking an option (or the remove button) picks it. Fires "ayy-change"
 * ({ value, kind }) and keeps the value attribute and aria-pressed in step. With name, a hidden input carries the value.
 */
export class AyyIconPickerElement extends ElementBase {
  static observedAttributes = ["value"];
  #controller: IconPickerController | null = null;
  #syncing = false;

  get value(): string {
    return this.getAttribute("value") ?? "";
  }
  set value(next: string) {
    this.setAttribute("value", next);
  }

  connectedCallback(): void {
    const root = this.querySelector<HTMLElement>(".ayy-icon-picker");
    if (!root) return;
    this.#controller = connectIconPicker(root, {
      onChange: ({ value, kind }) => {
        this.#syncing = true;
        this.value = value;
        this.#syncing = false;
        this.#sync();
        emit(this, "ayy-change", { value, kind });
      },
    });
    if (this.hasAttribute("value")) this.#controller.setValue(this.value);
    this.#sync();
  }

  disconnectedCallback(): void {
    this.#controller?.destroy();
    this.#controller = null;
  }

  attributeChangedCallback(): void {
    if (!this.#controller || this.#syncing) return;
    this.#controller.setValue(this.value);
    this.#sync();
  }

  #sync(): void {
    const name = this.getAttribute("name");
    if (!name) return;
    let input = this.querySelector<HTMLInputElement>(`input[type="hidden"][name="${CSS.escape(name)}"]`);
    if (!input) {
      input = document.createElement("input");
      input.type = "hidden";
      input.name = name;
      this.append(input);
    }
    input.value = this.value;
  }
}
