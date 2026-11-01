import { useState } from "react";
import { Card, CardContent, Checklist, type ChecklistItem } from "@danitesler/ayywi/react";

export default function Example() {
  const [items, setItems] = useState<ChecklistItem[]>([
    { id: "passport", text: "Passport", done: true },
    { id: "charger", text: "Charger", done: true },
    { id: "jacket", text: "Rain jacket", done: false },
    { id: "adapter", text: "Travel adapter", done: false },
  ]);
  return <Card><CardContent><Checklist label="Packing list" items={items} onItemsChange={setItems} /></CardContent></Card>;
}
