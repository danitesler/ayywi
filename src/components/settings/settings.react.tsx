import {
  createContext,
  forwardRef,
  useContext,
  useId,
  useState,
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
  type ChangeEvent,
  type HTMLAttributes,
  type InputHTMLAttributes,
  type LabelHTMLAttributes,
  type ReactNode,
} from "react";
import { cx } from "../../lib/cx";
import { ArrowRight01Icon } from "../../lib/icons";
import { Icon } from "../icon/icon.react";
import type { DensityMode, ThemeMode } from "../../theme";
import {
  settingsCaptionClass,
  settingsClass,
  settingsOptionClass,
  settingsPickerClass,
  settingsPreviewClass,
  settingsRowClass,
  settingsScreenClass,
  type SettingsScreenVariant,
} from "./settings";

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

interface PickerContextValue {
  name: string;
  value: string | undefined;
  disabled?: boolean;
  select: (value: string) => void;
}

const PickerContext = createContext<PickerContextValue | null>(null);

export interface SettingsPickerProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue"> {
  /** Shared radio name (for forms). Generated if omitted. */
  name?: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
}

/** Appearance choices as pictures (theme, corners, font): a role="radiogroup" of SettingsOptions. Give it an aria-label. */
export const SettingsPicker = forwardRef<HTMLDivElement, SettingsPickerProps>(function SettingsPicker(
  { name, value: controlled, defaultValue, onValueChange, disabled, className, children, ...props },
  ref,
) {
  const generated = useId();
  const [uncontrolled, setUncontrolled] = useState(defaultValue);
  const value = controlled ?? uncontrolled;
  const select = (next: string) => {
    if (controlled === undefined) setUncontrolled(next);
    onValueChange?.(next);
  };
  return (
    <PickerContext.Provider value={{ name: name ?? generated, value, disabled, select }}>
      <div ref={ref} role="radiogroup" aria-disabled={disabled || undefined} className={cx(settingsPickerClass, className)} {...props}>
        {children}
      </div>
    </PickerContext.Provider>
  );
});

export interface SettingsOptionProps extends Omit<LabelHTMLAttributes<HTMLLabelElement>, "onChange"> {
  value: string;
  /** The caption under the picture ("Dark"). Also the radio's name. */
  label: ReactNode;
  /** What goes in the picture: a SettingsScreen (the default) or a short sample ("Aa" in a font). */
  preview?: ReactNode;
  disabled?: boolean;
  /** Props for the native radio. */
  inputProps?: Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "value" | "name" | "checked" | "disabled">;
}

/** One picture in a SettingsPicker: a <label> around a hidden native radio, the picture and its caption. */
export const SettingsOption = forwardRef<HTMLLabelElement, SettingsOptionProps>(function SettingsOption(
  { value, label, preview, disabled, inputProps, className, ...props },
  ref,
) {
  const group = useContext(PickerContext);
  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    inputProps?.onChange?.(event);
    if (event.currentTarget.checked) {
      group?.select(value);
      try {
        event.currentTarget.closest<HTMLElement>(":popover-open")?.hidePopover();
      } catch {
        // Not in an open popover.
      }
    }
  };
  return (
    <label ref={ref} className={cx(settingsOptionClass, className)} {...props}>
      <input
        {...inputProps}
        type="radio"
        name={group?.name}
        value={value}
        checked={group ? group.value === value : undefined}
        disabled={disabled ?? group?.disabled}
        onChange={onChange}
      />
      <span className={settingsPreviewClass} aria-hidden="true">
        {preview ?? <SettingsScreen />}
      </span>
      <span className={settingsCaptionClass}>{label}</span>
    </label>
  );
});

export interface SettingsScreenProps extends HTMLAttributes<HTMLSpanElement> {
  /** What it draws: "app" (the default; theme, corners, direction), "rows" (a list as tall as the density makes it) or
   *  "brand" (where the primary colour shows). */
  variant?: SettingsScreenVariant;
  /** The theme it's drawn in. "system": half light, half dark. Omit to use the one it sits in. */
  theme?: ThemeMode;
  /** The density it's drawn in. "auto": half compact, half touch. Omit to use the one it sits in. */
  density?: DensityMode;
}

/** A miniature screen drawn from tokens, for a SettingsOption's picture. Brand and corner tokens around it show too. */
export const SettingsScreen = forwardRef<HTMLSpanElement, SettingsScreenProps>(function SettingsScreen({ variant, theme, density, className, ...props }, ref) {
  const screen = (t: ThemeMode | undefined, d: DensityMode | undefined, key?: string) => (
    <span
      key={key}
      ref={key === "second" ? undefined : ref}
      className={cx(settingsScreenClass, variant && variant !== "app" && `${settingsScreenClass}--${variant}`, className)}
      data-theme={t === "system" ? undefined : t}
      data-density={d === "auto" ? undefined : d}
      aria-hidden="true"
      {...props}
    />
  );
  if (theme === "system") return <>{[screen("light", density, "first"), screen("dark", density, "second")]}</>;
  if (density === "auto") return <>{[screen(theme, "compact", "first"), screen(theme, "touch", "second")]}</>;
  return screen(theme, density);
});
