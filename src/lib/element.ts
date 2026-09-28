// Shared bits for ayywi's custom elements. Everything is light DOM (no shadow root), so the regular ayywi CSS
// styles the markup and frameworks can render the children themselves.

/** HTMLElement in browsers; an inert class during server-side rendering so importing never crashes. */
export const ElementBase: typeof HTMLElement =
  typeof HTMLElement === "undefined" ? (class {} as unknown as typeof HTMLElement) : HTMLElement;

/** Give `el` an id if it has none, and return it. */
export function ensureId(el: Element, prefix = "ayy"): string {
  if (!el.id) el.id = `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
  return el.id;
}

/** Add `id` to a space-separated ARIA id-list attribute without duplicating it. */
export function addIdRef(el: Element, attribute: string, id: string): void {
  const ids = (el.getAttribute(attribute) ?? "").split(/\s+/).filter(Boolean);
  if (!ids.includes(id)) el.setAttribute(attribute, [...ids, id].join(" "));
}

/** Register a custom element once (safe to call repeatedly and during SSR). */
export function define(tag: string, ctor: CustomElementConstructor): void {
  if (typeof customElements !== "undefined" && !customElements.get(tag)) customElements.define(tag, ctor);
}

/** Dispatch a bubbling, composed CustomEvent. */
export function emit<T>(target: EventTarget, type: string, detail: T): boolean {
  return target.dispatchEvent(new CustomEvent(type, { detail, bubbles: true, composed: true, cancelable: true }));
}

/** First direct-ish descendant matching `selector` that belongs to `host` (not to a nested host of the same tag). */
export function own<T extends Element>(host: Element, selector: string): T[] {
  const tag = host.tagName.toLowerCase();
  return Array.from(host.querySelectorAll<T>(selector)).filter((el) => el.closest(tag) === host);
}
