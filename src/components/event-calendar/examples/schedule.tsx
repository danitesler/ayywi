import { useState } from "react";
import { EventCalendar, type EventCalendarEvent } from "@danitesler/ayywi/react";

const initial: EventCalendarEvent[] = [
  { id: "e1", date: "2026-10-14", title: "Design review", time: "09:30", color: "var(--ayy-chart-1)" },
  { id: "e2", date: "2026-10-14", title: "Ship v0.2", color: "var(--ayy-chart-2)" },
  { id: "e3", date: "2026-10-02", title: "Quarterly planning with the whole product and design team", color: "var(--ayy-chart-3)" },
  { id: "e4", date: "2026-10-21", title: "Standup", time: "09:00", color: "var(--ayy-chart-4)" },
  { id: "e5", date: "2026-10-21", title: "1:1 with Sam", time: "11:00", color: "var(--ayy-chart-1)" },
  { id: "e6", date: "2026-10-21", title: "Lunch with Priya", time: "12:30", color: "var(--ayy-chart-2)" },
  { id: "e7", date: "2026-10-21", title: "Budget sync", time: "15:00", color: "var(--ayy-chart-3)" },
  { id: "e8", date: "2026-10-21", title: "Dentist", time: "16:00", color: "var(--ayy-chart-4)", done: true },
  { id: "e9", date: "2026-10-30", title: "Release notes", color: "var(--ayy-chart-1)" },
  { id: "e10", date: "2026-11-02", title: "Retro", color: "var(--ayy-chart-2)" },
];
export default function Example() {
  const [events, setEvents] = useState(initial);
  const [month, setMonth] = useState("2026-10-01");
  const [selected, setSelected] = useState<string | null>("e1");
  const [next, setNext] = useState(1);
  return <EventCalendar locale="en-US" today="2026-10-14" weekStart={1} month={month} onMonthChange={setMonth} events={events} onEventMove={(id, date) => setEvents((items) => items.map((event) => event.id === id ? { ...event, date } : event))} selectedId={selected} onEventClick={(id) => setSelected((value) => value === id ? null : id)} onAddEvent={(date) => { setEvents((items) => [...items, { id: `new-${next}`, date, title: "New event" }]); setNext((n) => n + 1); }} />;
}
