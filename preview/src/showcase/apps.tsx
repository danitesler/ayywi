// Seven screens built only from ayywi components, tokens and layout utilities. The pv-app-* classes in preview.css
// only size the showcase frame, lay out the inbox's three panes and frame the store's product art; every colour, size
// and control comes from ayywi. The apps share one frame (AppFrame): the sidebar on wide screens, a top bar and a
// bottom nav on phones. The marketing site and the store are websites: a Navbar and a Footer.
import { useState, type ComponentType, type CSSProperties, type ReactNode } from "react";
import {
  Add01Icon,
  Alert02Icon,
  Analytics01Icon,
  Attachment01Icon,
  Calendar03Icon,
  ChartLineData01Icon,
  CheckmarkCircle02Icon,
  Coffee02Icon,
  CreditCardIcon,
  DashboardSquare01Icon,
  Download01Icon,
  FlashIcon,
  Folder01Icon,
  GlobeIcon,
  HelpCircleIcon,
  Home01Icon,
  InboxIcon,
  Invoice01Icon,
  Layers01Icon,
  Link01Icon,
  Mail01Icon,
  Message01Icon,
  MoreHorizontalIcon,
  Notification01Icon,
  RefreshIcon,
  Rocket01Icon,
  Search01Icon,
  SentIcon,
  Settings01Icon,
  Shield01Icon,
  ShoppingBag01Icon,
  SmartPhone01Icon,
  SparklesIcon,
  Task01Icon,
  Ticket01Icon,
  UserCircleIcon,
  UserGroupIcon,
  UserMultipleIcon,
  Wallet01Icon,
  Yoga01Icon,
} from "@hugeicons/core-free-icons";
import { toast, type DensityMode, type IconData, type ThemeName } from "ayywi";
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
  Avatar,
  AvatarGroup,
  Badge,
  BottomNav,
  BottomNavButton,
  BottomNavLink,
  BarList,
  Breadcrumb,
  Button,
  buttonClass,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardMedia,
  CardTitle,
  Carousel,
  CarouselSlide,
  Chat,
  ChatMessage,
  ChatReplies,
  ChatTyping,
  Chip,
  Checkbox,
  ChipButton,
  ChipGroup,
  ChoiceCard,
  ChoiceGroup,
  Combobox,
  DataList,
  DataListItem,
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Dropzone,
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
  InputGroupAddon,
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
  NumberField,
  PageHeader,
  PageHeaderActions,
  PageHeaderDescription,
  PageHeaderTitle,
  Pagination,
  Progress,
  Section,
  SectionDescription,
  SectionEyebrow,
  SectionHeader,
  SectionTitle,
  SegmentedControl,
  SegmentedControlItem,
  Select,
  Separator,
  Skeleton,
  SliderRange,
  Sparkline,
  Stat,
  Steps,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
  compareValues,
  nextSortDirection,
  type SortDirection,
} from "ayywi/react";

const gap = (space: number) => ({ "--ayy-gap": `var(--ayy-space-${space})` }) as CSSProperties;
const min = (size: string) => ({ "--ayy-min": size }) as CSSProperties;

/* ---- The shared app frame ---- */

interface Destination {
  href: string;
  label: string;
  icon: IconData;
}

interface AppFrameProps {
  brand: { name: string; icon: IconData; href: string };
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
  mainClassName?: string;
  children: ReactNode;
}

/** One app frame for every app: sidebar on wide screens; below 48rem a bar with the brand and a bottom nav. */
function AppFrame({ brand, groups, tabs, current, barActions, footer, mainClassName, children }: AppFrameProps) {
  const all = groups.flatMap((g) => g.items);
  const tabItems = tabs.map((href) => all.find((d) => d.href === href)).filter((d) => d !== undefined);
  const more = all.length > tabItems.length;
  const brandLink = (
    <AppShellBrand href={brand.href}>
      <Icon icon={brand.icon} />
      {brand.name}
    </AppShellBrand>
  );
  return (
    <AppShell className="pv-app">
      <AppShellBar>
        {brandLink}
        {barActions}
      </AppShellBar>
      <AppShellSidebar>
        {brandLink}
        <AppShellNav aria-label={brand.name}>
          {groups.map((g) => (
            <AppShellGroup key={g.label} label={g.label}>
              {g.items.map((d) => (
                <AppShellItem key={d.href}>
                  <AppShellLink href={d.href} current={d.href === current}>
                    <Icon icon={d.icon} />
                    {d.label}
                  </AppShellLink>
                </AppShellItem>
              ))}
            </AppShellGroup>
          ))}
        </AppShellNav>
        <AppShellFooter>{footer}</AppShellFooter>
      </AppShellSidebar>
      <AppShellMain className={mainClassName}>{children}</AppShellMain>
      <BottomNav aria-label={brand.name}>
        {tabItems.map((d) => (
          <BottomNavLink key={d.href} href={d.href} icon={<Icon icon={d.icon} />} current={d.href === current}>
            {d.label}
          </BottomNavLink>
        ))}
        {more ? (
          <BottomNavButton className="ayy-app-shell__toggle" icon={<Icon icon={MoreHorizontalIcon} />}>
            More
          </BottomNavButton>
        ) : null}
      </BottomNav>
    </AppShell>
  );
}

const searchButton = (label: string) => (
  <Button variant="ghost" size="icon" aria-label={label}>
    <Icon icon={Search01Icon} />
  </Button>
);

