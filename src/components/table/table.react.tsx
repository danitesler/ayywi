import {
  forwardRef,
  useEffect,
  useRef,
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
  type TableHTMLAttributes,
  type TdHTMLAttributes,
  type ThHTMLAttributes,
} from "react";
import { cx } from "../../lib/cx";
import { mergeRefs } from "../../lib/refs";
import { InlineEdit } from "../inline-edit/inline-edit.react";
import {
  connectTableColumnReorder,
  connectTableRowReorder,
  connectTableColumns,
  connectTableDragSelect,
  connectTableEdit,
  connectTableResize,
  tableActionsClass,
  tableClass,
  tableContainerClass,
  tableColumnHeaderClass,
  tableColumnLabelClass,
  tableColumnIconClass,
  tableCellWrapClass,
  tableDescriptionClass,
  tableDetailClass,
  tableDraggableClass,
  tableReorderClass,
  tableEditClass,
  tableEmptyClass,
  tableExpandClass,
  tableGroupClass,
  tableHeadingClass,
  tableMediaClass,
  tableNumClass,
  tablePagerClass,
  tablePinClassName,
  tableResizeClass,
  tableRowActionsClass,
  tableRowLinkClass,
  tableSecondaryClass,
  tableSelectClass,
  tableSortClass,
  tableTitleClass,
  tableToolbarClass,
  tableToolsClass,
  tableTruncateClass,
  tableWrapClass,
  type SortDirection,
  type TableCellEditDetail,
  type TableColumnReorderDetail,
  type TableRowReorderDetail,
  type TableColumnActionDetail,
  type TablePin,
  type TableResizeDetail,
} from "./table";

export interface TableProps extends TableHTMLAttributes<HTMLTableElement> {
  /** Return false to handle a column menu action in React state. */
  onColumnAction?: (detail: TableColumnActionDetail) => boolean | void;
  /** Tighter rows. */
  compact?: boolean;
  /** Roomier rows and columns. */
  spacious?: boolean;
  /** Lines between the columns too. */
  bordered?: boolean;
  /** The header (and footer) row stays in view while the table scrolls: give its TableContainer a max-block-size. */
  sticky?: boolean;
  /** table-layout: fixed — columns take their header cells' widths, not their content's. */
  fixed?: boolean;
  /** Draggable header cells that reorder columns on drop. */
  reorderable?: boolean;
  /** Called when a TableHead resizable handle finishes a drag or key press. */
  onColumnResize?: (detail: TableResizeDetail) => void;
  /** Called when a TableEdit input commits a new value (on Enter or blur). */
  onCellEdit?: (detail: TableCellEditDetail) => void;
  /** Called when a row is dropped (or moved by key) from its DragHandle. React doesn't move rows itself: reorder your data here and return false. */
  onRowReorder?: (detail: TableRowReorderDetail) => boolean | void;
  /** Called when a column header is dragged to reorder columns. Return false to handle reordering in React state. */
  onColumnReorder?: (detail: TableColumnReorderDetail) => boolean | void;
  /** Props for the scrolling .ayy-table-wrap: a max-block-size there scrolls a sticky table without a TableContainer. */
  wrapperProps?: HTMLAttributes<HTMLDivElement>;
}

