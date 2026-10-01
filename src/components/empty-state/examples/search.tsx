import { Search01Icon } from "@hugeicons/core-free-icons";
import { Button, Card, EmptyState, EmptyStateActions, EmptyStateDescription, EmptyStateTitle, Icon, IconTile } from "ayywi/react";

export default function Example() {
  return (
    <Card style={{ inlineSize: "min(100%, 26rem)" }}>
      <EmptyState compact role="status">
        <IconTile size="sm">
          <Icon icon={Search01Icon} />
        </IconTile>
        <EmptyStateTitle>No invoices match “Acme 2025”</EmptyStateTitle>
        <EmptyStateDescription>Try a client name or an invoice number, or clear the filters.</EmptyStateDescription>
        <EmptyStateActions>
          <Button size="sm" variant="outline">
            Clear filters
          </Button>
        </EmptyStateActions>
      </EmptyState>
    </Card>
  );
}