const account = (name: string) => (
  <div className="ayy-cluster">
    <Avatar name={name} size="sm" />
    <span>{name}</span>
  </div>
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

function DashboardApp() {
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<SortDirection>("descending");
  const pages = [...PAGES].sort((a, b) => (sort === "ascending" ? 1 : -1) * compareValues(a.views, b.views));
  return (
    <AppFrame
      brand={{ name: "Pulse", icon: ChartLineData01Icon, href: "#overview" }}
      groups={[
        {
          label: "Workspace",
          items: [
            { href: "#overview", label: "Overview", icon: DashboardSquare01Icon },
            { href: "#reports", label: "Reports", icon: Analytics01Icon },
            { href: "#audiences", label: "Audiences", icon: UserGroupIcon },
            { href: "#projects", label: "Projects", icon: Folder01Icon },
          ],
        },
        {
          label: "Account",
          items: [
            { href: "#integrations", label: "Integrations", icon: Link01Icon },
            { href: "#billing", label: "Billing", icon: CreditCardIcon },
            { href: "#settings", label: "Settings", icon: Settings01Icon },
          ],
        },
      ]}
      tabs={["#overview", "#reports", "#audiences", "#projects"]}
      current="#overview"
      barActions={searchButton("Search")}
      footer={account("Maya Chen")}
    >
      <div className="ayy-stack" style={gap(5)}>
        <PageHeader>
          <PageHeaderTitle>Overview</PageHeaderTitle>
          <PageHeaderDescription>Traffic and revenue across every site in this workspace.</PageHeaderDescription>
          <PageHeaderActions>
            <SegmentedControl size="sm" aria-label="Date range" defaultValue="30d">
              <SegmentedControlItem value="7d">7d</SegmentedControlItem>
              <SegmentedControlItem value="30d">30d</SegmentedControlItem>
              <SegmentedControlItem value="90d">90d</SegmentedControlItem>
            </SegmentedControl>
            <Button size="sm" variant="outline">
              <Icon icon={Download01Icon} />
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
              <AlertTitle>Weekly report is ready</AlertTitle>
              <AlertDescription>Sent to 4 people every Monday at 9:00.</AlertDescription>
            </Alert>
          </div>
        </div>
      </div>
    </AppFrame>
  );
}

/* ---- 2. Marketing site ---- */

const FEATURES = [
  { icon: FlashIcon, color: "var(--ayy-accent-marketing)", title: "Ship in an afternoon", text: "Start from a template, connect your data, publish. No build pipeline to babysit." },
  { icon: Shield01Icon, color: "var(--ayy-accent-system)", title: "Secure by default", text: "SSO, audit logs and per-project roles on every plan, not just the expensive one." },
  { icon: GlobeIcon, color: "var(--ayy-accent-product)", title: "Fast everywhere", text: "Pages are served from 40 regions, so the first byte arrives before anyone notices." },
];

const PLANS = [
  { name: "Starter", monthly: 0, text: "For side projects and trying things out.", perks: ["1 project", "Community support"] },
  { name: "Team", monthly: 24, text: "For teams shipping every week.", perks: ["Unlimited projects", "Roles and SSO", "Priority support"], featured: true },
  { name: "Scale", monthly: 99, text: "For companies with real traffic.", perks: ["Everything in Team", "99.99% uptime SLA"] },
];

const QUOTES = [
  { name: "Ana Ruiz", role: "CTO, Fieldnote", text: "We moved four marketing sites over in a week. Nobody on the team wants to go back." },
  { name: "Leo Park", role: "Founder, Tiny Ledger", text: "The first tool where our designer and our engineers agree on what 'done' looks like." },
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
          <Icon icon={Layers01Icon} />
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
          <a className={buttonClass({ variant: "ring", size: "sm" })} href="#start">
            Start free
          </a>
        </NavbarActions>
        <NavbarToggle />
      </Navbar>

      <main id="nw-main">
        <Section center className="ayy-container ayy-bg-grid" aria-labelledby="nw-hero">
          <SectionHeader>
            <Badge variant="ai">New · AI page builder</Badge>
            <h1 className="ayy-h1" id="nw-hero">
              Launch pages your team is proud of
            </h1>
            <p className="ayy-lede">Northwind turns a sentence into a fast, accessible site. Edit it together, publish it anywhere.</p>
            <div className="ayy-cluster">
              <a className={buttonClass({ variant: "ring", size: "lg" })} href="#start">
                Start building free
              </a>
              <a className={buttonClass({ size: "lg", variant: "outline" })} href="#demo">
                Book a demo
              </a>
            </div>
          </SectionHeader>
        </Section>

        <Section className="ayy-container" id="product" aria-labelledby="nw-features">
          <SectionHeader>
            <SectionEyebrow number="01">Why Northwind</SectionEyebrow>
            <SectionTitle id="nw-features">Everything a launch needs</SectionTitle>
          </SectionHeader>
          <div className="ayy-grid" style={min("15rem")}>
            {FEATURES.map((f) => (
              <Card key={f.title}>
                <CardHeader>
                  <IconTile spotColor={f.color}>
                    <Icon icon={f.icon} />
                  </IconTile>
                  <CardTitle>{f.title}</CardTitle>
                  <CardDescription>{f.text}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </Section>

        <Section className="ayy-container" id="pricing" aria-labelledby="nw-pricing">
          <SectionHeader>
            <SectionEyebrow number="02">Pricing</SectionEyebrow>
            <SectionTitle id="nw-pricing">Simple plans that grow with you</SectionTitle>
            <SectionDescription>Per editor, per month. Viewers are always free.</SectionDescription>
            <SegmentedControl aria-label="Billing cycle" value={cycle} onValueChange={setCycle}>
              <SegmentedControlItem value="monthly">Monthly</SegmentedControlItem>
              <SegmentedControlItem value="yearly">Yearly · save 20%</SegmentedControlItem>
            </SegmentedControl>
          </SectionHeader>
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
                        <Icon icon={CheckmarkCircle02Icon} />
                        {perk}
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
                <CardFooter>
                  <a className={buttonClass({ variant: p.featured ? "ring" : "outline", block: true })} href="#start">
                    Choose {p.name}
                  </a>
                </CardFooter>
              </Card>
            ))}
          </div>
        </Section>

        <Section className="ayy-container" id="customers" aria-labelledby="nw-customers">
          <SectionHeader>
            <SectionEyebrow number="03">Customers</SectionEyebrow>
            <SectionTitle id="nw-customers">Teams that switched</SectionTitle>
          </SectionHeader>
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
        </Section>

        <Section className="ayy-container" id="faq" aria-labelledby="nw-faq">
          <SectionHeader>
            <SectionEyebrow number="04">FAQ</SectionEyebrow>
            <SectionTitle id="nw-faq">Questions, answered</SectionTitle>
          </SectionHeader>
          <Accordion single>
            {FAQ.map((f, i) => (
              <AccordionItem key={f.q} label={f.q} open={i === 0}>
                <p>{f.a}</p>
              </AccordionItem>
            ))}
          </Accordion>
        </Section>

        <Section center className="ayy-container" id="start" aria-labelledby="nw-start">
          <SectionHeader>
            <SectionTitle id="nw-start">Your next launch, this afternoon</SectionTitle>
            <SectionDescription>Free for your first project. No card needed.</SectionDescription>
            <form className="ayy-cluster" onSubmit={(e) => e.preventDefault()}>
              <InputGroup size="lg" style={{ inlineSize: "18rem" }}>
                <Icon icon={Mail01Icon} />
                <Input type="email" placeholder="you@company.com" aria-label="Work email" autoComplete="email" required />
              </InputGroup>
              <Button type="submit" size="lg" variant="ring">
                Get started
              </Button>
            </form>
          </SectionHeader>
        </Section>
      </main>

      <Footer>
        <FooterBrand>
          <a href="#top">
            <Icon icon={Layers01Icon} />
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

/* ---- 3. Support inbox with an AI assistant ---- */

const THREADS = [
  { id: "jonah", name: "Jonah Weiss", text: "The export button spins forever on large reports…", time: "2m", status: "Urgent", variant: "destructive" },
  { id: "ana", name: "Ana Ruiz", text: "Can we move our billing date to the 1st?", time: "18m", status: "Billing", variant: "info" },
  { id: "leo", name: "Leo Park", text: "Thanks, that fixed it!", time: "1h", status: "Solved", variant: "success" },
  { id: "priya", name: "Priya Nair", text: "Is there an API for bulk invites?", time: "3h", status: "Question", variant: "muted" },
  { id: "sam", name: "Sam Okafor", text: "SSO login loops back to the start page.", time: "5h", status: "Bug", variant: "warning" },
] as const;

function InboxApp() {
  const jonah = <Avatar size="sm" name="Jonah Weiss" />;
  const agent = <Avatar size="sm" name="Relay AI" fallback="AI" />;
  return (
    <AppFrame
      brand={{ name: "Relay", icon: Message01Icon, href: "#inbox" }}
      groups={[
        {
          label: "Queues",
          items: [
            { href: "#inbox", label: "Inbox", icon: InboxIcon },
            { href: "#mentions", label: "Mentions", icon: Notification01Icon },
            { href: "#sent", label: "Sent", icon: SentIcon },
            { href: "#customers", label: "Customers", icon: UserMultipleIcon },
          ],
        },
      ]}
      tabs={["#inbox", "#mentions", "#sent", "#customers"]}
      current="#inbox"
      barActions={searchButton("Search conversations")}
      footer={
        <AvatarGroup aria-label="3 teammates online">
          <Avatar name="Maya Chen" size="sm" />
          <Avatar name="Ravi Shah" size="sm" />
          <Avatar name="Eli Stone" size="sm" />
        </AvatarGroup>
      }
      mainClassName="pv-app-inbox"
    >
      <section className="pv-app-inbox__list" aria-labelledby="rl-inbox">
        <div className="ayy-stack" style={gap(3)}>
          <div className="ayy-spread">
            <h1 className="ayy-h4" id="rl-inbox">
              Inbox
            </h1>
            <Badge variant="muted">12 open</Badge>
          </div>
          <InputGroup size="sm">
            <Icon icon={Search01Icon} />
            <Input type="search" placeholder="Search" aria-label="Search conversations" aria-keyshortcuts="/" />
            <InputGroupAddon>
              <Kbd>/</Kbd>
            </InputGroupAddon>
          </InputGroup>
        </div>
        <List aria-label="Conversations">
          {THREADS.map((t) => (
            <ListItem key={t.id}>
              <Avatar name={t.name} size="sm" />
              <ListContent>
                <ListTitle>
                  <ListLink href={`#${t.id}`} current={t.id === "jonah"}>
                    {t.name}
                  </ListLink>
                </ListTitle>
                <ListDescription className="ayy-truncate">{t.text}</ListDescription>
                <Badge variant={t.variant}>{t.status}</Badge>
              </ListContent>
              <ListMeta>{t.time}</ListMeta>
            </ListItem>
          ))}
        </List>
      </section>

      <section className="pv-app-inbox__thread" aria-labelledby="rl-thread">
        <div className="ayy-spread">
          <div className="ayy-stack" style={gap(1)}>
            <h2 className="ayy-h5" id="rl-thread">
              Export never finishes
            </h2>
            <p className="ayy-muted">Jonah Weiss · Acme Inc.</p>
          </div>
          <Badge variant="destructive" dot>
            Urgent
          </Badge>
        </div>
        <Chat aria-label="Conversation with Jonah Weiss" className="pv-app-inbox__chat">
          <ChatMessage avatar={jonah}>Hi! The export button spins forever when I pick the full-year report. Smaller ranges work.</ChatMessage>
          <ChatMessage direction="out">Thanks Jonah. Roughly how many rows does the full-year report have?</ChatMessage>
          <ChatMessage avatar={jonah}>About 240,000. It used to work last month.</ChatMessage>
          <ChatTyping avatar={agent} label="Relay AI is drafting a reply" />
          <ChatReplies>
            <Button variant="outline" size="sm">
              <Icon icon={SparklesIcon} />
              Suggest the async export
            </Button>
            <Button variant="outline" size="sm">
              Ask for a screenshot
            </Button>
          </ChatReplies>
        </Chat>
        <form className="ayy-stack" style={gap(2)} onSubmit={(e) => e.preventDefault()}>
          <Textarea rows={2} placeholder="Write a reply…" aria-label="Reply to Jonah Weiss" />
          <div className="ayy-spread">
            <Button type="button" variant="ghost" size="icon" aria-label="Attach a file">
              <Icon icon={Attachment01Icon} />
            </Button>
            <Button type="submit">
              <Icon icon={SentIcon} />
              Send
            </Button>
          </div>
        </form>
      </section>

      <aside className="pv-app-inbox__aside" aria-labelledby="rl-customer">
        <div className="ayy-stack" style={gap(4)}>
          <div className="ayy-cluster" style={gap(3)}>
            <Avatar name="Jonah Weiss" size="lg" />
            <div className="ayy-stack" style={gap(0)}>
              <h2 className="ayy-h5" id="rl-customer">
                Jonah Weiss
              </h2>
              <p className="ayy-muted">Ops lead</p>
            </div>
          </div>
          <DataList>
            <DataListItem label="Company">Acme Inc.</DataListItem>
            <DataListItem label="Plan">
              <Badge variant="info">Scale</Badge>
            </DataListItem>
            <DataListItem label="Customer since">March 2023</DataListItem>
            <DataListItem label="Open tickets">2</DataListItem>
          </DataList>
          <Separator />
          <Alert variant="warning">
            <AlertTitle>SLA in 38 minutes</AlertTitle>
            <AlertDescription>First reply is due at 14:30.</AlertDescription>
          </Alert>
        </div>
      </aside>
    </AppFrame>
  );
}

/* ---- 4. Account settings ---- */

const NOTIFY = [
  { id: "paid", icon: Wallet01Icon, title: "Invoice paid", text: "As soon as a client pays.", on: true },
  { id: "late", icon: Alert02Icon, title: "Late payments", text: "The morning after an invoice is overdue.", on: true },
  { id: "digest", icon: Mail01Icon, title: "Weekly digest", text: "Money in, money out and what's due, every Monday.", on: false },
  { id: "push", icon: SmartPhone01Icon, title: "Push notifications", text: "The same alerts on your phone.", on: false },
];

const INVOICES = [
  { id: "INV-0142", date: "Sep 1, 2026", amount: "$290.00", status: "Paid" },
  { id: "INV-0131", date: "Aug 1, 2026", amount: "$290.00", status: "Paid" },
  { id: "INV-0120", date: "Jul 1, 2026", amount: "$240.00", status: "Paid" },
];

function SettingsApp() {
  const [saving, setSaving] = useState(false);
  const [invoicePage, setInvoicePage] = useState(1);
  const save = () => {
    setSaving(true);
    window.setTimeout(() => setSaving(false), 1200);
  };
  return (
    <AppFrame
      brand={{ name: "Ledger", icon: CreditCardIcon, href: "#home" }}
      groups={[
        {
          label: "Books",
          items: [
            { href: "#home", label: "Home", icon: Home01Icon },
            { href: "#invoices", label: "Invoices", icon: Invoice01Icon },
            { href: "#clients", label: "Clients", icon: UserGroupIcon },
            { href: "#settings", label: "Settings", icon: Settings01Icon },
          ],
        },
      ]}
      tabs={["#home", "#invoices", "#clients", "#settings"]}
      current="#settings"
      barActions={<Avatar name="Dana Levi" size="sm" />}
      footer={
        <>
          <AppShellLink href="#help">
            <Icon icon={HelpCircleIcon} />
            Help
          </AppShellLink>
          {account("Dana Levi")}
        </>
      }
    >
      <div className="ayy-stack" style={gap(6)}>
        <PageHeader>
          <Breadcrumb items={[{ label: "Settings", href: "#settings" }, { label: "Profile" }]} />
          <PageHeaderTitle>Settings</PageHeaderTitle>
          <PageHeaderDescription>Your profile, notifications and plan.</PageHeaderDescription>
        </PageHeader>

        <Tabs defaultValue="profile">
          <TabsList aria-label="Settings sections">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <div className="ayy-split" style={min("18rem")}>
              <Card>
                <CardHeader>
                  <CardTitle>Profile</CardTitle>
                  <CardDescription>This is how clients and teammates see you.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="ayy-stack" style={gap(4)}>
                    <div className="ayy-grid" style={{ ...min("12rem"), ...gap(4) }}>
                      <Field>
                        <Label htmlFor="lg-name">Full name</Label>
                        <Input id="lg-name" defaultValue="Dana Levi" autoComplete="name" />
                      </Field>
                      <Field>
                        <Label htmlFor="lg-email">Email</Label>
                        <Input id="lg-email" type="email" defaultValue="dana@ledger.app" autoComplete="email" />
                      </Field>
                    </div>
                    <Field>
                      <Label htmlFor="lg-role">Role</Label>
                      <Select id="lg-role" defaultValue="finance">
                        <option value="owner">Owner</option>
                        <option value="finance">Finance manager</option>
                        <option value="viewer">Viewer</option>
                      </Select>
                    </Field>
                    <Field>
                      <Label htmlFor="lg-photo">Photo</Label>
                      <div className="ayy-cluster" style={gap(3)}>
                        <Avatar name="Dana Levi" />
                        <Dropzone
                          id="lg-photo"
                          compact
                          accept="image/png, image/jpeg"
                          icon={null}
                          title={
                            <>
                              Drop a photo or <span className="ayy-link">choose one</span>
                            </>
                          }
                          hint="Square, at least 256 × 256"
                          style={{ flex: 1 }}
                        />
                      </div>
                    </Field>
                    <Field>
                      <Label htmlFor="lg-bio">About</Label>
                      <Textarea id="lg-bio" rows={3} defaultValue="Keeps the books tidy and the invoices on time." />
                      <FieldHint>Shown on invoices you send.</FieldHint>
                    </Field>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button loading={saving} onClick={save}>
                    {saving ? "Saving…" : "Save changes"}
                  </Button>
                  <Button variant="ghost">Cancel</Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Plan</CardTitle>
                  <CardDescription>Business, billed yearly.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="ayy-stack" style={gap(4)}>
                    <SegmentedControl aria-label="Billing cycle" defaultValue="yearly" full>
                      <SegmentedControlItem value="monthly">Monthly</SegmentedControlItem>
                      <SegmentedControlItem value="yearly">Yearly</SegmentedControlItem>
                    </SegmentedControl>
                    <div className="ayy-stack" style={gap(2)}>
                      <div className="ayy-spread">
                        <span>Invoices this month</span>
                        <span className="ayy-muted">164 of 250</span>
                      </div>
                      <Progress value={66} aria-label="Invoices used this month" />
                    </div>
                    <Field inline>
                      <Checkbox id="lg-receipts" defaultChecked />
                      <Label htmlFor="lg-receipts">Email receipts to accounting</Label>
                    </Field>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Email me about</CardTitle>
              </CardHeader>
              <CardContent>
                <List divided aria-label="Notifications">
                  {NOTIFY.map((n) => (
                    <ListItem key={n.id}>
                      <IconTile size="sm">
                        <Icon icon={n.icon} />
                      </IconTile>
                      <ListContent>
                        <ListTitle htmlFor={`lg-${n.id}`}>{n.title}</ListTitle>
                        <ListDescription>{n.text}</ListDescription>
                      </ListContent>
                      <Switch id={`lg-${n.id}`} defaultChecked={n.on} />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="billing">
            <div className="ayy-stack" style={gap(4)}>
              <DataList row>
                <DataListItem label="Plan">Business</DataListItem>
                <DataListItem label="Next invoice">Oct 1, 2026</DataListItem>
                <DataListItem label="Card">•••• 4242</DataListItem>
              </DataList>
              <Card>
                <CardHeader>
                  <CardTitle>Invoices</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table compact>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Invoice</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead numeric>Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {INVOICES.map((inv) => (
                        <TableRow key={inv.id}>
                          <TableCell>
                            <span className="ayy-mono">{inv.id}</span>
                          </TableCell>
                          <TableCell>{inv.date}</TableCell>
                          <TableCell>
                            <Badge variant="success">{inv.status}</Badge>
                          </TableCell>
                          <TableCell numeric>{inv.amount}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
                <CardFooter>
                  <Pagination page={invoicePage} count={4} onPageChange={setInvoicePage} />
                </CardFooter>
              </Card>
              <Card>
                <EmptyState compact>
                  <IconTile size="sm">
                    <Icon icon={CreditCardIcon} />
                  </IconTile>
                  <EmptyStateTitle>No backup card</EmptyStateTitle>
                  <EmptyStateDescription>If •••• 4242 is declined, we'll try this one before pausing your account.</EmptyStateDescription>
                  <EmptyStateActions>
                    <Button size="sm" variant="outline">
                      <Icon icon={Add01Icon} />
                      Add a card
                    </Button>
                  </EmptyStateActions>
                </EmptyState>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        <Alert variant="destructive">
          <AlertTitle>Delete workspace</AlertTitle>
          <AlertDescription>Removes every invoice, client and report. This can’t be undone.</AlertDescription>
          <AlertActions>
            <Button variant="destructive" size="sm">
              <Icon icon={Mail01Icon} />
              Email me a confirmation link
            </Button>
          </AlertActions>
        </Alert>
      </div>
    </AppFrame>
  );
}

/* ---- 5. Project tracker: onboarding, and the empty, loading and error states ---- */

const TASKS = [
  { id: "t1", title: "Write the launch post", project: "Website", due: "Today", who: "Maya Chen", done: false },
  { id: "t2", title: "Review the pricing page copy", project: "Website", due: "Today", who: "Ravi Shah", done: false },
  { id: "t3", title: "Fix the signup email in Outlook", project: "Growth", due: "Tomorrow", who: "Eli Stone", done: false },
  { id: "t4", title: "Plan the October release", project: "Product", due: "Fri", who: "Maya Chen", done: true },
];

function TrackerApp() {
  const [view, setView] = useState("today");
  const [retrying, setRetrying] = useState(false);
  const retry = () => {
    setRetrying(true);
    window.setTimeout(() => setRetrying(false), 1500);
  };
  const [projects, setProjects] = useState<string[]>([]);
  const inView = view === "today" ? TASKS.filter((t) => t.due === "Today") : view === "upcoming" ? [] : TASKS;
  const tasks = projects.length ? inView.filter((t) => projects.includes(t.project)) : inView;
  const toggleProject = (project: string) =>
    setProjects((list) => (list.includes(project) ? list.filter((p) => p !== project) : [...list, project]));
  return (
    <AppFrame
      brand={{ name: "Orbit", icon: Rocket01Icon, href: "#tasks" }}
      groups={[
        {
          label: "Work",
          items: [
            { href: "#tasks", label: "My tasks", icon: Task01Icon },
            { href: "#projects", label: "Projects", icon: Folder01Icon },
            { href: "#calendar", label: "Calendar", icon: Calendar03Icon },
            { href: "#inbox", label: "Inbox", icon: InboxIcon },
          ],
        },
        {
          label: "Team",
          items: [
            { href: "#members", label: "Members", icon: UserGroupIcon },
            { href: "#settings", label: "Settings", icon: Settings01Icon },
          ],
        },
      ]}
      tabs={["#tasks", "#projects", "#calendar", "#inbox"]}
      current="#tasks"
      barActions={searchButton("Search tasks")}
      footer={account("Maya Chen")}
    >
      <div className="ayy-stack" style={gap(5)}>
        <PageHeader>
          <PageHeaderTitle>My tasks</PageHeaderTitle>
          <PageHeaderDescription>What's on your plate across every project.</PageHeaderDescription>
          <PageHeaderActions>
            <Button aria-keyshortcuts="C">
              <Icon icon={Add01Icon} />
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
                              {t.project} · due {t.due}
                            </ListDescription>
                          </ListContent>
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
                          <Icon icon={Calendar03Icon} />
                        </IconTile>
                        <EmptyStateTitle>Nothing coming up</EmptyStateTitle>
                        <EmptyStateDescription>Tasks with a due date after today show up here.</EmptyStateDescription>
                        <EmptyStateActions>
                          <Button size="sm" variant="outline">
                            <Icon icon={Add01Icon} />
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
              <Icon icon={Alert02Icon} />
              <AlertTitle>GitHub sync failed</AlertTitle>
              <AlertDescription>We couldn't reach github.com. Your tasks are safe; new pull requests won't show up until it syncs.</AlertDescription>
              <AlertActions>
                <Button size="sm" variant="outline" loading={retrying} onClick={retry}>
                  {retrying ? null : <Icon icon={RefreshIcon} />}
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

/* ---- 6. Online store: filters, a product grid, a cart drawer ---- */

const ROASTS = [
  { id: "guji", name: "Ethiopia Guji", notes: "Blueberry, jasmine, honey", category: "single", roast: "Light", price: 18, spot: "var(--ayy-accent-ai)" },
  { id: "huila", name: "Colombia Huila", notes: "Red apple, caramel, cocoa", category: "single", roast: "Medium", price: 16, spot: "var(--ayy-accent-marketing)" },
  { id: "kiambu", name: "Kenya Kiambu", notes: "Blackcurrant, grapefruit", category: "single", roast: "Light", price: 21, spot: "var(--ayy-accent-brand)" },
  { id: "house", name: "House blend", notes: "Milk chocolate, hazelnut", category: "blend", roast: "Medium", price: 13, spot: "var(--ayy-accent-research)" },
  { id: "night", name: "Night shift", notes: "Dark chocolate, molasses", category: "blend", roast: "Dark", price: 14, spot: "var(--ayy-accent-product)" },
  { id: "decaf", name: "Swiss water decaf", notes: "Cocoa, plum, brown sugar", category: "decaf", roast: "Medium", price: 15, spot: "var(--ayy-accent-system)" },
];

const SHOP_CATEGORIES = [
  { value: "all", label: "All" },
  { value: "single", label: "Single origin" },
  { value: "blend", label: "Blends" },
  { value: "decaf", label: "Decaf" },
];

const dollars = (n: number) => `$${n.toFixed(2)}`;

function StoreApp() {
  const [category, setCategory] = useState("all");
  const [[low, high], setPrice] = useState<[number, number]>([10, 24]);
  const [order, setOrder] = useState("popular");
  const [cart, setCart] = useState<Record<string, number>>({ guji: 1, house: 2 });
  const [cartOpen, setCartOpen] = useState(false);
  const [delivery, setDelivery] = useState("standard");

  const inCategory = (id: string) => (id === "all" ? ROASTS : ROASTS.filter((r) => r.category === id));
  const shown = inCategory(category)
    .filter((r) => r.price >= low && r.price <= high)
    .sort((a, b) => (order === "price-low" ? a.price - b.price : order === "price-high" ? b.price - a.price : 0));
  const count = Object.values(cart).reduce((a, b) => a + b, 0);
  const subtotal = Object.entries(cart).reduce((sum, [id, qty]) => sum + (ROASTS.find((r) => r.id === id)?.price ?? 0) * qty, 0);
  const shipping = delivery === "express" ? 9 : 0;
  const add = (id: string) => setCart((c) => ({ ...c, [id]: (c[id] ?? 0) + 1 }));
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

  return (
    <div className="pv-app pv-app--page">
      <a className="ayy-skip-link" href="#em-main">
        Skip to content
      </a>
      <Navbar>
        <NavbarBrand href="#shop">
          <Icon icon={Coffee02Icon} />
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
            <Icon icon={ShoppingBag01Icon} />
            Cart
            <Badge>{count}</Badge>
          </Button>
        </NavbarActions>
        <NavbarToggle />
      </Navbar>

      <main id="em-main">
        <Section className="ayy-container" aria-labelledby="em-title">
          <SectionHeader>
            <p className="ayy-eyebrow">Roasted every Tuesday</p>
            <h1 className="ayy-h2" id="em-title">
              Coffee from farms we know by name
            </h1>
            <p className="ayy-lede">250 g bags, shipped the day after roasting. Standard delivery is free.</p>
          </SectionHeader>

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
              <div className="ayy-cluster" style={gap(4)}>
                <div className="ayy-stack" style={{ ...gap(1), inlineSize: "13rem" }}>
                  <div className="ayy-spread">
                    <span className="ayy-label" id="em-price">
                      Price
                    </span>
                    <span className="ayy-muted">
                      ${low} – ${high}
                    </span>
                  </div>
                  <SliderRange
                    aria-labelledby="em-price"
                    min={10}
                    max={24}
                    value={[low, high]}
                    onValueChange={setPrice}
                    labels={["Lowest price", "Highest price"]}
                  />
                </div>
                <div style={{ inlineSize: "12rem" }}>
                  <Select size="sm" aria-label="Sort by" value={order} onChange={(e) => setOrder(e.target.value)}>
                    <option value="popular">Most popular</option>
                    <option value="price-low">Price, low to high</option>
                    <option value="price-high">Price, high to low</option>
                  </Select>
                </div>
              </div>
            </div>

            <div role="status">
              {shown.length ? (
                // At most 14rem a column, and never fewer than two: a phone shows two products a row.
                <div className="ayy-grid" style={{ ...min("min(14rem, calc(50% - var(--ayy-space-2)))"), ...gap(4) }}>
                  {shown.map((r) => (
                    <Card key={r.id} style={{ "--ayy-spot": r.spot } as CSSProperties}>
                      <CardMedia>
                        <div className="ayy-bg-grid pv-app-product">
                          <IconTile size="lg">
                            <Icon icon={Coffee02Icon} />
                          </IconTile>
                        </div>
                      </CardMedia>
                      <CardHeader>
                        <CardTitle>{r.name}</CardTitle>
                        <CardDescription>
                          {r.roast} roast · {r.notes}
                        </CardDescription>
                      </CardHeader>
                      <CardFooter>
                        <div className="ayy-spread" style={{ inlineSize: "100%" }}>
                          <span className="ayy-h6">${r.price}</span>
                          <Button size="sm" variant="outline" onClick={() => add(r.id)} aria-label={`Add ${r.name} to the cart`}>
                            <Icon icon={Add01Icon} />
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
                    <Icon icon={Coffee02Icon} />
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
        </Section>
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
                      <ListItem key={id} style={{ "--ayy-spot": r.spot } as CSSProperties}>
                        <IconTile size="sm">
                          <Icon icon={Coffee02Icon} />
                        </IconTile>
                        <ListContent>
                          <ListTitle>{r.name}</ListTitle>
                          <ListDescription>250 g · ${r.price}</ListDescription>
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
                <DataList row>
                  <DataListItem label="Subtotal">{dollars(subtotal)}</DataListItem>
                  <DataListItem label="Delivery">{shipping ? dollars(shipping) : "Free"}</DataListItem>
                  <DataListItem label="Total">
                    <strong>{dollars(subtotal + shipping)}</strong>
                  </DataListItem>
                </DataList>
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
            <Icon icon={Coffee02Icon} />
            Ember
          </a>
          <p>Small-batch coffee from Lisbon.</p>
        </FooterBrand>
        <FooterNav>
          <FooterGroup label="Shop">
            <FooterLink href="#shop">Coffee</FooterLink>
            <FooterLink href="#subscriptions">Subscriptions</FooterLink>
          </FooterGroup>
          <FooterGroup label="Help">
            <FooterLink href="#shipping">Shipping</FooterLink>
            <FooterLink href="#contact">Contact</FooterLink>
          </FooterGroup>
        </FooterNav>
        <FooterBottom>
          <p>© 2026 Ember Roasters</p>
        </FooterBottom>
      </Footer>
    </div>
  );
}

/* ---- 7. Booking app: a day strip, class cards, a booking summary ---- */

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
      brand={{ name: "Haven", icon: Yoga01Icon, href: "#schedule" }}
      groups={[
        {
          label: "Studio",
          items: [
            { href: "#schedule", label: "Schedule", icon: Calendar03Icon },
            { href: "#bookings", label: "My bookings", icon: Ticket01Icon },
            { href: "#teachers", label: "Teachers", icon: UserGroupIcon },
            { href: "#profile", label: "Profile", icon: UserCircleIcon },
          ],
        },
      ]}
      tabs={["#schedule", "#bookings", "#teachers", "#profile"]}
      current="#schedule"
      footer={account("Dana Levi")}
    >
      <div className="ayy-stack" style={gap(5)}>
        <PageHeader>
          <PageHeaderTitle>Book a class</PageHeaderTitle>
          <PageHeaderDescription>October 13–19 · 6 classes left on your 10-class pass.</PageHeaderDescription>
        </PageHeader>

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
                    <Icon icon={Calendar03Icon} />
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
                  <DataList>
                    <DataListItem label="Class">{pick.name}</DataListItem>
                    <DataListItem label="Time">
                      {pick.time}, {pick.length} min
                    </DataListItem>
                    <DataListItem label="Teacher">{pick.teacher}</DataListItem>
                  </DataList>
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
  theme: ThemeName;
  density: Exclude<DensityMode, "auto">;
  /** Component slugs used, for the "Built with" links. */
  uses: string[];
  /** A prompt that builds a screen like this with ayywi, for "Build it with AI". */
  prompt: string;
  Component: ComponentType;
}

const APP_FRAME = "an ayywi App shell: a sidebar on wide screens; on phones a top bar with the brand and one action, and a Bottom nav with the same top destinations";

export const showcaseApps: ShowcaseApp[] = [
  {
    id: "dashboard",
    name: "Pulse",
    kind: "Analytics dashboard",
    description: "KPIs with sparklines, a visitors chart against last month, a sortable top-pages table, traffic sources and goals. Dense and dark for people who live in it all day. Seven destinations, so phones get four tabs and More.",
    theme: "dark",
    density: "compact",
    uses: ["app-shell", "bottom-nav", "page-header", "segmented-control", "card", "stat", "chart", "badge", "table", "pagination", "progress", "alert", "button", "avatar", "icon"],
    prompt: `Build an analytics dashboard with ayywi, in ${APP_FRAME}. Seven destinations in two sidebar groups (Workspace: Overview, Reports, Audiences, Projects; Account: Integrations, Billing, Settings), so the bottom nav shows the first four and a More tab that opens the sidebar as a drawer.

The Overview page: a Page header with a date-range Segmented control (7d, 30d, 90d) and an outline Export button; four KPI cards (Stat, a success or warning Badge and a Sparkline) in an .ayy-grid; a Visitors card with a LineChart of this month against last month (the comparison series dashed); then an .ayy-split with a Top pages table (compact, numeric columns, the Views column sortable, status badges, Pagination in the card footer) beside a Traffic sources card with a BarList, a Goals card of Progress bars and an info Alert.

Dark theme, compact density. ayywi components and tokens only; run npx ayywi lint when you're done.`,
    Component: DashboardApp,
  },
  {
    id: "landing",
    name: "Northwind",
    kind: "Marketing site",
    description: "Hero, features, pricing with a billing toggle, a customer carousel, FAQ and a footer. The navbar folds into a menu on phones.",
    theme: "light",
    density: "comfortable",
    uses: ["navbar", "section", "card", "icon-tile", "segmented-control", "stat", "list", "badge", "carousel", "accordion", "input-group", "footer", "button", "avatar"],
    prompt: `Build a one-page marketing site with ayywi: skip link, a Navbar (brand, four links, a ring "Start free" button, a NavbarToggle for phones), then <main> made of .ayy-section blocks at .ayy-container width, then a Footer.

Sections: a centred hero (AI badge, h1, lede, a ring and an outline button, .ayy-bg-grid behind it); three feature cards with IconTiles in different accents; pricing with a Monthly/Yearly Segmented control and three plan cards (the middle one featured with a "Most popular" badge, perks in a compact List); a Carousel of customer quotes; an FAQ Accordion (single); a closing section with an email InputGroup and a submit button.

Light theme. One ring call to action per view; everything else outline or ghost. Run npx ayywi lint when you're done.`,
    Component: LandingApp,
  },
  {
    id: "inbox",
    name: "Relay",
    kind: "Support inbox",
    description: "Conversations, a thread with AI-suggested replies, and customer details, in three panes on wide screens. On a phone it's the list, with tabs below.",
    theme: "dark-soft",
    density: "comfortable",
    uses: ["app-shell", "bottom-nav", "list", "input-group", "kbd", "chat", "avatar", "badge", "textarea", "button", "data-list", "alert", "separator"],
    prompt: `Build a support inbox with ayywi, in ${APP_FRAME} (Inbox, Mentions, Sent, Customers).

The main area has three panes: a conversation List (avatar, name as a ListLink, a truncated preview, a status Badge, the time in ListMeta, the open one marked current) under a search InputGroup with a Kbd "/" hint; the thread (a Chat with incoming and outgoing messages, a typing indicator and suggested replies, then a reply form with a Textarea, an attach icon button and Send); and a customer panel (Avatar, a Data list, a warning Alert for the SLA). The panes collapse to the list on phones.

Dark-soft theme. ayywi components and tokens only; run npx ayywi lint when you're done.`,
    Component: InboxApp,
  },
  {
    id: "settings",
    name: "Ledger",
    kind: "Account settings",
    description: "A profile form that shows it's saving, notification switches in a list, invoices with pagination and an empty state. Light gray with touch-sized controls.",
    theme: "light-gray",
    density: "touch",
    uses: ["app-shell", "bottom-nav", "page-header", "breadcrumb", "tabs", "card", "field", "input", "select", "textarea", "segmented-control", "progress", "checkbox", "list", "switch", "data-list", "table", "pagination", "empty-state", "alert"],
    prompt: `Build an account settings page with ayywi, in ${APP_FRAME} (Home, Invoices, Clients, Settings; help and the account in the sidebar footer).

A Page header with a Breadcrumb (Settings › Profile), then Tabs: Profile (an .ayy-split of a form card — name, email, role Select, About Textarea with a hint, a Save button that shows loading while it saves — beside a Plan card with a full-width Segmented control, a usage Progress and a checkbox); Notifications (a divided List of rows with an IconTile, a title that labels the row's Switch, and a description); Billing (a row Data list, an invoices Table with Pagination, and a compact Empty state for "No backup card"). A destructive Alert for deleting the workspace at the end.

Light-gray theme, touch density. Run npx ayywi lint when you're done.`,
    Component: SettingsApp,
  },
  {
    id: "tracker",
    name: "Orbit",
    kind: "Project tracker",
    description: "Onboarding steps, a task list filtered by project chips with an empty state for each case, an error with a retry that shows it's working, and skeletons while activity loads.",
    theme: "light",
    density: "compact",
    uses: ["app-shell", "bottom-nav", "page-header", "steps", "segmented-control", "chip", "kbd", "list", "checkbox", "empty-state", "alert", "skeleton", "card", "button", "avatar"],
    prompt: `Build a task tracker home screen with ayywi, in ${APP_FRAME} (My tasks, Projects, Calendar, Inbox in the tabs; Members and Settings behind More).

A Page header with one primary "New task" button. An onboarding card with Steps (Create a project ✓, Invite your team — current, Connect GitHub) and two buttons. Then an .ayy-split: a Today/Upcoming/All Segmented control with a Kbd hint, project filter chips (ChipButton with counts, in a scrolling ChipGroup), and a card that holds either a divided List of tasks (a Checkbox labelled by the title, project and due date, the assignee's Avatar) or a compact Empty state when a view has nothing (another, with a "Show every project" button, when the chips filter everything out); beside it a destructive Alert "GitHub sync failed" whose Try again button shows loading, and an Activity card of Skeleton rows while it loads (aria-busy).

Light theme, compact density. Every state — empty, loading, error — uses an ayywi component. Run npx ayywi lint when you're done.`,
    Component: TrackerApp,
  },
  {
    id: "store",
    name: "Ember",
    kind: "Online store",
    description: "A coffee shop: category chips with counts, a price range and a sort, a product grid with an empty state, and a cart drawer with quantities, delivery options and the total.",
    theme: "dark",
    density: "comfortable",
    uses: ["navbar", "section", "chip", "slider", "select", "card", "icon-tile", "badge", "empty-state", "dialog", "list", "number-field", "choice-card", "data-list", "footer", "button", "toast"],
    prompt: `Build an online coffee store with ayywi: a Navbar (brand, Shop, Subscriptions, Brewing guides, Our farms, an outline Cart button with a Badge count, a NavbarToggle for phones), a Section at .ayy-container width, and a Footer.

The shop: an eyebrow, an h2 and a lede; a filter bar (.ayy-spread) with radio Chips for the kind of coffee (with counts), a SliderRange for the price with the range in text, and a Select to sort; then an .ayy-grid of product Cards (CardMedia with an IconTile on .ayy-bg-grid in the product's --ayy-spot colour, the name, the roast and tasting notes, the price and an outline Add button), or an Empty state with Reset filters when nothing matches.

The cart is a Dialog with side="end": a divided List of items with a small NumberField each, a Delivery ChoiceGroup (Standard free, Express $9), a Data list with the subtotal, delivery and total, and a footer with Keep shopping and one primary Check out that shows a toast.

Dark theme. Run npx ayywi lint when you're done.`,
    Component: StoreApp,
  },
  {
    id: "booking",
    name: "Haven",
    kind: "Booking app",
    description: "A yoga studio's schedule: a day strip of compact choice cards, style chips, classes as choice cards with spots left, and a booking card with a studio combobox and a spots stepper. Touch-sized for phones.",
    theme: "light",
    density: "touch",
    uses: ["app-shell", "bottom-nav", "page-header", "choice-card", "chip", "empty-state", "card", "combobox", "data-list", "number-field", "field", "button", "toast"],
    prompt: `Build a class booking app for a yoga studio with ayywi, in ${APP_FRAME} (Schedule, My bookings, Teachers, Profile).

The Schedule page: a Page header (the week and the classes left on the pass); a day strip — a scrolling ChoiceGroup of compact ChoiceCards, one per day with how many classes it has; then an .ayy-split: on the left, style filters (ChipButtons with counts in a scrolling ChipGroup) above the day's classes as a ChoiceGroup of ChoiceCards (time and name as the title, teacher, length and style as the description, spots left as meta, a full class disabled), or a compact Empty state when nothing matches; on the right, a Your booking Card with a Combobox to pick the studio, a Data list of the chosen class, a NumberField for spots (max 2) with a hint, and one primary full-width Book button that shows a toast.

Light theme, touch density. Run npx ayywi lint when you're done.`,
    Component: BookingApp,
  },
];
