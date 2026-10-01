import { cx } from "../../lib/cx";

export interface ListClassOptions {
  /** Hairlines between flush rows (settings, records in a card) instead of rounded rows. */
  divided?: boolean;
  /** Tight rows without padding, for an icon checklist. */
  compact?: boolean;
  className?: string;
}

export function listClass({ divided, compact, className }: ListClassOptions = {}): string {
  return cx("ayy-list", divided && "ayy-list--divided", compact && "ayy-list--compact", className);
}

export const listItemClass = "ayy-list__item";
export const listContentClass = "ayy-list__content";
export const listTitleClass = "ayy-list__title";
export const listDescriptionClass = "ayy-list__description";
export const listMetaClass = "ayy-list__meta";
export const listLinkClass = "ayy-list__link";
