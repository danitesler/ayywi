import {
  DashboardSquare01Icon,
  Folder01Icon,
  Notification03Icon,
  Search01Icon,
  Task01Icon,
  UserIcon,
} from "@hugeicons/core-free-icons";
import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import {
  BottomNav,
  BottomNavLink,
  Field,
  Icon,
  Label,
  Select,
  Switch,
  type BottomNavSize,
} from "@danitesler/ayywi/react";

export default function Example({
  setControls,
}: {
  setControls?: (node: ReactNode) => void;
} = {}) {
  const [size, setSize] = useState<BottomNavSize>("lg");
  const [compact, setCompact] = useState(false);
  const [iconOnly, setIconOnly] = useState(false);
  const [moreItems, setMoreItems] = useState(false);

  useEffect(() => {
    if (setControls) {
      setControls(
        <div className="ayy-stack">
          <div className="ayy-stack">
            <span className="ayy-muted ayy-mono ayy-small">Options</span>
            <div className="ayy-spread">
              <Label htmlFor="bn-size">Size</Label>
              <div style={{ inlineSize: "7.5rem" }}>
                <Select
                  id="bn-size"
                  size="sm"
                  value={size}
                  onChange={(e) => setSize(e.target.value as BottomNavSize)}
                >
                  <option value="lg">Big (lg)</option>
                  <option value="md">Medium (md)</option>
                  <option value="sm">Small (sm)</option>
                </Select>
              </div>
            </div>
            <div className="ayy-spread">
              <Label htmlFor="bn-compact">Compact</Label>
              <Switch id="bn-compact" checked={compact} onCheckedChange={setCompact} />
            </div>
            <div className="ayy-spread">
              <Label htmlFor="bn-icon-only">Icon only</Label>
              <Switch id="bn-icon-only" checked={iconOnly} onCheckedChange={setIconOnly} />
            </div>
            <div className="ayy-spread">
              <Label htmlFor="bn-more">More items (6)</Label>
              <Switch id="bn-more" checked={moreItems} onCheckedChange={setMoreItems} />
            </div>
          </div>
        </div>
      );
      return () => setControls(null);
    }
  }, [setControls, size, compact, iconOnly, moreItems]);

  const phoneContainer = (
    <div style={{ display: "flex", flexDirection: "column", inlineSize: "min(100%, 24rem)", blockSize: "22rem", overflow: "auto", border: "1px solid var(--ayy-color-line)", borderRadius: "var(--ayy-radius-xl)" }}>
      <div className="ayy-stack" style={{ flex: 1, padding: "var(--ayy-space-4)" }}>
        <h2 className="ayy-h4">Home</h2>
        <p className="ayy-muted">Three deploys went out this morning. Nothing needs you.</p>
      </div>
      <BottomNav size={size} compact={compact} iconOnly={iconOnly}>
        <BottomNavLink href="#home" icon={<Icon icon={DashboardSquare01Icon} />} current>
          Home
        </BottomNavLink>
        {moreItems ? (
          <BottomNavLink href="#search" icon={<Icon icon={Search01Icon} />}>
            Search
          </BottomNavLink>
        ) : null}
        <BottomNavLink href="#projects" icon={<Icon icon={Folder01Icon} />}>
          Projects
        </BottomNavLink>
        {moreItems ? (
          <BottomNavLink href="#tasks" icon={<Icon icon={Task01Icon} />}>
            Tasks
          </BottomNavLink>
        ) : null}
        <BottomNavLink href="#inbox" icon={<Icon icon={Notification03Icon} />}>
          Inbox
        </BottomNavLink>
        <BottomNavLink href="#account" icon={<Icon icon={UserIcon} />}>
          Account
        </BottomNavLink>
      </BottomNav>
    </div>
  );

  if (setControls) {
    return phoneContainer;
  }

  return (
    <div className="ayy-stack" style={{ inlineSize: "100%", alignItems: "center", "--ayy-gap": "var(--ayy-space-4)" } as CSSProperties}>
      <div className="ayy-grid" style={{ "--ayy-min": "10rem", inlineSize: "min(100%, 24rem)" } as CSSProperties}>
        <Field inline>
          <Label htmlFor="bn-size-inline">Size</Label>
          <Select id="bn-size-inline" size="sm" value={size} onChange={(e) => setSize(e.target.value as BottomNavSize)}>
            <option value="lg">Big</option>
            <option value="md">Medium</option>
            <option value="sm">Small</option>
          </Select>
        </Field>
        <Field inline>
          <Switch id="bn-compact-inline" checked={compact} onCheckedChange={setCompact} />
          <Label htmlFor="bn-compact-inline">Compact</Label>
        </Field>
        <Field inline>
          <Switch id="bn-icon-inline" checked={iconOnly} onCheckedChange={setIconOnly} />
          <Label htmlFor="bn-icon-inline">Icon only</Label>
        </Field>
        <Field inline>
          <Switch id="bn-more-inline" checked={moreItems} onCheckedChange={setMoreItems} />
          <Label htmlFor="bn-more-inline">6 items</Label>
        </Field>
      </div>
      {phoneContainer}
    </div>
  );
}
