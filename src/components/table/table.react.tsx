import {
  forwardRef,
  type HTMLAttributes,
  type TableHTMLAttributes,
  type TdHTMLAttributes,
  type ThHTMLAttributes,
} from "react";
import { cx } from "../../lib/cx";
import { tableClass, tableNumClass, tableWrapClass } from "./table";

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

export const TableRow = forwardRef<HTMLTableRowElement, HTMLAttributes<HTMLTableRowElement>>(function TableRow(props, ref) {
  return <tr ref={ref} {...props} />;
});

export interface TableCellProps {
  /** End-align with tabular digits. */
  numeric?: boolean;
}

export const TableHead = forwardRef<HTMLTableCellElement, ThHTMLAttributes<HTMLTableCellElement> & TableCellProps>(
  function TableHead({ numeric, className, scope = "col", ...props }, ref) {
    return <th ref={ref} scope={scope} className={cx(numeric && tableNumClass, className) || undefined} {...props} />;
  },
);

export const TableCell = forwardRef<HTMLTableCellElement, TdHTMLAttributes<HTMLTableCellElement> & TableCellProps>(
  function TableCell({ numeric, className, ...props }, ref) {
    return <td ref={ref} className={cx(numeric && tableNumClass, className) || undefined} {...props} />;
  },
);

export const TableCaption = forwardRef<HTMLTableCaptionElement, HTMLAttributes<HTMLTableCaptionElement>>(
  function TableCaption(props, ref) {
    return <caption ref={ref} {...props} />;
  },
);
