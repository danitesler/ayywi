import type { CSSProperties } from "react";
import { Stat } from "ayywi/react";

export default function Example() {
  return (
    <div className="ayy-grid" style={{ "--ayy-min": "10rem", inlineSize: "100%" } as CSSProperties}>
      <Stat labelFirst label="On Dribbble since 2017" value="373k" unit="Views" />
      <Stat labelFirst label="Figma Community resources" value="200k" unit="Downloads" />
      <Stat labelFirst size="sm" label="Playnite extensions" value="4.2k" unit="Downloads" />
    </div>
  );
}
