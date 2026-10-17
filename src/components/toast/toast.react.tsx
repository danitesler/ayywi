import { useEffect, useState } from "react";
import { configureToaster, type ToastPosition } from "./toast";

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

export interface NotificationToastProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  variant?: "default" | "success" | "warning" | "destructive" | "info" | "card" | "long";
  title?: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  action?: { label: string; onClick?: () => void };
  copyable?: boolean;
  copyText?: string;
  onClose?: () => void;
  closeLabel?: string;
}

export function NotificationToast({
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
}: NotificationToastProps) {
  const [copied, setCopied] = useState(false);
  const isDestructive = variant === "destructive";
  const showCopy = copyable ?? (variant === "long");
  const classes = [
    "ayy-toast",
    variant !== "default" ? `ayy-toast--${variant}` : "",
    className ?? "",
  ].filter(Boolean).join(" ");

  const handleCopy = (e: React.MouseEvent) => {
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
    <div className={classes} role={isDestructive ? "alert" : undefined} {...props}>
      {icon && <span className="ayy-toast__icon" aria-hidden="true">{icon}</span>}
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
            className="ayy-button ayy-button--ghost ayy-button--sm"
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
          {copied ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 14L8.5 17.5L19 6.5" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7.5 14.5C7.5 11.2002 7.5 9.55025 8.52513 8.52513C9.55025 7.5 11.2002 7.5 14.5 7.5C17.7998 7.5 19.4497 7.5 20.4749 8.52513C21.5 9.55025 21.5 11.2002 21.5 14.5C21.5 17.7998 21.5 19.4497 20.4749 20.4749C19.4497 21.5 17.7998 21.5 14.5 21.5C11.2002 21.5 9.55025 21.5 8.52513 20.4749C7.5 19.4497 7.5 17.7998 7.5 14.5Z" />
              <path d="M7.5 16.5C6.10355 16.5 5.40533 16.5 4.84402 16.3036C3.83866 15.9518 3.0482 15.1613 2.69641 14.156C2.5 13.5947 2.5 12.8964 2.5 11.5V9.5C2.5 6.20017 2.5 4.55025 3.52513 3.52513C4.55025 2.5 6.20017 2.5 9.5 2.5H11.5C12.8964 2.5 13.5947 2.5 14.156 2.69641C15.1613 3.0482 15.9518 3.83866 16.3036 4.84402C16.5 5.40533 16.5 6.10355 16.5 7.5" />
            </svg>
          )}
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
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6L6.00081 17.9992M17.9992 18L6 6.00085" />
          </svg>
        </button>
      )}
      {children}
    </div>
  );
}

export const Toast = NotificationToast;

export interface CardToastProps extends React.HTMLAttributes<HTMLDivElement> {
  split?: boolean | "horizontal" | "vertical";
}

export function CardToast({ split, className, children, ...props }: CardToastProps) {
  const classes = [
    "ayy-toast",
    "ayy-toast--card",
    split ? (split === "vertical" ? "ayy-toast--card-split ayy-toast--card-split--vertical" : "ayy-toast--card-split") : "",
    className ?? "",
  ].filter(Boolean).join(" ");

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
}

export interface CardToastThumbProps extends React.HTMLAttributes<HTMLDivElement> {}

export function CardToastThumb({ className, children, ...props }: CardToastThumbProps) {
  return (
    <div className={className ? `ayy-toast__thumb ${className}` : "ayy-toast__thumb"} {...props}>
      {children}
    </div>
  );
}

export interface CardToastBackdropProps extends React.ImgHTMLAttributes<HTMLImageElement> {}

export function CardToastBackdrop({ className, alt = "", ...props }: CardToastBackdropProps) {
  return <img className={className ? `ayy-toast__backdrop ${className}` : "ayy-toast__backdrop"} alt={alt} aria-hidden="true" draggable={false} {...props} />;
}

export interface CardToastImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {}

