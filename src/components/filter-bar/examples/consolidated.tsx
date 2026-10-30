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
              <Icon icon={Search01Icon} name="search" />
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
                  <Icon icon={FilterHorizontalIcon} name="settings-2" />
                  Filters
                </FilterBarTrigger>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" style={{ minInlineSize: "13rem" }} aria-label="Filter options">
                <DropdownMenuLabel>Filter by</DropdownMenuLabel>

                <DropdownMenuSub>
                  <DropdownMenuSubTrigger
                    icon={<Icon icon={Flag01Icon} name="flag" />}
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
                    icon={<Icon icon={Tag01Icon} name="tag" />}
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
                    icon={<Icon icon={CheckmarkCircle01Icon} name="circle-check-2" />}
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