/** Wrapped in a horizontally scrollable container so wide tables never break the layout. */
export const Table = /* @__PURE__ */ forwardRef<HTMLTableElement, TableProps>(function Table(
  { compact, spacious, bordered, sticky, fixed, reorderable, onColumnResize, onCellEdit, onColumnReorder, onRowReorder, onColumnAction, wrapperProps, className, ...props },
  ref,
) {
  const own = useRef<HTMLTableElement>(null);
  const onResize = useRef(onColumnResize);
  onResize.current = onColumnResize;
  const onEdit = useRef(onCellEdit);
  onEdit.current = onCellEdit;
  const onReorder = useRef(onColumnReorder);
  onReorder.current = onColumnReorder;
  const onRows = useRef(onRowReorder);
  onRows.current = onRowReorder;
  const onAction = useRef(onColumnAction);
  onAction.current = onColumnAction;
  useEffect(() => {
    const table = own.current;
    if (!table) return;
    const resize = connectTableResize(table, { onResize: (detail) => onResize.current?.(detail) });
    const dragSelect = connectTableDragSelect(table, {
      onRowChange: (_row, box, checked) => {
        if (box.checked !== checked) box.click();
      },
    });
    const edit = connectTableEdit(table, { onCellEdit: (detail) => onEdit.current?.(detail) });
    const columnReorder = connectTableColumnReorder(table, { onColumnReorder: (detail) => onReorder.current?.(detail) });
    const rowReorder = connectTableRowReorder(table, { onRowReorder: (detail) => onRows.current?.(detail) });
    const columns = connectTableColumns(table, { onColumnAction: (detail) => onAction.current?.(detail) });
    const onClick = (event: MouseEvent) => {
      const target = event.target as Element | null;
      const selectCell = target?.closest<HTMLElement>(`.${tableSelectClass}`);
      if (selectCell && table.contains(selectCell) && !target?.closest('input[type="checkbox"], label')) {
        const box = selectCell.querySelector<HTMLInputElement>('input[type="checkbox"]');
        if (box && !box.disabled && !dragSelect.wasDragged()) box.click();
      }
    };
    table.addEventListener("click", onClick);
    return () => {
      resize.destroy();
      dragSelect.destroy();
      edit.destroy();
      columnReorder.destroy();
      rowReorder.destroy();
      columns.destroy();
      table.removeEventListener("click", onClick);
    };
  }, []);
  return (
    <div {...wrapperProps} className={cx(tableWrapClass, wrapperProps?.className)}>
      <table
        ref={mergeRefs(own, ref)}
        data-reorderable={reorderable ? "" : undefined}
        className={tableClass({ compact, spacious, bordered, sticky, fixed, reorderable, className })}
        {...props}
      />
    </div>
  );
});

export interface TableContainerProps extends HTMLAttributes<HTMLDivElement> {}

/** A framed table: TableToolbar, Table, TablePager. Give it a max-block-size to scroll a sticky table inside it. */
export const TableContainer = /* @__PURE__ */ forwardRef<HTMLDivElement, TableContainerProps>(function TableContainer({ className, ...props }, ref) {
  return <div ref={ref} className={cx(tableContainerClass, className)} {...props} />;
});

export interface TableToolbarProps extends HTMLAttributes<HTMLDivElement> {}

/** The bar above the table: a TableHeading and TableTools (search, filters, a columns menu, a primary action). */
export const TableToolbar = /* @__PURE__ */ forwardRef<HTMLDivElement, TableToolbarProps>(function TableToolbar({ className, ...props }, ref) {
  return <div ref={ref} className={cx(tableToolbarClass, className)} {...props} />;
});

export interface TableHeadingProps extends HTMLAttributes<HTMLDivElement> {}

export const TableHeading = /* @__PURE__ */ forwardRef<HTMLDivElement, TableHeadingProps>(function TableHeading({ className, ...props }, ref) {
  return <div ref={ref} className={cx(tableHeadingClass, className)} {...props} />;
});

export interface TableTitleProps extends HTMLAttributes<HTMLHeadingElement> {}

export const TableTitle = /* @__PURE__ */ forwardRef<HTMLHeadingElement, TableTitleProps>(function TableTitle({ className, ...props }, ref) {
  return <h2 ref={ref} className={cx(tableTitleClass, className)} {...props} />;
});

export interface TableDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {}

export const TableDescription = /* @__PURE__ */ forwardRef<HTMLParagraphElement, TableDescriptionProps>(function TableDescription(
  { className, ...props },
  ref,
) {
  return <p ref={ref} className={cx(tableDescriptionClass, className)} {...props} />;
});

export interface TableToolsProps extends HTMLAttributes<HTMLDivElement> {}

export const TableTools = /* @__PURE__ */ forwardRef<HTMLDivElement, TableToolsProps>(function TableTools({ className, ...props }, ref) {
  return <div ref={ref} className={cx(tableToolsClass, className)} {...props} />;
});

