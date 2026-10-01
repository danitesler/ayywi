import { forwardRef, useRef, useState, type CSSProperties, type InputHTMLAttributes, type MouseEvent } from "react";
import { MinusSignIcon, PlusSignIcon } from "../../lib/icons";
import { mergeRefs } from "../../lib/refs";
import { Icon } from "../icon/icon.react";
import { numberFieldClass, numberFieldDecrementClass, numberFieldIncrementClass, numberFieldInputClass, type NumberFieldSize } from "./number-field";

export interface NumberFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "value" | "defaultValue" | "size" | "onChange"> {
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  size?: NumberFieldSize;
  /** Names of the buttons. Default "Decrease" / "Increase"; say what changes ("Remove a guest"). */
  decrementLabel?: string;
  incrementLabel?: string;
  /** On the outer .ayy-number-field; every other prop goes to the input. */
  className?: string;
  style?: CSSProperties;
}

/** A native number input between minus and plus buttons. Label the input (htmlFor its id, or aria-label). */
export const NumberField = forwardRef<HTMLInputElement, NumberFieldProps>(function NumberField(
  {
    value: controlled,
    defaultValue,
    onValueChange,
    min,
    max,
    step = 1,
    size,
    decrementLabel = "Decrease",
    incrementLabel = "Increase",
    className,
    style,
    disabled,
    ...props
  },
  ref,
) {
  const input = useRef<HTMLInputElement>(null);
  const [uncontrolled, setUncontrolled] = useState<number | undefined>(defaultValue);
  const value = controlled ?? uncontrolled;
  const set = (next: number) => {
    if (controlled === undefined) setUncontrolled(next);
    onValueChange?.(next);
  };
  const stepBy = (direction: 1 | -1) => (event: MouseEvent<HTMLButtonElement>) => {
    // ayywi/elements steps .ayy-number-field buttons too; this one is React's.
    event.preventDefault();
    const el = input.current;
    if (!el || event.currentTarget.getAttribute("aria-disabled") === "true") return;
    if (el.value === "") el.value = String(min ?? 0);
    else if (direction > 0) el.stepUp();
    else el.stepDown();
    set(el.valueAsNumber);
  };
  const atMin = min !== undefined && value !== undefined && value <= min;
  const atMax = max !== undefined && value !== undefined && value >= max;
  return (
    <div className={numberFieldClass({ size, className })} style={style}>
      <button
        type="button"
        className={numberFieldDecrementClass}
        aria-label={decrementLabel}
        aria-disabled={disabled || atMin}
        onClick={stepBy(-1)}
      >
        <Icon icon={MinusSignIcon} />
      </button>
      <input
        ref={mergeRefs(ref, input)}
        type="number"
        inputMode="numeric"
        className={numberFieldInputClass}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        value={value ?? ""}
        onChange={(event) => {
          const next = event.currentTarget.valueAsNumber;
          if (Number.isFinite(next)) set(next);
          else if (controlled === undefined) setUncontrolled(undefined);
        }}
        {...props}
      />
      <button
        type="button"
        className={numberFieldIncrementClass}
        aria-label={incrementLabel}
        aria-disabled={disabled || atMax}
        onClick={stepBy(1)}
      >
        <Icon icon={PlusSignIcon} />
      </button>
    </div>
  );
});
