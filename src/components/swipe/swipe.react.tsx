import { forwardRef, useEffect, useRef, type ButtonHTMLAttributes, type HTMLAttributes, type ReactNode } from "react";
import { cx } from "../../lib/cx";
import { mergeRefs } from "../../lib/refs";
import { connectSwipe, swipeActionClass, type SwipeActionVariant, type SwipeSide } from "./swipe";

export interface SwipeProps extends HTMLAttributes<HTMLDivElement> {
  /** Buttons shown by swiping toward the inline end (right in English): Done, Pin. */
  startActions?: ReactNode;
  /** Buttons shown by swiping toward the inline start: Snooze, Delete. */
  endActions?: ReactNode;
  /** A tray opened or the row closed (null). */
  onOpenChange?: (side: SwipeSide | null) => void;
  /** Props for the sliding content box. */
  contentProps?: HTMLAttributes<HTMLDivElement>;
}

/** A row that slides sideways to show action buttons. Children are the row's content. */
export const Swipe = forwardRef<HTMLDivElement, SwipeProps>(function Swipe(
  { startActions, endActions, onOpenChange, contentProps, className, children, ...props },
  ref,
) {
  const row = useRef<HTMLDivElement>(null);
  const handler = useRef(onOpenChange);
  handler.current = onOpenChange;
  useEffect(() => {
    if (!row.current) return;
    const c = connectSwipe(row.current, { onOpenChange: (side) => handler.current?.(side) });
    return () => c.destroy();
  }, []);
  return (
    <div ref={mergeRefs(ref, row)} className={cx("ayy-swipe", className)} {...props}>
      <div {...contentProps} className={cx("ayy-swipe__content", contentProps?.className)}>
        {children}
      </div>
      {startActions && <div className="ayy-swipe__actions ayy-swipe__actions--start">{startActions}</div>}
      {endActions && <div className="ayy-swipe__actions ayy-swipe__actions--end">{endActions}</div>}
    </div>
  );
});

export interface SwipeActionProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: SwipeActionVariant;
  /** An Icon above the label. */
  icon?: ReactNode;
}

/** One button in a swipe tray: an icon over a short label. The row closes after it runs. */
export const SwipeAction = forwardRef<HTMLButtonElement, SwipeActionProps>(function SwipeAction(
  { variant, icon, type = "button", className, children, ...props },
  ref,
) {
  return (
    <button ref={ref} type={type} className={swipeActionClass({ variant, className })} {...props}>
      {icon}
      {children}
    </button>
  );
});
