import { cx } from "../../lib/cx";
import { ArrowLeft01Icon, ArrowRight01Icon, Calendar03Icon } from "../../lib/icons";
import { iconSvg } from "../icon/icon";
import { type InputSize } from "../input/input";

// Dates are ISO strings ("2026-10-12"): no time, no time zone, preventing DST and clock offset issues.

export const dateRangeClass = "ayy-date-range";
export const dateRangePickerClass = "ayy-date-range-picker";

export const dateRangePickerSizes = ["sm", "md", "lg"] as const;
export type DateRangePickerSize = InputSize;

export function dateRangeClassName({ className }: { className?: string } = {}): string {
  return cx("ayy-date-range", className);
}

export function dateRangePickerClassName({ size, className }: { size?: DateRangePickerSize; className?: string } = {}): string {
  return cx("ayy-date-range-picker", size && `ayy-input--${size}`, className);
}

/** The arrows of .ayy-date-range__nav and the trigger's icon, as SVG markup. */
export const dateRangePreviousIcon = /* @__PURE__ */ iconSvg(ArrowLeft01Icon, { directional: true });
export const dateRangeNextIcon = /* @__PURE__ */ iconSvg(ArrowRight01Icon, { directional: true });
export const dateRangePickerIcon = /* @__PURE__ */ iconSvg(Calendar03Icon);

import {
  addDays,
  addMonths,
  formatDate,
  localeWeekStart,
  parseIsoDate,
  startOfMonth,
  startOfWeek,
  todayIso,
  type Weekday,
} from "../calendar/calendar";

const navigatorLocale = () => (typeof navigator === "undefined" ? "en-US" : navigator.language);

export type { Weekday };

/** Check if two ISO dates represent the same day. */
export function isSameDay(a: string | null | undefined, b: string | null | undefined): boolean {
  return Boolean(a && b && a === b);
}

/** Check if an ISO date is strictly between start and end dates. */
export function isInRange(date: string, start: string | null | undefined, end: string | null | undefined): boolean {
  if (!start || !end) return false;
  const [min, max] = start <= end ? [start, end] : [end, start];
  return date > min && date < max;
}

/** Format a date range into e.g. "Oct 12 – Oct 18, 2026" or "12 – 18 Oct 2026". */
export function formatDateRange(start: string, end: string, locale?: string): string {
  if (start === end) {
    return formatDate(start, locale);
  }
  const [min, max] = start <= end ? [start, end] : [end, start];
  const loc = locale ?? (typeof navigator === "undefined" ? "en-US" : navigator.language);
  try {
    const d1 = parseIsoDate(min);
    const d2 = parseIsoDate(max);
    const formatter = new Intl.DateTimeFormat(loc, { month: "short", day: "numeric", year: "numeric" });
    if (typeof formatter.formatRange === "function") {
      return formatter.formatRange(d1, d2);
    }
  } catch {
    // Fall back to manual string format
  }
  return `${formatDate(min, loc)} – ${formatDate(max, loc)}`;
}

export interface DateRangeDay {
  /** "2026-10-12" */
  date: string;
  /** Day of the month, 1–31. */
  day: number;
  /** In the month before or after the one shown. */
  outside: boolean;
  today: boolean;
  isStart: boolean;
  isEnd: boolean;
  inRange: boolean;
  /** Before min or after max. */
  disabled: boolean;
}

export interface DateRangeMonthOptions {
  month: string;
  range?: [string, string] | null;
  hoverDate?: string | null;
  pendingStart?: string | null;
  today?: string;
  min?: string;
  max?: string;
  weekStart?: Weekday;
}

