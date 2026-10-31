# Tree

Category: Navigation. A hierarchical list of folders, files or records: groups that open and close with a chevron, one selected row and arrow-key navigation. Use it to browse a folder or file structure, or as a picker inside a card. Also called: tree, tree-view, file-tree, folder-tree, treeitem.

**Classes**
- `.ayy-tree` — Root <ul role="tree">. Its aria-label names it ("Folders"). <ayy-tree> wraps it with display: contents.
- `.ayy-tree--sm` — Small: the same as --compact (28px rows, sm text, a 16px indent), spelled like every other size.
- `.ayy-tree--lg` — Large: 36px rows, lg text, a 24px indent and toggle.
- `.ayy-tree__item` — One <li role="treeitem">. Carries aria-level, aria-selected on every node, aria-expanded only on parents, and a roving tabindex: exactly one visible item is 0, the rest -1. aria-disabled="true" makes it unselectable.
- `.ayy-tree__row` — The clickable row inside the item: toggle, optional icon and label. Hover and selected washes sit here, and so does the focus ring.
- `.ayy-tree__toggle` — The decorative <span aria-hidden="true"> holding the chevron. Clicking it opens or closes the group without selecting the row; the treeitem's aria-expanded carries the state.
- `.ayy-tree__icon` — An optional decorative icon before the label (an <svg class="ayy-icon ayy-tree__icon"> drawn by Icon or iconSvg). Muted, and text colour on the selected row.
- `.ayy-tree__label` — The node's label. It takes the leftover width, wraps anywhere so a long unbroken name never scrolls the tree sideways, and is not the accessible name: the item's aria-label is.
- `.ayy-tree__group` — A nested <ul role="group"> of child items, indented by --ayy-space-5 (--ayy-space-4 with --compact). Put hidden on it while its parent is aria-expanded="false"; connectTree keeps the two in step.
- `.ayy-tree--compact` — Tighter rows at the sm control height, small control text, a 16px indent and a 16px toggle.

**States**
- `default` — Rows at the md control height, with a muted chevron and icon, the label in the text colour, and --ayy-space-0-5 between rows.
- `hover` (`.ayy-tree__row:hover on a device that hovers`) — A --ayy-color-wash behind the row and, over the chevron, a --ayy-color-wash-hover and the text colour. A selected row keeps its stronger wash.
- `pressed` — doesn't apply: No pressed look: the click selects the row at once.
- `focus` (`.ayy-tree__item:focus-visible`) — A 2px --ayy-color-ring outline on the row, inset by 2px. Hidden after pointer use by trackInputModality()'s pointer mode.
- `disabled` (`aria-disabled="true" on the treeitem`) — --ayy-opacity-disabled and a not-allowed cursor; clicking selects and activates nothing. Forced colours: GrayText.
- `selected` (`aria-selected="true" on the treeitem, set by a click, Space, or your selectedId`) — A --ayy-color-wash-hover behind the row, the text colour and a medium weight; its icon takes the text colour. Forced colours: a Highlight outline.
- `error` — doesn't apply: No error state; show problems beside the tree (Alert or FieldError).
- `loading` — doesn't apply: No loading state; put Skeleton rows in the tree's place while it loads.
- `expanded` (`aria-expanded="true" on a parent treeitem`) — Its group is not hidden and the chevron turns down: rotate(90deg) in LTR, the mirror in RTL (--_ayy-dir). The treeitem's aria-expanded, not the decorative toggle, carries the state.

**Sizes**
- `sm` — The sm control height (28px compact, 32 comfortable, 40 touch), sm control text, 16px indent and toggle. Same as compact.
- `md` (default) — The md control height (32px compact, 40 comfortable, 44 touch), md control text, 20px indent and toggle.
- `lg` — The lg control height (36px compact, 44 comfortable, 48 touch), lg control text, 24px indent and toggle.
- Density — Rows are at least the md control height (32px compact, 40px comfortable, 44px touch) with --ayy-control-text-md; --compact uses the sm height (28, 32, 40) and --ayy-control-text-sm. The toggle is 20px (16px compact), so touch density keeps a comfortable target.
- Width — Fills its container. Child groups indent by --ayy-space-5 (--ayy-space-4 compact) using padding-inline-start, so they indent from the right in RTL. Labels take the leftover width and wrap anywhere.

**Custom element** `<ayy-tree>` (@danitesler/ayywi/elements) — Wraps the <ul role="tree"> and makes it work: the toggle opens and closes a group, a row selects, double-click or Enter activates, and the arrow keys, Home and End move the roving tab stop. focus(id) moves to a node from code.
- event `ayy-select`: { id } — a row was clicked or Space was pressed on it.
- event `ayy-activate`: { id } — a row was double-clicked or Enter was pressed on it (open the file or folder).
- event `ayy-toggle`: { id, expanded } — a group was opened (true) or closed (false).

**React** — `import { Tree, type TreeNode } from "@danitesler/ayywi/react";`
- `<Tree>` renders <ul class="ayy-tree" role="tree" aria-label> with a <li class="ayy-tree__item" role="treeitem"> per node, a __row inside it, and a nested <ul class="ayy-tree__group" role="group" hidden> for children. Props: `size` "sm" | "md" | "lg" — row height, indent and text; sm is the same as compact; `label` string — accessible name of the tree ("Folders"); `nodes` TreeNode[] — { id: string; label: string; icon?: ReactNode; children?: TreeNode[]; disabled?: boolean }, nested in display order; `expandedIds / defaultExpandedIds` string[] — open group ids; expandedIds makes it controlled, defaultExpandedIds sets the starting ones; `onExpandedChange` (ids: string[]) => void — a group opened or closed; `selectedId / defaultSelectedId` string — the selected node; selectedId makes it controlled, defaultSelectedId sets the starting one; `onSelectedChange` (id: string | null) => void — a row was selected; `onActivate` (id: string) => void — a row was double-clicked or Enter was pressed; `compact` boolean — tighter rows, a smaller indent and the small control text

