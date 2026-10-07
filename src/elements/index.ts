// "@danitesler/ayywi/elements": custom elements for the interactive components, for any framework or plain HTML.
// Importing registers them (idempotent, no-op during SSR) and starts the card spotlight listener.
import { AyyAppShellElement } from "../components/app-shell/app-shell.element";
import { AyyCalendarElement } from "../components/calendar/calendar.element";
import { trackSpotlight } from "../components/card/card";
import { AyyCarouselElement } from "../components/carousel/carousel.element";
import { AyyComboboxElement } from "../components/combobox/combobox.element";
import { AyyDialogElement } from "../components/dialog/dialog.element";
import { AyyMenuElement } from "../components/menu/menu.element";
import { AyyNavbarElement } from "../components/navbar/navbar.element";
import { AyyPopoverElement } from "../components/popover/popover.element";
import { AyyShortcutRecorderElement } from "../components/shortcut/shortcut.element";
import { AyyTableElement } from "../components/table/table.element";
import { AyyTabsElement } from "../components/tabs/tabs.element";
import { AyyToolbarElement } from "../components/toolbar/toolbar.element";
import { AyyCommandElement } from "../components/command/command.element";
import { AyyTagInputElement } from "../components/tag-input/tag-input.element";
import { AyySwipeElement } from "../components/swipe/swipe.element";
import { AyyThemeToggleElement } from "../components/theme-toggle/theme-toggle.element";
import { AyyTocElement } from "../components/toc/toc.element";
import { AyyTooltipElement } from "../components/tooltip/tooltip.element";
import { trackDropzones } from "../components/dropzone/dropzone";
import { stepNumberField, syncNumberField } from "../components/number-field/number-field";
import { syncSlider } from "../components/slider/slider";
import { clearSearchBar } from "../components/search-bar/search-bar";
import { syncShortcuts } from "../components/shortcut/shortcut";
import { syncSwatch } from "../components/swatch/swatch";
import { define } from "../lib/element";

export { AyyAppShellElement, AyyCalendarElement, AyyCarouselElement, AyyComboboxElement, AyyCommandElement, AyyDialogElement, AyyMenuElement, AyyNavbarElement, AyyPopoverElement, AyyShortcutRecorderElement, AyySwipeElement, AyyTableElement, AyyTabsElement, AyyTagInputElement, AyyThemeToggleElement, AyyTocElement, AyyToolbarElement, AyyTooltipElement };

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

// Sliders fill up to the thumb, custom swatches show their colour, number fields step from their buttons (React's own buttons call preventDefault).
function onInput(event: Event): void {
  const target = event.target;
  if (!(target instanceof HTMLInputElement)) return;
  if (target.classList.contains("ayy-slider")) syncSlider(target);
  if (target.type === "color") syncSwatch(target);
  const field = target.closest(".ayy-number-field");
  if (field) syncNumberField(field);
}

function onClick(event: MouseEvent): void {
  if (event.defaultPrevented) return;
  const button = (event.target as Element | null)?.closest?.(".ayy-number-field__decrement, .ayy-number-field__increment");
  if (button) stepNumberField(button);
  const clear = (event.target as Element | null)?.closest?.(".ayy-search-bar__clear");
  if (clear) clearSearchBar(clear);
}

/** Register every <ayy-*> element and the page-wide helpers: card spotlight, avatar fallbacks, slider fills, custom swatch colours, number field steps, search bar clear buttons, drop zones. Safe to call twice. */
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
  define("ayy-calendar", AyyCalendarElement);
  define("ayy-toolbar", AyyToolbarElement);
  define("ayy-shortcut-recorder", AyyShortcutRecorderElement);
  define("ayy-command", AyyCommandElement);
  define("ayy-tag-input", AyyTagInputElement);
  define("ayy-swipe", AyySwipeElement);
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
    // Controls already on the page: fill sliders from their values, mark number fields at their limits, colour custom swatches.
    for (const slider of document.querySelectorAll<HTMLInputElement>("input.ayy-slider")) syncSlider(slider);
    for (const field of document.querySelectorAll(".ayy-number-field")) syncNumberField(field);
    for (const input of document.querySelectorAll<HTMLInputElement>(".ayy-swatch--custom > input")) syncSwatch(input);
    syncShortcuts();
  }
}

defineElements();
