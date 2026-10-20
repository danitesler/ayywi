# Data explorer

A searchable, filterable, sortable view of records or media assets with multi-select and bulk actions: a Page header at the top, a Filter bar with status tabs, faceted dropdowns, search and sorting, a Table (for columns) or Grid (for cards and media) with inline quick actions and a ⋯ menu, a floating Action bar while items are selected, and Skeleton / Empty state / Alert states.

Built from: Page header, Filter bar, Search bar, Sorting, Chip, Table, Grid, Action bar, Dropdown menu, Pagination, Skeleton, Empty state, Alert. Example: Table → "Row actions, secondary menu and bulk action bar" (`get_component table`, llms/table.md).

**How**
1. Header: start the screen with a PageHeader (PageHeaderTitle as the one <h1>, PageHeaderDescription, and PageHeaderActions with at most one primary create Button and optional export/view controls).
2. Controls: place a FilterBar below the header. Its FilterBarMain holds FilterBarTabs (quick status tabs with counts), a FilterBarGroup of faceted FilterBarTriggers (opening DropdownMenus with DropdownMenuSelectedItem checkboxes), a SearchBar to filter by text, and a Sorting trigger (opening a DropdownMenu of sort fields and directions). When faceted filters are active, render FilterBarActive with ChipRemovable pills and a FilterBarClear button.
3. Records: render a Table (when comparing attributes across columns) or a Grid (when browsing media assets, screenshots, social posts or cards). Include a select-all Checkbox in the header/toolbar and a selection Checkbox on each row (TableCell select) or card (GridItemSelect).
4. Item actions: put 1–2 common inline icon Buttons (Edit, Copy) and a ⋯ DropdownMenu trigger (Duplicate, Archive, Delete last as destructive) inside TableRowActions (in a trailing TableCell actions) or GridItemActions (with reveal on desktop so actions show on hover, focus-within or selection).
5. Bulk actions: mount an ActionBar (open={selected.size > 0}) with ActionBarSelection (ActionBarCount + ActionBarClose for Esc/clear) and ActionBarActions of ActionBarButtons (Edit, Duplicate, Copy, Archive, and destructive Delete last).
6. States & paging: render Skeleton rows or cards with aria-busy="true" while loading, an EmptyState (with a "Clear filters" action when filters match nothing, or a primary create action when the collection is empty), an Alert variant="destructive" with a retry Button when loading fails, and Pagination below the table.

**Phones**
- FilterBarMain and FilterBarActive wrap naturally; when a chip strip sits alone on a phone, use ChipGroup scroll so it scrolls horizontally without wrapping into a tall block.
- Table scrolls horizontally inside .ayy-table-wrap; Grid drops columns automatically down to a single column below 48rem.
- Reveal actions (.ayy-table__row-actions--reveal and .ayy-grid__actions--reveal) stay visible on touch screens (@media (hover: none)) so every item's actions remain tappable without hover.
- The floating ActionBar stays anchored at the bottom of the viewport above safe areas; keep its action labels concise.

**Specs** (don't restyle these)
- **Filter bar (.ayy-filter-bar)**: Vertical stack (--ayy-space-2 gap) with --ayy-space-3 padding, 1px --ayy-color-line border, --ayy-radius-card, --ayy-color-surface (or .ayy-filter-bar--flush inside a card). Tabs sit in a wash track; faceted triggers use --ayy-size-control-md height (--ayy-size-control-sm in sm).
- **Table row & Grid card selection**: Selected table rows (tr[aria-selected="true"]) get --ayy-color-wash-hover; selected grid cards (.ayy-grid__item[aria-selected="true"]) get a 2px --ayy-color-text border, 1px ring and 4% text tint.
- **Item actions (.ayy-table__row-actions, .ayy-grid__actions)**: Inline-flex cluster (--ayy-space-1 gap). With --reveal, opacity is 0 at rest on hover-capable devices and 1 on row/card :hover, :focus-within, [aria-selected="true"], or when a menu trigger inside has [aria-expanded="true"].
- **Action bar (.ayy-action-bar)**: Fixed bottom-center pill (--ayy-space-6 from the bottom, z-index 40), --ayy-color-surface-raised, 1px --ayy-color-line-hover border, --ayy-radius-card, --ayy-shadow-lg. Selection count pill at the start, hairline divider, action buttons (--ayy-control-pad-md) with 8px gap.

**Do**
- Use this pattern for every table, directory, asset library, inbox list or record manager in an app.
- Keep the same actions in the per-item ⋯ DropdownMenu and the bulk ActionBar so single and multi-item workflows match.
- Distinguish an empty collection (offer the create button) from an empty filter result (offer "Clear filters").

**Don't**
- Don't build custom filter rows out of raw selects or unstyled buttons — use FilterBar, SearchBar and Sorting.
- Don't place static bulk action buttons above the table that sit disabled when nothing is selected — use the floating ActionBar.
- Don't hide row or card actions with display: none on hover, which removes them from keyboard Tab order and touch screens.

---
A pattern of @danitesler/ayywi 0.1.1. Every pattern and rule: [llms-full.txt#patterns](../llms-full.txt#patterns).
