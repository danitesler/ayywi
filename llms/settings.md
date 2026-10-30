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
- For appearance settings, use the same two controls in every product: Mode (System, Light, Dark) as a Select whose pictures are SettingsScreens, applied with setTheme(); and Theme as a Select of THEME_PRESETS whose pictures are a Swatch (ayy-swatch) with the theme's accent as --ayy-swatch, applied with setBrand(), setThemeCustomization() and setIconPack(). A theme carries the accent, surfaces, corners, fonts and icons, so don't offer them as separate settings: a cog button beside Theme opens a dialog with them (Accent colour swatches, Surface and Corners segmented controls, Font, Icons and Density selects) and a live preview, filled in with the current theme, and saving a change makes it the Theme select's last option, Custom. Text direction is a Select with SettingsScreen pictures (dir on the screen). Reduce motion as a Switch, Language as a Select, and Reset appearance as a destructive link row. Apply each at once.

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
          <div class="ayy-select"><select class="ayy-select__control" id="set-theme-html" aria-describedby="set-theme-hint-html"><option value="default" selected="">Default</option><option value="ember">Ember</option><option value="forest">Forest</option><option value="arctic">Arctic</option><option value="twilight">Twilight</option><option value="wine">Wine</option><option value="custom">Custom</option></select><span class="ayy-select__picture" data-value="default" aria-hidden="true"><span class="ayy-swatch" style="--ayy-swatch:var(--ayy-color-text)"></span></span><span class="ayy-select__picture" data-value="ember" hidden="" aria-hidden="true"><span class="ayy-swatch" style="--ayy-swatch:var(--ayy-palette-orange-65)"></span></span><span class="ayy-select__picture" data-value="forest" hidden="" aria-hidden="true"><span class="ayy-swatch" style="--ayy-swatch:var(--ayy-palette-green-51)"></span></span><span class="ayy-select__picture" data-value="arctic" hidden="" aria-hidden="true"><span class="ayy-swatch" style="--ayy-swatch:var(--ayy-palette-blue-68)"></span></span><span class="ayy-select__picture" data-value="twilight" hidden="" aria-hidden="true"><span class="ayy-swatch" style="--ayy-swatch:var(--ayy-palette-violet-58)"></span></span><span class="ayy-select__picture" data-value="wine" hidden="" aria-hidden="true"><span class="ayy-swatch" style="--ayy-swatch:var(--ayy-palette-red-71)"></span></span><span class="ayy-select__picture" data-value="custom" hidden="" aria-hidden="true"><span class="ayy-swatch" style="--ayy-swatch:var(--ayy-color-text)"></span></span></div>
          <!-- <ayy-dialog> (@danitesler/ayywi/elements): the cog opens the theme's settings; Save applies them as the Custom theme. -->
          <ayy-dialog>
            <span class="ayy-tooltip"><button data-ayy-open type="button" class="ayy-button ayy-button--outline ayy-button--icon" aria-label="Customize theme" aria-haspopup="dialog"><svg class="ayy-icon" data-ayy-icon="settings" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M21.3175 7.14139L20.8239 6.28479C20.4506 5.63696 20.264 5.31305 19.9464 5.18388C19.6288 5.05472 19.2696 5.15664 18.5513 5.36048L17.3311 5.70418C16.8725 5.80994 16.3913 5.74994 15.9726 5.53479L15.6357 5.34042C15.2766 5.11043 15.0004 4.77133 14.8475 4.37274L14.5136 3.37536C14.294 2.71534 14.1842 2.38533 13.9228 2.19657C13.6615 2.00781 13.3143 2.00781 12.6199 2.00781H11.5051C10.8108 2.00781 10.4636 2.00781 10.2022 2.19657C9.94085 2.38533 9.83106 2.71534 9.61149 3.37536L9.27753 4.37274C9.12465 4.77133 8.84845 5.11043 8.48937 5.34042L8.15249 5.53479C7.73374 5.74994 7.25259 5.80994 6.79398 5.70418L5.57375 5.36048C4.85541 5.15664 4.49625 5.05472 4.17867 5.18388C3.86109 5.31305 3.67445 5.63696 3.30115 6.28479L2.80757 7.14139C2.45766 7.74864 2.2827 8.05227 2.31666 8.37549C2.35061 8.69871 2.58483 8.95918 3.05326 9.48012L4.0843 10.6328C4.3363 10.9518 4.51521 11.5078 4.51521 12.0077C4.51521 12.5078 4.33636 13.0636 4.08433 13.3827L3.05326 14.5354C2.58483 15.0564 2.35062 15.3168 2.31666 15.6401C2.2827 15.9633 2.45766 16.2669 2.80757 16.8741L3.30114 17.7307C3.67443 18.3785 3.86109 18.7025 4.17867 18.8316C4.49625 18.9608 4.85542 18.8589 5.57377 18.655L6.79394 18.3113C7.25263 18.2055 7.73387 18.2656 8.15267 18.4808L8.4895 18.6752C8.84851 18.9052 9.12464 19.2442 9.2775 19.6428L9.61149 20.6403C9.83106 21.3003 9.94085 21.6303 10.2022 21.8191C10.4636 22.0078 10.8108 22.0078 11.5051 22.0078H12.6199C13.3143 22.0078 13.6615 22.0078 13.9228 21.8191C14.1842 21.6303 14.294 21.3003 14.5136 20.6403L14.8476 19.6428C15.0004 19.2442 15.2765 18.9052 15.6356 18.6752L15.9724 18.4808C16.3912 18.2656 16.8724 18.2055 17.3311 18.3113L18.5513 18.655C19.2696 18.8589 19.6288 18.9608 19.9464 18.8316C20.264 18.7025 20.4506 18.3785 20.8239 17.7307L21.3175 16.8741C21.6674 16.2669 21.8423 15.9633 21.8084 15.6401C21.7744 15.3168 21.5402 15.0564 21.0718 14.5354L20.0407 13.3827C19.7887 13.0636 19.6098 12.5078 19.6098 12.0077C19.6098 11.5078 19.7888 10.9518 20.0407 10.6328L21.0718 9.48012C21.5402 8.95918 21.7744 8.69871 21.8084 8.37549C21.8423 8.05227 21.6674 7.74864 21.3175 7.14139Z" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path><path d="M15.5195 12C15.5195 13.933 13.9525 15.5 12.0195 15.5C10.0865 15.5 8.51953 13.933 8.51953 12C8.51953 10.067 10.0865 8.5 12.0195 8.5C13.9525 8.5 15.5195 10.067 15.5195 12Z" stroke="currentColor" stroke-width="1.5"></path></svg></button><span role="tooltip" class="ayy-tooltip__content" data-side="top">Customize theme</span></span>
            <dialog class="ayy-dialog ayy-dialog--xl" aria-labelledby="set-customize-title-html" aria-describedby="set-customize-desc-html">
            <div class="ayy-dialog__header"><h2 id="set-customize-title-html" class="ayy-dialog__title">Customize theme</h2><p id="set-customize-desc-html" class="ayy-dialog__description">Changes show in the preview. Saving a change makes it your Custom theme.</p></div>
            <div class="ayy-dialog__body">
            <div style="display:flex;flex-wrap:wrap;align-items:stretch;gap:var(--ayy-space-5)">
            <div class="ayy-stack" style="flex:1 1 15rem;max-inline-size:20rem">
            <div class="ayy-field"><span class="ayy-label" id="set-accent-html">Accent colour</span><div role="group" class="ayy-swatch-group ayy-swatch-group--track" aria-labelledby="set-accent-html"><span class="ayy-tooltip"><button type="button" aria-pressed="true" aria-label="Monochrome" class="ayy-swatch" style="--ayy-swatch:var(--ayy-color-text)" aria-describedby="set-customize-2-html"></button><span role="tooltip" id="set-customize-2-html" class="ayy-tooltip__content" data-side="top">Monochrome</span></span><span class="ayy-tooltip"><button type="button" aria-pressed="false" aria-label="Ember" class="ayy-swatch" style="--ayy-swatch:var(--ayy-palette-orange-65)" aria-describedby="set-customize-3-html"></button><span role="tooltip" id="set-customize-3-html" class="ayy-tooltip__content" data-side="top">Ember</span></span><span class="ayy-tooltip"><button type="button" aria-pressed="false" aria-label="Forest" class="ayy-swatch" style="--ayy-swatch:var(--ayy-palette-green-51)" aria-describedby="set-customize-4-html"></button><span role="tooltip" id="set-customize-4-html" class="ayy-tooltip__content" data-side="top">Forest</span></span><span class="ayy-tooltip"><button type="button" aria-pressed="false" aria-label="Arctic" class="ayy-swatch" style="--ayy-swatch:var(--ayy-palette-blue-68)" aria-describedby="set-customize-5-html"></button><span role="tooltip" id="set-customize-5-html" class="ayy-tooltip__content" data-side="top">Arctic</span></span><span class="ayy-tooltip"><button type="button" aria-pressed="false" aria-label="Twilight" class="ayy-swatch" style="--ayy-swatch:var(--ayy-palette-violet-58)" aria-describedby="set-customize-8-html"></button><span role="tooltip" id="set-customize-8-html" class="ayy-tooltip__content" data-side="top">Twilight</span></span><span class="ayy-tooltip"><button type="button" aria-pressed="false" aria-label="Wine" class="ayy-swatch" style="--ayy-swatch:var(--ayy-palette-red-71)" aria-describedby="set-customize-9-html"></button><span role="tooltip" id="set-customize-9-html" class="ayy-tooltip__content" data-side="top">Wine</span></span><span class="ayy-tooltip"><label class="ayy-swatch ayy-swatch--custom" style="--ayy-swatch:var(--ayy-palette-violet-58)"><input type="color" aria-label="Custom accent colour" aria-describedby="set-customize-1-html" value="#7c3aed"/></label><span role="tooltip" id="set-customize-1-html" class="ayy-tooltip__content" data-side="top">Custom colour</span></span></div></div>
            <div class="ayy-field"><span class="ayy-label" id="set-surface-html">Surface</span><div role="radiogroup" class="ayy-segmented-control ayy-segmented-control--full" aria-labelledby="set-surface-html"><label class="ayy-segmented-control__option"><input type="radio" name="set-customize-6-html" checked="" value="neutral"/>Neutral</label><label class="ayy-segmented-control__option"><input type="radio" name="set-customize-6-html" value="subtle"/>Subtle</label></div></div>
            <div class="ayy-field"><span class="ayy-label" id="set-corners-html">Corners</span><div role="radiogroup" class="ayy-segmented-control ayy-segmented-control--full" aria-labelledby="set-corners-html"><label class="ayy-segmented-control__option"><input type="radio" name="set-customize-7-html" checked="" value="pill"/>Pill</label><label class="ayy-segmented-control__option"><input type="radio" name="set-customize-7-html" value="round"/>Round</label><label class="ayy-segmented-control__option"><input type="radio" name="set-customize-7-html" value="soft"/>Soft</label><label class="ayy-segmented-control__option"><input type="radio" name="set-customize-7-html" value="sharp"/>Sharp</label></div></div>
            <div class="ayy-field"><label class="ayy-label" for="set-font-html">Font</label><div class="ayy-select"><select class="ayy-select__control" id="set-font-html" aria-describedby="set-font-hint-html"><option value="default" selected="">Default</option><option value="editorial">Editorial</option><option value="serif">Serif</option><option value="sans">Sans</option><option value="system">System</option><option value="grotesk">Grotesk</option><option value="technical">Technical</option><option value="friendly">Friendly</option><option value="display">Display</option><option value="readable">Readable</option></select></div><p class="ayy-field__hint" id="set-font-hint-html">Unbounded + Sora</p></div>
            <div class="ayy-field"><label class="ayy-label" for="set-icons-html">Icons</label><div class="ayy-select"><select class="ayy-select__control" id="set-icons-html"><option value="hugeicons" selected="">Hugeicons</option><option value="feather">Feather</option><option value="lucide">Lucide</option><option value="material-symbols">Material Symbols</option><option value="tabler">Tabler Icons</option></select></div></div>
            <div class="ayy-field"><label class="ayy-label" for="set-density-html">Density</label><div class="ayy-select"><select class="ayy-select__control" id="set-density-html" aria-describedby="set-density-hint-html"><option value="auto" selected="">Auto</option><option value="compact">Compact</option><option value="comfortable">Comfortable</option><option value="touch">Touch</option></select></div><p class="ayy-field__hint" id="set-density-hint-html">Auto: compact with a mouse, touch on a touch screen.</p></div></div>
            <div role="group" aria-label="Preview" style="flex:999 1 20rem;display:grid;place-items:center;padding:var(--ayy-space-6);border:1px solid var(--ayy-color-line);border-radius:var(--ayy-radius-card);background:var(--ayy-color-bg);color:var(--ayy-color-text);font-family:var(--ayy-font-body)"><div class="ayy-card" style="inline-size:100%;max-inline-size:26rem"><div class="ayy-card__header ayy-cluster"><h3 class="ayy-h6">Weekly report</h3><span class="ayy-badge">Live</span></div><div class="ayy-card__content ayy-stack"><p class="ayy-muted">Revenue is up 12% on last week.</p>
            <div class="ayy-field ayy-field--inline"><input type="checkbox" role="switch" class="ayy-switch" id="set-preview-weekly-html" checked=""/><label class="ayy-label" for="set-preview-weekly-html">Every Monday</label></div><div class="ayy-cluster" aria-hidden="true"><svg class="ayy-icon" data-ayy-icon="search" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M17 17L21 21" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19C15.4183 19 19 15.4183 19 11Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg><svg class="ayy-icon" data-ayy-icon="bell" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M15.5 18C15.5 19.933 13.933 21.5 12 21.5C10.067 21.5 8.5 19.933 8.5 18" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M19.2311 18H4.76887C3.79195 18 3 17.208 3 16.2311C3 15.762 3.18636 15.3121 3.51809 14.9803L4.12132 14.3771C4.68393 13.8145 5 13.0514 5 12.2558V9.5C5 5.63401 8.13401 2.5 12 2.5C15.866 2.5 19 5.634 19 9.5V12.2558C19 13.0514 19.3161 13.8145 19.8787 14.3771L20.4819 14.9803C20.8136 15.3121 21 15.762 21 16.2311C21 17.208 20.208 18 19.2311 18Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg><svg class="ayy-icon" data-ayy-icon="settings" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M21.3175 7.14139L20.8239 6.28479C20.4506 5.63696 20.264 5.31305 19.9464 5.18388C19.6288 5.05472 19.2696 5.15664 18.5513 5.36048L17.3311 5.70418C16.8725 5.80994 16.3913 5.74994 15.9726 5.53479L15.6357 5.34042C15.2766 5.11043 15.0004 4.77133 14.8475 4.37274L14.5136 3.37536C14.294 2.71534 14.1842 2.38533 13.9228 2.19657C13.6615 2.00781 13.3143 2.00781 12.6199 2.00781H11.5051C10.8108 2.00781 10.4636 2.00781 10.2022 2.19657C9.94085 2.38533 9.83106 2.71534 9.61149 3.37536L9.27753 4.37274C9.12465 4.77133 8.84845 5.11043 8.48937 5.34042L8.15249 5.53479C7.73374 5.74994 7.25259 5.80994 6.79398 5.70418L5.57375 5.36048C4.85541 5.15664 4.49625 5.05472 4.17867 5.18388C3.86109 5.31305 3.67445 5.63696 3.30115 6.28479L2.80757 7.14139C2.45766 7.74864 2.2827 8.05227 2.31666 8.37549C2.35061 8.69871 2.58483 8.95918 3.05326 9.48012L4.0843 10.6328C4.3363 10.9518 4.51521 11.5078 4.51521 12.0077C4.51521 12.5078 4.33636 13.0636 4.08433 13.3827L3.05326 14.5354C2.58483 15.0564 2.35062 15.3168 2.31666 15.6401C2.2827 15.9633 2.45766 16.2669 2.80757 16.8741L3.30114 17.7307C3.67443 18.3785 3.86109 18.7025 4.17867 18.8316C4.49625 18.9608 4.85542 18.8589 5.57377 18.655L6.79394 18.3113C7.25263 18.2055 7.73387 18.2656 8.15267 18.4808L8.4895 18.6752C8.84851 18.9052 9.12464 19.2442 9.2775 19.6428L9.61149 20.6403C9.83106 21.3003 9.94085 21.6303 10.2022 21.8191C10.4636 22.0078 10.8108 22.0078 11.5051 22.0078H12.6199C13.3143 22.0078 13.6615 22.0078 13.9228 21.8191C14.1842 21.6303 14.294 21.3003 14.5136 20.6403L14.8476 19.6428C15.0004 19.2442 15.2765 18.9052 15.6356 18.6752L15.9724 18.4808C16.3912 18.2656 16.8724 18.2055 17.3311 18.3113L18.5513 18.655C19.2696 18.8589 19.6288 18.9608 19.9464 18.8316C20.264 18.7025 20.4506 18.3785 20.8239 17.7307L21.3175 16.8741C21.6674 16.2669 21.8423 15.9633 21.8084 15.6401C21.7744 15.3168 21.5402 15.0564 21.0718 14.5354L20.0407 13.3827C19.7887 13.0636 19.6098 12.5078 19.6098 12.0077C19.6098 11.5078 19.7888 10.9518 20.0407 10.6328L21.0718 9.48012C21.5402 8.95918 21.7744 8.69871 21.8084 8.37549C21.8423 8.05227 21.6674 7.74864 21.3175 7.14139Z" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path><path d="M15.5195 12C15.5195 13.933 13.9525 15.5 12.0195 15.5C10.0865 15.5 8.51953 13.933 8.51953 12C8.51953 10.067 10.0865 8.5 12.0195 8.5C13.9525 8.5 15.5195 10.067 15.5195 12Z" stroke="currentColor" stroke-width="1.5"></path></svg></div></div><div class="ayy-card__footer"><button type="button" class="ayy-button ayy-button--outline">Preview</button><button type="button" class="ayy-button">Send report</button></div></div></div></div></div>
            <div class="ayy-dialog__footer"><button type="button" class="ayy-button ayy-button--ghost" style="margin-inline-end:auto">Reset</button><button type="button" class="ayy-button ayy-button--outline" data-ayy-close>Cancel</button><button type="button" class="ayy-button" data-ayy-close="save">Save</button></div>
            <button type="button" class="ayy-dialog__close" aria-label="Close" data-ayy-close><svg class="ayy-icon" data-ayy-icon="x" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M18 6L6.00081 17.9992M17.9992 18L6 6.00085" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg></button>
            </dialog>
          </ayy-dialog>
        </div>
      </div>
    </div>
  </section>
  <section class="ayy-settings" aria-labelledby="set-a11y-html">
    <h2 id="set-a11y-html" class="ayy-settings__title">Accessibility and language</h2>
    <p class="ayy-settings__description">Motion, the interface language and which way text reads.</p>
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
import { BRAND_SHAPES, iconPackInfo, iconPacks, setBrand, setDensity, setIconPack, setTheme, setThemeCustomization, surfaceStrength, THEME_FONTS, THEME_PRESETS, tokens, type BrandShape, type DensityMode, type IconPackName, type SurfaceStyle, type ThemeCustomization, type ThemeMode } from "@danitesler/ayywi";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  ColorSwatchButton,
  ColorSwatchCustom,
  ColorSwatchGroup,
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Field,
  FieldHint,
  Icon,
  Label,
  SegmentedControl,
  SegmentedControlItem,
  Select,
  Settings,
  SettingsLink,
  SettingsRow,
  SettingsScreen,
  Switch,
  Tooltip,
} from "@danitesler/ayywi/react";
import { Notification01Icon, Search01Icon, Settings01Icon } from "@hugeicons/core-free-icons";

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
const accentPicture = (accent: string) => <span className="ayy-swatch" style={{ "--ayy-swatch": THEME_ACCENTS[accent] ?? accent } as CSSProperties} />;

