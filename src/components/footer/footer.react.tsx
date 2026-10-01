import { forwardRef, useId, type AnchorHTMLAttributes, type HTMLAttributes, type ReactNode } from "react";
import { cx } from "../../lib/cx";
import {
  footerBottomClass,
  footerBrandClass,
  footerClass,
  footerGroupClass,
  footerHeadingClass,
  footerInnerClass,
  footerLinkClass,
  footerListClass,
  footerNavClass,
} from "./footer";

/** The site footer. Children go inside the centred inner grid: FooterBrand, FooterNav, FooterBottom. */
export const Footer = forwardRef<HTMLElement, HTMLAttributes<HTMLElement>>(function Footer({ className, children, ...props }, ref) {
  return (
    <footer ref={ref} className={cx(footerClass, className)} {...props}>
      <div className={footerInnerClass}>{children}</div>
    </footer>
  );
});

/** The brand link and a line about the product. */
export const FooterBrand = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(function FooterBrand({ className, ...props }, ref) {
  return <div ref={ref} className={cx(footerBrandClass, className)} {...props} />;
});

export const FooterNav = forwardRef<HTMLElement, HTMLAttributes<HTMLElement>>(function FooterNav(
  { className, "aria-label": label = "Footer", ...props },
  ref,
) {
  return <nav ref={ref} className={cx(footerNavClass, className)} aria-label={label} {...props} />;
});

export interface FooterGroupProps extends HTMLAttributes<HTMLDivElement> {
  /** The column heading. Names the list. */
  label: ReactNode;
}

/** A column of links under a heading. Children are FooterLink. */
export const FooterGroup = forwardRef<HTMLDivElement, FooterGroupProps>(function FooterGroup({ label, className, children, ...props }, ref) {
  const id = useId();
  return (
    <div ref={ref} className={cx(footerGroupClass, className)} {...props}>
      <p className={footerHeadingClass} id={id}>
        {label}
      </p>
      <ul className={footerListClass} aria-labelledby={id}>
        {children}
      </ul>
    </div>
  );
});

/** A link in a FooterGroup (renders its own <li>). */
export const FooterLink = forwardRef<HTMLAnchorElement, AnchorHTMLAttributes<HTMLAnchorElement>>(function FooterLink({ className, ...props }, ref) {
  return (
    <li>
      <a ref={ref} className={cx(footerLinkClass, className)} {...props} />
    </li>
  );
});

/** The last row: copyright, legal links, maybe a theme toggle. */
export const FooterBottom = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(function FooterBottom({ className, ...props }, ref) {
  return <div ref={ref} className={cx(footerBottomClass, className)} {...props} />;
});
