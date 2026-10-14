import { cx } from "../../lib/cx";
import { Clock01Icon } from "../../lib/icons";
import type { IconData } from "../icon/icon";
import { iconSvg } from "../icon/icon";

export const timePickerFormats = ["12h", "24h"] as const;
export type TimePickerFormat = (typeof timePickerFormats)[number];

export const timePeriods = ["AM", "PM"] as const;
export type TimePeriod = (typeof timePeriods)[number];

export interface TimePickerClassOptions {
  className?: string;
}

/** Root container class for the time picker. */
export function timePickerClass({ className }: TimePickerClassOptions = {}): string {
  return cx("ayy-time-picker", className);
}

export interface TimePickerTriggerClassOptions {
  className?: string;
}

/** Class for the field-like button that acts as a popover trigger. */
export function timePickerTriggerClass({ className }: TimePickerTriggerClassOptions = {}): string {
  return cx("ayy-time-picker-trigger", className);
}

export const timePickerColumnsClass = "ayy-time-picker__columns";
export const timePickerColClass = "ayy-time-picker__col";
export const timePickerItemClass = "ayy-time-picker__item";
export const timePickerItemSelectedClass = "ayy-time-picker__item--selected";
export const timePickerTriggerValueClass = "ayy-time-picker-trigger__value";

/** Hugeicons Clock01 glyph data. */
export const timePickerClockIconData: IconData = Clock01Icon;

/** SVG markup for the time picker trigger's clock icon. */
export const timePickerClockIcon = /* @__PURE__ */ iconSvg(Clock01Icon);

export const pad2 = (n: number): string => String(n).padStart(2, "0");

/** 24-hour hours options ("00" to "23"). */
export const hours24: readonly string[] = Array.from({ length: 24 }, (_, i) => pad2(i));

/** 12-hour hours options ("01" to "12"). */
export const hours12: readonly string[] = Array.from({ length: 12 }, (_, i) => pad2(i + 1));

/** Generate hour options based on display format. */
export function generateHours(format: TimePickerFormat = "24h"): string[] {
  return format === "12h" ? [...hours12] : [...hours24];
}

/** Generate minute options stepped by a given interval (clamped 1–60, default 5). */
export function generateMinutes(step = 5): string[] {
  const safeStep = Math.max(1, Math.min(60, Math.floor(step)));
  const list: string[] = [];
  for (let m = 0; m < 60; m += safeStep) {
    list.push(pad2(m));
  }
  return list;
}

/** Convert a 12-hour value (1–12) and period ("AM" | "PM") into a 24-hour value (0–23). */
export function to24Hour(hours12Val: number, period: TimePeriod): number {
  const h = hours12Val % 12;
  return period === "PM" ? h + 12 : h;
}

/** Convert a 24-hour value (0–23) into 12-hour format (1–12) with period ("AM" | "PM"). */
export function to12Hour(hours24Val: number): { hours: number; period: TimePeriod } {
  const period: TimePeriod = hours24Val >= 12 ? "PM" : "AM";
  let hours = hours24Val % 12;
  if (hours === 0) hours = 12;
  return { hours, period };
}

export interface ParsedTime {
  /** 24-hour hour value (0–23). */
  hours: number;
  /** Minutes (0–59). */
  minutes: number;
  /** Period ("AM" or "PM"). */
  period: TimePeriod;
}

/**
 * Pure parser for time strings in 24h ("14:30") or 12h ("2:30 PM", "02:30 PM") format.
 * Returns null if the string is empty or invalid.
 */
export function parseTimeString(timeStr?: string | null): ParsedTime | null {
  if (!timeStr || typeof timeStr !== "string") return null;
  const trimmed = timeStr.trim();
  const match = trimmed.match(/^(\d{1,2}):(\d{2})(?:\s*(AM|PM))?$/i);
  if (!match) return null;

  const rawHours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  if (isNaN(rawHours) || isNaN(minutes) || minutes < 0 || minutes > 59) return null;

  const rawPeriod = match[3]?.toUpperCase() as TimePeriod | undefined;

  if (rawPeriod) {
    if (rawHours < 1 || rawHours > 12) return null;
    const hours24 = to24Hour(rawHours, rawPeriod);
    return { hours: hours24, minutes, period: rawPeriod };
  }

  if (rawHours < 0 || rawHours > 23) return null;
  const period: TimePeriod = rawHours >= 12 ? "PM" : "AM";
  return { hours: rawHours, minutes, period };
}

/** Format hour and minute numbers into a string according to the requested format. */
export function formatTime(hours: number, minutes: number, format: TimePickerFormat = "24h"): string {
  const safeM = Math.max(0, Math.min(59, minutes));
  if (format === "12h") {
    const { hours: h12, period } = to12Hour(hours);
    return `${pad2(h12)}:${pad2(safeM)} ${period}`;
  }
  const safeH = Math.max(0, Math.min(23, hours));
  return `${pad2(safeH)}:${pad2(safeM)}`;
}

/** Format a time string into the specified display format ("12h" or "24h"). */
export function formatTimeString(timeStr: string, format: TimePickerFormat = "24h"): string {
  const parsed = parseTimeString(timeStr);
  if (!parsed) return timeStr;
  return formatTime(parsed.hours, parsed.minutes, format);
}

export interface ConnectTimePickerOptions {
  value?: string | null;
  format?: TimePickerFormat;
  step?: number;
  onSelect?: (time: string) => void;
}

