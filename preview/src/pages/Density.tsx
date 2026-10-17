import { useEffect, useState } from "react";
import { type DensityMode } from "@danitesler/ayywi";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  Field,
  Icon,
  Input,
  Label,
  SegmentedControl,
  SegmentedControlItem,
  Select,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@danitesler/ayywi/react";
import { Add01Icon, FilterIcon } from "@hugeicons/core-free-icons";

export const densityPage = {
  route: "density",
  title: "Density",
  keywords: "density compact comfortable touch sizes scale height padding",
  text: "density compact comfortable touch sizes scale height padding",
};

export interface DensityPageProps {
  density: DensityMode;
  setDensity: (mode: DensityMode) => void;
}

const SIZES = [
  { name: "Small controls", compact: "28px", comfortable: "32px", touch: "40px" },
  { name: "Default controls", compact: "32px", comfortable: "40px", touch: "44px" },
  { name: "Large controls", compact: "40px", comfortable: "48px", touch: "52px" },
  { name: "Switch height", compact: "20px", comfortable: "22px", touch: "26px" },
  { name: "Checkbox & radio", compact: "16px", comfortable: "18px", touch: "20px" },
  { name: "UI text (text-s, control-text-sm/md)", compact: "12px", comfortable: "13px", touch: "14px" },
  { name: "Large control text (control-text-lg)", compact: "14px", comfortable: "15px", touch: "16px" },
  { name: "Field text (control-text-field)", compact: "12px", comfortable: "13px", touch: "16px" },
  { name: "Control padding (sm)", compact: "12px", comfortable: "14px", touch: "16px" },
  { name: "Control padding (md)", compact: "16px", comfortable: "18px", touch: "20px" },
  { name: "Control padding (lg)", compact: "20px", comfortable: "24px", touch: "28px" },
];

