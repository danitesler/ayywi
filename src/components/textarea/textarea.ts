import { cx } from "../../lib/cx";

export interface TextareaClassOptions {
  /** Grow with content (CSS field-sizing; progressive enhancement). */
  autosize?: boolean;
  /** Monospace, for code, prompts and config. */
  mono?: boolean;
  className?: string;
}

export function textareaClass({ autosize, mono, className }: TextareaClassOptions = {}): string {
  return cx("ayy-textarea", autosize && "ayy-textarea--autosize", mono && "ayy-textarea--mono", className);
}
