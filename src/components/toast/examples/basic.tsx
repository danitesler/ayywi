import { Button, toast, type CardToastHandle } from "@danitesler/ayywi/react";

const SAMPLE_CAPTURE =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='560' height='350' viewBox='0 0 560 350'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0%' stop-color='%236366f1'/><stop offset='100%' stop-color='%23ec4899'/></linearGradient></defs><rect width='100%' height='100%' fill='url(%23g)'/><rect x='40' y='40' width='480' height='270' rx='12' fill='%23ffffff' fill-opacity='0.15'/></svg>";

const TOAST_TRIGGERS = [
  () => toast("Changes saved"),
  () => toast.success("Deployed", { description: "Marketing site is live." }),
  () =>
    toast("Project archived", {
      action: { label: "Undo", onClick: () => toast.info("Project restored") },
    }),
  () => toast.error("Build failed", { description: "3 type errors in api/server.ts" }),
  () => {
    let handle: CardToastHandle;
    handle = toast.card({
      src: SAMPLE_CAPTURE,
      alt: "Capture preview",
      centerActions: [
        { label: "Copy", onClick: () => handle.status({ tone: "success", text: "Copied" }, 1500) },
        { label: "Save", variant: "secondary", onClick: () => handle.status({ tone: "success", text: "Saved" }, 1500) },
      ],
    });
  },
  () =>
    toast.card({
      split: true,
      src: SAMPLE_CAPTURE,
      alt: "Screenshot preview",
      title: "Screenshot_2026-10-16.png",
      description: "1920×1080 • 1.2 MB",
      actions: [
        { label: "Copy", onClick: () => toast.info("Copied to clipboard") },
        { label: "Share", variant: "secondary", onClick: () => toast.info("Link copied") },
      ],
    }),
  () =>
    toast.long("npm i @danitesler/ayywi@latest --save-exact", {
      description: "Package installed. Add import '@danitesler/ayywi/css' to your entry file.",
    }),
];

export default function Example() {
  const triggerRandom = () => {
    const fn = TOAST_TRIGGERS[Math.floor(Math.random() * TOAST_TRIGGERS.length)];
    fn();
  };

  return (
    <Button variant="outline" onClick={triggerRandom}>
      Trigger random toast
    </Button>
  );
}
