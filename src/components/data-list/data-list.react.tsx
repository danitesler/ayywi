import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cx } from "../../lib/cx";
import { dataListClass, dataListItemClass, dataListLabelClass, dataListValueClass } from "./data-list";

export interface DataListProps extends HTMLAttributes<HTMLDListElement> {
  /** Items side by side, wrapping to fit. */
  row?: boolean;
}

export const DataList = forwardRef<HTMLDListElement, DataListProps>(function DataList({ row, className, ...props }, ref) {
  return <dl ref={ref} className={dataListClass({ row, className })} {...props} />;
});

export interface DataListItemProps extends HTMLAttributes<HTMLDivElement> {
  /** The term: "Role". The children are the value. */
  label: ReactNode;
}

export const DataListItem = forwardRef<HTMLDivElement, DataListItemProps>(function DataListItem(
  { label, className, children, ...props },
  ref,
) {
  return (
    <div ref={ref} className={cx(dataListItemClass, className)} {...props}>
      <dt className={dataListLabelClass}>{label}</dt>
      <dd className={dataListValueClass}>{children}</dd>
    </div>
  );
});
