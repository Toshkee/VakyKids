/* Wordmark: the baby triceratops' head peeking over "Vaky", with "Kids" as a
   tilted sticker. Placeholder until a drawn logo exists. */
export function Logo({ size = "md", onDark = false }: { size?: "md" | "lg"; onDark?: boolean }) {
  const big = size === "lg";
  return (
    <span className="inline-flex items-end gap-1.5" aria-label="Vaky Kids">
      <svg viewBox="58 8 60 60" className={big ? "size-14" : "size-10"} aria-hidden="true">
        <ellipse cx="80" cy="36" rx="19" ry="21" fill="#FFB3C1" />
        <circle cx="69" cy="25" r="3" fill="#FF8FA3" />
        <circle cx="79" cy="19" r="3" fill="#FF8FA3" />
        <circle cx="90" cy="23" r="3" fill="#FF8FA3" />
        <circle cx="88" cy="48" r="18" fill="#7ED9A6" />
        <path d="M83 33 L85 20 L90 32 Z" fill="#FFF3C4" />
        <path d="M95 34 L99 22 L101 35 Z" fill="#FFF3C4" />
        <path d="M102 47 L113 42 L105 53 Z" fill="#FFF3C4" />
        <circle cx="93" cy="45" r="4.2" fill="#3A2A6B" />
        <circle cx="94.4" cy="43.6" r="1.4" fill="#fff" />
        <circle cx="98" cy="54" r="3.2" fill="#FF8FA3" opacity="0.7" />
        <path d="M89 57 Q94 61 99 57" stroke="#3A2A6B" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      </svg>
      <span
        aria-hidden="true"
        className={`font-display font-extrabold leading-none tracking-tight ${big ? "text-5xl" : "text-[1.7rem]"} ${
          onDark ? "text-cream" : "text-grape"
        }`}
      >
        Vaky
      </span>
      <span
        aria-hidden="true"
        className={`mb-0.5 inline-block -rotate-6 rounded-lg bg-coral-deep font-display font-bold leading-none text-white ${
          big ? "px-2.5 py-1.5 text-2xl" : "px-1.5 py-1 text-base"
        }`}
      >
        Kids
      </span>
    </span>
  );
}
