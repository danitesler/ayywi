# Board

Category: Data display. Cards grouped into columns by status or stage, with optional dragging and adding. Also called: board, kanban, kanban-board, pipeline.

**Classes**
- `.ayy-board` — Horizontally scrollable board.
- `.ayy-board__column` — One status or stage.
- `.ayy-board__header` — Column title, count and actions.
- `.ayy-board__column-handle` — Drag handle for reordering columns.
- `.ayy-board__title` — Column heading.
- `.ayy-board__count` — Number of cards.
- `.ayy-board__actions` — Column actions at the inline end.
- `.ayy-board__cards` — Scrollable sortable card list.
- `.ayy-board__card` — Interactive sortable card.
- `.ayy-board__card-content` — Card contents beside optional hover actions.
- `.ayy-board__empty` — Empty column message.
- `.ayy-board__add` — Add card button.

**States**
- `default` — Columns with headings, counts and cards.
- `hover` (`Hover a card`) — Card lifts and optional actions appear.
- `pressed` (`Press a card`) — Card and Drag and drop provide the interaction feedback.
- `focus` (`Focus a card or button`) — The control has its focus ring.
- `disabled` — doesn't apply: Disable an action or use aria-disabled on a draggable item.
- `selected` (`selected on BoardCard`) — Card uses the featured treatment and aria-current.
- `error` — doesn't apply: Show an Alert or inline error near the board.
- `loading` — doesn't apply: Show Skeleton cards in the column.
- `dragging` (`A card is dragged`) — Drag and drop marks the card, targets and drop edge.

**Sizes**
- Density — Controls follow density and size scope.
- Width — Columns use --ayy-board-column-width (17rem by default); the board scrolls inline.

**React** — `import { Board, BoardColumn, BoardCard } from "@danitesler/ayywi/react";`
- `<Board>` renders div.ayy-board, optionally a DragDropArea. Props: `onMove` (move: DragMove) => void — update card state; `onColumnMove` (move: DragMove) => void — reorder columns, each with a drag handle. React only; `accepts` (item, area) => boolean — optional drop rule
- `<BoardColumn>` renders section with heading and DropTarget. Props: `id` string — column ID; `title` ReactNode — heading; `count` number — card count; `icon` ReactNode — optional icon; `actions` ReactNode — column actions; `emptyText` ReactNode — empty message; `accepts` string — accepted card types; `onAdd` () => void — show add button; `addLabel` string — add button label; `moveLabel` string — accessible column drag handle name; `footer` ReactNode — replaces add button
- `<BoardCard>` renders li.ayy-card.ayy-sortable__item. Props: `id` string — card ID; `selected` boolean — featured card; `type` string — type checked by drop targets; `actions` ReactNode — HoverAction buttons revealed on hover or focus

**Accessibility**
- Label the board and each column; cards are focusable.
- Alt+arrow keys move cards along and across columns; column handles take the arrow keys. Drag and drop announces moves.

**Do**
- Use a board for cards grouped into columns by status or stage.
- Update the controlled card lists in onMove and provide stable IDs.

**Don't**
- Don't use a board for a simple list — use List or Table.

