/* Every icon pack, so every page, the showcase apps' frames and the Themes page can wear any of them; the library ships
   each one opt-in. A pack's stylesheet (100–200 kB of glyph masks) loads the first time anything in the page names it
   with data-ayy-icons, so a visitor who never switches downloads none. Late stylesheets keep the ayywi.components layer
   index.css declared first. */
const packs = import.meta.glob("../../src/css/icon-packs/*.css");
const requested = new Set<string>();

function load(pack: string | null) {
  if (!pack || requested.has(pack)) return;
  requested.add(pack);
  void packs[`../../src/css/icon-packs/${pack}.css`]?.();
}

function scan(node: Node) {
  if (!(node instanceof Element)) return;
  load(node.getAttribute("data-ayy-icons"));
  node.querySelectorAll("[data-ayy-icons]").forEach((el) => load(el.getAttribute("data-ayy-icons")));
}

/** Loads each pack the document names, now and whenever an element asks for one later. */
export function loadIconPacksOnDemand(doc: Document = document) {
  scan(doc.documentElement);
  new MutationObserver((records) => {
    for (const record of records) {
      if (record.type === "attributes") load((record.target as Element).getAttribute("data-ayy-icons"));
      else record.addedNodes.forEach(scan);
    }
  }).observe(doc.documentElement, { subtree: true, childList: true, attributes: true, attributeFilter: ["data-ayy-icons"] });
}
