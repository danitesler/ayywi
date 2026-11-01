export interface ChecklistItem { id: string; text: string; done: boolean }
export interface ChecklistLabels {
  add: string;
  item: string;
  untitled: string;
  remove: (text: string) => string;
  count: (done: number, total: number) => string;
}
export const checklistLabels: ChecklistLabels = {
  add: "Add an item", item: "Edit item", untitled: "Untitled item", remove: (text) => `Remove ${text}`, count: (done, total) => `${done} of ${total} done`,
};
export function checklistProgress(items: readonly ChecklistItem[]): { done: number; total: number; percent: number } {
  const done = items.filter((item) => item.done).length;
  return { done, total: items.length, percent: items.length ? Math.round(done / items.length * 100) : 0 };
}
export function checklistInsert(items: readonly ChecklistItem[], afterId: string | null, item: ChecklistItem): ChecklistItem[] {
  const index = afterId === null ? items.length : items.findIndex((entry) => entry.id === afterId) + 1;
  const at = index === 0 && afterId !== null ? items.length : index;
  return [...items.slice(0, at), item, ...items.slice(at)];
}
export function checklistRemove(items: readonly ChecklistItem[], id: string): { items: ChecklistItem[]; focusId: string | null } {
  const index = items.findIndex((item) => item.id === id);
  if (index < 0) return { items: [...items], focusId: null };
  return { items: items.filter((item) => item.id !== id), focusId: items[index - 1]?.id ?? items[index + 1]?.id ?? null };
}
export function checklistMove(items: readonly ChecklistItem[], id: string, delta: -1 | 1): ChecklistItem[] {
  const index = items.findIndex((item) => item.id === id);
  const target = index + delta;
  const result = [...items];
  if (index < 0 || target < 0 || target >= items.length) return result;
  [result[index], result[target]] = [result[target], result[index]];
  return result;
}
export function checklistUpdate(items: readonly ChecklistItem[], id: string, patch: Partial<Omit<ChecklistItem, "id">>): ChecklistItem[] {
  return items.map((item) => item.id === id ? { ...item, ...patch } : item);
}
