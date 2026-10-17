# Showcase

Category: Layout. An interactive container for previewing UI across viewports (desktop, tablet, mobile), with a toolbar for device switching, custom controls, and code snippets. Also called: showcase, responsive-preview, device-preview, viewport-preview.

**Classes**
- `.ayy-showcase` — Root container: flex column, line border, card radius, background.
- `.ayy-showcase__header` — Top bar containing the title and action controls.
- `.ayy-showcase__title` — Title or label for the previewed component or screen.
- `.ayy-showcase__actions` — Cluster of action controls (device switcher, props, copy button).
- `.ayy-showcase__stage` — The canvas holding the previewed element, with an ambient pattern.
- `.ayy-showcase__viewport` — The responsive viewport container that smoothly transitions width.
- `.ayy-showcase__viewport--desktop` — Full width desktop viewport.
- `.ayy-showcase__viewport--tablet` — Tablet width viewport (max 834px).
- `.ayy-showcase__viewport--mobile` — Mobile width viewport (max 390px).
- `.ayy-showcase__body` — Content wrapper inside the viewport.

**States**
- `default` — A surface container with a line border, card radius, and a subtle pattern on the preview stage.
- `hover` — doesn't apply: Container; interactive elements inside handle hover.
- `pressed` — doesn't apply: Container; interactive controls handle active states.
- `focus` — doesn't apply: Not directly focusable; child controls receive focus.
- `disabled` — doesn't apply: Showcase is not disabled.
- `selected` — doesn't apply: Container; device items show selection.
- `error` — doesn't apply: No error state.
- `loading` — doesn't apply: No loading state.

**Sizes**
- Density — Toolbar controls follow data-density.
- Width — Fills its container width; the viewport transitions max-inline-size to match the active device.

**React** — `import { Showcase, ShowcaseHeader, ShowcaseTitle, ShowcaseActions, ShowcaseStage, ShowcaseViewport, ShowcaseBody } from "@danitesler/ayywi/react";`
- `<Showcase>` renders <section class="ayy-showcase">. Props: `device` "desktop" | "tablet" | "mobile" — default "desktop"
- `<ShowcaseHeader>` renders <div class="ayy-showcase__header">. Props: 
- `<ShowcaseTitle>` renders <h3 class="ayy-showcase__title">. Props: 
- `<ShowcaseActions>` renders <div class="ayy-showcase__actions">. Props: 
- `<ShowcaseStage>` renders <div class="ayy-showcase__stage">. Props: 
- `<ShowcaseViewport>` renders <div class="ayy-showcase__viewport">. Props: `device` "desktop" | "tablet" | "mobile" — default "desktop"
- `<ShowcaseBody>` renders <div class="ayy-showcase__body">. Props: 

**Accessibility**
- Give the Showcase an aria-labelledby pointing to its ShowcaseTitle.
- Device switchers must have accessible labels describing the active viewport.

**Do**
- Use Showcase to demonstrate component variations and responsive layouts in docs and style guides.
- Use the device switcher when previewing components with distinct phone or tablet layouts.

**Don't**
- Don't hardcode fixed heights that balloon small inline components.
- Don't show device controls for components with no responsive variation.

