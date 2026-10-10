# ayywi

A design system built for product managers, designers, and AI builders.

When you ask an AI tool to build UI, you usually get five mismatched shades of grey, broken mobile layouts, and missing empty states. **ayywi** fixes that. It gives your AI tools a strict contract of design tokens, accessible components, and responsive product shells—so every screen comes out looking like a senior product designer built it.

- **Small:** zero runtime dependencies, ~24 kB of CSS gzipped for all 66 components.
- **Built for AI tools:** one prompt or one MCP connection gives your agent the full contract, component specs, and real-time linter.
- **Production-ready polish:** every view includes empty, loading, and error states; every control has focus rings, keyboard support, ARIA, RTL, and Windows High Contrast.
- **Themes & density:** four themes (`dark`, `light`, `dark-contrast`, `light-gray`) and three densities (`compact`, `comfortable`, `touch`), driven by single attributes.
- **Responsive by contract:** apps automatically switch from a desktop sidebar to a mobile top bar and bottom nav; websites fold into a phone menu without custom media queries.

## Why ayywi?

| Role | What you get |
|---|---|
| **Product Managers & Founders** | Ship finished software instead of half-baked prototypes. Screens handle real-world states (loading skeletons, zero-data empties, network errors) and work on phones out of the box with zero runtime dependencies. |
| **Designers** | A token-driven system with four themes and a one-colour brand generator that guarantees WCAG contrast (4.5:1 text, 3:1 controls). Clean typography, Hugeicons glyphs, and seamless dark and high-contrast modes. |
| **AI Builders** | Stop fixing hallucinated CSS and random Tailwind colours. AI agents (Cursor, Claude Code, Lovable, Bolt, v0, ChatGPT) use ayywi's strict classes and tokens to build consistent UI on the first try. |

## Start building in one prompt

You don't need manual npm installs or complex framework configurations. Your AI agent sets up and builds everything from a single prompt.

### 1. Web app builders (Lovable, Bolt, v0, Replit)

Paste this into your chat when starting an app:

```markdown
Style this project with the ayywi design system. Link these in <head>:
<script src="https://danitesler.github.io/ayywi/dist/theme-init.js"></script>
<link rel="stylesheet" href="https://danitesler.github.io/ayywi/dist/fonts.css">
<link rel="stylesheet" href="https://danitesler.github.io/ayywi/dist/ayywi.min.css">
<script src="https://danitesler.github.io/ayywi/dist/elements.global.js" defer></script>

Rules:
- Use only ayywi classes (ayy-*) and tokens (--ayy-*). Read https://danitesler.github.io/ayywi/llms-full.txt for the component contract, responsive rules, and copy-ready patterns.
- An app uses .ayy-app-shell (sidebar on wide screens, top bar + bottom nav on phones).
- Every list and table must include a loading state (.ayy-skeleton), an empty state (.ayy-empty-state), and an error state (.ayy-alert--destructive with retry).
- No hardcoded colours. Dark and light themes follow data-theme on <html>.
```

### 2. Coding agents (Cursor, Claude Code, Windsurf)

Connect ayywi's Model Context Protocol (MCP) server so your agent can inspect components, search tokens, and lint its own UI:

```json
{
  "mcpServers": {
    "ayywi": {
      "command": "npx",
      "args": ["-y", "@danitesler/ayywi", "mcp"]
    }
  }
}
```

Or ask your agent to initialize ayywi in an existing codebase:

```sh
npx @danitesler/ayywi init
```

This sets up the agent skill, Cursor rules, AGENTS.md guide, and MCP server automatically.

### 3. Interactive prompt generator

