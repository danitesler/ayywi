import { forwardRef, type TextareaHTMLAttributes } from "react";
import { textareaClass, type TextareaSize } from "./textarea";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Visual size, the same scale as Input. */
  size?: TextareaSize;
  autosize?: boolean;
  mono?: boolean;
}

export const Textarea = /* @__PURE__ */ forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { size, autosize, mono, className, ...props },
  ref,
) {
  return <textarea ref={ref} className={textareaClass({ size, autosize, mono, className })} {...props} />;
});
