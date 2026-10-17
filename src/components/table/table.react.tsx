import {
  forwardRef,
  type HTMLAttributes,
  type TableHTMLAttributes,
  type TdHTMLAttributes,
  type ThHTMLAttributes,
} from "react";
import { cx } from "../../lib/cx";
import {
  tableActionsClass,
  tableClass,
  tableNumClass,
  tableRowActionsClass,
  tableSelectClass,
  tableSortClass,
  tableWrapClass,
  type SortDirection,
} from "./table";

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

export interface TableHeaderProps extends HTMLAttributes<HTMLTableSectionElement> {
}

export const TableHeader = forwardRef<HTMLTableSectionElement, TableHeaderProps>(
  function TableHeader(props, ref) {
    return <thead ref={ref} {...props} />;
  },
);

export interface TableBodyProps extends HTMLAttributes<HTMLTableSectionElement> {
}

export const TableBody = forwardRef<HTMLTableSectionElement, TableBodyProps>(
  function TableBody(props, ref) {
    return <tbody ref={ref} {...props} />;
  },
);

export interface TableFooterProps extends HTMLAttributes<HTMLTableSectionElement> {
}

export const TableFooter = forwardRef<HTMLTableSectionElement, TableFooterProps>(
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

export interface TableCellProps extends TdHTMLAttributes<HTMLTableCellElement> {
  /** End-align with tabular digits. */
  numeric?: boolean;
  /** The narrow checkbox column for selecting rows. */
  select?: boolean;
  /** The narrow end-aligned column for row action buttons and overflow menus. */
  actions?: boolean;
}

export interface TableHeadProps extends ThHTMLAttributes<HTMLTableCellElement>, TableCellProps {
  /** Makes the header a sort button. "none" for a sortable column that isn't the sorted one. */
  sort?: SortDirection | "none";
  /** Called when the sort button is clicked; flip the direction with nextSortDirection() and sort your rows. */
  onSort?: () => void;
}

export const TableHead = forwardRef<HTMLTableCellElement, TableHeadProps>(function TableHead(
  { numeric, select, actions, sort, onSort, className, scope = "col", children, ...props },
  ref,
) {
  const sortable = sort !== undefined || onSort !== undefined;
  return (
    <th
      ref={ref}
      scope={scope}
      aria-sort={sort && sort !== "none" ? sort : undefined}
      className={cx(numeric && tableNumClass, select && tableSelectClass, actions && tableActionsClass, className) || undefined}
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

export const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>(
  function TableCell({ numeric, select, actions, className, ...props }, ref) {
    return (
      <td
        ref={ref}
        className={cx(numeric && tableNumClass, select && tableSelectClass, actions && tableActionsClass, className) || undefined}
        {...props}
      />
    );
  },
);

export interface TableRowActionsProps extends HTMLAttributes<HTMLDivElement> {
  /** Reveal quick actions on row hover, keyboard focus, or when selected (touch screens keep them visible). */
  reveal?: boolean;
}

export const TableRowActions = forwardRef<HTMLDivElement, TableRowActionsProps>(function TableRowActions(
  { reveal, className, ...props },
  ref,
) {
  return <div ref={ref} className={tableRowActionsClass({ reveal, className })} {...props} />;
});

export interface TableCaptionProps extends HTMLAttributes<HTMLTableCaptionElement> {
}

export const TableCaption = forwardRef<HTMLTableCaptionElement, TableCaptionProps>(
  function TableCaption(props, ref) {
    return <caption ref={ref} {...props} />;
  },
);
