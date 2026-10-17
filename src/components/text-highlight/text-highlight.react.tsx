import { forwardRef, Fragment, type ElementType, type HTMLAttributes, type ReactNode } from "react";
import { textHighlightClass, textHighlightParts, type TextHighlightVariant } from "./text-highlight";

export interface TextHighlightProps extends Omit<HTMLAttributes<HTMLElement>, "children"> {
  /** The text to highlight within. If omitted, string children will be used. */
  text?: string;
  /** Substring or words to highlight. When omitted, all content receives the highlight styling. */
  query?: string;
  /** Tint colour variant. Default is subtle tinted-white. */
  variant?: TextHighlightVariant;
  /** Element tag to render. Defaults to Fragment when splitting matches with query, or mark when highlighting whole content. */
  as?: ElementType;
  children?: ReactNode;
}

/**
 * An inline highlight for search matches or callout text.
 * By default uses a subtle tinted-white background, with warning, destructive, success, info, and orange variants.
 */
export const TextHighlight = forwardRef<HTMLElement, TextHighlightProps>(function TextHighlight(
  { text: textProp, query, variant, as, className, children, ...props },
  ref,
) {
  const content = textProp ?? (typeof children === "string" ? children : undefined);

  // If a query is provided and we have text content, split and highlight matches
  if (query !== undefined && content !== undefined) {
    const parts = textHighlightParts(content, query);
    const Comp = as ?? Fragment;
    const compProps = as ? { ref, className, ...props } : {};

    return (
      <Comp {...compProps}>
        {parts.map((part, index) =>
          part.match ? (
            <mark key={index} className={textHighlightClass({ variant, className: as ? undefined : className })}>
              {part.text}
            </mark>
          ) : (
            <Fragment key={index}>{part.text}</Fragment>
          ),
        )}
      </Comp>
    );
  }

  // Direct highlight callout on children or text
  const Comp = as ?? "mark";
  return (
    <Comp ref={ref} className={textHighlightClass({ variant, className })} {...props}>
      {children ?? content}
    </Comp>
  );
});
