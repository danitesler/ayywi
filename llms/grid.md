# Grid

Category: Data display. A grid of cards that can be selected, for media, projects, posts and records. It combines card selection, quick actions on each item and a select-all control, and works with the Action bar. Also called: data-grid, card-grid, media-grid, asset-grid, gallery-grid, tile-grid.

**Classes**
- `.ayy-grid-wrap` — Stack wrapper grouping the grid toolbar, the card grid and the floating Action bar.
- `.ayy-grid__toolbar` — Header bar above the grid holding the select-all checkbox, count and sorting or view controls.
- `.ayy-grid__select-all` — Labelled select-all checkbox control in the grid toolbar.
- `.ayy-grid` — Responsive CSS grid container: as many card columns of at least --ayy-min (16rem) as fit.
- `.ayy-grid--compact` — Dense variant (--ayy-min: 13rem, tighter gap and card padding) for media libraries and directories.
- `.ayy-grid__item` — Selectable record card (<article>). Highlights with a 2px text-colour border and tint when aria-selected="true".
- `.ayy-grid__media` — Top preview frame for images, screenshots, social post visuals or video thumbnails. Floating glass corners when .ayy-grid__select or .ayy-grid__actions sit inside.
- `.ayy-grid__header` — Top block of the card holding the checkbox, avatar/icon, title, description and item actions.
- `.ayy-grid__select` — Wrapper for the card's selection Checkbox (inline in the header or floating in the top-start corner of .ayy-grid__media).
- `.ayy-grid__actions` — Cluster of quick action buttons (Edit, Copy) and the ⋯ DropdownMenu trigger (inline in the header or floating in the top-end corner of .ayy-grid__media).
- `.ayy-grid__actions--reveal` — Reveals item actions when the card is hovered, focused within, selected or has an open menu (stays visible on touch screens).
- `.ayy-grid__title` — Card heading (<h3>).
- `.ayy-grid__description` — Muted subtitle, handle or supporting metadata line.
- `.ayy-grid__body` — Card body content between header and footer.
- `.ayy-grid__footer` — Bottom bar for status Badges, timestamps or avatars, pinned to the bottom of stretched cards.

**States**
- `default` — Responsive grid of surface cards with line borders, rest shadow, optional top media preview, header, body and hairline footer.
- `hover` (`.ayy-grid__item:hover`) — Card border turns line-hover and reveals .ayy-grid__actions--reveal.
- `pressed` — doesn't apply: No pressed look; clicking a selectable card or its checkbox toggles selection on release.
- `focus` (`.ayy-grid__item:focus-within`) — Reveals .ayy-grid__actions--reveal while any checkbox, button or menu trigger inside the card has keyboard focus.
- `disabled` — doesn't apply: Cards aren't disabled; disable the controls inside them.
- `selected` (`.ayy-grid__item[aria-selected="true"] (with a Checkbox in .ayy-grid__select)`) — Text-colour border plus a 1px ring and a 4% text tint over the surface. Forced colours: Highlight outline.
- `error` — doesn't apply: Show a failed load as an Alert with a retry instead of the grid.
- `loading` — doesn't apply: No loading look; render Skeleton cards in the grid layout with aria-busy on the container.

**Sizes**
- Density — Card padding is fixed (16px, 12px when compact); checkboxes and action buttons inside follow data-density.
- Width — Fills its container with auto-fitting columns at least --ayy-min wide (16rem default, 13rem compact).

**Custom element** `<ayy-grid>` (@danitesler/ayywi/elements) — 
- event `ayy-selection-change`: { items } — the selected .ayy-grid__item elements.

**React** — `import { GridWrap, GridToolbar, GridSelectAll, Grid, GridItem, GridItemMedia, GridItemHeader, GridItemSelect, GridItemActions, GridItemTitle, GridItemDescription, GridItemBody, GridItemFooter } from "@danitesler/ayywi/react";`
- `<GridWrap>` renders <div class="ayy-grid-wrap">. Props: 
- `<GridToolbar>` renders <div class="ayy-grid__toolbar">. Props: 
- `<GridSelectAll>` renders <label class="ayy-grid__select-all">. Props: 
- `<Grid>` renders <div class="ayy-grid">. Props: `compact` boolean — denser cards and 13rem minimum column width; `min` string — minimum column width (--ayy-min, default "16rem")
- `<GridItem>` renders <article class="ayy-grid__item">. Props: `selected` boolean — sets aria-selected; `onSelectedChange` (selected: boolean) => void — toggles selection when the card body is clicked
- `<GridItemMedia>` renders <div class="ayy-grid__media">. Props: 
- `<GridItemHeader>` renders <div class="ayy-grid__header">. Props: 
- `<GridItemSelect>` renders <div class="ayy-grid__select">. Props: 
- `<GridItemActions>` renders <div class="ayy-grid__actions">. Props: `reveal` boolean — reveal on card hover, focus-within or selection (stays visible on touch)
- `<GridItemTitle>` renders <h3 class="ayy-grid__title">. Props: 
- `<GridItemDescription>` renders <p class="ayy-grid__description">. Props: 
- `<GridItemBody>` renders <div class="ayy-grid__body">. Props: 
- `<GridItemFooter>` renders <div class="ayy-grid__footer">. Props: 

**Accessibility**
- Each selectable card contains a native Checkbox in GridItemSelect with an aria-label naming the item ("Select Hero screenshot").
- Selected cards carry aria-selected="true" and a 2px border (Highlight outline in High Contrast mode), never colour alone.
- Per-card icon buttons and ⋯ DropdownMenu triggers carry an aria-label naming the item ("More actions for Hero screenshot").
- GridItemActions with reveal uses opacity so controls remain in the Tab order and become visible on :focus-within.

**Do**
- Use Grid when items are browsed visually or as cards — media assets, screenshots, social media posts, projects and user records — and need multi-select and per-item actions like a Table.
- Put GridItemSelect and GridItemActions inside GridItemMedia for visual cards (screenshots, media, social posts), or inside GridItemHeader for record cards (projects, users).
- Provide a ⋯ DropdownMenu on each card for targeted secondary actions (Edit, Duplicate, Copy, Archive, Delete) and an ActionBar at the bottom for bulk actions on selected cards.

**Don't**
- Don't use Grid for static marketing feature tiles that aren't selectable records — use plain Cards in an .ayy-grid layout.
- Don't use Grid for single-choice form inputs (like picking a pricing plan) — use ChoiceCard.
- Don't hide the selection checkbox on selected cards.

