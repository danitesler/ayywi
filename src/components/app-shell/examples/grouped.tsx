import type { CSSProperties } from "react";
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
  AppShellSublist,
} from "ayywi/react";

export default function Example() {
  // The shell is 100dvh high. This box only stands in for the browser window; in your app, drop the wrapper and the blockSize on the shell.
  return (
    <div style={{ inlineSize: "100%", blockSize: "32rem", overflow: "hidden", border: "1px solid var(--ayy-color-line)", borderRadius: "var(--ayy-radius-xl)" }}>
      <AppShell style={{ blockSize: "100%" }}>
        <AppShellSidebar>
          <AppShellBrand href="#home">Northwind Docs</AppShellBrand>
          <AppShellNav aria-label="Docs">
            <AppShellGroup label="Start">
              <AppShellItem>
                <AppShellLink href="#overview">Overview</AppShellLink>
              </AppShellItem>
              <AppShellItem>
                <AppShellLink href="#get-started">Get started</AppShellLink>
                <AppShellSublist aria-label="Get started sections">
                  <AppShellItem>
                    <AppShellLink sub href="#install">Install</AppShellLink>
                  </AppShellItem>
                  <AppShellItem>
                    <AppShellLink sub href="#first-screen">Build your first screen</AppShellLink>
                  </AppShellItem>
                </AppShellSublist>
              </AppShellItem>
            </AppShellGroup>
            <AppShellGroup label="Foundations">
              <AppShellItem>
                <AppShellCollapse label="Colors" open>
                  <AppShellItem>
                    <AppShellLink sub current href="#themes">Themes</AppShellLink>
                  </AppShellItem>
                  <AppShellItem>
                    <AppShellLink sub href="#surfaces">Surfaces</AppShellLink>
                  </AppShellItem>
                  <AppShellItem>
                    <AppShellLink sub href="#status">Status</AppShellLink>
                  </AppShellItem>
                </AppShellCollapse>
              </AppShellItem>
              <AppShellItem>
                <AppShellCollapse label="Typography">
                  <AppShellItem>
                    <AppShellLink sub href="#scale">Scale</AppShellLink>
                  </AppShellItem>
                  <AppShellItem>
                    <AppShellLink sub href="#fonts">Fonts</AppShellLink>
                  </AppShellItem>
                </AppShellCollapse>
              </AppShellItem>
              <AppShellItem>
                <AppShellLink href="#spacing">Spacing</AppShellLink>
              </AppShellItem>
            </AppShellGroup>
          </AppShellNav>
        </AppShellSidebar>
        <AppShellMain>
          <div className="ayy-stack" style={{ "--ayy-gap": "var(--ayy-space-4)" } as CSSProperties}>
            <h2 className="ayy-h3">Themes</h2>
            <p className="ayy-muted">Dark, dark soft, light and light gray. Each one remaps the same semantic tokens.</p>
          </div>
        </AppShellMain>
      </AppShell>
    </div>
  );
}
