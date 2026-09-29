import { forwardRef, type AnchorHTMLAttributes, type HTMLAttributes } from "react";
import { cx } from "../../lib/cx";
import { navbarActionsClass, navbarBrandClass, navbarClass, navbarInnerClass, navbarLinkClass, navbarNavClass } from "./navbar";

/** The sticky site header. Children go inside the centred inner row. */
export const Navbar = forwardRef<HTMLElement, HTMLAttributes<HTMLElement>>(function Navbar({ className, children, ...props }, ref) {
  return (
    <header ref={ref} className={cx(navbarClass, className)} {...props}>
      <div className={navbarInnerClass}>{children}</div>
    </header>
  );
});

export const NavbarBrand = forwardRef<HTMLAnchorElement, AnchorHTMLAttributes<HTMLAnchorElement>>(function NavbarBrand(
  { className, ...props },
  ref,
) {
  return <a ref={ref} className={cx(navbarBrandClass, className)} {...props} />;
});

export const NavbarNav = forwardRef<HTMLElement, HTMLAttributes<HTMLElement>>(function NavbarNav(
  { className, "aria-label": label = "Main", ...props },
  ref,
) {
  return <nav ref={ref} className={cx(navbarNavClass, className)} aria-label={label} {...props} />;
});

export interface NavbarLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /** The page this link points to is the one being shown (sets aria-current="page"). */
  current?: boolean;
}

export const NavbarLink = forwardRef<HTMLAnchorElement, NavbarLinkProps>(function NavbarLink(
  { current, className, ...props },
  ref,
) {
  return <a ref={ref} className={cx(navbarLinkClass, className)} aria-current={current ? "page" : undefined} {...props} />;
});

export const NavbarActions = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(function NavbarActions(
  { className, ...props },
  ref,
) {
  return <div ref={ref} className={cx(navbarActionsClass, className)} {...props} />;
});
