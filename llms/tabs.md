# Tabs

Category: Layout. Tabs for switching between panels of related content on the same page. They can be used fully from the keyboard. Also called: tabs, tab, tab-list, tablist.

**Classes**
- `.ayy-tabs` — Wrapper (block). Also put it on <ayy-tabs>.
- `.ayy-tabs--sm` — Small: the track is a small control tall, tab text is control sm, tighter padding. Reaches only its own list, not tabs nested in a panel.
- `.ayy-tabs--lg` — Large: the track is a large control tall, tab text is control lg, more padding.
- `.ayy-tabs__list` — role="tablist" pill container.
- `.ayy-tabs__tab` — role="tab" button. Selected when aria-selected="true".
- `.ayy-tabs__panel` — role="tabpanel". Hide inactive panels with the hidden attribute.
- `.ayy-tabs__count` — Small count after a tab's label (items in a filter). Inverts with the selected tab.

**States**
- `default` — A pill track (wash fill, line border) with text-soft tab labels.
- `hover` (`.ayy-tabs__tab:hover`) — Tab label turns full text colour.
- `pressed` — doesn't apply: No pressed look; it selects on click.
- `focus` (`.ayy-tabs__tab:focus-visible; .ayy-tabs__panel:focus-visible`) — 2px ring, 2px offset.
- `disabled` (`.ayy-tabs__tab:disabled`) — --ayy-opacity-disabled, not-allowed cursor; arrow keys skip it. Forced colours: GrayText.
- `selected` (`.ayy-tabs__tab[aria-selected="true"]`) — Filled with the text colour, label in the page colour, small shadow; its count gets a 15% page-colour tint. Forced colours: Highlight.
- `error` — doesn't apply: No error look; show it in the panel.
- `loading` — doesn't apply: Show loading in the panel (Skeleton), not on the tab.

**Sizes**
- `sm` — Track at the sm control height (28px compact, 32 comfortable, 40 touch), control sm text, 8px side padding.
- `md` (default) — Track at the md control height (32px compact, 40 comfortable, 44 touch), control md text, 12px side padding.
- `lg` — Track at the lg control height (36px compact, 44 comfortable, 48 touch), control lg text, 16px side padding.
- Density — Every size follows data-density with the control scale.
- Width — The list hugs its tabs and scrolls sideways when they don't fit; panels fill the container.

**Custom element** `<ayy-tabs>` (@danitesler/ayywi/elements) — A [role=tablist] of [role=tab] buttons and [role=tabpanel] panels, paired by data-value (or by order). Ids, aria-controls/labelledby, tabindex and hidden are managed for you.
- attribute `value`: The selected tab's data-value (or index). Two-way.
- attribute `class`: Put ayy-tabs on it for block layout.
- event `ayy-value-change`: { value: string } — the user picked a tab

**React** — `import { Tabs, TabsList, TabsTrigger, TabsContent } from "@danitesler/ayywi/react";`
- `<Tabs>` renders <div>. Props: `size` "sm" | "md" | "lg" — the height of the tab list and its labels.; `value / defaultValue` Selected tab value (controlled / uncontrolled).; `onValueChange` (value: string) => void
- `<TabsList>` renders <div role="tablist">. Props: `aria-label` Recommended.
- `<TabsTrigger>` renders <button role="tab">. Props: `value` string (required); `icon` ReactNode — optional icon before the label.
- `<TabsContent>` renders <div role="tabpanel">. Props: `value` string (required); `keepMounted` Keep children mounted while hidden. Default false.

**Accessibility**
- Arrow keys move between tabs (flipped in RTL), Home/End jump to first/last. Activation follows focus.
- Only the selected tab is in the tab order (roving tabindex).
- Give the tablist an aria-label when there's no visible heading.

**Do**
- Use tabs to switch views of the same object (Overview / Activity / Members) or as segmented filters with 2–6 options.
- Keep tab labels to one or two words.
- Keep the tab set stable — don't add/remove tabs based on content.

**Don't**
- Don't use tabs for page-level navigation between routes — use links.
- Don't use tabs for sequential steps — use Steps and separate pages. For a filter that changes one view (Today / Upcoming), use a Segmented control.
- Don't nest tabs inside tabs.
- Don't use tabs for more than ~6 options.

## Tabs — Basic

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<!-- <ayy-tabs> (@danitesler/ayywi/elements) wires ids, clicks and arrow keys. The initial aria-selected / hidden avoid a flash before it loads.
     Vue/Svelte/Angular: bind `value` and listen for `ayy-value-change`. -->
