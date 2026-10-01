import type { CSSProperties } from "react";
import { Steps } from "ayywi/react";

const STEPS = ["Cart", "Shipping", "Payment", "Review"];

export default function Example() {
  return (
    <div className="ayy-stack" style={{ inlineSize: "min(100%, 36rem)", "--ayy-gap": "var(--ayy-space-8)" } as CSSProperties}>
      <Steps steps={STEPS} current={2} aria-label="Checkout progress" />
      <Steps steps={["Create your account", "Invite your team", "Connect your data"]} current={1} vertical aria-label="Setup progress" />
    </div>
  );
}
