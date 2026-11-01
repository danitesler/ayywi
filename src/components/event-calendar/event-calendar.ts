import { cx } from "../../lib/cx";
import { addDays, datePickerMonth, type Weekday } from "../date-time-picker/date-time-picker";
export interface EventCalendarEvent { id: string; date: string; title: string; time?: string; color?: string; done?: boolean }
export interface EventCalendarDay { date: string; day: number; outside: boolean; today: boolean; events: EventCalendarEvent[] }
export interface EventCalendarLabels {
  previous: string;
  next: string;
  today: string;
  add: (day: string) => string;
  events: (count: number) => string;
  more: (count: number) => string;
}
export const eventCalendarLabels: EventCalendarLabels = {
  previous: "Previous month", next: "Next month", today: "Today", add: (day) => `Add an event on ${day}`,
  events: (count) => count ? `${count} ${count === 1 ? "event" : "events"}` : "", more: (count) => `+${count} more`,
};
export function eventCalendarClass({ className }: { className?: string } = {}): string { return cx("ayy-event-calendar", className); }
export function eventCalendarMonth({ month, events, today, weekStart }: { month: string; events: readonly EventCalendarEvent[]; today?: string; weekStart?: Weekday }): EventCalendarDay[] {
  return datePickerMonth({ month, today, weekStart }).map(({ date, day, outside, today: isToday }) => ({
    date, day, outside, today: isToday,
    events: events.filter((event) => event.date === date).sort((a, b) => Number(Boolean(a.done)) - Number(Boolean(b.done)) || (a.time ?? "").localeCompare(b.time ?? "")),
  }));
}

export function eventCalendarRowsPerDay(grid: HTMLElement): number {
  const day = grid.querySelector<HTMLElement>(".ayy-event-calendar__day");
  const head = day?.querySelector<HTMLElement>(".ayy-event-calendar__day-head");
  if (!day || !head) return 3;
  const cs = getComputedStyle(day);
  const gap = Number.parseFloat(cs.rowGap) || 0;
  const room = day.clientHeight - Number.parseFloat(cs.paddingBlockStart) - Number.parseFloat(cs.paddingBlockEnd) - head.offsetHeight - gap;
  const chip = grid.querySelector<HTMLElement>(".ayy-event-calendar__event")?.offsetHeight || 22;
  return Math.max(1, Math.floor((room + 2) / (chip + 2)));
}
export function eventCalendarShiftDate(date: string, key: "ArrowLeft" | "ArrowRight" | "ArrowUp" | "ArrowDown", rtl: boolean): string {
  const delta = key === "ArrowUp" ? -7 : key === "ArrowDown" ? 7 : (key === "ArrowLeft" ? -1 : 1) * (rtl ? -1 : 1);
  return addDays(date, delta);
}
