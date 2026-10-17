# Input

Category: Forms. Single-line text field and input group. Works for every native input type (text, password, email, search, tel, url, file…) and supports inline addons, icons and action buttons. Also called: input, text-field, textbox, text-input, input-group, input-addon, input-adornment.

**Classes**
- `.ayy-input` — Root, on the <input> itself.
- `.ayy-input--sm` — 28px tall.
- `.ayy-input--lg` — 40px tall.
- `.ayy-input-group` — Root for an input with inline addons, icons or buttons. Draws the field (border, fill, radius, height) and the focus ring while its .ayy-input is focused.
- `.ayy-input-group--sm` — Small height (--ayy-size-control-sm).
- `.ayy-input-group--lg` — Large height (--ayy-size-control-lg).
- `.ayy-input-group__addon` — Text beside the input: a prefix (https://), a suffix (USD, %) or a Kbd hint. Muted, one line.

**States**
- `default` — Wash fill, 1px line-strong border, control radius; placeholder in muted at 70%. In an input group, addons and icons are muted and the input loses its own border.
- `hover` (`:hover`) — Border turns line-hover.
- `pressed` — doesn't apply: Text fields have no pressed look; the caret shows where you are. Trailing buttons keep their own pressed look.
- `focus` (`:focus-visible, or .ayy-input-group:has(> .ayy-input:focus-visible)`) — 2px ring drawn just inside the edge (-1px offset); the border goes transparent. In an input group, the ring moves to the group container.
- `disabled` (`:disabled, or .ayy-input-group:has(> .ayy-input:disabled)`) — --ayy-opacity-disabled, not-allowed cursor.
- `selected` — doesn't apply: Not a choice control.
- `error` (`aria-invalid="true" (with a FieldError)`) — Border 60% destructive; the focus ring turns destructive. Forced colours: dashed border.
- `loading` — doesn't apply: No loading look. While a value is checked (a username), use an Input group with a small Spinner as its addon.

**Sizes**
- `sm` — Control sm height (28px compact, 32 comfortable, 40 touch), tighter padding, sm text.
- `md` (default) — Control md height (32px compact, 40 comfortable, 44 touch).
- `lg` — Control lg height (40px compact, 48 comfortable, 52 touch), more padding, lg text.
- Density — Height and text size follow data-density; touch keeps md text at 16px so iOS doesn't zoom.
- Width — Fills its container (inline-size 100%); set a max-inline-size in rem for short values.

**React** — `import { Input, InputGroup, InputGroupAddon } from "@danitesler/ayywi/react";`
- `<Input>` renders <input>. Props: `size` "sm" | "md" | "lg" (visual size; native size attr not exposed); `...rest` All native <input> attributes.
- `<InputGroup>` renders <div class="ayy-input-group">. Props: `size` "sm" | "md" | "lg"; `...rest` All native <div> attributes.
- `<InputGroupAddon>` renders <span class="ayy-input-group__addon">. Props: `...rest` All native <span> attributes.

**Accessibility**
- Every input needs a label: wrap in a Field with a Label (for/id), or aria-label for search boxes.
- The input inside an InputGroup still needs its own label; icons and addons do not name it.
- Errors: aria-invalid="true" + aria-describedby pointing at the error text.
- Action buttons inside an InputGroup (show password, clear) must have an accessible aria-label and aria-pressed where applicable.

**Do**
- Use an input for short free-text entry: names, URLs, search, API keys, passwords.
- Use an InputGroup when an input needs a leading icon, a prefix/suffix unit, or a trailing action button.
- Match the input size to neighbouring buttons in a toolbar (sm with sm).

**Don't**
- Don't use an input for multi-line text — use Textarea.
- Don't use an input for on/off — use Switch.
- Don't use placeholder as the label.
- Don't hardcode widths in px inside flexible layouts — the input fills its container.
- Don't use an input for picking dates or times — use Date & time picker (DatePicker, DateRange, TimePicker, DateTimePicker).
- Don't stack more than one addon on each side of an InputGroup.
- Don't put a primary action button inside an InputGroup — place a Button next to it.

## Input — Sizes

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<div class="ayy-stack" style="inline-size: min(100%, 20rem); gap: var(--ayy-space-3);">
  <input class="ayy-input ayy-input--sm" placeholder="Small input" aria-label="Small input" />
  <input class="ayy-input" placeholder="Medium input" aria-label="Medium input" />
  <input class="ayy-input ayy-input--lg" placeholder="Large input" aria-label="Large input" />
</div>
```

React:

```tsx
import { Input } from "@danitesler/ayywi/react";

export default function Example() {
  return (
    <div className="ayy-stack" style={{ inlineSize: "min(100%, 20rem)", gap: "var(--ayy-space-3)" }}>
      <Input size="sm" placeholder="Small input" aria-label="Small input" />
      <Input placeholder="Medium input" aria-label="Medium input" />
      <Input size="lg" placeholder="Large input" aria-label="Large input" />
    </div>
  );
}
```

## Input — Input types

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<div class="ayy-stack" style="inline-size: min(100%, 20rem); gap: var(--ayy-space-3);">
  <input class="ayy-input" placeholder="Text input" aria-label="Text input" />
  <input class="ayy-input" type="password" placeholder="Password input" value="secret-passphrase" aria-label="Password input" />
  <input class="ayy-input" type="email" placeholder="Email input (you@example.com)" aria-label="Email input" />
  <input class="ayy-input" type="tel" placeholder="Phone input (+1 555 000-0000)" aria-label="Phone input" />
  <input class="ayy-input" type="url" placeholder="URL input (https://example.com)" aria-label="URL input" />
  <input class="ayy-input" type="search" placeholder="Search input…" aria-label="Search input" />
  <input class="ayy-input" type="file" aria-label="File upload" />
  <input class="ayy-input" placeholder="Disabled input" aria-label="Disabled input" disabled />
</div>
```

React:

```tsx
import { Input } from "@danitesler/ayywi/react";

export default function Example() {
  return (
    <div className="ayy-stack" style={{ inlineSize: "min(100%, 20rem)", gap: "var(--ayy-space-3)" }}>
      <Input placeholder="Text input" aria-label="Text input" />
      <Input type="password" placeholder="Password input" defaultValue="secret-passphrase" aria-label="Password input" />
      <Input type="email" placeholder="Email input (you@example.com)" aria-label="Email input" />
      <Input type="tel" placeholder="Phone input (+1 555 000-0000)" aria-label="Phone input" />
      <Input type="url" placeholder="URL input (https://example.com)" aria-label="URL input" />
      <Input type="search" placeholder="Search input…" aria-label="Search input" />
      <Input type="file" aria-label="File upload" />
      <Input disabled placeholder="Disabled input" aria-label="Disabled input" />
    </div>
  );
}
```

## Input — Input group & addons

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<div class="ayy-stack" style="inline-size: min(100%, 24rem); --ayy-gap: var(--ayy-space-4)">
  <div class="ayy-field">
    <label class="ayy-label" for="ig-search">Search</label>
    <div class="ayy-input-group">
      <svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M17 17L21 21" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/><path d="M19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19C15.4183 19 19 15.4183 19 11Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/></svg>
      <input type="search" class="ayy-input" id="ig-search" placeholder="Search conversations" aria-keyshortcuts="/" />
      <span class="ayy-input-group__addon">
        <kbd class="ayy-kbd">/</kbd>
      </span>
    </div>
  </div>

  <div class="ayy-field">
    <label class="ayy-label" for="ig-site">Website</label>
    <div class="ayy-input-group">
      <span class="ayy-input-group__addon">https://</span>
      <input type="text" class="ayy-input" id="ig-site" placeholder="northwind.app" autocomplete="url" />
    </div>
  </div>

  <div class="ayy-field">
    <label class="ayy-label" for="ig-price">Price</label>
    <div class="ayy-input-group">
      <input type="text" class="ayy-input" id="ig-price" inputmode="decimal" value="24.00" aria-describedby="ig-price-hint" />
      <span class="ayy-input-group__addon">USD</span>
    </div>
    <p class="ayy-field__hint" id="ig-price-hint">Per editor, per month.</p>
  </div>

  <div class="ayy-field">
    <label class="ayy-label" for="ig-token">Access token</label>
    <div class="ayy-input-group">
      <input type="text" class="ayy-input ayy-mono" id="ig-token" value="ayy_tok_9x8f7d6e5c" readonly />
      <ayy-tooltip class="ayy-tooltip">
        <button type="button" class="ayy-button ayy-button--ghost ayy-button--icon-sm" aria-label="Copy token" onclick="navigator.clipboard?.writeText('ayy_tok_9x8f7d6e5c'); ayywi.toast('Access token copied to clipboard')">
          <svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7.5 14.5C7.5 11.2002 7.5 9.55025 8.52513 8.52513C9.55025 7.5 11.2002 7.5 14.5 7.5C17.7998 7.5 19.4497 7.5 20.4749 8.52513C21.5 9.55025 21.5 11.2002 21.5 14.5C21.5 17.7998 21.5 19.4497 20.4749 20.4749C19.4497 21.5 17.7998 21.5 14.5 21.5C11.2002 21.5 9.55025 21.5 8.52513 20.4749C7.5 19.4497 7.5 17.7998 7.5 14.5Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/><path d="M7.5 16.5C6.10355 16.5 5.40533 16.5 4.84402 16.3036C3.83866 15.9518 3.0482 15.1613 2.69641 14.156C2.5 13.5947 2.5 12.8964 2.5 11.5V9.5C2.5 6.20017 2.5 4.55025 3.52513 3.52513C4.55025 2.5 6.20017 2.5 9.5 2.5H11.5C12.8964 2.5 13.5947 2.5 14.156 2.69641C15.1613 3.0482 15.9518 3.83866 16.3036 4.84402C16.5 5.40533 16.5 6.10355 16.5 7.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/></svg>
        </button>
        <span class="ayy-tooltip__content" role="tooltip">Copy token</span>
      </ayy-tooltip>
    </div>
  </div>

  <div class="ayy-field">
    <label class="ayy-label" for="ig-password">Password</label>
    <div class="ayy-input-group">
      <input type="password" class="ayy-input" id="ig-password" value="secret-passphrase" autocomplete="current-password" />
      <ayy-tooltip class="ayy-tooltip">
        <button type="button" class="ayy-button ayy-button--ghost ayy-button--icon-sm" aria-label="Show password" onclick="const inp = document.getElementById('ig-password'); const show = inp.type === 'password'; inp.type = show ? 'text' : 'password'; this.setAttribute('aria-label', show ? 'Hide password' : 'Show password'); const tip = this.closest('.ayy-tooltip')?.querySelector('.ayy-tooltip__content'); if (tip) tip.textContent = show ? 'Hide password' : 'Show password'; ayywi.toast(show ? 'Password revealed' : 'Password hidden')">
          <svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M21.544 11.045C21.848 11.4713 22 11.6845 22 12C22 12.3155 21.848 12.5287 21.544 12.955C20.1779 14.8706 16.6892 19 12 19C7.31078 19 3.8221 14.8706 2.45604 12.955C2.15201 12.5287 2 12.3155 2 12C2 11.6845 2.15201 11.4713 2.45604 11.045C3.8221 9.12944 7.31078 5 12 5C16.6892 5 20.1779 9.12944 21.544 11.045Z" stroke="currentColor" stroke-width="1.5"/><path d="M15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15C13.6569 15 15 13.6569 15 12Z" stroke="currentColor" stroke-width="1.5"/></svg>
        </button>
        <span class="ayy-tooltip__content" role="tooltip">Show password</span>
      </ayy-tooltip>
      <ayy-tooltip class="ayy-tooltip">
        <button type="button" class="ayy-button ayy-button--ghost ayy-button--icon-sm" aria-label="Copy password" onclick="navigator.clipboard?.writeText(document.getElementById('ig-password').value); ayywi.toast('Password copied to clipboard')">
          <svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7.5 14.5C7.5 11.2002 7.5 9.55025 8.52513 8.52513C9.55025 7.5 11.2002 7.5 14.5 7.5C17.7998 7.5 19.4497 7.5 20.4749 8.52513C21.5 9.55025 21.5 11.2002 21.5 14.5C21.5 17.7998 21.5 19.4497 20.4749 20.4749C19.4497 21.5 17.7998 21.5 14.5 21.5C11.2002 21.5 9.55025 21.5 8.52513 20.4749C7.5 19.4497 7.5 17.7998 7.5 14.5Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/><path d="M7.5 16.5C6.10355 16.5 5.40533 16.5 4.84402 16.3036C3.83866 15.9518 3.0482 15.1613 2.69641 14.156C2.5 13.5947 2.5 12.8964 2.5 11.5V9.5C2.5 6.20017 2.5 4.55025 3.52513 3.52513C4.55025 2.5 6.20017 2.5 9.5 2.5H11.5C12.8964 2.5 13.5947 2.5 14.156 2.69641C15.1613 3.0482 15.9518 3.83866 16.3036 4.84402C16.5 5.40533 16.5 6.10355 16.5 7.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/></svg>
        </button>
        <span class="ayy-tooltip__content" role="tooltip">Copy password</span>
      </ayy-tooltip>
    </div>
  </div>
</div>
```

React:

```tsx
import { Copy01Icon, Search01Icon, ViewIcon, ViewOffSlashIcon } from "@hugeicons/core-free-icons";
import { type CSSProperties, useState } from "react";
import { Button, Field, FieldHint, Icon, Input, InputGroup, InputGroupAddon, Kbd, Label, Tooltip, toast } from "@danitesler/ayywi/react";

export default function Example() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="ayy-stack" style={{ inlineSize: "min(100%, 24rem)", "--ayy-gap": "var(--ayy-space-4)" } as CSSProperties}>
      <Field>
        <Label htmlFor="ig-search">Search</Label>
        <InputGroup>
          <Icon icon={Search01Icon} />
          <Input id="ig-search" type="search" placeholder="Search conversations" aria-keyshortcuts="/" />
          <InputGroupAddon>
            <Kbd>/</Kbd>
          </InputGroupAddon>
        </InputGroup>
      </Field>

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
        <Label htmlFor="ig-token">Access token</Label>
        <InputGroup>
          <Input id="ig-token" defaultValue="ayy_tok_9x8f7d6e5c" readOnly className="ayy-mono" />
          <Tooltip content="Copy token">
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label="Copy token"
              onClick={() => {
                navigator.clipboard?.writeText("ayy_tok_9x8f7d6e5c");
                toast("Access token copied to clipboard");
              }}
            >
              <Icon icon={Copy01Icon} />
            </Button>
          </Tooltip>
        </InputGroup>
      </Field>

      <Field>
        <Label htmlFor="ig-password">Password</Label>
        <InputGroup>
          <Input
            id="ig-password"
            type={showPassword ? "text" : "password"}
            defaultValue="secret-passphrase"
            autoComplete="current-password"
          />
          <Tooltip content={showPassword ? "Hide password" : "Show password"}>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
              onClick={() => {
                const next = !showPassword;
                setShowPassword(next);
                toast(next ? "Password revealed" : "Password hidden");
              }}
            >
              <Icon icon={showPassword ? ViewOffSlashIcon : ViewIcon} />
            </Button>
          </Tooltip>
          <Tooltip content="Copy password">
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label="Copy password"
              onClick={() => {
                navigator.clipboard?.writeText("secret-passphrase");
                toast("Password copied to clipboard");
              }}
            >
              <Icon icon={Copy01Icon} />
            </Button>
          </Tooltip>
        </InputGroup>
      </Field>
    </div>
  );
}
```

## Input — Validation error

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<div class="ayy-field" style="inline-size: min(100%, 20rem)">
  <label class="ayy-label" for="api-key-html">API key</label>
  <input class="ayy-input" id="api-key-html" value="sk-123" aria-invalid="true" aria-describedby="api-key-html-error" />
  <p class="ayy-field__error" id="api-key-html-error">Key looks too short.</p>
</div>
```

React:

```tsx
import { Field, FieldError, Input, Label } from "@danitesler/ayywi/react";

export default function Example() {
  return (
    <Field style={{ inlineSize: "min(100%, 20rem)" }}>
      <Label htmlFor="api-key">API key</Label>
      <Input id="api-key" defaultValue="sk-123" aria-invalid="true" aria-describedby="api-key-error" />
      <FieldError id="api-key-error">Key looks too short.</FieldError>
    </Field>
  );
}
```

---
Part of @danitesler/ayywi 0.1.0: load `dist/ayywi.min.css` (and `dist/elements.global.js` for the <ayy-*> elements). The rules every screen follows: [llms-full.txt#rules](../llms-full.txt#rules). Every component: [llms.txt](../llms.txt).
