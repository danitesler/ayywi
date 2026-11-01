# Find bar

Category: Forms. Find and replace text in a document, sheet or log, with a match count and controls to step through matches. Also called: find-bar, findbar, find-replace, find-and-replace, search-replace.

**Classes**
- `.ayy-find-bar` — Search controls in a surface.
- `.ayy-find-bar--floating` — Positions the bar at the inline end of its containing block.
- `.ayy-find-bar__row` — Wrapping row of controls.
- `.ayy-find-bar__input` — Flexible query or replacement input.
- `.ayy-find-bar__count` — Match count or no-results message.

**States**
- `default` — A surface with input, count and navigation controls.
- `hover` (`Hover on a button or input`) — The control uses its own hover style.
- `pressed` (`Press a button`) — The button uses its own pressed style.
- `focus` (`Focus a button or input`) — The control uses its own focus ring.
- `disabled` (`There are no matches`) — Navigation and replacement buttons are disabled.
- `selected` (`Match case has aria-pressed=true`) — The button has a primary tint and text.
- `error` (`A nonempty query has no matches`) — The query has aria-invalid and the count says No results.
- `loading` — doesn't apply: The app counts matches; show the old count until the new one arrives.

**Sizes**
- Density — Inputs and buttons follow the control density and size scope.
- Width — Fills the container; rows wrap when space is limited.

**React** — `import { FindBar } from "@danitesler/ayywi/react";`
- `<FindBar>` renders div.ayy-find-bar with query, count and controls. Props: `query` string — controlled query; `onQueryChange` (query: string) => void; `current` number — current match, one-based; `total` number — match count; `onNext / onPrevious` () => void — step through matches; `matchCase / onMatchCaseChange` boolean and callback — optional case control; `replace` boolean — show replacement controls; `replacement / onReplacementChange` string and callback — controlled replacement; `onReplace / onReplaceAll` () => void — replace matches; `onClose` () => void — show a close button; `floating` boolean — float at the inline end; `autoFocus` boolean — focus the query; `labels` Partial<FindBarLabels> — translated control names and count

**Accessibility**
- Inputs and icon buttons have accessible names; the count is a live region.
- Enter and Shift+Enter step matches; Escape closes. Enter during IME composition does nothing.

**Do**
- Use a find bar to find and replace text in a document, sheet or log.
- Pass the current match and count from the app, and translate labels.

**Don't**
- Don't use a find bar to filter a list of records — use a Search bar.

## Find bar — Find in a document

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<div class="ayy-card"><div class="ayy-find-bar" role="search" aria-label="Find and replace"><div class="ayy-find-bar__row"><input class="ayy-input ayy-find-bar__input" data-ayy-find="query" type="text" aria-label="Find" placeholder="Find" autoComplete="off" spellCheck="false" value="launch"/><span class="ayy-find-bar__count" aria-live="polite">1 of 3</span><button type="button" class="ayy-button ayy-button--ghost ayy-button--icon" data-ayy-find="match-case" aria-pressed="false" aria-label="Match case">Aa</button><button type="button" class="ayy-button ayy-button--ghost ayy-button--icon" data-ayy-find="previous" aria-label="Previous match" aria-keyshortcuts="Shift+Enter"><svg class="ayy-icon" data-ayy-icon="chevron-up" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M17.9998 15C17.9998 15 13.5809 9.00001 11.9998 9C10.4187 8.99999 5.99985 15 5.99985 15" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg></button><button type="button" class="ayy-button ayy-button--ghost ayy-button--icon" data-ayy-find="next" aria-label="Next match" aria-keyshortcuts="Enter"><svg class="ayy-icon" data-ayy-icon="chevron-down" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M18 9.00005C18 9.00005 13.5811 15 12 15C10.4188 15 6 9 6 9" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg></button><button type="button" class="ayy-button ayy-button--ghost ayy-button--icon" data-ayy-find="close" aria-label="Close" aria-keyshortcuts="Escape"><svg class="ayy-icon" data-ayy-icon="x" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M18 6L6.00081 17.9992M17.9992 18L6 6.00085" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg></button></div><div class="ayy-find-bar__row"><input class="ayy-input ayy-find-bar__input" data-ayy-find="replacement" type="text" aria-label="Replace with" placeholder="Replace with" autoComplete="off" spellCheck="false" value=""/><button type="button" class="ayy-button ayy-button--secondary" data-ayy-find="replace">Replace</button><button type="button" class="ayy-button ayy-button--secondary" data-ayy-find="replace-all">Replace all</button></div></div><div class="ayy-card__content"><p>Launch day is Thursday. Before the launch, freeze the release branch. After the launch, watch the error dashboard for an hour.</p></div></div>
```

React:

```tsx
import { useState } from "react";
import { Button, Card, CardContent, FindBar } from "@danitesler/ayywi/react";

const initial = "Launch day is Thursday. Before the launch, freeze the release branch. After the launch, watch the error dashboard for an hour.";

export default function Example() {
  const [text, setText] = useState(initial);
  const [query, setQuery] = useState("launch");
  const [replacement, setReplacement] = useState("");
  const [matchCase, setMatchCase] = useState(false);
  const [current, setCurrent] = useState(1);
  const [open, setOpen] = useState(true);
  const haystack = matchCase ? text : text.toLowerCase();
  const needle = matchCase ? query : query.toLowerCase();
  const matches: number[] = [];
  if (needle) for (let pos = haystack.indexOf(needle); pos !== -1; pos = haystack.indexOf(needle, pos + needle.length)) matches.push(pos);
  const selected = Math.min(current, matches.length);
  const step = (delta: number) => setCurrent((selected - 1 + delta + matches.length) % matches.length + 1);
  const replaceOne = () => {
    const index = matches[selected - 1];
    if (index === undefined) return;
    setText(text.slice(0, index) + replacement + text.slice(index + query.length));
  };
  const replaceAll = () => {
    let result = ""; let from = 0;
    for (const index of matches) { result += text.slice(from, index) + replacement; from = index + query.length; }
    setText(result + text.slice(from));
    setCurrent(1);
  };
  return <Card>
    {open ? <FindBar query={query} onQueryChange={(value) => { setQuery(value); setCurrent(1); }} matchCase={matchCase} onMatchCaseChange={(value) => { setMatchCase(value); setCurrent(1); }} current={selected} total={matches.length} onNext={() => step(1)} onPrevious={() => step(-1)} onClose={() => setOpen(false)} replace replacement={replacement} onReplacementChange={setReplacement} onReplace={replaceOne} onReplaceAll={replaceAll} /> : <Button onClick={() => setOpen(true)}>Find</Button>}
    <CardContent><p>{text}</p></CardContent>
  </Card>;
}
```

---
Part of @danitesler/ayywi 0.1.2: load `dist/ayywi.min.css` (and `dist/elements.global.js` for the <ayy-*> elements). The rules every screen follows: [llms-full.txt#rules](../llms-full.txt#rules). Every component: [llms.txt](../llms.txt).
