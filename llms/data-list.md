# Data list

Category: Data display. Label / value pairs on a description list: small uppercase labels over their values, stacked or in a wrapping row.

**Classes**
- `.ayy-data-list` — Root <dl>. Items stacked.
- `.ayy-data-list--row` — Items side by side, wrapping to fit (each at least --ayy-min, default 9rem).
- `.ayy-data-list__item` — A <div> holding one <dt> and its <dd>.
- `.ayy-data-list__label` — The <dt>: small uppercase muted label.
- `.ayy-data-list__value` — The <dd>: the value, in body text.

**JS (framework-free)**: dataListClass({ row?, className? }) → string; dataListItemClass, dataListLabelClass, dataListValueClass constants.

**React** — `import { DataList, DataListItem } from "@danitesler/ayywi/react";`
- `<DataList>` renders <dl>. Props: `row` boolean
- `<DataListItem>` renders <div><dt>label</dt><dd>children</dd></div>. Props: `label` ReactNode (required)

**Accessibility**
- A real <dl>/<dt>/<dd>, so screen readers announce each value with its term.
- Links in values keep their focus ring; external ones should say so.

**Do**
- Use a data list for facts about a thing: Role, Company, Years, Platform on a case study; plan details; file metadata.
- Keep labels to one or two words.
- Use the row form under a title, as the facts line of a case study.

**Don't**
- Don't use it for many records with the same fields — use Table.
- Don't use it for editable settings — use Field with inputs.
- Don't use it for prose; values should be short.

## Data list — Facts row

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<dl class="ayy-data-list ayy-data-list--row" style="inline-size: 100%">
  <div class="ayy-data-list__item">
    <dt class="ayy-data-list__label">Role</dt>
    <dd class="ayy-data-list__value">Product designer</dd>
  </div>
  <div class="ayy-data-list__item">
    <dt class="ayy-data-list__label">Company</dt>
    <dd class="ayy-data-list__value"><a class="ayy-link" href="#oktopost">oktopost.com</a></dd>
  </div>
  <div class="ayy-data-list__item">
    <dt class="ayy-data-list__label">Years</dt>
    <dd class="ayy-data-list__value">2023 – present</dd>
  </div>
  <div class="ayy-data-list__item">
    <dt class="ayy-data-list__label">Platform</dt>
    <dd class="ayy-data-list__value">Web, mobile web &amp; email</dd>
  </div>
</dl>
```

React:

```tsx
import { DataList, DataListItem } from "@danitesler/ayywi/react";

export default function Example() {
  return (
    <DataList row style={{ inlineSize: "100%" }}>
      <DataListItem label="Role">Product designer</DataListItem>
      <DataListItem label="Company">
        <a className="ayy-link" href="#oktopost">
          oktopost.com
        </a>
      </DataListItem>
      <DataListItem label="Years">2023 – present</DataListItem>
      <DataListItem label="Platform">Web, mobile web &amp; email</DataListItem>
    </DataList>
  );
}
```

---
Part of @danitesler/ayywi 0.0.1: load `dist/ayywi.min.css` (and `dist/elements.global.js` for the <ayy-*> elements). The rules every screen follows: [llms-full.txt#rules](../llms-full.txt#rules). Every component: [llms.txt](../llms.txt).
