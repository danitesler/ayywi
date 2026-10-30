import type { ReactNode } from "react";
import {
  Badge,
  buttonClass,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@danitesler/ayywi/react";
import { STATES } from "../../../scripts/lib/contract.mjs";
import { components, type ComponentEntry } from "../data";
import { COMPONENT_VIEWS, type ComponentView } from "../routes";
import { Showcase } from "../Showcase";
import type { Renderer } from "../settings";

const TONES = {
  yes: "var(--ayy-color-success)",
  no: "var(--ayy-color-destructive)",
} as const;

const VIEW_LABELS: Record<ComponentView, string> = { overview: "Overview", properties: "Properties", accessibility: "Accessibility" };

function Guidance({ title, items, tone }: { title: string; items: string[]; tone: keyof typeof TONES }) {
  if (!items.length) return null;
  return (
    <Card spotlight spotColor={TONES[tone]} className={`pv-guide pv-guide--${tone}`}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="pv-guide__list">
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

/** `code` spans inside a line of meta.json prose. */
function prose(text: string): ReactNode[] {
  return text.split(/(`[^`]+`)/g).map((part, i) => (part.startsWith("`") ? <code key={i} className="ayy-code">{part.slice(1, -1)}</code> : part));
}

/** A two- or three-column reference table: the name on one line, the descriptions wrap. */
function RefTable({ caption, head, rows }: { caption: string; head: string[]; rows: ReactNode[][] }) {
  if (!rows.length) return null;
  return (
    <Table className="pv-ref">
      <TableCaption className="ayy-sr-only">{caption}</TableCaption>
      <TableHeader>
        <TableRow>
          {head.map((h) => (
            <TableHead key={h}>{h}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row, i) => (
          <TableRow key={i}>
            {row.map((cell, j) => (
              <TableCell key={j} wrap={j > 0}>
                {cell}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

const show = (v: string | boolean) => <code className="ayy-code">{String(v)}</code>;

function Overview({ c, renderer }: { c: ComponentEntry; renderer: Renderer }) {
  const family = c.family ? components.find((x) => x.slug === c.family) : undefined;
  const members = components.filter((x) => x.family === (c.family ?? c.slug) && x.slug !== c.slug);
  return (
    <>
      {c.examples.map((ex) => (
        <Showcase key={ex.id} example={ex} component={c} renderer={renderer} />
      ))}

      <h2 className="pv-h pv-h--section">Usage</h2>
      <div className="pv-usage">
        <Guidance title="Do" items={c.do} tone="yes" />
        <Guidance title="Don't" items={c.dont} tone="no" />
      </div>

      {(family || members.length > 0) && (
        <>
          <h2 className="pv-h pv-h--section">Related</h2>
          <nav className="ayy-cluster pv-links" aria-label={`Related to ${c.name}`}>
            {[...(family ? [family] : []), ...members].map((x) => (
              <a key={x.slug} className={buttonClass({ variant: "outline", size: "sm" })} href={`#/components/${x.slug}`}>
                {x.name}
              </a>
            ))}
          </nav>
        </>
      )}
    </>
  );
}

function Properties({ c }: { c: ComponentEntry }) {
  const elements = [...(c.element ? [c.element] : []), ...(c.elements ?? [])].filter((el, i, all) => all.findIndex((x) => x.tag === el.tag) === i);
  return (
    <>
      {Object.entries(c.react.components).map(([name, def]) => (
        <section key={name} className="pv-section" aria-labelledby={`prop-${name}`}>
          <h2 className="pv-h pv-h--section" id={`prop-${name}`}>
            <code className="ayy-code">{`<${name}>`}</code>
            <span className="ayy-muted pv-ref__renders">renders {def.renders}</span>
          </h2>
          {def.props && Object.keys(def.props).length ? (
            <RefTable caption={`${name} props`} head={["Prop", "Type and description"]} rows={Object.entries(def.props).map(([prop, desc]) => [<code className="ayy-code">{prop}</code>, prose(desc)])} />
          ) : (
            <p className="pv-note">No props of its own: it takes the attributes of {def.renders}.</p>
          )}
        </section>
      ))}

      {Object.keys(c.variants).length > 0 && (
        <>
          <h2 className="pv-h pv-h--section">Variants</h2>
          <RefTable
            caption="Variants"
            head={["Name", "Values", "Default"]}
            rows={Object.entries(c.variants).map(([name, v]) => [
              <code className="ayy-code">{name}</code>,
              <span className="pv-ref__values">{v.values.map((x) => <span key={String(x)}>{show(x)}</span>)}</span>,
              show(v.default),
            ])}
          />
        </>
      )}

      <h2 className="pv-h pv-h--section">States</h2>
      <RefTable
        caption="States"
        head={["State", "How you get it", "What it looks like"]}
        rows={Object.entries(c.states).map(([name, s]) => [
          name,
          s.none ? <span className="ayy-muted">Doesn't apply. {prose(s.none)}</span> : s.when ? prose(s.when) : <span className="ayy-muted">{STATES[name as keyof typeof STATES] ?? ""}</span>,
          s.looks ? prose(s.looks) : "",
        ])}
      />

      <h2 className="pv-h pv-h--section">Sizes</h2>
      <RefTable
        caption="Sizes"
        head={["Size", "Measurements"]}
        rows={[
          ...Object.entries(c.sizes.scale ?? {}).map(([name, desc]) => [<code className="ayy-code">{name}</code>, prose(desc)]),
          ["Density", prose(c.sizes.density)],
          ["Width", prose(c.sizes.width)],
        ]}
      />

      <h2 className="pv-h pv-h--section">CSS classes</h2>
      <RefTable caption="CSS classes" head={["Class", "What it is"]} rows={Object.entries(c.classes).map(([cls, desc]) => [<code className="ayy-code">.{cls}</code>, prose(desc)])} />

      {c.js && (
        <>
          <h2 className="pv-h pv-h--section">JavaScript</h2>
          <p className="pv-note">{prose(c.js)}</p>
        </>
      )}

      {elements.map((el) => (
        <section key={el.tag} className="pv-section" aria-labelledby={`el-${el.tag}`}>
          <h2 className="pv-h pv-h--section" id={`el-${el.tag}`}>
            <code className="ayy-code">{`<${el.tag}>`}</code>
            <Badge variant="outline">Custom element</Badge>
          </h2>
          {el.children && <p className="pv-note">{prose(el.children)}</p>}
          <RefTable
            caption={`${el.tag} attributes and events`}
            head={["Attribute or event", "Description"]}
            rows={[
              ...Object.entries(el.attributes ?? {}).map(([k, v]) => [<code className="ayy-code">{k}</code>, prose(v)]),
              ...Object.entries(el.events ?? {}).map(([k, v]) => [<code className="ayy-code">{k}</code>, prose(v)]),
            ]}
          />
        </section>
      ))}
    </>
  );
}

function Accessibility({ c }: { c: ComponentEntry }) {
  return (
    <>
      <h2 className="pv-h pv-h--section">Checklist</h2>
      <ul className="pv-list pv-a11y">
        {c.a11y.map((line) => (
          <li key={line}>{prose(line)}</li>
        ))}
      </ul>
      <p className="pv-note">
        Across ayywi, everything interactive shows a focus ring for keyboard users, mirrors in right-to-left layouts and keeps
        its state visible in Windows High Contrast.
      </p>
    </>
  );
}

/** A component's page: a header, then Overview (examples, usage), Properties (the reference) and Accessibility tabs. */
export function ComponentPage({ component: c, view, renderer }: { component: ComponentEntry; view: ComponentView; renderer: Renderer }) {
  const tags = [...(c.element ? [c.element.tag] : []), ...(c.elements ?? []).map((e) => e.tag)].filter((t, i, all) => all.indexOf(t) === i);
  return (
    <article className="pv-page">
      <header className="pv-page__header pv-page__header--center">
        <h1 className="ayy-h2">{c.name}</h1>
        <p className="ayy-lede">{c.description}</p>
        {tags.length > 0 && (
          <p className="pv-page__meta ayy-muted">
            {tags.map((t) => (
              <span key={t} className="ayy-mono">{`<${t}>`}</span>
            ))}
          </p>
        )}
      </header>

      <Tabs
        className="pv-comp-tabs"
        value={view}
        onValueChange={(v) => {
          window.location.hash = `#/components/${c.slug}${v === "overview" ? "" : `/${v}`}`;
        }}
      >
        <TabsList aria-label={`${c.name} documentation`}>
          {COMPONENT_VIEWS.map((v) => (
            <TabsTrigger key={v} value={v}>
              {VIEW_LABELS[v]}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value="overview" className="pv-comp-tabs__panel">
          {view === "overview" && <Overview c={c} renderer={renderer} />}
        </TabsContent>
        <TabsContent value="properties" className="pv-comp-tabs__panel">
          {view === "properties" && <Properties c={c} />}
        </TabsContent>
        <TabsContent value="accessibility" className="pv-comp-tabs__panel">
          {view === "accessibility" && <Accessibility c={c} />}
        </TabsContent>
      </Tabs>
    </article>
  );
}
