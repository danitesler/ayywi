import { forwardRef, useEffect, useRef, type CSSProperties, type HTMLAttributes } from "react";
import { cx } from "../../lib/cx";
import { mergeRefs } from "../../lib/refs";
import { buttonClass } from "../button/button";
import { carouselClass, carouselControlsClass, carouselSlideClass, carouselTrackClass, connectCarousel } from "./carousel";

export interface CarouselProps extends HTMLAttributes<HTMLDivElement> {
  /** Accessible name of the carousel, e.g. "Team photos". */
  label: string;
  /** Width of each slide (any CSS length). Default min(22rem, 85%). */
  slideWidth?: string;
  /** Accessible names of the buttons. */
  previousLabel?: string;
  nextLabel?: string;
}

const Arrow = ({ back }: { back?: boolean }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={back ? "M19 12H5M11 6l-6 6 6 6" : "M5 12h14M13 6l6 6-6 6"} />
  </svg>
);

export const Carousel = forwardRef<HTMLDivElement, CarouselProps>(function Carousel(
  { label, slideWidth, previousLabel = "Previous", nextLabel = "Next", className, style, children, ...props },
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
      style={slideWidth ? ({ "--ayy-slide": slideWidth, ...style } as CSSProperties) : style}
      {...props}
    >
      <div className={carouselTrackClass} tabIndex={0}>
        {children}
      </div>
      <div className={carouselControlsClass}>
        <button type="button" className={buttonClass({ variant: "outline", size: "icon" })} data-ayy-prev="" aria-label={previousLabel}>
          <Arrow back />
        </button>
        <button type="button" className={buttonClass({ variant: "outline", size: "icon" })} data-ayy-next="" aria-label={nextLabel}>
          <Arrow />
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
