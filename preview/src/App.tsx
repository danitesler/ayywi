import { useEffect, useState, type ReactNode } from "react";
import { GithubIcon, Search01Icon, SidebarLeftIcon } from "@hugeicons/core-free-icons";
import {
  AppShell,
  AppShellBar,
  AppShellCollapse,
  AppShellGroup,
  AppShellItem,
  AppShellLink,
  AppShellMain,
  AppShellNav,
  AppShellSidebar,
  AppShellToggle,
  Button,
  buttonClass,
  CommandDialog,
  CommandGroup,
  CommandItem,
  Icon,
  Kbd,
  Navbar,
  NavbarActions,
  NavbarBrand,
  NavbarLink,
  NavbarNav,
  NavbarToggle,
  SearchBar,
  Shortcut,
  TextHighlight,
  Tooltip,
} from "@danitesler/ayywi/react";
import { commandMatches } from "@danitesler/ayywi";
import { AppearanceMenu } from "./Appearance";
import { componentFamilies, components, type ComponentEntry } from "./data";
import { brandPage } from "./pages/Brand";
import { changelogPage, ChangelogPage } from "./pages/Changelog";
import { ComponentPage } from "./pages/ComponentPage";
import { ComponentsOverview } from "./pages/Components";
import { densityPage, DensityPage } from "./pages/Density";
import { foundations, foundationText } from "./pages/Foundations";
import { getStarted, GetStartedPage } from "./pages/GetStarted";
import { Landing, SiteFooter } from "./pages/Landing";
import { NotFound } from "./pages/NotFound";
import { showcase, ShowcasePage } from "./pages/Showcase";
import { ThemesPage } from "./pages/Themes";
import { showcaseApps } from "./showcase/apps";
import { GITHUB, TABS, useRoute } from "./routes";
import { useSettings } from "./settings";


interface NavItem {
  /** The hash path, without "#/". */
  route: string;
  title: string;
  description?: string;
  /** Everything the search matches against. */
  text: string;
}

const FOUNDATION_DESCRIPTIONS: Record<string, string> = {
  colors: "Palette primitives, semantic tokens, themes and spot colours",
  typography: "Font families, heading hierarchy and text sizes",
  spacing: "Spacing scale, control sizes and layout gaps",
  elevation: "Corner radiuses and elevation shadows",
  motion: "Easing curves, durations and reduced motion support",
  density: "Compact, comfortable and touch scales across controls, text and padding",
};

const DOCS: { title: string; items: NavItem[] }[] = [
  {
    title: "Start",
    items: [
      { route: "docs/get-started", title: getStarted.title, description: "Prompts and setup for AI tools, a codebase or by hand", text: getStarted.text },
      { route: "docs/changelog", title: changelogPage.title, description: "Release notes and design system updates", text: changelogPage.text },
    ],
  },
  {
    title: "Foundations",
    items: [
      ...foundations.map((f) => ({ route: `docs/${f.route}`, title: f.title, description: FOUNDATION_DESCRIPTIONS[f.route] ?? f.keywords, text: foundationText(f) })),
      { route: "docs/density", title: densityPage.title, description: FOUNDATION_DESCRIPTIONS.density, text: densityPage.text },
    ],
  },
];

const componentText = (c: ComponentEntry) =>
  [c.slug, c.description, ...(c.aka ?? []), ...Object.keys(c.classes), ...Object.keys(c.react.components), c.element?.tag ?? "", ...(c.elements?.map((e) => e.tag) ?? [])].join(" ");

/** Everything the search (Mod+E) finds, grouped the way the header is. */
const SEARCH: { title: string; items: NavItem[] }[] = [
  ...DOCS,
  {
    title: "Components",
    items: [...components]
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((c) => ({ route: `components/${c.slug}`, title: c.name, description: c.description, text: componentText(c) })),
  },
  {
    title: "Examples",
    items: showcaseApps.map((a) => ({ route: `examples/${a.id}`, title: `${a.name}, ${a.kind.toLowerCase()}`, description: a.description, text: `${showcase.text} ${a.description}` })),
  },
  { title: "Themes", items: [{ route: "themes", title: "Themes", description: "Brand colours, corners and fonts on a real app", text: brandPage.text }] },
];

