# Progress

Category: Feedback. Thin progress bar. Determinate (--ayy-value 0–100) or indeterminate. Also called: progress, progress-bar, progressbar, meter.

**Classes**
- `.ayy-progress` — Track. Set --ayy-value (0–100) on it.
- `.ayy-progress__bar` — Fill (only child).
- `.ayy-progress--sm` — 4px tall.
- `.ayy-progress--lg` — 10px tall.
- `.ayy-progress--success` — Green fill.
- `.ayy-progress--warning` — Amber fill.
- `.ayy-progress--destructive` — Red fill.
- `.ayy-progress--ai` — Purple fill.
- `.ayy-progress--indeterminate` — Looping animation; omit aria-valuenow.

**States**
- `default` — A 6px pill track in a 10% text tint, filled in the text colour from the inline start to --ayy-value %.
- `hover` — doesn't apply: Not interactive.
- `pressed` — doesn't apply: Not interactive.
- `focus` — doesn't apply: Not focusable.
- `disabled` — doesn't apply: Not interactive; at 0 it's an empty track.
- `selected` — doesn't apply: The value is the state (--ayy-value, aria-valuenow).
- `error` (`destructive (ayy-progress--destructive)`) — Red fill: a failed upload or an over-limit quota. Say why in text next to it.
- `loading` (`.ayy-progress--indeterminate without aria-valuenow`) — A 40% bar slides along the track, unknown duration (RTL reverses it).

**Sizes**
- `sm` — 4px track.
- `md` (default) — 6px track.
- `lg` — 10px track.
- Density — Doesn't follow data-density.
- Width — Fills its container.

**React** — `import { Progress } from "@danitesler/ayywi/react";`
- `<Progress>` renders <div role="progressbar">. Props: `value` number 0–100; omit/null → indeterminate; `variant` "default" | "success" | "warning" | "destructive" | "ai" — the same prop name as Alert and Badge; `tone` Deprecated alias of variant.; `size` "sm" | "md" | "lg"

**Accessibility**
- role="progressbar" with aria-valuenow/min/max (React sets them).
- Give it an accessible name: aria-label or aria-labelledby.

**Do**
- Use a progress bar when you know how far along something is: an upload, an import, a quota, a goal.
- Use indeterminate for work of unknown length that takes more than ~1s.
- Show the percentage or step as text nearby for anything longer than a few seconds.
- For quotas or meters that aren't progress, the look still works — set role="meter" instead of progressbar.

**Don't**
- Don't use a progress bar for a short wait of unknown length on a small area — use a Spinner (or <Button loading>).
- Don't use it for content that's loading — use Skeleton shapes.
- Don't use it for the steps of a flow — use Steps.
- Don't animate a determinate bar backwards.

## Progress — Values, tones, indeterminate

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<div class="ayy-stack" style="inline-size: min(100%, 22.5rem)">
  <div class="ayy-progress" role="progressbar" aria-label="Build progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="30" style="--ayy-value: 30">
    <div class="ayy-progress__bar"></div>
  </div>
  <div class="ayy-progress ayy-progress--success" role="progressbar" aria-label="Upload progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="72" style="--ayy-value: 72">
    <div class="ayy-progress__bar"></div>
  </div>
  <div class="ayy-progress ayy-progress--warning ayy-progress--lg" role="progressbar" aria-label="Storage used" aria-valuemin="0" aria-valuemax="100" aria-valuenow="90" style="--ayy-value: 90">
    <div class="ayy-progress__bar"></div>
  </div>
  <div class="ayy-progress ayy-progress--ai ayy-progress--sm ayy-progress--indeterminate" role="progressbar" aria-label="Generating">
    <div class="ayy-progress__bar"></div>
  </div>
</div>
```

React:

```tsx
import { Progress } from "@danitesler/ayywi/react";

