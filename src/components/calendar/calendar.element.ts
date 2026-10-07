import { ElementBase, emit } from "../../lib/element";
import { connectCalendar, formatDate, type CalendarController, type Weekday } from "./calendar";

/**
 * <ayy-calendar [value] [min] [max] [week-start] [locale] [name]> — wraps an .ayy-calendar and draws the month into
 * it (title, weekdays, day buttons; the HTML may carry one month already, which is replaced), with the month
 * arrows and the keyboard working. Fires "ayy-select" ({ value }) when a day is picked. With name, a hidden input
 * carries the date in forms. Inside an <ayy-popover> whose trigger has an .ayy-date-picker__value, that shows the
 * date and the popover closes: a date picker without any script of your own.
 */
export class AyyCalendarElement extends ElementBase {
  static observedAttributes = ["value", "min", "max"];
  #controller: CalendarController | null = null;
  #syncing = false;
  #popover: HTMLElement | null = null;
  // Opening the popover it sits in moves focus to the picked day.
  #onToggle = (event: Event) => {
    if ((event as ToggleEvent).newState === "open") this.focus();
  };

  get value(): string | null {
    return this.getAttribute("value");
  }
  set value(next: string | null) {
    if (next) this.setAttribute("value", next);
    else this.removeAttribute("value");
  }

  connectedCallback(): void {
    const root = this.querySelector<HTMLElement>(".ayy-calendar");
    if (!root) return;
    const weekStart = this.getAttribute("week-start");
    this.#controller = connectCalendar(root, {
      value: this.value,
      min: this.getAttribute("min") ?? undefined,
      max: this.getAttribute("max") ?? undefined,
      weekStart: weekStart === null ? undefined : (Number(weekStart) as Weekday),
      locale: this.getAttribute("locale") ?? undefined,
      onSelect: (value) => this.#picked(value),
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
    if (name === "value") {
      this.#controller.setValue(this.value);
      this.#sync(this.value);
    } else this.#controller.update({ [name]: this.getAttribute(name) ?? undefined });
  }

  /** Focus the picked day (else today). */
  focus(): void {
    this.#controller?.focus();
  }

  #picked(value: string): void {
    this.#syncing = true;
    this.value = value;
    this.#syncing = false;
    this.#sync(value);
    emit(this, "ayy-select", { value });
    const popover = this.closest<HTMLElement>("[popover]");
    if (popover?.matches(":popover-open") && this.closest("ayy-popover")?.querySelector(".ayy-date-picker__value")) popover.hidePopover();
  }

  // The hidden form input and a date picker trigger show the value.
  #sync(value: string | null): void {
    const name = this.getAttribute("name");
    if (name) {
      let input = this.querySelector<HTMLInputElement>(`input[type="hidden"][name="${CSS.escape(name)}"]`);
      if (!input) {
        input = document.createElement("input");
        input.type = "hidden";
        input.name = name;
        this.append(input);
      }
      input.value = value ?? "";
    }
    const host = this.closest("ayy-popover");
    const label = host?.querySelector<HTMLElement>(".ayy-date-picker__value");
    if (label && !this.contains(label)) label.textContent = value ? formatDate(value, this.getAttribute("locale") ?? undefined) : "";
  }
}
