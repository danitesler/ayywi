# PIN input

Category: Forms. One box per character for verification codes, two-factor authentication tokens and passcodes. Typing advances to the next box, Backspace steps back, and pasting or SMS autofill fills the whole code at once. Also called: pin-input, otp-input, otp, pin-field, verification-code, passcode-input.

**Classes**
- `.ayy-pin-input` — Root group (role="group", direction ltr so codes always read left to right).
- `.ayy-pin-input--sm` — Small slots (--ayy-size-control-sm square, sm text).
- `.ayy-pin-input--lg` — Large slots (--ayy-size-control-lg square, lg text).
- `.ayy-pin-input__group` — Tighter cluster of slots when a code is split into halves (e.g. 3 + 3).
- `.ayy-pin-input__separator` — Muted dash between slot groups (aria-hidden="true").
- `.ayy-pin-input__slot` — Each character <input>: monospace, centred, tabular-nums.

**States**
- `default` — Square wash boxes with 1px line-strong borders, centred monospace digits.
- `hover` (`.ayy-pin-input__slot:hover (hover devices)`) — Slot border turns --ayy-color-line-hover.
- `pressed` — doesn't apply: Text slots have no pressed look; clicking focuses and selects the slot.
- `focus` (`.ayy-pin-input__slot:focus-visible`) — 2px --ayy-color-ring outline (-1px offset); the slot border goes transparent.
- `disabled` (`disabled on the slots`) — --ayy-opacity-disabled, not-allowed cursor. Forced colours: GrayText.
- `selected` — doesn't apply: Not a choice control.
- `error` (`aria-invalid="true" on .ayy-pin-input or .ayy-pin-input__slot (with a FieldError)`) — 60% destructive border and destructive focus ring. Forced colours: dashed border.
- `loading` — doesn't apply: Disable the slots and show a Spinner on the verify Button while checking the code.

**Sizes**
- `sm` — Square at --ayy-size-control-sm (28px compact, 32 comfortable, 40 touch), sm text.
- `md` (default) — Square at --ayy-size-control-md (32px compact, 40 comfortable, 44 touch), field text.
- `lg` — Square at --ayy-size-control-lg (40px compact, 48 comfortable, 52 touch), lg text.
- Density — Slot width, height and text size follow data-density across all steps.
- Width — Hugs its slots and separators.

**Custom element** `<ayy-pin-input>` (@danitesler/ayywi/elements) — An .ayy-pin-input containing .ayy-pin-input__slot <input> elements (optionally grouped in .ayy-pin-input__group with .ayy-pin-input__separator).
- attribute `type`: numeric | alphanumeric
- attribute `mask`: Render slots as password dots.
- attribute `name`: Form field name: syncs a hidden input with the combined code.
- event `ayy-change`: { value: string } — fired whenever the code changes.
- event `ayy-complete`: { value: string } — fired once every slot is filled.

**React** — `import { PinInput } from "@danitesler/ayywi/react";`
- `<PinInput>` renders <div role="group" class="ayy-pin-input"> of .ayy-pin-input__slot <input> elements. Props: `length` number — total slots when groups is omitted (default 6).; `groups` number[] — split slots into groups with a dash between them, e.g. [3, 3].; `type` "numeric" | "alphanumeric" — allowed characters (default "numeric").; `mask` boolean — hide entered characters as password dots.; `size` "sm" | "md" | "lg"; `value / defaultValue` string — current or initial code.; `onValueChange` (value: string) => void; `onComplete` (value: string) => void — called once all slots are filled.; `disabled` boolean; `invalid` boolean — sets aria-invalid="true" on the group and slots.; `name` string — renders a hidden input carrying the combined code.; `autoFocus` boolean — focuses the first slot on mount.; `placeholder` string — placeholder character per empty slot.; `slotLabel` (index: number, total: number) => string — accessible label per slot.; `...rest` All native <div> attributes on the group.

**Accessibility**
- Wrap in a Field with a Label (or aria-labelledby on the group), and keep each slot's aria-label ("Digit 1 of 6").
- The first slot carries autocomplete="one-time-code" so SMS and password-manager autofill populate the whole code.
- Digits always read left to right even in RTL layouts; ArrowLeft and ArrowRight move visually between slots.