function Brand() {
  return (
    <NavbarBrand href="#/" className="pv-brand">
      <svg className="ayy-icon" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="3" />
      </svg>
      ayywi
    </NavbarBrand>
  );
}

function DocsNav({ path }: { path: string }) {
  const page = path.split("/").slice(0, 2).join("/");
  return (
    <AppShellNav id="pv-nav" className="pv-nav" aria-label="Docs">
      {DOCS.map((s) => (
        <AppShellGroup key={s.title} label={s.title}>
          {s.items.map((item) => (
            <AppShellItem key={item.route}>
              <AppShellLink href={`#/${item.route}`} data-route={item.route} current={page === item.route}>
                {item.title}
              </AppShellLink>
            </AppShellItem>
          ))}
        </AppShellGroup>
      ))}
    </AppShellNav>
  );
}

/** Every component A–Z; a family (Input › Textarea, Number field…) opens to show its members. */
function ComponentsNav({ slug }: { slug?: string }) {
  const [filter, setFilter] = useState("");
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const q = filter.trim();
  const matches = (c: ComponentEntry) => !q || commandMatches(c.name, q) || (c.aka ?? []).some((a) => commandMatches(a, q));
  const shown = componentFamilies
    .map(({ parent, children }) => ({ parent, family: children.length > 0, members: [parent, ...children].filter(matches) }))
    .filter((f) => f.members.length);

  const items = q
    ? shown.flatMap((f) => f.members.map((c) => ({ slug: c.slug, name: c.name, href: `#/components/${c.slug}` })))
    : [{ slug: "", name: "Overview", href: "#/components" }, ...shown.flatMap((f) => f.members.map((c) => ({ slug: c.slug, name: c.name, href: `#/components/${c.slug}` })))];

  const effectiveIndex = q
    ? (activeIndex >= 0 && activeIndex < items.length ? activeIndex : items.length ? 0 : -1)
    : (activeIndex >= 0 && activeIndex < items.length ? activeIndex : -1);

  const activeItem = effectiveIndex >= 0 ? items[effectiveIndex] : null;
  const activeSlug = activeItem ? activeItem.slug : null;

  const onFilterChange = (next: string) => {
    setFilter(next);
    setActiveIndex(next.trim() ? 0 : -1);
  };

  const move = (step: number) => {
    if (!items.length) return;
    setActiveIndex((prev) => {
      const current = prev >= 0 && prev < items.length ? prev : (q ? 0 : (step > 0 ? -1 : items.length));
      return (current + step + items.length) % items.length;
    });
  };

  const navigateActive = () => {
    if (activeItem) {
      window.location.hash = activeItem.href;
    }
  };

  useEffect(() => {
    if (effectiveIndex < 0 || !activeItem) return;
    const id = activeItem.slug ? `pv-link-${activeItem.slug}` : "pv-link-overview";
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ block: "nearest" });
  }, [effectiveIndex, activeItem]);

  const link = (c: ComponentEntry, sub?: boolean) => {
    const isActive = effectiveIndex >= 0 && activeSlug === c.slug;
    return (
      <AppShellItem key={c.slug}>
        <AppShellLink
          id={`pv-link-${c.slug}`}
          href={`#/components/${c.slug}`}
          data-route={`components/${c.slug}`}
          current={c.slug === slug}
          sub={sub}
          data-active={isActive ? "true" : undefined}
          aria-selected={isActive ? "true" : undefined}
        >
          {c.name}
        </AppShellLink>
      </AppShellItem>
    );
  };

  const isOverviewActive = effectiveIndex >= 0 && activeSlug === "";

  return (
    <>
      <div className="pv-sidebar__top">
        <SearchBar
          size="md"
          placeholder="Filter components"
          label="Filter components"
          value={filter}
          onValueChange={onFilterChange}
          onKeyDown={(event) => {
            if (event.nativeEvent.isComposing) return;
            switch (event.key) {
              case "ArrowDown":
                event.preventDefault();
                move(1);
                break;
              case "ArrowUp":
                event.preventDefault();
                move(-1);
                break;
              case "Enter":
                if (activeItem) {
                  event.preventDefault();
                  navigateActive();
                }
                break;
              case "Escape":
                if (filter) {
                  event.preventDefault();
                  setFilter("");
                  setActiveIndex(-1);
                }
                break;
            }
          }}
          onSearch={navigateActive}
          aria-controls="pv-nav"
          aria-activedescendant={activeItem ? (activeItem.slug ? `pv-link-${activeItem.slug}` : "pv-link-overview") : undefined}
        />
      </div>
      <AppShellNav id="pv-nav" className="pv-nav" aria-label="Components">
        <ul className="ayy-app-shell__list" aria-label="All components">
          {!q && (
            <AppShellItem>
              <AppShellLink
                id="pv-link-overview"
                href="#/components"
                data-route="components"
                current={!slug}
                data-active={isOverviewActive ? "true" : undefined}
                aria-selected={isOverviewActive ? "true" : undefined}
              >
                Overview
              </AppShellLink>
            </AppShellItem>
          )}
          {shown.map(({ parent, family, members }) =>
            !family ? (
              link(parent)
            ) : (
              <AppShellItem key={parent.slug}>
                <AppShellCollapse
                  label={parent.name}
                  open={Boolean(q) || members.some((c) => c.slug === slug || c.slug === activeSlug) || undefined}
                >
                  {members.map((c) => link(c, true))}
                </AppShellCollapse>
              </AppShellItem>
            ),
          )}
        </ul>
        {!shown.length && <p className="pv-note pv-nav__empty">No component called “{q}”.</p>}
      </AppShellNav>
    </>
  );
}

