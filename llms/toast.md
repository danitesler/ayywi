# Toast

Category: Feedback. A short message that appears briefly to confirm something happened. It shows above everything else on the page, including dialogs, and can carry images or previews as well as text. Also called: toast, snackbar, notification, card-toast, quick-access.

**Classes**
- `.ayy-toaster` — The shared region toast() creates (aria-live). Position via data-position; data-expanded on hover or focus.
- `.ayy-toaster__clear` — "Clear all" button in the open stack's top-end corner (bottom-end under a top-positioned stack); shown only while the stack is open with two or more toasts.
- `.ayy-toast` — One toast; stacked card with swipe-to-dismiss.
- `.ayy-toast--success` — Success variant with checkmark icon.
- `.ayy-toast--warning` — Warning variant with alert icon.
- `.ayy-toast--destructive` — Destructive variant with cancel icon; announced with role="alert".
- `.ayy-toast--info` — Info variant with information icon.
- `.ayy-toast--card` — Card toast variant with media preview and action scrim.
- `.ayy-toast--card-split` — Split card toast variant with media preview thumbnail and text content details.
- `.ayy-toast--card-split--vertical` — Vertical split card toast variant with media preview stacked above text details.
- `.ayy-toast--long` — Long text variant with normal text size and copy button.
- `.ayy-toast--inline` — Inline feedback pill embedded in a card, toolbar, or form without a toaster region.
- `.ayy-toast--inline--success` — Success tone for inline toast.
- `.ayy-toast--inline--busy` — Busy tone for inline toast with spinner.
- `.ayy-toast--inline--error` — Error tone for inline toast with alert icon.
- `.ayy-toast__icon` — Leading status icon.
- `.ayy-toast__content` — Message and description container.
- `.ayy-toast__title` — Message.
- `.ayy-toast__description` — Optional second line.
- `.ayy-toast__actions` — Action button row.
- `.ayy-toast__copy` — Copy button to copy message to clipboard.
- `.ayy-toast__close` — Close button.
- `.ayy-toast__backdrop` — Blurred backdrop image behind preview.
- `.ayy-toast__image` — Foreground preview image or video frame.
- `.ayy-toast__thumb` — Thumbnail container for split card toast preview image.
- `.ayy-toast__media` — Video or GIF duration badge.
- `.ayy-toast__scrim` — Action overlay visible on card hover or focus.
- `.ayy-toast__center` — Center primary and secondary action buttons.
- `.ayy-toast__corner` — Corner action button container.
- `.ayy-toast__corner--top` — Top corner action buttons.
- `.ayy-toast__corner--top-start` — Top start corner action buttons.
- `.ayy-toast__corner--bottom-start` — Bottom start corner action buttons.
- `.ayy-toast__corner--bottom-end` — Bottom end corner action buttons.
- `.ayy-toast__action` — Icon action button inside scrim.
- `.ayy-toast__status` — Inline feedback pill after an action.
- `.ayy-toast__status--success` — Success status tone with checkmark.
- `.ayy-toast__status--busy` — Busy status tone with spinner.
- `.ayy-toast__status--error` — Error status tone with alert icon.

**States**
- `default` — Raised card with line-strong border, overlay shadow, and stacked offset; success, warning, destructive, and info include their status icon.
- `hover` (`.ayy-toaster[data-expanded]; .ayy-toast--card:hover`) — Deck expands vertically so all toasts fan out into readable view and timers pause across the stack. Card toast reveals action scrim. Close button gets wash-hover.
- `pressed` (`.ayy-toast--card:active`) — Cursor changes to grabbing while dragging.
- `focus` (`.ayy-toast__close:focus-visible`) — 2px ring, 2px offset.
- `disabled` — doesn't apply: Not disabled.
- `selected` — doesn't apply: No selected state.
- `error` (`toast({ variant: "destructive" })`) — Destructive icon in destructive colour. Only for errors that need no fixing in place; form errors go inline (FieldError).
- `loading` — doesn't apply: A toast confirms; for a long task show Progress where the work happens.
- `leaving` (`[data-leaving] (set by toast())`) — Drifts out to the right (translateX 28px, scale 0.95, fade out) over 280ms.

**Sizes**
- Density — Doesn't follow data-density.
- Width — min(22rem, viewport minus 2rem) or min(28rem, viewport minus 2rem) for long text toasts, stacked in the corner given by position; card toasts are min(17.5rem, 100%).

**React** — `import { toast, Toaster, NotificationToast, Toast, InlineToast, CardToast, CardToastThumb, CardToastBackdrop, CardToastImage, CardToastMedia, CardToastScrim, CardToastClose, CardToastCorner, CardToastCenter, CardToastAction, CardToastStatus } from "@danitesler/ayywi/react";`
- `<Toaster>` renders nothing — configures the shared region. Props: `position` "bottom-end" | "bottom-start" | "bottom-center" | "top-end" | "top-start" | "top-center"; `label` string — region name (translate); `closeLabel` string — close button name (translate); `clearLabel` string — "Clear all" button text (translate)
- `<NotificationToast>` renders div.ayy-toast. Props: `variant` "default" | "success" | "warning" | "destructive" | "info" | "card" | "long"; `title` ReactNode — message text; `description` ReactNode — optional second line; `icon` ReactNode — leading icon; `action` { label: string, onClick?: () => void }; `copyable` boolean — show copy button (default true for long variant); `copyText` string — custom text to copy; `onClose` () => void — dismiss handler; `closeLabel` string — accessible dismiss name
- `<Toast>` renders div.ayy-toast — alias of NotificationToast. Props: 
- `<InlineToast>` renders div.ayy-toast--inline. Props: `tone` "default" | "success" | "busy" | "error"; `icon` ReactNode — leading icon
- `<CardToast>` renders div.ayy-toast.ayy-toast--card. Props: `split` boolean | "horizontal" | "vertical"; `ratio` number | string — the picture's shape, width ÷ height (1.6, or "1440 / 900"): the card follows it between 6.75rem and 14rem tall (sets --ayy-ratio). Default 16 / 10
- `<CardToastThumb>` renders div.ayy-toast__thumb. Props: 
- `<CardToastBackdrop>` renders img.ayy-toast__backdrop. Props: 
- `<CardToastImage>` renders img.ayy-toast__image. Props: 
- `<CardToastMedia>` renders span.ayy-toast__media. Props: 
- `<CardToastScrim>` renders div.ayy-toast__scrim. Props: 
- `<CardToastClose>` renders button.ayy-toast__close inside a Tooltip. Props: `label` string — accessible name and tooltip. Default "Dismiss"; `tooltip` boolean — false drops the tooltip (the label stays the accessible name). Default true; `side` "top" | "bottom" | "start" | "end" — tooltip side. Default "bottom"
- `<CardToastCorner>` renders div.ayy-toast__corner. Props: `position` "top" | "top-start" | "bottom-start" | "bottom-end"
- `<CardToastCenter>` renders div.ayy-toast__center. Props: 
- `<CardToastAction>` renders button.ayy-hover-action.ayy-toast__action inside a Tooltip (a Hover action). Props: `label` string — accessible name and tooltip; `hint` ReactNode — after the label in the tooltip, e.g. <Shortcut keys="Mod+C" />; `tooltip` boolean — false drops the tooltip (the label stays the accessible name). Default true; `side` "top" | "bottom" | "start" | "end" — tooltip side. Default "bottom"
- `<CardToastStatus>` renders div.ayy-toast--inline. Props: `tone` "default" | "success" | "busy" | "error"; `icon` ReactNode — status icon

