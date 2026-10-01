import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { PaintBoardIcon, Search01Icon, Tick02Icon } from "@hugeicons/core-free-icons";
import {
  AppShell,
  AppShellBar,
  AppShellBrand,
  AppShellGroup,
  AppShellItem,
  AppShellLink,
  AppShellNav,
  AppShellSidebar,
  AppShellToggle,
  Button,
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
  Icon,
} from "ayywi/react";
import type { DensityMode, ThemeMode } from "ayywi";
import { changelogPage, ChangelogPage } from "./pages/Changelog";
import { componentGroups, components } from "./data";
import { ComponentPage } from "./pages/ComponentPage";
import { foundations, foundationText } from "./pages/Foundations";
import { getStarted, GetStartedPage } from "./pages/GetStarted";
import { showcase, ShowcasePage } from "./pages/Showcase";
import { useHashRoute, useSettings } from "./settings";
import { themeOptions } from "./themes";

interface NavItem {
  route: string;
  title: string;
  /** Everything the search matches against. */
  text: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const SECTIONS: NavSection[] = [
  {
    title: "Start",
    items: [
      { route: getStarted.route, title: getStarted.title, text: getStarted.text },
      { route: showcase.route, title: showcase.title, text: showcase.text },
      { route: changelogPage.route, title: changelogPage.title, text: changelogPage.text },
    ],
  },
  {
    title: "Foundations",
    items: foundations.map((f) => ({ route: f.route, title: f.title, text: foundationText(f) })),
  },
  ...componentGroups.map((g) => ({
    title: g.category,
    items: g.components.map((c) => ({
      route: c.slug,
      title: c.name,
      text: [c.slug, c.description, ...Object.keys(c.classes), ...Object.keys(c.react.components), c.element?.tag ?? ""].join(" "),
    })),
  })),
];

/** Every word must appear in the item, its section or its search text. */
function search(query: string): NavSection[] {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (!words.length) return SECTIONS;
  const matches = (section: NavSection, item: NavItem) => {
    const haystack = `${section.title} ${item.title} ${item.text}`.toLowerCase();
    return words.every((w) => haystack.includes(w));
  };
  return SECTIONS.map((s) => ({ ...s, items: s.items.filter((item) => matches(s, item)) })).filter((s) => s.items.length > 0);
}


const DENSITY_OPTIONS: [DensityMode, string][] = [
  ["auto", "Auto"],
  ["compact", "Compact"],
  ["comfortable", "Comfortable"],
  ["touch", "Touch"],
];

const THEME_OPTIONS: [ThemeMode, string][] = [["system", "System"], ...themeOptions.map((t): [ThemeMode, string] => [t.name, t.label])];

/** One menu for theme and density, so the sidebar footer stays just navigation. */
function AppearanceMenu({ theme, setTheme, density, setDensity }: { theme: ThemeMode; setTheme: (v: ThemeMode) => void; density: DensityMode; setDensity: (v: DensityMode) => void }) {
  const group = <T extends string>(label: string, value: T, options: [T, string][], onChange: (v: T) => void) => (
    <div role="group" aria-label={label}>
      <DropdownMenuLabel>{label}</DropdownMenuLabel>
      {options.map(([key, text]) => (
        <DropdownMenuItem key={key} role="menuitemradio" aria-checked={key === value} onSelect={() => onChange(key)}>
          {text}
          {key === value ? <Icon icon={Tick02Icon} className="pv-picker__check" /> : null}
        </DropdownMenuItem>
      ))}
    </div>
  );
  return (
    <DropdownMenu>
      <DropdownMenuTrigger variant="ghost" size="icon" aria-label="Theme and density">
        <Icon icon={PaintBoardIcon} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" aria-label="Theme and density">
        {group("Theme", theme, THEME_OPTIONS, setTheme)}
        <DropdownMenuSeparator />
        {group("Density", density, DENSITY_OPTIONS, setDensity)}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function App() {
  const raw = useHashRoute();
  const route = raw === "tokens" ? "colors" : raw === "get-started" ? "" : raw; // old links
  const [page, part] = route.split("/");
  const { theme, setTheme, density, setDensity, renderer } = useSettings();
  const component = components.find((c) => c.slug === route);
  const foundation = foundations.find((f) => f.route === page);

  // #/colors/status → the Colors page, scrolled to its Status section.
  useEffect(() => {
    if (part) document.getElementById(`${page}-${part}`)?.scrollIntoView({ block: "start" });
  }, [page, part]);

  const [query, setQuery] = useState("");
  const sections = useMemo(() => search(query), [query]);
  const results = sections.flatMap((s) => s.items);
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const navRef = useRef<HTMLElement>(null);

  // "/" or Ctrl/⌘K jumps to search from anywhere.
  useEffect(() => {
    const onKey = (event: globalThis.KeyboardEvent) => {
      const typing = (event.target as Element | null)?.closest?.("input, textarea, select, [contenteditable='true']");
      if ((event.key === "/" && !typing) || (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey))) {
        event.preventDefault();
        setSearchOpen(true);
        requestAnimationFrame(() => {
          searchRef.current?.focus();
          searchRef.current?.select();
        });
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const onSearchKey = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && results.length) {
      const q = query.trim().toLowerCase();
      const best = results.find((r) => r.title.toLowerCase().startsWith(q)) ?? results[0];
      window.location.hash = `#/${best.route}`;
    } else if (event.key === "Escape") {
      if (query) setQuery("");
      else setSearchOpen(false);
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      navRef.current?.querySelector<HTMLElement>("a")?.focus();
    }
  };

  const link = (item: NavItem) => {
    const current = page === item.route;
    return (
      <AppShellLink href={`#/${item.route}`} className="pv-nav__link" current={current} aria-current={current ? "page" : undefined}>
        {item.title}
      </AppShellLink>
    );
  };

  return (
    <AppShell className="pv-shell">
      <AppShellBar className="pv-topbar">
        <AppShellToggle aria-label="Open navigation" />
        <AppShellBrand href="#/" className="pv-brand">
          <span className="pv-brand__mark" aria-hidden="true" />
          ayywi
        </AppShellBrand>
        <div className="pv-topbar__actions">
          <AppearanceMenu theme={theme} setTheme={setTheme} density={density} setDensity={setDensity} />
        </div>
      </AppShellBar>
      <AppShellSidebar className="pv-sidebar ayy-scroll">
        <div className="pv-sidebar__top">
          <div className="pv-sidebar__head">
            <AppShellBrand href="#/" className="pv-brand">
              <span className="pv-brand__mark" aria-hidden="true" />
              ayywi
            </AppShellBrand>
            <div className="pv-sidebar__actions">
              {/* On phones the bar carries this menu. */}
              <span className="pv-sidebar__appearance">
                <AppearanceMenu theme={theme} setTheme={setTheme} density={density} setDensity={setDensity} />
              </span>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Search"
                aria-expanded={searchOpen || !!query}
                aria-controls="pv-search"
                aria-keyshortcuts="/ Control+K Meta+K"
                onClick={() => {
                  if (searchOpen && !query) return setSearchOpen(false);
                  setSearchOpen(true);
                  requestAnimationFrame(() => searchRef.current?.focus());
                }}
              >
                <Icon icon={Search01Icon} />
              </Button>
            </div>
          </div>
          <div className="pv-search" data-open={searchOpen || !!query} inert={!(searchOpen || query)}>
            <div className="pv-search__inner" id="pv-search" role="search">
              <input
                ref={searchRef}
                className="ayy-input pv-search__input"
                type="search"
                placeholder="Search"
                aria-label="Search components and foundations"
                aria-controls="pv-nav"
                autoComplete="off"
                spellCheck={false}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onSearchKey}
                onBlur={() => !query && setSearchOpen(false)}
              />
            </div>
          </div>
        </div>
        <p className="ayy-sr-only" role="status">
          {query ? `${results.length} result${results.length === 1 ? "" : "s"}` : ""}
        </p>
        <AppShellNav id="pv-nav" ref={navRef} className="pv-nav" aria-label="Design system">
          {sections.length ? (
            sections.map((s) => (
              <AppShellGroup key={s.title} label={s.title}>
                {s.items.map((item) => (
                  <AppShellItem key={item.route || "overview"}>{link(item)}</AppShellItem>
                ))}
              </AppShellGroup>
            ))
          ) : (
            <p className="pv-nav__empty">No matches for “{query}”.</p>
          )}
        </AppShellNav>
      </AppShellSidebar>

      <div className="pv-main">
        <main className="pv-content" id="main">
          {component ? (
            <ComponentPage key={component.slug} component={component} renderer={renderer} />
          ) : page === showcase.route ? (
            <ShowcasePage id={part} />
          ) : page === changelogPage.route ? (
            <ChangelogPage />
          ) : foundation ? (
            <foundation.Page key={foundation.route} />
          ) : (
            <GetStartedPage />
          )}
        </main>
      </div>
    </AppShell>
  );
}
