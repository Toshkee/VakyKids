/* Hand-drawn marks used as annotations around the page. Decorative only. */

type Props = { className?: string };

export function Sparkle({ className }: Props) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M12 1 C 13 8, 16 11, 23 12 C 16 13, 13 16, 12 23 C 11 16, 8 13, 1 12 C 8 11, 11 8, 12 1 Z" fill="currentColor" />
    </svg>
  );
}

/* A loose curved arrow, drawn left-to-right and pointing down-right. */
export function ArrowCurl({ className }: Props) {
  return (
    <svg viewBox="0 0 120 80" className={className} fill="none" aria-hidden="true">
      <path
        d="M6 10 C 40 2, 78 10, 92 40 C 98 52, 99 60, 98 68"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <path d="M86 58 L98 70 L108 56" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* Scribbled oval, for circling a word. Stretch it with width/height. */
export function Scribble({ className }: Props) {
  return (
    <svg viewBox="0 0 200 70" preserveAspectRatio="none" className={className} fill="none" aria-hidden="true">
      <path
        d="M120 8 C 60 2, 10 12, 8 34 C 6 58, 70 66, 120 62 C 170 58, 196 46, 192 28 C 188 10, 140 4, 96 10"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Squiggle({ className }: Props) {
  return (
    <svg viewBox="0 0 300 20" preserveAspectRatio="none" className={className} fill="none" aria-hidden="true">
      <path d="M3 14 C 60 4 120 18 180 9 S 270 6 297 10" stroke="currentColor" strokeWidth="7" strokeLinecap="round" />
    </svg>
  );
}
