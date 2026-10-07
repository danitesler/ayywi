import { forwardRef, useEffect, useRef, useState, useSyncExternalStore, type ButtonHTMLAttributes, type HTMLAttributes, type ReactNode } from "react";
import { cx } from "../../lib/cx";
import { recorderLabel, shortcutClass, shortcutFromEvent, shortcutKeys, shortcutLabel, shortcutRecorderClass, isApplePlatform } from "./shortcut";

const noop = () => () => {};
/** Apple or not, without a hydration mismatch: the server (and the first client render) say "not Apple". */
function useApple(): boolean {
  return useSyncExternalStore(noop, isApplePlatform, () => false);
}

export interface ShortcutProps extends HTMLAttributes<HTMLSpanElement> {
  /** "Mod+Shift+K": Mod is ⌘ on Apple devices and Ctrl elsewhere. */
  keys: string;
}

/** A shortcut's keys as keycaps (⌘ ⇧ K on a Mac, Ctrl Shift K elsewhere), read aloud as words. */
export const Shortcut = forwardRef<HTMLSpanElement, ShortcutProps>(function Shortcut({ keys, className, ...props }, ref) {
  const apple = useApple();
  return (
    <span ref={ref} className={cx(shortcutClass, className)} data-keys={keys} {...props}>
      <span className="ayy-sr-only">{shortcutLabel(keys, apple)}</span>
      {shortcutKeys(keys, apple).map((key, i) => (
        <kbd key={i} className="ayy-kbd" aria-hidden="true">
          {key}
        </kbd>
      ))}
    </span>
  );
});

export interface ShortcutRecorderProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "value" | "onChange"> {
  /** The shortcut, "Mod+Shift+2", or null when none is set. */
  value: string | null;
  /** The new shortcut, or null when cleared (Backspace or Delete while recording). */
  onValueChange: (value: string | null) => void;
  /** What the shortcut does ("Capture area"). Names the button: "Capture area: Command Shift 2". */
  label: string;
  /** Pause the app's own shortcuts while recording. */
  onRecordingChange?: (recording: boolean) => void;
  /** Allow keys without a modifier (a single letter). */
  bare?: boolean;
  /** Shown while no shortcut is set. Default "Record shortcut". */
  placeholder?: ReactNode;
  /** Shown while listening. Default "Press keys…". */
  recordingText?: string;
}

/** Click, then press the keys. Esc cancels, Backspace clears, leaving the button stops listening. */
export const ShortcutRecorder = forwardRef<HTMLButtonElement, ShortcutRecorderProps>(function ShortcutRecorder(
  { value, onValueChange, label, onRecordingChange, bare, placeholder = "Record shortcut", recordingText = "Press keys…", className, onClick, onBlur, ...props },
  ref,
) {
  const [recording, setRecording] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const handlers = useRef({ onValueChange, onRecordingChange });
  handlers.current = { onValueChange, onRecordingChange };

  useEffect(() => {
    if (!recording) return;
    handlers.current.onRecordingChange?.(true);
    const finish = (next?: string | null) => {
      setRecording(false);
      setPreview(null);
      if (next !== undefined) handlers.current.onValueChange(next);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      event.preventDefault();
      event.stopPropagation();
      const plain = !event.ctrlKey && !event.metaKey && !event.altKey && !event.shiftKey;
      if (plain && (event.key === "Escape" || event.key === "Tab")) return finish();
      if (plain && (event.key === "Backspace" || event.key === "Delete")) return finish(null);
      const shortcut = shortcutFromEvent(event, { bare });
      if (shortcut) return finish(shortcut);
      const mods = [event.metaKey && "Meta", event.ctrlKey && "Ctrl", event.altKey && "Alt", event.shiftKey && "Shift"].filter(Boolean).join("+");
      setPreview(mods ? `${mods}+` : null);
    };
    document.addEventListener("keydown", onKeyDown, true);
    return () => {
      document.removeEventListener("keydown", onKeyDown, true);
      handlers.current.onRecordingChange?.(false);
    };
  }, [recording, bare]);

  const shown = recording ? preview : value;
  return (
    <button
      ref={ref}
      type="button"
      aria-pressed={recording}
      aria-label={recorderLabel(label, value, recording, recordingText)}
      className={shortcutRecorderClass({ className })}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) setRecording((r) => !r);
      }}
      onBlur={(event) => {
        onBlur?.(event);
        setRecording(false);
        setPreview(null);
      }}
      {...props}
    >
      {shown ? <Shortcut keys={shown} /> : <span className="ayy-shortcut-recorder__placeholder">{recording ? recordingText : placeholder}</span>}
    </button>
  );
});

/** A list of shortcuts: a <dl> of ShortcutListItem rows. */
export const ShortcutList = forwardRef<HTMLDListElement, HTMLAttributes<HTMLDListElement>>(function ShortcutList({ className, ...props }, ref) {
  return <dl ref={ref} className={cx("ayy-shortcut-list", className)} {...props} />;
});

export interface ShortcutListItemProps extends HTMLAttributes<HTMLDivElement> {
  /** What it does. */
  label: ReactNode;
  /** The shortcut ("Mod+K"), or your own content (typed text like "#tag") as children. */
  keys?: string;
}

/** One row: what it does, then the keys. */
export const ShortcutListItem = forwardRef<HTMLDivElement, ShortcutListItemProps>(function ShortcutListItem({ label, keys, className, children, ...props }, ref) {
  return (
    <div ref={ref} className={cx("ayy-shortcut-list__row", className)} {...props}>
      <dt>{label}</dt>
      <dd>{keys ? <Shortcut keys={keys} /> : children}</dd>
    </div>
  );
});
