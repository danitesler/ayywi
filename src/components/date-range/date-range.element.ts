import { ElementBase, emit } from "../../lib/element";
import {
  connectDateRange,
  formatDateRange,
  type DateRangeController,
  type Weekday,
} from "./date-range";

/**
 * <ayy-date-range [start] [end] [min] [max] [months] [week-start] [locale] [name]> — wraps an .ayy-date-range,
 * draws the months into it (replacing any static month markup), and wires the month arrows, keyboard movement,
 * hover preview, and range selection. Fires "ayy-select" ({ value: [start, end], start, end }) when a range
 * is completed. With name, hidden inputs carry start and end dates in forms. Inside an <ayy-popover> whose
 * trigger has an .ayy-date-range-picker__value, it writes the formatted range there and closes the popover.
 */
export class AyyDateRangeElement extends ElementBase {
  static observedAttributes = ["start", "end", "min", "max", "months"];
  #controller: DateRangeController | null = null;
  #syncing = false;
  #popover: HTMLElement | null = null;
  #onToggle = (event: Event) => {
    if ((event as ToggleEvent).newState === "open") this.focus();
  };

  get value(): [string, string] | null {
    const s = this.getAttribute("start");
    const e = this.getAttribute("end");
    return s && e ? [s, e] : null;
  }
  set value(next: [string, string] | null) {
    if (next) {
      this.setAttribute("start", next[0]);
      this.setAttribute("end", next[1]);
    } else {
      this.removeAttribute("start");
      this.removeAttribute("end");
    }
  }

  connectedCallback(): void {
    const root = this.querySelector<HTMLElement>(".ayy-date-range");
    if (!root) return;
    const weekStart = this.getAttribute("week-start");
    const months = this.getAttribute("months");
    this.#controller = connectDateRange(root, {
      value: this.value,
      months: months === null ? undefined : Number(months),
      min: this.getAttribute("min") ?? undefined,
      max: this.getAttribute("max") ?? undefined,
      weekStart: weekStart === null ? undefined : (Number(weekStart) as Weekday),
      locale: this.getAttribute("locale") ?? undefined,
      onSelect: (range) => this.#picked(range),
    });
    this.#sync(this.value);
    this.#popover = this.closest<HTMLElement>("[popover]");
    this.#popover?.addEventListener("toggle", this.#onToggle);
  }

  disconnectedCallback(): void {
    this.#controller?.destroy();
    this.#controller = null;
    this.#popover?.removeEventListener("toggle", this.#onToggle);
    this.#popover = null;
  }

  attributeChangedCallback(name: string): void {
    if (!this.#controller || this.#syncing) return;
    if (name === "start" || name === "end") {
      this.#controller.setValue(this.value);
      this.#sync(this.value);
    } else if (name === "months") {
      const m = this.getAttribute("months");
      this.#controller.update({ months: m === null ? 2 : Number(m) });
    } else {
      this.#controller.update({ [name]: this.getAttribute(name) ?? undefined });
    }
  }

  focus(): void {
    this.#controller?.focus();
  }

  #picked(range: [string, string]): void {
    this.#syncing = true;
    this.value = range;
    this.#syncing = false;
    this.#sync(range);
    emit(this, "ayy-select", { value: range, start: range[0], end: range[1] });
    const popover = this.closest<HTMLElement>("[popover]");
    if (popover?.matches(":popover-open") && this.closest("ayy-popover")?.querySelector(".ayy-date-range-picker__value")) {
      popover.hidePopover();
    }
  }

  #sync(range: [string, string] | null): void {
    const name = this.getAttribute("name");
    if (name) {
      for (const [suffix, val] of [
        ["start", range?.[0] ?? ""],
        ["end", range?.[1] ?? ""],
      ] as const) {
        const inputName = `${name}-${suffix}`;
        let input = this.querySelector<HTMLInputElement>(`input[type="hidden"][name="${CSS.escape(inputName)}"]`);
        if (!input) {
          input = document.createElement("input");
          input.type = "hidden";
          input.name = inputName;
          this.append(input);
        }
        input.value = val;
      }
    }
    const host = this.closest("ayy-popover");
    const label = host?.querySelector<HTMLElement>(".ayy-date-range-picker__value");
    if (label && !this.contains(label)) {
      label.textContent = range ? formatDateRange(range[0], range[1], this.getAttribute("locale") ?? undefined) : "";
    }
  }
}
