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
- `.ayy-color-picker__copy` — Copy button inside the hex inputs row or input group.
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
- Width — Panel inline-size (13.5rem / 216px), adapts up to 100% of its container.

**Custom element** `<ayy-color-picker>` (@danitesler/ayywi/elements) — 
- attribute `value`: Hex colour code ("#2563eb"). Updated when the colour changes.
- attribute `alpha`: Allow opacity changes when present (unless "false").
- attribute `name`: Form name: a hidden input inside carries the hex colour.
- event `ayy-change`: { value } when the colour changes.

**React** — `import { ColorPicker } from "@danitesler/ayywi/react";`
- `<ColorPicker>` renders <div class="ayy-color-picker">. Props: `value / defaultValue` string — hex colour code (e.g. "#2563eb"); `onValueChange` (color: string) => void — called when the colour changes; `alpha` boolean — whether to show the alpha slider and allow opacity changes; `swatches` string[] — list of preset colour hex codes; `addon` ReactNode — optional text or element beside the hex input (e.g. "HEX"); `addonPosition` "start" | "end" — placement of the addon beside the input (default "start"); `copyable` boolean — whether to show a copy button inside the hex input group; `...` HTMLAttributes<HTMLDivElement> props

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
      <div class="ayy-stack" style="--ayy-gap: var(--ayy-space-1); flex: 1; min-inline-size: 0">
        <input type="range" class="ayy-color-picker__hue" min="0" max="360" value="217" aria-label="Hue" />
        <input type="range" class="ayy-color-picker__alpha" min="0" max="100" value="100" aria-label="Opacity" />
      </div>
    </div>
    <div class="ayy-color-picker__inputs">
      <div class="ayy-input-group ayy-input-group--sm">
        <span class="ayy-input-group__addon">HEX</span>
        <input type="text" class="ayy-input ayy-mono" value="#2563eb" aria-label="Hex color" spellcheck="false" />
        <ayy-tooltip class="ayy-tooltip">
          <button type="button" class="ayy-button ayy-button--ghost ayy-button--icon-sm ayy-color-picker__copy" aria-label="Copy hex">
            <svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7.5 14.5C7.5 11.2002 7.5 9.55025 8.52513 8.52513C9.55025 7.5 11.2002 7.5 14.5 7.5C17.7998 7.5 19.4497 7.5 20.4749 8.52513C21.5 9.55025 21.5 11.2002 21.5 14.5C21.5 17.7998 21.5 19.4497 20.4749 20.4749C19.4497 21.5 17.7998 21.5 14.5 21.5C11.2002 21.5 9.55025 21.5 8.52513 20.4749C7.5 19.4497 7.5 17.7998 7.5 14.5Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/><path d="M7.5 16.5C6.10355 16.5 5.40533 16.5 4.84402 16.3036C3.83866 15.9518 3.0482 15.1613 2.69641 14.156C2.5 13.5947 2.5 12.8964 2.5 11.5V9.5C2.5 6.20017 2.5 4.55025 3.52513 3.52513C4.55025 2.5 6.20017 2.5 9.5 2.5H11.5C12.8964 2.5 13.5947 2.5 14.156 2.69641C15.1613 3.0482 15.9518 3.83866 16.3036 4.84402C16.5 5.40533 16.5 6.10355 16.5 7.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/></svg>
          </button>
          <span class="ayy-tooltip__content" role="tooltip">Copy hex</span>
        </ayy-tooltip>
      </div>
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
      addon="HEX"
      addonPosition="start"
      copyable
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
      <div class="ayy-stack" style="--ayy-gap: var(--ayy-space-1); flex: 1; min-inline-size: 0">
        <input type="range" class="ayy-color-picker__hue" min="0" max="360" value="160" aria-label="Hue" />
      </div>
    </div>
    <div class="ayy-color-picker__inputs">
      <div class="ayy-input-group ayy-input-group--sm">
        <input type="text" class="ayy-input ayy-mono" value="#10b981" aria-label="Hex color" spellcheck="false" />
        <span class="ayy-input-group__addon">HEX</span>
        <ayy-tooltip class="ayy-tooltip">
          <button type="button" class="ayy-button ayy-button--ghost ayy-button--icon-sm ayy-color-picker__copy" aria-label="Copy hex">
            <svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7.5 14.5C7.5 11.2002 7.5 9.55025 8.52513 8.52513C9.55025 7.5 11.2002 7.5 14.5 7.5C17.7998 7.5 19.4497 7.5 20.4749 8.52513C21.5 9.55025 21.5 11.2002 21.5 14.5C21.5 17.7998 21.5 19.4497 20.4749 20.4749C19.4497 21.5 17.7998 21.5 14.5 21.5C11.2002 21.5 9.55025 21.5 8.52513 20.4749C7.5 19.4497 7.5 17.7998 7.5 14.5Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/><path d="M7.5 16.5C6.10355 16.5 5.40533 16.5 4.84402 16.3036C3.83866 15.9518 3.0482 15.1613 2.69641 14.156C2.5 13.5947 2.5 12.8964 2.5 11.5V9.5C2.5 6.20017 2.5 4.55025 3.52513 3.52513C4.55025 2.5 6.20017 2.5 9.5 2.5H11.5C12.8964 2.5 13.5947 2.5 14.156 2.69641C15.1613 3.0482 15.9518 3.83866 16.3036 4.84402C16.5 5.40533 16.5 6.10355 16.5 7.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/></svg>
          </button>
          <span class="ayy-tooltip__content" role="tooltip">Copy hex</span>
        </ayy-tooltip>
      </div>
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

  return (
    <ColorPicker
      value={color}
      onValueChange={setColor}
      addon="HEX"
      addonPosition="end"
      copyable
    />
  );
}
```

---
Part of @danitesler/ayywi 0.0.3: load `dist/ayywi.min.css` (and `dist/elements.global.js` for the <ayy-*> elements). The rules every screen follows: [llms-full.txt#rules](../llms-full.txt#rules). Every component: [llms.txt](../llms.txt).
