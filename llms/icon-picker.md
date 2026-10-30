# Icon picker

Category: Forms. A searchable grid of icons and emoji with a remove button, for marking a column, project, page or label with a symbol. It sits in a Popover or as the submenu panel of a Menu. Also called: emoji-picker, icon-selector, icon-chooser, emoji-selector.

**Classes**
- `.ayy-icon-picker` — Root: a flex column, 17rem wide at most, holding the header, the scrolling body and the empty message.
- `.ayy-icon-picker__header` — Row with the search field and the remove button.
- `.ayy-icon-picker__search` — The <input type="search" class="ayy-input ayy-input--sm"> that filters options by aria-label, data-keywords and data-value. ArrowDown moves into the grid, Enter picks the first match.
- `.ayy-icon-picker__remove` — A ghost sm Button that clears the icon (picks "").
- `.ayy-icon-picker__body` — The scrolling area (15rem tall at most) holding the sections.
- `.ayy-icon-picker__section` — One <div role="group" aria-labelledby> per kind (icons, emoji). Hidden while a search leaves it no options.
- `.ayy-icon-picker__label` — The section's muted heading ("Icons", "Emoji").
- `.ayy-icon-picker__grid` — The grid of options: as many sm-control-sized columns as fit.
- `.ayy-icon-picker__option` — One <button type="button" aria-label aria-pressed data-value> holding an Icon SVG or an emoji character. data-keywords adds search words.
- `.ayy-icon-picker__empty` — The <p role="status" hidden> shown when a search matches nothing.

**States**
- `default` — Options are transparent squares at the sm control height, icons and emoji in --ayy-color-text-soft, under muted section labels.
- `hover` (`.ayy-icon-picker__option:hover on a device that hovers`) — A --ayy-color-wash-hover fill and the text colour.
- `pressed` (`.ayy-icon-picker__option:active`) — The --ayy-color-wash-hover fill, also on touch screens.
- `focus` (`.ayy-icon-picker__option:focus-visible; the search field and remove button use Input's and Button's`) — A 2px --ayy-color-ring outline with a 2px offset.
- `disabled` (`:disabled on an option`) — --ayy-opacity-disabled and a not-allowed cursor; skipped by the arrow keys. GrayText in High Contrast.
- `selected` (`aria-pressed="true" on the picked option`) — A --ayy-color-primary tint at 16% with a 1px primary ring at 60%, and the text colour. A Highlight outline in High Contrast.
- `error` — doesn't apply: Picking can't fail; a search with no matches shows the empty message instead.
- `loading` — doesn't apply: Options are local; nothing to wait for.

**Sizes**
- Density — Options are the sm control height (28px compact, 32px comfortable, 40px touch) and the search field is an sm Input, so data-density grows the targets.
- Width — 17rem at most (shrinks with its container); the grid fits as many columns as the width allows and the body scrolls past 15rem.

**Custom element** `<ayy-icon-picker>` (@danitesler/ayywi/elements) — 
- attribute `value`: The picked option's data-value ("" for none). Updated on pick.
- attribute `name`: Form name: a hidden input inside carries the value.
- event `ayy-change`: { value, kind } — kind is "icon", "emoji", or null when removed.

**React** — `import { IconPicker } from "@danitesler/ayywi/react";`
- `<IconPicker>` renders <div class="ayy-icon-picker"> with a search Input, a remove Button and a section per kind. Props: `value / defaultValue` string — the picked icon value or emoji; "" for none; `onValueChange` (value: string, change: { value, kind, option }) => void; `icons` { value: string; label: string; icon: IconData | ReactNode; name?: IconName; keywords?: string[] }[] — the Icons section; omit for emoji only. name is the glyph's name ("star"), written as data-ayy-icon so an icon pack can replace it; `emojis` { value: string; label: string; keywords?: string[] }[] — the Emoji section (iconPickerEmojis by default; [] hides it); `searchable` boolean — show the search field (default true); `removable` boolean — show the remove button (default true); `iconsLabel / emojisLabel / searchLabel / removeLabel / emptyLabel` string — the visible and accessible text; `...` HTMLAttributes<HTMLDivElement> props

**Accessibility**
- Every option is a <button> with an aria-label naming the icon or emoji (an emoji character alone is read inconsistently) and aria-pressed for the picked one, so the choice is announced, not only tinted.
- Each section is a role="group" labelled by its heading. One option is the tab stop (the picked one, or the first): Tab moves search → grid → remove, and the arrow keys, Home and End move inside the grid, mirrored in RTL.
- ArrowDown from the search field enters the grid and ArrowUp from the first row returns to it; Enter in the search field picks the first match. A no-match search announces the role="status" empty message.
- Keys stay inside the picker except Esc, so a Menu or Popover around it still closes on Esc and returns focus. As a menu's submenu panel, give the panel role="dialog" and an aria-label, put it after the menu rather than inside it (a menu holds only items), and give the trigger aria-haspopup="dialog".

**Do**
- Use an icon picker to let people mark a column, project, page or label with an icon or emoji of their choice.
- Offer a short, relevant icon set (the same Hugeicons the app uses) and keep the emoji section for personal flair.
- Give every option a plain label and keywords, so search finds "money" under Dollar and 💰.

**Don't**
- Don't use an icon picker to choose a status, category or other fixed value with meaning — use Select, Segmented control or Swatch.
- Don't list icons as one menu item each once there are more than a handful — the grid and search scale, a menu doesn't.
- Don't show the picked icon without its label elsewhere when the icon carries meaning; icons are a hint, not the name.

