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
