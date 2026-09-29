import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { breadcrumbClass, breadcrumbItemClass, breadcrumbLinkClass, breadcrumbListClass } from "./breadcrumb";

export interface BreadcrumbItem {
  label: ReactNode;
  /** Leave off for the current page (the last item). */
  href?: string;
}

export interface BreadcrumbProps extends HTMLAttributes<HTMLElement> {
  /** Trail from the top level down to this page. The last item is the current page. */
  items: BreadcrumbItem[];
  pill?: boolean;
}

export const Breadcrumb = forwardRef<HTMLElement, BreadcrumbProps>(function Breadcrumb(
  { items, pill, className, "aria-label": label = "Breadcrumb", ...props },
  ref,
) {
  return (
    <nav ref={ref} className={breadcrumbClass({ pill, className })} aria-label={label} {...props}>
      <ol className={breadcrumbListClass}>
        {items.map((item, i) => (
          <li key={i} className={breadcrumbItemClass}>
            {i === items.length - 1 ? (
              <span aria-current="page">{item.label}</span>
            ) : (
              <a className={breadcrumbLinkClass} href={item.href}>
                {item.label}
              </a>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
});