## Icon picker — Icons and emoji with search

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<!-- <ayy-icon-picker> (@danitesler/ayywi/elements) filters on search, moves with the arrow keys and fires ayy-change ({ value, kind }) on pick. -->
<ayy-icon-picker value="star">
  <div class="ayy-icon-picker">
    <div class="ayy-icon-picker__header">
      <input type="search" class="ayy-input ayy-input--sm ayy-icon-picker__search" aria-label="Search icons" placeholder="Search icons" autocomplete="off" spellcheck="false"/>
      <button type="button" class="ayy-button ayy-button--ghost ayy-button--sm ayy-icon-picker__remove">Remove</button>
    </div>
    <div class="ayy-icon-picker__body">
      <div class="ayy-icon-picker__section" role="group" aria-labelledby="icon-picker-basic-icons">
        <p id="icon-picker-basic-icons" class="ayy-icon-picker__label">Icons</p>
        <div class="ayy-icon-picker__grid">
          <button type="button" class="ayy-icon-picker__option" data-value="star" data-keywords="favourite important" aria-label="Star" aria-pressed="true" title="Star"><svg class="ayy-icon" data-ayy-icon="star" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M13.7276 3.44418L15.4874 6.99288C15.7274 7.48687 16.3673 7.9607 16.9073 8.05143L20.0969 8.58575C22.1367 8.92853 22.6167 10.4206 21.1468 11.8925L18.6671 14.3927C18.2471 14.8161 18.0172 15.6327 18.1471 16.2175L18.8571 19.3125C19.417 21.7623 18.1271 22.71 15.9774 21.4296L12.9877 19.6452C12.4478 19.3226 11.5579 19.3226 11.0079 19.6452L8.01827 21.4296C5.8785 22.71 4.57865 21.7522 5.13859 19.3125L5.84851 16.2175C5.97849 15.6327 5.74852 14.8161 5.32856 14.3927L2.84884 11.8925C1.389 10.4206 1.85895 8.92853 3.89872 8.58575L7.08837 8.05143C7.61831 7.9607 8.25824 7.48687 8.49821 6.99288L10.258 3.44418C11.2179 1.51861 12.7777 1.51861 13.7276 3.44418Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg></button>
          <button type="button" class="ayy-icon-picker__option" data-value="tag" data-keywords="label category" aria-label="Tag" aria-pressed="false" title="Tag"><svg class="ayy-icon" data-ayy-icon="tag" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="1.5" cy="1.5" r="1.5" transform="matrix(1 0 0 -1 16 8.00024)" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></circle><path d="M2.77423 11.1439C1.77108 12.2643 1.7495 13.9546 2.67016 15.1437C4.49711 17.5033 6.49674 19.5029 8.85633 21.3298C10.0454 22.2505 11.7357 22.2289 12.8561 21.2258C15.8979 18.5022 18.6835 15.6559 21.3719 12.5279C21.6377 12.2187 21.8039 11.8397 21.8412 11.4336C22.0062 9.63798 22.3452 4.46467 20.9403 3.05974C19.5353 1.65481 14.362 1.99377 12.5664 2.15876C12.1603 2.19608 11.7813 2.36233 11.472 2.62811C8.34412 5.31646 5.49781 8.10211 2.77423 11.1439Z" stroke="currentColor" stroke-width="1.5"></path><path d="M7.00002 14.0002L10 17.0002" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg></button>
          <button type="button" class="ayy-icon-picker__option" data-value="calendar" data-keywords="date" aria-label="Calendar" aria-pressed="false" title="Calendar"><svg class="ayy-icon" data-ayy-icon="calendar" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M16 2V6M8 2V6" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M13 4H11C7.22876 4 5.34315 4 4.17157 5.17157C3 6.34315 3 8.22876 3 12V14C3 17.7712 3 19.6569 4.17157 20.8284C5.34315 22 7.22876 22 11 22H13C16.7712 22 18.6569 22 19.8284 20.8284C21 19.6569 21 17.7712 21 14V12C21 8.22876 21 6.34315 19.8284 5.17157C18.6569 4 16.7712 4 13 4Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M3 10H21" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M12.1258 14H12.0008M12.1258 18H12.0008M7.625 14H7.5M7.625 18H7.5M16.625 14H16.5M12.2508 14C12.2508 14.1381 12.1389 14.25 12.0008 14.25C11.8628 14.25 11.7508 14.1381 11.7508 14C11.7508 13.8619 11.8628 13.75 12.0008 13.75C12.1389 13.75 12.2508 13.8619 12.2508 14ZM12.2508 18C12.2508 18.1381 12.1389 18.25 12.0008 18.25C11.8628 18.25 11.7508 18.1381 11.7508 18C11.7508 17.8619 11.8628 17.75 12.0008 17.75C12.1389 17.75 12.2508 17.8619 12.2508 18ZM7.75 14C7.75 14.1381 7.63807 14.25 7.5 14.25C7.36193 14.25 7.25 14.1381 7.25 14C7.25 13.8619 7.36193 13.75 7.5 13.75C7.63807 13.75 7.75 13.8619 7.75 14ZM7.75 18C7.75 18.1381 7.63807 18.25 7.5 18.25C7.36193 18.25 7.25 18.1381 7.25 18C7.25 17.8619 7.36193 17.75 7.5 17.75C7.63807 17.75 7.75 17.8619 7.75 18ZM16.75 14C16.75 14.1381 16.6381 14.25 16.5 14.25C16.3619 14.25 16.25 14.1381 16.25 14C16.25 13.8619 16.3619 13.75 16.5 13.75C16.6381 13.75 16.75 13.8619 16.75 14Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg></button>
          <button type="button" class="ayy-icon-picker__option" data-value="text" data-keywords="note" aria-label="Text" aria-pressed="false" title="Text"><svg class="ayy-icon" data-ayy-icon="text" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M15 21.001H9" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M12 3.00001V21.0008M12 3.00001C13.3874 3.00001 15.1695 3.03055 16.5884 3.17649C17.1885 3.2382 17.4886 3.26906 17.7541 3.37791C18.3066 3.60429 18.7518 4.10063 18.9194 4.67681C19 4.95382 19 5.26992 19 5.90215M12 3.00001C10.6126 3.00001 8.83047 3.03055 7.41161 3.17649C6.8115 3.2382 6.51144 3.26906 6.24586 3.37791C5.69344 3.60429 5.24816 4.10063 5.08057 4.67681C5 4.95382 5 5.26992 5 5.90215" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path></svg></button>
          <button type="button" class="ayy-icon-picker__option" data-value="folder" data-keywords="project" aria-label="Folder" aria-pressed="false" title="Folder"><svg class="ayy-icon" data-ayy-icon="folder" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M8 7H16.75C18.8567 7 19.91 7 20.6667 7.50559C20.9943 7.72447 21.2755 8.00572 21.4944 8.33329C22 9.08996 22 10.1433 22 12.25C22 15.7612 22 17.5167 21.1573 18.7779C20.7926 19.3238 20.3238 19.7926 19.7779 20.1573C18.5167 21 16.7612 21 13.25 21H12C7.28595 21 4.92893 21 3.46447 19.5355C2 18.0711 2 15.714 2 11V7.94427C2 6.1278 2 5.21956 2.38032 4.53806C2.65142 4.05227 3.05227 3.65142 3.53806 3.38032C4.21956 3 5.1278 3 6.94427 3C8.10802 3 8.6899 3 9.19926 3.19101C10.3622 3.62712 10.8418 4.68358 11.3666 5.73313L12 7" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path></svg></button>
          <button type="button" class="ayy-icon-picker__option" data-value="flag" data-keywords="priority" aria-label="Flag" aria-pressed="false" title="Flag"><svg class="ayy-icon" data-ayy-icon="flag" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5.0249 21C5.04385 19.2643 5.04366 17.5541 5.0366 15.9209M5.0366 15.9209C5.01301 10.4614 4.91276 5.86186 5.19475 4.04271C5.5611 1.67939 9.39301 3.82993 13.9703 5.59842L16.0328 6.48729C17.5508 7.1415 19.7187 8.30352 18.7662 9.66084C18.3738 10.22 17.56 10.8596 16.0575 11.567L5.0366 15.9209Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg></button>
          <button type="button" class="ayy-icon-picker__option" data-value="dollar" data-keywords="money revenue price" aria-label="Dollar" aria-pressed="false" title="Dollar"><svg class="ayy-icon" data-ayy-icon="circle-dollar-sign" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" stroke-width="1.5"></path><path d="M14.7102 10.0611C14.6111 9.29844 13.7354 8.06622 12.1608 8.06619C10.3312 8.06616 9.56136 9.07946 9.40515 9.58611C9.16145 10.2638 9.21019 11.6571 11.3547 11.809C14.0354 11.999 15.1093 12.3154 14.9727 13.956C14.836 15.5965 13.3417 15.951 12.1608 15.9129C10.9798 15.875 9.04764 15.3325 8.97266 13.8733M11.9734 6.99805V8.06982M11.9734 15.9031V16.998" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path></svg></button>
          <button type="button" class="ayy-icon-picker__option" data-value="chart" data-keywords="growth trend" aria-label="Chart" aria-pressed="false" title="Chart"><svg class="ayy-icon" data-ayy-icon="trending-up" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M21 21H10C6.70017 21 5.05025 21 4.02513 19.9749C3 18.9497 3 17.2998 3 14V3" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path><path d="M7.99707 16.999C11.5286 16.999 18.9122 15.5348 18.6979 6.43269M16.4886 8.04302L18.3721 6.14612C18.5656 5.95127 18.8798 5.94981 19.0751 6.14286L20.9971 8.04302" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg></button>
          <button type="button" class="ayy-icon-picker__option" data-value="user" data-keywords="person owner" aria-label="User" aria-pressed="false" title="User"><svg class="ayy-icon" data-ayy-icon="user" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20 21.0001C19.713 17.269 16.7289 14.3151 12.995 14.0662L12 13.9999C11.6446 14.0096 11.3134 14.0225 11.0008 14.0378C7.3 14.2192 4.28417 17.3057 4 21.0001" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><circle cx="12" cy="6.99988" r="4" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></circle></svg></button>
          <button type="button" class="ayy-icon-picker__option" data-value="company" data-keywords="account office" aria-label="Company" aria-pressed="false" title="Company"><svg class="ayy-icon" data-ayy-icon="building" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M16 10L18.1494 10.6448C19.5226 11.0568 20.2092 11.2628 20.6046 11.7942C21 12.3256 21 13.0425 21 14.4761V22" stroke="currentColor" stroke-linejoin="round" stroke-width="1.5"></path><path d="M8 9L11 9M8 13L11 13" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M12 22V19C12 18.0572 12 17.5858 11.7071 17.2929C11.4142 17 10.9428 17 10 17H9C8.05719 17 7.58579 17 7.29289 17.2929C7 17.5858 7 18.0572 7 19V22" stroke="currentColor" stroke-linejoin="round" stroke-width="1.5"></path><path d="M2 22L22 22" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path><path d="M3 22V6.71724C3 4.20649 3 2.95111 3.79118 2.32824C4.58237 1.70537 5.74742 2.04355 8.07752 2.7199L13.0775 4.17122C14.4836 4.57937 15.1867 4.78344 15.5933 5.33965C16 5.89587 16 6.65344 16 8.16857V22" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg></button>
          <button type="button" class="ayy-icon-picker__option" data-value="work" data-keywords="work job" aria-label="Briefcase" aria-pressed="false" title="Briefcase"><svg class="ayy-icon" data-ayy-icon="briefcase" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M2.00127 8.5L1.99911 13.997C1.99782 17.2979 1.99717 18.9484 3.02235 19.974C4.04754 20.9996 5.69801 20.9996 8.99895 20.9997L15 20.9998C18.2994 20.9999 19.949 21 20.9741 19.9751C21.9992 18.9502 21.9996 17.3005 22.0002 14.0012L22.0013 8.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M8.49857 6.5C8.49857 5.09554 8.49857 4.39331 8.83563 3.88886C8.98154 3.67048 9.16904 3.48298 9.38743 3.33706C9.89187 3 10.5941 3 11.9986 3C13.403 3 14.1053 3 14.6097 3.33706C14.8281 3.48298 15.0156 3.67048 15.1615 3.88886C15.4986 4.39331 15.4986 5.09554 15.4986 6.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M19.998 6.50016L3.99885 6.5C2.8944 6.50007 1.99876 7.39568 1.99866 8.50013C1.99876 10.7091 3.79005 12.5004 5.99901 12.5006H17.9978C20.2068 12.5005 21.998 10.7093 21.9981 8.5003C21.998 7.39582 21.1024 6.50023 19.998 6.50016Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M9.99857 12.5V13.5C9.99857 13.965 9.99857 14.1975 10.0497 14.3882C10.1884 14.9059 10.5927 15.3102 11.1103 15.4489C11.3011 15.5 11.5336 15.5 11.9986 15.5C12.4636 15.5 12.696 15.5 12.8868 15.4489C13.4044 15.3102 13.8088 14.9059 13.9475 14.3882C13.9986 14.1975 13.9986 13.965 13.9986 13.5V12.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg></button>
          <button type="button" class="ayy-icon-picker__option" data-value="mail" data-keywords="email" aria-label="Mail" aria-pressed="false" title="Mail"><svg class="ayy-icon" data-ayy-icon="mail" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M2 6L8.91302 9.91697C11.4616 11.361 12.5384 11.361 15.087 9.91697L22 6" stroke="currentColor" stroke-linejoin="round" stroke-width="1.5"></path><path d="M2.01577 13.4756C2.08114 16.5412 2.11383 18.0739 3.24496 19.2094C4.37608 20.3448 5.95033 20.3843 9.09883 20.4634C11.0393 20.5122 12.9607 20.5122 14.9012 20.4634C18.0497 20.3843 19.6239 20.3448 20.7551 19.2094C21.8862 18.0739 21.9189 16.5412 21.9842 13.4756C22.0053 12.4899 22.0053 11.5101 21.9842 10.5244C21.9189 7.45886 21.8862 5.92609 20.7551 4.79066C19.6239 3.65523 18.0497 3.61568 14.9012 3.53657C12.9607 3.48781 11.0393 3.48781 9.09882 3.53656C5.95033 3.61566 4.37608 3.65521 3.24495 4.79065C2.11382 5.92608 2.08114 7.45885 2.01576 10.5244C1.99474 11.5101 1.99475 12.4899 2.01577 13.4756Z" stroke="currentColor" stroke-linejoin="round" stroke-width="1.5"></path></svg></button>
          <button type="button" class="ayy-icon-picker__option" data-value="phone" data-keywords="call" aria-label="Phone" aria-pressed="false" title="Phone"><svg class="ayy-icon" data-ayy-icon="phone" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M9.1585 5.71217L8.75584 4.80619C8.49256 4.21382 8.36092 3.91762 8.16405 3.69095C7.91732 3.40688 7.59571 3.19788 7.23592 3.08779C6.94883 2.99994 6.6247 2.99994 5.97645 2.99994C5.02815 2.99994 4.554 2.99994 4.15597 3.18223C3.68711 3.39696 3.26368 3.86322 3.09497 4.35054C2.95175 4.76423 2.99278 5.18937 3.07482 6.03964C3.94815 15.0901 8.91006 20.052 17.9605 20.9254C18.8108 21.0074 19.236 21.0484 19.6496 20.9052C20.137 20.7365 20.6032 20.3131 20.818 19.8442C21.0002 19.4462 21.0002 18.972 21.0002 18.0237C21.0002 17.3755 21.0002 17.0514 20.9124 16.7643C20.8023 16.4045 20.5933 16.0829 20.3092 15.8361C20.0826 15.6393 19.7864 15.5076 19.194 15.2443L18.288 14.8417C17.6465 14.5566 17.3257 14.414 16.9998 14.383C16.6878 14.3533 16.3733 14.3971 16.0813 14.5108C15.7762 14.6296 15.5066 14.8543 14.9672 15.3038C14.4304 15.7511 14.162 15.9748 13.834 16.0946C13.5432 16.2009 13.1588 16.2402 12.8526 16.1951C12.5071 16.1442 12.2426 16.0028 11.7135 15.7201C10.0675 14.8404 9.15977 13.9327 8.28011 12.2867C7.99738 11.7576 7.85602 11.4931 7.80511 11.1476C7.75998 10.8414 7.79932 10.457 7.90554 10.1662C8.02536 9.83822 8.24905 9.5698 8.69643 9.03294C9.14586 8.49362 9.37058 8.22396 9.48939 7.91885C9.60309 7.62688 9.64686 7.31234 9.61719 7.00042C9.58618 6.67446 9.44362 6.3537 9.1585 5.71217Z" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path></svg></button>
          <button type="button" class="ayy-icon-picker__option" data-value="link" data-keywords="url" aria-label="Link" aria-pressed="false" title="Link"><svg class="ayy-icon" data-ayy-icon="link" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M9.14339 10.691L9.35031 10.4841C11.329 8.50532 14.5372 8.50532 16.5159 10.4841C18.4947 12.4628 18.4947 15.671 16.5159 17.6497L13.6497 20.5159C11.671 22.4947 8.46279 22.4947 6.48405 20.5159C4.50532 18.5372 4.50532 15.329 6.48405 13.3503L6.9484 12.886" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path><path d="M17.0516 11.114L17.5159 10.6497C19.4947 8.67095 19.4947 5.46279 17.5159 3.48405C15.5372 1.50532 12.329 1.50532 10.3503 3.48405L7.48405 6.35031C5.50532 8.32904 5.50532 11.5372 7.48405 13.5159C9.46279 15.4947 12.671 15.4947 14.6497 13.5159L14.8566 13.309" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path></svg></button>
          <button type="button" class="ayy-icon-picker__option" data-value="done" data-keywords="check complete" aria-label="Done" aria-pressed="false" title="Done"><svg class="ayy-icon" data-ayy-icon="circle-check" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12Z" stroke="currentColor" stroke-width="1.5"></path><path d="M8 12.5L10.5 15L16 9" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg></button>
          <button type="button" class="ayy-icon-picker__option" data-value="clock" data-keywords="time due" aria-label="Clock" aria-pressed="false" title="Clock"><svg class="ayy-icon" data-ayy-icon="clock" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5"></circle><path d="M12 8V12L14 14" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg></button>
          <button type="button" class="ayy-icon-picker__option" data-value="location" data-keywords="place address" aria-label="Location" aria-pressed="false" title="Location"><svg class="ayy-icon" data-ayy-icon="map-pin" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M13.6177 21.367C13.1841 21.773 12.6044 22 12.0011 22C11.3978 22 10.8182 21.773 10.3845 21.367C6.41302 17.626 1.09076 13.4469 3.68627 7.37966C5.08963 4.09916 8.45834 2 12.0011 2C15.5439 2 18.9126 4.09916 20.316 7.37966C22.9082 13.4393 17.599 17.6389 13.6177 21.367Z" stroke="currentColor" stroke-width="1.5"></path><path d="M15.5 11C15.5 12.933 13.933 14.5 12 14.5C10.067 14.5 8.5 12.933 8.5 11C8.5 9.067 10.067 7.5 12 7.5C13.933 7.5 15.5 9.067 15.5 11Z" stroke="currentColor" stroke-width="1.5"></path></svg></button>
          <button type="button" class="ayy-icon-picker__option" data-value="globe" data-keywords="region world" aria-label="Globe" aria-pressed="false" title="Globe"><svg class="ayy-icon" data-ayy-icon="globe" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5"></circle><path d="M8 12C8 18 12 22 12 22C12 22 16 18 16 12C16 6 12 2 12 2C12 2 8 6 8 12Z" stroke="currentColor" stroke-linejoin="round" stroke-width="1.5"></path><path d="M21 15H3" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M21 9H3" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg></button>
          <button type="button" class="ayy-icon-picker__option" data-value="rocket" data-keywords="launch" aria-label="Rocket" aria-pressed="false" title="Rocket"><svg class="ayy-icon" data-ayy-icon="rocket-launch" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6.21875 11.618L3.31189 11.2378C2.71644 11.1606 2.31883 10.5841 2.58348 10.0458C3.42523 8.33365 5.6195 6.35437 9.73988 6.68079M6.21875 11.618C7.27445 9.85426 8.57175 8.00435 9.73988 6.68079M6.21875 11.618L11.882 17.2812M9.73988 6.68079C13.4105 2.58986 17.1745 1.728 19.5937 2.06685C20.5508 2.2009 21.2991 2.94917 21.4332 3.90626C21.772 6.32551 20.9101 10.0895 16.8192 13.7601M11.882 17.2812L12.2622 20.1881C12.3394 20.7836 12.9159 21.1812 13.4542 20.9165C15.1664 20.0748 17.1456 17.8805 16.8192 13.7601M11.882 17.2812C13.6457 16.2255 15.4956 14.9282 16.8192 13.7601" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M17.5 8C17.5 6.89543 16.6046 6 15.5 6C14.3954 6 13.5 6.89543 13.5 8C13.5 9.10457 14.3954 10 15.5 10C16.6046 10 17.5 9.10457 17.5 8Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M4 22L8 18M4 17L5.5 15.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg></button>
          <button type="button" class="ayy-icon-picker__option" data-value="target" data-keywords="goal" aria-label="Target" aria-pressed="false" title="Target"><svg class="ayy-icon" data-ayy-icon="target" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M17 12C17 14.7614 14.7614 17 12 17C9.23858 17 7 14.7614 7 12C7 9.23858 9.23858 7 12 7" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path><path d="M14 2.20004C13.3538 2.06886 12.6849 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 11.3151 21.9311 10.6462 21.8 10" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path><path d="M12.0303 11.9625L16.5832 7.4096M19.7404 4.34462L19.1872 2.35748C19.0853 2.03011 18.6914 1.89965 18.4259 2.11662C16.9898 3.29018 15.4254 4.87091 16.703 7.36419C19.2771 8.56455 20.7466 6.94584 21.8733 5.5853C22.0975 5.3146 21.9623 4.90767 21.6247 4.81005L19.7404 4.34462Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg></button>
          <button type="button" class="ayy-icon-picker__option" data-value="attachment" data-keywords="file" aria-label="Attachment" aria-pressed="false" title="Attachment"><svg class="ayy-icon" data-ayy-icon="paperclip" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5.82338 12L4.27922 10.4558C2.57359 8.75022 2.57359 5.98485 4.27922 4.27922C5.98485 2.57359 8.75022 2.57359 10.4558 4.27922L19.7208 13.5442C21.4264 15.2498 21.4264 18.0152 19.7208 19.7208C18.0152 21.4264 15.2498 21.4264 13.5442 19.7208L10.0698 16.2464C9.00379 15.1804 9.00379 13.4521 10.0698 12.386C11.1358 11.32 12.8642 11.32 13.9302 12.386L15.8604 14.3162" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg></button>
          <button type="button" class="ayy-icon-picker__option" data-value="lock" data-keywords="private" aria-label="Lock" aria-pressed="false" title="Lock"><svg class="ayy-icon" data-ayy-icon="lock" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" stroke-width="1.5"></path><path d="M12 13C13.1046 13 14 12.1046 14 11C14 9.89543 13.1046 9 12 9C10.8954 9 10 9.89543 10 11C10 12.1046 10.8954 13 12 13ZM12 13L12 16" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path></svg></button>
          <button type="button" class="ayy-icon-picker__option" data-value="bell" data-keywords="notification reminder" aria-label="Bell" aria-pressed="false" title="Bell"><svg class="ayy-icon" data-ayy-icon="bell" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M15.5 18C15.5 19.933 13.933 21.5 12 21.5C10.067 21.5 8.5 19.933 8.5 18" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M19.2311 18H4.76887C3.79195 18 3 17.208 3 16.2311C3 15.762 3.18636 15.3121 3.51809 14.9803L4.12132 14.3771C4.68393 13.8145 5 13.0514 5 12.2558V9.5C5 5.63401 8.13401 2.5 12 2.5C15.866 2.5 19 5.634 19 9.5V12.2558C19 13.0514 19.3161 13.8145 19.8787 14.3771L20.4819 14.9803C20.8136 15.3121 21 15.762 21 16.2311C21 17.208 20.208 18 19.2311 18Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg></button>
          <button type="button" class="ayy-icon-picker__option" data-value="bug" data-keywords="issue" aria-label="Bug" aria-pressed="false" title="Bug"><svg class="ayy-icon" data-ayy-icon="bug" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M3.01309 4.99084C2.89323 6.05084 3.55249 8.42285 6.48923 8.42285" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path><path d="M17.5951 8.38081C18.8357 8.57881 21.1132 7.49881 20.9957 5.00281" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path><path d="M20.9928 20.9989C21.0528 19.9429 20.1777 17.5549 17.599 17.4229" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path><path d="M6.45163 17.4708C5.65013 17.2308 3.01306 18.3348 3.01306 20.9988" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path><path d="M9.3299 6.11884C9.35388 5.09884 9.84533 2.99884 12.0029 2.99884C13.9208 2.99884 14.5861 4.61884 14.676 6.11884M6.26131 9.41884C6.38118 8.63884 7.29216 6.81484 9.36586 6.63484C11.4635 6.55564 14.3403 6.58684 14.8797 6.67084C15.5869 6.73377 17.2951 7.43884 17.7506 9.41884C17.9124 10.4388 17.8285 11.8788 17.8524 12.7188C17.8165 13.5588 17.9207 15.2623 17.7565 16.1388C17.6367 17.0988 16.9894 18.4668 16.1024 19.3068C14.7838 20.7228 11.1639 22.2108 8.03534 19.4508C6.41713 17.8908 6.30925 16.3788 6.18939 15.7788C6.15725 15.4571 6.15875 13.8763 6.16541 12.3588C6.14144 11.046 6.17235 9.78063 6.26131 9.41884Z" stroke="currentColor" stroke-width="1.5"></path><path d="M3.01306 12.8988H5.9498" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path><path d="M20.9929 12.8988L18.1161 12.8988" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path><path d="M12.0033 16.4988L12.0033 20.2788" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path></svg></button>
        </div>
      </div>
      <div class="ayy-icon-picker__section" role="group" aria-labelledby="icon-picker-basic-emoji">
        <p id="icon-picker-basic-emoji" class="ayy-icon-picker__label">Emoji</p>
        <div class="ayy-icon-picker__grid">
          <button type="button" class="ayy-icon-picker__option" data-value="⭐" data-keywords="favourite favorite important" aria-label="Star" aria-pressed="false" title="Star">⭐</button>
          <button type="button" class="ayy-icon-picker__option" data-value="🔥" data-keywords="hot trending" aria-label="Fire" aria-pressed="false" title="Fire">🔥</button>
          <button type="button" class="ayy-icon-picker__option" data-value="🚀" data-keywords="launch ship release" aria-label="Rocket" aria-pressed="false" title="Rocket">🚀</button>
          <button type="button" class="ayy-icon-picker__option" data-value="🎯" data-keywords="goal aim" aria-label="Target" aria-pressed="false" title="Target">🎯</button>
          <button type="button" class="ayy-icon-picker__option" data-value="💡" data-keywords="idea tip" aria-label="Light bulb" aria-pressed="false" title="Light bulb">💡</button>
          <button type="button" class="ayy-icon-picker__option" data-value="📌" data-keywords="pinned" aria-label="Pin" aria-pressed="false" title="Pin">📌</button>
          <button type="button" class="ayy-icon-picker__option" data-value="📅" data-keywords="date schedule" aria-label="Calendar" aria-pressed="false" title="Calendar">📅</button>
          <button type="button" class="ayy-icon-picker__option" data-value="⏰" data-keywords="time deadline due" aria-label="Alarm clock" aria-pressed="false" title="Alarm clock">⏰</button>
          <button type="button" class="ayy-icon-picker__option" data-value="✅" data-keywords="done complete yes" aria-label="Check mark" aria-pressed="false" title="Check mark">✅</button>
          <button type="button" class="ayy-icon-picker__option" data-value="❌" data-keywords="no cancel wrong" aria-label="Cross mark" aria-pressed="false" title="Cross mark">❌</button>
          <button type="button" class="ayy-icon-picker__option" data-value="⚠️" data-keywords="alert caution risk" aria-label="Warning" aria-pressed="false" title="Warning">⚠️</button>
          <button type="button" class="ayy-icon-picker__option" data-value="❓" data-keywords="help unknown" aria-label="Question mark" aria-pressed="false" title="Question mark">❓</button>
          <button type="button" class="ayy-icon-picker__option" data-value="💰" data-keywords="revenue price cost budget" aria-label="Money bag" aria-pressed="false" title="Money bag">💰</button>
          <button type="button" class="ayy-icon-picker__option" data-value="📈" data-keywords="growth trend up" aria-label="Chart increasing" aria-pressed="false" title="Chart increasing">📈</button>
          <button type="button" class="ayy-icon-picker__option" data-value="📉" data-keywords="decline trend down" aria-label="Chart decreasing" aria-pressed="false" title="Chart decreasing">📉</button>
          <button type="button" class="ayy-icon-picker__option" data-value="📊" data-keywords="stats report analytics" aria-label="Bar chart" aria-pressed="false" title="Bar chart">📊</button>
          <button type="button" class="ayy-icon-picker__option" data-value="🏷️" data-keywords="tag category" aria-label="Label" aria-pressed="false" title="Label">🏷️</button>
          <button type="button" class="ayy-icon-picker__option" data-value="📝" data-keywords="note text write" aria-label="Memo" aria-pressed="false" title="Memo">📝</button>
          <button type="button" class="ayy-icon-picker__option" data-value="📁" data-keywords="files project" aria-label="Folder" aria-pressed="false" title="Folder">📁</button>
          <button type="button" class="ayy-icon-picker__option" data-value="📎" data-keywords="attachment file" aria-label="Paperclip" aria-pressed="false" title="Paperclip">📎</button>
          <button type="button" class="ayy-icon-picker__option" data-value="🔗" data-keywords="url chain" aria-label="Link" aria-pressed="false" title="Link">🔗</button>
          <button type="button" class="ayy-icon-picker__option" data-value="🔒" data-keywords="private secure" aria-label="Lock" aria-pressed="false" title="Lock">🔒</button>
          <button type="button" class="ayy-icon-picker__option" data-value="👤" data-keywords="user owner contact" aria-label="Person" aria-pressed="false" title="Person">👤</button>
          <button type="button" class="ayy-icon-picker__option" data-value="👥" data-keywords="team users group" aria-label="People" aria-pressed="false" title="People">👥</button>
          <button type="button" class="ayy-icon-picker__option" data-value="🏢" data-keywords="company account business" aria-label="Office building" aria-pressed="false" title="Office building">🏢</button>
          <button type="button" class="ayy-icon-picker__option" data-value="🌍" data-keywords="world region country" aria-label="Globe" aria-pressed="false" title="Globe">🌍</button>
          <button type="button" class="ayy-icon-picker__option" data-value="📍" data-keywords="place address map" aria-label="Location" aria-pressed="false" title="Location">📍</button>
          <button type="button" class="ayy-icon-picker__option" data-value="📧" data-keywords="mail message" aria-label="Email" aria-pressed="false" title="Email">📧</button>
          <button type="button" class="ayy-icon-picker__option" data-value="📞" data-keywords="call contact" aria-label="Phone" aria-pressed="false" title="Phone">📞</button>
          <button type="button" class="ayy-icon-picker__option" data-value="💬" data-keywords="comment chat message" aria-label="Speech bubble" aria-pressed="false" title="Speech bubble">💬</button>
          <button type="button" class="ayy-icon-picker__option" data-value="🔔" data-keywords="notification reminder" aria-label="Bell" aria-pressed="false" title="Bell">🔔</button>
          <button type="button" class="ayy-icon-picker__option" data-value="🎉" data-keywords="celebrate win" aria-label="Party popper" aria-pressed="false" title="Party popper">🎉</button>
          <button type="button" class="ayy-icon-picker__option" data-value="❤️" data-keywords="love like" aria-label="Red heart" aria-pressed="false" title="Red heart">❤️</button>
          <button type="button" class="ayy-icon-picker__option" data-value="👍" data-keywords="approve like yes" aria-label="Thumbs up" aria-pressed="false" title="Thumbs up">👍</button>
          <button type="button" class="ayy-icon-picker__option" data-value="🐛" data-keywords="issue defect" aria-label="Bug" aria-pressed="false" title="Bug">🐛</button>
          <button type="button" class="ayy-icon-picker__option" data-value="🛠️" data-keywords="settings build fix" aria-label="Tools" aria-pressed="false" title="Tools">🛠️</button>
          <button type="button" class="ayy-icon-picker__option" data-value="🧪" data-keywords="experiment test beta" aria-label="Test tube" aria-pressed="false" title="Test tube">🧪</button>
          <button type="button" class="ayy-icon-picker__option" data-value="📦" data-keywords="box product shipping" aria-label="Package" aria-pressed="false" title="Package">📦</button>
          <button type="button" class="ayy-icon-picker__option" data-value="🟢" data-keywords="status active ok" aria-label="Green circle" aria-pressed="false" title="Green circle">🟢</button>
          <button type="button" class="ayy-icon-picker__option" data-value="🟡" data-keywords="status pending" aria-label="Yellow circle" aria-pressed="false" title="Yellow circle">🟡</button>
          <button type="button" class="ayy-icon-picker__option" data-value="🔴" data-keywords="status blocked error" aria-label="Red circle" aria-pressed="false" title="Red circle">🔴</button>
          <button type="button" class="ayy-icon-picker__option" data-value="⚪" data-keywords="status empty" aria-label="White circle" aria-pressed="false" title="White circle">⚪</button>
        </div>
      </div>
      <p class="ayy-icon-picker__empty" role="status" hidden>No icons found</p>
    </div>
  </div>
