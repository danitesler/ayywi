import { cx } from "../../lib/cx";

export const choiceCardSizes = ["sm", "md", "lg"] as const;
export type ChoiceCardSize = (typeof choiceCardSizes)[number];

export interface ChoiceCardClassOptions {
  /** Padding, text and the corner radio or checkbox. */
  size?: ChoiceCardSize;
  /** A time slot or a size: centred, input hidden, filled when chosen. */
  compact?: boolean;
  className?: string;
}

export function choiceCardClass({ size = "md", compact, className }: ChoiceCardClassOptions = {}): string {
  return cx("ayy-choice-card", size !== "md" && `ayy-choice-card--${size}`, compact && "ayy-choice-card--compact", className);
}

export function choiceGroupClass({ size = "md", scroll, className }: { size?: ChoiceCardSize; scroll?: boolean; className?: string } = {}): string {
  return cx("ayy-choice-group", size !== "md" && `ayy-choice-group--${size}`, scroll && "ayy-choice-group--scroll", className);
}

export const choiceGroupLegendClass = "ayy-choice-group__legend";
export const choiceCardTitleClass = "ayy-choice-card__title";
export const choiceCardDescriptionClass = "ayy-choice-card__description";
export const choiceCardMetaClass = "ayy-choice-card__meta";
