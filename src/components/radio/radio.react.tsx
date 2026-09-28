import {
  createContext,
  forwardRef,
  useContext,
  useId,
  useState,
  type ChangeEvent,
  type FieldsetHTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";
import { cx } from "../../lib/cx";
import { radioClass, radioGroupClass, radioGroupLegendClass } from "./radio";

interface RadioGroupContextValue {
  name: string;
  value: string | undefined;
  select: (value: string) => void;
}

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

export interface RadioGroupProps extends Omit<FieldsetHTMLAttributes<HTMLFieldSetElement>, "onChange" | "defaultValue"> {
  /** Visible group label, rendered as the <legend>. */
  label?: ReactNode;
  /** Shared input name. Generated if omitted. */
  name?: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  orientation?: "vertical" | "horizontal";
}

/** A <fieldset> of radios sharing one name and one value. */
export const RadioGroup = forwardRef<HTMLFieldSetElement, RadioGroupProps>(function RadioGroup(
  { label, name, value: controlled, defaultValue, onValueChange, orientation, className, children, ...props },
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
    <RadioGroupContext.Provider value={{ name: name ?? generated, value, select }}>
      <fieldset ref={ref} className={radioGroupClass({ orientation, className })} {...props}>
        {label ? <legend className={radioGroupLegendClass}>{label}</legend> : null}
        {children}
      </fieldset>
    </RadioGroupContext.Provider>
  );
});

export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "value"> {
  value: string;
}

/** A native radio. Inside a RadioGroup it takes its name and checked state from the group. */
export const Radio = forwardRef<HTMLInputElement, RadioProps>(function Radio({ value, className, onChange, ...props }, ref) {
  const group = useContext(RadioGroupContext);
  const groupProps = group
    ? {
        name: group.name,
        checked: group.value === value,
        onChange: (event: ChangeEvent<HTMLInputElement>) => {
          onChange?.(event);
          if (event.currentTarget.checked) group.select(value);
        },
      }
    : { onChange };
  return <input ref={ref} type="radio" value={value} className={cx(radioClass, className)} {...groupProps} {...props} />;
});
