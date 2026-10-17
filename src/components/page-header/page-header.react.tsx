import { forwardRef, type HTMLAttributes } from "react";
import { cx } from "../../lib/cx";
import { pageHeaderActionsClass, pageHeaderClass, pageHeaderDescriptionClass, pageHeaderTitleClass } from "./page-header";

export interface PageHeaderProps extends HTMLAttributes<HTMLElement> {}

/** The top of an app screen: an optional Breadcrumb, a PageHeaderTitle, a PageHeaderDescription and PageHeaderActions. */
export const PageHeader = forwardRef<HTMLElement, PageHeaderProps>(function PageHeader({ className, ...props }, ref) {
  return <header ref={ref} className={cx(pageHeaderClass, className)} {...props} />;
});

export interface PageHeaderTitleProps extends HTMLAttributes<HTMLHeadingElement> {}

/** The page's <h1>. */
export const PageHeaderTitle = forwardRef<HTMLHeadingElement, PageHeaderTitleProps>(function PageHeaderTitle(
  { className, ...props },
  ref,
) {
  return <h1 ref={ref} className={cx(pageHeaderTitleClass, className)} {...props} />;
});

export interface PageHeaderDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {}

export const PageHeaderDescription = forwardRef<HTMLParagraphElement, PageHeaderDescriptionProps>(function PageHeaderDescription(
  { className, ...props },
  ref,
) {
  return <p ref={ref} className={cx(pageHeaderDescriptionClass, className)} {...props} />;
});

export interface PageHeaderActionsProps extends HTMLAttributes<HTMLDivElement> {}

/** The page's buttons: at most one primary, the rest outline or ghost. Below the title on phones. */
export const PageHeaderActions = forwardRef<HTMLDivElement, PageHeaderActionsProps>(function PageHeaderActions(
  { className, ...props },
  ref,
) {
  return <div ref={ref} className={cx(pageHeaderActionsClass, className)} {...props} />;
});
