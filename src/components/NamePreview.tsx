"use client";

import { useEffect, useId, useRef, useState } from "react";
import gsap from "gsap";
import { Dino, Star } from "./characters";
import { ArrowCurl } from "./doodles";
import { Wave } from "./Wave";

const subtitles = ["i mali triceratops", "i svemirska avantura", "i potraga za blagom"];
const DEFAULT_NAME = "Luka";

const capitalize = (s: string) => (s ? s[0].toLocaleUpperCase("sr") + s.slice(1) : s);

/* The parent types a name and the opening title card of "their" film plays
   it, letter by letter. */
export function NamePreview() {
  const [name, setName] = useState("");
  const [sub, setSub] = useState(0);
  const card = useRef<HTMLDivElement>(null);
  const inputId = useId();

  const shown = capitalize(name.trim()) || DEFAULT_NAME;

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-letter]",
        { y: 36, scale: 0, rotate: -18, opacity: 0 },
        { y: 0, scale: 1, rotate: 0, opacity: 1, stagger: 0.045, duration: 0.5, ease: "back.out(2.2)" },
      );
      gsap.fromTo("[data-sub]", { y: 14, opacity: 0 }, { y: 0, opacity: 1, delay: 0.25, duration: 0.4 });
      gsap.fromTo(
        "[data-spark]",
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, stagger: 0.07, duration: 0.45, ease: "back.out(3)" },
      );
    }, card);
    return () => ctx.revert();
  }, [shown, sub]);

  return (
    <section aria-labelledby="ime-title" className="relative bg-sky-soft pb-24 pt-16 md:pb-32">
      <Wave fill="var(--color-sky-soft)" />
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 md:grid-cols-[1fr_1.3fr]">
        <div>
          <p className="eyebrow">probajte odmah</p>
          <h2 id="ime-title" className="mt-2 text-4xl font-extrabold leading-[1.05] sm:text-5xl">
            Upišite ime i pogledajte početak filma
          </h2>
          <p className="mt-4 text-lg text-grape-soft">
            Svaki film počinje animiranom najavnom špicom sa imenom vašeg djeteta. Upišite ga i pogledajte kako izgleda.
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
              {subtitles.map((s, i) => (
                <button
                  key={s}
                  type="button"
                  aria-pressed={sub === i}
                  onClick={() => setSub(i)}
                  className="rounded-full border-[3px] border-grape px-4 py-1.5 font-semibold transition-transform duration-200 hover:-translate-y-0.5 aria-pressed:bg-sun"
                >
                  {s.replace(/^i /, "")}
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
            className="relative flex aspect-video flex-col items-center justify-center overflow-hidden rounded-[2rem] border-4 border-grape bg-grape px-4 text-center shadow-sticker-lg"
            aria-live="polite"
          >
            <Star className="absolute left-[7%] top-[12%] w-10 md:w-12" />
            <span data-spark className="absolute right-[10%] top-[14%] block">
              <Star className="w-7 md:w-9" />
            </span>
            <span data-spark className="absolute left-[16%] bottom-[16%] block">
              <Star className="w-6 md:w-8" />
            </span>
            <span data-spark className="absolute right-[30%] bottom-[10%] block">
              <Star className="w-5 md:w-6" />
            </span>

            <p className="font-display text-base font-semibold text-sun md:text-lg">Vaky Kids predstavlja</p>
            <p
              className="mt-1 max-w-full break-words font-display text-5xl font-bold leading-none text-white sm:text-6xl md:text-7xl"
              aria-label={shown}
            >
              {Array.from(shown).map((ch, i) => (
                <span key={`${shown}-${i}`} data-letter className="inline-block" aria-hidden="true">
                  {ch === " " ? " " : ch}
                </span>
              ))}
            </p>
            <p data-sub className="mt-3 font-display text-xl font-medium text-lilac md:text-2xl">
              {subtitles[sub]}
            </p>
          </div>
          <Dino className="absolute -bottom-8 -right-3 w-28 md:-right-8 md:w-36" />
        </div>
      </div>
    </section>
  );
}
