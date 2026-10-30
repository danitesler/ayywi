import { forwardRef, useEffect, useRef, useState, type HTMLAttributes, type ReactNode } from "react";
import {
  ArrowLeft01Icon,
  ArrowLeftDoubleIcon,
  ArrowRight01Icon,
  ArrowRightDoubleIcon,
  Search01Icon,
} from "../../lib/icons";
import { mergeRefs } from "../../lib/refs";
import { Button } from "../button/button.react";
import { Checkbox } from "../checkbox/checkbox.react";
import { Icon } from "../icon/icon.react";
import {
  connectTransferList,
  transferListActionsClass,
  transferListClass,
  transferListCountClass,
  transferListDescriptionClass,
  transferListEmptyClass,
  transferListFilterClass,
  transferListHeaderClass,
  transferListItemBodyClass,
  transferListItemClass,
  transferListLabelClass,
  transferListListClass,
  transferListPaneClass,
  transferListSearchClass,
  transferListTitleClass,
  type TransferDirection,
  type TransferListController,
} from "./transfer-list";

export interface TransferListOption {
  id: string;
  label: string;
  description?: ReactNode;
  keywords?: string;
  disabled?: boolean;
}

export interface TransferListProps extends Omit<HTMLAttributes<HTMLDivElement>, "defaultValue" | "onChange"> {
  /** All items available to move between the two panes. */
  options: TransferListOption[];
  /** Controlled IDs currently in the target (selected) pane. */
  value?: string[];
  /** Initial IDs in the target pane for uncontrolled usage. */
  defaultValue?: string[];
  /** Called whenever items move into or out of the target pane. */
  onValueChange?: (value: string[]) => void;
  /** Heading of the source (available) pane. Default `"Available"`. */
  sourceTitle?: string;
  /** Heading of the target (selected) pane. Default `"Selected"`. */
  targetTitle?: string;
  /** Show a filter input at the top of each pane. Default `false`. */
  searchable?: boolean;
  /** Placeholder for the per-pane filter input. Default `"Filter…"`. */
  searchPlaceholder?: string;
  /** Show "Move all" buttons alongside "Move selected". Default `true`. */
  showMoveAll?: boolean;
  /** Message when the source pane has no items. Default `"No items available"`. */
  sourceEmptyText?: string;
  /** Message when the target pane has no items. Default `"None selected"`. */
  targetEmptyText?: string;
  disabled?: boolean;
  /** Marks the panes as invalid (`aria-invalid="true"`). */
  invalid?: boolean;
  /** Form field name: renders one hidden input per selected item ID. */
  name?: string;
}

