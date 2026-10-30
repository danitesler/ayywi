import { forwardRef, useEffect, useId, useRef, useState, type InputHTMLAttributes, type ReactNode } from "react";
import { Cancel01Icon, CancelCircleIcon } from "../../lib/icons";
import { mergeRefs } from "../../lib/refs";
import { Icon } from "../icon/icon.react";
import type { InputSize } from "../input/input";
import { connectRecordPicker, defaultCreateLabel, recordPickerClass, type RecordPickerController } from "./record-picker";

export interface RecordPickerOption {
  /** The record's value, kept in the chip's data-value and the form. */
  id: string;
  label: string;
  /** A second line in the list: an email, a role, a project key. */
  description?: ReactNode;
  /** An Icon before the label. */
  icon?: ReactNode;
  /** More words that should match ("PT" for Lisbon). */
  keywords?: string;
  disabled?: boolean;
}

export interface RecordPickerProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "defaultValue" | "size" | "onChange"> {
  /** The records people can pick. */
  options: RecordPickerOption[];
  /** The picked records' ids. */
  value?: string[];
  defaultValue?: string[];
  /** Called with every picked id and its option after a pick, a removal or a clear. */
  onValueChange?: (ids: string[], options: RecordPickerOption[]) => void;
  /** Pick several records as chips; the list stays open after each pick. Default false. */
  multiple?: boolean;
  /** Offer a create row for the typed text when no record matches. */
  creatable?: boolean;
  /** Called with the typed text when the create row is picked. Return the new option to select it, or nothing and update options and value yourself. */
  onCreate?: (label: string) => RecordPickerOption | void;
  /** The create row's text. Default "Create “<label>”". */
  createLabel?: (label: string) => string;
  /** Shown in the list when nothing matches. Default "No matches". */
  emptyText?: ReactNode;
  size?: InputSize;
  /** Form name: a hidden input per picked id carries it. */
  name?: string;
  /** Show a button that clears every picked record. Default true. */
  clearable?: boolean;
  /** The clear button's accessible name. Default "Clear". */
  clearLabel?: string;
  /** A chip's × button's accessible name. Default "Remove <label>". */
  removeLabel?: (option: RecordPickerOption) => string;
  /** Class on the field (the root), not the inner input. */
  className?: string;
}

