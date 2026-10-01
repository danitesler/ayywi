// "ayywi/elements": custom elements for the interactive components, for any framework or plain HTML.
// Importing registers them (idempotent, no-op during SSR) and starts the card spotlight listener.
import { AyyAppShellElement } from "../components/app-shell/app-shell.element";
import { trackSpotlight } from "../components/card/card";
import { AyyCarouselElement } from "../components/carousel/carousel.element";
import { AyyComboboxElement } from "../components/combobox/combobox.element";
import { AyyDialogElement } from "../components/dialog/dialog.element";
import { AyyMenuElement } from "../components/menu/menu.element";
import { AyyNavbarElement } from "../components/navbar/navbar.element";
import { AyyPopoverElement } from "../components/popover/popover.element";
import { AyyTableElement } from "../components/table/table.element";
import { AyyTabsElement } from "../components/tabs/tabs.element";
import { AyyThemeToggleElement } from "../components/theme-toggle/theme-toggle.element";
import { AyyTocElement } from "../components/toc/toc.element";
import { AyyTooltipElement } from "../components/tooltip/tooltip.element";
import { trackDropzones } from "../components/dropzone/dropzone";
import { stepNumberField, syncNumberField } from "../components/number-field/number-field";
import { syncSlider } from "../components/slider/slider";
import { define } from "../lib/element";

export { AyyAppShellElement, AyyCarouselElement, AyyComboboxElement, AyyDialogElement, AyyMenuElement, AyyNavbarElement, AyyPopoverElement, AyyTableElement, AyyTabsElement, AyyThemeToggleElement, AyyTocElement, AyyTooltipElement };

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

// Sliders fill up to the thumb, number fields step from their buttons (React's own buttons call preventDefault).
function onInput(event: Event): void {
  const target = event.target;
  if (!(target instanceof HTMLInputElement)) return;
  if (target.classList.contains("ayy-slider")) syncSlider(target);
  const field = target.closest(".ayy-number-field");
  if (field) syncNumberField(field);
}

function onClick(event: MouseEvent): void {
  if (event.defaultPrevented) return;
  const button = (event.target as Element | null)?.closest?.(".ayy-number-field__decrement, .ayy-number-field__increment");
  if (button) stepNumberField(button);
}

/** Register every <ayy-*> element and the page-wide helpers: card spotlight, avatar fallbacks, slider fills, number field steps, drop zones. Safe to call twice. */
export function defineElements(): void {
  define("ayy-tabs", AyyTabsElement);
  define("ayy-table", AyyTableElement);
  define("ayy-app-shell", AyyAppShellElement);
  define("ayy-navbar", AyyNavbarElement);
  define("ayy-dialog", AyyDialogElement);
  define("ayy-combobox", AyyComboboxElement);
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
    document.addEventListener("input", onInput);
    document.addEventListener("click", onClick);
    trackDropzones(document);
    // Images that failed before this script ran.
    for (const img of document.querySelectorAll<HTMLImageElement>("img.ayy-avatar__image")) {
      if (img.complete && img.naturalWidth === 0 && img.getAttribute("src")) img.hidden = true;
    }
    // Controls already on the page: fill sliders from their values, mark number fields at their limits.
    for (const slider of document.querySelectorAll<HTMLInputElement>("input.ayy-slider")) syncSlider(slider);
    for (const field of document.querySelectorAll(".ayy-number-field")) syncNumberField(field);
  }
}

defineElements();
