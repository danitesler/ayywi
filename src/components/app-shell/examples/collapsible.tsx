import { useState, type CSSProperties } from "react";
import { DashboardSquare01Icon, Folder01Icon, Settings02Icon, SidebarLeftIcon, UserGroupIcon } from "@hugeicons/core-free-icons";
import {
  AppShell,
  AppShellBrand,
  AppShellFooter,
  AppShellHead,
  AppShellLink,
  AppShellMain,
  AppShellNav,
  AppShellSidebar,
  AppShellToggle,
  Icon,
  Stat,
} from "@danitesler/ayywi/react";

export default function Example() {
  const [collapsed, setCollapsed] = useState(true);

  // The shell is 100dvh high. This box only stands in for the browser window; in your app, drop the wrapper and the
  // block-size on the shell.
  return (
    <div style={{ inlineSize: "100%", blockSize: "28rem", overflow: "hidden", border: "1px solid var(--ayy-color-line)", borderRadius: "var(--ayy-radius-xl)" }}>
      <AppShell collapsed={collapsed} hoverPreview onCollapseChange={setCollapsed} style={{ blockSize: "100%" }}>
        <AppShellSidebar>
          <AppShellHead>
            <AppShellToggle aria-label="Sidebar">
              <Icon icon={SidebarLeftIcon} directional />
            </AppShellToggle>
            <AppShellBrand href="#home">
              <span>Northwind</span>
            </AppShellBrand>
          </AppShellHead>
          <AppShellNav>
            <AppShellLink href="#dashboard" current title="Dashboard">
              <Icon icon={DashboardSquare01Icon} />
              <span>Dashboard</span>
            </AppShellLink>
            <AppShellLink href="#projects" title="Projects">
              <Icon icon={Folder01Icon} />
              <span>Projects</span>
            </AppShellLink>
            <AppShellLink href="#team" title="Team">
              <Icon icon={UserGroupIcon} />
              <span>Team</span>
            </AppShellLink>
          </AppShellNav>
          <AppShellFooter>
            <AppShellLink href="#settings" title="Settings">
              <Icon icon={Settings02Icon} />
              <span>Settings</span>
            </AppShellLink>
          </AppShellFooter>
        </AppShellSidebar>
        <AppShellMain>
          <div className="ayy-stack" style={{ "--ayy-gap": "var(--ayy-space-4)" } as CSSProperties}>
            <h2 className="ayy-h3">Dashboard</h2>
            <p className="ayy-muted">Rest the pointer on the collapsed sidebar to preview it, or use the toggle to keep it open.</p>
            <div className="ayy-grid" style={{ "--ayy-min": "9rem" } as CSSProperties}>
              <Stat labelFirst label="Open projects" value="12" />
              <Stat labelFirst label="Shipped this week" value="38" />
              <Stat labelFirst label="Team members" value="9" />
            </div>
          </div>
        </AppShellMain>
      </AppShell>
    </div>
  );
}
