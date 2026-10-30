# Drag and drop

Category: Layout. Standard drag and drop for reordering items and moving them between areas: a floating preview follows the pointer, drop targets show hover states (ready, over, reject), and a primary line indicates the exact drop position. Fully accessible with arrow keys. Also called: drag-and-drop, dnd, sortable, drag-drop, reorder, draggable, drop-target.

**Classes**
- `.ayy-draggable` — An item that can be picked up: grab cursor, dims to 0.4 opacity while dragging ([data-dragging]).
- `.ayy-drag-handle` — The six-dot grip button: control-sized square, touch-action: none, grab cursor, takes arrow keys.
- `.ayy-sortable` — Flex column container for sortable items with standard gap.
- `.ayy-sortable--horizontal` — Horizontal flex layout for sortable strips, toolbars or tabs.
- `.ayy-sortable__item` — Row in a sortable list: surface background, line border, dashed when dragged.
- `.ayy-drop-target` — An area items can be dropped into: reacts with [data-drop="ready|over|reject"].
- `.ayy-drag-preview` — Floating clone or element following the pointer in the top layer.
- `.ayy-drag-preview--chip` — Compact pill-shaped preview showing the dragged item's name.

**States**
- `default` — Hidden preview; items and drop targets sit at rest.
- `hover` (`.ayy-drag-handle:hover`) — Grip handle takes wash-hover and text colour.
- `pressed` (`.ayy-drag-handle:active`) — Grip handle switches to cursor: grabbing.
- `focus` (`.ayy-drag-handle:focus-visible`) — 2px ring outline on the handle; takes arrow keys.
- `disabled` (`.ayy-drag-handle:disabled, .ayy-draggable[aria-disabled="true"]`) — --ayy-opacity-disabled and cursor: not-allowed.
- `selected` — doesn't apply: No selected state.
- `error` (`[data-drop="reject"], .ayy-drag-preview[data-invalid]`) — Rejected target gets dashed destructive border and not-allowed cursor; preview gets dashed destructive outline.
- `loading` — doesn't apply: No loading state.
- `dragging` (`[data-dragging]`) — Item is held: dims to 0.4 opacity with dashed line border.
- `ready` (`[data-drop="ready"]`) — Target accepts the item: dashed text-soft border and wash fill.
- `over` (`[data-drop="over"]`) — Pointer is over target: solid primary border, 8% primary tint and 3px glow ring.
- `edge` (`[data-drop-edge]`) — A 2px primary insertion line on the target edge (block-start/end, inline-start/end) showing where the item lands.

**Sizes**
- Density — DragHandle sizes follow control size tokens (--ayy-size-control-sm); list items follow text and padding tokens.
- Width — Fills its container. Horizontally oriented lists flow inline.

**Custom element** `<ayy-drag-drop>` (@danitesler/ayywi/elements) — Sortable items (.ayy-draggable, .ayy-sortable__item) and drop targets (.ayy-drop-target).
- attribute `orientation`: vertical (default) | horizontal
- attribute `handle`: Present to drag by .ayy-drag-handle only
- attribute `areas`: CSS selector for drop areas, e.g. .ayy-drop-target
- event `ayy-move`: Fired on drop or arrow key move ({ item, from, to, fromIndex, toIndex, itemId, fromId, toId })

**React** — `import { Sortable, SortableItem, DragHandle, DragDropArea, DropTarget } from "@danitesler/ayywi/react";`
- `<Sortable>` renders <ul class="ayy-sortable">. Props: `orientation` "vertical" | "horizontal"; `handle` boolean (default true); `onMove` (move: DragMove) => void; `canDrag` (item: HTMLElement) => boolean; `describe` (item: HTMLElement) => string; `as` "ul" | "ol" | "div"
- `<SortableItem>` renders <li class="ayy-draggable ayy-sortable__item">. Props: `as` "li" | "div"
- `<DragHandle>` renders <button class="ayy-drag-handle"><Icon icon={DragDropVerticalIcon}/>. Props: `tooltip` ReactNode | false (default "Drag to reorder"); `...ButtonHTMLAttributes` aria-label...
- `<DragDropArea>` renders <div>. Props: `orientation` "vertical" | "horizontal"; `handle` boolean (default true); `onMove` (move: DragMove) => void; `accepts` (item, area) => boolean; `canDrag` (item: HTMLElement) => boolean; `describe` (item: HTMLElement) => string
- `<DropTarget>` renders <ul class="ayy-drop-target">. Props: `as` "ul" | "ol" | "div"; `list` boolean (default true)

