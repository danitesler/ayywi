# Color picker

Category: Forms. A panel to pick any colour: a 2D saturation/brightness area with a crosshair handle, hue and alpha range sliders, a preview swatch, hex input, and preset swatches. Also called: color-selector, colour-selector, palette-picker, color-chooser, hsv-picker.

**Classes**
- `.ayy-color-picker` — Panel container: flex column holding the 2D area, sliders, text input, and optional preset swatches.
- `.ayy-color-picker__area` — 2D saturation and brightness gradient area with a crosshair handle; drag or use arrow keys to adjust saturation and value.
- `.ayy-color-picker__handle` — Draggable crosshair pointer on the 2D area positioned by --_x and --_y.
- `.ayy-color-picker__sliders` — Row containing the preview swatch and range sliders.
- `.ayy-color-picker__hue` — Rainbow track range slider (0–360) controlling the hue.
- `.ayy-color-picker__alpha` — Checkerboard and gradient track range slider (0–100) controlling opacity.
- `.ayy-color-picker__preview` — Color swatch showing the currently picked colour over a transparency checkerboard.
- `.ayy-color-picker__inputs` — Row holding the hex colour text input.
- `.ayy-color-picker__swatches` — Row of preset colour swatch buttons.
- `.ayy-color-picker__swatch` — One preset colour button inside the swatches row, coloured by --_swatch.

**States**
- `default` — A panel with the 2D saturation/brightness area, hue and alpha sliders, preview swatch, hex input, and preset swatches.
- `hover` (`:hover on swatches or slider thumbs`) — Swatches and slider thumbs scale up 10% on pointer hover.
- `pressed` — doesn't apply: No separate pressed look; the 2D area handle and slider thumbs follow the pointer smoothly while dragged.
- `focus` (`:focus-visible on the 2D area handle, range slider thumbs, text input, or preset swatch buttons`) — A 2px outline in --ayy-color-ring with a 2px offset.
- `disabled` (`:disabled or [aria-disabled="true"]`) — --ayy-opacity-disabled, controls cannot be dragged or typed into.
- `selected` (`.ayy-color-picker__swatch[aria-pressed="true"]`) — The active preset swatch gets a 2px surface gap and 2px text-colour ring; Highlight outline in High Contrast.
- `error` — doesn't apply: Color picker bounds clamp numerical and hex values; invalid typed hex codes are reverted on blur rather than leaving an error state.
- `loading` — doesn't apply: Color calculations are instant and local; no loading state.

**Sizes**
- Density — Control heights and padding follow data-density: slider tracks and hex input scale from compact to comfortable and touch.
- Width — Panel inline-size (16rem / 256px), adapts up to 100% of its container.

**JS (framework-free)**: colorPickerClass({ className? }) → string; connectColorPicker(root, { value?, alpha?, swatches?, onChange? }) → { setValue, update, destroy } wires the 2D area, sliders, hex input and preset swatches; hsvToRgb(hsv), rgbToHsv(rgb), rgbToHex(rgb), hexToRgb(hex) conversion functions.

**Custom element** `<ayy-color-picker>` (@danitesler/ayywi/elements) — 
- attribute `value`: Hex colour code ("#2563eb"). Updated when the colour changes.
- attribute `alpha`: Allow opacity changes when present (unless "false").
- attribute `name`: Form name: a hidden input inside carries the hex colour.
- event `ayy-change`: { value } when the colour changes.

**React** — `import { ColorPicker } from "@danitesler/ayywi/react";`
- `<ColorPicker>` renders <div class="ayy-color-picker">. Props: `value / defaultValue` string — hex colour code (e.g. "#2563eb"); `onValueChange` (color: string) => void — called when the colour changes; `alpha` boolean — whether to show the alpha slider and allow opacity changes; `swatches` string[] — list of preset colour hex codes; `...` HTMLAttributes<HTMLDivElement> props

**Accessibility**
- The 2D saturation/brightness area is a focusable role="slider" with aria-label, aria-valuetext, and arrow key navigation (Shift for 10% steps).
- Hue and alpha sliders are native range inputs with accessible labels, keyboard stepped navigation, and Home/End support.
- The hex input allows typing exact hex color codes with keyboard and screen reader support.
- In Windows High Contrast mode, the panel, sliders, swatches, and handle keep clear outlines using CanvasText and Highlight system colors.

**Do**
- Use ColorPicker when people need to pick any custom colour or fine-tune hues, saturation, and transparency (e.g. in graphic design tools, theme customizers, or canvas drawing apps).
- Provide preset swatches for common or brand-approved choices so users don't have to start from scratch.
- Enable alpha only when transparency is supported by the underlying target.

