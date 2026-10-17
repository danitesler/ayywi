import { useState } from "react";
import { ColorPicker } from "@danitesler/ayywi/react";

export default function Example() {
  const [color, setColor] = useState("#10b981");

  return (
    <ColorPicker
      value={color}
      onValueChange={setColor}
      addon="HEX"
      addonPosition="end"
      copyable
    />
  );
}
