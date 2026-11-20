"use client";

import { useEffect, useRef } from "react";

/* A short muted clip from a real film that loops while it is on screen and
   pauses when it scrolls away, so phones only decode what is visible.
   Reduced-motion visitors get the poster frame only. */
export function LoopVideo({
  src,
  poster,
  label,
  className = "",
  eager = false,
}: {
  src: string;
  poster: string;
  label: string;
  className?: string;
  eager?: boolean;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {});
        else video.pause();
      },
      { rootMargin: "120px 0px" },
    );
    io.observe(video);
    return () => io.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      className={`h-full w-full object-cover ${className}`}
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      preload={eager ? "auto" : "none"}
      aria-label={label}
      disablePictureInPicture
    />
  );
}
