import { forwardRef, type OlHTMLAttributes, type ReactNode } from "react";
import { stepsClass, stepsItemClass, stepsLabelClass } from "./steps";

export interface StepsProps extends OlHTMLAttributes<HTMLOListElement> {
  /** The step names, in order. */
  steps: ReactNode[];
  /** Index of the step you're on (0-based). Steps before it are shown as done. */
  current: number;
  /** A column instead of a row. */
  vertical?: boolean;
  /** Read before a finished step's name. Default "Done: " (translate it). */
  doneLabel?: string;
}

/** Where you are in a short flow. Give it an aria-label ("Checkout progress"). */
export const Steps = forwardRef<HTMLOListElement, StepsProps>(function Steps(
  { steps, current, vertical, doneLabel = "Done: ", className, ...props },
  ref,
) {
  return (
    <ol ref={ref} className={stepsClass({ vertical, className })} {...props}>
      {steps.map((step, i) => (
        <li key={i} className={stepsItemClass} aria-current={i === current ? "step" : undefined}>
          <span className={stepsLabelClass}>
            {i < current ? <span className="ayy-sr-only">{doneLabel}</span> : null}
            {step}
          </span>
        </li>
      ))}
    </ol>
  );
});
