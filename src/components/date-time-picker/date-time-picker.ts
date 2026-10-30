import { cx } from "../../lib/cx";
import { ArrowLeft01Icon, ArrowRight01Icon, Calendar03Icon, Clock01Icon } from "../../lib/icons";
import { iconSvg } from "../icon/icon";

// ==========================================
// 1. CSS Class Constants
// ==========================================

// Date Picker (Single Date)
export const datePickerTriggerClass = "ayy-date-picker";
export const datePickerClassConstant = "ayy-date-picker";
export const datePickerValueClass = "ayy-date-picker__value";
export const datePickerGridClass = "ayy-date-picker-grid";
export const datePickerHeaderClass = "ayy-date-picker-grid__header";
export const datePickerTitleClass = "ayy-date-picker-grid__title";
export const datePickerPeriodClass = "ayy-date-picker-grid__period";
export const datePickerNavClass = "ayy-date-picker-grid__nav";
export const datePickerWeekdaysClass = "ayy-date-picker-grid__weekdays";
export const datePickerDaysClass = "ayy-date-picker-grid__grid";
export const datePickerDayClass = "ayy-date-picker-grid__day";
export const datePickerMonthsClass = "ayy-date-picker-grid__months";
export const datePickerYearsClass = "ayy-date-picker-grid__years";
export const datePickerCellClass = "ayy-date-picker-grid__cell";
export const datePickerPresetsClass = "ayy-date-picker-grid__presets";
export const datePickerPresetClass = "ayy-date-picker-grid__preset";
export const datePickerFooterClass = "ayy-date-picker-grid__footer";
export const datePickerFullClass = "ayy-date-picker-grid--full";

// Date Range
export const dateRangeClassConstant = "ayy-date-range";
export const dateRangeMonthClass = "ayy-date-range__month";
export const dateRangeHeaderClass = "ayy-date-range__header";
export const dateRangeTitleClass = "ayy-date-range__title";
export const dateRangePeriodClass = "ayy-date-range__period";
export const dateRangeNavClass = "ayy-date-range__nav";
export const dateRangeWeekdaysClass = "ayy-date-range__weekdays";
export const dateRangeGridClass = "ayy-date-range__grid";
export const dateRangeDayClass = "ayy-date-range__day";
export const dateRangeMonthsClass = "ayy-date-range__months";
export const dateRangeYearsClass = "ayy-date-range__years";
export const dateRangeCellClass = "ayy-date-range__cell";
export const dateRangeRangeStartClass = "ayy-date-range__day--range-start";
export const dateRangeRangeEndClass = "ayy-date-range__day--range-end";
export const dateRangeInRangeClass = "ayy-date-range__day--in-range";
export const dateRangePickerClassConstant = "ayy-date-range-picker";
export const dateRangePickerValueClass = "ayy-date-range-picker__value";
export const dateRangeFooterClass = "ayy-date-range__footer";

// Time Picker
export const timePickerClassConstant = "ayy-time-picker";
export const timePickerHeaderClass = "ayy-time-picker__header";
export const timePickerInputsClass = "ayy-time-picker__inputs";
export const timePickerInputClass = "ayy-time-picker__input";
export const timePickerSeparatorClass = "ayy-time-picker__separator";
export const timePickerPeriodBtnClass = "ayy-time-picker__period-btn";
export const timePickerColumnsClass = "ayy-time-picker__columns";
export const timePickerColClass = "ayy-time-picker__col";
export const timePickerItemClass = "ayy-time-picker__item";
export const timePickerItemSelectedClass = "ayy-time-picker__item--selected";
export const timePickerTriggerClassConstant = "ayy-time-picker-trigger";
export const timePickerTriggerValueClass = "ayy-time-picker-trigger__value";

// Combined Date & Time Picker
export const dateTimePickerClassConstant = "ayy-date-time-picker";
export const dateTimePickerDateClass = "ayy-date-time-picker__date";
export const dateTimePickerDividerClass = "ayy-date-time-picker__divider";
export const dateTimePickerTimeClass = "ayy-date-time-picker__time";
export const dateTimePickerFooterClass = "ayy-date-time-picker__footer";
export const dateTimePickerTriggerClassConstant = "ayy-date-time-picker-trigger";
export const dateTimePickerTriggerValueClass = "ayy-date-time-picker-trigger__value";

// Sizes
export const datePickerSizes = ["sm", "md", "lg"] as const;
export type DatePickerSize = (typeof datePickerSizes)[number];

export const dateRangeSizes = ["sm", "md", "lg"] as const;
export type DateRangeSize = (typeof dateRangeSizes)[number];

export const timePickerSizes = ["sm", "md", "lg"] as const;
export type TimePickerSize = (typeof timePickerSizes)[number];

export const dateTimePickerSizes = ["sm", "md", "lg"] as const;
export type DateTimePickerSize = (typeof dateTimePickerSizes)[number];

// Class Name Builders
export interface DatePickerClassOptions {
  full?: boolean;
  className?: string;
}

export function datePickerClassName({ full, className }: DatePickerClassOptions = {}): string {
  return cx(datePickerGridClass, full && datePickerFullClass, className);
}
export const datePickerClass = datePickerClassName;

export interface DateRangeClassOptions {
  className?: string;
}

export function dateRangeClassName({ className }: DateRangeClassOptions = {}): string {
  return cx(dateRangeClassConstant, className);
}
export const dateRangeClass = dateRangeClassName;

export interface DateRangePickerClassOptions {
  size?: DateRangeSize;
  className?: string;
}

export function dateRangePickerClassName({ size, className }: DateRangePickerClassOptions = {}): string {
  return cx("ayy-input", dateRangePickerClassConstant, size === "sm" && "ayy-input--sm", size === "lg" && "ayy-input--lg", className);
}
export const dateRangePickerClass = dateRangePickerClassName;

export interface TimePickerClassOptions {
  className?: string;
}

export function timePickerClassName({ className }: TimePickerClassOptions = {}): string {
  return cx(timePickerClassConstant, className);
}
export const timePickerClass = timePickerClassName;

export interface TimePickerTriggerClassOptions {
  size?: TimePickerSize;
  className?: string;
}

export function timePickerTriggerClassName({ size, className }: TimePickerTriggerClassOptions = {}): string {
  return cx("ayy-input", timePickerTriggerClassConstant, size === "sm" && "ayy-input--sm", size === "lg" && "ayy-input--lg", className);
}
export const timePickerTriggerClass = timePickerTriggerClassName;

export interface DateTimePickerClassOptions {
  className?: string;
}

export function dateTimePickerClassName({ className }: DateTimePickerClassOptions = {}): string {
  return cx(dateTimePickerClassConstant, className);
}
export const dateTimePickerClass = dateTimePickerClassName;

export interface DateTimePickerTriggerClassOptions {
  size?: DateTimePickerSize;
  className?: string;
}

export function dateTimePickerTriggerClassName({ size, className }: DateTimePickerTriggerClassOptions = {}): string {
  return cx("ayy-input", dateTimePickerTriggerClassConstant, size === "sm" && "ayy-input--sm", size === "lg" && "ayy-input--lg", className);
}
export const dateTimePickerTriggerClass = dateTimePickerTriggerClassName;

// ==========================================
// 2. SVG Icons (vendored Hugeicons markup)
// ==========================================

export const datePickerIcon = iconSvg(Calendar03Icon, { name: "calendar" });
export const datePickerPreviousIcon = iconSvg(ArrowLeft01Icon, { name: "chevron-left", directional: true });
export const datePickerNextIcon = iconSvg(ArrowRight01Icon, { name: "chevron-right", directional: true });
export const dateRangePreviousIcon = datePickerPreviousIcon;
export const dateRangeNextIcon = datePickerNextIcon;
export const dateRangePickerIcon = datePickerIcon;
export const timePickerIcon = iconSvg(Clock01Icon, { name: "clock" });
export const timePickerClockIcon = timePickerIcon;
export const dateTimePickerIcon = datePickerIcon;

// ==========================================
// 3. Date & Time Pure Helpers
// ==========================================

export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = Sunday, 1 = Monday ... 6 = Saturday
export type DatePickerView = "days" | "months" | "years";

/** UTC midnight on the date an ISO string starts with ("2026-10-19", "2026-10-19T10:00"); an invalid Date if there's none. */
export function parseIsoDate(iso: string): Date {
  const match = /^(\d{4})-(\d{1,2})-(\d{1,2})(?:[T ]|$)/.exec(iso);
  if (!match) return new Date(NaN);
  const [y, m, d] = match.slice(1).map(Number);
  // setUTCFullYear, unlike Date.UTC, keeps years 0–99 as written.
  const date = new Date(0);
  date.setUTCFullYear(y, m - 1, d);
  return date.getUTCMonth() === m - 1 && date.getUTCDate() === d ? date : new Date(NaN);
}

export function toIsoDate(d: Date): string {
  const y = String(d.getUTCFullYear()).padStart(4, "0");
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function todayIso(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function startOfMonth(iso: string): string {
  return `${iso.slice(0, 7)}-01`;
}

export function addMonths(iso: string, count: number): string {
  const date = parseIsoDate(iso);
  const day = date.getUTCDate();
  date.setUTCDate(1);
  date.setUTCMonth(date.getUTCMonth() + count);
  const last = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0)).getUTCDate();
  date.setUTCDate(Math.min(day, last));
  return toIsoDate(date);
}

export function addDays(iso: string, count: number): string {
  const d = parseIsoDate(iso);
  d.setUTCDate(d.getUTCDate() + count);
  return toIsoDate(d);
}