export function CardToastImage({ className, alt = "", ...props }: CardToastImageProps) {
  return <img className={className ? `ayy-toast__image ${className}` : "ayy-toast__image"} alt={alt} draggable={false} {...props} />;
}

export interface CardToastMediaProps extends React.HTMLAttributes<HTMLSpanElement> {}

export function CardToastMedia({ className, children, ...props }: CardToastMediaProps) {
  return (
    <span className={className ? `ayy-toast__media ${className}` : "ayy-toast__media"} aria-hidden="true" {...props}>
      {children}
    </span>
  );
}

export interface CardToastScrimProps extends React.HTMLAttributes<HTMLDivElement> {}

export function CardToastScrim({ className, children, ...props }: CardToastScrimProps) {
  return (
    <div className={className ? `ayy-toast__scrim ${className}` : "ayy-toast__scrim"} {...props}>
      {children}
    </div>
  );
}

export interface CardToastCloseProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
}

export function CardToastClose({ className, label = "Dismiss", ...props }: CardToastCloseProps) {
  return (
    <button
      type="button"
      className={className ? `ayy-toast__close ${className}` : "ayy-toast__close"}
      aria-label={label}
      title={label}
      {...props}
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 6L6.00081 17.9992M17.9992 18L6 6.00085" />
      </svg>
    </button>
  );
}

export interface CardToastCornerProps extends React.HTMLAttributes<HTMLDivElement> {
  position?: "top" | "top-start" | "bottom-start" | "bottom-end";
}

export function CardToastCorner({ position = "top-start", className, children, ...props }: CardToastCornerProps) {
  return (
    <div className={className ? `ayy-toast__corner ayy-toast__corner--${position} ${className}` : `ayy-toast__corner ayy-toast__corner--${position}`} {...props}>
      {children}
    </div>
  );
}

export interface CardToastCenterProps extends React.HTMLAttributes<HTMLDivElement> {}

export function CardToastCenter({ className, children, ...props }: CardToastCenterProps) {
  return (
    <div className={className ? `ayy-toast__center ${className}` : "ayy-toast__center"} {...props}>
      {children}
    </div>
  );
}

export interface CardToastActionProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
}

export function CardToastAction({ className, label, children, ...props }: CardToastActionProps) {
  return (
    <button
      type="button"
      className={className ? `ayy-toast__action ${className}` : "ayy-toast__action"}
      aria-label={label}
      title={label}
      {...props}
    >
      {children}
    </button>
  );
}

export interface InlineToastProps extends React.HTMLAttributes<HTMLDivElement> {
  tone?: "default" | "success" | "busy" | "error";
  icon?: React.ReactNode;
}

export function InlineToast({ tone = "default", icon, className, children, ...props }: InlineToastProps) {
  const classes = [
    "ayy-toast--inline",
    tone !== "default" ? `ayy-toast--inline--${tone}` : "",
    className ?? "",
  ].filter(Boolean).join(" ");

  return (
    <div className={classes} role="status" {...props}>
      {icon && <span className="ayy-toast__icon" aria-hidden="true">{icon}</span>}
      {typeof children === "string" ? <span>{children}</span> : children}
    </div>
  );
}

export interface CardToastStatusProps extends React.HTMLAttributes<HTMLDivElement> {
  tone?: "default" | "success" | "busy" | "error";
  icon?: React.ReactNode;
}

export function CardToastStatus({ tone = "success", icon, className, children, ...props }: CardToastStatusProps) {
  const classes = [
    "ayy-toast__status",
    tone !== "default" ? `ayy-toast__status--${tone}` : "",
    className ?? "",
  ].filter(Boolean).join(" ");

  return (
    <div className={classes} role="status" {...props}>
      {icon && <span className="ayy-toast__icon" aria-hidden="true">{icon}</span>}
      {typeof children === "string" ? <span>{children}</span> : children}
    </div>
  );
}
