import { cx } from "../../lib/cx";
import { ArrowLeft01Icon, ArrowLeftDoubleIcon, ArrowRight01Icon, ArrowRightDoubleIcon, Search01Icon } from "../../lib/icons";
import { iconSvg } from "../icon/icon";

export interface TransferListClassOptions {
  className?: string;
}

export function transferListClass({ className }: TransferListClassOptions = {}): string {
  return cx("ayy-transfer-list", className);
}

export const transferListPaneClass = "ayy-transfer-list__pane";
export const transferListHeaderClass = "ayy-transfer-list__header";
export const transferListTitleClass = "ayy-transfer-list__title";
export const transferListCountClass = "ayy-transfer-list__count";
export const transferListSearchClass = "ayy-transfer-list__search";
export const transferListFilterClass = "ayy-transfer-list__filter";
export const transferListListClass = "ayy-transfer-list__list";
export const transferListItemClass = "ayy-transfer-list__item";
export const transferListItemBodyClass = "ayy-transfer-list__item-body";
export const transferListLabelClass = "ayy-transfer-list__label";
export const transferListDescriptionClass = "ayy-transfer-list__description";
export const transferListEmptyClass = "ayy-transfer-list__empty";
export const transferListActionsClass = "ayy-transfer-list__actions";

export const transferListSearchIcon = /* @__PURE__ */ iconSvg(Search01Icon, { name: "search" });
export const transferListAddIcon = /* @__PURE__ */ iconSvg(ArrowRight01Icon, { name: "chevron-right", directional: true });
export const transferListAddAllIcon = /* @__PURE__ */ iconSvg(ArrowRightDoubleIcon, { name: "chevrons-right", directional: true });
export const transferListRemoveIcon = /* @__PURE__ */ iconSvg(ArrowLeft01Icon, { name: "chevron-left", directional: true });
export const transferListRemoveAllIcon = /* @__PURE__ */ iconSvg(ArrowLeftDoubleIcon, { name: "chevrons-left", directional: true });

export type TransferDirection = "to-target" | "to-source";

export interface TransferListOptions {
  /** Called with the item values to move and the direction ("to-target" or "to-source"). */
  onTransfer?(ids: string[], direction: TransferDirection): void;
}

export interface TransferListController {
  /** Re-sync select-all mixed states, counts, empty states and button disabled states after items change. */
  sync(): void;
  destroy(): void;
}

/**
 * Wire a dual-list transfer picker on plain markup (.ayy-transfer-list with [data-pane="source"] and [data-pane="target"]).
 * Handles per-pane filtering, select-all checkboxes (including indeterminate state), live item counts, arrow-key navigation
 * inside each list, double-clicking a row to move it, and transfer action buttons.
 */
