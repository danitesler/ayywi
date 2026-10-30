import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { BRAND_SHAPES, iconPackInfo, iconPacks, setBrand, setDensity, setIconPack, setTheme, setThemeCustomization, surfaceStrength, THEME_FONTS, THEME_PRESETS, tokens, type BrandShape, type DensityMode, type IconPackName, type SurfaceStyle, type ThemeCustomization, type ThemeMode } from "@danitesler/ayywi";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  ColorSwatchButton,
  ColorSwatchCustom,
  ColorSwatchGroup,
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Field,
  FieldHint,
  Icon,
  Label,
  SegmentedControl,
  SegmentedControlItem,
  Select,
  Settings,
  SettingsLink,
  SettingsRow,
  SettingsScreen,
  Switch,
  Tooltip,
} from "@danitesler/ayywi/react";
import { Notification01Icon, Search01Icon, Settings01Icon } from "@hugeicons/core-free-icons";

const MODES: { value: ThemeMode; label: string }[] = [
  { value: "system", label: "System" },
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
];

const DIRECTIONS = [
  { value: "auto", label: "Auto" },
  { value: "ltr", label: "Left to right" },
  { value: "rtl", label: "Right to left" },
];

// Auto shows both halves: left to right, then right to left.
function DirectionScreen({ direction }: { direction: string }) {
  if (direction === "auto")
    return (
      <>
        <SettingsScreen dir="ltr" />
        <SettingsScreen dir="rtl" />
      </>
    );
  return <SettingsScreen dir={direction} />;
}

// One picture per option value, for a Select's pictures.
const picturesOf = <T extends { value: string }>(options: readonly T[], picture: (option: T) => ReactNode) =>
  Object.fromEntries(options.map((option) => [option.value, picture(option)]));

const MODE_PICTURES = picturesOf(MODES, (m) => <SettingsScreen theme={m.value} />);
// Each theme's accent as the nearest palette colour, drawn in the current mode; Default is monochrome, where primary is the text colour.
const THEME_ACCENTS: Record<string, string> = {
  default: "var(--ayy-color-text)",
  ember: "var(--ayy-palette-orange-65)",
  forest: "var(--ayy-palette-green-51)",
  arctic: "var(--ayy-palette-blue-68)",
  twilight: "var(--ayy-palette-violet-58)",
  wine: "var(--ayy-palette-red-71)",
};
const accentPicture = (accent: string) => <span className="ayy-swatch" style={{ "--ayy-swatch": THEME_ACCENTS[accent] ?? accent } as CSSProperties} />;

// What the customize dialog edits: a theme's accent (a theme's colour, or any colour), surfaces, corners, fonts, icons and density.
type ThemeSettings = { accent: string; surface: SurfaceStyle; shape: BrandShape; font: string; icons: IconPackName; density: DensityMode };
const DENSITIES: { value: DensityMode; label: string }[] = [
  { value: "auto", label: "Auto" },
  { value: "compact", label: "Compact" },
  { value: "comfortable", label: "Comfortable" },
  { value: "touch", label: "Touch" },
];
const settingsOf = (id: string): ThemeSettings => {
  const preset = THEME_PRESETS.find((p) => p.id === id) ?? THEME_PRESETS[0];
  const font = THEME_FONTS.find((f) => JSON.stringify(f.font ?? null) === JSON.stringify(preset.brand?.font ?? null));
  return { accent: preset.brand ? preset.id : "default", surface: preset.customization.surface as SurfaceStyle, shape: preset.brand?.shape ?? "pill", font: font?.id ?? "default", icons: preset.icons ?? "hugeicons", density: "auto" };
};
const ACCENTS = THEME_PRESETS.map((preset) => ({ value: preset.brand ? preset.id : "default", label: preset.brand ? preset.label : "Monochrome" }));
/** The accent's seed colour: a theme's own, a picked one, or null for monochrome. */
const colorOf = (accent: string) => (accent === "default" ? null : (THEME_PRESETS.find((p) => p.id === accent)?.brand?.color ?? accent));
const SHAPES = Object.keys(BRAND_SHAPES).map((shape) => ({ value: shape as BrandShape, label: shape.charAt(0).toUpperCase() + shape.slice(1) }));
const THEME_PICTURES = picturesOf(THEME_PRESETS.map((preset) => ({ value: preset.id })), (t) => accentPicture(t.value));