**Accessibility**
- The tree is a <ul role="tree"> with a name (label in React, aria-label in HTML); each node is a <li role="treeitem"> with aria-level, and children sit in a <ul role="group">.
- aria-expanded is only on parents and aria-selected is on every node, so the state is announced rather than drawn only as a wash. The toggle is decorative (aria-hidden) and the item's aria-label is the node label, never the toggle.
- One visible item has tabindex="0" and the rest -1 (a roving tab stop). Tab enters the tree on the selected node, then the arrow keys, Home and End move through the visible nodes: Right closes an open group or opens a closed one and steps into its first child, Left closes an open group or moves to the parent.
- Enter activates a node and Space selects it. Double-click activates too. A composing IME and fields inside a row (a rename input) keep their keys.
- aria-disabled="true" keeps a node readable and reachable by the keyboard while it refuses selection and activation; colour is backed by opacity and, in High Contrast, GrayText.
- Long labels wrap inside the row instead of scrolling the tree sideways, and touch density raises the rows to the 44px target.

**Do**
- Use a tree to browse a nested structure: folders and files, a page hierarchy, categories or a project's contents.
- Keep ids stable and pass them as expandedIds/selectedId when the rest of the screen shows the same folder (a picker in a card, a split view).
- Pair the chevron with the label on the same row and let the label wrap; never truncate a folder name to make a narrow tree fit.

**Don't**
- Don't use a tree for a flat list — use List; for sections that collapse in place use Accordion.
- Don't use it as the app's main navigation — use App shell or Navbar.
- Don't pack several controls into a row: the tree ignores clicks inside a button, link or field, but the row's job is selection. Put a bigger set of actions in a detail pane or a menu outside the tree.
- Don't nest more than four or five levels; show a breadcrumb or a detail pane instead.

