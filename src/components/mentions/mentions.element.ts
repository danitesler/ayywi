import { ElementBase, emit } from "../../lib/element";
import { connectMentions, type MentionsController } from "./mentions";

/**
 * <ayy-mentions [triggers="@"]> — wires an .ayy-mentions wrapper containing a <textarea> and an .ayy-mentions__listbox
 * of [role="option"] items. Opens at the caret when a trigger character is typed and fires "ayy-mention"
 * (`{ trigger, value, label, text }`) when a suggestion is inserted.
 */
export class AyyMentionsElement extends ElementBase {
  static observedAttributes = ["triggers"];

  #controller: MentionsController | null = null;

  connectedCallback(): void {
    this.#mount();
  }

  disconnectedCallback(): void {
    this.#controller?.destroy();
    this.#controller = null;
  }

  attributeChangedCallback(): void {
    if (this.isConnected) this.#mount();
  }

  refresh(): void {
    this.#controller?.refresh();
  }

  #mount(): void {
    this.#controller?.destroy();
    const root = this.querySelector<HTMLElement>(".ayy-mentions") ?? this;
    const rawTriggers = this.getAttribute("triggers")?.trim();
    const triggers = rawTriggers ? rawTriggers.split(/\s+/).filter(Boolean) : ["@"];
    this.#controller = connectMentions(root, {
      triggers,
      onMention: (detail) => emit(this, "ayy-mention", detail),
    });
  }
}
