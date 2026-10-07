import { Layers01Icon } from "@hugeicons/core-free-icons";
import { buttonClass, Icon, Navbar, NavbarActions, NavbarBrand, NavbarLink, NavbarNav, NavbarToggle } from "@danitesler/ayywi/react";

export default function Example() {
  // Below 48rem the links fold into a panel under the bar; the menu button at the end opens it.
  return (
    <div style={{ inlineSize: "100%" }}>
      <Navbar>
        <NavbarBrand href="#top">
          <Icon icon={Layers01Icon} />
          Northwind
        </NavbarBrand>
        <NavbarNav>
          <NavbarLink href="#product" current>
            Product
          </NavbarLink>
          <NavbarLink href="#pricing">Pricing</NavbarLink>
          <NavbarLink href="#customers">Customers</NavbarLink>
          <NavbarLink href="#docs">Docs</NavbarLink>
        </NavbarNav>
        <NavbarActions>
          <a className={buttonClass({ variant: "ring", size: "sm" })} href="#start">
            Start free
          </a>
        </NavbarActions>
        <NavbarToggle />
      </Navbar>
    </div>
  );
}
