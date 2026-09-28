import { ElementBase, emit } from "../../lib/element";
import { isBackdropClick } from "./dialog";

/**
 * <ayy-dialog [open] [persistent]> — wraps a trigger and a <dialog class="ayy-dialog">.
 * [data-ayy-open] inside it opens the dialog, [data-ayy-close] inside the dialog closes it (its value becomes
 * dialog.returnValue), a backdrop click closes it unless `persistent`. The `open` attribute/property is two-way.
 * Fires "ayy-open-change" ({ open }) on every open/close.
 */
export class AyyDialogElement extends ElementBase {
  static observedAttributes = ["open"];
  #dialog: HTMLDialogElement | null = null;

  get open(): boolean {
    return this.hasAttribute("open");
  }
  set open(value: boolean) {
    this.toggleAttribute("open", value);
  }

  get dialog(): HTMLDialogElement | null {
    return this.querySelector<HTMLDialogElement>("dialog");
  }

  connectedCallback(): void {
    this.addEventListener("click", this.#onClick);
    this.#bind();
    if (this.open) this.#apply();
  }

  disconnectedCallback(): void {
    this.removeEventListener("click", this.#onClick);
    this.#dialog?.removeEventListener("close", this.#onClose);
    this.#dialog = null;
  }

  attributeChangedCallback(): void {
    if (this.isConnected) this.#apply();
  }

  showModal(): void {
    this.open = true;
  }

  close(returnValue?: string): void {
    const dialog = this.dialog;
    if (dialog?.open) dialog.close(returnValue);
    else this.open = false;
  }

  #bind(): void {
    const dialog = this.dialog;
    if (dialog === this.#dialog) return;
    this.#dialog?.removeEventListener("close", this.#onClose);
    this.#dialog = dialog;
    dialog?.addEventListener("close", this.#onClose);
  }

  #apply(): void {
    this.#bind();
    const dialog = this.#dialog;
    if (!dialog?.isConnected) return;
    if (this.open && !dialog.open) {
      dialog.showModal();
      emit(this, "ayy-open-change", { open: true });
    } else if (!this.open && dialog.open) {
      dialog.close();
    }
  }

  #onClose = (): void => {
    if (this.open) this.removeAttribute("open");
    emit(this, "ayy-open-change", { open: false, returnValue: this.#dialog?.returnValue ?? "" });
  };

  #onClick = (event: MouseEvent): void => {
    const target = event.target as Element | null;
    const dialog = this.dialog;
    if (!target || !dialog) return;

    const opener = target.closest("[data-ayy-open]");
    if (opener && this.contains(opener) && !dialog.contains(opener)) {
      this.open = true;
      return;
    }

    const closer = target.closest("[data-ayy-close]");
    if (closer && dialog.contains(closer)) {
      dialog.close(closer.getAttribute("data-ayy-close") || undefined);
      return;
    }

    if (target === dialog && !this.hasAttribute("persistent") && isBackdropClick(dialog, event)) dialog.close();
  };
}
