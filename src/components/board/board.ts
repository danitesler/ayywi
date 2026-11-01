import { cx } from "../../lib/cx";
export function boardClass({ className }: { className?: string } = {}): string { return cx("ayy-board", className); }
export const boardColumnClass = "ayy-board__column";
export const boardHeaderClass = "ayy-board__header";
export const boardTitleClass = "ayy-board__title";
export const boardCountClass = "ayy-board__count";
export const boardActionsClass = "ayy-board__actions";
export const boardCardsClass = "ayy-board__cards";
export const boardCardClass = "ayy-board__card";
export const boardEmptyClass = "ayy-board__empty";
export const boardAddClass = "ayy-board__add";
