# Action bar

Category: Actions. Floating bottom multi-select bar that animates into view when one or more rows or cards are selected in a Table, Grid or List. Shows the selected count, a clear button (Esc), and bulk actions such as Edit, Duplicate, Copy, Archive and Delete. Also called: action-bar, actionbar, bulk-actions, bulk-action-bar, selection-bar, batch-actions, multi-select-bar.

**Classes**
- `.ayy-action-bar` — Root floating pill bar, role="toolbar". Hidden until the open attribute is present, then animates in with a spring lift, and plays the same animation in reverse on exit.
- `.ayy-action-bar--fixed` — Pins the bar to the bottom center of the viewport instead of sticky inside its scroll container.
- `.ayy-action-bar__selection` — Start section grouping the selected count and the clear selection button.
- `.ayy-action-bar__count` — Tabular-numeral count of selected items (e.g. "3 selected").
- `.ayy-action-bar__close` — Icon button (×) that clears the current selection (also triggered by Escape).
- `.ayy-action-bar__separator` — Vertical hairline divider between the selection count and actions, or before destructive actions.
- `.ayy-action-bar__actions` — Scrollable group of bulk action buttons (role="group").
- `.ayy-action-bar__button` — Compact action button inside the bar, with an optional leading icon and label.
- `.ayy-action-bar__button--primary` — Primary bulk action button filled with the primary token.
- `.ayy-action-bar__button--secondary` — Secondary bulk action button with a wash fill and subtle border.
- `.ayy-action-bar__button--destructive` — Destructive bulk action button (e.g. Delete) in the destructive colour.
- `.ayy-action-bar__button--icon` — Square icon-only action button for common bulk actions (e.g. Copy, Archive, Delete).

**States**
- `default` — Hidden until [open] is set; when open, a blurred glass pill with a line-strong border, overlay shadow, semibold count, clear button and standard action buttons.
- `hover` (`.ayy-action-bar__button:hover:not(:disabled), .ayy-action-bar__close:hover (devices that hover)`) — Buttons tint with a wash fill; primary dims; destructive gets a 18% tint and border; close button turns text colour.
- `pressed` (`.ayy-action-bar__button:active:not(:disabled)`) — Button dims slightly (opacity 0.85).
- `focus` (`.ayy-action-bar__button:focus-visible, .ayy-action-bar__close:focus-visible`) — 2px ring, 2px offset. The bar is one Tab stop; Left/Right arrows move between buttons.
- `disabled` (`.ayy-action-bar__button:disabled`) — --ayy-opacity-disabled, not-allowed cursor; arrow keys skip it.
- `selected` — doesn't apply: Bulk actions execute on click; use open for a button whose overflow menu is open.
- `error` — doesn't apply: Use variant="destructive" (.ayy-action-bar__button--destructive) for Delete; report a failed bulk action with a toast.
- `loading` — doesn't apply: Bulk actions act immediately or report progress in a toast.
- `open` (`.ayy-action-bar[open]; .ayy-action-bar__button[aria-expanded="true"]`) — The bar smoothly lifts and fades in with spring easing, and plays the same animation in reverse on close; a menu trigger button keeps the wash-hover fill and line-strong border.

**Sizes**
- Density — Buttons and the clear control follow --ayy-size-control-sm (28px compact, 32px comfortable, 40px touch) and --ayy-control-text-sm.
- Width — Hugs its buttons (fit-content) up to 100% of its container (or viewport when fixed), scrolling sideways if actions overflow on a phone.

**Custom element** `<ayy-action-bar>` (@danitesler/ayywi/elements) — 
- event `ayy-clear`: Fired when the clear button or Escape clears the selection; call preventDefault() to keep it.

