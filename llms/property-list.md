# Property list

Category: Data display. A record's attributes as a definition list: a muted term (an icon and a label) and its value, side by side, wrapping under each other when the value doesn't fit. Also called: property-list, description-list, key-value, details-list, metadata-list.

**Classes**
- `.ayy-property-list` — Root <dl>. Rows stack with no gap; the rows own the padding.
- `.ayy-property-list--sm` — Small: the compact rows (6px block padding, a 7rem term basis) with text a pixel smaller.
- `.ayy-property-list--lg` — Large: 16px block padding, text a pixel larger, a 9rem term basis and 20px icons.
- `.ayy-property-list--compact` — Tight rows: 6px block padding instead of 12px and a 7rem term basis instead of 8rem.
- `.ayy-property-list__row` — The <div> that holds one <dt> and one <dd>: a wrapping flex row with the term at an 8rem basis and the value taking the rest.
- `.ayy-property-list__term` — The <dt>: a decorative icon and the label, at an 8rem basis and in --ayy-color-muted. The term never grows; the value takes the remaining width.
- `.ayy-property-list__label` — The label inside the term. Wraps inside the term's column.
- `.ayy-property-list__icon` — An optional Icon before the label: 16px, muted, never shrinks. Decorative, so the label names the row.
- `.ayy-property-list__value` — The <dd>: the value in --ayy-color-text. Long words wrap inside it (overflow-wrap: anywhere) instead of overflowing.
- `.ayy-property-list__empty` — What an empty value reads ("Not set"): muted, in place of the value.

**States**
- `default` — Muted, icon-led terms in an 8rem column and text-coloured values beside them, each row with 12px block padding and no hairline.
- `hover` — doesn't apply: Rows aren't interactive; a nested InlineEdit keeps its own hover.
- `pressed` — doesn't apply: Rows aren't interactive; their nested controls keep their own pressed look.
- `focus` — doesn't apply: Rows aren't focusable; their nested controls keep their focus rings.
- `disabled` — doesn't apply: The list doesn't disable; disable the control in a value, or drop the row.
- `selected` — doesn't apply: Not a choice control; use List or a Table with selected rows.
- `error` — doesn't apply: No error look; a value that failed validation nests a FieldError or an InlineEdit with aria-invalid on its field.
- `loading` — doesn't apply: No loading look; show Skeleton rows with aria-busy on the list.
- `empty` (`PropertyRow empty (emptyText, default "Not set")`) — The __empty span takes --ayy-color-muted instead of a blank value; forced colours draw it as GrayText.

**Sizes**
- `sm` — 6px block padding, a 7rem term, --ayy-text-s minus 1px text (12px compact, 13 touch).
- `md` (default) — 12px block padding, an 8rem term, --ayy-text-s text (13px compact, 14 touch).
- `lg` — 16px block padding, a 9rem term, --ayy-text-s plus 1px text (14px compact, 15 touch), 20px icons.
- Density — Row text follows data-density through --ayy-text-s (13px compact and comfortable, 14px touch). compact swaps the 12px block padding for 6px.
- Width — Fills its container. The term takes an 8rem basis (7rem compact) and the value 10rem; when they don't fit together the value wraps under its term. Long unbroken values wrap inside the value.

**React** — `import { PropertyList, PropertyRow } from "@danitesler/ayywi/react";`
- `<PropertyList>` renders <dl class="ayy-property-list">. Props: `size` "sm" | "md" | "lg" — row padding, text and term column; `compact` boolean — tight rows with a shorter term column, for a dense summary.
- `<PropertyRow>` renders <div class="ayy-property-list__row"> <dt class="ayy-property-list__term"> (icon and label) <dd class="ayy-property-list__value">. Props: `label` ReactNode (required) — the term's text.; `icon` ReactNode — an Icon before the label (give it className="ayy-property-list__icon").; `empty` boolean — there is no value: show emptyText muted instead of children.; `emptyText` ReactNode — what an empty value reads. Default "Not set".

**Accessibility**
- It's a real <dl>: screen readers announce a definition list and pair each term with its value.
- Each row is a <div> inside the <dl> (valid HTML) with exactly one <dt> and one <dd>, so the rows can wrap and flex.
- Icons in the term are decorative; the label names the row.
- An empty value says "Not set" in text, not a dash or a blank cell.
- A value edited in place keeps the nested InlineEdit's own label ("Change the version"); the term names the attribute, the control names the action.

**Do**
- Use a property list for a record's attributes: a project, a server, an order, a person.
- Keep terms short and values plain; nest a control only for a value edited in place.
- Use PropertyRow empty and emptyText when there is no value, so the row stays and reads as empty.
- Use compact inside a card header or a dense summary.

**Don't**
- Don't use it for rows that open something or carry actions at the end — use List.
- Don't use it for preferences with a control per row — use Settings.
- Don't use it for values people compare across columns — use Table.
- Don't hand-build the rows: the <dt>/<dd> pairing is what screen readers announce.

## Property list — Record

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<!-- A record's attributes: each row pairs one <dt> term (icon and label) with one <dd> value. The version nests
     <ayy-inline-edit>, which makes it editable in place. -->
