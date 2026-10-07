# Choice card

Category: Forms. A card-sized radio or checkbox for choices that need a sentence or a price: plans, delivery options, add-ons, and compact cards for time slots and sizes. The whole card is the label of a native input. Also called: choice-card, option-card, plan-card.

**Classes**
- `.ayy-choice-group` — Grid of cards that adapts to its box (cards at least --ayy-min wide, default 12rem, 6rem for compact cards). Usually a <fieldset>, role="radiogroup" for radio cards.
- `.ayy-choice-group--scroll` — One row that scrolls sideways instead of wrapping: a day strip, sizes on a phone. Cards stay at least --ayy-min wide.
- `.ayy-choice-group__legend` — The group's question, as the fieldset's <legend>.
- `.ayy-choice-card` — A <label> card around a native <input class="ayy-radio"> or ayy-checkbox, drawn in the inline-end corner. Chosen: a text-colour border, 2px.
- `.ayy-choice-card--compact` — A time slot or a size: centred text, input hidden, filled when chosen; a disabled one is struck through.
- `.ayy-choice-card__title` — The option's name.
- `.ayy-choice-card__description` — One line about it, muted.
- `.ayy-choice-card__meta` — A price or a date, at the bottom so a row of cards lines them up.

**States**
- `.ayy-choice-card:has(> input:checked)` — Chosen.
- `.ayy-choice-card:has(> input:disabled)` — Not available.

**JS (framework-free)**: choiceCardClass({ compact?, className? }), choiceGroupClass({ scroll?, className? }) → string; choiceGroupLegendClass, choiceCardTitleClass, choiceCardDescriptionClass, choiceCardMetaClass constants.

**React** — `import { ChoiceGroup, ChoiceCard } from "@danitesler/ayywi/react";`
- `<ChoiceGroup>` renders <fieldset role="radiogroup" class="ayy-choice-group"><legend>…. Props: `legend` ReactNode — the question; `type` "radio" (one choice, kept by the group) | "checkbox" (cards that combine); `name` Shared radio name. Generated if omitted.; `value / defaultValue` The chosen card's value.; `onValueChange` (value: string) => void; `min` CSS length — narrowest card; `scroll` boolean — one row that scrolls sideways; `disabled` boolean — every card
- `<ChoiceCard>` renders <label class="ayy-choice-card"><input class="ayy-radio">…. Props: `value` string; `title` ReactNode; `description` ReactNode; `meta` ReactNode — price or date; `icon` ReactNode — an Icon or Icon tile above the title; `compact` boolean; `type` "checkbox" | "radio" — outside a radio ChoiceGroup; `checked / defaultChecked` boolean — outside a radio ChoiceGroup; `onCheckedChange` (checked: boolean) => void; `disabled` boolean; `inputProps` Props for the native input (name for checkbox cards).

**Accessibility**
- Each card is a native radio or checkbox labelled by the whole card: Space picks it, arrow keys move between radios, and the title, description and price are its name.
- Group them in a <fieldset> with a <legend> (ChoiceGroup legend) so the question is announced with each option.
- Chosen is a thicker border (and a filled card when compact), not colour alone; High Contrast outlines it with the system highlight.
- A full slot stays in the group as disabled, struck through, so people see what isn't available.

**Do**
- Use choice cards when each option needs more than a word: a plan with its price, a delivery option with its date, an add-on with what it costs.
- Use compact cards for a grid of short options: time slots, sizes, seat counts. Say what's left in the description. A day strip is compact cards in a scroll group.
- Mark the recommended plan with a Badge in its title; the chosen state is the border.
- Use type checkbox for add-ons that combine, radio for one choice.

**Don't**
- Don't use choice cards for a yes/no setting — use Switch; for two to five short words, use a Segmented control; for a long list, use Select.
- Don't put links or buttons inside a card: the whole card is the label.
- Don't use them to show plans you can't pick (a marketing pricing table) — use Cards with Card featured.

## Choice card — Plans

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<fieldset role="radiogroup" class="ayy-choice-group" style="inline-size: 100%">
  <legend class="ayy-choice-group__legend">Plan</legend>
  <label class="ayy-choice-card"><input type="radio" class="ayy-radio" name="plan" value="starter"/><span class="ayy-choice-card__title">Starter</span><span class="ayy-choice-card__description">One project, community support</span><span class="ayy-choice-card__meta">Free</span></label>
  <label class="ayy-choice-card"><input type="radio" class="ayy-radio" name="plan" checked="" value="pro"/><span class="ayy-choice-card__title">Pro</span><span class="ayy-choice-card__description">Unlimited projects, AI replies, priority support</span><span class="ayy-choice-card__meta">$24 / editor / month</span></label>
  <label class="ayy-choice-card"><input type="radio" class="ayy-radio" name="plan" value="business"/><span class="ayy-choice-card__title">Business</span><span class="ayy-choice-card__description">SSO, audit log, a success manager</span><span class="ayy-choice-card__meta">$48 / editor / month</span></label>
