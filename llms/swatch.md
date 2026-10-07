# Swatch

Category: Forms. Round colour dots to pick one colour: a tag's or a list's colour, a pen in an editor. Radios in a label (or toggle buttons), coloured by --ayy-swatch set to a token, with a "no colour" and an "any colour" (native colour input) swatch. The picked one gets a ring and a tick.

**Classes**
- `.ayy-swatch` — One colour: a <label> around a native radio (which stays in the page but draws nothing), or a <button aria-pressed>. Set --ayy-swatch on it to the colour, a token: var(--ayy-chart-1…6), var(--ayy-accent-*), var(--ayy-color-destructive). The radio (or the button) needs an aria-label naming the colour.
- `.ayy-swatch--sm` — Smaller dot, for toolbars.
- `.ayy-swatch--lg` — Bigger dot, a control's height.
- `.ayy-swatch--none` — "No colour": the surface with a red diagonal stroke. No --ayy-swatch.
- `.ayy-swatch--custom` — Any colour: a <label> around an <input type="color">, drawn as a ring of the chart colours around the picked colour (React and @danitesler/ayywi/elements keep --ayy-swatch in step with the input).
- `.ayy-swatch-group` — Wrapping row of swatches: role="radiogroup" with an aria-label or aria-labelledby. Padded so the picked ring and focus ring aren't clipped.
- `.ayy-swatch-group--track` — On a pill-shaped wash, like a toolbar's colour row.

**States**
- `.ayy-swatch:has(> input:checked)` — Picked (radio swatches): a gap, a ring in the text colour, and a tick.
- `.ayy-swatch[aria-pressed="true"]` — Picked (button swatches).
- `:disabled` — Dimmed, not clickable.
- `:hover` — Grows a little (devices that hover).

**JS (framework-free)**: swatchClass({ size?, none?, custom?, className? }), swatchGroupClass({ track?, className? }) → string; syncSwatch(input) shows a custom swatch's colour (@danitesler/ayywi/elements does it on every input).

**React** — `import { Swatch, SwatchButton, SwatchCustom, SwatchGroup } from "@danitesler/ayywi/react";`
- `<Swatch>` renders <label class="ayy-swatch" style="--ayy-swatch: …"><input type="radio" aria-label>. Props: `color` string — a CSS colour, ideally a token ("var(--ayy-chart-2)"); `label` string — the colour's name, required ("Blue"); `name` string — the same for every swatch in the group; `value` string; `checked / defaultChecked` boolean; `onCheckedChange` (checked: boolean) => void; `disabled` boolean; `size` "sm" | "md" | "lg"; `none` boolean — the "no colour" swatch; `inputProps` Props for the native radio.
- `<SwatchButton>` renders <button type="button" class="ayy-swatch" aria-pressed aria-label>. Props: `color` string; `label` string — required; `pressed` boolean; `size` "sm" | "md" | "lg"; `none` boolean
- `<SwatchCustom>` renders <label class="ayy-swatch ayy-swatch--custom"><input type="color" aria-label>. Props: `label` string — required ("Custom colour"); `size` "sm" | "md" | "lg"; `...` Every <input type="color"> prop: value, defaultValue (hex), onChange.
- `<SwatchGroup>` renders <div role="radiogroup" class="ayy-swatch-group"> (pass role="group" for SwatchButtons). Props: `track` boolean — on a pill-shaped wash

**Accessibility**
- Radio swatches are native: Tab enters the group, arrow keys move the pick, and screen readers say the colour's name and "checked". Every swatch needs a name (label prop / aria-label) because a dot has no text.
- Name the group ("Tag colour") with aria-label or aria-labelledby.
- The picked swatch has a ring and a tick, not just a colour; light and dark dots keep a hairline edge in every theme. High Contrast outlines the picked one with the system highlight.
- The dot is smaller than a touch target, but its hit area reaches a control's height (bigger at touch density).

**Do**
- Use swatches to pick a colour from a short, fixed set: a tag, a list, a calendar, an annotation pen.
- Colour them with tokens (--ayy-chart-1…6 are made to be told apart and meet 3:1 on every surface), and name each one.
- Offer a none swatch when "no colour" is a real choice, and a SwatchCustom when people may need any colour (an image editor).
- Use a track group in a toolbar, size sm.

**Don't**
- Don't use swatches to choose a theme or a status — use the Theme toggle or a Select; colour alone doesn't say what a status means.
- Don't hardcode hex values in --ayy-swatch; use tokens, or the app's own colour variables when people pick colours (stored values belong in data, not in markup).
- Don't show more than about ten swatches in a row — group them, or add a SwatchCustom.
- Don't use colour names that only make sense in one theme ("Black" turns white in dark mode) — name the role ("Ink").

