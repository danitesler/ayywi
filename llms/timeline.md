# Timeline

Category: Data display. A list of events in time order, like a history, a changelog or a project's milestones, joined by a vertical line with status markers and timestamps. Also called: timeline, event-log, activity-feed, history-feed, audit-trail.

**Classes**
- `.ayy-timeline` — Root <ol> or <ul> list container for ordered events or history.
- `.ayy-timeline--alternate` — Alternates timeline items between start and end sides across a centered vertical track.
- `.ayy-timeline__item` — Single event entry row containing the track and content.
- `.ayy-timeline__track` — Vertical connecting rail line between items with the marker positioned along it.
- `.ayy-timeline__marker` — Circle dot, icon or avatar placed on the track representing the event anchor point.
- `.ayy-timeline__marker--pulse` — Pulsing active status ring indicating a current, in-progress or live event.
- `.ayy-timeline__content` — Container holding the event details (time, title, body).
- `.ayy-timeline__time` — Muted timestamp or date with tabular numbers.
- `.ayy-timeline__title` — Heading or summary of the event.
- `.ayy-timeline__body` — Supporting text, description, or status badge for the event.

**States**
- `default` — Vertical connecting line in line color with markers at event nodes, muted xs tabular timestamps, semibold sm titles, and soft sm body text.
- `hover` — doesn't apply: Timeline items are non-interactive by default; links or buttons inside content handle their own hover states.
- `pressed` — doesn't apply: No pressed state on timeline items.
- `focus` — doesn't apply: Timeline items do not receive focus; place interactive elements like links or buttons inside content.
- `disabled` — doesn't apply: Timeline events are informational history and cannot be disabled.
- `selected` — doesn't apply: Use pulse on the current or live event marker instead of a selection state.
- `error` — doesn't apply: No error state on the timeline itself; use an Alert or status Badge inside the event body.
- `loading` — doesn't apply: No loading state on the timeline; use a Skeleton or Spinner while events are loading.
- `pulse` (`ayy-timeline__marker--pulse`) — A status ring expands outward from the marker and fades, looping continuously to indicate a live or in-progress event.

**Sizes**
- Density — Markers and spacing are fixed; timestamp text follows data-density via --ayy-text-s; controls or badges inside event content follow data-density.
- Width — Fills its container. In alternate mode, centers the track with 1fr columns on either side above 36rem, collapsing to a single start-aligned column below 36rem.

**React** — `import { Timeline, TimelineItem, TimelineMarker, TimelineContent, TimelineTime, TimelineTitle, TimelineBody } from "@danitesler/ayywi/react";`
- `<Timeline>` renders <ol class="ayy-timeline">. Props: `alternate` boolean — alternate items between start and end sides across a centered vertical track.
- `<TimelineItem>` renders <li class="ayy-timeline__item">. Props: `marker` ReactNode — the marker dot, icon or avatar placed on the track.
- `<TimelineMarker>` renders <span class="ayy-timeline__marker">. Props: `pulse` boolean — pulsing active status ring for in-progress or live events.
- `<TimelineContent>` renders <div class="ayy-timeline__content">.
- `<TimelineTime>` renders <time class="ayy-timeline__time">.
- `<TimelineTitle>` renders <div class="ayy-timeline__title">.
- `<TimelineBody>` renders <div class="ayy-timeline__body">.

**Accessibility**
- Rendered as an ordered list (<ol>) by default so screen readers announce the item count and sequence.
- Timestamps use the semantic <time> element with tabular numbers for consistent alignment and screen reader comprehension.
- Decorative markers and track lines are marked aria-hidden="true" to prevent screen reader noise; important status information should be in the title or body.
- Active pulse rings are visual enhancements; screen readers receive the active status via text in the title, body, or an accessible badge.
- Supports Windows High Contrast mode via @media (forced-colors: active) with system CanvasText, Canvas, and Highlight colors.

**Do**
- Use a timeline to show a chronological log or sequence of events: deploy history, shipment tracking, audit trails, activity feeds.
- Use TimelineMarker pulse on the latest or currently active event in a running process.
- Use Timeline alternate for milestones, company history, or changelogs on wide marketing or overview pages.
- Include TimelineTime with a semantic timestamp so users can anchor events in time.
- Keep markers consistent within a timeline: all dots, or all icons, or all avatars.

