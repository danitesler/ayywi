import { createContext, forwardRef, useContext, useEffect, useId, useRef, useState, type AnchorHTMLAttributes, type ButtonHTMLAttributes, type DetailsHTMLAttributes, type HTMLAttributes, type LiHTMLAttributes, type ReactNode } from "react";
import { cx } from "../../lib/cx";
import { ArrowLeft01Icon, Menu01Icon } from "../../lib/icons";
import { mergeRefs } from "../../lib/refs";
import { buttonClass } from "../button/button";
import { Icon } from "../icon/icon.react";
import { generalActionLabel, type TooltipSide } from "../tooltip/tooltip";
import { Tooltip, tooltipContext } from "../tooltip/tooltip.react";
import {
  appShellBackClass,
  appShellBarClass,
  appShellBrandClass,
  appShellCollapseClass,
  appShellClass,
  appShellCollapsedClass,
  appShellDetailClass,
  appShellDrawerClass,
  appShellFooterClass,
  appShellGroupClass,
  appShellGroupCollapsibleClass,
  appShellGroupLabelClass,
  appShellHeadClass,
  appShellHoverPreviewClass,
  appShellLinkClass,
  appShellLinkSubClass,
  appShellListClass,
  appShellMainClass,
  appShellMoreClass,
  appShellNavClass,
  appShellResizeClass,
  appShellResizeDetailClass,
  appShellSettingsClass,
  appShellSidebarClass,
  appShellMdClass,
  appShellSmClass,
  appShellSublistClass,
  appShellTitleClass,
  appShellToggleClass,
  connectAppShell,
  type AppShellEdge,
  type AppShellSize,
} from "./app-shell";

export type { AppShellEdge, AppShellSize };

interface AppShellContextValue {
  collapsed?: boolean;
}

const AppShellContext = createContext<AppShellContextValue>({});
const InHeadContext = createContext<boolean>(false);

export interface AppShellProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Sidebar row size, matching Button's `sm | md | lg` scale: `lg` (default, 40px compact rows with 20px icons),
   * `md` (`ayy-app-shell--md`, 32px compact rows with 16px icons), or `sm` (`ayy-app-shell--sm`, 28px compact rows for long trees such as docs).
   */
  size?: AppShellSize;
  /**
   * Settings mode, for a shell inside <DialogContent size="full">: the sidebar holds an AppShellTitle and the settings
   * sections, and the main shows one section. On phones the sections list and the open section are separate screens.
   */
  settings?: boolean;
  /**
   * Collapsed mode: reduces the sidebar to an icon rail on wide screens (ayy-app-shell--collapsed).
   */
  collapsed?: boolean;
  /**
   * Hover preview mode: when collapsed, hovering or focusing the sidebar temporarily expands it as an overlay preview (ayy-app-shell--hover-preview). Defaults to true.
   */
  hoverPreview?: boolean;
  /**
   * Called when the sidebar is collapsed or expanded via a toggle button.
   */
  onCollapseChange?: (collapsed: boolean) => void;
  /**
   * Below 48rem the sidebar is a drawer even without an AppShellBar or a BottomNav; the AppShellToggle may sit in the main area
   * (ayy-app-shell--drawer).
   */
  drawer?: boolean;
  /**
   * Called when an AppShellResize handle finishes a drag or key press: the new width in px, or null for the default again.
   * Save it and start the next session with style={{ "--ayy-sidebar-w": `${width}px` }} (or --ayy-detail-w).
   */
  onResize?: (edge: AppShellEdge, width: number | null) => void;
}

