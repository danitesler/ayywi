import {
  createContext,
  forwardRef,
  useContext,
  useId,
  useState,
  type ChangeEvent,
  type HTMLAttributes,
  type InputHTMLAttributes,
  type LabelHTMLAttributes,
} from "react";
import { cx } from "../../lib/cx";
import { segmentedControlClass, segmentedControlOptionClass, type SegmentedControlSize } from "./segmented-control";

interface SegmentedContextValue {
  name: string;
  value: string | undefined;
  select: (value: string) => void;
}

const SegmentedContext = createContext<SegmentedContextValue | null>(null);

export interface SegmentedControlProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue"> {
  /** Shared radio name (for forms). Generated if omitted. */
  name?: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  size?: SegmentedControlSize;
  /** Fill the container with equal segments. */
  full?: boolean;
}

/** One choice out of two to five, as pill segments. A role="radiogroup" of native radios: give it an aria-label. */
export const SegmentedControl = forwardRef<HTMLDivElement, SegmentedControlProps>(function SegmentedControl(
  { name, value: controlled, defaultValue, onValueChange, size, full, className, children, ...props },
  ref,
) {
  const generated = useId();
  const [uncontrolled, setUncontrolled] = useState(defaultValue);
  const value = controlled ?? uncontrolled;
  const select = (next: string) => {
    if (controlled === undefined) setUncontrolled(next);
    onValueChange?.(next);
  };
  return (
    <SegmentedContext.Provider value={{ name: name ?? generated, value, select }}>
      <div ref={ref} role="radiogroup" className={segmentedControlClass({ size, full, className })} {...props}>
        {children}
      </div>
    </SegmentedContext.Provider>
  );
});

export interface SegmentedControlItemProps extends Omit<LabelHTMLAttributes<HTMLLabelElement>, "onChange"> {
  value: string;
  disabled?: boolean;
  /** Props for the native radio inside the label. */
  inputProps?: Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "value" | "name" | "checked">;
}

/** A segment: a <label> around a visually hidden native radio. Children are the text (and an optional Icon). */
export const SegmentedControlItem = forwardRef<HTMLLabelElement, SegmentedControlItemProps>(function SegmentedControlItem(
  { value, disabled, inputProps, className, children, ...props },
  ref,
) {
  const group = useContext(SegmentedContext);
  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    inputProps?.onChange?.(event);
    if (event.currentTarget.checked) group?.select(value);
  };
  return (
    <label ref={ref} className={cx(segmentedControlOptionClass, className)} {...props}>
      <input
        {...inputProps}
        type="radio"
        name={group?.name}
        value={value}
        checked={group ? group.value === value : undefined}
        disabled={disabled}
        onChange={onChange}
      />
      {children}
    </label>
  );
});
