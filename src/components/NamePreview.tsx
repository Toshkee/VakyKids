"use client";

import { useId, useState } from "react";
import { ArrowCurl } from "./doodles";
import { Spica, type SpicaTheme } from "./Spica";
import { Wave } from "./Wave";

const DEFAULT_NAME = "Luka";

const capitalize = (s: string) => (s ? s[0].toLocaleUpperCase("sr") + s.slice(1) : s);

type Adventure = SpicaTheme & { chip: string };

/* The three openings visitors can try. The dino one is built from the shots
   of a real film's opening; the other two are painted in the same style. */
const adventures: Adventure[] = [
  {
    id: "dino",
    chip: "Dinosaurusi",
    subtitle: "i spašavanje dinosaurusa!",
    subStroke: "#3d8a2a",
    journey: ["/spica/dino/sunrise.webp", "/spica/dino/valley.webp"],
    hero: { src: "/spica/dino/egg.webp", kind: "egg", x: 58, y: 34, w: 26, h: 44 },
    titleTop: 14,
    confetti: ["#FFD84D", "#FF8A7A", "#7ED9A6", "#7FD3F7", "#C9B8FF", "#FFB3C1"],
  },
  {
    id: "svemir",
    chip: "Svemir",
    subtitle: "i putovanje do zvijezda!",
    subStroke: "#5a2d9c",
    journey: ["/spica/svemir/journey.webp"],
    hero: { src: "/spica/svemir/rocket.webp", kind: "rocket", x: 50, y: 62, w: 23, h: 43 },
    titleTop: 9,
    confetti: ["#FFD84D", "#7FD3F7", "#C9B8FF", "#FFB3C1", "#ffffff"],
  },
  {
    id: "blago",
    chip: "Potraga za blagom",
    subtitle: "i potraga za blagom!",
    subStroke: "#1c6fa8",
    journey: ["/spica/blago/journey.webp"],
    hero: { src: "/spica/blago/chest.webp", kind: "chest", x: 51, y: 63, w: 30, h: 35 },
    titleTop: 11,
    confetti: ["#FFD84D", "#F5B800", "#FFE38A", "#FF8A7A", "#7FD3F7"],
  },
];

/* The parent types a name and picks an adventure; the opening titles of
   "their" film play with that name. */
export function NamePreview() {
  const [name, setName] = useState("");
  const [adv, setAdv] = useState(0);
  const inputId = useId();

  const shown = capitalize(name.trim()) || DEFAULT_NAME;

  return (
    <section aria-labelledby="ime-title" className="relative bg-sky-soft pb-24 pt-16 md:pb-32">
      <Wave fill="var(--color-sky-soft)" />
      <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)] items-center gap-10 px-4 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.4fr)]">
        <div>
          <p className="eyebrow">probajte odmah</p>
          <h2 id="ime-title" className="mt-2 text-4xl font-extrabold leading-[1.05] sm:text-5xl">
            Upišite ime i pogledajte početak crtanog
          </h2>
          <p className="mt-4 text-lg text-grape-soft">
            Svaki crtani počinje uvodnom špicom, a na kraju špice izleti ime vašeg djeteta. Upišite ime, izaberite
            avanturu i pogledajte.
          </p>
          <label htmlFor={inputId} className="mt-8 block font-display text-lg font-semibold">
            Ime djeteta
          </label>
          <input
            id={inputId}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={14}
            autoComplete="off"
            placeholder={DEFAULT_NAME}
            className="mt-2 w-full rounded-2xl border-[3px] border-grape bg-white px-5 py-3.5 font-display text-2xl font-bold shadow-sticker outline-none placeholder:text-grape/35 focus-visible:shadow-[5px_5px_0_0_var(--color-coral-deep)]"
          />
          <fieldset className="mt-6">
            <legend className="font-display text-lg font-semibold">Avantura</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {adventures.map((x, i) => (
                <button
                  key={x.id}
                  type="button"
                  aria-pressed={adv === i}
                  onClick={() => setAdv(i)}
                  className="rounded-full border-[3px] border-grape bg-white/60 px-4 py-1.5 font-semibold transition-transform duration-200 hover:-translate-y-0.5 aria-pressed:bg-sun"
                >
                  {x.chip}
                </button>
              ))}
            </div>
          </fieldset>
        </div>

        <div className="relative">
          <p className="hand absolute -top-10 right-6 z-10 hidden rotate-[3deg] text-2xl text-grape md:block">
            ovako počinje crtani
          </p>
          <ArrowCurl className="absolute -top-4 right-[-1.5rem] z-10 hidden w-14 rotate-[40deg] text-grape md:block" />
          <Spica theme={adventures[adv]} name={shown} />
          <p className="mt-4 text-center text-sm font-semibold text-grape-soft">
            Špica traje desetak sekundi. U pravom crtanom ide uz muziku.
          </p>
        </div>
      </div>
    </section>
  );
}