## Tree — Project files

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<!-- <ayy-tree> (@danitesler/ayywi/elements) expands and collapses groups, selects a row and wires the arrow keys. -->
<div class="ayy-stack" style="inline-size:min(100%, 22rem);--ayy-gap:var(--ayy-space-3)"><ayy-tree><ul class="ayy-tree" role="tree" aria-label="Folders"><li class="ayy-tree__item" role="treeitem" aria-level="1" aria-expanded="true" aria-selected="false" aria-label="Projects" data-id="projects" tabindex="-1"><div class="ayy-tree__row"><span class="ayy-tree__toggle" aria-hidden="true"><svg class="ayy-icon ayy-icon--directional" data-ayy-icon="chevron-right" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M9.00005 6C9.00005 6 15 10.4189 15 12C15 13.5812 9 18 9 18" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/></svg></span><svg class="ayy-icon ayy-tree__icon" data-ayy-icon="folder" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M8 7H16.75C18.8567 7 19.91 7 20.6667 7.50559C20.9943 7.72447 21.2755 8.00572 21.4944 8.33329C22 9.08996 22 10.1433 22 12.25C22 15.7612 22 17.5167 21.1573 18.7779C20.7926 19.3238 20.3238 19.7926 19.7779 20.1573C18.5167 21 16.7612 21 13.25 21H12C7.28595 21 4.92893 21 3.46447 19.5355C2 18.0711 2 15.714 2 11V7.94427C2 6.1278 2 5.21956 2.38032 4.53806C2.65142 4.05227 3.05227 3.65142 3.53806 3.38032C4.21956 3 5.1278 3 6.94427 3C8.10802 3 8.6899 3 9.19926 3.19101C10.3622 3.62712 10.8418 4.68358 11.3666 5.73313L12 7" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"/></svg><span class="ayy-tree__label">Projects</span></div><ul class="ayy-tree__group" role="group"><li class="ayy-tree__item" role="treeitem" aria-level="2" aria-selected="true" aria-label="Q4 launch" data-id="q4" tabindex="-1"><div class="ayy-tree__row"><svg class="ayy-icon ayy-tree__icon" data-ayy-icon="megaphone" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M9 14V6H6C5.07003 6 4.60504 6 4.22354 6.10222C3.18827 6.37962 2.37962 7.18827 2.10222 8.22354C2 8.60504 2 9.07003 2 10C2 10.93 2 11.395 2.10222 11.7765C2.37962 12.8117 3.18827 13.6204 4.22354 13.8978C4.60504 14 5.07003 14 6 14H9Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/><path d="M9 14L9.96466 18.8233C9.98816 18.9408 10 19.0604 10 19.1802V19.3411C10 20.2573 9.25728 21 8.34109 21C7.55885 21 6.8829 20.4536 6.719 19.6887L5.5 14" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/><path d="M10 6H9V14H10C11.2982 14 12.5614 14.4211 13.6 15.2L15.747 16.8103C15.9112 16.9334 16.111 17 16.3162 17C16.7246 17 17.0909 16.7404 17.2088 16.3495C17.5537 15.2067 18 13.2728 18 10C18 6.72718 17.5537 4.79327 17.2088 3.65054C17.0909 3.25961 16.7246 3 16.3162 3C16.111 3 15.9112 3.06658 15.747 3.18974L13.6 4.8C12.5614 5.57893 11.2982 6 10 6Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/><path d="M21 9.99996H22M20.5 6.00109L21.5 5.40637M20.5 14L21.5 14.6481" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/></svg><span class="ayy-tree__label">Q4 launch</span></div></li><li class="ayy-tree__item" role="treeitem" aria-level="2" aria-selected="false" aria-label="Averyveryverylongcampaignbriefwithnospacesfinalversion" data-id="avery" tabindex="-1"><div class="ayy-tree__row"><svg class="ayy-icon ayy-tree__icon" data-ayy-icon="file-text" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M8 17H16" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/><path d="M8 13H12" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/><path d="M13 2.5V3C13 5.82843 13 7.24264 13.8787 8.12132C14.7574 9 16.1716 9 19 9H19.5M20 10.6569V14C20 17.7712 20 19.6569 18.8284 20.8284C17.6569 22 15.7712 22 12 22C8.22876 22 6.34315 22 5.17157 20.8284C4 19.6569 4 17.7712 4 14V9.45584C4 6.21082 4 4.58831 4.88607 3.48933C5.06508 3.26731 5.26731 3.06508 5.48933 2.88607C6.58831 2 8.21082 2 11.4558 2C12.1614 2 12.5141 2 12.8372 2.11401C12.9044 2.13772 12.9702 2.165 13.0345 2.19575C13.3436 2.34355 13.593 2.593 14.0919 3.09188L18.8284 7.82843C19.4065 8.40649 19.6955 8.69552 19.8478 9.06306C20 9.4306 20 9.83935 20 10.6569Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/></svg><span class="ayy-tree__label">Averyveryverylongcampaignbriefwithnospacesfinalversion</span></div></li></ul></li><li class="ayy-tree__item" role="treeitem" aria-level="1" aria-expanded="false" aria-selected="false" aria-label="Team" data-id="team" tabindex="-1"><div class="ayy-tree__row"><span class="ayy-tree__toggle" aria-hidden="true"><svg class="ayy-icon ayy-icon--directional" data-ayy-icon="chevron-right" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M9.00005 6C9.00005 6 15 10.4189 15 12C15 13.5812 9 18 9 18" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/></svg></span><svg class="ayy-icon ayy-tree__icon" data-ayy-icon="folder" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M8 7H16.75C18.8567 7 19.91 7 20.6667 7.50559C20.9943 7.72447 21.2755 8.00572 21.4944 8.33329C22 9.08996 22 10.1433 22 12.25C22 15.7612 22 17.5167 21.1573 18.7779C20.7926 19.3238 20.3238 19.7926 19.7779 20.1573C18.5167 21 16.7612 21 13.25 21H12C7.28595 21 4.92893 21 3.46447 19.5355C2 18.0711 2 15.714 2 11V7.94427C2 6.1278 2 5.21956 2.38032 4.53806C2.65142 4.05227 3.05227 3.65142 3.53806 3.38032C4.21956 3 5.1278 3 6.94427 3C8.10802 3 8.6899 3 9.19926 3.19101C10.3622 3.62712 10.8418 4.68358 11.3666 5.73313L12 7" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"/></svg><span class="ayy-tree__label">Team</span></div><ul class="ayy-tree__group" role="group" hidden=""><li class="ayy-tree__item" role="treeitem" aria-level="2" aria-selected="false" aria-label="Design" data-id="design" tabindex="-1"><div class="ayy-tree__row"><svg class="ayy-icon ayy-tree__icon" data-ayy-icon="paintbrush" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M3.89089 20.8727L3 21L3.12727 20.1091C3.32086 18.754 3.41765 18.0764 3.71832 17.4751C4.01899 16.8738 4.50296 16.3898 5.47091 15.4218L16.9827 3.91009C17.4062 3.48654 17.618 3.27476 17.8464 3.16155C18.2811 2.94615 18.7914 2.94615 19.2261 3.16155C19.4546 3.27476 19.6663 3.48654 20.0899 3.91009C20.5135 4.33365 20.7252 4.54543 20.8385 4.77389C21.0539 5.20856 21.0539 5.71889 20.8385 6.15356C20.7252 6.38201 20.5135 6.59379 20.0899 7.01735L8.57816 18.5291C7.61022 19.497 7.12625 19.981 6.52491 20.2817C5.92357 20.5823 5.246 20.6791 3.89089 20.8727Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/><path d="M6 15L9 18M8.5 12.5L11.5 15.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/></svg><span class="ayy-tree__label">Design</span></div></li><li class="ayy-tree__item" role="treeitem" aria-level="2" aria-selected="false" aria-label="Brand kit" data-id="brand" tabindex="-1"><div class="ayy-tree__row"><svg class="ayy-icon ayy-tree__icon" data-ayy-icon="file-text" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M8 17H16" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/><path d="M8 13H12" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/><path d="M13 2.5V3C13 5.82843 13 7.24264 13.8787 8.12132C14.7574 9 16.1716 9 19 9H19.5M20 10.6569V14C20 17.7712 20 19.6569 18.8284 20.8284C17.6569 22 15.7712 22 12 22C8.22876 22 6.34315 22 5.17157 20.8284C4 19.6569 4 17.7712 4 14V9.45584C4 6.21082 4 4.58831 4.88607 3.48933C5.06508 3.26731 5.26731 3.06508 5.48933 2.88607C6.58831 2 8.21082 2 11.4558 2C12.1614 2 12.5141 2 12.8372 2.11401C12.9044 2.13772 12.9702 2.165 13.0345 2.19575C13.3436 2.34355 13.593 2.593 14.0919 3.09188L18.8284 7.82843C19.4065 8.40649 19.6955 8.69552 19.8478 9.06306C20 9.4306 20 9.83935 20 10.6569Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/></svg><span class="ayy-tree__label">Brand kit</span></div></li></ul></li><li class="ayy-tree__item" role="treeitem" aria-level="1" aria-selected="false" aria-disabled="true" aria-label="Shared with me" data-id="shared" tabindex="-1"><div class="ayy-tree__row"><svg class="ayy-icon ayy-tree__icon" data-ayy-icon="folder-user" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M16.3613 21H20.6387C21.5238 21 22.2723 20.3987 21.9039 19.753C21.3135 18.7186 20.0114 18 18.5 18C16.9886 18 15.6865 18.7186 15.0961 19.753C14.7277 20.3987 15.4762 21 16.3613 21Z" stroke="currentColor" stroke-linejoin="round" stroke-width="1.5"/><path d="M18.4969 15.5C19.4639 15.5 20.2477 14.7165 20.2477 13.75C20.2477 12.7835 19.4639 12 18.4969 12C17.53 12 16.7461 12.7835 16.7461 13.75C16.7461 14.7165 17.53 15.5 18.4969 15.5Z" stroke="currentColor" stroke-width="1.5"/><path d="M12.0027 21C7.28739 21 4.92973 21 3.46487 19.5355C2 18.0711 2 15.714 2 11V7.94427C2 6.1278 2 5.21956 2.38042 4.53806C2.6516 4.05227 3.05255 3.65142 3.53848 3.38032C4.22017 3 5.12865 3 6.94562 3C8.10968 3 8.69172 3 9.20122 3.19101C10.3645 3.62712 10.8442 4.68358 11.3691 5.73313L12.0027 7M8.00163 7H16.754C18.8613 7 19.9149 7 20.6718 7.50559C20.9995 7.72447 21.2808 8.00572 21.4997 8.33329C21.8937 8.92282 21.9808 9.69244 22 11" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"/></svg><span class="ayy-tree__label">Shared with me</span></div></li></ul></ayy-tree><output role="status" class="ayy-muted">Pick a file to open</output></div>
```

React:

```tsx
import { useState, type CSSProperties } from "react";
import { File02Icon, Folder01Icon, FolderShared01Icon, Megaphone01Icon, PaintBrush01Icon } from "@hugeicons/core-free-icons";
import { Icon, Tree, type TreeNode } from "@danitesler/ayywi/react";

