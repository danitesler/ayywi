import { forwardRef, useEffect, useId, useRef, useState, type HTMLAttributes, type InputHTMLAttributes, type ReactNode } from "react";
import { cx } from "../../lib/cx";
import { Search01Icon } from "../../lib/icons";
import { Dialog, DialogContent } from "../dialog/dialog.react";
import { Icon } from "../icon/icon.react";
import { matchShortcut } from "../shortcut/shortcut";
import { Shortcut } from "../shortcut/shortcut.react";
import { connectCommand, type CommandController } from "./command";

interface CommandPartsProps {
  /** The field's accessible name. Default "Search commands". */
  label?: string;
  placeholder?: string;
  /** Shown when nothing matches. Default "No results". */
  emptyText?: ReactNode;
  /** Key hints or actions under the list. */
  footer?: ReactNode;
  /** Filter items by the typed text. Default true; false when you fetch results yourself. */
  filter?: boolean;
  /** Called on every keystroke with the typed text. */
  onSearchChange?: (text: string) => void;
  /** Called after an item runs, with its value. */
  onRun?: (value: string | undefined) => void;
  inputProps?: InputHTMLAttributes<HTMLInputElement>;
  autoFocus?: boolean;
  children?: ReactNode;
}

/** The search field, the list and the footer, wired to their parent element (a div or the dialog). */
function CommandParts({ label = "Search commands", placeholder = "Type a command or search…", emptyText = "No results", footer, filter = true, onSearchChange, onRun, inputProps, autoFocus, children }: CommandPartsProps) {
  const search = useRef<HTMLDivElement>(null);
  const controller = useRef<CommandController | null>(null);
  const handlers = useRef({ onRun });
  handlers.current = { onRun };
  const listId = useId();

  useEffect(() => {
    const root = search.current?.parentElement;
    if (!root) return;
    const c = connectCommand(root, { filter, onSelect: (item) => handlers.current.onRun?.(item.dataset.value) });
    controller.current = c;
    return () => {
      c.destroy();
      controller.current = null;
    };
  }, [filter]);

  // Items change with the app (and with a search API's results): re-read them after every render.
  useEffect(() => {
    controller.current?.refresh();
  });

  return (
    <>
      <div ref={search} className="ayy-command__search">
        <Icon icon={Search01Icon} />
        <input
          type="search"
          className="ayy-command__input"
          role="combobox"
          aria-expanded="true"
          aria-controls={listId}
          aria-autocomplete="list"
          aria-label={label}
          placeholder={placeholder}
          autoComplete="off"
          spellCheck={false}
          autoFocus={autoFocus}
          {...inputProps}
          onInput={(event) => {
            inputProps?.onInput?.(event);
            onSearchChange?.(event.currentTarget.value);
          }}
        />
      </div>
      <div id={listId} className="ayy-command__list" role="listbox" aria-label={label}>
        {children}
        <div className="ayy-command__empty" role="presentation" hidden>
          {emptyText}
        </div>
      </div>
      {footer && <div className="ayy-command__footer">{footer}</div>}
    </>
  );
}

export interface CommandProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  /** The field's and list's accessible name. Default "Search commands". */
  label?: string;
  placeholder?: string;
  /** Shown when nothing matches. Default "No results". */
  emptyText?: ReactNode;
  /** Key hints or actions under the list. */
  footer?: ReactNode;
  /** Filter items by the typed text. Default true; false when you fetch results yourself. */
  filter?: boolean;
  /** Called on every keystroke with the typed text. */
  onSearchChange?: (text: string) => void;
  /** Called after an item runs, with its value. */
  onRun?: (value: string | undefined) => void;
  inputProps?: InputHTMLAttributes<HTMLInputElement>;
  children?: ReactNode;
}

/** A command palette in the page (or a popover): a search field over grouped items, filtered as you type. */
export const Command = forwardRef<HTMLDivElement, CommandProps>(function Command(
  { label, placeholder, emptyText, footer, filter, onSearchChange, onRun, inputProps, className, children, ...props },
  ref,
) {
  return (
    <div ref={ref} className={cx("ayy-command", className)} {...props}>
      <CommandParts {...{ label, placeholder, emptyText, footer, filter, onSearchChange, onRun, inputProps }}>{children}</CommandParts>
    </div>
  );
});

