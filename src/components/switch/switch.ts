/** Put on <input type="checkbox" role="switch">. */
export const switchClass = "ayy-switch";

export const switchSizes = ["sm", "md", "lg"] as const;
export type SwitchSize = (typeof switchSizes)[number];

/** Add next to switchClass: `cx(switchClass, switchSizeClass("lg"))`. md is the default and adds nothing. */
export function switchSizeClass(size?: SwitchSize): string | undefined {
  return size && size !== "md" ? `ayy-switch--${size}` : undefined;
}
