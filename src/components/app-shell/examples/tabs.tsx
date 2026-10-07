import { DashboardSquare01Icon, Folder01Icon, Invoice01Icon, MoreHorizontalIcon, Search01Icon, Settings02Icon, UserGroupIcon } from "@hugeicons/core-free-icons";
import {
  AppShell,
  AppShellBar,
  AppShellBrand,
  AppShellFooter,
  AppShellGroup,
  AppShellItem,
  AppShellLink,
  AppShellMain,
  AppShellNav,
  AppShellSidebar,
  BottomNav,
  BottomNavButton,
  BottomNavLink,
  Button,
  Icon,
} from "@danitesler/ayywi/react";

export default function Example() {
  // Wide screens get the sidebar. Below 48rem it hides: the bar keeps the brand and search, the bottom nav holds the
  // top destinations, and "More" opens the whole sidebar as a drawer. The box only stands in for the browser window.
  return (
    <div style={{ inlineSize: "100%", blockSize: "28rem", overflow: "hidden", border: "1px solid var(--ayy-color-line)", borderRadius: "var(--ayy-radius-xl)" }}>
      <AppShell style={{ blockSize: "100%" }}>
        <AppShellBar>
          <AppShellBrand href="#dashboard">Northwind</AppShellBrand>
          <Button variant="ghost" size="icon" aria-label="Search">
            <Icon icon={Search01Icon} />
          </Button>
        </AppShellBar>
        <AppShellSidebar>
          <AppShellBrand href="#dashboard">Northwind</AppShellBrand>
          <AppShellNav>
            <AppShellGroup label="Workspace">
              <AppShellItem>
                <AppShellLink href="#dashboard" current>
                  <Icon icon={DashboardSquare01Icon} />
                  Dashboard
                </AppShellLink>
              </AppShellItem>
              <AppShellItem>
                <AppShellLink href="#projects">
                  <Icon icon={Folder01Icon} />
                  Projects
                </AppShellLink>
              </AppShellItem>
              <AppShellItem>
                <AppShellLink href="#team">
                  <Icon icon={UserGroupIcon} />
                  Team
                </AppShellLink>
              </AppShellItem>
            </AppShellGroup>
            <AppShellGroup label="Billing">
              <AppShellItem>
                <AppShellLink href="#invoices">
                  <Icon icon={Invoice01Icon} />
                  Invoices
                </AppShellLink>
              </AppShellItem>
            </AppShellGroup>
          </AppShellNav>
          <AppShellFooter>
            <AppShellLink href="#settings">
              <Icon icon={Settings02Icon} />
              Settings
            </AppShellLink>
          </AppShellFooter>
        </AppShellSidebar>
        <AppShellMain>
          <div className="ayy-stack">
            <h2 className="ayy-h3">Dashboard</h2>
            <p className="ayy-muted">What's moving across your projects this week.</p>
          </div>
        </AppShellMain>
        <BottomNav>
          <BottomNavLink href="#dashboard" icon={<Icon icon={DashboardSquare01Icon} />} current>
            Dashboard
          </BottomNavLink>
          <BottomNavLink href="#projects" icon={<Icon icon={Folder01Icon} />}>
            Projects
          </BottomNavLink>
          <BottomNavLink href="#team" icon={<Icon icon={UserGroupIcon} />}>
            Team
          </BottomNavLink>
          <BottomNavButton className="ayy-app-shell__toggle" icon={<Icon icon={MoreHorizontalIcon} />}>
            More
          </BottomNavButton>
        </BottomNav>
      </AppShell>
    </div>
  );
}
