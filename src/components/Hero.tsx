import { Play } from "lucide-react";
import { site } from "@/config/site";
import { Balloon, Cloud, Dino, Star } from "./characters";
import { ArrowCurl, Sparkle, Squiggle } from "./doodles";
import { Floaty } from "./Floaty";
import { LoopVideo } from "./LoopVideo";

const proof = ["Napravljeno u Podgorici", "Originalni likovi", "Gotovo za 5 dana"];

/* Row of sprocket holes along a film edge. */
function Sprockets() {
  return (
    <div className="flex justify-between px-3 py-1.5" aria-hidden="true">
      {Array.from({ length: 14 }, (_, i) => (
        <span key={i} className="h-2.5 w-4 rounded-[3px] bg-cream/80" />
      ))}
    </div>
  );
}

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden pb-28 pt-6 md:pb-36 md:pt-14">
      <Floaty speed={1} slow className="right-[3%] top-0 hidden w-14 sm:block">
        <Balloon color="#7FD3F7" />
      </Floaty>
      <Floaty speed={0.3} slow className="left-[42%] top-2 hidden w-32 opacity-90 lg:block">
        <Cloud />
      </Floaty>

      <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-4 md:grid-cols-[1.05fr_1fr] md:gap-10">
        <div>
          <p className="eyebrow mb-4 flex items-center gap-2">
            <Sparkle className="size-5 text-sun" />
            personalizovani crtani filmovi
          </p>
          <h1 id="hero-title" className="text-[2.75rem] font-extrabold leading-[1.02] tracking-[-0.01em] sm:text-6xl lg:text-[4.25rem]">
            Vaše dijete — glavni junak{" "}
            <span className="relative whitespace-nowrap text-coral-deep">
              crtanog filma
              <Squiggle className="absolute -bottom-2 left-0 h-3 w-full text-sun" />
            </span>
          </h1>
          <p className="mt-7 max-w-lg text-lg leading-relaxed text-grape-soft sm:text-xl">
            Animirani film u kojem vaše dijete spašava, leti i istražuje. Sa svojim imenom, omiljenim stvarima i
            naracijom na našem jeziku.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <a href="#naruci" className="btn btn-primary sticker animate-wiggle">
              Naruči film
            </a>
            <a href="#primjer" className="btn btn-secondary sticker">
              <Play className="size-5" aria-hidden="true" />
              Pogledaj primjer
            </a>
          </div>
          <ul className="mt-9 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.95rem] font-bold text-grape-soft">
            {proof.map((p, i) => (
              <li key={p} className="flex items-center gap-3">
                {i > 0 && <Sparkle className="size-3 text-coral" />}
                {p}
              </li>
            ))}
          </ul>
        </div>

        <div id="primjer" className="relative scroll-mt-10">
          <p className="hand absolute -top-11 left-2 z-10 rotate-[-4deg] text-2xl text-grape md:-left-6 md:-top-12 md:text-[1.7rem]">
            prvi film: za rođendan mog sestrića
          </p>
          <ArrowCurl className="absolute -top-6 right-[12%] z-10 hidden w-16 rotate-[8deg] text-grape md:block" />

          {/* The "screen": a strip of film with the teaser inside. */}
          <div className="sticker rotate-[1.2deg] overflow-hidden rounded-[1.75rem] border-[3px] border-grape bg-ink shadow-sticker-lg">
            <Sprockets />
            <div className="relative mx-3 aspect-video overflow-hidden rounded-xl">
              {site.teaser ? (
                <LoopVideo
                  eager
                  src={site.teaser.mp4}
                  poster={site.teaser.poster}
                  label="Isječak iz filma: dječak jaše dinosaurusa, grli malog triceratopsa i slavi drugi rođendan"
                />
              ) : (
                <div className="relative h-full w-full bg-sky">
                  <Cloud className="absolute left-[8%] top-[10%] w-24 opacity-90" />
                  <Cloud className="absolute right-[6%] top-[22%] w-16 opacity-80" />
                  <Star className="absolute right-[24%] top-[8%] w-8" />
                  <div className="absolute inset-x-0 bottom-0 h-[30%] rounded-t-[50%_30%] bg-mint" />
                  <Dino className="absolute bottom-[10%] left-1/2 w-[40%] -translate-x-1/2 animate-bob" />
                  <span className="absolute left-1/2 top-[36%] flex size-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-[3px] border-grape bg-white shadow-sticker">
                    <Play className="ml-1 size-7 fill-grape" aria-hidden="true" />
                  </span>
                </div>
              )}
            </div>
            <Sprockets />
            <div className="flex items-center justify-between gap-3 border-t-2 border-dashed border-cream/25 px-5 py-3 text-cream">
              <p className="truncate font-display text-base font-semibold leading-tight sm:text-lg">
                {site.filmTitle} <span className="font-sans text-sm font-semibold text-cream/70">· 3:10</span>
              </p>
              <p className="whitespace-nowrap rounded-full bg-sun px-3 py-0.5 text-xs font-extrabold text-ink sm:text-sm">
                {site.teaser ? "Pravi film" : "Isječak stiže uskoro"}
              </p>
            </div>
          </div>

          <Floaty speed={0.8} className="-bottom-10 -left-5 w-14 md:-left-10 md:w-[4.5rem]">
            <Star />
          </Floaty>
        </div>
      </div>
    </section>
  );
}