<div style="inline-size: min(100%, 32rem)">
  <dl class="ayy-property-list">
    <div class="ayy-property-list__row">
      <dt class="ayy-property-list__term">
        <svg class="ayy-icon ayy-property-list__icon" data-ayy-icon="badge-check" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M18.9905 19H19M18.9905 19C18.3678 19.6175 17.2393 19.4637 16.4479 19.4637C15.4765 19.4637 15.0087 19.6537 14.3154 20.347C13.7251 20.9374 12.9337 22 12 22C11.0663 22 10.2749 20.9374 9.68457 20.347C8.99128 19.6537 8.52349 19.4637 7.55206 19.4637C6.76068 19.4637 5.63218 19.6175 5.00949 19C4.38181 18.3776 4.53628 17.2444 4.53628 16.4479C4.53628 15.4414 4.31616 14.9786 3.59938 14.2618C2.53314 13.1956 2.00002 12.6624 2 12C2.00001 11.3375 2.53312 10.8044 3.59935 9.73817C4.2392 9.09832 4.53628 8.46428 4.53628 7.55206C4.53628 6.76065 4.38249 5.63214 5 5.00944C5.62243 4.38178 6.7556 4.53626 7.55208 4.53626C8.46427 4.53626 9.09832 4.2392 9.73815 3.59937C10.8044 2.53312 11.3375 2 12 2C12.6625 2 13.1956 2.53312 14.2618 3.59937C14.9015 4.23907 15.5355 4.53626 16.4479 4.53626C17.2393 4.53626 18.3679 4.38247 18.9906 5C19.6182 5.62243 19.4637 6.75559 19.4637 7.55206C19.4637 8.55858 19.6839 9.02137 20.4006 9.73817C21.4669 10.8044 22 11.3375 22 12C22 12.6624 21.4669 13.1956 20.4006 14.2618C19.6838 14.9786 19.4637 15.4414 19.4637 16.4479C19.4637 17.2444 19.6182 18.3776 18.9905 19Z" stroke="currentColor" stroke-width="1.5"></path><path d="M9 12.8929C9 12.8929 10.2 13.5447 10.8 14.5C10.8 14.5 12.6 10.75 15 9.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg>
        <span class="ayy-property-list__label">Status</span>
      </dt>
      <dd class="ayy-property-list__value">
        <span class="ayy-badge ayy-badge--success">Live</span>
      </dd>
    </div>
    <div class="ayy-property-list__row">
      <dt class="ayy-property-list__term">
        <svg class="ayy-icon ayy-property-list__icon" data-ayy-icon="user" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20 21.0001C19.713 17.269 16.7289 14.3151 12.995 14.0662L12 13.9999C11.6446 14.0096 11.3134 14.0225 11.0008 14.0378C7.3 14.2192 4.28417 17.3057 4 21.0001" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><circle cx="12" cy="6.99988" r="4" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></circle></svg>
        <span class="ayy-property-list__label">Owner</span>
      </dt>
      <dd class="ayy-property-list__value">
        <span class="ayy-cluster"><span role="img" aria-label="Maya Chen" class="ayy-avatar ayy-avatar--sm" aria-hidden="true"><span class="ayy-avatar__fallback" aria-hidden="true">MC</span></span>Maya Chen</span>
      </dd>
    </div>
    <div class="ayy-property-list__row">
      <dt class="ayy-property-list__term">
        <svg class="ayy-icon ayy-property-list__icon" data-ayy-icon="git-branch" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7 19H13C15.8284 19 17.2426 19 18.1213 18.1213C19 17.2426 19 15.8284 19 13V10M19 10C19.7002 10 21.0085 11.9943 21.5 12.5M19 10C18.2998 10 16.9915 11.9943 16.5 12.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M5 7L5 17" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><circle cx="5" cy="5" r="2" stroke="currentColor" stroke-width="1.5"></circle><circle cx="19" cy="5" r="2" stroke="currentColor" stroke-width="1.5"></circle><circle cx="5" cy="19" r="2" stroke="currentColor" stroke-width="1.5"></circle></svg>
        <span class="ayy-property-list__label">Version</span>
      </dt>
      <dd class="ayy-property-list__value">
        <ayy-inline-edit>
          <div class="ayy-inline-edit" data-value="1.4.0">
            <button type="button" class="ayy-inline-edit__display" aria-label="Change the version"><span class="ayy-inline-edit__text">1.4.0</span></button>
            <input class="ayy-input ayy-inline-edit__input" hidden="" aria-label="Change the version" value="1.4.0"/>
          </div>
        </ayy-inline-edit>
      </dd>
    </div>
    <div class="ayy-property-list__row">
      <dt class="ayy-property-list__term">
        <svg class="ayy-icon ayy-property-list__icon" data-ayy-icon="calendar" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M16 2V6M8 2V6" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M13 4H11C7.22876 4 5.34315 4 4.17157 5.17157C3 6.34315 3 8.22876 3 12V14C3 17.7712 3 19.6569 4.17157 20.8284C5.34315 22 7.22876 22 11 22H13C16.7712 22 18.6569 22 19.8284 20.8284C21 19.6569 21 17.7712 21 14V12C21 8.22876 21 6.34315 19.8284 5.17157C18.6569 4 16.7712 4 13 4Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M3 10H21" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M12.1258 14H12.0008M12.1258 18H12.0008M7.625 14H7.5M7.625 18H7.5M16.625 14H16.5M12.2508 14C12.2508 14.1381 12.1389 14.25 12.0008 14.25C11.8628 14.25 11.7508 14.1381 11.7508 14C11.7508 13.8619 11.8628 13.75 12.0008 13.75C12.1389 13.75 12.2508 13.8619 12.2508 14ZM12.2508 18C12.2508 18.1381 12.1389 18.25 12.0008 18.25C11.8628 18.25 11.7508 18.1381 11.7508 18C11.7508 17.8619 11.8628 17.75 12.0008 17.75C12.1389 17.75 12.2508 17.8619 12.2508 18ZM7.75 14C7.75 14.1381 7.63807 14.25 7.5 14.25C7.36193 14.25 7.25 14.1381 7.25 14C7.25 13.8619 7.36193 13.75 7.5 13.75C7.63807 13.75 7.75 13.8619 7.75 14ZM7.75 18C7.75 18.1381 7.63807 18.25 7.5 18.25C7.36193 18.25 7.25 18.1381 7.25 18C7.25 17.8619 7.36193 17.75 7.5 17.75C7.63807 17.75 7.75 17.8619 7.75 18ZM16.75 14C16.75 14.1381 16.6381 14.25 16.5 14.25C16.3619 14.25 16.25 14.1381 16.25 14C16.25 13.8619 16.3619 13.75 16.5 13.75C16.6381 13.75 16.75 13.8619 16.75 14Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg>
        <span class="ayy-property-list__label">Due date</span>
      </dt>
      <dd class="ayy-property-list__value">
        <bdi><time datetime="2026-11-24">24 Nov 2026</time></bdi>
      </dd>
    </div>
    <div class="ayy-property-list__row">
      <dt class="ayy-property-list__term">
        <svg class="ayy-icon ayy-property-list__icon" data-ayy-icon="tag" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="1.5" cy="1.5" r="1.5" transform="matrix(1 0 0 -1 16 8.00024)" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></circle><path d="M2.77423 11.1439C1.77108 12.2643 1.7495 13.9546 2.67016 15.1437C4.49711 17.5033 6.49674 19.5029 8.85633 21.3298C10.0454 22.2505 11.7357 22.2289 12.8561 21.2258C15.8979 18.5022 18.6835 15.6559 21.3719 12.5279C21.6377 12.2187 21.8039 11.8397 21.8412 11.4336C22.0062 9.63798 22.3452 4.46467 20.9403 3.05974C19.5353 1.65481 14.362 1.99377 12.5664 2.15876C12.1603 2.19608 11.7813 2.36233 11.472 2.62811C8.34412 5.31646 5.49781 8.10211 2.77423 11.1439Z" stroke="currentColor" stroke-width="1.5"></path><path d="M7.00002 14.0002L10 17.0002" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg>
        <span class="ayy-property-list__label">Tags</span>
      </dt>
      <dd class="ayy-property-list__value">
        <span class="ayy-cluster"><span class="ayy-badge ayy-badge--muted">Design</span><span class="ayy-badge ayy-badge--muted">Engineering</span></span>
      </dd>
    </div>
    <div class="ayy-property-list__row">
      <dt class="ayy-property-list__term">
        <svg class="ayy-icon ayy-property-list__icon" data-ayy-icon="text" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M15 21.001H9" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M12 3.00001V21.0008M12 3.00001C13.3874 3.00001 15.1695 3.03055 16.5884 3.17649C17.1885 3.2382 17.4886 3.26906 17.7541 3.37791C18.3066 3.60429 18.7518 4.10063 18.9194 4.67681C19 4.95382 19 5.26992 19 5.90215M12 3.00001C10.6126 3.00001 8.83047 3.03055 7.41161 3.17649C6.8115 3.2382 6.51144 3.26906 6.24586 3.37791C5.69344 3.60429 5.24816 4.10063 5.08057 4.67681C5 4.95382 5 5.26992 5 5.90215" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path></svg>
        <span class="ayy-property-list__label">Description</span>
      </dt>
      <dd class="ayy-property-list__value">
        Averyveryverylongunbrokendescriptionoftheworkspacewithoutspaces.
      </dd>
    </div>
  </dl>
