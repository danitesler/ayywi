# Date & time picker

Category: Forms. Pick a single date, date range, time, or combined date and time, inline or in popovers (DatePicker, DateRangePicker, TimePicker, DateTimePicker). Six weeks month grids so height never jumps, one Tab stop with arrow keys, side-by-side or stacked month grids, connected ribbon wash bands for ranges, and scrollable hour/minute columns. Also called: date-time-picker, datetimepicker, date-picker, datepicker, date-range, daterange, time-picker, timepicker, calendar, month-grid.

**Classes**
- `.ayy-date-picker` — The single date picker trigger button, styled like a field with a calendar icon and the date. Opens a popover with the DatePickerGrid.
- `.ayy-date-picker__value` — The date text inside the trigger. Empty shows its data-placeholder, muted.
- `.ayy-date-picker-grid` — Root of the single month grid: a column of header, weekdays, and 42 day buttons. Day size follows data-density.
- `.ayy-date-picker-grid--full` — Fills its container's width (a phone screen, a bottom sheet); days grow up to 1.5× their size.
- `.ayy-date-picker-grid__header` — The month/year period buttons, then the two arrow buttons at the inline end.
- `.ayy-date-picker-grid__title` — Month and year heading container (e.g. "October 2026"), with aria-live="polite".
- `.ayy-date-picker-grid__period` — Month or year button inside the header that swaps the day grid for the month or year picker.
- `.ayy-date-picker-grid__nav` — Previous / next month, year, or year-range button with an aria-label and a directional arrow icon.
- `.ayy-date-picker-grid__weekdays` — Short weekday names over the columns, aria-hidden.
- `.ayy-date-picker-grid__grid` — The 42 day buttons, role="group" labelled by the month. One Tab stop: the picked day, else today, else the 1st has tabindex="0".
- `.ayy-date-picker-grid__day` — Day button with data-date="2026-10-07" and aria-label. aria-pressed="true" picked, aria-current="date" today, aria-disabled="true" outside min/max, data-outside for neighbouring months.
- `.ayy-date-picker-grid__months` — The 3×4 grid of 12 month buttons shown when the month header button is clicked.
- `.ayy-date-picker-grid__years` — The 3×4 grid of 12 year buttons shown when the year header button is clicked.
- `.ayy-date-picker-grid__cell` — Individual month or year button inside the 3×4 month or year picker grid.
- `.ayy-date-picker-grid__presets` — Row of quick dates above the month, in equal columns. role="group" with an aria-label ("Quick dates").
- `.ayy-date-picker-grid__preset` — A quick date button with an icon over a short label. aria-pressed="true" when it's the picked day.
- `.ayy-date-picker-grid__footer` — Under the month, after a hairline: action buttons like Clear, Today, or Done.
- `.ayy-date-range` — Root container: displays month grids side by side (or stacked on narrow viewports). Day size follows data-density.
- `.ayy-date-range__month` — One month container with a header, weekday labels, and a 42-day (or 3×4 month/year) grid.
- `.ayy-date-range__header` — The month/year period buttons and navigation arrow buttons.
- `.ayy-date-range__title` — Month and year heading container (e.g. "October 2026"), with aria-live="polite".
- `.ayy-date-range__period` — Month or year button inside the range header that swaps that column into a month or year picker.
- `.ayy-date-range__nav` — Previous / next month, year, or year-range button with directional arrow icon, aria-label, and focus ring.
- `.ayy-date-range__weekdays` — Row of short weekday names above the month grid, aria-hidden.
- `.ayy-date-range__grid` — The 42-day button grid, role="group" labelled by the month title.
- `.ayy-date-range__day` — Day button with data-date="2026-10-12" and full aria-label.
- `.ayy-date-range__months` — The 3×4 grid of 12 month buttons shown in a range column when its month button is clicked.
- `.ayy-date-range__years` — The 3×4 grid of 12 year buttons shown in a range column when its year button is clicked.
- `.ayy-date-range__cell` — Individual month or year button inside a date range column's month or year picker.
- `.ayy-date-range__day--range-start` — The start of the picked range: primary filled, rounded inline-start.
- `.ayy-date-range__day--range-end` — The end of the picked range: primary filled, rounded inline-end.
- `.ayy-date-range__day--in-range` — Days between start and end: wash-hover background forming a continuous connected band.
- `.ayy-date-range-picker` — Trigger button styled like an input field, opening a popover with the DateRange.
- `.ayy-date-range-picker__value` — Text displaying the formatted date range (e.g. "Oct 12, 2026 – Oct 18, 2026"). Empty shows its data-placeholder.
- `.ayy-date-range__footer` — Footer under the range months: action buttons like Clear and Today.
- `.ayy-time-picker` — Root container of the time picker: displays scrollable columns of hours, minutes, and optional period.
- `.ayy-time-picker__header` — Header container above the time picker columns holding manual time inputs.
- `.ayy-time-picker__inputs` — Flex row holding hour, minute, and optional period manual input controls.
- `.ayy-time-picker__input` — Two-digit numeric input for typing hours or minutes directly, syncing bidirectionally with the scrollable column.
- `.ayy-time-picker__separator` — Colon separator between hour and minute manual inputs.
- `.ayy-time-picker__period-btn` — Toggle button for switching AM/PM in 12-hour format manual input header.
- `.ayy-time-picker__columns` — Horizontal flex row holding the scrollable columns.
- `.ayy-time-picker__col` — Scrollable column of hour or minute buttons with top and bottom fade masks.
- `.ayy-time-picker__item` — Individual hour, minute, or period button. Keyboard-navigable with arrow keys.
- `.ayy-time-picker__item--selected` — The currently selected time item: primary filled with semibold text.
- `.ayy-time-picker-trigger` — Trigger button styled like an input field, opening a popover with the TimePicker.
- `.ayy-time-picker-trigger__value` — Text displaying the formatted time string (e.g. "14:30" or "02:30 PM"). Empty shows its data-placeholder.
- `.ayy-date-time-picker` — Compound container displaying DatePickerGrid and TimePicker side by side separated by a hairline divider.
- `.ayy-date-time-picker__date` — Container for the date picker grid section.
- `.ayy-date-time-picker__divider` — Vertical hairline divider between date and time sections.
- `.ayy-date-time-picker__time` — Container for the time picker columns section.
- `.ayy-date-time-picker__footer` — Footer below the combined date and time sections: action buttons like Clear and Today.
- `.ayy-date-time-picker-trigger` — Trigger button styled like an input field, opening a popover with the DateTimePicker.
- `.ayy-date-time-picker-trigger__value` — Text displaying formatted combined date and time string. Empty shows data-placeholder.

