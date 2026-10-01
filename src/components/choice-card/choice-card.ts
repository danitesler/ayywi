import { cx } from "../../lib/cx";

export interface ChoiceCardClassOptions {
  /** A time slot or a size: centred, input hidden, filled when chosen. */
  compact?: boolean;
  className?: string;
}

export function choiceCardClass({ compact, className }: ChoiceCardClassOptions = {}): string {
  return cx("ayy-choice-card", compact && "ayy-choice-card--compact", className);
}

export function choiceGroupClass({ scroll, className }: { scroll?: boolean; className?: string } = {}): string {
  return cx("ayy-choice-group", scroll && "ayy-choice-group--scroll", className);
}

export const choiceGroupLegendClass = "ayy-choice-group__legend";
export const choiceCardTitleClass = "ayy-choice-card__title";
export const choiceCardDescriptionClass = "ayy-choice-card__description";
export const choiceCardMetaClass = "ayy-choice-card__meta";
