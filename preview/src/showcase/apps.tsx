// Six screens built only from ayywi components, tokens and layout utilities. The pv-app-* classes in preview.css
// only size the showcase frame and draw the store's coffee bags and the dating app's portrait; every colour, size
// and control comes from ayywi. The apps share one frame (AppFrame): the sidebar on wide screens, a top bar and a
// bottom nav on phones. The marketing site and the store are websites: a Navbar and a Footer.
import { useId, useRef, useState, type ComponentType, type CSSProperties, type MouseEvent, type ReactNode } from "react";
import {
  Add01Icon,
  Alert02Icon,
  Analytics01Icon,
  ArrowDown01Icon,
  Calendar03Icon,
  Cancel01Icon,
  ChartIncreaseIcon,
  ChartLineData01Icon,
  CheckmarkCircle02Icon,
  Clock01Icon,
  Coffee02Icon,
  CreditCardIcon,
  DashboardSquare01Icon,
  DeliveryTruck01Icon,
  Download01Icon,
  DropletIcon,
  Fire02Icon,
  FlashIcon,
  Flower01Icon,
  Folder01Icon,
  GlobeIcon,
  InboxIcon,
  KeyboardIcon,
  Layers01Icon,
  Link01Icon,
  Location01Icon,
  LockIcon,
  Mail01Icon,
  Message01Icon,
  MoreHorizontalIcon,
  Notification01Icon,
  PaintBoardIcon,
  PlayIcon,
  RefreshIcon,
  Rocket01Icon,
  Search01Icon,
  Settings01Icon,
  Shield01Icon,
  ShoppingBag01Icon,
  SlidersHorizontalIcon,
  SmileIcon,
  SparklesIcon,
  Task01Icon,
  Ticket01Icon,
  UserCircleIcon,
  UserGroupIcon,
  UserMultipleIcon,
  Yoga01Icon,
} from "@hugeicons/core-free-icons";
import bookingScreenshot from "./screenshots/booking.png";
import dashboardScreenshot from "./screenshots/dashboard.png";
import datingScreenshot from "./screenshots/dating.png";
import landingScreenshot from "./screenshots/landing.png";
import storeScreenshot from "./screenshots/store.png";
import trackerScreenshot from "./screenshots/tracker.png";
import { toast, type DensityMode, type IconData, type IconName } from "@danitesler/ayywi";
import {
  Accordion,
  AccordionItem,
  Alert,
  AlertActions,
  AlertDescription,
  AlertTitle,
  AppShell,
  AppShellBar,
  AppShellBrand,
  AppShellFooter,
  AppShellGroup,
  AppShellItem,
  AppShellLink,
  AppShellMain,
  AppShellNav,
  AppShellSidebar,
  AppShellTitle,
  Avatar,
  Badge,
  BarList,
  BottomNav,
  BottomNavButton,
  BottomNavLink,
  Button,
  buttonClass,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardLink,
  CardMedia,
  CardTitle,
  Carousel,
  CarouselSlide,
  Checkbox,
  Chip,
  ChipButton,
  ChipGroup,
  ChoiceCard,
  ChoiceGroup,
  Combobox,
  compareValues,
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
  EmptyState,
  EmptyStateActions,
  EmptyStateDescription,
  EmptyStateTitle,
  Field,
  FieldHint,
  Footer,
  FooterBottom,
  FooterBrand,
  FooterGroup,
  FooterLink,
  FooterNav,
  Icon,
  IconTile,
  Input,
  InputGroup,
  Kbd,
  Label,
  LineChart,
  List,
  ListContent,
  ListDescription,
  ListItem,
  ListLink,
  ListMeta,
  ListTitle,
  Navbar,
  NavbarActions,
  NavbarBrand,
  NavbarLink,
  NavbarNav,
  NavbarToggle,
  nextSortDirection,
  NumberField,
  PageHeader,
  PageHeaderActions,
  PageHeaderDescription,
  PageHeaderTitle,
  Pagination,
  Progress,
  ProgressRing,
  Rating,
  SegmentedControl,
  SegmentedControlItem,
  Select,
  Settings,
  SettingsLink,
  SettingsRow,
  ShortcutRecorder,
  Skeleton,
  SliderRange,
  Sorting,
  SortingTrigger,
  Sparkline,
  Spinner,
  Stat,
  StatusDot,
  Steps,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Textarea,
  TopBar,
  type SortDirection,
} from "@danitesler/ayywi/react";

const gap = (space: number) => ({ "--ayy-gap": `var(--ayy-space-${space})` }) as CSSProperties;
const min = (size: string) => ({ "--ayy-min": size }) as CSSProperties;

/* ---- The shared app frame ---- */

interface Destination {
  href: string;
  label: string;
  icon: IconData;
  iconName: IconName;
}

/** One settings section: a link in the settings dialog's sidebar and what it shows. */
interface SettingsSection {
  href: string;
  label: string;
  icon: IconData;
  iconName: IconName;
  content: ReactNode;
}

interface AppSettings {
  groups: { label: string; sections: SettingsSection[] }[];
  /** Open on load. */
  defaultOpen?: boolean;
}

const PHONE = "(max-width: 48rem)";
const onPhone = () => typeof matchMedia === "function" && matchMedia(PHONE).matches;

/** The settings shell inside the dialog. Mounted on every open: wide screens start on the first section, phones on the list. */
function SettingsShell({ settings, titleId }: { settings: AppSettings; titleId: string }) {
  const sections = settings.groups.flatMap((g) => g.sections);
  const [current, setCurrent] = useState<string | null>(() => (onPhone() ? null : sections[0].href));
  const shown = sections.find((s) => s.href === (current ?? (onPhone() ? null : sections[0].href)));
  const main = useRef<HTMLElement>(null);
  const sidebar = useRef<HTMLElement>(null);
  const open = (event: MouseEvent, href: string) => {
    event.preventDefault();
    setCurrent(href);
    // On phones the list gives way to the section: move focus with it.
    if (onPhone()) requestAnimationFrame(() => main.current?.focus({ preventScroll: true }));
  };
  const back = () => {
    const from = current;
    setCurrent(null);
    requestAnimationFrame(() => sidebar.current?.querySelector<HTMLElement>(`a[href="${from}"]`)?.focus());
  };
  return (
    <AppShell settings>
      <AppShellSidebar ref={sidebar}>
        <AppShellTitle id={titleId}>Settings</AppShellTitle>
        <AppShellNav aria-label="Settings">
          {settings.groups.map((g) => (
            <AppShellGroup key={g.label} label={g.label}>
              {g.sections.map((section) => (
                <AppShellItem key={section.href}>
                  <AppShellLink href={section.href} current={section === shown} onClick={(event) => open(event, section.href)}>
                    <Icon icon={section.icon} name={section.iconName} />
                    {section.label}
                  </AppShellLink>
                </AppShellItem>
              ))}
            </AppShellGroup>
          ))}
        </AppShellNav>
      </AppShellSidebar>
      <AppShellMain as="div" ref={main} tabIndex={-1}>
        {shown ? (
          <>
            <TopBar onBack={back} backLabel="Settings" title={shown.label} />
            {shown.content}
          </>
        ) : null}
      </AppShellMain>
    </AppShell>
  );
}

/** Settings over the app: a near-full-screen dialog (full screen on phones) holding the App shell in settings mode. */
function SettingsDialog({ settings, open, onOpenChange }: { settings: AppSettings; open: boolean; onOpenChange: (open: boolean) => void }) {
  const titleId = useId();
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="full" aria-labelledby={titleId}>
        <SettingsShell settings={settings} titleId={titleId} />
      </DialogContent>
    </Dialog>
  );
}

/** A setting that's on or off. */
const switchRow = (id: string, label: string, hint: string, on = false) => (
  <SettingsRow key={id} label={label} htmlFor={id} hint={hint}>
    <Switch id={id} aria-describedby={`${id}-hint`} defaultChecked={on} />
  </SettingsRow>
);

/** A setting that's one of a few. */
const selectRow = (id: string, label: string, options: [string, string][], value: string, hint?: string) => (
  <SettingsRow key={id} label={label} htmlFor={id} hint={hint}>
    <Select id={id} defaultValue={value} aria-describedby={hint ? `${id}-hint` : undefined}>
      {options.map(([v, text]) => (
        <option key={v} value={v}>
          {text}
        </option>
      ))}
    </Select>
  </SettingsRow>
);

/** A shortcut, recorded. */
function ShortcutRow({ id, label, initial }: { id: string; label: string; initial: string | null }) {
  const [keys, setKeys] = useState(initial);
  return (
    <SettingsRow label={label}>
      <ShortcutRecorder id={id} label={label} value={keys} onValueChange={setKeys} />
    </SettingsRow>
  );
}

interface AppFrameProps {
  brand: { name: string; icon: IconData; iconName: IconName; href: string };
  /** Sidebar groups. The bottom nav shows `tabs` of these (same labels, icons and order). */
  groups: { label: string; items: Destination[] }[];
  /** hrefs of the destinations in the bottom nav, three to five. With more destinations than tabs, a "More" tab opens the sidebar. */
  tabs: string[];
  /** The href of the page you're on. */
  current: string;
  /** Phone bar actions (search, account). */
  barActions?: ReactNode;
  /** Sidebar footer: the account, help. */
  footer: ReactNode;
  /** The app's settings. A #settings destination opens them; without one, a Settings link in the footer and a button in the phone bar do. */
  settings: AppSettings;
  mainClassName?: string;
  children: ReactNode;
}

/** One app frame for every app: sidebar on wide screens; below 48rem a bar with the brand and a bottom nav. */
function AppFrame({ brand, groups, tabs, current, barActions, footer, settings, mainClassName, children }: AppFrameProps) {
  const [settingsOpen, setSettingsOpen] = useState(settings.defaultOpen ?? false);
  const openSettings = (event: MouseEvent) => {
    event.preventDefault();
    setSettingsOpen(true);
  };
  const all = groups.flatMap((g) => g.items);
  const hasSettings = all.some((d) => d.href === "#settings");
  const onDestination = (href: string) => (href === "#settings" ? openSettings : undefined);
  const tabItems = tabs.map((href) => all.find((d) => d.href === href)).filter((d) => d !== undefined);
  const more = all.length > tabItems.length;
  const brandLink = (
    <AppShellBrand href={brand.href}>
      <Icon icon={brand.icon} name={brand.iconName} />
      {brand.name}
    </AppShellBrand>
  );
  return (
    <AppShell className="pv-app">
      <AppShellBar>
        {brandLink}
        {barActions}
        {hasSettings ? null : (
          <Button variant="ghost" size="icon" aria-label="Settings" aria-haspopup="dialog" onClick={openSettings}>
            <Icon icon={Settings01Icon} name="settings" />
          </Button>
        )}
      </AppShellBar>
      <AppShellSidebar>
        {brandLink}
        <AppShellNav aria-label={brand.name}>
          {groups.map((g) => (
            <AppShellGroup key={g.label} label={g.label}>
              {g.items.map((d) => (
                <AppShellItem key={d.href}>
                  <AppShellLink href={d.href} current={d.href === current} onClick={onDestination(d.href)}>
                    <Icon icon={d.icon} name={d.iconName} />
                    {d.label}
                  </AppShellLink>
                </AppShellItem>
              ))}
            </AppShellGroup>
          ))}
        </AppShellNav>
        <AppShellFooter>
          {hasSettings ? null : (
            <AppShellLink href="#settings" onClick={openSettings}>
              <Icon icon={Settings01Icon} name="settings" />
              Settings
            </AppShellLink>
          )}
          {footer}
        </AppShellFooter>
      </AppShellSidebar>
      <AppShellMain className={mainClassName}>{children}</AppShellMain>
      <BottomNav aria-label={brand.name}>
        {tabItems.map((d) => (
          <BottomNavLink key={d.href} href={d.href} icon={<Icon icon={d.icon} name={d.iconName} />} current={d.href === current} onClick={onDestination(d.href)}>
            {d.label}
          </BottomNavLink>
        ))}
        {more ? (
          <BottomNavButton className="ayy-app-shell__toggle" icon={<Icon icon={MoreHorizontalIcon} name="ellipsis" />}>
            More
          </BottomNavButton>
        ) : null}
      </BottomNav>
      <SettingsDialog settings={settings} open={settingsOpen} onOpenChange={setSettingsOpen} />
    </AppShell>
  );
}

