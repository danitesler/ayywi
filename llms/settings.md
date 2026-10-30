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
- `.ayy-settings__picker` — A grid of larger pictures to choose from in a stacked row (an appearance setting that should show every choice at once): role="radiogroup" with an aria-label. For a dropdown, use a Select with pictures.
- `.ayy-settings__option` — One picture to choose: a <label> around a visually hidden native radio, a .ayy-settings__preview and a .ayy-settings__caption. Chosen: the picture gets a text-colour border and the caption turns the text colour.
- `.ayy-settings__preview` — The picture's 16:10 frame in a SettingsOption. Holds a .ayy-settings__screen, or a short sample such as "Aa" in a font. aria-hidden: the caption names the option. (In a Select, the screen goes straight in its .ayy-select__picture.)
- `.ayy-settings__caption` — The option's name under the picture ("Dark", "Sharp").
- `.ayy-settings__screen` — A miniature app (sidebar, heading, lines, a primary button) drawn from the tokens around it, for Theme, Corners and Text direction: in a Select's pictures (.ayy-select__picture) or a SettingsOption's. Set data-theme, data-density or dir on it, or brand and corner tokens on or around it, to preview them; it mirrors in RTL. Two in one picture split it, the second showing the right half: System as light then dark, Auto density as compact then touch, Auto direction as dir="ltr" then dir="rtl".
- `.ayy-settings__screen--rows` — For Density: a list of rows, each a line of text and a control, divided by hairlines; rows are as tall as data-density makes them (exaggerated), so Compact shows about two and a half times the rows Touch does.
- `.ayy-settings__screen--brand` — For Brand colour: where the primary colour shows (the chosen sidebar item tinted, a filled progress bar, a ticked checkbox, the primary button). Set --ayy-color-primary on it to preview a colour (a palette token; var(--ayy-color-text) for the monochrome default).

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
- Width — Fills its container. A row wraps its control under the label when there's no room; stack does it always. Inputs and popover triggers in a row are at least 11rem, selects 12.5rem (room for a picture). A picker is a grid of 8.5rem-minimum columns with 16:10 pictures. A screen's parts are sized in container units of its picture, so one drawing fits a grid tile and both of a Select's pictures.

**React** — `import { Settings, SettingsRow, SettingsLink, SettingsPicker, SettingsOption, SettingsScreen } from "@danitesler/ayywi/react";`
- `<Settings>` renders <section class="ayy-settings" aria-labelledby> <h2 class="ayy-settings__title"> … <div class="ayy-settings__list">{children}</div>. Props: `title` ReactNode — the heading; the section is labelled by it; `description` ReactNode — a line under the heading; `plain` boolean — no card around the rows
- `<SettingsRow>` renders <div class="ayy-settings__row"> text + <div class="ayy-settings__control">{children}</div>. Props: `label` ReactNode — the setting's name; `htmlFor` string — the control's id: the label becomes a <label for>, and the hint gets the id `${htmlFor}-hint` for the control's aria-describedby; `hint` ReactNode — one line explaining it; `error` ReactNode — replaces the hint, in red, with role="alert"; `stack` boolean — the control under the text at full width
- `<SettingsLink>` renders <a class="ayy-settings__row ayy-settings__link" href> with href, else <button type="button">; a directional chevron unless destructive. Props: `label` ReactNode — what it opens or does; `hint` ReactNode — a line under the label; `value` ReactNode — the current value, before the chevron; `destructive` boolean — red, no chevron (Sign out); `href` string — opens a page: the row is an <a>; without it a <button>; `type / disabled` Button rows only. type defaults to "button"
- `<SettingsPicker>` renders <div role="radiogroup" class="ayy-settings__picker">{children}</div>; give it an aria-label. Props: `name` string — shared radio name; generated if omitted; `value / defaultValue` string — the chosen option; `onValueChange` (value: string) => void; `disabled` boolean — every option
- `<SettingsOption>` renders <label class="ayy-settings__option"><input type="radio"> <span class="ayy-settings__preview" aria-hidden="true">{preview}</span> <span class="ayy-settings__caption">{label}</span></label>. Props: `value` string — the option's value; `label` ReactNode — the caption, which names the radio; `preview` ReactNode — the picture; a SettingsScreen by default, or a sample like "Aa" in a font or at a text size; `disabled` boolean; `inputProps` props for the native radio
- `<SettingsScreen>` renders <span class="ayy-settings__screen" data-theme data-density aria-hidden="true">; two of them for theme="system" (light, dark) or density="auto" (compact, touch). Props: `variant` "app" | "rows" | "brand" — what it draws: the app (Theme, Corners, Text direction), rows (Density) or the primary colour's places (Brand colour; set --ayy-color-primary in style); `theme` "system" | "light" | "dark" | "dark-contrast" | "light-gray" — the theme it's drawn in; omit for the one around it; `density` "compact" | "comfortable" | "touch" | "auto" — the density it's drawn in; omit for the one around it

