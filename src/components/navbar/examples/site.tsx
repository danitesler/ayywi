import { buttonClass, Navbar, NavbarActions, NavbarBrand, NavbarLink, NavbarNav } from "@danitesler/ayywi/react";

export default function Example() {
  return (
    <Navbar>
      <NavbarBrand href="#top">
        <span className="ayy-avatar ayy-avatar--sm" aria-hidden="true">
          <span className="ayy-avatar__fallback">DT</span>
        </span>
        <span className="ayy-signature">Dani Tesler</span>
      </NavbarBrand>
      <NavbarNav>
        <NavbarLink href="#work" current>
          Work
        </NavbarLink>
        <NavbarLink href="#projects">Projects</NavbarLink>
      </NavbarNav>
      <NavbarActions>
        <a className={buttonClass({ variant: "ring", size: "sm" })} href="#connect">
          Let's connect
        </a>
      </NavbarActions>
    </Navbar>
  );
}
