import { Fragment, forwardRef, type HTMLAttributes, type MouseEvent, type ReactNode } from "react";
import { cx } from "../../lib/cx";
import { ArrowLeft01Icon, ArrowRight01Icon } from "../../lib/icons";
import { Icon } from "../icon/icon.react";
import { paginationClass, paginationEllipsisClass, paginationLinkClass, paginationRange } from "./pagination";

export interface PaginationLabels {
  /** The nav's name. Default "Pagination". */
  nav?: string;
  /** Default "Previous". */
  previous?: string;
  /** Default "Next". */
  next?: string;
}

export interface PaginationProps extends Omit<HTMLAttributes<HTMLElement>, "onChange"> {
  /** The current page, 1-based. */
  page: number;
  /** How many pages there are. */
  count: number;
  /** Pages shown either side of the current one. Default 1. */
  siblings?: number;
  /** Where each page lives: pages render as <a href>. Use this when pages have URLs (?page=3). */
  href?: (page: number) => string;
  /** Called with the page to go to. Without href, pages render as <button>s. */
  onPageChange?: (page: number) => void;
  /** Visible and accessible text, for translation. */
  labels?: PaginationLabels;
}

/** Previous, numbered pages with "…" gaps, and next. On phones only previous, the current page and next show. */
export const Pagination = forwardRef<HTMLElement, PaginationProps>(function Pagination(
  { page, count, siblings = 1, href, onPageChange, labels, className, ...props },
  ref,
) {
  const text = { nav: "Pagination", previous: "Previous", next: "Next", ...labels };
  const item = (target: number, content: ReactNode, { step = false, rel }: { step?: boolean; rel?: "prev" | "next" } = {}) => {
    const current = !step && target === page;
    const disabled = target < 1 || target > count;
    const common = {
      className: paginationLinkClass({ step }),
      "aria-current": current ? ("page" as const) : undefined,
    };
    const onClick = (event: MouseEvent) => {
      if (disabled || current) return;
      if (onPageChange) {
        if (href) event.preventDefault();
        onPageChange(target);
      }
    };
    if (href) {
      return disabled ? (
        <a {...common} aria-disabled="true" role="link">
          {content}
        </a>
      ) : (
        <a {...common} href={href(target)} rel={rel} onClick={onClick}>
          {content}
        </a>
      );
    }
    return (
      <button {...common} type="button" disabled={disabled} onClick={onClick}>
        {content}
      </button>
    );
  };
  return (
    <nav ref={ref} className={cx(paginationClass, className)} aria-label={text.nav} {...props}>
      {item(page - 1, (
        <>
          <Icon icon={ArrowLeft01Icon} directional />
          {text.previous}
        </>
      ), { step: true, rel: "prev" })}
      {paginationRange(page, count, siblings).map((p, i) =>
        p === "…" ? (
          <span key={`gap-${i}`} className={paginationEllipsisClass} aria-hidden="true">
            …
          </span>
        ) : (
          <Fragment key={p}>{item(p, p)}</Fragment>
        ),
      )}
      {item(page + 1, (
        <>
          {text.next}
          <Icon icon={ArrowRight01Icon} directional />
        </>
      ), { step: true, rel: "next" })}
    </nav>
  );
});
