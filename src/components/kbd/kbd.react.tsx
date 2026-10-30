import { forwardRef, type HTMLAttributes } from "react";
import { cx } from "../../lib/cx";
import { kbdClass, platformKeyLabel, platformKeyName } from "./kbd";
import type { Platform } from "../shortcut/shortcut";
import { usePlatform } from "../shortcut/shortcut.react";

export interface KbdProps extends HTMLAttributes<HTMLElement> {
  /** A modifier or key to draw for the platform: "mod", "meta", "alt", "ctrl", "shift", "enter", "backspace". */
  keyName?: string;
  /** Draw it for this platform instead of the user's: "mac", "windows", "linux". */
  platform?: Platform;
}

/**
 * A key or shortcut hint: <Kbd>⌘K</Kbd> or <Kbd keyName="mod" />. With keyName, a symbol (⌘ ⌥ ⇧ ⌃ ↩ ⌫) gets an
 * aria-label so screen readers say the key's name. The server and the first render draw Windows names.
 */
export const Kbd = /* @__PURE__ */ forwardRef<HTMLElement, KbdProps>(function Kbd({ keyName, platform, children, className, ...props }, ref) {
  const detected = usePlatform();
  const target = platform ?? detected;
  const label = keyName ? platformKeyLabel(keyName, target) : undefined;
  const spoken = keyName ? platformKeyName(keyName, target) : undefined;
  return (
    <kbd ref={ref} className={cx(kbdClass, className)} aria-label={spoken !== label ? spoken : undefined} {...props}>
      {label ?? children}
    </kbd>
  );
});

export type KeyboardHintProps = KbdProps;

/** Kbd under its display name: <KeyboardHint keyName="mod" />. */
export const KeyboardHint = Kbd;
