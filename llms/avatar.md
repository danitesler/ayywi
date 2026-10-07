# Avatar

Category: Data display. Round (or square) picture of a person or workspace, with initials that show when there's no image or it fails to load.

**Classes**
- `.ayy-avatar` — Root (role="img" + aria-label). 32px circle.
- `.ayy-avatar--sm` — 24px.
- `.ayy-avatar--lg` — 40px.
- `.ayy-avatar--xl` — 56px.
- `.ayy-avatar--square` — Rounded square (workspaces, teams).
- `.ayy-avatar__fallback` — Initials, underneath the image.
- `.ayy-avatar__image` — The <img alt="">. Covers the initials when it loads.
- `.ayy-avatar-group` — Overlapping stack of avatars.

**States**
- `default` — A disc in wash-hover with text-soft semibold initials under the image. square uses a rounded square.
- `hover` — doesn't apply: An avatar isn't a control; wrap it in a Button or link to make it one.
- `pressed` — doesn't apply: An avatar isn't a control; wrap it in a Button or link to make it one.
- `focus` — doesn't apply: Not focusable.
- `disabled` — doesn't apply: An avatar isn't a control; wrap it in a Button or link to make it one.
- `selected` — doesn't apply: An avatar isn't a control; wrap it in a Button or link to make it one.
- `error` (`a broken image (React and ayywi/elements set hidden on it)`) — The initials show; with CSS alone the broken-image icon is covered by a plain disc.
- `loading` — doesn't apply: Initials show until the image loads; use a circle Skeleton only when the name isn't known yet.

**Sizes**
- `sm` — 1.5rem (24px).
- `md` (default) — 2rem (32px).
- `lg` — 2.5rem (40px).
- `xl` — 3.5rem (56px).
- Density — Doesn't follow data-density. Initials are 38% of the size.
- Width — Square. A group overlaps them by 20% with a page-colour ring.

**JS (framework-free)**: avatarClass({ size?, shape?, className? }); avatarInitials(name); avatarGroupClass, avatarImageClass, avatarFallbackClass constants

**React** — `import { Avatar, AvatarGroup } from "ayywi/react";`
- `<Avatar>` renders <span role="img">. Props: `name` string (required) — accessible name and initials; `src` string — image URL; `fallback` string — custom initials; `size` "sm" | "md" | "lg" | "xl"; `shape` "circle" | "square"
- `<AvatarGroup>` renders <div role="group">.

**Accessibility**
- The name goes on the root (aria-label); the <img> has alt="" and the initials are aria-hidden, so it's announced once.
- Give an AvatarGroup an aria-label like "5 collaborators".
- A failed image is hidden by React or ayywi/elements so the initials show. With CSS alone it renders as a plain disc.

**Do**
- Use avatars for people and workspaces in lists, headers and comments.
- Use AvatarGroup for a stack of collaborators: show at most 4–5 and a "+3" badge for the rest.

**Don't**
- Don't use an avatar for decorative illustrations — use a plain <img>.
- Don't use an avatar for icons — use Icon.
- Don't rely on the picture alone to identify someone — show the name nearby.

## Avatar — Sizes, fallback, group

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<span class="ayy-avatar ayy-avatar--sm" role="img" aria-label="Maya Chen">
  <span class="ayy-avatar__fallback" aria-hidden="true">MC</span>
  <img class="ayy-avatar__image" alt="" src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'><rect width='40' height='40' fill='%235b9dff'/><circle cx='20' cy='16' r='7' fill='%23dbe8ff'/><rect x='8' y='26' width='24' height='14' rx='7' fill='%23dbe8ff'/></svg>" />
</span>
<span class="ayy-avatar" role="img" aria-label="Maya Chen">
  <span class="ayy-avatar__fallback" aria-hidden="true">MC</span>
  <img class="ayy-avatar__image" alt="" src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'><rect width='40' height='40' fill='%235b9dff'/><circle cx='20' cy='16' r='7' fill='%23dbe8ff'/><rect x='8' y='26' width='24' height='14' rx='7' fill='%23dbe8ff'/></svg>" />
</span>
<span class="ayy-avatar ayy-avatar--lg" role="img" aria-label="Leo Park"><span class="ayy-avatar__fallback" aria-hidden="true">LP</span></span>
<!-- The image fails; ayywi/elements hides it so the initials show through. -->
<span class="ayy-avatar ayy-avatar--lg" role="img" aria-label="Broken Image">
  <span class="ayy-avatar__fallback" aria-hidden="true">BI</span>
  <img class="ayy-avatar__image" alt="" src="/missing.png" />
</span>
<span class="ayy-avatar ayy-avatar--xl ayy-avatar--square" role="img" aria-label="Northwind"><span class="ayy-avatar__fallback" aria-hidden="true">N</span></span>
<div class="ayy-avatar-group" role="group" aria-label="4 collaborators">
  <span class="ayy-avatar" role="img" aria-label="Maya Chen"><span class="ayy-avatar__fallback" aria-hidden="true">MC</span></span>
  <span class="ayy-avatar" role="img" aria-label="Leo Park"><span class="ayy-avatar__fallback" aria-hidden="true">LP</span></span>
  <span class="ayy-avatar" role="img" aria-label="Ana Ruiz"><span class="ayy-avatar__fallback" aria-hidden="true">AR</span></span>
  <span class="ayy-avatar" role="img" aria-label="Sam Okafor"><span class="ayy-avatar__fallback" aria-hidden="true">SO</span></span>
</div>
<span class="ayy-badge ayy-badge--muted">+3</span>
```

React:

```tsx
import { Avatar, AvatarGroup, Badge } from "ayywi/react";

const photo =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'><rect width='40' height='40' fill='%235b9dff'/><circle cx='20' cy='16' r='7' fill='%23dbe8ff'/><rect x='8' y='26' width='24' height='14' rx='7' fill='%23dbe8ff'/></svg>";

export default function Example() {
  return (
    <>
      <Avatar name="Maya Chen" src={photo} size="sm" />
      <Avatar name="Maya Chen" src={photo} />
      <Avatar name="Leo Park" size="lg" />
      <Avatar name="Broken Image" src="/missing.png" size="lg" />
      <Avatar name="Northwind" shape="square" size="xl" />
      <AvatarGroup aria-label="4 collaborators">
        <Avatar name="Maya Chen" src={photo} />
        <Avatar name="Leo Park" />
        <Avatar name="Ana Ruiz" />
        <Avatar name="Sam Okafor" />
      </AvatarGroup>
      <Badge variant="muted">+3</Badge>
    </>
  );
}
```

---
Part of ayywi 0.4.0: load `dist/ayywi.min.css` (and `dist/elements.global.js` for the <ayy-*> elements). The rules every screen follows: [llms-full.txt#rules](../llms-full.txt#rules). Every component: [llms.txt](../llms.txt).
