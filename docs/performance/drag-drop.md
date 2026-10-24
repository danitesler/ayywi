# Drag performance — 2026-10-23

The framework-free drag controller is shared by React, custom elements, and table row/column reordering. The preview uses React 19 and Vite 8; no runtime dependency was added.

A local synthetic Chromium 141.0.7390.37 benchmark used a 1,000-row table, a 1440 × 900 viewport, no CPU throttling, and three runs per version. Each run dispatched four pointer events before each of 60 animation frames, away from scroll edges. Counters instrumented the real row `getBoundingClientRect` calls and table `querySelectorAll` calls after pickup; instrumentation was identical before and after.

| Lab measurement | Before, each of 3 runs | After, each of 3 runs |
| --- | --- | --- |
| Row geometry reads during dragging | 239,760 | 999 |
| Table item queries during dragging | 240 | 1 |
| 95th percentile frame interval | 18.3–18.4 ms | 18.0–18.8 ms |

The geometry/query reduction is 99.6%. Desktop frame intervals overlap, so this run establishes reduced main-thread work, not a measured FPS improvement. No field data or Safari/touch-device performance was measured.

Kept: frame-batched pointer updates and per-drag geometry caching, refreshed on scrolling, resizing, item size changes, and child/text mutations. The scheduler stops when the pointer is still and auto-scrolling cannot advance. Preview positioning uses transform directly rather than inherited CSS custom properties. Table chips stay beside the pointer; a tinted destination row supplements the insertion line.

The stable regression budget is fewer than two full table measurements across 160 pointer events on 1,000 rows; it intentionally avoids wall-clock assertions. Run the production-build suite with:

```sh
E2E_PORT=4491 pnpm exec playwright test tests/e2e/drag-drop.spec.ts --workers=1
```

These tests also cover final-position release before the next frame, scrolling with a stationary pointer, idle work, auto-scrolling, cancellation, and row resizing within a fixed-height table. Existing interaction tests cover React/HTML table row and column reordering and board keyboard moves.

The batching follows [requestAnimationFrame's repaint scheduling](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame); reading cached geometry before writing preview styles avoids the [read/write layout cycle described by web.dev](https://web.dev/articles/avoid-large-complex-layouts-and-layout-thrashing).
