import { Button } from "ayywi/react";
import type { DensityMode, ThemeMode } from "ayywi";
import { components } from "./data";
import { ComponentPage } from "./pages/ComponentPage";
import { HomePage } from "./pages/HomePage";
import { TokensPage } from "./pages/TokensPage";
import { useHashRoute, useSettings, type Brand, type Direction, type Renderer } from "./settings";

function Segmented<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: [T, string][];
  onChange: (value: T) => void;
}) {
  return (
    <div className="pv-seg" role="group" aria-label={label}>
      <span className="pv-seg__label">{label}</span>
      {options.map(([key, text]) => (
        <Button key={key} size="sm" variant={value === key ? "secondary" : "ghost"} aria-pressed={value === key} onClick={() => onChange(key)}>
          {text}
        </Button>
      ))}
    </div>
  );
}

export function App() {
  const route = useHashRoute();
  const { theme, setTheme, density, setDensity, brand, setBrand, renderer, setRenderer, dir, setDir } = useSettings();
  const component = components.find((c) => c.slug === route);
  const isComponent = Boolean(component);

  const link = (slug: string, text: string) => (
    <a href={`#/${slug}`} className="pv-nav__link" aria-current={route === slug ? "page" : undefined}>
      {text}
    </a>
  );

  return (
    <div className="pv-shell">
      <aside className="pv-sidebar ayy-scroll">
        <a href="#/" className="pv-brand">
          <span className="pv-brand__mark" aria-hidden="true" />
          ayywi
        </a>
        <nav className="pv-nav" aria-label="Design system">
          <p className="ayy-eyebrow pv-nav__group">Start</p>
          {link("", "Overview")}
          {link("tokens", "Tokens")}
          <p className="ayy-eyebrow pv-nav__group">Components</p>
          {components.map((c) => (
            <span key={c.slug}>{link(c.slug, c.name)}</span>
          ))}
        </nav>
      </aside>

      <div className="pv-main">
        <div className="pv-toolbar">
          <Segmented<ThemeMode>
            label="Theme"
            value={theme}
            onChange={setTheme}
            options={[
              ["system", "System"],
              ["dark", "Dark"],
              ["light", "Light"],
            ]}
          />
          <Segmented<DensityMode>
            label="Density"
            value={density}
            onChange={setDensity}
            options={[
              ["auto", "Auto"],
              ["compact", "Compact"],
              ["comfortable", "Comfortable"],
              ["touch", "Touch"],
            ]}
          />
          <Segmented<Brand>
            label="Brand"
            value={brand}
            onChange={setBrand}
            options={[
              ["default", "Default"],
              ["violet", "Violet"],
            ]}
          />
          <Segmented<Direction>
            label="Direction"
            value={dir}
            onChange={setDir}
            options={[
              ["ltr", "LTR"],
              ["rtl", "RTL"],
            ]}
          />
          {isComponent ? (
            <Segmented<Renderer>
              label="Render with"
              value={renderer}
              onChange={setRenderer}
              options={[
                ["react", "React"],
                ["html", "Plain HTML"],
              ]}
            />
          ) : null}
        </div>

        <main className="pv-content" id="main">
          {component ? (
            <ComponentPage key={component.slug} component={component} renderer={renderer} dir={dir} />
          ) : route === "tokens" ? (
            <div dir={dir}>
              <TokensPage />
            </div>
          ) : (
            <div dir={dir}>
              <HomePage />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