export function startOfWeek(iso: string, weekStart: Weekday = 1): string {
  const d = parseIsoDate(iso);
  const day = d.getUTCDay();
  const diff = (day - weekStart + 7) % 7;
  d.setUTCDate(d.getUTCDate() - diff);
  return toIsoDate(d);
}

export function localeWeekStart(locale?: string): Weekday {
  try {
    const loc = new Intl.Locale(locale ?? (typeof navigator !== "undefined" ? navigator.language : "en"));
    // @ts-expect-error weekInfo is modern Intl
    const info = loc.getWeekInfo?.() ?? loc.weekInfo;
    if (info?.firstDay) return (info.firstDay % 7) as Weekday;
  } catch {
    // fallback
  }
  return 1; // Monday default in most countries
}

function navigatorLocale(): string {
  return typeof navigator !== "undefined" && navigator.language ? navigator.language : "en";
}

export function formatDate(iso: string, locale?: string): string {
  try {
    const d = parseIsoDate(iso);
    return new Intl.DateTimeFormat(locale ?? navigatorLocale(), { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }).format(d);
  } catch {
    return iso;
  }
}

export function formatDateRange(startIso: string, endIso: string, locale?: string): string {
  try {
    const s = parseIsoDate(startIso);
    const e = parseIsoDate(endIso);
    const loc = locale ?? navigatorLocale();
    if (startIso === endIso) {
      return new Intl.DateTimeFormat(loc, { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }).format(s);
    }
    const fmt = new Intl.DateTimeFormat(loc, { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
    return fmt.formatRange(s, e);
  } catch {
    return `${startIso} – ${endIso}`;
  }
}

export type TimePeriod = "AM" | "PM";
export type TimePickerFormat = "12h" | "24h";

export function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

export function generateHours(format: TimePickerFormat = "24h"): string[] {
  if (format === "12h") {
    return Array.from({ length: 12 }, (_, i) => pad2(i === 0 ? 12 : i));
  }
  return Array.from({ length: 24 }, (_, i) => pad2(i));
}

export function generateMinutes(step = 5): string[] {
  const safeStep = Math.max(1, Math.min(60, step));
  const list: string[] = [];
  for (let m = 0; m < 60; m += safeStep) {
    list.push(pad2(m));
  }
  return list;
}

export const timePeriods: TimePeriod[] = ["AM", "PM"];

/** The parts of a time as written: "14:30" → 14, 30, PM; "2:30 pm" → 2, 30, PM. Null unless it's a real time. */
export function parseTimeString(str: string): { hours: number; minutes: number; period: TimePeriod } | null {
  if (!str) return null;
  const match = str.trim().match(/^(\d{1,2}):(\d{2})(?:\s*(AM|PM))?$/i);
  if (!match) return null;
  const hours = parseInt(match[1]!, 10);
  const minutes = parseInt(match[2]!, 10);
  if (minutes > 59 || (match[3] ? hours < 1 || hours > 12 : hours > 23)) return null;
  const period = match[3] ? (match[3].toUpperCase() as TimePeriod) : hours >= 12 ? "PM" : "AM";
  return { hours, minutes, period };
}

/** A time in either clock ("14:30", "02:30 PM") as hours 0–23 and minutes, or null if it isn't one. */
export function parseTime(str: string): { hours: number; minutes: number } | null {
  const parts = parseTimeString(str);
  if (!parts) return null;
  const twelveHour = /[ap]m\s*$/i.test(str);
  return { hours: twelveHour ? to24Hour(parts.hours, parts.period) : parts.hours, minutes: parts.minutes };
}

/** A time in either clock as "HH:mm" (24-hour), the form ISO date-times use; other text comes back unchanged. */
export function toTime24(str: string): string {
  const time = parseTime(str);
  return time ? `${pad2(time.hours)}:${pad2(time.minutes)}` : str;
}

export function to12Hour(hours24: number): { hours: number; period: TimePeriod } {
  const period: TimePeriod = hours24 >= 12 ? "PM" : "AM";
  let hours = hours24 % 12;
  if (hours === 0) hours = 12;
  return { hours, period };
}

export function to24Hour(hours12: number, period: TimePeriod): number {
  let hours = hours12 % 12;
  if (period === "PM") hours += 12;
  return hours;
}

/**
 * formatTime(14, 30, "12h") → "02:30 PM". Also takes a time string in either clock: formatTime("02:30 PM", false) →
 * "14:30" (the second argument says whether to show the 12-hour clock).
 */
export function formatTime(hours: number | string, minutesOrTwelveHour?: number | boolean, format: TimePickerFormat = "24h"): string {
  if (typeof hours === "string") {
    const time = parseTime(hours);
    return time ? formatTime(time.hours, time.minutes, minutesOrTwelveHour ? "12h" : "24h") : hours;
  }
  const minutes = typeof minutesOrTwelveHour === "number" ? minutesOrTwelveHour : 0;
  if (format === "12h") {
    const { hours: h12, period } = to12Hour(hours);
    return `${pad2(h12)}:${pad2(minutes)} ${period}`;
  }
  return `${pad2(hours)}:${pad2(minutes)}`;
}

/** A time string in either clock, shown in `format`: formatTimeString("14:30", "12h") → "02:30 PM". */
export function formatTimeString(timeIso: string, format: TimePickerFormat = "24h"): string {
  const time = parseTime(timeIso);
  if (!time) return timeIso;
  return formatTime(time.hours, time.minutes, format);
}

export function formatDateTime(dateIso: string, timeIso: string, locale?: string, formatOrTwelveHour: TimePickerFormat | boolean = "24h"): string {
  if (!dateIso) return "";
  const d = formatDate(dateIso, locale);
  if (!timeIso) return d;
  const is12 = typeof formatOrTwelveHour === "boolean" ? formatOrTwelveHour : formatOrTwelveHour === "12h";
  const t = formatTime(timeIso, is12);
  return `${d}, ${t}`;
}

export function isInRange(date: string, start: string, end: string): boolean {
  const [min, max] = start <= end ? [start, end] : [end, start];
  return date > min && date < max;
}

/** Whether `date` (YYYY-MM-DD) is before `min` or after `max`, the limits a shortcut (Today, a preset) must respect like a day does. */
function outsideLimits(date: string, min?: string, max?: string): boolean {
  return (min !== undefined && date < min) || (max !== undefined && date > max);
}

export function isSameDay(a: string | null | undefined, b: string | null | undefined): boolean {
  return Boolean(a && b && a === b);
}

export function resolveDatePickerDate(dateOrOffset: string, today: string = todayIso()): string {
  if (dateOrOffset.startsWith("+")) {
    const n = Number(dateOrOffset.slice(1));
    return addDays(today, Number.isFinite(n) ? n : 0);
  }
  return dateOrOffset;
}

// ==========================================
// 4. Single Date Picker Data & Keys
// ==========================================

export interface DatePickerDay {
  date: string;
  day: number;
  outside: boolean;
  today: boolean;
  selected: boolean;
  disabled: boolean;
}

export interface DatePickerMonthOptions {
  month: string;
  value?: string | null;
  today?: string;
  min?: string;
  max?: string;
  weekStart?: Weekday;
}

export function datePickerMonth({
  month,
  value,
  today = todayIso(),
  min,
  max,
  weekStart = 1,
}: DatePickerMonthOptions): DatePickerDay[] {
  const first = startOfMonth(month);
  const start = startOfWeek(first, weekStart);
  const days: DatePickerDay[] = [];
  for (let i = 0; i < 42; i++) {
    const date = addDays(start, i);
    days.push({
      date,
      day: Number(date.slice(8)),
      outside: date.slice(0, 7) !== first.slice(0, 7),
      today: date === today,
      selected: Boolean(value && date === value),
      disabled: (min !== undefined && date < min) || (max !== undefined && date > max),
    });
  }
  return days;
}

export interface DatePickerMonthItem {
  /** First day of the month, "2026-10-01". */
  month: string;
  index: number;
  label: string;
  fullLabel: string;
  current: boolean;
  selected: boolean;
  disabled: boolean;
}

export interface DatePickerMonthsOptions {
  year: number;
  selectedMonth?: string | null;
  today?: string;
  min?: string;
  max?: string;
  locale?: string;
}

export function datePickerMonths({
  year,
  selectedMonth,
  today = todayIso(),
  min,
  max,
  locale,
}: DatePickerMonthsOptions): DatePickerMonthItem[] {
  const labels = datePickerLabels(locale);
  const shortNames = labels.monthsShort(year);
  const currentYm = today.slice(0, 7);
  const selectedYm = selectedMonth ? selectedMonth.slice(0, 7) : null;
  const minYm = min ? min.slice(0, 7) : undefined;
  const maxYm = max ? max.slice(0, 7) : undefined;

  return Array.from({ length: 12 }, (_, i) => {
    const ym = `${String(year).padStart(4, "0")}-${pad2(i + 1)}`;
    const monthIso = `${ym}-01`;
    return {
      month: monthIso,
      index: i,
      label: shortNames[i] ?? pad2(i + 1),
      fullLabel: labels.month(monthIso),
      current: ym === currentYm,
      selected: ym === selectedYm,
      disabled: (minYm !== undefined && ym < minYm) || (maxYm !== undefined && ym > maxYm),
    };
  });
}

export interface DatePickerYearItem {
  year: number;
  label: string;
  current: boolean;
  selected: boolean;
  disabled: boolean;
}

export interface DatePickerYearsOptions {
  startYear: number;
  selectedYear?: number | null;
  today?: string;
  min?: string;
  max?: string;
  locale?: string;
}

export function datePickerYearPageStart(year: number): number {
  return year - 4;
}

export function datePickerYears({
  startYear,
  selectedYear,
  today = todayIso(),
  min,
  max,
  locale,
}: DatePickerYearsOptions): DatePickerYearItem[] {
  const labels = datePickerLabels(locale);
  const currentYear = Number(today.slice(0, 4));
  const minYear = min ? Number(min.slice(0, 4)) : undefined;
  const maxYear = max ? Number(max.slice(0, 4)) : undefined;

  return Array.from({ length: 12 }, (_, i) => {
    const y = startYear + i;
    return {
      year: y,
      label: labels.yearOnly(`${String(y).padStart(4, "0")}-01-01`),
      current: y === currentYear,
      selected: y === selectedYear,
      disabled: (minYear !== undefined && y < minYear) || (maxYear !== undefined && y > maxYear),
    };
  });
}

export interface DatePickerLabels {
  month(iso: string): string;
  monthOnly(iso: string): string;
  yearOnly(iso: string): string;
  monthYearParts(iso: string): Array<{ type: "month" | "year"; value: string }>;
  monthsShort(year?: number): string[];
  day(iso: string): string;
  weekdays(weekStart: Weekday): string[];
}

export function datePickerLabels(locale?: string): DatePickerLabels {
  const loc = locale ?? navigatorLocale();
  const month = new Intl.DateTimeFormat(loc, { month: "long", year: "numeric", timeZone: "UTC" });
  const monthOnly = new Intl.DateTimeFormat(loc, { month: "long", timeZone: "UTC" });
  const monthShort = new Intl.DateTimeFormat(loc, { month: "short", timeZone: "UTC" });
  const yearOnly = new Intl.DateTimeFormat(loc, { year: "numeric", timeZone: "UTC" });
  const day = new Intl.DateTimeFormat(loc, { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
  const weekday = new Intl.DateTimeFormat(loc, { weekday: "short", timeZone: "UTC" });
  return {
    month: (iso) => month.format(parseIsoDate(iso)),
    monthOnly: (iso) => monthOnly.format(parseIsoDate(iso)),
    yearOnly: (iso) => yearOnly.format(parseIsoDate(iso)),
    monthYearParts: (iso) => {
      const d = parseIsoDate(iso);
      const parts = month.formatToParts(d);
      const result: Array<{ type: "month" | "year"; value: string }> = [];
      for (const p of parts) {
        if ((p.type === "month" || p.type === "year") && !result.some((r) => r.type === p.type)) {
          result.push({ type: p.type, value: p.type === "month" ? monthOnly.format(d) : p.value });
        }
      }
      if (!result.some((r) => r.type === "month")) result.unshift({ type: "month", value: monthOnly.format(d) });
      if (!result.some((r) => r.type === "year")) result.push({ type: "year", value: yearOnly.format(d) });
      return result;
    },
    monthsShort: (year = 2026) => Array.from({ length: 12 }, (_, i) => monthShort.format(new Date(Date.UTC(year, i, 1)))),
    day: (iso) => day.format(parseIsoDate(iso)),
    weekdays: (weekStart) => Array.from({ length: 7 }, (_, i) => weekday.format(parseIsoDate(addDays("2026-10-04", (weekStart + i) % 7)))),
  };
}

export function datePickerKeyTarget(
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

export function datePickerCellKeyTarget(key: string, index: number, { rtl = false }: { rtl?: boolean } = {}): number | null {
  switch (key) {
    case "ArrowLeft":
      return index + (rtl ? 1 : -1);
    case "ArrowRight":
      return index + (rtl ? -1 : 1);
    case "ArrowUp":
      return index - 3;
    case "ArrowDown":
      return index + 3;
    case "PageUp":
      return index - 12;
    case "PageDown":
      return index + 12;
    case "Home":
      return 0;
    case "End":
      return 11;
    default:
      return null;
  }
}

// ==========================================
// 5. Date Range Data & Keys
// ==========================================

export interface DateRangeDay {
  date: string;
  day: number;
  outside: boolean;
  today: boolean;
  isStart: boolean;
  isEnd: boolean;
  inRange: boolean;
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

export const dateRangeLabels = datePickerLabels;
export const dateRangeKeyTarget = datePickerKeyTarget;

// ==========================================
// 6. Time Picker Options & Helpers
// ==========================================

export type TimePickerPeriod = "AM" | "PM";

export const timePickerHours24 = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));
export const timePickerHours12 = Array.from({ length: 12 }, (_, i) => String(i === 0 ? 12 : i).padStart(2, "0"));
export const timePickerMinutes = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, "0"));
export const timePickerPeriods: TimePickerPeriod[] = ["AM", "PM"];

export function centerTimePickerSelection(el: HTMLElement): void {
  const parent = el.parentElement;
  if (!parent) return;
  const top = el.offsetTop - (parent.clientHeight - el.offsetHeight) / 2;
  parent.scrollTo({ top, behavior: "smooth" });
}

// ==========================================
// 7. Vanilla Controllers
// ==========================================

/**
 * What a footer button does: its data-action, else "today" or "clear" when its text is that label. Any other button
 * (a "Done" the author added) is left alone.
 */
function footerAction(button: HTMLElement, labels: { todayLabel?: string; clearLabel?: string }): string | undefined {
  if (button.dataset.action) return button.dataset.action;
  const text = button.textContent?.trim().toLowerCase();
  if (text === (labels.todayLabel ?? "Today").toLowerCase()) return "today";
  if (text === (labels.clearLabel ?? "Clear").toLowerCase()) return "clear";
  return undefined;
}

export interface DatePickerControllerOptions {
  value?: string | null;
  today?: string;
  min?: string;
  max?: string;
  weekStart?: Weekday;
  locale?: string;
  previousLabel?: string;
  nextLabel?: string;
  showActions?: boolean;
  clearLabel?: string;
  todayLabel?: string;
  onClear?: () => void;
  onToday?: () => void;
  onSelect?: (date: string) => void;
}

export interface DatePickerController {
  setValue(value: string | null): void;
  update(options: Partial<DatePickerControllerOptions>): void;
  focus(): void;
  destroy(): void;
}

export function connectDatePicker(root: HTMLElement, options: DatePickerControllerOptions = {}): DatePickerController {
  let opts = { ...options };
  let value: string | null = opts.value ?? null;
  let today = opts.today ?? todayIso();
  let cursor = value ?? today;
  let month = startOfMonth(value ?? today);
  let view: DatePickerView = "days";
  let yearPageStart = datePickerYearPageStart(Number(month.slice(0, 4)));

  const part = <T extends HTMLElement>(cls: string, tag: string, parent: HTMLElement, before: Node | null = null): T => {
    let el = root.querySelector<T>(`.${cls}`);
    if (!el) {
      el = document.createElement(tag) as T;
      el.className = cls;
      parent.insertBefore(el, before);
    }
    return el;
  };

  const header = part<HTMLDivElement>(datePickerHeaderClass, "div", root, root.firstChild);
  const title = part<HTMLHeadingElement>(datePickerTitleClass, "h2", header, header.firstChild);
  title.setAttribute("aria-live", "polite");

  const navs = root.querySelectorAll<HTMLButtonElement>(`.${datePickerNavClass}`);
  const prev = navs[0] ?? header.appendChild(navButton(datePickerPreviousIcon, opts.previousLabel ?? "Previous month", -1));
  const next = navs[1] ?? header.appendChild(navButton(datePickerNextIcon, opts.nextLabel ?? "Next month", 1));
  prev.dataset.nav = "-1";
  next.dataset.nav = "1";

  const weekdays = part<HTMLDivElement>(datePickerWeekdaysClass, "div", root);
  weekdays.setAttribute("aria-hidden", "true");

  const grid = part<HTMLDivElement>(datePickerDaysClass, "div", root);

  const ensureFooter = () => {
    let footer = root.querySelector<HTMLDivElement>(`.${datePickerFooterClass}`);
    if (opts.showActions && !footer) {
      footer = document.createElement("div");
      footer.className = datePickerFooterClass;
      const clearBtn = document.createElement("button");
      clearBtn.type = "button";
      clearBtn.className = "ayy-button ayy-button--ghost ayy-button--sm";
      clearBtn.dataset.action = "clear";
      clearBtn.textContent = opts.clearLabel ?? "Clear";

      const todayBtn = document.createElement("button");
      todayBtn.type = "button";
      todayBtn.className = "ayy-button ayy-button--secondary ayy-button--sm";
      todayBtn.dataset.action = "today";
      todayBtn.textContent = opts.todayLabel ?? "Today";
      footer.replaceChildren(clearBtn, todayBtn);
      root.appendChild(footer);
    }
  };
  ensureFooter();

  function navButton(icon: string, label: string, step: number): HTMLButtonElement {
    const button = document.createElement("button");
    button.type = "button";
    button.className = datePickerNavClass;
    button.dataset.nav = String(step);
    button.setAttribute("aria-label", label);
    button.innerHTML = icon;
    return button;
  }

  const render = (focusTarget?: string) => {
    const labels = datePickerLabels(opts.locale);
    const weekStart = opts.weekStart ?? localeWeekStart(opts.locale);
    const currentYear = Number(month.slice(0, 4));
    const currentMonthIndex = Number(month.slice(5, 7)) - 1;

    if (view === "years") {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = datePickerPeriodClass;
      btn.dataset.view = "years";
      btn.setAttribute("aria-pressed", "true");
      btn.textContent = `${yearPageStart}–${yearPageStart + 11}`;
      title.replaceChildren(btn);
    } else {
      const parts = labels.monthYearParts(month);
      title.replaceChildren(
        ...parts.map((p, i) => {
          const btn = document.createElement("button");
          btn.type = "button";
          btn.className = datePickerPeriodClass;
          const targetView: DatePickerView = p.type === "month" ? "months" : "years";
          btn.dataset.view = targetView;
          const active = view === targetView;
          btn.setAttribute("aria-pressed", String(active));
          btn.textContent = p.value;
          if (i < parts.length - 1) {
            const space = document.createTextNode(" ");
            const frag = document.createDocumentFragment();
            frag.append(btn, space);
            return frag;
          }
          return btn;
        }),
      );
    }

    if (view === "days") {
      prev.setAttribute("aria-label", opts.previousLabel ?? "Previous month");
      next.setAttribute("aria-label", opts.nextLabel ?? "Next month");
      weekdays.hidden = false;
      grid.className = datePickerDaysClass;
      grid.setAttribute("role", "group");
      grid.setAttribute("aria-label", labels.month(month));

      const days = datePickerMonth({ month, value, today, min: opts.min, max: opts.max, weekStart });
      if (!days.some((d) => d.date === cursor)) {
        cursor = days.find((d) => d.selected)?.date ?? days.find((d) => d.today)?.date ?? month;
      }

      weekdays.replaceChildren(
        ...labels.weekdays(weekStart).map((w) => {
          const span = document.createElement("span");
          span.textContent = w;
          return span;
        }),
      );

      grid.replaceChildren(
        ...days.map((d) => {
          const btn = document.createElement("button");
          btn.type = "button";
          btn.className = datePickerDayClass;
          btn.dataset.date = d.date;
          if (d.outside) btn.setAttribute("data-outside", "");
          btn.tabIndex = d.date === cursor ? 0 : -1;
          btn.setAttribute("aria-label", labels.day(d.date));
          btn.setAttribute("aria-pressed", String(d.selected));
          if (d.today) btn.setAttribute("aria-current", "date");
          if (d.disabled) btn.setAttribute("aria-disabled", "true");
          btn.textContent = String(d.day);
          return btn;
        }),
      );
    } else if (view === "months") {
      prev.setAttribute("aria-label", "Previous year");
      next.setAttribute("aria-label", "Next year");
      weekdays.hidden = true;
      grid.className = datePickerMonthsClass;
      grid.setAttribute("role", "group");
      grid.setAttribute("aria-label", labels.yearOnly(month));

      const items = datePickerMonths({ year: currentYear, selectedMonth: month, today, min: opts.min, max: opts.max, locale: opts.locale });
      grid.replaceChildren(
        ...items.map((m) => {
          const btn = document.createElement("button");
          btn.type = "button";
          btn.className = datePickerCellClass;
          btn.dataset.month = m.month;
          btn.dataset.cellIndex = String(m.index);
          btn.tabIndex = m.index === currentMonthIndex ? 0 : -1;
          btn.setAttribute("aria-label", m.fullLabel);
          btn.setAttribute("aria-pressed", String(m.selected));
          if (m.current) btn.setAttribute("aria-current", "date");
          if (m.disabled) btn.setAttribute("aria-disabled", "true");
          btn.textContent = m.label;
          return btn;
        }),
      );
    } else {
      prev.setAttribute("aria-label", "Previous years");
      next.setAttribute("aria-label", "Next years");
      weekdays.hidden = true;
      grid.className = datePickerYearsClass;
      grid.setAttribute("role", "group");
      grid.setAttribute("aria-label", `${yearPageStart}–${yearPageStart + 11}`);

      const items = datePickerYears({ startYear: yearPageStart, selectedYear: currentYear, today, min: opts.min, max: opts.max, locale: opts.locale });
      const activeIdx = items.some((y) => y.selected) ? items.findIndex((y) => y.selected) : 0;
      grid.replaceChildren(
        ...items.map((y, idx) => {
          const btn = document.createElement("button");
          btn.type = "button";
          btn.className = datePickerCellClass;
          btn.dataset.year = String(y.year);
          btn.dataset.cellIndex = String(idx);
          btn.tabIndex = idx === activeIdx ? 0 : -1;
          btn.setAttribute("aria-label", y.label);
          btn.setAttribute("aria-pressed", String(y.selected));
          if (y.current) btn.setAttribute("aria-current", "date");
          if (y.disabled) btn.setAttribute("aria-disabled", "true");
          btn.textContent = y.label;
          return btn;
        }),
      );
    }

    for (const preset of root.querySelectorAll<HTMLButtonElement>(`.${datePickerPresetClass}`)) {
      const presetDate = resolveDatePickerDate(preset.dataset.date ?? "", today);
      preset.setAttribute("aria-pressed", String(presetDate === value));
      if (outsideLimits(presetDate, opts.min, opts.max)) preset.setAttribute("aria-disabled", "true");
      else preset.removeAttribute("aria-disabled");
    }

    if (focusTarget === "cursor") {
      grid.querySelector<HTMLButtonElement>(`[data-date="${cursor}"]`)?.focus();
    } else if (focusTarget === "cell") {
      (grid.querySelector<HTMLButtonElement>('[tabindex="0"]') ?? grid.querySelector<HTMLButtonElement>("button"))?.focus();
    } else if (focusTarget === "period-months" || focusTarget === "period-years") {
      const v = focusTarget === "period-months" ? "months" : "years";
      title.querySelector<HTMLButtonElement>(`[data-view="${v}"]`)?.focus();
    }
  };

  const onClick = (event: MouseEvent) => {
    const periodBtn = (event.target as Element | null)?.closest?.<HTMLButtonElement>(`.${datePickerPeriodClass}`);
    if (periodBtn && root.contains(periodBtn)) {
      const targetView = periodBtn.dataset.view as DatePickerView | undefined;
      if (!targetView) return;
      if (view === targetView) {
        view = "days";
        render(targetView === "months" ? "period-months" : "period-years");
      } else {
        view = targetView;
        if (view === "years") yearPageStart = datePickerYearPageStart(Number(month.slice(0, 4)));
        render("cell");
      }
      return;
    }

    const nav = (event.target as Element | null)?.closest?.<HTMLButtonElement>(`.${datePickerNavClass}`);
    if (nav && root.contains(nav)) {
      const step = Number(nav.dataset.nav ?? "1");
      if (view === "days") {
        month = addMonths(month, step);
      } else if (view === "months") {
        month = addMonths(month, step * 12);
      } else {
        yearPageStart += step * 12;
      }
      render();
      return;
    }

    const cellBtn = (event.target as Element | null)?.closest?.<HTMLButtonElement>(`button.${datePickerCellClass}`);
    if (cellBtn && root.contains(cellBtn)) {
      if (cellBtn.getAttribute("aria-disabled") === "true") return;
      if (cellBtn.dataset.month) {
        month = cellBtn.dataset.month;
        cursor = month;
        view = "days";
        render("cursor");
      } else if (cellBtn.dataset.year) {
        const nextYear = Number(cellBtn.dataset.year);
        month = `${String(nextYear).padStart(4, "0")}-${month.slice(5, 7)}-01`;
        cursor = month;
        view = "days";
        render("cursor");
      }
      return;
    }

    const presetBtn = (event.target as Element | null)?.closest?.<HTMLButtonElement>(`button.${datePickerPresetClass}`);
    if (presetBtn && root.contains(presetBtn) && presetBtn.dataset.date) {
      const date = resolveDatePickerDate(presetBtn.dataset.date, today);
      if (outsideLimits(date, opts.min, opts.max)) return;
      value = date;
      cursor = date;
      month = startOfMonth(date);
      view = "days";
      render("cursor");
      opts.onSelect?.(date);
      return;
    }

    const footerBtn = (event.target as Element | null)?.closest?.<HTMLButtonElement>(`.${datePickerFooterClass} button`);
    if (footerBtn && root.contains(footerBtn)) {
      const action = footerAction(footerBtn, opts);
      if (action === "clear") {
        value = null;
        cursor = today;
        render("cursor");
        opts.onClear?.();
        opts.onSelect?.("");
      } else if (action === "today") {
        if (outsideLimits(today, opts.min, opts.max)) return;
        value = today;
        cursor = today;
        month = startOfMonth(today);
        view = "days";
        render("cursor");
        opts.onToday?.();
        opts.onSelect?.(today);
      }
      return;
    }

    const dayBtn = (event.target as Element | null)?.closest?.<HTMLButtonElement>(`button.${datePickerDayClass}`);
    if (!dayBtn || !root.contains(dayBtn) || dayBtn.getAttribute("aria-disabled") === "true") return;
    const date = dayBtn.dataset.date;
    if (!date) return;
    value = date;
    cursor = date;
    render("cursor");
    opts.onSelect?.(date);
  };

  const onKeyDown = (event: KeyboardEvent) => {
    const cellBtn = (event.target as Element | null)?.closest?.<HTMLButtonElement>(`button.${datePickerCellClass}`);
    if (cellBtn && root.contains(cellBtn)) {
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        const prevView = view;
        view = "days";
        render(prevView === "months" ? "period-months" : "period-years");
        return;
      }
      const idx = Number(cellBtn.dataset.cellIndex ?? "-1");
      if (idx < 0) return;
      const rtl = getComputedStyle(cellBtn).direction === "rtl";
      const nextIdx = datePickerCellKeyTarget(event.key, idx, { rtl });
      if (nextIdx === null) return;
      event.preventDefault();
      if (view === "months") {
        if (nextIdx < 0) {
          month = addMonths(month, -12);
          render();
          grid.querySelector<HTMLButtonElement>(`[data-cell-index="${(nextIdx + 12) % 12}"]`)?.focus();
        } else if (nextIdx >= 12) {
          month = addMonths(month, 12);
          render();
          grid.querySelector<HTMLButtonElement>(`[data-cell-index="${nextIdx % 12}"]`)?.focus();
        } else {
          month = `${month.slice(0, 4)}-${pad2(nextIdx + 1)}-01`;
          render();
          grid.querySelector<HTMLButtonElement>(`[data-cell-index="${nextIdx}"]`)?.focus();
        }
      } else {
        if (nextIdx < 0) {
          yearPageStart -= 12;
          render();
          grid.querySelector<HTMLButtonElement>(`[data-cell-index="${(nextIdx + 12) % 12}"]`)?.focus();
        } else if (nextIdx >= 12) {
          yearPageStart += 12;
          render();
          grid.querySelector<HTMLButtonElement>(`[data-cell-index="${nextIdx % 12}"]`)?.focus();
        } else {
          grid.querySelector<HTMLButtonElement>(`[data-cell-index="${nextIdx}"]`)?.focus();
        }
      }
      return;
    }

    const dayBtn = (event.target as Element | null)?.closest?.<HTMLButtonElement>(`button.${datePickerDayClass}`);
    if (!dayBtn || !root.contains(dayBtn) || !dayBtn.dataset.date) return;
    const weekStart = opts.weekStart ?? localeWeekStart(opts.locale);
    const rtl = getComputedStyle(dayBtn).direction === "rtl";
    const target = datePickerKeyTarget(event.key, dayBtn.dataset.date, { weekStart, rtl, shift: event.shiftKey });
    if (!target) return;
    event.preventDefault();
    cursor = target;
    const targetMonth = startOfMonth(target);
    if (targetMonth !== month) {
      month = targetMonth;
      render("cursor");
    } else {
      root.querySelector<HTMLButtonElement>(`.${datePickerDayClass}[data-date="${target}"]`)?.focus();
    }
  };

  root.addEventListener("click", onClick);
  root.addEventListener("keydown", onKeyDown);
  render();

  return {
    setValue(v) {
      value = v;
      if (v) {
        cursor = v;
        month = startOfMonth(v);
        view = "days";
      }
      render();
    },
    update(next) {
      opts = { ...opts, ...next };
      if (next.value !== undefined) value = next.value;
      if (next.today !== undefined) today = next.today;
      ensureFooter();
      render();
    },
    focus() {
      (
        root.querySelector<HTMLButtonElement>(`.${datePickerDayClass}[tabindex="0"]`) ??
        root.querySelector<HTMLButtonElement>(`.${datePickerCellClass}[tabindex="0"]`)
      )?.focus();
    },
    destroy() {
      root.removeEventListener("click", onClick);
      root.removeEventListener("keydown", onKeyDown);
    },
  };
}

// Date Range Controller
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
  showActions?: boolean;
  clearLabel?: string;
  todayLabel?: string;
  onClear?: () => void;
  onToday?: () => void;
  /** Called with the picked range, and with null when Clear empties it. */
  onSelect?: (range: [string, string] | null) => void;
}

