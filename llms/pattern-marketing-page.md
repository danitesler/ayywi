# Marketing page

A public website, landing page or product site: a skip link, a sticky glass Navbar that folds into a menu on phones, sections at .ayy-container width separated by fading Separators (hero with .ayy-bg-grid, feature Cards with IconTiles, pricing Cards with a Segmented control, FAQ Accordion), and a multi-column Footer.

Built from: Navbar, Button, Badge, Card, Icon tile, Frame, Segmented control, List, Accordion, Separator, Footer. Example: Navbar → "Site header" (`get_component navbar`, llms/navbar.md).

**How**
1. Top of page: start <body> with an .ayy-skip-link pointing to #main (and an empty .ayy-scroll-progress div for long reads), followed by a Navbar (NavbarBrand, NavbarNav of NavbarLinks with current on the active page, NavbarActions with a theme DropdownMenu and one small ring Button for the primary CTA, and a NavbarToggle last).
2. Hero: inside <main id="main">, open with a hero section wrapped in .ayy-bg-grid and .ayy-container: a status or announcement Badge, a heading in .ayy-display or .ayy-h1 (with .ayy-gradient-text or .ayy-accent-text on the key phrase), an .ayy-lede intro paragraph (capped at --ayy-size-measure), a cluster with one ring Button and one outline Button, and the product visual inside a Frame.
3. Sections: separate major blocks with <Separator fade /> inside .ayy-container. Give each section an .ayy-eyebrow label, an .ayy-h2 heading, and an .ayy-lede description before its content grid, and add .ayy-reveal to blocks so they fade and lift in on scroll.
4. Features & spotlights: lay out features in an .ayy-grid of Cards (interactive and spotlight when clickable, with --ayy-spot set to a distinct --ayy-accent-* token per card) holding an IconTile, CardTitle and CardDescription.
5. Pricing & FAQ: build pricing with a SegmentedControl (Monthly / Yearly) above an .ayy-grid of plan Cards (the recommended plan gets featured and a Badge; perks use a List compact with check icons). Build the FAQ with an Accordion single centered at --ayy-size-measure.
6. Footer: close the page with a Footer containing FooterBrand (logo, tagline), FooterNav of FooterGroups (Product, Docs, Company, Legal), and FooterBottom (copyright and secondary links).

**Phones**
- Below 48rem the Navbar automatically hides inline links and opens them in a surface panel below the header when NavbarToggle is pressed; NavbarBrand and NavbarActions stay visible in the bar.
- .ayy-container switches its inline gutter from 24px to 16px below 64rem, and .ayy-display scales fluidly down to 44px on phones without custom media queries.
- Feature and pricing .ayy-grid layouts collapse to a single column automatically when the viewport is narrower than two --ayy-min tracks.

**Specs** (don't restyle these)
- **Site header (.ayy-navbar)**: Sticky top 0, --ayy-size-header (72px) tall, --ayy-color-glass backdrop with 16px blur, 1px --ayy-color-hairline bottom border. Inner row centred at --ayy-size-container (1400px) with 24px gutter (16px below 64rem).
- **Hero & section typography**: Hero title uses .ayy-display (fluid 2.75rem to 12.5rem, tight leading) or .ayy-h1 (3rem). Section titles use .ayy-eyebrow (12px uppercase, tracked) above .ayy-h2 (2.25rem) and .ayy-lede (1.125rem, --ayy-color-text-soft, max-inline-size --ayy-size-measure).
- **Primary call to action (.ayy-button--ring)**: Marketing pages use the ring variant for the primary CTA in the hero and repeat it (size sm) in NavbarActions; supporting actions use outline or ghost.
- **Footer (.ayy-footer)**: 1px --ayy-color-hairline top border, --ayy-space-12 block padding, inner content at --ayy-size-container width.

**Do**
- Use this anatomy for every landing page, marketing site, documentation home or portfolio.
- Keep the chrome (Navbar, Footer, page background) monochrome and let colour come from content via --ayy-spot (--ayy-accent-*) on cards, icon tiles and section highlights.
- Include a NavbarToggle in every Navbar so phone navigation works without custom CSS.

**Don't**
- Don't use a Navbar in a signed-in product or dashboard — use AppShell with BottomNav.
- Don't tint the Navbar, Footer or page background per section.
- Don't put more than one ring CTA button in the Navbar or hero.

---
A pattern of @danitesler/ayywi 0.1.2. Every pattern and rule: [llms-full.txt#patterns](../llms-full.txt#patterns).
