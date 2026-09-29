export const carouselClass = "ayy-carousel";
export const carouselTrackClass = "ayy-carousel__track";
export const carouselSlideClass = "ayy-carousel__slide";
export const carouselControlsClass = "ayy-carousel__controls";

/**
 * Wires a carousel inside `root`: [data-ayy-prev] / [data-ayy-next] buttons scroll the .ayy-carousel__track by one
 * slide (RTL-aware, smooth unless the user prefers reduced motion) and get aria-disabled at either end. Slides
 * without a label are named "2 of 6". Framework-free; returns a cleanup function.
 */
export function connectCarousel(root: HTMLElement): () => void {
  const track = root.querySelector<HTMLElement>(".ayy-carousel__track");
  if (!track) return () => {};
  let frame = 0;

  const slides = () => Array.from(track.querySelectorAll<HTMLElement>(".ayy-carousel__slide"));

  const label = () => {
    const list = slides();
    list.forEach((slide, i) => {
      if (!slide.hasAttribute("role")) slide.setAttribute("role", "group");
      if (!slide.hasAttribute("aria-roledescription")) slide.setAttribute("aria-roledescription", "slide");
      if (!slide.hasAttribute("aria-labelledby") && (!slide.hasAttribute("aria-label") || slide.dataset.ayyAutoLabel !== undefined)) {
        slide.setAttribute("aria-label", `${i + 1} of ${list.length}`);
        slide.dataset.ayyAutoLabel = "";
      }
    });
  };

  const update = () => {
    frame = 0;
    const max = track.scrollWidth - track.clientWidth;
    const position = Math.abs(track.scrollLeft);
    for (const button of root.querySelectorAll<HTMLElement>("[data-ayy-prev]")) button.setAttribute("aria-disabled", String(position <= 1));
    for (const button of root.querySelectorAll<HTMLElement>("[data-ayy-next]")) button.setAttribute("aria-disabled", String(position >= max - 1));
  };

  const schedule = () => {
    if (!frame) frame = requestAnimationFrame(update);
  };

  const step = (direction: 1 | -1) => {
    const slide = slides()[0];
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    const amount = slide ? slide.offsetWidth + gap : track.clientWidth * 0.8;
    const rtl = getComputedStyle(track).direction === "rtl";
    const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    track.scrollBy({ left: (rtl ? -1 : 1) * direction * amount, behavior: smooth ? "smooth" : "auto" });
  };

  const onClick = (event: Event) => {
    const button = (event.target as Element | null)?.closest<HTMLElement>("[data-ayy-prev], [data-ayy-next]");
    if (!button || !root.contains(button) || button.getAttribute("aria-disabled") === "true") return;
    step(button.hasAttribute("data-ayy-next") ? 1 : -1);
  };

  const resize = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(schedule);
  resize?.observe(track);
  const mutations = new MutationObserver(() => {
    label();
    schedule();
  });
  mutations.observe(track, { childList: true });
  root.addEventListener("click", onClick);
  track.addEventListener("scroll", schedule, { passive: true });
  label();
  update();

  return () => {
    cancelAnimationFrame(frame);
    resize?.disconnect();
    mutations.disconnect();
    root.removeEventListener("click", onClick);
    track.removeEventListener("scroll", schedule);
  };
}
