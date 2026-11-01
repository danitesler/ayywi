import { forwardRef, useEffect, useId, useLayoutEffect, useRef, useState, type CSSProperties, type HTMLAttributes, type KeyboardEvent, type ReactNode } from "react";
import { ArrowLeft01Icon, ArrowRight01Icon, PlusSignIcon } from "../../lib/icons";
import { addMonths, datePickerLabels, startOfMonth, todayIso, type Weekday } from "../date-time-picker/date-time-picker";
import { Icon } from "../icon/icon.react";
import { DragDropArea, DropTarget, SortableItem } from "../drag-drop/drag-drop.react";
import { Popover, PopoverContent, PopoverTrigger } from "../popover/popover.react";
import { eventCalendarClass, eventCalendarLabels, eventCalendarMonth, eventCalendarRowsPerDay, eventCalendarShiftDate, type EventCalendarEvent, type EventCalendarLabels } from "./event-calendar";

function DayOverflow({ label, more, children }: { label: string; more: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return <Popover open={open} onOpenChange={setOpen}><PopoverTrigger variant="ghost" className="ayy-event-calendar__more">{more}</PopoverTrigger><PopoverContent align="start" aria-label={label}><p className="ayy-eyebrow">{label}</p><ul className="ayy-event-calendar__popover-list">{open && children}</ul></PopoverContent></Popover>;
}

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
  maxEvents?: number | "auto";
  onEventMove?: (id: string, date: string) => void;
}
export const EventCalendar = /* @__PURE__ */ forwardRef<HTMLElement, EventCalendarProps>(function EventCalendar({ events, month, defaultMonth, onMonthChange, today, weekStart = 1, locale, selectedId, onEventClick, onAddEvent, labels, maxEvents = "auto", onEventMove, className, ...props }, ref) {
  const [uncontrolled, setUncontrolled] = useState(() => startOfMonth(defaultMonth ?? today ?? todayIso()));
  const current = startOfMonth(month ?? uncontrolled);
  const names = { ...eventCalendarLabels, ...labels };
  const dateLabels = datePickerLabels(locale);
  const titleId = useId();
  const gridRef = useRef<HTMLOListElement>(null);
  const pending = useRef<string | null>(null);
  const [measured, setMeasured] = useState(3);
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid || maxEvents !== "auto") return;
    const measure = () => setMeasured(eventCalendarRowsPerDay(grid));
    measure();
    const resize = new ResizeObserver(measure);
    resize.observe(grid);
    const mutation = new MutationObserver(measure);
    mutation.observe(document.documentElement, { attributes: true, attributeFilter: ["data-density"] });
    return () => { resize.disconnect(); mutation.disconnect(); };
  }, [maxEvents]);
  useLayoutEffect(() => {
    if (!pending.current) return;
    const event = Array.from(gridRef.current?.querySelectorAll<HTMLButtonElement>(".ayy-event-calendar__event") ?? []).find((button) => button.dataset.id === pending.current);
    event?.focus();
    pending.current = null;
  }, [events]);
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
    {(() => {
      const rows = maxEvents === "auto" ? measured : Math.max(1, maxEvents);
      const eventButton = (event: EventCalendarEvent, date: string) => {
        const moveKey = (key: KeyboardEvent<HTMLButtonElement>) => {
          if (!onEventMove || !key.altKey || !["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(key.key)) return;
          key.preventDefault(); key.stopPropagation();
          pending.current = event.id;
          onEventMove(event.id, eventCalendarShiftDate(date, key.key as "ArrowLeft" | "ArrowRight" | "ArrowUp" | "ArrowDown", getComputedStyle(key.currentTarget).direction === "rtl"));
        };
        return <button type="button" className="ayy-event-calendar__event" data-id={event.id} data-done={event.done ? "" : undefined} aria-current={event.id === selectedId ? "true" : undefined} style={event.color ? { "--ayy-event-color": event.color } as CSSProperties : undefined} onClick={() => onEventClick?.(event.id)} onKeyDownCapture={moveKey}>{event.time && <span className="ayy-event-calendar__time">{event.time}</span>}<span className="ayy-event-calendar__event-title">{event.title}</span></button>;
      };
      const grid = <ol ref={gridRef} className="ayy-event-calendar__grid" aria-labelledby={titleId}>
        {days.map((day) => {
          const dayName = dateLabels.day(day.date);
          const count = names.events(day.events.length);
          const overflow = day.events.length > rows;
          const visible = overflow ? day.events.slice(0, rows - 1) : day.events;
          const contents = <>
            {visible.map((event) => onEventMove ? <SortableItem key={event.id} data-id={event.id}>{eventButton(event, day.date)}</SortableItem> : <li key={event.id}>{eventButton(event, day.date)}</li>)}
            {overflow && <li><DayOverflow label={dayName} more={names.more(day.events.length - visible.length)}>{day.events.map((event) => <li key={event.id}>{eventButton(event, day.date)}</li>)}</DayOverflow></li>}
          </>;
          return <li className="ayy-event-calendar__day" key={day.date} data-date={day.date} data-outside={day.outside ? "" : undefined} aria-current={day.today ? "date" : undefined} aria-label={`${dayName}${count ? `, ${count}` : ""}`}>
            <div className="ayy-event-calendar__day-head"><span className="ayy-event-calendar__date" aria-hidden="true">{day.day}</span>{onAddEvent && <button type="button" className="ayy-button ayy-button--ghost ayy-button--icon ayy-event-calendar__add" data-ayy-calendar="add" aria-label={names.add(dayName)} onClick={() => onAddEvent(day.date)}><Icon icon={PlusSignIcon} name="plus" /></button>}</div>
            {onEventMove ? <DropTarget as="ul" list={false} className="ayy-event-calendar__events" data-id={day.date}>{contents}</DropTarget> : <ul className="ayy-event-calendar__events">{contents}</ul>}
          </li>;
        })}
      </ol>;
      return onEventMove ? <DragDropArea className="ayy-event-calendar__body" handle={false} onMove={({ itemId, fromId, toId }) => { if (itemId && toId && fromId !== toId) onEventMove(itemId, toId); }}>{grid}</DragDropArea> : grid;
    })()}
  </section>;
});
