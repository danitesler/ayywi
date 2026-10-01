# Toast

Category: Feedback. Short, temporary notification. One framework-free toast() function renders into a shared region in the top layer (visible above dialogs). Pauses while hovered or focused.

**Classes**
- `.ayy-toaster` — The shared region toast() creates (aria-live). Position via data-position.
- `.ayy-toast` — One toast.
- `.ayy-toast--success` — Green edge.
- `.ayy-toast--warning` — Amber edge.
- `.ayy-toast--destructive` — Red edge; announced with role="alert".
- `.ayy-toast--info` — Blue edge.
- `.ayy-toast__title` — Message.
- `.ayy-toast__description` — Optional second line.
- `.ayy-toast__actions` — Action button row.
- `.ayy-toast__close` — Close button.

**JS (framework-free)**: toast(message, { description?, variant?, duration?, action?: { label, onClick }, id? }) → { id, dismiss }; toast.success/warning/error/info(message, options); toast.dismiss(id?); configureToaster({ position?, label?, closeLabel? }); toastClass({ variant? })

**React** — `import { toast, Toaster } from "ayywi/react";`
- `<Toaster>` renders nothing — configures the shared region. Props: `position` "bottom-end" | "bottom-start" | "bottom-center" | "top-end" | "top-start" | "top-center"; `label` string — region name (translate); `closeLabel` string — close button name (translate)

**Accessibility**
- The region is aria-live="polite"; destructive toasts use role="alert".
- Timers pause while a toast is hovered or focused, so there's time to read it and reach its action.
- Messages are set with textContent — never HTML.

**Do**
- Use a toast to confirm something happened (Saved, Deployed, Copied) or to report a background result that needs no decision.
- Say what happened in 2–5 words: "Project deleted".
- Offer one Undo-style action instead of a confirmation dialog for reversible actions.

**Don't**
- Don't use a toast for errors the user must fix — show them inline next to the problem.
- Don't use a toast for anything needing a decision — use Dialog.
- Don't put long or important content in a toast — it disappears.
- Don't stack several toasts for one action — reuse an id to update it.
- Don't put links the user must follow in a toast.

## Toast — Variants and actions

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<!-- toast() is on window.ayywi when you load dist/elements.global.js; with a bundler: import { toast } from "ayywi". -->
<button type="button" class="ayy-button ayy-button--outline" onclick="ayywi.toast('Changes saved')">Default</button>
<button type="button" class="ayy-button ayy-button--outline" onclick="ayywi.toast.success('Deployed', { description: 'Marketing site is live.' })">Success</button>
<button type="button" class="ayy-button ayy-button--outline" onclick="ayywi.toast('Project archived', { action: { label: 'Undo', onClick: () => ayywi.toast.info('Project restored') } })">With action</button>
<button type="button" class="ayy-button ayy-button--outline" onclick="ayywi.toast.error('Build failed', { description: '3 type errors in api/server.ts' })">Error</button>
```

React:

```tsx
import { Button, toast } from "ayywi/react";

export default function Example() {
  return (
    <>
      <Button variant="outline" onClick={() => toast("Changes saved")}>
        Default
      </Button>
      <Button variant="outline" onClick={() => toast.success("Deployed", { description: "Marketing site is live." })}>
        Success
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast("Project archived", {
            action: { label: "Undo", onClick: () => toast.info("Project restored") },
          })
        }
      >
        With action
      </Button>
      <Button variant="outline" onClick={() => toast.error("Build failed", { description: "3 type errors in api/server.ts" })}>
        Error
      </Button>
    </>
  );
}
```

---
Part of ayywi 0.4.0: load `dist/ayywi.min.css` (and `dist/elements.global.js` for the <ayy-*> elements). The rules every screen follows: [llms-full.txt#rules](../llms-full.txt#rules). Every component: [llms.txt](../llms.txt).