/** Six weeks (42 days) for a month in the date range grid. */
export function dateRangeMonth({
  month,
  range = null,
  hoverDate = null,
  pendingStart = null,
  today = todayIso(),
  min,
  max,
  weekStart = 1,
}: DateRangeMonthOptions): DateRangeDay[] {
  const first = startOfMonth(month);
  const start = startOfWeek(first, weekStart);

  let activeStart: string | null = null;
  let activeEnd: string | null = null;

  if (pendingStart) {
    activeStart = pendingStart;
    activeEnd = hoverDate ?? pendingStart;
  } else if (range) {
    activeStart = range[0];
    activeEnd = range[1];
  }

  let minRange: string | null = null;
  let maxRange: string | null = null;
  if (activeStart && activeEnd) {
    [minRange, maxRange] = activeStart <= activeEnd ? [activeStart, activeEnd] : [activeEnd, activeStart];
  } else if (activeStart) {
    minRange = activeStart;
    maxRange = activeStart;
  }

  const days: DateRangeDay[] = [];
  for (let i = 0; i < 42; i++) {
    const date = addDays(start, i);
    const isStart = Boolean(minRange && date === minRange);
    const isEnd = Boolean(maxRange && date === maxRange);
    const inRange = Boolean(minRange && maxRange && minRange !== maxRange && date > minRange && date < maxRange);

    days.push({
      date,
      day: Number(date.slice(8)),
      outside: date.slice(0, 7) !== first.slice(0, 7),
      today: date === today,
      isStart,
      isEnd,
      inRange,
      disabled: (min !== undefined && date < min) || (max !== undefined && date > max),
    });
  }
  return days;
}

export interface DateRangeLabels {
  month(iso: string): string;
  day(iso: string): string;
  weekdays(weekStart: Weekday): string[];
}

