import { Select, Settings, SettingsRow, Switch } from "@danitesler/ayywi/react";

export default function Example() {
  return (
    <div style={{ inlineSize: "100%", maxInlineSize: "36rem" }}>
      <Settings title="General">
        <SettingsRow label="Open at login" htmlFor="set-login" hint="Start in the menu bar when you sign in.">
          <Switch id="set-login" aria-describedby="set-login-hint" defaultChecked />
        </SettingsRow>
        <SettingsRow label="Startup page" htmlFor="set-startup">
          <Select id="set-startup" defaultValue="inbox">
            <option value="inbox">Inbox</option>
            <option value="today">Today</option>
            <option value="last">Last opened page</option>
          </Select>
        </SettingsRow>
        <SettingsRow label="Week starts on" htmlFor="set-week">
          <Select id="set-week" defaultValue="1">
            <option value="0">Sunday</option>
            <option value="1">Monday</option>
            <option value="6">Saturday</option>
          </Select>
        </SettingsRow>
      </Settings>
      <Settings title="Notifications" description="Reminders show even when the window is closed.">
        <SettingsRow label="Reminders" htmlFor="set-remind" hint="A notification when a task is due.">
          <Switch id="set-remind" aria-describedby="set-remind-hint" defaultChecked />
        </SettingsRow>
        <SettingsRow label="Daily summary" htmlFor="set-summary" hint="What's due today, every morning at 9:00.">
          <Switch id="set-summary" aria-describedby="set-summary-hint" />
        </SettingsRow>
      </Settings>
    </div>
  );
}
