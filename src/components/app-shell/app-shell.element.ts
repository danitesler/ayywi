import { ElementBase, emit } from "../../lib/element";
import {
  appShellClass,
  appShellCollapsedClass,
  appShellHoverPreviewClass,
  appShellSidebarClass,
  appShellSmClass,
  appShellToggleClass,
  connectAppShell,
} from "./app-shell";

/**
 * <ayy-app-shell [collapsed] [hover-preview] [size]> — wraps a `.ayy-app-shell` and wires its interactions:
 * - On phones: the `.ayy-app-shell__toggle` in the `.ayy-app-shell__bar` or bottom nav opens and closes the drawer.
 * - On wide screens: collapses to an icon rail when `collapsed` is set, and a toggle collapses/expands the sidebar.
 * - Hovering or focusing the collapsed sidebar expands it as an overlay preview; on by default, hover-preview="false" turns it off.
 * - `size="sm"` is the Small size (sets ayy-app-shell--sm); Big ("md") is the default.
 * Fires "ayy-collapse-change" ({ collapsed }) when toggled.
 */
export class AyyAppShellElement extends ElementBase {
  static observedAttributes = ["collapsed", "hover-preview", "size"];
  #cleanup: (() => void) | null = null;
  #lastCollapsed: boolean | null = null;

  get collapsed(): boolean {
    return this.hasAttribute("collapsed");
  }
  set collapsed(value: boolean) {
    this.toggleAttribute("collapsed", value);
  }

  get hoverPreview(): boolean {
    return this.getAttribute("hover-preview") !== "false";
  }
  set hoverPreview(value: boolean) {
    if (!value) {
      this.setAttribute("hover-preview", "false");
    } else {
      this.removeAttribute("hover-preview");
    }
  }

  get size(): string {
    return this.getAttribute("size") || "md";
  }
  set size(value: string) {
    this.setAttribute("size", value);
  }

  get shell(): HTMLElement | null {
    return this.querySelector<HTMLElement>(`.${appShellClass}`);
  }

  connectedCallback(): void {
    const shell = this.shell;
    if (shell) {
      this.#syncClasses();
      this.#lastCollapsed = this.collapsed;
      this.#cleanup = connectAppShell(shell, {
        onCollapseChange: (collapsed) => {
          this.#lastCollapsed = collapsed;
          this.collapsed = collapsed;
          emit(this, "ayy-collapse-change", { collapsed });
        },
      });
    }
  }

  disconnectedCallback(): void {
    this.#cleanup?.();
    this.#cleanup = null;
  }

  attributeChangedCallback(name: string): void {
    if (this.isConnected) {
      this.#syncClasses();
      if (name === "collapsed" && this.collapsed !== this.#lastCollapsed) {
        this.#lastCollapsed = this.collapsed;
        emit(this, "ayy-collapse-change", { collapsed: this.collapsed });
      }
    }
  }

  toggleCollapse(): void {
    this.collapsed = !this.collapsed;
  }

  #syncClasses(): void {
    const shell = this.shell;
    if (!shell) return;
    shell.classList.toggle(appShellCollapsedClass, this.collapsed);
    shell.classList.toggle(appShellHoverPreviewClass, this.hoverPreview);
    // Only when size is set, so a hand-written .ayy-app-shell--sm survives.
    if (this.hasAttribute("size")) shell.classList.toggle(appShellSmClass, this.size === "sm");
    const toggles = shell.querySelectorAll<HTMLElement>(`:scope > .${appShellSidebarClass} .${appShellToggleClass}`);
    for (const toggle of toggles) {
      toggle.setAttribute("aria-expanded", String(!this.collapsed));
    }
  }
}