/** The viewport-high frame: a sidebar and the main content, each scrolling on its own. With an AppShellBar, the sidebar is a drawer on phones. Wide screens support collapsing to an icon rail and hover preview. */
export const AppShell = forwardRef<HTMLDivElement, AppShellProps>(function AppShell(
  { size, settings, collapsed, hoverPreview = true, drawer, onCollapseChange, onResize, className, children, ...props },
  ref,
) {
  const own = useRef<HTMLDivElement>(null);
  // Collapsed is controlled when the prop is given; otherwise AppShell tracks what its toggles did, for the labels and
  // the tooltip that follow the state.
  const controlled = collapsed !== undefined;
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const isCollapsed = controlled ? Boolean(collapsed) : internalCollapsed;
  useEffect(() => {
    if (!own.current) return;
    return connectAppShell(own.current, {
      onCollapseChange: (next) => {
        if (!controlled) setInternalCollapsed(next);
        onCollapseChange?.(next);
      },
      onResize,
    });
  }, [controlled, onCollapseChange, onResize]);
  useEffect(() => {
    if (!own.current) return;
    const toggles = own.current.querySelectorAll<HTMLElement>(`:scope > .${appShellSidebarClass} .${appShellToggleClass}`);
    for (const toggle of toggles) {
      toggle.setAttribute("aria-expanded", String(!isCollapsed));
    }
  }, [isCollapsed]);

  return (
    <AppShellContext.Provider value={{ collapsed: isCollapsed }}>
      <div
        ref={mergeRefs(own, ref)}
        className={cx(
          appShellClass,
          size === "sm" && appShellSmClass,
          size === "md" && appShellMdClass,
          settings && appShellSettingsClass,
          drawer && appShellDrawerClass,
          isCollapsed && appShellCollapsedClass,
          hoverPreview && appShellHoverPreviewClass,
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </AppShellContext.Provider>
  );
});

export interface AppShellBackProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Where leaving settings goes (the page the user opened settings from). Without it the back is a <button>: pass onClick. */
  href?: string;
}

/** The way out of settings, first in the sidebar: an arrow and "Back to <app>". A link with href, else a button. */
export const AppShellBack = forwardRef<HTMLAnchorElement & HTMLButtonElement, AppShellBackProps>(function AppShellBack(
  { className, children, ...props },
  ref,
) {
  const content = (
    <>
      <Icon icon={ArrowLeft01Icon} name="chevron-left" directional />
      <span>{children}</span>
    </>
  );
  if (props.href !== undefined) {
    return (
      <a ref={ref} className={cx(appShellBackClass, className)} {...props}>
        {content}
      </a>
    );
  }
  return (
    <button ref={ref} type="button" className={cx(appShellBackClass, className)} {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {content}
    </button>
  );
});

export interface AppShellTitleProps extends HTMLAttributes<HTMLHeadingElement> {}

/** The settings sidebar's heading ("Settings"), under AppShellBack. An <h2>: each section's Top bar holds the page's <h1>. */
export const AppShellTitle = forwardRef<HTMLHeadingElement, AppShellTitleProps>(function AppShellTitle({ className, ...props }, ref) {
  return <h2 ref={ref} className={cx(appShellTitleClass, className)} {...props} />;
});

export interface AppShellHeadProps extends HTMLAttributes<HTMLDivElement> {}

/**
 * The sidebar's top row: the AppShellBrand (a logo mark, with a name or a logotype beside it), then the AppShellToggle that
 * collapses the sidebar, at the inline end. In the rail only the mark shows; resting the pointer on it swaps in the toggle.
 */
export const AppShellHead = forwardRef<HTMLDivElement, AppShellHeadProps>(function AppShellHead({ className, children, ...props }, ref) {
  return (
    <InHeadContext.Provider value={true}>
      <div ref={ref} className={cx(appShellHeadClass, className)} {...props}>
        {children}
      </div>
    </InHeadContext.Provider>
  );
});

export interface AppShellBarProps extends HTMLAttributes<HTMLElement> {}

/** The phone top bar (hidden from 48rem): an AppShellToggle, the brand, and maybe a search button. Put it first in the shell. */
export const AppShellBar = forwardRef<HTMLElement, AppShellBarProps>(function AppShellBar({ className, ...props }, ref) {
  return <header ref={ref} className={cx(appShellBarClass, className)} {...props} />;
});

export interface AppShellToggleProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Tooltip text. In an AppShellHead it defaults to the action ("Collapse" / "Expand") and follows the sidebar's state;
   * the phone drawer's menu has none. Pass false to disable.
   */
  tooltip?: ReactNode | boolean;
  /** Tooltip placement side (default "bottom" in an AppShellHead). */
  tooltipSide?: TooltipSide;
}

/** The menu button that opens the sidebar as a drawer, or collapses and expands it in an AppShellHead (where it also gets a tooltip). AppShell manages aria-expanded; leave it uncontrolled. */
export const AppShellToggle = forwardRef<HTMLButtonElement, AppShellToggleProps>(function AppShellToggle(
  { className, "aria-label": label, tooltip, tooltipSide = "bottom", children, ...props },
  ref,
) {
  const inHead = useContext(InHeadContext);
  const hasParentTooltip = useContext(tooltipContext);
  const { collapsed } = useContext(AppShellContext);
  const action = collapsed ? "Expand sidebar" : "Collapse sidebar";
  const ariaLabel = label ?? (inHead ? action : "Menu");
  const ariaExpanded = props["aria-expanded"] ?? (inHead ? (!collapsed ? "true" : "false") : "false");
  const tooltipContent =
    !hasParentTooltip && tooltip !== false ? (tooltip ?? (inHead ? generalActionLabel(ariaLabel) : undefined)) : undefined;

  const toggle = (
    <button
      ref={ref}
      type="button"
      className={buttonClass({ variant: "ghost", size: "icon", className: cx(appShellToggleClass, className) })}
      aria-label={ariaLabel}
      aria-expanded={ariaExpanded}
      {...props}
    >
      {children ?? <Icon icon={Menu01Icon} name="menu" />}
    </button>
  );

  if (!tooltipContent) return toggle;

  return (
    <Tooltip side={tooltipSide} content={tooltipContent}>
      {toggle}
    </Tooltip>
  );
});

export interface AppShellSidebarProps extends HTMLAttributes<HTMLElement> {}

export const AppShellSidebar = forwardRef<HTMLElement, AppShellSidebarProps>(function AppShellSidebar(
  { className, ...props },
  ref,
) {
  return <aside ref={ref} className={cx(appShellSidebarClass, className)} {...props} />;
});

export interface AppShellBrandProps extends AnchorHTMLAttributes<HTMLAnchorElement> {}

export const AppShellBrand = forwardRef<HTMLAnchorElement, AppShellBrandProps>(function AppShellBrand(
  { className, ...props },
  ref,
) {
  return <a ref={ref} className={cx(appShellBrandClass, className)} {...props} />;
});

export interface AppShellNavProps extends HTMLAttributes<HTMLElement> {}

export const AppShellNav = forwardRef<HTMLElement, AppShellNavProps>(function AppShellNav(
  { className, "aria-label": label = "Main", ...props },
  ref,
) {
  return <nav ref={ref} className={cx(appShellNavClass, className)} aria-label={label} {...props} />;
});

export interface AppShellLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /** The page this link points to is the one being shown (sets aria-current="page"). */
  current?: boolean;
  /** A child link, for use inside AppShellSublist or AppShellCollapse: smaller and lighter. */
  sub?: boolean;
}

