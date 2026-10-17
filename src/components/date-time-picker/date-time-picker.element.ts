import { ElementBase, emit } from "../../lib/element";
import {
  connectDatePicker,
  connectDateRange,
  connectDateTimePicker,
  connectTimePicker,
  formatDate,
  formatDateRange,
  formatDateTime,
  formatTimeString,
  type DatePickerController,
  type DateRangeController,
  type DateTimePickerController,
  type TimePickerController,
  type TimePickerFormat,
  type Weekday,
} from "./date-time-picker";

/**
 * <ayy-date-picker [value] [min] [max] [week-start] [locale] [name]> — wraps an .ayy-date-picker-grid
 * and draws the month grid with navigation and keyboard support. Fires "ayy-select" ({ value })
 * when a day is picked. Inside a popover whose trigger has an .ayy-date-picker__value, it displays
 * the date and closes the popover.
 */
export class AyyDatePickerElement extends ElementBase {
  static observedAttributes = ["value", "min", "max"];
  #controller: DatePickerController | null = null;
  #syncing = false;
  #popover: HTMLElement | null = null;

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
    const root = this.querySelector<HTMLElement>(".ayy-date-picker-grid") ?? this.querySelector<HTMLElement>(".ayy-date-picker");
    if (!root) return;
    const weekStart = this.getAttribute("week-start");
    const showActions = this.hasAttribute("show-actions");
    this.#controller = connectDatePicker(root, {
      value: this.value,
      min: this.getAttribute("min") ?? undefined,
      max: this.getAttribute("max") ?? undefined,
      weekStart: weekStart === null ? undefined : (Number(weekStart) as Weekday),
      locale: this.getAttribute("locale") ?? undefined,
      showActions: showActions || undefined,
      clearLabel: this.getAttribute("clear-label") ?? undefined,
      todayLabel: this.getAttribute("today-label") ?? undefined,
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
    } else {
      this.#controller.update({ [name]: this.getAttribute(name) ?? undefined });
    }
  }

  focus(): void {
    this.#controller?.focus();
  }

  #picked(value: string | null): void {
    this.#syncing = true;
    this.value = value || null;
    this.#syncing = false;
    this.#sync(value || null);
    emit(this, "ayy-select", { value: value || null });
    const popover = this.closest<HTMLElement>("[popover]");
    if (popover?.matches(":popover-open") && this.closest("ayy-popover")?.querySelector(".ayy-date-picker__value")) {
      popover.hidePopover();
    }
  }

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
    if (label && !this.contains(label)) {
      label.textContent = value ? formatDate(value, this.getAttribute("locale") ?? undefined) : "";
    }
  }
}

/**
 * <ayy-date-range [start] [end] [min] [max] [months] [week-start] [locale] [name]> — wraps an .ayy-date-range,
 * draws side-by-side month grids, and handles range selection, arrows, and keyboard navigation.
 * Fires "ayy-select" ({ value: [start, end], start, end }) when a range is completed.
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
    const showActions = this.hasAttribute("show-actions");
    this.#controller = connectDateRange(root, {
      value: this.value,
      months: months === null ? undefined : Number(months),
      min: this.getAttribute("min") ?? undefined,
      max: this.getAttribute("max") ?? undefined,
      weekStart: weekStart === null ? undefined : (Number(weekStart) as Weekday),
      locale: this.getAttribute("locale") ?? undefined,
      showActions: showActions || undefined,
      clearLabel: this.getAttribute("clear-label") ?? undefined,
      todayLabel: this.getAttribute("today-label") ?? undefined,
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

  #picked(range: [string, string] | null): void {
    this.#syncing = true;
    this.value = range;
    this.#syncing = false;
    this.#sync(range);
    emit(this, "ayy-select", { value: range, start: range?.[0] ?? null, end: range?.[1] ?? null });
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
      ]) {
        const inputName = `${name}_${suffix}`;
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
      label.textContent = range && range[0] && range[1] ? formatDateRange(range[0], range[1], this.getAttribute("locale") ?? undefined) : "";
    }
  }
}

/**
 * <ayy-time-picker [value] [format] [step] [name]> — wraps an .ayy-time-picker, draws hour, minute,
 * and optional period columns, and handles scrolling and keyboard selection. Fires "ayy-select" ({ value }).
 */
