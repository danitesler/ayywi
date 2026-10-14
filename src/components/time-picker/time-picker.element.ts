import { ElementBase, emit } from "../../lib/element";
import {
  connectTimePicker,
  formatTimeString,
  type TimePickerController,
  type TimePickerFormat,
} from "./time-picker";

/**
 * <ayy-time-picker [value] [format] [step] [name]> — wraps an .ayy-time-picker, draws the hour, minute and
 * optional period columns into it, and wires clicks and keyboard navigation. Fires "ayy-select" ({ value })
 * when a time is picked. With name, a hidden input carries the time in forms. Inside an <ayy-popover> whose
 * trigger has an .ayy-time-picker-trigger__value, that shows the formatted time.
 */
export class AyyTimePickerElement extends ElementBase {
  static observedAttributes = ["value", "format", "step"];
  #controller: TimePickerController | null = null;
  #syncing = false;
  #popover: HTMLElement | null = null;
  #onToggle = (event: Event) => {
    if ((event as ToggleEvent).newState === "open") this.focus();
  };

  get value(): string | null {
    return this.getAttribute("value");
  }
  set value(next: string | null) {
    if (next) this.setAttribute("value", next);
    else this.removeAttribute("value");
  }

  connectedCallback(): void {
    const root = this.querySelector<HTMLElement>(".ayy-time-picker");
    if (!root) return;
    const format = (this.getAttribute("format") as TimePickerFormat | null) ?? "24h";
    const stepAttr = this.getAttribute("step");
    this.#controller = connectTimePicker(root, {
      value: this.value,
      format,
      step: stepAttr === null ? undefined : Number(stepAttr),
      onSelect: (value) => this.#picked(value),
    });
    this.#sync(this.value);
    this.#popover = this.closest<HTMLElement>("[popover]");
    this.#popover?.addEventListener("toggle", this.#onToggle);
  }

  disconnectedCallback(): void {
    this.#controller?.destroy();
    this.#controller = null;
    this.#popover?.removeEventListener("toggle", this.#onToggle);
    this.#popover = null;
  }

  attributeChangedCallback(name: string): void {
    if (!this.#controller || this.#syncing) return;
    if (name === "value") {
      this.#controller.setValue(this.value);
      this.#sync(this.value);
    } else if (name === "format") {
      this.#controller.update({ format: (this.getAttribute("format") as TimePickerFormat | null) ?? "24h" });
      this.#sync(this.value);
    } else if (name === "step") {
      const stepAttr = this.getAttribute("step");
      this.#controller.update({ step: stepAttr === null ? 5 : Number(stepAttr) });
    }
  }

  focus(): void {
    this.#controller?.focus();
  }

  #picked(value: string): void {
    this.#syncing = true;
    this.value = value;
    this.#syncing = false;
    this.#sync(value);
    emit(this, "ayy-select", { value });
  }

  #sync(value: string | null): void {
    const name = this.getAttribute("name");
    if (name) {
      let input = this.querySelector<HTMLInputElement>(`input[type="hidden"][name="${CSS.escape(name)}"]`);
      if (!input) {
        input = document.createElement("input");
        input.type = "hidden";
        input.name = name;
        this.append(input);
      }
      input.value = value ?? "";
    }
    const host = this.closest("ayy-popover");
    const label = host?.querySelector<HTMLElement>(".ayy-time-picker-trigger__value");
    if (label && !this.contains(label)) {
      const format = (this.getAttribute("format") as TimePickerFormat | null) ?? "24h";
      label.textContent = value ? formatTimeString(value, format) : "";
    }
  }
}
