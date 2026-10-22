# Keyboard hint

Category: Data display. A keyboard key or shortcut hint drawn as a small keycap: in help text, menus, tooltips and search fields, with platform-specific modifier adaptation (macOS ⌘/⌥, Windows Ctrl/Win, Linux Super) and international layout awareness. Also called: kbd, keyboard-hint, keycap, hotkey, shortcut-key.

**Classes**
- `.ayy-kbd` — The <kbd>: monospace, 0.75em of the surrounding text, a hairline border with a heavier bottom edge.

**States**
- `default` — A small keycap: wash fill, line-strong border with a 2px bottom edge, mono text-soft at 0.75em.
- `hover` — doesn't apply: A key label, not a control.
- `pressed` — doesn't apply: A key label, not a control.
- `focus` — doesn't apply: Not focusable.
- `disabled` — doesn't apply: A key label, not a control.
- `selected` — doesn't apply: A key label, not a control.
- `error` — doesn't apply: No error state.
- `loading` — doesn't apply: No loading state.

**Sizes**
- Density — Scales with the text around it (1.6em tall); scales when surrounding text uses --ayy-text-s.
- Width — At least 1.6em wide, grows with the key name.

**React** — `import { Kbd, KeyboardHint } from "@danitesler/ayywi/react";`
- `<Kbd>` renders <kbd class="ayy-kbd">. Props: `keyName` string — a modifier or key drawn for the platform ("mod", "meta", "alt", "ctrl", "shift", "enter", "backspace"). Symbols get an aria-label with the key's name. The server and first render draw Windows names, then the user's platform.; `platform` "mac" | "windows" | "linux" — force a target platform instead of detecting it
- `<KeyboardHint>` renders <kbd class="ayy-kbd">. Props: `keyName` string — optional modifier/key name to adapt ("mod", "meta", "alt", "ctrl", "shift"); `platform` "mac" | "windows" | "linux" — force a target platform instead of detecting it

**Accessibility**
- Use the <kbd> element: screen readers and search know it's a key.
- Write modifier names out where symbols may not read well ("Ctrl" rather than "^"), or add aria-label="Command K" to a <kbd>⌘K</kbd> (screen readers pronounce "⌘" as "place of interest sign").
- A shortcut hint doesn't replace aria-keyshortcuts on the control it triggers.

**Do**
- Use a kbd for keys people press: "Press / to search", shortcuts in a menu or tooltip, a hint in a search field (InputGroupAddon).
- Use one kbd for a whole shortcut (⌘K), or one per key with a plus between them (Ctrl + Shift + P).
- Adapt modifiers to the user's OS: ⌘ / ⌥ / ⇧ / ⌃ on macOS, Ctrl / Alt / Shift / Win on Windows, and Ctrl / Alt / Shift / Super on Linux (or use <Shortcut keys="Mod+K" /> / <Kbd keyName="mod" />).
- Listen to event.code (physical key like 'KeyE') or use matchShortcut(event, 'Mod+E') rather than event.key === 'e' so hotkeys work across keyboard layouts and languages (e.g. Russian Cyrillic Cmd+У).

**Don't**
- Don't use a kbd for code or file names — use .ayy-mono or <code>.
- Don't use it as a badge or a tag — use Badge.
- Don't show shortcuts on touch-first screens, where there's no keyboard.
- Don't hardcode Mac-only symbols (⌘) or Windows-only names (Ctrl) when targeting multiple operating systems.
- Don't check event.key for letter shortcuts: on non-Latin keyboard layouts (e.g. Russian ЙЦУКЕН), event.key produces localized characters ('у' instead of 'e') and the hotkey fails silently.

## Keyboard hint — Shortcuts in text

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<div class="ayy-stack">
  <p>Press <kbd class="ayy-kbd">/</kbd> to search, or <kbd class="ayy-kbd" aria-label="Command K">⌘K</kbd> to open the command menu.</p>
  <p class="ayy-muted">Save a draft with <kbd class="ayy-kbd">Ctrl</kbd> + <kbd class="ayy-kbd">S</kbd>.</p>
</div>
```

React:

```tsx
import { Kbd } from "@danitesler/ayywi/react";

