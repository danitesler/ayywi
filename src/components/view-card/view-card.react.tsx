import { forwardRef, type AnchorHTMLAttributes, type Ref, type ButtonHTMLAttributes, type CSSProperties, type HTMLAttributes, type ImgHTMLAttributes, type ReactNode } from "react";
import { cx } from "../../lib/cx";
import { PlayIcon } from "../../lib/icons";
import { Icon } from "../icon/icon.react";
import { viewCardClass } from "./view-card";

export interface ViewCardProps extends HTMLAttributes<HTMLElement> {}

export const ViewCard = forwardRef<HTMLElement, ViewCardProps>(function ViewCard({ className, children, ...props }, ref) {
  return (
    <article ref={ref} className={viewCardClass({ className })} {...props}>
      {children}
    </article>
  );
});

export interface ViewCardMediaProps extends HTMLAttributes<HTMLElement> {
  /** The picture's shape, width ÷ height (1.6, or "1440 / 900"). Default 16 / 10 so a grid of cards lines up. */
  ratio?: number | string;
  /** Renders a link to it. */
  href?: string;
  target?: AnchorHTMLAttributes<HTMLAnchorElement>["target"];
  rel?: string;
}

/** The picture area. A link with href, a button with onClick (open, play, annotate), otherwise a plain block. */
export const ViewCardMedia = forwardRef<HTMLElement, ViewCardMediaProps>(function ViewCardMedia(
  { ratio, className, style, children, ...props },
  ref,
) {
  const classes = cx("ayy-view-card__media", className);
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

export interface ViewCardImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  /** A different picture for the blurred fill around it (a smaller thumbnail). Default: src. */
  backdrop?: string;
}

/** The picture, letterboxed, over a blurred copy of itself. Renders two <img>s. */
export const ViewCardImage = forwardRef<HTMLImageElement, ViewCardImageProps>(function ViewCardImage(
  { backdrop, src, alt = "", className, ...props },
  ref,
) {
  return (
    <>
      <img className="ayy-view-card__backdrop" src={backdrop ?? src} alt="" aria-hidden="true" draggable={false} />
      <img ref={ref} className={cx("ayy-view-card__image", className)} src={src} alt={alt} draggable={false} {...props} />
    </>
  );
});

export interface ViewCardBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /** Leading icon, e.g. <Icon icon={Video01Icon} />. */
  icon?: ReactNode;
}

/** The kind and length of a recording ("0:42"), top start corner. */
export const ViewCardBadge = forwardRef<HTMLSpanElement, ViewCardBadgeProps>(function ViewCardBadge(
  { icon, className, children, ...props },
  ref,
) {
  return (
    <span ref={ref} className={cx("ayy-view-card__badge", className)} {...props}>
      {icon}
      {children}
    </span>
  );
});

/** The "this plays" badge in the top end corner. It fades when hover actions take the corner. */
export const ViewCardPlay = forwardRef<HTMLSpanElement, HTMLAttributes<HTMLSpanElement>>(function ViewCardPlay(
  { className, ...props },
  ref,
) {
  return (
    <span ref={ref} className={cx("ayy-view-card__play", className)} aria-hidden="true" {...props}>
      <Icon icon={PlayIcon} size="sm" />
    </span>
  );
});

export const ViewCardBody = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(function ViewCardBody(
  { className, children, ...props },
  ref,
) {
  return (
    <div ref={ref} className={cx("ayy-view-card__body", className)} {...props}>
      {children}
    </div>
  );
});

export const ViewCardText = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(function ViewCardText(
  { className, children, ...props },
  ref,
) {
  return (
    <div ref={ref} className={cx("ayy-view-card__text", className)} {...props}>
      {children}
    </div>
  );
});

export const ViewCardTitle = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(function ViewCardTitle(
  { className, children, ...props },
  ref,
) {
  return (
    <p ref={ref} className={cx("ayy-view-card__title", className)} {...props}>
      {children}
    </p>
  );
});

export const ViewCardMeta = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(function ViewCardMeta(
  { className, children, ...props },
  ref,
) {
  return (
    <p ref={ref} className={cx("ayy-view-card__meta", className)} {...props}>
      {children}
    </p>
  );
});

export const ViewCardBadges = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(function ViewCardBadges(
  { className, children, ...props },
  ref,
) {
  return (
    <div ref={ref} className={cx("ayy-view-card__badges", className)} {...props}>
      {children}
    </div>
  );
});
