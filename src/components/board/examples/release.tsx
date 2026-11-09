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
