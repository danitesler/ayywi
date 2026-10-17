import { forwardRef, useEffect, useId, useRef, type HTMLAttributes, type ReactNode } from "react";
import { ArrowDown01Icon, Menu01Icon } from "../../lib/icons";
import { mergeRefs } from "../../lib/refs";
import { Icon } from "../icon/icon.react";
import {
  connectToc,
  tocBarClass,
  tocClass,
  tocLinkClass,
  tocListClass,
  tocNumberClass,
  tocTitleClass,
  tocToggleCaretClass,
  tocToggleClass,
  tocToggleCurrentClass,
  tocToggleIconClass,
} from "./toc";

export interface TocItem {
  /** Id of the section on the page. */
  id: string;
  label: ReactNode;
  /** One level of sub-sections. */
  children?: TocItem[];
}

export interface TocProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  items: TocItem[];
  /** Visible heading above the list, e.g. "Table of contents". */
  title?: ReactNode;
  /** Accessible label for the mobile toggle button. Default: "Table of contents". */
  toggleLabel?: string;
  /** Number the top-level items 01, 02… */
  numbered?: boolean;
  sticky?: boolean;
  /** Distance (px) below the top of the viewport at which a section becomes current. */
  offset?: number;
  /** The current section's id, as the reader scrolls. */
  onValueChange?: (id: string) => void;
}

export const Toc = forwardRef<HTMLElement, TocProps>(function Toc(
  {
    items,
    title,
    toggleLabel = "Table of contents",
    numbered,
    sticky,
    offset,
    onValueChange,
    className,
    "aria-label": label = "On this page",
    ...props
  },
  ref,
) {
  const local = useRef<HTMLElement>(null);
  const titleId = useId();
  const onChange = useRef(onValueChange);
  onChange.current = onValueChange;

  useEffect(() => {
    if (!local.current) return;
    return connectToc(local.current, { offset, onChange: (id) => onChange.current?.(id) });
  }, [offset]);

  const defaultToggleText = items[0]?.label ?? (typeof title === "string" ? title : "Table of contents");

  const list = (entries: TocItem[], top: boolean) => (
    <ol className={tocListClass}>
      {entries.map((item, i) => (
        <li key={item.id}>
          <a className={tocLinkClass} href={`#${item.id}`}>
            {numbered && top ? <span className={tocNumberClass}>{String(i + 1).padStart(2, "0")}</span> : null}
            {item.label}
          </a>
          {item.children?.length ? list(item.children, false) : null}
        </li>
      ))}
    </ol>
  );

  return (
    <nav
      ref={mergeRefs(ref, local)}
      className={tocClass({ sticky, className })}
      aria-label={title ? undefined : label}
      aria-labelledby={title ? titleId : undefined}
      {...props}
    >
      <div className={tocBarClass}>
        <button type="button" className={tocToggleClass} aria-expanded="false" aria-label={toggleLabel}>
          <span className={tocToggleIconClass}>
            <Icon icon={Menu01Icon} />
          </span>
          <span className={tocToggleCurrentClass}>{defaultToggleText}</span>
          <span className={tocToggleCaretClass}>
            <Icon icon={ArrowDown01Icon} />
          </span>
        </button>
      </div>
      {title ? (
        <p className={tocTitleClass} id={titleId}>
          {title}
        </p>
      ) : null}
      {list(items, true)}
    </nav>
  );
});
