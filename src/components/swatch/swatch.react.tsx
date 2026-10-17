import {
  forwardRef,
  useEffect,
  useRef,
  type ButtonHTMLAttributes,
  type ChangeEvent,
  type CSSProperties,
  type HTMLAttributes,
  type InputHTMLAttributes,
  type LabelHTMLAttributes,
} from "react";
import { mergeRefs } from "../../lib/refs";
import {
  colorSwatchClass,
  colorSwatchGroupClass,
  openColorPickerFrom,
  syncColorSwatch,
  type ColorSwatchSize,
} from "./swatch";

const colourStyle = (color: string | undefined, style: CSSProperties | undefined) =>
  (color === undefined ? style : { "--ayy-swatch": color, ...style }) as CSSProperties | undefined;

export interface ColorSwatchProps extends Omit<LabelHTMLAttributes<HTMLLabelElement>, "onChange"> {
  /** The colour: a CSS value, ideally a token ("var(--ayy-chart-2)"). Sets --ayy-swatch. Omit with none. */
  color?: string;
  /** Accessible name of the colour ("Blue"). Required: a dot has no text. */
  label: string;
  name?: string;
  value?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  size?: ColorSwatchSize;
  /** "No colour" swatch. */
  none?: boolean;
  /** Props for the native radio. */
  inputProps?: Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "name" | "value" | "checked" | "defaultChecked" | "disabled">;
}

/** One colour in a ColorSwatchGroup: a <label> around a visually hidden radio. */
export const ColorSwatch = forwardRef<HTMLLabelElement, ColorSwatchProps>(function ColorSwatch(
  { color, label, name, value, checked, defaultChecked, onCheckedChange, disabled, size, none, inputProps, className, style, ...props },
  ref,
) {
  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    inputProps?.onChange?.(event);
    onCheckedChange?.(event.currentTarget.checked);
  };
  return (
    <label ref={ref} className={colorSwatchClass({ size, none, className })} style={colourStyle(color, style)} {...props}>
      <input
        {...inputProps}
        type="radio"
        name={name}
        value={value}
        checked={checked}
        defaultChecked={defaultChecked}
        disabled={disabled}
        aria-label={label}
        onChange={onChange}
      />
    </label>
  );
});

export interface ColorSwatchButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  color?: string;
  /** Accessible name ("Red"). */
  label: string;
  pressed: boolean;
  onPressedChange?: (pressed: boolean) => void;
  size?: ColorSwatchSize;
  none?: boolean;
}

/** A colour that applies on click (an editor's pen colour): <button aria-pressed>. */
export const ColorSwatchButton = forwardRef<HTMLButtonElement, ColorSwatchButtonProps>(function ColorSwatchButton(
  { color, label, pressed, onPressedChange, size, none, type = "button", className, style, onClick, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      aria-pressed={pressed}
      aria-label={label}
      className={colorSwatchClass({ size, none, className })}
      style={colourStyle(color, style)}
      onClick={(e) => {
        onClick?.(e);
        if (!e.defaultPrevented) {
          onPressedChange?.(!pressed);
        }
      }}
      {...props}
    />
  );
});

export interface ColorSwatchCustomProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
  /** Accessible name ("Custom colour"). */
  label: string;
  size?: ColorSwatchSize;
}

/** Any colour: a native <input type="color"> drawn as a rainbow ring around the colour it holds. */
export const ColorSwatchCustom = forwardRef<HTMLInputElement, ColorSwatchCustomProps>(function ColorSwatchCustom(
  { label, size, className, style, value, onInput, onMouseDown, onClick, onKeyDown, ...props },
  ref,
) {
  const input = useRef<HTMLInputElement>(null);
  // The colour shows once mounted (and on every pick), so the markup carries no raw colour.
  useEffect(() => {
    if (input.current) syncColorSwatch(input.current);
  }, [value]);
  const initialColor = (value as string | undefined) ?? (props.defaultValue as string | undefined);
  return (
    <label
      className={colorSwatchClass({ size, custom: true, className })}
      style={colourStyle(initialColor, style)}
      onMouseDown={(event) => {
        if (event.target !== input.current) {
          openColorPickerFrom(event.nativeEvent);
        }
      }}
    >
      <input
        ref={mergeRefs(ref, input)}
        type="color"
        aria-label={label}
        value={value}
        onMouseDown={(event) => {
          onMouseDown?.(event);
          openColorPickerFrom(event.nativeEvent);
        }}
        onClick={(event) => {
          onClick?.(event);
          openColorPickerFrom(event.nativeEvent);
        }}
        onKeyDown={(event) => {
          onKeyDown?.(event);
          openColorPickerFrom(event.nativeEvent);
        }}
        onInput={(event) => {
          onInput?.(event);
          syncColorSwatch(event.currentTarget);
        }}
        {...props}
      />
    </label>
  );
});

export interface ColorSwatchGroupProps extends HTMLAttributes<HTMLDivElement> {
  /** On a pill-shaped track, like a toolbar's colour row. */
  track?: boolean;
}

/** A row of swatches: role="radiogroup" with an aria-label ("Colour"). Pass role="group" for ColorSwatchButtons. */
export const ColorSwatchGroup = forwardRef<HTMLDivElement, ColorSwatchGroupProps>(function ColorSwatchGroup({ track, role = "radiogroup", className, ...props }, ref) {
  return <div ref={ref} role={role} className={colorSwatchGroupClass({ track, className })} {...props} />;
});

export {
  ColorSwatch as Swatch,
  ColorSwatchButton as SwatchButton,
  ColorSwatchCustom as SwatchCustom,
  ColorSwatchGroup as SwatchGroup,
  type ColorSwatchProps as SwatchProps,
  type ColorSwatchButtonProps as SwatchButtonProps,
  type ColorSwatchCustomProps as SwatchCustomProps,
  type ColorSwatchGroupProps as SwatchGroupProps,
};