## Board — Release board

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<ayy-drag-drop areas=".ayy-drop-target"><div class="ayy-board" aria-label="Release board"><section data-id="todo" class="ayy-board__column" aria-labelledby="_R_1_"><header class="ayy-board__header"><h3 class="ayy-board__title" id="_R_1_">To do</h3><span class="ayy-board__count">3</span></header><ul class="ayy-drop-target ayy-sortable ayy-board__cards" data-id="todo" aria-labelledby="_R_1_"><li class="ayy-draggable ayy-sortable__item ayy-card ayy-card--interactive ayy-board__card" data-id="c-1" tabindex="0"><div class="ayy-board__card-content"><span>Write release notes</span><span class="ayy-badge ayy-badge--muted">Docs</span></div><div class="ayy-hover-actions ayy-hover-actions--reveal"><ayy-tooltip class="ayy-tooltip"><button type="button" class="ayy-hover-action" aria-label="Duplicate" aria-describedby="_R_pl_"><svg class="ayy-icon" data-ayy-icon="copy" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7.5 14.5C7.5 11.2002 7.5 9.55025 8.52513 8.52513C9.55025 7.5 11.2002 7.5 14.5 7.5C17.7998 7.5 19.4497 7.5 20.4749 8.52513C21.5 9.55025 21.5 11.2002 21.5 14.5C21.5 17.7998 21.5 19.4497 20.4749 20.4749C19.4497 21.5 17.7998 21.5 14.5 21.5C11.2002 21.5 9.55025 21.5 8.52513 20.4749C7.5 19.4497 7.5 17.7998 7.5 14.5Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M7.5 16.5C6.10355 16.5 5.40533 16.5 4.84402 16.3036C3.83866 15.9518 3.0482 15.1613 2.69641 14.156C2.5 13.5947 2.5 12.8964 2.5 11.5V9.5C2.5 6.20017 2.5 4.55025 3.52513 3.52513C4.55025 2.5 6.20017 2.5 9.5 2.5H11.5C12.8964 2.5 13.5947 2.5 14.156 2.69641C15.1613 3.0482 15.9518 3.83866 16.3036 4.84402C16.5 5.40533 16.5 6.10355 16.5 7.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg></button><span role="tooltip" id="_R_pl_" class="ayy-tooltip__content" data-side="bottom">Duplicate</span></ayy-tooltip><ayy-tooltip class="ayy-tooltip"><button type="button" class="ayy-hover-action" aria-label="Delete" aria-describedby="_R_19l_"><svg class="ayy-icon" data-ayy-icon="trash" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M19.5 5.5L18.8803 15.5251C18.7219 18.0864 18.6428 19.3671 18.0008 20.2879C17.6833 20.7431 17.2747 21.1273 16.8007 21.416C15.8421 22 14.559 22 11.9927 22C9.42312 22 8.1383 22 7.17905 21.4149C6.7048 21.1257 6.296 20.7408 5.97868 20.2848C5.33688 19.3626 5.25945 18.0801 5.10461 15.5152L4.5 5.5" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path><path d="M3 5.5H21M16.0557 5.5L15.3731 4.09173C14.9196 3.15626 14.6928 2.68852 14.3017 2.39681C14.215 2.3321 14.1231 2.27454 14.027 2.2247C13.5939 2 13.0741 2 12.0345 2C10.9688 2 10.436 2 9.99568 2.23412C9.8981 2.28601 9.80498 2.3459 9.71729 2.41317C9.32164 2.7167 9.10063 3.20155 8.65861 4.17126L8.05292 5.5" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path><path d="M9.5 16.5L9.5 10.5" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path><path d="M14.5 16.5L14.5 10.5" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path></svg></button><span role="tooltip" id="_R_19l_" class="ayy-tooltip__content" data-side="bottom">Delete</span></ayy-tooltip></div></li><li class="ayy-draggable ayy-sortable__item ayy-card ayy-card--interactive ayy-board__card" data-id="c-2" tabindex="0"><div class="ayy-board__card-content"><span>Fix tooltip flicker</span><span class="ayy-badge ayy-badge--muted">Bug</span></div><div class="ayy-hover-actions ayy-hover-actions--reveal"><ayy-tooltip class="ayy-tooltip"><button type="button" class="ayy-hover-action" aria-label="Duplicate" aria-describedby="_R_ql_"><svg class="ayy-icon" data-ayy-icon="copy" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7.5 14.5C7.5 11.2002 7.5 9.55025 8.52513 8.52513C9.55025 7.5 11.2002 7.5 14.5 7.5C17.7998 7.5 19.4497 7.5 20.4749 8.52513C21.5 9.55025 21.5 11.2002 21.5 14.5C21.5 17.7998 21.5 19.4497 20.4749 20.4749C19.4497 21.5 17.7998 21.5 14.5 21.5C11.2002 21.5 9.55025 21.5 8.52513 20.4749C7.5 19.4497 7.5 17.7998 7.5 14.5Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M7.5 16.5C6.10355 16.5 5.40533 16.5 4.84402 16.3036C3.83866 15.9518 3.0482 15.1613 2.69641 14.156C2.5 13.5947 2.5 12.8964 2.5 11.5V9.5C2.5 6.20017 2.5 4.55025 3.52513 3.52513C4.55025 2.5 6.20017 2.5 9.5 2.5H11.5C12.8964 2.5 13.5947 2.5 14.156 2.69641C15.1613 3.0482 15.9518 3.83866 16.3036 4.84402C16.5 5.40533 16.5 6.10355 16.5 7.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg></button><span role="tooltip" id="_R_ql_" class="ayy-tooltip__content" data-side="bottom">Duplicate</span></ayy-tooltip><ayy-tooltip class="ayy-tooltip"><button type="button" class="ayy-hover-action" aria-label="Delete" aria-describedby="_R_1al_"><svg class="ayy-icon" data-ayy-icon="trash" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M19.5 5.5L18.8803 15.5251C18.7219 18.0864 18.6428 19.3671 18.0008 20.2879C17.6833 20.7431 17.2747 21.1273 16.8007 21.416C15.8421 22 14.559 22 11.9927 22C9.42312 22 8.1383 22 7.17905 21.4149C6.7048 21.1257 6.296 20.7408 5.97868 20.2848C5.33688 19.3626 5.25945 18.0801 5.10461 15.5152L4.5 5.5" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path><path d="M3 5.5H21M16.0557 5.5L15.3731 4.09173C14.9196 3.15626 14.6928 2.68852 14.3017 2.39681C14.215 2.3321 14.1231 2.27454 14.027 2.2247C13.5939 2 13.0741 2 12.0345 2C10.9688 2 10.436 2 9.99568 2.23412C9.8981 2.28601 9.80498 2.3459 9.71729 2.41317C9.32164 2.7167 9.10063 3.20155 8.65861 4.17126L8.05292 5.5" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path><path d="M9.5 16.5L9.5 10.5" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path><path d="M14.5 16.5L14.5 10.5" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path></svg></button><span role="tooltip" id="_R_1al_" class="ayy-tooltip__content" data-side="bottom">Delete</span></ayy-tooltip></div></li><li class="ayy-draggable ayy-sortable__item ayy-card ayy-card--interactive ayy-board__card" data-id="c-3" tabindex="0"><div class="ayy-board__card-content"><span>Update screenshots</span><span class="ayy-badge ayy-badge--muted">Docs</span></div><div class="ayy-hover-actions ayy-hover-actions--reveal"><ayy-tooltip class="ayy-tooltip"><button type="button" class="ayy-hover-action" aria-label="Duplicate" aria-describedby="_R_rl_"><svg class="ayy-icon" data-ayy-icon="copy" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7.5 14.5C7.5 11.2002 7.5 9.55025 8.52513 8.52513C9.55025 7.5 11.2002 7.5 14.5 7.5C17.7998 7.5 19.4497 7.5 20.4749 8.52513C21.5 9.55025 21.5 11.2002 21.5 14.5C21.5 17.7998 21.5 19.4497 20.4749 20.4749C19.4497 21.5 17.7998 21.5 14.5 21.5C11.2002 21.5 9.55025 21.5 8.52513 20.4749C7.5 19.4497 7.5 17.7998 7.5 14.5Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M7.5 16.5C6.10355 16.5 5.40533 16.5 4.84402 16.3036C3.83866 15.9518 3.0482 15.1613 2.69641 14.156C2.5 13.5947 2.5 12.8964 2.5 11.5V9.5C2.5 6.20017 2.5 4.55025 3.52513 3.52513C4.55025 2.5 6.20017 2.5 9.5 2.5H11.5C12.8964 2.5 13.5947 2.5 14.156 2.69641C15.1613 3.0482 15.9518 3.83866 16.3036 4.84402C16.5 5.40533 16.5 6.10355 16.5 7.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg></button><span role="tooltip" id="_R_rl_" class="ayy-tooltip__content" data-side="bottom">Duplicate</span></ayy-tooltip><ayy-tooltip class="ayy-tooltip"><button type="button" class="ayy-hover-action" aria-label="Delete" aria-describedby="_R_1bl_"><svg class="ayy-icon" data-ayy-icon="trash" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M19.5 5.5L18.8803 15.5251C18.7219 18.0864 18.6428 19.3671 18.0008 20.2879C17.6833 20.7431 17.2747 21.1273 16.8007 21.416C15.8421 22 14.559 22 11.9927 22C9.42312 22 8.1383 22 7.17905 21.4149C6.7048 21.1257 6.296 20.7408 5.97868 20.2848C5.33688 19.3626 5.25945 18.0801 5.10461 15.5152L4.5 5.5" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path><path d="M3 5.5H21M16.0557 5.5L15.3731 4.09173C14.9196 3.15626 14.6928 2.68852 14.3017 2.39681C14.215 2.3321 14.1231 2.27454 14.027 2.2247C13.5939 2 13.0741 2 12.0345 2C10.9688 2 10.436 2 9.99568 2.23412C9.8981 2.28601 9.80498 2.3459 9.71729 2.41317C9.32164 2.7167 9.10063 3.20155 8.65861 4.17126L8.05292 5.5" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path><path d="M9.5 16.5L9.5 10.5" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path><path d="M14.5 16.5L14.5 10.5" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path></svg></button><span role="tooltip" id="_R_1bl_" class="ayy-tooltip__content" data-side="bottom">Delete</span></ayy-tooltip></div></li></ul><button type="button" class="ayy-button ayy-button--ghost ayy-board__add"><svg class="ayy-icon" data-ayy-icon="plus" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 4V20M20 12H4" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg>Add card</button></section><section data-id="doing" class="ayy-board__column" aria-labelledby="_R_2_"><header class="ayy-board__header"><h3 class="ayy-board__title" id="_R_2_">In progress</h3><span class="ayy-board__count">1</span></header><ul class="ayy-drop-target ayy-sortable ayy-board__cards" data-id="doing" aria-labelledby="_R_2_"><li class="ayy-draggable ayy-sortable__item ayy-card ayy-card--interactive ayy-board__card" data-id="c-4" tabindex="0"><div class="ayy-board__card-content"><span>Table column reordering</span><span class="ayy-badge ayy-badge--muted">Feature</span></div><div class="ayy-hover-actions ayy-hover-actions--reveal"><ayy-tooltip class="ayy-tooltip"><button type="button" class="ayy-hover-action" aria-label="Duplicate" aria-describedby="_R_dm_"><svg class="ayy-icon" data-ayy-icon="copy" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7.5 14.5C7.5 11.2002 7.5 9.55025 8.52513 8.52513C9.55025 7.5 11.2002 7.5 14.5 7.5C17.7998 7.5 19.4497 7.5 20.4749 8.52513C21.5 9.55025 21.5 11.2002 21.5 14.5C21.5 17.7998 21.5 19.4497 20.4749 20.4749C19.4497 21.5 17.7998 21.5 14.5 21.5C11.2002 21.5 9.55025 21.5 8.52513 20.4749C7.5 19.4497 7.5 17.7998 7.5 14.5Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M7.5 16.5C6.10355 16.5 5.40533 16.5 4.84402 16.3036C3.83866 15.9518 3.0482 15.1613 2.69641 14.156C2.5 13.5947 2.5 12.8964 2.5 11.5V9.5C2.5 6.20017 2.5 4.55025 3.52513 3.52513C4.55025 2.5 6.20017 2.5 9.5 2.5H11.5C12.8964 2.5 13.5947 2.5 14.156 2.69641C15.1613 3.0482 15.9518 3.83866 16.3036 4.84402C16.5 5.40533 16.5 6.10355 16.5 7.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg></button><span role="tooltip" id="_R_dm_" class="ayy-tooltip__content" data-side="bottom">Duplicate</span></ayy-tooltip><ayy-tooltip class="ayy-tooltip"><button type="button" class="ayy-hover-action" aria-label="Delete" aria-describedby="_R_lm_"><svg class="ayy-icon" data-ayy-icon="trash" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M19.5 5.5L18.8803 15.5251C18.7219 18.0864 18.6428 19.3671 18.0008 20.2879C17.6833 20.7431 17.2747 21.1273 16.8007 21.416C15.8421 22 14.559 22 11.9927 22C9.42312 22 8.1383 22 7.17905 21.4149C6.7048 21.1257 6.296 20.7408 5.97868 20.2848C5.33688 19.3626 5.25945 18.0801 5.10461 15.5152L4.5 5.5" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path><path d="M3 5.5H21M16.0557 5.5L15.3731 4.09173C14.9196 3.15626 14.6928 2.68852 14.3017 2.39681C14.215 2.3321 14.1231 2.27454 14.027 2.2247C13.5939 2 13.0741 2 12.0345 2C10.9688 2 10.436 2 9.99568 2.23412C9.8981 2.28601 9.80498 2.3459 9.71729 2.41317C9.32164 2.7167 9.10063 3.20155 8.65861 4.17126L8.05292 5.5" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path><path d="M9.5 16.5L9.5 10.5" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path><path d="M14.5 16.5L14.5 10.5" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path></svg></button><span role="tooltip" id="_R_lm_" class="ayy-tooltip__content" data-side="bottom">Delete</span></ayy-tooltip></div></li></ul><button type="button" class="ayy-button ayy-button--ghost ayy-board__add"><svg class="ayy-icon" data-ayy-icon="plus" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 4V20M20 12H4" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg>Add card</button></section><section data-id="done" class="ayy-board__column" aria-labelledby="_R_3_"><header class="ayy-board__header"><h3 class="ayy-board__title" id="_R_3_">Done</h3><span class="ayy-board__count">0</span></header><ul class="ayy-drop-target ayy-sortable ayy-board__cards" data-id="done" aria-labelledby="_R_3_"><li class="ayy-board__empty">Drop cards here</li></ul><button type="button" class="ayy-button ayy-button--ghost ayy-board__add"><svg class="ayy-icon" data-ayy-icon="plus" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 4V20M20 12H4" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg>Add card</button></section></div></ayy-drag-drop>
```

React:

```tsx
import { useState } from "react";
import { Copy01Icon, Delete02Icon } from "@hugeicons/core-free-icons";
import { Badge, Board, BoardCard, BoardColumn, HoverAction, Icon, type DragMove } from "@danitesler/ayywi/react";

