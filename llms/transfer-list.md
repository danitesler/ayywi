# Transfer list

Category: Forms. A dual-list shuttle for moving items between an available column and a selected column, such as role permissions, export columns or team members. Each column supports live filtering, select-all and keyboard navigation. Also called: transfer-list, dual-list, dual-listbox, list-shuttle, shuttle.

**Classes**
- `.ayy-transfer-list` — Root 3-column grid (source pane, transfer actions, target pane); stacks vertically below 48rem.
- `.ayy-transfer-list__pane` — One list column card (data-pane="source" or data-pane="target").
- `.ayy-transfer-list__header` — Pane top row holding the select-all checkbox, title and item count.
- `.ayy-transfer-list__title` — Clickable label wrapping the pane's select-all Checkbox and heading.
- `.ayy-transfer-list__count` — Tabular item count at the inline end ("2 / 6" when items are checked).
- `.ayy-transfer-list__search` — Optional filter row under the header with a magnifier icon and borderless input.
- `.ayy-transfer-list__filter` — Per-pane <input type="search"> filter.
- `.ayy-transfer-list__list` — Scrollable list body (14rem tall) of checkable item rows.
- `.ayy-transfer-list__item` — One <label> row holding an .ayy-checkbox and the item's text.
- `.ayy-transfer-list__item-body` — Text column inside an item row.
- `.ayy-transfer-list__label` — Primary item name.
- `.ayy-transfer-list__description` — Optional muted second line under the item name.
- `.ayy-transfer-list__empty` — Centred muted empty or no-matches message inside a pane.
- `.ayy-transfer-list__actions` — Middle column (row on phones) of transfer icon buttons.

**States**
- `default` — Two surface cards with hairline headers and 14rem scrollable lists, flanking outline icon-sm transfer buttons.
- `hover` (`.ayy-transfer-list__item:hover (hover devices)`) — Row gets --ayy-color-wash; transfer buttons get Button's outline hover.
- `pressed` — doesn't apply: Rows toggle their Checkbox on click; double-clicking a row transfers it right away.
- `focus` (`:focus-visible on a Checkbox, transfer Button or .ayy-transfer-list__filter`) — Checkboxes and buttons show their 2px --ayy-color-ring; the search row shows a 2px inset ring.
- `disabled` (`disabled on item Checkboxes, the filter input or transfer Buttons`) — --ayy-opacity-disabled, not-allowed cursor; transfer buttons disable automatically when nothing can move.
- `selected` (`:checked on an item's Checkbox (pending transfer), or presence in the target pane (assigned)`) — Checked rows get --ayy-color-wash-hover and a checked Checkbox; the header Checkbox shows indeterminate when some are checked. Forced colours: 1px Highlight outline.
- `error` (`aria-invalid="true" on .ayy-transfer-list (with a FieldError)`) — Both pane borders tint to 60% destructive. Forced colours: dashed border.
- `loading` — doesn't apply: Render Skeleton rows inside the panes while options load.

**Sizes**
- Density — Header height, search bar height, checkboxes and transfer buttons follow data-density; list viewport stays 14rem tall.
- Width — Fills its container across two equal columns; stacks into a single column with rotated arrows below 48rem.

**Custom element** `<ayy-transfer-list>` (@danitesler/ayywi/elements) — An .ayy-transfer-list containing source and target .ayy-transfer-list__pane elements and .ayy-transfer-list__actions.
- attribute `name`: Form field name: syncs one hidden input per item in the target pane.
- event `ayy-change`: { value: string[] } — fired whenever items move between panes.

**React** — `import { TransferList } from "@danitesler/ayywi/react";`
- `<TransferList>` renders <div role="group" class="ayy-transfer-list"> with source pane, action buttons and target pane. Props: `options` TransferListOption[] — id, label, description?, keywords?, disabled?; `value / defaultValue` string[] — IDs in the target (selected) pane.; `onValueChange` (value: string[]) => void; `sourceTitle` string — heading of the available pane (default "Available").; `targetTitle` string — heading of the selected pane (default "Selected").; `searchable` boolean — show a filter input in each pane (default false).; `searchPlaceholder` string — placeholder for filter inputs (default "Filter…").; `showMoveAll` boolean — include Move all / Remove all buttons (default true).; `sourceEmptyText` string — empty message for source pane.; `targetEmptyText` string — empty message for target pane.; `disabled` boolean; `invalid` boolean — sets aria-invalid="true".; `name` string — renders hidden inputs for selected IDs.; `...rest` All native <div> attributes.

