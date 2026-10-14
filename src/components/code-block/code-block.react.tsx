import {
  forwardRef,
  useEffect,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type MouseEvent,
} from "react";
import { Copy01Icon, Tick02Icon } from "../../lib/icons";
import { Icon } from "../icon/icon.react";
import {
  codeBlockClass,
  codeBlockCodeClass,
  codeBlockCopyClass,
  codeBlockFilenameClass,
  codeBlockHeaderClass,
  codeBlockPreClass,
} from "./code-block";

export interface CodeBlockProps extends HTMLAttributes<HTMLDivElement> {
  /** Display line numbers with CSS counters. */
  numbered?: boolean;
}

export const CodeBlock = forwardRef<HTMLDivElement, CodeBlockProps>(function CodeBlock(
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

export const CodeBlockHeader = forwardRef<HTMLDivElement, CodeBlockHeaderProps>(function CodeBlockHeader(
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

export const CodeBlockFilename = forwardRef<HTMLSpanElement, CodeBlockFilenameProps>(function CodeBlockFilename(
  { className, children, ...props },
  ref,
) {
  return (
    <span ref={ref} className={codeBlockFilenameClass(className)} {...props}>
      {children}
    </span>
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

export const CodeBlockCopy = forwardRef<HTMLButtonElement, CodeBlockCopyProps>(function CodeBlockCopy(
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
      {children ?? <Icon icon={copied ? Tick02Icon : Copy01Icon} />}
    </button>
  );
});

export interface CodeBlockPreProps extends HTMLAttributes<HTMLPreElement> {}

export const CodeBlockPre = forwardRef<HTMLPreElement, CodeBlockPreProps>(function CodeBlockPre(
  { className, children, ...props },
  ref,
) {
  return (
    <pre ref={ref} className={codeBlockPreClass(className)} {...props}>
      {children}
    </pre>
  );
});

export interface CodeBlockCodeProps extends HTMLAttributes<HTMLElement> {}

export const CodeBlockCode = forwardRef<HTMLElement, CodeBlockCodeProps>(function CodeBlockCode(
  { className, children, ...props },
  ref,
) {
  return (
    <code ref={ref} className={codeBlockCodeClass(className)} {...props}>
      {children}
    </code>
  );
});
