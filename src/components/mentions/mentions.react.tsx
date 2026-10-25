import { forwardRef, useEffect, useId, useRef, type ReactNode, type TextareaHTMLAttributes } from "react";
import { mergeRefs } from "../../lib/refs";
import {
  connectMentions,
  mentionsAnchorClass,
  mentionsBodyClass,
  mentionsClass,
  mentionsHandleClass,
  mentionsLabelClass,
  mentionsListboxClass,
  mentionsOptionClass,
  mentionsTextareaClass,
  type MentionInsertDetail,
  type MentionsController,
} from "./mentions";

export interface MentionOption {
  /** Unique identifier; also inserted after the trigger unless `value` overrides it. */
  id: string;
  /** Primary display name in the suggestions list. */
  label: string;
  /** Token inserted after the trigger (defaults to `id`). */
  value?: string;
  /** Which trigger character shows this option when multiple triggers are configured (defaults to the first trigger). */
  trigger?: string;
  /** Optional leading Avatar or Icon. */
  icon?: ReactNode;
  /** Extra search terms matched while filtering. */
  keywords?: string;
  disabled?: boolean;
}

export interface MentionsProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Suggestions offered when a trigger character is typed. */
  options: MentionOption[];
  /** Trigger characters that open the suggestions list. Default `["@"]`. */
  triggers?: string[];
  /** Convenience string callback fired whenever the textarea value changes (including mention insertions). */
  onValueChange?: (value: string) => void;
  /** Fired when a mention option is picked and inserted. */
  onMention?: (option: MentionOption, detail: MentionInsertDetail) => void;
  /** Grow the textarea vertically with its content. */
  autosize?: boolean;
  /** Monospace font. */
  mono?: boolean;
  /** Class on the outer `.ayy-mentions` wrapper. */
  className?: string;
}

/** Multi-line textarea with inline `@` (or `#`) autocomplete suggestions positioned at the caret. */
export const Mentions = forwardRef<HTMLTextAreaElement, MentionsProps>(function Mentions(
  {
    options,
    triggers = ["@"],
    onValueChange,
    onMention,
    autosize,
    mono,
    className,
    onChange,
    ...props
  },
  ref,
) {
  const rootRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const controllerRef = useRef<MentionsController | null>(null);
  const listId = useId();
  const triggersKey = triggers.join(" ");
  const latest = useRef({ options, onMention, onValueChange });
  latest.current = { options, onMention, onValueChange };

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const parsedTriggers = triggersKey.split(" ").filter(Boolean);
    const ctrl = connectMentions(root, {
      triggers: parsedTriggers.length ? parsedTriggers : ["@"],
      onMention: (detail) => {
        const matched = latest.current.options.find(
          (o) => (o.value ?? o.id) === detail.value && (o.trigger ?? (parsedTriggers[0] || "@")) === detail.trigger,
        );
        if (matched) latest.current.onMention?.(matched, detail);
      },
    });
    controllerRef.current = ctrl;
    return () => {
      ctrl.destroy();
      controllerRef.current = null;
    };
  }, [triggersKey]);

  useEffect(() => {
    controllerRef.current?.refresh();
  }, [options]);

  return (
    <div ref={rootRef} className={mentionsClass({ className })}>
      <textarea
        ref={mergeRefs(ref, textareaRef)}
        aria-autocomplete="list"
        aria-controls={listId}
        className={mentionsTextareaClass({ autosize, mono })}
        onChange={(event) => {
          onChange?.(event);
          latest.current.onValueChange?.(event.target.value);
        }}
        {...props}
      />
      <span className={mentionsAnchorClass} aria-hidden="true" />
      <ul id={listId} role="listbox" aria-label="Suggestions" popover="manual" className={mentionsListboxClass}>
        {options.map((opt) => {
          const trig = opt.trigger ?? triggers[0] ?? "@";
          const token = opt.value ?? opt.id;
          return (
            <li
              key={`${trig}:${opt.id}`}
              role="option"
              className={mentionsOptionClass}
              data-value={token}
              data-label={opt.label}
              data-trigger={trig}
              data-keywords={opt.keywords}
              aria-selected={false}
              aria-disabled={opt.disabled || undefined}
            >
              {opt.icon}
              <span className={mentionsBodyClass}>
                <span className={mentionsLabelClass}>{opt.label}</span>
                <span className={mentionsHandleClass}>
                  {trig}
                  {token}
                </span>
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
});