**States**
- `default` — Interactive month and year header buttons with two arrow buttons, muted weekday names, then six weeks of round day buttons (or a 3×4 month/year grid when toggled); time columns show hours and minutes.
- `hover` (`:hover on day buttons, month/year cells, period buttons, nav arrows, presets, time items`) — Wash-hover background, full text colour. In-range days darken slightly.
- `pressed` (`:active on day buttons, month/year cells, and time items`) — Button shrinks to 92–94% scale.
- `focus` (`:focus-visible on an interactive day, month/year cell, period button, arrow, or time item`) — 2px ring, 1px offset. Grid and columns are single Tab stops: arrow keys move the focused item.
- `disabled` (`[aria-disabled="true"] or :disabled`) — Dimmed and crossed out with not-allowed cursor; still focusable where needed for arrow navigation. Forced colours: GrayText.
- `selected` (`[aria-pressed="true"], [aria-selected="true"], range-start, range-end`) — Filled with primary colour and semibold text; in-range days form a continuous wash band. Forced colours: Highlight and HighlightText.
- `error` (`[aria-invalid="true"] on a trigger button`) — Danger border and ring on the trigger; display a FieldError below it.
- `loading` — doesn't apply: No loading look. If available dates or times load from a server, render a Skeleton with the shape of the picker.
- `today` (`[aria-current="date"]`) — A 1px inset ring and semibold text on today's date, current month, or current year. Forced colours: CanvasText outline.
- `outside` (`[data-outside]`) — A day from the preceding or following month: muted text or hidden in range mode.
- `empty` (`__value:empty`) — No date or time selected: trigger shows data-placeholder muted like an input's placeholder.

