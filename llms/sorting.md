# Sorting

Category: Forms. A dedicated dropdown trigger for ordering lists, tables, and feeds, styled to coordinate with filter bars and paired with dropdown menus. Also called: sorting, sort, sort-menu, sort-button, sort-dropdown, sort-select.

**Classes**
- `.ayy-sorting` — Root inline-flex container for a sorting control.
- `.ayy-sorting--sm` — Compact size variant for tight toolbars and mobile viewports.
- `.ayy-sorting__trigger` — Unified dropdown button trigger opening a sort menu (aria-haspopup="menu").
- `.ayy-sorting__trigger--sm` — Compact size trigger button.

**States**
- `default` — A bordered control with surface background and line border matching filter bar triggers.
- `hover` (`.ayy-sorting__trigger:hover`) — Border turns line-hover and background turns wash-hover.
- `pressed` — doesn't apply: No distinct pressed state; opens menu on release.
- `focus` (`:focus-visible on trigger`) — 2px ring, 2px offset.
- `disabled` (`:disabled on trigger`) — --ayy-opacity-disabled, not-allowed cursor.
- `selected` — doesn't apply: Selection is indicated within the opened DropdownMenu radio items.
- `error` — doesn't apply: Sorting does not fail visibly.
- `loading` — doesn't apply: Loading is shown in the results view with Skeleton.
- `open` (`.ayy-sorting__trigger[aria-expanded="true"]`) — Trigger gets ring border and wash-hover background. Forced colours: Highlight.

**Sizes**
- `sm` — Controls at the sm control height (28px compact, 32px comfortable, 40px touch), 13px text.
- `md` (default) — Controls at the md control height (32px compact, 40px comfortable, 44px touch), 14px text.
- Density — Control heights and padding follow data-density.
- Width — Inline-flex, hugs its content.

**React** — `import { Sorting, SortingTrigger } from "@danitesler/ayywi/react";`
- `<Sorting>` renders <div class="ayy-sorting">. Props: `size` "sm" | "md"
- `<SortingTrigger>` renders <button type="button" class="ayy-sorting__trigger">. Props: `size` "sm" | "md"; `open` boolean — aria-expanded for menu state

**Accessibility**
- SortingTrigger uses aria-haspopup="menu" and aria-expanded to announce menu state to assistive technology.
- Visible 2px focus ring on the trigger button (:focus-visible).
- Sort options inside the paired DropdownMenu use role="menuitemradio" and aria-checked for accessible single-choice state.

**Do**
- Use Sorting when users need to order a table, grid, search feed, or list by multiple properties.
- Pair SortingTrigger with DropdownMenu and DropdownMenuRadioGroup for accessible sort selection.
- Display the currently active sort order in the trigger label so users always know how items are sorted.

**Don't**
- Don't rely on icon direction alone without accessible text or aria-label.
- Don't hide the current sort order without an on-screen label on the trigger.

## Sorting — Unified dropdown sort menu

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<!-- <ayy-menu> (@danitesler/ayywi/elements) places the sort menu under its button; radio items select a sort order. -->
<div class="ayy-stack" style="inline-size:100%;gap:var(--ayy-space-4)"><div class="ayy-spread"><span class="ayy-muted" style="font-size:var(--ayy-text-sm)">Project documents</span><div class="ayy-sorting"><ayy-menu><button type="button" aria-haspopup="menu" aria-expanded="false" popovertarget="sorting-menu-html" class="ayy-sorting__trigger" aria-label="Sort by Recently updated"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M11 10L18 10" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M11 14H16" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M11 18H14" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M11 6H21" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M7 18.8125C6.60678 19.255 5.56018 21 5 21M3 18.8125C3.39322 19.255 4.43982 21 5 21M5 21L5 15" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M3 5.1875C3.39322 4.74501 4.43982 3 5 3M7 5.1875C6.60678 4.74501 5.56018 3 5 3M5 3L5 9" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg><span>Sort: Recently updated</span><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M18 9.00005C18 9.00005 13.5811 15 12 15C10.4188 15 6 9 6 9" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg></button><div id="sorting-menu-html" role="menu" class="ayy-menu" popover="auto" aria-label="Sort options"><button type="button" role="menuitemradio" tabindex="-1" class="ayy-menu__item" aria-checked="true">Recently updated</button><button type="button" role="menuitemradio" tabindex="-1" class="ayy-menu__item" aria-checked="false">Oldest first</button><button type="button" role="menuitemradio" tabindex="-1" class="ayy-menu__item" aria-checked="false">Most comments</button><button type="button" role="menuitemradio" tabindex="-1" class="ayy-menu__item" aria-checked="false">Alphabetical</button></div></ayy-menu></div></div><div class="ayy-stack" style="gap:var(--ayy-space-2)"><div class="ayy-card"><div class="ayy-card__content" style="padding:var(--ayy-space-3)"><div class="ayy-spread"><span style="font-weight:var(--ayy-weight-medium)">API Gateway migration</span><span class="ayy-muted" style="font-size:var(--ayy-text-xs)">Updated 5m ago • 14 comments</span></div></div></div><div class="ayy-card"><div class="ayy-card__content" style="padding:var(--ayy-space-3)"><div class="ayy-spread"><span style="font-weight:var(--ayy-weight-medium)">Checkout redesign proposal</span><span class="ayy-muted" style="font-size:var(--ayy-text-xs)">Updated 2h ago • 28 comments</span></div></div></div><div class="ayy-card"><div class="ayy-card__content" style="padding:var(--ayy-space-3)"><div class="ayy-spread"><span style="font-weight:var(--ayy-weight-medium)">Design tokens sync script</span><span class="ayy-muted" style="font-size:var(--ayy-text-xs)">Updated Yesterday • 6 comments</span></div></div></div><div class="ayy-card"><div class="ayy-card__content" style="padding:var(--ayy-space-3)"><div class="ayy-spread"><span style="font-weight:var(--ayy-weight-medium)">Auth token refresh bugfix</span><span class="ayy-muted" style="font-size:var(--ayy-text-xs)">Updated 3d ago • 3 comments</span></div></div></div></div></div>
```

React:

```tsx
import { ArrowDown01Icon, Sorting05Icon } from "@hugeicons/core-free-icons";
import { useState } from "react";
import {
  Card,
  CardContent,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
  Icon,
  Sorting,
  SortingTrigger,
} from "@danitesler/ayywi/react";

