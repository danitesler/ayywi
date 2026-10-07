import { ElementBase, emit } from "../../lib/element";
import { connectShortcutRecorder, type ShortcutRecorderController } from "./shortcut";

/**
 * <ayy-shortcut-recorder [value] [label] [bare]> — wraps a button.ayy-shortcut-recorder: click it, press the keys,
 * and value becomes the new shortcut ("Mod+Shift+K"). Esc cancels, Backspace or Delete clears. Fires "ayy-change"
 * ({ value }; value is null when cleared) and "ayy-recording" ({ recording }) so the page can pause its own shortcuts.
 */
export class AyyShortcutRecorderElement extends ElementBase {
  static observedAttributes = ["value"];
  #controller: ShortcutRecorderController | null = null;
  #syncing = false;

  get value(): string | null {
    return this.getAttribute("value");
  }
  set value(next: string | null) {
    if (next) this.setAttribute("value", next);
    else this.removeAttribute("value");
  }

  connectedCallback(): void {
    const button = this.querySelector<HTMLButtonElement>("button.ayy-shortcut-recorder");
    if (!button) return;
    this.#controller = connectShortcutRecorder(button, {
      value: this.value,
      label: this.getAttribute("label") ?? undefined,
      bare: this.hasAttribute("bare"),
      onChange: (value) => {
        this.#syncing = true;
        this.value = value;
        this.#syncing = false;
        emit(this, "ayy-change", { value });
      },
      onRecordingChange: (recording) => emit(this, "ayy-recording", { recording }),
    });
  }

  disconnectedCallback(): void {
    this.#controller?.destroy();
    this.#controller = null;
  }

  attributeChangedCallback(): void {
    if (!this.#syncing) this.#controller?.setValue(this.value);
  }
}