## Showcase — Responsive preview with device switcher

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<section class="ayy-showcase" data-device="desktop" aria-labelledby="showcase-basic-title">
  <div class="ayy-showcase__header">
    <h3 class="ayy-showcase__title" id="showcase-basic-title">Card layout</h3>
    <div class="ayy-showcase__actions">
      <div role="radiogroup" class="ayy-segmented-control ayy-segmented-control--sm" aria-label="Device view">
        <label class="ayy-segmented-control__option" title="Desktop"><input type="radio" name="showcase-device-basic" value="desktop" checked="" /><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M14 21H16M14 21C13.1716 21 12.5 20.3284 12.5 19.5V17L12 17M14 21H10M10 21H8M10 21C10.8284 21 11.5 20.3284 11.5 19.5V17L12 17M12 17V21" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M16 3H8C5.17157 3 3.75736 3 2.87868 3.87868C2 4.75736 2 6.17157 2 9V11C2 13.8284 2 15.2426 2.87868 16.1213C3.75736 17 5.17157 17 8 17H16C18.8284 17 20.2426 17 21.1213 16.1213C22 15.2426 22 13.8284 22 11V9C22 6.17157 22 4.75736 21.1213 3.87868C20.2426 3 18.8284 3 16 3Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg></label>
        <label class="ayy-segmented-control__option" title="Tablet"><input type="radio" name="showcase-device-basic" value="tablet" /><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M14.5 2H9.5C6.67157 2 5.25736 2 4.37868 2.87868C3.5 3.75736 3.5 5.17157 3.5 8V16C3.5 18.8284 3.5 20.2426 4.37868 21.1213C5.25736 22 6.67157 22 9.5 22H14.5C17.3284 22 18.7426 22 19.6213 21.1213C20.5 20.2426 20.5 18.8284 20.5 16V8C20.5 5.17157 20.5 3.75736 19.6213 2.87868C18.7426 2 17.3284 2 14.5 2Z" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path><path d="M12.125 19H12M12.25 19C12.25 19.1381 12.1381 19.25 12 19.25C11.8619 19.25 11.75 19.1381 11.75 19C11.75 18.8619 11.8619 18.75 12 18.75C12.1381 18.75 12.25 18.8619 12.25 19Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg></label>
        <label class="ayy-segmented-control__option" title="Mobile"><input type="radio" name="showcase-device-basic" value="mobile" /><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M13.5 2H10.5C8.14298 2 6.96447 2 6.23223 2.73223C5.5 3.46447 5.5 4.64298 5.5 7V17C5.5 19.357 5.5 20.5355 6.23223 21.2678C6.96447 22 8.14298 22 10.5 22H13.5C15.857 22 17.0355 22 17.7678 21.2678C18.5 20.5355 18.5 19.357 18.5 17V7C18.5 4.64298 18.5 3.46447 17.7678 2.73223C17.0355 2 15.857 2 13.5 2Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M12.125 19H12M12.25 19C12.25 19.1381 12.1381 19.25 12 19.25C11.8619 19.25 11.75 19.1381 11.75 19C11.75 18.8619 11.8619 18.75 12 18.75C12.1381 18.75 12.25 18.8619 12.25 19Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg></label>
      </div>
      <span class="ayy-tooltip">
        <button type="button" class="ayy-button ayy-button--outline ayy-button--icon-sm" aria-label="Props" aria-haspopup="dialog">
          <svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M3.99963 5.00055L9.99963 5.00031" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path><path d="M12.9996 5.00031L19.9996 5.00031" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path><path d="M15.9996 9.00031L15.9996 15.0003" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path><path d="M9.99963 2.00031L9.99963 8.00031" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path><path d="M11.9996 16.0003L11.9996 22.0003" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path><path d="M15.9996 12.0001L19.9996 12.0003" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path><path d="M3.99963 12.0005L12.9996 12.0003" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path><path d="M11.9996 19.0003L19.9996 19.0003" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path><path d="M3.99963 19.0005L8.99963 19.0003" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path></svg>
        </button>
        <span role="tooltip" class="ayy-tooltip__content">Props</span>
      </span>
    </div>
  </div>
  <div class="ayy-showcase__stage">
    <div class="ayy-showcase__viewport" data-device="desktop">
      <div class="ayy-showcase__body">
        <div class="ayy-card" style="inline-size: 100%">
          <div class="ayy-card__header">
            <div class="ayy-spread">
              <h4 class="ayy-card__title">Analytics Overview</h4>
              <span class="ayy-badge ayy-badge--outline">Live</span>
            </div>
            <p class="ayy-card__description">Real-time activity and subscriber growth metrics across all active channels.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
```

React:

```tsx
import { useState, type CSSProperties } from "react";
import {
  ComputerIcon,
  SlidersHorizontalIcon,
  SmartPhone01Icon,
  Tablet01Icon,
} from "@hugeicons/core-free-icons";
import {
  Badge,
  Button,
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Icon,
  Label,
  Popover,
  PopoverContent,
  PopoverTrigger,
  SegmentedControl,
  SegmentedControlItem,
  Showcase,
  ShowcaseActions,
  ShowcaseBody,
  ShowcaseHeader,
  ShowcaseStage,
  ShowcaseTitle,
  ShowcaseViewport,
  Switch,
  Tooltip,
  type ShowcaseDevice,
} from "@danitesler/ayywi/react";

