import { forwardRef, type HTMLAttributes, type LiHTMLAttributes, type OlHTMLAttributes, type ReactNode, type TimeHTMLAttributes } from "react";
import { cx } from "../../lib/cx";
import {
  timelineBodyClass,
  timelineClass,
  timelineContentClass,
  timelineItemClass,
  timelineMarkerClass,
  timelineTimeClass,
  timelineTitleClass,
  timelineTrackClass,
} from "./timeline";

export interface TimelineProps extends OlHTMLAttributes<HTMLOListElement> {
  /** Alternate items between start and end sides across a centered vertical track. */
  alternate?: boolean;
}

/** Chronological log or history of events. An ordered list (<ol>) by default. */
export const Timeline = forwardRef<HTMLOListElement, TimelineProps>(function Timeline(
  { alternate, className, ...props },
  ref,
) {
  return <ol ref={ref} className={timelineClass({ alternate, className })} {...props} />;
});

export interface TimelineItemProps extends LiHTMLAttributes<HTMLLIElement> {
  /** The marker dot, icon or avatar placed on the track. */
  marker?: ReactNode;
}

/** Single event entry row containing the track, marker and content. */
export const TimelineItem = forwardRef<HTMLLIElement, TimelineItemProps>(function TimelineItem(
  { marker, className, children, ...props },
  ref,
) {
  return (
    <li ref={ref} className={cx(timelineItemClass, className)} {...props}>
      {marker !== undefined ? <div className={timelineTrackClass}>{marker}</div> : null}
      {children}
    </li>
  );
});

export interface TimelineMarkerProps extends HTMLAttributes<HTMLSpanElement> {
  /** Pulsing active status ring for in-progress or live events. */
  pulse?: boolean;
}

/** Circle dot, icon or avatar placed on the track at an event node. */
export const TimelineMarker = forwardRef<HTMLSpanElement, TimelineMarkerProps>(function TimelineMarker(
  { pulse, className, ...props },
  ref,
) {
  return <span ref={ref} className={timelineMarkerClass({ pulse, className })} aria-hidden="true" {...props} />;
});

/** Container holding the event details (time, title, body). */
export const TimelineContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(function TimelineContent(
  { className, ...props },
  ref,
) {
  return <div ref={ref} className={cx(timelineContentClass, className)} {...props} />;
});

export interface TimelineTimeProps extends TimeHTMLAttributes<HTMLTimeElement> {}

/** Muted timestamp or date with tabular numbers. */
export const TimelineTime = forwardRef<HTMLTimeElement, TimelineTimeProps>(function TimelineTime(
  { className, ...props },
  ref,
) {
  return <time ref={ref} className={cx(timelineTimeClass, className)} {...props} />;
});

export interface TimelineTitleProps extends HTMLAttributes<HTMLDivElement> {}

/** Heading or summary of the event. */
export const TimelineTitle = forwardRef<HTMLDivElement, TimelineTitleProps>(function TimelineTitle(
  { className, ...props },
  ref,
) {
  return <div ref={ref} className={cx(timelineTitleClass, className)} {...props} />;
});

export interface TimelineBodyProps extends HTMLAttributes<HTMLDivElement> {}

/** Supporting text, description or status badge for the event. */
export const TimelineBody = forwardRef<HTMLDivElement, TimelineBodyProps>(function TimelineBody(
  { className, ...props },
  ref,
) {
  return <div ref={ref} className={cx(timelineBodyClass, className)} {...props} />;
});
