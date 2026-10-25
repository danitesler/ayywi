import { Fragment, useEffect, useRef, useState, type ReactNode } from "react";
import {
  Add01Icon,
  ArrowDown01Icon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
  ArrowUp01Icon,
  ArrowUpDownIcon,
  Calendar03Icon,
  Clock01Icon,
  DollarCircleIcon,
  Flag01Icon,
  UserIcon,
  GroupItemsIcon,
  PinIcon,
  SmileIcon,
  StarIcon,
  Tag01Icon,
  ViewOffIcon,
  TextIcon,
  TextWrapIcon,
  Archive02Icon,
  Copy01Icon,
  Delete02Icon,
  FilterHorizontalIcon,
  LayoutTable01Icon,
  MoreHorizontalIcon,
  PencilEdit02Icon,
} from "@hugeicons/core-free-icons";
import {
  ActionBar,
  ActionBarActions,
  ActionBarButton,
  ActionBarClose,
  ActionBarCount,
  ActionBarSelection,
  ActionBarSeparator,
  Avatar,
  Badge,
  Button,
  Checkbox,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSelectedItem,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuTrigger,
  EmptyState,
  EmptyStateDescription,
  DragHandle,
  EmptyStateTitle,
  Icon,
  IconPicker,
  type IconPickerIcon,
  Label,
  Pagination,
  SearchBar,
  Select,
  Switch,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableContainer,
  TableDescription,
  TableEdit,
  TableEmpty,
  TableExpand,
  TableFooter,
  TableGroup,
  TableHead,
  TableHeader,
  TableHeading,
  TableMedia,
  TablePager,
  TableResize,
  TableRow,
  TableRowActions,
  TableRowLink,
  TableSecondary,
  TableTitle,
  TableToolbar,
  TableTools,
  compareValues,
  toast,
  type SortDirection,
  type TableColumnActionDetail,
  type TableRowReorderDetail,
} from "@danitesler/ayywi/react";

type Status = "Active" | "Trial" | "Past due" | "Closed";

interface Account {
  id: string;
  name: string;
  email: string;
  plan: string;
  status: Status;
  seats: number;
  mrr: number;
  renews: string;
  note: string;
}

const ACCOUNTS: Account[] = [
  { id: "ACC-201", name: "Northwind Traders", email: "ops@northwind.com", plan: "Enterprise", status: "Active", seats: 240, mrr: 12400, renews: "2027-03-01", note: "Wants SSO for the Lisbon office before the March renewal." },
  { id: "ACC-202", name: "Lumen Labs", email: "finance@lumenlabs.io", plan: "Team", status: "Past due", seats: 32, mrr: 1280, renews: "2026-11-02", note: "Card declined twice; finance contact is back on Monday." },
  { id: "ACC-203", name: "Acme Studio", email: "hello@acme.studio", plan: "Team", status: "Trial", seats: 12, mrr: 0, renews: "2026-11-09", note: "Trial ends in 17 days; asked for a demo of approvals." },
  { id: "ACC-204", name: "Brightside Health", email: "it@brightside.health", plan: "Enterprise", status: "Active", seats: 610, mrr: 30500, renews: "2027-06-15", note: "Security review passed. Expanding to two more clinics in Q1." },
  { id: "ACC-205", name: "Kestrel Logistics", email: "admin@kestrel.co", plan: "Starter", status: "Closed", seats: 4, mrr: 0, renews: "—", note: "Closed in September: moved to an in-house tool." },
  { id: "ACC-206", name: "Orchard & Pine", email: "team@orchardpine.com", plan: "Team", status: "Active", seats: 48, mrr: 1920, renews: "2027-01-20", note: "Uses the API for weekly exports to their warehouse." },
  { id: "ACC-207", name: "Halcyon Media", email: "billing@halcyon.media", plan: "Starter", status: "Trial", seats: 6, mrr: 0, renews: "2026-11-28", note: "Came from the webinar; two editors invited so far." },
  { id: "ACC-208", name: "Fjord Analytics", email: "ops@fjord.dev", plan: "Team", status: "Active", seats: 64, mrr: 2560, renews: "2027-02-11", note: "Asked about SCIM provisioning for the Oslo team." },
  { id: "ACC-209", name: "Granite Works", email: "it@graniteworks.com", plan: "Enterprise", status: "Active", seats: 380, mrr: 19000, renews: "2027-04-30", note: "Procurement wants a two-year price lock." },
  { id: "ACC-210", name: "Harbor & Co", email: "billing@harborco.com", plan: "Starter", status: "Past due", seats: 8, mrr: 240, renews: "2026-11-05", note: "Invoice 4021 is 21 days late; reminder sent." },
  { id: "ACC-211", name: "Ironleaf Studio", email: "hi@ironleaf.studio", plan: "Team", status: "Trial", seats: 15, mrr: 0, renews: "2026-11-14", note: "Evaluating against two other tools; demo booked Friday." },
  { id: "ACC-212", name: "Juniper Foods", email: "admin@juniperfoods.com", plan: "Team", status: "Active", seats: 52, mrr: 2080, renews: "2027-01-08", note: "Rolled out to the kitchen managers last month." },
  { id: "ACC-213", name: "Keystone Legal", email: "ops@keystonelegal.com", plan: "Enterprise", status: "Active", seats: 150, mrr: 7500, renews: "2027-05-22", note: "Requires audit logs retained for seven years." },
  { id: "ACC-214", name: "Lattice Robotics", email: "finance@lattice.ai", plan: "Team", status: "Past due", seats: 140, mrr: 5600, renews: "2026-11-01", note: "PO number changed; finance is reissuing the invoice." },
  { id: "ACC-215", name: "Meridian Travel", email: "team@meridian.travel", plan: "Starter", status: "Closed", seats: 5, mrr: 0, renews: "—", note: "Closed in August: seasonal business, may return in spring." },
  { id: "ACC-216", name: "Nimbus Energy", email: "it@nimbus.energy", plan: "Enterprise", status: "Active", seats: 720, mrr: 36000, renews: "2027-09-01", note: "Largest account in the EU; quarterly business review next week." },
  { id: "ACC-217", name: "Oakline Design", email: "hello@oakline.design", plan: "Starter", status: "Trial", seats: 3, mrr: 0, renews: "2026-12-02", note: "Solo founder; likely to convert after the trial." },
  { id: "ACC-218", name: "Pinecrest Schools", email: "admin@pinecrest.edu", plan: "Team", status: "Active", seats: 96, mrr: 3840, renews: "2027-07-01", note: "Education discount applied; renews each July." },
  { id: "ACC-219", name: "Quarry Capital", email: "ops@quarry.vc", plan: "Team", status: "Active", seats: 22, mrr: 880, renews: "2027-03-17", note: "Wants a read-only role for their LPs." },
  { id: "ACC-220", name: "Riverbend Clinic", email: "it@riverbend.health", plan: "Enterprise", status: "Trial", seats: 90, mrr: 0, renews: "2026-11-20", note: "Security questionnaire sent; awaiting their sign-off." },
  { id: "ACC-221", name: "Sable Print", email: "billing@sableprint.com", plan: "Starter", status: "Closed", seats: 4, mrr: 0, renews: "—", note: "Closed in June: merged with a larger shop." },
  { id: "ACC-222", name: "Tidewater Marine", email: "ops@tidewater.co", plan: "Team", status: "Active", seats: 40, mrr: 1600, renews: "2027-02-25", note: "Uses the mobile app on the dock; asked for offline mode." },
  { id: "ACC-223", name: "Umber Coffee", email: "hi@umbercoffee.com", plan: "Starter", status: "Active", seats: 9, mrr: 270, renews: "2027-01-30", note: "Seven locations; managers share one login for now." },
  { id: "ACC-224", name: "Vantage Media", email: "finance@vantage.media", plan: "Team", status: "Past due", seats: 36, mrr: 1440, renews: "2026-11-03", note: "Switching to annual billing; invoice pending." },
];

