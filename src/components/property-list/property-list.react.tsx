import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cx } from "../../lib/cx";
import {
  propertyListClass,
  propertyListEmptyClass,
  propertyListLabelClass,
  propertyListRowClass,
  propertyListTermClass,
  propertyListValueClass,
} from "./property-list";

export interface PropertyListProps extends HTMLAttributes<HTMLDListElement> {
  /** Tight rows with a shorter term column, for a dense summary. */
  compact?: boolean;
}

/** A record's attributes as a <dl> of PropertyRow rows. */
export const PropertyList = /* @__PURE__ */ forwardRef<HTMLDListElement, PropertyListProps>(function PropertyList(
  { compact, className, ...props },
  ref,
) {
  return <dl ref={ref} className={propertyListClass({ compact, className })} {...props} />;
});

export interface PropertyRowProps extends HTMLAttributes<HTMLDivElement> {
  /** The term: what the value is ("Status", "Owner"). */
  label: ReactNode;
  /** An Icon before the label. */
  icon?: ReactNode;
  /** There is no value: show emptyText muted instead of children. */
  empty?: boolean;
  /** What an empty value reads. Default "Not set". */
  emptyText?: ReactNode;
}

/** One row: a term (an icon and a label) and its value. Read-only values are plain content; editable ones nest InlineEdit. */
export const PropertyRow = /* @__PURE__ */ forwardRef<HTMLDivElement, PropertyRowProps>(function PropertyRow(
  { label, icon, empty = false, emptyText = "Not set", className, children, ...props },
  ref,
) {
  return (
    <div ref={ref} className={cx(propertyListRowClass, className)} {...props}>
      <dt className={propertyListTermClass}>
        {icon}
        <span className={propertyListLabelClass}>{label}</span>
      </dt>
      <dd className={propertyListValueClass}>
        {empty ? <span className={propertyListEmptyClass}>{emptyText}</span> : children}
      </dd>
    </div>
  );
});