**React** — `import { ActionBar, ActionBarSelection, ActionBarCount, ActionBarClose, ActionBarSeparator, ActionBarActions, ActionBarButton } from "@danitesler/ayywi/react";`
- `<ActionBar>` renders <div role="toolbar" class="ayy-action-bar">. Props: `open` boolean — shows the bar with its entrance animation when true; `fixed` boolean — pins to the bottom center of the viewport; `label` string — aria-label for the toolbar (default "Bulk actions"); `onClear` () => void — called when the clear button or Escape is pressed
- `<ActionBarSelection>` renders <div class="ayy-action-bar__selection">. Props: 
- `<ActionBarCount>` renders <span class="ayy-action-bar__count">. Props: 
- `<ActionBarClose>` renders <button type="button" class="ayy-action-bar__close">. Props: `label` string — accessible label for the clear button (default "Clear selection")
- `<ActionBarSeparator>` renders <div role="separator" class="ayy-action-bar__separator">. Props: 
- `<ActionBarActions>` renders <div role="group" class="ayy-action-bar__actions">. Props: 
- `<ActionBarButton>` renders <button type="button" class="ayy-action-bar__button">. Props: `variant` "default" | "primary" | "secondary" | "destructive"; `primary` boolean — shorthand for variant="primary"; `secondary` boolean — shorthand for variant="secondary"; `destructive` boolean — shorthand for variant="destructive"; `icon` boolean — square icon-only button without label padding (must provide aria-label); `open` boolean — aria-expanded when used as a DropdownMenuTrigger

**Accessibility**
- role="toolbar" with an aria-label ("Bulk actions"): one Tab stop, Left/Right arrow keys (mirrored in RTL) and Home/End move between the clear button and actions.
- Pressing Escape or clicking ActionBarClose clears the selection and dismisses the bar.
- Icon-only buttons inside the bar must have an aria-label (e.g. aria-label="Delete selected") and always be wrapped in a Tooltip.
- High Contrast mode borders the bar in CanvasText and highlights primary or open buttons with Highlight.

**Do**
- Use an Action bar with a selectable Table or Grid so bulk actions appear at the bottom as soon as one or more items are selected.
- Show the selected count first, followed by the clear button, a separator, and the actions with destructive Delete last.
- When an Action bar has many actions, keep text labels for unique or context-specific actions (e.g. "Assign reviewer", "Change status") and use icon-only buttons (`icon`, `aria-label`) for universally recognized bulk actions (Duplicate, Copy link, Archive, Delete).
- Place an ActionBarSeparator between labelled buttons and icon buttons to visually divide distinct action groups.
- Always pair icon-only action buttons with a Tooltip so users can identify the action on hover and keyboard focus.
- Fold less common bulk actions into a DropdownMenu triggered from a trailing ActionBarButton.

**Don't**
- Don't leave an Action bar visible with 0 selected items — hide it by omitting open (open={selected.length > 0}) instead of disabling every button.
- Don't use an Action bar for permanent page actions or navigation — use PageHeader actions, Toolbar or BottomNav.
- Don't cram more than five labelled actions into the bar without switching common actions to icon-only buttons or moving extras into a ⋯ DropdownMenu.