**Sizes**
- `sm` — Trigger buttons at Input sm.
- `md` (default) — Trigger buttons at Input md.
- `lg` — Trigger buttons at Input lg.
- Density — Day cells are the md control height (32px compact, 40 comfortable, 44 touch); time items follow md control height; nav buttons are sm control height.
- Width — Single date fits 7 days; side-by-side range fits two month grids (approx 36rem); combined date-time fits month plus time columns (approx 30rem).

**Custom element** `<ayy-date-picker>` (@danitesler/ayywi/elements) — 
- attribute `value`: The picked value (ISO date, time, or ISO date-time string).
- attribute `min`: Earliest pickable ISO date.
- attribute `max`: Latest pickable ISO date.
- event `ayy-select`: { value } when a selection is made.

**Custom element** `<ayy-date-range>` (@danitesler/ayywi/elements) — 
- attribute `start`: Range start ISO date.
- attribute `end`: Range end ISO date.
- attribute `min`: Earliest pickable ISO date.
- attribute `max`: Latest pickable ISO date.
- attribute `months`: Number of months to show side-by-side (default 2).
- event `ayy-select`: { value } when a range is picked.

**Custom element** `<ayy-time-picker>` (@danitesler/ayywi/elements) — 
- attribute `value`: The picked time string.
- attribute `format`: "12h" | "24h" — time format.
- attribute `step`: Minute step between items.
- event `ayy-select`: { value } when a time is picked.

**Custom element** `<ayy-date-time-picker>` (@danitesler/ayywi/elements) — 
- attribute `value`: The picked ISO date-time string.
- attribute `min`: Earliest pickable ISO date.
- attribute `max`: Latest pickable ISO date.
- attribute `format`: "12h" | "24h" — time format.
- attribute `step`: Minute step between items.
- attribute `week-start`: Weekday index (0=Sun, 1=Mon, 6=Sat) to start weeks on.
- event `ayy-select`: { value } when date or time changes.

