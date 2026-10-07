# Alert

Category: Feedback. Inline message box with optional icon, title, description and actions.

**Classes**
- `.ayy-alert` — Root. Neutral by default.
- `.ayy-alert--info` — Blue tint.
- `.ayy-alert--success` — Green tint.
- `.ayy-alert--warning` — Amber tint.
- `.ayy-alert--destructive` — Red tint.
- `.ayy-alert__title` — Bold first line.
- `.ayy-alert__description` — Supporting text.
- `.ayy-alert__actions` — Row of buttons.

**States**
- `default` — Wash fill, line-strong border, control radius; semibold title, text-soft description. info, success, warning and destructive tint the icon, an 8% fill and a 35% border in their colour.
- `hover` — doesn't apply: Static; its action Buttons have their own states.
- `pressed` — doesn't apply: Not interactive.
- `focus` — doesn't apply: Not focusable; its actions are.
- `disabled` — doesn't apply: Not interactive.
- `selected` — doesn't apply: Not interactive.
- `error` (`destructive (ayy-alert--destructive), role="alert" when it appears after an action`) — Red icon, 8% red fill and 35% red border. Add a Try again action for a failed load or save.
- `loading` — doesn't apply: Not a loading indicator; use a Spinner, Progress or Skeleton.

**Sizes**
- Density — Padding and sm text are fixed.
- Width — Fills its container.

**JS (framework-free)**: alertClass({ variant?, className? }) → string; alertTitleClass, alertDescriptionClass, alertActionsClass constants

**React** — `import { Alert, AlertTitle, AlertDescription, AlertActions } from "@danitesler/ayywi/react";`
- `<Alert>` renders <div>. Props: `variant` "default" | "info" | "success" | "warning" | "destructive"
- `<AlertTitle>` renders <p>.
- `<AlertDescription>` renders <p>.
- `<AlertActions>` renders <div>.

**Accessibility**
- Static alerts need no role. If it appears in response to an action, add role="alert" (urgent) or role="status" (polite).
- The icon is decorative: aria-hidden="true". The text must carry the meaning.

**Do**
- Use an alert for page- or section-level messages that stay until they're resolved: a billing issue, read-only mode, maintenance.
- Lead with what happened, then say what to do about it.

**Don't**
- Don't use an alert for confirmations that can disappear — use Toast.
- Don't use an alert for field errors — put a FieldError next to the field.
- Don't stack several alerts — combine them into one.
- Don't use destructive for things that aren't errors.

## Alert — Variants

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<div class="ayy-stack" style="inline-size: min(100%, 32.5rem)">
  <div class="ayy-alert">
    <svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/><path d="M12 16V12" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/><path d="M12.125 8.25H12M12.25 8.25C12.25 8.11193 12.1381 8 12 8C11.8619 8 11.75 8.11193 11.75 8.25C11.75 8.38807 11.8619 8.5 12 8.5C12.1381 8.5 12.25 8.38807 12.25 8.25Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/></svg>
    <p class="ayy-alert__title">Read-only mode</p>
    <p class="ayy-alert__description">You're viewing a shared project. Ask the owner for edit access.</p>
  </div>
  <div class="ayy-alert ayy-alert--warning">
    <svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M13.9248 21H10.0752C5.44476 21 3.12955 21 2.27636 19.4939C1.42317 17.9879 2.60736 15.9914 4.97574 11.9985L6.90057 8.75333C9.17559 4.91778 10.3131 3 12 3C13.6869 3 14.8244 4.91777 17.0994 8.75332L19.0243 11.9985C21.3926 15.9914 22.5768 17.9879 21.7236 19.4939C20.8704 21 18.5552 21 13.9248 21Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/><path d="M12 9V13" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/><path d="M12.125 16.75H12M12.25 16.75C12.25 16.8881 12.1381 17 12 17C11.8619 17 11.75 16.8881 11.75 16.75C11.75 16.6119 11.8619 16.5 12 16.5C12.1381 16.5 12.25 16.6119 12.25 16.75Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/></svg>
    <p class="ayy-alert__title">Your trial ends in 3 days</p>
    <p class="ayy-alert__description">Add a payment method to keep your projects online.</p>
    <div class="ayy-alert__actions">
      <button type="button" class="ayy-button ayy-button--sm">Add payment method</button>
      <button type="button" class="ayy-button ayy-button--ghost ayy-button--sm">Later</button>
    </div>
  </div>
  <div class="ayy-alert ayy-alert--destructive" role="alert">
    <p class="ayy-alert__title">Deploy failed</p>
    <p class="ayy-alert__description">The build ran out of memory. Increase the limit or split the job.</p>
  </div>
</div>
```

React:

```tsx
import { Alert02Icon, InformationCircleIcon } from "@hugeicons/core-free-icons";
import { Alert, AlertActions, AlertDescription, AlertTitle, Button, Icon } from "@danitesler/ayywi/react";

export default function Example() {
  return (
    <div className="ayy-stack" style={{ inlineSize: "min(100%, 32.5rem)" }}>
      <Alert>
        <Icon icon={InformationCircleIcon} />
        <AlertTitle>Read-only mode</AlertTitle>
        <AlertDescription>You're viewing a shared project. Ask the owner for edit access.</AlertDescription>
      </Alert>
      <Alert variant="warning">
        <Icon icon={Alert02Icon} />
        <AlertTitle>Your trial ends in 3 days</AlertTitle>
        <AlertDescription>Add a payment method to keep your projects online.</AlertDescription>
        <AlertActions>
          <Button size="sm">Add payment method</Button>
          <Button size="sm" variant="ghost">
            Later
          </Button>
        </AlertActions>
      </Alert>
      <Alert variant="destructive" role="alert">
        <AlertTitle>Deploy failed</AlertTitle>
        <AlertDescription>The build ran out of memory. Increase the limit or split the job.</AlertDescription>
      </Alert>
    </div>
  );
}
```

---
Part of @danitesler/ayywi 0.0.1: load `dist/ayywi.min.css` (and `dist/elements.global.js` for the <ayy-*> elements). The rules every screen follows: [llms-full.txt#rules](../llms-full.txt#rules). Every component: [llms.txt](../llms.txt).
