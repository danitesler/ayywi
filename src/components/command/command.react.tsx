import {
  Children,
  createContext,
  forwardRef,
  isValidElement,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type HTMLAttributes,
  type InputHTMLAttributes,
  type ReactElement,
  type ReactNode,
} from "react";
import { cx } from "../../lib/cx";
import { Search01Icon } from "../../lib/icons";
import { Dialog, DialogContent } from "../dialog/dialog.react";
import { Icon } from "../icon/icon.react";
import { matchShortcut } from "../shortcut/shortcut";
import { Shortcut } from "../shortcut/shortcut.react";
import { commandScore, connectCommand, type CommandController } from "./command";

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

// The typed text, for ranking (null while the palette doesn't filter: then results come in the app's order).
const RankContext = createContext<string | null>(null);

/** Plain text of a title or description: a string, or an element with a string `text` prop (TextHighlight). */
function plainText(node: ReactNode): string | undefined {
  if (typeof node === "string") return node;
  if (isValidElement(node) && typeof node.props === "object" && node.props !== null && typeof (node.props as { text?: unknown }).text === "string") {
    return (node.props as { text: string }).text;
  }
  return undefined;
}

/** How well a CommandItem element matches: the same score <ayy-command> sorts by. */
function itemScore(element: ReactElement<CommandItemProps>, query: string): number {
  const { children, description, keywords } = element.props;
  return commandScore(plainText(children) ?? "", plainText(description) ?? "", keywords ?? "", query);
}

/**
 * Children with the elements of `type` sorted by `score` (best first, ties in their order), each in a slot one of
 * them held, so anything else (a wrapper, a separator) stays where it was. React moves its own nodes, so keyed
 * children reorder safely, which moving them in the DOM behind React's back did not.
 */
function ranked<P>(children: ReactNode[], type: unknown, score: (element: ReactElement<P>) => number): ReactNode[] {
  const all = [...children];
  const slots = all.flatMap((child, i) => (isValidElement(child) && child.type === type ? [i] : []));
  const order = slots
    .map((i, n) => ({ child: all[i] as ReactElement<P>, n, score: score(all[i] as ReactElement<P>) }))
    .sort((a, b) => b.score - a.score || a.n - b.n);
  slots.forEach((slot, n) => (all[slot] = order[n].child));
  return all;
}

