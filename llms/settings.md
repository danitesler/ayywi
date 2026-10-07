# Settings

Category: Forms. Preferences as rows: a label and a one-line hint at the start, the control (Switch, Select, Shortcut recorder, Button) at the end, grouped under a heading in a card with hairlines between rows. A row can also be a link to a sub-page with the current value and a chevron, or an action like Sign out, as phone settings are. Also called: settings, setting, settings-row, setting-row, settings-list, preferences, pref-row.

**Classes**
- `.ayy-settings` — A group: <section aria-labelledby> holding a title, an optional description and the list. Groups after each other get space between them.
- `.ayy-settings--plain` — No card around the rows (inside a dialog, a sheet, or a page already on a surface); rows lose their inline padding.
- `.ayy-settings__title` — The group's heading, an <h2> ("Notifications") that labels the section.
- `.ayy-settings__description` — A muted line under the heading.
- `.ayy-settings__list` — The rows, in a card with a line border; hairlines between rows.
- `.ayy-settings__row` — One setting: text at the start, the control at the end. Wraps the control under the text when there isn't room (a phone).
- `.ayy-settings__row--stack` — The control under the text at full width: a textarea, a radio list.
- `.ayy-settings__text` — The label and hint column.
- `.ayy-settings__label` — The setting's name: a <label for> pointing at the control, or a <span> when the control is labelled otherwise.
- `.ayy-settings__hint` — One muted line explaining the setting; give it an id and point the control's aria-describedby at it. With ayy-field__error it's an error.
- `.ayy-settings__control` — The control's box at the end of the row. Inputs and selects in it get a sensible minimum width.
- `.ayy-settings__link` — On an .ayy-settings__row that is an <a href> (opens a sub-page) or a <button> (runs an action): the whole row is the target, with a chevron icon at the end.
- `.ayy-settings__value` — The current value in a link row, muted, before the chevron ("English", "System").
- `.ayy-settings__link--destructive` — Sign out, Delete account: red text and no chevron.

**States**
- `default` — A semibold heading and a muted description over a bordered card of rows split by hairlines: a medium label and a small muted hint at the start, the control at the end.
- `hover` (`.ayy-settings__link:hover (devices that hover)`) — A wash over the link row.
- `pressed` — doesn't apply: No pressed look; a link row opens its page at once.
- `focus` (`.ayy-settings__link:focus-visible; the row's own control`) — Link rows get the ring inside the row's edge (outside in plain groups); controls keep their own ring.
- `disabled` — doesn't apply: Rows don't disable; disable the control in the row and say why in its hint.
- `selected` — doesn't apply: Rows aren't selectable. A link row shows its current value (.ayy-settings__value) instead; the page you're on is the App shell's aria-current.
- `error` (`.ayy-settings__hint.ayy-field__error, with aria-invalid on the control`) — The hint becomes the error, in the destructive colour.
- `loading` — doesn't apply: Settings apply at once. While they load, show a Skeleton in the shape of the rows.
- `destructive` (`.ayy-settings__link--destructive`) — Sign out, delete the account: red label, no chevron.

**Sizes**
- Density — Rows are at least the lg control height (40px compact, 48 comfortable, 52 touch); their controls follow data-density.
- Width — Fills its container. A row wraps its control under the label when there's no room; stack does it always. Selects and inputs in a row are at least 11rem.