**Accessibility**
- The region is aria-live="polite"; destructive toasts use role="alert".
- Timers pause while the toaster stack or a toast is hovered or focused, so there's time to read it and reach its action.
- Messages are set with textContent — never HTML.

**Do**
- Use NotificationToast (or toast()) to confirm something happened (Saved, Deployed) or report an async receipt needing no decision.
- Say what happened in 2–5 words: "Project deleted".
- Offer one Undo-style action instead of a confirmation dialog for reversible actions.
- Use CardToast (toast.card()) for content previews that are visual — screenshots, screen recordings, video frames, GIFs, and image downloads.
- Use the split CardToast variation when the user needs both an image preview thumbnail and file metadata (filename, dimensions, size) with direct actions.
- Use InlineToast for localized contextual feedback (e.g. "Copied to clipboard", loading spinner) embedded directly within a card, toolbar, or form without triggering the toaster region.

**Don't**
- Don't use a toast for errors the user must fix — show them inline next to the problem with FieldError.
- Don't use a toast for anything needing a decision — use Dialog.
- Don't put long or important content in a toast — it disappears.
- Don't stack several toasts for one action — reuse an id to update it.
- Don't put links the user must follow in a toast.
- Don't use CardToast for plain text notifications that do not have a visual preview or thumbnail.
- Don't use InlineToast as a floating viewport notification — use NotificationToast in the shared toaster region instead.
- Don't stack multiple InlineToasts inside one container — update the status tone and message in place.

## Toast — Trigger toast

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<!-- toast() is on window.ayywi when you load dist/elements.global.js; with a bundler: import { toast } from "@danitesler/ayywi". -->
<button
  type="button"
  class="ayy-button ayy-button--outline"
  onclick="(() => {
    const list = [
      () => ayywi.toast('Changes saved'),
      () => ayywi.toast.success('Deployed', { description: 'Marketing site is live.' }),
      () => ayywi.toast('Project archived', { action: { label: 'Undo', onClick: () => ayywi.toast.info('Project restored') } }),
      () => ayywi.toast.error('Build failed', { description: '3 type errors in api/server.ts' }),
      () => ayywi.toast.card({
        src: 'data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'560\' height=\'350\' viewBox=\'0 0 560 350\'><defs><linearGradient id=\'g\' x1=\'0\' y1=\'0\' x2=\'1\' y2=\'1\'><stop offset=\'0%\' stop-color=\'%236366f1\'/><stop offset=\'100%\' stop-color=\'%23ec4899\'/></linearGradient></defs><rect width=\'100%\' height=\'100%\' fill=\'url(%23g)\'/><rect x=\'40\' y=\'40\' width=\'480\' height=\'270\' rx=\'12\' fill=\'%23ffffff\' fill-opacity=\'0.15\'/></svg>',
        alt: 'Capture preview',
        centerActions: [
          { label: 'Copy', onClick: () => {} },
          { label: 'Save', variant: 'secondary', onClick: () => {} }
        ]
      }),
      () => ayywi.toast.card({
        split: true,
        src: 'data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'560\' height=\'350\' viewBox=\'0 0 560 350\'><defs><linearGradient id=\'g\' x1=\'0\' y1=\'0\' x2=\'1\' y2=\'1\'><stop offset=\'0%\' stop-color=\'%236366f1\'/><stop offset=\'100%\' stop-color=\'%23ec4899\'/></linearGradient></defs><rect width=\'100%\' height=\'100%\' fill=\'url(%23g)\'/><rect x=\'40\' y=\'40\' width=\'480\' height=\'270\' rx=\'12\' fill=\'%23ffffff\' fill-opacity=\'0.15\'/></svg>',
        alt: 'Screenshot preview',
        title: 'Screenshot_2026-10-16.png',
        description: '1920×1080 • 1.2 MB',
        actions: [
          { label: 'Copy', onClick: () => ayywi.toast.info('Copied to clipboard') },
          { label: 'Share', variant: 'secondary', onClick: () => ayywi.toast.info('Link copied') }
        ]
      }),
      () => ayywi.toast.long('npm i @danitesler/ayywi@latest --save-exact', { description: 'Package installed. Add import \'@danitesler/ayywi/css\' to your entry file.' })
    ];
    list[Math.floor(Math.random() * list.length)]();
  })()"
>
  Trigger random toast
</button>
```

React:

```tsx
import { useEffect, useState, type ReactNode } from "react";
import { configureToaster } from "@danitesler/ayywi";
import {
  Button,
  Label,
  SegmentedControl,
  SegmentedControlItem,
  Toaster,
  toast,
  type CardToastHandle,
  type ToasterProps,
} from "@danitesler/ayywi/react";

const SAMPLE_CAPTURE =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='560' height='350' viewBox='0 0 560 350'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0%' stop-color='%236366f1'/><stop offset='100%' stop-color='%23ec4899'/></linearGradient></defs><rect width='100%' height='100%' fill='url(%23g)'/><rect x='40' y='40' width='480' height='270' rx='12' fill='%23ffffff' fill-opacity='0.15'/></svg>";