// What the customize dialog edits: a theme's accent (a theme's colour, or any colour), surfaces, corners, fonts, icons and density.
type ThemeSettings = { accent: string; surface: SurfaceStyle; shape: BrandShape; font: string; icons: IconPackName; density: DensityMode };
const DENSITIES: { value: DensityMode; label: string }[] = [
  { value: "auto", label: "Auto" },
  { value: "compact", label: "Compact" },
  { value: "comfortable", label: "Comfortable" },
  { value: "touch", label: "Touch" },
];
const settingsOf = (id: string): ThemeSettings => {
  const preset = THEME_PRESETS.find((p) => p.id === id) ?? THEME_PRESETS[0];
  const font = THEME_FONTS.find((f) => JSON.stringify(f.font ?? null) === JSON.stringify(preset.brand?.font ?? null));
  return { accent: preset.brand ? preset.id : "default", surface: preset.customization.surface as SurfaceStyle, shape: preset.brand?.shape ?? "pill", font: font?.id ?? "default", icons: preset.icons ?? "hugeicons", density: "auto" };
};
const ACCENTS = THEME_PRESETS.map((preset) => ({ value: preset.brand ? preset.id : "default", label: preset.brand ? preset.label : "Monochrome" }));
/** The accent's seed colour: a theme's own, a picked one, or null for monochrome. */
const colorOf = (accent: string) => (accent === "default" ? null : (THEME_PRESETS.find((p) => p.id === accent)?.brand?.color ?? accent));
const SHAPES = Object.keys(BRAND_SHAPES).map((shape) => ({ value: shape as BrandShape, label: shape.charAt(0).toUpperCase() + shape.slice(1) }));
const THEME_PICTURES = picturesOf(THEME_PRESETS.map((preset) => ({ value: preset.id })), (t) => accentPicture(t.value));