**Don't**
- Don't use a timeline for a multi-step user task with future steps — use Steps.
- Don't use it for navigation or hierarchical page links — use Breadcrumb.
- Don't wrap entire items in clickable links — place interactive links or buttons inside TimelineTitle or TimelineBody.
- Don't hardcode colors on markers or lines; use semantic tokens or status badges.

## Timeline — Deployment history

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<div style="inline-size: min(100%, 32rem)">
  <ol class="ayy-timeline" aria-label="Deployment history">
    <li class="ayy-timeline__item">
      <div class="ayy-timeline__track">
        <span class="ayy-timeline__marker ayy-timeline__marker--pulse" aria-hidden="true"></span>
      </div>
      <div class="ayy-timeline__content">
        <time class="ayy-timeline__time">Just now</time>
        <div class="ayy-timeline__title">Production deployment</div>
        <div class="ayy-timeline__body">Deploying v2.4.0 to edge regions (3 of 8 completed).</div>
      </div>
    </li>
    <li class="ayy-timeline__item">
      <div class="ayy-timeline__track">
        <span class="ayy-timeline__marker" aria-hidden="true"></span>
      </div>
      <div class="ayy-timeline__content">
        <time class="ayy-timeline__time">12 minutes ago</time>
        <div class="ayy-timeline__title">Automated test suite passed</div>
        <div class="ayy-timeline__body">428 unit tests and 34 integration tests passed.</div>
      </div>
    </li>
    <li class="ayy-timeline__item">
      <div class="ayy-timeline__track">
        <span class="ayy-timeline__marker" aria-hidden="true"></span>
      </div>
      <div class="ayy-timeline__content">
        <time class="ayy-timeline__time">25 minutes ago</time>
        <div class="ayy-timeline__title">Build artifact created</div>
        <div class="ayy-timeline__body">Bundle size 142 kB gzip, verified with zero dependencies.</div>
      </div>
    </li>
  </ol>
</div>
```

React:

```tsx
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
```

## Timeline — Alternating product milestones

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<div style="inline-size: 100%; max-inline-size: 42rem">
  <ol class="ayy-timeline ayy-timeline--alternate" aria-label="Product milestones">
    <li class="ayy-timeline__item">
      <div class="ayy-timeline__track">
        <span class="ayy-timeline__marker ayy-timeline__marker--pulse" aria-hidden="true"></span>
      </div>
      <div class="ayy-timeline__content">
        <time class="ayy-timeline__time">Q4 2026</time>
        <div class="ayy-timeline__title">Global edge federation</div>
        <div class="ayy-timeline__body">Multi-region active-active replication across 24 points of presence.</div>
      </div>
    </li>
    <li class="ayy-timeline__item">
      <div class="ayy-timeline__track">
        <span class="ayy-timeline__marker" aria-hidden="true"></span>
      </div>
      <div class="ayy-timeline__content">
        <time class="ayy-timeline__time">Q2 2026</time>
        <div class="ayy-timeline__title">Design token engine</div>
        <div class="ayy-timeline__body">Automated contrast verification and multi-brand theme compilation.</div>
      </div>
    </li>
    <li class="ayy-timeline__item">
      <div class="ayy-timeline__track">
        <span class="ayy-timeline__marker" aria-hidden="true"></span>
      </div>
      <div class="ayy-timeline__content">
        <time class="ayy-timeline__time">Q4 2025</time>
        <div class="ayy-timeline__title">Initial public beta</div>
        <div class="ayy-timeline__body">Core CSS class contract and zero-dependency custom elements.</div>
      </div>
    </li>
  </ol>
</div>
```

React:

```tsx
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
```

---
Part of @danitesler/ayywi 0.1.2: load `dist/ayywi.min.css` (and `dist/elements.global.js` for the <ayy-*> elements). The rules every screen follows: [llms-full.txt#rules](../llms-full.txt#rules). Every component: [llms.txt](../llms.txt).
