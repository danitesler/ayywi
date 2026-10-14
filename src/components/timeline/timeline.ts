import { cx } from "../../lib/cx";

export interface TimelineClassOptions {
  /** Alternate items between start and end sides across a centered vertical track. */
  alternate?: boolean;
  className?: string;
}

export function timelineClass({ alternate, className }: TimelineClassOptions = {}): string {
  return cx("ayy-timeline", alternate && "ayy-timeline--alternate", className);
}

export interface TimelineMarkerClassOptions {
  /** Pulsing active status ring for in-progress or live events. */
  pulse?: boolean;
  className?: string;
}

export function timelineMarkerClass({ pulse, className }: TimelineMarkerClassOptions = {}): string {
  return cx("ayy-timeline__marker", pulse && "ayy-timeline__marker--pulse", className);
}

export const timelineItemClass = "ayy-timeline__item";
export const timelineTrackClass = "ayy-timeline__track";
export const timelineContentClass = "ayy-timeline__content";
export const timelineTimeClass = "ayy-timeline__time";
export const timelineTitleClass = "ayy-timeline__title";
export const timelineBodyClass = "ayy-timeline__body";