**Accessibility**
- Keyboard support: focused .ayy-drag-handle takes arrow keys (along the list to reorder, across to hop between areas); plain items take Alt + arrows.
- Screen readers: announce polite status updates on each move ("Item moved to position 2 of 4").
- DragHandle button requires an aria-label naming the specific item ('Move Revenue', 'Move Priority'); its tooltip remains general ('Drag to reorder').

**Do**
- Use drag and drop for user-driven reordering of lists, board columns, or table columns.
- Always provide a DragHandle or keyboard alternative with visible focus ring.
- Show clear drop indicators (ready, over, reject, and drop-edge line) so the user always knows what will happen on release.
- Keep DragHandle tooltips general ('Drag to reorder'), naming the item in aria-label.

**Don't**
- Don't rely on mouse drag as the only way to reorder — always support keyboard navigation or move actions.
- Don't hide the original item completely while dragging — keep it dimmed at 0.4 opacity to maintain spatial context.
- Don't make drop targets ambiguous: use data-drop='reject' when an area refuses an item.

## Drag and drop — Reorderable list

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<div style="inline-size:100%;max-inline-size:28rem"><ayy-drag-drop handle=""><ul class="ayy-sortable" aria-label="Task priority queue"><li class="ayy-draggable ayy-sortable__item" data-id="item-1"><button type="button" class="ayy-drag-handle" aria-label="Move User authentication &amp; OAuth"><svg class="ayy-icon" data-ayy-icon="grip-vertical" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M16 6C16 6.55228 15.5523 7 15 7C14.4477 7 14 6.55228 14 6C14 5.44772 14.4477 5 15 5C15.5523 5 16 5.44772 16 6Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M10 6C10 6.55228 9.55228 7 9 7C8.44772 7 8 6.55228 8 6C8 5.44772 8.44772 5 9 5C9.55228 5 10 5.44772 10 6Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M16 18C16 18.5523 15.5523 19 15 19C14.4477 19 14 18.5523 14 18C14 17.4477 14.4477 17 15 17C15.5523 17 16 17.4477 16 18Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M16 12C16 12.5523 15.5523 13 15 13C14.4477 13 14 12.5523 14 12C14 11.4477 14.4477 11 15 11C15.5523 11 16 11.4477 16 12Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M10 18C10 18.5523 9.55228 19 9 19C8.44772 19 8 18.5523 8 18C8 17.4477 8.44772 17 9 17C9.55228 17 10 17.4477 10 18Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M10 12C10 12.5523 9.55228 13 9 13C8.44772 13 8 12.5523 8 12C8 11.4477 8.44772 11 9 11C9.55228 11 10 11.4477 10 12Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg></button><div style="flex:1;min-inline-size:0"><div style="font-weight:var(--ayy-weight-medium)">User authentication &amp; OAuth</div><span class="ayy-muted ayy-small">Security</span></div><span class="ayy-badge ayy-badge--destructive">High</span></li><li class="ayy-draggable ayy-sortable__item" data-id="item-2"><button type="button" class="ayy-drag-handle" aria-label="Move Table column reordering"><svg class="ayy-icon" data-ayy-icon="grip-vertical" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M16 6C16 6.55228 15.5523 7 15 7C14.4477 7 14 6.55228 14 6C14 5.44772 14.4477 5 15 5C15.5523 5 16 5.44772 16 6Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M10 6C10 6.55228 9.55228 7 9 7C8.44772 7 8 6.55228 8 6C8 5.44772 8.44772 5 9 5C9.55228 5 10 5.44772 10 6Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M16 18C16 18.5523 15.5523 19 15 19C14.4477 19 14 18.5523 14 18C14 17.4477 14.4477 17 15 17C15.5523 17 16 17.4477 16 18Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M16 12C16 12.5523 15.5523 13 15 13C14.4477 13 14 12.5523 14 12C14 11.4477 14.4477 11 15 11C15.5523 11 16 11.4477 16 12Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M10 18C10 18.5523 9.55228 19 9 19C8.44772 19 8 18.5523 8 18C8 17.4477 8.44772 17 9 17C9.55228 17 10 17.4477 10 18Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M10 12C10 12.5523 9.55228 13 9 13C8.44772 13 8 12.5523 8 12C8 11.4477 8.44772 11 9 11C9.55228 11 10 11.4477 10 12Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg></button><div style="flex:1;min-inline-size:0"><div style="font-weight:var(--ayy-weight-medium)">Table column reordering</div><span class="ayy-muted ayy-small">Data display</span></div><span class="ayy-badge ayy-badge--destructive">High</span></li><li class="ayy-draggable ayy-sortable__item" data-id="item-3"><button type="button" class="ayy-drag-handle" aria-label="Move Export to CSV &amp; PDF"><svg class="ayy-icon" data-ayy-icon="grip-vertical" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M16 6C16 6.55228 15.5523 7 15 7C14.4477 7 14 6.55228 14 6C14 5.44772 14.4477 5 15 5C15.5523 5 16 5.44772 16 6Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M10 6C10 6.55228 9.55228 7 9 7C8.44772 7 8 6.55228 8 6C8 5.44772 8.44772 5 9 5C9.55228 5 10 5.44772 10 6Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M16 18C16 18.5523 15.5523 19 15 19C14.4477 19 14 18.5523 14 18C14 17.4477 14.4477 17 15 17C15.5523 17 16 17.4477 16 18Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M16 12C16 12.5523 15.5523 13 15 13C14.4477 13 14 12.5523 14 12C14 11.4477 14.4477 11 15 11C15.5523 11 16 11.4477 16 12Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M10 18C10 18.5523 9.55228 19 9 19C8.44772 19 8 18.5523 8 18C8 17.4477 8.44772 17 9 17C9.55228 17 10 17.4477 10 18Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M10 12C10 12.5523 9.55228 13 9 13C8.44772 13 8 12.5523 8 12C8 11.4477 8.44772 11 9 11C9.55228 11 10 11.4477 10 12Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg></button><div style="flex:1;min-inline-size:0"><div style="font-weight:var(--ayy-weight-medium)">Export to CSV &amp; PDF</div><span class="ayy-muted ayy-small">Reports</span></div><span class="ayy-badge ayy-badge--warning">Medium</span></li><li class="ayy-draggable ayy-sortable__item" data-id="item-4"><button type="button" class="ayy-drag-handle" aria-label="Move Custom color themes"><svg class="ayy-icon" data-ayy-icon="grip-vertical" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M16 6C16 6.55228 15.5523 7 15 7C14.4477 7 14 6.55228 14 6C14 5.44772 14.4477 5 15 5C15.5523 5 16 5.44772 16 6Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M10 6C10 6.55228 9.55228 7 9 7C8.44772 7 8 6.55228 8 6C8 5.44772 8.44772 5 9 5C9.55228 5 10 5.44772 10 6Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M16 18C16 18.5523 15.5523 19 15 19C14.4477 19 14 18.5523 14 18C14 17.4477 14.4477 17 15 17C15.5523 17 16 17.4477 16 18Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M16 12C16 12.5523 15.5523 13 15 13C14.4477 13 14 12.5523 14 12C14 11.4477 14.4477 11 15 11C15.5523 11 16 11.4477 16 12Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M10 18C10 18.5523 9.55228 19 9 19C8.44772 19 8 18.5523 8 18C8 17.4477 8.44772 17 9 17C9.55228 17 10 17.4477 10 18Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M10 12C10 12.5523 9.55228 13 9 13C8.44772 13 8 12.5523 8 12C8 11.4477 8.44772 11 9 11C9.55228 11 10 11.4477 10 12Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg></button><div style="flex:1;min-inline-size:0"><div style="font-weight:var(--ayy-weight-medium)">Custom color themes</div><span class="ayy-muted ayy-small">Settings</span></div><span class="ayy-badge ayy-badge--muted">Low</span></li></ul></ayy-drag-drop></div>
```

React:

```tsx
import { useState } from "react";
import { Badge, DragHandle, Sortable, SortableItem, type DragMove } from "@danitesler/ayywi/react";

