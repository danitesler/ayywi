import { Fragment, forwardRef, useEffect, useReducer, useRef, useState, type HTMLAttributes } from "react";
import { mergeRefs } from "../../lib/refs";
import type { InputSize } from "../input/input";
import {
  connectPinInput,
  pinInputClass,
  pinInputGroupClass,
  pinInputSeparatorClass,
  pinInputSlotClass,
  type PinInputController,
  type PinInputType,
} from "./pin-input";

export interface PinInputProps extends Omit<HTMLAttributes<HTMLDivElement>, "defaultValue" | "onChange"> {
  /** Total number of character slots (ignored when `groups` is provided). Default 6. */
  length?: number;
  /** Split slots into visual groups separated by a dash, e.g. `[3, 3]` for a 6-digit code. */
  groups?: number[];
  /** Allowed characters: `"numeric"` (0–9) or `"alphanumeric"` (A–Z, 0–9). Default `"numeric"`. */
  type?: PinInputType;
  /** Hide entered characters as password dots. */
  mask?: boolean;
  size?: InputSize;
  /** Controlled code string. */
  value?: string;
  /** Initial code string for uncontrolled usage. */
  defaultValue?: string;
  /** Called whenever the code changes. */
  onValueChange?: (value: string) => void;
  /** Called once all slots are filled. */
  onComplete?: (value: string) => void;
  disabled?: boolean;
  /** Marks the group and slots as invalid (`aria-invalid="true"`). */
  invalid?: boolean;
  /** Form field name: renders a hidden input carrying the combined code. */
  name?: string;
  /** Focus the first slot on mount. */
  autoFocus?: boolean;
  /** Placeholder shown inside each empty slot (e.g. `"·"` or `"0"`). */
  placeholder?: string;
  /** Accessible label for each slot. Defaults to `"Digit N of M"` (or `"Character N of M"`). */
  slotLabel?: (index: number, total: number) => string;
}

/** Segmented PIN / OTP input for verification codes, 2FA tokens and passcodes. */
export const PinInput = forwardRef<HTMLDivElement, PinInputProps>(function PinInput(
  {
    length = 6,
    groups,
    type = "numeric",
    mask = false,
    size,
    value,
    defaultValue = "",
    onValueChange,
    onComplete,
    disabled = false,
    invalid = false,
    name,
    autoFocus = false,
    placeholder,
    slotLabel,
    id,
    className,
    ...props
  },
  ref,
) {
  const layout = groups?.length ? groups : [length];
  const total = layout.reduce((sum, count) => sum + count, 0);
  const [uncontrolled, setUncontrolled] = useState(defaultValue);
  const current = value ?? uncontrolled;
  const rootRef = useRef<HTMLDivElement>(null);
  const controllerRef = useRef<PinInputController | null>(null);
  const [, reconcile] = useReducer((n: number) => n + 1, 0);
  const callbacks = useRef({ value, onValueChange, onComplete });
  callbacks.current = { value, onValueChange, onComplete };

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const ctrl = connectPinInput(root, {
      type,
      onChange: (next) => {
        if (callbacks.current.value === undefined) setUncontrolled(next);
        callbacks.current.onValueChange?.(next);
        // The slots were edited in the DOM; render again so a parent that kept its value gets them put back.
        reconcile();
      },
      onComplete: (next) => callbacks.current.onComplete?.(next),
    });
    controllerRef.current = ctrl;
    return () => {
      ctrl.destroy();
      controllerRef.current = null;
    };
  }, [type, total]);

  // After every render, not only when the prop changes: a rejected edit leaves the prop as it was.
  useEffect(() => {
    if (value !== undefined && controllerRef.current && controllerRef.current.value() !== value) {
      controllerRef.current.setValue(value);
    }
  });

  const labelFor =
    slotLabel ?? ((index: number, count: number) => `${type === "alphanumeric" ? "Character" : "Digit"} ${index + 1} of ${count}`);

  const renderSlot = (index: number) => (
    <input
      key={index}
      id={index === 0 ? id : undefined}
      type={mask ? "password" : "text"}
      inputMode={type === "alphanumeric" ? "text" : "numeric"}
      autoComplete={index === 0 ? "one-time-code" : "off"}
      autoCapitalize="characters"
      spellCheck={false}
      maxLength={index === 0 ? total : 1}
      defaultValue={value === undefined ? (defaultValue[index] ?? "") : undefined}
      value={value !== undefined ? (value[index] ?? "") : undefined}
      onChange={value !== undefined ? () => {} : undefined}
      placeholder={placeholder}
      disabled={disabled}
      aria-invalid={invalid || undefined}
      aria-label={labelFor(index, total)}
      autoFocus={autoFocus && index === 0}
      className={pinInputSlotClass}
    />
  );

  let offset = 0;

  return (
    <div
      ref={mergeRefs(ref, rootRef)}
      role="group"
      aria-invalid={invalid || undefined}
      className={pinInputClass({ size, className })}
      {...props}
    >
      {layout.length === 1
        ? Array.from({ length: total }, (_, i) => renderSlot(i))
        : layout.map((count, groupIndex) => {
            const start = offset;
            offset += count;
            return (
              <Fragment key={groupIndex}>
                {groupIndex > 0 && (
                  <span className={pinInputSeparatorClass} aria-hidden="true">
                    –
                  </span>
                )}
                <div className={pinInputGroupClass}>{Array.from({ length: count }, (_, i) => renderSlot(start + i))}</div>
              </Fragment>
            );
          })}
      {name && <input type="hidden" name={name} value={current} disabled={disabled} />}
    </div>
  );
});