export interface CommandDialogProps {
  /** The field's and list's accessible name. Default "Search commands". */
  label?: string;
  placeholder?: string;
  /** Shown when nothing matches. Default "No results". */
  emptyText?: ReactNode;
  /** Key hints or actions under the list. */
  footer?: ReactNode;
  /** Filter items by the typed text. Default true; false when you fetch results yourself. */
  filter?: boolean;
  /** Called on every keystroke with the typed text. */
  onSearchChange?: (text: string) => void;
  /** Called after an item runs, with its value. */
  onRun?: (value: string | undefined) => void;
  inputProps?: InputHTMLAttributes<HTMLInputElement>;
  children?: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Opens and closes it from anywhere on the page. Default "Mod+K" (⌘K, Ctrl+K); null for none. */
  shortcut?: string | null;
  className?: string;
}

/** The palette in a modal dialog near the top of the screen, opened with ⌘K. Running an item closes it. */
export function CommandDialog({ open: controlled, defaultOpen = false, onOpenChange, shortcut = "Mod+K", className, onRun, ...parts }: CommandDialogProps) {
  const [uncontrolled, setUncontrolled] = useState(defaultOpen);
  const open = controlled ?? uncontrolled;
  const state = useRef({ open, onOpenChange, controlled });
  state.current = { open, onOpenChange, controlled };
  const setOpen = (next: boolean) => {
    if (state.current.controlled === undefined) setUncontrolled(next);
    state.current.onOpenChange?.(next);
  };

  useEffect(() => {
    if (!shortcut) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || !matchShortcut(event, shortcut)) return;
      event.preventDefault();
      setOpen(!state.current.open);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shortcut]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className={cx("ayy-command", className)} hideClose aria-labelledby={undefined} aria-label={parts.label ?? "Search commands"}>
        <CommandParts
          {...parts}
          autoFocus
          onRun={(value) => {
            onRun?.(value);
            setOpen(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}

export interface CommandGroupProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  /** The group's name, shown above its items ("Tasks", "Go to"). */
  heading?: ReactNode;
}

export const CommandGroup = forwardRef<HTMLDivElement, CommandGroupProps>(function CommandGroup({ heading, className, children, ...props }, ref) {
  const id = useId();
  return (
    <div ref={ref} className={cx("ayy-command__group", className)} role="group" aria-labelledby={heading ? id : undefined} {...props}>
      {heading && (
        <div id={id} className="ayy-command__label" role="presentation">
          {heading}
        </div>
      )}
      {children}
    </div>
  );
});

export interface CommandItemProps extends Omit<HTMLAttributes<HTMLDivElement>, "onSelect"> {
  /** Runs on Enter or a click. */
  onSelect?: () => void;
  /** Passed to onRun; stored as data-value. */
  value?: string;
  /** More words that should find it ("add create" for New task). */
  keywords?: string;
  /** An Icon before the text. */
  icon?: ReactNode;
  /** Its shortcut, shown at the end ("Mod+N"). */
  shortcut?: string;
  /** Other text at the end: a list name, a count. */
  meta?: ReactNode;
  disabled?: boolean;
}

export const CommandItem = forwardRef<HTMLDivElement, CommandItemProps>(function CommandItem(
  { onSelect, value, keywords, icon, shortcut, meta, disabled, className, children, onClick, ...props },
  ref,
) {
  const id = useId();
  return (
    <div
      ref={ref}
      id={id}
      className={cx("ayy-command__item", className)}
      role="option"
      data-value={value}
      data-keywords={keywords}
      aria-disabled={disabled || undefined}
      onClick={(event) => {
        onClick?.(event);
        if (!disabled && !event.defaultPrevented) onSelect?.();
      }}
      {...props}
    >
      {icon}
      {children}
      {(shortcut || meta) && (
        <span className="ayy-command__meta">
          {meta}
          {shortcut && <Shortcut keys={shortcut} />}
        </span>
      )}
    </div>
  );
});