</ayy-icon-picker>
```

React:

```tsx
import { useState } from "react";
import { IconPicker, type IconPickerIcon } from "@danitesler/ayywi/react";
import {
  Attachment01Icon,
  Briefcase01Icon,
  Bug01Icon,
  Building03Icon,
  Calendar03Icon,
  Call02Icon,
  ChartIncreaseIcon,
  CheckmarkCircle02Icon,
  Clock01Icon,
  DollarCircleIcon,
  Flag01Icon,
  Folder01Icon,
  Globe02Icon,
  Link01Icon,
  Location01Icon,
  LockIcon,
  Mail01Icon,
  Notification01Icon,
  Rocket01Icon,
  StarIcon,
  Tag01Icon,
  Target02Icon,
  TextIcon,
  UserIcon,
} from "@hugeicons/core-free-icons";

const icons: IconPickerIcon[] = [
  { value: "star", label: "Star", icon: StarIcon, name: "star", keywords: ["favourite", "important"] },
  { value: "tag", label: "Tag", icon: Tag01Icon, name: "tag", keywords: ["label", "category"] },
  { value: "calendar", label: "Calendar", icon: Calendar03Icon, name: "calendar", keywords: ["date"] },
  { value: "text", label: "Text", icon: TextIcon, name: "text", keywords: ["note"] },
  { value: "folder", label: "Folder", icon: Folder01Icon, name: "folder", keywords: ["project"] },
  { value: "flag", label: "Flag", icon: Flag01Icon, name: "flag", keywords: ["priority"] },
  { value: "dollar", label: "Dollar", icon: DollarCircleIcon, name: "circle-dollar-sign", keywords: ["money", "revenue", "price"] },
  { value: "chart", label: "Chart", icon: ChartIncreaseIcon, name: "trending-up", keywords: ["growth", "trend"] },
  { value: "user", label: "User", icon: UserIcon, name: "user", keywords: ["person", "owner"] },
  { value: "company", label: "Company", icon: Building03Icon, name: "building", keywords: ["account", "office"] },
  { value: "work", label: "Briefcase", icon: Briefcase01Icon, name: "briefcase", keywords: ["work", "job"] },
  { value: "mail", label: "Mail", icon: Mail01Icon, name: "mail", keywords: ["email"] },
  { value: "phone", label: "Phone", icon: Call02Icon, name: "phone", keywords: ["call"] },
  { value: "link", label: "Link", icon: Link01Icon, name: "link", keywords: ["url"] },
  { value: "done", label: "Done", icon: CheckmarkCircle02Icon, name: "circle-check", keywords: ["check", "complete"] },
  { value: "clock", label: "Clock", icon: Clock01Icon, name: "clock", keywords: ["time", "due"] },
  { value: "location", label: "Location", icon: Location01Icon, name: "map-pin", keywords: ["place", "address"] },
  { value: "globe", label: "Globe", icon: Globe02Icon, name: "globe", keywords: ["region", "world"] },
  { value: "rocket", label: "Rocket", icon: Rocket01Icon, name: "rocket-launch", keywords: ["launch"] },
  { value: "target", label: "Target", icon: Target02Icon, name: "target", keywords: ["goal"] },
  { value: "attachment", label: "Attachment", icon: Attachment01Icon, name: "paperclip", keywords: ["file"] },
  { value: "lock", label: "Lock", icon: LockIcon, name: "lock", keywords: ["private"] },
  { value: "bell", label: "Bell", icon: Notification01Icon, name: "bell", keywords: ["notification", "reminder"] },
  { value: "bug", label: "Bug", icon: Bug01Icon, name: "bug", keywords: ["issue"] },
];

