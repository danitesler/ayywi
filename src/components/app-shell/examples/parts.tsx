import type { CSSProperties } from "react";
import {
  Add01Icon,
  ChartBubble01Icon,
  Folder01Icon,
  Layers01Icon,
  MoreHorizontalIcon,
  Search01Icon,
  Settings02Icon,
  SidebarLeftIcon,
} from "@hugeicons/core-free-icons";
import {
  AppShell,
  AppShellBar,
  AppShellBrand,
  AppShellCollapse,
  AppShellDetail,
  AppShellFooter,
  AppShellGroup,
  AppShellHead,
  AppShellItem,
  AppShellLink,
  AppShellMain,
  AppShellMore,
  AppShellNav,
  AppShellResize,
  AppShellSidebar,
  AppShellSublist,
  AppShellToggle,
  Badge,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Icon,
} from "@danitesler/ayywi/react";

/**
 * Every piece of the shell in one frame. Sidebar: Head (Brand with a Logotype, and the Toggle), Nav, two Groups with a Section title,
 * Items, Links (one an Action, one current, one with a Badge and a trailing More menu), a Sublist of Sub items, a Collapse, and the
 * Footer. Beside it: Resize, Main and Detail. The phone-only Bar shows below 48rem (switch the preview to Mobile). Title and Back
 * belong to settings mode.
 */
export default function Example() {
  return (
    <div style={{ inlineSize: "100%", blockSize: "38rem", overflow: "hidden", border: "1px solid var(--ayy-color-line)", borderRadius: "var(--ayy-radius-xl)" }}>
      <AppShell size="md" style={{ blockSize: "100%", "--ayy-detail-w": "13rem" } as CSSProperties}>
        <AppShellBar>
          <AppShellToggle />
          <AppShellBrand href="#home">Northwind</AppShellBrand>
          <Button variant="ghost" size="icon" aria-label="Search">
            <Icon icon={Search01Icon} />
          </Button>
        </AppShellBar>
        <AppShellSidebar>
          <AppShellHead>
            <AppShellBrand href="#home">
              <Icon icon={Layers01Icon} />
              <span className="ayy-app-shell__logotype">northwind</span>
            </AppShellBrand>
            <AppShellToggle>
              <Icon icon={SidebarLeftIcon} className="ayy-icon--directional" />
            </AppShellToggle>
          </AppShellHead>
          <AppShellNav aria-label="Workspace">
            <AppShellGroup label="Workspace">
              <AppShellItem>
                <AppShellLink className="ayy-app-shell__link--action" href="#new">
                  <Icon icon={Add01Icon} />
                  <span>New</span>
                </AppShellLink>
              </AppShellItem>
              <AppShellItem className="ayy-app-shell__row">
                <AppShellLink href="#projects">
                  <Icon icon={Folder01Icon} />
                  <span>Projects</span>
                  <Badge variant="muted">Beta</Badge>
                </AppShellLink>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <AppShellMore aria-label="Project options">
                      <Icon icon={MoreHorizontalIcon} />
                    </AppShellMore>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>New project</DropdownMenuItem>
                    <DropdownMenuItem>Project settings</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem destructive>Archive project</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </AppShellItem>
              <AppShellItem>
                <AppShellLink current href="#artifacts">
                  <Icon icon={ChartBubble01Icon} />
                  <span>Artifacts</span>
                </AppShellLink>
                <AppShellSublist aria-label="Artifact views">
                  <AppShellItem>
                    <AppShellLink sub href="#recent">Recent</AppShellLink>
                  </AppShellItem>
                  <AppShellItem>
                    <AppShellLink sub href="#shared">Shared</AppShellLink>
                  </AppShellItem>
                </AppShellSublist>
              </AppShellItem>
            </AppShellGroup>
            <AppShellGroup label="Foundations" collapsible>
              <AppShellItem>
                <AppShellCollapse label="Colors">
                  <AppShellItem>
                    <AppShellLink sub href="#themes">Themes</AppShellLink>
                  </AppShellItem>
                  <AppShellItem>
                    <AppShellLink sub href="#surfaces">Surfaces</AppShellLink>
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
        </AppShellSidebar>
        <AppShellResize aria-label="Resize sidebar" />
        <AppShellMain>
          <h2 className="ayy-h5">Artifacts</h2>
        </AppShellMain>
        <AppShellDetail>
          <h2 className="ayy-h5">Q3 report</h2>
          <p className="ayy-muted">Picked in main.</p>
        </AppShellDetail>
      </AppShell>
    </div>
  );
}
