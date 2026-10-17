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

**States**
- `default` — Hidden until [open] is set; when open, a blurred glass pill with a line-strong border, overlay shadow, semibold count, clear button and standard action buttons.
- `hover` (`.ayy-action-bar__button:hover:not(:disabled), .ayy-action-bar__close:hover (devices that hover)`) — Buttons lift by 1px with a wash fill; primary dims; destructive gets a 18% tint and border; close button turns text colour.
- `pressed` (`.ayy-action-bar__button:active:not(:disabled)`) — Lifting transform resets on click.
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
- `<ActionBarButton>` renders <button type="button" class="ayy-action-bar__button">. Props: `variant` "default" | "primary" | "secondary" | "destructive"; `primary` boolean — shorthand for variant="primary"; `secondary` boolean — shorthand for variant="secondary"; `destructive` boolean — shorthand for variant="destructive"; `open` boolean — aria-expanded when used as a DropdownMenuTrigger

**Accessibility**
- role="toolbar" with an aria-label ("Bulk actions"): one Tab stop, Left/Right arrow keys (mirrored in RTL) and Home/End move between the clear button and actions.
- Pressing Escape or clicking ActionBarClose clears the selection and dismisses the bar.
- Icon-only overflow buttons inside the bar need an aria-label ("More actions").
- High Contrast mode borders the bar in CanvasText and highlights primary or open buttons with Highlight.

**Do**
- Use an Action bar with a selectable Table or Grid so bulk actions (Edit, Duplicate, Copy, Archive, Delete) appear at the bottom as soon as one or more items are selected.
- Show the selected count first, followed by the clear button, a separator, the frequent actions, and a destructive Delete action last.
- Fold less common bulk actions into a DropdownMenu triggered from a trailing ActionBarButton.

**Don't**
- Don't leave an Action bar visible with 0 selected items — hide it by omitting open (open={selected.length > 0}) instead of disabling every button.
- Don't use an Action bar for permanent page actions or navigation — use PageHeader actions, Toolbar or BottomNav.
- Don't cram more than five labelled actions into the bar; move extras into a ⋯ DropdownMenu.

