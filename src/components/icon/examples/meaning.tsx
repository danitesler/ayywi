import type { CSSProperties } from "react";
import { CancelCircleIcon, CheckmarkCircle02Icon, GitBranchIcon } from "@hugeicons/core-free-icons";
import { Icon, List, ListItem } from "@danitesler/ayywi/react";

// Decorative icons are aria-hidden. An icon that carries the meaning on its own gets a label.
export default function Example() {
  return (
    <List compact aria-label="Deploys">
      <ListItem>
        <Icon icon={CheckmarkCircle02Icon} name="circle-check" label="Ready" style={{ color: "var(--ayy-color-success)" }} />
        <span>Marketing site</span>
        <span className="ayy-cluster ayy-muted" style={{ "--ayy-gap": "var(--ayy-space-1)" } as CSSProperties}>
          <Icon icon={GitBranchIcon} name="git-branch" size="sm" /> main
        </span>
      </ListItem>
      <ListItem>
        <Icon icon={CancelCircleIcon} name="circle-x" label="Failed" style={{ color: "var(--ayy-color-destructive)" }} />
        <span>Docs</span>
        <span className="ayy-cluster ayy-muted" style={{ "--ayy-gap": "var(--ayy-space-1)" } as CSSProperties}>
          <Icon icon={GitBranchIcon} name="git-branch" size="sm" /> fix/search-index
        </span>
      </ListItem>
    </List>
  );
}
