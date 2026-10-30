import { forwardRef, type AnchorHTMLAttributes, type ButtonHTMLAttributes, type CSSProperties, type HTMLAttributes, type ImgHTMLAttributes, type ReactNode, type Ref } from "react";
import { cx } from "../../lib/cx";
import { PlayIcon } from "../../lib/icons";
import { Icon } from "../icon/icon.react";
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
  /** No fill and no shadow: the page shows through, the border stays. */
  transparent?: boolean;
  /** The one to pick: the recommended plan, the option you chose. A border in the text colour. */
  featured?: boolean;
  /** Spotlight colour. Any CSS colour or token, e.g. "var(--ayy-accent-product)". */
  spotColor?: string;
  /** A capture, recording or picture to open: CardViewMedia fills the card, CardViewBody and Hover actions show on hover. */
  view?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { interactive, spotlight, transparent, featured, view, spotColor, className, style, onPointerMove, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cardClass({ interactive, spotlight, transparent, featured, view, className })}
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

// ---- view: a capture, a recording or a picture to open ----

export interface CardViewMediaProps extends HTMLAttributes<HTMLElement> {
  /** The picture's shape, width ÷ height (1.6, or "1440 / 900"). Default 16 / 10 so a grid of cards lines up. */
  ratio?: number | string;
  /** Renders a link to it. */
  href?: string;
  target?: AnchorHTMLAttributes<HTMLAnchorElement>["target"];
  rel?: string;
}

/** The picture area. A link with href, a button with onClick (open, play, annotate), otherwise a plain block. */
export const CardViewMedia = forwardRef<HTMLElement, CardViewMediaProps>(function CardViewMedia(
  { ratio, className, style, children, ...props },
  ref,
) {
  const classes = cx("ayy-card__view-media", className);
  const merged = (ratio === undefined ? style : { ...style, "--ayy-ratio": String(ratio) }) as CSSProperties | undefined;
  if (typeof props.href === "string") {
    return (
      <a ref={ref as Ref<HTMLAnchorElement>} className={classes} style={merged} {...(props as AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {children}
      </a>
    );
  }
  const { target: _target, rel: _rel, ...rest } = props;
  if (rest.onClick) {
    return (
      <button ref={ref as Ref<HTMLButtonElement>} type="button" className={classes} style={merged} {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}>
        {children}
      </button>
    );
  }
  return (
    <div ref={ref as Ref<HTMLDivElement>} className={classes} style={merged} {...(rest as HTMLAttributes<HTMLDivElement>)}>
      {children}
    </div>
  );
});

export interface CardViewImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  /** A different picture for the blurred fill around it (a smaller thumbnail). Default: src. */
  backdrop?: string;
}

/** The picture, letterboxed, over a blurred copy of itself. Renders two <img>s. */
export const CardViewImage = forwardRef<HTMLImageElement, CardViewImageProps>(function CardViewImage(
  { backdrop, src, alt = "", className, ...props },
  ref,
) {
  return (
    <>
      <img className="ayy-card__view-backdrop" src={backdrop ?? src} alt="" aria-hidden="true" draggable={false} />
      <img ref={ref} className={cx("ayy-card__view-image", className)} src={src} alt={alt} draggable={false} {...props} />
    </>
  );
});

export interface CardViewBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /** Leading icon, e.g. <Icon icon={Video01Icon} />. */
  icon?: ReactNode;
}

/** The kind and length of a recording ("0:42"), top start corner. */
export const CardViewBadge = forwardRef<HTMLSpanElement, CardViewBadgeProps>(function CardViewBadge(
  { icon, className, children, ...props },
  ref,
) {
  return (
    <span ref={ref} className={cx("ayy-card__view-badge", className)} {...props}>
      {icon}
      {children}
    </span>
  );
});

/** The "this plays" badge in the top end corner. It fades when hover actions take the corner. */
export const CardViewPlay = forwardRef<HTMLSpanElement, HTMLAttributes<HTMLSpanElement>>(function CardViewPlay(
  { className, ...props },
  ref,
) {
  return (
    <span ref={ref} className={cx("ayy-card__view-play", className)} aria-hidden="true" {...props}>
      <Icon icon={PlayIcon} name="play" size="sm" />
    </span>
  );
});

export const CardViewBody = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(function CardViewBody(
  { className, children, ...props },
  ref,
) {
  return (
    <div ref={ref} className={cx("ayy-card__view-body", className)} {...props}>
      {children}
    </div>
  );
});

export const CardViewText = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(function CardViewText(
  { className, children, ...props },
  ref,
) {
  return (
    <div ref={ref} className={cx("ayy-card__view-text", className)} {...props}>
      {children}
    </div>
  );
});

export const CardViewTitle = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(function CardViewTitle(
  { className, children, ...props },
  ref,
) {
  return (
    <p ref={ref} className={cx("ayy-card__view-title", className)} {...props}>
      {children}
    </p>
  );
});

export const CardViewMeta = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(function CardViewMeta(
  { className, children, ...props },
  ref,
) {
  return (
    <p ref={ref} className={cx("ayy-card__view-meta", className)} {...props}>
      {children}
    </p>
  );
});

export const CardViewBadges = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(function CardViewBadges(
  { className, children, ...props },
  ref,
) {
  return (
    <div ref={ref} className={cx("ayy-card__view-badges", className)} {...props}>
      {children}
    </div>
  );
});
