import {
  Add01Icon,
  Briefcase01Icon,
  ChartBubble01Icon,
  Clock01Icon,
  Folder01Icon,
  Layers01Icon,
  Settings02Icon,
} from "@hugeicons/core-free-icons";
import {
  AppShell,
  AppShellFooter,
  AppShellGroup,
  AppShellHead,
  AppShellBrand,
  AppShellItem,
  AppShellLink,
  AppShellMain,
  AppShellNav,
  AppShellSidebar,
  Badge,
  Icon,
} from "@danitesler/ayywi/react";

/**
 * A nav in the style of a chat app: an action row ("New") with its icon in a circle, icon links, a Badge after a label, and
 * groups whose heading folds them (collapsible; the chevron shows on hover). The first group stays open and unfoldable.
 */
export default function Example() {
  return (
    <div style={{ inlineSize: "100%", blockSize: "34rem", overflow: "hidden", border: "1px solid var(--ayy-color-line)", borderRadius: "var(--ayy-radius-xl)" }}>
      <AppShell size="md" style={{ blockSize: "100%" }}>
        <AppShellSidebar>
          <AppShellHead>
            <AppShellBrand href="#home">
              <Icon icon={Layers01Icon} />
              <span>Northwind</span>
            </AppShellBrand>
          </AppShellHead>
          <AppShellNav aria-label="Workspace">
            <AppShellGroup label="Workspace">
              <AppShellItem>
                <AppShellLink className="ayy-app-shell__link--action" href="#new">
                  <Icon icon={Add01Icon} />
                  <span>New</span>
                </AppShellLink>
              </AppShellItem>
              <AppShellItem>
                <AppShellLink href="#projects">
                  <Icon icon={Folder01Icon} />
                  <span>Projects</span>
                  <Badge variant="muted">Beta</Badge>
                </AppShellLink>
              </AppShellItem>
              <AppShellItem>
                <AppShellLink current href="#artifacts">
                  <Icon icon={ChartBubble01Icon} />
                  <span>Artifacts</span>
                </AppShellLink>
              </AppShellItem>
              <AppShellItem>
                <AppShellLink href="#scheduled">
                  <Icon icon={Clock01Icon} />
                  <span>Scheduled</span>
                </AppShellLink>
              </AppShellItem>
              <AppShellItem>
                <AppShellLink href="#customize">
                  <Icon icon={Briefcase01Icon} />
                  <span>Customize</span>
                </AppShellLink>
              </AppShellItem>
            </AppShellGroup>
            <AppShellGroup label="Recents" collapsible>
              <AppShellItem>
                <AppShellLink href="#diagram">Create repository diagram</AppShellLink>
              </AppShellItem>
              <AppShellItem>
                <AppShellLink href="#skill">Add ChatGPT skill install</AppShellLink>
              </AppShellItem>
              <AppShellItem>
                <AppShellLink href="#titles">Testing conversation titles</AppShellLink>
              </AppShellItem>
            </AppShellGroup>
            <AppShellGroup label="Archived" collapsible defaultOpen={false}>
              <AppShellItem>
                <AppShellLink href="#compare">Compare GPT-OSS 120B</AppShellLink>
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
        <AppShellMain>
          <h2 className="ayy-h5">Artifacts</h2>
        </AppShellMain>
      </AppShell>
    </div>
  );
}
