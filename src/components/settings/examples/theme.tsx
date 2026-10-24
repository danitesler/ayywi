import { ChoiceCard, ChoiceGroup, Settings, SettingsRow } from "@danitesler/ayywi/react";

export default function Example() {
  return (
    <div style={{ inlineSize: "100%", maxInlineSize: "36rem" }}>
      <Settings title="Sharing">
        <SettingsRow label="Default access" hint="Who can open new links before you invite anyone." stack>
          <ChoiceGroup aria-label="Default access" defaultValue="team" name="access" min="8rem">
            <ChoiceCard value="private" title="Only you" description="Invite people by email" />
            <ChoiceCard value="team" title="Workspace" description="Anyone in your team" />
            <ChoiceCard value="public" title="Anyone with link" description="View without signing in" />
          </ChoiceGroup>
        </SettingsRow>
      </Settings>
    </div>
  );
}