const nodes: TreeNode[] = [
  {
    id: "projects",
    label: "Projects",
    icon: <Icon icon={Folder01Icon} name="folder" className="ayy-tree__icon" />,
    children: [
      { id: "q4", label: "Q4 launch", icon: <Icon icon={Megaphone01Icon} name="megaphone" className="ayy-tree__icon" /> },
      {
        id: "avery",
        label: "Averyveryverylongcampaignbriefwithnospacesfinalversion",
        icon: <Icon icon={File02Icon} name="file-text" className="ayy-tree__icon" />,
      },
    ],
  },
  {
    id: "team",
    label: "Team",
    icon: <Icon icon={Folder01Icon} name="folder" className="ayy-tree__icon" />,
    children: [
      { id: "design", label: "Design", icon: <Icon icon={PaintBrush01Icon} name="paintbrush" className="ayy-tree__icon" /> },
      { id: "brand", label: "Brand kit", icon: <Icon icon={File02Icon} name="file-text" className="ayy-tree__icon" /> },
    ],
  },
  {
    id: "shared",
    label: "Shared with me",
    icon: <Icon icon={FolderShared01Icon} name="folder-user" className="ayy-tree__icon" />,
    disabled: true,
  },
];

const flat = (list: TreeNode[]): TreeNode[] => list.flatMap((node) => [node, ...(node.children ? flat(node.children) : [])]);
const labels = new Map(flat(nodes).map((node) => [node.id, node.label]));

