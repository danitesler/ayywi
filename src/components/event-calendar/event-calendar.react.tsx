import { forwardRef, useId, useState, type CSSProperties, type HTMLAttributes } from "react";
import { ArrowLeft01Icon, ArrowRight01Icon, PlusSignIcon } from "../../lib/icons";
import { addMonths, datePickerLabels, startOfMonth, todayIso, type Weekday } from "../date-time-picker/date-time-picker";
import { Icon } from "../icon/icon.react";
import { eventCalendarClass, eventCalendarLabels, eventCalendarMonth, type EventCalendarEvent, type EventCalendarLabels } from "./event-calendar";

export interface EventCalendarProps extends Omit<HTMLAttributes<HTMLElement>, "onChange"> {
  events: EventCalendarEvent[];
  month?: string;
  defaultMonth?: string;
  onMonthChange?: (month: string) => void;
  today?: string;
  weekStart?: Weekday;
  locale?: string;
  selectedId?: string | null;
  onEventClick?: (id: string) => void;
  onAddEvent?: (date: string) => void;
  labels?: Partial<EventCalendarLabels>;
}
export const EventCalendar = /* @__PURE__ */ forwardRef<HTMLElement, EventCalendarProps>(function EventCalendar({ events, month, defaultMonth, onMonthChange, today, weekStart = 1, locale, selectedId, onEventClick, onAddEvent, labels, className, ...props }, ref) {
  const [uncontrolled, setUncontrolled] = useState(() => startOfMonth(defaultMonth ?? today ?? todayIso()));
  const current = startOfMonth(month ?? uncontrolled);
  const names = { ...eventCalendarLabels, ...labels };
  const dateLabels = datePickerLabels(locale);
  const titleId = useId();
  const days = eventCalendarMonth({ month: current, events, today, weekStart });
  const changeMonth = (value: string) => {
    const next = startOfMonth(value);
    if (month === undefined) setUncontrolled(next);
    onMonthChange?.(next);
  };
  return <section ref={ref} className={eventCalendarClass({ className })} aria-labelledby={titleId} data-month={current} data-today={today} {...props}>
    <header className="ayy-event-calendar__header">
      <h2 className="ayy-event-calendar__title" id={titleId} aria-live="polite">{dateLabels.month(current)}</h2>
      <div className="ayy-event-calendar__nav">
        <button type="button" className="ayy-button ayy-button--ghost ayy-button--icon" data-ayy-calendar="previous" aria-label={names.previous} onClick={() => changeMonth(addMonths(current, -1))}><Icon icon={ArrowLeft01Icon} name="chevron-left" className="ayy-icon--directional" /></button>
        <button type="button" className="ayy-button ayy-button--secondary" data-ayy-calendar="today" onClick={() => changeMonth(today ?? todayIso())}>{names.today}</button>
        <button type="button" className="ayy-button ayy-button--ghost ayy-button--icon" data-ayy-calendar="next" aria-label={names.next} onClick={() => changeMonth(addMonths(current, 1))}><Icon icon={ArrowRight01Icon} name="chevron-right" className="ayy-icon--directional" /></button>
      </div>
    </header>
    <div className="ayy-event-calendar__weekdays" aria-hidden="true">{dateLabels.weekdays(weekStart).map((name, i) => <span key={i}>{name}</span>)}</div>
    <ol className="ayy-event-calendar__grid" aria-labelledby={titleId}>
      {days.map((day) => {
        const dayName = dateLabels.day(day.date);
        const count = names.events(day.events.length);
        return <li className="ayy-event-calendar__day" key={day.date} data-date={day.date} data-outside={day.outside ? "" : undefined} aria-current={day.today ? "date" : undefined} aria-label={`${dayName}${count ? `, ${count}` : ""}`}>
          <div className="ayy-event-calendar__day-head"><span className="ayy-event-calendar__date" aria-hidden="true">{day.day}</span>{onAddEvent && <button type="button" className="ayy-button ayy-button--ghost ayy-button--icon ayy-event-calendar__add" data-ayy-calendar="add" aria-label={names.add(dayName)} onClick={() => onAddEvent(day.date)}><Icon icon={PlusSignIcon} name="plus" /></button>}</div>
          <ul className="ayy-event-calendar__events">{day.events.map((event) => <li key={event.id}><button type="button" className="ayy-event-calendar__event" data-id={event.id} data-done={event.done ? "" : undefined} aria-current={event.id === selectedId ? "true" : undefined} style={event.color ? { "--ayy-event-color": event.color } as CSSProperties : undefined} onClick={() => onEventClick?.(event.id)}>{event.time && <span className="ayy-event-calendar__time">{event.time}</span>}<span className="ayy-event-calendar__event-title">{event.title}</span></button></li>)}</ul>
        </li>;
      })}
    </ol>
  </section>;
});