/** Keep the current link in view: centre it when it's outside the sidebar's visible part. */
function useRevealCurrent(path: string) {
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      const sidebar = document.querySelector<HTMLElement>(".pv-sidebar");
      const link = sidebar?.querySelector<HTMLElement>('#pv-nav [aria-current="page"]');
      if (!sidebar || !link) return;
      const top = sidebar.querySelector<HTMLElement>(".pv-sidebar__top")?.offsetHeight ?? 0;
      const s = sidebar.getBoundingClientRect();
      const l = link.getBoundingClientRect();
      if (l.top >= s.top + top && l.bottom <= s.bottom) return;
      sidebar.scrollTop += l.top - s.top - top - (sidebar.clientHeight - top - l.height) / 2;
    });
    return () => cancelAnimationFrame(id);
  }, [path]);
}

function Search({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [query, setQuery] = useState("");
  const q = query.trim();
  return (
    <CommandDialog
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next);
        if (!next) setQuery("");
      }}
      onSearchChange={setQuery}
      shortcut="Mod+E"
      label="Search the docs"
      placeholder="Search components, docs and examples…"
      onRun={(route) => {
        if (route === undefined) return;
        window.location.hash = `#/${route}`;
        onOpenChange(false);
        setQuery("");
      }}
      footer={
        <>
          <span>
            <Kbd>↑</Kbd> <Kbd>↓</Kbd> to move
          </span>
          <span>
            <Kbd>↵</Kbd> to select
          </span>
          <span>
            <Kbd>esc</Kbd> to close
          </span>
        </>
      }
    >
      {SEARCH.map((section) => (
        <CommandGroup key={section.title} heading={section.title}>
          {section.items.map((item) => {
            const showDescription = Boolean(q && item.description && !commandMatches(item.title, q) && commandMatches(item.description, q));
            return (
              <CommandItem
                key={item.route}
                value={item.route}
                keywords={item.text}
                description={showDescription ? <TextHighlight text={item.description!} query={query} /> : undefined}
                meta={section.title}
              >
                {q ? <TextHighlight text={item.title} query={query} /> : item.title}
              </CommandItem>
            );
          })}
        </CommandGroup>
      ))}
    </CommandDialog>
  );
}