export default function Example() {
  const [opened, setOpened] = useState<string | null>(null);

  return (
    <div className="ayy-stack" style={{ inlineSize: "min(100%, 22rem)", "--ayy-gap": "var(--ayy-space-3)" } as CSSProperties}>
      <Tree
        label="Folders"
        nodes={nodes}
        defaultExpandedIds={["projects"]}
        defaultSelectedId="q4"
        onActivate={(id) => setOpened(labels.get(id) ?? id)}
      />
      <output role="status" className="ayy-muted">
        {opened ? `Opened ${opened}` : "Pick a file to open"}
      </output>
    </div>
  );
}
```

## Tree — Choose a folder

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<!-- <ayy-tree> (@danitesler/ayywi/elements) makes the folder tree selectable with a click and the arrow keys. -->
<div class="ayy-card" style="inline-size:min(100%, 22rem)"><div class="ayy-card__header"><h3 class="ayy-card__title">Choose a folder</h3><p class="ayy-card__description">Pick a folder for the Q4 launch.</p></div><div class="ayy-card__content"><ayy-tree><ul class="ayy-tree" role="tree" aria-label="Choose a folder"><li class="ayy-tree__item" role="treeitem" aria-level="1" aria-expanded="true" aria-selected="false" aria-label="Team" data-id="team" tabindex="-1"><div class="ayy-tree__row"><span class="ayy-tree__toggle" aria-hidden="true"><svg class="ayy-icon ayy-icon--directional" data-ayy-icon="chevron-right" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M9.00005 6C9.00005 6 15 10.4189 15 12C15 13.5812 9 18 9 18" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/></svg></span><svg class="ayy-icon ayy-tree__icon" data-ayy-icon="folder" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M8 7H16.75C18.8567 7 19.91 7 20.6667 7.50559C20.9943 7.72447 21.2755 8.00572 21.4944 8.33329C22 9.08996 22 10.1433 22 12.25C22 15.7612 22 17.5167 21.1573 18.7779C20.7926 19.3238 20.3238 19.7926 19.7779 20.1573C18.5167 21 16.7612 21 13.25 21H12C7.28595 21 4.92893 21 3.46447 19.5355C2 18.0711 2 15.714 2 11V7.94427C2 6.1278 2 5.21956 2.38032 4.53806C2.65142 4.05227 3.05227 3.65142 3.53806 3.38032C4.21956 3 5.1278 3 6.94427 3C8.10802 3 8.6899 3 9.19926 3.19101C10.3622 3.62712 10.8418 4.68358 11.3666 5.73313L12 7" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"/></svg><span class="ayy-tree__label">Team</span></div><ul class="ayy-tree__group" role="group"><li class="ayy-tree__item" role="treeitem" aria-level="2" aria-selected="false" aria-label="Marketing" data-id="marketing" tabindex="-1"><div class="ayy-tree__row"><svg class="ayy-icon ayy-tree__icon" data-ayy-icon="megaphone" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M9 14V6H6C5.07003 6 4.60504 6 4.22354 6.10222C3.18827 6.37962 2.37962 7.18827 2.10222 8.22354C2 8.60504 2 9.07003 2 10C2 10.93 2 11.395 2.10222 11.7765C2.37962 12.8117 3.18827 13.6204 4.22354 13.8978C4.60504 14 5.07003 14 6 14H9Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/><path d="M9 14L9.96466 18.8233C9.98816 18.9408 10 19.0604 10 19.1802V19.3411C10 20.2573 9.25728 21 8.34109 21C7.55885 21 6.8829 20.4536 6.719 19.6887L5.5 14" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/><path d="M10 6H9V14H10C11.2982 14 12.5614 14.4211 13.6 15.2L15.747 16.8103C15.9112 16.9334 16.111 17 16.3162 17C16.7246 17 17.0909 16.7404 17.2088 16.3495C17.5537 15.2067 18 13.2728 18 10C18 6.72718 17.5537 4.79327 17.2088 3.65054C17.0909 3.25961 16.7246 3 16.3162 3C16.111 3 15.9112 3.06658 15.747 3.18974L13.6 4.8C12.5614 5.57893 11.2982 6 10 6Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/><path d="M21 9.99996H22M20.5 6.00109L21.5 5.40637M20.5 14L21.5 14.6481" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/></svg><span class="ayy-tree__label">Marketing</span></div></li><li class="ayy-tree__item" role="treeitem" aria-level="2" aria-selected="true" aria-label="Design" data-id="design" tabindex="-1"><div class="ayy-tree__row"><svg class="ayy-icon ayy-tree__icon" data-ayy-icon="paintbrush" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M3.89089 20.8727L3 21L3.12727 20.1091C3.32086 18.754 3.41765 18.0764 3.71832 17.4751C4.01899 16.8738 4.50296 16.3898 5.47091 15.4218L16.9827 3.91009C17.4062 3.48654 17.618 3.27476 17.8464 3.16155C18.2811 2.94615 18.7914 2.94615 19.2261 3.16155C19.4546 3.27476 19.6663 3.48654 20.0899 3.91009C20.5135 4.33365 20.7252 4.54543 20.8385 4.77389C21.0539 5.20856 21.0539 5.71889 20.8385 6.15356C20.7252 6.38201 20.5135 6.59379 20.0899 7.01735L8.57816 18.5291C7.61022 19.497 7.12625 19.981 6.52491 20.2817C5.92357 20.5823 5.246 20.6791 3.89089 20.8727Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/><path d="M6 15L9 18M8.5 12.5L11.5 15.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/></svg><span class="ayy-tree__label">Design</span></div></li></ul></li><li class="ayy-tree__item" role="treeitem" aria-level="1" aria-expanded="false" aria-selected="false" aria-label="Projects" data-id="projects" tabindex="-1"><div class="ayy-tree__row"><span class="ayy-tree__toggle" aria-hidden="true"><svg class="ayy-icon ayy-icon--directional" data-ayy-icon="chevron-right" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M9.00005 6C9.00005 6 15 10.4189 15 12C15 13.5812 9 18 9 18" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/></svg></span><svg class="ayy-icon ayy-tree__icon" data-ayy-icon="folder-open" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M2 19V7.54902C2 6.10516 2 5.38322 2.24332 4.81647C2.5467 4.10985 3.10985 3.5467 3.81647 3.24332C4.38322 3 5.09805 3 6.54902 3H7.04311C7.64819 3 8.22075 3.27394 8.60041 3.74509L10.4175 6M10.4175 6H16C17.4001 6 18.1002 6 18.635 6.27248C19.1054 6.51217 19.4878 6.89462 19.7275 7.36502C20 7.8998 20 8.59987 20 10V11M10.4175 6H7" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/><path d="M3.15802 15.5144L3.45643 14.7717C4.19029 12.9449 4.55723 12.0316 5.3224 11.5158C6.08757 11 7.07557 11 9.05157 11H17.1119C19.8004 11 21.1446 11 21.7422 11.8787C22.3397 12.7575 21.8405 14.0002 20.842 16.4856L20.5436 17.2283C19.8097 19.0551 19.4428 19.9684 18.6776 20.4842C17.9124 21 16.9244 21 14.9484 21H6.88812C4.19961 21 2.85535 21 2.25782 20.1213C1.66029 19.2425 2.15953 17.9998 3.15802 15.5144Z" stroke="currentColor" stroke-linejoin="round" stroke-width="1.5"/></svg><span class="ayy-tree__label">Projects</span></div><ul class="ayy-tree__group" role="group" hidden=""><li class="ayy-tree__item" role="treeitem" aria-level="2" aria-selected="false" aria-label="Q4 launch" data-id="q4" tabindex="-1"><div class="ayy-tree__row"><svg class="ayy-icon ayy-tree__icon" data-ayy-icon="megaphone" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M9 14V6H6C5.07003 6 4.60504 6 4.22354 6.10222C3.18827 6.37962 2.37962 7.18827 2.10222 8.22354C2 8.60504 2 9.07003 2 10C2 10.93 2 11.395 2.10222 11.7765C2.37962 12.8117 3.18827 13.6204 4.22354 13.8978C4.60504 14 5.07003 14 6 14H9Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/><path d="M9 14L9.96466 18.8233C9.98816 18.9408 10 19.0604 10 19.1802V19.3411C10 20.2573 9.25728 21 8.34109 21C7.55885 21 6.8829 20.4536 6.719 19.6887L5.5 14" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/><path d="M10 6H9V14H10C11.2982 14 12.5614 14.4211 13.6 15.2L15.747 16.8103C15.9112 16.9334 16.111 17 16.3162 17C16.7246 17 17.0909 16.7404 17.2088 16.3495C17.5537 15.2067 18 13.2728 18 10C18 6.72718 17.5537 4.79327 17.2088 3.65054C17.0909 3.25961 16.7246 3 16.3162 3C16.111 3 15.9112 3.06658 15.747 3.18974L13.6 4.8C12.5614 5.57893 11.2982 6 10 6Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/><path d="M21 9.99996H22M20.5 6.00109L21.5 5.40637M20.5 14L21.5 14.6481" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/></svg><span class="ayy-tree__label">Q4 launch</span></div></li></ul></li><li class="ayy-tree__item" role="treeitem" aria-level="1" aria-selected="false" aria-label="Archive" data-id="archive" tabindex="-1"><div class="ayy-tree__row"><svg class="ayy-icon ayy-tree__icon" data-ayy-icon="folder-open" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M2 19V7.54902C2 6.10516 2 5.38322 2.24332 4.81647C2.5467 4.10985 3.10985 3.5467 3.81647 3.24332C4.38322 3 5.09805 3 6.54902 3H7.04311C7.64819 3 8.22075 3.27394 8.60041 3.74509L10.4175 6M10.4175 6H16C17.4001 6 18.1002 6 18.635 6.27248C19.1054 6.51217 19.4878 6.89462 19.7275 7.36502C20 7.8998 20 8.59987 20 10V11M10.4175 6H7" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/><path d="M3.15802 15.5144L3.45643 14.7717C4.19029 12.9449 4.55723 12.0316 5.3224 11.5158C6.08757 11 7.07557 11 9.05157 11H17.1119C19.8004 11 21.1446 11 21.7422 11.8787C22.3397 12.7575 21.8405 14.0002 20.842 16.4856L20.5436 17.2283C19.8097 19.0551 19.4428 19.9684 18.6776 20.4842C17.9124 21 16.9244 21 14.9484 21H6.88812C4.19961 21 2.85535 21 2.25782 20.1213C1.66029 19.2425 2.15953 17.9998 3.15802 15.5144Z" stroke="currentColor" stroke-linejoin="round" stroke-width="1.5"/></svg><span class="ayy-tree__label">Archive</span></div></li></ul></ayy-tree></div></div>
```

React:

