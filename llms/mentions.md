# Mentions

Category: Forms. A multi-line text field that opens a floating suggestions list right at the caret when someone types @ or #, for tagging teammates, channels or issues inside comments and notes. Also called: mentions, mention-input, mention-field, at-mentions.

**Classes**
- `.ayy-mentions` — Root wrapper around the textarea, caret anchor and suggestions listbox.
- `.ayy-mentions__textarea` — Placed alongside .ayy-textarea on the <textarea>.
- `.ayy-mentions__anchor` — Hidden zero-width anchor placed at the trigger character to position the popup.
- `.ayy-mentions__listbox` — Popover listbox (.ayy-combobox__listbox) of mention suggestions.
- `.ayy-mentions__option` — One suggestion row (.ayy-combobox__option) with role="option".
- `.ayy-mentions__body` — Name and handle row inside an option.
- `.ayy-mentions__label` — Person or record display name, truncated on overflow.
- `.ayy-mentions__handle` — Muted monospace @handle or #key at the inline end.

**States**
- `default` — Like Textarea: wash fill, 1px line-strong border, resizable vertically; suggestions hidden.
- `hover` (`:hover on the textarea or a suggestion option (hover devices)`) — Textarea border turns line-hover; hovered option gets Combobox's wash-hover.
- `pressed` — doesn't apply: No pressed look; choosing an option inserts the mention at the caret.
- `focus` (`:focus-visible on the textarea`) — 2px --ayy-color-ring outline (-1px offset); focus stays in the textarea while arrows move through suggestions.
- `disabled` (`:disabled on the textarea, or aria-disabled="true" on an option`) — --ayy-opacity-disabled, not-allowed cursor.
- `selected` (`aria-selected="true" on the active .ayy-mentions__option`) — --ayy-color-wash-hover fill on the active suggestion. Forced colours: Highlight fill.
- `error` (`aria-invalid="true" on the textarea (with a FieldError)`) — Textarea's 60% destructive border and destructive focus ring.
- `loading` — doesn't apply: No loading look; disable while submitting and show a Spinner on the send Button.
- `open` (`:popover-open on .ayy-mentions__listbox`) — Floating surface-raised list anchored directly under the @ or # character, flipping above near the bottom edge.

**Sizes**
- Density — Textarea and option rows follow control md text and data-density.
- Width — Textarea fills its container; popup is 13rem to 20rem wide.

**Custom element** `<ayy-mentions>` (@danitesler/ayywi/elements) — An .ayy-mentions holding a <textarea class="ayy-textarea ayy-mentions__textarea"> and an .ayy-mentions__listbox of [role="option"] items.
- attribute `triggers`: Space-separated trigger characters (default "@", e.g. "@ #").
- event `ayy-mention`: { trigger: string, value: string, label: string, text: string } — fired when a suggestion is inserted.

**React** — `import { Mentions } from "@danitesler/ayywi/react";`
- `<Mentions>` renders <div class="ayy-mentions"> wrapping <textarea>, caret anchor and <ul role="listbox">. Props: `options` MentionOption[] — id, label, value?, trigger?, icon?, keywords?, disabled?; `triggers` string[] — trigger characters (default ["@"]).; `onValueChange` (value: string) => void; `onMention` (option: MentionOption, detail: MentionInsertDetail) => void; `autosize` boolean — grow vertically with content.; `mono` boolean — monospace font.; `className` string — on the outer .ayy-mentions wrapper.; `...rest` All native <textarea> attributes (value, defaultValue, rows, placeholder…).

**Accessibility**
- Label the textarea with Field + Label (htmlFor/id), just like Textarea.
- Focus stays inside the textarea: ArrowUp and ArrowDown update aria-activedescendant, Enter or Tab inserts, and Escape closes the popup without closing a parent Dialog.
- Triggers only fire at the start of a line or after whitespace/punctuation, so typing email addresses never opens the popup.

