import { cx } from "../../lib/cx";

export interface TocClassOptions {
  /** Stays in view beside long content, below the navbar. */
  sticky?: boolean;
  className?: string;
}

export function tocClass({ sticky, className }: TocClassOptions = {}): string {
  return cx("ayy-toc", sticky && "ayy-toc--sticky", className);
}

export const tocTitleClass = "ayy-toc__title";
export const tocListClass = "ayy-toc__list";
export const tocLinkClass = "ayy-toc__link";
export const tocNumberClass = "ayy-toc__number";

export interface TocOptions {
  /**
   * How far below the top of the viewport (px) a section's top must pass to become current.
   * Default: the page's scroll-padding-top (the navbar sets it) + 24.
   */
  offset?: number;
  /** Called with the current section's id ("" above the first one) whenever it changes. */
  onChange?: (id: string) => void;
}

const hashOf = (link: HTMLAnchorElement) => decodeURIComponent(link.hash.slice(1));

/**
 * Scrollspy for the `.ayy-toc__link[href^="#"]` links inside `root`: the link whose section is being read gets
 * aria-current="location", the others lose it. Framework-free; returns a cleanup function.
 */
export function connectToc(root: HTMLElement, options: TocOptions = {}): () => void {
  let current: string | null = null;
  let frame = 0;

  const update = () => {
    frame = 0;
    const links = Array.from(root.querySelectorAll<HTMLAnchorElement>('a.ayy-toc__link[href^="#"]'));
    const doc = document.documentElement;
    const line = options.offset ?? (parseFloat(getComputedStyle(doc).scrollPaddingBlockStart) || 0) + 24;
    let index = -1;
    links.forEach((link, i) => {
      const target = document.getElementById(hashOf(link));
      if (target && target.getClientRects().length && target.getBoundingClientRect().top <= line) index = i;
    });
    // At the very bottom, the last sections may be too short to ever reach the line: take the last one in view.
    if (window.innerHeight + window.scrollY >= doc.scrollHeight - 2) {
      links.forEach((link, i) => {
        const target = document.getElementById(hashOf(link));
        if (target && target.getClientRects().length && target.getBoundingClientRect().top < window.innerHeight) index = i;
      });
    }
    links.forEach((link, i) => {
      if (i === index) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
    const id = index >= 0 ? hashOf(links[index]) : "";
    if (id !== current) {
      current = id;
      if (index >= 0) reveal(links[index]);
      options.onChange?.(id);
    }
  };

  // On phones the sticky contents is one scrolling row: keep the current section's top-level link in view. Rects, not
  // scrollLeft, so it works the same in right-to-left pages.
  const reveal = (link: HTMLAnchorElement) => {
    const strip = root.querySelector<HTMLElement>(".ayy-toc__list");
    if (!strip || strip.scrollWidth <= strip.clientWidth) return;
    const item = Array.from(strip.children).find((li) => li.contains(link));
    const shown = item?.querySelector<HTMLElement>("a.ayy-toc__link") ?? link;
    const a = shown.getBoundingClientRect();
    const s = strip.getBoundingClientRect();
    strip.scrollBy({ left: a.left + a.width / 2 - (s.left + s.width / 2) });
  };

  const schedule = () => {
    if (!frame) frame = requestAnimationFrame(update);
  };

  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule);
  update();
  return () => {
    cancelAnimationFrame(frame);
    window.removeEventListener("scroll", schedule);
    window.removeEventListener("resize", schedule);
  };
}
