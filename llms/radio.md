# Radio

Category: Forms. Native radio buttons with a drawn dot, grouped in a fieldset with a legend.

**Classes**
- `.ayy-radio` — On <input type="radio">. Size follows density. aria-invalid="true" tints the ring destructive (dashed in High Contrast).
- `.ayy-radio-group` — On the <fieldset> holding the radios. Vertical stack.
- `.ayy-radio-group--horizontal` — Options in a wrapping row.
- `.ayy-radio-group__legend` — The group's <legend>.

**States**
- `default` — A circle --ayy-size-check wide with a line-hover border on a wash fill.
- `hover` (`:hover`) — Border turns text-soft.
- `pressed` — doesn't apply: No pressed look; it picks on release.
- `focus` (`:focus-visible`) — 2px ring, 2px offset. Arrow keys move the choice within the group.
- `disabled` (`:disabled`) — --ayy-opacity-disabled, not-allowed cursor. Forced colours: GrayText border.
- `selected` (`:checked`) — Primary fill and border with a primary-fg dot that springs in.
- `error` (`aria-invalid="true" on each radio of the group`) — Destructive border. Forced colours: dashed.
- `loading` — doesn't apply: Choosing is instant.

**Sizes**
- Density — --ayy-size-check: 16px compact, 18 comfortable, 20 touch.
- Width — Fixed circle. The group stacks (vertical) or wraps in a row (horizontal).

**JS (framework-free)**: radioClass, radioGroupLegendClass constants; radioGroupClass({ orientation?, className? }) → string

**React** — `import { RadioGroup, Radio } from "@danitesler/ayywi/react";`
- `<RadioGroup>` renders <fieldset> (+ <legend>). Props: `label` ReactNode — legend text; `name` string — generated if omitted; `value / defaultValue` Selected value (controlled / uncontrolled).; `onValueChange` (value: string) => void; `orientation` "vertical" | "horizontal"
- `<Radio>` renders <input type="radio">. Props: `value` string (required); `...rest` All native <input> attributes.

**Accessibility**
- Arrow keys move between radios in a group natively — no JS needed.
- Always give the group a legend (label prop) and each radio a wrapping <label class="ayy-label">.

**Do**
- Use radios to pick exactly one of 2–6 visible options (plan, visibility, region).
- Pre-select the most common option when there's a sensible default.

**Don't**
- Don't use radios for more than ~6 options — use Select.
- Don't use radios to switch views — use Tabs.
- Don't use radios for independent on/off choices — use Checkbox.
- Don't use a single radio on its own — use a Checkbox.

## Radio — Group

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<fieldset class="ayy-radio-group">
  <legend class="ayy-radio-group__legend">Visibility</legend>
  <label class="ayy-label"><input type="radio" class="ayy-radio" name="visibility-html" value="private" /> Only me</label>
  <label class="ayy-label"><input type="radio" class="ayy-radio" name="visibility-html" value="team" checked /> My team</label>
  <label class="ayy-label"><input type="radio" class="ayy-radio" name="visibility-html" value="public" /> Anyone with the link</label>
</fieldset>
<fieldset class="ayy-radio-group ayy-radio-group--horizontal">
  <legend class="ayy-radio-group__legend">Billing</legend>
  <label class="ayy-label"><input type="radio" class="ayy-radio" name="billing-html" value="monthly" checked /> Monthly</label>
  <label class="ayy-label"><input type="radio" class="ayy-radio" name="billing-html" value="yearly" /> Yearly</label>
</fieldset>
```

React:

```tsx
import { Radio, RadioGroup } from "@danitesler/ayywi/react";

export default function Example() {
  return (
    <>
      <RadioGroup label="Visibility" defaultValue="team">
        <label className="ayy-label">
          <Radio value="private" /> Only me
        </label>
        <label className="ayy-label">
          <Radio value="team" /> My team
        </label>
        <label className="ayy-label">
          <Radio value="public" /> Anyone with the link
        </label>
      </RadioGroup>
      <RadioGroup label="Billing" defaultValue="monthly" orientation="horizontal">
        <label className="ayy-label">
          <Radio value="monthly" /> Monthly
        </label>
        <label className="ayy-label">
          <Radio value="yearly" /> Yearly
        </label>
      </RadioGroup>
    </>
  );
}
```

---
Part of @danitesler/ayywi 0.0.1: load `dist/ayywi.min.css` (and `dist/elements.global.js` for the <ayy-*> elements). The rules every screen follows: [llms-full.txt#rules](../llms-full.txt#rules). Every component: [llms.txt](../llms.txt).
