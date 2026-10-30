# Icon Packs Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use code-run-plan to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** ayywi's built-in icons can be drawn from Lucide, Tabler Icons, Material Symbols or Feather instead of Hugeicons, per page or subtree, and maintainers can add more packs by adding one JSON file.

**Architecture:** Every built-in glyph gets a semantic name (`data-ayy-icon="x"`). A generator reads each pack's SVGs from its npm devDependency and writes one committed CSS file per pack. Each file sets one masked glyph per name under `[data-ayy-icons="<pack>"]`, so switching packs is pure CSS and the inline Hugeicons paths remain the fallback. `setIconPack()` sets and persists the attribute, independently of themes. Theme presets and custom themes can name a pack.

**Tech Stack:** TypeScript, plain Node ESM scripts, CSS masks, React (optional peer), node:test, Playwright.

**Spec:** `docs/superpowers/specs/2026-10-29-icon-packs-design.md`

## Decisions to confirm with the maintainer

- Preset suggestions (Task 8): Arctic → `tabler`, Forest → `feather`, Paper → `material-symbols`, Lagoon → `lucide`. The other presets stay on Hugeicons.

## Global Constraints

- Zero runtime dependencies: pack packages go in `devDependencies` with exact versions: `lucide-static` 1.64.0, `@tabler/icons` 3.50.0, `@material-symbols/svg-400` 0.48.2, `feather-icons` 4.29.2.
- No pack CSS in `ayywi.css`; packs ship as `@danitesler/ayywi/icons/<id>.css`.
- Generated files are never hand-edited: `src/icon-packs.ts` and `src/css/icon-packs/*.css` join rule 7's list (AGENTS.md, `scripts/lib/contract.mjs` RULES).
- Private custom properties only: `--_ayy-glyph` and `--_ayy-glyph-<name>`. Logical properties, `ayy-` prefixes, no `:dir()`.
- JSON under `tokens/` is hand-formatted: short objects on one line.
- Each pack CSS starts with `/*! <Label> icons for ayywi — <licence>, <copyright>. Generated from tokens/icon-packs/<id>.json; do not edit. */`.
- Never add GitHub Actions. Never bump the version or rename `## Unreleased`.
- After each code task: `pnpm build && pnpm typecheck && pnpm check && pnpm test`. Visual tasks also need e2e (scoped run, then `pnpm test:e2e`). Run `scripts/check-all.sh` before merging.

## Review Focus

1. **`data-ayy-icons` set but the pack's CSS not loaded:** icons must keep their inline Hugeicons paths, never go blank or turn into solid squares. Test in Task 3.
2. **Windows High Contrast (forced colours):** masked icons must stay visible in the system text colour. Test in Task 3.
3. **A subtree on another pack** (a preview card inside a Lucide page): the nearest `data-ayy-icons` wins. Test in Task 4.
4. **Icons drawn after load by custom elements** (a toast shown later, a new tag chip): they must get the pack too. Test in Task 9.
5. **RTL:** directional glyphs (chevrons, arrows) must mirror in every pack. Test in Task 3.

---

### Task 1: Glyph names and the pack generator skeleton

**Files:**
- Create: `tokens/icon-packs/hugeicons.json`
- Create: `scripts/lib/icon-packs.mjs`
- Create: `scripts/build-icon-packs.mjs`
- Create (generated): `src/icon-packs.ts`
- Modify: `package.json` (`generate` and `build` scripts run `scripts/build-icon-packs.mjs` after `build-tokens.mjs`)
- Modify: `scripts/check.mjs:522` (add `scripts/build-icon-packs.mjs` to the generators run with `AYYWI_CHECK=1`)
- Modify: `src/index.ts` (`export * from "./icon-packs"`)
- Test: `tests/node/icon-packs.test.mjs`

