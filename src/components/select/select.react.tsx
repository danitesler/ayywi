import { forwardRef, useEffect, useLayoutEffect, useRef, useState, type HTMLAttributes, type ReactNode, type SelectHTMLAttributes } from "react";
import { cx } from "../../lib/cx";
import { mergeRefs } from "../../lib/refs";
import { openSelectListFrom, selectClass, selectControlClass, selectPictureClass, type SelectSize } from "./select";

// Layout effects warn during server rendering; the value is read again on the client.
const useIsomorphicLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  /** Visual size. (The native `size` attribute — visible rows — isn't exposed; use `multiple` for a list box.) */
  size?: SelectSize;
  /** A picture per option value (a theme thumbnail, "Aa" in a font): the chosen one shows before the text, and the
   *  list shows each before its option. */
  pictures?: Record<string, ReactNode>;
  /** Every choice from ayywi's list, the option already chosen included (onChange only fires for a new one): for an
   *  option that acts each time, such as Custom colour. */
  onChoose?: (value: string) => void;
  /** Props for the wrapper <div> that draws the chevron. `className` goes to the <select>. */
  wrapperProps?: HTMLAttributes<HTMLDivElement>;
}

/**
 * A styled native <select>. Children are regular <option>/<optgroup> elements. With a mouse or trackpad the options
 * open in ayywi's list; touch screens keep the OS picker. onChange fires either way.
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { size, className, wrapperProps, pictures, onChoose, onMouseDown, onClick, onKeyDown, onChange, ...props },
  ref,
) {
  const select = useRef<HTMLSelectElement>(null);
  // Which picture shows: the controlled value, else the select's own as it changes.
  const [own, setOwn] = useState<string | undefined>(() => (props.defaultValue === undefined ? undefined : String(props.defaultValue)));
  const shown = props.value !== undefined ? String(props.value) : own;
  useIsomorphicLayoutEffect(() => {
    if (pictures && props.value === undefined && select.current) setOwn(select.current.value);
  }, []);

  const onChooseRef = useRef(onChoose);
  onChooseRef.current = onChoose;
  useEffect(() => {
    const el = select.current;
    if (!el) return;
    const listener = (event: Event) => onChooseRef.current?.((event as CustomEvent<{ value: string }>).detail.value);
    el.addEventListener("ayy-choose", listener);
    return () => el.removeEventListener("ayy-choose", listener);
  }, []);

  return (
    <div {...wrapperProps} className={selectClass({ size, className: wrapperProps?.className })}>
      <select
        ref={mergeRefs(ref, select)}
        className={cx(selectControlClass, className)}
        onMouseDown={(event) => {
          onMouseDown?.(event);
          openSelectListFrom(event.nativeEvent);
        }}
        onClick={(event) => {
          onClick?.(event);
          openSelectListFrom(event.nativeEvent);
        }}
        onKeyDown={(event) => {
          onKeyDown?.(event);
          openSelectListFrom(event.nativeEvent);
        }}
        onChange={(event) => {
          setOwn(event.currentTarget.value);
          onChange?.(event);
        }}
        {...props}
      />
      {pictures &&
        Object.entries(pictures).map(([value, picture]) => (
          <span key={value} className={selectPictureClass} data-value={value} hidden={value !== shown} aria-hidden="true">
            {picture}
          </span>
        ))}
    </div>
  );
});
