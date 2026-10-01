import { forwardRef, type HTMLAttributes } from "react";
import { cx } from "../../lib/cx";
import { emptyStateActionsClass, emptyStateClass, emptyStateDescriptionClass, emptyStateTitleClass } from "./empty-state";

export interface EmptyStateProps extends HTMLAttributes<HTMLDivElement> {
  /** A dashed outline around the empty area. */
  bordered?: boolean;
  /** Less padding, for a card, a table or a side panel. */
  compact?: boolean;
}

/** What a list, table or page shows when there's nothing in it: an optional IconTile, a title, a description, actions. */
export const EmptyState = forwardRef<HTMLDivElement, EmptyStateProps>(function EmptyState({ bordered, compact, className, ...props }, ref) {
  return <div ref={ref} className={emptyStateClass({ bordered, compact, className })} {...props} />;
});

/** An <h2>. For another level, put className="ayy-empty-state__title" on your own heading. */
export const EmptyStateTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(function EmptyStateTitle(
  { className, ...props },
  ref,
) {
  return <h2 ref={ref} className={cx(emptyStateTitleClass, className)} {...props} />;
});

export const EmptyStateDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(function EmptyStateDescription(
  { className, ...props },
  ref,
) {
  return <p ref={ref} className={cx(emptyStateDescriptionClass, className)} {...props} />;
});

export const EmptyStateActions = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(function EmptyStateActions(
  { className, ...props },
  ref,
) {
  return <div ref={ref} className={cx(emptyStateActionsClass, className)} {...props} />;
});
