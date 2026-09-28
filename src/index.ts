// Framework-free entry: tokens, class helpers, controllers, theme utilities. Safe to import anywhere (and during SSR).
import { tokens, type TokenName } from "./tokens";

export { tokens, brands, type TokenName, type TokenDefinition, type BrandName } from "./tokens";
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
export * from "./components/table/table";

/** `var(--ayy-…)` reference for a token, e.g. cssVar("color.bg") → "var(--ayy-color-bg)". */
export function cssVar(name: TokenName): string {
  return `var(${tokens[name].cssVar})`;
}
