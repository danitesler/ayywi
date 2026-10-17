import { useState, useEffect, type ReactNode } from "react";
import {
  Badge,
  Label,
  Switch,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@danitesler/ayywi/react";

const deployments = [
  { project: "Marketing site", status: "Live", variant: "success", builds: 128 },
  { project: "Mobile API", status: "Building", variant: "warning", builds: 42 },
  { project: "Docs", status: "Failed", variant: "destructive", builds: 7 },
] as const;

export default function Example({
  setControls,
}: {
  setControls?: (node: ReactNode) => void;
} = {}) {
  const [compact, setCompact] = useState(false);
  const [showCaption, setShowCaption] = useState(true);
  const [showBuilds, setShowBuilds] = useState(true);
  const [showFooter, setShowFooter] = useState(false);

  useEffect(() => {
    return () => setControls?.(null);
  }, [setControls]);

  useEffect(() => {
    if (!setControls) return;
    setControls(
      <div className="pv-props-list">
        <div className="pv-props-group">
          <div className="pv-props-item">
            <Label htmlFor="tbl-compact" className="pv-props-label">Compact rows</Label>
            <Switch id="tbl-compact" checked={compact} onCheckedChange={setCompact} />
          </div>
          <div className="pv-props-item">
            <Label htmlFor="tbl-caption" className="pv-props-label">Caption</Label>
            <Switch id="tbl-caption" checked={showCaption} onCheckedChange={setShowCaption} />
          </div>
          <div className="pv-props-item">
            <Label htmlFor="tbl-builds" className="pv-props-label">Numeric column</Label>
            <Switch id="tbl-builds" checked={showBuilds} onCheckedChange={setShowBuilds} />
          </div>
          <div className="pv-props-item">
            <Label htmlFor="tbl-footer" className="pv-props-label">Footer</Label>
            <Switch id="tbl-footer" checked={showFooter} onCheckedChange={setShowFooter} />
          </div>
        </div>
      </div>
    );
  }, [setControls, compact, showCaption, showBuilds, showFooter]);

  return (
    <Table compact={compact}>
      {showCaption ? <TableCaption>Deployments</TableCaption> : null}
      <TableHeader>
        <TableRow>
          <TableHead>Project</TableHead>
          <TableHead>Status</TableHead>
          {showBuilds ? <TableHead numeric>Builds</TableHead> : null}
        </TableRow>
      </TableHeader>
      <TableBody>
        {deployments.map((d) => (
          <TableRow key={d.project}>
            <TableCell>{d.project}</TableCell>
            <TableCell>
              <Badge variant={d.variant}>{d.status}</Badge>
            </TableCell>
            {showBuilds ? <TableCell numeric>{d.builds}</TableCell> : null}
          </TableRow>
        ))}
      </TableBody>
      {showFooter ? (
        <TableFooter>
          <TableRow>
            <TableCell colSpan={showBuilds ? 2 : 1}>Total deployments</TableCell>
            {showBuilds ? <TableCell numeric>177</TableCell> : null}
          </TableRow>
        </TableFooter>
      ) : null}
    </Table>
  );
}