<ayy-tabs class="ayy-tabs" value="overview">
  <div class="ayy-tabs__list" role="tablist" aria-label="Project settings">
    <button type="button" class="ayy-tabs__tab" role="tab" data-value="overview" aria-selected="true">Overview</button>
    <button type="button" class="ayy-tabs__tab" role="tab" data-value="activity" aria-selected="false" tabindex="-1">Activity</button>
    <button type="button" class="ayy-tabs__tab" role="tab" data-value="members" aria-selected="false" tabindex="-1">Members</button>
    <button type="button" class="ayy-tabs__tab" role="tab" data-value="billing" aria-selected="false" tabindex="-1" disabled>Billing</button>
  </div>
  <div class="ayy-tabs__panel" role="tabpanel" data-value="overview">
    <p class="ayy-muted">3 environments · 12 deploys this week</p>
  </div>
  <div class="ayy-tabs__panel" role="tabpanel" data-value="activity" hidden>
    <p class="ayy-muted">Latest changes from your team.</p>
  </div>
  <div class="ayy-tabs__panel" role="tabpanel" data-value="members" hidden>
    <p class="ayy-muted">People with access to this project.</p>
  </div>
  <div class="ayy-tabs__panel" role="tabpanel" data-value="billing" hidden></div>
</ayy-tabs>
```

React:

```tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@danitesler/ayywi/react";

export default function Example() {
  return (
    <Tabs defaultValue="overview">
      <TabsList aria-label="Project settings">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="activity">Activity</TabsTrigger>
        <TabsTrigger value="members">Members</TabsTrigger>
        <TabsTrigger value="billing" disabled>
          Billing
        </TabsTrigger>
      </TabsList>
      <TabsContent value="overview">
        <p className="ayy-muted">3 environments · 12 deploys this week</p>
      </TabsContent>
      <TabsContent value="activity">
        <p className="ayy-muted">Latest changes from your team.</p>
      </TabsContent>
      <TabsContent value="members">
        <p className="ayy-muted">People with access to this project.</p>
      </TabsContent>
      <TabsContent value="billing" />
    </Tabs>
  );
}
```

## Tabs — Sizes

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<!-- <ayy-tabs> (@danitesler/ayywi/elements) wires ids, clicks and arrow keys. -->
<div class="ayy-stack">
  <ayy-tabs class="ayy-tabs ayy-tabs--sm" value="all">
    <div class="ayy-tabs__list" role="tablist" aria-label="Small tabs">
      <button type="button" class="ayy-tabs__tab" role="tab" data-value="all" aria-selected="true">All</button>
      <button type="button" class="ayy-tabs__tab" role="tab" data-value="open" aria-selected="false" tabindex="-1">Open</button>
      <button type="button" class="ayy-tabs__tab" role="tab" data-value="closed" aria-selected="false" tabindex="-1">Closed</button>
    </div>
    <div class="ayy-tabs__panel" role="tabpanel" data-value="all"></div>
    <div class="ayy-tabs__panel" role="tabpanel" data-value="open" hidden></div>
    <div class="ayy-tabs__panel" role="tabpanel" data-value="closed" hidden></div>
  </ayy-tabs>
  <ayy-tabs class="ayy-tabs" value="all">
    <div class="ayy-tabs__list" role="tablist" aria-label="Medium tabs">
      <button type="button" class="ayy-tabs__tab" role="tab" data-value="all" aria-selected="true">All</button>
      <button type="button" class="ayy-tabs__tab" role="tab" data-value="open" aria-selected="false" tabindex="-1">Open</button>
      <button type="button" class="ayy-tabs__tab" role="tab" data-value="closed" aria-selected="false" tabindex="-1">Closed</button>
    </div>
    <div class="ayy-tabs__panel" role="tabpanel" data-value="all"></div>
    <div class="ayy-tabs__panel" role="tabpanel" data-value="open" hidden></div>
    <div class="ayy-tabs__panel" role="tabpanel" data-value="closed" hidden></div>
  </ayy-tabs>
  <ayy-tabs class="ayy-tabs ayy-tabs--lg" value="all">
    <div class="ayy-tabs__list" role="tablist" aria-label="Large tabs">
      <button type="button" class="ayy-tabs__tab" role="tab" data-value="all" aria-selected="true">All</button>
      <button type="button" class="ayy-tabs__tab" role="tab" data-value="open" aria-selected="false" tabindex="-1">Open</button>
      <button type="button" class="ayy-tabs__tab" role="tab" data-value="closed" aria-selected="false" tabindex="-1">Closed</button>
    </div>
    <div class="ayy-tabs__panel" role="tabpanel" data-value="all"></div>
    <div class="ayy-tabs__panel" role="tabpanel" data-value="open" hidden></div>
    <div class="ayy-tabs__panel" role="tabpanel" data-value="closed" hidden></div>
  </ayy-tabs>
</div>
```

