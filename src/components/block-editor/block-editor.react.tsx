import { forwardRef, useEffect, useRef, type HTMLAttributes } from "react";
import { mergeRefs } from "../../lib/refs";
import {
  blockEditorClass,
  connectBlockEditor,
  type BlockEditorBlock,
  type BlockEditorController,
  type BlockEditorMention,
  type BlockEditorMentionSource,
} from "./block-editor";

export interface BlockEditorProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue" | "children"> {
  /** The document, controlled. Pass back what onChange gives you; a different array replaces the document. */
  value?: BlockEditorBlock[];
  /** The document to start with, uncontrolled. */
  defaultValue?: BlockEditorBlock[];
  /** Called after every change with the whole document. */
  onChange?: (value: BlockEditorBlock[]) => void;
  /** Shown while the document is empty. */
  placeholder?: string;
  /** Show the document without editing it. */
  readOnly?: boolean;
  /** Inline mention lists, one per trigger character ("@" for people, "#" for issues). */
  mentions?: BlockEditorMentionSource[];
  /** Store a pasted, dropped or picked file and return its URL. Default: a data: URL. */
  upload?: (file: File) => string | Promise<string>;
  /** Turn an equation block's TeX into HTML. Without it, the TeX shows as typed. */
  renderMath?: (tex: string) => string;
  /** Called when a mention chip is clicked. */
  onMentionClick?: (mention: BlockEditorMention, event: MouseEvent) => void;
  /** Keep the drag handles inside the editor's own box, for containers with no padding to hang them in. */
  inset?: boolean;
}

/** A Notion-style block editor. Behaviour comes from connectBlockEditor(); the editor owns the DOM inside this element. */
export const BlockEditor = /* @__PURE__ */ forwardRef<HTMLDivElement, BlockEditorProps>(function BlockEditor(
  { value, defaultValue, onChange, placeholder, readOnly, mentions, upload, renderMath, onMentionClick, inset, className, "aria-label": ariaLabel, ...props },
  ref,
) {
  const rootRef = useRef<HTMLDivElement>(null);
  const controller = useRef<BlockEditorController | null>(null);
  const emitted = useRef<BlockEditorBlock[] | undefined>(undefined);
  const latest = useRef({ onChange, onMentionClick, upload, renderMath });
  latest.current = { onChange, onMentionClick, upload, renderMath };
  const uploadVia = upload ? (file: File) => latest.current.upload!(file) : undefined;
  const renderMathVia = renderMath ? (tex: string) => latest.current.renderMath!(tex) : undefined;

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const c = connectBlockEditor(root, {
      value: value ?? defaultValue,
      placeholder,
      label: ariaLabel,
      readOnly,
      mentions,
      upload: uploadVia,
      renderMath: renderMathVia,
      onChange: (next) => {
        emitted.current = next;
        latest.current.onChange?.(next);
      },
      onMentionClick: (mention, event) => latest.current.onMentionClick?.(mention, event),
    });
    controller.current = c;
    return () => {
      c.destroy();
      controller.current = null;
    };
    // The editor reads the starting value once; later changes arrive through the effects below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    controller.current?.setOptions({ placeholder, label: ariaLabel, readOnly, mentions, upload: uploadVia, renderMath: renderMathVia });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [placeholder, ariaLabel, readOnly, mentions, !!upload, !!renderMath]);

  useEffect(() => {
    if (value && value !== emitted.current) controller.current?.setValue(value);
  }, [value]);

  return <div ref={mergeRefs(ref, rootRef)} className={blockEditorClass({ inset, className })} {...props} />;
});