## Grid — Media assets, screenshots and social posts

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<!-- <ayy-grid> manages card selection (including Shift+Click range selection) and syncs with the sibling <ayy-action-bar>. -->
<ayy-grid>
  <div class="ayy-grid-wrap"><div class="ayy-grid__toolbar"><label class="ayy-grid__select-all"><input type="checkbox" class="ayy-checkbox" aria-label="Select all media assets"/><span>2 of 3 selected</span></label></div><div class="ayy-grid"><article aria-selected="true" class="ayy-grid__item" style="--ayy-spot:var(--ayy-accent-product)"><div class="ayy-grid__media ayy-bg-grid"><div class="ayy-grid__select"><input type="checkbox" class="ayy-checkbox" aria-label="Select Dashboard dark mode screenshot" checked=""/></div><span class="ayy-icon-tile ayy-icon-tile--lg" aria-hidden="true"><svg class="ayy-icon ayy-icon--lg" data-ayy-icon="image" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="7.5" cy="7.5" r="1.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></circle><path d="M2.5 12C2.5 7.52166 2.5 5.28249 3.89124 3.89124C5.28249 2.5 7.52166 2.5 12 2.5C16.4783 2.5 18.7175 2.5 20.1088 3.89124C21.5 5.28249 21.5 7.52166 21.5 12C21.5 16.4783 21.5 18.7175 20.1088 20.1088C18.7175 21.5 16.4783 21.5 12 21.5C7.52166 21.5 5.28249 21.5 3.89124 20.1088C2.5 18.7175 2.5 16.4783 2.5 12Z" stroke="currentColor" stroke-width="1.5"></path><path d="M5 21C9.37246 15.775 14.2741 8.88406 21.4975 13.5424" stroke="currentColor" stroke-width="1.5"></path></svg></span><div class="ayy-grid__actions"><button type="button" class="ayy-button ayy-button--ghost ayy-button--icon-sm" aria-label="Copy Dashboard dark mode screenshot"><svg class="ayy-icon" data-ayy-icon="square-link" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M14.5563 13.2183C13.514 14.2606 11.8241 14.2606 10.7817 13.2183C9.73942 12.1759 9.73942 10.486 10.7817 9.44364L13.1409 7.0845C14.1357 6.08961 15.7206 6.04433 16.7692 6.94866M16.4437 3.78175C17.486 2.73942 19.1759 2.73942 20.2183 3.78175C21.2606 4.82408 21.2606 6.51403 20.2183 7.55636L17.8591 9.9155C16.8643 10.9104 15.2794 10.9557 14.2308 10.0513" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M10.4999 3C7.21257 3 5.56889 3 4.46256 3.9079C4.25998 4.07414 4.07423 4.25989 3.90798 4.46247C3.00007 5.56879 3.00006 7.21247 3.00002 10.4998L3 12.9999C2.99996 16.7712 2.99995 18.6568 4.17152 19.8284C5.3431 21 7.22873 21 11 21H13.4999C16.7874 21 18.4311 21 19.5375 20.092C19.74 19.9258 19.9257 19.7401 20.092 19.5376C20.9999 18.4312 20.9999 16.7875 20.9999 13.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg></button><ayy-menu><button type="button" class="ayy-button ayy-button--ghost ayy-button--icon-sm" aria-haspopup="menu" aria-label="More actions for Dashboard dark mode screenshot"><svg class="ayy-icon" data-ayy-icon="ellipsis" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6.00449 12.5V12M18.0045 12.5V12M12.0045 12.5V12M7.00449 12.5C7.00449 11.9477 6.55677 11.5 6.00449 11.5C5.4522 11.5 5.00449 11.9477 5.00449 12.5C5.00449 13.0523 5.4522 13.5 6.00449 13.5C6.55677 13.5 7.00449 13.0523 7.00449 12.5ZM19.0045 12.5C19.0045 11.9477 18.5568 11.5 18.0045 11.5C17.4522 11.5 17.0045 11.9477 17.0045 12.5C17.0045 13.0523 17.4522 13.5 18.0045 13.5C18.5568 13.5 19.0045 13.0523 19.0045 12.5ZM13.0045 12.5C13.0045 11.9477 12.5568 11.5 12.0045 11.5C11.4522 11.5 11.0045 11.9477 11.0045 12.5C11.0045 13.0523 11.4522 13.5 12.0045 13.5C12.5568 13.5 13.0045 13.0523 13.0045 12.5Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg></button><div id="_R_mm_" role="menu" class="ayy-menu" popover="auto"><div role="presentation" class="ayy-menu__label">Dashboard dark mode screenshot</div><button type="button" role="menuitem" tabindex="-1" class="ayy-menu__item"><svg class="ayy-icon" data-ayy-icon="square-pen" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M16.4249 4.60509L17.4149 3.6151C18.2351 2.79497 19.5648 2.79497 20.3849 3.6151C21.205 4.43524 21.205 5.76493 20.3849 6.58507L19.3949 7.57506M16.4249 4.60509L9.76558 11.2644C9.25807 11.772 8.89804 12.4078 8.72397 13.1041L8 16L10.8959 15.276C11.5922 15.102 12.228 14.7419 12.7356 14.2344L19.3949 7.57506M16.4249 4.60509L19.3949 7.57506" stroke="currentColor" stroke-linejoin="round" stroke-width="1.5"></path><path d="M18.9999 13.5C18.9999 16.7875 18.9999 18.4312 18.092 19.5376C17.9258 19.7401 17.7401 19.9258 17.5375 20.092C16.4312 21 14.7874 21 11.4999 21H11C7.22876 21 5.34316 21 4.17159 19.8284C3.00003 18.6569 3 16.7712 3 13V12.5C3 9.21252 3 7.56879 3.90794 6.46244C4.07417 6.2599 4.2599 6.07417 4.46244 5.90794C5.56879 5 7.21252 5 10.5 5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg>Edit details</button><button type="button" role="menuitem" tabindex="-1" class="ayy-menu__item"><svg class="ayy-icon" data-ayy-icon="copy" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7.5 14.5C7.5 11.2002 7.5 9.55025 8.52513 8.52513C9.55025 7.5 11.2002 7.5 14.5 7.5C17.7998 7.5 19.4497 7.5 20.4749 8.52513C21.5 9.55025 21.5 11.2002 21.5 14.5C21.5 17.7998 21.5 19.4497 20.4749 20.4749C19.4497 21.5 17.7998 21.5 14.5 21.5C11.2002 21.5 9.55025 21.5 8.52513 20.4749C7.5 19.4497 7.5 17.7998 7.5 14.5Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M7.5 16.5C6.10355 16.5 5.40533 16.5 4.84402 16.3036C3.83866 15.9518 3.0482 15.1613 2.69641 14.156C2.5 13.5947 2.5 12.8964 2.5 11.5V9.5C2.5 6.20017 2.5 4.55025 3.52513 3.52513C4.55025 2.5 6.20017 2.5 9.5 2.5H11.5C12.8964 2.5 13.5947 2.5 14.156 2.69641C15.1613 3.0482 15.9518 3.83866 16.3036 4.84402C16.5 5.40533 16.5 6.10355 16.5 7.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg>Duplicate<span class="ayy-menu__shortcut"><span class="ayy-shortcut" data-keys="Mod+D"><span class="ayy-sr-only">Ctrl D</span><kbd class="ayy-kbd" aria-hidden="true">Ctrl</kbd><kbd class="ayy-kbd" aria-hidden="true">D</kbd></span></span></button><button type="button" role="menuitem" tabindex="-1" class="ayy-menu__item"><svg class="ayy-icon" data-ayy-icon="square-link" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M14.5563 13.2183C13.514 14.2606 11.8241 14.2606 10.7817 13.2183C9.73942 12.1759 9.73942 10.486 10.7817 9.44364L13.1409 7.0845C14.1357 6.08961 15.7206 6.04433 16.7692 6.94866M16.4437 3.78175C17.486 2.73942 19.1759 2.73942 20.2183 3.78175C21.2606 4.82408 21.2606 6.51403 20.2183 7.55636L17.8591 9.9155C16.8643 10.9104 15.2794 10.9557 14.2308 10.0513" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M10.4999 3C7.21257 3 5.56889 3 4.46256 3.9079C4.25998 4.07414 4.07423 4.25989 3.90798 4.46247C3.00007 5.56879 3.00006 7.21247 3.00002 10.4998L3 12.9999C2.99996 16.7712 2.99995 18.6568 4.17152 19.8284C5.3431 21 7.22873 21 11 21H13.4999C16.7874 21 18.4311 21 19.5375 20.092C19.74 19.9258 19.9257 19.7401 20.092 19.5376C20.9999 18.4312 20.9999 16.7875 20.9999 13.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg>Copy link<span class="ayy-menu__shortcut"><span class="ayy-shortcut" data-keys="Mod+C"><span class="ayy-sr-only">Ctrl C</span><kbd class="ayy-kbd" aria-hidden="true">Ctrl</kbd><kbd class="ayy-kbd" aria-hidden="true">C</kbd></span></span></button><button type="button" role="menuitem" tabindex="-1" class="ayy-menu__item"><svg class="ayy-icon" data-ayy-icon="archive" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7 21H16.9999C19.3569 21 20.5354 21 21.2677 20.2678C21.9999 19.5355 21.9999 18.357 21.9999 16C21.9999 13.643 21.9999 12.4645 21.2677 11.7322C20.5354 11 19.3569 11 16.9999 11H7C4.64302 11 3.46453 11 2.7323 11.7322C2.00007 12.4644 2.00005 13.6429 2 15.9999C1.99995 18.357 1.99993 19.5355 2.73217 20.2677C3.4644 21 4.64294 21 7 21Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M4 11C4.00005 9.59977 4.00008 8.89966 4.27263 8.36485C4.5123 7.89455 4.89469 7.51218 5.365 7.27253C5.89981 7 6.59993 7 8.00015 7H16C17.4001 7 18.1002 7 18.635 7.27248C19.1054 7.51217 19.4878 7.89462 19.7275 8.36502C20 8.8998 20 9.59987 20 11" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M6 7C6.00004 5.5998 6.00006 4.89969 6.27259 4.3649C6.51227 3.89457 6.89467 3.51218 7.36501 3.27252C7.89981 3 8.59991 3 10.0001 3H14C15.4001 3 16.1002 3 16.635 3.27248C17.1054 3.51217 17.4878 3.89462 17.7275 4.36502C18 4.8998 18 5.59987 18 7" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M16 15L15.7 15.4C15.1111 16.1851 14.8167 16.5777 14.3944 16.7889C13.9721 17 13.4814 17 12.5 17H11.5C10.5186 17 10.0279 17 9.60557 16.7889C9.18328 16.5777 8.88885 16.1851 8.3 15.4L8 15" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg>Archive</button><div role="separator" class="ayy-menu__separator"></div><button type="button" role="menuitem" tabindex="-1" class="ayy-menu__item ayy-menu__item--destructive"><svg class="ayy-icon" data-ayy-icon="trash" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M19.5 5.5L18.8803 15.5251C18.7219 18.0864 18.6428 19.3671 18.0008 20.2879C17.6833 20.7431 17.2747 21.1273 16.8007 21.416C15.8421 22 14.559 22 11.9927 22C9.42312 22 8.1383 22 7.17905 21.4149C6.7048 21.1257 6.296 20.7408 5.97868 20.2848C5.33688 19.3626 5.25945 18.0801 5.10461 15.5152L4.5 5.5" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path><path d="M3 5.5H21M16.0557 5.5L15.3731 4.09173C14.9196 3.15626 14.6928 2.68852 14.3017 2.39681C14.215 2.3321 14.1231 2.27454 14.027 2.2247C13.5939 2 13.0741 2 12.0345 2C10.9688 2 10.436 2 9.99568 2.23412C9.8981 2.28601 9.80498 2.3459 9.71729 2.41317C9.32164 2.7167 9.10063 3.20155 8.65861 4.17126L8.05292 5.5" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path><path d="M9.5 16.5L9.5 10.5" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path><path d="M14.5 16.5L14.5 10.5" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path></svg>Delete</button></div></div></ayy-menu></div><div class="ayy-grid__header"><div><h3 class="ayy-grid__title">Dashboard dark mode screenshot</h3><p class="ayy-grid__description">PNG · 2880 × 1800 · 1.4 MB</p></div></div><div class="ayy-grid__footer"><span class="ayy-badge ayy-badge--info">Screenshot</span><span>Updated today</span></div></article><article aria-selected="true" class="ayy-grid__item" style="--ayy-spot:var(--ayy-accent-marketing)"><div class="ayy-grid__media ayy-bg-grid"><div class="ayy-grid__select"><input type="checkbox" class="ayy-checkbox" aria-label="Select Q4 launch announcement carousel" checked=""/></div><span class="ayy-icon-tile ayy-icon-tile--lg" aria-hidden="true"><svg class="ayy-icon ayy-icon--lg" data-ayy-icon="share-2" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M21 6.5C21 8.15685 19.6569 9.5 18 9.5C16.3431 9.5 15 8.15685 15 6.5C15 4.84315 16.3431 3.5 18 3.5C19.6569 3.5 21 4.84315 21 6.5Z" stroke="currentColor" stroke-width="1.5"></path><path d="M9 12C9 13.6569 7.65685 15 6 15C4.34315 15 3 13.6569 3 12C3 10.3431 4.34315 9 6 9C7.65685 9 9 10.3431 9 12Z" stroke="currentColor" stroke-width="1.5"></path><path d="M21 17.5C21 19.1569 19.6569 20.5 18 20.5C16.3431 20.5 15 19.1569 15 17.5C15 15.8431 16.3431 14.5 18 14.5C19.6569 14.5 21 15.8431 21 17.5Z" stroke="currentColor" stroke-width="1.5"></path><path d="M8.72852 10.7495L15.2285 7.75M8.72852 13.25L15.2285 16.2495" stroke="currentColor" stroke-width="1.5"></path></svg></span><div class="ayy-grid__actions"><button type="button" class="ayy-button ayy-button--ghost ayy-button--icon-sm" aria-label="Copy Q4 launch announcement carousel"><svg class="ayy-icon" data-ayy-icon="square-link" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M14.5563 13.2183C13.514 14.2606 11.8241 14.2606 10.7817 13.2183C9.73942 12.1759 9.73942 10.486 10.7817 9.44364L13.1409 7.0845C14.1357 6.08961 15.7206 6.04433 16.7692 6.94866M16.4437 3.78175C17.486 2.73942 19.1759 2.73942 20.2183 3.78175C21.2606 4.82408 21.2606 6.51403 20.2183 7.55636L17.8591 9.9155C16.8643 10.9104 15.2794 10.9557 14.2308 10.0513" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M10.4999 3C7.21257 3 5.56889 3 4.46256 3.9079C4.25998 4.07414 4.07423 4.25989 3.90798 4.46247C3.00007 5.56879 3.00006 7.21247 3.00002 10.4998L3 12.9999C2.99996 16.7712 2.99995 18.6568 4.17152 19.8284C5.3431 21 7.22873 21 11 21H13.4999C16.7874 21 18.4311 21 19.5375 20.092C19.74 19.9258 19.9257 19.7401 20.092 19.5376C20.9999 18.4312 20.9999 16.7875 20.9999 13.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg></button><ayy-menu><button type="button" class="ayy-button ayy-button--ghost ayy-button--icon-sm" aria-haspopup="menu" aria-label="More actions for Q4 launch announcement carousel"><svg class="ayy-icon" data-ayy-icon="ellipsis" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6.00449 12.5V12M18.0045 12.5V12M12.0045 12.5V12M7.00449 12.5C7.00449 11.9477 6.55677 11.5 6.00449 11.5C5.4522 11.5 5.00449 11.9477 5.00449 12.5C5.00449 13.0523 5.4522 13.5 6.00449 13.5C6.55677 13.5 7.00449 13.0523 7.00449 12.5ZM19.0045 12.5C19.0045 11.9477 18.5568 11.5 18.0045 11.5C17.4522 11.5 17.0045 11.9477 17.0045 12.5C17.0045 13.0523 17.4522 13.5 18.0045 13.5C18.5568 13.5 19.0045 13.0523 19.0045 12.5ZM13.0045 12.5C13.0045 11.9477 12.5568 11.5 12.0045 11.5C11.4522 11.5 11.0045 11.9477 11.0045 12.5C11.0045 13.0523 11.4522 13.5 12.0045 13.5C12.5568 13.5 13.0045 13.0523 13.0045 12.5Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg></button><div id="_R_mq_" role="menu" class="ayy-menu" popover="auto"><div role="presentation" class="ayy-menu__label">Q4 launch announcement carousel</div><button type="button" role="menuitem" tabindex="-1" class="ayy-menu__item"><svg class="ayy-icon" data-ayy-icon="square-pen" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M16.4249 4.60509L17.4149 3.6151C18.2351 2.79497 19.5648 2.79497 20.3849 3.6151C21.205 4.43524 21.205 5.76493 20.3849 6.58507L19.3949 7.57506M16.4249 4.60509L9.76558 11.2644C9.25807 11.772 8.89804 12.4078 8.72397 13.1041L8 16L10.8959 15.276C11.5922 15.102 12.228 14.7419 12.7356 14.2344L19.3949 7.57506M16.4249 4.60509L19.3949 7.57506" stroke="currentColor" stroke-linejoin="round" stroke-width="1.5"></path><path d="M18.9999 13.5C18.9999 16.7875 18.9999 18.4312 18.092 19.5376C17.9258 19.7401 17.7401 19.9258 17.5375 20.092C16.4312 21 14.7874 21 11.4999 21H11C7.22876 21 5.34316 21 4.17159 19.8284C3.00003 18.6569 3 16.7712 3 13V12.5C3 9.21252 3 7.56879 3.90794 6.46244C4.07417 6.2599 4.2599 6.07417 4.46244 5.90794C5.56879 5 7.21252 5 10.5 5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg>Edit details</button><button type="button" role="menuitem" tabindex="-1" class="ayy-menu__item"><svg class="ayy-icon" data-ayy-icon="copy" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7.5 14.5C7.5 11.2002 7.5 9.55025 8.52513 8.52513C9.55025 7.5 11.2002 7.5 14.5 7.5C17.7998 7.5 19.4497 7.5 20.4749 8.52513C21.5 9.55025 21.5 11.2002 21.5 14.5C21.5 17.7998 21.5 19.4497 20.4749 20.4749C19.4497 21.5 17.7998 21.5 14.5 21.5C11.2002 21.5 9.55025 21.5 8.52513 20.4749C7.5 19.4497 7.5 17.7998 7.5 14.5Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M7.5 16.5C6.10355 16.5 5.40533 16.5 4.84402 16.3036C3.83866 15.9518 3.0482 15.1613 2.69641 14.156C2.5 13.5947 2.5 12.8964 2.5 11.5V9.5C2.5 6.20017 2.5 4.55025 3.52513 3.52513C4.55025 2.5 6.20017 2.5 9.5 2.5H11.5C12.8964 2.5 13.5947 2.5 14.156 2.69641C15.1613 3.0482 15.9518 3.83866 16.3036 4.84402C16.5 5.40533 16.5 6.10355 16.5 7.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg>Duplicate<span class="ayy-menu__shortcut"><span class="ayy-shortcut" data-keys="Mod+D"><span class="ayy-sr-only">Ctrl D</span><kbd class="ayy-kbd" aria-hidden="true">Ctrl</kbd><kbd class="ayy-kbd" aria-hidden="true">D</kbd></span></span></button><button type="button" role="menuitem" tabindex="-1" class="ayy-menu__item"><svg class="ayy-icon" data-ayy-icon="square-link" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M14.5563 13.2183C13.514 14.2606 11.8241 14.2606 10.7817 13.2183C9.73942 12.1759 9.73942 10.486 10.7817 9.44364L13.1409 7.0845C14.1357 6.08961 15.7206 6.04433 16.7692 6.94866M16.4437 3.78175C17.486 2.73942 19.1759 2.73942 20.2183 3.78175C21.2606 4.82408 21.2606 6.51403 20.2183 7.55636L17.8591 9.9155C16.8643 10.9104 15.2794 10.9557 14.2308 10.0513" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M10.4999 3C7.21257 3 5.56889 3 4.46256 3.9079C4.25998 4.07414 4.07423 4.25989 3.90798 4.46247C3.00007 5.56879 3.00006 7.21247 3.00002 10.4998L3 12.9999C2.99996 16.7712 2.99995 18.6568 4.17152 19.8284C5.3431 21 7.22873 21 11 21H13.4999C16.7874 21 18.4311 21 19.5375 20.092C19.74 19.9258 19.9257 19.7401 20.092 19.5376C20.9999 18.4312 20.9999 16.7875 20.9999 13.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg>Copy link<span class="ayy-menu__shortcut"><span class="ayy-shortcut" data-keys="Mod+C"><span class="ayy-sr-only">Ctrl C</span><kbd class="ayy-kbd" aria-hidden="true">Ctrl</kbd><kbd class="ayy-kbd" aria-hidden="true">C</kbd></span></span></button><button type="button" role="menuitem" tabindex="-1" class="ayy-menu__item"><svg class="ayy-icon" data-ayy-icon="archive" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7 21H16.9999C19.3569 21 20.5354 21 21.2677 20.2678C21.9999 19.5355 21.9999 18.357 21.9999 16C21.9999 13.643 21.9999 12.4645 21.2677 11.7322C20.5354 11 19.3569 11 16.9999 11H7C4.64302 11 3.46453 11 2.7323 11.7322C2.00007 12.4644 2.00005 13.6429 2 15.9999C1.99995 18.357 1.99993 19.5355 2.73217 20.2677C3.4644 21 4.64294 21 7 21Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M4 11C4.00005 9.59977 4.00008 8.89966 4.27263 8.36485C4.5123 7.89455 4.89469 7.51218 5.365 7.27253C5.89981 7 6.59993 7 8.00015 7H16C17.4001 7 18.1002 7 18.635 7.27248C19.1054 7.51217 19.4878 7.89462 19.7275 8.36502C20 8.8998 20 9.59987 20 11" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M6 7C6.00004 5.5998 6.00006 4.89969 6.27259 4.3649C6.51227 3.89457 6.89467 3.51218 7.36501 3.27252C7.89981 3 8.59991 3 10.0001 3H14C15.4001 3 16.1002 3 16.635 3.27248C17.1054 3.51217 17.4878 3.89462 17.7275 4.36502C18 4.8998 18 5.59987 18 7" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M16 15L15.7 15.4C15.1111 16.1851 14.8167 16.5777 14.3944 16.7889C13.9721 17 13.4814 17 12.5 17H11.5C10.5186 17 10.0279 17 9.60557 16.7889C9.18328 16.5777 8.88885 16.1851 8.3 15.4L8 15" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg>Archive</button><div role="separator" class="ayy-menu__separator"></div><button type="button" role="menuitem" tabindex="-1" class="ayy-menu__item ayy-menu__item--destructive"><svg class="ayy-icon" data-ayy-icon="trash" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M19.5 5.5L18.8803 15.5251C18.7219 18.0864 18.6428 19.3671 18.0008 20.2879C17.6833 20.7431 17.2747 21.1273 16.8007 21.416C15.8421 22 14.559 22 11.9927 22C9.42312 22 8.1383 22 7.17905 21.4149C6.7048 21.1257 6.296 20.7408 5.97868 20.2848C5.33688 19.3626 5.25945 18.0801 5.10461 15.5152L4.5 5.5" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path><path d="M3 5.5H21M16.0557 5.5L15.3731 4.09173C14.9196 3.15626 14.6928 2.68852 14.3017 2.39681C14.215 2.3321 14.1231 2.27454 14.027 2.2247C13.5939 2 13.0741 2 12.0345 2C10.9688 2 10.436 2 9.99568 2.23412C9.8981 2.28601 9.80498 2.3459 9.71729 2.41317C9.32164 2.7167 9.10063 3.20155 8.65861 4.17126L8.05292 5.5" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path><path d="M9.5 16.5L9.5 10.5" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path><path d="M14.5 16.5L14.5 10.5" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path></svg>Delete</button></div></div></ayy-menu></div><div class="ayy-grid__header"><div><h3 class="ayy-grid__title">Q4 launch announcement carousel</h3><p class="ayy-grid__description">LinkedIn &amp; X · 5 slides</p></div></div><div class="ayy-grid__footer"><span class="ayy-badge ayy-badge--success">Social post</span><span>Updated today</span></div></article><article aria-selected="false" class="ayy-grid__item" style="--ayy-spot:var(--ayy-accent-brand)"><div class="ayy-grid__media ayy-bg-grid"><div class="ayy-grid__select"><input type="checkbox" class="ayy-checkbox" aria-label="Select Brand identity hero cover"/></div><span class="ayy-icon-tile ayy-icon-tile--lg" aria-hidden="true"><svg class="ayy-icon ayy-icon--lg" data-ayy-icon="image" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="7.5" cy="7.5" r="1.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></circle><path d="M2.5 12C2.5 7.52166 2.5 5.28249 3.89124 3.89124C5.28249 2.5 7.52166 2.5 12 2.5C16.4783 2.5 18.7175 2.5 20.1088 3.89124C21.5 5.28249 21.5 7.52166 21.5 12C21.5 16.4783 21.5 18.7175 20.1088 20.1088C18.7175 21.5 16.4783 21.5 12 21.5C7.52166 21.5 5.28249 21.5 3.89124 20.1088C2.5 18.7175 2.5 16.4783 2.5 12Z" stroke="currentColor" stroke-width="1.5"></path><path d="M5 21C9.37246 15.775 14.2741 8.88406 21.4975 13.5424" stroke="currentColor" stroke-width="1.5"></path></svg></span><div class="ayy-grid__actions"><button type="button" class="ayy-button ayy-button--ghost ayy-button--icon-sm" aria-label="Copy Brand identity hero cover"><svg class="ayy-icon" data-ayy-icon="square-link" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M14.5563 13.2183C13.514 14.2606 11.8241 14.2606 10.7817 13.2183C9.73942 12.1759 9.73942 10.486 10.7817 9.44364L13.1409 7.0845C14.1357 6.08961 15.7206 6.04433 16.7692 6.94866M16.4437 3.78175C17.486 2.73942 19.1759 2.73942 20.2183 3.78175C21.2606 4.82408 21.2606 6.51403 20.2183 7.55636L17.8591 9.9155C16.8643 10.9104 15.2794 10.9557 14.2308 10.0513" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M10.4999 3C7.21257 3 5.56889 3 4.46256 3.9079C4.25998 4.07414 4.07423 4.25989 3.90798 4.46247C3.00007 5.56879 3.00006 7.21247 3.00002 10.4998L3 12.9999C2.99996 16.7712 2.99995 18.6568 4.17152 19.8284C5.3431 21 7.22873 21 11 21H13.4999C16.7874 21 18.4311 21 19.5375 20.092C19.74 19.9258 19.9257 19.7401 20.092 19.5376C20.9999 18.4312 20.9999 16.7875 20.9999 13.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg></button><ayy-menu><button type="button" class="ayy-button ayy-button--ghost ayy-button--icon-sm" aria-haspopup="menu" aria-label="More actions for Brand identity hero cover"><svg class="ayy-icon" data-ayy-icon="ellipsis" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6.00449 12.5V12M18.0045 12.5V12M12.0045 12.5V12M7.00449 12.5C7.00449 11.9477 6.55677 11.5 6.00449 11.5C5.4522 11.5 5.00449 11.9477 5.00449 12.5C5.00449 13.0523 5.4522 13.5 6.00449 13.5C6.55677 13.5 7.00449 13.0523 7.00449 12.5ZM19.0045 12.5C19.0045 11.9477 18.5568 11.5 18.0045 11.5C17.4522 11.5 17.0045 11.9477 17.0045 12.5C17.0045 13.0523 17.4522 13.5 18.0045 13.5C18.5568 13.5 19.0045 13.0523 19.0045 12.5ZM13.0045 12.5C13.0045 11.9477 12.5568 11.5 12.0045 11.5C11.4522 11.5 11.0045 11.9477 11.0045 12.5C11.0045 13.0523 11.4522 13.5 12.0045 13.5C12.5568 13.5 13.0045 13.0523 13.0045 12.5Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg></button><div id="_R_mu_" role="menu" class="ayy-menu" popover="auto"><div role="presentation" class="ayy-menu__label">Brand identity hero cover</div><button type="button" role="menuitem" tabindex="-1" class="ayy-menu__item"><svg class="ayy-icon" data-ayy-icon="square-pen" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M16.4249 4.60509L17.4149 3.6151C18.2351 2.79497 19.5648 2.79497 20.3849 3.6151C21.205 4.43524 21.205 5.76493 20.3849 6.58507L19.3949 7.57506M16.4249 4.60509L9.76558 11.2644C9.25807 11.772 8.89804 12.4078 8.72397 13.1041L8 16L10.8959 15.276C11.5922 15.102 12.228 14.7419 12.7356 14.2344L19.3949 7.57506M16.4249 4.60509L19.3949 7.57506" stroke="currentColor" stroke-linejoin="round" stroke-width="1.5"></path><path d="M18.9999 13.5C18.9999 16.7875 18.9999 18.4312 18.092 19.5376C17.9258 19.7401 17.7401 19.9258 17.5375 20.092C16.4312 21 14.7874 21 11.4999 21H11C7.22876 21 5.34316 21 4.17159 19.8284C3.00003 18.6569 3 16.7712 3 13V12.5C3 9.21252 3 7.56879 3.90794 6.46244C4.07417 6.2599 4.2599 6.07417 4.46244 5.90794C5.56879 5 7.21252 5 10.5 5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg>Edit details</button><button type="button" role="menuitem" tabindex="-1" class="ayy-menu__item"><svg class="ayy-icon" data-ayy-icon="copy" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7.5 14.5C7.5 11.2002 7.5 9.55025 8.52513 8.52513C9.55025 7.5 11.2002 7.5 14.5 7.5C17.7998 7.5 19.4497 7.5 20.4749 8.52513C21.5 9.55025 21.5 11.2002 21.5 14.5C21.5 17.7998 21.5 19.4497 20.4749 20.4749C19.4497 21.5 17.7998 21.5 14.5 21.5C11.2002 21.5 9.55025 21.5 8.52513 20.4749C7.5 19.4497 7.5 17.7998 7.5 14.5Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M7.5 16.5C6.10355 16.5 5.40533 16.5 4.84402 16.3036C3.83866 15.9518 3.0482 15.1613 2.69641 14.156C2.5 13.5947 2.5 12.8964 2.5 11.5V9.5C2.5 6.20017 2.5 4.55025 3.52513 3.52513C4.55025 2.5 6.20017 2.5 9.5 2.5H11.5C12.8964 2.5 13.5947 2.5 14.156 2.69641C15.1613 3.0482 15.9518 3.83866 16.3036 4.84402C16.5 5.40533 16.5 6.10355 16.5 7.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg>Duplicate<span class="ayy-menu__shortcut"><span class="ayy-shortcut" data-keys="Mod+D"><span class="ayy-sr-only">Ctrl D</span><kbd class="ayy-kbd" aria-hidden="true">Ctrl</kbd><kbd class="ayy-kbd" aria-hidden="true">D</kbd></span></span></button><button type="button" role="menuitem" tabindex="-1" class="ayy-menu__item"><svg class="ayy-icon" data-ayy-icon="square-link" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M14.5563 13.2183C13.514 14.2606 11.8241 14.2606 10.7817 13.2183C9.73942 12.1759 9.73942 10.486 10.7817 9.44364L13.1409 7.0845C14.1357 6.08961 15.7206 6.04433 16.7692 6.94866M16.4437 3.78175C17.486 2.73942 19.1759 2.73942 20.2183 3.78175C21.2606 4.82408 21.2606 6.51403 20.2183 7.55636L17.8591 9.9155C16.8643 10.9104 15.2794 10.9557 14.2308 10.0513" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M10.4999 3C7.21257 3 5.56889 3 4.46256 3.9079C4.25998 4.07414 4.07423 4.25989 3.90798 4.46247C3.00007 5.56879 3.00006 7.21247 3.00002 10.4998L3 12.9999C2.99996 16.7712 2.99995 18.6568 4.17152 19.8284C5.3431 21 7.22873 21 11 21H13.4999C16.7874 21 18.4311 21 19.5375 20.092C19.74 19.9258 19.9257 19.7401 20.092 19.5376C20.9999 18.4312 20.9999 16.7875 20.9999 13.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg>Copy link<span class="ayy-menu__shortcut"><span class="ayy-shortcut" data-keys="Mod+C"><span class="ayy-sr-only">Ctrl C</span><kbd class="ayy-kbd" aria-hidden="true">Ctrl</kbd><kbd class="ayy-kbd" aria-hidden="true">C</kbd></span></span></button><button type="button" role="menuitem" tabindex="-1" class="ayy-menu__item"><svg class="ayy-icon" data-ayy-icon="archive" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7 21H16.9999C19.3569 21 20.5354 21 21.2677 20.2678C21.9999 19.5355 21.9999 18.357 21.9999 16C21.9999 13.643 21.9999 12.4645 21.2677 11.7322C20.5354 11 19.3569 11 16.9999 11H7C4.64302 11 3.46453 11 2.7323 11.7322C2.00007 12.4644 2.00005 13.6429 2 15.9999C1.99995 18.357 1.99993 19.5355 2.73217 20.2677C3.4644 21 4.64294 21 7 21Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M4 11C4.00005 9.59977 4.00008 8.89966 4.27263 8.36485C4.5123 7.89455 4.89469 7.51218 5.365 7.27253C5.89981 7 6.59993 7 8.00015 7H16C17.4001 7 18.1002 7 18.635 7.27248C19.1054 7.51217 19.4878 7.89462 19.7275 8.36502C20 8.8998 20 9.59987 20 11" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M6 7C6.00004 5.5998 6.00006 4.89969 6.27259 4.3649C6.51227 3.89457 6.89467 3.51218 7.36501 3.27252C7.89981 3 8.59991 3 10.0001 3H14C15.4001 3 16.1002 3 16.635 3.27248C17.1054 3.51217 17.4878 3.89462 17.7275 4.36502C18 4.8998 18 5.59987 18 7" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M16 15L15.7 15.4C15.1111 16.1851 14.8167 16.5777 14.3944 16.7889C13.9721 17 13.4814 17 12.5 17H11.5C10.5186 17 10.0279 17 9.60557 16.7889C9.18328 16.5777 8.88885 16.1851 8.3 15.4L8 15" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg>Archive</button><div role="separator" class="ayy-menu__separator"></div><button type="button" role="menuitem" tabindex="-1" class="ayy-menu__item ayy-menu__item--destructive"><svg class="ayy-icon" data-ayy-icon="trash" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M19.5 5.5L18.8803 15.5251C18.7219 18.0864 18.6428 19.3671 18.0008 20.2879C17.6833 20.7431 17.2747 21.1273 16.8007 21.416C15.8421 22 14.559 22 11.9927 22C9.42312 22 8.1383 22 7.17905 21.4149C6.7048 21.1257 6.296 20.7408 5.97868 20.2848C5.33688 19.3626 5.25945 18.0801 5.10461 15.5152L4.5 5.5" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path><path d="M3 5.5H21M16.0557 5.5L15.3731 4.09173C14.9196 3.15626 14.6928 2.68852 14.3017 2.39681C14.215 2.3321 14.1231 2.27454 14.027 2.2247C13.5939 2 13.0741 2 12.0345 2C10.9688 2 10.436 2 9.99568 2.23412C9.8981 2.28601 9.80498 2.3459 9.71729 2.41317C9.32164 2.7167 9.10063 3.20155 8.65861 4.17126L8.05292 5.5" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path><path d="M9.5 16.5L9.5 10.5" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path><path d="M14.5 16.5L14.5 10.5" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path></svg>Delete</button></div></div></ayy-menu></div><div class="ayy-grid__header"><div><h3 class="ayy-grid__title">Brand identity hero cover</h3><p class="ayy-grid__description">WebP · 3840 × 2160 · 890 KB</p></div></div><div class="ayy-grid__footer"><span class="ayy-badge ayy-badge--ai">Media asset</span><span>Updated today</span></div></article></div><ayy-action-bar><div role="toolbar" aria-label="Bulk actions" open="" class="ayy-action-bar"><div class="ayy-action-bar__selection"><span class="ayy-action-bar__count">2 selected</span><button type="button" aria-label="Clear selection" class="ayy-action-bar__close"><svg class="ayy-icon" data-ayy-icon="x" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M18 6L6.00081 17.9992M17.9992 18L6 6.00085" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg></button></div><div role="separator" class="ayy-action-bar__separator"></div><div role="group" class="ayy-action-bar__actions"><button type="button" class="ayy-action-bar__button"><svg class="ayy-icon" data-ayy-icon="square-pen" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M16.4249 4.60509L17.4149 3.6151C18.2351 2.79497 19.5648 2.79497 20.3849 3.6151C21.205 4.43524 21.205 5.76493 20.3849 6.58507L19.3949 7.57506M16.4249 4.60509L9.76558 11.2644C9.25807 11.772 8.89804 12.4078 8.72397 13.1041L8 16L10.8959 15.276C11.5922 15.102 12.228 14.7419 12.7356 14.2344L19.3949 7.57506M16.4249 4.60509L19.3949 7.57506" stroke="currentColor" stroke-linejoin="round" stroke-width="1.5"></path><path d="M18.9999 13.5C18.9999 16.7875 18.9999 18.4312 18.092 19.5376C17.9258 19.7401 17.7401 19.9258 17.5375 20.092C16.4312 21 14.7874 21 11.4999 21H11C7.22876 21 5.34316 21 4.17159 19.8284C3.00003 18.6569 3 16.7712 3 13V12.5C3 9.21252 3 7.56879 3.90794 6.46244C4.07417 6.2599 4.2599 6.07417 4.46244 5.90794C5.56879 5 7.21252 5 10.5 5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg>Edit</button><button type="button" class="ayy-action-bar__button"><svg class="ayy-icon" data-ayy-icon="copy" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7.5 14.5C7.5 11.2002 7.5 9.55025 8.52513 8.52513C9.55025 7.5 11.2002 7.5 14.5 7.5C17.7998 7.5 19.4497 7.5 20.4749 8.52513C21.5 9.55025 21.5 11.2002 21.5 14.5C21.5 17.7998 21.5 19.4497 20.4749 20.4749C19.4497 21.5 17.7998 21.5 14.5 21.5C11.2002 21.5 9.55025 21.5 8.52513 20.4749C7.5 19.4497 7.5 17.7998 7.5 14.5Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M7.5 16.5C6.10355 16.5 5.40533 16.5 4.84402 16.3036C3.83866 15.9518 3.0482 15.1613 2.69641 14.156C2.5 13.5947 2.5 12.8964 2.5 11.5V9.5C2.5 6.20017 2.5 4.55025 3.52513 3.52513C4.55025 2.5 6.20017 2.5 9.5 2.5H11.5C12.8964 2.5 13.5947 2.5 14.156 2.69641C15.1613 3.0482 15.9518 3.83866 16.3036 4.84402C16.5 5.40533 16.5 6.10355 16.5 7.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg>Duplicate</button><button type="button" class="ayy-action-bar__button"><svg class="ayy-icon" data-ayy-icon="square-link" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M14.5563 13.2183C13.514 14.2606 11.8241 14.2606 10.7817 13.2183C9.73942 12.1759 9.73942 10.486 10.7817 9.44364L13.1409 7.0845C14.1357 6.08961 15.7206 6.04433 16.7692 6.94866M16.4437 3.78175C17.486 2.73942 19.1759 2.73942 20.2183 3.78175C21.2606 4.82408 21.2606 6.51403 20.2183 7.55636L17.8591 9.9155C16.8643 10.9104 15.2794 10.9557 14.2308 10.0513" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M10.4999 3C7.21257 3 5.56889 3 4.46256 3.9079C4.25998 4.07414 4.07423 4.25989 3.90798 4.46247C3.00007 5.56879 3.00006 7.21247 3.00002 10.4998L3 12.9999C2.99996 16.7712 2.99995 18.6568 4.17152 19.8284C5.3431 21 7.22873 21 11 21H13.4999C16.7874 21 18.4311 21 19.5375 20.092C19.74 19.9258 19.9257 19.7401 20.092 19.5376C20.9999 18.4312 20.9999 16.7875 20.9999 13.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg>Copy</button><button type="button" class="ayy-action-bar__button"><svg class="ayy-icon" data-ayy-icon="archive" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7 21H16.9999C19.3569 21 20.5354 21 21.2677 20.2678C21.9999 19.5355 21.9999 18.357 21.9999 16C21.9999 13.643 21.9999 12.4645 21.2677 11.7322C20.5354 11 19.3569 11 16.9999 11H7C4.64302 11 3.46453 11 2.7323 11.7322C2.00007 12.4644 2.00005 13.6429 2 15.9999C1.99995 18.357 1.99993 19.5355 2.73217 20.2677C3.4644 21 4.64294 21 7 21Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M4 11C4.00005 9.59977 4.00008 8.89966 4.27263 8.36485C4.5123 7.89455 4.89469 7.51218 5.365 7.27253C5.89981 7 6.59993 7 8.00015 7H16C17.4001 7 18.1002 7 18.635 7.27248C19.1054 7.51217 19.4878 7.89462 19.7275 8.36502C20 8.8998 20 9.59987 20 11" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M6 7C6.00004 5.5998 6.00006 4.89969 6.27259 4.3649C6.51227 3.89457 6.89467 3.51218 7.36501 3.27252C7.89981 3 8.59991 3 10.0001 3H14C15.4001 3 16.1002 3 16.635 3.27248C17.1054 3.51217 17.4878 3.89462 17.7275 4.36502C18 4.8998 18 5.59987 18 7" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M16 15L15.7 15.4C15.1111 16.1851 14.8167 16.5777 14.3944 16.7889C13.9721 17 13.4814 17 12.5 17H11.5C10.5186 17 10.0279 17 9.60557 16.7889C9.18328 16.5777 8.88885 16.1851 8.3 15.4L8 15" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg>Archive</button><div role="separator" class="ayy-action-bar__separator"></div><button type="button" class="ayy-action-bar__button ayy-action-bar__button--destructive"><svg class="ayy-icon" data-ayy-icon="trash" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M19.5 5.5L18.8803 15.5251C18.7219 18.0864 18.6428 19.3671 18.0008 20.2879C17.6833 20.7431 17.2747 21.1273 16.8007 21.416C15.8421 22 14.559 22 11.9927 22C9.42312 22 8.1383 22 7.17905 21.4149C6.7048 21.1257 6.296 20.7408 5.97868 20.2848C5.33688 19.3626 5.25945 18.0801 5.10461 15.5152L4.5 5.5" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path><path d="M3 5.5H21M16.0557 5.5L15.3731 4.09173C14.9196 3.15626 14.6928 2.68852 14.3017 2.39681C14.215 2.3321 14.1231 2.27454 14.027 2.2247C13.5939 2 13.0741 2 12.0345 2C10.9688 2 10.436 2 9.99568 2.23412C9.8981 2.28601 9.80498 2.3459 9.71729 2.41317C9.32164 2.7167 9.10063 3.20155 8.65861 4.17126L8.05292 5.5" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path><path d="M9.5 16.5L9.5 10.5" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path><path d="M14.5 16.5L14.5 10.5" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path></svg>Delete</button></div></div></ayy-action-bar></div>
