# Tabs

Category: Layout. Segmented pill tabs switching between panels of related content. Full WAI-ARIA tabs keyboard support.

**Classes**
- `.ayy-tabs` — Wrapper (block). Also put it on <ayy-tabs>.
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
- Density — The track is the md control height (32px compact, 40 comfortable, 44 touch); tab text control md.
- Width — The list hugs its tabs and scrolls sideways when they don't fit; panels fill the container.

**JS (framework-free)**: tabsClass/tabsListClass/tabsTabClass/tabsPanelClass constants; nextTabIndex(key, current, count, rtl) for custom keyboard handling.

**Custom element** `<ayy-tabs>` (ayywi/elements) — A [role=tablist] of [role=tab] buttons and [role=tabpanel] panels, paired by data-value (or by order). Ids, aria-controls/labelledby, tabindex and hidden are managed for you.
- attribute `value`: The selected tab's data-value (or index). Two-way.
- attribute `class`: Put ayy-tabs on it for block layout.
- event `ayy-value-change`: { value: string } — the user picked a tab

**React** — `import { Tabs, TabsList, TabsTrigger, TabsContent } from "ayywi/react";`
- `<Tabs>` renders <div>. Props: `value / defaultValue` Selected tab value (controlled / uncontrolled).; `onValueChange` (value: string) => void
- `<TabsList>` renders <div role="tablist">. Props: `aria-label` Recommended.
- `<TabsTrigger>` renders <button role="tab">. Props: `value` string (required)
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
<!-- <ayy-tabs> (ayywi/elements) wires ids, clicks and arrow keys. The initial aria-selected / hidden avoid a flash before it loads.
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "ayywi/react";

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "ayywi/react";

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
Part of ayywi 0.4.0: load `dist/ayywi.min.css` (and `dist/elements.global.js` for the <ayy-*> elements). The rules every screen follows: [llms-full.txt#rules](../llms-full.txt#rules). Every component: [llms.txt](../llms.txt).
