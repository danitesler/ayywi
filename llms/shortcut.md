# Shortcut

Category: Forms. Keyboard shortcuts written once as "Mod+Shift+K" and shown for the device: ⌘ ⇧ K on Apple devices, Ctrl Shift K elsewhere, read aloud as words. Plus a recorder button that listens for a new shortcut (Esc cancels, Backspace clears), and a list of shortcuts for a help sheet.

**Classes**
- `.ayy-shortcut` — A shortcut's keys: a row of .ayy-kbd keycaps (aria-hidden) after an .ayy-sr-only label in words. data-keys holds the shortcut ("Mod+Shift+K") so @danitesler/ayywi/elements redraws it for Apple devices. Always left to right, as in the OS menus, RTL included.
- `.ayy-shortcut-recorder` — A <button> that records a shortcut: shows the current keys or a placeholder, aria-pressed="true" while listening (a pulsing ring). aria-label names the action and the keys.
- `.ayy-shortcut-recorder__placeholder` — The muted text inside the recorder while no shortcut is set, or while listening ("Press keys…").
- `.ayy-shortcut-list` — A <dl> of shortcuts: what each does, then its keys.
- `.ayy-shortcut-list__row` — One <div> in the list holding a <dt> (the action) and a <dd> (an .ayy-shortcut, or typed text like "#tag").

**States**
- `default` — Keycaps (.ayy-kbd) left to right in every language; the recorder is a wash field with a line-strong border showing the keys or a muted placeholder.
- `hover` (`.ayy-shortcut-recorder:hover (devices that hover)`) — The recorder's border turns line-hover.
- `pressed` — doesn't apply: No pressed look; a click starts listening (see selected).
- `focus` (`.ayy-shortcut-recorder:focus-visible`) — 2px ring, 2px offset.
- `disabled` (`.ayy-shortcut-recorder:disabled`) — --ayy-opacity-disabled, not-allowed cursor: managed, or the platform doesn't allow it.
- `selected` (`.ayy-shortcut-recorder[aria-pressed="true"]`) — Listening for keys: a ring-colour border with a slow pulse around it, and "Press keys…". Esc cancels, Backspace clears. Forced colours: Highlight outline.
- `error` (`.ayy-shortcut-recorder[aria-invalid="true"]`) — A destructive border. Say what it clashes with in a hint.
- `loading` — doesn't apply: Recording is instant; no loading look.

**Sizes**
- Density — The recorder is the md control height (32px compact, 40 comfortable, 44 touch); keycaps follow the text around them.
- Width — Keycaps hug their keys. The recorder is at least 9rem; the list fills its container.

**JS (framework-free)**: Shortcuts are strings like "Mod+Shift+K" (Mod = ⌘ on Apple devices, Ctrl elsewhere; also Ctrl, Alt, Shift, Meta). shortcutFromEvent(event, { bare? }) → the shortcut a keydown makes, or null for modifiers alone; matchShortcut(event, "Mod+K") → boolean, for your own handlers; shortcutKeys(s) → ["⌘", "K"]; shortcutLabel(s) → "Command K"; shortcutHtml(s) → markup; syncShortcuts(root?) redraws static .ayy-shortcut[data-keys] for Apple devices (@danitesler/ayywi/elements does it on load); isApplePlatform(); keyFromCode(code). connectShortcutRecorder(button, { value?, label?, bare?, onChange?, onRecordingChange? }) → { setValue, destroy }. shortcutClass, shortcutRecorderClass().

