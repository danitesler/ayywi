import type { CSSProperties } from "react";
import {
  Timeline,
  TimelineBody,
  TimelineContent,
  TimelineItem,
  TimelineMarker,
  TimelineTime,
  TimelineTitle,
} from "@danitesler/ayywi/react";

export default function Example() {
  return (
    <div style={{ inlineSize: "min(100%, 32rem)" } as CSSProperties}>
      <Timeline aria-label="Deployment history">
        <TimelineItem marker={<TimelineMarker pulse />}>
          <TimelineContent>
            <TimelineTime>Just now</TimelineTime>
            <TimelineTitle>Production deployment</TimelineTitle>
            <TimelineBody>Deploying v2.4.0 to edge regions (3 of 8 completed).</TimelineBody>
          </TimelineContent>
        </TimelineItem>
        <TimelineItem marker={<TimelineMarker />}>
          <TimelineContent>
            <TimelineTime>12 minutes ago</TimelineTime>
            <TimelineTitle>Automated test suite passed</TimelineTitle>
            <TimelineBody>428 unit tests and 34 integration tests passed.</TimelineBody>
          </TimelineContent>
        </TimelineItem>
        <TimelineItem marker={<TimelineMarker />}>
          <TimelineContent>
            <TimelineTime>25 minutes ago</TimelineTime>
            <TimelineTitle>Build artifact created</TimelineTitle>
            <TimelineBody>Bundle size 142 kB gzip, verified with zero dependencies.</TimelineBody>
          </TimelineContent>
        </TimelineItem>
      </Timeline>
    </div>
  );
}
