# Status dot

Category: Data display. A small coloured dot that shows the state of something, like someone being online, a live stream or a server's health. Also called: status-dot, status-indicator, presence-dot, live-dot, health-dot.

**Classes**
- `.ayy-status-dot` — Root inline-flex dot.
- `.ayy-status-dot--sm` — Small dot (6px).
- `.ayy-status-dot--lg` — Large dot (10px).
- `.ayy-status-dot--neutral` — Muted status dot (var(--ayy-color-muted)).
- `.ayy-status-dot--success` — Green status dot (var(--ayy-color-success)).
- `.ayy-status-dot--warning` — Amber status dot (var(--ayy-color-warning)).
- `.ayy-status-dot--destructive` — Red status dot (var(--ayy-color-destructive)).
- `.ayy-status-dot--info` — Blue status dot (var(--ayy-color-info)).
- `.ayy-status-dot--pulse` — Animated pinging ring for live/active statuses (keyframes ayy-status-dot-ping).

**States**
- `default` — A circular dot with hairline ring for contrast against light and dark backgrounds. Neutral muted colour by default.
- `hover` — doesn't apply: A status dot is a static indicator, not an interactive control.
- `pressed` — doesn't apply: A status dot is a static indicator, not an interactive control.
- `focus` — doesn't apply: Not focusable.
- `disabled` — doesn't apply: A status dot is a static indicator, not an interactive control.
- `selected` — doesn't apply: A status dot is a static indicator, not an interactive control.
- `error` — doesn't apply: Static indicator; use destructive variant (ayy-status-dot--destructive) for error or failed status.
- `loading` — doesn't apply: Static indicator; use pulse (ayy-status-dot--pulse) for live or active statuses, or Spinner for pending operations.

**Sizes**
- `sm` — 6px diameter for dense table rows or nested badges.
- `md` (default) — 8px diameter standard dot for status rows and presence.
- `lg` — 10px diameter prominent dot for live indicators and headers.
- Density — Fixed dot dimensions (6px, 8px, or 10px); does not scale with data-density.
- Width — Fixed square footprint matching dot dimensions.

**React** — `import { StatusDot } from "@danitesler/ayywi/react";`
- `<StatusDot>` renders <span>. Props: `variant` "neutral" | "success" | "warning" | "destructive" | "info"; `size` "sm" | "md" | "lg"; `pulse` boolean — animated pinging ring for live/active status; `label` string — accessible label (sets role="status" and aria-label; without it, aria-hidden="true")

**Accessibility**
- Colour is never the only signal — accompany standalone status dots with a text label or pass the label prop so screen readers announce it.
- When label is provided, sets role="status" and aria-label; when omitted, aria-hidden="true" treats the dot as decorative.

**Do**
- Use a status dot to indicate online presence, server or service health, or active streaming status.
- Place the status dot beside a descriptive label or table cell value.
- Use the pulse modifier for active or real-time statuses like live streams or ongoing recordings.

**Don't**
- Don't rely on color alone to convey meaning without an accompanying label or tooltip.
- Don't make a status dot clickable directly — wrap in a button or link if interaction is required.
- Don't use a status dot for counts or numerical badges — use Badge instead.

## Status dot — Variants

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<div class="ayy-cluster" style="--ayy-gap: var(--ayy-space-4);">
  <span class="ayy-cluster" style="--ayy-gap: var(--ayy-space-2);">
    <span class="ayy-status-dot ayy-status-dot--neutral" aria-hidden="true"></span>
    <span>Offline</span>
  </span>
  <span class="ayy-cluster" style="--ayy-gap: var(--ayy-space-2);">
    <span class="ayy-status-dot ayy-status-dot--success" aria-hidden="true"></span>
    <span>Operational</span>
  </span>
  <span class="ayy-cluster" style="--ayy-gap: var(--ayy-space-2);">
    <span class="ayy-status-dot ayy-status-dot--warning" aria-hidden="true"></span>
    <span>Degraded</span>
  </span>
  <span class="ayy-cluster" style="--ayy-gap: var(--ayy-space-2);">
    <span class="ayy-status-dot ayy-status-dot--destructive" aria-hidden="true"></span>
    <span>Outage</span>
  </span>
  <span class="ayy-cluster" style="--ayy-gap: var(--ayy-space-2);">
    <span class="ayy-status-dot ayy-status-dot--info" aria-hidden="true"></span>
    <span>Maintenance</span>
  </span>
