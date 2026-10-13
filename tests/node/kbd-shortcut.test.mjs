import assert from "node:assert/strict";
import { test } from "node:test";
import {
  getPlatform,
  isApplePlatform,
  isWindowsPlatform,
  isLinuxPlatform,
  matchShortcut,
  shortcutKeys,
  shortcutLabel,
  platformKeyLabel,
} from "../../dist/index.js";

test("platform detection and helpers", () => {
  assert.equal(typeof getPlatform(), "string");
  assert.equal(isApplePlatform(), getPlatform() === "mac");
  assert.equal(isWindowsPlatform(), getPlatform() === "windows");
  assert.equal(isLinuxPlatform(), getPlatform() === "linux");
});

test("platformKeyLabel maps modifiers to OS symbols and names", () => {
  assert.equal(platformKeyLabel("mod", "mac"), "⌘");
  assert.equal(platformKeyLabel("mod", "windows"), "Ctrl");
  assert.equal(platformKeyLabel("mod", "linux"), "Ctrl");

  assert.equal(platformKeyLabel("meta", "mac"), "⌘");
  assert.equal(platformKeyLabel("meta", "windows"), "Win");
  assert.equal(platformKeyLabel("meta", "linux"), "Super");

  assert.equal(platformKeyLabel("alt", "mac"), "⌥");
  assert.equal(platformKeyLabel("alt", "windows"), "Alt");
  assert.equal(platformKeyLabel("alt", "linux"), "Alt");

  assert.equal(platformKeyLabel("ctrl", "mac"), "⌃");
  assert.equal(platformKeyLabel("ctrl", "windows"), "Ctrl");
  assert.equal(platformKeyLabel("ctrl", "linux"), "Ctrl");

  assert.equal(platformKeyLabel("shift", "mac"), "⇧");
  assert.equal(platformKeyLabel("shift", "windows"), "Shift");
  assert.equal(platformKeyLabel("shift", "linux"), "Shift");
});

test("shortcutKeys adapts to Windows, Linux, and macOS", () => {
  assert.deepEqual(shortcutKeys("Mod+K", "mac"), ["⌘", "K"]);
  assert.deepEqual(shortcutKeys("Mod+K", "windows"), ["Ctrl", "K"]);
  assert.deepEqual(shortcutKeys("Mod+K", "linux"), ["Ctrl", "K"]);

  assert.deepEqual(shortcutKeys("Meta+Shift+K", "windows"), ["Win", "Shift", "K"]);
  assert.deepEqual(shortcutKeys("Meta+Shift+K", "linux"), ["Super", "Shift", "K"]);
  assert.equal(shortcutLabel("Meta+Shift+K", "linux"), "Super Shift K");
});

test("matchShortcut supports multi-language / Russian keyboard layout (Cmd+E vs Cmd+У)", () => {
  // English layout: event.code is KeyE, event.key is 'e'
  const eventEnglish = { code: "KeyE", key: "e", metaKey: true, ctrlKey: false, altKey: false, shiftKey: false };
  assert.equal(matchShortcut(eventEnglish, "Mod+E", true), true);

  // Russian layout (ЙЦУКЕН): event.code is KeyE, event.key is 'у'
  const eventRussian = { code: "KeyE", key: "у", metaKey: true, ctrlKey: false, altKey: false, shiftKey: false };
  assert.equal(matchShortcut(eventRussian, "Mod+E", true), true);

  // Shortcut defined in Russian 'Mod+у' should also match when user presses the key in English or Russian
  assert.equal(matchShortcut(eventEnglish, "Mod+у", true), true);
  assert.equal(matchShortcut(eventRussian, "Mod+у", true), true);

  // Fallback when event.code is missing (e.g. mobile/IME) and only event.key 'у' is provided
  const eventWithoutCode = { code: "", key: "у", metaKey: true, ctrlKey: false, altKey: false, shiftKey: false };
  assert.equal(matchShortcut(eventWithoutCode, "Mod+E", true), true);
});

test("matchShortcut follows the physical key, so one press never matches two shortcuts", () => {
  // Dvorak: the physical I key types "c". It is Mod+I, not also Mod+C.
  const dvorak = { code: "KeyI", key: "c", metaKey: true, ctrlKey: false, altKey: false, shiftKey: false };
  assert.equal(matchShortcut(dvorak, "Mod+I", true), true);
  assert.equal(matchShortcut(dvorak, "Mod+C", true), false);
});

test("platformKeyLabel leaves other keys alone", () => {
  assert.equal(platformKeyLabel("K", "mac"), "K");
  assert.equal(platformKeyLabel("enter", "mac"), "↩");
  assert.equal(platformKeyLabel("enter", "windows"), "Enter");
});
