import { ElementBase, emit } from "../../lib/element";
import { themes, type ThemeName } from "../../tokens";
import { connectThemeToggle } from "./theme-toggle";

const theme = (value: string | null): ThemeName | undefined =>
  value && (themes as readonly string[]).includes(value) ? (value as ThemeName) : undefined;

/**
 * <ayy-theme-toggle [dark] [light]> — makes the <button> inside it a dark-theme toggle: aria-pressed follows the
 * colour scheme, a click switches <html> to the other theme and remembers it. Fires "ayy-value-change" ({ value }).
 */
export class AyyThemeToggleElement extends ElementBase {
  static observedAttributes = ["dark", "light"];
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
    this.#cleanup = null;
    const button = this.querySelector<HTMLElement>("button");
    if (!button) return;
    this.#cleanup = connectThemeToggle(button, {
      dark: theme(this.getAttribute("dark")),
      light: theme(this.getAttribute("light")),
      onChange: (value) => emit(this, "ayy-value-change", { value }),
    });
  }
}
