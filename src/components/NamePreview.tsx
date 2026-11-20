"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import gsap from "gsap";
import { Balloon, Chest, Cloud, Dino, Planet, Rocket, Star } from "./characters";
import { ArrowCurl, Sparkle } from "./doodles";
import { Wave } from "./Wave";

const DEFAULT_NAME = "Luka";

const capitalize = (s: string) => (s ? s[0].toLocaleUpperCase("sr") + s.slice(1) : s);

type Adventure = {
  id: string;
  chip: string;
  subtitle: string;
  bg: string;
  subColor: string;
  scene: ReactNode;
};

/* Each adventure is its own little title-card scene. Elements marked
   data-deco fly in whenever the adventure changes. */
const adventures: Adventure[] = [
  {
    id: "dino",
    chip: "Dinosaurusi",
    subtitle: "i mali triceratops",
    bg: "#1E5E4A",
    subColor: "#C8F5DC",
    scene: (
      <>
        <span data-deco className="absolute right-[9%] top-[11%] block aspect-square w-[8%] rounded-full bg-sun" />
        <span data-deco className="absolute left-[6%] top-[14%] block w-[16%]">
          <Cloud />
        </span>
        <span data-deco className="absolute -left-[6%] bottom-0 block h-[30%] w-[48%] rounded-t-[100%] bg-[#2E8B63]" />
        <span data-deco className="absolute -right-[4%] bottom-0 block h-[22%] w-[62%] rounded-t-[100%] bg-[#3FA877]" />
        <span data-deco className="absolute bottom-[5%] right-[7%] block w-[24%]">
          <Dino className="animate-bob" />
        </span>
        <span data-deco className="absolute bottom-[10%] left-[9%] block w-[7%]">
          <Balloon color="#FFD84D" />
        </span>
      </>
    ),
  },
  {
    id: "svemir",
    chip: "Svemir",
    subtitle: "i svemirska avantura",
    bg: "#1B1446",
    subColor: "#CECBF6",
    scene: (
      <>
        {[
          "left-[8%] top-[12%] w-[6%]",
          "right-[34%] top-[8%] w-[4%]",
          "left-[22%] bottom-[18%] w-[4%]",
          "right-[8%] bottom-[30%] w-[5%]",
        ].map((pos) => (
          <span key={pos} data-deco className={`absolute block ${pos}`}>
            <Star />
          </span>
        ))}
        <span data-deco className="absolute -right-[3%] -top-[4%] block w-[30%]">
          <Planet />
        </span>
        <span data-deco className="absolute bottom-[8%] left-[6%] block w-[10%] rotate-[35deg]">
          <Rocket />
        </span>
        <span data-deco className="absolute -bottom-[14%] right-[18%] block aspect-square w-[20%] rounded-full bg-[#5B4B8A]" />
      </>
    ),
  },
  {
    id: "blago",
    chip: "Potraga za blagom",
    subtitle: "i potraga za blagom",
    bg: "#0E5A86",
    subColor: "#BFE6FF",
    scene: (
      <>
        <span data-deco className="absolute left-[7%] top-[12%] block w-[15%]">
          <Cloud />
        </span>
        <span data-deco className="absolute right-[10%] top-[10%] block aspect-square w-[7%] rounded-full bg-sun" />
        <span data-deco className="absolute -bottom-[6%] right-[2%] block h-[30%] w-[40%] rounded-t-[100%] bg-[#F5D488]" />
        <span data-deco className="absolute bottom-[8%] right-[10%] block w-[18%]">
          <Chest />
        </span>
        {["right-[31%] bottom-[30%]", "right-[6%] bottom-[34%]"].map((pos) => (
          <span key={pos} data-deco className={`absolute block w-[4%] text-sun ${pos}`}>
            <Sparkle />
          </span>
        ))}
        <svg
          data-deco
          viewBox="0 0 400 40"
          preserveAspectRatio="none"
          className="absolute bottom-0 left-0 h-[16%] w-[70%]"
          aria-hidden="true"
        >
          <path d="M0 20 C 40 0 80 40 120 20 S 200 0 240 20 S 320 40 400 20 V40 H0 Z" fill="#2B8CC4" />
        </svg>
      </>
    ),
  },
];