export default function Example() {
  const [device, setDevice] = useState<ShowcaseDevice>("desktop");
  const [showBadge, setShowBadge] = useState(true);
  const [showDescription, setShowDescription] = useState(true);
  const [showFooter, setShowFooter] = useState(false);

  return (
    <Showcase device={device} aria-labelledby="showcase-basic-title">
      <ShowcaseHeader>
        <ShowcaseTitle id="showcase-basic-title">Card layout</ShowcaseTitle>
        <ShowcaseActions>
          <SegmentedControl
            size="sm"
            aria-label="Device view"
            value={device}
            onValueChange={(v) => setDevice(v as ShowcaseDevice)}
          >
            <SegmentedControlItem value="desktop" title="Desktop">
              <Icon icon={ComputerIcon} />
            </SegmentedControlItem>
            <SegmentedControlItem value="tablet" title="Tablet">
              <Icon icon={Tablet01Icon} />
            </SegmentedControlItem>
            <SegmentedControlItem value="mobile" title="Mobile">
              <Icon icon={SmartPhone01Icon} />
            </SegmentedControlItem>
          </SegmentedControl>
          <Popover>
            <Tooltip content="Props">
              <PopoverTrigger variant="outline" size="icon-sm" aria-label="Props">
                <Icon icon={SlidersHorizontalIcon} />
              </PopoverTrigger>
            </Tooltip>
            <PopoverContent
              side="bottom"
              align="end"
              aria-label="Card properties"
              style={{ inlineSize: "14rem" }}
            >
              <div
                className="ayy-stack"
                style={{ "--ayy-gap": "var(--ayy-space-3)" } as CSSProperties}
              >
                <div className="ayy-spread">
                  <Label htmlFor="sc-badge" style={{ fontSize: "var(--ayy-text-sm)", cursor: "pointer" }}>
                    Live badge
                  </Label>
                  <Switch id="sc-badge" checked={showBadge} onCheckedChange={setShowBadge} />
                </div>
                <div className="ayy-spread">
                  <Label htmlFor="sc-desc" style={{ fontSize: "var(--ayy-text-sm)", cursor: "pointer" }}>
                    Description
                  </Label>
                  <Switch id="sc-desc" checked={showDescription} onCheckedChange={setShowDescription} />
                </div>
                <div className="ayy-spread">
                  <Label htmlFor="sc-footer" style={{ fontSize: "var(--ayy-text-sm)", cursor: "pointer" }}>
                    Footer
                  </Label>
                  <Switch id="sc-footer" checked={showFooter} onCheckedChange={setShowFooter} />
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </ShowcaseActions>
      </ShowcaseHeader>
      <ShowcaseStage>
        <ShowcaseViewport device={device}>
          <ShowcaseBody>
            <Card style={{ inlineSize: "100%" }}>
              <CardHeader>
                <div className="ayy-spread">
                  <CardTitle>Analytics Overview</CardTitle>
                  {showBadge ? <Badge variant="outline">Live</Badge> : null}
                </div>
                {showDescription ? (
                  <CardDescription>
                    Real-time activity and subscriber growth metrics across all active channels.
                  </CardDescription>
                ) : null}
              </CardHeader>
              {showFooter ? (
                <CardFooter>
                  <Button size="sm">View details</Button>
                </CardFooter>
              ) : null}
            </Card>
          </ShowcaseBody>
        </ShowcaseViewport>
      </ShowcaseStage>
    </Showcase>
  );
}
```

---
Part of @danitesler/ayywi 0.0.3: load `dist/ayywi.min.css` (and `dist/elements.global.js` for the <ayy-*> elements). The rules every screen follows: [llms-full.txt#rules](../llms-full.txt#rules). Every component: [llms.txt](../llms.txt).
