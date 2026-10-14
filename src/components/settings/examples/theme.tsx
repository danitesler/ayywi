import { ChoiceCard, ChoiceGroup, Settings, SettingsRow } from "@danitesler/ayywi/react";

export default function Example() {
  return (
    <div style={{ inlineSize: "100%", maxInlineSize: "36rem" }}>
      <Settings title="Appearance">
        <SettingsRow label="Theme" hint="Follows your system unless you pick one." stack>
          <ChoiceGroup aria-label="Theme" defaultValue="system" name="theme" style={{ "--ayy-min": "8rem" } as React.CSSProperties}>
            <ChoiceCard value="system" title="System" description="Match the device" />
            <ChoiceCard value="light" title="Light" description="Bright surfaces" />
            <ChoiceCard value="dark" title="Dark" description="Dim surfaces" />
          </ChoiceGroup>
        </SettingsRow>
      </Settings>
    </div>
  );
}
