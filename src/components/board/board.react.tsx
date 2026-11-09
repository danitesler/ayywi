import { Children, createContext, forwardRef, useContext, useEffect, useId, useRef, type HTMLAttributes, type ReactNode } from "react";
import { cx } from "../../lib/cx";
import { mergeRefs } from "../../lib/refs";
import { PlusSignIcon } from "../../lib/icons";
import { DragDropArea, DragHandle, DropTarget, SortableItem, type DragDropAreaProps } from "../drag-drop/drag-drop.react";
import { connectDragDrop, type DragMove } from "../drag-drop/drag-drop";
import { Icon } from "../icon/icon.react";
import { HoverActions } from "../hover-actions/hover-actions.react";
import { boardClass } from "./board";

const BoardColumnsDraggable = /* @__PURE__ */ createContext(false);

export interface BoardProps extends HTMLAttributes<HTMLDivElement> {
  onMove?: (move: DragMove) => void;
  onColumnMove?: (move: DragMove) => void;
  accepts?: DragDropAreaProps["accepts"];
}
export const Board = /* @__PURE__ */ forwardRef<HTMLDivElement, BoardProps>(function Board({ onMove, onColumnMove, accepts, className, ...props }, ref) {
  const root = useRef<HTMLDivElement>(null);
  const moveColumn = useRef(onColumnMove);
  moveColumn.current = onColumnMove;
  const columnsDraggable = Boolean(onColumnMove);
  useEffect(() => {
    if (!root.current || !columnsDraggable) return;
    return connectDragDrop(root.current, {
      items: ".ayy-board__column",
      handle: ".ayy-board__column-handle",
      orientation: "horizontal",
      moveDom: false,
      onMove: (move) => moveColumn.current?.(move),
    }).destroy;
  }, [columnsDraggable]);
  const boardRef = mergeRefs(ref, root);
  return <BoardColumnsDraggable.Provider value={columnsDraggable}>{onMove ? <DragDropArea ref={boardRef} handle={false} onMove={onMove} accepts={accepts} className={boardClass({ className })} {...props} /> : <div ref={boardRef} className={boardClass({ className })} {...props} />}</BoardColumnsDraggable.Provider>;
});
export interface BoardColumnProps extends Omit<HTMLAttributes<HTMLElement>, "title" | "id"> {
  id: string;
  title: ReactNode;
  count?: number;
  icon?: ReactNode;
  actions?: ReactNode;
  emptyText?: ReactNode;
  accepts?: string;
  onAdd?: () => void;
  addLabel?: string;
  moveLabel?: string;
  footer?: ReactNode;
}
export const BoardColumn = /* @__PURE__ */ forwardRef<HTMLElement, BoardColumnProps>(function BoardColumn({ id, title, count, icon, actions, emptyText = "No cards", accepts, onAdd, addLabel = "Add card", moveLabel, footer, className, children, ...props }, ref) {
  const titleId = useId();
  const draggable = useContext(BoardColumnsDraggable);
  return <section ref={ref} data-id={id} className={cx("ayy-board__column", className)} aria-labelledby={titleId} {...props}>
    <header className="ayy-board__header">{draggable && <DragHandle className="ayy-board__column-handle" aria-label={moveLabel ?? (typeof title === "string" ? `Move ${title} column` : "Move column")} />}{icon}<h3 className="ayy-board__title" id={titleId}>{title}</h3>{count !== undefined && <span className="ayy-board__count">{count}</span>}{actions && <div className="ayy-board__actions">{actions}</div>}</header>
    <DropTarget as="ul" list className="ayy-board__cards" data-id={id} data-accepts={accepts} aria-labelledby={titleId}>{Children.count(children) ? children : <li className="ayy-board__empty">{emptyText}</li>}</DropTarget>
    {footer ?? (onAdd && <button type="button" className="ayy-button ayy-button--ghost ayy-board__add" onClick={onAdd}><Icon icon={PlusSignIcon} name="plus" />{addLabel}</button>)}
  </section>;
});
export interface BoardCardProps extends HTMLAttributes<HTMLLIElement> {
  id: string;
  selected?: boolean;
  type?: string;
  actions?: ReactNode;
}
export const BoardCard = /* @__PURE__ */ forwardRef<HTMLLIElement, BoardCardProps>(function BoardCard({ id, selected, type, actions, className, children, ...props }, ref) {
  return <SortableItem ref={ref} className={cx("ayy-card ayy-card--interactive ayy-board__card", selected && "ayy-card--featured", className)} data-id={id} data-type={type} aria-current={selected ? "true" : undefined} tabIndex={0} {...props}>
    {actions ? <><div className="ayy-board__card-content">{children}</div><HoverActions reveal onPointerDownCapture={(event) => event.stopPropagation()} onKeyDownCapture={(event) => { if (event.altKey && event.key.startsWith("Arrow")) event.stopPropagation(); }}>{actions}</HoverActions></> : children}
  </SortableItem>;
});
