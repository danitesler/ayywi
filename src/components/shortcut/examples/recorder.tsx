import { useState } from "react";
import { Settings, SettingsRow, ShortcutRecorder } from "@danitesler/ayywi/react";

const ACTIONS = [
  { id: "area", label: "Capture area" },
  { id: "window", label: "Capture window" },
  { id: "screen", label: "Capture screen" },
  { id: "record", label: "Record screen" },
];

export default function Example() {
  const [keys, setKeys] = useState<Record<string, string | null>>({ area: "Mod+Shift+2", window: "Mod+Shift+3", screen: "Mod+Shift+3", record: null });
  const clash = (id: string) => keys[id] !== null && ACTIONS.some((a) => a.id !== id && keys[a.id] === keys[id]);
  return (
    <div style={{ inlineSize: "100%", maxInlineSize: "32rem" }}>
      <Settings title="Shortcuts" description="Work in every app. Press Backspace while recording to clear one.">
        {ACTIONS.map((a) => (
          <SettingsRow
            key={a.id}
            label={a.label}
            htmlFor={`sc-${a.id}`}
            error={clash(a.id) ? "Another action uses these keys." : undefined}
          >
            <ShortcutRecorder
              id={`sc-${a.id}`}
              label={a.label}
              value={keys[a.id]}
              onValueChange={(value) => setKeys((k) => ({ ...k, [a.id]: value }))}
              aria-invalid={clash(a.id) || undefined}
              aria-describedby={clash(a.id) ? `sc-${a.id}-hint` : undefined}
            />
          </SettingsRow>
        ))}
      </Settings>
    </div>
  );
}
