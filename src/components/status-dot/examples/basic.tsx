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
