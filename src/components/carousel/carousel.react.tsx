import { forwardRef, useEffect, useRef, type CSSProperties, type HTMLAttributes } from "react";
import { cx } from "../../lib/cx";
import { ArrowLeft02Icon, ArrowRight02Icon } from "../../lib/icons";
import { mergeRefs } from "../../lib/refs";
import { buttonClass } from "../button/button";
import { Icon } from "../icon/icon.react";
import { carouselClass, carouselControlsClass, carouselSlideClass, carouselTrackClass, connectCarousel } from "./carousel";

export interface CarouselProps extends HTMLAttributes<HTMLDivElement> {
  /** Accessible name of the carousel, e.g. "Team photos". */
  label: string;
  /** Width of each slide (any CSS length). Default min(22rem, 85%). */
  slideWidth?: string;
  /** Accessible names of the buttons. Default "Previous" / "Next" (translate them). */
  previousLabel?: string;
  nextLabel?: string;
  /** Each slide's name, with {index} and {count}. Default "{index} of {count}" (translate it). */
  slideLabel?: string;
}

export const Carousel = forwardRef<HTMLDivElement, CarouselProps>(function Carousel(
  { label, slideWidth, previousLabel = "Previous", nextLabel = "Next", slideLabel, className, style, children, ...props },
  ref,
) {
  const local = useRef<HTMLDivElement>(null);
  useEffect(() => (local.current ? connectCarousel(local.current) : undefined), []);
  return (
    <div
      ref={mergeRefs(ref, local)}
      className={cx(carouselClass, className)}
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      data-slide-label={slideLabel}
      style={slideWidth ? ({ "--ayy-slide": slideWidth, ...style } as CSSProperties) : style}
      {...props}
    >
      <div className={carouselTrackClass} tabIndex={0}>
        {children}
      </div>
      <div className={carouselControlsClass}>
        <button type="button" className={buttonClass({ variant: "outline", size: "icon" })} data-ayy-prev="" aria-label={previousLabel}>
          <Icon icon={ArrowLeft02Icon} directional />
        </button>
        <button type="button" className={buttonClass({ variant: "outline", size: "icon" })} data-ayy-next="" aria-label={nextLabel}>
          <Icon icon={ArrowRight02Icon} directional />
        </button>
      </div>
    </div>
  );
});

export const CarouselSlide = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(function CarouselSlide(
  { className, ...props },
  ref,
) {
  return <div ref={ref} className={cx(carouselSlideClass, className)} role="group" aria-roledescription="slide" {...props} />;
});