**React** — `import { DatePicker, DatePickerGrid, DateRangePicker, DateRange, TimePicker, TimePickerTrigger, DateTimePicker, DateTimePickerTrigger } from "@danitesler/ayywi/react";`
- `<DatePickerGrid>` renders <div class="ayy-date-picker-grid">…<div class="ayy-date-picker-grid__grid" role="group">. Props: `value` string | null — the picked ISO day; `defaultValue` string | null — initial picked day; `onValueChange` (date: string) => void; `min` string — earliest pickable day; `max` string — latest pickable day; `today` string — override today; `weekStart` Weekday — first day of the week (0 = Sunday); `locale` string — locale for month and day names; `full` boolean — fill container width; `previousLabel` string — accessible name of previous month arrow; `nextLabel` string — accessible name of next month arrow; `presets` DatePickerPreset[] — shortcuts above the month; `presetsLabel` string — accessible name of the presets group; `showActions` boolean — whether to show Clear and Today action buttons in a footer; `clearLabel` string — label for Clear button; `todayLabel` string — label for Today button; `onClear` () => void — callback when Clear is clicked; `onToday` () => void — callback when Today is clicked; `footer` ReactNode — content under the month
- `<DatePicker>` renders <button class="ayy-input ayy-date-picker" aria-haspopup="dialog"> + <div class="ayy-popover" popover> with DatePickerGrid. Props: `value` string | null — the ISO day; `defaultValue` string | null — initial ISO day; `onValueChange` (date: string) => void — popover closes after it; `placeholder` string — shown while empty. Default "Pick a date"; `format` (date: string) => string — trigger's text formatter; `min` string — earliest pickable day; `max` string — latest pickable day; `today` string — override today; `weekStart` Weekday — first day of the week; `locale` string — locale for month and day names; `size` "sm" | "md" | "lg" — trigger button size; `name` string — a hidden input carries the ISO day; `presets` DatePickerPreset[] — shortcuts above the month; `showActions` boolean — whether to show Clear and Today action buttons in the popover footer. Default true; `clearLabel` string — label for Clear button; `todayLabel` string — label for Today button; `onClear` () => void — callback when Clear is clicked; `onToday` () => void — callback when Today is clicked; `footer` ReactNode — content under the month
- `<DateRange>` renders <div class="ayy-date-range"> with side-by-side month grids. Props: `value` [string, string] | null — start and end ISO dates; `defaultValue` [string, string] | null — initial range; `onValueChange` (range: [string, string] | null) => void — null when Clear empties it; `months` number — number of months shown side-by-side; `min` string — earliest pickable day; `max` string — latest pickable day; `today` string — override today; `weekStart` Weekday — first day of the week; `locale` string — locale for month and day names; `previousLabel` string — accessible name of previous month arrow; `nextLabel` string — accessible name of next month arrow; `showActions` boolean — whether to show Clear and Today action buttons in a footer; `clearLabel` string — label for Clear button; `todayLabel` string — label for Today button; `onClear` () => void — callback when Clear is clicked; `onToday` () => void — callback when Today is clicked; `footer` ReactNode — content under the range months
- `<DateRangePicker>` renders <button class="ayy-input ayy-date-range-picker" aria-haspopup="dialog"> + <div class="ayy-popover" popover> with DateRange. Props: `value` [string, string] | null — start and end ISO dates; `defaultValue` [string, string] | null — initial range; `onValueChange` (range: [string, string] | null) => void — null when Clear empties it; `placeholder` string — shown while empty; `format` (range: [string, string]) => string — trigger text formatter; `months` number — number of months shown side-by-side; `min` string — earliest pickable day; `max` string — latest pickable day; `today` string — override today; `weekStart` Weekday — first day of the week; `locale` string — locale for month and day names; `size` "sm" | "md" | "lg" — trigger button size; `name` string — hidden inputs carry start and end dates; `showActions` boolean — whether to show Clear and Today action buttons in the popover footer. Default true; `clearLabel` string — label for Clear button; `todayLabel` string — label for Today button; `onClear` () => void — callback when Clear is clicked; `onToday` () => void — callback when Today is clicked; `footer` ReactNode — content under the range months
- `<TimePicker>` renders <div class="ayy-time-picker"> with scrollable columns of hours and minutes. Props: `value` string — time string ("14:30" or "02:30 PM"); `defaultValue` string — initial time string; `onValueChange` (time: string) => void; `format` "12h" | "24h" — clock format; `step` number — minute step between options; `manualInput` boolean — whether to show manual numeric inputs at the top
- `<TimePickerTrigger>` renders <button class="ayy-input ayy-time-picker-trigger" aria-haspopup="dialog"> + <div class="ayy-popover" popover> with TimePicker. Props: `value` string — time string; `defaultValue` string — initial time string; `onValueChange` (time: string) => void; `placeholder` string — shown while empty; `format` "12h" | "24h" — clock format; `step` number — minute step between options; `size` "sm" | "md" | "lg" — trigger button size; `name` string — hidden input carries time string
- `<DateTimePicker>` renders <div class="ayy-date-time-picker"> with DatePickerGrid and TimePicker side-by-side. Props: `value` string — ISO date-time ("2026-10-14T14:30"); `defaultValue` string — initial date-time string; `onValueChange` (dateTime: string) => void; `format` "12h" | "24h" — time format; `step` number — minute step; `min` string — earliest pickable date; `max` string — latest pickable date; `today` string — override today; `weekStart` Weekday — first day of the week; `locale` string — locale for formatting; `showActions` boolean — whether to show Clear and Today action buttons in a footer; `clearLabel` string — label for Clear button; `todayLabel` string — label for Today button; `onClear` () => void — callback when Clear is clicked; `onToday` () => void — callback when Today is clicked; `footer` ReactNode — content under the compound picker
- `<DateTimePickerTrigger>` renders <button class="ayy-input ayy-date-time-picker-trigger" aria-haspopup="dialog"> + <div class="ayy-popover" popover> with DateTimePicker. Props: `value` string — ISO date-time string; `defaultValue` string — initial date-time string; `onValueChange` (dateTime: string) => void; `placeholder` string — shown while empty; `format` "12h" | "24h" — time format; `step` number — minute step; `min` string — earliest pickable date; `max` string — latest pickable date; `today` string — override today; `weekStart` Weekday — first day of the week; `locale` string — locale for formatting; `size` "sm" | "md" | "lg" — trigger button size; `name` string — hidden input carries date-time string; `showActions` boolean — whether to show Clear and Today action buttons in the popover footer. Default true; `clearLabel` string — label for Clear button; `todayLabel` string — label for Today button; `onClear` () => void — callback when Clear is clicked; `onToday` () => void — callback when Today is clicked; `footer` ReactNode — content under the compound picker

