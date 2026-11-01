# Board

Category: Data display. Cards grouped into columns by status or stage, with optional dragging and adding. Also called: board, kanban, kanban-board, pipeline.

**Classes**
- `.ayy-board` — Horizontally scrollable board.
- `.ayy-board__column` — One status or stage.
- `.ayy-board__header` — Column title, count and actions.
- `.ayy-board__title` — Column heading.
- `.ayy-board__count` — Number of cards.
- `.ayy-board__actions` — Column actions at the inline end.
- `.ayy-board__cards` — Scrollable sortable card list.
- `.ayy-board__card` — Interactive sortable card.
- `.ayy-board__empty` — Empty column message.
- `.ayy-board__add` — Add card button.

**States**
- `default` — Columns with headings, counts and cards.
- `hover` (`Hover a card`) — Card's interactive hover treatment.
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
- `<Board>` renders div.ayy-board, optionally a DragDropArea. Props: `onMove` (move: DragMove) => void — update card state; `accepts` (item, area) => boolean — optional drop rule
- `<BoardColumn>` renders section with heading and DropTarget. Props: `id` string — column ID; `title` ReactNode — heading; `count` number — card count; `icon` ReactNode — optional icon; `actions` ReactNode — column actions; `emptyText` ReactNode — empty message; `accepts` string — accepted card types; `onAdd` () => void — show add button; `addLabel` string — add button label; `footer` ReactNode — replaces add button
- `<BoardCard>` renders li.ayy-card.ayy-sortable__item. Props: `id` string — card ID; `selected` boolean — featured card; `type` string — type checked by drop targets

**Accessibility**
- Label the board and each column; cards are focusable.
- Alt+arrow keys move cards along and across columns; Drag and drop announces moves.

**Do**
- Use a board for cards grouped into columns by status or stage.
- Update the controlled card lists in onMove and provide stable IDs.

**Don't**
- Don't use a board for a simple list — use List or Table.

## Board — Release board

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<ayy-drag-drop areas=".ayy-drop-target"><div class="ayy-board" aria-label="Release board"><section class="ayy-board__column" aria-labelledby="_R_1_"><header class="ayy-board__header"><h3 class="ayy-board__title" id="_R_1_">To do</h3><span class="ayy-board__count">3</span></header><ul class="ayy-drop-target ayy-sortable ayy-board__cards" data-id="todo" aria-labelledby="_R_1_"><li class="ayy-draggable ayy-sortable__item ayy-card ayy-card--interactive ayy-board__card" data-id="c-1" tabindex="0"><span>Write release notes</span><span class="ayy-badge ayy-badge--muted">Docs</span></li><li class="ayy-draggable ayy-sortable__item ayy-card ayy-card--interactive ayy-board__card" data-id="c-2" tabindex="0"><span>Fix tooltip flicker</span><span class="ayy-badge ayy-badge--muted">Bug</span></li><li class="ayy-draggable ayy-sortable__item ayy-card ayy-card--interactive ayy-board__card" data-id="c-3" tabindex="0"><span>Update screenshots</span><span class="ayy-badge ayy-badge--muted">Docs</span></li></ul><button type="button" class="ayy-button ayy-button--ghost ayy-board__add"><svg class="ayy-icon" data-ayy-icon="plus" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 4V20M20 12H4" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg>Add card</button></section><section class="ayy-board__column" aria-labelledby="_R_2_"><header class="ayy-board__header"><h3 class="ayy-board__title" id="_R_2_">In progress</h3><span class="ayy-board__count">1</span></header><ul class="ayy-drop-target ayy-sortable ayy-board__cards" data-id="doing" aria-labelledby="_R_2_"><li class="ayy-draggable ayy-sortable__item ayy-card ayy-card--interactive ayy-board__card" data-id="c-4" tabindex="0"><span>Table column reordering</span><span class="ayy-badge ayy-badge--muted">Feature</span></li></ul><button type="button" class="ayy-button ayy-button--ghost ayy-board__add"><svg class="ayy-icon" data-ayy-icon="plus" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 4V20M20 12H4" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg>Add card</button></section><section class="ayy-board__column" aria-labelledby="_R_3_"><header class="ayy-board__header"><h3 class="ayy-board__title" id="_R_3_">Done</h3><span class="ayy-board__count">0</span></header><ul class="ayy-drop-target ayy-sortable ayy-board__cards" data-id="done" aria-labelledby="_R_3_"><li class="ayy-board__empty">Drop cards here</li></ul><button type="button" class="ayy-button ayy-button--ghost ayy-board__add"><svg class="ayy-icon" data-ayy-icon="plus" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 4V20M20 12H4" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg>Add card</button></section></div></ayy-drag-drop>
```

React:

```tsx
import { useState } from "react";
import { Badge, Board, BoardCard, BoardColumn, type DragMove } from "@danitesler/ayywi/react";

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
  const add = (id: string) => {
    setColumns((previous) => previous.map((column) => column.id === id ? { ...column, cards: [...column.cards, { id: `new-${nextId}`, title: "New card", tag: "Feature" }] } : column));
    setNextId((n) => n + 1);
  };
  return <Board aria-label="Release board" onMove={move}>{columns.map((column) => <BoardColumn key={column.id} id={column.id} title={column.title} count={column.cards.length} emptyText="Drop cards here" onAdd={() => add(column.id)}>{column.cards.map((card) => <BoardCard key={card.id} id={card.id}><span>{card.title}</span><Badge variant="muted">{card.tag}</Badge></BoardCard>)}</BoardColumn>)}</Board>;
}
```

---
Part of @danitesler/ayywi 0.1.2: load `dist/ayywi.min.css` (and `dist/elements.global.js` for the <ayy-*> elements). The rules every screen follows: [llms-full.txt#rules](../llms-full.txt#rules). Every component: [llms.txt](../llms.txt).
