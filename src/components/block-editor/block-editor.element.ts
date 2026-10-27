import { ElementBase, emit } from "../../lib/element";
import { connectBlockEditor, type BlockEditorBlock, type BlockEditorController, type BlockEditorMentionSource, type BlockEditorOptions } from "./block-editor";

/**
 * <ayy-block-editor [placeholder] [label] [readonly]> — turns the .ayy-block-editor inside it into a block editor. The
 * blocks to start with are the ones written inside it (or a <script type="application/json"> value), mention lists a
 * <script type="application/json" data-mentions> child of the element. Fires "ayy-change" ({ value }) after every
 * change and "ayy-mention-click" ({ trigger, id, label }). Properties: value, mentions, upload, renderMath.
 */
export class AyyBlockEditorElement extends ElementBase {
  static observedAttributes = ["placeholder", "label", "readonly"];

  #controller: BlockEditorController | null = null;
  #value: BlockEditorBlock[] | undefined;
  #mentions: BlockEditorMentionSource[] | undefined;
  #upload: BlockEditorOptions["upload"];
  #renderMath: BlockEditorOptions["renderMath"];

  connectedCallback(): void {
    if (this.#controller) return;
    const root = this.querySelector<HTMLElement>(".ayy-block-editor") ?? this;
    this.#mentions ??= this.#readMentions();
    this.#controller = connectBlockEditor(root, {
      ...this.#attributes(),
      value: this.#value,
      mentions: this.#mentions,
      upload: this.#upload,
      renderMath: this.#renderMath,
      onChange: (value) => emit(this, "ayy-change", { value }),
      onMentionClick: (mention) => emit(this, "ayy-mention-click", mention),
    });
  }

  disconnectedCallback(): void {
    this.#controller?.destroy();
    this.#controller = null;
  }

  attributeChangedCallback(): void {
    this.#controller?.setOptions(this.#attributes());
  }

  get value(): BlockEditorBlock[] {
    return this.#controller?.getValue() ?? this.#value ?? [];
  }

  set value(value: BlockEditorBlock[]) {
    this.#value = value;
    this.#controller?.setValue(value);
  }

  get mentions(): BlockEditorMentionSource[] {
    return this.#mentions ?? [];
  }

  set mentions(mentions: BlockEditorMentionSource[]) {
    this.#mentions = mentions;
    this.#controller?.setOptions({ mentions });
  }

  set upload(upload: BlockEditorOptions["upload"]) {
    this.#upload = upload;
    this.#controller?.setOptions({ upload });
  }

  set renderMath(renderMath: BlockEditorOptions["renderMath"]) {
    this.#renderMath = renderMath;
    this.#controller?.setOptions({ renderMath });
  }

  focus(options?: FocusOptions): void {
    if (this.#controller) this.#controller.focus();
    else super.focus(options);
  }

  #attributes(): Pick<BlockEditorOptions, "placeholder" | "label" | "readOnly"> {
    return {
      placeholder: this.getAttribute("placeholder") ?? undefined,
      label: this.getAttribute("label") ?? undefined,
      readOnly: this.hasAttribute("readonly"),
    };
  }

  #readMentions(): BlockEditorMentionSource[] | undefined {
    const script = this.querySelector<HTMLScriptElement>(":scope > script[type='application/json'][data-mentions]");
    if (!script) return undefined;
    try {
      const parsed = JSON.parse(script.textContent ?? "[]");
      return Array.isArray(parsed) ? parsed : undefined;
    } catch {
      return undefined;
    }
  }
}