export default function Example() {
  return (
    <div className="ayy-stack" style={{ inlineSize: "min(100%, 22.5rem)" }}>
      <Progress value={30} aria-label="Build progress" />
      <Progress value={72} variant="success" aria-label="Upload progress" />
      <Progress value={90} variant="warning" size="lg" aria-label="Storage used" />
      <Progress variant="ai" size="sm" aria-label="Generating" />
    </div>
  );
}
```

## Progress — Task progress with status

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<div class="ayy-card" style="inline-size: min(100%, 26rem)">
  <div class="ayy-card__header">
    <div class="ayy-spread">
      <h3 class="ayy-card__title">Exporting data</h3>
      <span class="ayy-badge ayy-badge--muted">Running</span>
    </div>
  </div>
  <div class="ayy-card__content">
    <div class="ayy-stack" style="--ayy-gap: var(--ayy-space-4)">
      <div class="ayy-stack" style="--ayy-gap: var(--ayy-space-1-5)">
        <div class="ayy-spread">
          <span id="task-export-label-html">Customer records</span>
          <span class="ayy-muted ayy-mono">68%</span>
        </div>
        <div role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="68" class="ayy-progress" style="--ayy-value: 68" aria-labelledby="task-export-label-html">
          <div class="ayy-progress__bar"></div>
        </div>
        <div class="ayy-spread ayy-muted" style="font-size: var(--ayy-text-xs)">
          <span>Step 3 of 4 · 6,800 of 10,000 rows</span>
          <span>~25s left</span>
        </div>
      </div>

      <div class="ayy-stack" style="--ayy-gap: var(--ayy-space-1-5)">
        <div class="ayy-spread">
          <span id="task-backup-label-html">Database backup</span>
          <span class="ayy-muted ayy-mono">100%</span>
        </div>
        <div role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="100" class="ayy-progress ayy-progress--success" style="--ayy-value: 100" aria-labelledby="task-backup-label-html">
          <div class="ayy-progress__bar"></div>
        </div>
        <p class="ayy-muted" style="font-size: var(--ayy-text-xs)">Complete · Saved to cold storage</p>
      </div>

      <div class="ayy-stack" style="--ayy-gap: var(--ayy-space-1-5)">
        <div class="ayy-spread">
          <span id="task-ai-label-html">AI summary</span>
          <span class="ayy-muted">In progress</span>
        </div>
        <div role="progressbar" aria-valuemin="0" aria-valuemax="100" class="ayy-progress ayy-progress--ai ayy-progress--sm ayy-progress--indeterminate" aria-labelledby="task-ai-label-html">
          <div class="ayy-progress__bar"></div>
        </div>
        <p class="ayy-muted" style="font-size: var(--ayy-text-xs)">Extracting key takeaways…</p>
      </div>
    </div>
  </div>
</div>
```

React:

```tsx
import { Badge, Card, CardContent, CardHeader, CardTitle, Progress } from "@danitesler/ayywi/react";

export default function Example() {
  return (
    <Card style={{ inlineSize: "min(100%, 26rem)" }}>
      <CardHeader>
        <div className="ayy-spread">
          <CardTitle>Exporting data</CardTitle>
          <Badge variant="muted">Running</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="ayy-stack" style={{ "--ayy-gap": "var(--ayy-space-4)" } as any}>
          <div className="ayy-stack" style={{ "--ayy-gap": "var(--ayy-space-1-5)" } as any}>
            <div className="ayy-spread">
              <span id="task-export-label">Customer records</span>
              <span className="ayy-muted ayy-mono">68%</span>
            </div>
            <Progress value={68} aria-labelledby="task-export-label" />
            <div className="ayy-spread ayy-muted" style={{ fontSize: "var(--ayy-text-xs)" }}>
              <span>Step 3 of 4 · 6,800 of 10,000 rows</span>
              <span>~25s left</span>
            </div>
          </div>

          <div className="ayy-stack" style={{ "--ayy-gap": "var(--ayy-space-1-5)" } as any}>
            <div className="ayy-spread">
              <span id="task-backup-label">Database backup</span>
              <span className="ayy-muted ayy-mono">100%</span>
            </div>
            <Progress value={100} variant="success" aria-labelledby="task-backup-label" />
            <p className="ayy-muted" style={{ fontSize: "var(--ayy-text-xs)" }}>
              Complete · Saved to cold storage
            </p>
          </div>

          <div className="ayy-stack" style={{ "--ayy-gap": "var(--ayy-space-1-5)" } as any}>
            <div className="ayy-spread">
              <span id="task-ai-label">AI summary</span>
              <span className="ayy-muted">In progress</span>
            </div>
            <Progress variant="ai" size="sm" aria-labelledby="task-ai-label" />
            <p className="ayy-muted" style={{ fontSize: "var(--ayy-text-xs)" }}>
              Extracting key takeaways…
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
```

