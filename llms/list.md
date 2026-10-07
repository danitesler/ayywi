# List

Category: Data display. Rows of people, records, threads or settings: leading media (avatar, icon, icon tile), a title over a description, and trailing meta or a control. A link in the title makes the whole row clickable.

**Classes**
- `.ayy-list` — Root <ul>. Rounded rows with a small gap between them.
- `.ayy-list--divided` — Flush rows with hairlines between them: settings rows, records inside a card.
- `.ayy-list--compact` — Tight rows without padding and a small icon: an icon checklist (plan perks, what's included, requirements). Rows here usually hold an Icon and plain text.
- `.ayy-list__item` — The <li> row: a flex row of leading media, __content and trailing items, vertically centred. Everything but __content keeps its size.
- `.ayy-list__content` — The column that holds __title and __description; it takes the free space and can shrink (add .ayy-truncate to cut long text).
- `.ayy-list__title` — The row's main text, medium weight. Holds the __link when the row opens something.
- `.ayy-list__description` — Supporting text under the title, muted.
- `.ayy-list__meta` — Short trailing text: a time, a count, a size. Small, muted, tabular numbers.
- `.ayy-list__link` — The <a> inside __title. Its ::after covers the row, so the whole row is one tab stop; other controls in the row stay clickable above it. The row gets a wash on hover, a ring on focus, and a stronger tint and heavier title with aria-current="page" (or "true").

**JS (framework-free)**: listClass({ divided?, compact?, className? }) → string; listItemClass, listContentClass, listTitleClass, listDescriptionClass, listMetaClass, listLinkClass constants.

**React** — `import { List, ListItem, ListContent, ListTitle, ListDescription, ListMeta, ListLink } from "@danitesler/ayywi/react";`
- `<List>` renders <ul class="ayy-list">. Props: `divided` boolean — hairlines between flush rows.; `compact` boolean — tight rows for an icon checklist.
- `<ListItem>` renders <li class="ayy-list__item">.
- `<ListContent>` renders <div class="ayy-list__content">.
- `<ListTitle>` renders <p class="ayy-list__title">, or <label> with htmlFor. Props: `htmlFor` The id of the row's Switch or Checkbox: the title becomes its <label>.
- `<ListDescription>` renders <p class="ayy-list__description">.
- `<ListMeta>` renders <span class="ayy-list__meta">.
- `<ListLink>` renders <a class="ayy-list__link">. Props: `current` boolean — sets aria-current="page".

**Accessibility**
- It's a real list: screen readers announce how many rows there are.
- One link per row, in the title, so a row is one tab stop with a meaningful name. Buttons and switches in the row are separate tab stops after it.
- Mark the open row with aria-current="page" (it's a page) or "true" (a selection in a list-detail view); it gets a tint and a heavier title, not just colour.
- A switch or checkbox in a settings row needs its label: make the title a <label for> pointing at it.
- Avatars and icons in the leading slot are decorative when the title names the row.

**Do**
- Use a list for a feed of similar things people scan and open: conversations, notifications, files, members, search results.
- Use List divided for settings: a title and description per row, the Switch or Button at the end.
- Use List compact for a short checklist with an icon per row: plan perks, what's included, password rules.
- Keep the same slots on every row: if one row has an avatar, they all do.
- Put the time or count in ListMeta, and a status in a Badge at the end.
- Cut long descriptions to one line with .ayy-truncate in inboxes and pickers.

**Don't**
- Don't use a list for data people compare across columns — use a Table.
- Don't use it for label/value pairs about one thing — use a Data list.
- Don't use it for the site or app navigation — use the App shell or Navbar.
- Don't put two links in a row's title, or wrap the whole <li> in an <a>.

## List — Conversations

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<div style="inline-size: min(100%, 26rem)">
  <ul class="ayy-list" aria-label="Conversations">
    <li class="ayy-list__item">
      <span role="img" aria-label="Jonah Weiss" class="ayy-avatar ayy-avatar--sm"><span class="ayy-avatar__fallback" aria-hidden="true">JW</span></span>
      <div class="ayy-list__content">
        <p class="ayy-list__title"><a class="ayy-list__link" aria-current="page" href="#jonah">Jonah Weiss</a></p>
        <p class="ayy-list__description ayy-truncate">The export button spins forever on large reports.</p>
        <span class="ayy-badge ayy-badge--destructive">Urgent</span>
      </div>
      <span class="ayy-list__meta">2m</span>
    </li>
    <li class="ayy-list__item">
      <span role="img" aria-label="Ana Ruiz" class="ayy-avatar ayy-avatar--sm"><span class="ayy-avatar__fallback" aria-hidden="true">AR</span></span>
      <div class="ayy-list__content">
        <p class="ayy-list__title"><a class="ayy-list__link" href="#ana">Ana Ruiz</a></p>
        <p class="ayy-list__description ayy-truncate">Can we move our billing date to the 1st?</p>
        <span class="ayy-badge ayy-badge--info">Billing</span>
      </div>
      <span class="ayy-list__meta">18m</span>
    </li>
    <li class="ayy-list__item">
      <span role="img" aria-label="Leo Park" class="ayy-avatar ayy-avatar--sm"><span class="ayy-avatar__fallback" aria-hidden="true">LP</span></span>
      <div class="ayy-list__content">
        <p class="ayy-list__title"><a class="ayy-list__link" href="#leo">Leo Park</a></p>
        <p class="ayy-list__description ayy-truncate">Thanks, that fixed it!</p>
        <span class="ayy-badge ayy-badge--success">Solved</span>
      </div>
      <span class="ayy-list__meta">1h</span>
    </li>
  </ul>
</div>
```

React:

```tsx
import { Avatar, Badge, List, ListContent, ListDescription, ListItem, ListLink, ListMeta, ListTitle } from "@danitesler/ayywi/react";

const THREADS = [
  { name: "Jonah Weiss", text: "The export button spins forever on large reports.", time: "2m", status: "Urgent", variant: "destructive", current: true },
  { name: "Ana Ruiz", text: "Can we move our billing date to the 1st?", time: "18m", status: "Billing", variant: "info" },
  { name: "Leo Park", text: "Thanks, that fixed it!", time: "1h", status: "Solved", variant: "success" },
] as const;

export default function Example() {
  return (
    <div style={{ inlineSize: "min(100%, 26rem)" }}>
      <List aria-label="Conversations">
        {THREADS.map((t) => (
          <ListItem key={t.name}>
            <Avatar name={t.name} size="sm" />
            <ListContent>
              <ListTitle>
                <ListLink href={`#${t.name.split(" ")[0].toLowerCase()}`} current={"current" in t}>
                  {t.name}
                </ListLink>
              </ListTitle>
              <ListDescription className="ayy-truncate">{t.text}</ListDescription>
              <Badge variant={t.variant}>{t.status}</Badge>
            </ListContent>
            <ListMeta>{t.time}</ListMeta>
          </ListItem>
        ))}
      </List>
    </div>
  );
}
```

## List — Settings rows

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<div class="ayy-card" style="inline-size: min(100%, 30rem)">
  <div class="ayy-card__content">
    <ul class="ayy-list ayy-list--divided" aria-label="Notifications">
      <li class="ayy-list__item">
        <span class="ayy-icon-tile ayy-icon-tile--sm" aria-hidden="true"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M2 6L8.91302 9.91697C11.4616 11.361 12.5384 11.361 15.087 9.91697L22 6" stroke="currentColor" stroke-linejoin="round" stroke-width="1.5"></path><path d="M2.01577 13.4756C2.08114 16.5412 2.11383 18.0739 3.24496 19.2094C4.37608 20.3448 5.95033 20.3843 9.09883 20.4634C11.0393 20.5122 12.9607 20.5122 14.9012 20.4634C18.0497 20.3843 19.6239 20.3448 20.7551 19.2094C21.8862 18.0739 21.9189 16.5412 21.9842 13.4756C22.0053 12.4899 22.0053 11.5101 21.9842 10.5244C21.9189 7.45886 21.8862 5.92609 20.7551 4.79066C19.6239 3.65523 18.0497 3.61568 14.9012 3.53657C12.9607 3.48781 11.0393 3.48781 9.09882 3.53656C5.95033 3.61566 4.37608 3.65521 3.24495 4.79065C2.11382 5.92608 2.08114 7.45885 2.01576 10.5244C1.99474 11.5101 1.99475 12.4899 2.01577 13.4756Z" stroke="currentColor" stroke-linejoin="round" stroke-width="1.5"></path></svg></span>
        <div class="ayy-list__content">
          <label for="notify-email" class="ayy-list__title">Email</label>
          <p class="ayy-list__description">A summary of new invoices and payments, once a day.</p>
        </div>
        <input type="checkbox" role="switch" class="ayy-switch" id="notify-email" checked=""/>
      </li>
      <li class="ayy-list__item">
        <span class="ayy-icon-tile ayy-icon-tile--sm" aria-hidden="true"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M13.5 2H10.5C8.14298 2 6.96447 2 6.23223 2.73223C5.5 3.46447 5.5 4.64298 5.5 7V17C5.5 19.357 5.5 20.5355 6.23223 21.2678C6.96447 22 8.14298 22 10.5 22H13.5C15.857 22 17.0355 22 17.7678 21.2678C18.5 20.5355 18.5 19.357 18.5 17V7C18.5 4.64298 18.5 3.46447 17.7678 2.73223C17.0355 2 15.857 2 13.5 2Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M12.125 19H12M12.25 19C12.25 19.1381 12.1381 19.25 12 19.25C11.8619 19.25 11.75 19.1381 11.75 19C11.75 18.8619 11.8619 18.75 12 18.75C12.1381 18.75 12.25 18.8619 12.25 19Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg></span>
        <div class="ayy-list__content">
          <label for="notify-push" class="ayy-list__title">Push notifications</label>
          <p class="ayy-list__description">Payments as they arrive, on your phone.</p>
        </div>
        <input type="checkbox" role="switch" class="ayy-switch" id="notify-push" checked=""/>
      </li>
      <li class="ayy-list__item">
        <span class="ayy-icon-tile ayy-icon-tile--sm" aria-hidden="true"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M15.5 18C15.5 19.933 13.933 21.5 12 21.5C10.067 21.5 8.5 19.933 8.5 18" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M19.2311 18H4.76887C3.79195 18 3 17.208 3 16.2311C3 15.762 3.18636 15.3121 3.51809 14.9803L4.12132 14.3771C4.68393 13.8145 5 13.0514 5 12.2558V9.5C5 5.63401 8.13401 2.5 12 2.5C15.866 2.5 19 5.634 19 9.5V12.2558C19 13.0514 19.3161 13.8145 19.8787 14.3771L20.4819 14.9803C20.8136 15.3121 21 15.762 21 16.2311C21 17.208 20.208 18 19.2311 18Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg></span>
        <div class="ayy-list__content">
          <label for="notify-reminders" class="ayy-list__title">Payment reminders</label>
          <p class="ayy-list__description">Nudge clients three days before an invoice is due.</p>
        </div>
        <input type="checkbox" role="switch" class="ayy-switch" id="notify-reminders"/>
      </li>
    </ul>
  </div>
</div>
```

React:

```tsx
import { Mail01Icon, Notification01Icon, SmartPhone01Icon } from "@hugeicons/core-free-icons";
import { Card, CardContent, Icon, IconTile, List, ListContent, ListDescription, ListItem, ListTitle, Switch } from "@danitesler/ayywi/react";

const ROWS = [
  { id: "email", icon: Mail01Icon, title: "Email", text: "A summary of new invoices and payments, once a day.", on: true },
  { id: "push", icon: SmartPhone01Icon, title: "Push notifications", text: "Payments as they arrive, on your phone.", on: true },
  { id: "reminders", icon: Notification01Icon, title: "Payment reminders", text: "Nudge clients three days before an invoice is due.", on: false },
];

export default function Example() {
  return (
    <Card style={{ inlineSize: "min(100%, 30rem)" }}>
      <CardContent>
        <List divided aria-label="Notifications">
          {ROWS.map((r) => (
            <ListItem key={r.id}>
              <IconTile size="sm">
                <Icon icon={r.icon} />
              </IconTile>
              <ListContent>
                <ListTitle htmlFor={`notify-${r.id}`}>{r.title}</ListTitle>
                <ListDescription>{r.text}</ListDescription>
              </ListContent>
              <Switch id={`notify-${r.id}`} defaultChecked={r.on} />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
}
```

---
Part of @danitesler/ayywi 0.0.1: load `dist/ayywi.min.css` (and `dist/elements.global.js` for the <ayy-*> elements). The rules every screen follows: [llms-full.txt#rules](../llms-full.txt#rules). Every component: [llms.txt](../llms.txt).
