import { useState } from "react";
import {
  Archive02Icon,
  Copy01Icon,
  CopyLinkIcon,
  Delete02Icon,
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
  Badge,
  Button,
  Checkbox,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Icon,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableRowActions,
  toast,
} from "@danitesler/ayywi/react";

const records = [
  { id: "PRJ-101", name: "Brand Kit 2026", owner: "Maya Lin", status: "Active", variant: "success", updated: "2h ago" },
  { id: "PRJ-102", name: "Mobile Onboarding Screenshots", owner: "Ari Cohen", status: "Review", variant: "warning", updated: "5h ago" },
  { id: "PRJ-103", name: "Q4 Social Campaign", owner: "Noa Levi", status: "Draft", variant: "muted", updated: "Yesterday" },
  { id: "PRJ-104", name: "Customer Directory Sync", owner: "Danilo Silva", status: "Active", variant: "success", updated: "Sep 14" },
] as const;

export default function Example() {
  const [selected, setSelected] = useState<string[]>(["PRJ-101"]);
  const all = selected.length === records.length;
  const toggle = (id: string, on: boolean) =>
    setSelected((list) => (on ? [...list, id] : list.filter((x) => x !== id)));

  return (
    <div className="ayy-stack" style={{ inlineSize: "100%" }}>
      <Table>
        <TableCaption className="ayy-sr-only">Projects with inline actions, secondary menus and bulk selection</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead select>
              <Checkbox
                aria-label="Select all projects"
                checked={all}
                indeterminate={selected.length > 0 && !all}
                onCheckedChange={(on) => setSelected(on ? records.map((r) => r.id) : [])}
              />
            </TableHead>
            <TableHead>Project</TableHead>
            <TableHead>Owner</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Updated</TableHead>
            <TableHead actions>
              <span className="ayy-sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.map((item) => (
            <TableRow key={item.id} selected={selected.includes(item.id)}>
              <TableCell select>
                <Checkbox
                  aria-label={`Select ${item.name}`}
                  checked={selected.includes(item.id)}
                  onCheckedChange={(on) => toggle(item.id, on)}
                />
              </TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell className="ayy-muted">{item.owner}</TableCell>
              <TableCell>
                <Badge variant={item.variant}>{item.status}</Badge>
              </TableCell>
              <TableCell className="ayy-muted">{item.updated}</TableCell>
              <TableCell actions>
                <TableRowActions>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`Edit ${item.name}`}
                    onClick={() => toast(`Edit ${item.name}`)}
                  >
                    <Icon icon={PencilEdit02Icon} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`Copy link to ${item.name}`}
                    onClick={() => toast.success(`Copied link to ${item.name}`)}
                  >
                    <Icon icon={CopyLinkIcon} />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      variant="ghost"
                      size="icon-sm"
                      aria-label={`More actions for ${item.name}`}
                    >
                      <Icon icon={MoreHorizontalIcon} />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>{item.name}</DropdownMenuLabel>
                      <DropdownMenuItem onSelect={() => toast(`Edit ${item.name}`)}>
                        <Icon icon={PencilEdit02Icon} />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => toast.success(`Duplicated ${item.name}`)} shortcut="Mod+D">
                        <Icon icon={Copy01Icon} />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => toast.success(`Copied ${item.name}`)} shortcut="Mod+C">
                        <Icon icon={CopyLinkIcon} />
                        Copy link
                      </DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => toast(`Archived ${item.name}`)}>
                        <Icon icon={Archive02Icon} />
                        Archive
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem destructive onSelect={() => toast.error(`Deleted ${item.name}`)}>
                        <Icon icon={Delete02Icon} />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableRowActions>
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
          <ActionBarButton onClick={() => toast(`Editing ${selected.length} selected`)}>
            <Icon icon={PencilEdit02Icon} />
            Edit
          </ActionBarButton>
          <ActionBarButton onClick={() => toast.success(`Duplicated ${selected.length} selected`)}>
            <Icon icon={Copy01Icon} />
            Duplicate
          </ActionBarButton>
          <ActionBarButton onClick={() => toast.success(`Copied ${selected.length} links`)}>
            <Icon icon={CopyLinkIcon} />
            Copy
          </ActionBarButton>
          <ActionBarButton onClick={() => toast(`Archived ${selected.length} selected`)}>
            <Icon icon={Archive02Icon} />
            Archive
          </ActionBarButton>
          <ActionBarSeparator />
          <ActionBarButton
            destructive
            onClick={() => {
              toast.error(`Deleted ${selected.length} selected`);
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
