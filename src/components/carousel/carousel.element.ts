import { ElementBase } from "../../lib/element";
import { connectCarousel } from "./carousel";

/**
 * <ayy-carousel class="ayy-carousel"> — [data-ayy-prev] / [data-ayy-next] buttons inside it scroll the track one
 * slide at a time and are aria-disabled at the ends. Slides without a label are named "2 of 6".
 */
export class AyyCarouselElement extends ElementBase {
  #cleanup: (() => void) | null = null;

  connectedCallback(): void {
    this.#cleanup = connectCarousel(this);
  }

  disconnectedCallback(): void {
    this.#cleanup?.();
    this.#cleanup = null;
  }
}
