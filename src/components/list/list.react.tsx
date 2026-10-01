import { forwardRef, type AnchorHTMLAttributes, type HTMLAttributes, type LiHTMLAttributes, type Ref } from "react";
import { cx } from "../../lib/cx";
import { listClass, listContentClass, listDescriptionClass, listItemClass, listLinkClass, listMetaClass, listTitleClass } from "./list";

export interface ListProps extends HTMLAttributes<HTMLUListElement> {
  /** Hairlines between flush rows (settings, records in a card) instead of rounded rows. */
  divided?: boolean;
  /** Tight rows without padding, for an icon checklist (plan perks, what's included). */
  compact?: boolean;
}

/** A <ul> of ListItem rows. */
export const List = forwardRef<HTMLUListElement, ListProps>(function List({ divided, compact, className, ...props }, ref) {
  return <ul ref={ref} className={listClass({ divided, compact, className })} {...props} />;
});

/** One row: leading media (Avatar, Icon, IconTile), a ListContent, then trailing ListMeta or a control. */
export const ListItem = forwardRef<HTMLLIElement, LiHTMLAttributes<HTMLLIElement>>(function ListItem({ className, ...props }, ref) {
  return <li ref={ref} className={cx(listItemClass, className)} {...props} />;
});

/** The column that holds ListTitle and ListDescription; it takes the free space. */
export const ListContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(function ListContent({ className, ...props }, ref) {
  return <div ref={ref} className={cx(listContentClass, className)} {...props} />;
});

export interface ListTitleProps extends HTMLAttributes<HTMLElement> {
  /** The id of the row's switch or checkbox: the title becomes its <label>. */
  htmlFor?: string;
}

/** The row's main text: a <p>, or a <label> for the row's control when htmlFor is set. */
export const ListTitle = forwardRef<HTMLElement, ListTitleProps>(function ListTitle({ htmlFor, className, ...props }, ref) {
  if (htmlFor) return <label ref={ref as Ref<HTMLLabelElement>} htmlFor={htmlFor} className={cx(listTitleClass, className)} {...props} />;
  return <p ref={ref as Ref<HTMLParagraphElement>} className={cx(listTitleClass, className)} {...props} />;
});

export const ListDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(function ListDescription(
  { className, ...props },
  ref,
) {
  return <p ref={ref} className={cx(listDescriptionClass, className)} {...props} />;
});

/** Short trailing text: a time, a count, a size. */
export const ListMeta = forwardRef<HTMLSpanElement, HTMLAttributes<HTMLSpanElement>>(function ListMeta({ className, ...props }, ref) {
  return <span ref={ref} className={cx(listMetaClass, className)} {...props} />;
});

export interface ListLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /** The row being shown (sets aria-current="page"): it gets a tint and a heavier title. */
  current?: boolean;
}

/** Put inside ListTitle: the link covers the whole row. */
export const ListLink = forwardRef<HTMLAnchorElement, ListLinkProps>(function ListLink({ current, className, ...props }, ref) {
  return <a ref={ref} className={cx(listLinkClass, className)} aria-current={current ? "page" : undefined} {...props} />;
});
