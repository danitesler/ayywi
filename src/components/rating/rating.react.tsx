import { forwardRef, useId, useState, type HTMLAttributes } from "react";
import { cx } from "../../lib/cx";
import { StarIcon } from "../../lib/icons";
import { Icon } from "../icon/icon.react";
import { ratingClass, ratingFillClass, ratingItemClass, ratingStarClass, type RatingSize } from "./rating";

export interface RatingProps extends Omit<HTMLAttributes<HTMLDivElement>, "defaultValue" | "onChange"> {
  /** Controlled rating value (0 to `max`). */
  value?: number;
  /** Initial rating value for uncontrolled usage (default 0). */
  defaultValue?: number;
  /** Called when the user selects or clears a star value. */
  onValueChange?: (value: number) => void;
  /** Maximum number of stars (default 5). */
  max?: number;
  /** Allow 0.5-star increments when interactive. */
  half?: boolean;
  /** Read-only score display (`role="img"`), supporting whole or half stars. */
  readOnly?: boolean;
  /** Allow clicking the currently selected star again to clear back to 0. */
  clearable?: boolean;
  size?: RatingSize;
  disabled?: boolean;
  /** Marks the group as invalid (`aria-invalid="true"`). */
  invalid?: boolean;
  /** Radio group name for form submission (defaults to a generated id). */
  name?: string;
  /** Accessible label for each interactive star option. Defaults to `"1 star"`, `"2 stars"`… */
  itemLabel?: (value: number, max: number) => string;
}

/** 1–5 star rating picker built on native radio inputs, or a read-only fractional star display. */
export const Rating = forwardRef<HTMLDivElement, RatingProps>(function Rating(
  {
    value,
    defaultValue = 0,
    onValueChange,
    max = 5,
    half = false,
    readOnly = false,
    clearable = false,
    size,
    disabled = false,
    invalid = false,
    name,
    itemLabel = (v) => (v === 1 ? "1 star" : `${v} stars`),
    className,
    "aria-label": ariaLabel,
    ...props
  },
  ref,
) {
  const autoName = useId();
  const groupName = name ?? autoName;
  const [uncontrolled, setUncontrolled] = useState(defaultValue);
  const current = value ?? uncontrolled;

  if (readOnly) {
    const rounded = Math.round(current * 2) / 2;
    const label = ariaLabel ?? `${rounded} out of ${max} stars`;
    return (
      <div ref={ref} role="img" aria-label={label} className={ratingClass({ size, readOnly: true, className })} {...props}>
        {Array.from({ length: max }, (_, index) => {
          const starNumber = index + 1;
          const isFull = rounded >= starNumber;
          const isHalf = !isFull && rounded >= starNumber - 0.5;
          return (
            <span key={starNumber} className={cx(ratingStarClass, isFull && "ayy-rating__star--full")} aria-hidden="true">
              <Icon icon={StarIcon} />
              {isHalf && (
                <span className={ratingFillClass}>
                  <Icon icon={StarIcon} />
                </span>
              )}
            </span>
          );
        })}
      </div>
    );
  }

  const steps = half
    ? Array.from({ length: max * 2 }, (_, i) => (i + 1) / 2)
    : Array.from({ length: max }, (_, i) => i + 1);

  const select = (next: number) => {
    if (value === undefined) setUncontrolled(next);
    onValueChange?.(next);
  };

  return (
    <div
      ref={ref}
      role="radiogroup"
      aria-label={ariaLabel}
      aria-invalid={invalid || undefined}
      data-clearable={clearable ? "" : undefined}
      className={ratingClass({ size, half, className })}
      {...props}
    >
      {steps.map((stepValue) => {
        const checked = current === stepValue;
        return (
          <label key={stepValue} className={ratingItemClass}>
            <input
              type="radio"
              name={groupName}
              value={stepValue}
              checked={checked}
              disabled={disabled}
              aria-label={itemLabel(stepValue, max)}
              onChange={() => select(stepValue)}
              onClick={(event) => {
                if (clearable && checked && event.detail > 0) {
                  select(0);
                }
              }}
            />
            <Icon icon={StarIcon} />
          </label>
        );
      })}
    </div>
  );
});
