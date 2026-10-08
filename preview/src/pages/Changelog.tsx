import { Fragment, type ReactNode } from "react";
import { ArrowDown01Icon } from "@hugeicons/core-free-icons";
import { Badge, Icon } from "@danitesler/ayywi/react";
import changelog from "../../../CHANGELOG.md?raw";

const ROUTE = "changelog";

export const changelogPage = {
  route: ROUTE,
  title: "Changelog",
  text: "changelog releases versions history breaking changes added changed removed",
};

/** `code`, **bold** and [links](url) inside one line of the changelog. Supports nesting (e.g. bold links). */
function inline(text: string): ReactNode[] {
  return text.split(/(`[^`]+`|\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*)/g).filter(Boolean).map((part, i) => {
    if (part.startsWith("`")) return <code key={i} className="pv-inline-code">{part.slice(1, -1)}</code>;
    const link = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(part);
    if (link) return <a key={i} className="ayy-link" href={link[2]}>{inline(link[1])}</a>;
    if (part.startsWith("**")) return <strong key={i}>{inline(part.slice(2, -2))}</strong>;
    return <Fragment key={i}>{part}</Fragment>;
  });
}

interface Release {
  title: string;
  intro: string[];
  groups: { title: string; items: string[] }[];
}

function parse(source: string): Release[] {
  const releases: Release[] = [];
  for (const line of source.split("\n")) {
    if (line.startsWith("## ")) releases.push({ title: line.slice(3).trim(), intro: [], groups: [] });
    const release = releases[releases.length - 1];
    if (!release) continue;
    if (line.startsWith("### ")) release.groups.push({ title: line.slice(4).trim(), items: [] });
    else if (line.startsWith("- ")) release.groups[release.groups.length - 1]?.items.push(line.slice(2));
    else if (line.startsWith("  ")) {
      const items = release.groups[release.groups.length - 1]?.items;
      if (items?.length) items[items.length - 1] += `\n${line.trim()}`;
    } else if (line.trim() && !line.startsWith("#") && !release.groups.length) release.intro.push(line.trim());
  }
  return releases;
}

const releases = parse(changelog);
const slug = (title: string) => title.split(" ")[0].toLowerCase();

const GROUP_TONE: Record<string, string> = { Added: "success", Changed: "info", Removed: "destructive", Fixed: "warning" };

export function ChangelogPage() {
  return (
    <article className="pv-page">
      <header className="pv-page__header">
        <p className="ayy-eyebrow">Overview</p>
        <h1 className="ayy-h2">Changelog</h1>
        <p className="ayy-lede">What changed in each release. Renaming or removing a class, token or prop is a breaking change.</p>
      </header>

      <div className="pv-releases">
        {releases.map((release, index) => {
          const [version, ...rest] = release.title.split(" — ");
          const id = `${ROUTE}-${slug(release.title)}`;
          return (
            <details key={release.title} className="pv-release" id={id} open={index === 0}>
              <summary className="pv-release__summary">
                <span className="pv-release__version">{version}</span>
                {rest.length ? <span className="pv-release__date">{rest.join(" — ")}</span> : null}
                <Icon icon={ArrowDown01Icon} className="pv-release__chevron" />
              </summary>
              <div className="pv-release__body">
                {release.intro.map((p) => (
                  <p key={p} className="pv-note">{inline(p)}</p>
                ))}
                {release.groups.map((group) => (
                  <section key={group.title} className="pv-release__group">
                    <h3 className="pv-release__group-title">
                      <Badge variant={GROUP_TONE[group.title] as "success" | "info" | "destructive" | "warning" | undefined}>{group.title}</Badge>
                    </h3>
                    <ul className="pv-changelog__list">
                      {group.items.map((item, itemIndex) => {
                        let title = "";
                        let desc = "";
                        const lines = item.split("\n");
                        if (lines.length > 1) {
                          title = lines[0];
                          desc = lines.slice(1).join("\n");
                        } else if (item.includes("**: ")) {
                          const idx = item.indexOf("**: ");
                          title = item.slice(0, idx + 2);
                          desc = item.slice(idx + 4);
                        } else {
                          title = item;
                        }

                        const descLines = desc ? desc.split("\n") : [];
                        const isBulletList = descLines.length > 0 && descLines.every((l) => l.trim().startsWith("- "));

                        return (
                          <li key={itemIndex} className="pv-changelog__item">
                            <div className="pv-changelog__title">{inline(title)}</div>
                            {desc ? (
                              isBulletList ? (
                                <ul>
                                  {descLines.map((l, i) => (
                                    <li key={i}>{inline(l.replace(/^- /, ""))}</li>
                                  ))}
                                </ul>
                              ) : (
                                <div className="pv-changelog__desc">{inline(desc)}</div>
                              )
                            ) : null}
                          </li>
                        );
                      })}
                    </ul>
                  </section>
                ))}
              </div>
            </details>
          );
        })}
      </div>
    </article>
  );
}
