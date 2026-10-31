import { cx } from "../../lib/cx";

export const cardSizes = ["sm", "md", "lg"] as const;
export type CardSize = (typeof cardSizes)[number];

export interface CardClassOptions {
  /** Padding of the header, content and footer, and the size of the title. */
  size?: CardSize;
  /** Lift + shadow on hover. Use when the whole card is clickable. */
  interactive?: boolean;
  /** Pointer-following glow. Needs pointer tracking (React Card does it; else @danitesler/ayywi/elements). */
  spotlight?: boolean;
  /** No fill and no shadow: the page shows through, the border stays. */
  transparent?: boolean;
  /** The one to pick: the recommended plan, the option you chose. A border in the text colour. */
  featured?: boolean;
  /** A capture, recording or picture to open: the picture fills the card, details and actions show on hover. */
  view?: boolean;
  className?: string;
}

export function cardClass({ size = "md", interactive, spotlight, transparent, featured, view, className }: CardClassOptions = {}): string {
  return cx(
    "ayy-card",
    size !== "md" && `ayy-card--${size}`,
    interactive && "ayy-card--interactive",
    spotlight && "ayy-card--spotlight",
    transparent && "ayy-card--transparent",
    featured && "ayy-card--featured",
    view && "ayy-card--view",
    className,
  );
}

export const cardHeaderClass = "ayy-card__header";
export const cardTitleClass = "ayy-card__title";
export const cardDescriptionClass = "ayy-card__description";
export const cardContentClass = "ayy-card__content";
export const cardFooterClass = "ayy-card__footer";
export const cardMediaClass = "ayy-card__media";
export const cardLinkClass = "ayy-card__link";

/** Pointer handler that feeds the spotlight. Framework-free: attach to pointermove on the card. */
export function trackSpotlight(event: { currentTarget: EventTarget | null; clientX: number; clientY: number }): void {
  const el = event.currentTarget as HTMLElement | null;
  if (!el) return;
  const rect = el.getBoundingClientRect();
  el.style.setProperty("--ayy-mx", `${event.clientX - rect.left}px`);
  el.style.setProperty("--ayy-my", `${event.clientY - rect.top}px`);
}
