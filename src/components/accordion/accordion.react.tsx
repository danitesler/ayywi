import { createContext, forwardRef, useContext, useId, type DetailsHTMLAttributes, type HTMLAttributes, type ReactNode } from "react";
import { cx } from "../../lib/cx";
import { accordionClass, accordionContentClass, accordionItemClass, accordionTriggerClass } from "./accordion";

const AccordionContext = createContext<string | undefined>(undefined);

export interface AccordionProps extends HTMLAttributes<HTMLDivElement> {
  /** Only one item open at a time (every <details> gets the same name). */
  single?: boolean;
}

/** A stack of AccordionItem, divided by hairlines. */
export const Accordion = forwardRef<HTMLDivElement, AccordionProps>(function Accordion({ single, className, ...props }, ref) {
  const name = useId();
  return (
    <AccordionContext.Provider value={single ? name : undefined}>
      <div ref={ref} className={cx(accordionClass, className)} {...props} />
    </AccordionContext.Provider>
  );
});

export interface AccordionItemProps extends Omit<DetailsHTMLAttributes<HTMLDetailsElement>, "title"> {
  /** The always-visible row: a question or a section name. */
  label: ReactNode;
}

/** A native <details>: the label is its <summary>, the children its content. Pass `open` to start expanded. */
export const AccordionItem = forwardRef<HTMLDetailsElement, AccordionItemProps>(function AccordionItem(
  { label, className, children, ...props },
  ref,
) {
  const name = useContext(AccordionContext);
  return (
    <details ref={ref} className={cx(accordionItemClass, className)} name={name} {...props}>
      <summary className={accordionTriggerClass}>{label}</summary>
      <div className={accordionContentClass}>{children}</div>
    </details>
  );
});
