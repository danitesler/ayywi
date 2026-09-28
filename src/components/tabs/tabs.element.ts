import { ElementBase, addIdRef, emit, ensureId, own } from "../../lib/element";
import { nextTabIndex } from "./tabs";

/**
 * <ayy-tabs value="…"> — wires WAI-ARIA tabs inside it: ids, aria-selected, roving tabindex, hidden panels,
 * click + arrow keys (RTL-aware), Home/End. Pair tabs and panels with data-value, or by order.
 * Fires "ayy-value-change" ({ value }) when the user picks a tab.
 */
export class AyyTabsElement extends ElementBase {
  static observedAttributes = ["value"];
  #observer: MutationObserver | null = null;

  get value(): string {
    return this.getAttribute("value") ?? "";
  }
  set value(next: string) {
    this.setAttribute("value", next);
  }

  connectedCallback(): void {
    this.addEventListener("click", this.#onClick);
    this.addEventListener("keydown", this.#onKeyDown);
    this.#observer = new MutationObserver(() => this.#sync());
    this.#observer.observe(this, { childList: true, subtree: true });
    this.#sync();
  }

  disconnectedCallback(): void {
    this.removeEventListener("click", this.#onClick);
    this.removeEventListener("keydown", this.#onKeyDown);
    this.#observer?.disconnect();
    this.#observer = null;
  }

  attributeChangedCallback(): void {
    if (this.isConnected) this.#sync();
  }

  #tabs(): HTMLElement[] {
    return own<HTMLElement>(this, '[role="tab"]');
  }

  #keyOf(tab: HTMLElement, index: number): string {
    return tab.dataset.value ?? String(index);
  }

  #sync(): void {
    const tabs = this.#tabs();
    if (!tabs.length) return;
    const panels = own<HTMLElement>(this, '[role="tabpanel"]');
    const keys = tabs.map((tab, i) => this.#keyOf(tab, i));
    const enabled = (i: number) => i >= 0 && !tabs[i].hasAttribute("disabled");

    let index = keys.indexOf(this.value);
    if (!enabled(index)) index = tabs.findIndex((t, i) => t.getAttribute("aria-selected") === "true" && enabled(i));
    if (!enabled(index)) index = tabs.findIndex((_, i) => enabled(i));

    const byValue = panels.every((p) => p.dataset.value !== undefined);
    tabs.forEach((tab, i) => {
      const panel = byValue ? panels.find((p) => p.dataset.value === keys[i]) : panels[i];
      const selected = i === index;
      ensureId(tab, "ayy-tab");
      tab.setAttribute("aria-selected", String(selected));
      tab.tabIndex = selected ? 0 : -1;
      if (panel) {
        ensureId(panel, "ayy-panel");
        tab.setAttribute("aria-controls", panel.id);
        addIdRef(panel, "aria-labelledby", tab.id);
        if (!panel.hasAttribute("tabindex")) panel.tabIndex = 0;
        panel.hidden = !selected;
      }
    });
  }

  #select(tab: HTMLElement, focus: boolean): void {
    const tabs = this.#tabs();
    const index = tabs.indexOf(tab);
    if (index < 0 || tab.hasAttribute("disabled")) return;
    const value = this.#keyOf(tab, index);
    if (focus) tab.focus();
    if (value === this.value && tab.getAttribute("aria-selected") === "true") return;
    this.value = value;
    emit(this, "ayy-value-change", { value });
  }

  #onClick = (event: Event): void => {
    const tab = (event.target as Element | null)?.closest<HTMLElement>('[role="tab"]');
    if (tab && tab.closest("ayy-tabs") === this) this.#select(tab, false);
  };

  #onKeyDown = (event: KeyboardEvent): void => {
    const tab = (event.target as Element | null)?.closest<HTMLElement>('[role="tab"]');
    if (!tab || tab.closest("ayy-tabs") !== this) return;
    const tabs = this.#tabs().filter((t) => !t.hasAttribute("disabled"));
    const list = tab.closest('[role="tablist"]') ?? this;
    const next = nextTabIndex(event.key, tabs.indexOf(tab), tabs.length, getComputedStyle(list).direction === "rtl");
    if (next === null) return;
    event.preventDefault();
    this.#select(tabs[next], true);
  };
}
