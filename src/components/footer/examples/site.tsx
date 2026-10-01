import { Layers01Icon } from "@hugeicons/core-free-icons";
import { Footer, FooterBottom, FooterBrand, FooterGroup, FooterLink, FooterNav, Icon } from "ayywi/react";

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
