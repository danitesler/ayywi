import { ElementBase, emit } from "../../lib/element";
import { comboboxOptionLabel } from "../combobox/combobox";
import { connectRecordPicker, recordPickerChip, type RecordPickerController } from "./record-picker";

interface PickedRecord {
  id: string;
  label: string;
}

/**
 * <ayy-record-picker [multiple] [creatable] [manual] [name]> — wraps an .ayy-record-picker: type to filter, arrows move
 * the active record, Enter picks it (or creates from the typed text), Backspace in the empty field removes the last
 * chip, the clear button empties the field and a chip's × removes it. It draws the chips with recordPickerChip, keeps
 * aria-selected on the options and one hidden input per picked id when name is set, and fires "ayy-change"
 * ({ ids, options }). A created record gets a slug id (may-2 on collision) and a chip; replace the id from "ayy-create"
 * ({ id, label }). refresh() re-reads options a manual search replaced.
 */
export class AyyRecordPickerElement extends ElementBase {
  #controller: RecordPickerController | null = null;
  #root: HTMLElement | null = null;
  #name: string | null = null;

  connectedCallback(): void {
    const root = this.querySelector<HTMLElement>(".ayy-record-picker");
    if (!root) return;
    this.#root = root;
    this.#name = this.getAttribute("name");
    this.#controller = connectRecordPicker(root, {
      multiple: this.hasAttribute("multiple"),
      creatable: this.hasAttribute("creatable"),
      filter: !this.hasAttribute("manual"),
      onSelect: (option) => this.#select(option),
      onCreate: (label) => this.#create(label),
      onRemoveLast: () => this.#removeLast(),
      onClear: () => this.#clear(),
    });
    this.addEventListener("click", this.#onClick);
    this.#sync();
  }

  disconnectedCallback(): void {
    this.removeEventListener("click", this.#onClick);
    this.#controller?.destroy();
    this.#controller = null;
    this.#root = null;
  }

  /** Re-read the options after a manual search replaced them. */
  refresh(): void {
    this.#controller?.refresh();
  }

  #chips(): HTMLElement[] {
    return Array.from(this.querySelectorAll<HTMLElement>(".ayy-record-picker__tag"));
  }

  #options(): HTMLElement[] {
    return Array.from(this.querySelectorAll<HTMLElement>(".ayy-record-picker__option"));
  }

  #input(): HTMLInputElement | null {
    return this.#root?.querySelector<HTMLInputElement>(".ayy-record-picker__input") ?? null;
  }

  #picked(): PickedRecord[] {
    return this.#chips().map((chip) => ({ id: chip.dataset.value ?? "", label: chip.textContent?.trim() ?? "" }));
  }

  /** The chips, the options' aria-selected and the form's hidden inputs, from the picked records. */
  #sync(): void {
    const root = this.#root;
    if (!root) return;
    const ids = new Set(this.#picked().map((record) => record.id));
    for (const option of this.#options()) option.setAttribute("aria-selected", String(ids.has(option.dataset.value ?? "")));
    if (this.#name) {
      for (const hidden of root.querySelectorAll('input[type="hidden"][data-record]')) hidden.remove();
      for (const id of ids) {
        const hidden = document.createElement("input");
        hidden.type = "hidden";
        hidden.name = this.#name;
        hidden.value = id;
        hidden.dataset.record = "";
        root.append(hidden);
      }
    }
  }

  #render(next: PickedRecord[]): void {
    const input = this.#input();
    for (const chip of this.#chips()) chip.remove();
    for (const record of next) input?.before(recordPickerChip(record));
    this.#sync();
    input?.focus();
  }

  #change(): void {
    const picked = this.#picked();
    emit(this, "ayy-change", { ids: picked.map((record) => record.id), options: picked });
  }

  #select(option: HTMLElement): void {
    const id = option.dataset.value ?? comboboxOptionLabel(option);
    const label = comboboxOptionLabel(option) || id;
    const picked = this.#picked();
    const pickedAlready = picked.some((record) => record.id === id);
    if (this.hasAttribute("multiple")) {
      this.#render(pickedAlready ? picked.filter((record) => record.id !== id) : [...picked, { id, label }]);
    } else {
      if (pickedAlready) {
        this.#input()?.focus();
        return;
      }
      this.#render([{ id, label }]);
    }
    this.#change();
  }

  #create(label: string): void {
    const record = { id: this.#uniqueId(label), label };
    const picked = this.#picked();
    this.#render(this.hasAttribute("multiple") ? [...picked, record] : [record]);
    emit(this, "ayy-create", { id: record.id, label });
    this.#change();
  }

  #removeLast(): void {
    const picked = this.#picked();
    if (!picked.length) return;
    this.#render(picked.slice(0, -1));
    this.#change();
  }

  #clear(): void {
    if (!this.#picked().length) return;
    this.#render([]);
    this.#change();
  }

  /** A record's id from its label: lower-case, non-alphanumerics as -, and -2, -3… when it is taken. */
  #uniqueId(label: string): string {
    const base = label.toLocaleLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "record";
    const taken = new Set([...this.#options().map((option) => option.dataset.value ?? ""), ...this.#picked().map((record) => record.id)]);
    if (!taken.has(base)) return base;
    let suffix = 2;
    while (taken.has(`${base}-${suffix}`)) suffix++;
    return `${base}-${suffix}`;
  }

  /** A chip's × removes that record; the controller owns the clear button and the list. */
  #onClick = (event: MouseEvent): void => {
    const button = (event.target as Element | null)?.closest(".ayy-chip__remove");
    if (!button || !this.contains(button)) return;
    const chip = button.closest<HTMLElement>(".ayy-record-picker__tag");
    if (!chip || chip.closest("ayy-record-picker") !== this) return;
    const index = this.#chips().indexOf(chip);
    if (index < 0) return;
    const picked = this.#picked().filter((_, i) => i !== index);
    this.#render(picked);
    this.#change();
  };
}