## Action bar — Multi-select bulk actions

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<!-- <ayy-action-bar> manages roving tabindex across action buttons, clears selection on Esc or close click, and syncs with sibling <ayy-table> or <ayy-grid>. -->
<div class="ayy-stack" style="inline-size: 100%">
  <ayy-table>
    <div class="ayy-table-wrap">
      <table class="ayy-table">
        <caption class="ayy-sr-only">Scheduled social posts</caption>
        <thead>
          <tr>
            <th scope="col" class="ayy-table__select"><input type="checkbox" class="ayy-checkbox" aria-label="Select all posts" /></th>
            <th scope="col">Post</th>
            <th scope="col">Channel</th>
            <th scope="col">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr aria-selected="true">
            <td class="ayy-table__select"><input type="checkbox" class="ayy-checkbox" aria-label="Select Q4 product launch thread" checked /></td>
            <td>Q4 product launch thread</td>
            <td class="ayy-muted">LinkedIn</td>
            <td><span class="ayy-badge ayy-badge--info">Scheduled</span></td>
          </tr>
          <tr aria-selected="true">
            <td class="ayy-table__select"><input type="checkbox" class="ayy-checkbox" aria-label="Select Design tokens deep-dive reel" checked /></td>
            <td>Design tokens deep-dive reel</td>
            <td class="ayy-muted">Instagram</td>
            <td><span class="ayy-badge ayy-badge--muted">Draft</span></td>
          </tr>
          <tr aria-selected="false">
            <td class="ayy-table__select"><input type="checkbox" class="ayy-checkbox" aria-label="Select Customer story: Northwind" /></td>
            <td>Customer story: Northwind</td>
            <td class="ayy-muted">X</td>
            <td><span class="ayy-badge ayy-badge--success">Published</span></td>
          </tr>
        </tbody>
      </table>
    </div>
  </ayy-table>

  <ayy-action-bar>
    <div role="toolbar" aria-label="Bulk actions" open class="ayy-action-bar">
      <div class="ayy-action-bar__selection">
        <span class="ayy-action-bar__count">2 selected</span>
        <button type="button" aria-label="Clear selection" class="ayy-action-bar__close">
          <svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M18 6L6.00081 17.9992M17.9992 18L6 6.00085" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/></svg>
        </button>
      </div>
      <div role="separator" class="ayy-action-bar__separator"></div>
      <div role="group" class="ayy-action-bar__actions">
        <button type="button" class="ayy-action-bar__button" onclick="ayywi.toast('Editing 2 posts')">
          <svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M16.4249 4.60509L17.4149 3.6151C18.2351 2.79497 19.5648 2.79497 20.3849 3.6151C21.205 4.43524 21.205 5.76493 20.3849 6.58507L19.3949 7.57506M16.4249 4.60509L9.76558 11.2644C9.25807 11.772 8.89804 12.4078 8.72397 13.1041L8 16L10.8959 15.276C11.5922 15.102 12.228 14.7419 12.7356 14.2344L19.3949 7.57506M16.4249 4.60509L19.3949 7.57506" stroke="currentColor" stroke-linejoin="round" stroke-width="1.5"/><path d="M18.9999 13.5C18.9999 16.7875 18.9999 18.4312 18.092 19.5376C17.9258 19.7401 17.7401 19.9258 17.5375 20.092C16.4312 21 14.7874 21 11.4999 21H11C7.22876 21 5.34316 21 4.17159 19.8284C3.00003 18.6569 3 16.7712 3 13V12.5C3 9.21252 3 7.56879 3.90794 6.46244C4.07417 6.2599 4.2599 6.07417 4.46244 5.90794C5.56879 5 7.21252 5 10.5 5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/></svg>
          Edit
        </button>
        <button type="button" class="ayy-action-bar__button" onclick="ayywi.toast.success('Duplicated 2 posts')">
          <svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7.5 14.5C7.5 11.2002 7.5 9.55025 8.52513 8.52513C9.55025 7.5 11.2002 7.5 14.5 7.5C17.7998 7.5 19.4497 7.5 20.4749 8.52513C21.5 9.55025 21.5 11.2002 21.5 14.5C21.5 17.7998 21.5 19.4497 20.4749 20.4749C19.4497 21.5 17.7998 21.5 14.5 21.5C11.2002 21.5 9.55025 21.5 8.52513 20.4749C7.5 19.4497 7.5 17.7998 7.5 14.5Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/><path d="M7.5 16.5C6.10355 16.5 5.40533 16.5 4.84402 16.3036C3.83866 15.9518 3.0482 15.1613 2.69641 14.156C2.5 13.5947 2.5 12.8964 2.5 11.5V9.5C2.5 6.20017 2.5 4.55025 3.52513 3.52513C4.55025 2.5 6.20017 2.5 9.5 2.5H11.5C12.8964 2.5 13.5947 2.5 14.156 2.69641C15.1613 3.0482 15.9518 3.83866 16.3036 4.84402C16.5 5.40533 16.5 6.10355 16.5 7.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/></svg>
          Duplicate
        </button>
        <button type="button" class="ayy-action-bar__button" onclick="ayywi.toast.success('Copied links')">
          <svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M14.5563 13.2183C13.514 14.2606 11.8241 14.2606 10.7817 13.2183C9.73942 12.1759 9.73942 10.486 10.7817 9.44364L13.1409 7.0845C14.1357 6.08961 15.7206 6.04433 16.7692 6.94866M16.4437 3.78175C17.486 2.73942 19.1759 2.73942 20.2183 3.78175C21.2606 4.82408 21.2606 6.51403 20.2183 7.55636L17.8591 9.9155C16.8643 10.9104 15.2794 10.9557 14.2308 10.0513" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/><path d="M10.4999 3C7.21257 3 5.56889 3 4.46256 3.9079C4.25998 4.07414 4.07423 4.25989 3.90798 4.46247C3.00007 5.56879 3.00006 7.21247 3.00002 10.4998L3 12.9999C2.99996 16.7712 2.99995 18.6568 4.17152 19.8284C5.3431 21 7.22873 21 11 21H13.4999C16.7874 21 18.4311 21 19.5375 20.092C19.74 19.9258 19.9257 19.7401 20.092 19.5376C20.9999 18.4312 20.9999 16.7875 20.9999 13.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/></svg>
          Copy
        </button>
        <button type="button" class="ayy-action-bar__button" onclick="ayywi.toast('Archived 2 posts')">
          <svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7 21H16.9999C19.3569 21 20.5354 21 21.2677 20.2678C21.9999 19.5355 21.9999 18.357 21.9999 16C21.9999 13.643 21.9999 12.4645 21.2677 11.7322C20.5354 11 19.3569 11 16.9999 11H7C4.64302 11 3.46453 11 2.7323 11.7322C2.00007 12.4644 2.00005 13.6429 2 15.9999C1.99995 18.357 1.99993 19.5355 2.73217 20.2677C3.4644 21 4.64294 21 7 21Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/><path d="M4 11C4.00005 9.59977 4.00008 8.89966 4.27263 8.36485C4.5123 7.89455 4.89469 7.51218 5.365 7.27253C5.89981 7 6.59993 7 8.00015 7H16C17.4001 7 18.1002 7 18.635 7.27248C19.1054 7.51217 19.4878 7.89462 19.7275 8.36502C20 8.8998 20 9.59987 20 11" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/><path d="M6 7C6.00004 5.5998 6.00006 4.89969 6.27259 4.3649C6.51227 3.89457 6.89467 3.51218 7.36501 3.27252C7.89981 3 8.59991 3 10.0001 3H14C15.4001 3 16.1002 3 16.635 3.27248C17.1054 3.51217 17.4878 3.89462 17.7275 4.36502C18 4.8998 18 5.59987 18 7" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/><path d="M16 15L15.7 15.4C15.1111 16.1851 14.8167 16.5777 14.3944 16.7889C13.9721 17 13.4814 17 12.5 17H11.5C10.5186 17 10.0279 17 9.60557 16.7889C9.18328 16.5777 8.88885 16.1851 8.3 15.4L8 15" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/></svg>
          Archive
        </button>
        <button type="button" class="ayy-action-bar__button ayy-action-bar__button--destructive" onclick="ayywi.toast.error('Deleted 2 posts')">
          <svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M19.5 5.5L18.8803 15.5251C18.7219 18.0864 18.6428 19.3671 18.0008 20.2879C17.6833 20.7431 17.2747 21.1273 16.8007 21.416C15.8421 22 14.559 22 11.9927 22C9.42312 22 8.1383 22 7.17905 21.4149C6.7048 21.1257 6.296 20.7408 5.97868 20.2848C5.33688 19.3626 5.25945 18.0801 5.10461 15.5152L4.5 5.5" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"/><path d="M3 5.5H21M16.0557 5.5L15.3731 4.09173C14.9196 3.15626 14.6928 2.68852 14.3017 2.39681C14.215 2.3321 14.1231 2.27454 14.027 2.2247C13.5939 2 13.0741 2 12.0345 2C10.9688 2 10.436 2 9.99568 2.23412C9.8981 2.28601 9.80498 2.3459 9.71729 2.41317C9.32164 2.7167 9.10063 3.20155 8.65861 4.17126L8.05292 5.5" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"/><path d="M9.5 16.5L9.5 10.5" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"/><path d="M14.5 16.5L14.5 10.5" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"/></svg>
          Delete
        </button>
      </div>
    </div>
  </ayy-action-bar>