const TOAST_TRIGGERS = [
  () => toast("Changes saved"),
  () => toast.success("Deployed", { description: "Marketing site is live." }),
  () =>
    toast("Project archived", {
      action: { label: "Undo", onClick: () => toast.info("Project restored") },
    }),
  () => toast.error("Build failed", { description: "3 type errors in api/server.ts" }),
  () => {
    let handle: CardToastHandle;
    handle = toast.card({
      src: SAMPLE_CAPTURE,
      alt: "Capture preview",
      centerActions: [
        { label: "Copy", onClick: () => handle.status({ tone: "success", text: "Copied" }, 1500) },
        { label: "Save", variant: "secondary", onClick: () => handle.status({ tone: "success", text: "Saved" }, 1500) },
      ],
    });
  },
  () =>
    toast.card({
      split: true,
      src: SAMPLE_CAPTURE,
      alt: "Screenshot preview",
      title: "Screenshot_2026-10-16.png",
      description: "1920×1080 • 1.2 MB",
      actions: [
        { label: "Copy", onClick: () => toast.info("Copied to clipboard") },
        { label: "Share", variant: "secondary", onClick: () => toast.info("Link copied") },
      ],
    }),
  () =>
    toast.long("npm i @danitesler/ayywi@latest --save-exact", {
      description: "Package installed. Add import '@danitesler/ayywi/css' to your entry file.",
    }),
];

type Position = NonNullable<ToasterProps["position"]>;

