import { emit, ensureId } from "../../lib/element";
import type { FloatingAlign } from "../../lib/position";
import { AyyPopoverElement } from "../popover/popover.element";
import { connectMenu } from "./menu";

/**
 * <ayy-menu [side] [align] [open]> — wraps a trigger button and a [popover] element with role="menu" items.
 * Adds the full menu keyboard model and fires "ayy-select" ({ value, item }) when an item is chosen
 * (value = the item's data-value, else its text). Also fires "ayy-open-change" ({ open }).
 */
export class AyyMenuElement extends AyyPopoverElement {
  protected override get defaultAlign(): FloatingAlign {
    return "start";
  }

  override connectedCallback(): void {
    const { trigger, content } = this.parts();
    if (!trigger || !content) return;
    ensureId(content, "ayy-menu");
    this.controller = connectMenu(trigger, content, {
      ...this.placement(),
      onToggle: (open) => this.handleToggle(open),
      onSelect: (item) => emit(this, "ayy-select", { value: item.dataset.value ?? item.textContent?.trim() ?? "", item }),
    });
    if (this.open) this.controller.open();
  }
}
