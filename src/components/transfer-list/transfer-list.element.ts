import { ElementBase, emit } from "../../lib/element";
import { connectTransferList, type TransferDirection, type TransferListController } from "./transfer-list";

/**
 * <ayy-transfer-list [name]> — wires an .ayy-transfer-list in plain HTML: moves checked .ayy-transfer-list__item rows
 * between `[data-pane="source"]` and `[data-pane="target"]`, keeps select-all mixed states, counts and empty states in
 * step, syncs hidden form inputs when `name` is set, and fires "ayy-change" (`{ value: string[] }`).
 */
export class AyyTransferListElement extends ElementBase {
  static observedAttributes = ["name"];

  #controller: TransferListController | null = null;
  #root: HTMLElement | null = null;

  connectedCallback(): void {
    const root = this.querySelector<HTMLElement>(".ayy-transfer-list") ?? this;
    this.#root = root;
    this.#controller = connectTransferList(root, {
      onTransfer: (ids, direction) => this.#move(ids, direction),
    });
    this.#syncHidden();
  }

  disconnectedCallback(): void {
    this.#controller?.destroy();
    this.#controller = null;
    this.#root = null;
  }

  attributeChangedCallback(): void {
    if (this.isConnected) this.#syncHidden();
  }

  get value(): string[] {
    const targetList = this.#root?.querySelector<HTMLElement>('.ayy-transfer-list__pane[data-pane="target"] .ayy-transfer-list__list');
    if (!targetList) return [];
    return Array.from(targetList.querySelectorAll<HTMLElement>(".ayy-transfer-list__item"))
      .map((item) => item.dataset.value ?? item.querySelector<HTMLInputElement>('input[type="checkbox"]')?.value ?? "")
      .filter(Boolean);
  }

  #move(ids: string[], direction: TransferDirection): void {
    const root = this.#root;
    if (!root) return;
    const fromKey = direction === "to-target" ? "source" : "target";
    const toKey = direction === "to-target" ? "target" : "source";
    const fromList = root.querySelector<HTMLElement>(`.ayy-transfer-list__pane[data-pane="${fromKey}"] .ayy-transfer-list__list`);
    const toList = root.querySelector<HTMLElement>(`.ayy-transfer-list__pane[data-pane="${toKey}"] .ayy-transfer-list__list`);
    if (!fromList || !toList) return;

    const idSet = new Set(ids);
    const empty = toList.querySelector<HTMLElement>(".ayy-transfer-list__empty");
    for (const item of Array.from(fromList.querySelectorAll<HTMLElement>(".ayy-transfer-list__item"))) {
      const id = item.dataset.value ?? item.querySelector<HTMLInputElement>('input[type="checkbox"]')?.value ?? "";
      if (idSet.has(id)) {
        item.hidden = false;
        if (empty) toList.insertBefore(item, empty);
        else toList.append(item);
      }
    }
    this.#controller?.sync();
    this.#syncHidden();
    emit(this, "ayy-change", { value: this.value });
  }

  #syncHidden(): void {
    const root = this.#root;
    if (!root) return;
    for (const old of root.querySelectorAll('input[type="hidden"][data-transfer-value]')) old.remove();
    const name = this.getAttribute("name");
    if (!name) return;
    for (const val of this.value) {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = name;
      input.value = val;
      input.dataset.transferValue = "";
      root.append(input);
    }
  }
}