export default function Example() {
  const [icon, setIcon] = useState("star");
  return <IconPicker value={icon} onValueChange={setIcon} icons={icons} />;
}
```

## Icon picker — From a button in a popover

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<!-- Picking closes the popover (the picker fires ayy-pick). Listen for ayy-change on <ayy-icon-picker> to redraw the trigger. -->
<div class="ayy-cluster">
  <ayy-popover align="start">
    <ayy-tooltip class="ayy-tooltip">
      <button type="button" class="ayy-button ayy-button--outline ayy-button--icon" popovertarget="icon-picker-popover" aria-haspopup="dialog" aria-label="Project icon">🚀</button>
      <span class="ayy-tooltip__content" role="tooltip">Project icon</span>
    </ayy-tooltip>
    <div class="ayy-popover" id="icon-picker-popover" popover role="dialog" aria-label="Project icon">
      <ayy-icon-picker value="🚀">
        <div class="ayy-icon-picker">
          <div class="ayy-icon-picker__header">
            <input type="search" class="ayy-input ayy-input--sm ayy-icon-picker__search" aria-label="Search icons" placeholder="Search icons" autocomplete="off" spellcheck="false"/>
            <button type="button" class="ayy-button ayy-button--ghost ayy-button--sm ayy-icon-picker__remove">Remove</button>
          </div>
          <div class="ayy-icon-picker__body">
            <div class="ayy-icon-picker__section" role="group" aria-labelledby="icon-picker-popover-icons">
              <p id="icon-picker-popover-icons" class="ayy-icon-picker__label">Icons</p>
              <div class="ayy-icon-picker__grid">
                <button type="button" class="ayy-icon-picker__option" data-value="folder" aria-label="Folder" aria-pressed="false" title="Folder"><svg class="ayy-icon" data-ayy-icon="folder" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M8 7H16.75C18.8567 7 19.91 7 20.6667 7.50559C20.9943 7.72447 21.2755 8.00572 21.4944 8.33329C22 9.08996 22 10.1433 22 12.25C22 15.7612 22 17.5167 21.1573 18.7779C20.7926 19.3238 20.3238 19.7926 19.7779 20.1573C18.5167 21 16.7612 21 13.25 21H12C7.28595 21 4.92893 21 3.46447 19.5355C2 18.0711 2 15.714 2 11V7.94427C2 6.1278 2 5.21956 2.38032 4.53806C2.65142 4.05227 3.05227 3.65142 3.53806 3.38032C4.21956 3 5.1278 3 6.94427 3C8.10802 3 8.6899 3 9.19926 3.19101C10.3622 3.62712 10.8418 4.68358 11.3666 5.73313L12 7" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path></svg></button>
                <button type="button" class="ayy-icon-picker__option" data-value="rocket" data-keywords="launch" aria-label="Rocket" aria-pressed="false" title="Rocket"><svg class="ayy-icon" data-ayy-icon="rocket-launch" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6.21875 11.618L3.31189 11.2378C2.71644 11.1606 2.31883 10.5841 2.58348 10.0458C3.42523 8.33365 5.6195 6.35437 9.73988 6.68079M6.21875 11.618C7.27445 9.85426 8.57175 8.00435 9.73988 6.68079M6.21875 11.618L11.882 17.2812M9.73988 6.68079C13.4105 2.58986 17.1745 1.728 19.5937 2.06685C20.5508 2.2009 21.2991 2.94917 21.4332 3.90626C21.772 6.32551 20.9101 10.0895 16.8192 13.7601M11.882 17.2812L12.2622 20.1881C12.3394 20.7836 12.9159 21.1812 13.4542 20.9165C15.1664 20.0748 17.1456 17.8805 16.8192 13.7601M11.882 17.2812C13.6457 16.2255 15.4956 14.9282 16.8192 13.7601" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M17.5 8C17.5 6.89543 16.6046 6 15.5 6C14.3954 6 13.5 6.89543 13.5 8C13.5 9.10457 14.3954 10 15.5 10C16.6046 10 17.5 9.10457 17.5 8Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M4 22L8 18M4 17L5.5 15.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg></button>
                <button type="button" class="ayy-icon-picker__option" data-value="target" data-keywords="goal" aria-label="Target" aria-pressed="false" title="Target"><svg class="ayy-icon" data-ayy-icon="target" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M17 12C17 14.7614 14.7614 17 12 17C9.23858 17 7 14.7614 7 12C7 9.23858 9.23858 7 12 7" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path><path d="M14 2.20004C13.3538 2.06886 12.6849 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 11.3151 21.9311 10.6462 21.8 10" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path><path d="M12.0303 11.9625L16.5832 7.4096M19.7404 4.34462L19.1872 2.35748C19.0853 2.03011 18.6914 1.89965 18.4259 2.11662C16.9898 3.29018 15.4254 4.87091 16.703 7.36419C19.2771 8.56455 20.7466 6.94584 21.8733 5.5853C22.0975 5.3146 21.9623 4.90767 21.6247 4.81005L19.7404 4.34462Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg></button>
                <button type="button" class="ayy-icon-picker__option" data-value="star" aria-label="Star" aria-pressed="false" title="Star"><svg class="ayy-icon" data-ayy-icon="star" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M13.7276 3.44418L15.4874 6.99288C15.7274 7.48687 16.3673 7.9607 16.9073 8.05143L20.0969 8.58575C22.1367 8.92853 22.6167 10.4206 21.1468 11.8925L18.6671 14.3927C18.2471 14.8161 18.0172 15.6327 18.1471 16.2175L18.8571 19.3125C19.417 21.7623 18.1271 22.71 15.9774 21.4296L12.9877 19.6452C12.4478 19.3226 11.5579 19.3226 11.0079 19.6452L8.01827 21.4296C5.8785 22.71 4.57865 21.7522 5.13859 19.3125L5.84851 16.2175C5.97849 15.6327 5.74852 14.8161 5.32856 14.3927L2.84884 11.8925C1.389 10.4206 1.85895 8.92853 3.89872 8.58575L7.08837 8.05143C7.61831 7.9607 8.25824 7.48687 8.49821 6.99288L10.258 3.44418C11.2179 1.51861 12.7777 1.51861 13.7276 3.44418Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg></button>
              </div>
            </div>
            <div class="ayy-icon-picker__section" role="group" aria-labelledby="icon-picker-popover-emoji">
              <p id="icon-picker-popover-emoji" class="ayy-icon-picker__label">Emoji</p>
              <div class="ayy-icon-picker__grid">
                <button type="button" class="ayy-icon-picker__option" data-value="⭐" data-keywords="favourite favorite important" aria-label="Star" aria-pressed="false" title="Star">⭐</button>
                <button type="button" class="ayy-icon-picker__option" data-value="🔥" data-keywords="hot trending" aria-label="Fire" aria-pressed="false" title="Fire">🔥</button>
                <button type="button" class="ayy-icon-picker__option" data-value="🚀" data-keywords="launch ship release" aria-label="Rocket" aria-pressed="true" title="Rocket">🚀</button>
                <button type="button" class="ayy-icon-picker__option" data-value="🎯" data-keywords="goal aim" aria-label="Target" aria-pressed="false" title="Target">🎯</button>
                <button type="button" class="ayy-icon-picker__option" data-value="💡" data-keywords="idea tip" aria-label="Light bulb" aria-pressed="false" title="Light bulb">💡</button>
                <button type="button" class="ayy-icon-picker__option" data-value="📌" data-keywords="pinned" aria-label="Pin" aria-pressed="false" title="Pin">📌</button>
                <button type="button" class="ayy-icon-picker__option" data-value="📅" data-keywords="date schedule" aria-label="Calendar" aria-pressed="false" title="Calendar">📅</button>
                <button type="button" class="ayy-icon-picker__option" data-value="⏰" data-keywords="time deadline due" aria-label="Alarm clock" aria-pressed="false" title="Alarm clock">⏰</button>
                <button type="button" class="ayy-icon-picker__option" data-value="✅" data-keywords="done complete yes" aria-label="Check mark" aria-pressed="false" title="Check mark">✅</button>
                <button type="button" class="ayy-icon-picker__option" data-value="❌" data-keywords="no cancel wrong" aria-label="Cross mark" aria-pressed="false" title="Cross mark">❌</button>
                <button type="button" class="ayy-icon-picker__option" data-value="⚠️" data-keywords="alert caution risk" aria-label="Warning" aria-pressed="false" title="Warning">⚠️</button>
                <button type="button" class="ayy-icon-picker__option" data-value="❓" data-keywords="help unknown" aria-label="Question mark" aria-pressed="false" title="Question mark">❓</button>
                <button type="button" class="ayy-icon-picker__option" data-value="💰" data-keywords="revenue price cost budget" aria-label="Money bag" aria-pressed="false" title="Money bag">💰</button>
                <button type="button" class="ayy-icon-picker__option" data-value="📈" data-keywords="growth trend up" aria-label="Chart increasing" aria-pressed="false" title="Chart increasing">📈</button>
                <button type="button" class="ayy-icon-picker__option" data-value="📉" data-keywords="decline trend down" aria-label="Chart decreasing" aria-pressed="false" title="Chart decreasing">📉</button>
                <button type="button" class="ayy-icon-picker__option" data-value="📊" data-keywords="stats report analytics" aria-label="Bar chart" aria-pressed="false" title="Bar chart">📊</button>
                <button type="button" class="ayy-icon-picker__option" data-value="🏷️" data-keywords="tag category" aria-label="Label" aria-pressed="false" title="Label">🏷️</button>
                <button type="button" class="ayy-icon-picker__option" data-value="📝" data-keywords="note text write" aria-label="Memo" aria-pressed="false" title="Memo">📝</button>
                <button type="button" class="ayy-icon-picker__option" data-value="📁" data-keywords="files project" aria-label="Folder" aria-pressed="false" title="Folder">📁</button>
                <button type="button" class="ayy-icon-picker__option" data-value="📎" data-keywords="attachment file" aria-label="Paperclip" aria-pressed="false" title="Paperclip">📎</button>
                <button type="button" class="ayy-icon-picker__option" data-value="🔗" data-keywords="url chain" aria-label="Link" aria-pressed="false" title="Link">🔗</button>
                <button type="button" class="ayy-icon-picker__option" data-value="🔒" data-keywords="private secure" aria-label="Lock" aria-pressed="false" title="Lock">🔒</button>
                <button type="button" class="ayy-icon-picker__option" data-value="👤" data-keywords="user owner contact" aria-label="Person" aria-pressed="false" title="Person">👤</button>
                <button type="button" class="ayy-icon-picker__option" data-value="👥" data-keywords="team users group" aria-label="People" aria-pressed="false" title="People">👥</button>
                <button type="button" class="ayy-icon-picker__option" data-value="🏢" data-keywords="company account business" aria-label="Office building" aria-pressed="false" title="Office building">🏢</button>
                <button type="button" class="ayy-icon-picker__option" data-value="🌍" data-keywords="world region country" aria-label="Globe" aria-pressed="false" title="Globe">🌍</button>
                <button type="button" class="ayy-icon-picker__option" data-value="📍" data-keywords="place address map" aria-label="Location" aria-pressed="false" title="Location">📍</button>
                <button type="button" class="ayy-icon-picker__option" data-value="📧" data-keywords="mail message" aria-label="Email" aria-pressed="false" title="Email">📧</button>
                <button type="button" class="ayy-icon-picker__option" data-value="📞" data-keywords="call contact" aria-label="Phone" aria-pressed="false" title="Phone">📞</button>
                <button type="button" class="ayy-icon-picker__option" data-value="💬" data-keywords="comment chat message" aria-label="Speech bubble" aria-pressed="false" title="Speech bubble">💬</button>
                <button type="button" class="ayy-icon-picker__option" data-value="🔔" data-keywords="notification reminder" aria-label="Bell" aria-pressed="false" title="Bell">🔔</button>
                <button type="button" class="ayy-icon-picker__option" data-value="🎉" data-keywords="celebrate win" aria-label="Party popper" aria-pressed="false" title="Party popper">🎉</button>
                <button type="button" class="ayy-icon-picker__option" data-value="❤️" data-keywords="love like" aria-label="Red heart" aria-pressed="false" title="Red heart">❤️</button>
                <button type="button" class="ayy-icon-picker__option" data-value="👍" data-keywords="approve like yes" aria-label="Thumbs up" aria-pressed="false" title="Thumbs up">👍</button>
                <button type="button" class="ayy-icon-picker__option" data-value="🐛" data-keywords="issue defect" aria-label="Bug" aria-pressed="false" title="Bug">🐛</button>
                <button type="button" class="ayy-icon-picker__option" data-value="🛠️" data-keywords="settings build fix" aria-label="Tools" aria-pressed="false" title="Tools">🛠️</button>
                <button type="button" class="ayy-icon-picker__option" data-value="🧪" data-keywords="experiment test beta" aria-label="Test tube" aria-pressed="false" title="Test tube">🧪</button>
                <button type="button" class="ayy-icon-picker__option" data-value="📦" data-keywords="box product shipping" aria-label="Package" aria-pressed="false" title="Package">📦</button>
                <button type="button" class="ayy-icon-picker__option" data-value="🟢" data-keywords="status active ok" aria-label="Green circle" aria-pressed="false" title="Green circle">🟢</button>
                <button type="button" class="ayy-icon-picker__option" data-value="🟡" data-keywords="status pending" aria-label="Yellow circle" aria-pressed="false" title="Yellow circle">🟡</button>
                <button type="button" class="ayy-icon-picker__option" data-value="🔴" data-keywords="status blocked error" aria-label="Red circle" aria-pressed="false" title="Red circle">🔴</button>
                <button type="button" class="ayy-icon-picker__option" data-value="⚪" data-keywords="status empty" aria-label="White circle" aria-pressed="false" title="White circle">⚪</button>
              </div>
            </div>
            <p class="ayy-icon-picker__empty" role="status" hidden>No icons found</p>
          </div>
      </ayy-icon-picker>
    </div>
  </ayy-popover>
  <span class="ayy-h6">Q3 launch</span>
</div>
```