**Interfaces:**
- Produces:
  - `tokens/icon-packs/<id>.json`: `{ "$description": string, "label": string, "license": string, "copyright": string, "package": string, "source": Source, "glyphs": { [name]: string | null } }`
  - `Source` is either `{ "data": "@hugeicons/core-free-icons/{name}" }` (default export is IconData) or `{ "svg": "icons/{name}.svg" }` (a path inside `package`).
  - `scripts/lib/icon-packs.mjs` exports `loadPacks(root: string): Pack[]` (hugeicons first, then alphabetical by id), `iconNames(packs: Pack[]): string[]` (hugeicons.json's keys, in file order), and `validatePack(pack: Pack, names: string[]): string[]` (error messages, empty when valid).
  - Generated `src/icon-packs.ts`: `iconNames` (readonly tuple), `type IconName`, `iconPacks` (readonly tuple of ids), `type IconPackName`, `interface IconPackInfo { label: string; description: string; license: string; fallbacks: readonly IconName[] }`, and `iconPackInfo: Record<IconPackName, IconPackInfo>`.

Use these names in `hugeicons.json`, in this order, as `name: export`:

`x: Cancel01Icon, circle-check: CheckmarkCircle02Icon, triangle-alert: Alert02Icon, info: InformationCircleIcon, circle-x: CancelCircleIcon, menu: Menu01Icon, chevron-left: ArrowLeft01Icon, chevron-right: ArrowRight01Icon, arrow-left: ArrowLeft02Icon, arrow-right: ArrowRight02Icon, moon: Moon02Icon, sun: Sun03Icon, chevron-down: ArrowDown01Icon, minus: MinusSignIcon, plus: PlusSignIcon, cloud-upload: CloudUploadIcon, calendar: Calendar03Icon, search: Search01Icon, clock: Clock01Icon, copy: Copy01Icon, check: Tick02Icon, play: PlayIcon, chevrons-left: ArrowLeftDoubleIcon, chevrons-right: ArrowRightDoubleIcon, star: StarIcon, grip-vertical: DragDropVerticalIcon, text: TextIcon, heading-1: Heading01Icon, heading-2: Heading02Icon, heading-3: Heading03Icon, list: LeftToRightListBulletIcon, list-ordered: LeftToRightListNumberIcon, list-checks: CheckListIcon, quote: QuoteDownIcon, lightbulb: BulbIcon, code-block: SourceCodeIcon, function: FunctionIcon, table: Grid3x3Icon, separator: SolidLine01Icon, image: Image01Icon, video: Video01Icon, paperclip: Attachment01Icon, bold: TextBoldIcon, italic: TextItalicIcon, underline: TextUnderlineIcon, strikethrough: TextStrikethroughIcon, highlighter: HighlighterIcon, code: CodeIcon, link: Link01Icon, unlink: Unlink04Icon, arrow-up-right: ArrowUpRight01Icon, trash: Delete02Icon, chevron-up: ArrowUp01Icon, copy-plus: CopyPlusIcon, row-insert-top: InsertRowUpIcon, row-insert-bottom: InsertRowDownIcon, column-insert-left: InsertColumnLeftIcon, column-insert-right: InsertColumnRightIcon, move-up: MoveUpIcon, move-down: MoveDownIcon, move-left: MoveLeftIcon, move-right: MoveRightIcon, rows: Rows3Icon, columns: Layout3ColumnIcon, sort: SortByDown02Icon, sort-a-z: ArrangeByLettersAZIcon, sort-z-a: ArrangeByLettersZAIcon, align-left: TextAlignLeftIcon, align-center: TextAlignCenterIcon, align-right: TextAlignRightIcon, resize-horizontal: HorizontalResizeIcon, eraser: EraserIcon, row-delete: DeleteRowIcon, column-delete: ColumnDeleteIcon`

- [ ] **Step 1: Write the failing tests**

```js
import { loadPacks, iconNames, validatePack } from "../../scripts/lib/icon-packs.mjs";
const root = fileURLToPath(new URL("../..", import.meta.url));

test("every glyph in src/lib/icons.ts has exactly one name", () => {
  const exports = [...readFileSync(join(root, "src/lib/icons.ts"), "utf8").matchAll(/^export const (\w+)/gm)].map((m) => m[1]);
  const hugeicons = loadPacks(root)[0];
  assert.equal(hugeicons.id, "hugeicons");
  assert.deepEqual(Object.values(hugeicons.glyphs).sort(), exports.sort());
  assert.equal(new Set(Object.values(hugeicons.glyphs)).size, exports.length);
});

test("names are kebab-case and hugeicons maps every one", () => {
  const packs = loadPacks(root);
  for (const n of iconNames(packs)) assert.match(n, /^[a-z0-9]+(-[a-z0-9]+)*$/);
  assert.deepEqual(validatePack(packs[0], iconNames(packs)), []);
});

test("validatePack reports missing, unknown and null-in-default names", () => {
  const names = ["x", "menu"];
  assert.deepEqual(validatePack({ id: "p", glyphs: { x: "x", extra: "y" } }, names), ['p: missing "menu"', 'p: unknown "extra"']);
  assert.deepEqual(validatePack({ id: "hugeicons", glyphs: { x: null, menu: "Menu01Icon" } }, names), ['hugeicons: the default pack can\'t leave "x" empty']);
});
```

- [ ] **Step 2: Run them and see them fail**

Run: `node --test tests/node/icon-packs.test.mjs`
Expected: FAIL, cannot find `scripts/lib/icon-packs.mjs`.

- [ ] **Step 3: Implement `loadPacks`, `iconNames` and `validatePack` in `scripts/lib/icon-packs.mjs`, write `hugeicons.json`, and add `scripts/build-icon-packs.mjs`**

Use `"source": { "data": "@hugeicons/core-free-icons/{name}" }`, `"license": "MIT"` and `"copyright": "© Hugeicons"`. The build script writes `src/icon-packs.ts`. It fails with every `validatePack` message when any pack is invalid. Under `AYYWI_CHECK=1` it fails when its output differs from the file on disk, matching `scripts/build-tokens.mjs`. `fallbacks` lists the names a pack maps to `null`.

- [ ] **Step 4: Run them and see them pass**

Run: `pnpm generate && node --test tests/node/icon-packs.test.mjs && pnpm typecheck && pnpm check`
Expected: PASS. `pnpm check` reports no stale generated files.

- [ ] **Step 5: Commit**

```bash
git add tokens/icon-packs scripts/lib/icon-packs.mjs scripts/build-icon-packs.mjs src/icon-packs.ts src/index.ts package.json scripts/check.mjs tests/node/icon-packs.test.mjs
git commit -m "Icons: name every built-in glyph"
```

### Task 2: Every built-in glyph carries its name

**Files:**
- Modify: `src/components/icon/icon.ts` (`IconSvgOptions.name`)
- Modify: `src/components/icon/icon.react.tsx` (`IconProps.name`)
- Modify: every `src/components/**/*.ts` and `*.tsx` that draws a `src/lib/icons.ts` glyph (about 25 components, React and element versions), plus their `examples/*.tsx` and `examples/*.html`
- Modify: `scripts/check.mjs` (new rule)
- Test: `tests/node/icons.test.mjs`

**Interfaces:**
- Consumes: `IconName` from `src/icon-packs.ts`, and `hugeicons.json`'s name → export map through `loadPacks`.
- Produces: `iconSvg(icon, { name?: IconName, … })` and `<Icon icon={…} name?: IconName />`. Both render `data-ayy-icon="<name>"` right after `class`.

- [ ] **Step 1: Write the failing tests**

```js
test("iconSvg and <Icon> mark a named glyph", { skip }, async () => {
  const { iconSvg } = await import(dist("index.js"));
  const { Icon } = await import(dist("react.js"));
  assert.match(iconSvg(Cancel01Icon, { name: "x" }), /^<svg class="ayy-icon" data-ayy-icon="x" viewBox="0 0 24 24"/);
  assert.match(renderToStaticMarkup(createElement(Icon, { icon: Cancel01Icon, name: "x" })), /data-ayy-icon="x"/);
  assert.doesNotMatch(iconSvg(Cancel01Icon), /data-ayy-icon/);
});
```

- [ ] **Step 2: Run it and see it fail**

Run: `pnpm build && node --test tests/node/icons.test.mjs`
Expected: FAIL on the `data-ayy-icon` assertion.

- [ ] **Step 3: Add `name` to `iconSvg`/`<Icon>`, then add the check rule `built-in glyphs are named`**

The rule in `scripts/check.mjs`:
- **TS/TSX under `src/components`:** every `iconSvg(<Export>` call or `icon={<Export>}` element whose `<Export>` is imported from `lib/icons` must pass `name: "<n>"` or `name="<n>"`, where `<n>` is that export's key in `hugeicons.json`. A wrong name fails too.
- **Example HTML:** every `<svg class="ayy-icon…">` whose shape geometry matches a registry glyph must have `data-ayy-icon="<n>"`. Geometry is the ordered `d`, `cx`, `cy`, `r`, `x`, `y`, `width`, `height` and `points` values; compare it with the Hugeicons data.
- **Message:** `built-in glyph <Export> needs name "<n>" so icon packs can replace it`.

Run `pnpm check` to list every offender. Fix TS/TSX by hand. For the HTML examples, use a throwaway script, not committed, that adds the attribute wherever the rule found a match, then diff-review the result.

- [ ] **Step 4: Run everything and see it pass**

Run: `pnpm build && pnpm typecheck && pnpm check && pnpm test`
Expected: PASS, with no `built-in glyph` findings.

- [ ] **Step 5: Commit**

```bash
git add src/components scripts/check.mjs tests/node/icons.test.mjs
git commit -m "Icons: built-in glyphs carry data-ayy-icon"
```

### Task 3: Pack CSS, masks and dist (Hugeicons as the first pack)

**Files:**
- Modify: `scripts/lib/icon-packs.mjs` (`glyphSvg`, `toDataUri`, `packCss`)
- Modify: `scripts/build-icon-packs.mjs` (writes `src/css/icon-packs/<id>.css`)
- Create (generated): `src/css/icon-packs/hugeicons.css`
- Modify: `scripts/build.mjs` (minifies `src/css/icon-packs/*.css` into `dist/icons/<id>.css`, layered like `dist/brands/*.css`; copies `node_modules/<package>/LICENSE` to `dist/icons/LICENSE-<id>.txt`; size report line `icons/*.css (opt-in)`)
- Modify: `package.json` exports (`"./icons/*": "./dist/icons/*"`)
- Test: `tests/node/icon-packs.test.mjs`, `tests/e2e/icon-packs.spec.ts`

**Interfaces:**
- Consumes: `loadPacks`, `iconNames` (Task 1). Built-in glyphs carry `data-ayy-icon` (Task 2).
- Produces:
  - `glyphSvg(pack: Pack, name: string, root: string): string` returns the pack's SVG for `name`, or Hugeicons' SVG when the mapping is `null`.
  - `toDataUri(svg: string): string` normalises and encodes the SVG for a mask: it drops `width`/`height`/`class`, keeps `viewBox`, turns every `currentColor` or other paint into `black` (keeping `none`), and encodes `"`→`'`, `#`→`%23`, `<`→`%3C`, `>`→`%3E`, without newlines. It returns `url("data:image/svg+xml,…")`.
  - `packCss(pack: Pack, names: string[], root: string): string`. The output shape is fixed (`ayywi.components` is declared in `src/css/index.css`):

```css
/*! … licence line … */
@layer ayywi.components {
  [data-ayy-icons="<id>"] { --_ayy-glyph-x: url(…); /* one per name */ }
  [data-ayy-icons="<id>"] .ayy-icon[data-ayy-icon] { forced-color-adjust: none; background-color: currentColor; mask: var(--_ayy-glyph) center / contain no-repeat; }
  [data-ayy-icons="<id>"] .ayy-icon[data-ayy-icon] > * { display: none; }
  .ayy-icon[data-ayy-icon="x"] { --_ayy-glyph: var(--_ayy-glyph-x); } /* one per name */
}
```

The masking rule lives only in pack files, so a page without the pack's CSS keeps its inline paths (Review Focus 1). Every pack file defines every name, so the nearest pack root wins through inheritance (Review Focus 3).

- [ ] **Step 1: Write the failing tests**

Node, in `icon-packs.test.mjs`:

```js
test("toDataUri makes a mask-ready data URI", () => {
  const uri = toDataUri('<svg width="24" height="24" class="i" viewBox="0 0 24 24"><path d="M1 1" stroke="currentColor" fill="none"/><circle fill="#333"/></svg>');
  assert.match(uri, /^url\("data:image\/svg\+xml,%3Csvg viewBox='0 0 24 24'%3E/);
  assert.match(uri, /stroke='black' fill='none'/);
  assert.match(uri, /%3Ccircle fill='black'\/%3E/);
  assert.doesNotMatch(uri, /width=|class=|#|currentColor/);
});

test("packCss defines every name for its pack", () => {
  const packs = loadPacks(root);
  const css = packCss(packs[0], iconNames(packs), root);
  assert.match(css, /^\/\*! Hugeicons icons for ayywi — MIT, © Hugeicons\./);
  for (const n of iconNames(packs)) {
    assert.ok(css.includes(`--_ayy-glyph-${n}: url("data:image/svg+xml,`), n);
    assert.ok(css.includes(`.ayy-icon[data-ayy-icon="${n}"] { --_ayy-glyph: var(--_ayy-glyph-${n}); }`), n);
  }
});
```

E2E, in `tests/e2e/icon-packs.spec.ts`. Serve `dist/ayywi.min.css` and `dist/icons/*.css` through `page.route("**/smoke/**")` as `tests/e2e/dist.spec.ts` does, on a page with `<svg class="ayy-icon" data-ayy-icon="x">` holding the inline `Cancel01Icon` paths:
- `"a pack masks built-in glyphs"`: with `<html data-ayy-icons="hugeicons">` and `icons/hugeicons.css`, the svg's computed `mask-image` starts with `url("data:image/svg+xml`, its `path` has `display: none`, and its `background-color` equals its `color`.
- `"without the pack's CSS the inline glyph stays"`: the attribute is set but no pack CSS is loaded. `mask-image` is `none` and the `path` isn't `display: none`.
- `"masked icons follow forced colours"`: with `page.emulateMedia({ forcedColors: "active" })`, the svg's `background-color` equals its parent's computed `color`, and `forced-color-adjust` is `none`.
- `"directional glyphs mirror under a pack"`: with `dir="rtl"` and `ayy-icon--directional`, the computed `scale` is `-1 1` and `mask-image` is still set.

- [ ] **Step 2: Run them and see them fail**

Run: `node --test tests/node/icon-packs.test.mjs`, then `pnpm build && pnpm exec playwright test tests/e2e/icon-packs.spec.ts`
Expected: the node tests fail because `toDataUri` and `packCss` aren't exported. The e2e tests fail because `dist/icons/hugeicons.css` is a 404.

- [ ] **Step 3: Implement `glyphSvg`, `toDataUri` and `packCss`, write the pack CSS, wire `build.mjs` and the exports**

`glyphSvg` for a `data` source renders IconData the way `iconSvg()` does: `viewBox="0 0 24 24" fill="none"`, camelCase → kebab attributes, `key` dropped. Keep `src/css/icon-packs/` out of `lintCss`; freshness is checked through `AYYWI_CHECK`.

- [ ] **Step 4: Run them and see them pass**

Run: `pnpm build && node --test tests/node/icon-packs.test.mjs && pnpm exec playwright test tests/e2e/icon-packs.spec.ts && pnpm check`
Expected: PASS. Then look at a preview page with `data-ayy-icons="hugeicons"` and the CSS loaded: the masked icons look the same as the inline ones, in dark and light themes.

- [ ] **Step 5: Commit**

```bash
git add scripts src/css/icon-packs package.json tests
git commit -m "Icons: pack CSS drawn with masks, shipped as icons/<pack>.css"
```

### Task 4: Lucide pack

**Files:**
- Create: `tokens/icon-packs/lucide.json`
- Create (generated): `src/css/icon-packs/lucide.css`; regenerated `src/icon-packs.ts`
- Modify: `package.json` (`"lucide-static": "1.64.0"` in devDependencies)
- Test: `tests/e2e/icon-packs.spec.ts`

**Interfaces:**
- Consumes: the pack JSON format (Task 1) and the `svg` source kind with `glyphSvg`/`packCss` (Task 3).
- Produces: `IconPackName` includes `"lucide"`, and `dist/icons/lucide.css`.

How to map glyphs, here and in Tasks 5–7:
- For each name, pick the pack's closest glyph by meaning, in outline style.
- Directional glyphs point the LTR way (ayywi mirrors them).
- Use `null` only when no glyph conveys the meaning.
- Write the mapping JSON one entry per line, in `hugeicons.json`'s order.

- [ ] **Step 1: Write the failing test**

`"the nearest data-ayy-icons wins"`: load `icons/hugeicons.css` and `icons/lucide.css`. Inside `<html data-ayy-icons="lucide">` sits `<div data-ayy-icons="hugeicons">` holding an `x` icon. The inner icon's computed `mask-image` equals that of an `x` icon on a hugeicons-only page, and differs from an outer `x` icon's.

- [ ] **Step 2: Run it and see it fail**

Run: `pnpm build && pnpm exec playwright test tests/e2e/icon-packs.spec.ts -g "nearest"`
Expected: FAIL, `icons/lucide.css` is a 404.

- [ ] **Step 3: Add the devDependency and write `lucide.json`**

Use `"package": "lucide-static"`, `"source": { "svg": "icons/{name}.svg" }`, `"license": "ISC"`, `"copyright": "© Lucide Contributors"`. Then run `pnpm install && pnpm generate`.

- [ ] **Step 4: Run it and see it pass**

Run: `pnpm build && pnpm exec playwright test tests/e2e/icon-packs.spec.ts && node --test tests/node/icon-packs.test.mjs && pnpm check`
Expected: PASS. Report `iconPackInfo.lucide.fallbacks` in the task summary.

- [ ] **Step 5: Commit**

```bash
git add tokens/icon-packs/lucide.json src/css/icon-packs/lucide.css src/icon-packs.ts package.json pnpm-lock.yaml tests/e2e/icon-packs.spec.ts
git commit -m "Icons: Lucide pack"
```

### Task 5: Tabler Icons pack

Same steps as Task 4, without a new e2e test: the generator's validation and `pnpm check` cover it.
- `"package": "@tabler/icons"` at 3.50.0, `"source": { "svg": "icons/outline/{name}.svg" }`, `"license": "MIT"`, `"copyright": "© Paweł Kuna"`.
- Tabler SVGs start with a `stroke="none"` bounding path. Keep it, since paint `none` stays `none`.
- Verify: `pnpm generate && node --test tests/node/icon-packs.test.mjs && pnpm check`, then commit `Icons: Tabler Icons pack`.

### Task 6: Material Symbols pack

Same steps as Task 5.
- `"package": "@material-symbols/svg-400"` at 0.48.2, `"source": { "svg": "outlined/{name}.svg" }`, `"license": "Apache-2.0"`, `"copyright": "© Google LLC"`.
- Map to non-filled names (`close`, `check_circle`, `chevron_right`, `content_copy`…).
- The SVGs use `viewBox="0 -960 960 960"` and filled shapes. Add a node test that `toDataUri` keeps that viewBox as is.
- Commit `Icons: Material Symbols pack`.

### Task 7: Feather pack

Same steps as Task 5.
- `"package": "feather-icons"` at 4.29.2, `"source": { "svg": "dist/icons/{name}.svg" }`, `"license": "MIT"`, `"copyright": "© Cole Bemis"`.
- Feather has about 287 icons, so expect more `null` mappings than the other packs (block editor and table glyphs especially). Don't stretch a glyph's meaning to avoid a fallback.
- Commit `Icons: Feather pack`.

### Task 8: `setIconPack()`, the init script, presets and custom themes

**Files:**
- Create: `src/icon-pack.ts`
- Modify: `src/index.ts` (`export * from "./icon-pack"`)
- Modify: `src/theme.ts:98` (`themeInitScript` also restores `ayy-icons`)
- Modify: `src/theme-presets.ts` (`ThemePreset.icons?: IconPackName`, plus the confirmed preset suggestions)
- Modify: `src/theme-customization.ts` (`ThemeCustomization.icons?: IconPackName`, stored data only; `setThemeCustomization` doesn't apply it)
- Test: `tests/node/icon-pack.test.mjs`

**Interfaces:**
- Consumes: `iconPacks`, `IconPackName` (Task 1).
- Produces:
  - `ICON_PACK_STORAGE_KEY = "ayy-icons"`.
  - `setIconPack(pack: IconPackName, target?: HTMLElement, options?: { persist?: boolean }): void`. `"hugeicons"` removes the attribute, unless `target` has an ancestor with `data-ayy-icons`; there it sets `"hugeicons"`, which needs `icons/hugeicons.css`. Any other pack sets the attribute. It persists by default when `target` is `<html>`, like `setTheme`.
  - `getIconPack(): IconPackName` returns the stored pack, else `"hugeicons"`. It ignores stored values not in `iconPacks`.

- [ ] **Step 1: Write the failing tests** (stub `document` and `localStorage` as `tests/node/tokens.test.mjs` does for `setTheme`)

```js
test("setIconPack sets, clears and persists the pack", () => {
  setIconPack("lucide");
  assert.equal(document.documentElement.getAttribute("data-ayy-icons"), "lucide");
  assert.equal(getIconPack(), "lucide");
  setIconPack("hugeicons");
  assert.equal(document.documentElement.hasAttribute("data-ayy-icons"), false);
  assert.equal(getIconPack(), "hugeicons");
});
test("hugeicons resets a subtree inside another pack", () => { /* html on tabler; setIconPack("hugeicons", child) → child data-ayy-icons="hugeicons" */ });
test("getIconPack ignores unknown stored values", () => { localStorage.setItem("ayy-icons", "feather"); assert.equal(getIconPack(), "hugeicons"); });
test("themeInitScript restores a stored pack", () => { /* run the script string with ayy-icons=tabler stored → data-ayy-icons="tabler"; with "hugeicons" or "nope" stored → no attribute */ });
test("presets name only known packs", () => { for (const p of THEME_PRESETS) if (p.icons) assert.ok(iconPacks.includes(p.icons)); });
```

- [ ] **Step 2: Run them and see them fail**

Run: `pnpm build && node --test tests/node/icon-pack.test.mjs`
Expected: FAIL, `setIconPack` isn't exported.

- [ ] **Step 3: Implement `src/icon-pack.ts`, extend `themeInitScript`, and add the preset and customization fields**

Reuse the storage helpers from `src/theme.ts`; export them internally rather than copying them.

- [ ] **Step 4: Run everything and see it pass**

Run: `pnpm build && pnpm typecheck && pnpm check && pnpm test`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/icon-pack.ts src/index.ts src/theme.ts src/theme-presets.ts src/theme-customization.ts tests/node/icon-pack.test.mjs
git commit -m "Icons: setIconPack(), stored and restored without a flash; presets can name a pack"
```