**Don't**
- Don't use ColorPicker when users only choose between a small, fixed set of options — use Swatch or Segmented control instead.
- Don't use ColorPicker for status or severity selection (e.g. error, warning) — use Badge or Select.
- Don't hide what the color applies to — label the field with a clear label or preview.

## Color picker — Color picker with alpha and presets

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<ayy-color-picker value="#2563eb" alpha>
  <div class="ayy-color-picker">
    <div class="ayy-color-picker__area" tabindex="0" role="slider" aria-label="Color saturation and brightness" aria-valuemin="0" aria-valuemax="100" aria-valuenow="92" aria-valuetext="Saturation 85%, Brightness 92%">
      <div class="ayy-color-picker__handle"></div>
    </div>
    <div class="ayy-color-picker__sliders">
      <div class="ayy-color-picker__preview" aria-hidden="true"></div>
      <div class="ayy-stack" style="--ayy-gap: var(--ayy-space-2); flex: 1; min-inline-size: 0">
        <input type="range" class="ayy-color-picker__hue" min="0" max="360" value="217" aria-label="Hue" />
        <input type="range" class="ayy-color-picker__alpha" min="0" max="100" value="100" aria-label="Opacity" />
      </div>
    </div>
    <div class="ayy-color-picker__inputs">
      <input type="text" class="ayy-input" value="#2563eb" aria-label="Hex color" spellcheck="false" />
    </div>
    <div class="ayy-color-picker__swatches" role="group" aria-label="Preset colors">
      <button type="button" class="ayy-color-picker__swatch" data-color="#ef4444" aria-label="#ef4444"></button>
      <button type="button" class="ayy-color-picker__swatch" data-color="#f97316" aria-label="#f97316"></button>
      <button type="button" class="ayy-color-picker__swatch" data-color="#eab308" aria-label="#eab308"></button>
      <button type="button" class="ayy-color-picker__swatch" data-color="#22c55e" aria-label="#22c55e"></button>
      <button type="button" class="ayy-color-picker__swatch" data-color="#06b6d4" aria-label="#06b6d4"></button>
      <button type="button" class="ayy-color-picker__swatch" data-color="#2563eb" aria-pressed="true" aria-label="#2563eb"></button>
      <button type="button" class="ayy-color-picker__swatch" data-color="#a855f7" aria-label="#a855f7"></button>
      <button type="button" class="ayy-color-picker__swatch" data-color="#ec4899" aria-label="#ec4899"></button>
    </div>
  </div>
</ayy-color-picker>
```

React:

```tsx
import { useState } from "react";
import { ColorPicker } from "@danitesler/ayywi/react";

export default function Example() {
  const [color, setColor] = useState("#2563eb");

  return (
    <ColorPicker
      value={color}
      onValueChange={setColor}
      alpha
      swatches={["#ef4444", "#f97316", "#eab308", "#22c55e", "#06b6d4", "#2563eb", "#a855f7", "#ec4899"]}
    />
  );
}
```

## Color picker — Compact color picker without alpha

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<ayy-color-picker value="#10b981">
  <div class="ayy-color-picker">
    <div class="ayy-color-picker__area" tabindex="0" role="slider" aria-label="Color saturation and brightness" aria-valuemin="0" aria-valuemax="100" aria-valuenow="73" aria-valuetext="Saturation 91%, Brightness 73%">
      <div class="ayy-color-picker__handle"></div>
    </div>
    <div class="ayy-color-picker__sliders">
      <div class="ayy-color-picker__preview" aria-hidden="true"></div>
      <div class="ayy-stack" style="--ayy-gap: var(--ayy-space-2); flex: 1; min-inline-size: 0">
        <input type="range" class="ayy-color-picker__hue" min="0" max="360" value="160" aria-label="Hue" />
      </div>
    </div>
    <div class="ayy-color-picker__inputs">
      <input type="text" class="ayy-input" value="#10b981" aria-label="Hex color" spellcheck="false" />
    </div>
  </div>
</ayy-color-picker>
```

React:

```tsx
import { useState } from "react";
import { ColorPicker } from "@danitesler/ayywi/react";

export default function Example() {
  const [color, setColor] = useState("#10b981");

  return <ColorPicker value={color} onValueChange={setColor} />;
}
```

---
Part of @danitesler/ayywi 0.0.3: load `dist/ayywi.min.css` (and `dist/elements.global.js` for the <ayy-*> elements). The rules every screen follows: [llms-full.txt#rules](../llms-full.txt#rules). Every component: [llms.txt](../llms.txt).
