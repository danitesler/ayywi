import type { CSSProperties } from "react";
import { DashboardSquare01Icon, Folder01Icon, UserGroupIcon } from "@hugeicons/core-free-icons";
import {
  AppShell,
  AppShellBrand,
  AppShellCollapse,
  AppShellGroup,
  AppShellItem,
  AppShellLink,
  AppShellMain,
  AppShellNav,
  AppShellSidebar,
  Icon,
  type AppShellSize,
} from "@danitesler/ayywi/react";

function Shell({ size, title, text }: { size: AppShellSize; title: string; text: string }) {
  // The shell is 100dvh high. This box only stands in for the browser window; in your app, drop the wrapper and the blockSize on the shell.
  return (
    <div style={{ blockSize: "27rem", overflow: "hidden", border: "1px solid var(--ayy-color-line)", borderRadius: "var(--ayy-radius-xl)" }}>
      <AppShell size={size} style={{ blockSize: "100%" }}>
        <AppShellSidebar>
          <AppShellBrand href="#home">Northwind</AppShellBrand>
          <AppShellNav aria-label={`${title} navigation`}>
            <AppShellGroup label="Workspace">
              <AppShellItem>
                <AppShellLink current href="#dashboard">
                  <Icon icon={DashboardSquare01Icon} />
                  <span>Dashboard</span>
                </AppShellLink>
              </AppShellItem>
              <AppShellItem>
                <AppShellLink href="#projects">
                  <Icon icon={Folder01Icon} />
                  <span>Projects</span>
                </AppShellLink>
              </AppShellItem>
              <AppShellItem>
                <AppShellLink href="#team">
                  <Icon icon={UserGroupIcon} />
                  <span>Team</span>
                </AppShellLink>
              </AppShellItem>
            </AppShellGroup>
            <AppShellGroup label="Help">
              <AppShellItem>
                <AppShellCollapse label="Guides" open>
                  <AppShellItem>
                    <AppShellLink sub href="#install">Install</AppShellLink>
                  </AppShellItem>
                  <AppShellItem>
                    <AppShellLink sub href="#first-screen">First screen</AppShellLink>
                  </AppShellItem>
                </AppShellCollapse>
              </AppShellItem>
            </AppShellGroup>
          </AppShellNav>
        </AppShellSidebar>
        <AppShellMain>
          <div className="ayy-stack" style={{ "--ayy-gap": "var(--ayy-space-2)" } as CSSProperties}>
            <h2 className="ayy-h4">{title}</h2>
            <p className="ayy-muted">{text}</p>
          </div>
        </AppShellMain>
      </AppShell>
    </div>
  );
}

export default function Example() {
  return (
    <div className="ayy-grid" style={{ inlineSize: "100%", "--ayy-min": "24rem" } as CSSProperties}>
      <Shell size="md" title="Big" text="The default. Roomy rows for an app’s handful of destinations." />
      <Shell size="sm" title="Small" text={'size="sm": denser rows for long navigation, like a docs tree.'} />
    </div>
  );
}
