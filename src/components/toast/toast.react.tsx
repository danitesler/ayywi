import { forwardRef, useEffect, useState, type ButtonHTMLAttributes, type HTMLAttributes, type ImgHTMLAttributes, type MouseEvent, type ReactNode } from "react";
import { cx } from "../../lib/cx";
import { Alert02Icon, Cancel01Icon, CancelCircleIcon, CheckmarkCircle02Icon, Copy01Icon, InformationCircleIcon, Tick02Icon } from "../../lib/icons";
import { Icon } from "../icon/icon.react";
import { configureToaster, inlineToastClass, type ToastPosition } from "./toast";

export interface ToasterProps {
  position?: ToastPosition;
  /** Accessible name of the notifications region. Translate it. Default "Notifications". */
  label?: string;
  /** Accessible name of each toast's close button. Translate it. Default "Dismiss". */
  closeLabel?: string;
  /** Label of the "Clear all" button shown when the stack is open. Translate it. Default "Clear all". */
  clearLabel?: string;
}

/**
 * Optional: configures where toasts appear and their translated labels. Toasts work without it —
 * call toast() from anywhere. Renders nothing.
 */
export function Toaster({ position, label, closeLabel, clearLabel }: ToasterProps) {
  useEffect(() => {
    configureToaster({
      ...(position ? { position } : {}),
      ...(label ? { label } : {}),
      ...(closeLabel ? { closeLabel } : {}),
      ...(clearLabel ? { clearLabel } : {}),
    });
  }, [position, label, closeLabel, clearLabel]);
  return null;
}

export interface NotificationToastProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  variant?: "default" | "success" | "warning" | "destructive" | "info" | "card" | "long";
  title?: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  action?: { label: string; onClick?: () => void };
  copyable?: boolean;
  copyText?: string;
  onClose?: () => void;
  closeLabel?: string;
}

export const NotificationToast = forwardRef<HTMLDivElement, NotificationToastProps>(function NotificationToast(
  {
    variant = "default",
    title,
    description,
    icon,
    action,
    copyable,
    copyText,
    onClose,
    closeLabel = "Dismiss",
    className,
    children,
    ...props
  },
  ref,
) {
  const [copied, setCopied] = useState(false);
  const isDestructive = variant === "destructive";
  const showCopy = copyable ?? (variant === "long");
  const classes = cx(
    "ayy-toast",
    variant !== "default" && `ayy-toast--${variant}`,
    className,
  );

  const defaultIcon = icon ?? (
    variant === "success" ? <Icon icon={CheckmarkCircle02Icon} /> :
    variant === "warning" ? <Icon icon={Alert02Icon} /> :
    variant === "destructive" ? <Icon icon={CancelCircleIcon} /> :
    variant === "info" ? <Icon icon={InformationCircleIcon} /> : null
  );

  const handleCopy = (e: MouseEvent) => {
    e.stopPropagation();
    const text =
      copyText ??
      (typeof title === "string"
        ? description && typeof description === "string"
          ? `${title}\n${description}`
          : title
        : "");
    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText && text) {
      navigator.clipboard.writeText(text).catch(() => {});
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div ref={ref} className={classes} role={isDestructive ? "alert" : undefined} {...props}>
      {defaultIcon && <span className="ayy-toast__icon" aria-hidden="true">{defaultIcon}</span>}
      {(title || description) && (
        <div className="ayy-toast__content">
          {title && <p className="ayy-toast__title">{title}</p>}
          {description && <p className="ayy-toast__description">{description}</p>}
        </div>
      )}
      {action && (
        <div className="ayy-toast__actions">
          <button
            type="button"
            className="ayy-button ayy-button--secondary ayy-button--sm"
            onClick={action.onClick}
          >
            {action.label}
          </button>
        </div>
      )}
      {showCopy && (
        <button
          type="button"
          className="ayy-toast__copy"
          aria-label={copied ? "Copied" : "Copy"}
          title={copied ? "Copied" : "Copy"}
          data-copied={copied ? "" : undefined}
          onClick={handleCopy}
        >
          <Icon icon={copied ? Tick02Icon : Copy01Icon} />
        </button>
      )}
      {onClose && (
        <button
          type="button"
          className="ayy-toast__close"
          aria-label={closeLabel}
          title={closeLabel}
          onClick={onClose}
        >
          <Icon icon={Cancel01Icon} />
        </button>
      )}
      {children}
    </div>
  );
});

export const Toast = NotificationToast;

export interface CardToastProps extends HTMLAttributes<HTMLDivElement> {
  split?: boolean | "horizontal" | "vertical";
}

export const CardToast = forwardRef<HTMLDivElement, CardToastProps>(function CardToast(
  { split, className, children, ...props },
  ref,
) {
  const classes = cx(
    "ayy-toast ayy-toast--card",
    split && (split === "vertical" ? "ayy-toast--card-split ayy-toast--card-split--vertical" : "ayy-toast--card-split"),
    className,
  );

  return (
    <div ref={ref} className={classes} {...props}>
      {children}
    </div>
  );
});

