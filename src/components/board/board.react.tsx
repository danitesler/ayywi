import { Children, forwardRef, useId, type HTMLAttributes, type ReactNode } from "react";
import { cx } from "../../lib/cx";
import { PlusSignIcon } from "../../lib/icons";
import { DragDropArea, DropTarget, SortableItem, type DragDropAreaProps } from "../drag-drop/drag-drop.react";
import type { DragMove } from "../drag-drop/drag-drop";
import { Icon } from "../icon/icon.react";
import { boardClass } from "./board";

export interface BoardProps extends HTMLAttributes<HTMLDivElement> {
  onMove?: (move: DragMove) => void;
  accepts?: DragDropAreaProps["accepts"];
}
export const Board = /* @__PURE__ */ forwardRef<HTMLDivElement, BoardProps>(function Board({ onMove, accepts, className, ...props }, ref) {
  return onMove ? <DragDropArea ref={ref} handle={false} onMove={onMove} accepts={accepts} className={boardClass({ className })} {...props} /> : <div ref={ref} className={boardClass({ className })} {...props} />;
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
  footer?: ReactNode;
}
export const BoardColumn = /* @__PURE__ */ forwardRef<HTMLElement, BoardColumnProps>(function BoardColumn({ id, title, count, icon, actions, emptyText = "No cards", accepts, onAdd, addLabel = "Add card", footer, className, children, ...props }, ref) {
  const titleId = useId();
  return <section ref={ref} className={cx("ayy-board__column", className)} aria-labelledby={titleId} {...props}>
    <header className="ayy-board__header">{icon}<h3 className="ayy-board__title" id={titleId}>{title}</h3>{count !== undefined && <span className="ayy-board__count">{count}</span>}{actions && <div className="ayy-board__actions">{actions}</div>}</header>
    <DropTarget as="ul" list className="ayy-board__cards" data-id={id} data-accepts={accepts} aria-labelledby={titleId}>{Children.count(children) ? children : <li className="ayy-board__empty">{emptyText}</li>}</DropTarget>
    {footer ?? (onAdd && <button type="button" className="ayy-button ayy-button--ghost ayy-board__add" onClick={onAdd}><Icon icon={PlusSignIcon} name="plus" />{addLabel}</button>)}
  </section>;
});
export interface BoardCardProps extends HTMLAttributes<HTMLLIElement> {
  id: string;
  selected?: boolean;
  type?: string;
}
export const BoardCard = /* @__PURE__ */ forwardRef<HTMLLIElement, BoardCardProps>(function BoardCard({ id, selected, type, className, ...props }, ref) {
  return <SortableItem ref={ref} className={cx("ayy-card ayy-card--interactive ayy-board__card", selected && "ayy-card--featured", className)} data-id={id} data-type={type} aria-current={selected ? "true" : undefined} tabIndex={0} {...props} />;
});
