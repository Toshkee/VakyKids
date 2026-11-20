import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

/* True when the visitor asked for less motion. False on the server. */
export function useReducedMotion() {
  return useSyncExternalStore(
    (cb) => {
      const m = window.matchMedia(QUERY);
      m.addEventListener("change", cb);
      return () => m.removeEventListener("change", cb);
    },
    () => window.matchMedia(QUERY).matches,
    () => false,
  );
}
