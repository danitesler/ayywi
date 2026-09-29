import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cx } from "../../lib/cx";
import { chatBubbleClass, chatClass, chatMessageClass, chatRepliesClass, chatTypingClass, type ChatDirection } from "./chat";

/** role="log": new messages are announced politely. Pass role={undefined} for a static transcript. */
export const Chat = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(function Chat({ className, ...props }, ref) {
  return <div ref={ref} role="log" className={cx(chatClass, className)} {...props} />;
});

export interface ChatMessageProps extends HTMLAttributes<HTMLDivElement> {
  /** "out" = sent by the reader. Default "in". */
  direction?: ChatDirection;
  /** Avatar beside the bubble, usually only on incoming messages. */
  avatar?: ReactNode;
}

export const ChatMessage = forwardRef<HTMLDivElement, ChatMessageProps>(function ChatMessage(
  { direction, avatar, className, children, ...props },
  ref,
) {
  return (
    <div ref={ref} className={chatMessageClass({ direction, className })} {...props}>
      {avatar}
      <div className={chatBubbleClass}>{children}</div>
    </div>
  );
});

export interface ChatTypingProps extends HTMLAttributes<HTMLDivElement> {
  /** What screen readers hear. Default "Typing". */
  label?: string;
  avatar?: ReactNode;
}

export const ChatTyping = forwardRef<HTMLDivElement, ChatTypingProps>(function ChatTyping(
  { label = "Typing", avatar, className, ...props },
  ref,
) {
  return (
    <div ref={ref} className={chatMessageClass({ className })} {...props}>
      {avatar}
      <div className={chatBubbleClass}>
        <span className={chatTypingClass} role="img" aria-label={label}>
          <span />
          <span />
          <span />
        </span>
      </div>
    </div>
  );
});

export const ChatReplies = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(function ChatReplies(
  { className, ...props },
  ref,
) {
  return <div ref={ref} className={cx(chatRepliesClass, className)} {...props} />;
});
