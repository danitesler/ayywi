import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { ArrowLeft01Icon } from "../../lib/icons";
import { Icon } from "../icon/icon.react";
import {
  topBarActionsClass,
  topBarBackClass,
  topBarClass,
  topBarHeadingClass,
  topBarRowClass,
  topBarSubtitleClass,
  topBarTitleClass,
} from "./top-bar";

export interface TopBarProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  /** The screen's name, in an <h1>. */
  title: ReactNode;
  /** A line under the title ("12 tasks"). */
  subtitle?: ReactNode;
  /** The back button goes to this page (an <a>). */
  backHref?: string;
  /** The back button runs this (a <button>), e.g. router.back(). */
  onBack?: () => void;
  /** Visible text after the chevron: the previous screen's name ("Lists"). Without it the button is a chevron named by backAriaLabel. */
  backLabel?: string;
  /** The back button's accessible name when it has no text. Default "Back". Translate it. */
  backAriaLabel?: string;
  /** Buttons at the end: one to three icon buttons (ghost, size="icon"). */
  actions?: ReactNode;
  /** Centre the title (iOS). */
  center?: boolean;
  /** A big title on its own line under the buttons. */
  large?: boolean;
}

/** A phone screen's header: back, title, actions; sticky at the top. Children become a second row (a search bar). */
export const TopBar = /* @__PURE__ */ forwardRef<HTMLElement, TopBarProps>(function TopBar(
  { title, subtitle, backHref, onBack, backLabel, backAriaLabel = "Back", actions, center, large, className, children, ...props },
  ref,
) {
  const backContent = (
    <>
      <Icon icon={ArrowLeft01Icon} name="chevron-left" directional />
      {backLabel && <span>{backLabel}</span>}
    </>
  );
  const backName = backLabel ? undefined : backAriaLabel;
  return (
    <header ref={ref} className={topBarClass({ center, large, className })} {...props}>
      {backHref !== undefined ? (
        <a className={topBarBackClass} href={backHref} aria-label={backName}>
          {backContent}
        </a>
      ) : onBack ? (
        <button type="button" className={topBarBackClass} aria-label={backName} onClick={onBack}>
          {backContent}
        </button>
      ) : null}
      {subtitle ? (
        <div className={topBarHeadingClass}>
          <h1 className={topBarTitleClass}>{title}</h1>
          <p className={topBarSubtitleClass}>{subtitle}</p>
        </div>
      ) : (
        <h1 className={topBarTitleClass}>{title}</h1>
      )}
      {actions && <div className={topBarActionsClass}>{actions}</div>}
      {children && <div className={topBarRowClass}>{children}</div>}
    </header>
  );
});
