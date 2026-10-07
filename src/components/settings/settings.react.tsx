import { forwardRef, useId, type AnchorHTMLAttributes, type ButtonHTMLAttributes, type HTMLAttributes, type ReactNode } from "react";
import { ArrowRight01Icon } from "../../lib/icons";
import { Icon } from "../icon/icon.react";
import { settingsClass, settingsRowClass } from "./settings";

export interface SettingsProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  /** The group's heading ("Notifications"). Rendered as an <h2>; the section is labelled by it. */
  title?: ReactNode;
  /** A line under the heading. */
  description?: ReactNode;
  /** No card: rows on the surface they're on (inside a dialog). */
  plain?: boolean;
}

/** A group of settings: a heading, a line of description, then the rows in a card. */
export const Settings = forwardRef<HTMLElement, SettingsProps>(function Settings({ title, description, plain, className, children, ...props }, ref) {
  const titleId = useId();
  return (
    <section ref={ref} className={settingsClass({ plain, className })} aria-labelledby={title ? titleId : undefined} {...props}>
      {title && (
        <h2 id={titleId} className="ayy-settings__title">
          {title}
        </h2>
      )}
      {description && <p className="ayy-settings__description">{description}</p>}
      <div className="ayy-settings__list">{children}</div>
    </section>
  );
});

export interface SettingsRowProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  /** What the setting is. A <label> for htmlFor when given. */
  label: ReactNode;
  /** The control's id: the label points at it, and the hint describes it (give the control aria-describedby={`${id}-hint`}). */
  htmlFor?: string;
  /** One line explaining it. */
  hint?: ReactNode;
  /** Shown instead of the hint, in red, with role="alert". */
  error?: ReactNode;
  /** The control under the text, full width (a textarea, radios). */
  stack?: boolean;
}

/** One setting: label and hint at the start, the control (children) at the end. */
export const SettingsRow = forwardRef<HTMLDivElement, SettingsRowProps>(function SettingsRow(
  { label, htmlFor, hint, error, stack, className, children, ...props },
  ref,
) {
  return (
    <div ref={ref} className={settingsRowClass({ stack, className })} {...props}>
      <div className="ayy-settings__text">
        {htmlFor ? (
          <label className="ayy-settings__label" htmlFor={htmlFor}>
            {label}
          </label>
        ) : (
          <span className="ayy-settings__label">{label}</span>
        )}
        {error ? (
          <p className="ayy-settings__hint ayy-field__error" id={htmlFor ? `${htmlFor}-hint` : undefined} role="alert">
            {error}
          </p>
        ) : hint ? (
          <p className="ayy-settings__hint" id={htmlFor ? `${htmlFor}-hint` : undefined}>
            {hint}
          </p>
        ) : null}
      </div>
      <div className="ayy-settings__control">{children}</div>
    </div>
  );
});

export interface SettingsLinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "type"> {
  label: ReactNode;
  hint?: ReactNode;
  /** The current value, before the chevron ("English"). */
  value?: ReactNode;
  /** Red text and no chevron: Sign out, Delete account. */
  destructive?: boolean;
  /** Opens a page: the row is an <a>. Without it the row is a <button>. */
  href?: string;
  /** Button rows only. */
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

/** A row that opens a sub-page (with href) or runs an action (without): the whole row is one link or button. */
export const SettingsLink = forwardRef<HTMLAnchorElement & HTMLButtonElement, SettingsLinkProps>(function SettingsLink(
  { label, hint, value, destructive, className, ...props },
  ref,
) {
  const content = (
    <>
      <span className="ayy-settings__text">
        <span className="ayy-settings__label">{label}</span>
        {hint && <span className="ayy-settings__hint">{hint}</span>}
      </span>
      {value !== undefined && <span className="ayy-settings__value">{value}</span>}
      {!destructive && <Icon icon={ArrowRight01Icon} directional />}
    </>
  );
  const cls = settingsRowClass({ link: true, destructive, className });
  const { type = "button", disabled, ...rest } = props;
  if (props.href !== undefined) {
    return (
      <a ref={ref} className={cls} {...rest}>
        {content}
      </a>
    );
  }
  return (
    <button ref={ref} type={type} disabled={disabled} className={cls} {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {content}
    </button>
  );
});
