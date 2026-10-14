# Date range

Category: Forms. A two-month (or multi-month) calendar to pick a start and end date range, inline or in a popover (DateRangePicker). Side-by-side or stacked month grids, range start and end filled, days in between highlighted in a continuous wash band. Also called: date-range, daterange, date-range-picker, range-calendar, date-range-input, daterangepicker.

**Classes**
- `.ayy-date-range` — Root container: displays month grids side by side (or stacked on narrow viewports). Day size follows data-density.
- `.ayy-date-range__month` — One month container with a header, weekday labels, and a 42-day grid.
- `.ayy-date-range__header` — The month title and navigation arrow buttons.
- `.ayy-date-range__title` — Month and year heading (e.g. "October 2026"), with aria-live="polite".
- `.ayy-date-range__nav` — Previous / next month button with directional arrow icon, aria-label, and focus ring.
- `.ayy-date-range__weekdays` — Row of short weekday names above the month grid, aria-hidden.
- `.ayy-date-range__grid` — The 42-day button grid, role="group" labelled by the month title.
- `.ayy-date-range__day` — Day button with data-date="2026-10-12" and full aria-label.
- `.ayy-date-range__day--range-start` — The start of the picked range: primary filled, rounded inline-start.
- `.ayy-date-range__day--range-end` — The end of the picked range: primary filled, rounded inline-end.
- `.ayy-date-range__day--in-range` — Days between start and end: wash-hover background forming a continuous connected band.
- `.ayy-date-range-picker` — Trigger button styled like an input field, opening a popover with the DateRange.
- `.ayy-date-range-picker__value` — Text displaying the formatted date range (e.g. "Oct 12, 2026 – Oct 18, 2026"). Empty shows its data-placeholder.

**States**
- `default` — Two side-by-side month grids with month titles, weekday names, and round day buttons; days outside the month are muted.
- `hover` (`.ayy-date-range__day:hover, .ayy-date-range__nav:hover`) — Wash-hover background, full text colour. In-range days darken slightly.
- `pressed` (`.ayy-date-range__day:active`) — Day button shrinks to 94% scale.
- `focus` (`:focus-visible on a day button or nav arrow`) — 2px ring, 1px offset. The grid is one Tab stop: arrow keys move the focused day.
- `disabled` (`.ayy-date-range__day[aria-disabled="true"] (before min, after max)`) — Dimmed and crossed out with a not-allowed cursor; still focusable so arrows can traverse it. Forced colours: GrayText.
- `selected` (`.ayy-date-range__day--range-start, .ayy-date-range__day--range-end, .ayy-date-range__day--in-range`) — Start and end days are filled with primary colour; in-range days are highlighted with a continuous wash-hover band. Forced colours: Highlight and HighlightText.
- `error` — doesn't apply: A date range cannot hold an invalid date: days outside min/max are disabled. For form validation, apply aria-invalid to the DateRangePicker button and display a FieldError below it.
- `loading` — doesn't apply: No loading look. If available date ranges are fetched from a server, render a Skeleton with the shape of the date range until loaded.
- `today` (`.ayy-date-range__day[aria-current="date"]`) — A 1px inset ring and semibold text. Forced colours: CanvasText outline.
- `outside` (`.ayy-date-range__day[data-outside]`) — A day from the preceding or following month: muted text.
- `empty` (`.ayy-date-range-picker__value:empty`) — No range selected: shows data-placeholder muted like an input's placeholder.

**Sizes**
- `sm` — DateRangePicker button at Input sm.
- `md` (default) — DateRangePicker button at Input md.
- `lg` — DateRangePicker button at Input lg.
- Density — Day cells are the md control height (32px compact, 40 comfortable, 44 touch); nav buttons are the sm control height.
- Width — Side-by-side months fit two month grids (approx 36rem), wrapping to a stacked single-column layout on viewports narrower than 48rem.

