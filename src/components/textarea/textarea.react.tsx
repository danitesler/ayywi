import { forwardRef, type TextareaHTMLAttributes } from "react";
import { textareaClass } from "./textarea";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  autosize?: boolean;
  mono?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { autosize, mono, className, ...props },
  ref,
) {
  return <textarea ref={ref} className={textareaClass({ autosize, mono, className })} {...props} />;
});
