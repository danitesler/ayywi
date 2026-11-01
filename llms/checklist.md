# Checklist

Category: Forms. An editable list of items to tick off, with an optional completion count and progress. Also called: checklist, check-list, todo-list.

**Classes**
- `.ayy-checklist` — Root list and controls.
- `.ayy-checklist__header` — Completion count and progress.
- `.ayy-checklist__count` — Number of completed items.
- `.ayy-checklist__progress` — Progress bar, filling the remaining header width.
- `.ayy-checklist__items` — List of items.
- `.ayy-checklist__item` — Checkbox, text field and remove button row.
- `.ayy-checklist__text` — Editable item text.
- `.ayy-checklist__new` — Field for appending an item.
- `.ayy-checklist__remove` — Remove button, revealed on hover or focus.

**States**
- `default` — Editable text rows with checkboxes and an add field.
- `hover` (`Hover an item`) — The remove button appears.
- `pressed` — doesn't apply: Buttons use their own pressed style.
- `focus` (`Focus a text field, checkbox or remove button`) — A focus ring appears and the remove button is visible.
- `disabled` — doesn't apply: Disable the surrounding form controls when editing is unavailable.
- `selected` (`An item's checkbox is checked`) — The text is muted and struck through.
- `error` — doesn't apply: Show validation in a Field if an item needs an explanation.
- `loading` — doesn't apply: Show a Spinner or Skeleton while the list loads.

**Sizes**
- Density — Checkboxes and buttons follow density and size scope.
- Width — Fills its container; text fields shrink to fit.

**React** — `import { Checklist } from "@danitesler/ayywi/react";`
- `<Checklist>` renders div.ayy-checklist with progress, list and add field. Props: `items` ChecklistItem[] — controlled items; `onItemsChange` (items: ChecklistItem[]) => void; `label` string — list name; `showProgress` boolean — show count and progress, default true; `createId` () => string — create item IDs; `labels` Partial<ChecklistLabels> — translated labels

**Accessibility**
- The list and controls have accessible names; progress is named by the count.
- Enter adds, Backspace removes an empty item, arrows move focus and Alt+Arrow moves an item. Enter during IME composition is ignored.

**Do**
- Use a checklist for an editable list of things to tick off, such as packing or release steps.
- Keep items controlled and provide a stable unique ID for each.

**Don't**
- Don't use a checklist for choosing among fixed options — use Checkbox or a Choice card.

## Checklist — Packing list

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<div class="ayy-card"><div class="ayy-card__content"><div class="ayy-checklist"><div class="ayy-checklist__header"><span class="ayy-checklist__count" id="_R_0_">2 of 4 done</span><div class="ayy-progress ayy-progress--sm ayy-checklist__progress" role="progressbar" aria-labelledby="_R_0_" aria-valuemin="0" aria-valuemax="100" aria-valuenow="50" style="--ayy-value:50"><div class="ayy-progress__bar"></div></div></div><ul class="ayy-checklist__items" aria-label="Packing list"><li class="ayy-checklist__item" data-id="passport"><input type="checkbox" class="ayy-checkbox" aria-label="Passport" checked=""/><input type="text" class="ayy-checklist__text" aria-label="Edit item" value="Passport"/><button type="button" class="ayy-button ayy-button--ghost ayy-button--icon ayy-checklist__remove" aria-label="Remove Passport"><svg class="ayy-icon" data-ayy-icon="x" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M18 6L6.00081 17.9992M17.9992 18L6 6.00085" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg></button></li><li class="ayy-checklist__item" data-id="charger"><input type="checkbox" class="ayy-checkbox" aria-label="Charger" checked=""/><input type="text" class="ayy-checklist__text" aria-label="Edit item" value="Charger"/><button type="button" class="ayy-button ayy-button--ghost ayy-button--icon ayy-checklist__remove" aria-label="Remove Charger"><svg class="ayy-icon" data-ayy-icon="x" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M18 6L6.00081 17.9992M17.9992 18L6 6.00085" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg></button></li><li class="ayy-checklist__item" data-id="jacket"><input type="checkbox" class="ayy-checkbox" aria-label="Rain jacket"/><input type="text" class="ayy-checklist__text" aria-label="Edit item" value="Rain jacket"/><button type="button" class="ayy-button ayy-button--ghost ayy-button--icon ayy-checklist__remove" aria-label="Remove Rain jacket"><svg class="ayy-icon" data-ayy-icon="x" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M18 6L6.00081 17.9992M17.9992 18L6 6.00085" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg></button></li><li class="ayy-checklist__item" data-id="adapter"><input type="checkbox" class="ayy-checkbox" aria-label="Travel adapter"/><input type="text" class="ayy-checklist__text" aria-label="Edit item" value="Travel adapter"/><button type="button" class="ayy-button ayy-button--ghost ayy-button--icon ayy-checklist__remove" aria-label="Remove Travel adapter"><svg class="ayy-icon" data-ayy-icon="x" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M18 6L6.00081 17.9992M17.9992 18L6 6.00085" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg></button></li></ul><input type="text" class="ayy-checklist__text ayy-checklist__new" aria-label="Add an item" placeholder="Add an item" value=""/></div></div></div>
```

React:

```tsx
import { useState } from "react";
import { Card, CardContent, Checklist, type ChecklistItem } from "@danitesler/ayywi/react";

export default function Example() {
  const [items, setItems] = useState<ChecklistItem[]>([
    { id: "passport", text: "Passport", done: true },
    { id: "charger", text: "Charger", done: true },
    { id: "jacket", text: "Rain jacket", done: false },
    { id: "adapter", text: "Travel adapter", done: false },
  ]);
  return <Card><CardContent><Checklist label="Packing list" items={items} onItemsChange={setItems} /></CardContent></Card>;
}
```

---
Part of @danitesler/ayywi 0.1.2: load `dist/ayywi.min.css` (and `dist/elements.global.js` for the <ayy-*> elements). The rules every screen follows: [llms-full.txt#rules](../llms-full.txt#rules). Every component: [llms.txt](../llms.txt).
