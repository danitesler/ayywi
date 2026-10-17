import { useState, useEffect, type CSSProperties, type ReactNode } from "react";
import {
  DashboardSquare01Icon,
  Database01Icon,
  Folder01Icon,
  Invoice01Icon,
  KeyboardIcon,
  MoreHorizontalIcon,
  Notification03Icon,
  PaintBoardIcon,
  Search01Icon,
  Settings01Icon,
  Settings02Icon,
  SidebarLeftIcon,
  UserCircleIcon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons";
import {
  AppShell,
  AppShellBar,
  AppShellBrand,
  AppShellCollapse,
  AppShellFooter,
  AppShellGroup,
  AppShellHead,
  AppShellItem,
  AppShellLink,
  AppShellMain,
  AppShellNav,
  AppShellResize,
  AppShellSidebar,
  AppShellSublist,
  AppShellTitle,
  AppShellToggle,
  BottomNav,
  BottomNavButton,
  BottomNavLink,
  Button,
  Dialog,
  DialogContent,
  DialogTrigger,
  Field,
  Icon,
  Label,
  Select,
  Settings,
  SettingsRow,
  Stat,
  Switch,
  TopBar,
  type AppShellSize,
  type BottomNavSize,
} from "@danitesler/ayywi/react";

export default function Example({
  device = "desktop",
  setControls,
}: {
  device?: "desktop" | "tablet" | "mobile" | string;
  setControls?: (node: ReactNode) => void;
} = {}) {
  const [standaloneDevice, setStandaloneDevice] = useState<"desktop" | "tablet" | "mobile">((device as any) || "desktop");
  const [size, setSize] = useState<AppShellSize>("lg");
  const [collapsed, setCollapsed] = useState(false);
  const [hover, setHover] = useState(true);
  const [showBar, setShowBar] = useState(true);
  const [showTabs, setShowTabs] = useState(true);
  const [drawer, setDrawer] = useState(false);
  const [grouped, setGrouped] = useState(true);
  const [resizable, setResizable] = useState(true);
  const [navSize, setNavSize] = useState<BottomNavSize>("lg");
  const [navCompact, setNavCompact] = useState(false);
  const [navIconOnly, setNavIconOnly] = useState(false);

  const activeDevice = setControls ? device : standaloneDevice;

  useEffect(() => {
    return () => setControls?.(null);
  }, [setControls]);

  useEffect(() => {
    if (!setControls) return;

    if (activeDevice === "mobile") {
      setControls(
        <div className="ayy-stack">
          <div className="ayy-stack">
            <span className="ayy-muted ayy-mono ayy-small">Layout</span>
            <div className="ayy-spread">
              <Label htmlFor="pg-bar">Top bar</Label>
              <Switch id="pg-bar" checked={showBar} onCheckedChange={setShowBar} />
            </div>
            <div className="ayy-spread">
              <Label htmlFor="pg-tabs">Bottom nav</Label>
              <Switch id="pg-tabs" checked={showTabs} onCheckedChange={setShowTabs} />
            </div>
            <div className="ayy-spread">
              <Label htmlFor="pg-drawer">Drawer on phones</Label>
              <Switch id="pg-drawer" checked={drawer} onCheckedChange={setDrawer} />
            </div>
            <div className="ayy-spread">
              <Label htmlFor="pg-grouped">Grouped nav</Label>
              <Switch id="pg-grouped" checked={grouped} onCheckedChange={setGrouped} />
            </div>
          </div>
          {showTabs ? (
            <div className="ayy-stack">
              <span className="ayy-muted ayy-mono ayy-small">Bottom nav</span>
              <div className="ayy-spread">
                <Label htmlFor="pg-nav-size">Nav size</Label>
                <div style={{ inlineSize: "7.5rem" }}>
                  <Select
                    id="pg-nav-size"
                    size="sm"
                    aria-label="Bottom nav size"
                    value={navSize}
                    onChange={(e) => setNavSize(e.target.value as BottomNavSize)}
                  >
                    <option value="lg">Big (lg)</option>
                    <option value="md">Medium (md)</option>
                    <option value="sm">Small (sm)</option>
                  </Select>
                </div>
              </div>
              <div className="ayy-spread">
                <Label htmlFor="pg-nav-compact">Compact</Label>
                <Switch id="pg-nav-compact" checked={navCompact} onCheckedChange={setNavCompact} />
              </div>
              <div className="ayy-spread">
                <Label htmlFor="pg-nav-icon-only">Icon only</Label>
                <Switch id="pg-nav-icon-only" checked={navIconOnly} onCheckedChange={setNavIconOnly} />
              </div>
            </div>
          ) : null}
        </div>
      );
    } else {
      setControls(
        <div className="ayy-stack">
          <div className="ayy-stack">
            <div className="ayy-spread">
              <Label htmlFor="pg-size">Sidebar size</Label>
              <div style={{ inlineSize: "7.5rem" }}>
                <Select
                  id="pg-size"
                  size="sm"
                  aria-label="Sidebar size"
                  value={size}
                  onChange={(e) => setSize(e.target.value as AppShellSize)}
                >
                  <option value="lg">Big</option>
                  <option value="md">Medium</option>
                  <option value="sm">Small</option>
                </Select>
              </div>
            </div>
            <div className="ayy-spread">
              <Label htmlFor="pg-collapsed">Collapsed sidebar</Label>
              <Switch id="pg-collapsed" checked={collapsed} onCheckedChange={setCollapsed} />
            </div>
            <div className="ayy-spread">
              <Label htmlFor="pg-hover">Hover preview</Label>
              <Switch id="pg-hover" checked={hover} onCheckedChange={setHover} disabled={!collapsed} />
            </div>
            <div className="ayy-spread">
              <Label htmlFor="pg-grouped">Grouped nav</Label>
              <Switch id="pg-grouped" checked={grouped} onCheckedChange={setGrouped} />
            </div>
            <div className="ayy-spread">
              <Label htmlFor="pg-resize">Resize handles</Label>
              <Switch id="pg-resize" checked={resizable} onCheckedChange={setResizable} />
            </div>
          </div>
        </div>
      );
    }
  }, [
    setControls,
    activeDevice,
    size,
    collapsed,
    hover,
    showBar,
    showTabs,
    drawer,
    grouped,
    resizable,
    navSize,
    navCompact,
    navIconOnly,
  ]);

  return (
    <div className="ayy-stack" style={{ inlineSize: "100%", blockSize: "100%", "--ayy-gap": "var(--ayy-space-4)" } as CSSProperties}>
      {!setControls ? (
        <div className="ayy-grid" style={{ "--ayy-min": "12rem" } as CSSProperties}>
          <Field inline>
            <Label htmlFor="pg-device">Device</Label>
            <div style={{ inlineSize: "7.5rem" }}>
              <Select
                id="pg-device"
                size="sm"
                value={standaloneDevice}
                onChange={(e) => setStandaloneDevice(e.target.value as "desktop" | "tablet" | "mobile")}
              >
                <option value="desktop">Desktop</option>
                <option value="tablet">Tablet</option>
                <option value="mobile">Mobile</option>
              </Select>
            </div>
          </Field>
          {activeDevice === "mobile" ? (
            <>
              <Field inline>
                <Switch id="pg-bar" checked={showBar} onCheckedChange={setShowBar} />
                <Label htmlFor="pg-bar">Top bar</Label>
              </Field>
              <Field inline>
                <Switch id="pg-tabs" checked={showTabs} onCheckedChange={setShowTabs} />
                <Label htmlFor="pg-tabs">Bottom nav</Label>
              </Field>
              {showTabs ? (
                <>
                  <Field inline>
                    <Label htmlFor="pg-nav-size-inline">Nav size</Label>
                    <div style={{ inlineSize: "7.5rem" }}>
                      <Select
                        id="pg-nav-size-inline"
                        size="sm"
                        value={navSize}
                        onChange={(e) => setNavSize(e.target.value as BottomNavSize)}
                      >
                        <option value="lg">Big</option>
                        <option value="md">Medium</option>
                        <option value="sm">Small</option>
                      </Select>
                    </div>
                  </Field>
                  <Field inline>
                    <Switch id="pg-nav-compact-inline" checked={navCompact} onCheckedChange={setNavCompact} />
                    <Label htmlFor="pg-nav-compact-inline">Compact</Label>
                  </Field>
                  <Field inline>
                    <Switch id="pg-nav-icon-inline" checked={navIconOnly} onCheckedChange={setNavIconOnly} />
                    <Label htmlFor="pg-nav-icon-inline">Icon only</Label>
                  </Field>
                </>
              ) : null}
              <Field inline>
                <Switch id="pg-drawer" checked={drawer} onCheckedChange={setDrawer} />
                <Label htmlFor="pg-drawer">Drawer on phones</Label>
              </Field>
              <Field inline>
                <Switch id="pg-grouped" checked={grouped} onCheckedChange={setGrouped} />
                <Label htmlFor="pg-grouped">Grouped nav</Label>
              </Field>
            </>
          ) : (
            <>
              <Field inline>
                <Label htmlFor="pg-size">Sidebar size</Label>
                <div style={{ inlineSize: "7.5rem" }}>
                  <Select
                    id="pg-size"
                    size="sm"
                    value={size}
                    onChange={(e) => setSize(e.target.value as AppShellSize)}
                  >
                    <option value="lg">Big</option>
                    <option value="md">Medium</option>
                    <option value="sm">Small</option>
                  </Select>
                </div>
              </Field>
              <Field inline>
                <Switch id="pg-collapsed" checked={collapsed} onCheckedChange={setCollapsed} />
                <Label htmlFor="pg-collapsed">Collapsed sidebar</Label>
              </Field>
              <Field inline>
                <Switch id="pg-hover" checked={hover} onCheckedChange={setHover} disabled={!collapsed} />
                <Label htmlFor="pg-hover">Hover preview</Label>
              </Field>
              <Field inline>
                <Switch id="pg-grouped" checked={grouped} onCheckedChange={setGrouped} />
                <Label htmlFor="pg-grouped">Grouped nav</Label>
              </Field>
              <Field inline>
                <Switch id="pg-resize" checked={resizable} onCheckedChange={setResizable} />
                <Label htmlFor="pg-resize">Resize handles</Label>
              </Field>
            </>
          )}
        </div>
      ) : null}
      {/* The shell is 100dvh high. This box only stands in for the browser window; in your app, drop the wrapper and the blockSize on the shell. */}
      <div style={{ inlineSize: "100%", blockSize: "32rem", overflow: "hidden", border: "1px solid var(--ayy-color-line)", borderRadius: "var(--ayy-radius-xl)" }}>
        {/* Remount when the handles come and go: connectAppShell wires them once, so new ones need a fresh shell. */}
        <AppShell
          key={String(resizable)}
          size={size === "lg" ? undefined : size}
          collapsed={collapsed}
          onCollapseChange={setCollapsed}
          hoverPreview={hover}
          drawer={drawer}
          style={{ blockSize: "100%" }}
        >
          {showBar ? (
            <AppShellBar>
              <AppShellToggle />
              <AppShellBrand href="#dashboard">Northwind</AppShellBrand>
              <Button variant="ghost" size="icon" aria-label="Search">
                <Icon icon={Search01Icon} />
              </Button>
            </AppShellBar>
          ) : null}
          <AppShellSidebar>
            <AppShellHead>
              <AppShellToggle aria-label="Sidebar">
                <Icon icon={SidebarLeftIcon} directional />
              </AppShellToggle>
              <AppShellBrand href="#home">
                <span>{grouped ? "Northwind Docs" : "Northwind"}</span>
              </AppShellBrand>
            </AppShellHead>
            {grouped ? (
              <>
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
                <AppShellFooter>
                  <AppShellLink href="#settings" title="Settings">
                    <Icon icon={Settings02Icon} />
                    <span>Settings</span>
                  </AppShellLink>
                </AppShellFooter>
              </>
            ) : (
              <>
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
                  <AppShellLink href="#invoices" title="Invoices">
                    <Icon icon={Invoice01Icon} />
                    <span>Invoices</span>
                  </AppShellLink>
                </AppShellNav>
                <AppShellFooter>
                  <AppShellLink href="#settings" title="Settings">
                    <Icon icon={Settings02Icon} />
                    <span>Settings</span>
                  </AppShellLink>
                </AppShellFooter>
              </>
            )}
          </AppShellSidebar>
          {resizable ? <AppShellResize aria-label="Resize sidebar" /> : null}
          <AppShellMain>
            {drawer && !showBar && !showTabs ? (
              <div className="ayy-cluster">
                <AppShellToggle />
                <h2 className="ayy-h5">Today</h2>
              </div>
            ) : (
              <div className="ayy-stack" style={{ "--ayy-gap": "var(--ayy-space-4)" } as CSSProperties}>
                <h2 className="ayy-h3">Dashboard</h2>
                <p className="ayy-muted">What&apos;s moving across your projects this week.</p>
                <div className="ayy-grid" style={{ "--ayy-min": "9rem" } as CSSProperties}>
                  <Stat labelFirst label="Open projects" value="12" />
                  <Stat labelFirst label="Shipped this week" value="38" />
                  <Stat labelFirst label="Team members" value="9" />
                </div>
              </div>
            )}
          </AppShellMain>
          {showTabs ? (
            <BottomNav size={navSize} compact={navCompact} iconOnly={navIconOnly}>
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
          ) : null}
        </AppShell>
      </div>
      <p className="ayy-muted">
        Narrow the window below 48rem for phones: the bar and the bottom nav appear, and the sidebar becomes a drawer.
        Without a bar or a bottom nav the sidebar is one sideways row, unless Drawer on phones makes it a drawer instead.
      </p>
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
    </div>
  );
}
