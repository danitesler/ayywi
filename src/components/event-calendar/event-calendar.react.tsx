import { forwardRef, useEffect, useId, useLayoutEffect, useRef, useState, type CSSProperties, type HTMLAttributes, type KeyboardEvent, type ReactNode } from "react";
import { ArrowDown01Icon, ArrowLeft01Icon, ArrowRight01Icon, PlusSignIcon } from "../../lib/icons";
import { addDays, addMonths, datePickerLabels, startOfMonth, startOfWeek, todayIso, type Weekday } from "../date-time-picker/date-time-picker";
import { Icon } from "../icon/icon.react";
import { DatePickerGrid } from "../date-time-picker/date-time-picker.react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "../menu/menu.react";
import { DragDropArea, DropTarget, SortableItem } from "../drag-drop/drag-drop.react";
import { Popover, PopoverContent, PopoverTrigger } from "../popover/popover.react";
import { eventCalendarClass, eventCalendarLabels, eventCalendarMonth, eventCalendarRowsPerDay, eventCalendarShiftDate, type EventCalendarEvent, type EventCalendarLabels } from "./event-calendar";

function DayOverflow({ label, more, children }: { label: string; more: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return <Popover open={open} onOpenChange={setOpen}><PopoverTrigger variant="ghost" className="ayy-event-calendar__more" dir="auto">{more}</PopoverTrigger><PopoverContent align="start" aria-label={label}><p className="ayy-eyebrow">{label}</p><ul className="ayy-event-calendar__popover-list">{open && children}</ul></PopoverContent></Popover>;
}

function PeriodPicker({ value, part, title, locale, today, weekStart, onSelect }: { value: string; title: string; part: { type: "month" | "year"; value: string }; locale?: string; today?: string; weekStart: Weekday; onSelect: (month: string) => void }) {
  const [open, setOpen] = useState(false);
  return <Popover open={open} onOpenChange={setOpen}>
    <PopoverTrigger asChild><button type="button" className="ayy-date-picker-grid__period">{part.value}</button></PopoverTrigger>
    <PopoverContent align="start" aria-label={part.value}>{open && <DatePickerGrid value={value} locale={locale} today={today} weekStart={weekStart} initialView={part.type === "month" ? "months" : "years"} periodTitle={title} onPeriodSelect={(month) => { onSelect(month); setOpen(false); }} />}</PopoverContent>
  </Popover>;
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
  view?: "month" | "week" | "day" | "multi-day";
  defaultView?: "month" | "week" | "day" | "multi-day";
  onViewChange?: (view: "month" | "week" | "day" | "multi-day") => void;
  days?: number;
  onDaysChange?: (days: number) => void;
}
export const EventCalendar = /* @__PURE__ */ forwardRef<HTMLElement, EventCalendarProps>(function EventCalendar({ events, month, defaultMonth, onMonthChange, today, weekStart = 1, locale, selectedId, onEventClick, onAddEvent, labels, maxEvents = "auto", onEventMove, view, defaultView = "month", onViewChange, days: controlledDays, onDaysChange, className, style, ...props }, ref) {
  const [uncontrolled, setUncontrolled] = useState(() => startOfMonth(defaultMonth ?? today ?? todayIso()));
  const current = startOfMonth(month ?? uncontrolled);
  const [anchor, setAnchor] = useState(() => today ?? todayIso());
  const [uncontrolledView, setUncontrolledView] = useState(defaultView);
  const [uncontrolledDays, setUncontrolledDays] = useState(3);
  const currentView = view ?? uncontrolledView;
  const dayCount = currentView === "month" || currentView === "week" ? 7 : currentView === "day" ? 1 : Math.max(2, Math.min(7, controlledDays ?? uncontrolledDays));
  const visibleAnchor = anchor.slice(0, 7) === current.slice(0, 7) ? anchor : current;
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
  }, [maxEvents, currentView, dayCount]);
  useLayoutEffect(() => {
    if (!pending.current) return;
    const event = Array.from(gridRef.current?.querySelectorAll<HTMLButtonElement>(".ayy-event-calendar__event") ?? []).find((button) => button.dataset.id === pending.current);
    event?.focus();
    pending.current = null;
  }, [events]);
  const monthDays = eventCalendarMonth({ month: current, events, today, weekStart });
  const start = currentView === "week" ? startOfWeek(visibleAnchor, weekStart) : visibleAnchor;
  const days = currentView === "month" ? monthDays : Array.from({ length: dayCount }, (_, i) => {
    const date = addDays(start, i);
    return eventCalendarMonth({ month: date, events, today, weekStart }).find((day) => day.date === date)!;
  });
  const changeMonth = (value: string) => {
    const next = startOfMonth(value);
    if (month === undefined) setUncontrolled(next);
    onMonthChange?.(next);
  };
  const changeDate = (date: string) => { setAnchor(date); changeMonth(date); };
  const move = (direction: number) => currentView === "month" ? changeMonth(addMonths(current, direction)) : changeDate(addDays(visibleAnchor, direction * dayCount));
  const changeView = (next: typeof currentView) => { if (view === undefined) setUncontrolledView(next); onViewChange?.(next); };
  const weekdayNames = dateLabels.weekdays(weekStart);
  const weekdayOffset = currentView === "month" || currentView === "week" ? 0 : (new Date(`${start}T12:00:00Z`).getUTCDay() - weekStart + 7) % 7;
  return <section ref={ref} className={eventCalendarClass({ className })} aria-labelledby={titleId} data-month={current} data-today={today} data-view={currentView} style={{ "--_ayy-calendar-columns": dayCount, ...style } as CSSProperties} {...props}>
    <header className="ayy-event-calendar__header">
      <span className="ayy-sr-only" aria-live="polite">{dateLabels.month(current)}</span><div role="heading" aria-level={2} className="ayy-event-calendar__title" id={titleId}>{dateLabels.monthYearParts(current).map((part, i) => <span key={part.type}><PeriodPicker value={current} part={part} title={part.type === "month" ? names.month : names.year} locale={locale} today={today} weekStart={weekStart} onSelect={changeDate} />{i < dateLabels.monthYearParts(current).length - 1 ? " " : null}</span>)}</div>
      <div className="ayy-event-calendar__nav">
        <DropdownMenu>
          <DropdownMenuTrigger variant="outline" aria-label={names.view}>{currentView === "multi-day" ? names.dayCount(dayCount) : names[currentView]}<Icon icon={ArrowDown01Icon} name="chevron-down" /></DropdownMenuTrigger>
          <DropdownMenuContent align="end" aria-label={names.view}>
            <DropdownMenuRadioGroup value={currentView} onValueChange={(next) => changeView(next as typeof currentView)} closeOnSelect>
              <DropdownMenuRadioItem value="month">{names.month}</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="week">{names.week}</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="day">{names.day}</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger role="menuitemradio" selected={currentView === "multi-day"} value={currentView === "multi-day" ? names.dayCount(dayCount) : undefined}>{names.multiDay}</DropdownMenuSubTrigger>
              <DropdownMenuSubContent aria-label={names.days}>
                <DropdownMenuRadioGroup value={currentView === "multi-day" ? String(dayCount) : ""} onValueChange={(value) => { const next = Number(value); if (controlledDays === undefined) setUncontrolledDays(next); onDaysChange?.(next); changeView("multi-day"); }} closeOnSelect>
                  {[2, 3, 4, 5, 6, 7].map((count) => <DropdownMenuRadioItem key={count} value={String(count)}>{names.dayCount(count)}</DropdownMenuRadioItem>)}
                </DropdownMenuRadioGroup>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="ayy-event-calendar__navigation"><button type="button" className="ayy-button ayy-button--ghost ayy-button--icon" data-ayy-calendar="previous" aria-label={currentView === "month" ? names.previous : names.previousPeriod} onClick={() => move(-1)}><Icon icon={ArrowLeft01Icon} name="chevron-left" className="ayy-icon--directional" /></button>
        <button type="button" className="ayy-button ayy-button--secondary" data-ayy-calendar="today" onClick={() => changeDate(today ?? todayIso())}>{names.today}</button>
        <button type="button" className="ayy-button ayy-button--ghost ayy-button--icon" data-ayy-calendar="next" aria-label={currentView === "month" ? names.next : names.nextPeriod} onClick={() => move(1)}><Icon icon={ArrowRight01Icon} name="chevron-right" className="ayy-icon--directional" /></button></div>
      </div>
    </header>
    <div className="ayy-event-calendar__weekdays" aria-hidden="true">{Array.from({ length: dayCount }, (_, i) => <span key={i}>{weekdayNames[(weekdayOffset + i) % 7]}</span>)}</div>
    {(() => {
      const rows = maxEvents === "auto" ? measured : Math.max(1, maxEvents);
      const eventButton = (event: EventCalendarEvent, date: string) => {
        const moveKey = (key: KeyboardEvent<HTMLButtonElement>) => {
          if (!onEventMove || !key.altKey || !["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(key.key)) return;
          key.preventDefault(); key.stopPropagation();
          pending.current = event.id;
          const target = eventCalendarShiftDate(date, key.key as "ArrowLeft" | "ArrowRight" | "ArrowUp" | "ArrowDown", getComputedStyle(key.currentTarget).direction === "rtl");
          // The view follows an event moved past its edge, so the event and the focus stay on screen.
          if (!days.some((day) => day.date === target)) changeDate(target);
          onEventMove(event.id, target);
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
