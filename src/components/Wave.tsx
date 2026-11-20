/* A wavy top edge for a section. Sits just above the section, overlapping the
   one before it, and is filled with the section's own background colour. */
export function Wave({ fill }: { fill: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1440 80"
      preserveAspectRatio="none"
      className="pointer-events-none absolute bottom-full left-0 h-8 w-full translate-y-px md:h-14"
      style={{ fill }}
    >
      <path d="M0 48 C 180 88 360 8 540 40 S 900 88 1080 44 S 1340 4 1440 36 V80 H0 Z" />
    </svg>
  );
}
