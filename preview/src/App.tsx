import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { Button, Select } from "ayywi/react";
import type { DensityMode, ThemeMode } from "ayywi";
import { componentGroups, components } from "./data";
import { ComponentPage } from "./pages/ComponentPage";
import { foundations, foundationText } from "./pages/Foundations";
import { HomePage } from "./pages/HomePage";
import { useHashRoute, useSettings, type Brand, type Renderer } from "./settings";
import { themeOptions } from "./themes";

interface NavItem {
  route: string;
  title: string;
  /** Everything the search matches against. */
  text: string;
  /** Sections of the page, listed under it (Colors → Surfaces, Text, Status…). */
  children?: NavItem[];
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const SECTIONS: NavSection[] = [
  { title: "Start", items: [{ route: "", title: "Overview", text: "home install quick start ai agents" }] },
  {
    title: "Foundations",
    items: foundations.map((f) => ({
      route: f.route,
      title: f.title,
      text: foundationText(f),
      children: f.sections?.map((sec) => ({ route: `${f.route}/${sec.id}`, title: sec.title, text: `${f.title} ${sec.text}` })),
    })),
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

/** Every word must appear in the item, its section or its search text. A page stays listed when one of its sections matches. */
function search(query: string): NavSection[] {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (!words.length) return SECTIONS;
  const matches = (section: NavSection, item: NavItem) => {
    const haystack = `${section.title} ${item.title} ${item.text}`.toLowerCase();
    return words.every((w) => haystack.includes(w));
  };
  return SECTIONS.map((s) => ({
    ...s,
    items: s.items.flatMap((item) => {
      const children = item.children?.filter((child) => matches(s, child));
      return matches(s, item) || children?.length ? [{ ...item, children }] : [];
    }),
  })).filter((s) => s.items.length > 0);
}

const flat = (items: NavItem[]): NavItem[] => items.flatMap((i) => [i, ...(i.children ?? [])]);

const sectionId = (title: string) => `pv-nav-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

function Segmented<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: [T, string][];
  onChange: (value: T) => void;
}) {
  return (
    <div className="pv-seg" role="group" aria-label={label}>
      <span className="pv-seg__label">{label}</span>
      {options.map(([key, text]) => (
        <Button key={key} size="sm" variant={value === key ? "secondary" : "ghost"} aria-pressed={value === key} onClick={() => onChange(key)}>
          {text}
        </Button>
      ))}
    </div>
  );
}

function Picker<T extends string>({ id, label, value, options, onChange }: { id: string; label: string; value: T; options: [T, string][]; onChange: (value: T) => void }) {
  return (
    <div className="pv-seg">
      <span className="pv-seg__label" id={id}>
        {label}
      </span>
      <Select size="sm" aria-labelledby={id} value={value} onChange={(e) => onChange(e.target.value as T)}>
        {options.map(([key, text]) => (
          <option key={key} value={key}>
            {text}
          </option>
        ))}
      </Select>
    </div>
  );
}

export function App() {
  const raw = useHashRoute();
  const route = raw === "tokens" ? "colors" : raw; // old links
  const [page, part] = route.split("/");
  const { theme, setTheme, density, setDensity, brand, setBrand, renderer, setRenderer } = useSettings();
  const component = components.find((c) => c.slug === route);
  const foundation = foundations.find((f) => f.route === page);

  // #/colors/status → the Colors page, scrolled to its Status section.
  useEffect(() => {
    if (part) document.getElementById(`${page}-${part}`)?.scrollIntoView({ block: "start" });
  }, [page, part]);

  const [query, setQuery] = useState("");
  const sections = useMemo(() => search(query), [query]);
  const results = flat(sections.flatMap((s) => s.items));
  const searchRef = useRef<HTMLInputElement>(null);
  const navRef = useRef<HTMLElement>(null);

  // "/" or Ctrl/⌘K jumps to search from anywhere.
  useEffect(() => {
    const onKey = (event: globalThis.KeyboardEvent) => {
      const typing = (event.target as Element | null)?.closest?.("input, textarea, select, [contenteditable='true']");
      if ((event.key === "/" && !typing) || (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey))) {
        event.preventDefault();
        searchRef.current?.focus();
        searchRef.current?.select();
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
      else searchRef.current?.blur();
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      navRef.current?.querySelector<HTMLElement>("a")?.focus();
    }
  };

  const link = (item: NavItem, sub = false) => {
    const current = sub ? (route === item.route ? "location" : undefined) : page === item.route || route === item.route ? "page" : undefined;
    return (
      <a href={`#/${item.route}`} className={sub ? "pv-nav__link pv-nav__link--sub" : "pv-nav__link"} aria-current={current}>
        {item.title}
      </a>
    );
  };

