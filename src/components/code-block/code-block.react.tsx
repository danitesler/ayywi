import {
  forwardRef,
  Fragment,
  useEffect,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from "react";
import { ArrowDown01Icon, Copy01Icon, Tick02Icon } from "../../lib/icons";
import { Icon } from "../icon/icon.react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "../menu/menu.react";
import {
  codeBlockActionsClass,
  codeBlockChevronClass,
  codeBlockClass,
  codeBlockCodeClass,
  codeBlockCopyClass,
  codeBlockFilenameClass,
  codeBlockHeaderClass,
  codeBlockMenuClass,
  codeBlockPreClass,
  codeBlockSelectorClass,
  SUPPORTED_LANGUAGES,
  type LanguagePreset,
  tokenizeCode,
  tokenKeywordClass,
  tokenStringClass,
  tokenCommentClass,
  tokenFunctionClass,
  tokenNumberClass,
  tokenOperatorClass,
  tokenTagClass,
  tokenAttributeClass,
  tokenPropertyClass,
  tokenPunctuationClass,
  tokenBooleanClass,
} from "./code-block";

export interface CodeBlockProps extends HTMLAttributes<HTMLDivElement> {
  /** Display line numbers with CSS counters. */
  numbered?: boolean;
}

export const CodeBlock = /* @__PURE__ */ forwardRef<HTMLDivElement, CodeBlockProps>(function CodeBlock(
  { numbered, className, children, ...props },
  ref,
) {
  return (
    <div ref={ref} className={codeBlockClass({ numbered, className })} {...props}>
      {children}
    </div>
  );
});

export interface CodeBlockHeaderProps extends HTMLAttributes<HTMLDivElement> {}

export const CodeBlockHeader = /* @__PURE__ */ forwardRef<HTMLDivElement, CodeBlockHeaderProps>(function CodeBlockHeader(
  { className, children, ...props },
  ref,
) {
  return (
    <div ref={ref} className={codeBlockHeaderClass(className)} {...props}>
      {children}
    </div>
  );
});

export interface CodeBlockFilenameProps extends HTMLAttributes<HTMLSpanElement> {}

export const CodeBlockFilename = /* @__PURE__ */ forwardRef<HTMLSpanElement, CodeBlockFilenameProps>(function CodeBlockFilename(
  { className, children, ...props },
  ref,
) {
  return (
    <span ref={ref} className={codeBlockFilenameClass(className)} {...props}>
      {children}
    </span>
  );
});

export interface CodeBlockActionsProps extends HTMLAttributes<HTMLDivElement> {}

export const CodeBlockActions = /* @__PURE__ */ forwardRef<HTMLDivElement, CodeBlockActionsProps>(function CodeBlockActions(
  { className, children, ...props },
  ref,
) {
  return (
    <div ref={ref} className={codeBlockActionsClass(className)} {...props}>
      {children}
    </div>
  );
});

export interface CodeBlockSelectorProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "value" | "onChange"> {
  /** Language ID to select. */
  value?: string;
  /** Initial language ID when uncontrolled. */
  defaultValue?: string;
  /** Callback fired when a language is selected. */
  onValueChange?: (value: string) => void;
  /** Change event handler for compatibility. */
  onChange?: (event: { target: { value: string } }) => void;
  /** Optional array of languages to populate options; defaults to SUPPORTED_LANGUAGES. */
  languages?: LanguagePreset[];
  /** Whether the selector trigger is disabled. */
  disabled?: boolean;
}

export const CodeBlockSelector = /* @__PURE__ */ forwardRef<HTMLButtonElement, CodeBlockSelectorProps>(function CodeBlockSelector(
  {
    value: controlledValue,
    defaultValue = "tsx",
    onValueChange,
    onChange,
    languages,
    className,
    "aria-label": ariaLabel = "Select language",
    disabled,
    children,
    ...props
  },
  ref,
) {
  const [uncontrolled, setUncontrolled] = useState(defaultValue);
  const value = controlledValue !== undefined ? controlledValue : uncontrolled;

  const items = languages ?? SUPPORTED_LANGUAGES;
  const current = items.find((l) => l.id === value);
  const displayLabel = current ? current.label : value;

  const handleSelect = (nextValue: string) => {
    if (controlledValue === undefined) {
      setUncontrolled(nextValue);
    }
    onValueChange?.(nextValue);
    onChange?.({ target: { value: nextValue } });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          ref={ref}
          type="button"
          className={codeBlockSelectorClass(className)}
          aria-label={ariaLabel}
          disabled={disabled}
          {...props}
        >
          <span>{displayLabel}</span>
          <Icon icon={ArrowDown01Icon} name="chevron-down" className={codeBlockChevronClass()} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className={codeBlockMenuClass()}>
        <DropdownMenuRadioGroup
          value={value}
          onValueChange={handleSelect}
          closeOnSelect={true}
        >
          {children ??
            items.map((preset) => (
              <DropdownMenuRadioItem key={preset.id} value={preset.id}>
                {preset.label}
              </DropdownMenuRadioItem>
            ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
});

export interface CodeBlockCopyProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onCopy"> {
  /** The code string to copy. If omitted, copies text from the nearest code element. */
  code?: string;
  /** Duration in milliseconds to show the copied state. Default is 2000. */
  timeout?: number;
  /** Callback fired after successful copying. */
  onCopy?: (code: string) => void;
  /** Accessible label and tooltip before copy. Default is "Copy code". */
  label?: string;
  /** Accessible label and tooltip after copy. Default is "Copied!". */
  copiedLabel?: string;
}

export const CodeBlockCopy = /* @__PURE__ */ forwardRef<HTMLButtonElement, CodeBlockCopyProps>(function CodeBlockCopy(
  {
    code,
    timeout = 2000,
    onCopy,
    label = "Copy code",
    copiedLabel = "Copied!",
    className,
    onClick,
    children,
    ...props
  },
  ref,
) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleCopy = async (e: MouseEvent<HTMLButtonElement>) => {
    onClick?.(e);
    if (e.defaultPrevented) return;
    e.preventDefault();

    let textToCopy = code;
    if (textToCopy === undefined) {
      const container = e.currentTarget.closest(".ayy-code-block");
      const codeElement = container?.querySelector(".ayy-code-block__code, code");
      if (codeElement) {
        textToCopy = codeElement.textContent ?? "";
      }
    }

    if (textToCopy !== undefined) {
      try {
        if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(textToCopy);
        }
      } catch {
        // Fallback or ignore clipboard errors
      }
      setCopied(true);
      onCopy?.(textToCopy);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setCopied(false);
      }, timeout);
    }
  };

  return (
    <button
      ref={ref}
      type="button"
      className={codeBlockCopyClass(className)}
      aria-label={copied ? copiedLabel : label}
      data-copied={copied ? "true" : undefined}
      onClick={handleCopy}
      {...props}
    >
      {children ?? <Icon icon={copied ? Tick02Icon : Copy01Icon} name={copied ? "check" : "copy"} />}
    </button>
  );
});

