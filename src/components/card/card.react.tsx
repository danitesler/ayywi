import { forwardRef, type AnchorHTMLAttributes, type CSSProperties, type HTMLAttributes } from "react";
import { cx } from "../../lib/cx";
import { cardClass, trackSpotlight } from "./card";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  interactive?: boolean;
  spotlight?: boolean;
  /** Spotlight colour. Any CSS colour or token, e.g. "var(--ayy-accent-product)". */
  spotColor?: string;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { interactive, spotlight, spotColor, className, style, onPointerMove, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cardClass({ interactive, spotlight, className })}
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

export const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(function CardHeader(
  { className, ...props },
  ref,
) {
  return <div ref={ref} className={cx("ayy-card__header", className)} {...props} />;
});

export const CardTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(function CardTitle(
  { className, ...props },
  ref,
) {
  return <h3 ref={ref} className={cx("ayy-card__title", className)} {...props} />;
});

export const CardDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  function CardDescription({ className, ...props }, ref) {
    return <p ref={ref} className={cx("ayy-card__description", className)} {...props} />;
  },
);

export const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(function CardContent(
  { className, ...props },
  ref,
) {
  return <div ref={ref} className={cx("ayy-card__content", className)} {...props} />;
});

export const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(function CardFooter(
  { className, ...props },
  ref,
) {
  return <div ref={ref} className={cx("ayy-card__footer", className)} {...props} />;
});

export const CardMedia = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(function CardMedia(
  { className, ...props },
  ref,
) {
  return <div ref={ref} className={cx("ayy-card__media", className)} {...props} />;
});

/** The title's link, stretched over the whole card. Put it inside <CardTitle>. */
export const CardLink = forwardRef<HTMLAnchorElement, AnchorHTMLAttributes<HTMLAnchorElement>>(function CardLink(
  { className, ...props },
  ref,
) {
  return <a ref={ref} className={cx("ayy-card__link", className)} {...props} />;
});