const STATUS_BADGE = { Active: "success", Trial: "info", "Past due": "destructive", Closed: "muted" } as const;
const GROUP_ORDER: Status[] = ["Past due", "Trial", "Active", "Closed"];

type Key = "name" | "plan" | "status" | "seats" | "mrr" | "renews" | "note";
type ColumnKey = Key | `column-${number}`;
const COLUMN_ICONS: IconPickerIcon[] = [
  { value: "star", label: "Star", icon: StarIcon },
  { value: "tag", label: "Tag", icon: Tag01Icon, keywords: ["label", "plan"] },
  { value: "calendar", label: "Calendar", icon: Calendar03Icon, keywords: ["date", "renews"] },
  { value: "text", label: "Text", icon: TextIcon, keywords: ["note"] },
  { value: "money", label: "Money", icon: DollarCircleIcon, keywords: ["revenue", "mrr", "price"] },
  { value: "user", label: "User", icon: UserIcon, keywords: ["person", "seats", "owner"] },
  { value: "flag", label: "Flag", icon: Flag01Icon, keywords: ["status", "priority"] },
  { value: "clock", label: "Clock", icon: Clock01Icon, keywords: ["time", "due"] },
];
// A picked icon's value is in COLUMN_ICONS; anything else is an emoji, shown as text.
const columnIcon = (value: string) => {
  const found = COLUMN_ICONS.find((item) => item.value === value);
  return found ? <Icon icon={found.icon as typeof StarIcon} /> : value;
};
interface Column { key: ColumnKey; label: string; numeric?: boolean; icon?: string }
const COLUMNS: Column[] = [
  { key: "name", label: "Account" },
  { key: "plan", label: "Plan" },
  { key: "status", label: "Status" },
  { key: "seats", label: "Seats", numeric: true },
  { key: "mrr", label: "MRR", numeric: true },
  { key: "renews", label: "Renews" },
  { key: "note", label: "Last note" },
];

const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
const day = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" });
const PAGE_SIZE_OPTIONS = [5, 10, 25];

type Density = "compact" | "default" | "spacious";

/**
 * One table, every variation: open Props to switch the density, column lines, the frame (toolbar and pager), a sticky
 * header, pinned columns, resizable columns, inline cell editing, selectable (including drag-to-select across rows),
 * expandable, grouped, linked and disabled rows, truncated text and the loading look. Search for a name that isn't
 * there to see the empty row.
 */
