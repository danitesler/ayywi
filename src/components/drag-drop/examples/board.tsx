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