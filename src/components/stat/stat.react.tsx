import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { statClass, statLabelClass, statUnitClass, statValueClass, type StatSize } from "./stat";

export interface StatProps extends HTMLAttributes<HTMLDivElement> {
  /** The number, already formatted: "200k", "4.2k", "87%". */
  value: ReactNode;
  /** Word after the number: "Downloads". */
  unit?: ReactNode;
  /** Short context: "Figma Community since 2019". */
  label?: ReactNode;
  /** Put the label above the number instead of below. */
  labelFirst?: boolean;
  size?: StatSize;
}

export const Stat = forwardRef<HTMLDivElement, StatProps>(function Stat(
  { value, unit, label, labelFirst, size, className, ...props },
  ref,
) {
  const labelEl = label ? <p className={statLabelClass}>{label}</p> : null;
  return (
    <div ref={ref} className={statClass({ size, className })} {...props}>
      {labelFirst ? labelEl : null}
      <p className={statValueClass}>
        {value}
        {unit ? <span className={statUnitClass}>{unit}</span> : null}
      </p>
      {labelFirst ? null : labelEl}
    </div>
  );
});