export const AppShellLink = forwardRef<HTMLAnchorElement, AppShellLinkProps>(function AppShellLink(
  { current, sub, className, ...props },
  ref,
) {
  return <a ref={ref} className={cx(appShellLinkClass, sub && appShellLinkSubClass, className)} aria-current={current ? "page" : undefined} {...props} />;
});

export interface AppShellGroupProps extends HTMLAttributes<HTMLDivElement> {
  /** The heading over the group. The list is named by it. */
  label: ReactNode;
  /** The heading toggles the list (a native <details>); a chevron shows on hover. Off by default. */
  collapsible?: boolean;
  /** With `collapsible`: whether the group starts open. Default true. Open it yourself when it holds the current page. */
  defaultOpen?: boolean;
}

/** A headed section of the nav: a label over a list of AppShellItem. */
export const AppShellGroup = forwardRef<HTMLDivElement, AppShellGroupProps>(function AppShellGroup(
  { label, collapsible, defaultOpen = true, className, children, ...props },
  ref,
) {
  const labelId = useId();
  const list = (
    <ul className={appShellListClass} aria-labelledby={labelId}>
      {children}
    </ul>
  );
  if (collapsible) {
    return (
      <details ref={ref as never} className={cx(appShellGroupClass, appShellGroupCollapsibleClass, className)} open={defaultOpen} {...(props as object)}>
        <summary className={appShellGroupLabelClass} id={labelId}>
          {label}
        </summary>
        {list}
      </details>
    );
  }
  return (
    <div ref={ref} className={cx(appShellGroupClass, className)} {...props}>
      <p className={appShellGroupLabelClass} id={labelId}>
        {label}
      </p>
      {list}
    </div>
  );
});

