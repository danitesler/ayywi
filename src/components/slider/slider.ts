export const sliderClass = "ayy-slider";
export const sliderRangeClass = "ayy-slider-range";

/** Where a range input's value sits between its min and max, 0–100: the number --ayy-value takes. */
export function sliderPercent(input: Pick<HTMLInputElement, "min" | "max" | "value">): number {
  const min = input.min === "" ? 0 : Number(input.min);
  const max = input.max === "" ? 100 : Number(input.max);
  const value = Number(input.value);
  if (!(max > min) || !Number.isFinite(value)) return 0;
  return Math.round(Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100)) * 100) / 100;
}

/**
 * Bring a slider's fill up to date: --ayy-value on an .ayy-slider, and --ayy-from / --ayy-to on its .ayy-slider-range,
 * where the two thumbs can't cross (the one being dragged stops at the other). ayywi/elements calls it on every
 * input event; call it yourself after setting a value from code.
 */
export function syncSlider(input: HTMLInputElement): void {
  const range = input.parentElement?.classList.contains(sliderRangeClass) ? input.parentElement : null;
  if (range) {
    const [low, high] = Array.from(range.querySelectorAll<HTMLInputElement>(`:scope > .${sliderClass}`));
    if (low && high) {
      if (Number(low.value) > Number(high.value)) {
        if (input === low) low.value = high.value;
        else high.value = low.value;
      }
      // Both thumbs at the top: the upper input would cover the lower one, so lift the lower one to keep it draggable.
      low.style.zIndex = Number(low.value) >= Number(low.max === "" ? 100 : low.max) ? "1" : "";
      range.style.setProperty("--ayy-from", String(sliderPercent(low)));
      range.style.setProperty("--ayy-to", String(sliderPercent(high)));
      return;
    }
  }
  input.style.setProperty("--ayy-value", String(sliderPercent(input)));
}