## Progress — Usage quotas and limits

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<div class="ayy-card" style="inline-size: min(100%, 26rem)">
  <div class="ayy-card__header">
    <h3 class="ayy-card__title">Plan usage</h3>
    <p class="ayy-card__description">Resets in 12 days on November 1.</p>
  </div>
  <div class="ayy-card__content">
    <div class="ayy-stack" style="--ayy-gap: var(--ayy-space-4)">
      <div class="ayy-stack" style="--ayy-gap: var(--ayy-space-1-5)">
        <div class="ayy-spread">
          <span id="meter-storage-html">Cloud storage</span>
          <span class="ayy-muted ayy-mono">18.4 / 20 GB</span>
        </div>
        <div role="meter" aria-valuemin="0" aria-valuemax="20" aria-valuenow="18.4" class="ayy-progress ayy-progress--warning" style="--ayy-value: 92" aria-labelledby="meter-storage-html">
          <div class="ayy-progress__bar"></div>
        </div>
        <p class="ayy-muted" style="font-size: var(--ayy-text-xs)">92% used · Upgrade recommended</p>
      </div>

      <div class="ayy-stack" style="--ayy-gap: var(--ayy-space-1-5)">
        <div class="ayy-spread">
          <span id="meter-api-html">Monthly API calls</span>
          <span class="ayy-muted ayy-mono">99,200 / 100k</span>
        </div>
        <div role="meter" aria-valuemin="0" aria-valuemax="100000" aria-valuenow="99200" class="ayy-progress ayy-progress--destructive" style="--ayy-value: 99" aria-labelledby="meter-api-html">
          <div class="ayy-progress__bar"></div>
        </div>
        <p class="ayy-muted" style="font-size: var(--ayy-text-xs)">99% used · Requests will throttle soon</p>
      </div>

      <div class="ayy-stack" style="--ayy-gap: var(--ayy-space-1-5)">
        <div class="ayy-spread">
          <span id="meter-seats-html">Team seats</span>
          <span class="ayy-muted ayy-mono">12 / 50</span>
        </div>
        <div role="meter" aria-valuemin="0" aria-valuemax="50" aria-valuenow="12" class="ayy-progress" style="--ayy-value: 24" aria-labelledby="meter-seats-html">
          <div class="ayy-progress__bar"></div>
        </div>
        <p class="ayy-muted" style="font-size: var(--ayy-text-xs)">38 seats available</p>
      </div>
    </div>
  </div>
</div>
```

React:

```tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Progress } from "@danitesler/ayywi/react";

