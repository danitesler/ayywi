# Section

Category: Layout. A band of a page with generous vertical rhythm and a header: optional eyebrow (with a section number), a big title and a muted description.

**Classes**
- `.ayy-section` — Root <section>. 96px block padding (80px on phones, 128px on wide screens). Add ayy-container for page width.
- `.ayy-section--center` — Header centred over the content; start-aligned again on phones.
- `.ayy-section__header` — Eyebrow, title and description, capped at a readable width.
- `.ayy-section__eyebrow` — Small uppercase label above the title.
- `.ayy-section__number` — Section number inside the eyebrow ("01"), followed by a short rule, in the accent (--ayy-spot).
- `.ayy-section__title` — The section's <h2>. Fluid, 28px on phones to 48px.
- `.ayy-section__description` — One or two sentences under the title, muted.

**States**
- `default` — Block padding of --ayy-space-24 (20 on phones, 32 from 90rem); an optional header with eyebrow, accent number, a bold fluid title and a muted lg description.
- `hover` — doesn't apply: Static.
- `pressed` — doesn't apply: Not interactive.
- `focus` — doesn't apply: Not focusable.
- `disabled` — doesn't apply: Not interactive.
- `selected` — doesn't apply: Not interactive.
- `error` — doesn't apply: No error state.
- `loading` — doesn't apply: No loading state.

**Sizes**
- Density — Doesn't follow data-density.
- Width — Full width; combine with .ayy-container to centre it. The header stops at --ayy-size-measure; center centres it (back to the start on phones). The title scales from 2xl to 4xl with the viewport.

**JS (framework-free)**: sectionClass({ center?, className? }) → string; sectionHeaderClass, sectionEyebrowClass, sectionNumberClass, sectionTitleClass, sectionDescriptionClass constants.

**React** — `import { Section, SectionHeader, SectionEyebrow, SectionTitle, SectionDescription } from "@danitesler/ayywi/react";`
- `<Section>` renders <section>. Props: `center` boolean
- `<SectionHeader>` renders <header>.
- `<SectionEyebrow>` renders <p>. Props: `number` ReactNode — shown before the label, e.g. "01".
- `<SectionTitle>` renders <h2>.
- `<SectionDescription>` renders <p>.

**Accessibility**
- Name the section with its title: aria-labelledby on the <section> pointing at the title's id makes it a landmark.
- Keep the heading order: page title h1, section titles h2.

**Do**
- Use a section for each block of a marketing page, portfolio or landing page (Work, Projects, About, Contact).
- Use sections for the chapters of a long case study or article, with numbered eyebrows that match the Contents list.
- Separate homepage sections with a fading Separator.
- Set --ayy-spot on a case study's <main> so the numbers take its accent.

**Don't**
- Don't use it for grouping inside an app screen — use Card or plain headings.
- Don't use a section for a single heading with no content under it.
- Don't stack two sections' paddings with extra margins; the padding is the rhythm.
- Don't write a paragraph as the description — one or two sentences.

## Section — Centred header

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<section class="ayy-section ayy-section--center ayy-container" aria-labelledby="work-title">
  <header class="ayy-section__header">
    <h2 class="ayy-section__title" id="work-title">Portfolio work</h2>
    <p class="ayy-section__description">Selected case studies in product design, systems and UX strategy.</p>
  </header>
  <div class="ayy-grid" style="--ayy-min: 12rem">
    <div class="ayy-card"><div class="ayy-card__header"><h3 class="ayy-card__title">Oktopost</h3></div></div>
    <div class="ayy-card"><div class="ayy-card__header"><h3 class="ayy-card__title">Comeet</h3></div></div>
    <div class="ayy-card"><div class="ayy-card__header"><h3 class="ayy-card__title">Scalez</h3></div></div>
  </div>
</section>
```

React:

```tsx
import type { CSSProperties } from "react";
import { Card, CardHeader, CardTitle, Section, SectionDescription, SectionHeader, SectionTitle } from "@danitesler/ayywi/react";

export default function Example() {
  return (
    <Section center className="ayy-container" aria-labelledby="work-title">
      <SectionHeader>
        <SectionTitle id="work-title">Portfolio work</SectionTitle>
        <SectionDescription>Selected case studies in product design, systems and UX strategy.</SectionDescription>
      </SectionHeader>
      <div className="ayy-grid" style={{ "--ayy-min": "12rem" } as CSSProperties}>
        {["Oktopost", "Comeet", "Scalez"].map((name) => (
          <Card key={name}>
            <CardHeader>
              <CardTitle>{name}</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>
    </Section>
  );
}
```

## Section — Numbered chapter

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<!-- A case-study chapter. --ayy-spot (usually set once on <main>) colours the number. -->
<section class="ayy-section" style="--ayy-spot: var(--ayy-accent-product)" aria-labelledby="ds-title">
  <header class="ayy-section__header">
    <p class="ayy-section__eyebrow"><span class="ayy-section__number">02</span>Design system</p>
    <h2 class="ayy-section__title" id="ds-title">Lobster: the shared language behind every screen</h2>
  </header>
  <div class="ayy-prose">
    <p>The product had outgrown its shared UI: navigation, cards and colour varied from screen to screen, and every new feature risked drifting further.</p>
  </div>
</section>
```

React:

```tsx
import type { CSSProperties } from "react";
import { Section, SectionEyebrow, SectionHeader, SectionTitle } from "@danitesler/ayywi/react";

export default function Example() {
  return (
    <Section style={{ "--ayy-spot": "var(--ayy-accent-product)" } as CSSProperties} aria-labelledby="ds-title">
      <SectionHeader>
        <SectionEyebrow number="02">Design system</SectionEyebrow>
        <SectionTitle id="ds-title">Lobster: the shared language behind every screen</SectionTitle>
      </SectionHeader>
      <div className="ayy-prose">
        <p>
          The product had outgrown its shared UI: navigation, cards and colour varied from screen to screen, and every new feature risked
          drifting further.
        </p>
      </div>
    </Section>
  );
}
```

---
Part of @danitesler/ayywi 0.0.1: load `dist/ayywi.min.css` (and `dist/elements.global.js` for the <ayy-*> elements). The rules every screen follows: [llms-full.txt#rules](../llms-full.txt#rules). Every component: [llms.txt](../llms.txt).
