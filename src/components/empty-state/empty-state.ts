import { cx } from "../../lib/cx";

export interface EmptyStateClassOptions {
  /** A dashed outline around the empty area. */
  bordered?: boolean;
  /** Less padding, for a card, a table or a side panel. */
  compact?: boolean;
  className?: string;
}

export function emptyStateClass({ bordered, compact, className }: EmptyStateClassOptions = {}): string {
  return cx("ayy-empty-state", bordered && "ayy-empty-state--bordered", compact && "ayy-empty-state--compact", className);
}

export const emptyStateTitleClass = "ayy-empty-state__title";
export const emptyStateDescriptionClass = "ayy-empty-state__description";
export const emptyStateActionsClass = "ayy-empty-state__actions";
