import { forwardRef, type AnchorHTMLAttributes, type CSSProperties, type HTMLAttributes } from "react";
import { cx } from "../../lib/cx";
import {
  cardClass,
  cardContentClass,
  cardDescriptionClass,
  cardFooterClass,
  cardHeaderClass,
  cardLinkClass,
  cardMediaClass,
  cardTitleClass,
  trackSpotlight,
} from "./card";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  interactive?: boolean;
  spotlight?: boolean;
  /** The one to pick: the recommended plan, the option you chose. A border in the text colour. */
  featured?: boolean;
  /** Spotlight colour. Any CSS colour or token, e.g. "var(--ayy-accent-product)". */
  spotColor?: string;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { interactive, spotlight, featured, spotColor, className, style, onPointerMove, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cardClass({ interactive, spotlight, featured, className })}
      style={spotColor ? ({ "--ayy-spot": spotColor, ...style } as CSSProperties) : style}
      onPointerMove={
        spotlight
          ? (event) => {
              trackSpotlight(event);
              onPointerMove?.(event);
            }
          : onPointerMove
      }
      {...props}
    />
  );
});

export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {}

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(function CardHeader(
  { className, ...props },
  ref,
) {
  return <div ref={ref} className={cx(cardHeaderClass, className)} {...props} />;
});

export interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {}

export const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(function CardTitle(
  { className, ...props },
  ref,
) {
  return <h3 ref={ref} className={cx(cardTitleClass, className)} {...props} />;
});

export interface CardDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {}

export const CardDescription = forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  function CardDescription({ className, ...props }, ref) {
    return <p ref={ref} className={cx(cardDescriptionClass, className)} {...props} />;
  },
);

export interface CardContentProps extends HTMLAttributes<HTMLDivElement> {}

export const CardContent = forwardRef<HTMLDivElement, CardContentProps>(function CardContent(
  { className, ...props },
  ref,
) {
  return <div ref={ref} className={cx(cardContentClass, className)} {...props} />;
});

export interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {}

export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(function CardFooter(
  { className, ...props },
  ref,
) {
  return <div ref={ref} className={cx(cardFooterClass, className)} {...props} />;
});

export interface CardMediaProps extends HTMLAttributes<HTMLDivElement> {}

export const CardMedia = forwardRef<HTMLDivElement, CardMediaProps>(function CardMedia(
  { className, ...props },
  ref,
) {
  return <div ref={ref} className={cx(cardMediaClass, className)} {...props} />;
});

export interface CardLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {}

/** The title's link, stretched over the whole card. Put it inside <CardTitle>. */
export const CardLink = forwardRef<HTMLAnchorElement, CardLinkProps>(function CardLink(
  { className, ...props },
  ref,
) {
  return <a ref={ref} className={cx(cardLinkClass, className)} {...props} />;
});
