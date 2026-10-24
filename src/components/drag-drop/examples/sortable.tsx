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