**JS (framework-free)**: dateRangeMonth({ month, range?, hoverDate?, pendingStart?, today?, min?, max?, weekStart? }) → 42 days to draw; dateRangeLabels(locale?) → { month, day, weekdays }; dateRangeKeyTarget(key, from, { weekStart?, rtl?, shift? }) → day a key moves to; connectDateRange(root, { value?, months?, min?, max?, weekStart?, locale?, onSelect? }) → { setValue, update, focus, destroy } draws and wires the months on plain markup; formatDateRange(start, end, locale?) → formatted range string; isInRange(date, start, end) → boolean; isSameDay(a, b) → boolean. Date helpers on ISO days: addDays, addMonths, startOfMonth, startOfWeek, todayIso, parseIsoDate, toIsoDate, formatDate, localeWeekStart. dateRangePreviousIcon, dateRangeNextIcon, dateRangePickerIcon (SVG markup).

**Custom element** `<ayy-date-range>` (@danitesler/ayywi/elements) — 
- attribute `start`: Start of the picked range, ISO ("2026-10-12"). Updated when a range is picked.
- attribute `end`: End of the picked range, ISO ("2026-10-18"). Updated when a range is picked.
- attribute `min`: Earliest pickable day, ISO.
- attribute `max`: Latest pickable day, ISO.
- attribute `months`: Number of months shown side by side. Default 2.
- attribute `week-start`: First column, 0 = Sunday … 6 = Saturday. Default: the locale's.
- attribute `locale`: Language of the month and day names. Default: the browser's.
- attribute `name`: Form name prefix: hidden inputs (<name>-start, <name>-end) carry the range.
- event `ayy-select`: { value, start, end } when a range selection completes, value a [start, end] ISO pair.

**React** — `import { DateRange, DateRangePicker } from "@danitesler/ayywi/react";`
- `<DateRange>` renders <div class="ayy-date-range">…<div class="ayy-date-range__month">…<div class="ayy-date-range__grid" role="group">. Props: `value / defaultValue` [string, string] | null — the picked start and end ISO dates; `onValueChange` (range: [string, string]) => void; `months` number — number of months to display side-by-side. Default 2; `min / max` string — earliest and latest pickable ISO days; outside days are disabled; `today` string — override today's date (testing, timezone); `weekStart` 0–6, 0 = Sunday. Default: the locale's first day of week; `locale` string — month and day names language. Default: browser locale; `previousLabel / nextLabel` string — accessible names for navigation arrows. Default "Previous month" / "Next month"
- `<DateRangePicker>` renders <button class="ayy-input ayy-date-range-picker" aria-haspopup="dialog"> + <div class="ayy-popover" popover> with a DateRange. Props: `value / defaultValue` [string, string] | null — the picked start and end ISO dates; `onValueChange` (range: [string, string]) => void — called when range selection completes; closes the popover; `placeholder` string — shown when no range is selected. Default "Pick date range"; `format` (range: [string, string]) => string — custom trigger text formatter; `months` number — number of months to display. Default 2; `min / max` string — earliest and latest pickable ISO days; `today` string — override today; `weekStart` 0–6 — first day of week; `locale` string — browser locale; `size` "sm" | "md" | "lg" — trigger button size; `name` string — form name: hidden inputs carry start and end dates

**Accessibility**
- The grid is one Tab stop. Arrow keys move the focused day by one day (mirrored in RTL) or one week; Enter or Space picks the date.
- Every day button is named in full by its aria-label (e.g. "Wednesday, 14 October 2026"); aria-pressed indicates selection, aria-current="date" marks today.
- Days outside min/max are aria-disabled, not disabled, so keyboard navigation can move across them without trapping focus.
- DateRangePicker trigger is named by its associated label; the selected range or placeholder is read as its description.
- Range start and end use solid primary fill, while in-range days use a subtle wash-hover band. In Windows High Contrast mode, start/end use system Highlight and in-range days use a 1px Highlight border.

**Do**
- Use DateRange when selecting a contiguous span of dates, such as hotel stays, travel bookings, billing periods, or report filter dates.
- Use DateRangePicker for form fields where screen real estate is limited, popping up the two-month view on demand.
- Provide sensible min and max boundaries to prevent selection of impossible dates (e.g. past dates for reservations).
- Display two months side by side by default so users can easily pick ranges spanning across month boundaries.

**Don't**
- Don't use DateRange to pick a single date — use Calendar or DatePicker instead.
- Don't use DateRange for non-contiguous multi-date selections (e.g. picking every Tuesday) — use a multi-select day picker or list.
- Don't hide or disable navigation buttons to lock months; use min and max props instead.
- Don't rely on color alone to indicate the range: start and end days have distinct border-radii and aria-pressed attributes.

