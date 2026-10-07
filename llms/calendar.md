# Calendar

Category: Forms. A month of day buttons to pick one date, inline or in a popover (DatePicker). Six weeks so the height never jumps, one Tab stop with arrow keys, today ringed, the picked day filled, days outside min/max crossed out. Optional presets (Today, Tomorrow, Next week) and a footer for a time or a Clear button. Also called: calendar, date-picker, datepicker, date-input, day-picker, month-grid, mini-calendar.

**Classes**
- `.ayy-calendar` — Root: a column of the header, weekdays and grid, as wide as seven days (its content). Day size follows data-density.
- `.ayy-calendar--full` — Fills its container's width (a phone screen, a bottom sheet); days grow up to 1.5× their size.
- `.ayy-calendar__presets` — Row of quick dates above the month, in equal columns. role="group" with an aria-label ("Quick dates").
- `.ayy-calendar__preset` — A quick date: <button data-date> with an icon over a short label. data-date is an ISO day or "+N" days from today ("+0", "+1", "+7"). aria-pressed="true" when it's the picked day.
- `.ayy-calendar__header` — The month's title, then the two arrows at the inline end.
- `.ayy-calendar__title` — "October 2026", with aria-live="polite" so a month change is announced.
- `.ayy-calendar__nav` — Previous / next month button, with an aria-label and a directional arrow icon (so it points the right way in RTL).
- `.ayy-calendar__weekdays` — Short weekday names over the columns, aria-hidden (each day button's label names its weekday).
- `.ayy-calendar__grid` — The 42 day buttons, role="group" labelled by the month. One Tab stop: the picked day, else today, else the 1st has tabindex="0".
- `.ayy-calendar__day` — <button data-date="2026-10-07" aria-label="Wednesday, 7 October 2026">7</button>. aria-pressed="true" picked, aria-current="date" today, aria-disabled="true" outside min/max, data-outside for the neighbouring months' days.
- `.ayy-calendar__footer` — Under the month, after a hairline: a time input, Clear, Done.
- `.ayy-date-picker` — The trigger, on a <button class="ayy-input">: a calendar icon and the date, styled like a field. Opens a popover with the calendar.
- `.ayy-date-picker__value` — The date text inside the trigger. Empty shows its data-placeholder, muted.

**States**
- `default` — A month title with two arrow buttons, muted weekday names, then six weeks of round day buttons; days of the months around it are muted.
- `hover` (`.ayy-calendar__day:hover, __nav:hover, __preset:hover (devices that hover)`) — Wash-hover background, full text colour.
- `pressed` (`.ayy-calendar__day:active`) — The day shrinks to 94%.
- `focus` (`:focus-visible on a day, an arrow or a preset`) — 2px ring, 1px offset. The grid is one Tab stop: arrow keys move the focused day.
- `disabled` (`.ayy-calendar__day[aria-disabled="true"] (before min, after max)`) — Dimmed and crossed out, not-allowed cursor; still focusable so the arrows can cross it. Forced colours: GrayText.
- `selected` (`.ayy-calendar__day[aria-pressed="true"]; .ayy-calendar__preset[aria-pressed="true"]`) — The picked day is filled with the primary colour and semibold; the matching preset gets a wash and a line-strong ring. Forced colours: Highlight.
- `error` — doesn't apply: A calendar can't hold an invalid date: days outside min/max are disabled. For a required date, put aria-invalid on the DatePicker's button and a FieldError under it.
- `loading` — doesn't apply: No loading look. If available days load from a server, show a Skeleton the size of the calendar until they arrive.
- `today` (`.ayy-calendar__day[aria-current="date"]`) — A 1px ring and a semibold number, not colour alone. Forced colours: CanvasText outline.
- `outside` (`.ayy-calendar__day[data-outside]`) — A day of the month before or after: muted text.
- `empty` (`.ayy-date-picker__value:empty`) — No date yet: the DatePicker shows its data-placeholder, muted like an input's.

**Sizes**
- `sm` — DatePicker's button at Input sm.
- `md` (default) — DatePicker's button at Input md.
- `lg` — DatePicker's button at Input lg.
- Density — Day cells are the md control height (32px compact, 40 comfortable, 44 touch), so the month grows from 7 × 32px to 7 × 44px; arrows are the sm height.
- Width — Fits the seven days. full (ayy-calendar--full) fills its container, days up to 1.5× their size: a phone screen or a sheet.

**JS (framework-free)**: calendarMonth({ month, value?, today?, min?, max?, weekStart? }) → the 42 days to draw; calendarLabels(locale?) → { month, day, weekdays }; calendarKeyTarget(key, from, { weekStart?, rtl?, shift? }) → the day a key moves to; connectCalendar(root, { value?, min?, max?, weekStart?, locale?, onSelect? }) → { setValue, update, focus, destroy } draws and wires a month on plain markup. Date helpers on ISO days: addDays, addMonths, startOfMonth, startOfWeek, todayIso, parseIsoDate, toIsoDate, formatDate, localeWeekStart, resolveCalendarDate. calendarPreviousIcon, calendarNextIcon, datePickerIcon (SVG markup).

**Custom element** `<ayy-calendar>` (@danitesler/ayywi/elements) — 
- attribute `value`: The picked day, ISO ("2026-10-09"). Updated when a day is picked.
- attribute `min`: Earliest pickable day, ISO.
- attribute `max`: Latest pickable day, ISO.
- attribute `week-start`: First column, 0 = Sunday … 6 = Saturday. Default: the locale's.
- attribute `locale`: Language of the month and day names. Default: the browser's.
- attribute `name`: Form name: a hidden input inside carries the picked day.
- event `ayy-select`: { value } when a day is picked, value an ISO day.

**React** — `import { Calendar, DatePicker } from "@danitesler/ayywi/react";`
- `<Calendar>` renders <div class="ayy-calendar">…<div class="ayy-calendar__grid" role="group">. Props: `value / defaultValue` string | null — the picked ISO day; `onValueChange` (date: string) => void; `min / max` string — ISO days; outside them days are crossed out; `today` string — override today (tests, another time zone); `weekStart` 0–6, 0 = Sunday. Default: the locale's; `locale` string — month and day names. Default: the browser's; `full` boolean — fill the container's width; `previousLabel / nextLabel` string — the arrows' accessible names. Default "Previous month" / "Next month"; `presets` { label, date, icon? }[] — quick dates; date is ISO or "+N" days from today; `presetsLabel` string — the presets group's name. Default "Quick dates"; `footer` ReactNode — under the month (a time input, Clear)
- `<DatePicker>` renders <button class="ayy-input ayy-date-picker" aria-haspopup="dialog"> + <div class="ayy-popover" popover> with a Calendar. Props: `value / defaultValue` string | null — the ISO day; `onValueChange` (date: string) => void — the popover closes after it; `placeholder` string — shown while empty. Default "Pick a date"; `format` (date: string) => string — the trigger's text. Default "7 Oct 2026" in the locale; `min / max / today / weekStart / locale` As on Calendar; `size` "sm" | "md" | "lg" — like Input; `name` string — a hidden input carries the ISO day; `presets / footer` As on Calendar

**Accessibility**
- The grid is one Tab stop. Arrow keys move a day (mirrored in RTL) or a week, PageUp/PageDown a month (Shift: a year), Home/End to the week's ends; Enter or Space picks. Moving past the month's edge turns the page.
- Every day button is named in full by its aria-label ("Wednesday, 7 October 2026"); aria-pressed says it's picked, aria-current="date" that it's today. The weekday row is aria-hidden.
- Days outside min/max are aria-disabled, not disabled, so the arrows can cross them; they can't be picked. The title is aria-live, so a month change is announced.
- DatePicker's trigger is named by its <Label htmlFor>; the date is its description. Opening it moves focus to the picked day; Esc or a pick returns focus to the trigger.
- The picked day is a fill, today a ring and a heavier number; High Contrast fills the picked day with the system highlight.

**Do**
- Use a Calendar when the date is the main choice of a screen or panel: a due date with Today / Tomorrow / Next week presets, a booking, a habit's history.
- Use DatePicker for a date field in a form: it shows the date like an input and opens the month on demand.
- Set min (and max) instead of letting people pick days that can't work; say why in a FieldHint ("Arrivals from 3 pm").
- Put a time input, Repeat or Clear in the footer rather than beside the calendar.
- Use full in a bottom sheet or on a phone screen so the days are big enough to tap.

**Don't**
- Don't use a calendar for a birth date or any date far from today — a native <Input type="date"> (or three Selects) is faster to type.
- Don't use it for a time alone — use <Input type="time">, or Choice cards (compact) for a few time slots.
- Don't colour days by meaning (busy, free) without a second cue; put events in a list next to it.
- Don't hide the arrows to fix the month; set min and max instead.

## Calendar — Due date with presets and a time

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<!-- <ayy-calendar> (@danitesler/ayywi/elements) draws the month (weekdays and day buttons) and keeps it working; value is the picked day. -->
<ayy-calendar value="2026-10-09">
  <div class="ayy-calendar">
    <div class="ayy-calendar__presets" role="group" aria-label="Quick dates">
      <button type="button" class="ayy-calendar__preset" data-date="+0" aria-pressed="false"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M17 12C17 14.7614 14.7614 17 12 17C9.23858 17 7 14.7614 7 12C7 9.23858 9.23858 7 12 7C14.7614 7 17 9.23858 17 12Z" stroke="currentColor" stroke-width="1.5"></path><path d="M12 2V3.5M12 20.5V22M19.0708 19.0713L18.0101 18.0106M5.98926 5.98926L4.9286 4.9286M22 12H20.5M3.5 12H2M19.0713 4.92871L18.0106 5.98937M5.98975 18.0107L4.92909 19.0714" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path></svg>Today</button>
      <button type="button" class="ayy-calendar__preset" data-date="+1" aria-pressed="false"><svg class="ayy-icon ayy-icon--directional" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M18.5 12L4.99997 12" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M13 18C13 18 19 13.5811 19 12C19 10.4188 13 6 13 6" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg>Tomorrow</button>
      <button type="button" class="ayy-calendar__preset" data-date="+7" aria-pressed="false"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M16 2V6M8 2V6" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M13 4H11C7.22876 4 5.34315 4 4.17157 5.17157C3 6.34315 3 8.22876 3 12V14C3 17.7712 3 19.6569 4.17157 20.8284C5.34315 22 7.22876 22 11 22H13C16.7712 22 18.6569 22 19.8284 20.8284C21 19.6569 21 17.7712 21 14V12C21 8.22876 21 6.34315 19.8284 5.17157C18.6569 4 16.7712 4 13 4Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M3 10H21" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M12.1258 14H12.0008M12.1258 18H12.0008M7.625 14H7.5M7.625 18H7.5M16.625 14H16.5M12.2508 14C12.2508 14.1381 12.1389 14.25 12.0008 14.25C11.8628 14.25 11.7508 14.1381 11.7508 14C11.7508 13.8619 11.8628 13.75 12.0008 13.75C12.1389 13.75 12.2508 13.8619 12.2508 14ZM12.2508 18C12.2508 18.1381 12.1389 18.25 12.0008 18.25C11.8628 18.25 11.7508 18.1381 11.7508 18C11.7508 17.8619 11.8628 17.75 12.0008 17.75C12.1389 17.75 12.2508 17.8619 12.2508 18ZM7.75 14C7.75 14.1381 7.63807 14.25 7.5 14.25C7.36193 14.25 7.25 14.1381 7.25 14C7.25 13.8619 7.36193 13.75 7.5 13.75C7.63807 13.75 7.75 13.8619 7.75 14ZM7.75 18C7.75 18.1381 7.63807 18.25 7.5 18.25C7.36193 18.25 7.25 18.1381 7.25 18C7.25 17.8619 7.36193 17.75 7.5 17.75C7.63807 17.75 7.75 17.8619 7.75 18ZM16.75 14C16.75 14.1381 16.6381 14.25 16.5 14.25C16.3619 14.25 16.25 14.1381 16.25 14C16.25 13.8619 16.3619 13.75 16.5 13.75C16.6381 13.75 16.75 13.8619 16.75 14Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg>Next week</button>
    </div>
    <div class="ayy-calendar__header">
      <span class="ayy-calendar__title" aria-live="polite">October 2026</span>
      <button type="button" class="ayy-calendar__nav" aria-label="Previous month"><svg class="ayy-icon ayy-icon--directional" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M15 6C15 6 9.00001 10.4189 9 12C8.99999 13.5812 15 18 15 18" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg></button>
      <button type="button" class="ayy-calendar__nav" aria-label="Next month"><svg class="ayy-icon ayy-icon--directional" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M9.00005 6C9.00005 6 15 10.4189 15 12C15 13.5812 9 18 9 18" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg></button>
    </div>
    <div class="ayy-calendar__weekdays" aria-hidden="true"></div>
    <div class="ayy-calendar__grid"></div>
    <div class="ayy-calendar__footer">
      <label class="ayy-label" for="due-time">Time</label>
      <input type="time" class="ayy-input ayy-input--sm" id="due-time" style="inline-size: 8rem" value="09:30" />
    </div>
  </div>
</ayy-calendar>
```

React:

```tsx
import { ArrowRight02Icon, Calendar03Icon, Sun03Icon } from "@hugeicons/core-free-icons";
import { useState } from "react";
import { Calendar, Icon, Input, Label } from "@danitesler/ayywi/react";

export default function Example() {
  const [due, setDue] = useState<string | null>("2026-10-09");
  return (
    <Calendar
      value={due}
      onValueChange={setDue}
      presets={[
        { label: "Today", date: "+0", icon: <Icon icon={Sun03Icon} /> },
        { label: "Tomorrow", date: "+1", icon: <Icon icon={ArrowRight02Icon} directional /> },
        { label: "Next week", date: "+7", icon: <Icon icon={Calendar03Icon} /> },
      ]}
      footer={
        <>
          <Label htmlFor="due-time">Time</Label>
          <Input id="due-time" type="time" size="sm" defaultValue="09:30" style={{ inlineSize: "8rem" }} />
        </>
      }
    />
  );
}
```

## Calendar — Date picker in a form

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<!-- <ayy-popover> places the calendar under the trigger; <ayy-calendar> draws the month, writes the picked day into the
     trigger's .ayy-date-picker__value and the hidden input (name), and closes the popover. -->
<div class="ayy-field" style="inline-size: min(100%, 16rem)">
  <label class="ayy-label" for="check-in-html">Check-in</label>
  <ayy-popover align="start">
    <button type="button" class="ayy-input ayy-date-picker" id="check-in-html" popovertarget="check-in-calendar-html" aria-haspopup="dialog" aria-describedby="check-in-value-html check-in-hint-html"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M16 2V6M8 2V6" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M13 4H11C7.22876 4 5.34315 4 4.17157 5.17157C3 6.34315 3 8.22876 3 12V14C3 17.7712 3 19.6569 4.17157 20.8284C5.34315 22 7.22876 22 11 22H13C16.7712 22 18.6569 22 19.8284 20.8284C21 19.6569 21 17.7712 21 14V12C21 8.22876 21 6.34315 19.8284 5.17157C18.6569 4 16.7712 4 13 4Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M3 10H21" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M12.1258 14H12.0008M12.1258 18H12.0008M7.625 14H7.5M7.625 18H7.5M16.625 14H16.5M12.2508 14C12.2508 14.1381 12.1389 14.25 12.0008 14.25C11.8628 14.25 11.7508 14.1381 11.7508 14C11.7508 13.8619 11.8628 13.75 12.0008 13.75C12.1389 13.75 12.2508 13.8619 12.2508 14ZM12.2508 18C12.2508 18.1381 12.1389 18.25 12.0008 18.25C11.8628 18.25 11.7508 18.1381 11.7508 18C11.7508 17.8619 11.8628 17.75 12.0008 17.75C12.1389 17.75 12.2508 17.8619 12.2508 18ZM7.75 14C7.75 14.1381 7.63807 14.25 7.5 14.25C7.36193 14.25 7.25 14.1381 7.25 14C7.25 13.8619 7.36193 13.75 7.5 13.75C7.63807 13.75 7.75 13.8619 7.75 14ZM7.75 18C7.75 18.1381 7.63807 18.25 7.5 18.25C7.36193 18.25 7.25 18.1381 7.25 18C7.25 17.8619 7.36193 17.75 7.5 17.75C7.63807 17.75 7.75 17.8619 7.75 18ZM16.75 14C16.75 14.1381 16.6381 14.25 16.5 14.25C16.3619 14.25 16.25 14.1381 16.25 14C16.25 13.8619 16.3619 13.75 16.5 13.75C16.6381 13.75 16.75 13.8619 16.75 14Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg><span id="check-in-value-html" class="ayy-date-picker__value" data-placeholder="Pick a day"></span></button>
    <div class="ayy-popover" id="check-in-calendar-html" popover role="dialog" aria-label="Pick a day">
      <ayy-calendar min="2026-10-07" name="check-in">
        <div class="ayy-calendar">
          <div class="ayy-calendar__header">
            <span class="ayy-calendar__title" aria-live="polite"></span>
            <button type="button" class="ayy-calendar__nav" aria-label="Previous month"><svg class="ayy-icon ayy-icon--directional" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M15 6C15 6 9.00001 10.4189 9 12C8.99999 13.5812 15 18 15 18" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg></button>
            <button type="button" class="ayy-calendar__nav" aria-label="Next month"><svg class="ayy-icon ayy-icon--directional" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M9.00005 6C9.00005 6 15 10.4189 15 12C15 13.5812 9 18 9 18" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg></button>
          </div>
          <div class="ayy-calendar__weekdays" aria-hidden="true"></div>
          <div class="ayy-calendar__grid"></div>
        </div>
      </ayy-calendar>
    </div>
  </ayy-popover>
  <p class="ayy-field__hint" id="check-in-hint-html">Arrivals from 3 pm.</p>
</div>
```

React:

```tsx
import { useState } from "react";
import { DatePicker, Field, FieldHint, Label } from "@danitesler/ayywi/react";

export default function Example() {
  const [checkIn, setCheckIn] = useState<string | null>(null);
  return (
    <Field style={{ inlineSize: "min(100%, 16rem)" }}>
      <Label htmlFor="check-in">Check-in</Label>
      <DatePicker id="check-in" value={checkIn} onValueChange={setCheckIn} min="2026-10-07" placeholder="Pick a day" aria-describedby="check-in-hint" />
      <FieldHint id="check-in-hint">Arrivals from 3 pm.</FieldHint>
    </Field>
  );
}
```

---
Part of @danitesler/ayywi 0.0.1: load `dist/ayywi.min.css` (and `dist/elements.global.js` for the <ayy-*> elements). The rules every screen follows: [llms-full.txt#rules](../llms-full.txt#rules). Every component: [llms.txt](../llms.txt).
