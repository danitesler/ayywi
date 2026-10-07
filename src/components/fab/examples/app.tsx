import { Add01Icon, Calendar03Icon, InboxIcon, Search01Icon, Settings02Icon } from "@hugeicons/core-free-icons";
import {
  AppShell,
  AppShellBrand,
  AppShellLink,
  AppShellMain,
  AppShellNav,
  AppShellSidebar,
  BottomNav,
  BottomNavLink,
  Fab,
  Icon,
} from "@danitesler/ayywi/react";

export default function Example() {
  // A direct child of the shell, after the main area: its corner on wide screens, above the bottom nav on phones.
  return (
    <div style={{ inlineSize: "100%", blockSize: "22rem", overflow: "hidden", border: "1px solid var(--ayy-color-line)", borderRadius: "var(--ayy-radius-xl)" }}>
      <AppShell style={{ blockSize: "100%" }}>
        <AppShellSidebar>
          <AppShellBrand href="#inbox">Tasks</AppShellBrand>
          <AppShellNav>
            <AppShellLink href="#inbox" current>
              <Icon icon={InboxIcon} />
              Inbox
            </AppShellLink>
            <AppShellLink href="#today">
              <Icon icon={Calendar03Icon} />
              Today
            </AppShellLink>
          </AppShellNav>
        </AppShellSidebar>
        <AppShellMain>
          <h2 className="ayy-h3">Inbox</h2>
          <p className="ayy-muted">Everything that isn't in a list yet.</p>
        </AppShellMain>
        <Fab aria-label="New task">
          <Icon icon={Add01Icon} />
        </Fab>
        <BottomNav>
          <BottomNavLink href="#inbox" icon={<Icon icon={InboxIcon} />} current>
            Inbox
          </BottomNavLink>
          <BottomNavLink href="#today" icon={<Icon icon={Calendar03Icon} />}>
            Today
          </BottomNavLink>
          <BottomNavLink href="#search" icon={<Icon icon={Search01Icon} />}>
            Search
          </BottomNavLink>
          <BottomNavLink href="#settings" icon={<Icon icon={Settings02Icon} />}>
            Settings
          </BottomNavLink>
        </BottomNav>
      </AppShell>
    </div>
  );
}