const tokenColor = (name: keyof typeof tokens) => {
  const token = tokens[name] as { value: unknown; light?: string };
  return `light-dark(${token.light ?? token.value}, ${token.value})`;
};
const stack = (fonts: readonly string[]) => fonts.map((f) => (f.includes(" ") ? `"${f}"` : f)).join(", ");
// Monochrome has no brand of its own, so the preview resets what a brand around it would set.
const MONO_STYLE = {
  "--ayy-color-primary": tokenColor("color.primary"),
  "--ayy-color-primary-fg": tokenColor("color.primary-fg"),
  "--ayy-color-ring": tokenColor("color.ring"),
  "--ayy-color-glow": tokenColor("color.glow"),
} as CSSProperties;
const MONO_FONTS = { "--ayy-font-heading": stack(tokens["font.heading"].value), "--ayy-font-body": stack(tokens["font.body"].value) } as CSSProperties;

/** Puts a theme's settings on an element: its brand (or monochrome with the corners and fonts), surfaces, icons and density. */
function applyTheme(el: HTMLElement, settings: ThemeSettings, name: string) {
  const color = colorOf(settings.accent);
  const { shape } = settings;
  const font = THEME_FONTS.find((f) => f.id === settings.font)?.font;
  setBrand(color ? { name, color, shape, font } : null, el);
  // Monochrome has no brand to carry corners and fonts, so the customization does.
  const customization: ThemeCustomization = { color: color ?? tokens["palette.neutral.58"].value, surface: settings.surface, contrast: 0, ...(color ? {} : { appearance: { shape, font } }) };
  setThemeCustomization(customization, el, color);
  setIconPack(settings.icons, el, { persist: false });
  setDensity(settings.density, el);
}
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
  custom: settingsOf("default"),
  motion: false,
  language: "en",
  direction: "auto",
};

