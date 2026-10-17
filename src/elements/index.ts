// "@danitesler/ayywi/elements": custom elements for the interactive components, for any framework or plain HTML.
// Importing registers them (idempotent, no-op during SSR) and starts the card spotlight listener.
import { AyyActionBarElement } from "../components/action-bar/action-bar.element";
import { AyyAppShellElement } from "../components/app-shell/app-shell.element";
import {
  AyyDatePickerElement,
  AyyDateRangeElement,
  AyyDateTimePickerElement,
  AyyTimePickerElement,
} from "../components/date-time-picker/date-time-picker.element";
import { trackSpotlight } from "../components/card/card";
import { AyyCarouselElement } from "../components/carousel/carousel.element";
import { copyCodeBlock, highlightCodeBlocks, syncCodeBlockSelector } from "../components/code-block/code-block";
import { AyyColorPickerElement } from "../components/color-picker/color-picker.element";
import { AyyComboboxElement } from "../components/combobox/combobox.element";
import { AyyDialogElement } from "../components/dialog/dialog.element";
import { AyyGridElement } from "../components/grid/grid.element";
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
import { AyyTocElement } from "../components/toc/toc.element";
import { AyyTooltipElement } from "../components/tooltip/tooltip.element";
import { trackDropzones } from "../components/dropzone/dropzone";
import { stepNumberField, syncNumberField } from "../components/number-field/number-field";
import { syncSlider } from "../components/slider/slider";
import { clearSearchBar } from "../components/search-bar/search-bar";
import { openSelectListFrom } from "../components/select/select";
import { syncShortcuts } from "../components/shortcut/shortcut";
import { openColorPickerFrom, syncSwatch } from "../components/swatch/swatch";
import { define } from "../lib/element";

export {
  AyyActionBarElement,
  AyyAppShellElement,
  AyyCarouselElement,
  AyyColorPickerElement,
  AyyComboboxElement,
  AyyCommandElement,
  AyyDatePickerElement,
  AyyDateRangeElement,
  AyyDateTimePickerElement,
  AyyDialogElement,
  AyyGridElement,
  AyyMenuElement,
  AyyNavbarElement,
  AyyPopoverElement,
  AyyShortcutRecorderElement,
  AyySwipeElement,
  AyyTableElement,
  AyyTabsElement,
  AyyTagInputElement,
  AyyTimePickerElement,
  AyyTocElement,
  AyyToolbarElement,
  AyyTooltipElement,
  copyCodeBlock,
  highlightCodeBlocks,
  syncCodeBlockSelector,
};

let spotlightListening = false;

function onPointerMove(event: PointerEvent): void {
  const card = (event.target as Element | null)?.closest?.<HTMLElement>(".ayy-card--spotlight");
  if (card) trackSpotlight({ currentTarget: card, clientX: event.clientX, clientY: event.clientY });
}

