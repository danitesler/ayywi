import type { CSSProperties } from "react";
import { DashboardSquare01Icon, Folder01Icon, Settings02Icon, UserGroupIcon } from "@hugeicons/core-free-icons";
import {
  AppShell,
  AppShellBrand,
  AppShellFooter,
  AppShellLink,
  AppShellMain,
  AppShellNav,
  AppShellSidebar,
  Icon,
  Stat,
} from "ayywi/react";

export default function Example() {
  // The shell is 100dvh high. This box only stands in for the browser window; in your app, drop the wrapper and the blockSize on the shell.
  return (
    <div style={{ inlineSize: "100%", blockSize: "28rem", overflow: "hidden", border: "1px solid var(--ayy-color-line)", borderRadius: "var(--ayy-radius-xl)" }}>
      <AppShell style={{ blockSize: "100%" }}>
        <AppShellSidebar>
          <AppShellBrand href="#home">
            <span className="ayy-avatar ayy-avatar--sm" aria-hidden="true">
              <span className="ayy-avatar__fallback">NW</span>
            </span>
            Northwind
          </AppShellBrand>
          <AppShellNav>
            <AppShellLink href="#dashboard" current>
              <Icon icon={DashboardSquare01Icon} />
              Dashboard
            </AppShellLink>
            <AppShellLink href="#projects">
              <Icon icon={Folder01Icon} />
              Projects
            </AppShellLink>
            <AppShellLink href="#team">
              <Icon icon={UserGroupIcon} />
              Team
            </AppShellLink>
          </AppShellNav>
          <AppShellFooter>
            <AppShellLink href="#settings">
              <Icon icon={Settings02Icon} />
              Settings
            </AppShellLink>
          </AppShellFooter>
        </AppShellSidebar>
        <AppShellMain>
          <div className="ayy-stack" style={{ "--ayy-gap": "var(--ayy-space-4)" } as CSSProperties}>
            <h2 className="ayy-h3">Dashboard</h2>
            <p className="ayy-muted">What's moving across your projects this week.</p>
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
