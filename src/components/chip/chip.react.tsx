import {
  forwardRef,
  type ButtonHTMLAttributes,
  type ChangeEvent,
  type HTMLAttributes,
  type InputHTMLAttributes,
  type LabelHTMLAttributes,
  type ReactNode,
} from "react";
import { Cancel01Icon } from "../../lib/icons";
import { Icon } from "../icon/icon.react";
import { chipClass, chipCountClass, chipGroupClass, chipRemoveClass } from "./chip";

export interface ChipProps extends Omit<LabelHTMLAttributes<HTMLLabelElement>, "onChange"> {
  /** "checkbox" (default) for filters that combine, "radio" for one choice in a group (give them one name). */
  type?: "checkbox" | "radio";
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  name?: string;
  value?: string;
  disabled?: boolean;
  /** How many results the filter has, after the label. */
  count?: ReactNode;
  /** Props for the native input inside the label. */
  inputProps?: Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "checked" | "defaultChecked" | "name" | "value" | "disabled">;
}

/** A filter or choice chip: a <label> around a visually hidden native checkbox (or radio). Children are the label and an optional Icon. */
export const Chip = forwardRef<HTMLLabelElement, ChipProps>(function Chip(
  { type = "checkbox", checked, defaultChecked, onCheckedChange, name, value, disabled, count, inputProps, className, children, ...props },
  ref,
) {
  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    inputProps?.onChange?.(event);
    onCheckedChange?.(event.currentTarget.checked);
  };
  return (
    <label ref={ref} className={chipClass({ className })} {...props}>
      <input
        {...inputProps}
        type={type}
        checked={checked}
        defaultChecked={defaultChecked}
        name={name}
        value={value}
        disabled={disabled}
        onChange={onChange}
      />
      {children}
      {count !== undefined && <span className={chipCountClass}>{count}</span>}
    </label>
  );
});

export interface ChipButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** On or off: aria-pressed. */
  pressed: boolean;
  onPressedChange?: (pressed: boolean) => void;
  count?: ReactNode;
}

/** A toggle chip for apps that filter as you click: <button aria-pressed>. */
export const ChipButton = forwardRef<HTMLButtonElement, ChipButtonProps>(function ChipButton(
  { pressed, onPressedChange, count, type = "button", className, children, onClick, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      aria-pressed={pressed}
      className={chipClass({ className })}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) onPressedChange?.(!pressed);
      }}
      {...props}
    >
      {children}
      {count !== undefined && <span className={chipCountClass}>{count}</span>}
    </button>
  );
});

export interface ChipRemovableProps extends HTMLAttributes<HTMLSpanElement> {
  onRemove: () => void;
  /** Accessible name of the remove button. Default: "Remove " + the chip's text when it's a string. */
  removeLabel?: string;
}

/** An active filter ("Status: Open") with a remove button. */
export const ChipRemovable = forwardRef<HTMLSpanElement, ChipRemovableProps>(function ChipRemovable(
  { onRemove, removeLabel, className, children, ...props },
  ref,
) {
  return (
    <span ref={ref} className={chipClass({ removable: true, className })} {...props}>
      {children}
      <button
        type="button"
        className={chipRemoveClass}
        aria-label={removeLabel ?? (typeof children === "string" ? `Remove ${children}` : "Remove")}
        onClick={onRemove}
      >
        <Icon icon={Cancel01Icon} />
      </button>
    </span>
  );
});

export interface ChipGroupProps extends HTMLAttributes<HTMLDivElement> {
  /** One line that scrolls sideways instead of wrapping. */
  scroll?: boolean;
}

/** A row of chips: role="group" (give it an aria-label), or pass role="radiogroup" for radio chips. */
export const ChipGroup = forwardRef<HTMLDivElement, ChipGroupProps>(function ChipGroup({ scroll, role = "group", className, ...props }, ref) {
  return <div ref={ref} role={role} className={chipGroupClass({ scroll, className })} {...props} />;
});
