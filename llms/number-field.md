# Number field

Category: Forms. A native number input between minus and plus buttons, for small counts: quantities, guests, seats. Typing, arrow keys, min, max and step work as for any number input. Also called: number-field, stepper, spinbox, quantity.

**Classes**
- `.ayy-number-field` — The bordered box around the buttons and the input. Draws the focus ring while you type.
- `.ayy-number-field--sm` — Small height, for a cart line or a table cell.
- `.ayy-number-field__input` — The <input type="number">: centred tabular digits, no spinner arrows.
- `.ayy-number-field__decrement` — The minus <button> before the input. Needs an aria-label. aria-disabled="true" at min.
- `.ayy-number-field__increment` — The plus <button> after the input. Needs an aria-label. aria-disabled="true" at max.

**States**
- `button[aria-disabled="true"]` — Can't go further (at min or max). Stays focusable.
- `input[aria-invalid="true"]` — Invalid value: red border.

**JS (framework-free)**: numberFieldClass({ size?, className? }) → string; part class constants; numberFieldMinusIcon, numberFieldPlusIcon (SVG markup); stepNumberField(button) steps the input (stepUp/stepDown), fires input and change, and returns the new value; syncNumberField(field) sets the buttons' aria-disabled from min and max. @danitesler/ayywi/elements runs both for every .ayy-number-field on the page.

**React** — `import { NumberField } from "@danitesler/ayywi/react";`
- `<NumberField>` renders <div class="ayy-number-field"><button class="ayy-number-field__decrement"><input type="number"><button class="ayy-number-field__increment">. Props: `value / defaultValue` number; `onValueChange` (value: number) => void; `min` number; `max` number; `step` number, default 1; `size` "sm" | "md"; `decrementLabel` string, default "Decrease" — say what changes ("Remove a guest"); `incrementLabel` string, default "Increase"; `className` On the outer box; every other prop goes to the input (id, name, aria-label…); `style` On the outer box

**Accessibility**
- Label the input (a <label for> its id, or aria-label naming the item: "Quantity of Ethiopia Guji, 250 g"). The buttons need their own aria-labels.
- At min or max the button gets aria-disabled instead of disabled, so focus stays on it while you click.
- The input is a real number field: type a value, or use the arrow keys.

**Do**
- Use a number field for small whole counts people adjust by one or two: items in a cart, guests, seats, nights.
- Set min and max (min 1 for guests, 0 when zero removes the line) and say the limit in a hint.
- Use size sm in a cart line or a table row.

**Don't**
- Don't use it for large or exact numbers (a price, a phone number, a year) — use an Input; for a rough amount use a Slider.
- Don't use it for a choice between a few named sizes — use a Segmented control or compact Choice cards.

## Number field — Guests and quantity

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<div class="ayy-stack">
  <div class="ayy-field">
    <label class="ayy-label" for="guests">Guests</label>
    <div class="ayy-number-field">
      <button type="button" class="ayy-number-field__decrement" aria-label="Remove a guest" aria-disabled="false"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20 12L4 12" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg></button>
      <input type="number" inputmode="numeric" class="ayy-number-field__input" min="1" max="8" step="1" id="guests" aria-describedby="guests-hint" name="guests" value="2"/>
      <button type="button" class="ayy-number-field__increment" aria-label="Add a guest" aria-disabled="false"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 4V20M20 12H4" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg></button>
    </div>
    <p class="ayy-field__hint" id="guests-hint">Up to 8 per booking.</p>
  </div>
  <div class="ayy-number-field ayy-number-field--sm">
    <button type="button" class="ayy-number-field__decrement" aria-label="Decrease" aria-disabled="false"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20 12L4 12" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg></button>
    <input type="number" inputmode="numeric" class="ayy-number-field__input" min="0" max="20" step="1" aria-label="Quantity of Ethiopia Guji, 250 g" value="1"/>
    <button type="button" class="ayy-number-field__increment" aria-label="Increase" aria-disabled="false"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 4V20M20 12H4" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg></button>
  </div>
</div>
```

React:

```tsx
import { Field, FieldHint, Label, NumberField } from "@danitesler/ayywi/react";

export default function Example() {
  return (
    <div className="ayy-stack">
      <Field>
        <Label htmlFor="guests">Guests</Label>
        <NumberField
          id="guests"
          name="guests"
          defaultValue={2}
          min={1}
          max={8}
          decrementLabel="Remove a guest"
          incrementLabel="Add a guest"
          aria-describedby="guests-hint"
        />
        <FieldHint id="guests-hint">Up to 8 per booking.</FieldHint>
      </Field>
      <NumberField size="sm" defaultValue={1} min={0} max={20} aria-label="Quantity of Ethiopia Guji, 250 g" />
    </div>
  );
}
```

---
Part of @danitesler/ayywi 0.0.1: load `dist/ayywi.min.css` (and `dist/elements.global.js` for the <ayy-*> elements). The rules every screen follows: [llms-full.txt#rules](../llms-full.txt#rules). Every component: [llms.txt](../llms.txt).