export interface TablePagerProps extends HTMLAttributes<HTMLDivElement> {}

/** The bar under the table: the range shown ("1–10 of 48") and a Pagination. */
export const TablePager = /* @__PURE__ */ forwardRef<HTMLDivElement, TablePagerProps>(function TablePager({ className, ...props }, ref) {
  return <div ref={ref} className={cx(tablePagerClass, className)} {...props} />;
});

export interface TableHeaderProps extends HTMLAttributes<HTMLTableSectionElement> {
}

export const TableHeader = /* @__PURE__ */ forwardRef<HTMLTableSectionElement, TableHeaderProps>(
  function TableHeader(props, ref) {
    return <thead ref={ref} {...props} />;
  },
);

export interface TableBodyProps extends HTMLAttributes<HTMLTableSectionElement> {
}

export const TableBody = /* @__PURE__ */ forwardRef<HTMLTableSectionElement, TableBodyProps>(
  function TableBody(props, ref) {
    return <tbody ref={ref} {...props} />;
  },
);

export interface TableFooterProps extends HTMLAttributes<HTMLTableSectionElement> {
}

export const TableFooter = /* @__PURE__ */ forwardRef<HTMLTableSectionElement, TableFooterProps>(
  function TableFooter(props, ref) {
    return <tfoot ref={ref} {...props} />;
  },
);

export interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {
  /** A selected row (aria-selected="true"), e.g. when its checkbox is ticked. */
  selected?: boolean;
  /** A row that can't be acted on (aria-disabled="true"): muted, no hover. Disable the controls in it too. */
  disabled?: boolean;
  /** The detail row under an expandable row: shown while the row's TableExpand is expanded. */
  detail?: boolean;
}

export const TableRow = /* @__PURE__ */ forwardRef<HTMLTableRowElement, TableRowProps>(function TableRow(
  { selected, disabled, detail, className, ...props },
  ref,
) {
  return (
    <tr
      ref={ref}
      aria-selected={selected}
      aria-disabled={disabled || undefined}
      className={cx(detail && tableDetailClass, className) || undefined}
      {...props}
    />
  );
});

export interface TableCellProps extends TdHTMLAttributes<HTMLTableCellElement> {
  /** End-align with tabular digits. */
  numeric?: boolean;
  /** The narrow checkbox column for selecting rows. */
  select?: boolean;
  /** The narrow column holding a row's DragHandle, for reordering rows. */
  reorder?: boolean;
  /** The narrow end-aligned column for row action buttons and overflow menus. */
  actions?: boolean;
  /** Keep this column in view while the table scrolls sideways: at the inline start (true, "start") or end. */
  pin?: boolean | TablePin;
  /** One line ending in "…" (16rem wide at most, or --ayy-table-truncate). A text child also becomes the tooltip. */
  truncate?: boolean;
  /** Wrap long content within this column's width instead of keeping it on one line, ending in "…". */
  wrap?: boolean;
}

const cellClass = ({ numeric, select, reorder, actions, pin }: Pick<TableCellProps, "numeric" | "select" | "reorder" | "actions" | "pin">, className?: string) =>
  cx(numeric && tableNumClass, select && tableSelectClass, reorder && tableReorderClass, actions && tableActionsClass, tablePinClassName(pin), className) || undefined;

const truncated = (truncate: boolean | undefined, children: ReactNode) =>
  truncate ? (
    <span className={tableTruncateClass} title={typeof children === "string" ? children : undefined}>
      {children}
    </span>
  ) : (
    children
  );

export interface TableHeadProps extends ThHTMLAttributes<HTMLTableCellElement>, Omit<TableCellProps, "truncate"> {
  /** Optional column icon, before the label. */
  icon?: ReactNode;
  /** Column menu beside the label/sort button; compose with DropdownMenu. */
  menu?: ReactNode;
  /** Makes the header a sort button. "none" for a sortable column that isn't the sorted one. */
  sort?: SortDirection | "none";
  /** Called when the sort button is clicked; flip the direction with nextSortDirection() and sort your rows. */
  onSort?: () => void;
  /** Adds a TableResize handle at the cell's inline end. Table's onColumnResize reports the new width. */
  resizable?: boolean;
  /** Allows dragging this column header to reorder columns in the table. */
  reorderable?: boolean;
}