**Do**
- Use a PIN input for fixed-length verification codes, authenticator tokens, backup codes and numeric PINs.
- Group 6- or 8-character codes as [3, 3] or [4, 4] so people can scan and compare them at a glance.
- Accept pasted codes containing spaces or dashes — connectPinInput strips them automatically.

**Don't**
- Don't use a PIN input for variable-length passwords or API keys — use Input.
- Don't auto-submit destructive actions on completion without a way to review or cancel.

## PIN input — Verification code & masked PIN

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<!-- <ayy-pin-input> wires auto-advance, Backspace and paste across .ayy-pin-input__slot inputs. -->
<div class="ayy-stack" style="--ayy-gap: var(--ayy-space-5); max-inline-size: 24rem">
  <div class="ayy-field">
    <label class="ayy-label" id="otp-label-html" for="otp-code-html">Authenticator code</label>
    <ayy-pin-input>
      <div role="group" class="ayy-pin-input" aria-labelledby="otp-label-html">
        <div class="ayy-pin-input__group">
          <input id="otp-code-html" type="text" inputmode="numeric" autocomplete="one-time-code" autocapitalize="characters" spellcheck="false" maxlength="6" aria-label="Digit 1 of 6" class="ayy-pin-input__slot" value="" />
          <input type="text" inputmode="numeric" autocomplete="off" autocapitalize="characters" spellcheck="false" maxlength="1" aria-label="Digit 2 of 6" class="ayy-pin-input__slot" value="" />
          <input type="text" inputmode="numeric" autocomplete="off" autocapitalize="characters" spellcheck="false" maxlength="1" aria-label="Digit 3 of 6" class="ayy-pin-input__slot" value="" />
        </div>
        <span class="ayy-pin-input__separator" aria-hidden="true">–</span>
        <div class="ayy-pin-input__group">
          <input type="text" inputmode="numeric" autocomplete="off" autocapitalize="characters" spellcheck="false" maxlength="1" aria-label="Digit 4 of 6" class="ayy-pin-input__slot" value="" />
          <input type="text" inputmode="numeric" autocomplete="off" autocapitalize="characters" spellcheck="false" maxlength="1" aria-label="Digit 5 of 6" class="ayy-pin-input__slot" value="" />
          <input type="text" inputmode="numeric" autocomplete="off" autocapitalize="characters" spellcheck="false" maxlength="1" aria-label="Digit 6 of 6" class="ayy-pin-input__slot" value="" />
        </div>
      </div>
    </ayy-pin-input>
    <p class="ayy-field__hint">Enter or paste the 6-digit code (try 482910).</p>
  </div>

  <div class="ayy-field">
    <label class="ayy-label" id="pin-mask-label-html" for="card-pin-html">Card PIN</label>
    <ayy-pin-input mask>
      <div role="group" class="ayy-pin-input" aria-labelledby="pin-mask-label-html">
        <input id="card-pin-html" type="password" inputmode="numeric" autocomplete="one-time-code" autocapitalize="characters" spellcheck="false" maxlength="4" aria-label="Digit 1 of 4" class="ayy-pin-input__slot" value="1" />
        <input type="password" inputmode="numeric" autocomplete="off" autocapitalize="characters" spellcheck="false" maxlength="1" aria-label="Digit 2 of 4" class="ayy-pin-input__slot" value="9" />
        <input type="password" inputmode="numeric" autocomplete="off" autocapitalize="characters" spellcheck="false" maxlength="1" aria-label="Digit 3 of 4" class="ayy-pin-input__slot" value="8" />
        <input type="password" inputmode="numeric" autocomplete="off" autocapitalize="characters" spellcheck="false" maxlength="1" aria-label="Digit 4 of 4" class="ayy-pin-input__slot" value="4" />
      </div>
    </ayy-pin-input>
  </div>

  <div class="ayy-field">
    <label class="ayy-label" id="backup-label-html" for="invite-code-html">Invite code (alphanumeric)</label>
    <ayy-pin-input type="alphanumeric">
      <div role="group" class="ayy-pin-input ayy-pin-input--sm" aria-labelledby="backup-label-html">
        <div class="ayy-pin-input__group">
          <input id="invite-code-html" type="text" inputmode="text" autocomplete="one-time-code" autocapitalize="characters" spellcheck="false" maxlength="8" placeholder="·" aria-label="Character 1 of 8" class="ayy-pin-input__slot" value="" />
          <input type="text" inputmode="text" autocomplete="off" autocapitalize="characters" spellcheck="false" maxlength="1" placeholder="·" aria-label="Character 2 of 8" class="ayy-pin-input__slot" value="" />
          <input type="text" inputmode="text" autocomplete="off" autocapitalize="characters" spellcheck="false" maxlength="1" placeholder="·" aria-label="Character 3 of 8" class="ayy-pin-input__slot" value="" />
          <input type="text" inputmode="text" autocomplete="off" autocapitalize="characters" spellcheck="false" maxlength="1" placeholder="·" aria-label="Character 4 of 8" class="ayy-pin-input__slot" value="" />
        </div>
        <span class="ayy-pin-input__separator" aria-hidden="true">–</span>
        <div class="ayy-pin-input__group">
          <input type="text" inputmode="text" autocomplete="off" autocapitalize="characters" spellcheck="false" maxlength="1" placeholder="·" aria-label="Character 5 of 8" class="ayy-pin-input__slot" value="" />
          <input type="text" inputmode="text" autocomplete="off" autocapitalize="characters" spellcheck="false" maxlength="1" placeholder="·" aria-label="Character 6 of 8" class="ayy-pin-input__slot" value="" />
          <input type="text" inputmode="text" autocomplete="off" autocapitalize="characters" spellcheck="false" maxlength="1" placeholder="·" aria-label="Character 7 of 8" class="ayy-pin-input__slot" value="" />
          <input type="text" inputmode="text" autocomplete="off" autocapitalize="characters" spellcheck="false" maxlength="1" placeholder="·" aria-label="Character 8 of 8" class="ayy-pin-input__slot" value="" />
        </div>
      </div>
    </ayy-pin-input>
  </div>
