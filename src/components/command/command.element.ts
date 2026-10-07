import { ElementBase, emit } from "../../lib/element";
import { isBackdropClick } from "../dialog/dialog";
import { matchShortcut } from "../shortcut/shortcut";
import { connectCommand, type CommandController } from "./command";

/**
 * <ayy-command [shortcut] [manual]> — wraps an .ayy-command: a div in the page, or a <dialog class="ayy-dialog
 * ayy-command"> with the buttons that open it ([data-ayy-open]). Typing filters the items, the arrows move, Enter or a
 * click runs one and fires "ayy-select" ({ value, item }). A dialog palette opens with the shortcut (default
 * "Mod+K"; shortcut="" for none), closes after a run, on Esc or the backdrop, and starts empty every time.
 * `manual` turns the filtering off (you filter or fetch items yourself on "input").
 */
export class AyyCommandElement extends ElementBase {
  static observedAttributes = ["shortcut"];
  #controller: CommandController | null = null;

  get dialog(): HTMLDialogElement | null {
    return this.querySelector<HTMLDialogElement>("dialog.ayy-command");
  }

  connectedCallback(): void {
    const root = this.querySelector<HTMLElement>(".ayy-command");
    if (!root) return;
    this.#controller = connectCommand(root, {
      filter: !this.hasAttribute("manual"),
      onSelect: (item) => {
        emit(this, "ayy-select", { value: item.dataset.value, item });
        this.dialog?.close();
      },
    });
    this.addEventListener("click", this.#onClick);
    this.dialog?.addEventListener("close", this.#onClose);
    document.addEventListener("keydown", this.#onKeyDown);
  }

  disconnectedCallback(): void {
    this.#controller?.destroy();
    this.#controller = null;
    this.removeEventListener("click", this.#onClick);
    this.dialog?.removeEventListener("close", this.#onClose);
    document.removeEventListener("keydown", this.#onKeyDown);
  }

  /** Re-read the items after you change them. */
  refresh(): void {
    this.#controller?.refresh();
  }

  show(): void {
    const dialog = this.dialog;
    if (!dialog || dialog.open) return;
    this.#controller?.reset();
    dialog.showModal();
    dialog.querySelector<HTMLInputElement>(".ayy-command__input")?.focus();
  }

  #onClick = (event: MouseEvent): void => {
    const dialog = this.dialog;
    if (!dialog) return;
    if ((event.target as Element).closest("[data-ayy-open]")) this.show();
    else if (event.target === dialog && isBackdropClick(dialog, event)) dialog.close();
  };

  #onClose = (): void => {
    this.#controller?.reset();
  };

  #onKeyDown = (event: KeyboardEvent): void => {
    const shortcut = this.getAttribute("shortcut") ?? "Mod+K";
    const dialog = this.dialog;
    if (!dialog || !shortcut || event.defaultPrevented || !matchShortcut(event, shortcut)) return;
    event.preventDefault();
    if (dialog.open) dialog.close();
    else this.show();
  };
}