export const TableHead = /* @__PURE__ */ forwardRef<HTMLTableCellElement, TableHeadProps>(function TableHead(
  { numeric, select, reorder, actions, pin, wrap, icon, menu, sort, onSort, resizable, reorderable, className, scope = "col", children, ...props },
  ref,
) {
  const sortable = sort !== undefined || onSort !== undefined;
  const label = icon ? <>{<span className={tableColumnIconClass}>{icon}</span>}{children}</> : children;
  const content = sortable ? <button type="button" className={tableSortClass} onClick={onSort}>{label}</button> : label;
  return (
    <th
      ref={ref}
      scope={scope}
      aria-sort={sort && sort !== "none" ? sort : undefined}
      data-reorderable={reorderable === false ? "false" : reorderable ? "" : undefined}
      className={cx(cellClass({ numeric, select, reorder, actions, pin }, className), wrap && tableCellWrapClass, reorderable && tableDraggableClass) || undefined}
      {...props}
    >
      {menu ? <div className={tableColumnHeaderClass}><span className={tableColumnLabelClass}>{content}</span>{menu}</div> : content}
      {resizable ? <TableResize aria-label={typeof children === "string" ? `Resize ${children}` : undefined} /> : null}
    </th>
  );
});

export const TableCell = /* @__PURE__ */ forwardRef<HTMLTableCellElement, TableCellProps>(
  function TableCell({ numeric, select, reorder, actions, pin, truncate, wrap, className, children, ...props }, ref) {
    return (
      <td ref={ref} className={cx(cellClass({ numeric, select, reorder, actions, pin }, className), wrap && tableCellWrapClass) || undefined} {...props}>
        {truncated(truncate, children)}
      </td>
    );
  },
);

export interface TableResizeProps extends HTMLAttributes<HTMLSpanElement> {}

/** A column's resize handle (a separator). TableHead resizable renders it; Table wires the dragging and keys. */
export const TableResize = /* @__PURE__ */ forwardRef<HTMLSpanElement, TableResizeProps>(function TableResize({ className, ...props }, ref) {
  return (
    <span
      ref={ref}
      role="separator"
      aria-orientation="vertical"
      tabIndex={0}
      className={cx(tableResizeClass, className)}
      {...props}
    />
  );
});

export interface TableExpandProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Whether the row's detail row shows (aria-expanded). */
  expanded: boolean;
}

/** The chevron that opens a row's detail row. Give it an aria-label naming the row ("Show details for INV-1042"). */
export const TableExpand = /* @__PURE__ */ forwardRef<HTMLButtonElement, TableExpandProps>(function TableExpand(
  { expanded, className, type = "button", ...props },
  ref,
) {
  return <button ref={ref} type={type} aria-expanded={expanded} className={cx(tableExpandClass, className)} {...props} />;
});

export interface TableGroupProps extends HTMLAttributes<HTMLTableRowElement> {
  /** How many columns the group's heading spans: all of them. */
  colSpan: number;
}

/** A row heading the rows under it ("Overdue", "This week"). Start each group's <TableBody> with one. */
export const TableGroup = /* @__PURE__ */ forwardRef<HTMLTableRowElement, TableGroupProps>(function TableGroup(
  { colSpan, className, children, ...props },
  ref,
) {
  return (
    <tr ref={ref} className={cx(tableGroupClass, className)} {...props}>
      <th colSpan={colSpan} scope="rowgroup">
        <span>{children}</span>
      </th>
    </tr>
  );
});

export interface TableEmptyProps extends HTMLAttributes<HTMLTableRowElement> {
  /** How many columns the message spans: all of them. */
  colSpan: number;
}

