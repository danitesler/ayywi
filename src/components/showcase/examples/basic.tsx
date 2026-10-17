import { useState, type CSSProperties } from "react";
import {
  ComputerIcon,
  SlidersHorizontalIcon,
  SmartPhone01Icon,
  Tablet01Icon,
} from "@hugeicons/core-free-icons";
import {
  Badge,
  Button,
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Icon,
  Label,
  Popover,
  PopoverContent,
  PopoverTrigger,
  SegmentedControl,
  SegmentedControlItem,
  Showcase,
  ShowcaseActions,
  ShowcaseBody,
  ShowcaseHeader,
  ShowcaseStage,
  ShowcaseTitle,
  ShowcaseViewport,
  Switch,
  Tooltip,
  type ShowcaseDevice,
} from "@danitesler/ayywi/react";

export default function Example() {
  const [device, setDevice] = useState<ShowcaseDevice>("desktop");
  const [showBadge, setShowBadge] = useState(true);
  const [showDescription, setShowDescription] = useState(true);
  const [showFooter, setShowFooter] = useState(false);

  return (
    <Showcase device={device} aria-labelledby="showcase-basic-title">
      <ShowcaseHeader>
        <ShowcaseTitle id="showcase-basic-title">Card layout</ShowcaseTitle>
        <ShowcaseActions>
          <SegmentedControl
            size="sm"
            aria-label="Device view"
            value={device}
            onValueChange={(v) => setDevice(v as ShowcaseDevice)}
          >
            <SegmentedControlItem value="desktop" title="Desktop">
              <Icon icon={ComputerIcon} />
            </SegmentedControlItem>
            <SegmentedControlItem value="tablet" title="Tablet">
              <Icon icon={Tablet01Icon} />
            </SegmentedControlItem>
            <SegmentedControlItem value="mobile" title="Mobile">
              <Icon icon={SmartPhone01Icon} />
            </SegmentedControlItem>
          </SegmentedControl>
          <Popover>
            <Tooltip content="Props">
              <PopoverTrigger variant="outline" size="icon-sm" aria-label="Props">
                <Icon icon={SlidersHorizontalIcon} />
              </PopoverTrigger>
            </Tooltip>
            <PopoverContent
              side="bottom"
              align="end"
              aria-label="Card properties"
              style={{ inlineSize: "14rem" }}
            >
              <div
                className="ayy-stack"
                style={{ "--ayy-gap": "var(--ayy-space-3)" } as CSSProperties}
              >
                <div className="ayy-spread">
                  <Label htmlFor="sc-badge" style={{ fontSize: "var(--ayy-text-sm)", cursor: "pointer" }}>
                    Live badge
                  </Label>
                  <Switch id="sc-badge" checked={showBadge} onCheckedChange={setShowBadge} />
                </div>
                <div className="ayy-spread">
                  <Label htmlFor="sc-desc" style={{ fontSize: "var(--ayy-text-sm)", cursor: "pointer" }}>
                    Description
                  </Label>
                  <Switch id="sc-desc" checked={showDescription} onCheckedChange={setShowDescription} />
                </div>
                <div className="ayy-spread">
                  <Label htmlFor="sc-footer" style={{ fontSize: "var(--ayy-text-sm)", cursor: "pointer" }}>
                    Footer
                  </Label>
                  <Switch id="sc-footer" checked={showFooter} onCheckedChange={setShowFooter} />
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </ShowcaseActions>
      </ShowcaseHeader>
      <ShowcaseStage>
        <ShowcaseViewport device={device}>
          <ShowcaseBody>
            <Card style={{ inlineSize: "100%" }}>
              <CardHeader>
                <div className="ayy-spread">
                  <CardTitle>Analytics Overview</CardTitle>
                  {showBadge ? <Badge variant="outline">Live</Badge> : null}
                </div>
                {showDescription ? (
                  <CardDescription>
                    Real-time activity and subscriber growth metrics across all active channels.
                  </CardDescription>
                ) : null}
              </CardHeader>
              {showFooter ? (
                <CardFooter>
                  <Button size="sm">View details</Button>
                </CardFooter>
              ) : null}
            </Card>
          </ShowcaseBody>
        </ShowcaseViewport>
      </ShowcaseStage>
    </Showcase>
  );
}
