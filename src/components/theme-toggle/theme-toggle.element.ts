import { ElementBase, emit, ensureId } from "../../lib/element";
import { connectThemeToggle } from "./theme-toggle";

/**
 * <ayy-theme-toggle> — wraps the icon <button> and the [popover] menu of theme items (role="menuitemradio",
 * data-value = theme name or "system"). Choosing one switches <html> and remembers it; aria-checked follows the theme
 * in force. Fires "ayy-value-change" ({ value }).
 */
export class AyyThemeToggleElement extends ElementBase {
  #cleanup: (() => void) | null = null;

  connectedCallback(): void {
    const menu = this.querySelector<HTMLElement>("[popover]");
    const button = Array.from(this.querySelectorAll<HTMLElement>("button")).find((el) => !menu?.contains(el));
    if (!button || !menu) return;
    ensureId(menu, "ayy-theme-menu");
    this.#cleanup = connectThemeToggle(button, menu, { onChange: (value) => emit(this, "ayy-value-change", { value }) });
  }

  disconnectedCallback(): void {
    this.#cleanup?.();
    this.#cleanup = null;
  }
}