**Accessibility**
- Grids and time columns are single Tab stops. Arrow keys move selection within grids or columns.
- State is reflected in aria-pressed, aria-selected, aria-current="date", and aria-disabled.
- Month headers use aria-live="polite" so page changes are announced to screen readers.
- Buttons have full accessible labels (e.g. "Wednesday, 7 October 2026").
- High contrast mode (forced-colors: active) renders solid system borders and highlight backgrounds.

**Do**
- Use DatePicker or DatePickerGrid for picking a single date near today.
- Use DateRange or DateRangePicker for date spans (stays, bookings, analytics intervals).
- Use TimePicker or TimePickerTrigger for picking discrete hours and minutes.
- Use DateTimePicker or DateTimePickerTrigger when both date and time must be chosen together.

**Don't**
- Don't build custom month grids or time dropdowns by hand.
- Don't use DatePicker for birth dates (native <input type="date"> is faster to type).
- Don't put a single date picker into a full-screen modal; keep it in a popover.

## Date & time picker — Date picker

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<!-- <ayy-popover> places the date picker grid under the trigger; <ayy-date-picker> draws the month,
     writes the picked day into the trigger's .ayy-date-picker__value, and closes the popover. -->
<div class="ayy-field" style="inline-size: min(100%, 16rem)">
  <label class="ayy-label" for="check-in-html">Check-in</label>
  <ayy-popover align="start">
    <button type="button" class="ayy-input ayy-date-picker" id="check-in-html" popovertarget="check-in-popover-html" aria-haspopup="dialog" aria-describedby="check-in-value-html check-in-hint-html">
      <svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M16 2V6M8 2V6" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M13 4H11C7.22876 4 5.34315 4 4.17157 5.17157C3 6.34315 3 8.22876 3 12V14C3 17.7712 3 19.6569 4.17157 20.8284C5.34315 22 7.22876 22 11 22H13C16.7712 22 18.6569 22 19.8284 20.8284C21 19.6569 21 17.7712 21 14V12C21 8.22876 21 6.34315 19.8284 5.17157C18.6569 4 16.7712 4 13 4Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M3 10H21" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M12.1258 14H12.0008M12.1258 18H12.0008M7.625 14H7.5M7.625 18H7.5M16.625 14H16.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg>
      <span id="check-in-value-html" class="ayy-date-picker__value" data-placeholder="Pick a day"></span>
    </button>
    <div class="ayy-popover" id="check-in-popover-html" popover role="dialog" aria-label="Pick a day">
      <ayy-date-picker min="2026-10-07" name="check-in">
        <div class="ayy-date-picker-grid">
          <div class="ayy-date-picker-grid__header">
            <span class="ayy-date-picker-grid__title" aria-live="polite"></span>
            <button type="button" class="ayy-date-picker-grid__nav" aria-label="Previous month"><svg class="ayy-icon ayy-icon--directional" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M15 6C15 6 9.00001 10.4189 9 12C8.99999 13.5812 15 18 15 18" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg></button>
            <button type="button" class="ayy-date-picker-grid__nav" aria-label="Next month"><svg class="ayy-icon ayy-icon--directional" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M9.00005 6C9.00005 6 15 10.4189 15 12C15 13.5812 9 18 9 18" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg></button>
          </div>
          <div class="ayy-date-picker-grid__weekdays" aria-hidden="true"></div>
          <div class="ayy-date-picker-grid__grid"></div>
          <div class="ayy-date-picker-grid__footer">
            <button type="button" class="ayy-button ayy-button--ghost ayy-button--sm">Clear</button>
            <button type="button" class="ayy-button ayy-button--secondary ayy-button--sm">Today</button>
          </div>
        </div>
      </ayy-date-picker>
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
      <DatePicker
        id="check-in"
        value={checkIn}
        onValueChange={setCheckIn}
        min="2026-10-07"
        placeholder="Pick a day"
        aria-describedby="check-in-hint"
      />
      <FieldHint id="check-in-hint">Arrivals from 3 pm.</FieldHint>
    </Field>
  );
}
```

## Date & time picker — Date range picker

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<!-- <ayy-popover> places the side-by-side month grids under the trigger;
     <ayy-date-range> draws two months, wires start/end clicks and hover preview,
     and updates the trigger's .ayy-date-range-picker__value. -->
<div class="ayy-field" style="inline-size: min(100%, 20rem)">
  <label class="ayy-label" for="stay-dates-html">Dates of stay</label>
  <ayy-popover align="start">
    <button type="button" class="ayy-input ayy-date-range-picker" id="stay-dates-html" popovertarget="stay-dates-popover-html" aria-haspopup="dialog" aria-describedby="stay-dates-value-html stay-dates-hint-html">
      <svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M16 2V6M8 2V6" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M13 4H11C7.22876 4 5.34315 4 4.17157 5.17157C3 6.34315 3 8.22876 3 12V14C3 17.7712 3 19.6569 4.17157 20.8284C5.34315 22 7.22876 22 11 22H13C16.7712 22 18.6569 22 19.8284 20.8284C21 19.6569 21 17.7712 21 14V12C21 8.22876 21 6.34315 19.8284 5.17157C18.6569 4 16.7712 4 13 4Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M3 10H21" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg>
      <span id="stay-dates-value-html" class="ayy-date-range-picker__value" data-placeholder="Pick check-in and check-out">12 Oct 2026 – 18 Oct 2026</span>
    </button>
    <div class="ayy-popover" id="stay-dates-popover-html" popover role="dialog" aria-label="Pick check-in and check-out">
      <ayy-date-range start="2026-10-12" end="2026-10-18" min="2026-10-01" name="stay">
        <div class="ayy-date-range">
          <div class="ayy-date-range__month">
            <div class="ayy-date-range__header">
              <button type="button" class="ayy-date-range__nav" aria-label="Previous month"><svg class="ayy-icon ayy-icon--directional" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M15 6C15 6 9.00001 10.4189 9 12C8.99999 13.5812 15 18 15 18" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg></button>
              <span class="ayy-date-range__title" aria-live="polite"></span>
              <span class="ayy-date-range__nav" aria-hidden="true" style="visibility: hidden"></span>
            </div>
            <div class="ayy-date-range__weekdays" aria-hidden="true"></div>
            <div class="ayy-date-range__grid"></div>
          </div>
          <div class="ayy-date-range__month">
            <div class="ayy-date-range__header">
              <span class="ayy-date-range__nav" aria-hidden="true" style="visibility: hidden"></span>
              <span class="ayy-date-range__title" aria-live="polite"></span>
              <button type="button" class="ayy-date-range__nav" aria-label="Next month"><svg class="ayy-icon ayy-icon--directional" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M9.00005 6C9.00005 6 15 10.4189 15 12C15 13.5812 9 18 9 18" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg></button>
            </div>
            <div class="ayy-date-range__weekdays" aria-hidden="true"></div>
            <div class="ayy-date-range__grid"></div>
          </div>
          <div class="ayy-date-range__footer">
            <button type="button" class="ayy-button ayy-button--ghost ayy-button--sm">Clear</button>
            <button type="button" class="ayy-button ayy-button--secondary ayy-button--sm">Today</button>
          </div>
        </div>
      </ayy-date-range>
    </div>
  </ayy-popover>
  <p class="ayy-field__hint" id="stay-dates-hint-html">Minimum 2-night stay.</p>
</div>
```

