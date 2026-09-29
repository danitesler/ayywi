import { Breadcrumb } from "ayywi/react";

export default function Example() {
  return (
    <>
      <Breadcrumb
        items={[
          { label: "Home", href: "#home" },
          { label: "Case studies", href: "#work" },
          { label: "Oktopost" },
        ]}
      />
      <Breadcrumb pill aria-label="Breadcrumb, pill" items={[{ label: "Home", href: "#home" }, { label: "My projects" }]} />
    </>
  );
}
