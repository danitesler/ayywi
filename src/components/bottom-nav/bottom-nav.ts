import { cx } from "../../lib/cx";

export const bottomNavSizes = ["sm", "md", "lg"] as const;
export type BottomNavSize = (typeof bottomNavSizes)[number];

export interface BottomNavClassOptions {
  size?: BottomNavSize;
  compact?: boolean;
  iconOnly?: boolean;
  className?: string;
}

export function bottomNavClass(options?: BottomNavClassOptions | string): string {
  if (typeof options === "string") return cx("ayy-bottom-nav", options);
  const { size = "lg", compact, iconOnly, className } = options ?? {};
  return cx(
    "ayy-bottom-nav",
    size !== "lg" && `ayy-bottom-nav--${size}`,
    compact && "ayy-bottom-nav--compact",
    iconOnly && "ayy-bottom-nav--icon-only",
    className,
  );
}

export const bottomNavLinkClass = "ayy-bottom-nav__link";
export const bottomNavLabelClass = "ayy-bottom-nav__label";
