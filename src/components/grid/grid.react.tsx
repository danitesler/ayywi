import {
  forwardRef,
  type CSSProperties,
  type HTMLAttributes,
  type LabelHTMLAttributes,
} from "react";
import { cx } from "../../lib/cx";
import {
  gridBodyClass,
  gridClass,
  gridDescriptionClass,
  gridFooterClass,
  gridHeaderClass,
  gridItemActionsClass,
  gridItemClass,
  gridMediaClass,
  gridSelectAllClass,
  gridSelectClass,
  gridTitleClass,
  gridToolbarClass,
  gridWrapClass,
} from "./grid";

export interface GridWrapProps extends HTMLAttributes<HTMLDivElement> {}

export const GridWrap = forwardRef<HTMLDivElement, GridWrapProps>(function GridWrap({ className, ...props }, ref) {
  return <div ref={ref} className={cx(gridWrapClass, className)} {...props} />;
});

export interface GridToolbarProps extends HTMLAttributes<HTMLDivElement> {}

export const GridToolbar = forwardRef<HTMLDivElement, GridToolbarProps>(function GridToolbar(
  { className, ...props },
  ref,
) {
  return <div ref={ref} className={cx(gridToolbarClass, className)} {...props} />;
});

export interface GridSelectAllProps extends LabelHTMLAttributes<HTMLLabelElement> {}

export const GridSelectAll = forwardRef<HTMLLabelElement, GridSelectAllProps>(function GridSelectAll(
  { className, ...props },
  ref,
) {
  return <label ref={ref} className={cx(gridSelectAllClass, className)} {...props} />;
});

export interface GridProps extends HTMLAttributes<HTMLDivElement> {
  compact?: boolean;
  /** Minimum card column width (sets --ayy-min, default "16rem", "13rem" when compact). */
  min?: string;
}

export const Grid = forwardRef<HTMLDivElement, GridProps>(function Grid(
  { compact, min, className, style, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      className={gridClass({ compact, className })}
      style={min ? ({ "--ayy-min": min, ...style } as CSSProperties) : style}
      {...props}
    />
  );
});

const INTERACTIVE = 'a, button, input, label, select, textarea, summary, [popover], [role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"]';

export interface GridItemProps extends HTMLAttributes<HTMLElement> {
  /** Marks the card as selected (aria-selected="true"). */
  selected?: boolean;
  /** Called when the card body is clicked (outside buttons, links, inputs and menus) to toggle selection. */
  onSelectedChange?: (selected: boolean) => void;
}

export const GridItem = forwardRef<HTMLElement, GridItemProps>(function GridItem(
  { selected, onSelectedChange, className, onClick, ...props },
  ref,
) {
  return (
    <article
      ref={ref}
      aria-selected={selected}
      className={cx(gridItemClass, className)}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented || !onSelectedChange) return;
        const target = event.target as Element | null;
        if (target?.closest(INTERACTIVE)) return;
        event.preventDefault();
        onSelectedChange(!selected);
      }}
      {...props}
    />
  );
});

export interface GridItemMediaProps extends HTMLAttributes<HTMLDivElement> {}

export const GridItemMedia = forwardRef<HTMLDivElement, GridItemMediaProps>(function GridItemMedia(
  { className, ...props },
  ref,
) {
  return <div ref={ref} className={cx(gridMediaClass, className)} {...props} />;
});

export interface GridItemHeaderProps extends HTMLAttributes<HTMLDivElement> {}

export const GridItemHeader = forwardRef<HTMLDivElement, GridItemHeaderProps>(function GridItemHeader(
  { className, ...props },
  ref,
) {
  return <div ref={ref} className={cx(gridHeaderClass, className)} {...props} />;
});

export interface GridItemSelectProps extends HTMLAttributes<HTMLDivElement> {}

export const GridItemSelect = forwardRef<HTMLDivElement, GridItemSelectProps>(function GridItemSelect(
  { className, ...props },
  ref,
) {
  return <div ref={ref} className={cx(gridSelectClass, className)} {...props} />;
});

export interface GridItemActionsProps extends HTMLAttributes<HTMLDivElement> {
  /** Reveal quick actions on card hover, keyboard focus, or when selected (touch screens keep them visible). */
  reveal?: boolean;
}

export const GridItemActions = forwardRef<HTMLDivElement, GridItemActionsProps>(function GridItemActions(
  { reveal, className, ...props },
  ref,
) {
  return <div ref={ref} className={gridItemActionsClass({ reveal, className })} {...props} />;
});

export interface GridItemTitleProps extends HTMLAttributes<HTMLHeadingElement> {}

export const GridItemTitle = forwardRef<HTMLHeadingElement, GridItemTitleProps>(function GridItemTitle(
  { className, ...props },
  ref,
) {
  return <h3 ref={ref} className={cx(gridTitleClass, className)} {...props} />;
});

export interface GridItemDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {}

export const GridItemDescription = forwardRef<HTMLParagraphElement, GridItemDescriptionProps>(
  function GridItemDescription({ className, ...props }, ref) {
    return <p ref={ref} className={cx(gridDescriptionClass, className)} {...props} />;
  },
);

export interface GridItemBodyProps extends HTMLAttributes<HTMLDivElement> {}

export const GridItemBody = forwardRef<HTMLDivElement, GridItemBodyProps>(function GridItemBody(
  { className, ...props },
  ref,
) {
  return <div ref={ref} className={cx(gridBodyClass, className)} {...props} />;
});

export interface GridItemFooterProps extends HTMLAttributes<HTMLDivElement> {}

export const GridItemFooter = forwardRef<HTMLDivElement, GridItemFooterProps>(function GridItemFooter(
  { className, ...props },
  ref,
) {
  return <div ref={ref} className={cx(gridFooterClass, className)} {...props} />;
});