export default function Example() {
  return (
    <Card style={{ inlineSize: "min(100%, 26rem)" }}>
      <CardHeader>
        <CardTitle>Plan usage</CardTitle>
        <CardDescription>Resets in 12 days on November 1.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="ayy-stack" style={{ "--ayy-gap": "var(--ayy-space-4)" } as any}>
          <div className="ayy-stack" style={{ "--ayy-gap": "var(--ayy-space-1-5)" } as any}>
            <div className="ayy-spread">
              <span id="meter-storage">Cloud storage</span>
              <span className="ayy-muted ayy-mono">18.4 / 20 GB</span>
            </div>
            <Progress
              role="meter"
              value={92}
              variant="warning"
              aria-labelledby="meter-storage"
              aria-valuemin={0}
              aria-valuemax={20}
              aria-valuenow={18.4}
            />
            <p className="ayy-muted" style={{ fontSize: "var(--ayy-text-xs)" }}>
              92% used · Upgrade recommended
            </p>
          </div>

          <div className="ayy-stack" style={{ "--ayy-gap": "var(--ayy-space-1-5)" } as any}>
            <div className="ayy-spread">
              <span id="meter-api">Monthly API calls</span>
              <span className="ayy-muted ayy-mono">99,200 / 100k</span>
            </div>
            <Progress
              role="meter"
              value={99}
              variant="destructive"
              aria-labelledby="meter-api"
              aria-valuemin={0}
              aria-valuemax={100000}
              aria-valuenow={99200}
            />
            <p className="ayy-muted" style={{ fontSize: "var(--ayy-text-xs)" }}>
              99% used · Requests will throttle soon
            </p>
          </div>

          <div className="ayy-stack" style={{ "--ayy-gap": "var(--ayy-space-1-5)" } as any}>
            <div className="ayy-spread">
              <span id="meter-seats">Team seats</span>
              <span className="ayy-muted ayy-mono">12 / 50</span>
            </div>
            <Progress
              role="meter"
              value={24}
              aria-labelledby="meter-seats"
              aria-valuemin={0}
              aria-valuemax={50}
              aria-valuenow={12}
            />
            <p className="ayy-muted" style={{ fontSize: "var(--ayy-text-xs)" }}>
              38 seats available
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
```

## Progress — Interactive simulation

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<div class="ayy-card" style="inline-size: min(100%, 26rem)">
  <div class="ayy-card__header">
    <div class="ayy-spread">
      <h3 class="ayy-card__title">File upload</h3>
      <span class="ayy-mono ayy-muted" id="interactive-progress-pct">45%</span>
    </div>
    <p class="ayy-card__description" id="interactive-progress-desc">Uploading client-presentation-v2.pdf…</p>
  </div>
  <div class="ayy-card__content">
    <div id="interactive-progress-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="45" class="ayy-progress" style="--ayy-value: 45" aria-label="File upload progress">
      <div class="ayy-progress__bar"></div>
    </div>
  </div>
  <div class="ayy-card__footer">
    <button
      type="button"
      class="ayy-button ayy-button--outline ayy-button--sm"
      onclick="(() => {
        const bar = document.getElementById('interactive-progress-bar');
        const pct = document.getElementById('interactive-progress-pct');
        const desc = document.getElementById('interactive-progress-desc');
        const val = Math.max(0, (parseInt(bar.getAttribute('aria-valuenow'), 10) || 0) - 25);
        bar.setAttribute('aria-valuenow', val);
        bar.style.setProperty('--ayy-value', val);
        pct.textContent = val + '%';
        bar.className = 'ayy-progress' + (val === 100 ? ' ayy-progress--success' : val > 80 ? ' ayy-progress--warning' : '');
        desc.textContent = val === 100 ? 'Upload complete. File is ready to share.' : 'Uploading client-presentation-v2.pdf…';
      })()"
    >
      -25%
    </button>
    <button
      type="button"
      class="ayy-button ayy-button--sm"
      onclick="(() => {
        const bar = document.getElementById('interactive-progress-bar');
        const pct = document.getElementById('interactive-progress-pct');
        const desc = document.getElementById('interactive-progress-desc');
        const val = Math.min(100, (parseInt(bar.getAttribute('aria-valuenow'), 10) || 0) + 25);
        bar.setAttribute('aria-valuenow', val);
        bar.style.setProperty('--ayy-value', val);
        pct.textContent = val + '%';
        bar.className = 'ayy-progress' + (val === 100 ? ' ayy-progress--success' : val > 80 ? ' ayy-progress--warning' : '');
        desc.textContent = val === 100 ? 'Upload complete. File is ready to share.' : 'Uploading client-presentation-v2.pdf…';
      })()"
    >
      +25%
    </button>
    <button
      type="button"
      class="ayy-button ayy-button--ghost ayy-button--sm"
      onclick="(() => {
        const bar = document.getElementById('interactive-progress-bar');
        const pct = document.getElementById('interactive-progress-pct');
        const desc = document.getElementById('interactive-progress-desc');
        bar.setAttribute('aria-valuenow', '0');
        bar.style.setProperty('--ayy-value', '0');
        pct.textContent = '0%';
        bar.className = 'ayy-progress';
        desc.textContent = 'Uploading client-presentation-v2.pdf…';
      })()"
    >
      Reset
    </button>
  </div>
</div>
```

React:

```tsx
import { useState } from "react";
import { Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Progress } from "@danitesler/ayywi/react";

export default function Example() {
  const [progress, setProgress] = useState(45);

  const step = (delta: number) => {
    setProgress((prev) => Math.min(100, Math.max(0, prev + delta)));
  };

  const isComplete = progress === 100;

  return (
    <Card style={{ inlineSize: "min(100%, 26rem)" }}>
      <CardHeader>
        <div className="ayy-spread">
          <CardTitle>File upload</CardTitle>
          <span className="ayy-mono ayy-muted">{progress}%</span>
        </div>
        <CardDescription>
          {isComplete ? "Upload complete. File is ready to share." : "Uploading client-presentation-v2.pdf…"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Progress
          value={progress}
          variant={isComplete ? "success" : progress > 80 ? "warning" : "default"}
          aria-label="File upload progress"
        />
      </CardContent>
      <CardFooter>
        <Button size="sm" variant="outline" onClick={() => step(-25)} disabled={progress <= 0}>
          -25%
        </Button>
        <Button size="sm" onClick={() => step(25)} disabled={progress >= 100}>
          +25%
        </Button>
        <Button size="sm" variant="ghost" onClick={() => setProgress(0)} disabled={progress === 0}>
          Reset
        </Button>
      </CardFooter>
    </Card>
  );
}
```

---
Part of @danitesler/ayywi 0.1.1: load `dist/ayywi.min.css` (and `dist/elements.global.js` for the <ayy-*> elements). The rules every screen follows: [llms-full.txt#rules](../llms-full.txt#rules). Every component: [llms.txt](../llms.txt).