const tokenColor = (name: keyof typeof tokens) => {
  const token = tokens[name] as { value: unknown; light?: string };
  return `light-dark(${token.light ?? token.value}, ${token.value})`;
};
const stack = (fonts: readonly string[]) => fonts.map((f) => (f.includes(" ") ? `"${f}"` : f)).join(", ");
// Monochrome has no brand of its own, so the preview resets what a brand around it would set.
const MONO_STYLE = {
  "--ayy-color-primary": tokenColor("color.primary"),
  "--ayy-color-primary-fg": tokenColor("color.primary-fg"),
  "--ayy-color-ring": tokenColor("color.ring"),
  "--ayy-color-glow": tokenColor("color.glow"),
} as CSSProperties;
const MONO_FONTS = { "--ayy-font-heading": stack(tokens["font.heading"].value), "--ayy-font-body": stack(tokens["font.body"].value) } as CSSProperties;

/** Puts a theme's settings on an element: its brand (or monochrome with the corners and fonts), surfaces, icons and density. */
function applyTheme(el: HTMLElement, settings: ThemeSettings, name: string) {
  const color = colorOf(settings.accent);
  const { shape } = settings;
  const font = THEME_FONTS.find((f) => f.id === settings.font)?.font;
  setBrand(color ? { name, color, shape, font } : null, el);
  // Monochrome has no brand to carry corners and fonts, so the customization does.
  const customization: ThemeCustomization = { color: color ?? tokens["palette.neutral.58"].value, surface: settings.surface, contrast: 0, ...(color ? {} : { appearance: { shape, font } }) };
  setThemeCustomization(customization, el, color);
  setIconPack(settings.icons, el, { persist: false });
  setDensity(settings.density, el);
}
const DIRECTION_PICTURES = picturesOf(DIRECTIONS, (d) => <DirectionScreen direction={d.value} />);

const LANGUAGES = [
  { value: "en", label: "English", dir: "ltr" },
  { value: "de", label: "Deutsch", dir: "ltr" },
  { value: "he", label: "עברית", dir: "rtl" },
  { value: "ar", label: "العربية", dir: "rtl" },
] as const;

const DEFAULTS = {
  mode: "system" as ThemeMode,
  theme: "default",
  custom: settingsOf("default"),
  motion: false,
  language: "en",
  direction: "auto",
};