**Do**
- Use Mentions for comments, review notes, chat composers and issue descriptions where people reference teammates (@) or records (#).
- Pass keywords on options (such as role or full handle) so people find teammates either by name or username.

**Don't**
- Don't use Mentions to pick a list of assignees without prose — use Record picker.
- Don't use Mentions for single-value autocomplete — use Combobox.

## Mentions — Teammate @mentions & #issues

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<!-- <ayy-mentions> opens the suggestion listbox at the caret when @ or # is typed; Enter inserts the active option. -->
<div style="max-inline-size: 30rem">
  <div class="ayy-field">
    <label class="ayy-label" for="review-comment-html">Release note</label>
    <ayy-mentions triggers="@ #">
      <div class="ayy-mentions">
        <textarea aria-autocomplete="list" aria-controls="mentions-listbox-html" class="ayy-textarea ayy-textarea--autosize ayy-mentions__textarea" id="review-comment-html" rows="3" placeholder="Type @ to mention someone or # to link an issue…">Looping in @ada to review #142 before Friday’s release. </textarea>
        <span class="ayy-mentions__anchor" aria-hidden="true"></span>
        <ul id="mentions-listbox-html" role="listbox" aria-label="Suggestions" popover="manual" class="ayy-combobox__listbox ayy-mentions__listbox">
          <li role="option" class="ayy-combobox__option ayy-mentions__option" data-value="ada" data-label="Ada Lovelace" data-trigger="@" data-keywords="engineering lead" aria-selected="false">
            <span role="img" aria-label="Ada Lovelace" class="ayy-avatar ayy-avatar--sm"><span class="ayy-avatar__fallback" aria-hidden="true">AL</span></span>
            <span class="ayy-mentions__body"><span class="ayy-mentions__label">Ada Lovelace</span><span class="ayy-mentions__handle">@ada</span></span>
          </li>
          <li role="option" class="ayy-combobox__option ayy-mentions__option" data-value="grace" data-label="Grace Hopper" data-trigger="@" data-keywords="compiler infra" aria-selected="false">
            <span role="img" aria-label="Grace Hopper" class="ayy-avatar ayy-avatar--sm"><span class="ayy-avatar__fallback" aria-hidden="true">GH</span></span>
            <span class="ayy-mentions__body"><span class="ayy-mentions__label">Grace Hopper</span><span class="ayy-mentions__handle">@grace</span></span>
          </li>
          <li role="option" class="ayy-combobox__option ayy-mentions__option" data-value="alan" data-label="Alan Turing" data-trigger="@" data-keywords="security" aria-selected="false">
            <span role="img" aria-label="Alan Turing" class="ayy-avatar ayy-avatar--sm"><span class="ayy-avatar__fallback" aria-hidden="true">AT</span></span>
            <span class="ayy-mentions__body"><span class="ayy-mentions__label">Alan Turing</span><span class="ayy-mentions__handle">@alan</span></span>
          </li>
          <li role="option" class="ayy-combobox__option ayy-mentions__option" data-value="margaret" data-label="Margaret Hamilton" data-trigger="@" data-keywords="flight systems" aria-selected="false">
            <span role="img" aria-label="Margaret Hamilton" class="ayy-avatar ayy-avatar--sm"><span class="ayy-avatar__fallback" aria-hidden="true">MH</span></span>
            <span class="ayy-mentions__body"><span class="ayy-mentions__label">Margaret Hamilton</span><span class="ayy-mentions__handle">@margaret</span></span>
          </li>
          <li role="option" class="ayy-combobox__option ayy-mentions__option" data-value="142" data-label="Auth token refresh race" data-trigger="#" aria-selected="false">
            <span class="ayy-mentions__body"><span class="ayy-mentions__label">Auth token refresh race</span><span class="ayy-mentions__handle">#142</span></span>
          </li>
          <li role="option" class="ayy-combobox__option ayy-mentions__option" data-value="158" data-label="RTL sidebar resize handle" data-trigger="#" aria-selected="false">
            <span class="ayy-mentions__body"><span class="ayy-mentions__label">RTL sidebar resize handle</span><span class="ayy-mentions__handle">#158</span></span>
          </li>
        </ul>
      </div>
    </ayy-mentions>
    <p class="ayy-field__hint">Type @ for teammates or # for issues; arrows and Enter insert.</p>
  </div>
</div>
```

React:

```tsx
import { useState } from "react";
import { Avatar, Field, FieldHint, Label, Mentions, type MentionOption } from "@danitesler/ayywi/react";

const SUGGESTIONS: MentionOption[] = [
  { id: "ada", label: "Ada Lovelace", icon: <Avatar name="Ada Lovelace" size="sm" />, keywords: "engineering lead" },
  { id: "grace", label: "Grace Hopper", icon: <Avatar name="Grace Hopper" size="sm" />, keywords: "compiler infra" },
  { id: "alan", label: "Alan Turing", icon: <Avatar name="Alan Turing" size="sm" />, keywords: "security" },
  { id: "margaret", label: "Margaret Hamilton", icon: <Avatar name="Margaret Hamilton" size="sm" />, keywords: "flight systems" },
  { id: "142", label: "Auth token refresh race", trigger: "#" },
  { id: "158", label: "RTL sidebar resize handle", trigger: "#" },
];

export default function Example() {
  const [comment, setComment] = useState("Looping in @ada to review #142 before Friday’s release. ");

  return (
    <div style={{ maxInlineSize: "30rem" }}>
      <Field>
        <Label htmlFor="review-comment">Release note</Label>
        <Mentions
          id="review-comment"
          rows={3}
          autosize
          triggers={["@", "#"]}
          options={SUGGESTIONS}
          value={comment}
          onValueChange={setComment}
          placeholder="Type @ to mention someone or # to link an issue…"
        />
        <FieldHint>Type @ for teammates or # for issues; arrows and Enter insert.</FieldHint>
      </Field>
    </div>
  );
}
```

---
Part of @danitesler/ayywi 0.1.2: load `dist/ayywi.min.css` (and `dist/elements.global.js` for the <ayy-*> elements). The rules every screen follows: [llms-full.txt#rules](../llms-full.txt#rules). Every component: [llms.txt](../llms.txt).
