# Slider

Category: Forms. A native range input with a filled track and a round thumb, and a two-thumb range for a min and a max. Keyboard, forms and screen readers work as for any range input. Also called: slider, range, range-input.

**Classes**
- `.ayy-slider` — On <input type="range">. --ayy-value (0–100, where the value sits between min and max) fills the track up to the thumb; React and @danitesler/ayywi/elements keep it in sync, so in HTML set the starting one inline.
- `.ayy-slider-range` — A role="group" around two .ayy-slider inputs (the min, then the max) sharing one track, filled between --ayy-from and --ayy-to (0–100). @danitesler/ayywi/elements keeps them in sync and stops the thumbs crossing.

**JS (framework-free)**: sliderPercent(input) → 0–100 for --ayy-value; syncSlider(input) updates --ayy-value (or the range's --ayy-from / --ayy-to and keeps the thumbs from crossing). @danitesler/ayywi/elements runs it on every input event; call it after setting a value from code. sliderClass, sliderRangeClass constants.

**React** — `import { Slider, SliderRange } from "@danitesler/ayywi/react";`
- `<Slider>` renders <input type="range" class="ayy-slider">. Props: `value / defaultValue` number; `onValueChange` (value: number) => void; `min` number, default 0; `max` number, default 100; `step` number, default 1
- `<SliderRange>` renders <div role="group" class="ayy-slider-range"> with two range inputs. Props: `value / defaultValue` [number, number]; `onValueChange` (value: [number, number]) => void; `min` number; `max` number; `step` number; `labels` [string, string] — the thumbs' names ("Minimum price", "Maximum price"); `names` [string, string] — form names; `disabled` boolean

**Accessibility**
- It's a native range input: arrow keys step, Page Up/Down jump, Home/End go to the ends, and screen readers read the value. Give it a <label> (or aria-label); add aria-valuetext when the number needs a unit ("12 people").
- Show the value in text next to the label (an <output>), so it doesn't depend on the thumb's position.
- Each thumb of a range has its own name ("Minimum price", "Maximum price"); name the group with aria-labelledby.
- The focus ring is on the thumb. In High Contrast the fill and the thumb take system colours.

**Do**
- Use a slider for a value where roughly is fine and the range is small: a class size, a volume, a radius, a budget.
- Use a range slider to filter by price or size between a min and a max.
- Pick a step that matches what people choose (5, 10, 0.5), and print the value next to the label.

**Don't**
- Don't use a slider when people need an exact number — use an Input (type number) or a Number field.
- Don't use it for a choice between a few named options — use a Segmented control or Radio buttons.
- Don't hide what min and max mean: label the ends or the value.

## Slider — With its value

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<!-- @danitesler/ayywi/elements keeps --ayy-value in step with the thumb; update the <output> text from the input event. -->
<div class="ayy-field" style="inline-size: min(100%, 22rem)">
  <div class="ayy-spread">
    <label class="ayy-label" for="class-size">Class size</label>
    <output for="class-size" class="ayy-muted">12 people</output>
  </div>
  <input type="range" class="ayy-slider" min="4" max="30" step="1" style="--ayy-value: 30.77" id="class-size" aria-describedby="class-size-hint" value="12"/>
  <p class="ayy-field__hint" id="class-size-hint">Bookings close when the class is full.</p>
</div>
```

React:

```tsx
import { useState } from "react";
import { Field, FieldHint, Label, Slider } from "@danitesler/ayywi/react";

export default function Example() {
  const [spots, setSpots] = useState(12);
  return (
    <Field style={{ inlineSize: "min(100%, 22rem)" }}>
      <div className="ayy-spread">
        <Label htmlFor="class-size">Class size</Label>
        <output htmlFor="class-size" className="ayy-muted">
          {spots} people
        </output>
      </div>
      <Slider id="class-size" min={4} max={30} value={spots} onValueChange={setSpots} aria-describedby="class-size-hint" />
      <FieldHint id="class-size-hint">Bookings close when the class is full.</FieldHint>
    </Field>
  );
}
```

## Slider — Price range

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<!-- @danitesler/ayywi/elements keeps the fill in step and stops the thumbs crossing; update the price text from the input event. -->
<div class="ayy-stack" style="inline-size: min(100%, 22rem)">
  <div class="ayy-spread">
    <span class="ayy-label" id="price-label">Price</span>
    <span class="ayy-muted">$18 – $64</span>
  </div>
  <div role="group" class="ayy-slider-range" style="--ayy-from: 18; --ayy-to: 64" aria-labelledby="price-label">
    <input type="range" class="ayy-slider" aria-label="Minimum price" min="0" max="100" step="2" name="price_min" value="18"/>
    <input type="range" class="ayy-slider" aria-label="Maximum price" min="0" max="100" step="2" name="price_max" value="64"/>
  </div>
</div>
```

React:

```tsx
import { useState } from "react";
import { SliderRange } from "@danitesler/ayywi/react";

export default function Example() {
  const [[low, high], setPrice] = useState<[number, number]>([18, 64]);
  return (
    <div className="ayy-stack" style={{ inlineSize: "min(100%, 22rem)" }}>
      <div className="ayy-spread">
        <span className="ayy-label" id="price-label">
          Price
        </span>
        <span className="ayy-muted">
          ${low} – ${high}
        </span>
      </div>
      <SliderRange
        aria-labelledby="price-label"
        min={0}
        max={100}
        step={2}
        value={[low, high]}
        onValueChange={setPrice}
        labels={["Minimum price", "Maximum price"]}
        names={["price_min", "price_max"]}
      />
    </div>
  );
}
```

---
Part of @danitesler/ayywi 0.0.1: load `dist/ayywi.min.css` (and `dist/elements.global.js` for the <ayy-*> elements). The rules every screen follows: [llms-full.txt#rules](../llms-full.txt#rules). Every component: [llms.txt](../llms.txt).
