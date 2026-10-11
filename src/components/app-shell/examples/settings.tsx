import { Database01Icon, KeyboardIcon, Notification03Icon, PaintBoardIcon, Settings01Icon, UserCircleIcon, UserGroupIcon } from "@hugeicons/core-free-icons";
import {
  AppShell,
  AppShellGroup,
  AppShellItem,
  AppShellLink,
  AppShellMain,
  AppShellNav,
  AppShellSidebar,
  AppShellTitle,
  Dialog,
  DialogContent,
  DialogTrigger,
  Icon,
  Select,
  Settings,
  SettingsRow,
  Switch,
  TopBar,
} from "@danitesler/ayywi/react";

export default function Example() {
  // Settings open over the app in a near-full-screen dialog holding a settings shell: the sections in the sidebar, one
  // section in the main. Below 48rem the dialog fills the screen, and the section list and the open section are two screens.
  return (
    <Dialog>
      <DialogTrigger variant="outline">
        <Icon icon={Settings01Icon} />
        Settings
      </DialogTrigger>
      <DialogContent size="full" aria-labelledby="settings-title">
        <AppShell settings>
          <AppShellSidebar>
            <AppShellTitle id="settings-title">Settings</AppShellTitle>
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
          <AppShellMain as="div">
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
      </DialogContent>
    </Dialog>
  );
}
