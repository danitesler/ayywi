// "ayywi/elements": custom elements for the interactive components, for any framework or plain HTML.
// Importing registers them (idempotent, no-op during SSR) and starts the card spotlight listener.
import { AyyAppShellElement } from "../components/app-shell/app-shell.element";
import { trackSpotlight } from "../components/card/card";
import { AyyCarouselElement } from "../components/carousel/carousel.element";
import { AyyDialogElement } from "../components/dialog/dialog.element";
import { AyyMenuElement } from "../components/menu/menu.element";
import { AyyNavbarElement } from "../components/navbar/navbar.element";
import { AyyPopoverElement } from "../components/popover/popover.element";
import { AyyTabsElement } from "../components/tabs/tabs.element";
import { AyyThemeToggleElement } from "../components/theme-toggle/theme-toggle.element";
import { AyyTocElement } from "../components/toc/toc.element";
import { AyyTooltipElement } from "../components/tooltip/tooltip.element";
import { define } from "../lib/element";

export { AyyAppShellElement, AyyCarouselElement, AyyDialogElement, AyyMenuElement, AyyNavbarElement, AyyPopoverElement, AyyTabsElement, AyyThemeToggleElement, AyyTocElement, AyyTooltipElement };

let spotlightListening = false;

function onPointerMove(event: PointerEvent): void {
  const card = (event.target as Element | null)?.closest?.<HTMLElement>(".ayy-card--spotlight");
  if (card) trackSpotlight({ currentTarget: card, clientX: event.clientX, clientY: event.clientY });
}

// Failed avatar images: hide them so the initials underneath show. `error` doesn't bubble, so capture it.
function onError(event: Event): void {
  const target = event.target as Element | null;
  if (target instanceof HTMLImageElement && target.classList.contains("ayy-avatar__image")) target.hidden = true;
}

/** Register every <ayy-*> element, the card spotlight and avatar fallbacks. Safe to call twice. */
export function defineElements(): void {
  define("ayy-tabs", AyyTabsElement);
  define("ayy-app-shell", AyyAppShellElement);
  define("ayy-navbar", AyyNavbarElement);
  define("ayy-dialog", AyyDialogElement);
  define("ayy-tooltip", AyyTooltipElement);
  define("ayy-popover", AyyPopoverElement);
  define("ayy-menu", AyyMenuElement);
  define("ayy-toc", AyyTocElement);
  define("ayy-carousel", AyyCarouselElement);
  define("ayy-theme-toggle", AyyThemeToggleElement);
  if (!spotlightListening && typeof document !== "undefined") {
    spotlightListening = true;
    document.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("error", onError, true);
    // Images that failed before this script ran.
    for (const img of document.querySelectorAll<HTMLImageElement>("img.ayy-avatar__image")) {
      if (img.complete && img.naturalWidth === 0 && img.getAttribute("src")) img.hidden = true;
    }
  }
}

defineElements();
