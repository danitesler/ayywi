import { Tick02Icon } from "@hugeicons/core-free-icons";
import { Icon, ProgressRing } from "@danitesler/ayywi/react";

export default function Example() {
  return (
    <div className="ayy-cluster" style={{ alignItems: "center", gap: "2rem" }}>
      <ProgressRing value={28} size="xl" aria-label="Focus session, 18 minutes left">
        18:00
      </ProgressRing>
      <div className="ayy-stack" style={{ alignItems: "start" }}>
        <ProgressRing value={60} size="lg" aria-label="Habit: 3 of 5 days this week">
          3/5
        </ProgressRing>
        <ProgressRing value={100} size="lg" variant="success" aria-label="Goal reached">
          <Icon icon={Tick02Icon} />
        </ProgressRing>
        <div className="ayy-cluster" style={{ alignItems: "center" }}>
          <ProgressRing value={40} size="sm" aria-labelledby="ring-upload" />
          <span id="ring-upload">Uploading 2 of 5</span>
        </div>
        <div className="ayy-cluster" style={{ alignItems: "center" }}>
          <ProgressRing size="sm" variant="ai" aria-labelledby="ring-ai" />
          <span id="ring-ai">Recognising text</span>
        </div>
      </div>
    </div>
  );
}
