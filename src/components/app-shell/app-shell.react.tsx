import { forwardRef, type AnchorHTMLAttributes, type HTMLAttributes } from "react";
import { cx } from "../../lib/cx";
import {
  appShellBrandClass,
  appShellClass,
  appShellFooterClass,
  appShellLinkClass,
  appShellMainClass,
  appShellNavClass,
  appShellSidebarClass,
} from "./app-shell";

/** The viewport-high frame: a sidebar and the main content, each scrolling on its own. */
export const AppShell = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(function AppShell({ className, ...props }, ref) {
  return <div ref={ref} className={cx(appShellClass, className)} {...props} />;
});

export const AppShellSidebar = forwardRef<HTMLElement, HTMLAttributes<HTMLElement>>(function AppShellSidebar(
  { className, ...props },
  ref,
) {
  return <aside ref={ref} className={cx(appShellSidebarClass, className)} {...props} />;
});

export const AppShellBrand = forwardRef<HTMLAnchorElement, AnchorHTMLAttributes<HTMLAnchorElement>>(function AppShellBrand(
  { className, ...props },
  ref,
) {
  return <a ref={ref} className={cx(appShellBrandClass, className)} {...props} />;
});

export const AppShellNav = forwardRef<HTMLElement, HTMLAttributes<HTMLElement>>(function AppShellNav(
  { className, "aria-label": label = "Main", ...props },
  ref,
) {
  return <nav ref={ref} className={cx(appShellNavClass, className)} aria-label={label} {...props} />;
});

export interface AppShellLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /** The page this link points to is the one being shown (sets aria-current="page"). */
  current?: boolean;
}

export const AppShellLink = forwardRef<HTMLAnchorElement, AppShellLinkProps>(function AppShellLink(
  { current, className, ...props },
  ref,
) {
  return <a ref={ref} className={cx(appShellLinkClass, className)} aria-current={current ? "page" : undefined} {...props} />;
});

export const AppShellFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(function AppShellFooter(
  { className, ...props },
  ref,
) {
  return <div ref={ref} className={cx(appShellFooterClass, className)} {...props} />;
});

export const AppShellMain = forwardRef<HTMLElement, HTMLAttributes<HTMLElement>>(function AppShellMain({ className, ...props }, ref) {
  return <main ref={ref} className={cx(appShellMainClass, className)} {...props} />;
});