export default function Example({ setControls }: { setControls?: (node: ReactNode) => void } = {}) {
  const [position, setPosition] = useState<Position>("bottom-end");

  // The preview's Props popover: where the stack sits. Leaving the page puts it back in the bottom end corner.
  useEffect(() => {
    setControls?.(
      <div className="ayy-stack">
        <Label id="toast-position">Position</Label>
        <SegmentedControl size="sm" aria-labelledby="toast-position" value={position} onValueChange={(v) => setPosition(v as Position)}>
          <SegmentedControlItem value="bottom-start">Left</SegmentedControlItem>
          <SegmentedControlItem value="bottom-center">Center</SegmentedControlItem>
          <SegmentedControlItem value="bottom-end">Right</SegmentedControlItem>
        </SegmentedControl>
      </div>,
    );
  }, [setControls, position]);
  useEffect(() => () => {
    setControls?.(null);
    configureToaster({ position: "bottom-end" });
  }, [setControls]);

  const triggerRandom = () => {
    const fn = TOAST_TRIGGERS[Math.floor(Math.random() * TOAST_TRIGGERS.length)];
    fn();
  };

  return (
    <>
      <Toaster position={position} />
      <Button variant="outline" onClick={triggerRandom}>
        Trigger random toast
      </Button>
    </>
  );
}
```

## Toast — Toast types

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<div class="ayy-stack" style="inline-size: min(100%, 24rem); gap: var(--ayy-space-3);">
  <!-- 1. Default toast -->
  <div class="ayy-toast">
    <div class="ayy-toast__content">
      <p class="ayy-toast__title">Default toast</p>
    </div>
    <ayy-tooltip class="ayy-tooltip" side="bottom"><button type="button" class="ayy-toast__close" aria-label="Dismiss">
      <svg class="ayy-icon ayy-icon--sm" data-ayy-icon="x" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6L6.00081 17.9992M17.9992 18L6 6.00085"/></svg>
    </button><span class="ayy-tooltip__content" role="tooltip">Dismiss</span></ayy-tooltip>
  </div>

  <!-- 2. Status toast (success) -->
  <div class="ayy-toast ayy-toast--success">
    <span class="ayy-toast__icon" aria-hidden="true">
      <svg class="ayy-icon ayy-icon--sm" data-ayy-icon="circle-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12Z"/><path d="M8 12.5L10.5 15L16 9" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </span>
    <div class="ayy-toast__content">
      <p class="ayy-toast__title">Success toast</p>
      <p class="ayy-toast__description">Marketing site is live.</p>
    </div>
    <ayy-tooltip class="ayy-tooltip" side="bottom"><button type="button" class="ayy-toast__close" aria-label="Dismiss">
      <svg class="ayy-icon ayy-icon--sm" data-ayy-icon="x" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6L6.00081 17.9992M17.9992 18L6 6.00085"/></svg>
    </button><span class="ayy-tooltip__content" role="tooltip">Dismiss</span></ayy-tooltip>
  </div>

  <!-- 3. With action -->
  <div class="ayy-toast">
    <div class="ayy-toast__content">
      <p class="ayy-toast__title">Action toast</p>
    </div>
    <div class="ayy-toast__actions">
      <button type="button" class="ayy-button ayy-button--secondary ayy-button--sm">Undo</button>
    </div>
    <ayy-tooltip class="ayy-tooltip" side="bottom"><button type="button" class="ayy-toast__close" aria-label="Dismiss">
      <svg class="ayy-icon ayy-icon--sm" data-ayy-icon="x" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6L6.00081 17.9992M17.9992 18L6 6.00085"/></svg>
    </button><span class="ayy-tooltip__content" role="tooltip">Dismiss</span></ayy-tooltip>
  </div>

  <!-- 4. Error / Destructive -->
  <div class="ayy-toast ayy-toast--destructive" role="alert">
    <span class="ayy-toast__icon" aria-hidden="true">
      <svg class="ayy-icon ayy-icon--sm" data-ayy-icon="circle-x" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12Z"/><path d="M14.9994 15L9 9M9.00064 15L15 9" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </span>
    <div class="ayy-toast__content">
      <p class="ayy-toast__title">Error toast</p>
      <p class="ayy-toast__description">3 type errors in api/server.ts</p>
    </div>
    <ayy-tooltip class="ayy-tooltip" side="bottom"><button type="button" class="ayy-toast__close" aria-label="Dismiss">
      <svg class="ayy-icon ayy-icon--sm" data-ayy-icon="x" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6L6.00081 17.9992M17.9992 18L6 6.00085"/></svg>
    </button><span class="ayy-tooltip__content" role="tooltip">Dismiss</span></ayy-tooltip>
  </div>

  <!-- 5. Card toast -->
  <div class="ayy-toast ayy-toast--card" data-hover="" aria-label="Interactive card toast preview">
    <img class="ayy-toast__backdrop" src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='560' height='350' viewBox='0 0 560 350'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0%' stop-color='%236366f1'/><stop offset='100%' stop-color='%23ec4899'/></linearGradient></defs><rect width='100%' height='100%' fill='url(%23g)'/><rect x='40' y='40' width='480' height='270' rx='12' fill='%23ffffff' fill-opacity='0.15'/><circle cx='80' cy='75' r='8' fill='%23ffffff' fill-opacity='0.6'/><circle cx='105' cy='75' r='8' fill='%23ffffff' fill-opacity='0.4'/><circle cx='130' cy='75' r='8' fill='%23ffffff' fill-opacity='0.4'/><rect x='60' y='110' width='200' height='20' rx='6' fill='%23ffffff' fill-opacity='0.8'/><rect x='60' y='145' width='440' height='12' rx='4' fill='%23ffffff' fill-opacity='0.4'/><rect x='60' y='170' width='380' height='12' rx='4' fill='%23ffffff' fill-opacity='0.4'/><rect x='60' y='210' width='120' height='36' rx='8' fill='%23ffffff' fill-opacity='0.9'/></svg>" alt="" aria-hidden="true" draggable="false" />
    <img class="ayy-toast__image" src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='560' height='350' viewBox='0 0 560 350'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0%' stop-color='%236366f1'/><stop offset='100%' stop-color='%23ec4899'/></linearGradient></defs><rect width='100%' height='100%' fill='url(%23g)'/><rect x='40' y='40' width='480' height='270' rx='12' fill='%23ffffff' fill-opacity='0.15'/><circle cx='80' cy='75' r='8' fill='%23ffffff' fill-opacity='0.6'/><circle cx='105' cy='75' r='8' fill='%23ffffff' fill-opacity='0.4'/><circle cx='130' cy='75' r='8' fill='%23ffffff' fill-opacity='0.4'/><rect x='60' y='110' width='200' height='20' rx='6' fill='%23ffffff' fill-opacity='0.8'/><rect x='60' y='145' width='440' height='12' rx='4' fill='%23ffffff' fill-opacity='0.4'/><rect x='60' y='170' width='380' height='12' rx='4' fill='%23ffffff' fill-opacity='0.4'/><rect x='60' y='210' width='120' height='36' rx='8' fill='%23ffffff' fill-opacity='0.9'/></svg>" alt="Card preview" draggable="false" />
    <div class="ayy-toast__scrim">
      <ayy-tooltip class="ayy-tooltip" side="bottom"><button type="button" class="ayy-toast__close" aria-label="Dismiss preview">
        <svg class="ayy-icon ayy-icon--sm" data-ayy-icon="x" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6L6.00081 17.9992M17.9992 18L6 6.00085"/></svg>
      </button><span class="ayy-tooltip__content" role="tooltip">Dismiss preview</span></ayy-tooltip>
      <div class="ayy-toast__corner ayy-toast__corner--top-start">
        <ayy-tooltip class="ayy-tooltip" side="bottom"><button type="button" class="ayy-hover-action ayy-toast__action" aria-label="Annotate">
          <svg class="ayy-icon ayy-icon--sm" data-ayy-icon="pen-line" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14.0737 3.88545C14.8184 3.0708 15.1907 2.66347 15.6558 2.43329C16.2738 2.12743 16.9859 2.12215 17.6083 2.41872C18.0766 2.64188 18.4552 3.044 19.2124 3.84826C19.9818 4.6655 20.3665 5.07412 20.5843 5.54589C20.8737 6.17294 20.8601 6.88517 20.5471 7.50085C20.3115 7.96426 19.8967 8.36862 19.067 9.17733L9.64696 18.3582C8.52989 19.4468 7.97136 19.9911 7.27964 20.3344C6.58791 20.6776 5.81188 20.8002 4.25983 21.0453L3.00342 21.2438C2.59765 21.3079 2.2223 21.0189 2.17985 20.6105C2.17094 20.5248 2.17947 20.438 2.20494 20.3553L2.73031 18.6477C3.17056 17.2173 3.39069 16.5021 3.79155 15.8672C4.19241 15.2323 4.74797 14.7171 5.85908 13.6868L14.0737 3.88545Z"/></svg>
        </button><span class="ayy-tooltip__content" role="tooltip">Annotate</span></ayy-tooltip>
        <ayy-tooltip class="ayy-tooltip" side="bottom"><button type="button" class="ayy-hover-action ayy-toast__action" aria-label="Pin to screen">
          <svg class="ayy-icon ayy-icon--sm" data-ayy-icon="pin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22V17M12 17L19 13.5L16.5 11L18 4.5L14.5 6L12 3.5L9.5 6L6 4.5L7.5 11L5 13.5L12 17Z"/></svg>
        </button><span class="ayy-tooltip__content" role="tooltip">Pin to screen</span></ayy-tooltip>
      </div>
      <div class="ayy-toast__center">
        <button type="button" class="ayy-button ayy-button--sm">Copy</button>
        <button type="button" class="ayy-button ayy-button--secondary ayy-button--sm">Save</button>
      </div>
      <div class="ayy-toast__corner ayy-toast__corner--bottom-start">
        <ayy-tooltip class="ayy-tooltip" side="bottom"><button type="button" class="ayy-hover-action ayy-toast__action" aria-label="Share link">
          <svg class="ayy-icon ayy-icon--sm" data-ayy-icon="cloud-upload" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17.4776 9.01106C17.485 9.01102 17.4925 9.01101 17.5 9.01101C19.9853 9.01101 22 11.0294 22 13.5193C22 15.8398 20.25 17.7508 18 18M17.4776 9.01106C17.4924 8.84606 17.5 8.67896 17.5 8.51009C17.5 5.46695 15.0376 3 12 3C9.12324 3 6.76233 5.21267 6.52042 8.03192M17.4776 9.01106C17.3753 10.1476 16.9286 11.1846 16.2428 12.0165M6.52042 8.03192C3.98398 8.27373 2 10.4139 2 13.0183C2 15.4417 3.71776 17.4632 6 17.9273M6.52042 8.03192C6.67826 8.01687 6.83823 8.00917 7 8.00917C8.12582 8.00917 9.16474 8.38194 10.0005 9.01101"/><path d="M12 13L12 21M12 13C11.2998 13 9.99153 14.9943 9.5 15.5M12 13C12.7002 13 14.0085 14.9943 14.5 15.5"/></svg>
        </button><span class="ayy-tooltip__content" role="tooltip">Share link</span></ayy-tooltip>
      </div>
      <div class="ayy-toast__corner ayy-toast__corner--bottom-end">
        <ayy-tooltip class="ayy-tooltip" side="bottom"><button type="button" class="ayy-hover-action ayy-toast__action" aria-label="Show in folder">
          <svg class="ayy-icon ayy-icon--sm" data-ayy-icon="folder" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2 11V7C2 5.89543 2.89543 5 4 5H8.58579C8.851 5 9.10536 5.10536 9.29289 5.29289L10.7071 6.70711C10.8946 6.89464 11.149 7 11.4142 7H20C21.1046 7 22 7.89543 22 9V11M2 11H22M2 11V17C2 18.1046 2.89543 19 4 19H20C21.1046 19 22 18.1046 22 17V11"/></svg>
        </button><span class="ayy-tooltip__content" role="tooltip">Show in folder</span></ayy-tooltip>
        <ayy-tooltip class="ayy-tooltip" side="bottom"><button type="button" class="ayy-hover-action ayy-toast__action" aria-label="Delete">
          <svg class="ayy-icon ayy-icon--sm" data-ayy-icon="trash" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19.5 5.5L18.8803 15.5251C18.7219 18.0864 18.6428 19.3671 18.0008 20.2879C17.6833 20.7431 17.2747 21.1273 16.799 21.4177C15.8368 22.0053 14.553 22.0053 11.9854 22.0053C9.41785 22.0053 8.13406 22.0053 7.17188 21.4177C6.69614 21.1273 6.28754 20.7431 5.97008 20.2879C5.32808 19.3671 5.24891 18.0864 5.09057 15.5251L4.5 5.5M3 5.5H21M16.0557 5.5L15.3731 4.09173C14.9196 3.15626 14.6928 2.68852 14.3017 2.39681C14.215 2.3321 14.1233 2.276 14.027 2.22919C13.5933 2.01826 13.0745 2.01826 12.0368 2.01826C10.9765 2.01826 10.4463 2.01826 10.0076 2.23351C9.91037 2.28123 9.81792 2.33858 9.73105 2.40455C9.33923 2.70204 9.11327 3.17646 8.66135 4.12529L8.05199 5.5"/></svg>
        </button><span class="ayy-tooltip__content" role="tooltip">Delete</span></ayy-tooltip>
      </div>
    </div>
  </div>

  <!-- 6. Split card toast -->
  <div class="ayy-toast ayy-toast--card ayy-toast--card-split" aria-label="Screenshot preview">
    <div class="ayy-toast__thumb">
      <img class="ayy-toast__backdrop" src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='560' height='350' viewBox='0 0 560 350'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0%' stop-color='%236366f1'/><stop offset='100%' stop-color='%23ec4899'/></linearGradient></defs><rect width='100%' height='100%' fill='url(%23g)'/><rect x='40' y='40' width='480' height='270' rx='12' fill='%23ffffff' fill-opacity='0.15'/><circle cx='80' cy='75' r='8' fill='%23ffffff' fill-opacity='0.6'/><circle cx='105' cy='75' r='8' fill='%23ffffff' fill-opacity='0.4'/><circle cx='130' cy='75' r='8' fill='%23ffffff' fill-opacity='0.4'/><rect x='60' y='110' width='200' height='20' rx='6' fill='%23ffffff' fill-opacity='0.8'/><rect x='60' y='145' width='440' height='12' rx='4' fill='%23ffffff' fill-opacity='0.4'/><rect x='60' y='170' width='380' height='12' rx='4' fill='%23ffffff' fill-opacity='0.4'/><rect x='60' y='210' width='120' height='36' rx='8' fill='%23ffffff' fill-opacity='0.9'/></svg>" alt="" aria-hidden="true" draggable="false" />
      <img class="ayy-toast__image" src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='560' height='350' viewBox='0 0 560 350'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0%' stop-color='%236366f1'/><stop offset='100%' stop-color='%23ec4899'/></linearGradient></defs><rect width='100%' height='100%' fill='url(%23g)'/><rect x='40' y='40' width='480' height='270' rx='12' fill='%23ffffff' fill-opacity='0.15'/><circle cx='80' cy='75' r='8' fill='%23ffffff' fill-opacity='0.6'/><circle cx='105' cy='75' r='8' fill='%23ffffff' fill-opacity='0.4'/><circle cx='130' cy='75' r='8' fill='%23ffffff' fill-opacity='0.4'/><rect x='60' y='110' width='200' height='20' rx='6' fill='%23ffffff' fill-opacity='0.8'/><rect x='60' y='145' width='440' height='12' rx='4' fill='%23ffffff' fill-opacity='0.4'/><rect x='60' y='170' width='380' height='12' rx='4' fill='%23ffffff' fill-opacity='0.4'/><rect x='60' y='210' width='120' height='36' rx='8' fill='%23ffffff' fill-opacity='0.9'/></svg>" alt="Screenshot preview" draggable="false" />
    </div>
    <div class="ayy-toast__content">
      <p class="ayy-toast__title">Screenshot_2026-10-16.png</p>
      <p class="ayy-toast__description">1920×1080 • 1.2 MB</p>
      <div class="ayy-toast__actions">
        <button type="button" class="ayy-button ayy-button--sm">Copy</button>
        <button type="button" class="ayy-button ayy-button--secondary ayy-button--sm">Share</button>
      </div>
    </div>
    <ayy-tooltip class="ayy-tooltip" side="bottom"><button type="button" class="ayy-toast__close" aria-label="Dismiss preview">
      <svg class="ayy-icon ayy-icon--sm" data-ayy-icon="x" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6L6.00081 17.9992M17.9992 18L6 6.00085"/></svg>
    </button><span class="ayy-tooltip__content" role="tooltip">Dismiss preview</span></ayy-tooltip>
  </div>

  <!-- 7. Long text toast with copy button -->
  <div class="ayy-toast ayy-toast--long">
    <div class="ayy-toast__content">
      <p class="ayy-toast__title">Webhook verification secret</p>
      <p class="ayy-toast__description">whsec_9b2e8a1f4c7d0e3b5a6f8c2e4d6a8b0c2d4e6f8a0b2c4d6e8f0a2b4c6d8e0f2</p>
    </div>
    <ayy-tooltip class="ayy-tooltip"><button type="button" class="ayy-toast__copy" aria-label="Copy">
      <svg class="ayy-icon ayy-icon--sm" data-ayy-icon="copy" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7.5 14.5C7.5 11.2002 7.5 9.55025 8.52513 8.52513C9.55025 7.5 11.2002 7.5 14.5 7.5C17.7998 7.5 19.4497 7.5 20.4749 8.52513C21.5 9.55025 21.5 11.2002 21.5 14.5C21.5 17.7998 21.5 19.4497 20.4749 20.4749C19.4497 21.5 17.7998 21.5 14.5 21.5C11.2002 21.5 9.55025 21.5 8.52513 20.4749C7.5 19.4497 7.5 17.7998 7.5 14.5Z"/><path d="M7.5 16.5C6.10355 16.5 5.40533 16.5 4.84402 16.3036C3.83866 15.9518 3.0482 15.1613 2.69641 14.156C2.5 13.5947 2.5 12.8964 2.5 11.5V9.5C2.5 6.20017 2.5 4.55025 3.52513 3.52513C4.55025 2.5 6.20017 2.5 9.5 2.5H11.5C12.8964 2.5 13.5947 2.5 14.156 2.69641C15.1613 3.0482 15.9518 3.83866 16.3036 4.84402C16.5 5.40533 16.5 6.10355 16.5 7.5"/></svg>
    </button><span class="ayy-tooltip__content" role="tooltip">Copy</span></ayy-tooltip>
    <ayy-tooltip class="ayy-tooltip" side="bottom"><button type="button" class="ayy-toast__close" aria-label="Dismiss">
      <svg class="ayy-icon ayy-icon--sm" data-ayy-icon="x" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6L6.00081 17.9992M17.9992 18L6 6.00085"/></svg>
    </button><span class="ayy-tooltip__content" role="tooltip">Dismiss</span></ayy-tooltip>
  </div>
</div>
```

