# Accordion

Category: Layout. Questions and answers, or sections people open one at a time: native <details> in a stack with hairlines between them. Same name attribute on each and opening one closes the others.

**Classes**
- `.ayy-accordion` — Root <div>: a column of items with hairlines above, between and below.
- `.ayy-accordion__item` — A native <details>. Give every item in the accordion the same name attribute to allow only one open at a time. `open` expands it.
- `.ayy-accordion__trigger` — The <summary>: the question, medium weight, with a chevron at the inline end that turns over when open.
- `.ayy-accordion__content` — The answer below the trigger, in soft text. Paragraphs and lists inside are spaced for you.

**JS (framework-free)**: accordionClass, accordionItemClass, accordionTriggerClass, accordionContentClass constants.

**React** — `import { Accordion, AccordionItem } from "@danitesler/ayywi/react";`
- `<Accordion>` renders <div class="ayy-accordion">. Props: `single` boolean — one item open at a time (a shared name on every <details>).
- `<AccordionItem>` renders <details class="ayy-accordion__item"><summary class="ayy-accordion__trigger">…<div class="ayy-accordion__content">. Props: `label` The always-visible row: the question or section name.; `open` Start expanded.

**Accessibility**
- It's native <details>/<summary>: Enter and Space toggle it and the open state is announced. Don't add aria-expanded or a click handler.
- Keep the summary text short and complete (a question), since it's the only part people see.
- Find-in-page opens a closed item that contains the match.

**Do**
- Use an accordion for FAQs and for long optional detail people pick from: pricing questions, shipping info, advanced settings.
- Use single on FAQ lists so the page doesn't grow into a wall of text.
- Open the first item when most people need it.

**Don't**
- Don't hide content everyone needs behind it — show it.
- Don't use it to switch between views of the same thing — use Tabs.
- Don't use it for navigation — use the App shell's collapse inside a sidebar.
- Don't nest an accordion inside another.

## Accordion — FAQ

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<div class="ayy-accordion" style="inline-size: min(100%, 40rem)">
  <details class="ayy-accordion__item" name="accordion-faq-1" open="">
    <summary class="ayy-accordion__trigger">Can I cancel any time?</summary>
    <div class="ayy-accordion__content">
      <p>Yes. Your plan runs to the end of the billing period, then your projects switch to read-only. Nothing is deleted for 90 days.</p>
    </div>
  </details>
  <details class="ayy-accordion__item" name="accordion-faq-1">
    <summary class="ayy-accordion__trigger">Do viewers need a paid seat?</summary>
    <div class="ayy-accordion__content">
      <p>No. Only people who edit pages count as editors. Viewers and commenters are free on every plan.</p>
    </div>
  </details>
  <details class="ayy-accordion__item" name="accordion-faq-1">
    <summary class="ayy-accordion__trigger">Where is my data stored?</summary>
    <div class="ayy-accordion__content">
      <p>In the EU or the US, your choice when you create a workspace. Backups stay in the same region.</p>
      <p>Enterprise plans can bring their own storage bucket.</p>
    </div>
  </details>
</div>
```

React:

```tsx
import { Accordion, AccordionItem } from "@danitesler/ayywi/react";

export default function Example() {
  return (
    <Accordion single style={{ inlineSize: "min(100%, 40rem)" }}>
      <AccordionItem label="Can I cancel any time?" open>
        <p>Yes. Your plan runs to the end of the billing period, then your projects switch to read-only. Nothing is deleted for 90 days.</p>
      </AccordionItem>
      <AccordionItem label="Do viewers need a paid seat?">
        <p>No. Only people who edit pages count as editors. Viewers and commenters are free on every plan.</p>
      </AccordionItem>
      <AccordionItem label="Where is my data stored?">
        <p>In the EU or the US, your choice when you create a workspace. Backups stay in the same region.</p>
        <p>Enterprise plans can bring their own storage bucket.</p>
      </AccordionItem>
    </Accordion>
  );
}
```

---
Part of @danitesler/ayywi 0.0.1: load `dist/ayywi.min.css` (and `dist/elements.global.js` for the <ayy-*> elements). The rules every screen follows: [llms-full.txt#rules](../llms-full.txt#rules). Every component: [llms.txt](../llms.txt).
