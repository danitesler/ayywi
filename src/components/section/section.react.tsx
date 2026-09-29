import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cx } from "../../lib/cx";
import {
  sectionClass,
  sectionDescriptionClass,
  sectionEyebrowClass,
  sectionHeaderClass,
  sectionNumberClass,
  sectionTitleClass,
} from "./section";

export interface SectionProps extends HTMLAttributes<HTMLElement> {
  /** Centre the header over the content (start-aligned again on phones). */
  center?: boolean;
}

export const Section = forwardRef<HTMLElement, SectionProps>(function Section({ center, className, ...props }, ref) {
  return <section ref={ref} className={sectionClass({ center, className })} {...props} />;
});

export const SectionHeader = forwardRef<HTMLElement, HTMLAttributes<HTMLElement>>(function SectionHeader(
  { className, ...props },
  ref,
) {
  return <header ref={ref} className={cx(sectionHeaderClass, className)} {...props} />;
});

export interface SectionEyebrowProps extends HTMLAttributes<HTMLParagraphElement> {
  /** Section number shown before the label, e.g. "01". */
  number?: ReactNode;
}

export const SectionEyebrow = forwardRef<HTMLParagraphElement, SectionEyebrowProps>(function SectionEyebrow(
  { number, className, children, ...props },
  ref,
) {
  return (
    <p ref={ref} className={cx(sectionEyebrowClass, className)} {...props}>
      {number !== undefined ? <span className={sectionNumberClass}>{number}</span> : null}
      {children}
    </p>
  );
});

export const SectionTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(function SectionTitle(
  { className, ...props },
  ref,
) {
  return <h2 ref={ref} className={cx(sectionTitleClass, className)} {...props} />;
});

export const SectionDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  function SectionDescription({ className, ...props }, ref) {
    return <p ref={ref} className={cx(sectionDescriptionClass, className)} {...props} />;
  },
);
