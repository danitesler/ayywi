import { Settings, SettingsLink, SettingsRow, Switch } from "@danitesler/ayywi/react";

export default function Example() {
  return (
    <div style={{ inlineSize: "100%", maxInlineSize: "24rem" }}>
      <Settings title="Account">
        <SettingsLink href="#profile" label="Profile" hint="ada@example.com" />
        <SettingsLink href="#language" label="Language" value="English" />
        <SettingsLink href="#sync" label="Sync" value="On" />
      </Settings>
      <Settings title="Sound">
        <SettingsRow label="Shutter sound" htmlFor="set-shutter">
          <Switch id="set-shutter" defaultChecked />
        </SettingsRow>
      </Settings>
      <Settings>
        <SettingsLink label="Sign out" destructive />
      </Settings>
    </div>
  );
}