</ayy-grid>
```

React:

```tsx
import { useState } from "react";
import {
  Archive02Icon,
  Copy01Icon,
  CopyLinkIcon,
  Delete02Icon,
  Image01Icon,
  MoreHorizontalIcon,
  PencilEdit02Icon,
  Share08Icon,
} from "@hugeicons/core-free-icons";
import {
  ActionBar,
  ActionBarActions,
  ActionBarButton,
  ActionBarClose,
  ActionBarCount,
  ActionBarSelection,
  ActionBarSeparator,
  Badge,
  Button,
  Checkbox,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Grid,
  GridItem,
  GridItemActions,
  GridItemDescription,
  GridItemFooter,
  GridItemHeader,
  GridItemMedia,
  GridItemSelect,
  GridItemTitle,
  GridSelectAll,
  GridToolbar,
  GridWrap,
  Icon,
  IconTile,
  toast,
} from "@danitesler/ayywi/react";

const assets = [
  {
    id: "asset-1",
    title: "Dashboard dark mode screenshot",
    subtitle: "PNG · 2880 × 1800 · 1.4 MB",
    tag: "Screenshot",
    variant: "info",
    spot: "var(--ayy-accent-product)",
    icon: Image01Icon, name: "image",
  },
  {
    id: "asset-2",
    title: "Q4 launch announcement carousel",
    subtitle: "LinkedIn & X · 5 slides",
    tag: "Social post",
    variant: "success",
    spot: "var(--ayy-accent-marketing)",
    icon: Share08Icon, name: "share-2",
  },
  {
    id: "asset-3",
    title: "Brand identity hero cover",
    subtitle: "WebP · 3840 × 2160 · 890 KB",
    tag: "Media asset",
    variant: "ai",
    spot: "var(--ayy-accent-brand)",
    icon: Image01Icon, name: "image",
  },
] as const;

