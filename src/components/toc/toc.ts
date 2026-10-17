import { cx } from "../../lib/cx";
import { ensureId } from "../../lib/element";
import { ArrowDown01Icon, Menu01Icon } from "../../lib/icons";
import { iconSvg } from "../icon/icon";

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
export const tocBarClass = "ayy-toc__bar";
export const tocToggleClass = "ayy-toc__toggle";
export const tocToggleIconClass = "ayy-toc__toggle-icon";
export const tocToggleCurrentClass = "ayy-toc__toggle-current";
export const tocToggleCaretClass = "ayy-toc__toggle-caret";

export const tocMenuIcon = /* @__PURE__ */ iconSvg(Menu01Icon);
export const tocChevronIcon = /* @__PURE__ */ iconSvg(ArrowDown01Icon);

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

function extractLinkText(link: HTMLAnchorElement): string {
  const num = link.querySelector(".ayy-toc__number");
  let text = link.textContent?.trim() ?? "";
  if (num && num.textContent) {
    const numText = num.textContent.trim();
    if (text.startsWith(numText)) {
      text = text.slice(numText.length).trim();
    }
  }
  return text;
}

/**
 * Scrollspy for the `.ayy-toc__link[href^="#"]` links inside `root`: the link whose section is being read gets
 * aria-current="location", the others lose it. On mobile, handles the sticky toggle pill and dropdown menu.
 * Framework-free; returns a cleanup function.
 */
export function connectToc(root: HTMLElement, options: TocOptions = {}): () => void {
  let current: string | null = null;
  let frame = 0;

  const doc = root.ownerDocument;
  const win = doc.defaultView ?? window;
  const host = root.closest<HTMLElement>(".ayy-toc") ?? root;

  // Auto-inject mobile pill bar if omitted in plain HTML
  let injectedBar: HTMLElement | null = null;
  if (!host.querySelector(".ayy-toc__bar")) {
    const firstLink = host.querySelector<HTMLAnchorElement>("a.ayy-toc__link");
    const label = firstLink ? extractLinkText(firstLink) : "Table of contents";
    injectedBar = doc.createElement("div");
    injectedBar.className = tocBarClass;
    injectedBar.innerHTML = `<button type="button" class="${tocToggleClass}" aria-expanded="false"><span class="${tocToggleIconClass}">${tocMenuIcon}</span><span class="${tocToggleCurrentClass}">${label}</span><span class="${tocToggleCaretClass}">${tocChevronIcon}</span></button>`;
    host.prepend(injectedBar);
  }

  const toggle = host.querySelector<HTMLButtonElement>(".ayy-toc__toggle");
  const currentSpan = host.querySelector<HTMLElement>(".ayy-toc__toggle-current");
  const list = host.querySelector<HTMLElement>(".ayy-toc__list");
  if (toggle && list) {
    toggle.setAttribute("aria-controls", ensureId(list, "ayy-toc-list"));
  }

  const setOpen = (open: boolean) => {
    if (open) {
      host.dataset.open = "true";
      if (root !== host) root.dataset.open = "true";
    } else {
      delete host.dataset.open;
      if (root !== host) delete root.dataset.open;
    }
    toggle?.setAttribute("aria-expanded", open ? "true" : "false");
  };

  const onToggleClick = (e: MouseEvent) => {
    e.stopPropagation();
    const isOpen = host.dataset.open === "true" || toggle?.getAttribute("aria-expanded") === "true";
    setOpen(!isOpen);
  };

  const onLinkClick = (e: MouseEvent) => {
    const target = (e.target as HTMLElement).closest("a.ayy-toc__link");
    if (target) {
      setOpen(false);
    }
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape" && (host.dataset.open === "true" || toggle?.getAttribute("aria-expanded") === "true")) {
      setOpen(false);
      toggle?.focus();
    }
  };

  const onPointerDown = (e: PointerEvent) => {
    if ((host.dataset.open === "true" || toggle?.getAttribute("aria-expanded") === "true") && !host.contains(e.target as Node)) {
      setOpen(false);
    }
  };

  toggle?.addEventListener("click", onToggleClick);
  host.addEventListener("click", onLinkClick);
  win.addEventListener("keydown", onKeyDown);
  win.addEventListener("pointerdown", onPointerDown);

  const update = () => {
    frame = 0;
    const links = Array.from(root.querySelectorAll<HTMLAnchorElement>('a.ayy-toc__link[href^="#"]'));
    const docEl = doc.documentElement;
    const line = options.offset ?? (parseFloat(win.getComputedStyle(docEl).scrollPaddingBlockStart) || 0) + 24;
    let index = -1;
    links.forEach((link, i) => {
      const target = doc.getElementById(hashOf(link));
      if (target && target.getClientRects().length && target.getBoundingClientRect().top <= line) index = i;
    });
    // At the very bottom, the last sections may be too short to ever reach the line: take the last one in view.
    if (win.innerHeight + win.scrollY >= docEl.scrollHeight - 2) {
      links.forEach((link, i) => {
        const target = doc.getElementById(hashOf(link));
        if (target && target.getClientRects().length && target.getBoundingClientRect().top < win.innerHeight) index = i;
      });
    }
    links.forEach((link, i) => {
      if (i === index) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
    const id = index >= 0 ? hashOf(links[index]) : "";
    if (id !== current) {
      current = id;
      if (index >= 0) {
        if (currentSpan) {
          currentSpan.textContent = extractLinkText(links[index]);
        }
      }
      options.onChange?.(id);
    }
  };

  const schedule = () => {
    if (!frame) frame = win.requestAnimationFrame(update);
  };

  win.addEventListener("scroll", schedule, { passive: true });
  win.addEventListener("resize", schedule);
  update();

  return () => {
    win.cancelAnimationFrame(frame);
    toggle?.removeEventListener("click", onToggleClick);
    host.removeEventListener("click", onLinkClick);
    win.removeEventListener("keydown", onKeyDown);
    win.removeEventListener("pointerdown", onPointerDown);
    win.removeEventListener("scroll", schedule);
    win.removeEventListener("resize", schedule);
    injectedBar?.remove();
  };
}
