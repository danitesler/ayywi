import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { ArrowRight01Icon, Cancel01Icon, ContrastIcon, DropletIcon, Fire02Icon, Notification01Icon, PaintBrush01Icon, Search01Icon, Settings01Icon, SnowflakeIcon, StarsIcon, Tick02Icon, Tree01Icon } from "@hugeicons/core-free-icons";
import { bodyFontAdjust, brandCss, createBrand, createThemeCustomization, createThemeText, iconPackInfo, iconPacks, surfaceStrength, THEME_PRESETS, THEME_FONTS, themeFontsUrl, tokens, DEFAULT_THEME_CUSTOMIZATION, type ThemeCustomization, type BrandInput, type BrandShape, type DensityMode, type IconName, type IconPackName, type ThemeMode, type ThemeName } from "@danitesler/ayywi";
import {
  Alert,
  AlertDescription,
  Badge,
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Icon,
  IconTile,
  SettingsOption,
  SettingsPicker,
  SettingsScreen,
  ColorSwatchButton,
  ColorSwatchCustom,
  ColorSwatchGroup,
  Field,
  Label,
  Popover,
  PopoverContent,
  PopoverTrigger,
  SegmentedControl,
  SegmentedControlItem,
  Select,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Tooltip,
} from "@danitesler/ayywi/react";
import { CodeBlock } from "../CodeBlock";
import { buildPrompt } from "../prompts";
import { themeOptions } from "../themes";
import { BRAND_PRESETS, SHAPES } from "./Brand";
import { BrandApp, type BrandIcon } from "./BrandDemo";

/** A theme's own settings: what Customize edits and Custom keeps while another theme is picked. The mode is the page's. */
type ThemeDraft = { mono: boolean; input: BrandInput; custom: ThemeCustomization; density: DensityMode; icons: IconPackName };
const DENSITIES: [DensityMode, string][] = [["auto", "Auto"], ["compact", "Compact"], ["comfortable", "Comfortable"], ["touch", "Touch"]];
/** What "auto" density is on this device: touch on a coarse pointer, compact otherwise. */
const resolveDensity = (density: DensityMode) => density !== "auto" ? density : window.matchMedia("(pointer: coarse)").matches ? "touch" : "compact";

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
  default: { icon: ContrastIcon, name: "contrast" },
  custom: { icon: PaintBrush01Icon, name: "paintbrush" },
  ember: { icon: Fire02Icon, name: "flame" },
  forest: { icon: Tree01Icon, name: "tree" },
  arctic: { icon: SnowflakeIcon, name: "snowflake" },
  twilight: { icon: StarsIcon, name: "stars" },
  wine: { icon: DropletIcon, name: "droplet" },
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

const FEATURES = [
  { tag: "Plan", title: "Roadmaps", text: "Lay out the quarter and share it with one link." },
  { tag: "Track", title: "Projects", text: "See what moved this week without asking around." },
  { tag: "Review", title: "Reports", text: "Send the numbers every Monday, written for people." },
];