interface RecordItem {
  id: string;
  title: string;
  updated: string;
  timestamp: number;
  comments: number;
}

const RECORDS: RecordItem[] = [
  { id: "1", title: "API Gateway migration", updated: "5m ago", timestamp: 5, comments: 14 },
  { id: "2", title: "Checkout redesign proposal", updated: "2h ago", timestamp: 120, comments: 28 },
  { id: "3", title: "Design tokens sync script", updated: "Yesterday", timestamp: 1440, comments: 6 },
  { id: "4", title: "Auth token refresh bugfix", updated: "3d ago", timestamp: 4320, comments: 3 },
];

const OPTIONS = [
  { value: "recent", label: "Recently updated" },
  { value: "oldest", label: "Oldest first" },
  { value: "comments", label: "Most comments" },
  { value: "alpha", label: "Alphabetical" },
];

export default function Example() {
  const [sortKey, setSortKey] = useState("recent");

  const sorted = [...RECORDS].sort((a, b) => {
    if (sortKey === "recent") return a.timestamp - b.timestamp;
    if (sortKey === "oldest") return b.timestamp - a.timestamp;
    if (sortKey === "comments") return b.comments - a.comments;
    return a.title.localeCompare(b.title);
  });

  const currentLabel = OPTIONS.find((o) => o.value === sortKey)?.label ?? "Recently updated";

  return (
    <div className="ayy-stack" style={{ inlineSize: "100%", gap: "var(--ayy-space-4)" }}>
      <div className="ayy-spread">
        <span className="ayy-muted" style={{ fontSize: "var(--ayy-text-sm)" }}>Project documents</span>
        <Sorting>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SortingTrigger aria-label={`Sort by ${currentLabel}`}>
                <Icon icon={Sorting05Icon} />
                <span>{`Sort: ${currentLabel}`}</span>
                <Icon icon={ArrowDown01Icon} />
              </SortingTrigger>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" aria-label="Sort options">
              <DropdownMenuRadioGroup value={sortKey} onValueChange={setSortKey} closeOnSelect>
                {OPTIONS.map((opt) => (
                  <DropdownMenuRadioItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </Sorting>
      </div>

      <div className="ayy-stack" style={{ gap: "var(--ayy-space-2)" }}>
        {sorted.map((item) => (
          <Card key={item.id}>
            <CardContent style={{ padding: "var(--ayy-space-3)" }}>
              <div className="ayy-spread">
                <span style={{ fontWeight: "var(--ayy-weight-medium)" }}>{item.title}</span>
                <span className="ayy-muted" style={{ fontSize: "var(--ayy-text-xs)" }}>
                  {`Updated ${item.updated} • ${item.comments} comments`}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
```

---
Part of @danitesler/ayywi 0.1.0: load `dist/ayywi.min.css` (and `dist/elements.global.js` for the <ayy-*> elements). The rules every screen follows: [llms-full.txt#rules](../llms-full.txt#rules). Every component: [llms.txt](../llms.txt).
