import { Database01Icon, KeyboardIcon, Notification03Icon, PaintBoardIcon, UserCircleIcon, UserGroupIcon } from "@hugeicons/core-free-icons";
import {
  AppShell,
  AppShellBack,
  AppShellGroup,
  AppShellItem,
  AppShellLink,
  AppShellMain,
  AppShellNav,
  AppShellSidebar,
  AppShellTitle,
  Icon,
  Select,
  Settings,
  SettingsRow,
  Switch,
  TopBar,
} from "@danitesler/ayywi/react";

export default function Example() {
  // Settings replace the app's own frame: same shell, the sidebar swapped for a way back and the sections. Below 48rem the
  // section list and the open section are two screens. The box stands in for the browser window; drop it in your app.
  return (
    <div style={{ inlineSize: "100%", blockSize: "34rem", overflow: "hidden", border: "1px solid var(--ayy-color-line)", borderRadius: "var(--ayy-radius-xl)" }}>
      <AppShell settings style={{ blockSize: "100%" }}>
        <AppShellSidebar>
          <AppShellBack href="#inbox">Back to Northwind</AppShellBack>
          <AppShellTitle>Settings</AppShellTitle>
          <AppShellNav aria-label="Settings">
            <AppShellGroup label="Account">
              <AppShellItem>
                <AppShellLink href="#profile">
                  <Icon icon={UserCircleIcon} />
                  Profile
                </AppShellLink>
              </AppShellItem>
              <AppShellItem>
                <AppShellLink href="#preferences" current>
                  <Icon icon={PaintBoardIcon} />
                  Preferences
                </AppShellLink>
              </AppShellItem>
              <AppShellItem>
                <AppShellLink href="#notifications">
                  <Icon icon={Notification03Icon} />
                  Notifications
                </AppShellLink>
              </AppShellItem>
            </AppShellGroup>
            <AppShellGroup label="Workspace">
              <AppShellItem>
                <AppShellLink href="#members">
                  <Icon icon={UserGroupIcon} />
                  Members
                </AppShellLink>
              </AppShellItem>
              <AppShellItem>
                <AppShellLink href="#shortcuts">
                  <Icon icon={KeyboardIcon} />
                  Shortcuts
                </AppShellLink>
              </AppShellItem>
              <AppShellItem>
                <AppShellLink href="#data">
                  <Icon icon={Database01Icon} />
                  Data and sync
                </AppShellLink>
              </AppShellItem>
            </AppShellGroup>
          </AppShellNav>
        </AppShellSidebar>
        <AppShellMain>
          <TopBar backHref="#settings" backLabel="Settings" title="Preferences" />
          <Settings title="Appearance">
            <SettingsRow label="Theme" htmlFor="pref-theme">
              <Select id="pref-theme" defaultValue="system">
                <option value="system">Match the system</option>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </Select>
            </SettingsRow>
            <SettingsRow label="Larger controls" htmlFor="pref-touch" hint="Taller rows and buttons, easier to tap.">
              <Switch id="pref-touch" aria-describedby="pref-touch-hint" />
            </SettingsRow>
          </Settings>
          <Settings title="General">
            <SettingsRow label="Open at login" htmlFor="pref-login" hint="Start in the menu bar when you sign in.">
              <Switch id="pref-login" aria-describedby="pref-login-hint" defaultChecked />
            </SettingsRow>
            <SettingsRow label="Week starts on" htmlFor="pref-week">
              <Select id="pref-week" defaultValue="1">
                <option value="0">Sunday</option>
                <option value="1">Monday</option>
                <option value="6">Saturday</option>
              </Select>
            </SettingsRow>
          </Settings>
        </AppShellMain>
      </AppShell>
    </div>
  );
}
