import { ElementBase } from "../../lib/element";
import { appShellClass, connectAppShell } from "./app-shell";

/**
 * <ayy-app-shell> — wraps a `.ayy-app-shell` and wires its phone drawer: the `.ayy-app-shell__toggle` in the
 * `.ayy-app-shell__bar` opens and closes the sidebar (see connectAppShell). Without a bar it does nothing.
 */
export class AyyAppShellElement extends ElementBase {
  #cleanup: (() => void) | null = null;

  connectedCallback(): void {
    const shell = this.querySelector<HTMLElement>(`.${appShellClass}`);
    if (shell) this.#cleanup = connectAppShell(shell);
  }

  disconnectedCallback(): void {
    this.#cleanup?.();
    this.#cleanup = null;
  }
}
