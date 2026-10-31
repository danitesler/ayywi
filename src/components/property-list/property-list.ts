import { cx } from "../../lib/cx";

export const propertyListSizes = ["sm", "md", "lg"] as const;
export type PropertyListSize = (typeof propertyListSizes)[number];

export interface PropertyListClassOptions {
  /** sm: the compact spacing with smaller text. lg: more air, larger text, a wider term column. */
  size?: PropertyListSize;
  /** Tight rows with a shorter term column, for a dense summary. */
  compact?: boolean;
  className?: string;
}

export function propertyListClass({ size = "md", compact, className }: PropertyListClassOptions = {}): string {
  return cx("ayy-property-list", size !== "md" && `ayy-property-list--${size}`, compact && "ayy-property-list--compact", className);
}

export const propertyListRowClass = "ayy-property-list__row";
export const propertyListTermClass = "ayy-property-list__term";
export const propertyListLabelClass = "ayy-property-list__label";
export const propertyListIconClass = "ayy-property-list__icon";
export const propertyListValueClass = "ayy-property-list__value";
export const propertyListEmptyClass = "ayy-property-list__empty";