**JS (framework-free)**: settingsClass({ plain? }), settingsRowClass({ stack?, link?, destructive? }) → class strings; settingsChevronIcon (SVG markup for a link row's chevron, mirrored in RTL).

**React** — `import { Settings, SettingsRow, SettingsLink } from "@danitesler/ayywi/react";`
- `<Settings>` renders <section class="ayy-settings" aria-labelledby> <h2 class="ayy-settings__title"> … <div class="ayy-settings__list">{children}</div>. Props: `title` ReactNode — the heading; the section is labelled by it; `description` ReactNode — a line under the heading; `plain` boolean — no card around the rows
- `<SettingsRow>` renders <div class="ayy-settings__row"> text + <div class="ayy-settings__control">{children}</div>. Props: `label` ReactNode — the setting's name; `htmlFor` string — the control's id: the label becomes a <label for>, and the hint gets the id `${htmlFor}-hint` for the control's aria-describedby; `hint` ReactNode — one line explaining it; `error` ReactNode — replaces the hint, in red, with role="alert"; `stack` boolean — the control under the text at full width
- `<SettingsLink>` renders <a class="ayy-settings__row ayy-settings__link" href> with href, else <button type="button">; a directional chevron unless destructive. Props: `label` ReactNode — what it opens or does; `hint` ReactNode — a line under the label; `value` ReactNode — the current value, before the chevron; `destructive` boolean — red, no chevron (Sign out); `href` string — opens a page: the row is an <a>; without it a <button>; `type / disabled` Button rows only. type defaults to "button"

**Accessibility**
- Each group is a <section> labelled by its <h2>, so screen-reader users can jump between groups.
- Every control needs a name: give SettingsRow htmlFor and the control that id, so the label is a real <label for>. For a Switch, put the id on the switch's input.
- Point the control's aria-describedby at the hint (`${htmlFor}-hint`) so the explanation is read with it.
- A link row is one <a> or <button>: its whole text, value included, is its name. Use <a href> when it opens a page, <button> when it does something.
- Controls wrap under the label on narrow screens instead of shrinking below a usable size.

**Do**
- Use it for any settings or preferences screen: group related rows under short headings (General, Notifications, Shortcuts). The screen itself is the App shell in settings mode (the Settings pattern): a sidebar of sections and one section's groups in the main.
- Keep labels short and put the why in the hint ("Show a badge with the number of tasks due today").
- Use a Switch for on/off that applies at once, a Select for one of several, a Shortcut recorder for key bindings.
- On phones, use link rows with the current value for anything with more than a few choices, and open a sub-page.
- Put Sign out or Delete account last, in its own group, as a destructive link row.

**Don't**
- Don't add a Save button for switches and selects that apply at once; save as they change and confirm with a Toast if needed.
- Don't put two controls in one row; split the setting.
- Don't use a checkbox for a setting that applies at once — that's what a Switch says.
- Don't nest a card inside the list; use another group.
- Don't open settings in a Dialog or switch sections with Tabs; use the App shell's settings mode. --plain is for a sheet with a couple of quick options.

## Settings — Preferences with switches and selects

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<div style="inline-size: 100%; max-inline-size: 36rem">
  <section class="ayy-settings" aria-labelledby="set-preferences-1-html">
    <h2 id="set-preferences-1-html" class="ayy-settings__title">General</h2>
    <div class="ayy-settings__list">
      <div class="ayy-settings__row">
        <div class="ayy-settings__text">
          <label class="ayy-settings__label" for="set-login-html">Open at login</label>
          <p class="ayy-settings__hint" id="set-login-hint-html">Start in the menu bar when you sign in.</p>
        </div>
        <div class="ayy-settings__control">
          <input type="checkbox" role="switch" class="ayy-switch" id="set-login-html" aria-describedby="set-login-hint-html" checked="" />
        </div>
      </div>
      <div class="ayy-settings__row">
        <div class="ayy-settings__text">
          <label class="ayy-settings__label" for="set-theme-html">Theme</label>
        </div>
        <div class="ayy-settings__control">
          <div class="ayy-select">
            <select class="ayy-select__control" id="set-theme-html">
              <option value="system" selected="">Match the system</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>
        </div>
      </div>
      <div class="ayy-settings__row">
        <div class="ayy-settings__text">
          <label class="ayy-settings__label" for="set-week-html">Week starts on</label>
        </div>
        <div class="ayy-settings__control">
          <div class="ayy-select">
            <select class="ayy-select__control" id="set-week-html">
              <option value="0">Sunday</option>
              <option value="1" selected="">Monday</option>
              <option value="6">Saturday</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  </section>
  <section class="ayy-settings" aria-labelledby="set-preferences-2-html">
    <h2 id="set-preferences-2-html" class="ayy-settings__title">Notifications</h2>
    <p class="ayy-settings__description">Reminders show even when the window is closed.</p>
    <div class="ayy-settings__list">
      <div class="ayy-settings__row">
        <div class="ayy-settings__text">
          <label class="ayy-settings__label" for="set-remind-html">Reminders</label>
          <p class="ayy-settings__hint" id="set-remind-hint-html">A notification when a task is due.</p>
        </div>
        <div class="ayy-settings__control">
          <input type="checkbox" role="switch" class="ayy-switch" id="set-remind-html" aria-describedby="set-remind-hint-html" checked="" />
        </div>
      </div>
      <div class="ayy-settings__row">
        <div class="ayy-settings__text">
          <label class="ayy-settings__label" for="set-summary-html">Daily summary</label>
          <p class="ayy-settings__hint" id="set-summary-hint-html">What&#x27;s due today, every morning at 9:00.</p>
        </div>
        <div class="ayy-settings__control">
          <input type="checkbox" role="switch" class="ayy-switch" id="set-summary-html" aria-describedby="set-summary-hint-html" />
        </div>
      </div>
    </div>
  </section>
</div>
```

React:

```tsx
import { Select, Settings, SettingsRow, Switch } from "@danitesler/ayywi/react";

export default function Example() {
  return (
    <div style={{ inlineSize: "100%", maxInlineSize: "36rem" }}>
      <Settings title="General">
        <SettingsRow label="Open at login" htmlFor="set-login" hint="Start in the menu bar when you sign in.">
          <Switch id="set-login" aria-describedby="set-login-hint" defaultChecked />
        </SettingsRow>
        <SettingsRow label="Theme" htmlFor="set-theme">
          <Select id="set-theme" defaultValue="system">
            <option value="system">Match the system</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </Select>
        </SettingsRow>
        <SettingsRow label="Week starts on" htmlFor="set-week">
          <Select id="set-week" defaultValue="1">
            <option value="0">Sunday</option>
            <option value="1">Monday</option>
            <option value="6">Saturday</option>
          </Select>
        </SettingsRow>
      </Settings>
      <Settings title="Notifications" description="Reminders show even when the window is closed.">
        <SettingsRow label="Reminders" htmlFor="set-remind" hint="A notification when a task is due.">
          <Switch id="set-remind" aria-describedby="set-remind-hint" defaultChecked />
        </SettingsRow>
        <SettingsRow label="Daily summary" htmlFor="set-summary" hint="What's due today, every morning at 9:00.">
          <Switch id="set-summary" aria-describedby="set-summary-hint" />
        </SettingsRow>
      </Settings>
    </div>
  );
}
```

## Settings — Phone settings with link rows

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<div style="inline-size: 100%; max-inline-size: 24rem">
  <section class="ayy-settings" aria-labelledby="set-account-1-html">
    <h2 id="set-account-1-html" class="ayy-settings__title">Account</h2>
    <div class="ayy-settings__list">
      <a class="ayy-settings__row ayy-settings__link" href="#profile"><span class="ayy-settings__text"><span class="ayy-settings__label">Profile</span><span class="ayy-settings__hint">ada@example.com</span></span><svg class="ayy-icon ayy-icon--directional" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M9.00005 6C9.00005 6 15 10.4189 15 12C15 13.5812 9 18 9 18" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg></a>
      <a class="ayy-settings__row ayy-settings__link" href="#language"><span class="ayy-settings__text"><span class="ayy-settings__label">Language</span></span><span class="ayy-settings__value">English</span><svg class="ayy-icon ayy-icon--directional" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M9.00005 6C9.00005 6 15 10.4189 15 12C15 13.5812 9 18 9 18" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg></a>
      <a class="ayy-settings__row ayy-settings__link" href="#sync"><span class="ayy-settings__text"><span class="ayy-settings__label">Sync</span></span><span class="ayy-settings__value">On</span><svg class="ayy-icon ayy-icon--directional" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M9.00005 6C9.00005 6 15 10.4189 15 12C15 13.5812 9 18 9 18" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg></a>
    </div>
  </section>
  <section class="ayy-settings" aria-labelledby="set-account-2-html">
    <h2 id="set-account-2-html" class="ayy-settings__title">Sound</h2>
    <div class="ayy-settings__list">
      <div class="ayy-settings__row">
        <div class="ayy-settings__text">
          <label class="ayy-settings__label" for="set-shutter-html">Shutter sound</label>
        </div>
        <div class="ayy-settings__control">
          <input type="checkbox" role="switch" class="ayy-switch" id="set-shutter-html" checked="" />
        </div>
      </div>
    </div>
  </section>
  <section class="ayy-settings">
    <div class="ayy-settings__list">
      <button type="button" class="ayy-settings__row ayy-settings__link ayy-settings__link--destructive"><span class="ayy-settings__text"><span class="ayy-settings__label">Sign out</span></span></button>
    </div>
  </section>
</div>
```

React:

```tsx
import { Settings, SettingsLink, SettingsRow, Switch } from "@danitesler/ayywi/react";

export default function Example() {
  return (
    <div style={{ inlineSize: "100%", maxInlineSize: "24rem" }}>
      <Settings title="Account">
        <SettingsLink href="#profile" label="Profile" hint="ada@example.com" />
        <SettingsLink href="#language" label="Language" value="English" />
        <SettingsLink href="#sync" label="Sync" value="On" />
      </Settings>
      <Settings title="Sound">
        <SettingsRow label="Shutter sound" htmlFor="set-shutter">
          <Switch id="set-shutter" defaultChecked />
        </SettingsRow>
      </Settings>
      <Settings>
        <SettingsLink label="Sign out" destructive />
      </Settings>
    </div>
  );
}
```

---
Part of @danitesler/ayywi 0.0.1: load `dist/ayywi.min.css` (and `dist/elements.global.js` for the <ayy-*> elements). The rules every screen follows: [llms-full.txt#rules](../llms-full.txt#rules). Every component: [llms.txt](../llms.txt).
