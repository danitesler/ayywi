import { cx } from "../../lib/cx";

export const textareaSizes = ["sm", "md", "lg"] as const;
export type TextareaSize = (typeof textareaSizes)[number];

export interface TextareaClassOptions {
  size?: TextareaSize;
  /** Grow with content (CSS field-sizing; progressive enhancement). */
  autosize?: boolean;
  /** Monospace, for code, prompts and config. */
  mono?: boolean;
  className?: string;
}

export function textareaClass({ size = "md", autosize, mono, className }: TextareaClassOptions = {}): string {
  return cx("ayy-textarea", size !== "md" && `ayy-textarea--${size}`, autosize && "ayy-textarea--autosize", mono && "ayy-textarea--mono", className);
}
