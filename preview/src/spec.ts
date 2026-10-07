import type { ComponentEntry } from "./data";

/** One component as markdown for an AI chat or agent: what the MCP server's get_component returns, from the same metadata. */
export function componentSpec(c: ComponentEntry): string {
  const list = (items: string[]) => items.map((i) => `- ${i}`).join("\n");
  const parts = [
    `# ayywi ${c.name}`,
    `${c.category}. Status: ${c.status}. ${c.description}`,
    `Classes:\n${list(Object.entries(c.classes).map(([k, v]) => `.${k} — ${v}`))}`,
  ];
  const variants = Object.entries(c.variants ?? {});
  if (variants.length) parts.push(`Variants:\n${list(variants.map(([k, v]) => `${k}: ${v.values.map((x) => JSON.stringify(x)).join(" | ")} (default ${JSON.stringify(v.default)})`))}`);
  if (c.js) parts.push(`JS helpers (from "@danitesler/ayywi"): ${c.js}`);
  if (c.element) parts.push(`Custom element: <${c.element.tag}> (import "@danitesler/ayywi/elements", or load dist/elements.global.js).`);
  parts.push(
    `React (${c.react.import}):\n${list(
      Object.entries(c.react.components).map(
        ([n, d]) => `<${n}> renders ${d.renders}${d.props ? `; props: ${Object.entries(d.props).map(([p, t]) => `${p} ${t}`).join("; ")}` : ""}`,
      ),
    )}`,
  );
  parts.push(`Accessibility:\n${list(c.a11y)}`, `Do:\n${list(c.do)}`, `Don't:\n${list(c.dont)}`);
  for (const ex of c.examples) {
    parts.push(`## Example: ${ex.title}\n\nHTML:\n\`\`\`html\n${ex.htmlSource}\n\`\`\`\n\nReact:\n\`\`\`tsx\n${ex.reactSource}\n\`\`\``);
  }
  return parts.join("\n\n");
}
