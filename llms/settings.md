# Settings

Category: Forms. A layout for preferences as rows, with a label and a short hint on one side and the control on the other, grouped under headings. A row can also link to a sub-page or run an action like signing out. Also called: settings, setting, settings-row, setting-row, settings-list, preferences, pref-row.

**Classes**
- `.ayy-settings` — A group: <section aria-labelledby> holding a title, an optional description and the list. Groups after each other get space between them.
- `.ayy-settings--plain` — No card around the rows (inside a dialog, a sheet, or a page already on a surface); rows lose their inline padding.
- `.ayy-settings__title` — The group's heading, an <h2> ("Notifications") that labels the section.
- `.ayy-settings__description` — A muted line under the heading.
- `.ayy-settings__list` — The rows, in a card with a line border; hairlines between rows.
- `.ayy-settings__row` — One setting: text at the start, the control at the end. Wraps the control under the text when there isn't room (a phone).
- `.ayy-settings__row--stack` — The control under the text at full width: a textarea, a radio list, a group of choice cards. The row doesn't wrap.
- `.ayy-settings__text` — The label and hint column.
- `.ayy-settings__label` — The setting's name: a <label for> pointing at the control, or a <span> when the control is labelled otherwise.
- `.ayy-settings__hint` — One muted line explaining the setting; give it an id and point the control's aria-describedby at it. With ayy-field__error it's an error.
- `.ayy-settings__control` — The control's box at the end of the row. Inputs and selects in it get a sensible minimum width.
- `.ayy-settings__link` — On an .ayy-settings__row that is an <a href> (opens a sub-page) or a <button> (runs an action): the whole row is the target, with a chevron icon at the end.
- `.ayy-settings__value` — The current value in a link row, muted, before the chevron ("English", "System").
- `.ayy-settings__link--destructive` — Sign out, Delete account: red text and no chevron.
- `.ayy-settings__picker` — Appearance choices shown as pictures (theme, density, corners, font): role="radiogroup" with an aria-label, a grid of larger options inside a Popover (or in a stacked row).
- `.ayy-settings__option` — One picture to choose: a <label> around a visually hidden native radio, a .ayy-settings__preview and a .ayy-settings__caption. Chosen: the picture gets a text-colour border and the caption turns the text colour.
- `.ayy-settings__preview` — The picture's 16:10 frame (or a small 24×16px inline icon inside a trigger .ayy-button before its label). Holds a .ayy-settings__screen, or a short sample such as "Aa" in a font. aria-hidden: the caption names the option.
- `.ayy-settings__caption` — The option's name under the picture ("Dark", "Sharp").
- `.ayy-settings__screen` — A miniature app (sidebar, heading, lines, a primary button) drawn from the tokens around it. Set data-theme or data-density on it, or brand and corner tokens around it, to preview them. Two in one preview split it: System as half light, half dark; Auto as half compact, half touch.

**States**
- `default` — A semibold heading and a muted description over a bordered card of rows split by hairlines: a medium label and a small muted hint at the start, the control at the end.
- `hover` (`.ayy-settings__link:hover, .ayy-settings__option:hover (devices that hover)`) — A wash over the link row; an option's picture gets the line-hover border.
- `pressed` — doesn't apply: No pressed look; a link row opens its page at once.
- `focus` (`.ayy-settings__link:focus-visible; .ayy-settings__option:has(> input:focus-visible); the row's own control`) — Link rows get the ring inside the row's edge (outside in plain groups); an option's picture gets the ring 2px outside; controls keep their own ring.
- `disabled` (`.ayy-settings__link:disabled, .ayy-settings__link[aria-disabled="true"], .ayy-settings__option:has(> input:disabled)`) — Reduced opacity and not-allowed cursor on link rows and options.
- `selected` (`.ayy-settings__option:has(> input:checked)`) — The picture gets a text-colour border plus a 1px ring, and the caption turns the text colour. Forced colours: a Highlight outline. Rows themselves aren't selectable: a link row shows its current value (.ayy-settings__value).
- `error` (`.ayy-settings__hint.ayy-field__error, with aria-invalid on the control`) — The hint becomes the error, in the destructive colour.
- `loading` — doesn't apply: Settings apply at once. While they load, show a Skeleton in the shape of the rows.
- `destructive` (`.ayy-settings__link--destructive`) — Sign out, delete the account: red label, no chevron.

**Sizes**
- Density — Rows are at least the lg control height (40px compact, 48 comfortable, 52 touch); their controls follow data-density.
- Width — Fills its container. A row wraps its control under the label when there's no room; stack does it always. Selects, inputs and popover triggers in a row are at least 11rem. A picker is a grid of 8.5rem-minimum columns (up to 30rem wide inside a Popover, three across) with 16:10 pictures; a screen's rows are a quarter of --ayy-size-control-md apart so data-density shows on it.

