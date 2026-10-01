import {
  forwardRef,
  type HTMLAttributes,
  type TableHTMLAttributes,
  type TdHTMLAttributes,
  type ThHTMLAttributes,
} from "react";
import { cx } from "../../lib/cx";
import { tableClass, tableNumClass, tableSelectClass, tableSortClass, tableWrapClass, type SortDirection } from "./table";

export interface TableProps extends TableHTMLAttributes<HTMLTableElement> {
  compact?: boolean;
}

/** Wrapped in a horizontally scrollable container so wide tables never break the layout. */
export const Table = forwardRef<HTMLTableElement, TableProps>(function Table({ compact, className, ...props }, ref) {
  return (
    <div className={tableWrapClass}>
      <table ref={ref} className={tableClass({ compact, className })} {...props} />
    </div>
  );
});

export const TableHeader = forwardRef<HTMLTableSectionElement, HTMLAttributes<HTMLTableSectionElement>>(
  function TableHeader(props, ref) {
    return <thead ref={ref} {...props} />;
  },
);

export const TableBody = forwardRef<HTMLTableSectionElement, HTMLAttributes<HTMLTableSectionElement>>(
  function TableBody(props, ref) {
    return <tbody ref={ref} {...props} />;
  },
);

export const TableFooter = forwardRef<HTMLTableSectionElement, HTMLAttributes<HTMLTableSectionElement>>(
  function TableFooter(props, ref) {
    return <tfoot ref={ref} {...props} />;
  },
);

export interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {
  /** A selected row (aria-selected="true"), e.g. when its checkbox is ticked. */
  selected?: boolean;
}

export const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(function TableRow({ selected, ...props }, ref) {
  return <tr ref={ref} aria-selected={selected} {...props} />;
});

export interface TableCellProps {
  /** End-align with tabular digits. */
  numeric?: boolean;
  /** The narrow checkbox column for selecting rows. */
  select?: boolean;
}

export interface TableHeadProps extends ThHTMLAttributes<HTMLTableCellElement>, TableCellProps {
  /** Makes the header a sort button. "none" for a sortable column that isn't the sorted one. */
  sort?: SortDirection | "none";
  /** Called when the sort button is clicked; flip the direction with nextSortDirection() and sort your rows. */
  onSort?: () => void;
}

export const TableHead = forwardRef<HTMLTableCellElement, TableHeadProps>(function TableHead(
  { numeric, select, sort, onSort, className, scope = "col", children, ...props },
  ref,
) {
  const sortable = sort !== undefined || onSort !== undefined;
  return (
    <th
      ref={ref}
      scope={scope}
      aria-sort={sort && sort !== "none" ? sort : undefined}
      className={cx(numeric && tableNumClass, select && tableSelectClass, className) || undefined}
      {...props}
    >
      {sortable ? (
        <button type="button" className={tableSortClass} onClick={onSort}>
          {children}
        </button>
      ) : (
        children
      )}
    </th>
  );
});

export const TableCell = forwardRef<HTMLTableCellElement, TdHTMLAttributes<HTMLTableCellElement> & TableCellProps>(
  function TableCell({ numeric, select, className, ...props }, ref) {
    return <td ref={ref} className={cx(numeric && tableNumClass, select && tableSelectClass, className) || undefined} {...props} />;
  },
);

export const TableCaption = forwardRef<HTMLTableCaptionElement, HTMLAttributes<HTMLTableCaptionElement>>(
  function TableCaption(props, ref) {
    return <caption ref={ref} {...props} />;
  },
);
