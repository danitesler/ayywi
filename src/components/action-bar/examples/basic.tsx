import { useState } from "react";
import {
  Archive02Icon,
  Copy01Icon,
  CopyLinkIcon,
  Delete02Icon,
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
  Badge,
  Checkbox,
  Icon,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  toast,
} from "@danitesler/ayywi/react";

const posts = [
  { id: "post-1", title: "Q4 product launch thread", channel: "LinkedIn", status: "Scheduled", variant: "info" },
  { id: "post-2", title: "Design tokens deep-dive reel", channel: "Instagram", status: "Draft", variant: "muted" },
  { id: "post-3", title: "Customer story: Northwind", channel: "X", status: "Published", variant: "success" },
] as const;

export default function Example() {
  const [selected, setSelected] = useState<string[]>(["post-1", "post-2"]);
  const all = selected.length === posts.length;
  const toggle = (id: string, on: boolean) =>
    setSelected((list) => (on ? [...list, id] : list.filter((x) => x !== id)));

  return (
    <div className="ayy-stack" style={{ inlineSize: "100%" }}>
      <Table>
        <TableCaption className="ayy-sr-only">Scheduled social posts</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead select>
              <Checkbox
                aria-label="Select all posts"
                checked={all}
                indeterminate={selected.length > 0 && !all}
                onCheckedChange={(on) => setSelected(on ? posts.map((p) => p.id) : [])}
              />
            </TableHead>
            <TableHead>Post</TableHead>
            <TableHead>Channel</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts.map((post) => (
            <TableRow key={post.id} selected={selected.includes(post.id)}>
              <TableCell select>
                <Checkbox
                  aria-label={`Select ${post.title}`}
                  checked={selected.includes(post.id)}
                  onCheckedChange={(on) => toggle(post.id, on)}
                />
              </TableCell>
              <TableCell>{post.title}</TableCell>
              <TableCell className="ayy-muted">{post.channel}</TableCell>
              <TableCell>
                <Badge variant={post.variant}>{post.status}</Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <ActionBar open={selected.length > 0} onClear={() => setSelected([])}>
        <ActionBarSelection>
          <ActionBarCount>{selected.length} selected</ActionBarCount>
          <ActionBarClose />
        </ActionBarSelection>
        <ActionBarSeparator />
        <ActionBarActions>
          <ActionBarButton onClick={() => toast(`Editing ${selected.length} posts`)}>
            <Icon icon={PencilEdit02Icon} />
            Edit
          </ActionBarButton>
          <ActionBarButton onClick={() => toast.success(`Duplicated ${selected.length} posts`)}>
            <Icon icon={Copy01Icon} />
            Duplicate
          </ActionBarButton>
          <ActionBarButton onClick={() => toast.success("Copied links")}>
            <Icon icon={CopyLinkIcon} />
            Copy
          </ActionBarButton>
          <ActionBarButton onClick={() => toast(`Archived ${selected.length} posts`)}>
            <Icon icon={Archive02Icon} />
            Archive
          </ActionBarButton>
          <ActionBarSeparator />
          <ActionBarButton
            destructive
            onClick={() => {
              toast.error(`Deleted ${selected.length} posts`);
              setSelected([]);
            }}
          >
            <Icon icon={Delete02Icon} />
            Delete
          </ActionBarButton>
        </ActionBarActions>
      </ActionBar>
    </div>
  );
}
