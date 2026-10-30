import { forwardRef, type ButtonHTMLAttributes, type HTMLAttributes, type ReactNode } from "react";
import { cx } from "../../lib/cx";
import {
  filterBarActiveClass,
  filterBarClass,
  filterBarClearClass,
  filterBarGroupClass,
  filterBarMainClass,
  filterBarSummaryClass,
  filterBarTabClass,
  filterBarTabCountClass,
  filterBarTabsClass,
  filterBarTriggerBadgeClass,
  filterBarTriggerClass,
  type FilterBarSize,
} from "./filter-bar";

export interface FilterBarProps extends HTMLAttributes<HTMLDivElement> {
  sticky?: boolean;
  flush?: boolean;
  size?: FilterBarSize;
}

export const FilterBar = /* @__PURE__ */ forwardRef<HTMLDivElement, FilterBarProps>(function FilterBar(
  { sticky = false, flush = false, size = "md", className, children, ...props },
  ref,
) {
  return (
    <div ref={ref} className={filterBarClass({ sticky, flush, size, className })} {...props}>
      {children}
    </div>
  );
});

export interface FilterBarMainProps extends HTMLAttributes<HTMLDivElement> {}

export const FilterBarMain = /* @__PURE__ */ forwardRef<HTMLDivElement, FilterBarMainProps>(function FilterBarMain(
  { className, children, ...props },
  ref,
) {
  return (
    <div ref={ref} className={cx(filterBarMainClass, className)} {...props}>
      {children}
    </div>
  );
});

export interface FilterBarGroupProps extends HTMLAttributes<HTMLDivElement> {}

export const FilterBarGroup = /* @__PURE__ */ forwardRef<HTMLDivElement, FilterBarGroupProps>(function FilterBarGroup(
  { className, children, ...props },
  ref,
) {
  return (
    <div ref={ref} role="group" className={cx(filterBarGroupClass, className)} {...props}>
      {children}
    </div>
  );
});

export interface FilterBarTabsProps extends HTMLAttributes<HTMLDivElement> {
  label?: string;
}

export const FilterBarTabs = /* @__PURE__ */ forwardRef<HTMLDivElement, FilterBarTabsProps>(function FilterBarTabs(
  { label = "Filters", className, children, ...props },
  ref,
) {
  return (
    <div ref={ref} role="tablist" aria-label={label} className={cx(filterBarTabsClass, className)} {...props}>
      {children}
    </div>
  );
});

export interface FilterBarTabProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
  count?: ReactNode;
}

export const FilterBarTab = /* @__PURE__ */ forwardRef<HTMLButtonElement, FilterBarTabProps>(function FilterBarTab(
  { selected = false, count, type = "button", className, children, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      role="tab"
      aria-selected={selected}
      className={cx(filterBarTabClass, className)}
      {...props}
    >
      <span>{children}</span>
      {count !== undefined && <span className={filterBarTabCountClass}>{count}</span>}
    </button>
  );
});

export interface FilterBarTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  count?: ReactNode;
  open?: boolean;
  active?: boolean;
}

export const FilterBarTrigger = /* @__PURE__ */ forwardRef<HTMLButtonElement, FilterBarTriggerProps>(function FilterBarTrigger(
  { count, open = false, active = false, type = "button", className, children, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      aria-haspopup="dialog"
      aria-expanded={open}
      aria-pressed={active}
      className={cx(filterBarTriggerClass, className)}
      {...props}
    >
      {children}
      {count !== undefined && count !== 0 && <span className={filterBarTriggerBadgeClass}>{count}</span>}
    </button>
  );
});

export interface FilterBarActiveProps extends HTMLAttributes<HTMLDivElement> {}

export const FilterBarActive = /* @__PURE__ */ forwardRef<HTMLDivElement, FilterBarActiveProps>(function FilterBarActive(
  { className, children, ...props },
  ref,
) {
  return (
    <div ref={ref} className={cx(filterBarActiveClass, className)} {...props}>
      {children}
    </div>
  );
});

export interface FilterBarSummaryProps extends HTMLAttributes<HTMLSpanElement> {}

export const FilterBarSummary = /* @__PURE__ */ forwardRef<HTMLSpanElement, FilterBarSummaryProps>(function FilterBarSummary(
  { className, children, ...props },
  ref,
) {
  return (
    <span ref={ref} className={cx(filterBarSummaryClass, className)} {...props}>
      {children}
    </span>
  );
});

export interface FilterBarClearProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

export const FilterBarClear = /* @__PURE__ */ forwardRef<HTMLButtonElement, FilterBarClearProps>(function FilterBarClear(
  { type = "button", className, children = "Clear all", ...props },
  ref,
) {
  return (
    <button ref={ref} type={type} className={cx(filterBarClearClass, className)} {...props}>
      {children}
    </button>
  );
});
