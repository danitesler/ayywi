# Filter bar

Category: Forms. A coordinating bar for filtering lists, tables, and feeds. Combines quick filter tabs with count badges, faceted filter dropdown triggers with active counts, search, and active removable filter chips with a clear all action. Also called: filter-bar, filterbar, filters, filter-toolbar, filter-group, filter-strip, faceted-filter.

**Classes**
- `.ayy-filter-bar` — Root container. A vertical stack grouping the main controls row and the active filter row.
- `.ayy-filter-bar--flush` — Flush variant without borders, background or padding, for cards or panels.
- `.ayy-filter-bar--sticky` — Sticky variant pinned to the top of scroll containers with a translucent glass backdrop.
- `.ayy-filter-bar--sm` — Compact size variant for tight headers and mobile lists.
- `.ayy-filter-bar__main` — Horizontal row holding search, filter tabs, triggers, and summary.
- `.ayy-filter-bar__group` — Cluster of filter triggers or controls.
- `.ayy-filter-bar__tabs` — Pill track container for quick filter status tabs (role="tablist").
- `.ayy-filter-bar__tab` — Individual filter tab button. Inverts when active (aria-selected="true").
- `.ayy-filter-bar__tab-count` — Count badge after a filter tab label.
- `.ayy-filter-bar__trigger` — Faceted filter trigger button opening a dropdown menu with checkbox items (aria-haspopup="menu").
- `.ayy-filter-bar__trigger-badge` — Badge showing count of selected values for that facet.
- `.ayy-filter-bar__active` — Row of applied filter chips (ChipRemovable) and the clear button.
- `.ayy-filter-bar__summary` — Muted results summary (e.g. "Showing 12 of 80").
- `.ayy-filter-bar__clear` — Clear all / reset button.

**States**
- `default` — A flexible bar with a pill track of filter tabs, bordered filter triggers, and a clean active filters row.
- `hover` (`.ayy-filter-bar__tab:hover, .ayy-filter-bar__trigger:hover, .ayy-filter-bar__clear:hover`) — Tabs get full text color; triggers get line-hover border and wash-hover background; clear button turns text color.
- `pressed` — doesn't apply: No pressed look; tabs and triggers activate or toggle on release.
- `focus` (`:focus-visible on tabs, triggers, and the clear button`) — 2px ring, 2px offset.
- `disabled` (`:disabled on tabs or triggers`) — --ayy-opacity-disabled, not-allowed cursor.
- `selected` (`.ayy-filter-bar__tab[aria-selected="true"], [aria-pressed="true"]`) — Tabs fill with text color, page-color text, small shadow; active triggers get ring border and wash fill. Forced colours: Highlight.
- `error` — doesn't apply: Filters do not fail visibly; display empty or error states in the results view.
- `loading` — doesn't apply: Loading is shown in the results view with Skeleton, not in the filter bar.
- `open` (`.ayy-filter-bar__trigger[aria-expanded="true"]`) — Trigger border turns ring color with wash-hover background.

**Sizes**
- `sm` — Tabs and triggers at the sm control height (28px compact, 32px comfortable, 40px touch), 13px text.
- `md` (default) — Tabs and triggers at the md control height (32px compact, 40px comfortable, 44px touch), 14px text.
- Density — Tab and trigger heights and padding follow data-density.
- Width — Fills its container (inline-size: 100%); main row and active row wrap when narrow.

**React** — `import { FilterBar, FilterBarMain, FilterBarGroup, FilterBarTabs, FilterBarTab, FilterBarTrigger, FilterBarActive, FilterBarSummary, FilterBarClear } from "@danitesler/ayywi/react";`
- `<FilterBar>` renders <div class="ayy-filter-bar">. Props: `sticky` boolean — sticky header with glass backdrop; `flush` boolean — omit outer border and padding for cards; `size` "sm" | "md"
- `<FilterBarMain>` renders <div class="ayy-filter-bar__main">. Props: 
- `<FilterBarGroup>` renders <div role="group" class="ayy-filter-bar__group">. Props: 
- `<FilterBarTabs>` renders <div role="tablist" class="ayy-filter-bar__tabs">. Props: `label` string — aria-label for the tablist (default "Filters")
- `<FilterBarTab>` renders <button role="tab" class="ayy-filter-bar__tab">. Props: `selected` boolean — aria-selected; `count` ReactNode — number of items in this status
- `<FilterBarTrigger>` renders <button type="button" class="ayy-filter-bar__trigger">. Props: `count` ReactNode — number of active values selected for this facet; `open` boolean — aria-expanded for menu state; `active` boolean — aria-pressed when filters are applied
- `<FilterBarActive>` renders <div class="ayy-filter-bar__active">. Props: 
- `<FilterBarSummary>` renders <span class="ayy-filter-bar__summary">. Props: 
- `<FilterBarClear>` renders <button type="button" class="ayy-filter-bar__clear">. Props: 

**Accessibility**
- Quick filter tabs form a role="tablist" with an aria-label. Tabs announce aria-selected="true" when active.
- Faceted filter triggers carry aria-haspopup="menu" (set by DropdownMenuTrigger) and aria-expanded for open/closed state.
- Active filters provide removable chips with accessible remove labels ("Remove Status: Draft").
- Visible :focus-visible rings on all interactive tabs, triggers, and action buttons.
- High Contrast mode fills active tabs and outlines active triggers using system Highlight.