React:

```tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@danitesler/ayywi/react";

export default function Example() {
  return (
    <div className="ayy-stack">
      <Tabs size="sm" defaultValue="all">
        <TabsList aria-label="Small tabs">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="open">Open</TabsTrigger>
          <TabsTrigger value="closed">Closed</TabsTrigger>
        </TabsList>
        <TabsContent value="all" />
        <TabsContent value="open" />
        <TabsContent value="closed" />
      </Tabs>
      <Tabs defaultValue="all">
        <TabsList aria-label="Medium tabs">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="open">Open</TabsTrigger>
          <TabsTrigger value="closed">Closed</TabsTrigger>
        </TabsList>
        <TabsContent value="all" />
        <TabsContent value="open" />
        <TabsContent value="closed" />
      </Tabs>
      <Tabs size="lg" defaultValue="all">
        <TabsList aria-label="Large tabs">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="open">Open</TabsTrigger>
          <TabsTrigger value="closed">Closed</TabsTrigger>
        </TabsList>
        <TabsContent value="all" />
        <TabsContent value="open" />
        <TabsContent value="closed" />
      </Tabs>
    </div>
  );
}
```

## Tabs — With icons

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<!-- Tabs with custom icons before each label. -->
<ayy-tabs class="ayy-tabs" value="code">
  <div class="ayy-tabs__list" role="tablist" aria-label="Project">
    <button type="button" class="ayy-tabs__tab" role="tab" data-value="code" aria-selected="true"><svg class="ayy-icon" data-ayy-icon="code" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M16 6.99998L19.0664 9.64296C20.3554 10.7541 21 11.3096 21 12C21 12.6903 20.3555 13.2459 19.0664 14.357L16 17" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/><path d="M8 6.99998L4.93365 9.64296C3.64455 10.7541 3 11.3096 3 12C3 12.6903 3.64455 13.2459 4.93365 14.357L8 17" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/></svg>Code</button>
    <button type="button" class="ayy-tabs__tab" role="tab" data-value="pull-requests" aria-selected="false" tabindex="-1"><svg class="ayy-icon" data-ayy-icon="git-pull-request" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 8L6 16" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/><path d="M18 16V12C18 9.17156 18 7.75735 17.1213 6.87867C16.2426 5.99999 14.8284 5.99999 12 5.99999L11 5.99999M11 5.99999C11 5.29976 12.9943 3.99152 13.5 3.49999M11 5.99999C11 6.70022 12.9943 8.00846 13.5 8.49999" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/><circle cx="6" cy="18" r="2" stroke="currentColor" stroke-width="1.5"/><circle cx="6" cy="6" r="2" stroke="currentColor" stroke-width="1.5"/><circle cx="18" cy="18" r="2" stroke="currentColor" stroke-width="1.5"/></svg>Pull requests</button>
    <button type="button" class="ayy-tabs__tab" role="tab" data-value="deployments" aria-selected="false" tabindex="-1"><svg class="ayy-icon" data-ayy-icon="rocket" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M8 10.1667L12.1232 6.04344C13.2481 4.91858 13.8105 4.35614 14.4312 3.90314C15.7047 2.9737 17.1818 2.36187 18.7395 2.11858C19.4988 2 20.2942 2 21.885 2C21.9681 2 22 2.03812 22 2.11504C22 3.70584 22 4.50125 21.8814 5.26046C21.6381 6.81818 21.0263 8.29527 20.0969 9.56878C19.6439 10.1895 19.0814 10.7519 17.9566 11.8768L13.8333 16" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/><path d="M10.341 8.09838C8.63808 8.09838 6.49778 7.73765 4.9043 8.39769C3.73671 8.88132 2.87754 10.0012 2 10.8787L5.30597 12.2955C6.18208 12.671 5.64651 13.7766 5.50147 14.5018C5.33985 15.3099 5.34886 15.3397 5.93158 15.9224L8.07758 18.0684C8.6603 18.6511 8.69008 18.6602 9.49816 18.4985C10.2234 18.3535 11.329 17.8179 11.7044 18.694L13.1213 22C13.9988 21.1225 15.1187 20.2633 15.6023 19.0957C16.2624 17.5022 15.9016 15.3619 15.9016 13.659" stroke="currentColor" stroke-linejoin="round" stroke-width="1.5"/><path d="M12 20L11 21" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/><path d="M4 12L3 13" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/><path d="M15 4.07996C16.2 4.25996 17.46 4.73996 18.1614 5.45996C19.0576 6.25211 19.68 7.31996 19.92 8.99996" stroke="currentColor" stroke-linecap="square" stroke-width="1.5"/><path d="M17.94 6.06006L16.5 7.50006" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"/></svg>Deployments</button>
  </div>
  <div class="ayy-tabs__panel" role="tabpanel" data-value="code">
    <p class="ayy-muted">Browse repository source files and commits.</p>
  </div>
  <div class="ayy-tabs__panel" role="tabpanel" data-value="pull-requests" hidden>
    <p class="ayy-muted">Review open proposals and merge requests.</p>
  </div>
  <div class="ayy-tabs__panel" role="tabpanel" data-value="deployments" hidden>
    <p class="ayy-muted">View production releases and deploy status.</p>
  </div>
