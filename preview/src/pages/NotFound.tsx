import { buttonClass } from "@danitesler/ayywi/react";
import { commandMatches } from "@danitesler/ayywi";
import { components } from "../data";

/** An address that isn't a page: suggest the components whose name is close, then the tabs. */
export function NotFound({ path }: { path: string }) {
  const word = path.split("/").filter(Boolean).pop()?.replace(/-/g, " ") ?? "";
  const close = word ? components.filter((c) => commandMatches(c.name, word) || commandMatches(c.slug, word)).slice(0, 4) : [];
  return (
    <article className="pv-page pv-page--center">
      <header className="pv-page__header pv-page__header--center">
        <h1 className="ayy-h2">This page doesn't exist</h1>
        <p className="ayy-lede">
          Nothing lives at <code className="ayy-code">#/{path}</code>.{close.length ? " Did you mean one of these?" : ""}
        </p>
      </header>
      <nav className="ayy-cluster pv-links pv-links--center" aria-label="Suggestions">
        {close.map((c) => (
          <a key={c.slug} className={buttonClass({ variant: "outline", size: "sm" })} href={`#/components/${c.slug}`}>
            {c.name}
          </a>
        ))}
        <a className={buttonClass({ variant: close.length ? "ghost" : "outline", size: "sm" })} href="#/components">
          All components
        </a>
        <a className={buttonClass({ variant: "ghost", size: "sm" })} href="#/">
          Home
        </a>
      </nav>
    </article>
  );
}