**Do**
- Use a filter bar above tables, cards, lists, and feeds that support filtering by multiple criteria.
- Use quick filter tabs for primary mutually exclusive statuses (All, Drafts, Published) with live counts.
- Use faceted filter triggers for secondary multi-select dimensions (Assignee, Priority, Label).
- Display applied filters as removable chips with a Clear all button so users see and modify current filters in one glance.

**Don't**
- Don't build custom button rows or ad-hoc active classes for status filters — use FilterBarTabs and FilterBarTab.
- Don't hide active filters inside menus without showing badges or active removable chips.
- Don't disable the filter bar when there are zero results — let the user adjust filters to recover.

## Filter bar — Status tabs

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<div class="ayy-stack" style="inline-size:100%;gap:var(--ayy-space-4)"><div class="ayy-filter-bar" style="inline-size:100%"><div class="ayy-filter-bar__main"><div role="tablist" aria-label="Post status" class="ayy-filter-bar__tabs"><button type="button" role="tab" aria-selected="true" class="ayy-filter-bar__tab"><span>All</span><span class="ayy-filter-bar__tab-count">5</span></button><button type="button" role="tab" aria-selected="false" class="ayy-filter-bar__tab"><span>Published</span><span class="ayy-filter-bar__tab-count">2</span></button><button type="button" role="tab" aria-selected="false" class="ayy-filter-bar__tab"><span>Scheduled</span><span class="ayy-filter-bar__tab-count">2</span></button><button type="button" role="tab" aria-selected="false" class="ayy-filter-bar__tab"><span>Drafts</span><span class="ayy-filter-bar__tab-count">1</span></button></div><div class="ayy-input-group" style="inline-size:min(100%, 14rem)"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M17 17L21 21" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19C15.4183 19 19 15.4183 19 11Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg><input type="search" class="ayy-input" placeholder="Search posts..." aria-label="Search posts" value=""/></div><span class="ayy-filter-bar__summary">Showing 5 of 5 posts</span></div></div><div class="ayy-stack" style="gap:var(--ayy-space-2)"><div class="ayy-card"><div class="ayy-card__content" style="padding:var(--ayy-space-3)"><div class="ayy-spread"><div class="ayy-stack" style="gap:var(--ayy-space-1)"><span style="font-weight:var(--ayy-weight-medium)">Q4 Product Launch Announcement</span><span class="ayy-muted" style="font-size:var(--ayy-text-xs)">Blog • Yesterday, 14:30</span></div><span class="ayy-badge ayy-badge--success">Published</span></div></div></div><div class="ayy-card"><div class="ayy-card__content" style="padding:var(--ayy-space-3)"><div class="ayy-spread"><div class="ayy-stack" style="gap:var(--ayy-space-1)"><span style="font-weight:var(--ayy-weight-medium)">Design System Tokens Migration Guide</span><span class="ayy-muted" style="font-size:var(--ayy-text-xs)">Engineering • Oct 12, 09:15</span></div><span class="ayy-badge ayy-badge--success">Published</span></div></div></div><div class="ayy-card"><div class="ayy-card__content" style="padding:var(--ayy-space-3)"><div class="ayy-spread"><div class="ayy-stack" style="gap:var(--ayy-space-1)"><span style="font-weight:var(--ayy-weight-medium)">October Customer Community Showcase</span><span class="ayy-muted" style="font-size:var(--ayy-text-xs)">LinkedIn • Tomorrow, 10:00</span></div><span class="ayy-badge ayy-badge--info">Scheduled</span></div></div></div><div class="ayy-card"><div class="ayy-card__content" style="padding:var(--ayy-space-3)"><div class="ayy-spread"><div class="ayy-stack" style="gap:var(--ayy-space-1)"><span style="font-weight:var(--ayy-weight-medium)">Behind the Scenes: Zero-runtime CSS</span><span class="ayy-muted" style="font-size:var(--ayy-text-xs)">Twitter • Friday, 16:00</span></div><span class="ayy-badge ayy-badge--info">Scheduled</span></div></div></div><div class="ayy-card"><div class="ayy-card__content" style="padding:var(--ayy-space-3)"><div class="ayy-spread"><div class="ayy-stack" style="gap:var(--ayy-space-1)"><span style="font-weight:var(--ayy-weight-medium)">Draft: 2027 Design Trends &amp; Predictions</span><span class="ayy-muted" style="font-size:var(--ayy-text-xs)">Newsletter • Edited 2h ago</span></div><span class="ayy-badge ayy-badge--outline">Draft</span></div></div></div></div></div>
```

React:

```tsx
import { Search01Icon } from "@hugeicons/core-free-icons";
import { useState } from "react";
import {
  Badge,
  Card,
  CardContent,
  EmptyState,
  EmptyStateDescription,
  EmptyStateTitle,
  FilterBar,
  FilterBarMain,
  FilterBarSummary,
  FilterBarTab,
  FilterBarTabs,
  Icon,
  Input,
  InputGroup,
} from "@danitesler/ayywi/react";

interface Post {
  id: string;
  title: string;
  status: "published" | "scheduled" | "draft";
  date: string;
  channel: string;
}

const POSTS: Post[] = [
  { id: "1", title: "Q4 Product Launch Announcement", status: "published", date: "Yesterday, 14:30", channel: "Blog" },
  { id: "2", title: "Design System Tokens Migration Guide", status: "published", date: "Oct 12, 09:15", channel: "Engineering" },
  { id: "3", title: "October Customer Community Showcase", status: "scheduled", date: "Tomorrow, 10:00", channel: "LinkedIn" },
  { id: "4", title: "Behind the Scenes: Zero-runtime CSS", status: "scheduled", date: "Friday, 16:00", channel: "Twitter" },
  { id: "5", title: "Draft: 2027 Design Trends & Predictions", status: "draft", date: "Edited 2h ago", channel: "Newsletter" },
];

