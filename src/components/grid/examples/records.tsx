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
  Avatar,
  Badge,
  Button,
  Checkbox,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Grid,
  GridItem,
  GridItemActions,
  GridItemBody,
  GridItemDescription,
  GridItemFooter,
  GridItemHeader,
  GridItemSelect,
  GridItemTitle,
  GridSelectAll,
  GridToolbar,
  GridWrap,
  Icon,
  toast,
} from "@danitesler/ayywi/react";

const records = [
  {
    id: "usr-1",
    name: "Maya Lin",
    role: "Staff Product Designer · Design Systems",
    summary: "Owns token architecture, accessibility reviews and Figma library sync.",
    status: "Active",
    variant: "success",
    team: "Core UI",
  },
  {
    id: "usr-2",
    name: "Ari Cohen",
    role: "Lead Frontend Engineer · Platform",
    summary: "Maintains custom elements runtime, SSR pipelines and bundle budgets.",
    status: "In review",
    variant: "warning",
    team: "Web Runtime",
  },
  {
    id: "usr-3",
    name: "Noa Levi",
    role: "Content Strategist · Social & Growth",
    summary: "Manages Q4 launch campaigns, social post templates and release notes.",
    status: "Active",
    variant: "info",
    team: "Marketing",
  },
] as const;

export default function Example() {
  const [selected, setSelected] = useState<string[]>(["usr-1"]);
  const all = selected.length === records.length;
  const toggle = (id: string, on: boolean) =>
    setSelected((list) => (on ? [...list, id] : list.filter((x) => x !== id)));

  return (
    <GridWrap>
      <GridToolbar>
        <GridSelectAll>
          <Checkbox
            aria-label="Select all records"
            checked={all}
            indeterminate={selected.length > 0 && !all}
            onCheckedChange={(on) => setSelected(on ? records.map((r) => r.id) : [])}
          />
          <span>{selected.length ? `${selected.length} selected` : `${records.length} records`}</span>
        </GridSelectAll>
      </GridToolbar>

      <Grid>
        {records.map((person) => {
          const isSelected = selected.includes(person.id);
          return (
            <GridItem
              key={person.id}
              selected={isSelected}
              onSelectedChange={(on) => toggle(person.id, on)}
            >
              <GridItemHeader>
                <div className="ayy-cluster" style={{ "--ayy-gap": "var(--ayy-space-3)" } as React.CSSProperties}>
                  <GridItemSelect>
                    <Checkbox
                      aria-label={`Select ${person.name}`}
                      checked={isSelected}
                      onCheckedChange={(on) => toggle(person.id, on)}
                    />
                  </GridItemSelect>
                  <Avatar name={person.name} size="sm" />
                  <div>
                    <GridItemTitle>{person.name}</GridItemTitle>
                    <GridItemDescription>{person.role}</GridItemDescription>
                  </div>
                </div>
                <GridItemActions>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`Edit ${person.name}`}
                    onClick={() => toast(`Edit ${person.name}`)}
                  >
                    <Icon icon={PencilEdit02Icon} />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      variant="ghost"
                      size="icon-sm"
                      aria-label={`More actions for ${person.name}`}
                    >
                      <Icon icon={MoreHorizontalIcon} />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>{person.name}</DropdownMenuLabel>
                      <DropdownMenuItem onSelect={() => toast(`Edit ${person.name}`)}>
                        <Icon icon={PencilEdit02Icon} />
                        Edit record
                      </DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => toast.success(`Duplicated ${person.name}`)} shortcut="Mod+D">
                        <Icon icon={Copy01Icon} />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => toast.success(`Copied ${person.name}`)} shortcut="Mod+C">
                        <Icon icon={CopyLinkIcon} />
                        Copy profile link
                      </DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => toast(`Archived ${person.name}`)}>
                        <Icon icon={Archive02Icon} />
                        Archive
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem destructive onSelect={() => toast.error(`Removed ${person.name}`)}>
                        <Icon icon={Delete02Icon} />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </GridItemActions>
              </GridItemHeader>

              <GridItemBody>
                <p>{person.summary}</p>
              </GridItemBody>

              <GridItemFooter>
                <Badge variant={person.variant}>{person.status}</Badge>
                <span>{person.team}</span>
              </GridItemFooter>
            </GridItem>
          );
        })}
      </Grid>

      <ActionBar open={selected.length > 0} onClear={() => setSelected([])}>
        <ActionBarSelection>
          <ActionBarCount>{selected.length} selected</ActionBarCount>
          <ActionBarClose />
        </ActionBarSelection>
        <ActionBarSeparator />
        <ActionBarActions>
          <ActionBarButton onClick={() => toast(`Editing ${selected.length} records`)}>
            <Icon icon={PencilEdit02Icon} />
            Edit
          </ActionBarButton>
          <ActionBarButton onClick={() => toast.success(`Duplicated ${selected.length} records`)}>
            <Icon icon={Copy01Icon} />
            Duplicate
          </ActionBarButton>
          <ActionBarButton onClick={() => toast.success(`Copied ${selected.length} records`)}>
            <Icon icon={CopyLinkIcon} />
            Copy
          </ActionBarButton>
          <ActionBarButton onClick={() => toast(`Archived ${selected.length} records`)}>
            <Icon icon={Archive02Icon} />
            Archive
          </ActionBarButton>
          <ActionBarSeparator />
          <ActionBarButton
            destructive
            onClick={() => {
              toast.error(`Deleted ${selected.length} records`);
              setSelected([]);
            }}
          >
            <Icon icon={Delete02Icon} />
            Delete
          </ActionBarButton>
        </ActionBarActions>
      </ActionBar>
    </GridWrap>
  );
}