React:

```tsx
import { useState } from "react";
import {
  Button,
  CardToast,
  CardToastAction,
  CardToastBackdrop,
  CardToastCenter,
  CardToastClose,
  CardToastCorner,
  CardToastImage,
  CardToastScrim,
  CardToastThumb,
  Icon,
  NotificationToast,
} from "@danitesler/ayywi/react";
import {
  CancelCircleIcon,
  CheckmarkCircle02Icon,
  CloudUploadIcon,
  Delete02Icon,
  Edit02Icon,
  Folder01Icon,
  PinIcon,
} from "@hugeicons/core-free-icons";

const SAMPLE_CARD =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='560' height='350' viewBox='0 0 560 350'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0%' stop-color='%236366f1'/><stop offset='100%' stop-color='%23ec4899'/></linearGradient></defs><rect width='100%' height='100%' fill='url(%23g)'/><rect x='40' y='40' width='480' height='270' rx='12' fill='%23ffffff' fill-opacity='0.15'/><circle cx='80' cy='75' r='8' fill='%23ffffff' fill-opacity='0.6'/><circle cx='105' cy='75' r='8' fill='%23ffffff' fill-opacity='0.4'/><circle cx='130' cy='75' r='8' fill='%23ffffff' fill-opacity='0.4'/><rect x='60' y='110' width='200' height='20' rx='6' fill='%23ffffff' fill-opacity='0.8'/><rect x='60' y='145' width='440' height='12' rx='4' fill='%23ffffff' fill-opacity='0.4'/><rect x='60' y='170' width='380' height='12' rx='4' fill='%23ffffff' fill-opacity='0.4'/><rect x='60' y='210' width='120' height='36' rx='8' fill='%23ffffff' fill-opacity='0.9'/></svg>";

export default function Example() {
  const [, setDismissed] = useState(false);

  return (
    <div className="ayy-stack" style={{ inlineSize: "min(100%, 24rem)", gap: "var(--ayy-space-3)" }}>
      {/* 1. Default toast */}
      <NotificationToast
        title="Default toast"
        onClose={() => setDismissed(true)}
      />

      {/* 2. Status toast (success) */}
      <NotificationToast
        variant="success"
        icon={<Icon icon={CheckmarkCircle02Icon} name="circle-check" size="sm" />}
        title="Success toast"
        description="Marketing site is live."
        onClose={() => setDismissed(true)}
      />

      {/* 3. With action */}
      <NotificationToast
        title="Action toast"
        action={{ label: "Undo", onClick: () => {} }}
        onClose={() => setDismissed(true)}
      />

      {/* 4. Error / Destructive */}
      <NotificationToast
        variant="destructive"
        icon={<Icon icon={CancelCircleIcon} name="circle-x" size="sm" />}
        title="Error toast"
        description="3 type errors in api/server.ts"
        onClose={() => setDismissed(true)}
      />

      {/* 5. Card toast */}
      <CardToast data-hover aria-label="Interactive card toast preview">
        <CardToastBackdrop src={SAMPLE_CARD} />
        <CardToastImage src={SAMPLE_CARD} alt="Card preview" />
        <CardToastScrim>
          <CardToastClose label="Dismiss preview" />
          <CardToastCorner position="top-start">
            <CardToastAction label="Annotate">
              <Icon icon={Edit02Icon} name="pen-line" size="sm" />
            </CardToastAction>
            <CardToastAction label="Pin to screen">
              <Icon icon={PinIcon} name="pin" size="sm" />
            </CardToastAction>
          </CardToastCorner>
          <CardToastCenter>
            <Button size="sm">Copy</Button>
            <Button size="sm" variant="secondary">Save</Button>
          </CardToastCenter>
          <CardToastCorner position="bottom-start">
            <CardToastAction label="Share link">
              <Icon icon={CloudUploadIcon} name="cloud-upload" size="sm" />
            </CardToastAction>
          </CardToastCorner>
          <CardToastCorner position="bottom-end">
            <CardToastAction label="Show in folder">
              <Icon icon={Folder01Icon} name="folder" size="sm" />
            </CardToastAction>
            <CardToastAction label="Delete">
              <Icon icon={Delete02Icon} name="trash" size="sm" />
            </CardToastAction>
          </CardToastCorner>
        </CardToastScrim>
      </CardToast>

      {/* 6. Split card toast (preview + text) */}
      <CardToast split aria-label="Screenshot preview">
        <CardToastThumb>
          <CardToastBackdrop src={SAMPLE_CARD} />
          <CardToastImage src={SAMPLE_CARD} alt="Screenshot thumbnail" />
        </CardToastThumb>
        <div className="ayy-toast__content">
          <p className="ayy-toast__title">Screenshot_2026-10-16.png</p>
          <p className="ayy-toast__description">1920×1080 • 1.2 MB</p>
          <div className="ayy-toast__actions">
            <Button size="sm">Copy</Button>
            <Button size="sm" variant="secondary">Share</Button>
          </div>
        </div>
        <CardToastClose label="Dismiss preview" />
      </CardToast>

      {/* 7. Long text toast with copy button */}
      <NotificationToast
        variant="long"
        title="Webhook verification secret"
        description="whsec_9b2e8a1f4c7d0e3b5a6f8c2e4d6a8b0c2d4e6f8a0b2c4d6e8f0a2b4c6d8e0f2"
        onClose={() => setDismissed(true)}
      />
    </div>
  );
}
```