**Accessibility**
- Each group is a <section> labelled by its <h2>, so screen-reader users can jump between groups.
- Every control needs a name: give SettingsRow htmlFor and the control that id, so the label is a real <label for>. For a Switch, put the id on the switch's input.
- Point the control's aria-describedby at the hint (`${htmlFor}-hint`) so the explanation is read with it.
- A link row is one <a> or <button>: its whole text, value included, is its name. Use <a href> when it opens a page, <button> when it does something.
- Controls wrap under the label on narrow screens instead of shrinking below a usable size.
- A picker is a radiogroup of native radios: arrow keys move between options, and each option is named by its caption. The pictures are aria-hidden.
- A custom colour's <input type="color"> is hidden and out of the tab order: choosing Custom opens the colour picker as a labelled dialog under the select with focus in it, and Esc or Enter closes it and puts focus back on the select.

**Do**
- Use it for any settings or preferences screen: group related rows under short headings (General, Notifications, Shortcuts). They open in a near-full-screen Dialog (size="full") holding the App shell in settings mode (the Settings pattern): a sidebar of sections and one section's groups in the main.
- Keep labels short and put the why in the hint ("Show a badge with the number of tasks due today").
- Use a Switch for on/off that applies at once, a Select for one of several, a Shortcut recorder for key bindings.
- On phones, use link rows with the current value for anything with more than a few choices, and open a sub-page.
- Put Sign out or Delete account last, in its own group, as a destructive link row.
- For appearance settings, use the same two controls in every product: Mode (System, Light, Dark) as a Select whose pictures are SettingsScreens, applied with setTheme(); and Theme as a Select of THEME_PRESETS whose pictures are SettingsScreen variant="brand" with the theme's accent as --ayy-color-primary, applied with setBrand(), setThemeCustomization() and setIconPack(). A theme carries the accent, surfaces, corners, fonts and icons, so don't offer them as separate settings. Text direction is a Select with SettingsScreen pictures (dir on the screen). Reduce motion as a Switch, Language as a Select, and Reset appearance as a destructive link row. Apply each at once.

**Don't**
- Don't add a Save button for switches and selects that apply at once; save as they change and confirm with a Toast if needed.
- Don't put two controls in one row; split the setting.
- Don't use a checkbox for a setting that applies at once — that's what a Switch says.
- Don't nest a card inside the list; use another group.
- Don't draw your own theme thumbnails, or use a Select without pictures or a button opening a popover for Mode, Theme or Text direction: a Select whose pictures are SettingsScreens draws each choice from its real tokens. Don't add separate settings for brand colour, surfaces, contrast, corners, fonts, icons, density or text size: the theme decides them.
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
      <a class="ayy-settings__row ayy-settings__link" href="#profile"><span class="ayy-settings__text"><span class="ayy-settings__label">Profile</span><span class="ayy-settings__hint">ada@example.com</span></span><svg class="ayy-icon ayy-icon--directional" data-ayy-icon="chevron-right" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M9.00005 6C9.00005 6 15 10.4189 15 12C15 13.5812 9 18 9 18" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg></a>
      <a class="ayy-settings__row ayy-settings__link" href="#language"><span class="ayy-settings__text"><span class="ayy-settings__label">Language</span></span><span class="ayy-settings__value">English</span><svg class="ayy-icon ayy-icon--directional" data-ayy-icon="chevron-right" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M9.00005 6C9.00005 6 15 10.4189 15 12C15 13.5812 9 18 9 18" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg></a>
      <a class="ayy-settings__row ayy-settings__link" href="#sync"><span class="ayy-settings__text"><span class="ayy-settings__label">Sync</span></span><span class="ayy-settings__value">On</span><svg class="ayy-icon ayy-icon--directional" data-ayy-icon="chevron-right" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M9.00005 6C9.00005 6 15 10.4189 15 12C15 13.5812 9 18 9 18" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg></a>
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

