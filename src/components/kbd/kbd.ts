import { getPlatform, type Platform } from "../shortcut/shortcut";

export const kbdClass = "ayy-kbd";
export const keyboardHintClass = kbdClass;

/**
 * Platform-specific key labels and symbols for modifier keys.
 * macOS uses symbols (⌘, ⌥, ⇧, ⌃); Windows uses names (Ctrl, Alt, Shift, Win); Linux uses Super for Meta.
 */
export function platformKeyLabel(key: string, platform: Platform = getPlatform()): string {
  const p = platform;
  const k = key.toLowerCase();
  if (k === "mod" || k === "cmdorctrl" || k === "commandorcontrol") {
    return p === "mac" ? "⌘" : "Ctrl";
  }
  if (k === "meta" || k === "cmd" || k === "command" || k === "win" || k === "super") {
    if (p === "mac") return "⌘";
    if (p === "linux") return "Super";
    return "Win";
  }
  if (k === "alt" || k === "option" || k === "opt") {
    return p === "mac" ? "⌥" : "Alt";
  }
  if (k === "ctrl" || k === "control") {
    return p === "mac" ? "⌃" : "Ctrl";
  }
  if (k === "shift") {
    return p === "mac" ? "⇧" : "Shift";
  }
  if (k === "enter" || k === "return") {
    return p === "mac" ? "↩" : "Enter";
  }
  if (k === "backspace") {
    return p === "mac" ? "⌫" : "Backspace";
  }
  return key;
}

const SYMBOL_NAMES: Record<string, string> = { "⌘": "Command", "⌥": "Option", "⇧": "Shift", "⌃": "Control", "↩": "Return", "⌫": "Delete" };

/** The key's spoken name: "Command" for ⌘, otherwise the same as platformKeyLabel(). */
export function platformKeyName(key: string, platform: Platform = getPlatform()): string {
  const label = platformKeyLabel(key, platform);
  return SYMBOL_NAMES[label] ?? label;
}
