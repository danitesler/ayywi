import { ElementBase, addIdRef, ensureId } from "../../lib/element";
import { enhanceTooltip, tooltipContentClass } from "./tooltip";

/**
 * <ayy-tooltip class="ayy-tooltip" [side]> — wraps a focusable trigger and a .ayy-tooltip__content bubble.
 * Links them with aria-describedby, moves the bubble into the top layer (no clipping, flips at edges) and adds
 * Esc-to-dismiss. `side` = top | bottom | start | end.
 */
export class AyyTooltipElement extends ElementBase {
  static observedAttributes = ["side"];
  #cleanup: (() => void) | null = null;

  connectedCallback(): void {
    const content = Array.from(this.children).find((el) => el.classList.contains(tooltipContentClass));
    const trigger = Array.from(this.children).find((el) => el !== content);
    if (content) {
      if (!content.getAttribute("role")) content.setAttribute("role", "tooltip");
      if (trigger) addIdRef(trigger, "aria-describedby", ensureId(content, "ayy-tip"));
      this.#applySide();
    }
    this.#cleanup = enhanceTooltip(this);
  }

  disconnectedCallback(): void {
    this.#cleanup?.();
    this.#cleanup = null;
  }

  attributeChangedCallback(): void {
    this.#applySide();
  }

  #applySide(): void {
    const side = this.getAttribute("side");
    const content = Array.from(this.children).find((el) => el.classList.contains(tooltipContentClass));
    if (side && content) content.setAttribute("data-side", side);
  }
}