export interface DateRangeController {
  setValue(value: [string, string] | null): void;
  update(options: Partial<DateRangeControllerOptions>): void;
  focus(): void;
  destroy(): void;
}

export function connectDateRange(root: HTMLElement, options: DateRangeControllerOptions = {}): DateRangeController {
  let opts = { ...options };
  let range: [string, string] | null = opts.value ?? null;
  let pendingStart: string | null = null;
  let hoverDate: string | null = null;
  let today = opts.today ?? todayIso();
  let cursor = range?.[0] ?? today;
  let startMonth = startOfMonth(range?.[0] ?? today);
  let activePicker: { monthIdx: number; view: "months" | "years"; yearPageStart: number } | null = null;

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
    for (const btn of root.querySelectorAll<HTMLButtonElement>(`button.${dateRangeDayClass}`)) {
      const d = btn.dataset.date ?? "";
      const isStart = Boolean(minRange && d === minRange);
      const isEnd = Boolean(maxRange && d === maxRange);
      const inRange = Boolean(minRange && maxRange && minRange !== maxRange && d > minRange && d < maxRange);
      btn.classList.toggle(dateRangeRangeStartClass, isStart);
      btn.classList.toggle(dateRangeRangeEndClass, isEnd);
      btn.classList.toggle(dateRangeInRangeClass, inRange);
      btn.setAttribute("aria-pressed", String(isStart || isEnd));
    }
  };

  const render = (focusTarget?: { type: "cursor" | "cell" | "period"; monthIdx?: number; view?: "months" | "years"; cellIndex?: number }) => {
    const monthsCount = Math.max(1, opts.months ?? 2);
    if (monthsCount !== 2) {
      root.style.setProperty("--_months", String(monthsCount));
    } else {
      root.style.removeProperty("--_months");
    }
    const displayedMonths = Array.from({ length: monthsCount }, (_, i) => addMonths(startMonth, i));
    const weekStart = opts.weekStart ?? localeWeekStart(opts.locale);
    const labels = datePickerLabels(opts.locale);

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
      monthEl.className = dateRangeMonthClass;
      monthEl.dataset.monthIdx = String(idx);

      const colView: DatePickerView = activePicker?.monthIdx === idx ? activePicker.view : "days";
      const currentYear = Number(g.month.slice(0, 4));
      const currentMonthIndex = Number(g.month.slice(5, 7)) - 1;
      const yearStart = activePicker?.monthIdx === idx ? activePicker.yearPageStart : datePickerYearPageStart(currentYear);

      const header = document.createElement("div");
      header.className = dateRangeHeaderClass;

      if (idx === 0) {
        const prev = document.createElement("button");
        prev.type = "button";
        prev.className = dateRangeNavClass;
        prev.dataset.nav = "-1";
        prev.setAttribute(
          "aria-label",
          activePicker?.view === "years" ? "Previous years" : activePicker?.view === "months" ? "Previous year" : (opts.previousLabel ?? "Previous month"),
        );
        prev.innerHTML = dateRangePreviousIcon;
        header.append(prev);
      } else {
        const spacer = document.createElement("span");
        spacer.style.inlineSize = "var(--ayy-size-control-sm)";
        spacer.setAttribute("aria-hidden", "true");
        header.append(spacer);
      }

      const title = document.createElement("span");
      title.className = dateRangeTitleClass;
      title.setAttribute("aria-live", "polite");
      if (colView === "years") {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = dateRangePeriodClass;
        btn.dataset.view = "years";
        btn.dataset.monthIdx = String(idx);
        btn.setAttribute("aria-pressed", "true");
        btn.textContent = `${yearStart}–${yearStart + 11}`;
        title.append(btn);
      } else {
        const parts = labels.monthYearParts(g.month);
        title.append(
          ...parts.map((p, i) => {
            const btn = document.createElement("button");
            btn.type = "button";
            btn.className = dateRangePeriodClass;
            const targetView: "months" | "years" = p.type === "month" ? "months" : "years";
            btn.dataset.view = targetView;
            btn.dataset.monthIdx = String(idx);
            const active = colView === targetView;
            btn.setAttribute("aria-pressed", String(active));
            btn.textContent = p.value;
            if (i < parts.length - 1) {
              const frag = document.createDocumentFragment();
              frag.append(btn, document.createTextNode(" "));
              return frag;
            }
            return btn;
          }),
        );
      }
      header.append(title);

      if (idx === grids.length - 1) {
        const next = document.createElement("button");
        next.type = "button";
        next.className = dateRangeNavClass;
        next.dataset.nav = "1";
        next.setAttribute(
          "aria-label",
          activePicker?.view === "years" ? "Next years" : activePicker?.view === "months" ? "Next year" : (opts.nextLabel ?? "Next month"),
        );
        next.innerHTML = dateRangeNextIcon;
        header.append(next);
      } else {
        const spacer = document.createElement("span");
        spacer.style.inlineSize = "var(--ayy-size-control-sm)";
        spacer.setAttribute("aria-hidden", "true");
        header.append(spacer);
      }

      if (colView === "days") {
        const weekdays = document.createElement("div");
        weekdays.className = dateRangeWeekdaysClass;
        weekdays.setAttribute("aria-hidden", "true");
        for (const w of labels.weekdays(weekStart)) {
          const span = document.createElement("span");
          span.textContent = w;
          weekdays.append(span);
        }

        const grid = document.createElement("div");
        grid.className = dateRangeGridClass;
        grid.setAttribute("role", "group");
        grid.setAttribute("aria-label", labels.month(g.month));

        for (const d of g.days) {
          if (d.outside) {
            const outsideSpan = document.createElement("span");
            outsideSpan.className = dateRangeDayClass;
            outsideSpan.setAttribute("data-outside", "");
            outsideSpan.setAttribute("aria-hidden", "true");
            grid.append(outsideSpan);
            continue;
          }
          const btn = document.createElement("button");
          btn.type = "button";
          btn.className = cx(
            dateRangeDayClass,
            d.isStart && dateRangeRangeStartClass,
            d.isEnd && dateRangeRangeEndClass,
            d.inRange && dateRangeInRangeClass,
          );
          btn.dataset.date = d.date;
          btn.tabIndex = d.date === tabStop ? 0 : -1;
          btn.setAttribute("aria-label", labels.day(d.date));
          btn.setAttribute("aria-pressed", String(d.isStart || d.isEnd));
          if (d.today) btn.setAttribute("aria-current", "date");
          if (d.disabled) btn.setAttribute("aria-disabled", "true");
          btn.textContent = String(d.day);
          grid.append(btn);
        }

        monthEl.append(header, weekdays, grid);
      } else if (colView === "months") {
        const grid = document.createElement("div");
        grid.className = dateRangeMonthsClass;
        grid.setAttribute("role", "group");
        grid.setAttribute("aria-label", labels.yearOnly(g.month));
        const items = datePickerMonths({ year: currentYear, selectedMonth: g.month, today, min: opts.min, max: opts.max, locale: opts.locale });
        for (const m of items) {
          const btn = document.createElement("button");
          btn.type = "button";
          btn.className = dateRangeCellClass;
          btn.dataset.month = m.month;
          btn.dataset.monthIdx = String(idx);
          btn.dataset.cellIndex = String(m.index);
          btn.tabIndex = m.index === currentMonthIndex ? 0 : -1;
          btn.setAttribute("aria-label", m.fullLabel);
          btn.setAttribute("aria-pressed", String(m.selected));
          if (m.current) btn.setAttribute("aria-current", "date");
          if (m.disabled) btn.setAttribute("aria-disabled", "true");
          btn.textContent = m.label;
          grid.append(btn);
        }
        monthEl.append(header, grid);
      } else {
        const grid = document.createElement("div");
        grid.className = dateRangeYearsClass;
        grid.setAttribute("role", "group");
        grid.setAttribute("aria-label", `${yearStart}–${yearStart + 11}`);
        const items = datePickerYears({ startYear: yearStart, selectedYear: currentYear, today, min: opts.min, max: opts.max, locale: opts.locale });
        const activeIdx = items.some((y) => y.selected) ? items.findIndex((y) => y.selected) : 0;
        for (let cellIdx = 0; cellIdx < items.length; cellIdx++) {
          const y = items[cellIdx]!;
          const btn = document.createElement("button");
          btn.type = "button";
          btn.className = dateRangeCellClass;
          btn.dataset.year = String(y.year);
          btn.dataset.monthIdx = String(idx);
          btn.dataset.cellIndex = String(cellIdx);
          btn.tabIndex = cellIdx === activeIdx ? 0 : -1;
          btn.setAttribute("aria-label", y.label);
          btn.setAttribute("aria-pressed", String(y.selected));
          if (y.current) btn.setAttribute("aria-current", "date");
          if (y.disabled) btn.setAttribute("aria-disabled", "true");
          btn.textContent = y.label;
          grid.append(btn);
        }
        monthEl.append(header, grid);
      }

      return monthEl;
    });

    const existingFooter = root.querySelector<HTMLDivElement>(`.${dateRangeFooterClass}`);
    let footerEl = existingFooter;
    if (opts.showActions && !footerEl) {
      footerEl = document.createElement("div");
      footerEl.className = dateRangeFooterClass;
      const clearBtn = document.createElement("button");
      clearBtn.type = "button";
      clearBtn.className = "ayy-button ayy-button--ghost ayy-button--sm";
      clearBtn.dataset.action = "clear";
      clearBtn.textContent = opts.clearLabel ?? "Clear";

      const todayBtn = document.createElement("button");
      todayBtn.type = "button";
      todayBtn.className = "ayy-button ayy-button--secondary ayy-button--sm";
      todayBtn.dataset.action = "today";
      todayBtn.textContent = opts.todayLabel ?? "Today";
      footerEl.replaceChildren(clearBtn, todayBtn);
    }
    if (footerEl) {
      root.replaceChildren(...monthNodes, footerEl);
    } else {
      root.replaceChildren(...monthNodes);
    }

    if (focusTarget?.type === "cursor") {
      root.querySelector<HTMLButtonElement>(`.${dateRangeDayClass}[data-date="${cursor}"]`)?.focus();
    } else if (focusTarget?.type === "cell" && focusTarget.monthIdx !== undefined) {
      const col = root.querySelector<HTMLElement>(`[data-month-idx="${focusTarget.monthIdx}"]`);
      const sel = focusTarget.cellIndex !== undefined ? `[data-cell-index="${focusTarget.cellIndex}"]` : '[tabindex="0"]';
      (col?.querySelector<HTMLButtonElement>(`.${dateRangeCellClass}${sel}`) ?? col?.querySelector<HTMLButtonElement>(`.${dateRangeCellClass}`))?.focus();
    } else if (focusTarget?.type === "period" && focusTarget.monthIdx !== undefined && focusTarget.view) {
      root.querySelector<HTMLButtonElement>(`.${dateRangePeriodClass}[data-month-idx="${focusTarget.monthIdx}"][data-view="${focusTarget.view}"]`)?.focus();
    }
  };

  const onClick = (event: MouseEvent) => {
    const periodBtn = (event.target as Element | null)?.closest?.<HTMLButtonElement>(`.${dateRangePeriodClass}`);
    if (periodBtn && root.contains(periodBtn)) {
      const monthIdx = Number(periodBtn.dataset.monthIdx ?? "0");
      const targetView = periodBtn.dataset.view as "months" | "years" | undefined;
      if (!targetView) return;
      if (activePicker?.monthIdx === monthIdx && activePicker.view === targetView) {
        activePicker = null;
        render({ type: "period", monthIdx, view: targetView });
      } else {
        const colMonth = addMonths(startMonth, monthIdx);
        activePicker = {
          monthIdx,
          view: targetView,
          yearPageStart: datePickerYearPageStart(Number(colMonth.slice(0, 4))),
        };
        render({ type: "cell", monthIdx });
      }
      return;
    }

    const nav = (event.target as Element | null)?.closest?.<HTMLButtonElement>(`.${dateRangeNavClass}`);
    if (nav && root.contains(nav)) {
      const step = nav.dataset.nav ? Number(nav.dataset.nav) : (nav.getAttribute("aria-label")?.toLowerCase().includes("prev") ? -1 : 1);
      if (activePicker?.view === "years") {
        activePicker = { ...activePicker, yearPageStart: activePicker.yearPageStart + step * 12 };
      } else if (activePicker?.view === "months") {
        startMonth = addMonths(startMonth, step * 12);
      } else {
        startMonth = addMonths(startMonth, step);
      }
      render();
      return;
    }

    const cellBtn = (event.target as Element | null)?.closest?.<HTMLButtonElement>(`button.${dateRangeCellClass}`);
    if (cellBtn && root.contains(cellBtn)) {
      if (cellBtn.getAttribute("aria-disabled") === "true") return;
      const monthIdx = Number(cellBtn.dataset.monthIdx ?? "0");
      const colMonth = addMonths(startMonth, monthIdx);
      if (cellBtn.dataset.month) {
        const pickedMonth = cellBtn.dataset.month;
        startMonth = addMonths(pickedMonth, -monthIdx);
        cursor = pickedMonth;
        activePicker = null;
        render({ type: "cursor" });
      } else if (cellBtn.dataset.year) {
        const nextYear = Number(cellBtn.dataset.year);
        const pickedMonth = `${String(nextYear).padStart(4, "0")}-${colMonth.slice(5, 7)}-01`;
        startMonth = addMonths(pickedMonth, -monthIdx);
        cursor = pickedMonth;
        activePicker = null;
        render({ type: "cursor" });
      }
      return;
    }

    const footerBtn = (event.target as Element | null)?.closest?.<HTMLButtonElement>(`.${dateRangeFooterClass} button`);
    if (footerBtn && root.contains(footerBtn)) {
      const action = footerAction(footerBtn, opts);
      if (action === "clear") {
        range = null;
        pendingStart = null;
        hoverDate = null;
        cursor = today;
        render();
        opts.onClear?.();
        opts.onSelect?.(null);
      } else if (action === "today") {
        if (outsideLimits(today, opts.min, opts.max)) return;
        const todayRange: [string, string] = [today, today];
        range = todayRange;
        pendingStart = null;
        hoverDate = null;
        cursor = today;
        startMonth = startOfMonth(today);
        activePicker = null;
        render({ type: "cursor" });
        opts.onToday?.();
        opts.onSelect?.(todayRange);
      }
      return;
    }

    const dayBtn = (event.target as Element | null)?.closest?.<HTMLButtonElement>(`button.${dateRangeDayClass}`);
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
      render({ type: "cursor" });
      opts.onSelect?.(nextRange);
    }
  };

  const onMouseOver = (event: MouseEvent) => {
    if (!pendingStart) return;
    const dayBtn = (event.target as Element | null)?.closest?.<HTMLButtonElement>(`button.${dateRangeDayClass}`);
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
    const cellBtn = (event.target as Element | null)?.closest?.<HTMLButtonElement>(`button.${dateRangeCellClass}`);
    if (cellBtn && root.contains(cellBtn) && activePicker) {
      const monthIdx = Number(cellBtn.dataset.monthIdx ?? "0");
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        const prevView = activePicker.view;
        activePicker = null;
        render({ type: "period", monthIdx, view: prevView });
        return;
      }
      const idx = Number(cellBtn.dataset.cellIndex ?? "-1");
      if (idx < 0) return;
      const rtl = getComputedStyle(cellBtn).direction === "rtl";
      const nextIdx = datePickerCellKeyTarget(event.key, idx, { rtl });
      if (nextIdx === null) return;
      event.preventDefault();
      if (activePicker.view === "months") {
        if (nextIdx < 0) {
          startMonth = addMonths(startMonth, -12);
          render({ type: "cell", monthIdx, cellIndex: (nextIdx + 12) % 12 });
        } else if (nextIdx >= 12) {
          startMonth = addMonths(startMonth, 12);
          render({ type: "cell", monthIdx, cellIndex: nextIdx % 12 });
        } else {
          render({ type: "cell", monthIdx, cellIndex: nextIdx });
        }
      } else {
        if (nextIdx < 0) {
          activePicker = { ...activePicker, yearPageStart: activePicker.yearPageStart - 12 };
          render({ type: "cell", monthIdx, cellIndex: (nextIdx + 12) % 12 });
        } else if (nextIdx >= 12) {
          activePicker = { ...activePicker, yearPageStart: activePicker.yearPageStart + 12 };
          render({ type: "cell", monthIdx, cellIndex: nextIdx % 12 });
        } else {
          render({ type: "cell", monthIdx, cellIndex: nextIdx });
        }
      }
      return;
    }

    const dayBtn = (event.target as Element | null)?.closest?.<HTMLButtonElement>(`button.${dateRangeDayClass}`);
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
      if (target < displayedMonths[0]) {
        startMonth = targetMonth;
      } else {
        startMonth = addMonths(targetMonth, -(monthsCount - 1));
      }
      render({ type: "cursor" });
    } else {
      root.querySelector<HTMLButtonElement>(`.${dateRangeDayClass}[data-date="${target}"]`)?.focus();
    }
  };

  root.addEventListener("click", onClick);
  root.addEventListener("mouseover", onMouseOver);
  root.addEventListener("mouseleave", onMouseLeave);
  root.addEventListener("keydown", onKeyDown);
  render();

  return {
    setValue(v) {
      range = v;
      pendingStart = null;
      hoverDate = null;
      activePicker = null;
      if (v?.[0]) {
        cursor = v[0];
        startMonth = startOfMonth(v[0]);
      }
      render();
    },
    update(next) {
      opts = { ...opts, ...next };
      if (next.value !== undefined) range = next.value;
      if (next.today !== undefined) today = next.today;
      render();
    },
    focus() {
      (
        root.querySelector<HTMLButtonElement>(`.${dateRangeDayClass}[tabindex="0"]`) ??
        root.querySelector<HTMLButtonElement>(`.${dateRangeCellClass}[tabindex="0"]`)
      )?.focus();
    },
    destroy() {
      root.removeEventListener("click", onClick);
      root.removeEventListener("mouseover", onMouseOver);
      root.removeEventListener("mouseleave", onMouseLeave);
      root.removeEventListener("keydown", onKeyDown);
    },
  };
}

