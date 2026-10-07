# Carousel

Category: Layout. A strip of slides that scrolls sideways and snaps, with previous/next buttons that disable at the ends. Native scrolling: swipe, trackpad and arrow keys work without JS.

**Classes**
- `.ayy-carousel` — Root (also on <ayy-carousel>). role="region" aria-roledescription="carousel" and an aria-label. data-slide-label="{index} de {count}" translates the slides' names (default "{index} of {count}").
- `.ayy-carousel__track` — The scrolling, snapping row. Give it tabindex="0" so keyboards can scroll it. Gap via --ayy-gap.
- `.ayy-carousel__slide` — Each slide: role="group" aria-roledescription="slide". Width via --ayy-slide (default min(22rem, 85%)).
- `.ayy-carousel__controls` — Row of the previous/next buttons (outline icon buttons with data-ayy-prev / data-ayy-next). Their arrows are directional Hugeicons (ayy-icon--directional), so they flip in RTL.

**States**
- `default` — A track of slides that scrolls and snaps; previous and next Buttons centred below.
- `hover` (`the controls' Button :hover`) — As Button.
- `pressed` (`the controls' Button :active`) — As Button.
- `focus` (`.ayy-carousel__track:focus-visible; the controls' Buttons`) — The track gets a 2px ring, 2px offset (arrow keys then scroll it); buttons as Button.
- `disabled` (`[aria-disabled="true"] on previous/next at either end (set by <ayy-carousel> or React)`) — The Button's disabled look; it stays focusable and does nothing.
- `selected` — doesn't apply: No current-slide look; the slides' position is the state.
- `error` — doesn't apply: No error state.
- `loading` — doesn't apply: Show Skeleton slides while the content loads.

**Sizes**
- Density — The track doesn't follow data-density; the control Buttons do.
- Width — Fills its container; each slide is --ayy-slide wide (default min(22rem, 85%)) and as tall as the tallest.

**JS (framework-free)**: carouselClass, carouselTrackClass, carouselSlideClass, carouselControlsClass constants; connectCarousel(root) → cleanup — wires the buttons, aria-disabled at the ends and slide labels.

**Custom element** `<ayy-carousel>` (@danitesler/ayywi/elements) — A .ayy-carousel__track of .ayy-carousel__slide elements, and buttons with data-ayy-prev / data-ayy-next anywhere inside. They scroll one slide at a time (smoothly unless the user prefers reduced motion) and get aria-disabled="true" at the ends. Slides without a label are named "2 of 6".
- attribute `class`: Put ayy-carousel on it for block layout.

**React** — `import { Carousel, CarouselSlide } from "@danitesler/ayywi/react";`
- `<Carousel>` renders <div class="ayy-carousel" role="region"> with the track and the two buttons. Props: `label` string (required) — accessible name, e.g. "Team photos".; `slideWidth` CSS length for every slide. Default min(22rem, 85%).; `previousLabel / nextLabel` Button names. Default "Previous" / "Next" Defaults "Previous" / "Next" (translate them).; `slideLabel` Each slide's name, with {index} and {count}. Default "{index} of {count}" (translate it). HTML: data-slide-label on the carousel.
- `<CarouselSlide>` renders <div role="group" aria-roledescription="slide">.

**Accessibility**
- The root is a named region with aria-roledescription="carousel"; each slide is a group named "n of total" unless you name it.
- The track is focusable, so arrow keys scroll it; the buttons stay focusable at the ends (aria-disabled, not disabled) so focus isn't lost.
- Nothing moves on its own, and smooth scrolling turns off under prefers-reduced-motion.

**Do**
- Use a carousel for a row of photos, screenshots or cards that doesn't need to be seen all at once: a gallery, feature highlights, personas.
- Let the last slide peek in, so it's clear there's more.
- Give images inside slides width and height so the strip doesn't jump.