/** Dual-list shuttle for moving items between an available column and a selected column. */
export const TransferList = forwardRef<HTMLDivElement, TransferListProps>(function TransferList(
  {
    options,
    value,
    defaultValue = [],
    onValueChange,
    sourceTitle = "Available",
    targetTitle = "Selected",
    searchable = false,
    searchPlaceholder = "Filter…",
    showMoveAll = true,
    sourceEmptyText = "No items available",
    targetEmptyText = "None selected",
    disabled = false,
    invalid = false,
    name,
    className,
    ...props
  },
  ref,
) {
  const [uncontrolled, setUncontrolled] = useState<string[]>(defaultValue);
  const selectedIds = value ?? uncontrolled;
  const selectedSet = new Set(selectedIds);
  const rootRef = useRef<HTMLDivElement>(null);
  const controllerRef = useRef<TransferListController | null>(null);
  const latest = useRef({ selectedIds, value, onValueChange, options });
  latest.current = { selectedIds, value, onValueChange, options };

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const ctrl = connectTransferList(root, {
      onTransfer: (ids: string[], direction: TransferDirection) => {
        const current = latest.current.selectedIds;
        const moveSet = new Set(ids);
        let next: string[];
        if (direction === "to-target") {
          const added = latest.current.options
            .map((o) => o.id)
            .filter((id) => moveSet.has(id) && !current.includes(id));
          next = [...current, ...added];
        } else {
          next = current.filter((id) => !moveSet.has(id));
        }
        if (latest.current.value === undefined) setUncontrolled(next);
        latest.current.onValueChange?.(next);
      },
    });
    controllerRef.current = ctrl;
    return () => {
      ctrl.destroy();
      controllerRef.current = null;
    };
  }, [searchable, showMoveAll]);

  useEffect(() => {
    controllerRef.current?.sync();
  }, [options, selectedIds, disabled]);

  const sourceItems = options.filter((o) => !selectedSet.has(o.id));
  const targetItems = selectedIds
    .map((id) => options.find((o) => o.id === id))
    .filter((o): o is TransferListOption => Boolean(o));

  const renderPane = (
    which: "source" | "target",
    title: string,
    items: TransferListOption[],
    emptyDefault: string,
  ) => (
    <div className={transferListPaneClass} data-pane={which}>
      <div className={transferListHeaderClass}>
        <label className={transferListTitleClass}>
          <Checkbox disabled={disabled || items.every((i) => i.disabled)} />
          <span>{title}</span>
        </label>
        <span className={transferListCountClass}>{items.length}</span>
      </div>
      {searchable && (
        <div className={transferListSearchClass}>
          <Icon icon={Search01Icon} name="search" />
          <input
            type="search"
            className={transferListFilterClass}
            placeholder={searchPlaceholder}
            aria-label={`Filter ${title}`}
            disabled={disabled}
          />
        </div>
      )}
      <div className={transferListListClass} role="group" aria-label={title}>
        {items.map((item) => (
          <label key={item.id} className={transferListItemClass} data-value={item.id} data-keywords={item.keywords}>
            <Checkbox value={item.id} disabled={disabled || item.disabled} />
            <span className={transferListItemBodyClass}>
              <span className={transferListLabelClass}>{item.label}</span>
              {item.description !== undefined && <span className={transferListDescriptionClass}>{item.description}</span>}
            </span>
          </label>
        ))}
        <div
          className={transferListEmptyClass}
          data-empty-default={emptyDefault}
          data-empty-filter="No matches"
          hidden={items.length > 0}
        >
          {emptyDefault}
        </div>
      </div>
    </div>
  );

  return (
    <div
      ref={mergeRefs(ref, rootRef)}
      role="group"
      aria-disabled={disabled || undefined}
      aria-invalid={invalid || undefined}
      className={transferListClass({ className })}
      {...props}
    >
      {renderPane("source", sourceTitle, sourceItems, sourceEmptyText)}
      <div className={transferListActionsClass}>
        <Button
          variant="outline"
          size="icon-sm"
          data-action="add"
          aria-label={`Move selected to ${targetTitle}`}
          tooltip={`Move selected`}
          disabled
        >
          <Icon icon={ArrowRight01Icon} name="chevron-right" directional />
        </Button>
        {showMoveAll && (
          <Button
            variant="outline"
            size="icon-sm"
            data-action="add-all"
            aria-label={`Move all to ${targetTitle}`}
            tooltip="Move all"
            disabled={disabled || sourceItems.every((i) => i.disabled)}
          >
            <Icon icon={ArrowRightDoubleIcon} name="chevrons-right" directional />
          </Button>
        )}
        <Button
          variant="outline"
          size="icon-sm"
          data-action="remove"
          aria-label={`Move selected to ${sourceTitle}`}
          tooltip="Remove selected"
          disabled
        >
          <Icon icon={ArrowLeft01Icon} name="chevron-left" directional />
        </Button>
        {showMoveAll && (
          <Button
            variant="outline"
            size="icon-sm"
            data-action="remove-all"
            aria-label={`Move all to ${sourceTitle}`}
            tooltip="Remove all"
            disabled={disabled || targetItems.every((i) => i.disabled)}
          >
            <Icon icon={ArrowLeftDoubleIcon} name="chevrons-left" directional />
          </Button>
        )}
      </div>
      {renderPane("target", targetTitle, targetItems, targetEmptyText)}
      {name && selectedIds.map((id) => <input key={id} type="hidden" name={name} value={id} disabled={disabled} />)}
    </div>
  );
});
