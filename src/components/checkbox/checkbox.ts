/** Put on <input type="checkbox">. Indeterminate is a DOM property: input.indeterminate = true. */
export const checkboxClass = "ayy-checkbox";

export const checkboxSizes = ["sm", "md", "lg"] as const;
export type CheckboxSize = (typeof checkboxSizes)[number];

/** Add next to checkboxClass: `cx(checkboxClass, checkboxSizeClass("lg"))`. md is the default and adds nothing. */
export function checkboxSizeClass(size?: CheckboxSize): string | undefined {
  return size && size !== "md" ? `ayy-checkbox--${size}` : undefined;
}