/** A small website in the chosen theme: a header, a hero beside a report card, three cards and a footer of glyphs. */
function ThemeSite({ name, icon = THEME_ICONS.default }: { name: string; icon?: BrandIcon }) {
  return (
    <div className="pv-site-sample">
      <header className="pv-site-sample__nav">
        <span className="pv-brand-demo__logo">
          <IconTile spotColor="var(--ayy-color-primary)">
            <Icon icon={icon.icon} name={icon.name} />
          </IconTile>
          {name}
        </span>
        <div className="pv-site-sample__links ayy-cluster" role="group" aria-label="Sample site sections">
          <Button variant="secondary" size="sm">Overview</Button>
          <Button variant="ghost" size="sm">Projects</Button>
          <Button variant="ghost" size="sm">Pricing</Button>
        </div>
        <div className="ayy-cluster pv-site-sample__actions">
          <Button variant="ghost" size="icon-sm" aria-label="Search">
            <Icon icon={Search01Icon} name="search" />
          </Button>
          <Button size="sm">Sign in</Button>
        </div>
      </header>

      <section className="pv-site-sample__hero" aria-label="Sample hero">
        <div className="pv-site-sample__copy">
          <Badge variant="outline">New in version 2</Badge>
          <h3 className="pv-site-sample__title">Plan less, ship more.</h3>
          <p className="pv-site-sample__lead">Roadmaps, reports and reviews in one calm place. Every colour, corner and font here comes from the theme.</p>
          <div className="ayy-cluster">
            <Button>Start free</Button>
            <Button variant="outline">Book a demo</Button>
          </div>
        </div>
        <BrandApp name="Weekly report" icon={icon} />
      </section>

      <div className="pv-site-sample__cards">
        {FEATURES.map((feature) => (
          <Card key={feature.title}>
            <CardHeader className="ayy-stack">
              <Badge variant="outline">{feature.tag}</Badge>
              <h4 className="ayy-h5">{feature.title}</h4>
            </CardHeader>
            <CardContent>
              <p className="pv-site-sample__text">{feature.text}</p>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" size="sm">
                Open {feature.title.toLowerCase()}
                <Icon icon={ArrowRight01Icon} name="chevron-right" directional />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <footer className="ayy-spread pv-site-sample__footer">
        <span>© 2026 {name} Inc.</span>
        <div className="ayy-cluster" role="group" aria-label="Sample glyphs">
          {SAMPLE_ICONS.map(({ icon: glyph, name: glyphName, directional }) => <Icon key={glyphName} icon={glyph} name={glyphName} directional={directional} />)}
        </div>
      </footer>
    </div>
  );
}

/** A preset's picture in the list: its light and dark screens side by side. */
function presetPicture(brand: BrandInput | null, customization: ThemeCustomization): CSSProperties {
  const colors = createThemeCustomization(customization, brand?.color ?? null);
  const ink = createThemeText(customization, colors);
  const made = brand ? createBrand(brand) : null;
  return {
    ...Object.fromEntries((["bg", "surface"] as const).map((name) => [`--ayy-color-${name}`, `light-dark(${colors.light[name]}, ${colors.dark[name]})`])),
    "--ayy-color-text": customization.textColor ? `light-dark(${ink.light}, ${ink.dark})` : lightDark("color.text"),
    "--ayy-color-primary": made ? `light-dark(${made.light.primary}, ${made.dark.primary})` : lightDark("color.primary"),
    ...(made ? { "--ayy-radius-control": made.radius.control, "--ayy-radius-card": made.radius.card, "--ayy-radius-button": made.radius.button } : {}),
  } as CSSProperties;
}

/**
 * #/themes: a list of themes on the start side, a small website wearing the chosen one on the end side. Every theme comes
 * in light and dark; the pictures in the list follow the chosen mode. Picking a theme applies it to the site at once, for this tab only: a reload starts from Default.
 * The cog beside a theme opens its settings; saving a change makes it the Custom theme.
 */
export function ThemesPage({ current, onUse, theme, setTheme, density, setDensity, icons, setIcons, customization, setCustomization }: { current: BrandInput | null; onUse: (brand: BrandInput | null) => void; theme: ThemeMode; setTheme: (theme: ThemeMode) => void; density: DensityMode; setDensity: (density: DensityMode) => void; icons: IconPackName; setIcons: (icons: IconPackName) => void; customization: ThemeCustomization; setCustomization: (value: ThemeCustomization) => void }) {
  const [custom, setCustom] = useState(customization);
  const [mono, setMono] = useState(!current);
  const [input, setInput] = useState<BrandInput>(() => current ?? { name: "acme", color: DEFAULT_COLOR, shape: customization.appearance?.shape ?? "pill", font: customization.appearance?.font });
  const [previewTheme, setPreviewTheme] = useState<ThemeName>(() => resolve(theme));
  const [selected, setSelected] = useState(() =>
    THEME_PRESETS.find((preset) =>
      sameBrand(preset.brand, current) &&
      surfaceStrength(preset.customization.surface) === surfaceStrength(customization.surface) &&
      preset.customization.contrast === customization.contrast && preset.customization.textColor === customization.textColor &&
      (surfaceStrength(customization.surface) === 0 || preset.customization.color === customization.color) && !customization.appearance &&
      (preset.icons ?? "hugeicons") === icons
    )?.id ?? "custom");
  // Auto follows the device's light or dark.
  const [auto, setAuto] = useState(() => theme === "system");
  // Density belongs to Custom: a preset leaves the site's alone.
  const [previewDensity, setPreviewDensity] = useState<DensityMode>(density);
  // The icon pack: a preset names its own, Custom keeps the one chosen in its settings.
  const [previewIcons, setPreviewIcons] = useState<IconPackName>(icons);
  // Custom's settings, in memory only, so a new tab or a reload starts from Default.
  const customDraft = useRef<ThemeDraft | null>(selected === "custom" ? { mono, input, custom, density: previewDensity, icons: previewIcons } : null);
  // While the settings dialog is open: the theme it was opened on, and everything as it was, for Cancel.
  const [editing, setEditing] = useState<{ id: string; before: ThemeDraft; selected: string } | null>(null);
  useEffect(() => {
    if (!auto) return;
    const query = window.matchMedia("(prefers-color-scheme: light)");
    const sync = () => setPreviewTheme(query.matches ? "light" : "dark");
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, [auto]);

  const snapshot = (): ThemeDraft => ({ mono, input, custom, density: previewDensity, icons: previewIcons });
  const load = (draft: ThemeDraft) => {
    setMono(draft.mono);
    setInput(draft.input);
    setCustom(draft.custom);
    setPreviewDensity(draft.density);
    setPreviewIcons(draft.icons);
  };
  const presetDraft = (id: string): ThemeDraft | null => {
    if (id === "custom") return customDraft.current;
    const preset = THEME_PRESETS.find((item) => item.id === id);
    if (!preset) return null;
    return { mono: !preset.brand, input: preset.brand ?? { name: "acme", color: DEFAULT_COLOR, shape: "pill" }, custom: preset.customization, density, icons: preset.icons ?? "hugeicons" };
  };
  const choosePreset = (id: string) => {
    if (selected === "custom") customDraft.current = snapshot();
    setSelected(id);
    const next = presetDraft(id);
    if (next) load(next);
  };
  /** Opens a theme's settings, filled in with that theme. */
  const customize = (id: string) => {
    setEditing({ id, before: snapshot(), selected });
    if (selected === "custom") customDraft.current = snapshot();
    const next = presetDraft(id);
    if (next) load(next);
  };
  /** Save: unchanged, it's that theme; changed, it becomes Custom. */
  const saveCustom = () => {
    if (!editing) return;
    const now = snapshot();
    const start = presetDraft(editing.id);
    const changed = !start || JSON.stringify({ ...now, density: null }) !== JSON.stringify({ ...start, density: null }) || (editing.id === "custom" ? now.density !== start.density : now.density !== density);
    const id = editing.id === "custom" || changed ? "custom" : editing.id;
    if (id === "custom") customDraft.current = now;
    setSelected(id);
    setEditing(null);
  };
  const cancelCustom = () => {
    if (!editing) return;
    load(editing.before);
    setSelected(editing.selected);
    setEditing(null);
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
  const mode: ThemeMode = auto ? "system" : previewTheme;
  const appliedDensity = selected === "custom" ? previewDensity : undefined;

  // Whatever is picked is the site's theme (the dialog's edits wait for Save).
  const applied = JSON.stringify([draft, customForSite, mode, previewIcons, appliedDensity ?? null]);
  useEffect(() => {
    if (editing) return;
    if (JSON.stringify(draft) !== JSON.stringify(current ?? null)) onUse(draft);
    if (theme !== mode && !(mode !== "system" && resolve(theme) === mode && theme !== "system")) setTheme(mode);
    if (appliedDensity && appliedDensity !== density) setDensity(appliedDensity);
    if (previewIcons !== icons) setIcons(previewIcons);
    if (JSON.stringify(customForSite) !== JSON.stringify(customization)) setCustomization(customForSite);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- applied is the key of everything above
  }, [applied, editing]);

  const palette = createThemeCustomization(custom, draft?.color ?? null);
  const textColors = createThemeText(custom, palette);
  const presetPictures = useMemo(() => THEME_PRESETS.map((preset) => ({ preset, picture: presetPicture(preset.brand, preset.customization) })), []);
  const customSource = selected === "custom" ? { mono, input, custom } : customDraft.current;
  const customPicture = presetPicture(customSource && !customSource.mono ? customSource.input : null, customSource?.custom ?? DEFAULT_THEME_CUSTOMIZATION);
  const sampleStyle = {
    ...Object.fromEntries((["bg", "surface", "surface-raised"] as const).map((name) => [`--ayy-color-${name}`, `light-dark(${palette.light[name]}, ${palette.dark[name]})`])),
    "--ayy-color-glass": `light-dark(${palette.light.bg}c7, ${palette.dark.surface}c7)`,
    "--ayy-color-text": custom.textColor ? `light-dark(${textColors.light}, ${textColors.dark})` : lightDark("color.text"),
  } as CSSProperties;

  const shownId = editing ? editing.id : selected;
  const selectedLabel = shownId === "custom" ? "Custom" : THEME_PRESETS.find((preset) => preset.id === shownId)?.label ?? "Default";
  const pickerName = "pv-theme-preset";

  const chosenFont = THEME_FONTS.find((set) => JSON.stringify(set.font ?? null) === JSON.stringify(input.font ?? null));
  const fontsUrl = input.font && chosenFont ? themeFontsUrl([chosenFont]) : "";
  const isCustomDefault = mono && surfaceStrength(custom.surface) === 0 && custom.contrast === 0 && !custom.textColor && !custom.appearance && (input.shape ?? "pill") === "pill" && !input.font && previewDensity === "auto" && previewIcons === "hugeicons";
  /** Back to where Custom starts: monochrome, neutral, pill corners, ayywi's fonts. */
  const resetCustom = () => {
    setMono(true);
    setInput({ name: "acme", color: DEFAULT_COLOR, shape: "pill" });
    setCustom(DEFAULT_THEME_CUSTOMIZATION);
    setPreviewDensity("auto");
    setPreviewIcons("hugeicons");
  };

  /** Auto, Light or Dark: the preview's mode, and the site's. */
  const modeControl = (
    <SegmentedControl
      full
      aria-label="Mode"
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
  );

  /** The whole preview area wears the chosen theme (surfaces, text, fonts, colours), so none of it is the site's. */
  const stage = (labelledBy: string) => (
    <section className="pv-themer__stage" aria-labelledby={labelledBy} data-theme={previewTheme} data-density={resolveDensity(selected === "custom" || editing ? previewDensity : density)} data-ayy-icons={previewIcons} style={sampleStyle}>
      <div className="pv-themer__sample" data-theme={previewTheme} style={sampleStyle}>
        <ThemeSite name={selectedLabel} icon={THEME_ICONS[shownId]} />
      </div>
    </section>
  );

  const items = [...presetPictures.map(({ preset, picture }) => ({ id: preset.id, name: preset.label, picture })), { id: "custom", name: "Custom", picture: customPicture }];

  return (
    <article className="pv-page pv-themes-page">
      {/* The brand is scoped to the preview, so the page around it keeps the site's own. */}
      <style>{scoped(".pv-themer__stage")}</style>

      <section className="pv-themer" aria-labelledby="themes-title">
        <div className="pv-themer__panel">
          <h1 className="ayy-h4" id="themes-title">Themes</h1>
          {modeControl}
          {result.error && (
            <Alert variant="destructive">
              <AlertDescription>{result.error}</AlertDescription>
            </Alert>
          )}
          <SettingsPicker className="pv-themer__list" name={pickerName} aria-label="Themes" value={selected} onValueChange={choosePreset}>
            {items.map(({ id, name, picture }) => (
              <div className="pv-themer__item" key={id}>
                <SettingsOption
                  value={id}
                  label={<span className="pv-themer__name">{name}</span>}
                  preview={<SettingsScreen variant="brand" theme={previewTheme} style={picture} />}
                />
                <span className="pv-themer__cog">
                  <Tooltip content={`Customize ${name}`}>
                    <Button variant="ghost" size="icon-sm" aria-label={`Customize ${name}`} onClick={() => customize(id)}>
                      <Icon icon={Settings01Icon} name="settings" />
                    </Button>
                  </Tooltip>
                </span>
              </div>
            ))}
          </SettingsPicker>
        </div>

        <div className="pv-themer__main">
          <header className="pv-themer__head">
            <h2 className="ayy-h6" id="themes-preview">{selectedLabel} · {previewTheme === "light" ? "Light" : "Dark"}</h2>
            <Popover>
              <PopoverTrigger variant="outline" size="sm">
                Copy for...
              </PopoverTrigger>
              <PopoverContent side="bottom" align="end" aria-label={`Copy for ${selectedLabel}`} className="pv-code-popover">
                <Tabs defaultValue="prompt">
                  <TabsList aria-label={`Copy options for ${selectedLabel}`}>
                    <TabsTrigger value="prompt">AI prompt</TabsTrigger>
                    <TabsTrigger value="code">Code</TabsTrigger>
                  </TabsList>
                  <TabsContent value="prompt">
                    <CodeBlock code={buildPrompt(themeRequest(selectedLabel, draft, customForSite, mode, appliedDensity, chosenFont, fontsUrl, previewIcons))} label="prompt" copyLabel="Copy prompt" wrap />
                  </TabsContent>
                  <TabsContent value="code">
                    <CodeBlock code={snippet(draft, customForSite, mode, appliedDensity, fontsUrl, previewIcons)} label="code" language="sh" wrap />
                  </TabsContent>
                </Tabs>
              </PopoverContent>
            </Popover>
          </header>
          {editing ? <div className="pv-themer__stage" aria-hidden="true" /> : stage("themes-preview")}
        </div>
      </section>

      <Dialog open={Boolean(editing)} onOpenChange={(open) => { if (!open) cancelCustom(); }}>
        <DialogContent size="xl" className="pv-themer__dialog">
          <DialogHeader>
            <DialogTitle>Customize {editing?.id === "custom" ? "Custom" : selectedLabel}</DialogTitle>
            <DialogDescription>Changes show in the preview as you make them. Saving a change makes it your Custom theme.</DialogDescription>
          </DialogHeader>
          <DialogBody>
            <div className="pv-themer__customize">
              <div className="pv-themer__scroll ayy-scrollbar">
                <div className="pv-themer__controls">
                  <Field>
                    <span className="ayy-label" id="pv-theme-mode">Mode</span>
                    {modeControl}
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
              {editing && stage("themes-preview")}
            </div>
          </DialogBody>
          <DialogFooter>
            <Button variant="ghost" className="pv-themer__reset" disabled={isCustomDefault} onClick={resetCustom}>
              Reset theme
            </Button>
            <DialogClose variant="outline">Cancel</DialogClose>
            <Button onClick={saveCustom}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </article>
  );
}
