import { useState } from "react";
import { getIconPack, iconNames, iconPackInfo, iconPacks, type IconPackName } from "@danitesler/ayywi";
import { Badge, Field, Icon, Label, Select } from "@danitesler/ayywi/react";
import { CodeBlock } from "../CodeBlock";
import type { IconData } from "../../../src/components/icon/icon";
import * as glyphs from "../../../src/lib/icons";
import hugeicons from "../../../tokens/icon-packs/hugeicons.json";

/**
 * Each glyph ayywi draws as Hugeicons draws it: what components render inline, and what a pack falls back to. The other
 * names (app icons such as "settings") have no inline shapes here; the grid's pack CSS (preview/src/icon-packs.css) draws every name.
 */
const GLYPHS = Object.fromEntries(iconNames.map((name) => [name, (glyphs as Record<string, IconData>)[(hugeicons.glyphs as Record<string, string>)[name]] ?? []]));

const SETUP = `import "@danitesler/ayywi/icons/lucide.css";
import { setIconPack } from "@danitesler/ayywi";

setIconPack("lucide"); // or data-ayy-icons="lucide" on any element`;

const NAMED = `<Icon icon={Search01Icon} name="search" />`;

/** #/docs/icons: every name ayywi knows, drawn by the pack you pick. Browsing a pack doesn't change the site's. */
export function IconsPage() {
  const [pack, setPack] = useState<IconPackName>(getIconPack);
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

      <section className="pv-section pv-icon-packs" aria-labelledby="icons-browse">
        <h2 className="pv-h pv-h--section" id="icons-browse">Browse a pack</h2>
        <p className="pv-note">
          Every name ayywi knows: the icons it draws itself, then common app icons. A badge marks a name the pack doesn&apos;t have, which
          Hugeicons draws. Browsing doesn&apos;t change this site&apos;s pack; <a href="#/themes">Themes</a> does that, under Custom → Icons.
        </p>
        <Field className="pv-icon-packs__field">
          <Label htmlFor="pv-icon-pack">Pack</Label>
          <Select id="pv-icon-pack" value={pack} onChange={(e) => setPack(e.target.value as IconPackName)}>
            {iconPacks.map((id) => (
              <option key={id} value={id}>{iconPackInfo[id].label}</option>
            ))}
          </Select>
        </Field>
        <div className="pv-icon-packs__about ayy-cluster">
          <strong>{info.label}</strong>
          <Badge variant="outline">{info.license}</Badge>
          <span className="pv-note">{fallbacks.size ? `Hugeicons draws ${fallbacks.size} of ${iconNames.length}` : `All ${iconNames.length} glyphs`}</span>
        </div>
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
        <h2 className="pv-h pv-h--section" id="icons-use">Use a pack</h2>
        <p className="pv-note">Import the pack&apos;s CSS next to ayywi&apos;s, then choose it for the page or for any section.</p>
        <CodeBlock code={SETUP} label="ts" wrap />
        <p className="pv-note">
          Icons ayywi draws itself are already named. For your own, add the name from this page; without one the icon stays Hugeicons.
          Packs keep their own stroke, so <code>strokeWidth</code> only changes Hugeicons.
        </p>
        <CodeBlock code={NAMED} label="tsx" wrap />
      </section>
    </article>
  );
}
