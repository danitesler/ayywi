import { useEffect, useState } from "react";
import { PaintBoardIcon, Tick02Icon } from "@hugeicons/core-free-icons";
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
  CommandDialog,
  CommandGroup,
  CommandItem,
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
  Icon,
  Kbd,
  SearchBar,
} from "@danitesler/ayywi/react";
import { brandPresets, type BrandInput, type DensityMode, type ThemeMode } from "@danitesler/ayywi";
import { brandPage, BrandPage } from "./pages/Brand";
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
    items: [
      ...foundations.map((f) => ({ route: f.route, title: f.title, text: foundationText(f) })),
      { route: brandPage.route, title: brandPage.title, text: brandPage.text },
    ],
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


const DENSITY_OPTIONS: [DensityMode, string][] = [
  ["auto", "Auto"],
  ["compact", "Compact"],
  ["comfortable", "Comfortable"],
  ["touch", "Touch"],
];

const THEME_OPTIONS: [ThemeMode, string][] = [["system", "System"], ...themeOptions.map((t): [ThemeMode, string] => [t.name, t.label])];

interface AppearanceProps {
  theme: ThemeMode;
  setTheme: (v: ThemeMode) => void;
  density: DensityMode;
  setDensity: (v: DensityMode) => void;
  brand: BrandInput | null;
  setBrand: (v: BrandInput | null) => void;
}

/** One menu for theme, density and brand, so the sidebar footer stays just navigation. */
function AppearanceMenu({ theme, setTheme, density, setDensity, brand, setBrand }: AppearanceProps) {
  // Mono, the shipped brands, and the one made on the Brand page if it's in use.
  const brandOptions: [string, string][] = [["", "Mono"], ...Object.keys(brandPresets).map((n): [string, string] => [n, n.charAt(0).toUpperCase() + n.slice(1)])];
  if (brand && !(brand.name in brandPresets)) brandOptions.push([brand.name, `${brand.name} (Brand page)`]);
  const pickBrand = (name: string) => setBrand(name === "" ? null : name in brandPresets ? brandPresets[name as keyof typeof brandPresets] : brand);
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
      <DropdownMenuTrigger variant="ghost" size="sm">
        <Icon icon={PaintBoardIcon} />
        Theme
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" aria-label="Theme, density and brand">
        {group("Theme", theme, THEME_OPTIONS, setTheme)}
        <DropdownMenuSeparator />
        {group("Density", density, DENSITY_OPTIONS, setDensity)}
        <DropdownMenuSeparator />
        {group("Brand", brand?.name ?? "", brandOptions, pickBrand)}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function App() {
  const raw = useHashRoute();
  const route = raw === "tokens" ? "colors" : raw === "get-started" ? "" : raw; // old links
  const [page, part] = route.split("/");
  const { theme, setTheme, density, setDensity, brand, setBrand, renderer } = useSettings();
  const appearance = { theme, setTheme, density, setDensity, brand, setBrand };
  const component = components.find((c) => c.slug === route);
  const foundation = foundations.find((f) => f.route === page);

  // #/colors/status → the Colors page, scrolled to its Status section.
  useEffect(() => {
    if (part) document.getElementById(`${page}-${part}`)?.scrollIntoView({ block: "start" });
  }, [page, part]);

  const [commandOpen, setCommandOpen] = useState(false);

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
          <AppearanceMenu {...appearance} />
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
                <AppearanceMenu {...appearance} />
              </span>
            </div>
          </div>
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
              role: "button",
              tabIndex: 0,
              "aria-haspopup": "dialog",
              "aria-expanded": commandOpen,
              onClick: () => setCommandOpen(true),
            }}
          />
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
          if (route) {
            window.location.hash = `#/${route}`;
            setCommandOpen(false);
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