```tsx
import { useState } from "react";
import { Folder01Icon, Folder02Icon, Megaphone01Icon, PaintBrush01Icon } from "@hugeicons/core-free-icons";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Icon, Tree, type TreeNode } from "@danitesler/ayywi/react";

const nodes: TreeNode[] = [
  {
    id: "team",
    label: "Team",
    icon: <Icon icon={Folder01Icon} name="folder" className="ayy-tree__icon" />,
    children: [
      { id: "marketing", label: "Marketing", icon: <Icon icon={Megaphone01Icon} name="megaphone" className="ayy-tree__icon" /> },
      { id: "design", label: "Design", icon: <Icon icon={PaintBrush01Icon} name="paintbrush" className="ayy-tree__icon" /> },
    ],
  },
  {
    id: "projects",
    label: "Projects",
    icon: <Icon icon={Folder02Icon} name="folder-open" className="ayy-tree__icon" />,
    children: [{ id: "q4", label: "Q4 launch", icon: <Icon icon={Megaphone01Icon} name="megaphone" className="ayy-tree__icon" /> }],
  },
  { id: "archive", label: "Archive", icon: <Icon icon={Folder02Icon} name="folder-open" className="ayy-tree__icon" /> },
];

export default function Example() {
  const [selected, setSelected] = useState("design");

  return (
    <Card style={{ inlineSize: "min(100%, 22rem)" }}>
      <CardHeader>
        <CardTitle>Choose a folder</CardTitle>
        <CardDescription>Pick a folder for the Q4 launch.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tree
          label="Choose a folder"
          nodes={nodes}
          defaultExpandedIds={["team"]}
          selectedId={selected}
          onSelectedChange={(id) => setSelected(id ?? "")}
        />
      </CardContent>
    </Card>
  );
}
```

