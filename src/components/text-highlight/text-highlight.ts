import { cx } from "../../lib/cx";

export type TextHighlightVariant = "default" | "warning" | "destructive" | "success" | "info" | "orange";

export interface TextHighlightOptions {
  variant?: TextHighlightVariant;
  className?: string;
}

export const textHighlightClass = (options: TextHighlightOptions = {}): string =>
  cx("ayy-text-highlight", options.variant && options.variant !== "default" && `ayy-text-highlight--${options.variant}`, options.className);

function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export interface TextHighlightPart {
  text: string;
  match: boolean;
}

/**
 * Splits text into matching and non-matching segments for a given search query.
 * Case-insensitive, preserves original casing of the input text, and handles multi-word queries.
 */
export function textHighlightParts(text: string, query: string): TextHighlightPart[] {
  if (!text) return [];
  const trimmed = query.trim();
  if (!trimmed) return [{ text, match: false }];

  const words = trimmed
    .split(/\s+/)
    .filter(Boolean)
    .map(escapeRegExp);

  if (!words.length) return [{ text, match: false }];

  // Match any of the words, longest first to avoid partial prefix shadowing
  words.sort((a, b) => b.length - a.length);
  const regex = new RegExp(`(${words.join("|")})`, "gi");

  const parts: TextHighlightPart[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ text: text.slice(lastIndex, match.index), match: false });
    }
    parts.push({ text: match[0], match: true });
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push({ text: text.slice(lastIndex), match: false });
  }

  return parts;
}