/** The one row a table has when nothing matches: a line of text or an EmptyState. */
export const TableEmpty = /* @__PURE__ */ forwardRef<HTMLTableRowElement, TableEmptyProps>(function TableEmpty(
  { colSpan, children, ...props },
  ref,
) {
  return (
    <tr ref={ref} {...props}>
      <td colSpan={colSpan} className={tableEmptyClass}>
        {children}
      </td>
    </tr>
  );
});

export interface TableRowLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {}

/** The row's main link, stretched over the whole row. Other controls in the row stay clickable above it. */
export const TableRowLink = /* @__PURE__ */ forwardRef<HTMLAnchorElement, TableRowLinkProps>(function TableRowLink({ className, ...props }, ref) {
  return <a ref={ref} className={cx(tableRowLinkClass, className)} {...props} />;
});

export interface TableMediaProps extends HTMLAttributes<HTMLDivElement> {}

/** A cell's Avatar or icon followed by a name and a TableSecondary line. */
export const TableMedia = /* @__PURE__ */ forwardRef<HTMLDivElement, TableMediaProps>(function TableMedia({ className, ...props }, ref) {
  return <div ref={ref} className={cx(tableMediaClass, className)} {...props} />;
});

export interface TableSecondaryProps extends HTMLAttributes<HTMLSpanElement> {}

export const TableSecondary = /* @__PURE__ */ forwardRef<HTMLSpanElement, TableSecondaryProps>(function TableSecondary({ className, ...props }, ref) {
  return <span ref={ref} className={cx(tableSecondaryClass, className)} {...props} />;
});

export interface TableRowActionsProps extends HTMLAttributes<HTMLDivElement> {
  /** Reveal quick actions on row hover, keyboard focus, or when selected (touch screens keep them visible). */
  reveal?: boolean;
}

export const TableRowActions = /* @__PURE__ */ forwardRef<HTMLDivElement, TableRowActionsProps>(function TableRowActions(
  { reveal, className, ...props },
  ref,
) {
  return <div ref={ref} className={tableRowActionsClass({ reveal, className })} {...props} />;
});

export interface TableEditProps {
  /** The raw value. Controlled when set. */
  value?: string;
  /** Starting value when uncontrolled. */
  defaultValue?: string;
  /** A wrapping textarea that grows with its content. Shift+Enter adds a line; ⌘Enter or Ctrl+Enter saves. */
  multiline?: boolean;
  /** What the cell shows at rest when it isn't the value itself (a formatted price). */
  displayValue?: ReactNode;
  /** Accessible name of the cell's button and field: "Plan for Northwind". */
  "aria-label": string;
  disabled?: boolean;
  placeholder?: string;
  inputMode?: InputHTMLAttributes<HTMLInputElement>["inputMode"];
  className?: string;
  /** Called with the new value when the user saves a change (Enter or blur). */
  onValueCommit?: (value: string) => void;
}

/**
 * An inline editable cell (.ayy-table__edit on an Inline edit): reads like cell text at rest, turns into a field in place
 * on click with the text where it was, saves on Enter or blur and reverts on Escape. A save also bubbles "ayy-change", so
 * the Table's onCellEdit hears it.
 */
export const TableEdit = /* @__PURE__ */ forwardRef<HTMLDivElement, TableEditProps>(function TableEdit(
  { "aria-label": label, inputMode, className, onValueCommit, multiline, ...props },
  ref,
) {
  const own = useRef<HTMLDivElement>(null);
  return (
    <InlineEdit
      {...props}
      ref={mergeRefs(own, ref)}
      label={label}
      multiline={multiline}
      className={cx(tableEditClass, className)}
      inputProps={inputMode ? { inputMode } : undefined}
      onValueChange={(next) => {
        own.current?.dispatchEvent(new CustomEvent("ayy-change", { detail: { value: next }, bubbles: true }));
        onValueCommit?.(next);
      }}
    />
  );
});

export interface TableCaptionProps extends HTMLAttributes<HTMLTableCaptionElement> {
}

export const TableCaption = /* @__PURE__ */ forwardRef<HTMLTableCaptionElement, TableCaptionProps>(
  function TableCaption(props, ref) {
    return <caption ref={ref} {...props} />;
  },
);
