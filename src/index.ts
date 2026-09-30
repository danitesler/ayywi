// Framework-free entry: tokens, class helpers, controllers, theme utilities. Safe to import anywhere (and during SSR).
import { tokens, type TokenName } from "./tokens";

export { tokens, brands, themes, themeBase, type TokenName, type TokenDefinition, type BrandName, type ThemeName } from "./tokens";
export { cx, type ClassValue } from "./lib/cx";
export { place, autoPlace, supportsPopover, type FloatingSide, type FloatingAlign, type PlaceOptions } from "./lib/position";
export * from "./theme";

export * from "./components/button/button";
export * from "./components/card/card";
export * from "./components/badge/badge";
export * from "./components/input/input";
export * from "./components/textarea/textarea";
export * from "./components/select/select";
export * from "./components/checkbox/checkbox";
export * from "./components/radio/radio";
export * from "./components/field/field";
export * from "./components/switch/switch";
export * from "./components/tabs/tabs";
export * from "./components/dialog/dialog";
export * from "./components/popover/popover";
export * from "./components/menu/menu";
export * from "./components/tooltip/tooltip";
export * from "./components/toast/toast";
export * from "./components/alert/alert";
export * from "./components/progress/progress";
export * from "./components/skeleton/skeleton";
export * from "./components/avatar/avatar";
export * from "./components/icon/icon";
export * from "./components/table/table";
export * from "./components/navbar/navbar";
export * from "./components/breadcrumb/breadcrumb";
export * from "./components/toc/toc";
export * from "./components/section/section";
export * from "./components/separator/separator";
export * from "./components/carousel/carousel";
export * from "./components/theme-toggle/theme-toggle";
export * from "./components/icon-tile/icon-tile";
export * from "./components/stat/stat";
export * from "./components/data-list/data-list";
export * from "./components/frame/frame";
export * from "./components/chat/chat";

/** `var(--ayy-…)` reference for a token, e.g. cssVar("color.bg") → "var(--ayy-color-bg)". */
export function cssVar(name: TokenName): string {
  return `var(${tokens[name].cssVar})`;
}