## Action bar — Multi-select bulk actions

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<!-- <ayy-action-bar> manages roving tabindex across action buttons, clears selection on Esc or close click, and syncs with sibling <ayy-table> or <ayy-grid>. -->
<ayy-action-bar>
  <div class="ayy-stack" style="inline-size:100%"><div class="ayy-table-wrap"><table class="ayy-table"><caption class="ayy-sr-only">Scheduled social posts</caption><thead><tr><th scope="col" class="ayy-table__select"><input type="checkbox" class="ayy-checkbox" aria-label="Select all posts"/></th><th scope="col">Post</th><th scope="col">Channel</th><th scope="col">Status</th></tr></thead><tbody><tr aria-selected="true"><td class="ayy-table__select"><input type="checkbox" class="ayy-checkbox" aria-label="Select Q4 product launch thread" checked=""/></td><td>Q4 product launch thread</td><td class="ayy-muted">LinkedIn</td><td><span class="ayy-badge ayy-badge--info">Scheduled</span></td></tr><tr aria-selected="true"><td class="ayy-table__select"><input type="checkbox" class="ayy-checkbox" aria-label="Select Design tokens deep-dive reel" checked=""/></td><td>Design tokens deep-dive reel</td><td class="ayy-muted">Instagram</td><td><span class="ayy-badge ayy-badge--muted">Draft</span></td></tr><tr aria-selected="false"><td class="ayy-table__select"><input type="checkbox" class="ayy-checkbox" aria-label="Select Customer story: Northwind"/></td><td>Customer story: Northwind</td><td class="ayy-muted">X</td><td><span class="ayy-badge ayy-badge--success">Published</span></td></tr></tbody></table></div><div role="toolbar" aria-label="Bulk actions" open="" class="ayy-action-bar"><div class="ayy-action-bar__selection"><span class="ayy-action-bar__count">2 selected</span><button type="button" aria-label="Clear selection" class="ayy-action-bar__close"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M18 6L6.00081 17.9992M17.9992 18L6 6.00085" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg></button></div><div role="separator" class="ayy-action-bar__separator"></div><div role="group" class="ayy-action-bar__actions"><button type="button" class="ayy-action-bar__button"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M16.4249 4.60509L17.4149 3.6151C18.2351 2.79497 19.5648 2.79497 20.3849 3.6151C21.205 4.43524 21.205 5.76493 20.3849 6.58507L19.3949 7.57506M16.4249 4.60509L9.76558 11.2644C9.25807 11.772 8.89804 12.4078 8.72397 13.1041L8 16L10.8959 15.276C11.5922 15.102 12.228 14.7419 12.7356 14.2344L19.3949 7.57506M16.4249 4.60509L19.3949 7.57506" stroke="currentColor" stroke-linejoin="round" stroke-width="1.5"></path><path d="M18.9999 13.5C18.9999 16.7875 18.9999 18.4312 18.092 19.5376C17.9258 19.7401 17.7401 19.9258 17.5375 20.092C16.4312 21 14.7874 21 11.4999 21H11C7.22876 21 5.34316 21 4.17159 19.8284C3.00003 18.6569 3 16.7712 3 13V12.5C3 9.21252 3 7.56879 3.90794 6.46244C4.07417 6.2599 4.2599 6.07417 4.46244 5.90794C5.56879 5 7.21252 5 10.5 5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg>Edit</button><button type="button" class="ayy-action-bar__button"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7.5 14.5C7.5 11.2002 7.5 9.55025 8.52513 8.52513C9.55025 7.5 11.2002 7.5 14.5 7.5C17.7998 7.5 19.4497 7.5 20.4749 8.52513C21.5 9.55025 21.5 11.2002 21.5 14.5C21.5 17.7998 21.5 19.4497 20.4749 20.4749C19.4497 21.5 17.7998 21.5 14.5 21.5C11.2002 21.5 9.55025 21.5 8.52513 20.4749C7.5 19.4497 7.5 17.7998 7.5 14.5Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M7.5 16.5C6.10355 16.5 5.40533 16.5 4.84402 16.3036C3.83866 15.9518 3.0482 15.1613 2.69641 14.156C2.5 13.5947 2.5 12.8964 2.5 11.5V9.5C2.5 6.20017 2.5 4.55025 3.52513 3.52513C4.55025 2.5 6.20017 2.5 9.5 2.5H11.5C12.8964 2.5 13.5947 2.5 14.156 2.69641C15.1613 3.0482 15.9518 3.83866 16.3036 4.84402C16.5 5.40533 16.5 6.10355 16.5 7.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg>Duplicate</button><button type="button" class="ayy-action-bar__button"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M14.5563 13.2183C13.514 14.2606 11.8241 14.2606 10.7817 13.2183C9.73942 12.1759 9.73942 10.486 10.7817 9.44364L13.1409 7.0845C14.1357 6.08961 15.7206 6.04433 16.7692 6.94866M16.4437 3.78175C17.486 2.73942 19.1759 2.73942 20.2183 3.78175C21.2606 4.82408 21.2606 6.51403 20.2183 7.55636L17.8591 9.9155C16.8643 10.9104 15.2794 10.9557 14.2308 10.0513" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M10.4999 3C7.21257 3 5.56889 3 4.46256 3.9079C4.25998 4.07414 4.07423 4.25989 3.90798 4.46247C3.00007 5.56879 3.00006 7.21247 3.00002 10.4998L3 12.9999C2.99996 16.7712 2.99995 18.6568 4.17152 19.8284C5.3431 21 7.22873 21 11 21H13.4999C16.7874 21 18.4311 21 19.5375 20.092C19.74 19.9258 19.9257 19.7401 20.092 19.5376C20.9999 18.4312 20.9999 16.7875 20.9999 13.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg>Copy</button><button type="button" class="ayy-action-bar__button"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7 21H16.9999C19.3569 21 20.5354 21 21.2677 20.2678C21.9999 19.5355 21.9999 18.357 21.9999 16C21.9999 13.643 21.9999 12.4645 21.2677 11.7322C20.5354 11 19.3569 11 16.9999 11H7C4.64302 11 3.46453 11 2.7323 11.7322C2.00007 12.4644 2.00005 13.6429 2 15.9999C1.99995 18.357 1.99993 19.5355 2.73217 20.2677C3.4644 21 4.64294 21 7 21Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M4 11C4.00005 9.59977 4.00008 8.89966 4.27263 8.36485C4.5123 7.89455 4.89469 7.51218 5.365 7.27253C5.89981 7 6.59993 7 8.00015 7H16C17.4001 7 18.1002 7 18.635 7.27248C19.1054 7.51217 19.4878 7.89462 19.7275 8.36502C20 8.8998 20 9.59987 20 11" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M6 7C6.00004 5.5998 6.00006 4.89969 6.27259 4.3649C6.51227 3.89457 6.89467 3.51218 7.36501 3.27252C7.89981 3 8.59991 3 10.0001 3H14C15.4001 3 16.1002 3 16.635 3.27248C17.1054 3.51217 17.4878 3.89462 17.7275 4.36502C18 4.8998 18 5.59987 18 7" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M16 15L15.7 15.4C15.1111 16.1851 14.8167 16.5777 14.3944 16.7889C13.9721 17 13.4814 17 12.5 17H11.5C10.5186 17 10.0279 17 9.60557 16.7889C9.18328 16.5777 8.88885 16.1851 8.3 15.4L8 15" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg>Archive</button><div role="separator" class="ayy-action-bar__separator"></div><button type="button" class="ayy-action-bar__button ayy-action-bar__button--destructive"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M19.5 5.5L18.8803 15.5251C18.7219 18.0864 18.6428 19.3671 18.0008 20.2879C17.6833 20.7431 17.2747 21.1273 16.8007 21.416C15.8421 22 14.559 22 11.9927 22C9.42312 22 8.1383 22 7.17905 21.4149C6.7048 21.1257 6.296 20.7408 5.97868 20.2848C5.33688 19.3626 5.25945 18.0801 5.10461 15.5152L4.5 5.5" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path><path d="M3 5.5H21M16.0557 5.5L15.3731 4.09173C14.9196 3.15626 14.6928 2.68852 14.3017 2.39681C14.215 2.3321 14.1231 2.27454 14.027 2.2247C13.5939 2 13.0741 2 12.0345 2C10.9688 2 10.436 2 9.99568 2.23412C9.8981 2.28601 9.80498 2.3459 9.71729 2.41317C9.32164 2.7167 9.10063 3.20155 8.65861 4.17126L8.05292 5.5" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path><path d="M9.5 16.5L9.5 10.5" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path><path d="M14.5 16.5L14.5 10.5" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path></svg>Delete</button></div></div></div>
</ayy-action-bar>
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
```

---
Part of @danitesler/ayywi 0.0.3: load `dist/ayywi.min.css` (and `dist/elements.global.js` for the <ayy-*> elements). The rules every screen follows: [llms-full.txt#rules](../llms-full.txt#rules). Every component: [llms.txt](../llms.txt).
