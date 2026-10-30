import { useState, useEffect, type ReactNode } from "react";
import { Layers01Icon } from "@hugeicons/core-free-icons";
import {
  buttonClass,
  Icon,
  Label,
  Navbar,
  NavbarActions,
  NavbarBrand,
  NavbarLink,
  NavbarNav,
  NavbarToggle,
  Select,
  Switch,
} from "@danitesler/ayywi/react";

export default function Example({
  setControls,
}: {
  setControls?: (node: ReactNode) => void;
} = {}) {
  const [showBrandIcon, setShowBrandIcon] = useState(true);
  const [showAction, setShowAction] = useState(true);
  const [activePage, setActivePage] = useState("product");

  useEffect(() => {
    return () => setControls?.(null);
  }, [setControls]);

  useEffect(() => {
    if (!setControls) return;
    setControls(
      <div className="ayy-stack">
        <div className="ayy-stack">
          <div className="ayy-spread">
            <Label htmlFor="nv-page">Active page</Label>
            <div style={{ inlineSize: "7.5rem" }}>
              <Select
                id="nv-page"
                size="sm"
                value={activePage}
                onChange={(e) => setActivePage(e.target.value)}
              >
                <option value="product">Product</option>
                <option value="pricing">Pricing</option>
                <option value="customers">Customers</option>
                <option value="docs">Docs</option>
              </Select>
            </div>
          </div>
          <div className="ayy-spread">
            <Label htmlFor="nv-action">Action button</Label>
            <Switch id="nv-action" checked={showAction} onCheckedChange={setShowAction} />
          </div>
          <div className="ayy-spread">
            <Label htmlFor="nv-icon">Brand icon</Label>
            <Switch id="nv-icon" checked={showBrandIcon} onCheckedChange={setShowBrandIcon} />
          </div>
        </div>
      </div>
    );
  }, [setControls, activePage, showAction, showBrandIcon]);

  // Below 48rem the links fold into a panel under the bar; the menu button at the end opens it.
  return (
    <div style={{ inlineSize: "100%" }}>
      <Navbar>
        <NavbarBrand href="#top">
          {showBrandIcon ? <Icon icon={Layers01Icon} name="layers" /> : null}
          Northwind
        </NavbarBrand>
        <NavbarNav>
          <NavbarLink href="#product" current={activePage === "product"}>
            Product
          </NavbarLink>
          <NavbarLink href="#pricing" current={activePage === "pricing"}>
            Pricing
          </NavbarLink>
          <NavbarLink href="#customers" current={activePage === "customers"}>
            Customers
          </NavbarLink>
          <NavbarLink href="#docs" current={activePage === "docs"}>
            Docs
          </NavbarLink>
        </NavbarNav>
        {showAction ? (
          <NavbarActions>
            <a className={buttonClass({ variant: "ring", size: "sm" })} href="#start">
              Start free
            </a>
          </NavbarActions>
        ) : null}
        <NavbarToggle />
      </Navbar>
    </div>
  );
}