## Settings — Appearance, language and reset

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<div style="inline-size:100%;max-inline-size:42rem;font-family:var(--ayy-font-body)">
  <section class="ayy-settings" aria-labelledby="set-appearance-html">
    <h2 id="set-appearance-html" class="ayy-settings__title">Appearance</h2>
    <p class="ayy-settings__description">Light or dark, and the theme for the whole interface.</p>
    <div class="ayy-settings__list">
      <div class="ayy-settings__row">
        <div class="ayy-settings__text">
          <label class="ayy-settings__label" for="set-mode-html">Mode</label>
          <p class="ayy-settings__hint" id="set-mode-hint-html">System follows your device's light or dark setting.</p>
        </div>
        <div class="ayy-settings__control">
          <div class="ayy-select">
            <select class="ayy-select__control" id="set-mode-html" aria-describedby="set-mode-hint-html">
              <option value="system" selected>System</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
            <span class="ayy-select__picture" data-value="system" aria-hidden="true"><span class="ayy-settings__screen" data-theme="light" aria-hidden="true"></span><span class="ayy-settings__screen" data-theme="dark" aria-hidden="true"></span></span>
            <span class="ayy-select__picture" data-value="light" hidden="" aria-hidden="true"><span class="ayy-settings__screen" data-theme="light" aria-hidden="true"></span></span>
            <span class="ayy-select__picture" data-value="dark" hidden="" aria-hidden="true"><span class="ayy-settings__screen" data-theme="dark" aria-hidden="true"></span></span>
          </div>
        </div>
      </div>
      <div class="ayy-settings__row">
        <div class="ayy-settings__text">
          <label class="ayy-settings__label" for="set-theme-html">Theme</label>
          <p class="ayy-settings__hint" id="set-theme-hint-html">Colour, corners, fonts and icons, in light and dark.</p>
        </div>
        <div class="ayy-settings__control">
          <div class="ayy-select">
            <select class="ayy-select__control" id="set-theme-html" aria-describedby="set-theme-hint-html">
              <option value="default" selected>Default</option>
              <option value="ember">Ember</option>
              <option value="forest">Forest</option>
              <option value="arctic">Arctic</option>
              <option value="twilight">Twilight</option>
              <option value="wine">Wine</option>
            </select>
            <span class="ayy-select__picture" data-value="default" aria-hidden="true"><span class="ayy-settings__screen ayy-settings__screen--brand" style="--ayy-color-primary:var(--ayy-color-text)" aria-hidden="true"></span></span>
            <span class="ayy-select__picture" data-value="ember" hidden="" aria-hidden="true"><span class="ayy-settings__screen ayy-settings__screen--brand" style="--ayy-color-primary:var(--ayy-palette-orange-65)" aria-hidden="true"></span></span>
            <span class="ayy-select__picture" data-value="forest" hidden="" aria-hidden="true"><span class="ayy-settings__screen ayy-settings__screen--brand" style="--ayy-color-primary:var(--ayy-palette-green-51)" aria-hidden="true"></span></span>
            <span class="ayy-select__picture" data-value="arctic" hidden="" aria-hidden="true"><span class="ayy-settings__screen ayy-settings__screen--brand" style="--ayy-color-primary:var(--ayy-palette-blue-68)" aria-hidden="true"></span></span>
            <span class="ayy-select__picture" data-value="twilight" hidden="" aria-hidden="true"><span class="ayy-settings__screen ayy-settings__screen--brand" style="--ayy-color-primary:var(--ayy-palette-violet-58)" aria-hidden="true"></span></span>
            <span class="ayy-select__picture" data-value="wine" hidden="" aria-hidden="true"><span class="ayy-settings__screen ayy-settings__screen--brand" style="--ayy-color-primary:var(--ayy-palette-red-71)" aria-hidden="true"></span></span>
          </div>
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
          <label class="ayy-settings__label" for="set-direction-html">Text direction</label>
          <p class="ayy-settings__hint" id="set-direction-hint-html">Auto follows the language.</p>
        </div>
        <div class="ayy-settings__control">
          <div class="ayy-select">
            <select class="ayy-select__control" id="set-direction-html" aria-describedby="set-direction-hint-html">
              <option value="auto" selected>Auto</option>
              <option value="ltr">Left to right</option>
              <option value="rtl">Right to left</option>
            </select>
            <span class="ayy-select__picture" data-value="auto" aria-hidden="true"><span class="ayy-settings__screen" dir="ltr" aria-hidden="true"></span><span class="ayy-settings__screen" dir="rtl" aria-hidden="true"></span></span>
            <span class="ayy-select__picture" data-value="ltr" hidden="" aria-hidden="true"><span class="ayy-settings__screen" dir="ltr" aria-hidden="true"></span></span>
            <span class="ayy-select__picture" data-value="rtl" hidden="" aria-hidden="true"><span class="ayy-settings__screen" dir="rtl" aria-hidden="true"></span></span>
          </div>
        </div>
      </div>
    </div>
  </section>
  <section class="ayy-settings" aria-labelledby="set-reset-html">
    <h2 id="set-reset-html" class="ayy-settings__title">Reset</h2>
    <div class="ayy-settings__list">
      <button type="button" class="ayy-settings__row ayy-settings__link ayy-settings__link--destructive"><span class="ayy-settings__text"><span class="ayy-settings__label">Reset appearance</span><span class="ayy-settings__hint">Mode, theme, motion and language go back to their defaults.</span></span></button>
    </div>
  </section>
