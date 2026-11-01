import { forwardRef, type HTMLAttributes, type KeyboardEvent } from "react";
import { ArrowDown01Icon, ArrowUp01Icon, Cancel01Icon } from "../../lib/icons";
import { Icon } from "../icon/icon.react";
import { isComposingEvent } from "../inline-edit/inline-edit";
import { findBarClass, findBarCountText, findBarLabels, type FindBarLabels } from "./find-bar";

export interface FindBarProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  query: string;
  onQueryChange: (query: string) => void;
  matchCase?: boolean;
  onMatchCaseChange?: (matchCase: boolean) => void;
  current: number;
  total: number;
  onNext: () => void;
  onPrevious: () => void;
  onClose?: () => void;
  replace?: boolean;
  replacement?: string;
  onReplacementChange?: (value: string) => void;
  onReplace?: () => void;
  onReplaceAll?: () => void;
  floating?: boolean;
  autoFocus?: boolean;
  labels?: Partial<FindBarLabels>;
}
export const FindBar = /* @__PURE__ */ forwardRef<HTMLDivElement, FindBarProps>(function FindBar({
  query, onQueryChange, matchCase = false, onMatchCaseChange, current, total, onNext, onPrevious, onClose,
  replace = false, replacement = "", onReplacementChange, onReplace, onReplaceAll, floating, autoFocus, labels, className, onKeyDown, ...props
}, ref) {
  const names = { ...findBarLabels, ...labels };
  const onKeys = (event: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented || isComposingEvent(event.nativeEvent)) return;
    if (event.key === "Escape" && onClose) { event.preventDefault(); event.stopPropagation(); onClose(); }
    else if (event.key === "Enter" && event.target instanceof HTMLInputElement) {
      if (event.target.dataset.ayyFind === "query" && total > 0) { event.preventDefault(); (event.shiftKey ? onPrevious : onNext)(); }
      if (event.target.dataset.ayyFind === "replacement" && total > 0 && onReplace) { event.preventDefault(); onReplace(); }
    }
  };
  return <div ref={ref} className={findBarClass({ floating, className })} role="search" aria-label={replace ? "Find and replace" : names.find} onKeyDown={onKeys} {...props}>
    <div className="ayy-find-bar__row">
      <input className="ayy-input ayy-find-bar__input" data-ayy-find="query" type="text" aria-label={names.find} placeholder={names.find} autoComplete="off" spellCheck={false} autoFocus={autoFocus} value={query} aria-invalid={query && !total ? "true" : undefined} onChange={(event) => onQueryChange(event.target.value)} />
      <span className="ayy-find-bar__count" aria-live="polite">{findBarCountText(query, current, total, names)}</span>
      {onMatchCaseChange && <button type="button" className="ayy-button ayy-button--ghost ayy-button--icon" data-ayy-find="match-case" aria-pressed={matchCase} aria-label={names.matchCase} onClick={() => onMatchCaseChange(!matchCase)}>Aa</button>}
      <button type="button" className="ayy-button ayy-button--ghost ayy-button--icon" data-ayy-find="previous" aria-label={names.previous} aria-keyshortcuts="Shift+Enter" disabled={!total} onClick={onPrevious}><Icon icon={ArrowUp01Icon} name="chevron-up" /></button>
      <button type="button" className="ayy-button ayy-button--ghost ayy-button--icon" data-ayy-find="next" aria-label={names.next} aria-keyshortcuts="Enter" disabled={!total} onClick={onNext}><Icon icon={ArrowDown01Icon} name="chevron-down" /></button>
      {onClose && <button type="button" className="ayy-button ayy-button--ghost ayy-button--icon" data-ayy-find="close" aria-label={names.close} aria-keyshortcuts="Escape" onClick={onClose}><Icon icon={Cancel01Icon} name="x" /></button>}
    </div>
    {replace && <div className="ayy-find-bar__row">
      <input className="ayy-input ayy-find-bar__input" data-ayy-find="replacement" type="text" aria-label={names.replaceWith} placeholder={names.replaceWith} autoComplete="off" spellCheck={false} value={replacement} onChange={(event) => onReplacementChange?.(event.target.value)} />
      <button type="button" className="ayy-button ayy-button--secondary" data-ayy-find="replace" disabled={!total} onClick={onReplace}>{names.replace}</button>
      <button type="button" className="ayy-button ayy-button--secondary" data-ayy-find="replace-all" disabled={!total} onClick={onReplaceAll}>{names.replaceAll}</button>
    </div>}
  </div>;
});
