import { cx } from "../../lib/cx";

export const breadcrumbSizes = ["sm", "md", "lg"] as const;
export type BreadcrumbSize = (typeof breadcrumbSizes)[number];

export interface BreadcrumbClassOptions {
  size?: BreadcrumbSize;
  /** Blurred, bordered capsule for use over hero images and grids. */
  pill?: boolean;
  className?: string;
}

export function breadcrumbClass({ size = "md", pill, className }: BreadcrumbClassOptions = {}): string {
  return cx("ayy-breadcrumb", size !== "md" && `ayy-breadcrumb--${size}`, pill && "ayy-breadcrumb--pill", className);
}

export const breadcrumbListClass = "ayy-breadcrumb__list";
export const breadcrumbItemClass = "ayy-breadcrumb__item";
export const breadcrumbLinkClass = "ayy-breadcrumb__link";
