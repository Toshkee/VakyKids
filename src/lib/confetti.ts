import gsap from "gsap";

const COLORS = ["#FFD84D", "#7FD3F7", "#FF8A7A", "#7ED9A6", "#C9B8FF", "#FFB3C1"];

/* A short confetti burst from a point on screen. Plain DOM + GSAP, removed
   when done. Skipped entirely for people who prefer reduced motion. */
export function confettiBurst(x: number, y: number, count = 46) {
  if (typeof window === "undefined") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const layer = document.createElement("div");
  layer.setAttribute("aria-hidden", "true");
  layer.style.cssText = "position:fixed;inset:0;pointer-events:none;z-index:100;overflow:hidden";
  document.body.appendChild(layer);

  const r = gsap.utils.random;
  for (let i = 0; i < count; i++) {
    const piece = document.createElement("span");
    const size = r(7, 13, 1);
    const round = Math.random() > 0.5;
    piece.style.cssText = `position:absolute;left:${x}px;top:${y}px;width:${size}px;height:${
      round ? size : size * 0.5
    }px;background:${COLORS[i % COLORS.length]};border-radius:${round ? "50%" : "2px"}`;
    layer.appendChild(piece);

    gsap
      .timeline()
      .to(piece, {
        x: r(-180, 180),
        y: r(-240, -70),
        rotation: r(-360, 360),
        duration: 0.6,
        ease: "power2.out",
      })
      .to(piece, { y: "+=300", opacity: 0, rotation: "+=180", duration: 1.1, ease: "power1.in" });
  }

  window.setTimeout(() => layer.remove(), 2000);
}