export default function Example() {
  return (
    <div className="ayy-stack">
      <p>
        Press <Kbd>/</Kbd> to search, or <Kbd aria-label="Command K">⌘K</Kbd> to open the command menu.
      </p>
      <p className="ayy-muted">
        Save a draft with <Kbd keyName="mod" /> + <Kbd>S</Kbd>.
      </p>
    </div>
  );
}
```

## Keyboard hint — Platform adaptation (macOS, Windows, Linux)

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<div class="ayy-stack">
  <div class="ayy-cluster" aria-label="macOS shortcuts">
    <span class="ayy-muted">macOS:</span>
    <kbd class="ayy-kbd" aria-label="Command">⌘</kbd>
    <kbd class="ayy-kbd" aria-label="Option">⌥</kbd>
    <kbd class="ayy-kbd" aria-label="Shift">⇧</kbd>
    <kbd class="ayy-kbd" aria-label="Control">⌃</kbd>
    <kbd class="ayy-kbd">K</kbd>
  </div>
  <div class="ayy-cluster" aria-label="Windows shortcuts">
    <span class="ayy-muted">Windows:</span>
    <kbd class="ayy-kbd">Ctrl</kbd>
    <kbd class="ayy-kbd">Alt</kbd>
    <kbd class="ayy-kbd">Shift</kbd>
    <kbd class="ayy-kbd">Win</kbd>
    <kbd class="ayy-kbd">K</kbd>
  </div>
  <div class="ayy-cluster" aria-label="Linux shortcuts">
    <span class="ayy-muted">Linux:</span>
    <kbd class="ayy-kbd">Ctrl</kbd>
    <kbd class="ayy-kbd">Alt</kbd>
    <kbd class="ayy-kbd">Shift</kbd>
    <kbd class="ayy-kbd">Super</kbd>
    <kbd class="ayy-kbd">K</kbd>
  </div>
</div>
```

React:

```tsx
import { Kbd } from "@danitesler/ayywi/react";

export default function Example() {
  return (
    <div className="ayy-stack">
      <div className="ayy-cluster" aria-label="macOS shortcuts">
        <span className="ayy-muted">macOS:</span>
        <Kbd platform="mac" keyName="mod" />
        <Kbd platform="mac" keyName="alt" />
        <Kbd platform="mac" keyName="shift" />
        <Kbd platform="mac" keyName="ctrl" />
        <Kbd platform="mac">K</Kbd>
      </div>
      <div className="ayy-cluster" aria-label="Windows shortcuts">
        <span className="ayy-muted">Windows:</span>
        <Kbd platform="windows" keyName="ctrl" />
        <Kbd platform="windows" keyName="alt" />
        <Kbd platform="windows" keyName="shift" />
        <Kbd platform="windows" keyName="meta" />
        <Kbd platform="windows">K</Kbd>
      </div>
      <div className="ayy-cluster" aria-label="Linux shortcuts">
        <span className="ayy-muted">Linux:</span>
        <Kbd platform="linux" keyName="ctrl" />
        <Kbd platform="linux" keyName="alt" />
        <Kbd platform="linux" keyName="shift" />
        <Kbd platform="linux" keyName="meta" />
        <Kbd platform="linux">K</Kbd>
      </div>
    </div>
  );
}
```

## Keyboard hint — Multi-language hotkey handling

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<div class="ayy-stack">
  <p>Listen to physical key codes (<code>event.code</code> or <code>matchShortcut</code>) so hotkeys work across languages:</p>
  <div class="ayy-cluster">
    <span class="ayy-muted">English layout:</span>
    <kbd class="ayy-kbd">Ctrl</kbd> + <kbd class="ayy-kbd">E</kbd>
  </div>
  <div class="ayy-cluster">
    <span class="ayy-muted">Russian (ЙЦУКЕН):</span>
    <kbd class="ayy-kbd">Ctrl</kbd> + <kbd class="ayy-kbd">У</kbd>
  </div>
  <p class="ayy-muted">Press Ctrl+E (⌘E on a Mac) on any keyboard layout to test.</p>
</div>
```

React:

```tsx
import { useEffect, useState } from "react";
import { Kbd } from "@danitesler/ayywi/react";
import { matchShortcut } from "@danitesler/ayywi";

export default function Example() {
  const [status, setStatus] = useState<string>("Press Ctrl+E (⌘E on a Mac) on any keyboard layout to test.");

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (matchShortcut(e, "Mod+E")) {
        e.preventDefault();
        setStatus(`Matched Mod+E: code ${e.code || "unknown"}, key "${e.key}".`);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div className="ayy-stack">
      <p>
        Listen to physical key codes (<code>event.code</code> or <code>matchShortcut</code>) so hotkeys work across languages:
      </p>
      <div className="ayy-cluster">
        <span className="ayy-muted">English layout:</span>
        <Kbd keyName="mod" /> + <Kbd>E</Kbd>
      </div>
      <div className="ayy-cluster">
        <span className="ayy-muted">Russian (ЙЦУКЕН):</span>
        <Kbd keyName="mod" /> + <Kbd>У</Kbd>
      </div>
      <p className="ayy-muted">{status}</p>
    </div>
  );
}
```

---
Part of @danitesler/ayywi 0.1.2: load `dist/ayywi.min.css` (and `dist/elements.global.js` for the <ayy-*> elements). The rules every screen follows: [llms-full.txt#rules](../llms-full.txt#rules). Every component: [llms.txt](../llms.txt).
