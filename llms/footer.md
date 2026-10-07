# Footer

Category: Navigation. The site footer at the end of every website page: brand and a line about the product, columns of links, and a bottom row for copyright and legal links. Centred at page width like the navbar. Also called: footer, site-footer.

**Classes**
- `.ayy-footer` — Root <footer>, a hairline above it.
- `.ayy-footer__inner` — Centred grid at page width (--ayy-size-container) with the page gutter: brand beside the link columns, one column below 64rem.
- `.ayy-footer__brand` — Brand link (first <a>) and a short line (<p>) under it.
- `.ayy-footer__nav` — <nav aria-label="Footer">: link columns, as many as fit (9rem minimum).
- `.ayy-footer__group` — One column: a __heading over a __list.
- `.ayy-footer__heading` — The column heading, a small uppercase <p> that names the list (aria-labelledby).
- `.ayy-footer__list` — The <ul> of links in a column.
- `.ayy-footer__link` — A footer link: soft text, underline on hover, focus ring.
- `.ayy-footer__bottom` — The last row across the whole footer, above a hairline: copyright at the start, legal links or a theme toggle at the end.

**States**
- `default` — A hairline on top, brand and a muted line, columns of text-soft links under muted eyebrow headings, then a legal row.
- `hover` (`.ayy-footer__link:hover`) — Link turns text colour with a line-hover underline.
- `pressed` — doesn't apply: Links have no pressed look.
- `focus` (`.ayy-footer__link:focus-visible, brand link :focus-visible`) — 2px ring, 2px offset.
- `disabled` — doesn't apply: No disabled links; leave them out.
- `selected` — doesn't apply: No current-page look; the navbar shows where you are.
- `error` — doesn't apply: No error state.
- `loading` — doesn't apply: No loading state.

**Sizes**
- Density — Doesn't follow data-density.
- Width — Full width; content centred at --ayy-size-container. Brand beside the columns; one column below 64rem.

**JS (framework-free)**: footerClass, footerInnerClass, footerBrandClass, footerNavClass, footerGroupClass, footerHeadingClass, footerListClass, footerLinkClass, footerBottomClass constants.

**React** — `import { Footer, FooterBrand, FooterNav, FooterGroup, FooterLink, FooterBottom } from "@danitesler/ayywi/react";`
- `<Footer>` renders <footer class="ayy-footer"><div class="ayy-footer__inner">.
- `<FooterBrand>` renders <div class="ayy-footer__brand">.
- `<FooterNav>` renders <nav class="ayy-footer__nav">. Props: `aria-label` Defaults to "Footer" (translate it).
- `<FooterGroup>` renders <div class="ayy-footer__group"> with a heading <p> and a <ul>. Props: `label` The column heading. Names the list.
- `<FooterLink>` renders <li><a class="ayy-footer__link">.
- `<FooterBottom>` renders <div class="ayy-footer__bottom">.

**Accessibility**
- Use <footer> once per page, outside <main>: it's the contentinfo landmark.
- The link columns are a <nav aria-label="Footer">, distinct from the navbar's "Main".
- Each column's heading names its list, so screen readers announce "Product, list, 4 items".

**Do**
- Use the footer at the end of every page of a website, after <main>.
- Group links into two to four columns with one-word headings (Product, Company, Resources, Legal).
- Put the copyright and legal links in FooterBottom, and a theme toggle there too if the navbar doesn't have one.

**Don't**
- Don't use it inside the App shell — apps put account and help links in the sidebar's footer.
- Don't repeat every navbar link; the footer is for everything else people look for at the end.
- Don't put a call to action inside the footer grid — end the page with a closing Section instead.

## Footer — Site footer

HTML (also Vue/Svelte/Angular templates, server templates):