/** A tag field whose chips are records from a list: one person to assign, many labels to apply. */
export const RecordPicker = /* @__PURE__ */ forwardRef<HTMLInputElement, RecordPickerProps>(function RecordPicker(
  {
    options,
    value,
    defaultValue = [],
    onValueChange,
    multiple = false,
    creatable = false,
    onCreate,
    createLabel,
    emptyText = "No matches",
    size,
    name,
    clearable = true,
    clearLabel = "Clear",
    removeLabel = (option) => `Remove ${option.label}`,
    className,
    disabled,
    ...props
  },
  ref,
) {
  const [uncontrolled, setUncontrolled] = useState<string[]>(defaultValue);
  const ids = value ?? uncontrolled;
  const [created, setCreated] = useState<RecordPickerOption[]>([]);
  const pool = [...options, ...created.filter((made) => !options.some((option) => option.id === made.id))];
  const chosen = ids.map((id) => pool.find((option) => option.id === id)).filter((option): option is RecordPickerOption => Boolean(option));
  const input = useRef<HTMLInputElement>(null);
  const listbox = useRef<HTMLUListElement>(null);
  const controller = useRef<RecordPickerController | null>(null);
  const listId = useId();
  const latest = useRef({
    ids,
    pool,
    onValueChange,
    multiple,
    onCreate,
    createLabel,
    select: (_option: RecordPickerOption) => {},
    create: (_label: string) => {},
    remove: (_id: string) => {},
    clear: () => {},
  });

  const commit = (next: string[], extra: RecordPickerOption[] = []) => {
    const current = latest.current.ids;
    if (next.length === current.length && next.every((id, index) => id === current[index])) return;
    if (value === undefined) setUncontrolled(next);
    const all = [...pool, ...extra];
    latest.current.onValueChange?.(
      next,
      next.map((id) => all.find((option) => option.id === id)).filter((option): option is RecordPickerOption => Boolean(option)),
    );
  };

  const select = (option: RecordPickerOption) => {
    const current = latest.current.ids;
    commit(latest.current.multiple ? (current.includes(option.id) ? current.filter((id) => id !== option.id) : [...current, option.id]) : [option.id]);
  };

  const remove = (id: string) => {
    commit(latest.current.ids.filter((each) => each !== id));
    input.current?.focus();
  };

  const clear = () => {
    commit([]);
    input.current?.focus();
  };

  const create = (label: string) => {
    const option = latest.current.onCreate?.(label);
    if (!option) return;
    setCreated((made) => [...made.filter((each) => each.id !== option.id), option]);
    const current = latest.current.ids;
    const next = latest.current.multiple ? [...current.filter((id) => id !== option.id), option.id] : [option.id];
    commit(next, [option]);
  };

  latest.current = { ids, pool, onValueChange, multiple, onCreate, createLabel, select, create, remove, clear };

  useEffect(() => {
    if (!input.current || !listbox.current) return;
    const root = input.current.closest<HTMLElement>(".ayy-record-picker");
    if (!root) return;
    const current = connectRecordPicker(root, {
      multiple,
      creatable,
      createLabel: (label) => (latest.current.createLabel ?? defaultCreateLabel)(label),
      // The controller clears the query; React owns the chips and aria-selected.
      onSelect: (element) => {
        const option = latest.current.pool.find((each) => each.id === element.dataset.value);
        if (option) latest.current.select(option);
      },
      onCreate: (label) => latest.current.create(label),
      onRemoveLast: () => {
        const last = latest.current.ids.at(-1);
        if (last !== undefined) latest.current.remove(last);
      },
      onClear: () => latest.current.clear(),
    });
    controller.current = current;
    return () => {
      current.destroy();
      controller.current = null;
    };
  }, [multiple, creatable, clearable]);

  // New options (a search result, a created record) or a new value: re-read the list.
  useEffect(() => controller.current?.refresh(), [options, ids, created]);

  return (
    <div className={recordPickerClass({ multiple, size, className })}>
      {chosen.map((option) => (
        <span key={option.id} className="ayy-chip ayy-chip--removable ayy-tag-input__tag ayy-record-picker__tag" data-value={option.id}>
          <span className="ayy-record-picker__tag-label">{option.label}</span>
          <button type="button" className="ayy-chip__remove" aria-label={removeLabel(option)} disabled={disabled} onClick={() => remove(option.id)}>
            <Icon icon={Cancel01Icon} name="x" />
          </button>
        </span>
      ))}
      <input
        ref={mergeRefs(ref, input)}
        {...props}
        type="text"
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={false}
        aria-controls={listId}
        autoComplete="off"
        disabled={disabled}
        className="ayy-tag-input__input ayy-record-picker__input"
      />
      {clearable && (
        <button type="button" className="ayy-record-picker__clear" aria-label={clearLabel} disabled={disabled}>
          <Icon icon={CancelCircleIcon} name="circle-x" />
        </button>
      )}
      <ul
        ref={listbox}
        id={listId}
        className="ayy-combobox__listbox ayy-record-picker__listbox"
        role="listbox"
        aria-multiselectable={multiple || undefined}
        popover="manual"
      >
        {pool.map((option) => (
          <li
            key={option.id}
            role="option"
            className="ayy-combobox__option ayy-record-picker__option"
            data-value={option.id}
            data-label={option.label}
            data-keywords={option.keywords}
            data-active="false"
            aria-selected={ids.includes(option.id)}
            aria-disabled={option.disabled || undefined}
          >
            {option.icon}
            <span className="ayy-record-picker__option-body">
              <span className="ayy-record-picker__option-label">{option.label}</span>
              {option.description !== undefined && <span className="ayy-record-picker__description">{option.description}</span>}
            </span>
          </li>
        ))}
        {creatable && (
          <li role="option" className="ayy-combobox__option ayy-record-picker__create" data-create="" hidden>
            <span className="ayy-record-picker__create-label" />
          </li>
        )}
        <li role="none" className="ayy-combobox__empty ayy-record-picker__empty" hidden>
          {emptyText}
        </li>
      </ul>
      {name && ids.map((id) => <input key={id} type="hidden" name={name} value={id} disabled={disabled} />)}
    </div>
  );
});
