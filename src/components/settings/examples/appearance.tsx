import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { setBrand, setIconPack, setTheme, setThemeCustomization, surfaceStrength, THEME_PRESETS, type ThemeMode } from "@danitesler/ayywi";
import { Select, Settings, SettingsLink, SettingsRow, SettingsScreen, Switch } from "@danitesler/ayywi/react";

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
const THEME_PICTURES = picturesOf(THEME_PRESETS.map((preset) => ({ value: preset.id })), (t) => (
  <SettingsScreen variant="brand" style={{ "--ayy-color-primary": THEME_ACCENTS[t.value] } as CSSProperties} />
));
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
  motion: false,
  language: "en",
  direction: "auto",
};

export default function Example() {
  const root = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<ThemeMode>(DEFAULTS.mode);
  const [theme, setThemeId] = useState<string>(DEFAULTS.theme);
  const [motion, setMotion] = useState<boolean>(DEFAULTS.motion);
  const [language, setLanguage] = useState<string>(DEFAULTS.language);
  const [direction, setDirection] = useState<string>(DEFAULTS.direction);

  // Everything applies to this example only; in an app, target <html> (omit the element argument).
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    setTheme(mode, el);
    // A theme sets the accent, corners, fonts, surfaces and icons together.
    const preset = THEME_PRESETS.find((p) => p.id === theme) ?? THEME_PRESETS[0];
    setBrand(preset.brand, el);
    const { customization } = preset;
    setThemeCustomization(surfaceStrength(customization.surface) === 0 && customization.contrast === 0 ? null : customization, el, preset.brand?.color ?? null);
    setIconPack(preset.icons ?? "hugeicons", el, { persist: false });
    const lang = LANGUAGES.find((l) => l.value === language);
    el.lang = language;
    el.dir = direction === "auto" ? (lang?.dir ?? "ltr") : direction;
  }, [mode, theme, language, direction]);
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
          <Select id="set-theme" aria-describedby="set-theme-hint" value={theme} onChange={(event) => setThemeId(event.currentTarget.value)} pictures={THEME_PICTURES}>
            {THEME_PRESETS.map((preset) => (
              <option key={preset.id} value={preset.id}>
                {preset.label}
              </option>
            ))}
          </Select>
        </SettingsRow>
      </Settings>
      <Settings title="Accessibility and language">
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
