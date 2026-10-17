import { ArrowDown01Icon, Sorting05Icon } from "@hugeicons/core-free-icons";
import { useState } from "react";
import {
  Card,
  CardContent,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
  Icon,
  Sorting,
  SortingTrigger,
} from "@danitesler/ayywi/react";

interface RecordItem {
  id: string;
  title: string;
  updated: string;
  timestamp: number;
  comments: number;
}

const RECORDS: RecordItem[] = [
  { id: "1", title: "API Gateway migration", updated: "5m ago", timestamp: 5, comments: 14 },
  { id: "2", title: "Checkout redesign proposal", updated: "2h ago", timestamp: 120, comments: 28 },
  { id: "3", title: "Design tokens sync script", updated: "Yesterday", timestamp: 1440, comments: 6 },
  { id: "4", title: "Auth token refresh bugfix", updated: "3d ago", timestamp: 4320, comments: 3 },
];

const OPTIONS = [
  { value: "recent", label: "Recently updated" },
  { value: "oldest", label: "Oldest first" },
  { value: "comments", label: "Most comments" },
  { value: "alpha", label: "Alphabetical" },
];

export default function Example() {
  const [sortKey, setSortKey] = useState("recent");

  const sorted = [...RECORDS].sort((a, b) => {
    if (sortKey === "recent") return a.timestamp - b.timestamp;
    if (sortKey === "oldest") return b.timestamp - a.timestamp;
    if (sortKey === "comments") return b.comments - a.comments;
    return a.title.localeCompare(b.title);
  });

  const currentLabel = OPTIONS.find((o) => o.value === sortKey)?.label ?? "Recently updated";

  return (
    <div className="ayy-stack" style={{ inlineSize: "100%", gap: "var(--ayy-space-4)" }}>
      <div className="ayy-spread">
        <span className="ayy-muted" style={{ fontSize: "var(--ayy-text-sm)" }}>Project documents</span>
        <Sorting>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SortingTrigger aria-label={`Sort by ${currentLabel}`}>
                <Icon icon={Sorting05Icon} />
                <span>{`Sort: ${currentLabel}`}</span>
                <Icon icon={ArrowDown01Icon} />
              </SortingTrigger>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" aria-label="Sort options">
              <DropdownMenuRadioGroup value={sortKey} onValueChange={setSortKey} closeOnSelect>
                {OPTIONS.map((opt) => (
                  <DropdownMenuRadioItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </Sorting>
      </div>

      <div className="ayy-stack" style={{ gap: "var(--ayy-space-2)" }}>
        {sorted.map((item) => (
          <Card key={item.id}>
            <CardContent style={{ padding: "var(--ayy-space-3)" }}>
              <div className="ayy-spread">
                <span style={{ fontWeight: "var(--ayy-weight-medium)" }}>{item.title}</span>
                <span className="ayy-muted" style={{ fontSize: "var(--ayy-text-xs)" }}>
                  {`Updated ${item.updated} • ${item.comments} comments`}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
