# Chip

Category: Forms. Pill-shaped filters and choices: a label around a native checkbox or radio, a toggle button (aria-pressed) for apps that filter as you click, and removable chips for the filters in force. The on state is a border, a wash and a tick.

**Classes**
- `.ayy-chip` — A <label> around a native <input type="checkbox"> or radio (which stays in the page but draws nothing), or a <button aria-pressed>. On when the input is checked or aria-pressed="true".
- `.ayy-chip--removable` — An active filter: a <span> with its text and an __remove button. Not a control itself.
- `.ayy-chip__count` — Number of results after the label, muted, tabular digits.
- `.ayy-chip__remove` — The remove (×) button of a removable chip. Needs an aria-label ("Remove Status: Open").
- `.ayy-chip-group` — Wrapping row of chips: role="group" with an aria-label, or role="radiogroup" for radio chips.
- `.ayy-chip-group--scroll` — One line that scrolls sideways instead of wrapping (a phone toolbar).

**States**
- `default` — Pill with a line-strong border, transparent fill, text-soft label at the sm control height.
- `hover` (`:hover`) — Wash fill, line-hover border, full text colour. A removable chip keeps its border; its × gets a wash-hover circle.
- `pressed` — doesn't apply: No pressed look; it toggles on release.
- `focus` (`:focus-visible, :has(> input:focus-visible); .ayy-chip__remove:focus-visible`) — 2px ring, 2px offset (1px on the remove button).
- `disabled` (`:disabled, :has(> input:disabled)`) — --ayy-opacity-disabled, not-allowed cursor.
- `selected` (`:has(> input:checked) or [aria-pressed="true"]`) — Text-colour border, wash-hover fill and a tick before the label (not colour alone); the count turns text-soft. Forced colours: Highlight fill.
- `error` — doesn't apply: Chips are filters and choices; show validation on the group with a FieldError.
- `loading` — doesn't apply: Filtering shows its loading in the results (Skeleton), not on the chip.

**Sizes**
- Density — Fixed at the sm control height (28px compact, 32 comfortable, 40 touch) and control sm text.
- Width — Hugs its label. A group wraps; scroll keeps one line that scrolls sideways (phone toolbars).

**JS (framework-free)**: chipClass({ removable?, className? }), chipGroupClass({ scroll?, className? }) → string; chipCountClass, chipRemoveClass constants; chipRemoveIcon (SVG markup of the cross).

**React** — `import { Chip, ChipButton, ChipRemovable, ChipGroup } from "@danitesler/ayywi/react";`
- `<Chip>` renders <label class="ayy-chip"><input type="checkbox">…. Props: `type` "checkbox" (filters that combine) | "radio" (one choice; same name in the group); `checked / defaultChecked` boolean; `onCheckedChange` (checked: boolean) => void; `name` string; `value` string; `disabled` boolean; `count` ReactNode — results for this filter; `inputProps` Props for the native input.
- `<ChipButton>` renders <button type="button" class="ayy-chip" aria-pressed>. Props: `pressed` boolean; `onPressedChange` (pressed: boolean) => void; `count` ReactNode
- `<ChipRemovable>` renders <span class="ayy-chip ayy-chip--removable">… <button class="ayy-chip__remove">. Props: `onRemove` () => void; `removeLabel` string — default "Remove " + the text
- `<ChipGroup>` renders <div role="group" class="ayy-chip-group">. Props: `scroll` boolean — one line that scrolls sideways

**Accessibility**
- Checkbox and radio chips are native inputs: Space toggles, radios in a group move with the arrow keys, and screen readers announce "checked". Button chips announce "pressed".
- Give the group an aria-label naming what it filters ("Status"), and radio chips role="radiogroup".
- The on state is a border, a wash and a tick, not colour alone; High Contrast fills it with the system highlight.
- Every remove button needs an aria-label with the filter it removes. After removing one, move focus to the next chip or the search field so it isn't lost.

**Do**
- Use chips to filter a list, a table or a grid by a few known values (status, priority, category), with counts when they help.
- Use checkbox chips when filters combine, radio chips for one category at a time, ChipButton when the app filters on every click without a form.
- Show the filters in force as removable chips above the results, with a Clear all button.
- Use ChipGroup scroll in a phone toolbar so the chips stay on one line.

**Don't**
- Don't use chips for a status label that can't be clicked — use a Badge.
- Don't use chips to switch views or date ranges — use a Segmented control; for navigation between pages use Tabs or links.
- Don't show more than eight or so chips in a row — move the rest into a Popover with checkboxes ("More filters").
- Don't make a removable chip's whole body the remove target; only the × removes it.

## Chip — Filters and one choice

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<div class="ayy-stack">
  <div role="group" class="ayy-chip-group" aria-label="Status">
    <label class="ayy-chip"><input type="checkbox" name="status" checked="" value="open"/>Open<span class="ayy-chip__count">12</span></label>
    <label class="ayy-chip"><input type="checkbox" name="status" value="pending"/>Pending<span class="ayy-chip__count">4</span></label>
    <label class="ayy-chip"><input type="checkbox" name="status" value="closed"/>Closed<span class="ayy-chip__count">31</span></label>
  </div>
  <div role="radiogroup" class="ayy-chip-group" aria-label="Category">
    <label class="ayy-chip"><input type="radio" name="category" checked="" value="all"/>All</label>
    <label class="ayy-chip"><input type="radio" name="category" value="coffee"/>Coffee</label>
    <label class="ayy-chip"><input type="radio" name="category" value="tea"/>Tea</label>
    <label class="ayy-chip"><input type="radio" name="category" value="gear"/>Brewing gear</label>
  </div>
