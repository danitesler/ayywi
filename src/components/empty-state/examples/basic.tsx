import { Add01Icon, Folder01Icon } from "@hugeicons/core-free-icons";
import { Button, EmptyState, EmptyStateActions, EmptyStateDescription, EmptyStateTitle, Icon, IconTile } from "@danitesler/ayywi/react";

export default function Example() {
  return (
    <EmptyState bordered style={{ inlineSize: "min(100%, 34rem)" }}>
      <IconTile>
        <Icon icon={Folder01Icon} />
      </IconTile>
      <EmptyStateTitle>No projects yet</EmptyStateTitle>
      <EmptyStateDescription>Projects hold your pages, forms and the people working on them. Start one from scratch or from a template.</EmptyStateDescription>
      <EmptyStateActions>
        <Button>
          <Icon icon={Add01Icon} />
          New project
        </Button>
        <Button variant="ghost">Browse templates</Button>
      </EmptyStateActions>
    </EmptyState>
  );
}