**Accessibility**
- Every item is a real Checkbox inside a <label>, so screen readers announce its label, description and checked state natively.
- ArrowUp, ArrowDown, Home and End move focus between visible checkboxes in a pane; Space toggles.
- Transfer icon buttons carry descriptive aria-labels ("Move selected to Assigned") and Tooltips, and disable when no items can move.

**Do**
- Use a Transfer list when users need to see both what is available and what is assigned side by side (role permissions, report columns).
- Turn on searchable when either column can hold more than ~10 items.

**Don't**
- Don't use a Transfer list to pick one or two tags in a compact form — use Record picker or Checkbox.
- Don't use it for thousands of remote records — use a Data explorer table or async Record picker.

## Transfer list — Role permissions with search

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<!-- <ayy-transfer-list> moves checked items between Available and Assigned and keeps counts and empty states in sync. -->
<ayy-transfer-list>
  <div role="group" class="ayy-transfer-list" aria-label="Role permissions">
    <div class="ayy-transfer-list__pane" data-pane="source">
      <div class="ayy-transfer-list__header">
        <label class="ayy-transfer-list__title"><input type="checkbox" class="ayy-checkbox" /><span>Available</span></label>
        <span class="ayy-transfer-list__count">4</span>
      </div>
      <div class="ayy-transfer-list__search">
        <svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M17 17L21 21" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19C15.4183 19 19 15.4183 19 11Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg>
        <input type="search" class="ayy-transfer-list__filter" placeholder="Filter…" aria-label="Filter Available" />
      </div>
      <div class="ayy-transfer-list__list" role="group" aria-label="Available">
        <label class="ayy-transfer-list__item" data-value="billing:read"><input type="checkbox" class="ayy-checkbox" value="billing:read" /><span class="ayy-transfer-list__item-body"><span class="ayy-transfer-list__label">View billing</span><span class="ayy-transfer-list__description">Download invoices and inspect seat usage</span></span></label>
        <label class="ayy-transfer-list__item" data-value="billing:manage"><input type="checkbox" class="ayy-checkbox" value="billing:manage" /><span class="ayy-transfer-list__item-body"><span class="ayy-transfer-list__label">Manage billing</span><span class="ayy-transfer-list__description">Update payment methods and plan tiers</span></span></label>
        <label class="ayy-transfer-list__item" data-value="members:invite"><input type="checkbox" class="ayy-checkbox" value="members:invite" /><span class="ayy-transfer-list__item-body"><span class="ayy-transfer-list__label">Invite members</span><span class="ayy-transfer-list__description">Send workspace invitations and assign roles</span></span></label>
        <label class="ayy-transfer-list__item" data-value="audit:export"><input type="checkbox" class="ayy-checkbox" value="audit:export" /><span class="ayy-transfer-list__item-body"><span class="ayy-transfer-list__label">Export audit log</span><span class="ayy-transfer-list__description">Download security events as CSV or JSON</span></span></label>
        <div class="ayy-transfer-list__empty" data-empty-default="No items available" data-empty-filter="No matches" hidden>No items available</div>
      </div>
    </div>

    <div class="ayy-transfer-list__actions">
      <ayy-tooltip class="ayy-tooltip">
        <button type="button" class="ayy-button ayy-button--outline ayy-button--icon-sm" data-action="add" aria-label="Move selected to Assigned" aria-describedby="transfer-add-tip" disabled>
          <svg class="ayy-icon ayy-icon--directional" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M9.00005 6C9.00005 6 15 10.4189 15 12C15 13.5812 9 18 9 18" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg>
        </button>
        <span role="tooltip" id="transfer-add-tip" class="ayy-tooltip__content" data-side="top">Move selected</span>
      </ayy-tooltip>
      <ayy-tooltip class="ayy-tooltip">
        <button type="button" class="ayy-button ayy-button--outline ayy-button--icon-sm" data-action="add-all" aria-label="Move all to Assigned" aria-describedby="transfer-add-all-tip">
          <svg class="ayy-icon ayy-icon--directional" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12.5 18C12.5 18 18.5 13.5811 18.5 12C18.5 10.4188 12.5 6 12.5 6" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M5.50005 18C5.50005 18 11.5 13.5811 11.5 12C11.5 10.4188 5.5 6 5.5 6" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg>
        </button>
        <span role="tooltip" id="transfer-add-all-tip" class="ayy-tooltip__content" data-side="top">Move all</span>
      </ayy-tooltip>
      <ayy-tooltip class="ayy-tooltip">
        <button type="button" class="ayy-button ayy-button--outline ayy-button--icon-sm" data-action="remove" aria-label="Move selected to Available" aria-describedby="transfer-remove-tip" disabled>
          <svg class="ayy-icon ayy-icon--directional" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M15 6C15 6 9.00001 10.4189 9 12C8.99999 13.5812 15 18 15 18" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg>
        </button>
        <span role="tooltip" id="transfer-remove-tip" class="ayy-tooltip__content" data-side="top">Remove selected</span>
      </ayy-tooltip>
      <ayy-tooltip class="ayy-tooltip">
        <button type="button" class="ayy-button ayy-button--outline ayy-button--icon-sm" data-action="remove-all" aria-label="Move all to Available" aria-describedby="transfer-remove-all-tip">
          <svg class="ayy-icon ayy-icon--directional" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M11.5 18C11.5 18 5.50001 13.5811 5.5 12C5.49999 10.4188 11.5 6 11.5 6" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M18.5 18C18.5 18 12.5 13.5811 12.5 12C12.5 10.4188 18.5 6 18.5 6" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg>
        </button>
        <span role="tooltip" id="transfer-remove-all-tip" class="ayy-tooltip__content" data-side="top">Remove all</span>
      </ayy-tooltip>
    </div>

    <div class="ayy-transfer-list__pane" data-pane="target">
      <div class="ayy-transfer-list__header">
        <label class="ayy-transfer-list__title"><input type="checkbox" class="ayy-checkbox" /><span>Assigned</span></label>
        <span class="ayy-transfer-list__count">3</span>
      </div>
      <div class="ayy-transfer-list__search">
        <svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M17 17L21 21" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19C15.4183 19 19 15.4183 19 11Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg>
        <input type="search" class="ayy-transfer-list__filter" placeholder="Filter…" aria-label="Filter Assigned" />
      </div>
      <div class="ayy-transfer-list__list" role="group" aria-label="Assigned">
        <label class="ayy-transfer-list__item" data-value="projects:read"><input type="checkbox" class="ayy-checkbox" value="projects:read" /><span class="ayy-transfer-list__item-body"><span class="ayy-transfer-list__label">View projects</span><span class="ayy-transfer-list__description">Read project boards, roadmaps and status updates</span></span></label>
        <label class="ayy-transfer-list__item" data-value="projects:write"><input type="checkbox" class="ayy-checkbox" value="projects:write" /><span class="ayy-transfer-list__item-body"><span class="ayy-transfer-list__label">Edit projects</span><span class="ayy-transfer-list__description">Create, archive and rename workspace projects</span></span></label>
        <label class="ayy-transfer-list__item" data-value="deploys:trigger"><input type="checkbox" class="ayy-checkbox" value="deploys:trigger" /><span class="ayy-transfer-list__item-body"><span class="ayy-transfer-list__label">Trigger deployments</span><span class="ayy-transfer-list__description">Promote builds to preview and production</span></span></label>
        <div class="ayy-transfer-list__empty" data-empty-default="None selected" data-empty-filter="No matches" hidden>None selected</div>
      </div>
    </div>
  </div>
