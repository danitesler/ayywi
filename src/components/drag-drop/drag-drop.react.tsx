import { forwardRef, useEffect, useRef, type ElementType, type HTMLAttributes, type ButtonHTMLAttributes, type ReactElement, type ReactNode, type Ref } from "react";
import { cx } from "../../lib/cx";
import { mergeRefs } from "../../lib/refs";
import { DragDropVerticalIcon } from "../../lib/icons";
import { Icon } from "../icon/icon.react";
import { Tooltip } from "../tooltip/tooltip.react";
import {
  connectDragDrop,
  dragHandleClass,
  draggableClass,
  dropTargetClass,
  sortableClassName,
  sortableItemClass,
  type DragDropOptions,
  type DragMove,
  type DragOrientation,
} from "./drag-drop";

type Callbacks = Pick<DragDropOptions, "accepts" | "canDrag" | "canDropOn" | "describe" | "preview" | "onMove" | "keyboard">;

/** Runs connectDragDrop on the element for as long as it's mounted. React owns the DOM, so it never moves elements itself: reorder your state in onMove. */
function useDragDrop<T extends HTMLElement>(ref: { current: T | null }, options: Pick<DragDropOptions, "items" | "handle" | "areas" | "orientation"> & Callbacks) {
  const latest = useRef(options);
  latest.current = options;
  const { items, handle, areas, orientation } = options;
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const controller = connectDragDrop(el, {
      items,
      handle,
      areas,
      orientation,
      moveDom: false,
      keyboard: latest.current.keyboard,
      accepts: latest.current.accepts ? (item, area) => latest.current.accepts?.(item, area) ?? true : undefined,
      canDrag: (item) => latest.current.canDrag?.(item) ?? true,
      canDropOn: (item) => latest.current.canDropOn?.(item) ?? true,
      describe: latest.current.describe ? (item) => latest.current.describe?.(item) ?? "" : undefined,
      preview: latest.current.preview ? (item) => latest.current.preview!(item) : undefined,
      onMove: (move) => latest.current.onMove?.(move),
    });
    return controller.destroy;
  }, [ref, items, handle, areas, orientation]);
}

export interface DragHandleProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** What the tooltip says. Name the action, not the item: "Drag to reorder". Pass false for no tooltip. */
  tooltip?: ReactNode | false;
}

/** The grip you pick an item up by: a button with the six-dot icon. Give it an aria-label that names the item ("Move Revenue"); the tooltip stays general. */
export const DragHandle = /* @__PURE__ */ forwardRef<HTMLButtonElement, DragHandleProps>(function DragHandle({ tooltip, className, ...props }, ref) {
  const button = (
    <button ref={ref} type="button" className={cx(dragHandleClass, className)} {...props}>
      <Icon icon={DragDropVerticalIcon} name="grip-vertical" />
    </button>
  );
  if (tooltip === false) return button;
  return <Tooltip content={tooltip ?? "Drag to reorder"}>{button as ReactElement<{ "aria-describedby"?: string }>}</Tooltip>;
});

export interface SortableProps extends Omit<HTMLAttributes<HTMLElement>, "onChange"> {
  /** The element: a list (default) or a div. */
  as?: "ul" | "ol" | "div";
  /** The way the items line up. */
  orientation?: DragOrientation;
  /** Pick items up by their DragHandle only (default), which also gives the handle the arrow keys. false: the whole item drags, and Alt + arrows move it. */
  handle?: boolean;
  /** Called when an item is dropped or moved by key. Reorder your state: React doesn't move anything itself. */
  onMove?: (move: DragMove) => void;
  /** Can this item be picked up? */
  canDrag?: (item: HTMLElement) => boolean;
  /** The item's name when it's read out ("Revenue moved to position 2 of 4"). Default: its aria-label or text. */
  describe?: (item: HTMLElement) => string;
}

/** A list whose items you drag to reorder, with a line showing where the dragged one will land. */
export const Sortable = /* @__PURE__ */ forwardRef<HTMLElement, SortableProps>(function Sortable(
  { as: Tag = "ul", orientation, handle = true, onMove, canDrag, describe, className, ...props },
  ref,
) {
  const el = useRef<HTMLElement>(null);
  useDragDrop(el, {
    items: `.${draggableClass}`,
    handle: handle ? `.${dragHandleClass}` : undefined,
    orientation,
    onMove,
    canDrag,
    describe,
  });
  const Element = Tag as ElementType;
  return <Element ref={mergeRefs(el, ref as Ref<HTMLElement>)} className={sortableClassName({ orientation, className })} {...props} />;
});

export interface SortableItemProps extends HTMLAttributes<HTMLElement> {
  /** The element: a list item (default) or a div. */
  as?: "li" | "div";
}

/** One row of a Sortable: put a DragHandle first, then the content. */
export const SortableItem = /* @__PURE__ */ forwardRef<HTMLElement, SortableItemProps>(function SortableItem({ as: Tag = "li", className, ...props }, ref) {
  const Element = Tag as ElementType;
  return <Element ref={ref} className={cx(draggableClass, sortableItemClass, className)} {...props} />;
});

export interface DragDropAreaProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** The way items line up inside each DropTarget. */
  orientation?: DragOrientation;
  /** Pick items up by their DragHandle only (default). false: the whole item drags. */
  handle?: boolean;
  /** Called when an item is dropped or moved by key, in another area or the same. Move it in your state. */
  onMove?: (move: DragMove) => void;
  /** Can this item go in that area? Default: the area's data-accepts against the item's data-type. */
  accepts?: (item: HTMLElement, area: HTMLElement) => boolean;
  canDrag?: (item: HTMLElement) => boolean;
  describe?: (item: HTMLElement) => string;
}

/** Holds several DropTargets and moves items between them (a board's columns). Items also reorder inside a target. */
export const DragDropArea = /* @__PURE__ */ forwardRef<HTMLDivElement, DragDropAreaProps>(function DragDropArea(
  { orientation, handle = true, onMove, accepts, canDrag, describe, ...props },
  ref,
) {
  const el = useRef<HTMLDivElement>(null);
  useDragDrop(el, {
    items: `.${draggableClass}`,
    handle: handle ? `.${dragHandleClass}` : undefined,
    areas: `.${dropTargetClass}`,
    orientation,
    onMove,
    accepts,
    canDrag,
    describe,
  });
  return <div ref={mergeRefs(el, ref)} {...props} />;
});

export interface DropTargetProps extends HTMLAttributes<HTMLElement> {
  as?: "ul" | "ol" | "div";
  /** Draws the items as a Sortable list (the usual case for a column). */
  list?: boolean;
}

/** A place items can be dropped. It shows ready, over and reject while something is dragged. Give it a data-id, and data-accepts="bug feature" to take only those items' data-type. */
export const DropTarget = /* @__PURE__ */ forwardRef<HTMLElement, DropTargetProps>(function DropTarget({ as: Tag = "ul", list = true, className, ...props }, ref) {
  const Element = Tag as ElementType;
  return <Element ref={ref} className={cx(dropTargetClass, list && sortableClassName(), className)} {...props} />;
});
