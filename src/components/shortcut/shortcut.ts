import { cx } from "../../lib/cx";

// Shortcuts are strings of "+"-joined parts: modifiers, then one key. "Mod+Shift+K", "Alt+ArrowUp", "F5".
// Mod is ⌘ on Apple devices and Ctrl elsewhere, so one string works on every platform. Keys are named by their
// physical position (event.code: "K", "1", "Comma", "ArrowUp"), so a shortcut stays put on any keyboard layout.

export const shortcutClass = "ayy-shortcut";

export function shortcutRecorderClass({ className }: { className?: string } = {}): string {
  return cx("ayy-shortcut-recorder", className);
}

type Modifier = "Control" | "Alt" | "Shift" | "Meta";
const ORDER_APPLE: Modifier[] = ["Control", "Alt", "Shift", "Meta"];
const ORDER_OTHER: Modifier[] = ["Control", "Meta", "Alt", "Shift"];
const APPLE_SYMBOLS: Record<Modifier, string> = { Control: "⌃", Alt: "⌥", Shift: "⇧", Meta: "⌘" };
const KEY_LABELS: Record<string, string> = {
  ArrowUp: "↑",
  ArrowDown: "↓",
  ArrowLeft: "←",
  ArrowRight: "→",
  Escape: "Esc",
  Delete: "Del",
  Insert: "Ins",
  PageUp: "Page Up",
  PageDown: "Page Down",
  PrintScreen: "Print Screen",
  Minus: "-",
  Equal: "=",
  Comma: ",",
  Period: ".",
  Slash: "/",
  Backslash: "\\",
  Semicolon: ";",
  Quote: "'",
  Backquote: "`",
  BracketLeft: "[",
  BracketRight: "]",
};

const MODIFIER_CODES = /^(Shift|Control|Alt|Meta|OS)(Left|Right)?$/;

export type Platform = "mac" | "windows" | "linux" | "other";

/** Detect the current OS platform ("mac", "windows", "linux", "other"). */
export function getPlatform(): Platform {
  if (typeof navigator === "undefined") return "other";
  const nav = navigator as Navigator & { userAgentData?: { platform?: string } };
  const str = (nav.userAgentData?.platform ?? nav.platform ?? nav.userAgent ?? "").toLowerCase();
  if (/mac|iphone|ipad|ipod/.test(str)) return "mac";
  if (/win/.test(str)) return "windows";
  if (/linux/.test(str)) return "linux";
  return "other";
}

/** True on macOS, iOS and iPadOS, where Mod is ⌘ and modifiers are drawn as symbols. */
export function isApplePlatform(): boolean {
  return getPlatform() === "mac";
}

/** True on Windows devices. */
export function isWindowsPlatform(): boolean {
  return getPlatform() === "windows";
}

/** True on Linux devices. */
export function isLinuxPlatform(): boolean {
  return getPlatform() === "linux";
}

const WINDOWS_NAMES: Record<Modifier, string> = { Control: "Ctrl", Alt: "Alt", Shift: "Shift", Meta: "Win" };
const LINUX_NAMES: Record<Modifier, string> = { Control: "Ctrl", Alt: "Alt", Shift: "Shift", Meta: "Super" };

function platformModifierNames(platform: Platform): Record<Modifier, string> {
  if (platform === "mac") return APPLE_SYMBOLS;
  if (platform === "linux") return LINUX_NAMES;
  return WINDOWS_NAMES;
}

const CYRILLIC_TO_KEY: Record<string, string> = {
  ё: "Backquote",
  й: "q", ц: "w", у: "e", к: "r", е: "t", н: "y", г: "u", ш: "i", щ: "o", з: "p", х: "BracketLeft", ъ: "BracketRight",
  ф: "a", ы: "s", в: "d", а: "f", п: "g", р: "h", о: "j", л: "k", д: "l", ж: "Semicolon", э: "Quote",
  я: "z", ч: "x", с: "c", м: "v", и: "b", т: "n", ь: "m", б: "Comma", ю: "Period",
};

function modifierOf(part: string, apple: boolean): Modifier | null {
  switch (part.toLowerCase()) {
    case "mod":
    case "commandorcontrol":
    case "cmdorctrl":
      return apple ? "Meta" : "Control";
    case "ctrl":
    case "control":
      return "Control";
    case "alt":
    case "option":
    case "opt":
      return "Alt";
    case "shift":
      return "Shift";
    case "meta":
    case "cmd":
    case "command":
    case "super":
    case "win":
      return "Meta";
    default:
      return null;
  }
}

function parse(shortcut: string, apple: boolean): { mods: Set<Modifier>; key: string } {
  const mods = new Set<Modifier>();
  let key = "";
  for (const part of shortcut.split("+").map((p) => p.trim())) {
    if (!part) continue;
    const mod = modifierOf(part, apple);
    if (mod) mods.add(mod);
    else key = part;
  }
  return { mods, key };
}

