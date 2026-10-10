import { useState, type CSSProperties } from "react";
import { DashboardSquare01Icon, Folder01Icon, Settings02Icon, UserGroupIcon } from "@hugeicons/core-free-icons";
import {
  AppShell,
  AppShellBrand,
  AppShellFooter,
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

  return (
    <div style={{ inlineSize: "100%", blockSize: "28rem", overflow: "hidden", border: "1px solid var(--ayy-color-line)", borderRadius: "var(--ayy-radius-xl)" }}>
      <AppShell
        collapsed={collapsed}
        hoverPreview
        onCollapseChange={setCollapsed}
        style={{ blockSize: "100%" }}
      >
        <AppShellSidebar>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <AppShellBrand href="#home">
              <span className="ayy-avatar ayy-avatar--sm" aria-hidden="true">
                <span className="ayy-avatar__fallback">NW</span>
              </span>
              <span>Northwind</span>
            </AppShellBrand>
            <AppShellToggle aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"} />
          </div>
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
            <p className="ayy-muted">Hover over the collapsed sidebar to preview it, or click the toggle to expand.</p>
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