**Don't**
- Don't put content everyone must see in a carousel — lay it out in a grid.
- Don't hide essential content in later slides.
- Don't auto-advance or build rotating banners — ayywi doesn't auto-play, on purpose.
- Don't use it to switch between views of one thing — use Tabs.

## Carousel — Cards

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<!-- <ayy-carousel> (@danitesler/ayywi/elements) wires the buttons. Swipe, scroll or focus the strip and use the arrow keys. -->
<ayy-carousel class="ayy-carousel" role="region" aria-roledescription="carousel" aria-label="AI assistant features" style="inline-size: 100%; --ayy-slide: 15rem">
  <div class="ayy-carousel__track" tabindex="0">
    <div class="ayy-carousel__slide"><div class="ayy-card"><div class="ayy-card__header"><h3 class="ayy-card__title">Identity</h3><p class="ayy-card__description">One four-point star wherever a feature is powered by AI.</p></div></div></div>
    <div class="ayy-carousel__slide"><div class="ayy-card"><div class="ayy-card__header"><h3 class="ayy-card__title">Assist</h3><p class="ayy-card__description">Rephrase, change tone or shorten, one task at a time.</p></div></div></div>
    <div class="ayy-carousel__slide"><div class="ayy-card"><div class="ayy-card__header"><h3 class="ayy-card__title">Processing</h3><p class="ayy-card__description">A calm loading state while a response is written.</p></div></div></div>
    <div class="ayy-carousel__slide"><div class="ayy-card"><div class="ayy-card__header"><h3 class="ayy-card__title">Feedback</h3><p class="ayy-card__description">Thumbs up or down on every answer, right where it appears.</p></div></div></div>
    <div class="ayy-carousel__slide"><div class="ayy-card"><div class="ayy-card__header"><h3 class="ayy-card__title">Errors</h3><p class="ayy-card__description">Plain words and a retry when something fails.</p></div></div></div>
  </div>
  <div class="ayy-carousel__controls">
    <button type="button" class="ayy-button ayy-button--outline ayy-button--icon" data-ayy-prev aria-label="Previous">
      <svg class="ayy-icon ayy-icon--directional" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5.5 12.002H19" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/><path d="M10.9999 18.002C10.9999 18.002 4.99998 13.583 4.99997 12.0019C4.99996 10.4208 11 6.00195 11 6.00195" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/></svg>
    </button>
    <button type="button" class="ayy-button ayy-button--outline ayy-button--icon" data-ayy-next aria-label="Next">
      <svg class="ayy-icon ayy-icon--directional" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M18.5 12L4.99997 12" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/><path d="M13 18C13 18 19 13.5811 19 12C19 10.4188 13 6 13 6" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/></svg>
    </button>
  </div>
</ayy-carousel>
```

React:

```tsx
import { Card, CardDescription, CardHeader, CardTitle, Carousel, CarouselSlide } from "@danitesler/ayywi/react";

const features = [
  { title: "Identity", text: "One four-point star wherever a feature is powered by AI." },
  { title: "Assist", text: "Rephrase, change tone or shorten, one task at a time." },
  { title: "Processing", text: "A calm loading state while a response is written." },
  { title: "Feedback", text: "Thumbs up or down on every answer, right where it appears." },
  { title: "Errors", text: "Plain words and a retry when something fails." },
];

export default function Example() {
  return (
    <Carousel label="AI assistant features" slideWidth="15rem" style={{ inlineSize: "100%" }}>
      {features.map((f) => (
        <CarouselSlide key={f.title}>
          <Card>
            <CardHeader>
              <CardTitle>{f.title}</CardTitle>
              <CardDescription>{f.text}</CardDescription>
            </CardHeader>
          </Card>
        </CarouselSlide>
      ))}
    </Carousel>
  );
}
```

---
Part of @danitesler/ayywi 0.0.1: load `dist/ayywi.min.css` (and `dist/elements.global.js` for the <ayy-*> elements). The rules every screen follows: [llms-full.txt#rules](../llms-full.txt#rules). Every component: [llms.txt](../llms.txt).
