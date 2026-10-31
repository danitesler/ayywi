import { Add01Icon, Folder01Icon } from "@hugeicons/core-free-icons";
import { Button, EmptyState, EmptyStateActions, EmptyStateDescription, EmptyStateTitle, Icon, IconTile } from "@danitesler/ayywi/react";

export default function Example() {
  return (
    <div className="ayy-stack" style={{ inlineSize: "min(100%, 40rem)" }}>
      <EmptyState size="sm" bordered>
        <EmptyStateTitle>No comments yet</EmptyStateTitle>
        <EmptyStateDescription>Comments from your team show up here.</EmptyStateDescription>
      </EmptyState>
      <EmptyState bordered>
        <EmptyStateTitle>No comments yet</EmptyStateTitle>
        <EmptyStateDescription>Comments from your team show up here.</EmptyStateDescription>
      </EmptyState>
      <EmptyState size="lg" bordered>
        <IconTile size="lg">
          <Icon icon={Folder01Icon} name="folder" />
        </IconTile>
        <EmptyStateTitle>No projects yet</EmptyStateTitle>
        <EmptyStateDescription>Projects hold your pages, forms and the people working on them. Start one from scratch or from a template.</EmptyStateDescription>
        <EmptyStateActions>
          <Button size="lg">
            <Icon icon={Add01Icon} name="add" />
            New project
          </Button>
        </EmptyStateActions>
      </EmptyState>
    </div>
  );
}
