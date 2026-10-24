import { useEffect, useRef, useState, type CSSProperties } from "react";
import { ArrowDown01Icon } from "@hugeicons/core-free-icons";
import { BRAND_SHAPES, setBrand, setDensity, setTheme, tokens, type BrandShape, type DensityMode, type ThemeMode } from "@danitesler/ayywi";
import {
  ColorSwatch,
  ColorSwatchCustom,
  ColorSwatchGroup,
  Icon,
  Popover,
  PopoverContent,
  PopoverTrigger,
  SegmentedControl,
  SegmentedControlItem,
  Select,
  Settings,
  SettingsLink,
  SettingsOption,
  SettingsPicker,
  SettingsRow,
  SettingsScreen,
  Slider,
  Switch,
} from "@danitesler/ayywi/react";

const THEMES: { value: ThemeMode; label: string }[] = [
  { value: "system", label: "System" },
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "dark-contrast", label: "Black" },
  { value: "light-gray", label: "Light gray" },
];

const DENSITIES: { value: DensityMode; label: string }[] = [
  { value: "auto", label: "Auto" },
  { value: "compact", label: "Compact" },
  { value: "comfortable", label: "Comfortable" },
  { value: "touch", label: "Touch" },
];

// Seeds come from the palette tokens; setBrand() builds the scale, primary and ring for every theme from one.
const COLOURS = [
  { value: "blue", label: "Blue", token: "palette.blue.53" },
  { value: "violet", label: "Violet", token: "palette.violet.58" },
  { value: "green", label: "Green", token: "palette.green.24" },
  { value: "orange", label: "Orange", token: "palette.orange.40" },
  { value: "pink", label: "Pink", token: "palette.pink.42" },
] as const;

const seed = (token: (typeof COLOURS)[number]["token"]) => tokens[token].value;
const cssVar = (token: string) => `var(--ayy-${token.replace(/\./g, "-")})`;

const SHAPES: { value: BrandShape; label: string }[] = [
  { value: "pill", label: "Pill" },
  { value: "round", label: "Round" },
  { value: "soft", label: "Soft" },
  { value: "sharp", label: "Sharp" },
];

// Font stacks from the font tokens. System drops Sora from the body stack; every stack ends on system fonts.
const stack = (fonts: readonly string[]) => fonts.map((f) => (f.includes(" ") ? `"${f}"` : f)).join(", ");
const FONTS = [
  { value: "default", label: "Sora", family: stack(tokens["font.body"].value) },
  { value: "system", label: "System", family: stack(tokens["font.body"].value.slice(1)) },
  { value: "mono", label: "Mono", family: stack([...tokens["font.mono"].value, ...tokens["font.body"].value.slice(1)]) },
];

const LANGUAGES = [
  { value: "en", label: "English", dir: "ltr" },
  { value: "de", label: "Deutsch", dir: "ltr" },
  { value: "he", label: "עברית", dir: "rtl" },
  { value: "ar", label: "العربية", dir: "rtl" },
] as const;

const DEFAULTS = {
  theme: "system" as ThemeMode,
  density: "auto" as DensityMode,
  textSize: 100,
  colour: "default",
  custom: seed("palette.violet.58"),
  shape: "pill" as BrandShape,
  font: "default",
  motion: false,
  language: "en",
  direction: "auto",
};

