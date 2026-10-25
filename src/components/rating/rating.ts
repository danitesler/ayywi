import { cx } from "../../lib/cx";
import { StarIcon } from "../../lib/icons";
import { iconSvg } from "../icon/icon";

export const ratingSizes = ["sm", "md", "lg"] as const;
export type RatingSize = (typeof ratingSizes)[number];

export interface RatingClassOptions {
  size?: RatingSize;
  half?: boolean;
  readOnly?: boolean;
  className?: string;
}

export function ratingClass({ size = "md", half, readOnly, className }: RatingClassOptions = {}): string {
  return cx(
    "ayy-rating",
    size !== "md" && `ayy-rating--${size}`,
    half && !readOnly && "ayy-rating--half",
    readOnly && "ayy-rating--readonly",
    className,
  );
}

export const ratingItemClass = "ayy-rating__item";
export const ratingStarClass = "ayy-rating__star";
export const ratingFillClass = "ayy-rating__fill";

/** Default star glyph as SVG markup (Hugeicons StarIcon). */
export const ratingStarIcon = /* @__PURE__ */ iconSvg(StarIcon);

const wasCheckedBeforePointer = new WeakMap<HTMLInputElement, boolean>();

/** Record whether a clearable rating's radio was already checked before the pointer press. */
export function recordRatingPointerDown(event: PointerEvent | MouseEvent): void {
  const item = (event.target as Element | null)?.closest?.<HTMLElement>(".ayy-rating[data-clearable] .ayy-rating__item");
  const input = item?.querySelector<HTMLInputElement>(":scope > input");
  if (input && !input.disabled) wasCheckedBeforePointer.set(input, input.checked);
}

/** Uncheck an already-checked star when a `[data-clearable]` rating is clicked again. */
export function toggleClearableRating(event: MouseEvent): void {
  if (event.defaultPrevented || event.detail === 0) return;
  const item = (event.target as Element | null)?.closest?.<HTMLElement>(".ayy-rating[data-clearable] .ayy-rating__item");
  const input = item?.querySelector<HTMLInputElement>(":scope > input");
  if (!input || input.disabled) return;
  if (wasCheckedBeforePointer.get(input)) {
    wasCheckedBeforePointer.delete(input);
    if (!input.checked) return;
    input.checked = false;
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.dispatchEvent(new Event("change", { bubbles: true }));
  }
}