</div>
```

React:

```tsx
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { setBrand, setIconPack, setTheme, setThemeCustomization, surfaceStrength, THEME_PRESETS, type ThemeMode } from "@danitesler/ayywi";
import { Select, Settings, SettingsLink, SettingsRow, SettingsScreen, Switch } from "@danitesler/ayywi/react";

const MODES: { value: ThemeMode; label: string }[] = [
  { value: "system", label: "System" },
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
];

const DIRECTIONS = [
  { value: "auto", label: "Auto" },
  { value: "ltr", label: "Left to right" },
  { value: "rtl", label: "Right to left" },
];

// Auto shows both halves: left to right, then right to left.
function DirectionScreen({ direction }: { direction: string }) {
  if (direction === "auto")
    return (
      <>
        <SettingsScreen dir="ltr" />
        <SettingsScreen dir="rtl" />
      </>
    );
  return <SettingsScreen dir={direction} />;
}

// One picture per option value, for a Select's pictures.
const picturesOf = <T extends { value: string }>(options: readonly T[], picture: (option: T) => ReactNode) =>
  Object.fromEntries(options.map((option) => [option.value, picture(option)]));

const MODE_PICTURES = picturesOf(MODES, (m) => <SettingsScreen theme={m.value} />);
// Each theme's accent as the nearest palette colour, drawn in the current mode; Default is monochrome, where primary is the text colour.
const THEME_ACCENTS: Record<string, string> = {
  default: "var(--ayy-color-text)",
  ember: "var(--ayy-palette-orange-65)",
  forest: "var(--ayy-palette-green-51)",
  arctic: "var(--ayy-palette-blue-68)",
  twilight: "var(--ayy-palette-violet-58)",
  wine: "var(--ayy-palette-red-71)",
};
const THEME_PICTURES = picturesOf(THEME_PRESETS.map((preset) => ({ value: preset.id })), (t) => (
  <SettingsScreen variant="brand" style={{ "--ayy-color-primary": THEME_ACCENTS[t.value] } as CSSProperties} />
));
const DIRECTION_PICTURES = picturesOf(DIRECTIONS, (d) => <DirectionScreen direction={d.value} />);

