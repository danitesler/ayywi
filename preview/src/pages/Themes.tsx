import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { ArrowRight01Icon, Book02Icon, Cancel01Icon, ContrastIcon, DropletIcon, Fire02Icon, Flower01Icon, Moon02Icon, Notification01Icon, PaintBrush01Icon, Search01Icon, Settings01Icon, SnowflakeIcon, SparklesIcon, StarsIcon, Sun03Icon, SunriseIcon, Tick02Icon, Tree01Icon, WaterfallDown01Icon } from "@hugeicons/core-free-icons";
import { bodyFontAdjust, brandCss, createBrand, createThemeCustomization, createThemeText, iconPackInfo, iconPacks, surfaceStrength, THEME_PRESETS, THEME_FONTS, themeFontsUrl, tokens, DEFAULT_THEME_CUSTOMIZATION, type ThemeCustomization, type BrandInput, type BrandShape, type DensityMode, type IconName, type IconPackName, type ThemeMode, type ThemeName } from "@danitesler/ayywi";
import {
  Alert,
  AlertDescription,
  Button,
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Icon,
  SettingsOption,
  SettingsPicker,
  SettingsScreen,
  ColorSwatchButton,
  ColorSwatchCustom,
  ColorSwatchGroup,
  Field,
  Label,
  SegmentedControl,
  SegmentedControlItem,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Select,
  Tooltip,
} from "@danitesler/ayywi/react";
import { CodeBlock } from "../CodeBlock";
import { buildPrompt } from "../prompts";
import { themeOptions } from "../themes";
import { BRAND_PRESETS, Sample, Scale, SHAPES } from "./Brand";
import { BrandApp, type BrandIcon } from "./BrandDemo";

type CustomDraft = { mono: boolean; input: BrandInput; custom: ThemeCustomization; theme: ThemeName; auto?: boolean; density?: DensityMode; icons?: IconPackName };
const DENSITIES: [DensityMode, string][] = [["auto", "Auto"], ["compact", "Compact"], ["comfortable", "Comfortable"], ["touch", "Touch"]];
const isIconPack = (value: unknown): value is IconPackName => (iconPacks as readonly unknown[]).includes(value);
/** What "auto" density is on this device: touch on a coarse pointer, compact otherwise. */
const resolveDensity = (density: DensityMode) => density !== "auto" ? density : window.matchMedia("(pointer: coarse)").matches ? "touch" : "compact";
const CUSTOM_DRAFT_KEY = "ayy-preview-custom-theme";
function loadCustomDraft(): CustomDraft | null {
  try {
    const draft = JSON.parse(localStorage.getItem(CUSTOM_DRAFT_KEY) ?? "null");
    if (!draft || typeof draft.mono !== "boolean" || (draft.theme !== "light" && draft.theme !== "dark")) return null;
    createBrand(draft.input);
    createThemeCustomization(draft.custom, draft.mono ? null : draft.input.color);
    if (!isIconPack(draft.icons)) delete draft.icons;
    return draft;
  } catch { return null; }
}
function saveCustomDraft(draft: CustomDraft) {
  try { localStorage.setItem(CUSTOM_DRAFT_KEY, JSON.stringify(draft)); } catch { /* storage unavailable */ }
}

const DEFAULT_COLOR = "#0ea5e9";
/** A few built-in icons under the preview's app, so another icon pack shows before it is used. */
const SAMPLE_ICONS: { icon: typeof Search01Icon; name: IconName; directional?: boolean }[] = [
  { icon: Search01Icon, name: "search" },
  { icon: Notification01Icon, name: "bell" },
  { icon: Settings01Icon, name: "settings" },
  { icon: Tick02Icon, name: "check" },
  { icon: Cancel01Icon, name: "x" },
  { icon: ArrowRight01Icon, name: "chevron-right", directional: true },
];