## Date range — Date range picker in a form

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<!-- <ayy-popover> places the range calendar under the trigger; <ayy-date-range> draws the two months, writes the picked
     range into the trigger's .ayy-date-range-picker__value, and closes the popover when both dates are picked. -->
<div class="ayy-field" style="inline-size: min(100%, 20rem)">
  <label class="ayy-label" for="stay-dates-html">Dates of stay</label>
  <ayy-popover align="start">
    <button type="button" class="ayy-input ayy-date-range-picker" id="stay-dates-html" popovertarget="stay-dates-popover-html" aria-haspopup="dialog" aria-describedby="stay-dates-value-html stay-dates-hint-html"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M16 2V6M8 2V6" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M13 4H11C7.22876 4 5.34315 4 4.17157 5.17157C3 6.34315 3 8.22876 3 12V14C3 17.7712 3 19.6569 4.17157 20.8284C5.34315 22 7.22876 22 11 22H13C16.7712 22 18.6569 22 19.8284 20.8284C21 19.6569 21 17.7712 21 14V12C21 8.22876 21 6.34315 19.8284 5.17157C18.6569 4 16.7712 4 13 4Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M3 10H21" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M12.1258 14H12.0008M12.1258 18H12.0008M7.625 14H7.5M7.625 18H7.5M16.625 14H16.5M12.2508 14C12.2508 14.1381 12.1389 14.25 12.0008 14.25C11.8628 14.25 11.7508 14.1381 11.7508 14C11.7508 13.8619 11.8628 13.75 12.0008 13.75C12.1389 13.75 12.2508 13.8619 12.2508 14ZM12.2508 18C12.2508 18.1381 12.1389 18.25 12.0008 18.25C11.8628 18.25 11.7508 18.1381 11.7508 18C11.7508 17.8619 11.8628 17.75 12.0008 17.75C12.1389 17.75 12.2508 17.8619 12.2508 18ZM7.75 14C7.75 14.1381 7.63807 14.25 7.5 14.25C7.36193 14.25 7.25 14.1381 7.25 14C7.25 13.8619 7.36193 13.75 7.5 13.75C7.63807 13.75 7.75 13.8619 7.75 14ZM7.75 18C7.75 18.1381 7.63807 18.25 7.5 18.25C7.36193 18.25 7.25 18.1381 7.25 18C7.25 17.8619 7.36193 17.75 7.5 17.75C7.63807 17.75 7.75 17.8619 7.75 18ZM16.75 14C16.75 14.1381 16.6381 14.25 16.5 14.25C16.3619 14.25 16.25 14.1381 16.25 14C16.25 13.8619 16.3619 13.75 16.5 13.75C16.6381 13.75 16.75 13.8619 16.75 14Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg><span id="stay-dates-value-html" class="ayy-date-range-picker__value" data-placeholder="Pick check-in and check-out"></span></button>
    <div class="ayy-popover" id="stay-dates-popover-html" popover role="dialog" aria-label="Dates of stay">
      <ayy-date-range start="2026-10-12" end="2026-10-18" min="2026-10-01" name="stay">
        <div class="ayy-date-range"></div>
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

## Date range — Inline two-month range calendar

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<div class="ayy-card">
  <div class="ayy-card__content">
    <ayy-date-range start="2026-10-14" end="2026-11-04" min="2026-10-05" max="2026-11-25">
      <div class="ayy-date-range"></div>
    </ayy-date-range>
  </div>
</div>
```

React:

```tsx
import { useState } from "react";
import { Card, CardContent, DateRange } from "@danitesler/ayywi/react";

export default function Example() {
  const [range, setRange] = useState<[string, string] | null>(["2026-10-14", "2026-11-04"]);
  return (
    <Card>
      <CardContent>
        <DateRange
          value={range}
          onValueChange={setRange}
          today="2026-10-14"
          min="2026-10-05"
          max="2026-11-25"
        />
      </CardContent>
    </Card>
  );
}
```

---
Part of @danitesler/ayywi 0.0.3: load `dist/ayywi.min.css` (and `dist/elements.global.js` for the <ayy-*> elements). The rules every screen follows: [llms-full.txt#rules](../llms-full.txt#rules). Every component: [llms.txt](../llms.txt).
