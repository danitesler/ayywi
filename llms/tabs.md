# Tabs

Category: Layout. Segmented pill tabs switching between panels of related content. Full WAI-ARIA tabs keyboard support. Also called: tabs, tab, tab-list, tablist.

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

**Custom element** `<ayy-tabs>` (@danitesler/ayywi/elements) — A [role=tablist] of [role=tab] buttons and [role=tabpanel] panels, paired by data-value (or by order). Ids, aria-controls/labelledby, tabindex and hidden are managed for you.
- attribute `value`: The selected tab's data-value (or index). Two-way.
- attribute `class`: Put ayy-tabs on it for block layout.
- event `ayy-value-change`: { value: string } — the user picked a tab

**React** — `import { Tabs, TabsList, TabsTrigger, TabsContent } from "@danitesler/ayywi/react";`
- `<Tabs>` renders <div>. Props: `value / defaultValue` Selected tab value (controlled / uncontrolled).; `onValueChange` (value: string) => void
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
    </Tabs>
  );
}
```

## Tabs — With icons

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<!-- Tabs with custom icons before each label. -->
<ayy-tabs class="ayy-tabs" value="account">
  <div class="ayy-tabs__list" role="tablist" aria-label="Settings">
    <button type="button" class="ayy-tabs__tab" role="tab" data-value="account" aria-selected="true"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20 21.0001C19.713 17.269 16.7289 14.3151 12.995 14.0662L12 13.9999C11.6446 14.0096 11.3134 14.0225 11.0008 14.0378C7.3 14.2192 4.28417 17.3057 4 21.0001" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/><circle cx="12" cy="6.99988" r="4" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/></svg>Account</button>
    <button type="button" class="ayy-tabs__tab" role="tab" data-value="notifications" aria-selected="false" tabindex="-1"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20 18.5011L18.349 7.93407C17.8603 4.80601 15.166 2.5 12 2.5C8.83398 2.5 6.13971 4.80601 5.65098 7.93407L4 18.5011" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/><path d="M20 18.5C20 16.8431 16.4183 15.5 12 15.5C7.58172 15.5 4 16.8431 4 18.5C4 20.1569 7.58172 21.5 12 21.5C16.4183 21.5 20 20.1569 20 18.5Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/><path d="M13 18.5H11" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/></svg>Notifications</button>
    <button type="button" class="ayy-tabs__tab" role="tab" data-value="security" aria-selected="false" tabindex="-1"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M18.7088 3.49546C16.8165 2.55394 14.5009 2.00012 12 2.00012C9.4991 2.00012 7.1835 2.55394 5.29116 3.49547C4.36318 3.95718 3.89919 4.18804 3.4496 4.91391C3 5.63978 3 6.3426 3 7.74826V11.2372C3 16.9206 7.54236 20.0805 10.173 21.4339C10.9067 21.8114 11.2735 22.0001 12 22.0001C12.7265 22.0001 13.0933 21.8114 13.8269 21.4339C16.4576 20.0805 21 16.9206 21 11.2372L21 7.74827C21 6.34261 21 5.63978 20.5504 4.91391C20.1008 4.18804 19.6368 3.95718 18.7088 3.49546Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/><path d="M12 9.00012V10.0001M11 9.50012C11 9.76534 11.1054 10.0197 11.2929 10.2072C11.4804 10.3948 11.7348 10.5001 12 10.5001C12.2652 10.5001 12.5196 10.3948 12.7071 10.2072C12.8946 10.0197 13 9.76534 13 9.50012C13 9.23491 12.8946 8.98055 12.7071 8.79302C12.5196 8.60548 12.2652 8.50012 12 8.50012C11.7348 8.50012 11.4804 8.60548 11.2929 8.79302C11.1054 8.98055 11 9.23491 11 9.50012Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/><path d="M12.75 14.0001H11.25L12 10.5001L12.75 14.0001Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/></svg>Security</button>
  </div>
  <div class="ayy-tabs__panel" role="tabpanel" data-value="account">
    <p class="ayy-muted">Manage your profile details and email address.</p>
  </div>
  <div class="ayy-tabs__panel" role="tabpanel" data-value="notifications" hidden>
    <p class="ayy-muted">Choose what updates you want to receive.</p>
  </div>
  <div class="ayy-tabs__panel" role="tabpanel" data-value="security" hidden>
    <p class="ayy-muted">Two-factor authentication and active sessions.</p>
  </div>
</ayy-tabs>
```

React:

```tsx
import { Icon, Tabs, TabsContent, TabsList, TabsTrigger } from "@danitesler/ayywi/react";
import { Notification03Icon, SecurityIcon, UserIcon } from "@hugeicons/core-free-icons";

export default function Example() {
  return (
    <Tabs defaultValue="account">
      <TabsList aria-label="Settings">
        <TabsTrigger value="account" icon={<Icon icon={UserIcon} />}>
          Account
        </TabsTrigger>
        <TabsTrigger value="notifications" icon={<Icon icon={Notification03Icon} />}>
          Notifications
        </TabsTrigger>
        <TabsTrigger value="security" icon={<Icon icon={SecurityIcon} />}>
          Security
        </TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <p className="ayy-muted">Manage your profile details and email address.</p>
      </TabsContent>
      <TabsContent value="notifications">
        <p className="ayy-muted">Choose what updates you want to receive.</p>
      </TabsContent>
      <TabsContent value="security">
        <p className="ayy-muted">Two-factor authentication and active sessions.</p>
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
Part of @danitesler/ayywi 0.0.1: load `dist/ayywi.min.css` (and `dist/elements.global.js` for the <ayy-*> elements). The rules every screen follows: [llms-full.txt#rules](../llms-full.txt#rules). Every component: [llms.txt](../llms.txt).