// Time Picker Controller
export interface TimePickerControllerOptions {
  value?: string | null;
  twelveHour?: boolean;
  stepMinute?: number;
  onSelect?: (time: string) => void;
}

export interface TimePickerController {
  setValue(value: string | null): void;
  update(options: Partial<TimePickerControllerOptions>): void;
  focus(): void;
  destroy(): void;
}

export function connectTimePicker(root: HTMLElement, options: TimePickerControllerOptions = {}): TimePickerController {
  let opts = { ...options };
  let value = opts.value ?? "";
  const isTwelveHour = () => Boolean(opts.twelveHour);

  // The value's hour as the columns show it (0–23, or 1–12 with its period).
  const getSplit = () => {
    const time = parseTime(value);
    if (!time) return { hour: "", minute: "", period: "AM" as TimePeriod };
    if (!isTwelveHour()) return { hour: pad2(time.hours), minute: pad2(time.minutes), period: (time.hours >= 12 ? "PM" : "AM") as TimePeriod };
    const { hours, period } = to12Hour(time.hours);
    return { hour: pad2(hours), minute: pad2(time.minutes), period };
  };

  // `h` is the hour as shown: 0–23 on the 24-hour clock (the period plays no part), 1–12 with `p` on the 12-hour one.
  const formatEmit = (h: number, m: number, p: TimePeriod): string =>
    isTwelveHour() ? formatTime(to24Hour(h, p), m, "12h") : `${pad2(h)}:${pad2(m)}`;

  let hourInput: HTMLInputElement;
  let minuteInput: HTMLInputElement;
  let periodBtn: HTMLButtonElement | null = null;
  let colsWrapper: HTMLDivElement;

  const syncColumns = () => {
    const { hour, minute, period } = getSplit();
    if (hourInput && document.activeElement !== hourInput) hourInput.value = hour;
    if (minuteInput && document.activeElement !== minuteInput) minuteInput.value = minute;
    if (periodBtn) periodBtn.textContent = period;

    for (const col of root.querySelectorAll<HTMLElement>(`.${timePickerColClass}`)) {
      const btns = Array.from(col.querySelectorAll<HTMLButtonElement>(`.${timePickerItemClass}`));
      let hasMatch = false;
      for (const btn of btns) {
        let isSelected = false;
        if (btn.dataset.hour) isSelected = Boolean(hour && btn.dataset.hour === hour);
        else if (btn.dataset.minute) isSelected = Boolean(minute && btn.dataset.minute === minute);
        else if (btn.dataset.period) isSelected = Boolean(period && btn.dataset.period === period);
        if (isSelected) hasMatch = true;
        btn.setAttribute("aria-selected", String(isSelected));
        btn.classList.toggle(timePickerItemSelectedClass, isSelected);
      }
      btns.forEach((btn, idx) => {
        const isSelected = btn.getAttribute("aria-selected") === "true";
        btn.tabIndex = isSelected || (!hasMatch && idx === 0) ? 0 : -1;
      });
    }

    for (const sel of root.querySelectorAll<HTMLElement>(`.${timePickerItemClass}[aria-selected="true"]`)) {
      centerTimePickerSelection(sel);
    }
  };

  const wireInputEvents = () => {
    hourInput.addEventListener("input", () => {
      const raw = hourInput.value.replace(/\D/g, "").slice(0, 2);
      hourInput.value = raw;
      if (!raw) return;
      const num = parseInt(raw, 10);
      const maxH = isTwelveHour() ? 12 : 23;
      const minH = isTwelveHour() ? 1 : 0;
      if (!isNaN(num) && num >= minH && num <= maxH) {
        const { minute, period } = getSplit();
        const nextVal = formatEmit(num, Number(minute || "00"), period);
        value = nextVal;
        syncColumns();
        opts.onSelect?.(nextVal);
        if (raw.length === 2 || (isTwelveHour() && num >= 2) || (!isTwelveHour() && num >= 3)) {
          minuteInput.focus();
          minuteInput.select();
        }
      }
    });

    minuteInput.addEventListener("input", () => {
      const raw = minuteInput.value.replace(/\D/g, "").slice(0, 2);
      minuteInput.value = raw;
      if (!raw) return;
      const num = parseInt(raw, 10);
      if (!isNaN(num) && num >= 0 && num <= 59) {
        const { hour, period } = getSplit();
        const nextVal = formatEmit(Number(hour || (isTwelveHour() ? "12" : "00")), num, period);
        value = nextVal;
        syncColumns();
        opts.onSelect?.(nextVal);
      }
    });

    hourInput.addEventListener("blur", () => {
      const { hour } = getSplit();
      hourInput.value = hour;
    });

    minuteInput.addEventListener("blur", () => {
      const { minute } = getSplit();
      minuteInput.value = minute;
    });

    hourInput.addEventListener("keydown", (e) => {
      if (e.key === ":" || e.key === "ArrowRight") {
        if (e.key === ":" || hourInput.selectionStart === hourInput.value.length) {
          e.preventDefault();
          minuteInput.focus();
          minuteInput.select();
        }
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        let { hour, minute, period } = getSplit();
        let h = parseInt(hour || (isTwelveHour() ? "12" : "00"), 10);
        const maxH = isTwelveHour() ? 12 : 23;
        const minH = isTwelveHour() ? 1 : 0;
        h = h >= maxH ? minH : h + 1;
        const nextVal = formatEmit(h, Number(minute || "00"), period);
        value = nextVal;
        syncColumns();
        opts.onSelect?.(nextVal);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        let { hour, minute, period } = getSplit();
        let h = parseInt(hour || (isTwelveHour() ? "12" : "00"), 10);
        const maxH = isTwelveHour() ? 12 : 23;
        const minH = isTwelveHour() ? 1 : 0;
        h = h <= minH ? maxH : h - 1;
        const nextVal = formatEmit(h, Number(minute || "00"), period);
        value = nextVal;
        syncColumns();
        opts.onSelect?.(nextVal);
      }
    });

    minuteInput.addEventListener("keydown", (e) => {
      if ((e.key === "Backspace" && minuteInput.value === "") || (e.key === "ArrowLeft" && minuteInput.selectionStart === 0)) {
        e.preventDefault();
        hourInput.focus();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        let { hour, minute, period } = getSplit();
        let m = (parseInt(minute || "00", 10) + (opts.stepMinute ?? 1)) % 60;
        const nextVal = formatEmit(Number(hour || (isTwelveHour() ? "12" : "00")), m, period);
        value = nextVal;
        syncColumns();
        opts.onSelect?.(nextVal);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        let { hour, minute, period } = getSplit();
        let m = (parseInt(minute || "00", 10) - (opts.stepMinute ?? 1) + 60) % 60;
        const nextVal = formatEmit(Number(hour || (isTwelveHour() ? "12" : "00")), m, period);
        value = nextVal;
        syncColumns();
        opts.onSelect?.(nextVal);
      }
    });

    if (periodBtn) {
      periodBtn.addEventListener("click", () => {
        let { hour, minute, period } = getSplit();
        const nextPeriod = period === "AM" ? "PM" : "AM";
        const nextVal = formatEmit(Number(hour || "12"), Number(minute || "00"), nextPeriod);
        value = nextVal;
        syncColumns();
        opts.onSelect?.(nextVal);
      });
    }
  };

  const render = () => {
    const { hour, minute, period } = getSplit();
    const hours = isTwelveHour() ? timePickerHours12 : timePickerHours24;
    const minutes = timePickerMinutes.filter((_, i) => i % (opts.stepMinute ?? 1) === 0);

    const header = document.createElement("div");
    header.className = timePickerHeaderClass;

    const inputs = document.createElement("div");
    inputs.className = timePickerInputsClass;

    hourInput = document.createElement("input");
    hourInput.type = "text";
    hourInput.inputMode = "numeric";
    hourInput.maxLength = 2;
    hourInput.className = timePickerInputClass;
    hourInput.setAttribute("aria-label", "Hours");
    hourInput.value = hour;

    const separator = document.createElement("span");
    separator.className = timePickerSeparatorClass;
    separator.setAttribute("aria-hidden", "true");
    separator.textContent = ":";

    minuteInput = document.createElement("input");
    minuteInput.type = "text";
    minuteInput.inputMode = "numeric";
    minuteInput.maxLength = 2;
    minuteInput.className = timePickerInputClass;
    minuteInput.setAttribute("aria-label", "Minutes");
    minuteInput.value = minute;

    inputs.append(hourInput, separator, minuteInput);

    if (isTwelveHour()) {
      periodBtn = document.createElement("button");
      periodBtn.type = "button";
      periodBtn.className = timePickerPeriodBtnClass;
      periodBtn.setAttribute("aria-label", "Toggle AM/PM");
      periodBtn.textContent = period;
      inputs.append(periodBtn);
    } else {
      periodBtn = null;
    }

    header.append(inputs);

    const makeCol = (items: readonly string[], current: string, type: "hour" | "minute" | "period") => {
      const col = document.createElement("div");
      col.className = timePickerColClass;
      col.setAttribute("role", "listbox");
      col.setAttribute("aria-label", type === "hour" ? "Hours" : type === "minute" ? "Minutes" : "Period");

      const hasMatch = Boolean(current && items.includes(current));
      for (let idx = 0; idx < items.length; idx++) {
        const item = items[idx]!;
        const btn = document.createElement("button");
        btn.type = "button";
        btn.setAttribute("role", "option");
        btn.className = timePickerItemClass;
        btn.dataset[type] = item;
        const isSelected = Boolean(current && item === current);
        btn.setAttribute("aria-selected", String(isSelected));
        if (isSelected) btn.classList.add(timePickerItemSelectedClass);
        btn.tabIndex = isSelected || (!hasMatch && idx === 0) ? 0 : -1;
        btn.textContent = item;
        col.append(btn);
      }
      return col;
    };

    const hourCol = makeCol(hours, hour, "hour");
    const minCol = makeCol(minutes, minute, "minute");

    const cols = [hourCol, minCol];
    if (isTwelveHour()) {
      cols.push(makeCol(timePickerPeriods, period, "period"));
    }

    colsWrapper = document.createElement("div");
    colsWrapper.className = timePickerColumnsClass;
    colsWrapper.append(...cols);

    root.replaceChildren(header, colsWrapper);

    wireInputEvents();

    for (const sel of root.querySelectorAll<HTMLElement>(`.${timePickerItemClass}[aria-selected="true"]`)) {
      centerTimePickerSelection(sel);
    }
  };

  const onClick = (event: MouseEvent) => {
    const btn = (event.target as Element | null)?.closest?.<HTMLButtonElement>(`.${timePickerItemClass}`);
    if (!btn || !root.contains(btn)) return;

    let { hour, minute, period } = getSplit();
    if (btn.dataset.hour) hour = btn.dataset.hour;
    if (btn.dataset.minute) minute = btn.dataset.minute;
    if (btn.dataset.period) period = btn.dataset.period as TimePeriod;

    const nextVal = formatEmit(Number(hour || (isTwelveHour() ? "12" : "00")), Number(minute || "00"), period);
    value = nextVal;
    syncColumns();
    opts.onSelect?.(nextVal);
  };

  const onKeyDown = (event: KeyboardEvent) => {
    const btn = (event.target as Element | null)?.closest?.<HTMLButtonElement>(`.${timePickerItemClass}`);
    if (!btn || !root.contains(btn)) return;
    const col = btn.closest<HTMLElement>(`.${timePickerColClass}`);
    if (!col) return;
    const items = Array.from(col.querySelectorAll<HTMLButtonElement>(`.${timePickerItemClass}`));
    const idx = items.indexOf(btn);
    if (idx < 0) return;
    let nextIdx = -1;
    if (event.key === "ArrowDown") nextIdx = Math.min(items.length - 1, idx + 1);
    else if (event.key === "ArrowUp") nextIdx = Math.max(0, idx - 1);
    else if (event.key === "Home") nextIdx = 0;
    else if (event.key === "End") nextIdx = items.length - 1;
    if (nextIdx >= 0) {
      event.preventDefault();
      items[nextIdx]?.focus();
    }
  };

  root.addEventListener("click", onClick);
  root.addEventListener("keydown", onKeyDown);
  render();

  return {
    setValue(v) {
      value = v ?? "";
      syncColumns();
    },
    update(next) {
      opts = { ...opts, ...next };
      if (next.value !== undefined) value = next.value ?? "";
      render();
    },
    focus() {
      hourInput?.focus();
    },
    destroy() {
      root.removeEventListener("click", onClick);
      root.removeEventListener("keydown", onKeyDown);
    },
  };
}

