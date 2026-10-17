import { forwardRef, type HTMLAttributes } from "react";
import { cx } from "../../lib/cx";
import {
  showcaseActionsClass,
  showcaseBodyClass,
  showcaseClass,
  type ShowcaseDevice,
  showcaseHeaderClass,
  showcaseStageClass,
  showcaseTitleClass,
  showcaseViewportClass,
} from "./showcase";

export interface ShowcaseProps extends HTMLAttributes<HTMLElement> {
  device?: ShowcaseDevice;
}

export const Showcase = forwardRef<HTMLElement, ShowcaseProps>(function Showcase(
  { device = "desktop", className, children, ...props },
  ref
) {
  return (
    <section
      ref={ref}
      className={cx(showcaseClass, className)}
      data-device={device}
      {...props}
    >
      {children}
    </section>
  );
});

export interface ShowcaseHeaderProps extends HTMLAttributes<HTMLDivElement> {}

export const ShowcaseHeader = forwardRef<HTMLDivElement, ShowcaseHeaderProps>(function ShowcaseHeader(
  { className, children, ...props },
  ref
) {
  return (
    <div ref={ref} className={cx(showcaseHeaderClass, className)} {...props}>
      {children}
    </div>
  );
});

export interface ShowcaseTitleProps extends HTMLAttributes<HTMLHeadingElement> {}

export const ShowcaseTitle = forwardRef<HTMLHeadingElement, ShowcaseTitleProps>(function ShowcaseTitle(
  { className, children, ...props },
  ref
) {
  return (
    <h3 ref={ref} className={cx(showcaseTitleClass, className)} {...props}>
      {children}
    </h3>
  );
});

export interface ShowcaseActionsProps extends HTMLAttributes<HTMLDivElement> {}

export const ShowcaseActions = forwardRef<HTMLDivElement, ShowcaseActionsProps>(function ShowcaseActions(
  { className, children, ...props },
  ref
) {
  return (
    <div ref={ref} className={cx(showcaseActionsClass, className)} {...props}>
      {children}
    </div>
  );
});

export interface ShowcaseStageProps extends HTMLAttributes<HTMLDivElement> {}

export const ShowcaseStage = forwardRef<HTMLDivElement, ShowcaseStageProps>(function ShowcaseStage(
  { className, children, ...props },
  ref
) {
  return (
    <div ref={ref} className={cx(showcaseStageClass, className)} {...props}>
      {children}
    </div>
  );
});

export interface ShowcaseViewportProps extends HTMLAttributes<HTMLDivElement> {
  device?: ShowcaseDevice;
}

export const ShowcaseViewport = forwardRef<HTMLDivElement, ShowcaseViewportProps>(function ShowcaseViewport(
  { device = "desktop", className, children, ...props },
  ref
) {
  return (
    <div
      ref={ref}
      className={showcaseViewportClass({ device, className })}
      data-device={device}
      {...props}
    >
      {children}
    </div>
  );
});

export interface ShowcaseBodyProps extends HTMLAttributes<HTMLDivElement> {}

export const ShowcaseBody = forwardRef<HTMLDivElement, ShowcaseBodyProps>(function ShowcaseBody(
  { className, children, ...props },
  ref
) {
  return (
    <div ref={ref} className={cx(showcaseBodyClass, className)} {...props}>
      {children}
    </div>
  );
});