export default function Example() {
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = POSTS.filter((p) => {
    const matchesTab = activeTab === "all" || p.status === activeTab;
    const matchesSearch = !search.trim() || p.title.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const counts = {
    all: POSTS.length,
    published: POSTS.filter((p) => p.status === "published").length,
    scheduled: POSTS.filter((p) => p.status === "scheduled").length,
    draft: POSTS.filter((p) => p.status === "draft").length,
  };

  const statusVariant = (status: Post["status"]) => {
    if (status === "published") return "success";
    if (status === "scheduled") return "info";
    return "outline";
  };

  return (
    <div className="ayy-stack" style={{ inlineSize: "100%", gap: "var(--ayy-space-4)" }}>
      <FilterBar style={{ inlineSize: "100%" }}>
        <FilterBarMain>
          <FilterBarTabs label="Post status">
            <FilterBarTab selected={activeTab === "all"} count={counts.all} onClick={() => setActiveTab("all")}>
              All
            </FilterBarTab>
            <FilterBarTab selected={activeTab === "published"} count={counts.published} onClick={() => setActiveTab("published")}>
              Published
            </FilterBarTab>
            <FilterBarTab selected={activeTab === "scheduled"} count={counts.scheduled} onClick={() => setActiveTab("scheduled")}>
              Scheduled
            </FilterBarTab>
            <FilterBarTab selected={activeTab === "draft"} count={counts.draft} onClick={() => setActiveTab("draft")}>
              Drafts
            </FilterBarTab>
          </FilterBarTabs>
          <InputGroup style={{ inlineSize: "min(100%, 14rem)" }}>
            <Icon icon={Search01Icon} />
            <Input
              type="search"
              placeholder="Search posts..."
              aria-label="Search posts"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </InputGroup>
          <FilterBarSummary>
            {`Showing ${filtered.length} of ${POSTS.length} posts`}
          </FilterBarSummary>
        </FilterBarMain>
      </FilterBar>

      {filtered.length > 0 ? (
        <div className="ayy-stack" style={{ gap: "var(--ayy-space-2)" }}>
          {filtered.map((post) => (
            <Card key={post.id}>
              <CardContent style={{ padding: "var(--ayy-space-3)" }}>
                <div className="ayy-spread">
                  <div className="ayy-stack" style={{ gap: "var(--ayy-space-1)" }}>
                    <span style={{ fontWeight: "var(--ayy-weight-medium)" }}>{post.title}</span>
                    <span className="ayy-muted" style={{ fontSize: "var(--ayy-text-xs)" }}>
                      {`${post.channel} • ${post.date}`}
                    </span>
                  </div>
                  <Badge variant={statusVariant(post.status)}>
                    {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState>
          <EmptyStateTitle>No posts match your filters</EmptyStateTitle>
          <EmptyStateDescription>Try switching tabs or clearing your search query.</EmptyStateDescription>
        </EmptyState>
      )}
    </div>
  );
}
```

## Filter bar — Faceted filters

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<!-- <ayy-menu> (@danitesler/ayywi/elements) places each menu under its button; the checkbox items stay open while you pick. -->
<div class="ayy-stack" style="inline-size:100%;gap:var(--ayy-space-4)"><div class="ayy-filter-bar" style="inline-size:100%"><div class="ayy-filter-bar__main"><div role="group" class="ayy-filter-bar__group"><div class="ayy-input-group" style="inline-size:min(100%, 11rem)"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M17 17L21 21" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19C15.4183 19 19 15.4183 19 11Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg><input type="search" class="ayy-input" placeholder="Search tasks..." aria-label="Search tasks" value=""/></div><ayy-menu><button type="button" aria-haspopup="menu" aria-expanded="false" aria-pressed="false" popovertarget="filter-priority-menu-html" class="ayy-filter-bar__trigger">Priority<svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M18 9.00005C18 9.00005 13.5811 15 12 15C10.4188 15 6 9 6 9" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg></button><div id="filter-priority-menu-html" role="menu" class="ayy-menu" popover="auto" aria-label="Priority"><button type="button" role="menuitemcheckbox" tabindex="-1" data-close-on-select="false" class="ayy-menu__item" aria-checked="false">Urgent<span class="ayy-menu__value">2</span></button><button type="button" role="menuitemcheckbox" tabindex="-1" data-close-on-select="false" class="ayy-menu__item" aria-checked="false">High<span class="ayy-menu__value">2</span></button><button type="button" role="menuitemcheckbox" tabindex="-1" data-close-on-select="false" class="ayy-menu__item" aria-checked="false">Normal<span class="ayy-menu__value">2</span></button></div></ayy-menu><ayy-menu><button type="button" aria-haspopup="menu" aria-expanded="false" aria-pressed="false" popovertarget="filter-category-menu-html" class="ayy-filter-bar__trigger">Category<svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M18 9.00005C18 9.00005 13.5811 15 12 15C10.4188 15 6 9 6 9" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg></button><div id="filter-category-menu-html" role="menu" class="ayy-menu" popover="auto" aria-label="Category"><button type="button" role="menuitemcheckbox" tabindex="-1" data-close-on-select="false" class="ayy-menu__item" aria-checked="false">Design<span class="ayy-menu__value">2</span></button><button type="button" role="menuitemcheckbox" tabindex="-1" data-close-on-select="false" class="ayy-menu__item" aria-checked="false">Engineering<span class="ayy-menu__value">3</span></button><button type="button" role="menuitemcheckbox" tabindex="-1" data-close-on-select="false" class="ayy-menu__item" aria-checked="false">Marketing<span class="ayy-menu__value">1</span></button></div></ayy-menu></div><span class="ayy-filter-bar__summary">Showing 6 of 6 tasks</span></div></div><div class="ayy-stack" style="gap:var(--ayy-space-2)"><div class="ayy-card"><div class="ayy-card__content" style="padding:var(--ayy-space-3)"><div class="ayy-spread"><div class="ayy-stack" style="gap:var(--ayy-space-1)"><span style="font-weight:var(--ayy-weight-medium)">Audit contrast across dark themes</span><span class="ayy-muted" style="font-size:var(--ayy-text-xs)">Design • Assigned to Dani</span></div><span class="ayy-badge ayy-badge--destructive">Urgent</span></div></div></div><div class="ayy-card"><div class="ayy-card__content" style="padding:var(--ayy-space-3)"><div class="ayy-spread"><div class="ayy-stack" style="gap:var(--ayy-space-1)"><span style="font-weight:var(--ayy-weight-medium)">Build accessible filter bar menus</span><span class="ayy-muted" style="font-size:var(--ayy-text-xs)">Engineering • Assigned to Alex</span></div><span class="ayy-badge ayy-badge--warning">High</span></div></div></div><div class="ayy-card"><div class="ayy-card__content" style="padding:var(--ayy-space-3)"><div class="ayy-spread"><div class="ayy-stack" style="gap:var(--ayy-space-1)"><span style="font-weight:var(--ayy-weight-medium)">Document keyboard shortcuts on Mac vs Windows</span><span class="ayy-muted" style="font-size:var(--ayy-text-xs)">Design • Assigned to Dani</span></div><span class="ayy-badge ayy-badge--outline">Normal</span></div></div></div><div class="ayy-card"><div class="ayy-card__content" style="padding:var(--ayy-space-3)"><div class="ayy-spread"><div class="ayy-stack" style="gap:var(--ayy-space-1)"><span style="font-weight:var(--ayy-weight-medium)">Optimize CSS bundle gzip size</span><span class="ayy-muted" style="font-size:var(--ayy-text-xs)">Engineering • Assigned to Sarah</span></div><span class="ayy-badge ayy-badge--warning">High</span></div></div></div><div class="ayy-card"><div class="ayy-card__content" style="padding:var(--ayy-space-3)"><div class="ayy-spread"><div class="ayy-stack" style="gap:var(--ayy-space-1)"><span style="font-weight:var(--ayy-weight-medium)">Prepare release announcement copy</span><span class="ayy-muted" style="font-size:var(--ayy-text-xs)">Marketing • Assigned to Elena</span></div><span class="ayy-badge ayy-badge--outline">Normal</span></div></div></div><div class="ayy-card"><div class="ayy-card__content" style="padding:var(--ayy-space-3)"><div class="ayy-spread"><div class="ayy-stack" style="gap:var(--ayy-space-1)"><span style="font-weight:var(--ayy-weight-medium)">Fix iOS tap highlight on segmented items</span><span class="ayy-muted" style="font-size:var(--ayy-text-xs)">Engineering • Assigned to Alex</span></div><span class="ayy-badge ayy-badge--destructive">Urgent</span></div></div></div></div></div>
```

React:

```tsx
import { ArrowDown01Icon, Search01Icon } from "@hugeicons/core-free-icons";
import { useState } from "react";
import {
  Badge,
  Card,
  CardContent,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  EmptyState,
  EmptyStateDescription,
  EmptyStateTitle,
  FilterBar,
  FilterBarGroup,
  FilterBarMain,
  FilterBarSummary,
  FilterBarTrigger,
  Icon,
  Input,
  InputGroup,
} from "@danitesler/ayywi/react";

interface Task {
  id: string;
  title: string;
  priority: "Urgent" | "High" | "Normal";
  category: "Design" | "Engineering" | "Marketing";
  assignee: string;
}

const TASKS: Task[] = [
  { id: "1", title: "Audit contrast across dark themes", priority: "Urgent", category: "Design", assignee: "Dani" },
  { id: "2", title: "Build accessible filter bar menus", priority: "High", category: "Engineering", assignee: "Alex" },
  { id: "3", title: "Document keyboard shortcuts on Mac vs Windows", priority: "Normal", category: "Design", assignee: "Dani" },
  { id: "4", title: "Optimize CSS bundle gzip size", priority: "High", category: "Engineering", assignee: "Sarah" },
  { id: "5", title: "Prepare release announcement copy", priority: "Normal", category: "Marketing", assignee: "Elena" },
  { id: "6", title: "Fix iOS tap highlight on segmented items", priority: "Urgent", category: "Engineering", assignee: "Alex" },
];

const PRIORITIES: Array<Task["priority"]> = ["Urgent", "High", "Normal"];
const CATEGORIES: Array<Task["category"]> = ["Design", "Engineering", "Marketing"];

const toggle = (list: string[], value: string) =>
  list.includes(value) ? list.filter((item) => item !== value) : [...list, value];

export default function Example() {
  const [search, setSearch] = useState("");
  const [priorities, setPriorities] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  const filtered = TASKS.filter((t) => {
    const matchesSearch = !search.trim() || t.title.toLowerCase().includes(search.toLowerCase());
    const matchesPriority = priorities.length === 0 || priorities.includes(t.priority);
    const matchesCategory = categories.length === 0 || categories.includes(t.category);
    return matchesSearch && matchesPriority && matchesCategory;
  });

  const priorityVariant = (p: Task["priority"]) => {
    if (p === "Urgent") return "destructive";
    if (p === "High") return "warning";
    return "outline";
  };

  return (
    <div className="ayy-stack" style={{ inlineSize: "100%", gap: "var(--ayy-space-4)" }}>
      <FilterBar style={{ inlineSize: "100%" }}>
        <FilterBarMain>
          <FilterBarGroup>
            <InputGroup style={{ inlineSize: "min(100%, 11rem)" }}>
              <Icon icon={Search01Icon} />
              <Input
                type="search"
                placeholder="Search tasks..."
                aria-label="Search tasks"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </InputGroup>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <FilterBarTrigger active={priorities.length > 0} count={priorities.length}>
                  Priority
                  <Icon icon={ArrowDown01Icon} />
                </FilterBarTrigger>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" aria-label="Priority">
                {PRIORITIES.map((priority) => (
                  <DropdownMenuCheckboxItem
                    key={priority}
                    checked={priorities.includes(priority)}
                    onCheckedChange={() => setPriorities((curr) => toggle(curr, priority))}
                    value={TASKS.filter((t) => t.priority === priority).length}
                  >
                    {priority}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <FilterBarTrigger active={categories.length > 0} count={categories.length}>
                  Category
                  <Icon icon={ArrowDown01Icon} />
                </FilterBarTrigger>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" aria-label="Category">
                {CATEGORIES.map((category) => (
                  <DropdownMenuCheckboxItem
                    key={category}
                    checked={categories.includes(category)}
                    onCheckedChange={() => setCategories((curr) => toggle(curr, category))}
                    value={TASKS.filter((t) => t.category === category).length}
                  >
                    {category}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </FilterBarGroup>

          <FilterBarSummary>{`Showing ${filtered.length} of ${TASKS.length} tasks`}</FilterBarSummary>
        </FilterBarMain>
      </FilterBar>

      {filtered.length > 0 ? (
        <div className="ayy-stack" style={{ gap: "var(--ayy-space-2)" }}>
          {filtered.map((task) => (
            <Card key={task.id}>
              <CardContent style={{ padding: "var(--ayy-space-3)" }}>
                <div className="ayy-spread">
                  <div className="ayy-stack" style={{ gap: "var(--ayy-space-1)" }}>
                    <span style={{ fontWeight: "var(--ayy-weight-medium)" }}>{task.title}</span>
                    <span className="ayy-muted" style={{ fontSize: "var(--ayy-text-xs)" }}>
                      {`${task.category} • Assigned to ${task.assignee}`}
                    </span>
                  </div>
                  <Badge variant={priorityVariant(task.priority)}>{task.priority}</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState>
          <EmptyStateTitle>No matching tasks</EmptyStateTitle>
          <EmptyStateDescription>Try selecting different priorities or categories.</EmptyStateDescription>
        </EmptyState>
      )}
    </div>
  );
}
```

## Filter bar — Consolidated filter

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<!-- <ayy-menu> (@danitesler/ayywi/elements) supports nested submenus for consolidated filtering. -->
<div class="ayy-stack" style="inline-size:100%;gap:var(--ayy-space-4)"><div class="ayy-filter-bar" style="inline-size:100%"><div class="ayy-filter-bar__main"><div role="group" class="ayy-filter-bar__group"><div class="ayy-input-group" style="inline-size:min(100%, 14rem)"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M17 17L21 21" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19C15.4183 19 19 15.4183 19 11Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg><input type="search" class="ayy-input" placeholder="Search tasks..." aria-label="Search tasks" value=""/></div><ayy-menu><button type="button" aria-haspopup="menu" aria-expanded="false" aria-pressed="false" popovertarget="filter-consolidated-menu-html" class="ayy-filter-bar__trigger"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M3 7H6" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M3 17H9" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M18 17L21 17" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M15 7L21 7" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M6 7C6 6.06812 6 5.60218 6.15224 5.23463C6.35523 4.74458 6.74458 4.35523 7.23463 4.15224C7.60218 4 8.06812 4 9 4C9.93188 4 10.3978 4 10.7654 4.15224C11.2554 4.35523 11.6448 4.74458 11.8478 5.23463C12 5.60218 12 6.06812 12 7C12 7.93188 12 8.39782 11.8478 8.76537C11.6448 9.25542 11.2554 9.64477 10.7654 9.84776C10.3978 10 9.93188 10 9 10C8.06812 10 7.60218 10 7.23463 9.84776C6.74458 9.64477 6.35523 9.25542 6.15224 8.76537C6 8.39782 6 7.93188 6 7Z" stroke="currentColor" stroke-width="1.5"></path><path d="M12 17C12 16.0681 12 15.6022 12.1522 15.2346C12.3552 14.7446 12.7446 14.3552 13.2346 14.1522C13.6022 14 14.0681 14 15 14C15.9319 14 16.3978 14 16.7654 14.1522C17.2554 14.3552 17.6448 14.7446 17.8478 15.2346C18 15.6022 18 16.0681 18 17C18 17.9319 18 18.3978 17.8478 18.7654C17.6448 19.2554 17.2554 19.6448 16.7654 19.8478C16.3978 20 15.9319 20 15 20C14.0681 20 13.6022 20 13.2346 19.8478C12.7446 19.6448 12.3552 19.2554 12.1522 18.7654C12 18.3978 12 17.9319 12 17Z" stroke="currentColor" stroke-width="1.5"></path></svg>Filters</button><div id="filter-consolidated-menu-html" role="menu" class="ayy-menu" popover="auto" aria-label="Filter options" style="min-inline-size:13rem"><div class="ayy-menu__label" role="presentation">Filter by</div><button type="button" class="ayy-menu__item ayy-menu__item--sub" role="menuitem" aria-haspopup="menu" aria-expanded="false" aria-controls="submenu-priority-html"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5.0249 21C5.04385 19.2643 5.04366 17.5541 5.0366 15.9209M5.0366 15.9209C5.01301 10.4614 4.91276 5.86186 5.19475 4.04271C5.5611 1.67939 9.39301 3.82993 13.9703 5.59842L16.0328 6.48729C17.5508 7.1415 19.7187 8.30352 18.7662 9.66084C18.3738 10.22 17.56 10.8596 16.0575 11.567L5.0366 15.9209Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg>Priority<span class="ayy-menu__chevron" aria-hidden="true"></span></button><div class="ayy-menu ayy-menu--sub" id="submenu-priority-html" popover role="menu" aria-label="Priority options"><button type="button" role="menuitemcheckbox" tabindex="-1" data-close-on-select="false" class="ayy-menu__item ayy-menu__item--selected" aria-checked="false">Urgent<span class="ayy-menu__value">2</span></button><button type="button" role="menuitemcheckbox" tabindex="-1" data-close-on-select="false" class="ayy-menu__item ayy-menu__item--selected" aria-checked="false">High<span class="ayy-menu__value">2</span></button><button type="button" role="menuitemcheckbox" tabindex="-1" data-close-on-select="false" class="ayy-menu__item ayy-menu__item--selected" aria-checked="false">Normal<span class="ayy-menu__value">2</span></button></div><button type="button" class="ayy-menu__item ayy-menu__item--sub" role="menuitem" aria-haspopup="menu" aria-expanded="false" aria-controls="submenu-category-html"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="1.5" cy="1.5" r="1.5" transform="matrix(1 0 0 -1 16 8.00024)" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></circle><path d="M2.77423 11.1439C1.77108 12.2643 1.7495 13.9546 2.67016 15.1437C4.49711 17.5033 6.49674 19.5029 8.85633 21.3298C10.0454 22.2505 11.7357 22.2289 12.8561 21.2258C15.8979 18.5022 18.6835 15.6559 21.3719 12.5279C21.6377 12.2187 21.8039 11.8397 21.8412 11.4336C22.0062 9.63798 22.3452 4.46467 20.9403 3.05974C19.5353 1.65481 14.362 1.99377 12.5664 2.15876C12.1603 2.19608 11.7813 2.36233 11.472 2.62811C8.34412 5.31646 5.49781 8.10211 2.77423 11.1439Z" stroke="currentColor" stroke-width="1.5"></path><path d="M7.00002 14.0002L10 17.0002" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg>Category<span class="ayy-menu__chevron" aria-hidden="true"></span></button><div class="ayy-menu ayy-menu--sub" id="submenu-category-html" popover role="menu" aria-label="Category options"><button type="button" role="menuitemcheckbox" tabindex="-1" data-close-on-select="false" class="ayy-menu__item ayy-menu__item--selected" aria-checked="false">Design<span class="ayy-menu__value">2</span></button><button type="button" role="menuitemcheckbox" tabindex="-1" data-close-on-select="false" class="ayy-menu__item ayy-menu__item--selected" aria-checked="false">Engineering<span class="ayy-menu__value">3</span></button><button type="button" role="menuitemcheckbox" tabindex="-1" data-close-on-select="false" class="ayy-menu__item ayy-menu__item--selected" aria-checked="false">Marketing<span class="ayy-menu__value">1</span></button></div><button type="button" class="ayy-menu__item ayy-menu__item--sub" role="menuitem" aria-haspopup="menu" aria-expanded="false" aria-controls="submenu-status-html"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12Z" stroke="currentColor" stroke-width="1.5"></path><path d="M8 12.75C8 12.75 9.6 13.6625 10.4 15C10.4 15 12.8 9.75 16 8" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg>Status<span class="ayy-menu__chevron" aria-hidden="true"></span></button><div class="ayy-menu ayy-menu--sub" id="submenu-status-html" popover role="menu" aria-label="Status options"><button type="button" role="menuitemcheckbox" tabindex="-1" data-close-on-select="false" class="ayy-menu__item ayy-menu__item--selected" aria-checked="false">In progress<span class="ayy-menu__value">3</span></button><button type="button" role="menuitemcheckbox" tabindex="-1" data-close-on-select="false" class="ayy-menu__item ayy-menu__item--selected" aria-checked="false">Backlog<span class="ayy-menu__value">2</span></button><button type="button" role="menuitemcheckbox" tabindex="-1" data-close-on-select="false" class="ayy-menu__item ayy-menu__item--selected" aria-checked="false">Completed<span class="ayy-menu__value">1</span></button></div></div></ayy-menu></div><span class="ayy-filter-bar__summary">Showing 6 of 6 tasks</span></div></div><div class="ayy-stack" style="gap:var(--ayy-space-2)"><div class="ayy-card"><div class="ayy-card__content" style="padding:var(--ayy-space-3)"><div class="ayy-spread"><div class="ayy-stack" style="gap:var(--ayy-space-1)"><span style="font-weight:var(--ayy-weight-medium)">Audit contrast across dark themes</span><span class="ayy-muted" style="font-size:var(--ayy-text-xs)">Design • In progress • Assigned to Dani</span></div><span class="ayy-badge ayy-badge--destructive">Urgent</span></div></div></div><div class="ayy-card"><div class="ayy-card__content" style="padding:var(--ayy-space-3)"><div class="ayy-spread"><div class="ayy-stack" style="gap:var(--ayy-space-1)"><span style="font-weight:var(--ayy-weight-medium)">Build accessible filter bar menus</span><span class="ayy-muted" style="font-size:var(--ayy-text-xs)">Engineering • In progress • Assigned to Alex</span></div><span class="ayy-badge ayy-badge--warning">High</span></div></div></div><div class="ayy-card"><div class="ayy-card__content" style="padding:var(--ayy-space-3)"><div class="ayy-spread"><div class="ayy-stack" style="gap:var(--ayy-space-1)"><span style="font-weight:var(--ayy-weight-medium)">Document keyboard shortcuts on Mac vs Windows</span><span class="ayy-muted" style="font-size:var(--ayy-text-xs)">Design • Backlog • Assigned to Dani</span></div><span class="ayy-badge ayy-badge--outline">Normal</span></div></div></div><div class="ayy-card"><div class="ayy-card__content" style="padding:var(--ayy-space-3)"><div class="ayy-spread"><div class="ayy-stack" style="gap:var(--ayy-space-1)"><span style="font-weight:var(--ayy-weight-medium)">Optimize CSS bundle gzip size</span><span class="ayy-muted" style="font-size:var(--ayy-text-xs)">Engineering • Completed • Assigned to Sarah</span></div><span class="ayy-badge ayy-badge--warning">High</span></div></div></div><div class="ayy-card"><div class="ayy-card__content" style="padding:var(--ayy-space-3)"><div class="ayy-spread"><div class="ayy-stack" style="gap:var(--ayy-space-1)"><span style="font-weight:var(--ayy-weight-medium)">Prepare release announcement copy</span><span class="ayy-muted" style="font-size:var(--ayy-text-xs)">Marketing • Backlog • Assigned to Elena</span></div><span class="ayy-badge ayy-badge--outline">Normal</span></div></div></div><div class="ayy-card"><div class="ayy-card__content" style="padding:var(--ayy-space-3)"><div class="ayy-spread"><div class="ayy-stack" style="gap:var(--ayy-space-1)"><span style="font-weight:var(--ayy-weight-medium)">Fix iOS tap highlight on segmented items</span><span class="ayy-muted" style="font-size:var(--ayy-text-xs)">Engineering • In progress • Assigned to Alex</span></div><span class="ayy-badge ayy-badge--destructive">Urgent</span></div></div></div></div></div>
```

React:

```tsx
import {
  CheckmarkCircle01Icon,
  FilterHorizontalIcon,
  Flag01Icon,
  Search01Icon,
  Tag01Icon,
} from "@hugeicons/core-free-icons";
import { useState } from "react";
import {
  Badge,
  Card,
  CardContent,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSelectedItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  EmptyState,
  EmptyStateDescription,
  EmptyStateTitle,
  FilterBar,
  FilterBarClear,
  FilterBarGroup,
  FilterBarMain,
  FilterBarSummary,
  FilterBarTrigger,
  Icon,
  Input,
  InputGroup,
} from "@danitesler/ayywi/react";

interface Task {
  id: string;
  title: string;
  priority: "Urgent" | "High" | "Normal";
  category: "Design" | "Engineering" | "Marketing";
  status: "In progress" | "Backlog" | "Completed";
  assignee: string;
}

const TASKS: Task[] = [
  { id: "1", title: "Audit contrast across dark themes", priority: "Urgent", category: "Design", status: "In progress", assignee: "Dani" },
  { id: "2", title: "Build accessible filter bar menus", priority: "High", category: "Engineering", status: "In progress", assignee: "Alex" },
  { id: "3", title: "Document keyboard shortcuts on Mac vs Windows", priority: "Normal", category: "Design", status: "Backlog", assignee: "Dani" },
  { id: "4", title: "Optimize CSS bundle gzip size", priority: "High", category: "Engineering", status: "Completed", assignee: "Sarah" },
  { id: "5", title: "Prepare release announcement copy", priority: "Normal", category: "Marketing", status: "Backlog", assignee: "Elena" },
  { id: "6", title: "Fix iOS tap highlight on segmented items", priority: "Urgent", category: "Engineering", status: "In progress", assignee: "Alex" },
];

const PRIORITIES: Array<Task["priority"]> = ["Urgent", "High", "Normal"];
const CATEGORIES: Array<Task["category"]> = ["Design", "Engineering", "Marketing"];
const STATUSES: Array<Task["status"]> = ["In progress", "Backlog", "Completed"];

const toggle = (list: string[], value: string) =>
  list.includes(value) ? list.filter((item) => item !== value) : [...list, value];

export default function Example() {
  const [search, setSearch] = useState("");
  const [priorities, setPriorities] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [statuses, setStatuses] = useState<string[]>([]);

  const totalActive = priorities.length + categories.length + statuses.length;

  const resetFilters = () => {
    setPriorities([]);
    setCategories([]);
    setStatuses([]);
  };

  const filtered = TASKS.filter((t) => {
    const matchesSearch = !search.trim() || t.title.toLowerCase().includes(search.toLowerCase());
    const matchesPriority = priorities.length === 0 || priorities.includes(t.priority);
    const matchesCategory = categories.length === 0 || categories.includes(t.category);
    const matchesStatus = statuses.length === 0 || statuses.includes(t.status);
    return matchesSearch && matchesPriority && matchesCategory && matchesStatus;
  });

  const priorityVariant = (p: Task["priority"]) => {
    if (p === "Urgent") return "destructive";
    if (p === "High") return "warning";
    return "outline";
  };

  return (
    <div className="ayy-stack" style={{ inlineSize: "100%", gap: "var(--ayy-space-4)" }}>
      <FilterBar style={{ inlineSize: "100%" }}>
        <FilterBarMain>
          <FilterBarGroup>
            <InputGroup style={{ inlineSize: "min(100%, 14rem)" }}>
              <Icon icon={Search01Icon} />
              <Input
                type="search"
                placeholder="Search tasks..."
                aria-label="Search tasks"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </InputGroup>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <FilterBarTrigger active={totalActive > 0} count={totalActive > 0 ? totalActive : undefined}>
                  <Icon icon={FilterHorizontalIcon} />
                  Filters
                </FilterBarTrigger>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" style={{ minInlineSize: "13rem" }} aria-label="Filter options">
                <DropdownMenuLabel>Filter by</DropdownMenuLabel>

                <DropdownMenuSub>
                  <DropdownMenuSubTrigger
                    icon={<Icon icon={Flag01Icon} />}
                    value={priorities.length > 0 ? priorities.length : undefined}
                  >
                    Priority
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent aria-label="Priority options">
                    {PRIORITIES.map((priority) => (
                      <DropdownMenuSelectedItem
                        key={priority}
                        selected={priorities.includes(priority)}
                        onSelectedChange={() => setPriorities((curr) => toggle(curr, priority))}
                        value={TASKS.filter((t) => t.priority === priority).length}
                      >
                        {priority}
                      </DropdownMenuSelectedItem>
                    ))}
                  </DropdownMenuSubContent>
                </DropdownMenuSub>

                <DropdownMenuSub>
                  <DropdownMenuSubTrigger
                    icon={<Icon icon={Tag01Icon} />}
                    value={categories.length > 0 ? categories.length : undefined}
                  >
                    Category
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent aria-label="Category options">
                    {CATEGORIES.map((category) => (
                      <DropdownMenuSelectedItem
                        key={category}
                        selected={categories.includes(category)}
                        onSelectedChange={() => setCategories((curr) => toggle(curr, category))}
                        value={TASKS.filter((t) => t.category === category).length}
                      >
                        {category}
                      </DropdownMenuSelectedItem>
                    ))}
                  </DropdownMenuSubContent>
                </DropdownMenuSub>

                <DropdownMenuSub>
                  <DropdownMenuSubTrigger
                    icon={<Icon icon={CheckmarkCircle01Icon} />}
                    value={statuses.length > 0 ? statuses.length : undefined}
                  >
                    Status
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent aria-label="Status options">
                    {STATUSES.map((status) => (
                      <DropdownMenuSelectedItem
                        key={status}
                        selected={statuses.includes(status)}
                        onSelectedChange={() => setStatuses((curr) => toggle(curr, status))}
                        value={TASKS.filter((t) => t.status === status).length}
                      >
                        {status}
                      </DropdownMenuSelectedItem>
                    ))}
                  </DropdownMenuSubContent>
                </DropdownMenuSub>

                {totalActive > 0 ? (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem destructive onSelect={resetFilters}>
                      Reset filters
                    </DropdownMenuItem>
                  </>
                ) : null}
              </DropdownMenuContent>
            </DropdownMenu>

            {totalActive > 0 ? (
              <FilterBarClear onClick={resetFilters}>Reset</FilterBarClear>
            ) : null}
          </FilterBarGroup>

          <FilterBarSummary>{`Showing ${filtered.length} of ${TASKS.length} tasks`}</FilterBarSummary>
        </FilterBarMain>
      </FilterBar>

      {filtered.length > 0 ? (
        <div className="ayy-stack" style={{ gap: "var(--ayy-space-2)" }}>
          {filtered.map((task) => (
            <Card key={task.id}>
              <CardContent style={{ padding: "var(--ayy-space-3)" }}>
                <div className="ayy-spread">
                  <div className="ayy-stack" style={{ gap: "var(--ayy-space-1)" }}>
                    <span style={{ fontWeight: "var(--ayy-weight-medium)" }}>{task.title}</span>
                    <span className="ayy-muted" style={{ fontSize: "var(--ayy-text-xs)" }}>
                      {`${task.category} • ${task.status} • Assigned to ${task.assignee}`}
                    </span>
                  </div>
                  <Badge variant={priorityVariant(task.priority)}>{task.priority}</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState>
          <EmptyStateTitle>No matching tasks</EmptyStateTitle>
          <EmptyStateDescription>Try clearing or modifying the active filters.</EmptyStateDescription>
        </EmptyState>
      )}
    </div>
  );
}
```

---
Part of @danitesler/ayywi 0.0.3: load `dist/ayywi.min.css` (and `dist/elements.global.js` for the <ayy-*> elements). The rules every screen follows: [llms-full.txt#rules](../llms-full.txt#rules). Every component: [llms.txt](../llms.txt).