```html
<div style="inline-size: 100%">
  <footer class="ayy-footer">
    <div class="ayy-footer__inner">
      <div class="ayy-footer__brand">
        <a href="#top"><svg class="ayy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M8.64298 3.14559L6.93816 3.93362C4.31272 5.14719 3 5.75397 3 6.75C3 7.74603 4.31272 8.35281 6.93817 9.56638L8.64298 10.3544C10.2952 11.1181 11.1214 11.5 12 11.5C12.8786 11.5 13.7048 11.1181 15.357 10.3544L17.0618 9.56638C19.6873 8.35281 21 7.74603 21 6.75C21 5.75397 19.6873 5.14719 17.0618 3.93362L15.357 3.14559C13.7048 2.38186 12.8786 2 12 2C11.1214 2 10.2952 2.38186 8.64298 3.14559Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M20.788 11.0972C20.9293 11.2959 21 11.5031 21 11.7309C21 12.7127 19.6873 13.3109 17.0618 14.5072L15.357 15.284C13.7048 16.0368 12.8786 16.4133 12 16.4133C11.1214 16.4133 10.2952 16.0368 8.64298 15.284L6.93817 14.5072C4.31272 13.3109 3 12.7127 3 11.7309C3 11.5031 3.07067 11.2959 3.212 11.0972" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M20.3767 16.2661C20.7922 16.5971 21 16.927 21 17.3176C21 18.2995 19.6873 18.8976 17.0618 20.0939L15.357 20.8707C13.7048 21.6236 12.8786 22 12 22C11.1214 22 10.2952 21.6236 8.64298 20.8707L6.93817 20.0939C4.31272 18.8976 3 18.2995 3 17.3176C3 16.927 3.20778 16.5971 3.62334 16.2661" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></svg>Northwind</a>
        <p>Fast, accessible sites from a sentence. Made in Lisbon and Tel Aviv.</p>
      </div>
      <nav class="ayy-footer__nav" aria-label="Footer">
        <div class="ayy-footer__group">
          <p class="ayy-footer__heading" id="footer-site-1">Product</p>
          <ul class="ayy-footer__list" aria-labelledby="footer-site-1">
            <li><a class="ayy-footer__link" href="#features">Features</a></li>
            <li><a class="ayy-footer__link" href="#pricing">Pricing</a></li>
            <li><a class="ayy-footer__link" href="#changelog">Changelog</a></li>
          </ul>
        </div>
        <div class="ayy-footer__group">
          <p class="ayy-footer__heading" id="footer-site-2">Company</p>
          <ul class="ayy-footer__list" aria-labelledby="footer-site-2">
            <li><a class="ayy-footer__link" href="#about">About</a></li>
            <li><a class="ayy-footer__link" href="#careers">Careers</a></li>
            <li><a class="ayy-footer__link" href="#press">Press</a></li>
          </ul>
        </div>
        <div class="ayy-footer__group">
          <p class="ayy-footer__heading" id="footer-site-3">Help</p>
          <ul class="ayy-footer__list" aria-labelledby="footer-site-3">
            <li><a class="ayy-footer__link" href="#docs">Docs</a></li>
            <li><a class="ayy-footer__link" href="#status">Status</a></li>
            <li><a class="ayy-footer__link" href="#contact">Contact</a></li>
          </ul>
        </div>
      </nav>
      <div class="ayy-footer__bottom">
        <p>© 2026 Northwind Labs</p>
        <div class="ayy-cluster">
          <a class="ayy-link" href="#privacy">Privacy</a>
          <a class="ayy-link" href="#terms">Terms</a>
        </div>
      </div>
    </div>
  </footer>
</div>
```

React:

```tsx
import { Layers01Icon } from "@hugeicons/core-free-icons";
import { Footer, FooterBottom, FooterBrand, FooterGroup, FooterLink, FooterNav, Icon } from "@danitesler/ayywi/react";

export default function Example() {
  return (
    <div style={{ inlineSize: "100%" }}>
      <Footer>
        <FooterBrand>
          <a href="#top">
            <Icon icon={Layers01Icon} />
            Northwind
          </a>
          <p>Fast, accessible sites from a sentence. Made in Lisbon and Tel Aviv.</p>
        </FooterBrand>
        <FooterNav>
          <FooterGroup label="Product">
            <FooterLink href="#features">Features</FooterLink>
            <FooterLink href="#pricing">Pricing</FooterLink>
            <FooterLink href="#changelog">Changelog</FooterLink>
          </FooterGroup>
          <FooterGroup label="Company">
            <FooterLink href="#about">About</FooterLink>
            <FooterLink href="#careers">Careers</FooterLink>
            <FooterLink href="#press">Press</FooterLink>
          </FooterGroup>
          <FooterGroup label="Help">
            <FooterLink href="#docs">Docs</FooterLink>
            <FooterLink href="#status">Status</FooterLink>
            <FooterLink href="#contact">Contact</FooterLink>
          </FooterGroup>
        </FooterNav>
        <FooterBottom>
          <p>© 2026 Northwind Labs</p>
          <div className="ayy-cluster">
            <a className="ayy-link" href="#privacy">
              Privacy
            </a>
            <a className="ayy-link" href="#terms">
              Terms
            </a>
          </div>
        </FooterBottom>
      </Footer>
    </div>
  );
}
```

---
Part of @danitesler/ayywi 0.0.1: load `dist/ayywi.min.css` (and `dist/elements.global.js` for the <ayy-*> elements). The rules every screen follows: [llms-full.txt#rules](../llms-full.txt#rules). Every component: [llms.txt](../llms.txt).
