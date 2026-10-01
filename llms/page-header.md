# Page header

Category: Layout. The top of an app screen: an optional breadcrumb or eyebrow, the page title (the h1), one line of description, and the page's actions at the end — below the title on phones.

**Classes**
- `.ayy-page-header` — Root <header>. A two-column grid: everything stacks in the first column, __actions sits in the second and spans them. One column below 48rem, actions last. A Breadcrumb or .ayy-eyebrow can go first.
- `.ayy-page-header__title` — The page's <h1>: heading font, 28px, semibold. Smaller than marketing headings on purpose — app screens are for work.
- `.ayy-page-header__description` — One sentence under the title, muted, at reading width.
- `.ayy-page-header__actions` — The page's buttons, at the inline end (under the title on phones). One primary at most; the rest outline or ghost.

**JS (framework-free)**: pageHeaderClass, pageHeaderTitleClass, pageHeaderDescriptionClass, pageHeaderActionsClass constants.

**React** — `import { PageHeader, PageHeaderTitle, PageHeaderDescription, PageHeaderActions } from "ayywi/react";`
- `<PageHeader>` renders <header class="ayy-page-header">.
- `<PageHeaderTitle>` renders <h1 class="ayy-page-header__title">.
- `<PageHeaderDescription>` renders <p class="ayy-page-header__description">.
- `<PageHeaderActions>` renders <div class="ayy-page-header__actions">.

**Accessibility**
- The title is the page's only <h1>; sections below it start at <h2>.
- Keep the actions after the title in the source, so screen readers hear what the page is before what it can do.
- A breadcrumb above the title is its own <nav aria-label="Breadcrumb">.

**Do**
- Use a page header at the top of every screen in the App shell's main: title, one line of description, the page's actions.
- Put the one thing people come to the page to do in the actions as the primary button (New project, Invite); filters and exports are outline or ghost.
- Add a Breadcrumb above the title once pages are more than one level deep.
- Keep the description to one sentence that says what the page is for.

**Don't**
- Don't use it on marketing pages — use a Section with a SectionHeader, or .ayy-display for a hero.
- Don't put tabs, search or filters in it — put them in a toolbar row (.ayy-spread) under it.
- Don't put more than three actions in it; move the rest into a DropdownMenu.
- Don't add a second h1 elsewhere on the page.

## Page header — Title, description and actions

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<div style="inline-size: 100%">
  <header class="ayy-page-header">
    <nav class="ayy-breadcrumb" aria-label="Breadcrumb">
      <ol class="ayy-breadcrumb__list">
        <li class="ayy-breadcrumb__item"><a class="ayy-breadcrumb__link" href="#workspace">Workspace</a></li>
        <li class="ayy-breadcrumb__item"><span aria-current="page">Projects</span></li>
      </ol>
    </nav>
    <h1 class="ayy-page-header__title">Projects</h1>
    <p class="ayy-page-header__description">Everything your team is shipping this quarter.</p>
    <div class="ayy-page-header__actions">
      <button type="button" class="ayy-button ayy-button--outline"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M2.99969 17.0002C2.99969 17.9302 2.99969 18.3952 3.10192 18.7767C3.37932 19.8119 4.18796 20.6206 5.22324 20.898C5.60474 21.0002 6.06972 21.0002 6.99969 21.0002L16.9997 21.0002C17.9297 21.0002 18.3947 21.0002 18.7762 20.898C19.8114 20.6206 20.6201 19.8119 20.8975 18.7767C20.9997 18.3952 20.9997 17.9302 20.9997 17.0002" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M16.4998 11.5002C16.4998 11.5002 13.1856 16.0002 11.9997 16.0002C10.8139 16.0002 7.49976 11.5002 7.49976 11.5002M11.9997 15.0002V3.00016" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg>Export</button>
      <button type="button" class="ayy-button"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12.001 5.00003V19.002" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M19.002 12.002L4.99998 12.002" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg>New project</button>
    </div>
  </header>
</div>
```

React:

```tsx
import { Add01Icon, Download01Icon } from "@hugeicons/core-free-icons";
import { Breadcrumb, Button, Icon, PageHeader, PageHeaderActions, PageHeaderDescription, PageHeaderTitle } from "ayywi/react";

export default function Example() {
  return (
    <div style={{ inlineSize: "100%" }}>
      <PageHeader>
        <Breadcrumb items={[{ label: "Workspace", href: "#workspace" }, { label: "Projects" }]} />
        <PageHeaderTitle>Projects</PageHeaderTitle>
        <PageHeaderDescription>Everything your team is shipping this quarter.</PageHeaderDescription>
        <PageHeaderActions>
          <Button variant="outline">
            <Icon icon={Download01Icon} />
            Export
          </Button>
          <Button>
            <Icon icon={Add01Icon} />
            New project
          </Button>
        </PageHeaderActions>
      </PageHeader>
    </div>
  );
}
```

---
Part of ayywi 0.4.0: load `dist/ayywi.min.css` (and `dist/elements.global.js` for the <ayy-*> elements). The rules every screen follows: [llms-full.txt#rules](../llms-full.txt#rules). Every component: [llms.txt](../llms.txt).