const searchButton = (label: string) => (
  <Button variant="ghost" size="icon" aria-label={label}>
    <Icon icon={Search01Icon} name="search" />
  </Button>
);

/** The account as a sidebar row, so the avatar lines up with the icons above it. */
const account = (name: string) => (
  <AppShellLink href="#account">
    <Avatar name={name} size="sm" />
    {name}
  </AppShellLink>
);

/* ---- 1. Analytics dashboard ---- */

/* Thirty days of visitors, this period and the one before. Made up, but every number on the page is computed from them. */
const DAYS = Array.from({ length: 30 }, (_, i) => `Sep ${i + 1}`);
const daily = (base: number, i: number) => Math.round(base + 11 * i + 170 * Math.sin(i / 2.3) - (i % 7 === 5 || i % 7 === 6 ? 280 : 0));
const VISITORS = DAYS.map((_, i) => daily(1560, i));
const VISITORS_BEFORE = DAYS.map((_, i) => daily(1390, i));
const total = (list: number[]) => list.reduce((a, b) => a + b, 0);
const compactNumber = new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 });
const percentChange = (now: number, before: number) => `${now >= before ? "+" : "−"}${Math.abs((now / before - 1) * 100).toFixed(1)}%`;

const KPIS = [
  { label: "Visitors", value: compactNumber.format(total(VISITORS)), change: percentChange(total(VISITORS), total(VISITORS_BEFORE)), up: true, trend: VISITORS },
  { label: "Conversion rate", value: "3.8", unit: "%", change: "+0.6 pt", up: true, trend: [3.1, 3.2, 3.2, 3.4, 3.3, 3.5, 3.6, 3.5, 3.7, 3.8] },
  { label: "Revenue", value: "$92.4K", change: "+8.1%", up: true, trend: [71, 74, 73, 78, 80, 79, 84, 86, 89, 92.4] },
  { label: "Avg. session", value: "4m 12s", change: "−9s", up: false, trend: [268, 266, 267, 262, 264, 259, 258, 255, 254, 252] },
];

/** Where the visitors came from: the shares add up to the Visitors KPI. */
const SOURCES = [
  { label: "Search", share: 0.39 },
  { label: "Direct", share: 0.26 },
  { label: "Social", share: 0.16 },
  { label: "Referral", share: 0.11 },
  { label: "Email", share: 0.08 },
].map((s) => ({ label: s.label, value: Math.round(total(VISITORS) * s.share) }));

const PAGES = [
  { path: "/pricing", views: 12480, share: 26, status: "Trending", variant: "success" },
  { path: "/blog/design-tokens", views: 9214, share: 19, status: "New", variant: "info" },
  { path: "/", views: 8902, share: 18, status: "Steady", variant: "muted" },
  { path: "/docs/install", views: 6377, share: 13, status: "Steady", variant: "muted" },
  { path: "/changelog", views: 2105, share: 4, status: "Dropping", variant: "warning" },
] as const;

const GOALS = [
  { label: "Quarterly signups", value: 82, note: "8,200 of 10,000", variant: "success" },
  { label: "Trial to paid", value: 54, note: "54% of target", variant: "default" },
  { label: "Churn budget used", value: 71, note: "Watch this one", variant: "warning" },
] as const;

const PULSE_SETTINGS: AppSettings = {
  groups: [
    {
      label: "Account",
      sections: [
        {
          href: "#pl-profile",
          label: "Profile",
          icon: UserCircleIcon, iconName: "circle-user",
          content: (
            <>
              <Settings title="Your details">
                <SettingsRow label="Name" htmlFor="pl-name">
                  <Input id="pl-name" defaultValue="Maya Chen" autoComplete="name" />
                </SettingsRow>
                <SettingsRow label="Email" htmlFor="pl-email" hint="Reports and alerts go here.">
                  <Input id="pl-email" type="email" defaultValue="maya@pulse.dev" autoComplete="email" aria-describedby="pl-email-hint" />
                </SettingsRow>
              </Settings>
              <Settings title="Sign-in">
                {switchRow("pl-2fa", "Two-factor authentication", "A code from your authenticator app at every sign-in.", true)}
                <SettingsLink href="#pl-sessions" label="Active sessions" value="3 devices" />
              </Settings>
            </>
          ),
        },
        {
          href: "#pl-preferences",
          label: "Preferences",
          icon: PaintBoardIcon, iconName: "palette",
          content: (
            <>
              <Settings title="Appearance">
                {selectRow("pl-theme", "Theme", [["system", "Match the system"], ["dark", "Dark"], ["light", "Light"]], "dark")}
                {switchRow("pl-dense", "Compact tables", "More rows on screen, smaller type.", true)}
              </Settings>
              <Settings title="Charts">
                {selectRow("pl-range", "Default date range", [["7d", "Last 7 days"], ["30d", "Last 30 days"], ["90d", "Last 90 days"]], "30d")}
                {switchRow("pl-compare", "Compare to the previous period", "A dashed line for the period before.", true)}
              </Settings>
            </>
          ),
        },
        {
          href: "#pl-notifications",
          label: "Notifications",
          icon: Notification01Icon, iconName: "bell",
          content: (
            <Settings title="Email me" description="Alerts go to maya@pulse.dev.">
              {switchRow("pl-weekly", "Weekly report", "Traffic, revenue and top pages, every Monday.", true)}
              {switchRow("pl-spike", "Traffic spikes", "When visitors jump 50% above the usual for that hour.", true)}
              {switchRow("pl-goal", "Goal reached", "The day a goal hits its target.")}
            </Settings>
          ),
        },
      ],
    },
    {
      label: "Workspace",
      sections: [
        {
          href: "#pl-general",
          label: "General",
          icon: Settings01Icon, iconName: "settings",
          content: (
            <Settings title="Workspace">
              <SettingsRow label="Name" htmlFor="pl-workspace">
                <Input id="pl-workspace" defaultValue="Northwind" />
              </SettingsRow>
              {selectRow("pl-tz", "Time zone", [["utc", "UTC"], ["ny", "New York (UTC−4)"], ["ber", "Berlin (UTC+2)"]], "ber", "Days in reports start at midnight here.")}
              {selectRow("pl-currency", "Currency", [["usd", "US dollar"], ["eur", "Euro"], ["gbp", "Pound sterling"]], "eur")}
            </Settings>
          ),
        },
        {
          href: "#pl-data",
          label: "Data",
          icon: Shield01Icon, iconName: "shield",
          content: (
            <>
              <Settings title="Collection">
                {switchRow("pl-bots", "Exclude bots", "Leave known crawlers out of every report.", true)}
                {switchRow("pl-self", "Ignore my visits", "Visits from this browser aren't counted.")}
                {selectRow("pl-keep", "Keep raw events for", [["6", "6 months"], ["14", "14 months"], ["26", "26 months"]], "14")}
              </Settings>
              <Settings>
                <SettingsLink label="Delete all data" hint="Every event and report in Northwind. This can't be undone." destructive />
              </Settings>
            </>
          ),
        },
      ],
    },
  ],
};

