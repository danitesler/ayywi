import { useEffect, useRef, useState } from "react";
import { ALargeSmallIcon, ColorsIcon, Moon02Icon, Search01Icon, Settings01Icon, SidebarLeftIcon, Sun03Icon } from "@hugeicons/core-free-icons";
import {
  AppShell,
  AppShellBar,
  AppShellBrand,
  AppShellGroup,
  AppShellHead,
  AppShellItem,
  AppShellLink,
  AppShellNav,
  AppShellSidebar,
  AppShellToggle,
  Button,
  CommandDialog,
  CommandGroup,
  CommandItem,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  Icon,
  Kbd,
  SearchBar,
  SwatchCustom,
} from "@danitesler/ayywi/react";
import { type AppShellSize, type BrandInput, type DensityMode, type ThemeMode } from "@danitesler/ayywi";
import { brandPage, BrandPage, BRAND_PRESETS } from "./pages/Brand";
import { changelogPage, ChangelogPage } from "./pages/Changelog";
import { componentGroups, components } from "./data";
import { ComponentPage } from "./pages/ComponentPage";
import { foundations, foundationText } from "./pages/Foundations";
import { getStarted, GetStartedPage } from "./pages/GetStarted";
import { showcase, ShowcasePage } from "./pages/Showcase";
import { useHashRoute, useSettings, useSidebarCollapsed, useSidebarSize } from "./settings";


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
    items: [
      ...foundations.map((f) => ({ route: f.route, title: f.title, text: foundationText(f) })),
      { route: brandPage.route, title: brandPage.title, text: brandPage.text },
    ].sort((a, b) => a.title.localeCompare(b.title)),
  },
  ...componentGroups.map((g) => ({
    title: g.category,
    items: g.components
      .map((c) => ({
        route: c.slug,
        title: c.name,
        text: [c.slug, c.description, ...Object.keys(c.classes), ...Object.keys(c.react.components), c.element?.tag ?? ""].join(" "),
      }))
      .sort((a, b) => a.title.localeCompare(b.title)),
  })),
];


const DENSITY_OPTIONS: [DensityMode, string][] = [
  ["auto", "Auto"],
  ["compact", "Compact"],
  ["comfortable", "Comfortable"],
  ["touch", "Touch"],
];

const SIDEBAR_SIZE_OPTIONS: [AppShellSize, string][] = [
  ["sm", "Small"],
  ["md", "Big"],
];

const THEME_OPTIONS: [ThemeMode, string][] = [
  ["system", "System"],
  ["dark", "Dark"],
  ["dark-contrast", "Dark contrast"],
  ["light", "Light"],
  ["light-gray", "Light gray"],
];

interface AppearanceProps {
  theme: ThemeMode;
  setTheme: (v: ThemeMode) => void;
  density: DensityMode;
  setDensity: (v: DensityMode) => void;
  brand: BrandInput | null;
  setBrand: (v: BrandInput | null) => void;
  sidebarSize: AppShellSize;
  setSidebarSize: (v: AppShellSize) => void;
}