  return (
    <div className="pv-shell">
      <aside className="pv-sidebar ayy-scroll">
        <a href="#/" className="pv-brand">
          <span className="pv-brand__mark" aria-hidden="true" />
          ayywi
        </a>
        <div className="pv-search" role="search">
          <input
            ref={searchRef}
            className="ayy-input pv-search__input"
            type="search"
            placeholder="Search"
            aria-label="Search components and foundations"
            aria-controls="pv-nav"
            aria-keyshortcuts="/ Control+K Meta+K"
            autoComplete="off"
            spellCheck={false}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onSearchKey}
          />
          <kbd className="pv-search__kbd" aria-hidden="true">
            /
          </kbd>
        </div>
        <p className="ayy-sr-only" role="status">
          {query ? `${results.length} result${results.length === 1 ? "" : "s"}` : ""}
        </p>
        <nav id="pv-nav" ref={navRef} className="pv-nav" aria-label="Design system">
          {sections.length ? (
            sections.map((s) => (
              <div className="pv-nav__section" key={s.title}>
                <p className="ayy-eyebrow pv-nav__group" id={sectionId(s.title)}>
                  {s.title}
                </p>
                <ul className="pv-nav__list" aria-labelledby={sectionId(s.title)}>
                  {s.items.map((item) => (
                    <li key={item.route || "overview"}>
                      {link(item)}
                      {item.children?.length ? (
                        <ul className="pv-nav__sub" aria-label={`${item.title} sections`}>
                          {item.children.map((child) => (
                            <li key={child.route}>{link(child, true)}</li>
                          ))}
                        </ul>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </div>
            ))
          ) : (
            <p className="pv-nav__empty">No matches for “{query}”.</p>
          )}
        </nav>
      </aside>

      <div className="pv-main">
        <div className="pv-toolbar">
          <Segmented<ThemeMode>
            label="Theme"
            value={theme}
            onChange={setTheme}
            options={[["system", "System"], ...themeOptions.map((t): [ThemeMode, string] => [t.name, t.label])]}
          />
          <Picker<DensityMode>
            id="pv-density"
            label="Density"
            value={density}
            onChange={setDensity}
            options={[
              ["auto", "Auto"],
              ["compact", "Compact"],
              ["comfortable", "Comfortable"],
              ["touch", "Touch"],
            ]}
          />
          <Picker<Brand>
            id="pv-brand"
            label="Brand"
            value={brand}
            onChange={setBrand}
            options={[
              ["default", "Default"],
              ["violet", "Violet"],
            ]}
          />
          {component ? (
            <Segmented<Renderer>
              label="Render with"
              value={renderer}
              onChange={setRenderer}
              options={[
                ["react", "React"],
                ["html", "Plain HTML"],
              ]}
            />
          ) : null}
        </div>

        <main className="pv-content" id="main">
          {component ? (
            <ComponentPage key={component.slug} component={component} renderer={renderer} />
          ) : foundation ? (
            <foundation.Page key={foundation.route} />
          ) : (
            <HomePage />
          )}
        </main>
      </div>
    </div>
  );
}