// Failed avatar images: hide them so the initials underneath show. `error` doesn't bubble, so capture it.
function onError(event: Event): void {
  const target = event.target as Element | null;
  if (target instanceof HTMLImageElement && target.classList.contains("ayy-avatar__image")) {
    target.setAttribute("data-error", "");
    target.hidden = true;
  }
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

function onChange(event: Event): void {
  const target = event.target;
  if (target instanceof HTMLSelectElement && target.classList.contains("ayy-code-block__selector")) {
    syncCodeBlockSelector(target);
  }
}

function onAyySelect(event: Event): void {
  const custom = event as CustomEvent<{ value?: string }>;
  const menu = (event.target as Element | null)?.closest?.("ayy-menu");
  const selector = menu?.querySelector(".ayy-code-block__selector");
  if (selector && custom.detail?.value) {
    const codeBlock = selector.closest<HTMLElement>(".ayy-code-block") ?? undefined;
    syncCodeBlockSelector(custom.detail.value, codeBlock);
  }
}

function onClick(event: MouseEvent): void {
  if (event.defaultPrevented) return;
  const button = (event.target as Element | null)?.closest?.(".ayy-number-field__decrement, .ayy-number-field__increment");
  if (button) stepNumberField(button);
  const clear = (event.target as Element | null)?.closest?.(".ayy-search-bar__clear");
  if (clear) clearSearchBar(clear);
  const copy = (event.target as Element | null)?.closest?.(".ayy-code-block__copy");
  if (copy) void copyCodeBlock(copy);
}

// Selects open ayywi's options list with a mouse or trackpad (React Select does it itself and calls preventDefault).
function onSelectOpen(event: MouseEvent | KeyboardEvent): void {
  if ((event.target as Element | null)?.closest?.(".ayy-select__control")) openSelectListFrom(event);
}

// Custom swatches open ayywi's ColorPicker (React SwatchCustom does it itself and calls preventDefault).
function onSwatchOpen(event: MouseEvent | KeyboardEvent): void {
  const target = event.target as Element | null;
  if (target?.closest?.(".ayy-swatch--custom")) openColorPickerFrom(event);
}

/** Register every <ayy-*> element and the page-wide helpers: card spotlight, avatar fallbacks, slider fills, custom swatch colours, number field steps, search bar clear buttons, select option lists, custom swatch color pickers, drop zones. Safe to call twice. */
export function defineElements(): void {
  define("ayy-tabs", AyyTabsElement);
  define("ayy-table", AyyTableElement);
  define("ayy-grid", AyyGridElement);
  define("ayy-action-bar", AyyActionBarElement);
  define("ayy-app-shell", AyyAppShellElement);
  define("ayy-navbar", AyyNavbarElement);
  define("ayy-dialog", AyyDialogElement);
  define("ayy-combobox", AyyComboboxElement);
  define("ayy-tooltip", AyyTooltipElement);
  define("ayy-popover", AyyPopoverElement);
  define("ayy-menu", AyyMenuElement);
  define("ayy-toc", AyyTocElement);
  define("ayy-carousel", AyyCarouselElement);
  define("ayy-date-picker", AyyDatePickerElement);
  define("ayy-date-range", AyyDateRangeElement);
  define("ayy-time-picker", AyyTimePickerElement);
  define("ayy-date-time-picker", AyyDateTimePickerElement);
  define("ayy-color-picker", AyyColorPickerElement);
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
    document.addEventListener("change", onChange);
    document.addEventListener("ayy-select", onAyySelect);
    document.addEventListener("click", onClick);
    document.addEventListener("mousedown", onSelectOpen);
    document.addEventListener("click", onSelectOpen);
    document.addEventListener("keydown", onSelectOpen);
    document.addEventListener("mousedown", onSwatchOpen);
    document.addEventListener("click", onSwatchOpen);
    document.addEventListener("keydown", onSwatchOpen);
    trackDropzones(document);
    // Images that failed before this script ran.
    for (const img of document.querySelectorAll<HTMLImageElement>("img.ayy-avatar__image")) {
      if (img.complete && img.naturalWidth === 0 && img.getAttribute("src")) {
        img.setAttribute("data-error", "");
        img.hidden = true;
      }
    }
    // Controls already on the page: fill sliders from their values, mark number fields at their limits, colour custom swatches.
    for (const slider of document.querySelectorAll<HTMLInputElement>("input.ayy-slider")) syncSlider(slider);
    for (const field of document.querySelectorAll(".ayy-number-field")) syncNumberField(field);
    for (const input of document.querySelectorAll<HTMLInputElement>(".ayy-swatch--custom > input")) syncSwatch(input);
    syncShortcuts();
    highlightCodeBlocks();
    if (typeof MutationObserver === "function" && document.body) {
      const observer = new MutationObserver((mutations) => {
        for (const m of mutations) {
          for (const node of m.addedNodes) {
            if (node instanceof HTMLElement) {
              if (node.matches?.(".ayy-swatch--custom > input")) syncSwatch(node as HTMLInputElement);
              for (const input of node.querySelectorAll<HTMLInputElement>(".ayy-swatch--custom > input")) syncSwatch(input);
              if (node.matches?.("input.ayy-slider")) syncSlider(node as HTMLInputElement);
              for (const slider of node.querySelectorAll<HTMLInputElement>("input.ayy-slider")) syncSlider(slider);
              if (node.matches?.(".ayy-number-field")) syncNumberField(node);
              for (const field of node.querySelectorAll(".ayy-number-field")) syncNumberField(field);
              syncShortcuts(node);
              highlightCodeBlocks(node);
              const checkAvatar = (img: HTMLImageElement) => {
                if (img.complete && img.naturalWidth === 0 && img.getAttribute("src")) {
                  img.setAttribute("data-error", "");
                  img.hidden = true;
                }
              };
              if (node.matches?.("img.ayy-avatar__image")) checkAvatar(node as HTMLImageElement);
              for (const img of node.querySelectorAll<HTMLImageElement>("img.ayy-avatar__image")) checkAvatar(img);
            }
          }
        }
      });
      observer.observe(document.body, { childList: true, subtree: true });
    }
  }
}

defineElements();
