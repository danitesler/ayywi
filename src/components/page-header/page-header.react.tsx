import { forwardRef, type HTMLAttributes } from "react";
import { cx } from "../../lib/cx";
import { pageHeaderActionsClass, pageHeaderClass, pageHeaderDescriptionClass, pageHeaderTitleClass } from "./page-header";

/** The top of an app screen: an optional Breadcrumb, a PageHeaderTitle, a PageHeaderDescription and PageHeaderActions. */
export const PageHeader = forwardRef<HTMLElement, HTMLAttributes<HTMLElement>>(function PageHeader({ className, ...props }, ref) {
  return <header ref={ref} className={cx(pageHeaderClass, className)} {...props} />;
});

/** The page's <h1>. */
export const PageHeaderTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(function PageHeaderTitle(
  { className, ...props },
  ref,
) {
  return <h1 ref={ref} className={cx(pageHeaderTitleClass, className)} {...props} />;
});

export const PageHeaderDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(function PageHeaderDescription(
  { className, ...props },
  ref,
) {
  return <p ref={ref} className={cx(pageHeaderDescriptionClass, className)} {...props} />;
});

/** The page's buttons: at most one primary, the rest outline or ghost. Below the title on phones. */
export const PageHeaderActions = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(function PageHeaderActions(
  { className, ...props },
  ref,
) {
  return <div ref={ref} className={cx(pageHeaderActionsClass, className)} {...props} />;
});