</fieldset>
```

React:

```tsx
import { ChoiceCard, ChoiceGroup } from "@danitesler/ayywi/react";

export default function Example() {
  return (
    <ChoiceGroup legend="Plan" name="plan" defaultValue="pro" style={{ inlineSize: "100%" }}>
      <ChoiceCard value="starter" title="Starter" description="One project, community support" meta="Free" />
      <ChoiceCard value="pro" title="Pro" description="Unlimited projects, AI replies, priority support" meta="$24 / editor / month" />
      <ChoiceCard value="business" title="Business" description="SSO, audit log, a success manager" meta="$48 / editor / month" />
    </ChoiceGroup>
  );
}
```

## Choice card — Time slots

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<fieldset role="radiogroup" class="ayy-choice-group" style="inline-size: min(100%, 28rem)">
  <legend class="ayy-choice-group__legend">Tuesday, October 14</legend>
  <label class="ayy-choice-card ayy-choice-card--compact"><input type="radio" class="ayy-radio" name="slot" value="07:00"/><span class="ayy-choice-card__title">07:00</span><span class="ayy-choice-card__description">6 spots left</span></label>
  <label class="ayy-choice-card ayy-choice-card--compact"><input type="radio" class="ayy-radio" name="slot" value="08:30"/><span class="ayy-choice-card__title">08:30</span><span class="ayy-choice-card__description">2 spots left</span></label>
  <label class="ayy-choice-card ayy-choice-card--compact"><input type="radio" class="ayy-radio" name="slot" value="12:15"/><span class="ayy-choice-card__title">12:15</span><span class="ayy-choice-card__description">9 spots left</span></label>
  <label class="ayy-choice-card ayy-choice-card--compact"><input type="radio" class="ayy-radio" disabled="" name="slot" value="17:30"/><span class="ayy-choice-card__title">17:30</span><span class="ayy-choice-card__description">Full</span></label>
  <label class="ayy-choice-card ayy-choice-card--compact"><input type="radio" class="ayy-radio" name="slot" checked="" value="18:30"/><span class="ayy-choice-card__title">18:30</span><span class="ayy-choice-card__description">3 spots left</span></label>
  <label class="ayy-choice-card ayy-choice-card--compact"><input type="radio" class="ayy-radio" name="slot" value="20:00"/><span class="ayy-choice-card__title">20:00</span><span class="ayy-choice-card__description">11 spots left</span></label>
</fieldset>
```

React:

```tsx
import { ChoiceCard, ChoiceGroup } from "@danitesler/ayywi/react";

const slots = [
  { time: "07:00", left: 6 },
  { time: "08:30", left: 2 },
  { time: "12:15", left: 9 },
  { time: "17:30", left: 0 },
  { time: "18:30", left: 3 },
  { time: "20:00", left: 11 },
];

export default function Example() {
  return (
    <ChoiceGroup legend="Tuesday, October 14" name="slot" defaultValue="18:30" style={{ inlineSize: "min(100%, 28rem)" }}>
      {slots.map((slot) => (
        <ChoiceCard
          key={slot.time}
          compact
          value={slot.time}
          title={slot.time}
          description={slot.left ? `${slot.left} spots left` : "Full"}
          disabled={!slot.left}
        />
      ))}
    </ChoiceGroup>
  );
}
```

