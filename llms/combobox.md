# Combobox

Category: Forms. An input that filters a list as you type and picks one option: a city, a customer, a time zone, a product. The WAI-ARIA combobox pattern, with the list as a popover under the input.

**Classes**
- `.ayy-combobox` — Wrapper: the .ayy-input (role="combobox"), a chevron <svg> and the listbox.
- `.ayy-combobox__listbox` — The <ul role="listbox" popover="manual"> of options, placed under the input.
- `.ayy-combobox__option` — An <li role="option">. data-value is what it stands for, data-label what goes in the input, data-keywords more words that match. aria-selected="true" on the one the arrow keys are on; aria-disabled for one you can't pick.
- `.ayy-combobox__meta` — Extra text at the end of an option (a country, a count). Not put in the input.
- `.ayy-combobox__empty` — The "No matches" line (role="none"), shown when nothing matches.

**States**
- `input[aria-expanded="true"]` — The list is open.
- `option[aria-selected="true"]` — The option the arrow keys are on.
- `option[hidden]` — Filtered out.

**JS (framework-free)**: connectCombobox(input, listbox, { onSelect?, filter? }) → { open, close, refresh, destroy } wires the pattern on plain markup; comboboxOptionLabel(option) and comboboxOptionByValue(listbox, value) read options; comboboxChevronIcon (SVG markup) and part class constants.

**Custom element** `<ayy-combobox>` (ayywi/elements) — 
- attribute `manual`: Don't filter: replace the options yourself as people type (a search API), then call refresh().
- event `ayy-select`: { value, label, option } when an option is chosen — value is its data-value, else its label.

**React** — `import { Combobox } from "ayywi/react";`
- `<Combobox>` renders <div class="ayy-combobox"><input role="combobox" class="ayy-input"><svg><ul role="listbox" class="ayy-combobox__listbox">. Props: `options` ({ value, label, meta?, icon?, keywords?, disabled? } | string)[]; `value / defaultValue` The chosen option's value.; `onValueChange` (value: string, option) => void; `onInputChange` (text: string) => void — every keystroke, e.g. to fetch options; `filter` boolean, default true; false when you fetch the options yourself; `emptyText` ReactNode, default "No matches"; `size` "sm" | "md" | "lg"; `name` string — a hidden input carries the chosen value in forms

**Accessibility**
- Focus stays in the input: Down opens the list and moves through it, Up goes back, Enter picks, Esc closes (and a second Esc clears), Alt+Down opens without moving. Screen readers follow aria-activedescendant.
- Label the input with a <label for> its id; the chevron is decoration.
- Typing highlights the first match, so Enter picks it; options that don't match are hidden, and "No matches" shows when none do.

**Do**
- Use a combobox to pick one of many known values: more than ten or so, where people know what they're looking for (a city, a customer, a time zone).
- Give options keywords for the other words people type (the country for a city, the email for a customer), and meta for what helps tell them apart.
- For results from a server, set filter={false} (or manual on <ayy-combobox>) and replace the options on each keystroke.

**Don't**
- Don't use a combobox for fewer than about ten options — use Select, or a Segmented control for two to five.
- Don't use it for actions — use a Dropdown menu.
- Don't use it for free text that may not be in the list — use an Input (a datalist can suggest).

## Combobox — Time zone

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<div class="ayy-field" style="inline-size: min(100%, 20rem)">
  <label class="ayy-label" for="timezone">Time zone</label>
  <ayy-combobox>
    <div class="ayy-combobox">
      <input type="text" role="combobox" aria-autocomplete="list" aria-expanded="false" aria-controls="combobox-basic-1" autocomplete="off" class="ayy-input" id="timezone" placeholder="Search a city" aria-describedby="timezone-hint" value="Lisbon"/>
      <svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M18 9.00005C18 9.00005 13.5811 15 12 15C10.4188 15 6 9 6 9" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg>
      <ul id="combobox-basic-1" class="ayy-combobox__listbox" role="listbox" popover="manual">
        <li role="option" class="ayy-combobox__option" data-value="Europe/Lisbon" data-label="Lisbon" data-keywords="Portugal">Lisbon<span class="ayy-combobox__meta">Portugal</span></li>
        <li role="option" class="ayy-combobox__option" data-value="Europe/London" data-label="London" data-keywords="United Kingdom">London<span class="ayy-combobox__meta">United Kingdom</span></li>
        <li role="option" class="ayy-combobox__option" data-value="Europe/Berlin" data-label="Berlin" data-keywords="Germany">Berlin<span class="ayy-combobox__meta">Germany</span></li>
        <li role="option" class="ayy-combobox__option" data-value="Asia/Jerusalem" data-label="Jerusalem" data-keywords="Israel">Jerusalem<span class="ayy-combobox__meta">Israel</span></li>
        <li role="option" class="ayy-combobox__option" data-value="Asia/Dubai" data-label="Dubai" data-keywords="United Arab Emirates">Dubai<span class="ayy-combobox__meta">United Arab Emirates</span></li>
        <li role="option" class="ayy-combobox__option" data-value="Asia/Tokyo" data-label="Tokyo" data-keywords="Japan">Tokyo<span class="ayy-combobox__meta">Japan</span></li>
        <li role="option" class="ayy-combobox__option" data-value="America/New_York" data-label="New York" data-keywords="United States">New York<span class="ayy-combobox__meta">United States</span></li>
        <li role="option" class="ayy-combobox__option" data-value="America/Sao_Paulo" data-label="São Paulo" data-keywords="Brazil">São Paulo<span class="ayy-combobox__meta">Brazil</span></li>
        <li class="ayy-combobox__empty" role="none" hidden="">No matches</li>
      </ul>
      <input type="hidden" name="timezone" value="Europe/Lisbon"/>
    </div>
  </ayy-combobox>
  <p class="ayy-field__hint" id="timezone-hint">Type a city or a country.</p>
</div>
```

React:

```tsx
import { Combobox, Field, FieldHint, Label } from "ayywi/react";

const zones = [
  { value: "Europe/Lisbon", label: "Lisbon", meta: "Portugal", keywords: "Portugal" },
  { value: "Europe/London", label: "London", meta: "United Kingdom", keywords: "United Kingdom" },
  { value: "Europe/Berlin", label: "Berlin", meta: "Germany", keywords: "Germany" },
  { value: "Asia/Jerusalem", label: "Jerusalem", meta: "Israel", keywords: "Israel" },
  { value: "Asia/Dubai", label: "Dubai", meta: "United Arab Emirates", keywords: "United Arab Emirates" },
  { value: "Asia/Tokyo", label: "Tokyo", meta: "Japan", keywords: "Japan" },
  { value: "America/New_York", label: "New York", meta: "United States", keywords: "United States" },
  { value: "America/Sao_Paulo", label: "São Paulo", meta: "Brazil", keywords: "Brazil" },
];

export default function Example() {
  return (
    <Field style={{ inlineSize: "min(100%, 20rem)" }}>
      <Label htmlFor="timezone">Time zone</Label>
      <Combobox id="timezone" name="timezone" options={zones} defaultValue="Europe/Lisbon" placeholder="Search a city" aria-describedby="timezone-hint" />
      <FieldHint id="timezone-hint">Type a city or a country.</FieldHint>
    </Field>
  );
}
```

---
Part of ayywi 0.4.0: load `dist/ayywi.min.css` (and `dist/elements.global.js` for the <ayy-*> elements). The rules every screen follows: [llms-full.txt#rules](../llms-full.txt#rules). Every component: [llms.txt](../llms.txt).