export function App() {
  const { path, route } = useRoute();
  const settings = useSettings();
  const { theme, setTheme, density, setDensity, brand, setBrand, renderer } = settings;
  const appearance = { theme, setTheme, density, setDensity, brand, setBrand };
  const [searchOpen, setSearchOpen] = useState(false);
  const tab = route.tab;
  useRevealCurrent(path);

  // #/docs/colors/status → the Colors page, scrolled to its Status section.
  const part = route.tab === "docs" ? route.part : undefined;
  const docPage = route.tab === "docs" ? route.page : undefined;
  useEffect(() => {
    if (docPage && part) document.getElementById(`${docPage}-${part}`)?.scrollIntoView({ block: "start" });
  }, [docPage, part]);

  const component = route.tab === "components" && route.slug ? components.find((c) => c.slug === route.slug) : undefined;

  let page: ReactNode;
  let sidebar: ReactNode = null;
  let title = "";
  switch (route.tab) {
    case "home":
      page = <Landing onSearch={() => setSearchOpen(true)} />;
      break;
    case "docs": {
      const foundation = foundations.find((f) => f.route === route.page);
      sidebar = <DocsNav path={path} />;
      title = DOCS.flatMap((s) => s.items).find((i) => i.route === `docs/${route.page}`)?.title ?? "Docs";
      page =
        route.page === "changelog" ? (
          <ChangelogPage />
        ) : route.page === "density" ? (
          <DensityPage density={density} setDensity={setDensity} />
        ) : foundation ? (
          <foundation.Page key={foundation.route} />
        ) : (
          <GetStartedPage theme={theme} setTheme={setTheme} density={density} setDensity={setDensity} />
        );
      break;
    }
    case "components":
      sidebar = <ComponentsNav slug={route.slug} />;
      title = component?.name ?? "Components";
      page = component ? <ComponentPage key={component.slug} component={component} view={route.view} renderer={renderer} /> : <ComponentsOverview />;
      break;
    case "examples":
      page = <ShowcasePage id={route.id} />;
      break;
    case "themes":
      page = <ThemesPage current={brand} onUse={setBrand} theme={theme} setTheme={setTheme} />;
      break;
    case "missing":
      page = <NotFound path={route.path} />;
      break;
  }

  const header = (
    <Navbar className="pv-header">
      <Brand />
      <NavbarNav aria-label="Site" className="pv-header__nav">
        {TABS.map((t) => (
          <NavbarLink key={t.tab} href={t.href} current={tab === t.tab}>
            {t.label}
          </NavbarLink>
        ))}
      </NavbarNav>
      <NavbarActions className="pv-header__actions">
        <Tooltip
          side="bottom"
          content={
            <>
              Search <Shortcut keys="Mod+E" />
            </>
          }
        >
          <Button variant="ghost" size="icon" aria-label="Search" aria-haspopup="dialog" aria-expanded={searchOpen} tooltip={false} onClick={() => setSearchOpen(true)}>
            <Icon icon={Search01Icon} />
          </Button>
        </Tooltip>
        <AppearanceMenu {...appearance} />
        <Tooltip side="bottom" content="GitHub">
          <a className={buttonClass({ variant: "ghost", size: "icon", className: "pv-header__github" })} href={GITHUB} target="_blank" rel="noreferrer" aria-label="ayywi on GitHub">
            <Icon icon={GithubIcon} />
          </a>
        </Tooltip>
        <a className={buttonClass({ size: "sm", className: "pv-header__start" })} href="#/docs/get-started">
          Get started
        </a>
      </NavbarActions>
      <NavbarToggle aria-label="Menu" />
    </Navbar>
  );

  return (
    <div className="pv-site" data-tab={tab}>
      {header}
      {sidebar ? (
        <AppShell className="pv-shell" size="md">
          <AppShellBar className="pv-shell-bar">
            {/* A sidebar icon, so it isn't mistaken for the header's menu button beside it. */}
            <AppShellToggle aria-label="Open navigation">
              <Icon icon={SidebarLeftIcon} directional />
            </AppShellToggle>
            <span className="pv-shell-bar__title">{title}</span>
          </AppShellBar>
          <AppShellSidebar className="pv-sidebar ayy-scroll">{sidebar}</AppShellSidebar>
          <AppShellMain className="pv-main">
            <main className="pv-content" id="main">
              {page}
            </main>
          </AppShellMain>
        </AppShell>
      ) : (
        <>
          <main className={`pv-wide pv-wide--${tab}`} id="main">
            {page}
          </main>
          <SiteFooter />
        </>
      )}
      <Search open={searchOpen} onOpenChange={setSearchOpen} />
    </div>
  );
}
