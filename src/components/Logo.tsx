/* Vaky Kids logo: the "V" is a baby dino (eye, smile, two back-spikes, a
   nod to the two marks over the Vaky.me V), then "aky" and a tilted "Kids"
   sticker. Same drawing as brand/vaky-kids-logo.svg. */

const palettes = {
  light: { letters: "#d93a26", face: "#fff", spikeA: "#ffd84d", spikeB: "#7ed9a6", sticker: "#3a2a6b", kids: "#ffd84d" },
  dark: { letters: "#fff8e1", face: "#3a2a6b", spikeA: "#ffd84d", spikeB: "#7ed9a6", sticker: "#d93a26", kids: "#fff8e1" },
};

export function Logo({ size = "md", onDark = false }: { size?: "md" | "lg"; onDark?: boolean }) {
  const p = onDark ? palettes.dark : palettes.light;
  return (
    <svg
      viewBox="86 240 840 600"
      role="img"
      aria-label="Vaky Kids"
      className={`block w-auto ${size === "lg" ? "h-20 md:h-24" : "h-14 md:h-[4.5rem]"}`}
    >
      <path d="M214 372 C 206 330 214 292 236 282 C 258 274 296 304 322 340 Z" fill={p.spikeA} />
      <path d="M300 346 C 300 300 312 262 336 252 C 360 244 392 280 410 318 Z" fill={p.spikeB} />
      <path
        d="M146 360 L264 614 L392 352"
        fill="none"
        stroke={p.letters}
        strokeWidth="100"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="246" cy="516" r="12" fill={p.face} />
      <path d="M276 548 Q 298 566 320 546" fill="none" stroke={p.face} strokeWidth="10" strokeLinecap="round" />
      <text
        x="390"
        y="580"
        fontWeight="800"
        fontSize="330"
        letterSpacing="-6"
        fill={p.letters}
        style={{ fontFamily: "var(--font-baloo)" }}
      >
        aky
      </text>
      <g transform="rotate(-8 610 690)">
        <rect x="430" y="610" width="360" height="160" rx="28" fill={p.sticker} />
        <text
          x="610"
          y="736"
          textAnchor="middle"
          fontWeight="800"
          fontSize="140"
          fill={p.kids}
          style={{ fontFamily: "var(--font-baloo)" }}
        >
          Kids
        </text>
      </g>
    </svg>
  );
}