/** The search field, the list and the footer, wired to their parent element (a div or the dialog). */
function CommandParts({ label = "Search commands", placeholder = "Type a command or search…", emptyText = "No results", footer, filter = true, onSearchChange, onRun, inputProps, autoFocus, children }: CommandPartsProps) {
  const search = useRef<HTMLDivElement>(null);
  const controller = useRef<CommandController | null>(null);
  const handlers = useRef({ onRun, onSearchChange });
  handlers.current = { onRun, onSearchChange };
  const listId = useId();
  const [query, setQuery] = useState("");
  const rankedFor = useRef("");

  useEffect(() => {
    const root = search.current?.parentElement;
    if (!root) return;
    const c = connectCommand(root, {
      filter,
      // React owns the items: moving its nodes would make its next update misplace or lose them.
      reorder: false,
      onSelect: (item) => handlers.current.onRun?.(item.dataset.value),
      // No onSearchChange here: the input's own onInput below reports the text (reset() fires an input event too).
      // State set from this native listener would re-render before React's onChange and undo a controlled value.
    });
    controller.current = c;
    return () => {
      c.destroy();
      controller.current = null;
    };
  }, [filter]);

  // Items change with the app (and with a search API's results): re-read them after every render. A new query was
  // ranked by this render, so its best match is highlighted.
  useEffect(() => {
    const changed = rankedFor.current !== query;
    rankedFor.current = query;
    controller.current?.refresh(changed);
  });

  const rank = filter && query.trim() ? query : null;

  return (
    <>
      <div ref={search} className="ayy-command__search">
        <Icon icon={Search01Icon} name="search" />
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
            setQuery(event.currentTarget.value);
            onSearchChange?.(event.currentTarget.value);
          }}
        />
      </div>
      <div id={listId} className="ayy-command__list" role="listbox" aria-label={label}>
        <RankContext.Provider value={rank}>
          {rank === null
            ? Children.toArray(children)
            : ranked<CommandGroupProps>(
                ranked<CommandItemProps>(Children.toArray(children), CommandItem, (item) => itemScore(item, rank)),
                CommandGroup,
                (group) =>
                  Math.max(
                    0,
                    ...Children.toArray(group.props.children).map((child) =>
                      isValidElement(child) && child.type === CommandItem ? itemScore(child as ReactElement<CommandItemProps>, rank) : 0,
                    ),
                  ),
              )}
        </RankContext.Provider>
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
export const CommandDialog = forwardRef<HTMLDialogElement, CommandDialogProps>(function CommandDialog(
  { open: controlled, defaultOpen = false, onOpenChange, shortcut = "Mod+K", className, onRun, ...parts },
  ref,
) {
  const [uncontrolled, setUncontrolled] = useState(defaultOpen);
  const open = controlled ?? uncontrolled;
  const state = useRef({ open, onOpenChange, controlled });
  state.current = { open, onOpenChange, controlled };
  const setOpen = (next: boolean) => {
    if (state.current.controlled === undefined) setUncontrolled(next);
    state.current.onOpenChange?.(next);
  };

  const [mountKey, setMountKey] = useState(0);
  const prevOpen = useRef(open);
  useEffect(() => {
    if (prevOpen.current !== open) {
      prevOpen.current = open;
      setMountKey((k) => k + 1);
    }
  }, [open]);

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
      <DialogContent
        ref={ref}
        className={cx("ayy-command", className)}
        hideClose
        aria-labelledby={undefined}
        aria-label={parts.label ?? "Search commands"}
      >
        <CommandParts
          key={mountKey}
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
});

export interface CommandGroupProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  /** The group's name, shown above its items ("Tasks", "Go to"). */
  heading?: ReactNode;
}

export const CommandGroup = forwardRef<HTMLDivElement, CommandGroupProps>(function CommandGroup({ heading, className, children, ...props }, ref) {
  const id = useId();
  const rank = useContext(RankContext);
  return (
    <div ref={ref} className={cx("ayy-command__group", className)} role="group" aria-labelledby={heading ? id : undefined} {...props}>
      {heading && (
        <div id={id} className="ayy-command__label" role="presentation">
          {heading}
        </div>
      )}
      {rank === null ? Children.toArray(children) : ranked<CommandItemProps>(Children.toArray(children), CommandItem, (item) => itemScore(item, rank))}
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
  /** Short one-line summary displayed under the title. */
  description?: ReactNode;
  /** An Icon before the text. */
  icon?: ReactNode;
  /** Its shortcut, shown at the end ("Mod+N"). */
  shortcut?: string;
  /** Other text at the end: a list name, a count. */
  meta?: ReactNode;
  disabled?: boolean;
}

export const CommandItem = forwardRef<HTMLDivElement, CommandItemProps>(function CommandItem(
  { onSelect, value, keywords, description, icon, shortcut, meta, disabled, className, children, onClick, ...props },
  ref,
) {
  const id = useId();
  const titleText = plainText(children);
  const descText = plainText(description);

  return (
    <div
      ref={ref}
      id={id}
      className={cx("ayy-command__item", className)}
      role="option"
      data-value={value}
      data-keywords={keywords}
      data-title={titleText}
      data-description={descText}
      aria-disabled={disabled || undefined}
      onClick={(event) => {
        onClick?.(event);
        if (!disabled && !event.defaultPrevented) onSelect?.();
      }}
      {...props}
    >
      {icon}
      {description !== undefined ? (
        <div className="ayy-command__content">
          <div className="ayy-command__title">{children}</div>
          <div className="ayy-command__description">{description}</div>
        </div>
      ) : (
        <span className="ayy-command__title">{children}</span>
      )}
      {(shortcut || meta) && (
        <span className="ayy-command__meta">
          {meta}
          {shortcut && <Shortcut keys={shortcut} />}
        </span>
      )}
    </div>
  );
});
