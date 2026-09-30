import { DashboardSquare01Icon, Folder01Icon, Invoice01Icon, Settings02Icon, UserGroupIcon } from "@hugeicons/core-free-icons";
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
  AppShellToggle,
  Icon,
} from "ayywi/react";

export default function Example() {
  // Narrow the window below 48rem: the bar appears and the menu button opens the sidebar as a drawer.
  // The shell is 100dvh high; this box only stands in for the browser window.
  return (
    <div style={{ inlineSize: "100%", blockSize: "28rem", overflow: "hidden", border: "1px solid var(--ayy-color-line)", borderRadius: "var(--ayy-radius-xl)" }}>
      <AppShell style={{ blockSize: "100%" }}>
        <AppShellBar>
          <AppShellToggle />
          <AppShellBrand href="#home">Northwind</AppShellBrand>
        </AppShellBar>
        <AppShellSidebar>
          <AppShellBrand href="#home">Northwind</AppShellBrand>
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
      </AppShell>
    </div>
  );
}
