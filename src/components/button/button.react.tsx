import { forwardRef, useContext, type ButtonHTMLAttributes, type HTMLAttributes, type MouseEvent, type ReactNode } from "react";
import { Spinner } from "../spinner/spinner.react";
import { Tooltip, tooltipContext } from "../tooltip/tooltip.react";
import { generalActionLabel, type TooltipSide } from "../tooltip/tooltip";
import { buttonClass, splitButtonClass, type ButtonAlign, type ButtonSize, type ButtonVariant } from "./button";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Where the icon and label sit in a wide button (use with block). Defaults to "center". */
  align?: ButtonAlign;
  /** Fill the container's width. */
  block?: boolean;
  /** Working on it: a spinner before the label, aria-busy="true", and clicks (and form submits) are ignored. It stays focusable. */
  loading?: boolean;
  /** Tooltip text or element. By default, icon-only buttons show their aria-label on hover. Pass false to disable. */
  tooltip?: ReactNode | boolean;
  /** Tooltip placement side (default "top"). */
  tooltipSide?: TooltipSide;
}

/** Defaults to type="button" so it never submits a form by accident. Pass type="submit" explicitly. */
export const Button = /* @__PURE__ */ forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant,
    size,
    block,
    align,
    loading,
    tooltip,
    tooltipSide = "top",
    className,
    type = "button",
    onClick,
    children,
    ...props
  },
  ref,
) {
  const click = (event: MouseEvent<HTMLButtonElement>) => {
    if (loading) return event.preventDefault();
    onClick?.(event);
  };

  const hasParentTooltip = useContext(tooltipContext);
  const isIconOnly =
    size === "icon" ||
    size === "icon-xs" ||
    size === "icon-sm" ||
    size === "icon-lg" ||
    size === "icon-xl" ||
    (Boolean(className) && /\bayy-button--icon(?:-xs|-sm|-lg|-xl)?\b/.test(className!));

  const ariaLabel = props["aria-label"];
  const defaultLabel = ariaLabel ? generalActionLabel(ariaLabel) : props.title;
  const tooltipContent =
    !hasParentTooltip && tooltip !== false
      ? (tooltip ?? (isIconOnly ? defaultLabel : undefined))
      : undefined;

  const buttonProps = tooltipContent && props.title ? { ...props, title: undefined } : props;

  const button = (
    <button
      ref={ref}
      type={type}
      className={buttonClass({ variant, size, block, align, className })}
      aria-busy={loading || undefined}
      onClick={click}
      {...buttonProps}
    >
      {loading ? <Spinner label="" /> : null}
      {children}
    </button>
  );

  if (!tooltipContent) return button;

  return (
    <Tooltip side={tooltipSide} content={tooltipContent}>
      {button}
    </Tooltip>
  );
});

export interface SplitButtonProps extends HTMLAttributes<HTMLDivElement> {
  /** Fill the container's width: the main action grows, the menu trigger stays square. */
  block?: boolean;
}

/** Joins a main action Button with a trailing DropdownMenu trigger Button into a single split button. */
export const SplitButton = /* @__PURE__ */ forwardRef<HTMLDivElement, SplitButtonProps>(function SplitButton(
  { block, className, role = "group", ...props },
  ref,
) {
  return <div ref={ref} role={role} className={splitButtonClass({ block, className })} {...props} />;
});
