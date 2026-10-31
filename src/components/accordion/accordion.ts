export const accordionClass = "ayy-accordion";
export const accordionItemClass = "ayy-accordion__item";
export const accordionTriggerClass = "ayy-accordion__trigger";
export const accordionContentClass = "ayy-accordion__content";

export const accordionSizes = ["sm", "md", "lg"] as const;
export type AccordionSize = (typeof accordionSizes)[number];

/** Add next to accordionClass on the root: `cx(accordionClass, accordionSizeClass("sm"))`. md is the default and adds nothing. */
export function accordionSizeClass(size?: AccordionSize): string | undefined {
  return size && size !== "md" ? `ayy-accordion--${size}` : undefined;
}
