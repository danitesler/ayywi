import { useEffect, useRef, useState } from "react";
import { Card, CardHeader, CardLink, CardMedia } from "@danitesler/ayywi/react";
import { componentGroups, components, useExample, type ComponentEntry, type ExampleEntry } from "../data";

/**
 * An example rendered live but small: decorative (inert, hidden from assistive tech), drawn once it nears the viewport so
 * a page of them doesn't block the first paint. It follows the page's theme, density and brand like everything else.
 */
export function Thumb({ example, zoom = 0.6, className }: { example: ExampleEntry | undefined; zoom?: number; className?: string }) {
  const box = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  // Zoom scales lengths but not percentages, so the example gets the box's width in its own (zoomed) pixels.
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setShown(true);
        io.disconnect();
      }
    }, { rootMargin: "400px 0px" });
    const ro = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    io.observe(el);
    ro.observe(el);
    return () => {
      io.disconnect();
      ro.disconnect();
    };
  }, []);
  return (
    <div ref={box} className={`pv-thumb ${className ?? ""}`} aria-hidden="true" inert>
      {shown && width > 0 && example?.hasReact && (
        <div className="pv-thumb__inner" style={{ zoom, inlineSize: width / zoom }}>
          <ThumbExample example={example} />
        </div>
      )}
    </div>
  );
}

function ThumbExample({ example }: { example: ExampleEntry }) {
  const Component = useExample(example)?.Component;
  return Component ? <Component /> : null;
}

function ComponentCard({ c }: { c: ComponentEntry }) {
  return (
    <Card interactive className="pv-comp-card">
      <CardMedia className="pv-comp-card__media">
        <Thumb example={c.examples[0]} />
      </CardMedia>
      <CardHeader>
        <h3 className="ayy-card__title">
          <CardLink href={`#/components/${c.slug}`}>{c.name}</CardLink>
        </h3>
      </CardHeader>
    </Card>
  );
}

/** #/components: every component as a live card, grouped by category. */
export function ComponentsOverview() {
  return (
    <article className="pv-page">
      <header className="pv-page__header pv-page__header--center">
        <h1 className="ayy-h1">Browse the library</h1>
        <p className="ayy-lede">
          {components.length} components, each as CSS classes, a React component and, where it has behaviour, a custom element. Every example
          below is live and follows the theme, density and brand you pick in the header.
        </p>
      </header>
      {componentGroups.map((g) => (
        <section key={g.category} className="pv-section" aria-labelledby={`cat-${g.category}`}>
          <h2 className="pv-h pv-h--section" id={`cat-${g.category}`}>
            {g.category}
          </h2>
          <p className="pv-note">{g.description}</p>
          <ul className="pv-comp-grid">
            {[...g.components]
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((c) => (
                <li key={c.slug}>
                  <ComponentCard c={c} />
                </li>
              ))}
          </ul>
        </section>
      ))}
    </article>
  );
}
