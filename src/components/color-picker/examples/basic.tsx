import { useState } from "react";
import { ColorPicker } from "@danitesler/ayywi/react";

export default function Example() {
  const [color, setColor] = useState("#2563eb");

  return (
    <ColorPicker
      value={color}
      onValueChange={setColor}
      alpha
      swatches={["#ef4444", "#f97316", "#eab308", "#22c55e", "#06b6d4", "#2563eb", "#a855f7", "#ec4899"]}
    />
  );
}