</div>
```

React:

```tsx
import {
  Calendar03Icon,
  CheckmarkBadge01Icon,
  GitBranchIcon,
  Tag01Icon,
  TextIcon,
  UserIcon,
} from "@hugeicons/core-free-icons";
import { Avatar, Badge, Icon, InlineEdit, PropertyList, PropertyRow } from "@danitesler/ayywi/react";

export default function Example() {
  return (
    <div style={{ inlineSize: "min(100%, 32rem)" }}>
      <PropertyList>
        <PropertyRow label="Status" icon={<Icon icon={CheckmarkBadge01Icon} name="badge-check" className="ayy-property-list__icon" />}>
          <Badge variant="success">Live</Badge>
        </PropertyRow>
        <PropertyRow label="Owner" icon={<Icon icon={UserIcon} name="user" className="ayy-property-list__icon" />}>
          <span className="ayy-cluster">
            <Avatar name="Maya Chen" size="sm" aria-hidden="true" />
            Maya Chen
          </span>
        </PropertyRow>
        <PropertyRow label="Version" icon={<Icon icon={GitBranchIcon} name="git-branch" className="ayy-property-list__icon" />}>
          <InlineEdit label="Change the version" defaultValue="1.4.0" />
        </PropertyRow>
        <PropertyRow label="Due date" icon={<Icon icon={Calendar03Icon} name="calendar" className="ayy-property-list__icon" />}>
          <bdi>
            <time dateTime="2026-11-24">24 Nov 2026</time>
          </bdi>
        </PropertyRow>
        <PropertyRow label="Tags" icon={<Icon icon={Tag01Icon} name="tag" className="ayy-property-list__icon" />}>
          <span className="ayy-cluster">
            <Badge variant="muted">Design</Badge>
            <Badge variant="muted">Engineering</Badge>
          </span>
        </PropertyRow>
        <PropertyRow label="Description" icon={<Icon icon={TextIcon} name="text" className="ayy-property-list__icon" />}>
          Averyveryverylongunbrokendescriptionoftheworkspacewithoutspaces.
        </PropertyRow>
      </PropertyList>
    </div>
  );
}
```

## Property list — Compact

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<!-- Compact: tighter rows and a shorter term column. An empty value reads its text (or a custom one) instead of
     leaving the <dd> blank. -->
<div style="inline-size: min(100%, 32rem)">
  <dl class="ayy-property-list ayy-property-list--compact">
    <div class="ayy-property-list__row">
      <dt class="ayy-property-list__term">
        <svg class="ayy-icon ayy-property-list__icon" data-ayy-icon="server" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M19 4H5C4.06812 4 3.60218 4 3.23463 4.15224C2.74458 4.35523 2.35523 4.74458 2.15224 5.23463C2 5.60218 2 6.06812 2 7C2 7.93188 2 8.39782 2.15224 8.76537C2.35523 9.25542 2.74458 9.64477 3.23463 9.84776C3.60218 10 4.06812 10 5 10H19C19.9319 10 20.3978 10 20.7654 9.84776C21.2554 9.64477 21.6448 9.25542 21.8478 8.76537C22 8.39782 22 7.93188 22 7C22 6.06812 22 5.60218 21.8478 5.23463C21.6448 4.74458 21.2554 4.35523 20.7654 4.15224C20.3978 4 19.9319 4 19 4Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M19 14H5C4.06812 14 3.60218 14 3.23463 14.1522C2.74458 14.3552 2.35523 14.7446 2.15224 15.2346C2 15.6022 2 16.0681 2 17C2 17.9319 2 18.3978 2.15224 18.7654C2.35523 19.2554 2.74458 19.6448 3.23463 19.8478C3.60218 20 4.06812 20 5 20H19C19.9319 20 20.3978 20 20.7654 19.8478C21.2554 19.6448 21.6448 19.2554 21.8478 18.7654C22 18.3978 22 17.9319 22 17C22 16.0681 22 15.6022 21.8478 15.2346C21.6448 14.7446 21.2554 14.3552 20.7654 14.1522C20.3978 14 19.9319 14 19 14Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M6.125 7H6M6.25 7C6.25 7.13807 6.13807 7.25 6 7.25C5.86193 7.25 5.75 7.13807 5.75 7C5.75 6.86193 5.86193 6.75 6 6.75C6.13807 6.75 6.25 6.86193 6.25 7Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M10.125 7H10M10.25 7C10.25 7.13807 10.1381 7.25 10 7.25C9.86193 7.25 9.75 7.13807 9.75 7C9.75 6.86193 9.86193 6.75 10 6.75C10.1381 6.75 10.25 6.86193 10.25 7Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M6.125 17H6M6.25 17C6.25 17.1381 6.13807 17.25 6 17.25C5.86193 17.25 5.75 17.1381 5.75 17C5.75 16.8619 5.86193 16.75 6 16.75C6.13807 16.75 6.25 16.8619 6.25 17Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M10.125 17H10M10.25 17C10.25 17.1381 10.1381 17.25 10 17.25C9.86193 17.25 9.75 17.1381 9.75 17C9.75 16.8619 9.86193 16.75 10 16.75C10.1381 16.75 10.25 16.8619 10.25 17Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg>
        <span class="ayy-property-list__label">Environment</span>
      </dt>
      <dd class="ayy-property-list__value">
        Production
      </dd>
    </div>
    <div class="ayy-property-list__row">
      <dt class="ayy-property-list__term">
        <svg class="ayy-icon ayy-property-list__icon" data-ayy-icon="globe" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5"></circle><path d="M8 12C8 18 12 22 12 22C12 22 16 18 16 12C16 6 12 2 12 2C12 2 8 6 8 12Z" stroke="currentColor" stroke-linejoin="round" stroke-width="1.5"></path><path d="M21 15H3" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M21 9H3" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg>
        <span class="ayy-property-list__label">Region</span>
      </dt>
      <dd class="ayy-property-list__value">
        eu-west-1
      </dd>
    </div>
    <div class="ayy-property-list__row">
      <dt class="ayy-property-list__term">
        <svg class="ayy-icon ayy-property-list__icon" data-ayy-icon="user" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20 21.0001C19.713 17.269 16.7289 14.3151 12.995 14.0662L12 13.9999C11.6446 14.0096 11.3134 14.0225 11.0008 14.0378C7.3 14.2192 4.28417 17.3057 4 21.0001" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><circle cx="12" cy="6.99988" r="4" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></circle></svg>
        <span class="ayy-property-list__label">Assignee</span>
      </dt>
      <dd class="ayy-property-list__value">
        <span class="ayy-property-list__empty">Unassigned</span>
      </dd>
    </div>
    <div class="ayy-property-list__row">
      <dt class="ayy-property-list__term">
        <svg class="ayy-icon ayy-property-list__icon" data-ayy-icon="clock" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5"></circle><path d="M12 8V12L14 14" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg>
        <span class="ayy-property-list__label">Updated</span>
      </dt>
      <dd class="ayy-property-list__value">
        <span class="ayy-property-list__empty">Not set</span>
      </dd>
    </div>
    <div class="ayy-property-list__row">
      <dt class="ayy-property-list__term">
        <svg class="ayy-icon ayy-property-list__icon" data-ayy-icon="code" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M16 6.99998L19.0664 9.64296C20.3554 10.7541 21 11.3096 21 12C21 12.6903 20.3555 13.2459 19.0664 14.357L16 17" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M8 6.99998L4.93365 9.64296C3.64455 10.7541 3 11.3096 3 12C3 12.6903 3.64455 13.2459 4.93365 14.357L8 17" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg>
        <span class="ayy-property-list__label">Checksum</span>
      </dt>
      <dd class="ayy-property-list__value">
        sha256:9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08
      </dd>
    </div>
  </dl>
</div>
```