## Tree — Sizes

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<!-- <ayy-tree> (@danitesler/ayywi/elements) expands and collapses groups, selects a row and wires the arrow keys. -->
<div class="ayy-stack" style="inline-size: min(100%, 22rem)">
  <ayy-tree>
    <ul class="ayy-tree ayy-tree--sm" role="tree" aria-label="Folders, small">
      <li class="ayy-tree__item" role="treeitem" aria-level="1" aria-expanded="true" aria-selected="false" aria-label="Projects" data-id="projects" tabindex="-1"><div class="ayy-tree__row"><span class="ayy-tree__toggle" aria-hidden="true"><svg class="ayy-icon ayy-icon--directional" data-ayy-icon="chevron-right" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M9.00005 6C9.00005 6 15 10.4189 15 12C15 13.5812 9 18 9 18" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg></span><svg class="ayy-icon ayy-tree__icon" data-ayy-icon="folder" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M8 7H16.75C18.8567 7 19.91 7 20.6667 7.50559C20.9943 7.72447 21.2755 8.00572 21.4944 8.33329C22 9.08996 22 10.1433 22 12.25C22 15.7612 22 17.5167 21.1573 18.7779C20.7926 19.3238 20.3238 19.7926 19.7779 20.1573C18.5167 21 16.7612 21 13.25 21H12C7.28595 21 4.92893 21 3.46447 19.5355C2 18.0711 2 15.714 2 11V7.94427C2 6.1278 2 5.21956 2.38032 4.53806C2.65142 4.05227 3.05227 3.65142 3.53806 3.38032C4.21956 3 5.1278 3 6.94427 3C8.10802 3 8.6899 3 9.19926 3.19101C10.3622 3.62712 10.8418 4.68358 11.3666 5.73313L12 7" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path></svg><span class="ayy-tree__label">Projects</span></div><ul class="ayy-tree__group" role="group"><li class="ayy-tree__item" role="treeitem" aria-level="2" aria-selected="true" aria-label="Q4 launch" data-id="q4" tabindex="-1"><div class="ayy-tree__row"><svg class="ayy-icon ayy-tree__icon" data-ayy-icon="file-text" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M8 17H16" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M8 13H12" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M13 2.5V3C13 5.82843 13 7.24264 13.8787 8.12132C14.7574 9 16.1716 9 19 9H19.5M20 10.6569V14C20 17.7712 20 19.6569 18.8284 20.8284C17.6569 22 15.7712 22 12 22C8.22876 22 6.34315 22 5.17157 20.8284C4 19.6569 4 17.7712 4 14V9.45584C4 6.21082 4 4.58831 4.88607 3.48933C5.06508 3.26731 5.26731 3.06508 5.48933 2.88607C6.58831 2 8.21082 2 11.4558 2C12.1614 2 12.5141 2 12.8372 2.11401C12.9044 2.13772 12.9702 2.165 13.0345 2.19575C13.3436 2.34355 13.593 2.593 14.0919 3.09188L18.8284 7.82843C19.4065 8.40649 19.6955 8.69552 19.8478 9.06306C20 9.4306 20 9.83935 20 10.6569Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg><span class="ayy-tree__label">Q4 launch</span></div></li><li class="ayy-tree__item" role="treeitem" aria-level="2" aria-selected="false" aria-label="Campaign brief" data-id="brief" tabindex="-1"><div class="ayy-tree__row"><svg class="ayy-icon ayy-tree__icon" data-ayy-icon="file-text" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M8 17H16" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M8 13H12" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M13 2.5V3C13 5.82843 13 7.24264 13.8787 8.12132C14.7574 9 16.1716 9 19 9H19.5M20 10.6569V14C20 17.7712 20 19.6569 18.8284 20.8284C17.6569 22 15.7712 22 12 22C8.22876 22 6.34315 22 5.17157 20.8284C4 19.6569 4 17.7712 4 14V9.45584C4 6.21082 4 4.58831 4.88607 3.48933C5.06508 3.26731 5.26731 3.06508 5.48933 2.88607C6.58831 2 8.21082 2 11.4558 2C12.1614 2 12.5141 2 12.8372 2.11401C12.9044 2.13772 12.9702 2.165 13.0345 2.19575C13.3436 2.34355 13.593 2.593 14.0919 3.09188L18.8284 7.82843C19.4065 8.40649 19.6955 8.69552 19.8478 9.06306C20 9.4306 20 9.83935 20 10.6569Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg><span class="ayy-tree__label">Campaign brief</span></div></li></ul></li>
      <li class="ayy-tree__item" role="treeitem" aria-level="1" aria-selected="false" aria-label="Team" data-id="team" tabindex="-1"><div class="ayy-tree__row"><svg class="ayy-icon ayy-tree__icon" data-ayy-icon="folder" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M8 7H16.75C18.8567 7 19.91 7 20.6667 7.50559C20.9943 7.72447 21.2755 8.00572 21.4944 8.33329C22 9.08996 22 10.1433 22 12.25C22 15.7612 22 17.5167 21.1573 18.7779C20.7926 19.3238 20.3238 19.7926 19.7779 20.1573C18.5167 21 16.7612 21 13.25 21H12C7.28595 21 4.92893 21 3.46447 19.5355C2 18.0711 2 15.714 2 11V7.94427C2 6.1278 2 5.21956 2.38032 4.53806C2.65142 4.05227 3.05227 3.65142 3.53806 3.38032C4.21956 3 5.1278 3 6.94427 3C8.10802 3 8.6899 3 9.19926 3.19101C10.3622 3.62712 10.8418 4.68358 11.3666 5.73313L12 7" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path></svg><span class="ayy-tree__label">Team</span></div></li>
    </ul>
  </ayy-tree>
  <ayy-tree>
    <ul class="ayy-tree" role="tree" aria-label="Folders, medium">
      <li class="ayy-tree__item" role="treeitem" aria-level="1" aria-expanded="true" aria-selected="false" aria-label="Projects" data-id="projects" tabindex="-1"><div class="ayy-tree__row"><span class="ayy-tree__toggle" aria-hidden="true"><svg class="ayy-icon ayy-icon--directional" data-ayy-icon="chevron-right" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M9.00005 6C9.00005 6 15 10.4189 15 12C15 13.5812 9 18 9 18" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg></span><svg class="ayy-icon ayy-tree__icon" data-ayy-icon="folder" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M8 7H16.75C18.8567 7 19.91 7 20.6667 7.50559C20.9943 7.72447 21.2755 8.00572 21.4944 8.33329C22 9.08996 22 10.1433 22 12.25C22 15.7612 22 17.5167 21.1573 18.7779C20.7926 19.3238 20.3238 19.7926 19.7779 20.1573C18.5167 21 16.7612 21 13.25 21H12C7.28595 21 4.92893 21 3.46447 19.5355C2 18.0711 2 15.714 2 11V7.94427C2 6.1278 2 5.21956 2.38032 4.53806C2.65142 4.05227 3.05227 3.65142 3.53806 3.38032C4.21956 3 5.1278 3 6.94427 3C8.10802 3 8.6899 3 9.19926 3.19101C10.3622 3.62712 10.8418 4.68358 11.3666 5.73313L12 7" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path></svg><span class="ayy-tree__label">Projects</span></div><ul class="ayy-tree__group" role="group"><li class="ayy-tree__item" role="treeitem" aria-level="2" aria-selected="true" aria-label="Q4 launch" data-id="q4" tabindex="-1"><div class="ayy-tree__row"><svg class="ayy-icon ayy-tree__icon" data-ayy-icon="file-text" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M8 17H16" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M8 13H12" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M13 2.5V3C13 5.82843 13 7.24264 13.8787 8.12132C14.7574 9 16.1716 9 19 9H19.5M20 10.6569V14C20 17.7712 20 19.6569 18.8284 20.8284C17.6569 22 15.7712 22 12 22C8.22876 22 6.34315 22 5.17157 20.8284C4 19.6569 4 17.7712 4 14V9.45584C4 6.21082 4 4.58831 4.88607 3.48933C5.06508 3.26731 5.26731 3.06508 5.48933 2.88607C6.58831 2 8.21082 2 11.4558 2C12.1614 2 12.5141 2 12.8372 2.11401C12.9044 2.13772 12.9702 2.165 13.0345 2.19575C13.3436 2.34355 13.593 2.593 14.0919 3.09188L18.8284 7.82843C19.4065 8.40649 19.6955 8.69552 19.8478 9.06306C20 9.4306 20 9.83935 20 10.6569Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg><span class="ayy-tree__label">Q4 launch</span></div></li><li class="ayy-tree__item" role="treeitem" aria-level="2" aria-selected="false" aria-label="Campaign brief" data-id="brief" tabindex="-1"><div class="ayy-tree__row"><svg class="ayy-icon ayy-tree__icon" data-ayy-icon="file-text" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M8 17H16" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M8 13H12" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M13 2.5V3C13 5.82843 13 7.24264 13.8787 8.12132C14.7574 9 16.1716 9 19 9H19.5M20 10.6569V14C20 17.7712 20 19.6569 18.8284 20.8284C17.6569 22 15.7712 22 12 22C8.22876 22 6.34315 22 5.17157 20.8284C4 19.6569 4 17.7712 4 14V9.45584C4 6.21082 4 4.58831 4.88607 3.48933C5.06508 3.26731 5.26731 3.06508 5.48933 2.88607C6.58831 2 8.21082 2 11.4558 2C12.1614 2 12.5141 2 12.8372 2.11401C12.9044 2.13772 12.9702 2.165 13.0345 2.19575C13.3436 2.34355 13.593 2.593 14.0919 3.09188L18.8284 7.82843C19.4065 8.40649 19.6955 8.69552 19.8478 9.06306C20 9.4306 20 9.83935 20 10.6569Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg><span class="ayy-tree__label">Campaign brief</span></div></li></ul></li>
      <li class="ayy-tree__item" role="treeitem" aria-level="1" aria-selected="false" aria-label="Team" data-id="team" tabindex="-1"><div class="ayy-tree__row"><svg class="ayy-icon ayy-tree__icon" data-ayy-icon="folder" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M8 7H16.75C18.8567 7 19.91 7 20.6667 7.50559C20.9943 7.72447 21.2755 8.00572 21.4944 8.33329C22 9.08996 22 10.1433 22 12.25C22 15.7612 22 17.5167 21.1573 18.7779C20.7926 19.3238 20.3238 19.7926 19.7779 20.1573C18.5167 21 16.7612 21 13.25 21H12C7.28595 21 4.92893 21 3.46447 19.5355C2 18.0711 2 15.714 2 11V7.94427C2 6.1278 2 5.21956 2.38032 4.53806C2.65142 4.05227 3.05227 3.65142 3.53806 3.38032C4.21956 3 5.1278 3 6.94427 3C8.10802 3 8.6899 3 9.19926 3.19101C10.3622 3.62712 10.8418 4.68358 11.3666 5.73313L12 7" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path></svg><span class="ayy-tree__label">Team</span></div></li>
    </ul>
  </ayy-tree>
  <ayy-tree>
    <ul class="ayy-tree ayy-tree--lg" role="tree" aria-label="Folders, large">
      <li class="ayy-tree__item" role="treeitem" aria-level="1" aria-expanded="true" aria-selected="false" aria-label="Projects" data-id="projects" tabindex="-1"><div class="ayy-tree__row"><span class="ayy-tree__toggle" aria-hidden="true"><svg class="ayy-icon ayy-icon--directional" data-ayy-icon="chevron-right" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M9.00005 6C9.00005 6 15 10.4189 15 12C15 13.5812 9 18 9 18" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg></span><svg class="ayy-icon ayy-tree__icon" data-ayy-icon="folder" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M8 7H16.75C18.8567 7 19.91 7 20.6667 7.50559C20.9943 7.72447 21.2755 8.00572 21.4944 8.33329C22 9.08996 22 10.1433 22 12.25C22 15.7612 22 17.5167 21.1573 18.7779C20.7926 19.3238 20.3238 19.7926 19.7779 20.1573C18.5167 21 16.7612 21 13.25 21H12C7.28595 21 4.92893 21 3.46447 19.5355C2 18.0711 2 15.714 2 11V7.94427C2 6.1278 2 5.21956 2.38032 4.53806C2.65142 4.05227 3.05227 3.65142 3.53806 3.38032C4.21956 3 5.1278 3 6.94427 3C8.10802 3 8.6899 3 9.19926 3.19101C10.3622 3.62712 10.8418 4.68358 11.3666 5.73313L12 7" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path></svg><span class="ayy-tree__label">Projects</span></div><ul class="ayy-tree__group" role="group"><li class="ayy-tree__item" role="treeitem" aria-level="2" aria-selected="true" aria-label="Q4 launch" data-id="q4" tabindex="-1"><div class="ayy-tree__row"><svg class="ayy-icon ayy-tree__icon" data-ayy-icon="file-text" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M8 17H16" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M8 13H12" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M13 2.5V3C13 5.82843 13 7.24264 13.8787 8.12132C14.7574 9 16.1716 9 19 9H19.5M20 10.6569V14C20 17.7712 20 19.6569 18.8284 20.8284C17.6569 22 15.7712 22 12 22C8.22876 22 6.34315 22 5.17157 20.8284C4 19.6569 4 17.7712 4 14V9.45584C4 6.21082 4 4.58831 4.88607 3.48933C5.06508 3.26731 5.26731 3.06508 5.48933 2.88607C6.58831 2 8.21082 2 11.4558 2C12.1614 2 12.5141 2 12.8372 2.11401C12.9044 2.13772 12.9702 2.165 13.0345 2.19575C13.3436 2.34355 13.593 2.593 14.0919 3.09188L18.8284 7.82843C19.4065 8.40649 19.6955 8.69552 19.8478 9.06306C20 9.4306 20 9.83935 20 10.6569Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg><span class="ayy-tree__label">Q4 launch</span></div></li><li class="ayy-tree__item" role="treeitem" aria-level="2" aria-selected="false" aria-label="Campaign brief" data-id="brief" tabindex="-1"><div class="ayy-tree__row"><svg class="ayy-icon ayy-tree__icon" data-ayy-icon="file-text" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M8 17H16" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M8 13H12" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M13 2.5V3C13 5.82843 13 7.24264 13.8787 8.12132C14.7574 9 16.1716 9 19 9H19.5M20 10.6569V14C20 17.7712 20 19.6569 18.8284 20.8284C17.6569 22 15.7712 22 12 22C8.22876 22 6.34315 22 5.17157 20.8284C4 19.6569 4 17.7712 4 14V9.45584C4 6.21082 4 4.58831 4.88607 3.48933C5.06508 3.26731 5.26731 3.06508 5.48933 2.88607C6.58831 2 8.21082 2 11.4558 2C12.1614 2 12.5141 2 12.8372 2.11401C12.9044 2.13772 12.9702 2.165 13.0345 2.19575C13.3436 2.34355 13.593 2.593 14.0919 3.09188L18.8284 7.82843C19.4065 8.40649 19.6955 8.69552 19.8478 9.06306C20 9.4306 20 9.83935 20 10.6569Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg><span class="ayy-tree__label">Campaign brief</span></div></li></ul></li>
      <li class="ayy-tree__item" role="treeitem" aria-level="1" aria-selected="false" aria-label="Team" data-id="team" tabindex="-1"><div class="ayy-tree__row"><svg class="ayy-icon ayy-tree__icon" data-ayy-icon="folder" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M8 7H16.75C18.8567 7 19.91 7 20.6667 7.50559C20.9943 7.72447 21.2755 8.00572 21.4944 8.33329C22 9.08996 22 10.1433 22 12.25C22 15.7612 22 17.5167 21.1573 18.7779C20.7926 19.3238 20.3238 19.7926 19.7779 20.1573C18.5167 21 16.7612 21 13.25 21H12C7.28595 21 4.92893 21 3.46447 19.5355C2 18.0711 2 15.714 2 11V7.94427C2 6.1278 2 5.21956 2.38032 4.53806C2.65142 4.05227 3.05227 3.65142 3.53806 3.38032C4.21956 3 5.1278 3 6.94427 3C8.10802 3 8.6899 3 9.19926 3.19101C10.3622 3.62712 10.8418 4.68358 11.3666 5.73313L12 7" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path></svg><span class="ayy-tree__label">Team</span></div></li>
    </ul>
  </ayy-tree>