// Combined Date & Time Controller
export interface DateTimePickerControllerOptions {
  dateValue?: string | null;
  timeValue?: string | null;
  today?: string;
  twelveHour?: boolean;
  stepMinute?: number;
  weekStart?: Weekday;
  min?: string;
  max?: string;
  locale?: string;
  showActions?: boolean;
  clearLabel?: string;
  todayLabel?: string;
  onClear?: () => void;
  onToday?: () => void;
  onSelect?: (date: string, time: string) => void;
}

export interface DateTimePickerController {
  setValue(date: string | null, time: string | null): void;
  update(options: Partial<DateTimePickerControllerOptions>): void;
  focus(): void;
  destroy(): void;
}

export function connectDateTimePicker(root: HTMLElement, options: DateTimePickerControllerOptions = {}): DateTimePickerController {
  let opts = { ...options };
  let dateVal = opts.dateValue ?? "";
  let timeVal = opts.timeValue ?? "";

  const dateRoot = document.createElement("div");
  dateRoot.className = dateTimePickerDateClass;

  const dateGridEl = document.createElement("div");
  dateGridEl.className = datePickerGridClass;
  dateRoot.append(dateGridEl);

  const divider = document.createElement("div");
  divider.className = dateTimePickerDividerClass;
  divider.setAttribute("aria-hidden", "true");

  const timeRoot = document.createElement("div");
  timeRoot.className = dateTimePickerTimeClass;

  const timeEl = document.createElement("div");
  timeEl.className = timePickerClassConstant;
  timeRoot.append(timeEl);

  let footerEl = root.querySelector<HTMLDivElement>(`.${dateTimePickerFooterClass}`);
  if (opts.showActions && !footerEl) {
    footerEl = document.createElement("div");
    footerEl.className = dateTimePickerFooterClass;
    const clearBtn = document.createElement("button");
    clearBtn.type = "button";
    clearBtn.className = "ayy-button ayy-button--ghost ayy-button--sm";
    clearBtn.dataset.action = "clear";
    clearBtn.textContent = opts.clearLabel ?? "Clear";

    const todayBtn = document.createElement("button");
    todayBtn.type = "button";
    todayBtn.className = "ayy-button ayy-button--secondary ayy-button--sm";
    todayBtn.dataset.action = "today";
    todayBtn.textContent = opts.todayLabel ?? "Today";
    footerEl.replaceChildren(clearBtn, todayBtn);
  }

  if (footerEl) {
    root.replaceChildren(dateRoot, divider, timeRoot, footerEl);
  } else {
    root.replaceChildren(dateRoot, divider, timeRoot);
  }

  const dateCtrl = connectDatePicker(dateGridEl, {
    value: dateVal || null,
    min: opts.min,
    max: opts.max,
    locale: opts.locale,
    weekStart: opts.weekStart,
    showActions: false,
    onSelect(d) {
      dateVal = d;
      opts.onSelect?.(dateVal, timeVal);
    },
  });

  const timeCtrl = connectTimePicker(timeEl, {
    value: timeVal,
    twelveHour: opts.twelveHour,
    stepMinute: opts.stepMinute,
    onSelect(t) {
      timeVal = t;
      opts.onSelect?.(dateVal, timeVal);
    },
  });

  const onRootClick = (event: MouseEvent) => {
    const footerBtn = (event.target as Element | null)?.closest?.<HTMLButtonElement>(`.${dateTimePickerFooterClass} button`);
    if (footerBtn && root.contains(footerBtn)) {
      const action = footerAction(footerBtn, opts);
      if (action === "clear") {
        dateVal = "";
        timeVal = "";
        dateCtrl.setValue(null);
        timeCtrl.setValue("");
        opts.onClear?.();
        opts.onSelect?.("", "");
      } else if (action === "today") {
        const today = opts.today ?? todayIso();
        if (outsideLimits(today, opts.min, opts.max)) return;
        dateVal = today;
        timeVal = timeVal || "12:00";
        dateCtrl.setValue(dateVal);
        timeCtrl.setValue(timeVal);
        opts.onToday?.();
        opts.onSelect?.(dateVal, timeVal);
      }
    }
  };
  root.addEventListener("click", onRootClick);

  return {
    setValue(d, t) {
      dateVal = d ?? "";
      timeVal = t ?? "";
      dateCtrl.setValue(d);
      timeCtrl.setValue(t ?? "");
    },
    update(next) {
      opts = { ...opts, ...next };
      dateCtrl.update({ min: opts.min, max: opts.max, locale: opts.locale, weekStart: opts.weekStart });
      timeCtrl.update({ twelveHour: opts.twelveHour, stepMinute: opts.stepMinute });
    },
    focus() {
      dateCtrl.focus();
    },
    destroy() {
      root.removeEventListener("click", onRootClick);
      dateCtrl.destroy();
      timeCtrl.destroy();
    },
  };
}

