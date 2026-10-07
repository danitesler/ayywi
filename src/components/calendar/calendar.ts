import { cx } from "../../lib/cx";
import { ArrowLeft01Icon, ArrowRight01Icon, Calendar03Icon } from "../../lib/icons";
import { iconSvg } from "../icon/icon";

// Dates are ISO strings ("2026-10-07"): no time, no time zone, so a day never shifts when the clock changes.

export const calendarClass = "ayy-calendar";

export function calendarClassName({ full, className }: { full?: boolean; className?: string } = {}): string {
  return cx("ayy-calendar", full && "ayy-calendar--full", className);
}

/** The arrows of .ayy-calendar__nav and the trigger's icon, as SVG markup (Hugeicons ArrowLeft01, ArrowRight01, Calendar03). */
export const calendarPreviousIcon = /* @__PURE__ */ iconSvg(ArrowLeft01Icon, { directional: true });
export const calendarNextIcon = /* @__PURE__ */ iconSvg(ArrowRight01Icon, { directional: true });
export const datePickerIcon = /* @__PURE__ */ iconSvg(Calendar03Icon);

const pad = (n: number) => String(n).padStart(2, "0");

/** A Date at local noon (no DST edge) for an ISO day. */
export function parseIsoDate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d, 12);
}

export function toIsoDate(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function todayIso(): string {
  return toIsoDate(new Date());
}

export function addDays(iso: string, days: number): string {
  const date = parseIsoDate(iso);
  date.setDate(date.getDate() + days);
  return toIsoDate(date);
}

/** Same day of another month, clamped to its length (31 Jan + 1 month → 28 Feb). */
export function addMonths(iso: string, months: number): string {
  const date = parseIsoDate(iso);
  const day = date.getDate();
  date.setDate(1);
  date.setMonth(date.getMonth() + months);
  const last = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  date.setDate(Math.min(day, last));
  return toIsoDate(date);
}

export function startOfMonth(iso: string): string {
  return `${iso.slice(0, 7)}-01`;
}

/** 0 = Sunday … 6 = Saturday, like Date.getDay(). */
export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export function startOfWeek(iso: string, weekStart: Weekday): string {
  const day = parseIsoDate(iso).getDay();
  return addDays(iso, -((day - weekStart + 7) % 7));
}

/** The locale's first day of the week (Intl.Locale weekInfo), else Monday. */
export function localeWeekStart(locale?: string): Weekday {
  try {
    const info = new Intl.Locale(locale ?? navigatorLocale()) as Intl.Locale & {
      getWeekInfo?: () => { firstDay: number };
      weekInfo?: { firstDay: number };
    };
    const first = (info.getWeekInfo?.() ?? info.weekInfo)?.firstDay;
    if (first) return (first % 7) as Weekday;
  } catch {
    // Unknown locale: fall through.
  }
  return 1;
}

function navigatorLocale(): string {
  return typeof navigator === "undefined" ? "en-US" : navigator.language;
}

export interface CalendarDay {
  /** "2026-10-07" */
  date: string;
  /** Day of the month, 1–31. */
  day: number;
  /** In the month before or after the one shown. */
  outside: boolean;
  today: boolean;
  selected: boolean;
  /** Before min or after max. */
  disabled: boolean;
}

export interface CalendarMonthOptions {
  /** Any day of the month to show. */
  month: string;
  value?: string | null;
  /** Default: the real today. */
  today?: string;
  min?: string;
  max?: string;
  weekStart?: Weekday;
}

/** The six weeks shown for a month (always 42 days, so the grid keeps its height from month to month). */
export function calendarMonth({ month, value = null, today = todayIso(), min, max, weekStart = 1 }: CalendarMonthOptions): CalendarDay[] {
  const first = startOfMonth(month);
  const start = startOfWeek(first, weekStart);
  const days: CalendarDay[] = [];
  for (let i = 0; i < 42; i++) {
    const date = addDays(start, i);
    days.push({
      date,
      day: Number(date.slice(8)),
      outside: date.slice(0, 7) !== first.slice(0, 7),
      today: date === today,
      selected: date === value,
      disabled: (min !== undefined && date < min) || (max !== undefined && date > max),
    });
  }
  return days;
}

export interface CalendarLabels {
  /** "October 2026" */
  month(iso: string): string;
  /** "Wednesday, 7 October 2026": each day button's accessible name. */
  day(iso: string): string;
  /** Short weekday names in display order, starting at weekStart. */
  weekdays(weekStart: Weekday): string[];
}

/** Month, day and weekday names from Intl for a locale (default: the browser's). */
export function calendarLabels(locale?: string): CalendarLabels {
  const loc = locale ?? navigatorLocale();
  const month = new Intl.DateTimeFormat(loc, { month: "long", year: "numeric" });
  const day = new Intl.DateTimeFormat(loc, { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  const weekday = new Intl.DateTimeFormat(loc, { weekday: "short" });
  return {
    month: (iso) => month.format(parseIsoDate(iso)),
    day: (iso) => day.format(parseIsoDate(iso)),
    // 2026-10-04 is a Sunday.
    weekdays: (weekStart) => Array.from({ length: 7 }, (_, i) => weekday.format(parseIsoDate(addDays("2026-10-04", (weekStart + i) % 7)))),
  };
}

/** "7 Oct 2026": the date a date picker's trigger shows. */
export function formatDate(iso: string, locale?: string, options: Intl.DateTimeFormatOptions = { day: "numeric", month: "short", year: "numeric" }): string {
  return new Intl.DateTimeFormat(locale ?? navigatorLocale(), options).format(parseIsoDate(iso));
}

/** A preset's date: an ISO day, or "+N" / "-N" days from today ("+0" is today, "+1" tomorrow). */
export function resolveCalendarDate(date: string, today: string = todayIso()): string {
  return /^[+-]\d+$/.test(date) ? addDays(today, Number(date)) : date;
}

/**
 * Where a key moves the focused day, or null for keys the grid doesn't handle. Arrows move a day (mirrored in RTL) or a
 * week, PageUp/PageDown a month (with Shift a year), Home/End to the start and end of the week.
 */
export function calendarKeyTarget(key: string, from: string, { weekStart = 1, rtl = false, shift = false }: { weekStart?: Weekday; rtl?: boolean; shift?: boolean } = {}): string | null {
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

export interface CalendarControllerOptions {
  value?: string | null;
  /** The month shown first. Default: the value's, else today's. */
  month?: string;
  today?: string;
  min?: string;
  max?: string;
  weekStart?: Weekday;
  locale?: string;
  /** Accessible names of the month buttons. Translate them. */
  previousLabel?: string;
  nextLabel?: string;
  /** A day was picked (click, Enter, Space). */
  onSelect?: (date: string) => void;
}

export interface CalendarController {
  setValue(value: string | null): void;
  update(options: Partial<Pick<CalendarControllerOptions, "min" | "max" | "today" | "locale" | "weekStart">>): void;
  /** Focus the day the keyboard is on (the value, else today). */
  focus(): void;
  destroy(): void;
}

/**
 * Draw a month into an .ayy-calendar and make it work: the month buttons, the day grid (one Tab stop, arrow keys move,
 * Enter or Space picks), days outside min/max that can be focused but not picked, and .ayy-calendar__preset buttons
 * (their data-date is an ISO day or "+N" days from today). It (re)writes the title, the
 * weekdays and the day buttons, keeping the root and header the author wrote. Framework-free; used by <ayy-calendar>.
 * React's Calendar renders the same markup itself from calendarMonth().
 */
export function connectCalendar(root: HTMLElement, options: CalendarControllerOptions = {}): CalendarController {
  let opts = { ...options };
  let value = opts.value ?? null;
  let today = opts.today ?? todayIso();
  let cursor = value ?? today;
  let month = startOfMonth(opts.month ?? cursor);

  const part = <T extends HTMLElement>(cls: string, tag: string, parent: HTMLElement, before: Node | null = null): T => {
    let el = root.querySelector<T>(`.${cls}`);
    if (!el) {
      el = document.createElement(tag) as T;
      el.className = cls;
      parent.insertBefore(el, before);
    }
    return el;
  };
  const header = part<HTMLDivElement>("ayy-calendar__header", "div", root, root.firstChild);
  const title = part<HTMLSpanElement>("ayy-calendar__title", "span", header, header.firstChild);
  title.setAttribute("aria-live", "polite");
  const navs = root.querySelectorAll<HTMLButtonElement>(".ayy-calendar__nav");
  const prev = navs[0] ?? header.appendChild(navButton(calendarPreviousIcon));
  const next = navs[1] ?? header.appendChild(navButton(calendarNextIcon));
  const weekdays = part<HTMLDivElement>("ayy-calendar__weekdays", "div", root);
  weekdays.setAttribute("aria-hidden", "true");
  const grid = part<HTMLDivElement>("ayy-calendar__grid", "div", root);
  grid.setAttribute("role", "group");

  function navButton(icon: string): HTMLButtonElement {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "ayy-calendar__nav";
    button.innerHTML = icon;
    return button;
  }

  const render = (focus = false) => {
    const weekStart = opts.weekStart ?? localeWeekStart(opts.locale);
    const labels = calendarLabels(opts.locale);
    prev.setAttribute("aria-label", opts.previousLabel ?? prev.getAttribute("aria-label") ?? "Previous month");
    next.setAttribute("aria-label", opts.nextLabel ?? next.getAttribute("aria-label") ?? "Next month");
    title.textContent = labels.month(month);
    grid.setAttribute("aria-label", labels.month(month));
    weekdays.replaceChildren(
      ...labels.weekdays(weekStart).map((name) => {
        const span = document.createElement("span");
        span.textContent = name;
        return span;
      }),
    );
    const days = calendarMonth({ month, value, today, min: opts.min, max: opts.max, weekStart });
    if (!days.some((d) => d.date === cursor)) cursor = days.find((d) => d.selected)?.date ?? days.find((d) => d.today)?.date ?? month;
    grid.replaceChildren(
      ...days.map((d) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "ayy-calendar__day";
        button.dataset.date = d.date;
        button.textContent = String(d.day);
        button.tabIndex = d.date === cursor ? 0 : -1;
        button.setAttribute("aria-label", labels.day(d.date));
        button.setAttribute("aria-pressed", String(d.selected));
        if (d.today) button.setAttribute("aria-current", "date");
        if (d.outside) button.dataset.outside = "";
        if (d.disabled) button.setAttribute("aria-disabled", "true");
        return button;
      }),
    );
    for (const preset of root.querySelectorAll<HTMLButtonElement>(".ayy-calendar__preset")) {
      preset.setAttribute("aria-pressed", String(resolveCalendarDate(preset.dataset.date ?? "", today) === value));
    }
    if (focus) grid.querySelector<HTMLButtonElement>(`[data-date="${cursor}"]`)?.focus();
  };

  const moveTo = (date: string, focus: boolean) => {
    cursor = date;
    if (startOfMonth(date) !== month) month = startOfMonth(date);
    render(focus);
  };

  // The month buttons show the month before or after; the keyboard lands on its first day.
  const onNav = (step: number) => () => {
    month = addMonths(month, step);
    cursor = startOfMonth(month);
    render(false);
  };
  const prevMonth = onNav(-1);
  const nextMonth = onNav(1);

  const onPreset = (event: MouseEvent) => {
    const preset = (event.target as Element | null)?.closest<HTMLButtonElement>(".ayy-calendar__preset");
    if (!preset?.dataset.date) return;
    value = resolveCalendarDate(preset.dataset.date, today);
    cursor = value;
    month = startOfMonth(value);
    render(false);
    opts.onSelect?.(value);
  };

  const onClick = (event: MouseEvent) => {
    const day = (event.target as Element | null)?.closest<HTMLButtonElement>(".ayy-calendar__day");
    if (!day || !grid.contains(day) || day.getAttribute("aria-disabled") === "true") return;
    value = day.dataset.date ?? null;
    cursor = value ?? cursor;
    const outside = day.hasAttribute("data-outside");
    if (outside && value) month = startOfMonth(value);
    render(true);
    if (value) opts.onSelect?.(value);
  };

  const onKeyDown = (event: KeyboardEvent) => {
    const rtl = getComputedStyle(grid).direction === "rtl";
    const target = calendarKeyTarget(event.key, cursor, { weekStart: opts.weekStart ?? localeWeekStart(opts.locale), rtl, shift: event.shiftKey });
    if (!target) return;
    event.preventDefault();
    moveTo(target, true);
  };

  prev.addEventListener("click", prevMonth);
  next.addEventListener("click", nextMonth);
  grid.addEventListener("click", onClick);
  grid.addEventListener("keydown", onKeyDown);
  root.addEventListener("click", onPreset);
  render();

  return {
    setValue(next) {
      value = next;
      if (next) {
        cursor = next;
        month = startOfMonth(next);
      }
      render();
    },
    update(changes) {
      opts = { ...opts, ...changes };
      if (changes.today) today = changes.today;
      render();
    },
    focus() {
      grid.querySelector<HTMLButtonElement>('[tabindex="0"]')?.focus();
    },
    destroy() {
      prev.removeEventListener("click", prevMonth);
      next.removeEventListener("click", nextMonth);
      grid.removeEventListener("click", onClick);
      grid.removeEventListener("keydown", onKeyDown);
      root.removeEventListener("click", onPreset);
    },
  };
}
