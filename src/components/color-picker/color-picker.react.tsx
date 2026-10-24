import {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type KeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import { cx } from "../../lib/cx";
import { Copy01Icon, Tick02Icon } from "../../lib/icons";
import { Button } from "../button/button.react";
import { Icon } from "../icon/icon.react";
import { Input, InputGroup, InputGroupAddon } from "../input/input.react";
import { toast } from "../toast/toast";
import { Tooltip } from "../tooltip/tooltip.react";
import {
  colorPickerAlphaClass,
  colorPickerAreaBackground,
  colorPickerAreaClass,
  colorPickerClassConstant,
  colorPickerCopyClass,
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
  addon?: ReactNode;
  addonPosition?: "start" | "end";
  copyable?: boolean;
}

/** Do two strings name the same colour ("#fff" and "#FFFFFF")? */
function sameColor(a: string, b: string): boolean {
  const x = hexToRgb(a);
  const y = hexToRgb(b);
  return Boolean(x && y && rgbToHex(x) === rgbToHex(y));
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
    addon = "HEX",
    addonPosition = "end",
    copyable = false,
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
  const [copied, setCopied] = useState(false);
  const copyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const areaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return () => {
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
    };
  }, []);

  const handleCopy = (e: ReactMouseEvent) => {
    e.preventDefault();
    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      void navigator.clipboard.writeText(currentHex);
    }
    setCopied(true);
    toast("Color copied to clipboard");
    if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
    copyTimerRef.current = setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  useEffect(() => {
    const parsed = hexToRgb(currentHex);
    if (parsed) {
      const nextHsv = rgbToHsv(parsed);
      setInternalHsv((prev) => {
        const h = nextHsv.s === 0 || nextHsv.v === 0 ? prev.h : nextHsv.h;
        return { h, s: nextHsv.s, v: nextHsv.v, a: parsed.a ?? (prev.a ?? 1) };
      });
      // Keep what's being typed ("#fff") while it's the same colour as the value ("#ffffff").
      setInputText((text) => (sameColor(text, currentHex) ? text : currentHex));
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
      const h = nextHsv.s === 0 || nextHsv.v === 0 ? internalHsv.h : nextHsv.h;
      const finalHsv: HSV = { h, s: nextHsv.s, v: nextHsv.v, a: rgb.a ?? (internalHsv.a ?? 1) };
      if (!alpha) {
        delete finalHsv.a;
      }
      setInternalHsv(finalHsv);
      // Emit #rrggbb (#rrggbbaa with alpha), not the text as typed: "#FFF" isn't a value <input type=color> accepts.
      const nextHex = rgbToHex(alpha ? { ...rgb, a: finalHsv.a } : { r: rgb.r, g: rgb.g, b: rgb.b });
      if (controlled === undefined) {
        setUncontrolled(nextHex);
      }
      onValueChange?.(nextHex);
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
        <div className="ayy-stack" style={{ "--ayy-gap": "var(--ayy-space-1)", flex: 1, minInlineSize: 0 } as CSSProperties}>
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
              onChange={(e) => {
                // Only the alpha changes: keep the RGB exactly (rebuilding it from the rounded HSV shifts it).
                const a = e.currentTarget.valueAsNumber / 100;
                const rgb = hexToRgb(currentHex) ?? hsvToRgb(internalHsv);
                setInternalHsv({ ...internalHsv, a });
                const nextHex = rgbToHex({ r: rgb.r, g: rgb.g, b: rgb.b, a });
                setInputText(nextHex);
                if (controlled === undefined) setUncontrolled(nextHex);
                onValueChange?.(nextHex);
              }}
            />
          )}
        </div>
      </div>

      <div className={colorPickerInputsClass}>
        <InputGroup size="sm">
          {Boolean(addon) && addonPosition === "start" && <InputGroupAddon>{addon}</InputGroupAddon>}
          <Input
            value={inputText}
            aria-label="Hex color"
            spellCheck={false}
            className="ayy-mono"
            onChange={(e) => onInputChange(e.target.value)}
            onBlur={onInputBlur}
          />
          {Boolean(addon) && addonPosition === "end" && <InputGroupAddon>{addon}</InputGroupAddon>}
          {copyable && (
            <Tooltip content={copied ? "Copied!" : "Copy hex"}>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className={colorPickerCopyClass}
                aria-label={copied ? "Copied!" : "Copy hex"}
                onClick={handleCopy}
              >
                <Icon icon={copied ? Tick02Icon : Copy01Icon} />
              </Button>
            </Tooltip>
          )}
        </InputGroup>
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
                const rgb = hexToRgb(swatchHex);
                if (rgb) {
                  const nextHsv = rgbToHsv(rgb);
                  const h = nextHsv.s === 0 || nextHsv.v === 0 ? internalHsv.h : nextHsv.h;
                  const finalHsv: HSV = { h, s: nextHsv.s, v: nextHsv.v, a: rgb.a ?? (internalHsv.a ?? 1) };
                  if (!alpha) {
                    delete finalHsv.a;
                  }
                  setInternalHsv(finalHsv);
                  setInputText(swatchHex);
                  if (controlled === undefined) setUncontrolled(swatchHex);
                  onValueChange?.(swatchHex);
                }
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
});
