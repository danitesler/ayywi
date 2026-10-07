# Contents

Category: Navigation. On-page table of contents with a scrollspy: a rail of section links where the one you're reading gets an accent bar. Optional numbers, one level of nesting, sticky beside long content.

**Classes**
- `.ayy-toc` — Root <nav>. Accent from --ayy-spot.
- `.ayy-toc--sticky` — Stays in view below the navbar, scrolling on its own if it's taller than the screen. Put it before the content in a wrapping flex row (it takes 11rem) or give it its own grid column. Below 48rem it becomes a sticky row of top-level section links under the navbar, the current one underlined and scrolled into view.
- `.ayy-toc__title` — Small uppercase heading ("Contents"). Point the nav's aria-labelledby at it.
- `.ayy-toc__list` — <ol> of <li>s with a hairline rail. Nest one inside an <li> for sub-sections.
- `.ayy-toc__link` — Section link (href="#id"). aria-current (set by the scrollspy) shows the accent bar; its parent link lights up too.
- `.ayy-toc__number` — Optional section number (01, 02…) before the label, in the accent while current.

**JS (framework-free)**: tocClass({ sticky?, className? }) → string; tocTitleClass, tocListClass, tocLinkClass, tocNumberClass constants; connectToc(root, { offset?, onChange? }) → cleanup — the scrollspy.

**Custom element** `<ayy-toc>` (@danitesler/ayywi/elements) — Goes inside <nav class="ayy-toc"> and wraps the title and list. Every .ayy-toc__link with href="#id" is spied; aria-current="location" is set and removed for you.
- attribute `offset`: Distance in px below the top of the viewport at which a section becomes current. Default: the page's scroll-padding-top (the navbar sets it) + 24.
- event `ayy-value-change`: { value: string } — id of the section now being read ("" above the first)

**React** — `import { Toc } from "@danitesler/ayywi/react";`
- `<Toc>` renders <nav class="ayy-toc">. Props: `items` { id: string; label: ReactNode; children?: TocItem[] }[] — ids of sections on the page, in page order.; `title` ReactNode — visible heading; also becomes the nav's accessible name.; `numbered` boolean — number top-level items 01, 02…; `sticky` boolean; `offset` number — px below the top of the viewport at which a section becomes current.; `onValueChange` (id: string) => void — the section being read changed.; `aria-label` Used when there's no title. Defaults to "On this page" (translate it).

**Accessibility**
- It's a <nav> with a name (the title via aria-labelledby, or aria-label="On this page"), so it shows up in landmark lists.
- The current section is aria-current="location", announced by screen readers, not only drawn as a colour bar.
- Links are ordinary in-page anchors: they work without JS, and the navbar's scroll-padding keeps targets clear of the sticky header.
- Links grow to a 40px target at touch density. On phones the visible title is hidden but still names the nav.

**Do**
- Use a table of contents on long pages with named sections: case studies, docs, articles, settings pages.
- List sections in page order; the scrollspy assumes it.
- Set --ayy-spot on the page (or the nav) to tint the bar and number with the content's accent.
- Make the page layout put it above the content on phones (a wrapping flex row does, as in the example); --sticky then turns it into a strip of section links.

**Don't**
- Don't add one to short pages with two or three sections.
- Don't use it to navigate between pages — use Navbar or links.
- Don't nest more than one level.
- Don't list every heading — sections and their direct sub-sections only.

## Contents — Numbered, beside the content

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<!-- <ayy-toc> (@danitesler/ayywi/elements) marks the section you're reading. Scroll the page to see the bar move. -->
<div style="display: flex; flex-wrap: wrap; gap: var(--ayy-space-8); inline-size: 100%; --ayy-spot: var(--ayy-accent-product)">
  <nav class="ayy-toc ayy-toc--sticky" aria-labelledby="toc-title">
    <ayy-toc>
      <p class="ayy-toc__title" id="toc-title">Contents</p>
      <ol class="ayy-toc__list">
        <li><a class="ayy-toc__link" href="#toc-overview"><span class="ayy-toc__number">01</span>Overview</a></li>
        <li>
          <a class="ayy-toc__link" href="#toc-system"><span class="ayy-toc__number">02</span>Design system</a>
          <ol class="ayy-toc__list">
            <li><a class="ayy-toc__link" href="#toc-tokens">Tokens</a></li>
          </ol>
        </li>
        <li><a class="ayy-toc__link" href="#toc-impact"><span class="ayy-toc__number">03</span>Impact</a></li>
      </ol>
    </ayy-toc>
  </nav>
  <div class="ayy-stack" style="flex: 1 1 20rem; min-inline-size: 0; --ayy-gap: var(--ayy-space-10)">
    <section id="toc-overview"><h3 class="ayy-h4">Overview</h3><p class="ayy-muted">Marketing teams plan, publish and measure social content in one app. The board lets colleagues share it with their own networks.</p></section>
    <section id="toc-system"><h3 class="ayy-h4">Design system</h3><p class="ayy-muted">Navigation, cards and colour had drifted from screen to screen, and every new feature risked drifting further.</p></section>
    <section id="toc-tokens"><h3 class="ayy-h4">Tokens</h3><p class="ayy-muted">Colour, type and spacing became tokens first, so the redesign could ship on them.</p></section>
    <section id="toc-impact"><h3 class="ayy-h4">Impact</h3><p class="ayy-muted">The board redesign, the editor rebuild and the AI features all shipped on shared components.</p></section>
  </div>
</div>
```

React:

```tsx
import type { CSSProperties } from "react";
import { Toc } from "@danitesler/ayywi/react";

export default function Example() {
  return (
    <div
      style={{ display: "flex", flexWrap: "wrap", gap: "var(--ayy-space-8)", inlineSize: "100%", "--ayy-spot": "var(--ayy-accent-product)" } as CSSProperties}
    >
      <Toc
        sticky
        numbered
        title="Contents"
        items={[
          { id: "toc-overview", label: "Overview" },
          { id: "toc-system", label: "Design system", children: [{ id: "toc-tokens", label: "Tokens" }] },
          { id: "toc-impact", label: "Impact" },
        ]}
      />
      <div className="ayy-stack" style={{ flex: "1 1 20rem", minInlineSize: 0, "--ayy-gap": "var(--ayy-space-10)" } as CSSProperties}>
        <section id="toc-overview">
          <h3 className="ayy-h4">Overview</h3>
          <p className="ayy-muted">Marketing teams plan, publish and measure social content in one app. The board lets colleagues share it with their own networks.</p>
        </section>
        <section id="toc-system">
          <h3 className="ayy-h4">Design system</h3>
          <p className="ayy-muted">Navigation, cards and colour had drifted from screen to screen, and every new feature risked drifting further.</p>
        </section>
        <section id="toc-tokens">
          <h3 className="ayy-h4">Tokens</h3>
          <p className="ayy-muted">Colour, type and spacing became tokens first, so the redesign could ship on them.</p>
        </section>
        <section id="toc-impact">
          <h3 className="ayy-h4">Impact</h3>
          <p className="ayy-muted">The board redesign, the editor rebuild and the AI features all shipped on shared components.</p>
        </section>
      </div>
    </div>
  );
}
```

---
Part of @danitesler/ayywi 0.0.1: load `dist/ayywi.min.css` (and `dist/elements.global.js` for the <ayy-*> elements). The rules every screen follows: [llms-full.txt#rules](../llms-full.txt#rules). Every component: [llms.txt](../llms.txt).
