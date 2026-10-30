import { useEffect, useState, type ComponentType } from "react";
import { CATEGORIES, ORDER } from "../../scripts/lib/contract.mjs";

export interface ComponentMeta {
  name: string;
  slug: string;
  category: string;
  /** The component this one is a variation of; the Components sidebar nests it there. */
  family?: string;
  description: string;
  aka?: string[];
  classes: Record<string, string>;
  variants: Record<string, { values: (string | boolean)[]; default: string | boolean }>;
  states: Record<string, { when?: string; looks?: string; none?: string }>;
  sizes: { scale?: Record<string, string>; density: string; width: string };
  js?: string;
  react: { import: string; components: Record<string, { renders: string; props?: Record<string, string> }> };
  element?: { tag: string; children?: string; attributes?: Record<string, string>; events?: Record<string, string> };
  elements?: NonNullable<ComponentMeta["element"]>[];
  a11y: string[];
  do: string[];
  dont: string[];
  examples: { id: string; title: string }[];
}

/** An example's code and React render, loaded when a page first shows it. */
export interface LoadedExample {
  Component: ComponentType | null;
  reactSource: string;
  htmlSource: string;
}

export interface ExampleEntry {
  id: string;
  title: string;
  /** False for an HTML-only example. */
  hasReact: boolean;
  load: () => Promise<LoadedExample>;
  /** What load() resolved to, once it has. */
  peek: () => LoadedExample | undefined;
}

export interface ComponentEntry extends ComponentMeta {
  examples: ExampleEntry[];
}

const metas = import.meta.glob<ComponentMeta>("../../src/components/*/*.meta.json", { eager: true, import: "default" });
// Lazy: every example's module and source is its own small chunk, so a page downloads only the examples it shows.
const reactModules = import.meta.glob<ComponentType>("../../src/components/*/examples/*.tsx", { import: "default" });
const reactSources = import.meta.glob<string>("../../src/components/*/examples/*.tsx", { query: "?raw", import: "default" });
const htmlSources = import.meta.glob<string>("../../src/components/*/examples/*.html", { query: "?raw", import: "default" });

const none = () => Promise.resolve(null);

function loader(base: string): Pick<ExampleEntry, "load" | "peek"> {
  let loading: Promise<LoadedExample> | undefined;
  let loaded: LoadedExample | undefined;
  const load = () =>
    (loading ??= Promise.all([
      (reactModules[`${base}.tsx`] ?? none)(),
      (reactSources[`${base}.tsx`] ?? none)(),
      (htmlSources[`${base}.html`] ?? none)(),
    ]).then(([Component, reactSource, htmlSource]) => (loaded = {
      Component: Component ?? null,
      reactSource: (reactSource ?? "").trimEnd(),
      htmlSource: (htmlSource ?? "").trimEnd(),
    })));
  return { load, peek: () => loaded };
}

/**
 * The example once it has loaded: at once when an earlier page already loaded it, otherwise after the fetch. A state
 * update rather than Suspense, which would hold every revealed example back for ~300 ms (React's fallback throttle).
 */
export function useExample(example: ExampleEntry | undefined): LoadedExample | undefined {
  const [loaded, setLoaded] = useState(() => example?.peek());
  useEffect(() => {
    if (!example) return setLoaded(undefined);
    const ready = example.peek();
    if (ready) return setLoaded(ready);
    let live = true;
    void example.load().then((value) => live && setLoaded(value));
    return () => {
      live = false;
    };
  }, [example]);
  return example && (loaded ?? example.peek());
}

const rank = (list: string[], x: string) => (list.includes(x) ? list.indexOf(x) : list.length);
const CATEGORY_ORDER = Object.keys(CATEGORIES);

export const components: ComponentEntry[] = Object.values(metas)
  .map((meta) => ({
    ...meta,
    examples: meta.examples.map((ex) => {
      const base = `../../src/components/${meta.slug}/examples/${ex.id}`;
      return { ...ex, hasReact: `${base}.tsx` in reactModules, ...loader(base) };
    }),
  }))
  .sort((a, b) => rank(CATEGORY_ORDER, a.category) - rank(CATEGORY_ORDER, b.category) || rank(ORDER, a.slug) - rank(ORDER, b.slug));

/** Components grouped by category, in display order. */
export const componentGroups: { category: string; description: string; components: ComponentEntry[] }[] = [
  ...new Set(components.map((c) => c.category)),
].map((category) => ({ category, description: CATEGORIES[category] ?? "", components: components.filter((c) => c.category === category) }));

/** The Components sidebar: every component A–Z, each with the variations that name it as their family, A–Z too. */
export const componentFamilies: { parent: ComponentEntry; children: ComponentEntry[] }[] = components
  .filter((c) => !c.family)
  .map((parent) => ({ parent, children: components.filter((c) => c.family === parent.slug).sort((a, b) => a.name.localeCompare(b.name)) }))
  .sort((a, b) => a.parent.name.localeCompare(b.parent.name));