const LANGUAGES = [
  { value: "en", label: "English", dir: "ltr" },
  { value: "de", label: "Deutsch", dir: "ltr" },
  { value: "he", label: "עברית", dir: "rtl" },
  { value: "ar", label: "العربية", dir: "rtl" },
] as const;

const DEFAULTS = {
  mode: "system" as ThemeMode,
  theme: "default",
  motion: false,
  language: "en",
  direction: "auto",
};

export default function Example() {
  const root = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<ThemeMode>(DEFAULTS.mode);
  const [theme, setThemeId] = useState<string>(DEFAULTS.theme);
  const [motion, setMotion] = useState<boolean>(DEFAULTS.motion);
  const [language, setLanguage] = useState<string>(DEFAULTS.language);
  const [direction, setDirection] = useState<string>(DEFAULTS.direction);

  // Everything applies to this example only; in an app, target <html> (omit the element argument).
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    setTheme(mode, el);
    // A theme sets the accent, corners, fonts, surfaces and icons together.
    const preset = THEME_PRESETS.find((p) => p.id === theme) ?? THEME_PRESETS[0];
    setBrand(preset.brand, el);
    const { customization } = preset;
    setThemeCustomization(surfaceStrength(customization.surface) === 0 && customization.contrast === 0 ? null : customization, el, preset.brand?.color ?? null);
    setIconPack(preset.icons ?? "hugeicons", el, { persist: false });
    const lang = LANGUAGES.find((l) => l.value === language);
    el.lang = language;
    el.dir = direction === "auto" ? (lang?.dir ?? "ltr") : direction;
  }, [mode, theme, language, direction]);
  useEffect(() => { const el = root.current; return () => { if (el) setThemeCustomization(null, el); }; }, []);

  return (
    <div ref={root} style={{ inlineSize: "100%", maxInlineSize: "42rem", fontFamily: "var(--ayy-font-body)" }}>
      <Settings title="Appearance" description="Light or dark, and the theme for the whole interface.">
        <SettingsRow label="Mode" htmlFor="set-mode" hint="System follows your device's light or dark setting.">
          <Select id="set-mode" aria-describedby="set-mode-hint" value={mode} onChange={(event) => setMode(event.currentTarget.value as ThemeMode)} pictures={MODE_PICTURES}>
            {MODES.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </Select>
        </SettingsRow>
        <SettingsRow label="Theme" htmlFor="set-theme" hint="Colour, corners, fonts and icons, in light and dark.">
          <Select id="set-theme" aria-describedby="set-theme-hint" value={theme} onChange={(event) => setThemeId(event.currentTarget.value)} pictures={THEME_PICTURES}>
            {THEME_PRESETS.map((preset) => (
              <option key={preset.id} value={preset.id}>
                {preset.label}
              </option>
            ))}
          </Select>
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
        <SettingsRow label="Text direction" htmlFor="set-direction" hint="Auto follows the language.">
          <Select
            id="set-direction"
            aria-describedby="set-direction-hint"
            value={direction}
            onChange={(event) => setDirection(event.currentTarget.value)}
            pictures={DIRECTION_PICTURES}
          >
            {DIRECTIONS.map((d) => (
              <option key={d.value} value={d.value}>
                {d.label}
              </option>
            ))}
          </Select>
        </SettingsRow>
      </Settings>
      <Settings title="Reset">
        <SettingsLink
          label="Reset appearance"
          hint="Mode, theme, motion and language go back to their defaults."
          destructive
          onClick={() => {
            setMode(DEFAULTS.mode);
            setThemeId(DEFAULTS.theme);
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