React:

```tsx
import { Clock01Icon, CodeIcon, Globe02Icon, ServerStack01Icon, UserIcon } from "@hugeicons/core-free-icons";
import { Icon, PropertyList, PropertyRow } from "@danitesler/ayywi/react";

export default function Example() {
  return (
    <div style={{ inlineSize: "min(100%, 32rem)" }}>
      <PropertyList compact>
        <PropertyRow label="Environment" icon={<Icon icon={ServerStack01Icon} name="server" className="ayy-property-list__icon" />}>
          Production
        </PropertyRow>
        <PropertyRow label="Region" icon={<Icon icon={Globe02Icon} name="globe" className="ayy-property-list__icon" />}>
          eu-west-1
        </PropertyRow>
        <PropertyRow label="Assignee" icon={<Icon icon={UserIcon} name="user" className="ayy-property-list__icon" />} empty emptyText="Unassigned" />
        <PropertyRow label="Updated" icon={<Icon icon={Clock01Icon} name="clock" className="ayy-property-list__icon" />} empty />
        <PropertyRow label="Checksum" icon={<Icon icon={CodeIcon} name="code" className="ayy-property-list__icon" />}>
          sha256:9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08
        </PropertyRow>
      </PropertyList>
    </div>
  );
}
```

## Property list — Sizes

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<div class="ayy-stack" style="inline-size: min(100%, 32rem)">
  <dl class="ayy-property-list ayy-property-list--sm">
    <div class="ayy-property-list__row">
      <dt class="ayy-property-list__term"><svg class="ayy-icon ayy-property-list__icon" data-ayy-icon="badge-check" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M18.9905 19H19M18.9905 19C18.3678 19.6175 17.2393 19.4637 16.4479 19.4637C15.4765 19.4637 15.0087 19.6537 14.3154 20.347C13.7251 20.9374 12.9337 22 12 22C11.0663 22 10.2749 20.9374 9.68457 20.347C8.99128 19.6537 8.52349 19.4637 7.55206 19.4637C6.76068 19.4637 5.63218 19.6175 5.00949 19C4.38181 18.3776 4.53628 17.2444 4.53628 16.4479C4.53628 15.4414 4.31616 14.9786 3.59938 14.2618C2.53314 13.1956 2.00002 12.6624 2 12C2.00001 11.3375 2.53312 10.8044 3.59935 9.73817C4.2392 9.09832 4.53628 8.46428 4.53628 7.55206C4.53628 6.76065 4.38249 5.63214 5 5.00944C5.62243 4.38178 6.7556 4.53626 7.55208 4.53626C8.46427 4.53626 9.09832 4.2392 9.73815 3.59937C10.8044 2.53312 11.3375 2 12 2C12.6625 2 13.1956 2.53312 14.2618 3.59937C14.9015 4.23907 15.5355 4.53626 16.4479 4.53626C17.2393 4.53626 18.3679 4.38247 18.9906 5C19.6182 5.62243 19.4637 6.75559 19.4637 7.55206C19.4637 8.55858 19.6839 9.02137 20.4006 9.73817C21.4669 10.8044 22 11.3375 22 12C22 12.6624 21.4669 13.1956 20.4006 14.2618C19.6838 14.9786 19.4637 15.4414 19.4637 16.4479C19.4637 17.2444 19.6182 18.3776 18.9905 19Z" stroke="currentColor" stroke-width="1.5"></path><path d="M9 12.8929C9 12.8929 10.2 13.5447 10.8 14.5C10.8 14.5 12.6 10.75 15 9.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg><span class="ayy-property-list__label">Status</span></dt>
      <dd class="ayy-property-list__value"><span class="ayy-badge ayy-badge--success">Live</span></dd>
    </div>
    <div class="ayy-property-list__row">
      <dt class="ayy-property-list__term"><svg class="ayy-icon ayy-property-list__icon" data-ayy-icon="user" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20 21.0001C19.713 17.269 16.7289 14.3151 12.995 14.0662L12 13.9999C11.6446 14.0096 11.3134 14.0225 11.0008 14.0378C7.3 14.2192 4.28417 17.3057 4 21.0001" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><circle cx="12" cy="6.99988" r="4" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></circle></svg><span class="ayy-property-list__label">Owner</span></dt>
      <dd class="ayy-property-list__value">Maya Chen</dd>
    </div>
    <div class="ayy-property-list__row">
      <dt class="ayy-property-list__term"><svg class="ayy-icon ayy-property-list__icon" data-ayy-icon="calendar" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M16 2V6M8 2V6" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M13 4H11C7.22876 4 5.34315 4 4.17157 5.17157C3 6.34315 3 8.22876 3 12V14C3 17.7712 3 19.6569 4.17157 20.8284C5.34315 22 7.22876 22 11 22H13C16.7712 22 18.6569 22 19.8284 20.8284C21 19.6569 21 17.7712 21 14V12C21 8.22876 21 6.34315 19.8284 5.17157C18.6569 4 16.7712 4 13 4Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M3 10H21" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M12.1258 14H12.0008M12.1258 18H12.0008M7.625 14H7.5M7.625 18H7.5M16.625 14H16.5M12.2508 14C12.2508 14.1381 12.1389 14.25 12.0008 14.25C11.8628 14.25 11.7508 14.1381 11.7508 14C11.7508 13.8619 11.8628 13.75 12.0008 13.75C12.1389 13.75 12.2508 13.8619 12.2508 14ZM12.2508 18C12.2508 18.1381 12.1389 18.25 12.0008 18.25C11.8628 18.25 11.7508 18.1381 11.7508 18C11.7508 17.8619 11.8628 17.75 12.0008 17.75C12.1389 17.75 12.2508 17.8619 12.2508 18ZM7.75 14C7.75 14.1381 7.63807 14.25 7.5 14.25C7.36193 14.25 7.25 14.1381 7.25 14C7.25 13.8619 7.36193 13.75 7.5 13.75C7.63807 13.75 7.75 13.8619 7.75 14ZM7.75 18C7.75 18.1381 7.63807 18.25 7.5 18.25C7.36193 18.25 7.25 18.1381 7.25 18C7.25 17.8619 7.36193 17.75 7.5 17.75C7.63807 17.75 7.75 17.8619 7.75 18ZM16.75 14C16.75 14.1381 16.6381 14.25 16.5 14.25C16.3619 14.25 16.25 14.1381 16.25 14C16.25 13.8619 16.3619 13.75 16.5 13.75C16.6381 13.75 16.75 13.8619 16.75 14Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg><span class="ayy-property-list__label">Due date</span></dt>
      <dd class="ayy-property-list__value">24 Nov 2026</dd>
    </div>
  </dl>
  <dl class="ayy-property-list">
    <div class="ayy-property-list__row">
      <dt class="ayy-property-list__term"><svg class="ayy-icon ayy-property-list__icon" data-ayy-icon="badge-check" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M18.9905 19H19M18.9905 19C18.3678 19.6175 17.2393 19.4637 16.4479 19.4637C15.4765 19.4637 15.0087 19.6537 14.3154 20.347C13.7251 20.9374 12.9337 22 12 22C11.0663 22 10.2749 20.9374 9.68457 20.347C8.99128 19.6537 8.52349 19.4637 7.55206 19.4637C6.76068 19.4637 5.63218 19.6175 5.00949 19C4.38181 18.3776 4.53628 17.2444 4.53628 16.4479C4.53628 15.4414 4.31616 14.9786 3.59938 14.2618C2.53314 13.1956 2.00002 12.6624 2 12C2.00001 11.3375 2.53312 10.8044 3.59935 9.73817C4.2392 9.09832 4.53628 8.46428 4.53628 7.55206C4.53628 6.76065 4.38249 5.63214 5 5.00944C5.62243 4.38178 6.7556 4.53626 7.55208 4.53626C8.46427 4.53626 9.09832 4.2392 9.73815 3.59937C10.8044 2.53312 11.3375 2 12 2C12.6625 2 13.1956 2.53312 14.2618 3.59937C14.9015 4.23907 15.5355 4.53626 16.4479 4.53626C17.2393 4.53626 18.3679 4.38247 18.9906 5C19.6182 5.62243 19.4637 6.75559 19.4637 7.55206C19.4637 8.55858 19.6839 9.02137 20.4006 9.73817C21.4669 10.8044 22 11.3375 22 12C22 12.6624 21.4669 13.1956 20.4006 14.2618C19.6838 14.9786 19.4637 15.4414 19.4637 16.4479C19.4637 17.2444 19.6182 18.3776 18.9905 19Z" stroke="currentColor" stroke-width="1.5"></path><path d="M9 12.8929C9 12.8929 10.2 13.5447 10.8 14.5C10.8 14.5 12.6 10.75 15 9.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg><span class="ayy-property-list__label">Status</span></dt>
      <dd class="ayy-property-list__value"><span class="ayy-badge ayy-badge--success">Live</span></dd>
    </div>
    <div class="ayy-property-list__row">
      <dt class="ayy-property-list__term"><svg class="ayy-icon ayy-property-list__icon" data-ayy-icon="user" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20 21.0001C19.713 17.269 16.7289 14.3151 12.995 14.0662L12 13.9999C11.6446 14.0096 11.3134 14.0225 11.0008 14.0378C7.3 14.2192 4.28417 17.3057 4 21.0001" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><circle cx="12" cy="6.99988" r="4" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></circle></svg><span class="ayy-property-list__label">Owner</span></dt>
      <dd class="ayy-property-list__value">Maya Chen</dd>
    </div>
    <div class="ayy-property-list__row">
      <dt class="ayy-property-list__term"><svg class="ayy-icon ayy-property-list__icon" data-ayy-icon="calendar" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M16 2V6M8 2V6" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M13 4H11C7.22876 4 5.34315 4 4.17157 5.17157C3 6.34315 3 8.22876 3 12V14C3 17.7712 3 19.6569 4.17157 20.8284C5.34315 22 7.22876 22 11 22H13C16.7712 22 18.6569 22 19.8284 20.8284C21 19.6569 21 17.7712 21 14V12C21 8.22876 21 6.34315 19.8284 5.17157C18.6569 4 16.7712 4 13 4Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M3 10H21" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M12.1258 14H12.0008M12.1258 18H12.0008M7.625 14H7.5M7.625 18H7.5M16.625 14H16.5M12.2508 14C12.2508 14.1381 12.1389 14.25 12.0008 14.25C11.8628 14.25 11.7508 14.1381 11.7508 14C11.7508 13.8619 11.8628 13.75 12.0008 13.75C12.1389 13.75 12.2508 13.8619 12.2508 14ZM12.2508 18C12.2508 18.1381 12.1389 18.25 12.0008 18.25C11.8628 18.25 11.7508 18.1381 11.7508 18C11.7508 17.8619 11.8628 17.75 12.0008 17.75C12.1389 17.75 12.2508 17.8619 12.2508 18ZM7.75 14C7.75 14.1381 7.63807 14.25 7.5 14.25C7.36193 14.25 7.25 14.1381 7.25 14C7.25 13.8619 7.36193 13.75 7.5 13.75C7.63807 13.75 7.75 13.8619 7.75 14ZM7.75 18C7.75 18.1381 7.63807 18.25 7.5 18.25C7.36193 18.25 7.25 18.1381 7.25 18C7.25 17.8619 7.36193 17.75 7.5 17.75C7.63807 17.75 7.75 17.8619 7.75 18ZM16.75 14C16.75 14.1381 16.6381 14.25 16.5 14.25C16.3619 14.25 16.25 14.1381 16.25 14C16.25 13.8619 16.3619 13.75 16.5 13.75C16.6381 13.75 16.75 13.8619 16.75 14Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg><span class="ayy-property-list__label">Due date</span></dt>
      <dd class="ayy-property-list__value">24 Nov 2026</dd>
    </div>
  </dl>
  <dl class="ayy-property-list ayy-property-list--lg">
    <div class="ayy-property-list__row">
      <dt class="ayy-property-list__term"><svg class="ayy-icon ayy-property-list__icon" data-ayy-icon="badge-check" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M18.9905 19H19M18.9905 19C18.3678 19.6175 17.2393 19.4637 16.4479 19.4637C15.4765 19.4637 15.0087 19.6537 14.3154 20.347C13.7251 20.9374 12.9337 22 12 22C11.0663 22 10.2749 20.9374 9.68457 20.347C8.99128 19.6537 8.52349 19.4637 7.55206 19.4637C6.76068 19.4637 5.63218 19.6175 5.00949 19C4.38181 18.3776 4.53628 17.2444 4.53628 16.4479C4.53628 15.4414 4.31616 14.9786 3.59938 14.2618C2.53314 13.1956 2.00002 12.6624 2 12C2.00001 11.3375 2.53312 10.8044 3.59935 9.73817C4.2392 9.09832 4.53628 8.46428 4.53628 7.55206C4.53628 6.76065 4.38249 5.63214 5 5.00944C5.62243 4.38178 6.7556 4.53626 7.55208 4.53626C8.46427 4.53626 9.09832 4.2392 9.73815 3.59937C10.8044 2.53312 11.3375 2 12 2C12.6625 2 13.1956 2.53312 14.2618 3.59937C14.9015 4.23907 15.5355 4.53626 16.4479 4.53626C17.2393 4.53626 18.3679 4.38247 18.9906 5C19.6182 5.62243 19.4637 6.75559 19.4637 7.55206C19.4637 8.55858 19.6839 9.02137 20.4006 9.73817C21.4669 10.8044 22 11.3375 22 12C22 12.6624 21.4669 13.1956 20.4006 14.2618C19.6838 14.9786 19.4637 15.4414 19.4637 16.4479C19.4637 17.2444 19.6182 18.3776 18.9905 19Z" stroke="currentColor" stroke-width="1.5"></path><path d="M9 12.8929C9 12.8929 10.2 13.5447 10.8 14.5C10.8 14.5 12.6 10.75 15 9.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg><span class="ayy-property-list__label">Status</span></dt>
      <dd class="ayy-property-list__value"><span class="ayy-badge ayy-badge--success">Live</span></dd>
    </div>
    <div class="ayy-property-list__row">
      <dt class="ayy-property-list__term"><svg class="ayy-icon ayy-property-list__icon" data-ayy-icon="user" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20 21.0001C19.713 17.269 16.7289 14.3151 12.995 14.0662L12 13.9999C11.6446 14.0096 11.3134 14.0225 11.0008 14.0378C7.3 14.2192 4.28417 17.3057 4 21.0001" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><circle cx="12" cy="6.99988" r="4" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></circle></svg><span class="ayy-property-list__label">Owner</span></dt>
      <dd class="ayy-property-list__value">Maya Chen</dd>
    </div>
    <div class="ayy-property-list__row">
      <dt class="ayy-property-list__term"><svg class="ayy-icon ayy-property-list__icon" data-ayy-icon="calendar" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M16 2V6M8 2V6" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M13 4H11C7.22876 4 5.34315 4 4.17157 5.17157C3 6.34315 3 8.22876 3 12V14C3 17.7712 3 19.6569 4.17157 20.8284C5.34315 22 7.22876 22 11 22H13C16.7712 22 18.6569 22 19.8284 20.8284C21 19.6569 21 17.7712 21 14V12C21 8.22876 21 6.34315 19.8284 5.17157C18.6569 4 16.7712 4 13 4Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M3 10H21" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M12.1258 14H12.0008M12.1258 18H12.0008M7.625 14H7.5M7.625 18H7.5M16.625 14H16.5M12.2508 14C12.2508 14.1381 12.1389 14.25 12.0008 14.25C11.8628 14.25 11.7508 14.1381 11.7508 14C11.7508 13.8619 11.8628 13.75 12.0008 13.75C12.1389 13.75 12.2508 13.8619 12.2508 14ZM12.2508 18C12.2508 18.1381 12.1389 18.25 12.0008 18.25C11.8628 18.25 11.7508 18.1381 11.7508 18C11.7508 17.8619 11.8628 17.75 12.0008 17.75C12.1389 17.75 12.2508 17.8619 12.2508 18ZM7.75 14C7.75 14.1381 7.63807 14.25 7.5 14.25C7.36193 14.25 7.25 14.1381 7.25 14C7.25 13.8619 7.36193 13.75 7.5 13.75C7.63807 13.75 7.75 13.8619 7.75 14ZM7.75 18C7.75 18.1381 7.63807 18.25 7.5 18.25C7.36193 18.25 7.25 18.1381 7.25 18C7.25 17.8619 7.36193 17.75 7.5 17.75C7.63807 17.75 7.75 17.8619 7.75 18ZM16.75 14C16.75 14.1381 16.6381 14.25 16.5 14.25C16.3619 14.25 16.25 14.1381 16.25 14C16.25 13.8619 16.3619 13.75 16.5 13.75C16.6381 13.75 16.75 13.8619 16.75 14Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg><span class="ayy-property-list__label">Due date</span></dt>
      <dd class="ayy-property-list__value">24 Nov 2026</dd>
    </div>
  </dl>
