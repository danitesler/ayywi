# Time picker

Category: Forms. Scrollable columns of hours, minutes, and optional period (AM/PM) to pick a time, inline or in a popover (TimePickerTrigger). Quiet scrollbars with scroll-snap, touch target heights driven by density tokens, and high contrast support. Also called: time-picker, time-select, time-input, clock-picker.

**Classes**
- `.ayy-time-picker` — Root container: scrollable columns of hours, minutes, and optional period (AM/PM).
- `.ayy-time-picker__columns` — Flex row of scrollable time columns with quiet borders.
- `.ayy-time-picker__col` — Column with vertical scroll-snap and quiet scrollbars.
- `.ayy-time-picker__item` — Selectable button option in a time column (hour, minute, period).
- `.ayy-time-picker__item--selected` — The selected time item, styled with primary fill.
- `.ayy-time-picker-trigger` — Field-like button trigger showing the formatted time and opening the popover.
- `.ayy-time-picker-trigger__value` — Formatted time display inside the trigger, or placeholder when empty.

**States**
- `default` — A row of scrollable columns (hours, minutes, and optional AM/PM period) with muted, selectable numbers.
- `hover` (`.ayy-time-picker__item:hover, .ayy-time-picker-trigger:hover (devices with hover)`) — Wash-hover background on items, line-hover border on the trigger.
- `pressed` (`.ayy-time-picker__item:active`) — The item shrinks slightly to 96%.
- `focus` (`:focus-visible on an item or trigger`) — 2px ring in --ayy-color-ring outline.
- `disabled` (`.ayy-time-picker__item[aria-disabled="true"], :disabled`) — Dimmed with disabled opacity and not-allowed cursor.
- `selected` (`.ayy-time-picker__item--selected, [aria-selected="true"]`) — Primary background and contrast foreground text on the picked option.
- `error` (`.ayy-time-picker-trigger[aria-invalid="true"]`) — Destructive border on the trigger and destructive ring when focused.
- `loading` — doesn't apply: No loading look. If available times load asynchronously, display a Skeleton until ready.
- `empty` (`.ayy-time-picker-trigger__value:empty`) — Displays data-placeholder in muted text like an input.

**Sizes**
- Density — Item cells and trigger height follow the md control height (32px compact, 40px comfortable, 44px touch).
- Width — Columns fit their content (hours, minutes, period) and scroll vertically; fits in a popover or inline.

**JS (framework-free)**: timePickerClass({ className? }) → string; timePickerTriggerClass({ className? }) → string; connectTimePicker(root, { value?, format?, step?, onSelect? }) → { setValue, update, focus, destroy } draws and wires time columns on plain markup; generateHours(format?), generateMinutes(step?), parseTimeString(str), formatTime(hours, minutes, format?), formatTimeString(str, format?), to12Hour(h24), to24Hour(h12, period). timePickerClockIcon (SVG markup).

**Custom element** `<ayy-time-picker>` (@danitesler/ayywi/elements) — 
- attribute `value`: The picked time ("09:30" or "02:30 PM"). Updated when a time is picked.
- attribute `format`: "12h" | "24h". Default "24h".
- attribute `step`: Minute step between options (e.g. 5, 15). Default 5.
- attribute `name`: Form name: a hidden input inside carries the picked time.
- event `ayy-select`: { value } when a time is picked.

**React** — `import { TimePicker, TimePickerTrigger } from "@danitesler/ayywi/react";`
- `<TimePicker>` renders <div class="ayy-time-picker">…<div class="ayy-time-picker__columns">. Props: `value / defaultValue` string — the picked time ("14:30" or "02:30 PM"); `onValueChange` (time: string) => void — called when a time is selected; `format` "12h" | "24h" — display format. Default "24h"; `step` number — minute step between options (e.g. 5, 15). Default 5
- `<TimePickerTrigger>` renders <button class="ayy-time-picker-trigger" aria-haspopup="dialog"> + <div class="ayy-popover" popover> with a TimePicker. Props: `value / defaultValue` string — the picked time ("14:30" or "02:30 PM"); `onValueChange` (time: string) => void — called when a time is selected; `placeholder` string — shown while empty. Default "Pick a time"; `format` "12h" | "24h" — display format. Default "24h"; `step` number — minute step between options. Default 5; `name` string — a hidden input carries the time string

**Accessibility**
- Columns use role="listbox" with aria-label for hours, minutes, and period; items use role="option" with aria-selected indicating the current selection.
- Each selectable button has a visible :focus-visible focus ring and meets touch target sizing at touch density.
- The popover trigger uses aria-haspopup="dialog" and connects with aria-controls to the popover.
- Windows High Contrast (@media (forced-colors: active)) maps selected items to Highlight and HighlightText.

**Do**
- Use TimePickerTrigger in forms where selecting hours and minutes from discrete steps is preferred over typing.
- Use step={15} or step={30} for scheduling apps (meetings, bookings) to keep the list short and fast to navigate.
- Set format="12h" or format="24h" to match the user's locale and conventions.

**Don't**
- Don't use a time picker when native <Input type="time"> is sufficient for rapid keyboard entry.
- Don't use step={1} for calendar scheduling where 15 or 30 minute increments are expected.
- Don't close the popover after selecting only the hour; users need to pick both hour and minute.

## Time picker — Time picker trigger in a form

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<!-- <ayy-popover> places the time columns under the trigger; <ayy-time-picker> draws the hours and minutes and updates
     the trigger's .ayy-time-picker-trigger__value when an option is picked. -->
<div class="ayy-field" style="inline-size: min(100%, 16rem)">
  <label class="ayy-label" for="meeting-time-html">Meeting time</label>
  <ayy-popover align="start">
    <button type="button" class="ayy-time-picker-trigger" id="meeting-time-html" popovertarget="time-picker-popover-html" aria-haspopup="dialog" aria-describedby="meeting-time-value-html meeting-time-hint-html"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5"></circle><path d="M12 8V12L14 14" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg><span id="meeting-time-value-html" class="ayy-time-picker-trigger__value" data-placeholder="Pick a time">09:30</span></button>
    <div class="ayy-popover" id="time-picker-popover-html" popover role="dialog" aria-label="Pick a time">
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

## Time picker — 12-hour inline time picker

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<div class="ayy-card">
  <div class="ayy-card__content">
    <ayy-time-picker value="02:30 PM" format="12h" step="15">
      <div class="ayy-time-picker"></div>
    </ayy-time-picker>
  </div>
</div>
```

React:

```tsx
import { useState } from "react";
import { Card, CardContent, TimePicker } from "@danitesler/ayywi/react";

export default function Example() {
  const [time, setTime] = useState("02:30 PM");
  return (
    <Card>
      <CardContent>
        <TimePicker value={time} onValueChange={setTime} format="12h" step={15} />
      </CardContent>
    </Card>
  );
}
```

---
Part of @danitesler/ayywi 0.0.3: load `dist/ayywi.min.css` (and `dist/elements.global.js` for the <ayy-*> elements). The rules every screen follows: [llms-full.txt#rules](../llms-full.txt#rules). Every component: [llms.txt](../llms.txt).
