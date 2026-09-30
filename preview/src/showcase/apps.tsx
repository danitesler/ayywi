// Four full screens built only from ayywi components, tokens and layout utilities. The pv-app-* classes in preview.css
// only place the pieces (grids, columns, what hides on small screens); every colour, size and control comes from ayywi.
import type { ComponentType, CSSProperties } from "react";
import {
  Analytics01Icon,
  Attachment01Icon,
  ChartLineData01Icon,
  CheckmarkCircle02Icon,
  CreditCardIcon,
  DashboardSquare01Icon,
  Download01Icon,
  FlashIcon,
  Folder01Icon,
  GlobeIcon,
  InboxIcon,
  Layers01Icon,
  Mail01Icon,
  Message01Icon,
  Notification01Icon,
  Search01Icon,
  SentIcon,
  Settings01Icon,
  Shield01Icon,
  SparklesIcon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons";
import type { DensityMode, ThemeName } from "ayywi";
import {
  Alert,
  AlertActions,
  AlertDescription,
  AlertTitle,
  AppShell,
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
  Breadcrumb,
  Button,
  buttonClass,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Carousel,
  CarouselSlide,
  Chat,
  ChatMessage,
  ChatReplies,
  ChatTyping,
  Checkbox,
  DataList,
  DataListItem,
  Field,
  FieldHint,
  Icon,
  IconTile,
  Input,
  Label,
  Navbar,
  NavbarActions,
  NavbarBrand,
  NavbarLink,
  NavbarNav,
  Progress,
  Radio,
  RadioGroup,
  Section,
  SectionDescription,
  SectionEyebrow,
  SectionHeader,
  SectionTitle,
  Select,
  Separator,
  Stat,
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
} from "ayywi/react";

const gap = (space: number) => ({ "--ayy-gap": `var(--ayy-space-${space})` }) as CSSProperties;
const min = (size: string) => ({ "--ayy-min": size }) as CSSProperties;

/* ---- 1. Analytics dashboard ---- */

const KPIS = [
  { label: "Visitors", value: "48.2k", change: "+12.4%", up: true },
  { label: "Conversion rate", value: "3.8", unit: "%", change: "+0.6 pt", up: true },
  { label: "Revenue", value: "$92.4k", change: "+8.1%", up: true },
  { label: "Avg. session", value: "4m 12s", change: "−9s", up: false },
];

const PAGES = [
  { path: "/pricing", views: "12,480", share: 26, status: "Trending", variant: "success" },
  { path: "/blog/design-tokens", views: "9,214", share: 19, status: "New", variant: "info" },
  { path: "/", views: "8,902", share: 18, status: "Steady", variant: "muted" },
  { path: "/docs/install", views: "6,377", share: 13, status: "Steady", variant: "muted" },
  { path: "/changelog", views: "2,105", share: 4, status: "Dropping", variant: "warning" },
] as const;

const GOALS = [
  { label: "Quarterly signups", value: 82, note: "8,200 of 10,000", tone: "success" },
  { label: "Trial to paid", value: 54, note: "54% of target", tone: "default" },
  { label: "Churn budget used", value: 71, note: "Watch this one", tone: "warning" },
] as const;

function DashboardApp() {
  return (
    <AppShell className="pv-app">
      <AppShellSidebar>
        <AppShellBrand href="#overview">
          <Icon icon={ChartLineData01Icon} />
          Pulse
        </AppShellBrand>
        <AppShellNav aria-label="Pulse">
          <AppShellGroup label="Workspace">
            <AppShellItem>
              <AppShellLink href="#overview" current>
                <Icon icon={DashboardSquare01Icon} />
                Overview
              </AppShellLink>
            </AppShellItem>
            <AppShellItem>
              <AppShellLink href="#reports">
                <Icon icon={Analytics01Icon} />
                Reports
              </AppShellLink>
            </AppShellItem>
            <AppShellItem>
              <AppShellLink href="#audiences">
                <Icon icon={UserGroupIcon} />
                Audiences
              </AppShellLink>
            </AppShellItem>
            <AppShellItem>
              <AppShellLink href="#projects">
                <Icon icon={Folder01Icon} />
                Projects
              </AppShellLink>
            </AppShellItem>
          </AppShellGroup>
          <AppShellGroup label="Account">
            <AppShellItem>
              <AppShellLink href="#settings">
                <Icon icon={Settings01Icon} />
                Settings
              </AppShellLink>
            </AppShellItem>
          </AppShellGroup>
        </AppShellNav>
        <AppShellFooter>
          <div className="ayy-cluster">
            <Avatar name="Maya Chen" size="sm" />
            <span className="pv-app-hide-sm">Maya Chen</span>
          </div>
        </AppShellFooter>
      </AppShellSidebar>
      <AppShellMain>
        <div className="ayy-stack" style={gap(5)}>
          <header className="pv-app-head">
            <div className="ayy-stack" style={gap(1)}>
              <h1 className="ayy-h3">Overview</h1>
              <p className="ayy-muted">Traffic and revenue across every site in this workspace.</p>
            </div>
            <div className="ayy-cluster">
              <Select size="sm" aria-label="Date range" defaultValue="30d" wrapperProps={{ className: "pv-app-fit" }}>
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
              </Select>
              <Button size="sm" variant="outline">
                <Icon icon={Download01Icon} />
                Export
              </Button>
            </div>
          </header>

          <div className="ayy-grid" style={{ ...min("11rem"), ...gap(3) }}>
            {KPIS.map((k) => (
              <Card key={k.label}>
                <CardContent>
                  <div className="ayy-stack" style={gap(2)}>
                    <Stat labelFirst size="sm" label={k.label} value={k.value} unit={k.unit} />
                    <div>
                      <Badge variant={k.up ? "success" : "warning"} dot>
                        {k.change}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="pv-app-split">
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
                      <TableHead numeric>Views</TableHead>
                      <TableHead numeric>Share</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {PAGES.map((p) => (
                      <TableRow key={p.path}>
                        <TableCell>
                          <span className="ayy-mono">{p.path}</span>
                        </TableCell>
                        <TableCell>
                          <Badge variant={p.variant}>{p.status}</Badge>
                        </TableCell>
                        <TableCell numeric>{p.views}</TableCell>
                        <TableCell numeric>{p.share}%</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <div className="ayy-stack" style={gap(4)}>
              <Card>
                <CardHeader>
                  <CardTitle>Goals</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="ayy-stack" style={gap(4)}>
                    {GOALS.map((g) => (
                      <div key={g.label} className="ayy-stack" style={gap(2)}>
                        <div className="pv-app-row">
                          <span>{g.label}</span>
                          <span className="ayy-muted">{g.note}</span>
                        </div>
                        <Progress value={g.value} tone={g.tone} aria-label={g.label} />
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
      </AppShellMain>
    </AppShell>
  );
}

/* ---- 2. Marketing landing page ---- */

const FEATURES = [
  { icon: FlashIcon, color: "var(--ayy-accent-marketing)", title: "Ship in an afternoon", text: "Start from a template, connect your data, publish. No build pipeline to babysit." },
  { icon: Shield01Icon, color: "var(--ayy-accent-system)", title: "Secure by default", text: "SSO, audit logs and per-project roles on every plan, not just the expensive one." },
  { icon: GlobeIcon, color: "var(--ayy-accent-product)", title: "Fast everywhere", text: "Pages are served from 40 regions, so the first byte arrives before anyone notices." },
];

const PLANS = [
  { name: "Starter", price: "$0", text: "For side projects and trying things out.", perks: ["1 project", "Community support"], cta: "outline" },
  { name: "Team", price: "$24", text: "For teams shipping every week.", perks: ["Unlimited projects", "Roles and SSO", "Priority support"], cta: "primary", popular: true },
  { name: "Scale", price: "$99", text: "For companies with real traffic.", perks: ["Everything in Team", "99.99% uptime SLA"], cta: "outline" },
] as const;

const QUOTES = [
  { name: "Ana Ruiz", role: "CTO, Fieldnote", text: "We moved four marketing sites over in a week. Nobody on the team wants to go back." },
  { name: "Leo Park", role: "Founder, Tiny Ledger", text: "The first tool where our designer and our engineers agree on what 'done' looks like." },
  { name: "Sam Okafor", role: "Head of Growth, Loop", text: "Launch pages used to take a sprint. Now they take an afternoon and a coffee." },
  { name: "Priya Nair", role: "Engineer, Orbit", text: "Dark mode, RTL and keyboard support were there before we thought to ask." },
];

function LandingApp() {
  return (
    <div className="pv-app pv-app--page">
      <Navbar>
        <NavbarBrand href="#top">
          <Icon icon={Layers01Icon} />
          Northwind
        </NavbarBrand>
        <NavbarNav className="pv-app-hide-sm">
          <NavbarLink href="#product" current>
            Product
          </NavbarLink>
          <NavbarLink href="#pricing">Pricing</NavbarLink>
          <NavbarLink href="#customers">Customers</NavbarLink>
        </NavbarNav>
        <NavbarActions>
          <a className={buttonClass({ variant: "ghost", size: "sm", className: "pv-app-hide-sm" })} href="#login">
            Log in
          </a>
          <a className={buttonClass({ size: "sm" })} href="#start">
            Start free
          </a>
        </NavbarActions>
      </Navbar>

      <main>
        <Section center className="ayy-container pv-app-hero" aria-labelledby="nw-hero">
          <SectionHeader>
            <div>
              <Badge variant="ai">New · AI page builder</Badge>
            </div>
            <h1 className="ayy-h1" id="nw-hero">
              Launch pages your team is proud of
            </h1>
            <p className="ayy-lede">Northwind turns a sentence into a fast, accessible site. Edit it together, publish it anywhere.</p>
            <div className="ayy-cluster pv-app-center">
              <a className={buttonClass({ size: "lg" })} href="#start">
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
          </SectionHeader>
          <div className="ayy-grid" style={min("15rem")}>
            {PLANS.map((p) => (
              <Card key={p.name} className={"popular" in p ? "pv-app-plan--popular" : undefined}>
                <CardHeader>
                  <div className="pv-app-row">
                    <CardTitle>{p.name}</CardTitle>
                    {"popular" in p ? <Badge variant="info">Most popular</Badge> : null}
                  </div>
                  <Stat value={p.price} unit="/ month" />
                  <CardDescription>{p.text}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="pv-app-perks">
                    {p.perks.map((perk) => (
                      <li key={perk}>
                        <Icon icon={CheckmarkCircle02Icon} />
                        {perk}
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <a className={buttonClass({ variant: p.cta, className: "pv-app-grow" })} href="#start">
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
                        <div>
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
      </main>

      <footer className="ayy-container pv-app-footer">
        <Separator />
        <div className="pv-app-row">
          <span className="ayy-muted">© 2026 Northwind Labs</span>
          <div className="ayy-cluster">
            <a className="ayy-link" href="#privacy">
              Privacy
            </a>
            <a className="ayy-link" href="#terms">
              Terms
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ---- 3. Support inbox with an AI assistant ---- */

const THREADS = [
  { name: "Jonah Weiss", text: "The export button spins forever on large reports…", time: "2m", status: "Urgent", variant: "destructive", current: true },
  { name: "Ana Ruiz", text: "Can we move our billing date to the 1st?", time: "18m", status: "Billing", variant: "info" },
  { name: "Leo Park", text: "Thanks, that fixed it!", time: "1h", status: "Solved", variant: "success" },
  { name: "Priya Nair", text: "Is there an API for bulk invites?", time: "3h", status: "Question", variant: "muted" },
  { name: "Sam Okafor", text: "SSO login loops back to the start page.", time: "5h", status: "Bug", variant: "warning" },
] as const;

function InboxApp() {
  const jonah = <Avatar size="sm" name="Jonah Weiss" />;
  const agent = <Avatar size="sm" name="Relay AI" fallback="AI" />;
  return (
    <AppShell className="pv-app">
      <AppShellSidebar>
        <AppShellBrand href="#inbox">
          <Icon icon={Message01Icon} />
          Relay
        </AppShellBrand>
        <AppShellNav aria-label="Relay">
          <AppShellGroup label="Queues">
            <AppShellItem>
              <AppShellLink href="#inbox" current>
                <Icon icon={InboxIcon} />
                Inbox
              </AppShellLink>
            </AppShellItem>
            <AppShellItem>
              <AppShellLink href="#mentions">
                <Icon icon={Notification01Icon} />
                Mentions
              </AppShellLink>
            </AppShellItem>
            <AppShellItem>
              <AppShellLink href="#sent">
                <Icon icon={SentIcon} />
                Sent
              </AppShellLink>
            </AppShellItem>
          </AppShellGroup>
        </AppShellNav>
        <AppShellFooter>
          <AvatarGroup aria-label="3 teammates online">
            <Avatar name="Maya Chen" size="sm" />
            <Avatar name="Ravi Shah" size="sm" />
            <Avatar name="Eli Stone" size="sm" />
          </AvatarGroup>
        </AppShellFooter>
      </AppShellSidebar>
      <AppShellMain className="pv-app-inbox">
        <section className="pv-app-inbox__list" aria-labelledby="rl-inbox">
          <div className="ayy-stack" style={gap(3)}>
            <h1 className="ayy-h4" id="rl-inbox">
              Inbox <Badge variant="muted">12</Badge>
            </h1>
            <Input size="sm" type="search" placeholder="Search conversations" aria-label="Search conversations" />
          </div>
          <ul className="pv-app-threads">
            {THREADS.map((t) => (
              <li key={t.name}>
                <a className="pv-app-thread" href={`#${t.name.split(" ")[0].toLowerCase()}`} aria-current={"current" in t ? "true" : undefined}>
                  <Avatar name={t.name} size="sm" />
                  <span className="pv-app-thread__body">
                    <span className="pv-app-row">
                      <strong>{t.name}</strong>
                      <span className="ayy-muted">{t.time}</span>
                    </span>
                    <span className="pv-app-thread__text ayy-muted">{t.text}</span>
                    <span>
                      <Badge variant={t.variant}>{t.status}</Badge>
                    </span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section className="pv-app-inbox__thread" aria-labelledby="rl-thread">
          <header className="pv-app-row">
            <div className="ayy-stack" style={gap(1)}>
              <h2 className="ayy-h5" id="rl-thread">
                Export never finishes
              </h2>
              <p className="ayy-muted">Jonah Weiss · Acme Inc.</p>
            </div>
            <Badge variant="destructive" dot>
              Urgent
            </Badge>
          </header>
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
          <form className="pv-app-composer" onSubmit={(e) => e.preventDefault()}>
            <Textarea rows={2} placeholder="Write a reply…" aria-label="Reply to Jonah Weiss" />
            <div className="pv-app-row">
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
              <div>
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
      </AppShellMain>
    </AppShell>
  );
}

/* ---- 4. Account settings ---- */

function SettingsApp() {
  return (
    <div className="pv-app pv-app--page">
      <Navbar>
        <NavbarBrand href="#home">
          <Icon icon={CreditCardIcon} />
          Ledger
        </NavbarBrand>
        <NavbarNav className="pv-app-hide-sm">
          <NavbarLink href="#home">Home</NavbarLink>
          <NavbarLink href="#invoices">Invoices</NavbarLink>
          <NavbarLink href="#settings" current>
            Settings
          </NavbarLink>
        </NavbarNav>
        <NavbarActions>
          <Button variant="ghost" size="icon" aria-label="Search">
            <Icon icon={Search01Icon} />
          </Button>
          <Avatar name="Dana Levi" size="sm" />
        </NavbarActions>
      </Navbar>

      <main className="ayy-container pv-app-settings">
        <div className="ayy-stack" style={gap(2)}>
          <Breadcrumb items={[{ label: "Home", href: "#home" }, { label: "Settings", href: "#settings" }, { label: "Profile" }]} />
          <h1 className="ayy-h2">Settings</h1>
          <p className="ayy-muted">Manage your profile, notifications and plan.</p>
        </div>

        <Tabs defaultValue="profile">
          <TabsList aria-label="Settings sections">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <div className="pv-app-settings__grid">
              <Card>
                <CardHeader>
                  <CardTitle>Profile</CardTitle>
                  <CardDescription>This is how teammates see you.</CardDescription>
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
                      <Label htmlFor="lg-bio">About</Label>
                      <Textarea id="lg-bio" rows={3} defaultValue="Keeps the books tidy and the invoices on time." />
                      <FieldHint>Shown on invoices you send.</FieldHint>
                    </Field>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button>Save changes</Button>
                  <Button variant="ghost">Cancel</Button>
                </CardFooter>
              </Card>

              <div className="ayy-stack" style={gap(4)}>
                <Card>
                  <CardHeader>
                    <CardTitle>Email me about</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="ayy-stack" style={gap(3)}>
                      <Field inline>
                        <Switch id="lg-paid" defaultChecked />
                        <Label htmlFor="lg-paid">Invoices paid</Label>
                      </Field>
                      <Field inline>
                        <Switch id="lg-late" defaultChecked />
                        <Label htmlFor="lg-late">Late payments</Label>
                      </Field>
                      <Field inline>
                        <Switch id="lg-digest" />
                        <Label htmlFor="lg-digest">Weekly digest</Label>
                      </Field>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Plan</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="ayy-stack" style={gap(4)}>
                      <RadioGroup label="Billing cycle" defaultValue="yearly" orientation="horizontal">
                        <label className="ayy-label">
                          <Radio value="monthly" /> Monthly
                        </label>
                        <label className="ayy-label">
                          <Radio value="yearly" /> Yearly
                        </label>
                      </RadioGroup>
                      <div className="ayy-stack" style={gap(2)}>
                        <div className="pv-app-row">
                          <span>Invoices this month</span>
                          <span className="ayy-muted">164 of 250</span>
                        </div>
                        <Progress value={66} aria-label="Invoices used this month" />
                      </div>
                      <label className="ayy-label">
                        <Checkbox defaultChecked /> Email receipts to accounting
                      </label>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="notifications">
            <p className="ayy-muted">Choose where alerts go: email, Slack or both.</p>
          </TabsContent>
          <TabsContent value="billing">
            <DataList row>
              <DataListItem label="Plan">Business</DataListItem>
              <DataListItem label="Next invoice">Oct 1, 2026</DataListItem>
              <DataListItem label="Card">•••• 4242</DataListItem>
            </DataList>
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
      </main>
    </div>
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
  Component: ComponentType;
}

export const showcaseApps: ShowcaseApp[] = [
  {
    id: "dashboard",
    name: "Pulse",
    kind: "Analytics dashboard",
    description: "KPIs, a top-pages table and goal tracking in a sidebar app. Dense, dark, built for people who live in it all day.",
    theme: "dark",
    density: "compact",
    uses: ["app-shell", "card", "stat", "badge", "table", "progress", "select", "button", "alert", "avatar", "icon"],
    Component: DashboardApp,
  },
  {
    id: "landing",
    name: "Northwind",
    kind: "Marketing site",
    description: "Hero, features, pricing and a customer carousel. Light and roomy, the way a first impression should be.",
    theme: "light",
    density: "comfortable",
    uses: ["navbar", "section", "card", "icon-tile", "stat", "badge", "carousel", "avatar", "button", "separator"],
    Component: LandingApp,
  },
  {
    id: "inbox",
    name: "Relay",
    kind: "Support inbox",
    description: "Conversation list, a chat thread with AI suggestions and customer details. Soft dark theme for long shifts.",
    theme: "dark-soft",
    density: "comfortable",
    uses: ["app-shell", "chat", "avatar", "badge", "input", "textarea", "button", "data-list", "alert", "separator"],
    Component: InboxApp,
  },
  {
    id: "settings",
    name: "Ledger",
    kind: "Account settings",
    description: "Tabs, forms, switches and a plan summary. Light gray with touch-sized controls, easy on a phone.",
    theme: "light-gray",
    density: "touch",
    uses: ["navbar", "breadcrumb", "tabs", "card", "field", "input", "select", "textarea", "switch", "radio", "checkbox", "progress", "alert"],
    Component: SettingsApp,
  },
];
