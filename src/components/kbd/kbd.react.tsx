import { forwardRef, type HTMLAttributes } from "react";
import { cx } from "../../lib/cx";
import { kbdClass } from "./kbd";

/** A key or a shortcut: <Kbd>⌘K</Kbd>. One <Kbd> per key when the keys are pressed together is fine too. */
export const Kbd = forwardRef<HTMLElement, HTMLAttributes<HTMLElement>>(function Kbd({ className, ...props }, ref) {
  return <kbd ref={ref} className={cx(kbdClass, className)} {...props} />;
});