Visit the live **[Get Started](https://danitesler.github.io/ayywi/#/)** page in the preview:
- Pick your product type (Dashboard, Booking, Store, Support Inbox, Settings, Landing Page).
- Customize who it's for and what it needs.
- Select your target AI tool (Lovable, Bolt, v0, Cursor, Claude Code, Replit, ChatGPT) to get a tailored prompt.
- Copy one-click refinement prompts for mobile polish, dark mode, button consistency, and missing states.

## Product shells & responsive layouts

ayywi eliminates custom responsive CSS by providing built-in layout contracts:

- **Web Apps (`App shell`):** On wide screens, renders a desktop sidebar with a collapsible icon rail. On phones, automatically transforms into a top brand bar and bottom tab navigation.
- **Websites (`Navbar`):** Full horizontal navigation on desktop; automatically collapses into an accessible mobile menu button on screens below 48rem.
- **Settings & Full-Screen Views:** Notion- and Cursor-style full-screen settings with split master-detail on desktop and drill-down navigation on phones.

## Brand in one colour

ayywi is monochrome until you brand it. Give it one seed colour and a corner preference:

```sh
npx ayywi brand "#0ea5e9" --name acme --shape soft
```

The brand engine automatically:
1. Generates an 11-step colour scale (`--ayy-brand-50` … `--ayy-brand-950`).
2. Mathematically selects primary button fills (3:1 contrast) and text (4.5:1 contrast) across dark and light themes.
3. Sets focus ring tokens and corner radiuses (`pill`, `round`, `soft`, `sharp`).

AI agents can also generate brands on the fly using the MCP tool `create_brand`.

## Themes and density

Apply themes and density modes with single HTML attributes on `<html>` or any container:

```html
<html data-theme="dark-contrast" data-density="comfortable">
```

| Theme | Appearance |
|---|---|
| *(none)* | Follows the user's operating system (dark or light) |
| `dark` / `light` | The default clean dark and light palettes |
| `dark-contrast` | Pure OLED black page with high-contrast cards |
| `light-gray` | Clean white cards on a grey canvas |

Densities include `compact` (desktop default), `comfortable` (looser spacing), and `touch` (automatically activated on mobile devices for 44px+ tap targets).

## Components

| Category | Components |
|---|---|
| Actions | Button, Toolbar, Dropdown menu, Command palette, Floating action button, Theme toggle |
| Navigation | Navbar, App shell, Bottom nav, Top bar, Footer, Breadcrumb, Pagination, Steps, Contents |
| Forms | Field, Input, Input group, Search bar, Textarea, Select, Combobox, Tag input, Calendar (and date picker), Checkbox, Radio, Segmented control, Chip, Swatch, Choice card, Slider, Number field, File upload, Switch, Shortcut (keys and recorder), Settings |
| Layout | Page header, Section, Card, Tabs, Accordion, Carousel, Separator |
| Overlays | Dialog (centred, side modal or bottom sheet), Popover, Tooltip |
| Feedback | Alert, Toast, Progress, Progress ring, Spinner, Skeleton, Empty state |
| Data display | Badge, Kbd, Avatar, Icon, Icon tile, Stat, List, Data list, Swipe actions, Frame, Chat, Table, Chart |

Layout utilities (`.ayy-stack`, `.ayy-cluster`, `.ayy-spread`, `.ayy-grid`, `.ayy-split`) and a marketing site kit (containers, hero type, scroll reveal) handle the structure between components.

## Explore live

Visit the [interactive preview](https://danitesler.github.io/ayywi/):
- **7 full-scale showcase apps:** Dashboard, Marketing site, Support inbox, Settings, Habit tracker, Store, Booking app (viewable at desktop, tablet, and mobile sizes).
- **Component browser:** Every component with live interactive stages, theme toggles, and copy-ready HTML and React code.
- **Brand playground:** Test your brand colour and corner radius in real time.

## Working on ayywi

Instructions for contributors and agents modifying ayywi itself are in [AGENTS.md](AGENTS.md). Changes are tracked in [CHANGELOG.md](CHANGELOG.md).

```sh
pnpm build && pnpm typecheck && pnpm check && pnpm test
scripts/check-all.sh
```

## License

MIT