export default function Example({ setControls }: { setControls?: (node: ReactNode) => void } = {}) {
  const [density, setDensity] = useState<Density>("default");
  const [frame, setFrame] = useState(true);
  const [bordered, setBordered] = useState(false);
  const [sticky, setSticky] = useState(true);
  const [pinName, setPinName] = useState(true);
  const [pinActions, setPinActions] = useState(false);
  const [resizable, setResizable] = useState(true);
  const [reorderable, setReorderable] = useState(true);
  const [rowReorder, setRowReorder] = useState(true);
  const [editable, setEditable] = useState(true);
  const [selectable, setSelectable] = useState(true);
  const [expandable, setExpandable] = useState(true);
  const [grouped, setGrouped] = useState(false);
  const [rowLinks, setRowLinks] = useState(false);
  const [disabledRows, setDisabledRows] = useState(true);
  const [reveal, setReveal] = useState(true);
  const [truncate, setTruncate] = useState(true);
  const [loading, setLoading] = useState(false);

  const [accounts, setAccounts] = useState<Account[]>(ACCOUNTS);
  const [columns, setColumns] = useState(COLUMNS);
  const [columnOrder, setColumnOrder] = useState<ColumnKey[]>(COLUMNS.map((c) => c.key));
  const [frozen, setFrozen] = useState<ColumnKey[]>([]);
  const [wrapped, setWrapped] = useState<ColumnKey[]>([]);
  const [values, setValues] = useState<Record<string, Record<string, string>>>({});
  const [groupKey, setGroupKey] = useState<ColumnKey>("status");
  const filterTrigger = useRef<HTMLButtonElement>(null);
  const groupTrigger = useRef<HTMLButtonElement>(null);
  const nextColumn = useRef(0);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<Status[]>([]);
  const [planFilter, setPlanFilter] = useState<string[]>([]);
  const [hidden, setHidden] = useState<ColumnKey[]>([]);
  const [sort, setSort] = useState<{ key: ColumnKey; direction: SortDirection } | null>({ key: "mrr", direction: "descending" });
  const [selected, setSelected] = useState<string[]>(["ACC-206"]);
  const [expanded, setExpanded] = useState<string[]>(["ACC-201"]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    if (!setControls) return;
    const toggle = (id: string, label: string, checked: boolean, set: (v: boolean) => void, disabled = false) => (
      <div className="ayy-spread">
        <Label htmlFor={id}>{label}</Label>
        <Switch id={id} checked={checked} onCheckedChange={set} disabled={disabled} />
      </div>
    );
    setControls(
      <div className="ayy-stack">
        <div className="ayy-spread">
          <Label htmlFor="tp-density">Density</Label>
          <div style={{ inlineSize: "7.5rem" }}>
            <Select id="tp-density" size="sm" value={density} onChange={(e) => setDensity(e.target.value as Density)}>
              <option value="compact">Compact</option>
              <option value="default">Default</option>
              <option value="spacious">Spacious</option>
            </Select>
          </div>
        </div>
        <span className="ayy-muted ayy-mono ayy-small">Table</span>
        {toggle("tp-frame", "Frame, toolbar and pager", frame, setFrame)}
        {toggle("tp-bordered", "Column lines", bordered, setBordered)}
        {toggle("tp-sticky", "Sticky header", sticky, setSticky)}
        {toggle("tp-pin", "Pin the name column", pinName, setPinName)}
        {toggle("tp-pin-end", "Pin the actions column", pinActions, setPinActions)}
        {toggle("tp-resize", "Resizable columns", resizable, setResizable)}
        {toggle("tp-reorder", "Reorderable columns", reorderable, setReorderable)}
        {toggle("tp-row-reorder", "Reorderable rows", rowReorder, setRowReorder)}
        {toggle("tp-edit", "Editable cells", editable, setEditable)}
        {toggle("tp-truncate", "Truncate long text", truncate, setTruncate)}
        {toggle("tp-loading", "Loading", loading, setLoading)}
        <span className="ayy-muted ayy-mono ayy-small">Rows</span>
        {toggle("tp-select", "Selectable", selectable, setSelectable)}
        {toggle("tp-expand", "Expandable", expandable, setExpandable)}
        {toggle("tp-group", "Grouped by status", grouped, (on) => { setGroupKey("status"); setGrouped(on); })}
        {toggle("tp-link", "Whole row is a link", rowLinks, setRowLinks, pinName)}
        {toggle("tp-disabled", "Closed accounts disabled", disabledRows, setDisabledRows)}
        {toggle("tp-reveal", "Actions on hover", reveal, setReveal)}
      </div>,
    );
  }, [setControls, density, frame, bordered, sticky, pinName, pinActions, resizable, reorderable, rowReorder, editable, selectable, expandable, grouped, rowLinks, disabledRows, reveal, truncate, loading]);

  useEffect(() => () => setControls?.(null), [setControls]);

  const updateAccount = (id: string, patch: Partial<Account>) =>
    setAccounts((list) => list.map((a) => (a.id === id ? { ...a, ...patch } : a)));

  const visibleKeys = columnOrder.filter((k) => !hidden.includes(k));
  const visible = visibleKeys.map((k) => columns.find((c) => c.key === k)!);
  const isPinned = (key: ColumnKey) => key === "name" ? pinName : frozen.includes(key);
  const columnProps = (key: ColumnKey) => ({ "data-key": key, pin: isPinned(key), wrap: wrapped.includes(key) });
  const valueOf = (account: Account, key: ColumnKey) => key in account ? account[key as Key] : values[account.id]?.[key] ?? "";
  const shownValue = (account: Account, key: ColumnKey) => {
    const value = valueOf(account, key);
    return key === "mrr" ? money.format(account.mrr) : key === "renews" && account.renews !== "—" ? day.format(new Date(`${account.renews}T00:00:00`)) : String(value ?? "");
  };
  const insertColumn = (key?: ColumnKey, after = false) => {
    const column: Column = { key: `column-${++nextColumn.current}`, label: `Column ${nextColumn.current}` };
    setColumns((list) => [...list, column]);
    setColumnOrder((list) => {
      const next = [...list];
      const index = key === undefined ? next.length : next.indexOf(key) + (after ? 1 : 0);
      next.splice(index, 0, column.key);
      return next;
    });
  };
  const onColumnAction = ({ action, key, value }: TableColumnActionDetail) => {
    const columnKey = key as ColumnKey | undefined;
    if (action === "add") insertColumn();
    else if ((action === "sort-ascending" || action === "sort-descending") && columnKey) setSort({ key: columnKey, direction: action === "sort-ascending" ? "ascending" : "descending" });
    else if (action === "duplicate" && columnKey) {
      const source = columns.find((c) => c.key === columnKey)!;
      const copy: Column = { ...source, key: `column-${++nextColumn.current}`, label: `${source.label} copy` };
      setColumns((list) => [...list, copy]);
      setColumnOrder((list) => {
        const next = [...list];
        next.splice(next.indexOf(columnKey) + 1, 0, copy.key);
        return next;
      });
      setValues((all) => Object.fromEntries(accounts.map((a) => [a.id, { ...all[a.id], [copy.key]: shownValue(a, columnKey) }])));
    } else if (action === "hide" && columnKey) {
      setHidden((list) => [...list, columnKey]);
    } else if (action === "delete" && columnKey) {
      setColumns((list) => list.filter((c) => c.key !== columnKey));
      setColumnOrder((list) => list.filter((k) => k !== columnKey));
      setSort((current) => (current?.key === columnKey ? null : current));
    } else if (action === "insert-before" || action === "insert-after") insertColumn(columnKey, action === "insert-after");
    else if (action === "freeze" && columnKey) {
      if (columnKey === "name") setPinName((on) => !on);
      else setFrozen((list) => list.includes(columnKey) ? list.filter((k) => k !== columnKey) : [...list, columnKey]);
    } else if (action === "wrap" && columnKey) setWrapped((list) => list.includes(columnKey) ? list.filter((k) => k !== columnKey) : [...list, columnKey]);
    else if (action === "icon" && columnKey) setColumns((list) => list.map((c) => c.key === columnKey ? { ...c, icon: value || undefined } : c));
    else if (action === "filter" || action === "group") setTimeout(() => (action === "filter" ? filterTrigger : groupTrigger).current?.click(), 0);
    else if (action === "group-by") {
      setGrouped(value !== "none");
      if (value && value !== "none") setGroupKey(value as ColumnKey);
    }
    return false;
  };
  const columnMenu = (column: Column) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button type="button" className="ayy-table__sort">
          <span className="ayy-table__column-label">
            {column.icon ? <span className="ayy-table__column-icon" aria-hidden="true">{columnIcon(column.icon)}</span> : null}
            {column.label}
          </span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>{column.label}</DropdownMenuLabel>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger icon={<Icon icon={SmileIcon} />} aria-haspopup="dialog">{column.icon ? "Change icon" : "Add icon"}</DropdownMenuSubTrigger>
          <DropdownMenuSubContent role="dialog" aria-label={`${column.label} icon`}>
            <IconPicker data-column-action="icon" value={column.icon ?? ""} icons={COLUMN_ICONS} />
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled={!frame} data-column-action="filter"><Icon icon={FilterHorizontalIcon} />Filter</DropdownMenuItem>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger icon={<Icon icon={ArrowUpDownIcon} />}>Sort</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem data-column-action="sort-ascending"><Icon icon={ArrowUp01Icon} />Sort ascending</DropdownMenuItem>
            <DropdownMenuItem data-column-action="sort-descending"><Icon icon={ArrowDown01Icon} />Sort descending</DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuItem disabled={!frame} data-column-action="group"><Icon icon={GroupItemsIcon} />Group</DropdownMenuItem>
        <DropdownMenuCheckboxItem checked={isPinned(column.key)} data-column-action="freeze"><Icon icon={PinIcon} />Freeze</DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem checked={wrapped.includes(column.key)} data-column-action="wrap"><Icon icon={TextWrapIcon} />Wrap content</DropdownMenuCheckboxItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem data-column-action="insert-left"><Icon icon={ArrowLeft01Icon} />Insert left</DropdownMenuItem>
        <DropdownMenuItem data-column-action="insert-right"><Icon icon={ArrowRight01Icon} />Insert right</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem data-column-action="duplicate"><Icon icon={Copy01Icon} />Duplicate</DropdownMenuItem>
        <DropdownMenuItem data-column-action="hide"><Icon icon={ViewOffIcon} />Hide</DropdownMenuItem>
        <DropdownMenuItem destructive data-column-action="delete"><Icon icon={Delete02Icon} />Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const onColumnReorder = ({ from, to }: { from: number; to: number }) => {
    const offset = (rowReorder ? 1 : 0) + (expandable ? 1 : 0) + (selectable ? 1 : 0);
    const fromCol = from - offset;
    const toCol = to - offset;
    if (fromCol >= 0 && toCol >= 0 && fromCol < visibleKeys.length && toCol < visibleKeys.length) {
      setColumnOrder((prev) => {
        const next = [...prev];
        const fromKey = visibleKeys[fromCol];
        const toKey = visibleKeys[toCol];
        const fi = next.indexOf(fromKey);
        const ti = next.indexOf(toKey);
        if (fi >= 0 && ti >= 0) {
          const [moved] = next.splice(fi, 1);
          next.splice(ti, 0, moved);
        }
        return next;
      });
    }
    return false;
  };
  const matches = accounts.filter((a) => {
    const matchesQuery = `${a.name} ${a.email} ${a.id}`.toLowerCase().includes(query.trim().toLowerCase());
    const matchesStatus = statusFilter.length === 0 || statusFilter.includes(a.status);
    const matchesPlan = planFilter.length === 0 || planFilter.includes(a.plan);
    return matchesQuery && matchesStatus && matchesPlan;
  });
  const filterCount = statusFilter.length + planFilter.length;
  const sorted = sort ? [...matches].sort((a, b) => compareValues(valueOf(a, sort.key), valueOf(b, sort.key), sort.direction)) : matches;
  const pages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const current = Math.min(page, pages);
  const shown = frame ? sorted.slice((current - 1) * pageSize, current * pageSize) : sorted;
  const groupLabel = (account: Account) => {
    const value = valueOf(account, groupKey);
    return value === "" || value == null ? "Empty" : String(value);
  };
  const groupLabels = groupKey === "status" ? GROUP_ORDER : [...new Set(shown.map(groupLabel))];
  const groups = grouped
    ? groupLabels.map((status) => ({ status, rows: shown.filter((a) => groupLabel(a) === status) })).filter((g) => g.rows.length)
    : [{ status: null, rows: shown }];
  const columnCount = visible.length + 2 + (rowReorder ? 1 : 0) + (selectable ? 1 : 0) + (expandable ? 1 : 0);
  const selectableIds = shown.filter((a) => !(disabledRows && a.status === "Closed")).map((a) => a.id);
  const allOn = selectableIds.length > 0 && selectableIds.every((id) => selected.includes(id));
  const someOn = selectableIds.some((id) => selected.includes(id));

  const isClosed = (account: Account) => disabledRows && account.status === "Closed";
  // Dropping a row writes the order you see into the list and turns sorting off, so the new order sticks. Closed rows can't be picked up and keep their slot.
  const onRowReorder = ({ from, to }: TableRowReorderDetail) => {
    const onScreen = groups.flatMap((g) => g.rows);
    const ids = onScreen.filter((a) => !isClosed(a)).map((a) => a.id);
    const [moved] = ids.splice(from, 1);
    ids.splice(to, 0, moved);
    const order = onScreen.map((a) => (isClosed(a) ? a.id : ids.shift()!));
    const byId = new Map(accounts.map((a) => [a.id, a]));
    const start = frame ? (current - 1) * pageSize : 0;
    const full = sorted.map((a) => a.id);
    full.splice(start, order.length, ...order);
    setAccounts([...full.map((id) => byId.get(id)!), ...accounts.filter((a) => !full.includes(a.id))]);
    setSort(null);
    return false;
  };
  const flip = (list: string[], id: string, on: boolean) => (on ? [...list, id] : list.filter((x) => x !== id));
  const cell = (account: Account, key: ColumnKey, closed: boolean) => {
    switch (key) {
      case "name":
        return (
          <TableCell key={key} {...columnProps(key)} pin={pinName}>
            <TableMedia>
              <Avatar name={account.name} size="sm" />
              <div>
                {rowLinks && !pinName && !closed ? (
                  <TableRowLink href={`#${account.id.toLowerCase()}`}>{account.name}</TableRowLink>
                ) : (
                  <span>{account.name}</span>
                )}
                <TableSecondary>{account.email}</TableSecondary>
              </div>
            </TableMedia>
          </TableCell>
        );
      case "plan":
        return (
          <TableCell key={key} {...columnProps(key)}>
            {editable && !closed ? (
              <TableEdit
                multiline={wrapped.includes(key)}
                aria-label={`Plan for ${account.name}`}
                value={account.plan}
                onValueCommit={(v) => updateAccount(account.id, { plan: v || account.plan })}
              />
            ) : (
              account.plan
            )}
          </TableCell>
        );
      case "status":
        return (
          <TableCell key={key} {...columnProps(key)}>
            <Badge variant={STATUS_BADGE[account.status]}>{account.status}</Badge>
          </TableCell>
        );
      case "seats":
        return (
          <TableCell key={key} {...columnProps(key)} numeric data-sort-value={account.seats}>
            {editable && !closed ? (
              <TableEdit
                multiline={wrapped.includes(key)}
                aria-label={`Seats for ${account.name}`}
                inputMode="numeric"
                value={String(account.seats)}
                onValueCommit={(v) => {
                  const n = Number(v.replace(/[^0-9.-]/g, ""));
                  if (Number.isFinite(n) && n >= 0) updateAccount(account.id, { seats: Math.round(n) });
                }}
              />
            ) : (
              account.seats
            )}
          </TableCell>
        );
      case "mrr":
        return (
          <TableCell key={key} {...columnProps(key)} numeric data-sort-value={account.mrr}>
            {editable && !closed ? (
              <TableEdit
                multiline={wrapped.includes(key)}
                aria-label={`MRR for ${account.name}`}
                value={money.format(account.mrr)}
                onValueCommit={(v) => {
                  const n = Number(v.replace(/[^0-9.-]/g, ""));
                  if (Number.isFinite(n) && n >= 0) updateAccount(account.id, { mrr: Math.round(n) });
                }}
              />
            ) : (
              money.format(account.mrr)
            )}
          </TableCell>
        );
      case "renews":
        return (
          <TableCell key={key} {...columnProps(key)} className="ayy-muted">
            {account.renews === "—" ? "—" : day.format(new Date(`${account.renews}T00:00:00`))}
          </TableCell>
        );
      case "note":
        return (
          <TableCell key={key} {...columnProps(key)} className="ayy-muted" truncate={!editable && truncate}>
            {editable && !closed ? (
              <TableEdit
                multiline={wrapped.includes(key)}
                aria-label={`Last note for ${account.name}`}
                value={account.note}
                onValueCommit={(v) => updateAccount(account.id, { note: v })}
              />
            ) : (
              account.note
            )}
          </TableCell>
        );
      default:
        return <TableCell key={key} {...columnProps(key)}><TableEdit multiline={wrapped.includes(key)} aria-label={`${columns.find((c) => c.key === key)?.label} for ${account.name}`} value={values[account.id]?.[key] ?? ""} disabled={closed} onValueCommit={(value) => setValues((all) => ({ ...all, [account.id]: { ...all[account.id], [key]: value } }))} /></TableCell>;
    }
  };

  const row = (account: Account) => {
    const closed = disabledRows && account.status === "Closed";
    const open = expanded.includes(account.id);
    return (
      <Fragment key={account.id}>
        <TableRow data-id={account.id} selected={selectable ? selected.includes(account.id) : undefined} disabled={closed}>
          {rowReorder ? (
            <TableCell reorder>
              <DragHandle aria-label={`Move ${account.name}`} disabled={closed} tooltip={false} />
            </TableCell>
          ) : null}
          {expandable ? (
            <TableCell>
              <TableExpand
                expanded={open}
                aria-controls={`${account.id}-detail`}
                aria-label={`Show details for ${account.name}`}
                onClick={() => setExpanded((list) => flip(list, account.id, !open))}
              />
            </TableCell>
          ) : null}
          {selectable ? (
            <TableCell select>
              <Checkbox
                aria-label={`Select ${account.name}`}
                checked={selected.includes(account.id)}
                disabled={closed}
                onCheckedChange={(on) => setSelected((list) => flip(list, account.id, on))}
              />
            </TableCell>
          ) : null}
          {visible.map((c) => cell(account, c.key, closed))}
          <TableCell className="ayy-table__add-column" />
          <TableCell actions pin={pinActions ? "end" : undefined}>
            <TableRowActions reveal={reveal}>
              <Button variant="ghost" size="icon-sm" aria-label={`Edit ${account.name}`} disabled={closed} onClick={() => toast(`Edit ${account.name}`)}>
                <Icon icon={PencilEdit02Icon} />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger variant="ghost" size="icon-sm" aria-label={`More actions for ${account.name}`} disabled={closed}>
                  <Icon icon={MoreHorizontalIcon} />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onSelect={() => toast.success(`Duplicated ${account.name}`)}>
                    <Icon icon={Copy01Icon} />
                    Duplicate
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => toast(`Archived ${account.name}`)}>
                    <Icon icon={Archive02Icon} />
                    Archive
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem destructive onSelect={() => toast.error(`Deleted ${account.name}`)}>
                    <Icon icon={Delete02Icon} />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableRowActions>
          </TableCell>
        </TableRow>
        {expandable ? (
          <TableRow detail id={`${account.id}-detail`}>
            <TableCell />
            {selectable ? <TableCell /> : null}
            <TableCell colSpan={visible.length + 2}>
              <span className="ayy-small">
                {account.id} · {account.note}
              </span>
            </TableCell>
          </TableRow>
        ) : null}
      </Fragment>
    );
  };

  const table = (
    <Table
      key={`${resizable}-${reorderable}-${selectable}-${expandable}-${hidden.join()}`}
      compact={density === "compact"}
      spacious={density === "spacious"}
      bordered={bordered}
      sticky={sticky}
      reorderable={reorderable}
      onColumnReorder={onColumnReorder}
      onRowReorder={onRowReorder}
      onColumnAction={onColumnAction}
      aria-busy={loading || undefined}
      aria-labelledby={frame ? "tp-title" : undefined}
      wrapperProps={!frame && sticky ? { style: { maxBlockSize: "20rem" } } : undefined}
    >
      {frame ? null : <TableCaption className="ayy-sr-only">Accounts</TableCaption>}
      <TableHeader>
        <TableRow>
          {rowReorder ? (
            <TableHead reorder reorderable={false}>
              <span className="ayy-sr-only">Reorder</span>
            </TableHead>
          ) : null}
          {expandable ? (
            <TableHead reorderable={false}>
              <span className="ayy-sr-only">Details</span>
            </TableHead>
          ) : null}
          {selectable ? (
            <TableHead select>
              <Checkbox
                aria-label="Select all accounts on this page"
                checked={allOn}
                indeterminate={someOn && !allOn}
                onCheckedChange={(on) => setSelected((list) => (on ? [...new Set([...list, ...selectableIds])] : list.filter((id) => !selectableIds.includes(id))))}
              />
            </TableHead>
          ) : null}
          {visible.map((c) => (
            <TableHead
              key={c.key}
              numeric={c.numeric}
              pin={isPinned(c.key)}
              wrap={wrapped.includes(c.key)}
              aria-sort={sort?.key === c.key ? sort.direction : undefined}
              reorderable={reorderable && !isPinned(c.key)}
              data-key={c.key}
            >
              {columnMenu(c)}
              {resizable ? <TableResize aria-label={`Resize ${c.label}`} /> : null}
            </TableHead>
          ))}
          <TableHead className="ayy-table__add-column">
            <Button variant="ghost" size="icon-sm" aria-label="Add column" data-column-action="add"><Icon icon={Add01Icon} /></Button>
          </TableHead>
          <TableHead actions pin={pinActions ? "end" : undefined}>
            <span className="ayy-sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      {!visible.length ? (
        <TableBody><TableEmpty colSpan={columnCount}><EmptyState compact><EmptyStateTitle>No columns</EmptyStateTitle><EmptyStateDescription>Use the + in the header to add a column, or show columns from the Columns menu.</EmptyStateDescription></EmptyState></TableEmpty></TableBody>
      ) : shown.length ? (
        groups.map((g) => (
          <TableBody key={g.status ?? "all"}>
            {g.status ? <TableGroup colSpan={columnCount}>{g.status} · {g.rows.length}</TableGroup> : null}
            {g.rows.map(row)}
          </TableBody>
        ))
      ) : (
        <TableBody>
          <TableEmpty colSpan={columnCount}>
            <EmptyState compact>
              <EmptyStateTitle>No accounts match “{query}”</EmptyStateTitle>
              <EmptyStateDescription>Check the spelling, or search by email or account ID.</EmptyStateDescription>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setQuery("");
                  setStatusFilter([]);
                  setPlanFilter([]);
                }}
              >
                Clear search and filters
              </Button>
            </EmptyState>
          </TableEmpty>
        </TableBody>
      )}
      <TableFooter>
        <TableRow>
          {rowReorder ? <TableCell reorder /> : null}
          {expandable ? <TableCell /> : null}
          {selectable ? <TableCell select /> : null}
          {visible.map((c) => {
            if (c.key === "name") {
              return (
                <TableCell key={c.key} {...columnProps(c.key)} pin={pinName}>
                  Total
                </TableCell>
              );
            }
            if (c.key === "seats") {
              return (
                <TableCell key={c.key} {...columnProps(c.key)} numeric data-sort-value={matches.reduce((s, a) => s + a.seats, 0)}>
                  {matches.reduce((s, a) => s + a.seats, 0)}
                </TableCell>
              );
            }
            if (c.key === "mrr") {
              return (
                <TableCell key={c.key} {...columnProps(c.key)} numeric data-sort-value={matches.reduce((s, a) => s + a.mrr, 0)}>
                  {money.format(matches.reduce((s, a) => s + a.mrr, 0))}
                </TableCell>
              );
            }
            return <TableCell key={c.key} {...columnProps(c.key)} />;
          })}
          <TableCell className="ayy-table__add-column" />
          <TableCell actions pin={pinActions ? "end" : undefined} />
        </TableRow>
      </TableFooter>
    </Table>
  );

  const actionBar = (
    <ActionBar open={selectable && selected.length > 0} onClear={() => setSelected([])}>
      <ActionBarSelection>
        <ActionBarCount>{selected.length} selected</ActionBarCount>
        <ActionBarClose />
      </ActionBarSelection>
      <ActionBarSeparator />
      <ActionBarActions>
        <ActionBarButton onClick={() => toast(`Editing ${selected.length} accounts`)}>
          <Icon icon={PencilEdit02Icon} />
          Edit
        </ActionBarButton>
        <ActionBarButton onClick={() => toast.success(`Exported ${selected.length} accounts`)}>
          <Icon icon={Copy01Icon} />
          Export
        </ActionBarButton>
        <ActionBarButton onClick={() => toast(`Archived ${selected.length} accounts`)}>
          <Icon icon={Archive02Icon} />
          Archive
        </ActionBarButton>
        <ActionBarButton
          destructive
          onClick={() => {
            toast.error(`Deleted ${selected.length} accounts`);
            setSelected([]);
          }}
        >
          <Icon icon={Delete02Icon} />
          Delete
        </ActionBarButton>
      </ActionBarActions>
    </ActionBar>
  );

  if (!frame) {
    return (
      <div style={{ inlineSize: "100%" }}>
        {table}
        {actionBar}
      </div>
    );
  }

  return (
    <>
      <TableContainer style={{ inlineSize: "100%", maxBlockSize: sticky ? "32rem" : undefined }}>
        <TableToolbar>
          <TableHeading>
            <TableTitle id="tp-title">Accounts</TableTitle>
            <TableDescription>
              {selected.length ? `${selected.length} selected · ` : ""}
              {matches.length} of {ACCOUNTS.length} accounts
              {statusFilter.length > 0 || planFilter.length > 0 ? " (filtered)" : ""}
            </TableDescription>
          </TableHeading>
          <TableTools>
            <div style={{ inlineSize: "14rem" }}>
              <SearchBar
                label="Search accounts"
                placeholder="Search accounts"
                value={query}
                onValueChange={(v) => {
                  setQuery(v);
                  setPage(1);
                }}
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger ref={filterTrigger} variant={filterCount ? "secondary" : "outline"} size="icon" aria-label={filterCount ? `Filters (${filterCount} active)` : "Filters"} data-table-control="filters">
                <Icon icon={FilterHorizontalIcon} />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" aria-label="Filter options" style={{ minInlineSize: "13rem" }}>
                <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger icon={<Icon icon={Flag01Icon} />} value={statusFilter.length || undefined}>Status</DropdownMenuSubTrigger>
                  <DropdownMenuSubContent aria-label="Status options">
                    {(["Active", "Trial", "Past due", "Closed"] as Status[]).map((st) => (
                      <DropdownMenuSelectedItem
                        key={st}
                        selected={statusFilter.includes(st)}
                        onSelectedChange={(on) => {
                          setStatusFilter((list) => (on ? [...list, st] : list.filter((s) => s !== st)));
                          setPage(1);
                        }}
                        value={accounts.filter((a) => a.status === st).length}
                      >
                        {st}
                      </DropdownMenuSelectedItem>
                    ))}
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger icon={<Icon icon={Tag01Icon} />} value={planFilter.length || undefined}>Plan</DropdownMenuSubTrigger>
                  <DropdownMenuSubContent aria-label="Plan options">
                    {["Enterprise", "Team", "Starter"].map((pl) => (
                      <DropdownMenuSelectedItem
                        key={pl}
                        selected={planFilter.includes(pl)}
                        onSelectedChange={(on) => {
                          setPlanFilter((list) => (on ? [...list, pl] : list.filter((p) => p !== pl)));
                          setPage(1);
                        }}
                        value={accounts.filter((a) => a.plan === pl).length}
                      >
                        {pl}
                      </DropdownMenuSelectedItem>
                    ))}
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
                {filterCount ? (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem destructive onSelect={() => { setStatusFilter([]); setPlanFilter([]); setPage(1); }}>Reset filters</DropdownMenuItem>
                  </>
                ) : null}
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger variant={sort ? "secondary" : "outline"} size="icon" aria-label={sort ? `Sort (${columns.find((c) => c.key === sort.key)?.label ?? sort.key}, ${sort.direction})` : "Sort"} data-table-control="sort">
                <Icon icon={ArrowUpDownIcon} />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" aria-label="Sort options" style={{ minInlineSize: "13rem" }}>
                <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                {columns.map((c) => (
                  <DropdownMenuSub key={c.key}>
                    <DropdownMenuSubTrigger>{c.label}</DropdownMenuSubTrigger>
                    <DropdownMenuSubContent aria-label={`Sort ${c.label}`}>
                      <DropdownMenuRadioGroup value={sort?.key === c.key ? sort.direction : ""}>
                        <DropdownMenuRadioItem value="ascending" data-column-action="sort-ascending" data-column-key={c.key}>{c.numeric ? "Low to high" : "A to Z"}</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="descending" data-column-action="sort-descending" data-column-key={c.key}>{c.numeric ? "High to low" : "Z to A"}</DropdownMenuRadioItem>
                      </DropdownMenuRadioGroup>
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger ref={groupTrigger} variant="outline" size="icon" aria-label="Table options" data-table-control="groups">
                <Icon icon={LayoutTable01Icon} />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" aria-label="Table options" style={{ minInlineSize: "13rem" }}>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger icon={<Icon icon={GroupItemsIcon} />}>Group by</DropdownMenuSubTrigger>
                  <DropdownMenuSubContent aria-label="Group by">
                    <DropdownMenuRadioGroup value={grouped ? groupKey : "none"}>
                      <DropdownMenuRadioItem value="none" data-column-action="group-by" data-column-value="none">No groups</DropdownMenuRadioItem>
                      {columns.map((c) => <DropdownMenuRadioItem key={c.key} value={c.key} data-column-action="group-by" data-column-value={c.key}>{c.label}</DropdownMenuRadioItem>)}
                    </DropdownMenuRadioGroup>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger icon={<Icon icon={LayoutTable01Icon} />}>Columns</DropdownMenuSubTrigger>
                  <DropdownMenuSubContent aria-label="Columns">
                    {columns.map((c) => (
                      <DropdownMenuCheckboxItem
                        key={c.key}
                        checked={!hidden.includes(c.key)}
                        onCheckedChange={(on) => setHidden((list) => (on ? list.filter((k) => k !== c.key) : [...list, c.key]))}
                      >
                        {c.label}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button onClick={() => toast("New account")}>
              <Icon icon={Add01Icon} />
              Add account
            </Button>
          </TableTools>
        </TableToolbar>
        {table}
        <TablePager>
          <span>
            {sorted.length ? `${(current - 1) * pageSize + 1}–${Math.min(current * pageSize, sorted.length)} of ${sorted.length}` : "0 of 0"}
          </span>
          <Pagination
            page={current}
            count={pages}
            onPageChange={setPage}
            pageSize={pageSize}
            pageSizeOptions={PAGE_SIZE_OPTIONS}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setPage(1);
            }}
          />
        </TablePager>
      </TableContainer>
      {actionBar}
    </>
  );
}
