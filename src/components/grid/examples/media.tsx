import { useState } from "react";
import {
  Archive02Icon,
  Copy01Icon,
  CopyLinkIcon,
  Delete02Icon,
  Image01Icon,
  MoreHorizontalIcon,
  PencilEdit02Icon,
  Share08Icon,
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
  Grid,
  GridItem,
  GridItemActions,
  GridItemDescription,
  GridItemFooter,
  GridItemHeader,
  GridItemMedia,
  GridItemSelect,
  GridItemTitle,
  GridSelectAll,
  GridToolbar,
  GridWrap,
  Icon,
  IconTile,
  toast,
} from "@danitesler/ayywi/react";

const assets = [
  {
    id: "asset-1",
    title: "Dashboard dark mode screenshot",
    subtitle: "PNG · 2880 × 1800 · 1.4 MB",
    tag: "Screenshot",
    variant: "info",
    spot: "var(--ayy-accent-product)",
    icon: Image01Icon,
  },
  {
    id: "asset-2",
    title: "Q4 launch announcement carousel",
    subtitle: "LinkedIn & X · 5 slides",
    tag: "Social post",
    variant: "success",
    spot: "var(--ayy-accent-marketing)",
    icon: Share08Icon,
  },
  {
    id: "asset-3",
    title: "Brand identity hero cover",
    subtitle: "WebP · 3840 × 2160 · 890 KB",
    tag: "Media asset",
    variant: "ai",
    spot: "var(--ayy-accent-brand)",
    icon: Image01Icon,
  },
] as const;

export default function Example() {
  const [selected, setSelected] = useState<string[]>(["asset-1", "asset-2"]);
  const all = selected.length === assets.length;
  const toggle = (id: string, on: boolean) =>
    setSelected((list) => (on ? [...list, id] : list.filter((x) => x !== id)));

  return (
    <GridWrap>
      <GridToolbar>
        <GridSelectAll>
          <Checkbox
            aria-label="Select all media assets"
            checked={all}
            indeterminate={selected.length > 0 && !all}
            onCheckedChange={(on) => setSelected(on ? assets.map((a) => a.id) : [])}
          />
          <span>{selected.length ? `${selected.length} of ${assets.length} selected` : `${assets.length} items`}</span>
        </GridSelectAll>
      </GridToolbar>

      <Grid>
        {assets.map((asset) => {
          const isSelected = selected.includes(asset.id);
          return (
            <GridItem
              key={asset.id}
              selected={isSelected}
              onSelectedChange={(on) => toggle(asset.id, on)}
              style={{ "--ayy-spot": asset.spot } as React.CSSProperties}
            >
              <GridItemMedia className="ayy-bg-grid">
                <GridItemSelect>
                  <Checkbox
                    aria-label={`Select ${asset.title}`}
                    checked={isSelected}
                    onCheckedChange={(on) => toggle(asset.id, on)}
                  />
                </GridItemSelect>
                <IconTile size="lg">
                  <Icon icon={asset.icon} size="lg" />
                </IconTile>
                <GridItemActions>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`Copy ${asset.title}`}
                    onClick={() => toast.success(`Copied ${asset.title}`)}
                  >
                    <Icon icon={CopyLinkIcon} />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      variant="ghost"
                      size="icon-sm"
                      aria-label={`More actions for ${asset.title}`}
                    >
                      <Icon icon={MoreHorizontalIcon} />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>{asset.title}</DropdownMenuLabel>
                      <DropdownMenuItem onSelect={() => toast(`Edit ${asset.title}`)}>
                        <Icon icon={PencilEdit02Icon} />
                        Edit details
                      </DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => toast.success(`Duplicated ${asset.title}`)} shortcut="Mod+D">
                        <Icon icon={Copy01Icon} />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => toast.success(`Copied link to ${asset.title}`)} shortcut="Mod+C">
                        <Icon icon={CopyLinkIcon} />
                        Copy link
                      </DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => toast(`Archived ${asset.title}`)}>
                        <Icon icon={Archive02Icon} />
                        Archive
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem destructive onSelect={() => toast.error(`Deleted ${asset.title}`)}>
                        <Icon icon={Delete02Icon} />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </GridItemActions>
              </GridItemMedia>

              <GridItemHeader>
                <div>
                  <GridItemTitle>{asset.title}</GridItemTitle>
                  <GridItemDescription>{asset.subtitle}</GridItemDescription>
                </div>
              </GridItemHeader>

              <GridItemFooter>
                <Badge variant={asset.variant}>{asset.tag}</Badge>
                <span>Updated today</span>
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
          <ActionBarButton onClick={() => toast(`Editing ${selected.length} items`)}>
            <Icon icon={PencilEdit02Icon} />
            Edit
          </ActionBarButton>
          <ActionBarButton onClick={() => toast.success(`Duplicated ${selected.length} items`)}>
            <Icon icon={Copy01Icon} />
            Duplicate
          </ActionBarButton>
          <ActionBarButton onClick={() => toast.success(`Copied ${selected.length} links`)}>
            <Icon icon={CopyLinkIcon} />
            Copy
          </ActionBarButton>
          <ActionBarButton onClick={() => toast(`Archived ${selected.length} items`)}>
            <Icon icon={Archive02Icon} />
            Archive
          </ActionBarButton>
          <ActionBarButton
            destructive
            onClick={() => {
              toast.error(`Deleted ${selected.length} items`);
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
