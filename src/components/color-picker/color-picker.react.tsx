import {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type KeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { cx } from "../../lib/cx";
import {
  colorPickerAlphaClass,
  colorPickerAreaBackground,
  colorPickerAreaClass,
  colorPickerClassConstant,
  colorPickerHandleClass,
  colorPickerHueClass,
  colorPickerHueTrackBackground,
  colorPickerInputsClass,
  colorPickerPreviewClass,
  colorPickerSlidersClass,
  colorPickerSwatchClass,
  colorPickerSwatchesClass,
  hexToRgb,
  hsvToRgb,
  rgbToHex,
  rgbToHsv,
  type HSV,
} from "./color-picker";

export interface ColorPickerProps extends Omit<HTMLAttributes<HTMLDivElement>, "defaultValue" | "onChange"> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (color: string) => void;
  alpha?: boolean;
  swatches?: string[];
}

function parseToHsv(colorStr: string): HSV {
  const rgb = hexToRgb(colorStr);
  if (!rgb) return { h: 217, s: 85, v: 92, a: 1 };
  return rgbToHsv(rgb);
}

/** A full-featured colour picker with 2D saturation/brightness area, hue and alpha sliders, hex input and preset swatches. */
export const ColorPicker = forwardRef<HTMLDivElement, ColorPickerProps>(function ColorPicker(
  {
    value: controlled,
    defaultValue,
    onValueChange,
    alpha = false,
    swatches,
    className,
    style,
    ...props
  },
  ref,
) {
  const [uncontrolled, setUncontrolled] = useState(defaultValue ?? "#2563eb");
  const currentHex = controlled ?? uncontrolled;

  const [internalHsv, setInternalHsv] = useState<HSV>(() => parseToHsv(currentHex));
  const [inputText, setInputText] = useState(currentHex);
  const areaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const parsed = hexToRgb(currentHex);
    if (parsed) {
      const nextHsv = rgbToHsv(parsed);
      setInternalHsv((prev) => {
        const h = nextHsv.s === 0 || nextHsv.v === 0 ? prev.h : nextHsv.h;
        return { h, s: nextHsv.s, v: nextHsv.v, a: parsed.a ?? (prev.a ?? 1) };
      });
      setInputText(currentHex);
    }
  }, [currentHex]);

  const updateColor = useCallback(
    (nextHsv: HSV) => {
      setInternalHsv(nextHsv);
      const rgb = hsvToRgb(nextHsv);
      if (!alpha) {
        delete rgb.a;
      }
      const nextHex = rgbToHex(rgb);
      setInputText(nextHex);
      if (controlled === undefined) {
        setUncontrolled(nextHex);
      }
      onValueChange?.(nextHex);
    },
    [alpha, controlled, onValueChange],
  );

  const handlePointerAt = useCallback(
    (clientX: number, clientY: number) => {
      const area = areaRef.current;
      if (!area) return;
      const rect = area.getBoundingClientRect();
      const x = Math.max(0, Math.min(rect.width, clientX - rect.left));
      const y = Math.max(0, Math.min(rect.height, clientY - rect.top));
      const s = Math.round((x / rect.width) * 100);
      const v = Math.round((1 - y / rect.height) * 100);
      updateColor({ ...internalHsv, s, v });
    },
    [internalHsv, updateColor],
  );

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    handlePointerAt(event.clientX, event.clientY);
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.buttons !== 1) return;
    handlePointerAt(event.clientX, event.clientY);
  };

  const onAreaKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const step = event.shiftKey ? 10 : 1;
    let nextS = internalHsv.s;
    let nextV = internalHsv.v;
    let handled = false;

    switch (event.key) {
      case "ArrowLeft":
        nextS = Math.max(0, internalHsv.s - step);
        handled = true;
        break;
      case "ArrowRight":
        nextS = Math.min(100, internalHsv.s + step);
        handled = true;
        break;
      case "ArrowUp":
        nextV = Math.min(100, internalHsv.v + step);
        handled = true;
        break;
      case "ArrowDown":
        nextV = Math.max(0, internalHsv.v - step);
        handled = true;
        break;
    }

    if (handled) {
      event.preventDefault();
      updateColor({ ...internalHsv, s: nextS, v: nextV });
    }
  };

  const onInputChange = (val: string) => {
    setInputText(val);
    const rgb = hexToRgb(val);
    if (rgb) {
      const nextHsv = rgbToHsv(rgb);
      if (!alpha) {
        delete nextHsv.a;
      }
      setInternalHsv(nextHsv);
      if (controlled === undefined) {
        setUncontrolled(val);
      }
      onValueChange?.(val);
    }
  };

  const onInputBlur = () => {
    setInputText(currentHex);
  };

  return (
    <div
      ref={ref}
      className={cx(colorPickerClassConstant, className)}
      style={
        {
          "--_hue": internalHsv.h,
          "--_area-bg": colorPickerAreaBackground(internalHsv.h),
          "--_hue-track": colorPickerHueTrackBackground,
          "--_x": `${internalHsv.s}%`,
          "--_y": `${100 - internalHsv.v}%`,
          "--_color": currentHex,
          ...style,
        } as CSSProperties
      }
      {...props}
    >
      <div
        ref={areaRef}
        tabIndex={0}
        role="slider"
        aria-label="Color saturation and brightness"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={internalHsv.v}
        aria-valuetext={`Saturation ${internalHsv.s}%, Brightness ${internalHsv.v}%`}
        className={colorPickerAreaClass}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onKeyDown={onAreaKeyDown}
      >
        <div className={colorPickerHandleClass} />
      </div>

      <div className={colorPickerSlidersClass}>
        <div className={colorPickerPreviewClass} aria-hidden="true" />
        <div className="ayy-stack" style={{ "--ayy-gap": "var(--ayy-space-2)", flex: 1, minInlineSize: 0 } as CSSProperties}>
          <input
            type="range"
            min={0}
            max={360}
            value={internalHsv.h}
            className={colorPickerHueClass}
            aria-label="Hue"
            onChange={(e) => updateColor({ ...internalHsv, h: e.currentTarget.valueAsNumber })}
          />
          {alpha && (
            <input
              type="range"
              min={0}
              max={100}
              value={Math.round((internalHsv.a ?? 1) * 100)}
              className={colorPickerAlphaClass}
              aria-label="Opacity"
              onChange={(e) => updateColor({ ...internalHsv, a: e.currentTarget.valueAsNumber / 100 })}
            />
          )}
        </div>
      </div>

      <div className={colorPickerInputsClass}>
        <input
          type="text"
          className="ayy-input"
          value={inputText}
          aria-label="Hex color"
          spellCheck={false}
          onChange={(e) => onInputChange(e.target.value)}
          onBlur={onInputBlur}
        />
      </div>

      {swatches && swatches.length > 0 && (
        <div className={colorPickerSwatchesClass} role="group" aria-label="Preset colors">
          {swatches.map((swatchHex) => (
            <button
              key={swatchHex}
              type="button"
              className={colorPickerSwatchClass}
              data-color={swatchHex}
              aria-pressed={swatchHex.toLowerCase() === currentHex.toLowerCase()}
              style={{ "--_swatch": swatchHex } as CSSProperties}
              aria-label={swatchHex}
              onClick={() => {
                const hsv = parseToHsv(swatchHex);
                setInternalHsv(hsv);
                setInputText(swatchHex);
                if (controlled === undefined) setUncontrolled(swatchHex);
                onValueChange?.(swatchHex);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
});
