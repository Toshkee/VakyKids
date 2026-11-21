"use client";

import { useId, useState, type FormEvent } from "react";
import { ArrowDown, Play } from "lucide-react";
import { adventureById, adventures } from "@/content/adventures";
import { useHero } from "@/lib/hero";
import { Cloud } from "./characters";
import { Sparkle, Squiggle } from "./doodles";
import { Floaty } from "./Floaty";
import { Spica } from "./Spica";

const proof = ["Napravljeno u Podgorici", "Originalni likovi", "Gotovo za 5 dana"];

/* Name first: the parent types the child's name, presses play, the curtains
   open and the opening of "their" cartoon plays with that name. The same name
   then follows them through the page. */
export function Hero() {
  const { raw, setRaw, name, shown, adventure, setAdventure } = useHero();
  const [signal, setSignal] = useState(0);
  const inputId = useId();
  const adv = adventureById(adventure);
  const play = () => setSignal((n) => n + 1);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    (document.activeElement as HTMLElement | null)?.blur();
    play();
  };

  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden pb-24 pt-4 md:pb-32 lg:pt-12">
      <Floaty speed={0.3} slow className="left-[44%] top-2 hidden w-32 opacity-90 lg:block">
        <Cloud />
      </Floaty>

      <div className="relative mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)] gap-x-12 gap-y-7 px-4 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.15fr)] lg:grid-rows-[auto_1fr]">
        {/* Title and the name field. On phones this all fits on the first screen. */}
        <div className="lg:col-start-1 lg:row-start-1">
          <p className="eyebrow mb-3 flex items-center gap-2">
            <Sparkle className="size-5 text-sun" />
            personalizovani crtani filmovi
          </p>
          <h1 id="hero-title" className="text-[2.6rem] font-extrabold leading-[1.02] tracking-[-0.01em] sm:text-6xl lg:text-[4rem]">
            Vaše dijete — glavni junak{" "}
            <span className="relative whitespace-nowrap text-coral-deep">
              crtanog filma
              <Squiggle className="absolute -bottom-2 left-0 h-3 w-full text-sun" />
            </span>
          </h1>

          <form onSubmit={onSubmit} className="mt-7">
            <label htmlFor={inputId} className="block font-display text-xl font-bold sm:text-2xl">
              Kako se zove vaš mali junak?
            </label>
            <div className="mt-3 flex items-stretch gap-2 rounded-[1.4rem] border-[3px] border-grape bg-white p-1.5 shadow-sticker focus-within:shadow-[5px_5px_0_0_var(--color-coral-deep)]">
              <input
                id={inputId}
                type="text"
                value={raw}
                onChange={(e) => setRaw(e.target.value)}
                maxLength={14}
                autoComplete="off"
                autoCapitalize="words"
                enterKeyHint="go"
                placeholder="npr. Luka"
                className="min-w-0 flex-1 bg-transparent px-3 font-display text-2xl font-bold outline-none placeholder:text-grape/35"
              />
              <button type="submit" className="btn btn-primary btn-sm shrink-0 !rounded-2xl !px-4 !py-3 !text-base sm:!px-5">
                <Play className="size-4 fill-white" aria-hidden="true" />
                Pusti
              </button>
            </div>
            <p className="mt-2.5 text-sm font-semibold text-grape-soft">
              Ime ostaje samo na vašem telefonu dok ne pošaljete narudžbu.
            </p>
          </form>
        </div>

        {/* The screen. */}
        <div className="mx-auto w-full max-w-2xl lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:max-w-none lg:self-center">
          <Spica theme={adv} name={shown} autoplay={false} playSignal={signal} curtains />
          <div className="mt-4 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]" role="group" aria-label="Avantura">
            {adventures.map((a) => (
              <button
                key={a.id}
                type="button"
                aria-pressed={adventure === a.id}
                onClick={() => {
                  setAdventure(a.id);
                  play();
                }}
                className="shrink-0 rounded-full border-[3px] border-grape bg-white px-4 py-1.5 font-semibold transition-transform duration-200 hover:-translate-y-0.5 aria-pressed:bg-sun"
              >
                {a.chip}
              </button>
            ))}
          </div>
          <p className="mt-3 text-sm font-semibold text-grape-soft" aria-live="polite">
            {name ? `Ovako počinje crtani u kojem je ${name} glavni junak.` : "Upišite ime, pritisnite Pusti i gledajte."}
          </p>
        </div>

        <div className="lg:col-start-1 lg:row-start-2">
          <p className="max-w-lg text-lg leading-relaxed text-grape-soft">
            Crtani u kojem vaše dijete spašava, leti i istražuje. Sa svojim imenom, omiljenim stvarima i naracijom na
            našem jeziku.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a href="#naruci" className="btn btn-primary sticker w-full sm:w-auto">
              Napravimo crtani
            </a>
            <a href="#primjer" className="btn btn-secondary sticker w-full sm:w-auto">
              <ArrowDown className="size-5" aria-hidden="true" />
              Pogledaj pravi crtani
            </a>
          </div>
          <ul className="mt-7 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.95rem] font-bold text-grape-soft">
            {proof.map((p, i) => (
              <li key={p} className="flex items-center gap-3">
                {i > 0 && <Sparkle className="size-3 text-coral" />}
                {p}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