/** A key's name from event.code: "KeyK" → "K", "Digit1" → "1", "Numpad1" → "Num1", others as is ("Comma", "F5"). */
export function keyFromCode(code: string): string {
  if (/^Key[A-Z]$/.test(code)) return code.slice(3);
  if (/^Digit[0-9]$/.test(code)) return code.slice(5);
  if (/^Numpad[0-9]$/.test(code)) return `Num${code.slice(6)}`;
  return code;
}

/**
 * The shortcut a key press makes ("Mod+Shift+K"), or null while only modifiers are held. Ctrl on other platforms
 * and ⌘ on Apple ones become Mod. Unless `bare` is set, a shortcut needs a modifier, except function keys.
 */
export function shortcutFromEvent(event: Pick<KeyboardEvent, "code" | "key" | "ctrlKey" | "altKey" | "shiftKey" | "metaKey">, { bare = false, apple = isApplePlatform() }: { bare?: boolean; apple?: boolean } = {}): string | null {
  const code = event.code || event.key;
  if (!code || MODIFIER_CODES.test(code)) return null;
  const mods: string[] = [];
  const mod = apple ? event.metaKey : event.ctrlKey;
  if (mod) mods.push("Mod");
  if (apple ? event.ctrlKey : event.metaKey) mods.push(apple ? "Ctrl" : "Meta");
  if (event.altKey) mods.push("Alt");
  if (event.shiftKey) mods.push("Shift");
  const key = keyFromCode(code);
  if (!mods.length && !bare && !/^F([1-9]|1[0-9]|2[0-4])$/.test(key)) return null;
  return [...mods, key].join("+");
}

/**
 * Does this key press match the shortcut? matchShortcut(event, "Mod+K").
 * Supports international keyboard layouts (e.g. Russian Cyrillic Cmd+У matching Cmd+E).
 */
export function matchShortcut(event: KeyboardEvent, shortcut: string, apple = isApplePlatform()): boolean {
  const pressed = shortcutFromEvent(event, { bare: true, apple });
  if (!pressed) return false;
  const a = parse(pressed, apple);
  const b = parse(shortcut, apple);
  if (a.mods.size !== b.mods.size) return false;
  for (const m of a.mods) if (!b.mods.has(m)) return false;

  const aKey = a.key.toLowerCase();
  const bKey = b.key.toLowerCase();
  if (aKey === bKey) return true;

  // The pressed key comes from event.code, so it is already layout-independent (Russian Cmd+У is KeyE). A Cyrillic
  // letter only shows up when event.code is missing, or when the shortcut itself is written in Cyrillic ("Mod+у").
  // Never fall back to event.key: on Dvorak or AZERTY one press would then match two different shortcuts.
  if (CYRILLIC_TO_KEY[aKey]?.toLowerCase() === bKey) return true;
  if (CYRILLIC_TO_KEY[bKey]?.toLowerCase() === aKey) return true;
  return false;
}

/**
 * What to draw for a shortcut, one entry per key: ["⌘", "⇧", "K"] on Apple devices, ["Ctrl", "Shift", "K"] on Windows,
 * ["Ctrl", "Shift", "K"] (and "Super" for Meta) on Linux. Modifiers come first in each platform's usual order.
 */
export function shortcutKeys(shortcut: string, target: Platform | boolean = isApplePlatform()): string[] {
  const platform: Platform = typeof target === "boolean" ? (target ? "mac" : "windows") : target;
  const apple = platform === "mac";
  const { mods, key } = parse(shortcut, apple);
  const names = platformModifierNames(platform);
  const labels = (apple ? ORDER_APPLE : ORDER_OTHER).filter((m) => mods.has(m)).map((m) => names[m]);
  if (key) labels.push(KEY_LABELS[key] ?? (key === "Backspace" && apple ? "⌫" : key === "Enter" && apple ? "↩" : key));
  return labels;
}

/** The shortcut as text for screen readers and titles: "Command Shift K", "Ctrl Shift K", "Ctrl Super Shift K". */
export function shortcutLabel(shortcut: string, target: Platform | boolean = isApplePlatform()): string {
  const words: Record<string, string> = { "⌘": "Command", "⌥": "Option", "⇧": "Shift", "⌃": "Control", "↑": "Up", "↓": "Down", "←": "Left", "→": "Right", "⌫": "Delete", "↩": "Return" };
  return shortcutKeys(shortcut, target)
    .map((k) => words[k] ?? k)
    .join(" ");
}

/**
 * Markup for a shortcut, as React's Shortcut renders it (for innerHTML in plain HTML): the spoken label for screen
 * readers, then one <kbd> per key, hidden from them (they'd read "⌘" as "place of interest sign").
 */
export function shortcutHtml(shortcut: string, target: Platform | boolean = isApplePlatform()): string {
  const escape = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
  const keys = shortcutKeys(shortcut, target)
    .map((k) => `<kbd class="ayy-kbd" aria-hidden="true">${escape(k)}</kbd>`)
    .join("");
  return `<span class="ayy-shortcut" data-keys="${escape(shortcut).replace(/"/g, "&quot;")}"><span class="ayy-sr-only">${escape(shortcutLabel(shortcut, target))}</span>${keys}</span>`;
}

