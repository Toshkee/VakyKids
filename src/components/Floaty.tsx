import type { ReactNode } from "react";

/* A decorative character that bobs on its own (CSS) and drifts with scroll
   (ParallaxController reads data-speed). The two motions sit on separate
   elements so their transforms never fight. */
export function Floaty({
  speed,
  className,
  slow,
  children,
}: {
  speed: number;
  className: string;
  slow?: boolean;
  children: ReactNode;
}) {
  return (
    <div data-speed={speed} aria-hidden="true" className={`pointer-events-none absolute ${className}`}>
      <div className={slow ? "animate-float-slow" : "animate-float"}>{children}</div>
    </div>
  );
}
