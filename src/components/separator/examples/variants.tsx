import type { CSSProperties } from "react";
import { Separator } from "@danitesler/ayywi/react";

export default function Example() {
  return (
    <div className="ayy-stack" style={{ inlineSize: "100%", "--ayy-gap": "var(--ayy-space-6)" } as CSSProperties}>
      <Separator />
      <Separator fade />
      <div className="ayy-cluster" style={{ "--ayy-gap": "var(--ayy-space-4)" } as CSSProperties}>
        <span>Web</span>
        <Separator orientation="vertical" />
        <span>Mobile web</span>
        <Separator orientation="vertical" />
        <span>Email</span>
      </div>
    </div>
  );
}
