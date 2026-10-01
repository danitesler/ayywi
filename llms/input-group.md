# Input group

Category: Forms. An input with things attached inside its box: a leading icon, a prefix or suffix, a keyboard hint, or a small button (clear, copy, show password). The group draws the field and the focus ring.

**Classes**
- `.ayy-input-group` — Root. Draws the field (border, fill, radius, height) and the focus ring while its .ayy-input is focused. The .ayy-input inside, a direct child, loses its own border and takes the free space. An <svg> child is sized as a small icon; a .ayy-button at either end sits flush with the edge.
- `.ayy-input-group--sm` — Small height (--ayy-size-control-sm).
- `.ayy-input-group--lg` — Large height (--ayy-size-control-lg).
- `.ayy-input-group__addon` — Text beside the input: a prefix (https://), a suffix (USD, %) or a Kbd hint. Muted, one line.

**JS (framework-free)**: inputGroupClass({ size?, className? }) → string; inputGroupAddonClass constant.

**React** — `import { InputGroup, InputGroupAddon, Input } from "ayywi/react";`
- `<InputGroup>` renders <div class="ayy-input-group">. Props: `size` "sm" | "md" | "lg"
- `<InputGroupAddon>` renders <span class="ayy-input-group__addon">.

**Accessibility**
- The input still needs its own label (<label for>, or aria-label on a search field); the icon and addons don't name it.
- Put units and prefixes in the label or in aria-describedby too ("Price, in USD"), since the addon text isn't part of the input's name.
- An icon-only button in the group needs an aria-label ("Clear search", "Show password").
- aria-invalid="true" on the input tints the group's border, like a plain Input.

**Do**
- Use an input group for a search field with a magnifier icon, a URL or price with a prefix or suffix, or an input with one inline action.
- Keep the size of the group the same as the inputs around it (size on the group, not the input).
- Use a Kbd in an addon to show the shortcut that focuses a search field.

**Don't**
- Don't put a primary action (Save, Subscribe) inside the field — place a Button next to it.
- Don't stack more than one addon on each side.
- Don't use it to fake a select or a combobox — use Select.
- Don't set a size on the Input inside; set it on the group.

## Input group — Search with icon and shortcut

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<div class="ayy-stack" style="inline-size: min(100%, 22rem)">
  <div class="ayy-input-group">
    <svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M17 17L21 21" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19C15.4183 19 19 15.4183 19 11Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg>
    <input type="search" class="ayy-input" placeholder="Search conversations" aria-label="Search conversations" aria-keyshortcuts="/"/>
    <span class="ayy-input-group__addon"><kbd class="ayy-kbd">/</kbd></span>
  </div>
  <div class="ayy-input-group ayy-input-group--sm">
    <svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M17 17L21 21" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19C15.4183 19 19 15.4183 19 11Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg>
    <input type="search" class="ayy-input" placeholder="Filter" aria-label="Filter invoices"/>
  </div>
</div>
```

React:

```tsx
import { Search01Icon } from "@hugeicons/core-free-icons";
import { Icon, Input, InputGroup, InputGroupAddon, Kbd } from "ayywi/react";

export default function Example() {
  return (
    <div className="ayy-stack" style={{ inlineSize: "min(100%, 22rem)" }}>
      <InputGroup>
        <Icon icon={Search01Icon} />
        <Input type="search" placeholder="Search conversations" aria-label="Search conversations" aria-keyshortcuts="/" />
        <InputGroupAddon>
          <Kbd>/</Kbd>
        </InputGroupAddon>
      </InputGroup>
      <InputGroup size="sm">
        <Icon icon={Search01Icon} />
        <Input type="search" placeholder="Filter" aria-label="Filter invoices" />
      </InputGroup>
    </div>
  );
}
```

## Input group — Prefix, suffix and a button

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<div class="ayy-stack" style="inline-size: min(100%, 24rem); --ayy-gap: var(--ayy-space-4)">
  <div class="ayy-field">
    <label class="ayy-label" for="ig-site">Website</label>
    <div class="ayy-input-group">
      <span class="ayy-input-group__addon">https://</span>
      <input type="text" class="ayy-input" id="ig-site" placeholder="northwind.app" autocomplete="url"/>
    </div>
  </div>
  <div class="ayy-field">
    <label class="ayy-label" for="ig-price">Price</label>
    <div class="ayy-input-group">
      <input type="text" class="ayy-input" id="ig-price" inputmode="decimal" aria-describedby="ig-price-hint" value="24.00"/>
      <span class="ayy-input-group__addon">USD</span>
    </div>
    <p class="ayy-field__hint" id="ig-price-hint">Per editor, per month.</p>
  </div>
  <div class="ayy-field">
    <label class="ayy-label" for="ig-key">API key</label>
    <div class="ayy-input-group">
      <input type="password" class="ayy-input ayy-mono" id="ig-key" readonly="" value="sk_live_8f2c1d"/>
      <button type="button" class="ayy-button ayy-button--ghost ayy-button--icon-sm" aria-label="Show key"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M21.544 11.045C21.848 11.4713 22 11.6845 22 12C22 12.3155 21.848 12.5287 21.544 12.955C20.1779 14.8706 16.6892 19 12 19C7.31078 19 3.8221 14.8706 2.45604 12.955C2.15201 12.5287 2 12.3155 2 12C2 11.6845 2.15201 11.4713 2.45604 11.045C3.8221 9.12944 7.31078 5 12 5C16.6892 5 20.1779 9.12944 21.544 11.045Z" stroke="currentColor" stroke-width="1.5"></path><path d="M15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15C13.6569 15 15 13.6569 15 12Z" stroke="currentColor" stroke-width="1.5"></path></svg></button>
      <button type="button" class="ayy-button ayy-button--ghost ayy-button--icon-sm" aria-label="Copy key"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7.5 14.5C7.5 11.2002 7.5 9.55025 8.52513 8.52513C9.55025 7.5 11.2002 7.5 14.5 7.5C17.7998 7.5 19.4497 7.5 20.4749 8.52513C21.5 9.55025 21.5 11.2002 21.5 14.5C21.5 17.7998 21.5 19.4497 20.4749 20.4749C19.4497 21.5 17.7998 21.5 14.5 21.5C11.2002 21.5 9.55025 21.5 8.52513 20.4749C7.5 19.4497 7.5 17.7998 7.5 14.5Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M7.5 16.5C6.10355 16.5 5.40533 16.5 4.84402 16.3036C3.83866 15.9518 3.0482 15.1613 2.69641 14.156C2.5 13.5947 2.5 12.8964 2.5 11.5V9.5C2.5 6.20017 2.5 4.55025 3.52513 3.52513C4.55025 2.5 6.20017 2.5 9.5 2.5H11.5C12.8964 2.5 13.5947 2.5 14.156 2.69641C15.1613 3.0482 15.9518 3.83866 16.3036 4.84402C16.5 5.40533 16.5 6.10355 16.5 7.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg></button>
    </div>
  </div>
</div>
```

React:

```tsx
import { Copy01Icon, ViewIcon } from "@hugeicons/core-free-icons";
import type { CSSProperties } from "react";
import { Button, Field, FieldHint, Icon, Input, InputGroup, InputGroupAddon, Label } from "ayywi/react";

export default function Example() {
  return (
    <div className="ayy-stack" style={{ inlineSize: "min(100%, 24rem)", "--ayy-gap": "var(--ayy-space-4)" } as CSSProperties}>
      <Field>
        <Label htmlFor="ig-site">Website</Label>
        <InputGroup>
          <InputGroupAddon>https://</InputGroupAddon>
          <Input id="ig-site" placeholder="northwind.app" autoComplete="url" />
        </InputGroup>
      </Field>
      <Field>
        <Label htmlFor="ig-price">Price</Label>
        <InputGroup>
          <Input id="ig-price" inputMode="decimal" defaultValue="24.00" aria-describedby="ig-price-hint" />
          <InputGroupAddon>USD</InputGroupAddon>
        </InputGroup>
        <FieldHint id="ig-price-hint">Per editor, per month.</FieldHint>
      </Field>
      <Field>
        <Label htmlFor="ig-key">API key</Label>
        <InputGroup>
          <Input id="ig-key" type="password" defaultValue="sk_live_8f2c1d" readOnly className="ayy-mono" />
          <Button variant="ghost" size="icon-sm" aria-label="Show key">
            <Icon icon={ViewIcon} />
          </Button>
          <Button variant="ghost" size="icon-sm" aria-label="Copy key">
            <Icon icon={Copy01Icon} />
          </Button>
        </InputGroup>
      </Field>
    </div>
  );
}
```

---
Part of ayywi 0.4.0: load `dist/ayywi.min.css` (and `dist/elements.global.js` for the <ayy-*> elements). The rules every screen follows: [llms-full.txt#rules](../llms-full.txt#rules). Every component: [llms.txt](../llms.txt).
