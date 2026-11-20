"use client";

import { useEffect, useRef } from "react";
import { confettiBurst } from "@/lib/confetti";

/* Mounts the 3D toy layer once the page is idle. three.js is loaded only
   here, as its own chunk, and not at all for reduced-motion visitors or
   browsers without WebGL. */
export function ToyWorld() {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = canvas.current;
    if (!el) return;
    let dispose: (() => void) | undefined;
    let cancelled = false;

    const start = async () => {
      await document.fonts.ready;
      const { createToyWorld } = await import("./scene");
      if (cancelled) return;
      const heading = document.querySelector("h1, h2");
      const font = heading ? getComputedStyle(heading).fontFamily : "sans-serif";
      try {
        dispose = createToyWorld(el, { font, onPop: (x, y) => confettiBurst(x, y, 28) });
        el.style.opacity = "1";
      } catch {
        // No WebGL: the site works the same without toys.
      }
    };

    const idle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 400));
    const id = idle(() => void start());
    return () => {
      cancelled = true;
      if (typeof id === "number" && window.cancelIdleCallback) window.cancelIdleCallback(id);
      dispose?.();
    };
  }, []);

  return (
    <canvas
      ref={canvas}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-30 size-full opacity-0 transition-opacity duration-700"
    />
  );
}