</div>
```

React:

```tsx
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
```

## Action bar — Many actions with icon buttons

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<!-- When an Action bar has many actions, keep full labels for unique or context-specific actions and use icon-only buttons for universally recognized bulk actions (Duplicate, Copy, Archive, Delete). -->
<div class="ayy-stack" style="inline-size: 100%">
  <ayy-table>
    <div class="ayy-table-wrap">
      <table class="ayy-table">
        <caption class="ayy-sr-only">Team documents</caption>
        <thead>
          <tr>
            <th scope="col" class="ayy-table__select"><input type="checkbox" class="ayy-checkbox" aria-label="Select all documents" /></th>
            <th scope="col">Document</th>
            <th scope="col">Owner</th>
            <th scope="col">Tag</th>
          </tr>
        </thead>
        <tbody>
          <tr aria-selected="true">
            <td class="ayy-table__select"><input type="checkbox" class="ayy-checkbox" aria-label="Select Product Roadmap Q3-Q4" checked /></td>
            <td>Product Roadmap Q3-Q4</td>
            <td class="ayy-muted">Sarah Chen</td>
            <td><span class="ayy-badge">Strategy</span></td>
          </tr>
          <tr aria-selected="true">
            <td class="ayy-table__select"><input type="checkbox" class="ayy-checkbox" aria-label="Select Brand Token Specification" checked /></td>
            <td>Brand Token Specification</td>
            <td class="ayy-muted">Alex Rivera</td>
            <td><span class="ayy-badge ayy-badge--info">Design</span></td>
          </tr>
          <tr aria-selected="false">
            <td class="ayy-table__select"><input type="checkbox" class="ayy-checkbox" aria-label="Select Security & Compliance Audit" /></td>
            <td>Security & Compliance Audit</td>
            <td class="ayy-muted">Elena Rostova</td>
            <td><span class="ayy-badge ayy-badge--warning">Legal</span></td>
          </tr>
          <tr aria-selected="false">
            <td class="ayy-table__select"><input type="checkbox" class="ayy-checkbox" aria-label="Select Customer Interview Synthesis" /></td>
            <td>Customer Interview Synthesis</td>
            <td class="ayy-muted">Marcus Kim</td>
            <td><span class="ayy-badge ayy-badge--success">Research</span></td>
          </tr>
        </tbody>
      </table>
    </div>
  </ayy-table>

  <ayy-action-bar>
    <div role="toolbar" aria-label="Bulk actions" open class="ayy-action-bar">
      <div class="ayy-action-bar__selection">
        <span class="ayy-action-bar__count">2 selected</span>
        <button type="button" aria-label="Clear selection" class="ayy-action-bar__close">
          <svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M18 6L6.00081 17.9992M17.9992 18L6 6.00085" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/></svg>
        </button>
      </div>
      <div role="separator" class="ayy-action-bar__separator"></div>
      <div role="group" class="ayy-action-bar__actions">
        <!-- Unique / context-specific actions with full text labels -->
        <button type="button" class="ayy-action-bar__button" onclick="ayywi.toast('Assigning reviewer to 2 docs')">
          <svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M3 21.0001C3.28417 17.3057 6.3 14.2192 10.0008 14.0378C10.3134 14.0225 10.6446 14.0096 11 13.9999L11.995 14.0662C13.0751 14.1382 14.0925 14.4366 15 14.9146" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/><circle cx="11" cy="6.99988" r="4" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/><path d="M14 19.3332C14 19.3332 14.875 19.3332 15.75 20.9999C15.75 20.9999 18.5294 16.8332 21 15.9999" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/></svg>
          Assign reviewer
        </button>
        <button type="button" class="ayy-action-bar__button" onclick="ayywi.toast('Applying tags to 2 docs')">
          <svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="1.5" cy="1.5" r="1.5" transform="matrix(1 0 0 -1 16 8.00024)" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/><path d="M2.77423 11.1439C1.77108 12.2643 1.7495 13.9546 2.67016 15.1437C4.49711 17.5033 6.49674 19.5029 8.85633 21.3298C10.0454 22.2505 11.7357 22.2289 12.8561 21.2258C15.8979 18.5022 18.6835 15.6559 21.3719 12.5279C21.6377 12.2187 21.8039 11.8397 21.8412 11.4336C22.0062 9.63798 22.3452 4.46467 20.9403 3.05974C19.5353 1.65481 14.362 1.99377 12.5664 2.15876C12.1603 2.19608 11.7813 2.36233 11.472 2.62811C8.34412 5.31646 5.49781 8.10211 2.77423 11.1439Z" stroke="currentColor" stroke-width="1.5"/><path d="M7.00002 14.0002L10 17.0002" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/></svg>
          Change tag
        </button>
        <button type="button" class="ayy-action-bar__button" onclick="ayywi.toast('Editing 2 docs')">
          <svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M16.4249 4.60509L17.4149 3.6151C18.2351 2.79497 19.5648 2.79497 20.3849 3.6151C21.205 4.43524 21.205 5.76493 20.3849 6.58507L19.3949 7.57506M16.4249 4.60509L9.76558 11.2644C9.25807 11.772 8.89804 12.4078 8.72397 13.1041L8 16L10.8959 15.276C11.5922 15.102 12.228 14.7419 12.7356 14.2344L19.3949 7.57506M16.4249 4.60509L19.3949 7.57506" stroke="currentColor" stroke-linejoin="round" stroke-width="1.5"/><path d="M18.9999 13.5C18.9999 16.7875 18.9999 18.4312 18.092 19.5376C17.9258 19.7401 17.7401 19.9258 17.5375 20.092C16.4312 21 14.7874 21 11.4999 21H11C7.22876 21 5.34316 21 4.17159 19.8284C3.00003 18.6569 3 16.7712 3 13V12.5C3 9.21252 3 7.56879 3.90794 6.46244C4.07417 6.2599 4.2599 6.07417 4.46244 5.90794C5.56879 5 7.21252 5 10.5 5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/></svg>
          Edit
        </button>

        <div role="separator" class="ayy-action-bar__separator"></div>

        <!-- Common bulk actions as square icon buttons; always paired with a tooltip -->
        <span class="ayy-tooltip">
          <button type="button" aria-label="Share selected" class="ayy-action-bar__button ayy-action-bar__button--icon" onclick="ayywi.toast.success('Share link created')">
            <svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M9.39584 4.5H8.35417C5.40789 4.5 3.93475 4.5 3.01946 5.37868C2.10417 6.25736 2.10417 7.67157 2.10417 10.5V14.5C2.10417 17.3284 2.10417 18.7426 3.01946 19.6213C3.93475 20.5 5.40789 20.5 8.35417 20.5H12.5608C15.5071 20.5 16.9802 20.5 17.8955 19.6213C18.4885 19.052 18.6973 18.2579 18.7708 17" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/><path d="M16.1667 7V3.85355C16.1667 3.65829 16.3316 3.5 16.535 3.5C16.6326 3.5 16.7263 3.53725 16.7954 3.60355L21.5275 8.14645C21.7634 8.37282 21.8958 8.67986 21.8958 9C21.8958 9.32014 21.7634 9.62718 21.5275 9.85355L16.7954 14.3964C16.7263 14.4628 16.6326 14.5 16.535 14.5C16.3316 14.5 16.1667 14.3417 16.1667 14.1464V11H13.1157C8.875 11 7.3125 14.5 7.3125 14.5V12C7.3125 9.23858 9.64435 7 12.5208 7H16.1667Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/></svg>
          </button>
          <span role="tooltip" class="ayy-tooltip__content">Share selected</span>
        </span>
        <span class="ayy-tooltip">
          <button type="button" aria-label="Copy links" class="ayy-action-bar__button ayy-action-bar__button--icon" onclick="ayywi.toast.success('Copied links')">
            <svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M14.5563 13.2183C13.514 14.2606 11.8241 14.2606 10.7817 13.2183C9.73942 12.1759 9.73942 10.486 10.7817 9.44364L13.1409 7.0845C14.1357 6.08961 15.7206 6.04433 16.7692 6.94866M16.4437 3.78175C17.486 2.73942 19.1759 2.73942 20.2183 3.78175C21.2606 4.82408 21.2606 6.51403 20.2183 7.55636L17.8591 9.9155C16.8643 10.9104 15.2794 10.9557 14.2308 10.0513" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/><path d="M10.4999 3C7.21257 3 5.56889 3 4.46256 3.9079C4.25998 4.07414 4.07423 4.25989 3.90798 4.46247C3.00007 5.56879 3.00006 7.21247 3.00002 10.4998L3 12.9999C2.99996 16.7712 2.99995 18.6568 4.17152 19.8284C5.3431 21 7.22873 21 11 21H13.4999C16.7874 21 18.4311 21 19.5375 20.092C19.74 19.9258 19.9257 19.7401 20.092 19.5376C20.9999 18.4312 20.9999 16.7875 20.9999 13.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/></svg>
          </button>
          <span role="tooltip" class="ayy-tooltip__content">Copy links</span>
        </span>
        <span class="ayy-tooltip">
          <button type="button" aria-label="Duplicate selected" class="ayy-action-bar__button ayy-action-bar__button--icon" onclick="ayywi.toast.success('Duplicated 2 docs')">
            <svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7.5 14.5C7.5 11.2002 7.5 9.55025 8.52513 8.52513C9.55025 7.5 11.2002 7.5 14.5 7.5C17.7998 7.5 19.4497 7.5 20.4749 8.52513C21.5 9.55025 21.5 11.2002 21.5 14.5C21.5 17.7998 21.5 19.4497 20.4749 20.4749C19.4497 21.5 17.7998 21.5 14.5 21.5C11.2002 21.5 9.55025 21.5 8.52513 20.4749C7.5 19.4497 7.5 17.7998 7.5 14.5Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/><path d="M7.5 16.5C6.10355 16.5 5.40533 16.5 4.84402 16.3036C3.83866 15.9518 3.0482 15.1613 2.69641 14.156C2.5 13.5947 2.5 12.8964 2.5 11.5V9.5C2.5 6.20017 2.5 4.55025 3.52513 3.52513C4.55025 2.5 6.20017 2.5 9.5 2.5H11.5C12.8964 2.5 13.5947 2.5 14.156 2.69641C15.1613 3.0482 15.9518 3.83866 16.3036 4.84402C16.5 5.40533 16.5 6.10355 16.5 7.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/></svg>
          </button>
          <span role="tooltip" class="ayy-tooltip__content">Duplicate</span>
        </span>
        <span class="ayy-tooltip">
          <button type="button" aria-label="Download selected" class="ayy-action-bar__button ayy-action-bar__button--icon" onclick="ayywi.toast('Downloading 2 docs')">
            <svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M2.99969 17.0002C2.99969 17.9302 2.99969 18.3952 3.10192 18.7767C3.37932 19.8119 4.18796 20.6206 5.22324 20.898C5.60474 21.0002 6.06972 21.0002 6.99969 21.0002L16.9997 21.0002C17.9297 21.0002 18.3947 21.0002 18.7762 20.898C19.8114 20.6206 20.6201 19.8119 20.8975 18.7767C20.9997 18.3952 20.9997 17.9302 20.9997 17.0002" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/><path d="M16.4998 11.5002C16.4998 11.5002 13.1856 16.0002 11.9997 16.0002C10.8139 16.0002 7.49976 11.5002 7.49976 11.5002M11.9997 15.0002V3.00016" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/></svg>
          </button>
          <span role="tooltip" class="ayy-tooltip__content">Download</span>
        </span>
        <span class="ayy-tooltip">
          <button type="button" aria-label="Archive selected" class="ayy-action-bar__button ayy-action-bar__button--icon" onclick="ayywi.toast('Archived 2 docs')">
            <svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7 21H16.9999C19.3569 21 20.5354 21 21.2677 20.2678C21.9999 19.5355 21.9999 18.357 21.9999 16C21.9999 13.643 21.9999 12.4645 21.2677 11.7322C20.5354 11 19.3569 11 16.9999 11H7C4.64302 11 3.46453 11 2.7323 11.7322C2.00007 12.4644 2.00005 13.6429 2 15.9999C1.99995 18.357 1.99993 19.5355 2.73217 20.2677C3.4644 21 4.64294 21 7 21Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/><path d="M4 11C4.00005 9.59977 4.00008 8.89966 4.27263 8.36485C4.5123 7.89455 4.89469 7.51218 5.365 7.27253C5.89981 7 6.59993 7 8.00015 7H16C17.4001 7 18.1002 7 18.635 7.27248C19.1054 7.51217 19.4878 7.89462 19.7275 8.36502C20 8.8998 20 9.59987 20 11" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/><path d="M6 7C6.00004 5.5998 6.00006 4.89969 6.27259 4.3649C6.51227 3.89457 6.89467 3.51218 7.36501 3.27252C7.89981 3 8.59991 3 10.0001 3H14C15.4001 3 16.1002 3 16.635 3.27248C17.1054 3.51217 17.4878 3.89462 17.7275 4.36502C18 4.8998 18 5.59987 18 7" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/><path d="M16 15L15.7 15.4C15.1111 16.1851 14.8167 16.5777 14.3944 16.7889C13.9721 17 13.4814 17 12.5 17H11.5C10.5186 17 10.0279 17 9.60557 16.7889C9.18328 16.5777 8.88885 16.1851 8.3 15.4L8 15" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/></svg>
          </button>
          <span role="tooltip" class="ayy-tooltip__content">Archive</span>
        </span>
        <span class="ayy-tooltip">
          <button type="button" aria-label="Delete selected" class="ayy-action-bar__button ayy-action-bar__button--destructive ayy-action-bar__button--icon" onclick="ayywi.toast.error('Deleted 2 docs')">
            <svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M19.5 5.5L18.8803 15.5251C18.7219 18.0864 18.6428 19.3671 18.0008 20.2879C17.6833 20.7431 17.2747 21.1273 16.8007 21.416C15.8421 22 14.559 22 11.9927 22C9.42312 22 8.1383 22 7.17905 21.4149C6.7048 21.1257 6.296 20.7408 5.97868 20.2848C5.33688 19.3626 5.25945 18.0801 5.10461 15.5152L4.5 5.5" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"/><path d="M3 5.5H21M16.0557 5.5L15.3731 4.09173C14.9196 3.15626 14.6928 2.68852 14.3017 2.39681C14.215 2.3321 14.1231 2.27454 14.027 2.2247C13.5939 2 13.0741 2 12.0345 2C10.9688 2 10.436 2 9.99568 2.23412C9.8981 2.28601 9.80498 2.3459 9.71729 2.41317C9.32164 2.7167 9.10063 3.20155 8.65861 4.17126L8.05292 5.5" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"/><path d="M9.5 16.5L9.5 10.5" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"/><path d="M14.5 16.5L14.5 10.5" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"/></svg>
          </button>
          <span role="tooltip" class="ayy-tooltip__content">Delete</span>
        </span>
      </div>
    </div>
  </ayy-action-bar>
</div>
```

React:

```tsx
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
```

---
Part of @danitesler/ayywi 0.1.2: load `dist/ayywi.min.css` (and `dist/elements.global.js` for the <ayy-*> elements). The rules every screen follows: [llms-full.txt#rules](../llms-full.txt#rules). Every component: [llms.txt](../llms.txt).