React:

```tsx
import { useState } from "react";
import { DateRangePicker, Field, FieldHint, Label } from "@danitesler/ayywi/react";

export default function Example() {
  const [range, setRange] = useState<[string, string] | null>(["2026-10-12", "2026-10-18"]);
  return (
    <Field style={{ inlineSize: "min(100%, 20rem)" }}>
      <Label htmlFor="stay-dates">Dates of stay</Label>
      <DateRangePicker
        id="stay-dates"
        value={range}
        onValueChange={setRange}
        min="2026-10-01"
        placeholder="Pick check-in and check-out"
        aria-describedby="stay-dates-hint"
      />
      <FieldHint id="stay-dates-hint">Minimum 2-night stay.</FieldHint>
    </Field>
  );
}
```

## Date & time picker — Time picker

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<!-- <ayy-popover> places the time columns under the trigger;
     <ayy-time-picker> draws hours and minutes, wires arrow key navigation,
     and updates the trigger's .ayy-time-picker-trigger__value. -->
<div class="ayy-field" style="inline-size: min(100%, 16rem)">
  <label class="ayy-label" for="meeting-time-html">Meeting time</label>
  <ayy-popover align="start">
    <button type="button" class="ayy-input ayy-time-picker-trigger" id="meeting-time-html" popovertarget="meeting-time-popover-html" aria-haspopup="dialog" aria-describedby="meeting-time-value-html meeting-time-hint-html">
      <svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5"></circle><path d="M12 8V12L14 14" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg>
      <span id="meeting-time-value-html" class="ayy-time-picker-trigger__value" data-placeholder="Pick a time">09:30</span>
    </button>
    <div class="ayy-popover" id="meeting-time-popover-html" popover role="dialog" aria-label="Pick a time">
      <ayy-time-picker value="09:30" format="24h" step="15" name="meeting-time">
        <div class="ayy-time-picker"></div>
      </ayy-time-picker>
    </div>
  </ayy-popover>
  <p class="ayy-field__hint" id="meeting-time-hint-html">Select a start time for the standup.</p>
