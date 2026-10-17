import { useState, useEffect, type ReactNode } from "react";
import { Add01Icon, Download01Icon } from "@hugeicons/core-free-icons";
import {
  Breadcrumb,
  Button,
  Icon,
  Label,
  PageHeader,
  PageHeaderActions,
  PageHeaderDescription,
  PageHeaderTitle,
  Switch,
} from "@danitesler/ayywi/react";

export default function Example({
  setControls,
}: {
  setControls?: (node: ReactNode) => void;
} = {}) {
  const [showBreadcrumbs, setShowBreadcrumbs] = useState(true);
  const [showDescription, setShowDescription] = useState(true);
  const [showSecondaryAction, setShowSecondaryAction] = useState(true);

  useEffect(() => {
    return () => setControls?.(null);
  }, [setControls]);

  useEffect(() => {
    if (!setControls) return;
    setControls(
      <div className="pv-props-list">
        <div className="pv-props-group">
          <div className="pv-props-item">
            <Label htmlFor="ph-breadcrumbs" className="pv-props-label">Breadcrumb</Label>
            <Switch id="ph-breadcrumbs" checked={showBreadcrumbs} onCheckedChange={setShowBreadcrumbs} />
          </div>
          <div className="pv-props-item">
            <Label htmlFor="ph-desc" className="pv-props-label">Description</Label>
            <Switch id="ph-desc" checked={showDescription} onCheckedChange={setShowDescription} />
          </div>
          <div className="pv-props-item">
            <Label htmlFor="ph-action" className="pv-props-label">Secondary action</Label>
            <Switch id="ph-action" checked={showSecondaryAction} onCheckedChange={setShowSecondaryAction} />
          </div>
        </div>
      </div>
    );
  }, [setControls, showBreadcrumbs, showDescription, showSecondaryAction]);

  return (
    <div style={{ inlineSize: "100%" }}>
      <PageHeader>
        {showBreadcrumbs ? (
          <Breadcrumb items={[{ label: "Workspace", href: "#workspace" }, { label: "Projects" }]} />
        ) : null}
        <PageHeaderTitle>Projects</PageHeaderTitle>
        {showDescription ? (
          <PageHeaderDescription>Everything your team is shipping this quarter.</PageHeaderDescription>
        ) : null}
        <PageHeaderActions>
          {showSecondaryAction ? (
            <Button variant="outline">
              <Icon icon={Download01Icon} />
              Export
            </Button>
          ) : null}
          <Button>
            <Icon icon={Add01Icon} />
            New project
          </Button>
        </PageHeaderActions>
      </PageHeader>
    </div>
  );
}
