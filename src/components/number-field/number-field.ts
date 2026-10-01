import { cx } from "../../lib/cx";
import { MinusSignIcon, PlusSignIcon } from "../../lib/icons";
import { iconSvg } from "../icon/icon";

export const numberFieldSizes = ["sm", "md"] as const;
export type NumberFieldSize = (typeof numberFieldSizes)[number];

export function numberFieldClass({ size = "md", className }: { size?: NumberFieldSize; className?: string } = {}): string {
  return cx("ayy-number-field", size !== "md" && `ayy-number-field--${size}`, className);
}

export const numberFieldInputClass = "ayy-number-field__input";
export const numberFieldDecrementClass = "ayy-number-field__decrement";
export const numberFieldIncrementClass = "ayy-number-field__increment";

/** The glyphs inside the buttons, as SVG markup (Hugeicons MinusSign and PlusSign). */
export const numberFieldMinusIcon = /* @__PURE__ */ iconSvg(MinusSignIcon);
export const numberFieldPlusIcon = /* @__PURE__ */ iconSvg(PlusSignIcon);

const parts = (field: Element) => ({
  input: field.querySelector<HTMLInputElement>(`.${numberFieldInputClass}`),
  down: field.querySelector<HTMLElement>(`.${numberFieldDecrementClass}`),
  up: field.querySelector<HTMLElement>(`.${numberFieldIncrementClass}`),
});

/** Mark the button that can't go further (value at min or max) aria-disabled="true", and the other not. */
export function syncNumberField(field: Element): void {
  const { input, down, up } = parts(field);
  if (!input) return;
  const value = input.valueAsNumber;
  const atMin = input.min !== "" && Number.isFinite(value) && value <= Number(input.min);
  const atMax = input.max !== "" && Number.isFinite(value) && value >= Number(input.max);
  down?.setAttribute("aria-disabled", String(input.disabled || atMin));
  up?.setAttribute("aria-disabled", String(input.disabled || atMax));
}

/**
 * Step the field's input from one of its buttons (stepUp/stepDown, so min, max and step hold), fire input and
 * change like typing would, and update the buttons. Returns the new value, or null if nothing changed.
 */
export function stepNumberField(button: Element): number | null {
  const field = button.closest(".ayy-number-field");
  if (!field || button.getAttribute("aria-disabled") === "true" || (button as HTMLButtonElement).disabled) return null;
  const { input } = parts(field);
  if (!input || input.disabled || input.readOnly) return null;
  const before = input.value;
  if (input.value === "") input.value = input.min || "0";
  else if (button.classList.contains(numberFieldIncrementClass)) input.stepUp();
  else input.stepDown();
  syncNumberField(field);
  if (input.value === before) return null;
  input.dispatchEvent(new Event("input", { bubbles: true }));
  input.dispatchEvent(new Event("change", { bubbles: true }));
  return input.valueAsNumber;
}