export function dateRangeLabels(locale?: string): DateRangeLabels {
  const loc = locale ?? navigatorLocale();
  const month = new Intl.DateTimeFormat(loc, { month: "long", year: "numeric" });
  const day = new Intl.DateTimeFormat(loc, { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  const weekday = new Intl.DateTimeFormat(loc, { weekday: "short" });
  return {
    month: (iso) => month.format(parseIsoDate(iso)),
    day: (iso) => day.format(parseIsoDate(iso)),
    weekdays: (weekStart) => Array.from({ length: 7 }, (_, i) => weekday.format(parseIsoDate(addDays("2026-10-04", (weekStart + i) % 7)))),
  };
}

export function dateRangeKeyTarget(
  key: string,
  from: string,
  { weekStart = 1, rtl = false, shift = false }: { weekStart?: Weekday; rtl?: boolean; shift?: boolean } = {},
): string | null {
  switch (key) {
    case "ArrowLeft":
      return addDays(from, rtl ? 1 : -1);
    case "ArrowRight":
      return addDays(from, rtl ? -1 : 1);
    case "ArrowUp":
      return addDays(from, -7);
    case "ArrowDown":
      return addDays(from, 7);
    case "PageUp":
      return addMonths(from, shift ? -12 : -1);
    case "PageDown":
      return addMonths(from, shift ? 12 : 1);
    case "Home":
      return startOfWeek(from, weekStart);
    case "End":
      return addDays(startOfWeek(from, weekStart), 6);
    default:
      return null;
  }
}

export interface DateRangeControllerOptions {
  value?: [string, string] | null;
  months?: number;
  today?: string;
  min?: string;
  max?: string;
  weekStart?: Weekday;
  locale?: string;
  previousLabel?: string;
  nextLabel?: string;
  onSelect?: (range: [string, string]) => void;
}

export interface DateRangeController {
  setValue(value: [string, string] | null): void;
  update(options: Partial<DateRangeControllerOptions>): void;
  focus(): void;
  destroy(): void;
}

/**
 * Draw two (or more) months into an .ayy-date-range and wire navigation arrows, keyboard movement,
 * hover range preview, and start/end range selection. Framework-free; used by <ayy-date-range>.
 */
export function connectDateRange(root: HTMLElement, options: DateRangeControllerOptions = {}): DateRangeController {
  let opts = { ...options };
  let range: [string, string] | null = opts.value ?? null;
  let pendingStart: string | null = null;
  let hoverDate: string | null = null;
  let today = opts.today ?? todayIso();
  let cursor = range?.[0] ?? today;
  let startMonth = startOfMonth(range?.[0] ?? today);

  const syncDayRangeClasses = () => {
    let activeStart: string | null = null;
    let activeEnd: string | null = null;
    if (pendingStart) {
      activeStart = pendingStart;
      activeEnd = hoverDate ?? pendingStart;
    } else if (range) {
      activeStart = range[0];
      activeEnd = range[1];
    }
    let minRange: string | null = null;
    let maxRange: string | null = null;
    if (activeStart && activeEnd) {
      [minRange, maxRange] = activeStart <= activeEnd ? [activeStart, activeEnd] : [activeEnd, activeStart];
    }
    for (const btn of root.querySelectorAll<HTMLButtonElement>(".ayy-date-range__day")) {
      const d = btn.dataset.date ?? "";
      const isStart = Boolean(minRange && d === minRange);
      const isEnd = Boolean(maxRange && d === maxRange);
      const inRange = Boolean(minRange && maxRange && minRange !== maxRange && d > minRange && d < maxRange);
      btn.classList.toggle("ayy-date-range__day--range-start", isStart);
      btn.classList.toggle("ayy-date-range__day--range-end", isEnd);
      btn.classList.toggle("ayy-date-range__day--in-range", inRange);
      btn.setAttribute("aria-pressed", String(isStart || isEnd));
    }
  };

  const render = (focus = false) => {
    const monthsCount = Math.max(1, opts.months ?? 2);
    const weekStart = opts.weekStart ?? localeWeekStart(opts.locale);
    const labels = dateRangeLabels(opts.locale);
    const displayedMonths = Array.from({ length: monthsCount }, (_, i) => addMonths(startMonth, i));
    const grids = displayedMonths.map((m) => ({
      month: m,
      days: dateRangeMonth({
        month: m,
        range,
        hoverDate,
        pendingStart,
        today,
        min: opts.min,
        max: opts.max,
        weekStart,
      }),
    }));

    const allDays = grids.flatMap((g) => g.days);
    const tabStop = allDays.some((d) => d.date === cursor)
      ? cursor
      : (allDays.find((d) => d.isStart && !d.outside) ?? allDays.find((d) => d.today && !d.outside) ?? allDays.find((d) => !d.outside))?.date ?? "";

    const monthNodes = grids.map((g, idx) => {
      const monthEl = document.createElement("div");
      monthEl.className = "ayy-date-range__month";

      const header = document.createElement("div");
      header.className = "ayy-date-range__header";

      if (idx === 0) {
        const prev = document.createElement("button");
        prev.type = "button";
        prev.className = "ayy-date-range__nav";
        prev.dataset.nav = "-1";
        prev.setAttribute("aria-label", opts.previousLabel ?? "Previous month");
        prev.innerHTML = dateRangePreviousIcon;
        header.append(prev);
      } else {
        const spacer = document.createElement("span");
        spacer.style.inlineSize = "var(--ayy-size-control-sm)";
        spacer.setAttribute("aria-hidden", "true");
        header.append(spacer);
      }

      const title = document.createElement("span");
      title.className = "ayy-date-range__title";
      title.setAttribute("aria-live", "polite");
      title.textContent = labels.month(g.month);
      header.append(title);

      if (idx === grids.length - 1) {
        const next = document.createElement("button");
        next.type = "button";
        next.className = "ayy-date-range__nav";
        next.dataset.nav = "1";
        next.setAttribute("aria-label", opts.nextLabel ?? "Next month");
        next.innerHTML = dateRangeNextIcon;
        header.append(next);
      } else {
        const spacer = document.createElement("span");
        spacer.style.inlineSize = "var(--ayy-size-control-sm)";
        spacer.setAttribute("aria-hidden", "true");
        header.append(spacer);
      }

      const weekdays = document.createElement("div");
      weekdays.className = "ayy-date-range__weekdays";
      weekdays.setAttribute("aria-hidden", "true");
      for (const name of labels.weekdays(weekStart)) {
        const span = document.createElement("span");
        span.textContent = name;
        weekdays.append(span);
      }

      const grid = document.createElement("div");
      grid.className = "ayy-date-range__grid";
      grid.setAttribute("role", "group");
      grid.setAttribute("aria-label", labels.month(g.month));

      for (const d of g.days) {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = cx(
          "ayy-date-range__day",
          d.isStart && "ayy-date-range__day--range-start",
          d.isEnd && "ayy-date-range__day--range-end",
          d.inRange && "ayy-date-range__day--in-range",
        );
        btn.dataset.date = d.date;
        if (d.outside) btn.dataset.outside = "";
        btn.tabIndex = d.date === tabStop ? 0 : -1;
        btn.setAttribute("aria-label", labels.day(d.date));
        btn.setAttribute("aria-pressed", String(d.isStart || d.isEnd));
        if (d.today) btn.setAttribute("aria-current", "date");
        if (d.disabled) btn.setAttribute("aria-disabled", "true");
        btn.textContent = String(d.day);
        grid.append(btn);
      }

      monthEl.append(header, weekdays, grid);
      return monthEl;
    });

    root.replaceChildren(...monthNodes);
    if (focus) {
      root.querySelector<HTMLButtonElement>(`.ayy-date-range__day[data-date="${cursor}"]`)?.focus();
    }
  };

  const onClick = (event: MouseEvent) => {
    const nav = (event.target as Element | null)?.closest?.<HTMLButtonElement>(".ayy-date-range__nav");
    if (nav && root.contains(nav)) {
      const step = nav.dataset.nav ? Number(nav.dataset.nav) : (nav.getAttribute("aria-label")?.toLowerCase().includes("prev") ? -1 : 1);
      startMonth = addMonths(startMonth, step);
      render();
      return;
    }
    const dayBtn = (event.target as Element | null)?.closest?.<HTMLButtonElement>(".ayy-date-range__day");
    if (!dayBtn || !root.contains(dayBtn) || dayBtn.getAttribute("aria-disabled") === "true") return;
    const date = dayBtn.dataset.date;
    if (!date) return;
    cursor = date;
    if (pendingStart === null) {
      pendingStart = date;
      hoverDate = null;
      syncDayRangeClasses();
      dayBtn.focus();
    } else {
      const nextRange: [string, string] = date < pendingStart ? [date, pendingStart] : [pendingStart, date];
      pendingStart = null;
      hoverDate = null;
      range = nextRange;
      render(true);
      opts.onSelect?.(nextRange);
    }
  };

  const onMouseOver = (event: MouseEvent) => {
    if (!pendingStart) return;
    const dayBtn = (event.target as Element | null)?.closest?.<HTMLButtonElement>(".ayy-date-range__day");
    if (!dayBtn || !root.contains(dayBtn) || dayBtn.getAttribute("aria-disabled") === "true") return;
    const date = dayBtn.dataset.date ?? null;
    if (date !== hoverDate) {
      hoverDate = date;
      syncDayRangeClasses();
    }
  };

  const onMouseLeave = () => {
    if (pendingStart && hoverDate !== null) {
      hoverDate = null;
      syncDayRangeClasses();
    }
  };

  const onKeyDown = (event: KeyboardEvent) => {
    const dayBtn = (event.target as Element | null)?.closest?.<HTMLButtonElement>(".ayy-date-range__day");
    if (!dayBtn || !root.contains(dayBtn) || !dayBtn.dataset.date) return;
    const weekStart = opts.weekStart ?? localeWeekStart(opts.locale);
    const rtl = getComputedStyle(dayBtn).direction === "rtl";
    const target = dateRangeKeyTarget(event.key, dayBtn.dataset.date, { weekStart, rtl, shift: event.shiftKey });
    if (!target) return;
    event.preventDefault();
    cursor = target;
    const monthsCount = Math.max(1, opts.months ?? 2);
    const displayedMonths = Array.from({ length: monthsCount }, (_, i) => addMonths(startMonth, i));
    const targetMonth = startOfMonth(target);
    if (!displayedMonths.includes(targetMonth)) {
      startMonth = target < displayedMonths[0] ? targetMonth : addMonths(targetMonth, -(monthsCount - 1));
    }
    render(true);
  };

  render();
  root.addEventListener("click", onClick);
  root.addEventListener("mouseover", onMouseOver);
  root.addEventListener("mouseleave", onMouseLeave);
  root.addEventListener("keydown", onKeyDown);

  return {
    setValue(next) {
      range = next;
      pendingStart = null;
      hoverDate = null;
      if (next?.[0]) {
        cursor = next[0];
        startMonth = startOfMonth(next[0]);
      }
      render();
    },
    update(next) {
      opts = { ...opts, ...next };
      if ("value" in next) range = next.value ?? null;
      if (next.today) today = next.today;
      render();
    },
    focus() {
      const btn =
        root.querySelector<HTMLButtonElement>(`.ayy-date-range__day[data-date="${cursor}"]`) ??
        root.querySelector<HTMLButtonElement>('.ayy-date-range__day[tabindex="0"]');
      btn?.focus();
    },
    destroy() {
      root.removeEventListener("click", onClick);
      root.removeEventListener("mouseover", onMouseOver);
      root.removeEventListener("mouseleave", onMouseLeave);
      root.removeEventListener("keydown", onKeyDown);
    },
  };
}
