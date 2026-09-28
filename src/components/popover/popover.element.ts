import { ElementBase, emit, ensureId } from "../../lib/element";
import type { FloatingAlign, FloatingSide } from "../../lib/position";
import { connectPopover, type PopoverController } from "./popover";

/**
 * <ayy-popover [side] [align] [open]> — wraps a trigger button and a [popover] element. The trigger opens it
 * (native popovertarget works without JS too), the popover is placed next to the trigger, aria-expanded is synced.
 * Fires "ayy-open-change" ({ open }).
 */
export class AyyPopoverElement extends ElementBase {
  static observedAttributes = ["open", "side", "align"];
  protected controller: PopoverController | null = null;
  #syncing = false;

  get open(): boolean {
    return this.hasAttribute("open");
  }
  set open(value: boolean) {
    this.toggleAttribute("open", value);
  }

  protected get defaultAlign(): FloatingAlign {
    return "center";
  }

  protected parts(): { trigger: HTMLElement | null; content: HTMLElement | null } {
    const content = this.querySelector<HTMLElement>("[popover]");
    const find = (selector: string) =>
      Array.from(this.querySelectorAll<HTMLElement>(selector)).find((el) => !content?.contains(el));
    const trigger = find("[data-ayy-trigger]") ?? find("[popovertarget]") ?? find("button") ?? null;
    return { trigger, content };
  }

  protected placement() {
    return {
      side: (this.getAttribute("side") as FloatingSide | null) ?? "bottom",
      align: (this.getAttribute("align") as FloatingAlign | null) ?? this.defaultAlign,
    };
  }

  connectedCallback(): void {
    const { trigger, content } = this.parts();
    if (!trigger || !content) return;
    ensureId(content, "ayy-popover");
    this.controller = connectPopover(trigger, content, {
      ...this.placement(),
      onToggle: (open) => this.handleToggle(open),
    });
    if (this.open) this.controller.open();
  }

  disconnectedCallback(): void {
    this.controller?.destroy();
    this.controller = null;
  }

  attributeChangedCallback(name: string): void {
    if (!this.controller || this.#syncing) return;
    if (name === "open") {
      if (this.open) this.controller.open();
      else this.controller.close();
    } else {
      this.controller.update(this.placement());
    }
  }

  protected handleToggle(open: boolean): void {
    this.#syncing = true;
    this.open = open;
    this.#syncing = false;
    emit(this, "ayy-open-change", { open });
  }
}
