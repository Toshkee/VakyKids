/* Placeholder cast drawn in SVG. Swap for stills of the real film characters
   once there are some to show. All are decorative. */

type Props = { className?: string };

export function Dino({ className }: Props) {
  return (
    <svg viewBox="0 0 120 100" className={className} aria-hidden="true">
      <path d="M30 62 Q8 58 6 74 Q18 74 32 70 Z" fill="#7ED9A6" />
      <ellipse cx="56" cy="62" rx="32" ry="23" fill="#7ED9A6" />
      <ellipse cx="52" cy="68" rx="18" ry="12" fill="#B8F0CF" />
      <rect x="34" y="74" width="13" height="18" rx="6.5" fill="#5CC489" />
      <rect x="62" y="74" width="13" height="18" rx="6.5" fill="#5CC489" />
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
  );
}

export function Rocket({ className }: Props) {
  return (
    <svg viewBox="0 0 60 100" className={className} aria-hidden="true">
      <path
        d="M22 76 Q30 100 38 76 Z"
        fill="#FFB547"
        className="animate-flicker"
        style={{ transformOrigin: "30px 76px" }}
      />
      <path d="M18 54 L5 76 L20 72 Z" fill="#D93A26" stroke="#3A2A6B" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M42 54 L55 76 L40 72 Z" fill="#D93A26" stroke="#3A2A6B" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M30 4 C 46 18 46 52 42 76 L18 76 C 14 52 14 18 30 4 Z" fill="#fff" stroke="#3A2A6B" strokeWidth="3" />
      <path d="M30 5 C 37 11 40 16 41.5 21 L18.5 21 C 20 16 23 11 30 5 Z" fill="#D93A26" />
      <circle cx="30" cy="38" r="8" fill="#7FD3F7" stroke="#3A2A6B" strokeWidth="3" />
    </svg>
  );
}

export function Star({ className }: Props) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <path
        d="M50 6 L62 36 L94 38 L69 58 L78 90 L50 72 L22 90 L31 58 L6 38 L38 36 Z"
        fill="#FFD84D"
        stroke="#3A2A6B"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <circle cx="42" cy="50" r="3.5" fill="#3A2A6B" />
      <circle cx="58" cy="50" r="3.5" fill="#3A2A6B" />
      <path d="M44 58 Q50 64 56 58" stroke="#3A2A6B" strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export function Balloon({ className, color = "#FF8FA3" }: Props & { color?: string }) {
  return (
    <svg viewBox="0 0 60 112" className={className} aria-hidden="true">
      <path d="M30 70 Q22 84 32 94 T 30 110" stroke="#3A2A6B" strokeWidth="2" fill="none" />
      <ellipse cx="30" cy="34" rx="26" ry="31" fill={color} stroke="#3A2A6B" strokeWidth="3" />
      <path d="M25 64 L35 64 L30 71 Z" fill={color} stroke="#3A2A6B" strokeWidth="2.5" strokeLinejoin="round" />
      <ellipse cx="20" cy="22" rx="5" ry="9" fill="#fff" opacity="0.55" />
    </svg>
  );
}

export function Cloud({ className }: Props) {
  return (
    <svg viewBox="0 0 120 60" className={className} aria-hidden="true">
      <g fill="#fff">
        <circle cx="35" cy="35" r="20" />
        <circle cx="60" cy="25" r="24" />
        <circle cx="85" cy="35" r="20" />
        <rect x="25" y="34" width="70" height="22" rx="11" />
      </g>
    </svg>
  );
}

export function Planet({ className }: Props) {
  return (
    <svg viewBox="0 0 120 80" className={className} aria-hidden="true">
      <ellipse cx="60" cy="42" rx="56" ry="13" fill="none" stroke="#FFD84D" strokeWidth="5" transform="rotate(-12 60 42)" />
      <circle cx="60" cy="40" r="26" fill="#FF8A7A" />
      <circle cx="51" cy="32" r="5" fill="#FFB3C1" />
      <circle cx="68" cy="48" r="3.5" fill="#FFB3C1" />
      <path d="M8 50 A 56 13 -12 0 0 112 28" fill="none" stroke="#FFD84D" strokeWidth="5" transform="rotate(-12 60 42)" />
    </svg>
  );
}

export function Chest({ className }: Props) {
  return (
    <svg viewBox="0 0 100 80" className={className} aria-hidden="true">
      <circle cx="30" cy="22" r="7" fill="#FFD84D" stroke="#3A2A6B" strokeWidth="2.5" />
      <circle cx="50" cy="16" r="7" fill="#FFD84D" stroke="#3A2A6B" strokeWidth="2.5" />
      <circle cx="69" cy="22" r="7" fill="#FFD84D" stroke="#3A2A6B" strokeWidth="2.5" />
      <path d="M12 34 Q50 8 88 34 Z" fill="#B5652A" stroke="#3A2A6B" strokeWidth="3" strokeLinejoin="round" />
      <rect x="12" y="34" width="76" height="40" rx="4" fill="#C9773A" stroke="#3A2A6B" strokeWidth="3" />
      <rect x="12" y="44" width="76" height="6" fill="#8A4A1E" />
      <rect x="43" y="38" width="14" height="18" rx="3" fill="#FFD84D" stroke="#3A2A6B" strokeWidth="2.5" />
    </svg>
  );
}
