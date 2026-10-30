import {
  forwardRef,
  useContext,
  useEffect,
  useRef,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cx } from "../../lib/cx";
import { Cancel01Icon } from "../../lib/icons";
import { mergeRefs } from "../../lib/refs";
import { Icon } from "../icon/icon.react";
import { Tooltip, tooltipContext } from "../tooltip/tooltip.react";
import type { TooltipSide } from "../tooltip/tooltip";
import {
  actionBarActionsClass,
  actionBarButtonClass,
  actionBarClass,
  actionBarCloseClass,
  actionBarCountClass,
  actionBarSelectionClass,
  actionBarSeparatorClass,
  connectActionBar,
  type ActionBarButtonVariant,
} from "./action-bar";

export interface ActionBarProps extends HTMLAttributes<HTMLDivElement> {
  /** Shows the bar when true (sets the open attribute, triggering the entrance animation). */
  open?: boolean;
  /** Pin the bar to the bottom center of the viewport instead of sticky inside its scroll container. */
  fixed?: boolean;
  /** Accessible name for the toolbar (default "Bulk actions"). */
  label?: string;
  /** Called when the clear button or Escape key clears the selection. */
  onClear?: () => void;
}

export const ActionBar = forwardRef<HTMLDivElement, ActionBarProps>(function ActionBar(
  { open = false, fixed, label = "Bulk actions", onClear, className, children, ...props },
  ref,
) {
  const host = useRef<HTMLDivElement>(null);
  const onClearRef = useRef(onClear);
  onClearRef.current = onClear;

  useEffect(() => {
    if (!host.current) return;
    return connectActionBar(host.current, {
      onClear: () => {
        if (onClearRef.current) {
          onClearRef.current();
          return false;
        }
      },
    }).destroy;
  }, []);

  useEffect(() => {
    if (host.current) {
      host.current.toggleAttribute("open", Boolean(open));
    }
  }, [open]);

  return (
    <div
      ref={mergeRefs(ref, host)}
      role="toolbar"
      aria-label={label}
      {...(open ? { open: true } : {})}
      className={actionBarClass({ fixed, className })}
      {...props}
    >
      {children}
    </div>
  );
});

export interface ActionBarSelectionProps extends HTMLAttributes<HTMLDivElement> {}

export const ActionBarSelection = forwardRef<HTMLDivElement, ActionBarSelectionProps>(function ActionBarSelection(
  { className, ...props },
  ref,
) {
  return <div ref={ref} className={cx(actionBarSelectionClass, className)} {...props} />;
});

export interface ActionBarCountProps extends HTMLAttributes<HTMLSpanElement> {}

export const ActionBarCount = forwardRef<HTMLSpanElement, ActionBarCountProps>(function ActionBarCount(
  { className, ...props },
  ref,
) {
  return <span ref={ref} className={cx(actionBarCountClass, className)} {...props} />;
});

export interface ActionBarCloseProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Accessible label for the clear selection button (default "Clear selection"). */
  label?: string;
  tooltip?: ReactNode | boolean;
  tooltipSide?: TooltipSide;
}

export const ActionBarClose = forwardRef<HTMLButtonElement, ActionBarCloseProps>(function ActionBarClose(
  { label = "Clear selection", tooltip = true, tooltipSide = "top", className, children, ...props },
  ref,
) {
  const hasParentTooltip = useContext(tooltipContext);
  const button = (
    <button
      ref={ref}
      type="button"
      aria-label={label}
      className={cx(actionBarCloseClass, className)}
      {...props}
    >
      {children ?? <Icon icon={Cancel01Icon} name="x" />}
    </button>
  );
  if (hasParentTooltip || tooltip === false) return button;
  return (
    <Tooltip side={tooltipSide} content={typeof tooltip === "boolean" ? label : tooltip}>
      {button}
    </Tooltip>
  );
});

export interface ActionBarSeparatorProps extends HTMLAttributes<HTMLDivElement> {}

export const ActionBarSeparator = forwardRef<HTMLDivElement, ActionBarSeparatorProps>(function ActionBarSeparator(
  { className, ...props },
  ref,
) {
  return <div ref={ref} role="separator" className={cx(actionBarSeparatorClass, className)} {...props} />;
});

export interface ActionBarActionsProps extends HTMLAttributes<HTMLDivElement> {}

export const ActionBarActions = forwardRef<HTMLDivElement, ActionBarActionsProps>(function ActionBarActions(
  { className, ...props },
  ref,
) {
  return <div ref={ref} role="group" className={cx(actionBarActionsClass, className)} {...props} />;
});

export interface ActionBarButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ActionBarButtonVariant;
  primary?: boolean;
  secondary?: boolean;
  destructive?: boolean;
  /** Square icon-only button without label padding. Must have aria-label. */
  icon?: boolean;
  /** Sets aria-expanded when used as a DropdownMenuTrigger. */
  open?: boolean;
  tooltip?: ReactNode | boolean;
  tooltipSide?: TooltipSide;
}

export const ActionBarButton = forwardRef<HTMLButtonElement, ActionBarButtonProps>(function ActionBarButton(
  { variant, primary, secondary, destructive, icon, open, tooltip, tooltipSide = "top", className, type = "button", ...props },
  ref,
) {
  const hasParentTooltip = useContext(tooltipContext);
  const tooltipContent =
    !hasParentTooltip && tooltip !== false
      ? (tooltip ?? (icon ? props["aria-label"] : undefined))
      : undefined;

  const button = (
    <button
      ref={ref}
      type={type}
      aria-expanded={open}
      className={actionBarButtonClass({ variant, primary, secondary, destructive, icon, className })}
      {...props}
    />
  );

  if (!tooltipContent) return button;

  return (
    <Tooltip side={tooltipSide} content={tooltipContent}>
      {button}
    </Tooltip>
  );
});
