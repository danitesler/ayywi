import { useState } from "react";
import {
  Archive02Icon,
  Copy01Icon,
  CopyLinkIcon,
  Delete02Icon,
  Download01Icon,
  PencilEdit02Icon,
  Share01Icon,
  Tag01Icon,
  UserCheck01Icon,
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
  Tooltip,
  toast,
} from "@danitesler/ayywi/react";

const documents = [
  { id: "doc-1", title: "Product Roadmap Q3-Q4", owner: "Sarah Chen", tag: "Strategy", variant: "default" },
  { id: "doc-2", title: "Brand Token Specification", owner: "Alex Rivera", tag: "Design", variant: "info" },
  { id: "doc-3", title: "Security & Compliance Audit", owner: "Elena Rostova", tag: "Legal", variant: "warning" },
  { id: "doc-4", title: "Customer Interview Synthesis", owner: "Marcus Kim", tag: "Research", variant: "success" },
] as const;

export default function Example() {
  const [selected, setSelected] = useState<string[]>(["doc-1", "doc-2"]);
  const all = selected.length === documents.length;
  const toggle = (id: string, on: boolean) =>
    setSelected((list) => (on ? [...list, id] : list.filter((x) => x !== id)));

  return (
    <div className="ayy-stack" style={{ inlineSize: "100%" }}>
      <Table>
        <TableCaption className="ayy-sr-only">Team documents</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead select>
              <Checkbox
                aria-label="Select all documents"
                checked={all}
                indeterminate={selected.length > 0 && !all}
                onCheckedChange={(on) => setSelected(on ? documents.map((d) => d.id) : [])}
              />
            </TableHead>
            <TableHead>Document</TableHead>
            <TableHead>Owner</TableHead>
            <TableHead>Tag</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {documents.map((doc) => (
            <TableRow key={doc.id} selected={selected.includes(doc.id)}>
              <TableCell select>
                <Checkbox
                  aria-label={`Select ${doc.title}`}
                  checked={selected.includes(doc.id)}
                  onCheckedChange={(on) => toggle(doc.id, on)}
                />
              </TableCell>
              <TableCell>{doc.title}</TableCell>
              <TableCell className="ayy-muted">{doc.owner}</TableCell>
              <TableCell>
                <Badge variant={doc.variant}>{doc.tag}</Badge>
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
          {/* Unique / context-specific actions keep full labels */}
          <ActionBarButton onClick={() => toast(`Assigning reviewer to ${selected.length} docs`)}>
            <Icon icon={UserCheck01Icon} />
            Assign reviewer
          </ActionBarButton>
          <ActionBarButton onClick={() => toast(`Applying tags to ${selected.length} docs`)}>
            <Icon icon={Tag01Icon} />
            Change tag
          </ActionBarButton>
          <ActionBarButton onClick={() => toast(`Editing ${selected.length} docs`)}>
            <Icon icon={PencilEdit02Icon} />
            Edit
          </ActionBarButton>

          {/* Divider between labelled buttons and icon buttons */}
          <ActionBarSeparator />

          {/* Common bulk actions switch to icon-only buttons; always paired with a Tooltip and aria-label */}
          <Tooltip content="Share selected">
            <ActionBarButton icon aria-label="Share selected" onClick={() => toast.success("Share link created")}>
              <Icon icon={Share01Icon} />
            </ActionBarButton>
          </Tooltip>
          <Tooltip content="Copy links">
            <ActionBarButton icon aria-label="Copy links" onClick={() => toast.success("Copied links")}>
              <Icon icon={CopyLinkIcon} />
            </ActionBarButton>
          </Tooltip>
          <Tooltip content="Duplicate">
            <ActionBarButton icon aria-label="Duplicate selected" onClick={() => toast.success(`Duplicated ${selected.length} docs`)}>
              <Icon icon={Copy01Icon} />
            </ActionBarButton>
          </Tooltip>
          <Tooltip content="Download">
            <ActionBarButton icon aria-label="Download selected" onClick={() => toast(`Downloading ${selected.length} docs`)}>
              <Icon icon={Download01Icon} />
            </ActionBarButton>
          </Tooltip>
          <Tooltip content="Archive">
            <ActionBarButton icon aria-label="Archive selected" onClick={() => toast(`Archived ${selected.length} docs`)}>
              <Icon icon={Archive02Icon} />
            </ActionBarButton>
          </Tooltip>
          <Tooltip content="Delete">
            <ActionBarButton
              icon
              destructive
              aria-label="Delete selected"
              onClick={() => {
                toast.error(`Deleted ${selected.length} docs`);
                setSelected([]);
              }}
            >
              <Icon icon={Delete02Icon} />
            </ActionBarButton>
          </Tooltip>
        </ActionBarActions>
      </ActionBar>
    </div>
  );
}