</div>
```

React:

```tsx
import { Calendar03Icon, CheckmarkBadge01Icon, UserIcon } from "@hugeicons/core-free-icons";
import { Badge, Icon, PropertyList, PropertyRow } from "@danitesler/ayywi/react";

const rows = (
  <>
    <PropertyRow label="Status" icon={<Icon icon={CheckmarkBadge01Icon} name="badge-check" className="ayy-property-list__icon" />}>
      <Badge variant="success">Live</Badge>
    </PropertyRow>
    <PropertyRow label="Owner" icon={<Icon icon={UserIcon} name="user" className="ayy-property-list__icon" />}>
      Maya Chen
    </PropertyRow>
    <PropertyRow label="Due date" icon={<Icon icon={Calendar03Icon} name="calendar" className="ayy-property-list__icon" />}>
      24 Nov 2026
    </PropertyRow>
  </>
);

export default function Example() {
  return (
    <div className="ayy-stack" style={{ inlineSize: "min(100%, 32rem)" }}>
      <PropertyList size="sm">{rows}</PropertyList>
      <PropertyList>{rows}</PropertyList>
      <PropertyList size="lg">{rows}</PropertyList>
    </div>
  );
}
```

---
Part of @danitesler/ayywi 0.1.2: load `dist/ayywi.min.css` (and `dist/elements.global.js` for the <ayy-*> elements). The rules every screen follows: [llms-full.txt#rules](../llms-full.txt#rules). Every component: [llms.txt](../llms.txt).