### Task 9: Preview and the Appearance settings pattern

**Files:**
- Modify: `preview/src/pages/Themes.tsx`:
  - Import all five pack CSS files from `src/css/icon-packs/`.
  - Add an **Icons** setting to the custom theme dialog, next to Density, applied to the whole site like Density.
  - Applying a preset calls `setIconPack(preset.icons ?? "hugeicons")`.
  - New **Icon packs** section: a grid of every `iconNames` entry drawn in the chosen pack, with a "Hugeicons" badge on each name in `iconPackInfo[pack].fallbacks`.
- Modify: `preview/src/settings.ts` (the preview's settings hold and persist the pack through `setIconPack`/`getIconPack`)
- Modify: `preview/index.html` (the inline init script restores `ayy-icons`, matching `themeInitScript`)
- Modify: `src/components/settings/examples/appearance.tsx` and `appearance.html` (an **Icons** select row; write the TSX first and render the HTML from it)
- Test: `tests/e2e/icon-packs.spec.ts`

**Interfaces:**
- Consumes: `setIconPack`, `getIconPack` (Task 8). `iconNames`, `iconPacks`, `iconPackInfo` (Task 1).

- [ ] **Step 1: Write the failing tests**

- `"choosing a pack on the Themes page switches every built-in icon"`:
  - Open `#/themes` and pick Lucide.
  - Assert: `html[data-ayy-icons="lucide"]` is set.
  - Assert: an icon in the grid has a computed `mask-image` starting with `url("data:image/svg+xml`.
  - Reload, then assert: the attribute is still there.
- `"icons drawn after load take the pack"`:
  - With Lucide chosen, open the toast example and show a success toast.
  - Assert: its `[data-ayy-icon="circle-check"]` has a mask.
  - Add a tag in the tag input example, then assert: its chip's `[data-ayy-icon="x"]` has a mask.

- [ ] **Step 2: Run them and see them fail**

Run: `pnpm exec playwright test tests/e2e/icon-packs.spec.ts -g "pack"` (against `pnpm preview --port "$E2E_PORT"`, as AGENTS.md describes)
Expected: FAIL, there's no Icons picker.

- [ ] **Step 3: Build the Icons setting, the grid and the settings row**

Build them with ayywi components only; the preview is linted like examples.

- [ ] **Step 4: Run them and see them pass, then look**

Run: `pnpm exec playwright test tests/e2e/icon-packs.spec.ts && pnpm check && pnpm preview:build`
Expected: PASS. Look at the Themes page grid for every pack in dark and light themes, in RTL, at touch density and below 48rem. Flag any glyph that reads wrong in the task summary, so the mapping can be fixed in its pack JSON.

- [ ] **Step 5: Commit**

```bash
git add preview src/components/settings/examples tests/e2e/icon-packs.spec.ts
git commit -m "Preview: choose an icon pack; Themes page shows every glyph per pack"
```

### Task 10: Contract, docs and changelog

**Files:**
- Modify: `scripts/lib/contract.mjs`:
  - `ATTRIBUTES`: `data-ayy-icons` and `data-ayy-icon`.
  - `SETUP`'s subpath list: `"/icons/*"`.
  - `RULES` rule 7: the new generated files.
- Modify: `src/components/icon/icon.meta.json`:
  - Description and `js`: `name`, packs, `strokeWidth` only affecting inline Hugeicons.
  - React prop `name`.
- Modify: `scripts/build-manifest.mjs:97` (the icons note mentions packs and `name`)
- Modify: `AGENTS.md`:
  - Layout: `tokens/icon-packs/`, `src/css/icon-packs/`, `src/icon-packs.ts`.
  - Rule 7 list.
  - A short **Adding an icon pack** section: add the devDependency at an exact version, write `tokens/icon-packs/<id>.json` (with a new `source` kind in `scripts/lib/icon-packs.mjs` only if none fits), run `pnpm generate`, review the Themes page grid, and add a CHANGELOG line.
  - A short **Adding a built-in glyph** section: copy it into `src/lib/icons.ts`, add its name to `hugeicons.json` and a mapping (or `null`) to every other pack.
- Modify: `README.md` (one line on icon packs, with the import path)
- Modify: `CHANGELOG.md` under `## Unreleased`, `### Added`:
  - `**Icon packs**`: built-in icons can now come from Lucide, Tabler Icons, Material Symbols or Feather instead of Hugeicons, per page or section, with every theme.
  - `**[Icon](#/components/icon)**`: icons can now carry a name so the chosen pack can replace them.

- [ ] **Step 1: Regenerate and check**

Run: `pnpm generate && pnpm check`
Expected: PASS. The manifest, `llms*.txt` and `ai/` mention `data-ayy-icons`.

- [ ] **Step 2: Full verification**

Run: `scripts/check-all.sh`
Expected: every step passes.

- [ ] **Step 3: Commit**

```bash
git add scripts/lib/contract.mjs src/components/icon/icon.meta.json scripts/build-manifest.mjs AGENTS.md README.md CHANGELOG.md manifest llms.txt llms-full.txt llms ai
git commit -m "Docs: icon packs"
```

---

## Addendum (2026-10-30): requests from the maintainer during the run

These tasks follow Task 10. Same Global Constraints. Other Claude sessions edit this worktree at the same time: commit only your own hunks, build generated files and run checks in a clean temporary worktree.

### Task 11: Surface has only Neutral and Subtle; presets use Subtle

**Files:** `src/theme-customization.ts`, `src/theme-presets.ts`, `preview/src/pages/Themes.tsx` (`SURFACE_LEVELS`, `levelOf`, `withLevel`), `preview/src/settings.ts` (stored-customization validation), `tests/node/theme-customization.test.mjs`, `tests/e2e/theme-customization.spec.ts`, `CHANGELOG.md`

**Decisions:**
- `SurfaceStyle = "neutral" | "subtle"`. `"vivid"` and numeric strengths are removed (theme customization is unreleased, so this isn't breaking for published versions). `surfaceStrength()` keeps mapping `neutral` → 0 and `subtle` → 37.5.
- The custom theme dialog's Surface control offers Neutral and Subtle only. With an accent, Subtle tints at the library's `subtle` strength (one value everywhere, no separate preview number). With Mono, Subtle keeps today's depth (50) and Neutral is 0.
- Every themed preset uses `surface: "subtle"` instead of the 60% tint.
- A stored customization from before (number > 0 or `"vivid"`) reads as `"subtle"`; 0 reads as `"neutral"`. It never throws.
- Tests: the node matrix covers `neutral`/`subtle` only and asserts `"vivid"` and numbers are rejected; the e2e Surface test checks two levels (neutral vs subtle) instead of three; a test that an old stored value of 60 loads as Subtle.
- CHANGELOG `### Changed`, **Themes**: Surface offered Neutral, Subtle and Rich → only Neutral and Subtle, and every ready-made theme uses Subtle.

### Task 12: Ready-made themes ordered by hue, aligned between Dark and Light

**Files:** `src/theme-presets.ts`, any test that asserts preset order

**Decisions:**
- Default stays first in each group. The rest go in hue order, so each column pairs similar colours: Dark: Default, Ember, Forest, Arctic, Twilight, Wine. Light: Default, Sunlit, Lagoon, Paper, Lavender, Blush. (Warm, green/teal, blue, purple, red/pink.)
- CHANGELOG `### Changed`, **Themes**: ready-made themes were in no colour order → Dark and Light rows run warm, green, blue, purple, pink, so each column pairs similar colours.

### Task 13: Every Hugeicons icon in the preview follows the pack

**Files:** `tokens/icon-packs/*.json` (new names), `scripts/lib/icon-packs.mjs` and `tests/node/icon-packs.test.mjs` (registry vs built-in glyphs), `src/components/*/examples/*.tsx` + `.html`, `preview/src/**` (the site's own icons), `preview/src/showcase/Frame.tsx` (load pack CSS), generated files

**Decisions:**
- The registry grows to every Hugeicons icon used in example TSX, the preview site's own UI and the showcase apps. Built-in glyphs stay the subset in `src/lib/icons.ts`. The Task 1 test changes to: every `src/lib/icons.ts` export has exactly one name, and every hugeicons.json value is a real `@hugeicons/core-free-icons` export.
- New names follow the existing kebab-case, Lucide-like style. Every pack maps each new name (or `null`), by the same mapping rules as Tasks 4–7.
- Every `<Icon icon={X}>` in examples and the preview passes `name`. The Task 2 check rule already covers example TSX; extend it to `preview/src`. Example HTML gets `data-ayy-icon` by the existing geometry rule.
- The showcase apps' frame (`?app=`) imports all pack CSS like the Themes page, so the apps follow the pack too.
- Report each pack CSS's new size (raw and gzip) and each pack's new fallback count.

### Task 14: Icons get their own Docs page; the custom theme preview shows the chosen pack

**Files:** new `preview/src/pages/Icons.tsx`, `preview/src/routes.ts` (`DOC_PAGES` gains `icons`, after `illustration`), `preview/src/App.tsx` (docs nav and search entry), `preview/src/pages/Themes.tsx`, `preview/src/preview.css`, `tests/e2e/icon-packs.spec.ts`, `tests/e2e/pages.spec.ts` if it lists docs pages

**Decisions:**
- `#/docs/icons` holds what the Themes page had about icons: the pack picker for browsing, the grid of every registry name per pack with fallback badges, the pack's label, licence and fallback count, plus short usage (load `@danitesler/ayywi/icons/<pack>.css`, `setIconPack()`, `name` on `<Icon>`). It uses the same page shell as the other Docs pages.
- The Themes page keeps only the Icons setting in the custom theme dialog and links to `#/docs/icons`. The Icon packs section and its explanatory text move out.
- The custom theme dialog's live preview wears the pack being chosen (`data-ayy-icons` on the preview area, following the draft), and shows a few built-in icons so the change is visible.
- e2e: the grid test moves to `#/docs/icons`; a new test changes Icons in the custom theme dialog and asserts an icon in its live preview is masked with that pack before Use.

### Task 15: Components and Docs pages are centred like Examples

**Files:** `preview/src/preview.css`, `preview/src/App.tsx` or page components as needed, `tests/e2e/pages.spec.ts`

**Decisions:**
- The Components and Docs pages centre their content the same way the Examples page does (same page width and inline centring), at every viewport. Sidebars keep working; nothing overflows at 375px.
- Check in dark and light, RTL, touch density and below 48rem, with screenshots of Examples, a component page and a docs page side by side.