</div>
```

React:

```tsx
import { StatusDot } from "@danitesler/ayywi/react";

export default function Example() {
  return (
    <div className="ayy-cluster" style={{ "--ayy-gap": "var(--ayy-space-4)" } as React.CSSProperties}>
      <span className="ayy-cluster" style={{ "--ayy-gap": "var(--ayy-space-2)" } as React.CSSProperties}>
        <StatusDot variant="neutral" />
        <span>Offline</span>
      </span>
      <span className="ayy-cluster" style={{ "--ayy-gap": "var(--ayy-space-2)" } as React.CSSProperties}>
        <StatusDot variant="success" />
        <span>Operational</span>
      </span>
      <span className="ayy-cluster" style={{ "--ayy-gap": "var(--ayy-space-2)" } as React.CSSProperties}>
        <StatusDot variant="warning" />
        <span>Degraded</span>
      </span>
      <span className="ayy-cluster" style={{ "--ayy-gap": "var(--ayy-space-2)" } as React.CSSProperties}>
        <StatusDot variant="destructive" />
        <span>Outage</span>
      </span>
      <span className="ayy-cluster" style={{ "--ayy-gap": "var(--ayy-space-2)" } as React.CSSProperties}>
        <StatusDot variant="info" />
        <span>Maintenance</span>
      </span>
    </div>
  );
}
```

## Status dot — Live pulsing

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<div class="ayy-cluster" style="--ayy-gap: var(--ayy-space-4);">
  <span class="ayy-cluster" style="--ayy-gap: var(--ayy-space-2);">
    <span class="ayy-status-dot ayy-status-dot--destructive ayy-status-dot--pulse" aria-hidden="true"></span>
    <span>Live stream</span>
  </span>
  <span class="ayy-cluster" style="--ayy-gap: var(--ayy-space-2);">
    <span class="ayy-status-dot ayy-status-dot--warning ayy-status-dot--pulse" aria-hidden="true"></span>
    <span>Recording</span>
  </span>
  <span class="ayy-cluster" style="--ayy-gap: var(--ayy-space-2);">
    <span class="ayy-status-dot ayy-status-dot--success ayy-status-dot--pulse" aria-hidden="true"></span>
    <span>System operational</span>
  </span>
</div>
```

React:

```tsx
import { StatusDot } from "@danitesler/ayywi/react";

export default function Example() {
  return (
    <div className="ayy-cluster" style={{ "--ayy-gap": "var(--ayy-space-4)" } as React.CSSProperties}>
      <span className="ayy-cluster" style={{ "--ayy-gap": "var(--ayy-space-2)" } as React.CSSProperties}>
        <StatusDot variant="destructive" pulse />
        <span>Live stream</span>
      </span>
      <span className="ayy-cluster" style={{ "--ayy-gap": "var(--ayy-space-2)" } as React.CSSProperties}>
        <StatusDot variant="warning" pulse />
        <span>Recording</span>
      </span>
      <span className="ayy-cluster" style={{ "--ayy-gap": "var(--ayy-space-2)" } as React.CSSProperties}>
        <StatusDot variant="success" pulse />
        <span>System operational</span>
      </span>
    </div>
  );
}
```

---
Part of @danitesler/ayywi 0.1.2: load `dist/ayywi.min.css` (and `dist/elements.global.js` for the <ayy-*> elements). The rules every screen follows: [llms-full.txt#rules](../llms-full.txt#rules). Every component: [llms.txt](../llms.txt).