interface Card { id: string; title: string; tag: string }
interface Column { id: string; title: string; cards: Card[] }
const initial: Column[] = [
  { id: "todo", title: "To do", cards: [{ id: "c-1", title: "Write release notes", tag: "Docs" }, { id: "c-2", title: "Fix tooltip flicker", tag: "Bug" }, { id: "c-3", title: "Update screenshots", tag: "Docs" }] },
  { id: "doing", title: "In progress", cards: [{ id: "c-4", title: "Table column reordering", tag: "Feature" }] },
  { id: "done", title: "Done", cards: [] },
];
export default function Example() {
  const [columns, setColumns] = useState(initial);
  const [nextId, setNextId] = useState(1);
  const move = ({ fromId, toId, fromIndex, toIndex }: DragMove) => setColumns((previous) => {
    const next = previous.map((column) => ({ ...column, cards: [...column.cards] }));
    const from = next.find((column) => column.id === fromId);
    const to = next.find((column) => column.id === toId);
    if (!from || !to) return previous;
    const [card] = from.cards.splice(fromIndex, 1);
    to.cards.splice(toIndex, 0, card);
    return next;
  });
  const moveColumn = ({ fromIndex, toIndex }: DragMove) => setColumns((previous) => {
    const next = [...previous];
    const [column] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, column);
    return next;
  });
  const duplicate = (columnId: string, card: Card) => {
    setColumns((previous) => previous.map((column) => column.id === columnId ? { ...column, cards: [...column.cards, { ...card, id: `new-${nextId}` }] } : column));
    setNextId((n) => n + 1);
  };
  const remove = (columnId: string, cardId: string) => setColumns((previous) => previous.map((column) => column.id === columnId ? { ...column, cards: column.cards.filter((card) => card.id !== cardId) } : column));
  const add = (id: string) => {
    setColumns((previous) => previous.map((column) => column.id === id ? { ...column, cards: [...column.cards, { id: `new-${nextId}`, title: "New card", tag: "Feature" }] } : column));
    setNextId((n) => n + 1);
  };
  return <Board aria-label="Release board" onMove={move} onColumnMove={moveColumn}>{columns.map((column) => <BoardColumn key={column.id} id={column.id} title={column.title} count={column.cards.length} emptyText="Drop cards here" onAdd={() => add(column.id)}>{column.cards.map((card) => <BoardCard key={card.id} id={card.id} actions={<><HoverAction label="Duplicate" onClick={() => duplicate(column.id, card)}><Icon icon={Copy01Icon} name="copy" /></HoverAction><HoverAction label="Delete" onClick={() => remove(column.id, card.id)}><Icon icon={Delete02Icon} name="trash" /></HoverAction></>}><span>{card.title}</span><Badge variant="muted">{card.tag}</Badge></BoardCard>)}</BoardColumn>)}</Board>;
}
```

---
Part of @danitesler/ayywi 0.1.2: load `dist/ayywi.min.css` (and `dist/elements.global.js` for the <ayy-*> elements). The rules every screen follows: [llms-full.txt#rules](../llms-full.txt#rules). Every component: [llms.txt](../llms.txt).