</div>
```

React:

```tsx
import { useState } from "react";
import { Field, FieldHint, Label, TimePickerTrigger } from "@danitesler/ayywi/react";

export default function Example() {
  const [time, setTime] = useState<string>("09:30");
  return (
    <Field style={{ inlineSize: "min(100%, 16rem)" }}>
      <Label htmlFor="meeting-time">Meeting time</Label>
      <TimePickerTrigger
        id="meeting-time"
        value={time}
        onValueChange={setTime}
        placeholder="Pick a time"
        format="24h"
        step={15}
        aria-describedby="meeting-time-hint"
      />
      <FieldHint id="meeting-time-hint">Select a start time for the standup.</FieldHint>
    </Field>
  );
}
```

## Date & time picker — Date & time picker

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<!-- <ayy-popover> places the compound date & time picker under the trigger;
     <ayy-date-time-picker> draws the month grid and time columns side-by-side. -->
<div class="ayy-field" style="inline-size: min(100%, 20rem)">
  <label class="ayy-label" for="departure-time-html">Flight departure</label>
  <ayy-popover align="start">
    <button type="button" class="ayy-input ayy-date-time-picker-trigger" id="departure-time-html" popovertarget="departure-popover-html" aria-haspopup="dialog" aria-describedby="departure-value-html departure-hint-html">
      <svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M16 2V6M8 2V6" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M13 4H11C7.22876 4 5.34315 4 4.17157 5.17157C3 6.34315 3 8.22876 3 12V14C3 17.7712 3 19.6569 4.17157 20.8284C5.34315 22 7.22876 22 11 22H13C16.7712 22 18.6569 22 19.8284 20.8284C21 19.6569 21 17.7712 21 14V12C21 8.22876 21 6.34315 19.8284 5.17157C18.6569 4 16.7712 4 13 4Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M3 10H21" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M12.1258 14H12.0008M12.1258 18H12.0008M7.625 14H7.5M7.625 18H7.5M16.625 14H16.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg>
      <span id="departure-value-html" class="ayy-date-time-picker-trigger__value" data-placeholder="Pick date & time">14 Oct 2026, 14:30</span>
    </button>
    <div class="ayy-popover" id="departure-popover-html" popover role="dialog" aria-label="Pick date & time">
      <ayy-date-time-picker value="2026-10-14T14:30" format="24h" step="15" name="departure" show-actions>
        <div class="ayy-date-time-picker"></div>
      </ayy-date-time-picker>
    </div>
  </ayy-popover>
  <p class="ayy-field__hint" id="departure-hint-html">Check in at least 2 hours before.</p>
</div>
```

React:

```tsx
import { useState } from "react";
import { DateTimePickerTrigger, Field, FieldHint, Label } from "@danitesler/ayywi/react";

export default function Example() {
  const [departure, setDeparture] = useState<string>("2026-10-14T14:30");
  return (
    <Field style={{ inlineSize: "min(100%, 20rem)" }}>
      <Label htmlFor="departure-time">Flight departure</Label>
      <DateTimePickerTrigger
        id="departure-time"
        value={departure}
        onValueChange={setDeparture}
        placeholder="Pick date & time"
        format="24h"
        step={15}
        aria-describedby="departure-hint"
      />
      <FieldHint id="departure-hint">Check in at least 2 hours before.</FieldHint>
    </Field>
  );
}
```

