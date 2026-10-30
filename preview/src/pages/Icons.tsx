import { useState } from "react";
import { getIconPack, iconNames, iconPackInfo, iconPacks, type IconPackName } from "@danitesler/ayywi";
import { Badge, Icon, Tabs, TabsContent, TabsList, TabsTrigger } from "@danitesler/ayywi/react";
import { CodeBlock } from "../CodeBlock";
import { buildPrompt } from "../prompts";
import type { IconData } from "../../../src/components/icon/icon";
import * as glyphs from "../../../src/lib/icons";
import hugeicons from "../../../tokens/icon-packs/hugeicons.json";

/**
 * Each glyph ayywi draws as Hugeicons draws it: what components render inline, and what a pack falls back to. The other
 * names (app icons such as "settings") have no inline shapes here; the grid's pack CSS (preview/src/icon-packs.css) draws every name.
 */
const GLYPHS = Object.fromEntries(iconNames.map((name) => [name, (glyphs as Record<string, IconData>)[(hugeicons.glyphs as Record<string, string>)[name]] ?? []]));

const setup = (pack: IconPackName) => `import "@danitesler/ayywi/icons/${pack}.css";
import { setIconPack } from "@danitesler/ayywi";

setIconPack("${pack}"); // or data-ayy-icons="${pack}" on any element`;

const NAMED = `<Icon icon={Search01Icon} name="search" />`;

/** The request an AI tool needs to draw an app's icons with a pack (buildPrompt adds how to load ayywi). */
const packRequest = (pack: IconPackName) =>
  `Draw every icon in my app with the ${iconPackInfo[pack].label} pack of the ayywi design system.
- Import the pack's stylesheet after ayywi's: ${pack === "hugeicons" ? "none needed, Hugeicons is the default." : `import "@danitesler/ayywi/icons/${pack}.css";`}
- Choose it with setIconPack("${pack}") or data-ayy-icons="${pack}" on <html> or any section.
- Use ayywi's named icons (<Icon name="search" />); keep the name from the icon list at #/docs/icons. A name the pack lacks stays Hugeicons.${pack === "hugeicons" ? "" : "\n- Packs keep their own stroke, so strokeWidth only changes Hugeicons."}`;

/** #/docs/icons: every name ayywi knows, drawn by the pack you pick. Browsing a pack doesn't change the site's. */
export function IconsPage() {
  const [pack, setPack] = useState<IconPackName>(getIconPack);
  const [usage, setUsage] = useState("prompt");
  const info = iconPackInfo[pack];
  const fallbacks = new Set<string>(info.fallbacks);
  return (
    <article className="pv-page">
      <header className="pv-page__header pv-page__header--center">
        <p className="ayy-eyebrow">Foundations</p>
        <h1 className="ayy-h2">Icons</h1>
        <p className="ayy-lede">
          Hugeicons is the default. Lucide, Tabler Icons, Material Symbols and Feather can draw the same icons instead: load a pack&apos;s
          stylesheet and pick it, and every named icon follows.
        </p>
      </header>

      <section className="pv-section pv-icon-packs" aria-label="Browse a pack">
        <Tabs value={pack} onValueChange={(v) => setPack(v as IconPackName)} className="pv-icon-packs__tabs">
          <TabsList aria-label="Pack">
            {iconPacks.map((id) => (
              <TabsTrigger key={id} value={id}>{iconPackInfo[id].label}</TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <ul className="pv-icon-packs__grid" data-ayy-icons={pack} aria-label={`Glyphs in ${info.label}`}>
          {iconNames.map((name) => (
            <li key={name} className="pv-icon-packs__item">
              <Icon icon={GLYPHS[name]} name={name} size="lg" />
              <span className="pv-icon-packs__name">{name}</span>
              {fallbacks.has(name) && <Badge variant="muted">Hugeicons</Badge>}
            </li>
          ))}
        </ul>
      </section>

      <section className="pv-section" aria-labelledby="icons-use">
        <h2 className="pv-h pv-h--section" id="icons-use">Use {info.label}</h2>
        <p className="pv-note">
          Give the prompt to any AI tool, or take the code. A name the pack lacks stays Hugeicons, and packs keep their own stroke, so{" "}
          <code>strokeWidth</code> only changes Hugeicons.
        </p>
        <Tabs value={usage} onValueChange={setUsage}>
          <TabsList aria-label="Use this pack">
            <TabsTrigger value="prompt">Prompt</TabsTrigger>
            <TabsTrigger value="code">Code</TabsTrigger>
          </TabsList>
          <TabsContent value="prompt">
            <CodeBlock code={buildPrompt(packRequest(pack))} label="prompt" copyLabel="Copy prompt" wrap />
          </TabsContent>
          <TabsContent value="code">
            <CodeBlock code={`${setup(pack)}\n\n${NAMED}`} label="code" language="tsx" wrap />
          </TabsContent>
        </Tabs>
      </section>
    </article>
  );
}