/**
 * Redraw every .ayy-shortcut[data-keys] under root for this device (⌘ ⇧ K on Apple devices, Super for Meta on Linux).
 * Server-rendered and static HTML is written with Windows names; @danitesler/ayywi/elements calls this once on load.
 */
export function syncShortcuts(root: ParentNode = document, target: Platform | boolean = getPlatform()): void {
  const platform: Platform = typeof target === "boolean" ? (target ? "mac" : "windows") : target;
  if (platform === "windows" || platform === "other") return;
  for (const el of root.querySelectorAll<HTMLElement>(".ayy-shortcut[data-keys]")) {
    const keys = el.dataset.keys!;
    const kbds = shortcutKeys(keys, platform);
    const label = el.querySelector(".ayy-sr-only");
    if (label) label.textContent = shortcutLabel(keys, platform);
    for (const kbd of el.querySelectorAll("kbd")) kbd.remove();
    for (const key of kbds) {
      const kbd = document.createElement("kbd");
      kbd.className = "ayy-kbd";
      kbd.setAttribute("aria-hidden", "true");
      kbd.textContent = key;
      el.append(kbd);
    }
  }
}

export interface ShortcutRecorderOptions {
  value?: string | null;
  /** Called with the new shortcut, or null when cleared (Backspace or Delete while recording). */
  onChange?: (value: string | null) => void;
  /** Called when recording starts and stops: pause the app's own shortcuts meanwhile. */
  onRecordingChange?: (recording: boolean) => void;
  /** Allow keys without a modifier. */
  bare?: boolean;
  /** Text while nothing is set and while recording. */
  placeholder?: string;
  recordingText?: string;
  /** What the shortcut does ("Capture area"): the button's name becomes "Capture area: Command Shift 2" and says when it's listening. */
  label?: string;
}

/** The recorder button's accessible name for an action, its value and whether it's listening. */
export function recorderLabel(label: string, value: string | null, recording: boolean, recordingText = "Press keys…"): string {
  if (recording) return `${label}: ${recordingText.replace(/…$/, "")}, or Escape to cancel`;
  return `${label}: ${value ? shortcutLabel(value) : "not set"}`;
}

export interface ShortcutRecorderController {
  setValue(value: string | null): void;
  destroy(): void;
}

/**
 * Turn a button into a shortcut recorder: click (or Enter/Space) starts recording (aria-pressed="true"), the next
 * key combination is the new value, Esc cancels, Backspace/Delete clears, leaving the button cancels. The button
 * shows the keys as .ayy-kbd elements. Framework-free; used by <ayy-shortcut-recorder>. React's ShortcutRecorder
 * renders the same markup itself.
 */
export function connectShortcutRecorder(button: HTMLButtonElement, options: ShortcutRecorderOptions = {}): ShortcutRecorderController {
  let value = options.value ?? null;
  let recording = false;
  const placeholder = options.placeholder ?? button.dataset.placeholder ?? "Record shortcut";
  const recordingText = options.recordingText ?? button.dataset.recording ?? "Press keys…";

  const render = (preview?: string) => {
    button.setAttribute("aria-pressed", String(recording));
    const keys = preview ?? (recording ? null : value);
    const label = options.label ?? button.dataset.label;
    if (label) button.setAttribute("aria-label", recorderLabel(label, value, recording, recordingText));
    if (keys) button.innerHTML = shortcutHtml(keys);
    else {
      const span = document.createElement("span");
      span.className = "ayy-shortcut-recorder__placeholder";
      span.textContent = recording ? recordingText : placeholder;
      button.replaceChildren(span);
    }
  };

  const stop = (next?: string | null) => {
    if (!recording) return;
    recording = false;
    document.removeEventListener("keydown", onKeyDown, true);
    if (next !== undefined) {
      value = next;
      options.onChange?.(next);
    }
    render();
    options.onRecordingChange?.(false);
  };

  function onKeyDown(event: KeyboardEvent) {
    event.preventDefault();
    event.stopPropagation();
    const plain = !event.ctrlKey && !event.metaKey && !event.altKey && !event.shiftKey;
    if (plain && event.key === "Escape") return stop();
    if (plain && (event.key === "Backspace" || event.key === "Delete")) return stop(null);
    if (plain && event.key === "Tab") return stop();
    const shortcut = shortcutFromEvent(event, { bare: options.bare });
    if (shortcut) return stop(shortcut);
    // Only modifiers so far: show them.
    const mods = [event.metaKey && "Meta", event.ctrlKey && "Ctrl", event.altKey && "Alt", event.shiftKey && "Shift"].filter(Boolean).join("+");
    render(mods ? `${mods}+` : undefined);
  }

  const onClick = () => {
    if (recording) return stop();
    recording = true;
    document.addEventListener("keydown", onKeyDown, true);
    render();
    options.onRecordingChange?.(true);
  };
  const onBlur = () => stop();

  button.addEventListener("click", onClick);
  button.addEventListener("blur", onBlur);
  render();

  return {
    setValue(next) {
      value = next;
      render();
    },
    destroy() {
      stop();
      button.removeEventListener("click", onClick);
      button.removeEventListener("blur", onBlur);
    },
  };
}
