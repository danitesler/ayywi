import { cx } from "../../lib/cx";

export interface BreadcrumbClassOptions {
  /** Blurred, bordered capsule for use over hero images and grids. */
  pill?: boolean;
  className?: string;
}

export function breadcrumbClass({ pill, className }: BreadcrumbClassOptions = {}): string {
  return cx("ayy-breadcrumb", pill && "ayy-breadcrumb--pill", className);
}

export const breadcrumbListClass = "ayy-breadcrumb__list";
export const breadcrumbItemClass = "ayy-breadcrumb__item";
export const breadcrumbLinkClass = "ayy-breadcrumb__link";
