import { Breadcrumb } from "@danitesler/ayywi/react";

const ITEMS = [{ label: "Home", href: "#home" }, { label: "Case studies", href: "#work" }, { label: "Oktopost" }];

export default function Example() {
  return (
    <div className="ayy-stack">
      <Breadcrumb size="sm" aria-label="Breadcrumb, small" items={ITEMS} />
      <Breadcrumb aria-label="Breadcrumb, medium" items={ITEMS} />
      <Breadcrumb size="lg" aria-label="Breadcrumb, large" items={ITEMS} />
    </div>
  );
}
