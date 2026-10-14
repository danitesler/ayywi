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
    <div style={{ inlineSize: "100%", maxInlineSize: "42rem" } as CSSProperties}>
      <Timeline alternate aria-label="Product milestones">
        <TimelineItem marker={<TimelineMarker pulse />}>
          <TimelineContent>
            <TimelineTime>Q4 2026</TimelineTime>
            <TimelineTitle>Global edge federation</TimelineTitle>
            <TimelineBody>Multi-region active-active replication across 24 points of presence.</TimelineBody>
          </TimelineContent>
        </TimelineItem>
        <TimelineItem marker={<TimelineMarker />}>
          <TimelineContent>
            <TimelineTime>Q2 2026</TimelineTime>
            <TimelineTitle>Design token engine</TimelineTitle>
            <TimelineBody>Automated contrast verification and multi-brand theme compilation.</TimelineBody>
          </TimelineContent>
        </TimelineItem>
        <TimelineItem marker={<TimelineMarker />}>
          <TimelineContent>
            <TimelineTime>Q4 2025</TimelineTime>
            <TimelineTitle>Initial public beta</TimelineTitle>
            <TimelineBody>Core CSS class contract and zero-dependency custom elements.</TimelineBody>
          </TimelineContent>
        </TimelineItem>
      </Timeline>
    </div>
  );
}
