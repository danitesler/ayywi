// ayywi mcp — a Model Context Protocol server over stdio (newline-delimited JSON-RPC 2.0), no dependencies.
// Lets agents fetch exactly the component, tokens or rules they need, and lint a snippet before writing it.
import { createInterface } from "node:readline";
import { loadContract, lintText } from "./lint.mjs";

const SUPPORTED = ["2025-06-18", "2025-03-26", "2024-11-05"];

function componentMarkdown(c) {
  const list = (items) => (items ?? []).map((i) => `- ${i}`).join("\n");
  const variants = Object.entries(c.variants ?? {}).map(
    ([k, v]) => `${k}: ${(v.values ?? []).map((x) => JSON.stringify(x)).join(" | ")} (default ${JSON.stringify(v.default)}${v.component ? `, on <${v.component}>` : ""})`,
  );
  const parts = [
    `# ${c.name}`,
    `${c.category ? `Category: ${c.category}. ` : ""}Status: ${c.status}. ${c.description}`,
    `Classes:\n${list(Object.entries(c.classes).map(([k, v]) => `.${k} — ${v}`))}`,
  ];
  if (variants.length) parts.push(`Variants:\n${list(variants)}`);
  if (c.states) {
    parts.push(`States:\n${list(Object.entries(c.states).map(([k, s]) => (s.none ? `${k} — doesn't apply: ${s.none}` : `${k}${s.when ? ` (${s.when})` : ""} — ${s.looks}`)))}`);
  }
  if (c.sizes) {
    const scale = Object.entries(c.sizes.scale ?? {}).map(([k, v]) => `${k} — ${v}`);
    parts.push(`Sizes:\n${list([...scale, `density — ${c.sizes.density}`, `width — ${c.sizes.width}`])}`);
  }
  if (c.js) parts.push(`JS helpers (from "ayywi"): ${c.js}`);
  if (c.element)
    parts.push(
      `Custom element <${c.element.tag}> (import "ayywi/elements"): ${c.element.children ?? ""}\nAttributes:\n${list(
        Object.entries(c.element.attributes ?? {}).map(([k, v]) => `${k}: ${v}`),
      )}\nEvents:\n${list(Object.entries(c.element.events ?? {}).map(([k, v]) => `${k}: ${v}`))}`,
    );
  parts.push(
    `React (${c.react.import}):\n${list(
      Object.entries(c.react.components).map(
        ([n, d]) => `<${n}> renders ${d.renders}${d.props ? `; props: ${Object.entries(d.props).map(([p, t]) => `${p} ${t}`).join("; ")}` : ""}`,
      ),
    )}`,
  );
  parts.push(`Accessibility:\n${list(c.a11y)}`, `Do:\n${list(c.do)}`, `Don't:\n${list(c.dont)}`);
  for (const ex of c.examples ?? []) {
    parts.push(`## Example: ${ex.title}\n\nHTML:\n\`\`\`html\n${ex.html ?? ""}\n\`\`\`\n\nReact:\n\`\`\`tsx\n${ex.react ?? ""}\n\`\`\``);
  }
  return parts.join("\n\n");
}

export function createServer(contract = loadContract()) {
  const { manifest } = contract;
  const find = (name) => {
    const key = String(name ?? "").toLowerCase().replace(/^<?ayy-/, "").replace(/[^a-z0-9]/g, "");
    return manifest.components.find(
      (c) =>
        c.slug === key ||
        c.name.toLowerCase().replace(/[^a-z0-9]/g, "") === key ||
        Object.keys(c.react.components).some((n) => n.toLowerCase() === key) ||
        c.element?.tag.replace(/^ayy-/, "").replace(/[^a-z0-9]/g, "") === key,
    );
  };

  const tools = {
    list_components: {
      description: "List every ayywi component with a one-line description. Start here.",
      inputSchema: { type: "object", properties: {} },
      run: () => {
        const categories = [...new Set(manifest.components.map((c) => c.category ?? "Other"))];
        return categories
          .map((cat) => `${cat}:\n${manifest.components.filter((c) => (c.category ?? "Other") === cat).map((c) => `- ${c.name} (${c.slug}): ${c.description}`).join("\n")}`)
          .join("\n\n");
      },
    },
    get_component: {
      description: "Full spec of one component: classes, variants, states (default, hover, pressed, focus, disabled, selected, error, loading…), sizes, React props, custom element, a11y, do/don't, copy-ready HTML + React examples.",
      inputSchema: { type: "object", properties: { name: { type: "string", description: "e.g. button, Dialog, DropdownMenu, ayy-tabs" } }, required: ["name"] },
      run: ({ name }) => {
        const c = find(name);
        if (!c) throw new Error(`No component "${name}". Available: ${manifest.components.map((x) => x.slug).join(", ")}`);
        return componentMarkdown(c);
      },
    },
    search: {
      description: "Search components, tokens and utility classes by keyword (e.g. \"confirm\", \"status\", \"spacing\").",
      inputSchema: { type: "object", properties: { query: { type: "string" } }, required: ["query"] },
      run: ({ query }) => {
        const words = String(query).toLowerCase().split(/\s+/).filter(Boolean);
        const score = (text) => words.reduce((n, w) => n + (text.toLowerCase().includes(w) ? 1 : 0), 0);
        const hits = [
          ...manifest.components.map((c) => [score(JSON.stringify([c.name, c.description, c.do, c.classes])), `component ${c.slug}: ${c.description}`]),
          ...manifest.tokens.map((t) => [score(`${t.name} ${t.description ?? ""}`), `token ${t.cssVar}: ${t.description ?? t.value}`]),
          ...Object.entries(manifest.utilities ?? {}).map(([k, v]) => [score(`${k} ${v}`), `utility .${k}: ${v}`]),
        ]
          .filter(([s]) => s > 0)
          .sort((a, b) => b[0] - a[0])
          .slice(0, 15);
        return hits.length ? hits.map(([, t]) => `- ${t}`).join("\n") : "No matches. Try list_components.";
      },
    },
    get_tokens: {
      description: `Design tokens (CSS custom properties) with their value in every theme (${manifest.themes?.map?.((t) => t.name ?? t).join(", ") ?? "dark, light"}). Optionally filter by group: ${[...new Set(manifest.tokens.map((t) => t.name.split(".")[0]))].join(", ")}.`,
      inputSchema: { type: "object", properties: { group: { type: "string" } } },
      run: ({ group } = {}) =>
        manifest.tokens
          .filter((t) => !group || t.name.startsWith(`${group}.`))
          .map((t) => {
            const other = [t.light ? `light ${t.light}` : "", ...Object.entries(t.themes ?? {}).map(([name, v]) => `${name} ${v}`)].filter(Boolean);
            return `${t.cssVar}: ${Array.isArray(t.value) ? t.value.join(", ") : t.value}${other.length ? ` (${other.join(", ")})` : ""}${t.category ? ` [${t.category}]` : ""}${t.description ? ` — ${t.description}` : ""}`;
          })
          .join("\n"),
    },
    get_rules: {
      description: "The rules every ayywi UI must follow, plus conventions, global attributes (theme, density, dir), layout and typography utility classes, and the custom properties you may set (--ayy-gap, --ayy-spot…).",
      inputSchema: { type: "object", properties: {} },
      run: () =>
        [
          "Rules:",
          ...manifest.rules.map((r, i) => `${i + 1}. ${r}`),
          "",
          "Conventions:",
          ...Object.entries(manifest.conventions).map(([k, v]) => `- ${k}: ${v}`),
          "",
          "Attributes:",
          ...Object.entries(manifest.attributes ?? {}).map(([k, v]) => `- ${k}: ${v}`),
          "",
          "Utility classes (layout, type, page helpers):",
          ...Object.entries(manifest.utilities ?? {}).map(([k, v]) => `- .${k}: ${v}`),
          "",
          "Custom properties you may set:",
          ...Object.entries(manifest.publicCustomProperties ?? {}).map(([k, v]) => `- ${k}: ${v}`),
        ].join("\n"),
    },
    lint: {
      description: "Check a code snippet against ayywi before writing it: unknown classes, tokens, variants, elements and attribute values (data-theme…), reserved ayy- prefixes, hardcoded colours (also in inline styles), physical left/right CSS, :dir(), unlabeled icon buttons, <img> without width/height, icon sets other than Hugeicons.",
      inputSchema: {
        type: "object",
        properties: { code: { type: "string" }, filename: { type: "string", description: "Decides the parser, e.g. App.tsx, page.html, styles.css. Default snippet.tsx." } },
        required: ["code"],
      },
      run: ({ code, filename = "snippet.tsx" }) => {
        const findings = lintText(String(code), filename, contract);
        return findings.length
          ? findings.map((f) => `${f.line}:${f.column} ${f.severity} ${f.rule}: ${f.message}`).join("\n")
          : "No problems found.";
      },
    },
  };

  /** Handle one JSON-RPC message; returns a response object or null for notifications. */
  return function handle(msg) {
    const reply = (result) => ({ jsonrpc: "2.0", id: msg.id, result });
    const fail = (code, message) => ({ jsonrpc: "2.0", id: msg.id ?? null, error: { code, message } });
    if (msg.id === undefined) return null; // notification (e.g. notifications/initialized)
    switch (msg.method) {
      case "initialize": {
        const requested = msg.params?.protocolVersion;
        return reply({
          protocolVersion: SUPPORTED.includes(requested) ? requested : SUPPORTED[0],
          capabilities: { tools: {} },
          serverInfo: { name: "ayywi", version: manifest.version },
          instructions: "ayywi design system. Call list_components or search first, then get_component before writing UI, and lint your snippet.",
        });
      }
      case "ping":
        return reply({});
      case "tools/list":
        return reply({ tools: Object.entries(tools).map(([name, t]) => ({ name, description: t.description, inputSchema: t.inputSchema })) });
      case "tools/call": {
        const tool = tools[msg.params?.name];
        if (!tool) return fail(-32602, `Unknown tool: ${msg.params?.name}`);
        try {
          return reply({ content: [{ type: "text", text: tool.run(msg.params?.arguments ?? {}) }] });
        } catch (error) {
          return reply({ content: [{ type: "text", text: String(error.message ?? error) }], isError: true });
        }
      }
      default:
        return fail(-32601, `Method not found: ${msg.method}`);
    }
  };
}

export function serve() {
  const handle = createServer();
  const rl = createInterface({ input: process.stdin });
  rl.on("line", (line) => {
    if (!line.trim()) return;
    let msg;
    try {
      msg = JSON.parse(line);
    } catch {
      process.stdout.write(`${JSON.stringify({ jsonrpc: "2.0", id: null, error: { code: -32700, message: "Parse error" } })}\n`);
      return;
    }
    const response = handle(msg);
    if (response) process.stdout.write(`${JSON.stringify(response)}\n`);
  });
}
