import type { CSSProperties } from "react";
import { CancelCircleIcon, CheckmarkCircle02Icon, GitBranchIcon } from "@hugeicons/core-free-icons";
import { Icon } from "ayywi/react";

// Decorative icons are aria-hidden. An icon that carries the meaning on its own gets a label.
export default function Example() {
  return (
    <ul className="ayy-stack" style={{ margin: 0, padding: 0, listStyle: "none" }}>
      <li className="ayy-cluster" style={{ "--ayy-gap": "0.75rem" } as CSSProperties}>
        <Icon icon={CheckmarkCircle02Icon} label="Ready" style={{ color: "var(--ayy-color-success)" }} />
        <span>Marketing site</span>
        <span className="ayy-cluster ayy-muted" style={{ "--ayy-gap": "0.25rem" } as CSSProperties}>
          <Icon icon={GitBranchIcon} size="sm" /> main
        </span>
      </li>
      <li className="ayy-cluster" style={{ "--ayy-gap": "0.75rem" } as CSSProperties}>
        <Icon icon={CancelCircleIcon} label="Failed" style={{ color: "var(--ayy-color-destructive)" }} />
        <span>Docs</span>
        <span className="ayy-cluster ayy-muted" style={{ "--ayy-gap": "0.25rem" } as CSSProperties}>
          <Icon icon={GitBranchIcon} size="sm" /> fix/search-index
        </span>
      </li>
    </ul>
  );
}
