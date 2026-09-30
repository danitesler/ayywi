import type { CSSProperties } from "react";
import { Clock01Icon } from "@hugeicons/core-free-icons";
import { Icon } from "ayywi/react";

const SIZES = [
  ["sm", "16px"],
  ["md", "20px"],
  ["lg", "24px"],
  ["xl", "32px"],
] as const;

export default function Example() {
  return (
    <div className="ayy-stack" style={{ "--ayy-gap": "1.5rem" } as CSSProperties}>
      <div className="ayy-cluster" style={{ "--ayy-gap": "2rem", alignItems: "end" } as CSSProperties}>
        {SIZES.map(([size, px]) => (
          <span key={size} className="ayy-stack" style={{ "--ayy-gap": "0.5rem", alignItems: "center" } as CSSProperties}>
            <Icon icon={Clock01Icon} size={size} />
            <span className="ayy-muted">
              {size} · {px}
            </span>
          </span>
        ))}
      </div>
      {/* No size: the icon follows the text around it. */}
      <p className="ayy-h4">
        <Icon icon={Clock01Icon} /> Build queue
      </p>
      <p className="ayy-muted" style={{ margin: 0 }}>
        <Icon icon={Clock01Icon} /> Builds start within 2 minutes of a push.
      </p>
    </div>
  );
}
