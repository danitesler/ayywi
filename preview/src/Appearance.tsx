import type { CSSProperties } from "react";
import { ALargeSmallIcon, ColorsIcon, Moon02Icon, Settings01Icon, Sun03Icon } from "@hugeicons/core-free-icons";
import {
  ColorPicker,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  Icon,
} from "@danitesler/ayywi/react";
import type { BrandInput, DensityMode, ThemeMode } from "@danitesler/ayywi";
import { BRAND_PRESETS } from "./pages/Brand";

const DENSITY_OPTIONS: [DensityMode, string][] = [
  ["auto", "Auto"],
  ["compact", "Compact"],
  ["comfortable", "Comfortable"],
  ["touch", "Touch"],
];

const THEME_OPTIONS: [ThemeMode, string][] = [
  ["system", "System"],
  ["dark", "Dark"],
  ["dark-contrast", "Dark contrast"],
  ["light", "Light"],
  ["light-gray", "Light gray"],
];

export interface AppearanceProps {
  theme: ThemeMode;
  setTheme: (v: ThemeMode) => void;
  density: DensityMode;
  setDensity: (v: DensityMode) => void;
  brand: BrandInput | null;
  setBrand: (v: BrandInput | null) => void;
}

/** Theme, density and brand in one menu with submenu flyouts, in the header. */
export function AppearanceMenu({ theme, setTheme, density, setDensity, brand, setBrand }: AppearanceProps) {
  const isCustom = Boolean(brand && !BRAND_PRESETS.some((p) => !p.isMono && p.name === brand.name));
  const customHex = isCustom && /^#[0-9a-f]{6}$/i.test(brand?.color ?? "") ? brand!.color : "#0ea5e9";
  const currentBrandKey = !brand || brand.name === "mono" ? "mono" : isCustom ? "custom" : brand.name;

  const pickBrand = (name: string) => {
    if (name === "mono" || name === "") {
      setBrand(null);
      return;
    }
    if (name === "custom") {
      pickCustomColor(customHex);
      return;
    }
    const preset = BRAND_PRESETS.find((p) => p.name === name);
    if (preset) {
      if (preset.isMono) {
        setBrand(null);
      } else {
        setBrand({ name: preset.name, color: preset.color, shape: preset.shape });
      }
    }
  };

  const pickCustomColor = (color: string) => {
    const hex = /^#[0-9a-f]{6}$/i.test(color) ? color : "#0ea5e9";
    setBrand({ name: "custom", color: hex, shape: brand?.shape ?? "pill" });
  };

  const themeLabel = THEME_OPTIONS.find(([key]) => key === theme)?.[1] ?? theme;
  const densityLabel = DENSITY_OPTIONS.find(([key]) => key === density)?.[1] ?? density;
  const brandLabel = isCustom ? "Custom" : (BRAND_PRESETS.find((p) => p.name === currentBrandKey)?.label ?? "Mono");
  const isLight = theme === "light" || theme === "light-gray";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger variant="ghost" size="icon" aria-label="Appearance" tooltipSide="bottom">
        <Icon icon={Settings01Icon} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" aria-label="Appearance">
        <DropdownMenuSub>
          <DropdownMenuSubTrigger icon={<Icon icon={isLight ? Sun03Icon : Moon02Icon} />} value={themeLabel}>Theme</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuRadioGroup value={theme} onValueChange={(v) => setTheme(v as ThemeMode)}>
              {THEME_OPTIONS.map(([key, text]) => (
                <DropdownMenuRadioItem key={key} value={key}>
                  {text}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger icon={<Icon icon={ALargeSmallIcon} />} value={densityLabel}>Density</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuRadioGroup value={density} onValueChange={(v) => setDensity(v as DensityMode)}>
              {DENSITY_OPTIONS.map(([key, text]) => (
                <DropdownMenuRadioItem key={key} value={key}>
                  {text}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger icon={<Icon icon={ColorsIcon} />} value={brandLabel}>Brand</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuRadioGroup value={currentBrandKey} onValueChange={pickBrand}>
              {BRAND_PRESETS.map((p) => (
                <DropdownMenuRadioItem
                  key={p.name}
                  value={p.name}
                  icon={<span className="ayy-swatch ayy-swatch--sm" style={{ "--ayy-swatch": p.color } as CSSProperties} />}
                >
                  {p.label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger
                selected={isCustom}
                onClick={() => pickCustomColor(customHex)}
                icon={<span className="ayy-swatch ayy-swatch--sm" style={{ "--ayy-swatch": customHex } as CSSProperties} />}
              >
                Custom
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent style={{ padding: "var(--ayy-space-2)" }}>
                <ColorPicker
                  value={customHex}
                  onValueChange={pickCustomColor}
                  swatches={BRAND_PRESETS.filter((p) => !p.isMono).map((p) => p.color)}
                />
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