## Choice card — Add-ons that combine

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<fieldset class="ayy-choice-group" style="inline-size: 100%">
  <legend class="ayy-choice-group__legend">Extras</legend>
  <label class="ayy-choice-card"><input type="checkbox" class="ayy-checkbox" name="extras" value="gift"/><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 11V15C4 18.2998 4 19.9497 5.02513 20.9749C6.05025 22 7.70017 22 11 22H13C16.2998 22 17.9497 22 18.9749 20.9749C20 19.9497 20 18.2998 20 15V11" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M3 9C3 8.25231 3 7.87846 3.20096 7.6C3.33261 7.41758 3.52197 7.26609 3.75 7.16077C4.09808 7 4.56538 7 5.5 7H18.5C19.4346 7 19.9019 7 20.25 7.16077C20.478 7.26609 20.6674 7.41758 20.799 7.6C21 7.87846 21 8.25231 21 9C21 9.74769 21 10.1215 20.799 10.4C20.6674 10.5824 20.478 10.7339 20.25 10.8392C19.9019 11 19.4346 11 18.5 11H5.5C4.56538 11 4.09808 11 3.75 10.8392C3.52197 10.7339 3.33261 10.5824 3.20096 10.4C3 10.1215 3 9.74769 3 9Z" stroke="currentColor" stroke-linejoin="round" stroke-width="1.5"></path><path d="M6 3.78571C6 2.79949 6.79949 2 7.78571 2H8.14286C10.2731 2 12 3.7269 12 5.85714V7H9.21429C7.43908 7 6 5.56091 6 3.78571Z" stroke="currentColor" stroke-linejoin="round" stroke-width="1.5"></path><path d="M18 3.78571C18 2.79949 17.2005 2 16.2143 2H15.8571C13.7269 2 12 3.7269 12 5.85714V7H14.7857C16.5609 7 18 5.56091 18 3.78571Z" stroke="currentColor" stroke-linejoin="round" stroke-width="1.5"></path><path d="M12 11L12 22" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg><span class="ayy-choice-card__title">Gift wrap</span><span class="ayy-choice-card__description">Recycled paper and a handwritten card</span><span class="ayy-choice-card__meta">+$4</span></label>
  <label class="ayy-choice-card"><input type="checkbox" class="ayy-checkbox" name="extras" checked="" value="express"/><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M19.5 17.5C19.5 18.8807 18.3807 20 17 20C15.6193 20 14.5 18.8807 14.5 17.5C14.5 16.1193 15.6193 15 17 15C18.3807 15 19.5 16.1193 19.5 17.5Z" stroke="currentColor" stroke-width="1.5"></path><path d="M9.5 17.5C9.5 18.8807 8.38071 20 7 20C5.61929 20 4.5 18.8807 4.5 17.5C4.5 16.1193 5.61929 15 7 15C8.38071 15 9.5 16.1193 9.5 17.5Z" stroke="currentColor" stroke-width="1.5"></path><path d="M14.5 17.5H9.5M19.5 17.5H20.2632C20.4831 17.5 20.5931 17.5 20.6855 17.4885C21.3669 17.4036 21.9036 16.8669 21.9885 16.1855C22 16.0931 22 15.9831 22 15.7632V13C22 9.41015 19.0899 6.5 15.5 6.5M2 4H12C13.4142 4 14.1213 4 14.5607 4.43934C15 4.87868 15 5.58579 15 7V15.5M2 12.75V15C2 15.9346 2 16.4019 2.20096 16.75C2.33261 16.978 2.52197 17.1674 2.75 17.299C3.09808 17.5 3.56538 17.5 4.5 17.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M2 7H8M2 10H6" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg><span class="ayy-choice-card__title">Express delivery</span><span class="ayy-choice-card__description">Tomorrow before noon</span><span class="ayy-choice-card__meta">+$9</span></label>
  <label class="ayy-choice-card"><input type="checkbox" class="ayy-checkbox" name="extras" value="plastic-free"/><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7.64584 15.7108C7.23279 14.8966 7 13.9755 7 13C7 9.78484 9.5 7.5 13 7C17.0817 6.4169 18.8333 4.16667 20 3C23.5 16 17 19 13 19C11.9071 19 10.8825 18.7078 10 18.1973" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M3 21C3.5 18 5.45791 16.1355 10 15C13.2167 14.1958 15.4634 12.1791 17 10.0549" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path></svg><span class="ayy-choice-card__title">Plastic-free packing</span><span class="ayy-choice-card__description">Compostable bags and tape</span><span class="ayy-choice-card__meta">Free</span></label>
</fieldset>
```

React:

```tsx
import { DeliveryTruck01Icon, GiftIcon, Leaf01Icon } from "@hugeicons/core-free-icons";
import { ChoiceCard, ChoiceGroup, Icon } from "@danitesler/ayywi/react";

export default function Example() {
  return (
    <ChoiceGroup legend="Extras" type="checkbox" style={{ inlineSize: "100%" }}>
      <ChoiceCard
        icon={<Icon icon={GiftIcon} />}
        title="Gift wrap"
        description="Recycled paper and a handwritten card"
        meta="+$4"
        value="gift"
        inputProps={{ name: "extras" }}
      />
      <ChoiceCard
        icon={<Icon icon={DeliveryTruck01Icon} />}
        title="Express delivery"
        description="Tomorrow before noon"
        meta="+$9"
        value="express"
        inputProps={{ name: "extras" }}
        defaultChecked
      />
      <ChoiceCard
        icon={<Icon icon={Leaf01Icon} />}
        title="Plastic-free packing"
        description="Compostable bags and tape"
        meta="Free"
        value="plastic-free"
        inputProps={{ name: "extras" }}
      />
    </ChoiceGroup>
  );
}
```

---
Part of @danitesler/ayywi 0.0.1: load `dist/ayywi.min.css` (and `dist/elements.global.js` for the <ayy-*> elements). The rules every screen follows: [llms-full.txt#rules](../llms-full.txt#rules). Every component: [llms.txt](../llms.txt).
