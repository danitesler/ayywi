import { cx } from "../../lib/cx";
import { Copy01Icon, Tick02Icon } from "../../lib/icons";
import { iconSvg } from "../icon/icon";

export interface CodeBlockClassOptions {
  /** Line numbers using CSS counters. */
  numbered?: boolean;
  className?: string;
}

export function codeBlockClass({ numbered, className }: CodeBlockClassOptions = {}): string {
  return cx("ayy-code-block", numbered && "ayy-code-block--numbered", className);
}

export type ClassOptionsOrString = string | { className?: string };

function toClassName(options?: ClassOptionsOrString): string | undefined {
  if (typeof options === "string") return options;
  return options?.className;
}

export function codeBlockHeaderClass(options?: ClassOptionsOrString): string {
  return cx("ayy-code-block__header", toClassName(options));
}

export function codeBlockFilenameClass(options?: ClassOptionsOrString): string {
  return cx("ayy-code-block__filename", toClassName(options));
}

export function codeBlockCopyClass(options?: ClassOptionsOrString): string {
  return cx("ayy-code-block__copy", toClassName(options));
}

export function codeBlockPreClass(options?: ClassOptionsOrString): string {
  return cx("ayy-code-block__pre", toClassName(options));
}

export function codeBlockCodeClass(options?: ClassOptionsOrString): string {
  return cx("ayy-code-block__code", toClassName(options));
}

export const tokenKeywordClass = "ayy-token-keyword";
export const tokenStringClass = "ayy-token-string";
export const tokenCommentClass = "ayy-token-comment";
export const tokenFunctionClass = "ayy-token-function";
export const tokenNumberClass = "ayy-token-number";
export const tokenOperatorClass = "ayy-token-operator";

export const codeBlockCopyIcon = /* @__PURE__ */ iconSvg(Copy01Icon);
export const codeBlockCheckIcon = /* @__PURE__ */ iconSvg(Tick02Icon);

const copyTimers = new WeakMap<Element, ReturnType<typeof setTimeout>>();

/** Copy the code inside a .ayy-code-block from its .ayy-code-block__copy button, showing the copied state for `timeout` ms. */
export async function copyCodeBlock(
  button: Element,
  {
    code,
    timeout = 2000,
    label,
    copiedLabel = "Copied!",
  }: { code?: string; timeout?: number; label?: string; copiedLabel?: string } = {},
): Promise<string | undefined> {
  const text =
    code ??
    button.getAttribute("data-code") ??
    button.closest(".ayy-code-block")?.querySelector(".ayy-code-block__code, code")?.textContent ??
    undefined;
  if (text === undefined) return undefined;
  try {
    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
    }
  } catch {
    // Clipboard access may fail in insecure contexts; still show visual feedback.
  }
  const initialLabel = label ?? button.getAttribute("data-label") ?? button.getAttribute("aria-label") ?? "Copy code";
  button.setAttribute("data-label", initialLabel);
  button.setAttribute("data-copied", "true");
  button.setAttribute("aria-label", copiedLabel);
  button.innerHTML = codeBlockCheckIcon;
  const prev = copyTimers.get(button);
  if (prev) clearTimeout(prev);
  copyTimers.set(
    button,
    setTimeout(() => {
      button.removeAttribute("data-copied");
      button.setAttribute("aria-label", initialLabel);
      button.innerHTML = codeBlockCopyIcon;
      copyTimers.delete(button);
    }, timeout),
  );
  return text;
}
