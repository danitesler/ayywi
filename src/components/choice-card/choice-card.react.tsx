import {
  createContext,
  forwardRef,
  useContext,
  useId,
  useState,
  type ChangeEvent,
  type CSSProperties,
  type HTMLAttributes,
  type InputHTMLAttributes,
  type LabelHTMLAttributes,
  type ReactNode,
} from "react";
import { cx } from "../../lib/cx";
import { checkboxClass } from "../checkbox/checkbox";
import { radioClass } from "../radio/radio";
import {
  choiceCardClass,
  choiceCardDescriptionClass,
  choiceCardMetaClass,
  choiceCardTitleClass,
  choiceGroupClass,
  choiceGroupLegendClass,
} from "./choice-card";

interface ChoiceContextValue {
  name: string;
  value: string | undefined;
  select: (value: string) => void;
}

const ChoiceContext = createContext<ChoiceContextValue | null>(null);

export interface ChoiceGroupProps extends Omit<HTMLAttributes<HTMLFieldSetElement>, "onChange" | "defaultValue"> {
  /** The question ("Plan", "Delivery"): the fieldset's <legend>. Or label it with aria-label. */
  legend?: ReactNode;
  /** "radio" (default): one choice, kept by the group. "checkbox": cards that combine; give each its own checked. */
  type?: "radio" | "checkbox";
  /** Shared radio name (for forms). Generated if omitted. */
  name?: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Narrowest card before the grid drops a column (default 12rem, 6rem for compact cards). */
  min?: string;
  /** One row that scrolls sideways instead of wrapping (a day strip). */
  scroll?: boolean;
  disabled?: boolean;
}

/** A <fieldset> grid of choice cards; role="radiogroup" for radio cards. */
export const ChoiceGroup = forwardRef<HTMLFieldSetElement, ChoiceGroupProps>(function ChoiceGroup(
  { legend, type = "radio", name, value: controlled, defaultValue, onValueChange, min, scroll, disabled, className, style, children, ...props },
  ref,
) {
  const generated = useId();
  const [uncontrolled, setUncontrolled] = useState(defaultValue);
  const value = controlled ?? uncontrolled;
  const select = (next: string) => {
    if (controlled === undefined) setUncontrolled(next);
    onValueChange?.(next);
  };
  const fieldset = (
    <fieldset
      ref={ref}
      role={type === "radio" ? "radiogroup" : undefined}
      disabled={disabled}
      className={choiceGroupClass({ scroll, className })}
      style={min ? ({ "--ayy-min": min, ...style } as CSSProperties) : style}
      {...props}
    >
      {legend && <legend className={choiceGroupLegendClass}>{legend}</legend>}
      {children}
    </fieldset>
  );
  if (type === "checkbox") return fieldset;
  return <ChoiceContext.Provider value={{ name: name ?? generated, value, select }}>{fieldset}</ChoiceContext.Provider>;
});

export interface ChoiceCardProps extends Omit<LabelHTMLAttributes<HTMLLabelElement>, "onChange" | "title"> {
  /** The option's value. Inside a ChoiceGroup it's the group's radio value. */
  value?: string;
  title: ReactNode;
  description?: ReactNode;
  /** A price or a date, at the bottom. */
  meta?: ReactNode;
  /** An Icon or Icon tile above the title. */
  icon?: ReactNode;
  /** A time slot or a size: centred, input hidden, filled when chosen. */
  compact?: boolean;
  /** Outside a ChoiceGroup: "checkbox" (default) for several choices, "radio" with your own name and checked. */
  type?: "radio" | "checkbox";
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  /** Props for the native input. */
  inputProps?: Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "value" | "checked" | "defaultChecked" | "disabled">;
}

/** A card-sized radio or checkbox: the whole card is the label. */
export const ChoiceCard = forwardRef<HTMLLabelElement, ChoiceCardProps>(function ChoiceCard(
  { value, title, description, meta, icon, compact, type, checked, defaultChecked, onCheckedChange, disabled, inputProps, className, ...props },
  ref,
) {
  const group = useContext(ChoiceContext);
  const kind = group ? "radio" : (type ?? "checkbox");
  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    inputProps?.onChange?.(event);
    onCheckedChange?.(event.currentTarget.checked);
    if (group && event.currentTarget.checked && value !== undefined) group.select(value);
  };
  return (
    <label ref={ref} className={choiceCardClass({ compact, className })} {...props}>
      <input
        {...inputProps}
        type={kind}
        className={cx(kind === "radio" ? radioClass : checkboxClass, inputProps?.className)}
        name={group?.name ?? inputProps?.name}
        value={value}
        checked={group ? group.value === value : checked}
        defaultChecked={group ? undefined : defaultChecked}
        disabled={disabled}
        onChange={onChange}
      />
      {icon}
      <span className={choiceCardTitleClass}>{title}</span>
      {description && <span className={choiceCardDescriptionClass}>{description}</span>}
      {meta && <span className={choiceCardMetaClass}>{meta}</span>}
    </label>
  );
});
