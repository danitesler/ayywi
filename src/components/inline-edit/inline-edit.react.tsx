import {
  forwardRef,
  useLayoutEffect,
  useRef,
  useState,
  type ChangeEvent,
  type InputHTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
  type TextareaHTMLAttributes,
} from "react";
import { commitsOnEnter, growInlineEdit, inlineEditClass, isComposingEvent, type InlineEditVariant } from "./inline-edit";

type FieldElement = HTMLInputElement | HTMLTextAreaElement;

export interface InlineEditProps {
  /** The raw value ("2026-10-24", "Q4 launch"). Controlled when set. */
  value?: string;
  /** Starting value when uncontrolled. Default "". */
  defaultValue?: string;
  /** Called with the value after a commit, only when it changed. */
  onValueChange?: (value: string) => void;
  /** Accessible name of the display button and of the field: "Rename the project". */
  label: string;
  /** What the display shows at rest, when it isn't the value itself (a formatted date, a price). */
  displayValue?: ReactNode;
  /** Shown when there is no value and in the empty field. */
  placeholder?: string;
  /** Edit in a <textarea> that grows with its content. Default false. */
  multiline?: boolean;
  /** Title: heading font and size. Text (default): keeps the surrounding type. */
  variant?: InlineEditVariant;
  disabled?: boolean;
  /** Edit mode. Controlled when set. */
  editing?: boolean;
  /** Start in edit mode when uncontrolled. Default false. */
  defaultEditing?: boolean;
  /** Called when edit mode starts (true) and ends (false), however it ends. */
  onEditingChange?: (editing: boolean) => void;
  /** Called when Esc throws the draft away. */
  onCancel?: () => void;
  /** Trim the value on commit. Default true. */
  trim?: boolean;
  /** Props for the single-line <input>. */
  inputProps?: Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "defaultValue" | "onChange" | "className" | "hidden" | "ref">;
  /** Props for the multiline <textarea>. */
  textareaProps?: Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "value" | "defaultValue" | "onChange" | "className" | "hidden" | "ref">;
  /** Class on the root, never the field. */
  className?: string;
}

/** A value that becomes an input in place. Enter saves, Esc cancels, blur saves; a multiline field saves on Mod+Enter. */
export const InlineEdit = /* @__PURE__ */ forwardRef<HTMLDivElement, InlineEditProps>(function InlineEdit(
  {
    value,
    defaultValue = "",
    onValueChange,
    label,
    displayValue,
    placeholder,
    multiline = false,
    variant = "text",
    disabled = false,
    editing,
    defaultEditing = false,
    onEditingChange,
    onCancel,
    trim = true,
    inputProps,
    textareaProps,
    className,
  },
  ref,
) {
  const [localValue, setLocalValue] = useState(defaultValue);
  const [localEditing, setLocalEditing] = useState(defaultEditing);
  // null until the user types: the field shows `current` for a session that starts without start() (defaultEditing, a
  // controlled editing prop), so it never opens empty.
  const [draft, setDraft] = useState<string | null>(null);
  const field = useRef<FieldElement | null>(null);
  const display = useRef<HTMLButtonElement>(null);
  const refocusDisplay = useRef(false);

  const current = value !== undefined ? value : localValue;
  const editingNow = editing !== undefined ? editing : localEditing;

  // Focusing a hidden field does nothing, so this waits for the swap, then puts the caret where the user expects it.
  useLayoutEffect(() => {
    // A session that didn't start through start() (defaultEditing, a controlled editing prop) seeds itself from current.
    setDraft(null);
    if (!editingNow) {
      if (refocusDisplay.current) {
        refocusDisplay.current = false;
        display.current?.focus();
      }
      return;
    }
    const el = field.current;
    if (!el) return;
    el.focus();
    if (el instanceof HTMLTextAreaElement) {
      growInlineEdit(el);
      el.setSelectionRange(el.value.length, el.value.length);
    } else {
      el.select();
    }
  }, [editingNow]);

  const start = () => {
    if (disabled || editingNow) return;
    setDraft(null);
    if (editing === undefined) setLocalEditing(true);
    onEditingChange?.(true);
  };

  const finish = (next: string | null, focusDisplay: boolean) => {
    if (next === null) {
      onCancel?.();
    } else {
      const trimmed = trim ? next.trim() : next;
      if (trimmed !== current) {
        if (value === undefined) setLocalValue(trimmed);
        onValueChange?.(trimmed);
      }
    }
    if (editing === undefined) setLocalEditing(false);
    refocusDisplay.current = focusDisplay;
    onEditingChange?.(false);
  };

  const onFieldKeyDown = (event: KeyboardEvent<FieldElement>) => {
    if (isComposingEvent(event.nativeEvent)) return;
    if (event.key === "Escape") {
      event.preventDefault();
      finish(null, true);
      return;
    }
    if (!commitsOnEnter(event, multiline)) return;
    event.preventDefault();
    finish(event.currentTarget.value, true);
  };

  const onFieldChange = (event: ChangeEvent<FieldElement>) => {
    setDraft(event.currentTarget.value);
    if (event.currentTarget instanceof HTMLTextAreaElement) growInlineEdit(event.currentTarget);
  };

  // Blur saves without pulling focus back, so Tab moves on. Closing the field also blurs it: ignore that one.
  const onFieldBlur = () => {
    if (!editingNow) return;
    finish(field.current?.value ?? draft ?? current, false);
  };

  const setField = (el: FieldElement | null) => {
    field.current = el;
  };

  const text = displayValue !== undefined ? displayValue : current;

  return (
    <div ref={ref} className={inlineEditClass({ variant, className })} data-value={current}>
      <button
        ref={display}
        type="button"
        className="ayy-inline-edit__display"
        aria-label={label}
        disabled={disabled}
        hidden={editingNow}
        onClick={start}
      >
        <span className="ayy-inline-edit__text" data-placeholder={placeholder}>
          {text}
        </span>
      </button>
      {multiline ? (
        <textarea
          {...textareaProps}
          ref={setField}
          className="ayy-textarea ayy-inline-edit__input"
          rows={textareaProps?.rows ?? 1}
          value={editingNow ? (draft ?? current) : current}
          hidden={!editingNow}
          aria-label={label}
          placeholder={placeholder}
          disabled={disabled}
          onChange={onFieldChange}
          onKeyDown={(event) => {
            textareaProps?.onKeyDown?.(event);
            if (!event.defaultPrevented) onFieldKeyDown(event);
          }}
          onBlur={(event) => {
            textareaProps?.onBlur?.(event);
            onFieldBlur();
          }}
        />
      ) : (
        <input
          {...inputProps}
          ref={setField}
          className="ayy-input ayy-inline-edit__input"
          value={editingNow ? (draft ?? current) : current}
          hidden={!editingNow}
          aria-label={label}
          placeholder={placeholder}
          disabled={disabled}
          onChange={onFieldChange}
          onKeyDown={(event) => {
            inputProps?.onKeyDown?.(event);
            if (!event.defaultPrevented) onFieldKeyDown(event);
          }}
          onBlur={(event) => {
            inputProps?.onBlur?.(event);
            onFieldBlur();
          }}
        />
      )}
    </div>
  );
});
