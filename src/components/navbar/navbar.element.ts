import { ElementBase } from "../../lib/element";
import { connectNavbar, navbarClass } from "./navbar";

/**
 * <ayy-navbar> — wraps a `.ayy-navbar` and wires its phone menu: the `.ayy-navbar__toggle` opens and closes the
 * links under the bar (see connectNavbar). Without a toggle it does nothing.
 */
export class AyyNavbarElement extends ElementBase {
  #cleanup: (() => void) | null = null;

  connectedCallback(): void {
    const navbar = this.querySelector<HTMLElement>(`.${navbarClass}`);
    if (navbar) this.#cleanup = connectNavbar(navbar);
  }

  disconnectedCallback(): void {
    this.#cleanup?.();
    this.#cleanup = null;
  }
}