**React** — `import { Settings, SettingsRow, SettingsLink, SettingsPicker, SettingsOption, SettingsScreen } from "@danitesler/ayywi/react";`
- `<Settings>` renders <section class="ayy-settings" aria-labelledby> <h2 class="ayy-settings__title"> … <div class="ayy-settings__list">{children}</div>. Props: `title` ReactNode — the heading; the section is labelled by it; `description` ReactNode — a line under the heading; `plain` boolean — no card around the rows
- `<SettingsRow>` renders <div class="ayy-settings__row"> text + <div class="ayy-settings__control">{children}</div>. Props: `label` ReactNode — the setting's name; `htmlFor` string — the control's id: the label becomes a <label for>, and the hint gets the id `${htmlFor}-hint` for the control's aria-describedby; `hint` ReactNode — one line explaining it; `error` ReactNode — replaces the hint, in red, with role="alert"; `stack` boolean — the control under the text at full width
- `<SettingsLink>` renders <a class="ayy-settings__row ayy-settings__link" href> with href, else <button type="button">; a directional chevron unless destructive. Props: `label` ReactNode — what it opens or does; `hint` ReactNode — a line under the label; `value` ReactNode — the current value, before the chevron; `destructive` boolean — red, no chevron (Sign out); `href` string — opens a page: the row is an <a>; without it a <button>; `type / disabled` Button rows only. type defaults to "button"
- `<SettingsPicker>` renders <div role="radiogroup" class="ayy-settings__picker">{children}</div>; give it an aria-label. Props: `name` string — shared radio name; generated if omitted; `value / defaultValue` string — the chosen option; `onValueChange` (value: string) => void; `disabled` boolean — every option
- `<SettingsOption>` renders <label class="ayy-settings__option"><input type="radio"> <span class="ayy-settings__preview" aria-hidden="true">{preview}</span> <span class="ayy-settings__caption">{label}</span></label>. Props: `value` string — the option's value; `label` ReactNode — the caption, which names the radio; `preview` ReactNode — the picture; a SettingsScreen by default, or a sample like "Aa" in a font; `disabled` boolean; `inputProps` props for the native radio
- `<SettingsScreen>` renders <span class="ayy-settings__screen" data-theme data-density aria-hidden="true">; two of them for theme="system" (light, dark) or density="auto" (compact, touch). Props: `theme` "system" | "light" | "dark" | "dark-contrast" | "light-gray" — the theme it's drawn in; omit for the one around it; `density` "compact" | "comfortable" | "touch" | "auto" — the density it's drawn in; omit for the one around it

**Accessibility**
- Each group is a <section> labelled by its <h2>, so screen-reader users can jump between groups.
- Every control needs a name: give SettingsRow htmlFor and the control that id, so the label is a real <label for>. For a Switch, put the id on the switch's input.
- Point the control's aria-describedby at the hint (`${htmlFor}-hint`) so the explanation is read with it.
- A link row is one <a> or <button>: its whole text, value included, is its name. Use <a href> when it opens a page, <button> when it does something.
- Controls wrap under the label on narrow screens instead of shrinking below a usable size.
- A picker is a radiogroup of native radios: arrow keys move between options, and each option is named by its caption. The pictures are aria-hidden.