/** One icon for each theme, shown on the preview's app. */
const THEME_ICONS: Record<string, BrandIcon> = {
  auto: { icon: ContrastIcon, name: "contrast" },
  custom: { icon: PaintBrush01Icon, name: "paintbrush" },
  dark: { icon: Moon02Icon, name: "moon" },
  light: { icon: Sun03Icon, name: "sun" },
  arctic: { icon: SnowflakeIcon, name: "snowflake" },
  twilight: { icon: StarsIcon, name: "stars" },
  forest: { icon: Tree01Icon, name: "tree" },
  ember: { icon: Fire02Icon, name: "flame" },
  wine: { icon: DropletIcon, name: "droplet" },
  sunlit: { icon: SunriseIcon, name: "sunrise" },
  blush: { icon: Flower01Icon, name: "flower" },
  lagoon: { icon: WaterfallDown01Icon, name: "chart-column-decreasing" },
  lavender: { icon: SparklesIcon, name: "sparkles" },
  paper: { icon: Book02Icon, name: "book" },
};
/** The Surface choices. With an accent, Subtle tints the page and panels with it (the library's own "subtle" strength); Mono has no colour to tint with, so Subtle takes the page deeper instead (depth: towards black, or white in light mode). */
const SURFACE_LEVELS = [
  { id: "neutral", label: "Neutral", tint: "neutral", depth: 0 },
  { id: "subtle", label: "Subtle", tint: "subtle", depth: 50 },
] as const;
type SurfaceLevel = (typeof SURFACE_LEVELS)[number];
const levelOf = (c: ThemeCustomization, isMono: boolean): SurfaceLevel => {
  const now = isMono ? c.contrast : surfaceStrength(c.surface);
  const at = (l: SurfaceLevel) => (isMono ? l.depth : surfaceStrength(l.tint));
  return SURFACE_LEVELS.reduce((best, l) => (Math.abs(at(l) - now) < Math.abs(at(best) - now) ? l : best));
};
const withLevel = (c: ThemeCustomization, isMono: boolean, level: SurfaceLevel): ThemeCustomization =>
  isMono ? { ...c, surface: "neutral", contrast: level.depth } : { ...c, surface: level.tint, contrast: 0 };
const resolve = (mode: ThemeMode): ThemeName =>
  mode === "dark-contrast" ? "dark" : mode === "light-gray" ? "light" : mode !== "system" ? mode : window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
const label = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const table = tokens as unknown as Record<string, { value: unknown; light?: string }>;
const lightDark = (name: string) => `light-dark(${table[name].light ?? table[name].value}, ${table[name].value})`;
const fontStack = (name: string) => (table[name].value as string[]).map((family) => (/\s/.test(family) ? `"${family}"` : family)).join(", ");

/** ayywi's own action colours and fonts under a selector, so the brand the site wears doesn't colour a preview of another theme. A brand's rule goes after it. */
function defaultsCss(selector: string): string {
  const decls = [
    ...["primary", "primary-fg", "ring", "glow"].map((name) => `--ayy-color-${name}: ${lightDark(`color.${name}`)};`),
    ...["heading", "body", "mono"].map((key) => `--ayy-font-${key}: ${fontStack(`font.${key}`)};`),
    "--ayy-font-body-adjust: none;",
  ];
  // In the brand layer, like the rules that follow it, so a preview's brand still wins over these.
  return `@layer ayywi.brand { ${selector}, ${selector} :is([data-theme], .dark, .light) { ${decls.join(" ")} } }`;
}

/** Mono's own corners and fonts, scoped to a selector: a brand's rule without its colours. */
function monoCss(input: BrandInput, selector: string): string {
  const { radius, font } = createBrand({ name: "mono", color: "#808080", shape: input.shape, font: input.font });
  const decls = [
    `--ayy-radius-control: ${radius.control};`,
    `--ayy-radius-card: ${radius.card};`,
    `--ayy-radius-button: ${radius.button};`,
    ...(["heading", "body", "mono"] as const).filter((k) => font[k]).map((k) => `--ayy-font-${k}: ${font[k]};`),
    ...(font.body ? [bodyFontAdjust(font.body)] : []),
  ];
  return `${selector}, ${selector} :is([data-theme], .dark, .light) { ${decls.join(" ")} }`;
}

/** The same brand, with the corners a brand that names none gets by default. */
function sameBrand(a: BrandInput | null, b: BrandInput | null): boolean {
  const key = (brand: BrandInput | null) => brand && JSON.stringify([brand.name, brand.color, brand.shape ?? "pill", brand.font ?? null]);
  return key(a) === key(b);
}