export interface CodeBlockPreProps extends HTMLAttributes<HTMLPreElement> {}

export const CodeBlockPre = /* @__PURE__ */ forwardRef<HTMLPreElement, CodeBlockPreProps>(function CodeBlockPre(
  { className, children, ...props },
  ref,
) {
  return (
    <pre ref={ref} className={codeBlockPreClass(className)} {...props}>
      {children}
    </pre>
  );
});

export interface CodeBlockCodeProps extends HTMLAttributes<HTMLElement> {
  /** Language name or file extension for syntax highlighting (e.g. tsx, html, css, json, bash, md, python). */
  language?: string;
  /** Code content to highlight and display. If omitted, renders children. */
  code?: string;
}

const TOKEN_CLASSES: Record<string, string | undefined> = {
  keyword: tokenKeywordClass,
  string: tokenStringClass,
  comment: tokenCommentClass,
  function: tokenFunctionClass,
  number: tokenNumberClass,
  operator: tokenOperatorClass,
  tag: tokenTagClass,
  attribute: tokenAttributeClass,
  property: tokenPropertyClass,
  punctuation: tokenPunctuationClass,
  boolean: tokenBooleanClass,
};

export const CodeBlockCode = /* @__PURE__ */ forwardRef<HTMLElement, CodeBlockCodeProps>(function CodeBlockCode(
  { language, code, className, children, ...props },
  ref,
) {
  const content = code !== undefined ? code : typeof children === "string" ? children : undefined;

  let body = children;
  if (content !== undefined && language) {
    const tokens = tokenizeCode(content, language);
    const lines: ReactNode[][] = [[]];
    for (const token of tokens) {
      const cls = TOKEN_CLASSES[token.type];
      const parts = token.value.split("\n");
      for (let i = 0; i < parts.length; i++) {
        if (i > 0) {
          lines.push([]);
        }
        if (parts[i]) {
          lines[lines.length - 1].push(
            cls ? (
              <span key={`${lines.length - 1}-${lines[lines.length - 1].length}`} className={cls}>
                {parts[i]}
              </span>
            ) : (
              parts[i]
            ),
          );
        }
      }
    }
    body = (
      <>
        {lines.map((lineTokens, index) => (
          <Fragment key={index}>
            <span className="ayy-code-block__line">{lineTokens}</span>
            {index < lines.length - 1 ? "\n" : null}
          </Fragment>
        ))}
      </>
    );
  } else if (code !== undefined) {
    body = code;
  }

  return (
    <code ref={ref} className={codeBlockCodeClass(className)} data-language={language} {...props}>
      {body}
    </code>
  );
});

