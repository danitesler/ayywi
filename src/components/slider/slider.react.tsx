import { forwardRef, useState, type CSSProperties, type HTMLAttributes, type InputHTMLAttributes } from "react";
import { cx } from "../../lib/cx";
import { sliderClass, sliderPercent, sliderRangeClass, sliderSizeClass, type SliderSize } from "./slider";

type NativeRange = Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "value" | "defaultValue" | "min" | "max" | "step" | "onChange" | "size">;

const percent = (value: number, min: number, max: number) => sliderPercent({ value: String(value), min: String(min), max: String(max) });

export interface SliderProps extends NativeRange {
  /** Track and thumb size. (The native `size` attribute does nothing on a range input.) */
  size?: SliderSize;
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
}

/** A native range input with the track filled up to the thumb. Label it with a <Label htmlFor> or aria-label. */
export const Slider = /* @__PURE__ */ forwardRef<HTMLInputElement, SliderProps>(function Slider(
  { size, value: controlled, defaultValue, onValueChange, min = 0, max = 100, step = 1, className, style, ...props },
  ref,
) {
  const [uncontrolled, setUncontrolled] = useState(defaultValue ?? min);
  const value = controlled ?? uncontrolled;
  return (
    <input
      ref={ref}
      type="range"
      className={cx(sliderClass, sliderSizeClass(size), className)}
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(event) => {
        const next = event.currentTarget.valueAsNumber;
        if (controlled === undefined) setUncontrolled(next);
        onValueChange?.(next);
      }}
      style={{ "--ayy-value": percent(value, min, max), ...style } as CSSProperties}
      {...props}
    />
  );
});

export interface SliderRangeProps extends Omit<HTMLAttributes<HTMLDivElement>, "defaultValue" | "onChange"> {
  value?: [number, number];
  defaultValue?: [number, number];
  onValueChange?: (value: [number, number]) => void;
  min?: number;
  max?: number;
  step?: number;
  /** Accessible names of the two thumbs, e.g. ["Minimum price", "Maximum price"]. */
  labels: [string, string];
  /** Form names of the two inputs. */
  names?: [string, string];
  disabled?: boolean;
  /** Track and thumb size. */
  size?: SliderSize;
}

/** Two thumbs on one track, for a min and a max (a price range): role="group", name it with aria-labelledby. The thumbs can't cross. */
export const SliderRange = /* @__PURE__ */ forwardRef<HTMLDivElement, SliderRangeProps>(function SliderRange(
  { size, value: controlled, defaultValue, onValueChange, min = 0, max = 100, step = 1, labels, names, disabled, className, style, ...props },
  ref,
) {
  const [uncontrolled, setUncontrolled] = useState<[number, number]>(defaultValue ?? [min, max]);
  const [low, high] = controlled ?? uncontrolled;
  const update = (next: [number, number]) => {
    if (controlled === undefined) setUncontrolled(next);
    onValueChange?.(next);
  };
  return (
    <div
      ref={ref}
      role="group"
      className={cx(sliderRangeClass, sliderSizeClass(size, true), className)}
      style={{ "--ayy-from": percent(low, min, max), "--ayy-to": percent(high, min, max), ...style } as CSSProperties}
      {...props}
    >
      <input
        type="range"
        className={sliderClass}
        aria-label={labels[0]}
        name={names?.[0]}
        min={min}
        max={max}
        step={step}
        value={low}
        disabled={disabled}
        style={low >= high || low >= max ? { zIndex: 1 } : undefined}
        onChange={(event) => update([Math.min(event.currentTarget.valueAsNumber, high), high])}
      />
      <input
        type="range"
        className={sliderClass}
        aria-label={labels[1]}
        name={names?.[1]}
        min={min}
        max={max}
        step={step}
        value={high}
        disabled={disabled}
        onChange={(event) => update([low, Math.max(event.currentTarget.valueAsNumber, low)])}
      />
    </div>
  );
});