function DashboardApp() {
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<SortDirection>("descending");
  const pages = [...PAGES].sort((a, b) => compareValues(a.views, b.views, sort));
  return (
    <AppFrame
      brand={{ name: "Pulse", icon: ChartLineData01Icon, iconName: "chart-line", href: "#overview" }}
      groups={[
        {
          label: "Workspace",
          items: [
            { href: "#overview", label: "Overview", icon: DashboardSquare01Icon, iconName: "layout-dashboard" },
            { href: "#reports", label: "Reports", icon: Analytics01Icon, iconName: "bar-chart" },
            { href: "#audiences", label: "Audiences", icon: UserGroupIcon, iconName: "users-group" },
            { href: "#projects", label: "Projects", icon: Folder01Icon, iconName: "folder" },
          ],
        },
        {
          label: "Account",
          items: [
            { href: "#integrations", label: "Integrations", icon: Link01Icon, iconName: "link" },
            { href: "#billing", label: "Billing", icon: CreditCardIcon, iconName: "credit-card" },
            { href: "#settings", label: "Settings", icon: Settings01Icon, iconName: "settings" },
          ],
        },
      ]}
      tabs={["#overview", "#reports", "#audiences", "#projects"]}
      current="#overview"
      barActions={searchButton("Search")}
      footer={account("Maya Chen")}
      settings={PULSE_SETTINGS}
    >
      <div className="ayy-stack" style={gap(5)}>
        <PageHeader>
          <PageHeaderTitle>Overview</PageHeaderTitle>
          <PageHeaderDescription>
            <span className="ayy-cluster" style={gap(2)}>
              <StatusDot variant="success" pulse />
              214 people on your sites right now
            </span>
          </PageHeaderDescription>
          <PageHeaderActions>
            <SegmentedControl size="sm" aria-label="Date range" defaultValue="30d">
              <SegmentedControlItem value="7d">7d</SegmentedControlItem>
              <SegmentedControlItem value="30d">30d</SegmentedControlItem>
              <SegmentedControlItem value="90d">90d</SegmentedControlItem>
            </SegmentedControl>
            <Button size="sm" variant="outline">
              <Icon icon={Download01Icon} name="download" />
              Export
            </Button>
          </PageHeaderActions>
        </PageHeader>

        <div className="ayy-grid" style={{ ...min("11rem"), ...gap(3) }}>
          {KPIS.map((k) => (
            <Card key={k.label}>
              <CardContent>
                <div className="ayy-stack" style={gap(2)}>
                  <Stat labelFirst size="sm" label={k.label} value={k.value} unit={k.unit} />
                  <div className="ayy-spread">
                    <Badge variant={k.up ? "success" : "warning"} dot>
                      {k.change}
                    </Badge>
                    <Sparkline values={k.trend} area color={k.up ? undefined : "var(--ayy-color-warning)"} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <div className="ayy-spread" style={{ inlineSize: "100%" }}>
              <CardTitle>Visitors</CardTitle>
              <span className="ayy-muted">September, against August</span>
            </div>
          </CardHeader>
          <CardContent>
            <LineChart
              label="Visitors per day in September, against the same days in August"
              labels={DAYS}
              height="11rem"
              series={[
                { name: "September", values: VISITORS },
                { name: "August", values: VISITORS_BEFORE, compare: true },
              ]}
            />
          </CardContent>
        </Card>

        <div className="ayy-split" style={min("18rem")}>
          <Card>
            <CardHeader>
              <CardTitle>Top pages</CardTitle>
              <CardDescription>By views in the selected range.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table compact>
                <TableHeader>
                  <TableRow>
                    <TableHead>Page</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead numeric sort={sort} onSort={() => setSort(nextSortDirection(sort))}>
                      Views
                    </TableHead>
                    <TableHead numeric>Share</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pages.map((p) => (
                    <TableRow key={p.path}>
                      <TableCell>
                        <span className="ayy-mono">{p.path}</span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={p.variant}>{p.status}</Badge>
                      </TableCell>
                      <TableCell numeric>{p.views.toLocaleString("en-US")}</TableCell>
                      <TableCell numeric>{p.share}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter>
              <div className="ayy-spread" style={{ inlineSize: "100%" }}>
                <span className="ayy-muted">
                  {(page - 1) * 5 + 1}–{page * 5} of 48 pages
                </span>
                <Pagination page={page} count={10} onPageChange={setPage} />
              </div>
            </CardFooter>
          </Card>

          <div className="ayy-stack" style={gap(4)}>
            <Card>
              <CardHeader>
                <div className="ayy-spread" style={{ inlineSize: "100%" }}>
                  <CardTitle>Traffic sources</CardTitle>
                  <span className="ayy-muted">Visitors</span>
                </div>
              </CardHeader>
              <CardContent>
                <BarList items={SOURCES} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Goals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="ayy-stack" style={gap(4)}>
                  {GOALS.map((g) => (
                    <div key={g.label} className="ayy-stack" style={gap(2)}>
                      <div className="ayy-spread">
                        <span>{g.label}</span>
                        <span className="ayy-muted">{g.note}</span>
                      </div>
                      <Progress value={g.value} variant={g.variant} aria-label={g.label} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Alert variant="info">
              <Icon icon={ChartIncreaseIcon} name="trending-up" />
              <AlertTitle>/blog/design-tokens is taking off</AlertTitle>
              <AlertDescription>Up 340% in the last hour, mostly from news.ycombinator.com.</AlertDescription>
              <AlertActions>
                <Button size="sm" variant="outline">
                  See referrers
                </Button>
              </AlertActions>
            </Alert>
          </div>
        </div>
      </div>
    </AppFrame>
  );
}

/* ---- 2. Marketing site ---- */

const FEATURES = [
  { icon: FlashIcon, iconName: "zap" as const, color: "var(--ayy-accent-marketing)", title: "Ship in an afternoon", text: "Start from a sentence or a template, connect your CMS, publish. No build pipeline to babysit." },
  { icon: Shield01Icon, iconName: "shield" as const, color: "var(--ayy-accent-system)", title: "Secure by default", text: "SSO, audit logs and per-project roles on every plan, not just the expensive one." },
  { icon: GlobeIcon, iconName: "earth" as const, color: "var(--ayy-accent-product)", title: "Fast everywhere", text: "Pages are served from 40 regions, so the first byte arrives before anyone notices." },
];

const PLANS = [
  { name: "Starter", monthly: 0, text: "For side projects and trying things out.", perks: ["1 project", "Community support"] },
  { name: "Team", monthly: 24, text: "For teams shipping every week.", perks: ["Unlimited projects", "Roles and SSO", "Priority support"], featured: true },
  { name: "Scale", monthly: 99, text: "For companies with real traffic.", perks: ["Everything in Team", "99.99% uptime SLA"] },
];

const QUOTES = [
  { name: "Ana Ruiz", role: "CTO, Fieldnote", text: "We moved four marketing sites over in a week. Nobody on the team wants to go back." },
  { name: "Leo Park", role: "Founder, Small Press", text: "The first tool where our designer and our engineers agree on what 'done' looks like." },
  { name: "Sam Okafor", role: "Head of Growth, Loop", text: "Launch pages used to take a sprint. Now they take an afternoon and a coffee." },
  { name: "Priya Nair", role: "Engineer, Orbit", text: "Dark mode, RTL and keyboard support were there before we thought to ask." },
];

const FAQ = [
  { q: "Can I cancel any time?", a: "Yes. Your plan runs to the end of the billing period, then your sites switch to read-only. Nothing is deleted for 90 days." },
  { q: "Do viewers need a paid seat?", a: "No. Only people who edit pages count as editors. Viewers and commenters are free on every plan." },
  { q: "Can I bring my own domain?", a: "On every plan, including Starter. HTTPS certificates are issued and renewed for you." },
];

function LandingApp() {
  const [cycle, setCycle] = useState("yearly");
  const price = (monthly: number) => (cycle === "yearly" ? Math.round(monthly * 0.8) : monthly);
  return (
    <div className="pv-app pv-app--page">
      <a className="ayy-skip-link" href="#nw-main">
        Skip to content
      </a>
      <Navbar>
        <NavbarBrand href="#top">
          <Icon icon={Layers01Icon} name="layers" />
          Northwind
        </NavbarBrand>
        <NavbarNav>
          <NavbarLink href="#product" current>
            Product
          </NavbarLink>
          <NavbarLink href="#pricing">Pricing</NavbarLink>
          <NavbarLink href="#customers">Customers</NavbarLink>
          <NavbarLink href="#faq">FAQ</NavbarLink>
        </NavbarNav>
        <NavbarActions>
          <a className={buttonClass({ size: "sm" })} href="#start">
            Start free
          </a>
        </NavbarActions>
        <NavbarToggle />
      </Navbar>

      <main id="nw-main">
        <section className="ayy-container ayy-bg-grid" style={{ paddingBlock: "var(--ayy-space-20)" }} aria-labelledby="nw-hero">
          <header className="ayy-stack" style={{ alignItems: "center", gap: "var(--ayy-space-4)", maxInlineSize: "var(--ayy-size-measure)", marginInline: "auto", textAlign: "center" }}>
            <Badge variant="ai">New · AI page builder</Badge>
            <h1 className="ayy-h1" id="nw-hero">
              Describe it. Northwind builds the page.
            </h1>
            <p className="ayy-lede">One sentence in, a fast, accessible site out. Edit it together, then publish to your own domain.</p>
            <div className="ayy-cluster">
              <a className={buttonClass({ size: "lg" })} href="#start">
                Start building free
              </a>
              <a className={buttonClass({ size: "lg", variant: "outline" })} href="#demo">
                <Icon icon={PlayIcon} name="play" />
                Watch the 2-minute demo
              </a>
            </div>
          </header>

          <Card style={{ maxInlineSize: "44rem", marginInline: "auto", marginBlockStart: "var(--ayy-space-12)" }}>
            <CardHeader>
              <div className="ayy-spread" style={{ inlineSize: "100%" }}>
                <span className="ayy-cluster" style={gap(2)}>
                  <StatusDot variant="success" pulse />
                  <span className="ayy-mono ayy-small">ceramica-porto.northwind.site</span>
                </span>
                <Badge variant="muted">Building · 0:38</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="ayy-stack" style={gap(4)}>
                <InputGroup>
                  <Icon icon={SparklesIcon} name="sparkles" />
                  <Input readOnly aria-label="Prompt" defaultValue="A launch page for a ceramics studio in Porto. Warm, quiet, lots of photos." />
                </InputGroup>
                <List compact aria-label="What Northwind is doing">
                  {[
                    { text: "Picked a palette from your logo: clay, cream and ink", done: true },
                    { text: "Wrote six sections: hero, collection, studio, classes, press, visit", done: true },
                    { text: "Checking contrast, alt text and keyboard order", done: false },
                  ].map((step) => (
                    <ListItem key={step.text}>
                      {step.done ? <Icon icon={CheckmarkCircle02Icon} name="circle-check" /> : <Spinner size="sm" label="" />}
                      <ListContent>{step.done ? <ListDescription>{step.text}</ListDescription> : <ListTitle>{step.text}</ListTitle>}</ListContent>
                    </ListItem>
                  ))}
                </List>
                <Progress value={82} aria-label="Building the page" />
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="ayy-container" style={{ paddingBlock: "var(--ayy-space-12)" }} aria-labelledby="nw-proof">
          <h2 className="ayy-eyebrow" id="nw-proof" style={{ textAlign: "center", marginBlockEnd: "var(--ayy-space-6)" }}>
            4,000 teams launch with Northwind
          </h2>
          <ul className="ayy-cluster" style={{ ...gap(10), justifyContent: "center", listStyle: "none", padding: 0, margin: 0 }}>
            {["Fieldnote", "Small Press", "Loop", "Kestrel", "Halcyon", "Mapleworks"].map((name) => (
              <li key={name} className="ayy-h5 ayy-muted">
                {name}
              </li>
            ))}
          </ul>
          <div className="ayy-grid" style={{ ...min("12rem"), ...gap(4), marginBlockStart: "var(--ayy-space-12)" }}>
            {[
              { label: "Median first load", value: "0.4", unit: "s" },
              { label: "Lighthouse accessibility", value: "100" },
              { label: "Sites live today", value: "12,480" },
            ].map((stat) => (
              <Card key={stat.label}>
                <CardContent>
                  <Stat labelFirst label={stat.label} value={stat.value} unit={stat.unit} />
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="ayy-container" id="product" style={{ paddingBlock: "var(--ayy-space-24)" }} aria-labelledby="nw-features">
          <header className="ayy-stack" style={{ gap: "var(--ayy-space-2)", marginBlockEnd: "var(--ayy-space-8)" }}>
            <p className="ayy-eyebrow">Why Northwind</p>
            <h2 className="ayy-h2" id="nw-features">Everything a launch needs</h2>
          </header>
          <div className="ayy-grid" style={min("15rem")}>
            {FEATURES.map((f) => (
              <Card key={f.title}>
                <CardHeader>
                  <IconTile spotColor={f.color}>
                    <Icon icon={f.icon} name={f.iconName} />
                  </IconTile>
                  <CardTitle>{f.title}</CardTitle>
                  <CardDescription>{f.text}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        <section className="ayy-container" id="pricing" style={{ paddingBlock: "var(--ayy-space-24)" }} aria-labelledby="nw-pricing">
          <header className="ayy-stack" style={{ gap: "var(--ayy-space-2)", marginBlockEnd: "var(--ayy-space-8)" }}>
            <p className="ayy-eyebrow">Pricing</p>
            <h2 className="ayy-h2" id="nw-pricing">Simple plans that grow with you</h2>
            <p className="ayy-muted">Per editor, per month. Viewers are always free.</p>
            <SegmentedControl aria-label="Billing cycle" value={cycle} onValueChange={setCycle}>
              <SegmentedControlItem value="monthly">Monthly</SegmentedControlItem>
              <SegmentedControlItem value="yearly">Yearly · save 20%</SegmentedControlItem>
            </SegmentedControl>
          </header>
          <div className="ayy-grid" style={min("15rem")}>
            {PLANS.map((p) => (
              <Card key={p.name} featured={p.featured}>
                <CardHeader>
                  <div className="ayy-spread">
                    <CardTitle>{p.name}</CardTitle>
                    {p.featured ? <Badge>Most popular</Badge> : null}
                  </div>
                  <Stat value={`$${price(p.monthly)}`} unit="/ month" />
                  <CardDescription>{p.text}</CardDescription>
                </CardHeader>
                <CardContent>
                  <List compact aria-label={`${p.name} includes`}>
                    {p.perks.map((perk) => (
                      <ListItem key={perk}>
                        <Icon icon={CheckmarkCircle02Icon} name="circle-check" />
                        {perk}
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
                <CardFooter>
                  <a className={buttonClass({ variant: p.featured ? undefined : "outline", block: true })} href="#start">
                    Choose {p.name}
                  </a>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>

        <section className="ayy-container" id="customers" style={{ paddingBlock: "var(--ayy-space-24)" }} aria-labelledby="nw-customers">
          <header className="ayy-stack" style={{ gap: "var(--ayy-space-2)", marginBlockEnd: "var(--ayy-space-8)" }}>
            <p className="ayy-eyebrow">Customers</p>
            <h2 className="ayy-h2" id="nw-customers">Teams that switched</h2>
          </header>
          <Carousel label="Customer quotes" slideWidth="18rem">
            {QUOTES.map((q) => (
              <CarouselSlide key={q.name}>
                <Card>
                  <CardContent>
                    <div className="ayy-stack" style={gap(4)}>
                      <p>“{q.text}”</p>
                      <div className="ayy-cluster">
                        <Avatar name={q.name} size="sm" />
                        <div className="ayy-stack" style={gap(0)}>
                          <p>{q.name}</p>
                          <p className="ayy-muted">{q.role}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CarouselSlide>
            ))}
          </Carousel>
        </section>

        <section className="ayy-container" id="faq" style={{ paddingBlock: "var(--ayy-space-24)" }} aria-labelledby="nw-faq">
          <header className="ayy-stack" style={{ gap: "var(--ayy-space-2)", marginBlockEnd: "var(--ayy-space-8)" }}>
            <p className="ayy-eyebrow">FAQ</p>
            <h2 className="ayy-h2" id="nw-faq">Questions, answered</h2>
          </header>
          <Accordion single>
            {FAQ.map((f, i) => (
              <AccordionItem key={f.q} label={f.q} open={i === 0}>
                <p>{f.a}</p>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        <section className="ayy-container" id="start" style={{ paddingBlock: "var(--ayy-space-24)", textAlign: "center" }} aria-labelledby="nw-start">
          <header className="ayy-stack" style={{ alignItems: "center", gap: "var(--ayy-space-3)", maxInlineSize: "var(--ayy-size-measure)", marginInline: "auto" }}>
            <h2 className="ayy-h2" id="nw-start">Your next launch, this afternoon</h2>
            <p className="ayy-muted">Free for your first project. No card needed.</p>
            <form className="ayy-cluster" onSubmit={(e) => e.preventDefault()}>
              <InputGroup size="lg" style={{ inlineSize: "18rem" }}>
                <Icon icon={Mail01Icon} name="mail" />
                <Input type="email" placeholder="you@company.com" aria-label="Work email" autoComplete="email" required />
              </InputGroup>
              <Button type="submit" size="lg">
                Get started
              </Button>
            </form>
          </header>
        </section>
      </main>

      <Footer>
        <FooterBrand>
          <a href="#top">
            <Icon icon={Layers01Icon} name="layers" />
            Northwind
          </a>
          <p>Fast, accessible sites from a sentence.</p>
        </FooterBrand>
        <FooterNav>
          <FooterGroup label="Product">
            <FooterLink href="#product">Features</FooterLink>
            <FooterLink href="#pricing">Pricing</FooterLink>
            <FooterLink href="#changelog">Changelog</FooterLink>
          </FooterGroup>
          <FooterGroup label="Company">
            <FooterLink href="#about">About</FooterLink>
            <FooterLink href="#careers">Careers</FooterLink>
          </FooterGroup>
          <FooterGroup label="Help">
            <FooterLink href="#docs">Docs</FooterLink>
            <FooterLink href="#status">Status</FooterLink>
          </FooterGroup>
        </FooterNav>
        <FooterBottom>
          <p>© 2026 Northwind Labs</p>
          <div className="ayy-cluster">
            <a className="ayy-link" href="#privacy">
              Privacy
            </a>
            <a className="ayy-link" href="#terms">
              Terms
            </a>
          </div>
        </FooterBottom>
      </Footer>
    </div>
  );
}

/* ---- 3. Dating app: one profile at a time, new matches beside it ---- */

const PEOPLE = [
  { id: "maria", name: "Maria", age: 31, place: "Graça", distance: "2 km", job: "Ceramicist", prompt: "A perfect Sunday: a long lunch, then getting lost in a bookshop until it closes.", likes: ["Natural wine", "Bouldering", "Fado", "Film cameras"] },
  { id: "joao", name: "João", age: 34, place: "Alcântara", distance: "5 km", job: "Architect", prompt: "I'll judge you a little for your coffee order, then make you a better one.", likes: ["Cycling", "Jazz", "Cooking"] },
] as const;

const MATCHES = [
  { id: "ines", name: "Inês", text: "Ok but which tasca? I need names.", time: "2m", online: true, unread: true },
  { id: "tiago", name: "Tiago", text: "You: The photo with the dog is unfair", time: "1h", online: true, unread: false },
  { id: "clara", name: "Clara", text: "Thursday works! 19:30 at the miradouro?", time: "3h", online: false, unread: true },
  { id: "rui", name: "Rui", text: "New match. Say hello", time: "Yesterday", online: false, unread: false },
] as const;

const KINDRED_SETTINGS: AppSettings = {
  groups: [
    {
      label: "Account",
      sections: [
        {
          href: "#kd-profile",
          label: "Profile",
          icon: UserCircleIcon, iconName: "circle-user",
          content: (
            <Settings title="About you" description="People see this on your profile.">
              <SettingsRow label="First name" htmlFor="kd-name">
                <Input id="kd-name" defaultValue="Dani" autoComplete="given-name" />
              </SettingsRow>
              <SettingsRow label="Prompt" htmlFor="kd-prompt" hint="One line that starts a conversation." stack>
                <Textarea id="kd-prompt" rows={2} defaultValue="Ask me about the worst restaurant I've ever loved." aria-describedby="kd-prompt-hint" />
              </SettingsRow>
            </Settings>
          ),
        },
        {
          href: "#kd-notifications",
          label: "Notifications",
          icon: Notification01Icon, iconName: "bell",
          content: (
            <Settings title="Tell me when">
              {switchRow("kd-match", "Someone matches with me", "Right away, with their first photo.", true)}
              {switchRow("kd-message", "I get a message", "From people I've matched with.", true)}
              {switchRow("kd-daily", "My daily picks are ready", "Once a day, at 18:00.")}
            </Settings>
          ),
        },
      ],
    },
    {
      label: "Dating",
      sections: [
        {
          href: "#kd-preferences",
          label: "Preferences",
          icon: SlidersHorizontalIcon, iconName: "sliders-horizontal",
          content: (
            <Settings title="Show me">
              {selectRow("kd-who", "Interested in", [["women", "Women"], ["men", "Men"], ["everyone", "Everyone"]], "everyone")}
              {selectRow("kd-age", "Ages", [["25", "25 to 35"], ["28", "28 to 40"], ["35", "35 to 50"]], "28")}
              {selectRow("kd-distance", "Within", [["5", "5 km"], ["15", "15 km"], ["50", "50 km"]], "15")}
            </Settings>
          ),
        },
        {
          href: "#kd-privacy",
          label: "Privacy",
          icon: LockIcon, iconName: "lock",
          content: (
            <>
              <Settings title="Visibility">
                {switchRow("kd-discover", "Show me in Discover", "Turn off to only talk to people you've matched with.", true)}
                {switchRow("kd-receipts", "Read receipts", "Matches see when you've read their message.")}
              </Settings>
              <Settings>
                <SettingsLink label="Pause my account" hint="Your profile is hidden; your matches stay." destructive />
              </Settings>
            </>
          ),
        },
      ],
    },
  ],
};

function DatingApp() {
  const [index, setIndex] = useState(0);
  const person = PEOPLE[index % PEOPLE.length];
  const next = (liked: boolean) => {
    if (liked) toast.success(`You liked ${person.name}. If it's mutual, you'll match.`);
    setIndex((i) => i + 1);
  };
  return (
    <AppFrame
      brand={{ name: "Kindred", icon: Flower01Icon, iconName: "flower", href: "#discover" }}
      groups={[
        {
          label: "Kindred",
          items: [
            { href: "#discover", label: "Discover", icon: Flower01Icon, iconName: "flower" },
            { href: "#matches", label: "Matches", icon: UserMultipleIcon, iconName: "users" },
            { href: "#messages", label: "Messages", icon: Message01Icon, iconName: "message-circle" },
            { href: "#profile", label: "Profile", icon: UserCircleIcon, iconName: "circle-user" },
          ],
        },
      ]}
      tabs={["#discover", "#matches", "#messages", "#profile"]}
      current="#discover"
      footer={account("Dani Tesler")}
      settings={KINDRED_SETTINGS}
    >
      <div className="ayy-stack" style={gap(5)}>
        <PageHeader>
          <PageHeaderTitle>Discover</PageHeaderTitle>
          <PageHeaderDescription>12 new people near Lisbon today.</PageHeaderDescription>
          <PageHeaderActions>
            <Button size="sm" variant="outline">
              <Icon icon={SlidersHorizontalIcon} name="sliders-horizontal" />
              Filters
            </Button>
          </PageHeaderActions>
        </PageHeader>

        <div className="ayy-split" style={min("18rem")}>
          <Card>
            <CardMedia>
              <div className="pv-app-portrait" aria-hidden="true">
                <span className="pv-app-portrait__initial">{person.name[0]}</span>
              </div>
            </CardMedia>
            <CardHeader>
              <div className="ayy-spread" style={{ inlineSize: "100%" }}>
                <h2 className="ayy-h3" id="kd-person">
                  {person.name}, {person.age}
                </h2>
                <Badge variant="success" dot>
                  Active today
                </Badge>
              </div>
              <CardDescription>
                <span className="ayy-cluster" style={gap(2)}>
                  <Icon icon={Location01Icon} name="map-pin" />
                  {person.place}, {person.distance} away · {person.job}
                </span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="ayy-stack" style={gap(4)}>
                <blockquote className="ayy-lede" style={{ margin: 0 }}>
                  “{person.prompt}”
                </blockquote>
                <ul className="ayy-cluster" style={{ ...gap(2), listStyle: "none", padding: 0, margin: 0 }} aria-label={`${person.name} likes`}>
                  {person.likes.map((like) => (
                    <li key={like}>
                      <Badge variant="outline">{like}</Badge>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
            <CardFooter>
              <div className="ayy-cluster" style={{ inlineSize: "100%", justifyContent: "center" }}>
                <Button size="lg" variant="outline" onClick={() => next(false)}>
                  <Icon icon={Cancel01Icon} name="x" />
                  Pass
                </Button>
                <Button size="lg" onClick={() => next(true)}>
                  <Icon icon={SmileIcon} name="smile" />
                  Like
                </Button>
              </div>
            </CardFooter>
          </Card>

          <div className="ayy-stack" style={gap(4)}>
            <Card>
              <CardHeader>
                <div className="ayy-spread" style={{ inlineSize: "100%" }}>
                  <CardTitle>New matches</CardTitle>
                  <Badge>2 unread</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <List aria-label="Matches">
                  {MATCHES.map((m) => (
                    <ListItem key={m.id}>
                      <Avatar name={m.name} size="sm" />
                      <ListContent>
                        <ListTitle>
                          <ListLink href={`#${m.id}`}>{m.name}</ListLink>
                        </ListTitle>
                        <ListDescription className="ayy-truncate">{m.text}</ListDescription>
                      </ListContent>
                      <ListMeta>
                        <span className="ayy-cluster" style={gap(2)}>
                          {m.unread ? <StatusDot variant="info" label="Unread" /> : null}
                          {m.time}
                        </span>
                      </ListMeta>
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Your profile</CardTitle>
                <CardDescription>Profiles with a voice prompt get twice the replies.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="ayy-stack" style={gap(2)}>
                  <div className="ayy-spread">
                    <span>Complete</span>
                    <span className="ayy-muted">80%</span>
                  </div>
                  <Progress value={80} aria-label="Profile complete" />
                </div>
              </CardContent>
              <CardFooter>
                <Button size="sm" variant="outline">
                  Add a voice prompt
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </AppFrame>
  );
}

/* ---- 4. Project tracker: onboarding, and the empty, loading and error states ---- */

const TASKS = [
  { id: "t1", title: "Fix the signup email in Outlook", project: "Growth", due: "Yesterday", who: "Eli Stone", done: false, late: true, flag: "Bug" },
  { id: "t2", title: "Write the launch post for 2.4", project: "Website", due: "Today", who: "Maya Chen", done: false, flag: "High" },
  { id: "t3", title: "Review the pricing page copy with legal", project: "Website", due: "Today", who: "Ravi Shah", done: false },
  { id: "t4", title: "Record the onboarding walkthrough", project: "Product", due: "Today", who: "Noa Peretz", done: false },
  { id: "t5", title: "Reply to the Kestrel security questionnaire", project: "Growth", due: "Today", who: "Maya Chen", done: true },
  { id: "t6", title: "Plan the November release", project: "Product", due: "Fri", who: "Maya Chen", done: false },
];

const MEMBERS = [
  { name: "Maya Chen", email: "maya@orbit.so", role: "admin" },
  { name: "Ravi Shah", email: "ravi@orbit.so", role: "member" },
  { name: "Eli Stone", email: "eli@orbit.so", role: "member" },
  { name: "Noa Peretz", email: "noa@studio.co", role: "guest" },
];

const ORBIT_SETTINGS: AppSettings = {
  groups: [
    {
      label: "Account",
      sections: [
        {
          href: "#ob-preferences",
          label: "Preferences",
          icon: PaintBoardIcon, iconName: "palette",
          content: (
            <Settings title="General">
              {selectRow("ob-start", "Open on", [["tasks", "My tasks"], ["projects", "Projects"], ["calendar", "Calendar"]], "tasks")}
              {selectRow("ob-week", "Week starts on", [["0", "Sunday"], ["1", "Monday"], ["6", "Saturday"]], "1")}
              {switchRow("ob-done", "Show completed tasks", "Done tasks stay in the list, struck through, until tomorrow.")}
            </Settings>
          ),
        },
        {
          href: "#ob-notifications",
          label: "Notifications",
          icon: Notification01Icon, iconName: "bell",
          content: (
            <Settings title="Tell me when">
              {switchRow("ob-assigned", "A task is assigned to me", "In the app and by email.", true)}
              {switchRow("ob-due", "Tasks are due today", "One summary at 9:00, not one per task.", true)}
              {switchRow("ob-mention", "Someone mentions me", "In a task's comments.", true)}
              {switchRow("ob-weekly", "Weekly summary", "What the team finished, every Friday.")}
            </Settings>
          ),
        },
        {
          href: "#ob-shortcuts",
          label: "Shortcuts",
          icon: KeyboardIcon, iconName: "keyboard",
          content: (
            <Settings title="Keyboard shortcuts" description="Click a shortcut, then press the new keys.">
              <ShortcutRow id="ob-key-new" label="New task" initial="Mod+Shift+N" />
              <ShortcutRow id="ob-key-search" label="Search" initial="Mod+K" />
              <ShortcutRow id="ob-key-done" label="Mark as done" initial="Mod+Enter" />
            </Settings>
          ),
        },
      ],
    },
    {
      label: "Team",
      sections: [
        {
          href: "#ob-members",
          label: "Members",
          icon: UserGroupIcon, iconName: "users-group",
          content: (
            <>
              <Settings title="Members" description="4 of 10 seats on the Team plan.">
                {MEMBERS.map((m, i) => (
                  <SettingsRow key={m.email} label={m.name} htmlFor={`ob-role-${i}`} hint={m.email}>
                    <Select id={`ob-role-${i}`} defaultValue={m.role} aria-describedby={`ob-role-${i}-hint`}>
                      <option value="admin">Admin</option>
                      <option value="member">Member</option>
                      <option value="guest">Guest</option>
                    </Select>
                  </SettingsRow>
                ))}
              </Settings>
              <div className="ayy-cluster">
                <Button variant="outline">
                  <Icon icon={Add01Icon} name="add" />
                  Invite people
                </Button>
              </div>
            </>
          ),
        },
        {
          href: "#ob-integrations",
          label: "Integrations",
          icon: Link01Icon, iconName: "link",
          content: (
            <Settings title="Connected apps">
              <SettingsLink href="#ob-github" label="GitHub" hint="Close tasks from pull requests." value="Sync failed" />
              <SettingsLink href="#ob-slack" label="Slack" hint="Post finished tasks to #launch." value="Connected" />
              <SettingsLink href="#ob-calendar" label="Google Calendar" hint="Show due dates on your calendar." value="Not connected" />
            </Settings>
          ),
        },
      ],
    },
  ],
};

function TrackerApp() {
  const [view, setView] = useState("today");
  const [retrying, setRetrying] = useState(false);
  const retry = () => {
    setRetrying(true);
    window.setTimeout(() => setRetrying(false), 1500);
  };
  const [projects, setProjects] = useState<string[]>([]);
  const inView = view === "today" ? TASKS.filter((t) => t.due === "Today" || t.late) : view === "upcoming" ? [] : TASKS;
  const tasks = projects.length ? inView.filter((t) => projects.includes(t.project)) : inView;
  const toggleProject = (project: string) =>
    setProjects((list) => (list.includes(project) ? list.filter((p) => p !== project) : [...list, project]));
  return (
    <AppFrame
      brand={{ name: "Orbit", icon: Rocket01Icon, iconName: "rocket-launch", href: "#tasks" }}
      groups={[
        {
          label: "Work",
          items: [
            { href: "#tasks", label: "My tasks", icon: Task01Icon, iconName: "clipboard-list" },
            { href: "#projects", label: "Projects", icon: Folder01Icon, iconName: "folder" },
            { href: "#calendar", label: "Calendar", icon: Calendar03Icon, iconName: "calendar" },
            { href: "#inbox", label: "Inbox", icon: InboxIcon, iconName: "inbox" },
          ],
        },
        {
          label: "Team",
          items: [
            { href: "#members", label: "Members", icon: UserGroupIcon, iconName: "users-group" },
            { href: "#settings", label: "Settings", icon: Settings01Icon, iconName: "settings" },
          ],
        },
      ]}
      tabs={["#tasks", "#projects", "#calendar", "#inbox"]}
      current="#tasks"
      barActions={searchButton("Search tasks")}
      footer={account("Maya Chen")}
      settings={ORBIT_SETTINGS}
    >
      <div className="ayy-stack" style={gap(5)}>
        <PageHeader>
          <PageHeaderTitle>My tasks</PageHeaderTitle>
          <PageHeaderDescription>Thursday, October 30 · 4 due today, 1 overdue.</PageHeaderDescription>
          <PageHeaderActions>
            <Button aria-keyshortcuts="C">
              <Icon icon={Add01Icon} name="add" />
              New task
            </Button>
          </PageHeaderActions>
        </PageHeader>

        <Card>
          <CardHeader>
            <CardTitle>Set up your workspace</CardTitle>
            <CardDescription>Two more steps and Orbit fills your task list for you.</CardDescription>
          </CardHeader>
          <CardContent>
            <Steps steps={["Create a project", "Invite your team", "Connect GitHub"]} current={1} aria-label="Workspace setup" />
          </CardContent>
          <CardFooter>
            <Button size="sm">Invite teammates</Button>
            <Button size="sm" variant="ghost">
              Skip for now
            </Button>
          </CardFooter>
        </Card>

        <div className="ayy-split" style={min("18rem")}>
          <div className="ayy-stack" style={gap(3)}>
            <div className="ayy-spread">
              <SegmentedControl size="sm" aria-label="Show" value={view} onValueChange={setView}>
                <SegmentedControlItem value="today">Today</SegmentedControlItem>
                <SegmentedControlItem value="upcoming">Upcoming</SegmentedControlItem>
                <SegmentedControlItem value="all">All</SegmentedControlItem>
              </SegmentedControl>
              <span className="ayy-muted">
                Press <Kbd>C</Kbd> to add a task
              </span>
            </div>
            <ChipGroup aria-label="Projects" scroll>
              {["Website", "Growth", "Product"].map((project) => (
                <ChipButton
                  key={project}
                  pressed={projects.includes(project)}
                  onPressedChange={() => toggleProject(project)}
                  count={inView.filter((t) => t.project === project).length}
                >
                  {project}
                </ChipButton>
              ))}
            </ChipGroup>
            <Card>
              <CardContent>
                <div role="status">
                  {tasks.length ? (
                    <List divided aria-label="Tasks">
                      {tasks.map((t) => (
                        <ListItem key={t.id}>
                          <Checkbox id={`or-${t.id}`} defaultChecked={t.done} />
                          <ListContent>
                            <ListTitle htmlFor={`or-${t.id}`}>{t.title}</ListTitle>
                            <ListDescription>
                              {t.project} · due {t.due.toLowerCase()}
                            </ListDescription>
                          </ListContent>
                          {t.late ? (
                            <Badge variant="destructive" dot>
                              Overdue
                            </Badge>
                          ) : t.flag ? (
                            <Badge variant="warning">{t.flag}</Badge>
                          ) : null}
                          <Avatar name={t.who} size="sm" />
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    inView.length ? (
                      <EmptyState compact>
                        <EmptyStateTitle>No tasks in {projects.join(" or ")}</EmptyStateTitle>
                        <EmptyStateDescription>Nothing due in these projects for this view.</EmptyStateDescription>
                        <EmptyStateActions>
                          <Button size="sm" variant="outline" onClick={() => setProjects([])}>
                            Show every project
                          </Button>
                        </EmptyStateActions>
                      </EmptyState>
                    ) : (
                      <EmptyState compact>
                        <IconTile size="sm">
                          <Icon icon={Calendar03Icon} name="calendar" />
                        </IconTile>
                        <EmptyStateTitle>Nothing coming up</EmptyStateTitle>
                        <EmptyStateDescription>Tasks with a due date after today show up here.</EmptyStateDescription>
                        <EmptyStateActions>
                          <Button size="sm" variant="outline">
                            <Icon icon={Add01Icon} name="add" />
                            Plan a task
                          </Button>
                        </EmptyStateActions>
                      </EmptyState>
                    )
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="ayy-stack" style={gap(4)}>
            <Alert variant="destructive" role="alert">
              <Icon icon={Alert02Icon} name="triangle-alert" />
              <AlertTitle>GitHub sync failed</AlertTitle>
              <AlertDescription>We couldn't reach github.com. Your tasks are safe; new pull requests won't show up until it syncs.</AlertDescription>
              <AlertActions>
                <Button size="sm" variant="outline" loading={retrying} onClick={retry}>
                  {retrying ? null : <Icon icon={RefreshIcon} name="rotate-cw" />}
                  {retrying ? "Retrying…" : "Try again"}
                </Button>
              </AlertActions>
            </Alert>
            <Card aria-busy="true">
              <CardHeader>
                <CardTitle>Activity</CardTitle>
                <CardDescription>Loading what your team did today…</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="ayy-stack" style={gap(4)}>
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="ayy-cluster" style={gap(3)}>
                      <Skeleton shape="circle" style={{ inlineSize: "var(--ayy-size-control-sm)", blockSize: "var(--ayy-size-control-sm)" }} />
                      <div className="ayy-stack" style={{ ...gap(2), flex: 1 }}>
                        <Skeleton shape="text" style={{ inlineSize: "70%" }} />
                        <Skeleton shape="text" style={{ inlineSize: "40%" }} />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppFrame>
  );
}

/* ---- 5. Online store: this week's roast, a product grid, brew guides, a cart drawer ---- */

/* Each bag's label is its own colour, the way roasters tell origins apart on a shelf. Roast: 1 light, 2 medium, 3 dark. */
const ROASTS = [
  { id: "guji", name: "Ethiopia Guji", short: "Guji", origin: "Uraga, Guji", process: "Washed", notes: "Blueberry, jasmine, honey", category: "single", roast: 1, price: 18, rating: 4.8, reviews: 214, tag: { text: "New harvest", variant: "success" }, spot: "var(--ayy-accent-ai)" },
  { id: "huila", name: "Colombia Huila", short: "Huila", origin: "Pitalito, Huila", process: "Honey", notes: "Red apple, caramel, cocoa", category: "single", roast: 2, price: 16, rating: 4.6, reviews: 389, tag: { text: "Bestseller", variant: "info" }, spot: "var(--ayy-accent-marketing)" },
  { id: "kiambu", name: "Kenya Kiambu AA", short: "Kiambu", origin: "Gatundu, Kiambu", process: "Washed", notes: "Blackcurrant, grapefruit", category: "single", roast: 1, price: 21, rating: 4.9, reviews: 97, tag: { text: "4 bags left", variant: "warning" }, spot: "var(--ayy-accent-brand)" },
  { id: "house", name: "House blend", short: "House", origin: "Brazil and Colombia", process: "Natural", notes: "Milk chocolate, hazelnut", category: "blend", roast: 2, price: 13, rating: 4.7, reviews: 1204, tag: null, spot: "var(--ayy-accent-research)" },
  { id: "night", name: "Night shift", short: "Night", origin: "Sumatra and Brazil", process: "Wet-hulled", notes: "Dark chocolate, molasses", category: "blend", roast: 3, price: 14, rating: 4.5, reviews: 512, tag: { text: "Espresso", variant: "muted" }, spot: "var(--ayy-accent-product)" },
  { id: "decaf", name: "Swiss water decaf", short: "Decaf", origin: "Cajamarca, Peru", process: "Swiss water", notes: "Cocoa, plum, brown sugar", category: "decaf", roast: 2, price: 15, rating: 4.4, reviews: 158, tag: null, spot: "var(--ayy-accent-system)" },
] as const;

type Roast = (typeof ROASTS)[number];

const ROAST_LEVEL = ["", "Light", "Medium", "Dark"];

const SHOP_CATEGORIES = [
  { value: "all", label: "All" },
  { value: "single", label: "Single origin" },
  { value: "blend", label: "Blends" },
  { value: "decaf", label: "Decaf" },
];

const BREWS = [
  { title: "Pour-over", text: "Bright and clean. The way to taste a light roast.", time: "3:30", dose: "15 g to 250 ml", icon: DropletIcon, iconName: "droplet" as const, spot: "var(--ayy-accent-system)" },
  { title: "AeroPress", text: "Forgiving, fast, and it packs into a carry-on.", time: "2:00", dose: "17 g to 220 ml", icon: Clock01Icon, iconName: "clock" as const, spot: "var(--ayy-accent-marketing)" },
  { title: "Espresso", text: "Night shift was built for it. Milk loves it too.", time: "0:28", dose: "18 g in, 36 g out", icon: Fire02Icon, iconName: "flame" as const, spot: "var(--ayy-accent-product)" },
];

const dollars = (n: number) => `$${n.toFixed(2)}`;

/** A bag of coffee, drawn: a crimped top, the label in the coffee's own colour, the roast as dots. Decorative. */
function Bag({ roast, size }: { roast: Roast; size?: "lg" }) {
  return (
    <span className="pv-app-bag" data-size={size} style={{ "--ayy-spot": roast.spot } as CSSProperties} aria-hidden="true">
      <span className="pv-app-bag__label">
        <span className="pv-app-bag__name">{roast.short}</span>
        <span className="pv-app-bag__roast">
          {[1, 2, 3].map((n) => (
            <span key={n} className="pv-app-bag__dot" data-on={n <= roast.roast || undefined} />
          ))}
        </span>
        <span className="pv-app-bag__weight">250 g</span>
      </span>
    </span>
  );
}

function StoreApp() {
  const [category, setCategory] = useState("all");
  const [[low, high], setPrice] = useState<[number, number]>([10, 24]);
  const [order, setOrder] = useState("popular");
  const [cart, setCart] = useState<Record<string, number>>({ guji: 1, house: 2 });
  const [cartOpen, setCartOpen] = useState(false);
  const [delivery, setDelivery] = useState("standard");

  const inCategory = (id: string) => (id === "all" ? [...ROASTS] : ROASTS.filter((r) => r.category === id));
  const shown = inCategory(category)
    .filter((r) => r.price >= low && r.price <= high)
    .sort((a, b) => (order === "price-low" ? a.price - b.price : order === "price-high" ? b.price - a.price : b.reviews - a.reviews));
  const count = Object.values(cart).reduce((a, b) => a + b, 0);
  const subtotal = Object.entries(cart).reduce((sum, [id, qty]) => sum + (ROASTS.find((r) => r.id === id)?.price ?? 0) * qty, 0);
  const shipping = delivery === "express" ? 9 : 0;
  const add = (r: Roast) => {
    setCart((c) => ({ ...c, [r.id]: (c[r.id] ?? 0) + 1 }));
    toast.success(`${r.name} is in your cart`);
  };
  const setQuantity = (id: string, qty: number) =>
    setCart((c) => {
      const next = { ...c };
      if (qty > 0) next[id] = qty;
      else delete next[id];
      return next;
    });
  const reset = () => {
    setCategory("all");
    setPrice([10, 24]);
  };
  const featured = ROASTS[0];
  const orderLabel = order === "price-low" ? "Price, low to high" : order === "price-high" ? "Price, high to low" : "Most popular";

  return (
    <div className="pv-app pv-app--page">
      <a className="ayy-skip-link" href="#em-main">
        Skip to content
      </a>
      <Navbar>
        <NavbarBrand href="#shop">
          <Icon icon={Coffee02Icon} name="coffee" />
          Ember
        </NavbarBrand>
        <NavbarNav>
          <NavbarLink href="#shop" current>
            Shop
          </NavbarLink>
          <NavbarLink href="#subscriptions">Subscriptions</NavbarLink>
          <NavbarLink href="#guides">Brewing guides</NavbarLink>
          <NavbarLink href="#farms">Our farms</NavbarLink>
        </NavbarNav>
        <NavbarActions>
          <Button size="sm" variant="outline" onClick={() => setCartOpen(true)} aria-label={`Cart, ${count} items`}>
            <Icon icon={ShoppingBag01Icon} name="shopping-bag" />
            Cart
            <Badge>{count}</Badge>
          </Button>
        </NavbarActions>
        <NavbarToggle />
      </Navbar>

      <main id="em-main">
        <section className="ayy-container" style={{ paddingBlock: "var(--ayy-space-12)" }} aria-labelledby="em-title">
          <div className="ayy-grid" style={{ ...min("min(24rem, 100%)"), ...gap(10), alignItems: "center" }}>
            <div className="ayy-stack" style={gap(5)}>
              <p className="ayy-eyebrow">Roasted Tuesday, October 28 · ships tomorrow</p>
              <h1 className="ayy-h1" id="em-title">
                Coffee from farms we know by name
              </h1>
              <p className="ayy-lede">Six coffees, roasted in Lisbon in 12 kg batches and sent out the next morning. We pay farmers twice the fair-trade price, and print it on the bag.</p>
              <div className="ayy-cluster">
                <a className={buttonClass({ size: "lg" })} href="#em-menu">
                  Shop the roast
                </a>
                <a className={buttonClass({ size: "lg", variant: "outline" })} href="#em-subscribe">
                  Subscribe and save 15%
                </a>
              </div>
              <div className="ayy-cluster" style={gap(5)}>
                <span className="ayy-cluster" style={gap(2)}>
                  <Rating readOnly size="sm" value={4.8} aria-label="Rated 4.8 out of 5" />
                  <span className="ayy-muted">2,574 reviews</span>
                </span>
                <span className="ayy-cluster ayy-muted" style={gap(2)}>
                  <Icon icon={DeliveryTruck01Icon} name="truck" />
                  Free delivery over $30
                </span>
              </div>
            </div>

            <Card style={{ "--ayy-spot": featured.spot } as CSSProperties}>
              <CardMedia>
                <div className="ayy-bg-grid pv-app-product pv-app-product--hero">
                  <Bag roast={featured} size="lg" />
                </div>
              </CardMedia>
              <CardHeader>
                <div className="ayy-spread" style={{ inlineSize: "100%" }}>
                  <Badge variant="success" dot>
                    This week's roast
                  </Badge>
                  <span className="ayy-muted">Lot 118</span>
                </div>
                <CardTitle>{featured.name}, washed</CardTitle>
                <CardDescription>Grown by Tadesse Edema at 2,100 m. Tastes like a blueberry muffin with the window open.</CardDescription>
              </CardHeader>
              <CardFooter>
                <div className="ayy-spread" style={{ inlineSize: "100%" }}>
                  <Stat size="sm" value={`$${featured.price}`} unit="/ 250 g" />
                  <Button onClick={() => add(featured)}>
                    <Icon icon={Add01Icon} name="add" />
                    Add to cart
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </div>
        </section>

        <section className="ayy-container" id="em-menu" style={{ paddingBlock: "var(--ayy-space-16)" }} aria-labelledby="em-menu-title">
          <header className="ayy-spread" style={{ ...gap(4), marginBlockEnd: "var(--ayy-space-6)", alignItems: "end" }}>
            <div className="ayy-stack" style={gap(2)}>
              <p className="ayy-eyebrow">The menu</p>
              <h2 className="ayy-h2" id="em-menu-title">
                On the shelf this week
              </h2>
            </div>
            <Sorting size="sm">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SortingTrigger size="sm" aria-label={`Sort by ${orderLabel}`}>
                    <span>{`Sort: ${orderLabel}`}</span>
                    <Icon icon={ArrowDown01Icon} name="chevron-down" />
                  </SortingTrigger>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" aria-label="Sort by">
                  <DropdownMenuRadioGroup value={order} onValueChange={setOrder} closeOnSelect>
                    <DropdownMenuRadioItem value="popular">Most popular</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="price-low">Price, low to high</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="price-high">Price, high to low</DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </Sorting>
          </header>

          <div className="ayy-stack" style={gap(5)}>
            <div className="ayy-spread" style={gap(4)}>
              <ChipGroup role="radiogroup" aria-label="Kind of coffee" scroll>
                {SHOP_CATEGORIES.map((c) => (
                  <Chip
                    key={c.value}
                    type="radio"
                    name="em-category"
                    value={c.value}
                    checked={category === c.value}
                    onCheckedChange={(on) => on && setCategory(c.value)}
                    count={inCategory(c.value).length}
                  >
                    {c.label}
                  </Chip>
                ))}
              </ChipGroup>
              <div className="ayy-stack" style={{ ...gap(1), inlineSize: "13rem" }}>
                <div className="ayy-spread">
                  <span className="ayy-label" id="em-price">
                    Price
                  </span>
                  <span className="ayy-muted">
                    ${low} – ${high}
                  </span>
                </div>
                <SliderRange aria-labelledby="em-price" min={10} max={24} value={[low, high]} onValueChange={setPrice} labels={["Lowest price", "Highest price"]} />
              </div>
            </div>

            <div role="status">
              {shown.length ? (
                // Three bags a row on a laptop, two on a phone.
                <div className="ayy-grid" style={{ ...min("min(18rem, calc(50% - var(--ayy-space-2)))"), ...gap(4) }}>
                  {shown.map((r) => (
                    <Card key={r.id} style={{ "--ayy-spot": r.spot } as CSSProperties}>
                      <CardMedia>
                        <div className="pv-app-product">
                          <Bag roast={r} />
                        </div>
                      </CardMedia>
                      <CardHeader>
                        {r.tag ? (
                          <div>
                            <Badge variant={r.tag.variant}>{r.tag.text}</Badge>
                          </div>
                        ) : null}
                        <CardTitle>{r.name}</CardTitle>
                        <CardDescription>
                          {ROAST_LEVEL[r.roast]} roast · {r.process} · {r.origin}
                        </CardDescription>
                        <p className="ayy-small">{r.notes}</p>
                        <span className="ayy-cluster" style={gap(2)}>
                          <Rating readOnly size="sm" value={r.rating} aria-label={`Rated ${r.rating} out of 5`} />
                          <span className="ayy-muted ayy-small">{r.reviews.toLocaleString("en-US")}</span>
                        </span>
                      </CardHeader>
                      <CardFooter>
                        <div className="ayy-spread" style={{ inlineSize: "100%" }}>
                          <span className="ayy-h6">${r.price}</span>
                          <Button size="sm" variant="outline" onClick={() => add(r)} aria-label={`Add ${r.name} to the cart`}>
                            <Icon icon={Add01Icon} name="add" />
                            Add
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <EmptyState bordered>
                  <IconTile>
                    <Icon icon={Coffee02Icon} name="coffee" />
                  </IconTile>
                  <EmptyStateTitle>No coffee in that range</EmptyStateTitle>
                  <EmptyStateDescription>Widen the price range or pick another kind.</EmptyStateDescription>
                  <EmptyStateActions>
                    <Button size="sm" variant="outline" onClick={reset}>
                      Reset filters
                    </Button>
                  </EmptyStateActions>
                </EmptyState>
              )}
            </div>
          </div>
        </section>

        <section className="ayy-container" id="guides" style={{ paddingBlock: "var(--ayy-space-16)" }} aria-labelledby="em-guides">
          <header className="ayy-stack" style={{ ...gap(2), marginBlockEnd: "var(--ayy-space-6)" }}>
            <p className="ayy-eyebrow">Brewing guides</p>
            <h2 className="ayy-h2" id="em-guides">
              Three ways we brew it at the bar
            </h2>
          </header>
          <div className="ayy-grid" style={{ ...min("15rem"), ...gap(4) }}>
            {BREWS.map((b) => (
              <Card key={b.title} interactive>
                <CardHeader>
                  <IconTile spotColor={b.spot}>
                    <Icon icon={b.icon} name={b.iconName} />
                  </IconTile>
                  <CardTitle>
                    <CardLink href="#guides">{b.title}</CardLink>
                  </CardTitle>
                  <CardDescription>{b.text}</CardDescription>
                </CardHeader>
                <CardFooter>
                  <div className="ayy-spread" style={{ inlineSize: "100%" }}>
                    <span className="ayy-mono">{b.time}</span>
                    <span className="ayy-muted ayy-small">{b.dose}</span>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>

        <section className="ayy-container" id="em-subscribe" style={{ paddingBlock: "var(--ayy-space-16)" }} aria-labelledby="em-sub">
          <Card featured>
            <CardContent>
              <div className="ayy-split" style={{ ...min("16rem"), ...gap(8), alignItems: "center" }}>
                <div className="ayy-stack" style={gap(3)}>
                  <h2 className="ayy-h3" id="em-sub">
                    Never run out
                  </h2>
                  <p className="ayy-muted">A fresh bag every two or four weeks, chosen by our roaster or by you. Skip, swap or pause from your account.</p>
                  <List compact aria-label="Subscribers get">
                    {["15% off every bag", "Free delivery, always", "First taste of new harvests"].map((perk) => (
                      <ListItem key={perk}>
                        <Icon icon={CheckmarkCircle02Icon} name="circle-check" />
                        {perk}
                      </ListItem>
                    ))}
                  </List>
                </div>
                <div className="ayy-stack" style={gap(3)}>
                  <ChoiceGroup legend="How often" name="em-every" defaultValue="2" min="8rem">
                    <ChoiceCard value="2" title="Every 2 weeks" description="For a cup a day" meta="$15.30 a bag" />
                    <ChoiceCard value="4" title="Every 4 weeks" description="For weekends" meta="$15.30 a bag" />
                  </ChoiceGroup>
                  <Button block onClick={() => toast.success("Subscription started. First bag ships Wednesday.")}>
                    Start my subscription
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      <Dialog open={cartOpen} onOpenChange={setCartOpen}>
        <DialogContent side="end">
          <DialogHeader>
            <DialogTitle>Your cart</DialogTitle>
            <DialogDescription>{count ? `${count} bags, roasted next Tuesday.` : "Nothing in it yet."}</DialogDescription>
          </DialogHeader>
          <DialogBody>
            {count ? (
              <div className="ayy-stack" style={gap(5)}>
                <List divided aria-label="Items">
                  {Object.entries(cart).map(([id, qty]) => {
                    const r = ROASTS.find((x) => x.id === id)!;
                    return (
                      <ListItem key={id}>
                        <span className="pv-app-product pv-app-product--thumb">
                          <Bag roast={r} />
                        </span>
                        <ListContent>
                          <ListTitle>{r.name}</ListTitle>
                          <ListDescription>
                            250 g · ${r.price}
                          </ListDescription>
                        </ListContent>
                        <NumberField
                          size="sm"
                          min={0}
                          max={10}
                          value={qty}
                          onValueChange={(n) => setQuantity(id, n)}
                          aria-label={`Bags of ${r.name}`}
                          decrementLabel={`One bag fewer of ${r.name}`}
                          incrementLabel={`One more bag of ${r.name}`}
                        />
                      </ListItem>
                    );
                  })}
                </List>
                <ChoiceGroup legend="Delivery" name="em-delivery" value={delivery} onValueChange={setDelivery} min="9rem">
                  <ChoiceCard value="standard" title="Standard" description="3–5 days" meta="Free" />
                  <ChoiceCard value="express" title="Express" description="Tomorrow" meta="$9.00" />
                </ChoiceGroup>
                <div className="ayy-stack" style={gap(2)}>
                  <div className="ayy-spread">
                    <span className="ayy-muted">Subtotal</span>
                    <span>{dollars(subtotal)}</span>
                  </div>
                  <div className="ayy-spread">
                    <span className="ayy-muted">Delivery</span>
                    <span>{shipping ? dollars(shipping) : "Free"}</span>
                  </div>
                  <div className="ayy-spread">
                    <span className="ayy-muted">Total</span>
                    <strong>{dollars(subtotal + shipping)}</strong>
                  </div>
                </div>
              </div>
            ) : (
              <EmptyState compact>
                <EmptyStateTitle>Your cart is empty</EmptyStateTitle>
                <EmptyStateDescription>Pick a coffee and it shows up here.</EmptyStateDescription>
              </EmptyState>
            )}
          </DialogBody>
          <DialogFooter>
            <DialogClose>Keep shopping</DialogClose>
            <Button
              disabled={!count}
              onClick={() => {
                setCartOpen(false);
                setCart({});
                toast.success("Order placed. Your coffee ships Wednesday.");
              }}
            >
              Check out
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer>
        <FooterBrand>
          <a href="#shop">
            <Icon icon={Coffee02Icon} name="coffee" />
            Ember
          </a>
          <p>Small-batch coffee from Lisbon.</p>
        </FooterBrand>
        <FooterNav>
          <FooterGroup label="Shop">
            <FooterLink href="#shop">Coffee</FooterLink>
            <FooterLink href="#subscriptions">Subscriptions</FooterLink>
            <FooterLink href="#gifts">Gift cards</FooterLink>
          </FooterGroup>
          <FooterGroup label="Learn">
            <FooterLink href="#guides">Brewing guides</FooterLink>
            <FooterLink href="#farms">Our farms</FooterLink>
          </FooterGroup>
          <FooterGroup label="Help">
            <FooterLink href="#shipping">Shipping</FooterLink>
            <FooterLink href="#contact">Contact</FooterLink>
          </FooterGroup>
        </FooterNav>
        <FooterBottom>
          <p>© 2026 Ember Roasters · Rua da Boavista 12, Lisbon</p>
        </FooterBottom>
      </Footer>
    </div>
  );
}

/* ---- 6. Booking app: a day strip, class cards, a booking summary ---- */

const WEEK = [
  { value: "mon", day: "Mon", date: 13 },
  { value: "tue", day: "Tue", date: 14 },
  { value: "wed", day: "Wed", date: 15 },
  { value: "thu", day: "Thu", date: 16 },
  { value: "fri", day: "Fri", date: 17 },
  { value: "sat", day: "Sat", date: 18 },
  { value: "sun", day: "Sun", date: 19 },
];

const CLASSES = [
  { id: "c1", day: "tue", time: "07:00", name: "Sunrise vinyasa", style: "Vinyasa", teacher: "Ana Ruiz", length: 60, left: 6 },
  { id: "c2", day: "tue", time: "12:15", name: "Lunchtime flow", style: "Vinyasa", teacher: "Leo Park", length: 45, left: 0 },
  { id: "c3", day: "tue", time: "18:30", name: "Slow yin", style: "Yin", teacher: "Priya Nair", length: 75, left: 3 },
  { id: "c4", day: "tue", time: "20:00", name: "Mat pilates", style: "Pilates", teacher: "Sam Okafor", length: 50, left: 9 },
  { id: "c5", day: "wed", time: "07:00", name: "Sunrise vinyasa", style: "Vinyasa", teacher: "Ana Ruiz", length: 60, left: 8 },
  { id: "c6", day: "wed", time: "19:00", name: "Restorative yin", style: "Yin", teacher: "Priya Nair", length: 60, left: 2 },
  { id: "c7", day: "sat", time: "10:00", name: "Weekend flow", style: "Vinyasa", teacher: "Leo Park", length: 90, left: 12 },
];

const STUDIOS = [
  { value: "principe-real", label: "Príncipe Real", meta: "Lisbon", keywords: "Lisboa" },
  { value: "alfama", label: "Alfama", meta: "Lisbon", keywords: "Lisboa" },
  { value: "cais-do-sodre", label: "Cais do Sodré", meta: "Lisbon", keywords: "Lisboa" },
  { value: "foz", label: "Foz", meta: "Porto" },
  { value: "baixa", label: "Baixa", meta: "Porto" },
];

const HAVEN_SETTINGS: AppSettings = {
  groups: [
    {
      label: "Account",
      sections: [
        {
          href: "#hv-profile",
          label: "Profile",
          icon: UserCircleIcon, iconName: "circle-user",
          content: (
            <Settings title="Your details" description="Teachers see your first name on the class list.">
              <SettingsRow label="Name" htmlFor="hv-name">
                <Input id="hv-name" defaultValue="Dana Levi" autoComplete="name" />
              </SettingsRow>
              <SettingsRow label="Email" htmlFor="hv-email">
                <Input id="hv-email" type="email" defaultValue="dana@levi.me" autoComplete="email" />
              </SettingsRow>
              <SettingsRow label="Phone" htmlFor="hv-phone" hint="For last-minute changes to a class.">
                <Input id="hv-phone" type="tel" defaultValue="+972 52 555 0142" autoComplete="tel" aria-describedby="hv-phone-hint" />
              </SettingsRow>
            </Settings>
          ),
        },
        {
          href: "#hv-notifications",
          label: "Notifications",
          icon: Notification01Icon, iconName: "bell",
          content: (
            <Settings title="Remind me">
              {switchRow("hv-remind", "Before a class", "A push notification with the studio and room.", true)}
              {selectRow("hv-when", "How early", [["1", "1 hour before"], ["2", "2 hours before"], ["24", "The day before"]], "2")}
              {switchRow("hv-waitlist", "A waitlist spot opens", "You get ten minutes to take it.", true)}
              {switchRow("hv-news", "Studio news", "New teachers, workshops and holiday hours. About once a month.")}
            </Settings>
          ),
        },
      ],
    },
    {
      label: "Studio",
      sections: [
        {
          href: "#hv-membership",
          label: "Membership",
          icon: Ticket01Icon, iconName: "ticket",
          content: (
            <>
              <Settings title="10-class pass" description="6 classes left, valid until December 31.">
                {switchRow("hv-renew", "Renew automatically", "Buy the next pass when this one runs out.")}
                <SettingsLink href="#hv-buy" label="Buy more classes" value="From $18 a class" />
                <SettingsLink href="#hv-history" label="Payment history" />
              </Settings>
              <Settings>
                <SettingsLink label="Sign out" destructive />
              </Settings>
            </>
          ),
        },
        {
          href: "#hv-preferences",
          label: "Preferences",
          icon: Yoga01Icon, iconName: "yoga",
          content: (
            <Settings title="Booking">
              {selectRow("hv-studio", "Home studio", [["florentin", "Florentin"], ["port", "Old Port"], ["park", "Park Hayarkon"]], "florentin", "Its classes show first on the schedule.")}
              {selectRow("hv-spots", "Spots to book", [["1", "Just me"], ["2", "Me and a friend"]], "1")}
              {switchRow("hv-mat", "Rent a mat", "Added to every booking for $2.")}
            </Settings>
          ),
        },
      ],
    },
  ],
};

function BookingApp() {
  const [day, setDay] = useState("tue");
  const [styles, setStyles] = useState<string[]>([]);
  const [chosen, setChosen] = useState("c3");
  const [spots, setSpots] = useState(1);
  const onDay = CLASSES.filter((c) => c.day === day);
  const shown = styles.length ? onDay.filter((c) => styles.includes(c.style)) : onDay;
  const pick = CLASSES.find((c) => c.id === chosen && c.day === day);
  const date = WEEK.find((d) => d.value === day)!;
  const toggleStyle = (style: string) => setStyles((list) => (list.includes(style) ? list.filter((s) => s !== style) : [...list, style]));
  return (
    <AppFrame
      brand={{ name: "Haven", icon: Yoga01Icon, iconName: "yoga", href: "#schedule" }}
      groups={[
        {
          label: "Studio",
          items: [
            { href: "#schedule", label: "Schedule", icon: Calendar03Icon, iconName: "calendar" },
            { href: "#bookings", label: "Bookings", icon: Ticket01Icon, iconName: "ticket" },
            { href: "#teachers", label: "Teachers", icon: UserGroupIcon, iconName: "users-group" },
            { href: "#profile", label: "Profile", icon: UserCircleIcon, iconName: "circle-user" },
          ],
        },
      ]}
      tabs={["#schedule", "#bookings", "#teachers", "#profile"]}
      current="#schedule"
      footer={account("Dana Levi")}
      settings={HAVEN_SETTINGS}
    >
      <div className="ayy-stack" style={gap(5)}>
        <PageHeader>
          <PageHeaderTitle>Book a class</PageHeaderTitle>
          <PageHeaderDescription>Good morning, Dana. October 13–19 · 6 classes left on your 10-class pass.</PageHeaderDescription>
        </PageHeader>

        <Card>
          <CardContent>
            <div className="ayy-cluster" style={{ ...gap(4), flexWrap: "nowrap" }}>
              <ProgressRing size="lg" value={75} variant="success" aria-label="3 of 4 classes this week">
                3/4
              </ProgressRing>
              <div className="ayy-stack" style={gap(1)}>
                <p className="ayy-h6">One more class for your weekly goal</p>
                <p className="ayy-muted">Up next: Sunrise vinyasa with Ana, Wednesday at 07:00 in Príncipe Real.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <ChoiceGroup aria-label="Day" name="hv-day" value={day} onValueChange={setDay} min="6rem" scroll>
          {WEEK.map((d) => {
            const n = CLASSES.filter((c) => c.day === d.value).length;
            return <ChoiceCard key={d.value} compact value={d.value} title={`${d.day} ${d.date}`} description={n ? `${n} ${n === 1 ? "class" : "classes"}` : "None"} />;
          })}
        </ChoiceGroup>

        <div className="ayy-split" style={min("17rem")}>
          <div className="ayy-stack" style={gap(3)}>
            <ChipGroup aria-label="Style" scroll>
              {["Vinyasa", "Yin", "Pilates"].map((style) => (
                <ChipButton key={style} pressed={styles.includes(style)} onPressedChange={() => toggleStyle(style)} count={onDay.filter((c) => c.style === style).length}>
                  {style}
                </ChipButton>
              ))}
            </ChipGroup>
            <div role="status">
              {shown.length ? (
                <ChoiceGroup aria-label={`Classes on ${date.day} ${date.date}`} name="hv-class" value={chosen} onValueChange={setChosen} min="100%">
                  {shown.map((c) => (
                    <ChoiceCard
                      key={c.id}
                      value={c.id}
                      title={`${c.time} · ${c.name}`}
                      description={`${c.teacher} · ${c.length} min · ${c.style}`}
                      meta={c.left ? `${c.left} spots left` : "Full"}
                      disabled={!c.left}
                    />
                  ))}
                </ChoiceGroup>
              ) : (
                <EmptyState bordered compact>
                  <IconTile size="sm">
                    <Icon icon={Calendar03Icon} name="calendar" />
                  </IconTile>
                  <EmptyStateTitle>No classes {onDay.length ? "of that style" : "this day"}</EmptyStateTitle>
                  <EmptyStateDescription>{onDay.length ? "Try another style, or every style." : "Pick another day this week."}</EmptyStateDescription>
                  {onDay.length ? (
                    <EmptyStateActions>
                      <Button size="sm" variant="outline" onClick={() => setStyles([])}>
                        Every style
                      </Button>
                    </EmptyStateActions>
                  ) : null}
                </EmptyState>
              )}
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Your booking</CardTitle>
              <CardDescription>{pick ? `${date.day} ${date.date} October` : "Pick a class to book it."}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="ayy-stack" style={gap(4)}>
                <Field>
                  <Label htmlFor="hv-studio">Studio</Label>
                  <Combobox id="hv-studio" options={STUDIOS} defaultValue="principe-real" placeholder="Search studios" />
                </Field>
                {pick ? (
                  <div className="ayy-stack" style={gap(2)}>
                    <div className="ayy-spread">
                      <span className="ayy-muted">Class</span>
                      <span>{pick.name}</span>
                    </div>
                    <div className="ayy-spread">
                      <span className="ayy-muted">Time</span>
                      <span>{pick.time}, {pick.length} min</span>
                    </div>
                    <div className="ayy-spread">
                      <span className="ayy-muted">Teacher</span>
                      <span>{pick.teacher}</span>
                    </div>
                  </div>
                ) : null}
                <Field>
                  <Label htmlFor="hv-spots">Spots</Label>
                  <NumberField
                    id="hv-spots"
                    min={1}
                    max={Math.min(2, pick?.left ?? 1)}
                    value={spots}
                    onValueChange={setSpots}
                    decrementLabel="One spot fewer"
                    incrementLabel="Bring a friend"
                    aria-describedby="hv-spots-hint"
                  />
                  <FieldHint id="hv-spots-hint">You and up to one friend, from your pass.</FieldHint>
                </Field>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                block
                disabled={!pick}
                onClick={() => pick && toast.success(`Booked: ${pick.name}, ${date.day} ${date.date} at ${pick.time}`)}
              >
                Book {spots > 1 ? `${spots} spots` : "it"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </AppFrame>
  );
}

/* ---- Registry ---- */

export interface ShowcaseApp {
  id: string;
  name: string;
  kind: string;
  description: string;
  /** The Themes page preset it wears (THEME_PRESETS id): colours, fonts, corners and icon pack. */
  preset: string;
  /** Light or dark: every preset has both. */
  theme: "light" | "dark";
  density: Exclude<DensityMode, "auto">;
  /** A prompt that builds a screen like this with ayywi, for "Build it with AI". */
  prompt: string;
  screenshot: string;
  Component: ComponentType;
}

const APP_FRAME = "an ayywi App shell: a sidebar on wide screens; on phones a top bar with the brand and one action, and a Bottom nav with the same top destinations. Settings open over the app in a Dialog with size=\"full\" holding the App shell in settings mode (sections in its sidebar, one section of Settings rows in its main, two screens on phones)";

export const showcaseApps: ShowcaseApp[] = [
  {
    id: "dashboard",
    name: "Pulse",
    kind: "Analytics dashboard",
    description: "Live visitors, KPI sparklines, a month-on-month chart, top pages and traffic sources. Cool and technical, in Arctic.",
    preset: "arctic",
    theme: "dark",
    density: "compact",
    prompt: `Build an analytics dashboard with ayywi, in ${APP_FRAME}. Seven destinations in two sidebar groups (Workspace: Overview, Reports, Audiences, Projects; Account: Integrations, Billing, Settings), so the bottom nav shows the first four and a More tab that opens the sidebar as a drawer.

The Overview page: a Page header whose description is a live count of visitors behind a pulsing success Status dot, with a date-range Segmented control (7d, 30d, 90d) and an outline Export button; four KPI cards (Stat, a success or warning Badge and a Sparkline) in an .ayy-grid; a Visitors card with a LineChart of this month against last month (the comparison series dashed); then an .ayy-split with a Top pages table (compact, numeric columns, the Views column sortable, status badges, Pagination in the card footer) beside a Traffic sources card with a BarList, a Goals card of Progress bars and an info Alert about a traffic spike on one page, with a See referrers action.

Settings (the Settings destination): Account — Profile, Preferences, Notifications; Workspace — General, Data, with a destructive Delete all data link row.

The Arctic theme (THEME_PRESETS), dark, compact density. ayywi components and tokens only; run npx @danitesler/ayywi lint when you're done.`,
    screenshot: dashboardScreenshot,
    Component: DashboardApp,
  },
  {
    id: "landing",
    name: "Northwind",
    kind: "Marketing site",
    description: "The launch site of an AI page builder: a live build in the hero, customer proof, features, pricing, quotes and an FAQ. Bold and nocturnal, in Twilight.",
    preset: "twilight",
    theme: "dark",
    density: "comfortable",
    prompt: `Build a one-page marketing site for an AI page builder with ayywi: skip link, a Navbar (brand, four links, a primary "Start free" button, a NavbarToggle for phones), then <main> at .ayy-container width, then a Footer.

Sections: a centred hero (AI badge, h1, lede, a primary and an outline button, .ayy-bg-grid behind it) above a Card showing a page being built — a pulsing Status dot and the site's address, a read-only prompt InputGroup, a compact List of build steps (done ones with a check, the current one with a Spinner) and a Progress bar; a strip of customer names and three Stats; three feature cards with IconTiles in different accents; pricing with a Monthly/Yearly Segmented control and three plan cards (the middle one featured with a "Most popular" badge, perks in a compact List); a Carousel of customer quotes; an FAQ Accordion (single); a closing section with an email InputGroup and a submit button.

The Twilight theme (THEME_PRESETS), dark. One primary call to action per view; everything else outline or ghost. Run npx @danitesler/ayywi lint when you're done.`,
    screenshot: landingScreenshot,
    Component: LandingApp,
  },
  {
    id: "dating",
    name: "Kindred",
    kind: "Dating app",
    description: "One profile at a time with a prompt and interests, new matches with unread messages, and how complete your own profile is. Warm and editorial, in Wine.",
    preset: "wine",
    theme: "light",
    density: "comfortable",
    prompt: `Build the Discover screen of a dating app with ayywi, in ${APP_FRAME} (Discover, Matches, Messages, Profile).

A Page header (how many new people are nearby) with an outline Filters button. Then an .ayy-split: on the left one profile Card — a tall portrait on CardMedia, the name and age as a heading with a success "Active today" Badge, place, distance and job with a map-pin Icon, their prompt as a quote, interests as outline Badges, and a footer with an outline Pass and a primary Like (a toast, then the next person); on the right a New matches Card (a List with Avatar, a ListLink name, a truncated last message, the time and an unread Status dot) and a Your profile Card with a Progress bar and an outline button.

Settings (a Settings link in the sidebar footer, a settings button in the phone bar): Account — Profile, Notifications; Dating — Preferences, Privacy with a destructive Pause my account.

The Wine theme (THEME_PRESETS), light. Run npx @danitesler/ayywi lint when you're done.`,
    screenshot: datingScreenshot,
    Component: DatingApp,
  },

  {
    id: "tracker",
    name: "Orbit",
    kind: "Project tracker",
    description: "Your day across projects: onboarding, overdue and flagged tasks, filters with empty states, a sync error to retry and loading activity. Quiet and neutral, in Default.",
    preset: "default",
    theme: "light",
    density: "compact",
    prompt: `Build a task tracker home screen with ayywi, in ${APP_FRAME} (My tasks, Projects, Calendar, Inbox in the tabs; Members and Settings behind More).

A Page header with one primary "New task" button. An onboarding card with Steps (Create a project ✓, Invite your team — current, Connect GitHub) and two buttons. Then an .ayy-split: a Today/Upcoming/All Segmented control with a Kbd hint, project filter chips (ChipButton with counts, in a scrolling ChipGroup), and a card that holds either a divided List of tasks (a Checkbox labelled by the title, project and due date, a destructive Overdue or warning priority Badge where it applies, the assignee's Avatar) or a compact Empty state when a view has nothing (another, with a "Show every project" button, when the chips filter everything out); beside it a destructive Alert "GitHub sync failed" whose Try again button shows loading, and an Activity card of Skeleton rows while it loads (aria-busy).

Settings (Settings, behind More): Account — Preferences, Notifications, Shortcuts; Team — Members with a role Select per person, Integrations as link rows with their status.

The Default theme, light, compact density. Every state — empty, loading, error — uses an ayywi component. Run npx @danitesler/ayywi lint when you're done.`,
    screenshot: trackerScreenshot,
    Component: TrackerApp,
  },
  {
    id: "store",
    name: "Ember",
    kind: "Online store",
    description: "A coffee roaster's shop: this week's roast, bags with tasting notes and ratings, brewing guides, a subscription and a cart drawer. Roasty and warm, in Ember.",
    preset: "ember",
    theme: "dark",
    density: "comfortable",
    prompt: `Build the online shop of a small coffee roaster with ayywi: a Navbar (brand, Shop, Subscriptions, Brewing guides, Our farms, an outline Cart button with a Badge count, a NavbarToggle for phones), content at .ayy-container width, and a Footer.

A hero in an .ayy-split: the roast date as an eyebrow, an h1, a lede, a primary and an outline button, a read-only Rating with the review count and free delivery; beside it this week's roast in a Card (a drawn bag on its CardMedia, a success Badge, the farm and producer, a Stat price and an Add to cart button). Then the menu: a header with Sorting; a filter bar with radio Chips for the kind of coffee (with counts) and a SliderRange for the price; an .ayy-grid of product Cards — each bag drawn in its own --ayy-spot colour with the roast level as dots, a Badge only where it says something (New harvest, Bestseller, 4 bags left), roast, process and origin, tasting notes, a read-only Rating with the review count, the price and an outline Add button that shows a toast — or an Empty state with Reset filters. Then three interactive brewing-guide Cards (IconTile, time in mono, the dose) and a featured subscription Card with perks and a ChoiceGroup for how often.

The cart is a Dialog with side="end": a divided List of items with a small NumberField each, a Delivery ChoiceGroup (Standard free, Express $9), the subtotal, delivery and total, and a footer with Keep shopping and one primary Check out that shows a toast.

The Ember theme (THEME_PRESETS), dark. Run npx @danitesler/ayywi lint when you're done.`,
    screenshot: storeScreenshot,
    Component: StoreApp,
  },
  {
    id: "booking",
    name: "Haven",
    kind: "Booking app",
    description: "Classes at a yoga studio: a weekly goal, a day strip, style filters, classes with spots left and a booking card. Calm and green, in Forest, at touch size.",
    preset: "forest",
    theme: "light",
    density: "touch",
    prompt: `Build a class booking app for a yoga studio with ayywi, in ${APP_FRAME} (Schedule, Bookings, Teachers, Profile).

The Schedule page: a Page header (a greeting, the week and the classes left on the pass); a Card with a ProgressRing for the weekly goal beside the next booked class; a day strip — a scrolling ChoiceGroup of compact ChoiceCards, one per day with how many classes it has; then an .ayy-split: on the left, style filters (ChipButtons with counts in a scrolling ChipGroup) above the day's classes as a ChoiceGroup of ChoiceCards (time and name as the title, teacher, length and style as the description, spots left as meta, a full class disabled), or a compact Empty state when nothing matches; on the right, a Your booking Card with a Combobox to pick the studio, details of the chosen class, a NumberField for spots (max 2) with a hint, and one primary full-width Book button that shows a toast.

Settings (a Settings link in the sidebar footer, a settings button in the phone bar): Account — Profile, Notifications; Studio — Membership with link rows and a destructive Sign out, Preferences.

The Forest theme (THEME_PRESETS), light, touch density. Run npx @danitesler/ayywi lint when you're done.`,
    screenshot: bookingScreenshot,
    Component: BookingApp,
  },
];