React:

```tsx
import { useState } from "react";
import { Icon, IconPicker, Popover, PopoverContent, PopoverTrigger, type IconPickerIcon } from "@danitesler/ayywi/react";
import { Folder01Icon, Rocket01Icon, StarIcon, Target02Icon } from "@hugeicons/core-free-icons";

const icons: IconPickerIcon[] = [
  { value: "folder", label: "Folder", icon: Folder01Icon, name: "folder" },
  { value: "rocket", label: "Rocket", icon: Rocket01Icon, name: "rocket-launch", keywords: ["launch"] },
  { value: "target", label: "Target", icon: Target02Icon, name: "target", keywords: ["goal"] },
  { value: "star", label: "Star", icon: StarIcon, name: "star" },
];

export default function Example() {
  const [icon, setIcon] = useState("🚀");
  const picked = icons.find((item) => item.value === icon);
  return (
    <div className="ayy-cluster">
      <Popover>
        <PopoverTrigger variant="outline" size="icon" aria-label="Project icon">
          {picked ? <Icon icon={picked.icon as typeof StarIcon} name={picked.name} /> : icon || <Icon icon={Folder01Icon} name="folder" />}
        </PopoverTrigger>
        <PopoverContent align="start" aria-label="Project icon">
          <IconPicker value={icon} onValueChange={setIcon} icons={icons} />
        </PopoverContent>
      </Popover>
      <span className="ayy-h6">Q3 launch</span>
    </div>
  );
}
```

---
Part of @danitesler/ayywi 0.1.2: load `dist/ayywi.min.css` (and `dist/elements.global.js` for the <ayy-*> elements). The rules every screen follows: [llms-full.txt#rules](../llms-full.txt#rules). Every component: [llms.txt](../llms.txt).
