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
import { swatchClass, swatchGroupClass, syncSwatch, type SwatchSize } from "./swatch";

const colourStyle = (color: string | undefined, style: CSSProperties | undefined) =>
  (color === undefined ? style : { "--ayy-swatch": color, ...style }) as CSSProperties | undefined;

export interface SwatchProps extends Omit<LabelHTMLAttributes<HTMLLabelElement>, "onChange"> {
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
  size?: SwatchSize;
  /** "No colour" swatch. */
  none?: boolean;
  /** Props for the native radio. */
  inputProps?: Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "name" | "value" | "checked" | "defaultChecked" | "disabled">;
}

/** One colour in a SwatchGroup: a <label> around a visually hidden radio. */
export const Swatch = forwardRef<HTMLLabelElement, SwatchProps>(function Swatch(
  { color, label, name, value, checked, defaultChecked, onCheckedChange, disabled, size, none, inputProps, className, style, ...props },
  ref,
) {
  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    inputProps?.onChange?.(event);
    onCheckedChange?.(event.currentTarget.checked);
  };
  return (
    <label ref={ref} className={swatchClass({ size, none, className })} style={colourStyle(color, style)} {...props}>
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

export interface SwatchButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  color?: string;
  /** Accessible name ("Red"). */
  label: string;
  pressed: boolean;
  size?: SwatchSize;
  none?: boolean;
}

/** A colour that applies on click (an editor's pen colour): <button aria-pressed>. */
export const SwatchButton = forwardRef<HTMLButtonElement, SwatchButtonProps>(function SwatchButton(
  { color, label, pressed, size, none, type = "button", className, style, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      aria-pressed={pressed}
      aria-label={label}
      className={swatchClass({ size, none, className })}
      style={colourStyle(color, style)}
      {...props}
    />
  );
});

export interface SwatchCustomProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
  /** Accessible name ("Custom colour"). */
  label: string;
  size?: SwatchSize;
}

/** Any colour: a native <input type="color"> drawn as a rainbow ring around the colour it holds. */
export const SwatchCustom = forwardRef<HTMLInputElement, SwatchCustomProps>(function SwatchCustom(
  { label, size, className, style, value, onInput, ...props },
  ref,
) {
  const input = useRef<HTMLInputElement>(null);
  // The colour shows once mounted (and on every pick), so the markup carries no raw colour.
  useEffect(() => {
    if (input.current) syncSwatch(input.current);
  }, [value]);
  return (
    <label className={swatchClass({ size, custom: true, className })} style={style}>
      <input
        ref={mergeRefs(ref, input)}
        type="color"
        aria-label={label}
        value={value}
        onInput={(event) => {
          onInput?.(event);
          syncSwatch(event.currentTarget);
        }}
        {...props}
      />
    </label>
  );
});

export interface SwatchGroupProps extends HTMLAttributes<HTMLDivElement> {
  /** On a pill-shaped track, like a toolbar's colour row. */
  track?: boolean;
}

/** A row of swatches: role="radiogroup" with an aria-label ("Colour"). Pass role="group" for SwatchButtons. */
export const SwatchGroup = forwardRef<HTMLDivElement, SwatchGroupProps>(function SwatchGroup({ track, role = "radiogroup", className, ...props }, ref) {
  return <div ref={ref} role={role} className={swatchGroupClass({ track, className })} {...props} />;
});