export interface TimePickerController {
  setValue(value: string | null): void;
  update(options: Partial<ConnectTimePickerOptions>): void;
  focus(): void;
  destroy(): void;
}

/** Wire a .ayy-time-picker: draws the hour, minute and optional AM/PM columns, scrolls to the selection, and handles clicks and arrow keys. */
export function connectTimePicker(root: HTMLElement, options: ConnectTimePickerOptions = {}): TimePickerController {
  let value = options.value ?? "";
  let format: TimePickerFormat = options.format ?? "24h";
  let step = options.step ?? 5;
  let onSelect = options.onSelect;

  if (!root.hasAttribute("role")) root.setAttribute("role", "group");
  if (!root.hasAttribute("aria-label")) root.setAttribute("aria-label", "Time picker");

  const getSelectedParts = () => {
    const parsed = parseTimeString(value);
    if (!parsed) return { hour: null as string | null, minute: null as string | null, period: "AM" as TimePeriod };
    if (format === "12h") {
      const { hours: h12, period } = to12Hour(parsed.hours);
      return { hour: pad2(h12), minute: pad2(parsed.minutes), period };
    }
    return { hour: pad2(parsed.hours), minute: pad2(parsed.minutes), period: parsed.period };
  };

  const scrollToSelected = () => {
    for (const col of root.querySelectorAll<HTMLElement>(`.${timePickerColClass}`)) {
      const active = col.querySelector<HTMLElement>(`.${timePickerItemSelectedClass}`);
      if (active) {
        col.scrollTop = active.offsetTop - col.offsetTop - (col.clientHeight - active.clientHeight) / 2;
      }
    }
  };

  const render = () => {
    const { hour: selectedHour, minute: selectedMinute, period: selectedPeriod } = getSelectedParts();
    const hours = generateHours(format);
    const minutes = generateMinutes(step);
    let columns = root.querySelector<HTMLElement>(`.${timePickerColumnsClass}`);
    if (!columns) {
      columns = document.createElement("div");
      columns.className = timePickerColumnsClass;
      root.replaceChildren(columns);
    }

    const buildCol = (label: string, kind: "hour" | "minute" | "period", items: readonly string[], selectedItem: string | null) => {
      const col = document.createElement("div");
      col.className = timePickerColClass;
      col.setAttribute("role", "listbox");
      col.setAttribute("aria-label", label);
      col.dataset.col = kind;
      for (const item of items) {
        const isSelected = selectedItem === item;
        const btn = document.createElement("button");
        btn.type = "button";
        btn.setAttribute("role", "option");
        btn.setAttribute("aria-selected", String(isSelected));
        btn.className = cx(timePickerItemClass, isSelected && timePickerItemSelectedClass);
        btn.dataset.value = item;
        btn.textContent = item;
        col.append(btn);
      }
      return col;
    };

    const cols = [
      buildCol("Hours", "hour", hours, selectedHour),
      buildCol("Minutes", "minute", minutes, selectedMinute),
    ];
    if (format === "12h") {
      cols.push(buildCol("Period", "period", timePeriods, selectedPeriod));
    }
    columns.replaceChildren(...cols);
    scrollToSelected();
  };

  const commit = (kind: "hour" | "minute" | "period", itemVal: string) => {
    const { hour: selectedHour, minute: selectedMinute, period: selectedPeriod } = getSelectedParts();
    const hourNum = kind === "hour" ? parseInt(itemVal, 10) : selectedHour ? parseInt(selectedHour, 10) : 12;
    const minuteNum = kind === "minute" ? parseInt(itemVal, 10) : selectedMinute ? parseInt(selectedMinute, 10) : 0;
    const period: TimePeriod = kind === "period" ? (itemVal as TimePeriod) : selectedPeriod;
    const hours24 = format === "12h" ? to24Hour(hourNum, period) : hourNum;
    value = formatTime(hours24, minuteNum, format);
    render();
    onSelect?.(value);
  };

  const onClick = (event: MouseEvent) => {
    const btn = (event.target as Element | null)?.closest?.<HTMLButtonElement>(`.${timePickerItemClass}`);
    if (!btn || !root.contains(btn)) return;
    const col = btn.closest<HTMLElement>(`.${timePickerColClass}`);
    const kind = col?.dataset.col as "hour" | "minute" | "period" | undefined;
    const itemVal = btn.dataset.value ?? btn.textContent?.trim() ?? "";
    if (!kind || !itemVal) return;
    commit(kind, itemVal);
    // Restore focus to the matching button in the re-rendered column
    root
      .querySelector<HTMLButtonElement>(`.${timePickerColClass}[data-col="${kind}"] .${timePickerItemClass}[data-value="${CSS.escape(itemVal)}"]`)
      ?.focus();
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

  render();
  root.addEventListener("click", onClick);
  root.addEventListener("keydown", onKeyDown);

  return {
    setValue(next) {
      value = next ?? "";
      render();
    },
    update(next) {
      if ("value" in next) value = next.value ?? "";
      if (next.format) format = next.format;
      if (next.step !== undefined) step = next.step;
      if (next.onSelect) onSelect = next.onSelect;
      render();
    },
    focus() {
      const target =
        root.querySelector<HTMLButtonElement>(`.${timePickerItemSelectedClass}`) ??
        root.querySelector<HTMLButtonElement>(`.${timePickerItemClass}`);
      target?.focus();
    },
    destroy() {
      root.removeEventListener("click", onClick);
      root.removeEventListener("keydown", onKeyDown);
    },
  };
}
