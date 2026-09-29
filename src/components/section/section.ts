import { cx } from "../../lib/cx";

export interface SectionClassOptions {
  /** Centre the header over the content (start-aligned again on phones). */
  center?: boolean;
  className?: string;
}

export function sectionClass({ center, className }: SectionClassOptions = {}): string {
  return cx("ayy-section", center && "ayy-section--center", className);
}

export const sectionHeaderClass = "ayy-section__header";
export const sectionEyebrowClass = "ayy-section__eyebrow";
export const sectionNumberClass = "ayy-section__number";
export const sectionTitleClass = "ayy-section__title";
export const sectionDescriptionClass = "ayy-section__description";
