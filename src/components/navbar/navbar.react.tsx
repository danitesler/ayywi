import { forwardRef, useEffect, useRef, type AnchorHTMLAttributes, type ButtonHTMLAttributes, type HTMLAttributes } from "react";
import { cx } from "../../lib/cx";
import { Menu01Icon } from "../../lib/icons";
import { mergeRefs } from "../../lib/refs";
import { buttonClass } from "../button/button";
import { Icon } from "../icon/icon.react";
import {
  connectNavbar,
  navbarActionsClass,
  navbarBrandClass,
  navbarClass,
  navbarInnerClass,
  navbarLinkClass,
  navbarNavClass,
  navbarToggleClass,
} from "./navbar";

/** The sticky site header. Children go inside the centred inner row. With a NavbarToggle, the links fold into a menu on phones. */
export const Navbar = forwardRef<HTMLElement, HTMLAttributes<HTMLElement>>(function Navbar({ className, children, ...props }, ref) {
  const own = useRef<HTMLElement>(null);
  useEffect(() => (own.current ? connectNavbar(own.current) : undefined), []);
  return (
    <header ref={mergeRefs(own, ref)} className={cx(navbarClass, className)} {...props}>
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

/** The phone menu button (hidden from 48rem). Navbar manages aria-expanded; leave it uncontrolled. Put it last. */
export const NavbarToggle = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement>>(function NavbarToggle(
  { className, "aria-label": label = "Menu", children, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type="button"
      className={buttonClass({ variant: "ghost", size: "icon", className: cx(navbarToggleClass, className) })}
      aria-label={label}
      aria-expanded="false"
      {...props}
    >
      {children ?? <Icon icon={Menu01Icon} />}
    </button>
  );
});