</div>
```

React:

```tsx
import { File02Icon, Folder01Icon } from "@hugeicons/core-free-icons";
import { Icon, Tree, type TreeNode } from "@danitesler/ayywi/react";

const nodes: TreeNode[] = [
  {
    id: "projects",
    label: "Projects",
    icon: <Icon icon={Folder01Icon} name="folder" className="ayy-tree__icon" />,
    children: [
      { id: "q4", label: "Q4 launch", icon: <Icon icon={File02Icon} name="file-text" className="ayy-tree__icon" /> },
      { id: "brief", label: "Campaign brief", icon: <Icon icon={File02Icon} name="file-text" className="ayy-tree__icon" /> },
    ],
  },
  { id: "team", label: "Team", icon: <Icon icon={Folder01Icon} name="folder" className="ayy-tree__icon" /> },
];

export default function Example() {
  return (
    <div className="ayy-stack" style={{ inlineSize: "min(100%, 22rem)" }}>
      <Tree size="sm" label="Folders, small" nodes={nodes} defaultExpandedIds={["projects"]} defaultSelectedId="q4" />
      <Tree label="Folders, medium" nodes={nodes} defaultExpandedIds={["projects"]} defaultSelectedId="q4" />
      <Tree size="lg" label="Folders, large" nodes={nodes} defaultExpandedIds={["projects"]} defaultSelectedId="q4" />
    </div>
  );
}
```

---
Part of @danitesler/ayywi 0.1.2: load `dist/ayywi.min.css` (and `dist/elements.global.js` for the <ayy-*> elements). The rules every screen follows: [llms-full.txt#rules](../llms-full.txt#rules). Every component: [llms.txt](../llms.txt).