export default function Example() {
  const root = useRef<HTMLDivElement>(null);
  const [theme, setThemeState] = useState<ThemeMode>(DEFAULTS.theme);
  const [density, setDensityState] = useState<DensityMode>(DEFAULTS.density);
  const [textSize, setTextSize] = useState<number>(DEFAULTS.textSize);
  const [colour, setColour] = useState<string>(DEFAULTS.colour);
  const [custom, setCustom] = useState<string>(DEFAULTS.custom);
  const [shape, setShape] = useState<BrandShape>(DEFAULTS.shape);
  const [font, setFont] = useState<string>(DEFAULTS.font);
  const [motion, setMotion] = useState<boolean>(DEFAULTS.motion);
  const [language, setLanguage] = useState<string>(DEFAULTS.language);
  const [direction, setDirection] = useState<string>(DEFAULTS.direction);

  // Everything applies to this example only; in an app, target <html> (omit the element argument).
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    setTheme(theme, el);
    setDensity(density, el);
    const picked = COLOURS.find((c) => c.value === colour);
    const color = colour === "custom" ? custom : picked ? seed(picked.token) : null;
    if (color) setBrand({ name: "settings-example", color, shape }, el);
    else setBrand(null, el);
    const radius = BRAND_SHAPES[shape];
    el.style.setProperty("--ayy-radius-control", radius.control);
    el.style.setProperty("--ayy-radius-card", radius.card);
    el.style.setProperty("--ayy-radius-button", radius.button);
    const family = FONTS.find((f) => f.value === font);
    if (font === "default" || !family) el.style.removeProperty("--ayy-font-body");
    else el.style.setProperty("--ayy-font-body", family.family);
    const lang = LANGUAGES.find((l) => l.value === language);
    el.lang = language;
    el.dir = direction === "auto" ? (lang?.dir ?? "ltr") : direction;
  }, [theme, density, colour, custom, shape, font, language, direction]);

  const themeLabel = THEMES.find((t) => t.value === theme)?.label ?? "System";
  const densityLabel = DENSITIES.find((d) => d.value === density)?.label ?? "Auto";
  const shapeLabel = SHAPES.find((s) => s.value === shape)?.label ?? "Pill";
  const fontOption = FONTS.find((f) => f.value === font) ?? FONTS[0];
  const cornerStyle = (s: BrandShape) => ({ "--ayy-radius-card": BRAND_SHAPES[s].card, "--ayy-radius-button": BRAND_SHAPES[s].button }) as CSSProperties;

  return (
    <div ref={root} style={{ inlineSize: "100%", maxInlineSize: "42rem", fontFamily: "var(--ayy-font-body)" }}>
      <Settings title="Appearance" description="Theme, density, brand colour, corners and font for the whole interface.">
        <SettingsRow label="Theme" htmlFor="set-theme" hint="System follows your device's light or dark setting.">
          <Popover>
            <PopoverTrigger id="set-theme" aria-describedby="set-theme-hint" variant="outline">
              <span className="ayy-settings__preview" aria-hidden="true">
                <SettingsScreen theme={theme} />
              </span>
              {themeLabel}
              <Icon icon={ArrowDown01Icon} />
            </PopoverTrigger>
            <PopoverContent align="end" aria-label="Theme">
              <SettingsPicker aria-label="Theme" value={theme} onValueChange={(value) => setThemeState(value as ThemeMode)}>
                {THEMES.map((t) => (
                  <SettingsOption key={t.value} value={t.value} label={t.label} preview={<SettingsScreen theme={t.value} />} />
                ))}
              </SettingsPicker>
            </PopoverContent>
          </Popover>
        </SettingsRow>
        <SettingsRow label="Density" htmlFor="set-density" hint="Auto: compact with a mouse, touch on a touch screen.">
          <Popover>
            <PopoverTrigger id="set-density" aria-describedby="set-density-hint" variant="outline">
              <span className="ayy-settings__preview" aria-hidden="true">
                <SettingsScreen density={density} />
              </span>
              {densityLabel}
              <Icon icon={ArrowDown01Icon} />
            </PopoverTrigger>
            <PopoverContent align="end" aria-label="Density">
              <SettingsPicker aria-label="Density" value={density} onValueChange={(value) => setDensityState(value as DensityMode)}>
                {DENSITIES.map((d) => (
                  <SettingsOption key={d.value} value={d.value} label={d.label} preview={<SettingsScreen density={d.value} />} />
                ))}
              </SettingsPicker>
            </PopoverContent>
          </Popover>
        </SettingsRow>
        <SettingsRow label="Text size" htmlFor="set-text-size" hint="Sets the root font size, so all text and spacing scale with it.">
          <Slider
            id="set-text-size"
            aria-describedby="set-text-size-hint"
            aria-valuetext={`${textSize}%`}
            min={75}
            max={150}
            step={12.5}
            value={textSize}
            onValueChange={setTextSize}
          />
          <output htmlFor="set-text-size" className="ayy-muted ayy-tabular">
            {textSize}%
          </output>
        </SettingsRow>
        <SettingsRow label={<span id="set-brand-colour">Brand colour</span>} hint="Default is monochrome. Contrast is checked in every theme.">
          <ColorSwatchGroup aria-labelledby="set-brand-colour">
            <ColorSwatch none label="Default" name="set-brand-colour" value="default" checked={colour === "default"} onCheckedChange={() => setColour("default")} />
            {COLOURS.map((c) => (
              <ColorSwatch
                key={c.value}
                color={cssVar(c.token)}
                label={c.label}
                name="set-brand-colour"
                value={c.value}
                checked={colour === c.value}
                onCheckedChange={() => setColour(c.value)}
              />
            ))}
            <ColorSwatchCustom
              label="Custom colour"
              value={custom}
              onChange={(event) => {
                setCustom(event.currentTarget.value);
                setColour("custom");
              }}
            />
          </ColorSwatchGroup>
        </SettingsRow>
        <SettingsRow label="Corners" htmlFor="set-corners">
          <Popover>
            <PopoverTrigger id="set-corners" variant="outline">
              <span className="ayy-settings__preview" aria-hidden="true">
                <SettingsScreen style={cornerStyle(shape)} />
              </span>
              {shapeLabel}
              <Icon icon={ArrowDown01Icon} />
            </PopoverTrigger>
            <PopoverContent align="end" aria-label="Corners">
              <SettingsPicker aria-label="Corners" value={shape} onValueChange={(value) => setShape(value as BrandShape)}>
                {SHAPES.map((s) => (
                  <SettingsOption key={s.value} value={s.value} label={s.label} preview={<SettingsScreen style={cornerStyle(s.value)} />} />
                ))}
              </SettingsPicker>
            </PopoverContent>
          </Popover>
        </SettingsRow>
        <SettingsRow label="Font" htmlFor="set-font">
          <Popover>
            <PopoverTrigger id="set-font" variant="outline">
              <span className="ayy-settings__preview" aria-hidden="true">
                <span style={{ fontFamily: fontOption.family }}>Aa</span>
              </span>
              {fontOption.label}
              <Icon icon={ArrowDown01Icon} />
            </PopoverTrigger>
            <PopoverContent align="end" aria-label="Font">
              <SettingsPicker aria-label="Font" value={font} onValueChange={setFont}>
                {FONTS.map((f) => (
                  <SettingsOption key={f.value} value={f.value} label={f.label} preview={<span style={{ fontFamily: f.family }}>Aa</span>} />
                ))}
              </SettingsPicker>
            </PopoverContent>
          </Popover>
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
        <SettingsRow label="Text direction" hint="Auto follows the language.">
          <SegmentedControl aria-label="Text direction" value={direction} onValueChange={setDirection}>
            <SegmentedControlItem value="auto">Auto</SegmentedControlItem>
            <SegmentedControlItem value="ltr">Left to right</SegmentedControlItem>
            <SegmentedControlItem value="rtl">Right to left</SegmentedControlItem>
          </SegmentedControl>
        </SettingsRow>
      </Settings>
      <Settings title="Reset">
        <SettingsLink
          label="Reset appearance"
          hint="Theme, density, brand, motion and language go back to their defaults."
          destructive
          onClick={() => {
            setThemeState(DEFAULTS.theme);
            setDensityState(DEFAULTS.density);
            setTextSize(DEFAULTS.textSize);
            setColour(DEFAULTS.colour);
            setCustom(DEFAULTS.custom);
            setShape(DEFAULTS.shape);
            setFont(DEFAULTS.font);
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