/** Theme, density, brand and sidebar in one menu with submenu flyouts. Same control in the sidebar and the phone bar. */
function AppearanceMenu({ theme, setTheme, density, setDensity, brand, setBrand, sidebarSize, setSidebarSize }: AppearanceProps) {
  const customColorRef = useRef<HTMLInputElement>(null);
  const isCustom = Boolean(brand && !BRAND_PRESETS.some((p) => !p.isMono && p.name === brand.name));
  const customHex = isCustom && /^#[0-9a-f]{6}$/i.test(brand?.color ?? "") ? brand!.color : "#0ea5e9";
  const currentBrandKey = !brand || brand.name === "mono" ? "mono" : isCustom ? "custom" : brand.name;

  const pickBrand = (name: string) => {
    if (name === "mono" || name === "") {
      setBrand(null);
      return;
    }
    if (name === "custom") {
      pickCustomColor(customHex);
      return;
    }
    const preset = BRAND_PRESETS.find((p) => p.name === name);
    if (preset) {
      if (preset.isMono) {
        setBrand(null);
      } else {
        setBrand({ name: preset.name, color: preset.color, shape: preset.shape });
      }
    }
  };

  const pickCustomColor = (color: string) => {
    const hex = /^#[0-9a-f]{6}$/i.test(color) ? color : "#0ea5e9";
    setBrand({ name: "custom", color: hex, shape: brand?.shape ?? "pill" });
  };

  const themeLabel = THEME_OPTIONS.find(([key]) => key === theme)?.[1] ?? theme;
  const densityLabel = DENSITY_OPTIONS.find(([key]) => key === density)?.[1] ?? density;
  const brandLabel = isCustom ? "Custom" : (BRAND_PRESETS.find((p) => p.name === currentBrandKey)?.label ?? "Mono");
  const sidebarLabel = SIDEBAR_SIZE_OPTIONS.find(([key]) => key === sidebarSize)?.[1] ?? sidebarSize;
  const isLight = theme === "light" || theme === "light-gray";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger variant="outline" size="icon" aria-label="Appearance">
        <Icon icon={Settings01Icon} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" aria-label="Appearance">
        <DropdownMenuSub>
          <DropdownMenuSubTrigger icon={<Icon icon={isLight ? Sun03Icon : Moon02Icon} />} value={themeLabel}>Theme</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuRadioGroup value={theme} onValueChange={(v) => setTheme(v as ThemeMode)}>
              {THEME_OPTIONS.map(([key, text]) => (
                <DropdownMenuRadioItem key={key} value={key}>
                  {text}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger icon={<Icon icon={ALargeSmallIcon} />} value={densityLabel}>Density</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuRadioGroup value={density} onValueChange={(v) => setDensity(v as DensityMode)}>
              {DENSITY_OPTIONS.map(([key, text]) => (
                <DropdownMenuRadioItem key={key} value={key}>
                  {text}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger icon={<Icon icon={ColorsIcon} />} value={brandLabel}>Brand</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuRadioGroup value={currentBrandKey} onValueChange={pickBrand}>
              {BRAND_PRESETS.map((p) => (
                <DropdownMenuRadioItem key={p.name} value={p.name}>
                  {p.label}
                </DropdownMenuRadioItem>
              ))}
              <div className="pv-menu-custom-color">
                <DropdownMenuRadioItem
                  value="custom"
                  onClick={() => {
                    customColorRef.current?.showPicker ? customColorRef.current.showPicker() : customColorRef.current?.click();
                  }}
                >
                  Custom colour
                </DropdownMenuRadioItem>
                <SwatchCustom
                  ref={customColorRef}
                  size="sm"
                  label="Pick custom colour"
                  value={customHex}
                  onChange={(e) => pickCustomColor(e.target.value)}
                  onInput={(e) => pickCustomColor(e.currentTarget.value)}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </DropdownMenuRadioGroup>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger icon={<Icon icon={SidebarLeftIcon} directional />} value={sidebarLabel}>Sidebar</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuRadioGroup value={sidebarSize} onValueChange={(v) => setSidebarSize(v as AppShellSize)}>
              {SIDEBAR_SIZE_OPTIONS.map(([key, text]) => (
                <DropdownMenuRadioItem key={key} value={key}>
                  {text}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function App() {
  const raw = useHashRoute();
  const route = raw === "tokens" ? "colors" : raw === "get-started" ? "" : raw; // old links
  const [page, part] = route.split("/");
  const { theme, setTheme, density, setDensity, brand, setBrand, renderer } = useSettings();
  const component = components.find((c) => c.slug === route);
  const foundation = foundations.find((f) => f.route === page);

  // #/colors/status → the Colors page, scrolled to its Status section.
  useEffect(() => {
    if (part) document.getElementById(`${page}-${part}`)?.scrollIntoView({ block: "start" });
  }, [page, part]);

  const [commandOpen, setCommandOpen] = useState(false);
  const [collapsed, setCollapsed] = useSidebarCollapsed();
  const [sidebarSize, setSidebarSize] = useSidebarSize();
  const appearance = { theme, setTheme, density, setDensity, brand, setBrand, sidebarSize, setSidebarSize };

  const scrollNavTo = (targetRoute: string) => {
    const base = targetRoute.split("/")[0] ?? targetRoute;
    const linkEl =
      document.querySelector<HTMLElement>(`#pv-nav [data-route="${CSS.escape(base)}"]`) ??
      document.querySelector<HTMLElement>(`#pv-nav a[href="#/${base}"]`);
    if (!linkEl) return;

    const sidebar = document.querySelector<HTMLElement>(".pv-sidebar");
    if (!sidebar) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const topBar = sidebar.querySelector<HTMLElement>(".pv-sidebar__top");
    const topOffset = topBar ? topBar.offsetHeight : 0;
    const visibleHeight = sidebar.clientHeight - topOffset;
    const visibleCenter = topOffset + visibleHeight / 2;

    const linkRect = linkEl.getBoundingClientRect();
    const sidebarRect = sidebar.getBoundingClientRect();
    const relativeLinkTop = linkRect.top - sidebarRect.top;
    const linkCenter = relativeLinkTop + linkEl.offsetHeight / 2;
    const delta = linkCenter - visibleCenter;

    const maxScroll = Math.max(0, sidebar.scrollHeight - sidebar.clientHeight);
    const targetTop = Math.max(0, Math.min(sidebar.scrollTop + delta, maxScroll));

    if (prefersReduced) {
      sidebar.scrollTop = targetTop;
      return;
    }

    const startTop = sidebar.scrollTop;
    const distance = targetTop - startTop;
    if (Math.abs(distance) < 2) return;

    const duration = Math.min(550, Math.max(350, Math.round(Math.abs(distance) * 0.4)));
    const startTime = performance.now();
    const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

    let rafId: number;
    const onUserInterrupt = () => {
      cancelAnimationFrame(rafId);
      sidebar.removeEventListener("wheel", onUserInterrupt);
      sidebar.removeEventListener("touchmove", onUserInterrupt);
    };

    sidebar.addEventListener("wheel", onUserInterrupt, { passive: true });
    sidebar.addEventListener("touchmove", onUserInterrupt, { passive: true });

    const step = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      sidebar.scrollTop = startTop + distance * easeInOutCubic(progress);

      if (progress < 1) {
        rafId = requestAnimationFrame(step);
      } else {
        sidebar.removeEventListener("wheel", onUserInterrupt);
        sidebar.removeEventListener("touchmove", onUserInterrupt);
      }
    };

    rafId = requestAnimationFrame(step);
  };

  const link = (item: NavItem) => {
    const current = page === item.route;
    return (
      <AppShellLink
        href={`#/${item.route}`}
        data-route={item.route}
        className="pv-nav__link"
        current={current}
        aria-current={current ? "page" : undefined}
      >
        {item.title}
      </AppShellLink>
    );
  };

  return (
    <AppShell className="pv-shell" size={sidebarSize} collapsed={collapsed} onCollapseChange={setCollapsed}>
      <AppShellBar className="pv-shell-bar">
        <AppShellToggle aria-label="Open navigation" />
        <AppShellBrand href="#/" className="pv-brand">
          <span className="pv-brand__mark" aria-hidden="true" />
          ayywi
        </AppShellBrand>
        <div className="pv-shell-bar__actions">
          <AppearanceMenu {...appearance} />
        </div>
      </AppShellBar>
      <AppShellSidebar className="pv-sidebar ayy-scroll">
        <div className="pv-sidebar__top">
          <AppShellHead className="pv-sidebar__head">
            {/* Collapses the sidebar to a rail on wide screens; resting the pointer on the rail previews it (the App shell default). */}
            <AppShellToggle aria-label="Sidebar" className="pv-sidebar__toggle">
              <Icon icon={SidebarLeftIcon} directional />
            </AppShellToggle>
            <AppShellBrand href="#/" className="pv-brand">
              <span className="pv-brand__mark" aria-hidden="true" />
              <span>ayywi</span>
            </AppShellBrand>
            <div className="pv-sidebar__actions">
              {/* On phones the bar carries this menu. */}
              <span className="pv-sidebar__appearance">
                <AppearanceMenu {...appearance} />
              </span>
            </div>
          </AppShellHead>
          <div className="pv-finder">
            {/* The rail's stand-in for the search field. Mouse only: keyboard focus opens the full sidebar, field included. */}
            <Button variant="ghost" size="icon" className="pv-finder__rail" aria-label="Search" tabIndex={-1} onClick={() => setCommandOpen(true)}>
              <Icon icon={Search01Icon} />
            </Button>
            <SearchBar
              placeholder="Search"
              label="Search components and foundations"
              shortcut="Mod+E"
              readOnly
              onClick={() => setCommandOpen(true)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setCommandOpen(true);
                }
              }}
              formProps={{
                "aria-haspopup": "dialog",
                "aria-expanded": commandOpen,
                onClick: () => setCommandOpen(true),
              }}
            />
          </div>
        </div>
        <AppShellNav id="pv-nav" className="pv-nav" aria-label="Design system">
          {SECTIONS.map((s) => (
            <AppShellGroup key={s.title} label={s.title}>
              {s.items.map((item) => (
                <AppShellItem key={item.route || "overview"}>{link(item)}</AppShellItem>
              ))}
            </AppShellGroup>
          ))}
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
          ) : page === brandPage.route ? (
            <BrandPage current={brand} onUse={setBrand} />
          ) : foundation ? (
            <foundation.Page key={foundation.route} />
          ) : (
            <GetStartedPage theme={theme} setTheme={setTheme} density={density} setDensity={setDensity} />
          )}
        </main>
      </div>

      <CommandDialog
        open={commandOpen}
        onOpenChange={setCommandOpen}
        shortcut="Mod+E"
        label="Search components and foundations"
        placeholder="Search components and foundations…"
        onRun={(route) => {
          if (route !== undefined) {
            window.location.hash = `#/${route}`;
            setCommandOpen(false);
            requestAnimationFrame(() => {
              scrollNavTo(route);
            });
          }
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
        {SECTIONS.map((section) => (
          <CommandGroup key={section.title} heading={section.title}>
            {section.items.map((item) => (
              <CommandItem
                key={item.route}
                value={item.route}
                keywords={item.text}
                meta={section.title}
              >
                {item.title}
              </CommandItem>
            ))}
          </CommandGroup>
        ))}
      </CommandDialog>
    </AppShell>
  );
}
