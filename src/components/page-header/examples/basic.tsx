import { Add01Icon, Download01Icon } from "@hugeicons/core-free-icons";
import { Breadcrumb, Button, Icon, PageHeader, PageHeaderActions, PageHeaderDescription, PageHeaderTitle } from "ayywi/react";

export default function Example() {
  return (
    <div style={{ inlineSize: "100%" }}>
      <PageHeader>
        <Breadcrumb items={[{ label: "Workspace", href: "#workspace" }, { label: "Projects" }]} />
        <PageHeaderTitle>Projects</PageHeaderTitle>
        <PageHeaderDescription>Everything your team is shipping this quarter.</PageHeaderDescription>
        <PageHeaderActions>
          <Button variant="outline">
            <Icon icon={Download01Icon} />
            Export
          </Button>
          <Button>
            <Icon icon={Add01Icon} />
            New project
          </Button>
        </PageHeaderActions>
      </PageHeader>
    </div>
  );
}
