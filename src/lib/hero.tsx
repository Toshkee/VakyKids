"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { AdventureId } from "@/content/adventures";

/* One name and one adventure for the whole page. The parent types the name
   once (in the hero, the holiday section or the order wizard) and every part
   of the page uses it. Kept for the visit in sessionStorage, nowhere else. */

export const DEFAULT_NAME = "Luka";
const KEY = "vk:hero";

type HeroState = {
  /* What the parent typed, as typed. */
  raw: string;
  setRaw: (v: string) => void;
  adventure: AdventureId;
  setAdventure: (a: AdventureId) => void;
};

const Ctx = createContext<HeroState | null>(null);

export const capitalize = (s: string) => (s ? s[0].toLocaleUpperCase("sr") + s.slice(1) : s);

export function HeroProvider({ children }: { children: ReactNode }) {
  const [raw, setRawState] = useState("");
  const [adventure, setAdventureState] = useState<AdventureId>("dino");

  useEffect(() => {
    try {
      // Restoring from storage has to wait until after hydration, so this
      // one-time read sets state in an effect on purpose.
      const saved = JSON.parse(sessionStorage.getItem(KEY) ?? "null");
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (typeof saved?.raw === "string") setRawState(saved.raw);
      if (saved?.adventure) setAdventureState(saved.adventure);
    } catch {
      // Private mode or blocked storage: start empty.
    }
  }, []);

  // Saved only when the parent changes something, never on load, so a
  // restore can't be overwritten by the empty starting state.
  const value = useMemo(() => {
    const save = (next: { raw: string; adventure: AdventureId }) => {
      try {
        sessionStorage.setItem(KEY, JSON.stringify(next));
      } catch {
        // Not saving is fine.
      }
    };
    return {
      raw,
      adventure,
      setRaw: (v: string) => {
        setRawState(v);
        save({ raw: v, adventure });
      },
      setAdventure: (a: AdventureId) => {
        setAdventureState(a);
        save({ raw, adventure: a });
      },
    };
  }, [raw, adventure]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useHero() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useHero needs <HeroProvider>");
  const name = capitalize(c.raw.trim());
  return { ...c, name, shown: name || DEFAULT_NAME };
}
