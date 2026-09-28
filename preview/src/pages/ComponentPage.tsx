import { Badge } from "ayywi/react";
import { CopyButton } from "../CodeBlock";
import { componentMarkdown, type ComponentEntry } from "../data";
import { Example } from "../Example";
import type { Renderer } from "../settings";

function List({ items }: { items: string[] }) {
  return (
    <ul className="pv-list">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

export function ComponentPage({ component: c, renderer }: { component: ComponentEntry; renderer: Renderer }) {
  return (
    <article className="pv-page">
      <header className="pv-page__header">
        <p className="ayy-eyebrow">{c.category}</p>
        <div className="pv-title-row">
          <h1 className="ayy-h2">{c.name}</h1>
          <Badge variant={c.status === "stable" ? "success" : "warning"} dot="static">
            {c.status}
          </Badge>
        </div>
        <p className="ayy-lede">{c.description}</p>
        <div className="ayy-cluster">
          <CopyButton text={componentMarkdown(c)} label="Copy context for AI" />
          <code className="pv-inline-code">{c.react.import}</code>
        </div>
      </header>

      <div className="pv-usage">
        <div>
          <h2 className="pv-h">Use for</h2>
          <List items={c.whenToUse} />
        </div>
        <div>
          <h2 className="pv-h">Don't use for</h2>
          <List items={c.whenNotToUse} />
        </div>
      </div>

      <h2 className="pv-h pv-h--section">Examples</h2>
      {c.examples.map((ex) => (
        <Example key={ex.id} example={ex} renderer={renderer} />
      ))}

      <h2 className="pv-h pv-h--section">CSS classes</h2>
      <div className="ayy-table-wrap">
        <table className="ayy-table">
          <thead>
            <tr>
              <th scope="col">Class</th>
              <th scope="col">What it does</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(c.classes).map(([cls, desc]) => (
              <tr key={cls}>
                <td>
                  <code className="pv-inline-code">.{cls}</code>
                </td>
                <td>{desc}</td>
              </tr>
            ))}
            {Object.entries(c.states ?? {}).map(([state, desc]) => (
              <tr key={state}>
                <td>
                  <code className="pv-inline-code">{state}</code>
                </td>
                <td>{desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {c.js ? (
        <p className="pv-note">
          <strong>JS helpers</strong> (from <code className="pv-inline-code">ayywi</code>, any framework): {c.js}
        </p>
      ) : null}

      <h2 className="pv-h pv-h--section">React API</h2>
      <div className="ayy-table-wrap">
        <table className="ayy-table">
          <thead>
            <tr>
              <th scope="col">Component</th>
              <th scope="col">Renders</th>
              <th scope="col">Props</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(c.react.components).map(([name, def]) => (
              <tr key={name}>
                <td>
                  <code className="pv-inline-code">{`<${name}>`}</code>
                </td>
                <td>{def.renders}</td>
                <td>
                  {def.props ? (
                    <ul className="pv-props">
                      {Object.entries(def.props).map(([p, d]) => (
                        <li key={p}>
                          <code className="pv-inline-code">{p}</code> {d}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span className="ayy-muted">Native attributes</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pv-usage pv-usage--three">
        <div>
          <h2 className="pv-h">Accessibility</h2>
          <List items={c.a11y} />
        </div>
        <div>
          <h2 className="pv-h">Do</h2>
          <List items={c.do} />
        </div>
        <div>
          <h2 className="pv-h">Don't</h2>
          <List items={c.dont} />
        </div>
      </div>
    </article>
  );
}
