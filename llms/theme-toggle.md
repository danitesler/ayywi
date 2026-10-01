# Theme toggle

Category: Actions. An icon button that opens a menu of every theme (System, Dark, Dark soft, Light, Light gray), applies the choice to the page and remembers it. The moon or sun on the button shows from CSS alone, following the colour scheme, so it's right on first paint.

**Classes**
- `.ayy-theme-toggle` — On the button (with ayy-button ayy-button--outline ayy-button--icon). Stacks the two icons. Pair it with an ayy-menu popover of theme items.
- `.ayy-theme-toggle__moon` — Icon shown in dark themes.
- `.ayy-theme-toggle__sun` — Icon shown in light themes.
- `.ayy-theme-toggle__item` — On each ayy-menu__item (role="menuitemradio", data-value = theme name or "system"). The one with aria-checked="true" is bold and shows a check.

**JS (framework-free)**: themeToggleClass, themeToggleMoonClass, themeToggleSunClass, themeToggleItemClass constants; themeToggleOptions (System plus every theme, with labels); connectThemeToggle(button, menu, { onChange?, restore? }) → cleanup; it applies the theme chosen on an earlier visit when <html> has none (restore: false to skip).

**Custom element** `<ayy-theme-toggle>` (ayywi/elements) — The icon <button> and a [popover] menu whose items are role="menuitemradio" with data-value. aria-checked is kept in sync for you, including when the theme changes elsewhere.
- event `ayy-value-change`: { value: string } — the theme just applied ("system" clears the override)

**React** — `import { ThemeToggle } from "ayywi/react";`
- `<ThemeToggle>` renders <button class="ayy-button ayy-button--outline ayy-button--icon ayy-theme-toggle"> with both icons, plus the <div class="ayy-menu" popover> listing System and every theme. Props: `onValueChange` (theme: ThemeMode) => void; `aria-label` Default "Theme" (translate it).; `labels` Menu item text per theme, for translation ({ system: "Système", dark: "Sombre" }). Defaults: System, Dark, Dark soft, Light, Light gray.

**Accessibility**
- A menu button: aria-haspopup="menu" with the fixed name "Theme". Arrow keys move through the items, Esc closes and returns focus.
- Items are menuitemradio; aria-checked marks the theme in force, and the check is not the only cue (the item is also bold).
- The icons are aria-hidden; the name carries the meaning.

**Do**
- Use it in a site or app header where readers pick a theme, including following the system.
- Put it next to the brand or before the call to action in the Navbar.
- Load dist/theme-init.js (or inline themeInitScript) first thing in <head>, so the stored theme applies before the first paint. The toggle restores it anyway when it connects, a moment later.

**Don't**
- Don't use it when there are only ever two themes and no "system" — a plain Button calling setTheme() is enough.
- Don't use it to theme one section — set data-theme on it.
- Don't change the button's label with the theme; the menu shows which one is selected.

## Theme toggle — Theme menu

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<!-- <ayy-theme-toggle> (ayywi/elements) opens the menu, switches <html> to the chosen theme and remembers it. data-value is a theme name or "system". -->
<ayy-theme-toggle>
  <button type="button" class="ayy-button ayy-button--outline ayy-button--icon ayy-theme-toggle" aria-label="Theme" aria-haspopup="menu" popovertarget="theme-menu-html">
    <svg class="ayy-icon ayy-theme-toggle__moon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M21.5 14.0784C20.3003 14.7189 18.9301 15.0821 17.4751 15.0821C12.7491 15.0821 8.91792 11.2509 8.91792 6.52485C8.91792 5.06986 9.28105 3.69968 9.92163 2.5C5.66765 3.49698 2.5 7.31513 2.5 11.8731C2.5 17.1899 6.8101 21.5 12.1269 21.5C16.6849 21.5 20.503 18.3324 21.5 14.0784Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/></svg>
    <svg class="ayy-icon ayy-theme-toggle__sun" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M17 12C17 14.7614 14.7614 17 12 17C9.23858 17 7 14.7614 7 12C7 9.23858 9.23858 7 12 7C14.7614 7 17 9.23858 17 12Z" stroke="currentColor" stroke-width="1.5"/><path d="M12 2V3.5M12 20.5V22M19.0708 19.0713L18.0101 18.0106M5.98926 5.98926L4.9286 4.9286M22 12H20.5M3.5 12H2M19.0713 4.92871L18.0106 5.98937M5.98975 18.0107L4.92909 19.0714" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"/></svg>
  </button>
  <div class="ayy-menu" id="theme-menu-html" popover role="menu" aria-label="Theme">
    <button type="button" class="ayy-menu__item ayy-theme-toggle__item" role="menuitemradio" aria-checked="true" data-value="system">System</button>
    <button type="button" class="ayy-menu__item ayy-theme-toggle__item" role="menuitemradio" aria-checked="false" data-value="dark">Dark</button>
    <button type="button" class="ayy-menu__item ayy-theme-toggle__item" role="menuitemradio" aria-checked="false" data-value="dark-soft">Dark soft</button>
    <button type="button" class="ayy-menu__item ayy-theme-toggle__item" role="menuitemradio" aria-checked="false" data-value="light">Light</button>
    <button type="button" class="ayy-menu__item ayy-theme-toggle__item" role="menuitemradio" aria-checked="false" data-value="light-gray">Light gray</button>
  </div>
</ayy-theme-toggle>
```

React:

```tsx
import { ThemeToggle } from "ayywi/react";

export default function Example() {
  return <ThemeToggle />;
}
```

---
Part of ayywi 0.4.0: load `dist/ayywi.min.css` (and `dist/elements.global.js` for the <ayy-*> elements). The rules every screen follows: [llms-full.txt#rules](../llms-full.txt#rules). Every component: [llms.txt](../llms.txt).