</ayy-tabs>
```

React:

```tsx
import { Icon, Tabs, TabsContent, TabsList, TabsTrigger } from "@danitesler/ayywi/react";
import { CodeIcon, GitPullRequestIcon, RocketIcon } from "@hugeicons/core-free-icons";

export default function Example() {
  return (
    <Tabs defaultValue="code">
      <TabsList aria-label="Project">
        <TabsTrigger value="code" icon={<Icon icon={CodeIcon} name="code" />}>
          Code
        </TabsTrigger>
        <TabsTrigger value="pull-requests" icon={<Icon icon={GitPullRequestIcon} name="git-pull-request" />}>
          Pull requests
        </TabsTrigger>
        <TabsTrigger value="deployments" icon={<Icon icon={RocketIcon} name="rocket" />}>
          Deployments
        </TabsTrigger>
      </TabsList>
      <TabsContent value="code">
        <p className="ayy-muted">Browse repository source files and commits.</p>
      </TabsContent>
      <TabsContent value="pull-requests">
        <p className="ayy-muted">Review open proposals and merge requests.</p>
      </TabsContent>
      <TabsContent value="deployments">
        <p className="ayy-muted">View production releases and deploy status.</p>
      </TabsContent>
    </Tabs>
  );
}
```

## Tabs — Filters with counts

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<!-- Filters over one list: a count after each label. -->
<ayy-tabs class="ayy-tabs" value="all">
  <div class="ayy-tabs__list" role="tablist" aria-label="Filter projects">
    <button type="button" class="ayy-tabs__tab" role="tab" data-value="all" aria-selected="true">All <span class="ayy-tabs__count">18</span></button>
    <button type="button" class="ayy-tabs__tab" role="tab" data-value="templates" aria-selected="false" tabindex="-1">Design templates <span class="ayy-tabs__count">6</span></button>
    <button type="button" class="ayy-tabs__tab" role="tab" data-value="extensions" aria-selected="false" tabindex="-1">Extensions <span class="ayy-tabs__count">12</span></button>
  </div>
  <div class="ayy-tabs__panel" role="tabpanel" data-value="all">
    <p class="ayy-muted">Every Figma resource and plugin.</p>
  </div>
  <div class="ayy-tabs__panel" role="tabpanel" data-value="templates" hidden>
    <p class="ayy-muted">UI kits, icon packs and website sections.</p>
  </div>
  <div class="ayy-tabs__panel" role="tabpanel" data-value="extensions" hidden>
    <p class="ayy-muted">Open-source add-ons for Playnite.</p>
  </div>
</ayy-tabs>
```

React:

```tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@danitesler/ayywi/react";

export default function Example() {
  return (
    <Tabs defaultValue="all">
      <TabsList aria-label="Filter projects">
        <TabsTrigger value="all">
          All <span className="ayy-tabs__count">18</span>
        </TabsTrigger>
        <TabsTrigger value="templates">
          Design templates <span className="ayy-tabs__count">6</span>
        </TabsTrigger>
        <TabsTrigger value="extensions">
          Extensions <span className="ayy-tabs__count">12</span>
        </TabsTrigger>
      </TabsList>
      <TabsContent value="all">
        <p className="ayy-muted">Every Figma resource and plugin.</p>
      </TabsContent>
      <TabsContent value="templates">
        <p className="ayy-muted">UI kits, icon packs and website sections.</p>
      </TabsContent>
      <TabsContent value="extensions">
        <p className="ayy-muted">Open-source add-ons for Playnite.</p>
      </TabsContent>
    </Tabs>
  );
}
```

---
Part of @danitesler/ayywi 0.1.2: load `dist/ayywi.min.css` (and `dist/elements.global.js` for the <ayy-*> elements). The rules every screen follows: [llms-full.txt#rules](../llms-full.txt#rules). Every component: [llms.txt](../llms.txt).
