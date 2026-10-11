# Settings

Settings open over the app in a near-full-screen dialog, as Notion's and Claude's do: a Settings title and the settings sections in its sidebar, one section in its main, a close button in the corner. Full screen on phones. Never a small or side dialog, never tabs inside a page.

Built from: App shell, Top bar, Settings, Switch, Select, Segmented control, Shortcut, Button, Dialog, Toast. Example: App shell → "Settings in a near-full-screen dialog" (`get_component app-shell`, llms/app-shell.md).

**How**
1. Entry: a Settings link in the sidebar's AppShellFooter (an icon and "Settings"). On phones, the same link in the More drawer, or a settings icon button in the AppShellBar. Desktop apps also open it on ⌘, (Ctrl+, elsewhere).
2. Open: a Dialog with <DialogContent size="full" aria-labelledby="<the title's id>"> (class ayy-dialog--full) over the page the user was on, holding an AppShell with settings (class ayy-app-shell--settings). Its AppShellSidebar holds, in order: AppShellTitle ("Settings", with the id the dialog points at) and an AppShellNav aria-label="Settings" of AppShellGroups ("Account": profile, preferences, notifications; "Workspace" or "App": the app's own areas; "About" last). Its main is <AppShellMain as="div"> (the page keeps its one <main>). No AppShellBack, AppShellBar, BottomNav or brand: the dialog's close button is the way out.
3. Sections: the open section's AppShellLink has current (aria-current="page"); a link click switches the section in place. On wide screens settings open on the first section; on phones on the section list.
4. Section: the main starts with a TopBar (title = the section's name, its <h1>; onBack returns to the section list, backLabel = "Settings"; its back button shows on phones only), then one Settings group per topic (title, optional description) holding SettingsRows (a Switch, Select, SegmentedControl, Shortcut recorder or Button at the end) and SettingsLinks (rows that open a sub-page or run an action). The content column is --ayy-size-measure wide, centred; the shell does that.
5. Saving: switches, selects and segmented controls apply at once; confirm with a Toast only when the effect isn't visible. Free text (a name, a folder path) saves on blur or Enter. Anything that must be submitted together (a password change) is a Dialog opened from a SettingsLink.
6. Danger: Sign out, Reset and Delete account go last, in their own Settings group, as destructive SettingsLinks; destructive ones confirm in a Dialog.
7. Leave: the dialog's close button, Esc or a click on the backdrop. The dialog puts focus back on the Settings link the user came from.

**Phones**
- Below 48rem the settings shell is two screens, picked by aria-current: the dialog fills the screen and the settings shell is two screens, picked by aria-current: with no section current, the sidebar is the screen (a large "Settings" title, the sections as rows with chevrons); with one current, the section fills it and its TopBar's back returns to the list. Move focus to the section when it opens and back to its link when it closes.
- Settings rows wrap the control under the label when there isn't room; never shrink a control below its size.
- For a choice with more than five options on a phone, use a SettingsLink with the current value that opens a sub-page with a radio list, instead of a long Select.
- Touch density (data-density="touch") raises sidebar items and rows to 52px; nothing is sized by hand.

**Specs** (don't restyle these)
- **Sidebar item (.ayy-app-shell__link, in the app and in settings)**: --ayy-size-control-lg high (40px compact, 48px comfortable, 52px touch), padding-inline --ayy-space-3, a --ayy-size-icon-md (20px) icon then --ayy-space-3, --ayy-control-text-lg, medium weight, --ayy-radius-pill. Muted text; hover: --ayy-color-wash and the text colour; current (aria-current="page"): --ayy-color-wash-hover, the text colour, semibold. Items --ayy-space-1 apart. Groups: an uppercase --ayy-text-2xs label, and a hairline plus --ayy-space-3 above every group after the first.
- **Settings group (.ayy-settings)**: A <section> labelled by its <h2> (--ayy-text-md, semibold), an optional muted --ayy-text-sm description, then the rows in a card: a 1px --ayy-color-line border, --ayy-radius-card, --ayy-color-surface. Groups are --ayy-space-6 apart. .ayy-settings--plain (no card) only in a sheet or dialog that already has a surface.
- **Settings row (.ayy-settings__row)**: At least --ayy-size-control-lg high, padding --ayy-space-3 block and --ayy-space-4 inline, --ayy-space-4 between the text and the control. Label --ayy-text-sm medium; hint --ayy-text-xs muted, one line. The control sits at the inline end. A 1px --ayy-color-hairline between rows only: none above the first or below the last.
- **Section header (.ayy-top-bar in the settings main)**: Sticky, the page colour with a hairline under it; title semibold (--ayy-text-xl in the dialog on wide screens, --ayy-text-md on phones), lined up with the content column. One <h1> per section.
- **Settings dialog (.ayy-dialog--full)**: Up to 72rem by 50rem, 4rem clear of the viewport on each axis, no padding: the settings shell fills it, the sidebar 15rem. The whole screen below 48rem, without border or radius. The close button sits in the top-end corner over the section's Top bar.

**Do**
- Use this pattern for every settings, preferences or account screen in an app, however few settings there are.
- Name sections with one noun (General, Appearance, Notifications, Shortcuts, Data, About) and give each a Hugeicons icon in the sidebar.
- Keep every setting's label short and put the why in its hint.

**Don't**
- Don't put settings in a small or side Dialog, a Popover or Tabs inside a page: they can't hold a growing list of sections, and they end up looking different in every app.
- Don't put the app's destinations, bar or bottom nav inside the settings dialog; its close button is the way out.
- Don't restyle sidebar items or settings rows (radius, padding, dividers) in app CSS: the specs above are the contract, and they follow density on their own.
- Don't add a Save button for settings that apply at once.

---
A pattern of @danitesler/ayywi 0.0.2. Every pattern and rule: [llms-full.txt#patterns](../llms-full.txt#patterns).