</div>
```

React:

```tsx
import { Chip, ChipGroup } from "@danitesler/ayywi/react";

export default function Example() {
  return (
    <div className="ayy-stack">
      <ChipGroup aria-label="Status">
        <Chip name="status" value="open" defaultChecked count={12}>
          Open
        </Chip>
        <Chip name="status" value="pending" count={4}>
          Pending
        </Chip>
        <Chip name="status" value="closed" count={31}>
          Closed
        </Chip>
      </ChipGroup>
      <ChipGroup role="radiogroup" aria-label="Category">
        <Chip type="radio" name="category" value="all" defaultChecked>
          All
        </Chip>
        <Chip type="radio" name="category" value="coffee">
          Coffee
        </Chip>
        <Chip type="radio" name="category" value="tea">
          Tea
        </Chip>
        <Chip type="radio" name="category" value="gear">
          Brewing gear
        </Chip>
      </ChipGroup>
    </div>
  );
}
```

## Chip — Filter bar with active filters

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<!-- Your script flips aria-pressed and removes chips; ayywi only draws the state. -->
<div class="ayy-stack" style="inline-size: 100%">
  <div class="ayy-spread">
    <div class="ayy-input-group" style="inline-size: min(100%, 18rem)">
      <svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M17 17L21 21" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19C15.4183 19 19 15.4183 19 11Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg>
      <input type="search" class="ayy-input" placeholder="Search tickets" aria-label="Search tickets"/>
    </div>
    <div role="group" class="ayy-chip-group ayy-chip-group--scroll" aria-label="Filters">
      <button type="button" aria-pressed="true" class="ayy-chip">Assigned to me</button>
      <button type="button" aria-pressed="true" class="ayy-chip">Urgent</button>
      <button type="button" aria-pressed="false" class="ayy-chip">High</button>
      <button type="button" aria-pressed="false" class="ayy-chip">Normal</button>
    </div>
  </div>
  <div class="ayy-cluster">
    <span class="ayy-muted">Filtered by</span>
    <span class="ayy-chip ayy-chip--removable">Assignee: me<button type="button" class="ayy-chip__remove" aria-label="Remove Assignee: me"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M18 6L6.00081 17.9992M17.9992 18L6 6.00085" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg></button></span>
    <span class="ayy-chip ayy-chip--removable">Priority: Urgent<button type="button" class="ayy-chip__remove" aria-label="Remove Priority: Urgent"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M18 6L6.00081 17.9992M17.9992 18L6 6.00085" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg></button></span>
    <button type="button" class="ayy-button ayy-button--ghost ayy-button--sm">Clear all</button>
  </div>
</div>
```

React:

```tsx
import { Search01Icon } from "@hugeicons/core-free-icons";
import { useState } from "react";
import { Button, ChipButton, ChipGroup, ChipRemovable, Icon, Input, InputGroup } from "@danitesler/ayywi/react";

const PRIORITIES = ["Urgent", "High", "Normal"];

export default function Example() {
  const [mine, setMine] = useState(true);
  const [priorities, setPriorities] = useState(["Urgent"]);
  const toggle = (priority: string) =>
    setPriorities((list) => (list.includes(priority) ? list.filter((p) => p !== priority) : [...list, priority]));
  const active = priorities.length + (mine ? 1 : 0);
  return (
    <div className="ayy-stack" style={{ inlineSize: "100%" }}>
      <div className="ayy-spread">
        <InputGroup style={{ inlineSize: "min(100%, 18rem)" }}>
          <Icon icon={Search01Icon} />
          <Input type="search" placeholder="Search tickets" aria-label="Search tickets" />
        </InputGroup>
        <ChipGroup aria-label="Filters" scroll>
          <ChipButton pressed={mine} onPressedChange={setMine}>
            Assigned to me
          </ChipButton>
          {PRIORITIES.map((priority) => (
            <ChipButton key={priority} pressed={priorities.includes(priority)} onPressedChange={() => toggle(priority)}>
              {priority}
            </ChipButton>
          ))}
        </ChipGroup>
      </div>
      {active > 0 && (
        <div className="ayy-cluster">
          <span className="ayy-muted">Filtered by</span>
          {mine && <ChipRemovable onRemove={() => setMine(false)}>Assignee: me</ChipRemovable>}
          {priorities.map((priority) => (
            <ChipRemovable key={priority} onRemove={() => toggle(priority)}>
              {`Priority: ${priority}`}
            </ChipRemovable>
          ))}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setMine(false);
              setPriorities([]);
            }}
          >
            Clear all
          </Button>
        </div>
      )}
    </div>
  );
}
```

---
Part of @danitesler/ayywi 0.0.1: load `dist/ayywi.min.css` (and `dist/elements.global.js` for the <ayy-*> elements). The rules every screen follows: [llms-full.txt#rules](../llms-full.txt#rules). Every component: [llms.txt](../llms.txt).