interface Item {
  id: string;
  name: string;
  category: string;
  priority: "High" | "Medium" | "Low";
}

const INITIAL_ITEMS: Item[] = [
  { id: "item-1", name: "User authentication & OAuth", category: "Security", priority: "High" },
  { id: "item-2", name: "Table column reordering", category: "Data display", priority: "High" },
  { id: "item-3", name: "Export to CSV & PDF", category: "Reports", priority: "Medium" },
  { id: "item-4", name: "Custom color themes", category: "Settings", priority: "Low" },
];

const BADGE_VARIANT = {
  High: "destructive",
  Medium: "warning",
  Low: "muted",
} as const;

export default function Example() {
  const [items, setItems] = useState<Item[]>(INITIAL_ITEMS);

  const handleMove = ({ fromIndex, toIndex }: DragMove) => {
    setItems((list) => {
      const next = [...list];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return next;
    });
  };

  return (
    <div style={{ inlineSize: "100%", maxInlineSize: "28rem" }}>
      <Sortable onMove={handleMove} aria-label="Task priority queue">
        {items.map((item) => (
          <SortableItem key={item.id} data-id={item.id}>
            <DragHandle aria-label={`Move ${item.name}`} />
            <div style={{ flex: 1, minInlineSize: 0 }}>
              <div style={{ fontWeight: "var(--ayy-weight-medium)" }}>{item.name}</div>
              <span className="ayy-muted ayy-small">{item.category}</span>
            </div>
            <Badge variant={BADGE_VARIANT[item.priority]}>{item.priority}</Badge>
          </SortableItem>
        ))}
      </Sortable>
    </div>
  );
}
```

## Drag and drop — Board with drop targets

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<ayy-drag-drop handle="" areas=".ayy-drop-target" style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:var(--ayy-space-4);inline-size:100%"><div style="display:flex;flex-direction:column;gap:var(--ayy-space-2)"><div class="ayy-spread"><span style="font-weight:var(--ayy-weight-semibold);font-size:var(--ayy-text-sm)">Backlog</span><span class="ayy-muted ayy-small">2</span></div><ul class="ayy-drop-target ayy-sortable" data-id="backlog" style="min-block-size:12rem"><li class="ayy-draggable ayy-sortable__item" data-id="c-1" data-type="feature"><button type="button" class="ayy-drag-handle" aria-label="Move Add keyboard shortcut recorder"><svg class="ayy-icon" data-ayy-icon="grip-vertical" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M16 6C16 6.55228 15.5523 7 15 7C14.4477 7 14 6.55228 14 6C14 5.44772 14.4477 5 15 5C15.5523 5 16 5.44772 16 6Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M10 6C10 6.55228 9.55228 7 9 7C8.44772 7 8 6.55228 8 6C8 5.44772 8.44772 5 9 5C9.55228 5 10 5.44772 10 6Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M16 18C16 18.5523 15.5523 19 15 19C14.4477 19 14 18.5523 14 18C14 17.4477 14.4477 17 15 17C15.5523 17 16 17.4477 16 18Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M16 12C16 12.5523 15.5523 13 15 13C14.4477 13 14 12.5523 14 12C14 11.4477 14.4477 11 15 11C15.5523 11 16 11.4477 16 12Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M10 18C10 18.5523 9.55228 19 9 19C8.44772 19 8 18.5523 8 18C8 17.4477 8.44772 17 9 17C9.55228 17 10 17.4477 10 18Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M10 12C10 12.5523 9.55228 13 9 13C8.44772 13 8 12.5523 8 12C8 11.4477 8.44772 11 9 11C9.55228 11 10 11.4477 10 12Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg></button><div style="flex:1;min-inline-size:0;font-size:var(--ayy-text-xs)">Add keyboard shortcut recorder</div><span class="ayy-badge ayy-badge--info">feature</span></li><li class="ayy-draggable ayy-sortable__item" data-id="c-2" data-type="bug"><button type="button" class="ayy-drag-handle" aria-label="Move Fix tooltip flicker on hover"><svg class="ayy-icon" data-ayy-icon="grip-vertical" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M16 6C16 6.55228 15.5523 7 15 7C14.4477 7 14 6.55228 14 6C14 5.44772 14.4477 5 15 5C15.5523 5 16 5.44772 16 6Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M10 6C10 6.55228 9.55228 7 9 7C8.44772 7 8 6.55228 8 6C8 5.44772 8.44772 5 9 5C9.55228 5 10 5.44772 10 6Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M16 18C16 18.5523 15.5523 19 15 19C14.4477 19 14 18.5523 14 18C14 17.4477 14.4477 17 15 17C15.5523 17 16 17.4477 16 18Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M16 12C16 12.5523 15.5523 13 15 13C14.4477 13 14 12.5523 14 12C14 11.4477 14.4477 11 15 11C15.5523 11 16 11.4477 16 12Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M10 18C10 18.5523 9.55228 19 9 19C8.44772 19 8 18.5523 8 18C8 17.4477 8.44772 17 9 17C9.55228 17 10 17.4477 10 18Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M10 12C10 12.5523 9.55228 13 9 13C8.44772 13 8 12.5523 8 12C8 11.4477 8.44772 11 9 11C9.55228 11 10 11.4477 10 12Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg></button><div style="flex:1;min-inline-size:0;font-size:var(--ayy-text-xs)">Fix tooltip flicker on hover</div><span class="ayy-badge ayy-badge--destructive">bug</span></li></ul></div><div style="display:flex;flex-direction:column;gap:var(--ayy-space-2)"><div class="ayy-spread"><span style="font-weight:var(--ayy-weight-semibold);font-size:var(--ayy-text-sm)">In Progress</span><span class="ayy-muted ayy-small">1</span></div><ul class="ayy-drop-target ayy-sortable" data-id="in-progress" style="min-block-size:12rem"><li class="ayy-draggable ayy-sortable__item" data-id="c-3" data-type="feature"><button type="button" class="ayy-drag-handle" aria-label="Move Table column reordering"><svg class="ayy-icon" data-ayy-icon="grip-vertical" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M16 6C16 6.55228 15.5523 7 15 7C14.4477 7 14 6.55228 14 6C14 5.44772 14.4477 5 15 5C15.5523 5 16 5.44772 16 6Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M10 6C10 6.55228 9.55228 7 9 7C8.44772 7 8 6.55228 8 6C8 5.44772 8.44772 5 9 5C9.55228 5 10 5.44772 10 6Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M16 18C16 18.5523 15.5523 19 15 19C14.4477 19 14 18.5523 14 18C14 17.4477 14.4477 17 15 17C15.5523 17 16 17.4477 16 18Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M16 12C16 12.5523 15.5523 13 15 13C14.4477 13 14 12.5523 14 12C14 11.4477 14.4477 11 15 11C15.5523 11 16 11.4477 16 12Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M10 18C10 18.5523 9.55228 19 9 19C8.44772 19 8 18.5523 8 18C8 17.4477 8.44772 17 9 17C9.55228 17 10 17.4477 10 18Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M10 12C10 12.5523 9.55228 13 9 13C8.44772 13 8 12.5523 8 12C8 11.4477 8.44772 11 9 11C9.55228 11 10 11.4477 10 12Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg></button><div style="flex:1;min-inline-size:0;font-size:var(--ayy-text-xs)">Table column reordering</div><span class="ayy-badge ayy-badge--info">feature</span></li></ul></div><div style="display:flex;flex-direction:column;gap:var(--ayy-space-2)"><div class="ayy-spread"><span style="font-weight:var(--ayy-weight-semibold);font-size:var(--ayy-text-sm)">QA (Features only)</span><span class="ayy-muted ayy-small">1</span></div><ul class="ayy-drop-target ayy-sortable" data-id="qa-features" data-accepts="feature" style="min-block-size:12rem"><li class="ayy-draggable ayy-sortable__item" data-id="c-4" data-type="feature"><button type="button" class="ayy-drag-handle" aria-label="Move File upload drop zone"><svg class="ayy-icon" data-ayy-icon="grip-vertical" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M16 6C16 6.55228 15.5523 7 15 7C14.4477 7 14 6.55228 14 6C14 5.44772 14.4477 5 15 5C15.5523 5 16 5.44772 16 6Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M10 6C10 6.55228 9.55228 7 9 7C8.44772 7 8 6.55228 8 6C8 5.44772 8.44772 5 9 5C9.55228 5 10 5.44772 10 6Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M16 18C16 18.5523 15.5523 19 15 19C14.4477 19 14 18.5523 14 18C14 17.4477 14.4477 17 15 17C15.5523 17 16 17.4477 16 18Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M16 12C16 12.5523 15.5523 13 15 13C14.4477 13 14 12.5523 14 12C14 11.4477 14.4477 11 15 11C15.5523 11 16 11.4477 16 12Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M10 18C10 18.5523 9.55228 19 9 19C8.44772 19 8 18.5523 8 18C8 17.4477 8.44772 17 9 17C9.55228 17 10 17.4477 10 18Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M10 12C10 12.5523 9.55228 13 9 13C8.44772 13 8 12.5523 8 12C8 11.4477 8.44772 11 9 11C9.55228 11 10 11.4477 10 12Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg></button><div style="flex:1;min-inline-size:0;font-size:var(--ayy-text-xs)">File upload drop zone</div><span class="ayy-badge ayy-badge--info">feature</span></li></ul></div></ayy-drag-drop>
```