export default function Example() {
  const root = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<ThemeMode>(DEFAULTS.mode);
  const [theme, setThemeId] = useState<string>(DEFAULTS.theme);
  // The Custom theme, and the dialog's copy of whichever theme it was opened on.
  const [custom, setCustom] = useState<ThemeSettings>(DEFAULTS.custom);
  const [draft, setDraft] = useState<ThemeSettings | null>(null);
  const current = theme === "custom" ? custom : settingsOf(theme);
  const [motion, setMotion] = useState<boolean>(DEFAULTS.motion);
  const [language, setLanguage] = useState<string>(DEFAULTS.language);
  const [direction, setDirection] = useState<string>(DEFAULTS.direction);

  // Everything applies to this example only; in an app, target <html> (omit the element argument).
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    setTheme(mode, el);
    // A theme sets the accent, corners, fonts, surfaces and icons together.
    const preset = THEME_PRESETS.find((p) => p.id === theme);
    if (preset) {
      setBrand(preset.brand, el);
      const { customization } = preset;
      setThemeCustomization(surfaceStrength(customization.surface) === 0 && customization.contrast === 0 ? null : customization, el, preset.brand?.color ?? null);
      setIconPack(preset.icons ?? "hugeicons", el, { persist: false });
      setDensity("auto", el);
    } else {
      applyTheme(el, custom, "custom");
    }
    const lang = LANGUAGES.find((l) => l.value === language);
    el.lang = language;
    el.dir = direction === "auto" ? (lang?.dir ?? "ltr") : direction;
  }, [mode, theme, custom, language, direction]);

  /** Save: unchanged, it stays the theme it was opened on; changed, it becomes Custom. */
  const saveTheme = () => {
    if (!draft) return;
    if (theme === "custom" || JSON.stringify(draft) !== JSON.stringify(current)) {
      setCustom(draft);
      setThemeId("custom");
    }
    setDraft(null);
  };
  const edit = (patch: Partial<ThemeSettings>) => setDraft((d) => (d ? { ...d, ...patch } : d));
  // The dialog's live preview wears the draft.
  const [preview, setPreview] = useState<HTMLDivElement | null>(null);
  useEffect(() => {
    if (preview && draft) applyTheme(preview, draft, "theme-preview");
  }, [preview, draft]);
  const previewStyle = {
    flex: "999 1 20rem",
    display: "grid",
    placeItems: "center",
    padding: "var(--ayy-space-6)",
    border: "1px solid var(--ayy-color-line)",
    borderRadius: "var(--ayy-radius-card)",
    background: "var(--ayy-color-bg)",
    color: "var(--ayy-color-text)",
    fontFamily: "var(--ayy-font-body)",
    ...(draft && !colorOf(draft.accent) ? { ...MONO_STYLE, ...(draft.font === "default" ? MONO_FONTS : {}) } : {}),
  } as CSSProperties;
  useEffect(() => { const el = root.current; return () => { if (el) setThemeCustomization(null, el); }; }, []);

  return (
    <div ref={root} style={{ inlineSize: "100%", maxInlineSize: "42rem", fontFamily: "var(--ayy-font-body)" }}>
      <Settings title="Appearance" description="Light or dark, and the theme for the whole interface.">
        <SettingsRow label="Mode" htmlFor="set-mode" hint="System follows your device's light or dark setting.">
          <Select id="set-mode" aria-describedby="set-mode-hint" value={mode} onChange={(event) => setMode(event.currentTarget.value as ThemeMode)} pictures={MODE_PICTURES}>
            {MODES.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </Select>
        </SettingsRow>
        <SettingsRow label="Theme" htmlFor="set-theme" hint="Colour, corners, fonts and icons, in light and dark.">
          <Select id="set-theme" aria-describedby="set-theme-hint" value={theme} onChange={(event) => setThemeId(event.currentTarget.value)} pictures={{ ...THEME_PICTURES, custom: accentPicture(custom.accent) }}>
            {THEME_PRESETS.map((preset) => (
              <option key={preset.id} value={preset.id}>
                {preset.label}
              </option>
            ))}
            <option value="custom">Custom</option>
          </Select>
          <Button variant="outline" size="icon" aria-label="Customize theme" aria-haspopup="dialog" onClick={() => setDraft(current)}>
            <Icon icon={Settings01Icon} name="settings" />
          </Button>
        </SettingsRow>
      </Settings>
      <Dialog open={Boolean(draft)} onOpenChange={(open) => !open && setDraft(null)}>
        <DialogContent size="xl">
          <DialogHeader>
            <DialogTitle>Customize theme</DialogTitle>
            <DialogDescription>Changes show in the preview. Saving a change makes it your Custom theme.</DialogDescription>
          </DialogHeader>
          {draft && (
            <DialogBody>
              {/* Settings on the start side; the preview takes the rest of the width and their full height. */}
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "stretch", gap: "var(--ayy-space-5)" }}>
                <div className="ayy-stack" style={{ flex: "1 1 15rem", maxInlineSize: "20rem" }}>
                  <Field>
                    <span className="ayy-label" id="set-accent">Accent colour</span>
                    <ColorSwatchGroup track role="group" aria-labelledby="set-accent">
                      {ACCENTS.map((a) => (
                        <Tooltip key={a.value} content={a.label}>
                          <ColorSwatchButton color={THEME_ACCENTS[a.value]} label={a.label} pressed={draft.accent === a.value} onClick={() => edit({ accent: a.value })} />
                        </Tooltip>
                      ))}
                      <Tooltip content="Custom colour">
                        <ColorSwatchCustom label="Custom accent colour" value={colorOf(draft.accent) ?? tokens["palette.violet.58"].value} onChange={(event) => edit({ accent: event.currentTarget.value })} />
                      </Tooltip>
                    </ColorSwatchGroup>
                  </Field>
                  <Field>
                    <span className="ayy-label" id="set-surface">Surface</span>
                    <SegmentedControl full aria-labelledby="set-surface" value={draft.surface} onValueChange={(value) => edit({ surface: value as SurfaceStyle })}>
                      <SegmentedControlItem value="neutral">Neutral</SegmentedControlItem>
                      <SegmentedControlItem value="subtle">Subtle</SegmentedControlItem>
                    </SegmentedControl>
                  </Field>
                  <Field>
                    <span className="ayy-label" id="set-corners">Corners</span>
                    <SegmentedControl full aria-labelledby="set-corners" value={draft.shape} onValueChange={(value) => edit({ shape: value as BrandShape })}>
                      {SHAPES.map((shape) => (
                        <SegmentedControlItem key={shape.value} value={shape.value}>
                          {shape.label}
                        </SegmentedControlItem>
                      ))}
                    </SegmentedControl>
                  </Field>
                  <Field>
                    <Label htmlFor="set-font">Font</Label>
                    <Select id="set-font" aria-describedby="set-font-hint" value={draft.font} onChange={(event) => edit({ font: event.currentTarget.value })}>
                      {THEME_FONTS.map((f) => (
                        <option key={f.id} value={f.id}>
                          {f.label}
                        </option>
                      ))}
                    </Select>
                    <FieldHint id="set-font-hint">{THEME_FONTS.find((f) => f.id === draft.font)?.description}</FieldHint>
                  </Field>
                  <Field>
                    <Label htmlFor="set-icons">Icons</Label>
                    <Select id="set-icons" value={draft.icons} onChange={(event) => edit({ icons: event.currentTarget.value as IconPackName })}>
                      {iconPacks.map((pack) => (
                        <option key={pack} value={pack}>
                          {iconPackInfo[pack].label}
                        </option>
                      ))}
                    </Select>
                  </Field>
                  <Field>
                    <Label htmlFor="set-density">Density</Label>
                    <Select id="set-density" aria-describedby="set-density-hint" value={draft.density} onChange={(event) => edit({ density: event.currentTarget.value as DensityMode })}>
                      {DENSITIES.map((d) => (
                        <option key={d.value} value={d.value}>
                          {d.label}
                        </option>
                      ))}
                    </Select>
                    <FieldHint id="set-density-hint">Auto: compact with a mouse, touch on a touch screen.</FieldHint>
                  </Field>
                </div>
                <div ref={setPreview} role="group" aria-label="Preview" style={previewStyle}>
                  <Card style={{ inlineSize: "100%", maxInlineSize: "26rem" }}>
                    <CardHeader className="ayy-cluster">
                      <h3 className="ayy-h6">Weekly report</h3>
                      <Badge>Live</Badge>
                    </CardHeader>
                    <CardContent className="ayy-stack">
                      <p className="ayy-muted">Revenue is up 12% on last week.</p>
                      <Field inline>
                        <Switch id="set-preview-weekly" defaultChecked />
                        <Label htmlFor="set-preview-weekly">Every Monday</Label>
                      </Field>
                      <div className="ayy-cluster" aria-hidden="true">
                        <Icon icon={Search01Icon} name="search" />
                        <Icon icon={Notification01Icon} name="bell" />
                        <Icon icon={Settings01Icon} name="settings" />
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline">Preview</Button>
                      <Button>Send report</Button>
                    </CardFooter>
                  </Card>
                </div>
              </div>
            </DialogBody>
          )}
          <DialogFooter>
            <Button variant="ghost" style={{ marginInlineEnd: "auto" }} onClick={() => setDraft(settingsOf("default"))}>
              Reset
            </Button>
            <DialogClose variant="outline">Cancel</DialogClose>
            <Button onClick={saveTheme}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Settings title="Accessibility and language" description="Motion, the interface language and which way text reads.">
        <SettingsRow label="Reduce motion" htmlFor="set-motion" hint="Turns animations off, whatever the device is set to.">
          <Switch
            id="set-motion"
            aria-describedby="set-motion-hint"
            checked={motion}
            onCheckedChange={(next) => {
              setMotion(next);
              const el = root.current;
              if (!el) return;
              if (next) el.setAttribute("data-motion", "reduce");
              else el.removeAttribute("data-motion");
            }}
          />
        </SettingsRow>
        <SettingsRow label="Language" htmlFor="set-language">
          <Select id="set-language" value={language} onChange={(event) => setLanguage(event.currentTarget.value)}>
            {LANGUAGES.map((l) => (
              <option key={l.value} value={l.value} lang={l.value}>
                {l.label}
              </option>
            ))}
          </Select>
        </SettingsRow>
        <SettingsRow label="Text direction" htmlFor="set-direction" hint="Auto follows the language.">
          <Select
            id="set-direction"
            aria-describedby="set-direction-hint"
            value={direction}
            onChange={(event) => setDirection(event.currentTarget.value)}
            pictures={DIRECTION_PICTURES}
          >
            {DIRECTIONS.map((d) => (
              <option key={d.value} value={d.value}>
                {d.label}
              </option>
            ))}
          </Select>
        </SettingsRow>
      </Settings>
      <Settings title="Reset">
        <SettingsLink
          label="Reset appearance"
          hint="Mode, theme, motion and language go back to their defaults."
          destructive
          onClick={() => {
            setMode(DEFAULTS.mode);
            setThemeId(DEFAULTS.theme);
            setCustom(DEFAULTS.custom);
            setMotion(DEFAULTS.motion);
            setLanguage(DEFAULTS.language);
            setDirection(DEFAULTS.direction);
            root.current?.removeAttribute("data-motion");
          }}
        />
      </Settings>
    </div>
  );
}