export default function Example() {
  const root = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<ThemeMode>(DEFAULTS.mode);
  const [theme, setThemeId] = useState<string>(DEFAULTS.theme);
  // The Custom theme, and the dialog's copy of whichever theme it was opened on.
  const [custom, setCustom] = useState<ThemeSettings>(DEFAULTS.custom);
  const [draft, setDraft] = useState<ThemeSettings | null>(null);
  const current = theme === "custom" ? custom : settingsOf(theme);
  const [motion, setMotion] = useState<boolean>(DEFAULTS.motion);
  const [language, setLanguage] = useState<string>(DEFAULTS.language);
  const [direction, setDirection] = useState<string>(DEFAULTS.direction);

  // Everything applies to this example only; in an app, target <html> (omit the element argument).
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    setTheme(mode, el);
    // A theme sets the accent, corners, fonts, surfaces and icons together.
    const preset = THEME_PRESETS.find((p) => p.id === theme);
    if (preset) {
      setBrand(preset.brand, el);
      const { customization } = preset;
      setThemeCustomization(surfaceStrength(customization.surface) === 0 && customization.contrast === 0 ? null : customization, el, preset.brand?.color ?? null);
      setIconPack(preset.icons ?? "hugeicons", el, { persist: false });
      setDensity("auto", el);
    } else {
      applyTheme(el, custom, "custom");
    }
    const lang = LANGUAGES.find((l) => l.value === language);
    el.lang = language;
    el.dir = direction === "auto" ? (lang?.dir ?? "ltr") : direction;
  }, [mode, theme, custom, language, direction]);

  /** Save: unchanged, it stays the theme it was opened on; changed, it becomes Custom. */
  const saveTheme = () => {
    if (!draft) return;
    if (theme === "custom" || JSON.stringify(draft) !== JSON.stringify(current)) {
      setCustom(draft);
      setThemeId("custom");
    }
    setDraft(null);
  };
  const edit = (patch: Partial<ThemeSettings>) => setDraft((d) => (d ? { ...d, ...patch } : d));
  // The dialog's live preview wears the draft.
  const [preview, setPreview] = useState<HTMLDivElement | null>(null);
  useEffect(() => {
    if (preview && draft) applyTheme(preview, draft, "theme-preview");
  }, [preview, draft]);
  const previewStyle = {
    flex: "999 1 20rem",
    display: "grid",
    placeItems: "center",
    padding: "var(--ayy-space-6)",
    border: "1px solid var(--ayy-color-line)",
    borderRadius: "var(--ayy-radius-card)",
    background: "var(--ayy-color-bg)",
    color: "var(--ayy-color-text)",
    fontFamily: "var(--ayy-font-body)",
    ...(draft && !colorOf(draft.accent) ? { ...MONO_STYLE, ...(draft.font === "default" ? MONO_FONTS : {}) } : {}),
  } as CSSProperties;
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
          <Select id="set-theme" aria-describedby="set-theme-hint" value={theme} onChange={(event) => setThemeId(event.currentTarget.value)} pictures={{ ...THEME_PICTURES, custom: accentPicture(custom.accent) }}>
            {THEME_PRESETS.map((preset) => (
              <option key={preset.id} value={preset.id}>
                {preset.label}
              </option>
            ))}
            <option value="custom">Custom</option>
          </Select>
          <Button variant="outline" size="icon" aria-label="Customize theme" aria-haspopup="dialog" onClick={() => setDraft(current)}>
            <Icon icon={Settings01Icon} name="settings" />
          </Button>
        </SettingsRow>
      </Settings>
      <Dialog open={Boolean(draft)} onOpenChange={(open) => !open && setDraft(null)}>
        <DialogContent size="xl">
          <DialogHeader>
            <DialogTitle>Customize theme</DialogTitle>
            <DialogDescription>Changes show in the preview. Saving a change makes it your Custom theme.</DialogDescription>
          </DialogHeader>
          {draft && (
            <DialogBody>
              {/* Settings on the start side; the preview takes the rest of the width and their full height. */}
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "stretch", gap: "var(--ayy-space-5)" }}>
                <div className="ayy-stack" style={{ flex: "1 1 15rem", maxInlineSize: "20rem" }}>
                  <Field>
                    <span className="ayy-label" id="set-accent">Accent colour</span>
                    <ColorSwatchGroup track role="group" aria-labelledby="set-accent">
                      {ACCENTS.map((a) => (
                        <Tooltip key={a.value} content={a.label}>
                          <ColorSwatchButton color={THEME_ACCENTS[a.value]} label={a.label} pressed={draft.accent === a.value} onClick={() => edit({ accent: a.value })} />
                        </Tooltip>
                      ))}
                      <Tooltip content="Custom colour">
                        <ColorSwatchCustom label="Custom accent colour" value={colorOf(draft.accent) ?? tokens["palette.violet.58"].value} onChange={(event) => edit({ accent: event.currentTarget.value })} />
                      </Tooltip>
                    </ColorSwatchGroup>
                  </Field>
                  <Field>
                    <span className="ayy-label" id="set-surface">Surface</span>
                    <SegmentedControl full aria-labelledby="set-surface" value={draft.surface} onValueChange={(value) => edit({ surface: value as SurfaceStyle })}>
                      <SegmentedControlItem value="neutral">Neutral</SegmentedControlItem>
                      <SegmentedControlItem value="subtle">Subtle</SegmentedControlItem>
                    </SegmentedControl>
                  </Field>
                  <Field>
                    <span className="ayy-label" id="set-corners">Corners</span>
                    <SegmentedControl full aria-labelledby="set-corners" value={draft.shape} onValueChange={(value) => edit({ shape: value as BrandShape })}>
                      {SHAPES.map((shape) => (
                        <SegmentedControlItem key={shape.value} value={shape.value}>
                          {shape.label}
                        </SegmentedControlItem>
                      ))}
                    </SegmentedControl>
                  </Field>
                  <Field>
                    <Label htmlFor="set-font">Font</Label>
                    <Select id="set-font" aria-describedby="set-font-hint" value={draft.font} onChange={(event) => edit({ font: event.currentTarget.value })}>
                      {THEME_FONTS.map((f) => (
                        <option key={f.id} value={f.id}>
                          {f.label}
                        </option>
                      ))}
                    </Select>
                    <FieldHint id="set-font-hint">{THEME_FONTS.find((f) => f.id === draft.font)?.description}</FieldHint>
                  </Field>
                  <Field>
                    <Label htmlFor="set-icons">Icons</Label>
                    <Select id="set-icons" value={draft.icons} onChange={(event) => edit({ icons: event.currentTarget.value as IconPackName })}>
                      {iconPacks.map((pack) => (
                        <option key={pack} value={pack}>
                          {iconPackInfo[pack].label}
                        </option>
                      ))}
                    </Select>
                  </Field>
                  <Field>
                    <Label htmlFor="set-density">Density</Label>
                    <Select id="set-density" aria-describedby="set-density-hint" value={draft.density} onChange={(event) => edit({ density: event.currentTarget.value as DensityMode })}>
                      {DENSITIES.map((d) => (
                        <option key={d.value} value={d.value}>
                          {d.label}
                        </option>
                      ))}
                    </Select>
                    <FieldHint id="set-density-hint">Auto: compact with a mouse, touch on a touch screen.</FieldHint>
                  </Field>
                </div>
                <div ref={setPreview} role="group" aria-label="Preview" style={previewStyle}>
                  <Card style={{ inlineSize: "100%", maxInlineSize: "26rem" }}>
                    <CardHeader className="ayy-cluster">
                      <h3 className="ayy-h6">Weekly report</h3>
                      <Badge>Live</Badge>
                    </CardHeader>
                    <CardContent className="ayy-stack">
                      <p className="ayy-muted">Revenue is up 12% on last week.</p>
                      <Field inline>
                        <Switch id="set-preview-weekly" defaultChecked />
                        <Label htmlFor="set-preview-weekly">Every Monday</Label>
                      </Field>
                      <div className="ayy-cluster" aria-hidden="true">
                        <Icon icon={Search01Icon} name="search" />
                        <Icon icon={Notification01Icon} name="bell" />
                        <Icon icon={Settings01Icon} name="settings" />
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline">Preview</Button>
                      <Button>Send report</Button>
                    </CardFooter>
                  </Card>
                </div>
              </div>
            </DialogBody>
          )}
          <DialogFooter>
            <Button variant="ghost" style={{ marginInlineEnd: "auto" }} onClick={() => setDraft(settingsOf("default"))}>
              Reset
            </Button>
            <DialogClose variant="outline">Cancel</DialogClose>
            <Button onClick={saveTheme}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Settings title="Accessibility and language" description="Motion, the interface language and which way text reads.">
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
            setCustom(DEFAULTS.custom);
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