</div>
```

React:

```tsx
import { useState } from "react";
import { Field, FieldError, FieldHint, Label, PinInput, toast } from "@danitesler/ayywi/react";

export default function Example() {
  const [code, setCode] = useState("");
  const invalid = code.length === 6 && code !== "482910";

  return (
    <div className="ayy-stack" style={{ "--ayy-gap": "var(--ayy-space-5)", maxInlineSize: "24rem" } as React.CSSProperties}>
      <Field>
        <Label id="otp-label" htmlFor="otp-code">
          Authenticator code
        </Label>
        <PinInput
          id="otp-code"
          aria-labelledby="otp-label"
          groups={[3, 3]}
          value={code}
          invalid={invalid}
          onValueChange={setCode}
          onComplete={(next) => {
            if (next === "482910") toast.success("Code verified");
          }}
        />
        {invalid ? (
          <FieldError>That code didn’t match. Try 482910.</FieldError>
        ) : (
          <FieldHint>Enter or paste the 6-digit code (try 482910).</FieldHint>
        )}
      </Field>

      <Field>
        <Label id="pin-mask-label" htmlFor="card-pin">
          Card PIN
        </Label>
        <PinInput id="card-pin" aria-labelledby="pin-mask-label" length={4} mask defaultValue="1984" />
      </Field>

      <Field>
        <Label id="backup-label" htmlFor="invite-code">
          Invite code (alphanumeric)
        </Label>
        <PinInput id="invite-code" aria-labelledby="backup-label" groups={[4, 4]} type="alphanumeric" size="sm" placeholder="·" />
      </Field>
    </div>
  );
}
```

---
Part of @danitesler/ayywi 0.1.2: load `dist/ayywi.min.css` (and `dist/elements.global.js` for the <ayy-*> elements). The rules every screen follows: [llms-full.txt#rules](../llms-full.txt#rules). Every component: [llms.txt](../llms.txt).