</ayy-transfer-list>
```

React:

```tsx
import { useState } from "react";
import { TransferList, type TransferListOption } from "@danitesler/ayywi/react";

const PERMISSIONS: TransferListOption[] = [
  { id: "projects:read", label: "View projects", description: "Read project boards, roadmaps and status updates" },
  { id: "projects:write", label: "Edit projects", description: "Create, archive and rename workspace projects" },
  { id: "deploys:trigger", label: "Trigger deployments", description: "Promote builds to preview and production" },
  { id: "billing:read", label: "View billing", description: "Download invoices and inspect seat usage" },
  { id: "billing:manage", label: "Manage billing", description: "Update payment methods and plan tiers" },
  { id: "members:invite", label: "Invite members", description: "Send workspace invitations and assign roles" },
  { id: "audit:export", label: "Export audit log", description: "Download security events as CSV or JSON" },
];

export default function Example() {
  const [assigned, setAssigned] = useState<string[]>(["projects:read", "projects:write", "deploys:trigger"]);

  return (
    <TransferList
      aria-label="Role permissions"
      options={PERMISSIONS}
      value={assigned}
      onValueChange={setAssigned}
      sourceTitle="Available"
      targetTitle="Assigned"
      searchable
    />
  );
}
```

---
Part of @danitesler/ayywi 0.1.2: load `dist/ayywi.min.css` (and `dist/elements.global.js` for the <ayy-*> elements). The rules every screen follows: [llms-full.txt#rules](../llms-full.txt#rules). Every component: [llms.txt](../llms.txt).
