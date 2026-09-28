import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useId,
  useState,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type KeyboardEvent,
} from "react";
import { cx } from "../../lib/cx";
import { nextTabIndex, tabsClass, tabsListClass, tabsPanelClass, tabsTabClass } from "./tabs";

interface TabsContextValue {
  value: string;
  select: (value: string) => void;
  idFor: (kind: "tab" | "panel", value: string) => string;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabs(component: string): TabsContextValue {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error(`<${component}> must be used inside <Tabs>.`);
  return ctx;
}

export interface TabsProps extends Omit<HTMLAttributes<HTMLDivElement>, "defaultValue" | "onChange"> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}

export const Tabs = forwardRef<HTMLDivElement, TabsProps>(function Tabs(
  { value: controlled, defaultValue = "", onValueChange, className, ...props },
  ref,
) {
  const [uncontrolled, setUncontrolled] = useState(defaultValue);
  const value = controlled ?? uncontrolled;
  const baseId = useId();

  const select = useCallback(
    (next: string) => {
      if (controlled === undefined) setUncontrolled(next);
      onValueChange?.(next);
    },
    [controlled, onValueChange],
  );

  const idFor = useCallback(
    (kind: "tab" | "panel", v: string) => `${baseId}${kind}-${v.replace(/[^\w-]/g, "_")}`,
    [baseId],
  );

  return (
    <TabsContext.Provider value={{ value, select, idFor }}>
      <div ref={ref} className={cx(tabsClass, className)} {...props} />
    </TabsContext.Provider>
  );
});

export const TabsList = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(function TabsList(
  { className, onKeyDown, ...props },
  ref,
) {
  const { select } = useTabs("TabsList");

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    onKeyDown?.(event);
    if (event.defaultPrevented) return;
    const tabs = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="tab"]:not(:disabled)'));
    const current = tabs.indexOf(document.activeElement as HTMLButtonElement);
    const rtl = getComputedStyle(event.currentTarget).direction === "rtl";
    const next = nextTabIndex(event.key, current, tabs.length, rtl);
    if (next === null) return;
    event.preventDefault();
    tabs[next].focus();
    const value = tabs[next].dataset.value;
    if (value !== undefined) select(value);
  }

  return <div ref={ref} role="tablist" className={cx(tabsListClass, className)} onKeyDown={handleKeyDown} {...props} />;
});

export interface TabsTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
}

export const TabsTrigger = forwardRef<HTMLButtonElement, TabsTriggerProps>(function TabsTrigger(
  { value, className, onClick, ...props },
  ref,
) {
  const ctx = useTabs("TabsTrigger");
  const selected = ctx.value === value;
  return (
    <button
      ref={ref}
      type="button"
      role="tab"
      id={ctx.idFor("tab", value)}
      aria-controls={ctx.idFor("panel", value)}
      aria-selected={selected}
      tabIndex={selected ? 0 : -1}
      data-value={value}
      className={cx(tabsTabClass, className)}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) ctx.select(value);
      }}
      {...props}
    />
  );
});

export interface TabsContentProps extends HTMLAttributes<HTMLDivElement> {
  value: string;
  /** Keep children mounted while hidden (preserves state; costs render time). Default false. */
  keepMounted?: boolean;
}

export const TabsContent = forwardRef<HTMLDivElement, TabsContentProps>(function TabsContent(
  { value, keepMounted = false, className, children, ...props },
  ref,
) {
  const ctx = useTabs("TabsContent");
  const selected = ctx.value === value;
  return (
    <div
      ref={ref}
      role="tabpanel"
      id={ctx.idFor("panel", value)}
      aria-labelledby={ctx.idFor("tab", value)}
      hidden={!selected}
      tabIndex={0}
      className={cx(tabsPanelClass, className)}
      {...props}
    >
      {selected || keepMounted ? children : null}
    </div>
  );
});