React:

```tsx
import { useState } from "react";
import { Badge, DragDropArea, DragHandle, DropTarget, SortableItem, type DragMove } from "@danitesler/ayywi/react";

interface Card {
  id: string;
  title: string;
  type: "feature" | "bug";
}

interface Column {
  id: string;
  title: string;
  accepts?: string;
  cards: Card[];
}

const INITIAL_COLUMNS: Column[] = [
  {
    id: "backlog",
    title: "Backlog",
    cards: [
      { id: "c-1", title: "Add keyboard shortcut recorder", type: "feature" },
      { id: "c-2", title: "Fix tooltip flicker on hover", type: "bug" },
    ],
  },
  {
    id: "in-progress",
    title: "In Progress",
    cards: [{ id: "c-3", title: "Table column reordering", type: "feature" }],
  },
  {
    id: "qa-features",
    title: "QA (Features only)",
    accepts: "feature",
    cards: [{ id: "c-4", title: "File upload drop zone", type: "feature" }],
  },
];

export default function Example() {
  const [columns, setColumns] = useState<Column[]>(INITIAL_COLUMNS);

  const handleMove = ({ fromId, toId, fromIndex, toIndex }: DragMove) => {
    if (!fromId || !toId) return;
    setColumns((cols) => {
      const next = cols.map((c) => ({ ...c, cards: [...c.cards] }));
      const sourceCol = next.find((c) => c.id === fromId);
      const targetCol = next.find((c) => c.id === toId);
      if (!sourceCol || !targetCol) return cols;
      const [moved] = sourceCol.cards.splice(fromIndex, 1);
      targetCol.cards.splice(toIndex, 0, moved);
      return next;
    });
  };

  return (
    <DragDropArea onMove={handleMove} style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "var(--ayy-space-4)", inlineSize: "100%" }}>
      {columns.map((col) => (
        <div key={col.id} style={{ display: "flex", flexDirection: "column", gap: "var(--ayy-space-2)" }}>
          <div className="ayy-spread">
            <span style={{ fontWeight: "var(--ayy-weight-semibold)", fontSize: "var(--ayy-text-sm)" }}>{col.title}</span>
            <span className="ayy-muted ayy-small">{col.cards.length}</span>
          </div>
          <DropTarget data-id={col.id} data-accepts={col.accepts} style={{ minBlockSize: "12rem" }}>
            {col.cards.map((card) => (
              <SortableItem key={card.id} data-id={card.id} data-type={card.type}>
                <DragHandle aria-label={`Move ${card.title}`} />
                <div style={{ flex: 1, minInlineSize: 0, fontSize: "var(--ayy-text-xs)" }}>
                  {card.title}
                </div>
                <Badge variant={card.type === "bug" ? "destructive" : "info"}>
                  {card.type}
                </Badge>
              </SortableItem>
            ))}
          </DropTarget>
        </div>
      ))}
    </DragDropArea>
  );
}
```

---
Part of @danitesler/ayywi 0.1.2: load `dist/ayywi.min.css` (and `dist/elements.global.js` for the <ayy-*> elements). The rules every screen follows: [llms-full.txt#rules](../llms-full.txt#rules). Every component: [llms.txt](../llms.txt).
