import type { ComponentType } from "react";

export interface ComponentMeta {
  name: string;
  slug: string;
  status: string;
  category: string;
  description: string;
  classes: Record<string, string>;
  variants: Record<string, { values: (string | boolean)[]; default: string | boolean }>;
  states?: Record<string, string>;
  js?: string;
  react: { import: string; components: Record<string, { renders: string; props?: Record<string, string> }> };
  element?: { tag: string };
  a11y: string[];
  do: string[];
  dont: string[];
  examples: { id: string; title: string }[];
}

export interface ExampleEntry {
  id: string;
  title: string;
  Component: ComponentType | null;
  reactSource: string;
  htmlSource: string;
}

export interface ComponentEntry extends ComponentMeta {
  examples: ExampleEntry[];
}

const metas = import.meta.glob<ComponentMeta>("../../src/components/*/*.meta.json", { eager: true, import: "default" });
const reactModules = import.meta.glob<ComponentType>("../../src/components/*/examples/*.tsx", { eager: true, import: "default" });
const reactSources = import.meta.glob<string>("../../src/components/*/examples/*.tsx", { eager: true, query: "?raw", import: "default" });
const htmlSources = import.meta.glob<string>("../../src/components/*/examples/*.html", { eager: true, query: "?raw", import: "default" });

// Keep in sync with CATEGORIES in scripts/lib/contract.mjs and ORDER in scripts/build-manifest.mjs. Unknown ones sort last.
export const CATEGORIES: Record<string, string> = {
  Actions: "Things people click to do something.",
  Navigation: "Getting around a site and a page.",
  Forms: "Inputs, choices and their labels.",
  Layout: "Containers and ways to organise content.",
  Overlays: "Content that floats above the page.",
  Feedback: "Status, progress and messages.",
  "Data display": "Values, people and records.",
};
const ORDER = [
  "button", "menu", "theme-toggle",
  "navbar", "app-shell", "bottom-nav", "breadcrumb", "toc",
  "field", "input", "textarea", "select", "checkbox", "radio", "switch",
  "section", "card", "tabs", "carousel", "separator",
  "dialog", "popover", "tooltip",
  "alert", "toast", "progress", "skeleton",
  "badge", "avatar", "icon", "icon-tile", "stat", "data-list", "frame", "chat", "table",
];
const rank = (list: string[], x: string) => (list.includes(x) ? list.indexOf(x) : list.length);
const CATEGORY_ORDER = Object.keys(CATEGORIES);

export const components: ComponentEntry[] = Object.values(metas)
  .map((meta) => ({
    ...meta,
    examples: meta.examples.map((ex) => {
      const base = `../../src/components/${meta.slug}/examples/${ex.id}`;
      return {
        ...ex,
        Component: reactModules[`${base}.tsx`] ?? null,
        reactSource: (reactSources[`${base}.tsx`] ?? "").trimEnd(),
        htmlSource: (htmlSources[`${base}.html`] ?? "").trimEnd(),
      };
    }),
  }))
  .sort((a, b) => rank(CATEGORY_ORDER, a.category) - rank(CATEGORY_ORDER, b.category) || rank(ORDER, a.slug) - rank(ORDER, b.slug));

/** Components grouped by category, in display order. */
export const componentGroups: { category: string; description: string; components: ComponentEntry[] }[] = [
  ...new Set(components.map((c) => c.category)),
].map((category) => ({ category, description: CATEGORIES[category] ?? "", components: components.filter((c) => c.category === category) }));
