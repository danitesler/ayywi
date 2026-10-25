import { useEffect, useRef, useState } from "react";
import { components } from "./data";

/** The header's tabs. Each owns the first segment of the hash: #/docs/colors, #/components/button/properties. */
export type Tab = "home" | "docs" | "components" | "examples" | "themes" | "missing";

export const COMPONENT_VIEWS = ["overview", "properties", "accessibility"] as const;
export type ComponentView = (typeof COMPONENT_VIEWS)[number];

export type Route =
  | { tab: "home" }
  | { tab: "docs"; page: string; part?: string }
  | { tab: "components"; slug?: string; view: ComponentView }
  | { tab: "examples"; id?: string }
  | { tab: "themes" }
  | { tab: "missing"; path: string };

export const GITHUB = "https://github.com/danitesler/ayywi";

export const TABS: { tab: Tab; label: string; href: string }[] = [
  { tab: "docs", label: "Docs", href: "#/docs/get-started" },
  { tab: "components", label: "Components", href: "#/components" },
  { tab: "examples", label: "Examples", href: "#/examples" },
  { tab: "themes", label: "Themes", href: "#/themes" },
];

/** Docs pages, in sidebar order. */
export const DOC_PAGES = ["get-started", "changelog", "colors", "typography", "spacing", "elevation", "motion", "density"];

const slugs = new Set(components.map((c) => c.slug));

/** Links from before the header tabs (#/button, #/colors/status, #/apps/inbox, #/brand) → where that page lives now. */
export function canonical(path: string): string {
  const [first = "", second, ...rest] = path.split("/");
  switch (first) {
    case "":
      return "";
    case "docs":
      return second ? path : "docs/get-started";
    case "components":
    case "examples":
    case "themes":
      return path;
    case "get-started":
      return "docs/get-started";
    case "tokens":
      return "docs/colors";
    case "brand":
      return "themes";
    case "apps":
    case "showcase":
      return ["examples", second, ...rest].filter(Boolean).join("/");
  }
  if (DOC_PAGES.includes(first)) return `docs/${path}`;
  if (slugs.has(first)) return `components/${path}`;
  return path;
}

export function parse(path: string): Route {
  const [first, second, third] = path.split("/");
  if (!first) return { tab: "home" };
  if (first === "docs" && second && DOC_PAGES.includes(second)) return { tab: "docs", page: second, part: third };
  if (first === "components") {
    if (!second) return { tab: "components", view: "overview" };
    if (!slugs.has(second)) return { tab: "missing", path };
    const view = (COMPONENT_VIEWS as readonly string[]).includes(third ?? "") ? (third as ComponentView) : "overview";
    return { tab: "components", slug: second, view };
  }
  if (first === "examples") return { tab: "examples", id: second };
  if (first === "themes") return { tab: "themes" };
  return { tab: "missing", path };
}

const read = () => decodeURIComponent(window.location.hash.replace(/^#\/?/, ""));

/** The current route. An old link is rewritten in place (no new history entry), so Back still works. */
export function useRoute(): { path: string; route: Route } {
  const settle = () => {
    const raw = read();
    const path = canonical(raw);
    if (path !== raw) history.replaceState(history.state, "", `#/${path}`);
    return path;
  };
  const [path, setPath] = useState(settle);
  const last = useRef(path);
  useEffect(() => {
    const onChange = () => {
      const next = settle();
      const page = (p: string) => p.split("/").slice(0, 2).join("/");
      // Switching a component page's tab keeps the scroll position; anything else starts at the top.
      if (!next.startsWith("components/") || page(next) !== page(last.current)) window.scrollTo(0, 0);
      last.current = next;
      setPath(next);
    };
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);
  return { path, route: parse(path) };
}
