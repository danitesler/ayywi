import { ElementBase, emit } from "../../lib/element";
import { connectToc } from "./toc";

/**
 * <ayy-toc [offset]> — scrollspy for the .ayy-toc__link links inside it: the link of the section being read gets
 * aria-current="location". Put it inside the <nav class="ayy-toc">. Fires "ayy-value-change" ({ value: id }).
 */
export class AyyTocElement extends ElementBase {
  static observedAttributes = ["offset"];
  #cleanup: (() => void) | null = null;

  connectedCallback(): void {
    this.#connect();
  }

  disconnectedCallback(): void {
    this.#cleanup?.();
    this.#cleanup = null;
  }

  attributeChangedCallback(): void {
    if (this.isConnected) this.#connect();
  }

  #connect(): void {
    this.#cleanup?.();
    const offset = this.getAttribute("offset");
    this.#cleanup = connectToc(this, {
      offset: offset === null || offset === "" ? undefined : Number(offset),
      onChange: (value) => emit(this, "ayy-value-change", { value }),
    });
  }
}
