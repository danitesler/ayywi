import { ElementBase, emit } from "../../lib/element";
import { connectColorPicker, type ColorPickerController } from "./color-picker";

/**
 * <ayy-color-picker [value] [alpha] [name]> — wraps an .ayy-color-picker and wires its 2D saturation/brightness
 * area, hue and alpha sliders, hex input, and preset swatch buttons ([data-color]). Fires "ayy-change" ({ value })
 * when the colour changes. With name, a hidden input carries the hex colour in forms.
 */
export class AyyColorPickerElement extends ElementBase {
  static observedAttributes = ["value", "alpha"];
  #controller: ColorPickerController | null = null;
  #syncing = false;

  get value(): string {
    return this.getAttribute("value") ?? "#2563eb";
  }
  set value(next: string) {
    this.setAttribute("value", next);
  }

  connectedCallback(): void {
    const root = this.querySelector<HTMLElement>(".ayy-color-picker");
    if (!root) return;
    const alphaAttr = this.getAttribute("alpha");
    this.#controller = connectColorPicker(root, {
      value: this.value,
      alpha: alphaAttr === null ? undefined : alphaAttr !== "false",
      onChange: (color) => this.#changed(color),
    });
    this.#sync(this.value);
  }

  disconnectedCallback(): void {
    this.#controller?.destroy();
    this.#controller = null;
  }

  attributeChangedCallback(name: string): void {
    if (!this.#controller || this.#syncing) return;
    if (name === "value") {
      this.#controller.setValue(this.value);
      this.#sync(this.value);
    } else if (name === "alpha") {
      const alphaAttr = this.getAttribute("alpha");
      this.#controller.update({ alpha: alphaAttr !== null && alphaAttr !== "false" });
    }
  }

  #changed(value: string): void {
    this.#syncing = true;
    this.value = value;
    this.#syncing = false;
    this.#sync(value);
    emit(this, "ayy-change", { value });
  }

  #sync(value: string): void {
    const name = this.getAttribute("name");
    if (name) {
      let input = this.querySelector<HTMLInputElement>(`input[type="hidden"][name="${CSS.escape(name)}"]`);
      if (!input) {
        input = document.createElement("input");
        input.type = "hidden";
        input.name = name;
        this.append(input);
      }
      input.value = value;
    }
  }
}
