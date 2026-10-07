import { forwardRef, useRef, useState, type FormHTMLAttributes, type InputHTMLAttributes } from "react";
import { Cancel01Icon, Search01Icon } from "../../lib/icons";
import { mergeRefs } from "../../lib/refs";
import { Icon } from "../icon/icon.react";
import { searchBarClass } from "./search-bar";

export interface SearchBarProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "defaultValue" | "size" | "onChange" | "onSubmit"> {
  value?: string;
  defaultValue?: string;
  /** Every keystroke, and "" when cleared. */
  onValueChange?: (value: string) => void;
  /** Enter (the keyboard's Search key). */
  onSearch?: (value: string) => void;
  /** Shows a Cancel button after the field that runs this (close the search, go back). */
  onCancel?: () => void;
  /** The field's accessible name. Default "Search". Translate it. */
  label?: string;
  /** The clear button's name. Default "Clear search". */
  clearLabel?: string;
  /** The Cancel button's text. Default "Cancel". */
  cancelText?: string;
  size?: "md" | "lg";
  /** Props for the <form role="search">. */
  formProps?: FormHTMLAttributes<HTMLFormElement>;
}

/** A rounded search field with a clear button (and Cancel), in a <form role="search">. Other props go on the input. */
export const SearchBar = forwardRef<HTMLInputElement, SearchBarProps>(function SearchBar(
  {
    value,
    defaultValue = "",
    onValueChange,
    onSearch,
    onCancel,
    label = "Search",
    clearLabel = "Clear search",
    cancelText = "Cancel",
    size,
    placeholder = "Search",
    formProps,
    className,
    ...props
  },
  ref,
) {
  const [uncontrolled, setUncontrolled] = useState(defaultValue);
  const text = value ?? uncontrolled;
  const input = useRef<HTMLInputElement>(null);
  const set = (next: string) => {
    if (value === undefined) setUncontrolled(next);
    onValueChange?.(next);
  };
  return (
    <form
      role="search"
      {...formProps}
      className={searchBarClass({ size, className: formProps?.className })}
      onSubmit={(event) => {
        formProps?.onSubmit?.(event);
        event.preventDefault();
        onSearch?.(text);
      }}
    >
      <div className="ayy-search-bar__field">
        <Icon icon={Search01Icon} />
        <input
          ref={mergeRefs(ref, input)}
          type="search"
          enterKeyHint="search"
          className={className ? `ayy-search-bar__input ${className}` : "ayy-search-bar__input"}
          aria-label={label}
          placeholder={placeholder}
          value={text}
          onChange={(event) => set(event.currentTarget.value)}
          {...props}
        />
        <button
          type="button"
          className="ayy-search-bar__clear"
          aria-label={clearLabel}
          hidden={!text}
          onClick={(event) => {
            event.preventDefault();
            set("");
            input.current?.focus();
          }}
        >
          <Icon icon={Cancel01Icon} />
        </button>
      </div>
      {onCancel && (
        <button type="button" className="ayy-search-bar__cancel" onClick={onCancel}>
          {cancelText}
        </button>
      )}
    </form>
  );
});