export function connectTransferList(root: HTMLElement, options: TransferListOptions = {}): TransferListController {
  const paneOf = (which: "source" | "target") => root.querySelector<HTMLElement>(`.ayy-transfer-list__pane[data-pane="${which}"]`);
  const itemsIn = (pane: HTMLElement | null) =>
    pane ? Array.from(pane.querySelectorAll<HTMLElement>(".ayy-transfer-list__item")) : [];
  const inputOf = (item: HTMLElement) => item.querySelector<HTMLInputElement>('input[type="checkbox"]');
  const valueOf = (item: HTMLElement) => item.dataset.value ?? inputOf(item)?.value ?? "";

  const syncPane = (which: "source" | "target") => {
    const pane = paneOf(which);
    if (!pane) return { checkedIds: [] as string[], enabledVisibleIds: [] as string[] };
    const filterInput = pane.querySelector<HTMLInputElement>(".ayy-transfer-list__filter");
    const query = (filterInput?.value ?? "").trim().toLocaleLowerCase();
    const items = itemsIn(pane);

    for (const item of items) {
      const text = `${item.textContent ?? ""} ${item.dataset.keywords ?? ""}`.toLocaleLowerCase();
      const hidden = query !== "" && !text.includes(query);
      item.hidden = hidden;
    }

    const visible = items.filter((item) => !item.hidden);
    const enabledVisible = visible.filter((item) => {
      const cb = inputOf(item);
      return Boolean(cb && !cb.disabled);
    });
    const checkedVisible = enabledVisible.filter((item) => inputOf(item)?.checked);

    const selectAll = pane.querySelector<HTMLInputElement>('.ayy-transfer-list__header input[type="checkbox"]');
    if (selectAll) {
      const rootDisabled = root.getAttribute("aria-disabled") === "true";
      selectAll.disabled = rootDisabled || enabledVisible.length === 0;
      selectAll.checked = enabledVisible.length > 0 && checkedVisible.length === enabledVisible.length;
      selectAll.indeterminate = checkedVisible.length > 0 && checkedVisible.length < enabledVisible.length;
    }

    const count = pane.querySelector<HTMLElement>(".ayy-transfer-list__count");
    if (count) {
      const checkedAll = items.filter((item) => {
        const cb = inputOf(item);
        return Boolean(cb && !cb.disabled && cb.checked);
      });
      count.textContent =
        checkedAll.length > 0
          ? `${checkedAll.length} / ${items.length}`
          : query !== ""
            ? `${visible.length} of ${items.length}`
            : `${items.length}`;
    }

    const empty = pane.querySelector<HTMLElement>(".ayy-transfer-list__empty");
    if (empty) {
      empty.hidden = visible.length > 0;
      if (visible.length === 0 && empty.dataset.emptyDefault) {
        empty.textContent = items.length === 0 ? empty.dataset.emptyDefault : (empty.dataset.emptyFilter ?? "No matches");
      }
    }

    const checkedIds = items
      .filter((item) => {
        const cb = inputOf(item);
        return Boolean(cb && !cb.disabled && cb.checked && !item.hidden);
      })
      .map(valueOf)
      .filter(Boolean);

    const enabledVisibleIds = enabledVisible.map(valueOf).filter(Boolean);
    return { checkedIds, enabledVisibleIds };
  };

  const sync = () => {
    const source = syncPane("source");
    const target = syncPane("target");
    const setBtn = (action: string, enabled: boolean) => {
      const btn = root.querySelector<HTMLButtonElement>(`.ayy-transfer-list__actions [data-action="${action}"]`);
      if (btn) btn.disabled = !enabled;
    };
    setBtn("add", source.checkedIds.length > 0);
    setBtn("add-all", source.enabledVisibleIds.length > 0);
    setBtn("remove", target.checkedIds.length > 0);
    setBtn("remove-all", target.enabledVisibleIds.length > 0);
  };

  const transfer = (ids: string[], direction: TransferDirection) => {
    if (!ids.length) return;
    const pane = paneOf(direction === "to-target" ? "source" : "target");
    const idSet = new Set(ids);
    for (const item of itemsIn(pane)) {
      if (idSet.has(valueOf(item))) {
        const cb = inputOf(item);
        if (cb) cb.checked = false;
      }
    }
    options.onTransfer?.(ids, direction);
    sync();
  };

  const onChange = (event: Event) => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement)) return;
    const header = target.closest(".ayy-transfer-list__header");
    if (header) {
      const pane = header.closest<HTMLElement>(".ayy-transfer-list__pane");
      for (const item of itemsIn(pane)) {
        if (item.hidden) continue;
        const cb = inputOf(item);
        if (cb && !cb.disabled) cb.checked = target.checked;
      }
    }
    sync();
  };

  const onInput = (event: Event) => {
    const target = event.target;
    if (target instanceof HTMLInputElement && target.classList.contains("ayy-transfer-list__filter")) {
      sync();
    }
  };

  const onClick = (event: MouseEvent) => {
    const btn = (event.target as Element | null)?.closest?.<HTMLButtonElement>(".ayy-transfer-list__actions [data-action]");
    if (!btn || btn.disabled) return;
    const action = btn.dataset.action;
    const source = syncPane("source");
    const target = syncPane("target");
    if (action === "add") transfer(source.checkedIds, "to-target");
    else if (action === "add-all") transfer(source.enabledVisibleIds, "to-target");
    else if (action === "remove") transfer(target.checkedIds, "to-source");
    else if (action === "remove-all") transfer(target.enabledVisibleIds, "to-source");
  };

  const onDblClick = (event: MouseEvent) => {
    const item = (event.target as Element | null)?.closest?.<HTMLElement>(".ayy-transfer-list__item");
    if (!item) return;
    const cb = inputOf(item);
    if (!cb || cb.disabled) return;
    const pane = item.closest<HTMLElement>(".ayy-transfer-list__pane");
    const which = pane?.dataset.pane;
    const id = valueOf(item);
    if (!id || (which !== "source" && which !== "target")) return;
    transfer([id], which === "source" ? "to-target" : "to-source");
  };

  const onKeyDown = (event: KeyboardEvent) => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement) || target.type !== "checkbox") return;
    const list = target.closest<HTMLElement>(".ayy-transfer-list__list");
    if (!list) return;
    const boxes = Array.from(list.querySelectorAll<HTMLElement>(".ayy-transfer-list__item"))
      .filter((item) => !item.hidden)
      .map(inputOf)
      .filter((cb): cb is HTMLInputElement => Boolean(cb && !cb.disabled));
    const index = boxes.indexOf(target);
    if (index < 0) return;

    let next = -1;
    if (event.key === "ArrowDown") next = Math.min(index + 1, boxes.length - 1);
    else if (event.key === "ArrowUp") next = Math.max(index - 1, 0);
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = boxes.length - 1;
    if (next >= 0 && next !== index) {
      event.preventDefault();
      boxes[next].focus();
    }
  };

  root.addEventListener("change", onChange);
  root.addEventListener("input", onInput);
  root.addEventListener("click", onClick);
  root.addEventListener("dblclick", onDblClick);
  root.addEventListener("keydown", onKeyDown);
  sync();

  return {
    sync,
    destroy() {
      root.removeEventListener("change", onChange);
      root.removeEventListener("input", onInput);
      root.removeEventListener("click", onClick);
      root.removeEventListener("dblclick", onDblClick);
      root.removeEventListener("keydown", onKeyDown);
    },
  };
}
