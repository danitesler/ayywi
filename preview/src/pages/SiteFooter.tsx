import { Footer, FooterBottom, FooterBrand, FooterGroup, FooterLink, FooterNav } from "@danitesler/ayywi/react";
import { version } from "../../../package.json";
import { GITHUB } from "../routes";

/** Under the full-width pages (home, examples, themes). */
export function SiteFooter() {
  return (
    <Footer className="pv-footer">
      <FooterBrand>
        <a href="#/">
          <svg className="ayy-icon" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="3" />
          </svg>
          ayywi
        </a>
        <p>A framework-agnostic design system that AI tools can follow.</p>
      </FooterBrand>
      <FooterNav>
        <FooterGroup label="Docs">
          <FooterLink href="#/docs/get-started">Get started</FooterLink>
          <FooterLink href="#/docs/colors">Foundations</FooterLink>
          <FooterLink href="#/docs/changelog">Changelog</FooterLink>
        </FooterGroup>
        <FooterGroup label="Explore">
          <FooterLink href="#/components">Components</FooterLink>
          <FooterLink href="#/examples">Examples</FooterLink>
          <FooterLink href="#/themes">Themes</FooterLink>
        </FooterGroup>
        <FooterGroup label="For AI tools">
          <FooterLink href="llms.txt">llms.txt</FooterLink>
          <FooterLink href="llms-full.txt">llms-full.txt</FooterLink>
          <FooterLink href="manifest/components.json">components.json</FooterLink>
        </FooterGroup>
      </FooterNav>
      <FooterBottom>
        <p>MIT licence · v{version}</p>
        <div className="ayy-cluster">
          <a className="ayy-link" href={GITHUB} target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a className="ayy-link" href="https://www.npmjs.com/package/@danitesler/ayywi" target="_blank" rel="noreferrer">
            npm
          </a>
        </div>
      </FooterBottom>
    </Footer>
  );
}