**Custom element** `<ayy-shortcut-recorder>` (@danitesler/ayywi/elements) — 
- attribute `value`: The shortcut, "Mod+Shift+2". Updated when one is recorded; removed when cleared.
- attribute `label`: What the shortcut does ("Capture area"); names the button "Capture area: Ctrl Shift 2".
- attribute `bare`: Allow a key without modifiers (a single letter, as in an app's own single-key shortcuts).
- event `ayy-change`: { value } — the new shortcut, or null when cleared.
- event `ayy-recording`: { recording } — true when it starts listening, false when it stops. Pause your own shortcuts meanwhile.

**React** — `import { Shortcut, ShortcutRecorder, ShortcutList, ShortcutListItem } from "@danitesler/ayywi/react";`
- `<Shortcut>` renders <span class="ayy-shortcut" data-keys> <span class="ayy-sr-only">Ctrl K</span> <kbd class="ayy-kbd" aria-hidden="true">…. Props: `keys` string — "Mod+Shift+K"
- `<ShortcutRecorder>` renders <button type="button" class="ayy-shortcut-recorder" aria-pressed aria-label> with a Shortcut or the placeholder. Props: `value` string | null — the shortcut; `onValueChange` (value: string | null) => void — null when cleared; `label` string — what the shortcut does; names the button; `onRecordingChange` (recording: boolean) => void — pause your own shortcuts meanwhile; `bare` boolean — allow a key without modifiers; `placeholder` ReactNode — shown while none is set. Default "Record shortcut"; `recordingText` string — shown while listening. Default "Press keys…"
- `<ShortcutList>` renders <dl class="ayy-shortcut-list">.
- `<ShortcutListItem>` renders <div class="ayy-shortcut-list__row"><dt>{label}</dt><dd><Shortcut/> or children</dd></div>. Props: `label` ReactNode — what it does; `keys` string — the shortcut; or pass children instead (typed text, two shortcuts)

**Accessibility**
- Keycaps are aria-hidden and a visually hidden label says the keys in words ("Command Shift K"), so screen readers don't read "place of interest sign".
- The recorder is a toggle button: aria-pressed="true" while listening, and its aria-label says the action, the keys and how to cancel ("Capture area: Press keys, or Escape to cancel").
- While it listens it takes every key, Tab included (Tab cancels and moves on), so it can never trap focus.
- Pause the app's own shortcuts while recording (onRecordingChange / ayy-recording), or pressing one would run it.
- A clash is shown with aria-invalid on the recorder and a hint saying which action already uses it; the border is not the only cue.

**Do**
- Store shortcuts as "Mod+…" strings and show them with Shortcut, so Mac and Windows users each see their own keys.
- Put recorders in Settings rows: the action as the label, the recorder as the control.
- Check a new shortcut against the others and set aria-invalid with a hint when it clashes.
- Use ShortcutList for a keyboard help sheet (in a Dialog on "?").

**Don't**
- Don't hard-code "⌘" or "Ctrl" in your copy; use Shortcut.
- Don't allow bare keys for global shortcuts; they'd fire while typing.
- Don't show a shortcut as a tooltip only; put it next to the menu item or in a help list too.

## Shortcut — Recorders in settings

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<!-- <ayy-shortcut-recorder> records on click and fires "ayy-change" with { value }; check for clashes there and set aria-invalid. -->
<div style="inline-size: 100%; max-inline-size: 32rem">
  <section class="ayy-settings" aria-labelledby="sc-recorder-1-html">
    <h2 id="sc-recorder-1-html" class="ayy-settings__title">Shortcuts</h2>
    <p class="ayy-settings__description">Work in every app. Press Backspace while recording to clear one.</p>
    <div class="ayy-settings__list">
      <div class="ayy-settings__row">
        <div class="ayy-settings__text">
          <label class="ayy-settings__label" for="sc-area-html">Capture area</label>
        </div>
        <div class="ayy-settings__control">
          <ayy-shortcut-recorder value="Mod+Shift+2" label="Capture area">
            <button type="button" aria-pressed="false" aria-label="Capture area: Ctrl Shift 2" class="ayy-shortcut-recorder" id="sc-area-html"><span class="ayy-shortcut" data-keys="Mod+Shift+2"><span class="ayy-sr-only">Ctrl Shift 2</span><kbd class="ayy-kbd" aria-hidden="true">Ctrl</kbd><kbd class="ayy-kbd" aria-hidden="true">Shift</kbd><kbd class="ayy-kbd" aria-hidden="true">2</kbd></span></button>
          </ayy-shortcut-recorder>
        </div>
      </div>
      <div class="ayy-settings__row">
        <div class="ayy-settings__text">
          <label class="ayy-settings__label" for="sc-window-html">Capture window</label>
          <p class="ayy-settings__hint ayy-field__error" id="sc-window-hint-html" role="alert">Another action uses these keys.</p>
        </div>
        <div class="ayy-settings__control">
          <ayy-shortcut-recorder value="Mod+Shift+3" label="Capture window">
            <button type="button" aria-pressed="false" aria-label="Capture window: Ctrl Shift 3" class="ayy-shortcut-recorder" id="sc-window-html" aria-invalid="true" aria-describedby="sc-window-hint-html"><span class="ayy-shortcut" data-keys="Mod+Shift+3"><span class="ayy-sr-only">Ctrl Shift 3</span><kbd class="ayy-kbd" aria-hidden="true">Ctrl</kbd><kbd class="ayy-kbd" aria-hidden="true">Shift</kbd><kbd class="ayy-kbd" aria-hidden="true">3</kbd></span></button>
          </ayy-shortcut-recorder>
        </div>
      </div>
      <div class="ayy-settings__row">
        <div class="ayy-settings__text">
          <label class="ayy-settings__label" for="sc-screen-html">Capture screen</label>
          <p class="ayy-settings__hint ayy-field__error" id="sc-screen-hint-html" role="alert">Another action uses these keys.</p>
        </div>
        <div class="ayy-settings__control">
          <ayy-shortcut-recorder value="Mod+Shift+3" label="Capture screen">
            <button type="button" aria-pressed="false" aria-label="Capture screen: Ctrl Shift 3" class="ayy-shortcut-recorder" id="sc-screen-html" aria-invalid="true" aria-describedby="sc-screen-hint-html"><span class="ayy-shortcut" data-keys="Mod+Shift+3"><span class="ayy-sr-only">Ctrl Shift 3</span><kbd class="ayy-kbd" aria-hidden="true">Ctrl</kbd><kbd class="ayy-kbd" aria-hidden="true">Shift</kbd><kbd class="ayy-kbd" aria-hidden="true">3</kbd></span></button>
          </ayy-shortcut-recorder>
        </div>
      </div>
      <div class="ayy-settings__row">
        <div class="ayy-settings__text">
          <label class="ayy-settings__label" for="sc-record-html">Record screen</label>
        </div>
        <div class="ayy-settings__control">
          <ayy-shortcut-recorder label="Record screen">
            <button type="button" aria-pressed="false" aria-label="Record screen: not set" class="ayy-shortcut-recorder" id="sc-record-html"><span class="ayy-shortcut-recorder__placeholder">Record shortcut</span></button>
          </ayy-shortcut-recorder>
        </div>
      </div>
    </div>
  </section>
</div>
```

React:

```tsx
import { useState } from "react";
import { Settings, SettingsRow, ShortcutRecorder } from "@danitesler/ayywi/react";

const ACTIONS = [
  { id: "area", label: "Capture area" },
  { id: "window", label: "Capture window" },
  { id: "screen", label: "Capture screen" },
  { id: "record", label: "Record screen" },
];

export default function Example() {
  const [keys, setKeys] = useState<Record<string, string | null>>({ area: "Mod+Shift+2", window: "Mod+Shift+3", screen: "Mod+Shift+3", record: null });
  const clash = (id: string) => keys[id] !== null && ACTIONS.some((a) => a.id !== id && keys[a.id] === keys[id]);
  return (
    <div style={{ inlineSize: "100%", maxInlineSize: "32rem" }}>
      <Settings title="Shortcuts" description="Work in every app. Press Backspace while recording to clear one.">
        {ACTIONS.map((a) => (
          <SettingsRow
            key={a.id}
            label={a.label}
            htmlFor={`sc-${a.id}`}
            error={clash(a.id) ? "Another action uses these keys." : undefined}
          >
            <ShortcutRecorder
              id={`sc-${a.id}`}
              label={a.label}
              value={keys[a.id]}
              onValueChange={(value) => setKeys((k) => ({ ...k, [a.id]: value }))}
              aria-invalid={clash(a.id) || undefined}
              aria-describedby={clash(a.id) ? `sc-${a.id}-hint` : undefined}
            />
          </SettingsRow>
        ))}
      </Settings>
    </div>
  );
}
```

## Shortcut — Keyboard shortcuts sheet

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<div style="inline-size: 100%; max-inline-size: 22rem">
  <dl class="ayy-shortcut-list" aria-label="Keyboard shortcuts">
    <div class="ayy-shortcut-list__row">
      <dt>Search</dt>
      <dd><span class="ayy-shortcut" data-keys="Mod+K"><span class="ayy-sr-only">Ctrl K</span><kbd class="ayy-kbd" aria-hidden="true">Ctrl</kbd><kbd class="ayy-kbd" aria-hidden="true">K</kbd></span></dd>
    </div>
    <div class="ayy-shortcut-list__row">
      <dt>New task</dt>
      <dd><span class="ayy-shortcut" data-keys="Mod+N"><span class="ayy-sr-only">Ctrl N</span><kbd class="ayy-kbd" aria-hidden="true">Ctrl</kbd><kbd class="ayy-kbd" aria-hidden="true">N</kbd></span></dd>
    </div>
    <div class="ayy-shortcut-list__row">
      <dt>Complete task</dt>
      <dd><span class="ayy-shortcut" data-keys="Mod+Enter"><span class="ayy-sr-only">Ctrl Enter</span><kbd class="ayy-kbd" aria-hidden="true">Ctrl</kbd><kbd class="ayy-kbd" aria-hidden="true">Enter</kbd></span></dd>
    </div>
    <div class="ayy-shortcut-list__row">
      <dt>Move to list</dt>
      <dd><span class="ayy-shortcut" data-keys="Mod+Shift+M"><span class="ayy-sr-only">Ctrl Shift M</span><kbd class="ayy-kbd" aria-hidden="true">Ctrl</kbd><kbd class="ayy-kbd" aria-hidden="true">Shift</kbd><kbd class="ayy-kbd" aria-hidden="true">M</kbd></span></dd>
    </div>
    <div class="ayy-shortcut-list__row">
      <dt>Undo</dt>
      <dd><span class="ayy-shortcut" data-keys="Mod+Z"><span class="ayy-sr-only">Ctrl Z</span><kbd class="ayy-kbd" aria-hidden="true">Ctrl</kbd><kbd class="ayy-kbd" aria-hidden="true">Z</kbd></span></dd>
    </div>
    <div class="ayy-shortcut-list__row">
      <dt>Add a tag while typing</dt>
      <dd><kbd class="ayy-kbd">#tag</kbd></dd>
    </div>
  </dl>
</div>
```

React:

```tsx
import { ShortcutList, ShortcutListItem } from "@danitesler/ayywi/react";

export default function Example() {
  return (
    <div style={{ inlineSize: "100%", maxInlineSize: "22rem" }}>
      <ShortcutList aria-label="Keyboard shortcuts">
        <ShortcutListItem label="Search" keys="Mod+K" />
        <ShortcutListItem label="New task" keys="Mod+N" />
        <ShortcutListItem label="Complete task" keys="Mod+Enter" />
        <ShortcutListItem label="Move to list" keys="Mod+Shift+M" />
        <ShortcutListItem label="Undo" keys="Mod+Z" />
        <ShortcutListItem label="Add a tag while typing">
          <kbd className="ayy-kbd">#tag</kbd>
        </ShortcutListItem>
      </ShortcutList>
    </div>
  );
}
```

---
Part of @danitesler/ayywi 0.0.1: load `dist/ayywi.min.css` (and `dist/elements.global.js` for the <ayy-*> elements). The rules every screen follows: [llms-full.txt#rules](../llms-full.txt#rules). Every component: [llms.txt](../llms.txt).
