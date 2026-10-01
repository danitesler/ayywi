import { forwardRef, useEffect, useId, useRef, type InputHTMLAttributes, type ReactNode } from "react";
import { cx } from "../../lib/cx";
import { ArrowDown01Icon } from "../../lib/icons";
import { mergeRefs } from "../../lib/refs";
import { Icon } from "../icon/icon.react";
import { inputClass, type InputSize } from "../input/input";
import {
  comboboxClass,
  comboboxEmptyClass,
  comboboxListboxClass,
  comboboxMetaClass,
  comboboxOptionByValue,
  comboboxOptionClass,
  comboboxOptionLabel,
  connectCombobox,
  type ComboboxController,
} from "./combobox";

export interface ComboboxOption {
  value: string;
  label: string;
  /** Extra text at the end: a country, a count. */
  meta?: ReactNode;
  /** An Icon before the label. */
  icon?: ReactNode;
  /** More words that should match ("PT" for Lisbon). */
  keywords?: string;
  disabled?: boolean;
}

export interface ComboboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "defaultValue" | "size" | "onChange"> {
  options: (ComboboxOption | string)[];
  /** The chosen option's value. */
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string, option: ComboboxOption) => void;
  /** Called on every keystroke with the typed text, e.g. to fetch options (pair with filter={false}). */
  onInputChange?: (text: string) => void;
  /** Filter the options by the typed text. Default true. */
  filter?: boolean;
  /** Shown when nothing matches. Default "No matches". */
  emptyText?: ReactNode;
  size?: InputSize;
  /** Form name: a hidden input carries the chosen value. */
  name?: string;
}

const normalise = (option: ComboboxOption | string): ComboboxOption => (typeof option === "string" ? { value: option, label: option } : option);

/** An input that filters a list as you type and picks one option. Label it with <Label htmlFor> on its id. */
export const Combobox = forwardRef<HTMLInputElement, ComboboxProps>(function Combobox(
  { options, value, defaultValue, onValueChange, onInputChange, filter = true, emptyText = "No matches", size, name, className, ...props },
  ref,
) {
  const list = options.map(normalise);
  const input = useRef<HTMLInputElement>(null);
  const listbox = useRef<HTMLUListElement>(null);
  const controller = useRef<ComboboxController | null>(null);
  const handlers = useRef({ onValueChange, onInputChange, list });
  handlers.current = { onValueChange, onInputChange, list };
  const listId = useId();
  const hidden = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!input.current || !listbox.current) return;
    const c = connectCombobox(input.current, listbox.current, {
      filter,
      onSelect: (element) => {
        const option = handlers.current.list.find((o) => o.value === element.dataset.value);
        if (!option) return;
        if (hidden.current) hidden.current.value = option.value;
        handlers.current.onValueChange?.(option.value, option);
      },
    });
    controller.current = c;
    return () => {
      c.destroy();
      controller.current = null;
    };
  }, [filter]);

  // New options (typed search results): re-read them.
  useEffect(() => controller.current?.refresh(), [options]);

  // A value set from outside shows its label.
  useEffect(() => {
    if (value === undefined || !input.current || !listbox.current) return;
    const option = comboboxOptionByValue(listbox.current, value);
    input.current.value = option ? comboboxOptionLabel(option) : "";
    if (hidden.current) hidden.current.value = value;
    controller.current?.refresh();
  }, [value]);

  const initial = list.find((o) => o.value === (value ?? defaultValue));
  return (
    <div className={comboboxClass}>
      <input
        ref={mergeRefs(ref, input)}
        type="text"
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={false}
        aria-controls={listId}
        autoComplete="off"
        className={cx(inputClass({ size }), className)}
        defaultValue={initial?.label ?? ""}
        onInput={(event) => handlers.current.onInputChange?.(event.currentTarget.value)}
        {...props}
      />
      <Icon icon={ArrowDown01Icon} />
      <ul ref={listbox} id={listId} className={comboboxListboxClass} role="listbox" popover="manual">
        {list.map((option) => (
          <li
            key={option.value}
            role="option"
            className={comboboxOptionClass}
            data-value={option.value}
            data-label={option.label}
            data-keywords={option.keywords}
            aria-disabled={option.disabled || undefined}
          >
            {option.icon}
            {option.label}
            {option.meta && <span className={comboboxMetaClass}>{option.meta}</span>}
          </li>
        ))}
        <li className={comboboxEmptyClass} role="none" hidden>
          {emptyText}
        </li>
      </ul>
      {name && <input ref={hidden} type="hidden" name={name} defaultValue={value ?? defaultValue ?? ""} />}
    </div>
  );
});
