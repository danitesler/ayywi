import { ElementBase, emit } from "../../lib/element";
import { comboboxListboxClass, comboboxOptionLabel, connectCombobox, type ComboboxController } from "./combobox";

/**
 * <ayy-combobox [manual]> — wraps an .ayy-combobox (an .ayy-input and an .ayy-combobox__listbox of role="option"
 * items, and an optional hidden input for the form value) and wires the combobox pattern on it. Fires "ayy-select" ({ value, label, option }) when an option is
 * chosen; value is the option's data-value, else its label. With manual, options aren't filtered: listen to the
 * input's input event and replace them yourself (a search API), then call refresh().
 */
export class AyyComboboxElement extends ElementBase {
  #controller: ComboboxController | null = null;

  connectedCallback(): void {
    const input = this.querySelector<HTMLInputElement>("input:not([type='hidden'])");
    const listbox = this.querySelector<HTMLElement>(`.${comboboxListboxClass}`);
    if (!input || !listbox) return;
    this.#controller = connectCombobox(input, listbox, {
      filter: !this.hasAttribute("manual"),
      onSelect: (option) => {
        const label = comboboxOptionLabel(option);
        const value = option.dataset.value ?? label;
        // A hidden input carries the value in forms (the visible one shows the label).
        const field = this.querySelector<HTMLInputElement>("input[type='hidden']");
        if (field) field.value = value;
        emit(this, "ayy-select", { value, label, option });
      },
    });
  }

  disconnectedCallback(): void {
    this.#controller?.destroy();
    this.#controller = null;
  }

  /** Re-read the options after changing them. */
  refresh(): void {
    this.#controller?.refresh();
  }
}