## Toast — Inline toast

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<div class="ayy-stack" style="inline-size: min(100%, 24rem); gap: var(--ayy-space-3);">
  <!-- Standalone with icon -->
  <div>
    <div class="ayy-toast--inline ayy-toast--inline--success" role="status">
      <span class="ayy-toast__icon" aria-hidden="true">
        <svg class="ayy-icon ayy-icon--sm" data-ayy-icon="circle-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12Z"/><path d="M8 12.5L10.5 15L16 9" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </span>
      <span>Inline toast (with icon)</span>
    </div>
  </div>

  <!-- Standalone without icon -->
  <div>
    <div class="ayy-toast--inline" role="status">
      <span>Inline toast (without icon)</span>
    </div>
  </div>

  <!-- Embedded within CardToast -->
  <div class="ayy-toast ayy-toast--card" data-hover="" aria-label="Card toast with inline feedback">
    <img class="ayy-toast__backdrop" src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='560' height='350' viewBox='0 0 560 350'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0%' stop-color='%236366f1'/><stop offset='100%' stop-color='%23ec4899'/></linearGradient></defs><rect width='100%' height='100%' fill='url(%23g)'/><rect x='40' y='40' width='480' height='270' rx='12' fill='%23ffffff' fill-opacity='0.15'/><circle cx='80' cy='75' r='8' fill='%23ffffff' fill-opacity='0.6'/><circle cx='105' cy='75' r='8' fill='%23ffffff' fill-opacity='0.4'/><circle cx='130' cy='75' r='8' fill='%23ffffff' fill-opacity='0.4'/><rect x='60' y='110' width='200' height='20' rx='6' fill='%23ffffff' fill-opacity='0.8'/><rect x='60' y='145' width='440' height='12' rx='4' fill='%23ffffff' fill-opacity='0.4'/><rect x='60' y='170' width='380' height='12' rx='4' fill='%23ffffff' fill-opacity='0.4'/><rect x='60' y='210' width='120' height='36' rx='8' fill='%23ffffff' fill-opacity='0.9'/></svg>" alt="" aria-hidden="true" draggable="false" />
    <img class="ayy-toast__image" src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='560' height='350' viewBox='0 0 560 350'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0%' stop-color='%236366f1'/><stop offset='100%' stop-color='%23ec4899'/></linearGradient></defs><rect width='100%' height='100%' fill='url(%23g)'/><rect x='40' y='40' width='480' height='270' rx='12' fill='%23ffffff' fill-opacity='0.15'/><circle cx='80' cy='75' r='8' fill='%23ffffff' fill-opacity='0.6'/><circle cx='105' cy='75' r='8' fill='%23ffffff' fill-opacity='0.4'/><circle cx='130' cy='75' r='8' fill='%23ffffff' fill-opacity='0.4'/><rect x='60' y='110' width='200' height='20' rx='6' fill='%23ffffff' fill-opacity='0.8'/><rect x='60' y='145' width='440' height='12' rx='4' fill='%23ffffff' fill-opacity='0.4'/><rect x='60' y='170' width='380' height='12' rx='4' fill='%23ffffff' fill-opacity='0.4'/><rect x='60' y='210' width='120' height='36' rx='8' fill='%23ffffff' fill-opacity='0.9'/></svg>" alt="Card preview" draggable="false" />
    <div class="ayy-toast__scrim">
      <ayy-tooltip class="ayy-tooltip" side="bottom"><button type="button" class="ayy-toast__close" aria-label="Dismiss preview">
        <svg class="ayy-icon ayy-icon--sm" data-ayy-icon="x" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6L6.00081 17.9992M17.9992 18L6 6.00085"/></svg>
      </button><span class="ayy-tooltip__content" role="tooltip">Dismiss preview</span></ayy-tooltip>
      <div class="ayy-toast__corner ayy-toast__corner--top-start">
        <ayy-tooltip class="ayy-tooltip" side="bottom"><button type="button" class="ayy-hover-action ayy-toast__action" aria-label="Annotate">
          <svg class="ayy-icon ayy-icon--sm" data-ayy-icon="pen-line" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14.0737 3.88545C14.8184 3.0708 15.1907 2.66347 15.6558 2.43329C16.2738 2.12743 16.9859 2.12215 17.6083 2.41872C18.0766 2.64188 18.4552 3.044 19.2124 3.84826C19.9818 4.6655 20.3665 5.07412 20.5843 5.54589C20.8737 6.17294 20.8601 6.88517 20.5471 7.50085C20.3115 7.96426 19.8967 8.36862 19.067 9.17733L9.64696 18.3582C8.52989 19.4468 7.97136 19.9911 7.27964 20.3344C6.58791 20.6776 5.81188 20.8002 4.25983 21.0453L3.00342 21.2438C2.59765 21.3079 2.2223 21.0189 2.17985 20.6105C2.17094 20.5248 2.17947 20.438 2.20494 20.3553L2.73031 18.6477C3.17056 17.2173 3.39069 16.5021 3.79155 15.8672C4.19241 15.2323 4.74797 14.7171 5.85908 13.6868L14.0737 3.88545Z"/></svg>
        </button><span class="ayy-tooltip__content" role="tooltip">Annotate</span></ayy-tooltip>
        <ayy-tooltip class="ayy-tooltip" side="bottom"><button type="button" class="ayy-hover-action ayy-toast__action" aria-label="Pin to screen">
          <svg class="ayy-icon ayy-icon--sm" data-ayy-icon="pin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22V17M12 17L19 13.5L16.5 11L18 4.5L14.5 6L12 3.5L9.5 6L6 4.5L7.5 11L5 13.5L12 17Z"/></svg>
        </button><span class="ayy-tooltip__content" role="tooltip">Pin to screen</span></ayy-tooltip>
      </div>
      <div class="ayy-toast__center">
        <button type="button" class="ayy-button ayy-button--sm">Copy</button>
        <button type="button" class="ayy-button ayy-button--secondary ayy-button--sm">Save</button>
      </div>
      <div class="ayy-toast__corner ayy-toast__corner--bottom-start">
        <ayy-tooltip class="ayy-tooltip" side="bottom"><button type="button" class="ayy-hover-action ayy-toast__action" aria-label="Share link">
          <svg class="ayy-icon ayy-icon--sm" data-ayy-icon="cloud-upload" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17.4776 9.01106C17.485 9.01102 17.4925 9.01101 17.5 9.01101C19.9853 9.01101 22 11.0294 22 13.5193C22 15.8398 20.25 17.7508 18 18M17.4776 9.01106C17.4924 8.84606 17.5 8.67896 17.5 8.51009C17.5 5.46695 15.0376 3 12 3C9.12324 3 6.76233 5.21267 6.52042 8.03192M17.4776 9.01106C17.3753 10.1476 16.9286 11.1846 16.2428 12.0165M6.52042 8.03192C3.98398 8.27373 2 10.4139 2 13.0183C2 15.4417 3.71776 17.4632 6 17.9273M6.52042 8.03192C6.67826 8.01687 6.83823 8.00917 7 8.00917C8.12582 8.00917 9.16474 8.38194 10.0005 9.01101"/><path d="M12 13L12 21M12 13C11.2998 13 9.99153 14.9943 9.5 15.5M12 13C12.7002 13 14.0085 14.9943 14.5 15.5"/></svg>
        </button><span class="ayy-tooltip__content" role="tooltip">Share link</span></ayy-tooltip>
      </div>
      <div class="ayy-toast__corner ayy-toast__corner--bottom-end">
        <ayy-tooltip class="ayy-tooltip" side="bottom"><button type="button" class="ayy-hover-action ayy-toast__action" aria-label="Show in folder">
          <svg class="ayy-icon ayy-icon--sm" data-ayy-icon="folder" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2 11V7C2 5.89543 2.89543 5 4 5H8.58579C8.851 5 9.10536 5.10536 9.29289 5.29289L10.7071 6.70711C10.8946 6.89464 11.149 7 11.4142 7H20C21.1046 7 22 7.89543 22 9V11M2 11H22M2 11V17C2 18.1046 2.89543 19 4 19H20C21.1046 19 22 18.1046 22 17V11"/></svg>
        </button><span class="ayy-tooltip__content" role="tooltip">Show in folder</span></ayy-tooltip>
        <ayy-tooltip class="ayy-tooltip" side="bottom"><button type="button" class="ayy-hover-action ayy-toast__action" aria-label="Delete">
          <svg class="ayy-icon ayy-icon--sm" data-ayy-icon="trash" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19.5 5.5L18.8803 15.5251C18.7219 18.0864 18.6428 19.3671 18.0008 20.2879C17.6833 20.7431 17.2747 21.1273 16.799 21.4177C15.8368 22.0053 14.553 22.0053 11.9854 22.0053C9.41785 22.0053 8.13406 22.0053 7.17188 21.4177C6.69614 21.1273 6.28754 20.7431 5.97008 20.2879C5.32808 19.3671 5.24891 18.0864 5.09057 15.5251L4.5 5.5M3 5.5H21M16.0557 5.5L15.3731 4.09173C14.9196 3.15626 14.6928 2.68852 14.3017 2.39681C14.215 2.3321 14.1233 2.276 14.027 2.22919C13.5933 2.01826 13.0745 2.01826 12.0368 2.01826C10.9765 2.01826 10.4463 2.01826 10.0076 2.23351C9.91037 2.28123 9.81792 2.33858 9.73105 2.40455C9.33923 2.70204 9.11327 3.17646 8.66135 4.12529L8.05199 5.5"/></svg>
        </button><span class="ayy-tooltip__content" role="tooltip">Delete</span></ayy-tooltip>
      </div>
    </div>
    <div class="ayy-toast--inline ayy-toast--inline--success" role="status">
      <span class="ayy-toast__icon" aria-hidden="true">
        <svg class="ayy-icon ayy-icon--sm" data-ayy-icon="circle-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12Z"/><path d="M8 12.5L10.5 15L16 9" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </span>
      <span>Copied to clipboard</span>
    </div>
  </div>