## Date & time picker — Month grid with presets

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<!-- Inline DatePickerGrid with quick presets and footer action buttons -->
<ayy-date-picker value="2026-10-09">
  <div class="ayy-date-picker-grid">
    <div class="ayy-date-picker-grid__presets" role="group" aria-label="Quick dates">
      <button type="button" class="ayy-date-picker-grid__preset" data-date="+0" aria-pressed="false">
        <svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="1.5"></circle><path d="M12 2V4M12 20V22M4 12H2M22 12H20M19.0711 4.92893L17.6569 6.34315M6.34315 17.6569L4.92893 19.0711M19.0711 19.0711L17.6569 17.6569M6.34315 6.34315L4.92893 4.92893" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path></svg>
        <span>Today</span>
      </button>
      <button type="button" class="ayy-date-picker-grid__preset" data-date="+1" aria-pressed="false">
        <svg class="ayy-icon ayy-icon--directional" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 12H20M20 12L14 6M20 12L14 18" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg>
        <span>Tomorrow</span>
      </button>
      <button type="button" class="ayy-date-picker-grid__preset" data-date="+7" aria-pressed="true">
        <svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M16 2V6M8 2V6" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M13 4H11C7.22876 4 5.34315 4 4.17157 5.17157C3 6.34315 3 8.22876 3 12V14C3 17.7712 3 19.6569 4.17157 20.8284C5.34315 22 7.22876 22 11 22H13C16.7712 22 18.6569 22 19.8284 20.8284C21 19.6569 21 17.7712 21 14V12C21 8.22876 21 6.34315 19.8284 5.17157C18.6569 4 16.7712 4 13 4Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M3 10H21" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg>
        <span>Next week</span>
      </button>
    </div>
    <div class="ayy-date-picker-grid__header">
      <h2 class="ayy-date-picker-grid__title" aria-live="polite">October 2026</h2>
      <button type="button" class="ayy-date-picker-grid__nav" aria-label="Previous month"><svg class="ayy-icon ayy-icon--directional" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M15 6C15 6 9.00001 10.4189 9 12C8.99999 13.5812 15 18 15 18" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg></button>
      <button type="button" class="ayy-date-picker-grid__nav" aria-label="Next month"><svg class="ayy-icon ayy-icon--directional" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M9.00005 6C9.00005 6 15 10.4189 15 12C15 13.5812 9 18 9 18" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg></button>
    </div>
    <div class="ayy-date-picker-grid__weekdays" aria-hidden="true"></div>
    <div class="ayy-date-picker-grid__grid"></div>
    <div class="ayy-date-picker-grid__footer">
      <button type="button" class="ayy-button ayy-button--ghost ayy-button--sm">Clear</button>
      <button type="button" class="ayy-button ayy-button--secondary ayy-button--sm">Today</button>
    </div>
  </div>
</ayy-date-picker>
```

React:

```tsx
import { ArrowRight02Icon, Calendar03Icon, Sun03Icon } from "@hugeicons/core-free-icons";
import { useState } from "react";
import { Button, DatePickerGrid, Icon } from "@danitesler/ayywi/react";

export default function Example() {
  const [due, setDue] = useState<string | null>("2026-10-09");
  return (
    <DatePickerGrid
      value={due}
      onValueChange={setDue}
      presets={[
        { label: "Today", date: "+0", icon: <Icon icon={Sun03Icon} /> },
        { label: "Tomorrow", date: "+1", icon: <Icon icon={ArrowRight02Icon} directional /> },
        { label: "Next week", date: "+7", icon: <Icon icon={Calendar03Icon} /> },
      ]}
      footer={
        <>
          <Button size="sm" variant="ghost" onClick={() => setDue(null)}>
            Clear
          </Button>
          <Button size="sm" variant="secondary" onClick={() => setDue("2026-10-15")}>
            Today
          </Button>
        </>
      }
    />
  );
}
```

---
Part of @danitesler/ayywi 0.1.1: load `dist/ayywi.min.css` (and `dist/elements.global.js` for the <ayy-*> elements). The rules every screen follows: [llms-full.txt#rules](../llms-full.txt#rules). Every component: [llms.txt](../llms.txt).