/** The calls that put a theme on a page. */
function themeCalls(brand: BrandInput | null, customization: ThemeCustomization, mode: ThemeMode, density?: DensityMode, icons: IconPackName = "hugeicons"): string {
  const font = brand?.font && (brand.font.heading || brand.font.body) ? `, font: ${JSON.stringify(brand.font)}` : "";
  return [
    brand ? `ayywi.setBrand({ name: "${brand.name}", color: "${brand.color}", shape: "${brand.shape ?? "pill"}"${font} });` : "ayywi.setBrand(null);",
    `ayywi.setTheme("${mode}");`,
    density && density !== "auto" ? `ayywi.setDensity("${density}");` : "",
    icons !== "hugeicons" ? `ayywi.setIconPack("${icons}");` : "",
    `ayywi.setThemeCustomization(${JSON.stringify(customization)}, undefined, ${brand ? JSON.stringify(brand.color) : "null"});`,
  ].filter(Boolean).join("\n");
}

function snippet(brand: BrandInput | null, customization: ThemeCustomization, mode: ThemeMode, density?: DensityMode, fontsUrl = "", icons: IconPackName = "hugeicons"): string {
  const fonts = fontsUrl ? `<!-- its fonts, in <head> -->\n<link rel="stylesheet" href="${fontsUrl}">\n\n` : "";
  const pack = icons !== "hugeicons" ? `// its icons: the pack's CSS, next to ayywi's\nimport "@danitesler/ayywi/icons/${icons}.css";\n\n` : "";
  const cli = brand ? `npx @danitesler/ayywi brand "${brand.color}" --name ${brand.name} --shape ${brand.shape ?? "pill"} --out src/brand.css\n\n// or at run time, without a build step\n` : "// ayywi's monochrome default: no brand to set.\n";
  return `${fonts}${pack}${cli}${themeCalls(brand, customization, mode, density, icons)}`;
}

/** The request an AI tool needs to put a theme in an app (buildPrompt adds how to load ayywi). */
function themeRequest(name: string, brand: BrandInput | null, customization: ThemeCustomization, mode: ThemeMode, density: DensityMode | undefined, font: { label: string; description: string } | undefined, fontsUrl: string, icons: IconPackName): string {
  const tint = levelOf(customization, !brand);
  const traits = [
    mode === "system" ? "follows the device between light and dark" : `${mode} mode`,
    brand ? `accent ${brand.color}` : "monochrome, no accent colour",
    `${tint.id} surfaces`,
    `${brand?.shape ?? customization.appearance?.shape ?? "pill"} corners`,
    font && font.label !== "Default" ? `${font.label} fonts (${font.description})` : "",
    density && density !== "auto" ? `${density} density` : "",
    icons !== "hugeicons" ? `icons from ${iconPackInfo[icons].label}` : "",
  ].filter(Boolean);
  const steps = [
    `Apply it once the page has loaded, with ayywi's helpers:\n${themeCalls(brand, customization, mode, density, icons).replace(/^/gm, "   ")}`,
    fontsUrl ? `Load its fonts in <head>: <link rel="stylesheet" href="${fontsUrl}">` : "",
    icons !== "hugeicons" ? `Load its icon pack next to ayywi's CSS: @danitesler/ayywi/icons/${icons}.css (dist/icons/${icons}.css in the package).` : "",
    "Don't write the theme's colours, fonts or corners into CSS by hand: ayywi's tokens carry them. Keep any theme switcher the app has working.",
    "Tell me which files you changed.",
  ].filter(Boolean);
  return `Use the ayywi "${name}" theme in this app: ${traits.join(", ")}.\n\n${steps.map((step, i) => `${i + 1}. ${step}`).join("\n")}`;
}

/**
 * #/themes: pick a brand on the left and see it on a small app on the right, in any theme. Nothing changes on the site until
 * "Use this theme".
 */