</div>
```

React:

```tsx
import {
  Button,
  CardToast,
  CardToastAction,
  CardToastBackdrop,
  CardToastCenter,
  CardToastClose,
  CardToastCorner,
  CardToastImage,
  CardToastScrim,
  Icon,
  InlineToast,
} from "@danitesler/ayywi/react";
import {
  CheckmarkCircle02Icon,
  CloudUploadIcon,
  Delete02Icon,
  Edit02Icon,
  Folder01Icon,
  PinIcon,
} from "@hugeicons/core-free-icons";

const SAMPLE_CARD =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='560' height='350' viewBox='0 0 560 350'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0%' stop-color='%236366f1'/><stop offset='100%' stop-color='%23ec4899'/></linearGradient></defs><rect width='100%' height='100%' fill='url(%23g)'/><rect x='40' y='40' width='480' height='270' rx='12' fill='%23ffffff' fill-opacity='0.15'/><circle cx='80' cy='75' r='8' fill='%23ffffff' fill-opacity='0.6'/><circle cx='105' cy='75' r='8' fill='%23ffffff' fill-opacity='0.4'/><circle cx='130' cy='75' r='8' fill='%23ffffff' fill-opacity='0.4'/><rect x='60' y='110' width='200' height='20' rx='6' fill='%23ffffff' fill-opacity='0.8'/><rect x='60' y='145' width='440' height='12' rx='4' fill='%23ffffff' fill-opacity='0.4'/><rect x='60' y='170' width='380' height='12' rx='4' fill='%23ffffff' fill-opacity='0.4'/><rect x='60' y='210' width='120' height='36' rx='8' fill='%23ffffff' fill-opacity='0.9'/></svg>";

