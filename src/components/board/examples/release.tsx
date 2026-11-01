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
