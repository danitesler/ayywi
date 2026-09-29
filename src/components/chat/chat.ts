import { cx } from "../../lib/cx";

export const chatDirections = ["in", "out"] as const;
export type ChatDirection = (typeof chatDirections)[number];

export interface ChatMessageClassOptions {
  /** "out" = sent by the reader: end edge, inverted colours. */
  direction?: ChatDirection;
  className?: string;
}

export function chatMessageClass({ direction = "in", className }: ChatMessageClassOptions = {}): string {
  return cx("ayy-chat__message", direction === "out" && "ayy-chat__message--out", className);
}

export const chatClass = "ayy-chat";
export const chatBubbleClass = "ayy-chat__bubble";
export const chatTypingClass = "ayy-chat__typing";
export const chatRepliesClass = "ayy-chat__replies";
