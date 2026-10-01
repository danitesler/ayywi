import { cx } from "../../lib/cx";

export interface CardClassOptions {
  /** Lift + shadow on hover. Use when the whole card is clickable. */
  interactive?: boolean;
  /** Pointer-following glow. Needs pointer tracking (React Card does it; else ayywi/elements). */
  spotlight?: boolean;
  /** The one to pick: the recommended plan, the option you chose. A border in the text colour. */
  featured?: boolean;
  className?: string;
}

export function cardClass({ interactive, spotlight, featured, className }: CardClassOptions = {}): string {
  return cx("ayy-card", interactive && "ayy-card--interactive", spotlight && "ayy-card--spotlight", featured && "ayy-card--featured", className);
}

/** Pointer handler that feeds the spotlight. Framework-free: attach to pointermove on the card. */
export function trackSpotlight(event: { currentTarget: EventTarget | null; clientX: number; clientY: number }): void {
  const el = event.currentTarget as HTMLElement | null;
  if (!el) return;
  const rect = el.getBoundingClientRect();
  el.style.setProperty("--ayy-mx", `${event.clientX - rect.left}px`);
  el.style.setProperty("--ayy-my", `${event.clientY - rect.top}px`);
}