export class AyyTimePickerElement extends ElementBase {
  static observedAttributes = ["value", "format", "step"];
  #controller: TimePickerController | null = null;
  #syncing = false;
  #popover: HTMLElement | null = null;

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
    const root = this.querySelector<HTMLElement>(".ayy-time-picker");
    if (!root) return;
    const format = (this.getAttribute("format") as TimePickerFormat | null) ?? "24h";
    const stepAttr = this.getAttribute("step");
    this.#controller = connectTimePicker(root, {
      value: this.value,
      twelveHour: format === "12h",
      stepMinute: stepAttr === null ? undefined : Number(stepAttr),
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
    } else if (name === "format") {
      const format = (this.getAttribute("format") as TimePickerFormat | null) ?? "24h";
      this.#controller.update({ twelveHour: format === "12h" });
      this.#sync(this.value);
    } else if (name === "step") {
      const stepAttr = this.getAttribute("step");
      this.#controller.update({ stepMinute: stepAttr === null ? 5 : Number(stepAttr) });
    }
  }

  focus(): void {
    this.#controller?.focus();
  }

  #picked(value: string): void {
    this.#syncing = true;
    this.value = value;
    this.#syncing = false;
    this.#sync(value);
    emit(this, "ayy-select", { value });
  }

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
    const label = host?.querySelector<HTMLElement>(".ayy-time-picker-trigger__value");
    if (label && !this.contains(label)) {
      const format = (this.getAttribute("format") as TimePickerFormat | null) ?? "24h";
      label.textContent = value ? formatTimeString(value, format) : "";
    }
  }
}

/**
 * <ayy-date-time-picker [value] [format] [step] [min] [max] [week-start] [locale] [name]> — wraps an .ayy-date-time-picker,
 * combining date grid and time columns side-by-side. Fires "ayy-select" ({ value, date, time }).
 */
export class AyyDateTimePickerElement extends ElementBase {
  static observedAttributes = ["value", "format", "step", "min", "max"];
  #controller: DateTimePickerController | null = null;
  #syncing = false;
  #dateVal: string | null = null;
  #timeVal: string | null = null;
  #popover: HTMLElement | null = null;

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
    const root = this.querySelector<HTMLElement>(".ayy-date-time-picker");
    if (!root) return;
    const format = (this.getAttribute("format") as TimePickerFormat | null) ?? "24h";
    const stepAttr = this.getAttribute("step");
    const parts = (this.value ?? "").split("T");
    this.#dateVal = parts[0] || null;
    this.#timeVal = parts[1] || null;
    const showActions = this.hasAttribute("show-actions");

    const closePopover = () => {
      const popover = this.closest<HTMLElement>("[popover]");
      if (popover?.matches(":popover-open") && this.closest("ayy-popover")?.querySelector(".ayy-date-time-picker-trigger__value")) {
        popover.hidePopover();
      }
    };

    this.#controller = connectDateTimePicker(root, {
      dateValue: this.#dateVal,
      timeValue: this.#timeVal,
      twelveHour: format === "12h",
      stepMinute: stepAttr === null ? undefined : Number(stepAttr),
      min: this.getAttribute("min") ?? undefined,
      max: this.getAttribute("max") ?? undefined,
      locale: this.getAttribute("locale") ?? undefined,
      showActions: showActions || undefined,
      clearLabel: this.getAttribute("clear-label") ?? undefined,
      todayLabel: this.getAttribute("today-label") ?? undefined,
      onClear: closePopover,
      onToday: closePopover,
      onSelect: (d, t) => this.#picked(d, t),
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
      const parts = (this.value ?? "").split("T");
      this.#dateVal = parts[0] || null;
      this.#timeVal = parts[1] || null;
      this.#controller.setValue(this.#dateVal, this.#timeVal);
      this.#sync(this.value);
    } else if (name === "format") {
      const format = (this.getAttribute("format") as TimePickerFormat | null) ?? "24h";
      this.#controller.update({ twelveHour: format === "12h" });
      this.#sync(this.value);
    } else if (name === "step") {
      const stepAttr = this.getAttribute("step");
      this.#controller.update({ stepMinute: stepAttr === null ? 5 : Number(stepAttr) });
    } else {
      this.#controller.update({ [name]: this.getAttribute(name) ?? undefined });
    }
  }

  focus(): void {
    this.#controller?.focus();
  }

  #picked(date: string, time: string): void {
    this.#dateVal = date || null;
    this.#timeVal = time || null;
    const combined = date && time ? `${date}T${time}` : null;
    this.#syncing = true;
    this.value = combined;
    this.#syncing = false;
    this.#sync(combined);
    emit(this, "ayy-select", { value: combined, date: this.#dateVal, time: this.#timeVal });
  }

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
    const label = host?.querySelector<HTMLElement>(".ayy-date-time-picker-trigger__value");
    if (label && !this.contains(label)) {
      const format = (this.getAttribute("format") as TimePickerFormat | null) ?? "24h";
      label.textContent = this.#dateVal && this.#timeVal ? formatDateTime(this.#dateVal, this.#timeVal, this.getAttribute("locale") ?? undefined, format) : "";
    }
  }
}