export default function Example() {
  const [selected, setSelected] = useState<string[]>(["asset-1", "asset-2"]);
  const all = selected.length === assets.length;
  const toggle = (id: string, on: boolean) =>
    setSelected((list) => (on ? [...list, id] : list.filter((x) => x !== id)));

  return (
    <GridWrap>
      <GridToolbar>
        <GridSelectAll>
          <Checkbox
            aria-label="Select all media assets"
            checked={all}
            indeterminate={selected.length > 0 && !all}
            onCheckedChange={(on) => setSelected(on ? assets.map((a) => a.id) : [])}
          />
          <span>{selected.length ? `${selected.length} of ${assets.length} selected` : `${assets.length} items`}</span>
        </GridSelectAll>
      </GridToolbar>

      <Grid>
        {assets.map((asset) => {
          const isSelected = selected.includes(asset.id);
          return (
            <GridItem
              key={asset.id}
              selected={isSelected}
              onSelectedChange={(on) => toggle(asset.id, on)}
              style={{ "--ayy-spot": asset.spot } as React.CSSProperties}
            >
              <GridItemMedia className="ayy-bg-grid">
                <GridItemSelect>
                  <Checkbox
                    aria-label={`Select ${asset.title}`}
                    checked={isSelected}
                    onCheckedChange={(on) => toggle(asset.id, on)}
                  />
                </GridItemSelect>
                <IconTile size="lg">
                  <Icon icon={asset.icon} name={asset.name} size="lg" />
                </IconTile>
                <GridItemActions>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`Copy ${asset.title}`}
                    onClick={() => toast.success(`Copied ${asset.title}`)}
                  >
                    <Icon icon={CopyLinkIcon} name="square-link" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      variant="ghost"
                      size="icon-sm"
                      aria-label={`More actions for ${asset.title}`}
                    >
                      <Icon icon={MoreHorizontalIcon} name="ellipsis" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>{asset.title}</DropdownMenuLabel>
                      <DropdownMenuItem onSelect={() => toast(`Edit ${asset.title}`)}>
                        <Icon icon={PencilEdit02Icon} name="square-pen" />
                        Edit details
                      </DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => toast.success(`Duplicated ${asset.title}`)} shortcut="Mod+D">
                        <Icon icon={Copy01Icon} name="copy" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => toast.success(`Copied link to ${asset.title}`)} shortcut="Mod+C">
                        <Icon icon={CopyLinkIcon} name="square-link" />
                        Copy link
                      </DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => toast(`Archived ${asset.title}`)}>
                        <Icon icon={Archive02Icon} name="archive" />
                        Archive
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem destructive onSelect={() => toast.error(`Deleted ${asset.title}`)}>
                        <Icon icon={Delete02Icon} name="trash" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </GridItemActions>
              </GridItemMedia>

              <GridItemHeader>
                <div>
                  <GridItemTitle>{asset.title}</GridItemTitle>
                  <GridItemDescription>{asset.subtitle}</GridItemDescription>
                </div>
              </GridItemHeader>

              <GridItemFooter>
                <Badge variant={asset.variant}>{asset.tag}</Badge>
                <span>Updated today</span>
              </GridItemFooter>
            </GridItem>
          );
        })}
      </Grid>

      <ActionBar open={selected.length > 0} onClear={() => setSelected([])}>
        <ActionBarSelection>
          <ActionBarCount>{selected.length} selected</ActionBarCount>
          <ActionBarClose />
        </ActionBarSelection>
        <ActionBarSeparator />
        <ActionBarActions>
          <ActionBarButton onClick={() => toast(`Editing ${selected.length} items`)}>
            <Icon icon={PencilEdit02Icon} name="square-pen" />
            Edit
          </ActionBarButton>
          <ActionBarButton onClick={() => toast.success(`Duplicated ${selected.length} items`)}>
            <Icon icon={Copy01Icon} name="copy" />
            Duplicate
          </ActionBarButton>
          <ActionBarButton onClick={() => toast.success(`Copied ${selected.length} links`)}>
            <Icon icon={CopyLinkIcon} name="square-link" />
            Copy
          </ActionBarButton>
          <ActionBarButton onClick={() => toast(`Archived ${selected.length} items`)}>
            <Icon icon={Archive02Icon} name="archive" />
            Archive
          </ActionBarButton>
          <ActionBarButton
            destructive
            onClick={() => {
              toast.error(`Deleted ${selected.length} items`);
              setSelected([]);
            }}
          >
            <Icon icon={Delete02Icon} name="trash" />
            Delete
          </ActionBarButton>
        </ActionBarActions>
      </ActionBar>
    </GridWrap>
  );
}
```

## Grid — Project cards and user records

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<!-- <ayy-grid> manages card selection (including Shift+Click range selection) and syncs with the sibling <ayy-action-bar>. -->
<ayy-grid>
  <div class="ayy-grid-wrap"><div class="ayy-grid__toolbar"><label class="ayy-grid__select-all"><input type="checkbox" class="ayy-checkbox" aria-label="Select all records"/><span>1 selected</span></label></div><div class="ayy-grid"><article aria-selected="true" class="ayy-grid__item"><div class="ayy-grid__header"><div class="ayy-cluster" style="--ayy-gap:var(--ayy-space-3)"><div class="ayy-grid__select"><input type="checkbox" class="ayy-checkbox" aria-label="Select Maya Lin" checked=""/></div><span role="img" aria-label="Maya Lin" class="ayy-avatar ayy-avatar--sm"><span class="ayy-avatar__fallback" aria-hidden="true">ML</span></span><div><h3 class="ayy-grid__title">Maya Lin</h3><p class="ayy-grid__description">Staff Product Designer · Design Systems</p></div></div><div class="ayy-grid__actions"><button type="button" class="ayy-button ayy-button--ghost ayy-button--icon-sm" aria-label="Edit Maya Lin"><svg class="ayy-icon" data-ayy-icon="square-pen" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M16.4249 4.60509L17.4149 3.6151C18.2351 2.79497 19.5648 2.79497 20.3849 3.6151C21.205 4.43524 21.205 5.76493 20.3849 6.58507L19.3949 7.57506M16.4249 4.60509L9.76558 11.2644C9.25807 11.772 8.89804 12.4078 8.72397 13.1041L8 16L10.8959 15.276C11.5922 15.102 12.228 14.7419 12.7356 14.2344L19.3949 7.57506M16.4249 4.60509L19.3949 7.57506" stroke="currentColor" stroke-linejoin="round" stroke-width="1.5"></path><path d="M18.9999 13.5C18.9999 16.7875 18.9999 18.4312 18.092 19.5376C17.9258 19.7401 17.7401 19.9258 17.5375 20.092C16.4312 21 14.7874 21 11.4999 21H11C7.22876 21 5.34316 21 4.17159 19.8284C3.00003 18.6569 3 16.7712 3 13V12.5C3 9.21252 3 7.56879 3.90794 6.46244C4.07417 6.2599 4.2599 6.07417 4.46244 5.90794C5.56879 5 7.21252 5 10.5 5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg></button><ayy-menu><button type="button" class="ayy-button ayy-button--ghost ayy-button--icon-sm" aria-haspopup="menu" aria-label="More actions for Maya Lin"><svg class="ayy-icon" data-ayy-icon="ellipsis" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6.00449 12.5V12M18.0045 12.5V12M12.0045 12.5V12M7.00449 12.5C7.00449 11.9477 6.55677 11.5 6.00449 11.5C5.4522 11.5 5.00449 11.9477 5.00449 12.5C5.00449 13.0523 5.4522 13.5 6.00449 13.5C6.55677 13.5 7.00449 13.0523 7.00449 12.5ZM19.0045 12.5C19.0045 11.9477 18.5568 11.5 18.0045 11.5C17.4522 11.5 17.0045 11.9477 17.0045 12.5C17.0045 13.0523 17.4522 13.5 18.0045 13.5C18.5568 13.5 19.0045 13.0523 19.0045 12.5ZM13.0045 12.5C13.0045 11.9477 12.5568 11.5 12.0045 11.5C11.4522 11.5 11.0045 11.9477 11.0045 12.5C11.0045 13.0523 11.4522 13.5 12.0045 13.5C12.5568 13.5 13.0045 13.0523 13.0045 12.5Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg></button><div id="_R_km_" role="menu" class="ayy-menu" popover="auto"><div role="presentation" class="ayy-menu__label">Maya Lin</div><button type="button" role="menuitem" tabindex="-1" class="ayy-menu__item"><svg class="ayy-icon" data-ayy-icon="square-pen" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M16.4249 4.60509L17.4149 3.6151C18.2351 2.79497 19.5648 2.79497 20.3849 3.6151C21.205 4.43524 21.205 5.76493 20.3849 6.58507L19.3949 7.57506M16.4249 4.60509L9.76558 11.2644C9.25807 11.772 8.89804 12.4078 8.72397 13.1041L8 16L10.8959 15.276C11.5922 15.102 12.228 14.7419 12.7356 14.2344L19.3949 7.57506M16.4249 4.60509L19.3949 7.57506" stroke="currentColor" stroke-linejoin="round" stroke-width="1.5"></path><path d="M18.9999 13.5C18.9999 16.7875 18.9999 18.4312 18.092 19.5376C17.9258 19.7401 17.7401 19.9258 17.5375 20.092C16.4312 21 14.7874 21 11.4999 21H11C7.22876 21 5.34316 21 4.17159 19.8284C3.00003 18.6569 3 16.7712 3 13V12.5C3 9.21252 3 7.56879 3.90794 6.46244C4.07417 6.2599 4.2599 6.07417 4.46244 5.90794C5.56879 5 7.21252 5 10.5 5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg>Edit record</button><button type="button" role="menuitem" tabindex="-1" class="ayy-menu__item"><svg class="ayy-icon" data-ayy-icon="copy" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7.5 14.5C7.5 11.2002 7.5 9.55025 8.52513 8.52513C9.55025 7.5 11.2002 7.5 14.5 7.5C17.7998 7.5 19.4497 7.5 20.4749 8.52513C21.5 9.55025 21.5 11.2002 21.5 14.5C21.5 17.7998 21.5 19.4497 20.4749 20.4749C19.4497 21.5 17.7998 21.5 14.5 21.5C11.2002 21.5 9.55025 21.5 8.52513 20.4749C7.5 19.4497 7.5 17.7998 7.5 14.5Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M7.5 16.5C6.10355 16.5 5.40533 16.5 4.84402 16.3036C3.83866 15.9518 3.0482 15.1613 2.69641 14.156C2.5 13.5947 2.5 12.8964 2.5 11.5V9.5C2.5 6.20017 2.5 4.55025 3.52513 3.52513C4.55025 2.5 6.20017 2.5 9.5 2.5H11.5C12.8964 2.5 13.5947 2.5 14.156 2.69641C15.1613 3.0482 15.9518 3.83866 16.3036 4.84402C16.5 5.40533 16.5 6.10355 16.5 7.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg>Duplicate<span class="ayy-menu__shortcut"><span class="ayy-shortcut" data-keys="Mod+D"><span class="ayy-sr-only">Ctrl D</span><kbd class="ayy-kbd" aria-hidden="true">Ctrl</kbd><kbd class="ayy-kbd" aria-hidden="true">D</kbd></span></span></button><button type="button" role="menuitem" tabindex="-1" class="ayy-menu__item"><svg class="ayy-icon" data-ayy-icon="square-link" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M14.5563 13.2183C13.514 14.2606 11.8241 14.2606 10.7817 13.2183C9.73942 12.1759 9.73942 10.486 10.7817 9.44364L13.1409 7.0845C14.1357 6.08961 15.7206 6.04433 16.7692 6.94866M16.4437 3.78175C17.486 2.73942 19.1759 2.73942 20.2183 3.78175C21.2606 4.82408 21.2606 6.51403 20.2183 7.55636L17.8591 9.9155C16.8643 10.9104 15.2794 10.9557 14.2308 10.0513" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M10.4999 3C7.21257 3 5.56889 3 4.46256 3.9079C4.25998 4.07414 4.07423 4.25989 3.90798 4.46247C3.00007 5.56879 3.00006 7.21247 3.00002 10.4998L3 12.9999C2.99996 16.7712 2.99995 18.6568 4.17152 19.8284C5.3431 21 7.22873 21 11 21H13.4999C16.7874 21 18.4311 21 19.5375 20.092C19.74 19.9258 19.9257 19.7401 20.092 19.5376C20.9999 18.4312 20.9999 16.7875 20.9999 13.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg>Copy profile link<span class="ayy-menu__shortcut"><span class="ayy-shortcut" data-keys="Mod+C"><span class="ayy-sr-only">Ctrl C</span><kbd class="ayy-kbd" aria-hidden="true">Ctrl</kbd><kbd class="ayy-kbd" aria-hidden="true">C</kbd></span></span></button><button type="button" role="menuitem" tabindex="-1" class="ayy-menu__item"><svg class="ayy-icon" data-ayy-icon="archive" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7 21H16.9999C19.3569 21 20.5354 21 21.2677 20.2678C21.9999 19.5355 21.9999 18.357 21.9999 16C21.9999 13.643 21.9999 12.4645 21.2677 11.7322C20.5354 11 19.3569 11 16.9999 11H7C4.64302 11 3.46453 11 2.7323 11.7322C2.00007 12.4644 2.00005 13.6429 2 15.9999C1.99995 18.357 1.99993 19.5355 2.73217 20.2677C3.4644 21 4.64294 21 7 21Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M4 11C4.00005 9.59977 4.00008 8.89966 4.27263 8.36485C4.5123 7.89455 4.89469 7.51218 5.365 7.27253C5.89981 7 6.59993 7 8.00015 7H16C17.4001 7 18.1002 7 18.635 7.27248C19.1054 7.51217 19.4878 7.89462 19.7275 8.36502C20 8.8998 20 9.59987 20 11" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M6 7C6.00004 5.5998 6.00006 4.89969 6.27259 4.3649C6.51227 3.89457 6.89467 3.51218 7.36501 3.27252C7.89981 3 8.59991 3 10.0001 3H14C15.4001 3 16.1002 3 16.635 3.27248C17.1054 3.51217 17.4878 3.89462 17.7275 4.36502C18 4.8998 18 5.59987 18 7" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M16 15L15.7 15.4C15.1111 16.1851 14.8167 16.5777 14.3944 16.7889C13.9721 17 13.4814 17 12.5 17H11.5C10.5186 17 10.0279 17 9.60557 16.7889C9.18328 16.5777 8.88885 16.1851 8.3 15.4L8 15" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg>Archive</button><div role="separator" class="ayy-menu__separator"></div><button type="button" role="menuitem" tabindex="-1" class="ayy-menu__item ayy-menu__item--destructive"><svg class="ayy-icon" data-ayy-icon="trash" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M19.5 5.5L18.8803 15.5251C18.7219 18.0864 18.6428 19.3671 18.0008 20.2879C17.6833 20.7431 17.2747 21.1273 16.8007 21.416C15.8421 22 14.559 22 11.9927 22C9.42312 22 8.1383 22 7.17905 21.4149C6.7048 21.1257 6.296 20.7408 5.97868 20.2848C5.33688 19.3626 5.25945 18.0801 5.10461 15.5152L4.5 5.5" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path><path d="M3 5.5H21M16.0557 5.5L15.3731 4.09173C14.9196 3.15626 14.6928 2.68852 14.3017 2.39681C14.215 2.3321 14.1231 2.27454 14.027 2.2247C13.5939 2 13.0741 2 12.0345 2C10.9688 2 10.436 2 9.99568 2.23412C9.8981 2.28601 9.80498 2.3459 9.71729 2.41317C9.32164 2.7167 9.10063 3.20155 8.65861 4.17126L8.05292 5.5" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path><path d="M9.5 16.5L9.5 10.5" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path><path d="M14.5 16.5L14.5 10.5" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path></svg>Delete</button></div></div></ayy-menu></div><div class="ayy-grid__body"><p>Owns token architecture, accessibility reviews and Figma library sync.</p></div><div class="ayy-grid__footer"><span class="ayy-badge ayy-badge--success">Active</span><span>Core UI</span></div></article><article aria-selected="false" class="ayy-grid__item"><div class="ayy-grid__header"><div class="ayy-cluster" style="--ayy-gap:var(--ayy-space-3)"><div class="ayy-grid__select"><input type="checkbox" class="ayy-checkbox" aria-label="Select Ari Cohen"/></div><span role="img" aria-label="Ari Cohen" class="ayy-avatar ayy-avatar--sm"><span class="ayy-avatar__fallback" aria-hidden="true">AC</span></span><div><h3 class="ayy-grid__title">Ari Cohen</h3><p class="ayy-grid__description">Lead Frontend Engineer · Platform</p></div></div><div class="ayy-grid__actions"><button type="button" class="ayy-button ayy-button--ghost ayy-button--icon-sm" aria-label="Edit Ari Cohen"><svg class="ayy-icon" data-ayy-icon="square-pen" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M16.4249 4.60509L17.4149 3.6151C18.2351 2.79497 19.5648 2.79497 20.3849 3.6151C21.205 4.43524 21.205 5.76493 20.3849 6.58507L19.3949 7.57506M16.4249 4.60509L9.76558 11.2644C9.25807 11.772 8.89804 12.4078 8.72397 13.1041L8 16L10.8959 15.276C11.5922 15.102 12.228 14.7419 12.7356 14.2344L19.3949 7.57506M16.4249 4.60509L19.3949 7.57506" stroke="currentColor" stroke-linejoin="round" stroke-width="1.5"></path><path d="M18.9999 13.5C18.9999 16.7875 18.9999 18.4312 18.092 19.5376C17.9258 19.7401 17.7401 19.9258 17.5375 20.092C16.4312 21 14.7874 21 11.4999 21H11C7.22876 21 5.34316 21 4.17159 19.8284C3.00003 18.6569 3 16.7712 3 13V12.5C3 9.21252 3 7.56879 3.90794 6.46244C4.07417 6.2599 4.2599 6.07417 4.46244 5.90794C5.56879 5 7.21252 5 10.5 5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg></button><ayy-menu><button type="button" class="ayy-button ayy-button--ghost ayy-button--icon-sm" aria-haspopup="menu" aria-label="More actions for Ari Cohen"><svg class="ayy-icon" data-ayy-icon="ellipsis" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6.00449 12.5V12M18.0045 12.5V12M12.0045 12.5V12M7.00449 12.5C7.00449 11.9477 6.55677 11.5 6.00449 11.5C5.4522 11.5 5.00449 11.9477 5.00449 12.5C5.00449 13.0523 5.4522 13.5 6.00449 13.5C6.55677 13.5 7.00449 13.0523 7.00449 12.5ZM19.0045 12.5C19.0045 11.9477 18.5568 11.5 18.0045 11.5C17.4522 11.5 17.0045 11.9477 17.0045 12.5C17.0045 13.0523 17.4522 13.5 18.0045 13.5C18.5568 13.5 19.0045 13.0523 19.0045 12.5ZM13.0045 12.5C13.0045 11.9477 12.5568 11.5 12.0045 11.5C11.4522 11.5 11.0045 11.9477 11.0045 12.5C11.0045 13.0523 11.4522 13.5 12.0045 13.5C12.5568 13.5 13.0045 13.0523 13.0045 12.5Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg></button><div id="_R_kq_" role="menu" class="ayy-menu" popover="auto"><div role="presentation" class="ayy-menu__label">Ari Cohen</div><button type="button" role="menuitem" tabindex="-1" class="ayy-menu__item"><svg class="ayy-icon" data-ayy-icon="square-pen" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M16.4249 4.60509L17.4149 3.6151C18.2351 2.79497 19.5648 2.79497 20.3849 3.6151C21.205 4.43524 21.205 5.76493 20.3849 6.58507L19.3949 7.57506M16.4249 4.60509L9.76558 11.2644C9.25807 11.772 8.89804 12.4078 8.72397 13.1041L8 16L10.8959 15.276C11.5922 15.102 12.228 14.7419 12.7356 14.2344L19.3949 7.57506M16.4249 4.60509L19.3949 7.57506" stroke="currentColor" stroke-linejoin="round" stroke-width="1.5"></path><path d="M18.9999 13.5C18.9999 16.7875 18.9999 18.4312 18.092 19.5376C17.9258 19.7401 17.7401 19.9258 17.5375 20.092C16.4312 21 14.7874 21 11.4999 21H11C7.22876 21 5.34316 21 4.17159 19.8284C3.00003 18.6569 3 16.7712 3 13V12.5C3 9.21252 3 7.56879 3.90794 6.46244C4.07417 6.2599 4.2599 6.07417 4.46244 5.90794C5.56879 5 7.21252 5 10.5 5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg>Edit record</button><button type="button" role="menuitem" tabindex="-1" class="ayy-menu__item"><svg class="ayy-icon" data-ayy-icon="copy" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7.5 14.5C7.5 11.2002 7.5 9.55025 8.52513 8.52513C9.55025 7.5 11.2002 7.5 14.5 7.5C17.7998 7.5 19.4497 7.5 20.4749 8.52513C21.5 9.55025 21.5 11.2002 21.5 14.5C21.5 17.7998 21.5 19.4497 20.4749 20.4749C19.4497 21.5 17.7998 21.5 14.5 21.5C11.2002 21.5 9.55025 21.5 8.52513 20.4749C7.5 19.4497 7.5 17.7998 7.5 14.5Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M7.5 16.5C6.10355 16.5 5.40533 16.5 4.84402 16.3036C3.83866 15.9518 3.0482 15.1613 2.69641 14.156C2.5 13.5947 2.5 12.8964 2.5 11.5V9.5C2.5 6.20017 2.5 4.55025 3.52513 3.52513C4.55025 2.5 6.20017 2.5 9.5 2.5H11.5C12.8964 2.5 13.5947 2.5 14.156 2.69641C15.1613 3.0482 15.9518 3.83866 16.3036 4.84402C16.5 5.40533 16.5 6.10355 16.5 7.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg>Duplicate<span class="ayy-menu__shortcut"><span class="ayy-shortcut" data-keys="Mod+D"><span class="ayy-sr-only">Ctrl D</span><kbd class="ayy-kbd" aria-hidden="true">Ctrl</kbd><kbd class="ayy-kbd" aria-hidden="true">D</kbd></span></span></button><button type="button" role="menuitem" tabindex="-1" class="ayy-menu__item"><svg class="ayy-icon" data-ayy-icon="square-link" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M14.5563 13.2183C13.514 14.2606 11.8241 14.2606 10.7817 13.2183C9.73942 12.1759 9.73942 10.486 10.7817 9.44364L13.1409 7.0845C14.1357 6.08961 15.7206 6.04433 16.7692 6.94866M16.4437 3.78175C17.486 2.73942 19.1759 2.73942 20.2183 3.78175C21.2606 4.82408 21.2606 6.51403 20.2183 7.55636L17.8591 9.9155C16.8643 10.9104 15.2794 10.9557 14.2308 10.0513" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M10.4999 3C7.21257 3 5.56889 3 4.46256 3.9079C4.25998 4.07414 4.07423 4.25989 3.90798 4.46247C3.00007 5.56879 3.00006 7.21247 3.00002 10.4998L3 12.9999C2.99996 16.7712 2.99995 18.6568 4.17152 19.8284C5.3431 21 7.22873 21 11 21H13.4999C16.7874 21 18.4311 21 19.5375 20.092C19.74 19.9258 19.9257 19.7401 20.092 19.5376C20.9999 18.4312 20.9999 16.7875 20.9999 13.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg>Copy profile link<span class="ayy-menu__shortcut"><span class="ayy-shortcut" data-keys="Mod+C"><span class="ayy-sr-only">Ctrl C</span><kbd class="ayy-kbd" aria-hidden="true">Ctrl</kbd><kbd class="ayy-kbd" aria-hidden="true">C</kbd></span></span></button><button type="button" role="menuitem" tabindex="-1" class="ayy-menu__item"><svg class="ayy-icon" data-ayy-icon="archive" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7 21H16.9999C19.3569 21 20.5354 21 21.2677 20.2678C21.9999 19.5355 21.9999 18.357 21.9999 16C21.9999 13.643 21.9999 12.4645 21.2677 11.7322C20.5354 11 19.3569 11 16.9999 11H7C4.64302 11 3.46453 11 2.7323 11.7322C2.00007 12.4644 2.00005 13.6429 2 15.9999C1.99995 18.357 1.99993 19.5355 2.73217 20.2677C3.4644 21 4.64294 21 7 21Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M4 11C4.00005 9.59977 4.00008 8.89966 4.27263 8.36485C4.5123 7.89455 4.89469 7.51218 5.365 7.27253C5.89981 7 6.59993 7 8.00015 7H16C17.4001 7 18.1002 7 18.635 7.27248C19.1054 7.51217 19.4878 7.89462 19.7275 8.36502C20 8.8998 20 9.59987 20 11" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M6 7C6.00004 5.5998 6.00006 4.89969 6.27259 4.3649C6.51227 3.89457 6.89467 3.51218 7.36501 3.27252C7.89981 3 8.59991 3 10.0001 3H14C15.4001 3 16.1002 3 16.635 3.27248C17.1054 3.51217 17.4878 3.89462 17.7275 4.36502C18 4.8998 18 5.59987 18 7" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M16 15L15.7 15.4C15.1111 16.1851 14.8167 16.5777 14.3944 16.7889C13.9721 17 13.4814 17 12.5 17H11.5C10.5186 17 10.0279 17 9.60557 16.7889C9.18328 16.5777 8.88885 16.1851 8.3 15.4L8 15" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg>Archive</button><div role="separator" class="ayy-menu__separator"></div><button type="button" role="menuitem" tabindex="-1" class="ayy-menu__item ayy-menu__item--destructive"><svg class="ayy-icon" data-ayy-icon="trash" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M19.5 5.5L18.8803 15.5251C18.7219 18.0864 18.6428 19.3671 18.0008 20.2879C17.6833 20.7431 17.2747 21.1273 16.8007 21.416C15.8421 22 14.559 22 11.9927 22C9.42312 22 8.1383 22 7.17905 21.4149C6.7048 21.1257 6.296 20.7408 5.97868 20.2848C5.33688 19.3626 5.25945 18.0801 5.10461 15.5152L4.5 5.5" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path><path d="M3 5.5H21M16.0557 5.5L15.3731 4.09173C14.9196 3.15626 14.6928 2.68852 14.3017 2.39681C14.215 2.3321 14.1231 2.27454 14.027 2.2247C13.5939 2 13.0741 2 12.0345 2C10.9688 2 10.436 2 9.99568 2.23412C9.8981 2.28601 9.80498 2.3459 9.71729 2.41317C9.32164 2.7167 9.10063 3.20155 8.65861 4.17126L8.05292 5.5" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path><path d="M9.5 16.5L9.5 10.5" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path><path d="M14.5 16.5L14.5 10.5" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path></svg>Delete</button></div></div></ayy-menu></div><div class="ayy-grid__body"><p>Maintains custom elements runtime, SSR pipelines and bundle budgets.</p></div><div class="ayy-grid__footer"><span class="ayy-badge ayy-badge--warning">In review</span><span>Web Runtime</span></div></article><article aria-selected="false" class="ayy-grid__item"><div class="ayy-grid__header"><div class="ayy-cluster" style="--ayy-gap:var(--ayy-space-3)"><div class="ayy-grid__select"><input type="checkbox" class="ayy-checkbox" aria-label="Select Noa Levi"/></div><span role="img" aria-label="Noa Levi" class="ayy-avatar ayy-avatar--sm"><span class="ayy-avatar__fallback" aria-hidden="true">NL</span></span><div><h3 class="ayy-grid__title">Noa Levi</h3><p class="ayy-grid__description">Content Strategist · Social &amp; Growth</p></div></div><div class="ayy-grid__actions"><button type="button" class="ayy-button ayy-button--ghost ayy-button--icon-sm" aria-label="Edit Noa Levi"><svg class="ayy-icon" data-ayy-icon="square-pen" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M16.4249 4.60509L17.4149 3.6151C18.2351 2.79497 19.5648 2.79497 20.3849 3.6151C21.205 4.43524 21.205 5.76493 20.3849 6.58507L19.3949 7.57506M16.4249 4.60509L9.76558 11.2644C9.25807 11.772 8.89804 12.4078 8.72397 13.1041L8 16L10.8959 15.276C11.5922 15.102 12.228 14.7419 12.7356 14.2344L19.3949 7.57506M16.4249 4.60509L19.3949 7.57506" stroke="currentColor" stroke-linejoin="round" stroke-width="1.5"></path><path d="M18.9999 13.5C18.9999 16.7875 18.9999 18.4312 18.092 19.5376C17.9258 19.7401 17.7401 19.9258 17.5375 20.092C16.4312 21 14.7874 21 11.4999 21H11C7.22876 21 5.34316 21 4.17159 19.8284C3.00003 18.6569 3 16.7712 3 13V12.5C3 9.21252 3 7.56879 3.90794 6.46244C4.07417 6.2599 4.2599 6.07417 4.46244 5.90794C5.56879 5 7.21252 5 10.5 5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg></button><ayy-menu><button type="button" class="ayy-button ayy-button--ghost ayy-button--icon-sm" aria-haspopup="menu" aria-label="More actions for Noa Levi"><svg class="ayy-icon" data-ayy-icon="ellipsis" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6.00449 12.5V12M18.0045 12.5V12M12.0045 12.5V12M7.00449 12.5C7.00449 11.9477 6.55677 11.5 6.00449 11.5C5.4522 11.5 5.00449 11.9477 5.00449 12.5C5.00449 13.0523 5.4522 13.5 6.00449 13.5C6.55677 13.5 7.00449 13.0523 7.00449 12.5ZM19.0045 12.5C19.0045 11.9477 18.5568 11.5 18.0045 11.5C17.4522 11.5 17.0045 11.9477 17.0045 12.5C17.0045 13.0523 17.4522 13.5 18.0045 13.5C18.5568 13.5 19.0045 13.0523 19.0045 12.5ZM13.0045 12.5C13.0045 11.9477 12.5568 11.5 12.0045 11.5C11.4522 11.5 11.0045 11.9477 11.0045 12.5C11.0045 13.0523 11.4522 13.5 12.0045 13.5C12.5568 13.5 13.0045 13.0523 13.0045 12.5Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg></button><div id="_R_ku_" role="menu" class="ayy-menu" popover="auto"><div role="presentation" class="ayy-menu__label">Noa Levi</div><button type="button" role="menuitem" tabindex="-1" class="ayy-menu__item"><svg class="ayy-icon" data-ayy-icon="square-pen" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M16.4249 4.60509L17.4149 3.6151C18.2351 2.79497 19.5648 2.79497 20.3849 3.6151C21.205 4.43524 21.205 5.76493 20.3849 6.58507L19.3949 7.57506M16.4249 4.60509L9.76558 11.2644C9.25807 11.772 8.89804 12.4078 8.72397 13.1041L8 16L10.8959 15.276C11.5922 15.102 12.228 14.7419 12.7356 14.2344L19.3949 7.57506M16.4249 4.60509L19.3949 7.57506" stroke="currentColor" stroke-linejoin="round" stroke-width="1.5"></path><path d="M18.9999 13.5C18.9999 16.7875 18.9999 18.4312 18.092 19.5376C17.9258 19.7401 17.7401 19.9258 17.5375 20.092C16.4312 21 14.7874 21 11.4999 21H11C7.22876 21 5.34316 21 4.17159 19.8284C3.00003 18.6569 3 16.7712 3 13V12.5C3 9.21252 3 7.56879 3.90794 6.46244C4.07417 6.2599 4.2599 6.07417 4.46244 5.90794C5.56879 5 7.21252 5 10.5 5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg>Edit record</button><button type="button" role="menuitem" tabindex="-1" class="ayy-menu__item"><svg class="ayy-icon" data-ayy-icon="copy" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7.5 14.5C7.5 11.2002 7.5 9.55025 8.52513 8.52513C9.55025 7.5 11.2002 7.5 14.5 7.5C17.7998 7.5 19.4497 7.5 20.4749 8.52513C21.5 9.55025 21.5 11.2002 21.5 14.5C21.5 17.7998 21.5 19.4497 20.4749 20.4749C19.4497 21.5 17.7998 21.5 14.5 21.5C11.2002 21.5 9.55025 21.5 8.52513 20.4749C7.5 19.4497 7.5 17.7998 7.5 14.5Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M7.5 16.5C6.10355 16.5 5.40533 16.5 4.84402 16.3036C3.83866 15.9518 3.0482 15.1613 2.69641 14.156C2.5 13.5947 2.5 12.8964 2.5 11.5V9.5C2.5 6.20017 2.5 4.55025 3.52513 3.52513C4.55025 2.5 6.20017 2.5 9.5 2.5H11.5C12.8964 2.5 13.5947 2.5 14.156 2.69641C15.1613 3.0482 15.9518 3.83866 16.3036 4.84402C16.5 5.40533 16.5 6.10355 16.5 7.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg>Duplicate<span class="ayy-menu__shortcut"><span class="ayy-shortcut" data-keys="Mod+D"><span class="ayy-sr-only">Ctrl D</span><kbd class="ayy-kbd" aria-hidden="true">Ctrl</kbd><kbd class="ayy-kbd" aria-hidden="true">D</kbd></span></span></button><button type="button" role="menuitem" tabindex="-1" class="ayy-menu__item"><svg class="ayy-icon" data-ayy-icon="square-link" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M14.5563 13.2183C13.514 14.2606 11.8241 14.2606 10.7817 13.2183C9.73942 12.1759 9.73942 10.486 10.7817 9.44364L13.1409 7.0845C14.1357 6.08961 15.7206 6.04433 16.7692 6.94866M16.4437 3.78175C17.486 2.73942 19.1759 2.73942 20.2183 3.78175C21.2606 4.82408 21.2606 6.51403 20.2183 7.55636L17.8591 9.9155C16.8643 10.9104 15.2794 10.9557 14.2308 10.0513" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M10.4999 3C7.21257 3 5.56889 3 4.46256 3.9079C4.25998 4.07414 4.07423 4.25989 3.90798 4.46247C3.00007 5.56879 3.00006 7.21247 3.00002 10.4998L3 12.9999C2.99996 16.7712 2.99995 18.6568 4.17152 19.8284C5.3431 21 7.22873 21 11 21H13.4999C16.7874 21 18.4311 21 19.5375 20.092C19.74 19.9258 19.9257 19.7401 20.092 19.5376C20.9999 18.4312 20.9999 16.7875 20.9999 13.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg>Copy profile link<span class="ayy-menu__shortcut"><span class="ayy-shortcut" data-keys="Mod+C"><span class="ayy-sr-only">Ctrl C</span><kbd class="ayy-kbd" aria-hidden="true">Ctrl</kbd><kbd class="ayy-kbd" aria-hidden="true">C</kbd></span></span></button><button type="button" role="menuitem" tabindex="-1" class="ayy-menu__item"><svg class="ayy-icon" data-ayy-icon="archive" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7 21H16.9999C19.3569 21 20.5354 21 21.2677 20.2678C21.9999 19.5355 21.9999 18.357 21.9999 16C21.9999 13.643 21.9999 12.4645 21.2677 11.7322C20.5354 11 19.3569 11 16.9999 11H7C4.64302 11 3.46453 11 2.7323 11.7322C2.00007 12.4644 2.00005 13.6429 2 15.9999C1.99995 18.357 1.99993 19.5355 2.73217 20.2677C3.4644 21 4.64294 21 7 21Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M4 11C4.00005 9.59977 4.00008 8.89966 4.27263 8.36485C4.5123 7.89455 4.89469 7.51218 5.365 7.27253C5.89981 7 6.59993 7 8.00015 7H16C17.4001 7 18.1002 7 18.635 7.27248C19.1054 7.51217 19.4878 7.89462 19.7275 8.36502C20 8.8998 20 9.59987 20 11" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M6 7C6.00004 5.5998 6.00006 4.89969 6.27259 4.3649C6.51227 3.89457 6.89467 3.51218 7.36501 3.27252C7.89981 3 8.59991 3 10.0001 3H14C15.4001 3 16.1002 3 16.635 3.27248C17.1054 3.51217 17.4878 3.89462 17.7275 4.36502C18 4.8998 18 5.59987 18 7" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M16 15L15.7 15.4C15.1111 16.1851 14.8167 16.5777 14.3944 16.7889C13.9721 17 13.4814 17 12.5 17H11.5C10.5186 17 10.0279 17 9.60557 16.7889C9.18328 16.5777 8.88885 16.1851 8.3 15.4L8 15" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg>Archive</button><div role="separator" class="ayy-menu__separator"></div><button type="button" role="menuitem" tabindex="-1" class="ayy-menu__item ayy-menu__item--destructive"><svg class="ayy-icon" data-ayy-icon="trash" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M19.5 5.5L18.8803 15.5251C18.7219 18.0864 18.6428 19.3671 18.0008 20.2879C17.6833 20.7431 17.2747 21.1273 16.8007 21.416C15.8421 22 14.559 22 11.9927 22C9.42312 22 8.1383 22 7.17905 21.4149C6.7048 21.1257 6.296 20.7408 5.97868 20.2848C5.33688 19.3626 5.25945 18.0801 5.10461 15.5152L4.5 5.5" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path><path d="M3 5.5H21M16.0557 5.5L15.3731 4.09173C14.9196 3.15626 14.6928 2.68852 14.3017 2.39681C14.215 2.3321 14.1231 2.27454 14.027 2.2247C13.5939 2 13.0741 2 12.0345 2C10.9688 2 10.436 2 9.99568 2.23412C9.8981 2.28601 9.80498 2.3459 9.71729 2.41317C9.32164 2.7167 9.10063 3.20155 8.65861 4.17126L8.05292 5.5" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path><path d="M9.5 16.5L9.5 10.5" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path><path d="M14.5 16.5L14.5 10.5" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path></svg>Delete</button></div></div></ayy-menu></div><div class="ayy-grid__body"><p>Manages Q4 launch campaigns, social post templates and release notes.</p></div><div class="ayy-grid__footer"><span class="ayy-badge ayy-badge--info">Active</span><span>Marketing</span></div></article></div><ayy-action-bar><div role="toolbar" aria-label="Bulk actions" open="" class="ayy-action-bar"><div class="ayy-action-bar__selection"><span class="ayy-action-bar__count">1 selected</span><button type="button" aria-label="Clear selection" class="ayy-action-bar__close"><svg class="ayy-icon" data-ayy-icon="x" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M18 6L6.00081 17.9992M17.9992 18L6 6.00085" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg></button></div><div role="separator" class="ayy-action-bar__separator"></div><div role="group" class="ayy-action-bar__actions"><button type="button" class="ayy-action-bar__button"><svg class="ayy-icon" data-ayy-icon="square-pen" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M16.4249 4.60509L17.4149 3.6151C18.2351 2.79497 19.5648 2.79497 20.3849 3.6151C21.205 4.43524 21.205 5.76493 20.3849 6.58507L19.3949 7.57506M16.4249 4.60509L9.76558 11.2644C9.25807 11.772 8.89804 12.4078 8.72397 13.1041L8 16L10.8959 15.276C11.5922 15.102 12.228 14.7419 12.7356 14.2344L19.3949 7.57506M16.4249 4.60509L19.3949 7.57506" stroke="currentColor" stroke-linejoin="round" stroke-width="1.5"></path><path d="M18.9999 13.5C18.9999 16.7875 18.9999 18.4312 18.092 19.5376C17.9258 19.7401 17.7401 19.9258 17.5375 20.092C16.4312 21 14.7874 21 11.4999 21H11C7.22876 21 5.34316 21 4.17159 19.8284C3.00003 18.6569 3 16.7712 3 13V12.5C3 9.21252 3 7.56879 3.90794 6.46244C4.07417 6.2599 4.2599 6.07417 4.46244 5.90794C5.56879 5 7.21252 5 10.5 5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg>Edit</button><button type="button" class="ayy-action-bar__button"><svg class="ayy-icon" data-ayy-icon="copy" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7.5 14.5C7.5 11.2002 7.5 9.55025 8.52513 8.52513C9.55025 7.5 11.2002 7.5 14.5 7.5C17.7998 7.5 19.4497 7.5 20.4749 8.52513C21.5 9.55025 21.5 11.2002 21.5 14.5C21.5 17.7998 21.5 19.4497 20.4749 20.4749C19.4497 21.5 17.7998 21.5 14.5 21.5C11.2002 21.5 9.55025 21.5 8.52513 20.4749C7.5 19.4497 7.5 17.7998 7.5 14.5Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M7.5 16.5C6.10355 16.5 5.40533 16.5 4.84402 16.3036C3.83866 15.9518 3.0482 15.1613 2.69641 14.156C2.5 13.5947 2.5 12.8964 2.5 11.5V9.5C2.5 6.20017 2.5 4.55025 3.52513 3.52513C4.55025 2.5 6.20017 2.5 9.5 2.5H11.5C12.8964 2.5 13.5947 2.5 14.156 2.69641C15.1613 3.0482 15.9518 3.83866 16.3036 4.84402C16.5 5.40533 16.5 6.10355 16.5 7.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg>Duplicate</button><button type="button" class="ayy-action-bar__button"><svg class="ayy-icon" data-ayy-icon="square-link" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M14.5563 13.2183C13.514 14.2606 11.8241 14.2606 10.7817 13.2183C9.73942 12.1759 9.73942 10.486 10.7817 9.44364L13.1409 7.0845C14.1357 6.08961 15.7206 6.04433 16.7692 6.94866M16.4437 3.78175C17.486 2.73942 19.1759 2.73942 20.2183 3.78175C21.2606 4.82408 21.2606 6.51403 20.2183 7.55636L17.8591 9.9155C16.8643 10.9104 15.2794 10.9557 14.2308 10.0513" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M10.4999 3C7.21257 3 5.56889 3 4.46256 3.9079C4.25998 4.07414 4.07423 4.25989 3.90798 4.46247C3.00007 5.56879 3.00006 7.21247 3.00002 10.4998L3 12.9999C2.99996 16.7712 2.99995 18.6568 4.17152 19.8284C5.3431 21 7.22873 21 11 21H13.4999C16.7874 21 18.4311 21 19.5375 20.092C19.74 19.9258 19.9257 19.7401 20.092 19.5376C20.9999 18.4312 20.9999 16.7875 20.9999 13.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg>Copy</button><button type="button" class="ayy-action-bar__button"><svg class="ayy-icon" data-ayy-icon="archive" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7 21H16.9999C19.3569 21 20.5354 21 21.2677 20.2678C21.9999 19.5355 21.9999 18.357 21.9999 16C21.9999 13.643 21.9999 12.4645 21.2677 11.7322C20.5354 11 19.3569 11 16.9999 11H7C4.64302 11 3.46453 11 2.7323 11.7322C2.00007 12.4644 2.00005 13.6429 2 15.9999C1.99995 18.357 1.99993 19.5355 2.73217 20.2677C3.4644 21 4.64294 21 7 21Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M4 11C4.00005 9.59977 4.00008 8.89966 4.27263 8.36485C4.5123 7.89455 4.89469 7.51218 5.365 7.27253C5.89981 7 6.59993 7 8.00015 7H16C17.4001 7 18.1002 7 18.635 7.27248C19.1054 7.51217 19.4878 7.89462 19.7275 8.36502C20 8.8998 20 9.59987 20 11" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M6 7C6.00004 5.5998 6.00006 4.89969 6.27259 4.3649C6.51227 3.89457 6.89467 3.51218 7.36501 3.27252C7.89981 3 8.59991 3 10.0001 3H14C15.4001 3 16.1002 3 16.635 3.27248C17.1054 3.51217 17.4878 3.89462 17.7275 4.36502C18 4.8998 18 5.59987 18 7" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M16 15L15.7 15.4C15.1111 16.1851 14.8167 16.5777 14.3944 16.7889C13.9721 17 13.4814 17 12.5 17H11.5C10.5186 17 10.0279 17 9.60557 16.7889C9.18328 16.5777 8.88885 16.1851 8.3 15.4L8 15" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg>Archive</button><div role="separator" class="ayy-action-bar__separator"></div><button type="button" class="ayy-action-bar__button ayy-action-bar__button--destructive"><svg class="ayy-icon" data-ayy-icon="trash" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M19.5 5.5L18.8803 15.5251C18.7219 18.0864 18.6428 19.3671 18.0008 20.2879C17.6833 20.7431 17.2747 21.1273 16.8007 21.416C15.8421 22 14.559 22 11.9927 22C9.42312 22 8.1383 22 7.17905 21.4149C6.7048 21.1257 6.296 20.7408 5.97868 20.2848C5.33688 19.3626 5.25945 18.0801 5.10461 15.5152L4.5 5.5" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path><path d="M3 5.5H21M16.0557 5.5L15.3731 4.09173C14.9196 3.15626 14.6928 2.68852 14.3017 2.39681C14.215 2.3321 14.1231 2.27454 14.027 2.2247C13.5939 2 13.0741 2 12.0345 2C10.9688 2 10.436 2 9.99568 2.23412C9.8981 2.28601 9.80498 2.3459 9.71729 2.41317C9.32164 2.7167 9.10063 3.20155 8.65861 4.17126L8.05292 5.5" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path><path d="M9.5 16.5L9.5 10.5" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path><path d="M14.5 16.5L14.5 10.5" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path></svg>Delete</button></div></div></ayy-action-bar></div>
</ayy-grid>
```