export default function Example() {
  return (
    <div className="ayy-stack" style={{ inlineSize: "min(100%, 24rem)", gap: "var(--ayy-space-3)" }}>
      {/* Standalone with icon */}
      <div>
        <InlineToast tone="success" icon={<Icon icon={CheckmarkCircle02Icon} name="circle-check" size="sm" />}>
          Inline toast (with icon)
        </InlineToast>
      </div>

      {/* Standalone without icon */}
      <div>
        <InlineToast>Inline toast (without icon)</InlineToast>
      </div>

      {/* Embedded within CardToast */}
      <CardToast data-hover aria-label="Card toast with inline feedback">
        <CardToastBackdrop src={SAMPLE_CARD} />
        <CardToastImage src={SAMPLE_CARD} alt="Card preview" />
        <CardToastScrim>
          <CardToastClose label="Dismiss preview" />
          <CardToastCorner position="top-start">
            <CardToastAction label="Annotate">
              <Icon icon={Edit02Icon} name="pen-line" size="sm" />
            </CardToastAction>
            <CardToastAction label="Pin to screen">
              <Icon icon={PinIcon} name="pin" size="sm" />
            </CardToastAction>
          </CardToastCorner>
          <CardToastCenter>
            <Button size="sm">Copy</Button>
            <Button size="sm" variant="secondary">Save</Button>
          </CardToastCenter>
          <CardToastCorner position="bottom-start">
            <CardToastAction label="Share link">
              <Icon icon={CloudUploadIcon} name="cloud-upload" size="sm" />
            </CardToastAction>
          </CardToastCorner>
          <CardToastCorner position="bottom-end">
            <CardToastAction label="Show in folder">
              <Icon icon={Folder01Icon} name="folder" size="sm" />
            </CardToastAction>
            <CardToastAction label="Delete">
              <Icon icon={Delete02Icon} name="trash" size="sm" />
            </CardToastAction>
          </CardToastCorner>
        </CardToastScrim>
        <InlineToast tone="success" icon={<Icon icon={CheckmarkCircle02Icon} name="circle-check" size="sm" />}>
          Copied to clipboard
        </InlineToast>
      </CardToast>
    </div>
  );
}
```

---
Part of @danitesler/ayywi 0.1.2: load `dist/ayywi.min.css` (and `dist/elements.global.js` for the <ayy-*> elements). The rules every screen follows: [llms-full.txt#rules](../llms-full.txt#rules). Every component: [llms.txt](../llms.txt).