export interface CardToastThumbProps extends HTMLAttributes<HTMLDivElement> {}

export const CardToastThumb = forwardRef<HTMLDivElement, CardToastThumbProps>(function CardToastThumb(
  { className, children, ...props },
  ref,
) {
  return (
    <div ref={ref} className={cx("ayy-toast__thumb", className)} {...props}>
      {children}
    </div>
  );
});

export interface CardToastBackdropProps extends ImgHTMLAttributes<HTMLImageElement> {}

export const CardToastBackdrop = forwardRef<HTMLImageElement, CardToastBackdropProps>(function CardToastBackdrop(
  { className, alt = "", width, height, ...props },
  ref,
) {
  return (
    <img
      ref={ref}
      className={cx("ayy-toast__backdrop", className)}
      alt={alt}
      aria-hidden="true"
      draggable={false}
      width={width}
      height={height}
      {...props}
    />
  );
});

export interface CardToastImageProps extends ImgHTMLAttributes<HTMLImageElement> {}

export const CardToastImage = forwardRef<HTMLImageElement, CardToastImageProps>(function CardToastImage(
  { className, alt = "", width, height, ...props },
  ref,
) {
  return (
    <img
      ref={ref}
      className={cx("ayy-toast__image", className)}
      alt={alt}
      draggable={false}
      width={width}
      height={height}
      {...props}
    />
  );
});

export interface CardToastMediaProps extends HTMLAttributes<HTMLSpanElement> {}

export const CardToastMedia = forwardRef<HTMLSpanElement, CardToastMediaProps>(function CardToastMedia(
  { className, children, ...props },
  ref,
) {
  return (
    <span ref={ref} className={cx("ayy-toast__media", className)} aria-hidden="true" {...props}>
      {children}
    </span>
  );
});

export interface CardToastScrimProps extends HTMLAttributes<HTMLDivElement> {}

export const CardToastScrim = forwardRef<HTMLDivElement, CardToastScrimProps>(function CardToastScrim(
  { className, children, ...props },
  ref,
) {
  return (
    <div ref={ref} className={cx("ayy-toast__scrim", className)} {...props}>
      {children}
    </div>
  );
});

export interface CardToastCloseProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
}

export const CardToastClose = forwardRef<HTMLButtonElement, CardToastCloseProps>(function CardToastClose(
  { className, label = "Dismiss", ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type="button"
      className={cx("ayy-toast__close", className)}
      aria-label={label}
      title={label}
      {...props}
    >
      <Icon icon={Cancel01Icon} />
    </button>
  );
});

export interface CardToastCornerProps extends HTMLAttributes<HTMLDivElement> {
  position?: "top" | "top-start" | "bottom-start" | "bottom-end";
}

export const CardToastCorner = forwardRef<HTMLDivElement, CardToastCornerProps>(function CardToastCorner(
  { position = "top-start", className, children, ...props },
  ref,
) {
  return (
    <div ref={ref} className={cx("ayy-toast__corner", `ayy-toast__corner--${position}`, className)} {...props}>
      {children}
    </div>
  );
});

export interface CardToastCenterProps extends HTMLAttributes<HTMLDivElement> {}

export const CardToastCenter = forwardRef<HTMLDivElement, CardToastCenterProps>(function CardToastCenter(
  { className, children, ...props },
  ref,
) {
  return (
    <div ref={ref} className={cx("ayy-toast__center", className)} {...props}>
      {children}
    </div>
  );
});

export interface CardToastActionProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
}

export const CardToastAction = forwardRef<HTMLButtonElement, CardToastActionProps>(function CardToastAction(
  { className, label, children, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type="button"
      className={cx("ayy-toast__action", className)}
      aria-label={label}
      title={label}
      {...props}
    >
      {children}
    </button>
  );
});

export interface InlineToastProps extends HTMLAttributes<HTMLDivElement> {
  tone?: "default" | "success" | "busy" | "error";
  icon?: ReactNode;
}

export const InlineToast = forwardRef<HTMLDivElement, InlineToastProps>(function InlineToast(
  { tone = "default", icon, className, children, ...props },
  ref,
) {
  return (
    <div ref={ref} className={inlineToastClass({ tone, className })} role="status" {...props}>
      {icon && <span className="ayy-toast__icon" aria-hidden="true">{icon}</span>}
      {typeof children === "string" ? <span>{children}</span> : children}
    </div>
  );
});

export interface CardToastStatusProps extends HTMLAttributes<HTMLDivElement> {
  tone?: "default" | "success" | "busy" | "error";
  icon?: ReactNode;
}

export const CardToastStatus = forwardRef<HTMLDivElement, CardToastStatusProps>(function CardToastStatus(
  { tone = "success", icon, className, children, ...props },
  ref,
) {
  return (
    <div ref={ref} className={inlineToastClass({ tone, className })} role="status" {...props}>
      {icon && <span className="ayy-toast__icon" aria-hidden="true">{icon}</span>}
      {typeof children === "string" ? <span>{children}</span> : children}
    </div>
  );
});