/* The parent types a name and picks an adventure; the opening title card of
   "their" film plays it. */
export function NamePreview() {
  const [name, setName] = useState("");
  const [adv, setAdv] = useState(0);
  const card = useRef<HTMLDivElement>(null);
  const inputId = useId();

  const shown = capitalize(name.trim()) || DEFAULT_NAME;
  const a = adventures[adv];

  // Letters pop in on every name or adventure change.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-letter]",
        { y: 36, scale: 0, rotate: -18, opacity: 0 },
        { y: 0, scale: 1, rotate: 0, opacity: 1, stagger: 0.045, duration: 0.5, ease: "back.out(2.2)" },
      );
    }, card);
    return () => ctx.revert();
  }, [shown, adv]);

  // The scene flies in on every adventure change.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-deco]",
        { y: 40, scale: 0.6, opacity: 0 },
        { y: 0, scale: 1, opacity: 1, stagger: 0.06, duration: 0.55, ease: "back.out(1.8)" },
      );
      gsap.fromTo("[data-sub]", { y: 14, opacity: 0 }, { y: 0, opacity: 1, delay: 0.25, duration: 0.4 });
    }, card);
    return () => ctx.revert();
  }, [adv]);

  return (
    <section aria-labelledby="ime-title" className="relative bg-sky-soft pb-24 pt-16 md:pb-32">
      <Wave fill="var(--color-sky-soft)" />
      <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)] items-center gap-10 px-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
        <div>
          <p className="eyebrow">probajte odmah</p>
          <h2 id="ime-title" className="mt-2 text-4xl font-extrabold leading-[1.05] sm:text-5xl">
            Upišite ime i pogledajte početak filma
          </h2>
          <p className="mt-4 text-lg text-grape-soft">
            Svaki film počinje animiranom najavnom špicom sa imenom vašeg djeteta. Upišite ime, izaberite avanturu i
            pogledajte kako izgleda.
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

        <div ref={card} className="relative">
          <p className="hand absolute -top-10 right-6 z-10 hidden rotate-[3deg] text-2xl text-grape md:block">
            ovako počinje film
          </p>
          <ArrowCurl className="absolute -top-4 right-[-1.5rem] z-10 hidden w-14 rotate-[40deg] text-grape md:block" />
          <div
            className="relative aspect-video overflow-hidden rounded-[2rem] border-4 border-grape shadow-sticker-lg transition-colors duration-500"
            style={{ backgroundColor: a.bg }}
          >
            <div key={a.id} className="absolute inset-0" aria-hidden="true">
              {a.scene}
            </div>
            <div
              className="relative z-10 flex h-full flex-col items-center justify-center px-4 pb-[6%] text-center"
              aria-live="polite"
            >
              <p className="font-display text-sm font-semibold text-sun sm:text-base md:text-lg">Vaky Kids predstavlja</p>
              <p
                className="mt-1 max-w-full break-words font-display text-5xl font-extrabold leading-none text-white drop-shadow-[0_3px_0_rgba(35,26,69,0.45)] sm:text-6xl md:text-7xl"
                aria-label={shown}
              >
                {Array.from(shown).map((ch, i) => (
                  <span key={`${shown}-${adv}-${i}`} data-letter className="inline-block" aria-hidden="true">
                    {ch === " " ? " " : ch}
                  </span>
                ))}
              </p>
              <p
                data-sub
                className="mt-2 font-display text-lg font-semibold sm:text-xl md:text-2xl"
                style={{ color: a.subColor }}
              >
                {a.subtitle}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
