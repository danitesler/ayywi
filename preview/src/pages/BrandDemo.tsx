import type { ComponentProps } from "react";
import { HexagonIcon } from "@hugeicons/core-free-icons";
import type { IconName } from "@danitesler/ayywi";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  Field,
  Icon,
  IconTile,
  Input,
  Label,
  Progress,
  Sparkline,
  Stat,
  Switch,
} from "@danitesler/ayywi/react";

const REVENUE = [12, 18, 15, 24, 22, 31, 29, 38, 36, 44, 41, 52];

/** The app's logo: a Hugeicons icon and its name, so an icon pack replaces it. */
export type BrandIcon = { icon: ComponentProps<typeof Icon>["icon"]; name: IconName };

/** A small app that takes whatever brand its parent carries: the home page scopes one to it, the Themes page its draft. */
export function BrandApp({ name = "Acme", icon = { icon: HexagonIcon, name: "hexagon" } }: { name?: string; icon?: BrandIcon } = {}) {
  return (
    <Card className="pv-brand-demo__app">
      <CardHeader>
        <div className="ayy-cluster pv-brand-demo__head">
          <span className="pv-brand-demo__logo">
            <IconTile spotColor="var(--ayy-color-primary)">
              <Icon icon={icon.icon} name={icon.name} />
            </IconTile>
            {name}
          </span>
          <Badge>Live</Badge>
        </div>
      </CardHeader>
      <CardContent className="pv-brand-demo__body">
        <div className="pv-brand-demo__stats">
          <Stat size="sm" label="Revenue" value="$52k" unit="+12%" labelFirst />
          <Sparkline values={REVENUE} area color="var(--ayy-color-primary)" label="Revenue, last 12 weeks, up 12%" />
        </div>
        <Progress value={72} size="sm" aria-label="Quarterly goal, 72%" />
        <Field>
          <Label htmlFor="pv-demo-recipient">Send report to</Label>
          <Input id="pv-demo-recipient" type="email" defaultValue="team@acme.co" />
        </Field>
        <Field inline>
          <Switch id="pv-demo-weekly" defaultChecked />
          <Label htmlFor="pv-demo-weekly">Every Monday</Label>
        </Field>
      </CardContent>
      <CardFooter>
        <Button variant="outline">Preview</Button>
        <Button>Send report</Button>
      </CardFooter>
    </Card>
  );
}