**Do**
- Use it for any settings or preferences screen: group related rows under short headings (General, Notifications, Shortcuts). They open in a near-full-screen Dialog (size="full") holding the App shell in settings mode (the Settings pattern): a sidebar of sections and one section's groups in the main.
- Keep labels short and put the why in the hint ("Show a badge with the number of tasks due today").
- Use a Switch for on/off that applies at once, a Select for one of several, a Shortcut recorder for key bindings.
- On phones, use link rows with the current value for anything with more than a few choices, and open a sub-page.
- Put Sign out or Delete account last, in its own group, as a destructive link row.
- For appearance settings, use the same controls in every product: Theme, Density, Corners and Font as a Popover (with a small .ayy-settings__preview icon in front of the trigger's label) holding a SettingsPicker of SettingsScreens (or "Aa" samples for Font), Brand colour as ColorSwatches with a ColorSwatchCustom, Text size as a Slider, Reduce motion as a Switch, Language as a Select, Text direction as a SegmentedControl, and Reset appearance as a destructive link row. Apply each at once with setTheme(), setDensity(), setBrand(), data-motion and dir.

**Don't**
- Don't add a Save button for switches and selects that apply at once; save as they change and confirm with a Toast if needed.
- Don't put two controls in one row; split the setting.
- Don't use a checkbox for a setting that applies at once — that's what a Switch says.
- Don't nest a card inside the list; use another group.
- Don't draw your own theme thumbnails or use a plain Select for the theme: a SettingsScreen draws each theme from its real tokens.
- Don't open settings in a small or side Dialog, or switch sections with Tabs; use a size="full" Dialog with the App shell's settings mode. --plain is for a sheet with a couple of quick options.

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
          <label class="ayy-settings__label" for="set-startup-html">Startup page</label>
        </div>
        <div class="ayy-settings__control">
          <div class="ayy-select">
            <select class="ayy-select__control" id="set-startup-html">
              <option value="inbox" selected="">Inbox</option>
              <option value="today">Today</option>
              <option value="last">Last opened page</option>
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
        <SettingsRow label="Startup page" htmlFor="set-startup">
          <Select id="set-startup" defaultValue="inbox">
            <option value="inbox">Inbox</option>
            <option value="today">Today</option>
            <option value="last">Last opened page</option>
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

## Settings — Choice cards in a stacked row

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<div style="inline-size: 100%; max-inline-size: 36rem">
  <section class="ayy-settings" aria-labelledby="settings-sharing-title">
    <h2 id="settings-sharing-title" class="ayy-settings__title">Sharing</h2>
    <div class="ayy-settings__list">
      <div class="ayy-settings__row ayy-settings__row--stack">
        <div class="ayy-settings__text"><span class="ayy-settings__label">Default access</span><p class="ayy-settings__hint">Who can open new links before you invite anyone.</p></div>
        <div class="ayy-settings__control">
          <fieldset role="radiogroup" aria-label="Default access" class="ayy-choice-group" style="--ayy-min: 8rem">
            <label class="ayy-choice-card"><input type="radio" class="ayy-radio" name="access" value="private"/><span class="ayy-choice-card__title">Only you</span><span class="ayy-choice-card__description">Invite people by email</span></label>
            <label class="ayy-choice-card"><input type="radio" class="ayy-radio" name="access" checked="" value="team"/><span class="ayy-choice-card__title">Workspace</span><span class="ayy-choice-card__description">Anyone in your team</span></label>
            <label class="ayy-choice-card"><input type="radio" class="ayy-radio" name="access" value="public"/><span class="ayy-choice-card__title">Anyone with link</span><span class="ayy-choice-card__description">View without signing in</span></label>
          </fieldset>
        </div>
      </div>
    </div>
  </section>
</div>
```

React:

```tsx
import { ChoiceCard, ChoiceGroup, Settings, SettingsRow } from "@danitesler/ayywi/react";

export default function Example() {
  return (
    <div style={{ inlineSize: "100%", maxInlineSize: "36rem" }}>
      <Settings title="Sharing">
        <SettingsRow label="Default access" hint="Who can open new links before you invite anyone." stack>
          <ChoiceGroup aria-label="Default access" defaultValue="team" name="access" min="8rem">
            <ChoiceCard value="private" title="Only you" description="Invite people by email" />
            <ChoiceCard value="team" title="Workspace" description="Anyone in your team" />
            <ChoiceCard value="public" title="Anyone with link" description="View without signing in" />
          </ChoiceGroup>
        </SettingsRow>
      </Settings>
    </div>
  );
}
```

## Settings — Appearance, brand, language and reset

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<div style="inline-size:100%;max-inline-size:42rem;font-family:var(--ayy-font-body)">
  <section class="ayy-settings" aria-labelledby="set-appearance-html">
    <h2 id="set-appearance-html" class="ayy-settings__title">Appearance</h2>
    <p class="ayy-settings__description">Theme, density, brand colour, corners and font for the whole interface.</p>
    <div class="ayy-settings__list">
      <div class="ayy-settings__row">
        <div class="ayy-settings__text">
          <label class="ayy-settings__label" for="set-theme-html">Theme</label>
          <p class="ayy-settings__hint" id="set-theme-hint-html">System follows your device's light or dark setting.</p>
        </div>
        <div class="ayy-settings__control">
          <ayy-popover align="end"><button type="button" class="ayy-button ayy-button--outline" popovertarget="set-theme-popover-html" aria-haspopup="dialog" id="set-theme-html" aria-describedby="set-theme-hint-html"><span class="ayy-settings__preview" aria-hidden="true"><span class="ayy-settings__screen" data-theme="light" aria-hidden="true"></span><span class="ayy-settings__screen" data-theme="dark" aria-hidden="true"></span></span>System<svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M18 9.00005C18 9.00005 13.5811 15 12 15C10.4188 15 6 9 6 9" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg></button><div id="set-theme-popover-html" role="dialog" class="ayy-popover" popover="auto" aria-label="Theme"><div role="radiogroup" class="ayy-settings__picker" aria-label="Theme"><label class="ayy-settings__option"><input type="radio" name="set-theme-radio-html" checked="" value="system"/><span class="ayy-settings__preview" aria-hidden="true"><span class="ayy-settings__screen" data-theme="light" aria-hidden="true"></span><span class="ayy-settings__screen" data-theme="dark" aria-hidden="true"></span></span><span class="ayy-settings__caption">System</span></label><label class="ayy-settings__option"><input type="radio" name="set-theme-radio-html" value="light"/><span class="ayy-settings__preview" aria-hidden="true"><span class="ayy-settings__screen" data-theme="light" aria-hidden="true"></span></span><span class="ayy-settings__caption">Light</span></label><label class="ayy-settings__option"><input type="radio" name="set-theme-radio-html" value="dark"/><span class="ayy-settings__preview" aria-hidden="true"><span class="ayy-settings__screen" data-theme="dark" aria-hidden="true"></span></span><span class="ayy-settings__caption">Dark</span></label><label class="ayy-settings__option"><input type="radio" name="set-theme-radio-html" value="dark-contrast"/><span class="ayy-settings__preview" aria-hidden="true"><span class="ayy-settings__screen" data-theme="dark-contrast" aria-hidden="true"></span></span><span class="ayy-settings__caption">Black</span></label><label class="ayy-settings__option"><input type="radio" name="set-theme-radio-html" value="light-gray"/><span class="ayy-settings__preview" aria-hidden="true"><span class="ayy-settings__screen" data-theme="light-gray" aria-hidden="true"></span></span><span class="ayy-settings__caption">Light gray</span></label></div></div></ayy-popover>
        </div>
      </div>
      <div class="ayy-settings__row">
        <div class="ayy-settings__text">
          <label class="ayy-settings__label" for="set-density-html">Density</label>
          <p class="ayy-settings__hint" id="set-density-hint-html">Auto: compact with a mouse, touch on a touch screen.</p>
        </div>
        <div class="ayy-settings__control">
          <ayy-popover align="end"><button type="button" class="ayy-button ayy-button--outline" popovertarget="set-density-popover-html" aria-haspopup="dialog" id="set-density-html" aria-describedby="set-density-hint-html"><span class="ayy-settings__preview" aria-hidden="true"><span class="ayy-settings__screen" data-density="compact" aria-hidden="true"></span><span class="ayy-settings__screen" data-density="touch" aria-hidden="true"></span></span>Auto<svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M18 9.00005C18 9.00005 13.5811 15 12 15C10.4188 15 6 9 6 9" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg></button><div id="set-density-popover-html" role="dialog" class="ayy-popover" popover="auto" aria-label="Density"><div role="radiogroup" class="ayy-settings__picker" aria-label="Density"><label class="ayy-settings__option"><input type="radio" name="set-density-radio-html" checked="" value="auto"/><span class="ayy-settings__preview" aria-hidden="true"><span class="ayy-settings__screen" data-density="compact" aria-hidden="true"></span><span class="ayy-settings__screen" data-density="touch" aria-hidden="true"></span></span><span class="ayy-settings__caption">Auto</span></label><label class="ayy-settings__option"><input type="radio" name="set-density-radio-html" value="compact"/><span class="ayy-settings__preview" aria-hidden="true"><span class="ayy-settings__screen" data-density="compact" aria-hidden="true"></span></span><span class="ayy-settings__caption">Compact</span></label><label class="ayy-settings__option"><input type="radio" name="set-density-radio-html" value="comfortable"/><span class="ayy-settings__preview" aria-hidden="true"><span class="ayy-settings__screen" data-density="comfortable" aria-hidden="true"></span></span><span class="ayy-settings__caption">Comfortable</span></label><label class="ayy-settings__option"><input type="radio" name="set-density-radio-html" value="touch"/><span class="ayy-settings__preview" aria-hidden="true"><span class="ayy-settings__screen" data-density="touch" aria-hidden="true"></span></span><span class="ayy-settings__caption">Touch</span></label></div></div></ayy-popover>
        </div>
      </div>
      <div class="ayy-settings__row">
        <div class="ayy-settings__text">
          <label class="ayy-settings__label" for="set-text-size-html">Text size</label>
          <p class="ayy-settings__hint" id="set-text-size-hint-html">Sets the root font size, so all text and spacing scale with it.</p>
        </div>
        <div class="ayy-settings__control">
          <input type="range" class="ayy-slider" min="75" max="150" step="12.5" style="--ayy-value:33.33" id="set-text-size-html" aria-describedby="set-text-size-hint-html" aria-valuetext="100%" value="100"/>
          <output for="set-text-size-html" class="ayy-muted ayy-tabular">100%</output>
        </div>
      </div>
      <div class="ayy-settings__row">
        <div class="ayy-settings__text">
          <span class="ayy-settings__label"><span id="set-brand-colour-html">Brand colour</span></span>
          <p class="ayy-settings__hint">Default is monochrome. Contrast is checked in every theme.</p>
        </div>
        <div class="ayy-settings__control">
          <div role="radiogroup" class="ayy-swatch-group" aria-labelledby="set-brand-colour-html">
            <label class="ayy-swatch ayy-swatch--none"><input type="radio" aria-label="Default" name="set-brand-colour-html" checked="" value="default"/></label>
            <label class="ayy-swatch" style="--ayy-swatch:var(--ayy-palette-blue-53)"><input type="radio" aria-label="Blue" name="set-brand-colour-html" value="blue"/></label>
            <label class="ayy-swatch" style="--ayy-swatch:var(--ayy-palette-violet-58)"><input type="radio" aria-label="Violet" name="set-brand-colour-html" value="violet"/></label>
            <label class="ayy-swatch" style="--ayy-swatch:var(--ayy-palette-green-24)"><input type="radio" aria-label="Green" name="set-brand-colour-html" value="green"/></label>
            <label class="ayy-swatch" style="--ayy-swatch:var(--ayy-palette-orange-40)"><input type="radio" aria-label="Orange" name="set-brand-colour-html" value="orange"/></label>
            <label class="ayy-swatch" style="--ayy-swatch:var(--ayy-palette-pink-42)"><input type="radio" aria-label="Pink" name="set-brand-colour-html" value="pink"/></label>
            <label class="ayy-swatch ayy-swatch--custom"><input type="color" aria-label="Custom colour" value="#7c3aed"/></label>
          </div>
        </div>
      </div>
      <div class="ayy-settings__row">
        <div class="ayy-settings__text">
          <label class="ayy-settings__label" for="set-corners-html">Corners</label>
        </div>
        <div class="ayy-settings__control">
          <ayy-popover align="end"><button type="button" class="ayy-button ayy-button--outline" popovertarget="set-corners-popover-html" aria-haspopup="dialog" id="set-corners-html"><span class="ayy-settings__preview" aria-hidden="true"><span class="ayy-settings__screen" aria-hidden="true" style="--ayy-radius-card:var(--ayy-radius-2xl);--ayy-radius-button:var(--ayy-radius-pill)"></span></span>Pill<svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M18 9.00005C18 9.00005 13.5811 15 12 15C10.4188 15 6 9 6 9" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg></button><div id="set-corners-popover-html" role="dialog" class="ayy-popover" popover="auto" aria-label="Corners"><div role="radiogroup" class="ayy-settings__picker" aria-label="Corners"><label class="ayy-settings__option"><input type="radio" name="set-corners-radio-html" checked="" value="pill"/><span class="ayy-settings__preview" aria-hidden="true"><span class="ayy-settings__screen" aria-hidden="true" style="--ayy-radius-card:var(--ayy-radius-2xl);--ayy-radius-button:var(--ayy-radius-pill)"></span></span><span class="ayy-settings__caption">Pill</span></label><label class="ayy-settings__option"><input type="radio" name="set-corners-radio-html" value="round"/><span class="ayy-settings__preview" aria-hidden="true"><span class="ayy-settings__screen" aria-hidden="true" style="--ayy-radius-card:var(--ayy-radius-2xl);--ayy-radius-button:var(--ayy-radius-xl)"></span></span><span class="ayy-settings__caption">Round</span></label><label class="ayy-settings__option"><input type="radio" name="set-corners-radio-html" value="soft"/><span class="ayy-settings__preview" aria-hidden="true"><span class="ayy-settings__screen" aria-hidden="true" style="--ayy-radius-card:var(--ayy-radius-xl);--ayy-radius-button:var(--ayy-radius-lg)"></span></span><span class="ayy-settings__caption">Soft</span></label><label class="ayy-settings__option"><input type="radio" name="set-corners-radio-html" value="sharp"/><span class="ayy-settings__preview" aria-hidden="true"><span class="ayy-settings__screen" aria-hidden="true" style="--ayy-radius-card:var(--ayy-radius-md);--ayy-radius-button:var(--ayy-radius-sm)"></span></span><span class="ayy-settings__caption">Sharp</span></label></div></div></ayy-popover>
        </div>
      </div>
      <div class="ayy-settings__row">
        <div class="ayy-settings__text">
          <label class="ayy-settings__label" for="set-font-html">Font</label>
        </div>
        <div class="ayy-settings__control">
          <ayy-popover align="end"><button type="button" class="ayy-button ayy-button--outline" popovertarget="set-font-popover-html" aria-haspopup="dialog" id="set-font-html"><span class="ayy-settings__preview" aria-hidden="true"><span style="font-family:Sora, system-ui, -apple-system, &quot;Segoe UI&quot;, Roboto, &quot;Noto Sans&quot;, &quot;Helvetica Neue&quot;, Arial, sans-serif">Aa</span></span>Sora<svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M18 9.00005C18 9.00005 13.5811 15 12 15C10.4188 15 6 9 6 9" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg></button><div id="set-font-popover-html" role="dialog" class="ayy-popover" popover="auto" aria-label="Font"><div role="radiogroup" class="ayy-settings__picker" aria-label="Font"><label class="ayy-settings__option"><input type="radio" name="set-font-radio-html" checked="" value="default"/><span class="ayy-settings__preview" aria-hidden="true"><span style="font-family:Sora, system-ui, -apple-system, &quot;Segoe UI&quot;, Roboto, &quot;Noto Sans&quot;, &quot;Helvetica Neue&quot;, Arial, sans-serif">Aa</span></span><span class="ayy-settings__caption">Sora</span></label><label class="ayy-settings__option"><input type="radio" name="set-font-radio-html" value="system"/><span class="ayy-settings__preview" aria-hidden="true"><span style="font-family:system-ui, -apple-system, &quot;Segoe UI&quot;, Roboto, &quot;Noto Sans&quot;, &quot;Helvetica Neue&quot;, Arial, sans-serif">Aa</span></span><span class="ayy-settings__caption">System</span></label><label class="ayy-settings__option"><input type="radio" name="set-font-radio-html" value="mono"/><span class="ayy-settings__preview" aria-hidden="true"><span style="font-family:ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, &quot;Noto Sans Mono&quot;, monospace, system-ui, -apple-system, &quot;Segoe UI&quot;, Roboto, &quot;Noto Sans&quot;, &quot;Helvetica Neue&quot;, Arial, sans-serif">Aa</span></span><span class="ayy-settings__caption">Mono</span></label></div></div></ayy-popover>
        </div>
      </div>
    </div>
  </section>
  <section class="ayy-settings" aria-labelledby="set-a11y-html">
    <h2 id="set-a11y-html" class="ayy-settings__title">Accessibility and language</h2>
    <div class="ayy-settings__list">
      <div class="ayy-settings__row">
        <div class="ayy-settings__text">
          <label class="ayy-settings__label" for="set-motion-html">Reduce motion</label>
          <p class="ayy-settings__hint" id="set-motion-hint-html">Turns animations off, whatever the device is set to.</p>
        </div>
        <div class="ayy-settings__control">
          <input type="checkbox" role="switch" class="ayy-switch" id="set-motion-html" aria-describedby="set-motion-hint-html"/>
        </div>
      </div>
      <div class="ayy-settings__row">
        <div class="ayy-settings__text">
          <label class="ayy-settings__label" for="set-language-html">Language</label>
        </div>
        <div class="ayy-settings__control">
          <div class="ayy-select">
            <select class="ayy-select__control" id="set-language-html">
              <option value="en" lang="en" selected="">English</option>
              <option value="de" lang="de">Deutsch</option>
              <option value="he" lang="he">עברית</option>
              <option value="ar" lang="ar">العربية</option>
            </select>
          </div>
        </div>
      </div>
      <div class="ayy-settings__row">
        <div class="ayy-settings__text">
          <span class="ayy-settings__label">Text direction</span>
          <p class="ayy-settings__hint">Auto follows the language.</p>
        </div>
        <div class="ayy-settings__control">
          <div role="radiogroup" class="ayy-segmented-control" aria-label="Text direction">
            <label class="ayy-segmented-control__option"><input type="radio" name="set-dir-html" checked="" value="auto"/>Auto</label>
            <label class="ayy-segmented-control__option"><input type="radio" name="set-dir-html" value="ltr"/>Left to right</label>
            <label class="ayy-segmented-control__option"><input type="radio" name="set-dir-html" value="rtl"/>Right to left</label>
          </div>
        </div>
      </div>
    </div>
  </section>
  <section class="ayy-settings" aria-labelledby="set-reset-html">
    <h2 id="set-reset-html" class="ayy-settings__title">Reset</h2>
    <div class="ayy-settings__list">
      <button type="button" class="ayy-settings__row ayy-settings__link ayy-settings__link--destructive"><span class="ayy-settings__text"><span class="ayy-settings__label">Reset appearance</span><span class="ayy-settings__hint">Theme, density, brand, motion and language go back to their defaults.</span></span></button>
    </div>
  </section>
</div>
```

React:

```tsx
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { ArrowDown01Icon } from "@hugeicons/core-free-icons";
import { BRAND_SHAPES, setBrand, setDensity, setTheme, tokens, type BrandShape, type DensityMode, type ThemeMode } from "@danitesler/ayywi";
import {
  ColorSwatch,
  ColorSwatchCustom,
  ColorSwatchGroup,
  Icon,
  Popover,
  PopoverContent,
  PopoverTrigger,
  SegmentedControl,
  SegmentedControlItem,
  Select,
  Settings,
  SettingsLink,
  SettingsOption,
  SettingsPicker,
  SettingsRow,
  SettingsScreen,
  Slider,
  Switch,
} from "@danitesler/ayywi/react";

const THEMES: { value: ThemeMode; label: string }[] = [
  { value: "system", label: "System" },
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "dark-contrast", label: "Black" },
  { value: "light-gray", label: "Light gray" },
];

const DENSITIES: { value: DensityMode; label: string }[] = [
  { value: "auto", label: "Auto" },
  { value: "compact", label: "Compact" },
  { value: "comfortable", label: "Comfortable" },
  { value: "touch", label: "Touch" },
];

// Seeds come from the palette tokens; setBrand() builds the scale, primary and ring for every theme from one.
const COLOURS = [
  { value: "blue", label: "Blue", token: "palette.blue.53" },
  { value: "violet", label: "Violet", token: "palette.violet.58" },
  { value: "green", label: "Green", token: "palette.green.24" },
  { value: "orange", label: "Orange", token: "palette.orange.40" },
  { value: "pink", label: "Pink", token: "palette.pink.42" },
] as const;

const seed = (token: (typeof COLOURS)[number]["token"]) => tokens[token].value;
const cssVar = (token: string) => `var(--ayy-${token.replace(/\./g, "-")})`;

const SHAPES: { value: BrandShape; label: string }[] = [
  { value: "pill", label: "Pill" },
  { value: "round", label: "Round" },
  { value: "soft", label: "Soft" },
  { value: "sharp", label: "Sharp" },
];

// Font stacks from the font tokens. System drops Sora from the body stack; every stack ends on system fonts.
const stack = (fonts: readonly string[]) => fonts.map((f) => (f.includes(" ") ? `"${f}"` : f)).join(", ");
const FONTS = [
  { value: "default", label: "Sora", family: stack(tokens["font.body"].value) },
  { value: "system", label: "System", family: stack(tokens["font.body"].value.slice(1)) },
  { value: "mono", label: "Mono", family: stack([...tokens["font.mono"].value, ...tokens["font.body"].value.slice(1)]) },
];

const LANGUAGES = [
  { value: "en", label: "English", dir: "ltr" },
  { value: "de", label: "Deutsch", dir: "ltr" },
  { value: "he", label: "עברית", dir: "rtl" },
  { value: "ar", label: "العربية", dir: "rtl" },
] as const;

const DEFAULTS = {
  theme: "system" as ThemeMode,
  density: "auto" as DensityMode,
  textSize: 100,
  colour: "default",
  custom: seed("palette.violet.58"),
  shape: "pill" as BrandShape,
  font: "default",
  motion: false,
  language: "en",
  direction: "auto",
};

export default function Example() {
  const root = useRef<HTMLDivElement>(null);
  const [theme, setThemeState] = useState<ThemeMode>(DEFAULTS.theme);
  const [density, setDensityState] = useState<DensityMode>(DEFAULTS.density);
  const [textSize, setTextSize] = useState<number>(DEFAULTS.textSize);
  const [colour, setColour] = useState<string>(DEFAULTS.colour);
  const [custom, setCustom] = useState<string>(DEFAULTS.custom);
  const [shape, setShape] = useState<BrandShape>(DEFAULTS.shape);
  const [font, setFont] = useState<string>(DEFAULTS.font);
  const [motion, setMotion] = useState<boolean>(DEFAULTS.motion);
  const [language, setLanguage] = useState<string>(DEFAULTS.language);
  const [direction, setDirection] = useState<string>(DEFAULTS.direction);

  // Everything applies to this example only; in an app, target <html> (omit the element argument).
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    setTheme(theme, el);
    setDensity(density, el);
    const picked = COLOURS.find((c) => c.value === colour);
    const color = colour === "custom" ? custom : picked ? seed(picked.token) : null;
    if (color) setBrand({ name: "settings-example", color, shape }, el);
    else setBrand(null, el);
    const radius = BRAND_SHAPES[shape];
    el.style.setProperty("--ayy-radius-control", radius.control);
    el.style.setProperty("--ayy-radius-card", radius.card);
    el.style.setProperty("--ayy-radius-button", radius.button);
    const family = FONTS.find((f) => f.value === font);
    if (font === "default" || !family) el.style.removeProperty("--ayy-font-body");
    else el.style.setProperty("--ayy-font-body", family.family);
    const lang = LANGUAGES.find((l) => l.value === language);
    el.lang = language;
    el.dir = direction === "auto" ? (lang?.dir ?? "ltr") : direction;
  }, [theme, density, colour, custom, shape, font, language, direction]);

  const themeLabel = THEMES.find((t) => t.value === theme)?.label ?? "System";
  const densityLabel = DENSITIES.find((d) => d.value === density)?.label ?? "Auto";
  const shapeLabel = SHAPES.find((s) => s.value === shape)?.label ?? "Pill";
  const fontOption = FONTS.find((f) => f.value === font) ?? FONTS[0];
  const cornerStyle = (s: BrandShape) => ({ "--ayy-radius-card": BRAND_SHAPES[s].card, "--ayy-radius-button": BRAND_SHAPES[s].button }) as CSSProperties;

  return (
    <div ref={root} style={{ inlineSize: "100%", maxInlineSize: "42rem", fontFamily: "var(--ayy-font-body)" }}>
      <Settings title="Appearance" description="Theme, density, brand colour, corners and font for the whole interface.">
        <SettingsRow label="Theme" htmlFor="set-theme" hint="System follows your device's light or dark setting.">
          <Popover>
            <PopoverTrigger id="set-theme" aria-describedby="set-theme-hint" variant="outline">
              <span className="ayy-settings__preview" aria-hidden="true">
                <SettingsScreen theme={theme} />
              </span>
              {themeLabel}
              <Icon icon={ArrowDown01Icon} />
            </PopoverTrigger>
            <PopoverContent align="end" aria-label="Theme">
              <SettingsPicker aria-label="Theme" value={theme} onValueChange={(value) => setThemeState(value as ThemeMode)}>
                {THEMES.map((t) => (
                  <SettingsOption key={t.value} value={t.value} label={t.label} preview={<SettingsScreen theme={t.value} />} />
                ))}
              </SettingsPicker>
            </PopoverContent>
          </Popover>
        </SettingsRow>
        <SettingsRow label="Density" htmlFor="set-density" hint="Auto: compact with a mouse, touch on a touch screen.">
          <Popover>
            <PopoverTrigger id="set-density" aria-describedby="set-density-hint" variant="outline">
              <span className="ayy-settings__preview" aria-hidden="true">
                <SettingsScreen density={density} />
              </span>
              {densityLabel}
              <Icon icon={ArrowDown01Icon} />
            </PopoverTrigger>
            <PopoverContent align="end" aria-label="Density">
              <SettingsPicker aria-label="Density" value={density} onValueChange={(value) => setDensityState(value as DensityMode)}>
                {DENSITIES.map((d) => (
                  <SettingsOption key={d.value} value={d.value} label={d.label} preview={<SettingsScreen density={d.value} />} />
                ))}
              </SettingsPicker>
            </PopoverContent>
          </Popover>
        </SettingsRow>
        <SettingsRow label="Text size" htmlFor="set-text-size" hint="Sets the root font size, so all text and spacing scale with it.">
          <Slider
            id="set-text-size"
            aria-describedby="set-text-size-hint"
            aria-valuetext={`${textSize}%`}
            min={75}
            max={150}
            step={12.5}
            value={textSize}
            onValueChange={setTextSize}
          />
          <output htmlFor="set-text-size" className="ayy-muted ayy-tabular">
            {textSize}%
          </output>
        </SettingsRow>
        <SettingsRow label={<span id="set-brand-colour">Brand colour</span>} hint="Default is monochrome. Contrast is checked in every theme.">
          <ColorSwatchGroup aria-labelledby="set-brand-colour">
            <ColorSwatch none label="Default" name="set-brand-colour" value="default" checked={colour === "default"} onCheckedChange={() => setColour("default")} />
            {COLOURS.map((c) => (
              <ColorSwatch
                key={c.value}
                color={cssVar(c.token)}
                label={c.label}
                name="set-brand-colour"
                value={c.value}
                checked={colour === c.value}
                onCheckedChange={() => setColour(c.value)}
              />
            ))}
            <ColorSwatchCustom
              label="Custom colour"
              value={custom}
              onChange={(event) => {
                setCustom(event.currentTarget.value);
                setColour("custom");
              }}
            />
          </ColorSwatchGroup>
        </SettingsRow>
        <SettingsRow label="Corners" htmlFor="set-corners">
          <Popover>
            <PopoverTrigger id="set-corners" variant="outline">
              <span className="ayy-settings__preview" aria-hidden="true">
                <SettingsScreen style={cornerStyle(shape)} />
              </span>
              {shapeLabel}
              <Icon icon={ArrowDown01Icon} />
            </PopoverTrigger>
            <PopoverContent align="end" aria-label="Corners">
              <SettingsPicker aria-label="Corners" value={shape} onValueChange={(value) => setShape(value as BrandShape)}>
                {SHAPES.map((s) => (
                  <SettingsOption key={s.value} value={s.value} label={s.label} preview={<SettingsScreen style={cornerStyle(s.value)} />} />
                ))}
              </SettingsPicker>
            </PopoverContent>
          </Popover>
        </SettingsRow>
        <SettingsRow label="Font" htmlFor="set-font">
          <Popover>
            <PopoverTrigger id="set-font" variant="outline">
              <span className="ayy-settings__preview" aria-hidden="true">
                <span style={{ fontFamily: fontOption.family }}>Aa</span>
              </span>
              {fontOption.label}
              <Icon icon={ArrowDown01Icon} />
            </PopoverTrigger>
            <PopoverContent align="end" aria-label="Font">
              <SettingsPicker aria-label="Font" value={font} onValueChange={setFont}>
                {FONTS.map((f) => (
                  <SettingsOption key={f.value} value={f.value} label={f.label} preview={<span style={{ fontFamily: f.family }}>Aa</span>} />
                ))}
              </SettingsPicker>
            </PopoverContent>
          </Popover>
        </SettingsRow>
      </Settings>
      <Settings title="Accessibility and language">
        <SettingsRow label="Reduce motion" htmlFor="set-motion" hint="Turns animations off, whatever the device is set to.">
          <Switch
            id="set-motion"
            aria-describedby="set-motion-hint"
            checked={motion}
            onCheckedChange={(next) => {
              setMotion(next);
              const el = root.current;
              if (!el) return;
              if (next) el.setAttribute("data-motion", "reduce");
              else el.removeAttribute("data-motion");
            }}
          />
        </SettingsRow>
        <SettingsRow label="Language" htmlFor="set-language">
          <Select id="set-language" value={language} onChange={(event) => setLanguage(event.currentTarget.value)}>
            {LANGUAGES.map((l) => (
              <option key={l.value} value={l.value} lang={l.value}>
                {l.label}
              </option>
            ))}
          </Select>
        </SettingsRow>
        <SettingsRow label="Text direction" hint="Auto follows the language.">
          <SegmentedControl aria-label="Text direction" value={direction} onValueChange={setDirection}>
            <SegmentedControlItem value="auto">Auto</SegmentedControlItem>
            <SegmentedControlItem value="ltr">Left to right</SegmentedControlItem>
            <SegmentedControlItem value="rtl">Right to left</SegmentedControlItem>
          </SegmentedControl>
        </SettingsRow>
      </Settings>
      <Settings title="Reset">
        <SettingsLink
          label="Reset appearance"
          hint="Theme, density, brand, motion and language go back to their defaults."
          destructive
          onClick={() => {
            setThemeState(DEFAULTS.theme);
            setDensityState(DEFAULTS.density);
            setTextSize(DEFAULTS.textSize);
            setColour(DEFAULTS.colour);
            setCustom(DEFAULTS.custom);
            setShape(DEFAULTS.shape);
            setFont(DEFAULTS.font);
            setMotion(DEFAULTS.motion);
            setLanguage(DEFAULTS.language);
            setDirection(DEFAULTS.direction);
            root.current?.removeAttribute("data-motion");
          }}
        />
      </Settings>
    </div>
  );
}
```

---
Part of @danitesler/ayywi 0.1.2: load `dist/ayywi.min.css` (and `dist/elements.global.js` for the <ayy-*> elements). The rules every screen follows: [llms-full.txt#rules](../llms-full.txt#rules). Every component: [llms.txt](../llms.txt).
