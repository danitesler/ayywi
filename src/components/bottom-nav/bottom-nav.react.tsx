import { forwardRef, type AnchorHTMLAttributes, type ButtonHTMLAttributes, type HTMLAttributes, type ReactNode } from "react";
import { cx } from "../../lib/cx";
import {
  bottomNavClass,
  bottomNavLabelClass,
  bottomNavLinkClass,
  type BottomNavSize,
} from "./bottom-nav";

export type { BottomNavSize };

export interface BottomNavProps extends HTMLAttributes<HTMLElement> {
  /**
   * Sizing tier: `sm` (28px height, 16px icons), `md` (32px height, 20px icons), or `lg` (default, 40px height, 20px icons).
   */
  size?: BottomNavSize;
  /**
   * Compact mode: tighter padding, zero gap, and narrower pills so more tabs (5+) fit comfortably.
   */
  compact?: boolean;
  /**
   * Icon-only mode: visually hides the tab text while preserving it for screen readers.
   */
  iconOnly?: boolean;
}

/** A phone app's tab bar: top-level destinations pinned to the bottom of its scroll container. */
export const BottomNav = forwardRef<HTMLElement, BottomNavProps>(function BottomNav(
  { size = "lg", compact, iconOnly, className, "aria-label": label = "Main", ...props },
  ref,
) {
  return (
    <nav
      ref={ref}
      className={bottomNavClass({ size, compact, iconOnly, className })}
      aria-label={label}
      {...props}
    />
  );
});

export interface BottomNavLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /** The icon, above the label. */
  icon: ReactNode;
  /** The page this link points to is the one being shown (sets aria-current="page"). */
  current?: boolean;
}

export const BottomNavLink = forwardRef<HTMLAnchorElement, BottomNavLinkProps>(function BottomNavLink(
  { icon, current, className, children, ...props },
  ref,
) {
  return (
    <a ref={ref} className={cx(bottomNavLinkClass, className)} aria-current={current ? "page" : undefined} {...props}>
      {icon}
      <span className={bottomNavLabelClass}>{children}</span>
    </a>
  );
});

export interface BottomNavButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** The icon, above the label. */
  icon: ReactNode;
}

/** A tab that does something instead of going somewhere, e.g. "More" (add className="ayy-app-shell__toggle" to open the app shell's drawer). */
export const BottomNavButton = forwardRef<HTMLButtonElement, BottomNavButtonProps>(function BottomNavButton(
  { icon, className, children, ...props },
  ref,
) {
  return (
    <button ref={ref} type="button" className={cx(bottomNavLinkClass, className)} {...props}>
      {icon}
      <span className={bottomNavLabelClass}>{children}</span>
    </button>
  );
});