## Swatch — Tag colour

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<div class="ayy-stack" style="--ayy-gap: var(--ayy-space-1)">
  <span class="ayy-label" id="tag-colour-label">Tag colour</span>
  <div role="radiogroup" class="ayy-swatch-group" aria-labelledby="tag-colour-label">
    <label class="ayy-swatch ayy-swatch--none"><input type="radio" aria-label="No colour" name="tag-colour" value="none" /></label>
    <label class="ayy-swatch" style="--ayy-swatch: var(--ayy-chart-1)"><input type="radio" aria-label="Blue" name="tag-colour" value="blue" /></label>
    <label class="ayy-swatch" style="--ayy-swatch: var(--ayy-chart-2)"><input type="radio" aria-label="Orange" name="tag-colour" value="orange" /></label>
    <label class="ayy-swatch" style="--ayy-swatch: var(--ayy-chart-3)"><input type="radio" aria-label="Green" name="tag-colour" checked="" value="green" /></label>
    <label class="ayy-swatch" style="--ayy-swatch: var(--ayy-chart-4)"><input type="radio" aria-label="Violet" name="tag-colour" value="violet" /></label>
    <label class="ayy-swatch" style="--ayy-swatch: var(--ayy-chart-5)"><input type="radio" aria-label="Amber" name="tag-colour" value="amber" /></label>
    <label class="ayy-swatch" style="--ayy-swatch: var(--ayy-chart-6)"><input type="radio" aria-label="Pink" name="tag-colour" value="pink" /></label>
  </div>
</div>
```

React:

```tsx
import type { CSSProperties } from "react";
import { Swatch, SwatchGroup } from "@danitesler/ayywi/react";

const COLOURS = [
  { value: "blue", label: "Blue", color: "var(--ayy-chart-1)" },
  { value: "orange", label: "Orange", color: "var(--ayy-chart-2)" },
  { value: "green", label: "Green", color: "var(--ayy-chart-3)" },
  { value: "violet", label: "Violet", color: "var(--ayy-chart-4)" },
  { value: "amber", label: "Amber", color: "var(--ayy-chart-5)" },
  { value: "pink", label: "Pink", color: "var(--ayy-chart-6)" },
];

export default function Example() {
  return (
    <div className="ayy-stack" style={{ "--ayy-gap": "var(--ayy-space-1)" } as CSSProperties}>
      <span className="ayy-label" id="tag-colour-label">
        Tag colour
      </span>
      <SwatchGroup aria-labelledby="tag-colour-label">
        <Swatch none label="No colour" name="tag-colour" value="none" />
        {COLOURS.map((c) => (
          <Swatch key={c.value} color={c.color} label={c.label} name="tag-colour" value={c.value} defaultChecked={c.value === "green"} />
        ))}
      </SwatchGroup>
    </div>
  );
}
```

## Swatch — Pen colours on a track, with any colour

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<div role="radiogroup" class="ayy-swatch-group ayy-swatch-group--track" aria-label="Pen colour">
  <label class="ayy-swatch ayy-swatch--sm" style="--ayy-swatch: var(--ayy-color-text)"><input type="radio" aria-label="Ink" name="pen" value="ink" /></label>
  <label class="ayy-swatch ayy-swatch--sm" style="--ayy-swatch: var(--ayy-color-destructive)"><input type="radio" aria-label="Red" name="pen" checked="" value="red" /></label>
  <label class="ayy-swatch ayy-swatch--sm" style="--ayy-swatch: var(--ayy-chart-1)"><input type="radio" aria-label="Blue" name="pen" value="blue" /></label>
  <label class="ayy-swatch ayy-swatch--sm" style="--ayy-swatch: var(--ayy-chart-3)"><input type="radio" aria-label="Green" name="pen" value="green" /></label>
  <label class="ayy-swatch ayy-swatch--sm" style="--ayy-swatch: var(--ayy-chart-5)"><input type="radio" aria-label="Amber" name="pen" value="amber" /></label>
  <label class="ayy-swatch ayy-swatch--sm ayy-swatch--custom"><input type="color" aria-label="Custom colour" value="#7c5cff" /></label>
</div>
```

React:

```tsx
import { Swatch, SwatchCustom, SwatchGroup } from "@danitesler/ayywi/react";

const PENS = [
  { value: "ink", label: "Ink", color: "var(--ayy-color-text)" },
  { value: "red", label: "Red", color: "var(--ayy-color-destructive)" },
  { value: "blue", label: "Blue", color: "var(--ayy-chart-1)" },
  { value: "green", label: "Green", color: "var(--ayy-chart-3)" },
  { value: "amber", label: "Amber", color: "var(--ayy-chart-5)" },
];

export default function Example() {
  return (
    <SwatchGroup aria-label="Pen colour" track>
      {PENS.map((p) => (
        <Swatch key={p.value} size="sm" color={p.color} label={p.label} name="pen" value={p.value} defaultChecked={p.value === "red"} />
      ))}
      <SwatchCustom size="sm" label="Custom colour" defaultValue="#7c5cff" />
    </SwatchGroup>
  );
}
```

---
Part of @danitesler/ayywi 0.0.1: load `dist/ayywi.min.css` (and `dist/elements.global.js` for the <ayy-*> elements). The rules every screen follows: [llms-full.txt#rules](../llms-full.txt#rules). Every component: [llms.txt](../llms.txt).
