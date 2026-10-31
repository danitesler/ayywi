import { cx } from "../../lib/cx";

export const emptyStateSizes = ["sm", "md", "lg"] as const;
export type EmptyStateSize = (typeof emptyStateSizes)[number];

export interface EmptyStateClassOptions {
  /** sm: the compact spacing with smaller text. lg: roomier, for a whole page. */
  size?: EmptyStateSize;
  /** A dashed outline around the empty area. */
  bordered?: boolean;
  /** Less padding, for a card, a table or a side panel. */
  compact?: boolean;
  className?: string;
}

export function emptyStateClass({ size = "md", bordered, compact, className }: EmptyStateClassOptions = {}): string {
  return cx("ayy-empty-state", size !== "md" && `ayy-empty-state--${size}`, bordered && "ayy-empty-state--bordered", compact && "ayy-empty-state--compact", className);
}

export const emptyStateTitleClass = "ayy-empty-state__title";
export const emptyStateDescriptionClass = "ayy-empty-state__description";
export const emptyStateActionsClass = "ayy-empty-state__actions";