export function ThemesPage({ current, onUse, theme, setTheme, density, setDensity, icons, setIcons, customization, setCustomization }: { current: BrandInput | null; onUse: (brand: BrandInput | null) => void; theme: ThemeMode; setTheme: (theme: ThemeMode) => void; density: DensityMode; setDensity: (density: DensityMode) => void; icons: IconPackName; setIcons: (icons: IconPackName) => void; customization: ThemeCustomization; setCustomization: (value: ThemeCustomization) => void }) {
  const [custom, setCustom] = useState(customization);
  const [mono, setMono] = useState(!current);
  const [input, setInput] = useState<BrandInput>(() => current ?? { name: "acme", color: DEFAULT_COLOR, shape: customization.appearance?.shape ?? "pill", font: customization.appearance?.font });
  const [previewTheme, setPreviewTheme] = useState<ThemeName>(() => resolve(theme));
  const [selected, setSelected] = useState(() => {
    const match = THEME_PRESETS.find((preset) =>
    preset.theme === resolve(theme) && sameBrand(preset.brand, current) &&
    surfaceStrength(preset.customization.surface) === surfaceStrength(customization.surface) &&
    preset.customization.contrast === customization.contrast && preset.customization.textColor === customization.textColor &&
    (surfaceStrength(customization.surface) === 0 || preset.customization.color === customization.color) && !customization.appearance &&
    (preset.icons ?? "hugeicons") === icons
    )?.id;
    // The default themes on a site that follows the device are Auto.
    return (match === "light" || match === "dark") && theme === "system" ? "auto" : match ?? "custom";
  });
  const [customizing, setCustomizing] = useState(false);
  // Auto follows the device's light or dark; only a custom theme can ask for it. Density belongs to Custom too: a preset leaves the site's alone.
  const [auto, setAuto] = useState(() => theme === "system" && (selected === "custom" || selected === "auto"));
  const [previewDensity, setPreviewDensity] = useState<DensityMode>(density);
  // The icon pack: a preset names its own, Custom keeps the one chosen in its settings.
  const [previewIcons, setPreviewIcons] = useState<IconPackName>(icons);
  const [initialCustomDraft] = useState(loadCustomDraft);
  const customDraft = useRef<CustomDraft | null>(initialCustomDraft);
  useEffect(() => {
    if (!auto) return;
    const query = window.matchMedia("(prefers-color-scheme: light)");
    const sync = () => setPreviewTheme(query.matches ? "light" : "dark");
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, [auto]);
  useEffect(() => {
    if (selected !== "custom") return;
    const draft = { mono, input, custom, theme: previewTheme, auto, density: previewDensity, icons: previewIcons };
    customDraft.current = draft;
    saveCustomDraft(draft);
  }, [selected, mono, input, custom, previewTheme, auto, previewDensity, previewIcons]);
  const choosePreset = (id: string) => {
    if (selected === "custom") {
      customDraft.current = { mono, input, custom, theme: previewTheme, auto, density: previewDensity, icons: previewIcons };
      saveCustomDraft(customDraft.current);
    }
    setSelected(id);
    if (id === "auto") {
      setMono(true);
      setInput({ name: "acme", color: DEFAULT_COLOR, shape: "pill" });
      setCustom(THEME_PRESETS[0].customization);
      setAuto(true);
      setPreviewIcons("hugeicons");
      return;
    }
    if (id === "custom") {
      if (customDraft.current) {
        setMono(customDraft.current.mono);
        setInput(customDraft.current.input);
        setCustom(customDraft.current.custom);
        setPreviewTheme(customDraft.current.theme);
        setAuto(Boolean(customDraft.current.auto));
        if (customDraft.current.density) setPreviewDensity(customDraft.current.density);
        if (customDraft.current.icons) setPreviewIcons(customDraft.current.icons);
      }
      return;
    }
    setAuto(false);
    const preset = THEME_PRESETS.find((item) => item.id === id);
    if (!preset) return;
    setMono(!preset.brand);
    setInput(preset.brand ?? { name: "acme", color: DEFAULT_COLOR, shape: "pill" });
    setCustom(preset.customization);
    setPreviewTheme(preset.theme);
    setPreviewIcons(preset.icons ?? "hugeicons");
  };

  const result = useMemo(() => {
    if (mono) return { brand: null };
    try {
      return { brand: createBrand(input), input };
    } catch (error) {
      return { error: (error as Error).message };
    }
  }, [mono, input]);
  const draft: BrandInput | null = mono || result.error ? null : input;

  const hex = /^#[0-9a-f]{6}$/i.test(input.color) ? input.color : DEFAULT_COLOR;
  const fontSet = THEME_FONTS.find((set) => JSON.stringify(set.font ?? null) === JSON.stringify(input.font ?? null))?.id ?? "custom";
  const surfaceLevel = levelOf(custom, mono).id;
  const scoped = (selector: string) =>
    result.error ? "" : defaultsCss(selector) + (mono ? monoCss(input, selector) : result.brand ? brandCss(result.brand, { selector }) : "");
  const { appearance: _appearance, ...customColors } = custom;
  const customForSite: ThemeCustomization = mono && ((input.shape && input.shape !== "pill") || input.font)
    ? { ...customColors, appearance: { shape: input.shape, font: input.font } }
    : customColors;
  const sameAsSite = JSON.stringify(draft) === JSON.stringify(current ?? null) && (auto ? theme === "system" : previewTheme === resolve(theme)) && (selected !== "custom" || previewDensity === density) && previewIcons === icons && JSON.stringify(customForSite) === JSON.stringify(customization);
  const palette = createThemeCustomization(custom, draft?.color ?? null);
  const textColors = createThemeText(custom, palette);
  const presetPictures = useMemo(() => THEME_PRESETS.map((preset) => {
    const colors = createThemeCustomization(preset.customization, preset.brand?.color ?? null);
    const ink = createThemeText(preset.customization, colors)[preset.theme];
    const primary = preset.brand ? createBrand(preset.brand)[preset.theme].primary : ink;
    const radius = preset.brand ? createBrand(preset.brand).radius : null;
    const picture = {
      "--ayy-color-bg": colors[preset.theme].bg, "--ayy-color-surface": colors[preset.theme].surface, "--ayy-color-text": ink, "--ayy-color-primary": primary,
      ...(radius ? { "--ayy-radius-control": radius.control, "--ayy-radius-card": radius.card, "--ayy-radius-button": radius.button } : {}),
    } as CSSProperties;
    return { preset, picture };
  }), []);
  const autoPicture = useMemo(() => {
    const colors = createThemeCustomization(THEME_PRESETS[0].customization, null);
    return {
      ...Object.fromEntries((["bg", "surface"] as const).map((name) => [`--ayy-color-${name}`, `light-dark(${colors.light[name]}, ${colors.dark[name]})`])),
      "--ayy-color-text": lightDark("color.text"), "--ayy-color-primary": lightDark("color.primary"),
    } as CSSProperties;
  }, []);
  const sampleStyle = {
    ...Object.fromEntries((["bg", "surface", "surface-raised"] as const).map((name) => [`--ayy-color-${name}`, `light-dark(${palette.light[name]}, ${palette.dark[name]})`])),
    "--ayy-color-glass": `light-dark(${palette.light.bg}c7, ${palette.dark.surface}c7)`,
    "--ayy-color-text": custom.textColor ? `light-dark(${textColors.light}, ${textColors.dark})` : lightDark("color.text"),
  } as CSSProperties;

  const groups = [
    { id: "dark", label: "Dark", presets: presetPictures.filter(({ preset }) => preset.theme === "dark") },
    { id: "light", label: "Light", presets: presetPictures.filter(({ preset }) => preset.theme === "light") },
  ];
  const selectedPreset = THEME_PRESETS.find((preset) => preset.id === selected);
  const selectedLabel = selected === "custom" ? "Custom" : selected === "auto" ? "Auto" : selectedPreset?.brand ? selectedPreset.label : `Default ${selectedPreset?.theme}`;
  const pickerName = "pv-theme-preset";

  const mode: ThemeMode = auto ? "system" : previewTheme;
  const chosenFont = THEME_FONTS.find((set) => JSON.stringify(set.font ?? null) === JSON.stringify(input.font ?? null));
  const fontsUrl = input.font && chosenFont ? themeFontsUrl([chosenFont]) : "";
  const appliedDensity = selected === "custom" ? previewDensity : undefined;
  const [usage, setUsage] = useState("prompt");
  const isCustomDefault = mono && surfaceStrength(custom.surface) === 0 && custom.contrast === 0 && !custom.textColor && !custom.appearance && (input.shape ?? "pill") === "pill" && !input.font && auto && previewDensity === "auto" && previewIcons === "hugeicons";
  /** Back to where Custom starts: monochrome, neutral, pill corners, ayywi's fonts, following the device. */
  const resetCustom = () => {
    setMono(true);
    setInput({ name: "acme", color: DEFAULT_COLOR, shape: "pill" });
    setCustom(DEFAULT_THEME_CUSTOMIZATION);
    setAuto(true);
    setPreviewDensity("auto");
    setPreviewIcons("hugeicons");
  };

  /** The whole preview area wears the chosen theme (surfaces, text, fonts, colours), so none of it is the site's. */
  const stage = (id: string, compact = false) => (
    <section className="pv-themer__stage" aria-labelledby={id} data-theme={previewTheme} data-density={resolveDensity(selected === "custom" ? previewDensity : density)} data-ayy-icons={previewIcons} style={sampleStyle}>
      <header className="pv-themer__stage-header">
        <h2 className="ayy-h6" id={id}>Live preview · {selectedLabel}</h2>
        {!compact && <p className="pv-note">{sameAsSite ? "This is the theme your site uses." : "Preview only. Nothing changes on the site until you choose Use this theme."}</p>}
      </header>
      <div className="pv-themer__sample ayy-stack" data-theme={previewTheme} style={sampleStyle}>
        <BrandApp name={selectedLabel} icon={THEME_ICONS[selected]} />
        <div className="ayy-spread" role="group" aria-label="Sample glyphs">
          {SAMPLE_ICONS.map(({ icon, name, directional }) => <Icon key={name} icon={icon} name={name} directional={directional} size="lg" />)}
        </div>
      </div>
    </section>
  );

  return (
    <article className="pv-page pv-themes-page">
      <header className="pv-page__header">
        <h1 className="ayy-h3" id="themes-title">
          Themes
        </h1>
        <p className="pv-note">Choose a ready-made look or make your own, and see it on a small app before you apply it to the site.</p>
      </header>

      {/* The brand is scoped to the preview, so the site keeps its own until "Use this theme". */}
      <style>{scoped(".pv-themer__stage")}</style>

      <section className="pv-themer" aria-labelledby="themes-title">
        <div className="pv-themer__panel">
          <section className="pv-themer__group" aria-labelledby="themes-default">
            <h2 className="ayy-eyebrow pv-themer__group-title" id="themes-default">Default</h2>
            <SettingsPicker name={pickerName} aria-labelledby="themes-default" value={selected} onValueChange={choosePreset}>
              <SettingsOption value="auto" label="Auto" preview={<SettingsScreen variant="brand" theme="system" style={autoPicture} />} />
              <div className="pv-themer__custom">
                <SettingsOption value="custom" label="Custom" preview={<SettingsScreen variant="brand" theme={previewTheme} style={sampleStyle} />} />
                <span className="pv-themer__cog">
                  <Tooltip content="Customize theme">
                    <Button
                      variant="primary"
                      size="icon-sm"
                      aria-label="Customize theme"
                      onClick={() => {
                        choosePreset("custom");
                        setCustomizing(true);
                      }}
                    >
                      <Icon icon={Settings01Icon} name="settings" />
                    </Button>
                  </Tooltip>
                </span>
              </div>
            </SettingsPicker>
          </section>
          {groups.map((group) => (
            <section className="pv-themer__group" key={group.id} aria-labelledby={`themes-${group.id}`}>
              <h2 className="ayy-eyebrow pv-themer__group-title" id={`themes-${group.id}`}>{group.label}</h2>
              <SettingsPicker name={pickerName} aria-labelledby={`themes-${group.id}`} value={selected} onValueChange={choosePreset}>
                {group.presets.map(({ preset, picture }) => (
                  <SettingsOption key={preset.id} value={preset.id} label={preset.brand ? preset.label : "Default"} inputProps={preset.brand ? undefined : { "aria-label": `Default ${preset.theme}` }} preview={<SettingsScreen variant="brand" theme={preset.theme} style={picture} />} />
                ))}
              </SettingsPicker>
            </section>
          ))}

          <div className="pv-themer__actions ayy-cluster">
            <Button
              disabled={sameAsSite}
              onClick={() => {
                onUse(draft);
                setTheme(auto ? "system" : previewTheme);
                if (selected === "custom") setDensity(previewDensity);
                setIcons(previewIcons);
                setCustomization(customForSite);
              }}
            >
              Use this theme
            </Button>
            <Button
              variant="ghost"
              disabled={!current && mono && JSON.stringify(custom) === JSON.stringify(DEFAULT_THEME_CUSTOMIZATION) && icons === "hugeicons" && previewIcons === "hugeicons"}
              onClick={() => {
                setSelected("custom");
                customDraft.current = null;
                setInput({ name: "acme", color: DEFAULT_COLOR, shape: "pill" });
                setMono(true);
                onUse(null);
                setCustom(DEFAULT_THEME_CUSTOMIZATION);
                setCustomization(DEFAULT_THEME_CUSTOMIZATION);
                setPreviewIcons("hugeicons");
                setIcons("hugeicons");
              }}
            >
              Reset to default
            </Button>
          </div>
          {result.error && (
            <Alert variant="destructive">
              <AlertDescription>{result.error}</AlertDescription>
            </Alert>
          )}
        </div>

        {customizing ? <div className="pv-themer__stage" aria-hidden="true" /> : stage("themes-preview")}
      </section>

      <Dialog open={customizing} onOpenChange={setCustomizing}>
        <DialogContent size="xl" className="pv-themer__dialog">
          <DialogHeader>
            <DialogTitle>Custom theme</DialogTitle>
            <DialogDescription>Changes show in the live preview as you make them.</DialogDescription>
          </DialogHeader>
          <DialogBody>
            <div className="pv-themer__customize">
              <div className="pv-themer__scroll ayy-scrollbar">
                <div className="pv-themer__controls">
                  <Field>
                    <span className="ayy-label" id="pv-theme-mode">Mode</span>
                    <SegmentedControl
                      full
                      aria-labelledby="pv-theme-mode"
                      value={auto ? "system" : previewTheme}
                      onValueChange={(v) => {
                        setAuto(v === "system");
                        if (v !== "system") setPreviewTheme(v as ThemeName);
                      }}
                    >
                      <SegmentedControlItem value="system">Auto</SegmentedControlItem>
                      {themeOptions.filter((t) => t.name === "light" || t.name === "dark").sort((a, b) => Number(b.name === "light") - Number(a.name === "light")).map((t) => (
                        <SegmentedControlItem key={t.name} value={t.name}>{t.label}</SegmentedControlItem>
                      ))}
                    </SegmentedControl>
                  </Field>

                  <Field>
                    <span className="ayy-label" id="pv-theme-colour">Accent colour</span>
                    <ColorSwatchGroup track role="group" aria-labelledby="pv-theme-colour" className="pv-brand__swatches">
                      {BRAND_PRESETS.map((p) => (
                        <Tooltip key={p.name} content={p.label}>
                          <ColorSwatchButton
                            color={p.color}
                            label={p.label}
                            pressed={p.isMono ? mono : !mono && input.color.toLowerCase() === p.color.toLowerCase()}
                            onClick={() => {
                              const level = levelOf(custom, mono);
                              if (p.isMono) {
                                setCustom(withLevel(custom, true, level));
                                return setMono(true);
                              }
                              setCustom(withLevel({ ...custom, color: p.color }, false, level));
                              setMono(false);
                              setInput({ ...input, name: p.name, color: p.color, shape: p.shape ?? input.shape });
                            }}
                          />
                        </Tooltip>
                      ))}
                      <Tooltip content="Custom colour">
                        <ColorSwatchCustom
                          label="Custom accent colour"
                          value={hex}
                          onChange={(e) => {
                            setMono(false);
                            setCustom(withLevel({ ...custom, color: e.target.value }, false, levelOf(custom, mono)));
                            setInput({ ...input, name: "acme", color: e.target.value });
                          }}
                        />
                      </Tooltip>
                    </ColorSwatchGroup>
                  </Field>

                  <Field>
                    <span className="ayy-label" id="pv-theme-surface">Surface</span>
                    <SegmentedControl full aria-labelledby="pv-theme-surface" value={surfaceLevel} onValueChange={(v) => setCustom(withLevel(custom, mono, SURFACE_LEVELS.find((level) => level.id === v) ?? SURFACE_LEVELS[0]))}>
                      {SURFACE_LEVELS.map((level) => (
                        <SegmentedControlItem key={level.id} value={level.id}>{level.label}</SegmentedControlItem>
                      ))}
                    </SegmentedControl>
                  </Field>

                  <Field>
                    <span className="ayy-label" id="pv-theme-shape">Corners</span>
                    <SegmentedControl full aria-labelledby="pv-theme-shape" value={input.shape ?? "pill"} onValueChange={(v) => setInput({ ...input, shape: v as BrandShape })}>
                      {SHAPES.map((s) => (
                        <SegmentedControlItem key={s} value={s}>{label(s)}</SegmentedControlItem>
                      ))}
                    </SegmentedControl>
                  </Field>

                  <Field>
                    <Label htmlFor="pv-theme-font">Font</Label>
                    <Select id="pv-theme-font" value={fontSet} onChange={(e) => setInput({ ...input, font: THEME_FONTS.find((set) => set.id === e.target.value)?.font })}>
                      {fontSet === "custom" && <option value="custom">Custom</option>}
                      {THEME_FONTS.map((set) => (
                        <option key={set.id} value={set.id}>{set.label}</option>
                      ))}
                    </Select>
                    <p className="pv-note">{THEME_FONTS.find((set) => set.id === fontSet)?.description ?? "Your own fonts"}</p>
                  </Field>

                  <Field>
                    <Label htmlFor="pv-theme-density">Density</Label>
                    <Select id="pv-theme-density" value={previewDensity} onChange={(e) => setPreviewDensity(e.target.value as DensityMode)}>
                      {DENSITIES.map(([value, text]) => (
                        <option key={value} value={value}>{text}</option>
                      ))}
                    </Select>
                  </Field>

                  <Field>
                    <Label htmlFor="pv-theme-icons">Icons</Label>
                    <Select id="pv-theme-icons" value={previewIcons} onChange={(e) => setPreviewIcons(e.target.value as IconPackName)}>
                      {iconPacks.map((pack) => (
                        <option key={pack} value={pack}>{iconPackInfo[pack].label}</option>
                      ))}
                    </Select>
                    <p className="pv-note"><a href="#/docs/icons">Every icon in each pack</a></p>
                  </Field>

                </div>
              </div>
              {stage("themes-preview-custom", true)}
            </div>
          </DialogBody>
          <DialogFooter>
            <Button variant="ghost" className="pv-themer__reset" disabled={isCustomDefault} onClick={resetCustom}>
              Reset theme
            </Button>
            <DialogClose variant="primary">Done</DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <section className="pv-section pv-themer__guide" aria-labelledby="themes-usage">
        <h2 className="pv-h pv-h--section" id="themes-usage">Using themes</h2>
        <p className="pv-note">Start with a preset, or choose Custom to create a look for your product.</p>
        <div className="pv-usage">
          <section className="pv-section" aria-labelledby="themes-possibilities">
            <h3 className="ayy-h5" id="themes-possibilities">What you can change</h3>
            <ul className="pv-list">
              <li>Choose light or dark, or follow the device setting in your app.</li>
              <li>Pick an accent and tint the page, panels and navigation with your own colour.</li>
              <li>Adjust text colour, contrast, fonts and corners. Custom settings stay saved in this preview.</li>
              <li>Swap the built-in icons for another pack: Lucide, Tabler Icons, Material Symbols or Feather. <a href="#/docs/icons">See every icon in each</a>.</li>
            </ul>
          </section>
          <section className="pv-section" aria-labelledby="themes-rules">
            <h3 className="ayy-h5" id="themes-rules">Rules to follow</h3>
            <ul className="pv-list">
              <li>Use semantic tokens for surfaces and text so components follow the selected theme.</li>
              <li>Keep normal text at least 4.5:1 and essential controls and focus indicators at least 3:1 against their backgrounds.</li>
              <li>Check any app-specific colours, preserve visible focus and test forced-colour mode.</li>
              <li>Store the user's choices in your app if they should persist between visits.</li>
            </ul>
          </section>
        </div>
        <p className="pv-note">Use the theme you picked above in your app: give the prompt to any AI tool, or take the code.</p>
        <Tabs value={usage} onValueChange={setUsage}>
          <TabsList aria-label="Use this theme">
            <TabsTrigger value="prompt">Prompt</TabsTrigger>
            <TabsTrigger value="code">Code</TabsTrigger>
          </TabsList>
          <TabsContent value="prompt" className="pv-themer__prompt">
            <CodeBlock code={buildPrompt(themeRequest(selectedLabel ?? "Custom", draft, customForSite, mode, appliedDensity, chosenFont, fontsUrl, previewIcons))} label="prompt" copyLabel="Copy prompt" wrap />
          </TabsContent>
          <TabsContent value="code">
            <CodeBlock code={snippet(draft, customForSite, mode, appliedDensity, fontsUrl, previewIcons)} label="code" language="sh" wrap />
          </TabsContent>
        </Tabs>
      </section>

      {selected === "custom" && <>
      <style>{scoped(".pv-brand-live")}</style>
      <section className="pv-brand-live pv-section" aria-labelledby="themes-every">
        <h2 className="pv-h pv-h--section" id="themes-every">
          In light and dark
        </h2>
        <p className="pv-note">The same title, text and action in each theme, so you can check your colour reads well in all of them.</p>
        <div className="pv-themes pv-themes--stack">
          {themeOptions.filter((t) => t.name === "light" || t.name === "dark").map((t) => (
            <Sample key={t.name} theme={t.name} label={t.label} style={sampleStyle} />
          ))}
        </div>

        <h2 className="pv-h pv-h--section" id="brand-scale">
          Scale
        </h2>
        <p className="pv-note">
          The shade marked seed is the closest to your colour, and the rest are built around it. Primary buttons and the focus ring take
          their colours from here.
        </p>
        <Scale brand={result.brand ?? null} />
      </section>
      </>}
    </article>
  );
}
