import { cx } from "../../lib/cx";
import { CloudUploadIcon } from "../../lib/icons";
import { iconSvg } from "../icon/icon";

export function dropzoneClass({ compact, className }: { compact?: boolean; className?: string } = {}): string {
  return cx("ayy-dropzone", compact && "ayy-dropzone--compact", className);
}

export const dropzoneTitleClass = "ayy-dropzone__title";
export const dropzoneHintClass = "ayy-dropzone__hint";

/** The upload glyph, as SVG markup (Hugeicons CloudUpload). */
export const dropzoneIcon = /* @__PURE__ */ iconSvg(CloudUploadIcon);

/** Does a drag carry files (not text or a link being dragged around the page)? */
export function dragHasFiles(event: DragEvent): boolean {
  return Array.from(event.dataTransfer?.types ?? []).includes("Files");
}

/**
 * Set data-dragging on .ayy-dropzone elements while files are held over them. Delegated from `root`, so zones added
 * later work too; ayywi/elements calls it for the document. Returns a cleanup.
 */
export function trackDropzones(root: Document | HTMLElement = document): () => void {
  const zoneOf = (target: EventTarget | null) => (target instanceof Element ? target.closest<HTMLElement>(".ayy-dropzone") : null);
  const onEnter = (event: Event) => {
    const zone = zoneOf(event.target);
    if (zone && dragHasFiles(event as DragEvent) && !zone.querySelector("input:disabled")) zone.setAttribute("data-dragging", "");
  };
  const onLeave = (event: Event) => {
    const zone = zoneOf(event.target);
    if (zone && !zone.contains((event as DragEvent).relatedTarget as Node | null)) zone.removeAttribute("data-dragging");
  };
  const onDrop = (event: Event) => zoneOf(event.target)?.removeAttribute("data-dragging");
  root.addEventListener("dragenter", onEnter);
  root.addEventListener("dragleave", onLeave);
  root.addEventListener("drop", onDrop);
  root.addEventListener("dragend", onDrop);
  return () => {
    root.removeEventListener("dragenter", onEnter);
    root.removeEventListener("dragleave", onLeave);
    root.removeEventListener("drop", onDrop);
    root.removeEventListener("dragend", onDrop);
  };
}
