import { forwardRef, useEffect, useId, useRef, useState, type InputHTMLAttributes, type ReactNode } from "react";
import { Cancel01Icon } from "../../lib/icons";
import { mergeRefs } from "../../lib/refs";
import { connectCombobox, type ComboboxController } from "../combobox/combobox";
import { Icon } from "../icon/icon.react";
import type { InputSize } from "../input/input";
import { addTags, splitTags, tagInputClass } from "./tag-input";

export interface TagInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "defaultValue" | "size" | "onChange"> {
  /** The tags. */
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (values: string[]) => void;
  /** Known tags offered in a list as you type. Ones already added are shown disabled. */
  suggestions?: string[];
  /** Shown in the suggestions list when nothing matches. Default "Press Enter to add it". */
  emptyText?: ReactNode;
  /** Most tags allowed; the field stops adding at that many. */
  max?: number;
  /** Keep tags that differ only in case apart. Default false. */
  caseSensitive?: boolean;
  size?: InputSize;
  /** Form name: a hidden input per tag carries it. */
  name?: string;
  /** Accessible name of a tag's × button. Default "Remove <tag>". Translate it. */
  removeLabel?: (value: string) => string;
  /** Class on the field (the root), not the inner input. */
  className?: string;
}

/** A field that turns typed text into removable tags. Give the inner input a <Label htmlFor> through id. */
export const TagInput = forwardRef<HTMLInputElement, TagInputProps>(function TagInput(
  {
    value,
    defaultValue = [],
    onValueChange,
    suggestions,
    emptyText = "Press Enter to add it",
    max,
    caseSensitive,
    size,
    name,
    removeLabel = (v) => `Remove ${v}`,
    className,
    disabled,
    onKeyDown,
    onBlur,
    onPaste,
    onInput,
    ...props
  },
  ref,
) {
  const [uncontrolled, setUncontrolled] = useState(defaultValue);
  const tags = value ?? uncontrolled;
  const [said, setSaid] = useState("");
  const input = useRef<HTMLInputElement>(null);
  const listbox = useRef<HTMLUListElement>(null);
  const combobox = useRef<ComboboxController | null>(null);
  const listId = useId();
  const latest = useRef({ tags, add: (_: string) => {} });

  const commit = (next: string[], spoken: string) => {
    if (value === undefined) setUncontrolled(next);
    onValueChange?.(next);
    setSaid(spoken);
  };

  const add = (text: string) => {
    const current = latest.current.tags;
    const next = addTags(current, splitTags(text), { max, caseSensitive });
    if (input.current) input.current.value = "";
    if (next.length > current.length) commit(next, next.slice(current.length).map((t) => `${t} added`).join(", "));
  };
  const remove = (index: number) => {
    const removed = tags[index];
    commit(
      tags.filter((_, i) => i !== index),
      `${removed} removed`,
    );
    input.current?.focus();
  };
  latest.current = { tags, add };

  const hasSuggestions = suggestions !== undefined;
  useEffect(() => {
    if (!hasSuggestions || !input.current || !listbox.current) return;
    const c = connectCombobox(input.current, listbox.current, {
      onSelect: (option) => latest.current.add(option.dataset.value ?? ""),
    });
    combobox.current = c;
    return () => {
      c.destroy();
      combobox.current = null;
    };
  }, [hasSuggestions]);
  useEffect(() => combobox.current?.refresh(), [suggestions, tags]);

  const taken = new Set(tags.map((t) => (caseSensitive ? t : t.toLocaleLowerCase())));
  return (
    <div
      className={tagInputClass({ size, suggestions: hasSuggestions, className })}
      onClick={(event) => {
        if (event.target === event.currentTarget) input.current?.focus();
      }}
    >
      {tags.map((tag, i) => (
        <span key={tag} className="ayy-chip ayy-chip--removable ayy-tag-input__tag" data-value={tag}>
          {tag}
          <button type="button" className="ayy-chip__remove" aria-label={removeLabel(tag)} disabled={disabled} onClick={() => remove(i)}>
            <Icon icon={Cancel01Icon} />
          </button>
        </span>
      ))}
      <input
        ref={mergeRefs(ref, input)}
        type="text"
        className="ayy-tag-input__input"
        autoComplete="off"
        enterKeyHint="enter"
        disabled={disabled}
        aria-controls={hasSuggestions ? listId : undefined}
        {...props}
        onKeyDown={(event) => {
          onKeyDown?.(event);
          const el = event.currentTarget;
          if (event.defaultPrevented || event.nativeEvent.isComposing) return;
          if ((event.key === "Enter" || event.key === ",") && el.value.trim()) {
            event.preventDefault();
            add(el.value);
          } else if (event.key === "Backspace" && el.value === "" && el.selectionStart === 0 && tags.length) {
            event.preventDefault();
            remove(tags.length - 1);
          }
        }}
        onInput={(event) => {
          onInput?.(event);
          if (event.currentTarget.value.includes(",")) add(event.currentTarget.value);
        }}
        onPaste={(event) => {
          onPaste?.(event);
          const text = event.clipboardData.getData("text");
          if (event.defaultPrevented || !/[,\n]/.test(text)) return;
          event.preventDefault();
          add(event.currentTarget.value + text);
        }}
        onBlur={(event) => {
          onBlur?.(event);
          if (listbox.current?.contains(event.relatedTarget as Node)) return;
          if (event.currentTarget.value.trim()) add(event.currentTarget.value);
        }}
      />
      {hasSuggestions && (
        <ul ref={listbox} id={listId} className="ayy-combobox__listbox" role="listbox" popover="manual">
          {suggestions.map((s) => (
            <li
              key={s}
              role="option"
              className="ayy-combobox__option"
              data-value={s}
              aria-disabled={taken.has(caseSensitive ? s : s.toLocaleLowerCase()) || undefined}
            >
              {s}
            </li>
          ))}
          <li className="ayy-combobox__empty" role="none" hidden>
            {emptyText}
          </li>
        </ul>
      )}
      {name && tags.map((tag) => <input key={tag} type="hidden" name={name} value={tag} />)}
      <span className="ayy-sr-only" role="status">
        {said}
      </span>
    </div>
  );
});
