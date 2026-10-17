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
