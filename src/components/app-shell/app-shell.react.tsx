import { forwardRef, useEffect, useId, useRef, type AnchorHTMLAttributes, type ButtonHTMLAttributes, type DetailsHTMLAttributes, type HTMLAttributes, type LiHTMLAttributes, type ReactNode } from "react";
import { cx } from "../../lib/cx";
import { ArrowLeft01Icon, Menu01Icon } from "../../lib/icons";
import { mergeRefs } from "../../lib/refs";
import { buttonClass } from "../button/button";
import { Icon } from "../icon/icon.react";
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
  appShellGroupLabelClass,
  appShellHeadClass,
  appShellHoverPreviewClass,
  appShellLinkClass,
  appShellLinkSubClass,
  appShellListClass,
  appShellMainClass,
  appShellNavClass,
  appShellResizeClass,
  appShellResizeDetailClass,
  appShellSettingsClass,
  appShellSidebarClass,
  appShellSmClass,
  appShellSublistClass,
  appShellTitleClass,
  appShellToggleClass,
  connectAppShell,
  type AppShellEdge,
  type AppShellSize,
} from "./app-shell";

export type { AppShellEdge, AppShellSize };

export interface AppShellProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Small size variation (`sm` / `ayy-app-shell--sm`): denser nav rows with 14px text, control border radius, tighter padding and gap. Default is Big (`md`).
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
  { size, settings, collapsed, hoverPreview = true, drawer, onCollapseChange, onResize, className, ...props },
  ref,
) {
  const own = useRef<HTMLDivElement>(null);
  useEffect(() => (own.current ? connectAppShell(own.current, { onCollapseChange, onResize }) : undefined), [onCollapseChange, onResize]);
  return (
    <div
      ref={mergeRefs(own, ref)}
      className={cx(
        appShellClass,
        size === "sm" && appShellSmClass,
        settings && appShellSettingsClass,
        drawer && appShellDrawerClass,
        collapsed && appShellCollapsedClass,
        hoverPreview && appShellHoverPreviewClass,
        className,
      )}
      {...props}
    />
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
      <Icon icon={ArrowLeft01Icon} directional />
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

/** The settings sidebar's heading ("Settings"), under AppShellBack. An <h2>: each section's Top bar holds the page's <h1>. */
export const AppShellTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(function AppShellTitle({ className, ...props }, ref) {
  return <h2 ref={ref} className={cx(appShellTitleClass, className)} {...props} />;
});

/** The sidebar's top row: an AppShellToggle that collapses the sidebar, then the AppShellBrand. The toggle stays in place in the rail. */
export const AppShellHead = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(function AppShellHead({ className, ...props }, ref) {
  return <div ref={ref} className={cx(appShellHeadClass, className)} {...props} />;
});

/** The phone top bar (hidden from 48rem): an AppShellToggle, the brand, and maybe a search button. Put it first in the shell. */
export const AppShellBar = forwardRef<HTMLElement, HTMLAttributes<HTMLElement>>(function AppShellBar({ className, ...props }, ref) {
  return <header ref={ref} className={cx(appShellBarClass, className)} {...props} />;
});

/** The menu button that opens the sidebar as a drawer. AppShell manages aria-expanded; leave it uncontrolled. */
export const AppShellToggle = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement>>(function AppShellToggle(
  { className, "aria-label": label = "Menu", children, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type="button"
      className={buttonClass({ variant: "ghost", size: "icon", className: cx(appShellToggleClass, className) })}
      aria-label={label}
      aria-expanded="false"
      {...props}
    >
      {children ?? <Icon icon={Menu01Icon} />}
    </button>
  );
});

export const AppShellSidebar = forwardRef<HTMLElement, HTMLAttributes<HTMLElement>>(function AppShellSidebar(
  { className, ...props },
  ref,
) {
  return <aside ref={ref} className={cx(appShellSidebarClass, className)} {...props} />;
});

export const AppShellBrand = forwardRef<HTMLAnchorElement, AnchorHTMLAttributes<HTMLAnchorElement>>(function AppShellBrand(
  { className, ...props },
  ref,
) {
  return <a ref={ref} className={cx(appShellBrandClass, className)} {...props} />;
});

export const AppShellNav = forwardRef<HTMLElement, HTMLAttributes<HTMLElement>>(function AppShellNav(
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
}

/** A headed section of the nav: a label over a list of AppShellItem. */
export const AppShellGroup = forwardRef<HTMLDivElement, AppShellGroupProps>(function AppShellGroup(
  { label, className, children, ...props },
  ref,
) {
  const labelId = useId();
  return (
    <div ref={ref} className={cx(appShellGroupClass, className)} {...props}>
      <p className={appShellGroupLabelClass} id={labelId}>
        {label}
      </p>
      <ul className={appShellListClass} aria-labelledby={labelId}>
        {children}
      </ul>
    </div>
  );
});

export const AppShellItem = forwardRef<HTMLLIElement, LiHTMLAttributes<HTMLLIElement>>(function AppShellItem(props, ref) {
  return <li ref={ref} {...props} />;
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

export const AppShellFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(function AppShellFooter(
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

/** The third column at the inline end, for what's picked in the main area. Show and hide it with `hidden`; on phones it covers the screen. */
export const AppShellDetail = forwardRef<HTMLElement, HTMLAttributes<HTMLElement>>(function AppShellDetail({ className, ...props }, ref) {
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