React:

```tsx
import { useState } from "react";
import {
  Archive02Icon,
  Copy01Icon,
  CopyLinkIcon,
  Delete02Icon,
  MoreHorizontalIcon,
  PencilEdit02Icon,
} from "@hugeicons/core-free-icons";
import {
  ActionBar,
  ActionBarActions,
  ActionBarButton,
  ActionBarClose,
  ActionBarCount,
  ActionBarSelection,
  ActionBarSeparator,
  Avatar,
  Badge,
  Button,
  Checkbox,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Grid,
  GridItem,
  GridItemActions,
  GridItemBody,
  GridItemDescription,
  GridItemFooter,
  GridItemHeader,
  GridItemSelect,
  GridItemTitle,
  GridSelectAll,
  GridToolbar,
  GridWrap,
  Icon,
  toast,
} from "@danitesler/ayywi/react";

const records = [
  {
    id: "usr-1",
    name: "Maya Lin",
    role: "Staff Product Designer · Design Systems",
    summary: "Owns token architecture, accessibility reviews and Figma library sync.",
    status: "Active",
    variant: "success",
    team: "Core UI",
  },
  {
    id: "usr-2",
    name: "Ari Cohen",
    role: "Lead Frontend Engineer · Platform",
    summary: "Maintains custom elements runtime, SSR pipelines and bundle budgets.",
    status: "In review",
    variant: "warning",
    team: "Web Runtime",
  },
  {
    id: "usr-3",
    name: "Noa Levi",
    role: "Content Strategist · Social & Growth",
    summary: "Manages Q4 launch campaigns, social post templates and release notes.",
    status: "Active",
    variant: "info",
    team: "Marketing",
  },
] as const;

export default function Example() {
  const [selected, setSelected] = useState<string[]>(["usr-1"]);
  const all = selected.length === records.length;
  const toggle = (id: string, on: boolean) =>
    setSelected((list) => (on ? [...list, id] : list.filter((x) => x !== id)));

  return (
    <GridWrap>
      <GridToolbar>
        <GridSelectAll>
          <Checkbox
            aria-label="Select all records"
            checked={all}
            indeterminate={selected.length > 0 && !all}
            onCheckedChange={(on) => setSelected(on ? records.map((r) => r.id) : [])}
          />
          <span>{selected.length ? `${selected.length} selected` : `${records.length} records`}</span>
        </GridSelectAll>
      </GridToolbar>

      <Grid>
        {records.map((person) => {
          const isSelected = selected.includes(person.id);
          return (
            <GridItem
              key={person.id}
              selected={isSelected}
              onSelectedChange={(on) => toggle(person.id, on)}
            >
              <GridItemHeader>
                <div className="ayy-cluster" style={{ "--ayy-gap": "var(--ayy-space-3)" } as React.CSSProperties}>
                  <GridItemSelect>
                    <Checkbox
                      aria-label={`Select ${person.name}`}
                      checked={isSelected}
                      onCheckedChange={(on) => toggle(person.id, on)}
                    />
                  </GridItemSelect>
                  <Avatar name={person.name} size="sm" />
                  <div>
                    <GridItemTitle>{person.name}</GridItemTitle>
                    <GridItemDescription>{person.role}</GridItemDescription>
                  </div>
                </div>
                <GridItemActions>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`Edit ${person.name}`}
                    onClick={() => toast(`Edit ${person.name}`)}
                  >
                    <Icon icon={PencilEdit02Icon} name="square-pen" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      variant="ghost"
                      size="icon-sm"
                      aria-label={`More actions for ${person.name}`}
                    >
                      <Icon icon={MoreHorizontalIcon} name="ellipsis" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>{person.name}</DropdownMenuLabel>
                      <DropdownMenuItem onSelect={() => toast(`Edit ${person.name}`)}>
                        <Icon icon={PencilEdit02Icon} name="square-pen" />
                        Edit record
                      </DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => toast.success(`Duplicated ${person.name}`)} shortcut="Mod+D">
                        <Icon icon={Copy01Icon} name="copy" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => toast.success(`Copied ${person.name}`)} shortcut="Mod+C">
                        <Icon icon={CopyLinkIcon} name="square-link" />
                        Copy profile link
                      </DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => toast(`Archived ${person.name}`)}>
                        <Icon icon={Archive02Icon} name="archive" />
                        Archive
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem destructive onSelect={() => toast.error(`Removed ${person.name}`)}>
                        <Icon icon={Delete02Icon} name="trash" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </GridItemActions>
              </GridItemHeader>

              <GridItemBody>
                <p>{person.summary}</p>
              </GridItemBody>

              <GridItemFooter>
                <Badge variant={person.variant}>{person.status}</Badge>
                <span>{person.team}</span>
              </GridItemFooter>
            </GridItem>
          );
        })}
      </Grid>

      <ActionBar open={selected.length > 0} onClear={() => setSelected([])}>
        <ActionBarSelection>
          <ActionBarCount>{selected.length} selected</ActionBarCount>
          <ActionBarClose />
        </ActionBarSelection>
        <ActionBarSeparator />
        <ActionBarActions>
          <ActionBarButton onClick={() => toast(`Editing ${selected.length} records`)}>
            <Icon icon={PencilEdit02Icon} name="square-pen" />
            Edit
          </ActionBarButton>
          <ActionBarButton onClick={() => toast.success(`Duplicated ${selected.length} records`)}>
            <Icon icon={Copy01Icon} name="copy" />
            Duplicate
          </ActionBarButton>
          <ActionBarButton onClick={() => toast.success(`Copied ${selected.length} records`)}>
            <Icon icon={CopyLinkIcon} name="square-link" />
            Copy
          </ActionBarButton>
          <ActionBarButton onClick={() => toast(`Archived ${selected.length} records`)}>
            <Icon icon={Archive02Icon} name="archive" />
            Archive
          </ActionBarButton>
          <ActionBarButton
            destructive
            onClick={() => {
              toast.error(`Deleted ${selected.length} records`);
              setSelected([]);
            }}
          >
            <Icon icon={Delete02Icon} name="trash" />
            Delete
          </ActionBarButton>
        </ActionBarActions>
      </ActionBar>
    </GridWrap>
  );
}
```

---
Part of @danitesler/ayywi 0.1.2: load `dist/ayywi.min.css` (and `dist/elements.global.js` for the <ayy-*> elements). The rules every screen follows: [llms-full.txt#rules](../llms-full.txt#rules). Every component: [llms.txt](../llms.txt).
