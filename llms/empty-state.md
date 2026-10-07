# Empty state

Category: Feedback. What a list, table or page shows when there's nothing in it yet, or nothing matches: an optional icon tile, a title, one sentence on why, and the action that fills it. Also called: empty-state, empty, blank-slate, no-results.

**Classes**
- `.ayy-empty-state` — Root. Centred column with generous block padding.
- `.ayy-empty-state--bordered` — A dashed outline around the empty area (a board column, a drop target).
- `.ayy-empty-state--compact` — Less padding: inside a card, a table body or a side panel.
- `.ayy-empty-state__title` — What's empty, as a heading ("No projects yet").
- `.ayy-empty-state__description` — One sentence: why it's empty, or what will appear here.
- `.ayy-empty-state__actions` — The button that fixes it (primary), maybe a secondary link.

**States**
- `default` — Centred: an optional Icon tile, an lg heading-font title, a muted sm sentence (at most 42ch) and the action that fills it.
- `hover` — doesn't apply: Static; its action Buttons have their own states.
- `pressed` — doesn't apply: Not interactive.
- `focus` — doesn't apply: Not focusable; its actions are.
- `disabled` — doesn't apply: Not interactive.
- `selected` — doesn't apply: Not interactive.
- `error` — doesn't apply: A failed load isn't empty: show an Alert with a retry instead.
- `loading` — doesn't apply: While loading show Skeletons, never an empty state.

**Sizes**
- Density — Doesn't follow data-density.
- Width — Fills its container. compact has less padding (in a card, table cell or sidebar); bordered adds a dashed card outline for an area that will hold content.

**JS (framework-free)**: emptyStateClass({ bordered?, compact?, className? }) → string; emptyStateTitleClass, emptyStateDescriptionClass, emptyStateActionsClass constants.

**React** — `import { EmptyState, EmptyStateTitle, EmptyStateDescription, EmptyStateActions } from "@danitesler/ayywi/react";`
- `<EmptyState>` renders <div class="ayy-empty-state">. Props: `bordered` boolean — dashed outline.; `compact` boolean — less padding.
- `<EmptyStateTitle>` renders <h2 class="ayy-empty-state__title">.
- `<EmptyStateDescription>` renders <p class="ayy-empty-state__description">.
- `<EmptyStateActions>` renders <div class="ayy-empty-state__actions">.

**Accessibility**
- The title is a real heading at the level that fits the page (h2 under the page's h1, h3 inside a card).
- The icon tile is decorative: the title carries the meaning.
- When results change because of a search or filter, put the empty state inside a role="status" region (or announce the count) so screen reader users hear that nothing matched.

**Do**
- Use an empty state wherever a list, table or page can have nothing in it: first run, a finished inbox, a search with no results.
- Say what will be here and give the one action that fills it (Create project, Import contacts, Clear filters).
- Use the compact version inside a Card or a Table's body; the full one when it's the whole page.
- Match the icon to the thing that's missing, in an IconTile.

**Don't**
- Don't use an empty state while data is loading — use Skeleton rows (or a Spinner for a small area).
- Don't use it for errors — use an Alert with a retry action.
- Don't leave a table with only headers and nothing under them.
- Don't blame the user ("You haven't…"); say what's next.

## Empty state — First run

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<div class="ayy-empty-state ayy-empty-state--bordered" style="inline-size: min(100%, 34rem)">
  <span class="ayy-icon-tile" aria-hidden="true"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M8 7H16.75C18.8567 7 19.91 7 20.6667 7.50559C20.9943 7.72447 21.2755 8.00572 21.4944 8.33329C22 9.08996 22 10.1433 22 12.25C22 15.7612 22 17.5167 21.1573 18.7779C20.7926 19.3238 20.3238 19.7926 19.7779 20.1573C18.5167 21 16.7612 21 13.25 21H12C7.28595 21 4.92893 21 3.46447 19.5355C2 18.0711 2 15.714 2 11V7.94427C2 6.1278 2 5.21956 2.38032 4.53806C2.65142 4.05227 3.05227 3.65142 3.53806 3.38032C4.21956 3 5.1278 3 6.94427 3C8.10802 3 8.6899 3 9.19926 3.19101C10.3622 3.62712 10.8418 4.68358 11.3666 5.73313L12 7" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path></svg></span>
  <h2 class="ayy-empty-state__title">No projects yet</h2>
  <p class="ayy-empty-state__description">Projects hold your pages, forms and the people working on them. Start one from scratch or from a template.</p>
  <div class="ayy-empty-state__actions">
    <button type="button" class="ayy-button"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12.001 5.00003V19.002" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M19.002 12.002L4.99998 12.002" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg>New project</button>
    <button type="button" class="ayy-button ayy-button--ghost">Browse templates</button>
  </div>
</div>
```

React:

```tsx
import { Add01Icon, Folder01Icon } from "@hugeicons/core-free-icons";
import { Button, EmptyState, EmptyStateActions, EmptyStateDescription, EmptyStateTitle, Icon, IconTile } from "@danitesler/ayywi/react";

export default function Example() {
  return (
    <EmptyState bordered style={{ inlineSize: "min(100%, 34rem)" }}>
      <IconTile>
        <Icon icon={Folder01Icon} />
      </IconTile>
      <EmptyStateTitle>No projects yet</EmptyStateTitle>
      <EmptyStateDescription>Projects hold your pages, forms and the people working on them. Start one from scratch or from a template.</EmptyStateDescription>
      <EmptyStateActions>
        <Button>
          <Icon icon={Add01Icon} />
          New project
        </Button>
        <Button variant="ghost">Browse templates</Button>
      </EmptyStateActions>
    </EmptyState>
  );
}
```

## Empty state — No results, compact

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<div class="ayy-card" style="inline-size: min(100%, 26rem)">
  <div class="ayy-empty-state ayy-empty-state--compact" role="status">
    <span class="ayy-icon-tile ayy-icon-tile--sm" aria-hidden="true"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M17 17L21 21" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19C15.4183 19 19 15.4183 19 11Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg></span>
    <h2 class="ayy-empty-state__title">No invoices match “Acme 2025”</h2>
    <p class="ayy-empty-state__description">Try a client name or an invoice number, or clear the filters.</p>
    <div class="ayy-empty-state__actions"><button type="button" class="ayy-button ayy-button--outline ayy-button--sm">Clear filters</button></div>
  </div>
</div>
```

React:

```tsx
import { Search01Icon } from "@hugeicons/core-free-icons";
import { Button, Card, EmptyState, EmptyStateActions, EmptyStateDescription, EmptyStateTitle, Icon, IconTile } from "@danitesler/ayywi/react";

export default function Example() {
  return (
    <Card style={{ inlineSize: "min(100%, 26rem)" }}>
      <EmptyState compact role="status">
        <IconTile size="sm">
          <Icon icon={Search01Icon} />
        </IconTile>
        <EmptyStateTitle>No invoices match “Acme 2025”</EmptyStateTitle>
        <EmptyStateDescription>Try a client name or an invoice number, or clear the filters.</EmptyStateDescription>
        <EmptyStateActions>
          <Button size="sm" variant="outline">
            Clear filters
          </Button>
        </EmptyStateActions>
      </EmptyState>
    </Card>
  );
}
```

---
Part of @danitesler/ayywi 0.0.1: load `dist/ayywi.min.css` (and `dist/elements.global.js` for the <ayy-*> elements). The rules every screen follows: [llms-full.txt#rules](../llms-full.txt#rules). Every component: [llms.txt](../llms.txt).
