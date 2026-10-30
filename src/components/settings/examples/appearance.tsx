import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { BODY_FONT_ADJUST, BRAND_SHAPES, iconPackInfo, iconPacks, openSettingsColor, setBrand, setDensity, setIconPack, setTheme, setThemeCustomization, tokens, type BrandShape, type DensityMode, type IconPackName, type SurfaceStyle, type ThemeMode } from "@danitesler/ayywi";
import { Icon, Select, Settings, SettingsLink, SettingsRow, SettingsScreen, Slider, Switch } from "@danitesler/ayywi/react";
import { StarIcon } from "@hugeicons/core-free-icons";

const THEMES: { value: ThemeMode; label: string }[] = [
  { value: "system", label: "System" },
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
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
// A brand screen in one colour; the default is monochrome, where primary is the text colour.
const colourStyle = (color: string) => ({ "--ayy-color-primary": color }) as CSSProperties;

const TEXT_SIZES = [75, 87.5, 100, 112.5, 125, 150];

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

// One picture per option value, for a Select's pictures.
const picturesOf = <T extends { value: string }>(options: readonly T[], picture: (option: T) => ReactNode) =>
  Object.fromEntries(options.map((option) => [option.value, picture(option)]));

const THEME_PICTURES = picturesOf(THEMES, (t) => <SettingsScreen theme={t.value} />);
const DENSITY_PICTURES = picturesOf(DENSITIES, (d) => <SettingsScreen variant="rows" density={d.value} />);
const SIZE_PICTURES = picturesOf(
  TEXT_SIZES.map((size) => ({ value: String(size) })),
  (size) => <span style={{ fontSize: `${size.value}%` }}>Aa</span>,
);
const SHAPE_PICTURES = picturesOf(SHAPES, (s) => (
  <SettingsScreen style={{ "--ayy-radius-card": BRAND_SHAPES[s.value].card, "--ayy-radius-button": BRAND_SHAPES[s.value].button } as CSSProperties} />
));
const FONT_PICTURES = picturesOf(FONTS, (f) => <span style={{ fontFamily: f.family }}>Aa</span>);
const DIRECTION_PICTURES = picturesOf(DIRECTIONS, (d) => <DirectionScreen direction={d.value} />);
// A star in each pack. A pack needs its CSS on the page (@danitesler/ayywi/icons/<pack>.css); without it Hugeicons stay.
const ICON_PICTURES = picturesOf(iconPacks.map((pack) => ({ value: pack })), (p) => (
  <span data-ayy-icons={p.value}>
    <Icon icon={StarIcon} name="star" size="sm" />
  </span>
));

const LANGUAGES = [
  { value: "en", label: "English", dir: "ltr" },
  { value: "de", label: "Deutsch", dir: "ltr" },
  { value: "he", label: "עברית", dir: "rtl" },
  { value: "ar", label: "العربية", dir: "rtl" },
] as const;

const DEFAULTS = {
  theme: "system" as ThemeMode,
  density: "auto" as DensityMode,
  surface: "neutral" as SurfaceStyle,
  contrast: 0,
  textSize: 100,
  colour: "default",
  custom: seed("palette.violet.58"),
  shape: "pill" as BrandShape,
  font: "default",
  icons: "hugeicons" as IconPackName,
  motion: false,
  language: "en",
  direction: "auto",
};

export default function Example() {
  const root = useRef<HTMLDivElement>(null);
  const [theme, setThemeState] = useState<ThemeMode>(DEFAULTS.theme);
  const [surface, setSurface] = useState<SurfaceStyle>(DEFAULTS.surface);
  const [contrast, setContrast] = useState(DEFAULTS.contrast);
  const [density, setDensityState] = useState<DensityMode>(DEFAULTS.density);
  const [textSize, setTextSize] = useState<number>(DEFAULTS.textSize);
  const [colour, setColour] = useState<string>(DEFAULTS.colour);
  const [custom, setCustom] = useState<string>(DEFAULTS.custom);
  const [shape, setShape] = useState<BrandShape>(DEFAULTS.shape);
  const [font, setFont] = useState<string>(DEFAULTS.font);
  const [icons, setIcons] = useState<IconPackName>(DEFAULTS.icons);
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
    setThemeCustomization(surface === "neutral" && contrast === 0 ? null : { color: color ?? tokens["palette.neutral.58"].value, surface, contrast }, el, color);
    const radius = BRAND_SHAPES[shape];
    el.style.setProperty("--ayy-radius-control", radius.control);
    el.style.setProperty("--ayy-radius-card", radius.card);
    el.style.setProperty("--ayy-radius-button", radius.button);
    const family = FONTS.find((f) => f.value === font);
    if (font === "default" || !family) {
      el.style.removeProperty("--ayy-font-body");
      el.style.removeProperty("--ayy-font-body-adjust");
    } else {
      // Scaled to Sora's x-height, so switching font doesn't make the text look smaller.
      el.style.setProperty("--ayy-font-body", family.family);
      el.style.setProperty("--ayy-font-body-adjust", String(BODY_FONT_ADJUST));
    }
    setIconPack(icons, el, { persist: false });
    const lang = LANGUAGES.find((l) => l.value === language);
    el.lang = language;
    el.dir = direction === "auto" ? (lang?.dir ?? "ltr") : direction;
  }, [theme, density, colour, custom, shape, font, icons, language, direction, surface, contrast]);
  useEffect(() => { const el = root.current; return () => { if (el) setThemeCustomization(null, el); }; }, []);

  // Choosing Custom (again) opens the colour picker under the select, once the list has closed.
  const colourSelect = useRef<HTMLSelectElement>(null);
  const editCustom = () => setTimeout(() => colourSelect.current && openSettingsColor(colourSelect.current));
  const colourPictures = {
    default: <SettingsScreen variant="brand" style={colourStyle("var(--ayy-color-text)")} />,
    ...picturesOf(COLOURS, (c) => <SettingsScreen variant="brand" style={colourStyle(cssVar(c.token))} />),
    custom: <SettingsScreen variant="brand" style={colourStyle(custom)} />,
  };

  return (
    <div ref={root} style={{ inlineSize: "100%", maxInlineSize: "42rem", fontFamily: "var(--ayy-font-body)" }}>
      <Settings title="Appearance" description="Theme, density, text size, brand colour, corners, font and icons for the whole interface.">
        <SettingsRow label="Theme" htmlFor="set-theme" hint="System follows your device's light or dark setting.">
          <Select
            id="set-theme"
            aria-describedby="set-theme-hint"
            value={theme}
            onChange={(event) => setThemeState(event.currentTarget.value as ThemeMode)}
            pictures={THEME_PICTURES}
          >
            {THEMES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </Select>
        </SettingsRow>
        <SettingsRow label="Surface colour" htmlFor="set-surface" hint="Subtle tints backgrounds with the selected brand colour.">
          <Select id="set-surface" aria-describedby="set-surface-hint" value={surface} onChange={(event) => setSurface(event.currentTarget.value as SurfaceStyle)}>
            <option value="neutral">Neutral</option>
            <option value="subtle">Subtle</option>
          </Select>
        </SettingsRow>
        <SettingsRow label="Contrast" htmlFor="set-contrast" hint="Higher contrast moves backgrounds closer to black or white.">
          <Slider id="set-contrast" aria-describedby="set-contrast-hint" min={0} max={100} value={contrast} onValueChange={setContrast} />
        </SettingsRow>
        <SettingsRow label="Density" htmlFor="set-density" hint="Auto: compact with a mouse, touch on a touch screen.">
          <Select
            id="set-density"
            aria-describedby="set-density-hint"
            value={density}
            onChange={(event) => setDensityState(event.currentTarget.value as DensityMode)}
            pictures={DENSITY_PICTURES}
          >
            {DENSITIES.map((d) => (
              <option key={d.value} value={d.value}>
                {d.label}
              </option>
            ))}
          </Select>
        </SettingsRow>
        <SettingsRow label="Text size" htmlFor="set-text-size" hint="Sets the root font size, so all text and spacing scale with it.">
          <Select
            id="set-text-size"
            aria-describedby="set-text-size-hint"
            value={String(textSize)}
            onChange={(event) => setTextSize(Number(event.currentTarget.value))}
            pictures={SIZE_PICTURES}
          >
            {TEXT_SIZES.map((size) => (
              <option key={size} value={String(size)}>
                {size}%
              </option>
            ))}
          </Select>
        </SettingsRow>
        <SettingsRow label="Brand colour" htmlFor="set-brand-colour" hint="Default is monochrome. Contrast is checked in every theme.">
          <Select
            ref={colourSelect}
            id="set-brand-colour"
            aria-describedby="set-brand-colour-hint"
            value={colour}
            onChange={(event) => {
              setColour(event.currentTarget.value);
              if (event.currentTarget.value === "custom") editCustom();
            }}
            onChoose={(value) => value === "custom" && editCustom()}
            pictures={colourPictures}
          >
            <option value="default">Default</option>
            {COLOURS.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
            <option value="custom">Custom</option>
          </Select>
          <input type="color" hidden tabIndex={-1} aria-label="Custom colour" data-value="custom" value={custom} onChange={(event) => setCustom(event.currentTarget.value)} />
        </SettingsRow>
        <SettingsRow label="Corners" htmlFor="set-corners">
          <Select id="set-corners" value={shape} onChange={(event) => setShape(event.currentTarget.value as BrandShape)} pictures={SHAPE_PICTURES}>
            {SHAPES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </Select>
        </SettingsRow>
        <SettingsRow label="Font" htmlFor="set-font">
          <Select id="set-font" value={font} onChange={(event) => setFont(event.currentTarget.value)} pictures={FONT_PICTURES}>
            {FONTS.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </Select>
        </SettingsRow>
        <SettingsRow label="Icons" htmlFor="set-icons" hint="Swaps every icon the interface draws for the same icon in another set.">
          <Select
            id="set-icons"
            aria-describedby="set-icons-hint"
            value={icons}
            onChange={(event) => setIcons(event.currentTarget.value as IconPackName)}
            pictures={ICON_PICTURES}
          >
            {iconPacks.map((pack) => (
              <option key={pack} value={pack}>
                {iconPackInfo[pack].label}
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
          hint="Theme, density, brand, motion and language go back to their defaults."
          destructive
          onClick={() => {
            setThemeState(DEFAULTS.theme);
            setDensityState(DEFAULTS.density);
            setSurface(DEFAULTS.surface);
            setContrast(DEFAULTS.contrast);
            setTextSize(DEFAULTS.textSize);
            setColour(DEFAULTS.colour);
            setCustom(DEFAULTS.custom);
            setShape(DEFAULTS.shape);
            setFont(DEFAULTS.font);
            setIcons(DEFAULTS.icons);
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
