# Icon packs: design

## Goal

ayywi's built-in icons can be drawn from other icon libraries, chosen per page or per subtree, with every theme and custom theme. First packs in addition to Hugeicons: Tabler Icons, Material Symbols, Lucide, Feather. Maintainers can add more packs later. People using ayywi can't add their own.

## Decisions

- **What changes.** The ~74 glyphs ayywi draws itself (`src/lib/icons.ts`: close, chevrons, toast status icons, date picker, block editor…). App icons change only when the app opts in by name (`<Icon icon={Search01Icon} name="search" />`).
- **Semantic names.** Every built-in glyph gets a kebab-case name (`x`, `chevron-right`, `circle-check`), close to Lucide's naming. The list of names is the registry. `tokens/icon-packs/hugeicons.json` is its source of truth.
- **One source file per pack.** `tokens/icon-packs/<id>.json` maps each registry name to the pack's own icon name, or `null` when nothing fits. A `null` glyph falls back to Hugeicons.
- **Built from devDependencies, zero runtime dependencies.** A generator reads the SVGs from each pack's npm package and writes one committed CSS file per pack (`src/css/icon-packs/<id>.css`), shipped as `@danitesler/ayywi/icons/<id>.css`.
- **CSS masks.** A pack file sets one private custom property per glyph (`--_ayy-glyph-x: url("data:image/svg+xml,…")`) on `[data-ayy-icons="<id>"]`, and paints `.ayy-icon[data-ayy-icon]` with `background-color: currentColor` masked by its glyph, hiding the inline Hugeicons paths. Custom properties inherit, so the nearest `data-ayy-icons` wins. Without the pack's CSS, or without the attribute, the inline Hugeicons paths show as today.
- **Independent of themes.** `data-ayy-icons` is its own attribute, like `data-density`. `setIconPack()` sets and stores it, and `themeInitScript` restores it. Theme presets and custom themes may name a pack. Applying one sets the pack, and the person can change it afterwards.
- **Opt-in CSS.** No pack is in `ayywi.css`. An app imports only the packs it offers.
- **Native look.** Each pack keeps its own stroke weight and style. `strokeWidth` on `<Icon>`/`iconSvg()` affects only the inline Hugeicons paths.
- **Licences.** Each pack CSS starts with a preserved `/*! … */` licence line, and its LICENSE file ships as `dist/icons/LICENSE-<id>.txt`.

## Non-goals

- Packs supplied by people using ayywi, at runtime or through a CLI.
- Recolouring parts of an icon (two-tone, duotone). Masks are single-colour.
- Changing the icons the preview's own pages use, beyond the theme switcher.

## Packs

| id | Package | Glyph source | Licence |
|---|---|---|---|
| `hugeicons` | `@hugeicons/core-free-icons` | export data (same as `src/lib/icons.ts`) | MIT |
| `lucide` | `lucide-static` | `icons/{name}.svg` | ISC |
| `tabler` | `@tabler/icons` | `icons/outline/{name}.svg` | MIT |
| `material-symbols` | `@material-symbols/svg-400` | `outlined/{name}.svg` | Apache-2.0 |
| `feather` | `feather-icons` | `dist/icons/{name}.svg` | MIT |

Feather has about 287 icons and its npm package was last published in May 2024, so it will fall back to Hugeicons more often than the other packs.