export interface AppShellItemProps extends LiHTMLAttributes<HTMLLIElement> {}

export const AppShellItem = forwardRef<HTMLLIElement, AppShellItemProps>(function AppShellItem(props, ref) {
  return <li ref={ref} {...props} />;
});

export interface AppShellMoreProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

/**
 * The icon button at the end of an AppShellRow that opens the row's menu. A sibling of AppShellLink, never inside it:
 * give it an aria-label naming the row ("Project options") and put a DropdownMenuTrigger around it (asChild).
 */
export const AppShellMore = forwardRef<HTMLButtonElement, AppShellMoreProps>(function AppShellMore(
  { className, type = "button", ...props },
  ref,
) {
  return <button ref={ref} type={type} className={cx(appShellMoreClass, className)} {...props} />;
});

export interface AppShellSublistProps extends HTMLAttributes<HTMLUListElement> {
  /** Names the list for screen readers, e.g. "Colors sections". */
  "aria-label": string;
}

/** One level of AppShellItem children under a link, indented along a guide line. */
export const AppShellSublist = forwardRef<HTMLUListElement, AppShellSublistProps>(function AppShellSublist(
  { className, ...props },
  ref,
) {
  return <ul ref={ref} className={cx(appShellSublistClass, className)} {...props} />;
});

export interface AppShellCollapseProps extends DetailsHTMLAttributes<HTMLDetailsElement> {
  /** The always-visible row that toggles the group: an icon and a short label. */
  label: ReactNode;
}

/** A group of child links that opens and closes: a native <details>. Set `open` when it holds the current page. */
export const AppShellCollapse = forwardRef<HTMLDetailsElement, AppShellCollapseProps>(function AppShellCollapse(
  { label, className, children, ...props },
  ref,
) {
  return (
    <details ref={ref} className={cx(appShellCollapseClass, className)} {...props}>
      <summary className={appShellLinkClass}>{label}</summary>
      <ul className={appShellSublistClass}>{children}</ul>
    </details>
  );
});

export interface AppShellFooterProps extends HTMLAttributes<HTMLDivElement> {}

export const AppShellFooter = forwardRef<HTMLDivElement, AppShellFooterProps>(function AppShellFooter(
  { className, ...props },
  ref,
) {
  return <div ref={ref} className={cx(appShellFooterClass, className)} {...props} />;
});

export interface AppShellMainProps extends HTMLAttributes<HTMLElement> {
  /** "div" for a settings shell in a Dialog: the page behind it already has the one <main>. Default "main". */
  as?: "main" | "div";
}

export const AppShellMain = forwardRef<HTMLElement, AppShellMainProps>(function AppShellMain({ as: Tag = "main", className, ...props }, ref) {
  return <Tag ref={ref as never} className={cx(appShellMainClass, className)} {...props} />;
});

export interface AppShellDetailProps extends HTMLAttributes<HTMLElement> {}

/** The third column at the inline end, for what's picked in the main area. Show and hide it with `hidden`; on phones it covers the screen. */
export const AppShellDetail = forwardRef<HTMLElement, AppShellDetailProps>(function AppShellDetail({ className, ...props }, ref) {
  return <aside ref={ref} className={cx(appShellDetailClass, className)} {...props} />;
});

export interface AppShellResizeProps extends HTMLAttributes<HTMLDivElement> {
  /** Which edge it drags: the sidebar's (default) or the detail pane's. */
  edge?: AppShellEdge;
}

/** A drag handle on the sidebar's or the detail pane's edge (a keyboard-operable separator). A direct child of AppShell. */
export const AppShellResize = forwardRef<HTMLDivElement, AppShellResizeProps>(function AppShellResize({ edge = "sidebar", className, ...props }, ref) {
  return (
    <div
      ref={ref}
      role="separator"
      aria-orientation="vertical"
      tabIndex={0}
      aria-label={edge === "sidebar" ? "Resize sidebar" : "Resize detail pane"}
      className={cx(appShellResizeClass, edge === "detail" && appShellResizeDetailClass, className)}
      {...props}
    />
  );
});