function DensityCardSample({
  mode,
  title,
  subtitle,
  badgeText,
}: {
  mode: "compact" | "comfortable" | "touch";
  title: string;
  subtitle: string;
  badgeText: string;
}) {
  const [activeTab, setActiveTab] = useState("daily");
  const [notify, setNotify] = useState(true);
  const [autoSave, setAutoSave] = useState(true);

  return (
    <Card data-density={mode}>
      <CardHeader>
        <div className="ayy-cluster" style={{ justifyContent: "space-between", alignItems: "baseline" }}>
          <div>
            <strong>{title}</strong>
            <p className="ayy-muted" style={{ margin: 0, fontSize: "var(--ayy-text-xs)" }}>
              {subtitle}
            </p>
          </div>
          <Badge variant="muted">{badgeText}</Badge>
        </div>
      </CardHeader>
      <CardContent className="ayy-stack">
        <Field>
          <Label htmlFor={`pv-density-input-${mode}`}>Project name</Label>
          <Input id={`pv-density-input-${mode}`} defaultValue="Core Design System" placeholder="Project name" />
        </Field>

        <Field>
          <Label htmlFor={`pv-density-select-${mode}`}>Deployment target</Label>
          <Select id={`pv-density-select-${mode}`} defaultValue="production">
            <option value="production">Production</option>
            <option value="staging">Staging</option>
            <option value="development">Development</option>
          </Select>
        </Field>

        <Field>
          <Label>Schedule</Label>
          <SegmentedControl aria-label="Schedule" value={activeTab} onValueChange={setActiveTab}>
            <SegmentedControlItem value="daily">Daily</SegmentedControlItem>
            <SegmentedControlItem value="weekly">Weekly</SegmentedControlItem>
            <SegmentedControlItem value="monthly">Monthly</SegmentedControlItem>
          </SegmentedControl>
        </Field>

        <div className="ayy-cluster" style={{ justifyContent: "space-between", alignItems: "center" }}>
          <Field inline>
            <Switch id={`pv-density-switch-${mode}`} checked={autoSave} onChange={(e) => setAutoSave(e.target.checked)} />
            <Label htmlFor={`pv-density-switch-${mode}`}>Auto-sync</Label>
          </Field>
          <Field inline>
            <Checkbox id={`pv-density-check-${mode}`} checked={notify} onChange={(e) => setNotify(e.target.checked)} />
            <Label htmlFor={`pv-density-check-${mode}`}>Alerts</Label>
          </Field>
        </div>

        <div className="ayy-cluster" style={{ marginTop: "var(--ayy-space-2)" }}>
          <Button>Save</Button>
          <Button variant="outline">Cancel</Button>
          <Button variant="outline" size="icon" aria-label="Add project">
            <Icon icon={Add01Icon} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function DensityPage({ density, setDensity }: DensityPageProps) {
  const [activeDensity, setActiveDensity] = useState<"compact" | "comfortable" | "touch">(() =>
    density === "comfortable" || density === "touch" ? density : "compact",
  );

  useEffect(() => {
    setActiveDensity(density === "comfortable" || density === "touch" ? density : "compact");
  }, [density]);
  const [searchQuery, setSearchQuery] = useState("");

  const handleDensityChange = (value: string) => {
    const next = value as "compact" | "comfortable" | "touch";
    setActiveDensity(next);
    setDensity(next);
  };

  const tableData = [
    { name: "Production API Gateway", type: "Service", status: "Healthy", updated: "2m ago" },
    { name: "Auth & Identity Provider", type: "Security", status: "Healthy", updated: "14m ago" },
    { name: "Search Index Worker", type: "Background", status: "Warning", updated: "1h ago" },
    { name: "PostgreSQL Primary Cluster", type: "Database", status: "Healthy", updated: "3h ago" },
  ];

  return (
    <article className="pv-page">
      <header className="pv-page__header">
        <p className="ayy-eyebrow">Foundations</p>
        <h1 className="ayy-h2">Density</h1>
        <p className="ayy-lede">
          Controls, padding and font sizes scale across three densities: compact for dense screens, comfortable for room to breathe, and touch for fingers.
        </p>
      </header>

      {/* Interactive density showcase moved to top */}
      <h2 className="pv-h pv-h--section">Density</h2>
      <p className="pv-note">
        Pick a density to see the controls, table and actions scale in real time.
      </p>

      <Card data-density={activeDensity}>
        <CardHeader>
          <div className="ayy-cluster" style={{ justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "var(--ayy-space-3)" }}>
            <div>
              <strong>Services</strong>
              <p className="ayy-muted" style={{ margin: 0, fontSize: "var(--ayy-text-xs)" }}>
                {activeDensity === "compact" && "Compact — 32px height, tight padding for desktop productivity"}
                {activeDensity === "comfortable" && "Comfortable — 40px height, balanced space for everyday apps"}
                {activeDensity === "touch" && "Touch — 44px height, large tap targets for phones and tablets"}
              </p>
            </div>
            <SegmentedControl
              size="sm"
              aria-label="Density"
              value={activeDensity}
              onValueChange={handleDensityChange}
            >
              <SegmentedControlItem value="compact">Compact</SegmentedControlItem>
              <SegmentedControlItem value="comfortable">Comfortable</SegmentedControlItem>
              <SegmentedControlItem value="touch">Touch</SegmentedControlItem>
            </SegmentedControl>
          </div>
        </CardHeader>
        <CardContent className="ayy-stack">
          <div className="ayy-cluster" style={{ justifyContent: "space-between", alignItems: "center" }}>
            <Input
              placeholder="Filter services…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ maxWidth: "20rem" }}
            />
            <div className="ayy-cluster">
              <Button variant="outline">
                <Icon icon={FilterIcon} />
                Filters
              </Button>
              <Button>
                <Icon icon={Add01Icon} />
                Add service
              </Button>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead style={{ textAlign: "end" }}>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tableData
                .filter((r) => r.name.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((row) => (
                  <TableRow key={row.name}>
                    <TableCell>
                      <strong>{row.name}</strong>
                    </TableCell>
                    <TableCell>{row.type}</TableCell>
                    <TableCell>
                      <Badge variant={row.status === "Healthy" ? "success" : "warning"}>{row.status}</Badge>
                    </TableCell>
                    <TableCell className="ayy-muted">{row.updated}</TableCell>
                    <TableCell style={{ textAlign: "end" }}>
                      <Button variant="ghost" size="sm">
                        Manage
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Side-by-side comparison */}
      <h2 className="pv-h pv-h--section">Comparison</h2>
      <p className="pv-note">
        Same controls at each density.
      </p>

      <div className="pv-densities">
        <DensityCardSample
          mode="compact"
          title="Compact"
          subtitle="32px height · Desktop default"
          badgeText="Compact"
        />
        <DensityCardSample
          mode="comfortable"
          title="Comfortable"
          subtitle="40px height · More room"
          badgeText="Comfortable"
        />
        <DensityCardSample
          mode="touch"
          title="Touch"
          subtitle="44px height · Touch screens"
          badgeText="Touch"
        />
      </div>

      {/* Sizes table */}
      <h2 className="pv-h pv-h--section">Sizes</h2>
      <p className="pv-note">
        Control heights, text sizes and padding across each density.
      </p>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Control</TableHead>
            <TableHead>Compact</TableHead>
            <TableHead>Comfortable</TableHead>
            <TableHead>Touch</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {SIZES.map((item) => (
            <TableRow key={item.name}>
              <TableCell>
                <strong>{item.name}</strong>
              </TableCell>
              <TableCell>{item.compact}</TableCell>
              <TableCell>{item.comfortable}</TableCell>
              <TableCell>{item.touch}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </article>
  );
}
