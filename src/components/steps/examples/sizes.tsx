import type { CSSProperties } from "react";
import { Steps } from "@danitesler/ayywi/react";

const STEPS = ["Cart", "Shipping", "Payment", "Review"];

export default function Example() {
  return (
    <div className="ayy-stack" style={{ inlineSize: "min(100%, 36rem)", "--ayy-gap": "var(--ayy-space-6)" } as CSSProperties}>
      <Steps size="sm" steps={STEPS} current={2} aria-label="Small checkout progress" />
      <Steps steps={STEPS} current={2} aria-label="Medium checkout progress" />
      <Steps size="lg" steps={STEPS} current={2} aria-label="Large checkout progress" />
    </div>
  );
}
