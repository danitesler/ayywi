import { cx } from "../../lib/cx";
import { datePickerMonth, type Weekday } from "../date-time-picker/date-time-picker";
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
