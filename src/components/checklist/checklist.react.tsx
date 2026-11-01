import { forwardRef, useId, useLayoutEffect, useRef, useState, type CSSProperties, type HTMLAttributes, type KeyboardEvent } from "react";
import { cx } from "../../lib/cx";
import { Cancel01Icon } from "../../lib/icons";
import { mergeRefs } from "../../lib/refs";
import { Icon } from "../icon/icon.react";
import { isComposingEvent } from "../inline-edit/inline-edit";
import { checklistInsert, checklistLabels, checklistMove, checklistProgress, checklistRemove, checklistUpdate, type ChecklistItem, type ChecklistLabels } from "./checklist";

export interface ChecklistProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  items: ChecklistItem[];
  onItemsChange: (items: ChecklistItem[]) => void;
  label: string;
  showProgress?: boolean;
  createId?: () => string;
  labels?: Partial<ChecklistLabels>;
}
export const Checklist = /* @__PURE__ */ forwardRef<HTMLDivElement, ChecklistProps>(function Checklist({ items, onItemsChange, label, showProgress = true, createId = () => crypto.randomUUID(), labels, className, ...props }, ref) {
  const names = { ...checklistLabels, ...labels };
  const root = useRef<HTMLDivElement>(null);
  const pending = useRef<{ id: string | null } | null>(null);
  const [draft, setDraft] = useState("");
  const countId = useId();
  const progress = checklistProgress(items);
  const focus = (id: string | null) => {
    const fields = root.current?.querySelectorAll<HTMLInputElement>(".ayy-checklist__item");
    const field = id === null ? root.current?.querySelector<HTMLInputElement>(".ayy-checklist__new") : Array.from(fields ?? []).find((row) => row.dataset.id === id)?.querySelector<HTMLInputElement>(".ayy-checklist__text");
    field?.focus();
    field?.setSelectionRange(field.value.length, field.value.length);
  };
  useLayoutEffect(() => {
    if (pending.current) { focus(pending.current.id); pending.current = null; }
  }, [items]);
  const remove = (id: string) => {
    const result = checklistRemove(items, id);
    pending.current = { id: result.focusId };
    onItemsChange(result.items);
  };
  const key = (event: KeyboardEvent<HTMLInputElement>, id: string | null) => {
    if (isComposingEvent(event.nativeEvent)) return;
    const index = items.findIndex((item) => item.id === id);
    if (event.key === "Enter") {
      event.preventDefault();
      if (id === null) {
        const text = draft.trim();
        if (text) { onItemsChange(checklistInsert(items, null, { id: createId(), text, done: false })); setDraft(""); }
      } else {
        const next = { id: createId(), text: "", done: false };
        pending.current = { id: next.id };
        onItemsChange(checklistInsert(items, id, next));
      }
    } else if (event.key === "Backspace" && id !== null && !event.currentTarget.value) {
      event.preventDefault(); remove(id);
    } else if (event.key === "ArrowUp" || event.key === "ArrowDown") {
      const delta = event.key === "ArrowUp" ? -1 : 1;
      if (event.altKey && id !== null) {
        event.preventDefault(); pending.current = { id }; onItemsChange(checklistMove(items, id, delta));
      } else if (!event.altKey) {
        const target = (id === null ? items.length : index) + delta;
        if (target >= 0 && target <= items.length) { event.preventDefault(); focus(items[target]?.id ?? null); }
      }
    }
  };
  return <div ref={mergeRefs(ref, root)} className={cx("ayy-checklist", className)} {...props}>
    {showProgress && <div className="ayy-checklist__header" hidden={!items.length}>
      <span className="ayy-checklist__count" dir="auto" id={countId}>{names.count(progress.done, progress.total)}</span>
      <div className="ayy-progress ayy-progress--sm ayy-checklist__progress" role="progressbar" aria-labelledby={countId} aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress.percent} style={{ "--ayy-value": progress.percent } as CSSProperties}><div className="ayy-progress__bar" /></div>
    </div>}
    <ul className="ayy-checklist__items" aria-label={label}>
      {items.map((item) => <li key={item.id} className="ayy-checklist__item" data-id={item.id}>
        <input type="checkbox" className="ayy-checkbox" aria-label={item.text || names.untitled} checked={item.done} onChange={(event) => onItemsChange(checklistUpdate(items, item.id, { done: event.target.checked }))} />
        <input type="text" className="ayy-checklist__text" aria-label={names.item} value={item.text} onChange={(event) => onItemsChange(checklistUpdate(items, item.id, { text: event.target.value }))} onKeyDown={(event) => key(event, item.id)} />
        <button type="button" className="ayy-button ayy-button--ghost ayy-button--icon ayy-checklist__remove" aria-label={names.remove(item.text || names.untitled)} onClick={() => remove(item.id)}><Icon icon={Cancel01Icon} name="x" /></button>
      </li>)}
    </ul>
    <input type="text" className="ayy-checklist__text ayy-checklist__new" aria-label={names.add} placeholder={names.add} value={draft} onChange={(event) => setDraft(event.target.value)} onKeyDown={(event) => key(event, null)} />
  </div>;
});
