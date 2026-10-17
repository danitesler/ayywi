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
